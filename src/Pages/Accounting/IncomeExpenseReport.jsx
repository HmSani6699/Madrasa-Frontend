import { useState, useMemo } from "react";
import { 
  FileText, 
  Search, 
  Filter, 
  Printer, 
  Download, 
  Calendar,
  ChevronDown,
  ArrowUpRight,
  ArrowDownRight,
  TrendingUp,
  TrendingDown,
  PieChart,
  Activity,
  ArrowRight,
  LayoutGrid,
  List
} from "lucide-react";
import { useTranslation } from "react-i18next";
import SelectInputField from "../../components/SelectInputField";
import InputField from "../../components/InputField";

/**
 * Premium Income & Expense Report
 * Features: High-level analyticsCards, detailed transaction list, category filtering.
 */

const IncomeExpenseReport = () => {
  const { t } = useTranslation();
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("All");
  const [selectedType, setSelectedType] = useState("All");
  const [selectedMonth, setSelectedMonth] = useState("All");

  // Mock Data
  const TRANSACTIONS = useMemo(() => [
    { id: "TX-1001", date: "2025-01-05", category: "tuition", type: "income", amount: 125000, description: "Monthly fees collection", month: "january" },
    { id: "TX-1002", date: "2025-01-08", category: "salaries", type: "expense", amount: 85000, description: "Staff January payroll", month: "january" },
    { id: "TX-1003", date: "2025-01-12", category: "donation", type: "income", amount: 50000, description: "Building fund donation", month: "january" },
    { id: "TX-1004", date: "2025-01-15", category: "maintenance", type: "expense", amount: 12000, description: "Roof repair work", month: "january" },
    { id: "TX-1005", date: "2025-01-20", category: "utility", type: "expense", amount: 8000, description: "Electricity & Water bill", month: "january" },
    { id: "TX-1006", date: "2025-02-02", category: "tuition", type: "income", amount: 95000, description: "Partial collection", month: "february" },
    { id: "TX-1007", date: "2025-02-05", category: "food_ration", type: "expense", amount: 35000, description: "Hostel kitchen supply", month: "february" },
  ], []);

  const getCategoryLabel = (cat) => {
    if (cat === "All") return t('common.all');
    // Try income categories first
    let key = `income_page.categories.${cat}`;
    let label = t(key);
    if (label !== key) return label;
    // Try expense categories
    key = `expense_page.categories.${cat}`;
    label = t(key);
    if (label !== key) return label;
    return cat;
  };

  const getTypeLabel = (type) => {
    if (type === "All") return t('common.all');
    return t(`income_expense_report.types.${type.toLowerCase()}`);
  };

  const getMonthLabel = (month) => {
    if (month === "All") return t('common.all');
    return t(`common.months.${month.toLowerCase()}`);
  };

  const categories = [
    { value: "All" }, 
    { value: "tuition" }, 
    { value: "salaries" }, 
    { value: "donation" }, 
    { value: "maintenance" }, 
    { value: "utility" }, 
    { value: "food_ration" }
  ].map(c => ({ ...c, label: getCategoryLabel(c.value) }));

  const types = [
    { value: "All" }, 
    { value: "income" }, 
    { value: "expense" }
  ].map(tObj => ({ ...tObj, label: getTypeLabel(tObj.value) }));

  const months = [
    { value: "All" }, 
    { value: "january" }, 
    { value: "february" }, 
    { value: "march" }
  ].map(m => ({ ...m, label: getMonthLabel(m.value) }));

  // Filtering Logic
  const filteredTransactions = useMemo(() => {
    return TRANSACTIONS.filter(tx => {
      const matchesSearch = tx.description.toLowerCase().includes(searchTerm.toLowerCase()) || 
                           tx.id.toLowerCase().includes(searchTerm.toLowerCase());
      const matchesCategory = selectedCategory === "All" || tx.category === selectedCategory;
      const matchesType = selectedType === "All" || tx.type === selectedType;
      const matchesMonth = selectedMonth === "All" || tx.month === selectedMonth;
      return matchesSearch && matchesCategory && matchesType && matchesMonth;
    });
  }, [searchTerm, selectedCategory, selectedType, selectedMonth, TRANSACTIONS]);

  const stats = useMemo(() => {
    const income = filteredTransactions.filter(tx => tx.type === "income").reduce((acc, curr) => acc + curr.amount, 0);
    const expense = filteredTransactions.filter(tx => tx.type === "expense").reduce((acc, curr) => acc + curr.amount, 0);
    return { income, expense, balance: income - expense };
  }, [filteredTransactions]);

  return (
    <div className="min-h-screen bg-[#F8FAFC] text-slate-800 font-outfit relative overflow-hidden">
      {/* Background Blurs */}
      <div className="absolute top-[-10%] right-[-10%] w-[40%] h-[40%] bg-blue-500/5 rounded-full blur-[120px] pointer-events-none"></div>
      <div className="absolute bottom-[-10%] left-[-10%] w-[35%] h-[35%] bg-[#00bd7f]/5 rounded-full blur-[100px] pointer-events-none"></div>

      <div className="max-w-[1500px] mx-auto p-4 md:p-10 relative z-10 space-y-10">
        
        {/* Header Section */}
        <div className="flex flex-col lg:flex-row justify-between items-start lg:items-center gap-6">
          <div className="space-y-1">
            <h1 className="text-4xl font-black tracking-tight text-slate-900 leading-tight">
              {t('income_expense_report.title')}
            </h1>
            <p className="text-slate-500 font-medium tracking-wide">
              {t('income_expense_report.subtitle')}
            </p>
          </div>
          
          <div className="flex gap-3">
             <button className="flex items-center gap-2 px-6 py-3 bg-white text-slate-600 rounded-2xl text-[13px] font-black shadow-lg shadow-slate-200/50 border border-slate-100 hover:bg-slate-50 transition-all">
               <Printer className="w-4 h-4" /> {t('income_expense_report.print_statement')}
             </button>
             <button className="flex items-center gap-2 px-6 py-3 bg-[#00bd7f] text-white rounded-2xl text-[13px] font-black shadow-lg shadow-emerald-200/50 hover:scale-[1.02] active:scale-[0.98] transition-all">
               <Download className="w-4 h-4" /> {t('income_expense_report.export_report')}
             </button>
          </div>
        </div>

        {/* Analytics Summary */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
           <div className="bg-white/60 backdrop-blur-xl border border-white p-8 rounded-[32px] shadow-xl relative overflow-hidden group">
              <div className="absolute top-0 right-0 p-8 text-[#00bd7f]/10 group-hover:scale-110 transition-transform duration-500">
                <TrendingUp className="w-20 h-20" />
              </div>
              <p className="text-[11px] font-black text-slate-400 uppercase tracking-widest mb-2">{t('income_expense_report.total_income')}</p>
              <h2 className="text-4xl font-black text-slate-900 mb-4">৳ {stats.income.toLocaleString()}</h2>
              <div className="flex items-center gap-2 text-[#00bd7f] text-xs font-bold">
                 <div className="w-6 h-6 bg-emerald-100 rounded-full flex items-center justify-center">
                    <ArrowUpRight className="w-4 h-4" />
                 </div>
                 <span>{t('income_expense_report.from_sources')}</span>
              </div>
           </div>

           <div className="bg-white/60 backdrop-blur-xl border border-white p-8 rounded-[32px] shadow-xl relative overflow-hidden group">
              <div className="absolute top-0 right-0 p-8 text-rose-500/10 group-hover:scale-110 transition-transform duration-500">
                <TrendingDown className="w-20 h-20" />
              </div>
              <p className="text-[11px] font-black text-slate-400 uppercase tracking-widest mb-2">{t('income_expense_report.total_expense')}</p>
              <h2 className="text-4xl font-black text-slate-900 mb-4">৳ {stats.expense.toLocaleString()}</h2>
              <div className="flex items-center gap-2 text-rose-500 text-xs font-bold">
                 <div className="w-6 h-6 bg-rose-100 rounded-full flex items-center justify-center">
                    <ArrowDownRight className="w-4 h-4" />
                 </div>
                 <span>{t('income_expense_report.operational_costs')}</span>
              </div>
           </div>

           <div className={`p-8 rounded-[32px] shadow-xl relative overflow-hidden group border transition-all duration-500 ${stats.balance >= 0 ? "bg-[#00bd7f] text-white border-white/20" : "bg-slate-900 text-white border-slate-800"}`}>
              <div className="absolute top-0 right-0 p-8 text-white/10 group-hover:scale-110 transition-transform duration-500">
                <Activity className="w-20 h-20" />
              </div>
              <p className="text-[11px] font-bold text-white/60 uppercase tracking-widest mb-2">{t('income_expense_report.net_balance')}</p>
              <h2 className="text-4xl font-black mb-4">৳ {Math.abs(stats.balance).toLocaleString()}</h2>
              <div className="flex items-center gap-2 text-white/80 text-xs font-bold font-outfit">
                 <div className="w-6 h-6 bg-white/20 rounded-full flex items-center justify-center">
                    <PieChart className="w-4 h-4" />
                 </div>
                 <span>{stats.balance >= 0 ? t('income_expense_report.surplus') : t('income_expense_report.deficit')}</span>
              </div>
           </div>
        </div>

        {/* Filter Bar */}
        <div className="bg-white/70 backdrop-blur-xl border border-white/40 p-4 rounded-[28px] shadow-[0_30px_60px_rgba(0,0,0,0.04)] grid grid-cols-1 md:grid-cols-5 gap-6 items-end">
           <div className="md:col-span-2">
              <InputField 
                 title={t('income_expense_report.filter_desc')} 
                 placeholder={t('income_expense_report.filter_placeholder')}
                 value={searchTerm}
                 onChange={(e) => setSearchTerm(e.target.value)}
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
           <div>
              <SelectInputField 
                 title={t('income_expense_report.category')} 
                 options={categories}
                 value={selectedCategory}
                 onChange={(val) => setSelectedCategory(val)}
              />
           </div>
           <div>
              <SelectInputField 
                 title={t('income_expense_report.type')} 
                 options={types}
                 value={selectedType}
                 onChange={(val) => setSelectedType(val)}
              />
           </div>
        </div>

        {/* Transactions Table */}
        <div className="bg-white rounded-[32px] shadow-xl border border-slate-100/50 overflow-hidden">
           <div className="p-8 border-b border-slate-50 flex justify-between items-center">
              <div className="flex items-center gap-3">
                 <div className="w-10 h-10 bg-slate-100 rounded-xl flex items-center justify-center">
                    <List className="w-5 h-5 text-slate-500" />
                 </div>
                 <h3 className="text-xl font-black text-slate-900 tracking-tight">{t('income_expense_report.recent_transactions')}</h3>
              </div>
              <div className="text-xs font-bold text-slate-400 uppercase tracking-widest">
                {t('common.showing')} {filteredTransactions.length} {t('common.records')}
              </div>
           </div>

           <div className="overflow-x-auto">
             <table className="w-full">
                <thead>
                   <tr className="bg-slate-50/50">
                      <th className="px-8 py-5 text-left text-[11px] font-black text-slate-400 uppercase tracking-widest">{t('income_expense_report.date_id')}</th>
                      <th className="px-8 py-5 text-left text-[11px] font-black text-slate-400 uppercase tracking-widest">{t('income_expense_report.category')}</th>
                      <th className="px-8 py-5 text-left text-[11px] font-black text-slate-400 uppercase tracking-widest">{t('income_expense_report.description')}</th>
                      <th className="px-8 py-5 text-center text-[11px] font-black text-slate-400 uppercase tracking-widest">{t('income_expense_report.type')}</th>
                      <th className="px-8 py-5 text-right text-[11px] font-black text-slate-400 uppercase tracking-widest">{t('income_expense_report.amount')}</th>
                   </tr>
                </thead>
                <tbody className="divide-y divide-slate-50">
                   {filteredTransactions.length > 0 ? filteredTransactions.map((tx, idx) => (
                      <tr key={idx} className="hover:bg-slate-50/50 transition-all duration-300 group">
                         <td className="px-8 py-6">
                            <p className="text-sm font-black text-slate-800">{tx.date}</p>
                            <p className="text-[10px] font-bold text-slate-400 uppercase mt-0.5">{tx.id}</p>
                         </td>
                         <td className="px-8 py-6">
                            <span className="px-3 py-1.5 bg-slate-50 text-slate-600 rounded-lg text-[10px] font-black border border-slate-100 uppercase tracking-wide">
                               {getCategoryLabel(tx.category)}
                            </span>
                         </td>
                         <td className="px-8 py-6">
                            <p className="text-sm font-medium text-slate-700 max-w-xs">{tx.description}</p>
                         </td>
                         <td className="px-8 py-6 text-center">
                            <div className={`px-4 py-1.5 rounded-full text-[10px] font-black uppercase inline-flex items-center gap-2 ${tx.type === "income" ? "bg-emerald-50 text-emerald-600" : "bg-rose-50 text-rose-500"}`}>
                               <div className={`w-1.5 h-1.5 rounded-full ${tx.type === "income" ? "bg-emerald-500 animate-pulse" : "bg-rose-500"}`} />
                               {getTypeLabel(tx.type)}
                            </div>
                         </td>
                         <td className="px-8 py-6 text-right">
                            <p className={`text-lg font-black ${tx.type === "income" ? "text-emerald-600" : "text-rose-500"}`}>
                               {tx.type === "income" ? "+" : "-"} ৳ {tx.amount.toLocaleString()}
                            </p>
                         </td>
                      </tr>
                   )) : (
                      <tr>
                         <td colSpan="5" className="py-24 text-center">
                            <div className="w-16 h-16 bg-slate-50 rounded-full flex items-center justify-center mx-auto mb-4 text-slate-200">
                               <Search className="w-8 h-8" />
                            </div>
                            <h4 className="text-lg font-black text-slate-400 uppercase tracking-tighter">{t('common.no_records')}</h4>
                         </td>
                      </tr>
                   )}
                </tbody>
             </table>
           </div>
        </div>
      </div>

      {/* Background Ornaments */}
      <div className="fixed top-[-5%] left-[-5%] w-[450px] h-[450px] bg-[#00bd7f]/5 rounded-full blur-[100px] z-0 pointer-events-none"></div>
      <div className="fixed bottom-[-5%] right-[-5%] w-[450px] h-[450px] bg-blue-500/5 rounded-full blur-[100px] z-0 pointer-events-none"></div>
    </div>
  );
};

export default IncomeExpenseReport;
