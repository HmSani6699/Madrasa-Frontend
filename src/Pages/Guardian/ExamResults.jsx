import { useState } from "react";
import { 
  Trophy, 
  ChevronRight, 
  ArrowUpRight, 
  GraduationCap, 
  Download,
  Star,
  BookOpen,
  PieChart,
  FileSpreadsheet
} from "lucide-react";

const ExamResults = () => {
  const [selectedExam, setSelectedExam] = useState("Mid-Term Exhibition 2026");

  const exams = [
    "Mid-Term Exhibition 2026",
    "Monthly Assessment - Dec",
    "Annual Examination 2025"
  ];

  const results = [
    { subject: "Arabic Grammar (Nahw)", marks: 95, total: 100, grade: "A+", weight: "Theory", feedback: "Excellent" },
    { subject: "Al-Quran Tajweed", marks: 88, total: 100, grade: "A", weight: "Oral", feedback: "Strong" },
    { subject: "Islamic Jurisprudence (Fiqh)", marks: 82, total: 100, grade: "A-", weight: "Theory", feedback: "Needs Revision" },
    { subject: "Hadith Principles", marks: 94, total: 100, grade: "A+", weight: "Theory", feedback: "Exceptional" },
    { subject: "Madrasa Ethics", marks: 90, total: 100, grade: "A+", weight: "Practical", feedback: "Outstanding" },
  ];

  return (
    <div className="min-h-screen bg-slate-50/50 p-4 md:p-8 animate-in fade-in duration-500">
      <div className="max-w-[1600px] mx-auto space-y-6 md:space-y-10">
        
        {/* Header */}
        <div className="bg-white rounded-[1.5rem] md:rounded-[3rem] p-6 md:p-10 border border-slate-200 shadow-sm flex flex-col lg:flex-row justify-between items-center gap-6">
          <div className="flex items-center gap-4 md:gap-8">
            <div className="w-12 h-12 md:w-20 md:h-20 bg-amber-50 rounded-xl md:rounded-3xl flex items-center justify-center border border-amber-100 shadow-inner shrink-0 text-amber-600">
              <Trophy className="w-6 h-6 md:w-10 md:h-10" />
            </div>
            <div>
              <h1 className="text-xl md:text-3xl font-black text-slate-800 tracking-tight uppercase leading-none mb-1 md:mb-3">Examination Reports</h1>
              <p className="text-slate-500 font-bold mt-1 text-xs md:text-base">Historical results and official marksheets for all assessments</p>
            </div>
          </div>

          <div className="flex flex-wrap gap-4 w-full lg:w-auto">
             <div className="relative flex-1 lg:flex-none">
                <select 
                   value={selectedExam}
                   onChange={(e) => setSelectedExam(e.target.value)}
                   className="w-full lg:w-64 bg-slate-100 border border-slate-200 rounded-2xl px-6 py-4 text-[10px] font-black uppercase tracking-widest outline-none appearance-none cursor-pointer"
                >
                   {exams.map(ex => <option key={ex}>{ex}</option>)}
                </select>
                <ChevronRight className="absolute right-4 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400 rotate-90 pointer-events-none" />
             </div>
             <button className="flex-1 lg:flex-none px-8 py-4 bg-slate-900 text-white rounded-2xl font-black text-[10px] uppercase tracking-widest hover:bg-slate-800 transition-all shadow-lg flex items-center justify-center gap-3">
               <Download className="w-4 h-4" /> Download MarksCard
            </button>
          </div>
        </div>

        {/* Aggregate Overview */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
           <div className="bg-slate-900 p-8 rounded-[2.5rem] text-white relative overflow-hidden group shadow-2xl shadow-slate-200">
              <PieChart className="absolute -right-4 -bottom-4 w-32 h-32 text-white/5 -rotate-12" />
              <p className="text-[10px] font-black text-slate-500 uppercase tracking-widest mb-4">G.P.A Equivalent</p>
              <h2 className="text-5xl font-black tracking-tight leading-none mb-4">4.85<span className="text-xl text-slate-600"> / 5.0</span></h2>
              <div className="px-4 py-1.5 bg-white/10 rounded-lg inline-block text-[10px] font-black uppercase tracking-widest border border-white/5">Excellent Standing</div>
           </div>

           <div className="bg-white p-8 rounded-[2.5rem] border border-slate-200 shadow-sm flex items-center gap-6 group hover:border-indigo-200 transition-all">
              <div className="w-14 h-14 bg-indigo-50 rounded-2xl flex items-center justify-center text-indigo-600 shadow-inner group-hover:scale-110 transition-transform">
                 <Star className="w-7 h-7" />
              </div>
              <div>
                 <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-1">Total Marks</p>
                 <h4 className="text-2xl font-black text-slate-800 tracking-tight">442 / 500</h4>
              </div>
           </div>

           <div className="bg-white p-8 rounded-[2.5rem] border border-slate-200 shadow-sm flex items-center gap-6 group hover:border-emerald-200 transition-all">
              <div className="w-14 h-14 bg-emerald-50 rounded-2xl flex items-center justify-center text-emerald-600 shadow-inner group-hover:scale-110 transition-transform">
                 <FileSpreadsheet className="w-7 h-7" />
              </div>
              <div>
                 <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-1">Result Status</p>
                 <h4 className="text-2xl font-black text-emerald-600 tracking-tight uppercase">PROMOTED</h4>
              </div>
           </div>
        </div>

        {/* Detailed Marks Table */}
        <div className="bg-white rounded-[1.5rem] md:rounded-[3.5rem] border border-slate-200 shadow-sm overflow-hidden animate-in slide-in-from-bottom duration-700">
           <div className="p-8 md:p-10 border-b border-slate-50 flex items-center justify-between bg-slate-50/20">
              <h2 className="text-xl font-black text-slate-800 tracking-tight uppercase">Detailed Subject Evaluation</h2>
              <div className="flex items-center gap-2 text-[10px] font-black text-slate-400 uppercase tracking-widest font-mono">
                 ID: {selectedExam.split(' ')[0]}-082
              </div>
           </div>

           <div className="overflow-x-auto">
              <table className="w-full border-collapse">
                 <thead>
                    <tr className="border-b border-slate-50 text-[10px] font-black text-slate-400 uppercase tracking-widest">
                       <th className="px-10 py-6 text-left">Academic Subject</th>
                       <th className="px-10 py-6 text-center">Weightage</th>
                       <th className="px-10 py-6 text-center">Marks Obtained</th>
                       <th className="px-10 py-6 text-center">Grade</th>
                       <th className="px-10 py-6 text-right">Expert Comment</th>
                    </tr>
                 </thead>
                 <tbody className="divide-y divide-slate-50">
                    {results.map((res, idx) => (
                       <tr key={idx} className="group hover:bg-slate-50/40 transition-all">
                          <td className="px-10 py-8">
                             <div className="flex items-center gap-4">
                                <div className="w-10 h-10 bg-slate-100 rounded-xl flex items-center justify-center text-slate-400 group-hover:text-indigo-600 transition-colors">
                                   <BookOpen className="w-5 h-5" />
                                </div>
                                <p className="text-sm font-black text-slate-800 uppercase tracking-tight">{res.subject}</p>
                             </div>
                          </td>
                          <td className="px-10 py-8 text-center">
                             <span className="px-4 py-1.5 bg-slate-50 text-[9px] font-black text-slate-400 border border-slate-100 rounded-lg uppercase tracking-widest group-hover:bg-white transition-colors">{res.weight}</span>
                          </td>
                          <td className="px-10 py-8 text-center">
                             <div className="flex flex-col items-center">
                                <span className="text-xl font-black text-slate-900 leading-none">{res.marks}</span>
                                <div className="h-1 w-12 bg-slate-100 rounded-full mt-2 overflow-hidden">
                                   <div className="h-full bg-slate-900 rounded-full" style={{ width: `${res.marks}%` }}></div>
                                </div>
                             </div>
                          </td>
                          <td className="px-10 py-8 text-center text-xl font-black text-slate-900">{res.grade}</td>
                          <td className="px-10 py-8 text-right">
                             <div className="inline-flex items-center gap-2 text-[10px] font-black text-indigo-600 uppercase tracking-widest border border-indigo-100 bg-indigo-50 px-4 py-2 rounded-xl">
                                {res.feedback}
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

export default ExamResults;
