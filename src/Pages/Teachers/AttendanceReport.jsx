import { useState } from "react";
import { 
  BarChart3, 
  Calendar, 
  Download, 
  Search, 
  Filter, 
  ChevronRight,
  UserCheck,
  TrendingDown,
  TrendingUp,
  PieChart
} from "lucide-react";

const TeacherAttendanceReport = () => {
  const reports = [
    { id: 1, name: "Abdullah Al Mamun", present: 22, absent: 2, late: 1, percentage: "92%" },
    { id: 2, name: "Zaid Bin Harith", present: 24, absent: 1, late: 0, percentage: "96%" },
    { id: 3, name: "Omar Faruk", present: 20, absent: 3, late: 2, percentage: "85%" },
    { id: 4, name: "Saeed Mohsen", present: 25, absent: 0, late: 0, percentage: "100%" },
  ];

  return (
    <div className="min-h-screen bg-slate-50/50 p-4 md:p-8 animate-in fade-in duration-500">
      <div className="max-w-[1600px] mx-auto space-y-6 md:space-y-8">
        
        {/* Header */}
        <div className="bg-white rounded-[1.5rem] md:rounded-[2.5rem] border border-slate-200 p-6 md:p-8 shadow-sm flex flex-col lg:flex-row justify-between items-center gap-6">
          <div className="flex items-center gap-4 md:gap-8">
            <div className="w-12 h-12 md:w-20 md:h-20 bg-slate-900 rounded-xl md:rounded-3xl flex items-center justify-center border border-slate-800 shadow-inner shrink-0">
              <BarChart3 className="w-6 h-6 md:w-10 md:h-10 text-white" />
            </div>
            <div>
              <h1 className="text-xl md:text-3xl font-black text-slate-800 tracking-tight uppercase leading-none mb-1 md:mb-3">Attendance Analytics</h1>
              <p className="text-slate-500 font-bold mt-1 text-xs md:text-base">Comprehensive performance and presence reporting for assigned sections</p>
            </div>
          </div>

          <div className="flex gap-4 w-full lg:w-auto">
             <button className="flex-1 lg:flex-none px-6 md:px-10 py-3.5 md:py-4 bg-slate-100 text-slate-600 rounded-xl md:rounded-2xl font-black hover:bg-slate-200 transition-all border border-slate-200 text-[10px] md:text-[11px] uppercase tracking-widest flex items-center justify-center gap-3">
               <Download className="w-4 h-4" /> Export CSV
            </button>
          </div>
        </div>

        {/* Analytics Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
           <div className="bg-white p-6 md:p-8 rounded-[1.5rem] md:rounded-[2.5rem] border border-slate-200 shadow-sm flex items-center gap-6 group hover:border-emerald-200 transition-all">
              <div className="w-12 h-12 md:w-14 md:h-14 bg-emerald-50 rounded-xl md:rounded-2xl flex items-center justify-center text-emerald-600 shrink-0 shadow-inner">
                 <TrendingUp className="w-6 h-6" />
              </div>
              <div>
                 <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-1">Avg. Attendance</p>
                 <h4 className="text-xl font-black text-slate-800 tracking-tight">94.8%</h4>
              </div>
           </div>
           
           <div className="bg-white p-6 md:p-8 rounded-[1.5rem] md:rounded-[2.5rem] border border-slate-200 shadow-sm flex items-center gap-6 group hover:border-rose-200 transition-all">
              <div className="w-12 h-12 md:w-14 md:h-14 bg-rose-50 rounded-xl md:rounded-2xl flex items-center justify-center text-rose-600 shrink-0 shadow-inner">
                 <TrendingDown className="w-6 h-6" />
              </div>
              <div>
                 <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-1">Highest Absenteeism</p>
                 <h4 className="text-xl font-black text-slate-800 tracking-tight">Sec B (12%)</h4>
              </div>
           </div>

           <div className="bg-white rounded-[1.5rem] md:rounded-[2.5rem] border border-slate-200 p-6 md:p-8 shadow-sm flex items-center lg:col-span-2">
              <div className="flex-1">
                 <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-2">Monthly Presence Trend</p>
                 <div className="flex items-end gap-1.5 h-12">
                    {[30, 60, 45, 90, 70, 85, 40, 65, 80, 50, 95].map((h, i) => (
                       <div key={i} className={`flex-1 rounded-t-sm transition-all group-hover:opacity-80 ${h > 70 ? 'bg-emerald-500' : 'bg-rose-400'}`} style={{ height: `${h}%` }}></div>
                    ))}
                 </div>
              </div>
              <PieChart className="w-10 h-10 text-slate-100 ml-8 shrink-0" />
           </div>
        </div>

        {/* Detailed Report Table */}
        <div className="bg-white rounded-[1.5rem] md:rounded-[3rem] border border-slate-200 shadow-sm overflow-hidden animate-in slide-in-from-bottom duration-700">
           <div className="p-6 md:p-10 border-b border-slate-50 flex flex-col sm:flex-row items-center justify-between gap-6">
              <div className="flex items-center gap-4 w-full sm:w-auto">
                 <Filter className="w-5 h-5 text-slate-400" />
                 <h2 className="text-lg md:text-xl font-black text-slate-800 tracking-tight uppercase">Detailed Monthly Evaluation</h2>
              </div>
              <div className="flex gap-4 w-full sm:w-auto">
                 <div className="relative flex-1 sm:flex-none">
                    <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-300" />
                    <input className="bg-slate-50 border border-slate-100 rounded-xl px-10 py-3 text-xs font-bold focus:border-indigo-500 outline-none w-full sm:w-64" placeholder="Search student..." />
                 </div>
              </div>
           </div>

           <div className="overflow-x-auto">
              <table className="w-full border-collapse min-w-[800px]">
                 <thead>
                    <tr className="border-b border-slate-100 text-[10px] font-black text-slate-400 uppercase tracking-widest bg-slate-50/10">
                       <th className="px-6 md:px-10 py-4 md:py-6 text-left">Student Identity</th>
                       <th className="px-6 md:px-10 py-4 md:py-6 text-center">Working Days</th>
                       <th className="px-6 md:px-10 py-4 md:py-6 text-center">Present</th>
                       <th className="px-6 md:px-10 py-4 md:py-6 text-center">Absent</th>
                       <th className="px-6 md:px-10 py-4 md:py-6 text-center">Ratio</th>
                       <th className="px-6 md:px-10 py-4 md:py-6 text-right">View Log</th>
                    </tr>
                 </thead>
                 <tbody className="divide-y divide-slate-50">
                    {reports.map((report) => (
                       <tr key={report.id} className="group hover:bg-slate-50/40 transition-all">
                          <td className="px-6 md:px-10 py-4 md:py-6">
                             <div className="flex items-center gap-4 md:gap-6">
                                <div className="w-10 h-10 md:w-12 md:h-12 bg-slate-100 rounded-xl flex items-center justify-center font-black text-slate-300 shadow-inner group-hover:scale-110 transition-transform">
                                   0{report.id}
                                </div>
                                <h4 className="text-sm font-black text-slate-800 uppercase tracking-tight">{report.name}</h4>
                             </div>
                          </td>
                          <td className="px-6 md:px-10 py-4 md:py-6 text-center text-sm font-bold text-slate-500">25</td>
                          <td className="px-6 md:px-10 py-4 md:py-6 text-center text-sm font-black text-emerald-600">{report.present}</td>
                          <td className="px-6 md:px-10 py-4 md:py-6 text-center text-sm font-black text-rose-500">{report.absent}</td>
                          <td className="px-6 md:px-10 py-4 md:py-6 text-center">
                             <span className={`px-4 py-1.5 rounded-full text-[10px] font-black uppercase tracking-widest border ${
                                parseInt(report.percentage) > 90 ? 'bg-emerald-50 text-emerald-600 border-emerald-100' : 'bg-amber-50 text-amber-600 border-amber-100'
                             }`}>
                                {report.percentage}
                             </span>
                          </td>
                          <td className="px-6 md:px-10 py-4 md:py-6 text-right">
                             <button className="p-2 md:p-3 bg-white border border-slate-100 rounded-lg md:rounded-xl text-slate-200 hover:text-indigo-600 transition-all shadow-sm hover:scale-110">
                                <ChevronRight className="w-4 h-4" />
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

export default TeacherAttendanceReport;
