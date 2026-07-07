import { useState } from "react";
import { 
  BookOpen, 
  User, 
  ChevronRight, 
  Award, 
  Star,
  BookMarked,
  Info,
  Calendar,
  LayoutDashboard,
  Search,
  Clock,
  Layers,
  File,
  Filter,
  X
} from "lucide-react";
import { useAuth } from "../../context/AuthContext";
import { toast } from "react-hot-toast";
import SelectInputField from "../../components/SelectInputField";

const GuardianSubjectList = () => {
  const { activeChild } = useAuth();
  const [searchQuery, setSearchQuery] = useState("");
  const [isExportModalOpen, setIsExportModalOpen] = useState(false);
  const [isFilterModalOpen, setIsFilterModalOpen] = useState(false);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedSubject, setSelectedSubject] = useState(null);

  const [filters, setFilters] = useState({
    type: "",
  });

  const subjects = [
    { 
      id: 1, 
      name: "Bangla", 
      code: "ARB-101", 
      teacher: "Sheikh Abdullah", 
      credits: "4.0", 
      type: "Core",
      description: "Advanced study of Arabic syntax and word construction principles.",
      progress: 90,
      attendance: "95%"
    },
    { 
      id: 2, 
      name: "Arabic", 
      code: "QRN-202", 
      teacher: "Ustad Junaid", 
      credits: "3.5", 
      type: "Practical",
      description: "Phonetic articulation and rules of recitation (Makharij).",
      progress: 75,
      attendance: "98%"
    },
    { 
      id: 3, 
      name: "English", 
      code: "FQS-301", 
      teacher: "Mufti Omar", 
      credits: "3.0", 
      type: "Core",
      description: "Comprehensive study of Shariah laws and daily application.",
      progress: 82,
      attendance: "92%"
    },
    { 
      id: 4, 
      name: "Math", 
      code: "HDT-402", 
      teacher: "Sheikh Abdullah", 
      credits: "3.0", 
      type: "Core",
      description: "Principles of Hadith narrations and verification metrics.",
      progress: 94,
      attendance: "96%"
     },
     { 
      id: 5, 
      name: "Bangla", 
      code: "ARB-101", 
      teacher: "Sheikh Abdullah", 
      credits: "4.0", 
      type: "Core",
      description: "Advanced study of Arabic syntax and word construction principles.",
      progress: 90,
      attendance: "95%"
    },
    { 
      id: 6, 
      name: "Arabic", 
      code: "QRN-202", 
      teacher: "Ustad Junaid", 
      credits: "3.5", 
      type: "Practical",
      description: "Phonetic articulation and rules of recitation (Makharij).",
      progress: 75,
      attendance: "98%"
    },
  ];

  const filteredSubjects = subjects.filter(subject => {
    const matchesSearch = subject.name.toLowerCase().includes(searchQuery.toLowerCase()) || subject.code.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesType = filters.type ? subject.type === filters.type : true;
    return matchesSearch && matchesType;
  });

  const openSyllabusModal = (subject) => {
    setSelectedSubject(subject);
    setIsModalOpen(true);
  };

  return (
    <div className="animate-in fade-in duration-500">
      {/* Header */}
      <div className="flex items-center justify-between mb-5 w-full">
        <div>
          <h1 className="text-[20px] font-black text-slate-800 flex items-center gap-3">
            <Layers className="w-8 h-8 text-[#00bd7f]" />
            Subjects
          </h1>
          <p className=" text-[14px] text-slate-500 font-bold mt-1">
            View academic subjects
          </p>
        </div>

        <div className="flex gap-3 w-full md:w-auto">
          <div className="relative">
             <button
                onClick={()=>setIsExportModalOpen(!isExportModalOpen)}
                className=" px-4 py-2 bg-[#e6f4ef] rounded-[8px] cursor-pointer flex items-center gap-2"
          >
            <File className="h-4 w-4"/>
                Export
            </button>
            
            {
              isExportModalOpen && <div className="absolute top-[50px] right-0 z-[100] whitespace-nowrap flex flex-col gap-2 bg-white border border-gray-200 p-4 rounded-[8px] shadow-lg"> 
                <button 
                  onClick={() => {
                    toast.success("Exporting as PDF...");
                    setIsExportModalOpen(false);
                  }}
                  className="hover:text-[#00bd7f] transition-colors cursor-pointer text-left"
                >  
                  Export as PDF
                </button>
                <button 
                  onClick={() => {
                    toast.success("Exporting as Excel...");
                    setIsExportModalOpen(false);
                  }}
                  className="hover:text-[#00bd7f] transition-colors cursor-pointer text-left"
                >
                  Export as Excel
                </button>
              </div>
            }
          </div>
        </div>
      </div>

      {/* Subject List Table */}
      <div className="bg-white rounded-[8px] border-2 border-slate-100 shadow-xl shadow-slate-100/50 overflow-hidden relative">
        <div className="overflow-x-auto border border-gray-200 rounded-[8px]">
          <div className="p-4 flex items-center justify-between border-b border-b-gray-200">
            <h2 className="text-[18px] font-semibold">Subject List</h2>

            <div>
              <div className="flex items-center gap-4">
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                  <input
                    type="text"
                    placeholder="Search by Name or Code..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="w-full pl-10 pr-4 py-2 bg-[#e6f4ef] border border-slate-200 text-slate-900 rounded-[8px] outline-none focus:ring-0.5 focus:ring-emerald-500 transition-all"
                  />
                </div>
                
                <div className="relative">
                   <button
                    onClick={()=>setIsFilterModalOpen(!isFilterModalOpen)}
                    className=" px-4 py-2 bg-[#e6f4ef]  rounded-[8px] cursor-pointer flex items-center gap-2"
                  >
                  <Filter className="h-4 w-4"/>  Filter
                  </button>
                  {
                    isFilterModalOpen && <div className="absolute top-[50px] right-0 z-[100] whitespace-nowrap flex flex-col gap-2 bg-white border border-gray-200 p-4 rounded-[8px] shadow-lg lg:w-[300px] w-full"> 
                      <div className="flex flex-col gap-4">
                        <SelectInputField 
                            title={'Type'}
                            options={[{ value: "Core", label: "Core" }, { value: "Practical", label: "Practical" }]}
                            value={filters.type}
                            setValue={(val) => setFilters({ ...filters, type: val })}
                        />
                      </div>
                      <div className="flex items-end justify-end gap-4 mt-2.5">
                        <button
                            onClick={() => {
                                setFilters({ type: "" });
                                setIsFilterModalOpen(false);
                            }}
                            className=" px-4 py-2 bg-[#e6f4ef]  rounded-[8px] cursor-pointer"
                        >
                            Reset
                        </button>

                        <button
                            onClick={() => setIsFilterModalOpen(false)}
                            className=" px-4 py-2 bg-[#00bd7f] text-white rounded-[8px] cursor-pointer"
                        >
                            Apply
                        </button>
                    </div>
                  </div>
                }
                </div>
              </div>
            </div>
          </div>
          <table className="w-full">
            <thead className="bg-[#e6f4ef]">
              <tr>
                <th className="px-10 py-3.5 text-left text-[12px] font-black">
                  Subject
                </th>
                <th className="px-10 py-3.5 text-center text-[12px] font-black">
                  Teacher
                </th>
                <th className="px-10 py-3.5 text-center text-[12px] font-black">
                  Type
                </th>
                <th className="px-10 py-3.5 text-center text-[12px] font-black">
                  Credits
                </th>
                <th className="px-10 py-3.5 text-center text-[12px] font-black">
                  Action
                </th>
              </tr>
            </thead>
            
            <tbody className="divide-y-2 divide-slate-50">
              {filteredSubjects.map((sub) => (
                <tr
                  key={sub.id}
                  className="group hover:bg-amber-50/10 transition-all duration-300"
                >
                  <td className="px-10 py-3.5">
                    <span className="text-sm font-bold text-slate-500">
                      {sub.name} <span className="text-xs text-slate-400">({sub.code})</span>
                    </span>
                  </td>
                  
                  <td className="px-10 py-3.5 text-center">
                    <span className="text-sm font-bold text-slate-500">
                      {sub.teacher || "N/A"}
                    </span>
                  </td>
                  
                  <td className="px-10 py-3.5 text-center">
                    <div
                      className={`inline-flex items-center gap-2 px-3 py-1 rounded-lg border transition-all ${
                        sub.type === "Core"
                          ? "bg-emerald-50 border-emerald-100 text-emerald-600"
                          : "bg-blue-50 border-blue-100 text-blue-600"
                      }`}
                    >
                      <span className="text-[10px] font-black uppercase tracking-widest">
                        {sub.type}
                      </span>
                    </div>
                  </td>
                  
                  <td className="px-10 py-3.5 text-center">
                    <span className="text-sm font-bold text-slate-500">
                      {sub.credits}
                    </span>
                  </td>
                  
                  <td>
                    <div className="flex items-center gap-3 justify-center">
                      <button 
                        onClick={() => openSyllabusModal(sub)}
                        className="cursor-pointer text-center bg-[#00bd7f] hover:bg-[#00a871] transition-colors text-white px-3 py-1.5 rounded-[6px] text-xs font-bold"
                      >
                        View Syllabus
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Syllabus Modal - Styled like Admin Add/Edit Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 bg-slate-900/70 backdrop-blur-md z-[100] flex items-center justify-center p-6 sm:p-10">
          <div className="bg-white rounded-[8px] w-full max-w-lg shadow-[0_32px_64px_-16px_rgba(0,0,0,0.2)] animate-in fade-in zoom-in duration-300 overflow-hidden flex flex-col max-h-[90vh]">
            <div className="p-5 border-b-2 border-slate-50 flex items-center justify-between bg-gradient-to-r from-white to-slate-50/50">
              <h2 className="text-[20px] font-black text-slate-800 tracking-tight">
                Subject Syllabus: {selectedSubject?.name}
              </h2>
              <button
                onClick={() => setIsModalOpen(false)}
                className="p-[2px] bg-slate-100 hover:bg-red-500 text-slate-500 hover:text-white rounded-2xl transition-all active:scale-90 cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="p-5 overflow-y-auto">
              <div className="space-y-4">
                 <div>
                    <h3 className="text-sm font-bold text-slate-500">Subject Code</h3>
                    <p className="text-lg font-black text-slate-800">{selectedSubject?.code}</p>
                 </div>
                 <div>
                    <h3 className="text-sm font-bold text-slate-500">Teacher</h3>
                    <p className="text-lg font-black text-slate-800">{selectedSubject?.teacher}</p>
                 </div>
                 <div>
                    <h3 className="text-sm font-bold text-slate-500">Description</h3>
                    <p className="text-base text-slate-600">{selectedSubject?.description}</p>
                 </div>
                 <div className="grid grid-cols-2 gap-4">
                    <div>
                        <h3 className="text-sm font-bold text-slate-500">Credits</h3>
                        <p className="text-lg font-black text-slate-800">{selectedSubject?.credits}</p>
                    </div>
                    <div>
                        <h3 className="text-sm font-bold text-slate-500">Type</h3>
                        <p className="text-lg font-black text-slate-800">{selectedSubject?.type}</p>
                    </div>
                 </div>
              </div>

              <div className="flex items-end justify-end gap-4 mt-6">
                <button
                  onClick={() => setIsModalOpen(false)}
                  className=" px-4 py-2 bg-[#e6f4ef] rounded-[8px] cursor-pointer"
                >
                  Close
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default GuardianSubjectList;
