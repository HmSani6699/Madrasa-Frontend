import { useState, useEffect } from "react";
import {
  Plus,
  Search,
  Settings2,
  Layers,
  BookOpen,
  Hash,
  CheckCircle2,
  XCircle,
  MoreVertical,
  Edit3,
  Trash2,
  AlertCircle,
  Link2,
  X,
  ShieldCheck,
  ChevronRight,
  Filter,
  School,
  Save
} from "lucide-react";
import axiosInstance from "../../api/axiosInstance";
import { toast } from "react-hot-toast";

const ClassAssign = () => {
  const [searchTerm, setSearchTerm] = useState("");
  const [loading, setLoading] = useState(false);

  // Data States
  const [classes, setClasses] = useState([]);
  const [sections, setSections] = useState([]);
  const [subjects, setSubjects] = useState([]);
  
  // View State - Grouped by Class for UI
  const [mappings, setMappings] = useState([]);

  // Modal States
  const [isModalOpen, setIsModalOpen] = useState(false);
  
  // Form States
  const [formData, setFormData] = useState({
    classId: "",
    sectionIds: [],
    subjectIds: [],
  });

  const fetchData = async () => {
    setLoading(true);
    try {
      const [classRes, sectionRes, subjectRes] = await Promise.all([
        axiosInstance.get("/v1/classes"),
        axiosInstance.get("/v1/sections"),
        axiosInstance.get("/v1/subjects"),
      ]);

      if (classRes.data.success) setClasses(classRes.data.data);
      if (subjectRes.data.success) setSubjects(subjectRes.data.data);
      
      if (sectionRes.data.success) {
        setSections(sectionRes.data.data);
        processMappings(sectionRes.data.data, classRes.data.data);
      }

    } catch (err) {
      console.error("Error fetching data:", err);
      toast.error("Failed to load data");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  const processMappings = (allSections, allClasses) => {
    // Group sections by Class
    const grouped = allClasses.map(cls => {
        // Fix: use class_id instead of classId (backend uses underscore)
        const clsSections = allSections.filter(s => 
            (s.class_id?._id === cls._id || s.class_id === cls._id) || 
            (s.classId?._id === cls._id || s.classId === cls._id)
        );
        
        const allSubIds = new Set();
        clsSections.forEach(s => {
            if(s.subjects) s.subjects.forEach(sub => allSubIds.add(sub._id || sub));
        });

        // Also check if the class itself has subjects (for classes without sections)
        if (cls.subjects) {
            cls.subjects.forEach(sub => allSubIds.add(sub._id || sub));
        }

        return {
            class: cls,
            sections: clsSections,
            subjectCount: allSubIds.size,
            sectionCount: clsSections.length,
            hasConfig: allSubIds.size > 0
        };
    }); 
    
    setMappings(grouped);
  };

  // Handlers
  const toggleSection = (sectionId) => {
    setFormData((prev) => ({
      ...prev,
      sectionIds: prev.sectionIds.includes(sectionId)
        ? prev.sectionIds.filter((id) => id !== sectionId)
        : [...prev.sectionIds, sectionId],
    }));
  };

  const toggleSubject = (subjectId) => {
    setFormData((prev) => ({
      ...prev,
      subjectIds: prev.subjectIds.includes(subjectId)
        ? prev.subjectIds.filter((id) => id !== subjectId)
        : [...prev.subjectIds, subjectId],
    }));
  };

  const handleClassChange = (e) => {
      const clsId = e.target.value;
      const clsMapping = mappings.find(m => m.class._id === clsId);
      
      setFormData({
          classId: clsId,
          sectionIds: clsMapping ? clsMapping.sections.map(s => s._id) : [], // Select all segments of this class by default
          subjectIds: []
      });
  };

  const handleAction = async () => {
    if (!formData.classId) {
        toast.error("Please select a class");
        return;
    }
    
    // Allow assignment if no sections exist, provided sectionIds is empty
    // But if sections exist, user MIGHT want to select some or all.
    // The requirement says "even if there is no section, the class can be assigned"

    try {
        setLoading(true);
        const response = await axiosInstance.post("/v1/class-assign", {
            classId: formData.classId,
            sectionIds: formData.sectionIds,
            subjectIds: formData.subjectIds
        });

        if (response.data.success) {
            toast.success(response.data.message || "Subjects assigned successfully");
            fetchData();
            setIsModalOpen(false);
            resetForm();
        }
    } catch (err) {
        console.error("Assignment error:", err);
        toast.error(err.response?.data?.message || "Failed to assign subjects");
    } finally {
        setLoading(false);
    }
  };

  const openEditModal = (mapping) => {
    const clsId = mapping.class._id;
    
    // Get subjects from class or sections
    const existingSubjectIds = new Set();
    if (mapping.class.subjects) {
        mapping.class.subjects.forEach(s => existingSubjectIds.add(s._id || s));
    }
    mapping.sections.forEach(sec => {
        if (sec.subjects) {
            sec.subjects.forEach(s => existingSubjectIds.add(s._id || s));
        }
    });

    setFormData({
        classId: clsId,
        sectionIds: mapping.sections.map(s => s._id),
        subjectIds: Array.from(existingSubjectIds)
    });
    
    setIsModalOpen(true);
  };

  const handleDelete = async (mapping) => {
    if (!window.confirm(`Are you sure you want to clear all subject assignments for ${mapping.class.name}?`)) return;

    try {
      setLoading(true);
      const sectionIds = mapping.sections.map(s => s._id);
      
      const response = await axiosInstance.post("/v1/class-assign", {
          classId: mapping.class._id,
          sectionIds: sectionIds,
          subjectIds: [] // Empty array to clear assignments
      });

      if (response.data.success) {
          toast.success("Assignments cleared successfully");
          fetchData();
      }
    } catch (err) {
      console.error("Delete error:", err);
      toast.error("Failed to clear assignments");
    } finally {
      setLoading(false);
    }
  };

  const resetForm = () => {
    setFormData({
      classId: "",
      sectionIds: [],
      subjectIds: [],
    });
  };

  // Filter for Modal
  const modalSections = sections.filter(s => 
    s.class_id?._id === formData.classId || s.class_id === formData.classId ||
    s.classId?._id === formData.classId || s.classId === formData.classId
  );

  const filteredMappings = mappings.filter(m => 
      m.class.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="space-y-10 animate-in fade-in duration-500 p-6 md:p-10">
      {/* Header */}

      <div className="bg-white rounded-[20px] border-2 border-slate-200 p-6 flex flex-col md:flex-row justify-between items-center gap-6 shadow-sm">
        <div>
          <h1 className="text-2xl md:text-3xl font-black text-slate-800 flex items-center gap-3">
            <School className="w-8 h-8 text-[#00bd7f]" />
            Class Setup
          </h1>
          <p className="text-slate-500 font-bold mt-1">
            Assign subjects to classes and sections
          </p>
        </div>

        <div className="flex gap-3 w-full md:w-auto">
          <button
            onClick={() => { resetForm(); setIsModalOpen(true); }}
            className="flex-1 md:flex-none px-6 py-3 bg-[#00bd7f] text-white rounded-2xl font-black shadow-xl shadow-emerald-200 hover:scale-[1.02] active:scale-95 transition-all flex items-center justify-center gap-2"
          >
            <Plus className="w-5 h-5" />
            New Assignment
          </button>
        </div>
      </div>

      {/* Toolbar */}
      <div className="flex flex-col lg:flex-row gap-6">
        <div className="flex-1 bg-white rounded-[2.5rem] border-2 border-slate-100 p-3 flex items-center shadow-sm">
          <div className="px-5 text-slate-400">
            <Search className="w-5 h-5" />
          </div>
          <input
            placeholder="Search Class..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="flex-1 bg-transparent border-none outline-none text-sm font-bold text-slate-800 placeholder:text-slate-300"
          />
        </div>
      </div>

      {/* Mapping Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {loading ? (
             <div className="col-span-2 text-center py-20 text-slate-400 font-bold">Loading...</div>
        ) : filteredMappings.map((mapping) => (
          <div
            key={mapping.class._id}
            className="group bg-white rounded-[3rem] border-2 border-slate-100 shadow-xl shadow-slate-100/20 hover:border-[#00bd7e8f] transition-all duration-300 overflow-hidden flex flex-col relative"
          >
            {/* Action Bar */}
            <div className="absolute top-6 right-6 flex gap-2 translate-y-3 opacity-0 group-hover:translate-y-0 group-hover:opacity-100 transition-all">
              <button
                onClick={() => openEditModal(mapping)}
                className="p-3 bg-white border-2 border-slate-100 text-slate-400 hover:text-indigo-600 hover:border-indigo-100 rounded-2xl transition-all shadow-lg"
              >
                <Edit3 className="w-4 h-4" />
              </button>
              <button
                onClick={() => handleDelete(mapping)}
                className="p-3 bg-white border-2 border-slate-100 text-slate-400 hover:text-rose-600 hover:border-rose-100 rounded-2xl transition-all shadow-lg"
              >
                <Trash2 className="w-4 h-4" />
              </button>
            </div>

            <div className="p-10 space-y-8">
              <div className="flex items-center gap-5">
                <div className="w-16 h-16 bg-slate-50 rounded-[1.5rem] flex items-center justify-center border-2 border-slate-100 shadow-inner group-hover:border-indigo-100 transition-colors shrink-0">
                  <Layers className="w-8 h-8 text-[#00bd7f]" />
                </div>
                <div>
                  <h2 className="text-2xl font-black text-slate-800 group-hover:text-[#00bd7f] transition-colors uppercase tracking-tight">
                    {mapping.class.name}
                  </h2>
                  <div className="flex items-center gap-2 mt-2">
                    <div className={`w-1.5 h-1.5 rounded-full ${mapping.hasConfig ? 'bg-emerald-500 animate-pulse' : 'bg-amber-500'}`} />
                    <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest">
                      {mapping.hasConfig ? 'Configured' : 'Needs Setup'}
                    </span>
                  </div>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                {/* Sections */}
                <div className="space-y-4">
                  <div className="flex items-center gap-2 text-[10px] font-black text-slate-400 uppercase tracking-widest pb-2 border-b-2 border-slate-50">
                    <Hash className="w-3.5 h-3.5" /> Sections
                  </div>
                  <div className="flex flex-wrap gap-2 pt-1">
                    {mapping.sections.length > 0 ? mapping.sections.map((sec) => (
                      <span
                        key={sec._id}
                        className="px-4 py-2 bg-indigo-50 text-indigo-600 rounded-xl text-[10px] font-black border border-indigo-100/50 shadow-sm"
                      >
                        {sec.name}
                      </span>
                    )) : (
                        <span className="text-[10px] font-black text-slate-300 uppercase italic">No Sections</span>
                    )}
                  </div>
                </div>

                {/* Subjects Preview */}
                <div className="space-y-4">
                  <div className="flex items-center gap-2 text-[10px] font-black text-slate-400 uppercase tracking-widest pb-2 border-b-2 border-slate-50">
                    <BookOpen className="w-3.5 h-3.5" /> Subjects ({mapping.subjectCount})
                  </div>
                  <div className="flex flex-wrap gap-2 pt-1">
                     {/* Try to get subjects from class first, then sections */}
                     {(mapping.class.subjects || mapping.sections[0]?.subjects)?.slice(0, 3).map((sub, idx) => (
                         <span key={idx} className="px-3 py-1 bg-amber-50 text-amber-600 rounded-lg text-[10px] font-bold">
                             {sub.name || "Subject"}
                         </span>
                     ))}
                     {mapping.subjectCount > 3 && (
                         <span className="px-3 py-1 bg-slate-50 text-slate-400 rounded-lg text-[10px] font-bold">
                             +{mapping.subjectCount - 3} more
                         </span>
                     )}
                     {mapping.subjectCount === 0 && (
                        <span className="text-xs font-bold text-slate-300 italic">No subjects</span>
                     )}
                  </div>
                </div>
              </div>
            </div>

            <div className="mt-auto px-10 py-6 bg-slate-50/50 flex items-center justify-between border-t-2 border-slate-50">
              <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">
                Total Units:{" "}
                <span className="text-slate-800">
                  {mapping.sectionCount} Sections, {mapping.subjectCount} Subjects
                </span>
              </p>
            </div>
          </div>
        ))}
      </div>

      {/* Add/Edit Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 bg-slate-900/70 backdrop-blur-md z-[100] flex items-center justify-center p-6 lg:p-10">
          <div className="bg-white rounded-[20px] w-full max-w-4xl shadow-2xl animate-in scale-in duration-300 overflow-hidden flex flex-col max-h-[90vh]">
            <div className="p-10 border-b-2 border-slate-50 flex items-center justify-between shrink-0">
              <div className="flex items-center gap-5">
                <div className="w-14 h-14 bg-indigo-50 text-indigo-600 rounded-2xl flex items-center justify-center border-2 border-indigo-100/50 shadow-inner">
                  <Settings2 className="w-8 h-8" />
                </div>
                <div>
                  <h2 className="text-2xl font-black text-slate-800 tracking-tight">
                    Class Setup
                  </h2>
                  <p className="text-xs font-bold text-slate-400">Map sections and subjects</p>
                </div>
              </div>
              <button
                onClick={() => setIsModalOpen(false)}
                className="p-4 bg-slate-50 hover:bg-slate-100 text-slate-400 rounded-2xl transition-all"
              >
                <X className="w-6 h-6" />
              </button>
            </div>

            <div className="p-10 space-y-10 overflow-y-auto custom-scrollbar">
              <div className="grid grid-cols-1 lg:grid-cols-3 gap-10">
                {/* Step 1: Selection */}
                <div className="space-y-6">
                  <div className="flex items-center gap-3">
                    <div className="w-8 h-8 bg-slate-900 text-white rounded-full flex items-center justify-center text-[10px] font-black">
                      01
                    </div>
                    <h3 className="text-sm font-black text-slate-800 uppercase tracking-widest">
                      Select Class
                    </h3>
                  </div>
                  <div className="space-y-4">
                    <div className="space-y-2">
                      <select
                        value={formData.classId}
                        onChange={handleClassChange}
                        className="w-full bg-slate-50 border-2 border-slate-100 rounded-2xl px-6 py-4 text-sm font-bold focus:border-indigo-500 outline-none transition-all appearance-none cursor-pointer"
                      >
                        <option value="">-- Choose Class --</option>
                        {classes.map((c) => (
                          <option key={c._id} value={c._id}>{c.name}</option>
                        ))}
                      </select>
                    </div>
                  </div>
                </div>

                {/* Step 2: Sections */}
                <div className="space-y-6">
                  <div className="flex items-center gap-3">
                    <div className="w-8 h-8 bg-slate-900 text-white rounded-full flex items-center justify-center text-[10px] font-black">
                      02
                    </div>
                    <h3 className="text-sm font-black text-slate-800 uppercase tracking-widest">
                      Target Sections
                    </h3>
                  </div>
                  <div className="flex flex-col gap-3 max-h-[300px] overflow-y-auto pr-2">
                    {formData.classId ? (
                        modalSections.length > 0 ? (
                            modalSections.map((sec) => (
                              <button
                                key={sec._id}
                                onClick={() => toggleSection(sec._id)}
                                className={`py-3 px-4 rounded-xl text-[10px] font-black uppercase tracking-widest border-2 transition-all flex items-center justify-between ${
                                  formData.sectionIds.includes(sec._id)
                                    ? "bg-indigo-50 border-indigo-500 text-indigo-600"
                                    : "bg-white border-slate-100 text-slate-400 hover:border-slate-200"
                                }`}
                              >
                                {sec.name}
                                {formData.sectionIds.includes(sec._id) ? (
                                  <CheckCircle2 className="w-4 h-4" />
                                ) : (
                                  <Plus className="w-4 h-4" />
                                )}
                              </button>
                            ))
                        ) : (
                            <div className="p-4 bg-emerald-50 rounded-2xl border-2 border-emerald-100 text-center">
                                <p className="text-[10px] font-black text-emerald-600 uppercase tracking-widest">No Sections Needed</p>
                                <p className="text-[8px] font-bold text-emerald-400 mt-1">Assign directly to class</p>
                            </div>
                        )
                    ) : (
                        <p className="text-xs text-slate-400 font-bold italic">Select a class first</p>
                    )}
                  </div>
                </div>

                {/* Step 3: Subjects */}
                <div className="space-y-6">
                  <div className="flex items-center gap-3">
                    <div className="w-8 h-8 bg-slate-900 text-white rounded-full flex items-center justify-center text-[10px] font-black">
                      03
                    </div>
                    <h3 className="text-sm font-black text-slate-800 uppercase tracking-widest">
                      Assign Subjects
                    </h3>
                  </div>
                  <div className="space-y-3 max-h-[300px] overflow-y-auto pr-2 custom-scrollbar">
                    {subjects.map((sub) => (
                      <button
                        key={sub._id}
                        onClick={() => toggleSubject(sub._id)}
                        className={`w-full py-4 px-5 rounded-2xl text-xs font-black border-2 transition-all flex items-center justify-between ${
                          formData.subjectIds.includes(sub._id)
                            ? "bg-amber-50 border-amber-400 text-amber-600 shadow-sm"
                            : "bg-slate-50 border-slate-50 text-slate-400 hover:border-slate-200 hover:bg-white"
                        }`}
                      >
                        <div className="flex items-center gap-3 text-left">
                          <BookOpen
                            className={`w-4 h-4 ${formData.subjectIds.includes(sub._id) ? "text-amber-500" : "text-slate-300"}`}
                          />
                          <div>
                              <p>{sub.name}</p>
                              <p className="text-[9px] opacity-50">{sub.code}</p>
                          </div>
                        </div>
                        {formData.subjectIds.includes(sub._id) && (
                          <CheckCircle2 className="w-4 h-4" />
                        )}
                      </button>
                    ))}
                  </div>
                </div>
              </div>

              <div className="flex gap-6 pt-6 border-t border-slate-50">
                <button
                  onClick={() => setIsModalOpen(false)}
                  className="flex-1 py-5 text-slate-400 font-black text-sm uppercase tracking-widest hover:bg-slate-50 rounded-2xl transition-all"
                >
                  Cancel
                </button>
                <button
                  onClick={handleAction}
                  disabled={loading}
                  className="flex-[2] py-5 bg-[#00bd7f] text-white rounded-2xl font-black shadow-xl shadow-emerald-200 hover:scale-[1.02] active:scale-95 transition-all flex items-center justify-center gap-3 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  <Save className="w-5 h-5" />
                  {loading ? "Saving..." : "Save Assignment"}
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default ClassAssign;
