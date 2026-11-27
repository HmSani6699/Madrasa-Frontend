import { useState, useEffect, useMemo, useCallback } from "react";
import {
  TrendingUp,
  TrendingDown,
  Activity,
  Search,
  Printer,
  Download,
  FilterX,
  Loader2,
  ChevronLeft,
  ChevronRight,
  ArrowUpRight,
  ArrowDownRight,
  List,
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

const IncomeExpenseReport = () => {
  const { t } = useTranslation();
  const { currentMadrasa } = useAuth();
  const [rows, setRows] = useState([]);
  const [categories, setCategories] = useState([]);
  const [accounts, setAccounts] = useState([]);
  const [loading, setLoading] = useState(true);

  const [searchTerm, setSearchTerm] = useState("");
  const [selectedType, setSelectedType] = useState("all");
  const [selectedCategory, setSelectedCategory] = useState("all");
  const [selectedAccount, setSelectedAccount] = useState("all");
  const [selectedMonth, setSelectedMonth] = useState("all");
  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");
  const [currentPage, setCurrentPage] = useState(1);

  const [selectedVoucher, setSelectedVoucher] = useState(null);

  const getCategoryLabel = useCallback(
    (cat) => {
      if (!cat) return "-";
      const bnMap = {
        Fee: "শিক্ষার্থী ফি",
        "Boarding Fee": "বোর্ডিং ফি",
        "Transport Fee": "ট্রান্সপোর্ট ফি",
        Donation: "অনুদান",
        Salary: "কর্মচারী বেতন",
        "Boarding Bazar": "বোর্ডিং বাজার খরচ",
        Fuel: "জ্বালানি খরচ",
        Maintenance: "মেরামত ও রক্ষণাবেক্ষণ",
        "Driver Allowance": "ড্রাইভার ভাতা",
        "Toll & Parking": "টোল ও পার্কিং",
        "Insurance & Tax": "বীমা ও ট্যাক্স",
      };
      if (bnMap[cat]) return bnMap[cat];
      const incKey = `income_page.categories.${cat}`;
      const tInc = t(incKey);
      if (tInc !== incKey) return tInc;
      const expKey = `expense_page.categories.${cat}`;
      const tExp = t(expKey);
      if (tExp !== expKey) return tExp;
      return cat;
    },
    [t]
  );

  const fetchReport = useCallback(async () => {
    setLoading(true);
    try {
      const res = await accountantService.getIncomeExpenseReport({
        type: selectedType,
        category: selectedCategory,
        account_id: selectedAccount,
        month: selectedMonth,
        start_date: startDate,
        end_date: endDate,
      });
      if (res?.success) {
        setRows(res.data || []);
        setCategories(res.categories || []);
        setAccounts(res.accounts || []);
      }
    } catch (err) {
      console.error("Income Expense Report Error:", err);
      toast.error(err?.response?.data?.message || "আয়-ব্যয় রিপোর্ট লোড করতে সমস্যা হয়েছে");
    } finally {
      setLoading(false);
    }
  }, [selectedType, selectedCategory, selectedAccount, selectedMonth, startDate, endDate]);

  useEffect(() => {
    fetchReport();
  }, [fetchReport]);

  const filteredRows = useMemo(() => {
    const q = searchTerm.trim().toLowerCase();
    if (!q) return rows;
    return rows.filter(
      (r) =>
        (r.title || "").toLowerCase().includes(q) ||
        (r.description || "").toLowerCase().includes(q) ||
        (r.receipt_no || "").toLowerCase().includes(q) ||
        (r.category || "").toLowerCase().includes(q) ||
        getCategoryLabel(r.category).toLowerCase().includes(q)
    );
  }, [rows, searchTerm, getCategoryLabel]);

  useEffect(() => {
    setCurrentPage(1);
  }, [
    searchTerm,
    selectedType,
    selectedCategory,
    selectedAccount,
    selectedMonth,
    startDate,
    endDate,
  ]);

  const stats = useMemo(() => {
    const income = filteredRows
      .filter((r) => r.type === "Income")
      .reduce((s, r) => s + Number(r.amount || 0), 0);
    const expense = filteredRows
      .filter((r) => r.type === "Expense")
      .reduce((s, r) => s + Number(r.amount || 0), 0);
    return {
      income,
      expense,
      balance: income - expense,
      count: filteredRows.length,
    };
  }, [filteredRows]);

  const totalPages = Math.max(1, Math.ceil(filteredRows.length / ITEMS_PER_PAGE));
  const paginatedRows = useMemo(() => {
    const start = (currentPage - 1) * ITEMS_PER_PAGE;
    return filteredRows.slice(start, start + ITEMS_PER_PAGE);
  }, [filteredRows, currentPage]);

  const hasActiveFilters =
    searchTerm ||
    selectedType !== "all" ||
    selectedCategory !== "all" ||
    selectedAccount !== "all" ||
    selectedMonth !== "all" ||
    startDate ||
    endDate;

  const resetFilters = () => {
    setSearchTerm("");
    setSelectedType("all");
    setSelectedCategory("all");
    setSelectedAccount("all");
    setSelectedMonth("all");
    setStartDate("");
    setEndDate("");
  };

  const openVoucher = (row) => {
    const isExp = row.type === "Expense";
    setSelectedVoucher({
      receiptNo: row.receipt_no,
      date: row.date,
      amount: row.amount,
      subtotal: row.amount,
      paidAmount: row.amount,
      remainingDue: 0,
      purpose: row.description || row.title,
      badgeTitle: isExp ? "Payment\nVoucher" : "Income\nReceipt",
      modalTitle: isExp ? "অফিসিয়াল ব্যয় ভাউচার" : "অফিসিয়াল আয় রসিদ",
      partyTitle: isExp ? "ব্যয়ের বিবরণ" : "আয়ের উৎস",
      partyName: row.title,
      partySubtitle: `${getCategoryLabel(row.category)} • ${row.payment_method}`,
      partyIdText: `নং: ${row.receipt_no}`,
      paymentMethod: row.payment_method,
      feeDetails: [
        {
          head: row.title,
          period: getCategoryLabel(row.category),
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
      "তারিখ",
      "ভাউচার/রসিদ নং",
      "ধরন",
      "বিভাগ",
      "শিরোনাম ও বিবরণ",
      "অ্যাকাউন্ট / মাধ্যম",
      "পরিমাণ (৳)",
    ];
    const dataRows = filteredRows.map((r, i) => [
      i + 1,
      r.date,
      r.receipt_no,
      r.type === "Income" ? "আয়" : "ব্যয়",
      getCategoryLabel(r.category),
      r.description || r.title,
      `${r.account_name} (${r.payment_method})`,
      r.type === "Income" ? r.amount : -r.amount,
    ]);
    const totalRow = [
      "",
      "",
      "",
      `আয়: ${stats.income} | ব্যয়: ${stats.expense}`,
      "",
      "",
      "নিট ব্যালেন্স:",
      stats.balance,
    ];
    exportToCSV({ filename: "income-expense-report", headers, rows: dataRows, totalRow });
  };

  const handlePrint = () => {
    if (filteredRows.length === 0) {
      toast.error("প্রিন্ট করার মতো কোনো তথ্য নেই");
      return;
    }
    printHtmlReport({
      title: "আয় ও ব্যয় রিপোর্ট (Income & Expense Report)",
      subtitle: `মোট লেনদেন: ${stats.count} টি`,
      madrasaName: currentMadrasa?.name || "মাদ্রাসা ব্যবস্থাপনা",
      madrasaAddress: currentMadrasa?.address || "",
      summaryItems: [
        { label: "মোট আয়", value: formatBDT(stats.income) },
        { label: "মোট ব্যয়", value: formatBDT(stats.expense) },
        {
          label: stats.balance >= 0 ? "নিট উদ্বৃত্ত" : "নিট ঘাটতি",
          value: formatBDT(Math.abs(stats.balance)),
        },
      ],
      columns: [
        { label: "ক্রম", align: "center" },
        { label: "তারিখ" },
        { label: "রসিদ / ভাউচার" },
        { label: "বিভাগ" },
        { label: "বিবরণ" },
        { label: "অ্যাকাউন্ট / মাধ্যম" },
        { label: "ধরন", align: "center" },
        { label: "পরিমাণ", align: "right" },
      ],
      rows: filteredRows.map((r, i) => [
        i + 1,
        r.date,
        r.receipt_no,
        getCategoryLabel(r.category),
        r.description || r.title,
        `${r.account_name} (${r.payment_method})`,
        r.type === "Income" ? "আয়" : "ব্যয়",
        `${r.type === "Income" ? "+" : "-"} ${formatBDT(r.amount)}`,
      ]),
    });
  };

  return (
    <div className="space-y-6 pb-16 animate-in fade-in duration-500">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-xl md:text-2xl font-black text-slate-800 flex items-center gap-3">
            <Activity className="w-7 h-7 text-[#1C7D5A]" />
            আয় ও ব্যয় রিপোর্ট (Income & Expense Report)
          </h1>
          <p className="text-sm text-slate-500 font-semibold mt-1">
            ফি, অনুদান, বোর্ডিং, ট্রান্সপোর্ট, বেতন ও সকল খাতের একত্রিত আয়-ব্যয় বিবরণী
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-2.5">
          <button
            type="button"
            onClick={handlePrint}
            className="px-4 py-2 bg-white border border-slate-200 hover:border-[#1C7D5A] text-slate-700 rounded-lg font-bold text-xs flex items-center gap-2 shadow-sm cursor-pointer transition-colors"
          >
            <Printer className="w-4 h-4 text-[#1C7D5A]" />
            বিবৃতি প্রিন্ট
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
            <p className="text-xs font-bold text-slate-400">মোট আয় (Total Income)</p>
            <p className="text-2xl font-black text-[#1C7D5A] mt-1">{formatBDT(stats.income)}</p>
          </div>
          <div className="w-11 h-11 bg-emerald-50 text-[#1C7D5A] rounded-xl flex items-center justify-center">
            <TrendingUp className="w-5 h-5" />
          </div>
        </div>

        <div className="bg-white rounded-lg p-5 shadow-sm border border-slate-200 flex items-center justify-between">
          <div>
            <p className="text-xs font-bold text-slate-400">মোট ব্যয় (Total Expense)</p>
            <p className="text-2xl font-black text-rose-600 mt-1">{formatBDT(stats.expense)}</p>
          </div>
          <div className="w-11 h-11 bg-rose-50 text-rose-600 rounded-xl flex items-center justify-center">
            <TrendingDown className="w-5 h-5" />
          </div>
        </div>

        <div
          className={`rounded-lg p-5 shadow-sm border flex items-center justify-between ${
            stats.balance >= 0
              ? "bg-[#123628] text-white border-[#1C7D5A]"
              : "bg-rose-950 text-white border-rose-800"
          }`}
        >
          <div>
            <p className="text-xs font-bold text-white/75">
              নিট ব্যালেন্স ({stats.balance >= 0 ? "উদ্বৃত্ত" : "ঘাটতি"})
            </p>
            <p className="text-2xl font-black mt-1">
              {stats.balance < 0 ? "-" : ""}
              {formatBDT(Math.abs(stats.balance))}
            </p>
          </div>
          <div className="w-11 h-11 bg-white/15 rounded-xl flex items-center justify-center">
            <Activity className="w-5 h-5" />
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
            placeholder="বিবরণ, ভাউচার নং বা খাত..."
            className="w-full pl-9 pr-3 py-2 bg-slate-50 border border-slate-200 rounded-lg text-sm font-medium text-slate-800 outline-none focus:border-[#1C7D5A]"
          />
        </div>

        <select
          value={selectedType}
          onChange={(e) => setSelectedType(e.target.value)}
          className="px-3 py-2 bg-white border border-slate-200 rounded-lg text-sm font-semibold text-slate-700 outline-none focus:border-[#1C7D5A]"
        >
          <option value="all">সকল ধরন (আয় ও ব্যয়)</option>
          <option value="Income">শুধু আয় (Income)</option>
          <option value="Expense">শুধু ব্যয় (Expense)</option>
        </select>

        <select
          value={selectedCategory}
          onChange={(e) => setSelectedCategory(e.target.value)}
          className="px-3 py-2 bg-white border border-slate-200 rounded-lg text-sm font-semibold text-slate-700 outline-none focus:border-[#1C7D5A]"
        >
          <option value="all">সকল বিভাগ</option>
          {categories.map((cat) => (
            <option key={cat} value={cat}>
              {getCategoryLabel(cat)}
            </option>
          ))}
        </select>

        <select
          value={selectedAccount}
          onChange={(e) => setSelectedAccount(e.target.value)}
          className="px-3 py-2 bg-white border border-slate-200 rounded-lg text-sm font-semibold text-slate-700 outline-none focus:border-[#1C7D5A]"
        >
          <option value="all">সকল অ্যাকাউন্ট</option>
          {accounts.map((acc) => (
            <option key={acc._id} value={acc._id}>
              {acc.name}
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

        <div className="flex items-center gap-2">
          <input
            type="date"
            value={startDate}
            onChange={(e) => setStartDate(e.target.value)}
            className="w-full px-3 py-2 bg-white border border-slate-200 rounded-lg text-xs font-semibold text-slate-700 outline-none focus:border-[#1C7D5A]"
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
            <List className="w-10 h-10 text-slate-300 mx-auto" />
            <p className="text-sm font-bold text-slate-500">
              বর্তমান ফিল্টারে কোনো লেনদেন পাওয়া যায়নি
            </p>
          </div>
        ) : (
          <>
            <div className="overflow-x-auto">
              <table className="w-full text-left border-collapse min-w-[980px]">
                <thead className="bg-[#1C7D5A18] text-slate-800 text-[11px] uppercase font-black tracking-wider whitespace-nowrap">
                  <tr>
                    <th className="px-4 py-3.5"># / ভাউচার নং</th>
                    <th className="px-4 py-3.5">তারিখ</th>
                    <th className="px-4 py-3.5">বিভাগ</th>
                    <th className="px-4 py-3.5">বিবরণ</th>
                    <th className="px-4 py-3.5">অ্যাকাউন্ট / মাধ্যম</th>
                    <th className="px-4 py-3.5 text-center">ধরন</th>
                    <th className="px-4 py-3.5 text-right">পরিমাণ (৳)</th>
                    <th className="px-4 py-3.5 text-right">ভাউচার</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100 text-sm">
                  {paginatedRows.map((row, idx) => {
                    const serial = (currentPage - 1) * ITEMS_PER_PAGE + idx + 1;
                    const isInc = row.type === "Income";
                    return (
                      <tr key={row._id} className="hover:bg-slate-50/70 transition-colors">
                        <td className="px-4 py-3 whitespace-nowrap">
                          <div className="text-[11px] font-bold text-slate-400">#{serial}</div>
                          <div className="text-xs font-mono font-bold text-slate-800">
                            {row.receipt_no}
                          </div>
                        </td>
                        <td className="px-4 py-3 whitespace-nowrap text-xs font-semibold text-slate-600">
                          {row.date}
                        </td>
                        <td className="px-4 py-3 whitespace-nowrap">
                          <span className="px-2.5 py-1 rounded-full text-xs font-bold bg-slate-100 text-slate-700">
                            {getCategoryLabel(row.category)}
                          </span>
                        </td>
                        <td className="px-4 py-3">
                          <div className="font-bold text-slate-800 max-w-xs truncate">
                            {row.title}
                          </div>
                          {row.description && row.description !== row.title && (
                            <div className="text-xs text-slate-400 max-w-xs truncate">
                              {row.description}
                            </div>
                          )}
                        </td>
                        <td className="px-4 py-3 whitespace-nowrap">
                          <div className="text-xs font-bold text-slate-700">{row.account_name}</div>
                          <div className="text-[11px] text-slate-400">{row.payment_method}</div>
                        </td>
                        <td className="px-4 py-3 text-center whitespace-nowrap">
                          <span
                            className={`inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-[11px] font-bold border ${
                              isInc
                                ? "bg-emerald-50 text-[#1C7D5A] border-emerald-200"
                                : "bg-rose-50 text-rose-600 border-rose-200"
                            }`}
                          >
                            {isInc ? (
                              <ArrowUpRight className="w-3 h-3" />
                            ) : (
                              <ArrowDownRight className="w-3 h-3" />
                            )}
                            {isInc ? "আয়" : "ব্যয়"}
                          </span>
                        </td>
                        <td
                          className={`px-4 py-3 text-right whitespace-nowrap font-black ${
                            isInc ? "text-[#1C7D5A]" : "text-rose-600"
                          }`}
                        >
                          {isInc ? "+" : "-"} {formatBDT(row.amount)}
                        </td>
                        <td className="px-4 py-3 text-right whitespace-nowrap">
                          <button
                            type="button"
                            onClick={() => openVoucher(row)}
                            className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-slate-100 hover:bg-[#1C7D5A] text-slate-700 hover:text-white rounded-lg text-xs font-bold transition-colors cursor-pointer"
                          >
                            <Printer className="w-3.5 h-3.5" />
                            প্রিন্ট
                          </button>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
                <tfoot className="bg-slate-50 border-t-2 border-slate-200 text-sm font-black">
                  <tr>
                    <td colSpan="6" className="px-4 py-3 text-right text-slate-700">
                      মোট আয়: {formatBDT(stats.income)} | মোট ব্যয়: {formatBDT(stats.expense)} | নিট ব্যালেন্স:
                    </td>
                    <td
                      className={`px-4 py-3 text-right whitespace-nowrap ${
                        stats.balance >= 0 ? "text-[#1C7D5A]" : "text-rose-600"
                      }`}
                    >
                      {stats.balance < 0 ? "-" : ""}
                      {formatBDT(Math.abs(stats.balance))}
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

export default IncomeExpenseReport;
