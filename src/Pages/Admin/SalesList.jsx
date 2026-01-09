import { useState } from "react";
import { 
  CreditCard, 
  Search, 
  Filter, 
  MoreVertical, 
  Plus, 
  Eye, 
  Download, 
  Calendar, 
  User,
  CheckCircle2,
  AlertTriangle,
  ChevronDown,
  Receipt
} from "lucide-react";

const SalesList = () => {
  const [sales] = useState([
    { id: 1, invoiceNo: "SAL-2026-001", customer: "Abdullah Al Mamun", customerType: "Student", date: "2026-01-07", amount: 120.00, status: "paid" },
    { id: 2, invoiceNo: "SAL-2026-002", customer: "Parent of Fatima", customerType: "Parent", date: "2026-01-08", amount: 45.00, status: "partial" },
    { id: 3, invoiceNo: "SAL-2026-003", customer: "Zubair Ahmed", customerType: "Student", date: "2026-01-09", amount: 200.00, status: "paid" },
  ]);

  return (
    <div className="min-h-screen bg-slate-50/50 p-4 md:p-8 animate-in fade-in duration-500">
      <div className="max-w-[1600px] mx-auto space-y-8">
        
        {/* Header Section */}
        <div className="bg-white rounded-[2.5rem] border border-slate-200 p-8 shadow-sm flex flex-col lg:flex-row justify-between items-center gap-6">
          <div className="flex items-center gap-6">
            <div className="w-16 h-16 bg-emerald-50 rounded-2xl flex items-center justify-center border border-emerald-100 shadow-inner">
              <Receipt className="w-8 h-8 text-emerald-600" />
            </div>
            <div>
              <h1 className="text-2xl md:text-3xl font-black text-slate-800 tracking-tight">Sales & Billing</h1>
              <p className="text-slate-500 font-bold mt-1">Manage merchandise sales, uniforms, and book distributions</p>
            </div>
          </div>

          <button className="w-full lg:w-auto px-8 py-4 bg-emerald-600 text-white rounded-2xl font-black shadow-xl shadow-emerald-100 hover:bg-emerald-700 hover:scale-[1.02] active:scale-95 transition-all flex items-center justify-center gap-3">
            <Plus className="w-5 h-5" />
            New Sales Invoice
          </button>
        </div>

        {/* Filters */}
        <div className="flex flex-col md:flex-row gap-4">
          <div className="flex-1 relative">
            <Search className="absolute left-6 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400" />
            <input 
              type="text"
              placeholder="Search by invoice or customer name..."
              className="w-full bg-white border border-slate-200 rounded-2xl pl-14 pr-6 py-4 text-sm font-bold focus:border-emerald-500 outline-none shadow-sm transition-all"
            />
          </div>
          <div className="flex gap-4">
            <div className="bg-white border border-slate-200 rounded-2xl px-6 py-4 flex items-center gap-3 font-bold text-slate-600 shadow-sm cursor-pointer hover:bg-slate-50 transition-all">
               <Calendar className="w-4 h-4 text-slate-400" />
               Custom Range
               <ChevronDown className="w-4 h-4 text-slate-300" />
            </div>
            <button className="px-6 py-4 bg-white border border-slate-200 rounded-2xl flex items-center gap-3 font-bold text-slate-600 hover:bg-slate-50 transition-all shadow-sm">
              <Filter className="w-4 h-4" />
              Status
            </button>
          </div>
        </div>

        {/* Sales Table */}
        <div className="bg-white rounded-[2.5rem] border border-slate-200 shadow-sm overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full border-collapse">
              <thead>
                <tr className="border-b border-slate-50 bg-slate-50/50">
                  <th className="px-8 py-6 text-left text-[10px] font-black text-slate-400 uppercase tracking-widest">Transaction Info</th>
                  <th className="px-8 py-6 text-left text-[10px] font-black text-slate-400 uppercase tracking-widest">Customer Profile</th>
                  <th className="px-8 py-6 text-center text-[10px] font-black text-slate-400 uppercase tracking-widest">Amount</th>
                  <th className="px-8 py-6 text-center text-[10px] font-black text-slate-400 uppercase tracking-widest">Payment Status</th>
                  <th className="px-8 py-6 text-right text-[10px] font-black text-slate-400 uppercase tracking-widest">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-50">
                {sales.map((sale) => (
                  <tr key={sale.id} className="group hover:bg-slate-50/50 transition-all duration-300">
                    <td className="px-8 py-6">
                      <div className="flex items-center gap-4">
                        <div className="w-12 h-12 bg-emerald-50 rounded-2xl flex items-center justify-center border border-emerald-100 group-hover:rotate-12 transition-transform">
                          <CreditCard className="w-6 h-6 text-emerald-500" />
                        </div>
                        <div>
                          <p className="text-sm font-black text-slate-800 group-hover:text-emerald-600 transition-colors uppercase tracking-tight">{sale.invoiceNo}</p>
                          <p className="text-[11px] font-bold text-slate-400 flex items-center gap-1">
                             <Calendar className="w-3 h-3" /> {new Date(sale.date).toLocaleDateString()}
                          </p>
                        </div>
                      </div>
                    </td>
                    <td className="px-8 py-6">
                      <div className="flex items-center gap-3">
                         <div className="w-8 h-8 bg-slate-50 rounded-full flex items-center justify-center border border-slate-100">
                            <User className="w-4 h-4 text-slate-300" />
                         </div>
                         <div>
                            <p className="text-sm font-bold text-slate-700">{sale.customer}</p>
                            <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">{sale.customerType}</p>
                         </div>
                      </div>
                    </td>
                    <td className="px-8 py-6 text-center">
                       <p className="text-sm font-black text-slate-800">${sale.amount.toFixed(2)}</p>
                    </td>
                    <td className="px-8 py-6 text-center">
                       <div className={`inline-flex items-center gap-2 px-4 py-1.5 rounded-full text-[10px] font-black uppercase tracking-widest border ${
                         sale.status === 'paid' ? 'bg-emerald-50 text-emerald-600 border-emerald-100' : 'bg-amber-50 text-amber-600 border-amber-100'
                       }`}>
                         {sale.status === 'paid' ? <CheckCircle2 className="w-3 h-3" /> : <AlertTriangle className="w-3 h-3" />}
                         {sale.status}
                       </div>
                    </td>
                    <td className="px-8 py-6 text-right">
                      <div className="flex items-center justify-end gap-3 opacity-0 group-hover:opacity-100 transition-all">
                        <button className="p-2.5 bg-white border border-slate-200 rounded-xl text-slate-400 hover:text-emerald-600 hover:border-emerald-200 shadow-sm transition-all">
                          <Eye className="w-4 h-4" />
                        </button>
                        <button className="p-2.5 bg-white border border-slate-200 rounded-xl text-slate-400 hover:text-emerald-600 hover:border-emerald-200 shadow-sm transition-all">
                          <Download className="w-4 h-4" />
                        </button>
                        <button className="p-2.5 bg-slate-50 border border-slate-100 rounded-xl text-slate-400 hover:text-slate-600 shadow-sm transition-all">
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

export default SalesList;
