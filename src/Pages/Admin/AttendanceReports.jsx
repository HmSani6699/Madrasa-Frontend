import { useState, useEffect } from "react";
import { useTranslation } from "react-i18next";
import { useLocation } from "react-router-dom";
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

const AttendanceReports = () => {
  const { t } = useTranslation();
  const location = useLocation();
  const [activeTab, setActiveTab] = useState("daily");

  useEffect(() => {
    const path = location.pathname;
    if (path.includes("student-daily")) setActiveTab("daily");
    else if (path.includes("student-overview")) setActiveTab("overview");
    else if (path.includes("employee")) setActiveTab("employee");
    else setActiveTab("daily");
  }, [location.pathname]);

  const tabs = [
    { id: "daily", label: t("reports_page.daily_presence"), icon: Activity },
    { id: "overview", label: t("reports_page.student_aggregate"), icon: ClipboardCheck },
    { id: "employee", label: t("reports_page.staff_attendance_summary"), icon: Users },
  ];

  const stats = [
    { label: t("reports_page.avg_attendance"), value: '94.2%', delta: '+1.2%', icon: UserCheck, color: 'text-[#00bd7f]', bg: 'bg-[#00bd7f]/10' },
    { label: t("reports_page.morning_lates"), value: '08', delta: '-12%', icon: Clock, color: 'text-rose-500', bg: 'bg-rose-50' },
    { label: t("reports_page.punctuality_score"), value: '98%', delta: 'Optimal', icon: TrendingUp, color: 'text-amber-600', bg: 'bg-amber-50' },
    { label: t("reports_page.leave_tracking"), value: '15', delta: 'Active', icon: PieChart, color: 'text-indigo-600', bg: 'bg-indigo-50' }
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

          <div className="flex gap-4 w-full lg:w-auto">
             <button className="flex-1 lg:flex-none px-8 py-4 bg-white text-slate-500 rounded-xl font-black hover:bg-slate-50 transition-all flex items-center justify-center gap-3 border border-slate-200 uppercase tracking-widest text-[11px] shadow-sm">
               <Calendar className="w-5 h-5 text-[#00bd7f]" />
               {t("common.date_label")}
            </button>
            <button className="flex-[2] lg:flex-none px-8 py-4 bg-[#00bd7f] text-white rounded-xl font-black shadow-xl shadow-[#00bd7f]/20 hover:bg-[#009b68] hover:scale-[1.02] active:scale-95 transition-all flex items-center justify-center gap-3 uppercase tracking-widest text-[11px]">
              <Printer className="w-5 h-5" />
              {t("reports_page.consolidated_report")}
            </button>
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
                      stat.delta.includes('+') || stat.delta === 'Optimal' ? 'bg-emerald-50 text-[#00bd7f]' : 'bg-slate-100 text-slate-400'
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
              <div className="flex-1 space-y-3">
                 <h2 className="text-2xl font-black text-slate-800 tracking-tight uppercase">
                    {tabs.find(t => t.id === activeTab)?.label} {t("reports_page.analysis")}
                 </h2>
                 <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest italic flex items-center gap-2">
                    <div className="w-2 h-2 rounded-full bg-[#00bd7f] animate-pulse"></div>
                    {t("reports_page.realtime_data_viz")}
                 </p>
              </div>
              
              <div className="flex gap-4 shrink-0 w-full xl:w-auto">
                 <div className="relative group flex-1">
                    <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-300 group-focus-within:text-[#00bd7f] transition-colors" />
                    <input className="w-full xl:w-72 bg-slate-50 border border-slate-100 rounded-xl pl-11 pr-6 py-3.5 text-xs font-black focus:bg-white focus:border-[#00bd7f] focus:ring-4 focus:ring-[#00bd7f]/5 outline-none shadow-inner transition-all uppercase placeholder:text-slate-300" placeholder={t("reports_page.filter_entries")} />
                 </div>
                 <button className="px-10 py-3.5 bg-slate-900 text-white rounded-xl text-[10px] font-black uppercase tracking-widest hover:bg-slate-800 transition-all shadow-xl shadow-slate-200 flex items-center gap-3">
                    <Filter className="w-4 h-4 text-[#00bd7f]" />
                    {t("reports_page.advanced_filter")}
                 </button>
              </div>
           </div>

           {/* Workspace Table */}
           <div className="overflow-x-auto">
              <table className="w-full border-collapse">
                 <thead>
                    <tr className="bg-[#00bd7f]/5 border-b border-slate-50 text-[10px] font-black text-slate-500 uppercase tracking-widest whitespace-nowrap">
                       <th className="px-10 py-6 text-left">{t("reports_page.entity_specs")}</th>
                       <th className="px-10 py-6 text-center">{t("reports_page.lifecycle_status")}</th>
                       <th className="px-10 py-6 text-center">{t("reports_page.clock_in")}</th>
                       <th className="px-10 py-6 text-center">{t("reports_page.clock_out")}</th>
                       <th className="px-10 py-6 text-center">{t("reports_page.productivity_gap")}</th>
                       <th className="px-10 py-6 text-right">{t("reports_page.system_remarks")}</th>
                    </tr>
                 </thead>
                 <tbody className="divide-y divide-slate-50">
                    {[1, 2, 3, 4, 5, 6].map((i) => (
                       <tr key={i} className="group hover:bg-slate-50/50 transition-all uppercase cursor-pointer">
                          <td className="px-10 py-6 text-left">
                             <div className="flex items-center gap-4">
                                <div className="w-12 h-12 bg-slate-100 rounded-2xl flex items-center justify-center font-black text-slate-400 group-hover:bg-[#00bd7f]/10 group-hover:text-[#00bd7f] transition-all border border-transparent group-hover:border-[#00bd7f]/20">M{i}</div>
                                <div>
                                   <p className="text-sm font-black text-slate-800 tracking-tight group-hover:text-[#00bd7f] transition-colors">MD. {i % 2 === 0 ? "Abdullah" : "Rahim"} Al Mamun</p>
                                   <p className="text-[9px] font-black text-slate-400 tracking-widest italic mt-0.5 underline decoration-[#00bd7f]/20">Entity ID: {i + 120} | Group: A-Level</p>
                                </div>
                             </div>
                          </td>
                          <td className="px-10 py-6 text-center">
                             <div className={`inline-flex items-center gap-2 px-6 py-2 rounded-xl text-[9px] font-black tracking-widest border transition-all ${
                                i % 4 === 0 
                                  ? "bg-rose-50 text-rose-500 border-rose-100 shadow-sm" 
                                  : i % 5 === 0 
                                    ? "bg-amber-50 text-amber-500 border-amber-100 shadow-sm" 
                                    : "bg-[#00bd7f]/10 text-[#00bd7f] border-[#00bd7f]/20 shadow-sm"
                             }`}>
                                <Activity className="w-3 h-3" />
                                {i % 4 === 0 ? t("reports_page.absent").toUpperCase() : i % 5 === 0 ? t("reports_page.late").toUpperCase() : t("reports_page.present").toUpperCase()}
                             </div>
                          </td>
                          <td className="px-10 py-6 text-center text-sm font-black text-slate-600 font-mono tracking-tighter">08:15 AM</td>
                          <td className="px-10 py-6 text-center text-sm font-black text-slate-600 font-mono tracking-tighter">02:30 PM</td>
                          <td className="px-10 py-6 text-center">
                             <span className="text-[10px] font-black text-slate-400 tracking-widest px-3 py-1 bg-slate-50 rounded-lg group-hover:bg-white transition-all">6H 15M DURATION</span>
                          </td>
                          <td className="px-10 py-6 text-right">
                             <div className="flex items-center justify-end gap-2 text-slate-400 group-hover:text-slate-600 transition-colors">
                                <span className="text-[10px] font-black italic tracking-widest">Normal Cycle</span>
                                <ChevronRight className="w-4 h-4 opacity-0 group-hover:opacity-100 -translate-x-2 group-hover:translate-x-0 transition-all text-[#00bd7f]" />
                             </div>
                          </td>
                       </tr>
                    ))}
                 </tbody>
              </table>
           </div>

           {/* Metrics Legend Footer */}
           <div className="p-10 bg-slate-50/10 flex flex-col md:flex-row justify-between items-center border-t border-slate-100 gap-6">
              <div className="flex items-center gap-12 text-[10px] font-black uppercase tracking-widest text-slate-400">
                 <div className="flex items-center gap-3">
                    <div className="w-2.5 h-2.5 rounded-full bg-[#00bd7f]"></div> {t("reports_page.present")} (92.4%)
                 </div>
                 <div className="flex items-center gap-3">
                    <div className="w-2.5 h-2.5 rounded-full bg-rose-500"></div> {t("reports_page.absent")} (4.6%)
                 </div>
                 <div className="flex items-center gap-3">
                    <div className="w-2.5 h-2.5 rounded-full bg-amber-500"></div> {t("reports_page.late")} (3.0%)
                 </div>
              </div>
              
              <div className="flex gap-2">
                 <button className="p-3 bg-white border border-slate-200 rounded-xl text-slate-400 hover:text-[#00bd7f] hover:border-[#00bd7f]/30 transition-all shadow-sm"><ChevronLeft className="w-4 h-4" /></button>
                 {[1, 2, 3].map(p => (
                   <button key={p} className={`px-5 py-2.5 rounded-xl font-black text-xs transition-all ${p === 1 ? 'bg-[#00bd7f] text-white shadow-lg shadow-[#00bd7f]/20' : 'bg-white text-slate-400 border border-slate-200 hover:bg-slate-50'}`}>{p}</button>
                 ))}
                 <button className="p-3 bg-white border border-slate-200 rounded-xl text-slate-400 hover:text-[#00bd7f] hover:border-[#00bd7f]/30 transition-all shadow-sm"><ChevronRight className="w-4 h-4" /></button>
              </div>
           </div>
        </div>
      </div>
    </div>
  );
};

export default AttendanceReports;
