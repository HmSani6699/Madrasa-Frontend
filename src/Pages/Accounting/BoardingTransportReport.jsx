import { useState, useEffect, useMemo, useCallback } from "react";
import {
  UtensilsCrossed,
  Bus,
  Search,
  Printer,
  Download,
  FilterX,
  Loader2,
  Receipt,
  ShoppingBag,
} from "lucide-react";
import { toast } from "react-hot-toast";
import accountantService from "../../services/accountantService";
import { useAuth } from "../../context/AuthContext";
import { exportToCSV, printHtmlReport, formatBDT } from "../../utils/reportExport";

const BoardingTransportReport = () => {
  const { currentMadrasa } = useAuth();
  const [moduleTab, setModuleTab] = useState("boarding"); // "boarding" | "transport"
  const [subTab, setSubTab] = useState("bills"); // "bills" | "expenses"
  const [selectedMonth, setSelectedMonth] = useState("all");
  const [searchTerm, setSearchTerm] = useState("");
  const [loading, setLoading] = useState(true);

  const [boarding, setBoarding] = useState({
    summary: { totalBilled: 0, totalCollected: 0, totalDue: 0, totalBazarCost: 0, netBalance: 0 },
    bills: [],
    bazar: [],
  });
  const [transport, setTransport] = useState({
    summary: { totalBilled: 0, totalCollected: 0, totalDue: 0, totalExpense: 0, netBalance: 0 },
    bills: [],
    expenses: [],
  });

  const fetchReport = useCallback(async () => {
    setLoading(true);
    try {
      const res = await accountantService.getBoardingTransportReport({
        month: selectedMonth || "all",
      });
      if (res?.success) {
        if (res.boarding) setBoarding(res.boarding);
        if (res.transport) setTransport(res.transport);
      }
    } catch (err) {
      console.error("Boarding & Transport Report Error:", err);
      toast.error(err?.response?.data?.message || "রিপোর্ট লোড করতে সমস্যা হয়েছে");
    } finally {
      setLoading(false);
    }
  }, [selectedMonth]);

  useEffect(() => {
    fetchReport();
  }, [fetchReport]);

  const activeData = moduleTab === "boarding" ? boarding : transport;

  const filteredBills = useMemo(() => {
    const q = searchTerm.trim().toLowerCase();
    const list = activeData.bills || [];
    if (!q) return list;
    return list.filter(
      (b) =>
        (b.student_name || "").toLowerCase().includes(q) ||
        (b.student_code || "").toLowerCase().includes(q) ||
        (b.class_name || "").toLowerCase().includes(q) ||
        (b.route_name || "").toLowerCase().includes(q) ||
        (b.month || "").toLowerCase().includes(q)
    );
  }, [activeData.bills, searchTerm]);

  const filteredExpenses = useMemo(() => {
    const q = searchTerm.trim().toLowerCase();
    const list = moduleTab === "boarding" ? boarding.bazar || [] : transport.expenses || [];
    if (!q) return list;
    return list.filter(
      (e) =>
        (e.item_name || e.title || "").toLowerCase().includes(q) ||
        (e.category || "").toLowerCase().includes(q) ||
        (e.buyer_name || e.paid_by || "").toLowerCase().includes(q) ||
        (e.date || "").toLowerCase().includes(q)
    );
  }, [moduleTab, boarding.bazar, transport.expenses, searchTerm]);

  const handleExportCSV = () => {
    if (subTab === "bills") {
      if (filteredBills.length === 0) return toast.error("ডাউনলোড করার মতো বিল নেই");
      const headers =
        moduleTab === "boarding"
          ? ["ক্রম", "মাস", "ছাত্র", "ক্লাস", "ধরন", "মিল সংখ্যা", "নিট বিল (৳)", "আদায় (৳)", "বকেয়া (৳)", "অবস্থা"]
          : ["ক্রম", "মাস", "ছাত্র", "ক্লাস", "রুট ও স্টপেজ", "নিট বিল (৳)", "আদায় (৳)", "বকেয়া (৳)", "অবস্থা"];
      const rows = filteredBills.map((b, i) =>
        moduleTab === "boarding"
          ? [i + 1, b.month, b.student_name, b.class_name, b.residential_type, b.meal_count || 0, b.net_payable, b.paid_amount, b.due_amount, b.status]
          : [i + 1, b.month, b.student_name, b.class_name, `${b.route_name || "-"} (${b.stoppage || "-"})`, b.net_payable, b.paid_amount, b.due_amount, b.status]
      );
      exportToCSV({ filename: `${moduleTab}-bills-report`, headers, rows });
    } else {
      if (filteredExpenses.length === 0) return toast.error("ডাউনলোড করার মতো খরচের তথ্য নেই");
      const headers =
        moduleTab === "boarding"
          ? ["ক্রম", "তারিখ", "আইটেম", "ক্যাটাগরি", "পরিমাণ", "একক দাম (৳)", "মোট খরচ (৳)", "ক্রেতা"]
          : ["ক্রম", "তারিখ", "বিবরণ", "ক্যাটাগরি", "পরিমাণ", "মোট খরচ (৳)", "পরিশোধকারী"];
      const rows = filteredExpenses.map((e, i) =>
        moduleTab === "boarding"
          ? [i + 1, e.date, e.item_name, e.category, `${e.quantity} ${e.unit || ""}`, e.unit_price, e.total_cost, e.buyer_name || "-"]
          : [i + 1, e.date, e.title, e.category, `${e.quantity || "-"} ${e.unit || ""}`, e.amount, e.paid_by || "-"]
      );
      exportToCSV({ filename: `${moduleTab}-expenses-report`, headers, rows });
    }
  };

  const handlePrint = () => {
    const titlePrefix = moduleTab === "boarding" ? "বোর্ডিং হিসাব রিপোর্ট" : "ট্রান্সপোর্ট হিসাব রিপোর্ট";
    const s = activeData.summary;
    const expTotal = moduleTab === "boarding" ? s.totalBazarCost : s.totalExpense;

    if (subTab === "bills") {
      printHtmlReport({
        title: `${titlePrefix} — বিল ও আদায়`,
        subtitle: `মাস: ${selectedMonth === "all" ? "সকল মাস" : selectedMonth}`,
        madrasaName: currentMadrasa?.name || "মাদ্রাসা ব্যবস্থাপনা",
        madrasaAddress: currentMadrasa?.address || "",
        summaryItems: [
          { label: "মোট বিল", value: formatBDT(s.totalBilled) },
          { label: "মোট আদায়", value: formatBDT(s.totalCollected) },
          { label: "মোট বকেয়া", value: formatBDT(s.totalDue) },
          { label: "মোট খরচ", value: formatBDT(expTotal) },
          { label: "নিট ব্যালেন্স", value: formatBDT(s.netBalance) },
        ],
        columns: [
          { label: "ক্রম", align: "center" },
          { label: "মাস" },
          { label: "শিক্ষার্থী" },
          { label: "ক্লাস" },
          { label: "নিট বিল", align: "right" },
          { label: "আদায়", align: "right" },
          { label: "বকেয়া", align: "right" },
          { label: "অবস্থা", align: "center" },
        ],
        rows: filteredBills.map((b, i) => [
          i + 1,
          b.month,
          b.student_name,
          b.class_name || "-",
          formatBDT(b.net_payable),
          formatBDT(b.paid_amount),
          formatBDT(b.due_amount),
          b.status,
        ]),
      });
    } else {
      printHtmlReport({
        title: `${titlePrefix} — খরচ বিবরণী`,
        subtitle: `মাস: ${selectedMonth === "all" ? "সকল মাস" : selectedMonth}`,
        madrasaName: currentMadrasa?.name || "মাদ্রাসা ব্যবস্থাপনা",
        madrasaAddress: currentMadrasa?.address || "",
        summaryItems: [
          { label: "মোট আদায়", value: formatBDT(s.totalCollected) },
          { label: "মোট খরচ", value: formatBDT(expTotal) },
          { label: "নিট ব্যালেন্স", value: formatBDT(s.netBalance) },
        ],
        columns: [
          { label: "ক্রম", align: "center" },
          { label: "তারিখ" },
          { label: "আইটেম / বিবরণ" },
          { label: "ক্যাটাগরি" },
          { label: "খরচ", align: "right" },
          { label: "ক্রেতা / পরিশোধকারী" },
        ],
        rows: filteredExpenses.map((e, i) => [
          i + 1,
          e.date,
          e.item_name || e.title,
          e.category,
          formatBDT(e.total_cost ?? e.amount),
          e.buyer_name || e.paid_by || "-",
        ]),
      });
    }
  };

  const expenseVal =
    moduleTab === "boarding"
      ? boarding.summary.totalBazarCost
      : transport.summary.totalExpense;

  return (
    <div className="space-y-6 pb-16 animate-in fade-in duration-500">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-xl md:text-2xl font-black text-slate-800 flex items-center gap-3">
            {moduleTab === "boarding" ? (
              <UtensilsCrossed className="w-7 h-7 text-[#1C7D5A]" />
            ) : (
              <Bus className="w-7 h-7 text-[#1C7D5A]" />
            )}
            বোর্ডিং ও ট্রান্সপোর্ট হিসাব রিপোর্ট
          </h1>
          <p className="text-sm text-slate-500 font-semibold mt-1">
            বোর্ডিং বিল ও বাজার খরচ এবং ট্রান্সপোর্ট বিল ও জ্বালানি/রক্ষণাবেক্ষণ খরচের টেবিল রিপোর্ট
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-2.5">
          <button
            type="button"
            onClick={handlePrint}
            className="px-4 py-2 bg-white border border-slate-200 hover:border-[#1C7D5A] text-slate-700 rounded-lg font-bold text-xs flex items-center gap-2 shadow-sm cursor-pointer"
          >
            <Printer className="w-4 h-4 text-[#1C7D5A]" />
            রিপোর্ট প্রিন্ট
          </button>
          <button
            type="button"
            onClick={handleExportCSV}
            className="px-4 py-2 bg-[#1C7D5A] hover:bg-[#123628] text-white rounded-lg font-bold text-xs flex items-center gap-2 shadow-sm cursor-pointer"
          >
            <Download className="w-4 h-4" />
            CSV ডাউনলোড
          </button>
        </div>
      </div>

      {/* Module Switcher + Filters */}
      <div className="bg-white p-4 rounded-lg border border-slate-200 shadow-sm flex flex-col lg:flex-row lg:items-center justify-between gap-4">
        <div className="flex flex-wrap items-center gap-2">
          <button
            type="button"
            onClick={() => setModuleTab("boarding")}
            className={`px-4 py-2 rounded-lg text-xs font-bold flex items-center gap-2 cursor-pointer ${
              moduleTab === "boarding"
                ? "bg-[#1C7D5A] text-white"
                : "bg-slate-100 text-slate-600 hover:bg-slate-200"
            }`}
          >
            <UtensilsCrossed className="w-4 h-4" />
            বোর্ডিং হিসাব
          </button>
          <button
            type="button"
            onClick={() => setModuleTab("transport")}
            className={`px-4 py-2 rounded-lg text-xs font-bold flex items-center gap-2 cursor-pointer ${
              moduleTab === "transport"
                ? "bg-[#1C7D5A] text-white"
                : "bg-slate-100 text-slate-600 hover:bg-slate-200"
            }`}
          >
            <Bus className="w-4 h-4" />
            ট্রান্সপোর্ট হিসাব
          </button>

          <div className="h-6 w-px bg-slate-200 mx-1 hidden sm:block" />

          <button
            type="button"
            onClick={() => setSubTab("bills")}
            className={`px-3.5 py-2 rounded-lg text-xs font-bold flex items-center gap-1.5 cursor-pointer border ${
              subTab === "bills"
                ? "bg-emerald-50 text-[#1C7D5A] border-[#1C7D5A]"
                : "bg-white text-slate-600 border-slate-200"
            }`}
          >
            <Receipt className="w-3.5 h-3.5" />
            বিল ও আদায় ({filteredBills.length})
          </button>
          <button
            type="button"
            onClick={() => setSubTab("expenses")}
            className={`px-3.5 py-2 rounded-lg text-xs font-bold flex items-center gap-1.5 cursor-pointer border ${
              subTab === "expenses"
                ? "bg-rose-50 text-rose-600 border-rose-300"
                : "bg-white text-slate-600 border-slate-200"
            }`}
          >
            <ShoppingBag className="w-3.5 h-3.5" />
            {moduleTab === "boarding" ? "বাজার খরচ" : "জ্বালানি ও খরচ"} ({filteredExpenses.length})
          </button>
        </div>

        <div className="flex flex-wrap items-center gap-2">
          <div className="relative">
            <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              placeholder="খুঁজুন..."
              className="pl-9 pr-3 py-2 bg-slate-50 border border-slate-200 rounded-lg text-sm outline-none focus:border-[#1C7D5A]"
            />
          </div>
          <input
            type="month"
            value={selectedMonth === "all" ? "" : selectedMonth}
            onChange={(e) => setSelectedMonth(e.target.value || "all")}
            className="px-3 py-2 bg-white border border-slate-200 rounded-lg text-sm font-semibold outline-none focus:border-[#1C7D5A]"
          />
          {(selectedMonth !== "all" || searchTerm) && (
            <button
              type="button"
              onClick={() => {
                setSelectedMonth("all");
                setSearchTerm("");
              }}
              className="p-2 bg-slate-100 hover:bg-rose-50 text-slate-600 hover:text-rose-600 rounded-lg border border-slate-200 cursor-pointer"
              title="রিসেট"
            >
              <FilterX className="w-4 h-4" />
            </button>
          )}
        </div>
      </div>

      {/* KPI Cards */}
      <div className="grid grid-cols-2 lg:grid-cols-5 gap-4">
        <div className="bg-white p-4 rounded-lg border border-slate-200 shadow-sm">
          <p className="text-xs font-bold text-slate-400">মোট বিল</p>
          <p className="text-xl font-black text-slate-800 mt-1">
            {formatBDT(activeData.summary.totalBilled)}
          </p>
        </div>
        <div className="bg-white p-4 rounded-lg border border-slate-200 shadow-sm">
          <p className="text-xs font-bold text-slate-400">মোট আদায়</p>
          <p className="text-xl font-black text-[#1C7D5A] mt-1">
            {formatBDT(activeData.summary.totalCollected)}
          </p>
        </div>
        <div className="bg-white p-4 rounded-lg border border-slate-200 shadow-sm">
          <p className="text-xs font-bold text-slate-400">মোট বকেয়া</p>
          <p className="text-xl font-black text-rose-600 mt-1">
            {formatBDT(activeData.summary.totalDue)}
          </p>
        </div>
        <div className="bg-white p-4 rounded-lg border border-slate-200 shadow-sm">
          <p className="text-xs font-bold text-slate-400">
            {moduleTab === "boarding" ? "মোট বাজার খরচ" : "জ্বালানি ও অন্যান্য খরচ"}
          </p>
          <p className="text-xl font-black text-amber-600 mt-1">{formatBDT(expenseVal)}</p>
        </div>
        <div className="bg-[#123628] text-white p-4 rounded-lg border border-[#1C7D5A] shadow-sm col-span-2 lg:col-span-1">
          <p className="text-xs font-bold text-white/75">নিট ব্যালেন্স (আদায় - খরচ)</p>
          <p className="text-xl font-black mt-1">
            {activeData.summary.netBalance < 0 ? "-" : ""}
            {formatBDT(Math.abs(activeData.summary.netBalance))}
          </p>
        </div>
      </div>

      {/* Table */}
      <div className="bg-white rounded-lg border border-slate-200 shadow-sm overflow-hidden">
        {loading ? (
          <div className="py-20 flex flex-col items-center justify-center">
            <Loader2 className="w-8 h-8 animate-spin text-[#1C7D5A] mb-3" />
            <p className="text-sm font-bold text-slate-500">তথ্য লোড হচ্ছে...</p>
          </div>
        ) : subTab === "bills" ? (
          filteredBills.length === 0 ? (
            <div className="py-20 text-center text-sm font-bold text-slate-500">
              কোনো বিলের তথ্য পাওয়া যায়নি
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full text-left border-collapse min-w-[900px]">
                <thead className="bg-[#1C7D5A18] text-slate-800 text-[11px] uppercase font-black tracking-wider">
                  <tr>
                    <th className="px-4 py-3.5">#</th>
                    <th className="px-4 py-3.5">মাস</th>
                    <th className="px-4 py-3.5">শিক্ষার্থী</th>
                    <th className="px-4 py-3.5">ক্লাস</th>
                    <th className="px-4 py-3.5">
                      {moduleTab === "boarding" ? "ধরন ও মিল" : "রুট ও স্টপেজ"}
                    </th>
                    <th className="px-4 py-3.5 text-right">নিট বিল</th>
                    <th className="px-4 py-3.5 text-right">আদায়</th>
                    <th className="px-4 py-3.5 text-right">বকেয়া</th>
                    <th className="px-4 py-3.5 text-center">অবস্থা</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100 text-sm">
                  {filteredBills.map((b, i) => (
                    <tr key={b._id} className="hover:bg-slate-50/70">
                      <td className="px-4 py-3 text-xs font-bold text-slate-400">#{i + 1}</td>
                      <td className="px-4 py-3 text-xs font-bold text-slate-700">{b.month}</td>
                      <td className="px-4 py-3">
                        <div className="font-bold text-slate-800">{b.student_name}</div>
                        <div className="text-xs text-slate-400">
                          {b.student_code || ""} {b.roll_number ? `• রোল: ${b.roll_number}` : ""}
                        </div>
                      </td>
                      <td className="px-4 py-3 text-xs font-semibold text-slate-700">
                        {b.class_name || "-"}
                      </td>
                      <td className="px-4 py-3 text-xs text-slate-600">
                        {moduleTab === "boarding"
                          ? `${b.residential_type || "-"} (${b.meal_count || 0} মিল)`
                          : `${b.route_name || "-"} • ${b.stoppage || "-"}`}
                      </td>
                      <td className="px-4 py-3 text-right font-bold text-slate-800">
                        {formatBDT(b.net_payable)}
                      </td>
                      <td className="px-4 py-3 text-right font-black text-[#1C7D5A]">
                        {formatBDT(b.paid_amount)}
                      </td>
                      <td className="px-4 py-3 text-right font-bold text-rose-600">
                        {formatBDT(b.due_amount)}
                      </td>
                      <td className="px-4 py-3 text-center">
                        <span
                          className={`px-2.5 py-0.5 rounded-full text-[11px] font-bold border ${
                            b.status === "Paid"
                              ? "bg-emerald-50 text-[#1C7D5A] border-emerald-200"
                              : b.status === "Partial"
                                ? "bg-amber-50 text-amber-700 border-amber-200"
                                : "bg-rose-50 text-rose-600 border-rose-200"
                          }`}
                        >
                          {b.status === "Paid"
                            ? "পরিশোধিত"
                            : b.status === "Partial"
                              ? "আংশিক"
                              : "বকেয়া"}
                        </span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )
        ) : filteredExpenses.length === 0 ? (
          <div className="py-20 text-center text-sm font-bold text-slate-500">
            কোনো খরচের তথ্য পাওয়া যায়নি
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse min-w-[800px]">
              <thead className="bg-[#1C7D5A18] text-slate-800 text-[11px] uppercase font-black tracking-wider">
                <tr>
                  <th className="px-4 py-3.5">#</th>
                  <th className="px-4 py-3.5">তারিখ</th>
                  <th className="px-4 py-3.5">আইটেম / বিবরণ</th>
                  <th className="px-4 py-3.5 text-center">ক্যাটাগরি</th>
                  <th className="px-4 py-3.5">পরিমাণ</th>
                  <th className="px-4 py-3.5 text-right">মোট খরচ (৳)</th>
                  <th className="px-4 py-3.5">ক্রেতা / পরিশোধকারী</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 text-sm">
                {filteredExpenses.map((e, i) => (
                  <tr key={e._id} className="hover:bg-slate-50/70">
                    <td className="px-4 py-3 text-xs font-bold text-slate-400">#{i + 1}</td>
                    <td className="px-4 py-3 text-xs font-semibold text-slate-600">{e.date}</td>
                    <td className="px-4 py-3 font-bold text-slate-800">
                      {e.item_name || e.title}
                      {e.notes && <div className="text-xs font-normal text-slate-400">{e.notes}</div>}
                    </td>
                    <td className="px-4 py-3 text-center">
                      <span className="px-2.5 py-0.5 bg-slate-100 text-slate-700 rounded-full text-xs font-bold">
                        {e.category}
                      </span>
                    </td>
                    <td className="px-4 py-3 text-xs text-slate-600">
                      {e.quantity ? `${e.quantity} ${e.unit || ""}` : "-"}
                    </td>
                    <td className="px-4 py-3 text-right font-black text-rose-600">
                      {formatBDT(e.total_cost ?? e.amount)}
                    </td>
                    <td className="px-4 py-3 text-xs text-slate-600">
                      {e.buyer_name || e.paid_by || "-"}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
};

export default BoardingTransportReport;
