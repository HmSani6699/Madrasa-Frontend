import { useState, useEffect } from "react";
import { useLocation } from "react-router-dom";
import { 
  GraduationCap, 
  Search, 
  Filter, 
  Download, 
  BookOpen, 
  Award, 
  TrendingUp, 
  FileText, 
  CheckCircle2,
  MoreVertical,
  ChevronDown,
  Printer,
  Grid
} from "lucide-react";

const ExamReports = () => {
  const location = useLocation();
  const [activeTab, setActiveTab] = useState("card");

  useEffect(() => {
    const path = location.pathname;
    if (path.includes("tabulation")) setActiveTab("tabulation");
    else if (path.includes("progress")) setActiveTab("progress");
    else setActiveTab("card");
  }, [location.pathname]);

  const tabs = [
    { id: "card", label: "Report Card", icon: Award },
    { id: "tabulation", label: "Tabulation Sheet", icon: Grid },
    { id: "progress", label: "Progress Reports", icon: TrendingUp },
  ];

  return (
    <div className="min-h-screen bg-slate-50/50 p-4 md:p-8 animate-in fade-in duration-500">
      <div className="max-w-[1600px] mx-auto space-y-8">
        
        {/* Header Section */}
        <div className="bg-white rounded-[20px] border border-slate-200  shadow-sm flex flex-col lg:flex-row justify-between items-center gap-6">
          <div className="p-10 border-b border-slate-50 bg-slate-50/20">
              <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
                 <div className="space-y-3">
                    <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest px-1">Select Session</label>
                    <div className="relative group">
                       <select className="w-full bg-white border border-slate-200 rounded-xl px-4 py-3 text-sm font-bold focus:border-[#00bd7f] outline-none appearance-none cursor-pointer group-hover:border-slate-300 transition-all shadow-sm">
                          <option>Academic Session 2026</option>
                          <option>Academic Session 2025</option>
                       </select>
                       <ChevronDown className="absolute right-4 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-300 pointer-events-none group-focus-within:text-[#00bd7f]" />
                    </div>
                 </div>
                 <div className="space-y-3">
                    <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest px-1">Department</label>
                    <div className="relative group">
                       <select className="w-full bg-white border border-slate-200 rounded-xl px-4 py-3 text-sm font-bold focus:border-[#00bd7f] outline-none appearance-none cursor-pointer shadow-sm">
                          <option>Hifz Department</option>
                          <option>Mishkat Department</option>
                       </select>
                       <ChevronDown className="absolute right-4 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-300 pointer-events-none" />
                    </div>
                 </div>
                 <div className="space-y-3">
                    <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest px-1">Section</label>
                    <div className="relative group">
                       <select className="w-full bg-white border border-slate-200 rounded-xl px-4 py-3 text-sm font-bold focus:border-[#00bd7f] outline-none appearance-none cursor-pointer shadow-sm">
                          <option>Section A</option>
                          <option>Section B</option>
                       </select>
                       <ChevronDown className="absolute right-4 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-300 pointer-events-none" />
                    </div>
                 </div>
                 <div className="flex items-end">
                    <button className="w-full py-3.5 bg-slate-900 text-white rounded-xl font-black uppercase tracking-widest text-[10px] shadow-xl shadow-slate-200 hover:bg-slate-800 transition-all flex items-center justify-center gap-3">
                       <Filter className="w-4 h-4 text-emerald-400" />
                       Generate Report
                    </button>
                 </div>
              </div>
           </div>
        </div>

       


        {/* Main Content Area */}
        <div className="bg-white rounded-[20px] border border-slate-200 shadow-sm overflow-hidden min-h-[600px]">
          
         

           {/* Table Section */}
           <div className="overflow-x-auto">
              {activeTab === 'tabulation' ? (
                /* Specialized Tabulation Sheet Table */
                <table className="w-full border-collapse">
                   <thead>
                      <tr className="bg-slate-50/50 text-[10px] font-black text-slate-400 uppercase tracking-widest">
                         <th className="px-8 py-6 text-left border-r border-slate-100">Student Particulars</th>
                         <th className="px-4 py-6 text-center border-r border-slate-100">Quran</th>
                         <th className="px-4 py-6 text-center border-r border-slate-100">Hadith</th>
                         <th className="px-4 py-6 text-center border-r border-slate-100">Fiqh</th>
                         <th className="px-4 py-6 text-center border-r border-slate-100">Arabic</th>
                         <th className="px-4 py-6 text-center border-r border-slate-100">English</th>
                         <th className="px-10 py-6 text-center bg-[#f0f9f6] text-[#00bd7f]">Grand Total</th>
                         <th className="px-6 py-6 text-center">GPA</th>
                         <th className="px-6 py-6 text-center">Result</th>
                         <th className="px-10 py-6 text-right">Actions</th>
                      </tr>
                   </thead>
                   <tbody className="divide-y divide-slate-50">
                      {[1, 2, 3, 4, 5, 6, 7, 8].map((i) => (
                         <tr key={i} className="group hover:bg-slate-50/30 transition-all">
                            <td className="px-8 py-6 border-r border-slate-50">
                               <div className="flex items-center gap-4">
                                  <div className="w-10 h-10 bg-slate-100 rounded-xl flex items-center justify-center font-black text-slate-400 group-hover:bg-[#e6f4ef] group-hover:text-[#00bd7f] transition-all text-xs">#{i}</div>
                                  <div>
                                     <p className="text-sm font-black text-slate-800 tracking-tight">Abdullah Al-Mamun</p>
                                     <p className="text-[10px] font-bold text-slate-400 tracking-widest">ROLL: 20260{i}</p>
                                  </div>
                               </div>
                            </td>
                            {['85', '92', '78', '95', '88'].map((mark, idx) => (
                               <td key={idx} className="px-4 py-6 text-center border-r border-slate-50 font-mono text-sm font-bold text-slate-600">
                                  {parseInt(mark) - i}
                               </td>
                            ))}
                            <td className="px-10 py-6 text-center bg-[#f0f9f6]/30 border-r border-slate-50">
                               <p className="text-sm font-black text-[#00bd7f]">{450 - (i * 5)}/500</p>
                            </td>
                            <td className="px-6 py-6 text-center border-r border-slate-50">
                               <p className="text-sm font-black text-slate-800">{(5.0 - (i * 0.1)).toFixed(2)}</p>
                            </td>
                            <td className="px-6 py-6 text-center border-r border-slate-50">
                               <span className={`px-3 py-1 rounded-full text-[9px] font-black uppercase tracking-widest ${i > 6 ? 'bg-rose-50 text-rose-500 border border-rose-100' : 'bg-emerald-50 text-[#00bd7f] border border-emerald-100'}`}>
                                  {i > 6 ? 'Failed' : 'Passed'}
                               </span>
                            </td>
                            <td className="px-10 py-6 text-right space-x-1">
                               <button className="p-2 bg-white border border-slate-200 rounded-lg text-slate-400 hover:text-[#00bd7f] hover:border-[#00bd7f] transition-all">
                                  <Printer className="w-3.5 h-3.5" />
                               </button>
                               <button className="p-2 bg-white border border-slate-200 rounded-lg text-slate-400 hover:text-blue-500 hover:border-blue-200 transition-all">
                                  <FileText className="w-3.5 h-3.5" />
                               </button>
                            </td>
                         </tr>
                      ))}
                   </tbody>
                </table>
              ) : (
                /* Standard Reports Table */
                <table className="w-full border-collapse">
                   <thead>
                      <tr className="border-b border-slate-50 text-[10px] font-black text-slate-400 uppercase tracking-widest">
                         <th className="px-10 py-6 text-left">Academic Info</th>
                         <th className="px-10 py-6 text-center">Score Metric</th>
                         <th className="px-10 py-6 text-center">Performance %</th>
                         <th className="px-10 py-6 text-center">Final Grade</th>
                         <th className="px-10 py-6 text-center">Rank</th>
                         <th className="px-10 py-6 text-right">Actions</th>
                      </tr>
                   </thead>
                   <tbody className="divide-y divide-slate-50">
                      {[1, 2, 3, 4, 5].map((i) => (
                         <tr key={i} className="group hover:bg-slate-50/50 transition-all uppercase">
                            <td className="px-10 py-6">
                               <div className="flex items-center gap-4">
                                  <div className="w-12 h-12 bg-slate-100 rounded-2xl flex items-center justify-center font-black text-slate-400 group-hover:scale-110 group-hover:bg-[#e6f4ef] group-hover:text-[#00bd7f] transition-all">ZF</div>
                                  <div>
                                     <p className="text-sm font-black text-slate-800 tracking-tight">Zaid Bin Harith</p>
                                     <p className="text-[10px] font-bold text-slate-400 tracking-widest italic">Roll: 10{i + 3}</p>
                                  </div>
                               </div>
                            </td>
                            <td className="px-10 py-6 text-center">
                               <p className="text-sm font-black text-slate-600 font-mono tracking-tighter">{840 + (i * 10)} / 1000</p>
                            </td>
                            <td className="px-10 py-6 text-center text-sm font-black text-[#00bd7f]">{84 + i}.5%</td>
                            <td className="px-10 py-6 text-center">
                               <span className="px-4 py-1.5 bg-emerald-50 text-[#00bd7f] border border-emerald-100 rounded-lg text-[10px] font-black tracking-widest">A+ EXCELLENT</span>
                            </td>
                            <td className="px-10 py-6 text-center font-black text-slate-800 text-sm">{i}st</td>
                            <td className="px-10 py-6 text-right space-x-2">
                               <button className="p-2.5 bg-white border border-slate-200 rounded-xl text-slate-400 hover:text-[#00bd7f] hover:border-[#00bd7f] shadow-sm transition-all inline-flex items-center gap-2 group-hover:bg-[#e6f4ef]">
                                  <Printer className="w-4 h-4" />
                               </button>
                               <button className="p-2.5 bg-white border border-slate-200 rounded-xl text-slate-400 hover:text-[#00bd7f] hover:border-[#00bd7f] shadow-sm transition-all">
                                  <FileText className="w-4 h-4" />
                               </button>
                            </td>
                         </tr>
                      ))}
                   </tbody>
                </table>
              )}
           </div>

           {/* Results Summary Footer */}
           <div className="p-10 border-t border-slate-100 bg-slate-50/30 flex justify-center">
              <div className="flex items-center gap-12">
                 <div className="flex items-center gap-3">
                    <div className="w-2.5 h-2.5 rounded-full bg-[#00bd7f]"></div>
                    <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Passed (92%)</span>
                 </div>
                 <div className="flex items-center gap-3">
                    <div className="w-2.5 h-2.5 rounded-full bg-rose-500"></div>
                    <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Failed (4%)</span>
                 </div>
                 <div className="flex items-center gap-3">
                    <div className="w-2.5 h-2.5 rounded-full bg-amber-500"></div>
                    <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Absent (4%)</span>
                 </div>
              </div>
           </div>
        </div>
      </div>
    </div>
  );
};

export default ExamReports;
