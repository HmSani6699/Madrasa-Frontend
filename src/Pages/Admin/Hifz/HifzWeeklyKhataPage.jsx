import { useState, useEffect, useCallback, useMemo, useRef } from "react";
import { useSearchParams } from "react-router-dom";
import {
  ChevronLeft,
  ChevronRight,
  Printer,
  Save,
  Loader2,
  Info,
  ArrowRight,
} from "lucide-react";
import { toast } from "react-hot-toast";
import axiosInstance from "../../../api/axiosInstance";
import hifzService from "../../../services/hifzService";
import { useAuth } from "../../../context/AuthContext";
import HifzPageHeader from "./HifzPageHeader";
import {
  getTodayDateStr,
  addDays,
  getSaturdayWeekStart,
  getSectionsForClass,
  toBanglaDigits,
  WEEK_ORDINAL_BN,
} from "./hifzUtils";
import { printSingleWeekKhata, printStudentMonthKhata } from "./hifzPrintUtils";

const HifzWeeklyKhataPage = ({ basePath = "/admin/hifz" }) => {
  const { currentMadrasa } = useAuth();
  const [searchParams, setSearchParams] = useSearchParams();

  const [classes, setClasses] = useState([]);
  const [sections, setSections] = useState([]);
  const [students, setStudents] = useState([]);

  const [selectedClassId, setSelectedClassId] = useState(searchParams.get("class_id") || "");
  const [selectedSectionId, setSelectedSectionId] = useState(searchParams.get("section_id") || "all");
  const [selectedStudentId, setSelectedStudentId] = useState(searchParams.get("student_id") || "");
  const [weekStart, setWeekStart] = useState(() =>
    getSaturdayWeekStart(
      searchParams.get("week_start") || searchParams.get("date") || getTodayDateStr()
    )
  );

  const [khata, setKhata] = useState(null);
  const [daysDraft, setDaysDraft] = useState([]);
  const [reviewDraft, setReviewDraft] = useState({
    assigned_saturday_paras: "",
    recited_total_paras: "",
    recited_which_paras: "",
    saturday_lokma_count: "",
  });
  const [loadingInit, setLoadingInit] = useState(true);
  const [loadingKhata, setLoadingKhata] = useState(false);
  const [saving, setSaving] = useState(false);
  const [printingMonth, setPrintingMonth] = useState(false);
  const inputRefs = useRef({});

  useEffect(() => {
    const loadMeta = async () => {
      try {
        setLoadingInit(true);
        const [settingsRes, sectionsRes] = await Promise.all([
          hifzService.getSettings(),
          axiosInstance.get("/v1/sections"),
        ]);
        if (settingsRes.success) {
          const all = settingsRes.data.allClasses || settingsRes.data.classes || [];
          const hifzIds = settingsRes.data.hifzClassIds || [];
          const preferred = hifzIds.length > 0 ? all.filter((c) => hifzIds.includes(c._id)) : all;
          const list = preferred.length > 0 ? preferred : all;
          setClasses(list);
          const urlClass = searchParams.get("class_id");
          if (urlClass && list.some((c) => c._id === urlClass)) {
            setSelectedClassId(urlClass);
          } else if (list.length > 0 && !selectedClassId) {
            setSelectedClassId(list[0]._id);
          }
        }
        if (sectionsRes.data.success) {
          setSections(sectionsRes.data.data || []);
        }
      } catch (err) {
        console.error(err);
        toast.error("ক্লাস তালিকা লোড করতে সমস্যা হয়েছে");
      } finally {
        setLoadingInit(false);
      }
    };
    loadMeta();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const classSections = useMemo(
    () => getSectionsForClass(sections, selectedClassId),
    [sections, selectedClassId]
  );

  // Fetch students in selected class/section using daily-entries endpoint (already roll-sorted!)
  useEffect(() => {
    if (!selectedClassId) return;
    let active = true;
    const loadStudents = async () => {
      try {
        const res = await hifzService.getDailyEntries({
          class_id: selectedClassId,
          section_id: selectedSectionId === "all" ? "" : selectedSectionId,
          date: weekStart,
        });
        if (!active) return;
        if (res.success) {
          const list = (res.data.rows || []).map((r) => ({
            student_id: r.student_id,
            name: r.name,
            roll_number: r.roll_number,
          }));
          setStudents(list);
          setSelectedStudentId((prev) => {
            if (prev && list.some((s) => s.student_id === prev)) return prev;
            const urlSid = searchParams.get("student_id");
            if (urlSid && list.some((s) => s.student_id === urlSid)) return urlSid;
            return list[0]?.student_id || "";
          });
        }
      } catch (err) {
        console.error(err);
      }
    };
    loadStudents();
    return () => {
      active = false;
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [selectedClassId, selectedSectionId]);

  const fetchWeeklyKhata = useCallback(async () => {
    if (!selectedStudentId || !weekStart) {
      setKhata(null);
      setDaysDraft([]);
      return;
    }
    try {
      setLoadingKhata(true);
      const res = await hifzService.getWeeklyKhata({
        student_id: selectedStudentId,
        week_start: weekStart,
      });
      if (res.success) {
        setKhata(res.data);
        setDaysDraft(
          (res.data.days || []).map((d) => ({
            date: d.date,
            weekdayBn: d.weekdayBn,
            shortDateBn: d.shortDateBn,
            attendance: d.attendance || "",
            sabak: { para: d.sabak?.para || "", page: d.sabak?.page || "" },
            sat_sabak: {
              para: d.sat_sabak?.para || "",
              page: d.sat_sabak?.page || "",
              amount: d.sat_sabak?.amount || "",
              mistakes:
                d.sat_sabak?.mistakes !== undefined && d.sat_sabak?.mistakes !== null
                  ? String(d.sat_sabak.mistakes)
                  : "",
            },
            amukhta: {
              para: d.amukhta?.para || "",
              page: d.amukhta?.page || "",
              amount: d.amukhta?.amount || "",
              mistakes:
                d.amukhta?.mistakes !== undefined && d.amukhta?.mistakes !== null
                  ? String(d.amukhta.mistakes)
                  : "",
            },
            daily_tilawat: d.daily_tilawat || "",
            teacher_signature: d.teacher_signature || "",
          }))
        );
        const rev = res.data.weekly_review || {};
        setReviewDraft({
          assigned_saturday_paras: rev.assigned_saturday_paras || "",
          recited_total_paras: rev.recited_total_paras || "",
          recited_which_paras: rev.recited_which_paras || "",
          saturday_lokma_count:
            rev.saturday_lokma_count !== undefined && rev.saturday_lokma_count !== null
              ? String(rev.saturday_lokma_count)
              : "",
        });
      }
    } catch (err) {
      console.error(err);
      toast.error("সাপ্তাহিক খাতা লোড করতে সমস্যা হয়েছে");
    } finally {
      setLoadingKhata(false);
    }
  }, [selectedStudentId, weekStart]);

  useEffect(() => {
    fetchWeeklyKhata();
    if (selectedClassId) {
      const p = { class_id: selectedClassId, week_start: weekStart };
      if (selectedSectionId !== "all") p.section_id = selectedSectionId;
      if (selectedStudentId) p.student_id = selectedStudentId;
      setSearchParams(p, { replace: true });
    }
  }, [
    fetchWeeklyKhata,
    selectedClassId,
    selectedSectionId,
    selectedStudentId,
    weekStart,
    setSearchParams,
  ]);

  const currentStudentIndex = useMemo(
    () => students.findIndex((s) => s.student_id === selectedStudentId),
    [students, selectedStudentId]
  );

  const selectedClassName = useMemo(
    () => classes.find((c) => c._id === selectedClassId)?.name || "",
    [classes, selectedClassId]
  );

  const updateDayField = (dayIndex, group, field, value) => {
    setDaysDraft((prev) =>
      prev.map((d, idx) => {
        if (idx !== dayIndex) return d;
        if (!group) return { ...d, [field]: value };
        return { ...d, [group]: { ...d[group], [field]: value } };
      })
    );
  };

  const handleCellKeyDown = (e, rowIndex, colKey) => {
    if (e.key === "Enter" || e.key === "ArrowDown") {
      e.preventDefault();
      inputRefs.current[`${rowIndex + 1}_${colKey}`]?.focus();
    } else if (e.key === "ArrowUp") {
      e.preventDefault();
      inputRefs.current[`${rowIndex - 1}_${colKey}`]?.focus();
    }
  };

  const registerRef = (rowIndex, colKey) => (el) => {
    inputRefs.current[`${rowIndex}_${colKey}`] = el;
  };

  const saveKhata = async (advanceNext = false) => {
    if (!selectedStudentId) return;
    try {
      setSaving(true);
      const payload = {
        student_id: selectedStudentId,
        week_start: weekStart,
        days: daysDraft.map((d) => ({
          date: d.date,
          attendance: d.attendance || "",
          sabak: d.sabak,
          sat_sabak: d.sat_sabak,
          amukhta: d.amukhta,
          daily_tilawat: d.daily_tilawat,
          teacher_signature: d.teacher_signature,
        })),
        weekly_review: reviewDraft,
      };
      const res = await hifzService.saveWeeklyKhata(payload);
      if (res.success) {
        toast.success(res.message || "সাপ্তাহিক খাতা সংরক্ষণ করা হয়েছে");
        if (advanceNext && currentStudentIndex >= 0 && currentStudentIndex < students.length - 1) {
          setSelectedStudentId(students[currentStudentIndex + 1].student_id);
        } else {
          await fetchWeeklyKhata();
        }
      }
    } catch (err) {
      toast.error(err?.response?.data?.message || "সংরক্ষণ করতে সমস্যা হয়েছে");
    } finally {
      setSaving(false);
    }
  };

  const handlePrintWeek = () => {
    if (!khata) return;
    try {
      printSingleWeekKhata({
        madrasa: currentMadrasa,
        khataData: {
          ...khata,
          days: daysDraft,
          weekly_review: reviewDraft,
        },
        className: selectedClassName,
      });
    } catch (err) {
      toast.error(err.message);
    }
  };

  const handlePrintMonth = async () => {
    if (!selectedStudentId) return;
    try {
      setPrintingMonth(true);
      const month = khata?.weekInfo?.monthStr || weekStart.slice(0, 7);
      const res = await hifzService.getPrintData({
        student_id: selectedStudentId,
        month,
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

  const weekInfo = khata?.weekInfo;

  return (
    <div className="space-y-5 animate-in fade-in duration-500">
      <HifzPageHeader basePath={basePath} />

      {/* Filter Bar */}
      <div className="bg-surface border border-border rounded-2xl p-4 shadow-sm">
        <div className="grid grid-cols-1 md:grid-cols-12 gap-3 items-end">
          <div className="md:col-span-2">
            <label className="block text-xs font-bold text-fg-muted mb-1">ক্লাস</label>
            <select
              value={selectedClassId}
              onChange={(e) => {
                setSelectedClassId(e.target.value);
                setSelectedSectionId("all");
                setSelectedStudentId("");
              }}
              className="w-full px-3 py-2 text-sm font-semibold rounded-xl border border-border bg-background text-fg-main outline-none focus:border-[#1C7D5A]"
            >
              {classes.map((c) => (
                <option key={c._id} value={c._id}>
                  {c.name}
                </option>
              ))}
            </select>
          </div>

          <div className="md:col-span-2">
            <label className="block text-xs font-bold text-fg-muted mb-1">সেকশন</label>
            <select
              value={selectedSectionId}
              onChange={(e) => {
                setSelectedSectionId(e.target.value);
                setSelectedStudentId("");
              }}
              className="w-full px-3 py-2 text-sm font-semibold rounded-xl border border-border bg-background text-fg-main outline-none focus:border-[#1C7D5A]"
            >
              <option value="all">সব সেকশন</option>
              {classSections.map((s) => (
                <option key={s._id} value={s._id}>
                  {s.name}
                </option>
              ))}
            </select>
          </div>

          <div className="md:col-span-4">
            <label className="block text-xs font-bold text-fg-muted mb-1">শিক্ষার্থী</label>
            <div className="flex items-center gap-1.5">
              <button
                type="button"
                disabled={currentStudentIndex <= 0}
                onClick={() =>
                  currentStudentIndex > 0 &&
                  setSelectedStudentId(students[currentStudentIndex - 1].student_id)
                }
                className="p-2 rounded-xl border border-border hover:bg-primary-light/60 disabled:opacity-40 text-fg-muted cursor-pointer"
                title="আগের শিক্ষার্থী"
              >
                <ChevronLeft className="w-4 h-4" />
              </button>
              <select
                value={selectedStudentId}
                onChange={(e) => setSelectedStudentId(e.target.value)}
                className="flex-1 px-3 py-2 text-sm font-semibold rounded-xl border border-border bg-background text-fg-main outline-none focus:border-[#1C7D5A]"
              >
                {students.length === 0 && <option value="">কোনো শিক্ষার্থী নেই</option>}
                {students.map((st, idx) => (
                  <option key={st.student_id} value={st.student_id}>
                    {toBanglaDigits(st.roll_number || idx + 1)}. {st.name}
                  </option>
                ))}
              </select>
              <button
                type="button"
                disabled={currentStudentIndex < 0 || currentStudentIndex >= students.length - 1}
                onClick={() =>
                  currentStudentIndex >= 0 &&
                  currentStudentIndex < students.length - 1 &&
                  setSelectedStudentId(students[currentStudentIndex + 1].student_id)
                }
                className="p-2 rounded-xl border border-border hover:bg-primary-light/60 disabled:opacity-40 text-fg-muted cursor-pointer"
                title="পরের শিক্ষার্থী"
              >
                <ChevronRight className="w-4 h-4" />
              </button>
            </div>
          </div>

          <div className="md:col-span-4">
            <label className="block text-xs font-bold text-fg-muted mb-1">
              সপ্তাহ (সপ্তাহের প্রথম দিন — শনিবার)
            </label>
            <div className="flex items-center gap-1.5">
              <button
                type="button"
                onClick={() => setWeekStart(addDays(weekStart, -7))}
                className="p-2 rounded-xl border border-border hover:bg-primary-light/60 text-fg-muted cursor-pointer"
                title="আগের সপ্তাহ"
              >
                <ChevronLeft className="w-4 h-4" />
              </button>
              <input
                type="date"
                value={weekStart}
                onChange={(e) => e.target.value && setWeekStart(getSaturdayWeekStart(e.target.value))}
                className="flex-1 px-3 py-2 text-sm font-semibold rounded-xl border border-border bg-background text-fg-main outline-none focus:border-[#1C7D5A]"
              />
              <button
                type="button"
                onClick={() => setWeekStart(addDays(weekStart, 7))}
                className="p-2 rounded-xl border border-border hover:bg-primary-light/60 text-fg-muted cursor-pointer"
                title="পরের সপ্তাহ"
              >
                <ChevronRight className="w-4 h-4" />
              </button>
              <button
                type="button"
                onClick={() => setWeekStart(getSaturdayWeekStart(getTodayDateStr()))}
                className="px-3 py-2 text-xs font-bold rounded-xl border border-[#1C7D5A]/40 text-[#1C7D5A] hover:bg-[#e8f5f0] whitespace-nowrap cursor-pointer"
              >
                এই সপ্তাহ
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Authentic Paper Khata Card */}
      <div className="bg-surface border border-border rounded-2xl shadow-sm overflow-hidden">
        {loadingInit || loadingKhata ? (
          <div className="py-16 flex items-center justify-center gap-2 text-fg-muted text-sm">
            <Loader2 className="w-5 h-5 animate-spin text-[#1C7D5A]" />
            <span>সাপ্তাহিক খাতা লোড হচ্ছে...</span>
          </div>
        ) : !khata ? (
          <div className="py-16 text-center text-sm text-fg-muted">
            কোনো শিক্ষার্থী নির্বাচন করা হয়নি।
          </div>
        ) : (
          <div className="p-4 md:p-5 space-y-4">
            {/* Paper Header */}
            <div className="flex flex-col md:flex-row md:items-center gap-4 pb-3 border-b border-border">
              <div className="px-4 py-2 rounded-xl border-2 border-[#123628] dark:border-[#1C7D5A] bg-[#e8f5f0] dark:bg-[#1C7D5A]/20 text-[#123628] dark:text-emerald-100 text-lg font-bold shrink-0 text-center">
                সাপ্তাহিক তথ্য-
              </div>
              <div className="flex-1 space-y-1.5 text-sm">
                <div className="flex items-baseline gap-2 border-b border-dashed border-slate-300 dark:border-slate-600 pb-1">
                  <span className="font-bold text-fg-muted shrink-0">ছাত্র/ছাত্রীর নাম :</span>
                  <span className="font-bold text-fg-main">
                    {khata.student.name}{" "}
                    {khata.student.roll_number
                      ? `(রোল ${toBanglaDigits(khata.student.roll_number)})`
                      : ""}
                  </span>
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div className="flex items-baseline gap-2 border-b border-dashed border-slate-300 dark:border-slate-600 pb-1">
                    <span className="font-bold text-fg-muted shrink-0">মাস :</span>
                    <span className="font-semibold text-fg-main">
                      {weekInfo?.monthNameBn} {weekInfo?.yearBn}
                    </span>
                  </div>
                  <div className="flex items-baseline gap-2 border-b border-dashed border-slate-300 dark:border-slate-600 pb-1">
                    <span className="font-bold text-fg-muted shrink-0">সন :</span>
                    <span className="font-semibold text-fg-main">{weekInfo?.yearBn} ইং</span>
                  </div>
                </div>
              </div>
            </div>

            {/* 7-Day Register Table */}
            <div className="overflow-x-auto rounded-xl border border-border">
              <table className="w-full border-collapse text-xs min-w-[1040px]">
                <thead>
                  <tr className="bg-[#e8f5f0] dark:bg-[#123628] text-[#123628] dark:text-emerald-100 border-b border-[#1C7D5A]/25">
                    <th rowSpan={2} className="px-3 py-2 border-r border-[#1C7D5A]/20 w-28 text-left font-bold">
                      বার
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
                    <th rowSpan={2} className="px-2 py-2 border-r border-[#1C7D5A]/20 w-24 text-center font-bold">
                      দৈনিক তিলাওয়াত
                    </th>
                    <th rowSpan={2} className="px-2 py-2 border-r border-[#1C7D5A]/20 w-28 text-center font-bold">
                      শিক্ষকের স্বাক্ষর
                    </th>
                    <th rowSpan={2} className="px-2 py-2 w-20 text-center font-bold">
                      তারিখ
                    </th>
                  </tr>
                  <tr className="bg-[#f3faf7] dark:bg-[#123628]/70 text-[#123628] dark:text-emerald-200 border-b border-border text-[11px]">
                    <th className="py-1.5 px-1 border-r border-[#1C7D5A]/15 w-14 text-center">পারা</th>
                    <th className="py-1.5 px-1 border-r border-[#1C7D5A]/20 w-14 text-center">পৃষ্ঠা</th>
                    <th className="py-1.5 px-1 border-r border-[#1C7D5A]/15 w-14 text-center">পারা</th>
                    <th className="py-1.5 px-1 border-r border-[#1C7D5A]/15 w-14 text-center">পৃষ্ঠা</th>
                    <th className="py-1.5 px-1 border-r border-[#1C7D5A]/15 w-16 text-center">পরিমাণ</th>
                    <th className="py-1.5 px-1 border-r border-[#1C7D5A]/20 w-12 text-center">ভুল</th>
                    <th className="py-1.5 px-1 border-r border-[#1C7D5A]/15 w-14 text-center">পারা</th>
                    <th className="py-1.5 px-1 border-r border-[#1C7D5A]/15 w-14 text-center">পৃষ্ঠা</th>
                    <th className="py-1.5 px-1 border-r border-[#1C7D5A]/15 w-16 text-center">পরিমাণ</th>
                    <th className="py-1.5 px-1 border-r border-[#1C7D5A]/20 w-12 text-center">ভুল</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-border">
                  {daysDraft.map((day, dIdx) => {
                    const cellCls =
                      "w-full px-1.5 py-2 text-center bg-transparent text-fg-main font-medium focus:bg-[#e8f5f0]/50 dark:focus:bg-[#1C7D5A]/20 focus:outline-none focus:ring-1 focus:ring-[#1C7D5A] rounded";

                    return (
                      <tr
                        key={day.date}
                        className={`${
                          dIdx === 0
                            ? "bg-[#e8f5f0]/30 dark:bg-[#1C7D5A]/10"
                            : "hover:bg-slate-50/50 dark:hover:bg-slate-800/30"
                        }`}
                      >
                        <td className="px-2.5 py-1.5 border-r border-border">
                          <div className="font-bold text-fg-main">{day.weekdayBn}</div>
                          <select
                            value={day.attendance}
                            onChange={(e) =>
                              updateDayField(dIdx, null, "attendance", e.target.value)
                            }
                            className={`mt-1 w-full px-1.5 py-0.5 rounded border text-[11px] font-semibold outline-none cursor-pointer ${
                              day.attendance === "অনুপস্থিত"
                                ? "border-rose-300 bg-rose-50 text-rose-700"
                                : day.attendance === "ছুটি"
                                ? "border-amber-300 bg-amber-50 text-amber-700"
                                : "border-border bg-background text-fg-main"
                            }`}
                          >
                            <option value="">--</option>
                            <option value="উপস্থিত">উপস্থিত</option>
                            <option value="অনুপস্থিত">অনুপস্থিত</option>
                            <option value="ছুটি">ছুটি</option>
                          </select>
                        </td>

                        {/* Sabak */}
                        <td className="p-0.5 border-r border-border">
                          <input
                            ref={registerRef(dIdx, "sabak_para")}
                            type="text"
                            value={day.sabak.para}
                            onChange={(e) =>
                              updateDayField(dIdx, "sabak", "para", e.target.value)
                            }
                            onKeyDown={(e) => handleCellKeyDown(e, dIdx, "sabak_para")}
                            className={cellCls}
                          />
                        </td>
                        <td className="p-0.5 border-r border-border">
                          <input
                            ref={registerRef(dIdx, "sabak_page")}
                            type="text"
                            value={day.sabak.page}
                            onChange={(e) =>
                              updateDayField(dIdx, "sabak", "page", e.target.value)
                            }
                            onKeyDown={(e) => handleCellKeyDown(e, dIdx, "sabak_page")}
                            className={cellCls}
                          />
                        </td>

                        {/* Sat Sabak */}
                        <td className="p-0.5 border-r border-border">
                          <input
                            ref={registerRef(dIdx, "sat_para")}
                            type="text"
                            value={day.sat_sabak.para}
                            onChange={(e) =>
                              updateDayField(dIdx, "sat_sabak", "para", e.target.value)
                            }
                            onKeyDown={(e) => handleCellKeyDown(e, dIdx, "sat_para")}
                            className={cellCls}
                          />
                        </td>
                        <td className="p-0.5 border-r border-border">
                          <input
                            ref={registerRef(dIdx, "sat_page")}
                            type="text"
                            value={day.sat_sabak.page}
                            onChange={(e) =>
                              updateDayField(dIdx, "sat_sabak", "page", e.target.value)
                            }
                            onKeyDown={(e) => handleCellKeyDown(e, dIdx, "sat_page")}
                            className={cellCls}
                          />
                        </td>
                        <td className="p-0.5 border-r border-border">
                          <input
                            ref={registerRef(dIdx, "sat_amt")}
                            type="text"
                            value={day.sat_sabak.amount}
                            onChange={(e) =>
                              updateDayField(dIdx, "sat_sabak", "amount", e.target.value)
                            }
                            onKeyDown={(e) => handleCellKeyDown(e, dIdx, "sat_amt")}
                            className={cellCls}
                          />
                        </td>
                        <td className="p-0.5 border-r border-border">
                          <input
                            ref={registerRef(dIdx, "sat_err")}
                            type="number"
                            min="0"
                            value={day.sat_sabak.mistakes}
                            onChange={(e) =>
                              updateDayField(dIdx, "sat_sabak", "mistakes", e.target.value)
                            }
                            onKeyDown={(e) => handleCellKeyDown(e, dIdx, "sat_err")}
                            className={`${cellCls} text-rose-600 font-bold`}
                          />
                        </td>

                        {/* Amukhta */}
                        <td className="p-0.5 border-r border-border">
                          <input
                            ref={registerRef(dIdx, "amu_para")}
                            type="text"
                            value={day.amukhta.para}
                            onChange={(e) =>
                              updateDayField(dIdx, "amukhta", "para", e.target.value)
                            }
                            onKeyDown={(e) => handleCellKeyDown(e, dIdx, "amu_para")}
                            className={cellCls}
                          />
                        </td>
                        <td className="p-0.5 border-r border-border">
                          <input
                            ref={registerRef(dIdx, "amu_page")}
                            type="text"
                            value={day.amukhta.page}
                            onChange={(e) =>
                              updateDayField(dIdx, "amukhta", "page", e.target.value)
                            }
                            onKeyDown={(e) => handleCellKeyDown(e, dIdx, "amu_page")}
                            className={cellCls}
                          />
                        </td>
                        <td className="p-0.5 border-r border-border">
                          <input
                            ref={registerRef(dIdx, "amu_amt")}
                            type="text"
                            value={day.amukhta.amount}
                            onChange={(e) =>
                              updateDayField(dIdx, "amukhta", "amount", e.target.value)
                            }
                            onKeyDown={(e) => handleCellKeyDown(e, dIdx, "amu_amt")}
                            className={cellCls}
                          />
                        </td>
                        <td className="p-0.5 border-r border-border">
                          <input
                            ref={registerRef(dIdx, "amu_err")}
                            type="number"
                            min="0"
                            value={day.amukhta.mistakes}
                            onChange={(e) =>
                              updateDayField(dIdx, "amukhta", "mistakes", e.target.value)
                            }
                            onKeyDown={(e) => handleCellKeyDown(e, dIdx, "amu_err")}
                            className={`${cellCls} text-rose-600 font-bold`}
                          />
                        </td>

                        <td className="p-0.5 border-r border-border">
                          <input
                            ref={registerRef(dIdx, "tilawat")}
                            type="text"
                            value={day.daily_tilawat}
                            onChange={(e) =>
                              updateDayField(dIdx, null, "daily_tilawat", e.target.value)
                            }
                            onKeyDown={(e) => handleCellKeyDown(e, dIdx, "tilawat")}
                            className={cellCls}
                          />
                        </td>
                        <td className="p-0.5 border-r border-border">
                          <input
                            ref={registerRef(dIdx, "sig")}
                            type="text"
                            value={day.teacher_signature}
                            placeholder="স্বয়ংক্রিয়"
                            onChange={(e) =>
                              updateDayField(dIdx, null, "teacher_signature", e.target.value)
                            }
                            onKeyDown={(e) => handleCellKeyDown(e, dIdx, "sig")}
                            className={cellCls}
                          />
                        </td>
                        <td className="px-2 py-2 text-center font-semibold text-fg-muted whitespace-nowrap">
                          {day.shortDateBn}
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>

            {/* Bottom Saturday Exam Summary Boxes */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
              <div className="p-4 rounded-xl border border-border bg-background/50 space-y-2.5">
                <div className="flex flex-wrap items-center gap-1.5 text-xs font-semibold text-fg-main">
                  <span>সপ্তাহ:</span>
                  {WEEK_ORDINAL_BN.map((ord, idx) => {
                    const isActive = idx + 1 === (weekInfo?.weekNumber || 1);
                    return (
                      <span
                        key={ord}
                        className={`px-2 py-0.5 rounded-full transition-colors ${
                          isActive
                            ? "border-2 border-[#1C7D5A] bg-[#e8f5f0] dark:bg-[#1C7D5A]/30 text-[#123628] dark:text-emerald-100 font-bold"
                            : "text-fg-muted"
                        }`}
                      >
                        {ord}
                      </span>
                    );
                  })}
                </div>
                <div>
                  <label className="block text-xs font-bold text-fg-muted mb-1">
                    বণ্টনকৃত সাপ্তাহিক শনিবার পরাসমূহ
                  </label>
                  <input
                    type="text"
                    value={reviewDraft.assigned_saturday_paras}
                    onChange={(e) =>
                      setReviewDraft((p) => ({
                        ...p,
                        assigned_saturday_paras: e.target.value,
                      }))
                    }
                    placeholder="যেমন: ১-৫ পারা"
                    className="w-full px-3 py-2 text-xs font-semibold rounded-lg border border-border bg-surface text-fg-main outline-none focus:border-[#1C7D5A]"
                  />
                </div>
              </div>

              <div className="p-4 rounded-xl border border-border bg-background/50 space-y-2.5">
                <p className="text-xs font-bold text-fg-main">
                  তিলাওয়াতকৃত সাপ্তাহিক শনিবার পারা
                </p>
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-2.5">
                  <div>
                    <label className="block text-[11px] font-semibold text-fg-muted mb-1">
                      মোট
                    </label>
                    <input
                      type="text"
                      value={reviewDraft.recited_total_paras}
                      onChange={(e) =>
                        setReviewDraft((p) => ({
                          ...p,
                          recited_total_paras: e.target.value,
                        }))
                      }
                      placeholder="যেমন: ৪ পারা"
                      className="w-full px-3 py-2 text-xs font-semibold rounded-lg border border-border bg-surface text-fg-main outline-none focus:border-[#1C7D5A]"
                    />
                  </div>
                  <div>
                    <label className="block text-[11px] font-semibold text-fg-muted mb-1">
                      কোন কোন পারা
                    </label>
                    <input
                      type="text"
                      value={reviewDraft.recited_which_paras}
                      onChange={(e) =>
                        setReviewDraft((p) => ({
                          ...p,
                          recited_which_paras: e.target.value,
                        }))
                      }
                      placeholder="যেমন: ১, ২, ৩, ৪"
                      className="w-full px-3 py-2 text-xs font-semibold rounded-lg border border-border bg-surface text-fg-main outline-none focus:border-[#1C7D5A]"
                    />
                  </div>
                  <div>
                    <label className="block text-[11px] font-semibold text-fg-muted mb-1">
                      মোট লোকমার সংখ্যা
                    </label>
                    <input
                      type="number"
                      min="0"
                      value={reviewDraft.saturday_lokma_count}
                      onChange={(e) =>
                        setReviewDraft((p) => ({
                          ...p,
                          saturday_lokma_count: e.target.value,
                        }))
                      }
                      placeholder="০"
                      className="w-full px-3 py-2 text-xs font-bold text-rose-600 rounded-lg border border-border bg-surface outline-none focus:border-[#1C7D5A]"
                    />
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Footer Actions */}
        <div className="px-4 py-3.5 border-t border-border bg-slate-50/70 dark:bg-slate-900/30 flex flex-col lg:flex-row lg:items-center justify-between gap-3">
          <p className="text-xs text-fg-muted flex items-center gap-1.5">
            <Info className="w-3.5 h-3.5 text-[#1C7D5A] shrink-0" />
            <span>
              ভুলের ঘরে শুধু সংখ্যা। খালি লাইন সংরক্ষণ হয় না; পুরা লাইন মুছে দিলে সেদিনের তথ্য মুছে যাবে।
            </span>
          </p>

          <div className="flex flex-wrap items-center gap-2">
            <button
              type="button"
              onClick={handlePrintWeek}
              disabled={!khata}
              className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-xl border border-border bg-surface hover:border-[#1C7D5A] text-fg-main text-xs font-bold transition-colors cursor-pointer"
            >
              <Printer className="w-3.5 h-3.5 text-[#1C7D5A]" />
              এই সপ্তাহ প্রিন্ট
            </button>
            <button
              type="button"
              onClick={handlePrintMonth}
              disabled={!selectedStudentId || printingMonth}
              className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-xl border border-border bg-surface hover:border-[#1C7D5A] text-fg-main text-xs font-bold transition-colors cursor-pointer"
            >
              {printingMonth ? (
                <Loader2 className="w-3.5 h-3.5 animate-spin" />
              ) : (
                <Printer className="w-3.5 h-3.5 text-[#1C7D5A]" />
              )}
              পুরো মাস প্রিন্ট
            </button>
            <button
              type="button"
              onClick={() => saveKhata(true)}
              disabled={
                saving ||
                !selectedStudentId ||
                currentStudentIndex < 0 ||
                currentStudentIndex >= students.length - 1
              }
              className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-xl border border-[#1C7D5A]/40 bg-[#e8f5f0] dark:bg-[#1C7D5A]/20 text-[#123628] dark:text-emerald-100 hover:bg-[#d7eee4] disabled:opacity-50 text-xs font-bold transition-colors cursor-pointer"
            >
              <span>সংরক্ষণ করে পরের শিক্ষার্থী</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </button>
            <button
              type="button"
              onClick={() => saveKhata(false)}
              disabled={saving || !selectedStudentId}
              className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl bg-[#1C7D5A] hover:bg-[#123628] disabled:opacity-60 text-white text-xs font-bold shadow-sm transition-colors cursor-pointer"
            >
              {saving ? (
                <Loader2 className="w-3.5 h-3.5 animate-spin" />
              ) : (
                <Save className="w-3.5 h-3.5" />
              )}
              <span>সংরক্ষণ করুন</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default HifzWeeklyKhataPage;
