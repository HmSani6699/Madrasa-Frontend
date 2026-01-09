import { useState } from "react";
import { 
  Calendar, 
  MapPin, 
  Clock, 
  Search, 
  Filter, 
  Download,
  BookOpen,
  ChevronRight,
  ClipboardCheck,
  Award
} from "lucide-react";

const TeacherExamSchedule = () => {
  const exams = [
    { id: 1, subject: "Al-Quran Hifz", date: "Jan 15, 2026", time: "08:30 AM", room: "Hall 01", class: "Hifz - Sec A", status: "upcoming" },
    { id: 2, subject: "Arabic Nahw", date: "Jan 16, 2026", time: "10:00 AM", room: "Room 105", class: "Mishkat - Sec B", status: "upcoming" },
    { id: 3, subject: "Islamic Fiqh", date: "Jan 18, 2026", time: "09:00 AM", room: "Main Room", class: "Hidayah", status: "upcoming" },
    { id: 4, subject: "Hadith Studies", date: "Jan 20, 2026", time: "08:30 AM", room: "Hall 02", class: "Mishkat - Sec A", status: "upcoming" },
  ];

  return (
    <div className="min-h-screen bg-slate-50/50 p-4 md:p-8 animate-in fade-in duration-500">
      <div className="max-w-[1600px] mx-auto space-y-6 md:space-y-8">
        
        {/* Header */}
        <div className="bg-white rounded-[1.5rem] md:rounded-[2.5rem] border border-slate-200 p-6 md:p-8 shadow-sm flex flex-col lg:flex-row justify-between items-center gap-6">
          <div className="flex items-center gap-4 md:gap-8">
            <div className="w-12 h-12 md:w-20 md:h-20 bg-slate-900 rounded-xl md:rounded-3xl flex items-center justify-center border border-slate-800 shadow-inner shrink-0">
              <ClipboardCheck className="w-6 h-6 md:w-10 md:h-10 text-white" />
            </div>
            <div>
              <h1 className="text-xl md:text-3xl font-black text-slate-800 tracking-tight uppercase leading-none mb-1 md:mb-3">Examination Timetable</h1>
              <p className="text-slate-500 font-bold mt-1 text-xs md:text-base">Institutional examination schedule for assigned courses and invigilation duties</p>
            </div>
          </div>

          <div className="flex gap-4 w-full lg:w-auto">
             <button className="flex-1 lg:flex-none px-6 md:px-10 py-3.5 md:py-4 bg-slate-100 text-slate-600 rounded-xl md:rounded-2xl font-black hover:bg-slate-200 transition-all border border-slate-200 text-[10px] md:text-[11px] uppercase tracking-widest flex items-center justify-center gap-3">
               <Download className="w-4 h-4" /> Download PDF
            </button>
          </div>
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
           <div className="bg-white p-6 md:p-8 rounded-[1.5rem] md:rounded-[2.5rem] border border-slate-200 shadow-sm flex items-center gap-6 group hover:border-indigo-200 transition-all">
              <div className="w-12 h-12 md:w-14 md:h-14 bg-indigo-50 rounded-xl md:rounded-2xl flex items-center justify-center text-indigo-600 shrink-0 shadow-inner">
                 <Calendar className="w-6 h-6" />
              </div>
              <div>
                 <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest leading-none mb-1">Total Exams</p>
                 <h4 className="text-lg md:text-xl font-black text-slate-800 tracking-tight">08 Scheduled</h4>
              </div>
           </div>
           <div className="bg-white p-6 md:p-8 rounded-[1.5rem] md:rounded-[2.5rem] border border-slate-200 shadow-sm flex items-center gap-6 group hover:border-emerald-200 transition-all">
              <div className="w-12 h-12 md:w-14 md:h-14 bg-emerald-50 rounded-xl md:rounded-2xl flex items-center justify-center text-emerald-600 shrink-0 shadow-inner">
                 <Clock className="w-6 h-6" />
              </div>
              <div>
                 <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest leading-none mb-1">Invigilations</p>
                 <h4 className="text-lg md:text-xl font-black text-slate-800 tracking-tight">03 Sessions</h4>
              </div>
           </div>
           <div className="bg-white p-6 md:p-8 rounded-[1.5rem] md:rounded-[2.5rem] border border-slate-200 shadow-sm flex items-center gap-6 group hover:border-amber-200 transition-all sm:col-span-1">
              <div className="w-12 h-12 md:w-14 md:h-14 bg-amber-50 rounded-xl md:rounded-2xl flex items-center justify-center text-amber-600 shrink-0 shadow-inner">
                 <Award className="w-6 h-6" />
              </div>
              <div>
                 <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest leading-none mb-1">Upcoming</p>
                 <h4 className="text-lg md:text-xl font-black text-slate-800 tracking-tight">Next 3 Days</h4>
              </div>
           </div>
        </div>

        {/* Exam Table */}
        <div className="bg-white rounded-[1.5rem] md:rounded-[3rem] border border-slate-200 shadow-sm overflow-hidden animate-in slide-in-from-bottom duration-700">
           <div className="overflow-x-auto">
              <table className="w-full border-collapse min-w-[900px]">
                 <thead>
                    <tr className="border-b border-slate-50 text-[10px] font-black text-slate-400 uppercase tracking-widest">
                       <th className="px-6 md:px-10 py-4 md:py-6 text-left">Exam Module</th>
                       <th className="px-6 md:px-10 py-4 md:py-6 text-left">Academic Program</th>
                       <th className="px-6 md:px-10 py-4 md:py-6 text-center">Timing Info</th>
                       <th className="px-6 md:px-10 py-4 md:py-6 text-center">Venue</th>
                       <th className="px-6 md:px-10 py-4 md:py-6 text-right">Status</th>
                    </tr>
                 </thead>
                 <tbody className="divide-y divide-slate-50">
                    {exams.map((exam) => (
                       <tr key={exam.id} className="group hover:bg-slate-50/50 transition-all">
                          <td className="px-6 md:px-10 py-4 md:py-6">
                             <div className="flex items-center gap-4 md:gap-6">
                                <div className="w-10 h-10 md:w-12 md:h-12 bg-slate-100 rounded-xl md:rounded-2xl flex items-center justify-center font-black text-slate-300 transition-transform group-hover:scale-110 shadow-sm">
                                   {exam.id}
                                </div>
                                <div>
                                   <h4 className="text-sm font-black text-slate-800 uppercase tracking-tight">{exam.subject}</h4>
                                   <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest font-mono mt-0.5">ID: #EXM-2026-0{exam.id}</p>
                                </div>
                             </div>
                          </td>
                          <td className="px-6 md:px-10 py-4 md:py-6">
                             <span className="px-3 py-1 bg-slate-50 text-[9px] font-black text-slate-400 uppercase border border-slate-100 rounded-lg">{exam.class}</span>
                          </td>
                          <td className="px-6 md:px-10 py-4 md:py-6 text-center">
                             <div className="flex flex-col items-center">
                                <span className="text-xs font-black text-slate-800 leading-none mb-1">{exam.date}</span>
                                <span className="text-[9px] font-black text-indigo-500 uppercase tracking-widest">{exam.time}</span>
                             </div>
                          </td>
                          <td className="px-6 md:px-10 py-4 md:py-6 text-center">
                             <div className="flex items-center justify-center gap-2">
                                <MapPin className="w-3.5 h-3.5 text-slate-300" />
                                <span className="text-xs font-black text-slate-800">{exam.room}</span>
                             </div>
                          </td>
                          <td className="px-6 md:px-10 py-4 md:py-6 text-right">
                             <div className="flex items-center justify-end gap-3">
                                <span className={`px-4 py-1.5 rounded-full text-[9px] font-black uppercase tracking-widest border ${
                                   exam.status === 'upcoming' ? 'bg-indigo-50 text-indigo-600 border-indigo-100 shadow-sm' : 
                                   'bg-slate-50 text-slate-400'
                                }`}>
                                   {exam.status}
                                </span>
                                <button className="p-2 md:p-3 bg-white border border-slate-100 rounded-lg md:rounded-xl text-slate-200 hover:text-slate-600 transition-all hover:scale-110 active:scale-95">
                                   <ChevronRight className="w-4 h-4" />
                                </button>
                             </div>
                          </td>
                       </tr>
                    ))}
                 </tbody>
              </table>
           </div>
        </div>

      </div>
    </div>
  );
};

export default TeacherExamSchedule;
