import { useState } from "react";
import {
  Plus,
  Search,
  Settings2,
  UserCheck,
  CheckCircle2,
  AlertCircle,
  Save,
  Filter,
  ChevronRight,
  School,
  BookOpen,
} from "lucide-react";
import SelectInputField from "../../components/SelectInputField";

const MarkEntries = () => {
  const [selectedTerm, setSelectedTerm] = useState("First Term 2026");
  const [selectedClass, setSelectedClass] = useState("Class 5");
  const [selectedSubject, setSelectedSubject] = useState("Arabic Grammar");

  // Sample Data: Students for Mark Entry
  const [students, setStudents] = useState([
    {
      id: "STU001",
      name: "মোহাম্মদ রহমান",
      roll: "01",
      marks: { theory: "85", viva: "25" },
      status: "present",
    },
    {
      id: "STU002",
      name: "আয়েশা খাতুন",
      roll: "02",
      marks: { theory: "78", viva: "28" },
      status: "present",
    },
    {
      id: "STU003",
      name: "ইউসুফ হোসেন",
      roll: "03",
      marks: { theory: "0", viva: "0" },
      status: "absent",
    },
    {
      id: "STU004",
      name: "ফাতিমা জোহরা",
      roll: "04",
      marks: { theory: "92", viva: "29" },
      status: "present",
    },
  ]);

  return (
    <div className="space-y-8 animate-in fade-in duration-500 p-4 md:p-8">
      {/* Header */}
      <div className="bg-white rounded-[2.5rem] border-2 border-slate-200 p-8 flex flex-col md:flex-row justify-between items-center gap-6 shadow-sm">
        <div className="flex items-center gap-6">
          <div className="w-16 h-16 bg-emerald-50 rounded-2xl flex items-center justify-center border-2 border-emerald-100">
            <UserCheck className="w-8 h-8 text-[#00bd7f]" />
          </div>
          <div>
            <h1 className="text-2xl md:text-3xl font-black text-slate-800">
              Mark Entries
            </h1>
            <p className="text-slate-500 font-bold mt-1">Register and manage student examination scores</p>
          </div>
        </div>

        <button className="w-full md:w-auto px-8 py-4 bg-[#00bd7f] text-white rounded-2xl font-black shadow-xl shadow-emerald-200 hover:bg-[#009b68] transition-all flex items-center justify-center gap-3">
          <Save className="w-5 h-5" />
          Save All Changes
        </button>
      </div>

      {/* Control Bar */}
      <div className="bg-white p-6 rounded-[2rem] border-2 border-slate-200 shadow-sm flex flex-col lg:flex-row gap-6 items-end">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 flex-1">
          <SelectInputField
            title={"Exam Name"}
            options={[{ value: "First Semister" }]}
          />
          <SelectInputField title={"Class"} options={[{ value: "One" }]} />
          <SelectInputField title={"Subject"} options={[{ value: "Bangla" }]} />
        </div>
      </div>

      {/* Marks Table */}
      <div className="bg-white rounded-[2.5rem] border-2 border-slate-200 shadow-sm overflow-hidden mb-20">
        <div className="p-6 bg-slate-50/50 border-b-2 border-slate-50 flex items-center justify-between">
          <div className="flex items-center gap-4">
            <span className="text-xs font-black text-slate-500 uppercase tracking-widest">
              Marking Table
            </span>
             <div className="flex gap-2">
              <span className="px-3 py-1 bg-white border border-slate-200 rounded-lg text-[10px] font-black text-slate-400 uppercase">
                Theory (100)
              </span>
              <span className="px-3 py-1 bg-white border border-slate-200 rounded-lg text-[10px] font-black text-slate-400 uppercase">
                Pass (40)
              </span>
            </div>
          </div>
          <div className="relative w-64">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-300" />
            <input
              className="w-full pl-9 pr-4 py-2 bg-white border-2 border-slate-100 rounded-xl text-xs font-bold outline-none focus:border-[#00bd7f]"
              placeholder="Search student..."
            />
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-slate-50/30">
              <tr>
                <th className="px-8 py-6 text-left text-[10px] font-black text-slate-400 uppercase tracking-widest">
                  Roll
                </th>
                <th className="px-8 py-6 text-left text-[10px] font-black text-slate-400 uppercase tracking-widest">
                  Student
                </th>

                <th className="px-8 py-6 text-center text-[10px] font-black text-slate-400 uppercase tracking-widest">
                  Marks Obtained
                </th>

                <th className="px-8 py-6 text-center text-[10px] font-black text-slate-400 uppercase tracking-widest">
                  Status
                </th>
              </tr>
            </thead>
            <tbody className="divide-y-2 divide-slate-50">
              {students.map((student) => {
                const total =
                  parseInt(student.marks.theory) + parseInt(student.marks.viva);
                const isTheoryOver = parseInt(student.marks.theory) > 70;
                const isVivaOver = parseInt(student.marks.viva) > 30;

                return (
                  <tr
                    key={student.id}
                    className="group hover:bg-emerald-50/30 transition-colors"
                  >
                    <td className="px-8 py-4">
                      <span className="text-sm font-black text-[#00bd7f] tracking-tight">
                        {student.roll}
                      </span>
                    </td>
                    <td className="px-8 py-4">
                      <div className="flex flex-col">
                        <span className="text-sm font-bold text-slate-800">
                          {student.name}
                        </span>
                        <span className="text-[10px] font-bold text-slate-400 uppercase tracking-tighter">
                          ID: {student.id}
                        </span>
                      </div>
                    </td>

                    <td className="px-8 py-4 text-center">
                       <div className="flex items-center justify-center gap-2">
                          <input
                            disabled={student.status === "absent"}
                            defaultValue={student.marks.theory}
                            className={`w-24 px-4 py-3 bg-slate-50 border-2 rounded-xl text-sm font-black text-center focus:outline-none transition-all ${
                              student.status === "absent"
                                ? "opacity-30 border-slate-100"
                                : "border-slate-100 focus:border-[#00bd7f] focus:bg-white"
                            }`}
                            placeholder="00"
                          />
                       </div>
                    </td>

                    <td className="px-8 py-4 text-center">
                      <button
                        className={`px-4 py-2 rounded-xl text-[10px] font-black uppercase tracking-widest border-2 transition-all ${
                          student.status === "present"
                            ? "bg-emerald-50 text-[#00bd7f] border-emerald-100"
                            : "bg-rose-50 text-rose-600 border-rose-100"
                        }`}
                      >
                        {student.status}
                      </button>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default MarkEntries;
