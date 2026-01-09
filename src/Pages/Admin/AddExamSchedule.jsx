import { useState } from "react";
import { 
  Plus, 
  Trash2, 
  PlusCircle, 
  Calendar, 
  Clock, 
  MapPin, 
  BookOpen, 
  CheckCircle2, 
  ChevronLeft,
  Settings2,
  Save
} from "lucide-react";

const AddExamSchedule = () => {
  const [selectedTerm, setSelectedTerm] = useState("");
  const [selectedClass, setSelectedClass] = useState("");

  const [scheduleItems, setScheduleItems] = useState([
    { id: 1, subject: "", date: "", startTime: "", endTime: "", hall: "" }
  ]);

  const addRow = () => {
    setScheduleItems([...scheduleItems, { id: Date.now(), subject: "", date: "", startTime: "", endTime: "", hall: "" }]);
  };

  const removeRow = (id) => {
    if (scheduleItems.length > 1) {
      setScheduleItems(scheduleItems.filter(item => item.id !== id));
    }
  };

  return (
    <div className="space-y-8 animate-in fade-in duration-500 p-4 md:p-8">
      {/* Header */}
      <div className="bg-white rounded-[2.5rem] border-2 border-slate-200 p-8 flex flex-col md:flex-row justify-between items-center gap-6 shadow-sm">
        <div className="flex items-center gap-6">
          <div className="w-16 h-16 bg-[#e6f4ef] rounded-2xl flex items-center justify-center border-2 border-[#00bd7f]/20">
            <PlusCircle className="w-8 h-8 text-[#00bd7f]" />
          </div>
          <div>
            <h1 className="text-2xl md:text-3xl font-black text-slate-800">Assign Exam Timetable</h1>
            <p className="text-slate-500 font-bold mt-1">Create new examination schedules for student classes</p>
          </div>
        </div>

        <button className="flex items-center gap-2 py-4 px-6 text-slate-500 font-bold hover:text-[#00bd7f] transition-all">
          <ChevronLeft className="w-5 h-5" /> Back to List
        </button>
      </div>

      {/* Setup Form */}
      <div className="bg-white rounded-[2.5rem] border-2 border-slate-200 shadow-sm overflow-hidden">
        <div className="p-8 border-b-2 border-slate-50 bg-slate-50/30 flex flex-col md:flex-row gap-8 items-end">
           <div className="flex-1 space-y-3">
              <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">Academic Term</label>
              <select 
                value={selectedTerm}
                onChange={(e) => setSelectedTerm(e.target.value)}
                className="w-full bg-white border-2 border-slate-200 rounded-2xl px-6 py-4 text-sm font-bold focus:border-[#00bd7f] outline-none appearance-none"
              >
                 <option value="">Select Exam Term</option>
                 <option>First Term 2026</option>
                 <option>Mid Term 2026</option>
              </select>
           </div>
           <div className="flex-1 space-y-3">
              <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">Class</label>
              <select 
                value={selectedClass}
                onChange={(e) => setSelectedClass(e.target.value)}
                className="w-full bg-white border-2 border-slate-200 rounded-2xl px-6 py-4 text-sm font-bold focus:border-[#00bd7f] outline-none appearance-none"
              >
                 <option value="">Select Academic Class</option>
                 <option>Class 5</option>
                 <option>Class 6</option>
              </select>
           </div>
           <div className="w-full md:w-auto">
              <button className="w-full md:w-auto px-8 py-4 bg-slate-800 text-white rounded-2xl font-black shadow-xl shadow-slate-200 hover:scale-[1.02] active:scale-95 transition-all flex items-center justify-center gap-3">
                 <Settings2 className="w-5 h-5" /> Fetch Setup
              </button>
           </div>
        </div>

        {/* Dynamic Rows */}
        <div className="p-8 space-y-6">
           {scheduleItems.map((item, index) => (
             <div key={item.id} className="grid grid-cols-1 md:grid-cols-6 lg:grid-cols-12 gap-6 items-end pb-8 border-b border-slate-100 last:border-0 last:pb-0">
                <div className="md:col-span-2 lg:col-span-3 space-y-2">
                   <label className="text-[9px] font-black text-slate-400 uppercase flex items-center gap-2"><BookOpen className="w-3 h-3" /> Subject</label>
                   <select className="w-full bg-slate-50 border-2 border-slate-100 rounded-xl px-4 py-3 text-xs font-bold outline-none focus:border-[#00bd7f]">
                      <option>Select Subject</option>
                      <option>Arabic Grammar</option>
                      <option>Mathematics</option>
                   </select>
                </div>
                <div className="md:col-span-1 lg:col-span-2 space-y-2">
                   <label className="text-[9px] font-black text-slate-400 uppercase flex items-center gap-2"><Calendar className="w-3 h-3" /> Date</label>
                   <input type="date" className="w-full bg-slate-50 border-2 border-slate-100 rounded-xl px-4 py-3 text-xs font-bold outline-none focus:border-[#00bd7f]" />
                </div>
                <div className="md:col-span-1 lg:col-span-2 space-y-2">
                   <label className="text-[9px] font-black text-slate-400 uppercase flex items-center gap-2"><Clock className="w-3 h-3" /> Start Time</label>
                   <input type="time" className="w-full bg-slate-50 border-2 border-slate-100 rounded-xl px-4 py-3 text-xs font-bold outline-none focus:border-[#00bd7f]" />
                </div>
                <div className="md:col-span-1 lg:col-span-2 space-y-2">
                   <label className="text-[9px] font-black text-slate-400 uppercase flex items-center gap-2"><Clock className="w-3 h-3" /> End Time</label>
                   <input type="time" className="w-full bg-slate-50 border-2 border-slate-100 rounded-xl px-4 py-3 text-xs font-bold outline-none focus:border-[#00bd7f]" />
                </div>
                <div className="md:col-span-1 lg:col-span-2 space-y-2">
                   <label className="text-[9px] font-black text-slate-400 uppercase flex items-center gap-2"><MapPin className="w-3 h-3" /> Hall</label>
                   <select className="w-full bg-slate-50 border-2 border-slate-100 rounded-xl px-4 py-3 text-xs font-bold outline-none focus:border-[#00bd7f]">
                      <option>Select Hall</option>
                      <option>Auditorium</option>
                      <option>Room 101</option>
                   </select>
                </div>
                <div className="flex justify-end">
                   <button 
                     onClick={() => removeRow(item.id)}
                     className="p-3 bg-rose-50 text-rose-500 rounded-xl hover:bg-rose-100 transition-all border border-rose-100"
                   >
                      <Trash2 className="w-4 h-4" />
                   </button>
                </div>
             </div>
           ))}

           <div className="pt-8 flex flex-col md:flex-row justify-between items-center gap-6">
              <button 
                onClick={addRow}
                className="flex items-center gap-2 text-xs font-black text-[#00bd7f] uppercase tracking-widest px-6 py-3 border-2 border-[#00bd7f]/20 rounded-2xl hover:bg-emerald-50 transition-all"
              >
                <Plus className="w-4 h-4" /> Add Another Day
              </button>
              
              <div className="flex gap-4 w-full md:w-auto">
                 <button className="flex-1 md:flex-none px-12 py-4 bg-slate-100 text-slate-500 rounded-2xl font-black text-sm uppercase">Reset</button>
                 <button className="flex-1 md:flex-none px-12 py-4 bg-[#00bd7f] text-white rounded-2xl font-black text-sm uppercase shadow-xl shadow-emerald-200 hover:bg-emerald-600 transition-all flex items-center justify-center gap-3">
                    <Save className="w-5 h-5" /> Save Timetable
                 </button>
              </div>
           </div>
        </div>
      </div>
    </div>
  );
};

export default AddExamSchedule;
