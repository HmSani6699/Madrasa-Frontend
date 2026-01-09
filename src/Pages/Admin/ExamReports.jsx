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
  const [activeTab, setActiveTab] = useState("examination");

  useEffect(() => {
    const path = location.pathname;
    if (path.includes("card")) setActiveTab("card");
    else if (path.includes("tabulation")) setActiveTab("tabulation");
    else if (path.includes("progress")) setActiveTab("progress");
    else setActiveTab("examination");
  }, [location.pathname]);

  const tabs = [
    { id: "examination", label: "Examination", icon: BookOpen },
    { id: "card", label: "Report Card", icon: Award },
    { id: "tabulation", label: "Tabulation Sheet", icon: Grid },
    { id: "progress", label: "Progress Reports", icon: TrendingUp },
  ];

  return (
    <div className="min-h-screen bg-slate-50/50 p-4 md:p-8 animate-in fade-in duration-500">
      <div className="max-w-[1600px] mx-auto space-y-8">
        
        {/* Header Section */}
        <div className="bg-white rounded-[2.5rem] border border-slate-200 p-8 shadow-sm flex flex-col lg:flex-row justify-between items-center gap-6">
          <div className="flex items-center gap-6">
            <div className="w-16 h-16 bg-indigo-50 rounded-2xl flex items-center justify-center border border-indigo-100 shadow-inner">
              <GraduationCap className="w-8 h-8 text-indigo-600" />
            </div>
            <div>
              <h1 className="text-2xl md:text-3xl font-black text-slate-800 tracking-tight text-uppercase">Academic Results</h1>
              <p className="text-slate-500 font-bold mt-1">Detailed examination metrics, grade sheets, and longitudinal progress tracking</p>
            </div>
          </div>

          <div className="flex gap-4 w-full lg:w-auto">
             <button className="flex-1 lg:flex-none px-8 py-4 bg-slate-100 text-slate-600 rounded-2xl font-black hover:bg-slate-200 transition-all flex items-center justify-center gap-3 border border-slate-200">
               <Printer className="w-5 h-5" />
               Print All
            </button>
            <button className="flex-[2] lg:flex-none px-8 py-4 bg-indigo-600 text-white rounded-2xl font-black shadow-xl shadow-indigo-100 hover:bg-indigo-700 hover:scale-[1.02] active:scale-95 transition-all flex items-center justify-center gap-3">
              <Download className="w-5 h-5" />
              Download Bulk
            </button>
          </div>
        </div>

        {/* Tab Navigation */}
        <div className="bg-white p-2 rounded-[2.5rem] border border-slate-200 shadow-sm flex flex-wrap gap-2">
           {tabs.map((tab) => (
             <button
               key={tab.id}
               onClick={() => setActiveTab(tab.id)}
               className={`flex items-center gap-3 px-6 py-4 rounded-[2rem] font-black transition-all ${
                 activeTab === tab.id 
                   ? "bg-indigo-600 text-white shadow-lg shadow-indigo-100 scale-[1.02]" 
                   : "text-slate-400 hover:bg-slate-50 hover:text-slate-600"
               }`}
             >
               <tab.icon className={`w-5 h-5 ${activeTab === tab.id ? "text-white" : "text-slate-300"}`} />
               {tab.label}
             </button>
           ))}
        </div>

        {/* Result Filters */}
        <div className="bg-white rounded-[3rem] border border-slate-200 p-10 shadow-sm">
           <div className="grid grid-cols-1 md:grid-cols-4 gap-8 mb-10">
              <div className="space-y-3">
                 <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest px-1">Select Exam</label>
                 <select className="w-full bg-slate-50 border border-slate-100 rounded-2xl px-6 py-4 text-sm font-bold focus:border-indigo-500 outline-none appearance-none">
                    <option>Annual Exam 2026</option>
                    <option>Mid Term 2025</option>
                 </select>
              </div>
              <div className="space-y-3">
                 <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest px-1">Class</label>
                 <select className="w-full bg-slate-50 border border-slate-100 rounded-2xl px-6 py-4 text-sm font-bold focus:border-indigo-500 outline-none appearance-none">
                    <option>Hifz</option>
                    <option>Mishkat</option>
                 </select>
              </div>
              <div className="space-y-3">
                 <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest px-1">Section</label>
                 <select className="w-full bg-slate-50 border border-slate-100 rounded-2xl px-6 py-4 text-sm font-bold focus:border-indigo-500 outline-none appearance-none">
                    <option>Section A</option>
                    <option>Section B</option>
                 </select>
              </div>
              <div className="flex items-end">
                 <button className="w-full py-4 bg-slate-900 text-white rounded-2xl font-black uppercase tracking-widest text-[11px] shadow-xl shadow-slate-200">
                    Fetch Report Card
                 </button>
              </div>
           </div>

           <div className="overflow-x-auto">
              <table className="w-full border-collapse">
                 <thead>
                    <tr className="border-b border-slate-50 text-[10px] font-black text-slate-400 uppercase tracking-widest">
                       <th className="px-8 py-5 text-left">Student Info</th>
                       <th className="px-8 py-5 text-center">Total Marks</th>
                       <th className="px-8 py-5 text-center">Average %</th>
                       <th className="px-8 py-5 text-center">Grade</th>
                       <th className="px-8 py-5 text-center">Position</th>
                       <th className="px-8 py-5 text-right">Actions</th>
                    </tr>
                 </thead>
                 <tbody className="divide-y divide-slate-50">
                    {[1, 2, 3, 4].map((i) => (
                       <tr key={i} className="group hover:bg-slate-50/50 transition-all">
                          <td className="px-8 py-6">
                             <div className="flex items-center gap-4">
                                <div className="w-12 h-12 bg-indigo-50 rounded-2xl flex items-center justify-center font-black text-indigo-400 group-hover:scale-110 transition-transform">ZF</div>
                                <div>
                                   <p className="text-sm font-black text-slate-800 uppercase tracking-tight">Zaid Bin Harith</p>
                                   <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest italic">Roll: 104</p>
                                </div>
                             </div>
                          </td>
                          <td className="px-8 py-6 text-center text-sm font-black text-slate-600">845 / 1000</td>
                          <td className="px-8 py-6 text-center text-sm font-black text-slate-600">84.5%</td>
                          <td className="px-8 py-6 text-center">
                             <span className="px-4 py-1.5 bg-emerald-50 text-emerald-600 border border-emerald-100 rounded-lg text-xs font-black">A+</span>
                          </td>
                          <td className="px-8 py-6 text-center font-black text-slate-800 text-sm">{i}th</td>
                          <td className="px-8 py-6 text-right space-x-2">
                             <button className="p-2.5 bg-white border border-slate-200 rounded-xl text-slate-400 hover:text-indigo-600 hover:border-indigo-200 shadow-sm transition-all">
                                <Printer className="w-4 h-4" />
                             </button>
                             <button className="p-2.5 bg-white border border-slate-200 rounded-xl text-slate-400 hover:text-indigo-600 hover:border-indigo-200 shadow-sm transition-all">
                                <FileText className="w-4 h-4" />
                             </button>
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

export default ExamReports;
