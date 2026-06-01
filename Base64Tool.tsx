import React, { useState } from "react";
import { KeyRound, ArrowRightLeft, Copy, Check } from "lucide-react";

export default function Base64Tool() {
  const [input, setInput] = useState("");
  const [output, setOutput] = useState("");
  const [mode, setMode] = useState<"encode" | "decode">("encode");
  const [copied, setCopied] = useState(false);
  const [error, setError] = useState("");

  const processConvert = () => {
    try {
      setError("");
      if (mode === "encode") {
         // Using btoa with encodeURIComponent to handle non-ascii safely
         setOutput(btoa(encodeURIComponent(input).replace(/%([0-9A-F]{2})/g, (match, p1) => String.fromCharCode(parseInt(p1, 16)))));
      } else {
         setOutput(decodeURIComponent([...atob(input)].map(c => '%' + ('00' + c.charCodeAt(0).toString(16)).slice(-2)).join('')));
      }
    } catch (e) {
      setError("متن ورودی مجاز نیست.");
      setOutput("");
    }
  };

  const handleCopy = () => {
    if (output) {
      navigator.clipboard.writeText(output);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  };

  return (
    <div className="flex flex-col h-full space-y-6">
      <div className="flex items-center gap-3">
        <div className="w-10 h-10 bg-violet-500/20 text-violet-400 rounded-xl flex items-center justify-center">
          <KeyRound className="w-5 h-5" />
        </div>
        <div>
          <h2 className="text-xl font-bold text-white">رمزگذار/رمزگشای Base64</h2>
          <p className="text-sm text-slate-400">تبدیل متن به رشته Base64 و بالعکس</p>
        </div>
      </div>
      
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 flex-1 min-h-[400px]">
        {/* Editor */}
        <div className="flex flex-col bg-slate-900 border border-slate-700/80 rounded-2xl overflow-hidden shadow-lg">
          <div className="bg-slate-800/80 px-5 py-3 border-b border-slate-700 flex justify-between items-center">
            <span className="font-semibold text-slate-300 text-sm">متن ورودی</span>
            <div className="flex items-center gap-2 bg-slate-950 p-1 rounded-lg">
              <button 
                onClick={() => setMode("encode")}
                className={`px-3 py-1.5 text-xs font-medium rounded-md transition-colors ${mode === "encode" ? "bg-violet-600 text-white" : "text-slate-400 hover:text-white"}`}
              >
                کدگذاری (Encode)
              </button>
              <button 
                onClick={() => setMode("decode")}
                className={`px-3 py-1.5 text-xs font-medium rounded-md transition-colors ${mode === "decode" ? "bg-violet-600 text-white" : "text-slate-400 hover:text-white"}`}
              >
                کدگشایی (Decode)
              </button>
            </div>
          </div>
          <textarea
            value={input}
            onChange={(e) => setInput(e.target.value)}
            className="w-full flex-1 bg-transparent p-5 text-slate-300 font-mono text-base resize-none focus:outline-none"
            dir="auto"
            placeholder={mode === "encode" ? "متن ساده خود را برای تبدیل به Base64 وارد کنید..." : "رشته Base64 معتبر را وارد کنید..."}
          />
        </div>

        {/* Output */}
        <div className="flex flex-col bg-slate-900 border border-slate-700/80 rounded-2xl overflow-hidden shadow-lg">
          <div className="bg-slate-800/80 px-5 py-4 border-b border-slate-700 flex justify-between items-center">
            <span className="font-semibold text-slate-300 text-sm flex items-center gap-3">
              نتیجه خروجی
              <button 
                onClick={processConvert}
                className="bg-violet-600/20 text-violet-300 border border-violet-500/30 hover:bg-violet-600/40 px-3 py-1.5 rounded-lg flex items-center gap-2 text-xs font-bold transition-colors"
               >
                 <ArrowRightLeft className="w-4 h-4"/> اعمال تغییر
              </button>
            </span>
            {output && (
              <button 
                onClick={handleCopy}
                className="text-slate-400 hover:text-white transition-colors"
                title="کپی کردن"
              >
                {copied ? <Check className="w-5 h-5 text-emerald-400" /> : <Copy className="w-5 h-5" />}
              </button>
            )}
          </div>
          <div className="flex-1 p-5 overflow-auto bg-slate-950/50">
             {error ? (
                <div className="text-red-400 font-medium text-sm text-center mt-10">
                   {error}
                </div>
             ) : (
                <div className="text-slate-300 font-mono text-base leading-relaxed break-all" dir="auto">
                   {output}
                </div>
             )}
          </div>
        </div>
      </div>
    </div>
  );
}
