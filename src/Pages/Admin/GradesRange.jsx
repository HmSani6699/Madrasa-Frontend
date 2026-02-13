import { useState } from "react";
import {
  Plus,
  Search,
  Filter,
  Download,
  Award,
  ChevronDown,
  X,
  Edit,
  Trash2,
  ChevronLeft,
  ChevronRight,
  Check
} from "lucide-react";

const GradesRange = () => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isFilterOpen, setIsFilterOpen] = useState(false);

  // Sample Data: Grade Scales
  const [grades, setGrades] = useState([
    { id: 1, name: "A+", gradePoint: "5.00", markFrom: 80, markTo: 100, comment: "Outstanding" },
    { id: 2, name: "A", gradePoint: "4.00", markFrom: 70, markTo: 79, comment: "Excellent" },
    { id: 3, name: "A-", gradePoint: "3.50", markFrom: 60, markTo: 69, comment: "Very Good" },
    { id: 4, name: "B", gradePoint: "3.00", markFrom: 50, markTo: 59, comment: "Good" },
    { id: 5, name: "C", gradePoint: "2.00", markFrom: 40, markTo: 49, comment: "Average" },
  ]);

  return (
    <div className="space-y-6 animate-in fade-in duration-500 font-sans">
      {/* Breadcrumb & Title */}
       <div className="flex flex-col gap-2">
        <div className="flex items-center gap-2 text-sm text-slate-500">
          <span>Dashboard</span>
          <span>/</span>
          <span>Examination</span>
          <span>/</span>
          <span className="text-[#00bd7f] font-semibold">Grade</span>
        </div>
        <div className="flex justify-between items-center">
          <h1 className="text-2xl font-bold text-slate-800">Grade List</h1>
          <button
            onClick={() => setIsModalOpen(true)}
            className="px-6 py-2.5 bg-[#00bd7f] text-white rounded-lg hover:bg-[#009b68] transition-all flex items-center gap-2 font-medium shadow-sm"
          >
            <Plus className="w-4 h-4" />
            Add Grade
          </button>
        </div>
      </div>

       {/* Control Bar */}
      <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-sm flex flex-col md:flex-row justify-between gap-4 items-center">
        {/* Search */}
        <div className="relative w-full md:w-72">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
          <input
            placeholder="Search..."
            className="w-full pl-10 pr-4 py-2 bg-slate-50 border border-slate-200 rounded-lg text-sm focus:outline-none focus:border-[#00bd7f] transition-all"
          />
        </div>

        {/* Actions */}
        <div className="flex items-center gap-3 w-full md:w-auto overflow-x-auto">
          <button className="px-4 py-2 border border-slate-200 rounded-lg text-sm font-medium text-slate-600 hover:bg-slate-50 flex items-center gap-2">
            <Filter className="w-4 h-4" />
            Filter
          </button>
          
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
                <th className="px-6 py-4 text-left text-xs font-bold text-slate-500 uppercase tracking-wider">Grade Name</th>
                <th className="px-6 py-4 text-left text-xs font-bold text-slate-500 uppercase tracking-wider">Grade Point</th>
                <th className="px-6 py-4 text-left text-xs font-bold text-slate-500 uppercase tracking-wider">Mark From</th>
                <th className="px-6 py-4 text-left text-xs font-bold text-slate-500 uppercase tracking-wider">Mark To</th>
                <th className="px-6 py-4 text-left text-xs font-bold text-slate-500 uppercase tracking-wider">Comment</th>
                <th className="px-6 py-4 text-right text-xs font-bold text-slate-500 uppercase tracking-wider">Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {grades.map((grade) => (
                <tr key={grade.id} className="hover:bg-slate-50/50 transition-colors">
                  <td className="px-6 py-4">
                    <input type="checkbox" className="rounded border-slate-300 text-[#00bd7f] focus:ring-[#00bd7f]" />
                  </td>
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-2">
                        <div className="w-8 h-8 rounded-full bg-emerald-50 flex items-center justify-center font-bold text-[#00bd7f]">
                            {grade.name}
                        </div>
                    </div>
                  </td>
                  <td className="px-6 py-4">
                     <span className="text-slate-700 font-semibold text-sm">{grade.gradePoint}</span>
                  </td>
                  <td className="px-6 py-4">
                    <span className="text-slate-600 text-sm">{grade.markFrom}%</span>
                  </td>
                   <td className="px-6 py-4">
                    <span className="text-slate-600 text-sm">{grade.markTo}%</span>
                  </td>
                  <td className="px-6 py-4">
                     <span className="text-slate-600 text-sm italic">{grade.comment}</span>
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
              ))}
            </tbody>
          </table>
        </div>
          {/* Pagination */}
        <div className="p-4 border-t border-slate-200 flex items-center justify-between text-sm text-slate-500">
             <span>Showing 1-5 of 5 entries</span>
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
          <div className="bg-white rounded-2xl w-full max-w-lg shadow-2xl animate-in zoom-in duration-200">
             <div className="p-6 border-b border-slate-100 flex justify-between items-center">
              <h2 className="text-xl font-bold text-slate-800">Add Grade</h2>
               <button onClick={() => setIsModalOpen(false)} className="text-slate-400 hover:text-slate-600">
                <X className="w-5 h-5" />
              </button>
            </div>
            <div className="p-6 space-y-4">
               <div className="space-y-1.5">
                    <label className="text-sm font-semibold text-slate-700">Grade Name <span className="text-rose-500">*</span></label>
                    <input className="w-full px-4 py-2.5 rounded-lg border border-slate-200 focus:border-[#00bd7f] outline-none text-sm" placeholder="e.g. A+" />
               </div>
               <div className="space-y-1.5">
                    <label className="text-sm font-semibold text-slate-700">Grade Point <span className="text-rose-500">*</span></label>
                    <input className="w-full px-4 py-2.5 rounded-lg border border-slate-200 focus:border-[#00bd7f] outline-none text-sm" placeholder="e.g. 5.00" />
               </div>
                <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-1.5">
                        <label className="text-sm font-semibold text-slate-700">Mark From</label>
                        <input type="number" className="w-full px-4 py-2.5 rounded-lg border border-slate-200 focus:border-[#00bd7f] outline-none text-sm" placeholder="80" />
                    </div>
                     <div className="space-y-1.5">
                        <label className="text-sm font-semibold text-slate-700">Mark To</label>
                        <input type="number" className="w-full px-4 py-2.5 rounded-lg border border-slate-200 focus:border-[#00bd7f] outline-none text-sm" placeholder="100" />
                    </div>
                </div>
                 <div className="space-y-1.5">
                    <label className="text-sm font-semibold text-slate-700">Comment</label>
                    <textarea className="w-full px-4 py-2.5 rounded-lg border border-slate-200 focus:border-[#00bd7f] outline-none text-sm" placeholder="e.g. Outstanding" rows="3"></textarea>
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
                Save Grade
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default GradesRange;
