import { useState } from "react";
import { 
  Search, 
  Filter, 
  Calendar, 
  Briefcase, 
  CheckCircle2, 
  XCircle, 
  Clock, 
  FileText,
  Upload,
  RefreshCw,
  Fingerprint,
  Save,
  Info
} from "lucide-react";

const EmployeeAttendance = () => {
  const [attendanceMode, setAttendanceMode] = useState("manual"); // "manual" or "biometric"
  const [selectedDepartment, setSelectedDepartment] = useState("Academic");
  const [selectedDate, setSelectedDate] = useState(new Date().toISOString().split('T')[0]);
  const [searchTerm, setSearchTerm] = useState("");

  // Sample Data
  const employees = [
    { id: "EMP2025001", name: "মাওলানা আব্দুল করিম", designation: "Head Teacher", photo: "https://api.dicebear.com/7.x/avataaars/svg?seed=EMP1" },
    { id: "EMP2025002", name: "হাফেজ মোহাম্মদ আলী", designation: "Senior Teacher", photo: "https://api.dicebear.com/7.x/avataaars/svg?seed=EMP2" },
    { id: "EMP2025003", name: "হোসেন আহমেদ", designation: "Junior Teacher", photo: "https://api.dicebear.com/7.x/avataaars/svg?seed=EMP3" },
    { id: "EMP2025004", name: "আব্দুল্লাহ মাহমুদ", designation: "Accountant", photo: "https://api.dicebear.com/7.x/avataaars/svg?seed=EMP4" },
    { id: "EMP2025005", name: "সাইফুল ইসলাম", designation: "Staff", photo: "https://api.dicebear.com/7.x/avataaars/svg?seed=EMP5" },
  ];

  const [attendanceData, setAttendanceData] = useState(
    employees.reduce((acc, emp) => ({ ...acc, [emp.id]: "present" }), {})
  );

  const stats = {
    total: employees.length,
    present: Object.values(attendanceData).filter(v => v === "present").length,
    absent: Object.values(attendanceData).filter(v => v === "absent").length,
    late: Object.values(attendanceData).filter(v => v === "late").length,
    leave: Object.values(attendanceData).filter(v => v === "leave").length,
  };

  const handleStatusChange = (empId, status) => {
    setAttendanceData(prev => ({ ...prev, [empId]: status }));
  };

  const markAllAs = (status) => {
    const newData = { ...attendanceData };
    employees.forEach(e => newData[e.id] = status);
    setAttendanceData(newData);
  };

  return (
    <div className="space-y-6 animate-in fade-in duration-500 p-4 md:p-8">
      {/* Header Section */}
      <div className="bg-white rounded-3xl border-2 border-slate-200 p-6 flex flex-col md:flex-row justify-between items-center gap-6 shadow-sm">
        <div>
          <h1 className="text-2xl md:text-3xl font-black text-slate-800 flex items-center gap-3">
            <Calendar className="w-8 h-8 text-indigo-600" />
            Employee Attendance
          </h1>
          <p className="text-slate-500 font-bold mt-1">Manage staff daily attendance</p>
        </div>

        <div className="flex bg-slate-100 p-1.5 rounded-2xl w-full md:w-auto">
          <button 
            onClick={() => setAttendanceMode("manual")}
            className={`flex-1 md:flex-none px-6 py-2.5 rounded-xl text-sm font-black transition-all flex items-center justify-center gap-2 ${
              attendanceMode === "manual" 
                ? "bg-white text-slate-800 shadow-md" 
                : "text-slate-500 hover:text-slate-700 hover:bg-white/50"
            }`}
          >
            <FileText className="w-4 h-4" />
            Manual Mode
          </button>
          <button 
            onClick={() => setAttendanceMode("biometric")}
            className={`flex-1 md:flex-none px-6 py-2.5 rounded-xl text-sm font-black transition-all flex items-center justify-center gap-2 ${
              attendanceMode === "biometric" 
                ? "bg-white text-slate-800 shadow-md" 
                : "text-slate-500 hover:text-slate-700 hover:bg-white/50"
            }`}
          >
            <Fingerprint className="w-4 h-4" />
            Biometric Mode
          </button>
        </div>
      </div>

      {/* Control & Stats Bar */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Filters */}
        <div className="lg:col-span-8 bg-white rounded-3xl border-2 border-slate-200 p-6 shadow-sm">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="space-y-2">
              <label className="text-xs font-black text-slate-500 uppercase flex items-center gap-2">
                <Briefcase className="w-3.5 h-3.5" /> Department
              </label>
              <select 
                value={selectedDepartment} 
                onChange={(e) => setSelectedDepartment(e.target.value)}
                className="w-full bg-indigo-50/50 border-2 border-slate-100 rounded-xl px-4 py-2.5 text-sm font-bold focus:border-indigo-500 outline-none transition-all"
              >
                <option>Academic</option>
                <option>Administration</option>
                <option>Accountant</option>
                <option>Staff</option>
              </select>
            </div>
            <div className="space-y-2">
              <label className="text-xs font-black text-slate-500 uppercase flex items-center gap-2">
                <Calendar className="w-3.5 h-3.5" /> Date
              </label>
              <input 
                type="date" 
                value={selectedDate}
                onChange={(e) => setSelectedDate(e.target.value)}
                className="w-full bg-indigo-50/50 border-2 border-slate-100 rounded-xl px-4 py-2.5 text-sm font-bold focus:border-indigo-500 outline-none transition-all" 
              />
            </div>
          </div>
        </div>

        {/* Quick Stats */}
        <div className="lg:col-span-4 bg-white rounded-3xl border-2 border-slate-200 p-6 shadow-sm flex items-center justify-around">
          <div className="text-center">
            <p className="text-2xl font-black text-slate-800">{stats.present}</p>
            <p className="text-[10px] font-black text-emerald-500 uppercase tracking-widest">Present</p>
          </div>
          <div className="w-px h-10 bg-slate-100" />
          <div className="text-center">
            <p className="text-2xl font-black text-slate-800">{stats.absent}</p>
            <p className="text-[10px] font-black text-rose-500 uppercase tracking-widest">Absent</p>
          </div>
          <div className="w-px h-10 bg-slate-100" />
          <div className="text-center">
            <p className="text-2xl font-black text-slate-800">{stats.late}</p>
            <p className="text-[10px] font-black text-amber-500 uppercase tracking-widest">Late</p>
          </div>
          <div className="w-px h-10 bg-slate-100" />
          <div className="text-center">
            <p className="text-2xl font-black text-slate-800">{stats.leave}</p>
            <p className="text-[10px] font-black text-blue-500 uppercase tracking-widest">Leave</p>
          </div>
        </div>
      </div>

      {attendanceMode === "manual" ? (
        <div className="bg-white rounded-3xl border-2 border-slate-200 shadow-sm overflow-hidden">
          {/* Action Bar */}
          <div className="bg-indigo-50/20 px-6 py-4 flex flex-col md:flex-row justify-between items-center gap-4 border-b-2 border-slate-100">
            <div className="relative w-full md:w-64">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
              <input 
                placeholder="Search employees..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-10 pr-4 py-2 bg-white border-2 border-slate-100 rounded-xl text-sm font-bold outline-none focus:border-indigo-500"
              />
            </div>

            <div className="flex gap-2 w-full md:w-auto">
              <button onClick={() => markAllAs("present")} className="flex-1 md:flex-none px-4 py-2 text-xs font-black bg-indigo-50 text-indigo-600 rounded-lg hover:bg-indigo-100 transition-colors border border-indigo-200">
                Mark All Present
              </button>
              <button className="flex-1 md:flex-none px-6 py-2 text-xs font-black bg-indigo-600 text-white rounded-xl shadow-lg shadow-indigo-200 flex items-center justify-center gap-2">
                <Save className="w-3.5 h-3.5" /> Save Attendance
              </button>
            </div>
          </div>

          {/* Table */}
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-[#e6f4ef]/30 border-b-2 border-slate-100">
                <tr>
                  <th className="px-6 py-4 text-left text-[10px] font-black text-slate-500 uppercase tracking-widest w-24">Employee ID</th>
                  <th className="px-6 py-4 text-left text-[10px] font-black text-slate-500 uppercase tracking-widest">Name & Designation</th>
                  <th className="px-6 py-4 text-center text-[10px] font-black text-slate-500 uppercase tracking-widest w-64">Record Status</th>
                </tr>
              </thead>
              <tbody className="divide-y-2 divide-slate-50">
                {employees.map((emp) => (
                  <tr key={emp.id} className="hover:bg-slate-50/50 transition-colors">
                    <td className="px-6 py-4">
                      <span className="text-sm font-black text-emerald-700">{emp.id}</span>
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-3">
                        <img src={emp.photo} className="w-10 h-10 rounded-full bg-slate-100 p-0.5" />
                        <div>
                          <p className="text-sm font-bold text-slate-800">{emp.name}</p>
                          <p className="text-[10px] font-black text-slate-400 uppercase tracking-wider">{emp.designation}</p>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex justify-center gap-1.5">
                        {[
                          { key: 'present', label: 'P', color: 'bg-emerald-500', bg: 'bg-emerald-50' },
                          { key: 'absent', label: 'A', color: 'bg-rose-500', bg: 'bg-rose-50' },
                          { key: 'late', label: 'L', color: 'bg-amber-500', bg: 'bg-amber-50' },
                          { key: 'leave', label: 'Lv', color: 'bg-blue-500', bg: 'bg-blue-50' },
                        ].map(status => (
                          <button
                            key={status.key}
                            onClick={() => handleStatusChange(emp.id, status.key)}
                            className={`w-10 h-10 rounded-xl text-xs font-black border-2 transition-all flex items-center justify-center ${
                              attendanceData[emp.id] === status.key 
                                ? `${status.color} border-transparent text-white shadow-lg shadow-${status.color}/20` 
                                : `border-slate-100 text-slate-400 ${status.bg} hover:border-slate-300`
                            }`}
                          >
                            {status.label}
                          </button>
                        ))}
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      ) : (
        /* Biometric View */
        <div className="bg-white rounded-3xl border-2 border-slate-200 shadow-sm p-8 text-center space-y-8 min-h-[400px] flex flex-col items-center justify-center">
          <div className="w-24 h-24 bg-indigo-100 rounded-full flex items-center justify-center animate-pulse">
            <Fingerprint className="w-12 h-12 text-indigo-600" />
          </div>
          
          <div className="max-w-md space-y-4">
            <h2 className="text-2xl font-black text-slate-800 tracking-tight">Biometric Integration</h2>
            <p className="text-slate-500 font-bold leading-relaxed">
              Automate staff attendance by connecting your biometric device. Sync logs in real-time or upload bulk attendance data.
            </p>
          </div>

          <div className="flex flex-col sm:flex-row gap-4 w-full max-w-lg">
            <button className="flex-1 px-8 py-4 bg-slate-100 text-slate-700 font-black rounded-2xl flex items-center justify-center gap-3 hover:bg-slate-200 transition-all">
              <Upload className="w-5 h-5 text-slate-500" />
              Upload Logs (CSV)
            </button>
            <button className="flex-1 px-8 py-4 bg-indigo-600 text-white font-black rounded-2xl flex items-center justify-center gap-3 shadow-xl shadow-indigo-200 hover:scale-[1.02] active:scale-95 transition-all">
              <RefreshCw className="w-5 h-5" />
              Machine Sync
            </button>
          </div>

          <div className="pt-8 border-t-2 border-slate-100 w-full flex items-center justify-center gap-8">
            <div className="flex items-center gap-2 text-xs font-black text-slate-400 uppercase font-mono">
              <div className="w-2 h-2 rounded-full bg-emerald-500" /> API: ONLINE
            </div>
            <div className="flex items-center gap-2 text-xs font-black text-slate-400 uppercase font-mono">
              <div className="w-2 h-2 rounded-full bg-slate-300" /> LAST SYNC: 2 MIN AGO
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default EmployeeAttendance;
