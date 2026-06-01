import React, { useState, useEffect } from "react";
import { Hash, Copy, Check } from "lucide-react";

export default function HashGenerator() {
  const [input, setInput] = useState("");
  const [hashes, setHashes] = useState({ sha1: "", sha256: "", sha512: "" });
  const [copied, setCopied] = useState("");

  useEffect(() => {
    if (!input) {
       setHashes({ sha1: "", sha256: "", sha512: "" });
       return;
    }

    const generateHashes = async () => {
      const encoder = new TextEncoder();
      const data = encoder.encode(input);
      
      const hashHex = async (alg: string) => {
        const hashBuffer = await crypto.subtle.digest(alg, data);
        const hashArray = Array.from(new Uint8Array(hashBuffer));
        return hashArray.map(b => b.toString(16).padStart(2, '0')).join('');
      };

      setHashes({
         sha1: await hashHex("SHA-1"),
         sha256: await hashHex("SHA-256"),
         sha512: await hashHex("SHA-512")
      });
    };

    generateHashes();
  }, [input]);

  const copyToClipboard = (text: string, type: string) => {
    navigator.clipboard.writeText(text);
    setCopied(type);
    setTimeout(() => setCopied(""), 2000);
  };

  const HashRow = ({ label, value, type }: { label: string, value: string, type: string }) => (
     <div className="bg-slate-800/50 p-4 rounded-2xl border border-slate-700 flex flex-col gap-3">
       <div className="flex items-center justify-between">
         <span className="font-bold text-slate-300 flex items-center gap-2">
           <Hash className="w-4 h-4 text-rose-400" /> {label}
         </span>
         {value && (
            <button 
              onClick={() => copyToClipboard(value, type)}
              className="bg-slate-950 border border-slate-800 text-slate-400 hover:text-white px-3 py-1.5 rounded-lg text-xs font-bold transition-colors flex items-center gap-1.5"
            >
              {copied === type ? <Check className="w-3.5 h-3.5 text-emerald-400"/> : <Copy className="w-3.5 h-3.5"/>}
              کپی
            </button>
         )}
       </div>
       <div className="bg-slate-950 p-4 rounded-xl border border-slate-800 font-mono text-sm break-all text-rose-200/80" dir="ltr">
         {value || "..."}
       </div>
     </div>
  );

  return (
    <div className="flex flex-col h-full space-y-6">
      <div className="flex items-center gap-3">
        <div className="w-10 h-10 bg-rose-500/20 text-rose-400 rounded-xl flex items-center justify-center">
          <Hash className="w-5 h-5" />
        </div>
        <div>
          <h2 className="text-xl font-bold text-white">هش‌ساز متن (Hash Generator)</h2>
          <p className="text-sm text-slate-400">تولید سریع توابع درهم‌ساز کریپتوگرافیک</p>
        </div>
      </div>
      
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 flex-1 min-h-[500px]">
        <div className="flex flex-col bg-slate-900 border border-slate-700/80 rounded-2xl overflow-hidden shadow-lg">
          <div className="bg-slate-800/80 px-5 py-4 border-b border-slate-700 font-semibold text-slate-300 text-sm">
            متن ورودی
          </div>
          <textarea
            value={input}
            onChange={(e) => setInput(e.target.value)}
            className="w-full flex-1 bg-transparent p-5 text-slate-300 font-mono text-base resize-none focus:outline-none"
            dir="auto"
            placeholder="متن خود را اینجا وارد کنید..."
          />
        </div>

        <div className="flex flex-col bg-slate-900 border border-slate-700/80 rounded-2xl overflow-hidden shadow-lg p-6 space-y-4 overflow-y-auto">
           <HashRow label="SHA-1" value={hashes.sha1} type="sha1" />
           <HashRow label="SHA-256" value={hashes.sha256} type="sha256" />
           <HashRow label="SHA-512" value={hashes.sha512} type="sha512" />
        </div>
      </div>
    </div>
  );
}
