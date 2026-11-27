import { useState, useEffect } from "react";
import { useTranslation } from "react-i18next";
import { Link } from "react-router-dom";
import {
  Building2,
  User,
  Briefcase,
  Phone,
  Mail,
  MapPin,
  Globe,
  Save,
  RotateCcw,
  ExternalLink,
  CheckCircle2,
} from "lucide-react";
import { toast } from "react-hot-toast";
import { usePortalSettings } from "../../../context/PortalSettingsContext";
import { useAuth } from "../../../context/AuthContext";
import SettingsPageHeader from "./SettingsPageHeader";

const InstitutionProfilePage = () => {
  const { settings, updateSettings } = usePortalSettings();
  const { currentMadrasa, user } = useAuth();
  const { t } = useTranslation();

  const buildInitialForm = () => ({
    institutionName:
      settings?.profile?.institutionName || currentMadrasa?.name || "",
    slogan: settings?.profile?.slogan || "",
    address: settings?.profile?.address || currentMadrasa?.address || "",
    email: settings?.profile?.email || currentMadrasa?.email || "",
    phone: settings?.profile?.phone || currentMadrasa?.phone || "",
    adminName: settings?.profile?.adminName || user?.name || "",
    designation: settings?.profile?.designation || "Muhtamim / Principal",
  });

  const [formData, setFormData] = useState(buildInitialForm);
  const [savedNotice, setSavedNotice] = useState(false);

  useEffect(() => {
    setFormData(buildInitialForm());
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [settings?.profile, currentMadrasa?.name]);

  const handleChange = (key, value) => {
    setSavedNotice(false);
    setFormData((prev) => ({ ...prev, [key]: value }));
  };

  const handleSave = (e) => {
    e?.preventDefault();
    if (!formData.institutionName.trim()) {
      toast.error("প্রতিষ্ঠানের নাম খালি রাখা যাবে না");
      return;
    }
    updateSettings({
      ...settings,
      profile: {
        ...settings?.profile,
        ...formData,
      },
    });
    setSavedNotice(true);
    toast.success("প্রতিষ্ঠানের প্রোফাইল সংরক্ষণ করা হয়েছে");
  };

  const handleReset = () => {
    setFormData(buildInitialForm());
    setSavedNotice(false);
    toast.success("আগের সংরক্ষিত তথ্যে রিসেট করা হয়েছে");
  };

  const initials = (formData.institutionName || "M")
    .split(" ")
    .slice(0, 2)
    .map((w) => w[0])
    .join("")
    .toUpperCase();

  return (
    <form
      onSubmit={handleSave}
      className="p-4 md:p-6 max-w-7xl mx-auto space-y-6 animate-fade-in"
    >
      <SettingsPageHeader
        title={t("settings_page.inst_identity")}
        subtitle={t("settings_page.inst_identity_desc")}
        icon={Building2}
        rightActions={
          <>
            <button
              type="button"
              onClick={handleReset}
              className="flex items-center gap-1.5 px-4 py-2.5 bg-slate-100 hover:bg-slate-200 text-slate-700 text-sm font-semibold rounded-xl transition-colors cursor-pointer"
            >
              <RotateCcw className="w-4 h-4" />
              {t("settings_page.reset_view")}
            </button>
            <button
              type="submit"
              className="flex items-center gap-2 px-5 py-2.5 bg-[#1C7D5A] hover:bg-[#123628] text-white text-sm font-semibold rounded-xl shadow-sm transition-all active:scale-95 cursor-pointer"
            >
              <Save className="w-4 h-4" />
              {t("settings_page.update_profile")}
            </button>
          </>
        }
      />

      {savedNotice && (
        <div className="flex items-center gap-2.5 px-4 py-3 rounded-xl bg-emerald-50 border border-emerald-200 text-emerald-800 text-xs md:text-sm font-semibold">
          <CheckCircle2 className="w-4 h-4 text-[#1C7D5A] shrink-0" />
          <span>প্রোফাইলের পরিবর্তনগুলো সফলভাবে সংরক্ষিত হয়েছে।</span>
        </div>
      )}

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
        {/* Live Preview Identity Card */}
        <div className="lg:col-span-4 bg-white rounded-2xl border border-slate-200/80 shadow-sm overflow-hidden">
          <div className="bg-gradient-to-br from-[#123628] via-[#174b37] to-[#1C7D5A] p-6 text-white relative">
            <div className="flex items-center gap-4">
              <div className="w-16 h-16 rounded-2xl bg-white p-1.5 shadow-md flex items-center justify-center shrink-0 overflow-hidden">
                {currentMadrasa?.logo ? (
                  <img
                    src={currentMadrasa.logo}
                    alt={formData.institutionName}
                    className="w-full h-full object-contain"
                  />
                ) : (
                  <span className="text-lg font-extrabold text-[#123628]">
                    {initials}
                  </span>
                )}
              </div>
              <div className="min-w-0">
                <span className="inline-block text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded-full bg-white/15 text-[#EAB33C] mb-1">
                  প্রতিষ্ঠান পরিচিতি
                </span>
                <h2 className="text-lg font-bold leading-snug truncate">
                  {formData.institutionName || "মাদ্রাসার নাম"}
                </h2>
                <p className="text-xs text-white/80 truncate mt-0.5">
                  {formData.slogan || "স্লোগান / ট্যাগলাইন"}
                </p>
              </div>
            </div>
          </div>

          <div className="p-5 space-y-3.5 text-sm">
            <div className="flex items-start gap-3">
              <User className="w-4 h-4 text-[#1C7D5A] mt-0.5 shrink-0" />
              <div className="min-w-0">
                <p className="text-[11px] font-semibold text-slate-400 uppercase">
                  প্রশাসক
                </p>
                <p className="font-semibold text-slate-800 truncate">
                  {formData.adminName || "—"}
                </p>
                <p className="text-xs text-slate-500 truncate">
                  {formData.designation || "—"}
                </p>
              </div>
            </div>

            <div className="flex items-start gap-3">
              <Phone className="w-4 h-4 text-[#1C7D5A] mt-0.5 shrink-0" />
              <div className="min-w-0">
                <p className="text-[11px] font-semibold text-slate-400 uppercase">
                  ফোন
                </p>
                <p className="font-medium text-slate-700 truncate">
                  {formData.phone || "—"}
                </p>
              </div>
            </div>

            <div className="flex items-start gap-3">
              <Mail className="w-4 h-4 text-[#1C7D5A] mt-0.5 shrink-0" />
              <div className="min-w-0">
                <p className="text-[11px] font-semibold text-slate-400 uppercase">
                  ইমেইল
                </p>
                <p className="font-medium text-slate-700 truncate">
                  {formData.email || "—"}
                </p>
              </div>
            </div>

            <div className="flex items-start gap-3">
              <MapPin className="w-4 h-4 text-[#1C7D5A] mt-0.5 shrink-0" />
              <div className="min-w-0">
                <p className="text-[11px] font-semibold text-slate-400 uppercase">
                  ঠিকানা
                </p>
                <p className="font-medium text-slate-700 break-words">
                  {formData.address || "—"}
                </p>
              </div>
            </div>

            {currentMadrasa?.slug && (
              <div className="pt-3 border-t border-slate-100">
                <Link
                  to={`/${currentMadrasa.slug}`}
                  target="_blank"
                  className="w-full flex items-center justify-center gap-2 py-2.5 px-4 rounded-xl bg-emerald-50 hover:bg-emerald-100 text-[#1C7D5A] text-xs font-bold transition-colors"
                >
                  <Globe className="w-4 h-4" />
                  পাবলিক পোর্টাল দেখুন (/{currentMadrasa.slug})
                  <ExternalLink className="w-3.5 h-3.5" />
                </Link>
              </div>
            )}
          </div>
        </div>

        {/* Form Sections */}
        <div className="lg:col-span-8 space-y-6">
          {/* Institution Information Card */}
          <div className="bg-white rounded-2xl border border-slate-200/80 p-5 md:p-6 shadow-sm space-y-5">
            <div className="flex items-center gap-2.5 pb-3 border-b border-slate-100">
              <div className="w-8 h-8 rounded-lg bg-[#1C7D5A]/10 text-[#1C7D5A] flex items-center justify-center">
                <Building2 className="w-4 h-4" />
              </div>
              <div>
                <h3 className="text-base font-bold text-slate-800">
                  {t("settings_page.inst_info")}
                </h3>
                <p className="text-xs text-slate-500">
                  মাদ্রাসার নাম, স্লোগান ও অফিসিয়াল যোগাযোগের ঠিকানা
                </p>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="md:col-span-2 space-y-1.5">
                <label className="text-xs font-semibold text-slate-600 block">
                  {t("settings_page.full_inst_name")}
                </label>
                <div className="relative">
                  <Building2 className="absolute left-3.5 top-3 w-4 h-4 text-slate-400" />
                  <input
                    type="text"
                    value={formData.institutionName}
                    onChange={(e) =>
                      handleChange("institutionName", e.target.value)
                    }
                    placeholder="যেমন: আল-কুরআনুল কারীম একাডেমি"
                    className="w-full pl-10 pr-4 py-2.5 bg-slate-50/70 border border-slate-200 rounded-xl text-sm font-medium text-slate-800 outline-none focus:bg-white focus:border-[#1C7D5A] focus:ring-2 focus:ring-[#1C7D5A]/15 transition-all"
                  />
                </div>
              </div>

              <div className="space-y-1.5">
                <label className="text-xs font-semibold text-slate-600 block">
                  {t("settings_page.slogan")}
                </label>
                <div className="relative">
                  <Globe className="absolute left-3.5 top-3 w-4 h-4 text-slate-400" />
                  <input
                    type="text"
                    value={formData.slogan}
                    onChange={(e) => handleChange("slogan", e.target.value)}
                    placeholder="মাদ্রাসার মূলমন্ত্র বা স্লোগান"
                    className="w-full pl-10 pr-4 py-2.5 bg-slate-50/70 border border-slate-200 rounded-xl text-sm font-medium text-slate-800 outline-none focus:bg-white focus:border-[#1C7D5A] focus:ring-2 focus:ring-[#1C7D5A]/15 transition-all"
                  />
                </div>
              </div>

              <div className="space-y-1.5">
                <label className="text-xs font-semibold text-slate-600 block">
                  অফিসিয়াল ইমেইল
                </label>
                <div className="relative">
                  <Mail className="absolute left-3.5 top-3 w-4 h-4 text-slate-400" />
                  <input
                    type="email"
                    value={formData.email}
                    onChange={(e) => handleChange("email", e.target.value)}
                    placeholder="info@madrasa.com"
                    className="w-full pl-10 pr-4 py-2.5 bg-slate-50/70 border border-slate-200 rounded-xl text-sm font-medium text-slate-800 outline-none focus:bg-white focus:border-[#1C7D5A] focus:ring-2 focus:ring-[#1C7D5A]/15 transition-all"
                  />
                </div>
              </div>

              <div className="md:col-span-2 space-y-1.5">
                <label className="text-xs font-semibold text-slate-600 block">
                  {t("settings_page.official_address")}
                </label>
                <div className="relative">
                  <MapPin className="absolute left-3.5 top-3 w-4 h-4 text-slate-400" />
                  <textarea
                    rows={3}
                    value={formData.address}
                    onChange={(e) => handleChange("address", e.target.value)}
                    placeholder="প্রতিষ্ঠানের পূর্ণ ঠিকানা লিখুন"
                    className="w-full pl-10 pr-4 py-2.5 bg-slate-50/70 border border-slate-200 rounded-xl text-sm font-medium text-slate-800 outline-none focus:bg-white focus:border-[#1C7D5A] focus:ring-2 focus:ring-[#1C7D5A]/15 transition-all"
                  />
                </div>
              </div>
            </div>
          </div>

          {/* Administrator Details Card */}
          <div className="bg-white rounded-2xl border border-slate-200/80 p-5 md:p-6 shadow-sm space-y-5">
            <div className="flex items-center gap-2.5 pb-3 border-b border-slate-100">
              <div className="w-8 h-8 rounded-lg bg-[#1C7D5A]/10 text-[#1C7D5A] flex items-center justify-center">
                <User className="w-4 h-4" />
              </div>
              <div>
                <h3 className="text-base font-bold text-slate-800">
                  {t("settings_page.admin_details")}
                </h3>
                <p className="text-xs text-slate-500">
                  প্রতিষ্ঠান প্রধান বা পরিচালকের নাম, পদবী ও ফোন নম্বর
                </p>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="space-y-1.5">
                <label className="text-xs font-semibold text-slate-600 block">
                  {t("settings_page.admin_name")}
                </label>
                <div className="relative">
                  <User className="absolute left-3.5 top-3 w-4 h-4 text-slate-400" />
                  <input
                    type="text"
                    value={formData.adminName}
                    onChange={(e) => handleChange("adminName", e.target.value)}
                    placeholder="মুহতামিম / অ্যাডমিন নাম"
                    className="w-full pl-10 pr-4 py-2.5 bg-slate-50/70 border border-slate-200 rounded-xl text-sm font-medium text-slate-800 outline-none focus:bg-white focus:border-[#1C7D5A] focus:ring-2 focus:ring-[#1C7D5A]/15 transition-all"
                  />
                </div>
              </div>

              <div className="space-y-1.5">
                <label className="text-xs font-semibold text-slate-600 block">
                  {t("settings_page.designation")}
                </label>
                <div className="relative">
                  <Briefcase className="absolute left-3.5 top-3 w-4 h-4 text-slate-400" />
                  <input
                    type="text"
                    value={formData.designation}
                    onChange={(e) => handleChange("designation", e.target.value)}
                    placeholder="যেমন: মুহতামিম / অধ্যক্ষ"
                    className="w-full pl-10 pr-4 py-2.5 bg-slate-50/70 border border-slate-200 rounded-xl text-sm font-medium text-slate-800 outline-none focus:bg-white focus:border-[#1C7D5A] focus:ring-2 focus:ring-[#1C7D5A]/15 transition-all"
                  />
                </div>
              </div>

              <div className="space-y-1.5">
                <label className="text-xs font-semibold text-slate-600 block">
                  {t("settings_page.direct_phone")}
                </label>
                <div className="relative">
                  <Phone className="absolute left-3.5 top-3 w-4 h-4 text-slate-400" />
                  <input
                    type="tel"
                    value={formData.phone}
                    onChange={(e) => handleChange("phone", e.target.value)}
                    placeholder="+8801XXXXXXXXX"
                    className="w-full pl-10 pr-4 py-2.5 bg-slate-50/70 border border-slate-200 rounded-xl text-sm font-medium text-slate-800 outline-none focus:bg-white focus:border-[#1C7D5A] focus:ring-2 focus:ring-[#1C7D5A]/15 transition-all"
                  />
                </div>
              </div>
            </div>

            <div className="flex flex-wrap items-center justify-end gap-3 pt-4 border-t border-slate-100">
              <button
                type="button"
                onClick={handleReset}
                className="px-5 py-2.5 bg-slate-100 hover:bg-slate-200 text-slate-700 text-sm font-semibold rounded-xl transition-colors cursor-pointer"
              >
                {t("settings_page.reset_view")}
              </button>
              <button
                type="submit"
                className="px-6 py-2.5 bg-[#1C7D5A] hover:bg-[#123628] text-white text-sm font-semibold rounded-xl shadow-sm transition-all flex items-center gap-2 cursor-pointer"
              >
                <Save className="w-4 h-4" />
                {t("settings_page.update_profile")}
              </button>
            </div>
          </div>
        </div>
      </div>
    </form>
  );
};

export default InstitutionProfilePage;
