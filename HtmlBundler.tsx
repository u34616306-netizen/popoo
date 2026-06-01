import React, { useState, useRef } from "react";
import { FileDown, Download, UploadCloud, CheckCircle } from "lucide-react";

export default function HtmlBundler() {
  const [html, setHtml] = useState("");
  const [css, setCss] = useState("");
  const [js, setJs] = useState("");
  const [status, setStatus] = useState<"idle" | "success">("idle");

  const htmlRef = useRef<HTMLInputElement>(null);
  const cssRef = useRef<HTMLInputElement>(null);
  const jsRef = useRef<HTMLInputElement>(null);

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>, type: "html" | "css" | "js") => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (evt) => {
        const content = evt.target?.result as string;
        if (type === "html") setHtml(content);
        if (type === "css") setCss(content);
        if (type === "js") setJs(content);
        setStatus("idle");
      };
      reader.readAsText(file);
    }
  };

  const generateHtml = () => {
    const combined = `<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Bundled Document</title>
    <style>
${css}
    </style>
</head>
<body>
${html}
    <script>
${js}
    </script>
</body>
</html>`;
    return combined;
  };

  const handleDownload = () => {
    const combined = generateHtml();
    const blob = new Blob([combined], { type: "text/html" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = "index.html";
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
    setStatus("success");
    setTimeout(() => setStatus("idle"), 3000);
  };

  const Section = ({ title, value, onChange, fileRef, type, accept, placeholder }: any) => (
    <div className="flex-1 flex flex-col bg-slate-900 border border-slate-700/80 rounded-2xl overflow-hidden shadow-lg h-full">
      <div className="bg-slate-800/80 px-4 py-3 border-b border-slate-700 flex justify-between items-center">
        <span className="font-semibold text-slate-300 text-sm">{title}</span>
        <button 
          onClick={() => fileRef.current?.click()}
          className="flex items-center gap-1.5 text-xs bg-slate-700 hover:bg-slate-600 text-slate-300 px-2.5 py-1.5 rounded-lg transition-colors border border-slate-600"
        >
          <UploadCloud className="w-3.5 h-3.5" /> بارگذاری فایل
        </button>
        <input 
          type="file" 
          accept={accept} 
          className="hidden" 
          ref={fileRef} 
          onChange={(e) => handleFileUpload(e, type)} 
        />
      </div>
      <textarea
        value={value}
        onChange={(e) => { onChange(e.target.value); setStatus("idle"); }}
        className="w-full flex-1 bg-transparent p-4 text-slate-300 font-mono text-sm resize-none focus:outline-none"
        dir="ltr"
        placeholder={placeholder}
      />
    </div>
  );

  return (
    <div className="flex flex-col h-full space-y-6">
      <div className="flex items-center gap-3">
        <div className="w-10 h-10 bg-indigo-500/20 text-indigo-400 rounded-xl flex items-center justify-center">
          <FileDown className="w-5 h-5" />
        </div>
        <div>
          <h2 className="text-xl font-bold text-white">ادغام‌ساز کدهای وب (HTML/CSS/JS Bundler)</h2>
          <p className="text-sm text-slate-400">آپلود کدهای مجزا و دریافت در قالب قالب یک فایل HTML ساختاریافته</p>
        </div>
      </div>
      
      <div className="flex-1 grid grid-cols-1 md:grid-cols-3 gap-6 min-h-[400px] mb-6">
        <Section 
          title="کدهای HTML" 
          value={html} 
          onChange={setHtml} 
          fileRef={htmlRef} 
          type="html" 
          accept=".html,.htm" 
          placeholder="<h1>سلام...</h1>" 
        />
        <Section 
          title="کدهای CSS" 
          value={css} 
          onChange={setCss} 
          fileRef={cssRef} 
          type="css" 
          accept=".css" 
          placeholder="body { margin: 0; }" 
        />
        <Section 
          title="کدهای JavaScript" 
          value={js} 
          onChange={setJs} 
          fileRef={jsRef} 
          type="js" 
          accept=".js" 
          placeholder="console.log('Hello');" 
        />
      </div>

      <div className="flex justify-center pb-8 mt-auto">
        <button 
          onClick={handleDownload}
          disabled={!html && !css && !js}
          className="w-full md:w-auto px-10 py-4 bg-gradient-to-r from-indigo-600 to-blue-600 hover:from-indigo-500 hover:to-blue-500 text-white rounded-2xl font-bold flex items-center justify-center gap-3 transition-all transform hover:shadow-[0_0_30px_rgba(79,70,229,0.3)] text-lg disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {status === "success" ? (
             <><CheckCircle className="w-6 h-6 text-emerald-400" /> تولید فایل با موفقیت انجام شد</>
          ) : (
             <><Download className="w-6 h-6" /> تولید و دریافت فایل نهایی (index.html)</>
          )}
        </button>
      </div>
    </div>
  );
}
