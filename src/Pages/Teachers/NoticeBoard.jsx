import { useState } from "react";
import { 
  Bell, 
  ChevronRight, 
  Calendar, 
  Pin, 
  Info,
  Clock,
  Search,
  BookOpen,
  Filter,
  Megaphone
} from "lucide-react";

const TeacherNoticeBoard = () => {
  const notices = [
    { id: 1, title: "Mid-Term Examination Schedule", date: "Jan 15, 2026", type: "Academic", priority: "high" },
    { id: 2, title: "Staff Meeting for Annual Sports", date: "Jan 12, 2026", type: "Event", priority: "medium" },
    { id: 3, title: "Updated Syllabus for Mishkat Sec-A", date: "Jan 10, 2026", type: "Curriculum", priority: "medium" },
    { id: 4, title: "New Resource Center Guidelines", date: "Jan 08, 2026", type: "Guidelines", priority: "low" },
    { id: 5, title: "Emergency Holiday - Winter Storm", date: "Jan 05, 2026", type: "Holiday", priority: "high" },
  ];

  return (
    <div className="min-h-screen bg-slate-50/50 p-4 md:p-8 animate-in fade-in duration-500">
      <div className="max-w-5xl mx-auto space-y-6 md:space-y-10">
        
        {/* Header */}
        <div className="bg-white rounded-[1.5rem] md:rounded-[2.5rem] p-6 md:p-10 border border-slate-200 shadow-sm flex flex-col md:flex-row justify-between items-center gap-6">
          <div className="flex items-center gap-4 md:gap-8">
            <div className="w-12 h-12 md:w-20 md:h-20 bg-rose-50 rounded-xl md:rounded-3xl flex items-center justify-center border border-rose-100 shadow-inner shrink-0">
              <Megaphone className="w-6 h-6 md:w-10 md:h-10 text-rose-600" />
            </div>
            <div>
              <h1 className="text-xl md:text-3xl font-black text-slate-800 tracking-tight uppercase leading-none mb-1 md:mb-3">Institutional Notices</h1>
              <p className="text-slate-500 font-bold mt-1 text-xs md:text-base">Official communications, news, and urgent administrative alerts</p>
            </div>
          </div>
        </div>

        {/* Notices List */}
        <div className="space-y-4 md:space-y-6">
           {notices.map((notice) => (
              <div key={notice.id} className="bg-white rounded-[1.5rem] md:rounded-[2.5rem] p-6 md:p-8 border border-slate-200 shadow-sm hover:border-slate-300 transition-all group cursor-pointer relative overflow-hidden flex flex-col sm:flex-row items-center justify-between gap-6">
                 {notice.priority === 'high' && (
                    <div className="absolute top-0 left-0 w-2 h-full bg-rose-500 shadow-[2px_0_10px_rgba(244,63,94,0.3)]"></div>
                 )}
                 
                 <div className="flex items-center gap-6 w-full sm:w-auto">
                    <div className={`w-12 h-12 md:w-16 md:h-16 rounded-2xl md:rounded-3xl flex items-center justify-center shrink-0 shadow-inner transition-transform group-hover:scale-110 ${
                       notice.priority === 'high' ? 'bg-rose-50 text-rose-600' : 
                       notice.priority === 'medium' ? 'bg-amber-50 text-amber-600' : 'bg-slate-50 text-slate-400'
                    }`}>
                       <Bell className="w-6 h-6" />
                    </div>
                    <div className="min-w-0">
                       <h3 className="text-base md:text-lg font-black text-slate-800 uppercase tracking-tight mb-2 leading-tight group-hover:text-slate-900 transition-colors">{notice.title}</h3>
                       <div className="flex items-center gap-4">
                          <span className="flex items-center gap-2 text-[10px] font-black text-slate-400 uppercase tracking-widest border border-slate-50 px-3 py-1 bg-slate-50/50 rounded-lg shrink-0">
                             <Calendar className="w-3 h-3 text-slate-300" /> {notice.date}
                          </span>
                          <span className="px-3 py-1 bg-white border border-slate-100 rounded-lg text-[9px] font-black text-slate-400 uppercase tracking-[2px] hidden xs:block">{notice.type}</span>
                       </div>
                    </div>
                 </div>

                 <div className="flex items-center justify-between sm:justify-end gap-6 w-full sm:w-auto mt-4 sm:mt-0 pt-4 sm:pt-0 border-t sm:border-0 border-slate-100">
                    <span className={`px-4 py-1.5 rounded-full text-[9px] font-black uppercase tracking-widest border shadow-sm ${
                       notice.priority === 'high' ? 'bg-rose-600 text-white border-rose-700' :
                       notice.priority === 'medium' ? 'bg-amber-500 text-white border-amber-600' :
                       'bg-slate-100 text-slate-500 border-slate-200'
                    }`}>
                       {notice.priority} Priority
                    </span>
                    <button className="p-3 bg-white border border-slate-100 rounded-xl md:rounded-2xl text-slate-300 group-hover:text-slate-600 group-hover:border-slate-200 transition-all shadow-sm">
                       <ChevronRight className="w-5 h-5" />
                    </button>
                 </div>
              </div>
           ))}
        </div>

        {/* Info Box */}
        <div className="bg-slate-900 rounded-[2rem] md:rounded-[3rem] p-10 md:p-12 text-white shadow-2xl relative overflow-hidden group">
           <div className="absolute top-0 right-0 w-64 h-full bg-indigo-500/10 rounded-bl-[10rem] -mr-10 -mt-10 blur-3xl group-hover:bg-indigo-500/20 transition-all duration-1000"></div>
           <div className="relative z-10">
              <div className="flex items-center gap-4 mb-8">
                 <div className="w-12 h-12 md:w-16 md:h-16 bg-white/10 rounded-2xl md:rounded-3xl flex items-center justify-center backdrop-blur-md border border-white/5">
                    <Pin className="w-6 h-6 md:w-8 md:h-8 text-indigo-400" />
                 </div>
                 <h2 className="text-xl md:text-2xl font-black uppercase tracking-tight leading-none group-hover:translate-x-2 transition-transform">Important Archival Access</h2>
              </div>
              <p className="text-slate-400 font-bold text-sm md:text-lg mb-10 max-w-2xl leading-relaxed">All institutional records are digitally signed and archived for evaluation. Please contact the Registrar Office for older physical archives.</p>
              <button className="px-10 py-5 bg-white text-slate-900 rounded-2xl font-black text-[10px] md:text-[11px] uppercase tracking-widest hover:bg-slate-50 transition-all shadow-xl active:scale-95 leading-none">
                 Browse Notice Archive
              </button>
           </div>
        </div>

      </div>
    </div>
  );
};

export default TeacherNoticeBoard;
