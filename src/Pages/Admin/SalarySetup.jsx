import { useState, useEffect } from "react";
import {
  DollarSign,
  Plus,
  Trash2,
  SquarePen,
  X,
} from "lucide-react";
import axiosInstance from "../../api/axiosInstance";
import { toast } from "react-hot-toast";
import InputField from "../../components/InputField";
import SelectInputField from "../../components/SelectInputField";

const SalarySetup = () => {
  const [loading, setLoading] = useState(false);
  const [salarySetups, setSalarySetups] = useState([]);
  const [staffList, setStaffList] = useState([]);
  const [showModal, setShowModal] = useState(false);
  const [editingSetup, setEditingSetup] = useState(null);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [selectedSetup, setSelectedSetup] = useState(null);

  const [filters, setFilters] = useState({
    staff_id: "",
    status: ""
  });

  const [formData, setFormData] = useState({
    staff_id: "",
    basic_salary: "",
    house_rent: "",
    medical_allowance: "",
    transport_allowance: "",
    other_allowance: "",
    effective_from: new Date().toISOString().split('T')[0],
    status: "active"
  });

  useEffect(() => {
    fetchSalarySetups();
    fetchStaffList();
  }, [filters]);

  const fetchSalarySetups = async () => {
    setLoading(true);
    try {
      const params = new URLSearchParams();
      if (filters.staff_id) params.append('staff_id', filters.staff_id);
      if (filters.status) params.append('status', filters.status);

      const response = await axiosInstance.get(`/v1/salary-setup?${params.toString()}`);
      if (response.data.success) {
        setSalarySetups(response.data.data);
      }
    } catch (err) {
      console.error("Error fetching salary setups:", err);
      toast.error(err.response?.data?.message || "Failed to fetch salary setups");
    } finally {
      setLoading(false);
    }
  };

  const fetchStaffList = async () => {
    try {
      const response = await axiosInstance.get('/v1/staff');
      if (response.data.success) {
        setStaffList(response.data.data);
      }
    } catch (err) {
      console.error("Error fetching staff:", err);
    }
  };

  const calculateTotal = () => {
    const basic = parseFloat(formData.basic_salary) || 0;
    const house = parseFloat(formData.house_rent) || 0;
    const medical = parseFloat(formData.medical_allowance) || 0;
    const transport = parseFloat(formData.transport_allowance) || 0;
    const other = parseFloat(formData.other_allowance) || 0;
    return basic + house + medical + transport + other;
  };

  const handleInputChange = (field, value) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const handleSubmit = async () => {
    setLoading(true);

    try {
      if (editingSetup) {
        const response = await axiosInstance.put(`/v1/salary-setup/${editingSetup._id}`, formData);
        if (response.data.success) {
          toast.success("Salary setup updated successfully!");
          setShowModal(false);
          resetForm();
          fetchSalarySetups();
        }
      } else {
        const response = await axiosInstance.post('/v1/salary-setup', formData);
        if (response.data.success) {
          toast.success("Salary setup created successfully!");
          setShowModal(false);
          resetForm();
          fetchSalarySetups();
        }
      }
    } catch (err) {
      console.error("Salary setup save error:", err);
      toast.error(err.response?.data?.message || "Failed to save salary setup");
    } finally {
      setLoading(false);
    }
  };

  const openEditModal = (setup) => {
    setEditingSetup(setup);
    setFormData({
      staff_id: setup.staff_id?._id || setup.staff_id,
      basic_salary: setup.basic_salary || "",
      house_rent: setup.house_rent || "",
      medical_allowance: setup.medical_allowance || "",
      transport_allowance: setup.transport_allowance || "",
      other_allowance: setup.other_allowance || "",
      effective_from: setup.effective_from ? new Date(setup.effective_from).toISOString().split('T')[0] : new Date().toISOString().split('T')[0],
      status: setup.status || "active"
    });
    setShowModal(true);
  };

  const openDeleteModal = (setup) => {
    setSelectedSetup(setup);
    setIsDeleteModalOpen(true);
  };

  const handleDelete = async () => {
    try {
      const response = await axiosInstance.delete(`/v1/salary-setup/${selectedSetup._id}`);
      if (response.data.success) {
        toast.success("Salary setup deleted successfully!");
        fetchSalarySetups();
      }
      setIsDeleteModalOpen(false);
      setSelectedSetup(null);
    } catch (err) {
      console.error("Delete error:", err);
      toast.error(err.response?.data?.message || "Failed to delete salary setup");
    }
  };

  const resetForm = () => {
    setFormData({
      staff_id: "",
      basic_salary: "",
      house_rent: "",
      medical_allowance: "",
      transport_allowance: "",
      other_allowance: "",
      effective_from: new Date().toISOString().split('T')[0],
      status: "active"
    });
    setEditingSetup(null);
  };

  const formatCurrency = (amount) => {
    return new Intl.NumberFormat('en-BD', {
      style: 'currency',
      currency: 'BDT',
      minimumFractionDigits: 0
    }).format(amount || 0);
  };

  return (
    <div className="animate-in fade-in duration-500">
      {/* Header */}
      <div className="flex items-center justify-between mb-5 w-full">
        <div>
          <h1 className="text-[20px] font-black text-slate-800 flex items-center gap-3">
            <DollarSign className="w-8 h-8 text-[#00315e]" />
            Salary Setup
          </h1>
          <p className="text-[14px] text-slate-500 font-bold mt-1">
            Manage Staff Salary Configurations
          </p>
        </div>

        <div className="flex flex-col md:flex-row items-center gap-3 w-full md:w-auto">
          <div className="flex items-center gap-3 w-full md:w-auto">
            <select
              value={filters.staff_id}
              onChange={(e) => setFilters(prev => ({ ...prev, staff_id: e.target.value }))}
              className="px-4 py-2 bg-white border border-slate-200 text-slate-900 rounded-[8px] outline-none focus:ring-0.5 focus:ring-[#00315e] transition-all text-sm font-bold"
            >
              <option value="">All Staff</option>
              {staffList.map(staff => (
                <option key={staff._id} value={staff._id}>{staff.name}</option>
              ))}
            </select>

            <select
              value={filters.status}
              onChange={(e) => setFilters(prev => ({ ...prev, status: e.target.value }))}
              className="px-4 py-2 bg-white border border-slate-200 text-slate-900 rounded-[8px] outline-none focus:ring-0.5 focus:ring-[#00315e] transition-all text-sm font-bold"
            >
              <option value="">All Status</option>
              <option value="active">Active</option>
              <option value="inactive">Inactive</option>
            </select>
          </div>
          <button
            onClick={() => {
              resetForm();
              setShowModal(true);
            }}
            className="px-4 py-2 bg-[#00315e] text-white rounded-[8px] cursor-pointer flex items-center gap-2 whitespace-nowrap"
          >
            <Plus className="w-4 h-4" />
            Add Setup
          </button>
        </div>
      </div>

      {/* Salary List Table */}
      <div className="bg-white rounded-[8px] shadow-xl shadow-slate-100/50 overflow-hidden relative">
        {loading ? (
          <div className="flex-1 flex flex-col items-center justify-center py-20">
            <div className="w-12 h-12 border-4 border-[#00315e] border-t-transparent rounded-full animate-spin mb-4"></div>
            <p className="text-slate-500 font-bold">Loading salary setups...</p>
          </div>
        ) : salarySetups.length === 0 ? (
          <div className="py-20 text-center">
            <DollarSign className="w-16 h-16 text-slate-300 mx-auto mb-4" />
            <p className="text-slate-500 font-bold text-lg">No salary setups found</p>
          </div>
        ) : (
          <div className="overflow-x-auto border border-gray-200 rounded-[8px]">
            <table className="w-full">
              <thead className="bg-[#00315e24]">
                <tr>
                  <th className="px-6 py-3.5 text-left text-[12px] font-black">Staff</th>
                  <th className="px-6 py-3.5 text-center text-[12px] font-black">Basic</th>
                  <th className="px-6 py-3.5 text-center text-[12px] font-black">House Rent</th>
                  <th className="px-6 py-3.5 text-center text-[12px] font-black">Medical</th>
                  <th className="px-6 py-3.5 text-center text-[12px] font-black">Transport</th>
                  <th className="px-6 py-3.5 text-center text-[12px] font-black">Total</th>
                  <th className="px-6 py-3.5 text-center text-[12px] font-black">Status</th>
                  <th className="px-6 py-3.5 text-center text-[12px] font-black">Action</th>
                </tr>
              </thead>
              <tbody className="divide-y-2 divide-slate-50">
                {salarySetups.map((setup) => (
                  <tr
                    key={setup._id}
                    className="group hover:bg-amber-50/10 transition-all duration-300"
                  >
                    <td className="px-6 py-3.5">
                      <div className="flex flex-col">
                        <span className="text-sm font-black text-slate-800">
                          {setup.staff_info?.name || "Unknown Staff"}
                        </span>
                        <span className="text-xs font-bold text-slate-500">
                          {setup.staff_info?.role || "Staff"}
                        </span>
                      </div>
                    </td>
                    <td className="px-6 py-3.5 text-center">
                      <span className="text-sm font-bold text-slate-600">
                        {formatCurrency(setup.basic_salary)}
                      </span>
                    </td>
                    <td className="px-6 py-3.5 text-center">
                      <span className="text-sm font-bold text-slate-600">
                        {formatCurrency(setup.house_rent)}
                      </span>
                    </td>
                    <td className="px-6 py-3.5 text-center">
                      <span className="text-sm font-bold text-slate-600">
                        {formatCurrency(setup.medical_allowance)}
                      </span>
                    </td>
                    <td className="px-6 py-3.5 text-center">
                      <span className="text-sm font-bold text-slate-600">
                        {formatCurrency(setup.transport_allowance)}
                      </span>
                    </td>
                    <td className="px-6 py-3.5 text-center">
                      <span className="text-sm font-black text-[#00315e]">
                        {formatCurrency(setup.total_salary)}
                      </span>
                    </td>
                    <td className="px-6 py-3.5 text-center">
                      <span
                        className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full text-[10px] font-black uppercase tracking-widest ${
                          setup.status === "active"
                            ? "bg-blue-50 text-blue-700 border-blue-100"
                            : "bg-rose-50 text-rose-700 border-rose-100"
                        }`}
                      >
                        <div
                          className={`w-1.5 h-1.5 rounded-full ${
                            setup.status === "active" ? "bg-blue-500" : "bg-rose-500"
                          }`}
                        />
                        {setup.status}
                      </span>
                    </td>
                    <td>
                      <div className="flex items-center gap-3 justify-center">
                        <button className="cursor-pointer" onClick={() => openEditModal(setup)}>
                          <SquarePen className="w-4 h-4 text-[#00315e]" />
                        </button>
                        <button className="cursor-pointer" onClick={() => openDeleteModal(setup)}>
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
      {showModal && (
        <div className="fixed inset-0 bg-slate-900/70 backdrop-blur-md z-[100] flex items-center justify-center p-6 sm:p-10">
          <div className="bg-white rounded-[8px] w-full max-w-2xl shadow-[0_32px_64px_-16px_rgba(0,0,0,0.2)] animate-in fade-in zoom-in duration-300 overflow-hidden flex flex-col max-h-[90vh]">
            <div className="p-6 border-b-2 border-slate-100 flex items-center justify-between bg-white">
              <h2 className="text-xl font-black text-slate-800 tracking-tight">
                {editingSetup ? "Update Salary Setup" : "Add New Salary Setup"}
              </h2>
              <button
                onClick={() => {
                  setShowModal(false);
                  resetForm();
                }}
                className="p-2 hover:bg-slate-100 rounded-xl transition-all cursor-pointer"
              >
                <X className="w-5 h-5 text-slate-400" />
              </button>
            </div>

            <div className="p-6 overflow-y-auto flex flex-col gap-4">
              <SelectInputField
                title={'Staff'}
                options={staffList.map(s => ({ value: s._id, label: `${s.name} - ${s.role}` }))}
                value={formData.staff_id}
                setValue={(val) => handleInputChange('staff_id', val)}
              />

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <InputField
                  title={'Basic Salary'}
                  placeholder={'0.00'}
                  type={'number'}
                  value={formData.basic_salary}
                  setValue={(val) => handleInputChange('basic_salary', val)}
                />
                <InputField
                  title={'House Rent'}
                  placeholder={'0.00'}
                  type={'number'}
                  value={formData.house_rent}
                  setValue={(val) => handleInputChange('house_rent', val)}
                />
                <InputField
                  title={'Medical Allowance'}
                  placeholder={'0.00'}
                  type={'number'}
                  value={formData.medical_allowance}
                  setValue={(val) => handleInputChange('medical_allowance', val)}
                />
                <InputField
                  title={'Transport Allowance'}
                  placeholder={'0.00'}
                  type={'number'}
                  value={formData.transport_allowance}
                  setValue={(val) => handleInputChange('transport_allowance', val)}
                />
                <InputField
                  title={'Other Allowance'}
                  placeholder={'0.00'}
                  type={'number'}
                  value={formData.other_allowance}
                  setValue={(val) => handleInputChange('other_allowance', val)}
                />
                <InputField
                  title={'Effective From'}
                  placeholder={'Select Date'}
                  type={'date'}
                  value={formData.effective_from}
                  setValue={(val) => handleInputChange('effective_from', val)}
                />
              </div>

              <SelectInputField
                title={'Status'}
                options={[{ value: "active", label: "Active" }, { value: "inactive", label: "Inactive" }]}
                value={formData.status}
                setValue={(val) => handleInputChange('status', val)}
              />

              <div className="mt-2 bg-[#00315e]/5 rounded-xl p-4 border border-[#00315e]/20 flex justify-between items-center">
                <span className="text-sm font-bold text-slate-600">Total Salary</span>
                <span className="text-xl font-black text-[#00315e]">{formatCurrency(calculateTotal())}</span>
              </div>
            </div>

            <div className="p-6 border-t-2 border-slate-100 bg-slate-50 flex justify-end gap-4">
              <button
                onClick={() => {
                  setShowModal(false);
                  resetForm();
                }}
                className="px-6 py-3 font-bold text-slate-600 hover:bg-white rounded-xl transition-all border-2 border-transparent hover:border-slate-200 cursor-pointer"
              >
                Cancel
              </button>
              <button
                onClick={handleSubmit}
                disabled={loading}
                className="px-8 py-3 bg-[#00315e] hover:bg-blue-900 text-white font-bold rounded-[8px] shadow-lg transition-all flex items-center gap-2 cursor-pointer disabled:opacity-50"
              >
                {loading ? "Saving..." : (editingSetup ? "Update Setup" : "Add Setup")}
              </button>
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
                  Are you sure you want to delete this salary setup for <span className="font-bold text-slate-700">{selectedSetup?.staff_info?.name}</span>?
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

export default SalarySetup;
