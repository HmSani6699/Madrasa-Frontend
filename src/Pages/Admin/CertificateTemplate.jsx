import { useState, useEffect, useMemo } from "react";
import {
  Plus,
  Award,
  Search,
  Edit3,
  Trash2,
  Eye,
  X,
  Copy,
  Star,
  Sparkles,
  Loader2,
  ShieldCheck,
} from "lucide-react";
import { toast } from "react-hot-toast";
import { useAuth } from "../../context/AuthContext";
import { usePortalSettings } from "../../context/PortalSettingsContext";
import printStudioService from "../../services/printStudioService";
import {
  CERTIFICATE_PRESETS,
  DEFAULT_CERTIFICATE_TEMPLATES,
  STUDENT_CERTIFICATE_TYPES,
  EMPLOYEE_CERTIFICATE_TYPES,
  getMadrasaBranding,
} from "../../components/PrintStudio/printPresets";
import { CertificateRenderer } from "../../components/PrintStudio/CertificateRenderer";

const SAMPLE_STUDENT = {
  name: "মুহাম্মদ আব্দুল্লাহ আল-মামুন",
  fatherName: "মাওলানা আব্দুর রহমান",
  motherName: "মোসাম্মৎ খাদিজা বেগম",
  class: "হিফজ / অষ্টম শ্রেণি",
  section: "শাখা-ক",
  roll_number: "01",
  admissionNo: "MS-2026-104",
  academicYear: "2026",
  dob: "2012-03-18",
  address: "মিরপুর-১০, ঢাকা-১২১৬",
};

const SAMPLE_EMPLOYEE = {
  name: "মাওলানা আবু বকর সিদ্দিক",
  employeeID: "EMP-2026-07",
  designation: "সিনিয়র মুহাদ্দিস",
  department: "কিতাব বিভাগ",
  joinDate: "2021-01-10",
  address: "যাত্রাবাড়ী, ঢাকা",
};

const PLACEHOLDER_TOKENS = [
  { token: "{{name}}", label: "নাম" },
  { token: "{{father_name}}", label: "পিতা" },
  { token: "{{mother_name}}", label: "মাতা" },
  { token: "{{class}}", label: "শ্রেণি" },
  { token: "{{section}}", label: "শাখা" },
  { token: "{{roll}}", label: "রোল" },
  { token: "{{admission_no}}", label: "আইডি" },
  { token: "{{session}}", label: "শিক্ষাবর্ষ" },
  { token: "{{dob}}", label: "জন্ম তারিখ" },
  { token: "{{address}}", label: "ঠিকানা" },
  { token: "{{designation}}", label: "পদবী" },
  { token: "{{department}}", label: "বিভাগ" },
  { token: "{{join_date}}", label: "যোগদান" },
  { token: "{{custom_note}}", label: "বিশেষ কৃতিত্ব" },
];

const INITIAL_FORM = {
  category: "certificate",
  target_type: "student",
  name: "",
  title: "প্রত্যয়ন পত্র / প্রশংসাপত্র",
  arabic_title: "شهادة دراسية وتصديق",
  subtitle: "OFFICIAL INSTITUTIONAL CERTIFICATE",
  certificate_type: STUDENT_CERTIFICATE_TYPES[0].value,
  preset_key: "royal_gold",
  layout: "landscape",
  primary_color: "#123628",
  secondary_color: "#1C7D5A",
  accent_color: "#C99327",
  paper_bg: "#fffdf8",
  show_photo: false,
  show_qr: true,
  show_watermark: true,
  show_bismillah: true,
  body_template: STUDENT_CERTIFICATE_TYPES[0].defaultBody,
  left_sign_label: "শ্রেণি শিক্ষক / নাজিম",
  middle_sign_label: "নাজিমে তালিমাত",
  right_sign_label: "মুহতামিম / অধ্যক্ষ",
  is_default: false,
  status: "active",
};

const CertificateTemplate = () => {
  const { currentMadrasa } = useAuth();
  const { settings } = usePortalSettings();
  const madrasa = useMemo(() => getMadrasaBranding(currentMadrasa, settings), [currentMadrasa, settings]);

  const [savedTemplates, setSavedTemplates] = useState([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [filterTarget, setFilterTarget] = useState("all");

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingId, setEditingId] = useState(null);
  const [formData, setFormData] = useState(INITIAL_FORM);
  const [deleteTarget, setDeleteTarget] = useState(null);

  const fetchTemplates = async () => {
    setLoading(true);
    try {
      const res = await printStudioService.getTemplates({ category: "certificate" });
      if (res?.success) setSavedTemplates(res.data || []);
    } catch (err) {
      console.error("Failed loading certificate templates:", err);
      toast.error("সনদ টেমপ্লেট লোড করা যায়নি");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchTemplates();
  }, []);

  const allTemplates = useMemo(() => {
    const merged = [...savedTemplates, ...DEFAULT_CERTIFICATE_TEMPLATES];
    return merged.filter((t) => {
      const matchTarget = filterTarget === "all" || t.target_type === filterTarget || t.target_type === "all";
      const q = searchQuery.trim().toLowerCase();
      const matchSearch =
        !q ||
        (t.name || "").toLowerCase().includes(q) ||
        (t.title || "").toLowerCase().includes(q) ||
        (t.certificate_type || "").toLowerCase().includes(q);
      return matchTarget && matchSearch;
    });
  }, [savedTemplates, filterTarget, searchQuery]);

  const applyPreset = (preset) => {
    setFormData((prev) => ({
      ...prev,
      preset_key: preset.key,
      layout: preset.orientation,
      primary_color: preset.primaryColor,
      secondary_color: preset.secondaryColor,
      accent_color: preset.accentColor,
      paper_bg: preset.paperBg,
    }));
  };

  const handleTargetTypeChange = (targetType) => {
    const types = targetType === "employee" ? EMPLOYEE_CERTIFICATE_TYPES : STUDENT_CERTIFICATE_TYPES;
    const first = types[0];
    setFormData((prev) => ({
      ...prev,
      target_type: targetType,
      certificate_type: first.value,
      arabic_title: first.arabicTitle,
      body_template: first.defaultBody,
      title: first.value.split(" (")[0],
    }));
  };

  const handleCertTypeChange = (val) => {
    const allTypes = [...STUDENT_CERTIFICATE_TYPES, ...EMPLOYEE_CERTIFICATE_TYPES];
    const found = allTypes.find((x) => x.value === val);
    if (!found) {
      setFormData((prev) => ({ ...prev, certificate_type: val }));
      return;
    }
    const preset = CERTIFICATE_PRESETS.find((p) => p.key === found.presetKey);
    setFormData((prev) => ({
      ...prev,
      certificate_type: found.value,
      title: found.value.split(" (")[0],
      arabic_title: found.arabicTitle,
      body_template: found.defaultBody,
      preset_key: found.presetKey,
      layout: found.orientation,
      ...(preset
        ? {
            primary_color: preset.primaryColor,
            secondary_color: preset.secondaryColor,
            accent_color: preset.accentColor,
            paper_bg: preset.paperBg,
          }
        : {}),
    }));
  };

  const openModal = (base = null) => {
    if (base) {
      setEditingId(base.isPreset ? null : base._id);
      setFormData({
        ...INITIAL_FORM,
        ...base,
        name: base.isPreset ? `${base.name} (কপি)` : base.name,
      });
    } else {
      setEditingId(null);
      setFormData(INITIAL_FORM);
    }
    setIsModalOpen(true);
  };

  const insertToken = (token) => {
    setFormData((prev) => ({
      ...prev,
      body_template: `${prev.body_template || ""}${prev.body_template ? " " : ""}${token}`,
    }));
  };

  const handleSave = async (e) => {
    e?.preventDefault();
    if (!formData.name.trim()) {
      toast.error("টেমপ্লেটের নাম লিখুন");
      return;
    }
    setSaving(true);
    try {
      const payload = {
        category: "certificate",
        target_type: formData.target_type,
        name: formData.name.trim(),
        title: formData.title,
        arabic_title: formData.arabic_title,
        subtitle: formData.subtitle,
        certificate_type: formData.certificate_type,
        preset_key: formData.preset_key,
        layout: formData.layout,
        primary_color: formData.primary_color,
        secondary_color: formData.secondary_color,
        accent_color: formData.accent_color,
        paper_bg: formData.paper_bg,
        show_photo: formData.show_photo,
        show_qr: formData.show_qr,
        show_watermark: formData.show_watermark,
        show_bismillah: formData.show_bismillah,
        body_template: formData.body_template,
        left_sign_label: formData.left_sign_label,
        middle_sign_label: formData.middle_sign_label,
        right_sign_label: formData.right_sign_label,
        is_default: formData.is_default,
        status: "active",
      };

      if (editingId) {
        await printStudioService.updateTemplate(editingId, payload);
        toast.success("সনদপত্র টেমপ্লেট আপডেট হয়েছে");
      } else {
        await printStudioService.createTemplate(payload);
        toast.success("নতুন সনদপত্র টেমপ্লেট সংরক্ষণ করা হয়েছে");
      }
      setIsModalOpen(false);
      fetchTemplates();
    } catch (err) {
      toast.error(err.response?.data?.message || "টেমপ্লেট সংরক্ষণ ব্যর্থ হয়েছে");
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async () => {
    if (!deleteTarget || deleteTarget.isPreset) return;
    try {
      await printStudioService.deleteTemplate(deleteTarget._id);
      toast.success("টেমপ্লেট মুছে ফেলা হয়েছে");
      setDeleteTarget(null);
      fetchTemplates();
    } catch {
      toast.error("মুছতে সমস্যা হয়েছে");
    }
  };

  const currentTypeOptions =
    formData.target_type === "employee" ? EMPLOYEE_CERTIFICATE_TYPES : STUDENT_CERTIFICATE_TYPES;

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
              সনদপত্র ও প্রত্যয়ন টেমপ্লেট স্টুডিও (Certificate Templates)
            </h1>
            <p className="text-xs md:text-sm text-slate-500 mt-0.5">
              প্রত্যয়ন পত্র, চারিত্রিক সনদ, ছাড়পত্র (টিসি), হিফজ সমাপনী ও শিক্ষক অভিজ্ঞতা সনদের রাজকীয় নকশা তৈরি করুন
            </p>
          </div>
        </div>

        <button
          onClick={() => openModal(null)}
          className="px-5 py-2.5 bg-[#1C7D5A] hover:bg-[#123628] text-white text-sm font-bold rounded-xl shadow-sm flex items-center justify-center gap-2 cursor-pointer"
        >
          <Plus className="w-4 h-4" />
          নতুন সনদ টেমপ্লেট তৈরি করুন
        </button>
      </div>

      {/* 6 Ornamental Presets Showcase */}
      <div className="bg-gradient-to-r from-[#123628] to-[#1C7D5A] rounded-2xl p-5 text-white shadow-md">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-2 mb-4">
          <div className="flex items-center gap-2">
            <Sparkles className="w-5 h-5 text-[#EAB33C]" />
            <h2 className="text-base font-extrabold">৬টি লাক্সারি সনদপত্র ও লেটারহেড প্রিসেট</h2>
          </div>
          <span className="text-xs text-white/80">যেকোনো নকশা বেছে নিয়ে ডায়নামিক বাংলা বিবরণসহ কাস্টমাইজ করুন</span>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-6 gap-2.5">
          {CERTIFICATE_PRESETS.map((p) => (
            <button
              key={p.key}
              onClick={() =>
                openModal({
                  ...INITIAL_FORM,
                  name: `সনদ — ${p.name}`,
                  preset_key: p.key,
                  layout: p.orientation,
                  primary_color: p.primaryColor,
                  secondary_color: p.secondaryColor,
                  accent_color: p.accentColor,
                  paper_bg: p.paperBg,
                  isPreset: true,
                })
              }
              className="bg-white/10 hover:bg-white/20 border border-white/15 rounded-xl p-3 text-left transition-all cursor-pointer"
            >
              <div className="flex items-center gap-1.5 mb-1.5">
                <span className="w-3 h-3 rounded-full border border-white/50" style={{ backgroundColor: p.primaryColor }} />
                <span className="w-3 h-3 rounded-full border border-white/50" style={{ backgroundColor: p.accentColor }} />
                <span className="text-[9px] font-bold ml-auto text-[#EAB33C]">{p.badge}</span>
              </div>
              <p className="text-xs font-bold leading-snug line-clamp-1">{p.name}</p>
              <p className="text-[10px] text-white/75 line-clamp-2 mt-0.5">{p.description}</p>
            </button>
          ))}
        </div>
      </div>

      {/* Filters */}
      <div className="bg-white rounded-2xl border border-slate-200/80 p-4 shadow-sm flex flex-col md:flex-row items-stretch md:items-center justify-between gap-4">
        <div className="relative flex-1 max-w-md">
          <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="টেমপ্লেট খুঁজুন..."
            className="w-full pl-10 pr-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm font-medium outline-none focus:border-[#1C7D5A]"
          />
        </div>

        <div className="flex items-center gap-2">
          {[
            { id: "all", label: "সবগুলো" },
            { id: "student", label: "শিক্ষার্থী সনদ" },
            { id: "employee", label: "শিক্ষক ও কর্মী সনদ" },
          ].map((tab) => (
            <button
              key={tab.id}
              onClick={() => setFilterTarget(tab.id)}
              className={`px-4 py-2 rounded-xl text-xs font-bold transition-all cursor-pointer ${
                filterTarget === tab.id ? "bg-[#123628] text-white" : "bg-slate-100 text-slate-600 hover:bg-slate-200"
              }`}
            >
              {tab.label}
            </button>
          ))}
        </div>
      </div>

      {/* Templates Grid */}
      {loading ? (
        <div className="bg-white rounded-2xl border border-slate-200 p-16 flex flex-col items-center gap-3">
          <Loader2 className="w-8 h-8 animate-spin text-[#1C7D5A]" />
          <p className="text-sm font-bold text-slate-500">সনদ টেমপ্লেট লোড হচ্ছে...</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {allTemplates.map((template) => (
            <div
              key={template._id}
              className="bg-white rounded-2xl border border-slate-200/90 shadow-sm hover:shadow-lg transition-all overflow-hidden flex flex-col"
            >
              <div className="bg-slate-100/90 p-4 border-b border-slate-200 relative overflow-hidden">
                <div className="flex items-center justify-between mb-3">
                  <div className="flex items-center gap-2">
                    <span
                      className={`px-2.5 py-0.5 rounded-full text-[10px] font-bold ${
                        template.isPreset ? "bg-slate-800 text-white" : "bg-emerald-600 text-white"
                      }`}
                    >
                      {template.isPreset ? "সিস্টেম প্রিসেট" : "সংরক্ষিত"}
                    </span>
                    {template.is_default && (
                      <span className="px-2.5 py-0.5 rounded-full bg-[#EAB33C] text-[#123628] text-[10px] font-extrabold flex items-center gap-1">
                        <Star className="w-3 h-3 fill-current" /> ডিফল্ট
                      </span>
                    )}
                  </div>
                  <div className="flex gap-1.5">
                    <button
                      onClick={() => openModal(template)}
                      className="p-2 bg-white hover:bg-emerald-50 text-slate-600 hover:text-[#1C7D5A] rounded-lg border border-slate-200 cursor-pointer"
                    >
                      {template.isPreset ? <Copy className="w-4 h-4" /> : <Edit3 className="w-4 h-4" />}
                    </button>
                    {!template.isPreset && (
                      <button
                        onClick={() => setDeleteTarget(template)}
                        className="p-2 bg-white hover:bg-rose-50 text-slate-600 hover:text-rose-600 rounded-lg border border-slate-200 cursor-pointer"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    )}
                  </div>
                </div>

                <div className="h-[260px] overflow-hidden rounded-xl pointer-events-none flex items-start justify-center bg-slate-200/50 p-2">
                  <div className="w-[820px] scale-[0.52] origin-top shrink-0">
                    <CertificateRenderer
                      template={template}
                      recipient={template.target_type === "employee" ? SAMPLE_EMPLOYEE : SAMPLE_STUDENT}
                      targetType={template.target_type === "employee" ? "employee" : "student"}
                      madrasa={madrasa}
                    />
                  </div>
                </div>
              </div>

              <div className="p-4 flex items-center justify-between gap-3">
                <div className="min-w-0">
                  <span className="text-[11px] font-bold text-[#1C7D5A]">
                    {template.target_type === "employee" ? "শিক্ষক ও কর্মী" : "শিক্ষার্থী"} •{" "}
                    {template.layout === "portrait" ? "পোর্ট্রেট লেটারহেড" : "ল্যান্ডস্কেপ সনদ"}
                  </span>
                  <h3 className="text-base font-extrabold text-slate-800 truncate">{template.name}</h3>
                </div>
                <button
                  onClick={() => openModal(template)}
                  className="px-4 py-2 bg-slate-100 hover:bg-[#1C7D5A] text-slate-700 hover:text-white rounded-xl text-xs font-bold transition-colors flex items-center gap-1.5 cursor-pointer shrink-0"
                >
                  <Eye className="w-3.5 h-3.5" />
                  {template.isPreset ? "কাস্টমাইজ করুন" : "সম্পাদনা"}
                </button>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Split-Pane Certificate Designer Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 bg-slate-900/75 backdrop-blur-sm z-[120] flex items-center justify-center p-3 md:p-6">
          <div className="bg-white rounded-2xl w-full max-w-6xl max-h-[94vh] flex flex-col overflow-hidden shadow-2xl">
            <div className="px-6 py-4 border-b border-slate-200 flex items-center justify-between bg-slate-50 shrink-0">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-[#123628] text-[#EAB33C] flex items-center justify-center">
                  <Award className="w-5 h-5" />
                </div>
                <div>
                  <h2 className="text-lg font-extrabold text-slate-800">
                    {editingId ? "সনদ টেমপ্লেট সম্পাদনা" : "সনদপত্র ও প্রত্যয়ন ডিজাইন স্টুডিও"}
                  </h2>
                  <p className="text-xs text-slate-500">ডায়নামিক প্লেসহোল্ডারসহ বাংলা ও আরবি সনদ ডিজাইন করুন</p>
                </div>
              </div>
              <button
                onClick={() => setIsModalOpen(false)}
                className="p-2 text-slate-400 hover:text-slate-700 hover:bg-slate-200 rounded-xl cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleSave} className="flex-1 overflow-y-auto grid grid-cols-1 lg:grid-cols-12">
              <div className="lg:col-span-5 p-6 space-y-5 border-b lg:border-b-0 lg:border-r border-slate-200 overflow-y-auto">
                <div>
                  <label className="text-xs font-bold text-slate-700 block mb-2">১. ফ্রেম ও ডিজাইন প্রিসেট</label>
                  <div className="grid grid-cols-2 gap-2">
                    {CERTIFICATE_PRESETS.map((p) => (
                      <button
                        type="button"
                        key={p.key}
                        onClick={() => applyPreset(p)}
                        className={`p-2 rounded-xl border text-left transition-all cursor-pointer ${
                          formData.preset_key === p.key
                            ? "border-[#1C7D5A] bg-emerald-50 ring-1 ring-[#1C7D5A]"
                            : "border-slate-200 hover:border-slate-300"
                        }`}
                      >
                        <div className="flex items-center gap-1 mb-0.5">
                          <span className="w-2.5 h-2.5 rounded-full" style={{ backgroundColor: p.primaryColor }} />
                          <span className="w-2.5 h-2.5 rounded-full" style={{ backgroundColor: p.accentColor }} />
                          <span className="text-[9px] font-bold ml-auto text-slate-400">
                            {p.orientation === "portrait" ? "পোর্ট্রেট" : "ল্যান্ডস্কেপ"}
                          </span>
                        </div>
                        <p className="text-[11px] font-bold text-slate-800 line-clamp-1">{p.name}</p>
                      </button>
                    ))}
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <div className="col-span-2">
                    <label className="text-xs font-bold text-slate-700 block mb-1">টেমপ্লেটের নাম *</label>
                    <input
                      type="text"
                      required
                      value={formData.name}
                      onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                      className="w-full px-3.5 py-2 bg-slate-50 border border-slate-200 rounded-xl text-sm font-semibold outline-none focus:border-[#1C7D5A]"
                    />
                  </div>
                  <div>
                    <label className="text-xs font-bold text-slate-700 block mb-1">প্রাপক শ্রেণি</label>
                    <select
                      value={formData.target_type}
                      onChange={(e) => handleTargetTypeChange(e.target.value)}
                      className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs font-semibold outline-none"
                    >
                      <option value="student">শিক্ষার্থী</option>
                      <option value="employee">শিক্ষক ও কর্মী</option>
                    </select>
                  </div>
                  <div>
                    <label className="text-xs font-bold text-slate-700 block mb-1">সনদের ধরন</label>
                    <select
                      value={formData.certificate_type}
                      onChange={(e) => handleCertTypeChange(e.target.value)}
                      className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs font-semibold outline-none"
                    >
                      {currentTypeOptions.map((t) => (
                        <option key={t.value} value={t.value}>
                          {t.value}
                        </option>
                      ))}
                    </select>
                  </div>
                  <div>
                    <label className="text-xs font-bold text-slate-700 block mb-1">সনদ শিরোনাম</label>
                    <input
                      type="text"
                      value={formData.title}
                      onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                      className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs font-semibold outline-none"
                    />
                  </div>
                  <div>
                    <label className="text-xs font-bold text-slate-700 block mb-1">আরবি শিরোনাম</label>
                    <input
                      type="text"
                      value={formData.arabic_title}
                      onChange={(e) => setFormData({ ...formData, arabic_title: e.target.value })}
                      className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs font-semibold outline-none"
                    />
                  </div>
                </div>

                {/* Body Template & Placeholder Pills */}
                <div>
                  <label className="text-xs font-bold text-slate-700 block mb-1">
                    মূল সনদপত্র বিবরণ (প্লেসহোল্ডার ক্লিক করে যোগ করুন)
                  </label>
                  <div className="flex flex-wrap gap-1 mb-2">
                    {PLACEHOLDER_TOKENS.map((tok) => (
                      <button
                        type="button"
                        key={tok.token}
                        onClick={() => insertToken(tok.token)}
                        className="px-2 py-0.5 bg-emerald-50 hover:bg-[#1C7D5A] text-[#123628] hover:text-white border border-emerald-200 rounded-md text-[10px] font-bold transition-colors cursor-pointer"
                      >
                        + {tok.label}
                      </button>
                    ))}
                  </div>
                  <textarea
                    rows={5}
                    value={formData.body_template}
                    onChange={(e) => setFormData({ ...formData, body_template: e.target.value })}
                    className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs leading-relaxed font-medium outline-none focus:border-[#1C7D5A]"
                  />
                </div>

                {/* Colors & Options */}
                <div className="grid grid-cols-4 gap-2">
                  {[
                    { key: "primary_color", label: "প্রাইমারি" },
                    { key: "secondary_color", label: "সেকেন্ডারি" },
                    { key: "accent_color", label: "গোল্ড" },
                    { key: "paper_bg", label: "পেপার" },
                  ].map((c) => (
                    <div key={c.key} className="bg-slate-50 border border-slate-200 rounded-xl p-1.5 flex items-center gap-1.5">
                      <input
                        type="color"
                        value={formData[c.key] || "#123628"}
                        onChange={(e) => setFormData({ ...formData, [c.key]: e.target.value })}
                        className="w-6 h-6 rounded cursor-pointer border-0 bg-transparent"
                      />
                      <span className="text-[10px] font-bold text-slate-600">{c.label}</span>
                    </div>
                  ))}
                </div>

                <div className="grid grid-cols-2 gap-2">
                  {[
                    { key: "show_photo", label: "প্রাপকের ছবি (লেটারহেডে)" },
                    { key: "show_qr", label: "QR ভেরিফিকেশন" },
                    { key: "show_bismillah", label: "বিসমিল্লাহ হেডার" },
                    { key: "is_default", label: "ডিফল্ট টেমপ্লেট" },
                  ].map((opt) => (
                    <label
                      key={opt.key}
                      className="flex items-center gap-2 p-2 rounded-xl bg-slate-50 border border-slate-200 text-xs font-bold text-slate-700 cursor-pointer"
                    >
                      <input
                        type="checkbox"
                        checked={Boolean(formData[opt.key])}
                        onChange={(e) => setFormData({ ...formData, [opt.key]: e.target.checked })}
                        className="accent-[#1C7D5A] w-4 h-4"
                      />
                      {opt.label}
                    </label>
                  ))}
                </div>

                <div className="grid grid-cols-3 gap-2">
                  <div>
                    <label className="text-[10px] font-bold text-slate-500 block mb-1">বাম স্বাক্ষর</label>
                    <input
                      type="text"
                      value={formData.left_sign_label}
                      onChange={(e) => setFormData({ ...formData, left_sign_label: e.target.value })}
                      className="w-full px-2.5 py-1.5 bg-slate-50 border border-slate-200 rounded-lg text-[11px] font-semibold"
                    />
                  </div>
                  <div>
                    <label className="text-[10px] font-bold text-slate-500 block mb-1">মাঝের স্বাক্ষর</label>
                    <input
                      type="text"
                      value={formData.middle_sign_label}
                      onChange={(e) => setFormData({ ...formData, middle_sign_label: e.target.value })}
                      className="w-full px-2.5 py-1.5 bg-slate-50 border border-slate-200 rounded-lg text-[11px] font-semibold"
                    />
                  </div>
                  <div>
                    <label className="text-[10px] font-bold text-slate-500 block mb-1">ডান স্বাক্ষর</label>
                    <input
                      type="text"
                      value={formData.right_sign_label}
                      onChange={(e) => setFormData({ ...formData, right_sign_label: e.target.value })}
                      className="w-full px-2.5 py-1.5 bg-slate-50 border border-slate-200 rounded-lg text-[11px] font-semibold"
                    />
                  </div>
                </div>
              </div>

              {/* Right Live Preview */}
              <div className="lg:col-span-7 bg-slate-200/70 p-6 flex flex-col justify-between gap-4 overflow-y-auto">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-extrabold uppercase tracking-wider text-slate-600 flex items-center gap-2">
                    <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
                    লাইভ সনদপত্র প্রিভিউ ({formData.layout === "portrait" ? "A4 পোর্ট্রেট" : "A4 ল্যান্ডস্কেপ"})
                  </span>
                </div>

                <div className="flex-1 flex items-center justify-center overflow-auto py-2">
                  <div className="w-full">
                    <CertificateRenderer
                      template={formData}
                      recipient={formData.target_type === "employee" ? SAMPLE_EMPLOYEE : SAMPLE_STUDENT}
                      targetType={formData.target_type}
                      madrasa={madrasa}
                    />
                  </div>
                </div>

                <div className="flex justify-end gap-3 pt-4 border-t border-slate-300/70">
                  <button
                    type="button"
                    onClick={() => setIsModalOpen(false)}
                    className="px-5 py-2.5 rounded-xl bg-white border border-slate-200 text-slate-600 text-sm font-bold cursor-pointer"
                  >
                    বাতিল
                  </button>
                  <button
                    type="submit"
                    disabled={saving}
                    className="px-6 py-2.5 rounded-xl bg-[#1C7D5A] hover:bg-[#123628] text-white text-sm font-bold shadow-md flex items-center gap-2 disabled:opacity-50 cursor-pointer"
                  >
                    {saving ? <Loader2 className="w-4 h-4 animate-spin" /> : <ShieldCheck className="w-4 h-4" />}
                    {editingId ? "আপডেট সেভ করুন" : "টেমপ্লেট সংরক্ষণ করুন"}
                  </button>
                </div>
              </div>
            </form>
          </div>
        </div>
      )}

      {deleteTarget && (
        <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-sm z-[130] flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl max-w-md w-full p-6 space-y-5 shadow-2xl">
            <h3 className="text-lg font-extrabold text-slate-800">সনদ টেমপ্লেট মুছবেন?</h3>
            <p className="text-xs text-slate-500">"{deleteTarget.name}" মুছে ফেলা হবে।</p>
            <div className="flex justify-end gap-3">
              <button onClick={() => setDeleteTarget(null)} className="px-4 py-2 rounded-xl bg-slate-100 text-xs font-bold cursor-pointer">
                বাতিল
              </button>
              <button onClick={handleDelete} className="px-4 py-2 rounded-xl bg-rose-600 text-white text-xs font-bold cursor-pointer">
                মুছে ফেলুন
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default CertificateTemplate;
