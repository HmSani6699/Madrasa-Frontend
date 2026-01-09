import { useState } from "react";
import { 
  User, 
  Mail, 
  Phone, 
  MapPin, 
  ShieldCheck, 
  Edit, 
  Save, 
  Camera, 
  LogOut,
  ChevronRight,
  Briefcase,
  Users,
  AlertCircle
} from "lucide-react";

const GuardianProfile = () => {
  const [isEditing, setIsEditing] = useState(false);

  return (
    <div className="min-h-screen bg-slate-50/50 p-4 md:p-8 animate-in fade-in duration-500">
      <div className="max-w-6xl mx-auto space-y-10">
        
        {/* Profile Card */}
        <div className="bg-white rounded-[1.5rem] md:rounded-[3rem] border border-slate-200 overflow-hidden shadow-sm">
           <div className="h-32 md:h-48 bg-slate-900 relative">
              <div className="absolute inset-0 opacity-10 bg-[url('https://www.transparenttextures.com/patterns/carbon-fibre.png')]"></div>
           </div>
           
           <div className="px-6 md:px-12 pb-10">
              <div className="flex flex-col md:flex-row items-end gap-6 -mt-12 md:-mt-20 relative z-10 mb-8">
                 <div className="w-32 h-32 md:w-44 md:h-44 bg-white rounded-[2rem] md:rounded-[3rem] p-2 md:p-3 shadow-2xl mx-auto md:mx-0">
                    <div className="w-full h-full bg-slate-100 rounded-[1.5rem] md:rounded-[2.5rem] flex items-center justify-center font-black text-slate-400 text-3xl md:text-5xl border-4 border-slate-50 uppercase shadow-inner">
                       AR
                    </div>
                 </div>
                 <div className="text-center md:text-left mb-2 flex-1">
                    <h1 className="text-2xl md:text-4xl font-black text-slate-800 uppercase tracking-tight leading-none mb-2">Abdur Rahman</h1>
                    <div className="flex flex-wrap justify-center md:justify-start items-center gap-4 text-slate-500 font-bold text-xs md:text-base">
                       <span className="flex items-center gap-2">Primary Guardian <ShieldCheck className="w-4 h-4 text-emerald-500" /></span>
                       <span className="hidden md:block">|</span>
                       <span>ID: GRD-2026-0082</span>
                    </div>
                 </div>
                 <div className="flex gap-3 w-full md:w-auto">
                    <button 
                       onClick={() => setIsEditing(!isEditing)}
                       className="flex-1 md:flex-none px-8 py-4 bg-slate-900 text-white rounded-2xl font-black text-[10px] uppercase tracking-widest hover:bg-slate-800 transition-all flex items-center justify-center gap-3 shadow-lg active:scale-95"
                    >
                       {isEditing ? <Save className="w-4 h-4" /> : <Edit className="w-4 h-4" />}
                       {isEditing ? "Sync Profile" : "Edit Profile"}
                    </button>
                 </div>
              </div>

              {/* Stats Bar */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6 pt-8 border-t border-slate-100">
                 {[
                    { label: "Linked Children", value: "02 Enrolled", icon: Users, color: "text-indigo-600", bg: "bg-indigo-50" },
                    { label: "Profession", value: "Business Manager", icon: Briefcase, color: "text-amber-600", bg: "bg-amber-50" },
                    { label: "Account Status", value: "Verified Active", icon: ShieldCheck, color: "text-emerald-600", bg: "bg-emerald-50" },
                 ].map((stat, idx) => (
                    <div key={idx} className="flex items-center gap-4 p-5 bg-slate-50/50 rounded-2xl border border-slate-100 group hover:border-slate-200 transition-all">
                       <div className={`w-12 h-12 ${stat.bg} ${stat.color} rounded-xl flex items-center justify-center shadow-inner group-hover:scale-110 transition-transform`}>
                          <stat.icon className="w-6 h-6" />
                       </div>
                       <div>
                          <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest leading-none mb-1">{stat.label}</p>
                          <p className="text-base font-black text-slate-800 uppercase tracking-tight">{stat.value}</p>
                       </div>
                    </div>
                 ))}
              </div>
           </div>
        </div>

        {/* Content Area */}
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
           <div className="lg:col-span-1 space-y-4">
              <button className="w-full flex items-center justify-between p-6 bg-slate-900 text-white rounded-3xl font-black text-[10px] uppercase tracking-widest shadow-xl shadow-slate-200">
                 <span className="flex items-center gap-4"><User className="w-5 h-5" /> Personal Records</span>
                 <ChevronRight className="w-4 h-4" />
              </button>
           </div>

           <div className="lg:col-span-3">
              <div className="bg-white rounded-[2.5rem] md:rounded-[3.5rem] p-8 md:p-12 border border-slate-200 shadow-sm animate-in slide-in-from-right duration-500">
                 <h3 className="text-2xl font-black text-slate-800 uppercase tracking-tight mb-10">Identification Details</h3>
                 <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                    {[
                       { label: 'Full Official Name', value: 'Abdur Rahman', icon: User },
                       { label: 'Primary Contact', value: '+880 1711-223344', icon: Phone },
                       { label: 'Email Address', value: 'parent@mms.com', icon: Mail },
                       { label: 'Residential Address', value: 'Gulshan-1, Dhaka, Bangladesh', icon: MapPin },
                       { label: 'Emergency Contact', value: '+880 1822-334455', icon: Phone },
                       { label: 'Relationship', value: 'Father', icon: Users },
                    ].map((field, idx) => (
                       <div key={idx} className="space-y-3">
                          <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest block">{field.label}</label>
                          <div className="relative group">
                             <div className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-300">
                                <field.icon className="w-4 h-4" />
                             </div>
                             <input 
                                readOnly={!isEditing}
                                defaultValue={field.value}
                                className={`w-full bg-slate-50 border rounded-2xl pl-12 pr-6 py-4 text-sm font-bold outline-none transition-all ${
                                   isEditing 
                                   ? 'border-slate-800 bg-white shadow-inner ring-4 ring-slate-50' 
                                   : 'border-slate-50'
                                }`}
                             />
                          </div>
                       </div>
                    ))}
                 </div>

                 <div className="mt-12 p-8 bg-rose-50 rounded-[2rem] border border-rose-100 flex flex-col md:flex-row items-center gap-8 justify-between">
                    <div className="text-center md:text-left">
                       <h4 className="flex items-center justify-center md:justify-start gap-2 text-[11px] font-black text-rose-600 uppercase tracking-widest mb-2">
                          <AlertCircle className="w-4 h-4" /> Security Notice
                       </h4>
                       <p className="text-xs font-bold text-rose-500 leading-relaxed max-w-md uppercase tracking-tight">Your primary mobile number is used for OTP verification during financial transactions.</p>
                    </div>
                    <button className="px-8 py-4 bg-white text-rose-600 border border-rose-100 rounded-2xl font-black text-[10px] uppercase tracking-widest hover:bg-rose-600 hover:text-white transition-all shadow-sm">
                       Change Secret Key
                    </button>
                 </div>
              </div>
           </div>
        </div>

      </div>
    </div>
  );
};

export default GuardianProfile;
