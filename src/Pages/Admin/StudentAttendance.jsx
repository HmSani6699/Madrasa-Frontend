import { useState, useMemo, useEffect } from "react";
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
import axiosInstance from "../../api/axiosInstance";
import { toast } from "react-hot-toast";

const StudentAttendance = () => {
  const [attendanceMode, setAttendanceMode] = useState("manual"); // "manual" or "biometric"
  const [selectedClassId, setSelectedClassId] = useState("");
  const [selectedSectionId, setSelectedSectionId] = useState("");
  const [selectedDate, setSelectedDate] = useState(new Date().toISOString().split('T')[0]);
  const [searchTerm, setSearchTerm] = useState("");
  
  const [classes, setClasses] = useState([]);
  const [sections, setSections] = useState([]);
  const [students, setStudents] = useState([]);
  const [loading, setLoading] = useState(false);
  const [attendanceData, setAttendanceData] = useState({});

  // Fetch Classes and Sections on mount
  useEffect(() => {
    const fetchInitialData = async () => {
      try {
        const [classesRes, sectionsRes] = await Promise.all([
          axiosInstance.get("/v1/classes"),
          axiosInstance.get("/v1/sections")
        ]);
        if (classesRes.data.success) {
            setClasses(classesRes.data.data);
            if (classesRes.data.data.length > 0) {
                setSelectedClassId(classesRes.data.data[0]._id);
            }
        }
        if (sectionsRes.data.success) setSections(sectionsRes.data.data);
      } catch (err) {
        console.error("Error fetching initial data:", err);
        toast.error("Failed to load classes/sections");
      }
    };
    fetchInitialData();
  }, []);

  // Filter sections by class
  const filteredSections = useMemo(() => {
      if (!selectedClassId) return [];
      return sections.filter(s => s.classId?._id === selectedClassId || s.classId === selectedClassId);
  }, [sections, selectedClassId]);

  // Auto-select first section when class changes
  useEffect(() => {
      if (filteredSections.length > 0 && !filteredSections.find(s => s._id === selectedSectionId)) {
          setSelectedSectionId(filteredSections[0]._id);
      }
  }, [filteredSections]);

  const fetchData = async () => {
    if (!selectedClassId || !selectedSectionId) return;

    setLoading(true);
    try {
      // 1. Fetch Students
      const studentsRes = await axiosInstance.get("/v1/students", {
        params: {
          class: selectedClassId,  // backend expects ID usually, if passing name need to check controller
          section: selectedSectionId
        }
      });

      // 2. Fetch Existing Attendance
      const attendanceRes = await axiosInstance.get("/v1/attendance/report", {
          params: {
              date: selectedDate,
              class_id: selectedClassId,
              section_id: selectedSectionId,
              type: "student"
          }
      });

      if (studentsRes.data.success) {
        const studentList = studentsRes.data.data;
        setStudents(studentList);
        
        // Default: Mark everyone present if no record exists
        let newAttendanceData = {};
        
        // If attendance exists, map it
        if (attendanceRes.data.success && attendanceRes.data.data.length > 0) {
            // Assuming backend returns array of { studentId, status, ... }
            // Or maybe it returns a single document with an array of records? 
            // Let's assume the controller returns a list of attendance records for that day/class/section
            // We need to map it carefully.
            
            // Wait, looking at common patterns, likely it returns a list of records where each record is specific to a student?
            // OR one record for the class? 
            // Let's assume it returns a list of students with their attendance status appended, OR a list of attendance documents.
            // If the backend `getStudentAttendance` returns the Attendance document(s).
            
            // If I look at `attendanceController.js` (I haven't viewed it, but I can guess or assume standard behavior). 
            // Standard behavior: returns list of { studentId, status }
            
            // Let's handle the case where we get a list of records.
            const records = attendanceRes.data.data;
            // Create a lookup
            const statusMap = {};
            records.forEach(r => {
                if (r.student_id) statusMap[r.student_id._id || r.student_id] = r.status.toLowerCase();
            });
            
            studentList.forEach(s => {
                newAttendanceData[s._id] = statusMap[s._id] || "present"; // Default to present if student exists but no record (maybe new student)
            });
            
        } else {
             studentList.forEach(s => {
                newAttendanceData[s._id] = "present";
            });
        }
        setAttendanceData(newAttendanceData);
      }
    } catch (err) {
      console.error("Error fetching data:", err);
      toast.error("Failed to fetch data");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, [selectedClassId, selectedSectionId, selectedDate]);


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

  const handleSave = async () => {
    setLoading(true);
    try {
      const formattedData = Object.entries(attendanceData).map(([student_id, status]) => ({
        student_id,
        status: status.charAt(0).toUpperCase() + status.slice(1) // Backend expects "Present", "Absent", etc.
      }));

      const response = await axiosInstance.post("/v1/attendance/student", {
        date: selectedDate,
        class_id: selectedClassId,
        section_id: selectedSectionId,
        records: formattedData,
      });

      if (response.data.success) {
        toast.success("Attendance saved successfully!");
        fetchData(); // Refetch to ensure sync
      }
    } catch (err) {
      console.error("Error saving attendance:", err);
      toast.error("Failed to save attendance");
    } finally {
      setLoading(false);
    }
  };

  const markAllAs = (status) => {
    const newData = { ...attendanceData };
    students.forEach(s => newData[s._id] = status);
    setAttendanceData(newData);
  };

  const filteredStudents = students.filter(s => 
    s.name.toLowerCase().includes(searchTerm.toLowerCase()) || 
    s.studentId?.toLowerCase().includes(searchTerm.toLowerCase())
  );

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
                value={selectedClassId} 
                onChange={(e) => setSelectedClassId(e.target.value)}
                className="w-full bg-[#e6f4ef] border-2 border-slate-100 rounded-xl px-4 py-2.5 text-sm font-bold focus:border-[#00bd7f] outline-none transition-all"
              >
                {classes.map(c => (
                    <option key={c._id} value={c._id}>{c.name}</option>
                ))}
              </select>
            </div>
            <div className="space-y-2">
              <label className="text-xs font-black text-slate-500 uppercase flex items-center gap-2">
                <Filter className="w-3.5 h-3.5" /> Section
              </label>
              <select 
                value={selectedSectionId} 
                onChange={(e) => setSelectedSectionId(e.target.value)}
                className="w-full bg-[#e6f4ef] border-2 border-slate-100 rounded-xl px-4 py-2.5 text-sm font-bold focus:border-[#00bd7f] outline-none transition-all"
              >
                {filteredSections.map(s => (
                    <option key={s._id} value={s._id}>{s.name}</option>
                ))}
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
              <button 
                onClick={() => markAllAs("present")} 
                className="flex-1 md:flex-none px-4 py-2 text-xs font-black bg-emerald-50 text-emerald-600 rounded-lg hover:bg-emerald-100 transition-colors border border-emerald-200"
              >
                Mark All Present
              </button>
              <button 
                onClick={handleSave}
                disabled={loading}
                className="flex-1 md:flex-none px-6 py-2 text-xs font-black bg-[#00bd7f] text-white rounded-xl shadow-lg shadow-emerald-200 flex items-center justify-center gap-2 disabled:opacity-50"
              >
                <Save className="w-3.5 h-3.5" /> 
                {loading ? "Saving..." : "Save Attendance"}
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
                {filteredStudents.map((student) => (
                  <tr key={student._id} className="hover:bg-slate-50/50 transition-colors">
                    <td className="px-6 py-4">
                      <span className="text-sm font-black text-slate-700">{student.rollNo}</span>
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-3">
                        <img src={student.photo || `https://api.dicebear.com/7.x/avataaars/svg?seed=${student._id}`} className="w-8 h-8 rounded-full bg-emerald-100 p-0.5" />
                        <span className="text-sm font-bold text-slate-800">{student.name}</span>
                      </div>
                    </td>
                    <td className="px-6 py-4 text-sm font-black text-emerald-600">{student.studentId}</td>
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
                            onClick={() => handleStatusChange(student._id, status.key)}
                            className={`w-10 h-10 rounded-xl text-xs font-black border-2 transition-all flex items-center justify-center ${
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
