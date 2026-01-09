import { useState } from "react";
import { 
  Scale, 
  Plus, 
  Search, 
  MoreVertical, 
  Edit3, 
  Trash2, 
  PlusCircle,
  Hash
} from "lucide-react";

const UnitList = () => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [units] = useState([
    { id: 1, name: "Pcs", description: "Individual items" },
    { id: 2, name: "Kg", description: "Weight in kilograms" },
    { id: 3, name: "Set", description: "Complete package or uniform set" },
    { id: 4, name: "Box", description: "Carton containing multiple items" },
    { id: 5, name: "Roll", description: "Rolled materials like tape or fabric" },
  ]);

  return (
    <div className="min-h-screen bg-slate-50/50 p-4 md:p-8 animate-in fade-in duration-500">
      <div className="max-w-[1600px] mx-auto space-y-8">
        
        {/* Header Section */}
        <div className="bg-white rounded-[2.5rem] border border-slate-200 p-8 shadow-sm flex flex-col lg:flex-row justify-between items-center gap-6">
          <div className="flex items-center gap-6">
            <div className="w-16 h-16 bg-rose-50 rounded-2xl flex items-center justify-center border border-rose-100 shadow-inner">
              <Scale className="w-8 h-8 text-rose-600" />
            </div>
            <div>
              <h1 className="text-2xl md:text-3xl font-black text-slate-800 tracking-tight">Units of Measure</h1>
              <p className="text-slate-500 font-bold mt-1">Define quantitative units used for product inventory</p>
            </div>
          </div>

          <button 
            onClick={() => setIsModalOpen(true)}
            className="w-full lg:w-auto px-8 py-4 bg-rose-600 text-white rounded-2xl font-black shadow-xl shadow-rose-100 hover:bg-rose-700 hover:scale-[1.02] active:scale-95 transition-all flex items-center justify-center gap-3"
          >
            <Plus className="w-5 h-5" />
            New Unit
          </button>
        </div>

        {/* Units Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5 gap-6">
          {units.map((unit) => (
            <div key={unit.id} className="group bg-white rounded-[2rem] border border-slate-200 shadow-sm hover:shadow-xl hover:border-rose-200 transition-all duration-300 flex flex-col p-6">
               <div className="flex justify-between items-start mb-4">
                  <div className="w-10 h-10 bg-slate-50 rounded-xl flex items-center justify-center border border-slate-100 group-hover:bg-rose-50 group-hover:border-rose-100 transition-colors">
                     <Hash className="w-5 h-5 text-slate-400 group-hover:text-rose-600" />
                  </div>
                  <button className="p-2 hover:bg-slate-50 rounded-xl text-slate-300 hover:text-slate-600 transition-all">
                    <MoreVertical className="w-4 h-4" />
                  </button>
               </div>
               
               <h3 className="text-lg font-black text-slate-800 group-hover:text-rose-600 transition-colors">{unit.name}</h3>
               <p className="text-xs font-bold text-slate-400 mt-1 line-clamp-1">{unit.description}</p>

               <div className="mt-6 flex gap-2">
                  <button className="flex-1 py-2.5 bg-slate-50 text-slate-500 rounded-xl text-[10px] font-black uppercase tracking-widest hover:bg-rose-50 hover:text-rose-600 transition-all">
                    Edit
                  </button>
                  <button className="p-2.5 bg-rose-50/50 text-rose-400 rounded-xl hover:bg-rose-50 hover:text-rose-600 transition-all">
                    <Trash2 className="w-3.5 h-3.5" />
                  </button>
               </div>
            </div>
          ))}

          {/* Add Mini Card */}
          <button 
            onClick={() => setIsModalOpen(true)}
            className="group bg-rose-50/10 rounded-[2rem] border-2 border-dashed border-rose-100 flex flex-col items-center justify-center p-6 hover:border-rose-300 hover:bg-rose-50/30 transition-all min-h-[160px]"
          >
            <PlusCircle className="w-8 h-8 text-rose-200 group-hover:text-rose-500 mb-2 transition-transform group-hover:scale-110" />
            <p className="text-xs font-black text-rose-300 group-hover:text-rose-500 uppercase tracking-widest">Add Unit</p>
          </button>
        </div>

      </div>

      {/* Creation Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 bg-slate-900/40 backdrop-blur-md z-[100] flex items-center justify-center p-4">
          <div className="bg-white rounded-[3rem] w-full max-w-md shadow-2xl animate-in zoom-in duration-300 overflow-hidden">
             <div className="p-8 border-b border-slate-50 flex items-center justify-between">
                <h2 className="text-2xl font-black text-slate-800 tracking-tight">New Unit</h2>
                <button onClick={() => setIsModalOpen(false)} className="p-2 hover:bg-slate-100 rounded-xl transition-all">
                  <Plus className="w-6 h-6 text-slate-300 rotate-45" />
                </button>
             </div>
             <div className="p-8 space-y-6">
                <div className="space-y-3">
                   <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Unit Name</label>
                   <input className="w-full bg-slate-50 border border-slate-100 rounded-2xl px-6 py-4 text-sm font-bold focus:border-rose-500 outline-none transition-all" placeholder="e.g. Dozen" />
                </div>
                <div className="space-y-3">
                   <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Description</label>
                   <input className="w-full bg-slate-50 border border-slate-100 rounded-2xl px-6 py-4 text-sm font-bold focus:border-rose-500 outline-none transition-all" placeholder="Brief use case..." />
                </div>

                <div className="pt-4 flex gap-4">
                   <button onClick={() => setIsModalOpen(false)} className="flex-1 py-4 text-slate-400 font-black">Discard</button>
                   <button onClick={() => setIsModalOpen(false)} className="flex-1 py-4 bg-rose-600 text-white font-black rounded-2xl shadow-xl shadow-rose-100">Add Unit</button>
                </div>
             </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default UnitList;
