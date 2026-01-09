import { useState } from "react";
import { 
  Plus, 
  Search, 
  BookOpen, 
  Filter, 
  Calendar, 
  Clock, 
  FileText, 
  MoreVertical, 
  Edit3, 
  Trash2, 
  ExternalLink,
  CheckCircle2,
  AlertCircle
} from "lucide-react";

const HomeworkList = () => {
  const [searchTerm, setSearchTerm] = useState("");
  const [isModalOpen, setIsModalOpen] = useState(false);

  // Sample Data: Homework Assignments
  const [homeworks, setHomeworks] = useState([
    { 
      id: 1, 
      title: "Arabic Grammar - Surah Fatiha Analysis", 
      class: "Class 5", 
      subject: "Arabic Grammar", 
      assignedDate: "2026-01-05", 
      dueDate: "2026-01-10", 
      status: "active",
      submissions: 32,
      totalStudents: 45
    },
    { 
      id: 2, 
      title: "Mathematics - Algebraic Fractions", 
      class: "Class 6", 
      subject: "Mathematics", 
      assignedDate: "2026-01-06", 
      dueDate: "2026-01-12", 
      status: "active",
      submissions: 15,
      totalStudents: 38
    },
    { 
      id: 3, 
      title: "Fiqh - Ablution (Wudu) Procedures", 
      class: "Class 4", 
      subject: "Fiqh", 
      assignedDate: "2025-12-28", 
      dueDate: "2026-01-03", 
      status: "expired",
      submissions: 22,
      totalStudents: 22
    },
  ]);

  return (
    <div className="space-y-8 animate-in fade-in duration-500 p-4 md:p-8">
      {/* Header */}
      <div className="bg-white rounded-[2.5rem] border-2 border-slate-200 p-8 flex flex-col md:flex-row justify-between items-center gap-6 shadow-sm">
        <div className="flex items-center gap-6">
          <div className="w-16 h-16 bg-indigo-50 rounded-2xl flex items-center justify-center border-2 border-indigo-100">
            <BookOpen className="w-8 h-8 text-indigo-600" />
          </div>
          <div>
            <h1 className="text-2xl md:text-3xl font-black text-slate-800">Homework Management</h1>
            <p className="text-slate-500 font-bold mt-1">Assign and track student academic tasks</p>
          </div>
        </div>

        <button 
          onClick={() => setIsModalOpen(true)}
          className="w-full md:w-auto px-8 py-4 bg-indigo-600 text-white rounded-2xl font-black shadow-xl shadow-indigo-200 hover:bg-indigo-700 hover:scale-[1.02] active:scale-95 transition-all flex items-center justify-center gap-3"
        >
          <Plus className="w-5 h-5" />
          Create Homework
        </button>
      </div>

      {/* Filters */}
      <div className="bg-white p-6 rounded-[2rem] border-2 border-slate-200 shadow-sm flex flex-col md:flex-row gap-4 items-center">
        <div className="relative flex-1 w-full">
          <Search className="absolute left-6 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-300" />
          <input 
            placeholder="Search by title or subject..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-14 pr-4 py-4 bg-slate-50 border-2 border-slate-100 rounded-2xl text-sm font-bold text-slate-800 outline-none focus:border-indigo-500 transition-all"
          />
        </div>
        <div className="flex gap-4 w-full md:w-auto">
          <select className="flex-1 md:w-40 bg-slate-50 border-2 border-slate-100 rounded-2xl px-6 py-4 text-sm font-bold outline-none focus:border-indigo-500 appearance-none">
            <option>All Classes</option>
            <option>Class 5</option>
            <option>Class 6</option>
          </select>
          <button className="p-4 bg-slate-50 border-2 border-slate-100 rounded-2xl text-slate-400 hover:text-indigo-600 hover:border-indigo-100 transition-all">
            <Filter className="w-6 h-6" />
          </button>
        </div>
      </div>

      {/* Homework Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
        {homeworks.map((hw) => (
          <div key={hw.id} className="group bg-white rounded-[2.5rem] border-2 border-slate-100 shadow-sm hover:shadow-xl hover:border-indigo-500/20 transition-all duration-300 flex flex-col">
            <div className="p-8 space-y-6">
              <div className="flex justify-between items-start">
                <div className={`px-4 py-1 rounded-full text-[10px] font-black uppercase tracking-widest border-2 ${
                  hw.status === 'active' ? 'bg-emerald-50 text-emerald-600 border-emerald-100' : 'bg-slate-50 text-slate-400 border-slate-100'
                }`}>
                  {hw.status}
                </div>
                <button className="p-2 hover:bg-slate-50 rounded-xl text-slate-300 hover:text-slate-600 transition-all">
                  <MoreVertical className="w-5 h-5" />
                </button>
              </div>

              <div>
                <h3 className="text-xl font-black text-slate-800 leading-tight group-hover:text-indigo-600 transition-colors cursor-pointer">{hw.title}</h3>
                <div className="mt-3 flex items-center gap-2 text-xs font-black text-slate-400 uppercase tracking-tighter">
                   <span className="text-indigo-500 bg-indigo-50 px-2 py-0.5 rounded-lg border border-indigo-100">{hw.class}</span>
                   <span className="mx-1">•</span>
                   <span>{hw.subject}</span>
                </div>
              </div>

              <div className="space-y-3">
                <div className="flex items-center justify-between text-xs font-bold text-slate-500">
                  <div className="flex items-center gap-2"><Calendar className="w-4 h-4 text-slate-300" /> Assigned</div>
                  <span>{new Date(hw.assignedDate).toLocaleDateString()}</span>
                </div>
                <div className="flex items-center justify-between text-xs font-bold text-slate-500">
                  <div className="flex items-center gap-2"><Clock className="w-4 h-4 text-slate-300" /> Deadline</div>
                  <span className={hw.status === 'expired' ? 'text-rose-500 underline' : ''}>{new Date(hw.dueDate).toLocaleDateString()}</span>
                </div>
              </div>

              {/* Submission Progress */}
              <div className="pt-4 border-t-2 border-slate-50 border-dashed">
                 <div className="flex justify-between items-end mb-2">
                    <span className="text-[10px] font-black text-slate-400 uppercase">Submissions</span>
                    <span className="text-sm font-black text-slate-700">{hw.submissions}/{hw.totalStudents}</span>
                 </div>
                 <div className="h-2 w-full bg-slate-100 rounded-full overflow-hidden">
                    <div 
                      className={`h-full transition-all duration-1000 ${hw.status === 'active' ? 'bg-indigo-500' : 'bg-slate-300'}`} 
                      style={{ width: `${(hw.submissions / hw.totalStudents) * 100}%` }} 
                    />
                 </div>
              </div>
            </div>

            <div className="mt-auto p-6 bg-slate-50/50 flex gap-3 border-t-2 border-slate-50 rounded-b-[2.5rem]">
               <button className="flex-1 py-3 bg-white border-2 border-slate-200 text-slate-600 rounded-2xl text-[10px] font-black uppercase tracking-widest hover:border-indigo-200 hover:text-indigo-600 transition-all shadow-sm flex items-center justify-center gap-2">
                 <Edit3 className="w-3.5 h-3.5" /> Edit
               </button>
               <button className="flex-1 py-3 bg-indigo-600 text-white rounded-2xl text-[10px] font-black uppercase tracking-widest hover:bg-indigo-700 transition-all shadow-lg shadow-indigo-100 flex items-center justify-center gap-2">
                 <ExternalLink className="w-3.5 h-3.5" /> Evaluate
               </button>
            </div>
          </div>
        ))}

        {/* Add Card */}
        <button 
          onClick={() => setIsModalOpen(true)}
          className="bg-indigo-50/20 rounded-[2.5rem] border-4 border-dashed border-indigo-100 flex flex-col items-center justify-center p-12 hover:border-indigo-300 hover:bg-indigo-50/50 transition-all group min-h-[400px]"
        >
          <div className="w-16 h-16 bg-white rounded-2xl flex items-center justify-center shadow-lg group-hover:scale-110 transition-transform mb-4 border-2 border-indigo-100">
            <Plus className="w-8 h-8 text-indigo-300 group-hover:text-indigo-600" />
          </div>
          <p className="text-lg font-black text-indigo-400 group-hover:text-indigo-600">Post New Homework</p>
        </button>
      </div>

      {/* Simplified Create Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-sm z-[100] flex items-center justify-center p-4">
           <div className="bg-white rounded-[3rem] w-full max-w-2xl shadow-2xl animate-in zoom-in duration-300 overflow-hidden">
              <div className="p-10 border-b-2 border-slate-50 flex items-center justify-between bg-indigo-50/30">
                 <div>
                    <h2 className="text-3xl font-black text-slate-800">Assign Homework</h2>
                    <p className="text-indigo-500 font-bold text-sm mt-1">Create a new academic task for your students</p>
                 </div>
                 <button onClick={() => setIsModalOpen(false)} className="p-3 hover:bg-white rounded-2xl shadow-sm transition-all">
                    <Plus className="w-8 h-8 text-slate-300 rotate-45" />
                 </button>
              </div>
              <div className="p-10 space-y-8">
                 <div className="space-y-3">
                    <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">Homework Title</label>
                    <input className="w-full bg-slate-50 border-2 border-slate-100 rounded-2xl px-8 py-5 text-sm font-bold focus:border-indigo-500 outline-none transition-all" placeholder="e.g. Chapter 4 Exercises" />
                 </div>
                 
                 <div className="grid grid-cols-2 gap-8">
                    <div className="space-y-3">
                        <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">Class</label>
                        <select className="w-full bg-slate-50 border-2 border-slate-100 rounded-2xl px-6 py-4 text-sm font-bold focus:border-indigo-500 outline-none appearance-none">
                            <option>Class 5</option>
                            <option>Class 6</option>
                        </select>
                    </div>
                    <div className="space-y-3">
                        <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">Subject</label>
                        <select className="w-full bg-slate-50 border-2 border-slate-100 rounded-2xl px-6 py-4 text-sm font-bold focus:border-indigo-500 outline-none appearance-none">
                            <option>Arabic Grammar</option>
                            <option>Mathematics</option>
                        </select>
                    </div>
                    <div className="space-y-3">
                        <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">Submission Deadline</label>
                        <input type="date" className="w-full bg-slate-50 border-2 border-slate-100 rounded-2xl px-6 py-4 text-sm font-bold focus:border-indigo-500 outline-none" />
                    </div>
                    <div className="space-y-3">
                        <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">Max Marks</label>
                        <input type="number" className="w-full bg-slate-50 border-2 border-slate-100 rounded-2xl px-6 py-4 text-sm font-bold focus:border-indigo-500 outline-none" placeholder="100" />
                    </div>
                 </div>

                 <div className="pt-6 flex gap-6">
                    <button onClick={() => setIsModalOpen(false)} className="flex-1 py-5 text-slate-500 font-black text-sm uppercase tracking-widest hover:bg-slate-50 rounded-2xl transition-all">Discard</button>
                    <button onClick={() => setIsModalOpen(false)} className="flex-1 py-5 bg-indigo-600 text-white font-black text-sm uppercase tracking-widest rounded-2xl shadow-2xl shadow-indigo-200 hover:bg-indigo-700 transition-all">Post Assignment</button>
                 </div>
              </div>
           </div>
        </div>
      )}
    </div>
  );
};

export default HomeworkList;
