import { useState } from "react";
import { 
  CreditCard, 
  ArrowRight, 
  Download, 
  CheckCircle2, 
  AlertCircle,
  Receipt,
  History,
  Info
} from "lucide-react";

const FeesAndDues = () => {
  const [isPaying, setIsPaying] = useState(false);
  const [activeTab, setActiveTab] = useState("pending");

  const fees = [
    { id: 1, title: "Monthly Tuition Fee - January", dueDate: "Jan 10, 2026", amount: "৳ 2,000", status: "pending", type: "Academic" },
    { id: 2, title: "Institutional Transport Fee", dueDate: "Jan 10, 2026", amount: "৳ 500", status: "pending", type: "Utility" },
    { id: 3, title: "Admission Balance Remainder", dueDate: "Dec 30, 2025", amount: "৳ 1,500", status: "overdue", type: "Admin" },
  ];

  return (
    <div className="min-h-screen bg-slate-50/50 p-4 md:p-8 animate-in fade-in duration-500">
      <div className="max-w-[1600px] mx-auto space-y-6 md:space-y-10">
        
        {/* Header */}
        <div className="bg-white rounded-[1.5rem] md:rounded-[3rem] p-6 md:p-10 border border-slate-200 shadow-sm flex flex-col lg:flex-row justify-between items-center gap-6">
          <div className="flex items-center gap-4 md:gap-8">
            <div className="w-12 h-12 md:w-20 md:h-20 bg-rose-50 rounded-xl md:rounded-3xl flex items-center justify-center border border-rose-100 shadow-inner shrink-0 text-rose-600">
              <CreditCard className="w-6 h-6 md:w-10 md:h-10" />
            </div>
            <div>
              <h1 className="text-xl md:text-3xl font-black text-slate-800 tracking-tight uppercase leading-none mb-1 md:mb-3">Financial Center</h1>
              <p className="text-slate-500 font-bold mt-1 text-xs md:text-base">Secure management of institutional dues and payment records</p>
            </div>
          </div>

          <div className="flex gap-4 w-full lg:w-auto">
             <div className="flex bg-slate-100 p-1.5 rounded-2xl md:rounded-[2rem] w-full lg:w-auto">
                <button 
                  onClick={() => setActiveTab("pending")}
                  className={`flex-1 px-6 md:px-8 py-3 rounded-xl md:rounded-3xl font-black text-[10px] uppercase tracking-widest transition-all ${activeTab === "pending" ? "bg-white text-slate-900 shadow-lg" : "text-slate-400 hover:text-slate-600"}`}
                >
                  Pending Dues
                </button>
                <button 
                  onClick={() => setActiveTab("history")}
                  className={`flex-1 px-6 md:px-8 py-3 rounded-xl md:rounded-3xl font-black text-[10px] uppercase tracking-widest transition-all ${activeTab === "history" ? "bg-white text-slate-900 shadow-lg" : "text-slate-400 hover:text-slate-600"}`}
                >
                  Paid History
                </button>
             </div>
          </div>
        </div>

        {/* Financial Summary */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
           <div className="bg-slate-900 p-8 rounded-[2.5rem] text-white flex justify-between items-center relative overflow-hidden group shadow-2xl shadow-slate-200">
              <Receipt className="absolute -right-4 -bottom-4 w-32 h-32 text-white/5 -rotate-12" />
              <div>
                 <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-2">Total Outstanding</p>
                 <h2 className="text-3xl md:text-4xl font-black tracking-tight uppercase">৳ 4,000</h2>
              </div>
              <button 
                className="bg-white text-slate-900 px-6 py-3 rounded-2xl font-black text-[10px] uppercase tracking-widest hover:bg-slate-50 transition-all shadow-xl active:scale-95 leading-none relative z-10"
              >
                 Bulk Payment
              </button>
           </div>
           
           <div className="bg-white p-8 rounded-[2.5rem] border border-slate-200 shadow-sm flex items-center gap-6 group hover:border-emerald-200 transition-all">
              <div className="w-14 h-14 bg-emerald-50 rounded-2xl flex items-center justify-center text-emerald-600 shadow-inner group-hover:scale-110 transition-transform">
                 <CheckCircle2 className="w-7 h-7" />
              </div>
              <div>
                 <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-1">Paid Last Month</p>
                 <h4 className="text-xl font-black text-slate-800 tracking-tight">৳ 2,500</h4>
              </div>
           </div>

           <div className="bg-white p-8 rounded-[2.5rem] border border-slate-200 shadow-sm flex items-center gap-6 group hover:border-rose-200 transition-all">
              <div className="w-14 h-14 bg-rose-50 rounded-2xl flex items-center justify-center text-rose-600 shadow-inner group-hover:scale-110 transition-transform">
                 <History className="w-7 h-7" />
              </div>
              <div>
                 <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-1">Upcoming Dues</p>
                 <h4 className="text-xl font-black text-slate-800 tracking-tight">Feb 01, 2026</h4>
              </div>
           </div>
        </div>

        {/* Invoice List */}
        <div className="bg-white rounded-[1.5rem] md:rounded-[3rem] border border-slate-200 shadow-sm overflow-hidden animate-in slide-in-from-bottom duration-700">
           <div className="p-8 md:p-10 border-b border-slate-50 flex items-center justify-between">
              <h2 className="text-xl font-black text-slate-800 tracking-tight uppercase">Detailed Bill Breakdown</h2>
              <div className="flex items-center gap-2 text-[10px] font-black text-slate-400 uppercase tracking-widest">
                 <Info className="w-4 h-4" /> 2.5% charge for digital payments apply
              </div>
           </div>

           <div className="overflow-x-auto">
              <table className="w-full border-collapse">
                 <thead>
                    <tr className="border-b border-slate-50 text-[10px] font-black text-slate-400 uppercase tracking-widest">
                       <th className="px-10 py-6 text-left">Category / Description</th>
                       <th className="px-10 py-6 text-center">Due Date</th>
                       <th className="px-10 py-6 text-center">Amount (BDT)</th>
                       <th className="px-10 py-6 text-center">Status</th>
                       <th className="px-10 py-6 text-right">Action</th>
                    </tr>
                 </thead>
                 <tbody className="divide-y divide-slate-50">
                    {fees.map((fee) => (
                       <tr key={fee.id} className="group hover:bg-slate-50/50 transition-all">
                          <td className="px-10 py-8">
                             <div>
                                <p className="text-sm font-black text-slate-800 uppercase tracking-tight mb-1">{fee.title}</p>
                                <span className="px-3 py-1 bg-slate-50 text-[9px] font-black text-slate-400 uppercase tracking-[2px] border border-slate-100 rounded-lg">{fee.type}</span>
                             </div>
                          </td>
                          <td className="px-10 py-8 text-center text-xs font-bold text-slate-500">{fee.dueDate}</td>
                          <td className="px-10 py-8 text-center text-lg font-black text-slate-800">{fee.amount}</td>
                          <td className="px-10 py-8 text-center">
                             <div className={`inline-flex items-center gap-2 px-4 py-1.5 rounded-full text-[10px] font-black uppercase tracking-widest shadow-sm ${
                                fee.status === 'overdue' ? 'bg-rose-50 text-rose-600 border border-rose-100' : 'bg-amber-50 text-amber-600 border border-amber-100'
                             }`}>
                                {fee.status === 'overdue' ? <AlertCircle className="w-4 h-4" /> : <Info className="w-4 h-4" />}
                                {fee.status}
                             </div>
                          </td>
                          <td className="px-10 py-8 text-right">
                             <button 
                                onClick={() => setIsPaying(true)}
                                className="inline-flex items-center justify-center gap-3 px-8 py-3 bg-slate-900 text-white rounded-2xl font-black text-[10px] uppercase tracking-widest hover:bg-slate-800 transition-all active:scale-95 shadow-lg shadow-slate-200"
                             >
                                Checkout <ArrowRight className="w-4 h-4" />
                             </button>
                          </td>
                       </tr>
                    ))}
                 </tbody>
              </table>
           </div>
        </div>

      </div>

      {/* Payment Success Toast (Simulated) */}
      {isPaying && (
         <div className="fixed inset-0 z-[200] flex items-center justify-center p-4">
            <div className="absolute inset-0 bg-slate-900/60 backdrop-blur-md" onClick={() => setIsPaying(false)}></div>
            <div className="bg-white w-full max-w-sm rounded-[3rem] p-12 text-center relative z-10 animate-in zoom-in-95 duration-300">
               <div className="w-20 h-20 bg-emerald-50 rounded-[2.5rem] flex items-center justify-center mx-auto mb-8 text-emerald-600 shadow-inner">
                  <CheckCircle2 className="w-10 h-10" />
               </div>
               <h3 className="text-2xl font-black text-slate-800 uppercase tracking-tight mb-4 leading-none">Redirecting...</h3>
               <p className="text-sm font-bold text-slate-500 mb-10 leading-relaxed">We are connecting you to the secure SSLCommerz payment gateway.</p>
               <button 
                 onClick={() => setIsPaying(false)}
                 className="w-full py-5 bg-slate-900 text-white rounded-3xl font-black text-[11px] uppercase tracking-widest shadow-xl shadow-slate-200 hover:bg-slate-800 transition-all"
               >
                  Cancel Transaction
               </button>
            </div>
         </div>
      )}
    </div>
  );
};

export default FeesAndDues;
