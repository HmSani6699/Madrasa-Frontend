import { useState, useEffect, useMemo, useCallback } from "react";
import {
  Landmark,
  Search,
  Printer,
  Download,
  FilterX,
  Loader2,
  ChevronLeft,
  ChevronRight,
  Wallet,
  ArrowUpRight,
  ArrowDownRight,
} from "lucide-react";
import { toast } from "react-hot-toast";
import accountantService from "../../services/accountantService";
import { useAuth } from "../../context/AuthContext";
import { exportToCSV, printHtmlReport, formatBDT } from "../../utils/reportExport";

const ITEMS_PER_PAGE = 15;

const AccountLedgerReport = () => {
  const { currentMadrasa } = useAuth();
  const [accounts, setAccounts] = useState([]);
  const [transactions, setTransactions] = useState([]);
  const [summary, setSummary] = useState({
    totalBalance: 0,
    totalInflow: 0,
    totalOutflow: 0,
    accountCount: 0,
  });
  const [loading, setLoading] = useState(true);

  const [selectedAccount, setSelectedAccount] = useState("all");
  const [selectedType, setSelectedType] = useState("all");
  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");
  const [searchTerm, setSearchTerm] = useState("");
  const [currentPage, setCurrentPage] = useState(1);

  const fetchReport = useCallback(async () => {
    setLoading(true);
    try {
      const res = await accountantService.getAccountsLedgerReport({
        account_id: selectedAccount,
        type: selectedType,
        start_date: startDate,
        end_date: endDate,
      });
      if (res?.success) {
        setAccounts(res.accounts || []);
        setTransactions(res.transactions || []);
        setSummary(
          res.summary || {
            totalBalance: 0,
            totalInflow: 0,
            totalOutflow: 0,
            accountCount: 0,
          }
        );
      }
    } catch (err) {
      console.error("Accounts Ledger Error:", err);
      toast.error(err?.response?.data?.message || "অ্যাকাউন্ট রিপোর্ট লোড করতে সমস্যা হয়েছে");
    } finally {
      setLoading(false);
    }
  }, [selectedAccount, selectedType, startDate, endDate]);

  useEffect(() => {
    fetchReport();
  }, [fetchReport]);

  const filteredTransactions = useMemo(() => {
    const q = searchTerm.trim().toLowerCase();
    if (!q) return transactions;
    return transactions.filter(
      (tx) =>
        (tx.description || "").toLowerCase().includes(q) ||
        (tx.receipt_no || "").toLowerCase().includes(q) ||
        (tx.category || "").toLowerCase().includes(q) ||
        (tx.account_name || "").toLowerCase().includes(q)
    );
  }, [transactions, searchTerm]);

  useEffect(() => {
    setCurrentPage(1);
  }, [selectedAccount, selectedType, startDate, endDate, searchTerm]);

  const totalPages = Math.max(1, Math.ceil(filteredTransactions.length / ITEMS_PER_PAGE));
  const paginatedTx = useMemo(() => {
    const start = (currentPage - 1) * ITEMS_PER_PAGE;
    return filteredTransactions.slice(start, start + ITEMS_PER_PAGE);
  }, [filteredTransactions, currentPage]);

  const hasActiveFilters =
    selectedAccount !== "all" || selectedType !== "all" || startDate || endDate || searchTerm;

  const resetFilters = () => {
    setSelectedAccount("all");
    setSelectedType("all");
    setStartDate("");
    setEndDate("");
    setSearchTerm("");
  };

  const handleExportCSV = () => {
    if (filteredTransactions.length === 0) {
      toast.error("ডাউনলোড করার মতো কোনো লেনদেন নেই");
      return;
    }
    const headers = [
      "ক্রম",
      "তারিখ",
      "রসিদ / ভাউচার নং",
      "অ্যাকাউন্ট",
      "বিভাগ",
      "বিবরণ",
      "ধরন",
      "পরিমাণ (৳)",
    ];
    const rows = filteredTransactions.map((tx, i) => [
      i + 1,
      tx.date,
      tx.receipt_no,
      tx.account_name,
      tx.category,
      tx.description,
      tx.type,
      tx.amount,
    ]);
    exportToCSV({ filename: "account-ledger-report", headers, rows });
  };

  const handlePrint = () => {
    printHtmlReport({
      title: "ক্যাশ ও ব্যাংক অ্যাকাউন্ট খতিয়ান (Account Ledger Report)",
      subtitle: `অ্যাকাউন্ট সংখ্যা: ${accounts.length} টি | লেনদেন: ${filteredTransactions.length} টি`,
      madrasaName: currentMadrasa?.name || "মাদ্রাসা ব্যবস্থাপনা",
      madrasaAddress: currentMadrasa?.address || "",
      summaryItems: [
        { label: "সর্বমোট বর্তমান ব্যালেন্স", value: formatBDT(summary.totalBalance) },
        { label: "মোট জমা (Inflow)", value: formatBDT(summary.totalInflow) },
        { label: "মোট খরচ (Outflow)", value: formatBDT(summary.totalOutflow) },
      ],
      columns: [
        { label: "ক্রম", align: "center" },
        { label: "তারিখ" },
        { label: "রসিদ নং" },
        { label: "অ্যাকাউন্ট" },
        { label: "বিভাগ" },
        { label: "বিবরণ" },
        { label: "ধরন", align: "center" },
        { label: "পরিমাণ", align: "right" },
      ],
      rows: filteredTransactions.map((tx, i) => [
        i + 1,
        tx.date,
        tx.receipt_no,
        tx.account_name,
        tx.category,
        tx.description,
        tx.type,
        formatBDT(tx.amount),
      ]),
    });
  };

  return (
    <div className="space-y-6 pb-16 animate-in fade-in duration-500">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-xl md:text-2xl font-black text-slate-800 flex items-center gap-3">
            <Landmark className="w-7 h-7 text-[#1C7D5A]" />
            ক্যাশ ও ব্যাংক হিসাব রিপোর্ট (Account Ledger)
          </h1>
          <p className="text-sm text-slate-500 font-semibold mt-1">
            প্রতিষ্ঠানটির নগদ ক্যাশ, ব্যাংক ও মোবাইল ব্যাংকিং অ্যাকাউন্টগুলোর ব্যালেন্স ও খতিয়ান
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
            <p className="text-xs font-bold text-slate-400">সর্বমোট বর্তমান ব্যালেন্স</p>
            <p className="text-2xl font-black text-[#1C7D5A] mt-1">
              {formatBDT(summary.totalBalance)}
            </p>
          </div>
          <div className="w-11 h-11 bg-emerald-50 text-[#1C7D5A] rounded-xl flex items-center justify-center">
            <Wallet className="w-5 h-5" />
          </div>
        </div>

        <div className="bg-white rounded-lg p-5 shadow-sm border border-slate-200 flex items-center justify-between">
          <div>
            <p className="text-xs font-bold text-slate-400">মোট জমা (Inflow)</p>
            <p className="text-2xl font-black text-blue-600 mt-1">
              {formatBDT(summary.totalInflow)}
            </p>
          </div>
          <div className="w-11 h-11 bg-blue-50 text-blue-600 rounded-xl flex items-center justify-center">
            <ArrowUpRight className="w-5 h-5" />
          </div>
        </div>

        <div className="bg-white rounded-lg p-5 shadow-sm border border-slate-200 flex items-center justify-between">
          <div>
            <p className="text-xs font-bold text-slate-400">মোট খরচ (Outflow)</p>
            <p className="text-2xl font-black text-rose-600 mt-1">
              {formatBDT(summary.totalOutflow)}
            </p>
          </div>
          <div className="w-11 h-11 bg-rose-50 text-rose-600 rounded-xl flex items-center justify-center">
            <ArrowDownRight className="w-5 h-5" />
          </div>
        </div>
      </div>

      {/* Accounts Summary Table */}
      <div className="bg-white rounded-lg border border-slate-200 shadow-sm overflow-hidden">
        <div className="px-5 py-3.5 border-b border-slate-200 bg-slate-50 flex items-center justify-between">
          <h2 className="text-sm font-black text-slate-800">অ্যাকাউন্ট ভিত্তিক সারসংক্ষেপ</h2>
          <span className="text-xs font-bold text-slate-500">
            মোট অ্যাকাউন্ট: {accounts.length} টি
          </span>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse min-w-[800px]">
            <thead className="bg-[#1C7D5A18] text-slate-800 text-[11px] uppercase font-black tracking-wider">
              <tr>
                <th className="px-4 py-3">অ্যাকাউন্টের নাম</th>
                <th className="px-4 py-3 text-center">ধরন</th>
                <th className="px-4 py-3">ব্যাংক / নম্বর</th>
                <th className="px-4 py-3 text-center">লেনদেন</th>
                <th className="px-4 py-3 text-right">মোট জমা</th>
                <th className="px-4 py-3 text-right">মোট খরচ</th>
                <th className="px-4 py-3 text-right">বর্তমান ব্যালেন্স</th>
                <th className="px-4 py-3 text-right">ফিল্টার</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 text-sm">
              {accounts.map((acc) => (
                <tr
                  key={acc._id}
                  className={`hover:bg-slate-50/70 transition-colors ${
                    selectedAccount === acc._id ? "bg-emerald-50/50" : ""
                  }`}
                >
                  <td className="px-4 py-3 font-bold text-slate-800">{acc.name}</td>
                  <td className="px-4 py-3 text-center">
                    <span className="px-2.5 py-0.5 bg-slate-100 text-slate-700 rounded-full text-xs font-bold">
                      {acc.type}
                    </span>
                  </td>
                  <td className="px-4 py-3 text-xs text-slate-500">
                    {acc.bank_name !== "-" ? `${acc.bank_name} • ` : ""}
                    {acc.account_number}
                  </td>
                  <td className="px-4 py-3 text-center text-xs font-bold text-slate-700">
                    {acc.txCount} টি
                  </td>
                  <td className="px-4 py-3 text-right font-bold text-[#1C7D5A]">
                    {formatBDT(acc.totalInflow)}
                  </td>
                  <td className="px-4 py-3 text-right font-bold text-rose-600">
                    {formatBDT(acc.totalOutflow)}
                  </td>
                  <td className="px-4 py-3 text-right font-black text-slate-900">
                    {formatBDT(acc.balance)}
                  </td>
                  <td className="px-4 py-3 text-right">
                    <button
                      type="button"
                      onClick={() =>
                        setSelectedAccount(selectedAccount === acc._id ? "all" : acc._id)
                      }
                      className={`px-3 py-1 rounded text-xs font-bold cursor-pointer ${
                        selectedAccount === acc._id
                          ? "bg-[#1C7D5A] text-white"
                          : "bg-slate-100 text-slate-700 hover:bg-slate-200"
                      }`}
                    >
                      {selectedAccount === acc._id ? "সব দেখুন" : "খতিয়ান দেখুন"}
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Filters for Ledger Table */}
      <div className="bg-white p-4 rounded-lg border border-slate-200 shadow-sm grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-6 gap-3 items-center">
        <div className="relative lg:col-span-2">
          <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            placeholder="বিবরণ, রসিদ নং বা খাত খুঁজুন..."
            className="w-full pl-9 pr-3 py-2 bg-slate-50 border border-slate-200 rounded-lg text-sm font-medium text-slate-800 outline-none focus:border-[#1C7D5A]"
          />
        </div>

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
          value={selectedType}
          onChange={(e) => setSelectedType(e.target.value)}
          className="px-3 py-2 bg-white border border-slate-200 rounded-lg text-sm font-semibold text-slate-700 outline-none focus:border-[#1C7D5A]"
        >
          <option value="all">সকল ধরন</option>
          <option value="Income">জমা (Income)</option>
          <option value="Expense">খরচ (Expense)</option>
          <option value="Transfer">ট্রান্সফার (Transfer)</option>
        </select>

        <input
          type="date"
          value={startDate}
          onChange={(e) => setStartDate(e.target.value)}
          className="px-3 py-2 bg-white border border-slate-200 rounded-lg text-xs font-semibold text-slate-700 outline-none focus:border-[#1C7D5A]"
        />

        <div className="flex items-center gap-2">
          <input
            type="date"
            value={endDate}
            onChange={(e) => setEndDate(e.target.value)}
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

      {/* Ledger Transactions Table */}
      <div className="bg-white rounded-lg border border-slate-200 shadow-sm overflow-hidden">
        {loading ? (
          <div className="py-20 flex flex-col items-center justify-center">
            <Loader2 className="w-8 h-8 animate-spin text-[#1C7D5A] mb-3" />
            <p className="text-sm font-bold text-slate-500">তথ্য লোড হচ্ছে...</p>
          </div>
        ) : filteredTransactions.length === 0 ? (
          <div className="py-20 text-center space-y-2">
            <Landmark className="w-10 h-10 text-slate-300 mx-auto" />
            <p className="text-sm font-bold text-slate-500">কোনো লেনদেন পাওয়া যায়নি</p>
          </div>
        ) : (
          <>
            <div className="overflow-x-auto">
              <table className="w-full text-left border-collapse min-w-[900px]">
                <thead className="bg-[#1C7D5A18] text-slate-800 text-[11px] uppercase font-black tracking-wider">
                  <tr>
                    <th className="px-4 py-3.5"># / রসিদ নং</th>
                    <th className="px-4 py-3.5">তারিখ</th>
                    <th className="px-4 py-3.5">অ্যাকাউন্ট</th>
                    <th className="px-4 py-3.5">বিভাগ</th>
                    <th className="px-4 py-3.5">বিবরণ</th>
                    <th className="px-4 py-3.5 text-center">ধরন</th>
                    <th className="px-4 py-3.5 text-right">পরিমাণ (৳)</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100 text-sm">
                  {paginatedTx.map((tx, idx) => {
                    const serial = (currentPage - 1) * ITEMS_PER_PAGE + idx + 1;
                    const isInc = tx.type === "Income";
                    return (
                      <tr key={tx._id} className="hover:bg-slate-50/70 transition-colors">
                        <td className="px-4 py-3 whitespace-nowrap">
                          <div className="text-[11px] font-bold text-slate-400">#{serial}</div>
                          <div className="text-xs font-mono font-bold text-slate-800">
                            {tx.receipt_no}
                          </div>
                        </td>
                        <td className="px-4 py-3 whitespace-nowrap text-xs font-semibold text-slate-600">
                          {tx.date}
                        </td>
                        <td className="px-4 py-3 whitespace-nowrap">
                          <div className="text-xs font-bold text-slate-800">{tx.account_name}</div>
                          <div className="text-[11px] text-slate-400">{tx.payment_method}</div>
                        </td>
                        <td className="px-4 py-3 whitespace-nowrap">
                          <span className="px-2.5 py-0.5 bg-slate-100 text-slate-700 rounded-full text-xs font-bold">
                            {tx.category}
                          </span>
                        </td>
                        <td className="px-4 py-3 text-xs font-medium text-slate-700 max-w-xs truncate">
                          {tx.description}
                        </td>
                        <td className="px-4 py-3 text-center whitespace-nowrap">
                          <span
                            className={`px-2.5 py-1 rounded-full text-[11px] font-bold border ${
                              isInc
                                ? "bg-emerald-50 text-[#1C7D5A] border-emerald-200"
                                : "bg-rose-50 text-rose-600 border-rose-200"
                            }`}
                          >
                            {isInc ? "জমা" : tx.type === "Transfer" ? "ট্রান্সফার" : "খরচ"}
                          </span>
                        </td>
                        <td
                          className={`px-4 py-3 text-right whitespace-nowrap font-black ${
                            isInc ? "text-[#1C7D5A]" : "text-rose-600"
                          }`}
                        >
                          {isInc ? "+" : "-"} {formatBDT(tx.amount)}
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>

            {totalPages > 1 && (
              <div className="bg-slate-50/70 px-5 py-3.5 border-t border-slate-200 flex flex-col sm:flex-row items-center justify-between gap-3">
                <p className="text-xs font-bold text-slate-500">
                  মোট {filteredTransactions.length} টি রেকর্ডের মধ্যে{" "}
                  {(currentPage - 1) * ITEMS_PER_PAGE + 1} -{" "}
                  {Math.min(currentPage * ITEMS_PER_PAGE, filteredTransactions.length)} দেখানো হচ্ছে
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
    </div>
  );
};

export default AccountLedgerReport;
