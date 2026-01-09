import { useState } from "react";
import { 
  Briefcase, 
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
  List as ListIcon,
  Image as ImageIcon,
  Check,
  Building2,
  UserCheck
} from "lucide-react";

const EmployeeIdCard = () => {
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedDept, setSelectedDept] = useState("All Departments");
  const [selectedDesignation, setSelectedDesignation] = useState("All Designations");
  const [selectedTemplate, setSelectedTemplate] = useState("Professional Employee Card");
  
  const [selectedEmployees, setSelectedEmployees] = useState([]);
  const [isPreviewOpen, setIsPreviewOpen] = useState(false);

  // Sample Data
  const departments = ["All Departments", "Academic", "Administration", "Accounts", "Library", "Maintenance"];
  const designations = ["All Designations", "Principal", "Muhtamim", "Teacher", "Accountant", "Librarian", "Coordinator"];
  const templates = ["Professional Employee Card", "Modern Corporate Card", "Executive Design"];

  const employees = [
    { id: 1, name: "Maulana Abu Bakr", employeeId: "EMP001", department: "Academic", designation: "Principal", blood: "A+", photo: null },
    { id: 2, name: "Sheikh Ahmadullah", employeeId: "EMP002", department: "Administration", designation: "Muhtamim", blood: "O+", photo: null },
    { id: 3, name: "Abdur Rahman", employeeId: "EMP005", department: "Academic", designation: "Teacher", blood: "B+", photo: null },
    { id: 4, name: "Sajid Hasan", employeeId: "EMP009", department: "Accounts", designation: "Accountant", blood: "AB-", photo: null },
    { id: 5, name: "Ibrahim Khalil", employeeId: "EMP012", department: "Library", designation: "Librarian", blood: "O-", photo: null },
  ];

  const filteredEmployees = employees.filter(e => 
    (selectedDept === "All Departments" || e.department === selectedDept) &&
    (selectedDesignation === "All Designations" || e.designation === selectedDesignation) &&
    (e.name.toLowerCase().includes(searchTerm.toLowerCase()) || e.employeeId.includes(searchTerm))
  );

  const toggleEmployeeSelection = (employeeId) => {
    setSelectedEmployees(prev => 
      prev.includes(employeeId) 
        ? prev.filter(id => id !== employeeId) 
        : [...prev, employeeId]
    );
  };

  const selectAll = () => {
    if (selectedEmployees.length === filteredEmployees.length) {
      setSelectedEmployees([]);
    } else {
      setSelectedEmployees(filteredEmployees.map(e => e.id));
    }
  };

  return (
    <div className="space-y-10 animate-in fade-in duration-500 p-6 md:p-10 text-slate-800">
      {/* Header */}
      <div className="bg-white rounded-[3rem] border-2 border-slate-200 p-10 flex flex-col lg:flex-row justify-between items-center gap-8 shadow-sm relative overflow-hidden">
        <div className="flex items-center gap-8 relative z-10">
          <div className="w-20 h-20 bg-emerald-50 rounded-[2rem] flex items-center justify-center border-2 border-emerald-100/50 shadow-inner">
            <Briefcase className="w-10 h-10 text-emerald-600" />
          </div>
          <div>
            <h1 className="text-3xl md:text-4xl font-black tracking-tight text-center lg:text-left">Employee ID Cards</h1>
            <p className="text-slate-500 font-bold mt-2 text-lg text-center lg:text-left">Generate professional identification for your staff</p>
          </div>
        </div>

        <div className="flex flex-col sm:flex-row gap-4 w-full lg:w-auto">
            <button 
                disabled={selectedEmployees.length === 0}
                onClick={() => setIsPreviewOpen(true)}
                className="px-8 py-5 bg-emerald-600 text-white rounded-[1.5rem] font-black shadow-2xl shadow-emerald-100 hover:bg-emerald-700 hover:scale-[1.02] active:scale-95 transition-all flex items-center justify-center gap-3 disabled:opacity-50 disabled:scale-100 disabled:shadow-none"
            >
                <Eye className="w-6 h-6" />
                Preview Selection ({selectedEmployees.length})
            </button>
        </div>
      </div>

      {/* Control Panel */}
      <div className="grid grid-cols-1 xl:grid-cols-4 gap-6">
          {/* Filters */}
          <div className="xl:col-span-3 bg-white rounded-[2.5rem] border-2 border-slate-100 p-6 flex flex-col md:row-span-1 md:flex-row gap-6 shadow-sm">
              <div className="flex-1 space-y-2">
                  <label className="text-[10px] font-black text-slate-400 uppercase ml-2 flex items-center gap-1.5"><Building2 className="w-3 h-3" /> Department</label>
                  <select 
                    value={selectedDept}
                    onChange={(e) => setSelectedDept(e.target.value)}
                    className="w-full bg-slate-50 border-2 border-slate-100 rounded-2xl px-5 py-4 text-sm font-bold focus:border-emerald-500 outline-none transition-all appearance-none cursor-pointer"
                  >
                      {departments.map(d => <option key={d}>{d}</option>)}
                  </select>
              </div>
              <div className="flex-1 space-y-2">
                  <label className="text-[10px] font-black text-slate-400 uppercase ml-2 flex items-center gap-1.5"><UserCheck className="w-3 h-3" /> Designation</label>
                  <select 
                    value={selectedDesignation}
                    onChange={(e) => setSelectedDesignation(e.target.value)}
                    className="w-full bg-slate-50 border-2 border-slate-100 rounded-2xl px-5 py-4 text-sm font-bold focus:border-emerald-500 outline-none transition-all appearance-none cursor-pointer"
                  >
                      {designations.map(d => <option key={d}>{d}</option>)}
                  </select>
              </div>
              <div className="flex-1 space-y-2">
                  <label className="text-[10px] font-black text-slate-400 uppercase ml-2 flex items-center gap-1.5"><CreditCard className="w-3 h-3" /> ID Template</label>
                  <select 
                    value={selectedTemplate}
                    onChange={(e) => setSelectedTemplate(e.target.value)}
                    className="w-full bg-slate-50 border-2 border-slate-100 rounded-2xl px-5 py-4 text-sm font-bold focus:border-emerald-500 outline-none transition-all appearance-none cursor-pointer"
                  >
                      {templates.map(t => <option key={t}>{t}</option>)}
                  </select>
              </div>
          </div>

          {/* Search */}
          <div className="bg-white rounded-[2.5rem] border-2 border-slate-100 p-6 flex items-end shadow-sm">
              <div className="w-full space-y-2">
                  <label className="text-[10px] font-black text-slate-400 uppercase ml-2">Staff Lookup</label>
                  <div className="relative">
                      <Search className="absolute left-5 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-300" />
                      <input 
                        placeholder="Name or Employee ID..."
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                        className="w-full bg-slate-50 border-none rounded-2xl pl-14 pr-6 py-4 text-sm font-bold placeholder:text-slate-300 outline-none focus:ring-2 ring-emerald-500/20 transition-all"
                      />
                  </div>
              </div>
          </div>
      </div>

      {/* Employee List */}
      <div className="bg-white rounded-[3rem] border-2 border-slate-100 shadow-xl shadow-slate-100/20 overflow-hidden relative">
          <div className="p-8 border-b-2 border-slate-50 flex justify-between items-center bg-slate-50/30">
              <div className="flex items-center gap-4">
                  <div className="w-12 h-12 bg-emerald-50 rounded-2xl flex items-center justify-center border border-emerald-100">
                      <ListIcon className="w-6 h-6 text-emerald-500" />
                  </div>
                  <div>
                      <h3 className="text-xl font-black tracking-tight">Staff Inventory</h3>
                      <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mt-0.5">Verified Employees</p>
                  </div>
              </div>
              
              <button 
                onClick={selectAll}
                className="px-6 py-3 bg-white border-2 border-slate-100 rounded-xl text-[10px] font-black uppercase tracking-widest hover:border-emerald-200 hover:text-emerald-600 transition-all shadow-sm"
              >
                  {selectedEmployees.length === filteredEmployees.length ? 'Deselect All' : 'Select All Filtered'}
              </button>
          </div>

          <div className="overflow-x-auto">
              <table className="w-full border-collapse">
                  <thead>
                      <tr className="text-left bg-slate-50/20">
                          <th className="p-8 text-[10px] font-black text-slate-400 uppercase tracking-widest">Select</th>
                          <th className="p-8 text-[10px] font-black text-slate-400 uppercase tracking-widest">Employee Profile</th>
                          <th className="p-8 text-[10px] font-black text-slate-400 uppercase tracking-widest">Employee ID</th>
                          <th className="p-8 text-[10px] font-black text-slate-400 uppercase tracking-widest">Department</th>
                          <th className="p-8 text-[10px] font-black text-slate-400 uppercase tracking-widest">Designation</th>
                          <th className="p-8 text-[10px] font-black text-slate-400 uppercase tracking-widest text-right">Verification</th>
                      </tr>
                  </thead>
                  <tbody className="divide-y-2 divide-slate-50">
                      {filteredEmployees.map(employee => (
                          <tr 
                            key={employee.id} 
                            onClick={() => toggleEmployeeSelection(employee.id)}
                            className={`group hover:bg-slate-50/50 transition-colors cursor-pointer ${selectedEmployees.includes(employee.id) ? 'bg-emerald-50/30' : ''}`}
                          >
                              <td className="p-8">
                                  <div className={`w-8 h-8 rounded-xl border-2 flex items-center justify-center transition-all ${
                                      selectedEmployees.includes(employee.id) ? 'bg-emerald-600 border-emerald-600 shadow-lg shadow-emerald-100' : 'bg-white border-slate-200'
                                  }`}>
                                      {selectedEmployees.includes(employee.id) && <Check className="w-4 h-4 text-white font-bold" />}
                                  </div>
                              </td>
                              <td className="p-8">
                                  <div className="flex items-center gap-5">
                                      <div className="w-14 h-14 bg-slate-100 rounded-2xl flex items-center justify-center border-2 border-white shadow-sm overflow-hidden shrink-0">
                                          {employee.photo ? <img src={employee.photo} alt="" className="w-full h-full object-cover" /> : <ImageIcon className="w-6 h-6 text-slate-300" />}
                                      </div>
                                      <span className="font-black text-slate-700 tracking-tight group-hover:text-emerald-600 transition-colors uppercase">{employee.name}</span>
                                  </div>
                              </td>
                              <td className="p-8">
                                  <span className="px-5 py-2.5 bg-slate-900 text-white rounded-xl text-xs font-mono font-bold shadow-2xl shadow-slate-200">
                                      {employee.employeeId}
                                  </span>
                              </td>
                              <td className="p-8">
                                  <div className="flex items-center gap-2">
                                      <Building2 className="w-3.5 h-3.5 text-slate-300" />
                                      <span className="text-xs font-black text-slate-600 uppercase tracking-tight">{employee.department}</span>
                                  </div>
                              </td>
                              <td className="p-8 font-black text-emerald-600 tracking-widest uppercase text-[10px]">{employee.designation}</td>
                              <td className="p-8 text-right">
                                  <div className="flex items-center justify-end gap-2 text-emerald-500 animate-in fade-in slide-in-from-right duration-500">
                                      <span className="text-[10px] font-black uppercase tracking-[0.2em]">Verified</span>
                                      <CheckCircle2 className="w-4 h-4" />
                                  </div>
                              </td>
                          </tr>
                      ))}
                      {filteredEmployees.length === 0 && (
                          <tr>
                              <td colSpan="6" className="p-20 text-center">
                                  <div className="flex flex-col items-center gap-4 opacity-30">
                                      <Search className="w-16 h-16 text-slate-300" />
                                      <p className="font-black text-xl uppercase tracking-widest text-slate-400">Employee not located in grid</p>
                                  </div>
                              </td>
                          </tr>
                      )}
                  </tbody>
              </table>
          </div>
          
          <div className="p-8 flex justify-between items-center bg-slate-50/30 border-t-2 border-slate-50">
              <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">
                  Total Staff Mapped: <span className="text-slate-800">{filteredEmployees.length} Units</span>
              </p>
              <div className="flex items-center gap-2">
                  <span className="text-[10px] font-black text-slate-400 uppercase pr-4 border-r border-slate-200">Batched: {selectedEmployees.length} Profiles</span>
                  <button 
                    disabled={selectedEmployees.length === 0}
                    className="flex items-center gap-2 text-emerald-600 font-black text-[10px] uppercase tracking-widest hover:translate-x-1 transition-transform disabled:opacity-30"
                  >
                      Initiate Laser Print <ChevronRight className="w-4 h-4" />
                  </button>
              </div>
          </div>
      </div>

      {/* Generation Preview Modal */}
      {isPreviewOpen && (
          <div className="fixed inset-0 bg-slate-900/90 backdrop-blur-2xl z-[100] flex items-center justify-center p-6 sm:p-10 lg:p-20">
              <div className="bg-white rounded-[4rem] w-full h-full max-w-7xl shadow-[0_0_120px_rgba(0,0,0,0.5)] flex flex-col overflow-hidden animate-in fade-in zoom-in duration-500">
                   {/* Modal Header */}
                   <div className="p-10 border-b-2 border-slate-50 flex items-center justify-between shrink-0 bg-white relative z-10">
                        <div className="flex items-center gap-6">
                            <div className="w-16 h-16 bg-slate-900 text-white rounded-[1.8rem] flex items-center justify-center shadow-2xl">
                                <Printer className="w-8 h-8" />
                            </div>
                            <div>
                                <h2 className="text-3xl font-black text-slate-800 tracking-tighter uppercase">Corporate Print Interface</h2>
                                <p className="text-xs font-black text-slate-400 uppercase tracking-[0.3em] mt-1">Design Schema: <span className="text-emerald-500">{selectedTemplate}</span></p>
                            </div>
                        </div>
                        <div className="flex gap-4">
                            <button className="flex items-center gap-3 px-8 py-4 bg-slate-50 text-slate-600 rounded-2xl font-black text-sm hover:bg-slate-100 transition-all border-2 border-slate-100">
                                <Download className="w-5 h-5" /> Archive PDF
                            </button>
                            <button className="flex items-center gap-3 px-8 py-4 bg-slate-900 text-white rounded-2xl font-black text-sm hover:bg-black shadow-2xl transition-all">
                                <Printer className="w-5 h-5" /> Process Batch
                            </button>
                            <button onClick={() => setIsPreviewOpen(false)} className="p-4 text-slate-300 hover:text-rose-500 hover:bg-rose-50 rounded-2xl transition-all ml-4">
                                <X className="w-8 h-8" />
                            </button>
                        </div>
                   </div>

                   {/* Preview Grid (Horizontal Template Preview) */}
                   <div className="flex-1 overflow-y-auto p-12 lg:p-20 bg-slate-50/50 custom-scrollbar">
                        <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 max-w-6xl mx-auto">
                            {selectedEmployees.map(id => {
                                const e = employees.find(x => x.id === id);
                                return (
                                    <div key={id} className="relative group shrink-0 mx-auto w-full max-w-[500px]">
                                        {/* Horizontal Professional Employee ID Card */}
                                        <div className="aspect-[1.6/1] bg-white rounded-[2.5rem] shadow-2xl border border-slate-100 overflow-hidden flex flex-row transition-all hover:scale-[1.02] hover:shadow-emerald-100/50">
                                            {/* Left accent strip */}
                                            <div className="w-12 bg-slate-900 flex flex-col items-center py-6 justify-between text-white shrink-0">
                                                <div className="w-6 h-6 bg-emerald-500 rounded-lg flex items-center justify-center">
                                                    <Briefcase className="w-3 h-3 text-white" />
                                                </div>
                                                <div className="rotate-[-90deg] whitespace-nowrap text-[8px] font-black uppercase tracking-[0.5em] text-white/40 mb-10 translate-x-[-2px]">
                                                    IDENTIFICATION CARD
                                                </div>
                                                <div className="w-6 h-6 border-2 border-white/20 rounded-full" />
                                            </div>

                                            {/* Main Content Area */}
                                            <div className="flex-1 flex flex-col p-8">
                                                <div className="flex justify-between items-start mb-6">
                                                     <div className="space-y-1">
                                                        <h4 className="text-[10px] font-black text-emerald-600 uppercase tracking-widest leading-none">Employee Profile</h4>
                                                        <h3 className="text-2xl font-black text-slate-800 tracking-tighter uppercase leading-none">{e.name}</h3>
                                                     </div>
                                                     <div className="px-3 py-1.5 bg-slate-100 rounded-lg text-[9px] font-mono font-bold text-slate-500">
                                                        #{e.employeeId}
                                                     </div>
                                                </div>

                                                <div className="flex gap-8 items-center flex-1">
                                                    <div className="w-32 h-32 bg-slate-50 border-4 border-slate-100 rounded-[2rem] overflow-hidden shadow-inner flex items-center justify-center shrink-0">
                                                        <ImageIcon className="w-12 h-12 text-slate-200" />
                                                    </div>
                                                    <div className="flex-1 grid grid-cols-1 gap-4">
                                                        <div className="space-y-1 pb-3 border-b border-slate-50">
                                                            <p className="text-[8px] font-black text-slate-400 uppercase tracking-widest">Designation</p>
                                                            <p className="text-sm font-black text-slate-700 uppercase tracking-tight">{e.designation}</p>
                                                        </div>
                                                        <div className="space-y-1">
                                                            <p className="text-[8px] font-black text-slate-400 uppercase tracking-widest">Department</p>
                                                            <p className="text-sm font-black text-slate-700 uppercase tracking-tight">{e.department}</p>
                                                        </div>
                                                    </div>
                                                </div>

                                                <div className="mt-6 flex justify-between items-center bg-slate-50 p-4 rounded-2xl border border-slate-100">
                                                     <div className="flex items-center gap-3">
                                                         <div className="w-2 h-2 rounded-full bg-emerald-500" />
                                                         <span className="text-[9px] font-black text-slate-400 uppercase tracking-widest">Blood: <span className="text-rose-600">{e.blood}</span></span>
                                                     </div>
                                                     <div className="flex flex-col items-center">
                                                         <div className="w-16 h-4 border-b-2 border-slate-200 mb-1" />
                                                         <span className="text-[7px] font-black text-slate-300 uppercase">Auth Signature</span>
                                                     </div>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                );
                            })}
                        </div>
                   </div>

                   {/* Modal Footer Info */}
                   <div className="p-10 bg-white border-t-2 border-slate-50 flex items-center justify-between shrink-0 box-content">
                       <div className="flex gap-10">
                            <div className="flex flex-col gap-1">
                                <span className="text-[9px] font-black text-slate-400 uppercase tracking-widest">Output Format</span>
                                <span className="text-xs font-black text-slate-700">CMYK 300DPI 4.0</span>
                            </div>
                            <div className="flex flex-col gap-1">
                                <span className="text-[9px] font-black text-slate-400 uppercase tracking-widest">Encryption</span>
                                <span className="text-xs font-black text-slate-700">AES-256 Bit Verified</span>
                            </div>
                       </div>
                       <div className="text-right">
                           <p className="text-[10px] font-black text-slate-400 uppercase tracking-[0.3em]">Institutional Verification Terminal</p>
                       </div>
                   </div>
              </div>
          </div>
      )}
    </div>
  );
};

export default EmployeeIdCard;
