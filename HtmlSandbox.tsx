import React, { useState } from "react";
import { Code2, Play, Maximize2, Minimize2, X } from "lucide-react";

export default function HtmlSandbox() {
  const [html, setHtml] = useState("<h1>سلام دنیا!</h1>\n<p>این یک پیش‌نمایش است...</p>");
  const [css, setCss] = useState("h1 { color: #3b82f6; }\np { color: #1e293b; }");
  const [js, setJs] = useState("console.log('Script loaded!');");
  const [isFullscreen, setIsFullscreen] = useState(false);
  
  const srcDoc = `
    <!DOCTYPE html>
    <html dir="rtl" lang="fa">
    <head>
      <meta charset="UTF-8">
      <style>
        body { font-family: system-ui, -apple-system, sans-serif; padding: 20px; }
        ${css}
      </style>
    </head>
    <body>
      ${html}
      <script>${js}</script>
    </body>
    </html>
  `;

  return (
    <>
      <div className="flex flex-col h-full space-y-4">
        <div className="flex items-center gap-3 mb-2">
          <div className="w-10 h-10 bg-indigo-500/20 text-indigo-400 rounded-xl flex items-center justify-center">
            <Code2 className="w-5 h-5" />
          </div>
          <div>
            <h2 className="text-xl font-bold text-white">کامپایلر کد وب (HTML/CSS/JS)</h2>
            <p className="text-sm text-slate-400">پیش‌نمایش در لحظه کدهای تحت وب</p>
          </div>
        </div>
        
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 flex-1 min-h-[500px]">
          {/* Editors */}
          <div className="flex flex-col space-y-4">
            <div className="flex-1 flex flex-col bg-slate-900 border border-slate-700/80 rounded-2xl overflow-hidden">
              <div className="bg-slate-800/80 px-4 py-2 border-b border-slate-700 font-medium text-slate-300 text-sm">HTML</div>
              <textarea
                value={html}
                onChange={(e) => setHtml(e.target.value)}
                className="w-full flex-1 bg-transparent p-4 text-slate-300 font-mono text-sm resize-none focus:outline-none"
                dir="ltr"
                placeholder="<!-- کدهای HTML خود را اینجا بنویسید -->"
              />
            </div>
            <div className="flex-1 flex flex-col bg-slate-900 border border-slate-700/80 rounded-2xl overflow-hidden">
              <div className="bg-slate-800/80 px-4 py-2 border-b border-slate-700 font-medium text-slate-300 text-sm">CSS</div>
              <textarea
                value={css}
                onChange={(e) => setCss(e.target.value)}
                className="w-full flex-1 bg-transparent p-4 text-slate-300 font-mono text-sm resize-none focus:outline-none"
                dir="ltr"
                placeholder="/* کدهای CSS خود را اینجا بنویسید */"
              />
            </div>
            <div className="flex-1 flex flex-col bg-slate-900 border border-slate-700/80 rounded-2xl overflow-hidden">
              <div className="bg-slate-800/80 px-4 py-2 border-b border-slate-700 font-medium text-slate-300 text-sm">JavaScript</div>
              <textarea
                value={js}
                onChange={(e) => setJs(e.target.value)}
                className="w-full flex-1 bg-transparent p-4 text-slate-300 font-mono text-sm resize-none focus:outline-none"
                dir="ltr"
                placeholder="// کدهای JS خود را اینجا بنویسید"
              />
            </div>
          </div>

          {/* Preview */}
          <div className="flex flex-col bg-white border border-slate-700/80 rounded-2xl overflow-hidden shadow-xl">
            <div className="bg-slate-100 px-4 py-3 border-b border-slate-200 flex items-center justify-between">
              <div className="flex items-center gap-2 text-slate-700 font-semibold text-sm">
                <Play className="w-4 h-4 text-emerald-500" />
                پیش‌نمایش زنده
              </div>
              <div className="flex items-center gap-4">
                <button 
                  onClick={() => setIsFullscreen(true)}
                  className="flex items-center gap-1.5 px-3 py-1.5 bg-white border border-slate-300 hover:bg-slate-50 text-slate-600 rounded-lg text-xs font-bold transition-colors shadow-sm"
                >
                  <Maximize2 className="w-3.5 h-3.5" /> تمام صفحه
                </button>
                <div className="flex gap-1.5">
                  <div className="w-3 h-3 rounded-full bg-red-400"></div>
                  <div className="w-3 h-3 rounded-full bg-amber-400"></div>
                  <div className="w-3 h-3 rounded-full bg-emerald-400"></div>
                </div>
              </div>
            </div>
            <iframe
              srcDoc={srcDoc}
              title="preview"
              className="w-full flex-1 bg-white"
              sandbox="allow-scripts"
            />
          </div>
        </div>
      </div>

      {/* Fullscreen Overlay */}
      {isFullscreen && (
        <div className="fixed inset-0 z-50 bg-slate-950/90 backdrop-blur-sm flex flex-col">
          <div className="h-16 bg-slate-900 border-b border-slate-800 flex items-center justify-between px-6">
            <div className="flex items-center gap-3">
              <Play className="w-5 h-5 text-emerald-400" />
              <span className="text-white font-bold text-lg">پیش‌نمایش تمام صفحه</span>
            </div>
            <button 
              onClick={() => setIsFullscreen(false)}
              className="flex items-center gap-2 px-4 py-2 bg-slate-800 hover:bg-slate-700 text-white rounded-xl text-sm font-bold transition-colors border border-slate-700"
            >
              <Minimize2 className="w-4 h-4" /> خروج
            </button>
          </div>
          <div className="flex-1 p-6 md:p-12 overflow-hidden">
            <div className="w-full h-full bg-white rounded-2xl overflow-hidden shadow-2xl relative border-4 border-slate-800">
               <iframe
                 srcDoc={srcDoc}
                 title="fullscreen preview"
                 className="w-full h-full bg-white"
                 sandbox="allow-scripts"
               />
            </div>
          </div>
        </div>
      )}
    </>
  );
}
