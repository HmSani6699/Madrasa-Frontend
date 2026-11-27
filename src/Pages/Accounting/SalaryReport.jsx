import { useState, useEffect, useMemo, useCallback } from "react";
import {
  Banknote,
  Search,
  Printer,
  Download,
  FilterX,
  Loader2,
  ChevronLeft,
  ChevronRight,
  Wallet,
  CheckCircle2,
  Clock,
  AlertCircle,
  Users,
} from "lucide-react";
import { toast } from "react-hot-toast";
import axiosInstance from "../../api/axiosInstance";
import accountantService from "../../services/accountantService";
import { useAuth } from "../../context/AuthContext";
import PayslipPrintModal from "../../components/PayslipPrintModal";
import {
  exportToCSV,
  printHtmlReport,
  formatBDT,
  MONTH_OPTIONS,
  getMonthLabelBn,
} from "../../utils/reportExport";

const ITEMS_PER_PAGE = 15;

const SalaryReport = () => {
  const { currentMadrasa } = useAuth();
  const [activeTab, setActiveTab] = useState("salary"); // "salary" | "advance"
  const [salaryRows, setSalaryRows] = useState([]);
  const [advanceRows, setAdvanceRows] = useState([]);
  const [loading, setLoading] = useState(true);

  const [searchTerm, setSearchTerm] = useState("");
  const [selectedMonth, setSelectedMonth] = useState("all");
  const [selectedYear, setSelectedYear] = useState("all");
  const [selectedStatus, setSelectedStatus] = useState("all");
  const [currentPage, setCurrentPage] = useState(1);

  const [payslipData, setPayslipData] = useState(null);
  const [loadingPayslip, setLoadingPayslip] = useState(false);

  const fetchSalaryReport = useCallback(async () => {
    setLoading(true);
    try {
      const res = await accountantService.getSalaryReport({
        month: selectedMonth,
        year: selectedYear,
        status: selectedStatus,
      });
      if (res?.success) {
        setSalaryRows(res.data || []);
        setAdvanceRows(res.advances || []);
      }
    } catch (err) {
      console.error("Salary Report Error:", err);
      toast.error(err?.response?.data?.message || "বেতন রিপোর্ট লোড করতে সমস্যা হয়েছে");
    } finally {
      setLoading(false);
    }
  }, [selectedMonth, selectedYear, selectedStatus]);

  useEffect(() => {
    fetchSalaryReport();
  }, [fetchSalaryReport]);

  const filteredSalaries = useMemo(() => {
    const q = searchTerm.trim().toLowerCase();
    if (!q) return salaryRows;
    return salaryRows.filter(
      (r) =>
        (r.staff_name || "").toLowerCase().includes(q) ||
        (r.employee_id || "").toLowerCase().includes(q) ||
        (r.designation || "").toLowerCase().includes(q) ||
        (r.phone || "").toLowerCase().includes(q)
    );
  }, [salaryRows, searchTerm]);

  const filteredAdvances = useMemo(() => {
    const q = searchTerm.trim().toLowerCase();
    if (!q) return advanceRows;
    return advanceRows.filter(
      (r) =>
        (r.staff_name || "").toLowerCase().includes(q) ||
        (r.employee_id || "").toLowerCase().includes(q) ||
        (r.reason || "").toLowerCase().includes(q)
    );
  }, [advanceRows, searchTerm]);

  useEffect(() => {
    setCurrentPage(1);
  }, [activeTab, searchTerm, selectedMonth, selectedYear, selectedStatus]);

  const activeList = activeTab === "salary" ? filteredSalaries : filteredAdvances;
  const totalPages = Math.max(1, Math.ceil(activeList.length / ITEMS_PER_PAGE));
  const paginatedRows = useMemo(() => {
    const start = (currentPage - 1) * ITEMS_PER_PAGE;
    return activeList.slice(start, start + ITEMS_PER_PAGE);
  }, [activeList, currentPage]);

  const totals = useMemo(() => {
    return {
      gross: filteredSalaries.reduce((s, r) => s + Number(r.gross_salary || 0), 0),
      bonus: filteredSalaries.reduce((s, r) => s + Number(r.bonus || 0), 0),
      deductions: filteredSalaries.reduce((s, r) => s + Number(r.total_deductions || 0), 0),
      net: filteredSalaries.reduce((s, r) => s + Number(r.net_payable || 0), 0),
      paid: filteredSalaries.reduce((s, r) => s + Number(r.paid_amount || 0), 0),
      due: filteredSalaries.reduce((s, r) => s + Number(r.remaining_due || 0), 0),
      advGiven: filteredAdvances.reduce((s, r) => s + Number(r.amount || 0), 0),
      advBalance: filteredAdvances.reduce((s, r) => s + Number(r.balance || 0), 0),
    };
  }, [filteredSalaries, filteredAdvances]);

  const hasActiveFilters =
    searchTerm || selectedMonth !== "all" || selectedYear !== "all" || selectedStatus !== "all";

  const resetFilters = () => {
    setSearchTerm("");
    setSelectedMonth("all");
    setSelectedYear("all");
    setSelectedStatus("all");
  };

  const handleViewPayslip = async (salaryId) => {
    setLoadingPayslip(true);
    try {
      const res = await axiosInstance.get(`/payroll/v1/payslip/${salaryId}`);
      if (res.data?.success) {
        setPayslipData(res.data.data);
      }
    } catch {
      toast.error("পে-স্লিপ লোড করতে ব্যর্থ হয়েছে");
    } finally {
      setLoadingPayslip(false);
    }
  };

  const getStatusBadge = (status) => {
    switch (status?.toLowerCase()) {
      case "paid":
        return (
          <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-[11px] font-bold bg-emerald-50 text-[#1C7D5A] border border-emerald-200">
            <CheckCircle2 className="w-3 h-3" /> পরিশোধিত
          </span>
        );
      case "partial":
        return (
          <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-[11px] font-bold bg-amber-50 text-amber-700 border border-amber-200">
            <Clock className="w-3 h-3" /> আংশিক
          </span>
        );
      default:
        return (
          <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-[11px] font-bold bg-rose-50 text-rose-600 border border-rose-200">
            <AlertCircle className="w-3 h-3" /> বকেয়া
          </span>
        );
    }
  };

  const handleExportCSV = () => {
    if (activeList.length === 0) {
      toast.error("ডাউনলোড করার মতো কোনো তথ্য নেই");
      return;
    }
    if (activeTab === "salary") {
      const headers = [
        "ক্রম",
        "আইডি",
        "কর্মীর নাম",
        "পদবী",
        "মাস",
        "বছর",
        "মূল বেতন (৳)",
        "ভাতা (৳)",
        "বোনাস (৳)",
        "কর্তন (৳)",
        "নিট প্রদেয় (৳)",
        "পরিশোধিত (৳)",
        "বকেয়া (৳)",
        "অবস্থা",
      ];
      const rows = filteredSalaries.map((r, i) => [
        i + 1,
        r.employee_id,
        r.staff_name,
        r.designation,
        getMonthLabelBn(r.month),
        r.year,
        r.basic_salary,
        r.allowances,
        r.bonus,
        r.total_deductions,
        r.net_payable,
        r.paid_amount,
        r.remaining_due,
        r.status,
      ]);
      const totalRow = [
        "",
        "",
        `মোট (${filteredSalaries.length} টি)`,
        "",
        "",
        "",
        "",
        "",
        totals.bonus,
        totals.deductions,
        totals.net,
        totals.paid,
        totals.due,
        "",
      ];
      exportToCSV({ filename: "salary-report", headers, rows, totalRow });
    } else {
      const headers = [
        "ক্রম",
        "তারিখ",
        "আইডি",
        "কর্মীর নাম",
        "পদবী",
        "কারণ",
        "মাধ্যম",
        "অগ্রিম পরিমাণ (৳)",
        "সমন্বিত (৳)",
        "অবশিষ্ট ব্যালেন্স (৳)",
        "অবস্থা",
      ];
      const rows = filteredAdvances.map((r, i) => [
        i + 1,
        r.date,
        r.employee_id,
        r.staff_name,
        r.designation,
        r.reason,
        r.payment_method,
        r.amount,
        r.recovered_amount,
        r.balance,
        r.status,
      ]);
      const totalRow = [
        "",
        "",
        "",
        `মোট (${filteredAdvances.length} টি)`,
        "",
        "",
        "",
        totals.advGiven,
        "",
        totals.advBalance,
        "",
      ];
      exportToCSV({ filename: "salary-advance-report", headers, rows, totalRow });
    }
  };

  const handlePrint = () => {
    if (activeList.length === 0) {
      toast.error("প্রিন্ট করার মতো কোনো তথ্য নেই");
      return;
    }
    if (activeTab === "salary") {
      printHtmlReport({
        title: "বেতন রিপোর্ট (Monthly Salary Report)",
        subtitle: `মোট রেকর্ড: ${filteredSalaries.length} টি`,
        madrasaName: currentMadrasa?.name || "মাদ্রাসা ব্যবস্থাপনা",
        madrasaAddress: currentMadrasa?.address || "",
        summaryItems: [
          { label: "মোট নিট প্রদেয়", value: formatBDT(totals.net) },
          { label: "মোট পরিশোধিত", value: formatBDT(totals.paid) },
          { label: "মোট বকেয়া", value: formatBDT(totals.due) },
          { label: "মোট বোনাস", value: formatBDT(totals.bonus) },
        ],
        columns: [
          { label: "ক্রম", align: "center" },
          { label: "আইডি" },
          { label: "কর্মীর নাম" },
          { label: "পদবী" },
          { label: "মাস / বছর" },
          { label: "মোট বেতন", align: "right" },
          { label: "বোনাস", align: "right" },
          { label: "কর্তন", align: "right" },
          { label: "নিট প্রদেয়", align: "right" },
          { label: "পরিশোধিত", align: "right" },
          { label: "বকেয়া", align: "right" },
          { label: "অবস্থা", align: "center" },
        ],
        rows: filteredSalaries.map((r, i) => [
          i + 1,
          r.employee_id,
          r.staff_name,
          r.designation,
          `${getMonthLabelBn(r.month)} ${r.year}`,
          formatBDT(r.gross_salary),
          formatBDT(r.bonus),
          formatBDT(r.total_deductions),
          formatBDT(r.net_payable),
          formatBDT(r.paid_amount),
          formatBDT(r.remaining_due),
          r.status,
        ]),
      });
    } else {
      printHtmlReport({
        title: "অগ্রিম বেতন ও ঋণ রিপোর্ট (Advance & Loan Report)",
        subtitle: `মোট এন্ট্রি: ${filteredAdvances.length} টি`,
        madrasaName: currentMadrasa?.name || "মাদ্রাসা ব্যবস্থাপনা",
        madrasaAddress: currentMadrasa?.address || "",
        summaryItems: [
          { label: "মোট অগ্রিম প্রদান", value: formatBDT(totals.advGiven) },
          { label: "অবশিষ্ট পাওনা", value: formatBDT(totals.advBalance) },
        ],
        columns: [
          { label: "ক্রম", align: "center" },
          { label: "তারিখ" },
          { label: "কর্মীর নাম" },
          { label: "পদবী" },
          { label: "কারণ" },
          { label: "মাধ্যম" },
          { label: "প্রদত্ত", align: "right" },
          { label: "সমন্বিত", align: "right" },
          { label: "অবশিষ্ট", align: "right" },
        ],
        rows: filteredAdvances.map((r, i) => [
          i + 1,
          r.date,
          `${r.staff_name} (${r.employee_id})`,
          r.designation,
          r.reason,
          r.payment_method,
          formatBDT(r.amount),
          formatBDT(r.recovered_amount),
          formatBDT(r.balance),
        ]),
      });
    }
  };

  const currentYear = new Date().getFullYear();
  const years = [currentYear - 1, currentYear, currentYear + 1];

  return (
    <div className="space-y-6 pb-16 animate-in fade-in duration-500">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-xl md:text-2xl font-black text-slate-800 flex items-center gap-3">
            <Banknote className="w-7 h-7 text-[#1C7D5A]" />
            বেতন ও অগ্রিম রিপোর্ট (Salary & Advance Report)
          </h1>
          <p className="text-sm text-slate-500 font-semibold mt-1">
            কর্মচারীদের মাসিক বেতন, বোনাস, কর্তন, বকেয়া ও অগ্রিম ঋণের সম্পূর্ণ টেবিল রিপোর্ট
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-2.5">
          <button
            type="button"
            onClick={handlePrint}
            className="px-4 py-2 bg-white border border-slate-200 hover:border-[#1C7D5A] text-slate-700 rounded-lg font-bold text-xs flex items-center gap-2 shadow-sm cursor-pointer transition-colors"
          >
            <Printer className="w-4 h-4 text-[#1C7D5A]" />
            রিপোর্ট প্রিন্ট
          </button>
          <button
            type="button"
            onClick={handleExportCSV}
            className="px-4 py-2 bg-[#1C7D5A] hover:bg-[#123628] text-white rounded-lg font-bold text-xs flex items-center gap-2 shadow-sm cursor-pointer transition-colors"
          >
            <Download className="w-4 h-4" />
            CSV ডাউনলোড
          </button>
        </div>
      </div>

      {/* KPI Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="bg-white rounded-lg p-5 shadow-sm border border-slate-200 flex items-center justify-between">
          <div>
            <p className="text-xs font-bold text-slate-400">মোট নিট বেতন</p>
            <p className="text-2xl font-black text-slate-800 mt-1">{formatBDT(totals.net)}</p>
          </div>
          <div className="w-11 h-11 bg-slate-100 text-slate-700 rounded-xl flex items-center justify-center">
            <Users className="w-5 h-5" />
          </div>
        </div>

        <div className="bg-white rounded-lg p-5 shadow-sm border border-slate-200 flex items-center justify-between">
          <div>
            <p className="text-xs font-bold text-slate-400">মোট পরিশোধিত</p>
            <p className="text-2xl font-black text-[#1C7D5A] mt-1">{formatBDT(totals.paid)}</p>
          </div>
          <div className="w-11 h-11 bg-emerald-50 text-[#1C7D5A] rounded-xl flex items-center justify-center">
            <CheckCircle2 className="w-5 h-5" />
          </div>
        </div>

        <div className="bg-white rounded-lg p-5 shadow-sm border border-slate-200 flex items-center justify-between">
          <div>
            <p className="text-xs font-bold text-slate-400">বকেয়া বেতন</p>
            <p className="text-2xl font-black text-rose-600 mt-1">{formatBDT(totals.due)}</p>
          </div>
          <div className="w-11 h-11 bg-rose-50 text-rose-600 rounded-xl flex items-center justify-center">
            <AlertCircle className="w-5 h-5" />
          </div>
        </div>

        <div className="bg-white rounded-lg p-5 shadow-sm border border-slate-200 flex items-center justify-between">
          <div>
            <p className="text-xs font-bold text-slate-400">অগ্রিম প্রদত্ত / অবশিষ্ট</p>
            <p className="text-xl font-black text-amber-600 mt-1">
              {formatBDT(totals.advGiven)}
            </p>
            <p className="text-[11px] font-semibold text-slate-500">
              অবশিষ্ট: {formatBDT(totals.advBalance)}
            </p>
          </div>
          <div className="w-11 h-11 bg-amber-50 text-amber-600 rounded-xl flex items-center justify-center">
            <Wallet className="w-5 h-5" />
          </div>
        </div>
      </div>

      {/* Tabs + Filters */}
      <div className="bg-white p-4 rounded-lg border border-slate-200 shadow-sm space-y-4">
        <div className="flex flex-wrap items-center justify-between gap-3 border-b border-slate-100 pb-3">
          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={() => setActiveTab("salary")}
              className={`px-4 py-2 rounded-lg text-xs font-bold transition-colors cursor-pointer ${
                activeTab === "salary"
                  ? "bg-[#1C7D5A] text-white"
                  : "bg-slate-100 text-slate-600 hover:bg-slate-200"
              }`}
            >
              মাসিক বেতন ({filteredSalaries.length})
            </button>
            <button
              type="button"
              onClick={() => setActiveTab("advance")}
              className={`px-4 py-2 rounded-lg text-xs font-bold transition-colors cursor-pointer ${
                activeTab === "advance"
                  ? "bg-[#1C7D5A] text-white"
                  : "bg-slate-100 text-slate-600 hover:bg-slate-200"
              }`}
            >
              অগ্রিম ও ঋণ ({filteredAdvances.length})
            </button>
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-3 items-center">
          <div className="relative lg:col-span-2">
            <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              placeholder="কর্মচারীর নাম, আইডি, পদবী..."
              className="w-full pl-9 pr-3 py-2 bg-slate-50 border border-slate-200 rounded-lg text-sm font-medium text-slate-800 outline-none focus:border-[#1C7D5A]"
            />
          </div>

          {activeTab === "salary" && (
            <>
              <select
                value={selectedMonth}
                onChange={(e) => setSelectedMonth(e.target.value)}
                className="px-3 py-2 bg-white border border-slate-200 rounded-lg text-sm font-semibold text-slate-700 outline-none focus:border-[#1C7D5A]"
              >
                {MONTH_OPTIONS.map((m) => (
                  <option key={m.value} value={m.value === "all" ? "all" : m.num}>
                    {m.label}
                  </option>
                ))}
              </select>

              <select
                value={selectedYear}
                onChange={(e) => setSelectedYear(e.target.value)}
                className="px-3 py-2 bg-white border border-slate-200 rounded-lg text-sm font-semibold text-slate-700 outline-none focus:border-[#1C7D5A]"
              >
                <option value="all">সকল বছর</option>
                {years.map((y) => (
                  <option key={y} value={String(y)}>
                    {y}
                  </option>
                ))}
              </select>

              <div className="flex items-center gap-2">
                <select
                  value={selectedStatus}
                  onChange={(e) => setSelectedStatus(e.target.value)}
                  className="w-full px-3 py-2 bg-white border border-slate-200 rounded-lg text-sm font-semibold text-slate-700 outline-none focus:border-[#1C7D5A]"
                >
                  <option value="all">সকল অবস্থা</option>
                  <option value="paid">পরিশোধিত (Paid)</option>
                  <option value="partial">আংশিক (Partial)</option>
                  <option value="unpaid">বকেয়া (Unpaid)</option>
                </select>
                {hasActiveFilters && (
                  <button
                    type="button"
                    onClick={resetFilters}
                    title="রিসেট"
                    className="p-2 bg-slate-100 hover:bg-rose-50 text-slate-600 hover:text-rose-600 rounded-lg border border-slate-200 cursor-pointer shrink-0"
                  >
                    <FilterX className="w-4 h-4" />
                  </button>
                )}
              </div>
            </>
          )}
        </div>
      </div>

      {/* Table */}
      <div className="bg-white rounded-lg border border-slate-200 shadow-sm overflow-hidden">
        {loading ? (
          <div className="py-20 flex flex-col items-center justify-center">
            <Loader2 className="w-8 h-8 animate-spin text-[#1C7D5A] mb-3" />
            <p className="text-sm font-bold text-slate-500">তথ্য লোড হচ্ছে...</p>
          </div>
        ) : activeList.length === 0 ? (
          <div className="py-20 text-center space-y-2">
            <Banknote className="w-10 h-10 text-slate-300 mx-auto" />
            <p className="text-sm font-bold text-slate-500">
              বর্তমান ফিল্টারে কোনো বেতন রেকর্ড পাওয়া যায়নি
            </p>
          </div>
        ) : activeTab === "salary" ? (
          <>
            <div className="overflow-x-auto">
              <table className="w-full text-left border-collapse min-w-[1050px]">
                <thead className="bg-[#1C7D5A18] text-slate-800 text-[11px] uppercase font-black tracking-wider whitespace-nowrap">
                  <tr>
                    <th className="px-4 py-3.5">#</th>
                    <th className="px-4 py-3.5">কর্মচারীর তথ্য</th>
                    <th className="px-4 py-3.5">মাস / বছর</th>
                    <th className="px-4 py-3.5 text-right">মূল + ভাতা</th>
                    <th className="px-4 py-3.5 text-right">বোনাস</th>
                    <th className="px-4 py-3.5 text-right">কর্তন</th>
                    <th className="px-4 py-3.5 text-right">নিট প্রদেয়</th>
                    <th className="px-4 py-3.5 text-right">পরিশোধিত</th>
                    <th className="px-4 py-3.5 text-right">বকেয়া</th>
                    <th className="px-4 py-3.5 text-center">অবস্থা</th>
                    <th className="px-4 py-3.5 text-right">পে-স্লিপ</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100 text-sm">
                  {paginatedRows.map((row, idx) => {
                    const serial = (currentPage - 1) * ITEMS_PER_PAGE + idx + 1;
                    return (
                      <tr key={row._id} className="hover:bg-slate-50/70 transition-colors">
                        <td className="px-4 py-3 text-xs font-bold text-slate-400">#{serial}</td>
                        <td className="px-4 py-3">
                          <div className="font-bold text-slate-800">{row.staff_name}</div>
                          <div className="text-xs text-slate-400 font-semibold">
                            {row.employee_id} • {row.designation}
                          </div>
                        </td>
                        <td className="px-4 py-3 whitespace-nowrap text-xs font-bold text-slate-700">
                          {getMonthLabelBn(row.month)}
                          <div className="text-[11px] text-slate-400">{row.year}</div>
                        </td>
                        <td className="px-4 py-3 text-right whitespace-nowrap text-xs font-bold text-slate-700">
                          {formatBDT(row.gross_salary)}
                        </td>
                        <td className="px-4 py-3 text-right whitespace-nowrap text-xs font-bold text-emerald-600">
                          {row.bonus > 0 ? `+${formatBDT(row.bonus)}` : "-"}
                        </td>
                        <td className="px-4 py-3 text-right whitespace-nowrap text-xs font-bold text-rose-500">
                          {row.total_deductions > 0 ? `-${formatBDT(row.total_deductions)}` : "-"}
                        </td>
                        <td className="px-4 py-3 text-right whitespace-nowrap font-black text-slate-800">
                          {formatBDT(row.net_payable)}
                        </td>
                        <td className="px-4 py-3 text-right whitespace-nowrap font-black text-[#1C7D5A]">
                          {formatBDT(row.paid_amount)}
                        </td>
                        <td className="px-4 py-3 text-right whitespace-nowrap font-bold text-rose-600">
                          {formatBDT(row.remaining_due)}
                        </td>
                        <td className="px-4 py-3 text-center whitespace-nowrap">
                          {getStatusBadge(row.status)}
                        </td>
                        <td className="px-4 py-3 text-right whitespace-nowrap">
                          <button
                            type="button"
                            disabled={loadingPayslip}
                            onClick={() => handleViewPayslip(row._id)}
                            className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-slate-100 hover:bg-[#1C7D5A] text-slate-700 hover:text-white rounded-lg text-xs font-bold transition-colors cursor-pointer"
                          >
                            <Printer className="w-3.5 h-3.5" />
                            পে-স্লিপ
                          </button>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
                <tfoot className="bg-slate-50 border-t-2 border-slate-200 text-sm font-black">
                  <tr>
                    <td colSpan="3" className="px-4 py-3 text-right text-slate-700">
                      মোট ({filteredSalaries.length} টি):
                    </td>
                    <td className="px-4 py-3 text-right text-slate-700 whitespace-nowrap">
                      {formatBDT(totals.gross)}
                    </td>
                    <td className="px-4 py-3 text-right text-emerald-600 whitespace-nowrap">
                      {formatBDT(totals.bonus)}
                    </td>
                    <td className="px-4 py-3 text-right text-rose-500 whitespace-nowrap">
                      {formatBDT(totals.deductions)}
                    </td>
                    <td className="px-4 py-3 text-right text-slate-900 whitespace-nowrap">
                      {formatBDT(totals.net)}
                    </td>
                    <td className="px-4 py-3 text-right text-[#1C7D5A] whitespace-nowrap">
                      {formatBDT(totals.paid)}
                    </td>
                    <td className="px-4 py-3 text-right text-rose-600 whitespace-nowrap">
                      {formatBDT(totals.due)}
                    </td>
                    <td colSpan="2"></td>
                  </tr>
                </tfoot>
              </table>
            </div>
          </>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse min-w-[850px]">
              <thead className="bg-[#1C7D5A18] text-slate-800 text-[11px] uppercase font-black tracking-wider whitespace-nowrap">
                <tr>
                  <th className="px-4 py-3.5">#</th>
                  <th className="px-4 py-3.5">তারিখ</th>
                  <th className="px-4 py-3.5">কর্মচারীর তথ্য</th>
                  <th className="px-4 py-3.5">কারণ / বিবরণ</th>
                  <th className="px-4 py-3.5 text-center">মাধ্যম</th>
                  <th className="px-4 py-3.5 text-right">প্রদত্ত অগ্রিম</th>
                  <th className="px-4 py-3.5 text-right">সমন্বিত</th>
                  <th className="px-4 py-3.5 text-right">অবশিষ্ট ব্যালেন্স</th>
                  <th className="px-4 py-3.5 text-center">অবস্থা</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 text-sm">
                {paginatedRows.map((row, idx) => {
                  const serial = (currentPage - 1) * ITEMS_PER_PAGE + idx + 1;
                  return (
                    <tr key={row._id} className="hover:bg-slate-50/70 transition-colors">
                      <td className="px-4 py-3 text-xs font-bold text-slate-400">#{serial}</td>
                      <td className="px-4 py-3 whitespace-nowrap text-xs font-semibold text-slate-600">
                        {row.date}
                      </td>
                      <td className="px-4 py-3">
                        <div className="font-bold text-slate-800">{row.staff_name}</div>
                        <div className="text-xs text-slate-400">
                          {row.employee_id} • {row.designation}
                        </div>
                      </td>
                      <td className="px-4 py-3 text-xs font-medium text-slate-600">{row.reason}</td>
                      <td className="px-4 py-3 text-center">
                        <span className="px-2 py-1 bg-slate-100 text-slate-700 rounded text-xs font-bold">
                          {row.payment_method}
                        </span>
                      </td>
                      <td className="px-4 py-3 text-right font-black text-slate-800 whitespace-nowrap">
                        {formatBDT(row.amount)}
                      </td>
                      <td className="px-4 py-3 text-right font-bold text-[#1C7D5A] whitespace-nowrap">
                        {formatBDT(row.recovered_amount)}
                      </td>
                      <td className="px-4 py-3 text-right font-black text-amber-600 whitespace-nowrap">
                        {formatBDT(row.balance)}
                      </td>
                      <td className="px-4 py-3 text-center">
                        <span className="px-2.5 py-1 rounded-full text-[11px] font-bold bg-amber-50 text-amber-700 border border-amber-200">
                          {row.status === "active" ? "সক্রিয়" : "পরিশোধিত"}
                        </span>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        )}

        {totalPages > 1 && (
          <div className="bg-slate-50/70 px-5 py-3.5 border-t border-slate-200 flex flex-col sm:flex-row items-center justify-between gap-3">
            <p className="text-xs font-bold text-slate-500">
              মোট {activeList.length} টি রেকর্ডের মধ্যে{" "}
              {(currentPage - 1) * ITEMS_PER_PAGE + 1} -{" "}
              {Math.min(currentPage * ITEMS_PER_PAGE, activeList.length)} দেখানো হচ্ছে
            </p>
            <div className="flex items-center gap-1.5">
              <button
                type="button"
                disabled={currentPage === 1}
                onClick={() => setCurrentPage((p) => Math.max(1, p - 1))}
                className="p-1.5 border border-slate-200 rounded-lg bg-white text-slate-600 disabled:opacity-40 cursor-pointer"
              >
                <ChevronLeft className="w-4 h-4" />
              </button>
              <span className="px-3 text-xs font-bold text-slate-700">
                পৃষ্ঠা {currentPage} / {totalPages}
              </span>
              <button
                type="button"
                disabled={currentPage === totalPages}
                onClick={() => setCurrentPage((p) => Math.min(totalPages, p + 1))}
                className="p-1.5 border border-slate-200 rounded-lg bg-white text-slate-600 disabled:opacity-40 cursor-pointer"
              >
                <ChevronRight className="w-4 h-4" />
              </button>
            </div>
          </div>
        )}
      </div>

      {payslipData && (
        <PayslipPrintModal data={payslipData} onClose={() => setPayslipData(null)} />
      )}
    </div>
  );
};

export default SalaryReport;
