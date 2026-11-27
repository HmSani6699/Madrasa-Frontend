import { useState, useEffect, useCallback, useMemo, useRef } from "react";
import { useSearchParams, Link } from "react-router-dom";
import {
  ChevronLeft,
  ChevronRight,
  Save,
  Loader2,
  Lightbulb,
  Info,
  CalendarRange,
} from "lucide-react";
import { toast } from "react-hot-toast";
import axiosInstance from "../../../api/axiosInstance";
import hifzService from "../../../services/hifzService";
import HifzPageHeader from "./HifzPageHeader";
import {
  getTodayDateStr,
  addDays,
  getWeekInfoForDate,
  getSectionsForClass,
  toBanglaDigits,
  hasRowContent,
  ATTENDANCE_OPTIONS,
} from "./hifzUtils";

const emptyRowDraft = (studentId) => ({
  student_id: studentId,
  attendance: "উপস্থিত",
  sabak: { para: "", page: "" },
  sat_sabak: { para: "", page: "", amount: "", mistakes: "" },
  amukhta: { para: "", page: "", amount: "", mistakes: "" },
  daily_tilawat: "",
  teacher_signature: "",
});

const HifzDailyEntryPage = ({ basePath = "/admin/hifz" }) => {
  const [searchParams, setSearchParams] = useSearchParams();
  const [classes, setClasses] = useState([]);
  const [sections, setSections] = useState([]);
  const [selectedClassId, setSelectedClassId] = useState(searchParams.get("class_id") || "");
  const [selectedSectionId, setSelectedSectionId] = useState(searchParams.get("section_id") || "all");
  const [selectedDate, setSelectedDate] = useState(
    searchParams.get("date") || getTodayDateStr()
  );

  const [rows, setRows] = useState([]);
  const [drafts, setDrafts] = useState({});
  const [loadingInit, setLoadingInit] = useState(true);
  const [loadingRows, setLoadingRows] = useState(false);
  const [saving, setSaving] = useState(false);
  const [dirty, setDirty] = useState(false);
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

  const fetchEntries = useCallback(async () => {
    if (!selectedClassId || !selectedDate) return;
    try {
      setLoadingRows(true);
      const res = await hifzService.getDailyEntries({
        class_id: selectedClassId,
        section_id: selectedSectionId === "all" ? "" : selectedSectionId,
        date: selectedDate,
      });
      if (res.success) {
        const fetchedRows = res.data.rows || [];
        setRows(fetchedRows);
        const nextDrafts = {};
        fetchedRows.forEach((r) => {
          nextDrafts[r.student_id] = r.entry
            ? {
                student_id: r.student_id,
                attendance: r.entry.attendance || "উপস্থিত",
                sabak: { para: r.entry.sabak?.para || "", page: r.entry.sabak?.page || "" },
                sat_sabak: {
                  para: r.entry.sat_sabak?.para || "",
                  page: r.entry.sat_sabak?.page || "",
                  amount: r.entry.sat_sabak?.amount || "",
                  mistakes:
                    r.entry.sat_sabak?.mistakes !== undefined &&
                    r.entry.sat_sabak?.mistakes !== null
                      ? String(r.entry.sat_sabak.mistakes)
                      : "",
                },
                amukhta: {
                  para: r.entry.amukhta?.para || "",
                  page: r.entry.amukhta?.page || "",
                  amount: r.entry.amukhta?.amount || "",
                  mistakes:
                    r.entry.amukhta?.mistakes !== undefined &&
                    r.entry.amukhta?.mistakes !== null
                      ? String(r.entry.amukhta.mistakes)
                      : "",
                },
                daily_tilawat: r.entry.daily_tilawat || "",
                teacher_signature: r.entry.teacher_signature || "",
              }
            : emptyRowDraft(r.student_id);
        });
        setDrafts(nextDrafts);
        setDirty(false);
      }
    } catch (err) {
      console.error("Failed to fetch daily entries:", err);
      toast.error("দৈনিক তথ্য লোড করতে সমস্যা হয়েছে");
    } finally {
      setLoadingRows(false);
    }
  }, [selectedClassId, selectedSectionId, selectedDate]);

  useEffect(() => {
    if (selectedClassId) {
      fetchEntries();
      const params = { class_id: selectedClassId, date: selectedDate };
      if (selectedSectionId !== "all") params.section_id = selectedSectionId;
      setSearchParams(params, { replace: true });
    }
  }, [selectedClassId, selectedSectionId, selectedDate, fetchEntries, setSearchParams]);

  const updateDraftField = (studentId, group, field, value) => {
    setDirty(true);
    setDrafts((prev) => {
      const current = prev[studentId] || emptyRowDraft(studentId);
      if (!group) {
        return { ...prev, [studentId]: { ...current, [field]: value } };
      }
      return {
        ...prev,
        [studentId]: {
          ...current,
          [group]: { ...current[group], [field]: value },
        },
      };
    });
  };

  const handleCellKeyDown = (e, rowIndex, colKey) => {
    if (e.key === "Enter" || e.key === "ArrowDown") {
      e.preventDefault();
      const nextEl = inputRefs.current[`${rowIndex + 1}_${colKey}`];
      if (nextEl) nextEl.focus();
    } else if (e.key === "ArrowUp") {
      e.preventDefault();
      const prevEl = inputRefs.current[`${rowIndex - 1}_${colKey}`];
      if (prevEl) prevEl.focus();
    }
  };

  const registerRef = (rowIndex, colKey) => (el) => {
    inputRefs.current[`${rowIndex}_${colKey}`] = el;
  };

  const handleSaveAll = async () => {
    if (!selectedClassId) return;
    try {
      setSaving(true);
      const payloadEntries = rows.map((r) => drafts[r.student_id] || emptyRowDraft(r.student_id));
      const res = await hifzService.saveDailyEntriesBulk({
        date: selectedDate,
        class_id: selectedClassId,
        section_id: selectedSectionId === "all" ? "" : selectedSectionId,
        entries: payloadEntries,
      });
      if (res.success) {
        toast.success(res.message || "সবার তথ্য সংরক্ষণ করা হয়েছে");
        await fetchEntries();
      }
    } catch (err) {
      toast.error(err?.response?.data?.message || "তথ্য সংরক্ষণ করতে সমস্যা হয়েছে");
    } finally {
      setSaving(false);
    }
  };

  const weekInfo = useMemo(() => getWeekInfoForDate(selectedDate), [selectedDate]);

  const writtenCount = useMemo(() => {
    return rows.filter((r) => hasRowContent(drafts[r.student_id])).length;
  }, [rows, drafts]);

  return (
    <div className="space-y-5 animate-in fade-in duration-500">
      <HifzPageHeader basePath={basePath} />

      {/* Filter Bar */}
      <div className="bg-surface border border-border rounded-2xl p-4 shadow-sm">
        <div className="grid grid-cols-1 md:grid-cols-12 gap-4 items-end">
          <div className="md:col-span-3">
            <label className="block text-xs font-bold text-fg-muted mb-1">ক্লাস</label>
            <select
              value={selectedClassId}
              onChange={(e) => {
                setSelectedClassId(e.target.value);
                setSelectedSectionId("all");
              }}
              className="w-full px-3 py-2 text-sm font-semibold rounded-xl border border-border bg-background text-fg-main outline-none focus:border-[#1C7D5A]"
            >
              {classes.length === 0 && <option value="">ক্লাস পাওয়া যায়নি</option>}
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
              onChange={(e) => setSelectedSectionId(e.target.value)}
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
            <label className="block text-xs font-bold text-fg-muted mb-1">তারিখ</label>
            <div className="flex items-center gap-1.5">
              <button
                type="button"
                onClick={() => setSelectedDate(addDays(selectedDate, -1))}
                className="p-2 rounded-xl border border-border hover:bg-primary-light/60 text-fg-muted cursor-pointer"
                title="আগের দিন"
              >
                <ChevronLeft className="w-4 h-4" />
              </button>
              <input
                type="date"
                value={selectedDate}
                onChange={(e) => e.target.value && setSelectedDate(e.target.value)}
                className="flex-1 px-3 py-2 text-sm font-semibold rounded-xl border border-border bg-background text-fg-main outline-none focus:border-[#1C7D5A]"
              />
              <button
                type="button"
                onClick={() => setSelectedDate(addDays(selectedDate, 1))}
                className="p-2 rounded-xl border border-border hover:bg-primary-light/60 text-fg-muted cursor-pointer"
                title="পরের দিন"
              >
                <ChevronRight className="w-4 h-4" />
              </button>
              <button
                type="button"
                onClick={() => setSelectedDate(getTodayDateStr())}
                className="px-3 py-2 text-xs font-bold rounded-xl border border-[#1C7D5A]/40 text-[#1C7D5A] hover:bg-[#e8f5f0] cursor-pointer"
              >
                আজ
              </button>
            </div>
          </div>

          <div className="md:col-span-3">
            <div className="px-3 py-2 rounded-xl bg-[#e8f5f0] dark:bg-[#1C7D5A]/20 border border-[#1C7D5A]/30 text-center">
              <p className="text-xs font-bold text-[#123628] dark:text-emerald-200">
                {weekInfo.weekdayBn} • {weekInfo.ordinalBn} সপ্তাহ
              </p>
              <p className="text-[11px] text-[#1C7D5A] dark:text-emerald-300 font-semibold">
                {weekInfo.monthNameBn} {weekInfo.yearBn}
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Table Card */}
      <div className="bg-surface border border-border rounded-2xl shadow-sm overflow-hidden">
        {/* Helper Strip */}
        <div className="px-4 py-3 border-b border-border flex flex-col sm:flex-row sm:items-center justify-between gap-2 bg-slate-50/70 dark:bg-slate-900/30">
          <div className="flex items-center gap-2 text-xs text-fg-muted">
            <Lightbulb className="w-4 h-4 text-[#EAB33C] shrink-0" />
            <span>
              হালকা লেখা = আগের দিনের তথ্য (ঐচ্ছিক)। <kbd className="px-1.5 py-0.5 rounded bg-white dark:bg-slate-800 border border-border text-[10px]">Enter</kbd> বা ↑ ↓ চাপলে একই কলামে পরের শিক্ষার্থীতে যাবে।
            </span>
          </div>
          <div className="flex items-center gap-3 shrink-0">
            {dirty && (
              <span className="text-[11px] font-bold text-amber-600 bg-amber-50 dark:bg-amber-950/50 px-2.5 py-0.5 rounded-full border border-amber-200">
                অসংরক্ষিত পরিবর্তন রয়েছে
              </span>
            )}
            <span className="text-xs font-bold text-[#1C7D5A]">
              {toBanglaDigits(writtenCount)} / {toBanglaDigits(rows.length)} জনের আজকের কাজ লেখা হয়েছে
            </span>
          </div>
        </div>

        {loadingInit || loadingRows ? (
          <div className="py-16 flex items-center justify-center gap-2 text-fg-muted text-sm">
            <Loader2 className="w-5 h-5 animate-spin text-[#1C7D5A]" />
            <span>শিক্ষার্থী তালিকা লোড হচ্ছে...</span>
          </div>
        ) : rows.length === 0 ? (
          <div className="py-16 text-center text-sm text-fg-muted">
            এই ক্লাস/সেকশনে কোনো সক্রিয় শিক্ষার্থী পাওয়া যায়নি।
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full border-collapse text-xs min-w-[1120px]">
              <thead>
                <tr className="bg-[#e8f5f0] dark:bg-[#123628] text-[#123628] dark:text-emerald-100 border-b border-[#1C7D5A]/25">
                  <th rowSpan={2} className="px-2 py-2.5 border-r border-[#1C7D5A]/20 w-12 text-center font-bold">
                    রোল
                  </th>
                  <th rowSpan={2} className="px-3 py-2.5 border-r border-[#1C7D5A]/20 min-w-[165px] text-left font-bold">
                    শিক্ষার্থী
                  </th>
                  <th rowSpan={2} className="px-2 py-2.5 border-r border-[#1C7D5A]/20 w-28 text-center font-bold">
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
                  <th rowSpan={2} className="px-2 py-2.5 border-r border-[#1C7D5A]/20 w-24 text-center font-bold">
                    দৈনিক তিলাওয়াত
                  </th>
                  <th rowSpan={2} className="px-2 py-2.5 w-24 text-center font-bold">
                    স্বাক্ষর
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
                {rows.map((row, rIdx) => {
                  const d = drafts[row.student_id] || emptyRowDraft(row.student_id);
                  const prev = row.previousEntry;
                  const prevSabakLabel =
                    prev?.sabak?.para || prev?.sabak?.page
                      ? `আগে: পারা ${prev.sabak.para || "-"}, পৃ. ${prev.sabak.page || "-"}`
                      : null;

                  const cellCls =
                    "w-full px-1.5 py-1.5 text-center bg-transparent text-fg-main font-medium placeholder:text-slate-300 dark:placeholder:text-slate-600 focus:bg-[#e8f5f0]/50 dark:focus:bg-[#1C7D5A]/20 focus:outline-none focus:ring-1 focus:ring-[#1C7D5A] rounded";

                  return (
                    <tr
                      key={row.student_id}
                      className="hover:bg-slate-50/60 dark:hover:bg-slate-800/30 transition-colors"
                    >
                      <td className="px-2 py-2 border-r border-border text-center font-bold text-fg-muted">
                        {toBanglaDigits(row.roll_number || rIdx + 1)}
                      </td>
                      <td className="px-3 py-1.5 border-r border-border">
                        <div className="flex items-center justify-between gap-1">
                          <div className="min-w-0">
                            <Link
                              to={`${basePath}/weekly-khata?class_id=${selectedClassId}&student_id=${row.student_id}&date=${selectedDate}`}
                              className="font-bold text-[#1C7D5A] hover:underline block truncate"
                              title="সাপ্তাহিক খাতা দেখুন"
                            >
                              {row.name}
                            </Link>
                            {prevSabakLabel && (
                              <span className="text-[10px] text-slate-400 block truncate">
                                {prevSabakLabel}
                              </span>
                            )}
                          </div>
                          <Link
                            to={`${basePath}/weekly-khata?class_id=${selectedClassId}&student_id=${row.student_id}&date=${selectedDate}`}
                            className="p-1 rounded text-slate-400 hover:text-[#1C7D5A] hover:bg-[#e8f5f0] shrink-0"
                            title="সাপ্তাহিক খাতায় যান"
                          >
                            <CalendarRange className="w-3.5 h-3.5" />
                          </Link>
                        </div>
                      </td>
                      <td className="px-1.5 py-1 border-r border-border">
                        <select
                          value={d.attendance}
                          onChange={(e) =>
                            updateDraftField(row.student_id, null, "attendance", e.target.value)
                          }
                          className={`w-full px-1.5 py-1.5 rounded-lg border text-xs font-semibold outline-none cursor-pointer ${
                            d.attendance === "অনুপস্থিত"
                              ? "border-rose-300 bg-rose-50 text-rose-700"
                              : d.attendance === "ছুটি"
                              ? "border-amber-300 bg-amber-50 text-amber-700"
                              : "border-border bg-background text-fg-main"
                          }`}
                        >
                          {ATTENDANCE_OPTIONS.map((opt) => (
                            <option key={opt.value} value={opt.value}>
                              {opt.label}
                            </option>
                          ))}
                        </select>
                      </td>

                      {/* Sabak */}
                      <td className="p-0.5 border-r border-border">
                        <input
                          ref={registerRef(rIdx, "sabak_para")}
                          type="text"
                          value={d.sabak.para}
                          placeholder={prev?.sabak?.para || ""}
                          onChange={(e) =>
                            updateDraftField(row.student_id, "sabak", "para", e.target.value)
                          }
                          onKeyDown={(e) => handleCellKeyDown(e, rIdx, "sabak_para")}
                          className={cellCls}
                        />
                      </td>
                      <td className="p-0.5 border-r border-border">
                        <input
                          ref={registerRef(rIdx, "sabak_page")}
                          type="text"
                          value={d.sabak.page}
                          placeholder={prev?.sabak?.page || ""}
                          onChange={(e) =>
                            updateDraftField(row.student_id, "sabak", "page", e.target.value)
                          }
                          onKeyDown={(e) => handleCellKeyDown(e, rIdx, "sabak_page")}
                          className={cellCls}
                        />
                      </td>

                      {/* Sat Sabak */}
                      <td className="p-0.5 border-r border-border">
                        <input
                          ref={registerRef(rIdx, "sat_para")}
                          type="text"
                          value={d.sat_sabak.para}
                          placeholder={prev?.sat_sabak?.para || ""}
                          onChange={(e) =>
                            updateDraftField(row.student_id, "sat_sabak", "para", e.target.value)
                          }
                          onKeyDown={(e) => handleCellKeyDown(e, rIdx, "sat_para")}
                          className={cellCls}
                        />
                      </td>
                      <td className="p-0.5 border-r border-border">
                        <input
                          ref={registerRef(rIdx, "sat_page")}
                          type="text"
                          value={d.sat_sabak.page}
                          placeholder={prev?.sat_sabak?.page || ""}
                          onChange={(e) =>
                            updateDraftField(row.student_id, "sat_sabak", "page", e.target.value)
                          }
                          onKeyDown={(e) => handleCellKeyDown(e, rIdx, "sat_page")}
                          className={cellCls}
                        />
                      </td>
                      <td className="p-0.5 border-r border-border">
                        <input
                          ref={registerRef(rIdx, "sat_amt")}
                          type="text"
                          value={d.sat_sabak.amount}
                          placeholder={prev?.sat_sabak?.amount || ""}
                          onChange={(e) =>
                            updateDraftField(row.student_id, "sat_sabak", "amount", e.target.value)
                          }
                          onKeyDown={(e) => handleCellKeyDown(e, rIdx, "sat_amt")}
                          className={cellCls}
                        />
                      </td>
                      <td className="p-0.5 border-r border-border">
                        <input
                          ref={registerRef(rIdx, "sat_err")}
                          type="number"
                          min="0"
                          value={d.sat_sabak.mistakes}
                          placeholder={
                            prev?.sat_sabak?.mistakes !== "" &&
                            prev?.sat_sabak?.mistakes !== undefined
                              ? String(prev.sat_sabak.mistakes)
                              : ""
                          }
                          onChange={(e) =>
                            updateDraftField(row.student_id, "sat_sabak", "mistakes", e.target.value)
                          }
                          onKeyDown={(e) => handleCellKeyDown(e, rIdx, "sat_err")}
                          className={`${cellCls} text-rose-600 font-bold`}
                        />
                      </td>

                      {/* Amukhta */}
                      <td className="p-0.5 border-r border-border">
                        <input
                          ref={registerRef(rIdx, "amu_para")}
                          type="text"
                          value={d.amukhta.para}
                          placeholder={prev?.amukhta?.para || ""}
                          onChange={(e) =>
                            updateDraftField(row.student_id, "amukhta", "para", e.target.value)
                          }
                          onKeyDown={(e) => handleCellKeyDown(e, rIdx, "amu_para")}
                          className={cellCls}
                        />
                      </td>
                      <td className="p-0.5 border-r border-border">
                        <input
                          ref={registerRef(rIdx, "amu_page")}
                          type="text"
                          value={d.amukhta.page}
                          placeholder={prev?.amukhta?.page || ""}
                          onChange={(e) =>
                            updateDraftField(row.student_id, "amukhta", "page", e.target.value)
                          }
                          onKeyDown={(e) => handleCellKeyDown(e, rIdx, "amu_page")}
                          className={cellCls}
                        />
                      </td>
                      <td className="p-0.5 border-r border-border">
                        <input
                          ref={registerRef(rIdx, "amu_amt")}
                          type="text"
                          value={d.amukhta.amount}
                          placeholder={prev?.amukhta?.amount || ""}
                          onChange={(e) =>
                            updateDraftField(row.student_id, "amukhta", "amount", e.target.value)
                          }
                          onKeyDown={(e) => handleCellKeyDown(e, rIdx, "amu_amt")}
                          className={cellCls}
                        />
                      </td>
                      <td className="p-0.5 border-r border-border">
                        <input
                          ref={registerRef(rIdx, "amu_err")}
                          type="number"
                          min="0"
                          value={d.amukhta.mistakes}
                          placeholder={
                            prev?.amukhta?.mistakes !== "" &&
                            prev?.amukhta?.mistakes !== undefined
                              ? String(prev.amukhta.mistakes)
                              : ""
                          }
                          onChange={(e) =>
                            updateDraftField(row.student_id, "amukhta", "mistakes", e.target.value)
                          }
                          onKeyDown={(e) => handleCellKeyDown(e, rIdx, "amu_err")}
                          className={`${cellCls} text-rose-600 font-bold`}
                        />
                      </td>

                      {/* Daily Tilawat & Signature */}
                      <td className="p-0.5 border-r border-border">
                        <input
                          ref={registerRef(rIdx, "tilawat")}
                          type="text"
                          value={d.daily_tilawat}
                          placeholder={prev?.daily_tilawat || ""}
                          onChange={(e) =>
                            updateDraftField(row.student_id, null, "daily_tilawat", e.target.value)
                          }
                          onKeyDown={(e) => handleCellKeyDown(e, rIdx, "tilawat")}
                          className={cellCls}
                        />
                      </td>
                      <td className="p-0.5">
                        <input
                          ref={registerRef(rIdx, "sig")}
                          type="text"
                          value={d.teacher_signature}
                          placeholder="স্বয়ংক্রিয়"
                          onChange={(e) =>
                            updateDraftField(
                              row.student_id,
                              null,
                              "teacher_signature",
                              e.target.value
                            )
                          }
                          onKeyDown={(e) => handleCellKeyDown(e, rIdx, "sig")}
                          className={cellCls}
                        />
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        )}

        {/* Footer Save Bar */}
        <div className="px-4 py-3.5 border-t border-border bg-slate-50/70 dark:bg-slate-900/30 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <p className="text-xs text-fg-muted flex items-center gap-1.5">
            <Info className="w-3.5 h-3.5 text-[#1C7D5A] shrink-0" />
            <span>ঘরের লাইন খালি থাকলে তাদের কিছু সংরক্ষণ হবে না।</span>
          </p>
          <button
            type="button"
            onClick={handleSaveAll}
            disabled={saving || rows.length === 0}
            className="inline-flex items-center justify-center gap-2 px-5 py-2.5 rounded-xl bg-[#1C7D5A] hover:bg-[#123628] disabled:opacity-60 text-white text-sm font-bold shadow-sm transition-colors cursor-pointer"
          >
            {saving ? <Loader2 className="w-4 h-4 animate-spin" /> : <Save className="w-4 h-4" />}
            <span>সবার তথ্য সংরক্ষণ করুন</span>
          </button>
        </div>
      </div>
    </div>
  );
};

export default HifzDailyEntryPage;
