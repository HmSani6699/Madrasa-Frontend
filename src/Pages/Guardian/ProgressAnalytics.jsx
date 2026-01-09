import { useState } from "react";
import { 
  BarChart3, 
  TrendingUp, 
  Target, 
  Zap, 
  ArrowUpRight, 
  ChevronRight,
  PieChart,
  Activity,
  Calendar
} from "lucide-react";

const ProgressAnalytics = () => {
  return (
    <div className="min-h-screen bg-slate-50/50 p-4 md:p-8 animate-in fade-in duration-500">
      <div className="max-w-[1600px] mx-auto space-y-6 md:space-y-10">
        
        {/* Header */}
        <div className="bg-white rounded-[1.5rem] md:rounded-[3rem] p-6 md:p-10 border border-slate-200 shadow-sm flex flex-col lg:flex-row justify-between items-center gap-6">
          <div className="flex items-center gap-4 md:gap-8">
            <div className="w-12 h-12 md:w-20 md:h-20 bg-indigo-50 rounded-xl md:rounded-3xl flex items-center justify-center border border-indigo-100 shadow-inner shrink-0 text-indigo-600">
              <BarChart3 className="w-6 h-6 md:w-10 md:h-10" />
            </div>
            <div>
              <h1 className="text-xl md:text-3xl font-black text-slate-800 tracking-tight uppercase leading-none mb-1 md:mb-3">Performance Analytics</h1>
              <p className="text-slate-500 font-bold mt-1 text-xs md:text-base">Deep data insights and growth tracking for Abdullah Mamun</p>
            </div>
          </div>

          <div className="flex gap-4 w-full lg:w-auto">
             <div className="flex bg-slate-100 p-1.5 rounded-2xl md:rounded-[2rem] w-full lg:w-auto">
                <button className="flex-1 px-8 py-3 bg-white text-slate-900 rounded-xl md:rounded-3xl font-black text-[10px] uppercase tracking-widest shadow-lg">Last 12 Months</button>
                <button className="flex-1 px-8 py-3 text-slate-400 font-black text-[10px] uppercase tracking-widest hover:text-slate-600 transition-all">Academic Cycle</button>
             </div>
          </div>
        </div>

        {/* Analytics Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
           
           {/* Growth Chart Placeholder */}
           <div className="lg:col-span-2 bg-white rounded-[1.5rem] md:rounded-[3rem] p-8 md:p-12 border border-slate-200 shadow-sm relative overflow-hidden group">
              <div className="flex items-center justify-between mb-12">
                 <h3 className="text-xl md:text-2xl font-black text-slate-800 uppercase tracking-tight leading-none">Global Progress Curve</h3>
                 <div className="flex items-center gap-6">
                    <div className="flex items-center gap-2 text-[9px] font-black text-slate-400 uppercase tracking-widest">
                       <span className="w-2 h-2 bg-indigo-500 rounded-full"></span> 2026 Current
                    </div>
                    <div className="flex items-center gap-2 text-[9px] font-black text-slate-300 uppercase tracking-widest">
                       <span className="w-2 h-2 bg-slate-200 rounded-full"></span> 2025 Average
                    </div>
                 </div>
              </div>

              {/* Simulated Chart Bars */}
              <div className="h-64 md:h-80 flex items-end justify-between gap-4 md:gap-8 px-4">
                 {[70, 85, 60, 95, 80, 75, 90].map((height, i) => (
                    <div key={i} className="flex-1 group/bar relative">
                       <div className="absolute -top-12 left-1/2 -translate-x-1/2 bg-slate-900 text-white text-[9px] font-black px-2 py-1 rounded opacity-0 group-hover/bar:opacity-100 transition-opacity whitespace-nowrap">
                          {height}% SCORE
                       </div>
                       <div 
                          className="w-full bg-slate-100 group-hover/bar:bg-indigo-50 rounded-t-2xl transition-all duration-700 relative overflow-hidden"
                          style={{ height: `${height}%` }}
                       >
                          <div className="absolute inset-0 bg-indigo-500 opacity-20 group-hover/bar:opacity-100 translate-y-full group-hover/bar:translate-y-0 transition-transform duration-1000"></div>
                       </div>
                       <p className="absolute -bottom-8 left-1/2 -translate-x-1/2 text-[9px] font-black text-slate-400 uppercase tracking-widest">TERM 0{i+1}</p>
                    </div>
                 ))}
              </div>
           </div>

           {/* Quick Insights */}
           <div className="space-y-8">
              <div className="bg-slate-900 rounded-[2.5rem] p-10 text-white relative overflow-hidden group shadow-2xl shadow-slate-200">
                 <Target className="absolute -right-4 -top-4 w-32 h-32 text-white/5 -rotate-12" />
                 <h3 className="text-xl font-black uppercase tracking-tight mb-8">Subject Pulse</h3>
                 <div className="space-y-6">
                    {[
                       { name: "Nahw/Sarhf", trend: "+12.5%", color: "text-emerald-400" },
                       { name: "Al-Hadith", trend: "+5.2%", color: "text-emerald-400" },
                       { name: "Ethics", trend: "-2.1%", color: "text-rose-400" },
                    ].map((item, idx) => (
                       <div key={idx} className="flex justify-between items-center bg-white/5 p-4 rounded-2xl border border-white/5 group-hover:border-white/10 transition-all">
                          <div>
                             <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-1">{item.name}</p>
                             <h4 className="text-lg font-black tracking-tight uppercase">Advancement</h4>
                          </div>
                          <div className={`text-right ${item.color} font-black text-sm`}>{item.trend}</div>
                       </div>
                    ))}
                 </div>
              </div>

              <div className="bg-white rounded-[2.5rem] p-10 border border-slate-200 shadow-sm transition-all hover:border-indigo-200 group">
                 <div className="flex items-center gap-4 mb-8">
                    <div className="w-12 h-12 bg-indigo-50 rounded-2xl flex items-center justify-center text-indigo-600 shadow-inner group-hover:scale-110 transition-transform">
                       <Zap className="w-6 h-6" />
                    </div>
                    <h4 className="text-lg font-black text-slate-800 uppercase tracking-tight leading-none">Learning Speed</h4>
                 </div>
                 <p className="text-3xl font-black text-slate-900 tracking-tight mb-4">OPTIMAL</p>
                 <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest leading-relaxed">System metrics indicate a high retention rate in foundational subjects during the last 30 days.</p>
              </div>
           </div>
        </div>

        {/* Monthly Attendance Interaction */}
        <div className="bg-white rounded-[2rem] md:rounded-[3rem] p-10 md:p-14 border border-slate-200 shadow-sm group">
           <div className="flex flex-col md:flex-row justify-between items-center gap-8 mb-12">
              <div className="flex items-center gap-6">
                 <Calendar className="w-8 h-8 text-slate-300" />
                 <div>
                    <h3 className="text-2xl font-black text-slate-800 uppercase tracking-tight leading-none">Engagement Logs</h3>
                    <p className="text-[10px] font-black text-slate-400 uppercase tracking-[3px] mt-2">JANUARY 2026 CALENDAR</p>
                 </div>
              </div>
              <button className="flex items-center gap-3 px-8 py-4 bg-slate-50 text-slate-500 rounded-2xl font-black text-[10px] uppercase tracking-widest border border-slate-100 hover:bg-slate-900 hover:text-white hover:border-slate-900 transition-all shadow-sm group/btn">
                 Download Full Log <ArrowUpRight className="w-4 h-4 group-hover/btn:translate-x-1 group-hover/btn:-translate-y-1 transition-transform" />
              </button>
           </div>
           
           <div className="grid grid-cols-7 gap-2 md:gap-4">
              {Array.from({ length: 31 }).map((_, i) => (
                 <div 
                    key={i} 
                    className={`aspect-square rounded-xl flex items-center justify-center text-[10px] font-black border transition-all cursor-pointer ${
                       i % 7 === 5 || i % 7 === 6 
                       ? 'bg-slate-50 text-slate-300 border-slate-100' 
                       : i === 8 
                       ? 'bg-rose-50 text-rose-600 border-rose-200 ring-4 ring-rose-50'
                       : 'bg-emerald-50 text-emerald-600 border-emerald-100 hover:ring-4 hover:ring-emerald-50'
                    }`}
                 >
                    {i + 1}
                 </div>
              ))}
           </div>
        </div>

      </div>
    </div>
  );
};

export default ProgressAnalytics;
