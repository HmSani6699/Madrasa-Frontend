import { useState } from "react";
import { 
  Award, 
  Search, 
  Filter, 
  CheckCircle2, 
  Briefcase, 
  Download, 
  Printer, 
  RefreshCw,
  Eye,
  Building2,
  UserCheck,
  Users
} from "lucide-react";

const GenerateEmployeeCertificate = () => {
  const [selectedDept, setSelectedDept] = useState("");
  const [selectedDesig, setSelectedDesig] = useState("");
  const [selectedTemplate, setSelectedTemplate] = useState("");
  const [selectedEmployees, setSelectedEmployees] = useState([]);

  const employees = [
    { id: 1, name: "Maulana Abdur Rashid", desig: "Senior Teacher", dept: "Academic", photo: null },
    { id: 2, name: "Hafiz Ahmed Ullah", desig: "Hifz Teacher", dept: "Hifz", photo: null },
    { id: 3, name: "Zaid Bin Harith", desig: "Accountant", dept: "Administration", photo: null },
    { id: 4, name: "Maryam Khatun", desig: "Teacher", dept: "Academic", photo: null },
  ];

  const templates = [
    { id: 1, name: "Employee of the Month" },
    { id: 2, name: "Service Excellence Award" },
    { id: 3, name: "Long Service Recognition" },
  ];

  const toggleEmployee = (id) => {
    setSelectedEmployees(prev => 
      prev.includes(id) ? prev.filter(e => e !== id) : [...prev, id]
    );
  };

  return (
    <div className="min-h-screen bg-slate-50/50 p-4 md:p-8 animate-in fade-in duration-500">
      <div className="max-w-[1600px] mx-auto space-y-8">
        
        {/* Header Section */}
        <div className="bg-white rounded-[2.5rem] border border-slate-200 p-8 shadow-sm flex flex-col lg:flex-row justify-between items-center gap-">
          <div className="flex items-center gap-6">
            <div className="w-16 h-16 bg-blue-50 rounded-2xl flex items-center justify-center border border-blue-100 shadow-inner">
              <UserCheck className="w-8 h-8 text-blue-600" />
            </div>
            <div>
              <h1 className="text-xl md:text-xl font-black text-slate-800 tracking-tight">Generate Employee Certificates</h1>
              <p className="text-slate-500 font-bold mt-1">Recognize staff achievements with custom certificates</p>
            </div>
          </div>

          <div className="flex gap-4 w-full lg:w-auto">
            <button className="flex-1 lg:flex-none px-8 py-4 bg-slate-100 text-slate-600 rounded-2xl font-black hover:bg-slate-200 transition-all flex items-center justify-center gap-3">
              <RefreshCw className="w-5 h-5" />
              Reset
            </button>
            <button disabled={selectedEmployees.length === 0} className="flex-[2] lg:flex-none px-8 py-4 bg-blue-600 text-white rounded-2xl font-black shadow-xl shadow-blue-100 hover:bg-blue-700 disabled:opacity-50 disabled:shadow-none hover:scale-[1.02] active:scale-95 transition-all flex items-center justify-center gap-3">
              <Printer className="w-5 h-5" />
              Print Selected ({selectedEmployees.length})
            </button>
          </div>
        </div>

        <div className="">
          
          {/* Left: Configuration Sidebar */}
          <div className="">
            <div className="bg-white rounded-[2.5rem] border border-slate-200 p-8 shadow-sm space-y-2">
              <div className="flex items-center gap-3  border-b border-slate-50">
                <Filter className="w-5 h-5 text-blue-500" />
                <h2 className="text-xl font-black text-slate-800 tracking-tight">Filters</h2>
              </div>

              <div className="grid grid-cols-1 xl:grid-cols-4 gap-5">
                <div className="">
                  <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Select Template</label>
                  <select className="w-full bg-slate-50 border border-slate-100 rounded-2xl px-6 py-4 text-sm font-bold focus:border-blue-500 outline-none appearance-none cursor-pointer">
                    <option value="">Choose a Template</option>
                    {templates.map(t => <option key={t.id} value={t.id}>{t.name}</option>)}
                  </select>
                </div>

                <div className="">
                  <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Department</label>
                  <select className="w-full bg-slate-50 border border-slate-100 rounded-2xl px-6 py-4 text-sm font-bold focus:border-blue-500 outline-none appearance-none cursor-pointer">
                    <option value="">All Departments</option>
                    <option value="Academic">Academic</option>
                    <option value="Administration">Administration</option>
                  </select>
                </div>

                <div className="">
                  <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Designation</label>
                  <select className="w-full bg-slate-50 border border-slate-100 rounded-2xl px-6 py-4 text-sm font-bold focus:border-blue-500 outline-none appearance-none cursor-pointer">
                    <option value="">All Designations</option>
                    <option value="Teacher">Teacher</option>
                    <option value="Senior Teacher">Senior Teacher</option>
                  </select>
                </div>

                <button className="w-full py-4 bg-slate-900 text-white rounded-2xl font-black shadow-xl shadow-slate-200 hover:bg-slate-800 transition-all flex items-center justify-center gap-3">
                  <Search className="w-5 h-5" />
                  Search Staff
                </button>
              </div>
            </div>
          </div>

          {/* Right: Employee List */}
          <div className="xl:col-span-3 space-y-6 mt-5">
            <div className="bg-white rounded-[2.5rem] border border-slate-200 shadow-sm overflow-hidden">
              <div className="p-8 border-b border-slate-100 flex items-center justify-between bg-slate-50/50">
                <div className="flex items-center gap-4">
                  <Users className="w-6 h-6 text-slate-400" />
                  <h2 className="text-xl font-black text-slate-800 tracking-tight">Select Staff Members</h2>
                </div>
                <div className="flex gap-2">
                   <div className="px-4 py-2 bg-blue-50 text-blue-600 rounded-xl text-xs font-black uppercase tracking-widest flex items-center gap-2">
                     <UserCheck className="w-4 h-4" />
                     {selectedEmployees.length} Selected
                   </div>
                </div>
              </div>

              <div className="overflow-x-auto">
                <table className="w-full border-collapse">
                  <thead>
                    <tr className="border-b border-slate-50">
                      <th className="px-8 py-5 text-left text-[10px] font-black text-slate-400 uppercase tracking-widest w-16">Select</th>
                      <th className="px-8 py-5 text-left text-[10px] font-black text-slate-400 uppercase tracking-widest">Employee Profile</th>
                      <th className="px-8 py-5 text-left text-[10px] font-black text-slate-400 uppercase tracking-widest">Department</th>
                      <th className="px-8 py-5 text-left text-[10px] font-black text-slate-400 uppercase tracking-widest text-right">Actions</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-50">
                    {employees.map((emp) => (
                      <tr 
                        key={emp.id} 
                        onClick={() => toggleEmployee(emp.id)}
                        className={`group cursor-pointer transition-all duration-300 ${selectedEmployees.includes(emp.id) ? 'bg-blue-50/30' : 'hover:bg-slate-50/50'}`}
                      >
                        <td className="px-8 py-6">
                          <div className={`w-6 h-6 rounded-lg border-2 flex items-center justify-center transition-all ${
                            selectedEmployees.includes(emp.id) 
                              ? 'bg-blue-600 border-blue-600 shadow-lg shadow-blue-200' 
                              : 'border-slate-200 group-hover:border-blue-300'
                          }`}>
                            {selectedEmployees.includes(emp.id) && <CheckCircle2 className="w-4 h-4 text-white" />}
                          </div>
                        </td>
                        <td className="px-8 py-6">
                          <div className="flex items-center gap-4">
                            <div className="w-12 h-12 bg-slate-100 rounded-2xl flex items-center justify-center border-2 border-white shadow-sm overflow-hidden group-hover:scale-110 transition-transform">
                              {emp.photo ? <img src={emp.photo} alt="" /> : <span className="font-black text-slate-400 uppercase">{emp.name.charAt(0)}</span>}
                            </div>
                            <div>
                              <p className="text-sm font-black text-slate-800 group-hover:text-blue-600 transition-colors">{emp.name}</p>
                              <p className="text-[11px] font-bold text-slate-400">{emp.desig}</p>
                            </div>
                          </div>
                        </td>
                        <td className="px-8 py-6">
                           <div className="flex items-center gap-2">
                              <Building2 className="w-4 h-4 text-slate-300" />
                              <span className="text-sm font-bold text-slate-600">{emp.dept}</span>
                           </div>
                        </td>
                        <td className="px-8 py-6 text-right">
                          <div className="flex items-center justify-end gap-3 opacity-0 group-hover:opacity-100 transition-opacity">
                            <button className="p-2.5 bg-white border border-slate-200 rounded-xl text-slate-400 hover:text-blue-600 hover:border-blue-200 shadow-sm">
                              <Eye className="w-4 h-4" />
                            </button>
                            <button className="p-2.5 bg-white border border-slate-200 rounded-xl text-slate-400 hover:text-blue-600 hover:border-blue-200 shadow-sm">
                              <Download className="w-4 h-4" />
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
        </div>

      </div>
    </div>
  );
};

export default GenerateEmployeeCertificate;
