import { useState, useEffect, useRef } from "react";
import { useTranslation } from "react-i18next";
import { Link } from "react-router-dom";
import {
  MessageSquare,
  Save,
  Wallet,
  RotateCcw,
  Loader2,
  AlertTriangle,
  CalendarCheck,
  UserPlus,
  CreditCard,
  ArrowUpRight,
  Smartphone,
  Info,
} from "lucide-react";
import { toast } from "react-hot-toast";
import { usePortalSettings } from "../../../context/PortalSettingsContext";
import { useAuth } from "../../../context/AuthContext";
import portalService from "../../../services/portalService";
import SettingsPageHeader from "./SettingsPageHeader";

const DEFAULT_TEMPLATES = {
  Absent:
    "আসসালামু আলাইকুম। {student_name} আজ ({date}) {madrasa_name}-এ অনুপস্থিত রয়েছে।",
  Late: "আসসালামু আলাইকুম। {student_name} আজ ({date}) {madrasa_name}-এ দেরিতে উপস্থিত হয়েছে।",
  Present:
    "আসসালামু আলাইকুম। {student_name} আজ ({date}) {madrasa_name}-এ উপস্থিত হয়েছে।",
};

const TEMPLATE_VARIABLES = ["{student_name}", "{date}", "{madrasa_name}"];

const countSmsParts = (text = "") => {
  if (!text) return { chars: 0, parts: 0 };
  const isUnicode = Array.from(text).some((ch) => ch.charCodeAt(0) > 127);
  const perPart = isUnicode ? 70 : 160;
  return {
    chars: text.length,
    parts: Math.max(1, Math.ceil(text.length / perPart)),
  };
};

const SmsSettingsPage = () => {
  const { settings, updateSettings } = usePortalSettings();
  const { t } = useTranslation();
  const { currentMadrasa } = useAuth();

  const [smsLoading, setSmsLoading] = useState(true);
  const [smsSaving, setSmsSaving] = useState(false);
  const [hasUnsavedTemplates, setHasUnsavedTemplates] = useState(false);
  const [smsBalance, setSmsBalance] = useState(0);
  const [smsRates, setSmsRates] = useState({
    single: 0.3,
    bulk: 0.25,
    masking: 0.4,
  });
  const [defaultTemplates, setDefaultTemplates] = useState(DEFAULT_TEMPLATES);
  const [smsConfig, setSmsConfig] = useState({
    admission: false,
    fees: false,
    attendance: false,
    attendanceTrigger: "absent_only",
    attendanceTemplates: { ...DEFAULT_TEMPLATES },
  });

  const [activeTemplateField, setActiveTemplateField] = useState("Absent");
  const textareaRef = useRef(null);

  useEffect(() => {
    const loadSmsSettings = async () => {
      try {
        setSmsLoading(true);
        const res = await portalService.getSmsSettings();
        if (res?.success && res?.data?.settings) {
          const loaded = res.data.settings;
          setSmsConfig({
            ...loaded,
            attendanceTemplates: {
              ...DEFAULT_TEMPLATES,
              ...(loaded.attendanceTemplates || {}),
            },
          });
          setSmsBalance(Number(res.data.balance || 0));
          if (res.data.rates) setSmsRates(res.data.rates);
          if (res.data.defaultTemplates) {
            setDefaultTemplates(res.data.defaultTemplates);
          }
        }
      } catch (err) {
        console.error("Failed to load SMS settings from backend", err);
        toast.error("SMS সেটিংস লোড করা যায়নি");
      } finally {
        setSmsLoading(false);
      }
    };
    loadSmsSettings();
  }, []);

  const persistSmsConfig = async (nextConfig, showToast = true) => {
    try {
      setSmsSaving(true);
      const res = await portalService.updateSmsSettings({
        admission: Boolean(nextConfig.admission),
        fees: Boolean(nextConfig.fees),
        attendance: Boolean(nextConfig.attendance),
        attendanceTrigger: nextConfig.attendanceTrigger || "absent_only",
        attendanceTemplates: nextConfig.attendanceTemplates,
      });
      if (res?.success) {
        updateSettings({
          ...settings,
          sms: {
            admission: nextConfig.admission,
            fees: nextConfig.fees,
            attendance: nextConfig.attendance,
          },
        });
        setHasUnsavedTemplates(false);
        if (showToast) toast.success("SMS সেটিংস সংরক্ষণ করা হয়েছে");
      }
    } catch (err) {
      toast.error(err.response?.data?.message || "SMS সেটিংস সেভ করা যায়নি");
    } finally {
      setSmsSaving(false);
    }
  };

  const handleSmsToggle = (key) => {
    const nextConfig = {
      ...smsConfig,
      [key]: !smsConfig[key],
    };
    setSmsConfig(nextConfig);
    persistSmsConfig(nextConfig, true);
  };

  const handleTriggerChange = (trigger) => {
    const nextConfig = {
      ...smsConfig,
      attendanceTrigger: trigger,
    };
    setSmsConfig(nextConfig);
    persistSmsConfig(nextConfig, true);
  };

  const handleTemplateChange = (statusKey, value) => {
    setHasUnsavedTemplates(true);
    setSmsConfig((prev) => ({
      ...prev,
      attendanceTemplates: {
        ...prev.attendanceTemplates,
        [statusKey]: value,
      },
    }));
  };

  const handleInsertVariable = (variable, targetKey) => {
    const el = textareaRef.current;
    const currentText = smsConfig.attendanceTemplates?.[targetKey] || "";

    if (el && typeof el.selectionStart === "number") {
      const start = el.selectionStart;
      const end = el.selectionEnd;
      const nextValue =
        currentText.slice(0, start) + variable + currentText.slice(end);
      handleTemplateChange(targetKey, nextValue);
      requestAnimationFrame(() => {
        el.focus();
        const pos = start + variable.length;
        el.setSelectionRange(pos, pos);
      });
    } else {
      const separator = currentText && !currentText.endsWith(" ") ? " " : "";
      handleTemplateChange(targetKey, `${currentText}${separator}${variable}`);
    }
  };

  const handleResetTemplates = () => {
    const nextConfig = {
      ...smsConfig,
      attendanceTemplates: { ...defaultTemplates },
    };
    setSmsConfig(nextConfig);
    persistSmsConfig(nextConfig, true);
  };

  const formatPreview = (templateText = "") => {
    const madrasaName =
      currentMadrasa?.name || settings?.profile?.institutionName || "মাদ্রাসা";
    const todayStr = new Date().toLocaleDateString("bn-BD", {
      day: "numeric",
      month: "short",
      year: "numeric",
    });
    return templateText
      .replaceAll("{student_name}", "আবদুল্লাহ আল মামুন")
      .replaceAll("{date}", todayStr)
      .replaceAll("{madrasa_name}", madrasaName);
  };

  const triggerCards = [
    {
      key: "attendance",
      label: t("settings_page.attendance_sms"),
      description: t("settings_page.attendance_sms_desc"),
      icon: CalendarCheck,
    },
    {
      key: "admission",
      label: t("settings_page.admission_sms"),
      description: t("settings_page.admission_sms_desc"),
      icon: UserPlus,
    },
    {
      key: "fees",
      label: t("settings_page.fees_sms"),
      description: t("settings_page.fees_sms_desc"),
      icon: CreditCard,
    },
  ];

  const triggerOptions = [
    {
      id: "absent_only",
      title: "শুধু অনুপস্থিত (Absent)",
      badge: "প্রস্তাবিত",
      desc: "শুধু অনুপস্থিত থাকলে SMS যাবে — খরচ সবচেয়ে কম",
    },
    {
      id: "absent_late",
      title: "অনুপস্থিত ও বিলম্ব (Absent + Late)",
      desc: "অনুপস্থিত বা দেরিতে এলে অভিভাবক বার্তা পাবেন",
    },
    {
      id: "all",
      title: "সব স্ট্যাটাস (Present + Absent + Late)",
      desc: "উপস্থিত, অনুপস্থিত ও বিলম্ব — সব ক্ষেত্রেই SMS যাবে",
    },
  ];

  const templateFields = [
    {
      key: "Absent",
      label: "অনুপস্থিত (Absent)",
      dotClass: "bg-rose-500",
      visible: true,
    },
    {
      key: "Late",
      label: "বিলম্ব (Late)",
      dotClass: "bg-amber-500",
      visible:
        smsConfig.attendanceTrigger === "absent_late" ||
        smsConfig.attendanceTrigger === "all",
    },
    {
      key: "Present",
      label: "উপস্থিত (Present)",
      dotClass: "bg-emerald-500",
      visible: smsConfig.attendanceTrigger === "all",
    },
  ].filter((item) => item.visible);

  const currentField =
    templateFields.find((f) => f.key === activeTemplateField) ||
    templateFields[0];
  const currentTemplateText =
    smsConfig.attendanceTemplates?.[currentField.key] || "";
  const currentStats = countSmsParts(currentTemplateText);
  const activeCount = [
    smsConfig.attendance,
    smsConfig.admission,
    smsConfig.fees,
  ].filter(Boolean).length;

  return (
    <div className="p-4 md:p-6 max-w-6xl mx-auto space-y-5 animate-fade-in">
      <SettingsPageHeader
        title={t("settings_page.sms_trigger_mgmt")}
        subtitle={t("settings_page.sms_trigger_desc")}
        icon={MessageSquare}
        rightActions={
          <>
            <Link
              to="/admin/sms-portal"
              className="flex items-center gap-2.5 px-3.5 py-2 rounded-xl bg-slate-50 border border-slate-200/90 hover:bg-emerald-50/70 hover:border-[#1C7D5A]/40 transition-colors"
            >
              <Wallet className="w-4 h-4 text-[#1C7D5A]" />
              <div className="text-left">
                <p className="text-[10px] font-semibold text-slate-500 leading-none">
                  SMS ওয়ালেট
                </p>
                <p className="text-sm font-bold text-slate-800 leading-tight mt-0.5">
                  ৳ {smsBalance.toFixed(2)}
                  <span className="text-[11px] font-normal text-slate-500 ml-1">
                    (৳{smsRates.single}/SMS)
                  </span>
                </p>
              </div>
              <ArrowUpRight className="w-3.5 h-3.5 text-slate-400" />
            </Link>

            <button
              type="button"
              onClick={() => persistSmsConfig(smsConfig, true)}
              disabled={smsSaving || smsLoading}
              className="flex items-center gap-2 px-4 py-2.5 bg-[#1C7D5A] hover:bg-[#123628] text-white text-sm font-semibold rounded-xl shadow-xs transition-all active:scale-95 disabled:opacity-60 cursor-pointer"
            >
              {smsSaving ? (
                <Loader2 className="w-4 h-4 animate-spin" />
              ) : (
                <Save className="w-4 h-4" />
              )}
              {smsSaving ? "সেভ হচ্ছে..." : t("common.save_changes")}
            </button>
          </>
        }
      />

      {smsLoading ? (
        <div className="bg-white rounded-2xl border border-slate-200/80 p-16 flex flex-col items-center justify-center gap-3 text-slate-500">
          <Loader2 className="w-6 h-6 animate-spin text-[#1C7D5A]" />
          <p className="text-sm font-medium">SMS সেটিংস লোড হচ্ছে...</p>
        </div>
      ) : (
        <>
          {smsConfig.attendance && smsBalance < smsRates.single && (
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 px-4 py-3 rounded-xl bg-amber-50/80 border border-amber-200/80 text-amber-900">
              <div className="flex items-center gap-2.5 text-xs md:text-sm font-medium">
                <AlertTriangle className="w-4 h-4 shrink-0 text-amber-600" />
                <span>
                  SMS ওয়ালেটে পর্যাপ্ত ব্যালেন্স নেই (বর্তমান: ৳
                  {smsBalance.toFixed(2)})। রিচার্জ না করা পর্যন্ত অটো-এসএমএস স্থগিত থাকবে।
                </span>
              </div>
              <Link
                to="/admin/sms-portal"
                className="inline-flex items-center gap-1 px-3 py-1.5 rounded-lg bg-amber-600 hover:bg-amber-700 text-white text-xs font-semibold shrink-0 transition-colors self-start sm:self-center"
              >
                রিচার্জ করুন
                <ArrowUpRight className="w-3.5 h-3.5" />
              </Link>
            </div>
          )}

          {/* Section 1: Automated SMS Triggers */}
          <section className="bg-white rounded-2xl border border-slate-200/80 shadow-xs overflow-hidden">
            <div className="px-5 py-4 md:px-6 border-b border-slate-100 flex items-center justify-between gap-3">
              <div>
                <h2 className="text-base font-bold text-slate-800">
                  স্বয়ংক্রিয় SMS ট্রিগার
                </h2>
                <p className="text-xs text-slate-500 mt-0.5">
                  কোন কোন কার্যক্রমে অভিভাবকের কাছে স্বয়ংক্রিয়ভাবে SMS যাবে তা নির্বাচন করুন
                </p>
              </div>
              <span className="text-xs font-semibold px-2.5 py-1 rounded-full bg-slate-100 text-slate-600 shrink-0">
                {activeCount} / 3 সক্রিয়
              </span>
            </div>

            <div className="p-5 md:p-6 grid grid-cols-1 md:grid-cols-3 gap-4">
              {triggerCards.map((item) => {
                const enabled = Boolean(smsConfig[item.key]);
                const IconComp = item.icon;
                return (
                  <div
                    key={item.key}
                    onClick={() => handleSmsToggle(item.key)}
                    role="switch"
                    aria-checked={enabled}
                    tabIndex={0}
                    onKeyDown={(e) => {
                      if (e.key === "Enter" || e.key === " ") {
                        e.preventDefault();
                        handleSmsToggle(item.key);
                      }
                    }}
                    className={`p-4 rounded-xl border transition-all cursor-pointer flex flex-col justify-between gap-4 select-none ${
                      enabled
                        ? "bg-white border-[#1C7D5A]/50 ring-1 ring-[#1C7D5A]/15"
                        : "bg-slate-50/50 border-slate-200/80 hover:bg-white hover:border-slate-300"
                    }`}
                  >
                    <div className="flex items-center justify-between gap-3">
                      <div
                        className={`w-9 h-9 rounded-lg flex items-center justify-center shrink-0 transition-colors ${
                          enabled
                            ? "bg-emerald-50 text-[#1C7D5A]"
                            : "bg-slate-100 text-slate-500"
                        }`}
                      >
                        <IconComp className="w-[18px] h-[18px]" />
                      </div>

                      <div
                        className={`w-11 h-6 shrink-0 rounded-full relative transition-colors duration-200 ${
                          enabled ? "bg-[#1C7D5A]" : "bg-slate-200"
                        }`}
                      >
                        <div
                          className={`absolute top-0.5 left-0.5 w-5 h-5 bg-white rounded-full shadow-xs transition-transform duration-200 ${
                            enabled ? "translate-x-5" : "translate-x-0"
                          }`}
                        />
                      </div>
                    </div>

                    <div>
                      <h3 className="text-sm font-bold text-slate-800">
                        {item.label}
                      </h3>
                      <p className="text-xs text-slate-500 mt-1 leading-relaxed">
                        {item.description}
                      </p>
                    </div>
                  </div>
                );
              })}
            </div>
          </section>

          {/* Section 2: Attendance SMS Rules & Templates */}
          <section className="bg-white rounded-2xl border border-slate-200/80 shadow-xs overflow-hidden">
            <div className="px-5 py-4 md:px-6 border-b border-slate-100 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
              <div>
                <div className="flex flex-wrap items-center gap-2">
                  <h2 className="text-base font-bold text-slate-800">
                    উপস্থিতি অটো-SMS রুল ও টেমপ্লেট
                  </h2>
                  {!smsConfig.attendance && (
                    <span className="text-[11px] font-semibold px-2 py-0.5 rounded-full bg-slate-100 text-slate-500">
                      বর্তমানে নিষ্ক্রিয়
                    </span>
                  )}
                </div>
                <p className="text-xs text-slate-500 mt-0.5">
                  হাজিরার কোন অবস্থায় SMS যাবে এবং মেসেজের ধরন কেমন হবে তা নির্ধারণ করুন
                </p>
              </div>

              <button
                type="button"
                onClick={handleResetTemplates}
                disabled={smsSaving}
                className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg border border-slate-200 bg-white hover:bg-slate-50 text-xs font-semibold text-slate-600 transition-colors cursor-pointer self-start sm:self-center disabled:opacity-50"
              >
                <RotateCcw className="w-3.5 h-3.5" />
                ডিফল্ট টেমপ্লেট
              </button>
            </div>

            <div className="p-5 md:p-6 space-y-6">
              {/* Trigger Mode Selector */}
              <div className="space-y-2.5">
                <label className="text-xs font-bold text-slate-600 block">
                  মেসেজ পাঠানোর শর্ত
                </label>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
                  {triggerOptions.map((opt) => {
                    const selected = smsConfig.attendanceTrigger === opt.id;
                    return (
                      <button
                        key={opt.id}
                        type="button"
                        onClick={() => handleTriggerChange(opt.id)}
                        className={`text-left p-3.5 rounded-xl border transition-all cursor-pointer flex items-start gap-3 ${
                          selected
                            ? "border-[#1C7D5A] bg-emerald-50/25 ring-1 ring-[#1C7D5A]/15"
                            : "border-slate-200 bg-white hover:border-slate-300"
                        }`}
                      >
                        <span
                          className={`mt-0.5 w-4 h-4 rounded-full border flex items-center justify-center shrink-0 transition-colors ${
                            selected
                              ? "border-[#1C7D5A] bg-[#1C7D5A]"
                              : "border-slate-300 bg-white"
                          }`}
                        >
                          {selected && (
                            <span className="w-1.5 h-1.5 rounded-full bg-white" />
                          )}
                        </span>

                        <div className="min-w-0 flex-1">
                          <div className="flex flex-wrap items-center gap-1.5">
                            <span
                              className={`text-xs font-bold ${
                                selected ? "text-[#1C7D5A]" : "text-slate-800"
                              }`}
                            >
                              {opt.title}
                            </span>
                            {opt.badge && (
                              <span className="text-[10px] font-bold px-1.5 py-0.5 rounded-md bg-amber-100/80 text-amber-800">
                                {opt.badge}
                              </span>
                            )}
                          </div>
                          <p className="text-[11px] text-slate-500 mt-1 leading-relaxed">
                            {opt.desc}
                          </p>
                        </div>
                      </button>
                    );
                  })}
                </div>
              </div>

              {/* Template Editor + Live Preview */}
              <div className="pt-5 border-t border-slate-100 space-y-4">
                <div className="flex flex-wrap items-center justify-between gap-3">
                  {templateFields.length > 1 ? (
                    <div className="inline-flex flex-wrap items-center gap-1 p-1 rounded-xl bg-slate-100/80 border border-slate-200/60">
                      {templateFields.map((field) => {
                        const isActive = currentField.key === field.key;
                        return (
                          <button
                            key={field.key}
                            type="button"
                            onClick={() => setActiveTemplateField(field.key)}
                            className={`inline-flex items-center gap-2 px-3 py-1.5 rounded-lg text-xs font-semibold transition-all cursor-pointer ${
                              isActive
                                ? "bg-white text-slate-800 shadow-xs"
                                : "text-slate-500 hover:text-slate-700"
                            }`}
                          >
                            <span
                              className={`w-1.5 h-1.5 rounded-full ${field.dotClass}`}
                            />
                            {field.label}
                          </button>
                        );
                      })}
                    </div>
                  ) : (
                    <div className="inline-flex items-center gap-2 text-xs font-bold text-slate-700">
                      <span
                        className={`w-2 h-2 rounded-full ${currentField.dotClass}`}
                      />
                      {currentField.label} টেমপ্লেট
                    </div>
                  )}

                  <span className="text-xs font-medium text-slate-500">
                    {currentStats.chars} অক্ষর •{" "}
                    <strong className="text-slate-700">
                      {currentStats.parts} SMS পার্ট
                    </strong>
                  </span>
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-12 gap-5 items-stretch">
                  {/* Editor */}
                  <div className="lg:col-span-7 flex flex-col gap-3">
                    <textarea
                      ref={textareaRef}
                      rows={4}
                      value={currentTemplateText}
                      onChange={(e) =>
                        handleTemplateChange(currentField.key, e.target.value)
                      }
                      className="w-full flex-1 px-4 py-3 bg-white border border-slate-200 rounded-xl text-sm text-slate-800 leading-relaxed outline-none focus:border-[#1C7D5A] focus:ring-2 focus:ring-[#1C7D5A]/15 transition-all resize-none"
                      placeholder="মেসেজ টেমপ্লেট লিখুন..."
                    />

                    <div className="flex flex-wrap items-center gap-2">
                      <span className="text-[11px] font-semibold text-slate-500 mr-0.5">
                        ভ্যারিয়েবল যুক্ত করুন:
                      </span>
                      {TEMPLATE_VARIABLES.map((v) => (
                        <button
                          key={v}
                          type="button"
                          onClick={() =>
                            handleInsertVariable(v, currentField.key)
                          }
                          className="px-2.5 py-1 rounded-lg bg-slate-50 hover:bg-emerald-50 border border-slate-200/90 hover:border-[#1C7D5A]/40 text-[11px] font-mono font-semibold text-slate-600 hover:text-[#1C7D5A] transition-colors cursor-pointer"
                        >
                          + {v}
                        </button>
                      ))}
                    </div>
                  </div>

                  {/* Live Preview */}
                  <div className="lg:col-span-5 rounded-xl bg-slate-50/70 border border-slate-200/80 p-4 flex flex-col justify-between gap-3">
                    <div className="space-y-2.5">
                      <div className="flex items-center justify-between text-[11px] font-semibold text-slate-500">
                        <span className="inline-flex items-center gap-1.5">
                          <Smartphone className="w-3.5 h-3.5 text-[#1C7D5A]" />
                          লাইভ SMS প্রিভিউ
                        </span>
                        <span className="text-slate-400">
                          {currentField.key}
                        </span>
                      </div>

                      <div className="bg-white border border-slate-200/80 rounded-2xl rounded-tl-sm px-3.5 py-3 text-[13px] text-slate-700 leading-relaxed shadow-2xs">
                        {formatPreview(currentTemplateText) || (
                          <span className="text-slate-400 italic">
                            খালি টেমপ্লেট
                          </span>
                        )}
                      </div>
                    </div>

                    <p className="flex items-center gap-1.5 text-[11px] text-slate-500">
                      <Info className="w-3.5 h-3.5 text-slate-400 shrink-0" />
                      একই দিনে একই শিক্ষার্থীকে দুবার অটো-SMS পাঠানো হয় না।
                    </p>
                  </div>
                </div>
              </div>
            </div>

            <div className="px-5 py-3.5 md:px-6 bg-slate-50/60 border-t border-slate-100 flex flex-wrap items-center justify-between gap-3">
              <span className="text-xs text-slate-500">
                {hasUnsavedTemplates ? (
                  <span className="inline-flex items-center gap-1.5 font-semibold text-amber-700">
                    <span className="w-1.5 h-1.5 rounded-full bg-amber-500" />
                    টেমপ্লেটে অসংরক্ষিত পরিবর্তন রয়েছে
                  </span>
                ) : (
                  "সকল ট্রিগার পরিবর্তন স্বয়ংক্রিয়ভাবে সংরক্ষিত হয়"
                )}
              </span>

              <button
                type="button"
                onClick={() => persistSmsConfig(smsConfig, true)}
                disabled={smsSaving}
                className="px-5 py-2 bg-[#1C7D5A] hover:bg-[#123628] text-white text-sm font-semibold rounded-xl shadow-xs transition-all flex items-center gap-2 disabled:opacity-60 cursor-pointer"
              >
                {smsSaving ? (
                  <Loader2 className="w-4 h-4 animate-spin" />
                ) : (
                  <Save className="w-4 h-4" />
                )}
                SMS সেটিংস সেভ করুন
              </button>
            </div>
          </section>
        </>
      )}
    </div>
  );
};

export default SmsSettingsPage;
