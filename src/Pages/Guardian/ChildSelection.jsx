import { useNavigate } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";
import { 
  Users, 
  ArrowRight, 
  Search, 
  UserPlus,
  Star,
  MapPin,
  GraduationCap
} from "lucide-react";

const ChildSelection = () => {
  const { guardianChildren, selectChild, activeChild } = useAuth();
  const navigate = useNavigate();
  const children = guardianChildren;

  const handleSelect = (child) => {
      selectChild(child);
      navigate("/guardian/dashboard");
  };

  return (
    <div className="min-h-screen bg-slate-50/50 p-4 md:p-8 animate-in fade-in duration-500">
      <div className="max-w-[1200px] mx-auto space-y-10">
        
        {/* Header */}
        <div className="text-center space-y-4">
           <div className="w-20 h-20 bg-slate-900 rounded-[2rem] flex items-center justify-center mx-auto shadow-2xl shadow-slate-200">
              <Users className="w-10 h-10 text-white" />
           </div>
           <h1 className="text-3xl md:text-5xl font-black text-slate-800 tracking-tight uppercase leading-none">Select Student</h1>
           <p className="text-slate-500 font-bold max-w-lg mx-auto text-sm md:text-base">Choose an enrolled child to view their specific academic journey, performance, and institutional records.</p>
        </div>

        {/* Search & Filter */}
        <div className="max-w-md mx-auto relative group">
           <Search className="absolute left-6 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-300 group-focus-within:text-indigo-500 transition-colors" />
           <input 
             className="w-full bg-white border border-slate-200 rounded-[2rem] pl-16 pr-8 py-5 text-sm font-bold shadow-sm focus:border-indigo-500 outline-none transition-all" 
             placeholder="Search by student name or roll..." 
           />
        </div>

        {/* Children Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
           {children.map((child) => (
              <div key={child.id} className="bg-white rounded-[2.5rem] md:rounded-[3.5rem] p-8 md:p-12 border border-slate-200 shadow-sm transition-all hover:border-slate-800 hover:shadow-2xl hover:shadow-slate-200 group relative overflow-hidden cursor-pointer">
                 <div className="absolute top-0 right-0 w-32 h-32 bg-slate-50 rounded-bl-[5rem] -mr-10 -mt-10 opacity-50 group-hover:bg-slate-900 transition-colors duration-500"></div>
                 
                 <div className="relative z-10 flex flex-col items-center sm:items-start sm:flex-row gap-8">
                    <div className={`w-24 h-24 ${child.color} rounded-[2rem] md:rounded-[2.5rem] flex items-center justify-center text-3xl font-black text-white shadow-xl shadow-indigo-100 group-hover:scale-110 transition-transform`}>
                       {child.initials}
                    </div>
                    <div className="flex-1 text-center sm:text-left">
                       <div className="flex items-center justify-center sm:justify-start gap-2 mb-2">
                          <span className="px-3 py-1 bg-emerald-50 text-emerald-600 text-[10px] font-black uppercase rounded-lg border border-emerald-100">{child.status}</span>
                          <span className="px-3 py-1 bg-slate-50 text-slate-400 text-[10px] font-black uppercase rounded-lg border border-slate-100 font-mono">ID: 260{child.id}</span>
                       </div>
                       <h3 className="text-2xl md:text-3xl font-black text-slate-800 uppercase tracking-tight leading-none mb-4 group-hover:text-slate-900">{child.name}</h3>
                       
                       <div className="grid grid-cols-2 gap-4 mb-8">
                          <div className="flex items-center gap-3 text-slate-500">
                             <GraduationCap className="w-4 h-4" />
                             <span className="text-xs font-bold uppercase">{child.class}</span>
                          </div>
                          <div className="flex items-center gap-3 text-slate-500">
                             <Star className="w-4 h-4" />
                             <span className="text-xs font-bold uppercase">{child.section}</span>
                          </div>
                          <div className="flex items-center gap-3 text-slate-500">
                             <MapPin className="w-4 h-4" />
                             <span className="text-xs font-bold uppercase">Hall 0{child.id}</span>
                          </div>
                       </div>
                    </div>
                 </div>

                 <button onClick={() => handleSelect(child)} className="w-full mt-4 py-5 bg-slate-50 group-hover:bg-slate-900 text-slate-400 group-hover:text-white rounded-[1.5rem] md:rounded-[2.5rem] font-black text-[11px] uppercase tracking-widest transition-all flex items-center justify-center gap-3">
                    Access Academic Portal <ArrowRight className="w-4 h-4" />
                 </button>
              </div>
           ))}

           {/* Add/Link Child Card */}
           <div className="bg-slate-50 rounded-[2.5rem] md:rounded-[3.5rem] p-12 border border-dashed border-slate-200 flex flex-col items-center justify-center text-center gap-8 group hover:bg-white hover:border-solid hover:border-indigo-500 transition-all cursor-pointer">
              <div className="w-20 h-20 bg-white rounded-[2rem] flex items-center justify-center text-slate-200 group-hover:text-indigo-600 shadow-sm group-hover:shadow-xl transition-all">
                 <UserPlus className="w-10 h-10" />
              </div>
              <div>
                 <h4 className="text-2xl font-black text-slate-800 uppercase tracking-tight mb-2 leading-none group-hover:text-indigo-600 transition-colors">Link Another Child</h4>
                 <p className="text-[11px] font-bold text-slate-400 uppercase tracking-widest leading-relaxed max-w-[240px] mx-auto">Add siblings to your parent account using their admission token</p>
              </div>
           </div>
        </div>

      </div>
    </div>
  );
};

export default ChildSelection;
