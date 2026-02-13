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
  PieChart,
  Plus,
  Printer
} from "lucide-react";
import SelectInputField from "../../components/SelectInputField";

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
        
       

        {/* Filters Area */}
      <div className="bg-white rounded-3xl border-2 border-slate-200 p-4 sm:p-6 md:p-8 shadow-sm">
              <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
                 <SelectInputField title={'Class'} options={[{ value: "Class One" }, { value: "Class Two" }, { value: "Class Three" }]} />
            <SelectInputField title={'Subject'} options={[{value:"Bangla"},{value:"English"},{value:"Math"}]}/>
            <SelectInputField title={'Date'} options={[{value:"Last 7 days"},{value:"Last 15 days"},{value:"Last 30 days"}]}/>
         
          <div className="lg:mt-[25px]">
              <button className="w-full flex items-center justify-center gap-2 px-5 py-3.5 text-sm font-bold bg-[#00bd7f] text-white rounded-xl shadow-lg shadow-emerald-500/30 hover:shadow-xl hover:shadow-emerald-500/40 hover:scale-[1.02] transition-all">
              <Plus className="w-4 h-4" />
              Filter
            </button>
      </div>
        </div>
      </div>

        {/* Detailed Report Table */}
        <div className="bg-white rounded-[20px] border border-slate-200 shadow-sm overflow-hidden animate-in slide-in-from-bottom duration-700">
           <div className="p-4 md:p-5 border-b border-slate-50 flex flex-col sm:flex-row items-center justify-between gap-6">
              <div className="flex items-center gap-4 w-full sm:w-auto">
                 <Filter className="w-5 h-5 text-slate-400" />
                 <h2 className="text-lg md:text-xl font-black text-slate-800 tracking-tight ">Detailed Monthly Evaluation</h2>
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
                    <tr className="border-b border-slate-100 text-[10px] font-black text-slate-400 uppercase tracking-widest bg-slate-50/10 whitespace-nowrap">
                       <th className="px-6 md:px-10 py-3 md:py-3 text-left">Student Identity</th>
                       <th className="px-6 md:px-10 py-3 md:py-3 text-center">Working Days</th>
                       <th className="px-6 md:px-10 py-3 md:py-3 text-center">Present</th>
                       <th className="px-6 md:px-10 py-3 md:py-3 text-center">Absent</th>
                       <th className="px-6 md:px-10 py-3 md:py-3 text-right">Action</th>
                    </tr>
                 </thead>
                 <tbody className="divide-y divide-slate-50">
                    {reports.map((report) => (
                       <tr key={report.id} className="group hover:bg-slate-50/40 transition-all whitespace-nowrap">
                          <td className="px-6 md:px-10 py-3 md:py-3">
                             <div className="flex items-center gap-4 md:gap-6">
                                <div className="w-10 h-10 md:w-12 md:h-12 bg-slate-100 rounded-xl flex items-center justify-center font-black text-slate-300 shadow-inner group-hover:scale-110 transition-transform">
                                   0{report.id}
                                </div>
                                <h4 className="text-sm font-black text-slate-800 uppercase tracking-tight">{report.name}</h4>
                             </div>
                          </td>
                          <td className="px-6 md:px-10 py-3 md:py-3 text-center text-sm font-bold text-slate-500">25</td>
                          <td className="px-6 md:px-10 py-3 md:py-3 text-center text-sm font-black text-emerald-600">{report.present}</td>
                          <td className="px-6 md:px-10 py-3 md:py-3 text-center text-sm font-black text-rose-500">{report.absent}</td>
                        
                          <td className="px-6 md:px-10 py-3 md:py-3 text-right">
                            <div className="flex justify-end gap-2">
                                <button className="p-2.5 hover:bg-slate-100 rounded-xl transition-all text-slate-400 hover:text-[#00bd7f] border border-slate-100"><Printer className="w-4 h-4" /></button>
                                <button className="p-2.5 hover:bg-slate-100 rounded-xl transition-all text-slate-400 hover:text-[#00bd7f] border border-slate-100"><Download className="w-4 h-4" /></button>
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

export default TeacherAttendanceReport;
