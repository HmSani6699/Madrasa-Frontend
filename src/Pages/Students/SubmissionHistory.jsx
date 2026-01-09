import { useState } from "react";
import { 
  History, 
  Search, 
  Filter, 
  CheckCircle2, 
  FileText, 
  Star,
  Download,
  ExternalLink,
  MessageSquare
} from "lucide-react";

const SubmissionHistory = () => {
  const [searchTerm, setSearchTerm] = useState("");

  const history = [
    { id: "SUB-820", date: "Jan 04, 2026", subject: "Arabic Nahw", title: "Verb Conjugation Table", grade: "A+", points: "+25", status: "Graded" },
    { id: "SUB-794", date: "Jan 02, 2026", subject: "Tajweed Basics", title: "Makhraj Recording", grade: "A", points: "+20", status: "Graded" },
    { id: "SUB-751", date: "Dec 28, 2025", subject: "Fiqh", title: "Principles of Taharah", grade: "B+", points: "+15", status: "Graded" },
    { id: "SUB-720", date: "Dec 15, 2025", subject: "Islamic History", title: "Early Caliphate Analysis", grade: "Pending", points: "-", status: "Under Review" },
    { id: "SUB-682", date: "Dec 10, 2025", subject: "Arabic Nahw", title: "Noun Cases Assignment", grade: "A-", points: "+18", status: "Graded" },
  ];

  return (
    <div className="min-h-screen bg-slate-50/50 p-4 md:p-8 animate-in fade-in duration-500">
      <div className="max-w-[1600px] mx-auto space-y-6 md:space-y-10">
        
        {/* Header */}
        <div className="bg-white rounded-[1.5rem] md:rounded-[3rem] p-6 md:p-10 border border-slate-200 shadow-sm flex flex-col lg:flex-row justify-between items-center gap-6">
          <div className="flex items-center gap-4 md:gap-8">
            <div className="w-12 h-12 md:w-20 md:h-20 bg-slate-900 rounded-xl md:rounded-3xl flex items-center justify-center border border-slate-800 shadow-inner shrink-0 text-white">
              <History className="w-6 h-6 md:w-10 md:h-10" />
            </div>
            <div>
              <h1 className="text-xl md:text-3xl font-black text-slate-800 tracking-tight uppercase leading-none mb-1 md:mb-3">Submission Archive</h1>
              <p className="text-slate-500 font-bold mt-1 text-xs md:text-base">Comprehensive record of your digital assignments and faculty evaluation</p>
            </div>
          </div>

          <div className="flex gap-4 w-full lg:w-auto">
             <button className="flex-1 lg:flex-none px-8 py-4 bg-slate-100 text-slate-600 rounded-2xl font-black hover:bg-slate-200 transition-all border border-slate-200 text-[10px] uppercase tracking-widest flex items-center justify-center gap-3">
               <FileText className="w-4 h-4" /> Download Resume
            </button>
          </div>
        </div>

        {/* Filters */}
        <div className="flex flex-col md:flex-row gap-4">
           <div className="relative flex-1">
              <Search className="absolute left-6 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-300" />
              <input 
                className="w-full bg-white border border-slate-200 rounded-[1.5rem] md:rounded-2xl pl-16 pr-8 py-4 text-sm font-bold shadow-sm focus:border-slate-900 outline-none transition-all" 
                placeholder="Search by topic or subject..." 
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
           </div>
           <div className="flex gap-4">
              <button className="px-6 py-4 bg-white border border-slate-200 rounded-2xl font-black text-[10px] uppercase tracking-widest shadow-sm hover:border-slate-900 transition-colors flex items-center gap-3">
                 <Filter className="w-4 h-4" /> Date Range
              </button>
           </div>
        </div>

        {/* History Table */}
        <div className="bg-white rounded-[1.5rem] md:rounded-[3.5rem] border border-slate-200 shadow-sm overflow-hidden animate-in slide-in-from-bottom duration-700">
           <div className="overflow-x-auto">
              <table className="w-full border-collapse min-w-[1000px]">
                 <thead>
                    <tr className="border-b border-slate-50 text-[10px] font-black text-slate-400 uppercase tracking-widest bg-slate-50/10">
                       <th className="px-10 py-6 text-left">Reference & Date</th>
                       <th className="px-10 py-6 text-left">Assignment Details</th>
                       <th className="px-10 py-6 text-center">Outcome / Grade</th>
                       <th className="px-10 py-6 text-center">Growth Points</th>
                       <th className="px-10 py-6 text-center">Status</th>
                       <th className="px-10 py-6 text-right">Interaction</th>
                    </tr>
                 </thead>
                 <tbody className="divide-y divide-slate-50">
                    {history.map((item) => (
                       <tr key={item.id} className="group hover:bg-slate-50/40 transition-all text-balance">
                          <td className="px-10 py-8">
                             <div>
                                <p className="text-xs font-black text-slate-800 uppercase tracking-tighter mb-1">{item.id}</p>
                                <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">{item.date}</p>
                             </div>
                          </td>
                          <td className="px-10 py-8">
                             <div>
                                <div className="flex items-center gap-2 mb-2">
                                   <span className="px-2 py-0.5 bg-indigo-50 text-[9px] font-black text-indigo-500 uppercase rounded-md tracking-widest">{item.subject}</span>
                                </div>
                                <h4 className="text-sm font-black text-slate-800 uppercase tracking-tight group-hover:text-indigo-600 transition-colors">{item.title}</h4>
                             </div>
                          </td>
                          <td className="px-10 py-8 text-center">
                             <span className={`text-xl font-black ${item.grade === 'Pending' ? 'text-slate-300' : 'text-slate-900'}`}>{item.grade}</span>
                          </td>
                          <td className="px-10 py-8 text-center">
                             <div className="flex flex-col items-center">
                                <span className="text-sm font-black text-emerald-600">{item.points}</span>
                                {item.points !== '-' && <Star className="w-3 h-3 text-amber-500 fill-amber-500 mt-1" />}
                             </div>
                          </td>
                          <td className="px-10 py-8 text-center">
                             <div className={`inline-flex items-center gap-2 px-4 py-1.5 rounded-full text-[9px] font-black uppercase tracking-widest ${
                                item.status === 'Graded' ? 'bg-emerald-50 text-emerald-600 border border-emerald-100' : 'bg-slate-50 text-slate-400 border border-slate-100'
                             }`}>
                                {item.status === 'Graded' && <CheckCircle2 className="w-3.5 h-3.5" />}
                                {item.status}
                             </div>
                          </td>
                          <td className="px-10 py-8 text-right">
                             <div className="flex justify-end gap-3">
                                <button className="p-3 bg-white border border-slate-100 text-slate-300 rounded-xl hover:text-indigo-600 hover:border-indigo-100 transition-all shadow-sm">
                                   <MessageSquare className="w-4 h-4" />
                                </button>
                                <button className="p-3 bg-white border border-slate-100 text-slate-300 rounded-xl hover:text-indigo-600 hover:border-indigo-100 transition-all shadow-sm">
                                   <ExternalLink className="w-4 h-4" />
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

export default SubmissionHistory;
