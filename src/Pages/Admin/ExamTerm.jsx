import { useState } from "react";
import {
  Plus,
  Settings2,
  Calendar,
  CheckCircle2,
  XCircle,
  Edit3,
  Trash2,
  MoreVertical,
  Flag,
  ChevronRight,
} from "lucide-react";

const ExamTerm = () => {
  const [isModalOpen, setIsModalOpen] = useState(false);

  // Sample Data: Exam Terms
  const [terms, setTerms] = useState([
    {
      id: 1,
      name: "First Term 2026",
      startDate: "2026-03-01",
      endDate: "2026-03-15",
      status: "active",
      description: "Initial academic evaluation for the year 2026.",
    },
    {
      id: 2,
      name: "Mid Term 2026",
      startDate: "2026-06-15",
      endDate: "2026-06-30",
      status: "inactive",
      description: "Mid-year comprehensive examination.",
    },
    {
      id: 3,
      name: "Final Examination 2026",
      startDate: "2026-11-20",
      endDate: "2026-12-10",
      status: "inactive",
      description: "Final assessment and promotion exams.",
    },
  ]);

  return (
    <div className="space-y-8 animate-in fade-in duration-500 p-4 md:p-8">
      {/* Header */}
      <div className="bg-white rounded-[2.5rem] border-2 border-slate-200 p-8 flex flex-col md:flex-row justify-between items-center gap-6 shadow-sm">
        <div className="flex items-center gap-6">
          <div className="w-16 h-16 bg-rose-50 rounded-2xl flex items-center justify-center border-2 border-rose-100">
            <Flag className="w-8 h-8 text-rose-600" />
          </div>
          <div>
            <h1 className="text-2xl md:text-3xl font-black text-slate-800">
              Exam Name
            </h1>
          </div>
        </div>

        <button
          onClick={() => setIsModalOpen(true)}
          className="w-full md:w-auto px-8 py-4 bg-[#00bd7f] text-white rounded-xl hover:bg-[#009b68] transition-all shadow-sm cursor-pointer flex items-center justify-center gap-3"
        >
          <Plus className="w-5 h-5" />
          Add Exam Name
        </button>
      </div>

      {/* Terms Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
        {terms.map((term) => (
          <div
            key={term.id}
            className="group bg-white rounded-[2.5rem] border-2 border-slate-100 shadow-sm hover:shadow-xl hover:border-rose-500/20 transition-all duration-300 flex flex-col"
          >
            <div className="p-8 space-y-6">
              <div className="flex justify-between items-start">
                <div
                  className={`px-4 py-1 rounded-full text-[10px] font-black uppercase tracking-widest border-2 ${
                    term.status === "active"
                      ? "bg-emerald-50 text-emerald-600 border-emerald-100"
                      : "bg-slate-50 text-slate-400 border-slate-100"
                  }`}
                >
                  {term.status}
                </div>
                <button className="p-2 hover:bg-slate-50 rounded-xl text-slate-300 hover:text-slate-600 transition-all">
                  <MoreVertical className="w-5 h-5" />
                </button>
              </div>

              <div>
                <h3 className="text-xl font-black text-slate-800 leading-tight group-hover:text-rose-600 transition-colors cursor-pointer">
                  {term.name}
                </h3>
                <p className="text-xs font-bold text-slate-400 mt-2 line-clamp-2">
                  {term.description}
                </p>
              </div>

              <div className="space-y-4 pt-4 border-t-2 border-slate-50 border-dashed">
                <div className="flex items-center justify-between text-xs font-bold text-slate-500">
                  <div className="flex items-center gap-2 tracking-widest text-[9px] font-black uppercase">
                    <Calendar className="w-4 h-4 text-slate-300" /> Duration
                  </div>
                  <span className="text-slate-700">
                    {new Date(term.startDate).toLocaleDateString()} -{" "}
                    {new Date(term.endDate).toLocaleDateString()}
                  </span>
                </div>
              </div>
            </div>

            <div className="mt-auto p-6 bg-slate-50/50 flex gap-3 border-t-2 border-slate-50 rounded-b-[2.5rem]">
              <button className="flex-1 py-3 bg-white border-2 border-slate-200 text-slate-600 rounded-2xl text-[10px] font-black uppercase tracking-widest hover:border-rose-200 hover:text-rose-600 transition-all shadow-sm flex items-center justify-center gap-2">
                <Edit3 className="w-3.5 h-3.5" /> Configure
              </button>
              <button
                className={`flex-1 py-3 rounded-2xl text-[10px] font-black uppercase tracking-widest transition-all shadow-lg flex items-center justify-center gap-2 ${
                  term.status === "active"
                    ? "bg-emerald-500 text-white shadow-emerald-100"
                    : "bg-white border-2 border-slate-200 text-slate-400"
                }`}
              >
                {term.status === "active" ? (
                  <CheckCircle2 className="w-3.5 h-3.5" />
                ) : (
                  <XCircle className="w-3.5 h-3.5" />
                )}
                {term.status === "active" ? "Running" : "Activate"}
              </button>
            </div>
          </div>
        ))}

        {/* Add Card */}
        <button
          onClick={() => setIsModalOpen(true)}
          className="bg-rose-50/20 rounded-[2.5rem] border-4 border-dashed border-rose-100 flex flex-col items-center justify-center p-12 hover:border-rose-300 hover:bg-rose-50/50 transition-all group min-h-[350px]"
        >
          <div className="w-16 h-16 bg-white rounded-2xl flex items-center justify-center shadow-lg group-hover:scale-110 transition-transform mb-4 border-2 border-rose-100">
            <Plus className="w-8 h-8 text-rose-300 group-hover:text-rose-600" />
          </div>
          <p className="text-lg font-black text-rose-400 group-hover:text-rose-600">
            New Exam Term
          </p>
        </button>
      </div>

      {/* Simple Modal Mock */}
      {isModalOpen && (
        <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-sm z-[100] flex items-center justify-center p-4">
          <div className="bg-white rounded-[3rem] w-full max-w-xl shadow-2xl animate-in zoom-in duration-300 overflow-hidden">
            <div className="p-10 border-b-2 border-slate-50 flex items-center justify-between">
              <h2 className="text-3xl font-black text-slate-800">
                Create Exam Name
              </h2>
              <button
                onClick={() => setIsModalOpen(false)}
                className="p-3 hover:bg-slate-100 rounded-2xl transition-all"
              >
                <Plus className="w-8 h-8 text-slate-300 rotate-45" />
              </button>
            </div>
            <div className="p-10 space-y-6">
              <div className="space-y-2">
                <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest">
                  Name
                </label>
                <input
                  className="w-full bg-slate-50 border-2 border-slate-100 rounded-2xl px-6 py-4 text-sm font-bold focus:border-rose-500 outline-none"
                  placeholder="e.g. First Term 2026"
                />
              </div>
              <div className="grid grid-cols-2 gap-6">
                <div className="space-y-2">
                  <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest">
                    Start Date
                  </label>
                  <input
                    type="date"
                    className="w-full bg-slate-50 border-2 border-slate-100 rounded-2xl px-6 py-4 text-sm font-bold focus:border-rose-500 outline-none"
                  />
                </div>
                <div className="space-y-2">
                  <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest">
                    End Date
                  </label>
                  <input
                    type="date"
                    className="w-full bg-slate-50 border-2 border-slate-100 rounded-2xl px-6 py-4 text-sm font-bold focus:border-rose-500 outline-none"
                  />
                </div>
              </div>
              <div className="pt-6 flex gap-6">
                <button
                  onClick={() => setIsModalOpen(false)}
                  className="flex-1 py-4 text-slate-500 font-black"
                >
                  Cancel
                </button>
                <button
                  onClick={() => setIsModalOpen(false)}
                  className="flex-1 py-4  bg-[#00bd7f] text-white rounded-xl hover:bg-[#009b68] transition-all shadow-sm cursor-pointer font-black  "
                >
                  Save Name
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default ExamTerm;
