import React, { useState, useEffect, useMemo } from "react";
import {
  Wallet,
  Plus,
  Search,
  Calendar,
  CreditCard,
  CheckCircle,
  AlertCircle,
  Clock,
  User,
  ArrowDownRight,
  TrendingDown,
  X
} from "lucide-react";
import axiosInstance from "../../api/axiosInstance";
import { toast } from "react-hot-toast";

const AdvanceLoans = () => {
  const [advances, setAdvances] = useState([]);
  const [staffList, setStaffList] = useState([]);
  const [loading, setLoading] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");

  // Modal State
  const [showModal, setShowModal] = useState(false);
  const [saving, setSaving] = useState(false);
  const [formData, setFormData] = useState({
    staff_id: "",
    amount: "",
    payment_method: "Cash",
    reason: "",
    date: new Date().toISOString().split("T")[0]
  });

  const formatCurrency = (amount) => {
    return new Intl.NumberFormat("en-BD", {
      style: "currency",
      currency: "BDT",
      minimumFractionDigits: 0
    }).format(amount || 0);
  };

  const fetchAdvances = async () => {
    setLoading(true);
    try {
      const res = await axiosInstance.get("/payroll/v1/advance");
      if (res.data.success) {
        setAdvances(res.data.data || []);
      }
    } catch (err) {
      console.error("Error fetching advances:", err);
      toast.error("অগ্রিম বেতনের তালিকা লোড করতে ব্যর্থ হয়েছে");
    } finally {
      setLoading(false);
    }
  };

  const fetchStaffList = async () => {
    try {
      const res = await axiosInstance.get("/v1/staff");
      if (res.data.success) {
        setStaffList(res.data.data || []);
      }
    } catch (err) {
      console.error("Error fetching staff:", err);
    }
  };

  useEffect(() => {
    fetchAdvances();
    fetchStaffList();
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!formData.staff_id || !formData.amount || parseFloat(formData.amount) <= 0) {
      toast.error("অনুগ্রহ করে স্টাফ ও সঠিক টাকার পরিমাণ নির্বাচন করুন");
      return;
    }

    setSaving(true);
    try {
      const res = await axiosInstance.post("/payroll/v1/advance", {
        staff_id: formData.staff_id,
        amount: parseFloat(formData.amount),
        payment_method: formData.payment_method,
        reason: formData.reason,
        date: formData.date
      });

      if (res.data.success) {
        toast.success(res.data.message);
        setShowModal(false);
        setFormData({
          staff_id: "",
          amount: "",
          payment_method: "Cash",
          reason: "",
          date: new Date().toISOString().split("T")[0]
        });
        fetchAdvances();
      }
    } catch (err) {
      console.error("Advance save error:", err);
      toast.error(err.response?.data?.message || "অগ্রিম প্রদান সম্পন্ন করা যায়নি");
    } finally {
      setSaving(false);
    }
  };

  // Stats
  const totalGiven = advances.reduce((sum, a) => sum + (a.amount || 0), 0);
  const totalBalance = advances.reduce((sum, a) => sum + (a.balance || 0), 0);
  const totalRecovered = advances.reduce((sum, a) => sum + (a.recovered_amount || 0), 0);

  const filteredAdvances = useMemo(() => {
    return advances.filter((adv) => {
      const staff = adv.staff_info || {};
      const name = staff.name?.toLowerCase() || "";
      const empId = staff.employeeID?.toLowerCase() || "";
      const reason = adv.reason?.toLowerCase() || "";
      const matchesSearch = !searchTerm || name.includes(searchTerm.toLowerCase()) || empId.includes(searchTerm.toLowerCase()) || reason.includes(searchTerm.toLowerCase());

      const isSettled = (adv.balance || 0) <= 0;
      const matchesStatus =
        statusFilter === "all" ||
        (statusFilter === "active" && !isSettled) ||
        (statusFilter === "settled" && isSettled);

      return matchesSearch && matchesStatus;
    });
  }, [advances, searchTerm, statusFilter]);

  return (
    <div className="animate-in fade-in duration-500 space-y-6 pb-20">
      
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-[20px] font-black text-slate-800 flex items-center gap-3">
            <Wallet className="w-8 h-8 text-[#00315e]" />
            Advance & Loans (অগ্রিম বেতন ও ঋণ)
          </h1>
          <p className="text-[14px] text-slate-500 font-bold mt-1">
            Track Staff Salary Advances, Qard-Hasan, and Monthly Deductions
          </p>
        </div>

        <button
          onClick={() => setShowModal(true)}
          className="px-5 py-2.5 bg-[#00315e] hover:bg-[#002547] text-white rounded-[8px] font-bold text-sm flex items-center gap-2 shadow-sm cursor-pointer transition-all self-start md:self-auto"
        >
          <Plus className="w-4 h-4" />
          Give Advance (নতুন অগ্রিম দিন)
        </button>
      </div>

      {/* KPI Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div className="bg-white rounded-[8px] p-5 shadow-lg border border-slate-100 flex items-center justify-between">
          <div>
            <p className="text-xs font-bold text-slate-400 uppercase tracking-wider">সর্বমোট প্রদত্ত অগ্রিম</p>
            <p className="text-2xl font-black text-slate-900 mt-1">{formatCurrency(totalGiven)}</p>
            <p className="text-[11px] font-bold text-slate-400 mt-1">মোট লেনদেন: {advances.length}টি</p>
          </div>
          <div className="w-12 h-12 bg-blue-50 text-[#00315e] rounded-xl flex items-center justify-center">
            <Wallet className="w-6 h-6" />
          </div>
        </div>

        <div className="bg-white rounded-[8px] p-5 shadow-lg border border-slate-100 flex items-center justify-between">
          <div>
            <p className="text-xs font-bold text-rose-500 uppercase tracking-wider">বর্তমান বকেয়া (Outstanding)</p>
            <p className="text-2xl font-black text-rose-600 mt-1">{formatCurrency(totalBalance)}</p>
            <p className="text-[11px] font-bold text-rose-500 mt-1">কর্মীদের নিকট পাওনা</p>
          </div>
          <div className="w-12 h-12 bg-rose-50 text-rose-500 rounded-xl flex items-center justify-center">
            <TrendingDown className="w-6 h-6" />
          </div>
        </div>

        <div className="bg-white rounded-[8px] p-5 shadow-lg border border-slate-100 flex items-center justify-between">
          <div>
            <p className="text-xs font-bold text-emerald-600 uppercase tracking-wider">মোট আদায়কৃত (Recovered)</p>
            <p className="text-2xl font-black text-emerald-700 mt-1">{formatCurrency(totalRecovered)}</p>
            <p className="text-[11px] font-bold text-emerald-600 mt-1">বেতন থেকে স্বয়ংক্রিয় কর্তিত</p>
          </div>
          <div className="w-12 h-12 bg-emerald-50 text-emerald-600 rounded-xl flex items-center justify-center">
            <CheckCircle className="w-6 h-6" />
          </div>
        </div>
      </div>

      {/* Filter and Search Bar */}
      <div className="bg-white p-4 rounded-[8px] border border-slate-200 shadow-sm flex flex-col md:flex-row items-center justify-between gap-4">
        <div className="relative w-full md:w-80">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
          <input
            type="text"
            placeholder="Search by Name, Employee ID or Reason..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-9 pr-4 py-2 bg-slate-50 border border-slate-200 text-slate-900 rounded-[8px] text-sm outline-none focus:ring-1 focus:ring-[#00315e] transition-all font-medium"
          />
        </div>

        <div className="flex items-center gap-1 bg-slate-100 p-1 rounded-[8px] self-end md:self-auto">
          {[
            { id: "all", label: "All Records" },
            { id: "active", label: "চলতি ঋণ (Active)" },
            { id: "settled", label: "পরিশোধিত (Settled)" }
          ].map((tab) => (
            <button
              key={tab.id}
              onClick={() => setStatusFilter(tab.id)}
              className={`px-3 py-1.5 text-xs font-bold rounded-[6px] transition-all cursor-pointer ${
                statusFilter === tab.id
                  ? "bg-white text-[#00315e] shadow-sm"
                  : "text-slate-600 hover:text-slate-900"
              }`}
            >
              {tab.label}
            </button>
          ))}
        </div>
      </div>

      {/* Advances Table */}
      <div className="bg-white rounded-[8px] shadow-xl border border-slate-200 overflow-hidden">
        {loading ? (
          <div className="py-20 flex flex-col items-center justify-center">
            <div className="w-12 h-12 border-4 border-[#00315e] border-t-transparent rounded-full animate-spin mb-4"></div>
            <p className="text-slate-500 font-bold">অগ্রিমের তথ্য লোড হচ্ছে...</p>
          </div>
        ) : filteredAdvances.length === 0 ? (
          <div className="py-20 text-center space-y-3">
            <Wallet className="w-16 h-16 text-slate-300 mx-auto" />
            <p className="text-base font-bold text-slate-600">কোনো অগ্রিম বেতনের রেকর্ড পাওয়া যায়নি</p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead className="bg-[#00315e24] text-slate-800 text-[11px] uppercase font-black tracking-wider whitespace-nowrap">
                <tr>
                  <th className="px-4 py-3.5">#</th>
                  <th className="px-4 py-3.5">কর্মীর তথ্য (Staff)</th>
                  <th className="px-4 py-3.5">তারিখ (Date)</th>
                  <th className="px-4 py-3.5 text-right">অগ্রিম টাকা (Amount)</th>
                  <th className="px-4 py-3.5 text-right">আদায়কৃত (Recovered)</th>
                  <th className="px-4 py-3.5 text-right">অবশিষ্ট বকেয়া (Balance)</th>
                  <th className="px-4 py-3.5">পেমেন্ট মেথড</th>
                  <th className="px-4 py-3.5">কারণ / মন্তব্য</th>
                  <th className="px-4 py-3.5 text-center">স্ট্যাটাস</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 text-xs font-bold text-slate-700 whitespace-nowrap">
                {filteredAdvances.map((adv, idx) => {
                  const staff = adv.staff_info || {};
                  const isSettled = (adv.balance || 0) <= 0;

                  return (
                    <tr key={adv._id} className="hover:bg-slate-50/70 transition-colors">
                      <td className="px-4 py-3.5 text-slate-400">{idx + 1}</td>
                      <td className="px-4 py-3.5">
                        <div className="flex items-center gap-3">
                          <div className="w-8 h-8 rounded-full bg-slate-100 flex items-center justify-center font-black text-[#00315e] border border-slate-200">
                            {(staff.name || "S").charAt(0)}
                          </div>
                          <div>
                            <p className="font-black text-slate-900">{staff.name || "Unknown"}</p>
                            <p className="text-[10px] text-slate-400 uppercase">
                              {staff.employeeID ? `${staff.employeeID} • ` : ""}{staff.designation || staff.role || "Staff"}
                            </p>
                          </div>
                        </div>
                      </td>
                      <td className="px-4 py-3.5 text-slate-600">
                        {new Date(adv.date || adv.created_at).toLocaleDateString("en-GB")}
                      </td>
                      <td className="px-4 py-3.5 text-right font-black text-slate-900">
                        {formatCurrency(adv.amount)}
                      </td>
                      <td className="px-4 py-3.5 text-right text-emerald-700 font-bold">
                        {formatCurrency(adv.recovered_amount)}
                      </td>
                      <td className="px-4 py-3.5 text-right font-black text-rose-600">
                        {formatCurrency(adv.balance)}
                      </td>
                      <td className="px-4 py-3.5">
                        <span className="px-2 py-0.5 bg-slate-100 text-slate-700 rounded text-[11px]">
                          {adv.payment_method || "Cash"}
                        </span>
                      </td>
                      <td className="px-4 py-3.5 text-slate-500 max-w-xs truncate">
                        {adv.reason || "-"}
                      </td>
                      <td className="px-4 py-3.5 text-center">
                        <span
                          className={`inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-[10px] font-black uppercase tracking-wider ${
                            isSettled
                              ? "bg-emerald-50 text-emerald-700 border border-emerald-200"
                              : "bg-rose-50 text-rose-700 border border-rose-200"
                          }`}
                        >
                          <span className={`w-1.5 h-1.5 rounded-full ${isSettled ? "bg-emerald-500" : "bg-rose-500"}`} />
                          {isSettled ? "Settled" : "Active"}
                        </span>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* Give Advance Modal */}
      {showModal && (
        <div className="fixed inset-0 z-[120] bg-slate-900/60 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-white rounded-[16px] w-full max-w-lg shadow-2xl overflow-hidden animate-in zoom-in duration-200">
            <div className="p-5 border-b border-slate-100 flex justify-between items-center bg-slate-50">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 bg-blue-50 text-[#00315e] rounded-xl flex items-center justify-center">
                  <Wallet className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="font-black text-slate-800 text-base">অগ্রিম বেতন প্রদান (Give Salary Advance)</h3>
                  <p className="text-xs font-bold text-slate-400">Record loan or advance against upcoming salaries</p>
                </div>
              </div>
              <button
                onClick={() => setShowModal(false)}
                className="p-1 text-slate-400 hover:text-slate-600 rounded-full"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleSubmit} className="p-6 space-y-4">
              <div>
                <label className="text-xs font-black text-slate-700 block mb-1">
                  কর্মী নির্বাচন করুন (Select Staff) *
                </label>
                <select
                  required
                  value={formData.staff_id}
                  onChange={(e) => setFormData({ ...formData, staff_id: e.target.value })}
                  className="w-full px-4 py-2 border border-slate-200 rounded-[8px] text-sm font-bold text-slate-800 outline-none focus:ring-1 focus:ring-[#00315e] bg-white"
                >
                  <option value="">কর্মচারী নির্বাচন করুন...</option>
                  {staffList.map((s) => (
                    <option key={s._id} value={s._id}>
                      {s.name} ({s.employeeID || s.designation || s.role})
                    </option>
                  ))}
                </select>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="text-xs font-black text-slate-700 block mb-1">
                    অগ্রিমের পরিমাণ (Amount in ৳) *
                  </label>
                  <input
                    type="number"
                    required
                    min="1"
                    placeholder="0"
                    value={formData.amount}
                    onChange={(e) => setFormData({ ...formData, amount: e.target.value })}
                    className="w-full px-4 py-2 border border-slate-200 rounded-[8px] text-base font-black text-slate-900 outline-none focus:ring-1 focus:ring-[#00315e]"
                  />
                </div>

                <div>
                  <label className="text-xs font-black text-slate-700 block mb-1">
                    প্রদানের তারিখ (Date) *
                  </label>
                  <input
                    type="date"
                    required
                    value={formData.date}
                    onChange={(e) => setFormData({ ...formData, date: e.target.value })}
                    className="w-full px-4 py-2 border border-slate-200 rounded-[8px] text-sm font-bold text-slate-800 outline-none focus:ring-1 focus:ring-[#00315e]"
                  />
                </div>
              </div>

              <div>
                <label className="text-xs font-black text-slate-700 block mb-1">
                  পেমেন্ট মেথড (Payment Method) *
                </label>
                <select
                  value={formData.payment_method}
                  onChange={(e) => setFormData({ ...formData, payment_method: e.target.value })}
                  className="w-full px-4 py-2 border border-slate-200 rounded-[8px] text-sm font-bold text-slate-800 outline-none focus:ring-1 focus:ring-[#00315e] bg-white"
                >
                  <option value="Cash">ক্যাশ (Cash)</option>
                  <option value="Bank">ব্যাংক ট্রান্সফার (Bank Transfer)</option>
                  <option value="Mobile Banking">মোবাইল ব্যাংকিং (bKash / Nagad / Rocket)</option>
                </select>
              </div>

              <div>
                <label className="text-xs font-black text-slate-700 block mb-1">
                  অগ্রিম গ্রহণের কারণ / বিবরণ (Reason / Note)
                </label>
                <input
                  type="text"
                  placeholder="যেমন: পারিবারিক প্রয়োজনে অগ্রিম গ্রহণ"
                  value={formData.reason}
                  onChange={(e) => setFormData({ ...formData, reason: e.target.value })}
                  className="w-full px-4 py-2 border border-slate-200 rounded-[8px] text-sm font-medium text-slate-700 outline-none focus:ring-1 focus:ring-[#00315e]"
                />
              </div>

              <div className="pt-3 flex justify-end gap-3 border-t border-slate-100">
                <button
                  type="button"
                  onClick={() => setShowModal(false)}
                  className="px-5 py-2 text-xs font-bold text-slate-600 hover:bg-slate-100 rounded-[8px]"
                >
                  বাতিল
                </button>
                <button
                  type="submit"
                  disabled={saving}
                  className="px-6 py-2 bg-[#00315e] hover:bg-[#002547] text-white font-black text-xs rounded-[8px] flex items-center gap-2 shadow-md cursor-pointer disabled:opacity-50"
                >
                  {saving ? "সংরক্ষণ হচ্ছে..." : "অগ্রিম প্রদান নিশ্চিত করুন"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

    </div>
  );
};

export default AdvanceLoans;
