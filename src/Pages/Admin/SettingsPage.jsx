import { useState } from "react";
import { 
  Settings, 
  Globe, 
  Building2, 
  Smartphone, 
  Bell, 
  ShieldCheck, 
  Database, 
  Mail, 
  Clock, 
  Save,
  Plus,
  Trash2,
  CheckCircle2,
  ChevronRight,
  Info
} from "lucide-react";

const SettingsPage = () => {
  const [activeTab, setActiveTab] = useState("general");

  const tabs = [
    { id: "general", label: "General Settings", icon: Globe },
    { id: "branch", label: "Branch Management", icon: Building2 },
    { id: "notifications", label: "Notifications", icon: Bell },
    { id: "system", label: "System Config", icon: Settings },
    { id: "security", label: "Security & Access", icon: ShieldCheck },
    { id: "backup", label: "Backup & Restore", icon: Database },
  ];

  return (
    <div className="min-h-screen bg-slate-50/50 p-4 md:p-8 animate-in fade-in duration-500">
      <div className="max-w-[1600px] mx-auto space-y-8">
        
        {/* Header Section */}
        <div className="bg-white rounded-[2.5rem] border border-slate-200 p-8 shadow-sm flex flex-col lg:flex-row justify-between items-center gap-6">
          <div className="flex items-center gap-6">
            <div className="w-16 h-16 bg-blue-50 rounded-2xl flex items-center justify-center border border-blue-100 shadow-inner">
              <Settings className="w-8 h-8 text-blue-600 animate-spin-slow" />
            </div>
            <div>
              <h1 className="text-2xl md:text-3xl font-black text-slate-800 tracking-tight text-uppercase">System Settings</h1>
              <p className="text-slate-500 font-bold mt-1">Configure institutional identity, regional preferences, and security protocols</p>
            </div>
          </div>

          <div className="flex gap-4 w-full lg:w-auto">
            <button className="flex-1 lg:flex-none px-10 py-4 bg-blue-600 text-white rounded-2xl font-black shadow-xl shadow-blue-100 hover:bg-blue-700 hover:scale-[1.02] active:scale-95 transition-all flex items-center justify-center gap-3 uppercase tracking-widest text-[11px]">
              <Save className="w-5 h-5" />
              Save All Changes
            </button>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
           
           {/* Sidebar: Navigation */}
           <div className="lg:col-span-1 space-y-6">
              <div className="bg-white rounded-[3rem] border border-slate-200 p-6 shadow-sm overflow-hidden">
                 <div className="space-y-1">
                    {tabs.map((tab) => (
                       <button 
                          key={tab.id}
                          onClick={() => setActiveTab(tab.id)}
                          className={`w-full flex items-center gap-4 px-6 py-4 rounded-2xl font-black transition-all ${
                            activeTab === tab.id 
                              ? 'bg-blue-50 text-blue-600 shadow-sm' 
                              : 'text-slate-400 hover:bg-slate-50 hover:text-slate-600'
                          }`}
                       >
                          <tab.icon className={`w-5 h-5 ${activeTab === tab.id ? 'text-blue-600' : 'text-slate-300'}`} />
                          <span className="text-sm">{tab.label}</span>
                       </button>
                    ))}
                 </div>
              </div>

              {/* Status Info */}
              <div className="bg-slate-900 rounded-[3rem] p-8 text-white shadow-2xl relative overflow-hidden group">
                 <div className="absolute top-0 right-0 w-32 h-32 bg-blue-500/20 rounded-bl-full -mr-8 -mt-8 blur-2xl"></div>
                 <h4 className="text-xl font-black tracking-tight relative z-10">System Identity</h4>
                 <div className="mt-8 space-y-6 relative z-10">
                    <div className="flex items-center justify-between text-xs font-bold text-slate-400 uppercase tracking-widest">
                       <span>Version</span>
                       <span className="text-white">v4.2.0-stable</span>
                    </div>
                    <div className="flex items-center justify-between text-xs font-bold text-slate-400 uppercase tracking-widest">
                       <span>Last Update</span>
                       <span className="text-white">Jan 05, 2026</span>
                    </div>
                    <div className="pt-4 border-t border-white/10">
                       <button className="flex items-center gap-2 text-[10px] font-black uppercase tracking-widest text-blue-400 hover:text-blue-300 transition-colors">
                          Check for Updates <ChevronRight className="w-4 h-4" />
                       </button>
                    </div>
                 </div>
              </div>
           </div>

           {/* Content Area */}
           <div className="lg:col-span-3 space-y-8">
              
              {/* Conditional Content based on activeTab */}
              <div className="bg-white rounded-[3rem] border border-slate-200 p-10 shadow-sm animate-in fade-in slide-in-from-bottom-4 duration-500">
                 <div className="flex items-center gap-4 mb-10 pb-6 border-b border-slate-50">
                    <div className="w-12 h-12 bg-slate-50 rounded-2xl flex items-center justify-center border border-slate-100">
                       {tabs.find(t => t.id === activeTab)?.icon && (() => {
                          const Icon = tabs.find(t => t.id === activeTab).icon;
                          return <Icon className="w-6 h-6 text-blue-600" />;
                       })()}
                    </div>
                    <div>
                       <h2 className="text-2xl font-black text-slate-800 tracking-tight uppercase tracking-tight">{tabs.find(t => t.id === activeTab)?.label}</h2>
                       <p className="text-xs font-bold text-slate-400 uppercase tracking-widest">Update your {activeTab} information below</p>
                    </div>
                 </div>

                 {activeTab === "general" && (
                   <div className="space-y-8 max-w-4xl">
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                         <div className="space-y-3">
                            <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest px-1">Institution Name</label>
                            <input className="w-full bg-slate-50 border border-slate-100 rounded-2xl px-6 py-4 text-sm font-bold focus:border-blue-500 outline-none transition-all" defaultValue="Al-Madrasa Al-Islamia" />
                         </div>
                         <div className="space-y-3">
                            <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest px-1">Institutional Slogan</label>
                            <input className="w-full bg-slate-50 border border-slate-100 rounded-2xl px-6 py-4 text-sm font-bold focus:border-blue-500 outline-none transition-all" defaultValue="Excellence in Islamic Education" />
                         </div>
                      </div>

                      <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                         <div className="space-y-3">
                            <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest px-1">Primary Email</label>
                            <input className="w-full bg-slate-50 border border-slate-100 rounded-2xl px-6 py-4 text-sm font-bold focus:border-blue-500 outline-none transition-all" defaultValue="admin@mms.edu" />
                         </div>
                         <div className="space-y-3">
                            <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest px-1">Phone Contact</label>
                            <input className="w-full bg-slate-50 border border-slate-100 rounded-2xl px-6 py-4 text-sm font-bold focus:border-blue-500 outline-none transition-all" defaultValue="+880 1711-223344" />
                         </div>
                         <div className="space-y-3">
                            <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest px-1">Session Starts</label>
                            <select className="w-full bg-slate-50 border border-slate-100 rounded-2xl px-6 py-4 text-sm font-bold focus:border-blue-500 outline-none appearance-none">
                               <option>January</option>
                               <option>July</option>
                            </select>
                         </div>
                      </div>

                      <div className="space-y-4 pt-6">
                         <h4 className="text-sm font-black text-slate-800 uppercase tracking-widest">Logo & Branding</h4>
                         <div className="flex items-center gap-8">
                            <div className="w-32 h-32 bg-slate-50 rounded-[2.5rem] border-2 border-dashed border-slate-200 flex flex-col items-center justify-center group hover:bg-white hover:border-blue-300 transition-all cursor-pointer">
                               <Plus className="w-6 h-6 text-slate-300 group-hover:text-blue-500 mb-2" />
                               <span className="text-[9px] font-black text-slate-400 uppercase text-center px-4">Upload Main Logo</span>
                            </div>
                            <div className="w-32 h-32 bg-slate-50 rounded-[2.5rem] border-2 border-dashed border-slate-200 flex flex-col items-center justify-center group hover:bg-white hover:border-blue-300 transition-all cursor-pointer">
                               <Plus className="w-6 h-6 text-slate-300 group-hover:text-blue-500 mb-2" />
                               <span className="text-[9px] font-black text-slate-400 uppercase text-center px-4">Favicon</span>
                            </div>
                         </div>
                      </div>
                   </div>
                 )}

                 {activeTab === "branch" && (
                   <div className="space-y-8">
                      <div className="flex justify-between items-center mb-6">
                         <h4 className="text-sm font-black text-slate-800 uppercase tracking-widest">Registered Branches</h4>
                         <button className="px-6 py-3 bg-blue-600 text-white rounded-xl text-[10px] font-black uppercase tracking-widest hover:bg-blue-700 transition-all shadow-lg shadow-blue-100">Add New Branch</button>
                      </div>
                      
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                         {[1, 2].map((i) => (
                           <div key={i} className="p-8 bg-slate-50 rounded-[2.5rem] border border-slate-100 flex items-center justify-between group hover:bg-white hover:border-blue-200 transition-all">
                              <div className="flex items-center gap-6">
                                 <div className="w-14 h-14 bg-white rounded-2xl flex items-center justify-center shadow-sm">
                                    <Building2 className="w-6 h-6 text-blue-500" />
                                 </div>
                                 <div>
                                    <h5 className="font-black text-slate-800 uppercase tracking-tight">{i === 1 ? 'Main Campus' : 'West Wing Branch'}</h5>
                                    <p className="text-xs font-bold text-slate-400 uppercase tracking-widest mt-1 italic">Dhaka, Bangladesh</p>
                                 </div>
                              </div>
                              <button className="p-3 text-slate-300 hover:text-rose-500 transition-all">
                                 <Trash2 className="w-5 h-5" />
                              </button>
                           </div>
                         ))}
                      </div>
                   </div>
                 )}

                 {/* Other tabs can be implemented similarly with high-end UI */}
              </div>

              {/* Advanced Controls Card */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mt-8">
                 <div className="bg-indigo-50/50 rounded-[3rem] p-10 border border-indigo-100/50 flex flex-col justify-between group">
                    <div>
                       <div className="w-12 h-12 bg-white rounded-2xl flex items-center justify-center shadow-sm mb-6">
                          <ShieldCheck className="w-6 h-6 text-indigo-600" />
                       </div>
                       <h3 className="text-xl font-black text-indigo-900 tracking-tight mb-4 uppercase">System Maintenance</h3>
                       <p className="text-indigo-600/60 text-sm font-bold leading-relaxed">Perform system-wide diagnostics and clear application cache to optimize performance.</p>
                    </div>
                    <button className="mt-10 w-full py-4 bg-indigo-600 text-white rounded-2xl font-black uppercase tracking-widest text-[11px] hover:bg-indigo-700 transition-all shadow-xl shadow-indigo-100">
                       Run Diagnostics
                    </button>
                 </div>
                 
                 <div className="bg-rose-50/50 rounded-[3rem] p-10 border border-rose-100/50 flex flex-col justify-between group text-rose-900">
                    <div>
                       <div className="w-12 h-12 bg-white rounded-2xl flex items-center justify-center shadow-sm mb-6">
                          <Trash2 className="w-6 h-6 text-rose-600" />
                       </div>
                       <h3 className="text-xl font-black tracking-tight mb-4 uppercase">Data Management</h3>
                       <p className="text-rose-600/60 text-sm font-bold leading-relaxed">Permanently delete archived records or reset the current session variables. Action is irreversible.</p>
                    </div>
                    <button className="mt-10 w-full py-4 bg-white border border-rose-200 text-rose-600 rounded-2xl font-black uppercase tracking-widest text-[11px] hover:bg-rose-50 transition-all">
                       Clear All Archives
                    </button>
                 </div>
              </div>

           </div>
        </div>

      </div>
    </div>
  );
};

export default SettingsPage;
