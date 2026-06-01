import { Rocket, Upload, FolderArchive, Activity, CheckCircle, AlertCircle, Download, FileCode2, Github, ExternalLink, Cloud, Clock, Trash2, History } from "lucide-react";
import React, { useState, useRef, useEffect } from "react";
import { motion, AnimatePresence } from "motion/react";
import { saveBuild, getBuilds, deleteBuild, BuildRecord } from "../lib/idb";

export default function ReactBuilder() {
  const [file, setFile] = useState<File | null>(null);
  const [status, setStatus] = useState<"idle" | "uploading" | "building" | "success" | "error">("idle");
  const [errorMessage, setErrorMessage] = useState("");
  const fileInputRef = useRef<HTMLInputElement>(null);
  
  // History state
  const [history, setHistory] = useState<BuildRecord[]>([]);

  // Environment variables state
  const [envVars, setEnvVars] = useState<{ id: string; key: string; value: string }[]>([]);

  // GitHub state
  const [builtBlob, setBuiltBlob] = useState<Blob | null>(null);
  const [showGithubForm, setShowGithubForm] = useState(false);
  const [ghToken, setGhToken] = useState("");
  const [ghRepo, setGhRepo] = useState("");
  const [ghNewRepo, setGhNewRepo] = useState(false);
  const [ghStatus, setGhStatus] = useState<"idle" | "pushing" | "success" | "error">("idle");
  const [ghUrl, setGhUrl] = useState("");
  const [ghError, setGhError] = useState("");

  useEffect(() => {
    loadHistory();
  }, []);

  const loadHistory = async () => {
    try {
      const records = await getBuilds();
      setHistory(records.sort((a, b) => b.timestamp - a.timestamp));
    } catch (err) {
      console.error("Failed to load history", err);
    }
  };

  const addEnvVar = () => {
    setEnvVars([...envVars, { id: Date.now().toString(), key: "", value: "" }]);
  };

  const removeEnvVar = (id: string) => {
    setEnvVars(envVars.filter(ev => ev.id !== id));
  };

  const updateEnvVar = (id: string, field: "key" | "value", val: string) => {
    setEnvVars(envVars.map(ev => ev.id === id ? { ...ev, [field]: val } : ev));
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      setFile(e.target.files[0]);
      setStatus("idle");
      setErrorMessage("");
      setBuiltBlob(null);
      setShowGithubForm(false);
      setGhStatus("idle");
    }
  };

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      const droppedFile = e.dataTransfer.files[0];
      if (droppedFile.name.endsWith('.zip')) {
         setFile(droppedFile);
         setStatus("idle");
         setErrorMessage("");
         setBuiltBlob(null);
         setShowGithubForm(false);
         setGhStatus("idle");
      } else {
         setErrorMessage("لطفاً یک فایل zip بارگذاری کنید");
         setStatus("error");
      }
    }
  };

  const triggerDownload = (blob: Blob, name: string) => {
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = name;
    document.body.appendChild(a);
    a.click();
    a.remove();
    window.URL.revokeObjectURL(url);
  };

  const handleBuild = async () => {
    if (!file) return;

    setStatus("uploading");
    const formData = new FormData();
    formData.append("project", file);

    const validEnvVars = envVars.filter(ev => ev.key.trim() !== "");
    if (validEnvVars.length > 0) {
      formData.append("envVars", JSON.stringify(validEnvVars));
    }

    try {
      setStatus("building");
      const response = await fetch("/api/build", {
        method: "POST",
        body: formData,
      });

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({ error: "Build failed" }));
        throw new Error(errorData.error || `خطای HTTP! وضعیت: ${response.status}`);
      }

      const blob = await response.blob();
      setBuiltBlob(blob);
      
      const record: BuildRecord = {
        id: Date.now().toString(),
        name: file.name,
        timestamp: Date.now(),
        blob: blob,
        size: blob.size,
      };
      
      await saveBuild(record);
      await loadHistory();
      
      triggerDownload(blob, "build.zip");
      setStatus("success");
    } catch (err: any) {
      setErrorMessage(err.message || "خطای ناشناخته‌ای رخ داده است.");
      setStatus("error");
    }
  };

  const handleHistoryDownload = (record: BuildRecord) => {
    setBuiltBlob(record.blob);
    setStatus("success");
    setShowGithubForm(false);
    triggerDownload(record.blob, "build.zip");
  };

  const handleHistoryDelete = async (id: string) => {
    await deleteBuild(id);
    await loadHistory();
  };

  const handlePushToGithub = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!builtBlob || !ghToken || !ghRepo) return;

    setGhStatus("pushing");
    setGhError("");

    const formData = new FormData();
    formData.append("buildZip", builtBlob, "build.zip");
    formData.append("token", ghToken);
    formData.append("repoName", ghRepo);
    formData.append("isNewRepo", String(ghNewRepo));

    try {
      const response = await fetch("/api/github/push", {
        method: "POST",
        body: formData,
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || "خطا در اتصال به گیت‌هاب");
      }

      setGhUrl(data.url);
      setGhStatus("success");
    } catch (err: any) {
      setGhError(err.message || "در حین ارسال خطایی رخ داد.");
      setGhStatus("error");
    }
  };

  return (
    <div className="flex flex-col xl:flex-row items-start justify-center gap-8 w-full max-w-6xl mx-auto py-8">
      {/* Main Builder Section */}
      <div className="flex-1 w-full flex flex-col items-center">
        <div className="text-center mb-10 space-y-4">
          <h2 className="text-3xl md:text-4xl font-extrabold text-white tracking-tight leading-tight drop-shadow-xl inline-flex items-center justify-center gap-3">
            <Rocket className="w-8 h-8 text-blue-500" />
            سامانه ساخت <span className="text-transparent bg-clip-text bg-gradient-to-l from-blue-400 to-indigo-400">ری‌اکت ابری</span>
          </h2>
          <p className="text-lg text-slate-400 max-w-2xl mx-auto">
            پروژه React خود را کامپایل کنید، خروجی را دریافت نمایید و روی GitHub مستقر کنید.
          </p>
        </div>

        <div className="w-full bg-slate-900 border border-slate-800/80 rounded-3xl overflow-hidden shadow-2xl backdrop-blur-sm">
          <div className="p-8 md:p-12">
            <motion.div 
              className={`relative overflow-hidden border-2 border-dashed rounded-3xl p-12 text-center transition-all cursor-pointer ${
                file ? "border-blue-500/50 bg-blue-900/10 shadow-[0_0_30px_rgba(59,130,246,0.1)]" : "border-slate-700 hover:border-slate-500 bg-slate-800/30"
              }`}
              onClick={() => fileInputRef.current?.click()}
              onDragOver={handleDragOver}
              onDrop={handleDrop}
              whileHover={{ scale: 1.01 }}
              whileTap={{ scale: 0.99 }}
            >
              <input 
                type="file" 
                accept=".zip" 
                className="hidden" 
                ref={fileInputRef}
                onChange={handleFileChange}
              />
              <AnimatePresence mode="wait">
                {file ? (
                  <motion.div 
                    key="file-selected"
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, scale: 0.95 }}
                    className="flex flex-col items-center space-y-5"
                  >
                    <div className="w-24 h-24 bg-gradient-to-br from-blue-900 to-indigo-900 text-blue-300 rounded-3xl flex items-center justify-center shadow-[0_0_40px_rgba(59,130,246,0.2)]">
                      <FolderArchive className="w-12 h-12" />
                    </div>
                    <div>
                      <h3 className="font-bold text-white text-2xl drop-shadow-md">{file.name}</h3>
                      <p className="text-base text-indigo-300 font-mono mt-2 bg-indigo-950/50 inline-block px-3 py-1 rounded-lg border border-indigo-500/20" dir="ltr">{(file.size / 1024 / 1024).toFixed(2)} MB</p>
                    </div>
                  </motion.div>
                ) : (
                  <motion.div 
                    key="no-file"
                    initial={{ opacity: 0, y: -10 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, scale: 0.95 }}
                    className="flex flex-col items-center space-y-6"
                  >
                    <div className="w-24 h-24 bg-slate-800 text-slate-400 rounded-3xl flex items-center justify-center shadow-inner relative group">
                      <div className="absolute inset-0 bg-blue-500 blur-xl opacity-0 group-hover:opacity-20 transition-opacity rounded-3xl"></div>
                      <Upload className="w-10 h-10 relative z-10 group-hover:scale-110 transition-transform" />
                    </div>
                    <div>
                      <h3 className="text-xl font-bold text-slate-200 mb-3">برای بارگذاری کلیک کنید یا فایل را اینجا رها کنید</h3>
                      <p className="text-base text-slate-400">
                        پروژه آپلودی باید شامل فایل <span className="font-mono bg-slate-950 px-2 py-1 rounded-md text-sm border border-slate-800 text-indigo-300">package.json</span> باشد
                      </p>
                      <p className="text-sm text-slate-500 mt-2">حداکثر حجم فایل ZIP مجاز - ۵۰ مگابایت</p>
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </motion.div>

            <div className="mt-10">
              <AnimatePresence mode="wait">
                {status === "idle" && file && (
                  <motion.div
                    key="btn-build-container"
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, height: 0 }}
                    className="space-y-6"
                  >
                    <div className="bg-slate-800/40 border border-slate-700 rounded-2xl p-6">
                      <div className="flex items-center justify-between mb-4">
                        <h4 className="text-lg font-bold text-slate-200">متغیرهای محیطی (.env)</h4>
                        <button 
                          onClick={addEnvVar}
                          className="text-sm px-3 py-1.5 bg-indigo-500/10 hover:bg-indigo-500/20 text-indigo-400 rounded-lg transition-colors border border-indigo-500/20 font-bold"
                        >
                          + افزودن متغیر
                        </button>
                      </div>
                      
                      {envVars.length === 0 ? (
                        <p className="text-sm text-slate-500">متغیرهای محیطی ضروری برای بیلد پروژه را اینجا تنظیم کنید.</p>
                      ) : (
                        <div className="space-y-3">
                          {envVars.map(ev => (
                            <div key={ev.id} className="flex flex-col sm:flex-row items-center gap-3">
                              <input 
                                type="text" 
                                placeholder="KEY (e.g. VITE_API_KEY)" 
                                value={ev.key}
                                onChange={(e) => updateEnvVar(ev.id, 'key', e.target.value)}
                                className="w-full sm:flex-1 bg-slate-950 border border-slate-700 rounded-lg px-4 py-2 text-slate-300 font-mono text-sm placeholder:text-slate-600 focus:border-indigo-500 focus:outline-none"
                                dir="ltr"
                              />
                              <input 
                                type="text" 
                                placeholder="VALUE" 
                                value={ev.value}
                                onChange={(e) => updateEnvVar(ev.id, 'value', e.target.value)}
                                className="w-full sm:flex-1 bg-slate-950 border border-slate-700 rounded-lg px-4 py-2 text-slate-300 font-mono text-sm placeholder:text-slate-600 focus:border-indigo-500 focus:outline-none"
                                dir="ltr"
                              />
                              <button 
                                onClick={() => removeEnvVar(ev.id)}
                                className="w-full sm:w-auto p-2 bg-slate-800 hover:bg-red-500/20 text-slate-500 hover:text-red-400 rounded-lg transition-colors border border-slate-700 hover:border-red-500/30 flex items-center justify-center gap-2"
                              >
                                <Trash2 className="w-4 h-4" />
                                <span className="sm:hidden text-xs">حذف متغیر</span>
                              </button>
                            </div>
                          ))}
                        </div>
                      )}
                    </div>

                    <button
                      onClick={handleBuild}
                      className="w-full py-5 bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-500 hover:to-indigo-500 text-white rounded-2xl font-bold flex items-center justify-center gap-3 transition-all transform hover:shadow-[0_0_30px_rgba(79,70,229,0.4)] text-lg"
                    >
                      <FileCode2 className="w-6 h-6" />
                      <span>شروع فرآیند کامپایل و ساخت (Build)</span>
                    </button>
                  </motion.div>
                )}

                {(status === "uploading" || status === "building") && (
                  <motion.div
                    key="status-building"
                    initial={{ opacity: 0, scale: 0.95 }}
                    animate={{ opacity: 1, scale: 1 }}
                    className="flex items-start gap-5 p-6 bg-blue-950/40 border border-blue-500/30 rounded-2xl relative overflow-hidden"
                  >
                    <div className="w-12 h-12 rounded-xl bg-blue-900/50 flex items-center justify-center shrink-0 border border-blue-500/30">
                      <Activity className="w-6 h-6 text-blue-400 animate-pulse" />
                    </div>
                    <div className="flex-1 mt-1">
                      <h4 className="text-lg font-bold text-blue-200">
                        {status === "uploading" ? "در حال آپلود..." : "در حال بیلد ابری..."}
                      </h4>
                      <p className="text-base text-blue-300/70 mt-2">
                         صبر کنید تا عملیات انجام شود.
                      </p>
                    </div>
                  </motion.div>
                )}

                {status === "success" && (
                  <motion.div
                    key="status-success"
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="flex flex-col space-y-6"
                  >
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div className="col-span-1 md:col-span-2 flex items-center gap-5 p-6 bg-emerald-950/40 border border-emerald-500/30 rounded-2xl">
                        <div className="w-12 h-12 bg-emerald-500/20 rounded-full flex items-center justify-center shrink-0">
                          <CheckCircle className="w-6 h-6 text-emerald-400" />
                        </div>
                        <div className="flex-1">
                          <h4 className="text-lg font-bold text-emerald-300">بیلد با موفقیت انجام شد!</h4>
                        </div>
                        <button onClick={() => triggerDownload(builtBlob!, "build.zip")} className="flex items-center gap-2 px-4 py-2 bg-emerald-500/20 text-emerald-400 rounded-lg hover:bg-emerald-500/30 transition-colors">
                          <Download className="w-5 h-5"/> دانلود مجدد
                        </button>
                      </div>

                      <button className="flex items-center justify-center gap-2 px-6 py-4 bg-slate-800 text-slate-300 border border-slate-700 rounded-xl hover:bg-slate-700 hover:text-white transition-colors" 
                        onClick={() => alert('لینک پیش‌نمایش پس از استقرار نهایی در گیت‌هاب در دسترس خواهد بود.')}>
                        <ExternalLink className="w-5 h-5"/>
                        تولید پیش‌نمایش (Preview)
                      </button>
                      
                      <button className="flex items-center justify-center gap-2 px-6 py-4 bg-blue-900/40 text-blue-300 border border-blue-500/30 rounded-xl hover:bg-blue-800/60 hover:text-white transition-colors"
                        onClick={() => alert('امکان اشتراک‌گذاری به زودی اضافه می‌شود.')}>
                        <Cloud className="w-5 h-5"/>
                        اشتراک‌گذاری (Share)
                      </button>
                    </div>

                    {!showGithubForm ? (
                      <button
                        onClick={() => setShowGithubForm(true)}
                        className="w-full py-5 bg-slate-800/80 hover:bg-slate-700 border border-slate-600 text-white rounded-2xl font-bold flex items-center justify-center gap-3 transition-colors text-lg"
                      >
                        <Github className="w-6 h-6" />
                        <span>استقرار مستقیم در گیت‌هاب (Deployment)</span>
                      </button>
                    ) : (
                      <div className="p-8 border border-slate-700/80 rounded-2xl bg-slate-800/50 shadow-inner">
                        <h4 className="font-bold text-slate-200 mb-6 flex items-center gap-3 text-xl">
                          <Github className="w-7 h-7 ml-1" /> اتصال حساب گیت‌هاب
                        </h4>
                        {ghStatus === "success" ? (
                          <div className="bg-emerald-950/30 border border-emerald-500/30 rounded-2xl p-8 text-center">
                            <p className="text-xl font-bold text-emerald-300 mb-6 drop-shadow-md">پروژه با موفقیت پوش شد!</p>
                            <a 
                              href={ghUrl} 
                              target="_blank" 
                              rel="noopener noreferrer"
                              className="inline-flex items-center justify-center gap-2 px-8 py-4 bg-slate-900 border border-slate-700 text-white rounded-xl text-md font-bold hover:bg-slate-800 hover:border-slate-500 transition-colors shadow-lg"
                            >
                              مشاهده مخزن <ExternalLink className="w-5 h-5 mr-1" />
                            </a>
                          </div>
                        ) : (
                          <form onSubmit={handlePushToGithub} className="space-y-6">
                             <div>
                               <input 
                                  type="text" value={ghToken} onChange={e=>setGhToken(e.target.value)} required placeholder="Token" dir="ltr"
                                  className="w-full bg-slate-900 border border-slate-700 rounded-xl px-5 py-4 text-slate-300"
                                />
                             </div>
                             <div>
                               <input 
                                  type="text" value={ghRepo} onChange={e=>setGhRepo(e.target.value)} required placeholder="Repo Name" dir="ltr"
                                  className="w-full bg-slate-900 border border-slate-700 rounded-xl px-5 py-4 text-slate-300"
                                />
                             </div>
                             <button type="submit" disabled={ghStatus === "pushing"} className="w-full py-4 bg-white text-slate-900 rounded-xl font-bold">ارسال</button>
                          </form>
                        )}
                      </div>
                    )}
                  </motion.div>
                )}

                {status === "error" && (
                  <motion.div
                    key="status-error"
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="flex items-start gap-4 p-6 bg-red-950/40 border border-red-500/30 rounded-2xl"
                  >
                    <AlertCircle className="w-6 h-6 text-red-500" />
                    <div className="flex-1">
                      <h4 className="text-lg font-bold text-red-400">خطای بیلد</h4>
                      <p className="text-base text-red-300/80 mt-2 font-mono whitespace-pre-wrap" dir="ltr">{errorMessage}</p>
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          </div>
        </div>
      </div>

      {/* History Sidebar */}
      <div className="w-full xl:w-96 flex flex-col xl:h-full pb-8">
        <div className="bg-slate-900/60 border border-slate-800/80 rounded-3xl overflow-hidden backdrop-blur-sm flex flex-col h-full shadow-2xl">
          <div className="p-6 border-b border-slate-800/80 flex items-center justify-between">
            <h3 className="text-lg font-bold text-white flex items-center gap-2">
              <History className="w-5 h-5 text-indigo-400" /> تاریخچه بیلد
            </h3>
            <span className="text-xs bg-slate-800 text-slate-400 px-2.5 py-1 rounded-full font-mono">{history.length}</span>
          </div>
          <div className="flex-1 overflow-y-auto p-4 space-y-3 min-h-[300px]">
            {history.length === 0 ? (
              <div className="flex flex-col items-center justify-center h-full text-center p-6 text-slate-500 space-y-3">
                 <FolderArchive className="w-12 h-12 opacity-20" />
                 <p>هنوز بیلدی انجام نشده است.</p>
              </div>
            ) : (
              history.map(record => (
                <div key={record.id} className="bg-slate-800/40 border border-slate-700/50 hover:border-slate-600 rounded-2xl p-4 transition-colors group">
                  <div className="flex items-start justify-between mb-3">
                    <div className="flex-1 min-w-0 pr-3">
                       <h4 className="text-slate-200 font-bold text-sm truncate" dir="ltr" title={record.name}>{record.name}</h4>
                       <div className="flex items-center gap-3 mt-1 text-xs text-slate-400">
                         <span className="flex items-center gap-1"><Clock className="w-3 h-3" /> {new Date(record.timestamp).toLocaleTimeString("fa-IR")}</span>
                         <span dir="ltr">{(record.size / 1024 / 1024).toFixed(2)} MB</span>
                       </div>
                    </div>
                    <div className="w-8 h-8 rounded-full bg-emerald-500/10 flex items-center justify-center shrink-0">
                      <CheckCircle className="w-4 h-4 text-emerald-400" />
                    </div>
                  </div>
                  <div className="flex items-center gap-2 mt-2">
                    <button 
                      onClick={() => handleHistoryDownload(record)}
                      className="flex-1 bg-indigo-500/10 hover:bg-indigo-500/20 text-indigo-400 text-xs font-bold py-2 rounded-xl transition-colors flex items-center justify-center gap-1.5"
                    >
                      <Download className="w-3.5 h-3.5" /> استقرار / دانلود
                    </button>
                    <button 
                      onClick={() => handleHistoryDelete(record.id)}
                      className="px-3 py-2 bg-slate-800/80 hover:bg-red-500/20 text-slate-400 hover:text-red-400 rounded-xl transition-colors"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              ))
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
