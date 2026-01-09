import { useState } from "react";
import { 
  ShoppingBag, 
  Search, 
  Filter, 
  MoreVertical, 
  Plus, 
  Eye, 
  Download, 
  Calendar, 
  Truck,
  CheckCircle2,
  Clock,
  ChevronDown
} from "lucide-react";

const PurchaseList = () => {
  const [purchases] = useState([
    { id: 1, invoiceNo: "PUR-2026-001", supplier: "Ideal Publications", date: "2026-01-05", totalItems: 15, amount: 1540.00, status: "completed" },
    { id: 2, invoiceNo: "PUR-2026-002", supplier: "Rainbow Electronics", date: "2026-01-08", totalItems: 2, amount: 850.00, status: "pending" },
    { id: 3, invoiceNo: "PUR-2026-003", supplier: "Uniform World", date: "2026-01-09", totalItems: 45, amount: 3200.00, status: "completed" },
  ]);

  return (
    <div className="min-h-screen bg-slate-50/50 p-4 md:p-8 animate-in fade-in duration-500">
      <div className="max-w-[1600px] mx-auto space-y-8">
        
        {/* Header Section */}
        <div className="bg-white rounded-[2.5rem] border border-slate-200 p-8 shadow-sm flex flex-col lg:flex-row justify-between items-center gap-6">
          <div className="flex items-center gap-6">
            <div className="w-16 h-16 bg-indigo-50 rounded-2xl flex items-center justify-center border border-indigo-100 shadow-inner">
              <ShoppingBag className="w-8 h-8 text-indigo-600" />
            </div>
            <div>
              <h1 className="text-2xl md:text-3xl font-black text-slate-800 tracking-tight">Purchase History</h1>
              <p className="text-slate-500 font-bold mt-1">Track and manage inventory procurement and vendor invoices</p>
            </div>
          </div>

          <button className="w-full lg:w-auto px-8 py-4 bg-indigo-600 text-white rounded-2xl font-black shadow-xl shadow-indigo-100 hover:bg-indigo-700 hover:scale-[1.02] active:scale-95 transition-all flex items-center justify-center gap-3">
            <Plus className="w-5 h-5" />
            New Purchase Order
          </button>
        </div>

        {/* Filters */}
        <div className="flex flex-col md:flex-row gap-4">
          <div className="flex-1 relative">
            <Search className="absolute left-6 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400" />
            <input 
              type="text"
              placeholder="Search by invoice number or supplier..."
              className="w-full bg-white border border-slate-200 rounded-2xl pl-14 pr-6 py-4 text-sm font-bold focus:border-indigo-500 outline-none shadow-sm transition-all"
            />
          </div>
          <div className="flex gap-4">
            <div className="bg-white border border-slate-200 rounded-2xl px-6 py-4 flex items-center gap-3 font-bold text-slate-600 shadow-sm cursor-pointer hover:bg-slate-50 transition-all">
               <Calendar className="w-4 h-4 text-slate-400" />
               Date Range
               <ChevronDown className="w-4 h-4 text-slate-300" />
            </div>
            <button className="px-6 py-4 bg-white border border-slate-200 rounded-2xl flex items-center gap-3 font-bold text-slate-600 hover:bg-slate-50 transition-all shadow-sm">
              <Filter className="w-4 h-4" />
              Filter
            </button>
          </div>
        </div>

        {/* Purchase Table */}
        <div className="bg-white rounded-[2.5rem] border border-slate-200 shadow-sm overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full border-collapse">
              <thead>
                <tr className="border-b border-slate-50 bg-slate-50/50">
                  <th className="px-8 py-6 text-left text-[10px] font-black text-slate-400 uppercase tracking-widest">Purchase Info</th>
                  <th className="px-8 py-6 text-left text-[10px] font-black text-slate-400 uppercase tracking-widest">Supplier</th>
                  <th className="px-8 py-6 text-center text-[10px] font-black text-slate-400 uppercase tracking-widest">Items</th>
                  <th className="px-8 py-6 text-center text-[10px] font-black text-slate-400 uppercase tracking-widest">Total Amount</th>
                  <th className="px-8 py-6 text-center text-[10px] font-black text-slate-400 uppercase tracking-widest">Status</th>
                  <th className="px-8 py-6 text-right text-[10px] font-black text-slate-400 uppercase tracking-widest">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-50">
                {purchases.map((pur) => (
                  <tr key={pur.id} className="group hover:bg-slate-50/50 transition-all duration-300">
                    <td className="px-8 py-6">
                      <div className="flex items-center gap-4">
                        <div className="w-12 h-12 bg-indigo-50 rounded-2xl flex items-center justify-center border border-indigo-100 group-hover:scale-110 transition-transform">
                          <ShoppingBag className="w-6 h-6 text-indigo-400" />
                        </div>
                        <div>
                          <p className="text-sm font-black text-slate-800 group-hover:text-indigo-600 transition-colors uppercase tracking-tight">{pur.invoiceNo}</p>
                          <p className="text-[11px] font-bold text-slate-400 flex items-center gap-1">
                             <Calendar className="w-3 h-3" /> {new Date(pur.date).toLocaleDateString()}
                          </p>
                        </div>
                      </div>
                    </td>
                    <td className="px-8 py-6">
                      <div className="flex items-center gap-3">
                         <div className="w-8 h-8 bg-slate-50 rounded-full flex items-center justify-center border border-slate-100">
                            <Truck className="w-4 h-4 text-slate-300" />
                         </div>
                         <span className="text-sm font-bold text-slate-600">{pur.supplier}</span>
                      </div>
                    </td>
                    <td className="px-8 py-6 text-center">
                       <span className="px-4 py-1.5 bg-slate-100 text-slate-600 rounded-lg text-xs font-black">
                         {pur.totalItems} Units
                       </span>
                    </td>
                    <td className="px-8 py-6 text-center">
                       <p className="text-sm font-black text-slate-800">${pur.amount.toFixed(2)}</p>
                       <p className="text-[10px] font-bold text-slate-400 uppercase tracking-tighter">Gross Total</p>
                    </td>
                    <td className="px-8 py-6 text-center">
                       <div className={`inline-flex items-center gap-2 px-4 py-1.5 rounded-full text-[10px] font-black uppercase tracking-widest border ${
                         pur.status === 'completed' ? 'bg-emerald-50 text-emerald-600 border-emerald-100' : 'bg-amber-50 text-amber-600 border-amber-100'
                       }`}>
                         {pur.status === 'completed' ? <CheckCircle2 className="w-3 h-3" /> : <Clock className="w-3 h-3" />}
                         {pur.status}
                       </div>
                    </td>
                    <td className="px-8 py-6 text-right">
                      <div className="flex items-center justify-end gap-3 opacity-0 group-hover:opacity-100 transition-all">
                        <button className="p-2.5 bg-white border border-slate-200 rounded-xl text-slate-400 hover:text-indigo-600 hover:border-indigo-200 shadow-sm transition-all">
                          <Eye className="w-4 h-4" />
                        </button>
                        <button className="p-2.5 bg-white border border-slate-200 rounded-xl text-slate-400 hover:text-indigo-600 hover:border-indigo-200 shadow-sm transition-all">
                          <Download className="w-4 h-4" />
                        </button>
                        <button className="p-2.5 bg-rose-50 border border-rose-100 rounded-xl text-rose-400 hover:text-rose-600 hover:bg-rose-100 shadow-sm transition-all">
                          <MoreVertical className="w-4 h-4" />
                        </button>
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

export default PurchaseList;
