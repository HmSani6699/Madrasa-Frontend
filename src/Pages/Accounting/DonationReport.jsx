import { useState, useEffect, useMemo, useCallback } from "react";
import {
  HeartHandshake,
  Search,
  Printer,
  Download,
  FilterX,
  Loader2,
  ChevronLeft,
  ChevronRight,
  Users,
  Receipt,
  TrendingUp,
  Phone,
  MapPin,
} from "lucide-react";
import { useTranslation } from "react-i18next";
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

const DonationReport = () => {
  const { t } = useTranslation();
  const { currentMadrasa } = useAuth();
  const [rows, setRows] = useState([]);
  const [fundTypes, setFundTypes] = useState([]);
  const [loading, setLoading] = useState(true);

  const [searchTerm, setSearchTerm] = useState("");
  const [selectedFundType, setSelectedFundType] = useState("all");
  const [selectedPaymentMode, setSelectedPaymentMode] = useState("all");
  const [selectedMonth, setSelectedMonth] = useState("all");
  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");
  const [currentPage, setCurrentPage] = useState(1);

  const [selectedVoucher, setSelectedVoucher] = useState(null);

  const getFundLabel = useCallback(
    (type) => {
      if (!type || type === "all") return "সকল ফান্ড";
      const key1 = `donation_page.types.${type}`;
      const t1 = t(key1);
      if (t1 !== key1) return t1;
      const key2 = `donation_report.fund_types.${type}`;
      const t2 = t(key2);
      if (t2 !== key2) return t2;
      return type;
    },
    [t]
  );

  const fetchReport = useCallback(async () => {
    setLoading(true);
    try {
      const res = await accountantService.getDonationReport({
        type: selectedFundType,
        payment_mode: selectedPaymentMode,
        month: selectedMonth,
        start_date: startDate,
        end_date: endDate,
      });
      if (res?.success) {
        setRows(res.data || []);
        setFundTypes(res.fundTypes || []);
      }
    } catch (err) {
      console.error("Donation Report Error:", err);
      toast.error(err?.response?.data?.message || "অনুদান রিপোর্ট লোড করতে সমস্যা হয়েছে");
    } finally {
      setLoading(false);
    }
  }, [selectedFundType, selectedPaymentMode, selectedMonth, startDate, endDate]);

  useEffect(() => {
    fetchReport();
  }, [fetchReport]);

  const filteredRows = useMemo(() => {
    const q = searchTerm.trim().toLowerCase();
    if (!q) return rows;
    return rows.filter(
      (r) =>
        (r.donorName || "").toLowerCase().includes(q) ||
        (r.receiptNo || "").toLowerCase().includes(q) ||
        (r.phone || "").toLowerCase().includes(q) ||
        (r.remarks || "").toLowerCase().includes(q)
    );
  }, [rows, searchTerm]);

  useEffect(() => {
    setCurrentPage(1);
  }, [searchTerm, selectedFundType, selectedPaymentMode, selectedMonth, startDate, endDate]);

  const totals = useMemo(() => {
    const totalAmount = filteredRows.reduce((s, r) => s + Number(r.amount || 0), 0);
    const uniqueDonors = new Set(
      filteredRows.map((r) => (r.donorName || "").trim().toLowerCase()).filter(Boolean)
    ).size;
    return { totalAmount, count: filteredRows.length, uniqueDonors };
  }, [filteredRows]);

  const totalPages = Math.max(1, Math.ceil(filteredRows.length / ITEMS_PER_PAGE));
  const paginatedRows = useMemo(() => {
    const start = (currentPage - 1) * ITEMS_PER_PAGE;
    return filteredRows.slice(start, start + ITEMS_PER_PAGE);
  }, [filteredRows, currentPage]);

  const hasActiveFilters =
    searchTerm ||
    selectedFundType !== "all" ||
    selectedPaymentMode !== "all" ||
    selectedMonth !== "all" ||
    startDate ||
    endDate;

  const resetFilters = () => {
    setSearchTerm("");
    setSelectedFundType("all");
    setSelectedPaymentMode("all");
    setSelectedMonth("all");
    setStartDate("");
    setEndDate("");
  };

  const openReceipt = (row) => {
    setSelectedVoucher({
      receiptNo: row.receiptNo,
      date: row.date,
      donorName: row.donorName,
      amount: row.amount,
      purpose: `${getFundLabel(row.type)} অনুদান`,
      badgeTitle: "Donation\nReceipt",
      paymentMethod: row.paymentMode,
      feeDetails: [
        {
          head: getFundLabel(row.type),
          period: row.remarks || row.date,
          amount: row.amount,
        },
      ],
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
      "দাতার নাম",
      "ফোন",
      "ঠিকানা",
      "ফান্ডের ধরন",
      "পেমেন্ট মাধ্যম",
      "পরিমাণ (৳)",
      "মন্তব্য",
    ];
    const dataRows = filteredRows.map((r, i) => [
      i + 1,
      r.receiptNo,
      r.date,
      r.donorName,
      r.phone || "-",
      r.address || "-",
      getFundLabel(r.type),
      r.paymentMode,
      r.amount,
      r.remarks || "-",
    ]);
    const totalRow = [
      "",
      "",
      "",
      `মোট (${totals.count} টি)`,
      "",
      "",
      "",
      "",
      totals.totalAmount,
      "",
    ];
    exportToCSV({ filename: "donation-report", headers, rows: dataRows, totalRow });
  };

  const handlePrint = () => {
    if (filteredRows.length === 0) {
      toast.error("প্রিন্ট করার মতো কোনো তথ্য নেই");
      return;
    }
    printHtmlReport({
      title: "অনুদান রিপোর্ট (Donation Report)",
      subtitle: `মোট রসিদ: ${totals.count} টি`,
      madrasaName: currentMadrasa?.name || "মাদ্রাসা ব্যবস্থাপনা",
      madrasaAddress: currentMadrasa?.address || "",
      summaryItems: [
        { label: "মোট অনুদান", value: formatBDT(totals.totalAmount) },
        { label: "মোট রসিদ", value: `${totals.count} টি` },
        { label: "দাতার সংখ্যা", value: `${totals.uniqueDonors} জন` },
      ],
      columns: [
        { label: "ক্রম", align: "center" },
        { label: "রসিদ নং" },
        { label: "তারিখ" },
        { label: "দাতার নাম ও ফোন" },
        { label: "ফান্ড" },
        { label: "মাধ্যম", align: "center" },
        { label: "পরিমাণ", align: "right" },
        { label: "মন্তব্য" },
      ],
      rows: filteredRows.map((r, i) => [
        i + 1,
        r.receiptNo,
        r.date,
        r.phone ? `${r.donorName} (${r.phone})` : r.donorName,
        getFundLabel(r.type),
        r.paymentMode,
        formatBDT(r.amount),
        r.remarks || "-",
      ]),
    });
  };

  return (
    <div className="space-y-6 pb-16 animate-in fade-in duration-500">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-xl md:text-2xl font-black text-slate-800 flex items-center gap-3">
            <HeartHandshake className="w-7 h-7 text-[#1C7D5A]" />
            অনুদান রিপোর্ট (Donation Report)
          </h1>
          <p className="text-sm text-slate-500 font-semibold mt-1">
            সাধারণ তহবিল, যাকাত, সদকা, লিল্লাহ ও অন্যান্য অনুদানের বিস্তারিত বিবরণী
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
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div className="bg-white rounded-lg p-5 shadow-sm border border-slate-200 flex items-center justify-between">
          <div>
            <p className="text-xs font-bold text-slate-400">মোট অনুদান সংগ্রহ</p>
            <p className="text-2xl font-black text-[#1C7D5A] mt-1">
              {formatBDT(totals.totalAmount)}
            </p>
          </div>
          <div className="w-11 h-11 bg-emerald-50 text-[#1C7D5A] rounded-xl flex items-center justify-center">
            <TrendingUp className="w-5 h-5" />
          </div>
        </div>

        <div className="bg-white rounded-lg p-5 shadow-sm border border-slate-200 flex items-center justify-between">
          <div>
            <p className="text-xs font-bold text-slate-400">মোট রসিদ সংখ্যা</p>
            <p className="text-2xl font-black text-slate-800 mt-1">{totals.count} টি</p>
          </div>
          <div className="w-11 h-11 bg-blue-50 text-blue-600 rounded-xl flex items-center justify-center">
            <Receipt className="w-5 h-5" />
          </div>
        </div>

        <div className="bg-white rounded-lg p-5 shadow-sm border border-slate-200 flex items-center justify-between">
          <div>
            <p className="text-xs font-bold text-slate-400">মোট দাতা</p>
            <p className="text-2xl font-black text-slate-800 mt-1">{totals.uniqueDonors} জন</p>
          </div>
          <div className="w-11 h-11 bg-amber-50 text-amber-600 rounded-xl flex items-center justify-center">
            <Users className="w-5 h-5" />
          </div>
        </div>
      </div>

      {/* Filters */}
      <div className="bg-white p-4 rounded-lg border border-slate-200 shadow-sm grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-6 gap-3 items-center">
        <div className="relative lg:col-span-2">
          <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            placeholder="দাতার নাম, ফোন, রসিদ নং..."
            className="w-full pl-9 pr-3 py-2 bg-slate-50 border border-slate-200 rounded-lg text-sm font-medium text-slate-800 outline-none focus:border-[#1C7D5A]"
          />
        </div>

        <select
          value={selectedFundType}
          onChange={(e) => setSelectedFundType(e.target.value)}
          className="px-3 py-2 bg-white border border-slate-200 rounded-lg text-sm font-semibold text-slate-700 outline-none focus:border-[#1C7D5A]"
        >
          <option value="all">সকল ফান্ড</option>
          {fundTypes.map((ft) => (
            <option key={ft} value={ft}>
              {getFundLabel(ft)}
            </option>
          ))}
        </select>

        <select
          value={selectedPaymentMode}
          onChange={(e) => setSelectedPaymentMode(e.target.value)}
          className="px-3 py-2 bg-white border border-slate-200 rounded-lg text-sm font-semibold text-slate-700 outline-none focus:border-[#1C7D5A]"
        >
          <option value="all">সকল মাধ্যম</option>
          <option value="Cash">Cash</option>
          <option value="Bkash">bKash</option>
          <option value="Nagad">Nagad</option>
          <option value="Bank">Bank</option>
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

        <div className="flex items-center gap-2">
          <input
            type="date"
            value={startDate}
            onChange={(e) => setStartDate(e.target.value)}
            className="w-full px-3 py-2 bg-white border border-slate-200 rounded-lg text-xs font-semibold text-slate-700 outline-none focus:border-[#1C7D5A]"
            title="শুরুর তারিখ"
          />
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
            <HeartHandshake className="w-10 h-10 text-slate-300 mx-auto" />
            <p className="text-sm font-bold text-slate-500">
              বর্তমান ফিল্টারে কোনো অনুদানের রেকর্ড পাওয়া যায়নি
            </p>
          </div>
        ) : (
          <>
            <div className="overflow-x-auto">
              <table className="w-full text-left border-collapse min-w-[920px]">
                <thead className="bg-[#1C7D5A18] text-slate-800 text-[11px] uppercase font-black tracking-wider whitespace-nowrap">
                  <tr>
                    <th className="px-4 py-3.5"># / রসিদ নং</th>
                    <th className="px-4 py-3.5">তারিখ</th>
                    <th className="px-4 py-3.5">দাতার তথ্য</th>
                    <th className="px-4 py-3.5 text-center">ফান্ডের ধরন</th>
                    <th className="px-4 py-3.5 text-center">পেমেন্ট মাধ্যম</th>
                    <th className="px-4 py-3.5">মন্তব্য</th>
                    <th className="px-4 py-3.5 text-right">পরিমাণ (৳)</th>
                    <th className="px-4 py-3.5 text-right">রসিদ</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100 text-sm">
                  {paginatedRows.map((row, idx) => {
                    const serial = (currentPage - 1) * ITEMS_PER_PAGE + idx + 1;
                    return (
                      <tr key={row._id} className="hover:bg-slate-50/70 transition-colors">
                        <td className="px-4 py-3 whitespace-nowrap">
                          <div className="text-[11px] font-bold text-slate-400">#{serial}</div>
                          <div className="text-xs font-mono font-bold text-slate-800">
                            {row.receiptNo}
                          </div>
                        </td>
                        <td className="px-4 py-3 whitespace-nowrap text-xs font-semibold text-slate-600">
                          {row.date}
                        </td>
                        <td className="px-4 py-3">
                          <div className="font-bold text-slate-800">{row.donorName}</div>
                          <div className="flex flex-wrap gap-x-3 text-xs text-slate-500">
                            {row.phone && (
                              <span className="inline-flex items-center gap-1">
                                <Phone className="w-3 h-3 text-slate-400" />
                                {row.phone}
                              </span>
                            )}
                            {row.address && (
                              <span className="inline-flex items-center gap-1">
                                <MapPin className="w-3 h-3 text-slate-400" />
                                {row.address}
                              </span>
                            )}
                          </div>
                        </td>
                        <td className="px-4 py-3 text-center whitespace-nowrap">
                          <span className="px-2.5 py-1 rounded-full text-xs font-bold bg-emerald-50 text-[#1C7D5A] border border-emerald-200">
                            {getFundLabel(row.type)}
                          </span>
                        </td>
                        <td className="px-4 py-3 text-center whitespace-nowrap">
                          <span className="px-2 py-1 bg-slate-100 text-slate-700 rounded text-xs font-bold">
                            {row.paymentMode}
                          </span>
                        </td>
                        <td className="px-4 py-3 text-xs text-slate-500 max-w-[200px] truncate">
                          {row.remarks || "-"}
                        </td>
                        <td className="px-4 py-3 text-right whitespace-nowrap font-black text-[#1C7D5A]">
                          {formatBDT(row.amount)}
                        </td>
                        <td className="px-4 py-3 text-right whitespace-nowrap">
                          <button
                            type="button"
                            onClick={() => openReceipt(row)}
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
                    <td colSpan="6" className="px-4 py-3 text-right text-slate-700">
                      মোট ({totals.count} টি অনুদান):
                    </td>
                    <td className="px-4 py-3 text-right text-[#1C7D5A] whitespace-nowrap">
                      {formatBDT(totals.totalAmount)}
                    </td>
                    <td></td>
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

export default DonationReport;
