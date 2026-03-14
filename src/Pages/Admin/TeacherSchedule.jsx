import { useState, useEffect } from "react";
import {
  Calendar,
  Clock,
  User,
  Search,
  School,
  BookOpen,
  MapPin,
  ChevronRight,
  Filter,
  Plus,
  X,
  CheckCircle2
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

  // Assignment Modal States
  const [isAssignModalOpen, setIsAssignModalOpen] = useState(false);
  const [classes, setClasses] = useState([]);
  const [sections, setSections] = useState([]);
  const [subjects, setSubjects] = useState([]);
  const [assignFormData, setAssignFormData] = useState({
    classId: "",
    sectionId: "",
    subjectId: "",
    teacherId: "",
    day: "Saturday",
    startTime: "",
    endTime: ""
  });
  const [isSaving, setIsSaving] = useState(false);

  const days = [
    "Saturday",
    "Sunday",
    "Monday",
    "Tuesday",
    "Wednesday",
    "Thursday",
  ];

  // Fetch Initial Data (Teachers, Classes, Sections, Subjects)
  useEffect(() => {
    const fetchInitialData = async () => {
      try {
        const [teachersRes, classesRes, sectionsRes, subjectsRes] = await Promise.all([
            axiosInstance.get("/v1/staff?role=teacher"),
            axiosInstance.get("/v1/classes"),
            axiosInstance.get("/v1/sections"),
            axiosInstance.get("/v1/subjects")
        ]);

        if (teachersRes.data.success) {
            setTeachers(teachersRes.data.data);
            if (teachersRes.data.data.length > 0) {
                setSelectedTeacherIds([teachersRes.data.data[0]._id]);
            }
        }
        if (classesRes?.data?.success) setClasses(classesRes.data.data);
        if (sectionsRes?.data?.success) setSections(sectionsRes.data.data);
        if (subjectsRes?.data?.success) setSubjects(subjectsRes.data.data);
      } catch (err) {
        console.error("Error fetching initial data:", err);
        toast.error("Failed to load necessary data");
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
    t.name.toLowerCase().includes(teacherSearchQuery.toLowerCase()) || 
    t.employeeID.toLowerCase().includes(teacherSearchQuery.toLowerCase())
  );

  const toggleTeacherSelection = (id) => {
    setSelectedTeacherIds(prev => 
        prev.includes(id) ? prev.filter(tId => tId !== id) : [...prev, id]
    );
  };

  const handleOpenAssignModal = () => {
      setAssignFormData(prev => ({
          ...prev,
          teacherId: selectedTeacherIds.length === 1 ? selectedTeacherIds[0] : "",
          classId: "",
          sectionId: "",
          subjectId: "",
          day: "Saturday",
          startTime: "",
          endTime: ""
      }));
      setIsAssignModalOpen(true);
  };

  const handleAssignTeacher = async () => {
      const { classId, sectionId, subjectId, teacherId, day, startTime, endTime } = assignFormData;
      
      if (!classId || !sectionId || !subjectId || !teacherId || !day || !startTime || !endTime) {
          toast.error("Please fill in all required fields");
          return;
      }

      setIsSaving(true);
      try {
          const payload = {
              class_id: classId,
              section_id: sectionId,
              day: day,
              periods: [{
                  startTime: startTime,
                  endTime: endTime,
                  subject_id: subjectId,
                  teacher_id: teacherId,
                  roomNumber: "TBD"
              }]
          };

          const res = await axiosInstance.post("/v1/class-routines", payload);
          if (res.data.success) {
              toast.success("Teacher successfully assigned to class!");
              setIsAssignModalOpen(false);
              // Refresh schedule if the assigned teacher is currently selected
              if (selectedTeacherIds.includes(teacherId)) {
                  fetchSchedule(selectedTeacherIds);
              }
          }
      } catch (error) {
          console.error("Error assigning teacher:", error);
          toast.error(error.response?.data?.message || "Failed to assign teacher");
      } finally {
          setIsSaving(false);
      }
  };

  if (loading) {
      return (
          <div className="min-h-screen flex items-center justify-center bg-slate-50/30">
              <div className="relative">
                  <div className="w-16 h-16 border-4 border-emerald-100 rounded-full"></div>
                  <div className="absolute top-0 left-0 w-16 h-16 border-4 border-emerald-500 border-t-transparent rounded-full animate-spin"></div>
              </div>
          </div>
      );
  }

  return (
    <div className="px-4 py-8 lg:px-8 max-w-[1600px] mx-auto animate-in fade-in slide-in-from-bottom-4 duration-700">
      {/* Header Section */}
      <div className="flex flex-col lg:flex-row justify-between items-start lg:items-end gap-6 mb-12">
        <div>
          <div className="flex items-center gap-3 text-emerald-500 mb-3 px-4 py-1.5 bg-emerald-50 rounded-full w-fit">
            <Calendar className="w-4 h-4" />
            <span className="text-[10px] font-black uppercase tracking-[0.2em]">Academic Calendar</span>
          </div>
          <h1 className="text-4xl font-black text-slate-800 tracking-tight mb-3">
             Teacher Schedule <span className="text-emerald-500">Overview</span>
          </h1>
          <div className="flex items-center gap-3 text-sm font-bold text-slate-400">
            <span>Dashboard</span>
            <ChevronRight className="w-4 h-4" />
            <span className="text-slate-600">Teacher Routine</span>
          </div>
        </div>

        <div className="flex flex-wrap gap-4 items-center">
            <button
                onClick={handleOpenAssignModal}
                className="px-6 py-3 bg-emerald-500 hover:bg-emerald-600 text-white rounded-[1.5rem] shadow-lg shadow-emerald-500/20 transition-all flex items-center gap-3 font-bold"
            >
                <Plus className="w-5 h-5" />
                Assign Class
            </button>
            <div className="px-6 py-3 bg-white border-2 border-slate-100 rounded-[1.5rem] shadow-sm flex items-center gap-4">
                <div className="w-10 h-10 rounded-2xl bg-emerald-50 flex items-center justify-center">
                    <BookOpen className="w-5 h-5 text-emerald-600" />
                </div>
                <div>
                    <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest leading-none mb-1">Total Classes</p>
                    <p className="text-lg font-black text-slate-800 leading-none">{scheduleData.length}</p>
                </div>
            </div>
        </div>
      </div>

      {/* Modern Filter Section */}
      <div className="relative mb-12 z-50">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-center">
          <div className="lg:col-span-8 teacher-selector-container relative">
            <div 
                className={`group flex items-center justify-between px-8 py-5 bg-white border-2 rounded-[2rem] transition-all duration-300 cursor-pointer ${isTeacherDropdownOpen ? 'border-emerald-500 shadow-xl shadow-emerald-500/5' : 'border-slate-100 shadow-sm hover:border-slate-200'}`}
                onClick={() => setIsTeacherDropdownOpen(!isTeacherDropdownOpen)}
            >
                <div className="flex items-center gap-6 overflow-hidden">
                    <div className="w-12 h-12 rounded-2xl bg-slate-50 flex items-center justify-center group-hover:bg-emerald-50 transition-colors">
                        <User className="w-6 h-6 text-slate-400 group-hover:text-emerald-500 transition-colors" />
                    </div>
                    <div className="flex-1 min-w-0">
                         <p className="text-[10px] font-black text-slate-400 uppercase tracking-[0.1em] mb-0.5">Filter by Teachers</p>
                         <p className="text-base font-black text-slate-700 truncate">
                            {selectedTeacherIds.length === 0 ? "Identify Teacher(s) to view routine..." : 
                             selectedTeacherIds.length === 1 ? teachers.find(t => t._id === selectedTeacherIds[0])?.name :
                             `${selectedTeacherIds.length} Teachers Selected`}
                        </p>
                    </div>
                </div>
                <div className="flex items-center gap-4 pl-4 ml-auto">
                    <div className="h-8 w-[2px] bg-slate-100 hidden sm:block" />
                    <Filter className={`w-5 h-5 transition-all ${isTeacherDropdownOpen ? 'text-emerald-500 rotate-180' : 'text-slate-300'}`} />
                </div>
            </div>

            {/* Premium Dropdown */}
            {isTeacherDropdownOpen && (
                <div className="absolute top-[calc(100%+12px)] left-0 right-0 bg-white border-2 border-slate-100 rounded-[2.5rem] shadow-2xl z-50 overflow-hidden animate-in fade-in slide-in-from-top-4 duration-300">
                    <div className="p-6 bg-slate-50/50 border-b-2 border-slate-100/50">
                        <div className="relative">
                            <Search className="absolute left-5 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-300" />
                            <input 
                                type="text"
                                placeholder="Search by name or employee ID..."
                                className="w-full pl-14 pr-6 py-4 bg-white border-2 border-slate-100 rounded-2xl text-sm font-bold outline-none focus:border-emerald-400 transition-all placeholder:text-slate-300"
                                value={teacherSearchQuery}
                                onChange={(e) => setTeacherSearchQuery(e.target.value)}
                                onClick={(e) => e.stopPropagation()}
                            />
                        </div>
                    </div>
                    <div className="max-h-[350px] overflow-y-auto custom-scrollbar p-3">
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
                            {filteredTeachers.map(t => (
                                <div 
                                    key={t._id}
                                    className={`group flex items-center gap-4 p-4 rounded-2xl cursor-pointer transition-all duration-200 ${selectedTeacherIds.includes(t._id) ? "bg-emerald-50 border-emerald-100" : "hover:bg-slate-50 border-transparent"} border-2`}
                                    onClick={(e) => {
                                        e.stopPropagation();
                                        toggleTeacherSelection(t._id);
                                    }}
                                >
                                    <div className={`w-6 h-6 rounded-lg border-2 flex items-center justify-center transition-all ${selectedTeacherIds.includes(t._id) ? "bg-emerald-500 border-emerald-500 scale-110" : "border-slate-200 bg-white scale-100"}`}>
                                        {selectedTeacherIds.includes(t._id) && (
                                            <div className="w-2 h-2 rounded-full bg-white shadow-sm" />
                                        )}
                                    </div>
                                    <div className="flex-1 min-w-0">
                                        <p className="text-sm font-black text-slate-800 truncate mb-0.5">{t.name}</p>
                                        <p className="text-[10px] font-bold text-slate-400 truncate uppercase tracking-wider">{t.employeeID} • {t.designationId?.name || "Teacher"}</p>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                    <div className="p-6 bg-slate-50/50 border-t-2 border-slate-100/50 flex justify-between items-center">
                        <div className="text-[10px] font-black text-slate-400 uppercase tracking-widest">
                            {selectedTeacherIds.length} Selected
                        </div>
                        <div className="flex gap-4">
                            <button 
                                className="text-[11px] font-black uppercase text-emerald-600 hover:text-emerald-700 transition-colors"
                                onClick={(e) => {
                                    e.stopPropagation();
                                    setSelectedTeacherIds(teachers.map(t => t._id));
                                }}
                            >
                                Select All
                            </button>
                            <div className="w-[1px] h-3 bg-slate-200" />
                            <button 
                                className="text-[11px] font-black uppercase text-rose-500 hover:text-rose-600 transition-colors"
                                onClick={(e) => {
                                    e.stopPropagation();
                                    setSelectedTeacherIds([]);
                                }}
                            >
                                Clear Selection
                            </button>
                        </div>
                    </div>
                </div>
            )}
          </div>

          <div className="lg:col-span-4 flex -space-x-4 overflow-hidden items-center justify-end">
             {selectedTeacherIds.slice(0, 5).map((id, idx) => {
                 const teacher = teachers.find(t => t._id === id);
                 return (
                     <div key={id} className="w-12 h-12 rounded-full border-4 border-slate-50 bg-white flex items-center justify-center shadow-lg relative z-[5]" style={{ zIndex: 10 - idx }}>
                         <div className="w-full h-full rounded-full bg-emerald-100 flex items-center justify-center text-emerald-700 font-black text-sm uppercase">
                            {teacher?.name?.charAt(0) || idx}
                         </div>
                     </div>
                 )
             })}
             {selectedTeacherIds.length > 5 && (
                 <div className="w-12 h-12 rounded-full border-4 border-slate-50 bg-slate-800 flex items-center justify-center shadow-lg relative z-[0] text-[10px] font-black text-white uppercase tracking-tighter">
                     +{selectedTeacherIds.length - 5}
                 </div>
             )}
          </div>
        </div>
      </div>

      {/* Schedule Content */}
      {scheduleLoading ? (
          <div className="flex flex-col items-center justify-center py-32 animate-in fade-in duration-500">
              <div className="w-16 h-16 border-4 border-emerald-100 border-t-emerald-500 rounded-full animate-spin mb-6"></div>
              <p className="text-sm font-black text-slate-400 uppercase tracking-widest">Syncing Routines...</p>
          </div>
      ) : (
      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-10">
        {days.map((day, dayIdx) => {
          const daySchedule = scheduleData.filter((item) => item.day === day);
          daySchedule.sort((a, b) => a.startTime?.localeCompare(b.startTime));

          return (
            <div
              key={day}
              className="group bg-white rounded-[3rem] border-2 border-slate-100 shadow-sm hover:shadow-2xl hover:shadow-slate-200/50 transition-all duration-500 flex flex-col h-full min-h-[400px] overflow-hidden animate-in fade-in slide-in-from-bottom-8"
              style={{ animationDelay: `${dayIdx * 100}ms` }}
            >
              {/* Day Header */}
              <div className="p-8 pb-4 flex items-center justify-between">
                <div>
                    <h3 className="text-xl font-black text-slate-800 leading-none mb-1">
                    {day}
                    </h3>
                    <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">{daySchedule.length} Assigned Periods</p>
                </div>
                <div className={`w-12 h-12 rounded-2xl flex items-center justify-center ${daySchedule.length > 0 ? 'bg-emerald-50 text-emerald-500' : 'bg-slate-50 text-slate-300'}`}>
                    <Calendar className="w-6 h-6" />
                </div>
              </div>

              {/* Periods List */}
              <div className="p-8 pt-4 space-y-6 flex-1">
                {daySchedule.length > 0 ? (
                  daySchedule.map((period, i) => (
                    <div
                      key={period._id + i}
                      className="relative pl-8 before:absolute before:left-0 before:top-2 before:bottom-0 before:w-[2px] before:bg-slate-100 group-last:before:bottom-auto group-last:before:h-8"
                    >
                      {/* Timeline Dot */}
                      <div className="absolute left-[-5px] top-2 w-[12px] h-[12px] rounded-full border-[3px] border-white bg-emerald-500 shadow-sm shadow-emerald-500/20 z-10" />

                      <div className={`p-6 rounded-[2rem] border-2 transition-all duration-300 hover:scale-[1.03] ${period.color || "bg-slate-50/50 border-slate-100"}`}>
                        <div className="flex justify-between items-start mb-4">
                          <div className="flex items-center gap-2 px-3 py-1 bg-white/60 backdrop-blur-sm rounded-full">
                            <Clock className="w-3.5 h-3.5 text-slate-400" />
                            <span className="text-[10px] font-black text-slate-600 uppercase tracking-tight">
                              {period.startTime} - {period.endTime}
                            </span>
                          </div>
                          <div className="flex items-center gap-1.5 px-3 py-1 bg-white/60 backdrop-blur-sm rounded-full text-slate-600">
                             <MapPin className="w-3 h-3 text-slate-400" />
                             <span className="text-[10px] font-black uppercase">Rm {period.roomNo}</span>
                          </div>
                        </div>

                        {selectedTeacherIds.length > 1 && (
                            <div className="mb-3 flex items-center gap-2 truncate">
                                <div className="w-5 h-5 rounded-full bg-emerald-100 flex items-center justify-center text-[8px] font-black text-emerald-700 uppercase">
                                    {period.teacherId?.name?.charAt(0)}
                                </div>
                                <span className="text-[10px] font-black uppercase text-emerald-600 tracking-wide truncate">{period.teacherId?.name}</span>
                            </div>
                        )}

                        <h4 className="text-base font-black text-slate-800 mb-2 leading-tight">
                          {period.subjectId?.name || "General Subject"}
                        </h4>
                        
                        <div className="flex flex-wrap gap-2 mt-4">
                             <div className="flex items-center gap-1.5 px-3 py-1 bg-slate-800 text-white rounded-lg">
                                 <School className="w-3 h-3 opacity-60" />
                                 <span className="text-[9px] font-black uppercase tracking-widest">{period.classId?.name}</span>
                             </div>
                             <div className="flex items-center gap-1.5 px-3 py-1 border-2 border-slate-100 bg-white rounded-lg">
                                 <span className="text-[9px] font-black text-slate-400 uppercase tracking-widest">{period.sectionId?.name}</span>
                             </div>
                        </div>
                      </div>
                    </div>
                  ))
                ) : (
                  <div className="h-full flex flex-col items-center justify-center text-center p-10 bg-slate-50/50 border-2 border-dashed border-slate-100 rounded-[2.5rem] min-h-[200px]">
                    <div className="w-16 h-16 rounded-3xl bg-white flex items-center justify-center shadow-sm mb-4">
                        <Calendar className="w-8 h-8 text-slate-200" />
                    </div>
                    <p className="text-xs font-black text-slate-300 uppercase tracking-[0.2em]">No Schedule Recorded</p>
                  </div>
                )}
              </div>
              
              <div className="h-4 w-full bg-slate-50/30" />
            </div>
          );
        })}
      </div>
      )}

      {/* Footer Info */}
      <div className="mt-16 p-8 bg-slate-900 rounded-[3rem] text-white flex flex-col md:flex-row items-center justify-between gap-8 relative overflow-hidden">
          <div className="absolute top-0 right-0 w-64 h-64 bg-emerald-500/10 rounded-full blur-3xl -mr-32 -mt-32" />
          <div className="absolute bottom-0 left-0 w-48 h-48 bg-blue-500/10 rounded-full blur-3xl -ml-24 -mb-24" />
          
          <div className="relative z-10 text-center md:text-left">
              <h4 className="text-xl font-bold mb-2">Academic Consistency</h4>
              <p className="text-slate-400 text-sm max-w-md">The routines displayed here are synchronized with the central Class Routine system. Updates made there are reflected here in real-time.</p>
          </div>
          
          <div className="relative z-10 flex gap-6">
              <div className="text-center">
                  <p className="text-[10px] font-black text-emerald-400 uppercase tracking-widest mb-1">Status</p>
                  <div className="flex items-center gap-2">
                      <div className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
                      <span className="text-sm font-bold">In-Sync</span>
                  </div>
              </div>
          </div>
      </div>

      {/* Assign Teacher Modal */}
      {isAssignModalOpen && (
        <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-sm z-[100] flex items-center justify-center p-4">
          <div className="bg-white rounded-[2.5rem] w-full max-w-2xl shadow-2xl animate-in zoom-in duration-300 overflow-hidden">
            <div className="p-8 border-b-2 border-slate-50 flex items-center justify-between">
              <div className="flex items-center gap-4">
                <div className="w-12 h-12 bg-emerald-500 text-white rounded-2xl flex items-center justify-center border-2 border-emerald-100">
                  <BookOpen className="w-6 h-6" />
                </div>
                <div>
                    <h2 className="text-2xl font-black text-slate-800">Assign Class</h2>
                    <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mt-1">Add routine to teacher's schedule</p>
                </div>
              </div>
              <button
                onClick={() => setIsAssignModalOpen(false)}
                className="p-3 hover:bg-slate-100 rounded-2xl transition-all"
              >
                <X className="w-6 h-6 text-slate-400" />
              </button>
            </div>

            <div className="p-8 space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-2">
                  <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Teacher <span className="text-rose-500">*</span></label>
                  <select
                    value={assignFormData.teacherId}
                    onChange={(e) => setAssignFormData({ ...assignFormData, teacherId: e.target.value })}
                    className="w-full bg-slate-50 border-2 border-slate-100 rounded-2xl px-6 py-4 text-sm font-bold focus:border-emerald-500 outline-none appearance-none"
                  >
                    <option value="">Select Teacher</option>
                    {teachers.map(t => (
                        <option key={t._id} value={t._id}>{t.name} ({t.employeeID})</option>
                    ))}
                  </select>
                </div>

                <div className="space-y-2">
                  <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Day <span className="text-rose-500">*</span></label>
                  <select
                    value={assignFormData.day}
                    onChange={(e) => setAssignFormData({ ...assignFormData, day: e.target.value })}
                    className="w-full bg-slate-50 border-2 border-slate-100 rounded-2xl px-6 py-4 text-sm font-bold focus:border-emerald-500 outline-none appearance-none"
                  >
                    {days.map(d => (
                        <option key={d} value={d}>{d}</option>
                    ))}
                  </select>
                </div>

                <div className="space-y-2">
                  <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Class <span className="text-rose-500">*</span></label>
                  <select
                    value={assignFormData.classId}
                    onChange={(e) => setAssignFormData({ ...assignFormData, classId: e.target.value, sectionId: "" })}
                    className="w-full bg-slate-50 border-2 border-slate-100 rounded-2xl px-6 py-4 text-sm font-bold focus:border-emerald-500 outline-none appearance-none"
                  >
                    <option value="">Select Class</option>
                    {classes.map(c => (
                        <option key={c._id} value={c._id}>{c.name}</option>
                    ))}
                  </select>
                </div>

                <div className="space-y-2">
                  <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Section <span className="text-rose-500">*</span></label>
                  <select
                    value={assignFormData.sectionId}
                    onChange={(e) => setAssignFormData({ ...assignFormData, sectionId: e.target.value })}
                    className="w-full bg-slate-50 border-2 border-slate-100 rounded-2xl px-6 py-4 text-sm font-bold focus:border-emerald-500 outline-none appearance-none"
                    disabled={!assignFormData.classId}
                  >
                    <option value="">Select Section</option>
                    {sections.filter(s => s.classId?._id === assignFormData.classId || s.classId === assignFormData.classId).map(s => (
                        <option key={s._id} value={s._id}>{s.name}</option>
                    ))}
                  </select>
                </div>

                <div className="space-y-2 md:col-span-2">
                  <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Subject <span className="text-rose-500">*</span></label>
                  <select
                    value={assignFormData.subjectId}
                    onChange={(e) => setAssignFormData({ ...assignFormData, subjectId: e.target.value })}
                    className="w-full bg-slate-50 border-2 border-slate-100 rounded-2xl px-6 py-4 text-sm font-bold focus:border-emerald-500 outline-none appearance-none"
                  >
                    <option value="">Select Subject</option>
                    {subjects.map(s => (
                        <option key={s._id} value={s._id}>{s.name}</option>
                    ))}
                  </select>
                </div>

                <div className="space-y-2">
                  <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Start Time <span className="text-rose-500">*</span></label>
                  <input
                    type="time"
                    value={assignFormData.startTime}
                    onChange={(e) => setAssignFormData({ ...assignFormData, startTime: e.target.value })}
                    className="w-full bg-slate-50 border-2 border-slate-100 rounded-2xl px-6 py-4 text-sm font-bold focus:border-emerald-500 outline-none"
                  />
                </div>

                <div className="space-y-2">
                  <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest">End Time <span className="text-rose-500">*</span></label>
                  <input
                    type="time"
                    value={assignFormData.endTime}
                    onChange={(e) => setAssignFormData({ ...assignFormData, endTime: e.target.value })}
                    className="w-full bg-slate-50 border-2 border-slate-100 rounded-2xl px-6 py-4 text-sm font-bold focus:border-emerald-500 outline-none"
                  />
                </div>
              </div>

              <div className="flex gap-4 pt-4 border-t-2 border-slate-50">
                <button
                  onClick={() => setIsAssignModalOpen(false)}
                  className="flex-1 py-4 text-slate-500 font-black rounded-2xl hover:bg-slate-50 transition-all cursor-pointer"
                  disabled={isSaving}
                >
                  Cancel
                </button>
                <button
                  onClick={handleAssignTeacher}
                  disabled={isSaving}
                  className="flex-1 py-4 bg-emerald-500 text-white font-black rounded-2xl shadow-lg shadow-emerald-500/30 hover:shadow-xl hover:shadow-emerald-500/40 hover:scale-[1.02] transition-all flex items-center justify-center gap-2 cursor-pointer disabled:opacity-70 disabled:hover:scale-100"
                >
                  {isSaving ? (
                      <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
                  ) : (
                      <><CheckCircle2 className="w-5 h-5" /> Assign to Schedule</>
                  )}
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      <style dangerouslySetInnerHTML={{ __html: `
        .custom-scrollbar::-webkit-scrollbar {
          width: 6px;
        }
        .custom-scrollbar::-webkit-scrollbar-track {
          background: transparent;
        }
        .custom-scrollbar::-webkit-scrollbar-thumb {
          background: #e2e8f0;
          border-radius: 10px;
        }
        .custom-scrollbar::-webkit-scrollbar-thumb:hover {
          background: #cbd5e1;
        }
      `}} />
    </div>
  );
};

export default TeacherSchedule;
