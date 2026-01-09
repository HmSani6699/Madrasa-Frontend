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
  ExternalLink
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
    <div className="min-h-screen bg-slate-50/50 p-4 md:p-8 animate-in fade-in duration-500">
      <div className="max-w-[1600px] mx-auto space-y-6 md:space-y-10">
        
        {/* Header */}
        <div className="bg-white rounded-[1.5rem] md:rounded-[3rem] p-6 md:p-10 border border-slate-200 shadow-sm flex flex-col lg:flex-row justify-between items-center gap-6">
          <div className="flex items-center gap-4 md:gap-8">
            <div className="w-12 h-12 md:w-20 md:h-20 bg-slate-900 rounded-xl md:rounded-3xl flex items-center justify-center border border-slate-800 shadow-inner shrink-0 text-white">
              <History className="w-6 h-6 md:w-10 md:h-10" />
            </div>
            <div>
              <h1 className="text-xl md:text-3xl font-black text-slate-800 tracking-tight uppercase leading-none mb-1 md:mb-3">Transaction Archive</h1>
              <p className="text-slate-500 font-bold mt-1 text-xs md:text-base">Comprehensive history of all institutional payments and digital receipts</p>
            </div>
          </div>

          <div className="flex gap-4 w-full lg:w-auto">
             <button className="flex-1 lg:flex-none px-8 py-4 bg-slate-100 text-slate-600 rounded-2xl font-black hover:bg-slate-200 transition-all border border-slate-200 text-[10px] uppercase tracking-widest flex items-center justify-center gap-3">
               <FileText className="w-4 h-4" /> Export Statement
            </button>
          </div>
        </div>

        {/* Filters */}
        <div className="flex flex-col md:flex-row gap-4">
           <div className="relative flex-1">
              <Search className="absolute left-6 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-300" />
              <input className="w-full bg-white border border-slate-200 rounded-[1.5rem] md:rounded-2xl pl-16 pr-8 py-4 text-sm font-bold shadow-sm focus:border-slate-900 outline-none transition-all" placeholder="Search by Transaction ID or Category..." />
           </div>
           <div className="flex gap-4">
              <button className="px-6 py-4 bg-white border border-slate-200 rounded-2xl font-black text-[10px] uppercase tracking-widest shadow-sm hover:border-slate-900 transition-colors flex items-center gap-3">
                 <Filter className="w-4 h-4" /> Filter Date
              </button>
           </div>
        </div>

        {/* History Table */}
        <div className="bg-white rounded-[1.5rem] md:rounded-[3.5rem] border border-slate-200 shadow-sm overflow-hidden animate-in slide-in-from-bottom duration-700">
           <div className="overflow-x-auto">
              <table className="w-full border-collapse min-w-[900px]">
                 <thead>
                    <tr className="border-b border-slate-50 text-[10px] font-black text-slate-400 uppercase tracking-widest bg-slate-50/10">
                       <th className="px-10 py-6 text-left">Reference ID</th>
                       <th className="px-10 py-6 text-left">Payment Date</th>
                       <th className="px-10 py-6 text-left">Account / Method</th>
                       <th className="px-10 py-6 text-center">Category</th>
                       <th className="px-10 py-6 text-center">Amount</th>
                       <th className="px-10 py-6 text-right">Receipt</th>
                    </tr>
                 </thead>
                 <tbody className="divide-y divide-slate-50">
                    {transactions.map((txn) => (
                       <tr key={txn.id} className="group hover:bg-slate-50/40 transition-all">
                          <td className="px-10 py-8">
                             <div className="flex items-center gap-4">
                                <div className="w-10 h-10 bg-slate-100 rounded-xl flex items-center justify-center text-slate-400 group-hover:text-indigo-600 transition-colors">
                                   <Clock className="w-5 h-5" />
                                </div>
                                <div>
                                   <p className="text-sm font-black text-slate-800 uppercase tracking-tight">{txn.id}</p>
                                   <div className="flex items-center gap-1.5 text-[9px] font-black text-emerald-500 uppercase tracking-widest mt-1">
                                      <CheckCircle2 className="w-3 h-3" /> {txn.status}
                                   </div>
                                </div>
                             </div>
                          </td>
                          <td className="px-10 py-8 text-xs font-bold text-slate-500">{txn.date}</td>
                          <td className="px-10 py-8 text-xs font-black text-slate-800 uppercase tracking-tight">{txn.method}</td>
                          <td className="px-10 py-8 text-center">
                             <span className="px-3 py-1 bg-slate-50 text-[9px] font-black text-slate-400 uppercase tracking-[2px] border border-slate-100 rounded-lg">{txn.category}</span>
                          </td>
                          <td className="px-10 py-8 text-center text-lg font-black text-slate-800">{txn.amount}</td>
                          <td className="px-10 py-8 text-right">
                             <button className="inline-flex items-center gap-2 px-6 py-3 bg-white border border-slate-100 text-slate-400 rounded-xl font-black text-[9px] uppercase tracking-widest hover:bg-slate-900 hover:text-white hover:border-slate-900 transition-all shadow-sm active:scale-95 group/btn">
                                Download <ExternalLink className="w-3.5 h-3.5 group-hover/btn:translate-x-1 transition-transform" />
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

export default PaymentHistory;
