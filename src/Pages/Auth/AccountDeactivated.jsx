import { ShieldAlert, Mail, ArrowLeft, Headphones } from "lucide-react";
import { useNavigate } from "react-router-dom";

const AccountDeactivated = () => {
  const navigate = useNavigate();

  return (
    <div className="glass p-8 sm:p-12 rounded-[2.5rem] shadow-2xl border border-white/50 max-w-md w-full animate-in fade-in zoom-in duration-500 text-center">
      <div className="mb-8 relative inline-block">
        <div className="w-24 h-24 bg-rose-50 rounded-full flex items-center justify-center border-4 border-white shadow-lg ring-8 ring-rose-50/50">
          <ShieldAlert className="w-12 h-12 text-rose-500" />
        </div>
        <div className="absolute -top-1 -right-1 w-6 h-6 bg-rose-500 rounded-full border-2 border-white flex items-center justify-center">
          <span className="text-[10px] font-black text-white">!</span>
        </div>
      </div>

      <h1 className="text-3xl font-black text-slate-800 mb-4 tracking-tight">Account Deactivated</h1>
      <p className="text-slate-500 font-bold mb-8 leading-relaxed">
        Your access to the MMS Portal has been suspended. This typically happens due to administrative updates or security reviews.
      </p>

      <div className="space-y-4">
        <button 
          onClick={() => window.location.href = "mailto:support@mms.com"}
          className="w-full flex items-center justify-center gap-3 py-4 bg-slate-900 text-white font-black rounded-2xl shadow-xl hover:bg-slate-800 transition-all hover:scale-[1.02] active:scale-95"
        >
          <Mail className="w-5 h-5 text-emerald-400" />
          Contact Support
        </button>

        <button 
          onClick={() => navigate("/login")}
          className="w-full flex items-center justify-center gap-3 py-4 bg-white text-slate-700 font-black rounded-2xl border-2 border-slate-100 hover:bg-slate-50 transition-all active:scale-95"
        >
          <ArrowLeft className="w-5 h-5 text-slate-400" />
          Back to Login
        </button>
      </div>

      <div className="mt-10 pt-8 border-t border-slate-100/50 flex flex-col items-center gap-2">
        <div className="flex items-center gap-2 text-[10px] font-black text-slate-400 uppercase tracking-widest">
          <Headphones className="w-3 h-3" />
          Immediate Help Required?
        </div>
        <p className="text-xs font-bold text-slate-500">
          Call our IT Desk: <span className="text-slate-800">+880 1700 000000</span>
        </p>
      </div>
      
      {/* Subtle Background Pattern Simulation */}
      <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-rose-400 via-amber-400 to-rose-400 opacity-20" />
    </div>
  );
};

export default AccountDeactivated;
