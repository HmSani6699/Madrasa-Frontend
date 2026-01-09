import { useState } from "react";
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
  X
} from "lucide-react";
import Modal from "../../components/Modal";
import DeleteConfirmationModal from "../../components/DeleteConfirmationModal";

const ClassSchedule = () => {
  const [selectedClass, setSelectedClass] = useState("Class 5");
  const [selectedSection, setSelectedSection] = useState("Section A");
  const [viewMode, setViewMode] = useState("grid"); // "grid" or "list"
  
  // Modal States
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [currentSlot, setCurrentSlot] = useState(null); // For Add/Edit
  const [slotToDelete, setSlotToDelete] = useState(null);

  const days = ["Saturday", "Sunday", "Monday", "Tuesday", "Wednesday", "Thursday"];
  const timeSlots = [
    "08:00 AM - 09:00 AM",
    "09:00 AM - 10:00 AM",
    "10:00 AM - 11:00 AM",
    "11:00 AM - 11:30 AM", // Break
    "11:30 AM - 12:30 PM",
    "12:30 PM - 01:30 PM",
  ];

  const colors = [
    { name: "Blue", value: "bg-blue-50 border-blue-200 text-blue-700" },
    { name: "Purple", value: "bg-purple-50 border-purple-200 text-purple-700" },
    { name: "Emerald", value: "bg-emerald-50 border-emerald-200 text-emerald-700" },
    { name: "Amber", value: "bg-amber-50 border-amber-200 text-amber-700" },
    { name: "Rose", value: "bg-rose-50 border-rose-200 text-rose-700" },
    { name: "Indigo", value: "bg-indigo-50 border-indigo-200 text-indigo-700" },
    { name: "Teal", value: "bg-teal-50 border-teal-200 text-teal-700" },
    { name: "Cyan", value: "bg-cyan-50 border-cyan-200 text-cyan-700" },
    { name: "Orange", value: "bg-orange-50 border-orange-200 text-orange-700" },
    { name: "Lime", value: "bg-lime-50 border-lime-200 text-lime-700" },
    { name: "Slate (Break)", value: "bg-slate-50 border-slate-100 text-slate-400" },
  ];

  // Initial Data
  const [scheduleData, setScheduleData] = useState([
    { id: 1, day: "Saturday", time: "08:00 AM - 09:00 AM", subject: "Arabic Grammar", teacher: "M. Abdul Karim", room: "101", class: "Class 5", section: "Section A", color: "bg-blue-50 border-blue-200 text-blue-700" },
    { id: 2, day: "Saturday", time: "09:00 AM - 10:00 AM", subject: "Fiqh", teacher: "M. Yusuf Ali", room: "101", class: "Class 5", section: "Section A", color: "bg-purple-50 border-purple-200 text-purple-700" },
    { id: 3, day: "Saturday", time: "10:00 AM - 11:00 AM", subject: "Mathematics", teacher: "H. Kamal Uddin", room: "101", class: "Class 5", section: "Section A", color: "bg-emerald-50 border-emerald-200 text-emerald-700" },
    { id: 4, day: "Saturday", time: "11:00 AM - 11:30 AM", isBreak: true, label: "Tiffin Break", class: "Class 5", section: "Section A", color: "bg-slate-50 border-slate-100 text-slate-400" },
    { id: 5, day: "Saturday", time: "11:30 AM - 12:30 PM", subject: "Bengali", teacher: "Abdur Rashid", room: "101", class: "Class 5", section: "Section A", color: "bg-amber-50 border-amber-200 text-amber-700" },
    // Mocking Sunday for demo
    { id: 6, day: "Sunday", time: "08:00 AM - 09:00 AM", subject: "Hadith", teacher: "M. Abdul Karim", room: "101", class: "Class 5", section: "Section A", color: "bg-indigo-50 border-indigo-200 text-indigo-700" },
  ]);

  // Handlers
  const handleAddSlot = () => {
    setCurrentSlot({
      id: null,
      day: "Saturday",
      time: "08:00 AM - 09:00 AM",
      subject: "",
      teacher: "",
      room: "",
      class: selectedClass,
      section: selectedSection,
      color: "bg-blue-50 border-blue-200 text-blue-700",
      isBreak: false,
      label: ""
    });
    setIsModalOpen(true);
  };

  const handleEditSlot = (slot) => {
    setCurrentSlot({ ...slot });
    setIsModalOpen(true);
  };

  const handleDeleteClick = (slot) => {
    setSlotToDelete(slot);
    setIsDeleteModalOpen(true);
  };

  const confirmDelete = () => {
    setScheduleData(prev => prev.filter(item => item.id !== slotToDelete.id));
    setIsDeleteModalOpen(false);
    setSlotToDelete(null);
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (currentSlot.id) {
      // Edit
      setScheduleData(prev => prev.map(item => item.id === currentSlot.id ? currentSlot : item));
    } else {
      // Add
      setScheduleData(prev => [...prev, { ...currentSlot, id: Date.now() }]);
    }
    setIsModalOpen(false);
  };

  // Filter Data
  const getSlot = (day, time) => {
    return scheduleData.find(item => 
      item.day === day && 
      item.time === time && 
      item.class === selectedClass && 
      item.section === selectedSection
    );
  };

  return (
    <div className="space-y-8 animate-in fade-in duration-500 p-4 md:p-8">
      {/* Header */}
      <div className="bg-white rounded-[2.5rem] border-2 border-slate-200 p-8 flex flex-col md:flex-row justify-between items-center gap-6 shadow-sm">
        <div className="flex items-center gap-6">
          <div className="w-16 h-16 bg-emerald-50 rounded-2xl flex items-center justify-center border-2 border-emerald-100">
            <Calendar className="w-8 h-8 text-[#00bd7f]" />
          </div>
          <div>
            <h1 className="text-2xl md:text-3xl font-black text-slate-800">Class Schedule</h1>
            <p className="text-slate-500 font-bold mt-1">Weekly academic timetable management</p>
          </div>
        </div>

        <div className="flex gap-3 w-full md:w-auto">
          <button className="flex-1 md:flex-none px-6 py-3 bg-white border-2 border-slate-200 text-slate-600 rounded-2xl font-black hover:bg-slate-50 transition-all flex items-center justify-center gap-2">
            <Download className="w-5 h-5" />
            Export PDF
          </button>
          <button 
            onClick={handleAddSlot}
            className="flex-1 md:flex-none px-6 py-3 bg-[#00bd7f] text-white rounded-2xl font-black shadow-xl shadow-emerald-200 hover:scale-[1.02] active:scale-95 transition-all flex items-center justify-center gap-2"
          >
            <Plus className="w-5 h-5" />
            Add Slot
          </button>
        </div>
      </div>

      {/* Control Bar */}
      <div className="bg-white p-4 rounded-[2rem] border-2 border-slate-200 shadow-sm flex flex-col md:flex-row gap-4 items-center justify-between">
        <div className="flex items-center gap-4 w-full md:w-auto">
          <select 
            value={selectedClass} 
            onChange={(e) => setSelectedClass(e.target.value)}
            className="flex-1 md:w-48 bg-slate-50 border-2 border-slate-100 rounded-2xl px-6 py-3 text-sm font-bold focus:border-[#00bd7f] outline-none appearance-none"
          >
            <option>Class 4</option>
            <option>Class 5</option>
            <option>Class 6</option>
            <option>Class 7</option>
            <option>Class 8</option>
          </select>
          <select 
            value={selectedSection} 
            onChange={(e) => setSelectedSection(e.target.value)}
            className="flex-1 md:w-40 bg-slate-50 border-2 border-slate-100 rounded-2xl px-6 py-3 text-sm font-bold focus:border-[#00bd7f] outline-none appearance-none"
          >
            <option>Section A</option>
            <option>Section B</option>
            <option>Section C</option>
          </select>
        </div>

        <div className="flex bg-slate-100 p-1.5 rounded-2xl">
          <button 
            onClick={() => setViewMode("grid")}
            className={`p-2.5 rounded-xl transition-all ${viewMode === 'grid' ? 'bg-white text-[#00bd7f] shadow-sm' : 'text-slate-400 hover:text-slate-600'}`}
          >
            <LayoutGrid className="w-5 h-5" />
          </button>
          <button 
            onClick={() => setViewMode("list")}
            className={`p-2.5 rounded-xl transition-all ${viewMode === 'list' ? 'bg-white text-[#00bd7f] shadow-sm' : 'text-slate-400 hover:text-slate-600'}`}
          >
            <List className="w-5 h-5" />
          </button>
        </div>
      </div>

      {/* Timetable Grid */}
      <div className="bg-white rounded-[2.5rem] border-2 border-slate-200 shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full border-collapse">
            <thead>
              <tr className="bg-slate-50/50">
                <th className="p-6 text-left text-[10px] font-black text-slate-400 uppercase tracking-widest border-r-2 border-slate-100 w-48 sticky left-0 bg-slate-50 z-10">Time / Day</th>
                {days.map(day => (
                  <th key={day} className="p-6 text-center text-[10px] font-black text-slate-600 uppercase tracking-widest min-w-[220px]">
                    {day}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody className="divide-y-2 divide-slate-100">
              {timeSlots.map((slot, idx) => (
                <tr key={idx} className="group transition-colors">
                  <td className="p-6 bg-slate-50/20 border-r-2 border-slate-100 sticky left-0 z-10 backdrop-blur-sm">
                    <div className="flex items-center gap-3">
                        <Clock className="w-4 h-4 text-[#00bd7f]" />
                        <span className="text-xs font-black text-slate-700">{slot}</span>
                    </div>
                  </td>
                  {days.map(day => {
                    const period = getSlot(day, slot);
                    
                    if (!period) return (
                         <td key={day} className="p-4 relative group/cell">
                             <div 
                                className="w-full h-28 border-2 border-dashed border-slate-100 rounded-3xl flex items-center justify-center opacity-0 group-hover/cell:opacity-100 transition-all cursor-pointer hover:border-[#00bd7f]/30 hover:bg-[#00bd7f]/5"
                                onClick={() => {
                                    setCurrentSlot({
                                        id: null,
                                        day: day,
                                        time: slot,
                                        subject: "",
                                        teacher: "",
                                        room: "",
                                        class: selectedClass,
                                        section: selectedSection,
                                        color: "bg-blue-50 border-blue-200 text-blue-700",
                                        isBreak: false,
                                        label: ""
                                    });
                                    setIsModalOpen(true);
                                }}
                             >
                                <Plus className="w-6 h-6 text-[#00bd7f]" />
                             </div>
                         </td>
                    );
                    
                    if (period.isBreak) {
                        return (
                            <td key={day} className="p-4">
                                <div 
                                    className={`h-28 rounded-3xl border-2 flex flex-col items-center justify-center gap-2 group/card relative ${period.color} cursor-pointer hover:brightness-95 transition-all`}
                                    onClick={() => handleEditSlot(period)}
                                >
                                    <span className="text-[10px] font-black uppercase tracking-widest">{period.label}</span>
                                    <div className="absolute top-2 right-2 opacity-0 group-hover/card:opacity-100 transition-opacity flex gap-1">
                                         <button 
                                            onClick={(e) => { e.stopPropagation(); handleDeleteClick(period); }}
                                            className="p-1.5 bg-white rounded-full text-red-500 shadow-sm hover:scale-110 transition-transform"
                                         >
                                            <Trash2 className="w-3 h-3" />
                                         </button>
                                    </div>
                                </div>
                            </td>
                        );
                    }

                    return (
                        <td key={day} className="p-4">
                            <div className={`p-5 rounded-3xl border-2 transition-all hover:scale-[1.02] hover:shadow-lg h-28 flex flex-col justify-center relative group/card ${period.color}`}>
                                <p className="text-sm font-black truncate pr-4">{period.subject}</p>
                                <div className="mt-2 space-y-1">
                                    <div className="flex items-center gap-1.5 text-[10px] font-bold opacity-70">
                                        <User className="w-3 h-3" /> {period.teacher}
                                    </div>
                                    <div className="flex items-center gap-1.5 text-[10px] font-bold opacity-70">
                                        <MapPin className="w-3 h-3" /> Room {period.room}
                                    </div>
                                </div>
                                <div className="absolute top-3 right-3 opacity-0 group-hover/card:opacity-100 transition-opacity flex gap-1">
                                    <button 
                                        onClick={() => handleEditSlot(period)}
                                        className="p-1.5 bg-white/80 backdrop-blur-sm rounded-xl text-slate-600 shadow-sm hover:text-[#00bd7f] transition-all"
                                    >
                                        <Edit2 className="w-3.5 h-3.5" />
                                    </button>
                                    <button 
                                        onClick={() => handleDeleteClick(period)}
                                        className="p-1.5 bg-white/80 backdrop-blur-sm rounded-xl text-slate-600 shadow-sm hover:text-red-500 transition-all"
                                    >
                                        <Trash2 className="w-3.5 h-3.5" />
                                    </button>
                                </div>
                            </div>
                        </td>
                    );
                  })}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Add/Edit Modal */}
      <Modal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        title={currentSlot?.id ? "Edit Schedule Slot" : "Add New Slot"}
      >
        <form onSubmit={handleSubmit} className="space-y-4">
            
            <div className="grid grid-cols-2 gap-4">
                <div>
                   <label className="block text-xs font-bold text-slate-500 mb-1.5 uppercase">Day</label>
                   <select 
                     required
                     value={currentSlot?.day}
                     onChange={e => setCurrentSlot({...currentSlot, day: e.target.value})}
                     className="w-full bg-slate-50 border-2 border-slate-100 rounded-xl px-4 py-2.5 text-sm font-bold focus:border-[#00bd7f] outline-none"
                   >
                     {days.map(d => <option key={d}>{d}</option>)}
                   </select>
                </div>
                <div>
                   <label className="block text-xs font-bold text-slate-500 mb-1.5 uppercase">Time Slot</label>
                   <select 
                     required
                     value={currentSlot?.time}
                     onChange={e => setCurrentSlot({...currentSlot, time: e.target.value})}
                     className="w-full bg-slate-50 border-2 border-slate-100 rounded-xl px-4 py-2.5 text-sm font-bold focus:border-[#00bd7f] outline-none"
                   >
                     {timeSlots.map(t => <option key={t}>{t}</option>)}
                   </select>
                </div>
            </div>

            <div className="flex items-center gap-3 p-4 bg-slate-50 rounded-xl border-2 border-slate-100">
                <input 
                    type="checkbox"
                    id="isBreak"
                    checked={currentSlot?.isBreak}
                    onChange={e => setCurrentSlot({...currentSlot, isBreak: e.target.checked, color: e.target.checked ? "bg-slate-50 border-slate-100 text-slate-400" : colors[0].value})}
                    className="accent-[#00bd7f] w-5 h-5 rounded-lg"
                />
                <label htmlFor="isBreak" className="text-sm font-bold text-slate-700 select-none">Mark as Break/Recess</label>
            </div>

            {currentSlot?.isBreak ? (
                <div>
                   <label className="block text-xs font-bold text-slate-500 mb-1.5 uppercase">Break Label</label>
                   <input 
                     type="text"
                     value={currentSlot?.label}
                     onChange={e => setCurrentSlot({...currentSlot, label: e.target.value})}
                     placeholder="e.g. Tiffin Break"
                     className="w-full bg-slate-50 border-2 border-slate-100 rounded-xl px-4 py-2.5 text-sm font-bold focus:border-[#00bd7f] outline-none"
                   />
                </div>
            ) : (
                <>
                    <div>
                       <label className="block text-xs font-bold text-slate-500 mb-1.5 uppercase">Subject</label>
                       <input 
                         type="text"
                         required
                         value={currentSlot?.subject}
                         onChange={e => setCurrentSlot({...currentSlot, subject: e.target.value})}
                         placeholder="e.g. Mathematics"
                         className="w-full bg-slate-50 border-2 border-slate-100 rounded-xl px-4 py-2.5 text-sm font-bold focus:border-[#00bd7f] outline-none"
                       />
                    </div>
                    <div className="grid grid-cols-2 gap-4">
                        <div>
                           <label className="block text-xs font-bold text-slate-500 mb-1.5 uppercase">Teacher</label>
                           <input 
                             type="text"
                             required
                             value={currentSlot?.teacher}
                             onChange={e => setCurrentSlot({...currentSlot, teacher: e.target.value})}
                             placeholder="e.g. M. Abdul Karim"
                             className="w-full bg-slate-50 border-2 border-slate-100 rounded-xl px-4 py-2.5 text-sm font-bold focus:border-[#00bd7f] outline-none"
                           />
                        </div>
                        <div>
                           <label className="block text-xs font-bold text-slate-500 mb-1.5 uppercase">Room No</label>
                           <input 
                             type="text"
                             required
                             value={currentSlot?.room}
                             onChange={e => setCurrentSlot({...currentSlot, room: e.target.value})}
                             placeholder="e.g. 101"
                             className="w-full bg-slate-50 border-2 border-slate-100 rounded-xl px-4 py-2.5 text-sm font-bold focus:border-[#00bd7f] outline-none"
                           />
                        </div>
                    </div>
                    
                    <div>
                        <label className="block text-xs font-bold text-slate-500 mb-1.5 uppercase">Card Style</label>
                        <div className="grid grid-cols-5 gap-2 mt-2">
                            {colors.map(c => (
                                <button
                                    key={c.name}
                                    type="button"
                                    onClick={() => setCurrentSlot({...currentSlot, color: c.value})}
                                    className={`w-full aspect-square rounded-xl border-2 flex items-center justify-center transition-all ${c.value} ${currentSlot?.color === c.value ? 'ring-2 ring-[#00bd7f] ring-offset-2 scale-110' : 'hover:scale-105'}`}
                                    title={c.name}
                                >
                                    {currentSlot?.color === c.value && <div className="w-2 h-2 rounded-full bg-current" />}
                                </button>
                            ))}
                        </div>
                    </div>
                </>
            )}

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
                  {currentSlot?.id ? "Update Slot" : "Save Slot"}
                </button>
            </div>
        </form>
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
