import { useState } from "react";
import { 
  User, 
  Mail, 
  Phone, 
  MapPin, 
  Award, 
  BookOpen, 
  Calendar, 
  ShieldCheck,
  Edit,
  Save,
  Camera,
  LogOut,
  ChevronRight,
  Clock,
  GraduationCap,
  AlertCircle
} from "lucide-react";

const TeacherProfile = () => {
  const [activeTab, setActiveTab] = useState("personal");
  const [isEditing, setIsEditing] = useState(false);

  const stats = [
    { label: "Experience", value: "8 Years", icon: Clock },
    { label: "Department", value: "Islamic Studies", icon: BookOpen },
    { label: "Rating", value: "4.9/5", icon: Award },
  ];

  return (
    <div className="min-h-screen bg-slate-50/50 p-4 md:p-8 animate-in fade-in duration-500">
      <div className="max-w-6xl mx-auto space-y-6 md:space-y-10">
        
        {/* Profile Card */}
        <div className="bg-white rounded-[1.5rem] md:rounded-[3rem] border border-slate-200 overflow-hidden shadow-sm shadow-slate-100">
           <div className="h-32 md:h-48 bg-slate-900 relative">
              <div className="absolute inset-0 opacity-10 bg-[url('https://www.transparenttextures.com/patterns/carbon-fibre.png')]"></div>
              <button className="absolute top-6 right-6 p-3 bg-white/10 text-white rounded-xl hover:bg-white/20 transition-all backdrop-blur-md border border-white/5">
                 <Camera className="w-5 h-5" />
              </button>
           </div>
           
           <div className="px-6 md:px-12 pb-10">
              <div className="flex flex-col md:flex-row items-end gap-6 -mt-10 md:-mt-16 relative z-10 mb-8">
                 <div className="w-32 h-32 md:w-44 md:h-44 bg-white rounded-[2rem] md:rounded-[3rem] p-2 md:p-3 shadow-2xl mx-auto md:mx-0">
                    <div className="w-full h-full bg-slate-100 rounded-[1.5rem] md:rounded-[2.5rem] flex items-center justify-center font-black text-slate-400 text-3xl md:text-5xl border-4 border-slate-50 uppercase shadow-inner">
                       AM
                    </div>
                 </div>
                 <div className="text-center md:text-left mb-2 w-full md:w-auto">
                    <h1 className="text-2xl md:text-4xl font-black text-slate-800 uppercase tracking-tight leading-none mb-2">Sheikh Abdullah Al Mamun</h1>
                    <div className="flex flex-wrap justify-center md:justify-start items-center gap-4 text-slate-500 font-bold text-xs md:text-base">
                       <span className="flex items-center gap-2">Senior Lecturer <ShieldCheck className="w-4 h-4 text-emerald-500" /></span>
                       <span className="hidden md:block">|</span>
                       <span>Staff ID: MMS-教师-2026-0042</span>
                    </div>
                 </div>
                 <div className="md:ml-auto flex gap-3 w-full md:w-auto">
                    <button 
                       onClick={() => setIsEditing(!isEditing)}
                       className="flex-1 md:flex-none px-6 md:px-8 py-3.5 md:py-4 bg-slate-900 text-white rounded-xl md:rounded-2xl font-black text-[10px] uppercase tracking-widest hover:bg-slate-800 transition-all flex items-center justify-center gap-3 active:scale-95 shadow-lg shadow-slate-200"
                    >
                       {isEditing ? <Save className="w-4 h-4" /> : <Edit className="w-4 h-4" />}
                       {isEditing ? "Save Changes" : "Edit Profile"}
                    </button>
                    <button className="p-3.5 md:p-4 bg-rose-50 text-rose-600 rounded-xl md:rounded-2xl hover:bg-rose-100 transition-all border border-rose-100">
                       <LogOut className="w-5 h-5" />
                    </button>
                 </div>
              </div>

              {/* Stats Bar */}
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 md:gap-8 pt-8 border-t border-slate-100">
                 {stats.map((stat, idx) => (
                    <div key={idx} className="flex items-center gap-4 p-4 md:p-6 bg-slate-50/50 rounded-2xl md:rounded-3xl border border-slate-100 group hover:border-indigo-100 transition-all">
                       <div className="w-10 h-10 md:w-12 md:h-12 bg-white rounded-xl flex items-center justify-center text-indigo-600 shadow-sm group-hover:scale-110 transition-transform">
                          <stat.icon className="w-5 h-5" />
                       </div>
                       <div>
                          <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-0.5">{stat.label}</p>
                          <p className="text-sm md:text-base font-black text-slate-800 uppercase tracking-tight">{stat.value}</p>
                       </div>
                    </div>
                 ))}
              </div>
           </div>
        </div>

        {/* Tabbed Content Area */}
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
           
           {/* Sidebar Tabs */}
           <div className="lg:col-span-1 space-y-3">
              {[
                 { id: 'personal', label: 'Personal Details', icon: User },
                 { id: 'academic', label: 'Academic Info', icon: GraduationCap },
                 { id: 'security', label: 'Security & Auth', icon: ShieldCheck },
              ].map(tab => (
                 <button 
                    key={tab.id}
                    onClick={() => setActiveTab(tab.id)}
                    className={`w-full flex items-center justify-between p-5 rounded-[1.5rem] font-black text-[10px] uppercase tracking-widest transition-all ${
                       activeTab === tab.id 
                       ? 'bg-slate-900 text-white shadow-xl shadow-slate-200' 
                       : 'bg-white text-slate-400 border border-slate-200 hover:bg-slate-50 hover:text-slate-600'
                    }`}
                 >
                    <span className="flex items-center gap-4">
                       <tab.icon className="w-5 h-5" /> {tab.label}
                    </span>
                    <ChevronRight className={`w-4 h-4 transition-transform ${activeTab === tab.id ? 'rotate-90' : ''}`} />
                 </button>
              ))}
           </div>

           {/* Main Content Form */}
           <div className="lg:col-span-3">
              <div className="bg-white rounded-[1.5rem] md:rounded-[3rem] p-8 md:p-12 border border-slate-200 shadow-sm min-h-[500px] animate-in slide-in-from-right duration-500">
                 {activeTab === 'personal' && (
                    <div className="space-y-8">
                       <h3 className="text-xl md:text-2xl font-black text-slate-800 uppercase tracking-tight mb-8">Identification Details</h3>
                       <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                          {[
                             { label: 'Full Official Name', value: 'Sheikh Abdullah Al Mamun', icon: User },
                             { label: 'Primary Email Address', value: 'teacher@mms.com', icon: Mail },
                             { label: 'Contact Phone Number', value: '+880 1711-223344', icon: Phone },
                             { label: 'Home Address', value: 'Gulshan-2, Dhaka, Bangladesh', icon: MapPin },
                             { label: 'Date of Birth', value: 'May 12, 1985', icon: Calendar },
                             { label: 'Blood Group', value: 'O Positive (O+)', icon: Award },
                          ].map((field, idx) => (
                             <div key={idx} className="space-y-3">
                                <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest block">{field.label}</label>
                                <div className="relative group">
                                   <div className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-300 group-hover:text-indigo-500 transition-colors">
                                      <field.icon className="w-4 h-4" />
                                   </div>
                                   <input 
                                      readOnly={!isEditing}
                                      defaultValue={field.value}
                                      className={`w-full bg-slate-50 border rounded-2xl pl-12 pr-6 py-4 text-sm font-bold outline-none transition-all ${
                                         isEditing 
                                         ? 'border-indigo-100 bg-white focus:border-indigo-500 shadow-inner' 
                                         : 'border-slate-50 pointer-events-none'
                                      }`}
                                   />
                                </div>
                             </div>
                          ))}
                       </div>
                    </div>
                 )}

                 {activeTab === 'academic' && (
                    <div className="space-y-8 animate-in fade-in">
                       <h3 className="text-xl md:text-2xl font-black text-slate-800 uppercase tracking-tight mb-8">Professional Qualification</h3>
                       <div className="p-8 bg-slate-50 rounded-[2rem] border border-slate-100">
                           <div className="space-y-6">
                              <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 p-5 bg-white rounded-2xl border border-slate-50 shadow-sm">
                                 <div>
                                    <p className="text-[10px] font-black text-indigo-500 uppercase tracking-widest mb-1">Masters In Islamic Law</p>
                                    <h4 className="text-sm font-black text-slate-800">Al-Azhar University, Egypt (2014)</h4>
                                 </div>
                                 <span className="px-3 py-1 bg-emerald-50 text-emerald-600 rounded-full text-[9px] font-black uppercase tracking-widest border border-emerald-100">Verified Document</span>
                              </div>
                              <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 p-5 bg-white rounded-2xl border border-slate-50 shadow-sm opacity-60">
                                 <div>
                                    <p className="text-[10px] font-black text-indigo-500 uppercase tracking-widest mb-1">Bachelor In Arabic Literature</p>
                                    <h4 className="text-sm font-black text-slate-800">Islamic University, Madinah (2010)</h4>
                                 </div>
                              </div>
                           </div>
                       </div>
                    </div>
                 )}

                 {activeTab === 'security' && (
                    <div className="space-y-8 animate-in fade-in">
                       <h3 className="text-xl md:text-2xl font-black text-slate-800 uppercase tracking-tight mb-8">Access Control</h3>
                       <div className="max-w-md space-y-6">
                           <button className="w-full py-4 bg-slate-50 border border-slate-100 rounded-2xl text-slate-600 font-bold text-xs hover:bg-slate-100 transition-all flex items-center justify-center gap-3">
                              Change Account Password
                           </button>
                           <button className="w-full py-4 bg-slate-50 border border-slate-100 rounded-2xl text-slate-600 font-bold text-xs hover:bg-slate-100 transition-all flex items-center justify-center gap-3">
                              Enable Two-Factor Authentication (2FA)
                           </button>
                           <hr className="border-slate-100 my-8" />
                           <div className="p-6 bg-rose-50 rounded-2xl border border-rose-100">
                              <p className="text-[10px] font-black text-rose-600 uppercase tracking-widest mb-2 flex items-center gap-2">
                                 <AlertCircle className="w-4 h-4" /> Critical Action
                              </p>
                              <p className="text-xs font-bold text-rose-500 leading-relaxed mb-4">Requesting account deactivation will permanently disable your teaching portal access.</p>
                              <button className="text-[10px] font-black text-rose-600 uppercase tracking-widest hover:underline">
                                 Contact System Administrator
                              </button>
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

export default TeacherProfile;
