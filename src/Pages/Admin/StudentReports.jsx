import { useState, useEffect } from "react";
import { useLocation } from "react-router-dom";
import { 
  Users, 
  Search, 
  Filter, 
  Download, 
  FileText, 
  UserPlus, 
  Layers, 
  ChevronDown,
  Printer,
  TrendingUp,
  UserMinus,
  PieChart,
  BarChart3,
  Calendar,
  MoreHorizontal
} from "lucide-react";

const StudentReports = () => {
  const location = useLocation();
  // Sync active tab with URL path or default to strength
  useEffect(() => {
    const path = location.pathname;
    if (path.includes("strength")) setActiveTab("strength");
    else if (path.includes("demographics")) setActiveTab("demographics");
    else if (path.includes("withdrawal")) setActiveTab("withdrawal");
  }, [location.pathname]);

  const tabs = [
    { id: "strength", label: "Student Strength", icon: Layers },
    { id: "demographics", label: "Demographics", icon: PieChart },
    { id: "withdrawal", label: "Withdrawal Report", icon: UserMinus },
  ];

  const stats = [
    { label: 'Total Enrollment', value: '1,284', delta: '+12.5%', color: 'emerald', trend: 'up' },
    { label: 'Avg Attendance', value: '94.2%', delta: '+2.1%', color: 'blue', trend: 'up' },
    { label: 'Retention Rate', value: '98.5%', delta: 'Stable', color: 'indigo', trend: 'stable' },
    { label: 'New This Month', value: '42', delta: '+8', color: 'rose', trend: 'up' }
  ];

  return (
    <div className="min-h-screen bg-[#f8fafc] p-4 md:p-8 animate-in fade-in duration-700">
      <div className="max-w-[1600px] mx-auto space-y-8">
        
        {/* Header Section */}
        <div className="bg-white rounded-[2.5rem] border-2 border-slate-100 p-8 shadow-sm flex flex-col lg:flex-row justify-between items-center gap-6 relative overflow-hidden">
          <div className="absolute top-0 right-0 w-64 h-64 bg-emerald-50 rounded-full -mr-32 -mt-32 opacity-50 blur-3xl"></div>
          <div className="absolute bottom-0 left-0 w-48 h-48 bg-blue-50 rounded-full -ml-24 -mb-24 opacity-50 blur-3xl"></div>
          
          <div className="flex items-center gap-6 relative z-10">
            <div className="w-16 h-16 bg-[#00bd7f] rounded-2xl flex items-center justify-center shadow-lg shadow-emerald-200">
              <BarChart3 className="w-8 h-8 text-white" />
            </div>
            <div>
               <h1 className="text-2xl md:text-3xl font-black text-slate-800 tracking-tight uppercase">Muhtamim Intelligence</h1>
               <p className="text-slate-500 font-bold mt-1">Professional Institutional Analytics & Student Performance Metrics</p>
            </div>
          </div>

          <div className="flex gap-4 w-full lg:w-auto relative z-10">
             <button className="flex-1 lg:flex-none px-8 py-4 bg-white text-slate-600 rounded-2xl font-black hover:bg-slate-50 transition-all flex items-center justify-center gap-3 border-2 border-slate-100 uppercase tracking-widest text-[11px]">
               <Printer className="w-5 h-5" />
               Print Report
            </button>
            <button className="flex-[2] lg:flex-none px-8 py-4 bg-slate-900 text-white rounded-2xl font-black shadow-xl shadow-slate-200 hover:bg-slate-800 hover:scale-[1.02] active:scale-95 transition-all flex items-center justify-center gap-3 uppercase tracking-widest text-[11px]">
              <Download className="w-5 h-5" />
              Export Executive Summary
            </button>
          </div>
        </div>

        {/* Executive Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
           {stats.map((stat, idx) => (
              <div key={idx} className="bg-white rounded-[2.2rem] border-2 border-slate-100 p-6 shadow-sm hover:shadow-md hover:border-[#00bd7f]/30 transition-all duration-300 group">
                 <div className="flex justify-between items-center mb-6">
                    <div className="p-3 bg-slate-50 rounded-xl group-hover:bg-[#e6f4ef] transition-colors">
                       <FileText className="w-5 h-5 text-slate-400 group-hover:text-[#00bd7f]" />
                    </div>
                    <span className={`text-[10px] font-black px-3 py-1 rounded-full ${stat.trend === 'up' ? 'bg-emerald-50 text-[#00bd7f]' : 'bg-slate-50 text-slate-400 uppercase letter-spacing-widest'}`}>
                      {stat.delta}
                    </span>
                 </div>
                 <div>
                    <p className="text-[11px] font-black text-slate-400 uppercase tracking-widest mb-1">{stat.label}</p>
                    <h4 className="text-3xl font-black text-slate-800 tracking-tight">{stat.value}</h4>
                 </div>
              </div>
           ))}
        </div>

        {/* Tab Navigation & Search */}
        <div className="flex flex-col xl:flex-row gap-6 items-start xl:items-center justify-between">
          <div className="bg-white p-2 rounded-3xl border-2 border-slate-100 shadow-sm flex flex-wrap gap-1">
             {tabs.map((tab) => (
               <button
                 key={tab.id}
                 onClick={() => setActiveTab(tab.id)}
                 className={`flex items-center gap-3 px-6 py-4 rounded-2xl font-black transition-all ${
                   activeTab === tab.id 
                     ? "bg-[#00bd7f] text-white shadow-lg shadow-emerald-100 scale-[1.02]" 
                     : "text-slate-400 hover:bg-slate-50 hover:text-slate-600"
                 }`}
               >
                 <tab.icon className={`w-5 h-5 ${activeTab === tab.id ? "text-white" : "text-slate-300"}`} />
                 <span className="text-[11px] uppercase tracking-wider">{tab.label}</span>
               </button>
             ))}
          </div>

          <div className="flex gap-4 w-full xl:w-auto">
            <div className="relative group flex-1 xl:w-72">
               <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-300 group-focus-within:text-[#00bd7f] transition-colors" />
               <input className="bg-white border-2 border-slate-100 rounded-2xl pl-12 pr-6 py-4 text-sm font-bold focus:border-[#00bd7f] outline-none w-full shadow-sm transition-all" placeholder="Search records..." />
            </div>
            <button className="px-6 py-4 bg-white border-2 border-slate-100 text-slate-600 rounded-2xl flex items-center gap-2 font-black text-[11px] uppercase tracking-widest hover:bg-slate-50 transition-all">
              <Filter className="w-4 h-4" />
              Filter
            </button>
          </div>
        </div>

        {/* Main Data Container */}
        <div className="bg-white rounded-[3rem] border-2 border-slate-100 shadow-sm overflow-hidden">
           <div className="overflow-x-auto">
              <table className="w-full border-collapse">
                 <thead>
                    <tr className="bg-slate-50/50 border-b-2 border-slate-100 text-[10px] font-black text-slate-400 uppercase tracking-[0.2em]">
                        {activeTab === "strength" && (
                          <>
                            <th className="px-10 py-8 text-left">Class Name</th>
                            <th className="px-10 py-8 text-center">Sections</th>
                            <th className="px-10 py-8 text-center">Total Students</th>
                            <th className="px-10 py-8 text-center">Cap Capacity</th>
                            <th className="px-10 py-8 text-right">Action</th>
                          </>
                        )}
                       {activeTab === "demographics" && (
                         <>
                           <th className="px-10 py-8 text-left">Demographic Metric</th>
                           <th className="px-10 py-8 text-center">Sub-Category</th>
                           <th className="px-10 py-8 text-center">Total Count</th>
                           <th className="px-10 py-8 text-center">Percentage</th>
                           <th className="px-10 py-8 text-right">Analysis</th>
                         </>
                       )}
                       {activeTab === "withdrawal" && (
                         <>
                           <th className="px-10 py-8 text-left">Student Info</th>
                           <th className="px-10 py-8 text-center">Class / Session</th>
                           <th className="px-10 py-8 text-center">Reason</th>
                           <th className="px-10 py-8 text-center">Withdrawal Date</th>
                           <th className="px-10 py-8 text-right">Status</th>
                         </>
                       )}
                    </tr>
                 </thead>
                 <tbody className="divide-y divide-slate-100">


                    {activeTab === "strength" && [
                      { class: 'Hifz Class', sections: '4', total: '120', cap: '95%' },
                      { class: 'Nursery', sections: '3', total: '85', cap: '85%' },
                      { class: 'Class One', sections: '2', total: '60', cap: '100%' },
                      { class: 'Class Two', sections: '2', total: '58', cap: '96%' },
                    ].map((row, i) => (
                       <tr key={i} className="group hover:bg-slate-50/50 transition-all">
                          <td className="px-10 py-7 font-black text-slate-800 uppercase tracking-tight text-sm">{row.class}</td>
                          <td className="px-10 py-7 text-center font-bold text-slate-500">{row.sections}</td>
                          <td className="px-10 py-7 text-center font-black text-slate-800">{row.total}</td>
                          <td className="px-10 py-7 text-center">
                             <div className="w-full bg-slate-100 rounded-full h-1.5 max-w-[100px] mx-auto overflow-hidden">
                                <div className="bg-[#00bd7f] h-full rounded-full" style={{ width: row.cap }}></div>
                             </div>
                             <span className="text-[10px] font-bold text-slate-400 mt-1 block">{row.cap} Capacity</span>
                          </td>
                          <td className="px-10 py-7 text-right">
                             <button className="p-2.5 bg-white border-2 border-slate-100 rounded-xl text-slate-400 hover:text-[#00bd7f] hover:border-[#00bd7f] transition-all">
                                <MoreHorizontal className="w-4 h-4" />
                             </button>
                          </td>
                       </tr>
                    ))}
                    
                    {activeTab === "demographics" && [
                      { metric: 'Gender', sub: 'Male', count: '740', perc: '58%' },
                      { metric: 'Gender', sub: 'Female', count: '544', perc: '42%' },
                      { metric: 'Blood Group', sub: 'O Positive', count: '312', perc: '24%' },
                      { metric: 'Residential', sub: 'Day Scholar', count: '890', perc: '69%' },
                    ].map((row, i) => (
                      <tr key={i} className="group hover:bg-slate-50/50 transition-all">
                         <td className="px-10 py-7">
                            <span className="text-xs font-black text-slate-400 uppercase tracking-widest">{row.metric}</span>
                         </td>
                         <td className="px-10 py-7 text-center font-black text-slate-800 uppercase text-sm">{row.sub}</td>
                         <td className="px-10 py-7 text-center font-bold text-slate-600">{row.count}</td>
                         <td className="px-10 py-7 text-center font-black text-[#00bd7f]">{row.perc}</td>
                         <td className="px-10 py-7 text-right text-[10px] font-bold text-slate-400 uppercase tracking-widest">Normal Range</td>
                      </tr>
                    ))}

                    {activeTab === "withdrawal" && [
                      { name: 'Habibullah Khan', class: 'Hifz Sec B', reason: 'Family Relocated', date: 'Jan 15, 2026', status: 'Completed' },
                      { name: 'Ismail Hossain', class: 'Class 4', reason: 'Health Issues', date: 'Jan 22, 2026', status: 'Pending Clearance' },
                    ].map((row, i) => (
                      <tr key={i} className="group hover:bg-slate-50/50 transition-all">
                         <td className="px-10 py-7">
                            <div className="flex items-center gap-4">
                               <div className="w-10 h-10 bg-rose-50 rounded-xl flex items-center justify-center font-black text-rose-400">
                                  {row.name.charAt(0)}
                               </div>
                               <div>
                                  <p className="text-sm font-black text-slate-800 uppercase">{row.name}</p>
                                  <p className="text-[10px] font-bold text-slate-400">ID: WD-2026-00{i+1}</p>
                               </div>
                            </div>
                         </td>
                         <td className="px-10 py-7 text-center font-bold text-slate-600 uppercase text-xs">{row.class}</td>
                         <td className="px-10 py-7 text-center font-medium text-slate-500 text-sm">{row.reason}</td>
                         <td className="px-10 py-7 text-center font-mono text-xs text-slate-400">{row.date}</td>
                         <td className="px-10 py-7 text-right">
                            <span className={`px-4 py-1.5 rounded-full text-[10px] font-black uppercase tracking-widest border ${row.status.includes('Completed') ? 'bg-emerald-50 text-[#00bd7f] border-emerald-100' : 'bg-amber-50 text-amber-600 border-amber-100'}`}>
                               {row.status}
                            </span>
                         </td>
                      </tr>
                    ))}
                 </tbody>
              </table>
           </div>

           {/* Table Footer */}
           <div className="p-10 bg-slate-50/50 flex flex-col md:flex-row justify-between items-center border-t-2 border-slate-100 gap-6">
              <p className="text-[10px] font-black uppercase tracking-[0.2em] text-slate-400">Confidential Principal Report • Academic Session 2026</p>
              <div className="flex items-center gap-4">
                 <button className="px-6 py-3 bg-white border-2 border-slate-100 text-[10px] font-black uppercase tracking-widest text-slate-400 hover:text-[#00bd7f] hover:border-[#00bd7f] transition-all rounded-xl">Previous Data</button>
                 <button className="px-6 py-3 bg-white border-2 border-slate-100 text-[10px] font-black uppercase tracking-widest text-slate-400 hover:text-[#00bd7f] hover:border-[#00bd7f] transition-all rounded-xl">Next Data</button>
              </div>
           </div>
        </div>
      </div>
    </div>
  );
};

export default StudentReports;
