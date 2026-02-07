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
  ChevronLeft,
  TrendingUp,
  CreditCard,
  User,
  ArrowUpRight,
  FilterX
} from "lucide-react";
import { useTranslation } from "react-i18next";
import SelectInputField from "../../components/SelectInputField";
import InputField from "../../components/InputField";

/**
 * DonationHistory Component
 * A comprehensive dashboard for tracking and managing institutional donations.
 */
const DonationHistory = () => {
  const { t } = useTranslation();
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedType, setSelectedType] = useState("all");
  const [activeTab, setActiveTab] = useState("all");

  // Pagination State
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 5;

  // Mock data for donations
  const [donations] = useState([
    { id: "DON-001", donor: "Muntasir Billah", amount: 5000, type: "general", date: "2026-01-15", method: "Cash", purpose: "Mosque Construction", phone: "017-XXXXXXX" },
    { id: "DON-002", donor: t('donation_page.anonymous'), amount: 10000, type: "zakat", date: "2026-01-14", method: "Bank Transfer", purpose: "Student Welfare", phone: "N/A" },
    { id: "DON-003", donor: "Haji Abdul Wahab", amount: 25000, type: "lillah", date: "2026-01-12", method: "Cheque", purpose: "Land Purchase", phone: "018-XXXXXXX" },
    { id: "DON-004", donor: "Sakib Al Hasan", amount: 2000, type: "general", date: "2026-01-10", method: "bKash", purpose: "Iftar Program", phone: "019-XXXXXXX" },
    { id: "DON-005", donor: "Rahima Khatun", amount: 500, type: "sadakah", date: "2026-01-08", method: "Cash", purpose: "Orphan Support", phone: "015-XXXXXXX" },
    { id: "DON-006", donor: "Business Association", amount: 50000, type: "general", date: "2026-01-05", method: "Bank Transfer", purpose: "Library Expansion", phone: "013-XXXXXXX" },
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

    return [
      { label: t('donation_page.total_collection'), value: `৳ ${totalAmount.toLocaleString()}`, icon: TrendingUp, color: "emerald", trend: t('donation_page.current_period') },
      { label: t('donation_page.unique_donors'), value: donorCount.toString(), icon: User, color: "blue", trend: t('donation_page.contributing_now') }
    ];
  }, [filteredDonations, t]);

  // Pagination Logic
  const totalPages = Math.ceil(filteredDonations.length / itemsPerPage);
  const currentDonations = useMemo(() => {
    const startIndex = (currentPage - 1) * itemsPerPage;
    return filteredDonations.slice(startIndex, startIndex + itemsPerPage);
  }, [filteredDonations, currentPage]);

  // Reset page on filter change
  useMemo(() => {
    setCurrentPage(1);
  }, [searchTerm, selectedType, activeTab]);

  const getFundLabel = (type) => {
    const key = `donation_page.types.${type.toLowerCase()}`;
    const translated = t(key);
    return translated === key ? type : translated;
  };

  return (
    <div className="min-h-screen bg-slate-50/50 p-4 md:p-8 animate-in fade-in duration-500">
      <div className="max-w-[1600px] mx-auto space-y-8">
        
        {/* Header Section */}
        <div className="bg-white rounded-[20px] md:rounded-[20px] border border-slate-200 p-6 md:p-8 shadow-sm flex flex-col lg:flex-row justify-between items-start lg:items-center gap-6">
          <div className="flex items-center gap-4 md:gap-6">
            <div className="w-12 h-12 md:w-16 md:h-16 bg-emerald-50 rounded-xl md:rounded-2xl flex items-center justify-center border border-emerald-100 shadow-inner shrink-0 text-emerald-600">
              <ClipboardList className="w-6 h-6 md:w-8 md:h-8" />
            </div>
            <div>
              <h1 className="text-xl md:text-3xl font-black text-slate-800 tracking-tight uppercase leading-none">{t('donation_page.history')}</h1>
             
            </div>
          </div>

          <button
            className="px-8 py-3 bg-primary text-white font-bold rounded-xl shadow-lg shadow-primary/20 hover:scale-[1.02] active:scale-[0.98] transition-all w-full md:w-auto cursor-pointer"
          >
            {t('donation_page.add_donation')}
          </button>
        </div>

        {/* Statistics Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-2 gap-4 md:gap-6">
          {stats.map((stat) => (
            <div key={stat.label} className="bg-white rounded-[20px] md:rounded-[20px] border border-slate-200 p-5 md:p-6 shadow-sm group hover:border-emerald-200 transition-all">
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
        <div className="bg-white rounded-[20px] md:rounded-[20px] border border-slate-200 shadow-sm overflow-hidden">
          <div className="p-6 md:p-8 border-b border-slate-50 bg-slate-50/20 flex flex-col xl:flex-row justify-between items-start xl:items-center gap-6 md:gap-8">
            <div className="flex-1 w-full space-y-4">
               <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-3 md:gap-4">
                <SelectInputField 
                  title={t('donation_page.fund_type')} 
                  options={[
                    { value: "all", label: t('common.all') || "All" },
                    { value: "general", label: t('donation_page.types.general') },
                    { value: "zakat", label: t('donation_page.types.zakat') },
                    { value: "lillah", label: t('donation_page.types.lillah') }
                  ]}
                  value={selectedType}
                  onChange={(val) => setSelectedType(val)}
                />
                <InputField 
                  title={t('donation_page.date')} 
                  type={'date'}
                /> 
                
                <div className="w-full lg:mt-7"> 
                  <button 
                    onClick={() => {setSearchTerm(""); setSelectedType("all"); setActiveTab("all");}}
                    className="px-4 py-3 bg-primary text-white rounded-xl  font-black uppercase tracking-widest  transition-all shadow-xl shadow-slate-200 flex items-center justify-center gap-2 sm:col-span-2 md:col-span-1 w-full"
                  >
                    <FilterX className="w-4 h-4" />
                    {t('common.reset')}
                  </button>
                </div>
               </div>
            </div>
          </div>

          <div className="overflow-x-auto scrollbar-thin scrollbar-thumb-slate-200">
            <table className="w-full border-collapse min-w-[1000px]">
              <thead>
                <tr className="border-b border-slate-50 text-[10px] font-black text-slate-400 uppercase tracking-widest bg-slate-50/10 whitespace-nowrap">
                  <th className="px-6 md:px-8 py-3 md:py-3  text-left">{t('donation_page.donor_details')}</th>
                  <th className="px-6 md:px-8 py-3 md:py-3  text-center">{t('donation_page.fund_type')}</th>
                 
                  <th className="px-6 md:px-8 py-3 md:py-3  text-center">{t('donation_page.amount_bdt')}</th>
                  <th className="px-6 md:px-8 py-3 md:py-3  text-center">{t('donation_page.payment_mode')}</th>
                  <th className="px-6 md:px-8 py-3 md:py-3  text-center">{t('donation_page.date')}</th>
                  <th className="px-6 md:px-8 py-3 md:py-3  text-right">{t('donation_page.receipt_btn')}</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-50">
                {currentDonations.length > 0 ? (
                  currentDonations.map((donation) => (
                  <tr key={donation.id} className="group hover:bg-slate-50/50 transition-all whitespace-nowrap">
                    <td className="px-6 md:px-8 py-3 md:py-3">
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 md:w-12 md:h-12 bg-slate-100 rounded-[0.75rem] md:rounded-[1rem] flex items-center justify-center font-black text-slate-400 group-hover:bg-emerald-50 group-hover:text-emerald-600 transition-all shrink-0">
                          {donation.donor === t('donation_page.anonymous') ? "?" : donation.donor.split(' ').map(n => n[0]).join('')}
                        </div>
                        <div className="min-w-0">
                          <p className="text-sm font-black text-slate-800 uppercase tracking-tight truncate">{donation.donor}</p>
                          <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">{donation.id}</p>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 md:px-8 py-3 md:py-3 text-center">
                      <span className={`px-3 py-1 rounded-full text-[9px] font-black uppercase tracking-widest border ${
                        donation.type === "zakat" ? "bg-amber-50 text-amber-600 border-amber-100" :
                        donation.type === "sadakah" ? "bg-blue-50 text-blue-600 border-blue-100" :
                        "bg-slate-50 text-slate-600 border-slate-100"
                      }`}>
                         {getFundLabel(donation.type)}
                      </span>
                      </td>
                       <td className="px-6 md:px-8 py-3 md:py-3 text-center">
                      <span className="text-base font-black text-slate-800 group-hover:text-emerald-600 transition-colors">৳ {donation.amount.toLocaleString()}</span>
                    </td>
                   
                    <td className="px-6 md:px-8 py-3 md:py-3 text-center">
                      <div className="inline-flex items-center gap-1.5 px-3 py-1 bg-slate-50 rounded-lg border border-slate-100 text-[10px] font-black text-slate-600 uppercase">
                         <CreditCard className="w-3 h-3 text-slate-400" />
                         {donation.method}
                      </div>
                    </td>
                    <td className="px-6 md:px-8 py-3 md:py-3 text-center">
                      <div className="inline-flex items-center gap-1.5 text-xs font-bold text-slate-500">
                        <Calendar className="w-3 h-3 text-slate-400" />
                        {new Date(donation.date).toLocaleDateString()}
                      </div>
                    </td>
                   
                    <td className="px-6 md:px-8 py-3 md:py-3 text-right">
                      <div className="flex justify-end gap-1.5">
                        <button title={t('donation_page.print')} className="p-2 bg-slate-50 text-slate-400 rounded-lg border border-slate-100 hover:bg-slate-900 hover:text-white transition-all shadow-sm">
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
                          <p className="text-slate-400 font-bold uppercase tracking-widest text-xs">{t('common.no_records')}</p>
                       </div>
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>

        {/* Pagination Controls */}
        <div className="bg-[#e6f4ef]/30 px-6 py-4 border-t-2 border-slate-200 flex flex-col sm:flex-row items-center justify-between gap-4">
          <p className="text-xs font-bold text-slate-500 uppercase tracking-wider">
            {t('common.showing')}{" "}
            <span className="text-slate-900">
              {filteredDonations.length === 0 ? 0 : (currentPage - 1) * itemsPerPage + 1}
            </span>{" "}
            {t('common.to')}{" "}
            <span className="text-slate-900">
              {Math.min(currentPage * itemsPerPage, filteredDonations.length)}
            </span>{" "}
            {t('common.of')} <span className="text-slate-900">{filteredDonations.length}</span>{" "}
            {t('common.records')}
          </p>
          <div className="flex items-center gap-2">
            <button
              disabled={currentPage === 1}
              onClick={() => setCurrentPage((p) => Math.max(1, p - 1))}
              className="p-2 border-2 border-slate-200 rounded-xl bg-white text-slate-600 hover:bg-slate-50 hover:border-emerald-500 hover:text-emerald-600 disabled:opacity-50 disabled:cursor-not-allowed transition-all"
            >
              <ChevronLeft className="w-5 h-5" />
            </button>
            <div className="flex items-center gap-1">
              {[...Array(totalPages)].map((_, i) => (
                <button
                  key={i + 1}
                  onClick={() => setCurrentPage(i + 1)}
                  className={`w-10 h-10 rounded-xl text-xs font-black transition-all border-2 ${
                    currentPage === i + 1
                      ? "bg-[#00bd7f] border-[#00bd7f] text-white shadow-lg shadow-emerald-200"
                      : "bg-white border-slate-200 text-slate-600 hover:border-emerald-500 hover:text-emerald-600"
                  }`}
                >
                  {i + 1}
                </button>
              ))}
            </div>
            <button
              disabled={currentPage === totalPages || totalPages === 0}
              onClick={() => setCurrentPage((p) => Math.min(totalPages, p + 1))}
              className="p-2 border-2 border-slate-200 rounded-xl bg-white text-slate-600 hover:bg-slate-50 hover:border-emerald-500 hover:text-emerald-600 disabled:opacity-50 disabled:cursor-not-allowed transition-all"
            >
              <ChevronRight className="w-5 h-5" />
            </button>
          </div>
        </div>
        </div>
      </div>
    </div>
  );
};

export default DonationHistory;
