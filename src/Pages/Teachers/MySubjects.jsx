import { useState } from "react";
import { 
  BookOpen, 
  Users, 
  Clock, 
  MapPin, 
  ChevronRight, 
  Calendar,
  Layers,
  Search,
  BookMarked
} from "lucide-react";

const MySubjects = () => {
  const subjects = [
    { 
      id: 1, 
      name: "Arabic Grammar (Nahw)", 
      class: "Mishkat", 
      section: "Sec A", 
      students: 42, 
      periods: 4,
      color: "bg-indigo-50",
      iconColor: "text-indigo-600"
    },
    { 
      id: 2, 
      name: "Al-Quran (Hifz)", 
      class: "Hifz", 
      section: "Sec A", 
      students: 28, 
      periods: 6,
      color: "bg-emerald-50",
      iconColor: "text-emerald-600"
    },
    { 
      id: 3, 
      name: "Islamic Law (Fiqh)", 
      class: "Hidayah", 
      section: "Sec B", 
      students: 35, 
      periods: 3,
      color: "bg-amber-50",
      iconColor: "text-amber-600"
    },
    { 
      id: 4, 
      name: "History of Islam", 
      class: "Mishkat", 
      section: "Sec C", 
      students: 40, 
      periods: 2,
      color: "bg-rose-50",
      iconColor: "text-rose-600"
    },
  ];

  return (
    <div className="min-h-screen bg-slate-50/50 p-4 md:p-8 animate-in fade-in duration-500">
      <div className="max-w-[1600px] mx-auto space-y-6 md:space-y-10">
        
        {/* Header */}
        <div className="bg-white rounded-[1.5rem] md:rounded-[2.5rem] p-6 md:p-10 border border-slate-200 shadow-sm flex flex-col lg:flex-row justify-between items-center gap-6">
          <div className="flex items-center gap-4 md:gap-8">
            <div className="w-12 h-12 md:w-20 md:h-20 bg-slate-900 rounded-xl md:rounded-3xl flex items-center justify-center border border-slate-800 shadow-inner shrink-0">
              <BookMarked className="w-6 h-6 md:w-10 md:h-10 text-white" />
            </div>
            <div>
              <h1 className="text-xl md:text-3xl font-black text-slate-800 tracking-tight uppercase leading-none mb-1 md:mb-3">My Academic Subjects</h1>
              <p className="text-slate-500 font-bold mt-1 text-xs md:text-base">Comprehensive list of managed courses and academic sections for current semester</p>
            </div>
          </div>

          <div className="flex gap-4 w-full lg:w-auto">
             <div className="relative flex-1 lg:w-80">
                <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-300" />
                <input className="w-full bg-slate-50 border border-slate-100 rounded-xl md:rounded-2xl pl-12 pr-6 py-3.5 md:py-4 text-sm font-bold focus:border-slate-800 outline-none transition-all" placeholder="Search courses..." />
             </div>
          </div>
        </div>

        {/* Subjects Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-6 md:gap-8">
           {subjects.map((subject) => (
              <div key={subject.id} className="bg-white rounded-[2rem] md:rounded-[2.5rem] p-6 md:p-8 border border-slate-200 shadow-sm transition-all hover:border-slate-300 group flex flex-col h-full active:scale-95 cursor-pointer">
                 <div className="flex justify-between items-start mb-10 md:mb-12">
                    <div className={`w-14 h-14 md:w-16 md:h-16 ${subject.color} ${subject.iconColor} rounded-2xl md:rounded-3xl flex items-center justify-center shadow-inner group-hover:scale-110 transition-transform`}>
                       <BookOpen className="w-7 h-7 md:w-8 md:h-8" />
                    </div>
                    <span className="px-4 py-1.5 bg-slate-100 text-[10px] font-black text-slate-400 uppercase tracking-widest border border-slate-200 rounded-full">Active</span>
                 </div>
                 
                 <div className="flex-1">
                    <h3 className="text-xl md:text-2xl font-black text-slate-800 uppercase tracking-tight leading-tight mb-4">{subject.name}</h3>
                    <div className="flex items-center gap-2 mb-8 md:mb-10">
                       <span className="px-3 py-1 bg-slate-50 text-[9px] font-black text-slate-500 uppercase tracking-[2px] border border-slate-100 rounded-lg">{subject.class}</span>
                       <span className="px-3 py-1 bg-slate-50 text-[9px] font-black text-slate-500 uppercase tracking-[2px] border border-slate-100 rounded-lg">{subject.section}</span>
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                       <div className="p-4 bg-slate-50/50 rounded-2xl border border-slate-50 group-hover:bg-slate-50 transition-colors">
                          <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest leading-none mb-1">Enrolled</p>
                          <p className="text-lg font-black text-slate-800 leading-none">{subject.students}</p>
                       </div>
                       <div className="p-4 bg-slate-50/50 rounded-2xl border border-slate-50 group-hover:bg-slate-50 transition-colors">
                          <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest leading-none mb-1">P/Week</p>
                          <p className="text-lg font-black text-slate-800 leading-none">{subject.periods}</p>
                       </div>
                    </div>
                 </div>

                 <button className="w-full mt-8 md:mt-10 py-5 bg-slate-50 text-slate-400 rounded-2xl font-black text-[10px] uppercase tracking-widest hover:bg-slate-900 hover:text-white transition-all flex items-center justify-center gap-3">
                    Course Syllabus <ChevronRight className="w-4 h-4" />
                 </button>
              </div>
           ))}
           
           {/* Add New Request Card */}
           <div className="bg-slate-50 rounded-[2rem] md:rounded-[2.5rem] p-8 border border-dashed border-slate-200 flex flex-col items-center justify-center text-center gap-6 group hover:bg-white hover:border-solid hover:border-slate-300 transition-all cursor-pointer">
              <div className="w-16 h-16 bg-white rounded-3xl flex items-center justify-center text-slate-300 group-hover:text-indigo-500 shadow-sm group-hover:shadow-lg transition-all">
                 <Layers className="w-8 h-8" />
              </div>
              <div>
                 <h4 className="text-lg font-black text-slate-800 uppercase tracking-tight mb-2 leading-none">Request Subject</h4>
                 <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest leading-relaxed">Add more courses to your workload for current semester</p>
              </div>
           </div>
        </div>

      </div>
    </div>
  );
};

export default MySubjects;
