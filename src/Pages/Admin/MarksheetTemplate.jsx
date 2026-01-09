import { useState } from "react";
import { 
  FileText, 
  Settings2, 
  Eye, 
  Trash2, 
  Plus, 
  Layout, 
  Download, 
  MoreVertical,
  CheckCircle2,
  Printer,
  Edit3
} from "lucide-react";

const MarksheetTemplate = () => {
  const [isModalOpen, setIsModalOpen] = useState(false);

  // Sample Data: Templates
  const [templates, setTemplates] = useState([
    { id: 1, name: "Default Academic 2026", orientation: "Portrait", paperSize: "A4", status: "active" },
    { id: 2, name: "Nidhamu (Religious Standard)", orientation: "Landscape", paperSize: "A4", status: "inactive" },
  ]);

  return (
    <div className="space-y-8 animate-in fade-in duration-500 p-4 md:p-8">
      {/* Header */}
      <div className="bg-white rounded-[2.5rem] border-2 border-slate-200 p-8 flex flex-col md:flex-row justify-between items-center gap-6 shadow-sm">
        <div className="flex items-center gap-6">
          <div className="w-16 h-16 bg-blue-50 rounded-2xl flex items-center justify-center border-2 border-blue-100">
            <Layout className="w-8 h-8 text-blue-600" />
          </div>
          <div>
            <h1 className="text-2xl md:text-3xl font-black text-slate-800">Marksheet Template</h1>
            <p className="text-slate-500 font-bold mt-1">Design and configure academic transcript layouts</p>
          </div>
        </div>

        <button 
          onClick={() => setIsModalOpen(true)}
          className="w-full md:w-auto px-8 py-4 bg-blue-600 text-white rounded-2xl font-black shadow-xl shadow-blue-200 hover:bg-blue-700 hover:scale-[1.02] transition-all flex items-center justify-center gap-3"
        >
          <Plus className="w-5 h-5" />
          Create Template
        </button>
      </div>

      {/* Control Notice */}
      <div className="bg-indigo-50 border-2 border-indigo-100 p-6 rounded-[2rem] flex items-center gap-4">
         <div className="w-12 h-12 bg-white rounded-xl flex items-center justify-center shadow-sm border border-indigo-200">
            <Printer className="w-6 h-6 text-indigo-500" />
         </div>
         <div>
            <p className="text-xs font-black text-indigo-800 uppercase tracking-widest">Print Ready</p>
            <p className="text-sm font-bold text-indigo-600">Templates are optimized for PDF generation and physical printing on standard A4 paper.</p>
         </div>
      </div>

      {/* Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
        {templates.map((temp) => (
          <div key={temp.id} className="group bg-white rounded-[2.5rem] border-2 border-slate-100 shadow-sm hover:shadow-xl hover:border-blue-500/20 transition-all duration-300 flex flex-col">
            <div className="p-8 space-y-6">
              <div className="flex justify-between items-start">
                <div className={`px-4 py-1 rounded-full text-[10px] font-black uppercase tracking-widest border-2 ${
                  temp.status === 'active' ? 'bg-emerald-50 text-emerald-600 border-emerald-100' : 'bg-slate-50 text-slate-400 border-slate-100'
                }`}>
                  {temp.status}
                </div>
                <button className="p-2 hover:bg-slate-50 rounded-xl text-slate-300 hover:text-slate-600 transition-all">
                  <MoreVertical className="w-5 h-5" />
                </button>
              </div>

              <div className="flex items-center gap-4">
                 <div className="w-14 h-14 bg-slate-50 rounded-2xl flex items-center justify-center group-hover:scale-110 transition-transform">
                    <FileText className="w-7 h-7 text-blue-500" />
                 </div>
                 <div>
                    <h3 className="text-xl font-black text-slate-800 leading-tight">{temp.name}</h3>
                    <p className="text-xs font-bold text-slate-400 mt-1 uppercase tracking-widest">{temp.paperSize} • {temp.orientation}</p>
                 </div>
              </div>
            </div>

            <div className="mt-auto p-6 bg-slate-50/50 flex gap-3 border-t-2 border-slate-50 rounded-b-[2.5rem]">
               <button className="flex-1 py-3 bg-white border-2 border-slate-200 text-slate-600 rounded-2xl text-[10px] font-black uppercase tracking-widest hover:border-blue-200 hover:text-blue-600 transition-all shadow-sm flex items-center justify-center gap-2">
                 <Eye className="w-3.5 h-3.5" /> Preview
               </button>
               <button className="flex-1 py-3 bg-white border-2 border-slate-200 text-slate-600 rounded-2xl text-[10px] font-black uppercase tracking-widest hover:border-blue-200 hover:text-blue-600 transition-all shadow-sm flex items-center justify-center gap-2">
                 <Edit3 className="w-3.5 h-3.5" /> Design
               </button>
            </div>
          </div>
        ))}

        {/* Add Card */}
        <button 
          onClick={() => setIsModalOpen(true)}
          className="bg-blue-50/20 rounded-[2.5rem] border-4 border-dashed border-blue-100 flex flex-col items-center justify-center p-12 hover:border-blue-300 hover:bg-blue-50/50 transition-all group min-h-[300px]"
        >
          <div className="w-16 h-16 bg-white rounded-2xl flex items-center justify-center shadow-lg group-hover:scale-110 transition-transform mb-4 border-2 border-blue-100">
            <Plus className="w-8 h-8 text-blue-300 group-hover:text-blue-600" />
          </div>
          <p className="text-lg font-black text-blue-400 group-hover:text-blue-600">New Template Layout</p>
        </button>
      </div>

      {/* Simplified Modal Mock */}
      {isModalOpen && (
        <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-sm z-[100] flex items-center justify-center p-4">
           <div className="bg-white rounded-[3rem] w-full max-w-xl shadow-2xl animate-in zoom-in duration-300">
              <div className="p-10 border-b-2 border-slate-50 flex items-center justify-between">
                 <h2 className="text-2xl font-black text-slate-800 tracking-tight">Template Builder</h2>
                 <button onClick={() => setIsModalOpen(false)} className="p-2 hover:bg-slate-100 rounded-xl"><Plus className="w-6 h-6 text-slate-300 rotate-45" /></button>
              </div>
              <div className="p-8 space-y-6">
                 <div className="space-y-4">
                    <div className="space-y-2">
                        <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">Template Name</label>
                        <input className="w-full bg-slate-50 border-2 border-slate-100 rounded-2xl px-6 py-4 text-sm font-bold focus:border-blue-500 outline-none" placeholder="e.g. Annual Result 2026" />
                    </div>
                    <div className="grid grid-cols-2 gap-6">
                       <div className="space-y-2">
                          <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">Orientation</label>
                          <select className="w-full bg-slate-50 border-2 border-slate-100 rounded-2xl px-6 py-4 text-sm font-bold focus:border-blue-500 outline-none appearance-none">
                             <option>Portrait</option>
                             <option>Landscape</option>
                          </select>
                       </div>
                       <div className="space-y-2">
                          <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">Paper Size</label>
                          <select className="w-full bg-slate-50 border-2 border-slate-100 rounded-2xl px-6 py-4 text-sm font-bold focus:border-blue-500 outline-none appearance-none">
                             <option>A4</option>
                             <option>Legal</option>
                             <option>Letter</option>
                          </select>
                       </div>
                    </div>
                 </div>
                 <div className="pt-6 flex gap-4">
                    <button onClick={() => setIsModalOpen(false)} className="flex-1 py-4 text-slate-500 font-black">Discard</button>
                    <button onClick={() => setIsModalOpen(false)} className="flex-1 py-4 bg-blue-600 text-white font-black rounded-2xl shadow-xl shadow-blue-200">Start Designing</button>
                 </div>
              </div>
           </div>
        </div>
      )}
    </div>
  );
};

export default MarksheetTemplate;
