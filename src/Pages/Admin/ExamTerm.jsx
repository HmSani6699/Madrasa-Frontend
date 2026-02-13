import { useState } from "react";
import {
  Plus,
  Search,
  Filter,
  MoreVertical,
  Calendar,
  Clock,
  Edit2,
  Trash2,
  X,
  CheckCircle2,
  AlertCircle,
  FileText
} from "lucide-react";

const ExamTerm = () => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");

  // Sample Data: Exam Terms
  const [terms, setTerms] = useState([
    {
      id: 1,
      name: "First Term Examination 2026",
      startDate: "2026-03-01",
      endDate: "2026-03-15",
      startTime: "09:00 AM",
      endTime: "12:00 PM",
      status: "Upcoming",
    },
    {
      id: 2,
      name: "Second Term Examination 2026",
      startDate: "2026-06-10",
      endDate: "2026-06-25",
      startTime: "10:00 AM",
      endTime: "01:00 PM",
      status: "Scheduled",
    },
  ]);

  const filteredTerms = terms.filter(term =>
    term.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="space-y-8 animate-in fade-in duration-500 p-6 md:p-8 bg-slate-50/50 min-h-screen">
      {/* Header Section */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6">
        <div>
          <h1 className="text-3xl font-black text-slate-800 tracking-tight">
            Exam Terms
          </h1>
          <p className="text-slate-500 font-medium mt-2">
            Manage and schedule your academic examination terms.
          </p>
        </div>
        <button
          onClick={() => setIsModalOpen(true)}
          className="group px-6 py-3 bg-[#00bd7f] text-white rounded-xl hover:bg-[#00a570] transition-all shadow-lg shadow-emerald-200 hover:shadow-emerald-300 transform hover:-translate-y-0.5 flex items-center gap-3 font-bold"
        >
          <div className="bg-white/20 rounded-lg p-1 group-hover:rotate-90 transition-transform duration-300">
            <Plus className="w-5 h-5" />
          </div>
          Create New Term
        </button>
      </div>

      {/* Stats / Quick Info Cards (Optional Addition for "Premium" feel) */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-white p-6 rounded-2xl border border-slate-100 shadow-sm hover:shadow-md transition-shadow">
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 bg-emerald-50 rounded-xl flex items-center justify-center text-[#00bd7f]">
              <FileText className="w-6 h-6" />
            </div>
            <div>
              <p className="text-slate-500 text-sm font-bold uppercase tracking-wider">Total Terms</p>
              <h3 className="text-2xl font-black text-slate-800">{terms.length}</h3>
            </div>
          </div>
        </div>
        <div className="bg-white p-6 rounded-2xl border border-slate-100 shadow-sm hover:shadow-md transition-shadow">
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 bg-blue-50 rounded-xl flex items-center justify-center text-blue-500">
              <Calendar className="w-6 h-6" />
            </div>
            <div>
              <p className="text-slate-500 text-sm font-bold uppercase tracking-wider">Upcoming</p>
              <h3 className="text-2xl font-black text-slate-800">1</h3>
            </div>
          </div>
        </div>
        <div className="bg-white p-6 rounded-2xl border border-slate-100 shadow-sm hover:shadow-md transition-shadow">
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 bg-purple-50 rounded-xl flex items-center justify-center text-purple-500">
              <CheckCircle2 className="w-6 h-6" />
            </div>
            <div>
              <p className="text-slate-500 text-sm font-bold uppercase tracking-wider">Completed</p>
              <h3 className="text-2xl font-black text-slate-800">0</h3>
            </div>
          </div>
        </div>
      </div>

      {/* Main Content Area */}
      <div className="bg-white rounded-3xl border border-slate-200 shadow-xl shadow-slate-200/50 overflow-hidden">
        {/* Toolbar */}
        <div className="p-6 border-b border-slate-100 flex flex-col sm:flex-row gap-4 justify-between items-center bg-white/50 backdrop-blur-sm">
          <div className="relative w-full sm:w-80">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400" />
            <input
              type="text"
              placeholder="Search exam names..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-12 pr-4 py-3 bg-slate-50 border border-slate-200 rounded-xl text-sm font-bold text-slate-700 placeholder:text-slate-400 focus:outline-none focus:border-[#00bd7f] focus:ring-4 focus:ring-emerald-500/10 transition-all"
            />
          </div>
          <div className="flex items-center gap-3">
             <button className="px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl text-slate-600 font-bold hover:bg-slate-100 hover:text-slate-800 transition-colors flex items-center gap-2">
              <Filter className="w-4 h-4" />
              <span>Filter</span>
            </button>
             <button className="px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl text-slate-600 font-bold hover:bg-slate-100 hover:text-slate-800 transition-colors flex items-center gap-2">
              <MoreVertical className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* Table */}
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="bg-slate-50/80 border-b border-slate-100">
                <th className="px-8 py-5 text-left text-xs font-black text-slate-400 uppercase tracking-widest">Exam Name</th>
                <th className="px-8 py-5 text-left text-xs font-black text-slate-400 uppercase tracking-widest">Schedule</th>
                <th className="px-8 py-5 text-left text-xs font-black text-slate-400 uppercase tracking-widest">Timings</th>
                <th className="px-8 py-5 text-left text-xs font-black text-slate-400 uppercase tracking-widest">Status</th>
                <th className="px-8 py-5 text-right text-xs font-black text-slate-400 uppercase tracking-widest">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {filteredTerms.map((term) => (
                <tr key={term.id} className="group hover:bg-slate-50/80 transition-colors">
                  <td className="px-8 py-6">
                    <div className="flex items-center gap-4">
                      <div className="w-10 h-10 rounded-full bg-emerald-100/50 flex items-center justify-center text-[#00bd7f] font-bold text-sm">
                        {term.name.charAt(0)}
                      </div>
                      <span className="font-bold text-slate-700 text-base">{term.name}</span>
                    </div>
                  </td>
                  <td className="px-8 py-6">
                    <div className="flex flex-col gap-1">
                      <div className="flex items-center gap-2 text-slate-600 text-sm font-medium">
                        <Calendar className="w-4 h-4 text-slate-400" />
                        <span>{term.startDate} - {term.endDate}</span>
                      </div>
                    </div>
                  </td>
                  <td className="px-8 py-6">
                    <div className="flex items-center gap-2 text-slate-600 text-sm font-medium">
                        <Clock className="w-4 h-4 text-slate-400" />
                        <span>{term.startTime} - {term.endTime}</span>
                    </div>
                  </td>
                  <td className="px-8 py-6">
                     <span className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-black uppercase tracking-wider ${
                        term.status === "active" || term.status === "Upcoming"
                          ? "bg-emerald-100 text-[#00bd7f]"
                          : "bg-slate-100 text-slate-500"
                      }`}>
                       <span className={`w-1.5 h-1.5 rounded-full ${term.status === "active" || term.status === "Upcoming" ? "bg-[#00bd7f]" : "bg-slate-400"}`}></span>
                       {term.status}
                     </span>
                  </td>
                  <td className="px-8 py-6 text-right">
                    <div className="flex items-center justify-end gap-2 ">
                      <button className="p-2 text-slate-400  rounded-lg transition-all" title="Edit">
                        <Edit2 className="w-5 h-5" />
                      </button>
                      <button className="p-2 text-slate-400 hover:text-red-500 hover:bg-red-50 rounded-lg transition-all" title="Delete">
                        <Trash2 className="w-5 h-5" />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
              {filteredTerms.length === 0 && (
                <tr>
                   <td colSpan="5" className="px-8 py-12 text-center">
                    <div className="flex flex-col items-center justify-center">
                        <div className="w-16 h-16 bg-slate-100 rounded-full flex items-center justify-center mb-4">
                            <Search className="w-8 h-8 text-slate-300" />
                        </div>
                        <h3 className="text-lg font-black text-slate-800">No exams found</h3>
                        <p className="text-slate-500 mt-1">Try adjusting your search or filters</p>
                    </div>
                   </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Modern Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <div
            className="absolute inset-0 bg-slate-900/40 backdrop-blur-sm transition-opacity"
            onClick={() => setIsModalOpen(false)}
          />
          <div className="relative w-full max-w-lg bg-white rounded-3xl shadow-2xl transform transition-all animate-in zoom-in-95 duration-200 overflow-hidden">
            <div className="p-8 border-b border-slate-100 flex items-center justify-between bg-white">
              <h2 className="text-2xl font-black text-slate-800">New Exam Term</h2>
              <button
                onClick={() => setIsModalOpen(false)}
                className="p-2 hover:bg-slate-100 rounded-full transition-colors text-slate-400 hover:text-slate-600"
              >
                <X className="w-6 h-6" />
              </button>
            </div>
            
            <div className="p-8 space-y-6">
                {/* Form Fields */}
                <div className="space-y-4">
                    <div className="space-y-2">
                        <label className="text-xs font-black text-slate-500 uppercase tracking-widest ml-1">Exam Name</label>
                        <input
                            type="text"
                            placeholder="e.g. First Term Examination 2026"
                            className="w-full px-5 py-4 bg-slate-50 border border-slate-200 rounded-2xl text-slate-800 font-bold focus:outline-none focus:border-[#00bd7f] focus:ring-4 focus:ring-emerald-500/10 transition-all placeholder:text-slate-400 placeholder:font-normal"
                        />
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                         <div className="space-y-2">
                            <label className="text-xs font-black text-slate-500 uppercase tracking-widest ml-1">Start Date</label>
                            <div className="relative">
                                <input type="date" className="w-full px-5 py-4 bg-slate-50 border border-slate-200 rounded-2xl text-slate-800 font-bold focus:outline-none focus:border-[#00bd7f] focus:ring-4 focus:ring-emerald-500/10 transition-all" />
                            </div>
                        </div>
                        <div className="space-y-2">
                            <label className="text-xs font-black text-slate-500 uppercase tracking-widest ml-1">End Date</label>
                             <div className="relative">
                                <input type="date" className="w-full px-5 py-4 bg-slate-50 border border-slate-200 rounded-2xl text-slate-800 font-bold focus:outline-none focus:border-[#00bd7f] focus:ring-4 focus:ring-emerald-500/10 transition-all" />
                            </div>
                        </div>
                    </div>
                </div>

                <div className="pt-4 flex gap-4">
                    <button
                        onClick={() => setIsModalOpen(false)}
                        className="flex-1 py-4 text-slate-600 font-black bg-slate-50 hover:bg-slate-100 rounded-2xl transition-all"
                    >
                        Cancel
                    </button>
                    <button
                        className="flex-1 py-4 bg-[#00bd7f] text-white rounded-2xl hover:bg-[#00a570] transition-all shadow-lg shadow-emerald-200 hover:shadow-emerald-300 font-bold flex items-center justify-center gap-2"
                    >
                        <CheckCircle2 className="w-5 h-5" />
                        Create Term
                    </button>
                </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default ExamTerm;
