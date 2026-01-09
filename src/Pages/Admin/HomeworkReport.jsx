import { useState } from "react";
import { 
  Search, 
  BarChart3, 
  CheckCircle2, 
  Clock, 
  AlertCircle, 
  ChevronRight, 
  Filter, 
  FileCheck,
  Download,
  School,
  BookOpen,
  User
} from "lucide-react";

const HomeworkReport = () => {
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedClass, setSelectedClass] = useState("Class 5");
  const [selectedSubject, setSelectedSubject] = useState("Arabic Grammar");

  // Sample Data: Evaluation Report
  const evaluations = [
    { id: 1, studentName: "মোহাম্মদ রহমান", roll: "01", status: "graded", marks: "95/100", date: "2026-01-08" },
    { id: 2, studentName: "আয়েশা খাতুন", roll: "02", status: "graded", marks: "88/100", date: "2026-01-08" },
    { id: 3, studentName: "ইউসুফ হোসেন", roll: "03", status: "pending", marks: "-", date: "2026-01-07" },
    { id: 4, studentName: "ফাতিমা জোহরা", roll: "04", status: "missing", marks: "-", date: "-" },
    { id: 5, studentName: "আব্দুল্লাহ মামুন", roll: "05", status: "graded", marks: "92/100", date: "2026-01-08" },
  ];

  return (
    <div className="space-y-8 animate-in fade-in duration-500 p-4 md:p-8">
      {/* Header */}
      <div className="bg-white rounded-[2.5rem] border-2 border-slate-200 p-8 flex flex-col md:flex-row justify-between items-center gap-6 shadow-sm">
        <div className="flex items-center gap-6">
          <div className="w-16 h-16 bg-rose-50 rounded-2xl flex items-center justify-center border-2 border-rose-100">
            <BarChart3 className="w-8 h-8 text-rose-600" />
          </div>
          <div>
            <h1 className="text-2xl md:text-3xl font-black text-slate-800">Evaluation Report</h1>
            <p className="text-slate-500 font-bold mt-1">Review and grade student assignment submissions</p>
          </div>
        </div>

        <button className="w-full md:w-auto px-8 py-4 bg-white border-2 border-slate-200 text-slate-600 rounded-2xl font-black hover:bg-slate-50 transition-all flex items-center justify-center gap-3">
          <Download className="w-5 h-5" />
          Export Report
        </button>
      </div>

      {/* Stats Summary */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        {[
          { label: "Total Students", value: 45, icon: User, color: "text-blue-600", bg: "bg-blue-50" },
          { label: "Submitted", value: 38, icon: FileCheck, color: "text-emerald-600", bg: "bg-emerald-50" },
          { label: "Pending Review", value: 12, icon: Clock, color: "text-amber-500", bg: "bg-amber-50" },
          { label: "Missing", value: 7, icon: AlertCircle, color: "text-rose-500", bg: "bg-rose-50" },
        ].map((stat, i) => (
          <div key={i} className="bg-white p-6 rounded-[2rem] border-2 border-slate-100 shadow-sm flex items-center gap-4">
            <div className={`w-14 h-14 ${stat.bg} rounded-2xl flex items-center justify-center`}>
              <stat.icon className={`w-7 h-7 ${stat.color}`} />
            </div>
            <div>
              <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">{stat.label}</p>
              <p className="text-2xl font-black text-slate-800">{stat.value}</p>
            </div>
          </div>
        ))}
      </div>

      {/* Control Bar */}
      <div className="bg-white p-6 rounded-[2rem] border-2 border-slate-200 shadow-sm flex flex-col lg:flex-row gap-6">
         <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 flex-1">
            <div className="space-y-2">
                <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest flex items-center gap-2">
                   <School className="w-3 h-3" /> Class
                </label>
                <select 
                  value={selectedClass}
                  onChange={(e) => setSelectedClass(e.target.value)}
                  className="w-full bg-slate-50 border-2 border-slate-100 rounded-2xl px-6 py-3 text-sm font-bold focus:border-rose-400 outline-none appearance-none"
                >
                    <option>Class 5</option>
                    <option>Class 6</option>
                </select>
            </div>
            <div className="space-y-2">
                <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest flex items-center gap-2">
                   <BookOpen className="w-3 h-3" /> Subject
                </label>
                <select 
                  value={selectedSubject}
                  onChange={(e) => setSelectedSubject(e.target.value)}
                  className="w-full bg-slate-50 border-2 border-slate-100 rounded-2xl px-6 py-3 text-sm font-bold focus:border-rose-400 outline-none appearance-none"
                >
                    <option>Arabic Grammar</option>
                    <option>Mathematics</option>
                </select>
            </div>
         </div>
         <div className="h-full w-px bg-slate-100 hidden lg:block" />
         <div className="relative flex-1">
            <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-2 block">Quick Search</label>
            <div className="relative">
                <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-300" />
                <input 
                  placeholder="Submissions by student name..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="w-full pl-12 pr-4 py-3 bg-slate-50 border-2 border-slate-100 rounded-2xl text-sm font-bold outline-none focus:border-rose-400 transition-all"
                />
            </div>
         </div>
      </div>

      {/* Evaluation Table */}
      <div className="bg-white rounded-[2.5rem] border-2 border-slate-200 shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-slate-50/50">
              <tr>
                <th className="px-8 py-5 text-left text-[10px] font-black text-slate-400 uppercase tracking-widest">Roll</th>
                <th className="px-8 py-5 text-left text-[10px] font-black text-slate-400 uppercase tracking-widest">Student</th>
                <th className="px-8 py-5 text-center text-[10px] font-black text-slate-400 uppercase tracking-widest">Status</th>
                <th className="px-8 py-5 text-center text-[10px] font-black text-slate-400 uppercase tracking-widest">Submission Date</th>
                <th className="px-8 py-5 text-center text-[10px] font-black text-slate-400 uppercase tracking-widest">Marks</th>
                <th className="px-8 py-5 text-right text-[10px] font-black text-slate-400 uppercase tracking-widest">Action</th>
              </tr>
            </thead>
            <tbody className="divide-y-2 divide-slate-50">
              {evaluations.map((ev) => (
                <tr key={ev.id} className="group hover:bg-slate-50/50 transition-colors">
                  <td className="px-8 py-6">
                    <span className="text-sm font-black text-rose-600">#{ev.roll}</span>
                  </td>
                  <td className="px-8 py-6">
                    <span className="text-sm font-bold text-slate-800">{ev.studentName}</span>
                  </td>
                  <td className="px-8 py-6 text-center">
                    <span className={`inline-flex items-center gap-1.5 px-4 py-1.5 rounded-full text-[10px] font-black uppercase tracking-widest border-2 ${
                      ev.status === 'graded' ? 'bg-emerald-50 text-emerald-600 border-emerald-100' :
                      ev.status === 'pending' ? 'bg-amber-50 text-amber-600 border-amber-100' :
                      'bg-rose-50 text-rose-600 border-rose-100'
                    }`}>
                      {ev.status === 'graded' ? <CheckCircle2 className="w-3 h-3" /> : 
                       ev.status === 'pending' ? <Clock className="w-3 h-3" /> : <AlertCircle className="w-3 h-3" />}
                      {ev.status}
                    </span>
                  </td>
                  <td className="px-8 py-6 text-center text-xs font-bold text-slate-500">
                    {ev.date}
                  </td>
                  <td className="px-8 py-6 text-center">
                    <span className={`text-sm font-black ${ev.status === 'graded' ? 'text-slate-800' : 'text-slate-300'}`}>
                      {ev.marks}
                    </span>
                  </td>
                  <td className="px-8 py-6 text-right">
                    <button className="p-2.5 bg-white border-2 border-slate-100 text-slate-400 hover:text-rose-600 hover:border-rose-200 rounded-xl transition-all shadow-sm">
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

export default HomeworkReport;
