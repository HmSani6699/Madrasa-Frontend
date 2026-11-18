import { useState, useEffect, useMemo } from "react";
import {
  DollarSign,
  Plus,
  Trash2,
  SquarePen,
  X,
  Search,
  CheckCircle2,
  AlertTriangle,
  User,
  Users,
  Building2,
  Calendar
} from "lucide-react";
import axiosInstance from "../../api/axiosInstance";
import { toast } from "react-hot-toast";
import InputField from "../../components/InputField";
import SelectInputField from "../../components/SelectInputField";

const SalarySetup = () => {
  const [loading, setLoading] = useState(false);
  const [salarySetups, setSalarySetups] = useState([]);
  const [staffList, setStaffList] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [tabFilter, setTabFilter] = useState("all"); // "all", "configured", "pending"

  const [showModal, setShowModal] = useState(false);
  const [editingSetup, setEditingSetup] = useState(null);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [selectedSetup, setSelectedSetup] = useState(null);

  const [formData, setFormData] = useState({
    staff_id: "",
    basic_salary: "",
    house_rent: "",
    medical_allowance: "",
    transport_allowance: "",
    other_allowance: "",
    effective_from: new Date().toISOString().split("T")[0],
    status: "active"
  });

  const fetchData = async () => {
    setLoading(true);
    try {
      const [setupsRes, staffRes] = await Promise.all([
        axiosInstance.get("/v1/salary-setup"),
        axiosInstance.get("/v1/staff")
      ]);

      if (setupsRes.data.success) {
        setSalarySetups(setupsRes.data.data || []);
      }
      if (staffRes.data.success) {
        setStaffList(staffRes.data.data || []);
      }
    } catch (err) {
      console.error("Error fetching data:", err);
      toast.error("তথ্য লোড করতে সমস্যা হয়েছে");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  const calculateTotal = () => {
    const basic = parseFloat(formData.basic_salary) || 0;
    const house = parseFloat(formData.house_rent) || 0;
    const medical = parseFloat(formData.medical_allowance) || 0;
    const transport = parseFloat(formData.transport_allowance) || 0;
    const other = parseFloat(formData.other_allowance) || 0;
    return basic + house + medical + transport + other;
  };

  const handleInputChange = (field, value) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
  };

  const handleSubmit = async () => {
    if (!formData.staff_id) {
      toast.error("অনুগ্রহ করে কর্মী নির্বাচন করুন");
      return;
    }
    if (!formData.basic_salary || parseFloat(formData.basic_salary) <= 0) {
      toast.error("অনুগ্রহ করে মূল বেতন লিখুন");
      return;
    }

    setLoading(true);
    try {
      if (editingSetup) {
        const response = await axiosInstance.put(`/v1/salary-setup/${editingSetup._id}`, formData);
        if (response.data.success) {
          toast.success("স্যালারি সেটআপ সফলভাবে আপডেট হয়েছে!");
          setShowModal(false);
          resetForm();
          fetchData();
        }
      } else {
        const response = await axiosInstance.post("/v1/salary-setup", formData);
        if (response.data.success) {
          toast.success("স্যালারি সেটআপ সফলভাবে তৈরি হয়েছে!");
          setShowModal(false);
          resetForm();
          fetchData();
        }
      }
    } catch (err) {
      console.error("Salary setup save error:", err);
      toast.error(err.response?.data?.message || "সংরক্ষণ করতে ব্যর্থ হয়েছে");
    } finally {
      setLoading(false);
    }
  };

  const openNewModalForStaff = (staffId) => {
    resetForm();
    setFormData((prev) => ({ ...prev, staff_id: staffId }));
    setShowModal(true);
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
      effective_from: setup.effective_from
        ? new Date(setup.effective_from).toISOString().split("T")[0]
        : new Date().toISOString().split("T")[0],
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
        toast.success("স্যালারি সেটআপ মুছে ফেলা হয়েছে!");
        fetchData();
      }
      setIsDeleteModalOpen(false);
      setSelectedSetup(null);
    } catch (err) {
      console.error("Delete error:", err);
      toast.error(err.response?.data?.message || "মুছে ফেলতে ব্যর্থ হয়েছে");
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
      effective_from: new Date().toISOString().split("T")[0],
      status: "active"
    });
    setEditingSetup(null);
  };

  const formatCurrency = (amount) => {
    return new Intl.NumberFormat("en-BD", {
      style: "currency",
      currency: "BDT",
      minimumFractionDigits: 0
    }).format(amount || 0);
  };

  // Combine staff with their active salary setup
  const combinedStaffList = useMemo(() => {
    return staffList.map((staff) => {
      const setup = salarySetups.find(
        (s) => (s.staff_id?._id || s.staff_id?.toString() || s.staff_id) === staff._id.toString()
      );
      return {
        staff,
        setup: setup || null,
        hasSetup: !!setup
      };
    });
  }, [staffList, salarySetups]);

  // Filter combined list
  const filteredList = useMemo(() => {
    return combinedStaffList.filter((item) => {
      const staffName = item.staff.name?.toLowerCase() || "";
      const empId = item.staff.employeeID?.toLowerCase() || "";
      const role = item.staff.role?.toLowerCase() || "";
      const desig = item.staff.designation?.toLowerCase() || "";

      const matchesSearch =
        !searchTerm ||
        staffName.includes(searchTerm.toLowerCase()) ||
        empId.includes(searchTerm.toLowerCase()) ||
        role.includes(searchTerm.toLowerCase()) ||
        desig.includes(searchTerm.toLowerCase());

      const matchesTab =
        tabFilter === "all" ||
        (tabFilter === "configured" && item.hasSetup) ||
        (tabFilter === "pending" && !item.hasSetup);

      return matchesSearch && matchesTab;
    });
  }, [combinedStaffList, searchTerm, tabFilter]);

  const configuredCount = combinedStaffList.filter((i) => i.hasSetup).length;
  const pendingCount = combinedStaffList.filter((i) => !i.hasSetup).length;

  return (
    <div className="animate-in fade-in duration-500 space-y-6 pb-20">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-[20px] font-black text-slate-800 flex items-center gap-3">
            <DollarSign className="w-8 h-8 text-[#00315e]" />
            Salary Setup (বেতন কাঠামো নির্ধারণ)
          </h1>
          <p className="text-[14px] text-slate-500 font-bold mt-1">
            Configure Staff Basic Salaries, Allowances, and Compensation Packages
          </p>
        </div>

        <button
          onClick={() => {
            resetForm();
            setShowModal(true);
          }}
          className="px-5 py-2.5 bg-[#00315e] hover:bg-[#002547] text-white rounded-[8px] font-bold text-sm flex items-center gap-2 transition-all shadow-sm cursor-pointer self-start md:self-auto"
        >
          <Plus className="w-4 h-4" />
          Add Salary Setup (নতুন বেতন নির্ধারণ)
        </button>
      </div>

      {/* KPI Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div className="bg-white rounded-[8px] p-5 shadow-lg border border-slate-100 flex items-center justify-between">
          <div>
            <p className="text-xs font-bold text-slate-400 uppercase tracking-wider">মোট কর্মী সংখ্যা</p>
            <p className="text-2xl font-black text-slate-900 mt-1">{staffList.length} জন</p>
            <p className="text-[11px] font-bold text-slate-400 mt-1">সকল শিক্ষক ও কর্মচারী</p>
          </div>
          <div className="w-12 h-12 bg-blue-50 text-[#00315e] rounded-xl flex items-center justify-center">
            <Users className="w-6 h-6" />
          </div>
        </div>

        <div className="bg-white rounded-[8px] p-5 shadow-lg border border-slate-100 flex items-center justify-between">
          <div>
            <p className="text-xs font-bold text-emerald-600 uppercase tracking-wider">বেতন নির্ধারিত (Configured)</p>
            <p className="text-2xl font-black text-emerald-700 mt-1">{configuredCount} জন</p>
            <p className="text-[11px] font-bold text-emerald-600 mt-1">পে-রোলে যুক্ত হওয়ার উপযোগী</p>
          </div>
          <div className="w-12 h-12 bg-emerald-50 text-emerald-600 rounded-xl flex items-center justify-center">
            <CheckCircle2 className="w-6 h-6" />
          </div>
        </div>

        <div className="bg-white rounded-[8px] p-5 shadow-lg border border-slate-100 flex items-center justify-between">
          <div>
            <p className="text-xs font-bold text-amber-600 uppercase tracking-wider">বেতন বাকি (Pending Setup)</p>
            <p className="text-2xl font-black text-amber-700 mt-1">{pendingCount} জন</p>
            <p className="text-[11px] font-bold text-amber-600 mt-1">এখনো স্যালারি নির্ধারণ করা হয়নি</p>
          </div>
          <div className="w-12 h-12 bg-amber-50 text-amber-600 rounded-xl flex items-center justify-center">
            <AlertTriangle className="w-6 h-6" />
          </div>
        </div>
      </div>

      {/* Control Bar */}
      <div className="bg-white p-4 rounded-[8px] border border-slate-200 shadow-sm flex flex-col md:flex-row items-center justify-between gap-4">
        <div className="relative w-full md:w-80">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
          <input
            type="text"
            placeholder="Search Staff by Name, ID, Designation..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-9 pr-4 py-2 bg-slate-50 border border-slate-200 text-slate-900 rounded-[8px] text-sm outline-none focus:ring-1 focus:ring-[#00315e] transition-all font-medium"
          />
        </div>

        <div className="flex items-center gap-1 bg-slate-100 p-1 rounded-[8px] self-end md:self-auto">
          {[
            { id: "all", label: `সকল স্টাফ (${staffList.length})` },
            { id: "configured", label: `নির্ধারিত (${configuredCount})` },
            { id: "pending", label: `বাকি (${pendingCount})` }
          ].map((tab) => (
            <button
              key={tab.id}
              onClick={() => setTabFilter(tab.id)}
              className={`px-3 py-1.5 text-xs font-bold rounded-[6px] transition-all cursor-pointer ${
                tabFilter === tab.id
                  ? "bg-white text-[#00315e] shadow-sm"
                  : "text-slate-600 hover:text-slate-900"
              }`}
            >
              {tab.label}
            </button>
          ))}
        </div>
      </div>

      {/* Salary Setup Table */}
      <div className="bg-white rounded-[8px] shadow-xl border border-slate-200 overflow-hidden">
        {loading ? (
          <div className="py-20 flex flex-col items-center justify-center">
            <div className="w-12 h-12 border-4 border-[#00315e] border-t-transparent rounded-full animate-spin mb-4"></div>
            <p className="text-slate-500 font-bold">স্যালারি সেটআপ লোড হচ্ছে...</p>
          </div>
        ) : filteredList.length === 0 ? (
          <div className="py-20 text-center space-y-3">
            <DollarSign className="w-16 h-16 text-slate-300 mx-auto" />
            <p className="text-base font-bold text-slate-600">কোনো কর্মীর রেকর্ড পাওয়া যায়নি</p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead className="bg-[#00315e24] text-slate-800 text-[11px] uppercase font-black tracking-wider whitespace-nowrap">
                <tr>
                  <th className="px-4 py-3.5">#</th>
                  <th className="px-4 py-3.5">কর্মীর তথ্য (Staff Info)</th>
                  <th className="px-4 py-3.5 text-right">মূল বেতন (Basic)</th>
                  <th className="px-4 py-3.5 text-right">বাড়ি ভাড়া (House)</th>
                  <th className="px-4 py-3.5 text-right">চিকিৎসা (Medical)</th>
                  <th className="px-4 py-3.5 text-right">যাতায়াত (Transport)</th>
                  <th className="px-4 py-3.5 text-right">অন্যান্য (Other)</th>
                  <th className="px-4 py-3.5 text-right">সর্বমোট বেতন (Gross)</th>
                  <th className="px-4 py-3.5 text-center">স্ট্যাটাস</th>
                  <th className="px-4 py-3.5 text-center">অ্যাকশন</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 text-xs font-bold text-slate-700 whitespace-nowrap">
                {filteredList.map((item, idx) => {
                  const { staff, setup, hasSetup } = item;

                  return (
                    <tr key={staff._id} className="hover:bg-slate-50/70 transition-colors">
                      <td className="px-4 py-3.5 text-slate-400">{idx + 1}</td>
                      <td className="px-4 py-3.5">
                        <div className="flex items-center gap-3">
                          <div className="w-9 h-9 rounded-full bg-slate-100 flex items-center justify-center font-black text-[#00315e] border border-slate-200">
                            {staff.photo ? (
                              <img src={staff.photo} alt={staff.name} className="w-full h-full object-cover rounded-full" />
                            ) : (
                              (staff.name || "S").charAt(0)
                            )}
                          </div>
                          <div>
                            <p className="font-black text-slate-900">{staff.name}</p>
                            <p className="text-[10px] text-slate-400 uppercase">
                              {staff.employeeID ? `${staff.employeeID} • ` : ""}{staff.designation || staff.role || "Staff"}
                            </p>
                          </div>
                        </div>
                      </td>

                      <td className="px-4 py-3.5 text-right text-slate-800">
                        {hasSetup ? formatCurrency(setup.basic_salary) : "-"}
                      </td>
                      <td className="px-4 py-3.5 text-right text-slate-600">
                        {hasSetup ? formatCurrency(setup.house_rent) : "-"}
                      </td>
                      <td className="px-4 py-3.5 text-right text-slate-600">
                        {hasSetup ? formatCurrency(setup.medical_allowance) : "-"}
                      </td>
                      <td className="px-4 py-3.5 text-right text-slate-600">
                        {hasSetup ? formatCurrency(setup.transport_allowance) : "-"}
                      </td>
                      <td className="px-4 py-3.5 text-right text-slate-600">
                        {hasSetup && setup.other_allowance > 0 ? formatCurrency(setup.other_allowance) : "-"}
                      </td>

                      <td className="px-4 py-3.5 text-right font-black text-[#00315e] text-sm">
                        {hasSetup ? formatCurrency(setup.total_salary) : "নির্ধারিত নয়"}
                      </td>

                      <td className="px-4 py-3.5 text-center">
                        {hasSetup ? (
                          <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-[10px] font-black uppercase tracking-wider bg-emerald-50 text-emerald-700 border border-emerald-200">
                            <span className="w-1.5 h-1.5 rounded-full bg-emerald-500" />
                            Configured
                          </span>
                        ) : (
                          <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-[10px] font-black uppercase tracking-wider bg-amber-50 text-amber-700 border border-amber-200">
                            <span className="w-1.5 h-1.5 rounded-full bg-amber-500" />
                            Pending Setup
                          </span>
                        )}
                      </td>

                      <td className="px-4 py-3.5 text-center">
                        {hasSetup ? (
                          <div className="flex items-center justify-center gap-2">
                            <button
                              onClick={() => openEditModal(setup)}
                              className="p-1.5 bg-[#00315e24] hover:bg-[#00315e33] text-[#00315e] rounded-[6px] cursor-pointer"
                              title="সম্পাদনা করুন"
                            >
                              <SquarePen className="w-4 h-4" />
                            </button>
                            <button
                              onClick={() => openDeleteModal(setup)}
                              className="p-1.5 hover:bg-rose-50 text-rose-500 rounded-[6px] cursor-pointer"
                              title="মুছে ফেলুন"
                            >
                              <Trash2 className="w-4 h-4" />
                            </button>
                          </div>
                        ) : (
                          <button
                            onClick={() => openNewModalForStaff(staff._id)}
                            className="px-3 py-1 bg-[#00315e] hover:bg-[#002547] text-white rounded-[6px] text-[11px] font-bold cursor-pointer transition-colors shadow-sm"
                          >
                            + Setup Salary
                          </button>
                        )}
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* Add / Edit Salary Setup Modal */}
      {showModal && (
        <div className="fixed inset-0 bg-slate-900/70 backdrop-blur-md z-[120] flex items-center justify-center p-4">
          <div className="bg-white rounded-[16px] w-full max-w-2xl shadow-2xl overflow-hidden flex flex-col max-h-[90vh] animate-in zoom-in duration-200">
            <div className="p-5 border-b border-slate-100 flex items-center justify-between bg-slate-50">
              <div>
                <h2 className="text-base font-black text-slate-800">
                  {editingSetup ? "বেতন কাঠামো পরিবর্তন (Update Salary Setup)" : "নতুন বেতন নির্ধারণ (Add Salary Setup)"}
                </h2>
                <p className="text-xs font-bold text-slate-400">Define basic pay scale and standard allowances</p>
              </div>
              <button
                onClick={() => {
                  setShowModal(false);
                  resetForm();
                }}
                className="p-1.5 text-slate-400 hover:text-slate-600 rounded-full cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="p-6 overflow-y-auto flex flex-col gap-4">
              <SelectInputField
                title={"কর্মী নির্বাচন (Staff)"}
                options={staffList.map((s) => ({
                  value: s._id,
                  label: `${s.name} - ${s.employeeID ? `[${s.employeeID}] ` : ""}${s.designation || s.role}`
                }))}
                value={formData.staff_id}
                setValue={(val) => handleInputChange("staff_id", val)}
              />

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <InputField
                  title={"মূল বেতন (Basic Salary) *"}
                  placeholder={"0.00"}
                  type={"number"}
                  value={formData.basic_salary}
                  setValue={(val) => handleInputChange("basic_salary", val)}
                />
                <InputField
                  title={"বাড়ি ভাড়া (House Rent)"}
                  placeholder={"0.00"}
                  type={"number"}
                  value={formData.house_rent}
                  setValue={(val) => handleInputChange("house_rent", val)}
                />
                <InputField
                  title={"চিকিৎসা ভাতা (Medical Allowance)"}
                  placeholder={"0.00"}
                  type={"number"}
                  value={formData.medical_allowance}
                  setValue={(val) => handleInputChange("medical_allowance", val)}
                />
                <InputField
                  title={"যাতায়াত ভাতা (Transport Allowance)"}
                  placeholder={"0.00"}
                  type={"number"}
                  value={formData.transport_allowance}
                  setValue={(val) => handleInputChange("transport_allowance", val)}
                />
                <InputField
                  title={"অন্যান্য বিশেষ ভাতা (Other Allowance)"}
                  placeholder={"0.00"}
                  type={"number"}
                  value={formData.other_allowance}
                  setValue={(val) => handleInputChange("other_allowance", val)}
                />
                <InputField
                  title={"কার্যকরের তারিখ (Effective From)"}
                  type={"date"}
                  value={formData.effective_from}
                  setValue={(val) => handleInputChange("effective_from", val)}
                />
              </div>

              {/* Total Salary Preview */}
              <div className="bg-[#00315e]/5 rounded-[8px] p-4 border border-[#00315e]/20 flex justify-between items-center">
                <div>
                  <span className="text-xs font-black text-slate-500 uppercase block">সর্বমোট মাসিক বেতন (Total Gross)</span>
                  <span className="text-[11px] font-bold text-slate-400">Basic + All Allowances</span>
                </div>
                <span className="text-2xl font-black text-[#00315e]">{formatCurrency(calculateTotal())}</span>
              </div>
            </div>

            <div className="p-4 border-t border-slate-100 bg-slate-50 flex justify-end gap-3">
              <button
                onClick={() => {
                  setShowModal(false);
                  resetForm();
                }}
                className="px-5 py-2 font-bold text-slate-600 hover:bg-white rounded-[8px] border border-slate-200 cursor-pointer text-xs"
              >
                বাতিল (Cancel)
              </button>
              <button
                onClick={handleSubmit}
                disabled={loading}
                className="px-6 py-2 bg-[#00315e] hover:bg-[#002547] text-white font-bold rounded-[8px] text-xs shadow-md cursor-pointer disabled:opacity-50"
              >
                {loading ? "সংরক্ষণ হচ্ছে..." : editingSetup ? "আপডেট করুন (Update Setup)" : "সংরক্ষণ করুন (Save Setup)"}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Delete Confirmation Modal */}
      {isDeleteModalOpen && (
        <div className="fixed inset-0 bg-slate-900/70 backdrop-blur-md z-[130] flex items-center justify-center p-4">
          <div className="bg-white rounded-[16px] w-full max-w-sm shadow-2xl p-6 text-center space-y-4 animate-in zoom-in duration-200">
            <div className="w-14 h-14 bg-rose-50 text-rose-500 rounded-full flex items-center justify-center mx-auto">
              <Trash2 className="w-7 h-7" />
            </div>
            <div>
              <h2 className="text-lg font-black text-slate-800">সেটআপ মুছে ফেলবেন?</h2>
              <p className="text-xs font-bold text-slate-500 mt-1">
                এই কর্মীর বেতন কাঠামো মুছে ফেলতে নিশ্চিত?
              </p>
            </div>
            <div className="flex gap-3 pt-2">
              <button
                onClick={() => setIsDeleteModalOpen(false)}
                className="flex-1 py-2 bg-slate-100 text-slate-600 rounded-[8px] font-bold text-xs cursor-pointer"
              >
                বাতিল
              </button>
              <button
                onClick={handleDelete}
                className="flex-1 py-2 bg-rose-600 text-white rounded-[8px] font-bold text-xs cursor-pointer hover:bg-rose-700 shadow-md"
              >
                হ্যাঁ, মুছুন
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default SalarySetup;
