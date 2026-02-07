import { useState, useMemo } from "react";
import { 
  FileText, 
  Search, 
  Filter, 
  Printer, 
  Download, 
  Users, 
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
  Banknote
} from "lucide-react";
import { useTranslation } from "react-i18next";
import SelectInputField from "../../components/SelectInputField";
import InputField from "../../components/InputField";

/**
 * Premium Salary Report
 * Features: Glassmorphism, Sophisticated HSL palette, Full filtering logic, Grouped layout.
 */

const SalaryReport = () => {
  const { t } = useTranslation();
  const [viewMode, setViewMode] = useState("single");
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedMonth, setSelectedMonth] = useState("All");
  const [selectedStatus, setSelectedStatus] = useState("All");

  // Mock Data
  const ALL_EMPLOYEES = useMemo(() => [
    {
      id: "EMP-2025-001",
      name: "Ahmed Ali",
      designation: "Head Teacher",
      department: "Academic",
      avatar: "AA",
      salaries: [
        { id: "S1", month: "january", basic: 25000, allowance: 5000, deductions: 1000, net: 29000, status: "paid", date: "2025-01-05" },
        { id: "S2", month: "february", basic: 25000, allowance: 5000, deductions: 1000, net: 29000, status: "paid", date: "2025-02-05" },
      ]
    },
    {
      id: "EMP-2025-005",
      name: "Fatima Zahra",
      designation: "Accountant",
      department: "Admin",
      avatar: "FZ",
      salaries: [
        { id: "S3", month: "january", basic: 20000, allowance: 3000, deductions: 500, net: 22500, status: "paid", date: "2025-01-07" },
        { id: "S4", month: "february", basic: 20000, allowance: 3000, deductions: 500, net: 22500, status: "pending", date: "-" },
      ]
    }
  ], []);

  const getMonthLabel = (month) => {
    if (month === "All") return t('common.all');
    return t(`common.months.${month.toLowerCase()}`);
  }

  const getStatusLabel = (status) => {
    if (status === "All") return t('common.all');
    return t(`salary_report.statuses.${status.toLowerCase()}`);
  }

  const months = [
    { value: "All" }, 
    { value: "january" }, 
    { value: "february" }, 
    { value: "march" }
  ].map(m => ({ ...m, label: getMonthLabel(m.value) }));

  const statuses = [
    { value: "All" }, 
    { value: "paid" }, 
    { value: "pending" }
  ].map(s => ({ ...s, label: getStatusLabel(s.value) }));

  // Filtering Logic
  const filteredData = useMemo(() => {
    return ALL_EMPLOYEES.map(emp => {
      const filteredSalaries = emp.salaries.filter(salary => {
        const matchesSearch = emp.name.toLowerCase().includes(searchTerm.toLowerCase()) || 
                             emp.id.toLowerCase().includes(searchTerm.toLowerCase());
        const matchesMonth = selectedMonth === "All" || salary.month === selectedMonth;
        const matchesStatus = selectedStatus === "All" || salary.status === selectedStatus;
        return matchesSearch && matchesMonth && matchesStatus;
      });
      return { ...emp, salaries: filteredSalaries };
    }).filter(emp => emp.salaries.length > 0);
  }, [searchTerm, selectedMonth, selectedStatus, ALL_EMPLOYEES]);

  const getStatusStyle = (status) => {
    switch (status.toLowerCase()) {
      case "paid": return "bg-emerald-50 text-emerald-600 border-emerald-100";
      case "pending": return "bg-amber-50 text-amber-600 border-amber-100";
      default: return "bg-rose-50 text-rose-600 border-rose-100";
    }
  };

  return (
    <div className="min-h-screen bg-[#F8FAFC] text-slate-800 font-outfit relative overflow-hidden">
      {/* Dynamic Background Elements */}
      <div className="absolute top-[-10%] right-[-10%] w-[40%] h-[40%] bg-[#00bd7f]/5 rounded-full blur-[120px] pointer-events-none"></div>
      <div className="absolute bottom-[-10%] left-[-10%] w-[30%] h-[30%] bg-blue-500/5 rounded-full blur-[100px] pointer-events-none"></div>

      <div className="max-w-[1500px] mx-auto p-4 md:p-10 relative z-10 space-y-10">
        
        {/* Header & Mode Toggle */}
        <div className="flex flex-col lg:flex-row justify-between items-start lg:items-center gap-6">
          <div className="space-y-1">
            <h1 className="text-4xl font-black tracking-tight text-slate-900">{t('salary_report.title')}</h1>
            <p className="text-slate-500 font-medium">{t('salary_report.subtitle')}</p>
          </div>

          <div className="bg-white/50 backdrop-blur-md p-1.5 rounded-2xl border border-white shadow-xl flex items-center gap-1">
            <button 
              onClick={() => setViewMode("single")}
              className={`px-6 py-2.5 rounded-xl text-xs font-black transition-all duration-300 flex items-center gap-2 ${viewMode === "single" ? "bg-[#00bd7f] text-white shadow-lg shadow-emerald-200" : "text-slate-500 hover:bg-slate-100"}`}
            >
              <User className="w-4 h-4" /> {t('salary_report.individual_report')}
            </button>
            <button 
              onClick={() => setViewMode("multi")}
              className={`px-6 py-2.5 rounded-xl text-xs font-black transition-all duration-300 flex items-center gap-2 ${viewMode === "multi" ? "bg-[#00bd7f] text-white shadow-lg shadow-emerald-200" : "text-slate-500 hover:bg-slate-100"}`}
            >
              <Users className="w-4 h-4" /> {t('salary_report.multi_staff_view')}
            </button>
          </div>
        </div>

        {/* Filter Bar */}
        <div className="bg-white/70 backdrop-blur-xl border border-white/40 p-4 rounded-[20px] shadow-[0_20px_50px_rgba(0,0,0,0.05)] flex flex-wrap items-end gap-4">
          <div className="flex-1 min-w-[200px]">
             <InputField 
               title={viewMode === "single" ? t('salary_report.staff_id_name') : t('salary_report.search_staff')} 
               placeholder={t('salary_report.enter_id_name')}
               value={searchTerm}
               onChange={(e) => setSearchTerm(e.target.value)}
             />
          </div>
          <div className="w-48">
            <SelectInputField 
              title={t('common.month')} 
              options={months}
              value={selectedMonth}
              onChange={(val) => setSelectedMonth(val)}
            />
          </div>
          <div className="w-48">
            <SelectInputField 
              title={t('common.status')} 
              options={statuses}
              value={selectedStatus}
              onChange={(val) => setSelectedStatus(val)}
            />
          </div>

          <button className="bg-[#00bd7f] text-white px-10 py-3.5 rounded-[12px] text-xs font-black tracking-widest shadow-xl shadow-emerald-100 hover:scale-[1.02] active:scale-[0.98] transition-all mb-1">
            {t('salary_report.generate')}
          </button>
        </div>

        {/* Report Content */}
        <div className="space-y-8">
          {viewMode === "single" ? (
            filteredData.length > 0 ? (
              <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 animate-in slide-in-from-bottom-5 duration-700 bg-white shadow-xl rounded-[24px] p-8 border border-slate-100">
                {/* Profile Section */}
                <div className="lg:border-r border-slate-100 pr-0 lg:pr-8 flex flex-col items-center text-center space-y-6">
                  <div className="w-24 h-24 bg-gradient-to-br from-[#00bd7f] to-emerald-600 rounded-[28px] flex items-center justify-center text-white text-3xl font-black shadow-lg shadow-emerald-200">
                    {filteredData[0]?.avatar}
                  </div>
                  
                  <div>
                    <h3 className="text-2xl font-black text-slate-900 leading-tight">{filteredData[0]?.name}</h3>
                    <p className="text-sm font-bold text-[#00bd7f] uppercase tracking-widest mt-1">{filteredData[0]?.id}</p>
                  </div>

                  <div className="flex flex-wrap justify-center gap-2">
                    <span className="px-4 py-1.5 bg-slate-50 text-slate-600 rounded-full text-[10px] font-black border border-slate-100 uppercase">{filteredData[0]?.designation}</span>
                    <span className="px-4 py-1.5 bg-slate-50 text-slate-600 rounded-full text-[10px] font-black border border-slate-100 uppercase">{filteredData[0]?.department}</span>
                  </div>

                  <div className="w-full h-px bg-slate-100"></div>

                  <div className="grid grid-cols-2 w-full gap-6 text-left">
                    <div className="bg-emerald-50/50 p-4 rounded-2xl border border-emerald-100/50">
                      <p className="text-[10px] font-black text-emerald-600 uppercase mb-1">{t('salary_report.total_paid')}</p>
                      <p className="text-xl font-black text-emerald-700">৳ {filteredData[0]?.salaries.filter(s => s.status === "paid").reduce((acc, curr) => acc + curr.net, 0)}</p>
                    </div>
                    <div className="bg-amber-50/50 p-4 rounded-2xl border border-amber-100/50">
                      <p className="text-[10px] font-black text-amber-600 uppercase mb-1">{t('salary_report.pending')}</p>
                      <p className="text-xl font-black text-amber-700">৳ {filteredData[0]?.salaries.filter(s => s.status === "pending").reduce((acc, curr) => acc + curr.net, 0)}</p>
                    </div>
                  </div>
                </div>

                {/* Table Section */}
                <div className="lg:col-span-2">
                  <div className="overflow-x-auto">
                    <table className="w-full">
                      <thead>
                        <tr className="text-[11px] font-black text-slate-400 uppercase tracking-widest border-b border-slate-100">
                          <th className="px-6 py-4 text-left">{t('salary_report.month_date')}</th>
                          <th className="px-6 py-4 text-center">{t('salary_report.gross_salary')}</th>
                          <th className="px-6 py-4 text-center">{t('salary_report.net_amount')}</th>
                          <th className="px-6 py-4 text-center">{t('common.status')}</th>
                          <th className="px-6 py-4 text-right">{t('salary_report.action')}</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-slate-50">
                        {filteredData[0]?.salaries.map((salary, idx) => (
                          <tr key={idx} className="hover:bg-slate-50/50 transition-all duration-300 group">
                            <td className="px-6 py-5">
                              <span className="text-sm font-black text-slate-800 group-hover:text-[#00bd7f] transition-colors">{getMonthLabel(salary.month)}</span>
                              <p className="text-[10px] font-bold text-slate-400 mt-1 uppercase flex items-center gap-1.5">
                                <Calendar className="w-3 h-3" /> {salary.date}
                              </p>
                            </td>
                            <td className="px-6 py-5 text-center">
                              <p className="text-sm font-black text-slate-900">৳ {salary.basic + salary.allowance}</p>
                              <p className="text-[10px] font-bold text-rose-400">{t('salary_report.deduction_label', { amount: salary.deductions })}</p>
                            </td>
                            <td className="px-6 py-5 text-center text-sm font-black text-[#00bd7f]">৳ {salary.net}</td>
                            <td className="px-6 py-5 text-center">
                              <span className={`px-4 py-1.5 rounded-full text-[10px] font-black uppercase tracking-widest border ${getStatusStyle(salary.status)}`}>
                                {getStatusLabel(salary.status)}
                              </span>
                            </td>
                            <td className="px-6 py-5">
                              <div className="flex justify-end gap-2">
                                <button className="p-2.5 hover:bg-slate-100 rounded-xl transition-all text-slate-400 hover:text-[#00bd7f] border border-slate-100"><Printer className="w-4 h-4" /></button>
                                <button className="p-2.5 hover:bg-slate-100 rounded-xl transition-all text-slate-400 hover:text-[#00bd7f] border border-slate-100"><Download className="w-4 h-4" /></button>
                              </div>
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </div>
              </div>
            ) : (
              <div className="bg-white rounded-[24px] p-20 text-center border-2 border-dashed border-slate-100">
                <div className="w-20 h-20 bg-slate-50 rounded-full flex items-center justify-center mx-auto mb-4">
                  <Search className="w-8 h-8 text-slate-300" />
                </div>
                <h3 className="text-xl font-black text-slate-900">{t('salary_report.no_records')}</h3>
                <p className="text-slate-500">{t('salary_report.adjust_filters')}</p>
              </div>
            )
          ) : (
            <div className="space-y-6">
              {filteredData.map((emp, i) => (
                <div key={i} className="bg-white shadow-lg rounded-[24px] p-6 border border-slate-100 flex flex-col md:flex-row items-center gap-6 animate-in fade-in slide-in-from-bottom-3 duration-500">
                  <div className="w-16 h-16 bg-emerald-50 rounded-2xl flex items-center justify-center text-[#00bd7f] text-xl font-black shrink-0">
                    {emp.avatar}
                  </div>
                  <div className="flex-1 text-center md:text-left">
                    <h4 className="text-lg font-black text-slate-900">{emp.name}</h4>
                    <p className="text-sm font-bold text-slate-400 uppercase tracking-widest">{emp.id} • {emp.designation}</p>
                  </div>
                  <div className="grid grid-cols-2 gap-4 text-center md:text-right px-8 border-x border-slate-100">
                    <div>
                      <p className="text-[10px] font-black text-slate-400 uppercase">{t('salary_report.salaries_paid')}</p>
                      <p className="text-lg font-black text-emerald-600">{emp.salaries.filter(s => s.status === "paid").length}</p>
                    </div>
                    <div>
                      <p className="text-[10px] font-black text-slate-400 uppercase">{t('salary_report.net_paid')}</p>
                      <p className="text-lg font-black text-slate-900">৳ {emp.salaries.filter(s => s.status === "paid").reduce((acc, curr) => acc + curr.net, 0)}</p>
                    </div>
                  </div>
                  <button className="px-6 py-3 bg-slate-50 hover:bg-[#00bd7f] hover:text-white text-slate-600 rounded-xl text-xs font-black transition-all border border-slate-100 flex items-center gap-2">
                    {t('salary_report.view_details')} <ArrowRight className="w-4 h-4" />
                  </button>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* Decorative Blur Overlays */}
      <div className="fixed top-[20%] left-[-5%] w-[300px] h-[300px] bg-[#00bd7f]/10 rounded-full blur-[100px] rotate-45 z-0 pointer-events-none"></div>
      <div className="fixed bottom-[10%] right-[-5%] w-[400px] h-[400px] bg-indigo-500/5 rounded-full blur-[120px] z-0 pointer-events-none"></div>
    </div>
  );
};

export default SalaryReport;
