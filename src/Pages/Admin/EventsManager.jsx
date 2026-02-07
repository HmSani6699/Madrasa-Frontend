import { useState } from "react";
import { 
  CalendarDays, 
  Search, 
  Filter, 
  Plus, 
  MapPin, 
  Clock, 
  Users, 
  MoreVertical, 
  ChevronRight,
  Star,
  CheckCircle2,
  Calendar,
  AlertCircle
} from "lucide-react";

const EventsManager = () => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [events] = useState([
    { id: 1, title: "Annual Sports Day 2026", date: "2026-02-15", time: "09:00 AM", location: "Main Ground", attendees: "All Students", status: "planned", priority: "high" },
    { id: 2, title: "Parent-Teacher Meeting", date: "2026-01-20", time: "10:30 AM", location: "Conference Hall", attendees: "Parents & Teachers", status: "active", priority: "medium" },
    { id: 3, title: "Inter-Class Qira'at Competition", date: "2026-02-01", time: "02:00 PM", location: "Prayer Hall", attendees: "Selected Students", status: "planned", priority: "high" },
    { id: 4, title: "Winter Vacation Startup", date: "2025-12-25", time: "08:00 AM", location: "Campus Wide", attendees: "All", status: "completed", priority: "low" },
  ]);

  return (
    <div className="min-h-screen bg-slate-50/50 p-4 md:p-8 animate-in fade-in duration-500">
      <div className="max-w-[1600px] mx-auto space-y-8">
        
        {/* Header Section */}
        <div className="bg-white rounded-[2.5rem] border border-slate-200 p-8 shadow-sm flex flex-col lg:flex-row justify-between items-center gap-6">
          <div className="flex items-center gap-6">
            <div className="w-16 h-16 bg-rose-50 rounded-2xl flex items-center justify-center border border-rose-100 shadow-inner">
              <CalendarDays className="w-8 h-8 text-rose-600" />
            </div>
            <div>
              <h1 className="text-2xl md:text-3xl font-black text-slate-800 tracking-tight">Events Management</h1>
             
            </div>
          </div>

          <button 
            onClick={() => setIsModalOpen(true)}
            className="w-full lg:w-auto px-8 py-4 bg-rose-600 text-white rounded-2xl font-black shadow-xl shadow-rose-100 hover:bg-rose-700 hover:scale-[1.02] active:scale-95 transition-all flex items-center justify-center gap-3 whitespace-nowrap"
          >
            <Plus className="w-5 h-5" />
            Create New Event
          </button>
        </div>

        <div className="grid grid-cols-1 xl:grid-cols-4 gap-8">
          
          {/* Left Side: Calendar Overview (Simplified High-End UI) */}
          <div className="xl:col-span-1 space-y-6">
             <div className="bg-white rounded-[2.5rem] border border-slate-200 p-8 shadow-sm">
                <div className="flex items-center justify-between mb-8">
                   <h2 className="text-xl font-black text-slate-800 tracking-tight">January 2026</h2>
                   <div className="flex gap-2">
                      <button className="p-2 hover:bg-slate-50 rounded-xl transition-all"><ChevronRight className="w-4 h-4 text-slate-400 rotate-180" /></button>
                      <button className="p-2 hover:bg-slate-50 rounded-xl transition-all"><ChevronRight className="w-4 h-4 text-slate-400" /></button>
                   </div>
                </div>

                <div className="grid grid-cols-7 gap-2 text-center text-[10px] font-black text-slate-400 uppercase tracking-widest mb-4">
                   {['M', 'T', 'W', 'T', 'F', 'S', 'S'].map(d => <div key={d}>{d}</div>)}
                </div>
                
                <div className="grid grid-cols-7 gap-2">
                   {Array.from({ length: 31 }).map((_, i) => (
                      <div 
                         key={i} 
                         className={`aspect-square rounded-xl flex items-center justify-center text-xs font-bold transition-all cursor-pointer border ${
                           i + 1 === 20 
                             ? 'bg-rose-600 border-rose-600 text-white shadow-lg shadow-rose-100' 
                             : 'bg-slate-50 border-transparent text-slate-500 hover:border-slate-200'
                         }`}
                      >
                         {i + 1}
                      </div>
                   ))}
                </div>

                <div className="mt-10 space-y-4">
                   <div className="p-4 bg-rose-50 rounded-2xl border border-rose-100">
                      <p className="text-[10px] font-black text-rose-400 uppercase tracking-widest">Today's Highlight</p>
                      <p className="text-sm font-black text-rose-600 mt-1">Founders' Day Prep</p>
                   </div>
                </div>
             </div>

             {/* Quick Filter */}
             <div className="bg-slate-900 rounded-[2.5rem] p-8 text-white shadow-2xl relative overflow-hidden group">
                <Star className="absolute -right-4 -bottom-4 w-32 h-32 text-white opacity-5 group-hover:rotate-12 transition-transform duration-700" />
                <h3 className="text-xl font-black tracking-tight relative z-10">Premium Events</h3>
                <p className="text-slate-400 text-sm font-bold mt-4 relative z-10 leading-relaxed">Ensure all mega-events are coordinated with the district education board for official recognition.</p>
                <button className="mt-8 text-rose-400 text-xs font-black uppercase tracking-widest flex items-center gap-2 hover:text-rose-300 transition-colors relative z-10">
                   Check Guidelines <ChevronRight className="w-4 h-4" />
                </button>
             </div>
          </div>

          {/* Right Side: Events Feed */}
          <div className="xl:col-span-3 space-y-6">
             <div className="flex flex-col md:flex-row gap-4 mb-4">
                <div className="flex-1 relative">
                   <Search className="absolute left-6 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400" />
                   <input className="w-full bg-white border border-slate-200 rounded-2xl pl-14 pr-6 py-4 text-sm font-bold focus:border-rose-500 outline-none shadow-sm" placeholder="Search events..." />
                </div>
                <div className="flex gap-4">
                   <button className="px-6 py-4 bg-white border border-slate-200 rounded-2xl flex items-center gap-3 font-bold text-slate-600 hover:bg-slate-50 shadow-sm transition-all text-sm">
                      <Filter className="w-4 h-4" /> Priority
                   </button>
                   <button className="px-6 py-4 bg-white border border-slate-200 rounded-2xl flex items-center gap-3 font-bold text-slate-600 hover:bg-slate-50 shadow-sm transition-all text-sm">
                      <CheckCircle2 className="w-4 h-4" /> Active Only
                   </button>
                </div>
             </div>

             {/* Events List */}
             <div className="space-y-6">
                {events.map((event) => (
                   <div key={event.id} className="group bg-white rounded-[2.5rem] border border-slate-200 p-8 hover:shadow-2xl hover:border-rose-200 transition-all duration-500 flex flex-col md:flex-row items-center gap-8 relative overflow-hidden">
                      <div className={`absolute top-0 right-0 w-2 h-full ${event.priority === 'high' ? 'bg-rose-500' : event.priority === 'medium' ? 'bg-amber-500' : 'bg-slate-200'}`}></div>

                      {/* Date Block */}
                      <div className="flex flex-col items-center justify-center w-24 h-24 bg-slate-50 rounded-3xl border border-slate-100 group-hover:bg-rose-50 group-hover:border-rose-100 transition-colors shrink-0">
                         <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest uppercase">{new Date(event.date).toLocaleDateString('en-US', { month: 'short' })}</span>
                         <span className="text-3xl font-black text-slate-800 group-hover:text-rose-600">{new Date(event.date).getDate()}</span>
                      </div>

                      {/* Details */}
                      <div className="flex-1 space-y-4 text-center md:text-left">
                         <div>
                            <div className="flex items-center justify-center md:justify-start gap-3 mb-2">
                               <span className={`px-4 py-1 rounded-full text-[10px] font-black uppercase tracking-widest border ${
                                 event.status === 'active' ? 'bg-emerald-50 text-emerald-600 border-emerald-100' : 
                                 event.status === 'planned' ? 'bg-blue-50 text-blue-600 border-blue-100' : 
                                 'bg-slate-50 text-slate-400 border-slate-100'
                               }`}>
                                 {event.status}
                               </span>
                               {event.priority === 'high' && (
                                 <span className="flex items-center gap-1 text-[10px] font-black text-rose-500 uppercase tracking-widest">
                                    <AlertCircle className="w-3.5 h-3.5" /> Urgent
                                 </span>
                               )}
                            </div>
                            <h3 className="text-2xl font-black text-slate-800 tracking-tight group-hover:text-rose-600 transition-colors uppercase tracking-tighter">{event.title}</h3>
                         </div>

                         <div className="flex flex-wrap items-center justify-center md:justify-start gap-6 text-slate-500 font-bold text-sm">
                            <div className="flex items-center gap-2"><Clock className="w-4 h-4 text-slate-300" /> {event.time}</div>
                            <div className="flex items-center gap-2"><MapPin className="w-4 h-4 text-slate-300" /> {event.location}</div>
                            <div className="flex items-center gap-2"><Users className="w-4 h-4 text-slate-300" /> {event.attendees}</div>
                         </div>
                      </div>

                      {/* Actions */}
                      <div className="flex flex-col gap-3 shrink-0 w-full md:w-auto">
                         <button className="px-6 py-3 bg-white border border-slate-200 text-slate-600 rounded-2xl text-[10px] font-black uppercase tracking-widest hover:border-rose-200 hover:text-rose-600 transition-all flex items-center justify-center gap-2 shadow-sm">
                            <Calendar className="w-4 h-4" /> Reschedule
                         </button>
                         <button className="px-6 py-3 bg-slate-900 text-white rounded-2xl text-[10px] font-black uppercase tracking-widest hover:bg-slate-800 transition-all flex items-center justify-center gap-2 shadow-xl shadow-slate-200">
                            Details <ChevronRight className="w-4 h-4" />
                         </button>
                      </div>
                   </div>
                ))}
             </div>
          </div>
        </div>

      </div>

      {/* Creation Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 bg-slate-900/40 backdrop-blur-md z-[100] flex items-center justify-center p-4">
          <div className="bg-white rounded-[3rem] w-full max-w-2xl shadow-2xl animate-in zoom-in duration-300 overflow-hidden">
             <div className="p-10 border-b border-slate-50 flex items-center justify-between">
                <div className="flex items-center gap-4">
                   <div className="w-12 h-12 bg-rose-50 rounded-2xl flex items-center justify-center border border-rose-100">
                      <CalendarDays className="w-6 h-6 text-rose-600" />
                   </div>
                   <h2 className="text-3xl font-black text-slate-800 tracking-tight">Schedule New Event</h2>
                </div>
                <button onClick={() => setIsModalOpen(false)} className="p-3 hover:bg-slate-100 rounded-2xl transition-all">
                  <Plus className="w-8 h-8 text-slate-300 rotate-45" />
                </button>
             </div>
             <div className="p-10 space-y-6">
                <div className="space-y-3">
                   <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Event Title</label>
                   <input className="w-full bg-slate-50 border border-slate-100 rounded-2xl px-6 py-4 text-sm font-bold focus:border-rose-500 outline-none transition-all" placeholder="e.g. Annual Sports Day" />
                </div>
                <div className="grid grid-cols-2 gap-6">
                   <div className="space-y-3">
                      <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Start Date</label>
                      <input type="date" className="w-full bg-slate-50 border border-slate-100 rounded-2xl px-6 py-4 text-sm font-bold focus:border-rose-500 outline-none transition-all" />
                   </div>
                   <div className="space-y-3">
                      <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Start Time</label>
                      <input type="time" className="w-full bg-slate-50 border border-slate-100 rounded-2xl px-6 py-4 text-sm font-bold focus:border-rose-500 outline-none transition-all" />
                   </div>
                </div>
                <div className="space-y-3">
                   <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Location</label>
                   <input className="w-full bg-slate-50 border border-slate-100 rounded-2xl px-6 py-4 text-sm font-bold focus:border-rose-500 outline-none transition-all" placeholder="e.g. Auditorium Hall" />
                </div>

                <div className="pt-6 flex gap-6">
                   <button onClick={() => setIsModalOpen(false)} className="flex-1 py-4 text-slate-400 font-black hover:text-slate-600 transition-all">Discard</button>
                   <button onClick={() => setIsModalOpen(false)} className="flex-1 py-4 bg-rose-600 text-white font-black rounded-2xl shadow-xl shadow-rose-100 hover:bg-rose-700 transition-all">Create Event</button>
                </div>
             </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default EventsManager;
