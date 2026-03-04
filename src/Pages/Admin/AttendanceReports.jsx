import { useState, useEffect } from "react";
import { useTranslation } from "react-i18next";
import { 
  CalendarCheck, 
  Search, 
  Filter, 
  Download, 
  UserCheck, 
  Users, 
  Clock, 
  Calendar, 
  ClipboardCheck,
  MoreVertical,
  ChevronDown,
  Printer,
  BarChart2,
  PieChart,
  ChevronLeft,
  ChevronRight,
  TrendingUp,
  Activity
} from "lucide-react";
import axiosInstance from "../../api/axiosInstance";
import { toast } from "react-hot-toast";

const AttendanceReports = () => {
  const { t } = useTranslation();
  const [activeTab, setActiveTab] = useState("daily"); // daily, overview
  const [loading, setLoading] = useState(false);
  const [reportData, setReportData] = useState([]);
  
  const [selectedClassId, setSelectedClassId] = useState("");
  const [selectedSectionId, setSelectedSectionId] = useState("");
  const [startDate, setStartDate] = useState(new Date().toISOString().split('T')[0]);
  const [endDate, setEndDate] = useState(new Date().toISOString().split('T')[0]);
  
  const [classes, setClasses] = useState([]);
  const [sections, setSections] = useState([]);
  
  const tabs = [
    { id: "daily", label: t("reports_page.daily_presence"), icon: Activity },
    { id: "overview", label: t("reports_page.student_aggregate"), icon: ClipboardCheck },
    // { id: "employee", label: t("reports_page.staff_attendance_summary"), icon: Users },
  ];

  useEffect(() => {
    const fetchInit = async () => {
      try {
        const [cRes, sRes] = await Promise.all([
          axiosInstance.get("/v1/classes"),
          axiosInstance.get("/v1/sections")
        ]);
        if(cRes.data.success) setClasses(cRes.data.data);
        if(sRes.data.success) setSections(sRes.data.data);
      } catch(err) {
        console.error(err);
      }
    };
    fetchInit();
  }, []);

  const fetchReport = async () => {
    setLoading(true);
    try {
        const params = {
            type: activeTab === 'employee' ? 'Staff' : 'Student',
        };

        if (activeTab === 'daily') {
            params.date = startDate;
            if (activeTab !== 'employee') {
                 if (selectedClassId) params.class_id = selectedClassId;
                 if (selectedSectionId) params.section_id = selectedSectionId;
            }
        } else {
            params.startDate = startDate;
            params.endDate = endDate;
             if (activeTab !== 'employee') {
                 if (selectedClassId) params.class_id = selectedClassId;
                 if (selectedSectionId) params.section_id = selectedSectionId;
            }
        }

        const res = await axiosInstance.get("/v1/attendance/report", { params });
        if (res.data.success) {
            setReportData(res.data.data);
        }
    } catch (err) {
        console.error("Error fetching report:", err);
        toast.error("Failed to generate report");
    } finally {
        setLoading(false);
    }
  };

  useEffect(() => {
    fetchReport();
  }, [activeTab, selectedClassId, selectedSectionId, startDate, endDate]);

  const filteredSections = sections.filter(s => s.classId?._id === selectedClassId || s.classId === selectedClassId);

  // Calculate Stats
  const totalRecords = reportData.length;
  const presentCount = reportData.filter(r => r.status === 'present').length;
  const absentCount = reportData.filter(r => r.status === 'absent').length;
  const lateCount = reportData.filter(r => r.status === 'late').length;
  const leaveCount = reportData.filter(r => r.status === 'leave').length;

  const presentPercentage = totalRecords > 0 ? ((presentCount / totalRecords) * 100).toFixed(1) : 0;

  const stats = [
    { label: t("reports_page.avg_attendance"), value: `${presentPercentage}%`, delta: 'Rate', icon: UserCheck, color: 'text-[#00bd7f]', bg: 'bg-[#00bd7f]/10' },
    { label: t("reports_page.morning_lates"), value: lateCount, delta: 'Count', icon: Clock, color: 'text-rose-500', bg: 'bg-rose-50' },
    { label: "Absences", value: absentCount, delta: 'Count', icon: TrendingUp, color: 'text-amber-600', bg: 'bg-amber-50' },
    { label: t("reports_page.leave_tracking"), value: leaveCount, delta: 'Active', icon: PieChart, color: 'text-indigo-600', bg: 'bg-indigo-50' }
  ];

  return (
    <div className="min-h-screen bg-slate-50/50 p-4 md:p-8 animate-in fade-in duration-500">
      <div className="max-w-[1600px] mx-auto space-y-8">
        
        {/* Header Section */}
        <div className="bg-white rounded-[20px] border border-slate-200 p-8 shadow-sm flex flex-col lg:flex-row justify-between items-center gap-6">
          <div className="flex items-center gap-6">
            <div className="w-16 h-16 bg-[#00bd7f]/10 rounded-2xl flex items-center justify-center border border-[#00bd7f]/20 shadow-inner">
              <CalendarCheck className="w-8 h-8 text-[#00bd7f]" />
            </div>
            <div>
              <h1 className="text-2xl md:text-3xl font-black text-slate-800 tracking-tight uppercase">{t("reports_page.presence_analytics")}</h1>
              <p className="text-slate-500 font-bold mt-1 uppercase tracking-widest text-[10px]">{t("reports_page.presence_desc")}</p>
            </div>
          </div>
        </div>

        {/* Holistic Stats Section */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
           {stats.map((stat, idx) => (
              <div key={idx} className="bg-white rounded-2xl border border-slate-200 p-6 shadow-sm group hover:border-[#00bd7f]/30 transition-all cursor-default relative overflow-hidden">
                 <div className="absolute top-0 right-0 w-16 h-16 bg-slate-50 rounded-bl-full -mr-8 -mt-8 opacity-20 group-hover:bg-[#00bd7f]/10 group-hover:opacity-100 transition-all"></div>
                 <div className="flex justify-between items-center mb-6 relative z-10">
                    <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">{stat.label}</p>
                    <div className={`w-10 h-10 rounded-xl flex items-center justify-center ${stat.bg} ${stat.color} transition-all`}>
                       <stat.icon className="w-5 h-5" />
                    </div>
                 </div>
                 <div className="flex items-end justify-between relative z-10">
                    <h4 className="text-3xl font-black text-slate-800 tracking-tight">{stat.value}</h4>
                    <span className={`text-[10px] font-black uppercase tracking-widest px-2 py-0.5 rounded-md ${
                      stat.delta === 'Rate' ? 'bg-emerald-50 text-[#00bd7f]' : 'bg-slate-100 text-slate-400'
                    }`}>{stat.delta}</span>
                 </div>
              </div>
           ))}
        </div>

        {/* Workspace Container */}
        <div className="bg-white rounded-[2rem] border border-slate-200 shadow-sm overflow-hidden min-h-[700px]">
           {/* Tab Navigation Navigation */}
           <div className="p-4 bg-slate-50/50 border-b border-slate-100 flex flex-wrap gap-2">
              {tabs.map((tab) => (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id)}
                  className={`flex items-center gap-3 px-8 py-4 rounded-xl font-black transition-all text-[11px] uppercase tracking-widest ${
                    activeTab === tab.id 
                      ? "bg-[#00bd7f] text-white shadow-xl shadow-[#00bd7f]/20 scale-[1.03]" 
                      : "text-slate-400 hover:bg-white hover:text-slate-600 shadow-sm border border-transparent hover:border-slate-100"
                  }`}
                >
                  <tab.icon className={`w-4 h-4 ${activeTab === tab.id ? "text-white" : "text-slate-300"}`} />
                  {tab.label}
                </button>
              ))}
           </div>

           {/* Workspace Header */}
           <div className="p-10 border-b border-slate-50 flex flex-col xl:flex-row justify-between items-center gap-8">
              <div className="flex gap-4 flex-wrap w-full">
                 {/* Filters */}
                 {activeTab !== 'employee' && (
                     <>
                     <select 
                        value={selectedClassId}
                        onChange={(e) => setSelectedClassId(e.target.value)}
                        className="bg-slate-50 border border-slate-100 rounded-xl px-4 py-3 text-xs font-black uppercase tracking-widest outline-none focus:border-[#00bd7f]"
                     >
                        <option value="">All Classes</option>
                        {classes.map(c => <option key={c._id} value={c._id}>{c.name}</option>)}
                     </select>
                     <select
                        value={selectedSectionId} 
                        onChange={(e) => setSelectedSectionId(e.target.value)}
                        className="bg-slate-50 border border-slate-100 rounded-xl px-4 py-3 text-xs font-black uppercase tracking-widest outline-none focus:border-[#00bd7f]"
                     >
                        <option value="">All Sections</option>
                        {filteredSections.map(s => <option key={s._id} value={s._id}>{s.name}</option>)}
                     </select>
                     </>
                 )}
                 
                 <div className="flex items-center gap-2 bg-slate-50 border border-slate-100 rounded-xl px-4 py-2">
                    <span className="text-[10px] font-black uppercase text-slate-400">Date:</span>
                    <input 
                        type="date"
                        value={startDate}
                        onChange={(e) => setStartDate(e.target.value)}
                        className="bg-transparent outline-none text-xs font-bold"
                    />
                    {activeTab === 'overview' && (
                        <>
                        <span className="text-slate-300">-</span>
                        <input 
                            type="date"
                            value={endDate}
                            onChange={(e) => setEndDate(e.target.value)}
                            className="bg-transparent outline-none text-xs font-bold"
                        />
                        </>
                    )}
                 </div>

                 <button onClick={fetchReport} className="px-6 py-3 bg-[#00bd7f] text-white rounded-xl text-[10px] font-black uppercase tracking-widest hover:bg-emerald-600 transition-all shadow-lg shadow-emerald-200">
                    Apply Filter
                 </button>
              </div>
           </div>

           {/* Workspace Table */}
           <div className="overflow-x-auto">
              {loading ? (
                  <div className="flex justify-center py-20">
                      <div className="w-10 h-10 border-4 border-[#00bd7f] border-t-transparent rounded-full animate-spin"></div>
                  </div>
              ) : (
              <table className="w-full border-collapse">
                 <thead>
                    <tr className="bg-[#00bd7f]/5 border-b border-slate-50 text-[10px] font-black text-slate-500 uppercase tracking-widest whitespace-nowrap">
                       <th className="px-10 py-6 text-left">{t("reports_page.entity_specs")}</th>
                       <th className="px-10 py-6 text-center">{t("reports_page.lifecycle_status")}</th>
                       <th className="px-10 py-6 text-center">Date</th>
                       {activeTab === 'overview' && <th className="px-10 py-6 text-center">Type</th>}
                    </tr>
                 </thead>
                 <tbody className="divide-y divide-slate-50">
                    {reportData.length === 0 ? (
                        <tr><td colSpan="4" className="text-center py-10 text-slate-400 text-sm font-bold">No records found</td></tr>
                    ) : (
                        reportData.map((record, i) => (
                       <tr key={record._id || i} className="group hover:bg-slate-50/50 transition-all uppercase cursor-pointer">
                          <td className="px-10 py-6 text-left">
                             <div className="flex items-center gap-4">
                                <div className="w-12 h-12 bg-slate-100 rounded-2xl flex items-center justify-center font-black text-slate-400 group-hover:bg-[#00bd7f]/10 group-hover:text-[#00bd7f] transition-all border border-transparent group-hover:border-[#00bd7f]/20">
                                    {(i + 1).toString().padStart(2, '0')}
                                </div>
                                <div>
                                   <p className="text-sm font-black text-slate-800 tracking-tight group-hover:text-[#00bd7f] transition-colors">
                                       {record.student?.firstName ? `${record.student.firstName} ${record.student.lastName}` : (record.student?.name || "Unknown")}
                                       {record.employee?.name}
                                   </p>
                                   <p className="text-[9px] font-black text-slate-400 tracking-widest italic mt-0.5 underline decoration-[#00bd7f]/20">
                                       ID: {record.student?.studentID || record.employee?.employeeID || "N/A"}
                                   </p>
                                </div>
                             </div>
                          </td>
                          <td className="px-10 py-6 text-center">
                             <div className={`inline-flex items-center gap-2 px-6 py-2 rounded-xl text-[9px] font-black tracking-widest border transition-all ${
                                record.status === 'absent'
                                  ? "bg-rose-50 text-rose-500 border-rose-100 shadow-sm" 
                                  : record.status === 'late'
                                    ? "bg-amber-50 text-amber-500 border-amber-100 shadow-sm" 
                                    : "bg-[#00bd7f]/10 text-[#00bd7f] border-[#00bd7f]/20 shadow-sm"
                             }`}>
                                <Activity className="w-3 h-3" />
                                {record.status?.toUpperCase()}
                             </div>
                          </td>
                          <td className="px-10 py-6 text-center text-sm font-black text-slate-600 font-mono tracking-tighter">
                              {new Date(record.date).toLocaleDateString()}
                          </td>
                           {activeTab === 'overview' && (
                               <td className="px-10 py-6 text-center text-xs font-bold text-slate-500">
                                   {record.type}
                               </td>
                           )}
                       </tr>
                    )))}
                 </tbody>
              </table>
              )}
           </div>

           {/* Metrics Legend Footer */}
           <div className="p-10 bg-slate-50/10 flex flex-col md:flex-row justify-between items-center border-t border-slate-100 gap-6">
              <div className="flex items-center gap-12 text-[10px] font-black uppercase tracking-widest text-slate-400">
                 <div className="flex items-center gap-3">
                    <div className="w-2.5 h-2.5 rounded-full bg-[#00bd7f]"></div> Present
                 </div>
                 <div className="flex items-center gap-3">
                    <div className="w-2.5 h-2.5 rounded-full bg-rose-500"></div> Absent
                 </div>
                 <div className="flex items-center gap-3">
                    <div className="w-2.5 h-2.5 rounded-full bg-amber-500"></div> Late
                 </div>
              </div>
           </div>
        </div>
      </div>
    </div>
  );
};

export default AttendanceReports;
