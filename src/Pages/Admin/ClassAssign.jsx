import { useState } from "react";
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
} from "lucide-react";

const ClassAssign = () => {
  const [searchTerm, setSearchTerm] = useState("");

  // Modal States
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [modalType, setModalType] = useState("add"); // "add" | "edit"
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);

  // Focus States
  const [selectedMapping, setSelectedMapping] = useState(null);

  // Form States
  const [formData, setFormData] = useState({
    className: "Class 5",
    sections: ["Section A"],
    subjects: ["Arabic Grammar (Sarf)"],
    status: "active",
  });

  // Sample Data
  const [classMappings, setClassMappings] = useState([
    {
      id: 1,
      className: "Class 5",
      sections: ["Section A", "Section B"],
      subjects: ["Arabic Grammar", "Hadith Studies", "Mathematics"],
      status: "active",
    },
    {
      id: 2,
      className: "Class 6",
      sections: ["Section A"],
      subjects: ["Arabic Literature", "Fiqh", "English Foundation"],
      status: "active",
    },
    {
      id: 3,
      className: "Hifz Class",
      sections: ["Morning", "Evening"],
      subjects: ["Quran Memorization"],
      status: "active",
    },
  ]);

  const availableClasses = [
    "Class 5",
    "Class 6",
    "Class 7",
    "Hifz Class",
    "Kitab Class",
  ];
  const availableSections = ["Section A", "Section B", "Morning", "Evening"];
  const availableSubjects = [
    "Arabic Grammar",
    "Arabic Literature",
    "Fiqh",
    "Hadith Studies",
    "Quran Memorization",
    "Mathematics",
    "English Foundation",
    "Science",
  ];

  // Handlers
  const toggleSection = (section) => {
    setFormData((prev) => ({
      ...prev,
      sections: prev.sections.includes(section)
        ? prev.sections.filter((s) => s !== section)
        : [...prev.sections, section],
    }));
  };

  const toggleSubject = (subject) => {
    setFormData((prev) => ({
      ...prev,
      subjects: prev.subjects.includes(subject)
        ? prev.subjects.filter((s) => s !== subject)
        : [...prev.subjects, subject],
    }));
  };

  const handleAction = () => {
    if (modalType === "add") {
      const newMapping = {
        id: Date.now(),
        ...formData,
      };
      setClassMappings([...classMappings, newMapping]);
    } else {
      setClassMappings(
        classMappings.map((m) =>
          m.id === selectedMapping.id ? { ...m, ...formData } : m,
        ),
      );
    }
    setIsModalOpen(false);
    resetForm();
  };

  const handleDelete = () => {
    setClassMappings(classMappings.filter((m) => m.id !== selectedMapping.id));
    setIsDeleteModalOpen(false);
    setSelectedMapping(null);
  };

  const openAddModal = () => {
    resetForm();
    setModalType("add");
    setIsModalOpen(true);
  };

  const openEditModal = (mapping) => {
    setSelectedMapping(mapping);
    setFormData({
      className: mapping.className,
      sections: mapping.sections,
      subjects: mapping.subjects,
      status: mapping.status,
    });
    setModalType("edit");
    setIsModalOpen(true);
  };

  const openDeleteModal = (mapping) => {
    setSelectedMapping(mapping);
    setIsDeleteModalOpen(true);
  };

  const resetForm = () => {
    setFormData({
      className: "Class 5",
      sections: [],
      subjects: [],
      status: "active",
    });
    setSelectedMapping(null);
  };

  const filteredMappings = classMappings.filter((m) =>
    m.className.toLowerCase().includes(searchTerm.toLowerCase()),
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
            Manage academic structure and grade levels
          </p>
        </div>

        <div className="flex gap-3 w-full md:w-auto">
          <button
            onClick={openAddModal}
            className="flex-1 md:flex-none px-6 py-3 bg-[#00bd7f] text-white rounded-2xl font-black shadow-xl shadow-emerald-200 hover:scale-[1.02] active:scale-95 transition-all flex items-center justify-center gap-2"
          >
            <Plus className="w-5 h-5" />
            Class Setup
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
            placeholder="Quick search by Class Name..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="flex-1 bg-transparent border-none outline-none text-sm font-bold text-slate-800 placeholder:text-slate-300"
          />
          <div className="h-10 w-px bg-slate-100 mx-2 hidden lg:block" />
          <button className="px-6 py-3 text-slate-400 hover:text-indigo-600 transition-colors hidden lg:flex items-center gap-2 font-black text-[10px] uppercase tracking-widest">
            <Filter className="w-4 h-4" /> Comprehensive Filter
          </button>
        </div>
      </div>

      {/* Mapping Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {filteredMappings.map((mapping) => (
          <div
            key={mapping.id}
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
                onClick={() => openDeleteModal(mapping)}
                className="p-3 bg-white border-2 border-slate-100 text-slate-400 hover:text-rose-600 hover:border-[#00bd7f] rounded-2xl transition-all shadow-lg"
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
                    {mapping.className}
                  </h2>
                  <div className="flex items-center gap-2 mt-2">
                    <div className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
                    <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest">
                      Active
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
                    {mapping.sections.map((sec) => (
                      <span
                        key={sec}
                        className="px-4 py-2 bg-indigo-50 text-indigo-600 rounded-xl text-[10px] font-black border border-indigo-100/50 shadow-sm"
                      >
                        {sec}
                      </span>
                    ))}
                    {mapping.sections.length === 0 && (
                      <span className="text-xs font-bold text-slate-300 italic">
                        No sections mapped
                      </span>
                    )}
                  </div>
                </div>

                {/* Subjects */}
                <div className="space-y-4">
                  <div className="flex items-center gap-2 text-[10px] font-black text-slate-400 uppercase tracking-widest pb-2 border-b-2 border-slate-50">
                    <BookOpen className="w-3.5 h-3.5" /> Subjects
                  </div>
                  <div className="flex flex-wrap gap-2 pt-1">
                    {mapping.subjects.map((sub) => (
                      <span
                        key={sub}
                        className="px-4 py-2 bg-amber-50 text-amber-600 rounded-xl text-[10px] font-black border border-amber-100/50 shadow-sm"
                      >
                        {sub}
                      </span>
                    ))}
                    {mapping.subjects.length === 0 && (
                      <span className="text-xs font-bold text-slate-300 italic">
                        No subjects allocated
                      </span>
                    )}
                  </div>
                </div>
              </div>
            </div>

            <div className="mt-auto px-10 py-6 bg-slate-50/50 flex items-center justify-between border-t-2 border-slate-50">
              <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">
                Total Assets:{" "}
                <span className="text-slate-800">
                  {mapping.sections.length + mapping.subjects.length} Units
                </span>
              </p>
              {/* <div
                onClick={() => openDeleteModal(mapping)}
                className="flex items-center gap-2 text-indigo-500 group-hover:translate-x-1 transition-transform"
              >
                <span className="text-xs font-black uppercase tracking-tighter">
                  uPDATE CLASS
                </span>
                <ChevronRight className="w-4 h-4" />
              </div> */}
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
                    {modalType === "add"
                      ? " Class Setup "
                      : "Update Class Setup"}
                  </h2>
                </div>
              </div>
              <button
                onClick={() => setIsModalOpen(false)}
                className="p-4 bg-slate-50 hover:bg-slate-100 text-slate-400 rounded-2xl transition-all"
              >
                <X className="w-6 h-6" />
              </button>
            </div>

            <div className="p-10 space-y-10 overflow-y-auto">
              <div className="grid grid-cols-1 lg:grid-cols-3 gap-10">
                {/* Step 1: Selection */}
                <div className="space-y-6">
                  <div className="flex items-center gap-3">
                    <div className="w-8 h-8 bg-slate-900 text-white rounded-full flex items-center justify-center text-[10px] font-black">
                      01
                    </div>
                    <h3 className="text-sm font-black text-slate-800 uppercase tracking-widest">
                      Primary Identity
                    </h3>
                  </div>
                  <div className="space-y-4">
                    <div className="space-y-2">
                      <label className="text-[10px] font-black text-slate-400 uppercase">
                        Target Institutional Class
                      </label>
                      <select
                        value={formData.className}
                        onChange={(e) =>
                          setFormData({
                            ...formData,
                            className: e.target.value,
                          })
                        }
                        className="w-full bg-slate-50 border-2 border-slate-100 rounded-2xl px-6 py-4 text-sm font-bold focus:border-indigo-500 outline-none transition-all appearance-none cursor-pointer"
                      >
                        {availableClasses.map((c) => (
                          <option key={c}>{c}</option>
                        ))}
                      </select>
                    </div>
                    <div className="space-y-2">
                      <label className="text-[10px] font-black text-slate-400 uppercase">
                        Operational Status
                      </label>
                      <div className="grid grid-cols-2 gap-3">
                        <button
                          onClick={() =>
                            setFormData({ ...formData, status: "active" })
                          }
                          className={`py-3 rounded-xl text-[10px] font-black uppercase tracking-widest border-2 transition-all ${
                            formData.status === "active"
                              ? "bg-emerald-50 border-emerald-500 text-emerald-600"
                              : "bg-slate-50 border-slate-100 text-slate-400"
                          }`}
                        >
                          Active
                        </button>
                        <button
                          onClick={() =>
                            setFormData({ ...formData, status: "inactive" })
                          }
                          className={`py-3 rounded-xl text-[10px] font-black uppercase tracking-widest border-2 transition-all ${
                            formData.status === "inactive"
                              ? "bg-rose-50 border-rose-500 text-rose-600"
                              : "bg-slate-50 border-slate-100 text-slate-400"
                          }`}
                        >
                          Inactive
                        </button>
                      </div>
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
                      Section Mapping
                    </h3>
                  </div>
                  <div className="grid grid-cols-2 gap-3">
                    {availableSections.map((sec) => (
                      <button
                        key={sec}
                        onClick={() => toggleSection(sec)}
                        className={`py-3 px-2 rounded-xl text-[10px] font-black uppercase tracking-widest border-2 transition-all flex items-center justify-between ${
                          formData.sections.includes(sec)
                            ? "bg-indigo-50 border-indigo-500 text-indigo-600"
                            : "bg-white border-slate-50 text-slate-300 hover:border-slate-200"
                        }`}
                      >
                        {sec}
                        {formData.sections.includes(sec) ? (
                          <CheckCircle2 className="w-3 h-3" />
                        ) : (
                          <Plus className="w-3 h-3" />
                        )}
                      </button>
                    ))}
                  </div>
                </div>

                {/* Step 3: Subjects */}
                <div className="space-y-6">
                  <div className="flex items-center gap-3">
                    <div className="w-8 h-8 bg-slate-900 text-white rounded-full flex items-center justify-center text-[10px] font-black">
                      03
                    </div>
                    <h3 className="text-sm font-black text-slate-800 uppercase tracking-widest">
                      Subject Allocation
                    </h3>
                  </div>
                  <div className="space-y-3 max-h-[250px] overflow-y-auto pr-2 custom-scrollbar">
                    {availableSubjects.map((sub) => (
                      <button
                        key={sub}
                        onClick={() => toggleSubject(sub)}
                        className={`w-full py-4 px-5 rounded-2xl text-xs font-black border-2 transition-all flex items-center justify-between ${
                          formData.subjects.includes(sub)
                            ? "bg-amber-50 border-amber-400 text-amber-600 shadow-sm"
                            : "bg-slate-50 border-slate-50 text-slate-400 hover:border-slate-200 hover:bg-white"
                        }`}
                      >
                        <div className="flex items-center gap-3 text-left">
                          <BookOpen
                            className={`w-4 h-4 ${formData.subjects.includes(sub) ? "text-amber-500" : "text-slate-300"}`}
                          />
                          {sub}
                        </div>
                        {formData.subjects.includes(sub) && (
                          <CheckCircle2 className="w-4 h-4" />
                        )}
                      </button>
                    ))}
                  </div>
                </div>
              </div>

              <div className="flex gap-6  pt-6">
                <button
                  onClick={() => setIsModalOpen(false)}
                  className="flex-1 py-5 text-slate-400 font-black text-sm uppercase tracking-widest hover:bg-slate-50 rounded-2xl transition-all"
                >
                  Cancel
                </button>
                <button
                  onClick={handleAction}
                  className="flex-[2] py-5 bg-[#00bd7f] text-white rounded-2xl font-black shadow-xl shadow-emerald-200 hover:scale-[1.02] active:scale-95  transition-all flex items-center justify-center gap-3"
                >
                  <ShieldCheck className="w-5 h-5" />{" "}
                  {modalType === "add" ? "Class Setup" : "Update Class Setup"}
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Delete Confirmation */}
      {isDeleteModalOpen && (
        <div className="fixed inset-0 bg-slate-900/70 backdrop-blur-md z-[100] flex items-center justify-center p-6">
          <div className="bg-white rounded-[3rem] w-full max-w-md shadow-2xl animate-in fade-in zoom-in duration-300 overflow-hidden">
            <div className="p-10 text-center space-y-8">
              <div className="w-24 h-24 bg-rose-50 text-rose-500 rounded-[2.5rem] flex items-center justify-center mx-auto border-4 border-white shadow-2xl shadow-rose-100 relative">
                <AlertCircle className="w-10 h-10" />
              </div>
              <div className="space-y-3">
                <h2 className="text-3xl font-black text-slate-800 tracking-tight">
                  Are You Sure?
                </h2>
                <p className="text-sm font-bold text-slate-400 px-6 leading-relaxed">
                  This will unbind all sections and subjects from{" "}
                  <span className="text-slate-800 font-black">
                    {selectedMapping?.className}
                  </span>
                  .
                </p>
              </div>

              <div className="flex  gap-4">
                <button
                  onClick={() => setIsDeleteModalOpen(false)}
                  className="w-full py-5 font-black text-slate-400 hover:bg-slate-50 rounded-2xl transition-all uppercase tracking-widest text-xs"
                >
                  Cancel
                </button>
                <button
                  onClick={handleDelete}
                  className="w-full py-5 bg-rose-500 text-white font-black rounded-2xl shadow-xl shadow-rose-200 hover:bg-rose-600 active:scale-95 transition-all uppercase tracking-widest text-xs"
                >
                  Delete
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
