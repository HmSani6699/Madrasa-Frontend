import { useState, useMemo } from "react";
import { 
  Search, 
  Filter, 
  Calendar, 
  Users, 
  CheckCircle2, 
  XCircle, 
  Clock, 
  FileText,
  Upload,
  RefreshCw,
  Fingerprint,
  ChevronLeft,
  ChevronRight,
  Save,
  Info
} from "lucide-react";

const StudentAttendance = () => {
  const [attendanceMode, setAttendanceMode] = useState("manual"); // "manual" or "biometric"
  const [selectedClass, setSelectedClass] = useState("Class 5");
  const [selectedSection, setSelectedSection] = useState("Section A");
  const [selectedDate, setSelectedDate] = useState(new Date().toISOString().split('T')[0]);
  const [searchTerm, setSearchTerm] = useState("");

  // Sample Data
  const students = [
    { id: "STU2025001", name: "মোহাম্মদ রহমান", roll: "01", photo: "https://api.dicebear.com/7.x/avataaars/svg?seed=STU1" },
    { id: "STU2025002", name: "আয়েশা খাতুন", roll: "02", photo: "https://api.dicebear.com/7.x/avataaars/svg?seed=STU2" },
    { id: "STU2025003", name: "ইউসুফ হোসেন", roll: "03", photo: "https://api.dicebear.com/7.x/avataaars/svg?seed=STU3" },
    { id: "STU2025004", name: "ফাতিমা জোহরা", roll: "04", photo: "https://api.dicebear.com/7.x/avataaars/svg?seed=STU4" },
    { id: "STU2025005", name: "আব্দুল্লাহ মামুন", roll: "05", photo: "https://api.dicebear.com/7.x/avataaars/svg?seed=STU5" },
  ];

  const [attendanceData, setAttendanceData] = useState(
    students.reduce((acc, student) => ({ ...acc, [student.id]: "present" }), {})
  );

  const stats = {
    total: students.length,
    present: Object.values(attendanceData).filter(v => v === "present").length,
    absent: Object.values(attendanceData).filter(v => v === "absent").length,
    late: Object.values(attendanceData).filter(v => v === "late").length,
    leave: Object.values(attendanceData).filter(v => v === "leave").length,
  };

  const handleStatusChange = (studentId, status) => {
    setAttendanceData(prev => ({ ...prev, [studentId]: status }));
  };

  const markAllAs = (status) => {
    const newData = { ...attendanceData };
    students.forEach(s => newData[s.id] = status);
    setAttendanceData(newData);
  };

  return (
    <div className="space-y-6 animate-in fade-in duration-500 p-4 md:p-8">
      {/* Header Section */}
      <div className="bg-white rounded-3xl border-2 border-slate-200 p-6 flex flex-col md:flex-row justify-between items-center gap-6 shadow-sm">
        <div>
          <h1 className="text-2xl md:text-3xl font-black text-slate-800 flex items-center gap-3">
            <Calendar className="w-8 h-8 text-[#00bd7f]" />
            Student Attendance
          </h1>
          <p className="text-slate-500 font-bold mt-1">Manage daily attendance records</p>
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
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <div className="space-y-2">
              <label className="text-xs font-black text-slate-500 uppercase flex items-center gap-2">
                <Users className="w-3.5 h-3.5" /> Class
              </label>
              <select 
                value={selectedClass} 
                onChange={(e) => setSelectedClass(e.target.value)}
                className="w-full bg-[#e6f4ef] border-2 border-slate-100 rounded-xl px-4 py-2.5 text-sm font-bold focus:border-[#00bd7f] outline-none transition-all"
              >
                <option>Class 4</option>
                <option>Class 5</option>
                <option>Class 6</option>
              </select>
            </div>
            <div className="space-y-2">
              <label className="text-xs font-black text-slate-500 uppercase flex items-center gap-2">
                <Filter className="w-3.5 h-3.5" /> Section
              </label>
              <select 
                value={selectedSection} 
                onChange={(e) => setSelectedSection(e.target.value)}
                className="w-full bg-[#e6f4ef] border-2 border-slate-100 rounded-xl px-4 py-2.5 text-sm font-bold focus:border-[#00bd7f] outline-none transition-all"
              >
                <option>Section A</option>
                <option>Section B</option>
                <option>Section C</option>
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
                className="w-full bg-[#e6f4ef] border-2 border-slate-100 rounded-xl px-4 py-2.5 text-sm font-bold focus:border-[#00bd7f] outline-none transition-all" 
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
          <div className="bg-[#e6f4ef]/50 px-6 py-4 flex flex-col md:flex-row justify-between items-center gap-4 border-b-2 border-slate-100">
            <div className="relative w-full md:w-64">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
              <input 
                placeholder="Search students..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-10 pr-4 py-2 bg-white border-2 border-slate-100 rounded-xl text-sm font-bold outline-none focus:border-[#00bd7f]"
              />
            </div>

            <div className="flex gap-2 w-full md:w-auto">
              <button onClick={() => markAllAs("present")} className="flex-1 md:flex-none px-4 py-2 text-xs font-black bg-emerald-50 text-emerald-600 rounded-lg hover:bg-emerald-100 transition-colors border border-emerald-200">
                Mark All Present
              </button>
              <button className="flex-1 md:flex-none px-6 py-2 text-xs font-black bg-[#00bd7f] text-white rounded-xl shadow-lg shadow-emerald-200 flex items-center justify-center gap-2">
                <Save className="w-3.5 h-3.5" /> Save Attendance
              </button>
            </div>
          </div>

          {/* Table */}
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-[#e6f4ef]/30 border-b-2 border-slate-100">
                <tr>
                  <th className="px-6 py-4 text-left text-[10px] font-black text-slate-500 uppercase tracking-widest">Roll</th>
                  <th className="px-6 py-4 text-left text-[10px] font-black text-slate-500 uppercase tracking-widest">Student</th>
                  <th className="px-6 py-4 text-left text-[10px] font-black text-slate-500 uppercase tracking-widest">ID Number</th>
                  <th className="px-6 py-4 text-center text-[10px] font-black text-slate-500 uppercase tracking-widest w-64">Status</th>
                </tr>
              </thead>
              <tbody className="divide-y-2 divide-slate-50">
                {students.map((student) => (
                  <tr key={student.id} className="hover:bg-slate-50/50 transition-colors">
                    <td className="px-6 py-4">
                      <span className="text-sm font-black text-slate-700">{student.roll}</span>
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-3">
                        <img src={student.photo} className="w-8 h-8 rounded-full bg-emerald-100 p-0.5" />
                        <span className="text-sm font-bold text-slate-800">{student.name}</span>
                      </div>
                    </td>
                    <td className="px-6 py-4 text-sm font-black text-emerald-600">{student.id}</td>
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
                            onClick={() => handleStatusChange(student.id, status.key)}
                            className={`w-10 h-10 rounded-xl text-xs font-black border-2 transition-all flex items-center justify-center ${
                              attendanceData[student.id] === status.key 
                                ? `${status.color} border-transparent text-white shadow-lg` 
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
          <div className="w-24 h-24 bg-emerald-100 rounded-full flex items-center justify-center animate-pulse">
            <Fingerprint className="w-12 h-12 text-[#00bd7f]" />
          </div>
          
          <div className="max-w-md space-y-4">
            <h2 className="text-2xl font-black text-slate-800 tracking-tight">Biometric Machine Sync</h2>
            <p className="text-slate-500 font-bold leading-relaxed">
              Integrate with your fingerprint or face recognition machine. Import attendance logs directly from the terminal or cloud sync.
            </p>
          </div>

          <div className="flex flex-col sm:flex-row gap-4 w-full max-w-lg">
            <button className="flex-1 px-8 py-4 bg-slate-100 text-slate-700 font-black rounded-2xl flex items-center justify-center gap-3 hover:bg-slate-200 transition-all">
              <Upload className="w-5 h-5 text-slate-500" />
              Upload CSV/Excel
            </button>
            <button className="flex-1 px-8 py-4 bg-[#00bd7f] text-white font-black rounded-2xl flex items-center justify-center gap-3 shadow-xl shadow-emerald-200 hover:scale-[1.02] active:scale-95 transition-all">
              <RefreshCw className="w-5 h-5" />
              Sync Now
            </button>
          </div>

          <div className="pt-8 border-t-2 border-slate-100 w-full flex items-center justify-center gap-8">
            <div className="flex items-center gap-2 text-xs font-black text-slate-400 uppercase">
              <div className="w-2 h-2 rounded-full bg-emerald-500" /> Machine Status: Connected
            </div>
            <div className="flex items-center gap-2 text-xs font-black text-slate-400 uppercase underline cursor-pointer hover:text-slate-600">
              <Info className="w-4 h-4" /> View Connection Logs
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default StudentAttendance;
