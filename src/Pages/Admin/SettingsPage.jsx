import React, { useState, useEffect } from "react";
import { useTranslation } from "react-i18next";
import { 
  Settings, 
  Smartphone, 
  ShieldCheck, 
  Mail, 
  Save,
  MessageSquare,
  User,
  Plus,
  Trash2,
  ChevronRight,
  Info,
  Building2,
  Phone,
  Briefcase,
  MapPin,
  Globe,
  CheckCircle2,
  DollarSign,
  CreditCard,
  Cpu,
  Activity,
  Sparkles,
  TrendingUp,
  Wallet,
  RotateCcw,
  Loader2,
  AlertTriangle
} from "lucide-react";
import { toast } from "react-hot-toast";
import { usePortalSettings } from "../../context/PortalSettingsContext";
import InputField from "../../components/InputField";
import { useAuth } from "../../context/AuthContext";
import portalService from "../../services/portalService";

const DEFAULT_TEMPLATES = {
  Absent: "আসসালামু আলাইকুম। {student_name} আজ ({date}) {madrasa_name}-এ অনুপস্থিত রয়েছে।",
  Late: "আসসালামু আলাইকুম। {student_name} আজ ({date}) {madrasa_name}-এ দেরিতে উপস্থিত হয়েছে।",
  Present: "আসসালামু আলাইকুম। {student_name} আজ ({date}) {madrasa_name}-এ উপস্থিত হয়েছে।",
};

const SettingsPage = () => {
  const { settings, updateSettings } = usePortalSettings();
  const { t } = useTranslation();
  const { currentMadrasa } = useAuth();
  const [activeTab, setActiveTab] = useState("SMS");

  const [studentStats, setStudentStats] = useState(null);
  const [statsLoading, setStatsLoading] = useState(false);

  // Backend-persisted SMS settings state
  const [smsLoading, setSmsLoading] = useState(true);
  const [smsSaving, setSmsSaving] = useState(false);
  const [smsBalance, setSmsBalance] = useState(0);
  const [smsRates, setSmsRates] = useState({ single: 0.3, bulk: 0.25, masking: 0.4 });
  const [defaultTemplates, setDefaultTemplates] = useState(DEFAULT_TEMPLATES);
  const [smsConfig, setSmsConfig] = useState({
    admission: false,
    fees: false,
    attendance: false,
    attendanceTrigger: "absent_only",
    attendanceTemplates: { ...DEFAULT_TEMPLATES },
  });

  const sub = currentMadrasa?.subscription || {};
  const studentLimit = sub.studentLimit || 150;
  const currentStudents = studentStats?.totalStudents || 0;
  const utilizationPercentage = studentLimit ? Math.min(Math.round((currentStudents / studentLimit) * 100), 100) : 0;

  useEffect(() => {
    const loadSmsSettings = async () => {
      try {
        setSmsLoading(true);
        const res = await portalService.getSmsSettings();
        if (res?.success && res?.data?.settings) {
          setSmsConfig(res.data.settings);
          setSmsBalance(Number(res.data.balance || 0));
          if (res.data.rates) setSmsRates(res.data.rates);
          if (res.data.defaultTemplates) setDefaultTemplates(res.data.defaultTemplates);
        }
      } catch (err) {
        console.error("Failed to load SMS settings from backend", err);
      } finally {
        setSmsLoading(false);
      }
    };
    loadSmsSettings();
  }, []);

  useEffect(() => {
    if (activeTab === "Subscription") {
      const fetchStats = async () => {
        try {
          setStatsLoading(true);
          const res = await portalService.getStudentStats();
          setStudentStats(res.data);
        } catch (err) {
          console.error("Failed to load student stats for settings page", err);
        } finally {
          setStatsLoading(false);
        }
      };
      fetchStats();
    }
  }, [activeTab]);

  const tabs = [
    { id: "SMS", label: t("settings_page.sms_setup"), icon: MessageSquare },
    { id: "Profile", label: t("settings_page.profile"), icon: User },
    { id: "Subscription", label: "SaaS Subscription", icon: ShieldCheck },
  ];

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
    setSmsConfig((prev) => ({
      ...prev,
      attendanceTemplates: {
        ...prev.attendanceTemplates,
        [statusKey]: value,
      },
    }));
  };

  const handleResetTemplates = () => {
    const nextConfig = {
      ...smsConfig,
      attendanceTemplates: { ...defaultTemplates },
    };
    setSmsConfig(nextConfig);
    persistSmsConfig(nextConfig, true);
  };

  const handleSaveChanges = () => {
    if (activeTab === "SMS") {
      persistSmsConfig(smsConfig, true);
    } else {
      toast.success("পরিবর্তন সংরক্ষণ করা হয়েছে");
    }
  };

  const handleProfileUpdate = (key, value) => {
    updateSettings({
      ...settings,
      profile: {
        ...settings.profile,
        [key]: value
      }
    });
  };

  const Toggle = ({ enabled, onChange, label, description }) => (
    <div className="flex items-center justify-between p-6 bg-slate-50 border border-slate-100 rounded-3xl group hover:bg-white hover:border-[#1C7D5A15] hover:shadow-lg hover:shadow-[#1C7D5A08] transition-all cursor-pointer" onClick={onChange}>
      <div className="flex items-center gap-4 pr-4">
        <div>
          <h4 className="text-sm font-black text-slate-800 uppercase tracking-tight">{label}</h4>
          {description && (
            <p className="text-[11px] font-bold text-slate-400 mt-1">{description}</p>
          )}
        </div>
      </div>
      <div className={`w-14 h-8 shrink-0 rounded-full relative transition-all duration-300 ${enabled ? 'bg-[#1C7D5A] shadow-inner' : 'bg-slate-200 shadow-inner'}`}>
        <div className={`absolute top-1 left-1 w-6 h-6 bg-white rounded-full shadow-md transition-all duration-300 ${enabled ? 'translate-x-6' : 'translate-x-0'}`} />
      </div>
    </div>
  );

  return (
    <div className="min-h-screen bg-slate-50/50 p-4 md:p-8 animate-in fade-in duration-500">
      <div className="max-w-[1600px] mx-auto space-y-8">
        
        {/* Header Section */}
        <div className="bg-white rounded-[20px] border border-slate-200 p-8 shadow-sm flex flex-col lg:flex-row justify-between items-center gap-6">
          <div className="flex items-center gap-6">
            <div className="w-16 h-16 bg-[#1C7D5A]/10 rounded-2xl flex items-center justify-center border border-[#1C7D5A]/20 shadow-inner">
              <Settings className="w-8 h-8 text-[#1C7D5A] animate-spin-slow" />
            </div>
            <div>
              <h1 className="text-2xl md:text-3xl font-black text-slate-800 tracking-tight uppercase">{t("settings_page.system_settings")}</h1>
             
            </div>
          </div>
          <button
            type="button"
            onClick={handleSaveChanges}
            disabled={smsSaving}
            className="flex items-center gap-2 px-8 py-3 bg-[#1C7D5A] text-white font-black rounded-xl shadow-xl shadow-[#1C7D5A]/20 hover:bg-[#123628] hover:scale-[1.02] active:scale-95 transition-all disabled:opacity-60 cursor-pointer"
          >
            {smsSaving ? <Loader2 className="w-5 h-5 animate-spin" /> : <Save className="w-5 h-5" />}
            {smsSaving ? "Saving..." : t("common.save_changes")}
          </button>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
           {/* Sidebar: Navigation */}
           <div className="lg:col-span-1 space-y-6">
              <div className="bg-white rounded-[20px] border border-slate-200 p-4 shadow-sm overflow-hidden">
                 <div className="space-y-1">
                    {tabs.map((tab) => (
                       <button 
                          key={tab.id}
                          onClick={() => setActiveTab(tab.id)}
                          className={`w-full flex items-center gap-4 px-6 py-4 rounded-2xl font-black transition-all ${
                            activeTab === tab.id 
                              ? 'bg-[#1C7D5A]/10 text-[#1C7D5A] shadow-sm' 
                              : 'text-slate-400 hover:bg-slate-50 hover:text-slate-600'
                          }`}
                       >
                          <tab.icon className={`w-5 h-5 ${activeTab === tab.id ? 'text-[#1C7D5A]' : 'text-slate-400'}`} />
                          <span className="text-sm tracking-tight">{tab.label}</span>
                       </button>
                    ))}
                 </div>
              </div>

              
           </div>

           {/* Content Area */}
           <div className="lg:col-span-3">
              <div className="bg-white rounded-[2rem] border border-slate-200 p-8 md:p-12 shadow-sm min-h-[600px] animate-in slide-in-from-bottom-4 duration-500">
                 
                  {activeTab === "SMS" && (
                   <div className="space-y-8 animate-in fade-in duration-300">
                      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-2 pb-6 border-b border-slate-100">
                         <div className="flex items-center gap-4">
                            <div className="w-12 h-12 bg-[#1C7D5A]/10 rounded-2xl flex items-center justify-center border border-[#1C7D5A]/20">
                                <MessageSquare className="w-6 h-6 text-[#1C7D5A]" />
                            </div>
                            <div>
                               <h2 className="text-2xl font-black text-slate-800 tracking-tight uppercase">{t("settings_page.sms_trigger_mgmt")}</h2>
                               <p className="text-xs font-bold text-slate-400 uppercase tracking-widest">{t("settings_page.sms_trigger_desc")}</p>
                            </div>
                         </div>

                         <div className="flex items-center gap-3 px-4 py-2.5 rounded-2xl bg-emerald-50 border border-emerald-100">
                            <Wallet className="w-4 h-4 text-[#1C7D5A]" />
                            <div className="text-right">
                               <p className="text-[10px] font-bold text-slate-500 uppercase">SMS Wallet</p>
                               <p className="text-sm font-black text-[#1C7D5A]">৳ {smsBalance.toFixed(2)} <span className="text-[10px] font-semibold text-slate-400">(৳{smsRates.single}/SMS)</span></p>
                            </div>
                         </div>
                      </div>

                      {smsLoading ? (
                        <div className="py-12 flex items-center justify-center gap-2 text-slate-400 font-bold text-sm">
                          <Loader2 className="w-5 h-5 animate-spin text-[#1C7D5A]" />
                          Loading SMS configuration...
                        </div>
                      ) : (
                        <>
                          {smsConfig.attendance && smsBalance < smsRates.single && (
                            <div className="flex items-start gap-3 p-4 rounded-2xl bg-amber-50 border border-amber-200 text-amber-800 text-xs font-semibold">
                              <AlertTriangle className="w-4 h-4 shrink-0 mt-0.5 text-amber-600" />
                              <span>
                                আপনার SMS ওয়ালেটে পর্যাপ্ত ব্যালেন্স নেই (বর্তমান ব্যালেন্স ৳{smsBalance.toFixed(2)})। হাজিরা সেভ হবে, তবে রিচার্জ না করা পর্যন্ত অটো-এসএমএস পাঠানো স্থগিত থাকবে।
                              </span>
                            </div>
                          )}

                          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 pt-2">
                             <Toggle 
                               enabled={smsConfig.attendance}
                               onChange={() => handleSmsToggle('attendance')}
                               label={t("settings_page.attendance_sms")}
                               description={t("settings_page.attendance_sms_desc")}
                             />
                             <Toggle 
                               enabled={smsConfig.admission}
                               onChange={() => handleSmsToggle('admission')}
                               label={t("settings_page.admission_sms")}
                               description={t("settings_page.admission_sms_desc")}
                             />
                             <Toggle 
                               enabled={smsConfig.fees}
                               onChange={() => handleSmsToggle('fees')}
                               label={t("settings_page.fees_sms")}
                               description={t("settings_page.fees_sms_desc")}
                             />
                          </div>

                          {/* Attendance SMS Rules & Templates */}
                          <div className={`rounded-3xl border p-6 md:p-8 space-y-6 transition-all ${smsConfig.attendance ? 'bg-slate-50/70 border-emerald-200' : 'bg-slate-50/40 border-slate-100 opacity-65'}`}>
                            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                              <div>
                                <h3 className="text-sm font-black text-slate-800 uppercase tracking-tight">
                                  Attendance Auto-SMS Rule & Templates
                                </h3>
                                <p className="text-xs font-semibold text-slate-500 mt-0.5">
                                  কোন অবস্থায় অভিভাবকের কাছে মেসেজ যাবে এবং কী লেখা যাবে তা নির্ধারণ করুন (একই দিনে একই ছাত্রকে দুবার SMS যাবে না)।
                                </p>
                              </div>
                              <button
                                type="button"
                                onClick={handleResetTemplates}
                                className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-xl bg-white border border-slate-200 text-xs font-bold text-slate-600 hover:bg-slate-100 transition-colors cursor-pointer self-start"
                              >
                                <RotateCcw className="w-3.5 h-3.5" />
                                ডিফল্ট টেমপ্লেট
                              </button>
                            </div>

                            {/* Trigger Mode Selector */}
                            <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
                              {[
                                {
                                  id: "absent_only",
                                  title: "শুধু Absent (প্রস্তাবিত)",
                                  desc: "শুধু অনুপস্থিত থাকলে SMS যাবে — খরচ সবচেয়ে কম",
                                },
                                {
                                  id: "absent_late",
                                  title: "Absent ও Late",
                                  desc: "অনুপস্থিত বা দেরিতে এলে অভিভাবক জানবে",
                                },
                                {
                                  id: "all",
                                  title: "সব স্ট্যাটাস (Present + Absent + Late)",
                                  desc: "উপস্থিত, অনুপস্থিত ও দেরি — সব ক্ষেত্রেই SMS যাবে",
                                },
                              ].map((opt) => {
                                const selected = smsConfig.attendanceTrigger === opt.id;
                                return (
                                  <button
                                    key={opt.id}
                                    type="button"
                                    onClick={() => handleTriggerChange(opt.id)}
                                    className={`text-left p-4 rounded-2xl border-2 transition-all cursor-pointer ${
                                      selected
                                        ? "border-[#1C7D5A] bg-white shadow-sm"
                                        : "border-slate-200 bg-white/60 hover:border-slate-300"
                                    }`}
                                  >
                                    <div className="flex items-center justify-between gap-2">
                                      <span className={`text-xs font-black ${selected ? "text-[#1C7D5A]" : "text-slate-700"}`}>
                                        {opt.title}
                                      </span>
                                      {selected && <CheckCircle2 className="w-4 h-4 text-[#1C7D5A] shrink-0" />}
                                    </div>
                                    <p className="text-[11px] font-medium text-slate-500 mt-1">{opt.desc}</p>
                                  </button>
                                );
                              })}
                            </div>

                            {/* Editable Message Templates */}
                            <div className="space-y-4 pt-2">
                              <div className="flex items-center gap-2 text-[11px] font-bold text-slate-500">
                                <Info className="w-3.5 h-3.5 text-[#1C7D5A]" />
                                <span>
                                  ব্যবহারযোগ্য ভ্যারিয়েবল: <code className="px-1.5 py-0.5 bg-white rounded border border-slate-200">{"{student_name}"}</code>{" "}
                                  <code className="px-1.5 py-0.5 bg-white rounded border border-slate-200">{"{date}"}</code>{" "}
                                  <code className="px-1.5 py-0.5 bg-white rounded border border-slate-200">{"{madrasa_name}"}</code>
                                </span>
                              </div>

                              <div className="grid grid-cols-1 gap-4">
                                <div>
                                  <label className="text-xs font-bold text-rose-600 block mb-1.5">Absent SMS টেমপ্লেট</label>
                                  <textarea
                                    rows={2}
                                    value={smsConfig.attendanceTemplates?.Absent || ""}
                                    onChange={(e) => handleTemplateChange("Absent", e.target.value)}
                                    className="w-full px-4 py-2.5 bg-white border border-slate-200 rounded-xl text-sm font-medium text-slate-700 outline-none focus:border-[#1C7D5A]"
                                  />
                                </div>

                                {(smsConfig.attendanceTrigger === "absent_late" || smsConfig.attendanceTrigger === "all") && (
                                  <div>
                                    <label className="text-xs font-bold text-amber-600 block mb-1.5">Late SMS টেমপ্লেট</label>
                                    <textarea
                                      rows={2}
                                      value={smsConfig.attendanceTemplates?.Late || ""}
                                      onChange={(e) => handleTemplateChange("Late", e.target.value)}
                                      className="w-full px-4 py-2.5 bg-white border border-slate-200 rounded-xl text-sm font-medium text-slate-700 outline-none focus:border-[#1C7D5A]"
                                    />
                                  </div>
                                )}

                                {smsConfig.attendanceTrigger === "all" && (
                                  <div>
                                    <label className="text-xs font-bold text-emerald-600 block mb-1.5">Present SMS টেমপ্লেট</label>
                                    <textarea
                                      rows={2}
                                      value={smsConfig.attendanceTemplates?.Present || ""}
                                      onChange={(e) => handleTemplateChange("Present", e.target.value)}
                                      className="w-full px-4 py-2.5 bg-white border border-slate-200 rounded-xl text-sm font-medium text-slate-700 outline-none focus:border-[#1C7D5A]"
                                    />
                                  </div>
                                )}
                              </div>

                              <div className="flex justify-end pt-2">
                                <button
                                  type="button"
                                  onClick={() => persistSmsConfig(smsConfig, true)}
                                  disabled={smsSaving}
                                  className="px-6 py-2.5 bg-[#1C7D5A] text-white text-xs font-black rounded-xl shadow-md hover:bg-[#156347] transition-all flex items-center gap-2 disabled:opacity-60 cursor-pointer"
                                >
                                  {smsSaving ? <Loader2 className="w-4 h-4 animate-spin" /> : <Save className="w-4 h-4" />}
                                  SMS সেটিংস সেভ করুন
                                </button>
                              </div>
                            </div>
                          </div>
                        </>
                      )}
                   </div>
                 )}

                 {activeTab === "Profile" && (
                   <div className="space-y-10 animate-in fade-in duration-300">
                      <div className="flex items-center gap-4 mb-2 pb-6 border-b border-slate-50">
                         <div className="w-12 h-12 bg-[#1C7D5A]/10 rounded-2xl flex items-center justify-center border border-[#1C7D5A]/20">
                             <Building2 className="w-6 h-6 text-[#1C7D5A]" />
                         </div>
                         <div>
                            <h2 className="text-2xl font-black text-slate-800 tracking-tight uppercase">{t("settings_page.inst_identity")}</h2>
                            <p className="text-xs font-bold text-slate-400 uppercase tracking-widest">{t("settings_page.inst_identity_desc")}</p>
                         </div>
                      </div>

                      <div className="grid grid-cols-1 md:grid-cols-2 gap-8 pt-4">
                         <div className="space-y-6">
                            <h3 className="text-sm font-black text-slate-800 uppercase tracking-wider underline decoration-[#1C7D5A] decoration-4 underline-offset-8 italic mb-8">{t("settings_page.admin_details")}</h3>
                            <div className="space-y-6">
                               <div className="space-y-2">
                                  <label className="text-[10px] font-black text-slate-500 uppercase tracking-widest px-1">{t("settings_page.admin_name")}</label>
                                  <div className="relative">
                                    <User className="absolute left-3 top-3 w-4 h-4 text-slate-400" />
                                    <input 
                                      className="w-full pl-10 pr-4 py-3 bg-slate-50 border border-slate-200 rounded-xl font-bold text-slate-700 outline-none focus:ring-2 focus:ring-primary/20 transition-all shadow-sm"
                                      value={settings?.profile?.adminName ?? ""}
                                      onChange={(e) => handleProfileUpdate('adminName', e.target.value)}
                                    />
                                  </div>
                               </div>
                               <div className="space-y-2">
                                  <label className="text-[10px] font-black text-slate-500 uppercase tracking-widest px-1">{t("settings_page.designation")}</label>
                                  <div className="relative">
                                    <Briefcase className="absolute left-3 top-3 w-4 h-4 text-slate-400" />
                                    <input 
                                      className="w-full pl-10 pr-4 py-3 bg-slate-50 border border-slate-200 rounded-xl font-bold text-slate-700 outline-none focus:ring-2 focus:ring-primary/20 transition-all shadow-sm"
                                      value={settings?.profile?.designation ?? ""}
                                      onChange={(e) => handleProfileUpdate('designation', e.target.value)}
                                    />
                                  </div>
                               </div>
                               <div className="space-y-2">
                                  <label className="text-[10px] font-black text-slate-500 uppercase tracking-widest px-1">{t("settings_page.direct_phone")}</label>
                                  <div className="relative">
                                    <Phone className="absolute left-3 top-3 w-4 h-4 text-slate-400" />
                                    <input 
                                      className="w-full pl-10 pr-4 py-3 bg-slate-50 border border-slate-200 rounded-xl font-bold text-slate-700 outline-none focus:ring-2 focus:ring-primary/20 transition-all shadow-sm"
                                      value={settings?.profile?.phone ?? ""}
                                      onChange={(e) => handleProfileUpdate('phone', e.target.value)}
                                    />
                                  </div>
                               </div>
                            </div>
                         </div>

                         <div className="space-y-6">
                            <h3 className="text-sm font-black text-slate-800 uppercase tracking-wider underline decoration-primary decoration-4 underline-offset-8 italic mb-8">{t("settings_page.inst_info")}</h3>
                            <div className="space-y-6">
                               <div className="space-y-2">
                                  <label className="text-[10px] font-black text-slate-500 uppercase tracking-widest px-1">{t("settings_page.full_inst_name")}</label>
                                  <div className="relative">
                                    <Building2 className="absolute left-3 top-3 w-4 h-4 text-slate-400" />
                                    <input 
                                      className="w-full pl-10 pr-4 py-3 bg-slate-50 border border-slate-200 rounded-xl font-bold text-slate-700 outline-none focus:ring-2 focus:ring-primary/20 transition-all shadow-sm"
                                      value={settings?.profile?.institutionName ?? ""}
                                      onChange={(e) => handleProfileUpdate('institutionName', e.target.value)}
                                    />
                                  </div>
                               </div>
                               <div className="space-y-2">
                                  <label className="text-[10px] font-black text-slate-500 uppercase tracking-widest px-1">{t("settings_page.official_address")}</label>
                                  <div className="relative">
                                    <MapPin className="absolute left-3 top-3 w-4 h-4 text-slate-400" />
                                    <textarea 
                                      className="w-full pl-10 pr-4 py-3 bg-slate-50 border border-slate-200 rounded-xl font-bold text-slate-700 outline-none focus:ring-2 focus:ring-primary/20 transition-all shadow-sm h-28"
                                      value={settings?.profile?.address ?? ""}
                                      onChange={(e) => handleProfileUpdate('address', e.target.value)}
                                    />
                                  </div>
                               </div>
                               <div className="space-y-2">
                                  <label className="text-[10px] font-black text-slate-500 uppercase tracking-widest px-1">{t("settings_page.slogan")}</label>
                                  <div className="relative">
                                    <Globe className="absolute left-3 top-3 w-4 h-4 text-slate-400" />
                                    <input 
                                      className="w-full pl-10 pr-4 py-3 bg-slate-50 border border-slate-200 rounded-xl font-bold text-slate-700 outline-none focus:ring-2 focus:ring-primary/20 transition-all shadow-sm"
                                      value={settings?.profile?.slogan ?? ""}
                                      onChange={(e) => handleProfileUpdate('slogan', e.target.value)}
                                    />
                                  </div>
                               </div>
                            </div>
                         </div>
                      </div>

                      <div className="mt-12 flex items-center justify-end gap-4 border-t border-slate-100 pt-8">
                         <button className="px-8 py-3 bg-slate-100 text-slate-500 font-black rounded-xl hover:bg-slate-200 transition-all uppercase tracking-widest text-[11px]">{t("settings_page.reset_view")}</button>
                         <button className="px-12 py-3 bg-primary text-white font-black rounded-xl shadow-xl shadow-primary/20 hover:scale-[1.02] active:scale-95 transition-all uppercase tracking-widest text-[11px] flex items-center gap-2">
                            <Save className="w-5 h-5" />
                            {t("settings_page.update_profile")}
                         </button>
                      </div>
                   </div>
                 )}

                 {activeTab === "Subscription" && (
                    <div className="space-y-10 animate-in fade-in duration-500">
                      
                      {/* Section Title */}
                      <div className="flex items-center gap-4 mb-2 pb-6 border-b border-slate-100">
                        <div className="w-14 h-14 bg-[#1C7D5A]/10 rounded-2xl flex items-center justify-center border border-[#1C7D5A]/20 shadow-inner">
                          <ShieldCheck className="w-7 h-7 text-[#1C7D5A]" />
                        </div>
                        <div>
                          <h2 className="text-2xl font-black text-slate-800 tracking-tight uppercase">SaaS License & Subscription</h2>
                          <p className="text-xs font-bold text-slate-400 uppercase tracking-widest mt-0.5">Manage operational boundaries and monitor active pricing details</p>
                        </div>
                      </div>

                      {/* Main Layout Grid */}
                      <div className="grid grid-cols-1 xl:grid-cols-2 gap-10 pt-2">
                        
                        {/* 1. Holographic SaaS Pass Card */}
                        <div className="space-y-4">
                          <h3 className="text-xs font-black text-slate-400 uppercase tracking-wider px-2 flex items-center gap-1.5">
                            <Sparkles className="w-3.5 h-3.5 text-amber-500" /> Active Membership License
                          </h3>
                          
                          <div className="relative overflow-hidden bg-gradient-to-br from-[#0b1329] via-[#121c33] to-[#060c1c] rounded-[2rem] p-8 shadow-xl shadow-slate-900/20 border border-white/10 text-white flex flex-col justify-between aspect-[1.586/1] w-full max-w-md mx-auto group hover:scale-[1.01] hover:shadow-2xl hover:shadow-[#1C7D5A]/5 transition-all duration-300">
                            {/* Holographic light reflections */}
                            <div className="absolute top-0 right-0 w-60 h-60 bg-gradient-to-bl from-[#1C7D5A]/15 to-blue-500/5 rounded-full filter blur-3xl opacity-60 pointer-events-none group-hover:opacity-80 transition-opacity" />
                            <div className="absolute -bottom-10 -left-10 w-40 h-40 bg-gradient-to-tr from-purple-500/10 to-transparent rounded-full filter blur-2xl opacity-40 pointer-events-none" />

                            {/* Card Top */}
                            <div className="flex justify-between items-start">
                              <div className="space-y-1">
                                <p className="text-[9px] font-bold text-slate-400 uppercase tracking-widest">SaaS Portal Key</p>
                                <div className="flex items-center gap-2">
                                  <Cpu className="w-5 h-5 text-slate-400" />
                                  <span className="text-xs font-mono tracking-widest text-slate-300">PASS-{(currentMadrasa?._id || "507f").toString().slice(-6).toUpperCase()}</span>
                                </div>
                              </div>
                              <span className="bg-emerald-500/15 border border-emerald-500/30 text-emerald-400 text-[10px] font-black px-3.5 py-1.5 rounded-full uppercase tracking-wider shadow-sm flex items-center gap-1">
                                <span className="w-1.5 h-1.5 bg-emerald-400 rounded-full animate-pulse" /> Active
                              </span>
                            </div>

                            {/* Card Middle: Massive Tier Name */}
                            <div className="py-4">
                              <p className="text-[10px] font-black text-slate-500 uppercase tracking-widest">Subscription Tier</p>
                              <h4 className="text-3xl md:text-4xl font-extrabold uppercase bg-clip-text text-transparent bg-gradient-to-r from-amber-300 via-yellow-200 to-amber-500 tracking-tight mt-1 group-hover:scale-[1.02] transition-transform duration-300">
                                {currentMadrasa?.subscription?.plan || "Basic"} Tier
                              </h4>
                            </div>

                            {/* Card Bottom */}
                            <div className="flex justify-between items-end border-t border-white/5 pt-4">
                              <div className="space-y-0.5">
                                <p className="text-[8px] font-bold text-slate-500 uppercase tracking-widest">Pricing Cycle</p>
                                <p className="text-lg font-black text-slate-100">
                                  ৳ {currentMadrasa?.subscription?.price || 999} <span className="text-xs text-slate-400 font-bold uppercase tracking-wider">/ {currentMadrasa?.subscription?.billingCycle || "monthly"}</span>
                                </p>
                              </div>
                              <div className="text-right space-y-0.5">
                                <p className="text-[8px] font-bold text-slate-500 uppercase tracking-widest">Renewal Date</p>
                                <p className="text-xs font-bold text-indigo-300 tracking-wide">
                                  {currentMadrasa?.subscription?.nextBillingDate 
                                    ? new Date(currentMadrasa.subscription.nextBillingDate).toLocaleDateString("en-US", { year: 'numeric', month: 'short', day: 'numeric' })
                                    : "N/A"}
                                </p>
                              </div>
                            </div>
                          </div>
                        </div>

                        {/* 2. Operational Metrics Panel */}
                        <div className="space-y-6 flex flex-col justify-between">
                          
                          {/* Student Capacity Gauge */}
                          <div className="bg-slate-50 border border-slate-150 rounded-3xl p-6 space-y-4 hover:shadow-md hover:border-slate-200 transition-all">
                            <div className="flex justify-between items-center">
                              <div className="flex items-center gap-2">
                                <Activity className="w-5 h-5 text-indigo-500" />
                                <h4 className="text-sm font-black text-slate-800 uppercase tracking-wider">Student Enrolled Limit</h4>
                              </div>
                              <span className="bg-indigo-50 text-indigo-600 text-xs font-black px-2.5 py-1 rounded-lg">
                                {statsLoading ? "Loading..." : `${studentStats?.totalStudents || 0} / ${currentMadrasa?.subscription?.studentLimit || 150}`}
                              </span>
                            </div>

                            {/* Utilization Progress Bar */}
                            <div className="space-y-2">
                              <div className="w-full bg-slate-200 h-3.5 rounded-full overflow-hidden p-0.5 shadow-inner">
                                <div 
                                  className={`h-full rounded-full bg-gradient-to-r shadow-md transition-all duration-1000 ${
                                    utilizationPercentage >= 90
                                      ? "from-amber-500 to-rose-500 shadow-rose-500/20"
                                      : "from-[#1C7D5A] to-blue-500 shadow-[#1C7D5A]/20"
                                  }`}
                                  style={{ width: `${utilizationPercentage}%` }}
                                />
                              </div>
                              <div className="flex justify-between text-[10px] font-bold text-slate-400 uppercase tracking-widest px-1">
                                <span>0% Usage</span>
                                <span>{utilizationPercentage}% capacity utilized</span>
                                <span>100% Limit</span>
                              </div>
                            </div>
                          </div>

                          {/* Guidelines Accent Help Box */}
                          <div className="bg-gradient-to-br from-indigo-950 via-slate-900 to-slate-900 border border-white/5 rounded-3xl p-6 text-white space-y-4 hover:shadow-lg transition-shadow">
                            <div className="flex items-center gap-2">
                              <TrendingUp className="w-5 h-5 text-amber-400" />
                              <h4 className="text-sm font-black uppercase tracking-wider text-slate-200">System Upgrades & Extensions</h4>
                            </div>
                            <p className="text-xs text-slate-400 leading-relaxed">
                              Need more student slots, support options, or custom billing structures? 
                              Reach out to the Super Administration team to modify your billing boundaries or request direct assistance.
                            </p>
                            <div className="pt-2">
                              <a 
                                href="mailto:support@mms.com"
                                className="inline-flex items-center gap-1.5 bg-[#1C7D5A] hover:bg-[#123628] text-white px-5 py-2.5 rounded-xl text-xs font-black shadow-lg shadow-[#1C7D5A]/20 hover:scale-[1.02] active:scale-95 transition-all uppercase tracking-wider"
                              >
                                Contact Super Admin
                              </a>
                            </div>
                          </div>

                        </div>
                      </div>
                    </div>
                 )}
              </div>
           </div>
        </div>
      </div>
    </div>
  );
};

export default SettingsPage;
