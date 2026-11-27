import { Link, useLocation } from "react-router-dom";
import {
  BookOpen,
  LayoutDashboard,
  ClipboardEdit,
  CalendarRange,
  FileBarChart2,
} from "lucide-react";

const HifzPageHeader = ({ basePath = "/admin/hifz", rightActions = null }) => {
  const location = useLocation();

  const tabs = [
    {
      label: "ড্যাশবোর্ড",
      path: `${basePath}/dashboard`,
      icon: LayoutDashboard,
    },
    {
      label: "দৈনিক এন্ট্রি",
      path: `${basePath}/daily-entry`,
      icon: ClipboardEdit,
    },
    {
      label: "সাপ্তাহিক খাতা",
      path: `${basePath}/weekly-khata`,
      icon: CalendarRange,
    },
    {
      label: "মাসিক রিপোর্ট ও প্রিন্ট",
      path: `${basePath}/monthly-report`,
      icon: FileBarChart2,
    },
  ];

  return (
    <div className="space-y-4">
      {/* Brand Header Banner matching Madrasa Sheba #123628 -> #1C7D5A + #EAB33C */}
      <div className="relative overflow-hidden rounded-2xl bg-gradient-to-r from-[#123628] via-[#175740] to-[#1C7D5A] text-white p-5 md:p-6 shadow-md border border-[#1C7D5A]/30">
        <div className="absolute -right-12 -top-12 w-48 h-48 rounded-full bg-[#EAB33C]/10 blur-2xl pointer-events-none" />
        <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div className="flex items-center gap-3.5">
            <div className="w-12 h-12 rounded-xl bg-white/15 border border-white/20 flex items-center justify-center shrink-0 text-[#EAB33C] shadow-inner">
              <BookOpen className="w-6 h-6" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h1 className="text-xl md:text-2xl font-bold tracking-tight">
                  হিফজ তথ্য খাতা
                </h1>
                <span className="hidden sm:inline-block px-2 py-0.5 text-[10px] font-bold rounded-full bg-[#EAB33C]/20 text-[#EAB33C] border border-[#EAB33C]/30">
                  ডিজিটাল রেজিস্টার
                </span>
              </div>
              <p className="text-xs md:text-sm text-emerald-100/85 mt-0.5">
                সবক, সাত সবক, আমুখতা, দৈনিক তিলাওয়াত ও সাপ্তাহিক পরীক্ষা — কাওমী আদর্শে সহজ হিসাব
              </p>
            </div>
          </div>

          {rightActions && <div className="flex flex-wrap items-center gap-2">{rightActions}</div>}
        </div>
      </div>

      {/* Sub-Navigation Pills */}
      <div className="flex flex-wrap items-center gap-2">
        {tabs.map((tab) => {
          const active = location.pathname === tab.path;
          const IconComp = tab.icon;
          return (
            <Link
              key={tab.path}
              to={tab.path}
              className={`inline-flex items-center gap-2 px-4 py-2 rounded-xl text-sm font-semibold transition-all border ${
                active
                  ? "bg-[#1C7D5A] text-white border-[#1C7D5A] shadow-sm shadow-[#1C7D5A]/25"
                  : "bg-surface text-fg-muted border-border hover:border-[#1C7D5A]/40 hover:text-[#1C7D5A] hover:bg-primary-light/50 dark:hover:bg-[#1C7D5A]/15"
              }`}
            >
              <IconComp className="w-4 h-4" />
              <span>{tab.label}</span>
            </Link>
          );
        })}
      </div>
    </div>
  );
};

export default HifzPageHeader;
