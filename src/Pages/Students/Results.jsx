import { useState } from "react";
import { 
  Trophy, 
  ArrowUpRight, 
  Download, 
  Star, 
  BookOpen, 
  Award, 
  PieChart,
  Target,
  FileText
} from "lucide-react";

const StudentResults = () => {
  const results = [
    { subject: "Arabic Grammar (Nahw)", marks: 95, total: 100, grade: "A+", feedback: "Exceptional" },
    { subject: "Al-Quran Tajweed", marks: 88, total: 100, grade: "A", feedback: "Strong" },
    { subject: "Islamic Jurisprudence (Fiqh)", marks: 82, total: 100, grade: "A-", feedback: "Consistent" },
    { subject: "Hadith Principles", marks: 94, total: 100, grade: "A+", feedback: "Brilliant" },
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
              <h1 className="text-xl md:text-3xl font-black text-slate-800 tracking-tight uppercase leading-none mb-1 md:mb-3">Academic Outcomes</h1>
              <p className="text-slate-500 font-bold mt-1 text-xs md:text-base">Comprehensive performance analytics and official terminal marksheets</p>
            </div>
          </div>

          <div className="flex gap-4 w-full lg:w-auto">
             <button className="flex-1 lg:flex-none px-8 py-4 bg-slate-900 text-white rounded-2xl font-black text-[10px] uppercase tracking-widest hover:bg-slate-800 transition-all shadow-lg flex items-center justify-center gap-3">
               <Download className="w-4 h-4" /> Export Report
            </button>
          </div>
        </div>

        {/* Highlight Stats */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
           <div className="bg-slate-900 p-8 rounded-[2.5rem] text-white relative overflow-hidden group shadow-2xl shadow-slate-200">
              <PieChart className="absolute -right-4 -bottom-4 w-32 h-32 text-white/5 -rotate-12" />
              <p className="text-[10px] font-black text-slate-500 uppercase tracking-widest mb-4">Cumulative Grade Point</p>
              <h2 className="text-5xl font-black tracking-tight leading-none mb-4">4.92<span className="text-xl text-slate-600"> / 5.0</span></h2>
              <div className="px-4 py-1.5 bg-indigo-600 rounded-lg inline-block text-[10px] font-black uppercase tracking-widest border border-indigo-500">Dean's List Standing</div>
           </div>

           <div className="bg-white p-8 rounded-[2.5rem] border border-slate-200 shadow-sm flex items-center gap-6 group hover:border-emerald-200 transition-all">
              <div className="w-14 h-14 bg-emerald-50 rounded-2xl flex items-center justify-center text-emerald-600 shadow-inner group-hover:scale-110 transition-transform">
                 <Target className="w-7 h-7" />
              </div>
              <div>
                 <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-1">Total Percentile</p>
                 <h4 className="text-2xl font-black text-slate-800 tracking-tight">89.4% <span className="text-[10px] text-emerald-500">(Top 3)</span></h4>
              </div>
           </div>

           <div className="bg-white p-8 rounded-[2.5rem] border border-slate-200 shadow-sm flex items-center gap-6 group hover:border-indigo-200 transition-all">
              <div className="w-14 h-14 bg-indigo-50 rounded-2xl flex items-center justify-center text-indigo-600 shadow-inner group-hover:scale-110 transition-transform">
                 <Award className="w-7 h-7" />
              </div>
              <div>
                 <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-1">Merit Position</p>
                 <h4 className="text-2xl font-black text-slate-800 tracking-tight uppercase">Distinguished</h4>
              </div>
           </div>
        </div>

        {/* Detailed Marksheet */}
        <div className="bg-white rounded-[1.5rem] md:rounded-[3.5rem] border border-slate-200 shadow-sm overflow-hidden animate-in slide-in-from-bottom duration-700">
           <div className="p-8 md:p-12 border-b border-slate-50 flex items-center justify-between bg-slate-50/10">
              <h2 className="text-xl font-black text-slate-800 tracking-tight uppercase">Terminal Assessment: Q1 2026</h2>
              <span className="px-5 py-2 bg-slate-900 text-white rounded-xl text-[10px] font-black uppercase tracking-[2px]">ID: STU-260-082</span>
           </div>

           <div className="overflow-x-auto">
              <table className="w-full border-collapse">
                 <thead>
                    <tr className="border-b border-slate-50 text-[10px] font-black text-slate-400 uppercase tracking-widest">
                       <th className="px-10 py-6 text-left">Academic Subject</th>
                       <th className="px-10 py-6 text-center">Outcome / Grade</th>
                       <th className="px-10 py-6 text-center">Score Profile</th>
                       <th className="px-10 py-6 text-right">Faculty Review</th>
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
                             <span className="text-2xl font-black text-slate-900">{res.grade}</span>
                          </td>
                          <td className="px-10 py-8 text-center font-black text-slate-900">
                             <div className="flex flex-col items-center">
                                <span className="text-lg">{res.marks} <span className="text-[10px] text-slate-400">/ {res.total}</span></span>
                                <div className="h-1 w-12 bg-slate-100 rounded-full mt-2 overflow-hidden">
                                   <div className="h-full bg-slate-900 rounded-full" style={{ width: `${res.marks}%` }}></div>
                                </div>
                             </div>
                          </td>
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

        {/* Performance Graph Placeholder */}
        <div className="bg-white rounded-[2rem] md:rounded-[3rem] p-10 md:p-14 border border-slate-200 shadow-sm group">
           <div className="flex items-center justify-between mb-12">
              <div className="flex items-center gap-6">
                 <div className="w-14 h-14 bg-indigo-50 rounded-2xl flex items-center justify-center text-indigo-600 shadow-inner">
                    <Star className="w-7 h-7" />
                 </div>
                 <div>
                    <h3 className="text-2xl font-black text-slate-800 uppercase tracking-tight leading-none">Merit Trajectory</h3>
                    <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mt-2">Historical Growth Analysis</p>
                 </div>
              </div>
              <button className="flex items-center gap-2 text-[10px] font-black text-indigo-500 uppercase tracking-widest hover:underline">Full Analytics Dashboard <ArrowUpRight className="w-4 h-4" /></button>
           </div>
           
           <div className="h-48 md:h-64 flex items-end justify-between gap-4 md:gap-8 px-4">
              {[60, 85, 75, 95, 88].map((h, i) => (
                 <div key={i} className="flex-1 group/bar relative">
                    <div className="w-full bg-slate-50 group-hover/bar:bg-indigo-50 rounded-t-2xl transition-all duration-700 relative overflow-hidden" style={{ height: `${h}%` }}>
                       <div className="absolute inset-0 bg-indigo-500 opacity-20 group-hover/bar:opacity-100 translate-y-full group-hover/bar:translate-y-0 transition-transform duration-1000"></div>
                    </div>
                    <p className="absolute -bottom-8 left-1/2 -translate-x-1/2 text-[9px] font-black text-slate-400 uppercase tracking-widest text-center whitespace-nowrap">Assess 0{i+1}</p>
                 </div>
              ))}
           </div>
        </div>

      </div>
    </div>
  );
};

export default StudentResults;
