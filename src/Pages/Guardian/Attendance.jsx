import { useState } from "react";
import { 
  CalendarDays, 
  ChevronLeft, 
  ChevronRight, 
  UserCheck, 
  UserX, 
  Clock,
  Info,
  Download
} from "lucide-react";

const GuardianAttendance = () => {
  const [currentMonth] = useState("January 2026");

  const attendanceData = [
    { day: 1, status: 'present' }, { day: 2, status: 'present' }, { day: 3, status: 'weekend' },
    { day: 4, status: 'weekend' }, { day: 5, status: 'present' }, { day: 6, status: 'late' },
    { day: 7, status: 'present' }, { day: 8, status: 'absent' }, { day: 9, status: 'present' },
    { day: 10, status: 'weekend' }, { day: 11, status: 'weekend' }, { day: 12, status: 'present' },
    // Simplified for demonstration
  ];

  const stats = [
    { label: "Days Present", value: "18", color: "text-emerald-600", bg: "bg-emerald-50", icon: UserCheck },
    { label: "Late Arrivals", value: "02", color: "text-amber-600", bg: "bg-amber-50", icon: Clock },
    { label: "Unexcused Absence", value: "01", color: "text-rose-600", bg: "bg-rose-50", icon: UserX },
  ];

  return (
    <div className="min-h-screen bg-slate-50/50 p-4 md:p-8 animate-in fade-in duration-500">
      <div className="max-w-[1600px] mx-auto space-y-6 md:space-y-10">
        
        {/* Header */}
        <div className="bg-white rounded-[1.5rem] md:rounded-[3rem] p-6 md:p-10 border border-slate-200 shadow-sm flex flex-col lg:flex-row justify-between items-center gap-6">
          <div className="flex items-center gap-4 md:gap-8">
            <div className="w-12 h-12 md:w-20 md:h-20 bg-emerald-50 rounded-xl md:rounded-3xl flex items-center justify-center border border-emerald-100 shadow-inner shrink-0 text-emerald-600">
              <CalendarDays className="w-6 h-6 md:w-10 md:h-10" />
            </div>
            <div>
              <h1 className="text-xl md:text-3xl font-black text-slate-800 tracking-tight uppercase leading-none mb-1 md:mb-3">Attendance Log</h1>
              <p className="text-slate-500 font-bold mt-1 text-xs md:text-base">Real-time daily presence tracking for Abdullah Mamun</p>
            </div>
          </div>

          <div className="flex gap-4 w-full lg:w-auto">
             <button className="flex-1 lg:flex-none px-8 py-4 bg-slate-900 text-white rounded-2xl font-black text-[10px] uppercase tracking-widest hover:bg-slate-800 transition-all shadow-lg flex items-center justify-center gap-3">
               <Download className="w-4 h-4" /> Export Report
            </button>
          </div>
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
           {stats.map((stat, i) => (
              <div key={i} className="bg-white p-8 rounded-[2rem] md:rounded-[2.5rem] border border-slate-200 shadow-sm flex items-center gap-6 group hover:border-slate-800 transition-all">
                 <div className={`w-14 h-14 ${stat.bg} ${stat.color} rounded-2xl flex items-center justify-center shadow-inner group-hover:scale-110 transition-transform`}>
                    <stat.icon className="w-7 h-7" />
                 </div>
                 <div>
                    <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-1 leading-none">{stat.label}</p>
                    <h4 className="text-3xl font-black text-slate-800 tracking-tight leading-none">{stat.value}</h4>
                 </div>
              </div>
           ))}
        </div>

        {/* Calendar View */}
        <div className="bg-white rounded-[1.5rem] md:rounded-[3.5rem] border border-slate-200 shadow-sm p-8 md:p-12 animate-in slide-in-from-bottom duration-700">
           <div className="flex items-center justify-between mb-12">
              <h3 className="text-xl md:text-2xl font-black text-slate-800 uppercase tracking-tight leading-none">{currentMonth}</h3>
              <div className="flex gap-3">
                 <button className="p-3 bg-slate-50 border border-slate-100 rounded-xl hover:bg-slate-100 transition-all text-slate-400 hover:text-slate-900">
                    <ChevronLeft className="w-5 h-5" />
                 </button>
                 <button className="p-3 bg-slate-50 border border-slate-100 rounded-xl hover:bg-slate-100 transition-all text-slate-400 hover:text-slate-900">
                    <ChevronRight className="w-5 h-5" />
                 </button>
              </div>
           </div>

           <div className="grid grid-cols-7 gap-2 md:gap-6">
              {['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'].map(day => (
                 <div key={day} className="text-center text-[10px] font-black text-slate-300 uppercase tracking-widest pb-4">{day}</div>
              ))}
              
              {/* Dummy padding for calendar start */}
              <div className="aspect-square"></div>
              <div className="aspect-square"></div>
              <div className="aspect-square"></div>

              {Array.from({ length: 31 }).map((_, i) => {
                 const day = i + 1;
                 const data = attendanceData.find(d => d.day === day) || { status: 'pending' };
                 let styles = "bg-white text-slate-400 border-slate-100";
                 if (data.status === 'present') styles = "bg-emerald-50 text-emerald-600 border-emerald-100 shadow-sm";
                 if (data.status === 'absent') styles = "bg-rose-50 text-rose-600 border-rose-200 shadow-sm ring-4 ring-rose-50/50";
                 if (data.status === 'late') styles = "bg-amber-50 text-amber-600 border-amber-200 shadow-sm";
                 if (data.status === 'weekend') styles = "bg-slate-50 text-slate-200 border-slate-100";

                 return (
                    <div key={i} className={`aspect-square rounded-2xl md:rounded-[2rem] border p-3 flex flex-col justify-between transition-all group hover:scale-105 cursor-pointer ${styles}`}>
                       <span className="text-[10px] md:text-xs font-black">{day < 10 ? `0${day}` : day}</span>
                       <div className="flex justify-end uppercase text-[8px] font-black tracking-tighter hidden md:block opacity-60">
                          {data.status !== 'weekend' && data.status}
                       </div>
                    </div>
                 );
              })}
           </div>

           <div className="mt-12 pt-10 border-t border-slate-50 flex flex-wrap gap-8 justify-center">
              <div className="flex items-center gap-3">
                 <div className="w-3 h-3 bg-emerald-100 border border-emerald-200 rounded-full"></div>
                 <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Present</span>
              </div>
              <div className="flex items-center gap-3">
                 <div className="w-3 h-3 bg-rose-100 border border-rose-200 rounded-full"></div>
                 <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Absent</span>
              </div>
              <div className="flex items-center gap-3">
                 <div className="w-3 h-3 bg-amber-100 border border-amber-200 rounded-full"></div>
                 <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Late Arrival</span>
              </div>
              <div className="flex items-center gap-3">
                 <div className="w-3 h-3 bg-slate-50 border border-slate-100 rounded-full"></div>
                 <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Weekend / Holiday</span>
              </div>
           </div>
        </div>

        {/* Info Alert */}
        <div className="bg-indigo-900 rounded-[2rem] p-8 md:p-10 flex flex-col md:flex-row items-center justify-between gap-6 shadow-2xl">
           <div className="flex items-center gap-6">
              <div className="w-12 h-12 bg-white/10 rounded-2xl flex items-center justify-center text-indigo-400 border border-white/5">
                 <Info className="w-6 h-6" />
              </div>
              <div>
                 <h4 className="text-white font-black uppercase tracking-tight text-lg mb-1">Leave Request Policy</h4>
                 <p className="text-indigo-300/60 text-xs font-bold uppercase tracking-tight">Formal leave requests must be submitted 24 hours in advance via the Communication Center.</p>
              </div>
           </div>
           <button className="w-full md:w-auto px-8 py-4 bg-white text-indigo-900 rounded-2xl font-black text-[10px] uppercase tracking-widest hover:bg-indigo-50 transition-all leading-none">
              Apply for Leave
           </button>
        </div>

      </div>
    </div>
  );
};

export default GuardianAttendance;
