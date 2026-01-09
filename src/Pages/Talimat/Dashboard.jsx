import { 
    GraduationCap, 
    BookOpen, 
    Calendar, 
    Users, 
    Clock, 
    Bell,
    CheckCircle2,
    AlertCircle,
    TrendingUp,
    FileText,
    Search
  } from "lucide-react";
  
  const TalimatDashboard = () => {
    return (
      <div className="min-h-screen bg-slate-50/50 p-4 md:p-8 animate-in fade-in duration-500">
        <div className="max-w-[1600px] mx-auto space-y-8">
          
          {/* Header Section */}
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
            <div>
              <div className="flex items-center gap-3 mb-2">
                <span className="px-3 py-1 bg-indigo-50 text-indigo-600 border border-indigo-100 rounded-full text-[10px] font-black uppercase tracking-widest">Education Secretary</span>
                <span className="px-3 py-1 bg-emerald-50 text-emerald-600 border border-emerald-100 rounded-full text-[10px] font-black uppercase tracking-widest">Active Session 2026</span>
              </div>
              <h1 className="text-3xl md:text-4xl font-black text-slate-800 tracking-tight uppercase">Academic Control Center</h1>
              <p className="text-slate-500 font-bold mt-2">Manage curriculum, examinations, and faculty performance</p>
            </div>
            
            <div className="flex items-center gap-4">
              <div className="relative hidden md:block group">
                 <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400 group-hover:text-indigo-500 transition-colors" />
                 <input className="pl-12 pr-6 py-3 bg-white border border-slate-200 rounded-full text-sm font-bold shadow-sm focus:border-indigo-500 hover:border-slate-300 outline-none transition-all w-64" placeholder="Search student or faculty..." />
              </div>
              <button className="w-12 h-12 bg-white border border-slate-200 rounded-full flex items-center justify-center text-slate-400 shadow-sm hover:text-indigo-600 hover:border-indigo-100 transition-all relative">
                 <Bell className="w-5 h-5" />
                 <span className="absolute top-3 right-3 w-2 h-2 bg-rose-500 rounded-full ring-2 ring-white"></span>
              </button>
            </div>
          </div>
  
          {/* Quick Stats */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {[
              { label: "Total Students", value: "842", sub: "+12 New Admissions", icon: Users, color: "text-indigo-600", bg: "bg-indigo-50" },
              { label: "Active Faculty", value: "48", sub: "96% Attendance Today", icon: GraduationCap, color: "text-emerald-600", bg: "bg-emerald-50" },
              { label: "Classes Today", value: "112", sub: "04 Rescheduled", icon: BookOpen, color: "text-amber-600", bg: "bg-amber-50" },
              { label: "Upcoming Exam", value: "15 Days", sub: "Mid-Term Exhibition", icon: Clock, color: "text-rose-600", bg: "bg-rose-50" },
            ].map((stat, idx) => (
              <div key={idx} className="bg-white p-6 rounded-[2rem] border border-slate-200 shadow-sm hover:shadow-md hover:border-slate-300 transition-all cursor-pointer group">
                <div className="flex items-start justify-between mb-4">
                  <div className={`w-12 h-12 ${stat.bg} ${stat.color} rounded-2xl flex items-center justify-center shadow-inner group-hover:scale-110 transition-transform`}>
                    <stat.icon className="w-6 h-6" />
                  </div>
                  <div className="px-3 py-1 bg-slate-50 rounded-lg border border-slate-100">
                    <TrendingUp className="w-4 h-4 text-slate-400" />
                  </div>
                </div>
                <h3 className="text-3xl font-black text-slate-800 mb-1">{stat.value}</h3>
                <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-2">{stat.label}</p>
                <div className="inline-block px-2 py-1 bg-slate-50 rounded text-[9px] font-bold text-slate-500 uppercase tracking-wider">
                  {stat.sub}
                </div>
              </div>
            ))}
          </div>
  
          {/* Main Content Grid */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            
            {/* Exam & Curriculum Status */}
            <div className="lg:col-span-2 space-y-8">
               <div className="bg-slate-900 rounded-[2.5rem] p-10 text-white relative overflow-hidden shadow-2xl">
                  <div className="absolute top-0 right-0 w-64 h-64 bg-white/5 rounded-full blur-3xl -mr-16 -mt-16"></div>
                  
                  <div className="relative z-10 flex flex-col md:flex-row items-center justify-between gap-8">
                     <div>
                        <div className="inline-flex items-center gap-2 px-4 py-2 bg-white/10 rounded-full border border-white/10 text-[10px] font-black uppercase tracking-widest mb-4">
                           <AlertCircle className="w-4 h-4 text-emerald-400" /> Priority Action
                        </div>
                        <h2 className="text-3xl font-black uppercase tracking-tight mb-2">Conduct Examination</h2>
                        <p className="text-slate-400 font-bold max-w-md">Mid-term exhibition setup requires approval. Hall allocation pending for Block C.</p>
                     </div>
                     <button className="px-8 py-4 bg-white text-slate-900 rounded-2xl font-black text-[11px] uppercase tracking-widest hover:bg-emerald-400 transition-colors shadow-lg active:scale-95">
                        Manage Exams
                     </button>
                  </div>
               </div>
  
               <div className="bg-white rounded-[2.5rem] border border-slate-200 shadow-sm p-8">
                  <div className="flex items-center justify-between mb-8">
                     <h3 className="text-xl font-black text-slate-800 uppercase tracking-tight">Daily Schedule Overview</h3>
                     <button className="text-[10px] font-black text-indigo-600 uppercase tracking-widest hover:underline">View Full Routine</button>
                  </div>
                  <div className="space-y-4">
                     {[
                        { time: "08:30 AM", class: "Hifz - Sec A", teacher: "Ustad Junaid", status: "Ongoing", color: "text-emerald-500" },
                        { time: "09:15 AM", class: "Arabic - Sec B", teacher: "Sheikh Abdullah", status: "Upcoming", color: "text-amber-500" },
                        { time: "10:00 AM", class: "Fiqh - Sec A", teacher: "Mufti Omar", status: "Scheduled", color: "text-slate-400" },
                     ].map((item, i) => (
                        <div key={i} className="flex items-center justify-between p-4 bg-slate-50 border border-slate-100 rounded-2xl hover:bg-white hover:border-indigo-100 hover:shadow-sm transition-all group">
                           <div className="flex items-center gap-4">
                              <div className="px-3 py-2 bg-white rounded-xl text-xs font-black text-slate-800 shadow-sm border border-slate-100">{item.time}</div>
                              <div>
                                 <h4 className="text-sm font-black text-slate-700 uppercase">{item.class}</h4>
                                 <p className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">{item.teacher}</p>
                              </div>
                           </div>
                           <div className={`flex items-center gap-2 text-[10px] font-black uppercase tracking-widest ${item.color}`}>
                              <span className={`w-2 h-2 rounded-full bg-current`}></span> {item.status}
                           </div>
                        </div>
                     ))}
                  </div>
               </div>
            </div>
  
            {/* Approvals & Notices */}
            <div className="space-y-8">
               <div className="bg-white rounded-[2.5rem] border border-slate-200 shadow-sm p-8 h-full">
                  <div className="flex items-center gap-4 mb-8">
                     <div className="w-12 h-12 bg-amber-50 rounded-2xl flex items-center justify-center text-amber-600">
                        <FileText className="w-6 h-6" />
                     </div>
                     <div>
                        <h3 className="text-lg font-black text-slate-800 uppercase tracking-tight leading-none">Pending Approvals</h3>
                        <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mt-1">Requires your attention</p>
                     </div>
                  </div>
  
                  <div className="space-y-4">
                     {[
                       "Leave Application - Sheikh Ahmed",
                       "Syllabus Update - English Dept",
                       "Exam Question Paper - Nahw"
                     ].map((task, i) => (
                        <div key={i} className="flex items-center gap-4 p-4 border border-dashed border-slate-200 rounded-2xl hover:bg-slate-50 transition-colors cursor-pointer group">
                           <div className="w-6 h-6 rounded-full border-2 border-slate-300 group-hover:border-indigo-500 flex items-center justify-center">
                              <div className="w-3 h-3 bg-indigo-500 rounded-full opacity-0 group-hover:opacity-100 transition-opacity"></div>
                           </div>
                           <span className="text-xs font-bold text-slate-600 group-hover:text-slate-900 transition-colors">{task}</span>
                        </div>
                     ))}
                  </div>
  
                  <button className="w-full mt-8 py-4 bg-slate-50 text-slate-500 rounded-xl font-black text-[10px] uppercase tracking-widest hover:bg-slate-900 hover:text-white transition-all">View All Requests</button>
               </div>
            </div>
  
          </div>
        </div>
      </div>
    );
  };
  
  export default TalimatDashboard;
