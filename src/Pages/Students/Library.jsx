import { useState } from "react";
import { 
  Library, 
  Search, 
  Filter, 
  BookOpen, 
  Download, 
  Star, 
  ArrowRight,
  Bookmark,
  ChevronRight,
  TrendingUp,
  Clock
} from "lucide-react";

const StudentLibrary = () => {
  const books = [
    { id: 1, title: "Arabic Grammar Essentials", author: "Sheikh Abdullah", category: "Language", year: "2024", type: "PDF" },
    { id: 2, title: "Hifz Tajweed Workbook", author: "Ustad Junaid", category: "Core", year: "2025", type: "Interactive" },
    { id: 3, title: "Islamic Jurisprudence Vol. 1", author: "Mufti Omar", category: "Shariah", year: "2023", type: "Digital" },
    { id: 4, title: "Hadith Narrators Guide", author: "Admin", category: "Research", year: "2024", type: "E-Book" },
    { id: 5, title: "Modern Arabic Syntax", author: "University Press", category: "Reference", year: "2024", type: "PDF" },
    { id: 6, title: "Early Islamic History", author: "Historian X", category: "History", year: "2025", type: "Interactive" },
  ];

  return (
    <div className="min-h-screen bg-slate-50/50 p-4 md:p-8 animate-in fade-in duration-500">
      <div className="max-w-[1600px] mx-auto space-y-6 md:space-y-10">
        
        {/* Header */}
        <div className="bg-white rounded-[1.5rem] md:rounded-[3rem] p-6 md:p-10 border border-slate-200 shadow-sm flex flex-col lg:flex-row justify-between items-center gap-6">
          <div className="flex items-center gap-4 md:gap-8">
            <div className="w-12 h-12 md:w-20 md:h-20 bg-indigo-50 rounded-xl md:rounded-3xl flex items-center justify-center border border-indigo-100 shadow-inner shrink-0 text-indigo-600">
              <Library className="w-6 h-6 md:w-10 md:h-10" />
            </div>
            <div>
              <h1 className="text-xl md:text-3xl font-black text-slate-800 tracking-tight uppercase leading-none mb-1 md:mb-3">Digital Repository</h1>
              <p className="text-slate-500 font-bold mt-1 text-xs md:text-base">Infinite access to institutional archives, research papers, and curriculum resources</p>
            </div>
          </div>

          <div className="flex gap-4 w-full lg:w-auto">
             <button className="flex-1 lg:flex-none px-8 py-4 bg-slate-900 text-white rounded-2xl font-black text-[10px] uppercase tracking-widest hover:bg-slate-800 transition-all shadow-lg flex items-center justify-center gap-3">
               <Bookmark className="w-4 h-4" /> My Bookmarks
            </button>
          </div>
        </div>

        {/* Browse Controls */}
        <div className="flex flex-col md:flex-row gap-4">
           <div className="relative flex-1 group">
              <Search className="absolute left-6 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-300 group-focus-within:text-indigo-500 transition-colors" />
              <input 
                className="w-full bg-white border border-slate-200 rounded-[1.5rem] md:rounded-3xl pl-16 pr-8 py-5 text-sm font-bold shadow-sm focus:border-indigo-500 outline-none transition-all" 
                placeholder="Find a resource by title, author, or keyword..." 
              />
           </div>
           <div className="flex gap-4">
              <button className="px-8 py-5 bg-white border border-slate-200 rounded-3xl font-black text-[10px] uppercase tracking-widest shadow-sm hover:border-indigo-500 transition-colors flex items-center gap-3">
                 <Filter className="w-4 h-4" /> Categorical Filter
              </button>
           </div>
        </div>

        {/* Resources Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
           {books.map((book) => (
              <div key={book.id} className="bg-white rounded-[2rem] md:rounded-[3rem] p-8 md:p-12 border border-slate-200 shadow-sm group hover:border-slate-800 hover:shadow-2xl hover:shadow-slate-200 transition-all cursor-pointer relative overflow-hidden">
                 <div className="absolute top-0 right-0 w-24 h-24 bg-slate-50 rounded-bl-[4rem] group-hover:bg-slate-900 transition-colors duration-500"></div>
                 
                 <div className="relative z-10">
                    <div className="flex items-center gap-3 mb-10">
                       <span className="px-3 py-1 bg-indigo-50 text-[9px] font-black text-indigo-500 border border-indigo-100 rounded-lg uppercase tracking-widest">{book.category}</span>
                       <span className="text-[9px] font-black text-slate-300 uppercase tracking-widest">{book.year}</span>
                    </div>

                    <h3 className="text-xl md:text-2xl font-black text-slate-800 uppercase tracking-tight mb-2 group-hover:text-slate-900 leading-tight">{book.title}</h3>
                    <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-10">{book.author}</p>

                    <div className="flex items-center justify-between pt-8 border-t border-slate-50">
                       <div className="flex items-center gap-2">
                          <div className={`w-10 h-10 rounded-xl flex items-center justify-center ${book.type === 'Interactive' ? 'bg-amber-50 text-amber-600' : 'bg-slate-50 text-slate-400'} group-hover:bg-slate-900 group-hover:text-white transition-all`}>
                             <BookOpen className="w-5 h-5" />
                          </div>
                          <span className="text-[9px] font-black text-slate-400 uppercase tracking-widest">{book.type}</span>
                       </div>
                       <button className="p-3 bg-white border border-slate-100 text-slate-300 rounded-xl hover:text-indigo-600 hover:border-indigo-100 transition-all shadow-sm group-hover:scale-110 active:scale-95">
                          <Download className="w-5 h-5" />
                       </button>
                    </div>
                 </div>
              </div>
           ))}

           {/* Request Card */}
           <div className="lg:col-span-3 bg-slate-900 rounded-[2rem] md:rounded-[3.5rem] p-10 md:p-16 text-white relative overflow-hidden group shadow-2xl">
              <TrendingUp className="absolute -right-4 -bottom-4 w-48 h-48 text-white/5 -rotate-12 group-hover:rotate-0 transition-transform duration-1000" />
              <div className="relative z-10 flex flex-col md:flex-row items-center justify-between gap-10">
                 <div className="flex-1 max-w-xl text-center md:text-left">
                    <h2 className="text-3xl md:text-4xl font-black uppercase tracking-tight mb-6">Can't find a resource?</h2>
                    <p className="text-slate-400 font-bold uppercase text-xs tracking-[2px] leading-relaxed">Submit a request to the Institutional Library. We continuously update our archives with requested research and academic texts.</p>
                 </div>
                 <button className="w-full md:w-auto px-12 py-5 bg-white text-slate-900 rounded-[2rem] font-black text-[11px] uppercase tracking-widest hover:bg-slate-100 transition-all flex items-center justify-center gap-3 shadow-xl active:scale-95 leading-none">
                    Submit Archive Request <ArrowRight className="w-5 h-5" />
                 </button>
              </div>
           </div>
        </div>

        {/* Historical Logs Widget */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
           <div className="bg-white rounded-[2.5rem] p-10 border border-slate-200 shadow-sm group cursor-pointer hover:border-slate-800 transition-all">
              <div className="flex items-center gap-6 mb-8">
                 <div className="w-14 h-14 bg-indigo-50 rounded-2xl flex items-center justify-center text-indigo-600 shadow-inner group-hover:scale-110 transition-transform">
                    <Clock className="w-7 h-7" />
                 </div>
                 <h4 className="text-lg font-black text-slate-800 uppercase tracking-tight">Recent Activity</h4>
              </div>
              <div className="space-y-4">
                 <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest leading-relaxed">Accessed "Arabic Grammar" <span className="text-slate-900 font-black">2 Hours Ago</span></p>
                 <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest leading-relaxed">Downloaded "Hifz Workbook" <span className="text-slate-900 font-black">Yesterday</span></p>
              </div>
           </div>

           <div className="bg-white rounded-[2.5rem] p-10 border border-slate-200 shadow-sm flex items-center justify-between group cursor-pointer hover:border-slate-800 transition-all">
              <div className="flex items-center gap-6">
                 <div className="w-14 h-14 bg-amber-50 rounded-2xl flex items-center justify-center text-amber-600 shadow-inner group-hover:scale-110 transition-transform">
                    <Star className="w-7 h-7" />
                 </div>
                 <div>
                    <h4 className="text-lg font-black text-slate-800 uppercase tracking-tight leading-none">Resource Points</h4>
                    <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mt-2">Level 05 Contributor</p>
                 </div>
              </div>
              <ChevronRight className="w-6 h-6 text-slate-200 group-hover:text-slate-900 group-hover:translate-x-1 transition-all" />
           </div>
        </div>

      </div>
    </div>
  );
};

export default StudentLibrary;
