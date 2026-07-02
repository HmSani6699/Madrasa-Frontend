import { useState, useEffect } from "react";
import {
  Users,
  GraduationCap,
  Wallet,
  CalendarCheck,
  MoreHorizontal,
  CalendarDays,
  Bell,
  Loader2,
} from "lucide-react";
import RecentAdmissions from "../../components/RecentAdmissions";
import { useAuth } from "../../context/AuthContext";
import { useTranslation } from "react-i18next";
import { Link } from "react-router";
import portalService from "../../services/portalService";

const AdminDashboard = () => {
  const { user, currentMadrasa } = useAuth();
  const { t } = useTranslation();
  const [loading, setLoading] = useState(true);
  const [dashboardData, setDashboardData] = useState({
    studentStats: null,
    financialOverview: null,
  });

  const sub = currentMadrasa?.subscription || {};
  const nextBillingDate = sub.nextBillingDate;
  const status = currentMadrasa?.status || "Active";
  
  let daysLeft = null;
  let showBillingWarning = false;
  
  if (nextBillingDate && status === "Active") {
    const dueDate = new Date(nextBillingDate);
    const today = new Date();
    dueDate.setHours(0,0,0,0);
    today.setHours(0,0,0,0);
    const diffTime = dueDate - today;
    daysLeft = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    
    if (daysLeft >= 0 && daysLeft <= 5) {
      showBillingWarning = true;
    }
  }

  useEffect(() => {
    fetchDashboardData();
  }, []);

  const fetchDashboardData = async () => {
    try {
      setLoading(true);
      const [studentStats, financialOverview] = await Promise.all([
        portalService.getStudentStats(),
        portalService.getFinancialOverview(),
      ]);
      setDashboardData({
        studentStats: studentStats.data,
        financialOverview: financialOverview.data,
      });
    } catch (err) {
      console.error("Failed to fetch dashboard data", err);
    } finally {
      setLoading(false);
    }
  };

  const classDistribution = (dashboardData.studentStats?.classDistribution || [
    { className: "Class 1", count: 28 },
    { className: "Class 2", count: 34 },
    { className: "Class 3", count: 29 },
    { className: "Class 4", count: 22 },
  ]).map((item) => ({
    name: item.className || item.name || item.class || "Class",
    count: item.studentCount || item.count || item.students || 0,
  }));

  const totalClassStudents = classDistribution.reduce(
    (sum, item) => sum + item.count,
    0
  );

  const chartColors = ["#00315e", "#0f766e", "#f59e0b", "#ef4444"];

  const stats = [
    {
      title: t("dashboard.total_students"),
      value: dashboardData.studentStats?.totalStudents || "0",
      icon: Users,
      color: "text-blue-600",
      bg: "bg-blue-50",
    },
    {
      title: t("dashboard.total_staff"),
      value: dashboardData.studentStats?.totalStaff || "0",
      icon: GraduationCap,
      color: "text-purple-600",
      bg: "bg-purple-50",
    },
    {
      title: t("dashboard.total_subjects"),
      value: dashboardData.studentStats?.totalSubjects || "0",
      icon: CalendarCheck,
      color: "text-amber-600",
      bg: "bg-amber-50",
    },
  ];

  const notices = [
    { id: 1, title: "Staff Meeting", date: "Today, 2:00 PM", type: "Urgent" },
    {
      id: 2,
      title: "Exam Schedule Published",
      date: "Yesterday",
      type: "Academic",
    },
    {
      id: 3,
      title: "Holiday Announcement",
      date: "2 days ago",
      type: "General",
    },
  ];

  return (
    <div className=" space-y-4 animate-in fade-in duration-500">
      {showBillingWarning && (
        <div className="bg-gradient-to-r from-amber-500 to-orange-600 text-white p-5 rounded-2xl shadow-lg shadow-orange-500/10 flex flex-col sm:flex-row sm:items-center justify-between gap-4 border border-orange-400/20">
          <div className="flex items-center gap-3">
            <div className="p-3 bg-white/10 rounded-xl shrink-0">
              <Bell className="w-6 h-6 text-white animate-bounce" />
            </div>
            <div>
              <p className="font-bold text-base">সাবস্ক্রিপশন মেয়াদ শেষের সতর্কতা! (Subscription Warning)</p>
              <p className="text-xs text-white/90 mt-0.5">আপনার মাদ্রাসার সাবস্ক্রিপশন মেয়াদের আর মাত্র <span className="font-bold underline">{daysLeft} দিন</span> বাকি আছে। সাময়িক বন্ধ হওয়া এড়াতে দয়া করে সময়মতো বিল পরিশোধ করুন।</p>
            </div>
          </div>
          <div className="shrink-0">
            <span className="bg-white text-orange-600 px-4 py-2 rounded-xl text-xs font-bold shadow-md block text-center border border-orange-100">
              Due Date: {new Date(nextBillingDate).toLocaleDateString("en-US", { year: 'numeric', month: 'long', day: 'numeric' })}
            </span>
          </div>
        </div>
      )}
  

      {/* 2. Key Metrics Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
        {stats.map((stat, index) => (
          <div
            key={index}
            className="bg-white p-6 rounded-[8px] shadow-sm hover:shadow-md transition-shadow flex items-center justify-between relative overflow-hidden "
          >
             <div className="absolute -top-[5%] -left-[20%] h-[200px] w-[200px] bg-[#00315e24] rounded-full group-hover:scale-110 transition-transform duration-500"></div>
            <div clsassName=" relative z-20 flex flex-col items-start">
              <h3 className="text-3xl font-bold text-slate-800 tracking-tight mb-1  relative z-20">
                {stat.value}
              </h3>
              <p className="text-sm font-medium text-slate-500  relative z-20">{stat.title}</p>
            </div>

            <div className="flex items-start justify-between mb-4">
              <div className={`p-3 rounded-xl ${stat.bg} ${stat.color}`}>
                <stat.icon className="w-6 h-6" />
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* 3. Main Content Grid */}
      <div className="grid grid-cols-1 xl:grid-cols-3 gap-4">
        {/* Left Column (Main) */}
        <div className="xl:col-span-2 space-y-4">
{/* Student Distribution Overview */}
          <div className="bg-white rounded-[8px] border border-slate-200 shadow-sm p-6">
            <div className="flex items-center justify-between mb-6">
              <div>
                <h2 className="text-lg font-bold text-slate-800">
                  Class-wise Student Distribution
                </h2>
                <p className="text-sm text-slate-500 mt-1">
                  A beautiful snapshot of how many students are in each class
                </p>
              </div>
              <div className="flex items-center gap-2 rounded-full bg-primary/10 px-3 py-1.5">
                <Users className="w-4 h-4 text-primary" />
                <span className="text-sm font-semibold text-primary">
                  {totalClassStudents || dashboardData.studentStats?.totalStudents || 0} Students
                </span>
              </div>
            </div>

            <div className="grid gap-6 lg:grid-cols-[220px_1fr] items-center">
              <div className="flex justify-center">
                <div className="relative w-44 h-44 rounded-full p-3 bg-gradient-to-br from-slate-50 to-slate-100 border border-slate-200 shadow-inner">
                  <div
                    className="w-full h-full rounded-full"
                    style={{
                      background: `conic-gradient(${chartColors[0]} 0deg 120deg, ${chartColors[1]} 120deg 240deg, ${chartColors[2]} 240deg 320deg, ${chartColors[3]} 320deg 360deg)`,
                    }}
                  ></div>
                  <div className="absolute inset-0 flex items-center justify-center">
                    <div className="text-center">
                      <p className="text-3xl font-bold text-slate-800">
                        {totalClassStudents || dashboardData.studentStats?.totalStudents || 0}
                      </p>
                      <p className="text-[10px] uppercase tracking-[0.25em] text-slate-400 mt-1">
                        Students
                      </p>
                    </div>
                  </div>
                </div>
              </div>

              <div className="space-y-3">
                {classDistribution.map((item, index) => {
                  const percentage = totalClassStudents
                    ? Math.round((item.count / totalClassStudents) * 100)
                    : 0;

                  return (
                    <div key={`${item.name}-${index}`} className="space-y-1.5">
                      <div className="flex items-center justify-between text-sm">
                        <div className="flex items-center gap-2">
                          <span
                            className="w-2.5 h-2.5 rounded-full"
                            style={{ backgroundColor: chartColors[index % chartColors.length] }}
                          ></span>
                          <span className="font-semibold text-slate-700">{item.name}</span>
                        </div>
                        <span className="text-slate-500 font-medium">{item.count}</span>
                      </div>
                      <div className="h-2 rounded-full bg-slate-100 overflow-hidden">
                        <div
                          className="h-full rounded-full"
                          style={{
                            width: `${percentage}%`,
                            backgroundColor: chartColors[index % chartColors.length],
                          }}
                        ></div>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          </div>

          {/* Recent Admissions Table */}
          <div>
            {/* Reusing existing component but assuming it fits well or we might need to wrap it specifically */}
            <RecentAdmissions />
          </div>
        </div>

        {/* Right Column (Sidebar) */}
        <div className="space-y-4">
          {/* Notice Board */}
          <div className="bg-white rounded-[8px] border border-slate-200 shadow-sm p-6">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-lg font-bold text-slate-800">{t("dashboard.notice_board")}</h2>
              <button className="p-1 hover:bg-slate-100 rounded-lg transition-colors">
                <MoreHorizontal className="w-5 h-5 text-slate-400" />
              </button>
            </div>
            <div className="space-y-4">
              {notices.map((notice) => (
                <div
                  key={notice.id}
                  className="flex gap-4 pb-4 border-b border-slate-100 last:border-0 last:pb-0 group cursor-pointer"
                >
                  <div className="flex-col items-center justify-center hidden sm:flex">
                    <div className="w-2 h-2 rounded-full bg-primary mt-2 group-hover:scale-125 transition-transform"></div>
                    <div className="w-0.5 h-full bg-slate-100 my-1 group-last:hidden"></div>
                  </div>
                  <div>
                    <h4 className="text-sm font-semibold text-slate-800 group-hover:text-primary transition-colors">
                      {notice.title}
                    </h4>
                    <p className="text-xs text-slate-500 mt-1">{notice.date}</p>
                    <span className="inline-block px-2 py-0.5 mt-2 bg-slate-100 text-slate-600 text-[10px] uppercase font-bold rounded">
                      {notice.type}
                    </span>
                  </div>
                </div>
              ))}
            </div>

            <Link to={"/admin/events"} className="cursor-pointer">
              <button className="w-full mt-6 py-2.5 text-sm font-semibold text-primary border border-primary/20 rounded-xl hover:bg-primary/5 transition-all cursor-pointer">
                {t("dashboard.view_all_notices")}
              </button>
            </Link>
          </div>

          {/* Upcoming Event / Calendar Mini */}
          <div className="bg-gradient-to-br from-slate-900 to-slate-800 rounded-[8px] p-6 text-white shadow-lg">
            <div className="flex items-center gap-3 mb-4">
              <div className="p-2 bg-white/10 rounded-lg">
                <CalendarDays className="w-5 h-5 text-white" />
              </div>
              <div>
                <p className="text-xs font-medium text-slate-400 uppercase tracking-wider">
                  {t("dashboard.upcoming")}
                </p>
                <p className="font-bold">Annual Sports Day</p>
              </div>
            </div>
            <div className="flex items-end gap-2 mb-6">
              <span className="text-4xl font-bold">12</span>
              <span className="text-sm font-medium text-slate-400 mb-1">
                {t("dashboard.days_remaining")}
              </span>
            </div>
            <button className="w-full py-2 bg-white text-slate-900 text-sm font-bold rounded-lg hover:bg-indigo-50 transition-colors">
              {t("dashboard.view_calendar")}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AdminDashboard;
