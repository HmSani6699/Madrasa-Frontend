import { useState, useEffect } from "react";
import { useLocation } from "react-router-dom";
import { 
  CalendarCheck, 
  Search, 
  Filter, 
  Download, 
  UserCheck, 
  Users, 
  Clock, 
  Calendar, 
  ClipboardCheck,
  MoreVertical,
  ChevronDown,
  Printer,
  BarChart2,
  PieChart
} from "lucide-react";

const AttendanceReports = () => {
  const location = useLocation();
  const [activeTab, setActiveTab] = useState("daily");

  useEffect(() => {
    const path = location.pathname;
    if (path.includes("student-daily")) setActiveTab("daily");
    else if (path.includes("student-overview")) setActiveTab("overview");
    else if (path.includes("subject-wise")) setActiveTab("subject");
    else if (path.includes("employee")) setActiveTab("employee");
    else setActiveTab("daily");
  }, [location.pathname]);

  const tabs = [
    { id: "daily", label: "Student Daily", icon: CalendarCheck },
    { id: "overview", label: "Student Overview", icon: ClipboardCheck },
    { id: "subject", label: "Subject Wise", icon: PieChart },
    { id: "employee", label: "Employee Reports", icon: Users },
  ];

  return (
    <div className="min-h-screen bg-slate-50/50 p-4 md:p-8 animate-in fade-in duration-500">
      <div className="max-w-[1600px] mx-auto space-y-8">
        
        {/* Header Section */}
        <div className="bg-white rounded-[2.5rem] border border-slate-200 p-8 shadow-sm flex flex-col lg:flex-row justify-between items-center gap-6">
          <div className="flex items-center gap-6">
            <div className="w-16 h-16 bg-emerald-50 rounded-2xl flex items-center justify-center border border-emerald-100 shadow-inner">
              <CalendarCheck className="w-8 h-8 text-emerald-600" />
            </div>
            <div>
              <h1 className="text-2xl md:text-3xl font-black text-slate-800 tracking-tight text-uppercase">Attendance Analytics</h1>
              <p className="text-slate-500 font-bold mt-1">Comprehensive presence reports, leave tracking, and punctuality metrics</p>
            </div>
          </div>

          <div className="flex gap-4 w-full lg:w-auto">
             <button className="flex-1 lg:flex-none px-8 py-4 bg-slate-100 text-slate-600 rounded-2xl font-black hover:bg-slate-200 transition-all flex items-center justify-center gap-3 border border-slate-200 uppercase tracking-widest text-[11px]">
               <Calendar className="w-5 h-5" />
               Select Date
            </button>
            <button className="flex-[2] lg:flex-none px-8 py-4 bg-emerald-600 text-white rounded-2xl font-black shadow-xl shadow-emerald-100 hover:bg-emerald-700 hover:scale-[1.02] active:scale-95 transition-all flex items-center justify-center gap-3 uppercase tracking-widest text-[11px]">
              <Printer className="w-5 h-5" />
              Print Selected
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
                   ? "bg-emerald-600 text-white shadow-lg shadow-emerald-100 scale-[1.02]" 
                   : "text-slate-400 hover:bg-slate-50 hover:text-slate-600"
               }`}
             >
               <tab.icon className={`w-5 h-5 ${activeTab === tab.id ? "text-white" : "text-slate-300"}`} />
               {tab.label}
             </button>
           ))}
        </div>

        {/* Dashboard Cards Concept */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
           {['Present', 'Absent', 'On Leave', 'Late'].map((label, idx) => (
              <div key={label} className="bg-white rounded-[2rem] border border-slate-200 p-6 shadow-sm group hover:border-emerald-200 transition-all">
                 <div className="flex justify-between items-center mb-4">
                    <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">{label}</p>
                    <div className={`w-8 h-8 rounded-lg flex items-center justify-center bg-slate-50 text-slate-400 group-hover:bg-emerald-50 group-hover:text-emerald-600 transition-colors`}>
                       <Clock className="w-4 h-4" />
                    </div>
                 </div>
                 <div className="flex items-end justify-between">
                    <h4 className="text-3xl font-black text-slate-800 tracking-tight">{[245, 12, 5, 8][idx]}</h4>
                    <span className="text-[10px] font-black text-emerald-500">+2%</span>
                 </div>
              </div>
           ))}
        </div>

        {/* List Content */}
        <div className="bg-white rounded-[3rem] border border-slate-200 shadow-sm overflow-hidden">
           <div className="p-10 border-b border-slate-50 bg-slate-50/20 flex flex-col md:flex-row justify-between items-center gap-8">
              <div className="flex-1 space-y-3">
                 <div className="flex items-center gap-4">
                    <h2 className="text-2xl font-black text-slate-800 tracking-tight uppercase tracking-tight">{tabs.find(t => t.id === activeTab)?.label} Data</h2>
                 </div>
                 <p className="text-xs font-bold text-slate-400 uppercase tracking-widest">Filters applied: All Subjects, Grade 10, Section B</p>
              </div>
              
              <div className="flex gap-4 shrink-0">
                 <div className="relative">
                    <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-300" />
                    <input className="bg-white border border-slate-200 rounded-xl pl-10 pr-6 py-3 text-sm font-bold focus:border-emerald-500 outline-none w-64 shadow-sm transition-all" placeholder="Search by name..." />
                 </div>
                 <button className="px-6 py-3 bg-slate-900 text-white rounded-xl text-[10px] font-black uppercase tracking-widest hover:bg-slate-800 transition-all shadow-xl shadow-slate-200">
                    Apply Filter
                 </button>
              </div>
           </div>

           <div className="overflow-x-auto">
              <table className="w-full border-collapse">
                 <thead>
                    <tr className="border-b border-slate-50 text-[10px] font-black text-slate-400 uppercase tracking-widest">
                       <th className="px-10 py-6 text-left">Entity Info</th>
                       <th className="px-10 py-6 text-center">Status</th>
                       <th className="px-10 py-6 text-center">In Time</th>
                       <th className="px-10 py-6 text-center">Out Time</th>
                       <th className="px-10 py-6 text-center">Duration</th>
                       <th className="px-10 py-6 text-right">Remarks</th>
                    </tr>
                 </thead>
                 <tbody className="divide-y divide-slate-50">
                    {[1, 2, 3, 4, 5].map((i) => (
                       <tr key={i} className="group hover:bg-slate-50/50 transition-all">
                          <td className="px-10 py-6">
                             <div className="flex items-center gap-4">
                                <div className="w-12 h-12 bg-slate-100 rounded-2xl flex items-center justify-center font-black text-slate-400 group-hover:scale-110 transition-transform">AA</div>
                                <div>
                                   <p className="text-sm font-black text-slate-800 uppercase tracking-tight">Abdullah Al Mamun</p>
                                   <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Roll: 102 | Sec: A</p>
                                </div>
                             </div>
                          </td>
                          <td className="px-10 py-6 text-center">
                             <div className={`inline-flex items-center gap-2 px-4 py-1.5 rounded-full text-[10px] font-black uppercase tracking-widest border ${
                                i % 3 === 0 ? "bg-rose-50 text-rose-500 border-rose-100" : "bg-emerald-50 text-emerald-600 border-emerald-100"
                             }`}>
                                <UserCheck className="w-3 h-3" />
                                {i % 3 === 0 ? "Absent" : "Present"}
                             </div>
                          </td>
                          <td className="px-10 py-6 text-center text-sm font-bold text-slate-600 font-mono">08:15 AM</td>
                          <td className="px-10 py-6 text-center text-sm font-bold text-slate-600 font-mono">02:30 PM</td>
                          <td className="px-10 py-6 text-center">
                             <span className="text-xs font-black text-slate-400 uppercase tracking-widest">6h 15m</span>
                          </td>
                          <td className="px-10 py-6 text-right">
                             <span className="text-xs font-bold text-slate-400 italic">None</span>
                          </td>
                       </tr>
                    ))}
                 </tbody>
              </table>
           </div>

           <div className="p-10 bg-slate-50/50 flex justify-center border-t border-slate-100 text-[10px] font-black uppercase tracking-widest text-slate-400">
              <div className="flex items-center gap-10">
                 <div className="flex items-center gap-2">
                    <div className="w-2 h-2 rounded-full bg-emerald-500"></div> Present (92%)
                 </div>
                 <div className="flex items-center gap-2">
                    <div className="w-2 h-2 rounded-full bg-rose-500"></div> Absent (5%)
                 </div>
                 <div className="flex items-center gap-2">
                    <div className="w-2 h-2 rounded-full bg-amber-500"></div> Late (3%)
                 </div>
              </div>
           </div>
        </div>

      </div>
    </div>
  );
};

export default AttendanceReports;
