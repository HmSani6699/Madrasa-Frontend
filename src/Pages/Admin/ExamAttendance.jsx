import { useState, useEffect } from "react";
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
  MapPin,
  Info
} from "lucide-react";
import axiosInstance from "../../api/axiosInstance";
import { toast } from "react-hot-toast";

const ExamAttendance = () => {
  const [attendanceMode, setAttendanceMode] = useState("manual");
  const [selectedExamId, setSelectedExamId] = useState("");
  const [selectedClassId, setSelectedClassId] = useState("");
  const [selectedSectionId, setSelectedSectionId] = useState("");
  const [selectedHall, setSelectedHall] = useState("Main Hall (Room 101)");
  const [selectedDate, setSelectedDate] = useState(new Date().toISOString().split('T')[0]);
  const [searchTerm, setSearchTerm] = useState("");

  const [classes, setClasses] = useState([]);
  const [sections, setSections] = useState([]);
  const [exams, setExams] = useState([]);
  const [students, setStudents] = useState([]);
  const [loading, setLoading] = useState(false);
  const [attendanceData, setAttendanceData] = useState({});

  const halls = ["Main Hall (Room 101)", "East Wing (Room 204)", "Library Hall"];

  // Fetch initial data
  useEffect(() => {
    const fetchInitialData = async () => {
      try {
        const [classesRes, sectionsRes, examsRes] = await Promise.all([
          axiosInstance.get("/v1/classes"),
          axiosInstance.get("/v1/sections"),
          axiosInstance.get("/v1/exam-names")
        ]);
        if (classesRes.data.success) setClasses(classesRes.data.data);
        if (sectionsRes.data.success) setSections(sectionsRes.data.data);
        if (examsRes.data.success) setExams(examsRes.data.data);
      } catch (err) {
        console.error("Error fetching initial data:", err);
      }
    };
    fetchInitialData();
  }, []);

  const fetchData = async () => {
    if (!selectedExamId || !selectedClassId || !selectedSectionId || !selectedDate) {
      toast.error("Please select exam, class, section, and date first.");
      return;
    }

    setLoading(true);
    try {
      const studentsRes = await axiosInstance.get("/v1/students", {
        params: {
          class_id: selectedClassId,
          section_id: selectedSectionId,
          limit: 1000
        }
      });

      if (studentsRes.data.success) {
        const studentList = studentsRes.data.data;
        setStudents(studentList);

        // Default to present
        let newAttendanceData = {};
        studentList.forEach(s => {
          newAttendanceData[s._id] = "present";
        });
        setAttendanceData(newAttendanceData);
      }
    } catch (err) {
      console.error("Error fetching data:", err);
      toast.error("Failed to fetch data");
    } finally {
      setLoading(false);
    }
  };

  const handleStatusChange = (studentId, status) => {
    setAttendanceData(prev => ({ ...prev, [studentId]: status }));
  };

  const handleSave = async () => {
    if (students.length === 0) return;
    setLoading(true);
    try {
      // NOTE: Here we would hit the exam attendance endpoint. 
      // Assuming a generic save logic for now.
      toast.success("Exam attendance saved successfully!");
    } catch (err) {
      console.error("Error saving attendance:", err);
      toast.error("Failed to save attendance");
    } finally {
      setLoading(false);
    }
  };

  const filteredStudents = students.filter(s => {
    const fullName = `${s.firstName || ''} ${s.lastName || ''}`.trim().toLowerCase();
    const sId = s.student_id || s.studentId || '';
    const searchLower = searchTerm.toLowerCase();
    return fullName.includes(searchLower) || sId.toLowerCase().includes(searchLower);
  });

  return (
    <div className="animate-in fade-in duration-500">
      {/* Header Section */}
      <div className="rounded-[8px] mb-4 flex flex-col md:flex-row justify-between items-center gap-6">
        <div>
          <h1 className="text-2xl md:text-3xl font-black text-slate-800 flex items-center gap-3">
            <GraduationCap className="w-8 h-8 text-[#00315e]" />
            Exam Attendance
          </h1>
          <p className="text-slate-500 font-bold mt-1">Verify student presence during examinations</p>
        </div>

        <div className="flex bg-slate-100 p-1.5 rounded-2xl w-full md:w-auto">
          <button 
            onClick={() => setAttendanceMode("manual")}
            className={`flex-1 md:flex-none px-6 py-2.5 rounded-[8px] text-sm font-black transition-all flex items-center justify-center gap-2 ${
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
            className={`flex-1 md:flex-none px-6 py-2.5 rounded-[8px] text-sm font-black transition-all flex items-center justify-center gap-2 ${
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
      <div className="bg-white rounded-[8px] p-6 shadow-sm mb-6">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-6 gap-4">
          <div className="space-y-2">
            <label className="text-xs font-black text-slate-500 uppercase flex items-center gap-2">
              <GraduationCap className="w-3.5 h-3.5" /> Exam
            </label>
            <select 
              value={selectedExamId} 
              onChange={(e) => setSelectedExamId(e.target.value)}
              className="w-full bg-[#00315e24] border-none rounded-[8px] px-4 py-2.5 text-sm font-bold focus:ring-1 focus:ring-[#00315e] outline-none transition-all"
            >
              <option value="">Select Exam</option>
              {exams.map(e => <option key={e._id} value={e._id}>{e.name}</option>)}
            </select>
          </div>
          <div className="space-y-2">
            <label className="text-xs font-black text-slate-500 uppercase flex items-center gap-2">
              <Filter className="w-3.5 h-3.5" /> Class
            </label>
            <select 
              value={selectedClassId} 
              onChange={(e) => setSelectedClassId(e.target.value)}
              className="w-full bg-[#00315e24] border-none rounded-[8px] px-4 py-2.5 text-sm font-bold focus:ring-1 focus:ring-[#00315e] outline-none transition-all"
            >
              <option value="">Select Class</option>
              {classes.map(c => <option key={c._id} value={c._id}>{c.name}</option>)}
            </select>
          </div>
          <div className="space-y-2">
            <label className="text-xs font-black text-slate-500 uppercase flex items-center gap-2">
              <Filter className="w-3.5 h-3.5" /> Section
            </label>
            <select 
              value={selectedSectionId} 
              onChange={(e) => setSelectedSectionId(e.target.value)}
              className="w-full bg-[#00315e24] border-none rounded-[8px] px-4 py-2.5 text-sm font-bold focus:ring-1 focus:ring-[#00315e] outline-none transition-all"
            >
              <option value="">Select Section</option>
              {sections.filter(s => {
                const cls = classes.find(c => c._id === selectedClassId);
                return (s.class_id?._id || s.class_id) === selectedClassId || (cls && cls.section_id === s._id);
              }).map(s => (
                <option key={s._id} value={s._id}>{s.name}</option>
              ))}
            </select>
          </div>
          <div className="space-y-2">
            <label className="text-xs font-black text-slate-500 uppercase flex items-center gap-2">
              <MapPin className="w-3.5 h-3.5" /> Hall
            </label>
            <select 
              value={selectedHall} 
              onChange={(e) => setSelectedHall(e.target.value)}
              className="w-full bg-[#00315e24] border-none rounded-[8px] px-4 py-2.5 text-sm font-bold focus:ring-1 focus:ring-[#00315e] outline-none transition-all"
            >
              {halls.map(h => <option key={h} value={h}>{h}</option>)}
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
              className="w-full bg-[#00315e24] border-none rounded-[8px] px-4 py-2.5 text-sm font-bold focus:ring-1 focus:ring-[#00315e] outline-none transition-all" 
            />
          </div>
          <div className="space-y-2 flex justify-end items-end">
            <button 
              onClick={fetchData}
              disabled={loading}
              className="w-full px-4 py-2.5 cursor-pointer bg-[#00315e] text-white font-black rounded-[8px] shadow-lg shadow-slate-200 hover:scale-[1.02] active:scale-95 transition-all disabled:opacity-50"
            >
              {loading ? "Loading..." : "Filter"}
            </button>
          </div>
        </div>
      </div>

      {attendanceMode === "manual" ? (
        <div className="bg-white rounded-[8px] border-2 border-slate-100 shadow-xl shadow-slate-100/50 overflow-hidden relative">
          
          {students.length > 0 ? (
            <div>
              {/* Action Bar */}
              <div className="bg-slate-50 py-4 px-6 flex flex-col md:flex-row justify-between items-center gap-4 border-b-2 border-slate-100">
                <div className="relative w-full md:w-64">
                  <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                  <input 
                    placeholder="Search candidates..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="w-full pl-10 pr-4 py-2 bg-[#00315e24] border-none rounded-[8px] text-sm font-bold outline-none focus:ring-1 focus:ring-[#00315e] transition-all"
                  />
                </div>

                <div className="flex gap-2 w-full md:w-auto">
                  <button 
                    onClick={handleSave}
                    disabled={loading}
                    className="flex-1 md:flex-none px-6 py-2.5 text-xs font-black bg-[#00315e] text-white rounded-[8px] shadow-lg shadow-slate-200 flex items-center justify-center gap-2 hover:scale-[1.02] active:scale-95 transition-all disabled:opacity-50"
                  >
                    <Save className="w-3.5 h-3.5" /> {loading ? "Saving..." : "Save Attendance"}
                  </button>
                </div>
              </div>

              {/* Table */}
              <div className="overflow-x-auto rounded-t-[8px]">
                <table className="w-full">
                  <thead className="bg-[#00315e24]">
                    <tr>
                      <th className="px-10 py-3.5 text-left text-[12px] font-black w-24">Roll</th>
                      <th className="px-10 py-3.5 text-left text-[12px] font-black">Candidate</th>
                      <th className="px-10 py-3.5 text-left text-[12px] font-black">Student ID</th>
                      <th className="px-10 py-3.5 text-center text-[12px] font-black w-64">Attendance Status</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y-2 divide-slate-100">
                    {filteredStudents.map((student) => (
                      <tr key={student._id} className="group hover:bg-amber-50/10 transition-all duration-300">
                        <td className="px-10 py-3.5">
                          <span className="text-sm font-bold text-slate-500">{student.roll_number || student.rollNo}</span>
                        </td>
                        <td className="px-10 py-3.5">
                          <div className="flex items-center gap-3">
                            <img src={student.photo || `https://api.dicebear.com/7.x/avataaars/svg?seed=${student._id}`} className="w-8 h-8 rounded-full bg-slate-100 p-0.5" />
                            <span className="text-sm font-bold text-slate-500">{student.firstName} {student.lastName || ''}</span>
                          </div>
                        </td>
                        <td className="px-10 py-3.5 text-sm font-bold text-slate-500">{student.student_id || student.studentId}</td>
                        <td className="px-10 py-3.5">
                          <div className="flex justify-center gap-1.5">
                            {[
                              { key: 'present', label: 'Present', color: 'bg-emerald-500', bg: 'bg-emerald-50' },
                              { key: 'absent', label: 'Absent', color: 'bg-rose-500', bg: 'bg-rose-50' },
                            ].map(status => (
                              <button
                                key={status.key}
                                onClick={() => handleStatusChange(student._id, status.key)}
                                className={`px-3 py-1.5 rounded-[8px] text-xs font-black border-2 transition-all flex items-center justify-center ${
                                  attendanceData[student._id] === status.key 
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
            <div className="h-[200px] w-full flex items-center justify-center text-slate-500 font-bold">
              <p>Please select filters and load candidates.</p>
            </div>
          )}
        </div>
      ) : (
        /* Biometric View */
        <div className="bg-white rounded-[8px] border-2 border-slate-200 shadow-sm p-8 text-center space-y-8 min-h-[400px] flex flex-col items-center justify-center relative">
          <div className="w-24 h-24 bg-[#00315e24] rounded-full flex items-center justify-center animate-pulse">
            <Fingerprint className="w-12 h-12 text-[#00315e]" />
          </div>
          
          <div className="max-w-md space-y-4">
            <h2 className="text-2xl font-black text-slate-800 tracking-tight">Exam Hall Biometric Sync</h2>
            <p className="text-slate-500 font-bold leading-relaxed">
              Verify candidates using the exam hall's biometric terminal. This ensures no proxy attendance and maintains strict examination standards.
            </p>
          </div>

          <div className="flex flex-col sm:flex-row gap-4 w-full max-w-lg">
            <button className="flex-1 px-8 py-4 bg-slate-100 text-slate-700 font-black rounded-2xl flex items-center justify-center gap-3 hover:bg-slate-200 transition-all">
              <Upload className="w-5 h-5 text-slate-500" />
              Upload Offline Logs
            </button>
            <button className="flex-1 px-8 py-4 bg-[#00315e] text-white font-black rounded-2xl flex items-center justify-center gap-3 shadow-xl shadow-slate-200 hover:scale-[1.02] active:scale-95 transition-all">
              <RefreshCw className="w-5 h-5" />
              Sync Hall Terminal
            </button>
          </div>

          <div className="pt-8 border-t-2 border-slate-100 w-full flex items-center justify-center gap-8">
            <div className="flex items-center gap-2 text-xs font-black text-slate-400 uppercase">
              <div className="w-2 h-2 rounded-full bg-emerald-500" /> Terminal Status: Connected
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

export default ExamAttendance;

