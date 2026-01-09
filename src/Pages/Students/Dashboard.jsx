import { useState } from "react";
import { 
  Calendar, 
  Clock, 
  BookOpen, 
  Trophy, 
  Target, 
  Bell, 
  MapPin, 
  ChevronRight,
  User,
  ArrowRight,
  Star,
  Zap
} from "lucide-react";

const StudentDashboard = () => {
  const [greeting] = useState(() => {
    const hour = new Date().getHours();
    if (hour < 12) return "Good Morning";
    if (hour < 18) return "Good Afternoon";
    return "Good Evening";
  });

  return (
    <div className="min-h-screen bg-slate-50/50 p-4 md:p-8 animate-in fade-in duration-500">
      <div className="max-w-[1600px] mx-auto space-y-6 md:space-y-10">
        
        {/* Profile Header */}
        <div className="bg-white rounded-[1.5rem] md:rounded-[3rem] p-6 md:p-10 border border-slate-200 shadow-sm relative overflow-hidden">
           <div className="absolute top-0 right-0 w-64 h-full bg-slate-50 rounded-bl-[10rem] -mr-10 -mt-10 opacity-50"></div>
           <div className="flex flex-col lg:flex-row justify-between items-center gap-8 relative z-10">
              <div className="flex items-center gap-4 md:gap-8">
                <div className="w-16 h-16 md:w-24 md:h-24 bg-slate-900 rounded-[2rem] md:rounded-[3rem] p-1 shadow-2xl">
                   <div className="w-full h-full bg-slate-800 rounded-[1.5rem] md:rounded-[2.5rem] flex items-center justify-center font-black text-white text-2xl md:text-3xl border-2 border-white/10 uppercase shadow-inner">
                      AM
                   </div>
                </div>
                <div>
                  <h1 className="text-xl md:text-4xl font-black text-slate-800 tracking-tight uppercase leading-none mb-1 md:mb-3">{greeting}, Abdullah</h1>
                  <div className="flex items-center gap-4 text-slate-500 font-bold text-xs md:text-base">
                     <span className="flex items-center gap-2">Mishkat Department • Sec A <Star className="w-4 h-4 text-amber-500 fill-amber-500" /></span>
                  </div>
                </div>
              </div>

              <div className="flex flex-wrap justify-center lg:justify-end gap-3 w-full lg:w-auto">
                 <div className="px-6 py-4 bg-slate-50 rounded-2xl md:rounded-3xl border border-slate-100 flex items-center gap-4 group hover:bg-white hover:border-indigo-100 transition-all cursor-pointer">
                    <div className="w-10 h-10 bg-white rounded-xl flex items-center justify-center text-indigo-600 shadow-sm border border-slate-50 group-hover:scale-110 transition-transform">
                       <Zap className="w-5 h-5 fill-indigo-500" />
                    </div>
                    <div>
                       <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest leading-none mb-1">Weekly Streak</p>
                       <h4 className="text-base font-black text-slate-800">12 Days</h4>
                    </div>
                 </div>
                 <div className="px-6 py-4 bg-slate-900 rounded-2xl md:rounded-3xl shadow-xl shadow-slate-200 flex items-center gap-4 group cursor-pointer hover:bg-slate-800 transition-all">
                    <div className="w-10 h-10 bg-white/10 rounded-xl flex items-center justify-center text-white border border-white/5">
                       <Trophy className="w-5 h-5" />
                    </div>
                    <div>
                       <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest leading-none mb-1">Academic Rank</p>
                       <h4 className="text-base font-black text-white">#03 / 42</h4>
                    </div>
                 </div>
              </div>
           </div>
        </div>

        {/* Action Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
           <div className="bg-emerald-600 p-8 rounded-[2.5rem] shadow-xl shadow-emerald-100 group relative overflow-hidden cursor-pointer hover:-translate-y-1 transition-all">
              <BookOpen className="absolute -right-4 -bottom-4 w-32 h-32 text-white/10 -rotate-12 group-hover:rotate-0 transition-transform duration-700" />
              <div className="relative z-10">
                 <p className="text-[10px] font-black text-emerald-100 uppercase tracking-widest mb-6">Homework Status</p>
                 <h3 className="text-2xl font-black text-white leading-tight mb-2">03 Assignments Pending</h3>
                 <p className="text-emerald-100/60 font-medium text-xs">Next deadline: Arabic Nahw (Tomorrow)</p>
              </div>
              <button className="mt-8 flex items-center gap-2 text-white font-black text-[10px] uppercase tracking-widest group-hover:translate-x-2 transition-transform">
                 Go to Portal <ArrowRight className="w-4 h-4" />
              </button>
           </div>

           <div className="bg-white p-8 rounded-[2.5rem] border border-slate-200 shadow-sm group hover:border-indigo-100 transition-all cursor-pointer">
              <div className="w-14 h-14 bg-indigo-50 rounded-2xl flex items-center justify-center text-indigo-600 mb-8 shadow-inner group-hover:scale-110 transition-transform">
                 <Calendar className="w-7 h-7" />
              </div>
              <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-1">Today's Class</p>
              <h3 className="text-xl font-black text-slate-800 uppercase tracking-tight">04 Periods Scheduled</h3>
              <div className="mt-6 flex items-center gap-2 text-indigo-600 font-black text-[9px] uppercase tracking-widest">
                 View Timetable <ChevronRight className="w-4 h-4" />
              </div>
           </div>

           <div className="bg-white p-8 rounded-[2.5rem] border border-slate-200 shadow-sm group hover:border-amber-100 transition-all cursor-pointer">
              <div className="w-14 h-14 bg-amber-50 rounded-2xl flex items-center justify-center text-amber-600 mb-8 shadow-inner group-hover:scale-110 transition-transform">
                 <Target className="w-7 h-7" />
              </div>
              <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-1">Exam Progress</p>
              <h3 className="text-xl font-black text-slate-800 uppercase tracking-tight">Mid-Term Evaluated</h3>
              <div className="mt-6 flex items-center gap-2 text-amber-600 font-black text-[9px] uppercase tracking-widest">
                 Download Report <ChevronRight className="w-4 h-4" />
              </div>
           </div>

           <div className="bg-slate-900 p-8 rounded-[2.5rem] shadow-2xl shadow-slate-200 relative overflow-hidden group">
              <Bell className="absolute -right-4 -top-4 w-32 h-32 text-white/5 rotate-12" />
              <div className="relative z-10 flex flex-col h-full justify-between">
                 <div>
                    <p className="text-[10px] font-black text-slate-500 uppercase tracking-widest mb-4 flex items-center gap-2">
                       <span className="w-1.5 h-1.5 bg-indigo-400 rounded-full"></span> Latest Notice
                    </p>
                    <p className="text-sm font-black text-white uppercase tracking-tight leading-relaxed mb-1">Annual Sports Registration Started</p>
                    <p className="text-[9px] font-bold text-slate-600 uppercase">Released Today</p>
                 </div>
                 <button className="w-full mt-8 py-3 bg-white/5 hover:bg-white/10 text-white border border-white/5 rounded-2xl text-[10px] font-black uppercase tracking-widest transition-all backdrop-blur-md">
                    Read More
                 </button>
              </div>
           </div>
        </div>

        {/* Daily Timeline */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
           <div className="lg:col-span-2">
              <div className="bg-white rounded-[1.5rem] md:rounded-[3rem] p-8 md:p-12 border border-slate-200 shadow-sm">
                 <div className="flex items-center justify-between mb-10">
                    <div className="flex items-center gap-4">
                       <Clock className="w-6 h-6 text-slate-400" />
                       <h3 className="text-xl md:text-2xl font-black text-slate-800 uppercase tracking-tight leading-none">Your Daily Timeline</h3>
                    </div>
                    <div className="hidden sm:flex items-center gap-2 text-[10px] font-black text-slate-400 uppercase tracking-widest px-4 py-2 bg-slate-50 rounded-full">
                       Jan 09, 2026 • Friday
                    </div>
                 </div>

                 <div className="relative">
                    {/* Vertical Line */}
                    <div className="absolute left-7 top-0 bottom-0 w-1 bg-slate-50 rounded-full hidden sm:block"></div>
                    
                    <div className="space-y-8">
                       {[
                          { time: "08:30 AM", title: "Al-Quran Tajweed", type: "Academic", location: "Hall 01", active: true },
                          { time: "10:15 AM", title: "Arabic Grammar", type: "Language", location: "Room 105", active: false },
                          { time: "12:00 PM", title: "Fiqh & Sunnah", type: "Shariah", location: "Main Room", active: false },
                          { time: "02:30 PM", title: "Institutional Assembly", type: "Event", location: "Auditorium", active: false }
                       ].map((item, idx) => (
                          <div key={idx} className="relative flex flex-col sm:flex-row sm:items-center gap-6 sm:gap-12 pl-0 sm:pl-4 group">
                             {/* Timeline Dot */}
                             <div className={`hidden sm:flex absolute left-0 w-6 h-6 rounded-full border-4 border-white shadow-md z-10 transition-transform group-hover:scale-125 ${
                                item.active ? 'bg-indigo-500 ring-4 ring-indigo-50' : 'bg-slate-200'
                             }`}></div>
                             
                             <div className="flex-1 p-6 bg-slate-50/50 rounded-2xl md:rounded-[2rem] border border-slate-50 group-hover:bg-white group-hover:border-indigo-100 hover:shadow-xl hover:shadow-indigo-50 transition-all ml-0 sm:ml-8">
                                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                                   <div>
                                      <div className="flex items-center gap-3 mb-2">
                                         <span className="text-[10px] font-black text-indigo-500 uppercase tracking-widest">{item.time}</span>
                                         <span className="w-1 h-1 bg-slate-300 rounded-full"></span>
                                         <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest">{item.type}</span>
                                      </div>
                                      <h4 className="text-lg font-black text-slate-800 uppercase tracking-tight">{item.title}</h4>
                                   </div>
                                   <div className="flex items-center gap-3 bg-white px-4 py-2 rounded-xl border border-slate-100 shadow-sm shrink-0">
                                      <MapPin className="w-3.5 h-3.5 text-slate-300" />
                                      <span className="text-[10px] font-black text-slate-500 uppercase tracking-widest">{item.location}</span>
                                   </div>
                                </div>
                             </div>
                          </div>
                       ))}
                    </div>
                 </div>
              </div>
           </div>

           {/* Quick Resources */}
           <div className="space-y-8">
              <div className="bg-white rounded-[2rem] md:rounded-[3rem] p-8 md:p-10 border border-slate-200 shadow-sm">
                 <h3 className="text-xl font-black uppercase tracking-tight mb-8">Access Resources</h3>
                 <div className="grid grid-cols-2 gap-4">
                    {[
                       { label: "My Library", icon: BookOpen, color: "text-indigo-600", bg: "bg-indigo-50" },
                       { label: "Result Slip", icon: Target, color: "text-emerald-600", bg: "bg-emerald-50" },
                       { label: "E-Books", icon: Star, color: "text-amber-600", bg: "bg-amber-50" },
                       { label: "Messages", icon: Bell, color: "text-rose-600", bg: "bg-rose-50" }
                    ].map((btn, i) => (
                       <button key={i} className="flex flex-col items-center justify-center p-6 bg-slate-50 rounded-[2rem] border border-slate-50 hover:bg-white hover:border-slate-200 transition-all group shadow-sm active:scale-95">
                          <div className={`w-12 h-12 ${btn.bg} ${btn.color} rounded-2xl flex items-center justify-center mb-4 shadow-inner group-hover:scale-110 transition-transform`}>
                             <btn.icon className="w-6 h-6" />
                          </div>
                          <span className="text-[10px] font-black text-slate-500 uppercase tracking-widest">{btn.label}</span>
                       </button>
                    ))}
                 </div>
              </div>

              <div className="bg-slate-900 rounded-[2rem] md:rounded-[3rem] p-10 text-white relative overflow-hidden group cursor-pointer shadow-2xl shadow-indigo-100">
                 <div className="absolute inset-0 bg-indigo-600 translate-y-full group-hover:translate-y-0 transition-transform duration-500"></div>
                 <div className="relative z-10 text-center">
                    <User className="w-12 h-12 mx-auto mb-6 opacity-30 group-hover:opacity-100 transition-opacity" />
                    <h4 className="text-lg font-black uppercase tracking-tight mb-2">Student Digital ID</h4>
                    <p className="text-[10px] font-black text-slate-500 group-hover:text-indigo-100 uppercase tracking-widest">Generate QR for Entry</p>
                 </div>
              </div>
           </div>
        </div>

      </div>
    </div>
  );
};

export default StudentDashboard;
