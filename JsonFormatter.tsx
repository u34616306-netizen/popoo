import React, { useState } from "react";
import { Braces, Copy, Check, FileJson } from "lucide-react";

export default function JsonFormatter() {
  const [input, setInput] = useState('{"name":"Test","active":true,"items":[1,2,3]}');
  const [output, setOutput] = useState("");
  const [error, setError] = useState("");
  const [copied, setCopied] = useState(false);

  const formatJson = () => {
    try {
      const parsed = JSON.parse(input);
      setOutput(JSON.stringify(parsed, null, 2));
      setError("");
    } catch (e: any) {
      setError(e.message);
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
    <div className="flex flex-col h-full space-y-4">
      <div className="flex items-center gap-3 mb-2">
        <div className="w-10 h-10 bg-emerald-500/20 text-emerald-400 rounded-xl flex items-center justify-center">
          <Braces className="w-5 h-5" />
        </div>
        <div>
          <h2 className="text-xl font-bold text-white">مرتب‌ساز و اعتبارسنج JSON</h2>
          <p className="text-sm text-slate-400">کد جیسون خود را زیبا و دیباگ کنید</p>
        </div>
      </div>
      
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 flex-1 min-h-[500px]">
        {/* Editor */}
        <div className="flex flex-col bg-slate-900 border border-slate-700/80 rounded-2xl overflow-hidden shadow-lg">
          <div className="bg-slate-800/80 px-5 py-4 border-b border-slate-700 flex justify-between items-center">
            <span className="font-semibold text-slate-300 text-sm flex items-center gap-2">
              <FileJson className="w-4 h-4 text-emerald-400" />
              ورودی JSON
            </span>
            <button 
              onClick={formatJson}
              className="bg-emerald-600 hover:bg-emerald-500 text-white px-4 py-1.5 rounded-lg text-sm font-medium transition-colors"
            >
              مرتب‌سازی (Format)
            </button>
          </div>
          <textarea
            value={input}
            onChange={(e) => setInput(e.target.value)}
            className="w-full flex-1 bg-transparent p-5 text-slate-300 font-mono text-sm resize-none focus:outline-none"
            dir="ltr"
            placeholder="کد JSON خام خود را اینجا وارد کنید..."
          />
        </div>

        {/* Output */}
        <div className="flex flex-col bg-slate-900 border border-slate-700/80 rounded-2xl overflow-hidden shadow-lg relative">
          <div className="bg-slate-800/80 px-5 py-4 border-b border-slate-700 flex justify-between items-center">
            <span className="font-semibold text-slate-300 text-sm">
              خروجی
              {error && <span className="ml-3 text-red-400 text-xs font-normal">خطا در ساختار JSON</span>}
            </span>
            {output && (
              <button 
                onClick={handleCopy}
                className="text-slate-400 hover:text-white transition-colors"
              >
                {copied ? <Check className="w-5 h-5 text-emerald-400" /> : <Copy className="w-5 h-5" />}
              </button>
            )}
          </div>
          <div className="flex-1 p-5 overflow-auto relative">
            {error ? (
              <div className="bg-red-500/10 border border-red-500/30 text-red-400 p-4 rounded-xl font-mono text-sm leading-relaxed" dir="ltr">
                {error}
              </div>
            ) : output ? (
              <pre className="text-emerald-300 font-mono text-sm leading-relaxed" dir="ltr">
                {output}
              </pre>
            ) : (
              <div className="flex w-full h-full items-center justify-center text-slate-600 font-medium">
                در انتظار مرتب‌سازی...
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
