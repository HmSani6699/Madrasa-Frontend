import { useState, useMemo } from "react";
import {
  CalendarDays,
  Search,
  Plus,
  MapPin,
  Clock,
  Users,
  Eye,
  SquarePen,
  Trash2,
  X,
  AlertCircle,
} from "lucide-react";
import { toast } from "react-hot-toast";

const INITIAL_EVENTS = [
  {
    id: 1,
    title: "Annual Sports Day 2026",
    date: "2026-02-15",
    time: "09:00",
    location: "Main Ground",
    attendees: "All Students",
    status: "planned",
    priority: "high",
  },
  {
    id: 2,
    title: "Parent-Teacher Meeting",
    date: "2026-01-20",
    time: "10:30",
    location: "Conference Hall",
    attendees: "Parents & Teachers",
    status: "active",
    priority: "medium",
  },
  {
    id: 3,
    title: "Inter-Class Qira'at Competition",
    date: "2026-02-01",
    time: "14:00",
    location: "Prayer Hall",
    attendees: "Selected Students",
    status: "planned",
    priority: "high",
  },
  {
    id: 4,
    title: "Winter Vacation Startup",
    date: "2025-12-25",
    time: "08:00",
    location: "Campus Wide",
    attendees: "All",
    status: "completed",
    priority: "low",
  },
];

const EMPTY_FORM = {
  title: "",
  date: "",
  time: "",
  location: "",
  attendees: "All Students",
  status: "planned",
  priority: "medium",
};

const STATUS_BADGES = {
  active: "bg-emerald-50 text-emerald-700 border-emerald-200",
  planned: "bg-blue-50 text-blue-700 border-blue-200",
  completed: "bg-slate-100 text-slate-600 border-slate-200",
};

const PRIORITY_BADGES = {
  high: "bg-rose-50 text-rose-700 border-rose-200",
  medium: "bg-amber-50 text-amber-700 border-amber-200",
  low: "bg-slate-100 text-slate-600 border-slate-200",
};

const formatDisplayDate = (dateStr) => {
  if (!dateStr) return "—";
  const parsed = new Date(`${dateStr}T00:00:00`);
  if (Number.isNaN(parsed.getTime())) return dateStr;
  return parsed.toLocaleDateString("en-US", {
    day: "2-digit",
    month: "short",
    year: "numeric",
  });
};

const formatDisplayTime = (timeStr) => {
  if (!timeStr) return "—";
  if (/am|pm/i.test(timeStr)) return timeStr;
  const [hoursStr, minutesStr] = timeStr.split(":");
  const hours = Number(hoursStr);
  const minutes = Number(minutesStr);
  if (Number.isNaN(hours) || Number.isNaN(minutes)) return timeStr;
  const suffix = hours >= 12 ? "PM" : "AM";
  const displayHour = hours % 12 || 12;
  return `${String(displayHour).padStart(2, "0")}:${String(minutes).padStart(2, "0")} ${suffix}`;
};

const EventsManager = () => {
  const [events, setEvents] = useState(INITIAL_EVENTS);
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [priorityFilter, setPriorityFilter] = useState("all");

  const [isFormModalOpen, setIsFormModalOpen] = useState(false);
  const [modalMode, setModalMode] = useState("add"); // "add" | "edit"
  const [selectedEvent, setSelectedEvent] = useState(null);
  const [formData, setFormData] = useState(EMPTY_FORM);

  const [viewEvent, setViewEvent] = useState(null);
  const [deleteTarget, setDeleteTarget] = useState(null);

  const filteredEvents = useMemo(() => {
    const query = searchTerm.trim().toLowerCase();
    return events.filter((ev) => {
      const matchesSearch =
        !query ||
        ev.title.toLowerCase().includes(query) ||
        ev.location.toLowerCase().includes(query) ||
        ev.attendees.toLowerCase().includes(query);
      const matchesStatus = statusFilter === "all" || ev.status === statusFilter;
      const matchesPriority = priorityFilter === "all" || ev.priority === priorityFilter;
      return matchesSearch && matchesStatus && matchesPriority;
    });
  }, [events, searchTerm, statusFilter, priorityFilter]);

  const openAddModal = () => {
    setFormData(EMPTY_FORM);
    setSelectedEvent(null);
    setModalMode("add");
    setIsFormModalOpen(true);
  };

  const openEditModal = (ev) => {
    setSelectedEvent(ev);
    setFormData({
      title: ev.title,
      date: ev.date,
      time: ev.time,
      location: ev.location,
      attendees: ev.attendees,
      status: ev.status,
      priority: ev.priority,
    });
    setModalMode("edit");
    setIsFormModalOpen(true);
  };

  const handleSaveEvent = (e) => {
    e.preventDefault();
    if (!formData.title.trim()) return toast.error("Please enter an event title");
    if (!formData.date) return toast.error("Please select an event date");
    if (!formData.location.trim()) return toast.error("Please enter an event location");

    const payload = {
      title: formData.title.trim(),
      date: formData.date,
      time: formData.time || "09:00",
      location: formData.location.trim(),
      attendees: formData.attendees.trim() || "All",
      status: formData.status,
      priority: formData.priority,
    };

    if (modalMode === "add") {
      const nextId = events.length > 0 ? Math.max(...events.map((ev) => ev.id)) + 1 : 1;
      setEvents([{ id: nextId, ...payload }, ...events]);
      toast.success("Event created successfully");
    } else if (selectedEvent) {
      setEvents(events.map((ev) => (ev.id === selectedEvent.id ? { ...ev, ...payload } : ev)));
      toast.success("Event updated successfully");
    }

    setIsFormModalOpen(false);
    setSelectedEvent(null);
  };

  const handleConfirmDelete = () => {
    if (!deleteTarget) return;
    setEvents(events.filter((ev) => ev.id !== deleteTarget.id));
    toast.success("Event deleted successfully");
    setDeleteTarget(null);
  };

  return (
    <div className="animate-in fade-in duration-500 space-y-5">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-[20px] font-black text-slate-800 flex items-center gap-3">
            <CalendarDays className="w-7 h-7 text-[#1C7D5A]" />
            Events Management
          </h1>
          <p className="text-[14px] text-slate-500 font-bold mt-1">
            Schedule, track, and manage madrasa events
          </p>
        </div>

        <button
          type="button"
          onClick={openAddModal}
          className="px-4 py-2.5 bg-[#1C7D5A] text-white rounded-[8px] font-bold text-sm cursor-pointer flex items-center justify-center gap-2 transition-all hover:bg-[#156347] active:scale-95 shadow-sm whitespace-nowrap"
        >
          <Plus className="w-4 h-4" />
          Create New Event
        </button>
      </div>

      {/* Table Card */}
      <div className="bg-white rounded-[8px] border border-gray-200 shadow-sm overflow-hidden">
        {/* Toolbar */}
        <div className="p-4 flex flex-col lg:flex-row lg:items-center justify-between gap-4 border-b border-gray-200">
          <div className="flex items-center gap-2">
            <h2 className="text-[18px] font-semibold text-slate-800">Event List</h2>
            <span className="px-2.5 py-0.5 rounded-full bg-[#1C7D5A18] text-[#1C7D5A] text-xs font-bold">
              {filteredEvents.length}
            </span>
          </div>

          <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
              <input
                type="text"
                placeholder="Search title, location, attendees..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full sm:w-64 pl-9 pr-4 py-2 bg-white border border-slate-200 text-slate-900 text-sm rounded-[8px] outline-none focus:border-[#1C7D5A] transition-all"
              />
            </div>

            <select
              value={priorityFilter}
              onChange={(e) => setPriorityFilter(e.target.value)}
              className="px-3 py-2 bg-white border border-slate-200 rounded-[8px] text-sm font-medium text-slate-700 outline-none focus:border-[#1C7D5A]"
            >
              <option value="all">All Priorities</option>
              <option value="high">High (Urgent)</option>
              <option value="medium">Medium</option>
              <option value="low">Low</option>
            </select>

            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
              className="px-3 py-2 bg-white border border-slate-200 rounded-[8px] text-sm font-medium text-slate-700 outline-none focus:border-[#1C7D5A]"
            >
              <option value="all">All Status</option>
              <option value="active">Active</option>
              <option value="planned">Planned</option>
              <option value="completed">Completed</option>
            </select>
          </div>
        </div>

        {/* Table */}
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead className="bg-[#1C7D5A18]">
              <tr>
                <th className="px-5 py-3.5 text-[12px] font-black uppercase tracking-wider text-slate-700 w-12">
                  #
                </th>
                <th className="px-5 py-3.5 text-[12px] font-black uppercase tracking-wider text-slate-700">
                  Event Title
                </th>
                <th className="px-5 py-3.5 text-[12px] font-black uppercase tracking-wider text-slate-700">
                  Date & Time
                </th>
                <th className="px-5 py-3.5 text-[12px] font-black uppercase tracking-wider text-slate-700">
                  Location
                </th>
                <th className="px-5 py-3.5 text-[12px] font-black uppercase tracking-wider text-slate-700">
                  Attendees
                </th>
                <th className="px-5 py-3.5 text-center text-[12px] font-black uppercase tracking-wider text-slate-700">
                  Priority
                </th>
                <th className="px-5 py-3.5 text-center text-[12px] font-black uppercase tracking-wider text-slate-700">
                  Status
                </th>
                <th className="px-5 py-3.5 text-center text-[12px] font-black uppercase tracking-wider text-slate-700">
                  Action
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 text-sm">
              {filteredEvents.length > 0 ? (
                filteredEvents.map((event, index) => (
                  <tr
                    key={event.id}
                    className="group hover:bg-[#1C7D5A]/5 transition-colors"
                  >
                    <td className="px-5 py-3.5 font-bold text-slate-500">
                      {index + 1}
                    </td>
                    <td className="px-5 py-3.5">
                      <button
                        type="button"
                        onClick={() => setViewEvent(event)}
                        className="text-left font-bold text-slate-800 hover:text-[#1C7D5A] transition-colors cursor-pointer"
                      >
                        {event.title}
                      </button>
                    </td>
                    <td className="px-5 py-3.5 whitespace-nowrap">
                      <div className="font-semibold text-slate-800">
                        {formatDisplayDate(event.date)}
                      </div>
                      <div className="text-xs text-slate-500 flex items-center gap-1 mt-0.5">
                        <Clock className="w-3.5 h-3.5 text-slate-400" />
                        {formatDisplayTime(event.time)}
                      </div>
                    </td>
                    <td className="px-5 py-3.5 text-slate-700 font-medium">
                      <div className="flex items-center gap-1.5">
                        <MapPin className="w-4 h-4 text-[#1C7D5A] shrink-0" />
                        <span>{event.location}</span>
                      </div>
                    </td>
                    <td className="px-5 py-3.5 text-slate-700 font-medium">
                      <div className="flex items-center gap-1.5">
                        <Users className="w-4 h-4 text-slate-400 shrink-0" />
                        <span>{event.attendees}</span>
                      </div>
                    </td>
                    <td className="px-5 py-3.5 text-center">
                      <span
                        className={`inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-[11px] font-bold uppercase tracking-wider border ${
                          PRIORITY_BADGES[event.priority] || PRIORITY_BADGES.low
                        }`}
                      >
                        {event.priority === "high" && <AlertCircle className="w-3 h-3" />}
                        {event.priority}
                      </span>
                    </td>
                    <td className="px-5 py-3.5 text-center">
                      <span
                        className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-[11px] font-bold uppercase tracking-wider border ${
                          STATUS_BADGES[event.status] || STATUS_BADGES.planned
                        }`}
                      >
                        <span
                          className={`w-1.5 h-1.5 rounded-full ${
                            event.status === "active"
                              ? "bg-emerald-500"
                              : event.status === "planned"
                              ? "bg-blue-500"
                              : "bg-slate-400"
                          }`}
                        />
                        {event.status}
                      </span>
                    </td>
                    <td className="px-5 py-3.5">
                      <div className="flex items-center justify-center gap-2">
                        <button
                          type="button"
                          title="View Details"
                          onClick={() => setViewEvent(event)}
                          className="p-1.5 text-slate-600 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition-colors cursor-pointer"
                        >
                          <Eye className="w-4 h-4" />
                        </button>
                        <button
                          type="button"
                          title="Edit / Reschedule"
                          onClick={() => openEditModal(event)}
                          className="p-1.5 text-[#1C7D5A] hover:bg-emerald-50 rounded-lg transition-colors cursor-pointer"
                        >
                          <SquarePen className="w-4 h-4" />
                        </button>
                        <button
                          type="button"
                          title="Delete Event"
                          onClick={() => setDeleteTarget(event)}
                          className="p-1.5 text-red-500 hover:bg-red-50 rounded-lg transition-colors cursor-pointer"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan="8" className="px-6 py-12 text-center text-slate-400 font-bold">
                    No events found.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Add / Edit Event Modal */}
      {isFormModalOpen && (
        <div className="fixed inset-0 bg-slate-900/40 backdrop-blur-sm z-[100] flex items-center justify-center p-4">
          <div className="bg-white rounded-xl w-full max-w-lg shadow-2xl border border-slate-200 animate-in zoom-in-95 duration-200 overflow-hidden">
            <div className="px-6 py-4 border-b border-slate-100 flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="w-9 h-9 bg-[#1C7D5A18] text-[#1C7D5A] rounded-lg flex items-center justify-center">
                  <CalendarDays className="w-5 h-5" />
                </div>
                <h2 className="text-lg font-bold text-slate-800">
                  {modalMode === "add" ? "Create New Event" : "Edit / Reschedule Event"}
                </h2>
              </div>
              <button
                type="button"
                onClick={() => setIsFormModalOpen(false)}
                className="p-1.5 text-slate-400 hover:text-slate-600 hover:bg-slate-100 rounded-lg transition-colors cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleSaveEvent} className="p-6 space-y-4">
              <div>
                <label className="text-xs font-bold text-slate-700 mb-1 block">
                  Event Title *
                </label>
                <input
                  type="text"
                  required
                  value={formData.title}
                  onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                  placeholder="e.g. Annual Sports Day"
                  className="w-full px-3.5 py-2 border border-slate-200 rounded-[8px] text-sm outline-none focus:border-[#1C7D5A]"
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="text-xs font-bold text-slate-700 mb-1 block">
                    Date *
                  </label>
                  <input
                    type="date"
                    required
                    value={formData.date}
                    onChange={(e) => setFormData({ ...formData, date: e.target.value })}
                    className="w-full px-3.5 py-2 border border-slate-200 rounded-[8px] text-sm outline-none focus:border-[#1C7D5A]"
                  />
                </div>
                <div>
                  <label className="text-xs font-bold text-slate-700 mb-1 block">
                    Time
                  </label>
                  <input
                    type="time"
                    value={formData.time}
                    onChange={(e) => setFormData({ ...formData, time: e.target.value })}
                    className="w-full px-3.5 py-2 border border-slate-200 rounded-[8px] text-sm outline-none focus:border-[#1C7D5A]"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="text-xs font-bold text-slate-700 mb-1 block">
                    Location *
                  </label>
                  <input
                    type="text"
                    required
                    value={formData.location}
                    onChange={(e) => setFormData({ ...formData, location: e.target.value })}
                    placeholder="e.g. Auditorium Hall"
                    className="w-full px-3.5 py-2 border border-slate-200 rounded-[8px] text-sm outline-none focus:border-[#1C7D5A]"
                  />
                </div>
                <div>
                  <label className="text-xs font-bold text-slate-700 mb-1 block">
                    Attendees
                  </label>
                  <input
                    type="text"
                    value={formData.attendees}
                    onChange={(e) => setFormData({ ...formData, attendees: e.target.value })}
                    placeholder="e.g. All Students"
                    className="w-full px-3.5 py-2 border border-slate-200 rounded-[8px] text-sm outline-none focus:border-[#1C7D5A]"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="text-xs font-bold text-slate-700 mb-1 block">
                    Priority
                  </label>
                  <select
                    value={formData.priority}
                    onChange={(e) => setFormData({ ...formData, priority: e.target.value })}
                    className="w-full px-3.5 py-2 border border-slate-200 rounded-[8px] text-sm outline-none focus:border-[#1C7D5A]"
                  >
                    <option value="high">High</option>
                    <option value="medium">Medium</option>
                    <option value="low">Low</option>
                  </select>
                </div>
                <div>
                  <label className="text-xs font-bold text-slate-700 mb-1 block">
                    Status
                  </label>
                  <select
                    value={formData.status}
                    onChange={(e) => setFormData({ ...formData, status: e.target.value })}
                    className="w-full px-3.5 py-2 border border-slate-200 rounded-[8px] text-sm outline-none focus:border-[#1C7D5A]"
                  >
                    <option value="planned">Planned</option>
                    <option value="active">Active</option>
                    <option value="completed">Completed</option>
                  </select>
                </div>
              </div>

              <div className="pt-3 flex items-center justify-end gap-3 border-t border-slate-100">
                <button
                  type="button"
                  onClick={() => setIsFormModalOpen(false)}
                  className="px-4 py-2 text-sm font-bold text-slate-600 hover:bg-slate-100 rounded-[8px] transition-colors cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 bg-[#1C7D5A] hover:bg-[#156347] text-white text-sm font-bold rounded-[8px] transition-colors cursor-pointer"
                >
                  {modalMode === "add" ? "Create Event" : "Save Changes"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Event Details Modal */}
      {viewEvent && (
        <div className="fixed inset-0 bg-slate-900/40 backdrop-blur-sm z-[100] flex items-center justify-center p-4">
          <div className="bg-white rounded-xl w-full max-w-md shadow-2xl border border-slate-200 animate-in zoom-in-95 duration-200 overflow-hidden">
            <div className="px-6 py-4 border-b border-slate-100 flex items-center justify-between">
              <h3 className="text-lg font-bold text-slate-800">Event Details</h3>
              <button
                type="button"
                onClick={() => setViewEvent(null)}
                className="p-1.5 text-slate-400 hover:text-slate-600 hover:bg-slate-100 rounded-lg cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>
            <div className="p-6 space-y-4 text-sm">
              <div>
                <p className="text-xs font-bold uppercase text-slate-400">Title</p>
                <p className="text-base font-bold text-slate-800 mt-0.5">{viewEvent.title}</p>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <p className="text-xs font-bold uppercase text-slate-400">Date</p>
                  <p className="font-semibold text-slate-700 mt-0.5">
                    {formatDisplayDate(viewEvent.date)}
                  </p>
                </div>
                <div>
                  <p className="text-xs font-bold uppercase text-slate-400">Time</p>
                  <p className="font-semibold text-slate-700 mt-0.5">
                    {formatDisplayTime(viewEvent.time)}
                  </p>
                </div>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <p className="text-xs font-bold uppercase text-slate-400">Location</p>
                  <p className="font-semibold text-slate-700 mt-0.5">{viewEvent.location}</p>
                </div>
                <div>
                  <p className="text-xs font-bold uppercase text-slate-400">Attendees</p>
                  <p className="font-semibold text-slate-700 mt-0.5">{viewEvent.attendees}</p>
                </div>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <p className="text-xs font-bold uppercase text-slate-400">Priority</p>
                  <span
                    className={`mt-1 inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[11px] font-bold uppercase border ${
                      PRIORITY_BADGES[viewEvent.priority] || PRIORITY_BADGES.low
                    }`}
                  >
                    {viewEvent.priority}
                  </span>
                </div>
                <div>
                  <p className="text-xs font-bold uppercase text-slate-400">Status</p>
                  <span
                    className={`mt-1 inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-[11px] font-bold uppercase border ${
                      STATUS_BADGES[viewEvent.status] || STATUS_BADGES.planned
                    }`}
                  >
                    {viewEvent.status}
                  </span>
                </div>
              </div>

              <div className="pt-3 flex justify-end gap-3 border-t border-slate-100">
                <button
                  type="button"
                  onClick={() => {
                    const target = viewEvent;
                    setViewEvent(null);
                    openEditModal(target);
                  }}
                  className="px-4 py-2 bg-[#1C7D5A] hover:bg-[#156347] text-white font-bold rounded-[8px] cursor-pointer"
                >
                  Edit Event
                </button>
                <button
                  type="button"
                  onClick={() => setViewEvent(null)}
                  className="px-4 py-2 border border-slate-200 text-slate-700 font-bold rounded-[8px] hover:bg-slate-50 cursor-pointer"
                >
                  Close
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Delete Confirmation Modal */}
      {deleteTarget && (
        <div className="fixed inset-0 bg-slate-900/40 backdrop-blur-sm z-[100] flex items-center justify-center p-4">
          <div className="bg-white rounded-xl w-full max-w-sm shadow-2xl border border-slate-200 p-6 animate-in zoom-in-95 duration-200">
            <h3 className="text-lg font-bold text-slate-800">Delete Event?</h3>
            <p className="text-sm text-slate-600 mt-2">
              Are you sure you want to delete <span className="font-bold text-slate-800">{deleteTarget.title}</span>?
            </p>
            <div className="mt-5 flex justify-end gap-3">
              <button
                type="button"
                onClick={() => setDeleteTarget(null)}
                className="px-4 py-2 text-sm font-bold text-slate-600 hover:bg-slate-100 rounded-[8px] cursor-pointer"
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={handleConfirmDelete}
                className="px-4 py-2 text-sm font-bold bg-red-600 hover:bg-red-700 text-white rounded-[8px] cursor-pointer"
              >
                Delete
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default EventsManager;
