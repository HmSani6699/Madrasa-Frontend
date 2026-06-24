import { useState, useEffect } from "react";
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
import { useTranslation } from "react-i18next";
import axiosInstance from "../../api/axiosInstance";
import { toast } from "react-hot-toast";

const StudentAttendanceReport = () => {
  const { t } = useTranslation();
  const [searchTerm, setSearchTerm] = useState("");
  
  const [classes, setClasses] = useState([]);
  const [sections, setSections] = useState([]);
  const [selectedClassId, setSelectedClassId] = useState("");
  const [selectedSectionId, setSelectedSectionId] = useState("");
  const [selectedMonth, setSelectedMonth] = useState("");
  const [reportData, setReportData] = useState(null);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const fetchClasses = async () => {
      try {
        const res = await axiosInstance.get("/v1/classes");
        if (res.data.success) {
          setClasses(res.data.data);
        }
      } catch (err) {
        console.error("Error fetching classes:", err);
      }
    };
    fetchClasses();
  }, []);

  useEffect(() => {
    if (selectedClassId) {
      const fetchSections = async () => {
        try {
          const res = await axiosInstance.get(`/v1/sections?class_id=${selectedClassId}`);
          if (res.data.success) {
            setSections(res.data.data);
          }
        } catch (err) {
          console.error("Error fetching sections:", err);
        }
      };
      fetchSections();
    } else {
      setSections([]);
      setSelectedSectionId("");
    }
  }, [selectedClassId]);

  const generateReport = async () => {
    if (!selectedClassId || !selectedSectionId || !selectedMonth) {
      toast.error("Please select class, section, and month.");
      return;
    }

    setLoading(true);
    try {
      const [year, month] = selectedMonth.split('-');
      const startDate = new Date(year, parseInt(month) - 1, 1);
      const endDate = new Date(year, parseInt(month), 0);
      
      const numDays = endDate.getDate();
      const generatedDays = Array.from({ length: numDays }, (_, i) => {
        const d = new Date(year, parseInt(month) - 1, i + 1);
        return {
          num: (i + 1).toString().padStart(2, '0'),
          day: ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"][d.getDay()]
        };
      });

      const studentsRes = await axiosInstance.get("/v1/students", {
        params: {
          class_id: selectedClassId,  
          section_id: selectedSectionId
        }
      });

      const attendanceRes = await axiosInstance.get("/v1/attendance/report", {
          params: {
              start_date: startDate.toISOString().split('T')[0],
              end_date: endDate.toISOString().split('T')[0],
              class_id: selectedClassId,
              section_id: selectedSectionId,
              type: "student"
          }
      });

      if (studentsRes.data.success) {
        const studentList = studentsRes.data.data;
        const attendanceRecords = attendanceRes.data.success ? attendanceRes.data.data : [];

        const totals = { w: 0, p: 0, a: 0, h: 0, l: 0, hd: 0 };

        const mappedStudents = studentList.map(student => {
          const stuAttendance = {};
          let stats = { w: 0, p: 0, a: 0, h: 0, l: 0, hd: 0, perc: '0%' };
          
          let totalWorkingDays = 0;
          let presentDays = 0;

          generatedDays.forEach(d => {
            const dayNum = parseInt(d.num);
            if (d.day === 'Fri') {
              stuAttendance[dayNum] = 'W';
              stats.w++;
              totals.w++;
            } else {
              totalWorkingDays++;
            }
          });

          const studentRecords = attendanceRecords.filter(r => r.student_id === student._id || r.student_id?._id === student._id);
          
          studentRecords.forEach(r => {
            const recordDate = new Date(r.date);
            const dayNum = recordDate.getDate();
            const statusStr = r.status.toUpperCase();
            
            let code = 'P';
            if (statusStr === 'PRESENT') { code = 'P'; stats.p++; totals.p++; presentDays++; }
            else if (statusStr === 'ABSENT') { code = 'A'; stats.a++; totals.a++; }
            else if (statusStr === 'LATE') { code = 'L'; stats.l++; totals.l++; presentDays++; } 
            else if (statusStr === 'LEAVE') { code = 'A'; stats.a++; totals.a++; } 
            else if (statusStr === 'HOLIDAY') { code = 'H'; stats.h++; totals.h++; } 
            else if (statusStr === 'HALF_DAY') { code = 'HD'; stats.hd++; totals.hd++; presentDays += 0.5; } 
            
            if (stuAttendance[dayNum] !== 'W') {
              stuAttendance[dayNum] = code;
            }
          });

          if (totalWorkingDays > 0) {
            stats.perc = Math.round((presentDays / totalWorkingDays) * 100) + '%';
          } else {
            stats.perc = '-';
          }

          return {
            name: `${student.firstName || ''} ${student.lastName || ''}`.trim() || student.name || 'Unknown',
            attendance: stuAttendance,
            stats
          };
        });

        setReportData({
          days: generatedDays,
          students: mappedStudents,
          totals
        });
      }
    } catch (err) {
      console.error("Error generating report:", err);
      toast.error("Failed to generate report");
    } finally {
      setLoading(false);
    }
  };

  const filteredStudents = reportData?.students.filter(stu => 
    stu.name.toLowerCase().includes(searchTerm.toLowerCase())
  ) || [];

  return (
    <div className="min-h-screen bg-slate-50/50 p-4 md:p-8 animate-in fade-in duration-500">
      <div className="max-w-[1600px] mx-auto space-y-6">
        
        {/* Selection Area */}
        <div className="bg-white rounded-[20px] border border-slate-200 shadow-sm overflow-hidden">
          
          <div className="p-8">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 items-end">
              <div className="space-y-2">
                <label className="text-xs font-black text-slate-500 uppercase">{t("common.class")} <span className="text-rose-500">*</span></label>
                <select 
                  className="w-full bg-[#f8fcfb] border border-slate-200 rounded-xl px-4 py-3 text-sm font-bold focus:border-[#00bd7f] outline-none transition-all"
                  value={selectedClassId}
                  onChange={(e) => setSelectedClassId(e.target.value)}
                >
                  <option value="">Select class</option>
                  {classes.map(c => (
                    <option key={c._id} value={c._id}>{c.name}</option>
                  ))}
                </select>
              </div>
              <div className="space-y-2">
                <label className="text-xs font-black text-slate-500 uppercase">{t("common.section")} <span className="text-rose-500">*</span></label>
                <select 
                  className="w-full bg-[#f8fcfb] border border-slate-200 rounded-xl px-4 py-3 text-sm font-bold focus:border-[#00bd7f] outline-none transition-all"
                  value={selectedSectionId}
                  onChange={(e) => setSelectedSectionId(e.target.value)}
                >
                  <option value="">Select section</option>
                  {sections.map(s => (
                    <option key={s._id} value={s._id}>{s.name}</option>
                  ))}
                </select>
              </div>
              <div className="space-y-2">
                <label className="text-xs font-black text-slate-500 uppercase">{t("common.month")} <span className="text-rose-500">*</span></label>
                <input 
                  type="month"
                  className="w-full bg-[#f8fcfb] border border-slate-200 rounded-xl px-4 py-3 text-sm font-bold focus:border-[#00bd7f] outline-none transition-all"
                  value={selectedMonth}
                  onChange={(e) => setSelectedMonth(e.target.value)}
                />
              </div>
            </div>
            <div className="mt-8 flex justify-end">
              <button 
                onClick={generateReport}
                disabled={loading}
                className="px-10 py-3 bg-[#00bd7f] text-white rounded-xl text-sm font-black hover:bg-[#009b68] hover:scale-[1.02] active:scale-95 transition-all flex items-center gap-2 shadow-xl shadow-[#00bd7f]/20 uppercase tracking-widest cursor-pointer disabled:opacity-50"
              >
                <Filter className="w-5 h-5" />
                {loading ? "Generating..." : t("reports_page.generate_report")}
              </button>
            </div>
          </div>
        </div>

        {/* Report Section */}
        {reportData && (
        <div className="bg-white rounded-[20px] border border-slate-200 shadow-sm overflow-hidden animate-in fade-in slide-in-from-bottom-4 duration-500">
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
                   <span className="text-[10px] font-black text-slate-600 uppercase tracking-widest">W : {reportData.totals.w} - {t("reports_page.weekend")}</span>
                </div>
                <div className="flex items-center gap-2 px-3 py-1.5 bg-white border border-slate-200 rounded-full shadow-sm">
                   <div className="w-2.5 h-2.5 rounded-full bg-[#00bd7f]" />
                   <span className="text-[10px] font-black text-slate-600 uppercase tracking-widest">P : {reportData.totals.p} - {t("reports_page.present")}</span>
                </div>
                <div className="flex items-center gap-2 px-3 py-1.5 bg-white border border-slate-200 rounded-full shadow-sm">
                   <div className="w-2.5 h-2.5 rounded-full bg-rose-500" />
                   <span className="text-[10px] font-black text-slate-600 uppercase tracking-widest">A : {reportData.totals.a} - {t("reports_page.absent")}</span>
                </div>
                <div className="flex items-center gap-2 px-3 py-1.5 bg-white border border-slate-200 rounded-full shadow-sm">
                   <div className="w-2.5 h-2.5 rounded-full bg-cyan-500" />
                   <span className="text-[10px] font-black text-slate-600 uppercase tracking-widest">H : {reportData.totals.h} - {t("reports_page.holiday")}</span>
                </div>
                <div className="flex items-center gap-2 px-3 py-1.5 bg-white border border-slate-200 rounded-full shadow-sm">
                   <div className="w-2.5 h-2.5 rounded-full bg-amber-500" />
                   <span className="text-[10px] font-black text-slate-600 uppercase tracking-widest">L : {reportData.totals.l} - {t("reports_page.late")}</span>
                </div>
                <div className="flex items-center gap-2 px-3 py-1.5 bg-white border border-slate-200 rounded-full shadow-sm">
                   <div className="w-2.5 h-2.5 rounded-full bg-indigo-500" />
                   <span className="text-[10px] font-black text-slate-600 uppercase tracking-widest">HD : {reportData.totals.hd} - {t("reports_page.half_day")}</span>
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
                        {reportData.days.map(d => (
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
                      {filteredStudents.length > 0 ? filteredStudents.map((stu, sIdx) => (
                        <tr key={sIdx} className="hover:bg-slate-50/50 transition-colors">
                          <td className="p-4 border border-gray-200 sticky left-0 z-10 bg-white group-hover:bg-slate-50 text-[11px] font-black text-slate-700 uppercase tracking-tight">
                            {stu.name}
                          </td>
                          {reportData.days.map(d => (
                            <td key={d.num} className={`border border-gray-200 p-0 text-center`}>
                              <div className="w-full h-12 flex items-center justify-center">
                                {stu.attendance[parseInt(d.num)] ? (
                                  <span className={`w-8 h-8 flex items-center justify-center font-black text-[10px] rounded-lg ${
                                    stu.attendance[parseInt(d.num)] === 'W' ? 'bg-slate-100 text-slate-500' : 
                                    stu.attendance[parseInt(d.num)] === 'A' ? 'bg-rose-50 text-rose-500' :
                                    stu.attendance[parseInt(d.num)] === 'L' ? 'bg-amber-50 text-amber-500' :
                                    stu.attendance[parseInt(d.num)] === 'H' ? 'bg-cyan-50 text-cyan-500' :
                                    stu.attendance[parseInt(d.num)] === 'HD' ? 'bg-indigo-50 text-indigo-500' :
                                    'bg-[#00bd7f]/10 text-[#00bd7f]'
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
                      )) : (
                        <tr>
                           <td colSpan={reportData.days.length + 7} className="p-8 text-center text-slate-400 text-sm font-bold">
                              No students found.
                           </td>
                        </tr>
                      )}
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
        )}
      </div>
    </div>
  );
};

export default StudentAttendanceReport;
