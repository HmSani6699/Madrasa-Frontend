import { useState } from "react";
import { 
  FileText, 
  Search, 
  Filter, 
  CheckCircle2, 
  ChevronRight,
  Printer,
  Download,
  Eye,
  X,
  List as ListIcon,
  Image as ImageIcon,
  Check,
  Calendar,
  GraduationCap,
  Layout
} from "lucide-react";

const GenerateAdmitCard = () => {
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedExam, setSelectedExam] = useState("Annual Examination 2026");
  const [selectedTemplate, setSelectedTemplate] = useState("Final Exam 2026 Template");
  const [selectedClass, setSelectedClass] = useState("All Classes");
  const [selectedSection, setSelectedSection] = useState("All Sections");
  
  const [selectedStudents, setSelectedStudents] = useState([]);
  const [isPreviewOpen, setIsPreviewOpen] = useState(false);

  // Sample Data
  const exams = ["Annual Examination 2026", "Mid-Term Examination 2025", "Monthly MCQ Test - Jan"];
  const templates = ["Final Exam 2026 Template", "Standard Exam Layout", "Compact Admit Card"];
  const classes = ["All Classes", "Class 5", "Class 6", "Class 7", "Hifz Class", "Kitab Class"];
  const sections = ["All Sections", "Section A", "Section B", "Morning", "Evening"];

  const students = [
    { id: 1, name: "Abdullah Ibn Omar", admissionNo: "2023001", class: "Class 5", section: "Section A", roll: "01", room: "Hall A-102" },
    { id: 2, name: "Zaid Ibn Harithah", admissionNo: "2023002", class: "Class 5", section: "Section A", roll: "02", room: "Hall A-102" },
    { id: 3, name: "Usama Ibn Zaid", admissionNo: "2023005", class: "Class 6", section: "Section B", roll: "05", room: "Room 405" },
    { id: 4, name: "Anas Ibn Malik", admissionNo: "2023009", class: "Class 6", section: "Section B", roll: "09", room: "Room 405" },
    { id: 5, name: "Bilal Ibn Rabah", admissionNo: "2023012", class: "Hifz Class", section: "Morning", roll: "12", room: "Prayer Hall" },
  ];

  const filteredStudents = students.filter(s => 
    (selectedClass === "All Classes" || s.class === selectedClass) &&
    (selectedSection === "All Sections" || s.section === selectedSection) &&
    (s.name.toLowerCase().includes(searchTerm.toLowerCase()) || s.admissionNo.includes(searchTerm))
  );

  const toggleStudentSelection = (studentId) => {
    setSelectedStudents(prev => 
      prev.includes(studentId) 
        ? prev.filter(id => id !== studentId) 
        : [...prev, studentId]
    );
  };

  const selectAll = () => {
    if (selectedStudents.length === filteredStudents.length) {
      setSelectedStudents([]);
    } else {
      setSelectedStudents(filteredStudents.map(s => s.id));
    }
  };

  return (
    <div className="space-y-10 animate-in fade-in duration-500 p-6 md:p-10 text-slate-800">
      {/* Header */}
      <div className="bg-white rounded-[3rem] border-2 border-slate-200 p-10 flex flex-col lg:flex-row justify-between items-center gap-8 shadow-sm relative overflow-hidden">
        <div className="flex items-center gap-8 relative z-10">
          <div className="w-20 h-20 bg-rose-50 rounded-[2rem] flex items-center justify-center border-2 border-rose-100/50 shadow-inner">
            <GraduationCap className="w-10 h-10 text-rose-600" />
          </div>
          <div>
            <h1 className="text-3xl md:text-4xl font-black tracking-tight text-center lg:text-left uppercase">Generate Admit Cards</h1>
            <p className="text-slate-500 font-bold mt-2 text-lg text-center lg:text-left">Execute batch generation for examination permits</p>
          </div>
        </div>

        <div className="flex flex-col sm:flex-row gap-4 w-full lg:w-auto">
            <button 
                disabled={selectedStudents.length === 0}
                onClick={() => setIsPreviewOpen(true)}
                className="px-8 py-5 bg-rose-600 text-white rounded-[1.5rem] font-black shadow-2xl shadow-rose-100 hover:bg-rose-700 hover:scale-[1.02] active:scale-95 transition-all flex items-center justify-center gap-3 disabled:opacity-50 disabled:scale-100 disabled:shadow-none"
            >
                <Eye className="w-6 h-6" />
                Live Batch Preview ({selectedStudents.length})
            </button>
        </div>
      </div>

      {/* Logic Hub (Filters) */}
      <div className="bg-white rounded-[3rem] border-2 border-slate-100 p-10 shadow-xl shadow-slate-100/10 space-y-10">
          <div className="flex items-center gap-4 border-b border-slate-50 pb-6">
              <div className="w-10 h-10 bg-slate-900 text-white rounded-xl flex items-center justify-center">
                  <Layout className="w-5 h-5" />
              </div>
              <h3 className="text-xl font-black tracking-tighter uppercase">Generation Parameters</h3>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
              <div className="space-y-2">
                  <label className="text-[10px] font-black text-slate-400 uppercase ml-2 flex items-center gap-1.5"><Calendar className="w-3 h-3" /> Target Examination</label>
                  <select 
                    value={selectedExam}
                    onChange={(e) => setSelectedExam(e.target.value)}
                    className="w-full bg-slate-50 border-2 border-slate-100 rounded-2xl px-5 py-4 text-sm font-bold focus:border-rose-500 outline-none transition-all appearance-none cursor-pointer"
                  >
                      {exams.map(e => <option key={e}>{e}</option>)}
                  </select>
              </div>
              <div className="space-y-2">
                  <label className="text-[10px] font-black text-slate-400 uppercase ml-2 flex items-center gap-1.5"><ListIcon className="w-3 h-3" /> Visual Template</label>
                  <select 
                    value={selectedTemplate}
                    onChange={(e) => setSelectedTemplate(e.target.value)}
                    className="w-full bg-slate-50 border-2 border-slate-100 rounded-2xl px-5 py-4 text-sm font-bold focus:border-rose-500 outline-none transition-all appearance-none cursor-pointer"
                  >
                      {templates.map(t => <option key={t}>{t}</option>)}
                  </select>
              </div>
              <div className="space-y-2">
                  <label className="text-[10px] font-black text-slate-400 uppercase ml-2 flex items-center gap-1.5"><Filter className="w-3 h-3" /> Class Layer</label>
                  <select 
                    value={selectedClass}
                    onChange={(e) => setSelectedClass(e.target.value)}
                    className="w-full bg-slate-50 border-2 border-slate-100 rounded-2xl px-5 py-4 text-sm font-bold focus:border-rose-500 outline-none transition-all appearance-none cursor-pointer"
                  >
                      {classes.map(c => <option key={c}>{c}</option>)}
                  </select>
              </div>
              <div className="space-y-2">
                  <label className="text-[10px] font-black text-slate-400 uppercase ml-2 flex items-center gap-1.5"><Search className="w-3 h-3" /> Student Lookup</label>
                  <div className="relative">
                      <Search className="absolute left-5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-300" />
                      <input 
                        placeholder="Search ID/Name..."
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                        className="w-full bg-slate-50 border-2 border-slate-100 rounded-2xl pl-12 pr-6 py-4 text-sm font-bold focus:border-rose-500 outline-none transition-all"
                      />
                  </div>
              </div>
          </div>
      </div>

      {/* Student Registry Table */}
      <div className="bg-white rounded-[3rem] border-2 border-slate-100 shadow-xl shadow-slate-100/20 overflow-hidden relative">
          <div className="p-8 border-b-2 border-slate-50 flex justify-between items-center bg-slate-50/20">
              <div className="flex items-center gap-4">
                  <div className="w-12 h-12 bg-rose-50 rounded-2xl flex items-center justify-center border border-rose-100">
                      <ListIcon className="w-6 h-6 text-rose-500" />
                  </div>
                  <div>
                      <h3 className="text-xl font-black tracking-tight uppercase">Eligible Candidate Registry</h3>
                      <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mt-0.5">Filter matched results</p>
                  </div>
              </div>
              
              <button 
                onClick={selectAll}
                className="px-6 py-3 bg-white border-2 border-slate-100 rounded-xl text-[10px] font-black uppercase tracking-widest hover:border-rose-200 hover:text-rose-600 transition-all shadow-sm"
              >
                  {selectedStudents.length === filteredStudents.length ? 'Void Selection' : 'Capture All Results'}
              </button>
          </div>

          <div className="overflow-x-auto">
              <table className="w-full border-collapse">
                  <thead>
                      <tr className="text-left bg-slate-50/10">
                          <th className="p-8 text-[10px] font-black text-slate-400 uppercase tracking-widest">Select</th>
                          <th className="p-8 text-[10px] font-black text-slate-400 uppercase tracking-widest">Candidate Name</th>
                          <th className="p-8 text-[10px] font-black text-slate-400 uppercase tracking-widest">Identity ID</th>
                          <th className="p-8 text-[10px] font-black text-slate-400 uppercase tracking-widest">Academic Info</th>
                          <th className="p-8 text-[10px] font-black text-slate-400 uppercase tracking-widest">Exam Venue</th>
                          <th className="p-8 text-[10px] font-black text-slate-400 uppercase tracking-widest text-right">Validity</th>
                      </tr>
                  </thead>
                  <tbody className="divide-y-2 divide-slate-50">
                      {filteredStudents.map(student => (
                          <tr 
                            key={student.id} 
                            onClick={() => toggleStudentSelection(student.id)}
                            className={`group hover:bg-slate-50/50 transition-colors cursor-pointer ${selectedStudents.includes(student.id) ? 'bg-rose-50/20' : ''}`}
                          >
                              <td className="p-8">
                                  <div className={`w-8 h-8 rounded-xl border-2 flex items-center justify-center transition-all ${
                                      selectedStudents.includes(student.id) ? 'bg-rose-600 border-rose-600 shadow-lg shadow-rose-100' : 'bg-white border-slate-200'
                                  }`}>
                                      {selectedStudents.includes(student.id) && <Check className="w-4 h-4 text-white font-bold" />}
                                  </div>
                              </td>
                              <td className="p-8">
                                  <div className="flex items-center gap-5">
                                      <div className="w-12 h-12 bg-slate-100 rounded-xl flex items-center justify-center border-2 border-white shadow-sm overflow-hidden shrink-0">
                                          <ImageIcon className="w-6 h-6 text-slate-200" />
                                      </div>
                                      <span className="font-black text-slate-700 tracking-tight group-hover:text-rose-600 transition-colors uppercase">{student.name}</span>
                                  </div>
                              </td>
                              <td className="p-8 font-mono text-xs font-bold text-slate-500">{student.admissionNo}</td>
                              <td className="p-8">
                                  <div className="flex flex-col gap-0.5">
                                      <span className="text-xs font-black text-slate-700">{student.class}</span>
                                      <span className="text-[9px] font-bold text-slate-400 uppercase tracking-widest">{student.section}</span>
                                  </div>
                              </td>
                              <td className="p-8">
                                  <div className="flex items-center gap-2 text-[10px] font-black text-slate-400 uppercase tracking-tight">
                                     <Layout className="w-3.5 h-3.5 text-slate-300" />
                                     {student.room}
                                  </div>
                              </td>
                              <td className="p-8 text-right">
                                  <div className="flex items-center justify-end gap-2 text-rose-500">
                                      <span className="text-[10px] font-black uppercase tracking-widest">Verified</span>
                                      <CheckCircle2 className="w-4 h-4" />
                                  </div>
                              </td>
                          </tr>
                      ))}
                      {filteredStudents.length === 0 && (
                          <tr>
                              <td colSpan="6" className="p-20 text-center">
                                  <div className="flex flex-col items-center gap-4 opacity-20">
                                      <Search className="w-16 h-16" />
                                      <p className="font-black text-xl uppercase tracking-widest">Registry yielded no results</p>
                                  </div>
                              </td>
                          </tr>
                      )}
                  </tbody>
              </table>
          </div>
          
          <div className="p-8 flex justify-between items-center bg-slate-50/50 border-t-2 border-slate-50">
              <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">
                  Filtered Set: <span className="text-slate-800">{filteredStudents.length} Students</span>
              </p>
              <div className="flex items-center gap-2">
                  <span className="text-[10px] font-black text-slate-400 uppercase pr-4 border-r border-slate-200">Processing: {selectedStudents.length} Admit Cards</span>
                  <button 
                    disabled={selectedStudents.length === 0}
                    className="flex items-center gap-2 text-rose-600 font-black text-[10px] uppercase tracking-widest hover:translate-x-1 transition-transform disabled:opacity-30"
                  >
                      Initiate Batch Print <ChevronRight className="w-4 h-4" />
                  </button>
              </div>
          </div>
      </div>

      {/* Batch Generation Preview Modal */}
      {isPreviewOpen && (
          <div className="fixed inset-0 bg-slate-900/90 backdrop-blur-2xl z-[100] flex items-center justify-center p-6 lg:p-10">
              <div className="bg-white rounded-[4rem] w-full h-full max-w-7xl shadow-[0_0_120px_rgba(0,0,0,0.5)] flex flex-col overflow-hidden animate-in zoom-in duration-500">
                   {/* Modal Header */}
                   <div className="p-10 border-b-2 border-slate-50 flex items-center justify-between shrink-0 bg-white relative z-10">
                        <div className="flex items-center gap-6">
                            <div className="w-16 h-16 bg-rose-600 text-white rounded-[1.8rem] flex items-center justify-center shadow-2xl shadow-rose-200">
                                <Printer className="w-8 h-8" />
                            </div>
                            <div>
                                <h2 className="text-3xl font-black text-slate-800 tracking-tighter uppercase">Batch Export Terminal</h2>
                                <p className="text-xs font-black text-slate-400 uppercase tracking-[0.3em] mt-1">Exam: <span className="text-rose-600">{selectedExam}</span></p>
                            </div>
                        </div>
                        <div className="flex gap-4">
                            <button className="flex items-center gap-3 px-8 py-4 bg-slate-50 text-slate-600 rounded-2xl font-black text-sm hover:bg-slate-100 transition-all border-2 border-slate-100">
                                <Download className="w-5 h-5" /> Export PDF Batch
                            </button>
                            <button className="flex items-center gap-3 px-8 py-4 bg-rose-600 text-white rounded-2xl font-black text-sm hover:bg-rose-700 shadow-2xl shadow-rose-100 transition-all">
                                <Printer className="w-5 h-5" /> Push To Print
                            </button>
                            <button onClick={() => setIsPreviewOpen(false)} className="p-4 text-slate-300 hover:text-rose-500 hover:bg-rose-50 rounded-2xl transition-all ml-4">
                                <X className="w-8 h-8" />
                            </button>
                        </div>
                   </div>

                   {/* Preview Grid (Half A4 Renderings) */}
                   <div className="flex-1 overflow-y-auto p-12 lg:p-20 bg-slate-50/30 custom-scrollbar">
                        <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 max-w-6xl mx-auto pb-20">
                            {selectedStudents.map(id => {
                                const s = students.find(x => x.id === id);
                                return (
                                    <div key={id} className="relative group shrink-0 mx-auto w-full">
                                        <div className="bg-white rounded-[2rem] shadow-2xl border-4 border-slate-100 flex flex-col transition-all hover:scale-[1.01] overflow-hidden p-1">
                                            {/* Minimalist Admit Card Design */}
                                            <div className="border-2 border-slate-900/10 rounded-[1.8rem] flex flex-col p-8 space-y-6">
                                                <div className="flex justify-between items-center border-b-2 border-slate-100 pb-6">
                                                     <div className="w-12 h-12 bg-rose-600/10 rounded-xl flex items-center justify-center">
                                                        <GraduationCap className="w-6 h-6 text-rose-600" />
                                                     </div>
                                                     <div className="text-center">
                                                        <h4 className="text-[10px] font-black uppercase tracking-[0.4em] text-slate-400">Official Examination Permit</h4>
                                                        <h3 className="text-sm font-black text-slate-800 uppercase tracking-widest mt-1">{selectedExam}</h3>
                                                     </div>
                                                     <div className="w-12 h-12 bg-slate-900 rounded-xl flex items-center justify-center text-white text-[10px] font-black">MMS</div>
                                                </div>

                                                <div className="flex gap-10">
                                                    <div className="flex-1 space-y-4">
                                                        <div className="grid grid-cols-2 gap-x-8 gap-y-4">
                                                            <div className="space-y-1">
                                                                <p className="text-[8px] font-black text-slate-300 uppercase">Candidate Name</p>
                                                                <p className="text-sm font-black text-slate-800 uppercase">{s.name}</p>
                                                            </div>
                                                            <div className="space-y-1 text-right">
                                                                <p className="text-[8px] font-black text-slate-300 uppercase">Roll Number</p>
                                                                <p className="text-sm font-black text-slate-800 uppercase tracking-widest">{s.roll}</p>
                                                            </div>
                                                            <div className="space-y-1">
                                                                <p className="text-[8px] font-black text-slate-300 uppercase">Admission ID</p>
                                                                <p className="text-xs font-bold text-slate-600 font-mono tracking-tighter">{s.admissionNo}</p>
                                                            </div>
                                                            <div className="space-y-1 text-right">
                                                                <p className="text-[8px] font-black text-slate-300 uppercase">Class Context</p>
                                                                <p className="text-xs font-black text-slate-800 uppercase">{s.class} - {s.section}</p>
                                                            </div>
                                                        </div>

                                                        <div className="bg-slate-50 p-4 rounded-2xl border border-slate-100 flex justify-between items-center">
                                                            <div className="flex items-center gap-3">
                                                                <Layout className="w-4 h-4 text-slate-300" />
                                                                <div>
                                                                    <p className="text-[7px] font-black text-slate-400 uppercase leading-none">Exam Venue</p>
                                                                    <p className="text-[10px] font-black text-rose-600 uppercase tracking-tight mt-1">{s.room}</p>
                                                                </div>
                                                            </div>
                                                            <div className="flex items-center gap-4 text-right">
                                                                <div className="h-6 w-[1.5px] bg-slate-200" />
                                                                <div>
                                                                    <p className="text-[7px] font-black text-slate-400 uppercase leading-none">Security Hash</p>
                                                                    <p className="text-[8px] font-mono font-bold text-slate-400 mt-1">E-{s.id}V-{s.roll}G-X</p>
                                                                </div>
                                                            </div>
                                                        </div>
                                                    </div>

                                                    <div className="w-32 h-32 bg-slate-50 border-2 border-slate-100 rounded-2xl flex items-center justify-center shrink-0 shadow-inner group">
                                                         <ImageIcon className="w-10 h-10 text-slate-200" />
                                                    </div>
                                                </div>

                                                <div className="space-y-3 pt-4 border-t-2 border-slate-50 border-dashed">
                                                     <div className="flex justify-between items-baseline">
                                                        <h5 className="text-[8px] font-black text-slate-900 uppercase tracking-widest">Candidate Matrix</h5>
                                                        <div className="h-[1px] bg-slate-100 flex-1 mx-4" />
                                                        <CheckCircle2 className="w-3 h-3 text-emerald-500" />
                                                     </div>
                                                     <div className="grid grid-cols-1 gap-2">
                                                        <p className="text-[7px] font-bold text-slate-400 italic">This document serves as primary identification for all examination modules within the specified term.</p>
                                                     </div>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                );
                            })}
                        </div>
                   </div>

                   {/* Batch Progress Bar */}
                   <div className="p-8 bg-slate-900 flex items-center justify-between shrink-0">
                       <div className="flex items-center gap-6 text-white text-[10px] font-black uppercase tracking-[0.2em]">
                           <span>Batch Size: {selectedStudents.length} Units</span>
                           <div className="w-1 h-1 rounded-full bg-white/20" />
                           <span>Sheet Consumption: {Math.ceil(selectedStudents.length / 2)} Pages</span>
                       </div>
                       <div className="flex-1 max-w-md mx-20 h-1.5 bg-white/10 rounded-full overflow-hidden">
                           <div className="w-full h-full bg-rose-500 rounded-full shadow-[0_0_10px_rgba(244,63,94,0.5)]" />
                       </div>
                       <div className="text-white text-[11px] font-black uppercase tracking-[0.3em] opacity-40">Ready For Dispatch</div>
                   </div>
              </div>
          </div>
      )}
    </div>
  );
};

export default GenerateAdmitCard;
