import { useState, useEffect } from "react";
import {
  ShieldCheck,
  Sparkles,
  Cpu,
  Activity,
  TrendingUp,
  Calendar,
  CreditCard,
  Users,
  CheckCircle2,
  AlertTriangle,
  Mail,
  Loader2,
} from "lucide-react";
import { useAuth } from "../../../context/AuthContext";
import portalService from "../../../services/portalService";
import SettingsPageHeader from "./SettingsPageHeader";

const SubscriptionPage = () => {
  const { currentMadrasa } = useAuth();
  const [studentStats, setStudentStats] = useState(null);
  const [statsLoading, setStatsLoading] = useState(true);

  useEffect(() => {
    const fetchStats = async () => {
      try {
        setStatsLoading(true);
        const res = await portalService.getStudentStats();
        setStudentStats(res.data);
      } catch (err) {
        console.error("Failed to load student stats for subscription page", err);
      } finally {
        setStatsLoading(false);
      }
    };
    fetchStats();
  }, []);

  const sub = currentMadrasa?.subscription || {};
  const planName = sub.plan || "Basic";
  const price = sub.price || 999;
  const billingCycle = sub.billingCycle || "monthly";
  const studentLimit = sub.studentLimit || 150;
  const currentStudents = studentStats?.totalStudents || 0;
  const remainingSlots = Math.max(studentLimit - currentStudents, 0);
  const utilizationPercentage = studentLimit
    ? Math.min(Math.round((currentStudents / studentLimit) * 100), 100)
    : 0;

  const renewalDateObj = sub.nextBillingDate ? new Date(sub.nextBillingDate) : null;
  const isValidDate = renewalDateObj && !Number.isNaN(renewalDateObj.getTime());
  const formattedRenewalDate = isValidDate
    ? renewalDateObj.toLocaleDateString("en-US", {
        year: "numeric",
        month: "short",
        day: "numeric",
      })
    : "N/A";

  const daysRemaining = isValidDate
    ? Math.ceil((renewalDateObj.getTime() - Date.now()) / (1000 * 60 * 60 * 24))
    : null;

  const kpis = [
    {
      label: "সক্রিয় প্ল্যান",
      value: `${planName} Tier`,
      sub: "Active License",
      icon: Sparkles,
      accent: "bg-emerald-50 text-[#1C7D5A]",
    },
    {
      label: "সাবস্ক্রিপশন ফি",
      value: `৳ ${price}`,
      sub: `প্রতি ${billingCycle}`,
      icon: CreditCard,
      accent: "bg-amber-50 text-amber-700",
    },
    {
      label: "পরবর্তী নবায়ন",
      value: formattedRenewalDate,
      sub:
        daysRemaining === null
          ? "নির্ধারিত নয়"
          : daysRemaining >= 0
          ? `${daysRemaining} দিন বাকি`
          : "মেয়াদ উত্তীর্ণ",
      icon: Calendar,
      accent: "bg-sky-50 text-sky-700",
    },
    {
      label: "শিক্ষার্থী ধারণক্ষমতা",
      value: statsLoading ? "..." : `${currentStudents} / ${studentLimit}`,
      sub: `${utilizationPercentage}% ব্যবহৃত`,
      icon: Users,
      accent:
        utilizationPercentage >= 90
          ? "bg-rose-50 text-rose-600"
          : "bg-emerald-50 text-[#1C7D5A]",
    },
  ];

  const includedFeatures = [
    "ছাত্র-ছাত্রী ভর্তি ও প্রোফাইল ম্যানেজমেন্ট",
    "হাজিরা ও স্বয়ংক্রিয় SMS নোটিফিকেশন",
    "হিসাবরক্ষণ, ফি আদায় ও বেতন-ভাতা",
    "পরীক্ষা, ফলাফল ও অনলাইন পোর্টাল",
  ];

  return (
    <div className="p-4 md:p-6 max-w-7xl mx-auto space-y-6 animate-fade-in">
      <SettingsPageHeader
        title="SaaS সাবস্ক্রিপশন ও লাইসেন্স"
        subtitle="প্রতিষ্ঠানের বর্তমান প্ল্যান, শিক্ষার্থী ধারণক্ষমতা এবং নবায়নের তথ্য পর্যবেক্ষণ করুন"
        icon={ShieldCheck}
        rightActions={
          <span className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-xl bg-emerald-50 border border-emerald-200 text-[#1C7D5A] text-xs font-bold">
            <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
            লাইসেন্স সক্রিয়
          </span>
        }
      />

      {/* KPI Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-4">
        {kpis.map((kpi) => {
          const IconComp = kpi.icon;
          return (
            <div
              key={kpi.label}
              className="bg-white rounded-2xl border border-slate-200/80 p-5 shadow-sm flex items-start justify-between gap-3"
            >
              <div>
                <p className="text-xs font-semibold text-slate-500">{kpi.label}</p>
                <p className="text-xl font-bold text-slate-800 mt-1">{kpi.value}</p>
                <p className="text-xs text-slate-400 mt-0.5">{kpi.sub}</p>
              </div>
              <div
                className={`w-10 h-10 rounded-xl flex items-center justify-center shrink-0 ${kpi.accent}`}
              >
                <IconComp className="w-5 h-5" />
              </div>
            </div>
          );
        })}
      </div>

      {/* Main Grid */}
      <div className="grid grid-cols-1 xl:grid-cols-12 gap-6 items-start">
        {/* Membership Pass Card */}
        <div className="xl:col-span-5 bg-white rounded-2xl border border-slate-200/80 p-5 md:p-6 shadow-sm space-y-4">
          <div className="flex items-center justify-between">
            <h2 className="text-sm font-bold text-slate-800 flex items-center gap-2">
              <Sparkles className="w-4 h-4 text-[#EAB33C]" />
              মেম্বারশিপ লাইসেন্স পাস
            </h2>
            <span className="text-[11px] font-mono text-slate-400">
              PASS-{(currentMadrasa?._id || "507f").toString().slice(-6).toUpperCase()}
            </span>
          </div>

          <div className="relative overflow-hidden bg-gradient-to-br from-[#0b1f17] via-[#123628] to-[#081510] rounded-2xl p-6 text-white shadow-lg border border-white/10 space-y-6">
            <div className="absolute -top-12 -right-12 w-44 h-44 bg-[#1C7D5A]/30 rounded-full blur-2xl pointer-events-none" />
            <div className="absolute -bottom-10 -left-10 w-36 h-36 bg-[#EAB33C]/15 rounded-full blur-2xl pointer-events-none" />

            <div className="flex items-center justify-between relative">
              <div className="flex items-center gap-2">
                <Cpu className="w-5 h-5 text-[#EAB33C]" />
                <span className="text-xs font-semibold text-white/80 truncate max-w-[200px]">
                  {currentMadrasa?.name || "Madrasa Sheba"}
                </span>
              </div>
              <span className="bg-emerald-400/15 border border-emerald-400/30 text-emerald-300 text-[11px] font-bold px-3 py-1 rounded-full">
                Active
              </span>
            </div>

            <div className="relative">
              <p className="text-[11px] font-semibold text-white/60 uppercase tracking-wider">
                Subscription Tier
              </p>
              <h3 className="text-3xl font-extrabold bg-clip-text text-transparent bg-gradient-to-r from-amber-200 via-[#EAB33C] to-amber-400 mt-1">
                {planName} Tier
              </h3>
            </div>

            <div className="flex items-end justify-between border-t border-white/10 pt-4 relative">
              <div>
                <p className="text-[10px] font-semibold text-white/50 uppercase">
                  Pricing Cycle
                </p>
                <p className="text-lg font-bold text-white mt-0.5">
                  ৳ {price}{" "}
                  <span className="text-xs font-normal text-white/70">
                    / {billingCycle}
                  </span>
                </p>
              </div>
              <div className="text-right">
                <p className="text-[10px] font-semibold text-white/50 uppercase">
                  Renewal Date
                </p>
                <p className="text-xs font-semibold text-[#EAB33C] mt-0.5">
                  {formattedRenewalDate}
                </p>
              </div>
            </div>
          </div>

          <div className="space-y-2 pt-1">
            <p className="text-xs font-bold text-slate-600">প্ল্যানে অন্তর্ভুক্ত সুবিধাসমূহ</p>
            <div className="grid grid-cols-1 gap-2">
              {includedFeatures.map((feat) => (
                <div
                  key={feat}
                  className="flex items-center gap-2 text-xs text-slate-600 bg-slate-50 px-3 py-2 rounded-xl border border-slate-100"
                >
                  <CheckCircle2 className="w-4 h-4 text-[#1C7D5A] shrink-0" />
                  <span>{feat}</span>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Capacity & Upgrade Panel */}
        <div className="xl:col-span-7 space-y-6">
          {/* Student Capacity Card */}
          <div className="bg-white rounded-2xl border border-slate-200/80 p-5 md:p-6 shadow-sm space-y-5">
            <div className="flex flex-wrap items-center justify-between gap-3">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-[#1C7D5A]/10 text-[#1C7D5A] flex items-center justify-center">
                  <Activity className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="text-base font-bold text-slate-800">
                    শিক্ষার্থী ভর্তি সীমা (Enrollment Limit)
                  </h3>
                  <p className="text-xs text-slate-500">
                    বর্তমান প্যাকেজে অনুমোদিত মোট শিক্ষার্থীর ব্যবহার
                  </p>
                </div>
              </div>

              <span className="px-3 py-1.5 rounded-xl bg-emerald-50 border border-emerald-200 text-[#1C7D5A] text-xs font-bold flex items-center gap-1.5">
                {statsLoading && <Loader2 className="w-3.5 h-3.5 animate-spin" />}
                {statsLoading
                  ? "লোড হচ্ছে..."
                  : `${currentStudents} / ${studentLimit} জন`}
              </span>
            </div>

            <div className="space-y-2.5">
              <div className="w-full bg-slate-100 h-3.5 rounded-full overflow-hidden p-0.5 border border-slate-200/70">
                <div
                  className={`h-full rounded-full transition-all duration-700 ${
                    utilizationPercentage >= 90
                      ? "bg-gradient-to-r from-amber-500 to-rose-500"
                      : "bg-gradient-to-r from-[#1C7D5A] to-emerald-400"
                  }`}
                  style={{ width: `${utilizationPercentage}%` }}
                />
              </div>

              <div className="flex flex-wrap items-center justify-between gap-2 text-xs text-slate-500">
                <span>ব্যবহৃত: {utilizationPercentage}%</span>
                <span>অবশিষ্ট আসন: {statsLoading ? "—" : `${remainingSlots} জন`}</span>
              </div>
            </div>

            {!statsLoading && utilizationPercentage >= 85 && (
              <div className="flex items-start gap-2.5 p-3.5 rounded-xl bg-amber-50 border border-amber-200 text-amber-900 text-xs font-medium">
                <AlertTriangle className="w-4 h-4 text-amber-600 shrink-0 mt-0.5" />
                <span>
                  আপনার শিক্ষার্থী ধারণক্ষমতা প্রায় পূর্ণ হয়ে গেছে। নতুন শিক্ষার্থী ভর্তির আগে প্যাকেজ আপগ্রেড করার পরামর্শ দেওয়া হচ্ছে।
                </span>
              </div>
            )}
          </div>

          {/* Upgrade & Support Card */}
          <div className="bg-gradient-to-br from-[#123628] to-[#0b2219] rounded-2xl p-6 text-white shadow-sm border border-[#1C7D5A]/30 space-y-4">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-white/10 text-[#EAB33C] flex items-center justify-center shrink-0">
                <TrendingUp className="w-5 h-5" />
              </div>
              <div>
                <h3 className="text-base font-bold">
                  প্ল্যান আপগ্রেড ও কাস্টম সাপোর্ট
                </h3>
                <p className="text-xs text-white/70">
                  অতিরিক্ত শিক্ষার্থী সীমা বা কাস্টম ফিচারের জন্য সুপার অ্যাডমিনের সাথে যোগাযোগ করুন
                </p>
              </div>
            </div>

            <p className="text-xs md:text-sm text-white/80 leading-relaxed">
              আপনার মাদ্রাসার শিক্ষার্থী সংখ্যা বৃদ্ধি পেলে কিংবা অতিরিক্ত মডিউল ও কাস্টম বিলিং সুবিধা প্রয়োজন হলে আমাদের সাপোর্ট টিমের সাথে যোগাযোগ করে সহজেই প্ল্যান আপগ্রেড করতে পারবেন।
            </p>

            <div className="flex flex-wrap items-center gap-3 pt-1">
              <a
                href="mailto:support@mms.com"
                className="inline-flex items-center gap-2 bg-[#1C7D5A] hover:bg-[#166649] text-white px-5 py-2.5 rounded-xl text-xs font-bold shadow-sm transition-all"
              >
                <Mail className="w-4 h-4" />
                সুপার অ্যাডমিনের সাথে যোগাযোগ করুন
              </a>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SubscriptionPage;
