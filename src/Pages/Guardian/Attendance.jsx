import { useState } from "react";
import { useAuth } from "../../context/AuthContext";
import { 
  CalendarDays, 
  ChevronLeft, 
  ChevronRight, 
  UserCheck, 
  UserX, 
  Clock,
  Info,
  Download,
  Calendar as CalendarIcon,
  TrendingUp,
  AlertCircle
} from "lucide-react";

const GuardianAttendance = () => {
  const { activeChild } = useAuth();
  const [currentMonth] = useState("January 2026");

  const attendanceData = [
    { day: 1, status: 'present' }, { day: 2, status: 'present' }, { day: 3, status: 'weekend' },
    { day: 4, status: 'weekend' }, { day: 5, status: 'present' }, { day: 6, status: 'late' },
    { day: 7, status: 'present' }, { day: 8, status: 'absent' }, { day: 9, status: 'present' },
    { day: 10, status: 'weekend' }, { day: 11, status: 'weekend' }, { day: 12, status: 'present' },
  ];

  const stats = [
    
    { label: "Present", value: "18", color: "text-blue-600", bg: "bg-blue-50", icon: UserCheck },
    { label: "Absent", value: "02", color: "text-amber-600", bg: "bg-amber-50", icon: Clock },
    { label: "Leave", value: "01", color: "text-rose-600", bg: "bg-rose-50", icon: UserX },
  ];

  return (
    <div className="space-y-8 pb-12 animate-in fade-in duration-700">
      {/* Header Section */}
      <div className="bg-white rounded-[20px] p-5 border-2 border-slate-50 shadow-sm flex flex-col md:flex-row justify-between items-center gap-8 relative overflow-hidden">
        <div className="absolute -right-10 -top-10 w-40 h-40 bg-emerald-50 rounded-full blur-3xl opacity-50"></div>
        <div className="flex items-center gap-6 relative z-10">
          <div className="w-16 h-16 md:w-20 md:h-20 bg-emerald-50 rounded-2xl md:rounded-3xl flex items-center justify-center border-2 border-emerald-100 shadow-inner text-[#00bd7f]">
            <CalendarDays className="w-8 h-8 md:w-10 md:h-10" />
          </div>
          <div>
            <h1 className="text-[20px] font-black text-slate-800 tracking-tight uppercase leading-none mb-2 md:mb-3">Attendance Tracker</h1>
           
          </div>
        </div>
        <button className="relative z-10 px-8 py-3 bg-[#00bd7f] text-white rounded-[8px] font-black  tracking-widest hover:bg-slate-800 transition-all shadow-xl shadow-slate-200 active:scale-95 flex items-center gap-3">
          <Download className="w-4 h-4" />
          Export 
        </button>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {stats.map((stat, i) => (
          <div key={i} className="bg-white p-8 rounded-[20px] border-2 border-slate-50 shadow-sm flex items-center gap-6 group hover:border-[#00bd7f]/30 transition-all cursor-default">
            <div className={`w-14 h-14 ${stat.bg} ${stat.color} rounded-2xl flex items-center justify-center shadow-inner group-hover:scale-110 transition-transform`}>
              <stat.icon className="w-7 h-7" />
            </div>
            <div>
              <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-1 leading-none">{stat.label}</p>
              <h4 className="text-3xl font-black text-slate-900 tracking-tight leading-none">{stat.value}</h4>
            </div>
          </div>
        ))}
      </div>

      {/* Calendar View Container */}
      <div className="bg-white rounded-[20px] border-2 border-slate-50 shadow-xl  p-8  relative overflow-hidden group">
        <div className="absolute -left-6 -top-6 w-32 h-32 bg-slate-50 rounded-full blur-2xl"></div>
        <div className="flex flex-col md:flex-row items-center justify-between mb-12 gap-6 relative z-10">
          <div className="flex items-center gap-4">
             <div className="w-10 h-10 bg-slate-100 rounded-xl flex items-center justify-center text-slate-400">
                <CalendarIcon className="w-5 h-5" />
             </div>
             <h3 className="text-2xl font-black text-slate-800 uppercase tracking-tight leading-none">{currentMonth}</h3>
          </div>
          <div className="flex gap-4">
             <button className="p-4 bg-slate-50 border-2 border-slate-100 rounded-2xl hover:bg-white hover:border-slate-200 transition-all text-slate-400 hover:text-slate-900 shadow-sm">
                <ChevronLeft className="w-5 h-5" />
             </button>
             <button className="p-4 bg-slate-50 border-2 border-slate-100 rounded-2xl hover:bg-white hover:border-slate-200 transition-all text-slate-400 hover:text-slate-900 shadow-sm">
                <ChevronRight className="w-5 h-5" />
             </button>
          </div>
        </div>

        <div className="grid grid-cols-7 gap-3 md:gap-6 relative z-10">
          {['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'].map(day => (
            <div key={day} className="text-center text-[10px] font-black text-slate-300 uppercase tracking-widest pb-6">{day}</div>
          ))}
          
          {/* Padding for month start */}
          <div className="aspect-square"></div>
          <div className="aspect-square"></div>
          <div className="aspect-square"></div>

          {Array.from({ length: 31 }).map((_, i) => {
            const day = i + 1;
            const data = attendanceData.find(d => d.day === day) || { status: 'pending' };
            let styles = "bg-white text-slate-400 border-slate-100";
            let indicator = null;

            if (data.status === 'present') {
              styles = "bg-emerald-50/50 text-emerald-600 border-emerald-100 shadow-inner group/day hover:bg-emerald-50";
              indicator = <div className="w-1.5 h-1.5 bg-emerald-500 rounded-full"></div>;
            }
            if (data.status === 'absent') {
              styles = "bg-rose-50 text-rose-600 border-rose-200 shadow-lg shadow-rose-100/50 ring-4 ring-rose-50/50";
              indicator = <div className="w-2 h-2 bg-rose-500 rounded-full animate-pulse"></div>;
            }
            if (data.status === 'late') {
              styles = "bg-amber-50 text-amber-600 border-amber-200 shadow-sm";
              indicator = <div className="w-1.5 h-1.5 bg-amber-500 rounded-full"></div>;
            }
            if (data.status === 'weekend') {
              styles = "bg-slate-50/50 text-slate-200 border-slate-50 cursor-not-allowed opacity-50";
            }

            return (
              <div key={i} className={`aspect-square rounded-2xl md:rounded-[2.5rem] border-2 p-4 md:p-6 flex flex-col justify-between transition-all group/day hover:scale-105 cursor-pointer ${styles}`}>
                <span className="text-xs md:text-lg font-black">{day < 10 ? `0${day}` : day}</span>
                <div className="flex justify-end uppercase text-[8px] md:text-[10px] font-black tracking-widest opacity-60">
                  {indicator || (data.status !== 'weekend' && data.status)}
                </div>
              </div>
            );
          })}
        </div>

        <div className="mt-16 pt-12 border-t-2 border-slate-50 flex flex-wrap gap-10 justify-center relative z-10">
          {[
            { label: "Present", color: "bg-emerald-500" },
            { label: "Absent", color: "bg-rose-500" },
            { label: "Late Arrival", color: "bg-amber-500" },
            { label: "Academic Break", color: "bg-slate-200" },
          ].map((legend, i) => (
            <div key={i} className="flex items-center gap-3">
              <div className={`w-2.5 h-2.5 ${legend.color} rounded-full`}></div>
              <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest">{legend.label}</span>
            </div>
          ))}
        </div>
      </div>

    
    </div>
  );
};

export default GuardianAttendance;
