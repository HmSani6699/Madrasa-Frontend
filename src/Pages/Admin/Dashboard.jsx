import {
    Calendar,
    ArrowUpRight,
    TrendingUp,
    Zap,
    Users, 
    GraduationCap, 
    Wallet, 
    CalendarCheck,
    Clock,
    Bell,
    Search,
    BookOpen
} from "lucide-react";
import GreetingHeader from "../../components/Dashboard/GreetingHeader";
import DailyPulse from "../../components/Dashboard/DailyPulse";
import ActionCenter from "../../components/Dashboard/ActionCenter";
import RecentAdmissions from "../../components/RecentAdmissions";
import { useAuth } from "../../context/AuthContext";
import { useTranslation } from "react-i18next";

const AdminDashboard = () => {
  const { user, currentMadrasa } = useAuth();
  const { t } = useTranslation();

  // Mock Attendance Data
  const attendanceData = [85, 88, 92, 86, 90, 89, 94];

  // Dummy Data
  const stats = [
    { title: t('dashboard.total_students'), value: "1,250", icon: Users, color: "text-blue-600", bg: "bg-blue-50 dark:bg-blue-900/20" },
    { title: t('dashboard.active_staff'), value: "48", icon: GraduationCap, color: "text-purple-600", bg: "bg-purple-50 dark:bg-purple-900/20" },
    { title: t('dashboard.daily_collection'), value: "৳ 25,400", icon: Wallet, color: "text-emerald-600", bg: "bg-emerald-50 dark:bg-emerald-900/20" },
    { title: t('dashboard.attendance_rate'), value: "94%", icon: CalendarCheck, color: "text-amber-600", bg: "bg-amber-50 dark:bg-amber-900/20" },
  ];

  return (
    <div className="animate-in fade-in duration-700 pb-20 px-2 lg:px-0">
      
      {/* 1. High-Fidelity Greeting */}
      <GreetingHeader />

      {/* 2. Premium Daily Pulse */}
      <DailyPulse />

      {/* 3. Main Ecosystem Grid */}
      <div className="grid grid-cols-1 xl:grid-cols-12 gap-8 items-start">
         
         {/* Left Column: Command & Analytics (8/12 width) */}
         <div className="xl:col-span-8 space-y-8">
            
            {/* Action Center & Financial Mini-Dashboard */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                 {/* Financial Overview Card - Redesigned for SaaS feel */}
                 <div className="group relative bg-slate-900 rounded-[2.5rem] p-8 text-white shadow-2xl overflow-hidden min-h-[300px] flex flex-col justify-between">
                    {/* Atmospheric Glow */}
                    <div className="absolute top-0 right-0 w-64 h-64 bg-primary rounded-full blur-[100px] opacity-20 -mr-20 -mt-20 group-hover:opacity-30 transition-opacity" />
                    
                    <div className="relative z-10">
                        <div className="flex justify-between items-start mb-8">
                            <div>
                                <h3 className="text-xl font-bold tracking-tight">{currentMadrasa?.name || "Institutional Finance"}</h3>
                                <p className="text-slate-400 text-xs font-medium uppercase tracking-widest mt-1">Operational Metrics</p>
                            </div>
                            <div className="flex items-center gap-2 bg-emerald-500/10 text-emerald-400 px-3 py-1.5 rounded-xl border border-emerald-500/20 text-xs font-black">
                                <TrendingUp className="w-3.5 h-3.5" />
                                +12.4%
                            </div>
                        </div>
                        
                        <div className="space-y-6">
                            <div>
                                <p className="text-slate-400 text-[10px] font-black uppercase tracking-widest mb-1">Mtd Revenue</p>
                                <div className="flex items-baseline gap-2">
                                    <span className="text-5xl font-black tracking-tighter">৳ 1.2M</span>
                                    <span className="text-slate-500 text-sm font-bold">BDT</span>
                                </div>
                            </div>
                            
                            <div className="flex gap-10">
                                <div>
                                    <p className="text-slate-500 text-[10px] font-bold uppercase tracking-wider mb-1">Active Budget</p>
                                    <p className="text-lg font-bold text-slate-200">৳ 450k</p>
                                </div>
                                <div>
                                    <p className="text-slate-500 text-[10px] font-bold uppercase tracking-wider mb-1">Unpaid Fees</p>
                                    <p className="text-lg font-bold text-rose-400">৳ 120k</p>
                                </div>
                            </div>
                        </div>
                    </div>

                    <button className="relative z-10 w-full mt-8 py-4 bg-white/5 hover:bg-white/10 border border-white/10 rounded-2xl text-sm font-black uppercase tracking-widest transition-all text-slate-300 hover:text-white flex items-center justify-center gap-2">
                        View Detailed Ledger
                        <ArrowUpRight className="w-4 h-4" />
                    </button>
                 </div>

                 {/* Action Center - Should be refined internally as well */}
                 <div className="flex flex-col">
                    <ActionCenter />
                 </div>
            </div>

            {/* Attendance Analytics with Premium Charting feel */}
            <div className="bg-white dark:bg-slate-800 p-8 rounded-[2.5rem] border border-slate-100 dark:border-slate-700 shadow-sm relative overflow-hidden group">
                <div className="flex items-center justify-between mb-10">
                    <div>
                        <div className="flex items-center gap-2 mb-1">
                            <h3 className="text-xl font-black text-slate-900 dark:text-white tracking-tight">Weekly Engagement</h3>
                            <div className="bg-primary/10 px-2 py-0.5 rounded text-[10px] font-black text-primary uppercase animate-pulse">Live</div>
                        </div>
                        <p className="text-slate-500 dark:text-slate-400 text-xs font-medium">Tracking student presence across all departments.</p>
                    </div>
                    <div className="flex items-center gap-2">
                        <button className="p-3 bg-slate-50 dark:bg-slate-900 rounded-xl text-slate-400 hover:text-primary transition-all shadow-inner">
                            <Calendar className="w-5 h-5" />
                        </button>
                        <button className="px-5 py-2.5 bg-primary text-white text-xs font-black uppercase tracking-widest rounded-xl shadow-lg shadow-primary/20 hover:scale-[1.02] transition-all">Report</button>
                    </div>
                </div>
                
                <div className="h-56 flex items-end justify-between gap-6 px-4">
                    {attendanceData.map((value, idx) => (
                        <div key={idx} className="flex-1 max-w-[40px] h-full flex flex-col justify-end gap-3 group/bar">
                            <div className="relative h-full w-full bg-slate-50 dark:bg-slate-900 rounded-2xl overflow-hidden shadow-inner">
                                <div 
                                    className="absolute bottom-0 left-0 w-full bg-gradient-to-t from-primary via-primary/80 to-primary/40 rounded-2xl transition-all duration-1000 ease-out group-hover/bar:brightness-110 shadow-[0_0_20px_rgba(5,150,105,0.2)]"
                                    style={{ height: `${value}%`, transitionDelay: `${idx * 100}ms` }}
                                >
                                    <div className="absolute top-2 left-1/2 -translate-x-1/2 w-1 h-3 bg-white/20 rounded-full" />
                                </div>
                            </div>
                            <span className="text-[10px] font-black text-slate-400 dark:text-slate-500 text-center uppercase tracking-widest">{ ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'][idx] }</span>
                        </div>
                    ))}
                </div>
                
                {/* Visual Accent */}
                <div className="absolute top-0 right-0 p-10 opacity-[0.03] pointer-events-none">
                    <Zap className="w-40 h-40 text-slate-900 dark:text-white" />
                </div>
            </div>
         </div>

         {/* Right Column: High-Activity Zones (4/12 width) */}
         <div className="xl:col-span-4 space-y-8">
             <div className="sticky top-24">
                <RecentAdmissions />
                
                {/* Secondary Feature Card */}
                <div className="mt-8 p-8 bg-gradient-to-br from-indigo-600 to-indigo-800 rounded-[2.5rem] text-white shadow-xl relative overflow-hidden group">
                   <div className="absolute top-0 right-0 w-32 h-32 bg-white/10 rounded-full blur-2xl -mr-10 -mt-10" />
                   <h4 className="text-lg font-black mb-2 flex items-center gap-2">
                       <Zap className="w-5 h-5 text-amber-400 fill-amber-400" />
                       Academic Calendar
                   </h4>
                   <p className="text-indigo-100 text-sm mb-6 leading-relaxed">Preparation for Mid-term exams starts in 12 days. Verify all exam papers.</p>
                   <button className="w-full py-3 bg-white/10 hover:bg-white/20 border border-white/20 rounded-xl text-xs font-bold transition-all backdrop-blur-sm shadow-xl">Scheduled Tasks</button>
                </div>
             </div>
         </div>
      </div>
    </div>
  );
};

export default AdminDashboard;
