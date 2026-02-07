import { useState } from "react";
import { 
  Search, 
  Printer, 
  FileSpreadsheet, 
  FileJson, 
  Copy, 
  FileText,
  Filter,
  RefreshCw,
  GraduationCap,
  Download,
  Calendar,
  ChevronLeft,
  ChevronRight
} from "lucide-react";
import SelectInputField from "../../components/SelectInputField";
import { useTranslation } from "react-i18next";

const ExamAttendanceReport = () => {
  const { t } = useTranslation();
  const [searchTerm, setSearchTerm] = useState("");

  const exams = [
    { student: "Mohammad Rahman", roll: "01", class: "Class 5", exam: "First Term 2025", hall: "Room 101", status: "Present", time: "09:15 AM" },
    { student: "Ayesha Khatun", roll: "02", class: "Class 5", exam: "First Term 2025", hall: "Room 101", status: "Present", time: "09:20 AM" },
    { student: "Yousuf Hossain", roll: "03", class: "Class 5", exam: "First Term 2025", hall: "Room 101", status: "Absent", time: "-" },
  ];

  return (
    <div className="min-h-screen bg-slate-50/50 p-4 md:p-8 animate-in fade-in duration-500">
      <div className="max-w-[1600px] mx-auto space-y-6">
        
        {/* Selection Area */}
        <div className="bg-white rounded-[20px] border border-slate-200 shadow-sm overflow-hidden text-uppercase">
         
          <div className="p-8">
            <div className="grid grid-cols-1 md:grid-cols-4 gap-6 items-end">
              <SelectInputField title={t("reports_page.exam_name")} required />
              <SelectInputField title={t("common.class")} required />
              <div className="space-y-2">
                <label className="text-[10px] font-black text-slate-500 uppercase tracking-widest px-1">{t("reports_page.exam_date")}</label>
                <div className="relative">
                   <Calendar className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-300" />
                   <input type="date" className="w-full bg-slate-50 border border-slate-200 rounded-xl px-11 py-3 text-sm font-bold text-slate-700 outline-none focus:ring-2 focus:ring-[#00bd7f]/20 focus:border-[#00bd7f] transition-all" />
                </div>
              </div>
              <button className="px-10 py-3 bg-[#00bd7f] text-white rounded-xl text-sm font-black hover:bg-[#009b68] hover:scale-[1.02] active:scale-95 transition-all flex items-center justify-center gap-2 shadow-xl shadow-[#00bd7f]/20 uppercase tracking-widest cursor-pointer">
                <Search className="w-5 h-5" />
               {t("common.filter")}
              </button>
            </div>
          </div>
        </div>

        {/* Report Section */}
        <div className="bg-white rounded-[20px] border border-slate-200 shadow-sm overflow-hidden">
          <div className="px-8 py-5 border-b border-slate-50 flex flex-col md:flex-row justify-between items-center gap-6">
            <div className="flex gap-2">
               <button className="p-2.5 bg-white border border-slate-200 rounded-xl text-slate-400 hover:text-emerald-600 hover:border-emerald-200 transition-all shadow-sm"><Copy className="w-4 h-4" /></button>
               <button className="p-2.5 bg-white border border-slate-200 rounded-xl text-slate-400 hover:text-emerald-600 hover:border-emerald-200 transition-all shadow-sm"><FileSpreadsheet className="w-4 h-4" /></button>
               <button className="p-2.5 bg-white border border-slate-200 rounded-xl text-slate-400 hover:text-slate-600 hover:border-slate-300 transition-all shadow-sm"><Printer className="w-4 h-4" /></button>
            </div>
            <div className="relative w-full md:w-80">
              <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-300" />
              <input 
                className="w-full pl-11 pr-4 py-3 bg-slate-50 border border-slate-100 rounded-xl text-sm font-black text-slate-700 outline-none transition-all focus:border-[#00bd7f] placeholder:text-slate-300 shadow-inner" 
                placeholder={t("common.search_candidate")} 
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>
          </div>

          <div className="overflow-x-auto border-t border-slate-50">
            <table className="w-full whitespace-nowrap">
              <thead className="bg-[#00bd7f]/5">
                <tr className="text-[10px] font-black text-slate-500 uppercase tracking-widest">
                  <th className="px-8 py-5 text-left">{t("common.roll_no")}</th>
                  <th className="px-8 py-5 text-left">{t("reports_page.candidate_specs")}</th>
                  <th className="px-8 py-5 text-center">{t("reports_page.exam_hall")}</th>
                  <th className="px-8 py-5 text-center">{t("reports_page.entry_time")}</th>
                  <th className="px-8 py-5 text-center">{t("reports_page.attendance_status")}</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-50">
                {exams.map((item, idx) => (
                  <tr key={idx} className="hover:bg-slate-50/50 group transition-colors">
                    <td className="px-8 py-6 font-black text-[#00bd7f] text-lg tracking-tighter">#{item.roll}</td>
                    <td className="px-8 py-6">
                      <p className="text-sm font-black text-slate-800 uppercase tracking-tight">{item.student}</p>
                      <p className="text-[9px] text-[#00bd7f] font-black uppercase tracking-widest mt-0.5">{item.class}</p>
                    </td>
                    <td className="px-8 py-6 text-center text-xs font-black text-slate-600 uppercase tracking-widest mb-1">{item.hall}</td>
                    <td className="px-8 py-6 text-center text-sm font-mono font-black text-slate-500">{item.time}</td>
                    <td className="px-8 py-6 text-center">
                      <span className={`px-5 py-2 rounded-xl text-[10px] font-black uppercase tracking-widest border transition-all ${
                        item.status === 'Present' 
                          ? 'bg-[#00bd7f]/10 text-[#00bd7f] border-[#00bd7f]/20 shadow-sm' 
                          : 'bg-rose-50 text-rose-500 border-rose-100 shadow-sm'
                      }`}>
                        {t(`reports_page.${item.status.toLowerCase()}`)}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {/* Footer Metadata */}
          <div className="px-8 py-6 bg-slate-50 border-t border-slate-100 flex flex-col md:flex-row justify-between items-center gap-4">
             <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">
                {t("reports_page.candidate_count")}: 48 {t("reports_page.registered")} / 45 {t("reports_page.presented")}
             </p>
             <div className="flex gap-2">
                <button className="p-2.5 bg-white border border-slate-200 rounded-xl text-slate-400 hover:text-[#00bd7f] hover:border-[#00bd7f]/30 transition-all shadow-sm"><ChevronLeft className="w-4 h-4" /></button>
                <button className="px-6 py-2.5 bg-[#00bd7f] text-white font-black rounded-xl shadow-lg shadow-[#00bd7f]/20 text-xs uppercase tracking-widest">1</button>
                <button className="p-2.5 bg-white border border-slate-200 rounded-xl text-slate-400 hover:text-[#00bd7f] hover:border-[#00bd7f]/30 transition-all shadow-sm"><ChevronRight className="w-4 h-4" /></button>
             </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ExamAttendanceReport;
