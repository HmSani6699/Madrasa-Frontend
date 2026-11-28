import { useState, useEffect, useMemo } from "react";
import {
  Briefcase,
  Search,
  Printer,
  Eye,
  X,
  Check,
  CreditCard,
  Loader2,
  User,
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

const EmployeeIdCard = () => {
  const { currentMadrasa } = useAuth();
  const { settings } = usePortalSettings();
  const madrasa = useMemo(() => getMadrasaBranding(currentMadrasa, settings), [currentMadrasa, settings]);

  const [employees, setEmployees] = useState([]);
  const [templates, setTemplates] = useState([]);
  const [loading, setLoading] = useState(true);

  const [selectedDept, setSelectedDept] = useState("all");
  const [selectedDesig, setSelectedDesig] = useState("all");
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedTemplateId, setSelectedTemplateId] = useState("");
  const [presetOverride, setPresetOverride] = useState("");

  const [selectedIds, setSelectedIds] = useState([]);
  const [isPreviewOpen, setIsPreviewOpen] = useState(false);
  const [previewSide, setPreviewSide] = useState("front");

  useEffect(() => {
    const loadInitial = async () => {
      setLoading(true);
      try {
        const [staffRes, tplRes] = await Promise.all([
          printStudioService.getStaffCardsData(),
          printStudioService.getTemplates({ category: "id_card", target_type: "employee" }),
        ]);
        if (staffRes?.success) setEmployees(staffRes.data || []);

        const combined = [
          ...(tplRes?.data || []),
          ...DEFAULT_ID_TEMPLATES.filter((t) => t.target_type === "employee"),
          ...DEFAULT_ID_TEMPLATES.filter((t) => t.target_type === "student"),
        ];
        setTemplates(combined);
        const def =
          combined.find((t) => t.target_type === "employee" && t.is_default) ||
          combined.find((t) => t.target_type === "employee") ||
          combined[0];
        if (def) setSelectedTemplateId(def._id);
      } catch (err) {
        console.error("Failed loading staff ID card data:", err);
        toast.error("শিক্ষক ও কর্মীদের তথ্য লোড করা যায়নি");
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
        (e.phone || "").toLowerCase().includes(q) ||
        (e.designation || "").toLowerCase().includes(q);
      return matchDept && matchDesig && matchSearch;
    });
  }, [employees, selectedDept, selectedDesig, searchTerm]);

  const activeTemplate = useMemo(() => {
    const base =
      templates.find((t) => t._id === selectedTemplateId) ||
      DEFAULT_ID_TEMPLATES.find((t) => t.target_type === "employee") ||
      DEFAULT_ID_TEMPLATES[0];
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

  const selectedObjs = useMemo(
    () => employees.filter((e) => selectedIds.includes(e._id)),
    [employees, selectedIds]
  );

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

  const openSinglePreview = (emp, e) => {
    e.stopPropagation();
    setSelectedIds([emp._id]);
    setIsPreviewOpen(true);
  };

  const handlePrint = () => {
    try {
      const isHoriz = activeTemplate.layout === "horizontal";
      printHtmlElement({
        elementId: "printable-staff-id-sheet",
        title: `Staff ID Cards - ${madrasa.name}`,
        orientation: isHoriz && previewSide === "both" ? "landscape" : "portrait",
        marginMm: 6,
      });
    } catch (err) {
      toast.error(err.message || "প্রিন্ট শুরু করা যায়নি");
    }
  };

  const isHorizontal = activeTemplate.layout === "horizontal";
  const cardsPerPage = previewSide === "both" ? 4 : isHorizontal ? 8 : 9;

  const pages = useMemo(() => {
    const chunks = [];
    for (let i = 0; i < selectedObjs.length; i += cardsPerPage) {
      chunks.push(selectedObjs.slice(i, i + cardsPerPage));
    }
    return chunks;
  }, [selectedObjs, cardsPerPage]);

  return (
    <div className="p-4 md:p-6 max-w-[1600px] mx-auto space-y-6 animate-fade-in">
      {/* Header */}
      <div className="bg-white rounded-2xl border border-slate-200/80 p-5 md:p-6 shadow-sm flex flex-col lg:flex-row lg:items-center justify-between gap-4">
        <div className="flex items-center gap-4">
          <div className="w-12 h-12 rounded-xl bg-[#123628] text-[#EAB33C] flex items-center justify-center shrink-0">
            <Briefcase className="w-6 h-6" />
          </div>
          <div>
            <h1 className="text-xl md:text-2xl font-extrabold text-slate-800">
              শিক্ষক ও কর্মী আইডি কার্ড (Employee ID Cards)
            </h1>
            <p className="text-xs md:text-sm text-slate-500 mt-0.5">
              সকল উস্তাদ, মুহতামিম ও অফিস স্টাফদের জন্য কর্পোরেট ও ইসলামিক আইডি কার্ড তৈরি ও প্রিন্ট করুন
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

      {/* Filters */}
      <div className="bg-white rounded-2xl border border-slate-200/80 p-5 shadow-sm grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4">
        <div>
          <label className="text-xs font-bold text-slate-600 block mb-1">বিভাগ (Department)</label>
          <select
            value={selectedDept}
            onChange={(e) => setSelectedDept(e.target.value)}
            className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm font-semibold outline-none focus:border-[#1C7D5A]"
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
          <label className="text-xs font-bold text-slate-600 block mb-1">পদবী (Designation)</label>
          <select
            value={selectedDesig}
            onChange={(e) => setSelectedDesig(e.target.value)}
            className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm font-semibold outline-none focus:border-[#1C7D5A]"
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
          <label className="text-xs font-bold text-slate-600 block mb-1">কর্মী খুঁজুন</label>
          <div className="relative">
            <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              placeholder="নাম বা এমপ্লয়ি আইডি..."
              className="w-full pl-9 pr-3 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm font-semibold outline-none focus:border-[#1C7D5A]"
            />
          </div>
        </div>
      </div>

      {/* Staff Table */}
      <div className="bg-white rounded-2xl border border-slate-200/80 shadow-sm overflow-hidden">
        <div className="px-5 py-4 border-b border-slate-200 flex flex-wrap items-center justify-between gap-3 bg-slate-50/60">
          <div className="flex items-center gap-2.5">
            <CreditCard className="w-5 h-5 text-[#1C7D5A]" />
            <h3 className="text-base font-extrabold text-slate-800">
              শিক্ষক ও কর্মী তালিকা ({toBanglaDigits(filteredEmployees.length)} জন)
            </h3>
          </div>
          <button
            onClick={toggleSelectAll}
            className="px-4 py-2 bg-white border border-slate-200 hover:border-[#1C7D5A] text-slate-700 hover:text-[#1C7D5A] rounded-xl text-xs font-bold transition-colors cursor-pointer"
          >
            {filteredEmployees.length > 0 && filteredEmployees.every((e) => selectedIds.includes(e._id))
              ? "সব নির্বাচন বাতিল করুন"
              : "সবাইকে নির্বাচন করুন"}
          </button>
        </div>

        {loading ? (
          <div className="p-16 flex flex-col items-center justify-center gap-3">
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
                  <th className="py-3.5 px-4">মোবাইল</th>
                  <th className="py-3.5 px-4">রক্ত</th>
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
                            {emp.photo ? (
                              <img src={emp.photo} alt="" className="w-full h-full object-cover" />
                            ) : (
                              <User className="w-5 h-5 text-slate-300" />
                            )}
                          </div>
                          <div>
                            <p className="font-bold text-slate-800">{emp.name}</p>
                            <p className="text-[11px] text-slate-400 uppercase">{emp.role}</p>
                          </div>
                        </div>
                      </td>
                      <td className="py-3 px-4 font-mono text-xs font-bold text-slate-700">{emp.employeeID}</td>
                      <td className="py-3 px-4">
                        <span className="font-bold text-[#1C7D5A]">{emp.designation}</span>
                        <span className="text-xs text-slate-400 block">{emp.department}</span>
                      </td>
                      <td className="py-3 px-4 text-xs font-semibold text-slate-700">
                        {toBanglaDigits(emp.phone || "—")}
                      </td>
                      <td className="py-3 px-4">
                        {emp.bloodGroup ? (
                          <span className="px-2 py-0.5 rounded-full bg-rose-50 text-rose-700 text-xs font-bold border border-rose-200">
                            {emp.bloodGroup}
                          </span>
                        ) : (
                          "—"
                        )}
                      </td>
                      <td className="py-3 px-4 text-right">
                        <button
                          onClick={(e) => openSinglePreview(emp, e)}
                          className="px-3 py-1.5 bg-slate-100 hover:bg-[#1C7D5A] text-slate-700 hover:text-white rounded-lg text-xs font-bold transition-colors inline-flex items-center gap-1 cursor-pointer"
                        >
                          <Eye className="w-3.5 h-3.5" /> দেখুন
                        </button>
                      </td>
                    </tr>
                  );
                })}
                {filteredEmployees.length === 0 && (
                  <tr>
                    <td colSpan={7} className="py-16 text-center text-slate-400 font-bold">
                      কোনো কর্মী বা শিক্ষক পাওয়া যায়নি
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
                    কর্মী আইডি কার্ড প্রিন্ট প্রিভিউ ({toBanglaDigits(selectedObjs.length)}টি কার্ড • {toBanglaDigits(pages.length)} A4 পাতা)
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
              <div id="printable-staff-id-sheet" className="space-y-8">
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
                      {pageCards.map((emp) => (
                        <div key={emp._id} className="p-1 border border-dashed border-slate-300 rounded-2xl avoid-break">
                          <IdCardRenderer
                            template={activeTemplate}
                            person={emp}
                            madrasa={madrasa}
                            targetType="employee"
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

export default EmployeeIdCard;
