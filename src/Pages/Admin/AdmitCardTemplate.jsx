import { useState, useEffect, useMemo } from "react";
import {
  Plus,
  Search,
  FileText,
  Edit3,
  Trash2,
  X,
  Star,
  Copy,
  Eye,
  Sparkles,
  Loader2,
  ShieldCheck,
} from "lucide-react";
import { toast } from "react-hot-toast";
import { useAuth } from "../../context/AuthContext";
import { usePortalSettings } from "../../context/PortalSettingsContext";
import printStudioService from "../../services/printStudioService";
import {
  ADMIT_CARD_PRESETS,
  DEFAULT_ADMIT_TEMPLATES,
  getMadrasaBranding,
} from "../../components/PrintStudio/printPresets";
import { AdmitCardRenderer } from "../../components/PrintStudio/AdmitCardRenderer";

const SAMPLE_STUDENT = {
  name: "মুহাম্মদ আব্দুল্লাহ আল-মামুন",
  student_id: "MS-2026-104",
  roll_number: "01",
  class: "মেশকাত / অষ্টম শ্রেণি",
  section: "শাখা-ক",
  fatherName: "মাওলানা আব্দুর রহমান",
  academicYear: "2026",
};

const INITIAL_FORM = {
  category: "admit_card",
  target_type: "student",
  name: "",
  title: "প্রবেশপত্র / ADMIT CARD",
  arabic_title: "بطاقة دخول الامتحان",
  preset_key: "islamic_heritage",
  layout: "portrait",
  primary_color: "#123628",
  secondary_color: "#1C7D5A",
  accent_color: "#EAB33C",
  paper_bg: "#fcfaf2",
  show_photo: true,
  show_qr: true,
  show_subject_table: true,
  show_room_no: true,
  show_seat_no: true,
  show_bismillah: true,
  instructions: [
    "পরীক্ষা শুরুর অন্তত ২০ মিনিট পূর্বে পরীক্ষার হলে নিজ আসনে উপস্থিত হতে হবে।",
    "প্রবেশপত্র ছাড়া কোনো পরীক্ষার্থীকে পরীক্ষার হলে প্রবেশ করতে দেওয়া হবে না।",
    "পরীক্ষার হলে মোবাইল ফোন বা যেকোনো অসদুপায় সম্পূর্ণ নিষিদ্ধ।",
  ],
  left_sign_label: "নাজিমে তালিমাত / পরীক্ষা নিয়ন্ত্রক",
  right_sign_label: "মুহতামিম / অধ্যক্ষ",
  is_default: false,
  status: "active",
};

const AdmitCardTemplate = () => {
  const { currentMadrasa } = useAuth();
  const { settings } = usePortalSettings();
  const madrasa = useMemo(() => getMadrasaBranding(currentMadrasa, settings), [currentMadrasa, settings]);

  const [savedTemplates, setSavedTemplates] = useState([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingId, setEditingId] = useState(null);
  const [formData, setFormData] = useState(INITIAL_FORM);
  const [deleteTarget, setDeleteTarget] = useState(null);

  const fetchTemplates = async () => {
    setLoading(true);
    try {
      const res = await printStudioService.getTemplates({ category: "admit_card" });
      if (res?.success) setSavedTemplates(res.data || []);
    } catch (err) {
      console.error("Failed loading admit templates:", err);
      toast.error("প্রবেশপত্র টেমপ্লেট লোড করা যায়নি");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchTemplates();
  }, []);

  const allTemplates = useMemo(() => {
    const merged = [...savedTemplates, ...DEFAULT_ADMIT_TEMPLATES];
    if (!searchTerm.trim()) return merged;
    const q = searchTerm.toLowerCase();
    return merged.filter(
      (t) => (t.name || "").toLowerCase().includes(q) || (t.title || "").toLowerCase().includes(q)
    );
  }, [savedTemplates, searchTerm]);

  const applyPreset = (preset) => {
    setFormData((prev) => ({
      ...prev,
      preset_key: preset.key,
      primary_color: preset.primaryColor,
      secondary_color: preset.secondaryColor,
      accent_color: preset.accentColor,
      paper_bg: preset.paperBg,
      show_subject_table: preset.density === "compact" ? false : prev.show_subject_table,
    }));
  };

  const openModal = (base = null) => {
    if (base) {
      setEditingId(base.isPreset ? null : base._id);
      setFormData({
        ...INITIAL_FORM,
        ...base,
        name: base.isPreset ? `${base.name} (কপি)` : base.name,
        instructions: Array.isArray(base.instructions) ? base.instructions : INITIAL_FORM.instructions,
      });
    } else {
      setEditingId(null);
      setFormData(INITIAL_FORM);
    }
    setIsModalOpen(true);
  };

  const handleInstructionChange = (idx, val) => {
    const copy = [...formData.instructions];
    copy[idx] = val;
    setFormData({ ...formData, instructions: copy });
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
        category: "admit_card",
        target_type: "student",
        name: formData.name.trim(),
        title: formData.title,
        arabic_title: formData.arabic_title,
        preset_key: formData.preset_key,
        layout: "portrait",
        primary_color: formData.primary_color,
        secondary_color: formData.secondary_color,
        accent_color: formData.accent_color,
        paper_bg: formData.paper_bg,
        show_photo: formData.show_photo,
        show_qr: formData.show_qr,
        show_subject_table: formData.show_subject_table,
        show_room_no: formData.show_room_no,
        show_seat_no: formData.show_seat_no,
        show_bismillah: formData.show_bismillah,
        instructions: formData.instructions.filter((i) => i.trim() !== ""),
        left_sign_label: formData.left_sign_label,
        right_sign_label: formData.right_sign_label,
        is_default: formData.is_default,
        status: "active",
      };

      if (editingId) {
        await printStudioService.updateTemplate(editingId, payload);
        toast.success("প্রবেশপত্র টেমপ্লেট আপডেট হয়েছে");
      } else {
        await printStudioService.createTemplate(payload);
        toast.success("নতুন প্রবেশপত্র টেমপ্লেট সংরক্ষণ করা হয়েছে");
      }
      setIsModalOpen(false);
      fetchTemplates();
    } catch (err) {
      toast.error(err.response?.data?.message || "সংরক্ষণ ব্যর্থ হয়েছে");
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

  return (
    <div className="p-4 md:p-6 max-w-[1600px] mx-auto space-y-6 animate-fade-in">
      {/* Header */}
      <div className="bg-white rounded-2xl border border-slate-200/80 p-5 md:p-6 shadow-sm flex flex-col lg:flex-row lg:items-center justify-between gap-4">
        <div className="flex items-center gap-4">
          <div className="w-12 h-12 rounded-xl bg-[#123628] text-[#EAB33C] flex items-center justify-center shrink-0">
            <FileText className="w-6 h-6" />
          </div>
          <div>
            <h1 className="text-xl md:text-2xl font-extrabold text-slate-800">
              প্রবেশপত্র টেমপ্লেট স্টুডিও (Admit Card Templates)
            </h1>
            <p className="text-xs md:text-sm text-slate-500 mt-0.5">
              ১২টি ইসলামিক ও একাডেমিক প্রবেশপত্র নকশা — পরীক্ষার রুটিন, হল কক্ষ, সিট নং ও নির্দেশনাবলিসহ কাস্টমাইজ করুন
            </p>
          </div>
        </div>

        <button
          onClick={() => openModal(null)}
          className="px-5 py-2.5 bg-[#1C7D5A] hover:bg-[#123628] text-white text-sm font-bold rounded-xl shadow-sm transition-all flex items-center justify-center gap-2 cursor-pointer"
        >
          <Plus className="w-4 h-4" />
          নতুন প্রবেশপত্র টেমপ্লেট
        </button>
      </div>

      {/* 12 Ready Presets Showcase */}
      <div className="bg-gradient-to-r from-[#123628] to-[#1C7D5A] rounded-2xl p-5 text-white shadow-md">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-2 mb-4">
          <div className="flex items-center gap-2">
            <Sparkles className="w-5 h-5 text-[#EAB33C]" />
            <h2 className="text-base font-extrabold">১২টি প্রফেশনাল প্রবেশপত্র ডিজাইন প্রিসেট</h2>
          </div>
          <span className="text-xs text-white/80">ইসলামী ঐতিহ্য, মিহরাব, উসমানী টাইল, মসজিদ সিলুয়েট, কমপ্যাক্ট টিকিট ও আরও অনেক</span>
        </div>
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-2.5">
          {ADMIT_CARD_PRESETS.map((p) => (
            <button
              key={p.key}
              onClick={() =>
                openModal({
                  ...INITIAL_FORM,
                  name: `প্রবেশপত্র — ${p.name}`,
                  preset_key: p.key,
                  primary_color: p.primaryColor,
                  secondary_color: p.secondaryColor,
                  accent_color: p.accentColor,
                  paper_bg: p.paperBg,
                  show_subject_table: p.density !== "compact",
                  isPreset: true,
                })
              }
              className="bg-white/10 hover:bg-white/20 border border-white/15 rounded-xl p-2.5 text-left transition-all cursor-pointer"
            >
              <div className="flex items-center gap-1.5 mb-1">
                <span className="w-3 h-3 rounded-full border border-white/40" style={{ backgroundColor: p.primaryColor }} />
                <span className="w-3 h-3 rounded-full border border-white/40" style={{ backgroundColor: p.accentColor }} />
                <span className="text-[9px] font-bold ml-auto text-[#EAB33C]">
                  {p.density === "compact" ? "৪টি/পাতা" : "স্ট্যান্ডার্ড"}
                </span>
              </div>
              <p className="text-[11px] font-bold line-clamp-1">{p.name}</p>
            </button>
          ))}
        </div>
      </div>

      {/* Search */}
      <div className="bg-white rounded-2xl border border-slate-200/80 p-4 shadow-sm">
        <div className="relative max-w-md">
          <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            placeholder="প্রবেশপত্র টেমপ্লেট খুঁজুন..."
            className="w-full pl-10 pr-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm font-medium outline-none focus:border-[#1C7D5A]"
          />
        </div>
      </div>

      {/* Templates Grid */}
      {loading ? (
        <div className="bg-white rounded-2xl border border-slate-200 p-16 flex flex-col items-center gap-3">
          <Loader2 className="w-8 h-8 animate-spin text-[#1C7D5A]" />
          <p className="text-sm font-bold text-slate-500">টেমপ্লেট লোড হচ্ছে...</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {allTemplates.map((template) => (
            <div
              key={template._id}
              className="bg-white rounded-2xl border border-slate-200/90 shadow-sm hover:shadow-lg transition-all overflow-hidden flex flex-col"
            >
              <div className="bg-slate-100/80 p-4 border-b border-slate-200 relative overflow-hidden">
                <div className="flex items-center justify-between mb-3">
                  <div className="flex items-center gap-2">
                    {template.isPreset ? (
                      <span className="px-2.5 py-0.5 rounded-full bg-slate-800 text-white text-[10px] font-bold">
                        সিস্টেম প্রিসেট
                      </span>
                    ) : (
                      <span className="px-2.5 py-0.5 rounded-full bg-emerald-600 text-white text-[10px] font-bold">
                        সংরক্ষিত
                      </span>
                    )}
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

                <div className="max-h-[290px] overflow-hidden rounded-xl pointer-events-none">
                  <div className="scale-[0.78] origin-top">
                    <AdmitCardRenderer
                      template={template}
                      student={SAMPLE_STUDENT}
                      exam={{ name: "বার্ষিক পরীক্ষা ২০২৬" }}
                      madrasa={madrasa}
                    />
                  </div>
                </div>
              </div>

              <div className="p-4 flex items-center justify-between gap-3">
                <div>
                  <h3 className="text-base font-extrabold text-slate-800">{template.name}</h3>
                  <p className="text-xs text-slate-500">
                    {(template.instructions || []).length}টি নির্দেশনা •{" "}
                    {template.show_subject_table ? "রুটিন টেবিলসহ" : "কমপ্যাক্ট কার্ড"}
                  </p>
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

      {/* Designer Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 bg-slate-900/75 backdrop-blur-sm z-[120] flex items-center justify-center p-3 md:p-6">
          <div className="bg-white rounded-2xl w-full max-w-6xl max-h-[94vh] flex flex-col overflow-hidden shadow-2xl">
            <div className="px-6 py-4 border-b border-slate-200 flex items-center justify-between bg-slate-50 shrink-0">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-[#123628] text-[#EAB33C] flex items-center justify-center">
                  <FileText className="w-5 h-5" />
                </div>
                <div>
                  <h2 className="text-lg font-extrabold text-slate-800">
                    {editingId ? "প্রবেশপত্র টেমপ্লেট সম্পাদনা" : "প্রবেশপত্র ডিজাইন স্টুডিও"}
                  </h2>
                  <p className="text-xs text-slate-500">লাইভ রেন্ডারিংসহ সকল সেটিংস কাস্টমাইজ করুন</p>
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
                  <label className="text-xs font-bold text-slate-700 block mb-2">১. নকশা প্রিসেট (১২টি)</label>
                  <div className="grid grid-cols-2 gap-2 max-h-48 overflow-y-auto pr-1">
                    {ADMIT_CARD_PRESETS.map((p) => (
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
                        </div>
                        <p className="text-[11px] font-bold text-slate-800 line-clamp-1">{p.name}</p>
                      </button>
                    ))}
                  </div>
                </div>

                <div className="space-y-3">
                  <div>
                    <label className="text-xs font-bold text-slate-700 block mb-1">টেমপ্লেটের নাম *</label>
                    <input
                      type="text"
                      required
                      value={formData.name}
                      onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                      className="w-full px-3.5 py-2 bg-slate-50 border border-slate-200 rounded-xl text-sm font-semibold outline-none focus:border-[#1C7D5A]"
                    />
                  </div>
                  <div className="grid grid-cols-2 gap-3">
                    <div>
                      <label className="text-xs font-bold text-slate-700 block mb-1">কার্ড শিরোনাম</label>
                      <input
                        type="text"
                        value={formData.title}
                        onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                        className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs font-semibold outline-none focus:border-[#1C7D5A]"
                      />
                    </div>
                    <div>
                      <label className="text-xs font-bold text-slate-700 block mb-1">আরবি শিরোনাম</label>
                      <input
                        type="text"
                        value={formData.arabic_title}
                        onChange={(e) => setFormData({ ...formData, arabic_title: e.target.value })}
                        className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs font-semibold outline-none focus:border-[#1C7D5A]"
                      />
                    </div>
                  </div>
                </div>

                <div className="grid grid-cols-3 gap-2">
                  {[
                    { key: "primary_color", label: "প্রাইমারি" },
                    { key: "accent_color", label: "গোল্ড" },
                    { key: "paper_bg", label: "পেপার" },
                  ].map((c) => (
                    <div key={c.key} className="bg-slate-50 border border-slate-200 rounded-xl p-2 flex items-center gap-2">
                      <input
                        type="color"
                        value={formData[c.key] || "#123628"}
                        onChange={(e) => setFormData({ ...formData, [c.key]: e.target.value })}
                        className="w-7 h-7 rounded cursor-pointer border-0 bg-transparent"
                      />
                      <span className="text-[10px] font-bold text-slate-600">{c.label}</span>
                    </div>
                  ))}
                </div>

                <div className="grid grid-cols-2 gap-2">
                  {[
                    { key: "show_photo", label: "শিক্ষার্থীর ছবি" },
                    { key: "show_subject_table", label: "রুটিন টেবিল" },
                    { key: "show_room_no", label: "হল/কক্ষ নং" },
                    { key: "show_seat_no", label: "সিট নম্বর" },
                    { key: "show_qr", label: "QR যাচাই কোড" },
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

                {/* Instructions */}
                <div>
                  <div className="flex items-center justify-between mb-2">
                    <label className="text-xs font-bold text-slate-700">পরীক্ষার্থীর নির্দেশাবলি</label>
                    <button
                      type="button"
                      onClick={() => setFormData({ ...formData, instructions: [...formData.instructions, ""] })}
                      className="px-2.5 py-1 bg-slate-900 text-white rounded-lg text-[10px] font-bold cursor-pointer"
                    >
                      + নির্দেশনা যোগ করুন
                    </button>
                  </div>
                  <div className="space-y-2">
                    {formData.instructions.map((inst, idx) => (
                      <div key={idx} className="flex gap-2">
                        <input
                          type="text"
                          value={inst}
                          onChange={(e) => handleInstructionChange(idx, e.target.value)}
                          className="flex-1 px-3 py-1.5 bg-slate-50 border border-slate-200 rounded-lg text-xs font-medium outline-none focus:border-[#1C7D5A]"
                        />
                        <button
                          type="button"
                          onClick={() =>
                            setFormData({
                              ...formData,
                              instructions: formData.instructions.filter((_, i) => i !== idx),
                            })
                          }
                          className="p-1.5 text-rose-500 hover:bg-rose-50 rounded-lg cursor-pointer"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    ))}
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="text-xs font-bold text-slate-700 block mb-1">বাম স্বাক্ষর পদবী</label>
                    <input
                      type="text"
                      value={formData.left_sign_label}
                      onChange={(e) => setFormData({ ...formData, left_sign_label: e.target.value })}
                      className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs font-semibold outline-none"
                    />
                  </div>
                  <div>
                    <label className="text-xs font-bold text-slate-700 block mb-1">ডান স্বাক্ষর পদবী</label>
                    <input
                      type="text"
                      value={formData.right_sign_label}
                      onChange={(e) => setFormData({ ...formData, right_sign_label: e.target.value })}
                      className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs font-semibold outline-none"
                    />
                  </div>
                </div>
              </div>

              {/* Right Live Preview */}
              <div className="lg:col-span-7 bg-slate-100 p-6 flex flex-col justify-between gap-4">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-extrabold uppercase tracking-wider text-slate-500 flex items-center gap-2">
                    <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
                    লাইভ প্রবেশপত্র প্রিভিউ
                  </span>
                </div>

                <div className="flex-1 flex items-center justify-center overflow-y-auto py-2">
                  <div className="w-full max-w-[640px]">
                    <AdmitCardRenderer
                      template={formData}
                      student={SAMPLE_STUDENT}
                      exam={{ name: "বার্ষিক পরীক্ষা ২০২৬" }}
                      madrasa={madrasa}
                    />
                  </div>
                </div>

                <div className="flex justify-end gap-3 pt-4 border-t border-slate-200">
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
            <h3 className="text-lg font-extrabold text-slate-800">প্রবেশপত্র টেমপ্লেট মুছবেন?</h3>
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

export default AdmitCardTemplate;
