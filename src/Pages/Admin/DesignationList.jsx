import { useState, useEffect } from "react";
import {
  Plus,
  Search,
  Trash2,
  SquarePen,
  X,
  GraduationCap
} from "lucide-react";
import axiosInstance from "../../api/axiosInstance";
import { toast } from "react-hot-toast";
import InputField from "../../components/InputField";
import SelectInputField from "../../components/SelectInputField";

const DesignationList = () => {
  const [searchTerm, setSearchTerm] = useState("");
  const [loading, setLoading] = useState(true);
  const [designations, setDesignations] = useState([]);
  
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [modalType, setModalType] = useState("add"); // "add" | "edit"
  const [selectedDesignation, setSelectedDesignation] = useState(null);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);

  const [formData, setFormData] = useState({
    name: "",
    level: "Middle",
  });

  const fetchData = async () => {
    setLoading(true);
    try {
      const response = await axiosInstance.get("/v1/designations");
      if (response.data.success) {
        setDesignations(response.data.data.map(d => ({
          ...d,
          title: d.title || d.name,
          level: d.level || "Middle",
          employeeCount: 0 
        })));
      }
    } catch (err) {
      console.error("Error fetching data:", err);
      toast.error("Failed to fetch data");
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

  const openEditModal = (desg) => {
    setSelectedDesignation(desg);
    setFormData({
      name: desg.title || "",
      level: desg.level || "Middle",
    });
    setModalType("edit");
    setIsModalOpen(true);
  };

  const openDeleteModal = (desg) => {
    setSelectedDesignation(desg);
    setIsDeleteModalOpen(true);
  };

  const handleAction = async () => {
    try {
      if (modalType === "add") {
        const response = await axiosInstance.post("/v1/designations", {
            name: formData.name,
            level: formData.level
        });
        if (response.data.success) {
          toast.success("Designation added successfully!");
          fetchData();
        }
      } else {
        const response = await axiosInstance.put(`/v1/designations/${selectedDesignation._id}`, {
            name: formData.name,
            level: formData.level
        });
        if (response.data.success) {
          toast.success("Designation updated successfully!");
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
      const response = await axiosInstance.delete(`/v1/designations/${selectedDesignation._id}`);
      if (response.data.success || response.status === 200) {
        toast.success("Designation deleted successfully!");
        fetchData();
      }
      setIsDeleteModalOpen(false);
      setSelectedDesignation(null);
    } catch (err) {
      console.error("Delete error:", err);
      toast.error("Failed to delete designation");
    }
  };

  const resetForm = () => {
    setFormData({
      name: "",
      level: "Middle",
    });
    setSelectedDesignation(null);
  };

  const filteredDesignations = Array.isArray(designations) ? designations.filter((d) =>
    d.title.toLowerCase().includes(searchTerm.toLowerCase())
  ) : [];

  return (
    <div className=" animate-in fade-in duration-500 ">
      {/* Header */}
      <div className="flex items-center justify-between mb-5 w-full">
        <div>
          <h1 className="text-[20px] font-black text-slate-800 flex items-center gap-3">
            <GraduationCap className="w-8 h-8 text-[#00315e]" />
            Designations
          </h1>
          <p className=" text-[14px] text-slate-500 font-bold mt-1">
            Manage employee designations
          </p>
        </div>

        <div className="flex flex-col md:flex-row items-center gap-3 w-full md:w-auto">
          <div className="flex items-center gap-3 w-full md:w-auto">
            <div className="relative flex-1 md:w-[300px]">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
              <input
                type="text"
                placeholder="Search by Title..."
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
            Add Designation
          </button>
        </div>
      </div>

      {/* Designation List Table */}
      <div className="bg-white rounded-[8px]  shadow-xl shadow-slate-100/50 overflow-hidden relative">
        {loading ? (
          <div className="flex-1 flex flex-col items-center justify-center py-20">
            <div className="w-12 h-12 border-4 border-[#00315e] border-t-transparent rounded-full animate-spin mb-4"></div>
            <p className="text-slate-500 font-bold">Loading designations...</p>
          </div>
        ) : filteredDesignations.length === 0 ? (
          <div className="flex-1 flex flex-col items-center justify-center py-20">
            <div className="w-16 h-16 bg-slate-50 text-slate-400 rounded-full flex items-center justify-center mb-4">
              <Search className="w-8 h-8" />
            </div>
            <p className="text-slate-500 font-bold">No designations found</p>
          </div>
        ) : (
          <div className="overflow-x-auto border border-gray-200 rounded-[8px]">
            <table className="w-full">
              <thead className="bg-[#00315e24]">
                <tr>
                  <th className="px-10 py-3.5 text-left text-[12px] font-black">
                    Role Title
                  </th>
                  <th className="px-10 py-3.5 text-center text-[12px] font-black">
                    Hierarchy Level
                  </th>
                  <th className="px-10 py-3.5 text-center text-[12px] font-black">
                    Active Staff
                  </th>
                  <th className="px-10 py-3.5 text-center text-[12px] font-black">
                    Action
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y-2 divide-slate-50">
                {filteredDesignations.map((desg) => (
                  <tr
                    key={desg._id}
                    className="group hover:bg-amber-50/10 transition-all duration-300"
                  >
                    <td className="px-10 py-3.5">
                      <span
                        onClick={() => openEditModal(desg)}
                        className="text-base font-black text-slate-800 tracking-tight cursor-pointer hover:text-[#00315e] transition-colors"
                      >
                        {desg.title}
                      </span>
                    </td>
                    <td className="px-10 py-3.5 text-center">
                      <span className="px-3 py-1 rounded-lg bg-slate-100 text-slate-500 text-xs font-bold">
                        {desg.level}
                      </span>
                    </td>
                    <td className="px-10 py-3.5 text-center">
                      <span className="text-sm font-bold text-slate-500">
                        {desg.employeeCount}
                      </span>
                    </td>
                    <td>
                      <div className="flex items-center gap-3 justify-center">
                        <button className="cursor-pointer" onClick={() => openEditModal(desg)}>
                          <SquarePen className="w-4 h-4 text-[#00315e]" />
                        </button>
                        <button className="cursor-pointer" onClick={() => openDeleteModal(desg)}>
                          <Trash2 className="w-4 h-4 text-red-500" />
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

      {/* Add/Edit Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 bg-slate-900/70 backdrop-blur-md z-[100] flex items-center justify-center p-6 sm:p-10">
          <div className="bg-white rounded-[8px] w-full max-w-lg shadow-[0_32px_64px_-16px_rgba(0,0,0,0.2)] animate-in fade-in zoom-in duration-300 overflow-hidden flex flex-col max-h-[90vh]">
            <div className="p-6 border-b-2 border-slate-100 flex items-center justify-between bg-white">
              <h2 className="text-xl font-black text-slate-800 tracking-tight">
                {modalType === "add" ? "Add New Designation" : "Update Designation"}
              </h2>
              <button
                onClick={() => setIsModalOpen(false)}
                className="p-2 hover:bg-slate-100 rounded-xl transition-all cursor-pointer"
              >
                <X className="w-5 h-5 text-slate-400" />
              </button>
            </div>

            <div className="p-5 flex flex-col gap-4">
              <InputField
                title={'Position Title'}
                placeholder={'e.g. Senior Lecturer'}
                value={formData.name}
                setValue={(val) => setFormData({ ...formData, name: val })}
              />

              <div className="p-6 border-t-2 border-slate-100 bg-slate-50 flex justify-end gap-4 mt-2.5 -mx-5 -mb-5">
                <button
                  onClick={() => setIsModalOpen(false)}
                  className="px-6 py-3 font-bold text-slate-600 hover:bg-white rounded-xl transition-all border-2 border-transparent hover:border-slate-200 cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  onClick={handleAction}
                  className="px-8 py-3 bg-[#00315e] hover:bg-blue-900 text-white font-bold rounded-[8px] shadow-lg  transition-all flex items-center gap-2 cursor-pointer"
                >
                  {modalType === "add" ? "Add Designation" : "Update Designation"}
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
                  Are you sure you want to delete designation <span className="font-bold text-slate-700">{selectedDesignation?.title}</span>?
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
                  className="flex-1 py-2 bg-red-500 text-white rounded-[8px] font-bold cursor-pointer"
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

export default DesignationList;
