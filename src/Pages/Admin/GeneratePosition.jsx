import { useState } from "react";
import {
  Trophy,
  Search,
  Settings2,
  Users,
  CheckCircle2,
  RefreshCw,
  ArrowRight,
  Filter,
  BarChart4,
  Medal,
} from "lucide-react";

const GeneratePosition = () => {
  const [selectedTerm, setSelectedTerm] = useState("First Term 2026");
  const [isProcessing, setIsProcessing] = useState(false);

  // Sample Data: Merit List
  const meritList = [
    {
      rank: 1,
      name: "মোহাম্মদ রহমান",
      roll: "01",
      gpa: "5.00",
      totalMarks: "895",
      status: "passed",
    },
    {
      rank: 2,
      name: "আয়েশা খাতুন",
      roll: "02",
      gpa: "4.95",
      totalMarks: "882",
      status: "passed",
    },
    {
      rank: 3,
      name: "আব্দুল্লাহ মামুন",
      roll: "05",
      gpa: "4.88",
      totalMarks: "870",
      status: "passed",
    },
    {
      rank: 4,
      name: "ফাতিমা জোহরা",
      roll: "04",
      gpa: "4.50",
      totalMarks: "810",
      status: "passed",
    },
  ];

  return (
    <div className="space-y-8 animate-in fade-in duration-500 p-4 md:p-5">
      {/* Header */}
      <div className="bg-white rounded-[2.5rem] border-2 border-slate-200 p-8 flex flex-col md:flex-row justify-between items-center gap-6 shadow-sm">
        <div className="flex items-center gap-6">
          <div className="w-16 h-16 bg-blue-50 rounded-2xl flex items-center justify-center border-2 border-blue-100">
            <Trophy className="w-8 h-8 text-blue-600" />
          </div>
          <div>
            <h1 className="text-2xl md:text-3xl font-black text-slate-800">
              Generate Merit List
            </h1>
            {/* <p className="text-slate-500 font-bold mt-1">Calculate student positions and rank based on academic performance</p> */}
          </div>
        </div>

        <button
          onClick={() => setIsProcessing(true)}
          className="w-full md:w-auto px-8 py-4 bg-blue-600 text-white rounded-2xl font-black shadow-xl shadow-blue-200 hover:bg-blue-700 transition-all flex items-center justify-center gap-3"
        >
          {isProcessing ? (
            <RefreshCw className="w-5 h-5 animate-spin" />
          ) : (
            <Settings2 className="w-5 h-5" />
          )}
          Process Results
        </button>
      </div>

      {/* Analytics Summary */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
        <div className="bg-white p-8 rounded-[2.5rem] border-2 border-slate-200 shadow-sm flex flex-col items-center text-center space-y-4">
          <div className="w-16 h-16 bg-blue-50 rounded-full flex items-center justify-center border-4 border-white shadow-md">
            <Users className="w-8 h-8 text-blue-500" />
          </div>
          <div>
            <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">
              Total Candidates
            </p>
            <p className="text-2xl font-black text-slate-800">45 Students</p>
          </div>
        </div>
        <div className="bg-white p-8 rounded-[2.5rem] border-2 border-slate-200 shadow-sm flex flex-col items-center text-center space-y-4">
          <div className="w-16 h-16 bg-emerald-50 rounded-full flex items-center justify-center border-4 border-white shadow-md">
            <CheckCircle2 className="w-8 h-8 text-emerald-500" />
          </div>
          <div>
            <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">
              Mark Entries Finished
            </p>
            <p className="text-2xl font-black text-slate-800">100% Complete</p>
          </div>
        </div>
        <div className="bg-white p-8 rounded-[2.5rem] border-2 border-slate-200 shadow-sm flex flex-col items-center text-center space-y-4">
          <div className="w-16 h-16 bg-amber-50 rounded-full flex items-center justify-center border-4 border-white shadow-md">
            <BarChart4 className="w-8 h-8 text-amber-500" />
          </div>
          <div>
            <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">
              Avg. Class Performance
            </p>
            <p className="text-2xl font-black text-slate-800">
              82.4% (GPA 4.2)
            </p>
          </div>
        </div>
      </div>

      {/* Results Matrix */}
      <div className="bg-white rounded-[2.5rem] border-2 border-slate-200 shadow-sm overflow-hidden">
        <div className="p-8 border-b-2 border-slate-50 flex flex-col md:flex-row gap-6 items-center justify-between">
          <h3 className="text-lg font-black text-slate-800 flex items-center gap-3">
            <Medal className="w-6 h-6 text-amber-500" />
            Merit Standings
          </h3>
          <div className="flex gap-4 w-full md:w-auto">
            <select className="flex-1 md:w-48 bg-slate-50 border-2 border-slate-100 rounded-2xl px-6 py-3 text-xs font-black outline-none appearance-none">
              <option>First Term 2026</option>
              <option>Mid Term 2026</option>
            </select>
            <select className="flex-1 md:w-32 bg-slate-50 border-2 border-slate-100 rounded-2xl px-6 py-3 text-xs font-black outline-none appearance-none">
              <option>Class 5</option>
              <option>Class 6</option>
            </select>
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-slate-50/50">
              <tr>
                <th className="px-8 py-5 text-left text-[10px] font-black text-slate-400 uppercase tracking-widest">
                  Rank
                </th>
                <th className="px-8 py-5 text-left text-[10px] font-black text-slate-400 uppercase tracking-widest">
                  Student Details
                </th>
                <th className="px-8 py-5 text-center text-[10px] font-black text-slate-400 uppercase tracking-widest">
                  Total Marks
                </th>
                <th className="px-8 py-5 text-center text-[10px] font-black text-slate-400 uppercase tracking-widest">
                  GPA
                </th>
                <th className="px-8 py-5 text-center text-[10px] font-black text-slate-400 uppercase tracking-widest">
                  Outcome
                </th>
              </tr>
            </thead>
            <tbody className="divide-y-2 divide-slate-50">
              {meritList.map((st) => (
                <tr
                  key={st.rank}
                  className="group hover:bg-blue-50/30 transition-colors"
                >
                  <td className="px-8 py-6">
                    <div
                      className={`w-10 h-10 rounded-xl flex items-center justify-center font-black text-sm border-2 ${
                        st.rank === 1
                          ? "bg-amber-500 border-amber-600 text-white shadow-lg"
                          : st.rank === 2
                            ? "bg-slate-300 border-slate-400 text-slate-700 shadow-md"
                            : st.rank === 3
                              ? "bg-amber-100 border-amber-200 text-amber-700"
                              : "bg-slate-50 border-slate-100 text-slate-400"
                      }`}
                    >
                      {st.rank}
                    </div>
                  </td>
                  <td className="px-8 py-6">
                    <div className="flex flex-col">
                      <span className="text-sm font-black text-slate-800">
                        {st.name}
                      </span>
                      <span className="text-[10px] font-black text-blue-500 uppercase tracking-widest mt-0.5">
                        Roll: {st.roll}
                      </span>
                    </div>
                  </td>
                  <td className="px-8 py-6 text-center font-black text-slate-700">
                    {st.totalMarks}
                  </td>
                  <td className="px-8 py-6 text-center">
                    <span className="px-4 py-1.5 bg-blue-50 text-blue-600 rounded-full text-xs font-black border border-blue-100">
                      {st.gpa}
                    </span>
                  </td>
                  <td className="px-8 py-6 text-center">
                    <span className="text-[10px] font-black uppercase tracking-widest text-emerald-500">
                      {st.status}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default GeneratePosition;
