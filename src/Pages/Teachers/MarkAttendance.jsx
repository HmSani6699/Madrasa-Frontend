import { useState } from "react";
import { 
  UserCheck, 
  Search, 
  Filter, 
  CheckCircle2, 
  XCircle, 
  Clock, 
  Calendar, 
  ChevronDown,
  Users,
  Save,
  RotateCcw,
  X,
  FileCheck,
  MoreVertical,
  AlertCircle
} from "lucide-react";

const MarkAttendance = () => {
  const [attendance, setAttendance] = useState({});
  const [searchQuery, setSearchQuery] = useState("");
  const [showConfirm, setShowConfirm] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);

  const students = [
    { id: 101, name: "Abdullah Al Mamun", roll: 1, avatar: "AM" },
    { id: 102, name: "Zaid Bin Harith", roll: 2, avatar: "ZH" },
    { id: 103, name: "Omar Faruk", roll: 3, avatar: "OF" },
    { id: 104, name: "Saeed Mohsen", roll: 4, avatar: "SM" },
    { id: 105, name: "Hamza Bin Abdul Mutattalib", roll: 5, avatar: "HB" },
    { id: 106, name: "Usman Ghani", roll: 6, avatar: "UG" },
    { id: 107, name: "Ali Ibn Abi Talib", roll: 7, avatar: "AT" },
  ];

  const handleStatusChange = (studentId, status) => {
    setAttendance(prev => ({ ...prev, [studentId]: status }));
  };

  const handleBatchAction = (status) => {
    const newAttendance = {};
    students.forEach(s => {
      newAttendance[s.id] = status;
    });
    setAttendance(newAttendance);
  };

  const handleFinalSubmit = () => {
    setShowConfirm(false);
    setIsSubmitting(true);
    // Simulate API delay
    setTimeout(() => {
       setIsSubmitting(false);
       setIsSuccess(true);
       setTimeout(() => setIsSuccess(false), 3000);
    }, 2000);
  };

  const filteredStudents = students.filter(s => 
    s.name.toLowerCase().includes(searchQuery.toLowerCase()) || 
    s.roll.toString().includes(searchQuery)
  );

  const presentCount = Object.values(attendance).filter(v => v === 'present').length;
  const absentCount = Object.values(attendance).filter(v => v === 'absent').length;
  const lateCount = Object.values(attendance).filter(v => v === 'late').length;

  return (
    <div className="min-h-screen bg-slate-50/50 p-4 md:p-8 animate-in fade-in duration-500">
      <div className="max-w-[1600px] mx-auto space-y-6 md:space-y-8 pb-32">
        
        {/* Header */}
        <div className="bg-white rounded-[20px] border border-slate-200 p-4 md:p-5 shadow-sm flex flex-col xl:flex-row justify-between items-center gap-6">
          <div className="flex items-center gap-4 md:gap-5">
            <div className="w-12 h-12 md:w-16 md:h-16 bg-emerald-50 rounded-[20px]  flex items-center justify-center border border-emerald-100 shadow-inner shrink-0 leading-none">
              <UserCheck className="w-6 h-6 md:w-10 md:h-10 text-emerald-600" />
            </div>
            <div>
              <h1 className="text-xl md:text-[20px] font-black text-slate-800 tracking-tight uppercase leading-none mb-2 md:mb-3">Student Attendance</h1>
              <div className="flex flex-wrap items-center gap-3 md:gap-6">
                 <div className="flex items-center gap-2 px-3 py-1 bg-slate-100 rounded-full text-[10px] font-black text-slate-400 uppercase tracking-widest border border-slate-200">
                    <Users className="w-3 h-3" /> Hifz - Section A
                 </div>
                 <div className="flex items-center gap-2 px-3 py-1 bg-indigo-50 rounded-full text-[10px] font-black text-indigo-600 uppercase tracking-widest border border-indigo-100">
                    <Calendar className="w-3 h-3" /> Jan 09, 2026
                 </div>
              </div>
            </div>
          </div>

        
        </div>

        {/* Filters and Search */}
        <div className="bg-white rounded-[20px] border border-slate-200 p-6 md:p-8 shadow-sm flex flex-col md:flex-row justify-between items-center gap-6">
           <div className="relative w-full md:w-[400px]  bg-[#e6f4ef]">
              <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-300" />
              <input 
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full bg-slate-50 border border-slate-100 rounded-xl md:rounded-2xl pl-10 pr-6 py-3 md:py-4 text-sm font-bold focus:border-emerald-500 outline-none transition-all  bg-[#e6f4ef]" 
                placeholder="Find student by name or roll..." 
              />
           </div>
           
           <div className="flex items-center gap-3 w-full md:w-auto">
              <button 
                onClick={() => handleBatchAction('present')}
                className="flex-1 md:flex-none px-6 py-3.5 bg-emerald-500 text-white rounded-[8px] font-black text-[10px] uppercase tracking-widest transition-all border border-emerald-100"
              >
                 Mark All Present
              </button>
              <button 
                onClick={() => setAttendance({})}
                className="p-3.5 md:p-4 bg-slate-50 text-slate-400 rounded-xl md:rounded-2xl hover:bg-rose-50 hover:text-rose-600 transition-all border border-slate-100"
                title="Reset Selection"
              >
                 <RotateCcw className="w-5 h-5" />
              </button>
           </div>
        </div>

        {/* Attendance Cards Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6 md:gap-8">
           {filteredStudents.map((student) => (
             <div key={student.id} className="bg-white rounded-[20px] p-5 md:p-5 border border-slate-200 shadow-sm transition-all hover:border-emerald-200 group relative overflow-hidden">
                <div className={`absolute top-0 right-0 w-2 h-full transition-all ${
                   attendance[student.id] === 'present' ? 'bg-emerald-500' : 
                   attendance[student.id] === 'absent' ? 'bg-rose-500' : 
                   attendance[student.id] === 'late' ? 'bg-amber-500' : 'bg-transparent'
                }`}></div>

                <div className="flex items-center gap-4 md:gap-6 mb-8">
                   <div className="w-12 h-12 md:w-16 md:h-16 bg-slate-100 rounded-xl md:rounded-3xl flex items-center justify-center font-black text-slate-400 text-lg md:text-xl border-4 border-white shadow-lg group-hover:scale-110 transition-transform uppercase shrink-0">
                      {student.avatar}
                   </div>
                   <div className="min-w-0">
                      <h4 className="text-base md:text-lg font-black text-slate-800 uppercase tracking-tight leading-none mb-1 md:mb-2 truncate">{student.name}</h4>
                      <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest font-mono">Roll: {student.roll} | ID: {student.id}</p>
                   </div>
                </div>

                <div className="grid grid-cols-3 gap-2 md:gap-3">
                   <button 
                     onClick={() => handleStatusChange(student.id, 'present')}
                     className={`flex flex-col items-center gap-2 py-3 md:py-4 rounded-xl md:rounded-2xl border transition-all ${
                       attendance[student.id] === 'present' 
                         ? 'bg-emerald-500 text-white border-emerald-600 shadow-lg shadow-emerald-100' 
                         : 'bg-slate-50 text-slate-400 border-slate-50 hover:bg-emerald-50 hover:text-emerald-600 hover:border-emerald-100'
                     }`}
                   >
                      <CheckCircle2 className="w-4 h-4 md:w-5 md:h-5" />
                      <span className="text-[9px] font-black uppercase tracking-widest">Present</span>
                   </button>
                   <button 
                     onClick={() => handleStatusChange(student.id, 'absent')}
                     className={`flex flex-col items-center gap-2 py-3 md:py-4 rounded-xl md:rounded-2xl border transition-all ${
                       attendance[student.id] === 'absent' 
                         ? 'bg-rose-500 text-white border-rose-600 shadow-lg shadow-rose-100' 
                         : 'bg-slate-50 text-slate-400 border-slate-50 hover:bg-rose-50 hover:text-rose-600 hover:border-rose-100'
                     }`}
                   >
                      <XCircle className="w-4 h-4 md:w-5 md:h-5" />
                      <span className="text-[9px] font-black uppercase tracking-widest">Absent</span>
                   </button>
                   <button 
                     onClick={() => handleStatusChange(student.id, 'late')}
                     className={`flex flex-col items-center gap-2 py-3 md:py-4 rounded-xl md:rounded-2xl border transition-all ${
                       attendance[student.id] === 'late' 
                         ? 'bg-amber-500 text-white border-amber-600 shadow-lg shadow-amber-100' 
                         : 'bg-slate-50 text-slate-400 border-slate-50 hover:bg-amber-50 hover:text-amber-600 hover:border-amber-100'
                     }`}
                   >
                      <Clock className="w-4 h-4 md:w-5 md:h-5" />
                      <span className="text-[9px] font-black uppercase tracking-widest">Late</span>
                   </button>
                </div>
             </div>
           ))}
        </div>

        {/* Global Summary & Quick Submission Bar */}
        <div className="fixed bottom-6 left-4 right-4 md:left-8 md:right-8 lg:left-[calc(300px+2rem)] lg:right-8 z-40">
           <div className="bg-slate-900 rounded-[20px] p-4 md:p-6 lg:p-8 text-white shadow-2xl flex flex-col sm:flex-row justify-between items-center gap-6 border border-white/10 backdrop-blur-xl relative overflow-hidden group">
              <div className="absolute top-0 right-0 w-64 h-full bg-emerald-500/10 rounded-bl-[5rem] -mr-10 -mt-10 blur-3xl group-hover:bg-emerald-500/20 transition-all duration-1000"></div>
              
              <div className="flex items-center gap-6 md:gap-12 relative z-10">
                 <div className="hidden sm:block">
                    <p className="text-[10px] font-black text-slate-500 uppercase tracking-widest mb-1.5">Class Overview</p>
                    <p className="text-sm font-black uppercase tracking-tight">Hifz Section A</p>
                 </div>
                 <div className="flex gap-6 md:gap-10">
                    <div className="text-center sm:text-left">
                       <p className="text-[10px] font-black text-emerald-400 uppercase tracking-widest mb-1">Present</p>
                       <h4 className="text-xl md:text-2xl font-black">{presentCount}</h4>
                    </div>
                    <div className="text-center sm:text-left">
                       <p className="text-[10px] font-black text-rose-400 uppercase tracking-widest mb-1">Absent</p>
                       <h4 className="text-xl md:text-2xl font-black">{absentCount}</h4>
                    </div>
                    <div className="text-center sm:text-left">
                       <p className="text-[10px] font-black text-amber-400 uppercase tracking-widest mb-1">Late</p>
                       <h4 className="text-xl md:text-2xl font-black">{lateCount}</h4>
                    </div>
                 </div>
              </div>

              <div className="flex gap-4 w-full sm:w-auto relative z-10">
                 <button 
                  onClick={() => setShowConfirm(true)}
                  disabled={Object.keys(attendance).length === 0}
                  className="flex-1 sm:flex-none px-10 py-4 bg-emerald-500 text-white rounded-2xl font-black text-[10px] md:text-[11px] uppercase tracking-[2px] hover:bg-emerald-600 transition-all shadow-xl shadow-emerald-500/20 hover:scale-[1.05] active:scale-95 disabled:opacity-50 disabled:grayscale disabled:scale-100"
                 >
                    Confirm Submission
                 </button>
              </div>
           </div>
        </div>

      </div>

      {/* Confirmation Modal */}
      {showConfirm && (
         <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
            <div 
               className="absolute inset-0 bg-slate-900/60 backdrop-blur-md animate-in fade-in duration-300"
               onClick={() => setShowConfirm(false)}
            ></div>
            <div className="bg-white w-full max-w-md rounded-[2.5rem] md:rounded-[3rem] shadow-2xl relative z-10 overflow-hidden animate-in zoom-in-95 duration-300">
               <div className="p-8 md:p-12 text-center">
                  <div className="w-20 h-20 bg-emerald-50 rounded-[2.5rem] flex items-center justify-center mx-auto mb-8 border border-emerald-100 shadow-inner">
                     <FileCheck className="w-10 h-10 text-emerald-600" />
                  </div>
                  <h3 className="text-2xl font-black text-slate-800 uppercase tracking-tight mb-4 leading-none">Complete Roll Call?</h3>
                  <p className="text-sm font-bold text-slate-500 leading-relaxed mb-10 px-4">
                     Confirming will sync today's attendance for <span className="text-slate-800 font-black uppercase">Hifz A</span> with the institutional records.
                  </p>
                  
                  <div className="flex flex-col gap-3">
                     <button 
                        onClick={handleFinalSubmit}
                        className="w-full py-5 bg-emerald-600 text-white rounded-3xl font-black text-[11px] uppercase tracking-widest shadow-xl shadow-emerald-100 hover:bg-emerald-700 transition-all active:scale-95"
                     >
                        Sync Records Now
                     </button>
                     <button 
                         onClick={() => setShowConfirm(false)}
                        className="w-full py-5 bg-slate-50 text-slate-400 rounded-3xl font-black text-[11px] uppercase tracking-widest hover:bg-slate-100 transition-all font-bold"
                     >
                        Return to List
                     </button>
                  </div>
               </div>
            </div>
         </div>
      )}

      {/* Success Notification */}
      {isSuccess && (
         <div className="fixed top-10 left-1/2 -translate-x-1/2 z-[200] animate-in slide-in-from-top duration-500">
            <div className="bg-slate-900 text-white px-10 py-5 rounded-[2rem] shadow-2xl flex items-center gap-6 border border-white/10 backdrop-blur-2xl">
               <div className="w-10 h-10 bg-emerald-500 rounded-2xl flex items-center justify-center shadow-lg shadow-emerald-500/40">
                  <CheckCircle2 className="w-6 h-6 text-white" />
               </div>
               <div className="text-left">
                  <p className="text-[10px] font-black uppercase tracking-widest text-emerald-400 mb-0.5">Success</p>
                  <p className="text-xs font-black uppercase tracking-tight">Attendance Synced Successfully</p>
               </div>
            </div>
         </div>
      )}
    </div>
  );
};

export default MarkAttendance;
