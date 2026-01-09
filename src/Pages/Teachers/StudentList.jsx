import { useState } from "react";
import { 
  Users, 
  Search, 
  Filter, 
  ChevronRight, 
  Mail, 
  Phone, 
  MoreVertical,
  Award,
  BookOpen,
  Calendar,
  X,
  MapPin,
  Clock,
  ShieldCheck
} from "lucide-react";

const TeacherStudentList = () => {
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedStudent, setSelectedStudent] = useState(null);

  const students = [
    { id: 1, name: "Abdullah Al Mamun", roll: "001", section: "Hifz - Sec A", attendance: "98%", performance: "Excellent", avatar: "AM", guardian: "Ahmed Kabir", phone: "+880 1711-223344" },
    { id: 2, name: "Zaid Bin Harith", roll: "002", section: "Hifz - Sec A", attendance: "92%", performance: "Good", avatar: "ZH", guardian: "Harith Bin Khalid", phone: "+880 1711-556677" },
    { id: 3, name: "Omar Faruk", roll: "003", section: "Mishkat - Sec B", attendance: "85%", performance: "Average", avatar: "OF", guardian: "Uthman Faruq", phone: "+880 1711-889900" },
    { id: 4, name: "Saeed Mohsen", roll: "004", section: "Hifz - Sec A", attendance: "95%", performance: "Excellent", avatar: "SM", guardian: "Mohsen Ali", phone: "+880 1711-112233" },
    { id: 5, name: "Hamza Bin Abdul Mutattalib", roll: "005", section: "Mishkat - Sec C", attendance: "88%", performance: "Good", avatar: "HB", guardian: "Bin Mutattalib", phone: "+880 1711-443322" },
  ];

  const filteredStudents = students.filter(s => s.name.toLowerCase().includes(searchQuery.toLowerCase()));

  return (
    <div className="min-h-screen bg-slate-50/50 p-4 md:p-8 animate-in fade-in duration-500">
      <div className="max-w-[1600px] mx-auto space-y-8">
        
        {/* Header */}
        <div className="bg-white rounded-[1.5rem] md:rounded-[2.5rem] border border-slate-200 p-6 md:p-8 shadow-sm flex flex-col lg:flex-row justify-between items-center gap-6">
          <div className="flex items-center gap-4 md:gap-6">
            <div className="w-12 h-12 md:w-16 md:h-16 bg-slate-900 rounded-xl md:rounded-2xl flex items-center justify-center border border-slate-800 shadow-inner shrink-0">
              <Users className="w-6 h-6 md:w-8 md:h-8 text-white" />
            </div>
            <div>
              <h1 className="text-xl md:text-3xl font-black text-slate-800 tracking-tight text-uppercase">Student Directory</h1>
              <p className="text-slate-500 font-bold mt-1 text-xs md:text-base">Institutional records for students in your assigned academic sections</p>
            </div>
          </div>

          <div className="flex gap-3 md:gap-4 w-full lg:w-auto">
             <div className="relative flex-1 lg:w-80">
                <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-300" />
                <input 
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full bg-slate-50 border border-slate-100 rounded-xl md:rounded-2xl pl-10 pr-6 py-3 md:py-4 text-sm font-bold focus:border-slate-800 outline-none transition-all" 
                  placeholder="Search student..." 
                />
             </div>
             <button className="p-3 md:px-8 bg-slate-100 text-slate-600 rounded-xl md:rounded-2xl font-black hover:bg-slate-200 transition-all border border-slate-200">
                <Filter className="w-5 h-5 md:hidden" />
                <span className="hidden md:inline">Filters</span>
             </button>
          </div>
        </div>

        {/* Categories / Stats */}
        <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-6">
           <div className="bg-white p-6 md:p-8 rounded-[1.5rem] md:rounded-[2.5rem] border border-slate-200 shadow-sm flex items-center gap-6 group hover:border-indigo-200 transition-all">
              <div className="w-12 h-12 md:w-14 md:h-14 bg-indigo-50 rounded-xl md:rounded-2xl flex items-center justify-center text-indigo-600 shrink-0">
                 <BookOpen className="w-6 h-6 md:w-7 md:h-7" />
              </div>
              <div>
                 <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest leading-none mb-1">My Sections</p>
                 <h4 className="text-lg md:text-xl font-black text-slate-800 tracking-tight">4 Managed</h4>
              </div>
           </div>
           <div className="bg-white p-6 md:p-8 rounded-[1.5rem] md:rounded-[2.5rem] border border-slate-200 shadow-sm flex items-center gap-6 group hover:border-emerald-200 transition-all">
              <div className="w-12 h-12 md:w-14 md:h-14 bg-emerald-50 rounded-xl md:rounded-2xl flex items-center justify-center text-emerald-600 shrink-0">
                 <Users className="w-6 h-6 md:w-7 md:h-7" />
              </div>
              <div>
                 <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest leading-none mb-1">Total Enrolled</p>
                 <h4 className="text-lg md:text-xl font-black text-slate-800 tracking-tight">128 Students</h4>
              </div>
           </div>
           <div className="bg-white p-6 md:p-8 rounded-[1.5rem] md:rounded-[2.5rem] border border-slate-200 shadow-sm flex items-center gap-6 group hover:border-amber-200 transition-all sm:col-span-2 xl:col-span-1">
              <div className="w-12 h-12 md:w-14 md:h-14 bg-amber-50 rounded-xl md:rounded-2xl flex items-center justify-center text-amber-600 shrink-0">
                 <Award className="w-6 h-6 md:w-7 md:h-7" />
              </div>
              <div>
                 <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest leading-none mb-1">Performance</p>
                 <h4 className="text-lg md:text-xl font-black text-slate-800 tracking-tight">82% Avg. Score</h4>
              </div>
           </div>
        </div>

        {/* Student Table */}
        <div className="bg-white rounded-[1.5rem] md:rounded-[3rem] border border-slate-200 shadow-sm overflow-hidden animate-in fade-in slide-in-from-bottom duration-700">
           <div className="overflow-x-auto">
              <table className="w-full border-collapse min-w-[900px]">
                 <thead>
                    <tr className="border-b border-slate-50 text-[10px] font-black text-slate-400 uppercase tracking-widest">
                       <th className="px-6 md:px-10 py-4 md:py-6 text-left">Identity</th>
                       <th className="px-6 md:px-10 py-4 md:py-6 text-left">Academic Program</th>
                       <th className="px-6 md:px-10 py-4 md:py-6 text-center">Attendance</th>
                       <th className="px-6 md:px-10 py-4 md:py-6 text-center">Evaluation</th>
                       <th className="px-6 md:px-10 py-4 md:py-6 text-right">Connect</th>
                    </tr>
                 </thead>
                 <tbody className="divide-y divide-slate-50">
                    {filteredStudents.map((student) => (
                       <tr key={student.id} className="group hover:bg-slate-50/50 transition-all">
                          <td className="px-6 md:px-10 py-4 md:py-6">
                             <div className="flex items-center gap-4 md:gap-6">
                                <div className="w-10 h-10 md:w-14 md:h-14 bg-slate-100 rounded-xl md:rounded-2xl border-4 border-white shadow-md flex items-center justify-center font-black text-slate-400 group-hover:scale-110 transition-transform uppercase shrink-0">
                                   {student.avatar}
                                </div>
                                <div>
                                   <h4 className="text-sm font-black text-slate-800 uppercase tracking-tight">{student.name}</h4>
                                   <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest font-mono mt-0.5">ROLL: {student.roll}</p>
                                </div>
                             </div>
                          </td>
                          <td className="px-6 md:px-10 py-4 md:py-6">
                             <span className="px-3 py-1 bg-slate-50 text-[9px] font-black text-slate-400 uppercase border border-slate-100 rounded-lg">{student.section}</span>
                          </td>
                          <td className="px-6 md:px-10 py-4 md:py-6 text-center text-sm font-black text-slate-800">{student.attendance}</td>
                          <td className="px-6 md:px-10 py-4 md:py-6 text-center">
                             <span className={`px-3 md:px-4 py-1.5 rounded-full text-[9px] font-black uppercase tracking-widest border ${
                                student.performance === 'Excellent' ? 'bg-emerald-50 text-emerald-600 border-emerald-100' :
                                student.performance === 'Good' ? 'bg-blue-50 text-blue-600 border-blue-100' :
                                'bg-amber-50 text-amber-600 border-amber-100'
                             }`}>
                                {student.performance}
                             </span>
                          </td>
                          <td className="px-6 md:px-10 py-4 md:py-6 text-right">
                             <div className="flex items-center justify-end gap-2">
                                <button className="p-2 md:p-3 bg-white border border-slate-100 rounded-lg md:rounded-xl text-slate-300 hover:text-indigo-600 hover:border-indigo-100 hover:scale-110 transition-all shadow-sm">
                                   <Mail className="w-4 h-4" />
                                </button>
                                <button className="p-2 md:p-3 bg-white border border-slate-100 rounded-lg md:rounded-xl text-slate-300 hover:text-emerald-600 hover:border-emerald-100 hover:scale-110 transition-all shadow-sm">
                                   <Phone className="w-4 h-4" />
                                </button>
                                <button 
                                   onClick={() => setSelectedStudent(student)}
                                   className="p-2 md:p-3 bg-white border border-slate-100 rounded-lg md:rounded-xl text-slate-300 hover:text-slate-600 hover:border-slate-200 hover:scale-110 transition-all shadow-sm"
                                >
                                   <ChevronRight className="w-4 h-4" />
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

      {/* Student Detail Modal */}
      {selectedStudent && (
         <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
            <div 
               className="absolute inset-0 bg-slate-900/60 backdrop-blur-md animate-in fade-in duration-300"
               onClick={() => setSelectedStudent(null)}
            ></div>
            <div className="bg-white w-full max-w-2xl rounded-[2.5rem] shadow-2xl relative z-10 overflow-hidden animate-in zoom-in-95 duration-300 max-h-[90vh] overflow-y-auto">
               <div className="h-32 bg-slate-900 overflow-hidden relative">
                  <div className="absolute inset-0 opacity-10 bg-[url('https://www.transparenttextures.com/patterns/carbon-fibre.png')]"></div>
                  <button 
                     onClick={() => setSelectedStudent(null)}
                     className="absolute top-6 right-6 p-2 bg-white/10 text-white rounded-xl hover:bg-rose-500 transition-all z-20 backdrop-blur-md"
                  >
                     <X className="w-5 h-5" />
                  </button>
               </div>

               <div className="px-8 pb-10">
                  <div className="flex items-end gap-6 -mt-12 relative z-10 mb-8">
                     <div className="w-32 h-32 bg-white rounded-[2rem] p-2 shadow-2xl">
                        <div className="w-full h-full bg-slate-100 rounded-[1.5rem] flex items-center justify-center font-black text-slate-400 text-4xl border-4 border-slate-50 uppercase">
                           {selectedStudent.avatar}
                        </div>
                     </div>
                     <div className="mb-2">
                        <h3 className="text-2xl font-black text-slate-800 uppercase tracking-tight">{selectedStudent.name}</h3>
                        <p className="text-[10px] font-black text-slate-400 uppercase tracking-[2px] mt-1">Institutional ID: #MMS-2026-{selectedStudent.id}82</p>
                     </div>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                     <div className="space-y-6">
                        <div className="p-5 bg-slate-50/50 border border-slate-100 rounded-3xl group hover:border-indigo-100 transition-all">
                           <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-3 flex items-center gap-2">
                              <ShieldCheck className="w-3.5 h-3.5" /> Academic Information
                           </p>
                           <div className="space-y-3">
                              <div className="flex justify-between items-center">
                                 <span className="text-xs font-bold text-slate-500">Current Class</span>
                                 <span className="text-xs font-black text-slate-800 uppercase">{selectedStudent.section}</span>
                              </div>
                              <div className="flex justify-between items-center">
                                 <span className="text-xs font-bold text-slate-500">Roll Number</span>
                                 <span className="text-xs font-black text-slate-800 font-mono">{selectedStudent.roll}</span>
                              </div>
                           </div>
                        </div>

                        <div className="p-5 bg-slate-50/50 border border-slate-100 rounded-3xl group hover:border-emerald-100 transition-all">
                           <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-3 flex items-center gap-2">
                              <Calendar className="w-3.5 h-3.5" /> Performance Stats
                           </p>
                           <div className="space-y-3">
                              <div className="flex justify-between items-center">
                                 <span className="text-xs font-bold text-slate-500">Attendance</span>
                                 <span className="text-xs font-black text-emerald-600">{selectedStudent.attendance}</span>
                              </div>
                              <div className="flex justify-between items-center">
                                 <span className="text-xs font-bold text-slate-500">Evaluation</span>
                                 <span className="text-xs font-black text-indigo-600 uppercase">{selectedStudent.performance}</span>
                              </div>
                           </div>
                        </div>
                     </div>

                     <div className="space-y-6">
                        <div className="p-5 bg-slate-50/50 border border-slate-100 rounded-3xl group hover:border-blue-100 transition-all">
                           <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-3 flex items-center gap-2">
                              <Phone className="w-3.5 h-3.5" /> Guardian Details
                           </p>
                           <div className="space-y-3">
                              <div>
                                 <p className="text-[9px] font-bold text-slate-400 uppercase tracking-[1px] mb-1">Guardian Name</p>
                                 <p className="text-xs font-black text-slate-700 uppercase">{selectedStudent.guardian}</p>
                              </div>
                              <div>
                                 <p className="text-[9px] font-bold text-slate-400 uppercase tracking-[1px] mb-1">Contact Phone</p>
                                 <p className="text-xs font-black text-slate-700">{selectedStudent.phone}</p>
                              </div>
                           </div>
                        </div>

                        <div className="pt-2">
                           <button className="w-full py-4 bg-slate-900 text-white rounded-2xl font-black text-[10px] uppercase tracking-widest hover:bg-slate-800 transition-all shadow-xl shadow-slate-200">
                              Generate Student Report
                           </button>
                           <button className="w-full py-4 bg-white border border-slate-200 text-slate-600 rounded-2xl font-black text-[10px] uppercase tracking-widest hover:bg-slate-50 transition-all mt-3">
                              Message Guardian
                           </button>
                        </div>
                     </div>
                  </div>
               </div>
            </div>
         </div>
      )}
    </div>
  );
};

export default TeacherStudentList;
