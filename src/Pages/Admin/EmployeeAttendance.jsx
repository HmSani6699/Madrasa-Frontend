import { useState, useEffect } from "react";
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
import axiosInstance from "../../api/axiosInstance";
import { toast } from "react-hot-toast";

const EmployeeAttendance = () => {
  const [attendanceMode, setAttendanceMode] = useState("manual"); // "manual" or "biometric"
  const [selectedDepartment, setSelectedDepartment] = useState("all");
  const [selectedDate, setSelectedDate] = useState(new Date().toISOString().split('T')[0]);
  const [searchTerm, setSearchTerm] = useState("");

  const [employees, setEmployees] = useState([]);
  const [loading, setLoading] = useState(false);
  const [departments, setDepartments] = useState([]);
  const [attendanceData, setAttendanceData] = useState({});

  useEffect(() => {
    const fetchDepts = async () => {
      try {
        const response = await axiosInstance.get("/v1/departments");
        if (response.data.success) setDepartments(response.data.data);
      } catch (err) {
        console.error("Error fetching departments:", err);
      }
    };
    fetchDepts();
  }, []);

  const fetchEmployeesAndAttendance = async () => {
    setLoading(true);
    try {
      // 1. Fetch Employees
      const params = {};
      if (selectedDepartment !== 'all') params.department = selectedDepartment;
      
      const empRes = await axiosInstance.get("/v1/staff", { params });

      // 2. Fetch Existing Attendance
      const attParams = { date: selectedDate, type: "staff" };
      const attRes = await axiosInstance.get("/v1/attendance/report", { params: attParams });

      if (empRes.data.success) {
        const empList = empRes.data.data;
        setEmployees(empList);

        let newAttendanceData = {};

        if (attRes.data.success && attRes.data.data.length > 0) {
             const records = attRes.data.data;
             const statusMap = {};
             records.forEach(r => {
                 if (r.employeeId) statusMap[r.employeeId._id || r.employeeId] = r.status;
             });

             empList.forEach(e => {
                 newAttendanceData[e._id] = statusMap[e._id] || "present";
             });
        } else {
             empList.forEach(e => {
                newAttendanceData[e._id] = "present";
            });
        }
        setAttendanceData(newAttendanceData);
      }
    } catch (err) {
      console.error("Error fetching employees/attendance:", err);
      toast.error("Failed to fetch data");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchEmployeesAndAttendance();
  }, [selectedDepartment, selectedDate]);


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

  const handleSave = async () => {
    setLoading(true);
    try {
      const formattedData = Object.entries(attendanceData).map(([staff_id, status]) => ({
        staff_id,
        status: status.charAt(0).toUpperCase() + status.slice(1) // Backend Joi expects "Present", "Absent", etc.
      }));

      const response = await axiosInstance.post("/v1/attendance/staff", {
        date: selectedDate,
        records: formattedData
      });

      if (response.data.success) {
        toast.success("Staff attendance saved successfully!");
        fetchEmployeesAndAttendance(); // Sync
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
    employees.forEach(e => newData[e._id] = status);
    setAttendanceData(newData);
  };
  
  const filteredEmployees = employees.filter(e => 
      e.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      e.employeeID?.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className=" animate-in fade-in duration-500 ">
      {/* Header Section */}
      <div className=" rounded-[8px]  mb-4 flex flex-col md:flex-row justify-between items-center gap-6 ">
        <div>
          <h1 className="text-2xl md:text-3xl font-black text-slate-800 flex items-center gap-3">
            <Calendar className="w-8 h-8 text-[#00315e]" />
            Employee Attendance
          </h1>
          <p className="text-slate-500 font-bold mt-1">Manage staff daily attendance</p>
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
            Manual Mode
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
            Biometric Mode
          </button>
        </div>
      </div>

      {/* Control & Stats Bar */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Filters */}
        <div className="lg:col-span-8 bg-white rounded-[8px]  p-6 shadow-sm">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="space-y-2">
              <label className="text-xs font-black text-slate-500 uppercase flex items-center gap-2">
                <Briefcase className="w-3.5 h-3.5" /> Department
              </label>
              <select 
                value={selectedDepartment} 
                onChange={(e) => setSelectedDepartment(e.target.value)}
                className="w-full bg-[#00315e24] border-none rounded-[8px] px-4 py-2.5 text-sm font-bold focus:ring-1 focus:ring-[#00315e] outline-none transition-all"
              >
                <option value="all">All Departments</option>
                {departments.map(dept => (
                  <option key={dept._id} value={dept.name}>{dept.name}</option>
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
                className="w-full bg-[#00315e24] border-none rounded-[8px] px-4 py-2.5 text-sm font-bold focus:ring-1 focus:ring-[#00315e] outline-none transition-all" 
              />
            </div>
          </div>
        </div>

        {/* Quick Stats */}
        <div className="lg:col-span-4 bg-white rounded-[8px]  p-6 shadow-sm flex items-center justify-around">
          <div className="text-center">
            <p className="text-2xl font-black text-slate-800">{stats.present}</p>
            <p className="text-[10px] font-black text-emerald-500 uppercase tracking-widest">Current</p>
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
            <p className="text-[10px] font-black text-blue-500 uppercase tracking-widest">Skip</p>
          </div>
        </div>
      </div>

      {attendanceMode === "manual" ? (
        <div className="bg-white rounded-[8px] border-2 border-slate-100 shadow-xl shadow-slate-100/50 overflow-hidden relative lg:mt-[25px]">
          {
            filteredEmployees.length > 0 ? (
              <div>
                {/* Action Bar */}
                <div className="bg-slate-50 py-4 flex flex-col md:flex-row justify-between items-center gap-4 border-b-2 border-slate-100">
                  <div className="relative w-full md:w-64">
                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                    <input 
                      placeholder="Search employees..."
                      value={searchTerm}
                      onChange={(e) => setSearchTerm(e.target.value)}
                      className="w-full pl-10 pr-4 py-2 bg-[#00315e24] border-none rounded-[8px] text-sm font-bold outline-none focus:ring-1 focus:ring-[#00315e] transition-all"
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
                      className="flex-1 md:flex-none px-6 py-2 text-xs font-black bg-[#00315e] text-white rounded-[8px] shadow-lg shadow-slate-200 flex items-center justify-center gap-2 disabled:opacity-50"
                    >
                      <Save className="w-3.5 h-3.5" /> 
                      {loading ? "Saving..." : "Save Attendance"}
                    </button>
                  </div>
                </div>

          {/* Table */}
          <div className="overflow-x-auto rounded-t-[8px]">
            <table className="w-full">
              <thead className="bg-[#00315e24]">
                <tr>
                  <th className="px-10 py-3.5 text-left text-[12px] font-black">Employee ID</th>
                  <th className="px-10 py-3.5 text-left text-[12px] font-black">Name & Designation</th>
                  <th className="px-10 py-3.5 text-center text-[12px] font-black w-64">Attendance Status</th>
                </tr>
              </thead>
              <tbody className="divide-y-2 divide-slate-100">
                {filteredEmployees.map((emp) => (
                  <tr key={emp._id} className="group hover:bg-amber-50/10 transition-all duration-300">
                    <td className="px-10 py-3.5">
                      <span className="text-sm font-bold text-slate-500">{emp.employeeID || emp.id}</span>
                    </td>
                    <td className="px-10 py-3.5">
                      <div className="flex items-center gap-3">
                        <img src={emp.photo || `https://api.dicebear.com/7.x/avataaars/svg?seed=${emp._id}`} className="w-8 h-8 rounded-full bg-slate-100 p-0.5" />
                        <div>
                          <p className="text-sm font-bold text-slate-800">{emp.name}</p>
                          <p className="text-[10px] font-black text-slate-400 uppercase tracking-wider">{emp.designation}</p>
                        </div>
                      </div>
                    </td>
                    <td className="px-10 py-3.5">
                      <div className="flex justify-center gap-1.5">
                        {[
                          { key: 'present', label: 'Current', color: 'bg-emerald-500', bg: 'bg-emerald-50' },
                          { key: 'absent', label: 'Absent', color: 'bg-rose-500', bg: 'bg-rose-50' },
                          { key: 'late', label: 'Late', color: 'bg-amber-500', bg: 'bg-amber-50' },
                          { key: 'leave', label: 'Skip', color: 'bg-blue-500', bg: 'bg-blue-50' },
                        ].map(status => (
                          <button
                            key={status.key}
                            onClick={() => handleStatusChange(emp._id, status.key)}
                            className={`px-3 py-1.5 rounded-[8px] text-xs font-black border-2 transition-all flex items-center justify-center ${
                              attendanceData[emp._id] === status.key 
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
            ) : <div className="h-[200px] w-full flex items-center justify-center"><p> No employees found</p></div>
          }
        </div>
      ) : (
        /* Biometric View */
        <div className="bg-white rounded-3xl border-2 border-slate-200 shadow-sm p-8 text-center space-y-8 min-h-[400px] flex flex-col items-center justify-center">
          <div className="w-24 h-24 bg-[#00315e24] rounded-full flex items-center justify-center animate-pulse">
            <Fingerprint className="w-12 h-12 text-[#00315e]" />
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
            <button className="flex-1 px-8 py-4 bg-[#00315e] text-white font-black rounded-2xl flex items-center justify-center gap-3 shadow-xl shadow-slate-200 hover:scale-[1.02] active:scale-95 transition-all">
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

export default EmployeeAttendance;
