import { useState } from "react";
import { 
  Plus, 
  Search, 
  Filter, 
  Download, 
  CheckCircle2, 
  AlertCircle, 
  ChevronDown,
  BookOpen,
  GraduationCap,
  Save,
  RotateCcw,
  X
} from "lucide-react";

const Gradebook = () => {
  const [marks, setMarks] = useState({});
  const [isSaving, setIsSaving] = useState(false);
  const [saveSuccess, setSaveSuccess] = useState(false);

  const students = [
    { id: 1, name: "Abdullah Al Mamun", roll: "001", section: "Hifz A" },
    { id: 2, name: "Zaid Bin Harith", roll: "002", section: "Hifz A" },
    { id: 3, name: "Omar Faruk", roll: "003", section: "Hifz A" },
    { id: 4, name: "Saeed Mohsen", roll: "004", section: "Hifz A" },
    { id: 5, name: "Hamza Bin Abdul", roll: "005", section: "Hifz A" },
  ];

  const handleMarkChange = (id, field, value) => {
    if (value > 100) return;
    setMarks(prev => ({
      ...prev,
      [id]: { ...prev[id], [field]: value }
    }));
  };

  const handleSaveMarks = () => {
    setIsSaving(true);
    setTimeout(() => {
      setIsSaving(false);
      setSaveSuccess(true);
      setTimeout(() => setSaveSuccess(false), 3000);
    }, 2000);
  };

  return (
    <div className="min-h-screen bg-slate-50/50 p-4 md:p-8 animate-in fade-in duration-500">
      <div className="max-w-[1600px] mx-auto space-y-6 md:space-y-8">
        
        {/* Header */}
        <div className="bg-white rounded-[1.5rem] md:rounded-[2.5rem] border border-slate-200 p-6 md:p-8 shadow-sm flex flex-col lg:flex-row justify-between items-center gap-6">
          <div className="flex items-center gap-4 md:gap-6">
            <div className="w-12 h-12 md:w-16 md:h-16 bg-amber-50 rounded-xl md:rounded-2xl flex items-center justify-center border border-amber-100 shadow-inner shrink-0">
              <GraduationCap className="w-6 h-6 md:w-8 md:h-8 text-amber-600" />
            </div>
            <div>
              <h1 className="text-xl md:text-3xl font-black text-slate-800 tracking-tight uppercase leading-none mb-1 md:mb-2 text-balance">Academic Gradebook</h1>
              <p className="text-slate-500 font-bold mt-1 text-xs md:text-base">Entry and evaluation of student marks for terminal and monthly examinations</p>
            </div>
          </div>

          <div className="flex gap-4 w-full lg:w-auto">
             <button className="flex-1 lg:flex-none px-6 md:px-10 py-3.5 md:py-4 bg-slate-100 text-slate-600 rounded-xl md:rounded-2xl font-black hover:bg-slate-200 transition-all flex items-center justify-center gap-3 border border-slate-200 text-[10px] md:text-[11px] uppercase tracking-widest">
               <Download className="w-4 h-4 md:w-5 md:h-5" />
               Excel Export
            </button>
            <button 
               onClick={handleSaveMarks}
               disabled={isSaving || Object.keys(marks).length === 0}
               className="flex-[2] lg:flex-none px-8 md:px-12 py-3.5 md:py-4 bg-slate-900 text-white rounded-xl md:rounded-2xl font-black shadow-xl shadow-slate-200 hover:bg-slate-800 disabled:opacity-50 transition-all flex items-center justify-center gap-3 uppercase tracking-widest text-[10px] md:text-[11px]"
            >
              {isSaving ? <RotateCcw className="w-4 h-4 md:w-5 md:h-5 animate-spin" /> : <Save className="w-4 h-4 md:w-5 md:h-5" />}
              {isSaving ? "Syncing..." : "Finalize Entry"}
            </button>
          </div>
        </div>

        {/* Exam Selectors */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 md:gap-6">
           <div className="bg-white rounded-2xl md:rounded-[2rem] border border-slate-200 p-5 md:p-6 shadow-sm">
              <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-2 md:mb-3 block">Examination Type</label>
              <div className="relative">
                 <select className="w-full bg-slate-50 border border-slate-100 rounded-xl px-4 py-3 text-sm font-bold focus:border-amber-500 outline-none appearance-none cursor-pointer">
                    <option>Mid-Term Exhibition 2026</option>
                    <option>Monthly Hifz Assessment</option>
                 </select>
                 <ChevronDown className="absolute right-4 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-300 pointer-events-none" />
              </div>
           </div>
           <div className="bg-white rounded-2xl md:rounded-[2rem] border border-slate-200 p-5 md:p-6 shadow-sm">
              <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-2 md:mb-3 block">Select Subject</label>
              <div className="relative">
                 <select className="w-full bg-slate-50 border border-slate-100 rounded-xl px-4 py-3 text-sm font-bold focus:border-amber-500 outline-none appearance-none cursor-pointer">
                    <option>Arabic Grammar (Nahw)</option>
                    <option>Al-Quran Tajweed</option>
                 </select>
                 <ChevronDown className="absolute right-4 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-300 pointer-events-none" />
              </div>
           </div>
           
           <div className="bg-white rounded-2xl md:rounded-[2rem] border border-slate-200 p-5 md:p-6 shadow-sm flex items-center justify-between group hover:border-amber-200 transition-all cursor-pointer">
              <div>
                 <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-1">Max Marks</p>
                 <h4 className="text-xl font-black text-slate-800">100</h4>
              </div>
              <div className="w-10 h-10 bg-amber-50 rounded-xl flex items-center justify-center text-amber-600">
                 <AlertCircle className="w-5 h-5" />
              </div>
           </div>

           <div className="bg-slate-900 rounded-2xl md:rounded-[2rem] p-5 md:p-6 shadow-lg flex items-center justify-center">
              <button className="flex items-center gap-3 text-white font-black uppercase tracking-widest text-[10px] md:text-[11px] hover:text-amber-400 transition-colors">
                 <Filter className="w-4 h-4" /> Load Assessment Grid
              </button>
           </div>
        </div>

        {/* Gradebook Entry Table */}
        <div className="bg-white rounded-[1.5rem] md:rounded-[3rem] border border-slate-200 shadow-sm overflow-hidden animate-in slide-in-from-bottom duration-700">
           <div className="p-6 md:p-10 border-b border-slate-50 bg-slate-50/20 flex flex-col sm:flex-row items-center justify-between gap-4">
              <h2 className="text-lg md:text-xl font-black text-slate-800 tracking-tight uppercase">Marks Entry: Arabic Nahw (Sec A)</h2>
              <div className="flex items-center gap-4">
                 <div className="flex items-center gap-2 text-[10px] font-black text-slate-400 uppercase tracking-widest">
                    <div className="w-2 h-2 bg-emerald-500 rounded-full"></div> Fully Entered
                 </div>
                 <div className="flex items-center gap-2 text-[10px] font-black text-slate-400 uppercase tracking-widest">
                    <div className="w-2 h-2 bg-amber-500 rounded-full"></div> Pending
                 </div>
              </div>
           </div>

           <div className="overflow-x-auto">
              <table className="w-full border-collapse min-w-[900px]">
                 <thead>
                    <tr className="border-b border-slate-50 text-[10px] font-black text-slate-400 uppercase tracking-widest">
                       <th className="px-6 md:px-10 py-4 md:py-6 text-left">Student Identity</th>
                       <th className="px-6 md:px-10 py-4 md:py-6 text-center">Theory (70)</th>
                       <th className="px-6 md:px-10 py-4 md:py-6 text-center">Oral/Viva (30)</th>
                       <th className="px-6 md:px-10 py-4 md:py-6 text-center">Total Score</th>
                       <th className="px-6 md:px-10 py-4 md:py-6 text-right">Verification</th>
                    </tr>
                 </thead>
                 <tbody className="divide-y divide-slate-50">
                    {students.map((student) => {
                       const studentMarks = marks[student.id] || { theory: "", oral: "" };
                       const total = (Number(studentMarks.theory) || 0) + (Number(studentMarks.oral) || 0);
                       return (
                          <tr key={student.id} className="group hover:bg-slate-50/50 transition-all">
                             <td className="px-6 md:px-10 py-4 md:py-6">
                                <div className="flex items-center gap-4">
                                   <div className="w-10 h-10 md:w-12 md:h-12 bg-slate-100 rounded-lg md:rounded-xl flex items-center justify-center font-black text-slate-400 border border-slate-200">
                                      {student.roll}
                                   </div>
                                   <div>
                                      <p className="text-sm font-black text-slate-800 uppercase tracking-tight">{student.name}</p>
                                      <p className="text-[10px] font-black text-slate-400 uppercase tracking-[2px]">ID: 260{student.id}820</p>
                                   </div>
                                </div>
                             </td>
                             <td className="px-6 md:px-10 py-4 md:py-6 text-center">
                                <input 
                                   type="number"
                                   value={studentMarks.theory}
                                   onChange={(e) => handleMarkChange(student.id, 'theory', e.target.value)}
                                   className="w-20 md:w-24 bg-slate-50 border border-slate-100 rounded-xl px-4 py-2.5 text-center font-black text-slate-800 focus:bg-white focus:border-amber-500 outline-none transition-all placeholder:text-slate-300" 
                                   placeholder="00"
                                />
                             </td>
                             <td className="px-6 md:px-10 py-4 md:py-6 text-center">
                                <input 
                                   type="number"
                                   value={studentMarks.oral}
                                   onChange={(e) => handleMarkChange(student.id, 'oral', e.target.value)}
                                   className="w-20 md:w-24 bg-slate-50 border border-slate-100 rounded-xl px-4 py-2.5 text-center font-black text-slate-800 focus:bg-white focus:border-amber-500 outline-none transition-all placeholder:text-slate-300" 
                                   placeholder="00"
                                />
                             </td>
                             <td className="px-6 md:px-10 py-4 md:py-6 text-center">
                                <div className="inline-flex items-center justify-center w-20 md:w-24 h-10 md:h-12 rounded-xl bg-slate-900 text-white font-black text-sm">
                                   {total}
                                </div>
                             </td>
                             <td className="px-6 md:px-10 py-4 md:py-6 text-right">
                                {total >= 33 ? (
                                   <div className="inline-flex items-center gap-2 text-[10px] font-black text-emerald-500 uppercase tracking-widest">
                                      PASSED <CheckCircle2 className="w-4 h-4" />
                                   </div>
                                ) : (
                                   <div className="inline-flex items-center gap-2 text-[10px] font-black text-rose-400 uppercase tracking-widest">
                                      CRITICAL <AlertCircle className="w-4 h-4" />
                                   </div>
                                )}
                             </td>
                          </tr>
                       );
                    })}
                 </tbody>
              </table>
           </div>
        </div>

      </div>

      {/* Save Toast Notification */}
      {saveSuccess && (
         <div className="fixed top-10 left-1/2 -translate-x-1/2 z-[200] animate-in slide-in-from-top duration-500">
            <div className="bg-slate-900 text-white px-8 py-4 rounded-[2rem] shadow-2xl flex items-center gap-4 border border-white/10 backdrop-blur-xl">
               <div className="w-8 h-8 bg-amber-500 rounded-xl flex items-center justify-center">
                  <CheckCircle2 className="w-5 h-5 text-white" />
               </div>
               <span className="text-[10px] font-black uppercase tracking-widest">Gradebook Synced Successfully</span>
            </div>
         </div>
      )}
    </div>
  );
};

export default Gradebook;
