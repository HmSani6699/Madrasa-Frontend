import { useState } from "react";
import { 
  GraduationCap, 
  TrendingUp, 
  Clock, 
  MapPin, 
  User, 
  BookOpen,
  ChevronRight,
  ClipboardCheck,
  Star,
  Award,
  BookMarked
} from "lucide-react";

const AcademicSummary = () => {
  const [selectedPeriod] = useState("Q1 2026");

  const performanceStats = [
    { label: "Overall Progress", value: "88%", icon: TrendingUp, color: "text-emerald-600", bg: "bg-emerald-50" },
    { label: "Attendance", value: "94.2%", icon: ClipboardCheck, color: "text-indigo-600", bg: "bg-indigo-50" },
    { label: "Class Rank", value: "03 / 42", icon: Star, color: "text-amber-600", bg: "bg-amber-50" },
    { label: "Subjects", value: "08 Active", icon: BookOpen, color: "text-rose-600", bg: "bg-rose-50" },
  ];

  const subjects = [
    { name: "Arabic Nahw", grade: "A+", marks: "92/100", teacher: "Sheikh Abdullah", progress: 92 },
    { name: "Al-Quran Hifz", grade: "A", marks: "88/100", teacher: "Ustad Junaid", progress: 88 },
    { name: "Islamic Fiqh", grade: "A-", marks: "82/100", teacher: "Mufti Omar", progress: 82 },
    { name: "Hadith Studies", grade: "A+", marks: "95/100", teacher: "Sheikh Abdullah", progress: 95 },
  ];

  return (
    <div className="min-h-screen bg-slate-50/50 p-4 md:p-8 animate-in fade-in duration-500">
      <div className="max-w-[1600px] mx-auto space-y-6 md:space-y-10">
        
        {/* Header */}
        <div className="bg-white rounded-[1.5rem] md:rounded-[3rem] p-6 md:p-10 border border-slate-200 shadow-sm flex flex-col lg:flex-row justify-between items-center gap-6">
          <div className="flex items-center gap-4 md:gap-8">
            <div className="w-12 h-12 md:w-20 md:h-20 bg-slate-900 rounded-xl md:rounded-3xl flex items-center justify-center border border-slate-800 shadow-inner shrink-0 text-white">
              <GraduationCap className="w-6 h-6 md:w-10 md:h-10" />
            </div>
            <div>
              <h1 className="text-xl md:text-3xl font-black text-slate-800 tracking-tight uppercase leading-none mb-1 md:mb-3">Academic Summary</h1>
              <p className="text-slate-500 font-bold mt-1 text-xs md:text-base">Consolidated performance tracking for Abdullah Mamun</p>
            </div>
          </div>

          <div className="flex gap-4 w-full lg:w-auto">
             <div className="flex items-center gap-3 px-6 py-3 bg-slate-100 rounded-2xl md:rounded-3xl font-black text-[10px] uppercase tracking-widest text-slate-500">
                Current Term: <span className="text-slate-900">{selectedPeriod}</span>
             </div>
          </div>
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
           {performanceStats.map((stat, idx) => (
              <div key={idx} className="bg-white p-6 md:p-8 rounded-[1.5rem] md:rounded-[2.5rem] border border-slate-200 shadow-sm group hover:border-slate-800 transition-all cursor-pointer">
                 <div className={`w-12 h-12 ${stat.bg} ${stat.color} rounded-2xl flex items-center justify-center mb-6 shadow-inner group-hover:scale-110 transition-transform`}>
                    <stat.icon className="w-6 h-6" />
                 </div>
                 <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-1 leading-none">{stat.label}</p>
                 <h4 className="text-3xl font-black text-slate-900 tracking-tight leading-none">{stat.value}</h4>
              </div>
           ))}
        </div>

        {/* Detailed Performance */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
           
           {/* Subject Progress */}
           <div className="lg:col-span-2 space-y-6">
              <div className="bg-white rounded-[1.5rem] md:rounded-[3rem] p-8 md:p-12 border border-slate-200 shadow-sm h-full">
                 <div className="flex items-center justify-between mb-10">
                    <h3 className="text-xl md:text-2xl font-black text-slate-800 uppercase tracking-tight leading-none">Subject Mastery</h3>
                    <div className="flex items-center gap-2 text-[10px] font-black text-emerald-500 uppercase tracking-widest">
                       <Award className="w-4 h-4" /> Distinction Level
                    </div>
                 </div>

                 <div className="space-y-8">
                    {subjects.map((item, idx) => (
                       <div key={idx} className="space-y-4">
                          <div className="flex justify-between items-end">
                             <div>
                                <h4 className="text-base font-black text-slate-800 uppercase tracking-tight mb-1">{item.name}</h4>
                                <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Teacher: {item.teacher}</p>
                             </div>
                             <div className="text-right">
                                <span className="text-xl font-black text-slate-900">{item.grade}</span>
                                <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">{item.marks}</p>
                             </div>
                          </div>
                          <div className="h-3 bg-slate-50 rounded-full overflow-hidden border border-slate-100 p-0.5">
                             <div 
                                className="h-full bg-slate-900 rounded-full transition-all duration-1000 ease-out"
                                style={{ width: `${item.progress}%` }}
                             ></div>
                          </div>
                       </div>
                    ))}
                 </div>
              </div>
           </div>

           {/* Feedback & Recent Reports */}
           <div className="lg:col-span-1 space-y-6">
              <div className="bg-slate-900 rounded-[2rem] md:rounded-[3rem] p-8 md:p-10 text-white shadow-2xl relative overflow-hidden group">
                 <BookMarked className="absolute -right-4 -top-4 w-32 h-32 text-white/5 -rotate-12 group-hover:rotate-0 transition-transform duration-700" />
                 <h3 className="text-xl font-black uppercase tracking-tight mb-8 relative z-10">Teacher Feedback</h3>
                 
                 <div className="space-y-6 relative z-10">
                    <div className="p-6 bg-white/5 rounded-2xl border border-white/5 hover:border-white/20 transition-all">
                       <p className="text-[9px] font-black text-indigo-400 uppercase tracking-widest mb-3 flex items-center gap-2">
                          <User className="w-3 h-3" /> Sheikh Abdullah (Arabic)
                       </p>
                       <p className="text-xs font-bold text-slate-300 leading-relaxed uppercase">Excellent grasp of grammar rules. Participation in class remains exceptional.</p>
                       <p className="text-[8px] font-black text-slate-500 uppercase mt-4 tracking-widest">Jan 06, 2026</p>
                    </div>
                    
                    <div className="p-6 bg-white/5 rounded-2xl border border-white/5 hover:border-white/20 transition-all">
                       <p className="text-[9px] font-black text-emerald-400 uppercase tracking-widest mb-3 flex items-center gap-2">
                          <User className="w-3 h-3" /> Ustad Junaid (Hifz)
                       </p>
                       <p className="text-xs font-bold text-slate-300 leading-relaxed uppercase">Steadfast progress in Surah Al-Baqarah. Needs minor focus on Tajweed articulation.</p>
                       <p className="text-[8px] font-black text-slate-500 uppercase mt-4 tracking-widest">Dec 28, 2025</p>
                    </div>
                 </div>

                 <button className="w-full mt-10 py-5 bg-white text-slate-900 rounded-3xl font-black text-[10px] uppercase tracking-widest transition-all hover:bg-slate-50 active:scale-95 leading-none shadow-xl shadow-slate-900 relative z-10">
                    View Full Commentary
                 </button>
              </div>

              <div className="bg-white rounded-[2rem] md:rounded-[3rem] p-8 border border-slate-200 shadow-sm text-center group cursor-pointer hover:border-slate-300 transition-all">
                 <div className="w-16 h-16 bg-slate-50 rounded-2xl flex items-center justify-center mx-auto mb-6 text-slate-300 group-hover:text-amber-600 transition-all group-hover:scale-110">
                    <TrendingUp className="w-8 h-8" />
                 </div>
                 <h4 className="text-lg font-black text-slate-800 uppercase tracking-tight mb-2">Term Prediction</h4>
                 <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest leading-relaxed">AI-powered forecast based on current learning curve</p>
              </div>
           </div>
        </div>

      </div>
    </div>
  );
};

export default AcademicSummary;
