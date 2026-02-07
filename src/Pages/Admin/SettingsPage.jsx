import React, { useState } from "react";
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
  DollarSign
} from "lucide-react";
import { usePortalSettings } from "../../context/PortalSettingsContext";
import InputField from "../../components/InputField";

const SettingsPage = () => {
  const { settings, updateSettings } = usePortalSettings();
  const { t } = useTranslation();
  const [activeTab, setActiveTab] = useState("SMS");

  const tabs = [
    { id: "SMS", label: t("settings_page.sms_setup"), icon: MessageSquare },
    { id: "Profile", label: t("settings_page.profile"), icon: User },
  ];

  const handleSmsToggle = (key) => {
    updateSettings({
      ...settings,
      sms: {
        ...settings.sms,
        [key]: !settings.sms[key]
      }
    });
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
    <div className="flex items-center justify-between p-6 bg-slate-50 border border-slate-100 rounded-3xl group hover:bg-white hover:border-[#00bd7f15] hover:shadow-lg hover:shadow-[#00bd7f08] transition-all cursor-pointer" onClick={onChange}>
      <div className="flex items-center gap-4">
        <div>
          <h4 className="text-sm font-black text-slate-800 uppercase tracking-tight">{label}</h4>
          <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mt-0.5">{description}</p>
        </div>
      </div>
      <div className={`w-14 h-8 rounded-full relative transition-all duration-300 ${enabled ? 'bg-[#00bd7f] shadow-inner' : 'bg-slate-200 shadow-inner'}`}>
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
            <div className="w-16 h-16 bg-[#00bd7f]/10 rounded-2xl flex items-center justify-center border border-[#00bd7f]/20 shadow-inner">
              <Settings className="w-8 h-8 text-[#00bd7f] animate-spin-slow" />
            </div>
            <div>
              <h1 className="text-2xl md:text-3xl font-black text-slate-800 tracking-tight uppercase">{t("settings_page.system_settings")}</h1>
             
            </div>
          </div>
          <button className="flex items-center gap-2 px-8 py-3 bg-[#00bd7f] text-white font-black rounded-xl shadow-xl shadow-[#00bd7f]/20 hover:bg-[#009b68] hover:scale-[1.02] active:scale-95 transition-all">
            <Save className="w-5 h-5" />
            {t("common.save_changes")}
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
                              ? 'bg-[#00bd7f]/10 text-[#00bd7f] shadow-sm' 
                              : 'text-slate-400 hover:bg-slate-50 hover:text-slate-600'
                          }`}
                       >
                          <tab.icon className={`w-5 h-5 ${activeTab === tab.id ? 'text-[#00bd7f]' : 'text-slate-400'}`} />
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
                      <div className="flex items-center gap-4 mb-2 pb-6 border-b border-slate-50">
                         <div className="w-12 h-12 bg-[#00bd7f]/10 rounded-2xl flex items-center justify-center border border-[#00bd7f]/20">
                             <MessageSquare className="w-6 h-6 text-[#00bd7f]" />
                         </div>
                         <div>
                            <h2 className="text-2xl font-black text-slate-800 tracking-tight uppercase">{t("settings_page.sms_trigger_mgmt")}</h2>
                            <p className="text-xs font-bold text-slate-400 uppercase tracking-widest">{t("settings_page.sms_trigger_desc")}</p>
                         </div>
                      </div>

                      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 pt-4">
                         <Toggle 
                           enabled={settings?.sms?.admission ?? false}
                           onChange={() => handleSmsToggle('admission')}
                           
                           label={t("settings_page.admission_sms")}
                         />
                         <Toggle 
                           enabled={settings?.sms?.fees ?? false}
                           onChange={() => handleSmsToggle('fees')}
                          
                           label={t("settings_page.fees_sms")}
                         />
                         <Toggle 
                           enabled={settings?.sms?.attendance ?? false}
                           onChange={() => handleSmsToggle('attendance')}
                          
                           label={t("settings_page.attendance_sms")}
                         />
                      </div>

                     
                   </div>
                 )}

                 {activeTab === "Profile" && (
                   <div className="space-y-10 animate-in fade-in duration-300">
                      <div className="flex items-center gap-4 mb-2 pb-6 border-b border-slate-50">
                         <div className="w-12 h-12 bg-[#00bd7f]/10 rounded-2xl flex items-center justify-center border border-[#00bd7f]/20">
                             <Building2 className="w-6 h-6 text-[#00bd7f]" />
                         </div>
                         <div>
                            <h2 className="text-2xl font-black text-slate-800 tracking-tight uppercase">{t("settings_page.inst_identity")}</h2>
                            <p className="text-xs font-bold text-slate-400 uppercase tracking-widest">{t("settings_page.inst_identity_desc")}</p>
                         </div>
                      </div>

                      <div className="grid grid-cols-1 md:grid-cols-2 gap-8 pt-4">
                         <div className="space-y-6">
                            <h3 className="text-sm font-black text-slate-800 uppercase tracking-wider underline decoration-[#00bd7f] decoration-4 underline-offset-8 italic mb-8">{t("settings_page.admin_details")}</h3>
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
              </div>
           </div>
        </div>
      </div>
    </div>
  );
};

export default SettingsPage;
