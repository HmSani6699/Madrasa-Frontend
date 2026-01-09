import { useState } from "react";
import { 
  Search, 
  Filter, 
  Calendar, 
  GraduationCap,
  CheckCircle2, 
  XCircle, 
  Clock, 
  FileText,
  Upload,
  RefreshCw,
  Fingerprint,
  Save,
  MapPin
} from "lucide-react";

const ExamAttendance = () => {
  const [attendanceMode, setAttendanceMode] = useState("manual");
  const [selectedExam, setSelectedExam] = useState("First Term 2025");
  const [selectedClass, setSelectedClass] = useState("Class 5");
  const [selectedSection, setSelectedSection] = useState("Section A");
  const [selectedHall, setSelectedHall] = useState("Main Hall (Room 101)");
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

  const exams = ["First Term 2025", "Mid Term 2025", "Final Exam 2025"];
  const halls = ["Main Hall (Room 101)", "East Wing (Room 204)", "Library Hall"];

  const [attendanceData, setAttendanceData] = useState(
    students.reduce((acc, student) => ({ ...acc, [student.id]: "present" }), {})
  );

  const handleStatusChange = (studentId, status) => {
    setAttendanceData(prev => ({ ...prev, [studentId]: status }));
  };

  return (
    <div className="space-y-6 animate-in fade-in duration-500 p-4 md:p-8">
      {/* Header Section */}
      <div className="bg-white rounded-3xl border-2 border-slate-200 p-6 flex flex-col md:flex-row justify-between items-center gap-6 shadow-sm">
        <div>
          <h1 className="text-2xl md:text-3xl font-black text-slate-800 flex items-center gap-3">
            <GraduationCap className="w-8 h-8 text-rose-600" />
            Exam Attendance
          </h1>
          <p className="text-slate-500 font-bold mt-1">Verify student presence during examinations</p>
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

      {/* Advanced Filters */}
      <div className="bg-white rounded-3xl border-2 border-slate-200 p-6 shadow-sm">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4">
          <div className="space-y-2">
            <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest flex items-center gap-2">
              <GraduationCap className="w-3 h-3" /> Exam
            </label>
            <select 
              value={selectedExam} 
              onChange={(e) => setSelectedExam(e.target.value)}
              className="w-full bg-rose-50/30 border-2 border-slate-100 rounded-xl px-4 py-3 text-xs font-bold focus:border-rose-400 outline-none transition-all"
            >
              {exams.map(e => <option key={e}>{e}</option>)}
            </select>
          </div>
          <div className="space-y-2">
            <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest flex items-center gap-2">
              <Filter className="w-3 h-3" /> Class
            </label>
            <select 
              value={selectedClass} 
              onChange={(e) => setSelectedClass(e.target.value)}
              className="w-full bg-rose-50/30 border-2 border-slate-100 rounded-xl px-4 py-3 text-xs font-bold focus:border-rose-400 outline-none transition-all"
            >
              <option>Class 4</option>
              <option>Class 5</option>
              <option>Class 6</option>
            </select>
          </div>
          <div className="space-y-2">
            <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest flex items-center gap-2">
              <Filter className="w-3 h-3" /> Section
            </label>
            <select 
              value={selectedSection} 
              onChange={(e) => setSelectedSection(e.target.value)}
              className="w-full bg-rose-50/30 border-2 border-slate-100 rounded-xl px-4 py-3 text-xs font-bold focus:border-rose-400 outline-none transition-all"
            >
              <option>Section A</option>
              <option>Section B</option>
              <option>Section C</option>
            </select>
          </div>
          <div className="space-y-2">
            <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest flex items-center gap-2">
              <MapPin className="w-3 h-3" /> Hall
            </label>
            <select 
              value={selectedHall} 
              onChange={(e) => setSelectedHall(e.target.value)}
              className="w-full bg-rose-50/30 border-2 border-slate-100 rounded-xl px-4 py-3 text-xs font-bold focus:border-rose-400 outline-none transition-all"
            >
              {halls.map(h => <option key={h}>{h}</option>)}
            </select>
          </div>
          <div className="space-y-2">
            <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest flex items-center gap-2">
              <Calendar className="w-3 h-3" /> Date
            </label>
            <input 
              type="date" 
              value={selectedDate}
              onChange={(e) => setSelectedDate(e.target.value)}
              className="w-full bg-rose-50/30 border-2 border-slate-100 rounded-xl px-4 py-3 text-xs font-bold focus:border-rose-400 outline-none transition-all" 
            />
          </div>
        </div>
      </div>

      {attendanceMode === "manual" ? (
        <div className="bg-white rounded-3xl border-2 border-slate-200 shadow-sm overflow-hidden">
          <div className="bg-rose-50/20 px-6 py-4 flex flex-col md:flex-row justify-between items-center gap-4 border-b-2 border-slate-100">
            <div className="relative w-full md:w-64">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
              <input 
                placeholder="Search candidates..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-10 pr-4 py-2 bg-white border-2 border-slate-100 rounded-xl text-xs font-bold outline-none focus:border-rose-400"
              />
            </div>

            <button className="w-full md:w-auto px-6 py-2.5 text-xs font-black bg-rose-600 text-white rounded-xl shadow-lg shadow-rose-200 flex items-center justify-center gap-2 hover:scale-[1.02] transition-all">
              <Save className="w-3.5 h-3.5" /> Save Attendance
            </button>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-rose-50/10 border-b-2 border-slate-100">
                <tr>
                  <th className="px-6 py-4 text-left text-[10px] font-black text-slate-500 uppercase tracking-widest w-24">Roll</th>
                  <th className="px-6 py-4 text-left text-[10px] font-black text-slate-500 uppercase tracking-widest">Candidate</th>
                  <th className="px-6 py-4 text-left text-[10px] font-black text-slate-500 uppercase tracking-widest">Student ID</th>
                  <th className="px-6 py-4 text-center text-[10px] font-black text-slate-500 uppercase tracking-widest w-64">Status</th>
                </tr>
              </thead>
              <tbody className="divide-y-2 divide-slate-50">
                {students.map((student) => (
                  <tr key={student.id} className="hover:bg-slate-50/50 transition-colors">
                    <td className="px-6 py-4">
                      <span className="text-sm font-black text-rose-600">{student.roll}</span>
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-3">
                        <img src={student.photo} className="w-8 h-8 rounded-full bg-slate-100 border-2 border-white shadow-sm" />
                        <span className="text-sm font-bold text-slate-800">{student.name}</span>
                      </div>
                    </td>
                    <td className="px-6 py-4 text-sm font-bold text-slate-500">{student.id}</td>
                    <td className="px-6 py-4">
                      <div className="flex justify-center gap-2">
                        {[
                          { key: 'present', label: 'Present', color: 'bg-emerald-500' },
                          { key: 'absent', label: 'Absent', color: 'bg-rose-500' },
                        ].map(status => (
                          <button
                            key={status.key}
                            onClick={() => handleStatusChange(student.id, status.key)}
                            className={`px-6 py-2 rounded-xl text-[10px] font-black uppercase transition-all border-2 ${
                              attendanceData[student.id] === status.key 
                                ? `${status.color} border-transparent text-white shadow-md` 
                                : `border-slate-100 text-slate-400 bg-white hover:border-slate-300`
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
        <div className="bg-white rounded-3xl border-2 border-slate-200 shadow-sm p-12 text-center space-y-8 flex flex-col items-center justify-center">
          <div className="w-24 h-24 bg-rose-50 rounded-full flex items-center justify-center border-4 border-rose-100 shadow-inner">
            <Fingerprint className="w-12 h-12 text-rose-600" />
          </div>
          
          <div className="max-w-md space-y-4">
            <h2 className="text-2xl font-black text-slate-800 tracking-tight">Exam Hall Biometric Sync</h2>
            <p className="text-slate-500 font-bold leading-relaxed">
              Verify candidates using the exam hall's biometric terminal. This ensures no proxy attendance and maintains strict examination standards.
            </p>
          </div>

          <div className="flex flex-col sm:flex-row gap-4 w-full max-w-lg">
            <button className="flex-1 px-8 py-4 bg-rose-600 text-white font-black rounded-2xl flex items-center justify-center gap-3 shadow-xl shadow-rose-200 hover:scale-[1.02] transition-all">
              <RefreshCw className="w-5 h-5" />
              Sync Hall Terminal
            </button>
            <button className="flex-1 px-8 py-4 bg-slate-100 text-slate-700 font-black rounded-2xl flex items-center justify-center gap-3 hover:bg-slate-200 transition-all">
              <Upload className="w-5 h-5 text-slate-500" />
              Upload Offline Logs
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default ExamAttendance;
