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
  DollarSign,
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
    { id: "general", label: "Fees Overview", icon: DollarSign },
    { id: "receipts", label: "Receipts Analytics", icon: Receipt },
    { id: "due", label: "Outstanding Dues", icon: AlertCircle },
    { id: "fine", label: "Penalty Report", icon: Gavel },
  ];

  return (
    <div className="min-h-screen bg-slate-50/50 p-4 md:p-8 animate-in fade-in duration-500">
      <div className="max-w-[1600px] mx-auto space-y-8">
        
        {/* Header Section */}
        <div className="bg-white rounded-[2.5rem] border border-slate-200 p-8 shadow-sm flex flex-col lg:flex-row justify-between items-center gap-6">
          <div className="flex items-center gap-6">
            <div className="w-16 h-16 bg-[#e6f4ef] rounded-2xl flex items-center justify-center border border-emerald-100 shadow-inner">
              <DollarSign className="w-8 h-8 text-[#00bd7f]" />
            </div>
            <div>
              <h1 className="text-2xl md:text-3xl font-black text-slate-800 tracking-tight text-uppercase">Revenue Insights</h1>
              <p className="text-slate-500 font-bold mt-1">Holistic financial tracking, fee collections, and receivable aging reports</p>
            </div>
          </div>

          <div className="flex gap-4 w-full lg:w-auto">
             <button className="flex-1 lg:flex-none px-8 py-4 bg-slate-100 text-slate-600 rounded-2xl font-black hover:bg-slate-200 transition-all flex items-center justify-center gap-3 border border-slate-200 uppercase tracking-widest text-[11px]">
               <Calendar className="w-5 h-5" />
               Period Selector
            </button>
            <button className="flex-[2] lg:flex-none px-8 py-4 bg-[#00bd7f] text-white rounded-2xl font-black shadow-xl shadow-emerald-100 hover:bg-[#009b68] hover:scale-[1.02] active:scale-95 transition-all flex items-center justify-center gap-3 uppercase tracking-widest text-[11px]">
              <Download className="w-5 h-5" />
              Consolidated PDF
            </button>
          </div>
        </div>

        {/* Financial KPIs */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
           {[
             { label: 'Total Revenue', value: '৳ 3.4M', delta: '+15.2%', color: 'emerald', icon: DollarSign },
             { label: 'Pending Dues', value: '৳ 142K', delta: '-1.5%', color: 'rose', icon: AlertCircle },
             { label: 'Daily Collection', value: '৳ 45.2K', delta: '+5.4%', color: 'blue', icon: Receipt },
             { label: 'Late Fine Rec.', value: '৳ 12.8K', delta: '+2.1%', color: 'amber', icon: Gavel }
           ].map((stat, idx) => (
              <div key={idx} className="bg-white rounded-[2rem] border border-slate-200 p-6 shadow-sm group hover:border-emerald-200 transition-all">
                 <div className="flex justify-between items-center mb-4">
                    <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">{stat.label}</p>
                    <div className="w-8 h-8 rounded-lg flex items-center justify-center bg-slate-50 text-slate-400 group-hover:bg-[#e6f4ef] group-hover:text-[#00bd7f] transition-colors">
                       <stat.icon className="w-4 h-4" />
                    </div>
                 </div>
                 <div className="flex items-end justify-between">
                    <h4 className="text-3xl font-black text-slate-800 tracking-tight">{stat.value}</h4>
                    <span className={`text-[10px] font-black ${stat.delta.includes('+') ? 'text-[#00bd7f]' : 'text-rose-500'}`}>{stat.delta}</span>
                 </div>
              </div>
           ))}
        </div>

        {/* Tab Navigation */}
        <div className="bg-white p-2 rounded-[2.5rem] border border-slate-200 shadow-sm flex flex-wrap gap-2">
           {tabs.map((tab) => (
             <button
               key={tab.id}
               onClick={() => setActiveTab(tab.id)}
               className={`flex items-center gap-3 px-6 py-4 rounded-[2rem] font-black transition-all ${
                 activeTab === tab.id 
                   ? "bg-[#00bd7f] text-white shadow-lg shadow-emerald-100 scale-[1.02]" 
                   : "text-slate-400 hover:bg-slate-50 hover:text-slate-600"
               }`}
             >
               <tab.icon className={`w-5 h-5 ${activeTab === tab.id ? "text-white" : "text-slate-300"}`} />
               {tab.label}
             </button>
           ))}
        </div>

        {/* Data Container with Intelligent Filters */}
        <div className="bg-white rounded-[3rem] border border-slate-200 shadow-sm overflow-hidden">
           <div className="p-10 border-b border-slate-50 bg-slate-50/20">
              <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
                 <div className="space-y-3">
                    <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest px-1">Academic Level</label>
                    <div className="relative group">
                       <select className="w-full bg-white border border-slate-200 rounded-xl px-4 py-3 text-sm font-bold focus:border-[#00bd7f] outline-none appearance-none cursor-pointer group-hover:border-slate-300 transition-all shadow-sm">
                          <option>Hifz Section</option>
                          <option>Mishkat Section</option>
                       </select>
                       <ChevronDown className="absolute right-4 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-300 pointer-events-none group-focus-within:text-[#00bd7f]" />
                    </div>
                 </div>
                 <div className="space-y-3">
                    <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest px-1">Fee Category</label>
                    <div className="relative group">
                       <select className="w-full bg-white border border-slate-200 rounded-xl px-4 py-3 text-sm font-bold focus:border-[#00bd7f] outline-none appearance-none cursor-pointer shadow-sm">
                          <option>Admission Fees</option>
                          <option>Tuition Fees</option>
                          <option>Hostel Fees</option>
                       </select>
                       <ChevronDown className="absolute right-4 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-300 pointer-events-none" />
                    </div>
                 </div>
                 <div className="space-y-3">
                    <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest px-1">Payment Status</label>
                    <div className="relative group">
                       <select className="w-full bg-white border border-slate-200 rounded-xl px-4 py-3 text-sm font-bold focus:border-[#00bd7f] outline-none appearance-none cursor-pointer shadow-sm">
                          <option>All Transactions</option>
                          <option>Fully Paid</option>
                          <option>Partially Paid</option>
                          <option>Unpaid</option>
                       </select>
                       <ChevronDown className="absolute right-4 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-300 pointer-events-none" />
                    </div>
                 </div>
                 <div className="flex items-end">
                    <button className="w-full py-3.5 bg-slate-900 text-white rounded-xl font-black uppercase tracking-widest text-[10px] shadow-xl shadow-slate-200 hover:bg-slate-800 transition-all flex items-center justify-center gap-3">
                       <Filter className="w-4 h-4 text-[#00bd7f]" />
                       Filter Ledger
                    </button>
                 </div>
              </div>
           </div>

           <div className="overflow-x-auto overflow-y-hidden">
              <table className="w-full border-collapse">
                 <thead>
                    <tr className="border-b border-slate-50 text-[10px] font-black text-slate-400 uppercase tracking-widest">
                       <th className="px-10 py-6 text-left">Reference No</th>
                       <th className="px-10 py-6 text-left">Student Information</th>
                       <th className="px-10 py-6 text-left">Fee Descriptor</th>
                       <th className="px-10 py-6 text-center">Amount (৳)</th>
                       <th className="px-10 py-6 text-center">Settlement</th>
                       <th className="px-10 py-6 text-right">Actions</th>
                    </tr>
                 </thead>
                 <tbody className="divide-y divide-slate-50">
                    {[1, 2, 3, 4, 5].map((i) => (
                       <tr key={i} className="group hover:bg-slate-50/50 transition-all uppercase">
                          <td className="px-10 py-6">
                             <p className="text-xs font-black text-slate-400 font-mono tracking-widest">TRX-782-0{i}</p>
                          </td>
                          <td className="px-10 py-6">
                             <div className="flex items-center gap-4">
                                <div className="w-12 h-12 bg-slate-100 rounded-2xl flex items-center justify-center font-black text-slate-400 group-hover:scale-110 group-hover:bg-[#e6f4ef] group-hover:text-[#00bd7f] transition-all">OK</div>
                                <div>
                                   <p className="text-sm font-black text-slate-800 tracking-tight">Omar Kadri</p>
                                   <p className="text-[10px] font-bold text-slate-400 tracking-widest italic">Hifz / Sec B</p>
                                </div>
                             </div>
                          </td>
                          <td className="px-10 py-6">
                             <div className="space-y-1">
                                <p className="text-sm font-bold text-slate-600">Monthly Tuition Fee</p>
                                <p className="text-[10px] font-black text-slate-300 tracking-widest">JAN-2026 PERIOD</p>
                             </div>
                          </td>
                          <td className="px-10 py-6 text-center">
                             <p className="text-sm font-black text-slate-800 font-mono tracking-tighter">1,200.00</p>
                          </td>
                          <td className="px-10 py-6 text-center">
                             <span className={`px-4 py-1.5 rounded-full text-[10px] font-black tracking-widest border ${
                                i % 3 === 0 ? 'bg-amber-50 text-amber-500 border-amber-100' : 'bg-emerald-50 text-[#00bd7f] border-emerald-100'
                             }`}>
                                {i % 3 === 0 ? 'Partial Settlement' : 'Fully Settled'}
                             </span>
                          </td>
                          <td className="px-10 py-6 text-right">
                             <button className="p-2.5 bg-white border border-slate-200 rounded-xl text-slate-400 hover:text-[#00bd7f] hover:border-[#00bd7f] transition-all shadow-sm">
                                <Printer className="w-4 h-4" />
                             </button>
                          </td>
                       </tr>
                    ))}
                 </tbody>
              </table>
           </div>

           {/* Financial Health Summary */}
           <div className="p-10 border-t border-slate-100 bg-slate-50/30 flex flex-col md:flex-row justify-between items-center gap-8">
              <div className="flex gap-12">
                 <div className="flex items-center gap-3">
                    <div className="w-2.5 h-2.5 rounded-full bg-[#00bd7f]"></div>
                    <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Invoiced Value: ৳ 4.2M</span>
                 </div>
                 <div className="flex items-center gap-3">
                    <div className="w-2.5 h-2.5 rounded-full bg-blue-500"></div>
                    <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Collected Value: ৳ 3.4M</span>
                 </div>
                 <div className="flex items-center gap-3">
                    <div className="w-2.5 h-2.5 rounded-full bg-amber-500"></div>
                    <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Cash at Hand: ৳ 120K</span>
                 </div>
              </div>
              <div className="flex items-center gap-6">
                 <p className="text-xs font-black text-slate-400 italic">Financial Summary updated 2 mins ago</p>
              </div>
           </div>
        </div>
      </div>
    </div>
  );
};

export default FeesReports;
