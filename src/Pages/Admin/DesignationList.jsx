import { useState } from "react";
import {
  GraduationCap,
  Plus,
  Search,
  Edit2,
  Trash2,
  Award,
  ChevronRight,
  X,
  CheckCircle,
  Briefcase,
} from "lucide-react";

const DesignationList = () => {
  const [designations, setDesignations] = useState([
    {
      id: 1,
      title: "Head Teacher",
      level: "Senior",
      employeeCount: 2,
      icon: GraduationCap,
      color: "text-purple-600",
      bg: "bg-purple-50",
    },
    {
      id: 2,
      title: "Senior Teacher",
      level: "Middle",
      employeeCount: 12,
      icon: Award,
      color: "text-emerald-600",
      bg: "bg-emerald-50",
    },
    {
      id: 3,
      title: "Assistant Teacher",
      level: "Junior",
      employeeCount: 25,
      icon: Briefcase,
      color: "text-blue-600",
      bg: "bg-blue-50",
    },
    {
      id: 4,
      title: "Accountant",
      level: "Staff",
      employeeCount: 2,
      icon: Award,
      color: "text-amber-600",
      bg: "bg-amber-50",
    },
    {
      id: 5,
      title: "Office Clerk",
      level: "Staff",
      employeeCount: 5,
      icon: Briefcase,
      color: "text-rose-600",
      bg: "bg-rose-50",
    },
  ]);

  const [searchTerm, setSearchTerm] = useState("");
  const [showAddModal, setShowAddModal] = useState(false);
  const [editDesg, setEditDesg] = useState(null);
  const [deleteDesg, setDeleteDesg] = useState(null);
  const [toast, setToast] = useState(null);

  const filteredDesgs = designations.filter((d) =>
    d.title.toLowerCase().includes(searchTerm.toLowerCase()),
  );

  const handleSave = (title, level) => {
    if (editDesg) {
      setDesignations((prev) =>
        prev.map((d) => (d.id === editDesg.id ? { ...d, title, level } : d)),
      );
      setToast(`Designation updated to "${title}"`);
    } else {
      const newD = {
        id: Date.now(),
        title,
        level,
        employeeCount: 0,
        icon: Briefcase,
        color: "text-slate-600",
        bg: "bg-slate-50",
      };
      setDesignations([...designations, newD]);
      setToast(`New designation "${title}" added!`);
    }
    setShowAddModal(false);
    setEditDesg(null);
    setTimeout(() => setToast(null), 3000);
  };

  return (
    <div className="p-3 sm:p-4 md:p-6 lg:p-8 space-y-8 animate-in fade-in duration-500">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 bg-white p-8 rounded-[2.5rem] border-2 border-slate-100 shadow-sm relative overflow-hidden">
        <div className="absolute top-0 right-0 w-64 h-64 bg-purple-50 rounded-full -mr-32 -mt-32 opacity-40" />
        <div className="flex items-center gap-5 relative z-10">
          <div className="w-16 h-16 bg-purple-50 rounded-2xl flex items-center justify-center shadow-inner">
            <GraduationCap className="w-8 h-8 text-[#00bd7f]" />
          </div>
          <div>
            <h1 className="text-2xl sm:text-4xl font-black text-slate-800 tracking-tight">
              Designations
            </h1>
            <p className="text-slate-500 text-sm font-bold uppercase tracking-widest mt-1">
              Define professional roles & ranks
            </p>
          </div>
        </div>
        <button
          onClick={() => setShowAddModal(true)}
          className="w-full sm:w-auto flex items-center justify-center gap-2 px-8 py-3.5 text-sm font-black bg-[#00bd7f] text-white rounded-2xl shadow-xl shadow-emerald-500/30 hover:shadow-2xl hover:shadow-emerald-500/40 hover:scale-[1.02] active:scale-95 transition-all relative z-10 cursor-pointer"
        >
          <Plus className="w-5 h-5" /> Add Designation
        </button>
      </div>

      {/* Table-style List */}
      <div className="bg-white rounded-[2.5rem] border-2 border-slate-50 shadow-sm overflow-hidden">
        <div className="p-6 border-b-2 border-slate-50 bg-slate-50/30">
          <div className="relative max-w-md">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4.5 h-4.5 text-slate-400" />
            <input
              type="text"
              placeholder="Filter designations..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-12 pr-4 py-3 bg-white border-2 border-slate-100 focus:border-purple-500 rounded-2xl outline-none transition-all font-bold text-slate-800 shadow-sm"
            />
          </div>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="text-left bg-slate-50/50">
                <th className="px-10 py-6 text-[10px] font-black text-slate-400 uppercase tracking-widest">
                  Role Title
                </th>
                <th className="px-10 py-6 text-[10px] font-black text-slate-400 uppercase tracking-widest text-center">
                  Hierarchy Level
                </th>
                <th className="px-10 py-6 text-[10px] font-black text-slate-400 uppercase tracking-widest text-center">
                  Active Staff
                </th>
                <th className="px-10 py-6 text-[10px] font-black text-slate-400 uppercase tracking-widest text-right">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody className="divide-y-2 divide-slate-50">
              {filteredDesgs.map((desg) => (
                <tr
                  key={desg.id}
                  className="hover:bg-purple-50/30 transition-colors group"
                >
                  <td className="px-10 py-6">
                    <div className="flex items-center gap-4">
                      <div
                        className={`w-12 h-12 ${desg.bg} rounded-2xl flex items-center justify-center shadow-sm group-hover:scale-110 transition-transform`}
                      >
                        <desg.icon className={`w-6 h-6 ${desg.color}`} />
                      </div>
                      <p className="text-base font-black text-slate-800">
                        {desg.title}
                      </p>
                    </div>
                  </td>
                  <td className="px-10 py-6 text-center">
                    <span className="px-4 py-1.5 bg-slate-100 text-slate-600 rounded-full text-[10px] font-black uppercase tracking-widest group-hover:bg-white group-hover:shadow-sm transition-all border-2 border-transparent group-hover:border-purple-100">
                      {desg.level}
                    </span>
                  </td>
                  <td className="px-10 py-6 text-center font-black text-slate-800">
                    {desg.employeeCount}
                  </td>
                  <td className="px-10 py-6 text-right">
                    <div className="flex items-center justify-end gap-2">
                      <button
                        onClick={() => {
                          setEditDesg(desg);
                          setShowAddModal(true);
                        }}
                        className="p-3 bg-slate-50 text-slate-400 hover:text-[#00bd7f] hover:bg-white hover:shadow-md rounded-xl transition-all cursor-pointer"
                      >
                        <Edit2 className="w-4 h-4" />
                      </button>
                      <button
                        onClick={() => setDeleteDesg(desg)}
                        className="p-3 bg-slate-50 text-slate-400 hover:text-rose-600 hover:bg-white hover:shadow-md rounded-xl transition-all cursor-pointer"
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
      </div>

      {/* Modals */}
      {showAddModal && (
        <div
          className="fixed inset-0 bg-slate-900/60 backdrop-blur-sm z-[200] flex items-center justify-center p-4"
          onClick={() => {
            setShowAddModal(false);
            setEditDesg(null);
          }}
        >
          <div
            className="bg-white rounded-[2.5rem] w-full max-w-md shadow-2xl animate-in zoom-in duration-300 overflow-hidden"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="p-10 border-b-2 border-slate-50 bg-slate-50/50 flex items-center justify-between">
              <div>
                <h2 className="text-3xl font-black text-slate-800 tracking-tight">
                  {editDesg ? "Update Role" : "New Role"}
                </h2>
                <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mt-1">
                  Designation Registry
                </p>
              </div>
              <button
                onClick={() => {
                  setShowAddModal(false);
                  setEditDesg(null);
                }}
                className="p-4 bg-white border-2 border-slate-100 text-slate-400 hover:text-rose-500 rounded-2xl transition-all cursor-pointer"
              >
                <X className="w-6 h-6" />
              </button>
            </div>
            <form
              onSubmit={(e) => {
                e.preventDefault();
                handleSave(e.target.title.value, e.target.level.value);
              }}
              className="p-10 space-y-8"
            >
              <div className="space-y-2">
                <label className="text-[10px] font-black text-slate-400  tracking-widest flex items-center gap-2">
                  <GraduationCap className="w-3.5 h-3.5 text-[#00bd7f]" />{" "}
                  Position Title
                </label>
                <input
                  name="title"
                  required
                  autoFocus
                  defaultValue={editDesg?.title || ""}
                  placeholder="e.g. Senior Lecturer"
                  className="w-full px-5 py-4 bg-slate-50 border-2 border-transparent focus:border-[#00bd7f] focus:bg-white rounded-2xl outline-none font-bold text-slate-800 transition-all shadow-inner"
                />
              </div>
              <div className="space-y-2">
                <label className="text-[10px] font-black text-slate-400  tracking-widest flex items-center gap-2">
                  <Award className="w-3.5 h-3.5 text-[#00bd7f]" /> Hierarchy
                  Level
                </label>
                <select
                  name="level"
                  defaultValue={editDesg?.level || "Middle"}
                  className="w-full px-5 py-4 bg-slate-50 border-2 border-transparent focus:border-[#00bd7f]focus:bg-white rounded-2xl outline-none font-black text-slate-800 transition-all appearance-none cursor-pointer"
                >
                  <option value="Senior">Senior Leadership</option>
                  <option value="Middle">Middle Management</option>
                  <option value="Junior">Junior Staff</option>
                  <option value="Associate">Associate</option>
                </select>
              </div>
              <div className="flex gap-4 pt-4">
                <button
                  type="button"
                  onClick={() => {
                    setShowAddModal(false);
                    setEditDesg(null);
                  }}
                  className="flex-1 py-4 bg-slate-100 text-slate-600 font-black rounded-2xl hover:bg-slate-200 transition-all uppercase text-xs tracking-widest cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="w-full sm:w-auto flex items-center justify-center gap-2 px-8 py-3.5 text-sm font-black bg-[#00bd7f] text-white rounded-2xl shadow-xl shadow-emerald-500/30 hover:shadow-2xl hover:shadow-emerald-500/40 hover:scale-[1.02] active:scale-95 transition-all relative z-10 cursor-pointer"
                >
                  Save Designation
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {deleteDesg && (
        <div
          className="fixed inset-0 bg-slate-900/60 backdrop-blur-sm z-[200] flex items-center justify-center p-4"
          onClick={() => setDeleteDesg(null)}
        >
          <div
            className="bg-white rounded-[2.5rem] p-10 max-w-sm w-full text-center shadow-2xl animate-in zoom-in duration-300"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="w-20 h-20 bg-rose-50 rounded-3xl flex items-center justify-center mx-auto mb-8 shadow-inner">
              <Trash2 className="w-10 h-10 text-rose-500" />
            </div>
            <h2 className="text-2xl font-black text-slate-800 mb-3 tracking-tight">
              Erase Position?
            </h2>
            <p className="text-sm font-bold text-slate-500 mb-8 leading-relaxed">
              Removing <span className="text-rose-600">{deleteDesg.title}</span>
              ? Existing employees in this role will need a new designation
              assigned.
            </p>
            <div className="flex gap-4">
              <button
                onClick={() => setDeleteDesg(null)}
                className="flex-1 py-4 bg-slate-100 text-slate-600 font-black rounded-2xl hover:bg-slate-200 transition-all uppercase text-xs tracking-widest"
              >
                Cancel
              </button>
              <button
                onClick={() => {
                  setDesignations((prev) =>
                    prev.filter((d) => d.id !== deleteDesg.id),
                  );
                  setToast(`Role erased.`);
                  setDeleteDesg(null);
                }}
                className="flex-1 py-4 bg-rose-600 text-white font-black rounded-2xl shadow-xl shadow-rose-200 hover:scale-105 transition-all uppercase text-xs tracking-widest"
              >
                Confirm
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Toast */}
      {toast && (
        <div className="fixed bottom-10 left-1/2 -translate-x-1/2 z-[300] animate-in slide-in-from-bottom-5 duration-500 px-4">
          <div className="bg-slate-900 border border-slate-800 text-white px-8 py-4 rounded-[2rem] shadow-2xl flex items-center gap-4">
            <div className="w-8 h-8 bg-purple-500 rounded-full flex items-center justify-center shadow-purple-500/50 shadow-lg">
              <CheckCircle className="w-5 h-5" />
            </div>
            <p className="text-sm font-black tracking-tight">{toast}</p>
          </div>
        </div>
      )}
    </div>
  );
};

export default DesignationList;
