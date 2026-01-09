import { useState } from "react";
import { 
  Search, 
  Filter, 
  Calendar, 
  Users, 
  BookOpen,
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

const SubjectWiseAttendance = () => {
  const [attendanceMode, setAttendanceMode] = useState("manual");
  const [selectedClass, setSelectedClass] = useState("Class 5");
  const [selectedSection, setSelectedSection] = useState("Section A");
  const [selectedSubject, setSelectedSubject] = useState("Arabic Grammar");
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

  const subjects = ["Arabic Grammar", "Fiqh", "Hadith", "Tafsir", "Bengali", "English", "Mathematics"];

  const [attendanceData, setAttendanceData] = useState(
    students.reduce((acc, student) => ({ ...acc, [student.id]: "present" }), {})
  );

  const stats = {
    total: students.length,
    present: Object.values(attendanceData).filter(v => v === "present").length,
    absent: Object.values(attendanceData).filter(v => v === "absent").length,
    late: Object.values(attendanceData).filter(v => v === "late").length,
  };

  const handleStatusChange = (studentId, status) => {
    setAttendanceData(prev => ({ ...prev, [studentId]: status }));
  };

  return (
    <div className="space-y-6 animate-in fade-in duration-500 p-4 md:p-8">
      {/* Header Section */}
      <div className="bg-white rounded-3xl border-2 border-slate-200 p-6 flex flex-col md:flex-row justify-between items-center gap-6 shadow-sm">
        <div>
          <h1 className="text-2xl md:text-3xl font-black text-slate-800 flex items-center gap-3">
            <BookOpen className="w-8 h-8 text-amber-500" />
            Subject Wise Attendance
          </h1>
          <p className="text-slate-500 font-bold mt-1">Track attendance for specific periods/subjects</p>
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
            Manual
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
            Biometric
          </button>
        </div>
      </div>

      {/* Control Bar */}
      <div className="bg-white rounded-3xl border-2 border-slate-200 p-6 shadow-sm">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          <div className="space-y-2">
            <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Class</label>
            <select 
              value={selectedClass} 
              onChange={(e) => setSelectedClass(e.target.value)}
              className="w-full bg-[#fdfaf2] border-2 border-slate-100 rounded-xl px-4 py-3 text-sm font-bold focus:border-amber-400 outline-none transition-all"
            >
              <option>Class 4</option>
              <option>Class 5</option>
              <option>Class 6</option>
            </select>
          </div>
          <div className="space-y-2">
            <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Section</label>
            <select 
              value={selectedSection} 
              onChange={(e) => setSelectedSection(e.target.value)}
              className="w-full bg-[#fdfaf2] border-2 border-slate-100 rounded-xl px-4 py-3 text-sm font-bold focus:border-amber-400 outline-none transition-all"
            >
              <option>Section A</option>
              <option>Section B</option>
              <option>Section C</option>
            </select>
          </div>
          <div className="space-y-2">
            <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Subject</label>
            <select 
              value={selectedSubject} 
              onChange={(e) => setSelectedSubject(e.target.value)}
              className="w-full bg-[#fdfaf2] border-2 border-slate-100 rounded-xl px-4 py-3 text-sm font-bold focus:border-amber-400 outline-none transition-all"
            >
              {subjects.map(s => <option key={s}>{s}</option>)}
            </select>
          </div>
          <div className="space-y-2">
            <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Date</label>
            <input 
              type="date" 
              value={selectedDate}
              onChange={(e) => setSelectedDate(e.target.value)}
              className="w-full bg-[#fdfaf2] border-2 border-slate-100 rounded-xl px-4 py-3 text-sm font-bold focus:border-amber-400 outline-none transition-all" 
            />
          </div>
        </div>
      </div>

      {attendanceMode === "manual" ? (
        <div className="bg-white rounded-3xl border-2 border-slate-200 shadow-sm overflow-hidden">
          <div className="bg-[#fdfaf2]/50 px-6 py-4 flex flex-col md:flex-row justify-between items-center gap-4 border-b-2 border-slate-100">
            <div className="relative w-full md:w-64">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
              <input 
                placeholder="Search name or roll..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-10 pr-4 py-2 bg-white border-2 border-slate-100 rounded-xl text-sm font-bold outline-none focus:border-amber-400"
              />
            </div>

            <div className="flex gap-2 w-full md:w-auto">
              <button className="flex-1 md:flex-none px-6 py-2.5 text-xs font-black bg-amber-500 text-white rounded-xl shadow-lg shadow-amber-200 flex items-center justify-center gap-2 hover:bg-amber-600 transition-all">
                <Save className="w-3.5 h-3.5" /> Submit Records
              </button>
            </div>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-[#fdfaf2]/30 border-b-2 border-slate-100">
                <tr>
                  <th className="px-6 py-4 text-left text-[10px] font-black text-slate-500 uppercase tracking-widest w-24">Roll</th>
                  <th className="px-6 py-4 text-left text-[10px] font-black text-slate-500 uppercase tracking-widest">Student Info</th>
                  <th className="px-6 py-4 text-center text-[10px] font-black text-slate-500 uppercase tracking-widest w-64">Attendance</th>
                </tr>
              </thead>
              <tbody className="divide-y-2 divide-slate-50">
                {students.map((student) => (
                  <tr key={student.id} className="hover:bg-slate-50/50 transition-colors">
                    <td className="px-6 py-4">
                      <span className="text-sm font-black text-slate-400"># {student.roll}</span>
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-3">
                        <img src={student.photo} className="w-10 h-10 rounded-xl bg-amber-50 p-1 border border-amber-100" />
                        <div>
                          <p className="text-sm font-bold text-slate-800">{student.name}</p>
                          <p className="text-[10px] font-black text-amber-500/70 tracking-wider">ID: {student.id}</p>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex justify-center gap-2">
                        {[
                          { key: 'present', label: 'Present', color: 'bg-emerald-500', bg: 'bg-emerald-50' },
                          { key: 'absent', label: 'Absent', color: 'bg-rose-500', bg: 'bg-rose-50' },
                          { key: 'late', label: 'Late', color: 'bg-amber-500', bg: 'bg-amber-50' },
                        ].map(status => (
                          <button
                            key={status.key}
                            onClick={() => handleStatusChange(student.id, status.key)}
                            className={`px-4 py-2 rounded-xl text-[10px] font-black uppercase transition-all border-2 ${
                              attendanceData[student.id] === status.key 
                                ? `${status.color} border-transparent text-white shadow-md` 
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
        /* Biometric Mock View */
        <div className="bg-white rounded-3xl border-2 border-slate-200 shadow-sm p-12 text-center space-y-8 flex flex-col items-center justify-center">
          <div className="relative">
            <div className="w-24 h-24 bg-amber-100 rounded-3xl rotate-12 absolute inset-0 animate-pulse" />
            <div className="w-24 h-24 bg-white border-2 border-amber-500 rounded-3xl flex items-center justify-center relative z-10 shadow-xl">
              <Fingerprint className="w-12 h-12 text-amber-500" />
            </div>
          </div>
          
          <div className="max-w-md space-y-4">
            <h2 className="text-2xl font-black text-slate-800 tracking-tight">Access Machine Logs</h2>
            <p className="text-slate-500 font-bold leading-relaxed">
              Pull attendance data directly from your classroom biometric sensors. Ensure the device is connected to the MMS network.
            </p>
          </div>

          <div className="flex flex-col sm:flex-row gap-4 w-full max-w-lg">
            <button className="flex-1 px-8 py-4 bg-[#fdfaf2] border-2 border-amber-100 text-amber-900 font-black rounded-2xl flex items-center justify-center gap-3 hover:bg-amber-100 transition-all">
              <RefreshCw className="w-5 h-5" />
              Fetch Data
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default SubjectWiseAttendance;
