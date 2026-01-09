import { 
    Wallet, 
    TrendingUp, 
    TrendingDown, 
    PieChart, 
    DollarSign, 
    CreditCard,
    ArrowUpRight,
    ArrowDownRight,
    Calendar,
    Bell,
    Receipt,
    Search
  } from "lucide-react";
  
  const AccountingDashboard = () => {
    return (
      <div className="min-h-screen bg-slate-50/50 p-4 md:p-8 animate-in fade-in duration-500">
        <div className="max-w-[1600px] mx-auto space-y-8">
          
          {/* Header */}
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
            <div>
              <div className="flex items-center gap-3 mb-2">
                <span className="px-3 py-1 bg-indigo-50 text-indigo-600 border border-indigo-100 rounded-full text-[10px] font-black uppercase tracking-widest">Finance Department</span>
                <span className="px-3 py-1 bg-emerald-50 text-emerald-600 border border-emerald-100 rounded-full text-[10px] font-black uppercase tracking-widest">FY 2025-26</span>
              </div>
              <h1 className="text-3xl md:text-4xl font-black text-slate-800 tracking-tight uppercase">Financial Overview</h1>
              <p className="text-slate-500 font-bold mt-2">Monitor cash flow, fee collections, and operational expenses</p>
            </div>
  
            <div className="flex items-center gap-4">
              <button className="px-6 py-3 bg-slate-900 text-white rounded-full font-black text-[10px] uppercase tracking-widest shadow-lg hover:bg-slate-800 transition-all flex items-center gap-2">
                 <Receipt className="w-4 h-4" /> New Transaction
              </button>
            </div>
          </div>
  
          {/* Financial Cards */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            <div className="bg-slate-900 rounded-[2rem] p-8 text-white relative overflow-hidden shadow-xl col-span-1 md:col-span-2">
               <div className="absolute top-0 right-0 w-64 h-64 bg-emerald-500/10 rounded-full blur-3xl -mr-16 -mt-16"></div>
               <div className="relative z-10 flex flex-col justify-between h-full">
                  <div className="flex justify-between items-start mb-8">
                     <div className="w-12 h-12 bg-white/10 rounded-2xl flex items-center justify-center text-emerald-400 border border-white/5">
                        <Wallet className="w-6 h-6" />
                     </div>
                     <div className="px-3 py-1 bg-emerald-500/20 rounded-lg text-[10px] font-black text-emerald-400 uppercase tracking-widest border border-emerald-500/20">
                        +12.5% vs Last Month
                     </div>
                  </div>
                  <div>
                     <p className="text-slate-400 font-bold uppercase tracking-widest text-xs mb-1">Total Revenue (January)</p>
                     <h2 className="text-4xl md:text-5xl font-black tracking-tight">৳ 1,250,500</h2>
                  </div>
               </div>
            </div>
  
            {[
              { label: "Total Expenses", value: "৳ 425,000", trend: "+5%", icon: TrendingDown, color: "text-rose-600", bg: "bg-rose-50" },
              { label: "Pending Dues", value: "৳ 180,000", trend: "32 Students", icon: PieChart, color: "text-amber-600", bg: "bg-amber-50" },
            ].map((stat, idx) => (
               <div key={idx} className="bg-white p-8 rounded-[2rem] border border-slate-200 shadow-sm">
                  <div className="flex justify-between items-start mb-8">
                     <div className={`w-12 h-12 ${stat.bg} ${stat.color} rounded-2xl flex items-center justify-center`}>
                        <stat.icon className="w-6 h-6" />
                     </div>
                     <div className="px-3 py-1 bg-slate-50 rounded-lg text-[10px] font-black text-slate-400 uppercase tracking-widest border border-slate-100">
                        {stat.trend}
                     </div>
                  </div>
                  <div>
                     <p className="text-slate-400 font-black uppercase tracking-widest text-[10px] mb-2">{stat.label}</p>
                     <h3 className="text-3xl font-black text-slate-800 tracking-tight">{stat.value}</h3>
                  </div>
               </div>
            ))}
          </div>
  
          {/* Main Grid */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
             
             {/* Recent Transactions */}
             <div className="lg:col-span-2 bg-white rounded-[2.5rem] p-10 border border-slate-200 shadow-sm">
                <div className="flex items-center justify-between mb-8">
                   <h3 className="text-xl font-black text-slate-800 uppercase tracking-tight">Recent Transactions</h3>
                   <div className="flex gap-2">
                      <button className="px-4 py-2 bg-slate-50 text-slate-600 rounded-xl text-[10px] font-black uppercase tracking-widest hover:bg-slate-100">Income</button>
                      <button className="px-4 py-2 bg-white border border-slate-200 text-slate-400 rounded-xl text-[10px] font-black uppercase tracking-widest hover:border-slate-300">Expense</button>
                   </div>
                </div>
  
                <div className="space-y-4">
                   {[
                      { id: "TXN-8821", desc: "Tuition Fees - Class Hifz A", date: "Today, 10:42 AM", amount: "+ ৳ 12,500", type: "income" },
                      { id: "TXN-8820", desc: "Stationery Purchase for Office", date: "Today, 09:15 AM", amount: "- ৳ 4,200", type: "expense" },
                      { id: "TXN-8819", desc: "Admission Fee - New Student", date: "Yesterday, 04:30 PM", amount: "+ ৳ 8,000", type: "income" },
                      { id: "TXN-8818", desc: "Electric Bill Payment - Dec", date: "Yesterday, 02:00 PM", amount: "- ৳ 15,600", type: "expense" },
                   ].map((txn, i) => (
                      <div key={i} className="flex items-center justify-between p-5 bg-slate-50/50 rounded-2xl group hover:bg-slate-50 transition-colors">
                         <div className="flex items-center gap-5">
                            <div className={`w-12 h-12 rounded-2xl flex items-center justify-center ${txn.type === 'income' ? 'bg-emerald-50 text-emerald-600' : 'bg-rose-50 text-rose-600'}`}>
                               {txn.type === 'income' ? <ArrowDownRight className="w-6 h-6" /> : <ArrowUpRight className="w-6 h-6" />}
                            </div>
                            <div>
                               <h4 className="font-bold text-slate-800 text-sm mb-1">{txn.desc}</h4>
                               <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">{txn.id} • {txn.date}</p>
                            </div>
                         </div>
                         <span className={`text-sm font-black ${txn.type === 'income' ? 'text-emerald-600' : 'text-slate-800'}`}>{txn.amount}</span>
                      </div>
                   ))}
                </div>
             </div>
  
             {/* Quick Actions */}
             <div className="space-y-6">
                <div className="bg-white rounded-[2.5rem] p-8 border border-slate-200 shadow-sm text-center group hover:border-indigo-200 transition-all cursor-pointer">
                   <div className="w-16 h-16 bg-indigo-50 rounded-3xl flex items-center justify-center text-indigo-600 mx-auto mb-6 group-hover:scale-110 transition-transform">
                      <CreditCard className="w-8 h-8" />
                   </div>
                   <h3 className="text-lg font-black text-slate-800 uppercase tracking-tight mb-2">Process Payroll</h3>
                   <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest px-4">Disburse monthly salaries to 42 employees</p>
                </div>
  
                <div className="bg-white rounded-[2.5rem] p-8 border border-slate-200 shadow-sm text-center group hover:border-emerald-200 transition-all cursor-pointer">
                   <div className="w-16 h-16 bg-emerald-50 rounded-3xl flex items-center justify-center text-emerald-600 mx-auto mb-6 group-hover:scale-110 transition-transform">
                      <Receipt className="w-8 h-8" />
                   </div>
                   <h3 className="text-lg font-black text-slate-800 uppercase tracking-tight mb-2">Generate Report</h3>
                   <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest px-4">Download monthly financial statement PDF</p>
                </div>
             </div>
  
          </div>
        </div>
      </div>
    );
  };
  
  export default AccountingDashboard;
