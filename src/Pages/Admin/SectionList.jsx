import { useState, useEffect } from "react";
import {
  Plus,
  Search,

  Trash2,

  X,

  Shapes,

  File,
  SquarePen,
  DatabaseBackup,
} from "lucide-react";
import axiosInstance from "../../api/axiosInstance";
import { toast } from "react-hot-toast";
import InputField from "../../components/InputField";
import SelectInputField from "../../components/SelectInputField";

const SectionList = () => {
  const [loading, setLoading] = useState(true);
  const [sections, setSections] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");

  // Modal States
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [modalType, setModalType] = useState("add"); // "add" | "edit"
  const [selectedSection, setSelectedSection] = useState(null);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);

  const [classes, setClasses] = useState([]);
  const [formData, setFormData] = useState({
    name: "",
    class_id: "",
    status: "active",
  });

  const [isExportModalOpen, setIsExportModalOpen] = useState(false);

  const fetchData = async () => {
    setLoading(true);
    try {
      const [sectionRes, classRes] = await Promise.all([
        axiosInstance.get("/v1/sections"),
        axiosInstance.get("/v1/classes")
      ]);
      if (sectionRes.data.success) {
        setSections(sectionRes.data.data);
      }
      if (classRes?.data?.success) {
        setClasses(classRes.data.data);
      }
    } catch (err) {
      console.error("Error fetching sections:", err);
      toast.error("Failed to fetch sections");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  const openAddModal = () => {
    resetForm();
    setModalType("add");
    setIsModalOpen(true);
  };

  const openEditModal = (sec) => {
    setSelectedSection(sec);
    setFormData({
      name: sec.name,
      class_id: sec.class_id || "",
      status: sec.status,
    });
    setModalType("edit");
    setIsModalOpen(true);
  };

  const openDeleteModal = (sec) => {
    setSelectedSection(sec);
    setIsDeleteModalOpen(true);
  };

  const handleAction = async () => {
    try {
      if (modalType === "add") {
        const response = await axiosInstance.post("/v1/sections", formData);
        if (response.data.success) {
          toast.success("Section added successfully!");
          fetchData();
        }
      } else {
        const response = await axiosInstance.put(`/v1/sections/${selectedSection._id}`, formData);
        if (response.data.success) {
          toast.success("Section updated successfully!");
          fetchData();
        }
      }
      setIsModalOpen(false);
      resetForm();
    } catch (err) {
      console.error("Action error:", err);
      toast.error("Operation failed");
    }
  };

  const handleDelete = async () => {
    try {
      const response = await axiosInstance.delete(`/v1/sections/${selectedSection._id}`);
      if (response.data.success) {
        toast.success("Section deleted successfully!");
        fetchData();
      }
      setIsDeleteModalOpen(false);
      setSelectedSection(null);
    } catch (err) {
      console.error("Delete error:", err);
      toast.error("Failed to delete section");
    }
  };

  const resetForm = () => {
    setFormData({ name: "", class_id: "", status: "active" });
    setSelectedSection(null);
  };

  const filteredSections = sections.filter((sec) =>
    sec.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="animate-in fade-in duration-500 ">
      {/* Header */}
      <div className="flex items-center justify-between mb-5">
        <div>
          <h1 className="text-[20px] font-black text-slate-800 flex items-center gap-3">
            <Shapes className="w-8 h-8 text-[#00315e]" />
            Section Management
          </h1>
          <p className=" text-[14px] text-slate-500 font-bold mt-1">
            Manage sections and room allocations
          </p>
        </div>

        <div className="flex flex-col md:flex-row items-center gap-3 w-full md:w-auto">
          <div className="flex items-center gap-3 w-full md:w-auto">
            <div className="relative flex-1 md:w-[300px]">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
              <input
                type="text"
                placeholder="Search by Section Name..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-10 pr-4 py-2 bg-[#fff] border border-slate-200 text-slate-900 rounded-[8px] outline-none focus:ring-0.5 focus:ring-blue-500 transition-all"
              />
            </div>
          </div>
          <button
            onClick={openAddModal}
            className="px-4 py-2 bg-[#00315e] text-white rounded-[8px] cursor-pointer flex items-center gap-2 whitespace-nowrap"
          >
            <Plus className="w-4 h-4" />
            Add Section
          </button>
        </div>
      </div>

      {/* Section List Table */}
      <div className="bg-white rounded-[8px]  shadow-xl shadow-slate-100/50 overflow-hidden relative">
        {loading ? (
          <div className="flex-1 flex flex-col items-center justify-center py-20">
            <div className="w-12 h-12 border-4 border-[#00315e] border-t-transparent rounded-full animate-spin mb-4"></div>
            <p className="text-slate-500 font-bold">Loading sections...</p>
          </div>
        ) : filteredSections?.length === 0 ? (
          <div className="flex-1 flex flex-col items-center justify-center py-20">
            <div className="w-16 h-16 bg-slate-50 text-slate-400 rounded-full flex items-center justify-center mb-4">
              <Search className="w-8 h-8" />
            </div>
            <p className="text-slate-500 font-bold">No sections found</p>
          </div>
        ) : (
          <div className="overflow-x-auto border border-gray-200 rounded-[8px]">

            <table className="w-full">
              <thead className="bg-[#00315e24]">
                <tr>
                  <th className="px-10 py-3 text-left text-[12px] font-black ">
                    ID
                  </th>
                  <th className="px-10 py-3 text-center text-[12px] font-black ">
                    Section Name
                  </th>
                  <th className="px-10 py-3 text-center text-[12px] font-black ">
                    Status
                  </th>
                  <th className="px-10 py-3 text-center text-[12px] font-black ">
                    Action
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y-2 divide-slate-50">
                {filteredSections.map((sec, i) => (
                  <tr
                    key={sec._id}
                    className="group hover:bg-amber-50/10 transition-all duration-300"
                  >
                    <td className="px-10 py-3">
                      <span className=" ">
                        {i + 1}
                      </span>
                    </td>
                    <td className="px-10 py-3 text-center">
                      <span className="text-base font-black ">
                        {sec.name}
                      </span>
                    </td>


                    <td className="px-10 py-3 text-center">
                      <span
                        className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full text-[10px] font-black uppercase tracking-widest ${sec.status === "active"
                          ? "bg-blue-50 text-blue-700 border-blue-100"
                          : "bg-rose-50 text-rose-700 border-rose-100"
                          }`}
                      >
                        <div
                          className={`w-1.5 h-1.5 rounded-full ${sec.status === "active"
                            ? "bg-blue-500"
                            : "bg-rose-500"
                            }`}
                        />
                        {sec.status}
                      </span>
                    </td>
                    <td>
                      <div className="flex items-center gap-3 justify-center">
                        <button className="cursor-pointer" onClick={() => openEditModal(sec)}>
                          <SquarePen className="w-4 h-4 text-[#00315e]" />
                        </button>
                        <button className="cursor-pointer" onClick={() => openDeleteModal(sec)}>
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

      {/* Add Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 bg-slate-900/70 backdrop-blur-md z-[100] flex items-center justify-center p-6 sm:p-10">
          <div className="bg-white rounded-[8px] w-full max-w-lg shadow-[0_32px_64px_-16px_rgba(0,0,0,0.2)] animate-in fade-in zoom-in duration-300 overflow-hidden flex flex-col max-h-[90vh]">
            <div className="p-6 border-b-2 border-slate-100 flex items-center justify-between bg-white">
              <h2 className="text-xl font-black text-slate-800 tracking-tight">
                {modalType === "add" ? "Add New Section" : "Update Section"}
              </h2>
              <button
                onClick={() => setIsModalOpen(false)}
                className="p-2 hover:bg-slate-100 rounded-xl transition-all cursor-pointer"
              >
                <X className="w-5 h-5 text-slate-400" />
              </button>
            </div>

            <div className="p-5">
              <div className="flex flex-col gap-4">
                <InputField
                  title={'Section Name'}
                  value={formData.name}
                  setValue={(val) => setFormData({ ...formData, name: val })}
                  placeholder="Enter section name"
                />
                <SelectInputField
                  title={'Class'}
                  value={formData.class_id}
                  setValue={(val) => setFormData({ ...formData, class_id: val })}
                  options={[
                    { value: "", label: "Select Class (Optional)" },
                    ...classes.map(c => ({ value: c._id, label: c.name }))
                  ]}
                />
                <SelectInputField
                  title={'Status'}
                  value={formData.status}
                  setValue={(val) => setFormData({ ...formData, status: val })}
                  options={[{ value: "active", label: "Active" }, { value: "inactive", label: "Inactive" }]}
                />
              </div>

              <div className="p-6 border-t-2 border-slate-100 bg-slate-50 flex justify-end gap-4 mt-2.5 -mx-5 -mb-5 rounded-b-[8px]">
                <button
                  onClick={() => setIsModalOpen(false)}
                  className="px-6 py-3 font-bold text-slate-600 hover:bg-white rounded-xl transition-all border-2 border-transparent hover:border-slate-200 cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  onClick={handleAction}
                  className="px-8 py-3 bg-[#00315e] hover:bg-blue-900 text-white font-bold rounded-[8px] shadow-lg transition-all flex items-center gap-2 cursor-pointer"
                >
                  {modalType === "add" ? "Add Section" : "Update Section"}
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Delete Confirmation Modal */}
      {isDeleteModalOpen && (
        <div className="fixed inset-0 bg-slate-900/70 backdrop-blur-md z-[100] flex items-center justify-center p-6">
          <div className="bg-white rounded-[8px] w-full max-w-md shadow-2xl animate-in fade-in zoom-in duration-300 overflow-hidden">
            <div className="p-8 text-center space-y-6">
              <div className="w-16 h-16 bg-red-50 text-red-500 rounded-full flex items-center justify-center mx-auto">
                <Trash2 className="w-8 h-8" />
              </div>
              <div className="space-y-2">
                <h2 className="text-xl font-bold text-slate-800">Confirm Deletion</h2>
                <p className="text-slate-500">
                  Are you sure you want to delete section <span className="font-bold text-slate-700">{selectedSection?.name}</span>?
                </p>
              </div>
              <div className="flex gap-3">
                <button
                  onClick={() => setIsDeleteModalOpen(false)}
                  className="flex-1 py-2 bg-slate-100 text-slate-600 rounded-[8px] font-bold cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  onClick={handleDelete}
                  className="flex-1 py-2 bg-red-500 text-white rounded-[8px] font-bold cursor-pointerssss"
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

export default SectionList;
