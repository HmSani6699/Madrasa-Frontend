import { useState, useMemo } from "react";
import { 
  ClipboardList, 
  Search, 
  Filter, 
  Download, 
  HeartHandshake, 
  Calendar,
  MoreVertical,
  Printer,
  ChevronRight,
  TrendingUp,
  CreditCard,
  User,
  ArrowUpRight,
  FilterX
} from "lucide-react";

/**
 * DonationHistory Component
 * A comprehensive dashboard for tracking and managing institutional donations.
 */
const DonationHistory = () => {
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedType, setSelectedType] = useState("all");
  const [activeTab, setActiveTab] = useState("all");

  // Mock data for donations
  const [donations] = useState([
    { id: "DON-001", donor: "Muntasir Billah", amount: 5000, type: "General", date: "2026-01-15", method: "Cash", purpose: "Mosque Construction", phone: "017-XXXXXXX" },
    { id: "DON-002", donor: "Anonymous", amount: 10000, type: "Zakat", date: "2026-01-14", method: "Bank Transfer", purpose: "Student Welfare", phone: "N/A" },
    { id: "DON-003", donor: "Haji Abdul Wahab", amount: 25000, type: "Sadakah", date: "2026-01-12", method: "Cheque", purpose: "Land Purchase", phone: "018-XXXXXXX" },
    { id: "DON-004", donor: "Sakib Al Hasan", amount: 2000, type: "General", date: "2026-01-10", method: "bKash", purpose: "Iftar Program", phone: "019-XXXXXXX" },
    { id: "DON-005", donor: "Rahima Khatun", amount: 500, type: "Sadakah", date: "2026-01-08", method: "Cash", purpose: "Orphan Support", phone: "015-XXXXXXX" },
    { id: "DON-006", donor: "Business Association", amount: 50000, type: "General", date: "2026-01-05", method: "Bank Transfer", purpose: "Library Expansion", phone: "013-XXXXXXX" },
  ]);

  // Derived state for filtering
  const filteredDonations = useMemo(() => {
    return donations.filter(donation => {
      const matchesSearch = donation.donor.toLowerCase().includes(searchTerm.toLowerCase()) || 
                           donation.id.toLowerCase().includes(searchTerm.toLowerCase()) ||
                           donation.purpose.toLowerCase().includes(searchTerm.toLowerCase());
      const matchesType = selectedType === "all" || donation.type.toLowerCase() === selectedType.toLowerCase();
      
      let matchesTab = true;
      if (activeTab === "cash") matchesTab = donation.method === "Cash";
      if (activeTab === "digital") matchesTab = ["bKash", "Bank Transfer", "Cheque"].includes(donation.method);

      return matchesSearch && matchesType && matchesTab;
    });
  }, [donations, searchTerm, selectedType, activeTab]);

  // Dynamic Statistics
  const stats = useMemo(() => {
    const totalAmount = filteredDonations.reduce((acc, curr) => acc + curr.amount, 0);
    const donorCount = new Set(filteredDonations.map(d => d.donor)).size;
    const avgDonation = totalAmount / (filteredDonations.length || 1);

    return [
      { label: "Total Collection", value: `৳ ${totalAmount.toLocaleString()}`, icon: TrendingUp, color: "emerald", trend: "Current Period" },
      { label: "Unique Donors", value: donorCount.toString(), icon: User, color: "blue", trend: "Contributing now" },
      { label: "Donation Count", value: filteredDonations.length.toString(), icon: HeartHandshake, color: "rose", trend: "Transations recorded" },
      { label: "Avg. Donation", value: `৳ ${Math.round(avgDonation).toLocaleString()}`, icon: CreditCard, color: "amber", trend: "Per transaction" },
    ];
  }, [filteredDonations]);

  return (
    <div className="min-h-screen bg-slate-50/50 p-4 md:p-8 animate-in fade-in duration-500">
      <div className="max-w-[1600px] mx-auto space-y-8">
        
        {/* Header Section */}
        <div className="bg-white rounded-[2rem] md:rounded-[2.5rem] border border-slate-200 p-6 md:p-8 shadow-sm flex flex-col lg:flex-row justify-between items-start lg:items-center gap-6">
          <div className="flex items-center gap-4 md:gap-6">
            <div className="w-12 h-12 md:w-16 md:h-16 bg-emerald-50 rounded-xl md:rounded-2xl flex items-center justify-center border border-emerald-100 shadow-inner shrink-0 text-emerald-600">
              <ClipboardList className="w-6 h-6 md:w-8 md:h-8" />
            </div>
            <div>
              <h1 className="text-xl md:text-3xl font-black text-slate-800 tracking-tight uppercase leading-none">Donation History</h1>
              <p className="text-slate-500 font-bold mt-1 text-xs md:text-sm">Manage and track all institutional contributions</p>
            </div>
          </div>

          <div className="flex flex-wrap gap-3 w-full lg:w-auto">
             <button className="flex-1 lg:flex-none px-4 md:px-6 py-3 md:py-4 bg-slate-100 text-slate-600 rounded-xl md:rounded-2xl font-black hover:bg-slate-200 transition-all flex items-center justify-center gap-2 border border-slate-200 uppercase tracking-widest text-[9px] md:text-[10px]">
               <Download className="w-4 h-4" />
               Export CSV
            </button>
            <button className="flex-1 lg:flex-none px-4 md:px-6 py-3 md:py-4 bg-emerald-600 text-white rounded-xl md:rounded-2xl font-black shadow-xl shadow-emerald-100 hover:bg-emerald-700 hover:scale-[1.02] active:scale-95 transition-all flex items-center justify-center gap-2 uppercase tracking-widest text-[9px] md:text-[10px]">
              <Printer className="w-4 h-4" />
              Print Audit
            </button>
          </div>
        </div>

        {/* Statistics Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 md:gap-6">
          {stats.map((stat) => (
            <div key={stat.label} className="bg-white rounded-[1.5rem] md:rounded-[2rem] border border-slate-200 p-5 md:p-6 shadow-sm group hover:border-emerald-200 transition-all">
              <div className="flex justify-between items-center mb-4">
                <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">{stat.label}</p>
                <div className={`w-8 h-8 md:w-10 md:h-10 rounded-lg md:rounded-xl flex items-center justify-center bg-${stat.color}-50 text-${stat.color}-600 group-hover:scale-110 transition-transform`}>
                  <stat.icon className="w-4 h-4 md:w-5 md:h-5" />
                </div>
              </div>
              <div className="space-y-1">
                <h4 className="text-2xl md:text-3xl font-black text-slate-800 tracking-tight">{stat.value}</h4>
                <p className="text-[10px] font-bold text-slate-400 flex items-center gap-1">
                   {stat.trend}
                </p>
              </div>
            </div>
          ))}
        </div>

        {/* Filter & List Section */}
        <div className="bg-white rounded-[2rem] md:rounded-[3rem] border border-slate-200 shadow-sm overflow-hidden">
          <div className="p-6 md:p-8 border-b border-slate-50 bg-slate-50/20 flex flex-col xl:flex-row justify-between items-start xl:items-center gap-6 md:gap-8">
            <div className="flex-1 w-full space-y-4">
               <div className="flex items-center gap-3">
                  <h2 className="text-xl md:text-2xl font-black text-slate-800 tracking-tight uppercase">Donation Log</h2>
                  <div className="px-2 py-0.5 md:px-3 md:py-1 bg-emerald-100 text-emerald-600 rounded-lg text-[9px] md:text-[10px] font-black uppercase tracking-widest border border-emerald-200">
                    Transparent
                  </div>
               </div>
               
               <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-3 md:gap-4">
                  <div className="relative">
                    <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-300" />
                    <input 
                      className="bg-white border border-slate-200 rounded-xl pl-10 pr-6 py-3 text-sm font-bold focus:border-emerald-500 outline-none w-full shadow-sm transition-all text-slate-700" 
                      placeholder="Donor, ID or Purpose..." 
                      value={searchTerm}
                      onChange={(e) => setSearchTerm(e.target.value)}
                    />
                  </div>
                  <select 
                    className="bg-white border border-slate-200 rounded-xl px-4 py-3 text-sm font-bold focus:border-emerald-500 outline-none shadow-sm cursor-pointer text-slate-700"
                    value={selectedType}
                    onChange={(e) => setSelectedType(e.target.value)}
                  >
                    <option value="all">Every Category</option>
                    <option value="general">General</option>
                    <option value="zakat">Zakat</option>
                    <option value="sadakah">Sadakah</option>
                  </select>
                  <button 
                    onClick={() => {setSearchTerm(""); setSelectedType("all"); setActiveTab("all");}}
                    className="px-4 py-3 bg-slate-900 text-white rounded-xl text-[10px] font-black uppercase tracking-widest hover:bg-slate-800 transition-all shadow-xl shadow-slate-200 flex items-center justify-center gap-2 sm:col-span-2 md:col-span-1"
                  >
                    <FilterX className="w-4 h-4" />
                    Reset
                  </button>
               </div>
            </div>
            
            <div className="flex items-center gap-2 md:gap-3 bg-slate-100 p-1.5 md:p-2 rounded-xl md:rounded-2xl w-full xl:w-auto overflow-x-auto no-scrollbar">
               {[
                 { id: "all", label: "All Methods" },
                 { id: "cash", label: "Cash Only" },
                 { id: "digital", label: "Digital/Bank" }
               ].map(tab => (
                 <button 
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id)}
                  className={`px-4 md:px-6 py-2 rounded-lg md:rounded-xl text-[9px] md:text-[10px] font-black uppercase tracking-widest transition-all whitespace-nowrap ${
                    activeTab === tab.id ? "bg-white text-emerald-600 shadow-sm border border-slate-200/50" : "text-slate-400 hover:text-slate-600"
                  }`}
                 >
                   {tab.label}
                 </button>
               ))}
            </div>
          </div>

          <div className="overflow-x-auto scrollbar-thin scrollbar-thumb-slate-200">
            <table className="w-full border-collapse min-w-[1000px]">
              <thead>
                <tr className="border-b border-slate-50 text-[10px] font-black text-slate-400 uppercase tracking-widest bg-slate-50/10">
                  <th className="px-6 md:px-8 py-4 md:py-6 text-left">Donor Details</th>
                  <th className="px-6 md:px-8 py-4 md:py-6 text-center">Category</th>
                  <th className="px-6 md:px-8 py-4 md:py-6 text-center">Purpose</th>
                  <th className="px-6 md:px-8 py-4 md:py-6 text-center">Method</th>
                  <th className="px-6 md:px-8 py-4 md:py-6 text-center">Date</th>
                  <th className="px-6 md:px-8 py-4 md:py-6 text-center">Amount</th>
                  <th className="px-6 md:px-8 py-4 md:py-6 text-right">Receipt</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-50">
                {filteredDonations.length > 0 ? (
                  filteredDonations.map((donation) => (
                  <tr key={donation.id} className="group hover:bg-slate-50/50 transition-all">
                    <td className="px-6 md:px-8 py-4 md:py-6">
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 md:w-12 md:h-12 bg-slate-100 rounded-[0.75rem] md:rounded-[1rem] flex items-center justify-center font-black text-slate-400 group-hover:bg-emerald-50 group-hover:text-emerald-600 transition-all shrink-0">
                          {donation.donor === "Anonymous" ? "?" : donation.donor.split(' ').map(n => n[0]).join('')}
                        </div>
                        <div className="min-w-0">
                          <p className="text-sm font-black text-slate-800 uppercase tracking-tight truncate">{donation.donor}</p>
                          <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">{donation.id}</p>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 md:px-8 py-4 md:py-6 text-center">
                      <span className={`px-3 py-1 rounded-full text-[9px] font-black uppercase tracking-widest border ${
                        donation.type === "Zakat" ? "bg-amber-50 text-amber-600 border-amber-100" :
                        donation.type === "Sadakah" ? "bg-blue-50 text-blue-600 border-blue-100" :
                        "bg-slate-50 text-slate-600 border-slate-100"
                      }`}>
                         {donation.type}
                      </span>
                    </td>
                    <td className="px-6 md:px-8 py-4 md:py-6 text-center">
                       <span className="text-xs font-bold text-slate-500">{donation.purpose}</span>
                    </td>
                    <td className="px-6 md:px-8 py-4 md:py-6 text-center">
                      <div className="inline-flex items-center gap-1.5 px-3 py-1 bg-slate-50 rounded-lg border border-slate-100 text-[10px] font-black text-slate-600 uppercase">
                         <CreditCard className="w-3 h-3 text-slate-400" />
                         {donation.method}
                      </div>
                    </td>
                    <td className="px-6 md:px-8 py-4 md:py-6 text-center">
                      <div className="inline-flex items-center gap-1.5 text-xs font-bold text-slate-500">
                        <Calendar className="w-3 h-3 text-slate-400" />
                        {new Date(donation.date).toLocaleDateString()}
                      </div>
                    </td>
                    <td className="px-6 md:px-8 py-4 md:py-6 text-center">
                      <span className="text-base font-black text-slate-800 group-hover:text-emerald-600 transition-colors">৳ {donation.amount.toLocaleString()}</span>
                    </td>
                    <td className="px-6 md:px-8 py-4 md:py-6 text-right">
                      <div className="flex justify-end gap-1.5">
                        <button className="p-2 bg-slate-50 text-slate-400 rounded-lg border border-slate-100 hover:bg-slate-900 hover:text-white transition-all shadow-sm">
                          <Printer className="w-4 h-4" />
                        </button>
                        <button className="p-2 bg-emerald-50 text-emerald-600 rounded-lg border border-emerald-100 hover:bg-emerald-600 hover:text-white transition-all shadow-sm">
                           <ArrowUpRight className="w-4 h-4" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))
                ) : (
                  <tr>
                    <td colSpan="7" className="px-8 py-20 text-center">
                       <div className="flex flex-col items-center gap-4">
                          <div className="w-16 h-16 bg-slate-50 rounded-full flex items-center justify-center border border-dashed border-slate-200 text-slate-200">
                             <Search className="w-8 h-8" />
                          </div>
                          <p className="text-slate-400 font-bold uppercase tracking-widest text-xs">No records found for current filters</p>
                       </div>
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>

          <div className="p-6 md:p-8 bg-slate-50/50 flex flex-col md:flex-row justify-between items-center border-t border-slate-100 gap-6">
            <p className="text-[10px] font-black uppercase tracking-widest text-slate-400">
              Showing <span className="text-slate-900 font-black">{filteredDonations.length}</span> recorded contributions
            </p>
            <div className="flex gap-2 w-full md:w-auto">
              <button className="flex-1 md:flex-none px-6 py-2 bg-white text-slate-600 rounded-xl text-[10px] font-black uppercase tracking-widest border border-slate-200 hover:bg-slate-50 transition-all shadow-sm font-mono">Previous</button>
              <button className="flex-1 md:flex-none px-6 py-2 bg-slate-900 text-white rounded-xl text-[10px] font-black uppercase tracking-widest shadow-xl shadow-slate-200 hover:bg-slate-800 transition-all font-mono">Next</button>
            </div>
          </div>
        </div>

        {/* Footer Info Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 md:gap-8">
           <div className="bg-emerald-900 rounded-[2rem] md:rounded-[2.5rem] p-6 md:p-8 text-white shadow-2xl relative overflow-hidden group">
              <div className="relative z-10 space-y-6">
                 <div>
                    <h3 className="text-xl font-black uppercase tracking-tight flex items-center gap-2">
                       <TrendingUp className="w-5 h-5 text-emerald-400" />
                       Growth Insights
                    </h3>
                    <p className="text-emerald-100/60 text-xs md:text-sm font-bold mt-1 max-w-xs">Donations increased by 15% this month compared to the previous period.</p>
                 </div>
                 <button className="w-full sm:w-auto px-8 py-4 bg-emerald-600 text-white rounded-xl md:rounded-2xl font-black shadow-lg shadow-emerald-900/40 hover:bg-emerald-500 hover:translate-y-[-2px] transition-all flex items-center justify-center gap-3 uppercase tracking-widest text-[10px] md:text-[11px]">
                    Detailed Analytics
                 </button>
              </div>
              <div className="absolute -right-10 -bottom-10 w-48 md:w-64 h-48 md:h-64 text-white/5 rotate-12 group-hover:rotate-0 transition-transform duration-700">
                 <HeartHandshake className="w-full h-full" />
              </div>
           </div>

           <div className="bg-white rounded-[2rem] md:rounded-[2.5rem] border border-slate-200 p-6 md:p-8 shadow-sm flex items-center justify-between group">
              <div className="space-y-4">
                 <div>
                    <h3 className="text-xl font-black text-slate-800 uppercase tracking-tight flex items-center gap-2">
                       <User className="w-5 h-5 text-blue-500" />
                       Donor Portal
                    </h3>
                    <p className="text-slate-500 text-xs md:text-sm font-bold mt-1">Manage donor profiles and automated receipt generation.</p>
                 </div>
                 <button className="text-emerald-600 font-black text-[10px] md:text-[11px] uppercase tracking-widest flex items-center gap-2 group-hover:translate-x-1 transition-transform">
                    Configure Portals
                    <ChevronRight className="w-4 h-4" />
                 </button>
              </div>
              <div className="w-16 h-16 md:w-24 md:h-24 bg-blue-50 rounded-full flex items-center justify-center border border-blue-100 border-dashed shrink-0 group-hover:scale-110 transition-transform duration-500">
                 <ArrowUpRight className="w-8 h-8 md:w-10 md:h-10 text-blue-200" />
              </div>
           </div>
        </div>

      </div>
    </div>
  );
};

export default DonationHistory;
