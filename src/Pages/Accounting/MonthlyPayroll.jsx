import React, { useState, useEffect, useMemo } from "react";
import {
  Banknote,
  Calendar,
  Search,
  CheckCircle2,
  Clock,
  AlertCircle,
  Play,
  Printer,
  CreditCard,
  Edit3,
  Trash2,
  ChevronRight,
  TrendingUp,
  DollarSign,
  Users,
  Wallet,
  FileText,
  X,
  ArrowUpDown
} from "lucide-react";
import axiosInstance from "../../api/axiosInstance";
import { toast } from "react-hot-toast";
import PayslipPrintModal from "../../components/PayslipPrintModal";

const MonthlyPayroll = () => {
  const currentDate = new Date();
  const [selectedMonth, setSelectedMonth] = useState(currentDate.getMonth() + 1);
  const [selectedYear, setSelectedYear] = useState(currentDate.getFullYear());
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");

  const [loading, setLoading] = useState(false);
  const [generating, setGenerating] = useState(false);
  const [payrollData, setPayrollData] = useState([]);
  const [stats, setStats] = useState(null);

  // Payment Modal State
  const [payModalRecord, setPayModalRecord] = useState(null);
  const [payAmount, setPayAmount] = useState("");
  const [payMethod, setPayMethod] = useState("Cash");
  const [payNote, setPayNote] = useState("");
  const [paying, setPaying] = useState(false);

  // Adjust Modal State
  const [adjustRecord, setAdjustRecord] = useState(null);
  const [adjustBonus, setAdjustBonus] = useState(0);
  const [adjustAbsent, setAdjustAbsent] = useState(0);
  const [adjustAdvance, setAdjustAdvance] = useState(0);
  const [adjustNote, setAdjustNote] = useState("");
  const [adjusting, setAdjusting] = useState(false);

  // Payslip Print State
  const [payslipData, setPayslipData] = useState(null);
  const [loadingPayslip, setLoadingPayslip] = useState(false);

  const months = [
    { value: 1, label: "January (জানুয়ারি)" },
    { value: 2, label: "February (ফেব্রুয়ারি)" },
    { value: 3, label: "March (মার্চ)" },
    { value: 4, label: "April (এপ্রিল)" },
    { value: 5, label: "May (মে)" },
    { value: 6, label: "June (জুন)" },
    { value: 7, label: "July (জুলাই)" },
    { value: 8, label: "August (আগস্ট)" },
    { value: 9, label: "September (সেপ্টেম্বর)" },
    { value: 10, label: "October (অক্টোবর)" },
    { value: 11, label: "November (নভেম্বর)" },
    { value: 12, label: "December (ডিসেম্বর)" }
  ];

  const years = [2024, 2025, 2026, 2027, 2028];

  const formatCurrency = (amount) => {
    return new Intl.NumberFormat('en-BD', {
      style: 'currency',
      currency: 'BDT',
      minimumFractionDigits: 0
    }).format(amount || 0);
  };

  // Fetch Monthly Payroll
  const fetchMonthlyPayroll = async () => {
    setLoading(true);
    try {
      const res = await axiosInstance.get(
        `/payroll/v1/monthly?month=${selectedMonth}&year=${selectedYear}&status=${statusFilter}`
      );
      if (res.data.success) {
        setPayrollData(res.data.data || []);
        setStats(res.data.stats || null);
      }
    } catch (err) {
      console.error("Error fetching payroll:", err);
      toast.error(err.response?.data?.message || "পে-রোল ডাটা লোড করতে ব্যর্থ হয়েছে");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchMonthlyPayroll();
  }, [selectedMonth, selectedYear, statusFilter]);

  // Handle Payroll Generation
  const handleGenerate = async () => {
    const monthName = months.find((m) => m.value === parseInt(selectedMonth))?.label;
    if (!window.confirm(`${monthName}, ${selectedYear} এর জন্য মাসিক পে-রোল প্রস্তুত করতে চান?`)) {
      return;
    }

    setGenerating(true);
    try {
      const res = await axiosInstance.post('/payroll/v1/generate', {
        month: parseInt(selectedMonth),
        year: parseInt(selectedYear)
      });
      if (res.data.success) {
        toast.success(res.data.message);
        fetchMonthlyPayroll();
      }
    } catch (err) {
      console.error("Generation error:", err);
      toast.error(err.response?.data?.message || "পে-রোল জেনারেট করা সম্ভব হয়নি");
    } finally {
      setGenerating(false);
    }
  };

  // Open Pay Modal
  const openPayModal = (record) => {
    setPayModalRecord(record);
    setPayAmount(record.remaining_due || 0);
    setPayMethod("Cash");
    setPayNote("");
  };

  // Process Payment Submit
  const handlePaySubmit = async (e) => {
    e.preventDefault();
    if (!payModalRecord || !payAmount || parseFloat(payAmount) <= 0) {
      toast.error("সঠিক টাকার পরিমাণ লিখুন");
      return;
    }

    setPaying(true);
    try {
      const res = await axiosInstance.post('/payroll/v1/pay', {
        monthly_salary_id: payModalRecord._id,
        staff_id: payModalRecord.staff_id,
        amount: parseFloat(payAmount),
        payment_method: payMethod,
        note: payNote
      });

      if (res.data.success) {
        toast.success(res.data.message);
        const updatedRecordId = payModalRecord._id;
        setPayModalRecord(null);
        fetchMonthlyPayroll();

        // Prompt to print payslip
        if (window.confirm("বেতন পরিশোধ সফল হয়েছে! আপনি কি এখনই পে-স্লিপ প্রিন্ট করতে চান?")) {
          openPayslip(updatedRecordId);
        }
      }
    } catch (err) {
      console.error("Payment error:", err);
      toast.error(err.response?.data?.message || "বেতন পরিশোধ প্রক্রিয়া ব্যর্থ হয়েছে");
    } finally {
      setPaying(false);
    }
  };

  // Open Adjust Modal
  const openAdjustModal = (record) => {
    setAdjustRecord(record);
    setAdjustBonus(record.bonus || 0);
    setAdjustAbsent(record.absent_deduction || 0);
    setAdjustAdvance(record.advance_deduction || 0);
    setAdjustNote(record.note || "");
  };

  // Submit Adjustment
  const handleAdjustSubmit = async (e) => {
    e.preventDefault();
    if (!adjustRecord) return;

    setAdjusting(true);
    try {
      const res = await axiosInstance.put(`/payroll/v1/adjust/${adjustRecord._id}`, {
        bonus: parseFloat(adjustBonus || 0),
        absent_deduction: parseFloat(adjustAbsent || 0),
        advance_deduction: parseFloat(adjustAdvance || 0),
        note: adjustNote
      });

      if (res.data.success) {
        toast.success(res.data.message);
        setAdjustRecord(null);
        fetchMonthlyPayroll();
      }
    } catch (err) {
      console.error("Adjustment error:", err);
      toast.error(err.response?.data?.message || "সমন্বয় সংরক্ষণ করতে ব্যর্থ হয়েছে");
    } finally {
      setAdjusting(false);
    }
  };

  // Open Payslip Preview
  const openPayslip = async (monthlySalaryId) => {
    setLoadingPayslip(true);
    try {
      const res = await axiosInstance.get(`/payroll/v1/payslip/${monthlySalaryId}`);
      if (res.data.success) {
        setPayslipData(res.data.data);
      }
    } catch (err) {
      console.error("Payslip fetch error:", err);
      toast.error("পে-স্লিপ লোড করতে সমস্যা হয়েছে");
    } finally {
      setLoadingPayslip(false);
    }
  };

  // Delete/Reset single record
  const handleDeleteRecord = async (record) => {
    if (!window.confirm(`${record.staff_info?.name}-এর চলতি মাসের পে-রোল রেকর্ড মুছে ফেলতে চান?`)) {
      return;
    }

    try {
      const res = await axiosInstance.delete(`/payroll/v1/monthly/${record._id}`);
      if (res.data.success) {
        toast.success(res.data.message);
        fetchMonthlyPayroll();
      }
    } catch (err) {
      console.error("Delete error:", err);
      toast.error(err.response?.data?.message || "মুছে ফেলা সম্ভব হয়নি");
    }
  };

  // Filtered Records by search query
  const filteredRecords = useMemo(() => {
    if (!searchTerm.trim()) return payrollData;
    const term = searchTerm.toLowerCase().trim();
    return payrollData.filter((r) => {
      const name = r.staff_info?.name?.toLowerCase() || "";
      const empId = r.staff_info?.employeeID?.toLowerCase() || "";
      const role = r.staff_info?.role?.toLowerCase() || "";
      const desig = r.staff_info?.designation?.toLowerCase() || "";
      return name.includes(term) || empId.includes(term) || role.includes(term) || desig.includes(term);
    });
  }, [payrollData, searchTerm]);

  return (
    <div className="animate-in fade-in duration-500 space-y-6 pb-20">
      
      {/* Top Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-[20px] font-black text-slate-800 flex items-center gap-3">
            <Banknote className="w-8 h-8 text-[#00315e]" />
            Monthly Payroll (মাসিক পে-রোল)
          </h1>
          <p className="text-[14px] text-slate-500 font-bold mt-1">
            Generate, Review, and Disburse Staff Salaries & Payslips
          </p>
        </div>

        {/* Month & Year Selectors and Generate Button */}
        <div className="flex flex-wrap items-center gap-3">
          <div className="flex items-center gap-2 bg-white px-3 py-1.5 border border-slate-200 rounded-[8px] shadow-sm">
            <Calendar className="w-4 h-4 text-[#00315e]" />
            <select
              value={selectedMonth}
              onChange={(e) => setSelectedMonth(parseInt(e.target.value))}
              className="bg-transparent text-sm font-bold text-slate-800 outline-none cursor-pointer"
            >
              {months.map((m) => (
                <option key={m.value} value={m.value}>{m.label}</option>
              ))}
            </select>
            <select
              value={selectedYear}
              onChange={(e) => setSelectedYear(parseInt(e.target.value))}
              className="bg-transparent text-sm font-bold text-slate-800 outline-none cursor-pointer border-l border-slate-200 pl-2"
            >
              {years.map((y) => (
                <option key={y} value={y}>{y}</option>
              ))}
            </select>
          </div>

          <button
            onClick={handleGenerate}
            disabled={generating}
            className="px-5 py-2.5 bg-[#00315e] hover:bg-[#002547] text-white rounded-[8px] font-bold text-sm flex items-center gap-2 transition-all shadow-sm cursor-pointer disabled:opacity-50"
          >
            {generating ? (
              <span className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin"></span>
            ) : (
              <Play className="w-4 h-4 fill-current" />
            )}
            {generating ? "প্রসেস হচ্ছে..." : "Generate Payroll (পে-রোল তৈরি)"}
          </button>
        </div>
      </div>

      {/* Summary KPI Metric Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="bg-white rounded-[8px] p-5 shadow-lg border border-slate-100 flex items-center justify-between">
          <div>
            <p className="text-xs font-bold text-slate-400 uppercase tracking-wider">মোট নির্ধারিত বেতন</p>
            <p className="text-2xl font-black text-slate-900 mt-1">
              {formatCurrency(stats?.total_net_payable || 0)}
            </p>
            <p className="text-[11px] font-bold text-slate-500 mt-1">
              মোট কর্মী: {stats?.total_staff || 0} জন
            </p>
          </div>
          <div className="w-12 h-12 bg-blue-50 text-[#00315e] rounded-xl flex items-center justify-center">
            <DollarSign className="w-6 h-6" />
          </div>
        </div>

        <div className="bg-white rounded-[8px] p-5 shadow-lg border border-slate-100 flex items-center justify-between">
          <div>
            <p className="text-xs font-bold text-emerald-600 uppercase tracking-wider">পরিশোধিত (Paid)</p>
            <p className="text-2xl font-black text-emerald-700 mt-1">
              {formatCurrency(stats?.total_paid || 0)}
            </p>
            <p className="text-[11px] font-bold text-emerald-600 mt-1">
              {stats?.count_paid || 0} জন পূর্ণ পরিশোধ
            </p>
          </div>
          <div className="w-12 h-12 bg-emerald-50 text-emerald-600 rounded-xl flex items-center justify-center">
            <CheckCircle2 className="w-6 h-6" />
          </div>
        </div>

        <div className="bg-white rounded-[8px] p-5 shadow-lg border border-slate-100 flex items-center justify-between">
          <div>
            <p className="text-xs font-bold text-rose-500 uppercase tracking-wider">বকেয়া (Remaining Due)</p>
            <p className="text-2xl font-black text-rose-600 mt-1">
              {formatCurrency(stats?.total_due || 0)}
            </p>
            <p className="text-[11px] font-bold text-rose-500 mt-1">
              {stats?.count_unpaid || 0} জন অপরিশোধিত
            </p>
          </div>
          <div className="w-12 h-12 bg-rose-50 text-rose-500 rounded-xl flex items-center justify-center">
            <AlertCircle className="w-6 h-6" />
          </div>
        </div>

        <div className="bg-white rounded-[8px] p-5 shadow-lg border border-slate-100 flex items-center justify-between">
          <div>
            <p className="text-xs font-bold text-amber-600 uppercase tracking-wider">মোট কর্তন (Deductions)</p>
            <p className="text-2xl font-black text-amber-700 mt-1">
              {formatCurrency(stats?.total_deductions || 0)}
            </p>
            <p className="text-[11px] font-bold text-amber-600 mt-1">
              বোনাস যোগ: {formatCurrency(stats?.total_bonus || 0)}
            </p>
          </div>
          <div className="w-12 h-12 bg-amber-50 text-amber-600 rounded-xl flex items-center justify-center">
            <TrendingUp className="w-6 h-6" />
          </div>
        </div>
      </div>

      {/* Control Bar: Search & Status Filter */}
      <div className="bg-white p-4 rounded-[8px] border border-slate-200 shadow-sm flex flex-col md:flex-row items-center justify-between gap-4">
        <div className="relative w-full md:w-80">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
          <input
            type="text"
            placeholder="Search by Name, Staff ID, Designation..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-9 pr-4 py-2 bg-slate-50 border border-slate-200 text-slate-900 rounded-[8px] text-sm outline-none focus:ring-1 focus:ring-[#00315e] transition-all font-medium"
          />
        </div>

        <div className="flex items-center gap-3 w-full md:w-auto justify-end">
          <div className="flex items-center gap-1 bg-slate-100 p-1 rounded-[8px]">
            {[
              { id: "all", label: "All" },
              { id: "unpaid", label: "বকেয়া (Unpaid)" },
              { id: "partial", label: "আংশিক (Partial)" },
              { id: "paid", label: "পরিশোধিত (Paid)" }
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

          <button
            onClick={() => window.print()}
            className="px-4 py-2 bg-white border border-slate-200 text-slate-700 hover:bg-slate-50 rounded-[8px] font-bold text-xs flex items-center gap-2 cursor-pointer shadow-sm"
          >
            <Printer className="w-4 h-4" />
            প্রিন্ট শিট (Print Master Sheet)
          </button>
        </div>
      </div>

      {/* Master Payroll Table */}
      <div className="bg-white rounded-[8px] shadow-xl border border-slate-200 overflow-hidden">
        {loading ? (
          <div className="py-20 flex flex-col items-center justify-center">
            <div className="w-12 h-12 border-4 border-[#00315e] border-t-transparent rounded-full animate-spin mb-4"></div>
            <p className="text-slate-500 font-bold">পে-রোল তথ্য লোড হচ্ছে...</p>
          </div>
        ) : filteredRecords.length === 0 ? (
          <div className="py-20 text-center space-y-4">
            <Banknote className="w-16 h-16 text-slate-300 mx-auto" />
            <div>
              <p className="text-lg font-black text-slate-700">
                {selectedMonth} / {selectedYear} এর জন্য কোনো পে-রোল তৈরি করা হয়নি।
              </p>
              <p className="text-sm font-bold text-slate-400 mt-1">
                উপরের <span className="text-[#00315e] font-black">"Generate Payroll"</span> বাটনে ক্লিক করে পে-রোল প্রস্তুত করুন।
              </p>
            </div>
            <button
              onClick={handleGenerate}
              disabled={generating}
              className="px-6 py-2.5 bg-[#00315e] text-white font-bold rounded-[8px] text-xs hover:bg-[#002547] cursor-pointer"
            >
              এখনই পে-রোল তৈরি করুন (Generate Now)
            </button>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead className="bg-[#00315e24] text-slate-800 text-[11px] uppercase font-black tracking-wider whitespace-nowrap">
                <tr>
                  <th className="px-4 py-3.5">#</th>
                  <th className="px-4 py-3.5">কর্মীর তথ্য (Staff)</th>
                  <th className="px-4 py-3.5 text-right">মূল + ভাতা (Gross)</th>
                  <th className="px-4 py-3.5 text-right">বোনাস (+)</th>
                  <th className="px-4 py-3.5 text-right">কর্তন (-)</th>
                  <th className="px-4 py-3.5 text-right">নেট প্রদেয় (Net)</th>
                  <th className="px-4 py-3.5 text-right">পরিশোধ (Paid)</th>
                  <th className="px-4 py-3.5 text-right">বকেয়া (Due)</th>
                  <th className="px-4 py-3.5 text-center">স্ট্যাটাস</th>
                  <th className="px-4 py-3.5 text-center">অ্যাকশন (Actions)</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 text-xs font-bold text-slate-700 whitespace-nowrap">
                {filteredRecords.map((rec, idx) => {
                  const staff = rec.staff_info || {};
                  const totalDeductions = (rec.absent_deduction || 0) + (rec.advance_deduction || 0);

                  return (
                    <tr key={rec._id} className="hover:bg-slate-50/70 transition-colors">
                      <td className="px-4 py-3.5 text-slate-400">{idx + 1}</td>
                      <td className="px-4 py-3.5">
                        <div className="flex items-center gap-3">
                          <div className="w-9 h-9 rounded-full bg-slate-100 overflow-hidden flex items-center justify-center font-black text-[#00315e] shrink-0 border border-slate-200">
                            {staff.photo ? (
                              <img src={staff.photo} alt={staff.name} className="w-full h-full object-cover" />
                            ) : (
                              (staff.name || "S").charAt(0)
                            )}
                          </div>
                          <div>
                            <p className="font-black text-slate-900">{staff.name || "Staff Member"}</p>
                            <p className="text-[10px] text-slate-400 font-bold uppercase tracking-wider">
                              {staff.employeeID ? `${staff.employeeID} • ` : ""}{staff.designation || staff.role || "Staff"}
                            </p>
                          </div>
                        </div>
                      </td>

                      <td className="px-4 py-3.5 text-right text-slate-800">
                        {formatCurrency(rec.gross_salary)}
                      </td>

                      <td className="px-4 py-3.5 text-right text-emerald-600">
                        {rec.bonus > 0 ? `+${formatCurrency(rec.bonus)}` : "-"}
                      </td>

                      <td className="px-4 py-3.5 text-right text-rose-600">
                        {totalDeductions > 0 ? `-${formatCurrency(totalDeductions)}` : "-"}
                      </td>

                      <td className="px-4 py-3.5 text-right font-black text-[#00315e] text-sm">
                        {formatCurrency(rec.net_payable)}
                      </td>

                      <td className="px-4 py-3.5 text-right text-emerald-700 font-black">
                        {formatCurrency(rec.paid_amount)}
                      </td>

                      <td className="px-4 py-3.5 text-right text-rose-600 font-black">
                        {formatCurrency(rec.remaining_due)}
                      </td>

                      <td className="px-4 py-3.5 text-center">
                        <span
                          className={`inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-[10px] font-black uppercase tracking-wider ${
                            rec.status === "paid"
                              ? "bg-emerald-50 text-emerald-700 border border-emerald-200"
                              : rec.status === "partial"
                              ? "bg-amber-50 text-amber-700 border border-amber-200"
                              : "bg-rose-50 text-rose-700 border border-rose-200"
                          }`}
                        >
                          <span
                            className={`w-1.5 h-1.5 rounded-full ${
                              rec.status === "paid" ? "bg-emerald-500" : rec.status === "partial" ? "bg-amber-500" : "bg-rose-500"
                            }`}
                          />
                          {rec.status === "paid" ? "Paid" : rec.status === "partial" ? "Partial" : "Unpaid"}
                        </span>
                      </td>

                      <td className="px-4 py-3.5 text-center">
                        <div className="flex items-center justify-center gap-2">
                          {rec.status !== "paid" && (
                            <button
                              onClick={() => openPayModal(rec)}
                              className="px-3 py-1 bg-emerald-600 hover:bg-emerald-700 text-white rounded-[6px] text-[11px] font-bold flex items-center gap-1 cursor-pointer transition-colors shadow-sm"
                              title="বেতন পরিশোধ করুন"
                            >
                              <CreditCard className="w-3.5 h-3.5" />
                              Pay
                            </button>
                          )}

                          <button
                            onClick={() => openPayslip(rec._id)}
                            className="p-1.5 bg-[#00315e24] hover:bg-[#00315e33] text-[#00315e] rounded-[6px] cursor-pointer transition-colors"
                            title="পে-স্লিপ দেখুন ও প্রিন্ট করুন"
                          >
                            <FileText className="w-3.5 h-3.5" />
                          </button>

                          <button
                            onClick={() => openAdjustModal(rec)}
                            className="p-1.5 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-[6px] cursor-pointer transition-colors"
                            title="বোনাস বা কর্তন সমন্বয় করুন"
                          >
                            <Edit3 className="w-3.5 h-3.5" />
                          </button>

                          {rec.paid_amount === 0 && (
                            <button
                              onClick={() => handleDeleteRecord(rec)}
                              className="p-1.5 hover:bg-rose-50 text-slate-400 hover:text-rose-600 rounded-[6px] cursor-pointer transition-colors"
                              title="রেকর্ড মুছে ফেলুন"
                            >
                              <Trash2 className="w-3.5 h-3.5" />
                            </button>
                          )}
                        </div>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* Pay Salary Modal */}
      {payModalRecord && (
        <div className="fixed inset-0 z-[120] bg-slate-900/60 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-white rounded-[16px] w-full max-w-lg shadow-2xl overflow-hidden animate-in zoom-in duration-200">
            <div className="p-5 border-b border-slate-100 flex justify-between items-center bg-slate-50">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 bg-emerald-100 text-emerald-700 rounded-xl flex items-center justify-center">
                  <CreditCard className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="font-black text-slate-800 text-base">বেতন পরিশোধ (Pay Salary)</h3>
                  <p className="text-xs font-bold text-slate-500">
                    {payModalRecord.staff_info?.name} ({payModalRecord.staff_info?.designation || payModalRecord.staff_info?.role})
                  </p>
                </div>
              </div>
              <button
                onClick={() => setPayModalRecord(null)}
                className="p-1 text-slate-400 hover:text-slate-600 rounded-full"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handlePaySubmit} className="p-6 space-y-4">
              <div className="grid grid-cols-2 gap-4 p-3 bg-slate-50 rounded-[8px] border border-slate-100 text-xs">
                <div>
                  <span className="text-slate-400 block font-bold">চলতি মাসের নিট বেতন</span>
                  <span className="text-sm font-black text-slate-800 mt-0.5 block">
                    {formatCurrency(payModalRecord.net_payable)}
                  </span>
                </div>
                <div>
                  <span className="text-slate-400 block font-bold">বর্তমান অবশিষ্ট বকেয়া</span>
                  <span className="text-sm font-black text-rose-600 mt-0.5 block">
                    {formatCurrency(payModalRecord.remaining_due)}
                  </span>
                </div>
              </div>

              <div>
                <label className="text-xs font-black text-slate-700 block mb-1">
                  পরিশোধযোগ্য টাকার পরিমাণ (Amount in ৳) *
                </label>
                <input
                  type="number"
                  required
                  min="1"
                  max={payModalRecord.remaining_due}
                  value={payAmount}
                  onChange={(e) => setPayAmount(e.target.value)}
                  className="w-full px-4 py-2.5 border border-slate-200 rounded-[8px] text-lg font-black text-emerald-700 focus:outline-none focus:ring-1 focus:ring-emerald-500 bg-emerald-50/20"
                />
              </div>

              <div>
                <label className="text-xs font-black text-slate-700 block mb-1">
                  পেমেন্ট মেথড (Payment Method) *
                </label>
                <select
                  value={payMethod}
                  onChange={(e) => setPayMethod(e.target.value)}
                  className="w-full px-4 py-2 border border-slate-200 rounded-[8px] text-sm font-bold text-slate-800 outline-none focus:ring-1 focus:ring-[#00315e] bg-white"
                >
                  <option value="Cash">ক্যাশ (Cash)</option>
                  <option value="Bank">ব্যাংক ট্রান্সফার (Bank Transfer)</option>
                  <option value="Mobile Banking">মোবাইল ব্যাংকিং (bKash / Nagad / Rocket)</option>
                </select>
              </div>

              <div>
                <label className="text-xs font-black text-slate-700 block mb-1">
                  মন্তব্য / রেফারেন্স নোট (Optional)
                </label>
                <input
                  type="text"
                  placeholder="যেমন: সেপ্টেম্বর মাসের বেতন বা কোনো রসিদ নম্বর"
                  value={payNote}
                  onChange={(e) => setPayNote(e.target.value)}
                  className="w-full px-4 py-2 border border-slate-200 rounded-[8px] text-sm font-medium text-slate-700 outline-none focus:ring-1 focus:ring-[#00315e]"
                />
              </div>

              <div className="pt-3 flex justify-end gap-3 border-t border-slate-100">
                <button
                  type="button"
                  onClick={() => setPayModalRecord(null)}
                  className="px-5 py-2 text-xs font-bold text-slate-600 hover:bg-slate-100 rounded-[8px]"
                >
                  বাতিল (Cancel)
                </button>
                <button
                  type="submit"
                  disabled={paying}
                  className="px-6 py-2 bg-emerald-600 hover:bg-emerald-700 text-white font-black text-xs rounded-[8px] flex items-center gap-2 shadow-md cursor-pointer disabled:opacity-50"
                >
                  {paying ? "প্রসেস হচ্ছে..." : "নিশ্চিত করুন (Confirm Payment)"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Adjust Modal */}
      {adjustRecord && (
        <div className="fixed inset-0 z-[120] bg-slate-900/60 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-white rounded-[16px] w-full max-w-lg shadow-2xl overflow-hidden animate-in zoom-in duration-200">
            <div className="p-5 border-b border-slate-100 flex justify-between items-center bg-slate-50">
              <div>
                <h3 className="font-black text-slate-800 text-base">বোনাস ও কর্তন সমন্বয় (Adjust Payroll)</h3>
                <p className="text-xs font-bold text-slate-500">{adjustRecord.staff_info?.name}</p>
              </div>
              <button onClick={() => setAdjustRecord(null)} className="p-1 text-slate-400 hover:text-slate-600">
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleAdjustSubmit} className="p-6 space-y-4">
              <div className="p-3 bg-blue-50/50 rounded-[8px] border border-blue-100 text-xs font-bold text-slate-700">
                গ্রস বেতন: <span className="font-black text-[#00315e]">{formatCurrency(adjustRecord.gross_salary)}</span>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="text-xs font-bold text-emerald-700 block mb-1">
                    বোনাস যোগ (Festival / Eid Bonus) +
                  </label>
                  <input
                    type="number"
                    min="0"
                    value={adjustBonus}
                    onChange={(e) => setAdjustBonus(e.target.value)}
                    className="w-full px-3 py-2 border border-slate-200 rounded-[8px] text-sm font-bold text-slate-800"
                  />
                </div>

                <div>
                  <label className="text-xs font-bold text-rose-600 block mb-1">
                    অনুপস্থিতি কর্তন (Absent Days) -
                  </label>
                  <input
                    type="number"
                    min="0"
                    value={adjustAbsent}
                    onChange={(e) => setAdjustAbsent(e.target.value)}
                    className="w-full px-3 py-2 border border-slate-200 rounded-[8px] text-sm font-bold text-slate-800"
                  />
                </div>

                <div className="sm:col-span-2">
                  <label className="text-xs font-bold text-rose-600 block mb-1">
                    অগ্রিম বেতন কর্তন (Advance Recovery) -
                  </label>
                  <input
                    type="number"
                    min="0"
                    value={adjustAdvance}
                    onChange={(e) => setAdjustAdvance(e.target.value)}
                    className="w-full px-3 py-2 border border-slate-200 rounded-[8px] text-sm font-bold text-slate-800"
                  />
                  {adjustRecord.active_advance_balance > 0 && (
                    <p className="text-[11px] font-bold text-amber-600 mt-1">
                      * এই কর্মীর মোট অগ্রিম ঋণ রয়েছে: ৳{adjustRecord.active_advance_balance.toLocaleString()}
                    </p>
                  )}
                </div>
              </div>

              <div>
                <label className="text-xs font-bold text-slate-600 block mb-1">সমন্বয়ের কারণ / নোট</label>
                <input
                  type="text"
                  value={adjustNote}
                  onChange={(e) => setAdjustNote(e.target.value)}
                  placeholder="যেমন: ৩ দিন বিনা বেতনে ছুটির কর্তন"
                  className="w-full px-3 py-2 border border-slate-200 rounded-[8px] text-sm font-medium text-slate-700"
                />
              </div>

              {/* Net Recalculation Preview */}
              <div className="p-3 bg-slate-50 rounded-[8px] flex justify-between items-center text-xs font-bold border border-slate-200">
                <span>নতুন নিট প্রদেয় (New Net Payable):</span>
                <span className="text-base font-black text-[#00315e]">
                  {formatCurrency(
                    Math.max(
                      0,
                      (adjustRecord.gross_salary || 0) +
                        parseFloat(adjustBonus || 0) -
                        parseFloat(adjustAbsent || 0) -
                        parseFloat(adjustAdvance || 0)
                    )
                  )}
                </span>
              </div>

              <div className="pt-3 flex justify-end gap-3 border-t border-slate-100">
                <button
                  type="button"
                  onClick={() => setAdjustRecord(null)}
                  className="px-5 py-2 text-xs font-bold text-slate-600 hover:bg-slate-100 rounded-[8px]"
                >
                  বাতিল
                </button>
                <button
                  type="submit"
                  disabled={adjusting}
                  className="px-6 py-2 bg-[#00315e] text-white font-bold text-xs rounded-[8px] hover:bg-[#002547] cursor-pointer"
                >
                  {adjusting ? "সংরক্ষণ হচ্ছে..." : "আপডেট করুন (Save Adjustments)"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Payslip Modal */}
      {payslipData && (
        <PayslipPrintModal
          data={payslipData}
          onClose={() => setPayslipData(null)}
        />
      )}

    </div>
  );
};

export default MonthlyPayroll;
