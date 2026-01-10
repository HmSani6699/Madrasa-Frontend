import { useState } from "react";
import { 
  Calendar, 
  Search, 
  MapPin, 
  Clock, 
  BookOpen, 
  Filter, 
  MoreVertical, 
  Download, 
  LayoutList,
  ChevronRight
} from "lucide-react";

const ExamScheduleList = () => {
  const [searchTerm, setSearchTerm] = useState("");
  const [termFilter, setTermFilter] = useState("All");

  // Sample Data: Exam Schedule
  const schedules = [
    { id: 1, date: "2026-03-01", time: "09:00 AM - 12:00 PM", subject: "Arabic Grammar", hall: "Main Auditorium", term: "First Term 2026", class: "Class 5" },
    { id: 2, date: "2026-03-02", time: "09:00 AM - 12:00 PM", subject: "Fiqh", hall: "Main Auditorium", term: "First Term 2026", class: "Class 5" },
    { id: 3, date: "2026-03-03", time: "09:00 AM - 12:00 PM", subject: "Mathematics", hall: "Room 101", term: "First Term 2026", class: "Class 5" },
  ];

  return (
    <div className="space-y-8 animate-in fade-in duration-500 p-4 md:p-8">
      {/* Header */}
      <div className="bg-white rounded-[2.5rem] border-2 border-slate-200 p-8 flex flex-col md:flex-row justify-between items-center gap-6 shadow-sm">
        <div className="flex items-center gap-6">
          <div className="w-16 h-16 bg-amber-50 rounded-2xl flex items-center justify-center border-2 border-amber-100">
            <LayoutList className="w-8 h-8 text-amber-500" />
          </div>
          <div>
            <h1 className="text-2xl md:text-3xl font-black text-slate-800">Exam Schedule</h1>
            <p className="text-slate-500 font-bold mt-1">Review examination timetables and room allocations</p>
          </div>
        </div>

        <button className="w-full md:w-auto px-8 py-4 bg-[#00bd7f] text-white rounded-2xl font-black shadow-xl shadow-emerald-200 hover:scale-[1.02] transition-all flex items-center justify-center gap-3">
          <Download className="w-5 h-5" />
          Export Timetable
        </button>
      </div>

      {/* Control Bar */}
      <div className="bg-white p-6 rounded-[2rem] border-2 border-slate-200 shadow-sm flex flex-col lg:flex-row gap-6">
         <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 flex-1">
            <div className="space-y-2">
                <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest flex items-center gap-2">
                   <Calendar className="w-3 h-3" /> Term
                </label>
                <select 
                  value={termFilter}
                  onChange={(e) => setTermFilter(e.target.value)}
                  className="w-full bg-slate-50 border-2 border-slate-100 rounded-2xl px-6 py-3 text-sm font-bold focus:border-amber-400 outline-none appearance-none"
                >
                    <option>All Terms</option>
                    <option>First Term 2026</option>
                    <option>Mid Term 2026</option>
                </select>
            </div>
            <div className="space-y-2">
                <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest flex items-center gap-2">
                   <Filter className="w-3 h-3" /> Class
                </label>
                <select className="w-full bg-slate-50 border-2 border-slate-100 rounded-2xl px-6 py-3 text-sm font-bold focus:border-amber-400 outline-none appearance-none">
                    <option>All Classes</option>
                    <option>Class 5</option>
                    <option>Class 6</option>
                </select>
            </div>
         </div>
      </div>

      {/* Schedule List */}
      <div className="bg-white rounded-[2.5rem] border-2 border-slate-200 shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-slate-50/50">
              <tr>
                <th className="px-8 py-6 text-left text-[10px] font-black text-slate-400 uppercase tracking-widest">Date & Time</th>
                <th className="px-8 py-6 text-left text-[10px] font-black text-slate-400 uppercase tracking-widest">Subject</th>
                <th className="px-8 py-6 text-center text-[10px] font-black text-slate-400 uppercase tracking-widest">Hall / Venue</th>
                <th className="px-8 py-6 text-center text-[10px] font-black text-slate-400 uppercase tracking-widest">Term</th>
                <th className="px-8 py-6 text-right text-[10px] font-black text-slate-400 uppercase tracking-widest">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y-2 divide-slate-50">
              {schedules.map((sc) => (
                <tr key={sc.id} className="group hover:bg-amber-50/30 transition-colors">
                  <td className="px-8 py-6">
                    <div className="flex flex-col">
                       <span className="text-sm font-black text-slate-800">{new Date(sc.date).toLocaleDateString()}</span>
                       <div className="flex items-center gap-1.5 mt-1 text-[10px] font-black text-amber-500 uppercase whitespace-nowrap">
                          <Clock className="w-3 h-3" /> {sc.time}
                       </div>
                    </div>
                  </td>
                  <td className="px-8 py-6">
                    <div className="flex items-center gap-3">
                       <div className="w-10 h-10 bg-white border-2 border-slate-50 rounded-xl flex items-center justify-center shadow-sm">
                          <BookOpen className="w-5 h-5 text-amber-500" />
                       </div>
                       <div className="flex flex-col">
                          <span className="text-sm font-black text-slate-800 whitespace-nowrap">{sc.subject}</span>
                          <span className="text-[10px] font-bold text-slate-400 uppercase whitespace-nowrap">{sc.class}</span>
                       </div>
                    </div>
                  </td>
                  <td className="px-8 py-6 text-center">
                    <div className="inline-flex items-center gap-2 px-4 py-1.5 bg-slate-100 rounded-full border border-slate-200">
                       <MapPin className="w-3.5 h-3.5 text-slate-400" />
                       <span className="text-xs font-black text-slate-600 uppercase whitespace-nowrap">{sc.hall}</span>
                    </div>
                  </td>
                  <td className="px-8 py-6 text-center">
                    <span className="px-3 py-1 bg-amber-50 text-amber-600 rounded-full text-[10px] font-black uppercase tracking-widest whitespace-nowrap">
                       {sc.term}
                    </span>
                  </td>
                  <td className="px-8 py-6 text-right">
                    <button className="p-2.5 bg-white border-2 border-slate-100 text-slate-400 hover:text-amber-500 hover:border-amber-200 rounded-xl transition-all shadow-sm">
                      <ChevronRight className="w-5 h-5" />
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default ExamScheduleList;
