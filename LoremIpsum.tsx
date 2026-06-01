import React, { useState } from "react";
import { AlignLeft, Copy, Check, RefreshCw } from "lucide-react";

const LOREM_SENTENCES = [
  "لورم ایپسوم متن ساختگی با تولید سادگی نامفهوم از صنعت چاپ و با استفاده از طراحان گرافیک است.",
  "چاپگرها و متون بلکه روزنامه و مجله در ستون و سطرآنچنان که لازم است و برای شرایط فعلی تکنولوژی مورد نیاز و کاربردهای متنوع با هدف بهبود ابزارهای کاربردی می‌باشد.",
  "کتابهای زیادی در شصت و سه درصد گذشته، حال و آینده شناخت فراوان جامعه و متخصصان را می‌طلبد تا با نرم‌افزارها شناخت بیشتری را برای طراحان رایانه‌ای علی‌الخصوص طراحان خلاقی و فرهنگ پیشرو در زبان فارسی ایجاد کرد.",
  "در این صورت می‌توان امید داشت که تمام و دشواری موجود در ارائه راهکارها و شرایط سخت تایپ به پایان رسد و زمان مورد نیاز شامل حروفچینی دستاوردهای اصلی و جوابگوی سوالات پیوسته اهل دنیای موجود طراحی اساساً مورد استفاده قرار گیرد.",
  "طراحان گرافیک از این متن به عنوان عنصری از ترکیب‌بندی برای پر کردن صفحه و ارایه اولیه شکل ظاهری و کلی طرح سفارش گرفته شده استفاده می‌نمایند.",
  "از آنجا که لورم ایپسوم، شباهت زیادی به متن‌های واقعی دارد، طراحان معمولاً از آن برای نشان دادن ظاهر نهایی یک محصول استفاده می‌کنند.",
  "متن ساختگی می‌تواند در قالب‌ها، فونت‌ها و رنگ‌های مختلف تنظیم شود تا به طراح کمک کند بهترین تصمیم‌ها را بگیرد.",
  "بسیاری از طراحان وب و گرافیک از لورم ایپسوم برای پر کردن بخش‌های متنی خود در مراحل اولیه استفاده می‌کنند.",
  "با استفاده از این متن تستی، می‌توان تمرکز را از معنی و مفهوم کلمات برداشت و به جای آن بر روی طراحی و چیدمان عناصر صفحه تمرکز کرد.",
  "در واقع، لورم ایپسوم یک استاندارد در صنعت چاپ و طراحی وب است که برای نمایش محل قرارگیری متون استفاده می‌شود."
];

export default function LoremIpsum() {
  const [paragraphs, setParagraphs] = useState(3);
  const [text, setText] = useState("");
  const [copied, setCopied] = useState(false);

  const generateLorem = () => {
    let result = [];
    for (let p = 0; p < paragraphs; p++) {
       let paraLength = Math.floor(Math.random() * 4) + 3; // 3 to 6 sentences per paragraph
       let para = [];
       for (let i = 0; i < paraLength; i++) {
         para.push(LOREM_SENTENCES[Math.floor(Math.random() * LOREM_SENTENCES.length)]);
       }
       result.push(para.join(" "));
    }
    setText(result.join("\n\n"));
    setCopied(false);
  };

  React.useEffect(() => {
    generateLorem();
  }, [paragraphs]);

  const copyToClipboard = () => {
    navigator.clipboard.writeText(text);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="flex flex-col h-full max-w-4xl mx-auto space-y-6 lg:pt-10">
      <div className="flex items-center gap-3 mb-2">
        <div className="w-12 h-12 bg-teal-500/20 text-teal-400 rounded-2xl flex items-center justify-center">
          <AlignLeft className="w-6 h-6" />
        </div>
        <div>
          <h2 className="text-2xl font-bold text-white">متن‌ساز (Lorem Ipsum)</h2>
          <p className="text-slate-400 mt-1">تولید متن‌های ساختگی فارسی برای استفاده در طرح‌ها.</p>
        </div>
      </div>

      <div className="bg-slate-900 border border-slate-700/80 rounded-3xl p-6 md:p-10 shadow-2xl backdrop-blur-sm flex flex-col h-full md:h-[600px]">
        <div className="flex flex-col md:flex-row items-center justify-between gap-6 mb-8 bg-slate-800/50 p-4 rounded-2xl border border-slate-700">
          <div className="flex items-center gap-4 w-full md:w-auto">
            <span className="text-slate-300 font-bold whitespace-nowrap">تعداد پاراگراف:</span>
            <input 
              type="range" 
              min="1" 
              max="10" 
              value={paragraphs} 
              onChange={(e) => setParagraphs(Number(e.target.value))}
              className="w-full md:w-48 accent-teal-500"
            />
            <span className="w-8 text-center bg-slate-950 text-slate-200 font-mono py-1 rounded-md border border-slate-700">{paragraphs}</span>
          </div>

          <div className="flex items-center gap-3 w-full md:w-auto">
            <button 
              onClick={generateLorem}
              className="flex-1 md:flex-none flex items-center justify-center gap-2 px-4 py-3 bg-slate-800 hover:bg-slate-700 text-slate-200 rounded-xl transition-colors font-bold border border-slate-600"
            >
              <RefreshCw className="w-4 h-4" /> تولید مجدد
            </button>
            <button 
              onClick={copyToClipboard}
              className={`flex-1 md:flex-none flex items-center justify-center gap-2 px-6 py-3 rounded-xl transition-colors font-bold ${copied ? 'bg-emerald-500/20 text-emerald-400 border border-emerald-500/30' : 'bg-teal-600 hover:bg-teal-500 text-white'}`}
            >
              {copied ? <Check className="w-5 h-5" /> : <Copy className="w-5 h-5" />}
              کپی متن
            </button>
          </div>
        </div>

        <div className="flex-1 bg-slate-950 rounded-2xl border border-slate-800 p-6 overflow-y-auto">
          <p className="text-slate-300 whitespace-pre-wrap leading-loose text-justify">
            {text}
          </p>
        </div>
      </div>
    </div>
  );
}
