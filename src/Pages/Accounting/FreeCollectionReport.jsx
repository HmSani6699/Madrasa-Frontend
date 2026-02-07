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
  AlertCircle
} from "lucide-react";
import SelectInputField from "../../components/SelectInputField";
import InputField from "../../components/InputField";

/**
 * Premium Free Collection Report
 * Features: Glassmorphism, Sophisticated HSL palette, Full filtering logic, Grouped layout.
 */

import { useTranslation } from 'react-i18next';

const FreeCollectionReport = () => {
  const { t } = useTranslation();
  const [viewMode, setViewMode] = useState("single");
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedMonth, setSelectedMonth] = useState("All");
  const [selectedFeeTypes, setSelectedFeeTypes] = useState([]);
  const [isFeeDropdownOpen, setIsFeeDropdownOpen] = useState(false);

  // Mock Data
  const ALL_STUDENTS = useMemo(() => [
    {
      id: "ST-2025-001",
      name: "Muhammad Ibrahim",
      class: "Hifz - Class A",
      guardian: "Abdul Karim",
      avatar: "MI",
      fees: [
        { id: "F1", category: t('fee_collection.admission_fee') || "Admission fee", actual: 5000, paid: 2000, due: 3000, status: "Partial", month: t('common.months.january') },
        { id: "F2", category: t('fee_setup.fee_name') || "Monthly fee", actual: 1200, paid: 1200, due: 0, status: "Paid", month: t('common.months.january') },
        { id: "F3", category: t('fee_report.boarding_fee') || "Boding fee", actual: 3000, paid: 0, due: 3000, status: "Unpaid", month: t('common.months.january') },
      ]
    },
    {
      id: "ST-2025-005",
      name: "Abdullah Mahmud",
      class: "Class One",
      guardian: "Zubair Ahmed",
      avatar: "AM",
      fees: [
        { id: "F4", category: t('fee_collection.admission_fee') || "Admission fee", actual: 3000, paid: 3000, due: 0, status: "Paid", month: t('common.months.february') },
        { id: "F5", category: t('fee_setup.fee_name') || "Monthly fee", actual: 1000, paid: 500, due: 500, status: "Partial", month: t('common.months.february') },
      ]
    }
  ], [t]);

  const feeCategories = [{ value: "All", label: t('common.all') || "All" },{ value: "Admission fee", label: t('fee_collection.admission_fee') || "Admission fee" }, { value: "Monthly fee", label: t('fee_setup.fee_name') || "Monthly fee" }, { value: "Boding fee", label: t('fee_report.boarding_fee') || "Boarding fee" }];
  const months = [{ value: "All", label: t('common.all') || "All" }, { value: "January", label: t('common.months.january') }, { value: "February", label: t('common.months.february') }, ];

  // Filtering Logic
  const filteredData = useMemo(() => {
    return ALL_STUDENTS.map(student => {
      const filteredFees = student.fees.filter(fee => {
        const matchesSearch = student.name.toLowerCase().includes(searchTerm.toLowerCase()) || 
                             student.id.toLowerCase().includes(searchTerm.toLowerCase());
        const matchesMonth = selectedMonth === "All" || fee.month === selectedMonth;
        const matchesFeeType = selectedFeeTypes.length === 0 || selectedFeeTypes.includes(fee.category);
        return matchesSearch && matchesMonth && matchesFeeType;
      });
      return { ...student, fees: filteredFees };
    }).filter(student => student.fees.length > 0);
  }, [searchTerm, selectedMonth, selectedFeeTypes, ALL_STUDENTS]);

  const getStatusStyle = (status) => {
    switch (status?.toLowerCase()) {
      case "paid": return "bg-emerald-50 text-emerald-600 border-emerald-100";
      case "partial": return "bg-amber-50 text-amber-600 border-amber-100";
      default: return "bg-rose-50 text-rose-600 border-rose-100";
    }
  };

  const getStatusLabel = (status) => {
     const key = `fee_report.statuses.${status?.toLowerCase()}`;
     const translated = t(key);
     return translated === key ? status : translated;
  };

  return (
    <div className="min-h-screen bg-[#F8FAFC] text-slate-800 font-outfit relative overflow-hidden">
      {/* Dynamic Background Elements */}
      <div className="absolute top-[-10%] right-[-10%] w-[40%] h-[40%] bg-[#00bd7f]/5 rounded-full blur-[120px] pointer-events-none"></div>
      <div className="absolute bottom-[-10%] left-[-10%] w-[30%] h-[30%] bg-blue-500/5 rounded-full blur-[100px] pointer-events-none"></div>

      <div className="max-w-[1500px] mx-auto p-4 md:p-10 relative z-10 space-y-10">
        
        {/* Navigation & Mode Toggle */}
        <div className="flex flex-col lg:flex-row justify-between items-start lg:items-center gap-6">
          <div className="space-y-1">
            <h1 className="text-4xl font-black tracking-tight text-slate-900">{t('fee_report.title')}</h1>
          </div>

          <div className="bg-white/50 backdrop-blur-md p-1.5 rounded-2xl border border-white shadow-xl flex items-center gap-1">
            <button 
              onClick={() => setViewMode("single")}
              className={`px-6 py-2.5 rounded-xl text-xs font-black transition-all duration-300 flex items-center gap-2 ${viewMode === "single" ? "bg-[#00bd7f] text-white shadow-lg shadow-emerald-200" : "text-slate-500 hover:bg-slate-100"}`}
            >
              <User className="w-4 h-4" /> {t('fee_report.single_view')}
            </button>
            <button 
              onClick={() => setViewMode("multi")}
              className={`px-6 py-2.5 rounded-xl text-xs font-black transition-all duration-300 flex items-center gap-2 ${viewMode === "multi" ? "bg-[#00bd7f] text-white shadow-lg shadow-emerald-200" : "text-slate-500 hover:bg-slate-100"}`}
            >
              <Users className="w-4 h-4" /> {t('fee_report.multiple_view')}
            </button>
          </div>
        </div>

        {/* Premium Filter Bar (Glassmorphism) */}

        {viewMode === "single" ? <div className="bg-white/70 backdrop-blur-xl border border-white/40 p-3 rounded-[20px] shadow-[0_20px_50px_rgba(0,0,0,0.05)] flex  items-center gap-4 ">
          
         <InputField title={t('fee_report.student_id')} placeholder={t('fee_report.student_id')}/>
           <SelectInputField title={t('common.date') || 'Date'} options={months}/>
          <SelectInputField title={t('fee_report.fee_type')} options={feeCategories}/>

          <button className="bg-[#00bd7f] text-white px-10 py-3.5 rounded-[10px] text-xs font-black  tracking-widest shadow-xl shadow-emerald-100 hover:scale-[1.02] active:scale-[0.98] transition-all mt-5.5">
            {t('student_academic_report_page.filter')}
          </button>
        </div> : <div className="bg-white/70 backdrop-blur-xl border border-white/40 p-3 rounded-[20px] shadow-[0_20px_50px_rgba(0,0,0,0.05)] flex  items-center gap-4">
            <SelectInputField title={t('student_academic_report_page.class')} options={[
            {value:"One", label: t('student_academic_report_page.class') + " One"}
          ]} />
          <SelectInputField title={t('common.date') || 'Date'} options={months} />
            <SelectInputField title={t('fee_report.fee_type')} options={feeCategories} />
          <button className="bg-[#00bd7f] text-white px-10 py-3.5 rounded-[10px] text-xs font-black  tracking-widest shadow-xl shadow-emerald-100 hover:scale-[1.02] active:scale-[0.98] transition-all mt-5.5">
            {t('student_academic_report_page.filter')}
          </button>
        </div> }
        

        {/* View Content */}
        {viewMode === "single" && filteredData.length > 0 && (
         <div className="grid grid-cols-1 lg:grid-cols-3 gap-5 animate-in slide-in-from-bottom-5 duration-700 bg-white shadow-xl rounded-[20px] p-5">
             {/* Profile Card */}
            <div className="space-y-4 flex flex-col items-center text-center border-r-2 border-emerald-600">
             
                <div className="w-[70px] h-[70px] bg-[#00bd7f] rounded-[20px] flex items-center justify-center   ">
                  
              </div>
              
              <div>
                <h3 className="text-2xl font-black text-slate-900  whitespace-nowrap">{filteredData[0]?.name}</h3>
                <p className="text-sm font-bold text-slate-400 uppercase tracking-widest mb-4">{filteredData[0]?.id}</p>
                <div className="flex flex-wrap justify-center gap-2">
                  <span className="px-4 py-1.5 bg-slate-50 text-slate-600 rounded-full text-[10px] font-black border border-slate-100 uppercase">{filteredData[0]?.class}</span>
                  <span className="px-4 py-1.5 bg-slate-50 text-slate-600 rounded-full text-[10px] font-black border border-slate-100 uppercase">{filteredData[0]?.guardian}</span>
                </div>
              </div>
              <div className="w-full h-px bg-slate-100"></div>
              <div className="grid grid-cols-2 w-full gap-4 text-left">
                <div>
                  <p className="text-[10px] font-black text-slate-400 uppercase mb-1">{t('fee_report.total_paid')}</p>
                  <p className="text-lg font-black text-emerald-500">৳ {filteredData[0]?.fees.reduce((acc, curr) => acc + curr.paid, 0)}</p>
                </div>
                <div>
                  <p className="text-[10px] font-black text-slate-400 uppercase mb-1">{t('fee_report.total_due')}</p>
                  <p className="text-lg font-black text-rose-500">৳ {filteredData[0]?.fees.reduce((acc, curr) => acc + curr.due, 0)}</p>
                </div>
                
              </div>
            </div>

            {/* Table in Single View */}
            <div className="lg:col-span-2 bg-white   overflow-hidden self-start">
              
               
               <div className="overflow-x-auto">
                  <table className="w-full">
                     <thead className="bg-gray-300">
                        <tr className="text-[11px] font-black text-slate-400 uppercase tracking-widest border-b border-slate-50">
                           <th className="px-6 py-3 text-left whitespace-nowrap">{t('fee_report.category')}</th>
                           <th className="px-6 py-3 text-center whitespace-nowrap">{t('fee_report.amount')}</th>
                           <th className="px-6 py-3 text-center whitespace-nowrap">{t('fee_report.paid')}</th>
                           <th className="px-6 py-3 text-center whitespace-nowrap">{t('fee_report.due')}</th>
                           <th className="px-6 py-3 text-right">{t('student_academic_report_page.status')}</th>
                           <th className="px-6 py-3 text-right">{t('fee_report.action')}</th>
                        </tr>
                     </thead>
                     <tbody className="divide-y divide-slate-50">
                        {filteredData[0]?.fees.map((fee, idx) => (
                          <tr key={idx} className="hover:bg-slate-50/50 transition-all duration-300 group">
                            <td className="px-8 py-2 whitespace-nowrap">
                              <span className="text-sm font-black text-slate-800 group-hover:text-[#00bd7f] transition-colors">{fee.category}</span>
                              <p className="text-[10px] font-bold text-slate-400 mt-1 uppercase">{fee.month}</p>
                            </td>
                            <td className="px-8 py-2 text-center text-sm font-black text-slate-900 whitespace-nowrap">৳ {fee.actual}</td>
                            <td className="px-8 py-2 text-center text-sm font-bold text-emerald-600 whitespace-nowrap">৳ {fee.paid}</td>
                            <td className="px-8 py-2 text-center text-sm font-bold text-rose-500 whitespace-nowrap">৳ {fee.due}</td>
                            <td className="px-8 py-2 text-right whitespace-nowrap">
                              <span className={`px-4 py-1.5 rounded-full text-[10px] font-black uppercase tracking-widest border ${getStatusStyle(fee.status)}`}>
                                {getStatusLabel(fee.status)}
                              </span>
                            </td>
                            <td> <div className="flex gap-2">
                    <button className="p-2.5 hover:bg-slate-100 rounded-xl transition-all text-slate-400 hover:text-slate-600 shadow-sm border border-slate-100"><Printer className="w-4 h-4" /></button>
                    <button className="p-2.5 hover:bg-slate-100 rounded-xl transition-all text-slate-400 hover:text-slate-600 shadow-sm border border-slate-100"><Download className="w-4 h-4" /></button>
                  </div></td>
                          </tr>
                        ))}
                     </tbody>
                  </table>
               </div>
            </div>
          </div>
        )}

        {/* Global Table View (Multi Student) */}
        {viewMode === "multi" && filteredData.map((student,i)=> <div key={i} className="mb-8 grid grid-cols-1 lg:grid-cols-3 gap-5 animate-in slide-in-from-bottom-5 duration-700 bg-white shadow-xl rounded-[20px] p-5">
             {/* Profile Card */}
            <div className="space-y-4 flex flex-col items-center text-center border-r-2 border-emerald-600">
             
                <div className="w-[70px] h-[70px] bg-[#00bd7f] rounded-[20px] flex items-center justify-center   ">
                  
              </div>
              
              <div>
                <h3 className="text-2xl font-black text-slate-900  whitespace-nowrap">{student.name}</h3>
                <p className="text-sm font-bold text-slate-400 uppercase tracking-widest mb-4">{student.id}</p>
                <div className="flex flex-wrap justify-center gap-2">
                  <span className="px-4 py-1.5 bg-slate-50 text-slate-600 rounded-full text-[10px] font-black border border-slate-100 uppercase">{student.class}</span>
                  <span className="px-4 py-1.5 bg-slate-50 text-slate-600 rounded-full text-[10px] font-black border border-slate-100 uppercase">{student.guardian}</span>
                </div>
              </div>
              <div className="w-full h-px bg-slate-100"></div>
              <div className="grid grid-cols-2 w-full gap-4 text-left">
                <div>
                  <p className="text-[10px] font-black text-slate-400 uppercase mb-1">{t('fee_report.total_paid')}</p>
                  <p className="text-lg font-black text-emerald-500">৳ {student.fees.reduce((acc, curr) => acc + curr.paid, 0)}</p>
                </div>
                <div>
                  <p className="text-[10px] font-black text-slate-400 uppercase mb-1">{t('fee_report.total_due')}</p>
                  <p className="text-lg font-black text-rose-500">৳ {student.fees.reduce((acc, curr) => acc + curr.due, 0)}</p>
                </div>
                
              </div>
            </div>

            {/* Table in Multi View */}
            <div className="lg:col-span-2 bg-white   overflow-hidden self-start">
              
               
               <div className="overflow-x-auto">
                  <table className="w-full">
                     <thead className="bg-gray-300">
                        <tr className="text-[11px] font-black text-slate-400 uppercase tracking-widest border-b border-slate-50">
                           <th className="px-6 py-3 text-left whitespace-nowrap">{t('fee_report.category')}</th>
                           <th className="px-6 py-3 text-center whitespace-nowrap">{t('fee_report.amount')}</th>
                           <th className="px-6 py-3 text-center whitespace-nowrap">{t('fee_report.paid')}</th>
                           <th className="px-6 py-3 text-center whitespace-nowrap">{t('fee_report.due')}</th>
                           <th className="px-6 py-3 text-right">{t('student_academic_report_page.status')}</th>
                           <th className="px-6 py-3 text-right">{t('fee_report.action')}</th>
                        </tr>
                     </thead>
                     <tbody className="divide-y divide-slate-50">
                        {student.fees.map((fee, idx) => (
                          <tr key={idx} className="hover:bg-slate-50/50 transition-all duration-300 group">
                            <td className="px-8 py-2 whitespace-nowrap">
                              <span className="text-sm font-black text-slate-800 group-hover:text-[#00bd7f] transition-colors">{fee.category}</span>
                              <p className="text-[10px] font-bold text-slate-400 mt-1 uppercase">{fee.month}</p>
                            </td>
                            <td className="px-8 py-2 text-center text-sm font-black text-slate-900 whitespace-nowrap">৳ {fee.actual}</td>
                            <td className="px-8 py-2 text-center text-sm font-bold text-emerald-600 whitespace-nowrap">৳ {fee.paid}</td>
                            <td className="px-8 py-2 text-center text-sm font-bold text-rose-500 whitespace-nowrap">৳ {fee.due}</td>
                            <td className="px-8 py-2 text-right whitespace-nowrap">
                              <span className={`px-4 py-1.5 rounded-full text-[10px] font-black uppercase tracking-widest border ${getStatusStyle(fee.status)}`}>
                                {getStatusLabel(fee.status)}
                              </span>
                            </td>
                            <td> <div className="flex gap-2">
                    <button className="p-2.5 hover:bg-slate-100 rounded-xl transition-all text-slate-400 hover:text-slate-600 shadow-sm border border-slate-100"><Printer className="w-4 h-4" /></button>
                    <button className="p-2.5 hover:bg-slate-100 rounded-xl transition-all text-slate-400 hover:text-slate-600 shadow-sm border border-slate-100"><Download className="w-4 h-4" /></button>
                  </div></td>
                          </tr>
                        ))}
                     </tbody>
                  </table>
               </div>
            </div>
          </div>) }
      </div>
      
      {/* Decorative Blur Overlays */}
      <div className="fixed top-[20%] left-[-5%] w-[300px] h-[300px] bg-[#00bd7f]/10 rounded-full blur-[100px] rotate-45 z-0 pointer-events-none"></div>
      <div className="fixed bottom-[10%] right-[-5%] w-[400px] h-[400px] bg-indigo-500/5 rounded-full blur-[120px] z-0 pointer-events-none"></div>
    </div>
  );
};

export default FreeCollectionReport;
