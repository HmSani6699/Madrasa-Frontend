import { useState, useEffect, useMemo } from "react";
import {
  Award,
  Search,
  Printer,
  Eye,
  X,
  Check,
  Users,
  History,
  Trash2,
  Loader2,
  User,
  Sparkles,
  CheckCircle2,
} from "lucide-react";
import { toast } from "react-hot-toast";
import { useAuth } from "../../context/AuthContext";
import { usePortalSettings } from "../../context/PortalSettingsContext";
import printStudioService from "../../services/printStudioService";
import {
  CERTIFICATE_PRESETS,
  DEFAULT_CERTIFICATE_TEMPLATES,
  STUDENT_CERTIFICATE_TYPES,
  getMadrasaBranding,
  formatDateDisplay,
  toBanglaDigits,
} from "../../components/PrintStudio/printPresets";
import { CertificateRenderer } from "../../components/PrintStudio/CertificateRenderer";
import { printHtmlElement } from "../../components/PrintStudio/printEngine";

const GenerateStudentCertificate = () => {
  const { currentMadrasa } = useAuth();
  const { settings } = usePortalSettings();
  const madrasa = useMemo(() => getMadrasaBranding(currentMadrasa, settings), [currentMadrasa, settings]);

  const [activeTab, setActiveTab] = useState("issue"); // "issue" | "history"
  const [students, setStudents] = useState([]);
  const [classes, setClasses] = useState([]);
  const [sections, setSections] = useState([]);
  const [templates, setTemplates] = useState([]);
  const [issuedList, setIssuedList] = useState([]);
  const [loading, setLoading] = useState(true);
  const [issuing, setIssuing] = useState(false);

  const [selectedClass, setSelectedClass] = useState("all");
  const [selectedSection, setSelectedSection] = useState("all");
  const [searchTerm, setSearchTerm] = useState("");

  const [certType, setCertType] = useState(STUDENT_CERTIFICATE_TYPES[0].value);
  const [selectedTemplateId, setSelectedTemplateId] = useState("");
  const [presetOverride, setPresetOverride] = useState("");
  const [issueDate, setIssueDate] = useState(new Date().toISOString().split("T")[0]);
  const [achievementNote, setAchievementNote] = useState("প্রথম স্থান / বিশেষ কৃতিত্ব");
  const [remarks, setRemarks] = useState("");
  const [customBody, setCustomBody] = useState(STUDENT_CERTIFICATE_TYPES[0].defaultBody);

  const [selectedIds, setSelectedIds] = useState([]);
  const [isPreviewOpen, setIsPreviewOpen] = useState(false);
  const [previewDocs, setPreviewDocs] = useState([]); // Array of { recipient, certificateNo, issueDate, customData, bodyText, templateOverride }

  const loadHistory = async () => {
    try {
      const res = await printStudioService.getCertificates({ target_type: "student" });
      if (res?.success) setIssuedList(res.data || []);
    } catch (err) {
      console.error("Failed loading certificate history:", err);
    }
  };

  useEffect(() => {
    const loadInitial = async () => {
      try {
        const [classRes, secRes, tplRes] = await Promise.all([
          printStudioService.getClasses(),
          printStudioService.getSections(),
          printStudioService.getTemplates({ category: "certificate", target_type: "student" }),
        ]);
        if (classRes?.success) setClasses(classRes.data || []);
        if (secRes?.success) setSections(secRes.data || []);

        const combined = [
          ...(tplRes?.data || []),
          ...DEFAULT_CERTIFICATE_TEMPLATES.filter((t) => t.target_type === "student"),
        ];
        setTemplates(combined);
        const def = combined.find((t) => t.is_default) || combined[0];
        if (def) setSelectedTemplateId(def._id);
        loadHistory();
      } catch (err) {
        console.error("Initial load error:", err);
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
      const res = await printStudioService.getStudentCardsData(params);
      if (res?.success) setStudents(res.data || []);
    } catch (err) {
      toast.error("শিক্ষার্থীদের তথ্য লোড করা যায়নি");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchStudents();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [selectedClass, selectedSection]);

  const handleCertTypeSelect = (val) => {
    setCertType(val);
    const meta = STUDENT_CERTIFICATE_TYPES.find((t) => t.value === val);
    if (meta) {
      setCustomBody(meta.defaultBody);
      setPresetOverride(meta.presetKey);
    }
  };

  const activeTemplate = useMemo(() => {
    const base = templates.find((t) => t._id === selectedTemplateId) || DEFAULT_CERTIFICATE_TEMPLATES[0];
    const typeMeta = STUDENT_CERTIFICATE_TYPES.find((t) => t.value === certType);
    const presetKey = presetOverride || base.preset_key || "royal_gold";
    const preset = CERTIFICATE_PRESETS.find((p) => p.key === presetKey);

    return {
      ...base,
      certificate_type: certType,
      title: certType.split(" (")[0],
      arabic_title: typeMeta?.arabicTitle || base.arabic_title,
      preset_key: presetKey,
      layout: preset?.orientation || base.layout || "landscape",
      primary_color: preset?.primaryColor || base.primary_color,
      secondary_color: preset?.secondaryColor || base.secondary_color,
      accent_color: preset?.accentColor || base.accent_color,
      paper_bg: preset?.paperBg || base.paper_bg,
      body_template: customBody || base.body_template,
    };
  }, [templates, selectedTemplateId, presetOverride, certType, customBody]);

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

  const openBatchPreview = (targetStudents = null) => {
    const list = targetStudents || students.filter((s) => selectedIds.includes(s._id));
    if (!list.length) return;
    const docs = list.map((stu, i) => ({
      recipient: stu,
      certificateNo: `PREVIEW-${new Date().getFullYear()}-${String(i + 1).padStart(3, "0")}`,
      issueDate,
      customData: { achievement: achievementNote, remarks },
      bodyText: customBody,
      isSaved: false,
    }));
    setPreviewDocs(docs);
    setIsPreviewOpen(true);
  };

  const handleIssueAndPrint = async () => {
    const targetIds = previewDocs.map((d) => d.recipient._id).filter(Boolean);
    if (!targetIds.length) {
      handlePrintOnly();
      return;
    }

    setIssuing(true);
    try {
      const res = await printStudioService.bulkIssueCertificates({
        target_type: "student",
        target_ids: targetIds,
        type: certType,
        template_id: selectedTemplateId,
        preset_key: activeTemplate.preset_key,
        issue_date: issueDate,
        custom_data: { achievement: achievementNote, remarks },
        body_text: customBody,
        remarks,
      });

      if (res?.success) {
        const savedDocs = (res.data || []).map((cert) => ({
          recipient: {
            ...cert.content_snapshot,
            _id: cert.student_id,
          },
          certificateNo: cert.certificate_no,
          issueDate: cert.issue_date,
          customData: cert.custom_data,
          bodyText: cert.body_text || customBody,
          isSaved: true,
        }));
        setPreviewDocs(savedDocs);
        toast.success(res.message || "সনদপত্র ইস্যু ও সংরক্ষণ সম্পন্ন হয়েছে");
        loadHistory();
        setTimeout(() => {
          handlePrintOnly();
        }, 300);
      }
    } catch (err) {
      toast.error(err.response?.data?.message || "সনদ ইস্যু করতে সমস্যা হয়েছে");
    } finally {
      setIssuing(false);
    }
  };

  const handlePrintOnly = () => {
    try {
      const orientation = activeTemplate.layout === "portrait" ? "portrait" : "landscape";
      printHtmlElement({
        elementId: "printable-student-certificates",
        title: `${certType} - ${madrasa.name}`,
        orientation,
        marginMm: 6,
      });
    } catch (err) {
      toast.error(err.message || "প্রিন্ট শুরু করা যায়নি");
    }
  };

  const openSavedCertificate = (cert) => {
    const typeMeta = STUDENT_CERTIFICATE_TYPES.find((t) => t.value === cert.type);
    if (cert.type) setCertType(cert.type);
    if (cert.preset_key) setPresetOverride(cert.preset_key);
    setPreviewDocs([
      {
        recipient: {
          ...cert.content_snapshot,
          fatherName: cert.content_snapshot?.father_name,
          motherName: cert.content_snapshot?.mother_name,
          admissionNo: cert.content_snapshot?.admission_no,
        },
        certificateNo: cert.certificate_no,
        issueDate: cert.issue_date,
        customData: cert.custom_data || {},
        bodyText: cert.body_text || typeMeta?.defaultBody || customBody,
        isSaved: true,
      },
    ]);
    setIsPreviewOpen(true);
  };

  const handleDeleteHistory = async (id) => {
    try {
      await printStudioService.deleteCertificate(id);
      toast.success("সনদ রেকর্ড বাতিল করা হয়েছে");
      loadHistory();
    } catch {
      toast.error("বাতিল করা যায়নি");
    }
  };

  return (
    <div className="p-4 md:p-6 max-w-[1600px] mx-auto space-y-6 animate-fade-in">
      {/* Header */}
      <div className="bg-white rounded-2xl border border-slate-200/80 p-5 md:p-6 shadow-sm flex flex-col lg:flex-row lg:items-center justify-between gap-4">
        <div className="flex items-center gap-4">
          <div className="w-12 h-12 rounded-xl bg-[#123628] text-[#EAB33C] flex items-center justify-center shrink-0">
            <Award className="w-6 h-6" />
          </div>
          <div>
            <h1 className="text-xl md:text-2xl font-extrabold text-slate-800">
              ছাত্র সনদপত্র ও প্রত্যয়ন তৈরি (Student Certificates)
            </h1>
            <p className="text-xs md:text-sm text-slate-500 mt-0.5">
              প্রত্যয়ন পত্র, চারিত্রিক সনদ, ছাড়পত্র (টিসি), মেধা সনদ ও হিফজ সমাপনী সনদ ইস্যু, সংরক্ষণ এবং প্রিন্ট করুন
            </p>
          </div>
        </div>

        <div className="flex flex-wrap items-center gap-2">
          <div className="flex bg-slate-100 p-1 rounded-xl">
            <button
              onClick={() => setActiveTab("issue")}
              className={`px-4 py-2 rounded-lg text-xs font-bold flex items-center gap-1.5 transition-all cursor-pointer ${
                activeTab === "issue" ? "bg-[#123628] text-white" : "text-slate-600"
              }`}
            >
              <Users className="w-3.5 h-3.5" /> নতুন সনদ তৈরি
            </button>
            <button
              onClick={() => setActiveTab("history")}
              className={`px-4 py-2 rounded-lg text-xs font-bold flex items-center gap-1.5 transition-all cursor-pointer ${
                activeTab === "history" ? "bg-[#123628] text-white" : "text-slate-600"
              }`}
            >
              <History className="w-3.5 h-3.5" /> ইস্যু রেজিস্টার ({toBanglaDigits(issuedList.length)})
            </button>
          </div>

          {activeTab === "issue" && (
            <button
              disabled={selectedIds.length === 0}
              onClick={() => openBatchPreview(null)}
              className="px-5 py-2.5 bg-[#1C7D5A] hover:bg-[#123628] text-white text-sm font-bold rounded-xl shadow-sm flex items-center gap-2 disabled:opacity-45 cursor-pointer"
            >
              <Eye className="w-4 h-4" />
              প্রিভিউ ও ইস্যু ({toBanglaDigits(selectedIds.length)})
            </button>
          )}
        </div>
      </div>

      {activeTab === "issue" ? (
        <>
          {/* Configuration Panel */}
          <div className="bg-white rounded-2xl border border-slate-200/80 p-5 shadow-sm space-y-4">
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4">
              <div>
                <label className="text-xs font-bold text-slate-600 block mb-1">সনদের ধরন</label>
                <select
                  value={certType}
                  onChange={(e) => handleCertTypeSelect(e.target.value)}
                  className="w-full px-3 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm font-semibold outline-none focus:border-[#1C7D5A]"
                >
                  {STUDENT_CERTIFICATE_TYPES.map((t) => (
                    <option key={t.value} value={t.value}>
                      {t.label}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="text-xs font-bold text-slate-600 block mb-1 flex items-center gap-1">
                  <Sparkles className="w-3.5 h-3.5 text-[#EAB33C]" /> ডিজাইন ফ্রেম
                </label>
                <select
                  value={presetOverride}
                  onChange={(e) => setPresetOverride(e.target.value)}
                  className="w-full px-3 py-2.5 bg-amber-50/70 border border-amber-200 rounded-xl text-sm font-semibold outline-none focus:border-[#1C7D5A]"
                >
                  <option value="">ডিফল্ট ফ্রেম</option>
                  {CERTIFICATE_PRESETS.map((p) => (
                    <option key={p.key} value={p.key}>
                      {p.name}
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
                <label className="text-xs font-bold text-slate-600 block mb-1">প্রদানের তারিখ</label>
                <input
                  type="date"
                  value={issueDate}
                  onChange={(e) => setIssueDate(e.target.value)}
                  className="w-full px-3 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm font-semibold outline-none focus:border-[#1C7D5A]"
                />
              </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-12 gap-4 pt-2 border-t border-slate-100">
              <div className="lg:col-span-8">
                <label className="text-xs font-bold text-slate-600 block mb-1">
                  সনদপত্রের মূল বডি টেক্সট (প্রয়োজনে সরাসরি সম্পাদনা করুন)
                </label>
                <textarea
                  rows={3}
                  value={customBody}
                  onChange={(e) => setCustomBody(e.target.value)}
                  className="w-full px-3.5 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs leading-relaxed font-medium outline-none focus:border-[#1C7D5A]"
                />
              </div>
              <div className="lg:col-span-4 space-y-2">
                <div>
                  <label className="text-xs font-bold text-slate-600 block mb-1">কৃতিত্ব / অবস্থান (ঐচ্ছিক)</label>
                  <input
                    type="text"
                    value={achievementNote}
                    onChange={(e) => setAchievementNote(e.target.value)}
                    placeholder="যেমন: প্রথম স্থান / জিপিএ-৫"
                    className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs font-semibold outline-none"
                  />
                </div>
                <div>
                  <label className="text-xs font-bold text-slate-600 block mb-1">বিশেষ মন্তব্য (Remarks)</label>
                  <input
                    type="text"
                    value={remarks}
                    onChange={(e) => setRemarks(e.target.value)}
                    placeholder="প্রয়োজনে অতিরিক্ত নোট লিখুন..."
                    className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs font-semibold outline-none"
                  />
                </div>
              </div>
            </div>
          </div>

          {/* Students Selection Table */}
          <div className="bg-white rounded-2xl border border-slate-200/80 shadow-sm overflow-hidden">
            <div className="px-5 py-4 border-b border-slate-200 flex flex-wrap items-center justify-between gap-3 bg-slate-50/60">
              <div className="relative flex-1 max-w-sm">
                <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
                <input
                  type="text"
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  placeholder="নাম, রোল বা আইডি দিয়ে খুঁজুন..."
                  className="w-full pl-9 pr-3 py-2 bg-white border border-slate-200 rounded-xl text-xs font-semibold outline-none focus:border-[#1C7D5A]"
                />
              </div>
              <button
                onClick={toggleSelectAll}
                className="px-4 py-2 bg-white border border-slate-200 hover:border-[#1C7D5A] text-slate-700 hover:text-[#1C7D5A] rounded-xl text-xs font-bold cursor-pointer"
              >
                {filteredStudents.length > 0 && filteredStudents.every((s) => selectedIds.includes(s._id))
                  ? "সব নির্বাচন বাতিল"
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
                      <th className="py-3.5 px-4">শিক্ষার্থী</th>
                      <th className="py-3.5 px-4">পিতার নাম</th>
                      <th className="py-3.5 px-4">শ্রেণি ও শাখা</th>
                      <th className="py-3.5 px-4">রোল</th>
                      <th className="py-3.5 px-4 text-right">একশন</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100">
                    {filteredStudents.map((stu) => {
                      const checked = selectedIds.includes(stu._id);
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
                                <p className="text-[11px] font-mono text-slate-400">{stu.student_id}</p>
                              </div>
                            </div>
                          </td>
                          <td className="py-3 px-4 text-xs font-semibold text-slate-600">{stu.fatherName || "—"}</td>
                          <td className="py-3 px-4 text-xs font-bold text-slate-700">
                            {stu.class || "—"} {stu.section ? `(${stu.section})` : ""}
                          </td>
                          <td className="py-3 px-4 font-extrabold text-[#123628]">
                            {stu.roll_number ? toBanglaDigits(stu.roll_number) : "—"}
                          </td>
                          <td className="py-3 px-4 text-right">
                            <button
                              onClick={(e) => {
                                e.stopPropagation();
                                openBatchPreview([stu]);
                              }}
                              className="px-3 py-1.5 bg-slate-100 hover:bg-[#1C7D5A] text-slate-700 hover:text-white rounded-lg text-xs font-bold cursor-pointer inline-flex items-center gap-1"
                            >
                              <Eye className="w-3.5 h-3.5" /> প্রিভিউ
                            </button>
                          </td>
                        </tr>
                      );
                    })}
                    {filteredStudents.length === 0 && (
                      <tr>
                        <td colSpan={6} className="py-16 text-center text-slate-400 font-bold">
                          কোনো শিক্ষার্থী পাওয়া যায়নি
                        </td>
                      </tr>
                    )}
                  </tbody>
                </table>
              </div>
            )}
          </div>
        </>
      ) : (
        /* Issued Certificate Ledger Tab */
        <div className="bg-white rounded-2xl border border-slate-200/80 shadow-sm overflow-hidden">
          <div className="px-5 py-4 border-b border-slate-200 bg-slate-50/60 flex items-center justify-between">
            <h3 className="text-base font-extrabold text-slate-800">
              ইস্যুকৃত ছাত্র সনদপত্র রেজিস্টার ({toBanglaDigits(issuedList.length)}টি)
            </h3>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse text-sm">
              <thead>
                <tr className="bg-slate-50 border-b border-slate-200 text-xs font-extrabold text-slate-500 uppercase">
                  <th className="py-3.5 px-4">সনদ নং</th>
                  <th className="py-3.5 px-4">শিক্ষার্থীর নাম</th>
                  <th className="py-3.5 px-4">শ্রেণি ও রোল</th>
                  <th className="py-3.5 px-4">সনদের ধরন</th>
                  <th className="py-3.5 px-4">প্রদানের তারিখ</th>
                  <th className="py-3.5 px-4 text-right">একশন</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {issuedList.map((cert) => (
                  <tr key={cert._id} className="hover:bg-slate-50">
                    <td className="py-3 px-4 font-mono text-xs font-bold text-[#123628]">{cert.certificate_no}</td>
                    <td className="py-3 px-4 font-bold text-slate-800">{cert.content_snapshot?.name || "—"}</td>
                    <td className="py-3 px-4 text-xs text-slate-600">
                      {cert.content_snapshot?.class || "—"} • রোল: {toBanglaDigits(cert.content_snapshot?.roll_number || "—")}
                    </td>
                    <td className="py-3 px-4">
                      <span className="px-2.5 py-1 rounded-full bg-emerald-50 text-[#123628] text-xs font-bold border border-emerald-200">
                        {cert.type}
                      </span>
                    </td>
                    <td className="py-3 px-4 text-xs font-semibold text-slate-600">
                      {formatDateDisplay(cert.issue_date, true)}
                    </td>
                    <td className="py-3 px-4 text-right flex items-center justify-end gap-2">
                      <button
                        onClick={() => openSavedCertificate(cert)}
                        className="px-3 py-1.5 bg-[#1C7D5A] text-white rounded-lg text-xs font-bold inline-flex items-center gap-1 cursor-pointer"
                      >
                        <Printer className="w-3.5 h-3.5" /> পুনঃপ্রিন্ট
                      </button>
                      <button
                        onClick={() => handleDeleteHistory(cert._id)}
                        className="p-1.5 text-rose-500 hover:bg-rose-50 rounded-lg cursor-pointer"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </td>
                  </tr>
                ))}
                {issuedList.length === 0 && (
                  <tr>
                    <td colSpan={6} className="py-16 text-center text-slate-400 font-bold">
                      এখনো কোনো সনদপত্র ইস্যু করা হয়নি
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* Certificate Preview & Print Modal */}
      {isPreviewOpen && (
        <div className="fixed inset-0 bg-slate-900/80 backdrop-blur-sm z-[120] flex items-center justify-center p-3 md:p-6">
          <div className="bg-white rounded-2xl w-full max-w-6xl max-h-[94vh] flex flex-col overflow-hidden shadow-2xl">
            <div className="px-6 py-4 border-b border-slate-200 flex flex-wrap items-center justify-between gap-4 bg-white shrink-0">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-[#123628] text-[#EAB33C] flex items-center justify-center">
                  <Award className="w-5 h-5" />
                </div>
                <div>
                  <h2 className="text-lg font-extrabold text-slate-800">
                    সনদপত্র প্রিন্ট প্রিভিউ ({toBanglaDigits(previewDocs.length)}টি)
                  </h2>
                  <p className="text-xs text-slate-500">{certType}</p>
                </div>
              </div>

              <div className="flex flex-wrap items-center gap-2">
                {!previewDocs.every((d) => d.isSaved) && (
                  <button
                    onClick={handleIssueAndPrint}
                    disabled={issuing}
                    className="px-5 py-2 bg-[#1C7D5A] hover:bg-[#123628] text-white rounded-xl text-xs font-bold shadow-sm flex items-center gap-2 disabled:opacity-50 cursor-pointer"
                  >
                    {issuing ? <Loader2 className="w-4 h-4 animate-spin" /> : <CheckCircle2 className="w-4 h-4" />}
                    সংরক্ষণ ও প্রিন্ট করুন
                  </button>
                )}
                <button
                  onClick={handlePrintOnly}
                  className="px-4 py-2 bg-slate-900 hover:bg-black text-white rounded-xl text-xs font-bold flex items-center gap-2 cursor-pointer"
                >
                  <Printer className="w-4 h-4" /> প্রিন্ট / PDF
                </button>
                <button
                  onClick={() => setIsPreviewOpen(false)}
                  className="p-2 text-slate-400 hover:text-slate-700 hover:bg-slate-100 rounded-xl cursor-pointer"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>
            </div>

            <div className="flex-1 overflow-y-auto p-6 bg-slate-200/75 space-y-8">
              <div id="printable-student-certificates" className="space-y-8">
                {previewDocs.map((doc, idx) => (
                  <div key={idx} className="print-page-break">
                    <CertificateRenderer
                      template={activeTemplate}
                      recipient={doc.recipient}
                      targetType="student"
                      madrasa={madrasa}
                      certificateNo={doc.certificateNo}
                      issueDate={doc.issueDate}
                      customData={doc.customData}
                      customBodyText={doc.bodyText}
                    />
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

export default GenerateStudentCertificate;
