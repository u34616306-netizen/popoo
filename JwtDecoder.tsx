import React, { useState, useMemo } from "react";
import { Key, AlertCircle } from "lucide-react";

export default function JwtDecoder() {
  const [token, setToken] = useState("");

  const decoded = useMemo(() => {
    if (!token) return null;
    try {
      const parts = token.split('.');
      if (parts.length !== 3) throw new Error("Invalid format");

      const decodePayload = (str: string) => {
        const base64Url = str.replace(/-/g, '+').replace(/_/g, '/');
        const base64 = decodeURIComponent(atob(base64Url).split('').map(function(c) {
            return '%' + ('00' + c.charCodeAt(0).toString(16)).slice(-2);
        }).join(''));
        return JSON.parse(base64);
      };

      return {
        header: decodePayload(parts[0]),
        payload: decodePayload(parts[1])
      };
    } catch (e) {
      return { error: "توکن وارد شده معتبر نیست." };
    }
  }, [token]);

  return (
    <div className="flex flex-col h-full space-y-6">
      <div className="flex items-center gap-3">
        <div className="w-10 h-10 bg-amber-500/20 text-amber-400 rounded-xl flex items-center justify-center">
          <Key className="w-5 h-5" />
        </div>
        <div>
          <h2 className="text-xl font-bold text-white">دی‌کدر توکن JWT</h2>
          <p className="text-sm text-slate-400">آشکارسازی اطلاعات هدر و پی‌لود (Payload) توکن‌های JSON Web Token</p>
        </div>
      </div>
      
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 flex-1 min-h-[500px]">
        <div className="flex flex-col bg-slate-900 border border-slate-700/80 rounded-2xl overflow-hidden shadow-lg">
          <div className="bg-slate-800/80 px-5 py-4 border-b border-slate-700 font-semibold text-slate-300 text-sm">
            توکن ورودی
          </div>
          <textarea
            value={token}
            onChange={(e) => setToken(e.target.value)}
            className="w-full flex-1 bg-transparent p-5 text-slate-300 font-mono text-base resize-none focus:outline-none break-all"
            dir="ltr"
            placeholder="eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
          />
        </div>

        <div className="flex flex-col space-y-6">
          {decoded?.error ? (
            <div className="bg-red-500/10 border border-red-500/30 text-red-400 p-6 rounded-2xl flex items-center gap-4 text-base font-medium h-full justify-center">
              <AlertCircle className="w-6 h-6" />
              {decoded.error}
            </div>
          ) : (
            <>
              <div className="flex flex-col bg-slate-900 border border-slate-700/80 rounded-2xl overflow-hidden shadow-lg">
                <div className="bg-slate-800/80 px-5 py-3 border-b border-slate-700 font-semibold text-rose-300 text-sm">
                  Header
                </div>
                <div className="p-5 font-mono text-base text-rose-200/80 overflow-auto whitespace-pre-wrap" dir="ltr">
                  {decoded?.header ? JSON.stringify(decoded.header, null, 2) : "..."}
                </div>
              </div>
              <div className="flex-1 flex flex-col bg-slate-900 border border-slate-700/80 rounded-2xl overflow-hidden shadow-lg">
                <div className="bg-slate-800/80 px-5 py-3 border-b border-slate-700 font-semibold text-indigo-300 text-sm">
                  Payload (Data)
                </div>
                <div className="flex-1 p-5 font-mono text-base text-indigo-200/80 overflow-auto whitespace-pre-wrap" dir="ltr">
                  {decoded?.payload ? JSON.stringify(decoded.payload, null, 2) : "..."}
                </div>
              </div>
            </>
          )}
        </div>
      </div>
    </div>
  );
}
