import { useState } from "react";
import { 
  Award, 
  Search, 
  Filter, 
  ChevronRight, 
  CheckCircle2, 
  Users, 
  Download, 
  Printer, 
  FileCheck,
  Layout,
  Star,
  RefreshCw,
  Eye
} from "lucide-react";

const GenerateStudentCertificate = () => {
  const [selectedClass, setSelectedClass] = useState("");
  const [selectedSection, setSelectedSection] = useState("");
  const [selectedTemplate, setSelectedTemplate] = useState("");
  const [selectedStudents, setSelectedStudents] = useState([]);

  const students = [
    { id: 1, name: "Abdullah Al Mamun", roll: "101", class: "Six", section: "A", photo: null },
    { id: 2, name: "Fatima Tuz Zahra", roll: "102", class: "Six", section: "A", photo: null },
    { id: 3, name: "Omar Faruk", roll: "103", class: "Six", section: "B", photo: null },
    { id: 4, name: "Aisha Siddiqua", roll: "104", class: "Seven", section: "A", photo: null },
    { id: 5, name: "Zubair Ahmed", roll: "105", class: "Eight", section: "C", photo: null },
  ];

  const templates = [
    { id: 1, name: "Academic Excellence 2026" },
    { id: 2, name: "Monthly Best Student" },
    { id: 3, name: "Sports Day Winner" },
  ];

  const toggleStudent = (id) => {
    setSelectedStudents(prev => 
      prev.includes(id) ? prev.filter(s => s !== id) : [...prev, id]
    );
  };

  const selectAll = () => {
    if (selectedStudents.length === students.length) {
      setSelectedStudents([]);
    } else {
      setSelectedStudents(students.map(s => s.id));
    }
  };

  return (
    <div className="min-h-screen bg-slate-50/50 p-4 md:p-8 animate-in fade-in duration-500">
      <div className="max-w-[1600px] mx-auto space-y-8">
        
        {/* Header Section */}
        <div className="bg-white rounded-[2.5rem] border border-slate-200 p-8 shadow-sm flex flex-col lg:flex-row justify-between items-center gap-6">
          <div className="flex items-center gap-6">
            <div className="w-16 h-16 bg-amber-50 rounded-2xl flex items-center justify-center border border-amber-100 shadow-inner">
              <Star className="w-8 h-8 text-amber-500" />
            </div>
            <div>
              <h1 className="text-xl md:text-xl font-black text-slate-800 tracking-tight">Generate Student Certificates</h1>
              <p className="text-slate-500 font-bold mt-1">Bulk generate and print custom certificates for students</p>
            </div>
          </div>

          <div className="flex gap-4 w-full lg:w-auto">
            <button className="flex-1 lg:flex-none px-8 py-4 bg-slate-100 text-slate-600 rounded-2xl font-black hover:bg-slate-200 transition-all flex items-center justify-center gap-3">
              <RefreshCw className="w-5 h-5" />
              Reset
            </button>
            <button disabled={selectedStudents.length === 0} className="flex-[2] lg:flex-none px-8 py-4 bg-amber-500 text-white rounded-2xl font-black shadow-xl shadow-amber-100 hover:bg-amber-600 disabled:opacity-50 disabled:shadow-none hover:scale-[1.02] active:scale-95 transition-all flex items-center justify-center gap-3">
              <Printer className="w-5 h-5" />
              Print Selected ({selectedStudents.length})
            </button>
          </div>
        </div>

        <div >
          
          {/* Left: Configuration Sidebar */}
          <div >
            <div className="bg-white rounded-[2.5rem] border border-slate-200 p-8 shadow-sm space-y-2">
              <div className="flex items-center gap-3 pb-6 border-b border-slate-50">
                <Filter className="w-5 h-5 text-indigo-500" />
                <h2 className="text-xl font-black text-slate-800 tracking-tight">Configuration</h2>
              </div>

              <div className="grid grid-cols-1 xl:grid-cols-4 gap-5">
                <div className="">
                  <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Select Template</label>
                  <select 
                    className="w-full bg-slate-50 border border-slate-100 rounded-2xl px-6 py-4 text-sm font-bold focus:border-amber-500 outline-none appearance-none cursor-pointer"
                    onChange={(e) => setSelectedTemplate(e.target.value)}
                  >
                    <option value="">Choose a Template</option>
                    {templates.map(t => <option key={t.id} value={t.id}>{t.name}</option>)}
                  </select>
                </div>

                <div className="">
                  <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Academic Class</label>
                  <select 
                    className="w-full bg-slate-50 border border-slate-100 rounded-2xl px-6 py-4 text-sm font-bold focus:border-amber-500 outline-none appearance-none cursor-pointer"
                    onChange={(e) => setSelectedClass(e.target.value)}
                  >
                    <option value="">All Classes</option>
                    <option value="6">Six</option>
                    <option value="7">Seven</option>
                  </select>
                </div>

                <div className="">
                  <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Section</label>
                  <select 
                    className="w-full bg-slate-50 border border-slate-100 rounded-2xl px-6 py-4 text-sm font-bold focus:border-amber-500 outline-none appearance-none cursor-pointer"
                    onChange={(e) => setSelectedSection(e.target.value)}
                  >
                    <option value="">All Sections</option>
                    <option value="A">Section A</option>
                    <option value="B">Section B</option>
                  </select>
                </div>

                <div className="flex items-center h-full">
                   <button className="w-full p-3 bg-slate-900 text-white rounded-2xl font-black shadow-xl shadow-slate-200 hover:bg-slate-800 transition-all flex items-center justify-center gap-3">
                  <Search className="w-5 h-5" />
                  Apply Filter
                </button>
               </div>
              </div>
            </div>

          
          </div>

          {/* Right: Student List */}
          <div className="xl:col-span-3 space-y-6 mt-6">
            <div className="bg-white rounded-[2.5rem] border border-slate-200 shadow-sm overflow-hidden">
              <div className="p-8 border-b border-slate-100 flex items-center justify-between bg-slate-50/50">
                <div className="flex items-center gap-4">
                  <Users className="w-6 h-6 text-slate-400" />
                  <h2 className="text-xl font-black text-slate-800 tracking-tight">Select Students</h2>
                </div>
                <button 
                  onClick={selectAll}
                  className="px-6 py-2 bg-white border border-slate-200 rounded-xl text-xs font-black uppercase tracking-widest text-slate-600 hover:bg-indigo-50 hover:text-indigo-600 transition-all shadow-sm"
                >
                  {selectedStudents.length === students.length ? "Deselect All" : "Select All Class"}
                </button>
              </div>

              <div className="overflow-x-auto">
                <table className="w-full border-collapse">
                  <thead>
                    <tr className="border-b border-slate-50">
                      <th className="px-8 py-5 text-left text-[10px] font-black text-slate-400 uppercase tracking-widest w-16">Select</th>
                      <th className="px-8 py-5 text-left text-[10px] font-black text-slate-400 uppercase tracking-widest">Student Info</th>
                      <th className="px-8 py-5 text-left text-[10px] font-black text-slate-400 uppercase tracking-widest text-center">Class / Section</th>
                      <th className="px-8 py-5 text-left text-[10px] font-black text-slate-400 uppercase tracking-widest text-right">Actions</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-50">
                    {students.map((student) => (
                      <tr 
                        key={student.id} 
                        onClick={() => toggleStudent(student.id)}
                        className={`group cursor-pointer transition-all duration-300 ${selectedStudents.includes(student.id) ? 'bg-amber-50/30' : 'hover:bg-slate-50/50'}`}
                      >
                        <td className="px-8 py-6">
                          <div className={`w-6 h-6 rounded-lg border-2 flex items-center justify-center transition-all ${
                            selectedStudents.includes(student.id) 
                              ? 'bg-amber-500 border-amber-500 shadow-lg shadow-amber-200' 
                              : 'border-slate-200 group-hover:border-amber-300'
                          }`}>
                            {selectedStudents.includes(student.id) && <CheckCircle2 className="w-4 h-4 text-white" />}
                          </div>
                        </td>
                        <td className="px-8 py-6">
                          <div className="flex items-center gap-4">
                            <div className="w-12 h-12 bg-slate-100 rounded-2xl flex items-center justify-center border-2 border-white shadow-sm overflow-hidden group-hover:scale-110 transition-transform">
                              {student.photo ? <img src={student.photo} alt="" /> : <span className="font-black text-slate-400 uppercase">{student.name.charAt(0)}</span>}
                            </div>
                            <div>
                              <p className="text-sm font-black text-slate-800 group-hover:text-amber-600 transition-colors">{student.name}</p>
                              <p className="text-[11px] font-bold text-slate-400">Roll: {student.roll}</p>
                            </div>
                          </div>
                        </td>
                        <td className="px-8 py-6">
                          <div className="flex items-center justify-center gap-2">
                             <div className="px-3 py-1 bg-white border border-slate-200 rounded-lg text-[10px] font-black text-slate-600 shadow-sm">{student.class}</div>
                             <div className="px-3 py-1 bg-white border border-slate-200 rounded-lg text-[10px] font-black text-amber-600 shadow-sm">{student.section}</div>
                          </div>
                        </td>
                        <td className="px-8 py-6 text-right">
                          <div className="flex items-center justify-end gap-3 opacity-0 group-hover:opacity-100 transition-opacity">
                            <button className="p-2.5 bg-white border border-slate-200 rounded-xl text-slate-400 hover:text-indigo-600 hover:border-indigo-200 shadow-sm">
                              <Eye className="w-4 h-4" />
                            </button>
                            <button className="p-2.5 bg-white border border-slate-200 rounded-xl text-slate-400 hover:text-amber-600 hover:border-amber-200 shadow-sm">
                              <Download className="w-4 h-4" />
                            </button>
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>

              {/* Empty State */}
              {students.length === 0 && (
                <div className="p-20 flex flex-col items-center justify-center text-center">
                  <div className="w-20 h-20 bg-slate-50 rounded-3xl flex items-center justify-center mb-6">
                    <Search className="w-10 h-10 text-slate-200" />
                  </div>
                  <h3 className="text-xl font-black text-slate-400">No Students Found</h3>
                  <p className="text-slate-400 text-sm font-bold mt-2">Adjust your filters to see student list</p>
                </div>
              )}
            </div>
          </div>
        </div>

      </div>
    </div>
  );
};

export default GenerateStudentCertificate;
