import { useState } from "react";
import { 
  BookOpen, 
  User, 
  ChevronRight, 
  Award, 
  Star,
  BookMarked,
  Info,
  Calendar
} from "lucide-react";

const StudentSubjects = () => {
  const subjects = [
    { 
      id: 1, 
      name: "Arabic Grammar (Nahw)", 
      code: "ARB-101", 
      teacher: "Sheikh Abdullah", 
      credits: "4.0", 
      type: "Core",
      description: "Advanced study of Arabic syntax and word construction principles.",
      progress: 90
    },
    { 
      id: 2, 
      name: "Al-Quran Tajweed", 
      code: "QRN-202", 
      teacher: "Ustad Junaid", 
      credits: "3.5", 
      type: "Practical",
      description: "Phonetic articulation and rules of recitation (Makharij).",
      progress: 75
    },
    { 
      id: 3, 
      name: "Islamic Jurisprudence (Fiqh)", 
      code: "FQS-301", 
      teacher: "Mufti Omar", 
      credits: "3.0", 
      type: "Core",
      description: "Comprehensive study of Shariah laws and daily application.",
      progress: 82
    },
    { 
      id: 4, 
      name: "Hadith Studies", 
      code: "HDT-402", 
      teacher: "Sheikh Abdullah", 
      credits: "3.0", 
      type: "Core",
      description: "Principles of Hadith narrations and verification metrics.",
      progress: 94
    },
  ];

  return (
    <div className="min-h-screen bg-slate-50/50 p-4 md:p-8 animate-in fade-in duration-500">
      <div className="max-w-[1600px] mx-auto space-y-6 md:space-y-10">
        
        {/* Header */}
        <div className="bg-white rounded-[1.5rem] md:rounded-[3rem] p-6 md:p-10 border border-slate-200 shadow-sm flex flex-col lg:flex-row justify-between items-center gap-6">
          <div className="flex items-center gap-4 md:gap-8">
            <div className="w-12 h-12 md:w-20 md:h-20 bg-slate-900 rounded-xl md:rounded-3xl flex items-center justify-center border border-slate-800 shadow-inner shrink-0 text-white">
              <BookOpen className="w-6 h-6 md:w-10 md:h-10" />
            </div>
            <div>
              <h1 className="text-xl md:text-3xl font-black text-slate-800 tracking-tight uppercase leading-none mb-1 md:mb-3">Course Directory</h1>
              <p className="text-slate-500 font-bold mt-1 text-xs md:text-base">Comprehensive view of your active subjects and academic curricula</p>
            </div>
          </div>

          <div className="flex gap-4 w-full lg:w-auto">
             <div className="flex items-center gap-3 px-6 py-3 bg-slate-50 border border-slate-100 rounded-2xl md:rounded-3xl font-black text-[10px] uppercase tracking-widest text-slate-400">
                Department: <span className="text-slate-900">Mishkat Section A</span>
             </div>
          </div>
        </div>

        {/* Subjects Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
           {subjects.map((subject) => (
              <div key={subject.id} className="bg-white rounded-[2rem] md:rounded-[3rem] border border-slate-200 shadow-sm overflow-hidden group hover:border-slate-800 hover:shadow-2xl transition-all cursor-pointer">
                 <div className="p-8 md:p-12">
                    <div className="flex justify-between items-start mb-10">
                       <div className="w-16 h-16 bg-slate-50 rounded-[1.5rem] flex items-center justify-center text-slate-300 group-hover:bg-slate-900 group-hover:text-white transition-all shadow-inner">
                          <BookMarked className="w-8 h-8" />
                       </div>
                       <div className="text-right">
                          <span className="px-4 py-1.5 bg-slate-50 text-slate-400 border border-slate-100 rounded-lg text-[9px] font-black uppercase tracking-widest mb-2 inline-block">{subject.code}</span>
                          <p className="text-[10px] font-black text-slate-300 uppercase tracking-widest">Weight: {subject.credits} CR</p>
                       </div>
                    </div>

                    <h3 className="text-2xl md:text-3xl font-black text-slate-800 uppercase tracking-tight mb-4 leading-none">{subject.name}</h3>
                    <p className="text-sm font-bold text-slate-400 uppercase tracking-tight leading-relaxed mb-8 max-w-md">{subject.description}</p>

                    <div className="flex flex-wrap items-center gap-8 pt-8 border-t border-slate-50">
                       <div className="flex items-center gap-3">
                          <div className="w-10 h-10 bg-slate-50 rounded-full flex items-center justify-center text-slate-400">
                             <User className="w-5 h-5" />
                          </div>
                          <div>
                             <p className="text-[9px] font-black text-slate-300 uppercase tracking-widest leading-none mb-1">Involved Faculty</p>
                             <span className="text-xs font-black text-slate-700 uppercase">{subject.teacher}</span>
                          </div>
                       </div>
                       <div className="flex items-center gap-3">
                          <div className="w-10 h-10 bg-slate-50 rounded-full flex items-center justify-center text-slate-400">
                             <Star className="w-5 h-5" />
                          </div>
                          <div>
                             <p className="text-[9px] font-black text-slate-300 uppercase tracking-widest leading-none mb-1">Subject Type</p>
                             <span className="text-xs font-black text-slate-700 uppercase">{subject.type}</span>
                          </div>
                       </div>
                    </div>
                 </div>

                 <div className="px-12 py-8 bg-slate-50/50 flex flex-col md:flex-row md:items-center justify-between gap-6 border-t border-slate-50 group-hover:bg-white transition-all">
                    <div className="flex-1">
                       <div className="flex justify-between items-center mb-2">
                          <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Mastery Level</span>
                          <span className="text-[10px] font-black text-slate-900 uppercase tracking-widest">{subject.progress}%</span>
                       </div>
                       <div className="h-2 bg-slate-100 rounded-full overflow-hidden">
                          <div className="h-full bg-slate-900 rounded-full" style={{ width: `${subject.progress}%` }}></div>
                       </div>
                    </div>
                    <button className="flex items-center justify-center gap-3 px-8 py-4 bg-white border border-slate-200 text-slate-800 font-black text-[10px] uppercase tracking-widest rounded-2xl hover:bg-slate-900 hover:text-white hover:border-slate-900 transition-all shadow-sm">
                       Course Plan <ChevronRight className="w-4 h-4" />
                    </button>
                 </div>
              </div>
           ))}

           {/* Curriculum Download Card */}
           <div className="lg:col-span-2 bg-slate-900 rounded-[2rem] md:rounded-[3.5rem] p-10 md:p-14 text-white relative overflow-hidden group shadow-2xl shadow-indigo-100">
              <Award className="absolute -right-4 -top-4 w-48 h-48 text-white/5 -rotate-12 group-hover:rotate-0 transition-transform duration-1000" />
              <div className="relative z-10 max-w-2xl">
                 <h3 className="text-3xl font-black uppercase tracking-tight mb-6">Full Academic Syllabus 2026</h3>
                 <p className="text-slate-400 font-bold uppercase text-xs tracking-widest leading-relaxed mb-10">Access the official institutional curriculum documents including terminal exam breakdowns, elective guides, and recommended reading lists for all departments.</p>
                 <div className="flex flex-wrap gap-4">
                    <button className="px-10 py-5 bg-white text-slate-900 rounded-[2rem] font-black text-[11px] uppercase tracking-widest hover:bg-slate-100 transition-all flex items-center gap-3 shadow-xl">
                       <BookOpen className="w-5 h-5" /> Access Repository
                    </button>
                    <button className="px-10 py-5 bg-white/10 hover:bg-white/20 border border-white/5 rounded-[2rem] font-black text-[11px] uppercase tracking-widest transition-all flex items-center gap-3">
                       <Calendar className="w-5 h-5" /> Yearly Calendar
                    </button>
                 </div>
              </div>
           </div>
        </div>

        {/* Support Section */}
        <div className="bg-white rounded-[2rem] p-10 md:p-14 border border-slate-200 shadow-sm flex flex-col md:flex-row items-center justify-between gap-10">
           <div className="flex items-center gap-8">
              <div className="w-16 h-16 bg-indigo-50 rounded-2xl flex items-center justify-center text-indigo-600 shadow-inner">
                 <Info className="w-8 h-8" />
              </div>
              <div className="text-center md:text-left">
                 <h4 className="text-xl font-black text-slate-800 uppercase tracking-tight mb-1">Subject Selection Support</h4>
                 <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Consult with your department head for elective changes or credit transfers.</p>
              </div>
           </div>
           <button className="w-full md:w-auto px-10 py-5 bg-slate-900 text-white rounded-3xl font-black text-[10px] uppercase tracking-widest shadow-xl shadow-slate-200 hover:scale-105 active:scale-95 transition-all">
              Contact Administration
           </button>
        </div>

      </div>
    </div>
  );
};

export default StudentSubjects;
