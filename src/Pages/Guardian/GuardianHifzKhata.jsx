import { useState, useEffect, useCallback } from "react";
import {
  BookOpen,
  CalendarCheck,
  AlertTriangle,
  Award,
  Printer,
  ChevronLeft,
  ChevronRight,
  Loader2,
  Users,
} from "lucide-react";
import { toast } from "react-hot-toast";
import { useAuth } from "../../context/AuthContext";
import hifzService from "../../services/hifzService";
import {
  getTodayDateStr,
  getCurrentMonthStr,
  getSaturdayWeekStart,
  addDays,
  toBanglaDigits,
  formatBanglaMonthYear,
  WEEK_ORDINAL_BN,
} from "../Admin/Hifz/hifzUtils";
import { printSingleWeekKhata, printStudentMonthKhata } from "../Admin/Hifz/hifzPrintUtils";

const PortalHifzKhata = ({ mode = "guardian" }) => {
  const { currentMadrasa, guardianChildren, activeChild, selectChild } = useAuth();
  const [selectedMonth, setSelectedMonth] = useState(getCurrentMonthStr());
  const [weekStart, setWeekStart] = useState(() => getSaturdayWeekStart(getTodayDateStr()));
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [printingMonth, setPrintingMonth] = useState(false);

  const targetStudentId = mode === "guardian" ? activeChild?.id || "" : "";

  const fetchPortalKhata = useCallback(async () => {
    if (mode === "guardian" && !targetStudentId) {
      setData(null);
      setLoading(false);
      return;
    }
    try {
      setLoading(true);
      const res = await hifzService.getPortalKhata({
        ...(targetStudentId ? { student_id: targetStudentId } : {}),
        month: selectedMonth,
        week_start: weekStart,
      });
      if (res.success) {
        setData(res.data);
      }
    } catch (err) {
      console.error("Failed to load Hifz khata:", err);
      toast.error("হিফজ তথ্য খাতা লোড করতে সমস্যা হয়েছে");
    } finally {
      setLoading(false);
    }
  }, [mode, targetStudentId, selectedMonth, weekStart]);

  useEffect(() => {
    fetchPortalKhata();
  }, [fetchPortalKhata]);

  const handlePrintWeek = () => {
    if (!data?.weeklyKhata) return;
    try {
      printSingleWeekKhata({
        madrasa: currentMadrasa,
        khataData: data.weeklyKhata,
        className: data.className || "",
      });
    } catch (err) {
      toast.error(err.message);
    }
  };

  const handlePrintMonth = async () => {
    try {
      setPrintingMonth(true);
      const res = await hifzService.getPortalPrintData({
        ...(targetStudentId ? { student_id: targetStudentId } : {}),
        month: selectedMonth,
      });
      if (res.success) {
        printStudentMonthKhata({ madrasa: currentMadrasa, printData: res.data });
      }
    } catch (err) {
      toast.error(err.message || "মাসিক খাতা প্রিন্ট করতে সমস্যা হয়েছে");
    } finally {
      setPrintingMonth(false);
    }
  };

  if (mode === "guardian" && (!guardianChildren || guardianChildren.length === 0)) {
    return (
      <div className="bg-surface border border-border rounded-2xl p-10 text-center space-y-2">
        <Users className="w-10 h-10 text-slate-300 mx-auto" />
        <h2 className="text-lg font-bold text-fg-main">কোনো শিক্ষার্থী সংযুক্ত নেই</h2>
        <p className="text-xs text-fg-muted">
          আপনার অ্যাকাউন্টের সাথে কোনো শিক্ষার্থীর তথ্য পাওয়া যায়নি। মাদ্রাসা অফিসে যোগাযোগ করুন।
        </p>
      </div>
    );
  }

  const summary = data?.monthlySummary || {};
  const khata = data?.weeklyKhata;
  const weeks = data?.weeks || [];
  const weekInfo = khata?.weekInfo;

  return (
    <div className="space-y-6 animate-in fade-in duration-500">
      {/* Header Banner */}
      <div className="relative overflow-hidden rounded-2xl bg-gradient-to-r from-[#123628] via-[#175740] to-[#1C7D5A] text-white p-5 md:p-6 shadow-md">
        <div className="absolute -right-10 -top-10 w-44 h-44 rounded-full bg-[#EAB33C]/10 blur-2xl pointer-events-none" />
        <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div className="flex items-center gap-3.5">
            <div className="w-12 h-12 rounded-xl bg-white/15 border border-white/20 flex items-center justify-center text-[#EAB33C] shrink-0">
              <BookOpen className="w-6 h-6" />
            </div>
            <div>
              <h1 className="text-xl md:text-2xl font-bold">হিফজ তথ্য খাতা</h1>
              <p className="text-xs md:text-sm text-emerald-100/85 mt-0.5">
                {mode === "guardian"
                  ? "সন্তানের দৈনিক সবক, সাত সবক, আমুখতা ও সাপ্তাহিক শনিবার পরীক্ষার সরাসরি অগ্রগতি"
                  : "আপনার দৈনিক সবক, সাত সবক, আমুখতা ও সাপ্তাহিক খাতা"}
              </p>
            </div>
          </div>

          {/* Child Switcher for Guardian */}
          {mode === "guardian" && guardianChildren.length > 1 && (
            <div className="flex flex-wrap gap-2">
              {guardianChildren.map((child) => {
                const active = activeChild?.id === child.id;
                return (
                  <button
                    key={child.id}
                    type="button"
                    onClick={() => selectChild(child)}
                    className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all cursor-pointer border ${
                      active
                        ? "bg-[#EAB33C] text-[#123628] border-[#EAB33C] shadow-sm"
                        : "bg-white/10 text-white border-white/20 hover:bg-white/20"
                    }`}
                  >
                    {child.name}
                  </button>
                );
              })}
            </div>
          )}
        </div>
      </div>

      {/* 4 Summary Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-4">
        <div className="bg-surface border border-border rounded-2xl p-5 shadow-sm flex items-center justify-between">
          <div>
            <p className="text-xs font-semibold text-fg-muted">সর্বশেষ সবক</p>
            <h3 className="text-lg font-bold text-[#1C7D5A] mt-1">
              {summary.latestSabak
                ? `পারা ${summary.latestSabak.para || "-"}, পৃ. ${summary.latestSabak.page || "-"}`
                : "তথ্য নেই"}
            </h3>
            <p className="text-[11px] text-slate-400 mt-0.5">
              {summary.latestSabak?.date
                ? `তারিখ: ${toBanglaDigits(summary.latestSabak.date)}`
                : "এই মাসে এখনো সবক লেখা হয়নি"}
            </p>
          </div>
          <div className="p-3 rounded-xl bg-[#e8f5f0] dark:bg-[#1C7D5A]/20 text-[#1C7D5A]">
            <BookOpen className="w-5 h-5" />
          </div>
        </div>

        <div className="bg-surface border border-border rounded-2xl p-5 shadow-sm flex items-center justify-between">
          <div>
            <p className="text-xs font-semibold text-fg-muted">উপস্থিতি ও সবক (মাসিক)</p>
            <h3 className="text-xl font-bold text-fg-main mt-1">
              {toBanglaDigits(summary.presentDays || 0)} দিন উপস্থিত
            </h3>
            <p className="text-[11px] text-slate-400 mt-0.5">
              সবক নিয়েছে: {toBanglaDigits(summary.sabakDays || 0)} দিন | অনুপস্থিত:{" "}
              {toBanglaDigits(summary.absentDays || 0)}
            </p>
          </div>
          <div className="p-3 rounded-xl bg-emerald-50 dark:bg-emerald-950/40 text-emerald-600">
            <CalendarCheck className="w-5 h-5" />
          </div>
        </div>

        <div className="bg-surface border border-border rounded-2xl p-5 shadow-sm flex items-center justify-between">
          <div>
            <p className="text-xs font-semibold text-fg-muted">মাসিক ভুল (সাত সবক + আমুখতা)</p>
            <h3 className="text-xl font-bold text-rose-600 mt-1">
              {toBanglaDigits((summary.satSabakMistakes || 0) + (summary.amukhtaMistakes || 0))}টি
            </h3>
            <p className="text-[11px] text-slate-400 mt-0.5">
              সাত সবক: {toBanglaDigits(summary.satSabakMistakes || 0)} | আমুখতা:{" "}
              {toBanglaDigits(summary.amukhtaMistakes || 0)}
            </p>
          </div>
          <div className="p-3 rounded-xl bg-rose-50 dark:bg-rose-950/40 text-rose-600">
            <AlertTriangle className="w-5 h-5" />
          </div>
        </div>

        <div className="bg-surface border border-border rounded-2xl p-5 shadow-sm flex items-center justify-between">
          <div>
            <p className="text-xs font-semibold text-fg-muted">শনিবার পরীক্ষার লোকমা</p>
            <h3 className="text-xl font-bold text-amber-600 mt-1">
              {toBanglaDigits(summary.saturdayLokma || 0)}টি
            </h3>
            <p className="text-[11px] text-slate-400 mt-0.5">
              {formatBanglaMonthYear(selectedMonth)}
            </p>
          </div>
          <div className="p-3 rounded-xl bg-amber-50 dark:bg-amber-950/40 text-amber-600">
            <Award className="w-5 h-5" />
          </div>
        </div>
      </div>

      {/* Controls */}
      <div className="bg-surface border border-border rounded-2xl p-4 shadow-sm space-y-3">
        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-3">
          <div className="flex flex-wrap items-center gap-3">
            <div>
              <label className="block text-[11px] font-bold text-fg-muted mb-1">মাস</label>
              <input
                type="month"
                value={selectedMonth}
                onChange={(e) => {
                  if (!e.target.value) return;
                  setSelectedMonth(e.target.value);
                  setWeekStart(getSaturdayWeekStart(`${e.target.value}-07`));
                }}
                className="px-3 py-1.5 text-xs font-bold rounded-xl border border-border bg-background text-fg-main"
              />
            </div>

            <div>
              <label className="block text-[11px] font-bold text-fg-muted mb-1">
                সপ্তাহ (শনিবার - শুক্রবার)
              </label>
              <div className="flex items-center gap-1.5">
                <button
                  type="button"
                  onClick={() => setWeekStart(addDays(weekStart, -7))}
                  className="p-1.5 rounded-lg border border-border hover:bg-primary-light/60 text-fg-muted cursor-pointer"
                >
                  <ChevronLeft className="w-4 h-4" />
                </button>
                <input
                  type="date"
                  value={weekStart}
                  onChange={(e) =>
                    e.target.value && setWeekStart(getSaturdayWeekStart(e.target.value))
                  }
                  className="px-2.5 py-1.5 text-xs font-bold rounded-lg border border-border bg-background text-fg-main"
                />
                <button
                  type="button"
                  onClick={() => setWeekStart(addDays(weekStart, 7))}
                  className="p-1.5 rounded-lg border border-border hover:bg-primary-light/60 text-fg-muted cursor-pointer"
                >
                  <ChevronRight className="w-4 h-4" />
                </button>
                <button
                  type="button"
                  onClick={() => setWeekStart(getSaturdayWeekStart(getTodayDateStr()))}
                  className="px-2.5 py-1.5 text-xs font-bold rounded-lg border border-[#1C7D5A]/40 text-[#1C7D5A] hover:bg-[#e8f5f0] cursor-pointer"
                >
                  এই সপ্তাহ
                </button>
              </div>
            </div>
          </div>

          <div className="flex flex-wrap items-center gap-2">
            <button
              type="button"
              onClick={handlePrintWeek}
              disabled={!khata}
              className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-xl border border-border bg-surface hover:border-[#1C7D5A] text-fg-main text-xs font-bold cursor-pointer"
            >
              <Printer className="w-3.5 h-3.5 text-[#1C7D5A]" />
              এই সপ্তাহ প্রিন্ট
            </button>
            <button
              type="button"
              onClick={handlePrintMonth}
              disabled={printingMonth || !khata}
              className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-xl bg-[#1C7D5A] hover:bg-[#123628] text-white text-xs font-bold cursor-pointer"
            >
              {printingMonth ? (
                <Loader2 className="w-3.5 h-3.5 animate-spin" />
              ) : (
                <Printer className="w-3.5 h-3.5" />
              )}
              পুরো মাস প্রিন্ট
            </button>
          </div>
        </div>

        {weeks.length > 0 && (
          <div className="flex flex-wrap items-center gap-2 pt-2 border-t border-border text-xs">
            <span className="font-bold text-fg-muted">সপ্তাহসমূহ:</span>
            {weeks.map((w) => (
              <button
                key={w.weekStart}
                type="button"
                onClick={() => setWeekStart(w.weekStart)}
                className={`px-2.5 py-1 rounded-lg border font-semibold transition-colors cursor-pointer ${
                  w.weekStart === weekStart
                    ? "bg-[#1C7D5A] text-white border-[#1C7D5A]"
                    : "border-border bg-background text-fg-main hover:border-[#1C7D5A]"
                }`}
              >
                {w.ordinalBn}: {w.shortRangeBn}
              </button>
            ))}
          </div>
        )}
      </div>

      {/* Read-only Khata Table */}
      <div className="bg-surface border border-border rounded-2xl shadow-sm p-4 md:p-5 space-y-4">
        {loading ? (
          <div className="py-16 flex items-center justify-center gap-2 text-fg-muted text-sm">
            <Loader2 className="w-5 h-5 animate-spin text-[#1C7D5A]" />
            <span>খাতা লোড হচ্ছে...</span>
          </div>
        ) : !khata ? (
          <div className="py-16 text-center text-sm text-fg-muted">
            কোনো হিফজ তথ্য পাওয়া যায়নি।
          </div>
        ) : (
          <>
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 pb-3 border-b border-border">
              <div>
                <h2 className="text-base font-bold text-fg-main">
                  {khata.student.name}{" "}
                  {khata.student.roll_number
                    ? `(রোল ${toBanglaDigits(khata.student.roll_number)})`
                    : ""}
                </h2>
                <p className="text-xs text-fg-muted">
                  ক্লাস: {data.className || "-"} • {weekInfo?.ordinalBn} সপ্তাহ ({weekInfo?.monthNameBn}{" "}
                  {weekInfo?.yearBn})
                </p>
              </div>
              {!data.isHifzStudent && (
                <span className="text-[11px] font-semibold px-3 py-1 rounded-full bg-amber-50 text-amber-700 border border-amber-200">
                  এই ক্লাসটি হিফজ বিভাগে নির্বাচিত নয়
                </span>
              )}
            </div>

            <div className="overflow-x-auto rounded-xl border border-border">
              <table className="w-full border-collapse text-xs min-w-[920px]">
                <thead>
                  <tr className="bg-[#e8f5f0] dark:bg-[#123628] text-[#123628] dark:text-emerald-100 border-b border-[#1C7D5A]/25">
                    <th rowSpan={2} className="px-3 py-2 border-r border-[#1C7D5A]/20 text-left font-bold">
                      বার
                    </th>
                    <th rowSpan={2} className="px-2 py-2 border-r border-[#1C7D5A]/20 text-center font-bold">
                      উপস্থিতি
                    </th>
                    <th colSpan={2} className="px-2 py-1.5 border-r border-b border-[#1C7D5A]/20 text-center font-bold">
                      সবক
                    </th>
                    <th colSpan={4} className="px-2 py-1.5 border-r border-b border-[#1C7D5A]/20 text-center font-bold">
                      সাত সবক
                    </th>
                    <th colSpan={4} className="px-2 py-1.5 border-r border-b border-[#1C7D5A]/20 text-center font-bold">
                      আমুখতা
                    </th>
                    <th rowSpan={2} className="px-2 py-2 border-r border-[#1C7D5A]/20 text-center font-bold">
                      দৈনিক তিলাওয়াত
                    </th>
                    <th rowSpan={2} className="px-2 py-2 border-r border-[#1C7D5A]/20 text-center font-bold">
                      শিক্ষকের স্বাক্ষর
                    </th>
                    <th rowSpan={2} className="px-2 py-2 text-center font-bold">
                      তারিখ
                    </th>
                  </tr>
                  <tr className="bg-[#f3faf7] dark:bg-[#123628]/70 text-[#123628] dark:text-emerald-200 border-b border-border text-[11px]">
                    <th className="py-1.5 px-1 border-r border-[#1C7D5A]/15 text-center">পারা</th>
                    <th className="py-1.5 px-1 border-r border-[#1C7D5A]/20 text-center">পৃষ্ঠা</th>
                    <th className="py-1.5 px-1 border-r border-[#1C7D5A]/15 text-center">পারা</th>
                    <th className="py-1.5 px-1 border-r border-[#1C7D5A]/15 text-center">পৃষ্ঠা</th>
                    <th className="py-1.5 px-1 border-r border-[#1C7D5A]/15 text-center">পরিমাণ</th>
                    <th className="py-1.5 px-1 border-r border-[#1C7D5A]/20 text-center">ভুল</th>
                    <th className="py-1.5 px-1 border-r border-[#1C7D5A]/15 text-center">পারা</th>
                    <th className="py-1.5 px-1 border-r border-[#1C7D5A]/15 text-center">পৃষ্ঠা</th>
                    <th className="py-1.5 px-1 border-r border-[#1C7D5A]/15 text-center">পরিমাণ</th>
                    <th className="py-1.5 px-1 border-r border-[#1C7D5A]/20 text-center">ভুল</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-border">
                  {(khata.days || []).map((d) => (
                    <tr key={d.date} className="hover:bg-slate-50/50 dark:hover:bg-slate-800/30">
                      <td className="px-3 py-2.5 border-r border-border font-bold text-fg-main">
                        {d.weekdayBn}
                      </td>
                      <td className="px-2 py-2.5 border-r border-border text-center font-semibold">
                        {d.attendance ? (
                          <span
                            className={`px-2 py-0.5 rounded-full text-[11px] ${
                              d.attendance === "উপস্থিত"
                                ? "bg-emerald-50 text-emerald-700"
                                : d.attendance === "অনুপস্থিত"
                                ? "bg-rose-50 text-rose-700"
                                : "bg-amber-50 text-amber-700"
                            }`}
                          >
                            {d.attendance}
                          </span>
                        ) : (
                          "-"
                        )}
                      </td>
                      <td className="px-2 py-2.5 border-r border-border text-center">
                        {d.sabak?.para || "-"}
                      </td>
                      <td className="px-2 py-2.5 border-r border-border text-center">
                        {d.sabak?.page || "-"}
                      </td>
                      <td className="px-2 py-2.5 border-r border-border text-center">
                        {d.sat_sabak?.para || "-"}
                      </td>
                      <td className="px-2 py-2.5 border-r border-border text-center">
                        {d.sat_sabak?.page || "-"}
                      </td>
                      <td className="px-2 py-2.5 border-r border-border text-center">
                        {d.sat_sabak?.amount || "-"}
                      </td>
                      <td className="px-2 py-2.5 border-r border-border text-center font-bold text-rose-600">
                        {d.sat_sabak?.mistakes !== "" && d.sat_sabak?.mistakes !== undefined
                          ? toBanglaDigits(d.sat_sabak.mistakes)
                          : "-"}
                      </td>
                      <td className="px-2 py-2.5 border-r border-border text-center">
                        {d.amukhta?.para || "-"}
                      </td>
                      <td className="px-2 py-2.5 border-r border-border text-center">
                        {d.amukhta?.page || "-"}
                      </td>
                      <td className="px-2 py-2.5 border-r border-border text-center">
                        {d.amukhta?.amount || "-"}
                      </td>
                      <td className="px-2 py-2.5 border-r border-border text-center font-bold text-rose-600">
                        {d.amukhta?.mistakes !== "" && d.amukhta?.mistakes !== undefined
                          ? toBanglaDigits(d.amukhta.mistakes)
                          : "-"}
                      </td>
                      <td className="px-2 py-2.5 border-r border-border text-center">
                        {d.daily_tilawat || "-"}
                      </td>
                      <td className="px-2 py-2.5 border-r border-border text-center text-fg-muted">
                        {d.teacher_signature || "-"}
                      </td>
                      <td className="px-2 py-2.5 text-center text-fg-muted whitespace-nowrap">
                        {d.shortDateBn}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            {/* Bottom Weekly Saturday Exam Details */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs">
              <div className="p-4 rounded-xl border border-border bg-background/50 space-y-2">
                <div className="flex flex-wrap items-center gap-1.5 font-semibold">
                  <span>সপ্তাহ:</span>
                  {WEEK_ORDINAL_BN.map((ord, idx) => (
                    <span
                      key={ord}
                      className={`px-2 py-0.5 rounded-full ${
                        idx + 1 === (weekInfo?.weekNumber || 1)
                          ? "border-2 border-[#1C7D5A] bg-[#e8f5f0] text-[#123628] font-bold"
                          : "text-fg-muted"
                      }`}
                    >
                      {ord}
                    </span>
                  ))}
                </div>
                <div>
                  <span className="text-fg-muted font-semibold">
                    বণ্টনকৃত সাপ্তাহিক শনিবার পারাসমূহ:
                  </span>
                  <p className="mt-1 font-bold text-fg-main">
                    {khata.weekly_review?.assigned_saturday_paras || "তথ্য দেওয়া হয়নি"}
                  </p>
                </div>
              </div>

              <div className="p-4 rounded-xl border border-border bg-background/50 space-y-2">
                <p className="font-bold text-fg-main">তিলাওয়াতকৃত সাপ্তাহিক শনিবার পারা</p>
                <div className="grid grid-cols-3 gap-2">
                  <div>
                    <span className="text-fg-muted">মোট</span>
                    <p className="font-bold text-fg-main mt-0.5">
                      {khata.weekly_review?.recited_total_paras || "-"}
                    </p>
                  </div>
                  <div>
                    <span className="text-fg-muted">কোন কোন পারা</span>
                    <p className="font-bold text-fg-main mt-0.5">
                      {khata.weekly_review?.recited_which_paras || "-"}
                    </p>
                  </div>
                  <div>
                    <span className="text-fg-muted">মোট লোকমা</span>
                    <p className="font-bold text-rose-600 mt-0.5">
                      {khata.weekly_review?.saturday_lokma_count !== "" &&
                      khata.weekly_review?.saturday_lokma_count !== undefined
                        ? toBanglaDigits(khata.weekly_review.saturday_lokma_count)
                        : "-"}
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </>
        )}
      </div>
    </div>
  );
};

export default PortalHifzKhata;
