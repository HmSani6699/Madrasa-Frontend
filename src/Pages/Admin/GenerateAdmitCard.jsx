import { useState, useEffect, useMemo } from "react";
import {
  GraduationCap,
  Search,
  Printer,
  Eye,
  X,
  Check,
  FileText,
  Tag,
  ClipboardList,
  Loader2,
  User,
  Sparkles,
} from "lucide-react";
import { toast } from "react-hot-toast";
import { useAuth } from "../../context/AuthContext";
import { usePortalSettings } from "../../context/PortalSettingsContext";
import printStudioService from "../../services/printStudioService";
import {
  ADMIT_CARD_PRESETS,
  DEFAULT_ADMIT_TEMPLATES,
  getMadrasaBranding,
  toBanglaDigits,
} from "../../components/PrintStudio/printPresets";
import { AdmitCardRenderer, SeatStickerCard } from "../../components/PrintStudio/AdmitCardRenderer";
import { printHtmlElement } from "../../components/PrintStudio/printEngine";

const GenerateAdmitCard = () => {
  const { currentMadrasa } = useAuth();
  const { settings } = usePortalSettings();
  const madrasa = useMemo(() => getMadrasaBranding(currentMadrasa, settings), [currentMadrasa, settings]);

  const [exams, setExams] = useState([]);
  const [classes, setClasses] = useState([]);
  const [sections, setSections] = useState([]);
  const [templates, setTemplates] = useState([]);
  const [students, setStudents] = useState([]);
  const [schedules, setSchedules] = useState([]);
  const [loading, setLoading] = useState(true);

  const [selectedExamId, setSelectedExamId] = useState("");
  const [selectedClass, setSelectedClass] = useState("all");
  const [selectedSection, setSelectedSection] = useState("all");
  const [selectedTemplateId, setSelectedTemplateId] = useState("");
  const [presetOverride, setPresetOverride] = useState("");
  const [searchTerm, setSearchTerm] = useState("");

  // Hall / Seat Assignment Overrides
  const [defaultRoom, setDefaultRoom] = useState("হল রুম-০১");
  const [seatPrefix, setSeatPrefix] = useState("S-");

  // Print Mode: "admit" | "sticker" | "hall_sheet"
  const [printMode, setPrintMode] = useState("admit");
  const [selectedIds, setSelectedIds] = useState([]);
  const [isPreviewOpen, setIsPreviewOpen] = useState(false);

  useEffect(() => {
    const loadLookups = async () => {
      try {
        const [examRes, classRes, secRes, tplRes] = await Promise.all([
          printStudioService.getExamNames(),
          printStudioService.getClasses(),
          printStudioService.getSections(),
          printStudioService.getTemplates({ category: "admit_card" }),
        ]);
        const examList = examRes?.data || [];
        setExams(examList);
        if (examList[0]?._id) setSelectedExamId(examList[0]._id);

        if (classRes?.success) setClasses(classRes.data || []);
        if (secRes?.success) setSections(secRes.data || []);

        const combined = [...(tplRes?.data || []), ...DEFAULT_ADMIT_TEMPLATES];
        setTemplates(combined);
        const def = combined.find((t) => t.is_default) || combined[0];
        if (def) setSelectedTemplateId(def._id);
      } catch (err) {
        console.error("Admit lookups error:", err);
      }
    };
    loadLookups();
  }, []);

  const fetchAdmitData = async () => {
    setLoading(true);
    try {
      const params = {};
      if (selectedExamId) params.exam_id = selectedExamId;
      if (selectedClass !== "all") params.class_id = selectedClass;
      if (selectedSection !== "all") params.section_id = selectedSection;

      const res = await printStudioService.getAdmitCardData(params);
      if (res?.success) {
        setStudents(res.data?.students || []);
        setSchedules(res.data?.schedules || []);
      }
    } catch (err) {
      console.error("Failed loading admit data:", err);
      toast.error("প্রবেশপত্রের তথ্য লোড করা যায়নি");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchAdmitData();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [selectedExamId, selectedClass, selectedSection]);

  const filteredSections = useMemo(() => {
    if (selectedClass === "all") return sections;
    return sections.filter((s) => String(s.class_id) === String(selectedClass));
  }, [sections, selectedClass]);

  const filteredStudents = useMemo(() => {
    const q = searchTerm.trim().toLowerCase();
    if (!q) return students;
    return students.filter(
      (s) =>
        (s.name || "").toLowerCase().includes(q) ||
        (s.roll_number || "").toLowerCase().includes(q) ||
        (s.student_id || "").toLowerCase().includes(q)
    );
  }, [students, searchTerm]);

  const selectedExam = useMemo(
    () => exams.find((e) => e._id === selectedExamId) || { name: "বার্ষিক পরীক্ষা ২০২৬" },
    [exams, selectedExamId]
  );

  const activeTemplate = useMemo(() => {
    const base = templates.find((t) => t._id === selectedTemplateId) || DEFAULT_ADMIT_TEMPLATES[0];
    if (!presetOverride) return base;
    const preset = ADMIT_CARD_PRESETS.find((p) => p.key === presetOverride);
    if (!preset) return base;
    return {
      ...base,
      preset_key: preset.key,
      primary_color: preset.primaryColor,
      secondary_color: preset.secondaryColor,
      accent_color: preset.accentColor,
      paper_bg: preset.paperBg,
      show_subject_table: preset.density === "compact" ? false : base.show_subject_table,
    };
  }, [templates, selectedTemplateId, presetOverride]);

  const selectedStudentObjs = useMemo(
    () => students.filter((s) => selectedIds.includes(s._id)),
    [students, selectedIds]
  );

  const toggleSelect = (id) => {
    setSelectedIds((prev) => (prev.includes(id) ? prev.filter((x) => x !== id) : [...prev, id]));
  };

  const toggleSelectAll = () => {
    const visibleIds = filteredStudents.map((s) => s._id);
    const allSelected = visibleIds.length > 0 && visibleIds.every((id) => selectedIds.includes(id));
    if (allSelected) {
      setSelectedIds((prev) => prev.filter((id) => !visibleIds.includes(id)));
    } else {
      setSelectedIds((prev) => Array.from(new Set([...prev, ...visibleIds])));
    }
  };

  const handlePrint = () => {
    try {
      printHtmlElement({
        elementId: "printable-admit-batch",
        title: `${printMode === "sticker" ? "Seat Stickers" : printMode === "hall_sheet" ? "Hall Attendance" : "Admit Cards"} - ${selectedExam.name}`,
        orientation: "portrait",
        marginMm: 7,
      });
    } catch (err) {
      toast.error(err.message || "প্রিন্ট করা যায়নি");
    }
  };

  const isCompact = activeTemplate.preset_key === "compact_ticket";
  const perPage = printMode === "sticker" ? 12 : isCompact ? 4 : 2;

  const pages = useMemo(() => {
    const chunks = [];
    for (let i = 0; i < selectedStudentObjs.length; i += perPage) {
      chunks.push(selectedStudentObjs.slice(i, i + perPage));
    }
    return chunks;
  }, [selectedStudentObjs, perPage]);

  return (
    <div className="p-4 md:p-6 max-w-[1600px] mx-auto space-y-6 animate-fade-in">
      {/* Header */}
      <div className="bg-white rounded-2xl border border-slate-200/80 p-5 md:p-6 shadow-sm flex flex-col lg:flex-row lg:items-center justify-between gap-4">
        <div className="flex items-center gap-4">
          <div className="w-12 h-12 rounded-xl bg-[#123628] text-[#EAB33C] flex items-center justify-center shrink-0">
            <GraduationCap className="w-6 h-6" />
          </div>
          <div>
            <h1 className="text-xl md:text-2xl font-extrabold text-slate-800">
              প্রবেশপত্র ও সিট প্ল্যান তৈরি (Generate Admit Cards & Seat Stickers)
            </h1>
            <p className="text-xs md:text-sm text-slate-500 mt-0.5">
              পরীক্ষার সময়সূচিসহ প্রবেশপত্র, ডেস্ক সিট স্টিকার ও হল হাজিরা শিট এক ক্লিকে প্রিন্ট করুন
            </p>
          </div>
        </div>

        <div className="flex flex-wrap items-center gap-2">
          <div className="flex items-center bg-slate-100 p-1 rounded-xl">
            {[
              { id: "admit", label: "প্রবেশপত্র", icon: FileText },
              { id: "sticker", label: "সিট স্টিকার", icon: Tag },
              { id: "hall_sheet", label: "হল হাজিরা", icon: ClipboardList },
            ].map((m) => (
              <button
                key={m.id}
                onClick={() => setPrintMode(m.id)}
                className={`px-3 py-1.5 rounded-lg text-xs font-bold flex items-center gap-1.5 transition-all cursor-pointer ${
                  printMode === m.id ? "bg-[#123628] text-white shadow-xs" : "text-slate-600"
                }`}
              >
                <m.icon className="w-3.5 h-3.5" /> {m.label}
              </button>
            ))}
          </div>

          <button
            disabled={selectedIds.length === 0}
            onClick={() => setIsPreviewOpen(true)}
            className="px-5 py-2.5 bg-[#1C7D5A] hover:bg-[#123628] text-white text-sm font-bold rounded-xl shadow-sm flex items-center gap-2 disabled:opacity-45 cursor-pointer"
          >
            <Eye className="w-4 h-4" />
            প্রিভিউ ও প্রিন্ট ({toBanglaDigits(selectedIds.length)})
          </button>
        </div>
      </div>

      {/* Filters & Parameters */}
      <div className="bg-white rounded-2xl border border-slate-200/80 p-5 shadow-sm grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-6 gap-4">
        <div>
          <label className="text-xs font-bold text-slate-600 block mb-1">পরীক্ষার নাম</label>
          <select
            value={selectedExamId}
            onChange={(e) => setSelectedExamId(e.target.value)}
            className="w-full px-3 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm font-semibold outline-none focus:border-[#1C7D5A]"
          >
            {exams.length === 0 && <option value="">বার্ষিক পরীক্ষা ২০২৬</option>}
            {exams.map((ex) => (
              <option key={ex._id} value={ex._id}>
                {ex.name}
              </option>
            ))}
          </select>
        </div>

        <div>
          <label className="text-xs font-bold text-slate-600 block mb-1">শ্রেণি / জামাত</label>
          <select
            value={selectedClass}
            onChange={(e) => {
              setSelectedClass(e.target.value);
              setSelectedSection("all");
            }}
            className="w-full px-3 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm font-semibold outline-none focus:border-[#1C7D5A]"
          >
            <option value="all">সকল শ্রেণি</option>
            {classes.map((c) => (
              <option key={c._id} value={c._id}>
                {c.name}
              </option>
            ))}
          </select>
        </div>

        <div>
          <label className="text-xs font-bold text-slate-600 block mb-1">শাখা</label>
          <select
            value={selectedSection}
            onChange={(e) => setSelectedSection(e.target.value)}
            className="w-full px-3 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm font-semibold outline-none focus:border-[#1C7D5A]"
          >
            <option value="all">সকল শাখা</option>
            {filteredSections.map((s) => (
              <option key={s._id} value={s._id}>
                {s.name}
              </option>
            ))}
          </select>
        </div>

        <div>
          <label className="text-xs font-bold text-slate-600 block mb-1">সংরক্ষিত টেমপ্লেট</label>
          <select
            value={selectedTemplateId}
            onChange={(e) => {
              setSelectedTemplateId(e.target.value);
              setPresetOverride("");
            }}
            className="w-full px-3 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm font-semibold outline-none focus:border-[#1C7D5A]"
          >
            {templates.map((t) => (
              <option key={t._id} value={t._id}>
                {t.name}
              </option>
            ))}
          </select>
        </div>

        <div>
          <label className="text-xs font-bold text-slate-600 block mb-1 flex items-center gap-1">
            <Sparkles className="w-3.5 h-3.5 text-[#EAB33C]" /> ১২ নকশা সুইচার
          </label>
          <select
            value={presetOverride}
            onChange={(e) => setPresetOverride(e.target.value)}
            className="w-full px-3 py-2.5 bg-amber-50/70 border border-amber-200 rounded-xl text-sm font-semibold outline-none focus:border-[#1C7D5A]"
          >
            <option value="">টেমপ্লেটের নিজস্ব নকশা</option>
            {ADMIT_CARD_PRESETS.map((p) => (
              <option key={p.key} value={p.key}>
                {p.name}
              </option>
            ))}
          </select>
        </div>

        <div>
          <label className="text-xs font-bold text-slate-600 block mb-1">পরীক্ষার্থী খুঁজুন</label>
          <div className="relative">
            <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              placeholder="নাম / রোল / আইডি..."
              className="w-full pl-9 pr-3 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm font-semibold outline-none focus:border-[#1C7D5A]"
            />
          </div>
        </div>
      </div>

      {/* Room & Seat Settings Bar */}
      <div className="bg-emerald-50/60 border border-emerald-200/80 rounded-2xl px-5 py-3 flex flex-wrap items-center justify-between gap-4">
        <div className="flex flex-wrap items-center gap-4 text-xs">
          <div className="flex items-center gap-2">
            <span className="font-bold text-slate-700">ডিফল্ট পরীক্ষার হল:</span>
            <input
              type="text"
              value={defaultRoom}
              onChange={(e) => setDefaultRoom(e.target.value)}
              className="px-3 py-1.5 bg-white border border-slate-200 rounded-lg font-bold text-slate-800 w-36 outline-none"
            />
          </div>
          <div className="flex items-center gap-2">
            <span className="font-bold text-slate-700">সিট নম্বর প্রিফিক্স:</span>
            <input
              type="text"
              value={seatPrefix}
              onChange={(e) => setSeatPrefix(e.target.value)}
              className="px-3 py-1.5 bg-white border border-slate-200 rounded-lg font-bold text-slate-800 w-24 outline-none"
            />
          </div>
        </div>
        <span className="text-xs font-bold text-[#123628]">
          সক্রিয় পরীক্ষার রুটিন পাওয়া গেছে: {toBanglaDigits(schedules.length)}টি বিষয়
        </span>
      </div>

      {/* Candidates Table */}
      <div className="bg-white rounded-2xl border border-slate-200/80 shadow-sm overflow-hidden">
        <div className="px-5 py-4 border-b border-slate-200 flex flex-wrap items-center justify-between gap-3 bg-slate-50/60">
          <h3 className="text-base font-extrabold text-slate-800">
            পরীক্ষার্থীদের তালিকা ({toBanglaDigits(filteredStudents.length)} জন)
          </h3>
          <button
            onClick={toggleSelectAll}
            className="px-4 py-2 bg-white border border-slate-200 hover:border-[#1C7D5A] text-slate-700 hover:text-[#1C7D5A] rounded-xl text-xs font-bold transition-colors cursor-pointer"
          >
            {filteredStudents.length > 0 && filteredStudents.every((s) => selectedIds.includes(s._id))
              ? "সব নির্বাচন বাতিল করুন"
              : "সবাইকে নির্বাচন করুন"}
          </button>
        </div>

        {loading ? (
          <div className="p-16 flex flex-col items-center gap-3">
            <Loader2 className="w-8 h-8 animate-spin text-[#1C7D5A]" />
            <p className="text-sm font-bold text-slate-500">তালিকা লোড হচ্ছে...</p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse text-sm">
              <thead>
                <tr className="bg-slate-50 border-b border-slate-200 text-xs font-extrabold text-slate-500 uppercase">
                  <th className="py-3.5 px-4 w-12">সিলেক্ট</th>
                  <th className="py-3.5 px-4">পরীক্ষার্থী</th>
                  <th className="py-3.5 px-4">আইডি</th>
                  <th className="py-3.5 px-4">শ্রেণি ও শাখা</th>
                  <th className="py-3.5 px-4">রোল নং</th>
                  <th className="py-3.5 px-4">হল ও সিট</th>
                  <th className="py-3.5 px-4 text-right">একশন</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {filteredStudents.map((stu, idx) => {
                  const checked = selectedIds.includes(stu._id);
                  const seatNo = `${seatPrefix}${toBanglaDigits(stu.roll_number || idx + 1)}`;
                  return (
                    <tr
                      key={stu._id}
                      onClick={() => toggleSelect(stu._id)}
                      className={`cursor-pointer transition-colors ${checked ? "bg-emerald-50/60" : "hover:bg-slate-50"}`}
                    >
                      <td className="py-3 px-4">
                        <div
                          className={`w-5 h-5 rounded-md border-2 flex items-center justify-center ${
                            checked ? "bg-[#1C7D5A] border-[#1C7D5A]" : "border-slate-300 bg-white"
                          }`}
                        >
                          {checked && <Check className="w-3.5 h-3.5 text-white" />}
                        </div>
                      </td>
                      <td className="py-3 px-4">
                        <div className="flex items-center gap-3">
                          <div className="w-9 h-9 rounded-lg bg-slate-100 overflow-hidden flex items-center justify-center shrink-0">
                            {stu.photo ? (
                              <img src={stu.photo} alt="" className="w-full h-full object-cover" />
                            ) : (
                              <User className="w-4 h-4 text-slate-300" />
                            )}
                          </div>
                          <div>
                            <p className="font-bold text-slate-800">{stu.name}</p>
                            <p className="text-[11px] text-slate-400">পিতা: {stu.fatherName || "—"}</p>
                          </div>
                        </div>
                      </td>
                      <td className="py-3 px-4 font-mono text-xs font-bold text-slate-600">{stu.student_id}</td>
                      <td className="py-3 px-4">
                        <span className="font-bold text-slate-700">{stu.class || "—"}</span>
                        {stu.section && <span className="text-xs text-slate-400 block">{stu.section}</span>}
                      </td>
                      <td className="py-3 px-4 font-extrabold text-[#123628]">
                        {stu.roll_number ? toBanglaDigits(stu.roll_number) : "—"}
                      </td>
                      <td className="py-3 px-4 text-xs font-bold text-slate-600">
                        {defaultRoom} • <span className="text-[#1C7D5A]">{seatNo}</span>
                      </td>
                      <td className="py-3 px-4 text-right">
                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            setSelectedIds([stu._id]);
                            setIsPreviewOpen(true);
                          }}
                          className="px-3 py-1.5 bg-slate-100 hover:bg-[#1C7D5A] text-slate-700 hover:text-white rounded-lg text-xs font-bold cursor-pointer"
                        >
                          দেখুন
                        </button>
                      </td>
                    </tr>
                  );
                })}
                {filteredStudents.length === 0 && (
                  <tr>
                    <td colSpan={7} className="py-16 text-center text-slate-400 font-bold">
                      কোনো পরীক্ষার্থী পাওয়া যায়নি
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* Preview Modal */}
      {isPreviewOpen && (
        <div className="fixed inset-0 bg-slate-900/80 backdrop-blur-sm z-[120] flex items-center justify-center p-3 md:p-6">
          <div className="bg-white rounded-2xl w-full max-w-6xl max-h-[94vh] flex flex-col overflow-hidden shadow-2xl">
            <div className="px-6 py-4 border-b border-slate-200 flex flex-wrap items-center justify-between gap-4 bg-white shrink-0">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-[#123628] text-[#EAB33C] flex items-center justify-center">
                  <Printer className="w-5 h-5" />
                </div>
                <div>
                  <h2 className="text-lg font-extrabold text-slate-800">
                    {printMode === "sticker"
                      ? "পরীক্ষার সিট স্টিকার প্রিন্ট প্রিভিউ"
                      : printMode === "hall_sheet"
                      ? "পরীক্ষার হল হাজিরা শীট"
                      : "প্রবেশপত্র ব্যাচ প্রিন্ট প্রিভিউ"}
                  </h2>
                  <p className="text-xs text-slate-500">
                    পরীক্ষা: {selectedExam.name} • মোট {toBanglaDigits(selectedStudentObjs.length)} জন
                  </p>
                </div>
              </div>

              <div className="flex items-center gap-2">
                <button
                  onClick={handlePrint}
                  className="px-5 py-2 bg-[#1C7D5A] hover:bg-[#123628] text-white rounded-xl text-xs font-bold shadow-sm flex items-center gap-2 cursor-pointer"
                >
                  <Printer className="w-4 h-4" /> প্রিন্ট / PDF সেভ করুন
                </button>
                <button
                  onClick={() => setIsPreviewOpen(false)}
                  className="p-2 text-slate-400 hover:text-slate-700 hover:bg-slate-100 rounded-xl cursor-pointer"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>
            </div>

            <div className="flex-1 overflow-y-auto p-6 bg-slate-200/70 space-y-6">
              <div id="printable-admit-batch" className="space-y-6">
                {printMode === "hall_sheet" ? (
                  <div className="bg-white max-w-[820px] mx-auto p-8 rounded-xl shadow-md space-y-5">
                    <div className="text-center border-b-2 border-[#123628] pb-3">
                      <h2 className="text-xl font-black text-[#123628]">{madrasa.name}</h2>
                      <p className="text-xs text-slate-600">{madrasa.address}</p>
                      <div className="mt-2 inline-block px-4 py-1 rounded-full bg-[#123628] text-white text-xs font-bold">
                        হল হাজিরা শীট — {selectedExam.name} ({defaultRoom})
                      </div>
                    </div>

                    <table className="w-full border-collapse text-xs">
                      <thead>
                        <tr className="bg-slate-100 text-slate-700">
                          <th className="border border-slate-300 p-2 text-center w-12">ক্রম</th>
                          <th className="border border-slate-300 p-2 text-left">রোল ও সিট</th>
                          <th className="border border-slate-300 p-2 text-left">পরীক্ষার্থীর নাম</th>
                          <th className="border border-slate-300 p-2 text-left">শ্রেণি</th>
                          <th className="border border-slate-300 p-2 text-center w-36">পরীক্ষার্থীর স্বাক্ষর</th>
                          <th className="border border-slate-300 p-2 text-center w-28">পরিদর্শকের স্বাক্ষর</th>
                        </tr>
                      </thead>
                      <tbody>
                        {selectedStudentObjs.map((stu, i) => (
                          <tr key={stu._id}>
                            <td className="border border-slate-300 p-2 text-center font-bold">{toBanglaDigits(i + 1)}</td>
                            <td className="border border-slate-300 p-2 font-bold">
                              রোল: {toBanglaDigits(stu.roll_number || i + 1)} ({seatPrefix}
                              {toBanglaDigits(stu.roll_number || i + 1)})
                            </td>
                            <td className="border border-slate-300 p-2 font-bold text-slate-800">{stu.name}</td>
                            <td className="border border-slate-300 p-2">{stu.class || "—"}</td>
                            <td className="border border-slate-300 p-2" />
                            <td className="border border-slate-300 p-2" />
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                ) : (
                  pages.map((chunk, pIdx) => (
                    <div
                      key={pIdx}
                      className="bg-white max-w-[850px] mx-auto p-5 rounded-xl shadow-md print-page-break"
                    >
                      <div
                        className={`grid gap-4 ${
                          printMode === "sticker"
                            ? "grid-cols-1 sm:grid-cols-2 md:grid-cols-3"
                            : isCompact
                            ? "grid-cols-1 md:grid-cols-2"
                            : "grid-cols-1"
                        }`}
                      >
                        {chunk.map((stu, idx) => {
                          const seatInfo = {
                            roomNo: defaultRoom,
                            seatNo: `${seatPrefix}${toBanglaDigits(stu.roll_number || idx + 1)}`,
                          };
                          return printMode === "sticker" ? (
                            <SeatStickerCard
                              key={stu._id}
                              student={stu}
                              exam={selectedExam}
                              madrasa={madrasa}
                              seatInfo={seatInfo}
                              primaryColor={activeTemplate.primary_color}
                              accentColor={activeTemplate.accent_color}
                            />
                          ) : (
                            <AdmitCardRenderer
                              key={stu._id}
                              template={activeTemplate}
                              student={stu}
                              exam={selectedExam}
                              schedules={schedules}
                              madrasa={madrasa}
                              seatInfo={seatInfo}
                            />
                          );
                        })}
                      </div>
                    </div>
                  ))
                )}
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default GenerateAdmitCard;
