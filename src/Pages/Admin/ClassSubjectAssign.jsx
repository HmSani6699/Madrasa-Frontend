import { useState, useEffect, useMemo } from "react";
import {
  Plus,
  Search,
  BookMarked,
  Filter,
  X,
  Layers,
  SquarePen
} from "lucide-react";
import axiosInstance from "../../api/axiosInstance";
import { toast } from "react-hot-toast";
import SelectInputField from "../../components/SelectInputField";

const ClassSubjectAssign = () => {
  const [searchTerm, setSearchTerm] = useState("");

  // Modal States
  const [isModalOpen, setIsModalOpen] = useState(false);

  const [classes, setClasses] = useState([]);
  const [sections, setSections] = useState([]);
  const [subjects, setSubjects] = useState([]);
  const [subjectTypes, setSubjectTypes] = useState([]);
  const [loading, setLoading] = useState(true);

  // Form States for Assignment
  const [selectedClassId, setSelectedClassId] = useState("");
  const [selectedSectionId, setSelectedSectionId] = useState("");
  const [selectedSubjects, setSelectedSubjects] = useState([]); // array of subject codes

  const fetchInitialData = async () => {
    try {
      const [classesRes, sectionsRes, subjectTypesRes] = await Promise.all([
        axiosInstance.get("/v1/classes"),
        axiosInstance.get("/v1/sections"),
        axiosInstance.get("/subject-types/v1")
      ]);
      if (classesRes.data.success) setClasses(classesRes.data.data);
      if (sectionsRes.data.success) setSections(sectionsRes.data.data);
      if (subjectTypesRes.data.success) setSubjectTypes(subjectTypesRes.data.data);
    } catch (err) {
      console.error("Error fetching initial data:", err);
    }
  };

  const fetchAssignedSubjects = async () => {
    setLoading(true);
    try {
      const response = await axiosInstance.get(`/v1/subjects`);
      if (response.data.success) {
        setSubjects(response.data.data);
      }
    } catch (err) {
      console.error("Error fetching subjects:", err);
      toast.error("Failed to fetch assigned subjects");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchInitialData();
    fetchAssignedSubjects();
  }, []);

  // Group assigned subjects by class and section
  const groupedData = useMemo(() => {
    const groups = {};
    subjects.forEach(sub => {
      const key = `${sub.class_id}_${sub.section_id || 'none'}`;
      if (!groups[key]) {
        groups[key] = {
          class_id: sub.class_id,
          className: sub.className,
          section_id: sub.section_id,
          sectionName: sub.sectionName,
          subjects: []
        };
      }
      groups[key].subjects.push(sub);
    });
    return Object.values(groups);
  }, [subjects]);

  const filteredData = useMemo(() => {
    if (!searchTerm) return groupedData;
    return groupedData.filter(g =>
      g.className?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      g.sectionName?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      g.subjects.some(s => s.name.toLowerCase().includes(searchTerm.toLowerCase()))
    );
  }, [groupedData, searchTerm]);

  // Handlers
  const openAssignModal = (group = null) => {
    if (group) {
      setSelectedClassId(group.class_id);
      setSelectedSectionId(group.section_id || "");
      setSelectedSubjects(group.subjects.map(s => s.code));
    } else {
      setSelectedClassId("");
      setSelectedSectionId("");
      setSelectedSubjects([]);
    }
    setIsModalOpen(true);
  };

  const handleSubjectToggle = (code) => {
    setSelectedSubjects(prev =>
      prev.includes(code) ? prev.filter(c => c !== code) : [...prev, code]
    );
  };

  // When class or section changes in modal, auto-load existing subjects
  useEffect(() => {
    if (isModalOpen && selectedClassId) {
      const existing = subjects.filter(s => s.class_id === selectedClassId && (s.section_id || "") === selectedSectionId);
      setSelectedSubjects(existing.map(s => s.code));
    }
  }, [selectedClassId, selectedSectionId, isModalOpen]);

  const handleAssign = async () => {
    if (!selectedClassId) {
      toast.error("Please select a class");
      return;
    }

    setLoading(true);
    try {
      const subjectsPayload = selectedSubjects.map(code => {
        const st = subjectTypes.find(t => t.code === code);
        return { name: st.name, code: st.code };
      });

      const response = await axiosInstance.post("/v1/subjects/bulk-assign", {
        class_id: selectedClassId,
        section_id: selectedSectionId,
        subjects: subjectsPayload
      });

      if (response.data.success) {
        toast.success("Subjects assigned successfully!");
        fetchAssignedSubjects();
        setIsModalOpen(false);
      }
    } catch (err) {
      console.error("Assign error:", err);
      toast.error(err.response?.data?.message || "Operation failed");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="animate-in fade-in duration-500">
      {/* Header */}
      <div className="flex items-center justify-between mb-5 w-full">
        <div>
          <h1 className="text-[20px] font-black text-slate-800 flex items-center gap-3">
            <BookMarked className="w-8 h-8 text-[#00315e]" />
            Class & Subject Assign
          </h1>
          <p className=" text-[14px] text-slate-500 font-bold mt-1">
            Assign subjects to classes and sections
          </p>
        </div>

        <div className="flex flex-col md:flex-row items-center gap-4 w-full md:w-auto">
          <div className="relative w-full md:w-auto">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
            <input
              type="text"
              placeholder="Search class, section..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-10 pr-4 py-2 bg-[#fff] border border-slate-200 text-slate-900 rounded-[8px] outline-none focus:ring-0.5 focus:ring-blue-500 transition-all"
            />
          </div>
          <button
            onClick={() => openAssignModal()}
            className="w-full md:w-auto px-4 py-2 bg-[#00315e] text-white rounded-[8px] cursor-pointer flex items-center justify-center gap-2 whitespace-nowrap"
          >
            <Plus className="w-4 h-4" />
            Assign Subjects
          </button>
        </div>
      </div>

      {/* Grouped List Table */}
      <div className="bg-white rounded-[8px]  shadow-xl shadow-slate-100/50 overflow-hidden relative">
        {loading ? (
          <div className="flex-1 flex flex-col items-center justify-center py-20">
            <div className="w-12 h-12 border-4 border-[#00315e] border-t-transparent rounded-full animate-spin mb-4"></div>
            <p className="text-slate-500 font-bold">Loading Assignments...</p>
          </div>
        ) : filteredData.length === 0 ? (
          <div className="flex-1 flex flex-col items-center justify-center py-20">
            <div className="w-16 h-16 bg-slate-50 text-slate-400 rounded-full flex items-center justify-center mb-4">
              <Search className="w-8 h-8" />
            </div>
            <p className="text-slate-500 font-bold">No assignments found</p>
          </div>
        ) : (
          <div className="overflow-x-auto border border-gray-200 rounded-[8px]">
            <table className="w-full">
              <thead className="bg-[#00315e24]">
                <tr>
                  <th className="px-10 py-3.5 text-left text-[12px] font-black">Class</th>
                  <th className="px-10 py-3.5 text-center text-[12px] font-black">Section</th>
                  <th className="px-10 py-3.5 text-left text-[12px] font-black">Subjects</th>
                  <th className="px-10 py-3.5 text-center text-[12px] font-black">Action</th>
                </tr>
              </thead>

              <tbody className="divide-y-2 divide-slate-50">
                {filteredData.map((group, idx) => (
                  <tr key={idx} className="group hover:bg-amber-50/10 transition-all duration-300">
                    <td className="px-10 py-3.5">
                      <span className="text-sm font-bold text-slate-500">
                        {group.className || "N/A"}
                      </span>
                    </td>
                    <td className="px-10 py-3.5 text-center">
                      <span className="text-sm font-bold text-slate-500">
                        {group.sectionName || "N/A"}
                      </span>
                    </td>
                    <td className="px-10 py-3.5">
                      <div className="flex flex-wrap gap-2">
                        {group.subjects.map(s => (
                          <span key={s._id} className="text-xs font-bold bg-slate-100 text-slate-600 px-2 py-1 rounded-md border border-slate-200">
                            {s.name}
                          </span>
                        ))}
                      </div>
                    </td>
                    <td>
                      <div className="flex items-center gap-3 justify-center">
                        <button className="cursor-pointer" onClick={() => openAssignModal(group)}>
                          <SquarePen className="w-4 h-4 text-[#00315e]" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* Assign Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 bg-slate-900/70 backdrop-blur-md z-[100] flex items-center justify-center p-6 sm:p-10">
          <div className="bg-white rounded-[8px] w-full max-w-2xl shadow-[0_32px_64px_-16px_rgba(0,0,0,0.2)] animate-in fade-in zoom-in duration-300 overflow-hidden flex flex-col max-h-[90vh]">
            <div className="p-5 border-b-2 border-slate-50 flex items-center justify-between bg-gradient-to-r from-white to-slate-50/50">
              <h2 className="text-[20px] font-black text-slate-800 tracking-tight">
                Assign Subjects
              </h2>
              <button
                onClick={() => setIsModalOpen(false)}
                className="p-[2px] bg-slate-100 hover:bg-red-500 text-slate-500 hover:text-white rounded-2xl transition-all active:scale-90 cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="p-5 overflow-y-auto">
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 mb-6">
                <SelectInputField
                  title={'Class'}
                  options={classes.map(c => ({ value: c._id, label: c.name }))}
                  value={selectedClassId}
                  setValue={(val) => { setSelectedClassId(val); setSelectedSectionId(""); }}
                />
                <SelectInputField
                  title={'Section'}
                  options={sections.filter(s => {
                    const cls = classes.find(c => c._id === selectedClassId);
                    return (s.class_id?._id || s.class_id) === selectedClassId || (cls && cls.section_id === s._id);
                  }).map(s => ({ value: s._id, label: s.name }))}
                  value={selectedSectionId}
                  setValue={(val) => setSelectedSectionId(val)}
                />
              </div>

              <div>
                <label className="text-[12px] font-bold text-slate-500 uppercase tracking-wider mb-2 block">
                  Select Subjects
                </label>
                {subjectTypes.length === 0 ? (
                  <p className="text-sm text-slate-400 italic">No subject types available. Please add them first in Subject Types menu.</p>
                ) : (
                  <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-3">
                    {subjectTypes.map(st => (
                      <label key={st.code} className={`flex items-center gap-3 p-3 rounded-lg border-2 cursor-pointer transition-all ${selectedSubjects.includes(st.code) ? 'border-[#00315e] bg-[#00315e]/5' : 'border-slate-100 hover:border-slate-300'}`}>
                        <input
                          type="checkbox"
                          className="w-4 h-4 text-[#00315e] rounded focus:ring-[#00315e]"
                          checked={selectedSubjects.includes(st.code)}
                          onChange={() => handleSubjectToggle(st.code)}
                        />
                        <div>
                          <p className="text-sm font-bold text-slate-700">{st.name}</p>
                          <p className="text-xs font-bold text-slate-400">{st.code}</p>
                        </div>
                      </label>
                    ))}
                  </div>
                )}
              </div>

              <div className="flex items-end justify-end gap-4 mt-8">
                <button
                  onClick={() => setIsModalOpen(false)}
                  className=" px-4 py-2 bg-red-200 text-red-700 rounded-[8px] cursor-pointer"
                >
                  Cancel
                </button>

                <button
                  onClick={handleAssign}
                  className=" px-4 py-2 bg-[#00315e] text-white rounded-[8px] cursor-pointer"
                >
                  Save Assignments
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default ClassSubjectAssign;
