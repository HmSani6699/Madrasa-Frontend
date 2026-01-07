import { CloudSun, CalendarDays, Bell, Search } from "lucide-react";
import { useAuth } from "../../context/AuthContext";

const GreetingHeader = () => {
    const { user } = useAuth();
    
    // Dates
    const today = new Date();
    const options = { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' };
    const gregorianDate = today.toLocaleDateString('en-US', options);
    const hijriDate = "14 Rajab, 1445 AH"; 

    const hour = today.getHours();
    let greeting = "Good Morning";
    if (hour >= 12 && hour < 17) greeting = "Good Afternoon";
    else if (hour >= 17) greeting = "Good Evening";

  return (
    <div className="relative mb-10 group">
      {/* Background Layer with Deep Gradient */}
      <div className="absolute inset-x-0 -top-10 -bottom-10 bg-gradient-to-b from-primary/5 to-transparent rounded-[3rem] -z-10 blur-2xl opacity-50 transition-all group-hover:opacity-70" />
      
      <div className="bg-gradient-to-br from-[#059669] via-[#047857] to-[#065f46] rounded-[2.5rem] p-8 md:p-12 text-white shadow-2xl shadow-primary/20 relative overflow-hidden">
          {/* Enhanced Decorative Elements */}
          <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-white/10 rounded-full blur-[100px] -mr-32 -mt-32 pointer-events-none animate-pulse-slow"></div>
          <div className="absolute bottom-0 left-0 w-80 h-80 bg-black/10 rounded-full blur-[80px] -ml-20 -mb-20 pointer-events-none"></div>
          
          <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-10 relative z-10">
              <div className="flex-1">
                  <div className="flex items-center gap-3 mb-6">
                      <div className="w-12 h-12 bg-white/15 backdrop-blur-md rounded-2xl flex items-center justify-center border border-white/20 shadow-lg">
                          <CloudSun className="w-6 h-6 text-emerald-50" />
                      </div>
                      <div>
                        <p className="text-emerald-100/80 text-xs font-bold uppercase tracking-[0.2em]">{greeting},</p>
                        <h1 className="text-4xl md:text-5xl font-black tracking-tight mt-1">
                            {user?.name || "Muhtamim"}
                        </h1>
                      </div>
                  </div>
                  
                  <p className="text-emerald-50/90 text-lg md:text-xl font-medium max-w-2xl leading-relaxed">
                      Assalamu Alaikum. It's a productive day ahead. You have <span className="bg-white/20 px-3 py-1 rounded-full font-bold text-white border border-white/10 mx-1">3 key actions</span> waiting for your approval in the command center.
                  </p>
                  
                  <div className="flex flex-wrap items-center gap-4 mt-10">
                      <button className="px-6 py-3 bg-white text-primary font-black text-sm rounded-xl shadow-xl hover:scale-105 transition-all active:scale-95">
                          Open Action Center
                      </button>
                      <button className="px-6 py-3 bg-white/10 backdrop-blur-md border border-white/20 text-white font-bold text-sm rounded-xl hover:bg-white/20 transition-all">
                          Manage Admissions
                      </button>
                  </div>
              </div>

              {/* Glassmorphism Date Card */}
              <div className="lg:w-80 group/card">
                  <div className="bg-white/10 backdrop-blur-xl rounded-[2rem] p-8 border border-white/20 shadow-2xl relative overflow-hidden group-hover/card:bg-white/15 transition-all">
                      <div className="absolute top-0 right-0 p-4 opacity-20 capitalize text-[8px] font-black tracking-[0.3em] rotate-90 origin-top-right">Institutional View</div>
                      
                      <div className="flex items-center gap-5 mb-8">
                          <div className="w-14 h-14 bg-white rounded-2xl flex items-center justify-center text-primary shadow-xl rotate-[-6deg] group-hover/card:rotate-0 transition-transform">
                              <CalendarDays className="w-7 h-7" />
                          </div>
                          <div>
                              <p className="text-[10px] text-emerald-100 font-black uppercase tracking-widest leading-none mb-1">Current Date</p>
                              <p className="text-sm font-bold text-white tracking-wide">Today's Schedule</p>
                          </div>
                      </div>
                      
                      <div className="space-y-4">
                          <div className="p-4 bg-white/10 rounded-2xl border border-white/5">
                             <p className="text-xs font-black text-emerald-200 uppercase tracking-widest mb-1">Gregorian</p>
                             <p className="font-bold text-lg">{gregorianDate}</p>
                          </div>
                          <div className="p-4 bg-primary/20 rounded-2xl border border-white/5">
                             <p className="text-xs font-black text-emerald-300 uppercase tracking-widest mb-1">Islamic (Hijri)</p>
                             <p className="font-bold text-lg text-emerald-50">{hijriDate}</p>
                          </div>
                      </div>
                  </div>
              </div>
          </div>
      </div>
    </div>
  );
};

export default GreetingHeader;
