import React, { useState, useMemo } from "react";
import { Regex, AlertCircle } from "lucide-react";

export default function RegexTester() {
  const [pattern, setPattern] = useState("[0-9]+");
  const [flags, setFlags] = useState("g");
  const [text, setText] = useState("تست اعداد: 123 و 456 در متن");
  
  const validation = useMemo(() => {
    try {
      new RegExp(pattern, flags);
      return { valid: true, error: null };
    } catch (e: any) {
      return { valid: false, error: e.message };
    }
  }, [pattern, flags]);

  const highlightedText = useMemo(() => {
    if (!validation.valid || !pattern) return text;
    try {
      const regex = new RegExp(pattern, flags);
      const matches: {start: number, end: number}[] = [];
      let match;
      if (flags.includes('g')) {
         while ((match = regex.exec(text)) !== null) {
            matches.push({ start: match.index, end: match.index + match[0].length });
            if (match[0].length === 0) regex.lastIndex++; // Prevent infinite loops
         }
      } else {
         match = regex.exec(text);
         if (match) {
            matches.push({ start: match.index, end: match.index + match[0].length });
         }
      }

      if (matches.length === 0) return text;

      let result = [];
      let lastIndex = 0;
      matches.forEach((m, i) => {
        result.push(<span key={`text-${i}`}>{text.slice(lastIndex, m.start)}</span>);
        result.push(<span key={`match-${i}`} className="bg-amber-400/30 text-amber-200 border-b border-amber-400 px-0.5 rounded-sm">{text.slice(m.start, m.end)}</span>);
        lastIndex = m.end;
      });
      result.push(<span key="text-end">{text.slice(lastIndex)}</span>);
      return result;
    } catch (e) {
      return text;
    }
  }, [pattern, flags, text, validation]);

  return (
    <div className="flex flex-col h-full space-y-6">
      <div className="flex items-center gap-3">
        <div className="w-10 h-10 bg-pink-500/20 text-pink-400 rounded-xl flex items-center justify-center">
          <Regex className="w-5 h-5" />
        </div>
        <div>
          <h2 className="text-xl font-bold text-white">تستر عبارات منظم (Regex)</h2>
          <p className="text-sm text-slate-400">بررسی و تست آنلاین Regular Expressions</p>
        </div>
      </div>
      
      <div className="space-y-6 flex-1">
        {/* Pattern Input */}
        <div className="flex flex-col md:flex-row gap-4">
          <div className="flex-1 bg-slate-900 border border-slate-700/80 rounded-2xl overflow-hidden shadow-sm flex relative">
             <div className="bg-slate-800 text-slate-400 px-4 flex items-center border-r border-slate-700 font-mono text-lg font-bold">/</div>
             <input
               type="text"
               value={pattern}
               onChange={(e) => setPattern(e.target.value)}
               className="flex-1 bg-transparent px-4 py-4 text-pink-300 font-mono text-lg focus:outline-none"
               dir="ltr"
               placeholder="pattern"
             />
             <div className="bg-slate-800 text-slate-400 px-4 flex items-center border-l border-slate-700 font-mono text-lg font-bold">/</div>
             <input
               type="text"
               value={flags}
               onChange={(e) => setFlags(e.target.value)}
               className="w-16 bg-slate-800 text-pink-400 px-3 py-4 font-mono text-lg focus:outline-none"
               dir="ltr"
               placeholder="gi"
             />
          </div>
        </div>

        {!validation.valid && (
          <div className="bg-red-500/10 border border-red-500/30 text-red-400 p-4 rounded-xl flex items-center gap-3 text-sm font-mono" dir="ltr">
             <AlertCircle className="w-5 h-5" />
             {validation.error}
          </div>
        )}

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 min-h-[300px]">
          {/* Test String */}
          <div className="flex flex-col bg-slate-900 border border-slate-700/80 rounded-2xl overflow-hidden shadow-lg">
            <div className="bg-slate-800/80 px-5 py-4 border-b border-slate-700 font-semibold text-slate-300 text-sm">متن آزمایش</div>
            <textarea
              value={text}
              onChange={(e) => setText(e.target.value)}
              className="w-full flex-1 bg-transparent p-5 text-slate-300 font-mono text-base resize-none focus:outline-none leading-relaxed"
              dir="auto"
              placeholder="متن خود را اینجا وارد کنید..."
            />
          </div>

          {/* Result */}
          <div className="flex flex-col bg-slate-900 border border-slate-700/80 rounded-2xl overflow-hidden shadow-lg">
            <div className="bg-slate-800/80 px-5 py-4 border-b border-slate-700 font-semibold text-slate-300 text-sm">نتیجه (Highlight)</div>
            <div className="flex-1 p-5 overflow-auto text-slate-300 font-mono text-base leading-relaxed bg-slate-950/50" dir="auto">
               {highlightedText}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
