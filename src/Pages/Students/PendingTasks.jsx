import { useState } from "react";
import { 
  PenTool, 
  Clock, 
  CheckCircle2, 
  AlertCircle, 
  ArrowRight, 
  Paperclip,
  Upload,
  BookOpen,
  Calendar,
  Zap,
  Star
} from "lucide-react";

const PendingTasks = () => {
  const [isSubmitting, setIsSubmitting] = useState(false);

  const tasks = [
    { 
      id: 1, 
      subject: "Arabic Nahw", 
      title: "Syntax of Surah Al-Kahf", 
      dueDate: "Jan 10, 2026", 
      status: "pending", 
      priority: "High",
      points: 20
    },
    { 
      id: 2, 
      subject: "Tajweed Rules", 
      title: "Makhraj of Heavy Letters", 
      dueDate: "Jan 12, 2026", 
      status: "pending", 
      priority: "Medium",
      points: 15
    },
    { 
      id: 3, 
      subject: "Fiqh Basics", 
      title: "Conditions of Pure Water", 
      dueDate: "Jan 08, 2026", 
      status: "overdue", 
      priority: "Critical",
      points: 25
    },
  ];

  return (
    <div className="min-h-screen bg-slate-50/50 p-4 md:p-8 animate-in fade-in duration-500">
      <div className="max-w-[1600px] mx-auto space-y-6 md:space-y-10">
        
        {/* Header */}
        <div className="bg-white rounded-[1.5rem] md:rounded-[3rem] p-6 md:p-10 border border-slate-200 shadow-sm flex flex-col lg:flex-row justify-between items-center gap-6">
          <div className="flex items-center gap-4 md:gap-8">
            <div className="w-12 h-12 md:w-20 md:h-20 bg-emerald-50 rounded-xl md:rounded-3xl flex items-center justify-center border border-emerald-100 shadow-inner shrink-0 text-emerald-600">
              <PenTool className="w-6 h-6 md:w-10 md:h-10" />
            </div>
            <div>
              <h1 className="text-xl md:text-3xl font-black text-slate-800 tracking-tight uppercase leading-none mb-1 md:mb-3">Homework Portal</h1>
              <p className="text-slate-500 font-bold mt-1 text-xs md:text-base">Active assignments and digital submission center for academic tasks</p>
            </div>
          </div>

          <div className="flex gap-4 w-full lg:w-auto">
             <div className="flex bg-slate-100 p-1.5 rounded-2xl md:rounded-[2rem] w-full lg:w-auto">
                <button className="flex-1 px-8 py-3 bg-white text-slate-900 rounded-xl md:rounded-3xl font-black text-[10px] uppercase tracking-widest shadow-lg">Pending (03)</button>
                <button className="flex-1 px-8 py-3 text-slate-400 font-black text-[10px] uppercase tracking-widest hover:text-slate-600 transition-all">Under Review</button>
             </div>
          </div>
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
           <div className="bg-slate-900 p-8 rounded-[2.5rem] text-white flex justify-between items-center relative overflow-hidden group shadow-2xl shadow-slate-200">
              <Zap className="absolute -right-4 -bottom-4 w-32 h-32 text-white/5 -rotate-12 group-hover:rotate-0 transition-transform duration-700" />
              <div>
                 <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-2">Completion rate</p>
                 <h2 className="text-3xl md:text-4xl font-black tracking-tight uppercase">82%</h2>
              </div>
              <div className="px-5 py-2 md:px-8 md:py-3 bg-white/10 rounded-2xl text-[10px] font-black uppercase tracking-widest border border-white/5 backdrop-blur-sm z-10">
                 Gold Badge
              </div>
           </div>
           
           <div className="bg-white p-8 rounded-[2.5rem] border border-slate-200 shadow-sm flex items-center gap-6 group hover:border-indigo-100 transition-all">
              <div className="w-14 h-14 bg-indigo-50 rounded-2xl flex items-center justify-center text-indigo-600 shadow-inner group-hover:scale-110 transition-transform">
                 <Calendar className="w-7 h-7" />
              </div>
              <div>
                 <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-1">Upcoming Deadline</p>
                 <h4 className="text-xl font-black text-slate-800 tracking-tight">Jan 10, 2026</h4>
              </div>
           </div>

           <div className="bg-white p-8 rounded-[2.5rem] border border-slate-200 shadow-sm flex items-center gap-6 group hover:border-emerald-100 transition-all">
              <div className="w-14 h-14 bg-emerald-50 rounded-2xl flex items-center justify-center text-emerald-600 shadow-inner group-hover:scale-110 transition-transform">
                 <Star className="w-7 h-7" />
              </div>
              <div>
                 <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-1">Total Reward Points</p>
                 <h4 className="text-xl font-black text-slate-800 tracking-tight">420 Points</h4>
              </div>
           </div>
        </div>

        {/* Task List */}
        <div className="bg-white rounded-[1.5rem] md:rounded-[3.5rem] border border-slate-200 shadow-sm overflow-hidden animate-in slide-in-from-bottom duration-700">
           <div className="p-8 md:p-12 border-b border-slate-50 flex flex-col sm:flex-row items-center justify-between gap-6 bg-slate-50/20">
              <h2 className="text-xl font-black text-slate-800 tracking-tight uppercase">Assigned Tasks: Session 2026</h2>
              <div className="flex gap-4">
                 <div className="flex items-center gap-2 text-[10px] font-black text-slate-400 uppercase tracking-widest">
                    <div className="w-2 h-2 bg-rose-500 rounded-full"></div> Overdue
                 </div>
                 <div className="flex items-center gap-2 text-[10px] font-black text-slate-400 uppercase tracking-widest">
                    <div className="w-2 h-2 bg-amber-500 rounded-full"></div> Expiring Soon
                 </div>
              </div>
           </div>

           <div className="divide-y divide-slate-50">
              {tasks.map((task) => (
                 <div key={task.id} className="p-8 md:p-12 group hover:bg-slate-50/50 transition-all">
                    <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-8">
                       <div className="flex flex-col md:flex-row md:items-center gap-8">
                          <div className={`w-20 h-20 rounded-[1.5rem] flex flex-col items-center justify-center shadow-sm border ${
                             task.status === 'overdue' ? 'bg-rose-50 border-rose-100 text-rose-600' : 'bg-slate-50 border-slate-100 text-slate-400'
                          } group-hover:bg-white transition-all`}>
                             <BookOpen className="w-8 h-8" />
                          </div>
                          <div>
                             <div className="flex flex-wrap items-center gap-3 mb-3">
                                <span className="px-3 py-1 bg-white border border-slate-100 rounded-lg text-[9px] font-black text-indigo-500 uppercase tracking-widest">{task.subject}</span>
                                <span className={`px-3 py-1 bg-white border border-slate-100 rounded-lg text-[9px] font-black uppercase tracking-widest ${
                                   task.priority === 'Critical' ? 'text-rose-600' : 'text-slate-400'
                                }`}>{task.priority} Priority</span>
                             </div>
                             <h3 className="text-xl md:text-2xl font-black text-slate-800 uppercase tracking-tight mb-2 group-hover:text-indigo-600 transition-colors">{task.title}</h3>
                             <div className="flex items-center gap-6 text-[10px] font-black text-slate-400 uppercase tracking-widest">
                                <span className="flex items-center gap-2"><Clock className="w-3.5 h-3.5" /> Due: {task.dueDate}</span>
                                <span className="flex items-center gap-2"><Star className="w-3.5 h-3.5 text-amber-500" /> Reward: {task.points} Pts</span>
                             </div>
                          </div>
                       </div>

                       <div className="flex flex-wrap items-center gap-4 lg:justify-end">
                          <button 
                             onClick={() => setIsSubmitting(true)}
                             className={`min-w-[180px] px-8 py-5 rounded-[1.5rem] md:rounded-3xl font-black text-[10px] uppercase tracking-widest transition-all flex items-center justify-center gap-3 shadow-xl ${
                                task.status === 'overdue' 
                                ? 'bg-rose-600 text-white hover:bg-rose-500 shadow-rose-100' 
                                : 'bg-slate-900 text-white hover:bg-slate-800 shadow-slate-200'
                             }`}
                          >
                             <Upload className="w-4 h-4" /> Final Submission
                          </button>
                       </div>
                    </div>
                 </div>
              ))}
           </div>
        </div>

      </div>

      {/* Submission Portal Overlay */}
      {isSubmitting && (
         <div className="fixed inset-0 z-[200] flex items-center justify-center p-4">
            <div className="absolute inset-0 bg-slate-900/40 backdrop-blur-md" onClick={() => setIsSubmitting(false)}></div>
            <div className="bg-white w-full max-w-2xl rounded-[3.5rem] p-10 md:p-14 relative z-10 animate-in slide-in-from-bottom duration-500 shadow-2xl">
               <div className="flex justify-between items-start mb-10">
                  <div className="flex items-center gap-6">
                     <div className="w-16 h-16 bg-slate-900 rounded-3xl flex items-center justify-center text-white shadow-xl shadow-slate-200 shrink-0">
                        <Paperclip className="w-8 h-8" />
                     </div>
                     <div>
                        <h3 className="text-2xl font-black text-slate-800 uppercase tracking-tight leading-none mb-2">Digital Submission</h3>
                        <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Submit resources for: Syntax of Surah Al-Kahf</p>
                     </div>
                  </div>
                  <button onClick={() => setIsSubmitting(false)} className="p-3 bg-slate-50 rounded-xl hover:bg-slate-100 transition-colors">
                     <AlertCircle className="w-5 h-5 text-slate-300" />
                  </button>
               </div>

               <div className="space-y-8">
                  <div className="bg-slate-50 border-2 border-dashed border-slate-200 rounded-[2rem] p-12 text-center group hover:bg-white hover:border-slate-400 transition-all cursor-pointer">
                     <Upload className="w-12 h-12 text-slate-300 mx-auto mb-6 group-hover:scale-110 transition-transform" />
                     <p className="text-base font-black text-slate-800 uppercase tracking-tight mb-2">Drag files here or click to browse</p>
                     <p className="text-[9px] font-bold text-slate-400 uppercase tracking-[2px]">PDF, DOCX, JPG (MAX 10MB)</p>
                  </div>

                  <div className="space-y-4">
                     <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest block ml-2">Quick Note to Faculty</label>
                     <textarea 
                        className="w-full bg-slate-50 border border-slate-200 rounded-3xl p-6 text-sm font-bold outline-none focus:border-slate-800 transition-all min-h-[120px]" 
                        placeholder="Explain your approach or attach extra references..."
                     ></textarea>
                  </div>

                  <div className="flex gap-4">
                     <button className="flex-1 py-5 bg-slate-100 text-slate-400 font-black text-[11px] uppercase tracking-widest rounded-3xl hover:bg-slate-200 hover:text-slate-600 transition-all" onClick={() => setIsSubmitting(false)}>
                        Discard
                     </button>
                     <button className="flex-[2] py-5 bg-slate-900 text-white font-black text-[11px] uppercase tracking-widest rounded-3xl hover:bg-slate-800 transition-all shadow-xl shadow-slate-200 flex items-center justify-center gap-3">
                        <CheckCircle2 className="w-5 h-5" /> Confirm Submission
                     </button>
                  </div>
               </div>
            </div>
         </div>
      )}
    </div>
  );
};

export default PendingTasks;
