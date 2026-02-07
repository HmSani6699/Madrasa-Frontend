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

const StaffAttendanceReport = () => {
  const { t } = useTranslation();
  const [searchTerm, setSearchTerm] = useState("");
  
  // Mock days for February 2026
  const days = Array.from({ length: 28 }, (_, i) => ({
    num: (i + 1).toString().padStart(2, '0'),
    day: ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"][(i + 0) % 7]
  }));

  const staff = [
    { name: "Maulana Abdul Karim", designation: "Head Teacher", attendance: { 6: 'W', 13: 'W', 20: 'W', 27: 'W' }, stats: { w: 4, p: 0, a: 0, l: 0, hd: 0, perc: '-' } },
    { name: "Hafez Mohammad Ali", designation: "Senior Teacher", attendance: { 6: 'W', 13: 'W', 20: 'W', 27: 'W' }, stats: { w: 4, p: 0, a: 0, l: 0, hd: 0, perc: '-' } },
    { name: "Hossain Ahmed", designation: "Junior Teacher", attendance: { 6: 'W', 13: 'W', 20: 'W', 27: 'W' }, stats: { w: 4, p: 0, a: 0, l: 0, hd: 0, perc: '-' } },
  ];

  return (
    <div className="min-h-screen bg-slate-50/50 p-4 md:p-8 animate-in fade-in duration-500">
      <div className="max-w-[1600px] mx-auto space-y-6">
        
        {/* Selection Area */}
        <div className="bg-white rounded-[20px] border border-slate-200 shadow-sm overflow-hidden">
        
          <div className="p-8">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 items-end">
              <SelectInputField title={t("reports_page.staff_dept")} required />
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
               <h3 className="text-sm font-black text-slate-800 uppercase tracking-tight">{t("reports_page.staff_attendance")}</h3>
            </div>
           {/* Legend Section */}
             <div className="flex flex-wrap gap-4 items-center bg-slate-50/50 p-6 rounded-2xl border border-slate-100 uppercase tracking-widest font-black text-slate-500 text-[10px]">
                <div className="flex items-center gap-3">
                   <div className="w-3 h-3 rounded-full bg-slate-100 border-2 border-slate-200" /> {t("reports_page.weekend")} (W)
                </div>
                <div className="flex items-center gap-3">
                   <div className="w-3 h-3 rounded-full bg-[#00bd7f]" /> {t("reports_page.present")} (P)
                </div>
                <div className="flex items-center gap-3">
                   <div className="w-3 h-3 rounded-full bg-rose-500" /> {t("reports_page.absent")} (A)
                </div>
             </div>
          </div>
          
          <div className="p-8 space-y-8">
             

             {/* Export & Grid */}
             <div className="space-y-4">
                <div className="flex flex-col md:flex-row justify-between items-center gap-4">
                  <div className="relative w-full md:w-80">
                    <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-300" />
                    <input 
                      className="w-full pl-11 pr-4 py-3 bg-white border border-slate-200 rounded-xl text-xs font-black outline-none focus:border-[#00bd7f] shadow-sm transition-all placeholder:text-slate-300 uppercase tracking-widest" 
                      placeholder={t("common.search_staff")}
                      value={searchTerm}
                      onChange={(e) => setSearchTerm(e.target.value)}
                    />
                  </div>
                  
                  <div className="flex gap-2">
                    <button title="Excel" className="p-2.5 bg-slate-50 text-slate-400 border border-slate-200 rounded-xl hover:text-emerald-600 hover:border-emerald-200 transition-all"><FileSpreadsheet className="w-5 h-5" /></button>
                    <button title="Print" className="p-2.5 bg-slate-50 text-slate-400 border border-slate-200 rounded-xl hover:text-slate-600 hover:border-slate-300 transition-all"><Printer className="w-5 h-5" /></button>
                    <button title="Refresh" className="p-2.5 bg-slate-50 text-slate-400 border border-slate-200 rounded-xl hover:text-[#00bd7f] hover:border-[#00bd7f]/30 transition-all"><RefreshCw className="w-5 h-5" /></button>
                  </div>
                </div>

                <div className="overflow-x-auto custom-scrollbar-horizontal border border-slate-200 rounded-2xl">
                  <table className="w-full border-collapse">
                    <thead>
                      <tr className="bg-[#00bd7f]/5 text-[10px] font-black text-slate-500 uppercase tracking-widest whitespace-nowrap">
                        <th className="p-4 border-b border-slate-100 sticky left-0 z-20 bg-[#f9fbfb] text-left min-w-[200px]">{t("common.staff_name")}</th>
                        {days.map(d => (
                          <th key={d.num} className="p-2 border-b border-slate-100 text-center min-w-[45px]">
                             <div className="flex flex-col">
                               <span className="text-[9px]">{d.day}</span>
                               <span className="text-xs text-slate-800">{d.num}</span>
                             </div>
                          </th>
                        ))}
                        <th className="p-5 border-b border-slate-100 text-center font-black">W</th>
                        <th className="p-5 border-b border-slate-100 text-center font-black text-[#00bd7f]">P</th>
                        <th className="p-5 border-b border-slate-100 text-center font-black text-rose-500">A</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-50">
                      {staff.map((s, idx) => (
                        <tr key={idx} className="hover:bg-slate-50/50 transition-colors">
                          <td className="p-5 border-b border-slate-100 sticky left-0 z-10 bg-white group-hover:bg-slate-50">
                            <div className="text-[11px] font-black text-slate-700 uppercase tracking-tight">{s.name}</div>
                            <div className="text-[9px] text-[#00bd7f] font-black uppercase tracking-widest mt-0.5">{s.designation}</div>
                          </td>
                          {days.map(d => (
                            <td key={d.num} className="border-b border-slate-100 p-0 text-center">
                              <div className="h-12 flex items-center justify-center">
                                {s.attendance[parseInt(d.num)] ? (
                                   <span className={`w-8 h-8 flex items-center justify-center font-black text-[10px] rounded-lg ${
                                    s.attendance[parseInt(d.num)] === 'W' ? 'bg-slate-100 text-slate-400' : 'bg-[#00bd7f]/10 text-[#00bd7f]'
                                   }`}>
                                     {s.attendance[parseInt(d.num)]}
                                   </span>
                                ) : (
                                   <div className="w-1 h-1 bg-slate-200 rounded-full" />
                                )}
                              </div>
                            </td>
                          ))}
                          <td className="p-5 border-b border-slate-100 text-center text-xs font-black text-slate-400">{s.stats.w}</td>
                          <td className="p-5 border-b border-slate-100 text-center text-xs font-black text-[#00bd7f]">{s.stats.p}</td>
                          <td className="p-5 border-b border-slate-100 text-center text-xs font-black text-rose-500">{s.stats.a}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>

              
             </div>

             <div className="flex justify-between items-center bg-slate-50/50 p-6 rounded-2xl border border-slate-100">
                <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Showing 1 to 3 of 48 staff members</p>
                <div className="flex gap-2">
                   <button className="p-2.5 bg-white border border-slate-200 rounded-xl text-slate-400 hover:text-[#00bd7f] hover:border-[#00bd7f]/30 transition-all shadow-sm"><ChevronLeft className="w-4 h-4" /></button>
                   <button className="px-5 py-2.5 bg-[#00bd7f] text-white font-black rounded-xl shadow-lg shadow-[#00bd7f]/20 text-xs">1</button>
                   <button className="p-2.5 bg-white border border-slate-200 rounded-xl text-slate-400 hover:text-[#00bd7f] hover:border-[#00bd7f]/30 transition-all shadow-sm"><ChevronRight className="w-4 h-4" /></button>
                </div>
             </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default StaffAttendanceReport;
