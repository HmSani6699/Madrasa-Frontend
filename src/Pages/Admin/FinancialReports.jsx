import { useState, useEffect } from "react";
import { useLocation } from "react-router-dom";
import { 
  BarChart, 
  TrendingUp, 
  TrendingDown, 
  Search, 
  Filter, 
  Download, 
  FileText, 
  PieChart, 
  RefreshCcw,
  ArrowUpRight,
  ArrowDownLeft,
  Calendar,
  Wallet,
  Activity,
  Printer
} from "lucide-react";

const FinancialReports = () => {
  const location = useLocation();
  const [activeTab, setActiveTab] = useState("statement");

  useEffect(() => {
    const path = location.pathname;
    if (path.includes("income")) setActiveTab("income");
    else if (path.includes("expense")) setActiveTab("expense");
    else if (path.includes("transactions")) setActiveTab("transactions");
    else if (path.includes("balance")) setActiveTab("balance");
    else if (path.includes("income-vs-expense")) setActiveTab("comparison");
    else setActiveTab("statement");
  }, [location.pathname]);

  const tabs = [
    { id: "statement", label: "Account Statement", icon: FileText },
    { id: "income", label: "Income Report", icon: TrendingUp },
    { id: "expense", label: "Expense Report", icon: TrendingDown },
    { id: "balance", label: "Balance Sheet", icon: Wallet },
    { id: "comparison", label: "Income Vs Expense", icon: Activity },
  ];

  return (
    <div className="min-h-screen bg-slate-50/50 p-4 md:p-8 animate-in fade-in duration-500">
      <div className="max-w-[1600px] mx-auto space-y-8">
        
        {/* Header Section */}
        <div className="bg-white rounded-[2.5rem] border border-slate-200 p-8 shadow-sm flex flex-col lg:flex-row justify-between items-center gap-6">
          <div className="flex items-center gap-6">
            <div className="w-16 h-16 bg-blue-50 rounded-2xl flex items-center justify-center border border-blue-100 shadow-inner">
              <PieChart className="w-8 h-8 text-blue-600" />
            </div>
            <div>
              <h1 className="text-2xl md:text-3xl font-black text-slate-800 tracking-tight text-uppercase">Financial Intelligence</h1>
              <p className="text-slate-500 font-bold mt-1">Institutional cash flow, balance sheets, and comparative financial analysis</p>
            </div>
          </div>

          <div className="flex gap-4 w-full lg:w-auto">
            <button className="flex-1 lg:flex-none px-8 py-4 bg-slate-100 text-slate-600 rounded-2xl font-black hover:bg-slate-200 transition-all flex items-center justify-center gap-3 border border-slate-200 uppercase tracking-widest text-[11px]">
               <RefreshCcw className="w-5 h-5" />
               Reconcile
            </button>
            <button className="flex-[2] lg:flex-none px-8 py-4 bg-blue-600 text-white rounded-2xl font-black shadow-xl shadow-blue-100 hover:bg-blue-700 hover:scale-[1.02] active:scale-95 transition-all flex items-center justify-center gap-3 uppercase tracking-widest text-[11px]">
              <Download className="w-5 h-5" />
              Generate Ledger
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
                   ? "bg-blue-600 text-white shadow-lg shadow-blue-100 scale-[1.02]" 
                   : "text-slate-400 hover:bg-slate-50 hover:text-slate-600"
               }`}
             >
               <tab.icon className={`w-5 h-5 ${activeTab === tab.id ? "text-white" : "text-slate-300"}`} />
               {tab.label}
             </button>
           ))}
        </div>

        {/* Quick Summary Cards (Glassmorphism Concept) */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
           <div className="bg-gradient-to-br from-emerald-500 to-emerald-600 rounded-[3rem] p-10 text-white shadow-xl shadow-emerald-100 relative overflow-hidden group">
              <div className="absolute top-0 right-0 w-32 h-32 bg-white/10 rounded-bl-[5rem] -mr-8 -mt-8 group-hover:scale-110 transition-transform duration-700"></div>
              <p className="text-[10px] font-black uppercase tracking-[2px] text-emerald-100 mb-6">Total Net Income</p>
              <h3 className="text-4xl font-black tracking-tight mb-4">$45,200.00</h3>
              <div className="flex items-center gap-2 text-emerald-100 text-xs font-bold bg-white/10 w-fit px-4 py-1.5 rounded-full">
                 <ArrowUpRight className="w-4 h-4" /> 12% Growth
              </div>
           </div>
           <div className="bg-gradient-to-br from-rose-500 to-rose-600 rounded-[3rem] p-10 text-white shadow-xl shadow-rose-100 relative overflow-hidden group">
              <div className="absolute top-0 right-0 w-32 h-32 bg-white/10 rounded-bl-[5rem] -mr-8 -mt-8 group-hover:scale-110 transition-transform duration-700"></div>
              <p className="text-[10px] font-black uppercase tracking-[2px] text-rose-100 mb-6">Total Expenditure</p>
              <h3 className="text-4xl font-black tracking-tight mb-4">$12,850.50</h3>
              <div className="flex items-center gap-2 text-rose-100 text-xs font-bold bg-white/10 w-fit px-4 py-1.5 rounded-full">
                 <ArrowDownLeft className="w-4 h-4" /> Low Variance
              </div>
           </div>
           <div className="bg-white rounded-[3rem] border border-slate-200 p-10 shadow-sm flex flex-col justify-between group hover:border-blue-200 transition-all">
              <div>
                 <p className="text-[10px] font-black text-slate-400 uppercase tracking-[2px] mb-6">Current Liquidity</p>
                 <h3 className="text-4xl font-black text-slate-800 tracking-tight">$32,349.50</h3>
              </div>
              <div className="mt-8 flex gap-2">
                 <div className="h-2 flex-1 bg-blue-100 rounded-full overflow-hidden">
                    <div className="h-full bg-blue-600 w-[78%]"></div>
                 </div>
                 <span className="text-[10px] font-black text-blue-600">78%</span>
              </div>
           </div>
        </div>

        {/* Detailed Report Table */}
        <div className="bg-white rounded-[3rem] border border-slate-200 shadow-sm overflow-hidden">
           <div className="p-10 border-b border-slate-100 flex flex-col md:flex-row justify-between items-center gap-6">
              <div className="flex items-center gap-4">
                 <div className="w-12 h-12 bg-slate-50 rounded-2xl flex items-center justify-center border border-slate-100 group">
                    <Activity className="w-6 h-6 text-slate-400 group-hover:text-blue-600 transition-colors" />
                 </div>
                 <div>
                    <h2 className="text-2xl font-black text-slate-800 tracking-tight uppercase tracking-widest">{tabs.find(t => t.id === activeTab)?.label}</h2>
                    <p className="text-xs font-bold text-slate-400 uppercase tracking-widest mt-1">Period: Jan 01 - Jan 31, 2026</p>
                 </div>
              </div>
              
              <div className="flex gap-4">
                 <div className="relative">
                    <Calendar className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                    <input className="bg-slate-50 border border-slate-100 rounded-xl pl-10 pr-6 py-3 text-sm font-bold focus:border-blue-500 outline-none w-48 transition-all" value="January 2026" readOnly />
                 </div>
                 <button className="p-3.5 bg-slate-50 hover:bg-slate-100 rounded-xl text-slate-400 transition-all border border-slate-100">
                    <Printer className="w-5 h-5" />
                 </button>
              </div>
           </div>

           <div className="overflow-x-auto">
              <table className="w-full border-collapse">
                 <thead>
                    <tr className="border-b border-slate-50 text-[10px] font-black text-slate-400 uppercase tracking-widest">
                       <th className="px-10 py-6 text-left">Internal ID</th>
                       <th className="px-10 py-6 text-left">Category & Head</th>
                       <th className="px-10 py-6 text-left">Reference Details</th>
                       <th className="px-10 py-6 text-center">Date</th>
                       <th className="px-10 py-6 text-right">Credit (+)</th>
                       <th className="px-10 py-6 text-right">Debit (-)</th>
                       <th className="px-10 py-6 text-right">Balance</th>
                    </tr>
                 </thead>
                 <tbody className="divide-y divide-slate-50">
                    {[1, 2, 3, 4, 5].map((i) => (
                      <tr key={i} className="group hover:bg-slate-50/30 transition-all">
                         <td className="px-10 py-6">
                            <span className="text-xs font-black text-slate-400 font-mono italic">#TXN-90{i}82</span>
                         </td>
                         <td className="px-10 py-6">
                            <p className="text-sm font-black text-slate-700 uppercase tracking-tight">Tuition Collection</p>
                            <p className="text-[10px] font-bold text-slate-400 uppercase">Revenue Head A-1</p>
                         </td>
                         <td className="px-10 py-6">
                            <p className="text-sm font-bold text-slate-500">Fees payment from Grade 10-A</p>
                         </td>
                         <td className="px-10 py-6 text-center">
                            <div className="inline-flex items-center gap-2 text-xs font-bold text-slate-400">
                               <Calendar className="w-3.5 h-3.5" /> Jan {i + 5}, 2026
                            </div>
                         </td>
                         <td className="px-10 py-6 text-right font-black text-emerald-600 text-sm">$450.00</td>
                         <td className="px-10 py-6 text-right font-black text-rose-400 text-sm">-</td>
                         <td className="px-10 py-6 text-right font-black text-slate-800 text-sm">$32,349.50</td>
                      </tr>
                    ))}
                 </tbody>
              </table>
           </div>

           <div className="p-10 bg-slate-50/50 flex flex-col md:flex-row items-center justify-between border-t border-slate-100">
              <div className="flex items-center gap-6">
                 <div className="flex flex-col">
                    <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Page Total Income</span>
                    <span className="text-xl font-black text-emerald-600">$2,250.00</span>
                 </div>
                 <div className="w-px h-8 bg-slate-200"></div>
                 <div className="flex flex-col">
                    <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Page Total Expense</span>
                    <span className="text-xl font-black text-rose-500">$0.00</span>
                 </div>
              </div>
              
              <div className="flex gap-2 mt-6 md:mt-0">
                 <button className="px-6 py-3 bg-white border border-slate-200 rounded-xl text-[10px] font-black uppercase tracking-widest text-slate-400 hover:text-blue-600 transition-all">Previous</button>
                 <button className="px-6 py-3 bg-blue-600 text-white rounded-xl text-[10px] font-black uppercase tracking-widest shadow-lg shadow-blue-100">Next Page</button>
              </div>
           </div>
        </div>

      </div>
    </div>
  );
};

export default FinancialReports;
