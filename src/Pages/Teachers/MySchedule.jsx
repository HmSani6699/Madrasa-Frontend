import { useState } from "react";
import { 
  Calendar, 
  Clock, 
  MapPin, 
  Users, 
  ChevronLeft, 
  ChevronRight,
  LayoutGrid,
  Info,
  X
} from "lucide-react";

const MySchedule = () => {
  const [selectedPeriod, setSelectedPeriod] = useState(null);
  const days = ["Sat", "Sun", "Mon", "Tue", "Wed", "Thu"];
  const periods = ["08:00 AM", "09:30 AM", "11:00 AM", "01:00 PM", "02:30 PM"];

  const scheduleData = {
    "Sat": { "08:00 AM": { subject: "Hifz-ul-Quran", section: "Sec A", room: "Hall 01" } },
    "Sun": { "09:30 AM": { subject: "Arabic Nahw", section: "Sec B", room: "Room 105" } },
    "Mon": { "11:00 AM": { subject: "Fiqh Basics", section: "Sec A", room: "Main Room" } },
    "Tue": { "08:00 AM": { subject: "Al-Quran", section: "Sec A", room: "Hall 01" } },
    "Wed": { "01:00 PM": { subject: "Islamic History", section: "Sec C", room: "Room 202" } },
  };

  return (
    <div className="min-h-screen bg-slate-50/50 p-4 md:p-8 animate-in fade-in duration-500">
      <div className="max-w-[1600px] mx-auto space-y-6 md:space-y-10">
        
        {/* Header */}
        <div className="bg-white rounded-[1.5rem] md:rounded-[3rem] p-6 md:p-10 border border-slate-200 shadow-sm flex flex-col lg:flex-row justify-between items-center gap-6">
          <div className="flex items-center gap-4 md:gap-8">
            <div className="w-12 h-12 md:w-20 md:h-20 bg-indigo-50 rounded-xl md:rounded-3xl flex items-center justify-center border border-indigo-100 shadow-inner shrink-0">
              <Calendar className="w-6 h-6 md:w-10 md:h-10 text-indigo-600" />
            </div>
            <div>
              <h1 className="text-xl md:text-3xl font-black text-slate-800 tracking-tight uppercase leading-none mb-1 md:mb-3">Weekly Timetable</h1>
              <p className="text-slate-500 font-bold mt-1 text-xs md:text-base">Institutional class assignments and specialized period scheduling</p>
            </div>
          </div>

          <div className="flex gap-4 w-full lg:w-auto">
             <button className="flex-1 lg:flex-none px-6 md:px-10 py-3.5 md:py-4 bg-slate-900 text-white rounded-xl md:rounded-2xl font-black shadow-xl shadow-slate-200 hover:bg-slate-800 transition-all flex items-center justify-center gap-3 text-[10px] md:text-[11px] uppercase tracking-widest">
               Export PDF
            </button>
          </div>
        </div>

        {/* Schedule Grid */}
        <div className="bg-white rounded-[1.5rem] md:rounded-[3rem] border border-slate-200 shadow-sm overflow-hidden">
           <div className="overflow-x-auto">
              <div className="min-w-[1000px]">
                 <div className="grid grid-cols-6 border-b border-slate-50">
                    <div className="p-8 bg-slate-50/30"></div>
                    {days.map(day => (
                       <div key={day} className="p-8 text-center bg-slate-50/30 border-l border-slate-100">
                          <span className="text-[10px] md:text-[12px] font-black text-slate-400 uppercase tracking-[2px]">{day}</span>
                       </div>
                    ))}
                 </div>

                 {periods.map((time, i) => (
                    <div key={i} className="grid grid-cols-6 border-b border-slate-50 last:border-0">
                       <div className="p-8 flex items-center justify-center bg-slate-50/10">
                          <div className="text-center">
                             <p className="text-[12px] md:text-sm font-black text-slate-800 leading-none mb-1">{time}</p>
                             <p className="text-[9px] font-black text-slate-400 uppercase tracking-widest">Period {i+1}</p>
                          </div>
                       </div>
                       {days.map(day => {
                          const session = scheduleData[day] ? scheduleData[day][time] : null;
                          return (
                             <div key={day} className="p-4 md:p-6 border-l border-slate-50 min-h-[140px]">
                                {session ? (
                                   <div 
                                      onClick={() => setSelectedPeriod({ ...session, day, time })}
                                      className="h-full bg-indigo-50 border border-indigo-100 rounded-2xl md:rounded-3xl p-4 md:p-6 hover:bg-indigo-600 hover:text-white transition-all group cursor-pointer shadow-sm hover:shadow-xl hover:shadow-indigo-200 hover:-translate-y-1"
                                   >
                                      <h4 className="text-xs md:text-sm font-black uppercase tracking-tight mb-3 leading-tight line-clamp-2">{session.subject}</h4>
                                      <div className="space-y-2">
                                         <div className="flex items-center gap-2 text-[8px] md:text-[10px] font-black uppercase tracking-widest opacity-60">
                                            <Users className="w-3 h-3" /> {session.section}
                                         </div>
                                         <div className="flex items-center gap-2 text-[8px] md:text-[10px] font-black uppercase tracking-widest opacity-60">
                                            <MapPin className="w-3 h-3" /> {session.room}
                                         </div>
                                      </div>
                                   </div>
                                ) : (
                                   <div className="h-full border border-dashed border-slate-100 rounded-[2rem] flex items-center justify-center opacity-30">
                                      <span className="text-[10px] font-black uppercase tracking-widest text-slate-200">Free</span>
                                   </div>
                                )}
                             </div>
                          );
                       })}
                    </div>
                 ))}
              </div>
           </div>
        </div>

      </div>

      {/* Period Detail Modal */}
      {selectedPeriod && (
         <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
            <div 
               className="absolute inset-0 bg-slate-900/60 backdrop-blur-md animate-in fade-in duration-300"
               onClick={() => setSelectedPeriod(null)}
            ></div>
            <div className="bg-white w-full max-w-md rounded-[2.5rem] md:rounded-[3rem] shadow-2xl relative z-10 overflow-hidden animate-in zoom-in-95 duration-300">
               <div className="p-8 md:p-12 text-center">
                  <div className="w-20 h-20 bg-indigo-50 rounded-[2rem] flex items-center justify-center mx-auto mb-8 border border-indigo-100 shadow-inner">
                     <Info className="w-10 h-10 text-indigo-600" />
                  </div>
                  <h3 className="text-2xl font-black text-slate-800 uppercase tracking-tight mb-2 leading-none">{selectedPeriod.subject}</h3>
                  <p className="text-[10px] font-black text-slate-400 uppercase tracking-[2px] mb-8">Period Details</p>
                  
                  <div className="space-y-4 mb-10 text-left">
                     <div className="p-4 bg-slate-50 rounded-2xl flex items-center justify-between">
                        <span className="text-xs font-bold text-slate-500 uppercase">Class / Sec</span>
                        <span className="text-xs font-black text-slate-800">{selectedPeriod.section}</span>
                     </div>
                     <div className="p-4 bg-slate-50 rounded-2xl flex items-center justify-between">
                        <span className="text-xs font-bold text-slate-500 uppercase">Room Allocation</span>
                        <span className="text-xs font-black text-slate-800">{selectedPeriod.room}</span>
                     </div>
                     <div className="p-4 bg-slate-50 rounded-2xl flex items-center justify-between text-indigo-600">
                        <span className="text-xs font-bold uppercase">Scheduled Time</span>
                        <span className="text-xs font-black uppercase">{selectedPeriod.day} | {selectedPeriod.time}</span>
                     </div>
                  </div>
                  
                  <button 
                     onClick={() => setSelectedPeriod(null)}
                     className="w-full py-5 bg-slate-900 text-white rounded-3xl font-black text-[11px] uppercase tracking-widest shadow-xl shadow-slate-200 hover:bg-slate-800 transition-all active:scale-95"
                  >
                     Close Overview
                  </button>
               </div>
               <button 
                  onClick={() => setSelectedPeriod(null)}
                  className="absolute top-6 right-6 p-2 bg-slate-100 text-slate-400 rounded-xl hover:bg-rose-50 hover:text-rose-600 transition-all"
               >
                  <X className="w-5 h-5" />
               </button>
            </div>
         </div>
      )}
    </div>
  );
};

export default MySchedule;
