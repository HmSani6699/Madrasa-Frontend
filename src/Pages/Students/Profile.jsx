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
  GraduationCap,
  Award,
  Calendar,
  Fingerprint
} from "lucide-react";

const StudentProfile = () => {
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
                    <div className="w-full h-full bg-slate-100 rounded-[1.5rem] md:rounded-[2.5rem] flex items-center justify-center font-black text-slate-400 text-3xl md:text-5xl border-4 border-slate-50 uppercase shadow-inner relative overflow-hidden group">
                       AM
                       <div className="absolute inset-0 bg-black/50 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity cursor-pointer">
                          <Camera className="w-8 h-8 text-white" />
                       </div>
                    </div>
                 </div>
                 <div className="text-center md:text-left mb-2 flex-1">
                    <h1 className="text-2xl md:text-4xl font-black text-slate-800 uppercase tracking-tight leading-none mb-2">Abdullah Mamun</h1>
                    <div className="flex flex-wrap justify-center md:justify-start items-center gap-4 text-slate-500 font-bold text-xs md:text-base">
                       <span className="flex items-center gap-2">Mishkat Department <GraduationCap className="w-4 h-4 text-indigo-500" /></span>
                       <span className="hidden md:block">|</span>
                       <span className="flex items-center gap-2">ID: <Fingerprint className="w-4 h-4 text-black" /> 26010082</span>
                    </div>
                 </div>
                 <div className="flex gap-3 w-full md:w-auto">
                    <button 
                       onClick={() => setIsEditing(!isEditing)}
                       className="flex-1 md:flex-none px-8 py-4 bg-slate-900 text-white rounded-2xl font-black text-[10px] uppercase tracking-widest hover:bg-slate-800 transition-all flex items-center justify-center gap-3 shadow-lg active:scale-95"
                    >
                       {isEditing ? <Save className="w-4 h-4" /> : <Edit className="w-4 h-4" />}
                       {isEditing ? "Save Changes" : "Edit Details"}
                    </button>
                 </div>
              </div>

              {/* Stats Bar */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6 pt-8 border-t border-slate-100">
                 {[
                    { label: "Attendance Rate", value: "94.5%", icon: Calendar, color: "text-emerald-600", bg: "bg-emerald-50" },
                    { label: "Academic Standing", value: "Distinction", icon: Award, color: "text-amber-600", bg: "bg-amber-50" },
                    { label: "Account Status", value: "Active Student", icon: ShieldCheck, color: "text-indigo-600", bg: "bg-indigo-50" },
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
                 <span className="flex items-center gap-4"><User className="w-5 h-5" /> Student Bio</span>
                 <ChevronRight className="w-4 h-4" />
              </button>
              <button className="w-full flex items-center justify-between p-6 bg-white border border-slate-200 text-slate-400 rounded-3xl font-black text-[10px] uppercase tracking-widest hover:border-slate-800 hover:text-slate-800 transition-all">
                 <span className="flex items-center gap-4"><ShieldCheck className="w-5 h-5" /> Security</span>
                 <ChevronRight className="w-4 h-4" />
              </button>
              <button className="w-full flex items-center justify-between p-6 bg-rose-50 border border-rose-100 text-rose-600 rounded-3xl font-black text-[10px] uppercase tracking-widest hover:bg-rose-100 transition-all mt-8">
                 <span className="flex items-center gap-4"><LogOut className="w-5 h-5" /> Sign Out</span>
              </button>
           </div>

           <div className="lg:col-span-3">
              <div className="bg-white rounded-[2.5rem] md:rounded-[3.5rem] p-8 md:p-12 border border-slate-200 shadow-sm animate-in slide-in-from-right duration-500">
                 <h3 className="text-2xl font-black text-slate-800 uppercase tracking-tight mb-10">Personal Information</h3>
                 <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                    {[
                       { label: 'Full Legal Name', value: 'Abdullah Al Mamun', icon: User },
                       { label: 'Date of Birth', value: '12 Oct, 2008', icon: Calendar },
                       { label: 'Email Address', value: 'student@mms.com', icon: Mail },
                       { label: 'Primary Contact', value: '+880 1711-223344', icon: Phone },
                       { label: 'Residential Address', value: 'Mirpur-10, Dhaka', icon: MapPin },
                       { label: 'Guardian Contact', value: '+880 1822-334455', icon: Phone },
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

                 <div className="mt-12 p-8 bg-slate-50 rounded-[2rem] border border-slate-100">
                    <h4 className="flex items-center gap-2 text-[11px] font-black text-slate-500 uppercase tracking-widest mb-4">
                       <Award className="w-4 h-4" /> Institutional Badges
                    </h4>
                    <div className="flex flex-wrap gap-4">
                       {['Hifz Completed', 'Sports Captain', 'Best Attendance'].map((tag, i) => (
                          <span key={i} className="px-6 py-3 bg-white border border-slate-200 rounded-xl text-[10px] font-black text-slate-600 uppercase tracking-widest shadow-sm">
                             {tag}
                          </span>
                       ))}
                    </div>
                 </div>
              </div>
           </div>
        </div>

      </div>
    </div>
  );
};

export default StudentProfile;
