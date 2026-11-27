import { useState, useEffect, useCallback } from "react";
import { useNavigate } from "react-router-dom";
import {
  Users,
  CalendarCheck,
  BookCheck,
  AlertTriangle,
  ClipboardEdit,
  CalendarRange,
  FileBarChart2,
  Info,
  CheckSquare,
  Save,
  Loader2,
  ChevronLeft,
  ChevronRight,
  Search,
} from "lucide-react";
import { toast } from "react-hot-toast";
import hifzService from "../../../services/hifzService";
import HifzPageHeader from "./HifzPageHeader";
import {
  getTodayDateStr,
  addDays,
  toBanglaDigits,
  formatBanglaFullDate,
} from "./hifzUtils";

const HifzDashboardPage = ({ basePath = "/admin/hifz" }) => {
  const navigate = useNavigate();
  const [selectedDate, setSelectedDate] = useState(getTodayDateStr());
  const [dashboard, setDashboard] = useState(null);
  const [selectedClassIds, setSelectedClassIds] = useState([]);
  const [classSearch, setClassSearch] = useState("");
  const [loading, setLoading] = useState(true);
  const [savingClasses, setSavingClasses] = useState(false);

  const loadDashboard = useCallback(async () => {
    try {
      setLoading(true);
      const res = await hifzService.getDashboard(selectedDate);
      if (res.success) {
        setDashboard(res.data);
        setSelectedClassIds(res.data.hifzClassIds || []);
      }
    } catch (err) {
      console.error("Failed to fetch Hifz dashboard:", err);
      toast.error("হিফজ ড্যাশবোর্ড লোড করতে সমস্যা হয়েছে");
    } finally {
      setLoading(false);
    }
  }, [selectedDate]);

  useEffect(() => {
    loadDashboard();
  }, [loadDashboard]);

  const toggleClassId = (cid) => {
    setSelectedClassIds((prev) =>
      prev.includes(cid) ? prev.filter((id) => id !== cid) : [...prev, cid]
    );
  };

  const handleSaveClasses = async () => {
    try {
      setSavingClasses(true);
      const res = await hifzService.updateSettings(selectedClassIds);
      if (res.success) {
        toast.success("হিফজ ক্লাস তালিকা সংরক্ষণ করা হয়েছে");
        await loadDashboard();
      }
    } catch (err) {
      toast.error(err?.response?.data?.message || "ক্লাস সংরক্ষণ করতে সমস্যা হয়েছে");
    } finally {
      setSavingClasses(false);
    }
  };

  const stats = dashboard?.stats || {
    totalStudents: 0,
    todayEntriesCount: 0,
    weeklyReviewedCount: 0,
    monthMistakesTotal: 0,
  };

  const kpiCards = [
    {
      title: "হিফজ বিভাগের শিক্ষার্থী",
      value: toBanglaDigits(stats.totalStudents),
      subtitle: `${toBanglaDigits(dashboard?.classProgress?.length || 0)}টি নির্বাচিত ক্লাস`,
      icon: Users,
      color: "text-[#1C7D5A]",
      bg: "bg-[#e8f5f0] dark:bg-[#1C7D5A]/20",
    },
    {
      title: "আজকের এন্ট্রি",
      value: toBanglaDigits(stats.todayEntriesCount),
      subtitle:
        stats.totalStudents > 0
          ? `${toBanglaDigits(
              Math.round((stats.todayEntriesCount / stats.totalStudents) * 100)
            )}% সম্পন্ন হয়েছে`
          : "কোনো শিক্ষার্থী নেই",
      icon: CalendarCheck,
      color: "text-emerald-600",
      bg: "bg-emerald-50 dark:bg-emerald-950/40",
    },
    {
      title: "এই সপ্তাহে খাতা দেখা হয়েছে",
      value: toBanglaDigits(stats.weeklyReviewedCount),
      subtitle: `${dashboard?.weekInfo?.ordinalBn || ""} সপ্তাহ (শনিবারের পরীক্ষা)`,
      icon: BookCheck,
      color: "text-amber-600",
      bg: "bg-amber-50 dark:bg-amber-950/40",
    },
    {
      title: "এ মাসে মোট ভুল (সাত সবক + আমুখতা)",
      value: toBanglaDigits(stats.monthMistakesTotal),
      subtitle: `${dashboard?.weekInfo?.monthNameBn || ""} ${dashboard?.weekInfo?.yearBn || ""}`,
      icon: AlertTriangle,
      color: "text-rose-600",
      bg: "bg-rose-50 dark:bg-rose-950/40",
    },
  ];

  const allClasses = (dashboard?.allClasses || []).filter((c) =>
    c.name.toLowerCase().includes(classSearch.toLowerCase())
  );

  return (
    <div className="space-y-6 animate-in fade-in duration-500">
      <HifzPageHeader basePath={basePath} />

      {/* 4 KPI Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-4">
        {kpiCards.map((card, idx) => (
          <div
            key={idx}
            className="bg-surface border border-border p-5 rounded-2xl shadow-sm hover:shadow-md transition-all flex items-center justify-between relative overflow-hidden"
          >
            <div className="absolute -top-[15%] -left-[18%] h-[160px] w-[160px] bg-[#1C7D5A]/10 rounded-full pointer-events-none" />
            <div className="relative z-10 min-w-0 pr-2">
              <h3 className="text-2xl md:text-3xl font-bold text-fg-main tracking-tight">
                {card.value}
              </h3>
              <p className="text-xs font-semibold text-fg-muted mt-1">{card.title}</p>
              <p className="text-[11px] text-slate-400 mt-0.5 truncate">{card.subtitle}</p>
            </div>
            <div className={`p-3 rounded-xl ${card.bg} ${card.color} shrink-0 relative z-10`}>
              <card.icon className="w-6 h-6" />
            </div>
          </div>
        ))}
      </div>

      {/* Main 2-column grid */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
        {/* Left: Today's Class Progress */}
        <div className="lg:col-span-8 bg-surface border border-border rounded-2xl shadow-sm p-5 space-y-4">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-3 border-b border-border">
            <div className="flex items-center gap-2.5">
              <div className="w-9 h-9 rounded-xl bg-[#e8f5f0] dark:bg-[#1C7D5A]/20 text-[#1C7D5A] flex items-center justify-center">
                <Users className="w-5 h-5" />
              </div>
              <div>
                <h2 className="text-base font-bold text-fg-main">
                  আজকের অগ্রগতি — {formatBanglaFullDate(selectedDate)}
                </h2>
                <p className="text-xs text-fg-muted">
                  প্রতিটি হিফজ ক্লাসের দৈনিক কাজ ও খাতা দেখার সরাসরি লিংক
                </p>
              </div>
            </div>

            <div className="flex items-center gap-1.5">
              <button
                type="button"
                onClick={() => setSelectedDate(addDays(selectedDate, -1))}
                className="p-2 rounded-lg border border-border hover:bg-primary-light/60 text-fg-muted cursor-pointer"
                title="আগের দিন"
              >
                <ChevronLeft className="w-4 h-4" />
              </button>
              <input
                type="date"
                value={selectedDate}
                onChange={(e) => e.target.value && setSelectedDate(e.target.value)}
                className="px-2.5 py-1.5 text-xs font-semibold rounded-lg border border-border bg-background text-fg-main"
              />
              <button
                type="button"
                onClick={() => setSelectedDate(addDays(selectedDate, 1))}
                className="p-2 rounded-lg border border-border hover:bg-primary-light/60 text-fg-muted cursor-pointer"
                title="পরের দিন"
              >
                <ChevronRight className="w-4 h-4" />
              </button>
              <button
                type="button"
                onClick={() => setSelectedDate(getTodayDateStr())}
                className="px-2.5 py-1.5 text-xs font-bold rounded-lg border border-[#1C7D5A]/30 text-[#1C7D5A] hover:bg-[#e8f5f0] cursor-pointer"
              >
                আজ
              </button>
            </div>
          </div>

          {loading ? (
            <div className="py-12 flex items-center justify-center gap-2 text-fg-muted text-sm">
              <Loader2 className="w-5 h-5 animate-spin text-[#1C7D5A]" />
              <span>তথ্য লোড হচ্ছে...</span>
            </div>
          ) : (dashboard?.classProgress || []).length === 0 ? (
            <div className="py-12 text-center border-2 border-dashed border-border rounded-xl px-4">
              <p className="text-sm font-bold text-fg-main">
                এখনো কোনো হিফজ ক্লাস নির্বাচন করা হয়নি
              </p>
              <p className="text-xs text-fg-muted mt-1">
                ডান পাশের &ldquo;হিফজ ক্লাস নির্বাচন&rdquo; তালিকা থেকে আপনার হিফজ/নাজেরা ক্লাসগুলো টিক দিয়ে সংরক্ষণ করুন।
              </p>
            </div>
          ) : (
            <div className="space-y-3">
              {dashboard.classProgress.map((cls) => (
                <div
                  key={cls.class_id}
                  className="p-4 rounded-xl border border-border bg-background/60 hover:border-[#1C7D5A]/40 transition-all space-y-2.5"
                >
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                    <div>
                      <h3 className="text-sm font-bold text-fg-main">{cls.class_name}</h3>
                      <p className="text-xs text-fg-muted mt-0.5">
                        {toBanglaDigits(cls.entered_today)} /{" "}
                        {toBanglaDigits(cls.total_students)} জনের আজকের কাজ লেখা হয়েছে
                      </p>
                    </div>

                    <div className="flex flex-wrap items-center gap-2">
                      <button
                        type="button"
                        onClick={() =>
                          navigate(
                            `${basePath}/daily-entry?class_id=${cls.class_id}&date=${selectedDate}`
                          )
                        }
                        className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-[#1C7D5A] hover:bg-[#123628] text-white text-xs font-semibold transition-colors cursor-pointer"
                      >
                        <ClipboardEdit className="w-3.5 h-3.5" />
                        দৈনিক এন্ট্রি
                      </button>
                      <button
                        type="button"
                        onClick={() =>
                          navigate(
                            `${basePath}/weekly-khata?class_id=${cls.class_id}&date=${selectedDate}`
                          )
                        }
                        className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg border border-border hover:border-[#1C7D5A] text-fg-main hover:text-[#1C7D5A] text-xs font-semibold transition-colors cursor-pointer"
                      >
                        <CalendarRange className="w-3.5 h-3.5" />
                        খাতা
                      </button>
                      <button
                        type="button"
                        onClick={() =>
                          navigate(
                            `${basePath}/monthly-report?class_id=${cls.class_id}&month=${selectedDate.slice(
                              0,
                              7
                            )}`
                          )
                        }
                        className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg border border-border hover:border-[#1C7D5A] text-fg-main hover:text-[#1C7D5A] text-xs font-semibold transition-colors cursor-pointer"
                      >
                        <FileBarChart2 className="w-3.5 h-3.5" />
                        রিপোর্ট
                      </button>
                    </div>
                  </div>

                  {/* Progress bar */}
                  <div className="w-full h-2 bg-slate-200 dark:bg-slate-700 rounded-full overflow-hidden">
                    <div
                      className="h-full bg-gradient-to-r from-[#1C7D5A] to-emerald-500 rounded-full transition-all duration-500"
                      style={{ width: `${cls.percent}%` }}
                    />
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Right Column: Instructions + Hifz Class Selection */}
        <div className="lg:col-span-4 space-y-5">
          {/* Instructions Card */}
          <div className="bg-surface border border-border rounded-2xl shadow-sm p-5 space-y-3">
            <div className="flex items-center gap-2 text-fg-main">
              <Info className="w-4 h-4 text-[#1C7D5A]" />
              <h3 className="text-sm font-bold">খাতা কীভাবে লিখবেন</h3>
            </div>
            <ol className="space-y-2 text-xs text-fg-muted leading-relaxed list-decimal list-inside">
              <li>
                <strong className="text-fg-main">দৈনিক এন্ট্রি:</strong> ক্লাস ও তারিখ বেছে সব শিক্ষার্থীর আজকের সবক, সাত সবক, আমুখতা একসাথে লিখুন।
              </li>
              <li>
                <strong className="text-fg-main">সাপ্তাহিক খাতা:</strong> একজন শিক্ষার্থীর পুরো সপ্তাহ (শনি-শুক্র) কাগজের খাতার মতো দেখুন, প্রিন্ট করুন ও শনিবারের তথ্য দিন।
              </li>
              <li>
                <strong className="text-fg-main">শিক্ষকের স্বাক্ষর:</strong> ঘরে ফাঁকা রেখে সংরক্ষণ করলেও যিনি সংরক্ষণ করছেন তাঁর নাম স্বয়ংক্রিয়ভাবে বসবে।
              </li>
              <li>
                <strong className="text-fg-main">মাসিক রিপোর্ট ও প্রিন্ট:</strong> মাসের হিসাব দেখুন, পুরো ক্লাসের খাতা বা ফাঁকা ফর্ম প্রিন্ট করুন।
              </li>
            </ol>
          </div>

          {/* Class Selection Card */}
          <div className="bg-surface border border-border rounded-2xl shadow-sm p-5 space-y-3">
            <div className="flex items-center gap-2 text-fg-main">
              <CheckSquare className="w-4 h-4 text-[#1C7D5A]" />
              <div>
                <h3 className="text-sm font-bold">হিফজ ক্লাস নির্বাচন</h3>
                <p className="text-[11px] text-fg-muted">
                  যেসব ক্লাসে হিফজ খাতা ব্যবহৃত হবে সেগুলো বেছে নিন
                </p>
              </div>
            </div>

            <div className="relative">
              <Search className="w-3.5 h-3.5 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
              <input
                type="text"
                value={classSearch}
                onChange={(e) => setClassSearch(e.target.value)}
                placeholder="ক্লাস খুঁজুন..."
                className="w-full pl-8 pr-3 py-1.5 text-xs rounded-lg border border-border bg-background text-fg-main outline-none focus:border-[#1C7D5A]"
              />
            </div>

            <div className="max-h-64 overflow-y-auto pr-1 space-y-1.5">
              {allClasses.length === 0 ? (
                <p className="text-xs text-fg-muted py-4 text-center">কোনো ক্লাস পাওয়া যায়নি</p>
              ) : (
                allClasses.map((cls) => {
                  const checked = selectedClassIds.includes(cls._id);
                  return (
                    <label
                      key={cls._id}
                      className={`flex items-center justify-between gap-2 px-3 py-2 rounded-lg border cursor-pointer transition-colors ${
                        checked
                          ? "bg-[#e8f5f0]/70 dark:bg-[#1C7D5A]/20 border-[#1C7D5A]/40"
                          : "border-border hover:bg-slate-50 dark:hover:bg-slate-800/40"
                      }`}
                    >
                      <div className="flex items-center gap-2.5 min-w-0">
                        <input
                          type="checkbox"
                          checked={checked}
                          onChange={() => toggleClassId(cls._id)}
                          className="w-4 h-4 accent-[#1C7D5A] rounded cursor-pointer"
                        />
                        <span className="text-xs font-semibold text-fg-main truncate">
                          {cls.name}
                        </span>
                      </div>
                      <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-slate-100 dark:bg-slate-800 text-fg-muted shrink-0">
                        {toBanglaDigits(cls.studentCount)} জন
                      </span>
                    </label>
                  );
                })
              )}
            </div>

            <button
              type="button"
              onClick={handleSaveClasses}
              disabled={savingClasses}
              className="w-full inline-flex items-center justify-center gap-2 py-2.5 px-4 rounded-xl bg-[#1C7D5A] hover:bg-[#123628] disabled:opacity-60 text-white text-xs font-bold shadow-sm transition-colors cursor-pointer"
            >
              {savingClasses ? (
                <Loader2 className="w-4 h-4 animate-spin" />
              ) : (
                <Save className="w-4 h-4" />
              )}
              <span>সংরক্ষণ করুন</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default HifzDashboardPage;
