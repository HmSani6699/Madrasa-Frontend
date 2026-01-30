import { useState } from "react";
import {
  Plus,
  Search,
  Settings,
  BookOpen,
  Calendar,
  Edit3,
  Trash2,
  CheckCircle2,
  XCircle,
  MoreVertical,
  Layers,
  ExternalLink,
} from "lucide-react";
import InputField from "../../components/InputField";
import SelectInputField from "../../components/SelectInputField";

const ExamSetup = () => {
  const [searchTerm, setSearchTerm] = useState("");
  const [isModalOpen, setIsModalOpen] = useState(false);

  // Sample Data: Exam Setups
  const [setups, setSetups] = useState([
    {
      id: 1,
      term: "First Term 2026",
      class: "Class 5",
      subject: "Arabic Grammar",
      marks: 100,
      distribution: "General Written",
    },
    {
      id: 2,
      term: "First Term 2026",
      class: "Class 6",
      subject: "Mathematics",
      marks: 100,
      distribution: "MCQ Based",
    },
    {
      id: 3,
      term: "Mid Term 2026",
      class: "Class 5",
      subject: "Fiqh",
      marks: 100,
      distribution: "General Written",
    },
  ]);

  return (
    <div className="space-y-8 animate-in fade-in duration-500 p-4 md:p-8">
      {/* Header */}
      <div className="bg-white rounded-[2.5rem] border-2 border-slate-200 p-8 flex flex-col md:flex-row justify-between items-center gap-6 shadow-sm">
        <div className="flex items-center gap-6">
          <div className="w-16 h-16 bg-emerald-50 rounded-2xl flex items-center justify-center border-2 border-emerald-100">
            <Settings className="w-8 h-8 text-emerald-600" />
          </div>
          <div>
            <h1 className="text-2xl md:text-3xl font-black text-slate-800">
              Exam Setup
            </h1>
            <p className="text-slate-500 font-bold mt-1">
              Map subjects to examination terms and mark schemas
            </p>
          </div>
        </div>

        <button
          onClick={() => setIsModalOpen(true)}
          className="w-full md:w-auto px-8 py-4 bg-emerald-600 text-white rounded-2xl font-black shadow-xl shadow-emerald-200 hover:bg-emerald-700 hover:scale-[1.02] active:scale-95 transition-all flex items-center justify-center gap-3"
        >
          <Plus className="w-5 h-5" />
          General Setup
        </button>
      </div>

      {/* Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
        {setups.map((setup) => (
          <div
            key={setup.id}
            className="group bg-white rounded-[2.5rem] border-2 border-slate-100 shadow-sm hover:shadow-xl hover:border-emerald-500/20 transition-all duration-300 flex flex-col"
          >
            <div className="p-8 space-y-6">
              <div className="flex justify-between items-start">
                <div className="px-3 py-1 bg-emerald-50 text-emerald-600 rounded-full text-[10px] font-black uppercase tracking-widest border border-emerald-100">
                  {setup.term}
                </div>
                <button className="p-2 hover:bg-slate-50 rounded-xl text-slate-300 hover:text-slate-600 transition-all">
                  <MoreVertical className="w-5 h-5" />
                </button>
              </div>

              <div>
                <div className="flex items-center gap-2 text-[10px] font-black text-slate-400 uppercase tracking-tighter mb-2">
                  <Layers className="w-3.5 h-3.5" /> {setup.class}
                </div>
                <h3 className="text-xl font-black text-slate-800 leading-tight flex items-center gap-3">
                  <BookOpen className="w-5 h-5 text-emerald-500" />
                  {setup.subject}
                </h3>
              </div>

              <div className="space-y-3 pt-4 border-t-2 border-slate-50 border-dashed">
                <div className="flex justify-between items-center text-xs font-bold text-slate-500">
                  <span className="opacity-60 uppercase tracking-widest text-[9px] font-black">
                    Marking Schema
                  </span>
                  <span className="text-emerald-600 font-black">
                    {setup.distribution}
                  </span>
                </div>
                <div className="flex justify-between items-center text-xs font-bold text-slate-500">
                  <span className="opacity-60 uppercase tracking-widest text-[9px] font-black">
                    Maximum Marks
                  </span>
                  <span className="text-slate-800 font-black">
                    {setup.marks}
                  </span>
                </div>
              </div>
            </div>

            <div className="mt-auto p-6 bg-slate-50/50 flex gap-3 border-t-2 border-slate-50 rounded-b-[2.5rem]">
              <button className="flex-1 py-3 bg-white border-2 border-slate-200 text-slate-600 rounded-2xl text-[10px] font-black uppercase tracking-widest hover:border-emerald-200 hover:text-emerald-600 transition-all shadow-sm flex items-center justify-center gap-2">
                <Edit3 className="w-3.5 h-3.5" /> Edit
              </button>
              <button className="flex-1 py-3 bg-white border-2 border-slate-200 text-rose-500 rounded-2xl text-[10px] font-black uppercase tracking-widest hover:bg-rose-50 hover:border-rose-100 transition-all shadow-sm flex items-center justify-center gap-2">
                <Trash2 className="w-3.5 h-3.5" /> Remove
              </button>
            </div>
          </div>
        ))}

        {/* Action Card */}
        <button
          onClick={() => setIsModalOpen(true)}
          className="bg-emerald-50/20 rounded-[2.5rem] border-4 border-dashed border-emerald-100 flex flex-col items-center justify-center p-12 hover:border-emerald-300 hover:bg-emerald-50/50 transition-all group min-h-[300px]"
        >
          <div className="w-16 h-16 bg-white rounded-2xl flex items-center justify-center shadow-lg group-hover:scale-110 transition-transform mb-4 border-2 border-emerald-100">
            <Plus className="w-8 h-8 text-emerald-300 group-hover:text-emerald-600" />
          </div>
          <p className="text-lg font-black text-emerald-400 group-hover:text-emerald-600">
            Add Subject Mapping
          </p>
        </button>
      </div>

      {/* Simplified Modal Mock */}
      {isModalOpen && (
        <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-sm z-[100] flex items-center justify-center p-4">
          <div className="bg-white rounded-[3rem] w-full max-w-xl shadow-2xl animate-in zoom-in duration-300 overflow-hidden">
            <div className="p-10 border-b-2 border-slate-50 flex items-center justify-between bg-emerald-50/30">
              <h2 className="text-2xl font-black text-slate-800 tracking-tight">
                Exam Mapping Setup
              </h2>
              <button
                onClick={() => setIsModalOpen(false)}
                className="p-3 hover:bg-white rounded-2xl shadow-sm transition-all"
              >
                <Plus className="w-8 h-8 text-slate-300 rotate-45" />
              </button>
            </div>
            <div className="p-8 space-y-6">
              <div className="grid grid-cols-2 gap-6">
                <SelectInputField
                  title={"Exam Name"}
                  options={[{ value: "First Term 2026" }]}
                />
                <SelectInputField
                  title={"Class"}
                  options={[{ value: "Class 1" }]}
                />
                <SelectInputField
                  title={"Subject"}
                  options={[{ value: "Bangla" }]}
                />

                <InputField
                  title={"Mark"}
                  placeholder={"Enter mark"}
                  type={"number"}
                />
              </div>
              <div className="pt-6 flex gap-4">
                <button
                  onClick={() => setIsModalOpen(false)}
                  className="flex-1 py-4 text-slate-500 font-black"
                >
                  Cancel
                </button>
                <button
                  onClick={() => setIsModalOpen(false)}
                  className="flex-1 py-4 bg-emerald-600 text-white font-black rounded-2xl shadow-xl shadow-emerald-200"
                >
                  Save Setup
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default ExamSetup;
