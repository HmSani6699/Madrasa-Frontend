import { useState, useEffect, useMemo } from "react";
import {
  Plus,
  Search,
  CreditCard,
  Edit3,
  Trash2,
  X,
  Check,
  Sparkles,
  Star,
  Copy,
  Eye,
  FlipHorizontal2,
  Loader2,
  ShieldCheck,
} from "lucide-react";
import { toast } from "react-hot-toast";
import { useAuth } from "../../context/AuthContext";
import { usePortalSettings } from "../../context/PortalSettingsContext";
import printStudioService from "../../services/printStudioService";
import {
  ID_CARD_PRESETS,
  ID_CARD_AVAILABLE_FIELDS,
  DEFAULT_ID_TEMPLATES,
  getMadrasaBranding,
} from "../../components/PrintStudio/printPresets";
import { IdCardRenderer } from "../../components/PrintStudio/IdCardRenderer";

const SAMPLE_STUDENT = {
  name: "মুহাম্মদ আব্দুল্লাহ আল-মামুন",
  student_id: "MS-2026-104",
  roll_number: "01",
  class: "হিফজ / পঞ্চম শ্রেণি",
  section: "শাখা-ক",
  fatherName: "মাওলানা আব্দুর রহমান",
  bloodGroup: "O+",
  phone: "01711-000000",
  academicYear: "2026",
  dob: "2013-05-14",
  address: "মিরপুর-১০, ঢাকা",
};

const SAMPLE_EMPLOYEE = {
  name: "মাওলানা আবু বকর সিদ্দিক",
  employeeID: "EMP-2026-07",
  designation: "সিনিয়র মুহাদ্দিস",
  department: "কিতাব বিভাগ",
  bloodGroup: "A+",
  phone: "01811-000000",
  joinDate: "2022-01-10",
  address: "যাত্রাবাড়ী, ঢাকা",
};

const INITIAL_FORM = {
  category: "id_card",
  target_type: "student",
  name: "",
  title: "শিক্ষার্থী পরিচয়পত্র",
  arabic_title: "بطاقة هوية الطالب",
  preset_key: "emerald_mihrab",
  layout: "vertical",
  primary_color: "#123628",
  secondary_color: "#1C7D5A",
  accent_color: "#EAB33C",
  text_color: "#ffffff",
  fields: ["id_no", "class", "section", "roll", "fatherName", "bloodGroup", "phone"],
  show_photo: true,
  show_qr: true,
  show_barcode: false,
  show_back_side: true,
  show_watermark: true,
  show_arabic_header: true,
  right_sign_label: "মুহতামিম / অধ্যক্ষ",
  back_note: "কার্ডটি পাওয়া গেলে অনুগ্রহ করে মাদ্রাসা অফিসে জমা দিন।",
  valid_thru: "ডিসেম্বর ২০২৬",
  is_default: false,
  status: "active",
};

const IdCardTemplate = () => {
  const { currentMadrasa } = useAuth();
  const { settings } = usePortalSettings();
  const madrasa = useMemo(() => getMadrasaBranding(currentMadrasa, settings), [currentMadrasa, settings]);

  const [savedTemplates, setSavedTemplates] = useState([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const [filterTarget, setFilterTarget] = useState("all");

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingId, setEditingId] = useState(null);
  const [formData, setFormData] = useState(INITIAL_FORM);
  const [previewSide, setPreviewSide] = useState("both");
  const [deleteTarget, setDeleteTarget] = useState(null);

  const fetchTemplates = async () => {
    setLoading(true);
    try {
      const res = await printStudioService.getTemplates({ category: "id_card" });
      if (res?.success) {
        setSavedTemplates(res.data || []);
      }
    } catch (err) {
      console.error("Failed to fetch ID templates:", err);
      toast.error("টেমপ্লেট লোড করা যায়নি");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchTemplates();
  }, []);

  const allTemplates = useMemo(() => {
    const merged = [...savedTemplates, ...DEFAULT_ID_TEMPLATES];
    return merged.filter((t) => {
      const matchesTarget = filterTarget === "all" || t.target_type === filterTarget || t.target_type === "all";
      const matchesSearch =
        !searchTerm.trim() ||
        (t.name || "").toLowerCase().includes(searchTerm.toLowerCase()) ||
        (t.title || "").toLowerCase().includes(searchTerm.toLowerCase());
      return matchesTarget && matchesSearch;
    });
  }, [savedTemplates, filterTarget, searchTerm]);

  const applyPreset = (preset) => {
    setFormData((prev) => ({
      ...prev,
      preset_key: preset.key,
      layout: preset.layout,
      primary_color: preset.primaryColor,
      secondary_color: preset.secondaryColor,
      accent_color: preset.accentColor,
      text_color: preset.textColor,
    }));
  };

  const openCreateModal = (baseTemplate = null) => {
    if (baseTemplate) {
      setEditingId(baseTemplate.isPreset ? null : baseTemplate._id);
      setFormData({
        ...INITIAL_FORM,
        ...baseTemplate,
        name: baseTemplate.isPreset ? `${baseTemplate.name} (কপি)` : baseTemplate.name,
      });
    } else {
      setEditingId(null);
      setFormData(INITIAL_FORM);
    }
    setPreviewSide("both");
    setIsModalOpen(true);
  };

  const handleTargetTypeChange = (targetType) => {
    setFormData((prev) => ({
      ...prev,
      target_type: targetType,
      title: targetType === "employee" ? "শিক্ষক ও কর্মকর্তা পরিচয়পত্র" : "শিক্ষার্থী পরিচয়পত্র",
      arabic_title: targetType === "employee" ? "بطاقة الموظف والمعلم" : "بطاقة هوية الطالب",
      fields:
        targetType === "employee"
          ? ["id_no", "designation", "department", "bloodGroup", "phone", "joinDate"]
          : ["id_no", "class", "section", "roll", "fatherName", "bloodGroup", "phone"],
    }));
  };

  const toggleField = (fieldKey) => {
    setFormData((prev) => ({
      ...prev,
      fields: prev.fields.includes(fieldKey)
        ? prev.fields.filter((f) => f !== fieldKey)
        : [...prev.fields, fieldKey],
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
        category: "id_card",
        target_type: formData.target_type,
        name: formData.name.trim(),
        title: formData.title,
        arabic_title: formData.arabic_title,
        preset_key: formData.preset_key,
        layout: formData.layout,
        primary_color: formData.primary_color,
        secondary_color: formData.secondary_color,
        accent_color: formData.accent_color,
        text_color: formData.text_color,
        fields: formData.fields,
        show_photo: formData.show_photo,
        show_qr: formData.show_qr,
        show_barcode: formData.show_barcode,
        show_back_side: formData.show_back_side,
        show_watermark: formData.show_watermark,
        show_arabic_header: formData.show_arabic_header,
        right_sign_label: formData.right_sign_label,
        back_note: formData.back_note,
        valid_thru: formData.valid_thru,
        is_default: formData.is_default,
        status: formData.status || "active",
      };

      if (editingId) {
        await printStudioService.updateTemplate(editingId, payload);
        toast.success("আইডি কার্ড টেমপ্লেট আপডেট হয়েছে");
      } else {
        await printStudioService.createTemplate(payload);
        toast.success("নতুন আইডি কার্ড টেমপ্লেট সংরক্ষণ করা হয়েছে");
      }
      setIsModalOpen(false);
      fetchTemplates();
    } catch (err) {
      console.error("Save template error:", err);
      toast.error(err.response?.data?.message || "টেমপ্লেট সংরক্ষণ ব্যর্থ হয়েছে");
    } finally {
      setSaving(false);
    }
  };

  const handleSetDefault = async (template) => {
    if (template.isPreset) {
      openCreateModal({ ...template, is_default: true });
      return;
    }
    try {
      await printStudioService.setDefaultTemplate(template._id);
      toast.success("ডিফল্ট টেমপ্লেট নির্ধারিত হয়েছে");
      fetchTemplates();
    } catch {
      toast.error("ডিফল্ট সেট করা যায়নি");
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
      toast.error("টেমপ্লেট মুছতে সমস্যা হয়েছে");
    }
  };

  return (
    <div className="p-4 md:p-6 max-w-[1600px] mx-auto space-y-6 animate-fade-in">
      {/* Page Header */}
      <div className="bg-white rounded-2xl border border-slate-200/80 p-5 md:p-6 shadow-sm flex flex-col lg:flex-row lg:items-center justify-between gap-4">
        <div className="flex items-center gap-4">
          <div className="w-12 h-12 rounded-xl bg-[#123628] text-[#EAB33C] flex items-center justify-center shadow-md shrink-0">
            <CreditCard className="w-6 h-6" />
          </div>
          <div>
            <h1 className="text-xl md:text-2xl font-extrabold text-slate-800">
              আইডি কার্ড ডিজাইন স্টুডিও (ID Card Templates)
            </h1>
            <p className="text-xs md:text-sm text-slate-500 mt-0.5">
              শিক্ষার্থী ও শিক্ষক-কর্মীদের জন্য CR80 প্রফেশনাল ফ্রন্ট ও ব্যাক আইডি কার্ড নকশা তৈরি ও সংরক্ষণ করুন
            </p>
          </div>
        </div>

        <button
          onClick={() => openCreateModal(null)}
          className="px-5 py-2.5 bg-[#1C7D5A] hover:bg-[#123628] text-white text-sm font-bold rounded-xl shadow-sm transition-all flex items-center justify-center gap-2 cursor-pointer"
        >
          <Plus className="w-4 h-4" />
          নতুন টেমপ্লেট ডিজাইন করুন
        </button>
      </div>

      {/* Filter Toolbar */}
      <div className="bg-white rounded-2xl border border-slate-200/80 p-4 shadow-sm flex flex-col md:flex-row items-stretch md:items-center justify-between gap-4">
        <div className="relative flex-1 max-w-md">
          <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            placeholder="টেমপ্লেটের নাম লিখে খুঁজুন..."
            className="w-full pl-10 pr-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm font-medium outline-none focus:border-[#1C7D5A]"
          />
        </div>

        <div className="flex items-center gap-2 flex-wrap">
          {[
            { id: "all", label: "সবগুলো" },
            { id: "student", label: "শিক্ষার্থী কার্ড" },
            { id: "employee", label: "শিক্ষক ও স্টাফ কার্ড" },
          ].map((tab) => (
            <button
              key={tab.id}
              onClick={() => setFilterTarget(tab.id)}
              className={`px-4 py-2 rounded-xl text-xs font-bold transition-all cursor-pointer ${
                filterTarget === tab.id
                  ? "bg-[#123628] text-white shadow-sm"
                  : "bg-slate-100 text-slate-600 hover:bg-slate-200"
              }`}
            >
              {tab.label}
            </button>
          ))}
        </div>
      </div>

      {/* Built-in Quick Presets Strip */}
      <div className="bg-gradient-to-r from-[#123628] to-[#1C7D5A] rounded-2xl p-5 text-white shadow-md">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-3 mb-4">
          <div className="flex items-center gap-2">
            <Sparkles className="w-5 h-5 text-[#EAB33C]" />
            <h2 className="text-base font-extrabold">৮টি রেডিমেড গ্রাফিক ডিজাইন প্রিসেট</h2>
          </div>
          <span className="text-xs text-white/80">যেকোনো নকশায় ক্লিক করে সরাসরি নিজের মাদ্রাসার জন্য কাস্টমাইজ করুন</span>
        </div>
        <div className="grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-8 gap-2.5">
          {ID_CARD_PRESETS.map((preset) => (
            <button
              key={preset.key}
              onClick={() =>
                openCreateModal({
                  ...INITIAL_FORM,
                  name: preset.name,
                  preset_key: preset.key,
                  layout: preset.layout,
                  primary_color: preset.primaryColor,
                  secondary_color: preset.secondaryColor,
                  accent_color: preset.accentColor,
                  text_color: preset.textColor,
                  target_type: preset.layout === "horizontal" ? "employee" : "student",
                  title: preset.layout === "horizontal" ? "শিক্ষক ও কর্মকর্তা পরিচয়পত্র" : "শিক্ষার্থী পরিচয়পত্র",
                  isPreset: true,
                })
              }
              className="bg-white/10 hover:bg-white/20 border border-white/15 rounded-xl p-2.5 text-left transition-all cursor-pointer group"
            >
              <div className="flex items-center gap-1.5 mb-1.5">
                <span className="w-3.5 h-3.5 rounded-full border border-white/50" style={{ backgroundColor: preset.primaryColor }} />
                <span className="w-3.5 h-3.5 rounded-full border border-white/50" style={{ backgroundColor: preset.accentColor }} />
                <span className="text-[9px] font-bold px-1.5 py-0.5 rounded bg-black/25 text-[#EAB33C] ml-auto">
                  {preset.layout === "horizontal" ? "আড়াআড়ি" : "লম্বা"}
                </span>
              </div>
              <p className="text-[11px] font-bold leading-snug line-clamp-2 group-hover:text-[#EAB33C] transition-colors">
                {preset.name}
              </p>
            </button>
          ))}
        </div>
      </div>

      {/* Templates Grid */}
      {loading ? (
        <div className="bg-white rounded-2xl border border-slate-200 p-16 flex flex-col items-center justify-center gap-3">
          <Loader2 className="w-8 h-8 animate-spin text-[#1C7D5A]" />
          <p className="text-sm font-bold text-slate-500">টেমপ্লেট লোড হচ্ছে...</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
          {allTemplates.map((template) => {
            const sample = template.target_type === "employee" ? SAMPLE_EMPLOYEE : SAMPLE_STUDENT;
            const isHoriz = template.layout === "horizontal";
            return (
              <div
                key={template._id}
                className="bg-white rounded-2xl border border-slate-200/90 shadow-sm hover:shadow-lg transition-all overflow-hidden flex flex-col"
              >
                {/* Card Live Miniature Preview */}
                <div className="bg-slate-100/80 p-5 flex items-center justify-center min-h-[290px] relative border-b border-slate-200/70 overflow-hidden">
                  <div className={isHoriz ? "scale-[0.76] origin-center" : "scale-[0.68] origin-center"}>
                    <IdCardRenderer
                      template={template}
                      person={sample}
                      madrasa={madrasa}
                      targetType={template.target_type === "employee" ? "employee" : "student"}
                      side="front"
                    />
                  </div>

                  {/* Badges */}
                  <div className="absolute top-3 left-3 flex items-center gap-1.5">
                    {template.isPreset ? (
                      <span className="px-2.5 py-1 rounded-full bg-slate-800/85 text-white text-[10px] font-bold">
                        সিস্টেম প্রিসেট
                      </span>
                    ) : (
                      <span className="px-2.5 py-1 rounded-full bg-emerald-600 text-white text-[10px] font-bold">
                        সংরক্ষিত
                      </span>
                    )}
                    {template.is_default && (
                      <span className="px-2.5 py-1 rounded-full bg-[#EAB33C] text-[#123628] text-[10px] font-extrabold flex items-center gap-1">
                        <Star className="w-3 h-3 fill-current" /> ডিফল্ট
                      </span>
                    )}
                  </div>

                  <div className="absolute top-3 right-3 flex gap-1.5">
                    <button
                      onClick={() => openCreateModal(template)}
                      title={template.isPreset ? "কপি করে কাস্টমাইজ করুন" : "সম্পাদনা করুন"}
                      className="p-2 bg-white hover:bg-emerald-50 text-slate-600 hover:text-[#1C7D5A] rounded-lg border border-slate-200 shadow-xs transition-colors cursor-pointer"
                    >
                      {template.isPreset ? <Copy className="w-4 h-4" /> : <Edit3 className="w-4 h-4" />}
                    </button>
                    {!template.isPreset && (
                      <button
                        onClick={() => setDeleteTarget(template)}
                        title="মুছে ফেলুন"
                        className="p-2 bg-white hover:bg-rose-50 text-slate-600 hover:text-rose-600 rounded-lg border border-slate-200 shadow-xs transition-colors cursor-pointer"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    )}
                  </div>
                </div>

                {/* Metadata Footer */}
                <div className="p-4 flex-1 flex flex-col justify-between gap-3">
                  <div>
                    <div className="flex items-center justify-between gap-2">
                      <span className="text-[11px] font-bold text-[#1C7D5A] uppercase">
                        {template.target_type === "employee" ? "শিক্ষক ও স্টাফ" : "শিক্ষার্থী"} •{" "}
                        {isHoriz ? "আড়াআড়ি (Landscape)" : "লম্বা (Portrait)"}
                      </span>
                      <span className="text-[11px] font-semibold text-slate-400">
                        {(template.fields || []).length} ফিল্ড
                      </span>
                    </div>
                    <h3 className="text-base font-extrabold text-slate-800 mt-1 line-clamp-1">{template.name}</h3>
                  </div>

                  <div className="flex items-center gap-2 pt-2 border-t border-slate-100">
                    <button
                      onClick={() => openCreateModal(template)}
                      className="flex-1 py-2 px-3 bg-slate-100 hover:bg-[#1C7D5A] text-slate-700 hover:text-white rounded-xl text-xs font-bold transition-colors flex items-center justify-center gap-1.5 cursor-pointer"
                    >
                      <Eye className="w-3.5 h-3.5" />
                      {template.isPreset ? "কাস্টমাইজ ও সেভ" : "ডিজাইন এডিট"}
                    </button>
                    {!template.is_default && (
                      <button
                        onClick={() => handleSetDefault(template)}
                        className="py-2 px-3 bg-amber-50 hover:bg-amber-100 text-amber-800 border border-amber-200 rounded-xl text-xs font-bold transition-colors cursor-pointer"
                      >
                        ডিফল্ট করুন
                      </button>
                    )}
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* Split-Pane Designer Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 bg-slate-900/75 backdrop-blur-sm z-[120] flex items-center justify-center p-3 md:p-6">
          <div className="bg-white rounded-2xl w-full max-w-6xl max-h-[94vh] flex flex-col overflow-hidden shadow-2xl">
            {/* Modal Header */}
            <div className="px-6 py-4 border-b border-slate-200 flex items-center justify-between bg-slate-50 shrink-0">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-[#123628] text-[#EAB33C] flex items-center justify-center">
                  <CreditCard className="w-5 h-5" />
                </div>
                <div>
                  <h2 className="text-lg font-extrabold text-slate-800">
                    {editingId ? "আইডি কার্ড টেমপ্লেট সম্পাদনা" : "নতুন আইডি কার্ড ডিজাইন স্টুডিও"}
                  </h2>
                  <p className="text-xs text-slate-500">ডানপাশে রিয়েল-টাইম ফ্রন্ট ও ব্যাক প্রিভিউ দেখে সেভ করুন</p>
                </div>
              </div>
              <button
                onClick={() => setIsModalOpen(false)}
                className="p-2 text-slate-400 hover:text-slate-700 hover:bg-slate-200 rounded-xl cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Modal Body */}
            <form onSubmit={handleSave} className="flex-1 overflow-y-auto grid grid-cols-1 lg:grid-cols-12">
              {/* Left Configuration */}
              <div className="lg:col-span-6 p-6 space-y-6 border-b lg:border-b-0 lg:border-r border-slate-200 overflow-y-auto">
                {/* 1. Preset Style */}
                <div>
                  <label className="text-xs font-bold text-slate-700 block mb-2">১. গ্রাফিক ডিজাইন প্রিসেট বাছাই করুন</label>
                  <div className="grid grid-cols-2 gap-2">
                    {ID_CARD_PRESETS.map((p) => (
                      <button
                        type="button"
                        key={p.key}
                        onClick={() => applyPreset(p)}
                        className={`p-2.5 rounded-xl border text-left transition-all cursor-pointer ${
                          formData.preset_key === p.key
                            ? "border-[#1C7D5A] bg-emerald-50/70 ring-1 ring-[#1C7D5A]"
                            : "border-slate-200 hover:border-slate-300"
                        }`}
                      >
                        <div className="flex items-center justify-between gap-2 mb-1">
                          <div className="flex items-center gap-1">
                            <span className="w-3 h-3 rounded-full" style={{ backgroundColor: p.primaryColor }} />
                            <span className="w-3 h-3 rounded-full" style={{ backgroundColor: p.accentColor }} />
                          </div>
                          <span className="text-[10px] font-bold text-slate-500">{p.badge}</span>
                        </div>
                        <p className="text-xs font-bold text-slate-800 line-clamp-1">{p.name}</p>
                      </button>
                    ))}
                  </div>
                </div>

                {/* 2. Basic Info */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div className="sm:col-span-2">
                    <label className="text-xs font-bold text-slate-700 block mb-1">টেমপ্লেটের নাম *</label>
                    <input
                      type="text"
                      required
                      value={formData.name}
                      onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                      placeholder="যেমন: শিক্ষার্থী স্মার্ট কার্ড ২০২৬"
                      className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm font-semibold outline-none focus:border-[#1C7D5A]"
                    />
                  </div>

                  <div>
                    <label className="text-xs font-bold text-slate-700 block mb-1">কার জন্য প্রযোজ্য</label>
                    <select
                      value={formData.target_type}
                      onChange={(e) => handleTargetTypeChange(e.target.value)}
                      className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm font-semibold outline-none focus:border-[#1C7D5A]"
                    >
                      <option value="student">শিক্ষার্থী (Student)</option>
                      <option value="employee">শিক্ষক ও স্টাফ (Employee)</option>
                    </select>
                  </div>

                  <div>
                    <label className="text-xs font-bold text-slate-700 block mb-1">কার্ডের অরিয়েন্টেশন</label>
                    <select
                      value={formData.layout}
                      onChange={(e) => setFormData({ ...formData, layout: e.target.value })}
                      className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm font-semibold outline-none focus:border-[#1C7D5A]"
                    >
                      <option value="vertical">লম্বা (Portrait CR80)</option>
                      <option value="horizontal">আড়াআড়ি (Landscape CR80)</option>
                    </select>
                  </div>

                  <div>
                    <label className="text-xs font-bold text-slate-700 block mb-1">কার্ড ব্যাজ শিরোনাম</label>
                    <input
                      type="text"
                      value={formData.title}
                      onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                      className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm font-semibold outline-none focus:border-[#1C7D5A]"
                    />
                  </div>

                  <div>
                    <label className="text-xs font-bold text-slate-700 block mb-1">মেয়াদ (Valid Thru)</label>
                    <input
                      type="text"
                      value={formData.valid_thru}
                      onChange={(e) => setFormData({ ...formData, valid_thru: e.target.value })}
                      placeholder="ডিসেম্বর ২০২৬"
                      className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm font-semibold outline-none focus:border-[#1C7D5A]"
                    />
                  </div>
                </div>

                {/* 3. Colors */}
                <div>
                  <label className="text-xs font-bold text-slate-700 block mb-2">৩. কালার প্যালেট</label>
                  <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                    {[
                      { key: "primary_color", label: "প্রাইমারি" },
                      { key: "secondary_color", label: "সেকেন্ডারি" },
                      { key: "accent_color", label: "গোল্ড/অ্যাকসেন্ট" },
                      { key: "text_color", label: "হেডার টেক্সট" },
                    ].map((c) => (
                      <div key={c.key} className="bg-slate-50 border border-slate-200 rounded-xl p-2 flex items-center gap-2">
                        <input
                          type="color"
                          value={formData[c.key] || "#123628"}
                          onChange={(e) => setFormData({ ...formData, [c.key]: e.target.value })}
                          className="w-8 h-8 rounded cursor-pointer border-0 bg-transparent"
                        />
                        <div className="min-w-0">
                          <span className="text-[10px] font-bold text-slate-500 block">{c.label}</span>
                          <span className="text-[10px] font-mono font-bold text-slate-700">{formData[c.key]}</span>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                {/* 4. Fields */}
                <div>
                  <label className="text-xs font-bold text-slate-700 block mb-2">৪. কার্ডে প্রদর্শিত তথ্য (Fields)</label>
                  <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
                    {ID_CARD_AVAILABLE_FIELDS.map((f) => {
                      const active = formData.fields.includes(f.key);
                      return (
                        <button
                          type="button"
                          key={f.key}
                          onClick={() => toggleField(f.key)}
                          className={`px-3 py-2 rounded-xl border text-xs font-bold flex items-center justify-between transition-all cursor-pointer ${
                            active
                              ? "bg-emerald-50 border-[#1C7D5A] text-[#123628]"
                              : "bg-white border-slate-200 text-slate-500 hover:border-slate-300"
                          }`}
                        >
                          <span className="truncate">{f.label}</span>
                          {active && <Check className="w-3.5 h-3.5 text-[#1C7D5A] shrink-0" />}
                        </button>
                      );
                    })}
                  </div>
                </div>

                {/* 5. Toggles & Footer Text */}
                <div className="grid grid-cols-2 sm:grid-cols-3 gap-2.5">
                  {[
                    { key: "show_photo", label: "ছবি দেখান" },
                    { key: "show_qr", label: "QR ভেরিফিকেশন" },
                    { key: "show_barcode", label: "বারকোড" },
                    { key: "show_arabic_header", label: "আরবি শিরোনাম" },
                    { key: "show_watermark", label: "লোগো ওয়াটারমার্ক" },
                    { key: "is_default", label: "ডিফল্ট টেমপ্লেট" },
                  ].map((opt) => (
                    <label
                      key={opt.key}
                      className="flex items-center gap-2 p-2.5 rounded-xl bg-slate-50 border border-slate-200 cursor-pointer text-xs font-bold text-slate-700"
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

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="text-xs font-bold text-slate-700 block mb-1">স্বাক্ষর পদবী</label>
                    <input
                      type="text"
                      value={formData.right_sign_label}
                      onChange={(e) => setFormData({ ...formData, right_sign_label: e.target.value })}
                      className="w-full px-3.5 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs font-semibold outline-none focus:border-[#1C7D5A]"
                    />
                  </div>
                  <div>
                    <label className="text-xs font-bold text-slate-700 block mb-1">পিছনের দিকের নির্দেশনা</label>
                    <input
                      type="text"
                      value={formData.back_note}
                      onChange={(e) => setFormData({ ...formData, back_note: e.target.value })}
                      className="w-full px-3.5 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs font-semibold outline-none focus:border-[#1C7D5A]"
                    />
                  </div>
                </div>
              </div>

              {/* Right Live Preview */}
              <div className="lg:col-span-6 bg-slate-100 p-6 flex flex-col items-center justify-between gap-4">
                <div className="w-full flex items-center justify-between">
                  <span className="text-xs font-extrabold uppercase tracking-wider text-slate-500 flex items-center gap-2">
                    <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
                    লাইভ প্রিভিউ (CR80 প্রিন্ট স্কেল)
                  </span>
                  <div className="flex items-center gap-1 bg-white p-1 rounded-xl border border-slate-200">
                    {[
                      { id: "front", label: "সামনে" },
                      { id: "back", label: "পিছনে" },
                      { id: "both", label: "উভয় পাশ" },
                    ].map((s) => (
                      <button
                        type="button"
                        key={s.id}
                        onClick={() => setPreviewSide(s.id)}
                        className={`px-3 py-1 rounded-lg text-xs font-bold transition-all cursor-pointer ${
                          previewSide === s.id ? "bg-[#123628] text-white" : "text-slate-600 hover:bg-slate-100"
                        }`}
                      >
                        {s.label}
                      </button>
                    ))}
                  </div>
                </div>

                <div className="flex-1 flex items-center justify-center py-4 overflow-auto w-full">
                  <IdCardRenderer
                    template={formData}
                    person={formData.target_type === "employee" ? SAMPLE_EMPLOYEE : SAMPLE_STUDENT}
                    madrasa={madrasa}
                    targetType={formData.target_type}
                    side={previewSide}
                  />
                </div>

                <div className="w-full flex items-center justify-end gap-3 pt-4 border-t border-slate-200">
                  <button
                    type="button"
                    onClick={() => setIsModalOpen(false)}
                    className="px-5 py-2.5 rounded-xl bg-white border border-slate-200 text-slate-600 text-sm font-bold hover:bg-slate-50 cursor-pointer"
                  >
                    বাতিল
                  </button>
                  <button
                    type="submit"
                    disabled={saving}
                    className="px-6 py-2.5 rounded-xl bg-[#1C7D5A] hover:bg-[#123628] text-white text-sm font-bold shadow-md flex items-center gap-2 disabled:opacity-50 cursor-pointer"
                  >
                    {saving ? <Loader2 className="w-4 h-4 animate-spin" /> : <ShieldCheck className="w-4 h-4" />}
                    {editingId ? "আপডেট সংরক্ষণ করুন" : "টেমপ্লেট সেভ করুন"}
                  </button>
                </div>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Delete Confirmation Modal */}
      {deleteTarget && (
        <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-sm z-[130] flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl max-w-md w-full p-6 space-y-5 shadow-2xl">
            <div className="flex items-center gap-3">
              <div className="w-11 h-11 rounded-xl bg-rose-50 text-rose-600 flex items-center justify-center">
                <Trash2 className="w-5 h-5" />
              </div>
              <div>
                <h3 className="text-lg font-extrabold text-slate-800">টেমপ্লেট মুছে ফেলবেন?</h3>
                <p className="text-xs text-slate-500">"{deleteTarget.name}" স্থায়ীভাবে মুছে যাবে।</p>
              </div>
            </div>
            <div className="flex justify-end gap-3">
              <button
                onClick={() => setDeleteTarget(null)}
                className="px-4 py-2 rounded-xl bg-slate-100 text-slate-700 text-xs font-bold cursor-pointer"
              >
                না, থাক
              </button>
              <button
                onClick={handleDelete}
                className="px-4 py-2 rounded-xl bg-rose-600 text-white text-xs font-bold cursor-pointer"
              >
                হ্যাঁ, মুছে ফেলুন
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default IdCardTemplate;
