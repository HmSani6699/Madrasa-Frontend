import { useState } from "react";
import { 
  Users, 
  ChevronRight, 
  CreditCard, 
  GraduationCap, 
  Bell, 
  Calendar, 
  MessageSquare,
  ArrowUpRight,
  UserCheck,
  Activity,
  UserPlus
} from "lucide-react";

const GuardianDashboard = () => {
  const [selectedChild, setSelectedChild] = useState(0);

  const children = [
    { 
      id: 1, 
      name: "Abdullah Mamun", 
      class: "Mishkat (Sec A)", 
      attendance: "94%", 
      status: "Present", 
      dues: "৳ 2,500",
      initials: "AM",
      lastActivity: "Submitted Homework: Arabic Nahw"
    },
    { 
      id: 2, 
      name: "Zaid Bin Harith", 
      class: "Hifz (Sec B)", 
      attendance: "98%", 
      status: "Present", 
      dues: "৳ 1,200",
      initials: "ZH",
      lastActivity: "New Grade Posted: Tajweed"
    }
  ];

  const currentChild = children[selectedChild];

  return (
    <div className="min-h-screen bg-slate-50/50 p-4 md:p-8 animate-in fade-in duration-500">
      <div className="max-w-[1600px] mx-auto space-y-6 md:space-y-10">
        
        {/* Header with Child Selector */}
        <div className="bg-white rounded-[1.5rem] md:rounded-[3rem] p-6 md:p-10 border border-slate-200 shadow-sm">
           <div className="flex flex-col lg:flex-row justify-between items-start lg:items-center gap-8">
              <div className="flex items-center gap-4 md:gap-8">
                <div className="w-12 h-12 md:w-20 md:h-20 bg-slate-900 rounded-xl md:rounded-3xl flex items-center justify-center border border-slate-800 shadow-inner shrink-0">
                  <Users className="w-6 h-6 md:w-10 md:h-10 text-white" />
                </div>
                <div>
                  <h1 className="text-xl md:text-3xl font-black text-slate-800 tracking-tight uppercase leading-none mb-1 md:mb-3">Guardian Control Panel</h1>
                  <p className="text-slate-500 font-bold mt-1 text-xs md:text-base">Managing institutional progress for multiple enrolled children</p>
                </div>
              </div>

              {/* Child Switcher Chips */}
              <div className="flex flex-wrap gap-3 w-full lg:w-auto">
                 {children.map((child, idx) => (
                    <button 
                       key={child.id}
                       onClick={() => setSelectedChild(idx)}
                       className={`flex items-center gap-3 px-6 py-3 rounded-2xl md:rounded-3xl transition-all border ${
                          selectedChild === idx 
                          ? 'bg-slate-900 text-white border-slate-900 shadow-xl shadow-slate-200 scale-105' 
                          : 'bg-white text-slate-400 border-slate-200 hover:border-slate-300 hover:text-slate-600'
                       }`}
                    >
                       <div className={`w-8 h-8 rounded-xl flex items-center justify-center text-[10px] font-black ${
                          selectedChild === idx ? 'bg-white/20' : 'bg-slate-100'
                       }`}>
                          {child.initials}
                       </div>
                       <span className="text-xs font-black uppercase tracking-widest">{child.name}</span>
                       {selectedChild === idx && <div className="w-1.5 h-1.5 bg-emerald-400 rounded-full animate-pulse"></div>}
                    </button>
                 ))}
                 <button className="flex items-center justify-center w-12 h-12 rounded-2xl border border-dashed border-slate-300 text-slate-300 hover:border-indigo-500 hover:text-indigo-500 transition-all">
                    <UserPlus className="w-5 h-5" />
                 </button>
              </div>
           </div>
        </div>

        {/* Selected Child Summary Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
           <div className="bg-white p-6 md:p-8 rounded-[1.5rem] md:rounded-[2.5rem] border border-slate-200 shadow-sm group hover:border-emerald-200 transition-all cursor-pointer">
              <div className="flex justify-between items-start mb-6">
                 <div className="w-12 h-12 bg-emerald-50 rounded-2xl flex items-center justify-center text-emerald-600 shadow-inner">
                    <UserCheck className="w-6 h-6" />
                 </div>
                 <div className="text-right">
                    <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-1">Today's Status</p>
                    <span className="px-3 py-1 bg-emerald-100 text-emerald-700 text-[10px] font-black uppercase rounded-lg">PRESENT</span>
                 </div>
              </div>
              <p className="text-sm font-black text-slate-800 uppercase tracking-tight mb-1">Attendance Trend</p>
              <h4 className="text-3xl font-black text-slate-900">{currentChild.attendance}</h4>
           </div>

           <div className="bg-white p-6 md:p-8 rounded-[1.5rem] md:rounded-[2.5rem] border border-slate-200 shadow-sm group hover:border-rose-200 transition-all cursor-pointer">
              <div className="flex justify-between items-start mb-6">
                 <div className="w-12 h-12 bg-rose-50 rounded-2xl flex items-center justify-center text-rose-600 shadow-inner">
                    <CreditCard className="w-6 h-6" />
                 </div>
                 <ArrowUpRight className="w-5 h-5 text-slate-200 group-hover:text-rose-400" />
              </div>
              <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest leading-none mb-1">Pending Dues</p>
              <h4 className="text-3xl font-black text-rose-600 tracking-tight">{currentChild.dues}</h4>
              <p className="text-[10px] font-bold text-slate-400 mt-2 uppercase">Due by Jan 10, 2026</p>
           </div>

           <div className="bg-white p-6 md:p-8 rounded-[1.5rem] md:rounded-[2.5rem] border border-slate-200 shadow-sm group hover:border-indigo-200 transition-all cursor-pointer">
              <div className="flex justify-between items-start mb-6">
                 <div className="w-12 h-12 bg-indigo-50 rounded-2xl flex items-center justify-center text-indigo-600 shadow-inner">
                    <GraduationCap className="w-6 h-6" />
                 </div>
                 <ArrowUpRight className="w-5 h-5 text-slate-200 group-hover:text-indigo-400" />
              </div>
              <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest leading-none mb-1">Recent Performance</p>
              <h4 className="text-3xl font-black text-slate-900 tracking-tight">88.5%</h4>
              <p className="text-[10px] font-bold text-indigo-500 mt-2 uppercase tracking-widest">TOP 5% OF CLASS</p>
           </div>

           <div className="bg-slate-900 p-6 md:p-8 rounded-[1.5rem] md:rounded-[2.5rem] shadow-xl shadow-slate-200 group flex flex-col justify-between overflow-hidden relative">
              <Activity className="absolute -right-4 -bottom-4 w-32 h-32 text-white/5 rotate-12" />
              <div>
                 <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-4">Latest Interaction</p>
                 <div className="space-y-3 relative z-10">
                    <p className="text-sm font-black text-white uppercase tracking-tight leading-tight">{currentChild.lastActivity}</p>
                    <p className="text-[9px] font-bold text-slate-500 uppercase">2 Hours Ago</p>
                 </div>
              </div>
              <button className="w-full mt-6 py-3 bg-white/10 hover:bg-white/20 text-white rounded-xl text-[10px] font-black uppercase tracking-widest transition-all border border-white/5 backdrop-blur-sm">
                 Full Timeline
              </button>
           </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
           {/* Schedule & Daily Pulse */}
           <div className="lg:col-span-2 space-y-8">
              <div className="bg-white rounded-[1.5rem] md:rounded-[3rem] p-8 md:p-12 border border-slate-200 shadow-sm">
                 <div className="flex items-center justify-between mb-10">
                    <div className="flex items-center gap-4">
                       <Calendar className="w-6 h-6 text-slate-400" />
                       <h3 className="text-xl md:text-2xl font-black text-slate-800 uppercase tracking-tight leading-none">Current Week Schedule</h3>
                    </div>
                    <button className="text-[10px] font-black text-indigo-500 uppercase tracking-widest hover:underline">Download Timetable</button>
                 </div>
                 
                 <div className="space-y-4">
                    {[
                       { period: "08:30 AM", subject: "Al-Quran (Hifz)", teacher: "Sheikh Abdullah", room: "Hall 01" },
                       { period: "10:00 AM", subject: "Arabic Nahw", teacher: "Ustad Junaid", room: "Room 105" },
                       { period: "12:00 PM", subject: "Fiqh Basics", teacher: "Mufti Omar", room: "Main Room" }
                    ].map((item, idx) => (
                       <div key={idx} className="flex flex-col sm:flex-row sm:items-center justify-between p-6 bg-slate-50/50 rounded-2xl md:rounded-[2rem] border border-slate-50 hover:bg-slate-50 transition-all group">
                          <div className="flex items-center gap-6 mb-4 sm:mb-0">
                             <div className="w-14 h-14 bg-white rounded-2xl flex items-center justify-center font-black text-slate-400 text-xs shadow-sm border border-slate-100 group-hover:border-indigo-100 group-hover:text-indigo-600 transition-all">
                                {item.period.split(' ')[0]}
                             </div>
                             <div>
                                <h4 className="text-base font-black text-slate-800 uppercase tracking-tight">{item.subject}</h4>
                                <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">{item.teacher}</p>
                             </div>
                          </div>
                          <div className="flex items-center gap-4 sm:justify-end">
                             <span className="px-4 py-1.5 bg-white border border-slate-100 rounded-lg text-[10px] font-black text-slate-500 uppercase tracking-widest">{item.room}</span>
                             <button className="p-3 bg-white text-slate-300 rounded-xl hover:text-indigo-600 hover:border-indigo-100 border border-slate-100 transition-all">
                                <ChevronRight className="w-4 h-4" />
                             </button>
                          </div>
                       </div>
                    ))}
                 </div>
              </div>
           </div>

           {/* Communication Hub */}
           <div className="lg:col-span-1 space-y-8">
              <div className="bg-slate-900 rounded-[2rem] md:rounded-[3rem] p-8 md:p-10 text-white shadow-2xl relative overflow-hidden">
                 <Bell className="absolute -right-4 -top-4 w-32 h-32 text-white/5 -rotate-12" />
                 <h3 className="text-xl font-black uppercase tracking-tight mb-8 relative z-10">Institutional Notices</h3>
                 <div className="space-y-6 relative z-10 mb-10">
                    <div className="p-5 bg-white/5 rounded-2xl border border-white/5 hover:bg-white/10 transition-all cursor-pointer group">
                       <p className="text-[9px] font-black text-indigo-400 uppercase tracking-widest mb-2">Academic • Jan 08</p>
                       <p className="text-xs font-bold text-slate-200 leading-relaxed group-hover:text-white transition-colors">Mid-term results will be published on coming Saturday.</p>
                    </div>
                    <div className="p-5 bg-white/5 rounded-2xl border border-white/5 hover:bg-white/10 transition-all cursor-pointer group">
                       <p className="text-[9px] font-black text-amber-400 uppercase tracking-widest mb-2">Event • Jan 05</p>
                       <p className="text-xs font-bold text-slate-200 leading-relaxed group-hover:text-white transition-colors">Annual Jalsa scheduled for Feb 15. All parents invited.</p>
                    </div>
                 </div>
                 <button className="w-full py-5 bg-indigo-600 hover:bg-indigo-500 text-white rounded-3xl font-black text-[10px] uppercase tracking-widest transition-all shadow-xl shadow-indigo-900/20 active:scale-95 leading-none">
                    View Notice Board
                 </button>
              </div>

              <div className="bg-white rounded-[2rem] md:rounded-[3rem] p-8 border border-slate-200 shadow-sm flex flex-col items-center justify-center text-center group cursor-pointer hover:border-slate-300 transition-all">
                 <div className="w-16 h-16 bg-slate-50 rounded-2xl flex items-center justify-center text-slate-300 group-hover:text-indigo-600 group-hover:scale-110 transition-all mb-6">
                    <MessageSquare className="w-8 h-8" />
                 </div>
                 <h4 className="text-lg font-black text-slate-800 uppercase tracking-tight mb-2">Contact Classroom</h4>
                 <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest leading-relaxed px-4">Direct communication line with {currentChild.name.split(' ')[0]}'s teachers</p>
              </div>
           </div>
        </div>

      </div>
    </div>
  );
};

export default GuardianDashboard;
