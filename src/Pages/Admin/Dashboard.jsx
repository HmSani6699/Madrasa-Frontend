import {
  Users,
  GraduationCap,
  Wallet,
  CalendarCheck,
  ArrowUpRight,
  TrendingUp,
  MoreHorizontal,
  CalendarDays,
  Bell,
} from "lucide-react";
import RecentAdmissions from "../../components/RecentAdmissions";
import { useAuth } from "../../context/AuthContext";
import { useTranslation } from "react-i18next";
import { Link } from "react-router";

const AdminDashboard = () => {
  const { user, currentMadrasa } = useAuth();
  const { t } = useTranslation();

  // Mock Stats Data
  const stats = [
    {
      title: t("dashboard.total_students"),
      value: "1,250",
      icon: Users,
      color: "text-blue-600",
      bg: "bg-blue-50",
    },
    {
      title: t("dashboard.active_staff"),
      value: "48",
      icon: GraduationCap,
      color: "text-purple-600",
      bg: "bg-purple-50",
    },
    {
      title: t("dashboard.total_subjects"),
      value: "16",
      icon: CalendarCheck,
      color: "text-amber-600",
      bg: "bg-amber-50",
    },
    {
      title: t("dashboard.daily_collection"),
      value: "৳ 25,400",
      icon: Wallet,
      color: "text-emerald-600",
      bg: "bg-emerald-50",
    },
  ];

  // Mock Notices
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
    <div className="p-4 md:p-8 space-y-8 animate-in fade-in duration-500">
      {/* 1. Dashboard Header */}
      {/* <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl md:text-3xl font-bold text-slate-800 tracking-tight">
            {currentMadrasa?.name || "Admin Dashboard"}
          </h1>
          <p className="text-slate-500 text-sm font-medium mt-1">
            Welcome back, {user?.name}
          </p>
        </div> */}
      {/* <div className="flex items-center gap-3">
            <span className="px-3 py-1 bg-white border border-slate-200 rounded-full text-xs font-semibold text-slate-600 shadow-sm">
                Academic Year: 2025-26
            </span>
            <button className="p-2 bg-white border border-slate-200 rounded-lg text-slate-500 hover:text-primary hover:border-primary/30 transition-all shadow-sm">
                <Bell className="w-5 h-5" />
            </button>
        </div> */}
      {/* </div> */}

      {/* 2. Key Metrics Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        {stats.map((stat, index) => (
          <div
            key={index}
            className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm hover:shadow-md transition-shadow"
          >
            <div className="flex items-start justify-between mb-4">
              <div className={`p-3 rounded-xl ${stat.bg} ${stat.color}`}>
                <stat.icon className="w-6 h-6" />
              </div>
            </div>
            <div>
              <h3 className="text-3xl font-bold text-slate-800 tracking-tight mb-1">
                {stat.value}
              </h3>
              <p className="text-sm font-medium text-slate-500">{stat.title}</p>
            </div>
          </div>
        ))}
      </div>

      {/* 3. Main Content Grid */}
      <div className="grid grid-cols-1 xl:grid-cols-3 gap-8">
        {/* Left Column (Main) */}
        <div className="xl:col-span-2 space-y-8">
          {/* Fees Collection Summary (Simplified) */}
          <div className="bg-white rounded-2xl border border-slate-200 shadow-sm p-6">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-lg font-bold text-slate-800">
                Fees Overview
              </h2>
              <button className="text-primary text-sm font-semibold hover:underline flex items-center gap-1">
                View Report <ArrowUpRight className="w-4 h-4" />
              </button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div className="p-4 rounded-xl bg-emerald-50 border border-emerald-100/50">
                <p className="text-xs font-bold text-emerald-600 uppercase tracking-wider mb-2">
                  Collected Today
                </p>
                <p className="text-2xl font-bold text-slate-800">৳ 25,400</p>
                <div className="flex items-center gap-1 mt-2 text-xs font-semibold text-emerald-600">
                  <TrendingUp className="w-3 h-3" /> +12% from yesterday
                </div>
              </div>
              <div className="p-4 rounded-xl bg-slate-50 border border-slate-100">
                <p className="text-xs font-bold text-slate-500 uppercase tracking-wider mb-2">
                  Monthly Target
                </p>
                <p className="text-2xl font-bold text-slate-800">৳ 450,000</p>
                <div className="w-full bg-slate-200 h-1.5 rounded-full mt-3 overflow-hidden">
                  <div
                    className="bg-primary h-full rounded-full"
                    style={{ width: "65%" }}
                  ></div>
                </div>
                <p className="text-[10px] text-slate-400 mt-1 font-medium">
                  65% Achieved
                </p>
              </div>
              <div className="p-4 rounded-xl bg-rose-50 border border-rose-100/50">
                <p className="text-xs font-bold text-rose-600 uppercase tracking-wider mb-2">
                  Pending Dues
                </p>
                <p className="text-2xl font-bold text-slate-800">৳ 120,500</p>
                <p className="text-[10px] text-rose-500/80 mt-2 font-medium">
                  42 Students
                </p>
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
        <div className="space-y-8">
          {/* Notice Board */}
          <div className="bg-white rounded-2xl border border-slate-200 shadow-sm p-6">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-lg font-bold text-slate-800">Notice Board</h2>
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
                View All Notices
              </button>
            </Link>
          </div>

          {/* Upcoming Event / Calendar Mini */}
          <div className="bg-gradient-to-br from-slate-900 to-slate-800 rounded-2xl p-6 text-white shadow-lg">
            <div className="flex items-center gap-3 mb-4">
              <div className="p-2 bg-white/10 rounded-lg">
                <CalendarDays className="w-5 h-5 text-white" />
              </div>
              <div>
                <p className="text-xs font-medium text-slate-400 uppercase tracking-wider">
                  Upcoming
                </p>
                <p className="font-bold">Annual Sports Day</p>
              </div>
            </div>
            <div className="flex items-end gap-2 mb-6">
              <span className="text-4xl font-bold">12</span>
              <span className="text-sm font-medium text-slate-400 mb-1">
                Days remaining
              </span>
            </div>
            <button className="w-full py-2 bg-white text-slate-900 text-sm font-bold rounded-lg hover:bg-indigo-50 transition-colors">
              View Calendar
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AdminDashboard;
