import { useState } from "react";
import { ClipboardList, Download, Printer, Search, CheckCircle, Clock } from "lucide-react";

const SyllabusCoverageReport = () => {
  const [loading, setLoading] = useState(false);
  const [selectedClass, setSelectedClass] = useState("");
  const [selectedTerm, setSelectedTerm] = useState("");

  const handleFilter = () => {
    setLoading(true);
    setTimeout(() => {
      setLoading(false);
    }, 800);
  };

  const coverageData = [
    { subject: "Quran", teacher: "Maulana Asad", totalChapters: 10, completedChapters: 8, percentage: 80, status: "On Track" },
    { subject: "Arabic", teacher: "Ustad Hakim", totalChapters: 12, completedChapters: 6, percentage: 50, status: "Behind" },
    { subject: "Fiqh", teacher: "Mufti Rahman", totalChapters: 8, completedChapters: 8, percentage: 100, status: "Completed" },
    { subject: "Hadith", teacher: "Sheikh Tariq", totalChapters: 15, completedChapters: 10, percentage: 66, status: "On Track" },
    { subject: "Math", teacher: "Mr. Hasan", totalChapters: 20, completedChapters: 18, percentage: 90, status: "Ahead" },
    { subject: "English", teacher: "Ms. Ayesha", totalChapters: 12, completedChapters: 9, percentage: 75, status: "On Track" },
  ];

  return (
    <div className="p-6 bg-slate-50/50 min-h-screen space-y-6 animate-in fade-in duration-500">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-black text-slate-800 flex items-center gap-3">
            <ClipboardList className="w-8 h-8 text-[#00315e]" />
            Syllabus Coverage Report
          </h1>
          <p className="text-sm text-slate-500 font-bold mt-1">
            Track syllabus completion progress across subjects
          </p>
        </div>
        <div className="flex items-center gap-3">
          <button className="px-4 py-2 bg-white border border-slate-200 text-slate-600 rounded-lg flex items-center gap-2 hover:bg-slate-50 transition-colors font-bold text-sm">
            <Download size={18} />
            Export
          </button>
          <button className="px-4 py-2 bg-[#00315e] text-white rounded-lg flex items-center gap-2 hover:bg-[#00315e]/90 transition-colors font-bold text-sm">
            <Printer size={18} />
            Print Report
          </button>
        </div>
      </div>

      {/* Filter Section */}
      <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-sm flex flex-wrap items-center gap-4">
        <div className="flex-1 min-w-[200px]">
          <select 
            className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-lg focus:ring-2 focus:ring-[#00315e]/20 outline-none text-sm font-medium"
            value={selectedClass}
            onChange={(e) => setSelectedClass(e.target.value)}
          >
            <option value="">Select Class</option>
            <option value="6">Class 6</option>
            <option value="7">Class 7</option>
            <option value="8">Class 8</option>
          </select>
        </div>
        <div className="flex-1 min-w-[200px]">
          <select 
            className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-lg focus:ring-2 focus:ring-[#00315e]/20 outline-none text-sm font-medium"
            value={selectedTerm}
            onChange={(e) => setSelectedTerm(e.target.value)}
          >
            <option value="">Select Term</option>
            <option value="Mid Term">Mid Term</option>
            <option value="Final Term">Final Term</option>
          </select>
        </div>
        <button
          onClick={handleFilter}
          disabled={loading}
          className="px-8 py-2.5 bg-[#00315e] text-white rounded-lg font-bold text-sm hover:bg-[#00315e]/90 transition-all min-w-[120px] flex justify-center items-center gap-2"
        >
          {loading ? (
            <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
          ) : (
            <>
              <Search size={16} />
              Filter
            </>
          )}
        </button>
      </div>

      {/* Overview Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
         <div className="bg-white p-6 rounded-xl border border-slate-200 shadow-sm flex items-center gap-4">
            <div className="w-12 h-12 rounded-full bg-blue-50 text-[#00315e] flex items-center justify-center">
               <ClipboardList size={24} />
            </div>
            <div>
               <p className="text-sm font-bold text-slate-500 uppercase tracking-widest">Total Subjects</p>
               <h3 className="text-2xl font-black text-slate-800">6</h3>
            </div>
         </div>
         <div className="bg-white p-6 rounded-xl border border-slate-200 shadow-sm flex items-center gap-4">
            <div className="w-12 h-12 rounded-full bg-emerald-50 text-emerald-500 flex items-center justify-center">
               <CheckCircle size={24} />
            </div>
            <div>
               <p className="text-sm font-bold text-slate-500 uppercase tracking-widest">Completed</p>
               <h3 className="text-2xl font-black text-slate-800">1</h3>
            </div>
         </div>
         <div className="bg-white p-6 rounded-xl border border-slate-200 shadow-sm flex items-center gap-4">
            <div className="w-12 h-12 rounded-full bg-amber-50 text-amber-500 flex items-center justify-center">
               <Clock size={24} />
            </div>
            <div>
               <p className="text-sm font-bold text-slate-500 uppercase tracking-widest">In Progress</p>
               <h3 className="text-2xl font-black text-slate-800">5</h3>
            </div>
         </div>
      </div>

      {/* Report Content */}
      <div className="bg-white rounded-xl shadow-sm border border-slate-200 overflow-hidden">
        <div className="p-6 bg-[#00315e]/5 border-b border-slate-200">
           <h2 className="text-lg font-black text-slate-800">Coverage Details</h2>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-left">
            <thead>
              <tr className="bg-slate-50 border-b border-slate-200">
                <th className="p-4 font-bold text-sm text-slate-600">Subject</th>
                <th className="p-4 font-bold text-sm text-slate-600">Teacher</th>
                <th className="p-4 font-bold text-sm text-slate-600">Chapters (Done/Total)</th>
                <th className="p-4 font-bold text-sm text-slate-600 w-1/3">Progress</th>
                <th className="p-4 font-bold text-sm text-slate-600">Status</th>
              </tr>
            </thead>
            <tbody>
              {coverageData.map((item, index) => (
                <tr key={index} className="border-b border-slate-100 hover:bg-slate-50 transition-colors">
                  <td className="p-4 font-bold text-sm text-slate-800">
                    {item.subject}
                  </td>
                  <td className="p-4 font-medium text-sm text-slate-600">
                    {item.teacher}
                  </td>
                  <td className="p-4 font-bold text-sm text-slate-600">
                    {item.completedChapters} / {item.totalChapters}
                  </td>
                  <td className="p-4">
                    <div className="flex items-center gap-3">
                       <div className="flex-1 h-2 bg-slate-100 rounded-full overflow-hidden">
                         <div 
                           className={`h-full rounded-full ${
                             item.percentage === 100 ? 'bg-emerald-500' : 
                             item.percentage < 60 ? 'bg-amber-500' : 'bg-[#00315e]'
                           }`} 
                           style={{ width: `${item.percentage}%` }}
                         ></div>
                       </div>
                       <span className="text-xs font-bold text-slate-500 w-8">{item.percentage}%</span>
                    </div>
                  </td>
                  <td className="p-4">
                     <span className={`px-3 py-1 rounded-full text-xs font-bold uppercase tracking-widest ${
                       item.status === 'Completed' ? 'bg-emerald-50 text-emerald-600' :
                       item.status === 'Behind' ? 'bg-amber-50 text-amber-600' :
                       'bg-blue-50 text-[#00315e]'
                     }`}>
                       {item.status}
                     </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default SyllabusCoverageReport;
