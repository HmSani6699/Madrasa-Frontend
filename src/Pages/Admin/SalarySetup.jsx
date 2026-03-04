import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import {
  DollarSign,
  Users,
  Plus,
  Edit,
  Trash2,
  ArrowLeft,
  Save,
  X,
  Home,
  Briefcase,
  Calendar,
  TrendingUp,
  CheckCircle,
  XCircle
} from "lucide-react";
import axiosInstance from "../../api/axiosInstance";
import { toast } from "react-hot-toast";

const SalarySetup = () => {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [salarySetups, setSalarySetups] = useState([]);
  const [staffList, setStaffList] = useState([]);
  const [showModal, setShowModal] = useState(false);
  const [editingSetup, setEditingSetup] = useState(null);
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

  const handleSubmit = async (e) => {
    e.preventDefault();
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

  const handleEdit = (setup) => {
    setEditingSetup(setup);
    setFormData({
      staff_id: setup.staff_id?._id || setup.staff_id,
      basic_salary: setup.basic_salary,
      house_rent: setup.house_rent,
      medical_allowance: setup.medical_allowance,
      transport_allowance: setup.transport_allowance,
      other_allowance: setup.other_allowance,
      effective_from: new Date(setup.effective_from).toISOString().split('T')[0],
      status: setup.status
    });
    setShowModal(true);
  };

  const handleDelete = async (id) => {
    if (!confirm("Are you sure you want to delete this salary setup?")) return;

    try {
      const response = await axiosInstance.delete(`/v1/salary-setup/${id}`);
      if (response.data.success) {
        toast.success("Salary setup deleted successfully!");
        fetchSalarySetups();
      }
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
    }).format(amount);
  };

  return (
    <div className="min-h-screen bg-slate-50 p-5 animate-in fade-in duration-700">
      {/* Page Header */}
      <div className="max-w-7xl mx-auto mb-10 flex flex-col md:flex-row md:items-center justify-between gap-6 border-b border-slate-200 pb-8">
        <div className="flex items-center gap-6">
          <button
            onClick={() => navigate("/admin/dashboard")}
            className="w-12 h-12 bg-white hover:bg-slate-50 text-slate-400 rounded-2xl flex items-center justify-center transition-all hover:scale-110 active:scale-90 shadow-sm border border-slate-200"
          >
            <ArrowLeft className="w-6 h-6" />
          </button>
          <div>
            <h1 className="text-3xl md:text-5xl font-black text-slate-800 tracking-tighter">
              Salary Setup
            </h1>
            <p className="text-slate-500 text-xs font-bold mt-2">
              Manage Staff Salary Configurations
            </p>
          </div>
        </div>

        <button
          onClick={() => {
            resetForm();
            setShowModal(true);
          }}
          className="flex items-center justify-center gap-2 px-8 py-3.5 text-sm font-black bg-[#00bd7f] text-white rounded-2xl shadow-xl shadow-emerald-500/30 hover:shadow-2xl hover:shadow-emerald-500/40 hover:scale-[1.02] active:scale-95 transition-all"
        >
          <Plus className="w-5 h-5" /> New Salary Setup
        </button>
      </div>

      {/* Filters */}
      <div className="max-w-7xl mx-auto mb-8">
        <div className="bg-white rounded-2xl border-2 border-slate-200 p-6 shadow-sm">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div>
              <label className="text-slate-500 text-xs font-black uppercase tracking-widest mb-2 block">
                Filter by Staff
              </label>
              <select
                value={filters.staff_id}
                onChange={(e) => setFilters(prev => ({ ...prev, staff_id: e.target.value }))}
                className="w-full bg-[#e6f4ef] text-slate-800 px-4 py-3 rounded-xl border-2 border-transparent focus:border-[#00bd7f] focus:bg-white outline-none font-bold text-sm transition-all"
              >
                <option value="">All Staff</option>
                {staffList.map(staff => (
                  <option key={staff._id} value={staff._id}>{staff.name}</option>
                ))}
              </select>
            </div>

            <div>
              <label className="text-slate-500 text-xs font-black uppercase tracking-widest mb-2 block">
                Filter by Status
              </label>
              <select
                value={filters.status}
                onChange={(e) => setFilters(prev => ({ ...prev, status: e.target.value }))}
                className="w-full bg-[#e6f4ef] text-slate-800 px-4 py-3 rounded-xl border-2 border-transparent focus:border-[#00bd7f] focus:bg-white outline-none font-bold text-sm transition-all"
              >
                <option value="">All Status</option>
                <option value="active">Active</option>
                <option value="inactive">Inactive</option>
              </select>
            </div>
          </div>
        </div>
      </div>

      {/* Salary Setups List */}
      <div className="max-w-7xl mx-auto">
        {loading ? (
          <div className="text-center py-20">
            <div className="inline-block animate-spin rounded-full h-12 w-12 border-4 border-[#00bd7f] border-t-transparent"></div>
            <p className="mt-4 text-slate-500 font-bold">Loading salary setups...</p>
          </div>
        ) : salarySetups.length === 0 ? (
          <div className="bg-white rounded-2xl border-2 border-dashed border-slate-200 p-20 text-center">
            <DollarSign className="w-16 h-16 text-slate-300 mx-auto mb-4" />
            <p className="text-slate-500 font-bold text-lg">No salary setups found</p>
            <p className="text-slate-400 text-sm mt-2">Create your first salary setup to get started</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {salarySetups.map((setup) => (
              <div
                key={setup._id}
                className="bg-white rounded-2xl border-2 border-slate-200 p-6 shadow-sm hover:shadow-md transition-all"
              >
                <div className="flex items-start justify-between mb-4">
                  <div className="flex-1">
                    <h3 className="text-xl font-black text-slate-800 mb-1">
                      {setup.staff_info?.name || "Unknown Staff"}
                    </h3>
                    <p className="text-sm text-slate-500 font-bold">
                      {setup.staff_info?.role || "Staff"}
                    </p>
                  </div>
                  <span className={`px-3 py-1 rounded-full text-xs font-black ${
                    setup.status === 'active' 
                      ? 'bg-green-100 text-green-700' 
                      : 'bg-slate-100 text-slate-500'
                  }`}>
                    {setup.status === 'active' ? <CheckCircle className="w-3 h-3 inline mr-1" /> : <XCircle className="w-3 h-3 inline mr-1" />}
                    {setup.status}
                  </span>
                </div>

                <div className="space-y-2 mb-4">
                  <div className="flex justify-between text-sm">
                    <span className="text-slate-500 font-bold">Basic Salary:</span>
                    <span className="text-slate-800 font-black">{formatCurrency(setup.basic_salary)}</span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span className="text-slate-500 font-bold">House Rent:</span>
                    <span className="text-slate-800 font-black">{formatCurrency(setup.house_rent)}</span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span className="text-slate-500 font-bold">Medical:</span>
                    <span className="text-slate-800 font-black">{formatCurrency(setup.medical_allowance)}</span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span className="text-slate-500 font-bold">Transport:</span>
                    <span className="text-slate-800 font-black">{formatCurrency(setup.transport_allowance)}</span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span className="text-slate-500 font-bold">Other:</span>
                    <span className="text-slate-800 font-black">{formatCurrency(setup.other_allowance)}</span>
                  </div>
                  <div className="border-t-2 border-slate-100 pt-2 mt-2">
                    <div className="flex justify-between">
                      <span className="text-[#00bd7f] font-black text-lg">Total:</span>
                      <span className="text-[#00bd7f] font-black text-lg">{formatCurrency(setup.total_salary)}</span>
                    </div>
                  </div>
                </div>

                <div className="text-xs text-slate-400 font-bold mb-4">
                  <Calendar className="w-3 h-3 inline mr-1" />
                  Effective from: {new Date(setup.effective_from).toLocaleDateString()}
                </div>

                <div className="flex gap-2">
                  <button
                    onClick={() => handleEdit(setup)}
                    className="flex-1 flex items-center justify-center gap-2 px-4 py-2 bg-blue-50 text-blue-600 rounded-xl hover:bg-blue-100 transition-all font-bold text-sm"
                  >
                    <Edit className="w-4 h-4" /> Edit
                  </button>
                  <button
                    onClick={() => handleDelete(setup._id)}
                    className="flex-1 flex items-center justify-center gap-2 px-4 py-2 bg-red-50 text-red-600 rounded-xl hover:bg-red-100 transition-all font-bold text-sm"
                  >
                    <Trash2 className="w-4 h-4" /> Delete
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Create/Edit Modal */}
      {showModal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-3xl max-w-3xl w-full max-h-[90vh] overflow-y-auto">
            <div className="sticky top-0 bg-white border-b-2 border-slate-100 p-6 flex items-center justify-between rounded-t-3xl">
              <h2 className="text-2xl font-black text-slate-800">
                {editingSetup ? "Edit Salary Setup" : "New Salary Setup"}
              </h2>
              <button
                onClick={() => {
                  setShowModal(false);
                  resetForm();
                }}
                className="w-10 h-10 bg-slate-100 hover:bg-red-100 text-slate-600 hover:text-red-600 rounded-xl flex items-center justify-center transition-all"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleSubmit} className="p-6 space-y-6">
              {/* Staff Selection */}
              <div>
                <label className="text-slate-500 text-xs font-black uppercase tracking-widest mb-2 block">
                  Select Staff <span className="text-[#00bd7f]">*</span>
                </label>
                <select
                  value={formData.staff_id}
                  onChange={(e) => handleInputChange('staff_id', e.target.value)}
                  required
                  disabled={editingSetup}
                  className="w-full bg-[#e6f4ef] text-slate-800 px-4 py-3 rounded-xl border-2 border-transparent focus:border-[#00bd7f] focus:bg-white outline-none font-bold text-sm transition-all disabled:opacity-50"
                >
                  <option value="">Select Staff Member</option>
                  {staffList.map(staff => (
                    <option key={staff._id} value={staff._id}>{staff.name} - {staff.role}</option>
                  ))}
                </select>
              </div>

              {/* Salary Components */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="text-slate-500 text-xs font-black uppercase tracking-widest mb-2 block">
                    Basic Salary <span className="text-[#00bd7f]">*</span>
                  </label>
                  <input
                    type="number"
                    value={formData.basic_salary}
                    onChange={(e) => handleInputChange('basic_salary', e.target.value)}
                    required
                    min="0"
                    step="0.01"
                    placeholder="Enter basic salary"
                    className="w-full bg-[#e6f4ef] text-slate-800 px-4 py-3 rounded-xl border-2 border-transparent focus:border-[#00bd7f] focus:bg-white outline-none font-bold text-sm transition-all"
                  />
                </div>

                <div>
                  <label className="text-slate-500 text-xs font-black uppercase tracking-widest mb-2 block">
                    House Rent
                  </label>
                  <input
                    type="number"
                    value={formData.house_rent}
                    onChange={(e) => handleInputChange('house_rent', e.target.value)}
                    min="0"
                    step="0.01"
                    placeholder="Enter house rent"
                    className="w-full bg-[#e6f4ef] text-slate-800 px-4 py-3 rounded-xl border-2 border-transparent focus:border-[#00bd7f] focus:bg-white outline-none font-bold text-sm transition-all"
                  />
                </div>

                <div>
                  <label className="text-slate-500 text-xs font-black uppercase tracking-widest mb-2 block">
                    Medical Allowance
                  </label>
                  <input
                    type="number"
                    value={formData.medical_allowance}
                    onChange={(e) => handleInputChange('medical_allowance', e.target.value)}
                    min="0"
                    step="0.01"
                    placeholder="Enter medical allowance"
                    className="w-full bg-[#e6f4ef] text-slate-800 px-4 py-3 rounded-xl border-2 border-transparent focus:border-[#00bd7f] focus:bg-white outline-none font-bold text-sm transition-all"
                  />
                </div>

                <div>
                  <label className="text-slate-500 text-xs font-black uppercase tracking-widest mb-2 block">
                    Transport Allowance
                  </label>
                  <input
                    type="number"
                    value={formData.transport_allowance}
                    onChange={(e) => handleInputChange('transport_allowance', e.target.value)}
                    min="0"
                    step="0.01"
                    placeholder="Enter transport allowance"
                    className="w-full bg-[#e6f4ef] text-slate-800 px-4 py-3 rounded-xl border-2 border-transparent focus:border-[#00bd7f] focus:bg-white outline-none font-bold text-sm transition-all"
                  />
                </div>

                <div>
                  <label className="text-slate-500 text-xs font-black uppercase tracking-widest mb-2 block">
                    Other Allowance
                  </label>
                  <input
                    type="number"
                    value={formData.other_allowance}
                    onChange={(e) => handleInputChange('other_allowance', e.target.value)}
                    min="0"
                    step="0.01"
                    placeholder="Enter other allowance"
                    className="w-full bg-[#e6f4ef] text-slate-800 px-4 py-3 rounded-xl border-2 border-transparent focus:border-[#00bd7f] focus:bg-white outline-none font-bold text-sm transition-all"
                  />
                </div>

                <div>
                  <label className="text-slate-500 text-xs font-black uppercase tracking-widest mb-2 block">
                    Effective From <span className="text-[#00bd7f]">*</span>
                  </label>
                  <input
                    type="date"
                    value={formData.effective_from}
                    onChange={(e) => handleInputChange('effective_from', e.target.value)}
                    required
                    className="w-full bg-[#e6f4ef] text-slate-800 px-4 py-3 rounded-xl border-2 border-transparent focus:border-[#00bd7f] focus:bg-white outline-none font-bold text-sm transition-all"
                  />
                </div>
              </div>

              {/* Total Salary Display */}
              <div className="bg-[#e6f4ef] rounded-2xl p-6 border-2 border-[#00bd7f]">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div className="w-12 h-12 bg-[#00bd7f] rounded-xl flex items-center justify-center">
                      <TrendingUp className="w-6 h-6 text-white" />
                    </div>
                    <div>
                      <p className="text-slate-500 text-xs font-black uppercase tracking-widest">Total Salary</p>
                      <p className="text-3xl font-black text-[#00bd7f]">{formatCurrency(calculateTotal())}</p>
                    </div>
                  </div>
                </div>
              </div>

              {/* Status */}
              <div>
                <label className="text-slate-500 text-xs font-black uppercase tracking-widest mb-2 block">
                  Status
                </label>
                <select
                  value={formData.status}
                  onChange={(e) => handleInputChange('status', e.target.value)}
                  className="w-full bg-[#e6f4ef] text-slate-800 px-4 py-3 rounded-xl border-2 border-transparent focus:border-[#00bd7f] focus:bg-white outline-none font-bold text-sm transition-all"
                >
                  <option value="active">Active</option>
                  <option value="inactive">Inactive</option>
                </select>
              </div>

              {/* Action Buttons */}
              <div className="flex gap-4 pt-4">
                <button
                  type="button"
                  onClick={() => {
                    setShowModal(false);
                    resetForm();
                  }}
                  className="flex-1 px-6 py-3 bg-slate-100 text-slate-600 font-black rounded-xl hover:bg-red-100 hover:text-red-600 transition-all"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={loading}
                  className="flex-1 flex items-center justify-center gap-2 px-6 py-3 bg-[#00bd7f] text-white font-black rounded-xl shadow-lg shadow-emerald-500/30 hover:shadow-xl hover:scale-[1.02] active:scale-95 transition-all disabled:opacity-50"
                >
                  <Save className="w-5 h-5" />
                  {loading ? "Saving..." : editingSetup ? "Update Setup" : "Create Setup"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default SalarySetup;
