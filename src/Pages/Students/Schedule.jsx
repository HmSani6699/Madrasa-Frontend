import { useState } from "react";
import { 
  Calendar, 
  Clock, 
  MapPin, 
  User, 
  ChevronRight,
  Download,
  Info,
  Clock3
} from "lucide-react";

const StudentSchedule = () => {
  const [activeDay, setActiveDay] = useState("Monday");

  const days = ["Saturday", "Sunday", "Monday", "Tuesday", "Wednesday", "Thursday"];
  
  const schedule = [
    { period: "08:30 AM", title: "Al-Quran Tajweed", teacher: "Sheikh Abdullah", room: "Hall 01", type: "Core" },
    { period: "10:15 AM", title: "Arabic Grammar", teacher: "Ustad Junaid", room: "Room 105", type: "Language" },
    { period: "12:00 PM", title: "Islamic Fiqh", teacher: "Mufti Omar", room: "Main Room", type: "Shariah" },
    { period: "02:30 PM", title: "Hadith Principles", teacher: "Sheikh Abdullah", room: "Library Hall", type: "Core" },
  ];

  return (
    <div className="min-h-screen bg-slate-50/50 p-4 md:p-8 animate-in fade-in duration-500">
      <div className="max-w-[1600px] mx-auto space-y-6 md:space-y-10">
        
        {/* Header */}
        <div className="bg-white rounded-[1.5rem] md:rounded-[3rem] p-6 md:p-10 border border-slate-200 shadow-sm flex flex-col lg:flex-row justify-between items-center gap-6">
          <div className="flex items-center gap-4 md:gap-8">
            <div className="w-12 h-12 md:w-20 md:h-20 bg-indigo-50 rounded-xl md:rounded-3xl flex items-center justify-center border border-indigo-100 shadow-inner shrink-0 text-indigo-600">
              <Calendar className="w-6 h-6 md:w-10 md:h-10" />
            </div>
            <div>
              <h1 className="text-xl md:text-3xl font-black text-slate-800 tracking-tight uppercase leading-none mb-1 md:mb-3">Academic Timetable</h1>
              <p className="text-slate-500 font-bold mt-1 text-xs md:text-base">Your personalized weekly learning schedule and venue directory</p>
            </div>
          </div>

          <div className="flex gap-4 w-full lg:w-auto">
             <button className="flex-1 lg:flex-none px-8 py-4 bg-slate-100 text-slate-600 rounded-2xl font-black hover:bg-slate-200 transition-all border border-slate-200 text-[10px] uppercase tracking-widest flex items-center justify-center gap-3">
               <Download className="w-4 h-4" /> Download PDF
            </button>
          </div>
        </div>

        {/* Day Selector */}
        <div className="flex bg-white p-2 rounded-[1.5rem] md:rounded-[2.5rem] border border-slate-200 shadow-sm overflow-x-auto no-scrollbar">
           {days.map(day => (
              <button 
                 key={day}
                 onClick={() => setActiveDay(day)}
                 className={`flex-1 min-w-[120px] px-6 py-4 rounded-xl md:rounded-[2rem] font-black text-[10px] uppercase tracking-widest transition-all ${
                    activeDay === day 
                    ? "bg-slate-900 text-white shadow-xl scale-105" 
                    : "text-slate-400 hover:text-slate-600"
                 }`}
              >
                 {day}
              </button>
           ))}
        </div>

        {/* Schedule List */}
        <div className="bg-white rounded-[1.5rem] md:rounded-[3.5rem] border border-slate-200 shadow-sm p-8 md:p-14 animate-in slide-in-from-bottom duration-700">
           <div className="flex items-center justify-between mb-12">
              <h3 className="text-xl md:text-2xl font-black text-slate-800 uppercase tracking-tight leading-none">Schedule for {activeDay}</h3>
              <div className="flex items-center gap-2 text-[10px] font-black text-indigo-500 uppercase tracking-widest animate-pulse">
                <Clock3 className="w-4 h-4" /> Current Period Active
              </div>
           </div>

           <div className="space-y-6">
              {schedule.map((item, idx) => (
                 <div key={idx} className="group relative">
                    <div className="flex flex-col md:flex-row md:items-center justify-between p-8 bg-slate-50/50 rounded-[2rem] md:rounded-[3rem] border border-slate-50 hover:bg-white hover:border-indigo-100 hover:shadow-2xl hover:shadow-indigo-50 transition-all">
                       <div className="flex flex-col md:flex-row items-center gap-8 mb-6 md:mb-0">
                          <div className="w-20 h-20 bg-white rounded-[1.5rem] flex flex-col items-center justify-center shadow-sm border border-slate-100 group-hover:border-indigo-100 transition-all">
                             <span className="text-[10px] font-black text-indigo-500 uppercase tracking-tight mb-1">{item.period.split(' ')[1]}</span>
                             <span className="text-xl font-black text-slate-800 tracking-tight leading-none">{item.period.split(' ')[0]}</span>
                          </div>
                          <div className="text-center md:text-left">
                             <div className="flex items-center justify-center md:justify-start gap-3 mb-2">
                                <span className="px-3 py-1 bg-white border border-slate-100 rounded-lg text-[9px] font-black text-slate-400 uppercase tracking-widest">{item.type}</span>
                                <span className="text-[9px] font-black text-slate-300 uppercase tracking-widest">Duration: 90min</span>
                             </div>
                             <h4 className="text-xl md:text-2xl font-black text-slate-800 uppercase tracking-tight group-hover:text-indigo-600 transition-colors">{item.title}</h4>
                          </div>
                       </div>

                       <div className="flex flex-wrap justify-center md:justify-end gap-10 items-center border-t md:border-t-0 border-slate-100 pt-6 md:pt-0">
                          <div className="flex flex-col items-center md:items-end">
                             <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-1 leading-none text-center md:text-right">Course Faculty</p>
                             <div className="flex items-center gap-3">
                                <div className="w-6 h-6 bg-slate-100 rounded-full flex items-center justify-center text-slate-400">
                                   <User className="w-3.5 h-3.5" />
                                </div>
                                <span className="text-sm font-black text-slate-800 uppercase tracking-tight">{item.teacher}</span>
                             </div>
                          </div>
                          
                          <div className="flex flex-col items-center md:items-end">
                             <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-1 leading-none text-center md:text-right">Learning Venue</p>
                             <div className="flex items-center gap-3">
                                <div className="w-6 h-6 bg-slate-100 rounded-full flex items-center justify-center text-slate-400">
                                   <MapPin className="w-3.5 h-3.5" />
                                </div>
                                <span className="text-sm font-black text-slate-800 uppercase tracking-tight">{item.room}</span>
                             </div>
                          </div>

                          <button className="p-4 bg-white text-slate-200 border border-slate-100 rounded-2xl hover:text-indigo-600 hover:border-indigo-100 transition-all group-hover:scale-110 active:scale-95">
                             <ChevronRight className="w-5 h-5" />
                          </button>
                       </div>
                    </div>
                 </div>
              ))}
           </div>
        </div>

        {/* Schedule Info */}
        <div className="bg-slate-900 rounded-[2.5rem] p-10 flex flex-col md:flex-row items-center justify-between gap-8 relative overflow-hidden group">
           <Info className="absolute -left-4 -top-4 w-32 h-32 text-white/5 -rotate-12 group-hover:rotate-0 transition-transform duration-1000" />
           <div className="relative z-10">
              <h4 className="text-white font-black uppercase tracking-tight text-xl mb-2">Institutional Break</h4>
              <p className="text-slate-500 font-bold uppercase text-[10px] tracking-[3px]">12:45 PM - 02:30 PM • LUNCH & DHAHAR BREAK</p>
           </div>
           <div className="flex items-center gap-6 relative z-10 w-full md:w-auto">
              <div className="flex -space-x-3">
                 {[1,2,3].map(i => (
                    <div key={i} className="w-10 h-10 rounded-full border-2 border-slate-900 bg-slate-800 flex items-center justify-center text-[10px] font-black text-slate-500">
                       0{i}
                    </div>
                 ))}
              </div>
              <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">35 Students in Session</p>
           </div>
        </div>

      </div>
    </div>
  );
};

export default StudentSchedule;
