import { useState } from "react";
import { 
  Plus, 
  Search, 
  MoreVertical, 
  Users, 
  BookOpen, 
  Layers, 
  Edit2, 
  Trash2, 
  CheckCircle2,
  Settings2,
  ChevronRight,
  School,
  X,
  Calendar,
  ShieldCheck,
  AlertCircle
} from "lucide-react";

const DepartmentSectionList = () => {
  const [searchTerm, setSearchTerm] = useState("");
  
  // Modal States
  const [isAddClassModalOpen, setIsAddClassModalOpen] = useState(false);
  const [isEditClassModalOpen, setIsEditClassModalOpen] = useState(false);
  const [isAddSectionModalOpen, setIsAddSectionModalOpen] = useState(false);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [isDetailsModalOpen, setIsDetailsModalOpen] = useState(false);

  // Focus States
  const [selectedClass, setSelectedClass] = useState(null);
  const [newSectionName, setNewSectionName] = useState("");

  // Form States
  const [formData, setFormData] = useState({
    name: "",
    level: "Primary",
    studentCount: 0
  });

  // Sample Data
  const [classes, setClasses] = useState([
    { id: 1, name: "Class 5", sections: ["Section A", "Section B"], studentCount: 45, level: "Primary" },
    { id: 2, name: "Class 6", sections: ["Section A", "Section C"], studentCount: 38, level: "Secondary" },
    { id: 3, name: "Class 4", sections: ["Section A"], studentCount: 22, level: "Primary" },
    { id: 4, name: "Hifz Class", sections: ["Morning", "Afternoon"], studentCount: 50, level: "Hifz" },
  ]);

  // Handlers
  const handleAddClass = () => {
    const newClass = {
      id: Date.now(),
      ...formData,
      sections: []
    };
    setClasses([...classes, newClass]);
    setIsAddClassModalOpen(false);
    resetForm();
  };

  const handleEditClass = () => {
    setClasses(classes.map(c => c.id === selectedClass.id ? { ...c, ...formData } : c));
    setIsEditClassModalOpen(false);
    resetForm();
  };

  const handleDeleteClass = () => {
    setClasses(classes.filter(c => c.id !== selectedClass.id));
    setIsDeleteModalOpen(false);
  };

  const handleAddSection = () => {
    if (!newSectionName) return;
    setClasses(classes.map(c => 
      c.id === selectedClass.id ? { ...c, sections: [...c.sections, newSectionName] } : c
    ));
    setIsAddSectionModalOpen(false);
    setNewSectionName("");
  };

  const removeSection = (classId, sectionName) => {
    setClasses(classes.map(c => 
      c.id === classId ? { ...c, sections: c.sections.filter(s => s !== sectionName) } : c
    ));
  };

  const resetForm = () => {
    setFormData({ name: "", level: "Primary", studentCount: 0 });
    setSelectedClass(null);
  };

  const filteredClasses = classes.filter(c => 
    c.name.toLowerCase().includes(searchTerm.toLowerCase()) || 
    c.level.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="space-y-8 animate-in fade-in duration-500 p-4 md:p-8">
      {/* Header Section */}
      <div className="bg-white rounded-3xl border-2 border-slate-200 p-6 flex flex-col md:flex-row justify-between items-center gap-6 shadow-sm">
        <div>
          <h1 className="text-2xl md:text-3xl font-black text-slate-800 flex items-center gap-3">
            <School className="w-8 h-8 text-[#00bd7f]" />
            Department & Section
          </h1>
          <p className="text-slate-500 font-bold mt-1">Manage academic structure and grade levels</p>
        </div>

        <div className="flex gap-3 w-full md:w-auto">
          <button 
            onClick={() => {
                resetForm();
                setIsAddClassModalOpen(true);
            }}
            className="flex-1 md:flex-none px-6 py-3 bg-[#00bd7f] text-white rounded-2xl font-black shadow-xl shadow-emerald-200 hover:scale-[1.02] active:scale-95 transition-all flex items-center justify-center gap-2"
          >
            <Plus className="w-5 h-5" />
            Add Class
          </button>
        </div>
      </div>

      {/* Stats Quick View */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
        {[
          { label: "Total Classes", value: classes.length, icon: Layers, color: "text-blue-600", bg: "bg-blue-50" },
          { label: "Active Sections", value: classes.reduce((acc, c) => acc + c.sections.length, 0), icon: Settings2, color: "text-purple-600", bg: "bg-purple-50" },
          { label: "Total Capacity", value: classes.reduce((acc, c) => acc + c.studentCount, 0), icon: Users, color: "text-[#00bd7f]", bg: "bg-emerald-50" },
        ].map((stat, i) => (
          <div key={i} className="bg-white p-6 rounded-3xl border-2 border-slate-100 shadow-sm flex items-center gap-4">
            <div className={`w-14 h-14 ${stat.bg} rounded-2xl flex items-center justify-center`}>
              <stat.icon className={`w-7 h-7 ${stat.color}`} />
            </div>
            <div>
              <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">{stat.label}</p>
              <p className="text-2xl font-black text-slate-800">{stat.value}</p>
            </div>
          </div>
        ))}
      </div>

      {/* Search & Layout Control */}
      <div className="bg-white p-6 rounded-3xl border-2 border-slate-200 shadow-sm flex flex-col md:flex-row gap-4">
        <div className="relative flex-1">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400" />
          <input 
            placeholder="Search classes or levels..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-12 pr-4 py-3 bg-slate-50 border-2 border-slate-100 rounded-2xl text-sm font-bold outline-none focus:border-[#00bd7f] transition-all"
          />
        </div>
      </div>

      {/* Classes Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-8">
        {filteredClasses.map((cls) => (
          <div key={cls.id} className="group bg-white rounded-[2rem] border-2 border-slate-200 shadow-sm hover:shadow-xl hover:border-[#00bd7f]/30 transition-all duration-300 flex flex-col">
            <div className="p-8 space-y-6">
              <div className="flex justify-between items-start">
                <div>
                  <div className="px-3 py-1 bg-[#e6f4ef] text-emerald-700 text-[10px] font-black uppercase tracking-widest rounded-full w-fit mb-3">
                    {cls.level}
                  </div>
                  <h3 className="text-2xl font-black text-slate-800">{cls.name}</h3>
                </div>
                <div className="flex gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                  <button 
                    onClick={() => {
                        setSelectedClass(cls);
                        setFormData({ name: cls.name, level: cls.level, studentCount: cls.studentCount });
                        setIsEditClassModalOpen(true);
                    }}
                    className="p-2 hover:bg-slate-100 rounded-xl transition-all"
                  >
                    <Edit2 className="w-4 h-4 text-slate-400 hover:text-blue-500" />
                  </button>
                  <button 
                    onClick={() => {
                        setSelectedClass(cls);
                        setIsDeleteModalOpen(true);
                    }}
                    className="p-2 hover:bg-rose-50 rounded-xl transition-all"
                  >
                    <Trash2 className="w-4 h-4 text-slate-400 hover:text-rose-500" />
                  </button>
                </div>
              </div>

              <div className="space-y-4">
                <div className="flex items-center justify-between text-sm font-bold">
                  <span className="text-slate-400">Sections</span>
                  <span className="text-slate-800">{cls.sections.length}</span>
                </div>
                <div className="flex flex-wrap gap-2">
                  {cls.sections.map((sec, idx) => (
                    <div key={idx} className="px-4 py-2 bg-slate-50 border-2 border-slate-100 rounded-xl text-xs font-black text-slate-600 flex items-center gap-2 group/sec">
                      <div className="w-1.5 h-1.5 rounded-full bg-[#00bd7f]" />
                      {sec}
                      <button 
                        onClick={() => removeSection(cls.id, sec)}
                        className="opacity-0 group-hover/sec:opacity-100 transition-all hover:text-rose-500"
                      >
                        <X className="w-3 h-3" />
                      </button>
                    </div>
                  ))}
                  <button 
                    onClick={() => {
                        setSelectedClass(cls);
                        setIsAddSectionModalOpen(true);
                    }}
                    className="px-4 py-2 border-2 border-dashed border-slate-300 rounded-xl text-xs font-black text-slate-400 hover:border-[#00bd7f] hover:text-[#00bd7f] transition-all"
                  >
                    + Add
                  </button>
                </div>
              </div>
            </div>

            <div className="mt-auto border-t-2 border-slate-50 p-6 bg-[#f8fbfa] rounded-b-[2rem] flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Users className="w-4 h-4 text-slate-400" />
                <span className="text-xs font-black text-slate-500 uppercase">{cls.studentCount} Students</span>
              </div>
              <button 
                onClick={() => {
                    setSelectedClass(cls);
                    setIsDetailsModalOpen(true);
                }}
                className="flex items-center gap-2 text-xs font-black text-[#00bd7f] hover:underline"
              >
                View Details <ChevronRight className="w-4 h-4" />
              </button>
            </div>
          </div>
        ))}

        {/* Empty State / Add Card */}
        <button 
          onClick={() => {
              resetForm();
              setIsAddClassModalOpen(true);
          }}
          className="bg-slate-50/50 rounded-[2rem] border-4 border-dashed border-slate-200 flex flex-col items-center justify-center p-12 hover:border-[#00bd7f]/50 hover:bg-emerald-50/20 transition-all group min-h-[300px]"
        >
          <div className="w-16 h-16 bg-white rounded-2xl flex items-center justify-center shadow-sm group-hover:scale-110 transition-transform mb-4 border-2 border-slate-100">
            <Plus className="w-8 h-8 text-slate-300 group-hover:text-[#00bd7f]" />
          </div>
          <p className="text-lg font-black text-slate-400 group-hover:text-slate-600">Create New Class</p>
        </button>
      </div>

      {/* Add/Edit Class Modal */}
      {(isAddClassModalOpen || isEditClassModalOpen) && (
        <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-sm z-[100] flex items-center justify-center p-4">
          <div className="bg-white rounded-[2.5rem] w-full max-w-lg shadow-2xl animate-in zoom-in duration-300 overflow-hidden">
            <div className="p-8 border-b-2 border-slate-50 flex items-center justify-between">
              <h2 className="text-2xl font-black text-slate-800">
                {isEditClassModalOpen ? "Edit Class" : "Add New Class"}
              </h2>
              <button 
                onClick={() => {
                    setIsAddClassModalOpen(false);
                    setIsEditClassModalOpen(false);
                }}
                className="p-3 hover:bg-slate-100 rounded-2xl transition-all"
              >
                <X className="w-6 h-6 text-slate-400" />
              </button>
            </div>
            <div className="p-8 space-y-6">
              <div className="space-y-2">
                <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Class Name</label>
                <input 
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  placeholder="e.g. Class 7 or Fazil 1st Year"
                  className="w-full bg-slate-50 border-2 border-slate-100 rounded-2xl px-6 py-4 text-sm font-bold focus:border-[#00bd7f] outline-none"
                />
              </div>
              <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Academic Level</label>
                    <select 
                      value={formData.level}
                      onChange={(e) => setFormData({ ...formData, level: e.target.value })}
                      className="w-full bg-slate-50 border-2 border-slate-100 rounded-2xl px-6 py-4 text-sm font-bold focus:border-[#00bd7f] outline-none appearance-none"
                    >
                      <option>Primary</option>
                      <option>Secondary</option>
                      <option>Higher Secondary</option>
                      <option>Hifz</option>
                      <option>Kitab</option>
                    </select>
                  </div>
                  <div className="space-y-2">
                    <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Initial Student Count</label>
                    <input 
                      type="number"
                      value={formData.studentCount}
                      onChange={(e) => setFormData({ ...formData, studentCount: parseInt(e.target.value) || 0 })}
                      className="w-full bg-slate-50 border-2 border-slate-100 rounded-2xl px-6 py-4 text-sm font-bold focus:border-[#00bd7f] outline-none"
                    />
                  </div>
              </div>
              <div className="pt-4 flex gap-4">
                <button 
                  onClick={() => {
                      setIsAddClassModalOpen(false);
                      setIsEditClassModalOpen(false);
                  }}
                  className="flex-1 py-4 text-slate-500 font-black rounded-2xl hover:bg-slate-50 transition-all"
                >
                  Cancel
                </button>
                <button 
                  onClick={isEditClassModalOpen ? handleEditClass : handleAddClass}
                  className="flex-1 py-4 bg-[#00bd7f] text-white font-black rounded-2xl shadow-xl shadow-emerald-200 transition-all"
                >
                  {isEditClassModalOpen ? "Save Changes" : "Create Class"}
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Add Section Modal */}
      {isAddSectionModalOpen && (
        <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-sm z-[100] flex items-center justify-center p-4">
          <div className="bg-white rounded-[2.5rem] w-full max-w-sm shadow-2xl animate-in zoom-in duration-300 overflow-hidden">
             <div className="p-8 border-b-2 border-slate-50 flex items-center justify-between">
                <h2 className="text-xl font-black text-slate-800">Add Section</h2>
                <button onClick={() => setIsAddSectionModalOpen(false)} className="p-2 hover:bg-slate-100 rounded-xl transition-all">
                    <X className="w-5 h-5 text-slate-300" />
                </button>
             </div>
             <div className="p-8 space-y-6">
                <div className="text-center">
                    <div className="w-16 h-16 bg-emerald-50 text-[#00bd7f] rounded-2xl flex items-center justify-center mx-auto mb-4 border-2 border-emerald-100">
                        <Layers className="w-8 h-8" />
                    </div>
                    <p className="text-sm font-bold text-slate-500">Adding new section for</p>
                    <h3 className="text-lg font-black text-slate-800 uppercase">{selectedClass?.name}</h3>
                </div>
                <div className="space-y-2">
                    <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Section Name</label>
                    <input 
                      value={newSectionName}
                      onChange={(e) => setNewSectionName(e.target.value)}
                      placeholder="e.g. Section D or Afternoon"
                      className="w-full bg-slate-50 border-2 border-slate-100 rounded-2xl px-6 py-4 text-sm font-bold focus:border-[#00bd7f] outline-none"
                    />
                </div>
                <button 
                  onClick={handleAddSection}
                  className="w-full py-4 bg-[#00bd7f] text-white font-black rounded-2xl shadow-xl shadow-emerald-200 transition-all"
                >
                  Add Now
                </button>
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
                <h2 className="text-2xl font-black text-slate-800">Are you sure?</h2>
                <p className="text-slate-500 font-bold p-2 bg-slate-50 rounded-2xl">
                    This will permanently delete <span className="text-slate-800 font-black">{selectedClass?.name}</span> and all its associated sections.
                </p>
                <div className="flex gap-4 pt-4">
                    <button onClick={() => setIsDeleteModalOpen(false)} className="flex-1 py-4 font-black text-slate-400 hover:bg-slate-50 rounded-2xl transition-all">Cancel</button>
                    <button onClick={handleDeleteClass} className="flex-1 py-4 bg-rose-500 text-white font-black rounded-2xl shadow-xl shadow-rose-200 hover:bg-rose-600 transition-all">Delete</button>
                </div>
              </div>
           </div>
        </div>
      )}

      {/* View Details Modal */}
      {isDetailsModalOpen && (
        <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-sm z-[100] flex items-center justify-center p-4">
           <div className="bg-white rounded-[2.5rem] w-full max-w-2xl shadow-2xl animate-in zoom-in duration-300 overflow-hidden flex flex-col max-h-[90vh]">
              <div className="p-8 border-b-2 border-slate-50 flex items-center justify-between">
                 <div className="flex items-center gap-4">
                    <div className="w-12 h-12 bg-emerald-50 text-[#00bd7f] rounded-2xl flex items-center justify-center border-2 border-emerald-100">
                        <ShieldCheck className="w-6 h-6" />
                    </div>
                    <div>
                        <h2 className="text-2xl font-black text-slate-800">Class Insight</h2>
                        <p className="text-xs font-bold text-slate-400">Detailed overview of academic tier</p>
                    </div>
                 </div>
                 <button onClick={() => setIsDetailsModalOpen(false)} className="p-3 hover:bg-slate-100 rounded-2xl transition-all">
                    <X className="w-6 h-6 text-slate-400" />
                 </button>
              </div>
              
              <div className="p-8 overflow-y-auto space-y-8">
                 <div className="grid grid-cols-2 gap-8">
                    <div className="space-y-1">
                        <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Formal Name</p>
                        <p className="text-xl font-black text-slate-800">{selectedClass?.name}</p>
                    </div>
                    <div className="space-y-1">
                        <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Academic Level</p>
                        <p className="text-xl font-black text-slate-800">{selectedClass?.level}</p>
                    </div>
                    <div className="space-y-1">
                        <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Student Enrollment</p>
                        <div className="flex items-center gap-3">
                            <p className="text-xl font-black text-slate-800">{selectedClass?.studentCount}</p>
                            <span className="px-2 py-0.5 bg-emerald-50 text-emerald-600 text-[9px] font-black rounded border border-emerald-100 uppercase">Capacity OK</span>
                        </div>
                    </div>
                    <div className="space-y-1">
                        <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Active Status</p>
                        <div className="flex items-center gap-2">
                            <div className="w-2.5 h-2.5 rounded-full bg-[#00bd7f] animate-pulse" />
                            <p className="text-sm font-black text-slate-800 uppercase tracking-widest">Operational</p>
                        </div>
                    </div>
                 </div>

                 <div className="space-y-4">
                    <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Section Distribution</p>
                    <div className="grid grid-cols-2 gap-4">
                        {selectedClass?.sections.map((s, idx) => (
                            <div key={idx} className="p-4 bg-slate-50 rounded-2xl border-2 border-slate-100 flex items-center justify-between group">
                                <div className="flex items-center gap-3">
                                    <div className="w-8 h-8 bg-white rounded-xl flex items-center justify-center font-black text-xs text-[#00bd7f] shadow-sm">
                                        {String.fromCharCode(65 + idx)}
                                    </div>
                                    <span className="font-bold text-slate-700">{s}</span>
                                </div>
                                <span className="text-[9px] font-black text-slate-300 uppercase opacity-0 group-hover:opacity-100 transition-opacity tracking-widest">Subscribed</span>
                            </div>
                        ))}
                    </div>
                 </div>

                 <div className="p-6 bg-blue-50/50 rounded-3xl border-2 border-blue-100 flex items-center gap-4">
                    <div className="w-12 h-12 bg-white rounded-2xl flex items-center justify-center shadow-sm text-blue-500">
                        <Calendar className="w-6 h-6" />
                    </div>
                    <div>
                        <p className="text-[10px] font-black text-blue-400 uppercase tracking-widest">Registration Metadata</p>
                        <p className="text-sm font-bold text-blue-700">Created on Jan 08, 2026 by Administrator</p>
                    </div>
                 </div>
              </div>

              <div className="p-8 bg-slate-50/50 border-t-2 border-slate-50 flex gap-4">
                 <button 
                   onClick={() => {
                        setIsDetailsModalOpen(false);
                        setIsEditClassModalOpen(true);
                   }}
                   className="flex-1 py-4 bg-white border-2 border-slate-200 text-slate-700 rounded-2xl font-black hover:bg-slate-100 transition-all flex items-center justify-center gap-2"
                 >
                    <Edit2 className="w-4 h-4 text-blue-500" /> Modify Parameters
                 </button>
                 <button 
                   onClick={() => setIsDetailsModalOpen(false)}
                   className="px-8 py-4 bg-slate-800 text-white rounded-2xl font-black shadow-lg shadow-slate-200"
                 >
                    Done
                 </button>
              </div>
           </div>
        </div>
      )}
    </div>
  );
};

export default DepartmentSectionList;
