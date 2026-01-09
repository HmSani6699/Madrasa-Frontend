import { useState } from "react";
import { 
  Book, 
  Search, 
  Download, 
  Bookmark, 
  Star, 
  Grid, 
  List,
  BookOpen
} from "lucide-react";

const EBooks = () => {
  const [viewMode, setViewMode] = useState("grid");

  const ebooks = [
    { id: 1, title: "Qaida Baghdadi", author: "Qari Rahim", subject: "Tajweed", size: "12 MB", rating: 4.8 },
    { id: 2, title: "Kitab Al-Nahw", author: "Imam Sibawayh", subject: "Arabic Grammar", size: "45 MB", rating: 5.0 },
    { id: 3, title: "Riyad as-Salihin", author: "Imam An-Nawawi", subject: "Hadith", size: "120 MB", rating: 4.9 },
    { id: 4, title: "Nur al-Idah", author: "Imam Shurunbulali", subject: "Fiqh", size: "28 MB", rating: 4.7 },
    { id: 5, title: "Seerat un-Nabi", author: "Shaykh Mubarakpuri", subject: "History", size: "65 MB", rating: 4.9 },
    { id: 6, title: "Modern Standard Arabic", author: "University Press", subject: "Language", size: "15 MB", rating: 4.5 },
  ];

  return (
    <div className="min-h-screen bg-slate-50/50 p-4 md:p-8 animate-in fade-in duration-500">
      <div className="max-w-[1600px] mx-auto space-y-6 md:space-y-10">
        
        {/* Header */}
        <div className="bg-white rounded-[1.5rem] md:rounded-[3rem] p-6 md:p-10 border border-slate-200 shadow-sm flex flex-col lg:flex-row justify-between items-center gap-6">
          <div className="flex items-center gap-4 md:gap-8">
            <div className="w-12 h-12 md:w-20 md:h-20 bg-emerald-50 rounded-xl md:rounded-3xl flex items-center justify-center border border-emerald-100 shadow-inner shrink-0 text-emerald-600">
              <Book className="w-6 h-6 md:w-10 md:h-10" />
            </div>
            <div>
              <h1 className="text-xl md:text-3xl font-black text-slate-800 tracking-tight uppercase leading-none mb-1 md:mb-3">Virtual Bookshelf</h1>
              <p className="text-slate-500 font-bold mt-1 text-xs md:text-base">Curated collection of PDF textbooks and supplementary reading materials</p>
            </div>
          </div>

          <div className="flex gap-4">
             <div className="flex bg-slate-100 p-1.5 rounded-2xl">
                <button 
                  onClick={() => setViewMode("grid")}
                  className={`p-3 rounded-xl transition-all ${viewMode === "grid" ? "bg-white text-slate-900 shadow-sm" : "text-slate-400 hover:text-slate-600"}`}
                >
                  <Grid className="w-5 h-5" />
                </button>
                <button 
                  onClick={() => setViewMode("list")}
                  className={`p-3 rounded-xl transition-all ${viewMode === "list" ? "bg-white text-slate-900 shadow-sm" : "text-slate-400 hover:text-slate-600"}`}
                >
                  <List className="w-5 h-5" />
                </button>
             </div>
          </div>
        </div>

        {/* E-Books Grid */}
        <div className={`grid ${viewMode === 'grid' ? 'grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4' : 'grid-cols-1'} gap-6`}>
           {ebooks.map((book) => (
              <div key={book.id} className={`bg-white rounded-[2rem] p-8 md:p-10 border border-slate-200 shadow-sm group hover:border-emerald-200 transition-all cursor-pointer relative overflow-hidden ${viewMode === 'list' ? 'flex flex-col md:flex-row items-center gap-8' : ''}`}>
                 <div className="absolute top-0 right-0 w-24 h-24 bg-slate-50 rounded-bl-[4rem] group-hover:bg-emerald-50 transition-colors duration-500 -mr-8 -mt-8"></div>
                 
                 <div className={`relative z-10 ${viewMode === 'grid' ? 'mb-8' : ''}`}>
                    <div className="w-20 h-28 bg-slate-900 rounded-r-xl rounded-l-md shadow-2xl flex flex-col justify-between p-3 border-l-4 border-slate-700 group-hover:-translate-y-2 transition-transform duration-500">
                       <div className="w-full h-1 bg-white/10 rounded-full"></div>
                       <div className="text-[6px] text-white/50 text-center font-mono">{book.id}</div>
                    </div>
                 </div>

                 <div className={`flex-1 ${viewMode === 'list' ? 'w-full md:w-auto text-center md:text-left' : ''}`}>
                    <h3 className="text-lg font-black text-slate-800 uppercase tracking-tight mb-2 leading-tight group-hover:text-emerald-700 transition-colors">{book.title}</h3>
                    <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-4">{book.author}</p>
                    
                    <div className={`flex flex-wrap items-center gap-3 ${viewMode === 'list' ? 'justify-center md:justify-start' : ''}`}>
                       <span className="px-3 py-1 bg-slate-50 text-[9px] font-black text-slate-500 uppercase tracking-widest rounded-lg border border-slate-100">{book.subject}</span>
                       <span className="px-3 py-1 bg-slate-50 text-[9px] font-black text-slate-400 uppercase tracking-widest rounded-lg border border-slate-100">{book.size}</span>
                    </div>
                 </div>

                 <div className={`flex items-center gap-3 ${viewMode === 'list' ? 'w-full md:w-auto justify-center' : 'w-full pt-8 border-t border-slate-50 mt-8'}`}>
                    <button className="flex-1 px-4 py-3 bg-slate-900 text-white rounded-xl font-black text-[10px] uppercase tracking-widest hover:bg-slate-800 transition-all shadow-lg flex items-center justify-center gap-2">
                       <Download className="w-3.5 h-3.5" /> Download
                    </button>
                    <button className="p-3 bg-white border border-slate-100 text-slate-300 rounded-xl hover:text-emerald-500 hover:border-emerald-100 transition-all shadow-sm">
                       <Bookmark className="w-4 h-4" />
                    </button>
                 </div>
              </div>
           ))}

           {/* Add New Request Card */}
           <div className="bg-slate-50 rounded-[2rem] border-2 border-dashed border-slate-200 flex flex-col items-center justify-center p-10 text-center gap-6 group hover:bg-white hover:border-emerald-500 transition-all cursor-pointer">
              <div className="w-16 h-16 bg-white rounded-2xl flex items-center justify-center text-slate-300 shadow-sm group-hover:text-emerald-500 group-hover:scale-110 transition-all">
                 <BookOpen className="w-8 h-8" />
              </div>
              <div>
                 <h4 className="text-xl font-black text-slate-400 uppercase tracking-tight mb-1 group-hover:text-slate-800 transition-colors">Request Title</h4>
                 <p className="text-[10px] font-bold text-slate-300 uppercase tracking-widest">Suggest books for the digital library</p>
              </div>
           </div>
        </div>

      </div>
    </div>
  );
};

export default EBooks;
