import { ArrowUpRight, ArrowDownRight } from "lucide-react";

const StatCard = ({ title, value, icon: Icon, trend, isPositive, color = "text-primary", bgGradient }) => {
  return (
    <div className={`relative overflow-hidden rounded-2xl p-6 bg-white border border-gray-100 shadow-sm hover:shadow-xl transition-all duration-300 group`}>
      {/* Background Gradient Blob */}
      <div className={`absolute top-0 right-0 w-24 h-24 rounded-full -mr-8 -mt-8 opacity-10 blur-2xl group-hover:scale-150 transition-transform duration-700 ${bgGradient || 'bg-primary'}`} />

      <div className="flex items-center justify-between mb-4 relative z-10">
        <div className={`w-12 h-12 rounded-xl flex items-center justify-center bg-gray-50 group-hover:bg-white group-hover:shadow-md transition-all duration-300 border border-gray-50 group-hover:border-gray-100`}>
          <Icon className={`w-6 h-6 ${color} transition-transform duration-300 group-hover:scale-110`} />
        </div>
        {trend && (
          <div className={`flex items-center gap-1 text-xs font-bold px-3 py-1.5 rounded-full border ${
            isPositive 
                ? "bg-green-50 text-green-600 border-green-100" 
                : "bg-red-50 text-red-600 border-red-100"
          }`}>
            {isPositive ? <ArrowUpRight className="w-3 h-3" /> : <ArrowDownRight className="w-3 h-3" />}
            {trend}
          </div>
        )}
      </div>
      
      <div className="relative z-10">
        <p className="text-sm font-medium text-gray-400 uppercase tracking-wide mb-1">{title}</p>
        <h3 className="text-3xl font-extrabold text-gray-800 tracking-tight group-hover:text-transparent group-hover:bg-clip-text group-hover:bg-gradient-to-r group-hover:from-gray-900 group-hover:to-gray-600 transition-all">
            {value}
        </h3>
      </div>
    </div>
  );
};

export default StatCard;
