import { useState } from "react";
import { 
  History, 
  Download, 
  Search, 
  Filter, 
  ChevronRight,
  CheckCircle2,
  FileText,
  Clock,
  ExternalLink,
  ShieldCheck,
  CreditCard,
  Receipt
} from "lucide-react";

const PaymentHistory = () => {
  const transactions = [
    { id: "TXN-8201", date: "Jan 02, 2026", method: "NexusPay Card", amount: "৳ 2,500", status: "Successful", category: "Tuition" },
    { id: "TXN-7942", date: "Dec 05, 2025", method: "bKash Transfer", amount: "৳ 2,500", status: "Successful", category: "Tuition" },
    { id: "TXN-7611", date: "Nov 02, 2025", method: "Bank Deposit", amount: "৳ 3,000", status: "Successful", category: "Admission" },
    { id: "TXN-7208", date: "Oct 10, 2025", method: "Nagad Wallet", amount: "৳ 500", status: "Successful", category: "Transport" },
    { id: "TXN-6990", date: "Sep 05, 2025", method: "SSLCommerz Card", amount: "৳ 2,500", status: "Successful", category: "Tuition" },
  ];

  return (
    <div className="space-y-8 pb-12 animate-in fade-in duration-700">
      {/* Header Section */}
      <div className="bg-white rounded-[20px] p-6  border-2 border-slate-50 shadow-sm flex flex-col lg:flex-row justify-between items-center gap-8 relative overflow-hidden">
        <div className="absolute -right-10 -top-10 w-40 h-40 bg-emerald-50 rounded-full blur-3xl opacity-50"></div>
        <div className="flex items-center gap-6 relative z-10">
          <div className="w-16 h-16 md:w-20 md:h-20 bg-slate-900 rounded-2xl md:rounded-3xl flex items-center justify-center border-2 border-slate-800 shadow-xl text-white">
            <History className="w-8 h-8 md:w-10 md:h-10" />
          </div>
          <div>
            <h1 className="text-2xl md:text-4xl font-black text-slate-800 tracking-tight leading-none mb-2 md:mb-3">Payment History</h1>
          
          </div>
        </div>

        <div className="flex gap-4 relative z-10 w-full lg:w-auto">
           <button className="flex-1 lg:flex-none px-8 py-5 bg-slate-900 text-white rounded-[2rem] font-black text-[10px] uppercase tracking-widest hover:bg-slate-800 transition-all shadow-xl active:scale-95 flex items-center justify-center gap-3">
             <FileText className="w-4 h-4" /> Export Statement
          </button>
        </div>
      </div>

      {/* Filters & Control Matrix */}
      <div className="flex flex-col md:flex-row gap-6">
         <div className="relative flex-1 group">
            <Search className="absolute left-8 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-300 group-focus-within:text-slate-900 transition-colors" />
            <input 
              className="w-full bg-white border-2 border-slate-50 rounded-[2.5rem] pl-16 pr-8 py-5 text-sm font-bold shadow-sm focus:border-slate-900 outline-none transition-all placeholder:text-slate-300" 
              placeholder="Search by Transaction ID or Category..." 
            />
         </div>
         <div className="flex gap-4">
            <button className="px-10 py-5 bg-white border-2 border-slate-50 rounded-[2rem] font-black text-[10px] uppercase tracking-widest shadow-sm hover:border-slate-900 transition-colors flex items-center gap-3">
               <Filter className="w-4 h-4" /> Advanced Filter
            </button>
         </div>
      </div>

      {/* History Infrastructure */}
      <div className="bg-white rounded-[20px] border-2 border-slate-50 shadow-xl overflow-hidden relative">
         <div className="overflow-x-auto overflow-y-hidden">
            <table className="w-full border-collapse min-w-[1000px]">
               <thead>
                  <tr className="border-b-2 border-slate-50 text-[10px] font-black text-slate-400 whitespace-nowrap tracking-widest bg-slate-50/20">
                     <th className="px-12 py-3 text-left">Reference Vector</th>
                     <th className="px-10 py-3 text-left">Timestamp</th>
                     <th className="px-10 py-3 text-left">Account Method</th>
                     <th className="px-10 py-3 text-center">Designation</th>
                     <th className="px-10 py-3 text-center">Quantifiable Amount</th>
                     <th className="px-10 py-3 text-right">Verification</th>
                  </tr>
               </thead>
               <tbody className="divide-y-2 divide-slate-50">
                  {transactions.map((txn) => (
                     <tr key={txn.id} className="group hover:bg-slate-50/50 transition-all cursor-default whitespace-nowrap">
                        <td className="px-12 py-3">
                           <div className="flex items-center gap-5">
                              <div className="w-12 h-12 bg-slate-50 rounded-2xl flex items-center justify-center text-slate-300 group-hover:bg-indigo-600 group-hover:text-white transition-all shadow-inner">
                                 <Clock className="w-6 h-6" />
                              </div>
                              <div>
                                 <p className="text-sm font-black text-slate-800 uppercase tracking-tight mb-1">{txn.id}</p>
                                 <div className="flex items-center gap-1.5 text-[9px] font-black text-emerald-500 uppercase tracking-widest">
                                    <div className="w-1 h-1 bg-emerald-500 rounded-full"></div> {txn.status}
                                 </div>
                              </div>
                           </div>
                        </td>
                        <td className="px-10 py-4">
                           <p className="text-[11px] font-black text-slate-500 uppercase tracking-widest">{txn.date}</p>
                        </td>
                        <td className="px-10 py-4">
                           <div className="flex items-center gap-3">
                              <CreditCard className="w-4 h-4 text-slate-300" />
                              <p className="text-xs font-black text-slate-800 uppercase tracking-tight">{txn.method}</p>
                           </div>
                        </td>
                        <td className="px-10 py-4 text-center">
                           <span className="px-4 py-1.5 bg-slate-50 text-[10px] font-black text-slate-400 uppercase tracking-widest border border-slate-100 rounded-xl group-hover:bg-white group-hover:text-slate-800 transition-colors">{txn.category}</span>
                        </td>
                        <td className="px-10 py-4 text-center">
                           <p className="text-xl font-black text-slate-900 tracking-tighter">{txn.amount}</p>
                        </td>
                        <td className="px-10 py-4 text-right">
                           <button className="inline-flex items-center gap-2 px-6 py-4 bg-white border border-slate-100 text-slate-400 rounded-2xl font-black text-[10px] uppercase tracking-widest hover:bg-slate-900 hover:text-white hover:border-slate-900 transition-all shadow-sm active:scale-95 group/btn">
                              Access Receipt <Receipt className="w-4 h-4 group-hover/btn:rotate-12 transition-transform" />
                           </button>
                        </td>
                     </tr>
                  ))}
               </tbody>
            </table>
         </div>
      </div>

    

    </div>
  );
};

export default PaymentHistory;
