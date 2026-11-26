import { useState, useEffect, useCallback, useMemo } from "react";
import { Calculator, Receipt, Wallet, Loader2, X, Search } from "lucide-react";
import { toast } from "react-hot-toast";
import transportService from "../../../services/transportService";
import { formatCurrency, getCurrentMonthStr } from "./transportConstants";
import TransportPageHeader from "./TransportPageHeader";

const TransportBillingPage = () => {
  const [selectedMonth, setSelectedMonth] = useState(getCurrentMonthStr());
  const [routeFilter, setRouteFilter] = useState("all");
  const [statusFilter, setStatusFilter] = useState("all");
  const [searchTerm, setSearchTerm] = useState("");
  const [bills, setBills] = useState([]);
  const [routes, setRoutes] = useState([]);
  const [metrics, setMetrics] = useState({});
  const [accounts, setAccounts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [generating, setGenerating] = useState(false);

  const [collectTarget, setCollectTarget] = useState(null);
  const [collectForm, setCollectForm] = useState({
    paid_amount: "",
    payment_method: "Cash",
    account_id: "",
    remarks: "",
  });
  const [collecting, setCollecting] = useState(false);

  const fetchBills = useCallback(async () => {
    try {
      setLoading(true);
      const res = await transportService.getBills({
        month: selectedMonth,
        route_id: routeFilter,
      });
      if (res.success) {
        setBills(res.data || []);
        setMetrics(res.metrics || {});
        setAccounts(res.accounts || []);
        setRoutes(res.routes || []);
      }
    } catch {
      toast.error("বিল তালিকা লোড করতে সমস্যা হয়েছে");
    } finally {
      setLoading(false);
    }
  }, [selectedMonth, routeFilter]);

  useEffect(() => {
    fetchBills();
  }, [fetchBills]);

  const handleGenerateBills = async () => {
    try {
      setGenerating(true);
      const res = await transportService.generateMonthlyBills({ month: selectedMonth });
      toast.success(res.message || "বিল জেনারেট সম্পন্ন");
      fetchBills();
    } catch (err) {
      toast.error(err.response?.data?.message || "বিল জেনারেট ব্যর্থ হয়েছে");
    } finally {
      setGenerating(false);
    }
  };

  const openCollectModal = (bill) => {
    setCollectTarget(bill);
    setCollectForm({
      paid_amount: String(bill.due_amount || 0),
      payment_method: "Cash",
      account_id: accounts[0]?._id || "",
      remarks: "",
    });
  };

  const handleCollectSubmit = async (e) => {
    e.preventDefault();
    if (!collectTarget) return;
    const amt = Number(collectForm.paid_amount);
    if (!amt || amt <= 0) return toast.error("সঠিক পরিমাণ লিখুন");

    try {
      setCollecting(true);
      const res = await transportService.collectBillPayment(collectTarget._id, {
        paid_amount: amt,
        payment_method: collectForm.payment_method,
        account_id: collectForm.account_id,
        remarks: collectForm.remarks,
      });
      toast.success(res.message || "ফি আদায় সম্পন্ন");
      setCollectTarget(null);
      fetchBills();
    } catch (err) {
      toast.error(err.response?.data?.message || "ফি আদায় ব্যর্থ হয়েছে");
    } finally {
      setCollecting(false);
    }
  };

  const filteredBills = useMemo(() => {
    return bills.filter((b) => {
      if (statusFilter !== "all" && b.status !== statusFilter) return false;
      if (searchTerm.trim()) {
        const q = searchTerm.toLowerCase();
        const match =
          (b.student_name || "").toLowerCase().includes(q) ||
          (b.student_code || "").toLowerCase().includes(q) ||
          (b.route_name || "").toLowerCase().includes(q) ||
          (b.stoppage || "").toLowerCase().includes(q);
        if (!match) return false;
      }
      return true;
    });
  }, [bills, statusFilter, searchTerm]);

  return (
    <div className="space-y-5 animate-in fade-in duration-500">


      {/* Generator Bar */}
      <div className=" flex flex-col lg:flex-row lg:items-center justify-between gap-4">
        <div>
          <h3 className="font-bold text-slate-800 flex items-center gap-2">
            <Calculator className="w-5 h-5 text-[#1C7D5A]" />
            মাসিক ট্রান্সপোর্ট বিল জেনারেটর
          </h3>
          <p className="text-xs text-slate-500 mt-1">
            সক্রিয় সকল ট্রান্সপোর্ট ছাত্রদের নির্ধারিত রুট ও স্টপেজ ভাড়া অনুযায়ী মাসিক বিল তৈরি হবে।
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-2">
          <input
            type="month"
            value={selectedMonth}
            onChange={(e) => setSelectedMonth(e.target.value)}
            className="px-3 py-2 border border-slate-200 rounded-lg text-sm font-semibold outline-none focus:border-[#1C7D5A]"
          />
          <button
            type="button"
            onClick={handleGenerateBills}
            disabled={generating}
            className="px-4 py-2 bg-[#1C7D5A] hover:bg-[#156347] text-white rounded-lg text-sm font-bold flex items-center gap-1.5 shadow-sm cursor-pointer disabled:opacity-60"
          >
            {generating ? <Loader2 className="w-4 h-4 animate-spin" /> : <Receipt className="w-4 h-4" />}
            বিল জেনারেট করুন
          </button>
        </div>
      </div>

      {/* Metrics */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="bg-white p-4 rounded-lg border border-slate-200 shadow-sm">
          <p className="text-xs text-slate-500 font-semibold">মোট বিল ({selectedMonth})</p>
          <p className="text-xl font-bold text-slate-800 mt-1">{formatCurrency(metrics.totalBilled)}</p>
        </div>
        <div className="bg-white p-4 rounded-lg border border-slate-200 shadow-sm">
          <p className="text-xs text-slate-500 font-semibold">মোট আদায়</p>
          <p className="text-xl font-bold text-[#1C7D5A] mt-1">{formatCurrency(metrics.totalCollected)}</p>
        </div>
        <div className="bg-white p-4 rounded-lg border border-slate-200 shadow-sm">
          <p className="text-xs text-slate-500 font-semibold">মোট বকেয়া</p>
          <p className="text-xl font-bold text-rose-600 mt-1">{formatCurrency(metrics.totalDue)}</p>
        </div>
        <div className="bg-white p-4 rounded-lg border border-slate-200 shadow-sm">
          <p className="text-xs text-slate-500 font-semibold">জ্বালানি ও রক্ষণাবেক্ষণ বাদে নিট</p>
          <p className="text-xl font-bold text-indigo-600 mt-1">{formatCurrency(metrics.netBalance)}</p>
          <p className="text-[11px] text-slate-400">খরচ: {formatCurrency(metrics.totalExpense)}</p>
        </div>
      </div>

      {/* Filter Bar */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
        <div className="relative">
          <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
          <input
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            placeholder="ছাত্র বা স্টপেজ খুঁজুন..."
            className="w-full pl-9 pr-3 py-2 border border-slate-200 rounded-lg text-sm outline-none focus:border-[#1C7D5A]"
          />
        </div>
        <select
          value={routeFilter}
          onChange={(e) => setRouteFilter(e.target.value)}
          className="px-3 py-2 border border-slate-200 rounded-lg text-sm outline-none focus:border-[#1C7D5A]"
        >
          <option value="all">সকল রুট</option>
          {routes.map((r) => (
            <option key={r._id} value={r._id}>
              {r.route_name}
            </option>
          ))}
        </select>
        <select
          value={statusFilter}
          onChange={(e) => setStatusFilter(e.target.value)}
          className="px-3 py-2 border border-slate-200 rounded-lg text-sm outline-none focus:border-[#1C7D5A]"
        >
          <option value="all">সকল অবস্থা</option>
          <option value="Unpaid">অপরিশোধিত (Unpaid)</option>
          <option value="Partial">আংশিক (Partial)</option>
          <option value="Paid">পরিশোধিত (Paid)</option>
        </select>
      </div>

      {/* Table */}
      <div className="bg-white rounded-lg border border-slate-200 shadow-sm overflow-x-auto">
        {loading ? (
          <div className="p-12 text-center">
            <Loader2 className="w-7 h-7 animate-spin mx-auto text-[#1C7D5A] mb-2" />
            <p className="text-sm text-slate-500">বিল লোড হচ্ছে...</p>
          </div>
        ) : filteredBills.length === 0 ? (
          <div className="p-12 text-center text-sm text-slate-500">
            এই মাসের কোনো বিল পাওয়া যায়নি। উপরের "বিল জেনারেট করুন" বাটনে ক্লিক করুন।
          </div>
        ) : (
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-slate-50 border-b border-slate-200 text-xs font-bold text-slate-600">
                <th className="py-3 px-4">ছাত্র</th>
                <th className="py-3 px-4">রুট ও স্টপেজ</th>
                <th className="py-3 px-4">মোট / ছাড়</th>
                <th className="py-3 px-4">নিট বিল</th>
                <th className="py-3 px-4">পরিশোধ</th>
                <th className="py-3 px-4">বকেয়া</th>
                <th className="py-3 px-4">অবস্থা</th>
                <th className="py-3 px-4 text-right">অ্যাকশন</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 text-sm">
              {filteredBills.map((b) => (
                <tr key={b._id} className="hover:bg-slate-50/60">
                  <td className="py-3 px-4">
                    <div className="font-bold text-slate-800">{b.student_name}</div>
                    <div className="text-xs text-slate-500">
                      {b.class_name} • রোল: {b.roll_number || "—"}
                    </div>
                  </td>
                  <td className="py-3 px-4">
                    <div className="font-semibold text-slate-700">{b.route_name || "—"}</div>
                    <div className="text-xs text-slate-500">{b.stoppage || "—"}</div>
                  </td>
                  <td className="py-3 px-4 text-xs text-slate-600">
                    <div>{formatCurrency(b.gross_amount)}</div>
                    {b.waiver_percent > 0 && <div className="text-amber-600">-{b.waiver_percent}%</div>}
                  </td>
                  <td className="py-3 px-4 font-bold text-slate-800">{formatCurrency(b.net_payable)}</td>
                  <td className="py-3 px-4 font-bold text-[#1C7D5A]">{formatCurrency(b.paid_amount)}</td>
                  <td className="py-3 px-4 font-bold text-rose-600">{formatCurrency(b.due_amount)}</td>
                  <td className="py-3 px-4">
                    <span
                      className={`px-2.5 py-0.5 rounded-full text-xs font-bold border ${b.status === "Paid"
                        ? "bg-emerald-50 text-emerald-700 border-emerald-200"
                        : b.status === "Partial"
                          ? "bg-amber-50 text-amber-700 border-amber-200"
                          : "bg-rose-50 text-rose-700 border-rose-200"
                        }`}
                    >
                      {b.status === "Paid" ? "পরিশোধিত" : b.status === "Partial" ? "আংশিক" : "বকেয়া"}
                    </span>
                  </td>
                  <td className="py-3 px-4 text-right">
                    {b.status !== "Paid" ? (
                      <button
                        type="button"
                        onClick={() => openCollectModal(b)}
                        className="px-3 py-1.5 bg-[#1C7D5A] hover:bg-[#156347] text-white rounded-lg text-xs font-bold inline-flex items-center gap-1 cursor-pointer"
                      >
                        <Wallet className="w-3.5 h-3.5" />
                        ফি আদায়
                      </button>
                    ) : (
                      <span className="text-xs font-semibold text-slate-400">
                        {b.last_receipt_no || "Paid"}
                      </span>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>

      {/* Collect Payment Modal */}
      {collectTarget && (
        <div className="fixed inset-0 z-50 bg-black/50 flex items-center justify-center p-4">
          <div className="bg-white rounded-xl max-w-md w-full shadow-xl overflow-hidden">
            <div className="px-6 py-4 border-b border-slate-100 flex items-center justify-between">
              <h3 className="text-base font-bold text-slate-800">ট্রান্সপোর্ট ফি আদায়</h3>
              <button
                type="button"
                onClick={() => setCollectTarget(null)}
                className="p-1 text-slate-400 hover:text-slate-600 cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>
            <form onSubmit={handleCollectSubmit} className="p-6 space-y-4">
              <div className="p-3 bg-slate-50 rounded-lg border border-slate-200 text-xs space-y-1">
                <div className="font-bold text-slate-800 text-sm">{collectTarget.student_name}</div>
                <div className="text-slate-500">
                  {collectTarget.route_name} • {collectTarget.stoppage}
                </div>
                <div className="font-bold text-rose-600">বকেয়া: {formatCurrency(collectTarget.due_amount)}</div>
              </div>

              <div>
                <label className="text-xs font-bold text-slate-700 mb-1 block">আদায়কৃত টাকা (৳) *</label>
                <input
                  type="number"
                  required
                  min={1}
                  max={collectTarget.due_amount}
                  value={collectForm.paid_amount}
                  onChange={(e) => setCollectForm({ ...collectForm, paid_amount: e.target.value })}
                  className="w-full px-3 py-2 border border-slate-200 rounded-lg text-sm font-bold text-[#1C7D5A] outline-none focus:border-[#1C7D5A]"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="text-xs font-bold text-slate-700 mb-1 block">পেমেন্ট মাধ্যম</label>
                  <select
                    value={collectForm.payment_method}
                    onChange={(e) => setCollectForm({ ...collectForm, payment_method: e.target.value })}
                    className="w-full px-3 py-2 border border-slate-200 rounded-lg text-sm outline-none focus:border-[#1C7D5A]"
                  >
                    <option value="Cash">নগদ (Cash)</option>
                    <option value="bKash">বিকাশ (bKash)</option>
                    <option value="Nagad">নগদ (Nagad)</option>
                    <option value="Bank">ব্যাংক (Bank)</option>
                  </select>
                </div>
                <div>
                  <label className="text-xs font-bold text-slate-700 mb-1 block">জমা অ্যাকাউন্ট</label>
                  <select
                    value={collectForm.account_id}
                    onChange={(e) => setCollectForm({ ...collectForm, account_id: e.target.value })}
                    className="w-full px-3 py-2 border border-slate-200 rounded-lg text-sm outline-none focus:border-[#1C7D5A]"
                  >
                    <option value="">স্বয়ংক্রিয় ক্যাশ</option>
                    {accounts.map((acc) => (
                      <option key={acc._id} value={acc._id}>
                        {acc.name}
                      </option>
                    ))}
                  </select>
                </div>
              </div>

              <div>
                <label className="text-xs font-bold text-slate-700 mb-1 block">মন্তব্য</label>
                <input
                  value={collectForm.remarks}
                  onChange={(e) => setCollectForm({ ...collectForm, remarks: e.target.value })}
                  placeholder="রশিদ বা বিশেষ নোট"
                  className="w-full px-3 py-2 border border-slate-200 rounded-lg text-sm outline-none focus:border-[#1C7D5A]"
                />
              </div>

              <div className="flex justify-end gap-2 pt-2 border-t border-slate-100">
                <button
                  type="button"
                  onClick={() => setCollectTarget(null)}
                  className="px-4 py-2 rounded-lg text-sm font-bold text-slate-600 hover:bg-slate-100 cursor-pointer"
                >
                  বাতিল
                </button>
                <button
                  type="submit"
                  disabled={collecting}
                  className="px-5 py-2 rounded-lg text-sm font-bold bg-[#1C7D5A] text-white hover:bg-[#156347] flex items-center gap-1.5 cursor-pointer"
                >
                  {collecting && <Loader2 className="w-4 h-4 animate-spin" />}
                  আদায় নিশ্চিত করুন
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default TransportBillingPage;
