import { useState, useEffect, useMemo, useCallback } from "react";
import {
  FileText,
  Search,
  Printer,
  Download,
  FilterX,
  Loader2,
  ChevronLeft,
  ChevronRight,
  Wallet,
  Receipt,
  CheckCircle2,
  AlertCircle,
  Ban,
} from "lucide-react";
import { toast } from "react-hot-toast";
import accountantService from "../../services/accountantService";
import { useAuth } from "../../context/AuthContext";
import Voucher from "../../components/Voucher";
import {
  exportToCSV,
  printHtmlReport,
  formatBDT,
  MONTH_OPTIONS,
} from "../../utils/reportExport";

const ITEMS_PER_PAGE = 15;

const FreeCollectionReport = () => {
  const { currentMadrasa } = useAuth();
  const [rows, setRows] = useState([]);
  const [classes, setClasses] = useState([]);
  const [summary, setSummary] = useState({
    totalCollected: 0,
    totalDiscount: 0,
    totalNetPayable: 0,
    totalDue: 0,
    receiptCount: 0,
    voidedCount: 0,
  });
  const [loading, setLoading] = useState(true);

  // Filters
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedClass, setSelectedClass] = useState("all");
  const [selectedMonth, setSelectedMonth] = useState("all");
  const [selectedYear, setSelectedYear] = useState("all");
  const [selectedMethod, setSelectedMethod] = useState("all");
  const [selectedStatus, setSelectedStatus] = useState("all");
  const [currentPage, setCurrentPage] = useState(1);

  // Voucher Modal
  const [selectedVoucher, setSelectedVoucher] = useState(null);

  const fetchReport = useCallback(async () => {
    setLoading(true);
    try {
      const res = await accountantService.getFeeCollectionReport({
        class_id: selectedClass,
        month: selectedMonth,
        year: selectedYear,
        payment_method: selectedMethod,
        status: selectedStatus,
      });
      if (res?.success) {
        setRows(res.data || []);
        setSummary(
          res.summary || {
            totalCollected: 0,
            totalDiscount: 0,
            totalNetPayable: 0,
            totalDue: 0,
            receiptCount: 0,
            voidedCount: 0,
          }
        );
        setClasses(res.classes || []);
      }
    } catch (err) {
      console.error("Fee Collection Report Error:", err);
      toast.error(
        err?.response?.data?.message || "ফি কালেকশন রিপোর্ট লোড করতে সমস্যা হয়েছে"
      );
    } finally {
      setLoading(false);
    }
  }, [selectedClass, selectedMonth, selectedYear, selectedMethod, selectedStatus]);

  useEffect(() => {
    fetchReport();
  }, [fetchReport]);

  const filteredRows = useMemo(() => {
    const q = searchTerm.trim().toLowerCase();
    if (!q) return rows;
    return rows.filter(
      (r) =>
        (r.student_name || "").toLowerCase().includes(q) ||
        (r.student_code || "").toLowerCase().includes(q) ||
        (r.receipt_no || "").toLowerCase().includes(q) ||
        (r.roll_number || "").toLowerCase().includes(q) ||
        (r.fee_heads || "").toLowerCase().includes(q)
    );
  }, [rows, searchTerm]);

  useEffect(() => {
    setCurrentPage(1);
  }, [searchTerm, selectedClass, selectedMonth, selectedYear, selectedMethod, selectedStatus]);

  const totalPages = Math.max(1, Math.ceil(filteredRows.length / ITEMS_PER_PAGE));
  const paginatedRows = useMemo(() => {
    const start = (currentPage - 1) * ITEMS_PER_PAGE;
    return filteredRows.slice(start, start + ITEMS_PER_PAGE);
  }, [filteredRows, currentPage]);

  const activeFilteredTotals = useMemo(() => {
    const active = filteredRows.filter((r) => !r.is_voided);
    return {
      collected: active.reduce((s, r) => s + Number(r.paid_amount || 0), 0),
      discount: active.reduce((s, r) => s + Number(r.discount || 0), 0),
      due: active.reduce((s, r) => s + Number(r.remaining_due || 0), 0),
      count: active.length,
    };
  }, [filteredRows]);

  const hasActiveFilters =
    searchTerm ||
    selectedClass !== "all" ||
    selectedMonth !== "all" ||
    selectedYear !== "all" ||
    selectedMethod !== "all" ||
    selectedStatus !== "all";

  const resetFilters = () => {
    setSearchTerm("");
    setSelectedClass("all");
    setSelectedMonth("all");
    setSelectedYear("all");
    setSelectedMethod("all");
    setSelectedStatus("all");
  };

  const getStatusBadge = (status) => {
    switch (status) {
      case "Paid":
        return (
          <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-[11px] font-bold bg-emerald-50 text-[#1C7D5A] border border-emerald-200">
            <CheckCircle2 className="w-3 h-3" /> পরিশোধিত
          </span>
        );
      case "Partial":
        return (
          <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-[11px] font-bold bg-amber-50 text-amber-700 border border-amber-200">
            <AlertCircle className="w-3 h-3" /> আংশিক
          </span>
        );
      case "Voided":
        return (
          <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-[11px] font-bold bg-slate-100 text-slate-500 border border-slate-200">
            <Ban className="w-3 h-3" /> বাতিল
          </span>
        );
      default:
        return (
          <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-[11px] font-bold bg-rose-50 text-rose-600 border border-rose-200">
            বকেয়া
          </span>
        );
    }
  };

  const openReceiptVoucher = (row) => {
    setSelectedVoucher({
      receiptNo: row.receipt_no,
      date: row.date,
      studentName: row.student_name,
      studentId: row.student_code,
      className: row.class_name,
      rollNo: row.roll_number,
      paymentMethod: row.payment_method,
      year: row.year,
      months: row.months,
      subtotal: row.subtotal,
      discount: row.discount,
      previousDue: row.previous_due,
      netPayable: row.net_payable,
      paidAmount: row.paid_amount,
      remainingDue: row.remaining_due,
      isVoided: row.is_voided,
      status: row.status,
      feeDetails:
        row.fee_details && row.fee_details.length > 0
          ? row.fee_details
          : [{ head: row.fee_heads, period: row.months_text || row.year, amount: row.paid_amount }],
    });
  };

  const handleExportCSV = () => {
    if (filteredRows.length === 0) {
      toast.error("ডাউনলোড করার মতো কোনো তথ্য নেই");
      return;
    }
    const headers = [
      "ক্রম",
      "রসিদ নং",
      "তারিখ",
      "শিক্ষার্থী আইডি",
      "শিক্ষার্থীর নাম",
      "ক্লাস",
      "রোল",
      "ফি এর বিবরণ",
      "মাস",
      "নিট প্রদেয় (৳)",
      "ছাড় (৳)",
      "পরিশোধিত (৳)",
      "বকেয়া (৳)",
      "মাধ্যম",
      "অবস্থা",
    ];
    const dataRows = filteredRows.map((r, i) => [
      i + 1,
      r.receipt_no,
      r.date,
      r.student_code,
      r.student_name,
      r.class_name,
      r.roll_number || "-",
      r.fee_heads,
      r.months_text || r.year || "-",
      r.net_payable,
      r.discount,
      r.paid_amount,
      r.remaining_due,
      r.payment_method,
      r.status,
    ]);
    const totalRow = [
      "",
      "",
      "",
      "",
      `সর্বমোট (${activeFilteredTotals.count} টি সক্রিয় রসিদ)`,
      "",
      "",
      "",
      "",
      "",
      activeFilteredTotals.discount,
      activeFilteredTotals.collected,
      activeFilteredTotals.due,
      "",
      "",
    ];
    exportToCSV({
      filename: "fee-collection-report",
      headers,
      rows: dataRows,
      totalRow,
    });
  };

  const handlePrintReport = () => {
    if (filteredRows.length === 0) {
      toast.error("প্রিন্ট করার মতো কোনো তথ্য নেই");
      return;
    }
    printHtmlReport({
      title: "ফি কালেকশন রিপোর্ট (Fee Collection Report)",
      subtitle: `ফিল্টারকৃত রসিদ: ${filteredRows.length} টি`,
      madrasaName: currentMadrasa?.name || "মাদ্রাসা ব্যবস্থাপনা",
      madrasaAddress: currentMadrasa?.address || "",
      summaryItems: [
        { label: "মোট আদায়", value: formatBDT(activeFilteredTotals.collected) },
        { label: "মোট ছাড়", value: formatBDT(activeFilteredTotals.discount) },
        { label: "অবশিষ্ট বকেয়া", value: formatBDT(activeFilteredTotals.due) },
        { label: "সক্রিয় রসিদ", value: `${activeFilteredTotals.count} টি` },
      ],
      columns: [
        { label: "ক্রম", align: "center" },
        { label: "রসিদ নং" },
        { label: "তারিখ" },
        { label: "শিক্ষার্থী" },
        { label: "ক্লাস" },
        { label: "ফি বিবরণ" },
        { label: "ছাড়", align: "right" },
        { label: "আদায়", align: "right" },
        { label: "বকেয়া", align: "right" },
        { label: "মাধ্যম", align: "center" },
        { label: "অবস্থা", align: "center" },
      ],
      rows: filteredRows.map((r, i) => [
        i + 1,
        r.receipt_no,
        r.date,
        `${r.student_name} (${r.student_code})`,
        r.class_name,
        r.months_text ? `${r.fee_heads} (${r.months_text})` : r.fee_heads,
        formatBDT(r.discount),
        formatBDT(r.paid_amount),
        formatBDT(r.remaining_due),
        r.payment_method,
        r.status,
      ]),
    });
  };

  const currentYear = new Date().getFullYear();
  const years = [currentYear - 1, currentYear, currentYear + 1];

  return (
    <div className="space-y-6 pb-16 animate-in fade-in duration-500">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-xl md:text-2xl font-black text-slate-800 flex items-center gap-3">
            <Receipt className="w-7 h-7 text-[#1C7D5A]" />
            ফি কালেকশন রিপোর্ট (Fee Collection Report)
          </h1>
          <p className="text-sm text-slate-500 font-semibold mt-1">
            সকল শিক্ষার্থীর ফি আদায়ের বিস্তারিত টেবিল ও রসিদ বিবরণী
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-2.5">
          <button
            type="button"
            onClick={handlePrintReport}
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
            <p className="text-xs font-bold text-slate-400 uppercase tracking-wider">মোট ফি আদায়</p>
            <p className="text-2xl font-black text-[#1C7D5A] mt-1">
              {formatBDT(activeFilteredTotals.collected)}
            </p>
          </div>
          <div className="w-11 h-11 bg-emerald-50 text-[#1C7D5A] rounded-xl flex items-center justify-center">
            <Wallet className="w-5 h-5" />
          </div>
        </div>

        <div className="bg-white rounded-lg p-5 shadow-sm border border-slate-200 flex items-center justify-between">
          <div>
            <p className="text-xs font-bold text-slate-400 uppercase tracking-wider">মোট রসিদ</p>
            <p className="text-2xl font-black text-slate-800 mt-1">
              {activeFilteredTotals.count} টি
            </p>
            {summary.voidedCount > 0 && (
              <p className="text-[11px] text-slate-400 font-semibold">
                বাতিল: {summary.voidedCount} টি
              </p>
            )}
          </div>
          <div className="w-11 h-11 bg-blue-50 text-blue-600 rounded-xl flex items-center justify-center">
            <FileText className="w-5 h-5" />
          </div>
        </div>

        <div className="bg-white rounded-lg p-5 shadow-sm border border-slate-200 flex items-center justify-between">
          <div>
            <p className="text-xs font-bold text-slate-400 uppercase tracking-wider">মোট মওকুফ / ছাড়</p>
            <p className="text-2xl font-black text-amber-600 mt-1">
              {formatBDT(activeFilteredTotals.discount)}
            </p>
          </div>
          <div className="w-11 h-11 bg-amber-50 text-amber-600 rounded-xl flex items-center justify-center">
            <Receipt className="w-5 h-5" />
          </div>
        </div>

        <div className="bg-white rounded-lg p-5 shadow-sm border border-slate-200 flex items-center justify-between">
          <div>
            <p className="text-xs font-bold text-slate-400 uppercase tracking-wider">রসিদভিত্তিক বকেয়া</p>
            <p className="text-2xl font-black text-rose-600 mt-1">
              {formatBDT(activeFilteredTotals.due)}
            </p>
          </div>
          <div className="w-11 h-11 bg-rose-50 text-rose-600 rounded-xl flex items-center justify-center">
            <AlertCircle className="w-5 h-5" />
          </div>
        </div>
      </div>

      {/* Filters */}
      <div className="bg-white p-4 rounded-lg border border-slate-200 shadow-sm grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-7 gap-3 items-center">
        <div className="relative lg:col-span-2">
          <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            placeholder="ছাত্রের নাম, আইডি, রোল বা রসিদ নং..."
            className="w-full pl-9 pr-3 py-2 bg-slate-50 border border-slate-200 rounded-lg text-sm font-medium text-slate-800 outline-none focus:border-[#1C7D5A]"
          />
        </div>

        <select
          value={selectedClass}
          onChange={(e) => setSelectedClass(e.target.value)}
          className="px-3 py-2 bg-white border border-slate-200 rounded-lg text-sm font-semibold text-slate-700 outline-none focus:border-[#1C7D5A]"
        >
          <option value="all">সকল ক্লাস</option>
          {classes.map((cls) => (
            <option key={cls._id} value={cls._id}>
              {cls.name}
            </option>
          ))}
        </select>

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

        <select
          value={selectedMethod}
          onChange={(e) => setSelectedMethod(e.target.value)}
          className="px-3 py-2 bg-white border border-slate-200 rounded-lg text-sm font-semibold text-slate-700 outline-none focus:border-[#1C7D5A]"
        >
          <option value="all">সকল মাধ্যম</option>
          <option value="Cash">Cash</option>
          <option value="bKash">bKash</option>
          <option value="Nagad">Nagad</option>
          <option value="Bank">Bank</option>
        </select>

        <div className="flex items-center gap-2">
          <select
            value={selectedStatus}
            onChange={(e) => setSelectedStatus(e.target.value)}
            className="w-full px-3 py-2 bg-white border border-slate-200 rounded-lg text-sm font-semibold text-slate-700 outline-none focus:border-[#1C7D5A]"
          >
            <option value="all">সকল অবস্থা</option>
            <option value="Paid">পরিশোধিত (Paid)</option>
            <option value="Partial">আংশিক (Partial)</option>
            <option value="Voided">বাতিল (Voided)</option>
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
      </div>

      {/* Table */}
      <div className="bg-white rounded-lg border border-slate-200 shadow-sm overflow-hidden">
        {loading ? (
          <div className="py-20 flex flex-col items-center justify-center">
            <Loader2 className="w-8 h-8 animate-spin text-[#1C7D5A] mb-3" />
            <p className="text-sm font-bold text-slate-500">তথ্য লোড হচ্ছে...</p>
          </div>
        ) : filteredRows.length === 0 ? (
          <div className="py-20 text-center space-y-2">
            <Receipt className="w-10 h-10 text-slate-300 mx-auto" />
            <p className="text-sm font-bold text-slate-500">
              বর্তমান ফিল্টারে কোনো ফি কালেকশন রেকর্ড পাওয়া যায়নি
            </p>
          </div>
        ) : (
          <>
            <div className="overflow-x-auto">
              <table className="w-full text-left border-collapse min-w-[1050px]">
                <thead className="bg-[#1C7D5A18] text-slate-800 text-[11px] uppercase font-black tracking-wider whitespace-nowrap">
                  <tr>
                    <th className="px-4 py-3.5"># / রসিদ নং</th>
                    <th className="px-4 py-3.5">তারিখ</th>
                    <th className="px-4 py-3.5">শিক্ষার্থীর তথ্য</th>
                    <th className="px-4 py-3.5">ক্লাস ও রোল</th>
                    <th className="px-4 py-3.5">ফি এর বিবরণ</th>
                    <th className="px-4 py-3.5 text-right">ছাড়</th>
                    <th className="px-4 py-3.5 text-right">পরিশোধিত</th>
                    <th className="px-4 py-3.5 text-right">বকেয়া</th>
                    <th className="px-4 py-3.5 text-center">মাধ্যম</th>
                    <th className="px-4 py-3.5 text-center">অবস্থা</th>
                    <th className="px-4 py-3.5 text-right">অ্যাকশন</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100 text-sm">
                  {paginatedRows.map((row, idx) => {
                    const serial = (currentPage - 1) * ITEMS_PER_PAGE + idx + 1;
                    return (
                      <tr
                        key={row._id}
                        className={`hover:bg-slate-50/70 transition-colors ${
                          row.is_voided ? "opacity-60 bg-slate-50/50" : ""
                        }`}
                      >
                        <td className="px-4 py-3 whitespace-nowrap">
                          <div className="text-[11px] font-bold text-slate-400">#{serial}</div>
                          <div className="text-xs font-mono font-bold text-slate-800">
                            {row.receipt_no}
                          </div>
                        </td>
                        <td className="px-4 py-3 whitespace-nowrap text-xs font-semibold text-slate-600">
                          {row.date}
                        </td>
                        <td className="px-4 py-3">
                          <div className="font-bold text-slate-800">{row.student_name}</div>
                          <div className="text-xs text-slate-400 font-semibold">
                            ID: {row.student_code}
                          </div>
                        </td>
                        <td className="px-4 py-3 whitespace-nowrap">
                          <div className="text-xs font-bold text-slate-700">{row.class_name}</div>
                          <div className="text-[11px] text-slate-400">
                            {row.section_name ? `${row.section_name} • ` : ""}
                            রোল: {row.roll_number || "-"}
                          </div>
                        </td>
                        <td className="px-4 py-3">
                          <div className="text-xs font-bold text-slate-700 max-w-[200px] truncate">
                            {row.fee_heads}
                          </div>
                          {row.months_text && (
                            <div className="text-[11px] text-slate-400 truncate max-w-[200px]">
                              {row.months_text} {row.year ? `(${row.year})` : ""}
                            </div>
                          )}
                        </td>
                        <td className="px-4 py-3 text-right whitespace-nowrap text-xs font-bold text-amber-600">
                          {formatBDT(row.discount)}
                        </td>
                        <td className="px-4 py-3 text-right whitespace-nowrap font-black text-[#1C7D5A]">
                          {formatBDT(row.paid_amount)}
                        </td>
                        <td className="px-4 py-3 text-right whitespace-nowrap font-bold text-rose-600">
                          {formatBDT(row.remaining_due)}
                        </td>
                        <td className="px-4 py-3 text-center whitespace-nowrap">
                          <span className="px-2 py-1 bg-slate-100 text-slate-700 rounded text-xs font-bold">
                            {row.payment_method}
                          </span>
                        </td>
                        <td className="px-4 py-3 text-center whitespace-nowrap">
                          {getStatusBadge(row.status)}
                        </td>
                        <td className="px-4 py-3 text-right whitespace-nowrap">
                          <button
                            type="button"
                            onClick={() => openReceiptVoucher(row)}
                            className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-slate-100 hover:bg-[#1C7D5A] text-slate-700 hover:text-white rounded-lg text-xs font-bold transition-colors cursor-pointer"
                          >
                            <Printer className="w-3.5 h-3.5" />
                            রসিদ
                          </button>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
                <tfoot className="bg-slate-50 border-t-2 border-slate-200 text-sm font-black">
                  <tr>
                    <td colSpan="5" className="px-4 py-3 text-right text-slate-700">
                      মোট ({activeFilteredTotals.count} টি সক্রিয় রসিদ):
                    </td>
                    <td className="px-4 py-3 text-right text-amber-600 whitespace-nowrap">
                      {formatBDT(activeFilteredTotals.discount)}
                    </td>
                    <td className="px-4 py-3 text-right text-[#1C7D5A] whitespace-nowrap">
                      {formatBDT(activeFilteredTotals.collected)}
                    </td>
                    <td className="px-4 py-3 text-right text-rose-600 whitespace-nowrap">
                      {formatBDT(activeFilteredTotals.due)}
                    </td>
                    <td colSpan="3"></td>
                  </tr>
                </tfoot>
              </table>
            </div>

            {totalPages > 1 && (
              <div className="bg-slate-50/70 px-5 py-3.5 border-t border-slate-200 flex flex-col sm:flex-row items-center justify-between gap-3">
                <p className="text-xs font-bold text-slate-500">
                  মোট {filteredRows.length} টি রেকর্ডের মধ্যে{" "}
                  {(currentPage - 1) * ITEMS_PER_PAGE + 1} -{" "}
                  {Math.min(currentPage * ITEMS_PER_PAGE, filteredRows.length)} দেখানো হচ্ছে
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
          </>
        )}
      </div>

      {selectedVoucher && (
        <Voucher
          data={selectedVoucher}
          onClose={() => setSelectedVoucher(null)}
          madrasaName={currentMadrasa?.name}
          address={currentMadrasa?.address}
        />
      )}
    </div>
  );
};

export default FreeCollectionReport;
