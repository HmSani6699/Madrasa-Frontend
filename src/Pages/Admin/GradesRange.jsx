import { useState } from "react";
import { 
  Plus, 
  Search, 
  Award, 
  Percent, 
  Edit3, 
  Trash2, 
  Info,
  CheckCircle2,
  ChevronRight,
  ShieldCheck
} from "lucide-react";

const GradesRange = () => {
  const [isModalOpen, setIsModalOpen] = useState(false);

  // Sample Data: Grade Scales
  const [grades, setGrades] = useState([
    { id: 1, name: "A+", points: "5.00", rangeFrom: 80, rangeTo: 100, color: "bg-emerald-500 text-white" },
    { id: 2, name: "A", points: "4.00", rangeFrom: 70, rangeTo: 79, color: "bg-emerald-400 text-white" },
    { id: 3, name: "A-", points: "3.50", rangeFrom: 60, rangeTo: 69, color: "bg-blue-400 text-white" },
    { id: 4, name: "B", points: "3.00", rangeFrom: 50, rangeTo: 59, color: "bg-blue-300 text-white" },
    { id: 5, name: "F", points: "0.00", rangeFrom: 0, rangeTo: 32, color: "bg-rose-500 text-white text-[10px] font-black" },
  ]);

  return (
    <div className="space-y-8 animate-in fade-in duration-500 p-4 md:p-8">
      {/* Header */}
      <div className="bg-white rounded-[2.5rem] border-2 border-slate-200 p-8 flex flex-col md:flex-row justify-between items-center gap-6 shadow-sm">
        <div className="flex items-center gap-6">
          <div className="w-16 h-16 bg-amber-50 rounded-2xl flex items-center justify-center border-2 border-amber-100">
            <Award className="w-8 h-8 text-amber-500" />
          </div>
          <div>
            <h1 className="text-2xl md:text-3xl font-black text-slate-800">Grades Range</h1>
            <p className="text-slate-500 font-bold mt-1">Configure mark-to-grade mapping and GPA points</p>
          </div>
        </div>

        <button 
          onClick={() => setIsModalOpen(true)}
          className="w-full md:w-auto px-8 py-4 bg-amber-500 text-white rounded-2xl font-black shadow-xl shadow-amber-200 hover:bg-amber-600 transition-all flex items-center justify-center gap-3"
        >
          <Plus className="w-5 h-5" />
          Add Grade Scale
        </button>
      </div>

      {/* Logic Notice */}
      <div className="bg-blue-50 border-2 border-blue-100 p-6 rounded-[2rem] flex items-center gap-4">
         <div className="w-12 h-12 bg-white rounded-xl flex items-center justify-center shadow-sm border border-blue-200">
            <ShieldCheck className="w-6 h-6 text-blue-500" />
         </div>
         <div>
            <p className="text-xs font-black text-blue-800 uppercase tracking-widest">Grading Logic</p>
            <p className="text-sm font-bold text-blue-600">The system automatically maps total marks to these ranges during merit list generation.</p>
         </div>
      </div>

      {/* Grade Matrix */}
      <div className="bg-white rounded-[2.5rem] border-2 border-slate-200 shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-slate-50/50">
              <tr>
                <th className="px-8 py-5 text-left text-[10px] font-black text-slate-400 uppercase tracking-widest">Grade</th>
                <th className="px-8 py-5 text-center text-[10px] font-black text-slate-400 uppercase tracking-widest">GPA Points</th>
                <th className="px-8 py-5 text-center text-[10px] font-black text-slate-400 uppercase tracking-widest">Percentage Range</th>
                <th className="px-8 py-5 text-center text-[10px] font-black text-slate-400 uppercase tracking-widest">Status</th>
                <th className="px-8 py-5 text-right text-[10px] font-black text-slate-400 uppercase tracking-widest">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y-2 divide-slate-50">
              {grades.map((grade) => (
                <tr key={grade.id} className="group hover:bg-amber-50/30 transition-colors">
                  <td className="px-8 py-6">
                    <div className={`w-12 h-12 rounded-2xl flex items-center justify-center text-lg font-black shadow-inner ${grade.color}`}>
                       {grade.name}
                    </div>
                  </td>
                  <td className="px-8 py-6 text-center">
                    <span className="text-sm font-black text-slate-800">{grade.points}</span>
                  </td>
                  <td className="px-8 py-6 text-center">
                     <div className="flex items-center justify-center gap-3">
                        <span className="text-xs font-black text-slate-500">{grade.rangeFrom}%</span>
                        <div className="w-20 h-1.5 bg-slate-100 rounded-full overflow-hidden">
                           <div className="h-full bg-amber-400" style={{ width: '100%' }} />
                        </div>
                        <span className="text-xs font-black text-slate-500">{grade.rangeTo}%</span>
                     </div>
                  </td>
                  <td className="px-8 py-6 text-center">
                    <div className="flex items-center justify-center gap-2 text-emerald-500">
                       <CheckCircle2 className="w-4 h-4" />
                       <span className="text-[10px] font-black uppercase tracking-widest">Active</span>
                    </div>
                  </td>
                  <td className="px-8 py-6 text-right">
                    <div className="flex items-center justify-end gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                      <button className="p-2.5 bg-white border-2 border-slate-100 text-slate-400 hover:text-amber-500 hover:border-amber-200 rounded-xl transition-all shadow-sm">
                        <Edit3 className="w-4 h-4" />
                      </button>
                      <button className="p-2.5 bg-white border-2 border-slate-100 text-slate-400 hover:text-rose-600 hover:border-rose-200 rounded-xl transition-all shadow-sm">
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
    </div>
  );
};

export default GradesRange;
