import { useState, useRef, useEffect } from "react";
import {
  Plus,
  Search,
  UserPlus,
  Users,
  School,
  Edit3,
  Trash2,
  UserCheck,
  Mail,
  Phone,
  ArrowRight,
  MoreHorizontal,
  X,
  AlertCircle,
  ExternalLink,
  ShieldCheck,
  CheckCircle2,
  Filter,
} from "lucide-react";

const AssignTeacher = () => {
  const [searchTerm, setSearchTerm] = useState("");

  // Modal States
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [modalType, setModalType] = useState("add"); // "add" | "edit"
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);

  // Menu State
  const [activeMenuId, setActiveMenuId] = useState(null);
  const menuRef = useRef(null);

  // Focus States
  const [selectedAssignment, setSelectedAssignment] = useState(null);

  // Form States
  const [formData, setFormData] = useState({
    className: "Class 5",
    section: "Section A",
    teacherName: "মাওলানা আব্দুল করিম",
    email: "",
    phone: "",
    experience: "5 Years",
  });

  // Sample Data: Teacher Assignments
  const [assignments, setAssignments] = useState([
    {
      id: 1,
      className: "Class 5",
      section: "Section A",
      teacherName: "মাওলানা আব্দুল করিম",
      email: "karim@mms.edu",
      phone: "01712345678",
      photo: "https://api.dicebear.com/7.x/avataaars/svg?seed=EMP1",
      experience: "12 Years",
    },
    {
      id: 2,
      className: "Class 6",
      section: "Section B",
      teacherName: "হাফেজ মোহাম্মদ আলী",
      email: "ali@mms.edu",
      phone: "01823456789",
      photo: "https://api.dicebear.com/7.x/avataaars/svg?seed=EMP2",
      experience: "8 Years",
    },
    {
      id: 3,
      className: "Hifz Class",
      section: "Evening",
      teacherName: "মাওলানা ইউসুফ আলী",
      email: "yusuf@mms.edu",
      phone: "01934567890",
      photo: "https://api.dicebear.com/7.x/avataaars/svg?seed=EMP3",
      experience: "15 Years",
    },
  ]);

  // Click Outside for menu
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (menuRef.current && !menuRef.current.contains(event.target)) {
        setActiveMenuId(null);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  // Handlers
  const openAddModal = () => {
    resetForm();
    setModalType("add");
    setIsModalOpen(true);
  };

  const openEditModal = (as) => {
    setSelectedAssignment(as);
    setFormData({
      className: as.className,
      section: as.section,
      teacherName: as.teacherName,
      email: as.email,
      phone: as.phone,
      experience: as.experience,
    });
    setModalType("edit");
    setIsModalOpen(true);
    setActiveMenuId(null);
  };

  const openDeleteModal = (as) => {
    setSelectedAssignment(as);
    setIsDeleteModalOpen(true);
    setActiveMenuId(null);
  };

  const handleAction = () => {
    if (modalType === "add") {
      const newAs = {
        id: Date.now(),
        ...formData,
        photo: `https://api.dicebear.com/7.x/avataaars/svg?seed=${Date.now()}`,
      };
      setAssignments([...assignments, newAs]);
    } else {
      setAssignments(
        assignments.map((a) =>
          a.id === selectedAssignment.id ? { ...a, ...formData } : a,
        ),
      );
    }
    setIsModalOpen(false);
    resetForm();
  };

  const handleDelete = () => {
    setAssignments(assignments.filter((a) => a.id !== selectedAssignment.id));
    setIsDeleteModalOpen(false);
    setSelectedAssignment(null);
  };

  const resetForm = () => {
    setFormData({
      className: "Class 5",
      section: "Section A",
      teacherName: "মাওলানা আব্দুল করিম",
      email: "",
      phone: "",
      experience: "5 Years",
    });
    setSelectedAssignment(null);
  };

  const filteredAssignments = assignments.filter(
    (as) =>
      as.teacherName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      as.className.toLowerCase().includes(searchTerm.toLowerCase()),
  );

  return (
    <div className="space-y-8 animate-in fade-in duration-500 p-4 md:p-8">
      {/* Header */}
      <div className="bg-white rounded-[2.5rem] border-2 border-slate-200 p-8 flex flex-col md:flex-row justify-between items-center gap-6 shadow-sm">
        <div className="flex items-center gap-6">
          <div className="w-16 h-16 bg-[#00bd7f] text-white rounded-2xl flex items-center justify-center border-2 border-blue-100">
            <UserCheck className="w-8 h-8 text-white" />
          </div>
          <div>
            <h1 className="text-2xl md:text-3xl font-black text-slate-800">
              Assign Class Teacher
            </h1>
            <p className="text-slate-500 font-bold mt-1">
              Map teachers to lead specific classes/sections
            </p>
          </div>
        </div>

        <button
          onClick={openAddModal}
          className="w-full md:w-auto px-8 py-4 bg-[#00bd7f] text-white rounded-2xl font-blackshadow-lg shadow-emerald-500/30 hover:shadow-xl hover:shadow-emerald-500/40 hover:scale-[1.02]  active:scale-95 transition-all flex items-center justify-center gap-3 cursor-pointer"
        >
          <UserPlus className="w-5 h-5" />
          New Assignment
        </button>
      </div>

      {/* Search & Tool Area */}
      <div className="flex flex-col md:flex-row gap-6">
        <div className="flex-1 bg-white rounded-3xl border-2 border-slate-200 p-2 flex items-center shadow-sm">
          <div className="flex-1 px-6">
            <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest block mb-1">
              Live Database Search
            </label>
            <div className="relative">
              <Search className="absolute left-0 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-300" />
              <input
                placeholder="Search by teacher name, class or section..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-6 pr-4 py-2 text-sm font-bold text-slate-800 outline-none placeholder:text-slate-300 bg-transparent"
              />
            </div>
          </div>
          <div className="h-12 w-px bg-slate-100 hidden md:block" />
          <button className="px-6 py-4 text-slate-400 hover:text-blue-600 transition-colors hidden md:flex items-center gap-2 font-black text-xs uppercase tracking-widest border-l-2 border-slate-50">
            <Filter className="w-4 h-4" /> Filter
          </button>
        </div>

        <div className="bg-gradient-to-br from-indigo-600 to-blue-700 rounded-3xl p-6 text-white shadow-xl shadow-blue-100 min-w-[240px] flex flex-col justify-center">
          <p className="text-[10px] font-black uppercase opacity-60 tracking-widest">
            Global Capacity
          </p>
          <div className="flex items-center justify-between mt-2">
            <p className="text-3xl font-black tracking-tighter">
              {assignments.length}
            </p>
            <div className="px-3 py-1 bg-white/10 rounded-full text-[10px] font-black uppercase tracking-widest border border-white/20">
              Live Feed
            </div>
          </div>
        </div>
      </div>

      {/* Assignment Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-8">
        {filteredAssignments.map((as) => (
          <div
            key={as.id}
            className="group bg-white rounded-[2.5rem] border-2 border-slate-100 shadow-sm hover:shadow-xl hover:border-blue-500/20 transition-all duration-300 overflow-hidden flex flex-col relative"
          >
            <div className="p-8 space-y-6">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-1.5 text-[10px] font-black text-blue-600 uppercase tracking-widest border-2 border-blue-50 bg-blue-50/50 px-3 py-1 rounded-full">
                  <School className="w-3.5 h-3.5" />
                  {as.className} • {as.section}
                </div>

                <div
                  className="relative"
                  ref={activeMenuId === as.id ? menuRef : null}
                >
                  <button
                    onClick={() =>
                      setActiveMenuId(activeMenuId === as.id ? null : as.id)
                    }
                    className={`p-2 rounded-xl transition-all ${activeMenuId === as.id ? "bg-slate-100 text-slate-900" : "text-slate-300 hover:text-slate-600 hover:bg-slate-50"}`}
                  >
                    <MoreHorizontal className="w-5 h-5" />
                  </button>

                  {activeMenuId === as.id && (
                    <div className="absolute right-0 mt-2 w-48 bg-white border-2 border-slate-100 rounded-2xl shadow-2xl z-50 overflow-hidden animate-in fade-in slide-in-from-top-2 duration-200">
                      <button
                        onClick={() => openEditModal(as)}
                        className="w-full px-5 py-4 text-left text-xs font-black text-slate-600 hover:bg-blue-50 hover:text-blue-600 flex items-center gap-3 transition-colors"
                      >
                        <Edit3 className="w-4 h-4" /> Edit Assignment
                      </button>
                      <button className="w-full px-5 py-4 text-left text-xs font-black text-slate-600 hover:bg-emerald-50 hover:text-emerald-600 flex items-center gap-3 transition-colors border-y-2 border-slate-50">
                        <ExternalLink className="w-4 h-4" /> View Profile
                      </button>
                      <button
                        onClick={() => openDeleteModal(as)}
                        className="w-full px-5 py-4 text-left text-xs font-black text-rose-500 hover:bg-rose-50 flex items-center gap-3 transition-colors"
                      >
                        <Trash2 className="w-4 h-4" /> Remove Lead
                      </button>
                    </div>
                  )}
                </div>
              </div>

              <div className="flex flex-col items-center gap-6 py-4 border-y-2 border-slate-50 border-dashed">
                <div className="w-20 h-20 rounded-3xl overflow-hidden border-4 border-white shadow-xl relative group-hover:scale-105 transition-transform shrink-0 shadow-slate-100">
                  <img src={as.photo} className="w-full h-full object-cover" />
                  <div className="absolute inset-0 bg-blue-600/0 group-hover:bg-blue-600/5 transition-colors" />
                </div>
                <div>
                  <h3 className="text-[18px] font-black text-slate-800 leading-tight">
                    {as.teacherName}
                  </h3>
                  <div className="flex items-center gap-2 mt-2">
                    <span className="px-3 py-1 bg-emerald-50 text-emerald-600 text-[9px] font-black uppercase tracking-widest rounded-full border border-emerald-100">
                      {as.experience} Exp
                    </span>
                    <span className="px-3 py-1 bg-blue-50 text-blue-600 text-[9px] font-black uppercase tracking-widest rounded-full border border-blue-100">
                      Top Rated
                    </span>
                  </div>
                </div>
              </div>

              <div className="space-y-4 pt-2">
                <div className="flex items-center gap-4 text-xs font-bold text-slate-500 group/link">
                  <div className="w-10 h-10 bg-slate-50 rounded-2xl flex items-center justify-center text-slate-400 group-hover/link:bg-blue-50 group-hover/link:text-blue-500 transition-colors">
                    <Mail className="w-4 h-4" />
                  </div>
                  <div className="flex flex-col">
                    <span className="text-[10px] uppercase font-black tracking-widest text-slate-300">
                      Email Contact
                    </span>
                    <span className="group-hover/link:text-slate-800 transition-colors">
                      {as.email || "assign@mms.edu"}
                    </span>
                  </div>
                </div>
                <div className="flex items-center gap-4 text-xs font-bold text-slate-500 group/link">
                  <div className="w-10 h-10 bg-slate-50 rounded-2xl flex items-center justify-center text-slate-400 group-hover/link:bg-emerald-50 group-hover/link:text-emerald-500 transition-colors">
                    <Phone className="w-4 h-4" />
                  </div>
                  <div className="flex flex-col">
                    <span className="text-[10px] uppercase font-black tracking-widest text-slate-300">
                      Secure Phone
                    </span>
                    <span className="group-hover/link:text-slate-800 transition-colors">
                      {as.phone || "+880 1XXX-XXXXXX"}
                    </span>
                  </div>
                </div>
              </div>
            </div>

            <div className="mt-auto px-8 py-6 bg-slate-50/50 flex gap-4 border-t-2 border-slate-50">
              <button
                onClick={() => openEditModal(as)}
                className="flex-1 py-4 bg-white border-2 border-slate-200 text-slate-700 rounded-2xl text-[10px] font-black uppercase tracking-widest hover:border-blue-500/50 hover:text-blue-600 transition-all shadow-sm flex items-center justify-center gap-2"
              >
                <Edit3 className="w-4 h-4" /> Update
              </button>
              <button
                onClick={() => openDeleteModal(as)}
                className="flex-1 py-4 bg-white border-2 border-slate-200 text-rose-500 rounded-2xl text-[10px] font-black uppercase tracking-widest hover:bg-rose-50 hover:border-rose-200 transition-all shadow-sm flex items-center justify-center gap-2"
              >
                <Trash2 className="w-4 h-4" /> Unassign
              </button>
            </div>
          </div>
        ))}

        {/* Create Card */}
        <button
          onClick={openAddModal}
          className="bg-blue-50/10 rounded-[2.5rem] border-4 border-dashed border-blue-100 flex flex-col items-center justify-center p-12 hover:border-blue-400/50 hover:bg-blue-50/40 transition-all group min-h-[350px]"
        >
          <div className="w-20 h-20 bg-white rounded-3xl flex items-center justify-center shadow-xl group-hover:scale-110 transition-transform mb-6 border-2 border-blue-50">
            <Plus className="w-10 h-10 text-blue-200 group-hover:text-blue-600" />
          </div>
          <p className="text-xl font-black text-blue-300 group-hover:text-blue-600 transition-colors">
            Assign New Lead
          </p>
          <p className="text-xs font-bold text-blue-200 group-hover:text-blue-400 mt-2 uppercase tracking-widest">
            Map teacher to class
          </p>
        </button>
      </div>

      {/* Add/Edit Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-sm z-[100] flex items-center justify-center p-4">
          <div className="bg-white rounded-[2.5rem] w-full max-w-xl shadow-2xl animate-in zoom-in duration-300 overflow-hidden">
            <div className="p-8 border-b-2 border-slate-50 flex items-center justify-between">
              <div className="flex items-center gap-4">
                <div className="w-12 h-12 bg-[#00bd7f] text-white rounded-2xl flex items-center justify-center border-2 border-blue-100">
                  <ShieldCheck className="w-6 h-6" />
                </div>
                <h2 className="text-2xl font-black text-slate-800">
                  {modalType === "add" ? "New Assignment" : "Modify Assignment"}
                </h2>
              </div>
              <button
                onClick={() => setIsModalOpen(false)}
                className="p-3 hover:bg-slate-100 rounded-2xl transition-all"
              >
                <X className="w-6 h-6 text-slate-400" />
              </button>
            </div>

            <div className="p-8 space-y-8">
              <div className="grid grid-cols-2 gap-6">
                <div className="space-y-2">
                  <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest">
                    Target Class
                  </label>
                  <select
                    value={formData.className}
                    onChange={(e) =>
                      setFormData({ ...formData, className: e.target.value })
                    }
                    className="w-full bg-slate-50 border-2 border-slate-100 rounded-2xl px-6 py-4 text-sm font-bold focus:border-blue-500 outline-none appearance-none"
                  >
                    <option>Class 5</option>
                    <option>Class 6</option>
                    <option>Class 7</option>
                    <option>Hifz Class</option>
                  </select>
                </div>
                <div className="space-y-2">
                  <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest">
                    Academic Section
                  </label>
                  <select
                    value={formData.section}
                    onChange={(e) =>
                      setFormData({ ...formData, section: e.target.value })
                    }
                    className="w-full bg-slate-50 border-2 border-slate-100 rounded-2xl px-6 py-4 text-sm font-bold focus:border-blue-500 outline-none appearance-none"
                  >
                    <option>Section A</option>
                    <option>Section B</option>
                    <option>Morning</option>
                    <option>Evening</option>
                  </select>
                </div>
                <div className="space-y-2 col-span-2">
                  <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest">
                    Designated Teacher
                  </label>
                  <select
                    value={formData.teacherName}
                    onChange={(e) =>
                      setFormData({ ...formData, teacherName: e.target.value })
                    }
                    className="w-full bg-slate-50 border-2 border-slate-100 rounded-2xl px-6 py-4 text-sm font-bold focus:border-blue-500 outline-none appearance-none"
                  >
                    <option>মাওলানা আব্দুল করিম</option>
                    <option>হাফেজ মোহাম্মদ আলী</option>
                    <option>মাওলানা ইউসুফ আলী</option>
                  </select>
                </div>
              </div>

              <div className="flex gap-4 pt-4">
                <button
                  onClick={() => setIsModalOpen(false)}
                  className="flex-1 py-4 text-slate-500 font-black rounded-2xl hover:bg-slate-50 transition-all cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  onClick={handleAction}
                  className="flex-1 py-4 bg-[#00bd7f] text-white font-black rounded-2xl shadow-lg shadow-emerald-500/30 hover:shadow-xl hover:shadow-emerald-500/40 hover:scale-[1.02]   transition-all flex items-center justify-center gap-2 cursor-pointer"
                >
                  <CheckCircle2 className="w-5 h-5" />{" "}
                  {modalType === "add" ? "Save" : "Save Updates"}
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
            <div className="p-8 text-center space-y-6">
              <div className="w-20 h-20 bg-rose-50 text-rose-500 rounded-[2rem] flex items-center justify-center mx-auto border-2 border-rose-100 shadow-xl shadow-rose-50">
                <AlertCircle className="w-10 h-10" />
              </div>
              <div className="space-y-2">
                <h2 className="text-2xl font-black text-slate-800 tracking-tight">
                  Unassign Lead?
                </h2>
                <p className="text-sm font-bold text-slate-400">
                  This will remove management privileges for
                </p>
              </div>

              <div className="p-4 bg-slate-50 rounded-2xl border-2 border-slate-100">
                <p className="text-lg font-black text-slate-800">
                  {selectedAssignment?.teacherName}
                </p>
                <p className="text-[10px] font-black text-blue-500 uppercase tracking-widest mt-1">
                  {selectedAssignment?.className} •{" "}
                  {selectedAssignment?.section}
                </p>
              </div>

              <div className="flex gap-4 pt-2">
                <button
                  onClick={() => setIsDeleteModalOpen(false)}
                  className="flex-1 py-4 font-black text-slate-400 hover:bg-slate-50 rounded-2xl transition-all"
                >
                  Back
                </button>
                <button
                  onClick={handleDelete}
                  className="flex-1 py-4 bg-rose-500 text-white font-black rounded-2xl shadow-xl shadow-rose-200 hover:bg-rose-600 transition-all"
                >
                  Yes, Remove
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default AssignTeacher;
