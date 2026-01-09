import { useState } from "react";
import { 
  Plus, 
  Award, 
  Search, 
  Filter, 
  MoreVertical, 
  Edit3, 
  Trash2, 
  Eye, 
  Layout, 
  CheckCircle2,
  X,
  PlusCircle,
  Settings2
} from "lucide-react";

const CertificateTemplate = () => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");

  const [templates, setTemplates] = useState([
    { 
      id: 1, 
      name: "Standard Merit Certificate", 
      type: "student", 
      background: "modern-blue", 
      lastModified: "2026-01-05",
      status: "active",
      fields: ["Name", "Class", "Roll", "Year", "Position"]
    },
    { 
      id: 2, 
      name: "Employee Achievement Award", 
      type: "employee", 
      background: "gold-premium", 
      lastModified: "2026-01-08",
      status: "active",
      fields: ["Name", "Designation", "Department", "Date"]
    },
    { 
      id: 3, 
      name: "Participation Certificate", 
      type: "student", 
      background: "minimalist-clean", 
      lastModified: "2025-12-20",
      status: "draft",
      fields: ["Name", "Event", "Date"]
    }
  ]);

  return (
    <div className="min-h-screen bg-slate-50/50 p-4 md:p-8 animate-in fade-in duration-500">
      <div className="max-w-[1600px] mx-auto space-y-8">
        
        {/* Header Section */}
        <div className="bg-white rounded-[2.5rem] border border-slate-200 p-8 shadow-sm flex flex-col lg:flex-row justify-between items-center gap-6">
          <div className="flex items-center gap-6">
            <div className="w-16 h-16 bg-indigo-50 rounded-2xl flex items-center justify-center border border-indigo-100 shadow-inner">
              <Award className="w-8 h-8 text-indigo-600" />
            </div>
            <div>
              <h1 className="text-2xl md:text-3xl font-black text-slate-800 tracking-tight">Certificate Templates</h1>
              <p className="text-slate-500 font-bold mt-1">Design and manage professional academic & staff certificates</p>
            </div>
          </div>

          <button 
            onClick={() => setIsModalOpen(true)}
            className="w-full lg:w-auto px-8 py-4 bg-indigo-600 text-white rounded-2xl font-black shadow-xl shadow-indigo-100 hover:bg-indigo-700 hover:scale-[1.02] active:scale-95 transition-all flex items-center justify-center gap-3"
          >
            <Plus className="w-5 h-5" />
            Create New Template
          </button>
        </div>

        {/* Filters and Search */}
        <div className="flex flex-col md:flex-row gap-4">
          <div className="flex-1 relative">
            <Search className="absolute left-6 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400" />
            <input 
              type="text"
              placeholder="Search templates..."
              className="w-full bg-white border border-slate-200 rounded-2xl pl-14 pr-6 py-4 text-sm font-bold focus:border-indigo-500 outline-none shadow-sm transition-all"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </div>
          <div className="flex gap-4">
            <button className="px-6 py-4 bg-white border border-slate-200 rounded-2xl flex items-center gap-3 font-bold text-slate-600 hover:bg-slate-50 transition-all shadow-sm">
              <Filter className="w-4 h-4" />
              Filter
            </button>
            <button className="px-6 py-4 bg-white border border-slate-200 rounded-2xl flex items-center gap-3 font-bold text-slate-600 hover:bg-slate-50 transition-all shadow-sm">
              <Settings2 className="w-4 h-4" />
              Settings
            </button>
          </div>
        </div>

        {/* Templates Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-3 gap-8">
          {templates.map((template) => (
            <div key={template.id} className="group bg-white rounded-[2.5rem] border border-slate-200 shadow-sm hover:shadow-2xl hover:border-indigo-200 transition-all duration-500 overflow-hidden flex flex-col">
              {/* Preview Box */}
              <div className="h-48 bg-slate-100 flex items-center justify-center relative overflow-hidden">
                <div className={`absolute inset-0 opacity-10 ${template.background === 'gold-premium' ? 'bg-amber-500' : 'bg-indigo-500'}`}></div>
                <div className="w-40 h-28 bg-white border-4 border-white shadow-lg rounded flex flex-col items-center justify-center p-4 relative z-10 transition-transform group-hover:scale-110">
                   <Award className="w-8 h-8 text-slate-200 mb-2" />
                   <div className="w-20 h-1 bg-slate-100 rounded-full mb-1"></div>
                   <div className="w-16 h-1 bg-slate-50 rounded-full"></div>
                </div>
                <div className="absolute top-4 right-4 flex gap-2">
                   <button className="p-2 bg-white/90 backdrop-blur-sm rounded-xl text-slate-600 hover:text-indigo-600 shadow-sm transition-all">
                     <Eye className="w-4 h-4" />
                   </button>
                </div>
              </div>

              {/* Content */}
              <div className="p-8 flex-1 flex flex-col">
                <div className="flex justify-between items-start mb-4">
                  <span className={`px-4 py-1 rounded-full text-[10px] font-black uppercase tracking-widest border ${
                    template.status === 'active' ? 'bg-emerald-50 text-emerald-600 border-emerald-100' : 'bg-slate-50 text-slate-400 border-slate-100'
                  }`}>
                    {template.status}
                  </span>
                  <button className="p-2 hover:bg-slate-50 rounded-xl text-slate-400 hover:text-slate-600 transition-all">
                    <MoreVertical className="w-5 h-5" />
                  </button>
                </div>

                <div className="mb-6">
                  <h3 className="text-xl font-black text-slate-800 tracking-tight group-hover:text-indigo-600 transition-colors">{template.name}</h3>
                  <p className="text-xs font-bold text-slate-400 mt-2 uppercase tracking-wide flex items-center gap-2">
                    <Layout className="w-3.5 h-3.5" />
                    Target: {template.type}
                  </p>
                </div>

                <div className="space-y-3 mb-8">
                  <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Available Fields</p>
                  <div className="flex flex-wrap gap-2">
                    {template.fields.map((f, i) => (
                      <span key={i} className="px-3 py-1 bg-slate-50 border border-slate-100 rounded-lg text-xs font-bold text-slate-500">
                        {f}
                      </span>
                    ))}
                  </div>
                </div>

                <div className="mt-auto flex gap-3 pt-6 border-t border-slate-100 border-dashed">
                  <button className="flex-1 py-3.5 bg-white border border-slate-200 text-slate-600 rounded-2xl text-[10px] font-black uppercase tracking-widest hover:border-indigo-200 hover:text-indigo-600 transition-all shadow-sm flex items-center justify-center gap-2">
                    <Edit3 className="w-4 h-4" /> Edit Design
                  </button>
                  <button className="p-3.5 bg-rose-50 border border-rose-100 text-rose-600 rounded-2xl hover:bg-rose-100 transition-all shadow-sm">
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              </div>
            </div>
          ))}

          {/* New Template Card */}
          <button 
            onClick={() => setIsModalOpen(true)}
            className="group bg-indigo-50/20 rounded-[2.5rem] border-4 border-dashed border-indigo-100 flex flex-col items-center justify-center p-12 hover:border-indigo-300 hover:bg-indigo-50/50 transition-all min-h-[400px]"
          >
            <div className="w-20 h-20 bg-white rounded-3xl flex items-center justify-center shadow-xl shadow-indigo-100/50 group-hover:scale-110 group-hover:bg-indigo-600 transition-all mb-6">
              <PlusCircle className="w-10 h-10 text-indigo-300 group-hover:text-white" />
            </div>
            <p className="text-xl font-black text-indigo-400 group-hover:text-indigo-600">Add New Template</p>
            <p className="text-sm font-bold text-indigo-300 mt-2">Visual Designer Interface</p>
          </button>
        </div>

      </div>

      {/* Modern Creation Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 bg-slate-900/40 backdrop-blur-md z-[100] flex items-center justify-center p-4">
          <div className="bg-white rounded-[3rem] w-full max-w-4xl shadow-2xl animate-in zoom-in duration-300 overflow-hidden flex flex-col md:flex-row h-[90vh]">
            
            {/* Left: Settings */}
            <div className="flex-1 p-10 overflow-y-auto">
              <div className="flex justify-between items-center mb-10">
                <h2 className="text-3xl font-black text-slate-800 tracking-tight">Template Design</h2>
                <button onClick={() => setIsModalOpen(false)} className="md:hidden p-3 hover:bg-slate-100 rounded-2xl transition-all">
                  <X className="w-6 h-6 text-slate-400" />
                </button>
              </div>

              <div className="space-y-8">
                <div className="space-y-3">
                  <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Template Identity</label>
                  <input className="w-full bg-slate-50 border border-slate-100 rounded-2xl px-6 py-4 text-sm font-bold focus:border-indigo-500 transition-all outline-none" placeholder="e.g. Graduation Excellence 2026" />
                </div>

                <div className="grid grid-cols-2 gap-6">
                  <div className="space-y-3">
                    <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Target Type</label>
                    <select className="w-full bg-slate-50 border border-slate-100 rounded-2xl px-6 py-4 text-sm font-bold focus:border-indigo-500 transition-all outline-none appearance-none cursor-pointer">
                      <option>Student</option>
                      <option>Employee</option>
                    </select>
                  </div>
                  <div className="space-y-3">
                    <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Orientation</label>
                    <select className="w-full bg-slate-50 border border-slate-100 rounded-2xl px-6 py-4 text-sm font-bold focus:border-indigo-500 transition-all outline-none appearance-none cursor-pointer">
                      <option>Landscape</option>
                      <option>Portrait</option>
                    </select>
                  </div>
                </div>

                <div className="space-y-4">
                  <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Dynamic Fields</label>
                  <div className="grid grid-cols-2 gap-3">
                    {["Student Name", "Father Name", "Roll No", "Class", "Section", "Date", "Principal Sign", "Class Teacher Sign"].map((field) => (
                      <label key={field} className="flex items-center gap-3 p-4 bg-slate-50 border border-slate-100 rounded-2xl cursor-pointer hover:bg-white hover:border-indigo-200 transition-all group">
                        <div className="flex items-center justify-center w-5 h-5 border-2 border-slate-300 rounded group-hover:border-indigo-500">
                          <CheckCircle2 className="w-3 h-3 text-indigo-500 opacity-0 group-hover:opacity-100" />
                        </div>
                        <span className="text-xs font-bold text-slate-600">{field}</span>
                      </label>
                    ))}
                  </div>
                </div>
              </div>

              <div className="pt-10 flex gap-4 mt-8 sticky bottom-0 bg-white">
                <button onClick={() => setIsModalOpen(false)} className="flex-1 py-4 text-slate-400 font-black hover:text-slate-600 transition-all">Cancel</button>
                <button onClick={() => setIsModalOpen(false)} className="flex-[2] py-4 bg-indigo-600 text-white font-black rounded-2xl shadow-xl shadow-indigo-100 hover:bg-indigo-700 transition-all">Save Template</button>
              </div>
            </div>

            {/* Right: Preview (Desktop Only) */}
            <div className="hidden md:flex w-[400px] bg-slate-900 p-10 flex-col items-center justify-center text-center">
               <div className="w-full aspect-[1.4/1] bg-white rounded-lg shadow-2xl p-6 relative flex flex-col items-center justify-between border-8 border-indigo-500/10">
                  <div className="space-y-2 w-full">
                    <div className="w-12 h-12 bg-indigo-50 rounded-full mx-auto mb-4 flex items-center justify-center">
                      <Award className="w-6 h-6 text-indigo-600" />
                    </div>
                    <div className="h-2 bg-slate-100 w-3/4 mx-auto rounded"></div>
                    <div className="h-4 bg-slate-900/10 w-1/2 mx-auto rounded-full"></div>
                  </div>
                  
                  <div className="w-full space-y-4">
                     <div className="h-3 bg-indigo-50 w-full rounded"></div>
                     <div className="h-6 bg-slate-50 border border-dashed border-indigo-200 w-full rounded flex items-center justify-center">
                        <span className="text-[8px] font-black text-indigo-300 uppercase tracking-[2px]">[DYNAMIC_NAME]</span>
                     </div>
                     <div className="h-3 bg-indigo-50 w-2/3 mx-auto rounded"></div>
                  </div>

                  <div className="w-full flex justify-between pt-8">
                     <div className="w-16 h-[1px] bg-slate-200"></div>
                     <div className="w-16 h-[1px] bg-slate-200"></div>
                  </div>
               </div>
               <p className="text-slate-500 text-xs font-bold mt-8">Live Real-time Preview</p>
               <div onClick={() => setIsModalOpen(false)} className="absolute top-8 right-8 cursor-pointer p-2 bg-white/10 rounded-xl hover:bg-white/20 transition-all">
                 <X className="w-6 h-6 text-white" />
               </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default CertificateTemplate;
