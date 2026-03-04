import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import {
  DollarSign,
  Users,
  Plus,
  Trash2,
  ArrowLeft,
  Save,
  X,
  Calendar,
  TrendingUp,
  CreditCard,
  FileText,
  CheckCircle,
  Clock,
  Filter
} from "lucide-react";
import axiosInstance from "../../api/axiosInstance";
import { toast } from "react-hot-toast";

const SalaryPayment = () => {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [payments, setPayments] = useState([]);
  const [staffList, setStaffList] = useState([]);
  const [showModal, setShowModal] = useState(false);
  const [filters, setFilters] = useState({
    staff_id: "",
    month: "",
    year: new Date().getFullYear().toString(),
    status: ""
  });

  const [formData, setFormData] = useState({
    staff_id: "",
    month: new Date().getMonth() + 1,
    year: new Date().getFullYear(),
    gross_salary: "",
    deductions: "0",
    payment_method: "Bank",
    transaction_id: "",
    note: "",
    status: "paid"
  });

  const [selectedStaffSalary, setSelectedStaffSalary] = useState(null);

  const months = [
    "January", "February", "March", "April", "May", "June",
    "July", "August", "September", "October", "November", "December"
  ];

  useEffect(() => {
    fetchPayments();
    fetchStaffList();
  }, [filters]);

  const fetchPayments = async () => {
    setLoading(true);
    try {
      const params = new URLSearchParams();
      if (filters.staff_id) params.append('staff_id', filters.staff_id);
      if (filters.month) params.append('month', filters.month);
      if (filters.year) params.append('year', filters.year);
      if (filters.status) params.append('status', filters.status);

      const response = await axiosInstance.get(`/v1/salary-payment?${params.toString()}`);
      if (response.data.success) {
        setPayments(response.data.data);
      }
    } catch (err) {
      console.error("Error fetching payments:", err);
      toast.error(err.response?.data?.message || "Failed to fetch payments");
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

  const fetchStaffSalarySetup = async (staffId) => {
    try {
      const response = await axiosInstance.get(`/v1/salary-setup?staff_id=${staffId}&status=active`);
      if (response.data.success && response.data.data.length > 0) {
        const setup = response.data.data[0];
        setSelectedStaffSalary(setup);
        setFormData(prev => ({
          ...prev,
          gross_salary: setup.total_salary.toString()
        }));
      } else {
        setSelectedStaffSalary(null);
        toast.error("No active salary setup found for this staff member");
      }
    } catch (err) {
      console.error("Error fetching salary setup:", err);
      toast.error("Failed to fetch salary setup");
    }
  };

  const calculateNetSalary = () => {
    const gross = parseFloat(formData.gross_salary) || 0;
    const deductions = parseFloat(formData.deductions) || 0;
    return gross - deductions;
  };

  const handleInputChange = (field, value) => {
    setFormData(prev => ({ ...prev, [field]: value }));
    
    if (field === 'staff_id' && value) {
      fetchStaffSalarySetup(value);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      const response = await axiosInstance.post('/v1/salary-payment', formData);
      if (response.data.success) {
        toast.success("Salary payment recorded successfully!");
        setShowModal(false);
        resetForm();
        fetchPayments();
      }
    } catch (err) {
      console.error("Payment save error:", err);
      toast.error(err.response?.data?.message || "Failed to record payment");
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id) => {
    if (!confirm("Are you sure you want to delete this payment record?")) return;

    try {
      const response = await axiosInstance.delete(`/v1/salary-payment/${id}`);
      if (response.data.success) {
        toast.success("Payment record deleted successfully!");
        fetchPayments();
      }
    } catch (err) {
      console.error("Delete error:", err);
      toast.error(err.response?.data?.message || "Failed to delete payment");
    }
  };

  const resetForm = () => {
    setFormData({
      staff_id: "",
      month: new Date().getMonth() + 1,
      year: new Date().getFullYear(),
      gross_salary: "",
      deductions: "0",
      payment_method: "Bank",
      transaction_id: "",
      note: "",
      status: "paid"
    });
    setSelectedStaffSalary(null);
  };

  const formatCurrency = (amount) => {
    return new Intl.NumberFormat('en-BD', {
      style: 'currency',
      currency: 'BDT',
      minimumFractionDigits: 0
    }).format(amount);
  };

  const getMonthName = (monthNum) => {
    return months[monthNum - 1] || monthNum;
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
              Salary Payment
            </h1>
            <p className="text-slate-500 text-xs font-bold mt-2">
              Record Monthly Salary Payments
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
          <Plus className="w-5 h-5" /> Record Payment
        </button>
      </div>

      {/* Filters */}
      <div className="max-w-7xl mx-auto mb-8">
        <div className="bg-white rounded-2xl border-2 border-slate-200 p-6 shadow-sm">
          <div className="flex items-center gap-3 mb-4">
            <Filter className="w-5 h-5 text-[#00bd7f]" />
            <h3 className="text-lg font-black text-slate-800">Filters</h3>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <div>
              <label className="text-slate-500 text-xs font-black uppercase tracking-widest mb-2 block">
                Staff
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
                Month
              </label>
              <select
                value={filters.month}
                onChange={(e) => setFilters(prev => ({ ...prev, month: e.target.value }))}
                className="w-full bg-[#e6f4ef] text-slate-800 px-4 py-3 rounded-xl border-2 border-transparent focus:border-[#00bd7f] focus:bg-white outline-none font-bold text-sm transition-all"
              >
                <option value="">All Months</option>
                {months.map((month, index) => (
                  <option key={index} value={index + 1}>{month}</option>
                ))}
              </select>
            </div>

            <div>
              <label className="text-slate-500 text-xs font-black uppercase tracking-widest mb-2 block">
                Year
              </label>
              <select
                value={filters.year}
                onChange={(e) => setFilters(prev => ({ ...prev, year: e.target.value }))}
                className="w-full bg-[#e6f4ef] text-slate-800 px-4 py-3 rounded-xl border-2 border-transparent focus:border-[#00bd7f] focus:bg-white outline-none font-bold text-sm transition-all"
              >
                <option value="">All Years</option>
                {[2024, 2025, 2026, 2027, 2028].map(year => (
                  <option key={year} value={year}>{year}</option>
                ))}
              </select>
            </div>

            <div>
              <label className="text-slate-500 text-xs font-black uppercase tracking-widest mb-2 block">
                Status
              </label>
              <select
                value={filters.status}
                onChange={(e) => setFilters(prev => ({ ...prev, status: e.target.value }))}
                className="w-full bg-[#e6f4ef] text-slate-800 px-4 py-3 rounded-xl border-2 border-transparent focus:border-[#00bd7f] focus:bg-white outline-none font-bold text-sm transition-all"
              >
                <option value="">All Status</option>
                <option value="paid">Paid</option>
                <option value="pending">Pending</option>
              </select>
            </div>
          </div>
        </div>
      </div>

      {/* Payments List */}
      <div className="max-w-7xl mx-auto">
        {loading ? (
          <div className="text-center py-20">
            <div className="inline-block animate-spin rounded-full h-12 w-12 border-4 border-[#00bd7f] border-t-transparent"></div>
            <p className="mt-4 text-slate-500 font-bold">Loading payments...</p>
          </div>
        ) : payments.length === 0 ? (
          <div className="bg-white rounded-2xl border-2 border-dashed border-slate-200 p-20 text-center">
            <DollarSign className="w-16 h-16 text-slate-300 mx-auto mb-4" />
            <p className="text-slate-500 font-bold text-lg">No payment records found</p>
            <p className="text-slate-400 text-sm mt-2">Record your first salary payment to get started</p>
          </div>
        ) : (
          <div className="space-y-4">
            {payments.map((payment) => (
              <div
                key={payment._id}
                className="bg-white rounded-2xl border-2 border-slate-200 p-6 shadow-sm hover:shadow-md transition-all"
              >
                <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                  <div className="flex-1">
                    <div className="flex items-start gap-4">
                      <div className="w-12 h-12 bg-[#e6f4ef] rounded-xl flex items-center justify-center flex-shrink-0">
                        <Users className="w-6 h-6 text-[#00bd7f]" />
                      </div>
                      <div className="flex-1">
                        <h3 className="text-xl font-black text-slate-800 mb-1">
                          {payment.staff_info?.name || "Unknown Staff"}
                        </h3>
                        <p className="text-sm text-slate-500 font-bold mb-2">
                          {payment.staff_info?.role || "Staff"} • {payment.staff_info?.department || "N/A"}
                        </p>
                        <div className="flex flex-wrap gap-4 text-sm">
                          <div className="flex items-center gap-2">
                            <Calendar className="w-4 h-4 text-slate-400" />
                            <span className="text-slate-600 font-bold">
                              {getMonthName(payment.month)} {payment.year}
                            </span>
                          </div>
                          <div className="flex items-center gap-2">
                            <CreditCard className="w-4 h-4 text-slate-400" />
                            <span className="text-slate-600 font-bold">{payment.payment_method}</span>
                          </div>
                          {payment.transaction_id && (
                            <div className="flex items-center gap-2">
                              <FileText className="w-4 h-4 text-slate-400" />
                              <span className="text-slate-600 font-bold">{payment.transaction_id}</span>
                            </div>
                          )}
                        </div>
                      </div>
                    </div>
                  </div>

                  <div className="flex items-center gap-6">
                    <div className="text-right">
                      <p className="text-xs text-slate-500 font-black uppercase tracking-widest mb-1">Gross Salary</p>
                      <p className="text-lg font-black text-slate-700">{formatCurrency(payment.gross_salary)}</p>
                      {payment.deductions > 0 && (
                        <p className="text-xs text-red-600 font-bold">- {formatCurrency(payment.deductions)} deductions</p>
                      )}
                    </div>

                    <div className="text-right">
                      <p className="text-xs text-slate-500 font-black uppercase tracking-widest mb-1">Net Salary</p>
                      <p className="text-2xl font-black text-[#00bd7f]">{formatCurrency(payment.net_salary)}</p>
                    </div>

                    <div className="flex flex-col gap-2">
                      <span className={`px-4 py-2 rounded-xl text-xs font-black text-center ${
                        payment.status === 'paid' 
                          ? 'bg-green-100 text-green-700' 
                          : 'bg-yellow-100 text-yellow-700'
                      }`}>
                        {payment.status === 'paid' ? <CheckCircle className="w-3 h-3 inline mr-1" /> : <Clock className="w-3 h-3 inline mr-1" />}
                        {payment.status}
                      </span>
                      <button
                        onClick={() => handleDelete(payment._id)}
                        className="px-4 py-2 bg-red-50 text-red-600 rounded-xl hover:bg-red-100 transition-all font-bold text-xs flex items-center justify-center gap-1"
                      >
                        <Trash2 className="w-3 h-3" /> Delete
                      </button>
                    </div>
                  </div>
                </div>

                {payment.note && (
                  <div className="mt-4 pt-4 border-t-2 border-slate-100">
                    <p className="text-xs text-slate-500 font-black uppercase tracking-widest mb-1">Note:</p>
                    <p className="text-sm text-slate-600 font-bold">{payment.note}</p>
                  </div>
                )}
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Create Payment Modal */}
      {showModal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-3xl max-w-3xl w-full max-h-[90vh] overflow-y-auto">
            <div className="sticky top-0 bg-white border-b-2 border-slate-100 p-6 flex items-center justify-between rounded-t-3xl">
              <h2 className="text-2xl font-black text-slate-800">Record Salary Payment</h2>
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
                  className="w-full bg-[#e6f4ef] text-slate-800 px-4 py-3 rounded-xl border-2 border-transparent focus:border-[#00bd7f] focus:bg-white outline-none font-bold text-sm transition-all"
                >
                  <option value="">Select Staff Member</option>
                  {staffList.map(staff => (
                    <option key={staff._id} value={staff._id}>{staff.name} - {staff.role}</option>
                  ))}
                </select>
              </div>

              {/* Salary Setup Info */}
              {selectedStaffSalary && (
                <div className="bg-blue-50 rounded-2xl p-4 border-2 border-blue-200">
                  <p className="text-xs text-blue-700 font-black uppercase tracking-widest mb-2">Active Salary Setup</p>
                  <div className="grid grid-cols-2 gap-2 text-sm">
                    <div>
                      <span className="text-blue-600 font-bold">Basic: </span>
                      <span className="text-blue-800 font-black">{formatCurrency(selectedStaffSalary.basic_salary)}</span>
                    </div>
                    <div>
                      <span className="text-blue-600 font-bold">House Rent: </span>
                      <span className="text-blue-800 font-black">{formatCurrency(selectedStaffSalary.house_rent)}</span>
                    </div>
                    <div>
                      <span className="text-blue-600 font-bold">Medical: </span>
                      <span className="text-blue-800 font-black">{formatCurrency(selectedStaffSalary.medical_allowance)}</span>
                    </div>
                    <div>
                      <span className="text-blue-600 font-bold">Transport: </span>
                      <span className="text-blue-800 font-black">{formatCurrency(selectedStaffSalary.transport_allowance)}</span>
                    </div>
                  </div>
                </div>
              )}

              {/* Month and Year */}
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="text-slate-500 text-xs font-black uppercase tracking-widest mb-2 block">
                    Month <span className="text-[#00bd7f]">*</span>
                  </label>
                  <select
                    value={formData.month}
                    onChange={(e) => handleInputChange('month', e.target.value)}
                    required
                    className="w-full bg-[#e6f4ef] text-slate-800 px-4 py-3 rounded-xl border-2 border-transparent focus:border-[#00bd7f] focus:bg-white outline-none font-bold text-sm transition-all"
                  >
                    {months.map((month, index) => (
                      <option key={index} value={index + 1}>{month}</option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="text-slate-500 text-xs font-black uppercase tracking-widest mb-2 block">
                    Year <span className="text-[#00bd7f]">*</span>
                  </label>
                  <select
                    value={formData.year}
                    onChange={(e) => handleInputChange('year', e.target.value)}
                    required
                    className="w-full bg-[#e6f4ef] text-slate-800 px-4 py-3 rounded-xl border-2 border-transparent focus:border-[#00bd7f] focus:bg-white outline-none font-bold text-sm transition-all"
                  >
                    {[2024, 2025, 2026, 2027, 2028].map(year => (
                      <option key={year} value={year}>{year}</option>
                    ))}
                  </select>
                </div>
              </div>

              {/* Salary Details */}
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="text-slate-500 text-xs font-black uppercase tracking-widest mb-2 block">
                    Gross Salary <span className="text-[#00bd7f]">*</span>
                  </label>
                  <input
                    type="number"
                    value={formData.gross_salary}
                    onChange={(e) => handleInputChange('gross_salary', e.target.value)}
                    required
                    min="0"
                    step="0.01"
                    placeholder="Enter gross salary"
                    className="w-full bg-[#e6f4ef] text-slate-800 px-4 py-3 rounded-xl border-2 border-transparent focus:border-[#00bd7f] focus:bg-white outline-none font-bold text-sm transition-all"
                  />
                </div>

                <div>
                  <label className="text-slate-500 text-xs font-black uppercase tracking-widest mb-2 block">
                    Deductions
                  </label>
                  <input
                    type="number"
                    value={formData.deductions}
                    onChange={(e) => handleInputChange('deductions', e.target.value)}
                    min="0"
                    step="0.01"
                    placeholder="Enter deductions"
                    className="w-full bg-[#e6f4ef] text-slate-800 px-4 py-3 rounded-xl border-2 border-transparent focus:border-[#00bd7f] focus:bg-white outline-none font-bold text-sm transition-all"
                  />
                </div>
              </div>

              {/* Net Salary Display */}
              <div className="bg-[#e6f4ef] rounded-2xl p-6 border-2 border-[#00bd7f]">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div className="w-12 h-12 bg-[#00bd7f] rounded-xl flex items-center justify-center">
                      <TrendingUp className="w-6 h-6 text-white" />
                    </div>
                    <div>
                      <p className="text-slate-500 text-xs font-black uppercase tracking-widest">Net Salary</p>
                      <p className="text-3xl font-black text-[#00bd7f]">{formatCurrency(calculateNetSalary())}</p>
                    </div>
                  </div>
                </div>
              </div>

              {/* Payment Details */}
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="text-slate-500 text-xs font-black uppercase tracking-widest mb-2 block">
                    Payment Method <span className="text-[#00bd7f]">*</span>
                  </label>
                  <select
                    value={formData.payment_method}
                    onChange={(e) => handleInputChange('payment_method', e.target.value)}
                    required
                    className="w-full bg-[#e6f4ef] text-slate-800 px-4 py-3 rounded-xl border-2 border-transparent focus:border-[#00bd7f] focus:bg-white outline-none font-bold text-sm transition-all"
                  >
                    <option value="Bank">Bank Transfer</option>
                    <option value="Mobile Banking">Mobile Banking</option>
                    <option value="Cash">Cash</option>
                  </select>
                </div>

                <div>
                  <label className="text-slate-500 text-xs font-black uppercase tracking-widest mb-2 block">
                    Transaction ID
                  </label>
                  <input
                    type="text"
                    value={formData.transaction_id}
                    onChange={(e) => handleInputChange('transaction_id', e.target.value)}
                    placeholder="Enter transaction ID"
                    className="w-full bg-[#e6f4ef] text-slate-800 px-4 py-3 rounded-xl border-2 border-transparent focus:border-[#00bd7f] focus:bg-white outline-none font-bold text-sm transition-all"
                  />
                </div>
              </div>

              {/* Note */}
              <div>
                <label className="text-slate-500 text-xs font-black uppercase tracking-widest mb-2 block">
                  Note
                </label>
                <textarea
                  value={formData.note}
                  onChange={(e) => handleInputChange('note', e.target.value)}
                  placeholder="Add any additional notes..."
                  rows={3}
                  className="w-full bg-[#e6f4ef] text-slate-800 px-4 py-3 rounded-xl border-2 border-transparent focus:border-[#00bd7f] focus:bg-white outline-none font-bold text-sm transition-all resize-none"
                />
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
                  <option value="paid">Paid</option>
                  <option value="pending">Pending</option>
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
                  {loading ? "Recording..." : "Record Payment"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default SalaryPayment;
