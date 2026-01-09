import { useState } from "react";
import { 
  Calendar, 
  Clock, 
  MapPin, 
  AlertCircle, 
  Download, 
  ChevronRight,
  ShieldCheck,
  BookOpen,
  Info
} from "lucide-react";

const StudentExamSchedule = () => {
  const exams = [
    { 
      date: "Jan 15, 2026", 
      time: "09:00 AM", 
      subject: "Arabic Grammar (Nahw)", 
      venue: "Main Examination Hall", 
      seat: "Row B - 12",
      type: "Mid-Term Exhibition",
      status: "Upcoming"
    },
    { 
      date: "Jan 17, 2026", 
      time: "10:30 AM", 
      subject: "Al-Quran Tajweed", 
      venue: "Hifz Department", 
      seat: "Row A - 04",
      type: "Oral Assessment",
      status: "Upcoming"
    },
    { 
      date: "Jan 20, 2026", 
      time: "09:00 AM", 
      subject: "Islamic Jurisprudence", 
      venue: "Main Examination Hall", 
      seat: "Row C - 08",
      type: "Mid-Term Exhibition",
      status: "Upcoming"
    },
  ];

  return (
    <div className="min-h-screen bg-slate-50/50 p-4 md:p-8 animate-in fade-in duration-500">
      <div className="max-w-[1600px] mx-auto space-y-6 md:space-y-10">
        
        {/* Header */}
        <div className="bg-white rounded-[1.5rem] md:rounded-[3rem] p-6 md:p-10 border border-slate-200 shadow-sm flex flex-col lg:flex-row justify-between items-center gap-6">
          <div className="flex items-center gap-4 md:gap-8">
            <div className="w-12 h-12 md:w-20 md:h-20 bg-rose-50 rounded-xl md:rounded-3xl flex items-center justify-center border border-rose-100 shadow-inner shrink-0 text-rose-600">
              <ShieldCheck className="w-6 h-6 md:w-10 md:h-10" />
            </div>
            <div>
              <h1 className="text-xl md:text-3xl font-black text-slate-800 tracking-tight uppercase leading-none mb-1 md:mb-3">Examination Schedule</h1>
              <p className="text-slate-500 font-bold mt-1 text-xs md:text-base">Official venue allocation and timing for all institutional evaluations</p>
            </div>
          </div>

          <div className="flex gap-4 w-full lg:w-auto">
             <button className="flex-1 lg:flex-none px-8 py-4 bg-slate-900 text-white rounded-2xl font-black text-[10px] uppercase tracking-widest hover:bg-slate-800 transition-all shadow-lg flex items-center justify-center gap-3">
               <Download className="w-4 h-4" /> Download Admit Card
            </button>
          </div>
        </div>

        {/* Warning Alert */}
        <div className="bg-amber-50 border border-amber-100 rounded-3xl p-8 flex flex-col md:flex-row items-center gap-6 group hover:border-amber-200 transition-all">
           <div className="w-14 h-14 bg-white rounded-2xl flex items-center justify-center text-amber-500 shadow-sm">
              <AlertCircle className="w-7 h-7 animate-pulse" />
           </div>
           <div className="flex-1 text-center md:text-left">
              <h4 className="text-sm font-black text-amber-900 uppercase tracking-widest mb-1">Mandatory Requirements</h4>
              <p className="text-amber-700/70 text-[10px] font-bold uppercase tracking-widest leading-relaxed">Please bring your physical ID card and printed Admit Card. Candidates must arrive at the venue 30 minutes prior to commencement.</p>
           </div>
           <button className="px-6 py-3 bg-amber-500 text-white rounded-xl font-black text-[10px] uppercase tracking-widest hover:bg-amber-600 transition-all shadow-sm">
              View Guidelines
           </button>
        </div>

        {/* Exam Cards */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
           {exams.map((exam, idx) => (
              <div key={idx} className="bg-white rounded-[2.5rem] p-10 border border-slate-200 shadow-sm group hover:border-slate-800 hover:shadow-2xl transition-all relative overflow-hidden">
                 <div className="absolute top-0 right-0 w-24 h-24 bg-slate-50 rounded-bl-[4rem] -mr-8 -mt-8 opacity-50 group-hover:bg-slate-900 transition-colors"></div>
                 
                 <div className="relative z-10">
                    <div className="flex items-center gap-3 mb-8">
                       <div className="w-10 h-10 bg-slate-50 rounded-xl flex items-center justify-center text-slate-400 group-hover:text-indigo-500 transition-colors">
                          <Calendar className="w-5 h-5" />
                       </div>
                       <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest">{exam.date}</span>
                    </div>

                    <p className="text-[10px] font-black text-indigo-500 uppercase tracking-[2px] mb-2">{exam.subject}</p>
                    <h3 className="text-2xl font-black text-slate-800 uppercase tracking-tight mb-8 leading-tight group-hover:text-slate-900">{exam.type}</h3>

                    <div className="space-y-6 pt-8 border-t border-slate-50">
                       <div className="flex justify-between items-center">
                          <div className="flex items-center gap-3 text-slate-400">
                             <Clock className="w-4 h-4" />
                             <span className="text-[10px] font-black uppercase tracking-widest">Timing</span>
                          </div>
                          <span className="text-xs font-black text-slate-800 uppercase tracking-tight">{exam.time}</span>
                       </div>
                       <div className="flex justify-between items-center">
                          <div className="flex items-center gap-3 text-slate-400">
                             <MapPin className="w-4 h-4" />
                             <span className="text-[10px] font-black uppercase tracking-widest">Auditorium</span>
                          </div>
                          <span className="text-xs font-black text-slate-800 uppercase tracking-tight">{exam.venue}</span>
                       </div>
                       <div className="flex justify-between items-center">
                          <div className="flex items-center gap-3 text-slate-400">
                             <BookOpen className="w-4 h-4" />
                             <span className="text-[10px] font-black uppercase tracking-widest">Seat Allotted</span>
                          </div>
                          <span className="px-3 py-1 bg-slate-900 text-white rounded-lg text-[10px] font-black uppercase tracking-widest">{exam.seat}</span>
                       </div>
                    </div>

                    <button className="w-full mt-10 py-5 bg-slate-50 text-slate-400 font-black text-[10px] uppercase tracking-widest rounded-2xl group-hover:bg-slate-900 group-hover:text-white transition-all flex items-center justify-center gap-3">
                       Detailed Syllabus <ChevronRight className="w-4 h-4" />
                    </button>
                 </div>
              </div>
           ))}
        </div>

        {/* Footer Info */}
        <div className="bg-white rounded-[2rem] p-10 border border-slate-200 shadow-sm flex items-center gap-8 group">
           <div className="w-14 h-14 bg-slate-50 rounded-2xl flex items-center justify-center text-slate-300">
              <Info className="w-8 h-8" />
           </div>
           <p className="text-[10px] font-bold text-slate-400 uppercase tracking-[2px] leading-relaxed max-w-3xl">In case of any venue clashes or identification issues, please contact the Office of Examinations immediately at room 204.</p>
        </div>

      </div>
    </div>
  );
};

export default StudentExamSchedule;
