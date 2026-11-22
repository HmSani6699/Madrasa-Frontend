import { Outlet, Link } from "react-router-dom";
import { ArrowLeft } from "lucide-react";

const AuthLayout = () => {
  return (
    <div className="min-h-screen w-full flex flex-col items-center justify-center bg-linear-to-br from-primary-dark/10 to-secondary-dark/10 relative overflow-hidden p-4">
      {/* Background Decorative Elements */}
      <div className="absolute top-[-20%] left-[-10%] w-125 h-125 bg-primary/20 rounded-full blur-[100px] pointer-events-none" />
      <div className="absolute bottom-[-20%] right-[-10%] w-125 h-125 bg-secondary/20 rounded-full blur-[100px] pointer-events-none" />

      <div className="w-full max-w-md relative z-10">
        <div className="mb-4 text-left">
          <Link
            to="/"
            className="inline-flex items-center gap-2 text-xs sm:text-sm font-semibold text-slate-700 hover:text-emerald-800 bg-white/80 hover:bg-white px-3.5 py-1.5 rounded-full shadow-xs border border-slate-200/60 backdrop-blur-xs transition-all font-bangla"
          >
            <ArrowLeft className="w-3.5 h-3.5" />
            <span>মূল হোম পেজ</span>
          </Link>
        </div>
        <Outlet />
      </div>
    </div>
  );
};

export default AuthLayout;
