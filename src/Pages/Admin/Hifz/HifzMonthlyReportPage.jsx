import { useState, useEffect, useCallback, useMemo } from "react";
import { useSearchParams, useNavigate } from "react-router-dom";
import { Printer, Loader2, CalendarRange, FileText } from "lucide-react";
import { toast } from "react-hot-toast";
import axiosInstance from "../../../api/axiosInstance";
import hifzService from "../../../services/hifzService";
import { useAuth } from "../../../context/AuthContext";
import HifzPageHeader from "./HifzPageHeader";
import {
  getCurrentMonthStr,
  getSectionsForClass,
  toBanglaDigits,
  formatBanglaMonthYear,
} from "./hifzUtils";
import { printStudentMonthKhata, printBlankKhataForm } from "./hifzPrintUtils";

const HifzMonthlyReportPage = ({ basePath = "/admin/hifz" }) => {
  const { currentMadrasa } = useAuth();
  const navigate = useNavigate();
  const [searchParams, setSearchParams] = useSearchParams();

  const [classes, setClasses] = useState([]);
  const [sections, setSections] = useState([]);
  const [selectedClassId, setSelectedClassId] = useState(searchParams.get("class_id") || "");
  const [selectedSectionId, setSelectedSectionId] = useState(searchParams.get("section_id") || "all");
  const [selectedMonth, setSelectedMonth] = useState(
    searchParams.get("month") || getCurrentMonthStr()
  );

  const [report, setReport] = useState(null);
  const [loadingInit, setLoadingInit] = useState(true);
  const [loadingReport, setLoadingReport] = useState(false);
  const [printingClass, setPrintingClass] = useState(false);
  const [printingStudentId, setPrintingStudentId] = useState("");

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

  const selectedClassName = useMemo(
    () => classes.find((c) => c._id === selectedClassId)?.name || "",
    [classes, selectedClassId]
  );

  const fetchReport = useCallback(async () => {
    if (!selectedClassId || !selectedMonth) return;
    try {
      setLoadingReport(true);
      const res = await hifzService.getMonthlyReport({
        class_id: selectedClassId,
        section_id: selectedSectionId === "all" ? "" : selectedSectionId,
        month: selectedMonth,
      });
      if (res.success) {
        setReport(res.data);
      }
    } catch (err) {
      console.error(err);
      toast.error("মাসিক রিপোর্ট লোড করতে সমস্যা হয়েছে");
    } finally {
      setLoadingReport(false);
    }
  }, [selectedClassId, selectedSectionId, selectedMonth]);

  useEffect(() => {
    if (selectedClassId) {
      fetchReport();
      const params = { class_id: selectedClassId, month: selectedMonth };
      if (selectedSectionId !== "all") params.section_id = selectedSectionId;
      setSearchParams(params, { replace: true });
    }
  }, [selectedClassId, selectedSectionId, selectedMonth, fetchReport, setSearchParams]);

  const handlePrintFullClass = async () => {
    if (!selectedClassId) return;
    try {
      setPrintingClass(true);
      const res = await hifzService.getPrintData({
        class_id: selectedClassId,
        section_id: selectedSectionId === "all" ? "" : selectedSectionId,
        month: selectedMonth,
      });
      if (res.success) {
        if ((res.data?.students || []).length === 0) {
          toast.error("প্রিন্ট করার জন্য কোনো শিক্ষার্থী নেই");
          return;
        }
        printStudentMonthKhata({ madrasa: currentMadrasa, printData: res.data });
      }
    } catch (err) {
      toast.error(err.message || "পুরো ক্লাসের খাতা প্রিন্ট করতে সমস্যা হয়েছে");
    } finally {
      setPrintingClass(false);
    }
  };

  const handlePrintOneStudent = async (studentId) => {
    try {
      setPrintingStudentId(studentId);
      const res = await hifzService.getPrintData({
        student_id: studentId,
        month: selectedMonth,
      });
      if (res.success) {
        printStudentMonthKhata({ madrasa: currentMadrasa, printData: res.data });
      }
    } catch (err) {
      toast.error(err.message || "খাতা প্রিন্ট করতে সমস্যা হয়েছে");
    } finally {
      setPrintingStudentId("");
    }
  };

  const handlePrintBlank = () => {
    try {
      printBlankKhataForm({ madrasa: currentMadrasa, className: selectedClassName });
    } catch (err) {
      toast.error(err.message);
    }
  };

  const weeks = report?.weeks || [];
  const rows = report?.rows || [];
  const zeroDash = (n) => (n > 0 ? toBanglaDigits(n) : "-");

  return (
    <div className="space-y-5 animate-in fade-in duration-500">
      <HifzPageHeader basePath={basePath} />

      {/* Filter & Print Controls */}
      <div className="bg-surface border border-border rounded-2xl p-4 shadow-sm space-y-3">
        <div className="grid grid-cols-1 md:grid-cols-12 gap-3 items-end">
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

          <div className="md:col-span-3">
            <label className="block text-xs font-bold text-fg-muted mb-1">মাস</label>
            <input
              type="month"
              value={selectedMonth}
              onChange={(e) => e.target.value && setSelectedMonth(e.target.value)}
              className="w-full px-3 py-2 text-sm font-semibold rounded-xl border border-border bg-background text-fg-main outline-none focus:border-[#1C7D5A]"
            />
          </div>

          <div className="md:col-span-4 flex flex-wrap md:justify-end gap-2">
            <button
              type="button"
              onClick={handlePrintFullClass}
              disabled={printingClass || rows.length === 0}
              className="inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-[#1C7D5A] hover:bg-[#123628] disabled:opacity-60 text-white text-xs font-bold shadow-sm transition-colors cursor-pointer"
            >
              {printingClass ? (
                <Loader2 className="w-4 h-4 animate-spin" />
              ) : (
                <Printer className="w-4 h-4" />
              )}
              <span>পুরো ক্লাসের খাতা প্রিন্ট</span>
            </button>
            <button
              type="button"
              onClick={handlePrintBlank}
              className="inline-flex items-center gap-2 px-3.5 py-2 rounded-xl border border-border bg-surface hover:border-[#1C7D5A] text-fg-main text-xs font-bold transition-colors cursor-pointer"
            >
              <FileText className="w-4 h-4 text-[#1C7D5A]" />
              <span>ফাঁকা ফর্ম প্রিন্ট</span>
            </button>
          </div>
        </div>

        {/* Month Weeks Strip */}
        {weeks.length > 0 && (
          <div className="flex flex-wrap items-center gap-2 pt-2 border-t border-border text-xs">
            <span className="font-bold text-fg-muted">
              {formatBanglaMonthYear(selectedMonth)} মাসে {toBanglaDigits(weeks.length)}টি সপ্তাহ:
            </span>
            {weeks.map((w) => (
              <button
                key={w.weekStart}
                type="button"
                onClick={() =>
                  navigate(
                    `${basePath}/weekly-khata?class_id=${selectedClassId}&week_start=${w.weekStart}`
                  )
                }
                className="px-2.5 py-1 rounded-lg border border-border bg-background hover:border-[#1C7D5A] hover:text-[#1C7D5A] font-semibold text-fg-main transition-colors cursor-pointer"
                title="এই সপ্তাহের খাতায় যান"
              >
                {w.ordinalBn}: {w.shortRangeBn}
              </button>
            ))}
          </div>
        )}
      </div>

      {/* Summary Table */}
      <div className="bg-surface border border-border rounded-2xl shadow-sm overflow-hidden">
        {loadingInit || loadingReport ? (
          <div className="py-16 flex items-center justify-center gap-2 text-fg-muted text-sm">
            <Loader2 className="w-5 h-5 animate-spin text-[#1C7D5A]" />
            <span>মাসিক রিপোর্ট তৈরি হচ্ছে...</span>
          </div>
        ) : rows.length === 0 ? (
          <div className="py-16 text-center text-sm text-fg-muted">
            এই ক্লাস/সেকশনে কোনো শিক্ষার্থী পাওয়া যায়নি।
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full border-collapse text-xs min-w-[860px]">
              <thead>
                <tr className="bg-[#e8f5f0] dark:bg-[#123628] text-[#123628] dark:text-emerald-100 border-b border-[#1C7D5A]/25">
                  <th className="px-3 py-3 text-center w-14 font-bold">রোল</th>
                  <th className="px-3 py-3 text-left font-bold">শিক্ষার্থী</th>
                  <th className="px-3 py-3 text-center font-bold">উপস্থিত দিন</th>
                  <th className="px-3 py-3 text-center font-bold">অনুপস্থিত</th>
                  <th className="px-3 py-3 text-center font-bold">ছুটি</th>
                  <th className="px-3 py-3 text-center font-bold">সবক নিয়েছে</th>
                  <th className="px-3 py-3 text-center font-bold">সাত সবক ভুল</th>
                  <th className="px-3 py-3 text-center font-bold">আমুখতা ভুল</th>
                  <th className="px-3 py-3 text-center font-bold">শনিবার লোকমা</th>
                  <th className="px-3 py-3 text-left font-bold">সর্বশেষ সবক</th>
                  <th className="px-3 py-3 text-center w-24 font-bold">একশন</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-border">
                {rows.map((r, idx) => (
                  <tr
                    key={r.student_id}
                    className="hover:bg-slate-50/70 dark:hover:bg-slate-800/30 transition-colors"
                  >
                    <td className="px-3 py-2.5 text-center font-bold text-fg-muted">
                      {toBanglaDigits(r.roll_number || idx + 1)}
                    </td>
                    <td className="px-3 py-2.5 font-bold text-fg-main">{r.name}</td>
                    <td className="px-3 py-2.5 text-center font-semibold text-emerald-600">
                      {zeroDash(r.presentDays)}
                    </td>
                    <td className="px-3 py-2.5 text-center font-semibold text-rose-600">
                      {zeroDash(r.absentDays)}
                    </td>
                    <td className="px-3 py-2.5 text-center font-semibold text-amber-600">
                      {zeroDash(r.leaveDays)}
                    </td>
                    <td className="px-3 py-2.5 text-center font-semibold text-fg-main">
                      {zeroDash(r.sabakDays)}
                    </td>
                    <td
                      className={`px-3 py-2.5 text-center font-bold ${
                        r.satSabakMistakes > 0 ? "text-rose-600" : "text-fg-muted"
                      }`}
                    >
                      {zeroDash(r.satSabakMistakes)}
                    </td>
                    <td
                      className={`px-3 py-2.5 text-center font-bold ${
                        r.amukhtaMistakes > 0 ? "text-rose-600" : "text-fg-muted"
                      }`}
                    >
                      {zeroDash(r.amukhtaMistakes)}
                    </td>
                    <td
                      className={`px-3 py-2.5 text-center font-bold ${
                        r.saturdayLokma > 0 ? "text-rose-600" : "text-fg-muted"
                      }`}
                    >
                      {zeroDash(r.saturdayLokma)}
                    </td>
                    <td className="px-3 py-2.5 text-fg-main font-medium">
                      {r.latestSabak
                        ? `পারা ${r.latestSabak.para || "-"}, পৃষ্ঠা ${r.latestSabak.page || "-"}`
                        : "-"}
                    </td>
                    <td className="px-3 py-2.5">
                      <div className="flex items-center justify-center gap-1.5">
                        <button
                          type="button"
                          onClick={() =>
                            navigate(
                              `${basePath}/weekly-khata?class_id=${selectedClassId}&student_id=${
                                r.student_id
                              }&week_start=${weeks[0]?.weekStart || `${selectedMonth}-01`}`
                            )
                          }
                          className="p-1.5 rounded-lg border border-border hover:border-[#1C7D5A] text-fg-muted hover:text-[#1C7D5A] cursor-pointer"
                          title="সাপ্তাহিক খাতা দেখুন"
                        >
                          <CalendarRange className="w-3.5 h-3.5" />
                        </button>
                        <button
                          type="button"
                          onClick={() => handlePrintOneStudent(r.student_id)}
                          disabled={printingStudentId === r.student_id}
                          className="p-1.5 rounded-lg border border-border hover:border-[#1C7D5A] text-fg-muted hover:text-[#1C7D5A] cursor-pointer"
                          title="মাসিক খাতা প্রিন্ট"
                        >
                          {printingStudentId === r.student_id ? (
                            <Loader2 className="w-3.5 h-3.5 animate-spin" />
                          ) : (
                            <Printer className="w-3.5 h-3.5" />
                          )}
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
};

export default HifzMonthlyReportPage;
