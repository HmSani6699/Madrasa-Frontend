import { useState, useEffect } from "react";
import { useLocation } from "react-router-dom";
import { 
  Users, 
  Search, 
  Filter, 
  Download, 
  FileText, 
  Key, 
  UserPlus, 
  Layers, 
  Users2,
  MoreVertical,
  ChevronDown,
  Printer,
  Eye
} from "lucide-react";

const StudentReports = () => {
  const location = useLocation();
  const [activeTab, setActiveTab] = useState("login");

  // Sync active tab with URL path
  useEffect(() => {
    const path = location.pathname;
    if (path.includes("login")) setActiveTab("login");
    else if (path.includes("admission")) setActiveTab("admission");
    else if (path.includes("class-section")) setActiveTab("class-section");
    else if (path.includes("sibling")) setActiveTab("sibling");
  }, [location.pathname]);

  const tabs = [
    { id: "login", label: "Login Credentials", icon: Key },
    { id: "admission", label: "Admission Report", icon: UserPlus },
    { id: "class-section", label: "Class & Section", icon: Layers },
    { id: "sibling", label: "Sibling Report", icon: Users2 },
  ];

  return (
    <div className="min-h-screen bg-slate-50/50 p-4 md:p-8 animate-in fade-in duration-500">
      <div className="max-w-[1600px] mx-auto space-y-8">
        
        {/* Header Section */}
        <div className="bg-white rounded-[2.5rem] border border-slate-200 p-8 shadow-sm flex flex-col lg:flex-row justify-between items-center gap-6">
          <div className="flex items-center gap-6">
            <div className="w-16 h-16 bg-blue-50 rounded-2xl flex items-center justify-center border border-blue-100 shadow-inner">
              <FileText className="w-8 h-8 text-blue-600" />
            </div>
            <div>
              <h1 className="text-2xl md:text-3xl font-black text-slate-800 tracking-tight text-uppercase">Student Reports</h1>
              <p className="text-slate-500 font-bold mt-1">Generate and export comprehensive reports for all student metrics</p>
            </div>
          </div>

          <div className="flex gap-4 w-full lg:w-auto">
            <button className="flex-1 lg:flex-none px-8 py-4 bg-slate-100 text-slate-600 rounded-2xl font-black hover:bg-slate-200 transition-all flex items-center justify-center gap-3 border border-slate-200">
              <Printer className="w-5 h-5" />
              Print All
            </button>
            <button className="flex-[2] lg:flex-none px-8 py-4 bg-blue-600 text-white rounded-2xl font-black shadow-xl shadow-blue-100 hover:bg-blue-700 hover:scale-[1.02] active:scale-95 transition-all flex items-center justify-center gap-3">
              <Download className="w-5 h-5" />
              Export Bulk
            </button>
          </div>
        </div>

        {/* Tab Navigation */}
        <div className="bg-white p-2 rounded-[2rem] border border-slate-200 shadow-sm flex flex-wrap gap-2">
           {tabs.map((tab) => (
             <button
               key={tab.id}
               onClick={() => setActiveTab(tab.id)}
               className={`flex items-center gap-3 px-6 py-4 rounded-2xl font-black transition-all ${
                 activeTab === tab.id 
                   ? "bg-blue-600 text-white shadow-lg shadow-blue-100 scale-[1.02]" 
                   : "text-slate-400 hover:bg-slate-50 hover:text-slate-600"
               }`}
             >
               <tab.icon className={`w-5 h-5 ${activeTab === tab.id ? "text-white" : "text-slate-300"}`} />
               {tab.label}
             </button>
           ))}
        </div>

        {/* Filters Area */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
           <div className="bg-white rounded-[2rem] border border-slate-200 p-6 shadow-sm">
              <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-3 block">Search Student</label>
              <div className="relative">
                 <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-300" />
                 <input className="w-full bg-slate-50 border border-slate-100 rounded-xl pl-10 pr-4 py-3 text-sm font-bold focus:border-blue-500 outline-none transition-all" placeholder="Enter name or ID..." />
              </div>
           </div>
           <div className="bg-white rounded-[2rem] border border-slate-200 p-6 shadow-sm">
              <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-3 block">Class & Section</label>
              <div className="relative">
                 <Layers className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-300" />
                 <select className="w-full bg-slate-50 border border-slate-100 rounded-xl pl-10 pr-4 py-3 text-sm font-bold focus:border-blue-500 outline-none appearance-none cursor-pointer">
                    <option>All Classes</option>
                    <option>Hifz-A</option>
                    <option>Mishkat-B</option>
                 </select>
                 <ChevronDown className="absolute right-4 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-300 pointer-events-none" />
              </div>
           </div>
           <div className="bg-white rounded-[2rem] border border-slate-200 p-6 shadow-sm">
              <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-3 block">Report Format</label>
              <div className="grid grid-cols-2 gap-2">
                 <button className="py-3 bg-blue-50 text-blue-600 rounded-xl text-[10px] font-black uppercase tracking-widest border border-blue-100">PDF</button>
                 <button className="py-3 bg-slate-50 text-slate-400 rounded-xl text-[10px] font-black uppercase tracking-widest border border-slate-100 hover:bg-slate-100 hover:text-slate-600 transition-all">Excel</button>
              </div>
           </div>
           <div className="bg-white rounded-[2.5rem] p-6 shadow-sm border border-slate-200 flex items-center justify-center">
              <button className="w-full h-full bg-slate-900 text-white rounded-2xl font-black uppercase tracking-widest text-[11px] hover:bg-slate-800 transition-all shadow-xl shadow-slate-200 flex items-center justify-center gap-3">
                 <Filter className="w-4 h-4" />
                 Apply Filters
              </button>
           </div>
        </div>

        {/* Data Display */}
        <div className="bg-white rounded-[3rem] border border-slate-200 shadow-sm overflow-hidden">
           <div className="p-10 border-b border-slate-50 bg-slate-50/30 flex items-center justify-between">
              <div className="flex items-center gap-4">
                 <div className="w-10 h-10 bg-white rounded-xl flex items-center justify-center shadow-sm">
                    <Users className="w-5 h-5 text-blue-600" />
                 </div>
                 <h2 className="text-xl font-black text-slate-800 tracking-tight uppercase tracking-tight">{tabs.find(t => t.id === activeTab)?.label} Data</h2>
              </div>
           </div>

           <div className="overflow-x-auto">
              {activeTab === "login" && (
                <table className="w-full border-collapse">
                  <thead>
                    <tr className="border-b border-slate-50 text-[10px] font-black text-slate-400 uppercase tracking-widest">
                       <th className="px-10 py-6 text-left">Student Info</th>
                       <th className="px-10 py-6 text-left">Username</th>
                       <th className="px-10 py-6 text-left">Password (Initial)</th>
                       <th className="px-10 py-6 text-center">Last Login</th>
                       <th className="px-10 py-6 text-right">Actions</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-50">
                     {[1, 2, 3].map((i) => (
                       <tr key={i} className="group hover:bg-slate-50/50 transition-all">
                          <td className="px-10 py-6">
                             <div className="flex items-center gap-4">
                                <div className="w-12 h-12 bg-slate-100 rounded-2xl flex items-center justify-center group-hover:scale-110 transition-transform font-black text-slate-400">AA</div>
                                <div>
                                   <p className="text-sm font-black text-slate-800 uppercase tracking-tight">Abdullah Ali</p>
                                   <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">ID: 202600{i}</p>
                                </div>
                             </div>
                          </td>
                          <td className="px-10 py-6 font-bold text-slate-600 text-sm">abdullah_2026_{i}</td>
                          <td className="px-10 py-6">
                             <span className="bg-slate-100 px-3 py-1 rounded-lg text-xs font-black text-slate-500 font-mono tracking-wider">MMS@{i}9876</span>
                          </td>
                          <td className="px-10 py-6 text-center text-xs font-bold text-slate-400">Jan 09, 2026</td>
                          <td className="px-10 py-6 text-right">
                             <button className="p-2.5 bg-white border border-slate-200 rounded-xl text-slate-400 hover:text-blue-600 hover:border-blue-200 shadow-sm transition-all">
                                <Printer className="w-4 h-4" />
                             </button>
                          </td>
                       </tr>
                     ))}
                  </tbody>
                </table>
              )}

              {activeTab === "admission" && (
                <table className="w-full border-collapse">
                  <thead>
                    <tr className="border-b border-slate-50 text-[10px] font-black text-slate-400 uppercase tracking-widest">
                       <th className="px-10 py-6 text-left">Student Name</th>
                       <th className="px-10 py-6 text-left">Class & Section</th>
                       <th className="px-10 py-6 text-left">Date of Admission</th>
                       <th className="px-10 py-6 text-center">Blood Group</th>
                       <th className="px-10 py-6 text-center">Status</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-50">
                     {[1, 2].map((i) => (
                       <tr key={i} className="group hover:bg-slate-50/50 transition-all">
                          <td className="px-10 py-6">
                             <div className="flex items-center gap-4">
                                <div className="w-12 h-12 bg-blue-50 rounded-2xl flex items-center justify-center group-hover:rotate-12 transition-transform">
                                   <UserPlus className="w-6 h-6 text-blue-400" />
                                </div>
                                <span className="text-sm font-black text-slate-800 uppercase">Omar Faruk</span>
                             </div>
                          </td>
                          <td className="px-10 py-6 text-sm font-bold text-slate-600 uppercase">Hifz / Section A</td>
                          <td className="px-10 py-6 text-sm font-bold text-slate-500">Dec 2{i}, 2025</td>
                          <td className="px-10 py-6 text-center font-black text-rose-500 text-xs">B+</td>
                          <td className="px-10 py-6 text-center">
                             <span className="bg-emerald-50 text-emerald-600 border border-emerald-100 px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-widest">Active</span>
                          </td>
                       </tr>
                     ))}
                  </tbody>
                </table>
              )}

              {/* Add more tables for other tabs as needed */}
           </div>

           <div className="p-10 border-t border-slate-50 bg-slate-50/30 flex justify-between items-center">
              <p className="text-xs font-bold text-slate-400 uppercase tracking-widest">Showing 10 of 258 Students</p>
              <div className="flex gap-2">
                 <button className="w-10 h-10 bg-white border border-slate-200 rounded-xl flex items-center justify-center text-slate-400 disabled:opacity-50" disabled>1</button>
                 <button className="w-10 h-10 bg-white border border-slate-200 rounded-xl flex items-center justify-center text-slate-400 hover:border-blue-200 hover:text-blue-600 transition-all">2</button>
                 <button className="w-16 h-10 bg-white border border-slate-200 rounded-xl flex items-center justify-center text-[10px] font-black uppercase tracking-widest text-slate-400 hover:border-blue-200 hover:text-blue-600 transition-all">Next</button>
              </div>
           </div>
        </div>

      </div>
    </div>
  );
};

export default StudentReports;
