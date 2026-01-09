import { useState, useEffect } from "react";
import { useLocation } from "react-router-dom";
import { 
  CreditCard, 
  Search, 
  Filter, 
  Download, 
  FileBarChart2, 
  Receipt, 
  AlertCircle, 
  Gavel,
  MoreVertical,
  ChevronDown,
  Printer,
  Calendar,
  DollarSign
} from "lucide-react";

const FeesReports = () => {
  const location = useLocation();
  const [activeTab, setActiveTab] = useState("general");

  useEffect(() => {
    const path = location.pathname;
    if (path.includes("receipts")) setActiveTab("receipts");
    else if (path.includes("due")) setActiveTab("due");
    else if (path.includes("fine")) setActiveTab("fine");
    else setActiveTab("general");
  }, [location.pathname]);

  const tabs = [
    { id: "general", label: "Fees Report", icon: DollarSign },
    { id: "receipts", label: "Receipts Report", icon: Receipt },
    { id: "due", label: "Due Fees Report", icon: AlertCircle },
    { id: "fine", label: "Fine Report", icon: Gavel },
  ];

  return (
    <div className="min-h-screen bg-slate-50/50 p-4 md:p-8 animate-in fade-in duration-500">
      <div className="max-w-[1600px] mx-auto space-y-8">
        
        {/* Header Section */}
        <div className="bg-white rounded-[2.5rem] border border-slate-200 p-8 shadow-sm flex flex-col lg:flex-row justify-between items-center gap-6">
          <div className="flex items-center gap-6">
            <div className="w-16 h-16 bg-amber-50 rounded-2xl flex items-center justify-center border border-amber-100 shadow-inner">
              <FileBarChart2 className="w-8 h-8 text-amber-600" />
            </div>
            <div>
              <h1 className="text-2xl md:text-3xl font-black text-slate-800 tracking-tight text-uppercase">Fees & Revenue Reports</h1>
              <p className="text-slate-500 font-bold mt-1">Detailed financial analysis of student fees, outstanding dues and penalties</p>
            </div>
          </div>

          <div className="flex gap-4 w-full lg:w-auto">
            <button className="flex-1 lg:flex-none px-8 py-4 bg-slate-100 text-slate-600 rounded-2xl font-black hover:bg-slate-200 transition-all flex items-center justify-center gap-3 border border-slate-200 uppercase tracking-widest text-[11px]">
               <Calendar className="w-5 h-5" />
               Custom Period
            </button>
            <button className="flex-[2] lg:flex-none px-8 py-4 bg-amber-600 text-white rounded-2xl font-black shadow-xl shadow-amber-100 hover:bg-amber-700 hover:scale-[1.02] active:scale-95 transition-all flex items-center justify-center gap-3 uppercase tracking-widest text-[11px]">
              <Download className="w-5 h-5" />
              Download Report
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
                   ? "bg-amber-600 text-white shadow-lg shadow-amber-100 scale-[1.02]" 
                   : "text-slate-400 hover:bg-slate-50 hover:text-slate-600"
               }`}
             >
               <tab.icon className={`w-5 h-5 ${activeTab === tab.id ? "text-white" : "text-slate-300"}`} />
               {tab.label}
             </button>
           ))}
        </div>

        {/* Stats Row */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
           <div className="bg-white rounded-[2.5rem] border border-slate-200 p-8 shadow-sm flex flex-col gap-4">
              <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest leading-none">Total Collection</p>
              <h3 className="text-3xl font-black text-slate-800 tracking-tight">$12,450.00</h3>
              <div className="flex items-center gap-2 text-emerald-500 text-[10px] font-black uppercase">
                 <div className="w-2 h-2 rounded-full bg-emerald-500"></div> +8.2% vs Last Month
              </div>
           </div>
           <div className="bg-white rounded-[2.5rem] border border-slate-200 p-8 shadow-sm flex flex-col gap-4">
              <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest leading-none">Outstanding Dues</p>
              <h3 className="text-3xl font-black text-rose-600 tracking-tight">$3,120.50</h3>
              <div className="flex items-center gap-2 text-rose-400 text-[10px] font-black uppercase tracking-widest">
                 Action Required
              </div>
           </div>
        </div>

        {/* Filters and Search */}
        <div className="bg-white rounded-[3rem] border border-slate-200 p-10 shadow-sm space-y-10">
           <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              <div className="space-y-3">
                 <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest px-1">Session Year</label>
                 <select className="w-full bg-slate-50 border border-slate-100 rounded-2xl px-6 py-4 text-sm font-bold focus:border-amber-500 transition-all outline-none appearance-none">
                    <option>2025 - 2026</option>
                    <option>2024 - 2025</option>
                 </select>
              </div>
              <div className="space-y-3">
                 <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest px-1">Fees Type</label>
                 <select className="w-full bg-slate-50 border border-slate-100 rounded-2xl px-6 py-4 text-sm font-bold focus:border-amber-500 transition-all outline-none appearance-none">
                    <option>Admission Fee</option>
                    <option>Tuition Fee</option>
                    <option>Exam Fee</option>
                    <option>Library Fee</option>
                 </select>
              </div>
              <div className="space-y-3 flex items-end">
                 <button className="w-full py-4 bg-slate-900 text-white rounded-2xl font-black uppercase tracking-widest text-[11px] shadow-xl shadow-slate-200">
                    Apply Filter & Fetch
                 </button>
              </div>
           </div>

           <div className="overflow-x-auto pt-4">
              <table className="w-full border-collapse">
                 <thead>
                    <tr className="border-b border-slate-50 text-[10px] font-black text-slate-400 uppercase tracking-widest">
                       <th className="px-8 py-5 text-left">Reference</th>
                       <th className="px-8 py-5 text-left">Payer Details</th>
                       <th className="px-8 py-5 text-left">Fees Type</th>
                       <th className="px-8 py-5 text-center">Amount</th>
                       <th className="px-8 py-5 text-center">Status</th>
                       <th className="px-8 py-5 text-right">Actions</th>
                    </tr>
                 </thead>
                 <tbody className="divide-y divide-slate-50">
                    {[1, 2, 3, 4].map((i) => (
                      <tr key={i} className="group hover:bg-slate-50/50 transition-all">
                         <td className="px-8 py-6">
                            <span className="text-xs font-black text-slate-400 font-mono tracking-tighter uppercase">INV-0987-0{i}</span>
                         </td>
                         <td className="px-8 py-6">
                            <div className="flex items-center gap-4">
                               <div className="w-10 h-10 bg-slate-100 rounded-xl flex items-center justify-center font-black text-slate-400 uppercase text-xs">SM</div>
                               <div>
                                  <p className="text-sm font-black text-slate-800 uppercase tracking-tight">Saeed Mohsen</p>
                                  <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest italic">Hifz / Sec A</p>
                               </div>
                            </div>
                         </td>
                         <td className="px-8 py-6">
                            <p className="text-sm font-bold text-slate-600">Monthly Tuition Fee</p>
                            <p className="text-[10px] font-bold text-slate-400">January 2026</p>
                         </td>
                         <td className="px-8 py-6 text-center">
                            <span className="text-sm font-black text-slate-800">$120.00</span>
                         </td>
                         <td className="px-8 py-6 text-center">
                            <span className={`px-4 py-1.5 rounded-full text-[10px] font-black uppercase tracking-widest border ${
                               activeTab === "due" ? "bg-rose-50 text-rose-500 border-rose-100" : "bg-emerald-50 text-emerald-600 border-emerald-100"
                            }`}>
                               {activeTab === "due" ? "Pending" : "Paid"}
                            </span>
                         </td>
                         <td className="px-8 py-6 text-right">
                            <button className="p-2.5 bg-white border border-slate-200 rounded-xl text-slate-400 hover:text-amber-600 hover:border-amber-200 shadow-sm transition-all">
                               <Printer className="w-4 h-4" />
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

export default FeesReports;
