import { useState } from "react";
import { 
  BookOpen, 
  Plus, 
  Search, 
  Filter, 
  Calendar, 
  FileText, 
  CheckCircle2, 
  Clock, 
  MoreVertical,
  ChevronDown,
  Users,
  Eye,
  Trash2,
  X,
  Paperclip
} from "lucide-react";
import SelectInputField from "../../components/SelectInputField";
import InputField from "../../components/InputField";

const HomeworkManager = () => {
  const [activeTab, setActiveTab] = useState("list");
  const [showModal, setShowModal] = useState(false);

  const homeworks = [
    { id: 1, title: "Arabic Grammar - Verb Conjugation", class: "Hifz - Sec A", assigned: "Jan 07", due: "Jan 10", submissions: 28, total: 32, status: "ongoing" },
    { id: 2, title: "History of Prophets - Paper 01", class: "Mishkat - Sec B", assigned: "Jan 05", due: "Jan 08", submissions: 32, total: 32, status: "completed" },
    { id: 3, title: "Fiqh Principles - Introduction", class: "Hifz - Sec A", assigned: "Jan 09", due: "Jan 12", submissions: 0, total: 32, status: "draft" },
  ];

  return (
    <div className="min-h-screen bg-slate-50/50 p-4 md:p-5 animate-in fade-in duration-500">
      <div className="max-w-[1600px] mx-auto space-y-8">
        
        {/* Header */}
        <div className="bg-white rounded-[20px] border border-slate-200 p-5 md:p-5 shadow-sm flex flex-col lg:flex-row justify-between items-center gap-6">
          <div className="flex items-center gap-4 md:gap-6">
            <div className="w-12 h-12 md:w-16 md:h-16 bg-blue-50 rounded-xl md:rounded-2xl flex items-center justify-center border border-blue-100 shadow-inner shrink-0">
              <BookOpen className="w-6 h-6 md:w-8 md:h-8 text-blue-600" />
            </div>
            <div>
              <h1 className="text-xl md:text-3xl font-black text-slate-800 tracking-tight text-uppercase">Homework Manager</h1>
            
            </div>
          </div>

          <div className="flex gap-4 w-full lg:w-auto mt-4 lg:mt-0">
            <button 
               onClick={() => setShowModal(true)}
               className="flex-1 lg:flex-none px-6 md:px-10 py-3.5 md:py-4 bg-[#00bd7f] text-white rounded-[8px] font-black shadow-xl shadow-blue-100 hover:scale-[1.02] active:scale-95 transition-all flex items-center justify-center gap-3 uppercase tracking-widest text-[10px] md:text-[11px]"
            >
              <Plus className="w-4 h-4 md:w-5 md:h-5" />
              Add Home Work
            </button>
          </div>
        </div>

         {/* Filters Area */}
      <div className="bg-white rounded-3xl border-2 border-slate-200 p-4 sm:p-6 md:p-8 shadow-sm">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
            <SelectInputField title={'Class'} options={[{value:"Class One"},{value:"Class Two"},{value:"Class Three"}]}/>
                 <SelectInputField title={'Subject'} options={[{ value: "A" }, { value: "B" }, { value: "C" }]} />
                 <InputField title={'Date'} type={'date'}/>
         
          <div className="lg:mt-[25px]">
              <button className="w-full flex items-center justify-center gap-2 px-5 py-3.5 text-sm font-bold bg-[#00bd7f] text-white rounded-xl shadow-lg shadow-emerald-500/30 hover:shadow-xl hover:shadow-emerald-500/40 hover:scale-[1.02] transition-all">
              <Plus className="w-4 h-4" />
              Filter
            </button>
      </div>
        </div>
      </div>

        {/* Homework List Table */}
        <div className="bg-white rounded-[20px] border border-slate-200 shadow-sm overflow-hidden animate-in slide-in-from-bottom duration-700">
           <div className="p-5 md:p-5 border-b border-slate-50 bg-slate-50/20 flex flex-col sm:flex-row items-center justify-between gap-4">
              <h2 className="text-lg md:text-xl font-black text-slate-800 tracking-tight uppercase tracking-widest">Active Assignments</h2>
              <div className="flex items-center gap-3 text-[10px] font-black text-slate-400 uppercase tracking-widest bg-white px-4 py-2 rounded-full border border-slate-100">
                 <Clock className="w-3 h-3" /> Updated 2m Ago
              </div>
           </div>

           <div className="overflow-x-auto">
              <table className="w-full border-collapse min-w-[800px]">
                 <thead>
                    <tr className="border-b border-slate-50 text-[10px] font-black text-slate-400 uppercase tracking-widest whitespace-nowrap">
                       <th className="px-6 md:px-10 py-3 md:py-3 text-left">Assignment Details</th>
                       <th className="px-6 md:px-10 py-3 md:py-3 text-left">Class / Section</th>
                       <th className="px-6 md:px-10 py-3 md:py-3 text-center">Dates</th>
                       <th className="px-6 md:px-10 py-3 md:py-3 text-center">Submissions</th>
                       <th className="px-6 md:px-10 py-3 md:py-3 text-center">Status</th>
                       <th className="px-6 md:px-10 py-3 md:py-3 text-right">Actions</th>
                    </tr>
                 </thead>
                 <tbody className="divide-y divide-slate-50">
                    {homeworks.map((hw) => (
                       <tr key={hw.id} className="group hover:bg-slate-50/50 transition-all whitespace-nowrap">
                          <td className="px-6 md:px-10 py-3 md:py-3">
                             <div className="flex items-center gap-4">
                                <div className="w-10 h-10 md:w-12 md:h-12 bg-slate-100 rounded-xl md:rounded-2xl flex items-center justify-center shadow-inner group-hover:scale-110 transition-transform">
                                   <FileText className="w-5 h-5 md:w-6 md:h-6 text-slate-400" />
                                </div>
                                <div>
                                   <p className="text-xs md:text-sm font-black text-slate-800 uppercase tracking-tight">{hw.title}</p>
                                   <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Reference: #HW-{hw.id}820</p>
                                </div>
                             </div>
                          </td>
                          <td className="px-6 md:px-10 py-3 md:py-3 font-black text-slate-600 text-xs md:text-sm uppercase">{hw.class}</td>
                          <td className="px-6 md:px-10 py-3 md:py-3 text-center">
                             <div className="space-y-0.5">
                                <p className="text-[10px] font-black text-emerald-500 uppercase tracking-widest">On: {hw.assigned}</p>
                                <p className="text-[10px] font-black text-rose-400 uppercase tracking-widest">Due: {hw.due}</p>
                             </div>
                          </td>
                          <td className="px-6 md:px-10 py-3 md:py-3 text-center">
                             <div className="flex flex-col items-center">
                                <span className="text-xs md:text-sm font-black text-slate-800">{hw.submissions} / {hw.total}</span>
                                <div className="w-16 md:w-20 h-1 md:h-1.5 bg-slate-100 rounded-full mt-2 overflow-hidden">
                                   <div 
                                     className={`h-full ${hw.status === 'completed' ? 'bg-emerald-500' : 'bg-blue-600'}`} 
                                     style={{ width: `${(hw.submissions / hw.total) * 100}%` }}
                                   ></div>
                                </div>
                             </div>
                          </td>
                          <td className="px-6 md:px-10 py-3 md:py-3 text-center">
                             <span className={`px-3 md:px-4 py-1.5 rounded-full text-[9px] md:text-[10px] font-black uppercase tracking-widest border ${
                                hw.status === 'completed' ? 'bg-emerald-50 text-emerald-600 border-emerald-100' :
                                hw.status === 'ongoing' ? 'bg-blue-50 text-blue-600 border-blue-100' :
                                'bg-slate-50 text-slate-400 border-slate-100'
                             }`}>
                                {hw.status}
                             </span>
                          </td>
                          <td className="px-6 md:px-10 py-3 md:py-3 text-right">
                             <div className="flex items-center justify-end gap-2">
                                <button className="p-2 md:p-2.5 bg-white border border-slate-200 rounded-lg md:rounded-xl text-slate-400 hover:text-blue-600 hover:border-blue-100 shadow-sm transition-all">
                                   <Eye className="w-4 h-4" />
                                </button>
                                <button className="p-2 md:p-2.5 bg-white border border-slate-200 rounded-lg md:rounded-xl text-slate-400 hover:text-rose-600 hover:border-rose-100 shadow-sm transition-all">
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

      {/* Compose Homework Modal */}
      {showModal && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
          <div 
            className="absolute inset-0 bg-slate-900/40 backdrop-blur-sm animate-in fade-in duration-300"
            onClick={() => setShowModal(false)}
          ></div>
          <div className="bg-white w-full max-w-2xl rounded-[2rem] md:rounded-[2.5rem] shadow-2xl relative z-10 overflow-hidden animate-in zoom-in-95 duration-300 max-h-[95vh] overflow-y-auto">
             <div className="p-6 md:p-10">
                <div className="flex items-center justify-between mb-8">
                   <div className="flex items-center gap-4">
                     
                      <div>
                         <h3 className="text-xl md:text-2xl font-black text-slate-800 uppercase tracking-tight">Compose Homework</h3>
                       
                      </div>
                   </div>
                   <button 
                      onClick={() => setShowModal(false)}
                      className="p-3 bg-slate-50 text-slate-400 rounded-xl hover:bg-rose-50 hover:text-rose-600 transition-all shrink-0"
                   >
                      <X className="w-5 h-5" />
                   </button>
                </div>

                <div className="space-y-6">
                       <div className="lg:flex items-center gap-5 ">
                           <SelectInputField title={'Class'}/>
                 <SelectInputField title={'Subject'}/>
                </div>
                       
                     
                  

                   <div className="space-y-2">
                    <InputField title={'Home Work Title'} placeholder={'Enter Your Home Work Title'}/>
                   </div>

                   <div className="space-y-2">
                      <label className="text-[10px] font-black text-slate-400  tracking-widest pl-1"> Details</label>
                      <textarea rows="4" className="w-full bg-slate-50 border border-slate-100 rounded-2xl px-6 py-4 text-sm font-bold focus:border-blue-500 outline-none resize-none" placeholder="Provide clear instructions for students..."></textarea>
                   </div>

                   
                      <div className="space-y-2">
                        <SelectInputField title={'Submit Date'}/>
                      </div>
                    
                   
                </div>

                <div className="mt-10 flex items-end justify-end">
                   <button 
                      onClick={() => setShowModal(false)}
                      className="flex-1 py-4 bg-slate-100 text-slate-600 rounded-2xl font-black text-[11px] uppercase tracking-widest hover:bg-slate-200 transition-all shadow-sm"
                   >
                      Save
                   </button>
                 
                </div>
             </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default HomeworkManager;
