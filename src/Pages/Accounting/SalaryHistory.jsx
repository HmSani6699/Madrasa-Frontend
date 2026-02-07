import { useState, useMemo } from "react";
import { 
  Receipt, 
  Search, 
  Filter, 
  Download, 
  Users, 
  Calendar,
  MoreVertical,
  Printer,
  ChevronRight,
  TrendingUp,
  CreditCard,
  Building2,
  FileCheck,
  ArrowUpRight,
  FilterX,
  History,
  CheckCircle2
} from "lucide-react";
import InputField from "../../components/InputField";
import SelectInputField from "../../components/SelectInputField";

/**
 * SalaryHistory Component
 * A robust dashboard for tracking historical payroll disbursements and employee payments.
 */
const SalaryHistory = () => {
  const { t } = useTranslation();
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedMonth, setSelectedMonth] = useState("all");
  const [selectedDept, setSelectedDept] = useState("all");

  // Mock data for salary history
  const [salaryRecords] = useState([
    { id: "PAY-101", employee: "Maulana Abdur Rahman", designation: "Head Teacher", department: "Hifz", salary: 25000, bonus: 2000, net: 27000, month: "january", status: "paid", date: "2026-01-05", method: "Bank Transfer" },
    { id: "PAY-102", employee: "Hafiz Abu Bakr", designation: "Assistant Teacher", department: "Hifz", salary: 18000, bonus: 1000, net: 19000, month: "january", status: "paid", date: "2026-01-05", method: "Cash" },
    { id: "PAY-103", employee: "Ustadha Fatimah", designation: "Senior Instructor", department: "Nursery", salary: 15000, bonus: 500, net: 15500, month: "january", status: "paid", date: "2026-01-06", method: "bKash" },
    { id: "PAY-098", employee: "Ahmed Ullah", designation: "Office Admin", department: "Admin", salary: 20000, bonus: 0, net: 20000, month: "december", status: "paid", date: "2025-12-04", method: "Bank Transfer" },
    { id: "PAY-099", employee: "Zayd Ibn Harith", designation: "Security Guard", department: "Admin", salary: 8000, bonus: 500, net: 8500, month: "december", status: "paid", date: "2025-12-05", method: "Cash" },
    { id: "PAY-105", employee: "Mustafa Kamal", designation: "English Teacher", department: "Secondary", salary: 22000, bonus: 1500, net: 23500, month: "january", status: "paid", date: "2026-01-07", method: "Bank Transfer" },
  ]);

  // Derived state for filtering
  const filteredRecords = useMemo(() => {
    return salaryRecords.filter(record => {
      const matchesSearch = record.employee.toLowerCase().includes(searchTerm.toLowerCase()) || 
                           record.id.toLowerCase().includes(searchTerm.toLowerCase());
      const matchesMonth = selectedMonth === "all" || record.month.toLowerCase() === selectedMonth.toLowerCase();
      const matchesDept = selectedDept === "all" || record.department.toLowerCase() === selectedDept.toLowerCase();

      return matchesSearch && matchesMonth && matchesDept;
    });
  }, [salaryRecords, searchTerm, selectedMonth, selectedDept]);

  // Dynamic Statistics
  const stats = useMemo(() => {
    const totalDisbursed = filteredRecords.reduce((acc, curr) => acc + curr.net, 0);
    const avgSalary = totalDisbursed / (filteredRecords.length || 1);
    const totalBonus = filteredRecords.reduce((acc, curr) => acc + (curr.bonus || 0), 0);

    return [
      { label: t('salary_history.total_disbursed'), value: `৳ ${totalDisbursed.toLocaleString()}`, icon: Receipt, color: "blue", trend: t('salary_history.processed_in_view') },
      { label: t('salary_history.employees_paid'), value: filteredRecords.length.toString(), icon: Users, color: "emerald", trend: t('salary_history.full_collection') },
      { label: t('salary_history.total_bonuses'), value: `৳ ${totalBonus.toLocaleString()}`, icon: TrendingUp, color: "amber", trend: t('salary_history.performance_pay') },
      { label: t('salary_history.net_average'), value: `৳ ${Math.round(avgSalary).toLocaleString()}`, icon: CreditCard, color: "indigo", trend: t('salary_history.per_employee') },
    ];
  }, [filteredRecords, t]);

  const translateMonth = (month) => {
    return t(`common.months.${month.toLowerCase()}`);
  };

  const translateStatus = (status) => {
    return t(`salary_report.statuses.${status.toLowerCase()}`);
  };

  return (
    <div className="min-h-screen bg-slate-50/50 p-4 md:p-8 animate-in fade-in duration-500">
      <div className="max-w-[1600px] mx-auto space-y-8">
        
        {/* Header Section */}
        <div className="bg-white rounded-[2rem] md:rounded-[20px] border border-slate-200 p-6 md:p-8 shadow-sm flex flex-col lg:flex-row justify-between items-start lg:items-center gap-6">
          <div className="flex items-center gap-4 md:gap-6">
            <div className="w-12 h-12 md:w-16 md:h-16 bg-blue-50 rounded-xl md:rounded-2xl flex items-center justify-center border border-blue-100 shadow-inner shrink-0 text-blue-600">
              <History className="w-6 h-6 md:w-8 md:h-8" />
            </div>
            <div>
              <h1 className="text-xl md:text-3xl font-black text-slate-800 tracking-tight  leading-none">{t('salary_history.title')}</h1>
           
            </div>
          </div>

          <button
        
          className="px-8 py-3 bg-primary text-white font-bold rounded-xl shadow-lg shadow-primary/20 hover:scale-[1.02] active:scale-[0.98] transition-all w-full md:w-auto cursor-pointer"
        >
          {t('salary_history.pay_salary')}
        </button>
        </div>

        {/* Statistics Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 md:gap-6">
          {stats.map((stat) => (
            <div key={stat.label} className="bg-white rounded-[1.5rem] md:rounded-[2rem] border border-slate-200 p-5 md:p-6 shadow-sm group hover:border-blue-200 transition-all">
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
          <div className="p-5 md:p-5 border-b border-slate-50 bg-slate-50/20 flex flex-col xl:flex-row justify-between items-start xl:items-center gap-6 md:gap-8">
            <div className="flex-1 w-full space-y-4">
               <div className="flex items-center gap-3">
                  <h2 className="text-xl md:text-2xl font-black text-slate-800 tracking-tight ">{t('salary_history.payment_logs')}</h2>
                  <div className="px-2 py-0.5 md:px-3 md:py-1 bg-blue-100 text-blue-600 rounded-lg text-[9px] md:text-[10px] font-black uppercase tracking-widest border border-blue-200">
                    {t('salary_history.verified')}
                  </div>
               </div>
               
               <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-3 md:gap-4">
                  <InputField title={t('salary_history.employee_id_num')} placeholder={t('salary_history.employee_id_num')}/>
                <SelectInputField title={t('common.month')} options={[
                    {value: "all", label: t('common.all')},
                    {value: "january", label: t('common.months.january')},
                    {value: "february", label: t('common.months.february')},
                    {value: "march", label: t('common.months.march')},
                    {value: "april", label: t('common.months.april')},
                    {value: "may", label: t('common.months.may')},
                    {value: "june", label: t('common.months.june')},
                    {value: "july", label: t('common.months.july')},
                    {value: "august", label: t('common.months.august')},
                    {value: "september", label: t('common.months.september')},
                    {value: "october", label: t('common.months.october')},
                    {value: "november", label: t('common.months.november')},
                    {value: "december", label: t('common.months.december')}
                  ]}
                  value={selectedMonth}
                  onChange={(val) => setSelectedMonth(val)}
                />
                <SelectInputField title={t('common.class')} options={[
                    {value: "all", label: t('common.all')},
                    {value: "hifz", label: "Hifz"},
                    {value: "nursery", label: "Nursery"},
                    {value: "admin", label: "Admin"},
                    {value: "secondary", label: "Secondary"}
                  ]}
                  value={selectedDept}
                  onChange={(val) => setSelectedDept(val)}
                />
                 <button 
              onClick={() => {setSearchTerm(""); setSelectedMonth("all"); setSelectedDept("all");}}
              className="px-6 py-3 bg-primary text-white rounded-xl  font-black  tracking-widest  transition-all shadow-xl shadow-slate-200 flex items-center justify-center gap-2 w-full xl:w-auto mt-7"
            >
              <FilterX className="w-4 h-4" />
              {t('common.filter')}
            </button>
              </div>
              
            </div>
            
           
          </div>

          <div className="overflow-x-auto scrollbar-thin scrollbar-thumb-slate-200">
            <table className="w-full border-collapse min-w-[1100px]">
              <thead>
                <tr className="border-b border-slate-50 text-[10px] font-black text-slate-400 uppercase tracking-widest bg-slate-50/10 whitespace-nowrap">
                  <th className="px-6 md:px-8 py-4 md:py-6 text-left whitespace-nowrap">{t('salary_history.employee_info')}</th>
                  <th className="px-6 md:px-8 py-4 md:py-6 text-center whitespace-nowrap">{t('common.month')}</th>
                  <th className="px-6 md:px-8 py-4 md:py-6 text-center whitespace-nowrap">{t('salary_history.govt_salary')}</th>
                  <th className="px-6 md:px-8 py-4 md:py-6 text-center whitespace-nowrap">{t('salary_history.bonus_extra')}</th>
                  <th className="px-6 md:px-8 py-4 md:py-6 text-center whitespace-nowrap">{t('salary_report.net_amount')}</th>
                  <th className="px-6 md:px-8 py-4 md:py-6 text-center whitespace-nowrap">{t('common.status')}</th>
                  <th className="px-6 md:px-8 py-4 md:py-6 text-right">{t('common.actions')}</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-50">
                {filteredRecords.length > 0 ? (
                  filteredRecords.map((record) => (
                  <tr key={record.id} className="group hover:bg-slate-50/50 transition-all whitespace-nowrap">
                    <td className="px-6 md:px-8 py-4 md:py-6">
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 md:w-12 md:h-12 bg-slate-100 rounded-[0.75rem] md:rounded-[1rem] flex items-center justify-center font-black text-slate-400 group-hover:bg-blue-50 group-hover:text-blue-600 transition-all shrink-0">
                          {record.employee.split(' ').map(n => n[0]).join('')}
                        </div>
                        <div className="min-w-0">
                          <p className="text-sm font-black text-slate-800 uppercase tracking-tight truncate">{record.employee}</p>
                          <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">{record.designation} • {record.department}</p>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 md:px-8 py-4 md:py-6 text-center">
                       <div className="inline-flex items-center gap-1.5 px-3 py-1 bg-slate-50 rounded-lg border border-slate-100 text-[10px] font-black text-slate-600 uppercase">
                         <Calendar className="w-3 h-3 text-slate-400" />
                         {translateMonth(record.month)}
                      </div>
                    </td>
                    <td className="px-6 md:px-8 py-4 md:py-6 text-center">
                       <span className="text-sm font-bold text-slate-600">৳ {record.salary.toLocaleString()}</span>
                    </td>
                    <td className="px-6 md:px-8 py-4 md:py-6 text-center">
                       <span className="text-sm font-bold text-emerald-600">+{record.bonus.toLocaleString()}</span>
                    </td>
                    <td className="px-6 md:px-8 py-4 md:py-6 text-center">
                      <span className="text-base font-black text-slate-800 group-hover:text-blue-600 transition-colors">৳ {record.net.toLocaleString()}</span>
                    </td>
                    <td className="px-6 md:px-8 py-4 md:py-6 text-center">
                      <div className="inline-flex items-center gap-1.5 px-3 py-1 bg-emerald-50 text-emerald-600 border border-emerald-100 rounded-full text-[9px] font-black uppercase tracking-widest">
                         <CheckCircle2 className="w-3 h-3" />
                         {translateStatus(record.status)}
                      </div>
                    </td>
                    <td className="px-6 md:px-8 py-4 md:py-6 text-right">
                      <div className="flex justify-end gap-1.5">
                        <button className="p-2 bg-slate-50 text-slate-400 rounded-lg border border-slate-100 hover:bg-slate-900 hover:text-white transition-all shadow-sm group/payslip" title={t('salary_history.download_payslip')}>
                          <Download className="w-4 h-4" />
                        </button>
                        <button className="p-2 bg-blue-50 text-blue-600 rounded-lg border border-blue-100 hover:bg-blue-600 hover:text-white transition-all shadow-sm">
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
                          <p className="text-slate-400 font-bold uppercase tracking-widest text-xs">{t('salary_history.no_records')}</p>
                       </div>
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>

          <div className="p-6 md:p-8 bg-slate-50/50 flex flex-col md:flex-row justify-between items-center border-t border-slate-100 gap-6">
            <p className="text-[10px] font-black uppercase tracking-widest text-slate-400">
              {t('salary_history.showing_entries', { count: filteredRecords.length })}
            </p>
            <div className="flex gap-2 w-full md:w-auto">
              <button className="flex-1 md:flex-none px-6 py-2 bg-white text-slate-600 rounded-xl text-[10px] font-black uppercase tracking-widest border border-slate-200 hover:bg-slate-50 transition-all shadow-sm">{t('common.previous') || 'Previous'}</button>
              <button className="flex-1 md:flex-none px-6 py-2 bg-slate-900 text-white rounded-xl text-[10px] font-black uppercase tracking-widest shadow-xl shadow-slate-200 hover:bg-slate-800 transition-all">{t('common.next') || 'Next'}</button>
            </div>
          </div>
        </div>

       

      </div>
    </div>
  );
};

export default SalaryHistory;
