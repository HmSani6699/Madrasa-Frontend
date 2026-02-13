import { useState } from "react";
import { useAuth } from "../../context/AuthContext";
import { 
  User, 
  Mail, 
  Phone, 
  MapPin, 
  ShieldCheck, 
  Edit2, 
  Save, 
  Camera, 
  Briefcase,
  Users,
  AlertCircle,
  Key,
  Calendar,
  Settings,
  ArrowRight
} from "lucide-react";

const GuardianProfile = () => {
  const { user } = useAuth();
  const [isEditing, setIsEditing] = useState(false);
  
  // Handlers for profile actions
  const handleToggleEdit = () => setIsEditing(!isEditing);
  const handleSave = () => {
    setIsEditing(false);
    // Logic for saving profile would go here
  };

  return (
    <div className="space-y-8 pb-12 animate-in fade-in duration-700">
      {/* Profile Header Card */}
      <div className="bg-white rounded-[2.5rem] border-2 border-slate-50 overflow-hidden shadow-xl shadow-slate-200/50">
        <div className="h-40 md:h-64 bg-gradient-to-r from-emerald-600 to-emerald-800 relative overflow-hidden">
          <div className="absolute inset-0 opacity-20 flex flex-wrap gap-4 p-8 pointer-events-none">
             {Array.from({ length: 20 }).map((_, i) => (
                <div key={i} className="w-12 h-12 border-2 border-white/20 rounded-xl"></div>
             ))}
          </div>
          <div className="absolute -bottom-12 -right-12 w-48 h-48 bg-white/10 rounded-full blur-3xl"></div>
        </div>
        
        <div className="px-8 md:px-16 pb-12">
          <div className="flex flex-col md:flex-row items-end gap-8 -mt-20 md:-mt-28 relative z-10 mb-10">
            <div className="group relative mx-auto md:mx-0">
              <div className="w-40 h-40 md:w-52 md:h-52 bg-white rounded-[3rem] p-3 shadow-2xl relative overflow-hidden">
                <div className="w-full h-full bg-slate-100 rounded-[2.2rem] flex items-center justify-center border-4 border-slate-50 overflow-hidden">
                  {user?.photo ? (
                    <img src={user.photo} alt={user.name} className="w-full h-full object-cover" />
                  ) : (
                    <User className="w-16 h-16 text-slate-300" />
                  )}
                </div>
              </div>
              <button className="absolute bottom-4 right-4 w-12 h-12 bg-emerald-500 rounded-2xl border-4 border-white flex items-center justify-center text-white shadow-lg hover:scale-110 transition-transform">
                <Camera className="w-5 h-5" />
              </button>
            </div>

            <div className="text-center md:text-left flex-1 mb-2">
              <div className="flex items-center justify-center md:justify-start gap-4 mb-3">
                 <h1 className="text-3xl md:text-5xl font-black text-slate-800 tracking-tight leading-none uppercase">{user?.name || "Guardian"}</h1>
                 <div className="hidden md:flex items-center gap-2 px-3 py-1 bg-emerald-50 text-emerald-600 rounded-full border border-emerald-100 uppercase tracking-widest font-black text-[9px]">
                    <ShieldCheck className="w-3 h-3" />
                    Verified
                 </div>
              </div>
              <div className="flex flex-wrap justify-center md:justify-start items-center gap-6 text-slate-400 font-black text-[10px] uppercase tracking-widest">
                <span className="flex items-center gap-2">Parent Role</span>
                <span className="w-1.5 h-1.5 bg-slate-200 rounded-full"></span>
                <span>ID: {user?.id || "GRD-2026-XXXX"}</span>
                <span className="w-1.5 h-1.5 bg-slate-200 rounded-full"></span>
                <span className="flex items-center gap-2">Member since Jan 2026</span>
              </div>
            </div>

            <div className="flex gap-4 w-full md:w-auto self-center md:self-end mb-2">
              <button 
                onClick={isEditing ? handleSave : handleToggleEdit}
                className={`flex-1 md:flex-none px-10 py-4 rounded-2xl font-black text-[10px] uppercase tracking-widest transition-all flex items-center justify-center gap-3 shadow-xl hover:shadow-emerald-100 active:scale-95 ${
                  isEditing ? 'bg-emerald-600 text-white shadow-emerald-200' : 'bg-slate-900 text-white shadow-slate-200'
                }`}
              >
                {isEditing ? <Save className="w-4 h-4" /> : <Settings className="w-4 h-4" />}
                {isEditing ? "Sync Profile" : "Edit Profile"}
              </button>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-4 gap-6 pt-10 border-t-2 border-slate-50">
             {[
                { label: "Phone Number", value: user?.phone || "017XXXXXXXX", icon: Phone, color: "text-blue-600", bg: "bg-blue-50" },
                { label: "Occupation", value: user?.occupation || "Business Owner", icon: Briefcase, color: "text-amber-600", bg: "bg-amber-50" },
                { label: "Residential Type", value: "Permanent Resident", icon: User, color: "text-indigo-600", bg: "bg-indigo-50" },
                { label: "Connected Children", value: "02 Active Students", icon: Users, color: "text-emerald-600", bg: "bg-emerald-50" },
             ].map((item, idx) => (
                <div key={idx} className="p-6 bg-slate-50/50 rounded-3xl border border-slate-100 group hover:bg-white hover:border-slate-200 transition-all cursor-default">
                   <div className="flex items-center gap-4">
                      <div className={`w-12 h-12 ${item.bg} ${item.color} rounded-xl flex items-center justify-center shadow-inner group-hover:scale-110 transition-transform`}>
                         <item.icon className="w-5 h-5" />
                      </div>
                      <div>
                        <p className="text-[9px] font-black text-slate-400 uppercase tracking-widest mb-1">{item.label}</p>
                        <p className="text-sm font-black text-slate-800 uppercase tracking-tight">{item.value}</p>
                      </div>
                   </div>
                </div>
             ))}
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2 space-y-8">
           {/* Detailed Information Section */}
           <div className="bg-white rounded-[3rem] p-10 md:p-14 border-2 border-slate-50 shadow-sm relative overflow-hidden group">
              <div className="absolute -right-6 -top-6 w-32 h-32 bg-slate-50 rounded-full blur-2xl"></div>
              <h3 className="text-2xl font-black text-slate-800 uppercase tracking-tight mb-12 flex items-center gap-4 relative z-10">
                 <div className="w-10 h-10 bg-slate-900 rounded-xl flex items-center justify-center text-white">
                    <User className="w-5 h-5" />
                 </div>
                 Personal Dossier
              </h3>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-x-12 gap-y-10 relative z-10">
                 {[
                    { label: "Legal Full Name", value: user?.name || "Abdur Rahman", icon: User },
                    { label: "Primary Contact", value: user?.phone || "017XXXXXXXX", icon: Phone },
                    { label: "Email Address", value: user?.email || "parent@mms.com", icon: Mail },
                    { label: "Postal Address", value: user?.address || "Dhaka, Bangladesh", icon: MapPin },
                    { label: "Emergency Connect", value: "+880 1822-XXXXXXXX", icon: Phone },
                    { label: "Guardian Role", value: "Father", icon: Users }
                 ].map((field, idx) => (
                    <div key={idx} className="space-y-3">
                       <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">{field.label}</label>
                       <div className="relative group">
                          <div className={`absolute left-5 top-1/2 -translate-y-1/2 transition-colors ${isEditing ? 'text-emerald-500' : 'text-slate-300 group-hover:text-slate-500'}`}>
                             <field.icon className="w-4 h-4" />
                          </div>
                          <input 
                             readOnly={!isEditing}
                             defaultValue={field.value}
                             className={`w-full pl-14 pr-6 py-5 bg-slate-50 rounded-2xl text-sm font-black uppercase tracking-tight border-2 transition-all outline-none ${
                                isEditing 
                                ? 'border-emerald-500 bg-white shadow-xl shadow-emerald-50 ring-4 ring-emerald-50' 
                                : 'border-slate-100 group-hover:border-slate-200 focus:border-slate-300'
                             } ${!isEditing && 'cursor-default'}`}
                          />
                       </div>
                    </div>
                 ))}
              </div>

              {isEditing && (
                 <div className="mt-12 flex gap-4 animate-in slide-in-from-bottom duration-300">
                    <button onClick={handleSave} className="flex-1 py-5 bg-emerald-600 text-white rounded-2xl font-black text-[10px] uppercase tracking-widest shadow-xl shadow-emerald-100 hover:bg-emerald-700 transition-all">Save Changes</button>
                    <button onClick={handleToggleEdit} className="px-10 py-5 bg-slate-100 text-slate-500 rounded-2xl font-black text-[10px] uppercase tracking-widest hover:bg-slate-200 transition-all">Cancel</button>
                 </div>
              )}
           </div>
        </div>

        <div className="space-y-8">
           {/* Security Settings Section */}
           <div className="bg-slate-900 rounded-[2.5rem] p-10 text-white shadow-2xl relative overflow-hidden group">
              <Key className="absolute -right-6 -bottom-6 w-32 h-32 text-white/5 -rotate-12 group-hover:rotate-0 transition-all duration-700" />
              <h3 className="text-xl font-black uppercase tracking-tight mb-8 relative z-10">Security Shield</h3>
              <div className="space-y-4 relative z-10">
                 <button className="w-full py-5 bg-white/5 hover:bg-white/10 border border-white/10 rounded-2xl text-[10px] font-black uppercase tracking-widest transition-all flex items-center justify-between px-6">
                    <span className="flex items-center gap-3">
                       <Key className="w-4 h-4 text-amber-500" />
                       Update Password
                    </span>
                    <ArrowRight className="w-4 h-4 opacity-40" />
                 </button>
                 <button className="w-full py-5 bg-white/5 hover:bg-white/10 border border-white/10 rounded-2xl text-[10px] font-black uppercase tracking-widest transition-all flex items-center justify-between px-6">
                    <span className="flex items-center gap-3">
                       <ShieldCheck className="w-4 h-4 text-emerald-500" />
                       Two-Factor Auth
                    </span>
                    <ArrowRight className="w-4 h-4 opacity-40" />
                 </button>
                 <div className="p-6 bg-rose-500/10 rounded-2xl border border-rose-500/10 mt-6">
                   <div className="flex items-start gap-4">
                     <AlertCircle className="w-5 h-5 text-rose-500 mt-1 shrink-0" />
                     <div>
                       <p className="text-[10px] font-black text-rose-500 uppercase tracking-widest mb-1">Critical Notice</p>
                       <p className="text-[10px] font-bold text-slate-300 leading-normal uppercase">Ensure your mobile number is updated to receive important institution alerts.</p>
                     </div>
                   </div>
                 </div>
              </div>
           </div>

          
        </div>
      </div>
    </div>
  );
};

// Internal icon
const Clock = ({ className }) => (
  <svg className={className} xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="10"></circle><polyline points="12 6 12 12 16 14"></polyline></svg>
);

export default GuardianProfile;
