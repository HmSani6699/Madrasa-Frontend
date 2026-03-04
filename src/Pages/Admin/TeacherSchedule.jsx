import { useState, useEffect } from "react";
import {
  Calendar,
  Clock,
  User,
  Plus,
  Download,
  Briefcase,
  Search,
  School,
  Edit2,
  Trash2,
} from "lucide-react";
import Modal from "../../components/Modal";
import DeleteConfirmationModal from "../../components/DeleteConfirmationModal";
import axiosInstance from "../../api/axiosInstance";
import { toast } from "react-hot-toast";

const TeacherSchedule = () => {
  const [loading, setLoading] = useState(true);
  const [scheduleLoading, setScheduleLoading] = useState(false);

  // Data
  const [teachers, setTeachers] = useState([]);
  const [selectedTeacherId, setSelectedTeacherId] = useState("");
  const [scheduleData, setScheduleData] = useState([]);
  const [classes, setClasses] = useState([]);
  const [sections, setSections] = useState([]);
  const [subjects, setSubjects] = useState([]);

  // Modal States
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [currentSlot, setCurrentSlot] = useState(null);
  const [slotToDelete, setSlotToDelete] = useState(null);

  const days = [
    "Saturday",
    "Sunday",
    "Monday",
    "Tuesday",
    "Wednesday",
    "Thursday",
  ];

  const colors = [
    { name: "Blue", value: "bg-blue-50 border-blue-200 text-blue-700" },
    { name: "Indigo", value: "bg-indigo-50 border-indigo-200 text-indigo-700" },
    { name: "Purple", value: "bg-purple-50 border-purple-200 text-purple-700" },
    { name: "Pink", value: "bg-pink-50 border-pink-200 text-pink-700" },
    { name: "Orange", value: "bg-orange-50 border-orange-200 text-orange-700" },
    { name: "Teal", value: "bg-teal-50 border-teal-200 text-teal-700" },
  ];

  // Fetch Initial Data (Teachers, Classes, Sections, Subjects)
  useEffect(() => {
    const fetchInitialData = async () => {
      try {
        const [teachersRes, classesRes, sectionsRes, subjectsRes] = await Promise.all([
          axiosInstance.get("/v1/staff?role=teacher"),
          axiosInstance.get("/v1/classes"),
          axiosInstance.get("/v1/sections"),
          axiosInstance.get("/v1/subjects"),
        ]);

        if (teachersRes.data.success) {
            setTeachers(teachersRes.data.data);
            if (teachersRes.data.data.length > 0) {
                setSelectedTeacherId(teachersRes.data.data[0]._id);
            }
        }
        if (classesRes.data.success) setClasses(classesRes.data.data);
        if (sectionsRes.data.success) setSections(sectionsRes.data.data);
        if (subjectsRes.data.success) setSubjects(subjectsRes.data.data);

      } catch (err) {
        console.error("Error fetching initial data:", err);
        toast.error("Failed to load data");
      } finally {
        setLoading(false);
      }
    };

    fetchInitialData();
  }, []);

  // Fetch Schedule when teacher changes
  useEffect(() => {
    if (selectedTeacherId) {
        fetchSchedule(selectedTeacherId);
    }
  }, [selectedTeacherId]);

  const fetchSchedule = async (teacherId) => {
    setScheduleLoading(true);
    try {
        const res = await axiosInstance.get(`/v1/class-routines?teacher_id=${teacherId}`);
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

  // Handlers
  const handleAddSlot = (day = "Saturday") => {
    setCurrentSlot({
      id: null,
      teacherId: selectedTeacherId,
      day: day,
      startTime: "08:00",
      endTime: "09:00",
      subjectId: "",
      classId: "",
      sectionId: "",
      roomNo: "",
      color: colors[0].value,
    });
    setIsModalOpen(true);
  };

  const handleEditSlot = (slot) => {
    // Map backend data to form state
    setCurrentSlot({
      id: slot._id,
      teacherId: slot.teacherId._id || slot.teacherId,
      day: slot.day,
      startTime: slot.startTime,
      endTime: slot.endTime,
      subjectId: slot.subjectId?._id || slot.subjectId,
      classId: slot.classId?._id || slot.classId,
      sectionId: slot.sectionId?._id || slot.sectionId,
      roomNo: slot.roomNo,
      color: slot.color || colors[0].value,
    });
    setIsModalOpen(true);
  };

  const handleDeleteClick = (slot) => {
    setSlotToDelete(slot);
    setIsDeleteModalOpen(true);
  };

  const confirmDelete = async () => {
    try {
        await axiosInstance.delete(`/v1/class-routines/${slotToDelete._id}`);
        toast.success("Period removed successfully");
        fetchSchedule(selectedTeacherId);
        setIsDeleteModalOpen(false);
        setSlotToDelete(null);
    } catch (err) {
        console.error("Error deleting period:", err);
        toast.error("Failed to delete period");
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
        const payload = {
            ...currentSlot,
            teacherId: selectedTeacherId, // Ensure we assign to currently selected teacher
            timeRange: `${currentSlot.startTime} - ${currentSlot.endTime}`
        };

        if (currentSlot.id) {
            await axiosInstance.put(`/v1/class-routines/${currentSlot.id}`, payload);
            toast.success("Schedule updated successfully");
        } else {
            await axiosInstance.post("/v1/class-routines", payload);
            toast.success("Period assigned successfully");
        }
        fetchSchedule(selectedTeacherId);
        setIsModalOpen(false);
    } catch (err) {
        console.error("Error saving scheule:", err);
        toast.error("Failed to save schedule");
    }
  };

  const getFilteredSections = () => {
      if (!currentSlot?.classId) return [];
      return sections.filter(s => s.classId?._id === currentSlot.classId || s.classId === currentSlot.classId);
  };

  const selectedTeacherObj = teachers.find(t => t._id === selectedTeacherId);

  return (
    <div className="space-y-8 animate-in fade-in duration-500 p-4 md:p-8">
      {/* Header */}
      <div className="bg-white rounded-[2.5rem] border-2 border-slate-200 p-8 flex flex-col md:flex-row justify-between items-center gap-6 shadow-sm">
        <div className="flex items-center gap-6">
          <div className="w-16 h-16 bg-blue-50 rounded-2xl flex items-center justify-center border-2 border-blue-100 uppercase text-blue-600 font-black">
            <Briefcase className="w-8 h-8" />
          </div>
          <div>
            <h1 className="text-2xl md:text-3xl font-black text-slate-800">
              Teacher Schedule
            </h1>
          </div>
        </div>

        <div className="flex gap-3 w-full md:w-auto">
          <button className="flex-1 md:flex-none px-6 py-3 bg-white border-2 border-slate-200 text-slate-600 rounded-2xl font-black hover:bg-slate-50 transition-all flex items-center justify-center gap-2">
            <Download className="w-5 h-5" />
            PDF
          </button>
          <button
            onClick={() => handleAddSlot()}
            className="flex-1 md:flex-none px-6 py-3 bg-[#00bd7f] text-white rounded-2xl font-black shadow-xl shadow-emerald-200 hover:scale-[1.02] active:scale-95 transition-all flex items-center justify-center gap-2"
          >
            <Plus className="w-5 h-5" />
            Assign
          </button>
        </div>
      </div>

      {/* Teacher Selector */}
      <div className="bg-white p-6 rounded-[2rem] border-2 border-slate-200 shadow-sm">
        <div className="flex flex-col md:flex-row gap-6 items-center">
          <div className="relative flex-1 w-full">
            <Search className="absolute left-6 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-300" />
            <select
              value={selectedTeacherId}
              onChange={(e) => setSelectedTeacherId(e.target.value)}
              className="w-full pl-14 pr-4 py-4 bg-slate-50 border-2 border-slate-100 rounded-2xl text-sm font-bold text-slate-800 outline-none focus:border-blue-500 appearance-none"
            >
              {teachers.map((t) => (
                <option key={t._id} value={t._id}>{t.name} ({t.employeeID})</option>
              ))}
            </select>
          </div>
          <div className="flex items-center gap-4 px-6 py-4 bg-blue-50/50 rounded-2xl border-2 border-blue-100/50 w-full md:w-auto">
            <div className="w-10 h-10 rounded-full bg-white flex items-center justify-center shadow-sm">
              <User className="w-5 h-5 text-blue-600" />
            </div>
            <div>
              <p className="text-[10px] font-black text-blue-400 uppercase tracking-widest">
                Selected Teacher
              </p>
              <p className="text-sm font-black text-slate-800">
                {selectedTeacherObj ? selectedTeacherObj.name : "Loading..."}
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Schedule Column view for Teachers */}
      {scheduleLoading ? (
          <div className="flex justify-center py-20">
              <div className="w-12 h-12 border-4 border-[#00bd7f] border-t-transparent rounded-full animate-spin"></div>
          </div>
      ) : (
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
        {days.map((day) => {
          const daySchedule = scheduleData.filter(
            (item) => item.day === day,
          );
          // Sort by start time if possible
          daySchedule.sort((a, b) => a.startTime?.localeCompare(b.startTime));

          return (
            <div
              key={day}
              className="bg-white rounded-[2.5rem] border-2 border-slate-200 shadow-sm overflow-hidden flex flex-col h-full min-h-[300px]"
            >
              <div className="p-6 bg-slate-50 border-b-2 border-slate-100 flex items-center justify-between">
                <h3 className="font-black text-slate-800 uppercase tracking-widest text-xs">
                  {day}
                </h3>
                <span className="px-3 py-1 bg-white border border-slate-200 rounded-full text-[10px] font-black text-slate-400">
                  {daySchedule.length} Periods
                </span>
              </div>

              <div className="p-6 space-y-4 flex-1">
                {daySchedule.length > 0 ? (
                  daySchedule.map((period, i) => (
                    <div
                      key={period._id || i}
                      className={`p-5 rounded-3xl border-2 transition-all hover:scale-[1.02] group relative ${period.color || "bg-slate-50 border-slate-200 text-slate-600"}`}
                    >
                      <div className="flex justify-between items-start mb-3">
                        <div className="flex items-center gap-2">
                          <Clock className="w-3.5 h-3.5 opacity-60" />
                          <span className="text-[10px] font-black uppercase tracking-tighter">
                            {period.timeRange}
                          </span>
                        </div>
                        <div className="px-2 py-0.5 bg-white/40 rounded text-[9px] font-black">
                          ROOM {period.roomNo}
                        </div>
                      </div>
                      <h4 className="text-sm font-black mb-1">
                        {period.subjectId?.name || "Unknown Subject"}
                      </h4>
                      <p className="text-xs font-bold opacity-80 flex items-center gap-1.5">
                        <School className="w-3 h-3" /> {period.classId?.name} (
                        {period.sectionId?.name})
                      </p>

                      <div className="absolute top-3 right-3 opacity-0 group-hover:opacity-100 transition-opacity flex gap-1">
                        <button
                          onClick={() => handleEditSlot(period)}
                          className="p-1.5 bg-white/80 backdrop-blur-sm rounded-lg text-slate-600 shadow-sm hover:text-blue-600"
                        >
                          <Edit2 className="w-3 h-3" />
                        </button>
                        <button
                          onClick={() => handleDeleteClick(period)}
                          className="p-1.5 bg-white/80 backdrop-blur-sm rounded-lg text-slate-600 shadow-sm hover:text-red-500"
                        >
                          <Trash2 className="w-3 h-3" />
                        </button>
                      </div>
                    </div>
                  ))
                ) : (
                  <div className="h-full border-2 border-dashed border-slate-100 rounded-[2rem] flex flex-col items-center justify-center text-slate-300 min-h-[160px]">
                    <Calendar className="w-8 h-8 mb-2 opacity-20" />
                    <p className="text-xs font-black uppercase tracking-widest">
                      No Classes
                    </p>
                  </div>
                )}
              </div>

              <div className="p-6 bg-slate-50/50 border-t-2 border-slate-50 mt-auto">
                <button
                  onClick={() => handleAddSlot(day)}
                  className="w-full py-3 bg-white border-2 border-slate-100 rounded-2xl text-[10px] font-black text-slate-400 uppercase tracking-widest hover:text-blue-600 hover:border-blue-200 transition-all shadow-sm flex items-center justify-center gap-2"
                >
                  <Plus className="w-3 h-3" /> Add Period
                </button>
              </div>
            </div>
          );
        })}
      </div>
      )}

      {/* Add/Edit Modal */}
      <Modal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        title={currentSlot?.id ? "Edit Teacher Schedule" : "Assign New Period"}
      >
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
            <div className="col-span-2">
              <label className="block text-xs font-bold text-slate-500 mb-1.5 uppercase">
                Day
              </label>
              <select
                required
                value={currentSlot?.day}
                onChange={(e) =>
                  setCurrentSlot({ ...currentSlot, day: e.target.value })
                }
                className="w-full bg-slate-50 border-2 border-slate-100 rounded-xl px-4 py-2.5 text-sm font-bold focus:border-blue-500 outline-none"
              >
                {days.map((d) => (
                  <option key={d}>{d}</option>
                ))}
              </select>
            </div>
            <div>
              <label className="block text-xs font-bold text-slate-500 mb-1.5 uppercase">
                Start Time
              </label>
              <input
                type="time"
                required
                value={currentSlot?.startTime}
                onChange={(e) =>
                  setCurrentSlot({ ...currentSlot, startTime: e.target.value })
                }
                className="w-full bg-slate-50 border-2 border-slate-100 rounded-xl px-4 py-2.5 text-sm font-bold focus:border-blue-500 outline-none"
              />
            </div>
            <div>
              <label className="block text-xs font-bold text-slate-500 mb-1.5 uppercase">
                End Time
              </label>
              <input
                type="time"
                required
                value={currentSlot?.endTime}
                onChange={(e) =>
                  setCurrentSlot({ ...currentSlot, endTime: e.target.value })
                }
                className="w-full bg-slate-50 border-2 border-slate-100 rounded-xl px-4 py-2.5 text-sm font-bold focus:border-blue-500 outline-none"
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-bold text-slate-500 mb-1.5 uppercase">
              Subject
            </label>
            <select
              required
              value={currentSlot?.subjectId}
              onChange={(e) =>
                setCurrentSlot({ ...currentSlot, subjectId: e.target.value })
              }
              className="w-full bg-slate-50 border-2 border-slate-100 rounded-xl px-4 py-2.5 text-sm font-bold focus:border-blue-500 outline-none"
            >
                <option value="">Select Subject</option>
                {subjects.map(s => (
                    <option key={s._id} value={s._id}>{s.name} ({s.code})</option>
                ))}
            </select>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-bold text-slate-500 mb-1.5 uppercase">
                Class
              </label>
              <select
                required
                value={currentSlot?.classId}
                onChange={(e) =>
                  setCurrentSlot({ ...currentSlot, classId: e.target.value, sectionId: "" })
                }
                className="w-full bg-slate-50 border-2 border-slate-100 rounded-xl px-4 py-2.5 text-sm font-bold focus:border-blue-500 outline-none"
              >
                <option value="">Select Class</option>
                {classes.map((c) => (
                  <option key={c._id} value={c._id}>{c.name}</option>
                ))}
              </select>
            </div>
            <div>
              <label className="block text-xs font-bold text-slate-500 mb-1.5 uppercase">
                Section
              </label>
              <select
                required
                value={currentSlot?.sectionId}
                onChange={(e) =>
                  setCurrentSlot({ ...currentSlot, sectionId: e.target.value })
                }
                className="w-full bg-slate-50 border-2 border-slate-100 rounded-xl px-4 py-2.5 text-sm font-bold focus:border-blue-500 outline-none"
                disabled={!currentSlot?.classId}
              >
                <option value="">Select Section</option>
                {getFilteredSections().map((s) => (
                  <option key={s._id} value={s._id}>{s.name}</option>
                ))}
              </select>
            </div>
          </div>

          <div>
            <label className="block text-xs font-bold text-slate-500 mb-1.5 uppercase">
              Room Number
            </label>
            <input
              type="text"
              required
              value={currentSlot?.roomNo}
              onChange={(e) =>
                setCurrentSlot({ ...currentSlot, roomNo: e.target.value })
              }
              placeholder="e.g. 101"
              className="w-full bg-slate-50 border-2 border-slate-100 rounded-xl px-4 py-2.5 text-sm font-bold focus:border-blue-500 outline-none"
            />
          </div>

          <div>
            <label className="block text-xs font-bold text-slate-500 mb-1.5 uppercase">
              Color Tag
            </label>
            <div className="grid grid-cols-6 gap-2 mt-2">
              {colors.map((c) => (
                <button
                  key={c.name}
                  type="button"
                  onClick={() =>
                    setCurrentSlot({ ...currentSlot, color: c.value })
                  }
                  className={`w-full aspect-square rounded-xl border-2 flex items-center justify-center transition-all ${c.value} ${currentSlot?.color === c.value ? "ring-2 ring-blue-500 ring-offset-2 scale-110" : "hover:scale-105"}`}
                  title={c.name}
                >
                  {currentSlot?.color === c.value && (
                    <div className="w-2 h-2 rounded-full bg-current" />
                  )}
                </button>
              ))}
            </div>
          </div>

          <div className="flex gap-3 mt-6">
            <button
              type="button"
              onClick={() => setIsModalOpen(false)}
              className="flex-1 py-3 bg-slate-100 text-slate-600 rounded-xl font-bold hover:bg-slate-200 transition-colors"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="flex-1 py-3 bg-[#00bd7f] text-white rounded-xl font-bold shadow-lg shadow-emerald-200 hover:scale-[1.02] transition-transform"
            >
              {currentSlot?.id ? "Update Period" : "Assign Period"}
            </button>
          </div>
        </form>
      </Modal>

      {/* Delete Confirmation Modal */}
      <DeleteConfirmationModal
        isOpen={isDeleteModalOpen}
        onClose={() => setIsDeleteModalOpen(false)}
        onConfirm={confirmDelete}
        itemType="assigned period"
      />
    </div>
  );
};

export default TeacherSchedule;
