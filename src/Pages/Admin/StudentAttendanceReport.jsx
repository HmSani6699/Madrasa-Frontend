import { useState, useEffect, useMemo, useRef } from "react";
import { 
  Search, 
  Printer, 
  FileSpreadsheet, 
  Filter, 
  Users, 
  Calendar,
  FileText,
  ChevronLeft, 
  ChevronRight,
  ChevronDown,
  X,
  RotateCcw,
  CheckCircle,
  XCircle,
  Clock,
  Coffee
} from "lucide-react";
import { useTranslation } from "react-i18next";
import axiosInstance from "../../api/axiosInstance";
import { toast } from "react-hot-toast";

const StudentAttendanceReport = () => {
  const { t } = useTranslation();
  const [searchTerm, setSearchTerm] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 15;
  
  const [classes, setClasses] = useState([]);
  const [sections, setSections] = useState([]);
  const [selectedClassId, setSelectedClassId] = useState("");
  const [selectedSectionId, setSelectedSectionId] = useState("");
  const [selectedMonth, setSelectedMonth] = useState("");
  const [reportData, setReportData] = useState(null);
  const [loading, setLoading] = useState(false);
  const [showFilter, setShowFilter] = useState(false);
  const filterRef = useRef(null);

  // Close dropdown on click outside or Escape key
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (filterRef.current && !filterRef.current.contains(event.target)) {
        setShowFilter(false);
      }
    };
    const handleKeyDown = (event) => {
      if (event.key === "Escape") {
        setShowFilter(false);
      }
    };

    if (showFilter) {
      document.addEventListener("mousedown", handleClickOutside);
      window.addEventListener("keydown", handleKeyDown);
    }
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
      window.removeEventListener("keydown", handleKeyDown);
    };
  }, [showFilter]);

  const selectedClassName = useMemo(() => {
    return classes.find((c) => c._id === selectedClassId)?.name || "";
  }, [classes, selectedClassId]);

  const selectedSectionName = useMemo(() => {
    return sections.find((s) => s._id === selectedSectionId)?.name || "";
  }, [sections, selectedSectionId]);

  useEffect(() => {
    const fetchClasses = async () => {
      try {
        const res = await axiosInstance.get("/v1/classes");
        if (res.data.success) {
          setClasses(res.data.data);
        }
      } catch (err) {
        console.error("Error fetching classes:", err);
      }
    };
    fetchClasses();
  }, []);

  useEffect(() => {
    if (selectedClassId) {
      const fetchSections = async () => {
        try {
          const res = await axiosInstance.get(`/v1/sections?class_id=${selectedClassId}`);
          if (res.data.success) {
            setSections(res.data.data);
          }
        } catch (err) {
          console.error("Error fetching sections:", err);
        }
      };
      fetchSections();
    } else {
      setSections([]);
      setSelectedSectionId("");
    }
  }, [selectedClassId]);

  const generateReport = async () => {
    if (!selectedClassId || !selectedSectionId || !selectedMonth) {
      toast.error("Please select class, section, and month.");
      return false;
    }

    setLoading(true);
    try {
      const [yearStr, monthStr] = selectedMonth.split('-');
      const y = parseInt(yearStr, 10);
      const m = parseInt(monthStr, 10);
      const daysInMonth = new Date(y, m, 0).getDate();

      const startDateStr = `${y}-${String(m).padStart(2, '0')}-01`;
      const endDateStr = `${y}-${String(m).padStart(2, '0')}-${String(daysInMonth).padStart(2, '0')}`;
      
      const generatedDays = Array.from({ length: daysInMonth }, (_, i) => {
        const d = new Date(y, m - 1, i + 1);
        return {
          num: (i + 1).toString().padStart(2, '0'),
          day: ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"][d.getDay()]
        };
      });

      const [studentsRes, attendanceRes] = await Promise.all([
        axiosInstance.get("/v1/students", {
          params: {
            class_id: selectedClassId,  
            section_id: selectedSectionId
          }
        }),
        axiosInstance.get("/v1/attendance/report", {
          params: {
            start_date: startDateStr,
            end_date: endDateStr,
            class_id: selectedClassId,
            section_id: selectedSectionId,
            type: "student"
          }
        })
      ]);

      if (studentsRes.data.success) {
        const studentList = studentsRes.data.data;
        const attendanceRecords = attendanceRes.data.success ? attendanceRes.data.data : [];

        const totals = { w: 0, p: 0, a: 0, h: 0, l: 0, hd: 0 };

        const mappedStudents = studentList.map(student => {
          const stuAttendance = {};
          let stats = { w: 0, p: 0, a: 0, h: 0, l: 0, hd: 0, perc: '0%' };
          
          let totalWorkingDays = 0;
          let presentDays = 0;

          generatedDays.forEach(d => {
            const dayNum = parseInt(d.num, 10);
            if (d.day === 'Fri') {
              stuAttendance[dayNum] = 'W';
              stats.w++;
              totals.w++;
            } else {
              totalWorkingDays++;
            }
          });

          const studentRecords = attendanceRecords.filter(r => 
            r.student_id === student._id || r.student_id?._id === student._id
          );
          
          studentRecords.forEach(r => {
            let dayNum;
            if (typeof r.date === 'string' && r.date.includes('-')) {
              const parts = r.date.split('T')[0].split('-');
              dayNum = parseInt(parts[2], 10);
            } else {
              dayNum = new Date(r.date).getDate();
            }
            
            const statusStr = (r.status || '').toUpperCase();
            
            let code = 'P';
            if (statusStr === 'PRESENT') { code = 'P'; stats.p++; totals.p++; presentDays++; }
            else if (statusStr === 'ABSENT') { code = 'A'; stats.a++; totals.a++; }
            else if (statusStr === 'LATE') { code = 'L'; stats.l++; totals.l++; presentDays++; } 
            else if (statusStr === 'LEAVE') { code = 'A'; stats.a++; totals.a++; } 
            else if (statusStr === 'HOLIDAY') { code = 'H'; stats.h++; totals.h++; } 
            else if (statusStr === 'HALF_DAY') { code = 'HD'; stats.hd++; totals.hd++; presentDays += 0.5; } 
            
            if (stuAttendance[dayNum] !== 'W') {
              stuAttendance[dayNum] = code;
            }
          });

          if (totalWorkingDays > 0) {
            stats.perc = Math.round((presentDays / totalWorkingDays) * 100) + '%';
          } else {
            stats.perc = '-';
          }

          return {
            id: student._id,
            name: `${student.firstName || ''} ${student.lastName || ''}`.trim() || student.name || 'Unknown',
            roll: student.roll_number || student.rollNo || '-',
            attendance: stuAttendance,
            stats
          };
        });

        setReportData({
          days: generatedDays,
          students: mappedStudents,
          totals
        });
        setCurrentPage(1);
        return true;
      }
      return false;
    } catch (err) {
      console.error("Error generating report:", err);
      toast.error("Failed to generate report");
      return false;
    } finally {
      setLoading(false);
    }
  };

  const filteredStudents = useMemo(() => {
    if (!reportData?.students) return [];
    return reportData.students.filter(stu => 
      stu.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      String(stu.roll).toLowerCase().includes(searchTerm.toLowerCase())
    );
  }, [reportData, searchTerm]);

  const totalPages = Math.ceil(filteredStudents.length / itemsPerPage) || 1;
  const paginatedStudents = useMemo(() => {
    const start = (currentPage - 1) * itemsPerPage;
    return filteredStudents.slice(start, start + itemsPerPage);
  }, [filteredStudents, currentPage, itemsPerPage]);

  const handleExportCSV = () => {
    if (!reportData || !filteredStudents.length) {
      toast.error("No data available to export");
      return;
    }
    const daysHeader = reportData.days.map(d => `${d.num} (${d.day})`);
    const headers = ["SL", "Student Name", ...daysHeader, "Percentage (%)", "Weekend (W)", "Present (P)", "Absent (A)", "Late (L)", "Half Day (HD)"];
    const rows = filteredStudents.map((stu, i) => [
      i + 1,
      `"${stu.name.replace(/"/g, '""')}"`,
      ...reportData.days.map(d => stu.attendance[parseInt(d.num, 10)] || "-"),
      `"${stu.stats.perc}"`,
      stu.stats.w,
      stu.stats.p,
      stu.stats.a,
      stu.stats.l,
      stu.stats.hd
    ]);
    const csvContent = "data:text/csv;charset=utf-8," + [headers.join(","), ...rows.map(e => e.join(","))].join("\n");
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement("a");
    link.setAttribute("href", encodedUri);
    link.setAttribute("download", `Student_Attendance_${selectedMonth || "Report"}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    toast.success("Attendance report exported to CSV");
  };

  const handlePrint = () => {
    if (!reportData || !filteredStudents.length) {
      toast.error("No report data to print");
      return;
    }
    window.print();
  };

  return (
    <div className="animate-in fade-in duration-500 space-y-5">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-3">
        <div>
          <h1 className="text-[20px] font-black text-slate-800 flex items-center gap-3">
            <FileSpreadsheet className="w-8 h-8 text-[#00315e]" />
            Student Attendance Report
          </h1>
          <p className="text-[14px] text-slate-500 font-bold mt-1">
            Generate, view, and export monthly student attendance ledgers
          </p>
        </div>

        {/* Filter Trigger & Applied Badges */}
        <div className="flex flex-wrap items-center gap-2.5 relative" ref={filterRef}>
          {/* Active Summary Pills when report data is loaded */}
          {reportData && selectedClassName && (
            <div className="hidden sm:flex items-center gap-2 bg-white border border-slate-200 px-3 py-1.5 rounded-[8px] text-xs font-bold text-slate-600 shadow-sm">
              <span className="text-slate-400">Class:</span>
              <span className="text-[#00315e] font-black">{selectedClassName}</span>
              <span className="text-slate-300">•</span>
              <span className="text-slate-400">Sec:</span>
              <span className="text-[#00315e] font-black">{selectedSectionName}</span>
              <span className="text-slate-300">•</span>
              <span className="text-slate-400">Month:</span>
              <span className="text-[#00315e] font-black">{selectedMonth}</span>
            </div>
          )}

          {/* Filter Toggle Button */}
          <button
            type="button"
            onClick={() => setShowFilter((prev) => !prev)}
            className={`px-4 py-2.5 rounded-[8px] text-xs md:text-sm font-black flex items-center gap-2 transition-all border shadow-sm cursor-pointer ${
              showFilter || reportData
                ? "bg-[#00315e] text-white border-[#00315e] hover:bg-[#002244]"
                : "bg-white text-slate-700 border-slate-200 hover:bg-slate-50 hover:border-slate-300"
            }`}
          >
            <Filter className={`w-4 h-4 ${showFilter || reportData ? "text-white" : "text-[#00315e]"}`} />
            <span>Filter</span>
            {selectedClassId && selectedSectionId && selectedMonth && (
              <span className="w-2 h-2 rounded-full bg-emerald-400"></span>
            )}
            <ChevronDown
              className={`w-3.5 h-3.5 transition-transform duration-200 ${
                showFilter ? "rotate-180" : ""
              }`}
            />
          </button>

          {/* Dropdown Filter Panel */}
          {showFilter && (
            <div className="absolute right-0 top-full mt-2 w-[320px] sm:w-[400px] max-w-[90vw] bg-white rounded-[10px] shadow-2xl border border-slate-200 p-4 sm:p-5 z-50 animate-in fade-in zoom-in-95 duration-150">
              {/* Dropdown Header */}
              <div className="flex items-center justify-between pb-3 mb-4 border-b border-slate-100">
                <div className="flex items-center gap-2">
                  <div className="w-7 h-7 rounded-md bg-[#00315e]/10 flex items-center justify-center">
                    <Filter className="w-4 h-4 text-[#00315e]" />
                  </div>
                  <div>
                    <h3 className="text-sm font-black text-slate-800">Filter Attendance Report</h3>
                    <p className="text-[11px] font-bold text-slate-400">Select class, section, and month</p>
                  </div>
                </div>
                <button
                  type="button"
                  onClick={() => setShowFilter(false)}
                  className="p-1 text-slate-400 hover:text-slate-600 rounded-md hover:bg-slate-100 transition-colors cursor-pointer"
                  title="Close"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>

              {/* Form Controls */}
              <div className="space-y-3.5">
                {/* Class */}
                <div className="space-y-1.5">
                  <label className="text-xs font-black text-slate-600 uppercase flex items-center gap-1.5">
                    <Users className="w-3.5 h-3.5 text-[#00315e]" />
                    {t("common.class") || "Class"} <span className="text-rose-500">*</span>
                  </label>
                  <select
                    value={selectedClassId}
                    onChange={(e) => {
                      setSelectedClassId(e.target.value);
                    }}
                    className="w-full px-3.5 py-2 bg-white border border-slate-200 text-slate-900 rounded-[8px] text-sm font-bold outline-none focus:ring-0.5 focus:ring-[#00315e] focus:border-[#00315e] transition-all"
                  >
                    <option value="">Select class</option>
                    {classes.map((c) => (
                      <option key={c._id} value={c._id}>
                        {c.name}
                      </option>
                    ))}
                  </select>
                </div>

                {/* Section */}
                <div className="space-y-1.5">
                  <label className="text-xs font-black text-slate-600 uppercase flex items-center gap-1.5">
                    <Filter className="w-3.5 h-3.5 text-[#00315e]" />
                    {t("common.section") || "Section"} <span className="text-rose-500">*</span>
                  </label>
                  <select
                    value={selectedSectionId}
                    onChange={(e) => {
                      setSelectedSectionId(e.target.value);
                    }}
                    disabled={!selectedClassId}
                    className="w-full px-3.5 py-2 bg-white border border-slate-200 text-slate-900 rounded-[8px] text-sm font-bold outline-none focus:ring-0.5 focus:ring-[#00315e] focus:border-[#00315e] transition-all disabled:opacity-50 disabled:bg-slate-50"
                  >
                    <option value="">Select section</option>
                    {sections.map((s) => (
                      <option key={s._id} value={s._id}>
                        {s.name}
                      </option>
                    ))}
                  </select>
                </div>

                {/* Month */}
                <div className="space-y-1.5">
                  <label className="text-xs font-black text-slate-600 uppercase flex items-center gap-1.5">
                    <Calendar className="w-3.5 h-3.5 text-[#00315e]" />
                    {t("common.month") || "Month"} <span className="text-rose-500">*</span>
                  </label>
                  <input
                    type="month"
                    value={selectedMonth}
                    onChange={(e) => {
                      setSelectedMonth(e.target.value);
                    }}
                    className="w-full px-3.5 py-2 bg-white border border-slate-200 text-slate-900 rounded-[8px] text-sm font-bold outline-none focus:ring-0.5 focus:ring-[#00315e] focus:border-[#00315e] transition-all"
                  />
                </div>
              </div>

              {/* Action Buttons in Dropdown */}
              <div className="mt-5 pt-3.5 border-t border-slate-100 flex items-center justify-between gap-3">
                <button
                  type="button"
                  onClick={() => {
                    setSelectedClassId("");
                    setSelectedSectionId("");
                    setSelectedMonth("");
                    setReportData(null);
                  }}
                  className="px-3 py-2 text-xs font-bold text-slate-500 hover:text-slate-800 hover:bg-slate-100 rounded-[8px] transition-colors flex items-center gap-1.5 cursor-pointer"
                >
                  <RotateCcw className="w-3.5 h-3.5" />
                  Reset
                </button>

                <div className="flex items-center gap-2">
                  <button
                    type="button"
                    onClick={() => setShowFilter(false)}
                    className="px-3.5 py-2 text-xs font-bold text-slate-600 bg-slate-100 hover:bg-slate-200 rounded-[8px] transition-colors cursor-pointer"
                  >
                    Cancel
                  </button>
                  <button
                    type="button"
                    onClick={async () => {
                      const success = await generateReport();
                      if (success) {
                        setShowFilter(false);
                      }
                    }}
                    disabled={loading || !selectedClassId || !selectedSectionId || !selectedMonth}
                    className="px-4 py-2 bg-[#00315e] text-white rounded-[8px] text-xs font-black hover:bg-[#002244] active:scale-95 transition-all flex items-center gap-1.5 cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed shadow-md shadow-slate-200"
                  >
                    <Filter className="w-3.5 h-3.5" />
                    {loading ? "Generating..." : t("reports_page.generate_report") || "Generate Report"}
                  </button>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Loading State */}
      {loading && !reportData && (
        <div className="bg-white rounded-[8px] p-16 border border-slate-200 shadow-sm flex flex-col items-center justify-center">
          <div className="w-12 h-12 border-4 border-[#00315e] border-t-transparent rounded-full animate-spin mb-4"></div>
          <p className="text-slate-500 font-bold">Generating Attendance Report...</p>
        </div>
      )}

      {/* Summary Cards */}
      {reportData && (
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-4">
          {[
            { label: "Total Students", value: reportData.students.length, color: "text-[#00315e]", bg: "bg-[#00315e24]" },
            { label: "Present (P)", value: reportData.totals.p, color: "text-emerald-600", bg: "bg-emerald-50" },
            { label: "Absent (A)", value: reportData.totals.a, color: "text-rose-600", bg: "bg-rose-50" },
            { label: "Late (L)", value: reportData.totals.l, color: "text-amber-600", bg: "bg-amber-50" },
            { label: "Half Day (HD)", value: reportData.totals.hd, color: "text-indigo-600", bg: "bg-indigo-50" },
            { label: "Weekend (W)", value: reportData.totals.w, color: "text-slate-600", bg: "bg-slate-100" },
          ].map((stat, idx) => (
            <div
              key={idx}
              className="bg-white rounded-[8px] p-4 flex flex-col justify-between shadow-sm border border-slate-200 relative overflow-hidden"
            >
              <div className="flex items-center justify-between">
                <p className="text-xs font-bold text-slate-500 uppercase">{stat.label}</p>
                <div className={`w-3 h-3 rounded-full ${stat.bg} ${stat.color}`} />
              </div>
              <p className={`text-2xl font-black ${stat.color} mt-2`}>{stat.value}</p>
            </div>
          ))}
        </div>
      )}

      {/* Ledger Table Container */}
      {reportData && (
        <div className="bg-white rounded-[8px] shadow-xl shadow-slate-100/50 border border-slate-200 overflow-hidden relative">
          {/* Action and Search Bar */}
          <div className="p-4 border-b border-slate-200 flex flex-col md:flex-row justify-between items-center gap-4 bg-white">
            <div className="flex items-center gap-3 w-full md:w-auto">
              <div className="relative flex-1 md:w-[300px]">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                <input
                  type="text"
                  placeholder={t("reports_page.search_student") || "Search student name..."}
                  value={searchTerm}
                  onChange={(e) => {
                    setSearchTerm(e.target.value);
                    setCurrentPage(1);
                  }}
                  className="w-full pl-10 pr-4 py-2 bg-[#fff] border border-slate-200 text-slate-900 rounded-[8px] outline-none focus:ring-0.5 focus:ring-[#00315e] focus:border-[#00315e] transition-all text-sm font-medium"
                />
              </div>
            </div>

            {/* Export & Action Buttons */}
            <div className="flex items-center gap-2 w-full md:w-auto justify-end">
              <button
                onClick={handleExportCSV}
                title="Export CSV"
                className="px-3.5 py-2 bg-white border border-slate-200 text-slate-700 hover:bg-[#00315e24] hover:text-[#00315e] hover:border-[#00315e]/30 rounded-[8px] transition-all flex items-center gap-2 text-xs font-bold shadow-sm cursor-pointer"
              >
                <FileSpreadsheet className="w-4 h-4 text-[#00315e]" />
                <span>Excel/CSV</span>
              </button>
              <button
                onClick={handlePrint}
                title="Print Report"
                className="px-3.5 py-2 bg-white border border-slate-200 text-slate-700 hover:bg-[#00315e24] hover:text-[#00315e] hover:border-[#00315e]/30 rounded-[8px] transition-all flex items-center gap-2 text-xs font-bold shadow-sm cursor-pointer"
              >
                <Printer className="w-4 h-4 text-[#00315e]" />
                <span>Print</span>
              </button>
            </div>
          </div>

          {/* Table */}
          <div className="overflow-x-auto border-t border-slate-100">
            <table className="w-full border-collapse">
              <thead className="bg-[#00315e24]">
                <tr className="text-[11px] font-black text-slate-800 uppercase tracking-wider whitespace-nowrap">
                  <th className="px-4 py-3 border-b border-r border-slate-200 sticky left-0 z-20 bg-[#edf3f8] text-left min-w-[200px]">
                    {t("common.student_name") || "Student Name"}
                  </th>
                  {reportData.days.map((d) => (
                    <th
                      key={d.num}
                      className={`p-2 border-b border-r border-slate-200 text-center min-w-[42px] ${
                        d.day === "Fri" ? "text-rose-600 bg-[#ffe8e8]/60" : ""
                      }`}
                    >
                      <div className="flex flex-col items-center">
                        <span className="text-[10px] text-slate-500 font-bold">{d.day}</span>
                        <span className="text-xs font-black text-slate-800">{d.num}</span>
                      </div>
                    </th>
                  ))}
                  <th className="px-3 py-3 border-b border-r border-slate-200 text-center sticky right-0 z-20 bg-[#edf3f8] min-w-[60px]">
                    (%)
                  </th>
                  <th className="px-3 py-3 border-b border-r border-slate-200 text-center min-w-[45px] text-slate-700">W</th>
                  <th className="px-3 py-3 border-b border-r border-slate-200 text-center min-w-[45px] text-emerald-600">P</th>
                  <th className="px-3 py-3 border-b border-r border-slate-200 text-center min-w-[45px] text-rose-600">A</th>
                  <th className="px-3 py-3 border-b border-r border-slate-200 text-center min-w-[45px] text-amber-600">L</th>
                  <th className="px-3 py-3 border-b border-slate-200 text-center min-w-[45px] text-indigo-600">HD</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {paginatedStudents.length > 0 ? (
                  paginatedStudents.map((stu, sIdx) => (
                    <tr key={stu.id || sIdx} className="group hover:bg-amber-50/10 transition-colors">
                      <td className="px-4 py-2.5 border-b border-r border-slate-200 sticky left-0 z-10 bg-white group-hover:bg-[#fffdf7] text-xs font-black text-slate-800 uppercase tracking-tight whitespace-nowrap">
                        {stu.name}
                      </td>
                      {reportData.days.map((d) => {
                        const dayNum = parseInt(d.num, 10);
                        const status = stu.attendance[dayNum];
                        return (
                          <td
                            key={d.num}
                            className={`border-b border-r border-slate-200 p-1 text-center ${
                              d.day === "Fri" ? "bg-rose-50/20" : ""
                            }`}
                          >
                            <div className="w-full h-8 flex items-center justify-center">
                              {status ? (
                                <span
                                  className={`w-7 h-7 flex items-center justify-center font-black text-[10px] rounded-[6px] ${
                                    status === "W"
                                      ? "bg-slate-100 text-slate-500"
                                      : status === "P"
                                      ? "bg-emerald-50 text-emerald-600 border border-emerald-200"
                                      : status === "A"
                                      ? "bg-rose-50 text-rose-600 border border-rose-200"
                                      : status === "L"
                                      ? "bg-amber-50 text-amber-600 border border-amber-200"
                                      : status === "H"
                                      ? "bg-cyan-50 text-cyan-600 border border-cyan-200"
                                      : status === "HD"
                                      ? "bg-indigo-50 text-indigo-600 border border-indigo-200"
                                      : "bg-blue-50 text-blue-600 border border-blue-200"
                                  }`}
                                >
                                  {status}
                                </span>
                              ) : (
                                <div className="w-1.5 h-1.5 bg-slate-200 rounded-full" />
                              )}
                            </div>
                          </td>
                        );
                      })}
                      <td className="px-2 py-2.5 text-center text-xs font-black text-slate-700 sticky right-0 bg-white group-hover:bg-[#fffdf7] border-b border-r border-slate-200">
                        {stu.stats.perc}
                      </td>
                      <td className="px-2 py-2.5 text-center text-xs font-black text-slate-600 border-b border-r border-slate-200">
                        {stu.stats.w}
                      </td>
                      <td className="px-2 py-2.5 text-center text-xs font-black text-emerald-600 border-b border-r border-slate-200">
                        {stu.stats.p}
                      </td>
                      <td className="px-2 py-2.5 text-center text-xs font-black text-rose-600 border-b border-r border-slate-200">
                        {stu.stats.a}
                      </td>
                      <td className="px-2 py-2.5 text-center text-xs font-black text-amber-600 border-b border-r border-slate-200">
                        {stu.stats.l}
                      </td>
                      <td className="px-2 py-2.5 text-center text-xs font-black text-indigo-600 border-b border-slate-200">
                        {stu.stats.hd}
                      </td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td
                      colSpan={reportData.days.length + 7}
                      className="py-16 text-center text-slate-400"
                    >
                      <div className="flex flex-col items-center justify-center">
                        <div className="w-12 h-12 bg-slate-50 text-slate-400 rounded-full flex items-center justify-center mb-3">
                          <Search className="w-6 h-6" />
                        </div>
                        <p className="font-bold text-slate-500">No students found matching your search</p>
                      </div>
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>

          {/* Pagination Bar */}
          {filteredStudents.length > 0 && (
            <div className="p-4 border-t border-slate-200 flex flex-col sm:flex-row items-center justify-between gap-4 bg-white">
              <p className="text-xs font-bold text-slate-500">
                Showing {(currentPage - 1) * itemsPerPage + 1} to{" "}
                {Math.min(currentPage * itemsPerPage, filteredStudents.length)} of{" "}
                {filteredStudents.length} students
              </p>

              <div className="flex items-center gap-2">
                <button
                  disabled={currentPage === 1}
                  onClick={() => setCurrentPage((p) => Math.max(1, p - 1))}
                  className="p-2 border border-slate-200 rounded-[8px] bg-white text-slate-600 hover:bg-slate-50 hover:border-[#00315e] hover:text-[#00315e] disabled:opacity-50 disabled:cursor-not-allowed transition-all cursor-pointer"
                >
                  <ChevronLeft className="w-4 h-4" />
                </button>
                <div className="flex items-center gap-1">
                  {[...Array(totalPages)].map((_, i) => (
                    <button
                      key={i + 1}
                      onClick={() => setCurrentPage(i + 1)}
                      className={`w-8 h-8 rounded-[8px] text-xs font-black transition-all border ${
                        currentPage === i + 1
                          ? "bg-[#00315e] border-[#00315e] text-white cursor-pointer"
                          : "bg-white border-slate-200 text-slate-600 hover:border-[#00315e] hover:text-[#00315e] cursor-pointer"
                      }`}
                    >
                      {i + 1}
                    </button>
                  ))}
                </div>
                <button
                  disabled={currentPage === totalPages}
                  onClick={() => setCurrentPage((p) => Math.min(totalPages, p + 1))}
                  className="p-2 border border-slate-200 rounded-[8px] bg-white text-slate-600 hover:bg-slate-50 hover:border-[#00315e] hover:text-[#00315e] disabled:opacity-50 disabled:cursor-not-allowed transition-all cursor-pointer"
                >
                  <ChevronRight className="w-4 h-4" />
                </button>
              </div>
            </div>
          )}
        </div>
      )}

      {/* Empty Initial State */}
      {!reportData && !loading && (
        <div className="bg-white rounded-[8px] p-12 border border-slate-200 shadow-sm text-center flex flex-col items-center justify-center">
          <div className="w-16 h-16 bg-[#00315e24] rounded-full flex items-center justify-center mb-4">
            <FileSpreadsheet className="w-8 h-8 text-[#00315e]" />
          </div>
          <h3 className="text-base font-black text-slate-800 mb-1">No Report Generated Yet</h3>
          <p className="text-sm font-bold text-slate-500 max-w-sm mb-4">
            Please click on the filter button above to select class, section, and month, and generate the attendance ledger.
          </p>
          <button
            type="button"
            onClick={() => setShowFilter(true)}
            className="px-5 py-2.5 bg-[#00315e] text-white rounded-[8px] text-xs font-black hover:bg-[#002244] active:scale-95 transition-all flex items-center gap-2 cursor-pointer shadow-md shadow-slate-200"
          >
            <Filter className="w-4 h-4" />
            Open Filter
          </button>
        </div>
      )}
    </div>
  );
};

export default StudentAttendanceReport;
