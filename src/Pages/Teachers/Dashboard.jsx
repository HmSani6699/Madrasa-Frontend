import { useState } from "react";
import { 
  Users, 
  BookOpen, 
  Clock, 
  Bell, 
  ChevronRight,
  LayoutGrid
} from "lucide-react";
import { useTranslation } from "react-i18next";

const TeachersDashboard = () => {
   const { t } = useTranslation();

   const stats = [
      { label: t('teacher.dashboard.total_class'), value: "12", icon: BookOpen, color: "text-[#00bd7f]", bg: "bg-[#00bd7f]/10" },
      { label: t('teacher.dashboard.total_subject'), value: "12", icon: BookOpen, color: "text-[#00bd7f]", bg: "bg-[#00bd7f]/10" },
      { label: t('teacher.dashboard.my_students'), value: "128", icon: Users, color: "text-blue-600", bg: "bg-blue-50" },
   ];

   // Mock data - in a real app this might come from an API or also be localized if needed
   const schedule = [
      { time: "08:00 AM", subject: "Al-Quran (Hifz)", section: "Sec-A", room: "Hall 02", status: "finished" },
      { time: "10:30 AM", subject: "Arabic Nahw", section: "Sec-B", room: "Room 105", status: "ongoing" },
      { time: "02:00 PM", subject: "Islamic History", section: "Sec-A", room: "Main Room", status: "upcoming" },
   ];

   return (
    <div className="min-h-screen bg-slate-50/50 p-4 md:p-5 animate-in fade-in duration-500">
      <div className="max-w-[1600px] mx-auto space-y-6 md:space-y-10">
        
        {/* Stats Grid */}
        <div className="grid grid-cols-2 lg:grid-cols-3 gap-4 md:gap-8">
          {stats.map((stat, idx) => (
            <div key={idx} className="bg-white rounded-[20px] md:rounded-[20px] p-5 md:p-4 border border-slate-200 shadow-sm group hover:border-slate-300 transition-all active:scale-95 cursor-pointer flex items-center justify-between">
              <div>
                <p className="text-[9px] md:text-[10px] font-black text-slate-400 uppercase tracking-widest leading-none mb-1 md:mb-2">{stat.label}</p>
                <h3 className="text-xl md:text-3xl font-black text-slate-800 tracking-tight">{stat.value}</h3>
              </div>
              <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-4 md:mb-8">
                <div className={`w-10 h-10 md:w-14 md:h-14 ${stat.bg} ${stat.color} rounded-xl md:rounded-2xl flex items-center justify-center shadow-inner group-hover:scale-110 transition-transform`}>
                  <stat.icon className="w-5 h-5 md:w-7 md:h-7" />
                </div>
              </div>
            </div>
          ))}
        </div>

        <div className="grid grid-cols-1 xl:grid-cols-3 gap-6 md:gap-10">
          
          {/* Daily Schedule */}
          <div className="xl:col-span-2 bg-white rounded-[20px] md:rounded-[20px] p-4 md:p-5 border border-slate-200 shadow-sm animate-in slide-in-from-bottom duration-700">
             <div className="flex flex-col sm:flex-row items-center justify-between mb-8 md:mb-12 gap-6">
                <div className="flex items-center gap-4 w-full sm:w-auto">
                   <div className="w-10 h-10 md:w-12 md:h-12 bg-slate-900 rounded-xl md:rounded-2xl flex items-center justify-center shadow-lg">
                      <Clock className="w-5 h-5 md:w-6 md:h-6 text-white" />
                   </div>
                   <h2 className="text-lg md:text-xl font-black text-slate-800 tracking-tight ">{t('teacher.dashboard.todays_class')}</h2>
                </div>
                <button className="w-full sm:w-auto text-[10px] font-black text-[#00bd7f] uppercase tracking-widest hover:underline flex items-center justify-center sm:justify-start gap-2">
                   {t('teacher.dashboard.weekly_overview')} <ChevronRight className="w-4 h-4" />
                </button>
             </div>

             <div className="space-y-4 md:space-y-4">
                {schedule.map((item, i) => (
                   <div key={i} className={`group p-5 md:p-5 rounded-[20px] md:rounded-[20px] border border-slate-50 flex flex-col sm:flex-row sm:items-center justify-between gap-6 transition-all hover:bg-slate-50 ${item.status === 'ongoing' ? 'bg-[#00bd7f]/5 border-[#00bd7f]/20 shadow-lg shadow-[#00bd7f]/10' : ''}`}>
                      <div className="flex items-center gap-6">
                         <div className="text-center shrink-0 w-16">
                            <p className="text-sm md:text-lg font-black text-slate-800 leading-none mb-1 whitespace-nowrap">{item.time}</p>
                            <p className="text-[9px] md:text-[10px] font-black text-slate-400 uppercase tracking-widest leading-none">{t('teacher.dashboard.period')} {i+1}</p>
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
                            item.status === 'ongoing' ? 'bg-[#00bd7f] text-white border-[#00bd7f]' :
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
             <div className="bg-[#00bd7f] rounded-[20px] md:rounded-[20px] p-5 md:p-5 text-white shadow-xl shadow-[#00bd7f]/20 relative overflow-hidden group">
                <div className="absolute top-0 right-0 w-32 h-32 bg-white/10 rounded-bl-[5rem] -mr-8 -mt-8 blur-2xl"></div>
                <h3 className="text-lg md:text-xl font-black tracking-tight uppercase mb-6 flex items-center gap-3">
                   <Bell className="w-6 h-6" /> {t('teacher.dashboard.notices')}
                </h3>
                <div className="space-y-6 md:space-y-8">
                   <div className="p-4 bg-white/10 border border-white/5 rounded-2xl md:rounded-3xl hover:bg-white/15 transition-all">
                      <p className="text-[10px] font-black text-white/70 uppercase tracking-widest mb-1.5">Homework Pending</p>
                      <p className="text-sm font-bold leading-snug">Evaluation needed for Arabic Nahw - Section A</p>
                   </div>
                   <div className="p-4 bg-white/10 border border-white/5 rounded-2xl md:rounded-3xl hover:bg-white/15 transition-all">
                      <p className="text-[10px] font-black text-white/70 uppercase tracking-widest mb-1.5">Leave Request</p>
                      <p className="text-sm font-bold leading-snug">Approval pending for midterm leave (Next Week)</p>
                   </div>
                </div>
                <button className="w-full mt-8 md:mt-10 py-4 bg-white text-[#00bd7f] rounded-2xl font-black text-[10px] uppercase tracking-widest hover:bg-slate-50 transition-all shadow-lg active:scale-95 leading-none">
                   {t('teacher.dashboard.view_all_notifications')}
                </button>
             </div>
          </div>

        </div>

      </div>
    </div>
  );
};

export default TeachersDashboard;
