import { useState } from "react";
import { 
  Search, 
  Printer, 
  FileSpreadsheet, 
  FileJson, 
  Copy, 
  FileText,
  ChevronLeft,
  ChevronRight,
  Filter,
  Users,
  RefreshCw,
  Info
} from "lucide-react";
import SelectInputField from "../../components/SelectInputField";
import InputField from "../../components/InputField";
import { useTranslation } from "react-i18next";

const StudentAttendanceReport = () => {
  const { t } = useTranslation();
  const [searchTerm, setSearchTerm] = useState("");
  
  // Mock days for February 2026
  const days = Array.from({ length: 28 }, (_, i) => ({
    num: (i + 1).toString().padStart(2, '0'),
    day: ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"][(i + 0) % 7] // Starts on Sunday
  }));

  const students = [
    { name: "Md Nabim ISLAM", attendance: { 6: 'W', 13: 'W', 20: 'W', 27: 'W' }, stats: { w: 4, p: 0, a: 0, l: 0, hd: 0, perc: '-' } },
    { name: "Md Alamin ahmed", attendance: { 6: 'W', 13: 'W', 20: 'W', 27: 'W' }, stats: { w: 4, p: 0, a: 0, l: 0, hd: 0, perc: '-' } },
    { name: "Md mahadi hassan", attendance: { 6: 'W', 13: 'W', 20: 'W', 27: 'W' }, stats: { w: 4, p: 0, a: 0, l: 0, hd: 0, perc: '-' } },
    { name: "Md Rabiul Islam", attendance: { 6: 'W', 13: 'W', 20: 'W', 27: 'W' }, stats: { w: 4, p: 0, a: 0, l: 0, hd: 0, perc: '-' } },
    { name: "Md Shakil ahmed", attendance: { 6: 'W', 13: 'W', 20: 'W', 27: 'W' }, stats: { w: 4, p: 0, a: 0, l: 0, hd: 0, perc: '-' } },
  ];

  return (
    <div className="min-h-screen bg-slate-50/50 p-4 md:p-8 animate-in fade-in duration-500">
      <div className="max-w-[1600px] mx-auto space-y-6">
        
        {/* Selection Area */}
        <div className="bg-white rounded-[20px] border border-slate-200 shadow-sm overflow-hidden">
          
          <div className="p-8">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 items-end">
              <SelectInputField title={t("common.class")} required />
              <SelectInputField title={t("common.section")} required />
              <InputField title={t("common.month")} type={'month'}/>
            </div>
            <div className="mt-8 flex justify-end">
              <button className="px-10 py-3 bg-[#00bd7f] text-white rounded-xl text-sm font-black hover:bg-[#009b68] hover:scale-[1.02] active:scale-95 transition-all flex items-center gap-2 shadow-xl shadow-[#00bd7f]/20 uppercase tracking-widest cursor-pointer">
                <Filter className="w-5 h-5" />
                {t("reports_page.generate_report")}
              </button>
            </div>
          </div>
        </div>

        {/* Report Section */}
        <div className="bg-white rounded-[20px] border border-slate-200 shadow-sm overflow-hidden">
          <div className="bg-slate-50 px-8 py-4 border-b border-slate-200 flex items-center justify-between">
            <div className="flex items-center gap-3">
               <div className="w-10 h-10 bg-[#00bd7f]/10 rounded-xl flex items-center justify-center border border-[#00bd7f]/20">
                  <Users className="w-5 h-5 text-[#00bd7f]" />
               </div>
               <h3 className="text-sm font-black text-slate-800 uppercase tracking-tight">{t("reports_page.attendance_ledger")}</h3>
            </div>
            <div className="flex items-center gap-2">
               <button className="p-2 bg-white border border-slate-200 rounded-lg text-slate-400 hover:text-[#00bd7f] hover:border-[#00bd7f]/30 transition-all shadow-sm"><Printer className="w-4 h-4" /></button>
               <button className="p-2 bg-white border border-slate-200 rounded-lg text-slate-400 hover:text-[#00bd7f] hover:border-[#00bd7f]/30 transition-all shadow-sm"><FileSpreadsheet className="w-4 h-4" /></button>
            </div>
          </div>
          
          <div className="p-8 space-y-8">
             {/* Legend Section */}
             <div className="flex flex-wrap gap-4 items-center bg-slate-50/50 p-6 rounded-2xl border border-slate-100">
                <div className="flex items-center gap-2 px-3 py-1.5 bg-white border border-slate-200 rounded-full shadow-sm">
                   <div className="w-2.5 h-2.5 rounded-full bg-slate-400" />
                   <span className="text-[10px] font-black text-slate-600 uppercase tracking-widest">W : {t("reports_page.weekend")}</span>
                </div>
                <div className="flex items-center gap-2 px-3 py-1.5 bg-white border border-slate-200 rounded-full shadow-sm">
                   <div className="w-2.5 h-2.5 rounded-full bg-[#00bd7f]" />
                   <span className="text-[10px] font-black text-slate-600 uppercase tracking-widest">P : {t("reports_page.present")}</span>
                </div>
                <div className="flex items-center gap-2 px-3 py-1.5 bg-white border border-slate-200 rounded-full shadow-sm">
                   <div className="w-2.5 h-2.5 rounded-full bg-rose-500" />
                   <span className="text-[10px] font-black text-slate-600 uppercase tracking-widest">A : {t("reports_page.absent")}</span>
                </div>
                <div className="flex items-center gap-2 px-3 py-1.5 bg-white border border-slate-200 rounded-full shadow-sm">
                   <div className="w-2.5 h-2.5 rounded-full bg-cyan-500" />
                   <span className="text-[10px] font-black text-slate-600 uppercase tracking-widest">H : {t("reports_page.holiday")}</span>
                </div>
                <div className="flex items-center gap-2 px-3 py-1.5 bg-white border border-slate-200 rounded-full shadow-sm">
                   <div className="w-2.5 h-2.5 rounded-full bg-amber-500" />
                   <span className="text-[10px] font-black text-slate-600 uppercase tracking-widest">L : {t("reports_page.late")}</span>
                </div>
                <div className="flex items-center gap-2 px-3 py-1.5 bg-white border border-slate-200 rounded-full shadow-sm">
                   <div className="w-2.5 h-2.5 rounded-full bg-indigo-500" />
                   <span className="text-[10px] font-black text-slate-600 uppercase tracking-widest">HD : {t("reports_page.half_day")}</span>
                </div>
             </div>

             {/* Search and Table Container */}
             <div className="space-y-4">
                <div className="flex justify-between items-center">
                   <div className="relative w-full md:w-80">
                      <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-300" />
                      <input 
                        className="w-full pl-11 pr-4 py-3 bg-white border border-slate-200 rounded-xl text-xs font-black outline-none focus:border-[#00bd7f] transition-all shadow-sm placeholder:text-slate-300"
                        placeholder={t("reports_page.search_student")}
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                      />
                   </div>
                </div>

                <div className="overflow-x-auto custom-scrollbar-horizontal border border-slate-200 rounded-2xl">
                  <table className="w-full border-collapse">
                    <thead>
                      <tr className="bg-[#00bd7f]/5 text-[10px] font-black text-slate-500 uppercase tracking-widest whitespace-nowrap">
                        <th className="p-4 border-b border-gray-200 sticky left-0 z-20 bg-[#f9fbfb] text-left min-w-[200px]">{t("common.student_name")}</th>
                        {days.map(d => (
                          <th key={d.num} className={`p-2 border-b border-gray-200 text-center min-w-[45px] ${d.day === 'Fri' ? 'text-rose-500' : ''}`}>
                            <div className="flex flex-col">
                              <span>{d.day}</span>
                              <span className="text-xs text-slate-800">{d.num}</span>
                            </div>
                          </th>
                        ))}
                        <th className="p-4 border-b border-gray-200 text-center sticky right-0 z-20 bg-[#f9fbfb]">(%)</th>
                        <th className="p-4 border-b border-gray-200 text-center">W</th>
                        <th className="p-4 border-b border-gray-200 text-center">P</th>
                        <th className="p-4 border-b border-gray-200 text-center text-rose-500">A</th>
                        <th className="p-4 border-b border-gray-200 text-center">L</th>
                        <th className="p-4 border border-gray-200 text-center text-indigo-500">HD</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-50">
                      {students.map((stu, sIdx) => (
                        <tr key={sIdx} className="hover:bg-slate-50/50 transition-colors">
                          <td className="p-4 border border-gray-200 sticky left-0 z-10 bg-white group-hover:bg-slate-50 text-[11px] font-black text-slate-700 uppercase tracking-tight">
                            {stu.name}
                          </td>
                          {days.map(d => (
                            <td key={d.num} className={`border border-gray-200 p-0 text-center`}>
                              <div className="w-full h-12 flex items-center justify-center">
                                {stu.attendance[parseInt(d.num)] ? (
                                  <span className={`w-8 h-8 flex items-center justify-center font-black text-[10px] rounded-lg ${
                                    stu.attendance[parseInt(d.num)] === 'W' ? 'bg-slate-100 text-slate-500' : 'bg-[#00bd7f]/10 text-[#00bd7f]'
                                  }`}>
                                    {stu.attendance[parseInt(d.num)]}
                                  </span>
                                ) : (
                                   <div className="w-1.5 h-1.5 bg-slate-100 rounded-full" />
                                )}
                              </div>
                            </td>
                          ))}
                          <td className="p-4 text-center text-xs font-black text-slate-400 sticky right-0 bg-white border border-gray-200">{stu.stats.perc}</td>
                          <td className="p-4 text-center text-xs font-black text-slate-600 border border-gray-200">{stu.stats.w}</td>
                          <td className="p-4 text-center text-xs font-black text-[#00bd7f] border border-gray-200">{stu.stats.p}</td>
                          <td className="p-4 text-center text-xs font-black text-rose-500 border border-gray-200">{stu.stats.a}</td>
                          <td className="p-4 text-center text-xs font-black text-amber-600 border border-gray-200">{stu.stats.l}</td>
                          <td className="p-4 text-center text-xs font-black text-indigo-600 border border-gray-200">{stu.stats.hd}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>

             
             </div>

             {/* Pagination */}
             <div className="flex justify-end gap-2">
               <button className="p-2.5 bg-white border border-slate-200 rounded-xl text-slate-400 hover:text-[#00bd7f] hover:border-[#00bd7f]/30 transition-all shadow-sm"><ChevronLeft className="w-4 h-4" /></button>
               <button className="px-6 py-2.5 bg-[#00bd7f] text-white font-black border border-[#00bd7f] rounded-xl shadow-lg shadow-[#00bd7f]/20 uppercase tracking-widest text-xs">1</button>
               <button className="p-2.5 bg-white border border-slate-200 rounded-xl text-slate-400 hover:text-[#00bd7f] hover:border-[#00bd7f]/30 transition-all shadow-sm"><ChevronRight className="w-4 h-4" /></button>
             </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default StudentAttendanceReport;
