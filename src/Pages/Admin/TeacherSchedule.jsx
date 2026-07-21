import { useState, useEffect, useMemo } from "react";
import {
  Calendar,
  Clock,
  User,
  Search,
  School,
  MapPin,
  ChevronRight,
  Filter,
  Check,
  X,
  BookOpen
} from "lucide-react";
import axiosInstance from "../../api/axiosInstance";
import { toast } from "react-hot-toast";

const TeacherSchedule = () => {
  const [loading, setLoading] = useState(true);
  const [scheduleLoading, setScheduleLoading] = useState(false);

  // Data
  const [teachers, setTeachers] = useState([]);
  const [selectedTeacherIds, setSelectedTeacherIds] = useState([]);
  const [teacherSearchQuery, setTeacherSearchQuery] = useState("");
  const [isTeacherDropdownOpen, setIsTeacherDropdownOpen] = useState(false);
  const [scheduleData, setScheduleData] = useState([]);

  // UI State
  const [activeDay, setActiveDay] = useState("Saturday");

  const days = [
    "Saturday",
    "Sunday",
    "Monday",
    "Tuesday",
    "Wednesday",
    "Thursday",
  ];

  // Fetch Initial Data (Teachers)
  useEffect(() => {
    const fetchInitialData = async () => {
      try {
        const teachersRes = await axiosInstance.get("/v1/staff?role=Teacher");

        if (teachersRes.data.success) {
          setTeachers(teachersRes.data.data);
          if (teachersRes.data.data.length > 0) {
            setSelectedTeacherIds([teachersRes.data.data[0]._id]);
          }
        }
      } catch (err) {
        console.error("Error fetching initial data:", err);
        toast.error("Failed to load teachers");
      } finally {
        setLoading(false);
      }
    };

    fetchInitialData();
  }, []);

  // Fetch Schedule when teachers change
  useEffect(() => {
    if (selectedTeacherIds.length > 0) {
      fetchSchedule(selectedTeacherIds);
    } else {
      setScheduleData([]);
    }
  }, [selectedTeacherIds]);

  const fetchSchedule = async (teacherIds) => {
    setScheduleLoading(true);
    try {
      const queryParams = new URLSearchParams();
      teacherIds.forEach(id => queryParams.append("teacher_id", id));
      queryParams.append("view", "teacher");

      const res = await axiosInstance.get(`/v1/class-routines?${queryParams.toString()}`);
      if (res.data.success) {
        setScheduleData(res.data.data);
      }
    } catch (err) {
      console.error("Error fetching schedule:", err);
      toast.error("Failed to load schedule");
    } finally {
      setScheduleLoading(false);
    }
  };

  // Close dropdown on click outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (isTeacherDropdownOpen && !event.target.closest(".teacher-selector-container")) {
        setIsTeacherDropdownOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, [isTeacherDropdownOpen]);

  const filteredTeachers = teachers.filter(t =>
    t.name?.toLowerCase().includes(teacherSearchQuery.toLowerCase()) ||
    t.employeeID?.toLowerCase().includes(teacherSearchQuery.toLowerCase()) ||
    (!t.employeeID && teacherSearchQuery === "")
  );

  const toggleTeacherSelection = (id) => {
    setSelectedTeacherIds(prev =>
      prev.includes(id) ? prev.filter(tId => tId !== id) : [...prev, id]
    );
  };

  const removeTeacher = (id, e) => {
    e.stopPropagation();
    setSelectedTeacherIds(prev => prev.filter(tId => tId !== id));
  };

  const activeDaySchedule = useMemo(() => {
    const dayData = scheduleData.filter(item => item.day === activeDay);
    return dayData.sort((a, b) => a.startTime?.localeCompare(b.startTime));
  }, [scheduleData, activeDay]);

  if (loading) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center bg-slate-50/50">
        <div className="w-12 h-12 border-4 border-[#00315e]/20 border-t-[#00315e] rounded-full animate-spin mb-4"></div>
        <p className="text-slate-500 font-medium tracking-wide">Loading teacher database...</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen">
      {/* Header */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-8">
        <div>
          <h1 className="text-2xl font-black text-[#2d3748] flex items-center gap-2">
            <Calendar className="w-6 h-6 text-[#00315e]" />
            Teacher Routine
          </h1>
          <div className="flex items-center gap-2 text-sm font-bold text-slate-400 mt-1">
            <span>Dashboard</span>
            <span>/</span>
            <span>Academic</span>
            <span>/</span>
            <span className="text-slate-500">Teacher Routine</span>
          </div>
        </div>

        <div className="flex items-center gap-2">
          <div className="relative teacher-selector-container">
            <button
              onClick={() => setIsTeacherDropdownOpen(!isTeacherDropdownOpen)}
              className="px-4 py-2 bg-[#00315e] text-white border border-slate-200 rounded-[8px]  transition-all flex items-center gap-2 font-bold text-sm cursor-pointer"
            >
              <Filter className="w-5 h-5" />
              Filter Teachers
            </button>
            {isTeacherDropdownOpen && (
              <div className="absolute top-[50px] right-0 z-[100] whitespace-nowrap flex flex-col gap-4 bg-white border border-gray-200 p-5 rounded-[8px] shadow-lg lg:w-[320px] w-full text-left">
                <div className="flex flex-col gap-4">
                  <div className="w-full relative">
                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                    <input
                      type="text"
                      placeholder="Search by name or ID..."
                      className="w-full pl-9 pr-4 py-2 bg-[#00315e24] border border-slate-200 text-slate-900 rounded-[8px] outline-none focus:ring-1 focus:ring-[#00315e] transition-all text-sm"
                      value={teacherSearchQuery}
                      onChange={(e) => setTeacherSearchQuery(e.target.value)}
                      onClick={(e) => e.stopPropagation()}
                    />
                  </div>

                  <div className="max-h-[250px] overflow-y-auto custom-scrollbar flex flex-col gap-1 pr-1">
                    {filteredTeachers.length === 0 ? (
                      <p className="text-center text-slate-400 text-sm py-4">No teachers found</p>
                    ) : (
                      filteredTeachers.map(t => {
                        const isSelected = selectedTeacherIds.includes(t._id);
                        return (
                          <div
                            key={t._id}
                            className={`flex items-center justify-between p-2.5 rounded-lg cursor-pointer transition-all ${isSelected ? "bg-[#00315e]/10" : "hover:bg-slate-50"}`}
                            onClick={(e) => {
                              e.stopPropagation();
                              toggleTeacherSelection(t._id);
                            }}
                          >
                            <div className="flex items-center gap-3">
                              <div className={`w-7 h-7 rounded-md overflow-hidden flex items-center justify-center font-bold text-xs shrink-0 ${isSelected ? 'bg-[#00315e] text-white' : 'bg-slate-200 text-slate-500'}`}>
                                {t.photo ? (
                                  <img src={t.photo} alt={t.name} className="w-full h-full object-cover" />
                                ) : (
                                  t.name.charAt(0)
                                )}
                              </div>
                              <div>
                                <p className={`text-sm font-bold ${isSelected ? 'text-[#00315e]' : 'text-slate-700'}`}>{t.name}</p>
                              </div>
                            </div>
                            {isSelected && <Check className="w-4 h-4 text-[#00315e]" />}
                          </div>
                        );
                      })
                    )}
                  </div>
                </div>

                <div className="flex justify-end gap-3 mt-2 pt-3 border-t border-slate-100">
                  <button
                    className="text-xs font-bold text-slate-500 hover:text-slate-700 px-3 py-1.5 cursor-pointer"
                    onClick={(e) => {
                      e.stopPropagation();
                      setSelectedTeacherIds([]);
                    }}
                  >
                    Clear All
                  </button>
                  <button
                    className="text-xs font-bold bg-[#00315e] cursor-pointer text-white rounded-[6px] px-4 py-1.5 hover:bg-blue-900"
                    onClick={(e) => {
                      e.stopPropagation();
                      setIsTeacherDropdownOpen(false);
                    }}
                  >
                    Apply
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Main Content Area */}
      <div className="bg-white rounded-[8px] border border-slate-100 shadow-sm overflow-hidden min-h-[500px]">
        <div className="px-5 py-4 border-b border-slate-200 flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
          <h2 className="text-lg font-black text-[#2d3748]">Time Table Overview</h2>

          {/* Selected Teachers Chips */}
          <div className="flex flex-wrap gap-2 items-center justify-end">
            {selectedTeacherIds.slice(0, 4).map(id => {
              const teacher = teachers.find(t => t._id === id);
              if (!teacher) return null;
              return (
                <div key={id} className="flex items-center gap-1.5 bg-[#00315e]/5 border border-[#00315e]/20 text-[#00315e] pl-1.5 pr-1 py-1 rounded-[6px] shadow-sm">
                  <div className="w-5 h-5 rounded overflow-hidden bg-white/50 border border-[#00315e]/10 flex items-center justify-center shrink-0">
                    {teacher.photo ? (
                      <img src={teacher.photo} alt={teacher.name} className="w-full h-full object-cover" />
                    ) : (
                      <span className="text-[9px] font-bold uppercase">{teacher.name.charAt(0)}</span>
                    )}
                  </div>
                  <span className="text-xs font-bold max-w-[100px] truncate">{teacher.name.split(' ')[0]}</span>
                  <button
                    onClick={(e) => removeTeacher(id, e)}
                    className="w-4 h-4 rounded-sm hover:bg-[#00315e]/10 flex items-center justify-center text-[#00315e] transition-colors"
                  >
                    <X className="w-3 h-3" />
                  </button>
                </div>
              )
            })}
            {selectedTeacherIds.length > 4 && (
              <div className="flex items-center justify-center px-2 py-1 bg-slate-100 text-slate-600 rounded-[6px] text-[10px] font-bold border border-slate-200">
                +{selectedTeacherIds.length - 4} more
              </div>
            )}
          </div>
        </div>

        <div className="px-6 pb-6 mt-4">
          {scheduleLoading ? (
            <div className="flex flex-col items-center justify-center py-20">
              <div className="w-12 h-12 border-4 border-[#00315e] border-t-transparent rounded-full animate-spin mb-4"></div>
              <p className="text-slate-500 font-bold">Loading schedule...</p>
            </div>
          ) : selectedTeacherIds.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-20 bg-slate-50 rounded-xl border-2 border-dashed border-slate-200">
              <div className="w-16 h-16 bg-white rounded-full flex items-center justify-center shadow-sm mb-4">
                <User className="w-8 h-8 text-slate-400" />
              </div>
              <h3 className="text-lg font-bold text-slate-700 mb-1">কোন শিক্ষক নির্বাচন করা হয়নি</h3>
              <p className="text-slate-500 text-sm text-center max-w-md">
                শিক্ষকদের রুটিন দেখতে উপরের ফিল্টার থেকে শিক্ষক নির্বাচন করুন।
              </p>
            </div>
          ) : (
            <div className="flex gap-4 w-full overflow-x-auto pb-4">
              {days.map((day, dayIndex) => {
                const daySchedule = scheduleData.filter((item) => item.day === day).sort((a, b) => a.startTime?.localeCompare(b.startTime));

                // Using ClassSchedule card colors
                const cardColors = [
                  "bg-[#fff0f3] border-[#ffe0e6] text-[#ff4d6d]",
                  "bg-[#e6f7ff] border-[#bae7ff] text-[#096dd9]",
                  "bg-[#f6ffed] border-[#d9f7be] text-[#389e0d]",
                  "bg-[#fffbe6] border-[#fff1b8] text-[#d48806]",
                  "bg-[#f0f5ff] border-[#d6e4ff] text-[#1d39c4]",
                  "bg-[#e6fffb] border-[#e6fffb] text-[#08979c]",
                ];
                const getDayColor = (index) => cardColors[index % cardColors.length];

                return (
                  <div key={day} className="flex flex-col gap-4">
                    <div className="bg-[#00315e]/5 px-4 py-2.5 rounded-[8px] mb-3 border border-[#00315e]/10 flex flex-col items-center justify-center gap-1.5 shadow-sm">
                      <h3 className="font-black text-[#00315e] text-[15px] leading-none">
                        {day}
                      </h3>
                      <span className="text-[10px] font-bold uppercase tracking-wider bg-white text-[#00315e] px-2.5 py-0.5 rounded-full shadow-sm border border-[#00315e]/10">
                        {daySchedule.length} {daySchedule.length === 1 ? 'Class' : 'Classes'}
                      </span>
                    </div>
                    <div className="space-y-4">
                      {daySchedule.length > 0 ? (
                        daySchedule.map((period, slotIndex) => (
                          <div
                            key={period._id + slotIndex}
                            className={`p-4 rounded-xl border border-transparent shadow-sm flex flex-col gap-3 group relative transition-all hover:shadow-md min-w-[170px] ${getDayColor(slotIndex)}`}
                          >
                            <div className="flex items-center gap-2 text-[11px] font-bold opacity-80">
                              <Clock className="w-3.5 h-3.5" />
                              {period.startTime} - {period.endTime}
                            </div>
                            <div className="font-bold text-[13px]">
                              <span className="opacity-70">Subject : </span>
                              {period.subjectId?.name || "N/A"}
                            </div>
                            <div className="font-bold text-[13px]">
                              <span className="opacity-70">Class : </span>
                              {period.classId?.name} {period.sectionId?.name ? `(${period.sectionId.name})` : ''}
                            </div>

                            {selectedTeacherIds.length > 1 && (
                              <div className="flex items-center gap-2 mt-2 bg-white/60 p-1.5 rounded-lg w-fit pr-4 border border-white/40">
                                <div className="w-6 h-6 rounded-md overflow-hidden bg-slate-200 border border-white/60 flex items-center justify-center">
                                  {period.teacherId?.photo ? (
                                    <img src={period.teacherId.photo} className="w-full h-full object-cover" />
                                  ) : (
                                    <span className="text-[10px] font-bold text-slate-500 uppercase">{period.teacherId?.name?.charAt(0)}</span>
                                  )}
                                </div>
                                <span className="text-[11px] font-bold text-slate-700 truncate max-w-[80px]">
                                  {period.teacherId?.name}
                                </span>
                              </div>
                            )}

                            <div className="absolute -top-1 -right-1 opacity-0 group-hover:opacity-100 transition-opacity flex gap-1">
                              <div className="p-1.5 bg-white shadow-md rounded-lg text-slate-500 flex items-center justify-center">
                                <MapPin className="w-3 h-3" /> <span className="text-[10px] ml-1 font-bold">Rm {period.roomNo}</span>
                              </div>
                            </div>
                          </div>
                        ))
                      ) : (
                        <div className="h-32 w-full min-w-[170px] rounded-[8px] border-2 border-dashed border-slate-100 flex items-center justify-center">
                          <span className="text-[10px] font-bold text-slate-300 uppercase tracking-widest italic">No Classes</span>
                        </div>
                      )}
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>
      </div>

      <style dangerouslySetInnerHTML={{
        __html: `
        .custom-scrollbar::-webkit-scrollbar {
          width: 6px;
          height: 6px;
        }
        .custom-scrollbar::-webkit-scrollbar-track {
          background: transparent;
        }
        .custom-scrollbar::-webkit-scrollbar-thumb {
          background: #cbd5e1;
          border-radius: 10px;
        }
        .custom-scrollbar::-webkit-scrollbar-thumb:hover {
          background: #94a3b8;
        }
      `}} />
    </div>
  );
};

export default TeacherSchedule;

