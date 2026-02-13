import { useState } from "react";
import { useAuth } from "../../context/AuthContext";
import { 
  CreditCard, 
  ArrowRight, 
  Download, 
  CheckCircle2, 
  AlertCircle,
  Receipt,
  History,
  Info,
  ShieldCheck,
  TrendingDown,
  ChevronRight,
  Landmark,
  Wallet
} from "lucide-react";

const FeesAndDues = () => {
  const { activeChild } = useAuth();
  const [isPaying, setIsPaying] = useState(false);
  const [activeTab, setActiveTab] = useState("pending");

  const fees = [
    { id: 1, title: "Monthly Tuition Fee - January", dueDate: "Jan 10, 2026", amount: "2,000", status: "pending", type: "Academic" },
    { id: 2, title: "Institutional Transport Fee", dueDate: "Jan 10, 2026", amount: "500", status: "pending", type: "Utility" },
    { id: 3, title: "Admission Balance Remainder", dueDate: "Dec 30, 2025", amount: "1,500", status: "overdue", type: "Admin" },
  ];

  return (
    <div className="space-y-8 pb-12 animate-in fade-in duration-700">
   

      {/* Financial Health Stats */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
         

         <div className="bg-white rounded-[20px] p-5 border-2 border-slate-50 shadow-sm flex flex-col justify-between group hover:border-emerald-100 transition-all cursor-default">
              <div className="flex items-start justify-between">
                    <div className="">
                 
                  <h4 className="text-2xl font-black text-slate-800 tracking-tight">৳ 2,500</h4>
                  <p className="text-[9px] font-black text-emerald-500 uppercase mt-1">Total Due</p>
               </div>
               <div className="w-14 h-14 bg-emerald-50 rounded-2xl flex items-center justify-center text-emerald-600 shadow-inner group-hover:scale-110 transition-transform">
                  <ShieldCheck className="w-7 h-7" />
               </div>
            
            </div>
         </div>

         <div className="bg-white rounded-[20px] p-5 border-2 border-slate-50 shadow-sm flex flex-col justify-between group hover:border-amber-100 transition-all cursor-default">
              <div className="flex items-start justify-between">
                  <div className="">
                
                  <h4 className="text-2xl font-black text-slate-800 tracking-tight uppercase tracking-tighter">3434</h4>
                  <p className="text-[9px] font-black text-amber-500 uppercase mt-1">Total Pay</p>
               </div>
               <div className="w-14 h-14 bg-amber-50 rounded-2xl flex items-center justify-center text-amber-600 shadow-inner group-hover:scale-110 transition-transform">
                  <TrendingDown className="w-7 h-7" />
               </div>
              
            </div>
           
         </div>
      </div>

      {/* Invoice Ledger Table */}
      <div className="bg-white rounded-[20px] border-2 border-slate-50 shadow-xl shadow-slate-200/50 overflow-hidden relative">
         <div className=" p-5 border-b-2 border-slate-50 flex flex-col md:flex-row items-center justify-between gap-6">
            <h2 className="text-2xl font-black text-slate-800  tracking-tight flex items-center gap-4">
               <div className="w-10 h-10 bg-slate-900 rounded-xl flex items-center justify-center text-white">
                  <Receipt className="w-5 h-5" />
               </div>
               Deu List
            </h2>
          
         </div>

         <div className="overflow-x-auto">
            <table className="w-full">
               <thead>
                  <tr className="text-[10px] font-black text-slate-300 uppercase tracking-widest text-left border-b border-slate-50 whitespace-nowrap">
                     <th className="px-12 py-3">Fee Type</th>
                     <th className="px-12 py-3 text-center">Due Deadline</th>
                     <th className="px-12 py-3 text-center">Currency Value</th>
                     <th className="px-12 py-3 text-center">Payment Status</th>
                  </tr>
               </thead>
               <tbody className="divide-y divide-slate-50">
                  {fees.map((fee) => (
                     <tr key={fee.id} className="group hover:bg-slate-50/50 transition-all cursor-default whitespace-nowrap">
                        <td className="px-12 py-3">
                           <div className="flex items-center gap-4">
                             
                              <div>
                                 <p className="text-sm font-black text-slate-800 uppercase tracking-tight mb-1">{fee.title}</p>
                               
                              </div>
                           </div>
                        </td>
                        <td className="px-12 py-3 text-center">
                           <span className={`text-[11px] font-black uppercase tracking-tight ${fee.status === 'overdue' ? 'text-rose-500' : 'text-slate-500'}`}>
                              {fee.dueDate}
                           </span>
                        </td>
                        <td className="px-12 py-3 text-center">
                           <span className="text-2xl font-black text-slate-900 tracking-tighter">৳ {fee.amount}</span>
                        </td>
                        <td className="px-12 py-3 text-center">
                           <div className={`inline-flex items-center gap-2 px-5 py-2 rounded-xl text-[9px] font-black uppercase tracking-widest transition-all ${
                              fee.status === 'overdue' 
                              ? 'bg-rose-50 text-rose-600 border border-rose-100 shadow-md shadow-rose-100/50 ring-4 ring-rose-50/50' 
                              : 'bg-amber-50 text-amber-600 border border-amber-100'
                           }`}>
                              {fee.status === 'overdue' ? <AlertCircle className="w-3 h-3" /> : <Clock className="w-3 h-3" />}
                              {fee.status}
                           </div>
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

// Local Clock icon
const Clock = ({ className }) => (
  <svg className={className} xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="10"></circle><polyline points="12 6 12 12 16 14"></polyline></svg>
);

export default FeesAndDues;
