import { useState, useEffect, useMemo } from "react";
import {
  UserCheck,
  Search,
  Printer,
  Eye,
  X,
  Check,
  History,
  Trash2,
  Loader2,
  User,
  Sparkles,
  CheckCircle2,
  Award,
} from "lucide-react";
import { toast } from "react-hot-toast";
import { useAuth } from "../../context/AuthContext";
import { usePortalSettings } from "../../context/PortalSettingsContext";
import printStudioService from "../../services/printStudioService";
import {
  CERTIFICATE_PRESETS,
  DEFAULT_CERTIFICATE_TEMPLATES,
  EMPLOYEE_CERTIFICATE_TYPES,
  getMadrasaBranding,
  formatDateDisplay,
  toBanglaDigits,
} from "../../components/PrintStudio/printPresets";
import { CertificateRenderer } from "../../components/PrintStudio/CertificateRenderer";
import { printHtmlElement } from "../../components/PrintStudio/printEngine";

const GenerateEmployeeCertificate = () => {
  const { currentMadrasa } = useAuth();
  const { settings } = usePortalSettings();
  const madrasa = useMemo(() => getMadrasaBranding(currentMadrasa, settings), [currentMadrasa, settings]);

  const [activeTab, setActiveTab] = useState("issue");
  const [employees, setEmployees] = useState([]);
  const [templates, setTemplates] = useState([]);
  const [issuedList, setIssuedList] = useState([]);
  const [loading, setLoading] = useState(true);
  const [issuing, setIssuing] = useState(false);

  const [selectedDept, setSelectedDept] = useState("all");
  const [selectedDesig, setSelectedDesig] = useState("all");
  const [searchTerm, setSearchTerm] = useState("");

  const [certType, setCertType] = useState(EMPLOYEE_CERTIFICATE_TYPES[0].value);
  const [selectedTemplateId, setSelectedTemplateId] = useState("");
  const [presetOverride, setPresetOverride] = useState("");
  const [issueDate, setIssueDate] = useState(new Date().toISOString().split("T")[0]);
  const [remarks, setRemarks] = useState("");
  const [customBody, setCustomBody] = useState(EMPLOYEE_CERTIFICATE_TYPES[0].defaultBody);

  const [selectedIds, setSelectedIds] = useState([]);
  const [isPreviewOpen, setIsPreviewOpen] = useState(false);
  const [previewDocs, setPreviewDocs] = useState([]);

  const loadHistory = async () => {
    try {
      const res = await printStudioService.getCertificates({ target_type: "employee" });
      if (res?.success) setIssuedList(res.data || []);
    } catch (err) {
      console.error("Failed loading staff cert history:", err);
    }
  };

  useEffect(() => {
    const loadInitial = async () => {
      setLoading(true);
      try {
        const [staffRes, tplRes] = await Promise.all([
          printStudioService.getStaffCardsData(),
          printStudioService.getTemplates({ category: "certificate", target_type: "employee" }),
        ]);
        if (staffRes?.success) setEmployees(staffRes.data || []);
        const combined = [
          ...(tplRes?.data || []),
          ...DEFAULT_CERTIFICATE_TEMPLATES.filter((t) => t.target_type === "employee"),
        ];
        setTemplates(combined);
        const def = combined.find((t) => t.is_default) || combined[0];
        if (def) setSelectedTemplateId(def._id);
        loadHistory();
      } catch (err) {
        toast.error("শিক্ষক ও কর্মী তালিকা লোড করা যায়নি");
      } finally {
        setLoading(false);
      }
    };
    loadInitial();
  }, []);

  const departments = useMemo(
    () => Array.from(new Set(employees.map((e) => e.department).filter(Boolean))),
    [employees]
  );
  const designations = useMemo(
    () => Array.from(new Set(employees.map((e) => e.designation).filter(Boolean))),
    [employees]
  );

  const filteredEmployees = useMemo(() => {
    const q = searchTerm.trim().toLowerCase();
    return employees.filter((e) => {
      const matchDept = selectedDept === "all" || e.department === selectedDept;
      const matchDesig = selectedDesig === "all" || e.designation === selectedDesig;
      const matchSearch =
        !q ||
        (e.name || "").toLowerCase().includes(q) ||
        (e.employeeID || "").toLowerCase().includes(q) ||
        (e.designation || "").toLowerCase().includes(q);
      return matchDept && matchDesig && matchSearch;
    });
  }, [employees, selectedDept, selectedDesig, searchTerm]);

  const handleCertTypeSelect = (val) => {
    setCertType(val);
    const meta = EMPLOYEE_CERTIFICATE_TYPES.find((t) => t.value === val);
    if (meta) {
      setCustomBody(meta.defaultBody);
      setPresetOverride(meta.presetKey);
    }
  };

  const activeTemplate = useMemo(() => {
    const base =
      templates.find((t) => t._id === selectedTemplateId) ||
      DEFAULT_CERTIFICATE_TEMPLATES.find((t) => t.target_type === "employee") ||
      DEFAULT_CERTIFICATE_TEMPLATES[0];
    const typeMeta = EMPLOYEE_CERTIFICATE_TYPES.find((t) => t.value === certType);
    const presetKey = presetOverride || base.preset_key || "official_letterhead";
    const preset = CERTIFICATE_PRESETS.find((p) => p.key === presetKey);

    return {
      ...base,
      certificate_type: certType,
      title: certType.split(" (")[0],
      arabic_title: typeMeta?.arabicTitle || base.arabic_title,
      preset_key: presetKey,
      layout: preset?.orientation || base.layout || "portrait",
      primary_color: preset?.primaryColor || base.primary_color,
      secondary_color: preset?.secondaryColor || base.secondary_color,
      accent_color: preset?.accentColor || base.accent_color,
      paper_bg: preset?.paperBg || base.paper_bg,
      body_template: customBody || base.body_template,
    };
  }, [templates, selectedTemplateId, presetOverride, certType, customBody]);

  const toggleSelect = (id) => {
    setSelectedIds((prev) => (prev.includes(id) ? prev.filter((x) => x !== id) : [...prev, id]));
  };

  const toggleSelectAll = () => {
    const visibleIds = filteredEmployees.map((e) => e._id);
    const allSelected = visibleIds.length > 0 && visibleIds.every((id) => selectedIds.includes(id));
    if (allSelected) {
      setSelectedIds((prev) => prev.filter((id) => !visibleIds.includes(id)));
    } else {
      setSelectedIds((prev) => Array.from(new Set([...prev, ...visibleIds])));
    }
  };

  const openBatchPreview = (targets = null) => {
    const list = targets || employees.filter((e) => selectedIds.includes(e._id));
    if (!list.length) return;
    setPreviewDocs(
      list.map((emp, i) => ({
        recipient: emp,
        certificateNo: `PREVIEW-EMP-${new Date().getFullYear()}-${String(i + 1).padStart(3, "0")}`,
        issueDate,
        customData: { remarks },
        bodyText: customBody,
        isSaved: false,
      }))
    );
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
        target_type: "employee",
        target_ids: targetIds,
        type: certType,
        template_id: selectedTemplateId,
        preset_key: activeTemplate.preset_key,
        issue_date: issueDate,
        custom_data: { remarks },
        body_text: customBody,
        remarks,
      });

      if (res?.success) {
        const savedDocs = (res.data || []).map((cert) => ({
          recipient: {
            ...cert.content_snapshot,
            _id: cert.employee_id,
          },
          certificateNo: cert.certificate_no,
          issueDate: cert.issue_date,
          customData: cert.custom_data,
          bodyText: cert.body_text || customBody,
          isSaved: true,
        }));
        setPreviewDocs(savedDocs);
        toast.success(res.message || "কর্মী সনদপত্র ইস্যু ও সংরক্ষণ সম্পন্ন হয়েছে");
        loadHistory();
        setTimeout(() => handlePrintOnly(), 300);
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
        elementId: "printable-staff-certificates",
        title: `${certType} - ${madrasa.name}`,
        orientation,
        marginMm: 6,
      });
    } catch (err) {
      toast.error(err.message || "প্রিন্ট করা যায়নি");
    }
  };

  const openSavedCertificate = (cert) => {
    const typeMeta = EMPLOYEE_CERTIFICATE_TYPES.find((t) => t.value === cert.type);
    if (cert.type) setCertType(cert.type);
    if (cert.preset_key) setPresetOverride(cert.preset_key);
    setPreviewDocs([
      {
        recipient: cert.content_snapshot || {},
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
            <UserCheck className="w-6 h-6" />
          </div>
          <div>
            <h1 className="text-xl md:text-2xl font-extrabold text-slate-800">
              শিক্ষক ও কর্মী সনদপত্র (Employee Certificates)
            </h1>
            <p className="text-xs md:text-sm text-slate-500 mt-0.5">
              অভিজ্ঞতা সনদ, কর্মসংস্থান প্রত্যয়ন, সম্মাননা সনদ ও অব্যাহতি পত্র তৈরি ও প্রিন্ট করুন
            </p>
          </div>
        </div>

        <div className="flex flex-wrap items-center gap-2">
          <div className="flex bg-slate-100 p-1 rounded-xl">
            <button
              onClick={() => setActiveTab("issue")}
              className={`px-4 py-2 rounded-lg text-xs font-bold flex items-center gap-1.5 cursor-pointer ${
                activeTab === "issue" ? "bg-[#123628] text-white" : "text-slate-600"
              }`}
            >
              <UserCheck className="w-3.5 h-3.5" /> নতুন সনদ তৈরি
            </button>
            <button
              onClick={() => setActiveTab("history")}
              className={`px-4 py-2 rounded-lg text-xs font-bold flex items-center gap-1.5 cursor-pointer ${
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
          {/* Config */}
          <div className="bg-white rounded-2xl border border-slate-200/80 p-5 shadow-sm space-y-4">
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4">
              <div>
                <label className="text-xs font-bold text-slate-600 block mb-1">সনদের ধরন</label>
                <select
                  value={certType}
                  onChange={(e) => handleCertTypeSelect(e.target.value)}
                  className="w-full px-3 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm font-semibold outline-none focus:border-[#1C7D5A]"
                >
                  {EMPLOYEE_CERTIFICATE_TYPES.map((t) => (
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
                <label className="text-xs font-bold text-slate-600 block mb-1">বিভাগ</label>
                <select
                  value={selectedDept}
                  onChange={(e) => setSelectedDept(e.target.value)}
                  className="w-full px-3 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm font-semibold outline-none focus:border-[#1C7D5A]"
                >
                  <option value="all">সকল বিভাগ</option>
                  {departments.map((d) => (
                    <option key={d} value={d}>
                      {d}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="text-xs font-bold text-slate-600 block mb-1">পদবী</label>
                <select
                  value={selectedDesig}
                  onChange={(e) => setSelectedDesig(e.target.value)}
                  className="w-full px-3 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm font-semibold outline-none focus:border-[#1C7D5A]"
                >
                  <option value="all">সকল পদবী</option>
                  {designations.map((d) => (
                    <option key={d} value={d}>
                      {d}
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
                  সনদপত্রের বিবরণ (প্রয়োজনে সরাসরি পরিবর্তন করুন)
                </label>
                <textarea
                  rows={3}
                  value={customBody}
                  onChange={(e) => setCustomBody(e.target.value)}
                  className="w-full px-3.5 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs leading-relaxed font-medium outline-none focus:border-[#1C7D5A]"
                />
              </div>
              <div className="lg:col-span-4">
                <label className="text-xs font-bold text-slate-600 block mb-1">বিশেষ মন্তব্য (Remarks)</label>
                <textarea
                  rows={3}
                  value={remarks}
                  onChange={(e) => setRemarks(e.target.value)}
                  placeholder="অতিরিক্ত তথ্য বা মন্তব্য লিখুন..."
                  className="w-full px-3.5 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs font-medium outline-none focus:border-[#1C7D5A]"
                />
              </div>
            </div>
          </div>

          {/* Staff Table */}
          <div className="bg-white rounded-2xl border border-slate-200/80 shadow-sm overflow-hidden">
            <div className="px-5 py-4 border-b border-slate-200 flex flex-wrap items-center justify-between gap-3 bg-slate-50/60">
              <div className="relative flex-1 max-w-sm">
                <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
                <input
                  type="text"
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  placeholder="নাম বা এমপ্লয়ি আইডি খুঁজুন..."
                  className="w-full pl-9 pr-3 py-2 bg-white border border-slate-200 rounded-xl text-xs font-semibold outline-none focus:border-[#1C7D5A]"
                />
              </div>
              <button
                onClick={toggleSelectAll}
                className="px-4 py-2 bg-white border border-slate-200 hover:border-[#1C7D5A] text-slate-700 hover:text-[#1C7D5A] rounded-xl text-xs font-bold cursor-pointer"
              >
                {filteredEmployees.length > 0 && filteredEmployees.every((e) => selectedIds.includes(e._id))
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
                      <th className="py-3.5 px-4">শিক্ষক / কর্মী</th>
                      <th className="py-3.5 px-4">এমপ্লয়ি আইডি</th>
                      <th className="py-3.5 px-4">পদবী ও বিভাগ</th>
                      <th className="py-3.5 px-4">যোগদানের তারিখ</th>
                      <th className="py-3.5 px-4 text-right">একশন</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100">
                    {filteredEmployees.map((emp) => {
                      const checked = selectedIds.includes(emp._id);
                      return (
                        <tr
                          key={emp._id}
                          onClick={() => toggleSelect(emp._id)}
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
                                {emp.photo ? (
                                  <img src={emp.photo} alt="" className="w-full h-full object-cover" />
                                ) : (
                                  <User className="w-4 h-4 text-slate-300" />
                                )}
                              </div>
                              <div>
                                <p className="font-bold text-slate-800">{emp.name}</p>
                                <p className="text-[11px] text-slate-400">{toBanglaDigits(emp.phone || "")}</p>
                              </div>
                            </div>
                          </td>
                          <td className="py-3 px-4 font-mono text-xs font-bold text-slate-700">{emp.employeeID}</td>
                          <td className="py-3 px-4">
                            <span className="font-bold text-[#1C7D5A]">{emp.designation}</span>
                            <span className="text-xs text-slate-400 block">{emp.department}</span>
                          </td>
                          <td className="py-3 px-4 text-xs font-semibold text-slate-600">
                            {formatDateDisplay(emp.joinDate, true)}
                          </td>
                          <td className="py-3 px-4 text-right">
                            <button
                              onClick={(e) => {
                                e.stopPropagation();
                                openBatchPreview([emp]);
                              }}
                              className="px-3 py-1.5 bg-slate-100 hover:bg-[#1C7D5A] text-slate-700 hover:text-white rounded-lg text-xs font-bold cursor-pointer inline-flex items-center gap-1"
                            >
                              <Eye className="w-3.5 h-3.5" /> প্রিভিউ
                            </button>
                          </td>
                        </tr>
                      );
                    })}
                    {filteredEmployees.length === 0 && (
                      <tr>
                        <td colSpan={6} className="py-16 text-center text-slate-400 font-bold">
                          কোনো শিক্ষক বা কর্মী পাওয়া যায়নি
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
        <div className="bg-white rounded-2xl border border-slate-200/80 shadow-sm overflow-hidden">
          <div className="px-5 py-4 border-b border-slate-200 bg-slate-50/60">
            <h3 className="text-base font-extrabold text-slate-800">
              ইস্যুকৃত কর্মী সনদপত্র রেজিস্টার ({toBanglaDigits(issuedList.length)}টি)
            </h3>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse text-sm">
              <thead>
                <tr className="bg-slate-50 border-b border-slate-200 text-xs font-extrabold text-slate-500 uppercase">
                  <th className="py-3.5 px-4">সনদ নং</th>
                  <th className="py-3.5 px-4">নাম</th>
                  <th className="py-3.5 px-4">পদবী ও বিভাগ</th>
                  <th className="py-3.5 px-4">সনদের ধরন</th>
                  <th className="py-3.5 px-4">তারিখ</th>
                  <th className="py-3.5 px-4 text-right">একশন</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {issuedList.map((cert) => (
                  <tr key={cert._id} className="hover:bg-slate-50">
                    <td className="py-3 px-4 font-mono text-xs font-bold text-[#123628]">{cert.certificate_no}</td>
                    <td className="py-3 px-4 font-bold text-slate-800">{cert.content_snapshot?.name || "—"}</td>
                    <td className="py-3 px-4 text-xs text-slate-600">
                      {cert.content_snapshot?.designation || "—"} • {cert.content_snapshot?.department || "—"}
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
                      এখনো কোনো কর্মী সনদ ইস্যু করা হয়নি
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* Preview Modal */}
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
                    কর্মী সনদপত্র প্রিন্ট প্রিভিউ ({toBanglaDigits(previewDocs.length)}টি)
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
              <div id="printable-staff-certificates" className="space-y-8">
                {previewDocs.map((doc, idx) => (
                  <div key={idx} className="print-page-break">
                    <CertificateRenderer
                      template={activeTemplate}
                      recipient={doc.recipient}
                      targetType="employee"
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

export default GenerateEmployeeCertificate;
