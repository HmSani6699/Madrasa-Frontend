import { useState, useEffect } from "react";
import {
  Plus,
  Search,
  Filter,
  Download,
  Calendar,
  Clock,
  BookOpen,
  MapPin,
  MoreVertical,
  X,
  Check,
  ChevronDown,
  Edit,
  Trash2,
  ChevronLeft,
  ChevronRight,
  Loader2
} from "lucide-react";
import talimatService from "../../services/talimatService";

const ExamScheduleList = () => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isFilterOpen, setIsFilterOpen] = useState(false);
  const [schedules, setSchedules] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchSchedules();
  }, []);

  const fetchSchedules = async () => {
    try {
      setLoading(true);
      const data = await talimatService.getExams();
      setSchedules(data.data || []);
    } catch (err) {
      console.error("Failed to fetch exams", err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="space-y-6 animate-in fade-in duration-500 font-sans">
      {/* Breadcrumb & Title */}
       <div className="flex flex-col gap-2">
        <div className="flex items-center gap-2 text-sm text-slate-500">
          <span>Dashboard</span>
          <span>/</span>
          <span>Examination</span>
          <span>/</span>
          <span className="text-[#00bd7f] font-semibold">Exam Schedule</span>
        </div>
        <div className="flex justify-between items-center">
          <h1 className="text-2xl font-bold text-slate-800">Exam Schedules</h1>
          <button
            onClick={() => setIsModalOpen(true)}
            className="px-6 py-2.5 bg-[#00bd7f] text-white rounded-lg hover:bg-[#009b68] transition-all flex items-center gap-2 font-medium shadow-sm"
          >
            <Plus className="w-4 h-4" />
            Add Schedule
          </button>
        </div>
      </div>

       {/* Control Bar */}
      <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-sm flex flex-col md:flex-row justify-between gap-4 items-center">
        {/* Search */}
        <div className="relative w-full md:w-72">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
          <input
            placeholder="Search by Subject..."
            className="w-full pl-10 pr-4 py-2 bg-slate-50 border border-slate-200 rounded-lg text-sm focus:outline-none focus:border-[#00bd7f] transition-all"
          />
        </div>

        {/* Actions */}
        <div className="flex items-center gap-3 w-full md:w-auto overflow-x-auto">
          <div className="relative">
             <button
            onClick={() => setIsFilterOpen(!isFilterOpen)}
            className={`px-4 py-2 border rounded-lg text-sm font-medium flex items-center gap-2 transition-all ${isFilterOpen ? 'border-[#00bd7f] text-[#00bd7f] bg-emerald-50' : 'border-slate-200 text-slate-600 hover:bg-slate-50'}`}
          >
            <Filter className="w-4 h-4" />
            Filter
          </button>
           {/* Filter Dropdown */}
            {isFilterOpen && (
              <div className="absolute right-0 mt-2 w-72 bg-white rounded-xl shadow-xl border border-slate-100 z-20 p-4 space-y-4 animate-in fade-in slide-in-from-top-2">
                 <div className="flex justify-between items-center pb-2 border-b border-slate-100">
                  <h3 className="font-bold text-slate-800">Filter Options</h3>
                  <button onClick={() => setIsFilterOpen(false)} className="text-slate-400 hover:text-rose-500"><X className="w-4 h-4" /></button>
                </div>
                 <div className="space-y-3">
                   <div className="space-y-1">
                    <label className="text-xs font-bold text-slate-500 uppercase">Class</label>
                    <select className="w-full p-2 bg-slate-50 border border-slate-200 rounded-lg text-sm focus:border-[#00bd7f] outline-none">
                      <option>All Classes</option>
                      <option>Class 5</option>
                      <option>Class 6</option>
                    </select>
                  </div>
                  <div className="space-y-1">
                    <label className="text-xs font-bold text-slate-500 uppercase">Exam Date</label>
                    <input type="date" className="w-full p-2 bg-slate-50 border border-slate-200 rounded-lg text-sm focus:border-[#00bd7f] outline-none text-slate-500" />
                  </div>
                 </div>
                 <div className="flex gap-2 pt-2">
                  <button className="flex-1 py-2 text-xs font-bold text-slate-500 hover:bg-slate-50 rounded-lg border border-slate-200">Reset</button>
                  <button className="flex-1 py-2 text-xs font-bold text-white bg-[#00bd7f] rounded-lg shadow-md shadow-emerald-200 hover:bg-[#009b68]">Apply</button>
                </div>
              </div>
            )}
            </div>

          <button className="px-4 py-2 border border-slate-200 rounded-lg text-sm font-medium text-slate-600 hover:bg-slate-50 flex items-center gap-2">
            <Download className="w-4 h-4" />
            Export
          </button>
        </div>
      </div>

      {/* Table */}
      <div className="bg-white rounded-xl border border-slate-200 shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-[#F8F9FC] border-b border-slate-200">
              <tr>
                 <th className="px-6 py-4 text-left">
                  <input type="checkbox" className="rounded border-slate-300 text-[#00bd7f] focus:ring-[#00bd7f]" />
                </th>
                <th className="px-6 py-4 text-left text-xs font-bold text-slate-500 uppercase tracking-wider">Subject</th>
                <th className="px-6 py-4 text-left text-xs font-bold text-slate-500 uppercase tracking-wider">Exam Date</th>
                <th className="px-6 py-4 text-left text-xs font-bold text-slate-500 uppercase tracking-wider">Start Time</th>
                <th className="px-6 py-4 text-left text-xs font-bold text-slate-500 uppercase tracking-wider">End Time</th>
                <th className="px-6 py-4 text-left text-xs font-bold text-slate-500 uppercase tracking-wider">Room No</th>
                <th className="px-6 py-4 text-center text-xs font-bold text-slate-500 uppercase tracking-wider">Max Marks</th>
                 <th className="px-6 py-4 text-center text-xs font-bold text-slate-500 uppercase tracking-wider">Min Marks</th>
                <th className="px-6 py-4 text-right text-xs font-bold text-slate-500 uppercase tracking-wider">Action</th>
              </tr>
            </thead>
             <tbody className="divide-y divide-slate-100">
              {loading ? (
                <tr>
                  <td colSpan="9" className="px-6 py-10 text-center">
                    <Loader2 className="w-8 h-8 animate-spin mx-auto text-emerald-500" />
                    <p className="mt-2 text-slate-500 font-medium">Loading schedules...</p>
                  </td>
                </tr>
              ) : schedules.length === 0 ? (
                <tr>
                  <td colSpan="9" className="px-6 py-10 text-center text-slate-500">
                    No exam schedules found.
                  </td>
                </tr>
              ) : (
                schedules.map((schedule) => (
                  <tr key={schedule._id || schedule.id} className="hover:bg-slate-50/50 transition-colors">
                    <td className="px-6 py-4">
                      <input type="checkbox" className="rounded border-slate-300 text-[#00bd7f] focus:ring-[#00bd7f]" />
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-2">
                        <div className="w-8 h-8 rounded-full bg-emerald-50 flex items-center justify-center text-[#00bd7f]">
                          <BookOpen className="w-4 h-4" />
                        </div>
                        <span className="text-slate-700 font-semibold text-sm">{schedule.subject}</span>
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <span className="text-slate-600 text-sm">{schedule.date}</span>
                    </td>
                    <td className="px-6 py-4">
                      <span className="text-slate-600 text-sm">{schedule.startTime}</span>
                    </td>
                    <td className="px-6 py-4">
                      <span className="text-slate-600 text-sm">{schedule.endTime}</span>
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-2 text-slate-600 text-sm">
                        <MapPin className="w-3.5 h-3.5 text-slate-400" />
                        {schedule.room}
                      </div>
                    </td>
                    <td className="px-6 py-4 text-center">
                      <span className="bg-slate-100 text-slate-600 px-2 py-1 rounded text-xs font-bold">{schedule.maxMarks}</span>
                    </td>
                    <td className="px-6 py-4 text-center">
                      <span className="bg-slate-100 text-slate-600 px-2 py-1 rounded text-xs font-bold">{schedule.minMarks}</span>
                    </td>
                    <td className="px-6 py-4 flex justify-end gap-2">
                      <button className="p-1.5 text-slate-400 hover:text-[#00bd7f] hover:bg-emerald-50 rounded-lg transition-colors">
                        <Edit className="w-4 h-4" />
                      </button>
                      <button className="p-1.5 text-slate-400 hover:text-rose-500 hover:bg-rose-50 rounded-lg transition-colors">
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
          {/* Pagination */}
        <div className="p-4 border-t border-slate-200 flex items-center justify-between text-sm text-slate-500">
             <span>Showing 1-3 of 3 entries</span>
             <div className="flex gap-2">
                 <button className="p-1 border rounded hover:bg-slate-50"><ChevronLeft className="w-4 h-4" /></button>
                 <button className="p-1 border rounded bg-[#00bd7f] text-white border-[#00bd7f]">1</button>
                 <button className="p-1 border rounded hover:bg-slate-50"><ChevronRight className="w-4 h-4" /></button>
             </div>
        </div>
      </div>

       {/* Add Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 bg-black/40 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl w-full max-w-2xl shadow-2xl animate-in zoom-in duration-200">
            <div className="p-6 border-b border-slate-100 flex justify-between items-center">
              <h2 className="text-xl font-bold text-slate-800">Add Exam Schedule</h2>
               <button onClick={() => setIsModalOpen(false)} className="text-slate-400 hover:text-slate-600">
                <X className="w-5 h-5" />
              </button>
            </div>
            <div className="p-6 space-y-4">
                <div className="grid grid-cols-2 gap-4">
                     <div className="space-y-1.5">
                        <label className="text-sm font-semibold text-slate-700">Exam Name</label>
                         <select className="w-full px-4 py-2.5 rounded-lg border border-slate-200 focus:border-[#00bd7f] outline-none bg-white text-sm">
                            <option>First Term 2026</option>
                         </select>
                     </div>
                     <div className="space-y-1.5">
                        <label className="text-sm font-semibold text-slate-700">Class</label>
                         <select className="w-full px-4 py-2.5 rounded-lg border border-slate-200 focus:border-[#00bd7f] outline-none bg-white text-sm">
                            <option>Select Class</option>
                         </select>
                     </div>
                     <div className="space-y-1.5">
                        <label className="text-sm font-semibold text-slate-700">Section</label>
                         <select className="w-full px-4 py-2.5 rounded-lg border border-slate-200 focus:border-[#00bd7f] outline-none bg-white text-sm">
                            <option>Select Section</option>
                         </select>
                     </div>
                     <div className="space-y-1.5">
                        <label className="text-sm font-semibold text-slate-700">Subject</label>
                          <select className="w-full px-4 py-2.5 rounded-lg border border-slate-200 focus:border-[#00bd7f] outline-none bg-white text-sm">
                            <option>Select Subject</option>
                         </select>
                     </div>
                     <div className="space-y-1.5">
                        <label className="text-sm font-semibold text-slate-700">Exam Date</label>
                         <input type="date" className="w-full px-4 py-2.5 rounded-lg border border-slate-200 focus:border-[#00bd7f] outline-none text-sm text-slate-500" />
                     </div>
                     <div className="space-y-1.5">
                        <label className="text-sm font-semibold text-slate-700">Room No</label>
                        <input className="w-full px-4 py-2.5 rounded-lg border border-slate-200 focus:border-[#00bd7f] outline-none text-sm" placeholder="e.g. 101" />
                     </div>
                      <div className="space-y-1.5">
                        <label className="text-sm font-semibold text-slate-700">Max Marks</label>
                        <input type="number" className="w-full px-4 py-2.5 rounded-lg border border-slate-200 focus:border-[#00bd7f] outline-none text-sm" placeholder="100" />
                     </div>
                      <div className="space-y-1.5">
                        <label className="text-sm font-semibold text-slate-700">Min Marks</label>
                        <input type="number" className="w-full px-4 py-2.5 rounded-lg border border-slate-200 focus:border-[#00bd7f] outline-none text-sm" placeholder="40" />
                     </div>
                </div>
            </div>
             <div className="p-6 border-t border-slate-100 flex justify-end gap-3 bg-slate-50 rounded-b-2xl">
              <button 
                onClick={() => setIsModalOpen(false)}
                className="px-6 py-2.5 rounded-lg border border-slate-200 text-slate-600 font-medium hover:bg-white transition-all text-sm"
              >
                Cancel
              </button>
              <button className="px-6 py-2.5 rounded-lg bg-[#00bd7f] text-white font-medium hover:bg-[#009b68] shadow-lg shadow-emerald-200 transition-all text-sm flex items-center gap-2">
                <Check className="w-4 h-4" />
                Add Schedule
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default ExamScheduleList;
