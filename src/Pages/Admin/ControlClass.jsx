import { useState } from "react";
import { 
  Plus, 
  Search, 
  Layers, 
  Edit2, 
  Trash2, 
  CheckCircle2,
  XCircle,
  MoreVertical,
  Activity,
  UserCheck2,
  Trophy,
  ArrowRight,
  X,
  AlertCircle,
  ShieldCheck
} from "lucide-react";

const ControlClass = () => {
  const [searchTerm, setSearchTerm] = useState("");
  
  // Modal States
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);

  // Focus States
  const [selectedLevel, setSelectedLevel] = useState(null);

  // Form States
  const [formData, setFormData] = useState({
    name: "",
    code: "",
    status: "active",
    description: ""
  });

  // Sample Data: Academic Levels / Controls
  const [levels, setLevels] = useState([
    { id: 1, name: "Primary (Ibtedaiy)", code: "PRI", status: "active", studentCount: 120, description: "Lower grade academic foundation level." },
    { id: 2, name: "Secondary (Mutawassitah)", code: "SEC", status: "active", studentCount: 85, description: "Intermediate academic and religious studies." },
    { id: 3, name: "Hifz (Memorization)", code: "HIFZ", status: "active", studentCount: 45, description: "Dedicated Quran memorization program." },
    { id: 4, name: "Kitab (Higher Studies)", code: "KITAB", status: "inactive", studentCount: 30, description: "Advanced dars-e-nizami curriculum." },
  ]);

  // Handlers
  const handleAddLevel = () => {
    const newLevel = {
      id: Date.now(),
      ...formData,
      studentCount: 0
    };
    setLevels([...levels, newLevel]);
    setIsAddModalOpen(false);
    resetForm();
  };

  const handleEditLevel = () => {
    setLevels(levels.map(l => l.id === selectedLevel.id ? { ...l, ...formData } : l));
    setIsEditModalOpen(false);
    resetForm();
  };

  const handleDeleteLevel = () => {
    setLevels(levels.filter(l => l.id !== selectedLevel.id));
    setIsDeleteModalOpen(false);
  };

  const resetForm = () => {
    setFormData({ name: "", code: "", status: "active", description: "" });
    setSelectedLevel(null);
  };

  const filteredLevels = levels.filter(l => 
    l.name.toLowerCase().includes(searchTerm.toLowerCase()) || 
    l.code.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="space-y-8 animate-in fade-in duration-500 p-4 md:p-8">
      {/* Header Section */}
      <div className="bg-white rounded-[2.5rem] border-2 border-slate-200 p-8 flex flex-col md:flex-row justify-between items-center gap-6 shadow-sm">
        <div className="flex items-center gap-6">
          <div className="w-16 h-16 bg-purple-50 rounded-2xl flex items-center justify-center border-2 border-purple-100">
            <Layers className="w-8 h-8 text-purple-600" />
          </div>
          <div>
            <h1 className="text-2xl md:text-3xl font-black text-slate-800">Control Class</h1>
            <p className="text-slate-500 font-bold mt-1">Define and manage academic levels & categories</p>
          </div>
        </div>

        <button 
          onClick={() => {
              resetForm();
              setIsAddModalOpen(true);
          }}
          className="w-full md:w-auto px-8 py-4 bg-purple-600 text-white rounded-2xl font-black shadow-xl shadow-purple-200 hover:bg-purple-700 hover:scale-[1.02] active:scale-95 transition-all flex items-center justify-center gap-3"
        >
          <Plus className="w-5 h-5" />
          Add New Level
        </button>
      </div>

      {/* Main Content Area */}
      <div className="bg-white rounded-[2.5rem] border-2 border-slate-200 shadow-sm overflow-hidden">
        {/* Table Toolbar */}
        <div className="p-6 border-b-2 border-slate-50 flex flex-col md:flex-row gap-4 items-center justify-between">
          <div className="relative w-full md:w-96">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400" />
            <input 
              placeholder="Search academic levels..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-12 pr-4 py-3 bg-slate-50 border-2 border-slate-100 rounded-2xl text-sm font-bold outline-none focus:border-purple-500 transition-all"
            />
          </div>
          <div className="flex items-center gap-2 text-xs font-black text-slate-400 uppercase tracking-widest">
            <Activity className="w-4 h-4" />
            {levels.filter(l => l.status === 'active').length} Active Levels
          </div>
        </div>

        {/* Table */}
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-slate-50/50">
              <tr>
                <th className="px-8 py-5 text-left text-[10px] font-black text-slate-500 uppercase tracking-widest">Level Name & Code</th>
                <th className="px-8 py-5 text-left text-[10px] font-black text-slate-500 uppercase tracking-widest">Description</th>
                <th className="px-8 py-5 text-center text-[10px] font-black text-slate-500 uppercase tracking-widest">Student Load</th>
                <th className="px-8 py-5 text-center text-[10px] font-black text-slate-500 uppercase tracking-widest">Status</th>
                <th className="px-8 py-5 text-right text-[10px] font-black text-slate-500 uppercase tracking-widest">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y-2 divide-slate-50">
              {filteredLevels.map((level) => (
                <tr key={level.id} className="group hover:bg-purple-50/30 transition-colors">
                  <td className="px-8 py-6">
                    <div className="flex flex-col">
                      <span className="text-sm font-black text-slate-800">{level.name}</span>
                      <span className="text-[10px] font-black text-purple-600 mt-1 uppercase tracking-tighter">Code: {level.code}</span>
                    </div>
                  </td>
                  <td className="px-8 py-6">
                    <p className="text-xs font-bold text-slate-500 max-w-xs">{level.description}</p>
                  </td>
                  <td className="px-8 py-6">
                    <div className="flex flex-col items-center">
                      <div className="flex items-center gap-1.5 text-sm font-black text-slate-700">
                        <UserCheck2 className="w-4 h-4 text-emerald-500" />
                        {level.studentCount}
                      </div>
                      <div className="w-24 h-1.5 bg-slate-100 rounded-full mt-2 overflow-hidden">
                        <div 
                          className="h-full bg-purple-500 rounded-full" 
                          style={{ width: `${(level.studentCount / 150) * 100}%` }}
                        />
                      </div>
                    </div>
                  </td>
                  <td className="px-8 py-6 text-center">
                    <span className={`inline-flex items-center gap-1.5 px-4 py-2 rounded-xl text-[10px] font-black uppercase tracking-widest border-2 ${
                      level.status === 'active' 
                        ? 'bg-emerald-50 text-emerald-700 border-emerald-100/50' 
                        : 'bg-slate-100 text-slate-400 border-slate-200'
                    }`}>
                      {level.status === 'active' ? <CheckCircle2 className="w-3.5 h-3.5" /> : <XCircle className="w-3.5 h-3.5" />}
                      {level.status}
                    </span>
                  </td>
                  <td className="px-8 py-6 text-right">
                    <div className="flex items-center justify-end gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                      <button 
                        onClick={() => {
                            setSelectedLevel(level);
                            setFormData({ name: level.name, code: level.code, status: level.status, description: level.description });
                            setIsEditModalOpen(true);
                        }}
                        className="p-2.5 bg-white border-2 border-slate-100 text-slate-400 hover:text-purple-600 hover:border-purple-200 rounded-xl transition-all shadow-sm"
                      >
                        <Edit2 className="w-4 h-4" />
                      </button>
                      <button 
                        onClick={() => {
                            setSelectedLevel(level);
                            setIsDeleteModalOpen(true);
                        }}
                        className="p-2.5 bg-white border-2 border-slate-100 text-slate-400 hover:text-rose-600 hover:border-rose-200 rounded-xl transition-all shadow-sm"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* Level Perks / Notice */}
        <div className="p-8 bg-slate-50/50 border-t-2 border-slate-50 flex items-center justify-between">
          <div className="flex items-center gap-4">
             <div className="w-12 h-12 bg-white rounded-xl flex items-center justify-center shadow-sm border border-slate-100">
                <Trophy className="w-6 h-6 text-amber-500" />
             </div>
             <div>
                <p className="text-xs font-black text-slate-800 uppercase">Pro Tip</p>
                <p className="text-[11px] font-bold text-slate-500">Academic levels help organize subjects and exams more efficiently.</p>
             </div>
          </div>
          <button className="px-6 py-2.5 bg-white border-2 border-slate-200 rounded-xl text-xs font-black text-slate-600 hover:bg-slate-50 transition-all flex items-center gap-2">
            View Analytics <ArrowRight className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* Add/Edit Modal */}
      {(isAddModalOpen || isEditModalOpen) && (
        <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-sm z-[100] flex items-center justify-center p-4">
          <div className="bg-white rounded-[2.5rem] w-full max-w-xl shadow-2xl animate-in fade-in zoom-in duration-300 overflow-hidden">
            <div className="p-8 border-b-2 border-slate-50 flex items-center justify-between">
              <h2 className="text-2xl font-black text-slate-800">
                {isEditModalOpen ? "Modify Academic Level" : "New Academic Level"}
              </h2>
              <button 
                onClick={() => {
                    setIsAddModalOpen(false);
                    setIsEditModalOpen(false);
                }}
                className="p-3 hover:bg-slate-100 rounded-2xl transition-all"
              >
                <X className="w-6 h-6 text-slate-400" />
              </button>
            </div>
            <div className="p-8 space-y-6">
              <div className="grid grid-cols-2 gap-6">
                <div className="space-y-2 col-span-2 sm:col-span-1">
                  <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Level Name</label>
                  <input 
                    value={formData.name}
                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                    className="w-full bg-slate-50 border-2 border-slate-100 rounded-2xl px-6 py-4 text-sm font-bold focus:border-purple-500 outline-none" 
                    placeholder="e.g. Higher Secondary" 
                  />
                </div>
                <div className="space-y-2 col-span-2 sm:col-span-1">
                  <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Short Code</label>
                  <input 
                    value={formData.code}
                    onChange={(e) => setFormData({ ...formData, code: e.target.value })}
                    className="w-full bg-slate-50 border-2 border-slate-100 rounded-2xl px-6 py-4 text-sm font-bold focus:border-purple-500 outline-none" 
                    placeholder="e.g. HS" 
                  />
                </div>
                <div className="space-y-2 col-span-2">
                    <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Deployment Status</label>
                    <div className="grid grid-cols-2 gap-4">
                        <button 
                          onClick={() => setFormData({ ...formData, status: 'active' })}
                          className={`flex items-center justify-center gap-3 py-4 rounded-2xl border-2 font-black transition-all ${
                            formData.status === 'active' 
                                ? 'bg-emerald-50 border-emerald-500 text-emerald-700' 
                                : 'bg-slate-50 border-slate-100 text-slate-400'
                          }`}
                        >
                            <CheckCircle2 className="w-4 h-4" /> Active
                        </button>
                        <button 
                          onClick={() => setFormData({ ...formData, status: 'inactive' })}
                          className={`flex items-center justify-center gap-3 py-4 rounded-2xl border-2 font-black transition-all ${
                            formData.status === 'inactive' 
                                ? 'bg-rose-50 border-rose-500 text-rose-700' 
                                : 'bg-slate-50 border-slate-100 text-slate-400'
                          }`}
                        >
                            <XCircle className="w-4 h-4" /> Inactive
                        </button>
                    </div>
                </div>
                <div className="space-y-2 col-span-2">
                  <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Level Mission/Description</label>
                  <textarea 
                    value={formData.description}
                    onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                    className="w-full bg-slate-50 border-2 border-slate-100 rounded-2xl px-6 py-4 text-sm font-bold focus:border-purple-500 outline-none h-32" 
                    placeholder="Brief details about this level..." 
                  />
                </div>
              </div>
              <div className="flex gap-4 pt-4">
                <button 
                  onClick={() => {
                      setIsAddModalOpen(false);
                      setIsEditModalOpen(false);
                  }}
                  className="flex-1 py-4 text-slate-500 font-black rounded-2xl hover:bg-slate-50 transition-all"
                >
                    Discard
                </button>
                <button 
                  onClick={isEditModalOpen ? handleEditLevel : handleAddLevel}
                  className="flex-1 py-4 bg-purple-600 text-white font-black rounded-2xl shadow-xl shadow-purple-200 hover:bg-purple-700 transition-all"
                >
                    {isEditModalOpen ? "Update Assets" : "Save Level"}
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Delete Confirmation Modal */}
      {isDeleteModalOpen && (
        <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-sm z-[100] flex items-center justify-center p-4">
           <div className="bg-white rounded-[2.5rem] w-full max-w-sm shadow-2xl animate-in fade-in zoom-in duration-300 overflow-hidden">
              <div className="p-8 text-center space-y-4">
                <div className="w-20 h-20 bg-rose-50 text-rose-500 rounded-3xl flex items-center justify-center mx-auto border-2 border-rose-100 shadow-sm">
                    <AlertCircle className="w-10 h-10" />
                </div>
                <h2 className="text-2xl font-black text-slate-800">Critical Action</h2>
                <div className="p-4 bg-slate-50 rounded-2xl space-y-2">
                    <p className="text-xs font-bold text-slate-500 uppercase tracking-widest">Confirm Deletion</p>
                    <p className="text-sm font-black text-slate-800">{selectedLevel?.name}</p>
                </div>
                <p className="text-xs font-bold text-slate-400">Removing this level may impact associated classes and curriculum archives.</p>
                <div className="flex gap-4 pt-4">
                    <button onClick={() => setIsDeleteModalOpen(false)} className="flex-1 py-4 font-black text-slate-400 hover:bg-slate-50 rounded-2xl transition-all">Cancel</button>
                    <button onClick={handleDeleteLevel} className="flex-1 py-4 bg-rose-500 text-white font-black rounded-2xl shadow-xl shadow-rose-200 hover:bg-rose-600 transition-all">Delete Forever</button>
                </div>
              </div>
           </div>
        </div>
      )}
    </div>
  );
};

export default ControlClass;
