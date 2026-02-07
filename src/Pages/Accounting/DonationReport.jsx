import { useState, useMemo } from "react";
import { 
  FileText, 
  Search, 
  Filter, 
  Printer, 
  Download, 
  HeartHandshake,
  Calendar,
  ChevronDown,
  User,
  MoreHorizontal,
  TrendingUp,
  Wallet,
  ArrowRight,
  CheckCircle2,
  Clock,
  AlertCircle,
  ClipboardList
} from "lucide-react";
import { useTranslation } from "react-i18next";
import SelectInputField from "../../components/SelectInputField";
import InputField from "../../components/InputField";

/**
 * Premium Donation Report
 * Features: High-end cards, filtering by donor/date, and glassmorphic stats.
 */

const DonationReport = () => {
  const { t } = useTranslation();
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedMonth, setSelectedMonth] = useState("All");
  const [selectedFundType, setSelectedFundType] = useState("All");

  // Mock Data
  const DONATIONS = useMemo(() => [
    {
      id: "DON-2025-001",
      donorName: "Haji Abdul Rahim",
      amount: 50000,
      fundType: "general",
      date: "2025-01-15",
      paymentMethod: "cash",
      month: "january",
      receiptNo: "RC-7721",
      remarks: "For madrasa renovation"
    },
    {
      id: "DON-2025-002",
      donorName: "Mohammad Yusuf",
      amount: 10000,
      fundType: "zakat",
      date: "2025-01-20",
      paymentMethod: "bank_transfer",
      month: "january",
      receiptNo: "RC-7722",
      remarks: "Annual Zakat"
    },
    {
      id: "DON-2025-005",
      donorName: "Anonymus Donor",
      amount: 5000,
      fundType: "sadaqah",
      date: "2025-02-01",
      paymentMethod: "bkash",
      month: "february",
      receiptNo: "RC-7801",
      remarks: "Monthly sadaqah"
    },
    {
      id: "DON-2025-008",
      donorName: "Abdullah Mahmud",
      amount: 25000,
      fundType: "general",
      date: "2025-02-10",
      paymentMethod: "cheque",
      month: "february",
      receiptNo: "RC-7815",
      remarks: ""
    }
  ], []);

  const getMonthLabel = (month) => {
    if (month === "All") return t('common.all');
    return t(`common.months.${month.toLowerCase()}`);
  }

  const getFundLabel = (fund) => {
    if (fund === "All") return t('common.all');
    return t(`donation_report.fund_types.${fund.toLowerCase()}`);
  }

  const getMethodLabel = (method) => {
    return t(`donation_page.payment_methods.${method.toLowerCase()}`);
  }

  const months = [
    { value: "All" }, 
    { value: "january" }, 
    { value: "february" }, 
    { value: "march" }
  ].map(m => ({ ...m, label: getMonthLabel(m.value) }));

  const fundTypes = [
    { value: "All" }, 
    { value: "general" }, 
    { value: "zakat" }, 
    { value: "sadaqah" }, 
    { value: "building" }
  ].map(f => ({ ...f, label: getFundLabel(f.value) }));

  // Filtering Logic
  const filteredDonations = useMemo(() => {
    return DONATIONS.filter(donation => {
      const matchesSearch = donation.donorName.toLowerCase().includes(searchTerm.toLowerCase()) || 
                           donation.receiptNo.toLowerCase().includes(searchTerm.toLowerCase());
      const matchesMonth = selectedMonth === "All" || donation.month === selectedMonth;
      const matchesFund = selectedFundType === "All" || donation.fundType === selectedFundType;
      return matchesSearch && matchesMonth && matchesFund;
    });
  }, [searchTerm, selectedMonth, selectedFundType, DONATIONS]);

  const totalAmount = useMemo(() => filteredDonations.reduce((acc, curr) => acc + curr.amount, 0), [filteredDonations]);

  return (
    <div className="min-h-screen bg-[#F8FAFC] text-slate-800 font-outfit relative overflow-hidden">
      {/* Background Elements */}
      <div className="absolute top-[-10%] right-[-10%] w-[40%] h-[40%] bg-rose-500/5 rounded-full blur-[120px] pointer-events-none"></div>
      <div className="absolute bottom-[-10%] left-[-10%] w-[30%] h-[30%] bg-[#00bd7f]/5 rounded-full blur-[100px] pointer-events-none"></div>

      <div className="max-w-[1500px] mx-auto p-4 md:p-10 relative z-10 space-y-10">
        
        {/* Header */}
        <div className="flex flex-col lg:flex-row justify-between items-start lg:items-center gap-6">
          <div className="space-y-1">
            <h1 className="text-4xl font-black tracking-tight text-slate-900">{t('donation_report.title')}</h1>
            <p className="text-slate-500 font-medium">{t('donation_report.subtitle')}</p>
          </div>

          <div className="bg-white/50 backdrop-blur-md p-4 px-8 rounded-2xl border border-white shadow-xl flex items-center gap-4">
             <div className="text-right">
                <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">{t('donation_report.selected_total')}</p>
                <p className="text-2xl font-black text-[#00bd7f]">৳ {totalAmount.toLocaleString()}</p>
             </div>
             <div className="w-10 h-10 bg-[#00bd7f]/10 rounded-xl flex items-center justify-center text-[#00bd7f]">
                <HeartHandshake className="w-6 h-6" />
             </div>
          </div>
        </div>

        {/* Filter Section */}
        <div className="bg-white/70 backdrop-blur-xl border border-white/40 p-5 rounded-[24px] shadow-[0_20px_50px_rgba(0,0,0,0.05)] grid grid-cols-1 md:grid-cols-4 gap-6 items-end">
          <div className="md:col-span-1">
            <InputField 
               title={t('donation_report.donor_receipt')} 
               placeholder={t('donation_report.search_placeholder')}
               value={searchTerm}
               onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
          <div>
            <SelectInputField 
               title={t('donation_report.fund_category')} 
               options={fundTypes}
               value={selectedFundType}
               onChange={(val) => setSelectedFundType(val)}
            />
          </div>
          <div>
            <SelectInputField 
               title={t('common.month')} 
               options={months}
               value={selectedMonth}
               onChange={(val) => setSelectedMonth(val)}
            />
          </div>
          <button className="bg-[#00bd7f] text-white h-[48px] rounded-xl text-xs font-black tracking-widest shadow-lg shadow-emerald-100 hover:scale-[1.02] active:scale-[0.98] transition-all flex items-center justify-center gap-2 mb-0.5">
            <Filter className="w-4 h-4" /> {t('donation_report.apply_filters')}
          </button>
        </div>

        {/* Table/List View */}
        <div className="bg-white shadow-2xl rounded-[32px] border border-slate-100 overflow-hidden">
          <div className="p-8 border-b border-slate-50 flex justify-between items-center">
             <h3 className="text-xl font-black text-slate-900 flex items-center gap-3">
               <ClipboardList className="w-6 h-6 text-[#00bd7f]" />
               {t('donation_report.records_title')}
             </h3>
             <div className="flex gap-3">
                <button className="flex items-center gap-2 px-5 py-2.5 bg-slate-50 text-slate-600 rounded-xl text-xs font-black hover:bg-slate-100 transition-all border border-slate-100">
                   <Printer className="w-4 h-4" /> {t('donation_report.print_all')}
                </button>
                <button className="flex items-center gap-2 px-5 py-2.5 bg-emerald-50 text-[#00bd7f] rounded-xl text-xs font-black hover:bg-emerald-100 transition-all border border-emerald-100">
                   <Download className="w-4 h-4" /> {t('donation_report.export_excel')}
                </button>
             </div>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="bg-slate-50/50">
                  <th className="px-8 py-5 text-left text-[11px] font-black text-slate-400 uppercase tracking-widest">{t('donation_report.donor_info')}</th>
                  <th className="px-8 py-5 text-center text-[11px] font-black text-slate-400 uppercase tracking-widest">{t('donation_report.fund_category')}</th>
                  <th className="px-8 py-5 text-center text-[11px] font-black text-slate-400 uppercase tracking-widest">{t('donation_report.date_method')}</th>
                  <th className="px-8 py-5 text-center text-[11px] font-black text-slate-400 uppercase tracking-widest">{t('income_expense_report.amount')}</th>
                  <th className="px-8 py-5 text-right text-[11px] font-black text-slate-400 uppercase tracking-widest">{t('salary_report.action')}</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-50">
                {filteredDonations.length > 0 ? filteredDonations.map((donation, idx) => (
                  <tr key={idx} className="hover:bg-slate-50/30 transition-all duration-300 group">
                    <td className="px-8 py-6">
                      <div className="flex items-center gap-4">
                        <div className="w-10 h-10 bg-rose-50 text-rose-500 rounded-lg flex items-center justify-center font-black">
                          {donation.donorName.charAt(0)}
                        </div>
                        <div>
                          <p className="text-sm font-black text-slate-800 group-hover:text-rose-500 transition-colors">{donation.donorName}</p>
                          <p className="text-[10px] font-bold text-slate-400 uppercase mt-0.5">RCP # {donation.receiptNo}</p>
                        </div>
                      </div>
                    </td>
                    <td className="px-8 py-6 text-center">
                      <span className="px-4 py-1.5 bg-slate-50 text-slate-600 rounded-full text-[10px] font-black border border-slate-100 uppercase tracking-wide">
                        {getFundLabel(donation.fundType)}
                      </span>
                    </td>
                    <td className="px-8 py-6 text-center">
                       <p className="text-sm font-bold text-slate-700">{donation.date}</p>
                       <p className="text-[10px] font-black text-slate-400 uppercase mt-0.5">{getMethodLabel(donation.paymentMethod)}</p>
                    </td>
                    <td className="px-8 py-6 text-center">
                      <p className="text-lg font-black text-[#00bd7f]">৳ {donation.amount.toLocaleString()}</p>
                    </td>
                    <td className="px-8 py-6">
                      <div className="flex justify-end gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                         <button title="Print Receipt" className="p-2.5 hover:bg-slate-100 rounded-lg text-slate-400 hover:text-[#00bd7f] border border-slate-100 shadow-sm"><Printer className="w-4 h-4" /></button>
                         <button title="View Details" className="p-2.5 hover:bg-slate-100 rounded-lg text-slate-400 hover:text-rose-500 border border-slate-100 shadow-sm"><MoreHorizontal className="w-4 h-4" /></button>
                      </div>
                    </td>
                  </tr>
                )) : (
                  <tr>
                    <td colSpan="5" className="py-20 text-center">
                       <div className="w-16 h-16 bg-slate-50 rounded-full flex items-center justify-center mx-auto mb-4 text-slate-200">
                          <Search className="w-8 h-8" />
                       </div>
                       <p className="text-slate-400 font-bold uppercase tracking-widest text-xs">{t('donation_report.no_donations')}</p>
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>
      </div>

      {/* Decorative Blur Overlays */}
      <div className="fixed top-[20%] left-[-5%] w-[350px] h-[350px] bg-rose-500/5 rounded-full blur-[100px] z-0 pointer-events-none"></div>
      <div className="fixed bottom-[10%] right-[-5%] w-[350px] h-[350px] bg-[#00bd7f]/5 rounded-full blur-[100px] z-0 pointer-events-none"></div>
    </div>
  );
};

export default DonationReport;
