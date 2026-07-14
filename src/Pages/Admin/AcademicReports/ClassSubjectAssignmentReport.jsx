import { useState } from "react";
import { BookMarked, Download, Printer, Search, Users } from "lucide-react";

const ClassSubjectAssignmentReport = () => {
  const [loading, setLoading] = useState(false);
  const [selectedClass, setSelectedClass] = useState("");

  const handleFilter = () => {
    setLoading(true);
    setTimeout(() => {
      setLoading(false);
    }, 800);
  };

  const assignmentData = [
    { className: "Class 6", section: "A", subject: "Quran", teacher: "Maulana Asad", periodsPerWeek: 6 },
    { className: "Class 6", section: "A", subject: "Arabic", teacher: "Ustad Hakim", periodsPerWeek: 5 },
    { className: "Class 6", section: "A", subject: "Math", teacher: "Mr. Hasan", periodsPerWeek: 4 },
    { className: "Class 7", section: "A", subject: "Fiqh", teacher: "Mufti Rahman", periodsPerWeek: 3 },
    { className: "Class 7", section: "B", subject: "Hadith", teacher: "Sheikh Tariq", periodsPerWeek: 4 },
    { className: "Class 8", section: "A", subject: "English", teacher: "Ms. Ayesha", periodsPerWeek: 5 },
  ];

  return (
    <div className="p-6 bg-slate-50/50 min-h-screen space-y-6 animate-in fade-in duration-500">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-black text-slate-800 flex items-center gap-3">
            <BookMarked className="w-8 h-8 text-[#00315e]" />
            Subject Assignment Report
          </h1>
          <p className="text-sm text-slate-500 font-bold mt-1">
            Overview of subject and teacher assignments across all classes
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
            <option value="">All Classes</option>
            <option value="6">Class 6</option>
            <option value="7">Class 7</option>
            <option value="8">Class 8</option>
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

      {/* Report Content */}
      <div className="bg-white rounded-xl shadow-sm border border-slate-200 overflow-hidden">
        <div className="p-6 bg-[#00315e]/5 border-b border-slate-200">
           <h2 className="text-lg font-black text-slate-800">Assignment Details</h2>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-left">
            <thead>
              <tr className="bg-slate-50 border-b border-slate-200">
                <th className="p-4 font-bold text-sm text-slate-600 w-32">Class</th>
                <th className="p-4 font-bold text-sm text-slate-600 w-24 text-center">Section</th>
                <th className="p-4 font-bold text-sm text-slate-600">Subject</th>
                <th className="p-4 font-bold text-sm text-slate-600">Assigned Teacher</th>
                <th className="p-4 font-bold text-sm text-slate-600 text-center">Periods/Week</th>
              </tr>
            </thead>
            <tbody>
              {assignmentData.map((item, index) => (
                <tr key={index} className="border-b border-slate-100 hover:bg-slate-50 transition-colors">
                  <td className="p-4 font-bold text-sm text-[#00315e]">
                    {item.className}
                  </td>
                  <td className="p-4 font-bold text-sm text-slate-600 text-center">
                    <span className="bg-slate-100 px-3 py-1 rounded-md">{item.section}</span>
                  </td>
                  <td className="p-4 font-bold text-sm text-slate-800">
                    {item.subject}
                  </td>
                  <td className="p-4">
                    <div className="flex items-center gap-2">
                       <div className="w-6 h-6 rounded-full bg-blue-100 text-[#00315e] flex items-center justify-center">
                         <Users size={12} />
                       </div>
                       <span className="font-medium text-sm text-slate-600">{item.teacher}</span>
                    </div>
                  </td>
                  <td className="p-4 font-bold text-sm text-slate-600 text-center">
                    {item.periodsPerWeek}
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

export default ClassSubjectAssignmentReport;
