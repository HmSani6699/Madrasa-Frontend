import { useState, useEffect } from "react";
import {
  Calendar,
  Clock,
  MapPin,
  User,
  BookOpen,
  Plus,
  Filter,
  ChevronLeft,
  ChevronRight,
  Download,
  LayoutGrid,
  List,
  MoreHorizontal,
  Edit2,
  Trash2,
  Save,
  X,
  RotateCw,
  Printer,
  ChevronDown,
  FileDown,
  CirclePlus,
  Globe,
  Phone
} from "lucide-react";
import * as XLSX from "xlsx";
import jsPDF from "jspdf";
import autoTable from "jspdf-autotable";
import { toPng } from 'html-to-image';
import Modal from "../../components/Modal";
import DeleteConfirmationModal from "../../components/DeleteConfirmationModal";
import axiosInstance from "../../api/axiosInstance";
import { toast } from "react-hot-toast";
import InputField from "../../components/InputField";
import SelectInputField from "../../components/SelectInputField";
import logo from '../../../public/mlogo.jpg';

const ClassSchedule = () => {
  const [selectedClassId, setSelectedClassId] = useState("");
  const [selectedSectionId, setSelectedSectionId] = useState("");
  const [filterClassId, setFilterClassId] = useState("");
  const [filterSectionId, setFilterSectionId] = useState("");
  const [viewMode, setViewMode] = useState("grid"); // "grid" or "list"
  const [duration, setDuration] = useState("");

  const [classes, setClasses] = useState([]);
  const [sections, setSections] = useState([]);
  const [subjects, setSubjects] = useState([]);
  const [teachers, setTeachers] = useState([]);
  const [loading, setLoading] = useState(false);

  // Modal States
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [currentSlot, setCurrentSlot] = useState(null); // For Add/Edit
  const [slotToDelete, setSlotToDelete] = useState(null);
  const [isFilterModalOpen, setIsFilterModalOpen] = useState(false);
  const [isPreviewModalOpen, setIsPreviewModalOpen] = useState(false);

  const days = [
    "Saturday",
    "Sunday",
    "Monday",
    "Tuesday",
    "Wednesday",
    "Thursday",
    "Friday",

  ];

  const [activeTab, setActiveTab] = useState("Saturday");
  const initialRows = { subjectId: "", teacherId: "", timeFrom: "", timeTo: "" };
  const [modalRowsByDay, setModalRowsByDay] = useState({
    Saturday: [{ ...initialRows }],
    Sunday: [{ ...initialRows }],
    Monday: [{ ...initialRows }],
    Tuesday: [{ ...initialRows }],
    Wednesday: [{ ...initialRows }],
    Thursday: [{ ...initialRows }],
    Friday: [{ ...initialRows }],
  });


  console.log(activeTab);


  useEffect(() => {
    const fetchData = async () => {
      try {
        const [classesRes, subjectsRes, teachersRes, sectionsRes] = await Promise.all([
          axiosInstance.get("/v1/classes"),
          axiosInstance.get("/v1/subjects"),
          axiosInstance.get("/v1/staff?role=Teacher"),
          axiosInstance.get("/v1/sections")
        ]);
        if (classesRes.data.success) {
          setClasses(classesRes.data.data);
        }
        if (subjectsRes.data.success) setSubjects(subjectsRes.data.data);
        if (teachersRes.data.success) setTeachers(teachersRes.data.data);
        if (sectionsRes.data.success) setSections(sectionsRes.data.data);
      } catch (err) {
        console.error("Error fetching initial data:", err);
      }
    };
    fetchData();
  }, []);

  useEffect(() => {
    if (!selectedClassId || sections.length === 0) return;
    const currentClassSections = sections.filter(s => {
      const cls = classes.find(c => c._id === selectedClassId);
      return (s.class_id?._id || s.class_id) === selectedClassId || (cls && cls.section_id === s._id);
    });
    setSelectedSectionId("");
  }, [selectedClassId, sections, classes]);

  const fetchRoutines = async () => {
    if (!selectedClassId || !selectedSectionId) return;
    setLoading(true);
    try {
      const response = await axiosInstance.get(`/v1/class-routines?class_id=${selectedClassId}&section_id=${selectedSectionId}`);
      if (response.data.success) {
        setScheduleData(response.data.data);
      }
    } catch (err) {
      console.error("Error fetching routines:", err);
      toast.error("Failed to fetch schedule");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchRoutines();

    // Fetch subjects assigned to this section specifically
    if (selectedSectionId) {
      const fetchSectionDetails = async () => {
        try {
          const response = await axiosInstance.get(`/v1/sections?sectionId=${selectedSectionId}`); // This returns array, filter by ID
          if (response.data.success) {
            // The API returns all sections matching query. 
            // But wait, my getSections API filters by classId, not sectionId directly in the query params I implemented earlier? 
            // Let's check `getSections` controller.
            // It supports `classId` and `teacherId` (no, teacherId was for routines).
            // `getSections` in `academicController.js`: `if (req.query.classId) query.classId = req.query.classId;`
            // It does NOT explicitly support `_id` or `sectionId` in query.

            // However, I can find the section from the `sections` state which I already fetched!
            // I need to make sure `sections` state in `ClassSchedule` includes populated subjects.
            // The `getSections` API WAS updated to populate `subjects`.
            // So `sections` state SHOULD have subjects.
          }
        } catch (err) {
          console.error(err);
        }
      };
      // fetchSectionDetails(); 
    }
  }, [selectedClassId, selectedSectionId]);


  const cardColors = [
    "bg-[#fff0f3] border-[#ffe0e6] text-[#ff4d6d]", // Pink/Maths
    "bg-[#e6f7ff] border-[#bae7ff] text-[#096dd9]", // Blue/Spanish
    "bg-[#f6ffed] border-[#d9f7be] text-[#389e0d]", // Green/Computer
    "bg-[#fffbe6] border-[#fff1b8] text-[#d48806]", // Yellow/Physics
    "bg-[#f0f5ff] border-[#d6e4ff] text-[#1d39c4]", // Indigo/English
    "bg-[#e6fffb] border-[#e6fffb] text-[#08979c]", // Cyan/Science
  ];

  const getDayColor = (index) => cardColors[index % cardColors.length];

  // Initial Data
  const [scheduleData, setScheduleData] = useState([]);

  // Derived Data
  const currentSection = sections.find(s => s._id === selectedSectionId);
  const availableSubjects = currentSection?.subjects && currentSection.subjects.length > 0
    ? currentSection.subjects
    : subjects;

  // Handlers
  const handleAddSlot = () => {
    setCurrentSlot(null);
    setActiveTab("Saturday");
    setModalRowsByDay({
      Saturday: [{ ...initialRows }],
      Sunday: [{ ...initialRows }],
      Monday: [{ ...initialRows }],
      Tuesday: [{ ...initialRows }],
      Wednesday: [{ ...initialRows }],
      Thursday: [{ ...initialRows }],
      Friday: [{ ...initialRows }],
    });
    setIsModalOpen(true);
  };

  const handleEditSlot = (dayRoutine) => {
    setCurrentSlot(dayRoutine);
    setActiveTab(dayRoutine.day);
    setModalRowsByDay({
      Saturday: [{ ...initialRows }],
      Sunday: [{ ...initialRows }],
      Monday: [{ ...initialRows }],
      Tuesday: [{ ...initialRows }],
      Wednesday: [{ ...initialRows }],
      Thursday: [{ ...initialRows }],
      Friday: [{ ...initialRows }],
      [dayRoutine.day]: dayRoutine.periods.map(p => ({
        subjectId: p.subject_id,
        teacherId: p.teacher_id,
        timeFrom: p.startTime,
        timeTo: p.endTime
      }))
    });
    setIsModalOpen(true);
  };

  const handleDeleteClick = (slot) => {
    setSlotToDelete(slot);
    setIsDeleteModalOpen(true);
  };

  const confirmDelete = async () => {
    setLoading(true);
    try {
      const payload = {
        routine_id: slotToDelete.raw._id,
        class_id: slotToDelete.raw.class_id,
        section_id: slotToDelete.raw.section_id,
        day: slotToDelete.raw.day,
        startTime: slotToDelete.period.startTime
      };
      const response = await axiosInstance.delete(`/v1/class-routines/period`, { data: payload });
      if (response.data.success) {
        toast.success("Schedule slot deleted");
        fetchRoutines();
      }
      setIsDeleteModalOpen(false);
      setSlotToDelete(null);
    } catch (err) {
      console.error("Delete error:", err);
      toast.error("Failed to delete slot");
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!selectedClassId || !selectedSectionId) {
      toast.error("Please select class and section");
      return;
    }

    setLoading(true);
    try {
      const promises = [];
      let totalPeriods = 0;

      days.forEach(day => {
        const periods = modalRowsByDay[day].map(row => ({
          startTime: row.timeFrom || "09:00",
          endTime: row.timeTo || "10:00",
          subject_id: row.subjectId,
          teacher_id: row.teacherId,
          roomNumber: "101" // Default
        })).filter(r => r.subject_id && r.teacher_id);

        if (periods.length > 0) {
          totalPeriods += periods.length;
          const payload = {
            routine_id: currentSlot?.day === day ? currentSlot._id : null,
            class_id: selectedClassId,
            section_id: selectedSectionId,
            day: day,
            overwrite: !!(currentSlot?._id && currentSlot?.day === day),
            periods: periods
          };
          promises.push(axiosInstance.post("/v1/class-routines", payload));
        }
      });

      if (totalPeriods === 0) {
        toast.error("Please add at least one subject/teacher row");
        setLoading(false);
        return;
      }

      await Promise.all(promises);
      toast.success("Time Table updated!");
      fetchRoutines();
      setIsModalOpen(false);
    } catch (err) {
      console.error("Submit error:", err);
      toast.error("Failed to save schedule");
    } finally {
      setLoading(false);
    }
  };

  // Filter Data
  const getSlotsByDay = (day) => {
    const dayRoutine = scheduleData.find((item) => item.day === day);
    if (!dayRoutine) return [];

    // Convert periods array to the format needed by the grid cards
    return dayRoutine.periods.map((p, idx) => ({
      _id: `${dayRoutine._id}-${idx}`,
      day: day,
      timeRange: `${p.startTime} - ${p.endTime}`,
      subject: p.subject?.name || "Subject",
      teacher: p.teacher?.name || "Teacher",
      teacherImage: p.teacher?.image,
      // We keep the original object reference for editing
      raw: dayRoutine,
      period: p
    }));
  };

  const handleExport = async () => {
    if (scheduleData.length === 0) {
      toast.error("No schedule data to export");
      return;
    }

    setLoading(true);
    try {
      const printContent = document.getElementById('printable-routine');
      if (!printContent) return;

      const a4WidthPx = 794;
      const a4HeightPx = 1123;

      const dataUrl = await toPng(printContent, {
        pixelRatio: 2,
        width: a4WidthPx,
        height: a4HeightPx,
        style: {
          transform: 'none',
        }
      });

      const doc = new jsPDF({
        orientation: 'portrait',
        unit: 'px',
        format: [a4WidthPx, a4HeightPx]
      });

      doc.addImage(dataUrl, 'PNG', 0, 0, a4WidthPx, a4HeightPx);

      const className = classes.find(c => c._id === selectedClassId)?.name || "Class";
      const sectionName = sections.find(s => s._id === selectedSectionId)?.name || "Section";

      doc.save(`${className}_${sectionName}_Routine.pdf`);
      toast.success("Routine downloaded successfully!");
    } catch (err) {
      console.error("Export error:", err);
      toast.error("Failed to export schedule");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className=" bg-[#f8fafc] min-h-screen">
      {/* Header */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-8">
        <div>
          <h1 className="text-2xl font-black text-[#2d3748]">Class Routine</h1>
          <div className="flex items-center gap-2 text-sm font-bold text-slate-400 mt-1">
            <span>Dashboard</span>
            <span>/</span>
            <span>Academic</span>
            <span>/</span>
            <span className="text-slate-500">Time Table</span>
          </div>
        </div>

        <div className="flex items-center gap-2">

          <div className="relative">
            <button
              onClick={() => {
                setFilterClassId(selectedClassId);
                setFilterSectionId(selectedSectionId);
                setIsFilterModalOpen(!isFilterModalOpen);
              }}
              className="px-4 py-2 bg-white border border-slate-200 rounded-[8px] text-slate-600 hover:bg-slate-50 transition-all flex items-center gap-2 font-bold text-sm cursor-pointer"
            >
              <Filter className="w-5 h-5" />
              Filter
            </button>
            {isFilterModalOpen && (
              <div className="absolute top-[50px] right-0 z-[100] whitespace-nowrap flex flex-col gap-4 bg-white border border-gray-200 p-5 rounded-[8px] shadow-lg lg:w-[300px] w-full text-left">
                <div className="flex flex-col gap-4">
                  <SelectInputField
                    title={'Class'}
                    options={classes.map(c => ({ value: c._id, label: c.name }))}
                    value={filterClassId}
                    setValue={setFilterClassId}
                    bgColor={'bg-[#00315e24]'}
                  />
                  <SelectInputField
                    title={'Section'}
                    options={sections.filter(s => {
                      const cls = classes.find(c => c._id === filterClassId);
                      return (s.class_id?._id || s.class_id) === filterClassId || (cls && cls.section_id === s._id);
                    }).map(s => ({ value: s._id, label: s.name }))}
                    value={filterSectionId}
                    setValue={setFilterSectionId}
                    bgColor={'bg-[#00315e24]'}
                  />
                </div>
                <div className="flex items-end justify-end gap-3 mt-2">
                  <button
                    onClick={() => setIsFilterModalOpen(false)}
                    className="px-4 py-2 bg-slate-100 text-slate-600 rounded-[8px] cursor-pointer font-bold text-sm"
                  >
                    Cancel
                  </button>
                  <button
                    onClick={() => {
                      setSelectedClassId(filterClassId);
                      setSelectedSectionId(filterSectionId);
                      setIsFilterModalOpen(false);
                    }}
                    className="px-4 py-2 bg-[#00315e] text-white rounded-[8px] cursor-pointer font-bold text-sm"
                  >
                    Apply
                  </button>
                </div>
              </div>
            )}
          </div>
          <button
            onClick={handleAddSlot}
            className="px-6 py-2 bg-[#00315e] text-white rounded-[8px] flex items-center gap-2 hover:bg-[#002240] transition-all font-bold text-sm cursor-pointer"
          >
            <Plus className="w-5 h-5" />
            Add Time Table
          </button>
        </div>
      </div>

      {/* Main Content Area */}
      <div className="bg-white rounded-[8px] border border-slate-100 shadow-sm overflow-hidden">
        <div className="px-5 pb-2 border-b border-slate-300 flex items-center justify-between ">
          <h2 className="text-lg font-black text-[#2d3748]">Time Table</h2>
          <button
            onClick={() => setIsPreviewModalOpen(true)}
            className="px-4 py-2 bg-white border border-slate-200 rounded-[8px] text-slate-600 hover:bg-slate-50 transition-all flex items-center gap-2 text-sm font-bold cursor-pointer"
          >
            <FileDown className="w-4 h-4" />
            Preview & Export
          </button>
        </div>

        <div className="px-6 pb-6 mt-4">
          {loading ? (
            <div className="flex flex-col items-center justify-center py-20">
              <div className="w-12 h-12 border-4 border-blue-500 border-t-transparent rounded-full animate-spin mb-4"></div>
              <p className="text-slate-500 font-bold">Loading timetable...</p>
            </div>
          ) : (
            <div className="flex gap-4 w-full  overflow-x-auto">
              {days.map((day, dayIndex) => (
                <div key={day} className="flex flex-col gap-4">
                  <h3 className="font-black text-[#00315e] bg-[#00315e24] px-4 py-2 rounded-[8px] text-[15px] mb-2 text-center border border-[#00315e]/10">{day}</h3>
                  <div className="space-y-4">
                    {getSlotsByDay(day).length > 0 ? (
                      getSlotsByDay(day).map((slot, slotIndex) => (
                        <div
                          key={slot._id}
                          className={`p-4 rounded-xl border border-transparent shadow-sm flex flex-col gap-3 group relative transition-all hover:shadow-md ${getDayColor(slotIndex)} min-w-[170px]`}
                        >
                          <div className="flex items-center gap-2 text-[11px] font-bold opacity-80">
                            <Clock className="w-3.5 h-3.5" />
                            {slot.timeRange}
                          </div>
                          <div className="font-bold text-[13px]">
                            <span className="opacity-70">Subject : </span>
                            {slot.subjectId?.name || slot.subject}
                          </div>
                          <div className="flex items-center gap-2 mt-2 bg-white/60 p-1.5 rounded-lg w-fit pr-4 border border-white/40">
                            <div className="w-6 h-6 rounded-md overflow-hidden bg-slate-200 border border-white/60">
                              {slot.teacherId?.image ? (
                                <img src={slot.teacherId.image} className="w-full h-full object-cover" />
                              ) : (
                                <User className="w-full h-full p-1 text-slate-400" />
                              )}
                            </div>
                            <span className="text-[11px] font-bold text-slate-700 truncate max-w-[80px]">
                              {slot.teacherId?.name || slot.teacher}
                            </span>
                          </div>

                          {/* Hover Actions */}
                          <div className="absolute -top-1 -right-1 opacity-0 group-hover:opacity-100 transition-opacity flex gap-1">
                            <button onClick={() => handleEditSlot(slot.raw)} className="p-1.5 bg-white shadow-md rounded-lg text-blue-500 hover:scale-110 active:scale-95 transition-all">
                              <Edit2 className="w-3 h-3" />
                            </button>
                            <button onClick={() => handleDeleteClick(slot)} className="p-1.5 bg-white shadow-md rounded-lg text-red-500 hover:scale-110 active:scale-95 transition-all">
                              <Trash2 className="w-3 h-3" />
                            </button>
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
              ))}
            </div>
          )}
        </div>
      </div>

      <Modal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        title={currentSlot?._id ? "Edit Time Table" : "Add Routine"}
        width="w-full lg:max-w-[1000px]"
      >
        <div className="">
          {/* Top Selection Area */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <SelectInputField
              title={'Class'}
              value={selectedClassId}
              setValue={setSelectedClassId}
              options={classes.map(c => ({ value: c._id, label: c.name }))}
              bgColor={'bg-[#00315e24]'}
            />
            <SelectInputField
              title={'Section'}
              value={selectedSectionId}
              setValue={setSelectedSectionId}
              options={sections.filter(s => {
                const cls = classes.find(c => c._id === selectedClassId);
                return (s.class_id?._id || s.class_id) === selectedClassId || (cls && cls.section_id === s._id);
              }).map(s => ({ value: s._id, label: s.name }))}
              bgColor={'bg-[#00315e24]'}
            />
            <SelectInputField
              title={'Duration(min)'}
              value={duration}
              setValue={setDuration}
              options={[
                { value: "40 min", label: "40 min" },
                { value: "1 hr", label: "1 hr" }
              ]}
              bgColor={'bg-[#00315e24]'}
            />
          </div>


          {/* Days Tabs */}
          <div className="bg-[#f8fafc] p-2 rounded-xl mt-5">
            <div className="flex items-center gap-1 border-b border-slate-200 mb-6 overflow-x-auto no-scrollbar">
              {days.map(day => (
                <button
                  key={day}
                  onClick={() => setActiveTab(day)}
                  className={`px-8 py-3 text-sm font-black transition-all relative ${activeTab === day ? "text-[#00315e]" : "text-slate-400 hover:text-slate-600"}`}
                >
                  {day}
                  {activeTab === day && <div className="absolute bottom-0 left-0 w-full h-1 bg-[#00315e] rounded-t-full shadow-lg shadow-[#00315e]/50" />}
                </button>
              ))}
            </div>

            {modalRowsByDay[activeTab].map((row, index) => (
              <div key={index} className="flex items-center gap-4 mb-4">



                <div className="w-full">
                  <label className="text-sm font-bold text-slate-700 dark:text-slate-700 mb-2 block ">
                    Subject  <span className="text-red-500">*</span>
                  </label>
                  <select
                    type={"text"}
                    required={true}
                    value={row.subjectId}
                    onChange={(e) => {
                      const newRows = [...modalRowsByDay[activeTab]];
                      newRows[index].subjectId = e.target.value;
                      setModalRowsByDay({ ...modalRowsByDay, [activeTab]: newRows });
                    }}
                    className="w-full px-4 py-2 bg-[#00315e24] border border-slate-200 text-slate-900 rounded-[6px] outline-none focus:ring-1 focus:ring-[#00315e] focus:border-[#00315e] transition-all"
                  >
                    <option value="">--Select--</option>

                    {availableSubjects?.map((item, i) => (
                      <option key={i} value={item?._id}>{item?.name}</option>
                    ))}
                  </select>
                </div>


                <div className="w-full">
                  <label className="text-sm font-bold text-slate-700 dark:text-slate-700 mb-2 block ">
                    Teacher  <span className="text-red-500">*</span>
                  </label>
                  <select
                    type={"text"}
                    required={true}
                    value={row.teacherId}
                    onChange={(e) => {
                      const newRows = [...modalRowsByDay[activeTab]];
                      newRows[index].teacherId = e.target.value;
                      setModalRowsByDay({ ...modalRowsByDay, [activeTab]: newRows });
                    }}
                    className="w-full px-4 py-2 bg-[#00315e24] border border-slate-200 text-slate-900 rounded-[6px] outline-none focus:ring-1 focus:ring-[#00315e] focus:border-[#00315e] transition-all"
                  >
                    <option value="">--Select--</option>

                    {teachers?.map((item, i) => (
                      <option key={i} value={item?._id}>{item?.name}</option>
                    ))}
                  </select>
                </div>







                <div className="w-full">
                  <label className="text-sm font-bold text-slate-700 dark:text-slate-700 mb-2 block">
                    Start Time <span className="text-red-500">*</span>
                  </label>
                  <input
                    type={"time"}
                    required={true}
                    value={row.timeFrom}
                    onChange={(e) => {
                      const newRows = [...modalRowsByDay[activeTab]];
                      newRows[index].timeFrom = e.target.value;
                      setModalRowsByDay({ ...modalRowsByDay, [activeTab]: newRows });
                    }}
                    className="w-full px-4 py-2 bg-[#00315e24] border border-slate-200 text-slate-900 rounded-[6px] outline-none focus:ring-1 focus:ring-[#00315e] focus:border-[#00315e] transition-all"

                  />
                </div>


                <div className="w-full">
                  <label className="text-sm font-bold text-slate-700 dark:text-slate-700 mb-2 block">
                    End Time <span className="text-red-500">*</span>
                  </label>
                  <input
                    type={"time"}
                    required={true}
                    value={row.timeTo}
                    onChange={(e) => {
                      const newRows = [...modalRowsByDay[activeTab]];
                      newRows[index].timeTo = e.target.value;
                      setModalRowsByDay({ ...modalRowsByDay, [activeTab]: newRows });
                    }}
                    className="w-full px-4 py-2 bg-[#00315e24] border border-slate-200 text-slate-900 rounded-[6px] outline-none focus:ring-1 focus:ring-[#00315e] focus:border-[#00315e] transition-all"

                  />
                </div>


                <div className="flex items-center gap-2 mt-6">
                  <button
                    onClick={() => {
                      const newRows = modalRowsByDay[activeTab].filter((_, i) => i !== index);
                      setModalRowsByDay({
                        ...modalRowsByDay,
                        [activeTab]: newRows.length > 0 ? newRows : [{ ...initialRows }]
                      });
                    }}
                    className="p-2 text-red-500 hover:bg-red-50 rounded-lg transition-colors"
                  >
                    <Trash2 className="w-5 h-5" />
                  </button>
                  {index === modalRowsByDay[activeTab].length - 1 && (
                    <button
                      onClick={() => {
                        const newRows = [...modalRowsByDay[activeTab], { ...initialRows }];
                        setModalRowsByDay({ ...modalRowsByDay, [activeTab]: newRows });
                      }}
                      className="p-2 text-[#00315e] hover:bg-[#00315e]/10 rounded-lg transition-colors"
                    >
                      <CirclePlus className="w-6 h-6" />
                    </button>
                  )}
                </div>
              </div>
            ))}
          </div>

          <div className="flex justify-end gap-3 pt-6 border-t border-slate-100">
            <button
              onClick={() => setIsModalOpen(false)}
              className="px-8 py-2.5 bg-slate-100 text-slate-600 rounded-lg font-bold hover:bg-slate-200 transition-all"
            >
              Cancel
            </button>
            <button
              onClick={handleSubmit}
              className="px-8 py-2.5 bg-[#00315e] text-white rounded-[8px] shadow-md hover:bg-[#002240] transition-all"
            >
              {currentSlot?._id ? "Update Time Table" : "Add Time Table"}
            </button>
          </div>
        </div>
      </Modal>





      {/* Delete Confirmation Modal */}
      <DeleteConfirmationModal
        isOpen={isDeleteModalOpen}
        onClose={() => setIsDeleteModalOpen(false)}
        onDelete={confirmDelete}
        itemName="schedule slot"
      />

      {/* Routine Preview Modal */}
      <Modal
        isOpen={isPreviewModalOpen}
        onClose={() => setIsPreviewModalOpen(false)}
        title="Routine Preview"
        width="w-full lg:max-w-[850px]"
      >
        <div className="flex flex-col gap-4">
          <div className="flex justify-end">
            <button
              onClick={handleExport}
              disabled={loading}
              className="px-6 py-2 bg-[#00315e] text-white rounded-[8px] flex items-center gap-2 hover:bg-[#002240] transition-all font-bold text-sm cursor-pointer disabled:opacity-50"
            >
              <FileDown className="w-4 h-4" />
              {loading ? "Exporting..." : "Download PDF"}
            </button>
          </div>
          <div className="overflow-auto bg-slate-100 p-4 rounded-xl flex justify-center max-h-[70vh]">
            <div id="printable-routine" className="w-[794px] shrink-0 min-h-[1123px] bg-[#f0f3f6] relative z-0 flex flex-col font-sans shadow-lg">
              {/* Full Page Watermark */}
              <div className="absolute inset-0 flex items-center justify-center opacity-[0.06] pointer-events-none z-0 overflow-hidden">
                <img src={logo} alt="" className="w-[40%] max-w-2xl object-contain grayscale" />
              </div>
              <style>
                {`
              @import url('https://fonts.googleapis.com/css2?family=Amiri:wght@700&display=swap');
              .font-arabic { font-family: 'Amiri', serif; }
            `}
              </style>

              <div className="p-8 flex-grow flex flex-col relative z-10">
                {/* Institutional Header */}
                <div className="flex justify-between items-start border-b-[3px] border-[#164366] pb-2 mb-6 relative">
                  <div className="flex items-center gap-6">

                    <div className="text-center pt-2">
                      <div className="flex items-center justify-center gap-2 mb-1">
                        <span className="text-[25px] font-bold text-[#164366] uppercase whitespace-nowrap">Pakunda Islamia Madrasa</span>
                        <div className="w-15 h-15 flex flex-col items-center justify-center overflow-hidden">
                          <img src={logo} alt="" />
                        </div>
                        <span className="text-[23px] leading-none font-arabic font-bold text-[#164366] whitespace-nowrap">الْمَدْرَسَةُ الْإِسْلَامِيَّةُ وَدَارُ الْأَيْتَامِ بِنَاكُونْدَا</span>
                      </div>
                      <h2 className="text-[40px] font-black text-slate-800 mb-0.5 -mt-[16px]">পাকুন্ডা ইসলামিয়া মাদ্রাসা ও এতিমখানা</h2>
                      <p className="text-[13px] font-bold text-slate-700">পাকুন্ডা, সোনামুড়ী, নারায়ণগঞ্জ,</p>
                      <p className="text-[13px] font-bold text-slate-700">স্থাপিত : ২০০০ খ্রি</p>
                    </div>
                  </div>
                </div>

                <div className="text-center mb-8 relative z-10">
                  <h3 className="inline-block text-[22px] font-black text-slate-800 border-b-2 border-slate-800 pb-1 uppercase tracking-wider">Class Routine</h3>
                </div>

                {/* Table */}
                <div className="flex-grow relative z-10">
                  <div className="flex justify-between text-[15px] font-black text-slate-800 mb-4 px-2">
                    <span>Class : {classes.find(c => c._id === selectedClassId)?.name || "Class"}</span>
                    <span>Section : {sections.find(s => s._id === selectedSectionId)?.name || "Section"}</span>
                  </div>
                  <table className="w-full text-left border-collapse border-2 border-[#164366]">
                    <thead>
                      <tr className="bg-[#164366] text-white">
                        <th className="p-3 font-bold border-2 border-[#164366] text-center w-32 text-lg">Day</th>
                        <th className="p-3 font-bold border-2 border-[#164366] text-center w-40 text-lg">Time</th>
                        <th className="p-3 font-bold border-2 border-[#164366] text-lg">Subject</th>
                        <th className="p-3 font-bold border-2 border-[#164366] text-lg">Teacher</th>
                      </tr>
                    </thead>
                    <tbody className="">
                      {days.map((day) => {
                        const slots = getSlotsByDay(day);
                        if (slots.length === 0) return null;
                        return slots.map((slot, index) => (
                          <tr key={slot._id} className="border-b-2 border-[#164366]">
                            {index === 0 && (
                              <td rowSpan={slots.length} className="p-3 font-black border-2 border-[#164366] text-center bg-slate-50 text-[#164366] align-middle text-lg uppercase tracking-wider">
                                {day}
                              </td>
                            )}
                            <td className="p-3 font-bold border-2 border-[#164366] text-center text-slate-700 text-[15px]">
                              {slot.timeRange}
                            </td>
                            <td className="p-3 font-black border-2 border-[#164366] text-slate-800 text-[16px]">
                              {slot.subjectId?.name || slot.subject}
                            </td>
                            <td className="p-3 font-bold border-2 border-[#164366] text-slate-700 text-[15px]">
                              {slot.teacherId?.name || slot.teacher}
                            </td>
                          </tr>
                        ));
                      })}
                    </tbody>
                  </table>
                </div>

                {/* Signature */}
                <div className="mt-auto pt-12 pb-6 flex justify-end">
                  <div className="text-center w-48 mr-6">
                    <div className="h-16 flex items-center justify-center">
                      <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 300 100" className="h-12 opacity-80">
                        <path d="M10,80 Q40,10 80,70 T150,60 T220,80 Q250,30 280,60" fill="none" stroke="#164366" strokeWidth="4" strokeLinecap="round" strokeLinejoin="round" />
                        <path d="M120,40 Q130,20 140,50" fill="none" stroke="#164366" strokeWidth="3" strokeLinecap="round" />
                      </svg>
                    </div>
                    <div className="pt-2 border-t-2 border-slate-800">
                      <p className="text-sm font-black text-slate-800">প্রধান শিক্ষক</p>
                    </div>
                  </div>
                </div>
              </div>

              {/* Footer Area */}
              <div className="bg-[#164366] text-white py-4 px-8 flex justify-center items-center gap-12 text-sm font-bold mt-auto shrink-0">
                <div className="flex items-center gap-2">
                  <Globe className="w-5 h-5" />
                  <span>www.pakundamadrasa.com</span>
                </div>
                <div className="flex items-center gap-2">
                  <Phone className="w-5 h-5" />
                  <span>01986566021</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </Modal>
    </div>
  );
};

export default ClassSchedule;
