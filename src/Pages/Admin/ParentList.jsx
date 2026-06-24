import { useState, useMemo, useEffect, useCallback } from "react";
import { Link, useNavigate } from "react-router-dom";
import {
  Search,
  Filter,
  Download,
  Eye,
  Plus,
  Users,
  CheckCircle,
  XCircle,
  MoreVertical,
  Phone,
  Mail,
  MapPin,
  Calendar,
  Contact,
  X,
  Edit2,
  Trash2,
  UserCheck,
  MessageCircle,
  ChevronLeft,
  ChevronRight,
  Briefcase,
  AlertTriangle,
  FileText,
  Upload,
  ImagePlus,
  SquarePen,
} from "lucide-react";
import SelectInputField from "../../components/SelectInputField";
import axiosInstance from "../../api/axiosInstance";
import { toast } from "react-hot-toast";

const ParentList = () => {
  const [parents, setParents] = useState([]);
  const [loading, setLoading] = useState(false);
  const [totalRecords, setTotalRecords] = useState(0);

  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [openMenuId, setOpenMenuId] = useState(null);
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 10;
  const navigate = useNavigate();

  // New states for Action UI
  const [showAddModal, setShowAddModal] = useState(false);
  const [editParent, setEditParent] = useState(null);
  const [viewParent, setViewParent] = useState(null);
  const [deleteParent, setDeleteParent] = useState(null);
  const [showStatusToast, setShowStatusToast] = useState(null);
  const [isFilterOpen, setIsFilterOpen] = useState(false)

  // Close menu when clicking elsewhere
  const handleClickOutside = () => setOpenMenuId(null);
  useEffect(() => {
    window.addEventListener("click", handleClickOutside);
    return () => window.removeEventListener("click", handleClickOutside);
  }, []);

  // Action Handlers
  const handleAction = (label, parent) => {
    setOpenMenuId(null);
    if (label === "Edit Info") {
      setEditParent(parent);
    } else if (label === "Delete Record") {
      setDeleteParent(parent);
    } else if (label === "Change Status") {
      const newStatus = parent.status === "active" ? "inactive" : "active";
      setParents((prev) =>
        prev.map((p) => (p.id === parent.id ? { ...p, status: newStatus } : p))
      );
      setShowStatusToast(`${parent.name}'s status changed to ${newStatus}`);
      setTimeout(() => setShowStatusToast(null), 3000);
    } else if (label === "Message") {
      setShowStatusToast(
        `Direct messaging feature for ${parent.name} coming soon!`
      );
      setTimeout(() => setShowStatusToast(null), 3000);
    }
  };

  const handleExport = () => {
    setShowStatusToast("Generating Parent Directory export (CSV)...");
    setTimeout(() => {
      setShowStatusToast("Export complete! Check your downloads.");
    }, 2000);
  };

  const fetchParents = useCallback(async () => {
    setLoading(true);
    try {
      const response = await axiosInstance.get(`/v1/parents?page=${currentPage}&limit=${itemsPerPage}&search=${searchTerm}`);
      if (response.data.success) {
        // Map backend fields to frontend table expectations cleanly
        const mappedData = response.data.data.map(p => ({
          ...p,
          id: p._id,
          name: p.fatherName || p.motherName || "N/A",
          occupation: p.fatherOccupation || p.motherOccupation || "N/A",
          phone: p.contact || "N/A",
          email: p.email || "N/A",
          address: p.address || "N/A",
          status: p.status || "active",
          childrenCount: p.childrenCount || 0,
          children: p.children || [],
          photo: p.fatherPhoto || p.motherPhoto || `https://api.dicebear.com/7.x/avataaars/svg?seed=${p._id}`
        }));
        setParents(mappedData);
        setTotalRecords(response.data.total || mappedData.length);
      }
    } catch (err) {
      console.error("Failed to fetch parents:", err);
      toast.error("Failed to fetch parents from server.");
    } finally {
      setLoading(false);
    }
  }, [currentPage, searchTerm, itemsPerPage]);

  useEffect(() => {
    fetchParents();
  }, [fetchParents]);

  // Handle Search Debounce (Optional but good practice)
  const handleSearchChange = (e) => {
    setSearchTerm(e.target.value);
    setCurrentPage(1);
  };

  const handleSaveNew = async (newParentData) => {
    try {
      setLoading(true);
      const payload = {
        fatherName: newParentData.fatherName,
        motherName: newParentData.motherName || "Not Provided", // Assuming mother name might be required by backend sometimes
        fatherOccupation: newParentData.fatherOccupation,
        motherOccupation: newParentData.motherOccupation,
        contact: newParentData.contact,
        motherContact: newParentData.motherContact,
        email: newParentData.email,
        address: newParentData.address,
        fatherPhoto: newParentData.fatherPhoto,
        motherPhoto: newParentData.motherPhoto,
        guardianNID: newParentData.guardianNID,
      };
      const response = await axiosInstance.post("/v1/parents", payload);
      if (response.data.success) {
        setShowAddModal(false);
        toast.success("Parent added successfully!");
        fetchParents();
      }
    } catch (err) {
      toast.error(err.response?.data?.message || err.response?.data?.error || "Failed to create parent");
    } finally {
      setLoading(false);
    }
  };

  const handleUpdate = async (updatedData) => {
    try {
      setLoading(true);
      const payload = {
        fatherName: updatedData.fatherName,
        motherName: updatedData.motherName || "Not Provided",
        fatherOccupation: updatedData.fatherOccupation,
        motherOccupation: updatedData.motherOccupation,
        contact: updatedData.contact,
        motherContact: updatedData.motherContact,
        email: updatedData.email,
        address: updatedData.address,
        fatherPhoto: updatedData.fatherPhoto,
        motherPhoto: updatedData.motherPhoto,
        guardianNID: updatedData.guardianNID,
      };
      const response = await axiosInstance.put(`/v1/parents/${updatedData.id}`, payload);
      if (response.data.success) {
        setEditParent(null);
        toast.success("Parent updated successfully!");
        fetchParents();
      }
    } catch (err) {
      toast.error(err.response?.data?.message || err.response?.data?.error || "Failed to update parent");
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async () => {
    try {
      setLoading(true);
      const response = await axiosInstance.delete(`/v1/parents/${deleteParent.id}`);
      if (response.data.success) {
        setDeleteParent(null);
        toast.success("Parent removed successfully!");
        fetchParents();
      }
    } catch (err) {
      toast.error(err.response?.data?.message || err.response?.data?.error || "Failed to delete parent");
    } finally {
      setLoading(false);
    }
  };

  // Filtered Results
  const filteredParents = useMemo(() => {
    return parents.filter((parent) => {
      const matchesStatus =
        statusFilter === "all" || parent.status === statusFilter;

      return matchesStatus; // Search is handled by backend API now
    });
  }, [statusFilter, parents]);

  // Pagination Logic
  const totalPages = Math.ceil(totalRecords / itemsPerPage);
  const currentParents = filteredParents; // Items are already paginated by backend

  // Reset to page 1 on search/filter change
  useEffect(() => {
    setCurrentPage(1);
  }, [searchTerm, statusFilter]);

  return (
    <div className="space-y-6 sm:space-y-8 animate-in fade-in duration-500 ">

      {/* Header */}
      <div className="flex items-center justify-between mb-5 w-full">
        <div>
          <h1 className="text-[20px] font-black text-slate-800 flex items-center gap-3">
            <Users className="w-8 h-8 text-[#00bd7f]" />
            Parents Management
          </h1>
        </div>

        <div className="flex gap-3  ">

          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
            <input
              type="text"
              placeholder="Search by ID, Name or Phone..."
              value={searchTerm}
              onChange={handleSearchChange}
              className="w-full pl-10 pr-4 py-2 bg-[#e6f4ef] border-1 border-slate-200 text-slate-900 rounded-[8px] outline-none focus:ring-1 focus:ring-emerald-500 transition-all"
            />
          </div>




          <div className="relative">
            <button
              onClick={() => setIsFilterOpen(!isFilterOpen)}
              className=" px-4 py-2 bg-[#e6f4ef]  rounded-[8px] cursor-pointer flex items-center gap-2"
            >
              <Filter className="h-4 w-4" />  Filter
            </button>

            {
              isFilterOpen && <div className="absolute top-[50px] right-0 z-[100]  whitespace-nowrap flex flex-col gap-2 bg-white border border-gray-200 p-4 rounded-[8px] shadow-lg lg:w-[300px] w-full z-20">

                <div className="flex flex-col gap-4">
                  <SelectInputField title={"Class"} options={[
                    { value: "Onte" },
                    { value: "Two" },
                    { value: "Three" }
                  ]} />
                  <SelectInputField title={"Section"} options={[
                    { value: "Onte" },
                    { value: "Two" },
                    { value: "Three" }
                  ]} />
                </div>
                <div className="flex items-end justify-end gap-4 mt-2.5">
                  <button
                    onClick={() => setIsFilterOpen(false)}
                    className=" px-4 py-2 bg-[#e6f4ef]  rounded-[8px] cursor-pointer"
                  >
                    Cancel
                  </button>

                  <button

                    className=" px-4 py-2 bg-[#00bd7f] text-white rounded-[8px] cursor-pointer"
                  >
                    Apply
                  </button>
                </div>
              </div>
            }
          </div>


          <div>
            <button
              onClick={() => setShowAddModal(true)}
              className="w-full flex items-center justify-center gap-2 px-5 py-2.5 text-sm font-bold bg-[#00bd7f] text-white rounded-[8px] shadow-lg shadow-emerald-500/30 hover:shadow-xl hover:shadow-emerald-500/40 hover:scale-[1.02] transition-all cursor-pointer"
            >
              <Plus className="w-4 h-4" />
              Add Parent
            </button>
          </div>



        </div>
      </div>




      {/* Stats Summary */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
        {[
          {
            label: "Total Parents",
            value: parents.length,
            icon: Contact,
            color: "text-blue-600",
            bg: "bg-blue-100",
          },
          {
            label: "Active Portal",
            value: parents.filter((s) => s.status === "active").length,
            icon: CheckCircle,
            color: "text-emerald-600",
            bg: "bg-emerald-100",
          },
          {
            label: "Suspended",
            value: parents.filter((s) => s.status === "inactive").length,
            icon: XCircle,
            color: "text-rose-600",
            bg: "bg-rose-100",
          },

        ].map((stat, idx) => (
          <div
            key={idx}
            className="bg-white rounded-[8px]  p-5 flex items-center justify-between shadow-lg relative  overflow-hidden"
          >
            <div className="absolute -top-[50%] -left-[50%] h-[200px] w-[200px] bg-emerald-50 rounded-full group-hover:scale-110 transition-transform duration-500"></div>
            <div className="relative z-[10]">
              <p className="text-xs font-bold text-slate-500 uppercase mb-1">
                {stat.label}
              </p>
              <p className="text-2xl font-black text-slate-800">{stat.value}</p>
            </div>
            <div
              className={`w-12 h-12 ${stat.bg} rounded-xl flex items-center justify-center`}
            >
              <stat.icon className={`w-6 h-6 ${stat.color}`} />
            </div>
          </div>
        ))}
      </div>


      {/* Table Container */}
      <div className="bg-white rounded-[8px] border-1 border-slate-200 shadow-sm overflow-hidden flex flex-col">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-[#e6f4ef] border-b-2 border-slate-200">
              <tr className="white-space-nowrap">
                <th className="px-6 py-4 text-left text-xs font-black text-slate-600 uppercase tracking-wider white-space-nowrap">
                  ID
                </th>
                <th className="px-6 py-4 text-left text-xs font-black text-slate-600 uppercase tracking-wider white-space-nowrap">
                  Parent Info
                </th>
                <th className="px-6 py-4 text-left text-xs font-black text-slate-600 uppercase tracking-wider white-space-nowrap">
                  Occupation
                </th>
                <th className="px-6 py-4 text-left text-xs font-black text-slate-600 uppercase tracking-wider white-space-nowrap">
                  Children
                </th>
                <th className="px-6 py-4 text-left text-xs font-black text-slate-600 uppercase tracking-wider white-space-nowrap">
                  Contact
                </th>
                <th className="px-6 py-4 text-left text-xs font-black text-slate-600 uppercase tracking-wider white-space-nowrap">
                  Status
                </th>
                <th className="px-6 py-4 text-left text-xs font-black text-slate-600 uppercase tracking-wider white-space-nowrap">
                  Action
                </th>
              </tr>
            </thead>
            <tbody className="divide-y-2 divide-slate-100">
              {currentParents.map((parent, i) => (
                <tr
                  key={parent.id}
                  className="hover:bg-slate-50 transition-colors"
                >
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span className="text-sm font-black text-emerald-700">
                      {i + 1}
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded-full border-2 border-emerald-100 overflow-hidden shadow-sm bg-slate-100">
                        <img
                          src={parent.photo}
                          alt={parent.name}
                          className="w-full h-full object-cover"
                        />
                      </div>
                      <div>
                        <p className="text-sm font-bold text-slate-800">
                          {parent.name}
                        </p>
                        <p className="text-[10px] text-slate-500 font-bold uppercase tracking-wider">
                          {parent.address}
                        </p>
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="flex items-center gap-2 text-sm font-bold text-slate-700">
                      <Briefcase className="w-3.5 h-3.5 text-emerald-500" />
                      {parent.occupation}
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="inline-flex items-center gap-2 px-3 py-1 bg-amber-50 text-amber-700 border border-amber-100 rounded-full text-xs font-black">
                      <Users className="w-3.5 h-3.5" />
                      {parent.childrenCount}
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="space-y-1 text-xs font-bold text-slate-600">
                      <div className="flex items-center gap-1.5">
                        <Phone className="w-3.5 h-3.5 text-emerald-500" />
                        {parent.phone}
                      </div>

                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span
                      className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full text-[10px] font-black uppercase tracking-widest border-2 ${parent.status === "active"
                        ? "bg-emerald-50 text-emerald-700 border-emerald-100"
                        : "bg-rose-50 text-rose-700 border-rose-100"
                        }`}
                    >
                      <div
                        className={`w-1.5 h-1.5 rounded-full ${parent.status === "active"
                          ? "bg-emerald-500"
                          : "bg-rose-500"
                          }`}
                      />
                      {parent.status}
                    </span>
                  </td>

                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="flex items-center gap-4">
                      <button className="cursor-pointer" onClick={() => setViewParent(parent)}>
                        <Eye className="w-5 h-5 text-[#00bd7f]" />
                      </button>
                      <button className="cursor-pointer" onClick={() =>
                        handleAction("Edit Info", parent)
                      }>
                        <SquarePen className="w-4 h-4 text-[#00bd7f]" />
                      </button>
                      <button className="cursor-pointer" onClick={() =>
                        handleAction("Delete Record", parent)}>
                        <Trash2 className="w-4 h-4 text-red-500" />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* Pagination Controls */}
        <div className="bg-[#e6f4ef]/30 px-6 py-4 border-t-2 border-slate-200 flex flex-col sm:flex-row items-center justify-between gap-4">
          <p className="text-xs font-bold text-slate-500 uppercase tracking-wider">
            Showing{" "}
            <span className="text-slate-900">
              {(currentPage - 1) * itemsPerPage + 1}
            </span>{" "}
            to{" "}
            <span className="text-slate-900">
              {Math.min(currentPage * itemsPerPage, totalRecords)}
            </span>{" "}
            of <span className="text-slate-900">{totalRecords}</span>{" "}
            records
          </p>
          <div className="flex items-center gap-2">
            <button
              disabled={currentPage === 1}
              onClick={() => setCurrentPage((p) => Math.max(1, p - 1))}
              className="p-2 border-2 border-slate-200 rounded-xl bg-white text-slate-600 hover:bg-slate-50 hover:border-emerald-500 hover:text-emerald-600 disabled:opacity-50 disabled:cursor-not-allowed transition-all"
            >
              <ChevronLeft className="w-5 h-5" />
            </button>
            <div className="flex items-center gap-1">
              {[...Array(totalPages)].map((_, i) => (
                <button
                  key={i + 1}
                  onClick={() => setCurrentPage(i + 1)}
                  className={`w-10 h-10 rounded-xl text-xs font-black transition-all border-2 ${currentPage === i + 1
                    ? "bg-[#00bd7f] border-[#00bd7f] text-white shadow-lg shadow-emerald-200"
                    : "bg-white border-slate-200 text-slate-600 hover:border-emerald-500 hover:text-emerald-600"
                    }`}
                >
                  {i + 1}
                </button>
              ))}
            </div>
            <button
              disabled={currentPage === totalPages || totalPages === 0}
              onClick={() => setCurrentPage((p) => Math.min(totalPages, p + 1))}
              className="p-2 border-2 border-slate-200 rounded-xl bg-white text-slate-600 hover:bg-slate-50 hover:border-emerald-500 hover:text-emerald-600 disabled:opacity-50 disabled:cursor-not-allowed transition-all"
            >
              <ChevronRight className="w-5 h-5" />
            </button>
          </div>
        </div>
      </div>

      {/* Action Modals */}
      {showAddModal && (
        <ParentFormModal
          onClose={() => setShowAddModal(false)}
          onSave={handleSaveNew}
          title="Add New Parent"
        />
      )}

      {editParent && (
        <ParentFormModal
          parent={editParent}
          onClose={() => setEditParent(null)}
          onSave={handleUpdate}
          title="Edit Parent Information"
        />
      )}

      {viewParent && (
        <ParentViewModal
          parent={viewParent}
          onClose={() => setViewParent(null)}
        />
      )}

      {deleteParent && (
        <div
          className="fixed inset-0 bg-slate-900/60 backdrop-blur-sm z-[200] flex p-4 overflow-y-auto"
          onClick={() => setDeleteParent(null)}
        >
          <div
            className="bg-white rounded-[2rem] p-8 max-w-sm w-full text-center shadow-2xl animate-in zoom-in duration-300 m-auto"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="w-16 h-16 bg-rose-50 rounded-full flex items-center justify-center mx-auto mb-6">
              <Trash2 className="w-8 h-8 text-rose-500" />
            </div>
            <h2 className="text-xl font-black text-slate-800 mb-2">
              Confirm Delete
            </h2>
            <p className="text-sm font-bold text-slate-500 mb-8 uppercase tracking-tighter leading-tight">
              Are you sure you want to remove{" "}
              <span className="text-rose-600">{deleteParent.name}</span> from
              the directory? This action is permanent.
            </p>
            <div className="flex gap-3">
              <button
                onClick={() => setDeleteParent(null)}
                className="flex-1 py-3 bg-slate-100 text-slate-600 font-bold rounded-xl hover:bg-slate-200 transition-all"
              >
                Cancel
              </button>
              <button
                onClick={handleDelete}
                className="flex-1 py-3 bg-rose-600 text-white font-black rounded-xl shadow-lg shadow-rose-200 hover:scale-[1.02] transition-all"
              >
                Confirm Delete
              </button>
            </div>
          </div>
        </div>
      )}

      {showStatusToast && (
        <div className="fixed bottom-8 left-1/2 -translate-x-1/2 z-[300] animate-in slide-in-from-bottom-10 duration-500 px-4 w-full max-w-md text-center">
          <div className="bg-slate-900 text-white px-6 py-3 rounded-2xl shadow-2xl flex items-center justify-center gap-3">
            <div className="w-6 h-6 bg-emerald-500 rounded-full flex items-center justify-center shrink-0">
              <CheckCircle className="w-4 h-4 text-white" />
            </div>
            <p className="text-sm font-bold">{showStatusToast}</p>
          </div>
        </div>
      )}
    </div>
  );
};

const ParentFormModal = ({ parent, onClose, onSave, title }) => {
  const [formData, setFormData] = useState(
    parent || {
      fatherName: "",
      motherName: "",
      fatherOccupation: "",
      motherOccupation: "",
      contact: "",
      motherContact: "",
      email: "",
      address: "",
      fatherPhoto: "",
      motherPhoto: "",
      guardianNID: "",
    }
  );

  const [uploadingField, setUploadingField] = useState(null);

  const handleImageUpload = (file, field) => {
    if (!file) return;

    setUploadingField(field);
    const reader = new FileReader();
    reader.onloadend = () => {
      setFormData((prev) => ({
        ...prev,
        [field]: reader.result,
      }));
      setUploadingField(null);
    };
    reader.readAsDataURL(file);
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    onSave(formData);
  };

  return (
    <div
      className="fixed inset-0 bg-slate-900/60 backdrop-blur-sm z-[200] flex p-4 overflow-y-auto"
      onClick={onClose}
    >
      <form
        onSubmit={handleSubmit}
        className="bg-white rounded-[8px] w-full max-w-2xl shadow-2xl animate-in zoom-in duration-300 overflow-hidden relative m-auto"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="p-8 border-b-2 border-slate-50 flex items-center justify-between sticky top-0 bg-white/80 backdrop-blur-md z-10">
          <div>
            <h2 className="text-2xl font-black text-slate-800 tracking-tight">
              {title}
            </h2>

          </div>
          <button
            type="button"
            onClick={onClose}
            className="p-3 hover:bg-rose-50 text-slate-400 hover:text-rose-500 rounded-2xl transition-all border-2 border-transparent hover:border-rose-100 cursor-pointer"
          >
            <X className="w-6 h-6" />
          </button>
        </div>

        <div className="p-8 space-y-8 max-h-[70vh] overflow-y-auto">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="space-y-2">
              <label className="text-sm font-bold text-slate-700 dark:text-slate-700 mb-2 block">
                Father's Name <span className="text-red-500">*</span>
              </label>
              <input
                required
                value={formData.fatherName}
                onChange={(e) =>
                  setFormData({ ...formData, fatherName: e.target.value })
                }
                placeholder="Enter father name"
                className="w-full px-4 py-2 bg-[#e6f4ef] dark:bg-[#e6f4ef] border border-slate-200 dark:border-slate-200 text-slate-900 dark:text-slate-900 rounded-[8px] outline-none focus:ring-0.5 focus:ring-emerald-500 focus:border-emerald-500 transition-all"
              />
            </div>
            <div className="space-y-2">
              <label className="text-sm font-bold text-slate-700 dark:text-slate-700 mb-2 block">
                Mother's Name <span className="text-red-500">*</span>
              </label>
              <input
                required
                value={formData.motherName}
                onChange={(e) =>
                  setFormData({ ...formData, motherName: e.target.value })
                }
                placeholder="Enter Mother name"
                className="w-full px-4 py-2 bg-[#e6f4ef] dark:bg-[#e6f4ef] border border-slate-200 dark:border-slate-200 text-slate-900 dark:text-slate-900 rounded-[8px] outline-none focus:ring-0.5 focus:ring-emerald-500 focus:border-emerald-500 transition-all"
              />
            </div>
            <div className="space-y-2">
              <label className="text-sm font-bold text-slate-700 dark:text-slate-700 mb-2 block">
                Father's Occupation
              </label>
              <input
                value={formData.fatherOccupation}
                onChange={(e) =>
                  setFormData({ ...formData, fatherOccupation: e.target.value })
                }
                placeholder="Father's Occupation"
                className="w-full px-4 py-2 bg-[#e6f4ef] dark:bg-[#e6f4ef] border border-slate-200 dark:border-slate-200 text-slate-900 dark:text-slate-900 rounded-[8px] outline-none focus:ring-0.5 focus:ring-emerald-500 focus:border-emerald-500 transition-all"
              />
            </div>
            <div className="space-y-2">
              <label className="text-sm font-bold text-slate-700 dark:text-slate-700 mb-2 block">
                Mother's Occupation
              </label>
              <input
                value={formData.motherOccupation}
                onChange={(e) =>
                  setFormData({ ...formData, motherOccupation: e.target.value })
                }
                placeholder="Mother's Occupation"
                className="w-full px-4 py-2 bg-[#e6f4ef] dark:bg-[#e6f4ef] border border-slate-200 dark:border-slate-200 text-slate-900 dark:text-slate-900 rounded-[8px] outline-none focus:ring-0.5 focus:ring-emerald-500 focus:border-emerald-500 transition-all"
              />
            </div>
            <div className="space-y-2">
              <label className="text-sm font-bold text-slate-700 dark:text-slate-700 mb-2 block">
                Contact Number (Father's) <span className="text-red-500">*</span>
              </label>
              <input
                required
                value={formData.contact}
                onChange={(e) =>
                  setFormData({ ...formData, contact: e.target.value })
                }
                placeholder="019XXXXXXXX"
                className="w-full px-4 py-2 bg-[#e6f4ef] dark:bg-[#e6f4ef] border border-slate-200 dark:border-slate-200 text-slate-900 dark:text-slate-900 rounded-[8px] outline-none focus:ring-0.5 focus:ring-emerald-500 focus:border-emerald-500 transition-all"
              />
            </div>
            <div className="space-y-2">
              <label className="text-sm font-bold text-slate-700 dark:text-slate-700 mb-2 block">
                Contact Number (Mother's)
              </label>
              <input
                value={formData.motherContact}
                onChange={(e) =>
                  setFormData({ ...formData, motherContact: e.target.value })
                }
                placeholder="019XXXXXXXX"
                className="w-full px-4 py-2 bg-[#e6f4ef] dark:bg-[#e6f4ef] border border-slate-200 dark:border-slate-200 text-slate-900 dark:text-slate-900 rounded-[8px] outline-none focus:ring-0.5 focus:ring-emerald-500 focus:border-emerald-500 transition-all"
              />
            </div>
            {/* <div className="space-y-2 md:col-span-3">
              <label className="text-sm font-bold text-slate-700 dark:text-slate-700 mb-2 block">
               Email Address
              </label>
              <input
                type="email"
                value={formData.email}
                onChange={(e) =>
                  setFormData({ ...formData, email: e.target.value })
                }
                placeholder="example@mail.com"
                 className="w-full px-4 py-2 bg-[#e6f4ef] dark:bg-[#e6f4ef] border border-slate-200 dark:border-slate-200 text-slate-900 dark:text-slate-900 rounded-[8px] outline-none focus:ring-0.5 focus:ring-emerald-500 focus:border-emerald-500 transition-all"
              />
            </div> */}
            <div className="space-y-2 md:col-span-3">
              <label className="text-sm font-bold text-slate-700 dark:text-slate-700 mb-2 block">
                Address <span className="text-red-500">*</span>
              </label>
              <textarea
                required
                rows={3}
                value={formData.address}
                onChange={(e) =>
                  setFormData({ ...formData, address: e.target.value })
                }
                placeholder="Address"
                className="w-full px-4 py-3 bg-emerald-50/50 border-2 border-slate-100 rounded-xl outline-none focus:border-emerald-500 transition-all font-bold text-sm text-slate-700 placeholder:text-slate-400 resize-none"
              />
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 p-6 bg-slate-50/50 rounded-3xl border-2 border-slate-100">
            {/* Father's Photo */}
            <div className="flex flex-col items-center gap-4 bg-white p-6 rounded-2xl border-2 border-slate-100 shadow-sm relative group overflow-hidden">
              <div className="relative">
                {formData.fatherPhoto ? (
                  <img
                    src={formData.fatherPhoto}
                    alt="Father"
                    className="w-24 h-24 rounded-2xl object-cover border-2 border-emerald-200 shadow-sm"
                  />
                ) : (
                  <div className="w-24 h-24 rounded-2xl bg-emerald-50/50 flex items-center justify-center border-2 border-emerald-200 border-dashed">
                    <ImagePlus className="w-8 h-8 text-emerald-400" />
                  </div>
                )}
                <label className="absolute -bottom-2 -right-2 p-2 bg-[#00bd7f] text-white rounded-xl shadow-lg cursor-pointer hover:bg-[#009b68] transition-colors z-10">
                  <Upload className="w-4 h-4" />
                  <input
                    type="file"
                    className="hidden"
                    onChange={(e) =>
                      handleImageUpload(e.target.files?.[0], "fatherPhoto")
                    }
                  />
                </label>
              </div>
              <div className="text-center">
                <p className="font-bold text-slate-800 text-sm">Father's NID Card</p>
                <p className="text-[10px] text-slate-400 font-black mt-1 uppercase tracking-wider">Required for ID</p>
              </div>
            </div>

            {/* Mother's Photo */}
            <div className="flex flex-col items-center gap-4 bg-white p-6 rounded-2xl border-2 border-slate-100 shadow-sm relative group overflow-hidden">
              <div className="relative">
                {formData.motherPhoto ? (
                  <img
                    src={formData.motherPhoto}
                    alt="Mother"
                    className="w-24 h-24 rounded-2xl object-cover border-2 border-emerald-200 shadow-sm"
                  />
                ) : (
                  <div className="w-24 h-24 rounded-2xl bg-emerald-50/50 flex items-center justify-center border-2 border-emerald-200 border-dashed">
                    <ImagePlus className="w-8 h-8 text-emerald-400" />
                  </div>
                )}
                <label className="absolute -bottom-2 -right-2 p-2 bg-[#00bd7f] text-white rounded-xl shadow-lg cursor-pointer hover:bg-[#009b68] transition-colors z-10">
                  <Upload className="w-4 h-4" />
                  <input
                    type="file"
                    className="hidden"
                    onChange={(e) =>
                      handleImageUpload(e.target.files?.[0], "motherPhoto")
                    }
                  />
                </label>
              </div>
              <div className="text-center">
                <p className="font-bold text-slate-800 text-sm">Mother's NID Card</p>
                <p className="text-[10px] text-slate-400 font-black mt-1 uppercase tracking-wider">Required for ID</p>
              </div>
            </div>

            {/* Guardian NID */}
            <div className="flex flex-col items-center gap-4 bg-white p-5 rounded-2xl border-2 border-slate-100 shadow-sm relative group overflow-hidden">
              <div className="relative">
                {formData.guardianNID ? (
                  <img
                    src={formData.guardianNID}
                    alt="Guardian NID"
                    className="w-24 h-24 rounded-2xl object-cover border-2 border-emerald-200 shadow-sm"
                  />
                ) : (
                  <div className="w-24 h-24 rounded-2xl bg-emerald-50/50 flex items-center justify-center border-2 border-emerald-200 border-dashed">
                    <UserCheck className="w-8 h-8 text-emerald-400" />
                  </div>
                )}
                <label className="absolute -bottom-2 -right-2 p-2 bg-[#00bd7f] text-white rounded-xl shadow-lg cursor-pointer hover:bg-[#009b68] transition-colors z-10">
                  <Upload className="w-4 h-4" />
                  <input
                    type="file"
                    className="hidden"
                    onChange={(e) =>
                      handleImageUpload(e.target.files?.[0], "guardianNID")
                    }
                  />
                </label>
              </div>
              <div className="text-center">
                <p className="font-bold text-slate-800 text-sm">Guardian NID Card</p>
                <p className="text-[10px] text-slate-400 font-black mt-1 uppercase tracking-wider">Or Birth Certificate</p>
              </div>
            </div>
          </div>
        </div>

        <div className="p-5 border-t-2 border-slate-50 flex items-center justify-end gap-3 bg-slate-50/50">
          <button
            type="button"
            onClick={onClose}
            className="px-8 py-3 bg-white text-slate-600 font-bold rounded-2xl border-2 border-slate-100 hover:bg-slate-50 transition-all cursor-pointer"
          >
            Cancel
          </button>
          <button
            type="submit"
            className="px-10 py-3 bg-[#00bd7f] text-white font-black rounded-2xl shadow-xl shadow-emerald-500/20 hover:scale-[1.02] active:scale-95 transition-all flex items-center gap-2 cursor-pointer"
          >
            <FileText className="w-4 h-4" />
            Save
          </button>
        </div>
      </form>
    </div>
  );
};

const ParentViewModal = ({ parent, onClose }) => {
  const linkedStudents = parent.children || [];

  return (
    <div
      className="fixed inset-0 bg-slate-900/60 backdrop-blur-sm z-[200] flex p-4 overflow-y-auto"
      onClick={onClose}
    >
      <div
        className="bg-white rounded-[8px] w-full max-w-2xl shadow-2xl animate-in zoom-in duration-300 overflow-hidden relative m-auto"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Profile Banner */}
        <div className="h-32 bg-gradient-to-r from-emerald-600 to-teal-500 relative">
          <div className="absolute -bottom-12 left-8 p-1 bg-white rounded-3xl shadow-xl">
            <div className="w-24 h-24 rounded-2xl overflow-hidden border-2 border-slate-50">
              <img
                src={parent.photo}
                alt={parent.name}
                className="w-full h-full object-cover"
              />
            </div>
          </div>
          <button
            onClick={onClose}
            className="absolute top-6 right-6 p-2 bg-white/20 hover:bg-white text-white hover:text-emerald-600 rounded-xl transition-all backdrop-blur-md"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <div className="px-8 pt-16 pb-8">
          <div className="flex flex-col md:flex-row md:items-start justify-between gap-4 mb-8 text-center md:text-left">
            <div>
              <h2 className="text-3xl font-black text-slate-800 tracking-tight">
                {parent.name}
              </h2>
              <p className="flex items-center justify-center md:justify-start gap-2 text-emerald-600 font-black uppercase text-xs tracking-widest mt-1">
                <Briefcase className="w-3 h-3" /> {parent.occupation}
              </p>
            </div>
            <span
              className={`inline-flex items-center gap-1.5 px-4 py-2 rounded-xl text-xs font-black uppercase tracking-widest border-2 ${parent.status === "active"
                ? "bg-emerald-50 text-emerald-700 border-emerald-100"
                : "bg-rose-50 text-rose-700 border-rose-100"
                }`}
            >
              {parent.status} Portal
            </span>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-8">
            <div className="space-y-4">
              <h4 className="text-[10px] font-black text-slate-400 uppercase tracking-[0.2em]">
                Contact Details
              </h4>
              <div className="space-y-3">
                <div className="flex items-center gap-4 group">
                  <div className="w-10 h-10 bg-slate-50 rounded-xl flex items-center justify-center group-hover:bg-emerald-50 transition-colors">
                    <Phone className="w-4 h-4 text-emerald-500" />
                  </div>
                  <div>
                    <p className="text-[10px] font-black text-slate-400 uppercase">
                      Primary Phone
                    </p>
                    <p className="text-sm font-bold text-slate-700">
                      {parent.phone}
                    </p>
                  </div>
                </div>
                <div className="flex items-center gap-4 group">
                  <div className="w-10 h-10 bg-slate-50 rounded-xl flex items-center justify-center group-hover:bg-emerald-50 transition-colors">
                    <Mail className="w-4 h-4 text-emerald-500" />
                  </div>
                  <div>
                    <p className="text-[10px] font-black text-slate-400 uppercase">
                      Email ID
                    </p>
                    <p className="text-sm font-bold text-slate-700">
                      {parent.email}
                    </p>
                  </div>
                </div>
              </div>
            </div>
            <div className="space-y-4">
              <h4 className="text-[10px] font-black text-slate-400 uppercase tracking-[0.2em]">
                Primary Residence
              </h4>
              <div className="flex items-start gap-4 p-4 bg-slate-50 rounded-2xl group hover:bg-emerald-50/30 transition-all border-2 border-transparent hover:border-emerald-100">
                <div className="w-10 h-10 bg-white rounded-xl flex items-center justify-center shrink-0 shadow-sm transition-transform">
                  <MapPin className="w-4 h-4 text-emerald-600" />
                </div>
                <p className="text-sm font-bold text-slate-600 leading-relaxed">
                  {parent.address}
                </p>
              </div>
            </div>
          </div>

          {/* Linked Students Section */}
          <div className="space-y-4 pt-6 border-t-2 border-slate-50">
            <h4 className="text-[10px] font-black text-slate-400 uppercase tracking-[0.2em] flex items-center gap-2">
              <Users className="w-3.5 h-3.5 text-emerald-500" /> Associated
              Students ({parent.childrenCount})
            </h4>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {linkedStudents.map((student, i) => (
                <div
                  key={i}
                  className="flex items-center gap-4 p-3 border-2 border-slate-100 rounded-[1.5rem] hover:border-emerald-200 hover:bg-emerald-50/20 transition-all group"
                >
                  <div className="w-10 h-10 rounded-xl overflow-hidden shadow-sm group-hover:scale-105 transition-transform">
                    <img src={student.photo || `https://api.dicebear.com/7.x/avataaars/svg?seed=${student._id}`} alt={student.nameInDeshi} />
                  </div>
                  <div>
                    <p className="text-[10px] font-black text-slate-400 tracking-tighter uppercase mb-0.5">
                      {student.studentId || student._id}
                    </p>
                    <p className="text-xs font-black text-slate-800">
                      {student.nameInDeshi || student.nameInEnglish}
                    </p>
                    <p className="text-[10px] font-bold text-emerald-600">
                      Class: {student.class || "N/A"} • Roll {student.rollNumber || "N/A"}
                    </p>
                  </div>
                </div>
              ))}
              {parent.childrenCount === 0 && (
                <p className="text-xs font-bold text-slate-400 italic py-2">
                  No linked student records found.
                </p>
              )}
            </div>
          </div>
        </div>

        {/* <div className="p-8 bg-slate-50/50 border-t-2 border-slate-50 flex gap-4">
          <button
            onClick={() => alert("Opening bulk SMS gate...")}
            className="flex-1 py-4 bg-emerald-600 text-white font-black rounded-[1.5rem] shadow-xl shadow-emerald-200 flex items-center justify-center gap-2 hover:bg-emerald-700 transition-all"
          >
            <MessageCircle className="w-4 h-4" /> Message Guardian
          </button>
          <button
            onClick={onClose}
            className="px-10 py-4 bg-white text-slate-600 font-bold rounded-[1.5rem] border-2 border-slate-200 hover:bg-slate-50 transition-all"
          >
            Close
          </button>
        </div> */}
      </div>
    </div>
  );
};

export default ParentList;
