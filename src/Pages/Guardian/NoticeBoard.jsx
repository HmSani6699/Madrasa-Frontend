import { useState } from "react";
import { useAuth } from "../../context/AuthContext";
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
  Megaphone,
  AlertCircle,
  FileText,
  BadgeAlert
} from "lucide-react";

const GuardianNoticeBoard = () => {
  const { activeChild } = useAuth();
  const [filter, setFilter] = useState("all");

  const notices = [
    { 
      id: 1, 
      title: "Upcoming Parent-Teacher Conference", 
      date: "Feb 20, 2026", 
      type: "Official", 
      priority: "high",
      summary: "Scheduled discussion regarding academic progress and behavioral development for the current term."
    },
    { 
      id: 2, 
      title: "Annual Sports Day Logistics", 
      date: "Feb 15, 2026", 
      type: "Event", 
      priority: "medium",
      summary: "Details regarding house uniforms, timing, and venue for the upcoming sports festival."
    },
    { 
      id: 3, 
      title: "Revised Fee Structure (2026)", 
      date: "Jan 28, 2026", 
      type: "Finance", 
      priority: "medium",
      summary: "Updated information regarding monthly tuition and transport fees for the new academic cycle."
    },
    { 
      id: 4, 
      title: "New Resource Center Guidelines", 
      date: "Jan 10, 2026", 
      type: "Policy", 
      priority: "low",
      summary: "Enhanced safety and borrowing protocols for the school library and digital resource hub."
    },
    { 
      id: 5, 
      title: "Emergency Holiday Confirmation", 
      date: "Jan 05, 2026", 
      type: "Urgent", 
      priority: "high",
      summary: "Instructional facilities will remain closed due to projected extreme weather conditions."
    },
  ];

  const filteredNotices = filter === "all" ? notices : notices.filter(n => n.priority === filter);

  return (
    <div className="space-y-8 pb-12 animate-in fade-in duration-700">
      {/* Header Section */}
      <div className="bg-white rounded-[2.5rem] p-8 md:p-12 border-2 border-slate-50 shadow-sm flex flex-col lg:flex-row justify-between items-center gap-8 relative overflow-hidden">
        <div className="absolute -left-10 -top-10 w-40 h-40 bg-rose-50 rounded-full blur-3xl opacity-50"></div>
        <div className="flex items-center gap-6 relative z-10">
          <div className="w-16 h-16 md:w-20 md:h-20 bg-rose-600 rounded-2xl md:rounded-3xl flex items-center justify-center border-2 border-rose-500 shadow-xl text-white">
            <Megaphone className="w-8 h-8 md:w-10 md:h-10" />
          </div>
          <div>
            <h1 className="text-2xl md:text-4xl font-black text-slate-800 tracking-tight uppercase leading-none mb-2 md:mb-3">Bulletin Board</h1>
            <p className="text-slate-500 font-bold text-xs md:text-base">Important institution-wide alerts for {activeChild?.name || "Parents"}</p>
          </div>
        </div>
        
        <div className="flex bg-slate-100 p-2 rounded-[2rem] relative z-10">
           <button 
              onClick={() => setFilter("all")}
              className={`px-6 py-3 rounded-xl font-black text-[9px] uppercase tracking-widest transition-all ${filter === "all" ? "bg-white text-slate-900 shadow-lg" : "text-slate-400 hover:text-slate-600"}`}
           >
              All Alerts
           </button>
           <button 
              onClick={() => setFilter("high")}
              className={`px-6 py-3 rounded-xl font-black text-[9px] uppercase tracking-widest transition-all ${filter === "high" ? "bg-white text-rose-600 shadow-lg" : "text-slate-400 hover:text-slate-600"}`}
           >
              Critical Only
           </button>
        </div>
      </div>

      {/* Notices List */}
      <div className="grid grid-cols-1 gap-6">
         {filteredNotices.map((notice) => (
            <div key={notice.id} className="bg-white rounded-[2.5rem] p-8 md:p-10 border-2 border-slate-50 shadow-sm hover:border-slate-200 transition-all group cursor-pointer relative overflow-hidden">
               {notice.priority === 'high' && (
                  <div className="absolute top-0 right-0 p-8">
                     <BadgeAlert className="w-8 h-8 text-rose-500/20" />
                  </div>
               )}
               
               <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-8">
                  <div className="flex items-start gap-6">
                     <div className={`w-14 h-14 md:w-16 md:h-16 rounded-2xl md:rounded-3xl flex items-center justify-center shrink-0 shadow-inner group-hover:scale-110 transition-transform ${
                        notice.priority === 'high' ? 'bg-rose-50 text-rose-600' : 
                        notice.priority === 'medium' ? 'bg-amber-50 text-amber-600' : 'bg-slate-50 text-slate-400'
                     }`}>
                        <Bell className="w-7 h-7" />
                     </div>
                     <div className="space-y-2">
                        <div className="flex flex-wrap items-center gap-3">
                           <span className={`px-3 py-1 rounded-lg text-[9px] font-black uppercase tracking-widest border ${
                              notice.priority === 'high' ? 'bg-rose-600 text-white border-rose-700' :
                              notice.priority === 'medium' ? 'bg-amber-100 text-amber-700 border-amber-200' :
                              'bg-slate-100 text-slate-500 border-slate-200'
                           }`}>
                              {notice.priority}
                           </span>
                           <span className="text-[10px] font-black text-slate-300 uppercase tracking-widest">{notice.type}</span>
                        </div>
                        <h3 className="text-xl md:text-2xl font-black text-slate-800 uppercase tracking-tight group-hover:text-black transition-colors">{notice.title}</h3>
                        <p className="text-sm font-medium text-slate-500 max-w-2xl leading-relaxed">{notice.summary}</p>
                     </div>
                  </div>

                  <div className="flex flex-row md:flex-col items-center md:items-end justify-between w-full md:w-auto gap-4 pt-6 md:pt-0 border-t md:border-0 border-slate-50">
                     <div className="text-right">
                        <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-1">Published On</p>
                        <p className="text-sm font-black text-slate-900 uppercase tracking-tight">{notice.date}</p>
                     </div>
                     <button className="flex items-center gap-2 px-6 py-3 bg-slate-900 text-white rounded-xl font-black text-[9px] uppercase tracking-widest hover:bg-slate-800 transition-all shadow-xl active:scale-95 group-hover:translate-x-1">
                        View Full Details <ChevronRight className="w-4 h-4" />
                     </button>
                  </div>
               </div>
            </div>
         ))}
      </div>

     

    </div>
  );
};

export default GuardianNoticeBoard;
