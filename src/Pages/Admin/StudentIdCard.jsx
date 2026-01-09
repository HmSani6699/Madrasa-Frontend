import { useState } from "react";
import { 
  Users, 
  Search, 
  CreditCard, 
  Filter, 
  CheckCircle2, 
  ChevronRight,
  Printer,
  Download,
  Eye,
  Plus,
  X,
  LayoutGrid,
  List as ListIcon,
  Image as ImageIcon,
  Check
} from "lucide-react";

const StudentIdCard = () => {
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedClass, setSelectedClass] = useState("All Classes");
  const [selectedSection, setSelectedSection] = useState("All Sections");
  const [selectedTemplate, setSelectedTemplate] = useState("Classic Student Card");
  
  const [selectedStudents, setSelectedStudents] = useState([]);
  const [isPreviewOpen, setIsPreviewOpen] = useState(false);

  // Sample Data
  const classes = ["All Classes", "Class 5", "Class 6", "Class 7", "Hifz Class", "Kitab Class"];
  const sections = ["All Sections", "Section A", "Section B", "Morning", "Evening"];
  const templates = ["Classic Student Card", "Modern Digital Card", "Minimalist Card"];

  const students = [
    { id: 1, name: "Abdullah Ibn Omar", admissionNo: "2023001", class: "Class 5", section: "Section A", roll: "01", blood: "A+", photo: null },
    { id: 2, name: "Zaid Ibn Harithah", admissionNo: "2023002", class: "Class 5", section: "Section A", roll: "02", blood: "O-", photo: null },
    { id: 3, name: "Usama Ibn Zaid", admissionNo: "2023005", class: "Class 6", section: "Section B", roll: "05", blood: "B+", photo: null },
    { id: 4, name: "Anas Ibn Malik", admissionNo: "2023009", class: "Class 6", section: "Section B", roll: "09", blood: "AB+", photo: null },
    { id: 5, name: "Bilal Ibn Rabah", admissionNo: "2023012", class: "Hifz Class", section: "Morning", roll: "12", blood: "O+", photo: null },
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
          <div className="w-20 h-20 bg-indigo-50 rounded-[2rem] flex items-center justify-center border-2 border-indigo-100/50 shadow-inner">
            <Users className="w-10 h-10 text-indigo-600" />
          </div>
          <div>
            <h1 className="text-3xl md:text-4xl font-black tracking-tight text-center lg:text-left">Student ID Cards</h1>
            <p className="text-slate-500 font-bold mt-2 text-lg text-center lg:text-left">Generate and print ID cards for your students</p>
          </div>
        </div>

        <div className="flex flex-col sm:flex-row gap-4 w-full lg:w-auto">
            <button 
                disabled={selectedStudents.length === 0}
                onClick={() => setIsPreviewOpen(true)}
                className="px-8 py-5 bg-indigo-600 text-white rounded-[1.5rem] font-black shadow-2xl shadow-indigo-100 hover:bg-indigo-700 hover:scale-[1.02] active:scale-95 transition-all flex items-center justify-center gap-3 disabled:opacity-50 disabled:scale-100 disabled:shadow-none"
            >
                <Eye className="w-6 h-6" />
                Preview Selection ({selectedStudents.length})
            </button>
        </div>
      </div>

      {/* Control Panel */}
      <div className="grid grid-cols-1 xl:grid-cols-4 gap-6">
          {/* Filters */}
          <div className="xl:col-span-3 bg-white rounded-[2.5rem] border-2 border-slate-100 p-6 flex flex-col md:flex-row gap-6 shadow-sm">
              <div className="flex-1 space-y-2">
                  <label className="text-[10px] font-black text-slate-400 uppercase ml-2">Institutional Class</label>
                  <select 
                    value={selectedClass}
                    onChange={(e) => setSelectedClass(e.target.value)}
                    className="w-full bg-slate-50 border-2 border-slate-100 rounded-2xl px-5 py-4 text-sm font-bold focus:border-indigo-500 outline-none transition-all appearance-none cursor-pointer"
                  >
                      {classes.map(c => <option key={c}>{c}</option>)}
                  </select>
              </div>
              <div className="flex-1 space-y-2">
                  <label className="text-[10px] font-black text-slate-400 uppercase ml-2">Section Unit</label>
                  <select 
                    value={selectedSection}
                    onChange={(e) => setSelectedSection(e.target.value)}
                    className="w-full bg-slate-50 border-2 border-slate-100 rounded-2xl px-5 py-4 text-sm font-bold focus:border-indigo-500 outline-none transition-all appearance-none cursor-pointer"
                  >
                      {sections.map(s => <option key={s}>{s}</option>)}
                  </select>
              </div>
              <div className="flex-1 space-y-2">
                  <label className="text-[10px] font-black text-slate-400 uppercase ml-2">Applied Template</label>
                  <select 
                    value={selectedTemplate}
                    onChange={(e) => setSelectedTemplate(e.target.value)}
                    className="w-full bg-slate-50 border-2 border-slate-100 rounded-2xl px-5 py-4 text-sm font-bold focus:border-indigo-500 outline-none transition-all appearance-none cursor-pointer"
                  >
                      {templates.map(t => <option key={t}>{t}</option>)}
                  </select>
              </div>
          </div>

          {/* Search */}
          <div className="bg-white rounded-[2.5rem] border-2 border-slate-100 p-6 flex items-end shadow-sm">
              <div className="w-full space-y-2">
                  <label className="text-[10px] font-black text-slate-400 uppercase ml-2">Quick Search</label>
                  <div className="relative">
                      <Search className="absolute left-5 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-300" />
                      <input 
                        placeholder="Search by name or ID..."
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                        className="w-full bg-slate-50 border-none rounded-2xl pl-14 pr-6 py-4 text-sm font-bold placeholder:text-slate-300 outline-none focus:ring-2 ring-indigo-500/20 transition-all"
                      />
                  </div>
              </div>
          </div>
      </div>

      {/* Student List */}
      <div className="bg-white rounded-[3rem] border-2 border-slate-100 shadow-xl shadow-slate-100/20 overflow-hidden relative">
          <div className="p-8 border-b-2 border-slate-50 flex justify-between items-center bg-slate-50/30">
              <div className="flex items-center gap-4">
                  <div className="w-12 h-12 bg-indigo-50 rounded-2xl flex items-center justify-center border border-indigo-100">
                      <ListIcon className="w-6 h-6 text-indigo-500" />
                  </div>
                  <div>
                      <h3 className="text-xl font-black tracking-tight">Student Roster</h3>
                      <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mt-0.5">Ready for dispatch</p>
                  </div>
              </div>
              
              <button 
                onClick={selectAll}
                className="px-6 py-3 bg-white border-2 border-slate-100 rounded-xl text-[10px] font-black uppercase tracking-widest hover:border-indigo-200 hover:text-indigo-600 transition-all shadow-sm"
              >
                  {selectedStudents.length === filteredStudents.length ? 'Deselect All' : 'Select All Filtered'}
              </button>
          </div>

          <div className="overflow-x-auto">
              <table className="w-full border-collapse">
                  <thead>
                      <tr className="text-left bg-slate-50/20">
                          <th className="p-8 text-[10px] font-black text-slate-400 uppercase tracking-widest">Select</th>
                          <th className="p-8 text-[10px] font-black text-slate-400 uppercase tracking-widest">Student Identity</th>
                          <th className="p-8 text-[10px] font-black text-slate-400 uppercase tracking-widest">Admission No</th>
                          <th className="p-8 text-[10px] font-black text-slate-400 uppercase tracking-widest">Class / Section</th>
                          <th className="p-8 text-[10px] font-black text-slate-400 uppercase tracking-widest">Roll No</th>
                          <th className="p-8 text-[10px] font-black text-slate-400 uppercase tracking-widest text-right">Status</th>
                      </tr>
                  </thead>
                  <tbody className="divide-y-2 divide-slate-50">
                      {filteredStudents.map(student => (
                          <tr 
                            key={student.id} 
                            onClick={() => toggleStudentSelection(student.id)}
                            className={`group hover:bg-slate-50/50 transition-colors cursor-pointer ${selectedStudents.includes(student.id) ? 'bg-indigo-50/30' : ''}`}
                          >
                              <td className="p-8">
                                  <div className={`w-8 h-8 rounded-xl border-2 flex items-center justify-center transition-all ${
                                      selectedStudents.includes(student.id) ? 'bg-indigo-600 border-indigo-600 shadow-lg shadow-indigo-100' : 'bg-white border-slate-200'
                                  }`}>
                                      {selectedStudents.includes(student.id) && <Check className="w-4 h-4 text-white font-bold" />}
                                  </div>
                              </td>
                              <td className="p-8">
                                  <div className="flex items-center gap-5">
                                      <div className="w-14 h-14 bg-slate-100 rounded-2xl flex items-center justify-center border-2 border-white shadow-sm overflow-hidden shrink-0">
                                          {student.photo ? <img src={student.photo} alt="" className="w-full h-full object-cover" /> : <ImageIcon className="w-6 h-6 text-slate-300" />}
                                      </div>
                                      <span className="font-black text-slate-700 tracking-tight group-hover:text-indigo-600 transition-colors">{student.name}</span>
                                  </div>
                              </td>
                              <td className="p-8">
                                  <span className="px-5 py-2.5 bg-slate-100 text-slate-600 rounded-xl text-xs font-black border border-slate-200/50 shadow-inner">
                                      {student.admissionNo}
                                  </span>
                              </td>
                              <td className="p-8">
                                  <div className="flex flex-col gap-1">
                                      <span className="text-xs font-black text-slate-600">{student.class}</span>
                                      <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">{student.section}</span>
                                  </div>
                              </td>
                              <td className="p-8 font-black text-slate-800 tracking-tighter text-lg">{student.roll}</td>
                              <td className="p-8 text-right">
                                  <span className="inline-flex items-center gap-2 px-4 py-2 bg-emerald-50 text-emerald-600 rounded-full text-[10px] font-black uppercase tracking-widest border border-emerald-100">
                                      <span className="w-1.5 h-1.5 rounded-full bg-emerald-500" />
                                      Ready
                                  </span>
                              </td>
                          </tr>
                      ))}
                      {filteredStudents.length === 0 && (
                          <tr>
                              <td colSpan="6" className="p-20 text-center">
                                  <div className="flex flex-col items-center gap-4 opacity-30">
                                      <Search className="w-16 h-16" />
                                      <p className="font-black text-xl uppercase tracking-widest">No matching students found</p>
                                  </div>
                              </td>
                          </tr>
                      )}
                  </tbody>
              </table>
          </div>
          
          <div className="p-8 flex justify-between items-center bg-slate-50/30 border-t-2 border-slate-50">
              <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">
                  Showing <span className="text-slate-800">{filteredStudents.length}</span> of <span className="text-slate-800">{students.length}</span> total entries
              </p>
              <div className="flex items-center gap-2">
                  <span className="text-[10px] font-black text-slate-400 uppercase pr-4 border-r border-slate-200">Selected: {selectedStudents.length}</span>
                  <button 
                    disabled={selectedStudents.length === 0}
                    className="flex items-center gap-2 text-indigo-500 font-black text-[10px] uppercase tracking-widest hover:translate-x-1 transition-transform disabled:opacity-30"
                  >
                      Initiate Generation <ChevronRight className="w-4 h-4" />
                  </button>
              </div>
          </div>
      </div>

      {/* Generation Preview Modal */}
      {isPreviewOpen && (
          <div className="fixed inset-0 bg-slate-900/80 backdrop-blur-xl z-[100] flex items-center justify-center p-6 sm:p-10 lg:p-20">
              <div className="bg-white rounded-[4rem] w-full h-full max-w-7xl shadow-[0_0_100px_rgba(0,0,0,0.4)] flex flex-col overflow-hidden animate-in zoom-in duration-300">
                   {/* Modal Header */}
                   <div className="p-10 border-b-2 border-slate-50 flex items-center justify-between shrink-0 bg-white">
                        <div className="flex items-center gap-6">
                            <div className="w-16 h-16 bg-indigo-600 text-white rounded-[1.5rem] flex items-center justify-center shadow-2xl shadow-indigo-200">
                                <Printer className="w-8 h-8" />
                            </div>
                            <div>
                                <h2 className="text-3xl font-black text-slate-800 tracking-tight">Print Engine Preview</h2>
                                <p className="text-xs font-black text-slate-400 uppercase tracking-[0.2em] mt-1">Template: <span className="text-indigo-500">{selectedTemplate}</span></p>
                            </div>
                        </div>
                        <div className="flex gap-4">
                            <button className="flex items-center gap-3 px-8 py-4 bg-slate-100 text-slate-600 rounded-2xl font-black text-sm hover:bg-slate-200 transition-all">
                                <Download className="w-5 h-5" /> Export PDF
                            </button>
                            <button className="flex items-center gap-3 px-8 py-4 bg-indigo-600 text-white rounded-2xl font-black text-sm hover:bg-indigo-700 shadow-xl shadow-indigo-100 transition-all">
                                <Printer className="w-5 h-5" /> Print Now
                            </button>
                            <button onClick={() => setIsPreviewOpen(false)} className="p-4 text-slate-400 hover:bg-slate-50 rounded-2xl transition-all ml-4">
                                <X className="w-8 h-8" />
                            </button>
                        </div>
                   </div>

                   {/* Preview Grid */}
                   <div className="flex-1 overflow-y-auto p-12 lg:p-20 bg-slate-100/30 custom-scrollbar">
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-12 max-w-6xl mx-auto">
                            {selectedStudents.map(id => {
                                const s = students.find(x => x.id === id);
                                return (
                                    <div key={id} className="relative group shrink-0 mx-auto">
                                        {/* Mock Student ID Card Render */}
                                        <div className="w-[300px] h-[460px] bg-white rounded-3xl shadow-2xl border border-slate-100 overflow-hidden flex flex-col scale-90 md:scale-100 transition-transform hover:scale-[1.02]">
                                            {/* Card Header */}
                                            <div className="h-[18%] bg-indigo-600 flex flex-col items-center justify-center text-white px-4">
                                                <h4 className="text-[10px] font-black uppercase tracking-[0.3em]">Institutional ID</h4>
                                                <p className="text-[7px] font-bold opacity-80 mt-1 uppercase">Madrasa Management System</p>
                                            </div>

                                            {/* Card Body */}
                                            <div className="flex-1 p-8 flex flex-col items-center gap-6">
                                                <div className="relative">
                                                     <div className="w-28 h-28 bg-slate-50 border-4 border-slate-100 rounded-3xl overflow-hidden shadow-inner flex items-center justify-center">
                                                        <ImageIcon className="w-12 h-12 text-slate-200" />
                                                     </div>
                                                     <div className="absolute -bottom-2 -right-2 w-8 h-8 bg-emerald-500 text-white rounded-xl flex items-center justify-center shadow-lg border-2 border-white">
                                                        <CheckCircle2 className="w-4 h-4" />
                                                     </div>
                                                </div>

                                                <div className="text-center space-y-1">
                                                    <h3 className="text-xl font-black text-slate-800 uppercase tracking-tight leading-none">{s.name}</h3>
                                                    <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">{s.admissionNo}</p>
                                                </div>

                                                <div className="w-full space-y-3 pt-4 border-t-2 border-slate-50">
                                                    <div className="flex justify-between items-center text-[9px] font-black uppercase tracking-widest text-slate-400">
                                                        <span>Class:</span> <span className="text-slate-800">{s.class}</span>
                                                    </div>
                                                    <div className="flex justify-between items-center text-[9px] font-black uppercase tracking-widest text-slate-400">
                                                        <span>Section:</span> <span className="text-slate-800">{s.section}</span>
                                                    </div>
                                                    <div className="flex justify-between items-center text-[9px] font-black uppercase tracking-widest text-slate-400">
                                                        <span>Roll No:</span> <span className="text-slate-800">{s.roll}</span>
                                                    </div>
                                                    <div className="flex justify-between items-center text-[9px] font-black uppercase tracking-widest text-slate-400">
                                                        <span>Blood Grp:</span> <span className="text-rose-600">{s.blood}</span>
                                                    </div>
                                                </div>
                                            </div>

                                            {/* Card Footer */}
                                            <div className="h-[12%] bg-slate-900 flex items-center justify-center px-8 relative overflow-hidden">
                                                <div className="absolute inset-0 bg-indigo-500/10 skew-x-12" />
                                                <div className="w-full h-8 flex items-center justify-center gap-2">
                                                    <div className="h-0.5 bg-white/20 flex-1 rounded-full" />
                                                    <div className="px-3 py-1 bg-white/10 rounded-full">
                                                        <div className="w-12 h-2 border-t border-dashed border-white/40" />
                                                    </div>
                                                    <div className="h-0.5 bg-white/20 flex-1 rounded-full" />
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                );
                            })}
                        </div>
                   </div>

                   {/* Modal Footer Info */}
                   <div className="p-8 bg-slate-50 border-t-2 border-slate-100 flex items-center justify-center gap-8 text-[10px] font-black text-slate-400 uppercase tracking-widest shrink-0">
                       <span className="flex items-center gap-2"><CreditCard className="w-4 h-4" /> Print Ready: High Fidelity</span>
                       <div className="w-1 h-1 rounded-full bg-slate-300" />
                       <span className="flex items-center gap-2"><CheckCircle2 className="w-4 h-4 text-emerald-500" /> Data Validation: Success</span>
                       <div className="w-1 h-1 rounded-full bg-slate-300" />
                       <span className="flex items-center gap-2">Total Sheets: {Math.ceil(selectedStudents.length / 9)} A4 Pages</span>
                   </div>
              </div>
          </div>
      )}
    </div>
  );
};

export default StudentIdCard;
