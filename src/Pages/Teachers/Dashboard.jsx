import { useState } from "react";
import { 
  Users, 
  BookOpen, 
  Calendar, 
  Clock, 
  Award, 
  Bell, 
  TrendingUp,
  MessageSquare,
  ChevronRight,
  LayoutGrid,
  CheckCircle2
} from "lucide-react";

const TeachersDashboard = () => {
  const stats = [
    { label: "My Students", value: "128", icon: Users, color: "text-blue-600", bg: "bg-blue-50" },
    { label: "Daily Attend.", value: "94%", icon: CheckCircle2, color: "text-emerald-600", bg: "bg-emerald-50" },
    { label: "Assignments", value: "12", icon: BookOpen, color: "text-indigo-600", bg: "bg-indigo-50" },
    { label: "Exam Papers", value: "05", icon: Award, color: "text-amber-600", bg: "bg-amber-50" },
  ];

  const schedule = [
    { time: "08:00 AM", subject: "Al-Quran (Hifz)", section: "Sec-A", room: "Hall 02", status: "finished" },
    { time: "10:30 AM", subject: "Arabic Nahw", section: "Sec-B", room: "Room 105", status: "ongoing" },
    { time: "02:00 PM", subject: "Islamic History", section: "Sec-A", room: "Main Room", status: "upcoming" },
  ];

  return (
    <div className="min-h-screen bg-slate-50/50 p-4 md:p-8 animate-in fade-in duration-500">
      <div className="max-w-[1600px] mx-auto space-y-6 md:space-y-10">
        
        {/* Morning Greeting */}
        <div className="bg-slate-900 rounded-[1.5rem] md:rounded-[3rem] p-6 md:p-12 text-white shadow-2xl relative overflow-hidden group">
          <div className="absolute top-0 right-0 w-64 md:w-96 h-full bg-emerald-500/10 rounded-bl-[5rem] md:rounded-bl-[10rem] -mr-10 -mt-10 blur-3xl group-hover:bg-emerald-500/20 transition-all duration-1000"></div>
          <div className="relative z-10 flex flex-col md:flex-row justify-between items-start md:items-center gap-8">
            <div>
              <div className="flex items-center gap-3 mb-4 md:mb-6">
                 <div className="px-3 py-1 bg-white/10 rounded-full text-[10px] font-black uppercase tracking-[2px] backdrop-blur-md border border-white/5">
                    Spring Semester 2026
                 </div>
                 <div className="px-3 py-1 bg-emerald-500/20 text-emerald-400 rounded-full text-[10px] font-black uppercase tracking-[2px] border border-emerald-500/20">
                    Live Session
                 </div>
              </div>
              <h1 className="text-3xl md:text-5xl font-black tracking-tight mb-3 md:mb-4 uppercase leading-none">Assalamu Alaikum,<br/><span className="text-emerald-400">Sheikh Abdullah</span></h1>
              <p className="text-slate-400 font-bold text-sm md:text-lg max-w-xl text-balance">Your classes are ready for today. You have 3 periods remaining and 5 pending homework evaluations.</p>
            </div>
            <div className="bg-white/5 backdrop-blur-xl border border-white/10 rounded-[2rem] p-6 md:p-8 shrink-0 w-full md:w-auto">
               <div className="flex gap-10 md:gap-12 text-center md:text-left">
                  <div className="flex-1 md:flex-none">
                     <p className="text-[10px] font-black text-slate-500 uppercase tracking-widest mb-2">Today's Date</p>
                     <p className="text-xl md:text-2xl font-black">Jan 09, 2026</p>
                  </div>
                  <div className="w-px h-12 bg-white/10"></div>
                  <div className="flex-1 md:flex-none">
                     <p className="text-[10px] font-black text-slate-500 uppercase tracking-widest mb-2">Hijri Date</p>
                     <p className="text-xl md:text-2xl font-black leading-tight">19 Rajab 1447</p>
                  </div>
               </div>
            </div>
          </div>
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 md:gap-8">
          {stats.map((stat, idx) => (
            <div key={idx} className="bg-white rounded-2xl md:rounded-[2.5rem] p-5 md:p-8 border border-slate-200 shadow-sm group hover:border-slate-300 transition-all active:scale-95 cursor-pointer">
              <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-4 md:mb-8">
                <div className={`w-10 h-10 md:w-14 md:h-14 ${stat.bg} ${stat.color} rounded-xl md:rounded-2xl flex items-center justify-center shadow-inner group-hover:scale-110 transition-transform`}>
                  <stat.icon className="w-5 h-5 md:w-7 md:h-7" />
                </div>
                <TrendingUp className="w-4 h-4 text-slate-200 group-hover:text-emerald-500 transition-colors hidden md:block" />
              </div>
              <div>
                <p className="text-[9px] md:text-[10px] font-black text-slate-400 uppercase tracking-widest leading-none mb-1 md:mb-2">{stat.label}</p>
                <h3 className="text-xl md:text-3xl font-black text-slate-800 tracking-tight">{stat.value}</h3>
              </div>
            </div>
          ))}
        </div>

        <div className="grid grid-cols-1 xl:grid-cols-3 gap-6 md:gap-10">
          
          {/* Daily Schedule */}
          <div className="xl:col-span-2 bg-white rounded-[1.5rem] md:rounded-[3rem] p-6 md:p-10 border border-slate-200 shadow-sm animate-in slide-in-from-bottom duration-700">
             <div className="flex flex-col sm:flex-row items-center justify-between mb-8 md:mb-12 gap-6">
                <div className="flex items-center gap-4 w-full sm:w-auto">
                   <div className="w-10 h-10 md:w-12 md:h-12 bg-slate-900 rounded-xl md:rounded-2xl flex items-center justify-center shadow-lg">
                      <Clock className="w-5 h-5 md:w-6 md:h-6 text-white" />
                   </div>
                   <h2 className="text-lg md:text-xl font-black text-slate-800 tracking-tight uppercase">Today's Timeline</h2>
                </div>
                <button className="w-full sm:w-auto text-[10px] font-black text-blue-600 uppercase tracking-widest hover:underline flex items-center justify-center sm:justify-start gap-2">
                   Weekly Overview <ChevronRight className="w-4 h-4" />
                </button>
             </div>

             <div className="space-y-4 md:space-y-6">
                {schedule.map((item, i) => (
                   <div key={i} className={`group p-5 md:p-8 rounded-2xl md:rounded-[2.5rem] border border-slate-50 flex flex-col sm:flex-row sm:items-center justify-between gap-6 transition-all hover:bg-slate-50 ${item.status === 'ongoing' ? 'bg-indigo-50/50 border-indigo-100 shadow-lg shadow-indigo-100/20' : ''}`}>
                      <div className="flex items-center gap-6">
                         <div className="text-center shrink-0 w-16">
                            <p className="text-sm md:text-lg font-black text-slate-800 leading-none mb-1">{item.time}</p>
                            <p className="text-[9px] md:text-[10px] font-black text-slate-400 uppercase tracking-widest leading-none">Period {i+1}</p>
                         </div>
                         <div className="w-px h-10 bg-slate-200 hidden sm:block"></div>
                         <div>
                            <h4 className="text-base md:text-lg font-black text-slate-800 uppercase tracking-tight mb-1">{item.subject}</h4>
                            <div className="flex flex-wrap items-center gap-3 md:gap-4">
                               <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest flex items-center gap-1">
                                  <Users className="w-3 h-3" /> {item.section}
                               </span>
                               <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest flex items-center gap-1">
                                  <LayoutGrid className="w-3 h-3" /> {item.room}
                               </span>
                            </div>
                         </div>
                      </div>
                      <div className="flex items-center justify-between sm:justify-end gap-6 w-full sm:w-auto mt-0 pt-4 sm:pt-0 sm:border-0 border-t border-slate-100">
                         <span className={`px-4 py-1.5 rounded-full text-[9px] font-black uppercase tracking-widest border ${
                            item.status === 'ongoing' ? 'bg-indigo-600 text-white border-indigo-700' :
                            item.status === 'finished' ? 'bg-emerald-50 text-emerald-600 border-emerald-100' :
                            'bg-slate-50 text-slate-400 border-slate-100'
                         }`}>
                            {item.status}
                         </span>
                         <button className="p-3 bg-white border border-slate-100 rounded-xl text-slate-300 hover:text-slate-600 transition-all">
                            <ChevronRight className="w-5 h-5" />
                         </button>
                      </div>
                   </div>
                ))}
             </div>
          </div>

          {/* Action Center / Notices */}
          <div className="space-y-6 md:space-y-10">
             <div className="bg-indigo-600 rounded-[1.5rem] md:rounded-[3rem] p-8 md:p-10 text-white shadow-xl shadow-indigo-100 relative overflow-hidden group">
                <div className="absolute top-0 right-0 w-32 h-32 bg-white/10 rounded-bl-[5rem] -mr-8 -mt-8 blur-2xl"></div>
                <h3 className="text-lg md:text-xl font-black tracking-tight uppercase mb-6 flex items-center gap-3">
                   <Bell className="w-6 h-6" /> Attention Needed
                </h3>
                <div className="space-y-6 md:space-y-8">
                   <div className="p-4 bg-white/10 border border-white/5 rounded-2xl md:rounded-3xl hover:bg-white/15 transition-all">
                      <p className="text-[10px] font-black text-indigo-200 uppercase tracking-widest mb-1.5">Homework Pending</p>
                      <p className="text-sm font-bold leading-snug">Evaluation needed for Arabic Nahw - Section A</p>
                   </div>
                   <div className="p-4 bg-white/10 border border-white/5 rounded-2xl md:rounded-3xl hover:bg-white/15 transition-all">
                      <p className="text-[10px] font-black text-indigo-200 uppercase tracking-widest mb-1.5">Leave Request</p>
                      <p className="text-sm font-bold leading-snug">Approval pending for midterm leave (Next Week)</p>
                   </div>
                </div>
                <button className="w-full mt-8 md:mt-10 py-4 bg-white text-indigo-600 rounded-2xl font-black text-[10px] uppercase tracking-widest hover:bg-slate-50 transition-all shadow-lg active:scale-95 leading-none">
                   View All Notifications
                </button>
             </div>

             <div className="bg-white rounded-[1.5rem] md:rounded-[3rem] p-8 md:p-10 border border-slate-200 shadow-sm">
                <h3 className="text-lg font-black text-slate-800 tracking-tight uppercase mb-8 flex items-center gap-3">
                   <MessageSquare className="w-6 h-6 text-slate-400" /> Recent Messages
                </h3>
                <div className="space-y-6">
                   {[1, 2].map((i) => (
                      <div key={i} className="flex gap-4 group cursor-pointer border-b border-slate-50 pb-4 last:border-0 last:pb-0">
                         <div className="w-12 h-12 bg-slate-100 rounded-2xl flex-shrink-0 flex items-center justify-center font-black text-slate-400 group-hover:scale-110 transition-transform shadow-inner">
                            {i === 1 ? 'AK' : 'BM'}
                         </div>
                         <div className="min-w-0">
                            <p className="text-xs font-black text-slate-800 mb-0.5">{i === 1 ? 'Ahmed Kabir' : 'Bilal Mahmud'}</p>
                            <p className="text-[11px] font-bold text-slate-400 truncate">As-salam, I have a doubt regarding today's syntax lesson...</p>
                         </div>
                      </div>
                   ))}
                </div>
             </div>
          </div>

        </div>

      </div>
    </div>
  );
};

export default TeachersDashboard;
