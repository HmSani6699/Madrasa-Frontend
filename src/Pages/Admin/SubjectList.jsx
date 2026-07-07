import { useState, useEffect } from "react";
import {
  Plus,
  Search,
  BookOpen,
  Filter,
  MoreVertical,
  Edit3,
  Trash2,
  BookMarked,
  Layers,
  CheckCircle2,
  Info,
  X,
  AlertCircle,
  ShieldCheck,
  Shapes,
  ChevronDown,
  File,
  SquarePen
} from "lucide-react";
import axiosInstance from "../../api/axiosInstance";
import { toast } from "react-hot-toast";
import InputField from "../../components/InputField";
import SelectInputField from "../../components/SelectInputField";

const SubjectList = () => {
  const [searchTerm, setSearchTerm] = useState("");
  const [levelFilter, setLevelFilter] = useState("All");

  // Modal States
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [modalType, setModalType] = useState("add"); // "add" | "edit"
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);

  // Focus States
  const [selectedSubject, setSelectedSubject] = useState(null);


  const [isFilterModalOpen, setIsFilterModalOpen] = useState(false);

  // Form States
  const [formData, setFormData] = useState({
    name: "",
    code: "",
    class_id: "",
    section_id: "",
    status: "active",
  });

  const [subjects, setSubjects] = useState([]);
  const [classes, setClasses] = useState([]);
  const [sections, setSections] = useState([]);
  const [loading, setLoading] = useState(true);

  // Filter States
  const [filters, setFilters] = useState({
    class_id: "",
    section_id: "",
    status: "",
  });

  const fetchInitialData = async () => {
    try {
      const [classesRes, sectionsRes] = await Promise.all([
        axiosInstance.get("/v1/classes"),
        axiosInstance.get("/v1/sections")
      ]);
      if (classesRes.data.success) setClasses(classesRes.data.data);
      if (sectionsRes.data.success) setSections(sectionsRes.data.data);
    } catch (err) {
      console.error("Error fetching initial data:", err);
    }
  };

  const fetchSubjects = async () => {
    setLoading(true);
    try {
      const params = new URLSearchParams();
      if (searchTerm) params.append("search", searchTerm);
      if (filters.class_id) params.append("class_id", filters.class_id);
      if (filters.section_id) params.append("section_id", filters.section_id);
      if (filters.status) params.append("status", filters.status);

      const response = await axiosInstance.get(`/v1/subjects?${params.toString()}`);
      if (response.data.success) {
        setSubjects(response.data.data);
      }
    } catch (err) {
      console.error("Error fetching subjects:", err);
      toast.error("Failed to fetch subjects");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchInitialData();
  }, []);

  useEffect(() => {
    fetchSubjects();
  }, [searchTerm, filters]);

  const levels = ["All", "Primary", "Secondary", "Hifz", "Kitab"];

  // Handlers
  const openAddModal = () => {
    resetForm();
    setModalType("add");
    setIsModalOpen(true);
  };

  const openEditModal = (subject) => {
    setSelectedSubject(subject);
    setFormData({
      name: subject.name,
      code: subject.code,
      class_id: subject.class_id,
      section_id: subject.section_id || "",
      status: subject.status,
    });
    setModalType("edit");
    setIsModalOpen(true);
  };

  const openDeleteModal = (subject) => {
    setSelectedSubject(subject);
    setIsDeleteModalOpen(true);
  };

  const handleAction = async () => {
    setLoading(true);
    try {
      if (modalType === "add") {
        const response = await axiosInstance.post("/v1/subjects", formData);
        if (response.data.success) {
          toast.success("Subject added successfully!");
          fetchSubjects();
        }
      } else {
        const response = await axiosInstance.put(`/v1/subjects/${selectedSubject._id}`, formData);
        if (response.data.success) {
          toast.success("Subject updated successfully!");
          fetchSubjects();
        }
      }
      setIsModalOpen(false);
      resetForm();
    } catch (err) {
      console.error("Action error:", err);
      toast.error("Operation failed");
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async () => {
    setLoading(true);
    try {
      const response = await axiosInstance.delete(`/v1/subjects/${selectedSubject._id}`);
      if (response.data.success) {
        toast.success("Subject deleted!");
        fetchSubjects();
      }
      setIsDeleteModalOpen(false);
      setSelectedSubject(null);
    } catch (err) {
      console.error("Delete error:", err);
      toast.error("Failed to delete");
    } finally {
      setLoading(false);
    }
  };

  const resetForm = () => {
    setFormData({
      name: "",
      code: "",
      class_id: "",
      section_id: "",
      status: "active",
    });
    setSelectedSubject(null);
  };

  const [openFilter, setOpenFilter] = useState(false);


  console.log(sections);


  return (
    <div className="animate-in fade-in duration-500">
      {/* Header */}
      <div className="flex items-center justify-between mb-5 w-full">
        <div>
          <h1 className="text-[20px] font-black text-slate-800 flex items-center gap-3">
            <Layers className="w-8 h-8 text-[#00315e]" />
            Subjects
          </h1>
          <p className=" text-[14px] text-slate-500 font-bold mt-1">
            Manage academic subjects
          </p>
        </div>

        <div className="flex flex-col md:flex-row items-center gap-4 w-full md:w-auto">
          <div className="relative w-full md:w-auto">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
            <input
              type="text"
              placeholder="Search by Name or Code..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-10 pr-4 py-2 bg-[#fff] border border-slate-200 text-slate-900 rounded-[8px] outline-none focus:ring-0.5 focus:ring-blue-500 transition-all"
            />
          </div>
          <div className="relative w-full md:w-auto">
            <button
              onClick={() => setIsFilterModalOpen(!isFilterModalOpen)}
              className="px-4 py-2 w-full md:w-auto justify-center bg-white border border-slate-200 rounded-[8px] cursor-pointer flex items-center gap-2"
            >
              <Filter className="h-4 w-4" /> Filter
            </button>
            {isFilterModalOpen && (
              <div className="absolute top-[50px] right-0 z-[100] whitespace-nowrap flex flex-col gap-2 bg-white border border-gray-200 p-4 rounded-[8px] shadow-lg lg:w-[300px] w-full">
                <div className="flex flex-col gap-4">
                  <SelectInputField
                    title={'Class'}
                    options={classes.map(c => ({ value: c._id, label: c.name }))}
                    value={filters.class_id}
                    setValue={(val) => setFilters({ ...filters, class_id: val, section_id: "" })}
                  />
                  <SelectInputField
                    title={'Section'}
                    options={sections.filter(s => {
                      const cls = classes.find(c => c._id === filters.class_id);
                      return (s.class_id?._id || s.class_id) === filters.class_id || (cls && cls.section_id === s._id);
                    }).map(s => ({ value: s._id, label: s.name }))}
                    value={filters.section_id}
                    setValue={(val) => setFilters({ ...filters, section_id: val })}
                  />
                  <SelectInputField
                    title={'Status'}
                    options={[{ value: "active", label: "Active" }, { value: "inactive", label: "Inactive" }]}
                    value={filters.status}
                    setValue={(val) => setFilters({ ...filters, status: val })}
                  />
                </div>
                <div className="flex items-end justify-end gap-4 mt-2.5">
                  <button
                    onClick={() => {
                      setFilters({ class_id: "", section_id: "", status: "" });
                      setIsFilterModalOpen(false);
                    }}
                    className="px-4 py-2 bg-red-200 text-red-700 rounded-[8px] cursor-pointer"
                  >
                    Reset
                  </button>

                  <button
                    onClick={() => setIsFilterModalOpen(false)}
                    className="px-4 py-2 bg-[#00315e] text-white rounded-[8px] cursor-pointer"
                  >
                    Apply
                  </button>
                </div>
              </div>
            )}
          </div>
          <button
            onClick={openAddModal}
            className="w-full md:w-auto px-4 py-2 bg-[#00315e] text-white rounded-[8px] cursor-pointer flex items-center justify-center gap-2 whitespace-nowrap"
          >
            <Plus className="w-4 h-4" />
            Add Subject
          </button>
        </div>
      </div>

      {/* Subject List Table - Enhanced Padding & Spacing */}
      <div className="bg-white rounded-[8px] border-2 border-slate-100 shadow-xl shadow-slate-100/50 overflow-hidden relative">
        {loading ? (
          <div className="flex-1 flex flex-col items-center justify-center py-20">
            <div className="w-12 h-12 border-4 border-[#00315e] border-t-transparent rounded-full animate-spin mb-4"></div>
            <p className="text-slate-500 font-bold">Loading Subjects...</p>
          </div>
        ) : subjects.length === 0 ? (
          <div className="flex-1 flex flex-col items-center justify-center py-20">
            <div className="w-16 h-16 bg-slate-50 text-slate-400 rounded-full flex items-center justify-center mb-4">
              <Search className="w-8 h-8" />
            </div>
            <p className="text-slate-500 font-bold">No subjects found</p>
          </div>
        ) : (
          <div className="overflow-x-auto border border-gray-200 rounded-[8px]">

            <table className="w-full">
              <thead className="bg-[#00315e24]">
                <tr>
                  <th className="px-10 py-3.5 text-left text-[12px] font-black">
                    Class
                  </th>
                  <th className="px-10 py-3.5 text-center text-[12px] font-black">
                    Section
                  </th>

                  <th className="px-10 py-3.5 text-center text-[12px] font-black">
                    Subject
                  </th>
                  <th className="px-10 py-3.5 text-center text-[12px] font-black">
                    Status
                  </th>
                  <th className="px-10 py-3.5 text-center text-[12px] font-black">
                    Action
                  </th>
                </tr>
              </thead>

              <tbody className="divide-y-2 divide-slate-50">
                {subjects.map((sub) => (
                  <tr
                    key={sub._id}
                    className="group hover:bg-amber-50/10 transition-all duration-300"
                  >
                    <td className="px-10 py-3.5">
                      <span
                        onClick={() => openEditModal(sub)}
                        className="text-sm font-bold text-slate-500"
                      >
                        {sub.className || "N/A"}
                      </span>
                    </td>

                    <td className="px-10 py-3.5 text-center">
                      <span className="text-sm font-bold text-slate-500">
                        {sub.sectionName || "N/A"}
                      </span>
                    </td>
                    <td className="px-10 py-3.5 text-center">
                      <span className="text-sm font-bold text-slate-500">
                        {sub.name} <span className="text-xs text-slate-400">({sub.code})</span>
                      </span>
                    </td>


                    <td className="px-10 py-3.5 text-center">
                      <div
                        className={`inline-flex items-center gap-2 px-3 py-1 rounded-lg border transition-all ${sub.status === "active"
                          ? "bg-blue-50 border-blue-100 text-blue-700"
                          : "bg-slate-50 border-slate-100 text-slate-400"
                          }`}
                      >
                        <span className="text-[10px] font-black uppercase tracking-widest">
                          {sub.status}
                        </span>
                      </div>
                    </td>
                    <td>
                      <div className="flex items-center gap-3 justify-center">
                        <button className="cursor-pointer" onClick={() => openEditModal(sub)}>
                          <SquarePen className="w-4 w-4  text-[#00315e]" />
                        </button>
                        <button className="cursor-pointer" onClick={() => openDeleteModal(sub)}>
                          <Trash2 className="w-4 w-4 text-red-500" />
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


      {/* Add/Edit Modal - Unified & Styled */}
      {isModalOpen && (
        <div className="fixed inset-0 bg-slate-900/70 backdrop-blur-md z-[100] flex items-center justify-center p-6 sm:p-10">
          <div className="bg-white rounded-[8px] w-full max-w-lg shadow-[0_32px_64px_-16px_rgba(0,0,0,0.2)] animate-in fade-in zoom-in duration-300 overflow-hidden flex flex-col max-h-[90vh]">
            <div className="p-5 border-b-2 border-slate-50 flex items-center justify-between bg-gradient-to-r from-white to-slate-50/50">
              <h2 className="text-[20px] font-black text-slate-800 tracking-tight">
                {modalType === "add" ? "Add Subject" : "Update Subject"}
              </h2>
              <button
                onClick={() => setIsModalOpen(false)}
                className="p-[2px] bg-slate-100 hover:bg-red-500 text-slate-500 hover:text-white rounded-2xl transition-all active:scale-90 cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="p-5 ">



              <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
                <SelectInputField
                  title={'Class'}
                  options={classes.map(c => ({ value: c._id, label: c.name }))}
                  value={formData.class_id}
                  setValue={(val) => setFormData({ ...formData, class_id: val, section_id: "" })}
                />
                <SelectInputField
                  title={'Section'}
                  options={sections.filter(s => {
                    const cls = classes.find(c => c._id === formData.class_id);
                    return (s.class_id?._id || s.class_id) === formData.class_id || (cls && cls.section_id === s._id);
                  }).map(s => ({ value: s._id, label: s.name }))}
                  value={formData.section_id}
                  setValue={(val) => setFormData({ ...formData, section_id: val })}
                />

                <div className="col-span-2">
                  <InputField
                    title={'Subject Name'}
                    placeholder={'Enter subject name'}
                    value={formData.name}
                    setValue={(val) => setFormData({ ...formData, name: val })}
                  />
                </div>

                <InputField
                  title={'Subject Code'}
                  placeholder={'Enter subject code'}
                  value={formData.code}
                  setValue={(val) => setFormData({ ...formData, code: val })}
                />


                <SelectInputField
                  title={'Status'}
                  options={[{ value: "active", label: "Active" }, { value: "inactive", label: "Inactive" }]}
                  value={formData.status}
                  setValue={(val) => setFormData({ ...formData, status: val })}
                />
              </div>
              <div className="flex items-end justify-end gap-4 mt-6">
                <button
                  onClick={() => setIsModalOpen(false)}
                  className=" px-4 py-2 bg-red-200 text-red-700 rounded-[8px] cursor-pointer"
                >
                  Cancel
                </button>

                <button
                  onClick={handleAction}
                  className=" px-4 py-2 bg-[#00315e] text-white rounded-[8px] cursor-pointer"
                >
                  {modalType === "add" ? "Add Subject" : "Update Subject"}
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Delete Confirmation Modal - Styled */}
      {isDeleteModalOpen && (
        <div className="fixed inset-0 bg-slate-900/70 backdrop-blur-md z-[100] flex items-center justify-center p-6">
          <div className="bg-white rounded-[8px] w-full max-w-md shadow-2xl animate-in fade-in zoom-in duration-300 overflow-hidden">
            <div className="p-6 text-center space-y-8">
              <div className="w-15 h-15 bg-rose-50 text-rose-500 rounded-[2.5rem] flex items-center justify-center mx-auto border-4 border-white shadow-2xl shadow-rose-100 relative">
                <div className="absolute inset-0 bg-rose-500 rounded-[2.5rem] animate-ping opacity-10" />
                <AlertCircle className="w-10 h-10 relative z-10" />
              </div>
              <div className="space-y-3">
                <h2 className="text-3xl font-black text-slate-800 tracking-tight">
                  Are you sure
                </h2>
                <p className="text-sm font-bold text-slate-400 px-6 leading-relaxed">
                  আপনি কি
                  <span className="text-slate-800 font-black underline decoration-rose-500 underline-offset-4 px-[8px]">
                    {selectedSubject?.name}
                  </span>
                  বিষয়টি মুছে ফেলতে চান?
                </p>
              </div>

              <div className="flex flex-col lg:flex-row gap-4 mt-4">
                <button
                  onClick={() => setIsDeleteModalOpen(false)}
                  className="w-full py-5 font-black text-slate-400 border border-slate-200 cursor-pointer hover:bg-slate-50 rounded-[8px] transition-all uppercase tracking-widest text-[14px]"
                >
                  Cencel
                </button>{" "}
                <button
                  onClick={handleDelete}
                  className="w-full py-5 bg-rose-500 text-white font-black cursor-pointer rounded-[8px] shadow-xl shadow-rose-200 hover:bg-rose-600 active:scale-95 transition-all uppercase tracking-widest text-[14px]"
                >
                  Delete
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default SubjectList;
