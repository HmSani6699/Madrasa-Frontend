import { useState } from "react";
import { Outlet } from "react-router";
import { Menu, X, ShieldAlert, Lock, LogOut, Mail, PhoneCall } from "lucide-react";
import Sidebar from "../components/Sidebar";
import Navbar from "../components/Navbar";
import { useAuth } from "../context/AuthContext";

const MainLayout = () => {
  const [isMobileSidebarOpen, setIsMobileSidebarOpen] = useState(false);
  const { currentMadrasa, user, logout } = useAuth();

  const status = (currentMadrasa?.status || "Active").toLowerCase();
  const isSuspendedOrBlocked = status === "suspended" || status === "blocked";
  const isSuperAdmin = user?.role === "super_admin";

  if (isSuspendedOrBlocked && !isSuperAdmin) {
    const isBlocked = status === "blocked";

    const title = isBlocked
      ? "মাদ্রাসা প্যানেলটি সম্পূর্ণ ব্লক করা হয়েছে (Madrasa Blocked)"
      : "মাদ্রাসা সাবস্ক্রিপশন স্থগিত করা হয়েছে (Subscription Suspended)";

    const defaultReason = isBlocked
      ? "নিরাপত্তা নীতি বা পলিসি লঙ্ঘনের কারণে সুপার এডমিন আপনার মাদ্রাসা প্যানেলের সকল এক্সেস সম্পূর্ণ ব্লক করে দিয়েছেন।"
      : "পরবর্তী বিল পরিশোধ না করার কারণে বা বকেয়া থাকার কারণে আপনার মাদ্রাসার এডমিন প্যানেলটি সাময়িকভাবে স্থগিত করা হয়েছে।";

    const reason = currentMadrasa?.statusMessage || defaultReason;

    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-900 via-emerald-950 to-slate-950 flex items-center justify-center p-4 md:p-8 relative overflow-hidden font-sans">
        {/* Animated background glows */}
        <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-primary/10 rounded-full blur-3xl animate-pulse" />
        <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-emerald-500/5 rounded-full blur-3xl animate-pulse delay-700" />

        {/* Frosted Glass Card Container */}
        <div className="relative w-full max-w-xl bg-white/5 backdrop-blur-2xl border border-white/10 rounded-3xl p-6 md:p-8 text-center shadow-[0_20px_50px_rgba(0,0,0,0.3)] animate-in fade-in zoom-in-95 duration-500 flex flex-col items-center">

          {/* Animated Glow Warning Badge */}
          <div className={`w-20 h-20 bg-gradient-to-br rounded-2xl flex items-center justify-center text-white shadow-lg mb-6 animate-bounce ${isBlocked
            ? "from-red-500 to-rose-700 shadow-rose-500/40"
            : "from-amber-500 to-orange-600 shadow-orange-500/40"
            }`}>
            {isBlocked ? <ShieldAlert className="w-10 h-10 animate-pulse" /> : <Lock className="w-10 h-10" />}
          </div>

          {/* Madrasa Title and Status */}
          <h2 className="text-xl md:text-2xl font-black text-white tracking-tight leading-snug mb-2 uppercase">
            {currentMadrasa?.name || "Talim Soft"}
          </h2>
          <span className={`px-4 py-1 rounded-full text-[10px] font-black tracking-widest uppercase mb-6 inline-block border ${isBlocked
            ? "bg-red-500/10 border-red-500/30 text-red-400"
            : "bg-amber-500/10 border-amber-500/30 text-amber-400"
            }`}>
            {isBlocked ? "Blocked" : "Suspended"}
          </span>

          {/* Alert Main Headline */}
          <h3 className="text-base md:text-lg font-bold text-white mb-4 leading-normal">
            {title}
          </h3>

          {/* Custom Message/Reason Quote Block */}
          <div className="w-full bg-white/5 border border-white/5 rounded-2xl p-6 text-sm text-slate-300 mb-8 leading-relaxed text-left relative mt-2">
            <div className="absolute -top-3 left-6 px-3 py-0.5 bg-slate-900 border border-white/10 rounded-full text-[9px] font-bold text-slate-400 uppercase tracking-widest">
              কারণ / বার্তা (Notice)
            </div>
            <p className="text-slate-200 font-medium italic mt-2">
              "{reason}"
            </p>
          </div>

          {/* Quick Support Hotline Card */}
          <div className="w-full grid grid-cols-2 gap-4 mb-8">
            <div className="bg-slate-900/40 border border-white/5 rounded-xl p-4 flex flex-col items-center justify-center gap-1 group hover:bg-slate-900/60 transition-colors">
              <PhoneCall className="w-4 h-4 text-emerald-400 group-hover:scale-110 transition-transform" />
              <p className="text-[10px] text-slate-400 font-bold uppercase tracking-wider">Hotline</p>
              <p className="text-xs text-white font-bold">+880 1700-000000</p>
            </div>
            <div className="bg-slate-900/40 border border-white/5 rounded-xl p-4 flex flex-col items-center justify-center gap-1 group hover:bg-slate-900/60 transition-colors">
              <Mail className="w-4 h-4 text-emerald-400 group-hover:scale-110 transition-transform" />
              <p className="text-[10px] text-slate-400 font-bold uppercase tracking-wider">Support Email</p>
              <p className="text-xs text-white font-bold">support@talimsoft.com</p>
            </div>
          </div>

          {/* Action Buttons */}
          <div className="w-full flex flex-col sm:flex-row gap-4 items-center justify-stretch">
            <a
              href="mailto:support@talimsoft.com"
              className="w-full sm:flex-1 py-3 px-6 bg-gradient-to-r from-emerald-500 to-teal-600 hover:from-emerald-600 hover:to-teal-700 text-white font-bold text-xs rounded-xl shadow-lg shadow-emerald-500/20 hover:scale-[1.02] active:scale-95 transition-all text-center uppercase tracking-wider"
            >
              যোগাযোগ করুন (Contact Support)
            </a>
            <button
              onClick={logout}
              className="w-full sm:w-auto py-3 px-6 bg-white/5 hover:bg-white/10 text-white font-bold text-xs rounded-xl border border-white/10 active:scale-95 transition-all flex items-center justify-center gap-2 uppercase tracking-wider"
            >
              <LogOut className="w-4 h-4 text-slate-400" />
              <span>প্রস্থান (Log Out)</span>
            </button>
          </div>

        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background flex transition-colors duration-300">
      {/* Mobile Sidebar Overlay */}
      {isMobileSidebarOpen && (
        <div
          className="fixed inset-0 bg-gray-900/60 z-40 md:hidden backdrop-blur-[2px] transition-all duration-300 animate-in fade-in"
          onClick={() => setIsMobileSidebarOpen(false)}
        />
      )}

      {/* Sidebar - Passed mobile state */}
      <Sidebar
        isMobileOpen={isMobileSidebarOpen}
        closeMobile={() => setIsMobileSidebarOpen(false)}
      />

      <div className="flex-1 md:ml-72 flex flex-col min-h-screen transition-all duration-300 w-full overflow-x-hidden pt-[73px]">
        {/* Top Navbar */}
        <Navbar onMenuClick={() => setIsMobileSidebarOpen(true)} />

        {/* Main Content Area */}
        <main className="flex-1 p-4 md:p-8 bg-[#00315e0d] dark:bg-[#00315e0d] transition-colors duration-300">
          <div className="max-w-7xl mx-auto">
            <Outlet />
          </div>
        </main>
      </div>
    </div>
  );
};

export default MainLayout;
