import { useState, useEffect, useMemo } from "react";
import {
  Users,
  Search,
  Printer,
  Eye,
  X,
  Check,
  CreditCard,
  Loader2,
  User,
  FlipHorizontal2,
  Sparkles,
} from "lucide-react";
import { toast } from "react-hot-toast";
import { useAuth } from "../../context/AuthContext";
import { usePortalSettings } from "../../context/PortalSettingsContext";
import printStudioService from "../../services/printStudioService";
import {
  DEFAULT_ID_TEMPLATES,
  ID_CARD_PRESETS,
  getMadrasaBranding,
  toBanglaDigits,
} from "../../components/PrintStudio/printPresets";
import { IdCardRenderer } from "../../components/PrintStudio/IdCardRenderer";
import { printHtmlElement } from "../../components/PrintStudio/printEngine";

const StudentIdCard = () => {
  const { currentMadrasa } = useAuth();
  const { settings } = usePortalSettings();
  const madrasa = useMemo(() => getMadrasaBranding(currentMadrasa, settings), [currentMadrasa, settings]);

  const [students, setStudents] = useState([]);
  const [classes, setClasses] = useState([]);
  const [sections, setSections] = useState([]);
  const [templates, setTemplates] = useState([]);
  const [loading, setLoading] = useState(true);

  const [selectedClass, setSelectedClass] = useState("all");
  const [selectedSection, setSelectedSection] = useState("all");
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedTemplateId, setSelectedTemplateId] = useState("");
  const [presetOverride, setPresetOverride] = useState("");

  const [selectedIds, setSelectedIds] = useState([]);
  const [isPreviewOpen, setIsPreviewOpen] = useState(false);
  const [previewSide, setPreviewSide] = useState("front"); // "front" | "back" | "both"

  useEffect(() => {
    const loadInitial = async () => {
      try {
        const [classRes, secRes, tplRes] = await Promise.all([
          printStudioService.getClasses(),
          printStudioService.getSections(),
          printStudioService.getTemplates({ category: "id_card", target_type: "student" }),
        ]);
        if (classRes?.success) setClasses(classRes.data || []);
        if (secRes?.success) setSections(secRes.data || []);
        const combined = [
          ...(tplRes?.data || []),
          ...DEFAULT_ID_TEMPLATES.filter((t) => t.target_type === "student"),
        ];
        setTemplates(combined);
        const def = combined.find((t) => t.is_default) || combined[0];
        if (def) setSelectedTemplateId(def._id);
      } catch (err) {
        console.error("Failed loading lookups:", err);
      }
    };
    loadInitial();
  }, []);

  const fetchStudents = async () => {
    setLoading(true);
    try {
      const params = {};
      if (selectedClass !== "all") params.class_id = selectedClass;
      if (selectedSection !== "all") params.section_id = selectedSection;
      if (searchTerm.trim()) params.search = searchTerm.trim();

      const res = await printStudioService.getStudentCardsData(params);
      if (res?.success) {
        setStudents(res.data || []);
      }
    } catch (err) {
      console.error("Error loading student cards:", err);
      toast.error("শিক্ষার্থীদের তথ্য লোড করা যায়নি");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchStudents();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [selectedClass, selectedSection]);

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
        (s.student_id || "").toLowerCase().includes(q) ||
        (s.roll_number || "").toLowerCase().includes(q) ||
        (s.fatherName || "").toLowerCase().includes(q) ||
        (s.phone || "").toLowerCase().includes(q)
    );
  }, [students, searchTerm]);

  const activeTemplate = useMemo(() => {
    const base = templates.find((t) => t._id === selectedTemplateId) || DEFAULT_ID_TEMPLATES[0];
    if (!presetOverride) return base;
    const preset = ID_CARD_PRESETS.find((p) => p.key === presetOverride);
    if (!preset) return base;
    return {
      ...base,
      preset_key: preset.key,
      layout: preset.layout,
      primary_color: preset.primaryColor,
      secondary_color: preset.secondaryColor,
      accent_color: preset.accentColor,
      text_color: preset.textColor,
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

  const openSinglePreview = (student, e) => {
    e.stopPropagation();
    setSelectedIds([student._id]);
    setIsPreviewOpen(true);
  };

  const handlePrint = () => {
    try {
      const isHoriz = activeTemplate.layout === "horizontal";
      printHtmlElement({
        elementId: "printable-student-id-sheet",
        title: `Student ID Cards - ${madrasa.name}`,
        orientation: isHoriz && previewSide === "both" ? "landscape" : "portrait",
        marginMm: 6,
      });
    } catch (err) {
      toast.error(err.message || "প্রিন্ট শুরু করা যায়নি");
    }
  };

  const isHorizontal = activeTemplate.layout === "horizontal";
  const cardsPerPage = previewSide === "both" ? (isHorizontal ? 4 : 4) : isHorizontal ? 8 : 9;

  // Chunk into A4 pages
  const pages = useMemo(() => {
    const chunks = [];
    for (let i = 0; i < selectedStudentObjs.length; i += cardsPerPage) {
      chunks.push(selectedStudentObjs.slice(i, i + cardsPerPage));
    }
    return chunks;
  }, [selectedStudentObjs, cardsPerPage]);

  return (
    <div className="p-4 md:p-6 max-w-[1600px] mx-auto space-y-6 animate-fade-in">
      {/* Header */}
      <div className="bg-white rounded-2xl border border-slate-200/80 p-5 md:p-6 shadow-sm flex flex-col lg:flex-row lg:items-center justify-between gap-4">
        <div className="flex items-center gap-4">
          <div className="w-12 h-12 rounded-xl bg-[#1C7D5A]/10 text-[#1C7D5A] flex items-center justify-center shrink-0">
            <Users className="w-6 h-6" />
          </div>
          <div>
            <h1 className="text-xl md:text-2xl font-extrabold text-slate-800">
              ছাত্র আইডি কার্ড তৈরি ও প্রিন্ট (Student ID Cards)
            </h1>
            <p className="text-xs md:text-sm text-slate-500 mt-0.5">
              শ্রেণি ও শাখা নির্বাচন করে একসাথে একাধিক শিক্ষার্থীর ফ্রন্ট ও ব্যাক আইডি কার্ড A4 শীটে প্রিন্ট করুন
            </p>
          </div>
        </div>

        <button
          disabled={selectedIds.length === 0}
          onClick={() => setIsPreviewOpen(true)}
          className="px-5 py-2.5 bg-[#1C7D5A] hover:bg-[#123628] text-white text-sm font-bold rounded-xl shadow-sm transition-all flex items-center justify-center gap-2 disabled:opacity-45 cursor-pointer"
        >
          <Eye className="w-4 h-4" />
          প্রিভিউ ও প্রিন্ট ({toBanglaDigits(selectedIds.length)} জন)
        </button>
      </div>

      {/* Filter & Template Controls */}
      <div className="bg-white rounded-2xl border border-slate-200/80 p-5 shadow-sm grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4">
        <div>
          <label className="text-xs font-bold text-slate-600 block mb-1">শ্রেণি / জামাত</label>
          <select
            value={selectedClass}
            onChange={(e) => {
              setSelectedClass(e.target.value);
              setSelectedSection("all");
            }}
            className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm font-semibold outline-none focus:border-[#1C7D5A]"
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
          <label className="text-xs font-bold text-slate-600 block mb-1">শাখা / সেকশন</label>
          <select
            value={selectedSection}
            onChange={(e) => setSelectedSection(e.target.value)}
            className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm font-semibold outline-none focus:border-[#1C7D5A]"
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
            className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm font-semibold outline-none focus:border-[#1C7D5A]"
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
            <Sparkles className="w-3.5 h-3.5 text-[#EAB33C]" /> নকশা দ্রুত বদলান
          </label>
          <select
            value={presetOverride}
            onChange={(e) => setPresetOverride(e.target.value)}
            className="w-full px-3.5 py-2.5 bg-amber-50/60 border border-amber-200 rounded-xl text-sm font-semibold outline-none focus:border-[#1C7D5A]"
          >
            <option value="">টেমপ্লেটের নিজস্ব নকশা</option>
            {ID_CARD_PRESETS.map((p) => (
              <option key={p.key} value={p.key}>
                {p.name}
              </option>
            ))}
          </select>
        </div>

        <div>
          <label className="text-xs font-bold text-slate-600 block mb-1">শিক্ষার্থী খুঁজুন</label>
          <div className="relative">
            <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              placeholder="নাম, রোল বা আইডি..."
              className="w-full pl-9 pr-3 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm font-semibold outline-none focus:border-[#1C7D5A]"
            />
          </div>
        </div>
      </div>

      {/* Students Table */}
      <div className="bg-white rounded-2xl border border-slate-200/80 shadow-sm overflow-hidden">
        <div className="px-5 py-4 border-b border-slate-200 flex flex-wrap items-center justify-between gap-3 bg-slate-50/60">
          <div className="flex items-center gap-2.5">
            <CreditCard className="w-5 h-5 text-[#1C7D5A]" />
            <h3 className="text-base font-extrabold text-slate-800">
              শিক্ষার্থী তালিকা ({toBanglaDigits(filteredStudents.length)} জন)
            </h3>
          </div>
          <button
            onClick={toggleSelectAll}
            className="px-4 py-2 bg-white border border-slate-200 hover:border-[#1C7D5A] text-slate-700 hover:text-[#1C7D5A] rounded-xl text-xs font-bold transition-colors cursor-pointer"
          >
            {filteredStudents.length > 0 && filteredStudents.every((s) => selectedIds.includes(s._id))
              ? "সব নির্বাচন বাতিল করুন"
              : "ফিল্টারকৃত সবাইকে নির্বাচন করুন"}
          </button>
        </div>

        {loading ? (
          <div className="p-16 flex flex-col items-center justify-center gap-3">
            <Loader2 className="w-8 h-8 animate-spin text-[#1C7D5A]" />
            <p className="text-sm font-bold text-slate-500">শিক্ষার্থীদের তালিকা লোড হচ্ছে...</p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse text-sm">
              <thead>
                <tr className="bg-slate-50 border-b border-slate-200 text-xs font-extrabold text-slate-500 uppercase">
                  <th className="py-3.5 px-4 w-12">সিলেক্ট</th>
                  <th className="py-3.5 px-4">শিক্ষার্থী</th>
                  <th className="py-3.5 px-4">আইডি / দাখেলা</th>
                  <th className="py-3.5 px-4">শ্রেণি ও শাখা</th>
                  <th className="py-3.5 px-4">রোল</th>
                  <th className="py-3.5 px-4">পিতার নাম ও ফোন</th>
                  <th className="py-3.5 px-4">রক্ত</th>
                  <th className="py-3.5 px-4 text-right">একশন</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {filteredStudents.map((student) => {
                  const checked = selectedIds.includes(student._id);
                  return (
                    <tr
                      key={student._id}
                      onClick={() => toggleSelect(student._id)}
                      className={`cursor-pointer transition-colors ${
                        checked ? "bg-emerald-50/60" : "hover:bg-slate-50/70"
                      }`}
                    >
                      <td className="py-3 px-4">
                        <div
                          className={`w-5 h-5 rounded-md border-2 flex items-center justify-center transition-all ${
                            checked ? "bg-[#1C7D5A] border-[#1C7D5A]" : "border-slate-300 bg-white"
                          }`}
                        >
                          {checked && <Check className="w-3.5 h-3.5 text-white" />}
                        </div>
                      </td>
                      <td className="py-3 px-4">
                        <div className="flex items-center gap-3">
                          <div className="w-10 h-10 rounded-xl bg-slate-100 border border-slate-200 overflow-hidden flex items-center justify-center shrink-0">
                            {student.photo ? (
                              <img src={student.photo} alt="" className="w-full h-full object-cover" />
                            ) : (
                              <User className="w-5 h-5 text-slate-300" />
                            )}
                          </div>
                          <div>
                            <p className="font-bold text-slate-800">{student.name}</p>
                            <p className="text-[11px] text-slate-400">{student.residentialType}</p>
                          </div>
                        </div>
                      </td>
                      <td className="py-3 px-4 font-mono text-xs font-bold text-slate-600">{student.student_id}</td>
                      <td className="py-3 px-4">
                        <span className="font-bold text-slate-700">{student.class || "—"}</span>
                        {student.section && <span className="text-xs text-slate-400 block">{student.section}</span>}
                      </td>
                      <td className="py-3 px-4 font-extrabold text-[#123628]">
                        {student.roll_number ? toBanglaDigits(student.roll_number) : "—"}
                      </td>
                      <td className="py-3 px-4 text-xs">
                        <p className="font-semibold text-slate-700">{student.fatherName || "—"}</p>
                        <p className="text-slate-400">{toBanglaDigits(student.phone || "")}</p>
                      </td>
                      <td className="py-3 px-4">
                        {student.bloodGroup ? (
                          <span className="px-2 py-0.5 rounded-full bg-rose-50 text-rose-700 text-xs font-bold border border-rose-200">
                            {student.bloodGroup}
                          </span>
                        ) : (
                          "—"
                        )}
                      </td>
                      <td className="py-3 px-4 text-right">
                        <button
                          onClick={(e) => openSinglePreview(student, e)}
                          className="px-3 py-1.5 bg-slate-100 hover:bg-[#1C7D5A] text-slate-700 hover:text-white rounded-lg text-xs font-bold transition-colors inline-flex items-center gap-1 cursor-pointer"
                        >
                          <Eye className="w-3.5 h-3.5" /> দেখুন
                        </button>
                      </td>
                    </tr>
                  );
                })}
                {filteredStudents.length === 0 && (
                  <tr>
                    <td colSpan={8} className="py-16 text-center text-slate-400 font-bold">
                      কোনো শিক্ষার্থী পাওয়া যায়নি
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* Print Preview Modal */}
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
                    আইডি কার্ড প্রিন্ট প্রিভিউ ({toBanglaDigits(selectedStudentObjs.length)}টি কার্ড • {toBanglaDigits(pages.length)} A4 পাতা)
                  </h2>
                  <p className="text-xs text-slate-500">টেমপ্লেট: {activeTemplate.name}</p>
                </div>
              </div>

              <div className="flex flex-wrap items-center gap-2">
                <div className="flex items-center bg-slate-100 p-1 rounded-xl">
                  {[
                    { id: "front", label: "শুধু সামনে" },
                    { id: "back", label: "শুধু পিছনে" },
                    { id: "both", label: "সামনে + পিছনে" },
                  ].map((s) => (
                    <button
                      key={s.id}
                      onClick={() => setPreviewSide(s.id)}
                      className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all cursor-pointer ${
                        previewSide === s.id ? "bg-[#123628] text-white shadow-xs" : "text-slate-600"
                      }`}
                    >
                      {s.label}
                    </button>
                  ))}
                </div>

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

            <div className="flex-1 overflow-y-auto p-6 bg-slate-200/70 space-y-8">
              <div id="printable-student-id-sheet" className="space-y-8">
                {pages.map((pageCards, pIdx) => (
                  <div
                    key={pIdx}
                    className="bg-white mx-auto p-5 shadow-md rounded-xl print-page-break"
                    style={{ maxWidth: isHorizontal && previewSide === "both" ? "1050px" : "840px" }}
                  >
                    <div
                      className={`grid gap-4 justify-items-center ${
                        previewSide === "both"
                          ? "grid-cols-1 md:grid-cols-2"
                          : isHorizontal
                          ? "grid-cols-1 sm:grid-cols-2"
                          : "grid-cols-1 sm:grid-cols-2 lg:grid-cols-3"
                      }`}
                    >
                      {pageCards.map((stu) => (
                        <div key={stu._id} className="p-1 border border-dashed border-slate-300 rounded-2xl avoid-break">
                          <IdCardRenderer
                            template={activeTemplate}
                            person={stu}
                            madrasa={madrasa}
                            targetType="student"
                            side={previewSide}
                          />
                        </div>
                      ))}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default StudentIdCard;
