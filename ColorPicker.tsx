import React, { useState } from "react";
import { Palette, Copy, Check } from "lucide-react";

export default function ColorPicker() {
  const [color, setColor] = useState("#4f46e5");
  const [copied, setCopied] = useState("");

  const hex2rgb = (hex: string) => {
    const r = parseInt(hex.slice(1, 3), 16);
    const g = parseInt(hex.slice(3, 5), 16);
    const b = parseInt(hex.slice(5, 7), 16);
    return `rgb(${r}, ${g}, ${b})`;
  };

  const copyToClipboard = (text: string, type: string) => {
    navigator.clipboard.writeText(text);
    setCopied(type);
    setTimeout(() => setCopied(""), 2000);
  };

  return (
    <div className="flex flex-col h-full max-w-4xl mx-auto space-y-6 lg:pt-10">
      <div className="flex items-center gap-3 mb-4">
        <div className="w-12 h-12 bg-pink-500/20 text-pink-400 rounded-2xl flex items-center justify-center">
          <Palette className="w-6 h-6" />
        </div>
        <div>
          <h2 className="text-2xl font-bold text-white">انتخاب و تبدیل رنگ</h2>
          <p className="text-slate-400 mt-1">رنگ‌های خود را انتخاب کنید و کدهای HEX یا RGB آن‌ها را کپی کنید.</p>
        </div>
      </div>

      <div className="bg-slate-900 border border-slate-700/80 rounded-3xl p-6 md:p-10 shadow-2xl backdrop-blur-sm grid grid-cols-1 md:grid-cols-2 gap-10">
        <div className="flex flex-col space-y-6 items-center justify-center">
          <div className="relative w-full max-w-[250px] aspect-square rounded-full shadow-[0_0_50px_rgba(0,0,0,0.5)] overflow-hidden border-8 border-slate-800" style={{ backgroundColor: color }}>
             <input 
               type="color" 
               value={color} 
               onChange={(e) => setColor(e.target.value)}
               className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
             />
          </div>
          <p className="text-slate-400 text-sm">برای تغییر رنگ روی دایره کلیک کنید</p>
        </div>
        
        <div className="flex flex-col justify-center space-y-6">
          <div className="bg-slate-800/50 p-6 rounded-2xl border border-slate-700">
            <h3 className="text-slate-400 text-sm mb-3">کد HEX</h3>
            <div className="flex items-center justify-between bg-slate-950 p-4 rounded-xl border border-slate-800">
              <span className="font-mono text-xl text-white tracking-widest">{color.toUpperCase()}</span>
              <button 
                onClick={() => copyToClipboard(color.toUpperCase(), "hex")}
                className="w-10 h-10 flex items-center justify-center rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-300 transition-colors"
              >
                {copied === "hex" ? <Check className="w-5 h-5 text-emerald-400" /> : <Copy className="w-5 h-5" />}
              </button>
            </div>
          </div>

          <div className="bg-slate-800/50 p-6 rounded-2xl border border-slate-700">
            <h3 className="text-slate-400 text-sm mb-3">کد RGB</h3>
            <div className="flex items-center justify-between bg-slate-950 p-4 rounded-xl border border-slate-800">
              <span className="font-mono text-xl text-white tracking-widest" dir="ltr">{hex2rgb(color)}</span>
              <button 
                onClick={() => copyToClipboard(hex2rgb(color), "rgb")}
                className="w-10 h-10 flex items-center justify-center rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-300 transition-colors"
              >
                {copied === "rgb" ? <Check className="w-5 h-5 text-emerald-400" /> : <Copy className="w-5 h-5" />}
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
