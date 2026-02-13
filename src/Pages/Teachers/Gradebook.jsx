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
import SelectInputField from "../../components/SelectInputField";

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
        
  

                   {/* Filters Area */}
      <div className="bg-white rounded-3xl border-2 border-slate-200 p-4 sm:p-6 md:p-8 shadow-sm">
              <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
                 <SelectInputField title={'Exam Session'} options={[{ value: "Class One" }, { value: "Class Two" }, { value: "Class Three" }]} />
                 <SelectInputField title={'Class'} options={[{ value: "Class One" }, { value: "Class Two" }, { value: "Class Three" }]} />
            <SelectInputField title={'Subject'} options={[{value:"A"},{value:"B"},{value:"C"}]}/>
         
          <div className="lg:mt-[25px]">
              <button className="w-full flex items-center justify-center gap-2 px-5 py-3.5 text-sm font-bold bg-[#00bd7f] text-white rounded-xl shadow-lg shadow-emerald-500/30 hover:shadow-xl hover:shadow-emerald-500/40 hover:scale-[1.02] transition-all">
              <Plus className="w-4 h-4" />
              Filter
            </button>
      </div>
        </div>
      </div>


        {/* Gradebook Entry Table */}
        <div className="bg-white rounded-[20px] border border-slate-200 shadow-sm overflow-hidden animate-in slide-in-from-bottom duration-700">
           <div className="p-6 md:p-10 border-b border-slate-50 bg-slate-50/20 flex flex-col sm:flex-row items-center justify-between gap-4">
              <h2 className="text-lg md:text-xl font-black text-slate-800 tracking-tight ">Marks Entry: Arabic Nahw (Sec A)</h2>
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
                    <tr className="border-b border-slate-50 text-[10px] font-black text-slate-400 uppercase tracking-widest whitespace-nowrap">
                       <th className="px-6 md:px-10 py-4 md:py-6 text-left">Student Identity</th>
                       <th className="px-6 md:px-10 py-4 md:py-6 text-center">Theory (70)</th>
                       <th className="px-6 md:px-10 py-4 md:py-6 text-center">Total Score</th>
                       <th className="px-6 md:px-10 py-4 md:py-6 text-right">Verification</th>
                    </tr>
                 </thead>
                 <tbody className="divide-y divide-slate-50">
                    {students.map((student) => {
                       const studentMarks = marks[student.id] || { theory: "", oral: "" };
                       const total = (Number(studentMarks.theory) || 0) + (Number(studentMarks.oral) || 0);
                       return (
                          <tr key={student.id} className="group hover:bg-slate-50/50 transition-all  whitespace-nowrap">
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
