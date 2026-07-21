import { useState, useEffect } from "react";
import { ClipboardList, Download, Search, CheckCircle, Clock, Filter, X } from "lucide-react";
import axiosInstance from "../../../api/axiosInstance";

const SyllabusCoverageReport = () => {
  const [loading, setLoading] = useState(false);
  const [selectedClass, setSelectedClass] = useState("");
  const [selectedExam, setSelectedExam] = useState("");
  const [isFilterModalOpen, setIsFilterModalOpen] = useState(false);
  const [classes, setClasses] = useState([]);
  const [exams, setExams] = useState([]);
  const [showReport, setShowReport] = useState(false);

  useEffect(() => {
    const fetchDropdowns = async () => {
      try {
        const [classRes, examRes] = await Promise.all([
          axiosInstance.get("/v1/classes").catch(() => ({ data: { data: [] } })),
          axiosInstance.get("/v1/exam-names").catch(() => ({ data: { data: [] } }))
        ]);
        
        if (classRes.data?.data) setClasses(classRes.data.data);
        if (examRes.data?.data) setExams(examRes.data.data);
      } catch (err) {
        console.error("Error fetching dropdowns:", err);
      }
    };
    fetchDropdowns();
  }, []);

  const handleFilter = () => {
    setLoading(true);
    setTimeout(() => {
      setLoading(false);
      setIsFilterModalOpen(false);
      setShowReport(true);
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
    <div className="min-h-screen space-y-6 animate-in fade-in duration-500">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-black text-slate-800 flex items-center gap-3">
            <ClipboardList className="w-8 h-8 text-[#00315e]" />
            Syllabus Coverage Report
          </h1>
          <div className="flex items-center gap-2 text-sm text-slate-500 font-bold mt-1">
            <span className="hover:text-[#00315e] cursor-pointer transition-colors">Dashboard</span>
            <span>/</span>
            <span className="hover:text-[#00315e] cursor-pointer transition-colors">Academic Reports</span>
            <span>/</span>
            <span className="text-slate-800">Syllabus Coverage</span>
          </div>
        </div>
        <div className="flex items-center gap-3">
          {showReport && (
            <button className="px-4 py-2 bg-white border border-slate-200 text-slate-600 rounded-lg flex items-center gap-2 hover:bg-slate-50 transition-colors font-bold text-sm cursor-pointer">
              <Download size={18} />
              Export
            </button>
          )}
          <div className="relative">
            <button
              onClick={() => setIsFilterModalOpen(!isFilterModalOpen)}
              className="px-4 py-2 bg-[#00315e] text-white rounded-lg flex items-center gap-2 hover:bg-[#00315e]/90 transition-colors font-bold text-sm cursor-pointer"
            >
              <Filter size={18} />
              Filter
            </button>

            {isFilterModalOpen && (
              <div className="absolute top-[50px] right-0 z-[100] w-[300px] flex flex-col gap-4 bg-white border border-gray-200 p-4 rounded-[8px] shadow-lg animate-in fade-in zoom-in-95 duration-200">
                <div className="flex items-center justify-between border-b border-slate-100 pb-2">
                  <h3 className="font-bold text-slate-700">Filter Report</h3>
                  <button onClick={() => setIsFilterModalOpen(false)} className="text-slate-400 hover:text-slate-600 cursor-pointer">
                    <X size={16} />
                  </button>
                </div>

                <div className="space-y-1">
                  <label className="text-xs font-bold text-slate-600">Class</label>
                  <select
                    className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-lg focus:ring-1 focus:ring-[#00315e] outline-none text-sm"
                    value={selectedClass}
                    onChange={(e) => setSelectedClass(e.target.value)}
                  >
                    <option value="">All Classes</option>
                    {classes.map(c => (
                      <option key={c._id} value={c._id}>{c.name}</option>
                    ))}
                  </select>
                </div>

                <div className="space-y-1">
                  <label className="text-xs font-bold text-slate-600">Exam</label>
                  <select
                    className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-lg focus:ring-1 focus:ring-[#00315e] outline-none text-sm"
                    value={selectedExam}
                    onChange={(e) => setSelectedExam(e.target.value)}
                  >
                    <option value="">All Exams</option>
                    {exams.map(e => (
                      <option key={e._id} value={e._id}>{e.name}</option>
                    ))}
                  </select>
                </div>

                <div className="flex items-center gap-2 mt-2">
                  <button
                    onClick={() => setIsFilterModalOpen(false)}
                    className="w-full py-2 bg-slate-100 text-slate-600 rounded-lg font-bold text-sm hover:bg-slate-200 transition-all flex justify-center items-center cursor-pointer"
                  >
                    Cancel
                  </button>
                  <button
                    onClick={handleFilter}
                    disabled={loading}
                    className="w-full py-2 bg-[#00315e] text-white rounded-lg font-bold text-sm hover:bg-[#00315e]/90 transition-all flex justify-center items-center gap-2 cursor-pointer"
                  >
                    {loading ? (
                      <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                    ) : (
                      <>
                        <Search size={16} />
                        Apply
                      </>
                    )}
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>

      {showReport ? (
        <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-700">
          {/* Overview Cards */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="bg-white rounded-[8px] p-5 flex items-center justify-between shadow-lg relative overflow-hidden group">
              <div className="absolute -top-[5%] -left-[20%] h-[200px] w-[200px] bg-[#00315e24] rounded-full group-hover:scale-110 transition-transform duration-500"></div>
              <div className="z-[10]">
                <p className="text-2xl font-black text-slate-800 mb-1">6</p>
                <p className="text-xs font-bold text-slate-500 uppercase ">Total Subjects</p>
              </div>
              <div className="w-12 h-12 bg-blue-100 rounded-xl flex items-center justify-center z-[10]">
                <ClipboardList className="w-6 h-6 text-blue-600" />
              </div>
            </div>
            <div className="bg-white rounded-[8px] p-5 flex items-center justify-between shadow-lg relative overflow-hidden group">
              <div className="absolute -top-[5%] -left-[20%] h-[200px] w-[200px] bg-[#00315e24] rounded-full group-hover:scale-110 transition-transform duration-500"></div>
              <div className="z-[10]">
                <p className="text-2xl font-black text-slate-800 mb-1">1</p>
                <p className="text-xs font-bold text-slate-500 uppercase ">Completed</p>
              </div>
              <div className="w-12 h-12 bg-emerald-100 rounded-xl flex items-center justify-center z-[10]">
                <CheckCircle className="w-6 h-6 text-emerald-600" />
              </div>
            </div>
            <div className="bg-white rounded-[8px] p-5 flex items-center justify-between shadow-lg relative overflow-hidden group">
              <div className="absolute -top-[5%] -left-[20%] h-[200px] w-[200px] bg-[#00315e24] rounded-full group-hover:scale-110 transition-transform duration-500"></div>
              <div className="z-[10]">
                <p className="text-2xl font-black text-slate-800 mb-1">5</p>
                <p className="text-xs font-bold text-slate-500 uppercase ">In Progress</p>
              </div>
              <div className="w-12 h-12 bg-amber-100 rounded-xl flex items-center justify-center z-[10]">
                <Clock className="w-6 h-6 text-amber-600" />
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
                              className={`h-full rounded-full ${item.percentage === 100 ? 'bg-emerald-500' :
                                item.percentage < 60 ? 'bg-amber-500' : 'bg-[#00315e]'
                                }`}
                              style={{ width: `${item.percentage}%` }}
                            ></div>
                          </div>
                          <span className="text-xs font-bold text-slate-500 w-8">{item.percentage}%</span>
                        </div>
                      </td>
                      <td className="p-4">
                        <span className={`px-3 py-1 rounded-full text-xs font-bold uppercase tracking-widest ${item.status === 'Completed' ? 'bg-emerald-50 text-emerald-600' :
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
      ) : (
        <div className="flex flex-col items-center justify-center py-24 px-4 bg-white/60 backdrop-blur-md border border-blue-100 rounded-3xl shadow-sm border-dashed">
          <div className="relative group">
            <div className="absolute -inset-2 bg-gradient-to-r from-blue-400 to-[#00315e] rounded-full blur opacity-25 group-hover:opacity-40 transition-opacity duration-500 animate-pulse"></div>
            <div className="relative w-24 h-24 bg-white border border-blue-50 rounded-full flex items-center justify-center shadow-lg transform group-hover:scale-105 transition-transform duration-500">
              <ClipboardList className="w-10 h-10 text-[#00315e]" />
            </div>
          </div>
          <h3 className="mt-6 text-xl font-black bg-clip-text text-transparent bg-gradient-to-r from-[#00315e] to-blue-600 text-center">
            সিলেবাস রিপোর্ট
          </h3>
          <div className="mt-3 flex items-center gap-2 bg-blue-50/80 px-4 py-2.5 rounded-xl border border-blue-100">
            <Filter className="w-4 h-4 text-blue-500" />
            <p className="text-sm font-bold text-slate-600 text-center">
              বিস্তারিত রিপোর্ট দেখতে <span className="text-[#00315e]">ক্লাস</span> এবং <span className="text-[#00315e]">পরীক্ষা</span> নির্বাচন করে ফিল্টার করুন
            </p>
          </div>
        </div>
      )}

    </div>
  );
};

export default SyllabusCoverageReport;
