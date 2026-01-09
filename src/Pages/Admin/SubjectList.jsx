import { useState } from "react";
import { 
  Plus, 
  Search, 
  BookOpen, 
  Filter, 
  MoreVertical, 
  Edit3, 
  Trash2, 
  BookMarked,
  Layers,
  CheckCircle2,
  Info,
  X,
  AlertCircle,
  ShieldCheck,
  Shapes
} from "lucide-react";

const SubjectList = () => {
  const [searchTerm, setSearchTerm] = useState("");
  const [levelFilter, setLevelFilter] = useState("All");
  
  // Modal States
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [modalType, setModalType] = useState("add"); // "add" | "edit"
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);

  // Focus States
  const [selectedSubject, setSelectedSubject] = useState(null);

  // Form States
  const [formData, setFormData] = useState({
    name: "",
    code: "",
    level: "Primary",
    type: "Religious",
    status: "active"
  });

  // Sample Data: Subjects
  const [subjects, setSubjects] = useState([
    { id: 1, name: "Arabic Grammar (Sarf)", code: "ARB101", level: "Primary", type: "Religious", status: "active" },
    { id: 2, name: "Arabic Literature (Adab)", code: "ARB102", level: "Secondary", type: "Religious", status: "active" },
    { id: 3, name: "Fiqh (Jurisprudence)", code: "FIQ201", level: "Secondary", type: "Religious", status: "active" },
    { id: 4, name: "Mathematics", code: "MAT001", level: "Primary", type: "General", status: "active" },
    { id: 5, name: "English Foundation", code: "ENG001", level: "Primary", type: "General", status: "active" },
    { id: 6, name: "Hadith Studies", code: "HAD301", level: "Kitab", type: "Religious", status: "active" },
  ]);

  const levels = ["All", "Primary", "Secondary", "Hifz", "Kitab"];

  // Handlers
  const openAddModal = () => {
    resetForm();
    setModalType("add");
    setIsModalOpen(true);
  };

  const openEditModal = (subject) => {
    setSelectedSubject(subject);
    setFormData({
      name: subject.name,
      code: subject.code,
      level: subject.level,
      type: subject.type,
      status: subject.status
    });
    setModalType("edit");
    setIsModalOpen(true);
  };

  const openDeleteModal = (subject) => {
    setSelectedSubject(subject);
    setIsDeleteModalOpen(true);
  };

  const handleAction = () => {
    if (modalType === "add") {
      const newSubject = {
        id: Date.now(),
        ...formData
      };
      setSubjects([...subjects, newSubject]);
    } else {
      setSubjects(subjects.map(s => s.id === selectedSubject.id ? { ...s, ...formData } : s));
    }
    setIsModalOpen(false);
    resetForm();
  };

  const handleDelete = () => {
    setSubjects(subjects.filter(s => s.id !== selectedSubject.id));
    setIsDeleteModalOpen(false);
    setSelectedSubject(null);
  };

  const resetForm = () => {
    setFormData({
      name: "",
      code: "",
      level: "Primary",
      type: "Religious",
      status: "active"
    });
    setSelectedSubject(null);
  };

  const filteredSubjects = subjects.filter(s => {
    const matchesSearch = s.name.toLowerCase().includes(searchTerm.toLowerCase()) || s.code.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesLevel = levelFilter === "All" || s.level === levelFilter;
    return matchesSearch && matchesLevel;
  });

  return (
    <div className="space-y-10 animate-in fade-in duration-500 p-6 md:p-10">
      {/* Header */}
      <div className="bg-white rounded-[3rem] border-2 border-slate-200 p-10 flex flex-col lg:flex-row justify-between items-center gap-8 shadow-sm relative overflow-hidden">
        <div className="absolute top-0 right-0 w-64 h-64 bg-amber-50/50 rounded-full blur-3xl -mr-32 -mt-32" />
        
        <div className="flex items-center gap-8 relative z-10">
          <div className="w-20 h-20 bg-gradient-to-br from-amber-400 to-orange-500 rounded-[2rem] flex items-center justify-center shadow-2xl shadow-amber-200">
            <BookMarked className="w-10 h-10 text-white" />
          </div>
          <div>
            <h1 className="text-3xl md:text-4xl font-black text-slate-800 tracking-tight">Subject Library</h1>
            <p className="text-slate-500 font-bold mt-2 text-lg">Curated curriculum and academic standards</p>
          </div>
        </div>

        <button 
          onClick={openAddModal}
          className="w-full lg:w-auto px-10 py-5 bg-amber-500 text-white rounded-[1.5rem] font-black shadow-2xl shadow-amber-100 hover:bg-amber-600 hover:scale-[1.02] active:scale-95 transition-all flex items-center justify-center gap-3 group relative z-10"
        >
          <Plus className="w-6 h-6 group-hover:rotate-90 transition-transform" />
          Add Curriculum
        </button>
      </div>

      {/* Filters & Search - Improved Spacing */}
      <div className="bg-white p-8 rounded-[2.5rem] border-2 border-slate-100 shadow-sm flex flex-col lg:flex-row gap-8 items-center">
        <div className="relative flex-1 w-full group">
          <Search className="absolute left-5 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-300 group-focus-within:text-amber-500 transition-colors" />
          <input 
            placeholder="Search catalog by name or code..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-14 pr-6 py-4 bg-slate-50 border-2 border-slate-50 rounded-[1.5rem] text-sm font-bold outline-none focus:border-amber-400 focus:bg-white text-slate-800 transition-all shadow-inner"
          />
        </div>
        <div className="flex items-center gap-4 w-full lg:w-auto overflow-x-auto pb-4 lg:pb-0 no-scrollbar">
          <div className="p-1 px-5 bg-slate-50 rounded-2xl flex items-center gap-2 border-2 border-slate-100 shrink-0">
             <Filter className="w-4 h-4 text-slate-400" />
             <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Tiers</span>
          </div>
          {levels.map(l => (
            <button
              key={l}
              onClick={() => setLevelFilter(l)}
              className={`px-8 py-3 rounded-2xl text-xs font-black transition-all border-2 whitespace-nowrap ${
                levelFilter === l 
                  ? "bg-amber-500 border-amber-500 text-white shadow-xl shadow-amber-100" 
                  : "bg-white border-slate-100 text-slate-500 hover:border-amber-400 hover:text-amber-500"
              }`}
            >
              {l}
            </button>
          ))}
        </div>
      </div>

      {/* Subject List Table - Enhanced Padding & Spacing */}
      <div className="bg-white rounded-[3rem] border-2 border-slate-100 shadow-xl shadow-slate-100/50 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-slate-50/50">
              <tr>
                <th className="px-10 py-8 text-left text-[10px] font-black text-slate-400 uppercase tracking-widest">Subject Identity</th>
                <th className="px-10 py-8 text-center text-[10px] font-black text-slate-400 uppercase tracking-widest">Academic Tier</th>
                <th className="px-10 py-8 text-center text-[10px] font-black text-slate-400 uppercase tracking-widest">Classification</th>
                <th className="px-10 py-8 text-center text-[10px] font-black text-slate-400 uppercase tracking-widest">Deployment</th>
                <th className="px-10 py-8 text-right text-[10px] font-black text-slate-400 uppercase tracking-widest">Management</th>
              </tr>
            </thead>
            <tbody className="divide-y-2 divide-slate-50">
              {filteredSubjects.map((subject) => (
                <tr key={subject.id} className="group hover:bg-amber-50/10 transition-all duration-300">
                  <td className="px-10 py-8">
                    <div className="flex items-center gap-5">
                      <div className="w-14 h-14 bg-white border-2 border-slate-50 rounded-[1.25rem] flex items-center justify-center shadow-md group-hover:border-amber-200 group-hover:scale-105 transition-all shrink-0">
                        <Shapes className="w-6 h-6 text-amber-500 animate-pulse" />
                      </div>
                      <div className="flex flex-col">
                        <span className="text-base font-black text-slate-800 tracking-tight">{subject.name}</span>
                        <span className="text-[10px] font-black text-amber-500 uppercase tracking-widest mt-1 px-2 py-0.5 bg-amber-50 rounded w-fit">
                            ID: {subject.code}
                        </span>
                      </div>
                    </div>
                  </td>
                  <td className="px-10 py-8 text-center">
                    <span className="px-6 py-2 bg-indigo-50 text-indigo-600 rounded-2xl text-[10px] font-black uppercase tracking-widest border border-indigo-100 shadow-sm">
                      {subject.level} Level
                    </span>
                  </td>
                  <td className="px-10 py-8 text-center">
                    <div className="flex flex-col items-center">
                        <span className="text-xs font-black text-slate-600 uppercase tracking-tighter">{subject.type}</span>
                        <div className="w-8 h-1 bg-slate-100 rounded-full mt-1.5" />
                    </div>
                  </td>
                  <td className="px-10 py-8 text-center">
                    <div className={`inline-flex items-center gap-2 px-5 py-2.5 rounded-2xl border-2 transition-all ${
                        subject.status === 'active' 
                        ? 'bg-emerald-50 border-emerald-100/50 text-emerald-600' 
                        : 'bg-slate-50 border-slate-100 text-slate-400'
                    }`}>
                       <CheckCircle2 className="w-4 h-4" />
                       <span className="text-[10px] font-black uppercase tracking-widest">Active</span>
                    </div>
                  </td>
                  <td className="px-10 py-8 text-right">
                    <div className="flex items-center justify-end gap-3 opacity-0 group-hover:opacity-100 transition-all translate-x-4 group-hover:translate-x-0">
                      <button 
                        onClick={() => openEditModal(subject)}
                        className="p-3 bg-white border-2 border-slate-100 text-slate-400 hover:text-amber-500 hover:border-amber-200 rounded-2xl transition-all shadow-lg hover:shadow-amber-100"
                      >
                        <Edit3 className="w-5 h-5" />
                      </button>
                      <button 
                        onClick={() => openDeleteModal(subject)}
                        className="p-3 bg-white border-2 border-slate-100 text-slate-400 hover:text-rose-500 hover:border-rose-200 rounded-2xl transition-all shadow-lg hover:shadow-rose-100"
                      >
                        <Trash2 className="w-5 h-5" />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        
        {/* Footer info - Improved Spacing */}
        <div className="px-10 py-8 bg-slate-50/50 border-t-2 border-slate-50 flex flex-col md:flex-row items-center justify-between gap-6">
           <div className="flex items-center gap-4">
              <div className="w-12 h-12 bg-white rounded-2xl flex items-center justify-center shadow-sm border border-slate-100">
                 <Info className="w-6 h-6 text-amber-500" />
              </div>
              <p className="text-sm font-bold text-slate-500">
                Managed by academic board. Total <span className="text-slate-800 font-black underline decoration-amber-500 decoration-2 underline-offset-4">{filteredSubjects.length}</span> active curriculum units.
              </p>
           </div>
           <p className="text-[10px] font-black text-slate-300 uppercase tracking-[0.2em]">Curriculum Control v2.0</p>
        </div>
      </div>

      {/* Add/Edit Modal - Unified & Styled */}
      {isModalOpen && (
        <div className="fixed inset-0 bg-slate-900/70 backdrop-blur-md z-[100] flex items-center justify-center p-6 sm:p-10">
          <div className="bg-white rounded-[3rem] w-full max-w-2xl shadow-[0_32px_64px_-16px_rgba(0,0,0,0.2)] animate-in fade-in zoom-in duration-300 overflow-hidden flex flex-col max-h-[90vh]">
             <div className="p-10 border-b-2 border-slate-50 flex items-center justify-between bg-gradient-to-r from-white to-slate-50/50">
                <div className="flex items-center gap-5">
                    <div className="w-14 h-14 bg-amber-50 text-amber-500 rounded-2xl flex items-center justify-center border-2 border-amber-100/50 shadow-inner">
                        <ShieldCheck className="w-8 h-8" />
                    </div>
                    <div>
                        <h2 className="text-2xl font-black text-slate-800 tracking-tight">
                            {modalType === 'add' ? 'New Curriculum Unity' : 'Modify Asset Specs'}
                        </h2>
                        <p className="text-xs font-black text-slate-400 uppercase tracking-widest mt-1">Core Academic Definition</p>
                    </div>
                </div>
                <button 
                    onClick={() => setIsModalOpen(false)} 
                    className="p-4 bg-slate-100 hover:bg-slate-200 text-slate-500 rounded-2xl transition-all active:scale-90"
                >
                    <X className="w-6 h-6" />
                </button>
             </div>
             
             <div className="p-10 space-y-10 overflow-y-auto">
                <div className="grid grid-cols-2 gap-8">
                    <div className="space-y-3 col-span-2">
                        <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest px-1">Institutional Subject Name</label>
                        <input 
                            value={formData.name}
                            onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                            className="w-full bg-slate-50 border-2 border-slate-100 rounded-2xl px-6 py-5 text-base font-black focus:border-amber-400 focus:bg-white outline-none transition-all shadow-inner" 
                            placeholder="e.g. Higher Arabic Literature" 
                        />
                    </div>
                    <div className="space-y-3 col-span-2 sm:col-span-1">
                        <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest px-1">Academic Code</label>
                        <input 
                            value={formData.code}
                            onChange={(e) => setFormData({ ...formData, code: e.target.value })}
                            className="w-full bg-slate-50 border-2 border-slate-100 rounded-2xl px-6 py-4 text-sm font-black focus:border-amber-400 focus:bg-white outline-none transition-all" 
                            placeholder="e.g. ARB701" 
                        />
                    </div>
                    <div className="space-y-3 col-span-2 sm:col-span-1">
                        <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest px-1">Deployment Status</label>
                        <div className="flex gap-2">
                             <button 
                                onClick={() => setFormData({...formData, status: 'active'})}
                                className={`flex-1 py-4 rounded-xl font-black text-[10px] uppercase tracking-widest border-2 transition-all ${
                                    formData.status === 'active' ? 'bg-emerald-50 border-emerald-500 text-emerald-600' : 'bg-slate-50 border-slate-100 text-slate-400'
                                }`}
                             >
                                Active
                             </button>
                             <button 
                                onClick={() => setFormData({...formData, status: 'inactive'})}
                                className={`flex-1 py-4 rounded-xl font-black text-[10px] uppercase tracking-widest border-2 transition-all ${
                                    formData.status === 'inactive' ? 'bg-rose-50 border-rose-500 text-rose-600' : 'bg-slate-50 border-slate-100 text-slate-400'
                                }`}
                             >
                                Inactive
                             </button>
                        </div>
                    </div>
                    <div className="space-y-3 col-span-2 sm:col-span-1">
                        <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest px-1">Academic Tier</label>
                        <select 
                            value={formData.level}
                            onChange={(e) => setFormData({ ...formData, level: e.target.value })}
                            className="w-full bg-slate-50 border-2 border-slate-100 rounded-2xl px-6 py-4 text-sm font-black focus:border-amber-400 outline-none appearance-none cursor-pointer"
                        >
                            <option>Primary</option>
                            <option>Secondary</option>
                            <option>Hifz</option>
                            <option>Kitab</option>
                        </select>
                    </div>
                    <div className="space-y-3 col-span-2 sm:col-span-1">
                        <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest px-1">Category Bracket</label>
                        <select 
                            value={formData.type}
                            onChange={(e) => setFormData({ ...formData, type: e.target.value })}
                            className="w-full bg-slate-50 border-2 border-slate-100 rounded-2xl px-6 py-4 text-sm font-black focus:border-amber-400 outline-none appearance-none cursor-pointer"
                        >
                            <option>Religious</option>
                            <option>General</option>
                            <option>Technical</option>
                        </select>
                    </div>
                </div>

                <div className="flex gap-6 pt-5">
                    <button 
                        onClick={() => setIsModalOpen(false)} 
                        className="flex-1 py-5 text-slate-400 font-black rounded-2xl hover:bg-slate-100 transition-all text-sm uppercase tracking-widest"
                    >
                        Discard
                    </button>
                    <button 
                        onClick={handleAction}
                        className="flex-1 py-5 bg-amber-500 text-white font-black rounded-2xl shadow-2xl shadow-amber-100 hover:bg-amber-600 active:scale-95 transition-all text-sm uppercase tracking-widest flex items-center justify-center gap-3"
                    >
                        <CheckCircle2 className="w-5 h-5" /> {modalType === 'add' ? 'Seal Registry' : 'Push Update'}
                    </button>
                </div>
             </div>
          </div>
        </div>
      )}

      {/* Delete Confirmation Modal - Styled */}
      {isDeleteModalOpen && (
        <div className="fixed inset-0 bg-slate-900/70 backdrop-blur-md z-[100] flex items-center justify-center p-6">
           <div className="bg-white rounded-[3rem] w-full max-w-md shadow-2xl animate-in fade-in zoom-in duration-300 overflow-hidden">
              <div className="p-10 text-center space-y-8">
                <div className="w-24 h-24 bg-rose-50 text-rose-500 rounded-[2.5rem] flex items-center justify-center mx-auto border-4 border-white shadow-2xl shadow-rose-100 relative">
                    <div className="absolute inset-0 bg-rose-500 rounded-[2.5rem] animate-ping opacity-10" />
                    <AlertCircle className="w-10 h-10 relative z-10" />
                </div>
                <div className="space-y-3">
                    <h2 className="text-3xl font-black text-slate-800 tracking-tight">Archive Subject?</h2>
                    <p className="text-sm font-bold text-slate-400 px-6 leading-relaxed">
                        By archiving <span className="text-slate-800 font-black underline decoration-rose-500 underline-offset-4">{selectedSubject?.name}</span>, it will be removed from all active curricula and timetables.
                    </p>
                </div>
                
                <div className="flex flex-col gap-4 mt-4">
                    <button 
                        onClick={handleDelete} 
                        className="w-full py-5 bg-rose-500 text-white font-black rounded-2xl shadow-xl shadow-rose-200 hover:bg-rose-600 active:scale-95 transition-all uppercase tracking-widest text-xs"
                    >
                        Confirm Permanent Purge
                    </button>
                    <button 
                        onClick={() => setIsDeleteModalOpen(false)} 
                        className="w-full py-5 font-black text-slate-400 hover:bg-slate-50 rounded-2xl transition-all uppercase tracking-widest text-xs"
                    >
                        Retain Archive
                    </button>
                </div>
              </div>
           </div>
        </div>
      )}
    </div>
  );
};

export default SubjectList;
