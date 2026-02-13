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
  
  ];

  return (
    <div className="min-h-screen bg-slate-50/50 p-4 md:p-8 animate-in fade-in duration-500">
      <div className="max-w-[1600px] mx-auto space-y-6 md:space-y-10">
        
        {/* Header */}
        <div className="bg-white rounded-[20px] p-5 md:p-5 border border-slate-200 shadow-sm flex flex-col lg:flex-row justify-between items-center gap-6">
          <div className="flex items-center gap-4">
            <div className="w-8 h-8 md:w-13 md:h-13 bg-slate-900 rounded-[8px] md:rounded-[8px] flex items-center justify-center border border-slate-800 shadow-inner shrink-0">
              <BookMarked className="w-6 h-6 md:w-10 md:h-10 text-white" />
            </div>
            <div>
              <h1 className="text-[20px] font-black text-slate-800 tracking-tight  leading-none mb-1 md:mb-3">My Academic Subjects</h1>
            
            </div>
          </div>

         
        </div>

        {/* Subjects Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6 md:gap-8">
           {subjects.map((subject) => (
              <div key={subject.id} className="bg-white rounded-[20px] md:rounded-[20px] p-5 md:p-5 border border-slate-200 shadow-sm transition-all hover:border-slate-300 group flex flex-col h-full active:scale-95 cursor-pointer">
                 <div className="flex justify-center items-center mb-5">
                    <div className={`w-14 h-14 md:w-16 md:h-16 ${subject.color} ${subject.iconColor} rounded-2xl md:rounded-3xl flex items-center justify-center shadow-inner group-hover:scale-110 transition-transform`}>
                       <BookOpen className="w-7 h-7 md:w-8 md:h-8" />
                    </div>
                   
                 </div>
                 
                 <div className="flex-1">
                    <h3 className="text-xl md:text-[18px] text-center font-black text-slate-800  tracking-tight leading-tight mb-4">{subject.name}</h3>
                    <div className="flex items-center justify-center gap-2 mb-8 md:mb-10 text-center">
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

                 <button className="w-full mt-5 md:mt-6 py-3 bg-slate-50 text-slate-400 rounded-2xl font-black text-[10px] uppercase tracking-widest hover:bg-slate-900 hover:text-white transition-all flex items-center justify-center gap-3">
                    Course Syllabus <ChevronRight className="w-4 h-4" />
                 </button>
              </div>
           ))}
           
          
        </div>

      </div>
    </div>
  );
};

export default MySubjects;
