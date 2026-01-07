import { UserCheck, Users, TrendingUp, AlertCircle, Clock, Banknote } from "lucide-react";

const PulseCard = ({ title, value, subValue, icon: Icon, colorTheme, delay }) => {
    const themes = {
        emerald: "bg-emerald-50 dark:bg-emerald-900/10 text-emerald-600 border-emerald-100 dark:border-emerald-800/50 shine-emerald",
        blue: "bg-blue-50 dark:bg-blue-900/10 text-blue-600 border-blue-100 dark:border-blue-800/50 shine-blue",
        indigo: "bg-indigo-50 dark:bg-indigo-900/10 text-indigo-600 border-indigo-100 dark:border-indigo-800/50 shine-indigo",
        amber: "bg-amber-50 dark:bg-amber-900/10 text-amber-600 border-amber-100 dark:border-amber-800/50 shine-amber",
        purple: "bg-purple-50 dark:bg-purple-900/10 text-purple-600 border-purple-100 dark:border-purple-800/50 shine-purple",
        rose: "bg-rose-50 dark:bg-rose-900/10 text-rose-600 border-rose-100 dark:border-rose-800/50 shine-rose",
    };

    const currentTheme = themes[colorTheme] || themes.emerald;

    return (
        <div 
            className={`group relative bg-white dark:bg-slate-800 p-6 rounded-[2rem] border border-slate-100 dark:border-slate-700 shadow-sm hover:shadow-xl hover:-translate-y-1 transition-all duration-300 animate-in fade-in slide-in-from-bottom-4`}
            style={{ animationDelay: `${delay}ms` }}
        >
            <div className="flex justify-between items-start mb-4">
                <div className={`p-3 rounded-2xl ${currentTheme} transition-all duration-300 group-hover:scale-110`}>
                    <Icon className="w-6 h-6" />
                </div>
                <div className="flex flex-col items-end text-right">
                    <p className="text-[10px] font-black text-slate-400 dark:text-slate-500 uppercase tracking-[0.2em]">{title}</p>
                    <h3 className="text-3xl font-black text-slate-900 dark:text-white mt-1 tracking-tight">{value}</h3>
                </div>
            </div>
            
            <div className="flex items-center justify-between pt-4 border-t border-slate-50 dark:border-slate-700/50 mt-1">
                <span className={`text-[11px] font-bold px-2 py-0.5 rounded-lg ${subValue.includes('+') ? 'bg-emerald-50 dark:bg-emerald-900/20 text-emerald-600' : 'bg-slate-50 dark:bg-slate-800 text-slate-500'}`}>
                    {subValue}
                </span>
                <TrendingUp className={`w-3.5 h-3.5 ${subValue.includes('+') ? 'text-emerald-500' : 'text-slate-300'}`} />
            </div>

            {/* Subtle Gradient Shine on Hover */}
            <div className={`absolute inset-0 rounded-[2rem] opacity-0 group-hover:opacity-5 transition-opacity pointer-events-none bg-gradient-to-br from-white to-transparent`} />
        </div>
    );
};

const DailyPulse = () => {
  const cards = [
    { 
        title: "Total Students", 
        value: "1,250", 
        subValue: "+15 This Month",
        icon: Users,
        theme: "blue"
    },
    { 
        title: "Students Present", 
        value: "94.2%", 
        subValue: "1,152 Present",
        icon: UserCheck,
        theme: "emerald"
    },
    { 
        title: "Teachers Active", 
        value: "42/42", 
        subValue: "100% Attendance",
        icon: GraduationCap,
        theme: "indigo"
    },
    { 
        title: "Late Arrivals", 
        value: "03", 
        subValue: "2 Students, 1 Staff",
        icon: Clock,
        theme: "amber"
    },
    { 
        title: "Daily Collection", 
        value: "৳ 15.4k", 
        subValue: "+12% Growth",
        icon: Banknote,
        theme: "purple"
    },
    { 
        title: "Pending Admissions", 
        value: "05", 
        subValue: "Action Required",
        icon: AlertCircle,
        theme: "rose"
    }
  ];

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-6 gap-4 mb-10">
        {cards.map((card, idx) => (
            <PulseCard 
                key={idx}
                {...card}
                colorTheme={card.theme}
                delay={idx * 50}
            />
        ))}
    </div>
  );
};

const GraduationCap = (props) => (
    <svg 
        {...props}
        xmlns="http://www.w3.org/2000/svg" 
        width="24" height="24" viewBox="0 0 24 24" 
        fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"
    >
        <path d="M22 10v6M2 10l10-5 10 5-10 5z"/><path d="M6 12v5c3 3 9 3 12 0v-5"/>
    </svg>
);

export default DailyPulse;
