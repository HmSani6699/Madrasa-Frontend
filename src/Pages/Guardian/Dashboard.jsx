import { useState } from "react";
import { useAuth } from "../../context/AuthContext";
import {
  Users,
  CreditCard,
  GraduationCap,
  Bell,
  Calendar,
  MessageSquare,
  ArrowUpRight,
  UserCheck,
  Activity,
  Edit2,
  Phone,
  MapPin,
  Briefcase,
  ChevronRight,
  TrendingUp,
  FileText,
  ShieldCheck,
  LogOut,
  Plus
} from "lucide-react";

const GuardianDashboard = () => {
  const { user, guardianChildren, activeChild, selectChild } = useAuth();
  
  // Handlers for mock navigation/actions
  const handleEditProfile = () => console.log("Edit Profile Clicked");

  // Fallback if no children
  if (!activeChild || guardianChildren.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[60vh] p-8 text-center bg-white rounded-3xl border-2 border-dashed border-slate-200">
        <div className="w-20 h-20 bg-slate-50 rounded-full flex items-center justify-center mb-6">
          <Users className="w-10 h-10 text-slate-300" />
        </div>
        <h2 className="text-2xl font-black text-slate-800">No Students Linked</h2>
        <p className="text-slate-500 max-w-md mt-2">
          We couldn't find any student records linked to your account. Please contact the madrasa administration for assistance.
        </p>
      </div>
    );
  }

  const currentChild = activeChild;

  return (
    <div className="space-y-8 pb-12 animate-in fade-in duration-700">
      {/* Welcome & Parent Profile Quick View */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2 bg-gradient-to-br from-emerald-600 to-emerald-800 rounded-[20px] p-6  text-white shadow-2xl relative overflow-hidden group">
          <div className="absolute top-0 right-0 w-64 h-64 bg-white/5 rounded-full -mr-20 -mt-20 blur-3xl group-hover:bg-white/10 transition-all duration-700"></div>
          <div className="relative z-10">
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
              <div className="flex items-center gap-6">
                <div className="relative">
                  <div className="w-20 h-20 md:w-24 md:h-24 rounded-[2rem] border-4 border-white/20 overflow-hidden bg-white/10 flex items-center justify-center">
                    {user?.photo ? (
                      <img src={user.photo} alt={user.name} className="w-full h-full object-cover" />
                    ) : (
                      <Users className="w-10 h-10 text-white/40" />
                    )}
                  </div>
                  <div className="absolute -bottom-1 -right-1 w-8 h-8 bg-emerald-400 border-4 border-emerald-700 rounded-full flex items-center justify-center">
                    <ShieldCheck className="w-4 h-4 text-white" />
                  </div>
                </div>
                <div>
                  <h1 className="text-2xl md:text-4xl font-black tracking-tight mb-1">
                   {user?.name || "Parent"}
                  </h1>
                
                </div>
              </div>
              <button 
                onClick={handleEditProfile}
                className="flex items-center gap-3 px-6 py-3 bg-white/10 hover:bg-white/20 border border-white/10 rounded-[8px] transition-all font-bold text-sm backdrop-blur-md self-start md:self-center"
              >
                <Edit2 className="w-4 h-4" />
                Edit Profile
              </button>
            </div>

            <div className="grid grid-cols-2 md:grid-cols-2 gap-4 mt-10">
              <div className="bg-white/5 border border-white/10 rounded-2xl p-4">
                <p className="text-[10px] font-black uppercase tracking-widest text-emerald-200/60 mb-1">Phone</p>
                <p className="text-sm font-bold truncate">{user?.phone || "01XXXXXXXXX"}</p>
              </div>
              <div className="bg-white/5 border border-white/10 rounded-2xl p-4">
                <p className="text-[10px] font-black uppercase tracking-widest text-emerald-200/60 mb-1">Occupation</p>
                <p className="text-sm font-bold truncate">{user?.occupation || "Business"}</p>
              </div>
              <div className="bg-white/5 border border-white/10 rounded-2xl p-4 col-span-2">
                <p className="text-[10px] font-black uppercase tracking-widest text-emerald-200/60 mb-1">Address</p>
                <p className="text-sm font-bold truncate">{user?.address || "Dhaka, Bangladesh"}</p>
              </div>
            </div>
          </div>
        </div>

        {/* New Notices Card */}
        <div className="bg-white rounded-[20px] p-6 border-2 border-slate-100 shadow-xl shadow-slate-200/50 flex flex-col justify-between relative overflow-hidden">
          <div className="absolute -right-6 -bottom-6 w-32 h-32 bg-slate-50 rounded-full blur-2xl"></div>
          <div className="relative z-10">
            <div className="flex items-center justify-between mb-8">
              <div className="w-12 h-12 bg-amber-50 rounded-2xl flex items-center justify-center text-amber-500 border border-amber-100">
                <Bell className="w-6 h-6" />
              </div>
              <span className="px-3 py-1 bg-amber-100 text-amber-700 text-[10px] font-black uppercase rounded-lg">3 New</span>
            </div>
            <h3 className="text-xl font-black text-slate-800 mb-4 tracking-tight uppercase">Latest Notices</h3>
            <div className="space-y-4">
              <div className="flex gap-4 items-start p-3 hover:bg-slate-50 rounded-xl transition-all cursor-pointer group">
                <div className="w-2 h-2 rounded-full bg-emerald-500 mt-1.5 shrink-0 group-hover:scale-125 transition-transform"></div>
                <div>
                  <p className="text-xs font-bold text-slate-700 leading-snug">Annual Jalsa date announced for Feb 25, 2026.</p>
                  <p className="text-[9px] font-black text-slate-400 uppercase tracking-widest mt-1">2 Hours Ago</p>
                </div>
              </div>
              <div className="flex gap-4 items-start p-3 hover:bg-slate-50 rounded-xl transition-all cursor-pointer group">
                <div className="w-2 h-2 rounded-full bg-slate-300 mt-1.5 shrink-0"></div>
                <div>
                  <p className="text-xs font-bold text-slate-700 leading-snug">Mid-term results will be published on Saturday.</p>
                  <p className="text-[9px] font-black text-slate-400 uppercase tracking-widest mt-1">Yesterday</p>
                </div>
              </div>
            </div>
          </div>
          <button className="relative z-10 w-full mt-6 py-4 bg-slate-900 text-white rounded-[8px] text-[10px] font-black uppercase tracking-widest hover:bg-slate-800 transition-all shadow-lg active:scale-95">
            View All Notices
          </button>
        </div>
      </div>

    

      {/* Linked Students & Quick Links */}
      <div className="lg:col-span-3 space-y-8">
          <div className="bg-white rounded-[20px] p-6  border-2 border-slate-50 shadow-sm overflow-hidden relative group">
             <div className="flex items-center justify-between mb-10">
                <div className="flex items-center gap-4">
                   <div className="w-10 h-10 bg-emerald-50 rounded-xl flex items-center justify-center text-[#00bd7f]">
                      <Users className="w-5 h-5" />
                   </div>
                   <h2 className="text-2xl font-black text-slate-800 tracking-tight ">My Children</h2>
                </div>
               
             </div>

             <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {guardianChildren.map((child) => (
                   <div 
                      key={child.id}
                      onClick={() => selectChild(child)}
                      className={`relative group/card cursor-pointer p-6 rounded-3xl border-2 transition-all duration-300 ${
                         activeChild.id === child.id 
                         ? 'bg-slate-900 border-slate-900 shadow-2xl scale-[1.02] -translate-y-1' 
                         : 'bg-slate-50/50 border-slate-100 hover:border-emerald-200 hover:bg-white'
                      }`}
                   >
                      <div className="flex items-center gap-6">
                         <div className={`w-20 h-20 rounded-2xl flex items-center justify-center font-black text-2xl shadow-inner ${
                            activeChild.id === child.id ? 'bg-white/10 text-white' : 'bg-white text-slate-400 border border-slate-100'
                         }`}>
                           {child.initials || child.name.charAt(0)}
                         </div>
                         <div>
                            <h4 className={`text-xl font-black mb-1 ${activeChild.id === child.id ? 'text-white' : 'text-slate-800'}`}>
                               {child.name}
                            </h4>
                            <p className={`text-[10px] font-black uppercase tracking-widest ${activeChild.id === child.id ? 'text-emerald-400' : 'text-[#00bd7f]'}`}>
                               Class {child.class || "Top"} • Roll {child.roll || "01"}
                            </p>
                            <div className="flex items-center gap-2 mt-3">
                               <button className={`flex items-center gap-2 px-3 py-1.5 rounded-lg text-[9px] font-black uppercase tracking-tight transition-all ${
                                  activeChild.id === child.id ? 'bg-white/10 text-white hover:bg-white/20' : 'bg-white text-slate-500 border border-slate-100'
                               }`}>
                                  View Details
                                  <ChevronRight className="w-3 h-3" />
                               </button>
                            </div>
                         </div>
                      </div>
                      {activeChild.id === child.id && (
                        <div className="absolute top-4 right-4">
                           <div className="flex items-center gap-2 px-3 py-1 bg-emerald-500 rounded-full shadow-lg shadow-emerald-500/30">
                              <div className="w-1.5 h-1.5 bg-white rounded-full animate-pulse"></div>
                              <span className="text-[8px] font-black text-white uppercase tracking-widest">Active</span>
                           </div>
                        </div>
                      )}
                   </div>
                ))}
             </div>
          </div>

        
        </div>
    </div>
  );
};

export default GuardianDashboard;
