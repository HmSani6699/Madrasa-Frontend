import { useState } from "react";
import { 
  Plus, 
  Search, 
  Layers, 
  Percent, 
  Edit3, 
  Trash2, 
  PieChart,
  CheckCircle2,
  AlertCircle,
  MoreVertical
} from "lucide-react";

const ExamDistribution = () => {
  const [searchTerm, setSearchTerm] = useState("");
  const [isModalOpen, setIsModalOpen] = useState(false);

  // Sample Data: Mark Distributions
  const [distributions, setDistributions] = useState([
    { id: 1, name: "General Written", items: ["Theory (70)", "Viva (30)"], total: 100, status: "active" },
    { id: 2, name: "Science Practical", items: ["Theory (60)", "Practical (30)", "Viva (10)"], total: 100, status: "active" },
    { id: 3, name: "MCQ Based", items: ["MCQ (100)"], total: 100, status: "active" },
  ]);

  return (
    <div className="space-y-8 animate-in fade-in duration-500 p-4 md:p-8">
      {/* Header */}
      <div className="bg-white rounded-[2.5rem] border-2 border-slate-200 p-8 flex flex-col md:flex-row justify-between items-center gap-6 shadow-sm">
        <div className="flex items-center gap-6">
          <div className="w-16 h-16 bg-purple-50 rounded-2xl flex items-center justify-center border-2 border-purple-100">
            <PieChart className="w-8 h-8 text-purple-600" />
          </div>
          <div>
            <h1 className="text-2xl md:text-3xl font-black text-slate-800">Exam Distribution</h1>
            <p className="text-slate-500 font-bold mt-1">Configure mark allocation for different assessment types</p>
          </div>
        </div>

        <button 
          onClick={() => setIsModalOpen(true)}
          className="w-full md:w-auto px-8 py-4 bg-purple-600 text-white rounded-2xl font-black shadow-xl shadow-purple-200 hover:bg-purple-700 hover:scale-[1.02] active:scale-95 transition-all flex items-center justify-center gap-3"
        >
          <Plus className="w-5 h-5" />
          Add Distribution
        </button>
      </div>

      {/* Warning Notice */}
      <div className="bg-indigo-50 border-2 border-indigo-100 p-6 rounded-[2rem] flex items-center gap-4">
         <div className="w-12 h-12 bg-white rounded-xl flex items-center justify-center shadow-sm border border-indigo-200">
            <Percent className="w-6 h-6 text-indigo-500" />
         </div>
         <div>
            <p className="text-xs font-black text-indigo-800 uppercase tracking-widest">Weightage Rule</p>
            <p className="text-sm font-bold text-indigo-600">Total distribution marks must always equal the subject's maximum mark (100 in most cases).</p>
         </div>
      </div>

      {/* Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
        {distributions.map((dist) => (
          <div key={dist.id} className="group bg-white rounded-[2.5rem] border-2 border-slate-100 shadow-sm hover:shadow-xl hover:border-purple-500/20 transition-all duration-300 flex flex-col">
            <div className="p-8 space-y-6">
              <div className="flex justify-between items-start">
                <div className="px-4 py-1 bg-purple-50 text-purple-600 rounded-full text-[10px] font-black uppercase tracking-widest border border-purple-100">
                   Active Schema
                </div>
                <button className="p-2 hover:bg-slate-50 rounded-xl text-slate-300 hover:text-slate-600 transition-all">
                  <MoreVertical className="w-5 h-5" />
                </button>
              </div>

              <div>
                <h3 className="text-xl font-black text-slate-800 leading-tight">{dist.name}</h3>
                <div className="mt-4 flex flex-wrap gap-2">
                   {dist.items.map((item, idx) => (
                      <span key={idx} className="px-3 py-1.5 bg-slate-50 border border-slate-100 rounded-xl text-[10px] font-black text-slate-500 uppercase">
                         {item}
                      </span>
                   ))}
                </div>
              </div>

              <div className="pt-6 border-t-2 border-slate-50 border-dashed flex justify-between items-center">
                 <div className="flex items-center gap-2">
                    <Layers className="w-4 h-4 text-purple-400" />
                    <span className="text-xs font-black text-slate-400 uppercase tracking-widest">Total Weight</span>
                 </div>
                 <span className="text-lg font-black text-slate-800">{dist.total} Marks</span>
              </div>
            </div>

            <div className="mt-auto p-6 bg-slate-50/50 flex gap-3 border-t-2 border-slate-50 rounded-b-[2.5rem]">
               <button className="flex-1 py-3 bg-white border-2 border-slate-200 text-slate-600 rounded-2xl text-[10px] font-black uppercase tracking-widest hover:border-purple-200 hover:text-purple-600 transition-all shadow-sm flex items-center justify-center gap-2">
                 <Edit3 className="w-3.5 h-3.5" /> Edit
               </button>
               <button className="flex-1 py-3 bg-white border-2 border-slate-200 text-rose-500 rounded-2xl text-[10px] font-black uppercase tracking-widest hover:bg-rose-50 hover:border-rose-100 transition-all shadow-sm flex items-center justify-center gap-2">
                 <Trash2 className="w-3.5 h-3.5" /> Delete
               </button>
            </div>
          </div>
        ))}

        {/* Add Card */}
        <button 
          onClick={() => setIsModalOpen(true)}
          className="bg-purple-50/20 rounded-[2.5rem] border-4 border-dashed border-purple-100 flex flex-col items-center justify-center p-12 hover:border-purple-300 hover:bg-purple-50/50 transition-all group min-h-[300px]"
        >
          <div className="w-16 h-16 bg-white rounded-2xl flex items-center justify-center shadow-lg group-hover:scale-110 transition-transform mb-4 border-2 border-purple-100">
            <Plus className="w-8 h-8 text-purple-300 group-hover:text-purple-600" />
          </div>
          <p className="text-lg font-black text-purple-400 group-hover:text-purple-600">New Distribution</p>
        </button>
      </div>

      {/* Simplified Modal Mock */}
      {isModalOpen && (
        <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-sm z-[100] flex items-center justify-center p-4">
           <div className="bg-white rounded-[3rem] w-full max-w-xl shadow-2xl animate-in zoom-in duration-300 overflow-hidden">
              <div className="p-10 border-b-2 border-slate-50 flex items-center justify-between">
                 <h2 className="text-2xl font-black text-slate-800 tracking-tight">Add Mark Distribution</h2>
                 <button onClick={() => setIsModalOpen(false)} className="p-2 hover:bg-slate-100 rounded-xl"><Plus className="w-8 h-8 text-slate-300 rotate-45" /></button>
              </div>
              <div className="p-8 space-y-6">
                 <div className="space-y-4">
                    <div className="space-y-2">
                        <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">Distribution Name</label>
                        <input className="w-full bg-slate-50 border-2 border-slate-100 rounded-2xl px-6 py-4 text-sm font-bold focus:border-purple-500 outline-none" placeholder="e.g. Theory & Practical" />
                    </div>
                    <div className="p-4 bg-slate-50 rounded-2xl border-2 border-slate-100 space-y-4">
                       <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Assessment Parts</label>
                       <div className="flex gap-4">
                          <input className="flex-1 bg-white border-2 border-slate-100 rounded-xl px-4 py-2 text-xs font-bold" placeholder="Part Name (e.g. Theory)" />
                          <input className="w-24 bg-white border-2 border-slate-100 rounded-xl px-4 py-2 text-xs font-bold text-center" placeholder="Marks" />
                          <button className="p-2 bg-purple-600 text-white rounded-xl"><Plus className="w-4 h-4" /></button>
                       </div>
                    </div>
                 </div>
                 <div className="pt-6 flex gap-4">
                    <button onClick={() => setIsModalOpen(false)} className="flex-1 py-4 text-slate-500 font-black">Discard</button>
                    <button onClick={() => setIsModalOpen(false)} className="flex-1 py-4 bg-purple-600 text-white font-black rounded-2xl shadow-xl shadow-purple-200">Save Schema</button>
                 </div>
              </div>
           </div>
        </div>
      )}
    </div>
  );
};

export default ExamDistribution;
