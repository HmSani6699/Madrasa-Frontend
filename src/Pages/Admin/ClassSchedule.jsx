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
  CirclePlus
} from "lucide-react";
import Modal from "../../components/Modal";
import DeleteConfirmationModal from "../../components/DeleteConfirmationModal";
import axiosInstance from "../../api/axiosInstance";
import { toast } from "react-hot-toast";
import InputField from "../../components/InputField";
import SelectInputField from "../../components/SelectInputField";

const ClassSchedule = () => {
  const [selectedClassId, setSelectedClassId] = useState("");
  const [selectedSectionId, setSelectedSectionId] = useState("");
  const [viewMode, setViewMode] = useState("grid"); // "grid" or "list"
  
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
  const [modalRows, setModalRows] = useState([
    { subjectId: "", teacherId: "", timeFrom: "", timeTo: "" }
  ]);


  console.log(activeTab);
  

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [classesRes, subjectsRes, teachersRes] = await Promise.all([
          axiosInstance.get("/v1/classes"),
          axiosInstance.get("/v1/subjects"),
          axiosInstance.get("/v1/staff?role=Teacher")
        ]);
        if (classesRes.data.success) {
          setClasses(classesRes.data.data);
          if (classesRes.data.data.length > 0) setSelectedClassId(classesRes.data.data[0]._id);
        }
        if (subjectsRes.data.success) setSubjects(subjectsRes.data.data);
        if (teachersRes.data.success) setTeachers(teachersRes.data.data);
      } catch (err) {
        console.error("Error fetching initial data:", err);
      }
    };
    fetchData();
  }, []);

  useEffect(() => {
    if (!selectedClassId) return;
    const fetchSections = async () => {
      try {
        const response = await axiosInstance.get(`/v1/sections?class_id=${selectedClassId}`);
        if (response.data.success) {
          setSections(response.data.data);
          if (response.data.data.length > 0) setSelectedSectionId(response.data.data[0]._id);
          else setSelectedSectionId("");
        }
      } catch (err) {
        console.error("Error fetching sections:", err);
      }
    };
    fetchSections();
  }, [selectedClassId]);

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
    setModalRows([{ subjectId: "", teacherId: "", timeFrom: "", timeTo: "" }]);
    setIsModalOpen(true);
  };

  const handleEditSlot = (dayRoutine) => {
    setCurrentSlot(dayRoutine);
    setActiveTab(dayRoutine.day);
    setModalRows(dayRoutine.periods.map(p => ({
        subjectId: p.subject_id,
        teacherId: p.teacher_id,
        timeFrom: p.startTime,
        timeTo: p.endTime
    })));
    setIsModalOpen(true);
  };

  const handleDeleteClick = (slot) => {
    setSlotToDelete(slot);
    setIsDeleteModalOpen(true);
  };

  const confirmDelete = async () => {
    setLoading(true);
    try {
      const response = await axiosInstance.delete(`/v1/class-routines/${slotToDelete._id}`);
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
      const payload = {
        class_id: selectedClassId,
        section_id: selectedSectionId,
        day: activeTab,
        periods: modalRows.map(row => ({
            startTime: row.timeFrom || "09:00",
            endTime: row.timeTo || "10:00",
            subject_id: row.subjectId,
            teacher_id: row.teacherId,
            roomNumber: "101" // Default
        })).filter(r => r.subject_id && r.teacher_id)
      };

      if (payload.periods.length === 0) {
          toast.error("Please add at least one subject/teacher row");
          setLoading(false);
          return;
      }

      const response = await axiosInstance.post("/v1/class-routines", payload);
      if (response.data.success) {
        toast.success("Time Table updated!");
        fetchRoutines();
        setIsModalOpen(false);
      }
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
        raw: dayRoutine
    }));
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
         
          <button className="p-2.5 bg-white border border-slate-200 rounded-lg text-slate-500 hover:bg-slate-50 transition-all">
            <Printer className="w-5 h-5" />
          </button>
          <div className="relative group">
            <button className="px-4 py-2 bg-white border border-slate-200 rounded-[8px] text-slate-600 hover:bg-slate-50 transition-all flex items-center gap-2">
                <FileDown className="w-5 h-5" />
                Export
                <ChevronDown className="w-4 h-4" />
            </button>
          </div>
          <button
            onClick={handleAddSlot}
            className="px-6 py-2  bg-[#00bd7f] text-white rounded-[8px]  flex items-center gap-2"
          >
            <Plus className="w-5 h-5" />
            Add Time Table
          </button>
        </div>
      </div>

      {/* Main Content Area */}
      <div className="bg-white rounded-[8px] border border-slate-100 shadow-sm overflow-hidden">
        <div className="p-5 border-b border-slate-50 flex items-center justify-between">
          <h2 className="text-lg font-black text-[#2d3748]">Time Table</h2>
          <button className="px-4 py-2 border border-slate-200 rounded-[8px] text-slate-500 font-bold text-sm flex items-center gap-2 hover:bg-slate-50 transition-all">
            <Filter className="w-4 h-4" />
            Filter
            <ChevronDown className="w-4 h-4" />
          </button>
        </div>

        <div className="p-6">
          {loading ? (
            <div className="flex flex-col items-center justify-center py-20">
              <div className="w-12 h-12 border-4 border-blue-500 border-t-transparent rounded-full animate-spin mb-4"></div>
              <p className="text-slate-500 font-bold">Loading timetable...</p>
            </div>
          ) : (
            <div className="flex gap-4 w-full  overflow-x-auto">
              {days.map((day, dayIndex) => (
                <div key={day} className="flex flex-col gap-4">
                  <h3 className="font-black text-slate-800 text-[15px] mb-2">{day}</h3>
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
                             <button onClick={() => handleDeleteClick(slot.raw)} className="p-1.5 bg-white shadow-md rounded-lg text-red-500 hover:scale-110 active:scale-95 transition-all">
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
              // onChange={(e) => setSelectedClassId(e.target.value)}
              setValue={setSelectedClassId}
              options={classes.map(c => ({ value: c._id, label: c.name }))}
            />
            <SelectInputField 
              title={'Section'} 
              value={selectedSectionId}
              // onChange={(e) => setSelectedSectionId(e.target.value)}
              setValue={setSelectedSectionId}
              options={sections.map(s => ({ value: s._id, label: s.name }))}
            />
            <SelectInputField 
              title={'Duration(min)'} 
              options={[
                { value: "40 min", label: "40 min" },
                { value: "1 hr", label: "1 hr" }
              ]}
              
            />
          </div>


          {/* Days Tabs */}
          <div className="bg-[#f8fafc] p-2 rounded-xl mt-5">
             <div className="flex items-center gap-1 border-b border-slate-200 mb-6 overflow-x-auto no-scrollbar">
                {days.map(day => (
                    <button
                        key={day}
                        onClick={() => setActiveTab(day)}
                        className={`px-8 py-3 text-sm font-black transition-all relative ${activeTab === day ? "text-[#00bd7f]" : "text-slate-400 hover:text-slate-600"}`}
                    >
                        {day}
                        {activeTab === day && <div className="absolute bottom-0 left-0 w-full h-1 bg-[#00bd7f] rounded-t-full shadow-lg shadow-[#00bd7f]" />}
                    </button>
                ))}
             </div>

            {modalRows.map((row, index) => (
              <div key={index} className="flex items-center gap-4 mb-4">
               


                <div className="w-full">
      <label className="text-sm font-bold text-slate-700 dark:text-slate-700 mb-2 block ">
        Subject  <span className="text-red-500">*</span>
      </label>
      <select
        type={ "text"}
        required={ true}
        value={row.subjectId}
         onChange={(e) => {
                    const newRows = [...modalRows];
                    newRows[index].subjectId = e.target.value;
                    setModalRows(newRows);
                  }}
        className="w-full px-4 py-2 bg-[#e6f4ef] dark:bg-[#e6f4ef] border border-slate-200 dark:border-slate-200 text-slate-900 dark:text-slate-900 rounded-[8px] outline-none focus:ring-0.5 focus:ring-emerald-500 focus:border-emerald-500 transition-all"
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
        type={ "text"}
        required={ true}
        value={row.teacherId}
         onChange={(e) => {
                    const newRows = [...modalRows];
                    newRows[index].teacherId = e.target.value;
                    setModalRows(newRows);
                  }}
        className="w-full px-4 py-2 bg-[#e6f4ef] dark:bg-[#e6f4ef] border border-slate-200 dark:border-slate-200 text-slate-900 dark:text-slate-900 rounded-[8px] outline-none focus:ring-0.5 focus:ring-emerald-500 focus:border-emerald-500 transition-all"
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
        type={ "time"}
        required={true}
          value={row.timeFrom}
         onChange={(e) => {
                    const newRows = [...modalRows];
                    newRows[index].timeFrom = e.target.value;
                    setModalRows(newRows);
                  }}
        className="w-full px-4 py-2 bg-[#e6f4ef] dark:bg-[#e6f4ef] border border-slate-200 dark:border-slate-200 text-slate-900 dark:text-slate-900 rounded-[8px] outline-none focus:ring-0.5 focus:ring-emerald-500 focus:border-emerald-500 transition-all"
      
      />
                </div>
                

                 <div className="w-full">
      <label className="text-sm font-bold text-slate-700 dark:text-slate-700 mb-2 block">
        End Time <span className="text-red-500">*</span>
      </label>
      <input
        type={ "time"}
        required={true}
          value={row.timeTo}
         onChange={(e) => {
                    const newRows = [...modalRows];
                    newRows[index].timeTo = e.target.value;
                    setModalRows(newRows);
                  }}
        className="w-full px-4 py-2 bg-[#e6f4ef] dark:bg-[#e6f4ef] border border-slate-200 dark:border-slate-200 text-slate-900 dark:text-slate-900 rounded-[8px] outline-none focus:ring-0.5 focus:ring-emerald-500 focus:border-emerald-500 transition-all"
      
      />
    </div>

              
                <div className="flex items-center gap-2 mt-6">
                  <button 
                    onClick={() => {
                      const newRows = modalRows.filter((_, i) => i !== index);
                      setModalRows(newRows.length > 0 ? newRows : [{ subjectId: "", teacherId: "", timeFrom: "", timeTo: "" }]);
                    }}
                    className="p-2 text-red-500 hover:bg-red-50 rounded-lg transition-colors"
                  >
                    <Trash2 className="w-5 h-5" />
                  </button>
                  {index === modalRows.length - 1 && (
                    <button 
                      onClick={() => setModalRows([...modalRows, { subjectId: "", teacherId: "", timeFrom: "", timeTo: "" }])}
                      className="p-2 text-[#00bd7f] hover:bg-[#00bd7f]/10 rounded-lg transition-colors"
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
              className="px-8 py-2.5 bg-[#00bd7f] text-white rounded-[8px]  shadow-lg shadow-blue-200 hover:bg-[#00bd7f] transition-all"
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
        onConfirm={confirmDelete}
        itemType="schedule slot"
      />
    </div>
  );
};

export default ClassSchedule;
