import React, { useState } from "react";
import { 
  Rocket, Code2, Braces, Regex, KeyRound, Wrench, ChevronRight, Menu, X, Palette, AlignLeft,
  Key, Link, Fingerprint, Hash, FileDown, HelpCircle
} from "lucide-react";
import ReactBuilder from "./components/ReactBuilder";
import HtmlSandbox from "./components/HtmlSandbox";
import JsonFormatter from "./components/JsonFormatter";
import RegexTester from "./components/RegexTester";
import Base64Tool from "./components/Base64Tool";
import ColorPicker from "./components/ColorPicker";
import LoremIpsum from "./components/LoremIpsum";
import JwtDecoder from "./components/JwtDecoder";
import UrlConverter from "./components/UrlConverter";
import UuidGenerator from "./components/UuidGenerator";
import HashGenerator from "./components/HashGenerator";
import HtmlBundler from "./components/HtmlBundler";

const toolsList = [
  { id: 'react-builder', name: 'ری‌اکت ابری', desc: 'کامپایل و استقرار پروژه‌های React', icon: Rocket, color: 'text-blue-500', bg: 'bg-blue-500/10', isNew: false, longDesc: 'این ابزار یک محیط ابری کامل برای توسعه پروژه‌های ری‌اکت فراهم می‌کند. شما می‌توانید فایل‌های پروژه خود را آپلود کرده و فرآیند کامپایل را مستقیماً در مرورگر انجام دهید. همچنین امکان افزودن متغیرهای محیطی و دانلود خروجی به صورت کامل وجود دارد. این سیستم برای استقرار اولیه و تست کدهای React بسیار کاربردی است.' },
  { id: 'html-sandbox', name: 'کامپایلر وب', desc: 'پیش‌نمایش آنلاین کدهای HTML/CSS/JS', icon: Code2, color: 'text-indigo-400', bg: 'bg-indigo-500/10', isNew: false, longDesc: 'کامپایلر وب یک محیط ایزوله و امن (Sandbox) برای نوشتن و اجرای لحظه‌ای کدهای HTML، CSS و JavaScript ارائه می‌دهد. شما می‌توانید نحوه رندر شدن کدهای خود را به صورت زنده مشاهده کنید. این ابزار برای تست سریع قطعه کدها، طراحی رابط کاربری وتوسعه نمونه‌های اولیه بدون نیاز به نصب برنامه‌ای ایده‌آل است.' },
  { id: 'json-formatter', name: 'منظم‌ساز JSON', desc: 'همرنگ و منظم‌سازی فایل‌های جیسون', icon: Braces, color: 'text-emerald-400', bg: 'bg-emerald-500/10', isNew: false, longDesc: 'با استفاده از منظم‌ساز جیسون می‌توانید رشته‌های متنی به‌هم‌ریخته و فشرده JSON را به قالبی خوانا، مرتب و همرنگ‌سازی شده تبدیل کنید. این ابزار خطاهای ساختاری در فایل‌های JSON را شناسایی کرده و به شما کمک می‌کند تا داده‌های دریافتی از وب‌سرویس‌ها را با سرعت بیشتری تحلیل، دیباگ و اصلاح کنید.' },
  { id: 'base64', name: 'ابزار Base64', desc: 'کدگذاری و دی‌کد کردن متن‌ها', icon: KeyRound, color: 'text-violet-400', bg: 'bg-violet-500/10', isNew: false, longDesc: 'ابزار رمزگذاری و دی‌کد Base64 به شما اجازه می‌دهد تا متن‌ها و داده‌های خود را به سرعت به فرمت امن و استاندارد Base64 تبدیل کنید یا بالعکس. این روش به طور گسترده برای انتقال داده‌های باینری و متن‌ها در پروتکل‌های وب و ذخیره‌سازی اطلاعات مورد استفاده قرار می‌گیرد و بسیار کارآمد است.' },
  { id: 'color-picker', name: 'انتخاب رنگ', desc: 'انتخاب و کپی کدهای HEX و RGB.', icon: Palette, color: 'text-pink-400', bg: 'bg-pink-500/10', isNew: false, longDesc: 'ابزار انتخاب رنگ به طراحان و توسعه‌دهندگان فرانت‌اند کمک می‌کند تا رنگ‌های دقیق مورد نیاز خود را لمس کنند. با یک رابط کاربری بصری، می‌توانید طیف‌های مختلف رنگی را بررسی کرده و کدهای استاندارد HEX و RGB آن‌ها را با یک کلیک کپی کنید تا تنظیمات ظاهری پروژه‌های خود را اعمال نمایید.' },
  { id: 'lorem-ipsum', name: 'متن‌ساز', desc: 'تولید متن‌های لورم ایپسوم فارسی.', icon: AlignLeft, color: 'text-teal-400', bg: 'bg-teal-500/10', isNew: false, longDesc: 'تولیدکننده متن ساختگی (لورم ایپسوم) فارسی ابزاری ضروری برای طراحان گرافیک و توسعه‌دهندگان وب است. با انتخاب تعداد پاراگراف‌ها، این سیستم به صورت هوشمند متن‌های ساختگی با ساختار طبیعی فارسی تولید می‌کند تا تمرکز منحصراً روی چیدمان و ساختار بصری طرح شما باقی بماند.' },
  { id: 'html-bundler', name: 'ادغام‌ساز وب', desc: 'یکپارچه‌سازی وب در یک فایل.', icon: FileDown, color: 'text-indigo-400', bg: 'bg-indigo-500/10', isNew: false, longDesc: 'این ابزار هوشمند فایل‌های مجزای کد نظیر HTML، CSS و جاوااسکریپت شما را دریافت کرده و آن‌ها را در یک فایل واحد (index.html) ادغام می‌کند. این روش بهترین راه برای ایجاد صفحات مستقل برای دموها، پروژه‌های دانشجویی یا به اشتراک‌گذاری پروژه‌های کوچک وب می‌باشد.' },
  { id: 'regex-tester', name: 'تستر Regex', desc: 'بازی و تست با عبارات منظم', icon: Regex, color: 'text-pink-400', bg: 'bg-pink-500/10', isNew: true, longDesc: 'این ابزار برای آزمایش، عیب‌یابی و یادگیری عبارات منظم (Regular Expressions) طراحی شده است. شما می‌توانید الگوهای Regex خود را وارد کرده و مطابقت آن‌ها را با متن‌های مورد نظرتان به صورت لحظه‌ای بررسی کنید. این محیط تعاملی به شما کمک می‌کند الگوهای جستجوی پیچیده را با اطمینان بسازید.' },
  { id: 'jwt-decoder', name: 'دی‌کدر JWT', desc: 'مشاهده محتوای توکن‌های JWT.', icon: Key, color: 'text-amber-400', bg: 'bg-amber-500/10', isNew: true, longDesc: 'این دی‌کدر به شما امکان می‌دهد تا بدون نیاز به ارسال اطلاعات به سرورهای خارجی، توکن‌های JSON Web Token را مستقیماً در مرورگر خود باز کنید. اطلاعات مربوط به قسمت Header و Payload توکن خوانا و مرتب نمایش داده می‌شوند که برای دیباگ کردن فرآیندهای احراز هویت حیاتی است.' },
  { id: 'url-converter', name: 'تبدیل URL', desc: 'کدگذاری و دی‌کد آدرس‌های وب.', icon: Link, color: 'text-cyan-400', bg: 'bg-cyan-500/10', isNew: true, longDesc: 'ابزار تبدیل URL وظیفه کدگذاری و دی‌کد کردن آدرس‌های وب و پارامترهای آن‌ها را بر عهده دارد. با استفاده از این ابزار مطمئن می‌شوید که لینک‌ها شامل کاراکترهای غیرمجاز، به درستی با استانداردهای وب سازگار شده‌اند و از بروز خطاهای آدرس‌دهی هنگام ارسال درخواست‌های شبکه جلوگیری می‌کنید.' },
  { id: 'uuid-generator', name: 'تولید UUID', desc: 'تولید شناسه‌های یکتای تصادفی.', icon: Fingerprint, color: 'text-orange-400', bg: 'bg-orange-500/10', isNew: true, longDesc: 'تولیدکننده UUID به سادگی و سرعت برای سیستم شما شناسه‌های منحصربه‌فرد می‌سازد. شما می‌توانید با تعیین تعداد دلخواه، چندین شناسه استاندارد را به صورت تصادفی تولید کرده و از آن‌ها به عنوان کلید در دیتابیس، نام‌گذاری فایل‌ها یا نگه‌داری جلسات کاربری امن استفاده نمایید.' },
  { id: 'hash-generator', name: 'هش‌ساز', desc: 'تولید هش‌های SHA از متن.', icon: Hash, color: 'text-rose-400', bg: 'bg-rose-500/10', isNew: true, longDesc: 'هش‌ساز متنی، متن‌های ورودی شما را به قالب‌های هش ایمن مانند SHA-1، SHA-256 و SHA-512 در لحظه تبدیل می‌کند. این هش‌های یک‌طرفه برای بررسی یکپارچگی فایل‌ها، ایمن‌سازی رمزهای عبور کاربران و سایر کاربردهای امنیت اطلاعات در نرم‌افزارها و سایت‌ها به وفور مورد استفاده قرار می‌گیرند.' },
];

export default function App() {
  const [currentTool, setCurrentTool] = useState<string>('dashboard');
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [infoModal, setInfoModal] = useState<any>(null);

  const renderTool = () => {
    switch (currentTool) {
      case 'react-builder': return <ReactBuilder />;
      case 'html-sandbox': return <HtmlSandbox />;
      case 'json-formatter': return <JsonFormatter />;
      case 'regex-tester': return <RegexTester />;
      case 'base64': return <Base64Tool />;
      case 'color-picker': return <ColorPicker />;
      case 'lorem-ipsum': return <LoremIpsum />;
      case 'jwt-decoder': return <JwtDecoder />;
      case 'url-converter': return <UrlConverter />;
      case 'uuid-generator': return <UuidGenerator />;
      case 'hash-generator': return <HashGenerator />;
      case 'html-bundler': return <HtmlBundler />;
      default: return null;
    }
  };

  const handleToolSelect = (id: string) => {
    setCurrentTool(id);
    setIsSidebarOpen(false);
  };

  const openInfoPanel = (e: React.MouseEvent, tool: any) => {
    e.stopPropagation();
    setInfoModal(tool);
  };

  return (
    <div className="flex h-screen bg-slate-950 text-slate-200 font-sans relative overflow-hidden" dir="rtl">
      {infoModal && (
        <div className="fixed inset-0 bg-slate-950/80 backdrop-blur-md z-50 flex items-center justify-center p-4">
          <div className="bg-slate-900 border border-slate-700/80 rounded-3xl p-6 sm:p-8 max-w-lg w-full relative shadow-2xl animate-in zoom-in-95 duration-200">
            <button 
              onClick={() => setInfoModal(null)}
              className="absolute top-5 left-5 text-slate-400 hover:text-white bg-slate-800 hover:bg-slate-700 rounded-full p-1.5 transition-colors"
            >
              <X className="w-5 h-5" />
            </button>
            <div className="flex items-center gap-4 mb-6 pr-2">
              <div className={`w-14 h-14 ${infoModal.bg} ${infoModal.color} rounded-2xl flex items-center justify-center shadow-lg`}>
                <infoModal.icon className="w-7 h-7" />
              </div>
              <div>
                <h3 className="text-xl font-bold text-white mb-1">{infoModal.name}</h3>
                <p className="text-sm text-slate-400 font-medium">{infoModal.desc}</p>
              </div>
            </div>
            <div className="bg-slate-950/50 p-5 rounded-2xl border border-slate-800/80 leading-loose text-slate-300 text-sm text-justify">
              {infoModal.longDesc}
            </div>
            <button 
              onClick={() => { setInfoModal(null); handleToolSelect(infoModal.id); }}
              className="w-full mt-6 py-3.5 bg-indigo-600 hover:bg-indigo-500 text-white font-bold rounded-xl transition-colors shadow-[0_0_20px_rgba(79,70,229,0.2)]"
            >
              شروع کار با ابزار
            </button>
          </div>
        </div>
      )}

      {/* Background Decorative Elements */}
      <div className="fixed top-0 left-0 w-full h-[500px] bg-gradient-to-b from-indigo-900/40 via-slate-950/20 to-transparent pointer-events-none" />
      <div className="fixed -top-[300px] -right-[300px] w-[800px] h-[800px] rounded-full bg-blue-600/10 blur-[120px] pointer-events-none" />
      <div className="fixed top-[20%] -left-[200px] w-[600px] h-[600px] rounded-full bg-indigo-600/10 blur-[100px] pointer-events-none" />

      {/* Mobile Top Bar */}
      <div className="md:hidden fixed top-0 w-full h-16 bg-slate-900/80 backdrop-blur-md border-b border-slate-800/80 flex items-center justify-between px-4 z-40">
        <div className="flex items-center gap-2 cursor-pointer" onClick={() => handleToolSelect('dashboard')}>
           <div className="w-8 h-8 bg-gradient-to-br from-indigo-500 to-blue-600 rounded-lg flex items-center justify-center text-white shadow-lg">
             <Wrench className="w-4 h-4" />
           </div>
           <span className="font-bold text-white text-lg">پلتفرم ابزارها</span>
        </div>
        <button onClick={() => setIsSidebarOpen(!isSidebarOpen)} className="p-2 text-slate-300">
           {isSidebarOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
        </button>
      </div>

      {/* Overlay for Mobile Sidebar */}
      {isSidebarOpen && (
        <div 
          className="fixed inset-0 bg-slate-950/60 backdrop-blur-sm z-30 md:hidden"
          onClick={() => setIsSidebarOpen(false)}
        />
      )}

      {/* Sidebar Navigation */}
      <div className={`fixed inset-y-0 right-0 w-72 bg-slate-900/95 md:bg-slate-900/50 border-l border-slate-800/80 backdrop-blur-xl flex flex-col z-30 transform transition-transform duration-300 ease-in-out md:translate-x-0 pt-16 md:pt-0 ${isSidebarOpen ? 'translate-x-0' : 'translate-x-full'} md:relative`}>
         <div className="p-6 border-b border-slate-800/60 cursor-pointer hidden md:flex" onClick={() => handleToolSelect('dashboard')}>
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-gradient-to-br from-indigo-500 to-blue-600 rounded-xl flex items-center justify-center text-white shadow-lg">
                <Wrench className="w-5 h-5" />
              </div>
              <h1 className="text-xl font-bold tracking-tight text-white drop-shadow-sm leading-tight">پلتفرم ابزارها<br/><span className="text-sm font-medium text-indigo-300">برای برنامه‌نویسان</span></h1>
            </div>
         </div>
         <div className="flex-1 overflow-y-auto px-4 py-6 space-y-2 pb-24 border-b border-transparent">
            <div className="text-xs font-bold text-slate-500 mb-4 px-2 uppercase tracking-wider">لیست ابزارها</div>
            {toolsList.map(tool => (
               <div key={tool.id} className="relative group text-right">
                 <button
                    onClick={() => handleToolSelect(tool.id)}
                    className={`w-full flex items-center pr-3 pl-10 py-3 rounded-xl transition-all font-medium text-sm border ${currentTool === tool.id ? 'bg-indigo-600/20 text-indigo-300 border-indigo-500/30 shadow-[0_0_15px_rgba(79,70,229,0.1)]' : 'text-slate-400 hover:bg-slate-800/50 hover:text-slate-200 border-transparent'}`}
                 >
                    <div className={`w-8 h-8 rounded-lg flex items-center justify-center ml-3 shrink-0 ${currentTool === tool.id ? 'bg-indigo-500 text-white' : `${tool.bg} ${tool.color}`}`}>
                       <tool.icon className="w-4 h-4" />
                    </div>
                    <span className="flex-1 text-right line-clamp-1">{tool.name}</span>
                    {tool.isNew && (
                       <span className="bg-emerald-500/20 text-emerald-400 text-[10px] px-1.5 py-0.5 rounded-md font-bold whitespace-nowrap border border-emerald-500/20 ml-2">
                          آزمایشی
                       </span>
                    )}
                 </button>
                 <button
                   onClick={(e) => openInfoPanel(e, tool)}
                   className="absolute left-2 top-1/2 -translate-y-1/2 p-1.5 text-slate-500 hover:text-indigo-400 rounded-lg hover:bg-indigo-500/10 transition-colors z-10"
                   title="توضیحات بیشتر"
                 >
                   <HelpCircle className="w-4 h-4" />
                 </button>
               </div>
            ))}
         </div>
      </div>

      {/* Main Container */}
      <div className="flex-1 overflow-y-auto z-10 relative pt-16 md:pt-0">
        <div className="max-w-6xl mx-auto px-4 md:px-6 py-6 md:py-8 h-full">
           {currentTool === 'dashboard' ? (
              <div className="flex flex-col h-full space-y-8 md:space-y-10 py-6 md:py-10">
                 <div className="text-center px-2">
                    <h2 className="text-3xl md:text-5xl font-extrabold text-white tracking-tight leading-tight drop-shadow-xl mb-3 md:mb-4">
                       جعبه‌ابزار <span className="text-transparent bg-clip-text bg-gradient-to-l from-indigo-400 to-blue-400">هوشمند توسعه‌دهندگان</span>
                    </h2>
                    <p className="text-base md:text-lg text-slate-400 max-w-2xl mx-auto">
                       مجموعه‌ای از بهترین ابزارهای مورد نیاز برنامه‌نویسان در یک پلتفرم متمرکز ابری. با سرعت و تمرکز بیشتر کد بزنید.
                    </p>
                 </div>
                 
                 <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 md:gap-6">
                    {toolsList.map(tool => (
                       <div key={tool.id} onClick={() => handleToolSelect(tool.id)} className="bg-slate-900/60 border border-slate-800 hover:border-indigo-500/50 backdrop-blur-sm p-5 md:p-6 rounded-3xl cursor-pointer group transition-all hover:-translate-y-1 hover:shadow-[0_10px_30px_rgba(79,70,229,0.15)] flex flex-col items-start text-right relative overflow-hidden">
                          <div className={`absolute -right-10 -top-10 w-32 h-32 ${tool.bg} rounded-full blur-3xl opacity-50 group-hover:opacity-100 transition-opacity`}></div>
                          
                          <button
                            onClick={(e) => openInfoPanel(e, tool)}
                            className="absolute left-4 top-4 p-2 text-slate-500 hover:bg-indigo-500/20 hover:text-indigo-400 rounded-xl transition-all z-20"
                            title="اطلاعات ابزار"
                          >
                            <HelpCircle className="w-5 h-5" />
                          </button>

                          <div className="flex items-start justify-between w-full mb-4 md:mb-5 relative z-10 pr-2">
                             <div className={`w-12 h-12 md:w-14 md:h-14 ${tool.bg} ${tool.color} rounded-2xl flex items-center justify-center transform group-hover:scale-110 transition-transform`}>
                               <tool.icon className="w-6 h-6 md:w-7 md:h-7" />
                             </div>
                             {tool.isNew && (
                               <div className="bg-emerald-500/20 border border-emerald-500/30 text-emerald-400 px-2 py-1 text-[10px] md:text-xs font-bold rounded-lg shadow-sm mr-auto ml-10">
                                  آزمایشی (جدید)
                               </div>
                             )}
                          </div>
                          
                          <h3 className="text-lg md:text-xl font-bold text-white mb-2 relative z-10">{tool.name}</h3>
                          <p className="text-slate-400 text-xs md:text-sm leading-relaxed mb-4 md:mb-6 font-medium relative z-10">{tool.desc}</p>
                          
                          <div className="mt-auto flex items-center text-indigo-400 text-xs md:text-sm font-bold gap-1 group-hover:gap-2 transition-all relative z-10">
                             <span>استفاده از ابزار</span>
                             <ChevronRight className="w-4 h-4 ml-1 opacity-0 group-hover:opacity-100 transition-opacity" />
                          </div>
                       </div>
                    ))}
                 </div>
              </div>
           ) : (
              <div className="h-full flex flex-col">
                 <button 
                   onClick={() => handleToolSelect('dashboard')}
                   className="mb-4 md:mb-8 flex items-center gap-2 text-slate-400 hover:text-white transition-colors text-sm font-bold w-fit"
                 >
                   <ChevronRight className="w-5 h-5" /> بازگشت به داشبورد
                 </button>
                 <div className="flex-1 pb-8 md:pb-16 min-h-0">
                    {renderTool()}
                 </div>
              </div>
           )}
        </div>
      </div>
    </div>
  );
}

