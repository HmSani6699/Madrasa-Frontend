import { useState, useEffect } from "react";
import { Clock, Filter, Printer, Download, Search, Calendar } from "lucide-react";
import axiosInstance from "../../../api/axiosInstance";
import { toast } from "react-hot-toast";

const ClassRoutineReport = () => {
  const [loading, setLoading] = useState(false);
  const [selectedClass, setSelectedClass] = useState("");
  const [selectedSection, setSelectedSection] = useState("");
  const [isFilterModalOpen, setIsFilterModalOpen] = useState(false);
  const [classes, setClasses] = useState([]);
  const [sections, setSections] = useState([]);
  const [scheduleData, setScheduleData] = useState([]);

  useEffect(() => {
    fetchDropdowns();
  }, []);

  const fetchDropdowns = async () => {
    try {
      const [classRes, sectionRes] = await Promise.all([
        axiosInstance.get('/v1/classes').catch(() => ({ data: { data: [] } })),
        axiosInstance.get('/v1/sections').catch(() => ({ data: { data: [] } }))
      ]);

      if (classRes.data?.data) setClasses(classRes.data.data.map(c => ({ value: c._id, label: c.name })));
      if (sectionRes.data?.data) setSections(sectionRes.data.data.map(s => ({ value: s._id, label: s.name })));
    } catch (err) {
      console.error("Failed to fetch dropdowns", err);
    }
  };

  const handleFilter = async () => {
    if (!selectedClass || !selectedSection) {
      toast.error("Please select class and section");
      return;
    }
    setLoading(true);
    try {
      const queryParams = new URLSearchParams({
        class_id: selectedClass,
        section_id: selectedSection
      });
      const res = await axiosInstance.get(`/v1/class-routines?${queryParams.toString()}`);
      if (res.data?.success) {
        setScheduleData(res.data.data);
      }
    } catch (err) {
      console.error("Error fetching routine:", err);
      toast.error("Failed to load routine");
    } finally {
      setLoading(false);
    }
  };

  const days = ["Saturday", "Sunday", "Monday", "Tuesday", "Wednesday", "Thursday"];
  const routineData = days.map(day => {
    const routine = scheduleData.find((item) => item.day === day);
    const dayPeriods = routine && routine.periods ? routine.periods : [];
    
    const sortedPeriods = [...dayPeriods].sort((a, b) => (a.startTime || "").localeCompare(b.startTime || ""));
    
    const periods = sortedPeriods.map(period => ({
      subject: period.subject?.name || period.subjectId?.name || "N/A",
      time: `${period.startTime} - ${period.endTime}`,
      teacher: period.teacher?.name || period.teacherId?.name || ""
    }));
    return { day, periods };
  });

  const maxPeriods = Math.max(...routineData.map(r => r.periods.length), 0);

  return (
    <div className="p-6 min-h-screen space-y-6 animate-in fade-in duration-500">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-black text-slate-800 flex items-center gap-3">
            <Clock className="w-8 h-8 text-[#00315e]" />
            Class Routine & Load Report
          </h1>
          <p className="text-sm text-slate-500 font-bold mt-1">
            View and print weekly class schedules and teacher loads
          </p>
        </div>
        <div className="flex items-center gap-3">
          <button className="px-4 py-2 bg-white border border-slate-200 text-slate-600 rounded-lg flex items-center gap-2 hover:bg-slate-50 transition-colors font-bold text-sm">
            <Download size={18} />
            Export
          </button>


          <div className="relative">
            <button
              onClick={() => setIsFilterModalOpen(!isFilterModalOpen)}
              className="px-4 py-2 bg-[#00315e] border border-slate-200 text-white rounded-lg cursor-pointer flex items-center gap-2  transition-all font-bold text-sm"
            >
              <Filter size={18} />
              Filter
            </button>

            {isFilterModalOpen && (
              <div className="absolute top-[48px] right-0 z-[100] flex flex-col gap-3 bg-white border border-slate-200 p-5 rounded-xl shadow-lg w-[320px]">
                <h3 className="font-bold text-slate-700 mb-2 border-b pb-2">Filter Routine</h3>

                <div className="flex flex-col gap-3">
                  <select
                    className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-lg focus:ring-2 focus:ring-[#00315e]/20 outline-none text-sm font-medium"
                    value={selectedClass}
                    onChange={(e) => setSelectedClass(e.target.value)}
                  >
                    <option value="">Select Class</option>
                    {classes.map((c) => (
                      <option key={c.value} value={c.value}>{c.label}</option>
                    ))}
                  </select>

                  <select
                    className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-lg focus:ring-2 focus:ring-[#00315e]/20 outline-none text-sm font-medium"
                    value={selectedSection}
                    onChange={(e) => setSelectedSection(e.target.value)}
                  >
                    <option value="">Select Section</option>
                    {sections.map((s) => (
                      <option key={s.value} value={s.value}>{s.label}</option>
                    ))}
                  </select>
                </div>

                <div className="flex items-center justify-end gap-3 mt-4">
                  <button
                    onClick={() => { setSelectedClass(""); setSelectedSection(""); setIsFilterModalOpen(false); }}
                    className="px-4 py-2 bg-rose-50 text-rose-600 font-bold rounded-lg hover:bg-rose-100 transition-colors text-sm"
                  >
                    Reset
                  </button>
                  <button
                    onClick={() => { handleFilter(); setIsFilterModalOpen(false); }}
                    disabled={loading}
                    className="px-6 py-2 bg-[#00315e] text-white font-bold rounded-lg hover:bg-[#00315e]/90 transition-colors flex items-center justify-center min-w-[100px] text-sm gap-2"
                  >
                    {loading ? (
                      <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                    ) : (
                      <>
                        <Search size={16} />
                        Apply
                      </>
                    )}
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Report Content */}
      <div className="bg-white rounded-xl shadow-sm border border-slate-200 overflow-hidden">
        <div className="p-6 bg-[#00315e]/5 border-b border-slate-200 flex justify-between items-center">
          <div>
            <h2 className="text-lg font-black text-slate-800">Weekly Routine</h2>
            <p className="text-sm font-medium text-slate-500">Class: {selectedClass || 'All'} | Section: {selectedSection || 'All'}</p>
          </div>
          <Calendar className="w-10 h-10 text-[#00315e] opacity-20" />
        </div>
        <div className="overflow-x-auto">
          {scheduleData.length > 0 ? (
          <table className="w-full text-left border-collapse min-w-max">
            <thead>
              <tr className="bg-slate-50">
                <th className="p-4 font-bold text-sm text-slate-600 border-b border-r border-slate-200 w-32 sticky left-0 z-10 bg-slate-50">Day</th>
                {Array.from({ length: maxPeriods }).map((_, i) => (
                  <th key={i} className="p-4 font-bold text-sm text-slate-600 border-b border-slate-200 text-center min-w-[150px]">
                    Period {i + 1}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {routineData.map((row, index) => (
                <tr key={index} className="hover:bg-blue-50/30 transition-colors">
                  <td className="p-4 border-b border-r border-slate-200 font-bold text-sm text-[#00315e] bg-slate-50/50 sticky left-0 z-10">
                    {row.day}
                  </td>
                  {row.periods.map((period, pIndex) => (
                    <td key={pIndex} className="p-4 border-b border-slate-200 text-center">
                      <div className="bg-blue-50/50 p-3 rounded-lg border border-blue-100 flex flex-col gap-1 min-w-[120px]">
                        <span className="font-black text-sm text-[#00315e]">{period.subject}</span>
                        <span className="text-[11px] font-bold text-slate-500 opacity-80">{period.time}</span>
                        {period.teacher && <span className="text-[10px] font-bold uppercase tracking-wide bg-white px-2 py-0.5 rounded border border-blue-100 mt-1 text-slate-600">{period.teacher}</span>}
                      </div>
                    </td>
                  ))}
                  {Array.from({ length: maxPeriods - row.periods.length }).map((_, i) => (
                    <td key={`empty-${i}`} className="p-4 border-b border-slate-200 text-center">
                      <span className="text-slate-300">-</span>
                    </td>
                  ))}
                </tr>
              ))}
            </tbody>
          </table>
          ) : (
            <div className="p-10 text-center flex flex-col items-center justify-center gap-2">
              <Calendar className="w-12 h-12 text-slate-300" />
              <p className="text-slate-500 font-medium text-sm">Please select a class and section, then click Apply to view the routine.</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default ClassRoutineReport;
