import { useState, useEffect, useCallback } from "react";
import { Calculator, Receipt, Wallet, Loader2, X } from "lucide-react";
import { toast } from "react-hot-toast";
import boardingService from "../../../services/boardingService";
import { formatCurrency, getCurrentMonthStr } from "./boardingConstants";
import BoardingPageHeader from "./BoardingPageHeader";

const BoardingBillingPage = () => {
  const [selectedMonth, setSelectedMonth] = useState(getCurrentMonthStr());
  const [bills, setBills] = useState([]);
  const [billMetrics, setBillMetrics] = useState({});
  const [accounts, setAccounts] = useState([]);
  const [loadingBills, setLoadingBills] = useState(true);
  const [billingModeGen, setBillingModeGen] = useState("Auto");
  const [generatingBills, setGeneratingBills] = useState(false);

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
      setLoadingBills(true);
      const res = await boardingService.getBills(selectedMonth);
      if (res.success) {
        setBills(res.data || []);
        setBillMetrics(res.metrics || {});
        setAccounts(res.accounts || []);
      }
    } catch {
      toast.error("বিল তালিকা লোড করতে সমস্যা হয়েছে");
    } finally {
      setLoadingBills(false);
    }
  }, [selectedMonth]);

  useEffect(() => {
    fetchBills();
  }, [fetchBills]);

  const handleGenerateBills = async () => {
    try {
      setGeneratingBills(true);
      const res = await boardingService.generateMonthlyBills({
        month: selectedMonth,
        billing_mode: billingModeGen,
      });
      toast.success(res.message || "বিল জেনারেট সম্পন্ন");
      fetchBills();
    } catch (err) {
      toast.error(err.response?.data?.message || "বিল জেনারেট ব্যর্থ হয়েছে");
    } finally {
      setGeneratingBills(false);
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
      const res = await boardingService.collectBillPayment(collectTarget._id, {
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

  return (
    <div className="space-y-5 animate-in fade-in duration-500">
      <BoardingPageHeader
        title="মাসিক বিলিং ও মিল-রেট হিসাব"
        subtitle="ফিক্সড প্যাকেজ বা মিল-রেট ফর্মুলায় মাসিক বিল জেনারেট এবং ফি আদায়"
        icon={Receipt}
      />

      <div className="bg-white rounded-[8px] border border-slate-200 p-5 shadow-sm">
        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
          <div>
            <h3 className="font-bold text-slate-800 flex items-center gap-2">
              <Calculator className="w-5 h-5 text-[#1C7D5A]" />
              মিল রেট ক্যালকুলেটর ও বিল জেনারেটর
            </h3>
            <p className="text-xs text-slate-500 mt-1">
              মিল রেট = মোট বাজার খরচ ({formatCurrency(billMetrics.totalBazarCost)}) ÷ মোট মিল সংখ্যা (
              {billMetrics.totalMeals || 0}) ={" "}
              <span className="font-bold text-[#1C7D5A]">
                {formatCurrency(billMetrics.mealRate)} / মিল
              </span>
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-2">
            <input
              type="month"
              value={selectedMonth}
              onChange={(e) => setSelectedMonth(e.target.value)}
              className="px-3 py-2 text-sm border border-slate-200 rounded-lg font-medium"
            />
            <select
              value={billingModeGen}
              onChange={(e) => setBillingModeGen(e.target.value)}
              className="px-3 py-2 text-sm border border-slate-200 rounded-lg bg-white font-medium"
            >
              <option value="Auto">ছাত্রের নির্ধারিত মোড (Auto)</option>
              <option value="Fixed">সবাইকে ফিক্সড প্যাকেজ</option>
              <option value="MealRate">সবাইকে মিল-রেট অনুযায়ী</option>
            </select>
            <button
              onClick={handleGenerateBills}
              disabled={generatingBills}
              className="px-4 py-2 bg-[#1C7D5A] hover:bg-[#123628] text-white text-sm font-semibold rounded-lg flex items-center gap-2 cursor-pointer disabled:opacity-60"
            >
              {generatingBills ? <Loader2 className="w-4 h-4 animate-spin" /> : <Receipt className="w-4 h-4" />}
              বিল জেনারেট করুন
            </button>
          </div>
        </div>

        <div className="grid grid-cols-2 md:grid-cols-4 gap-3 mt-4 pt-4 border-t border-slate-100">
          <div className="p-3 bg-slate-50 rounded-lg">
            <p className="text-xs text-slate-500">মোট বিলকৃত</p>
            <p className="text-base font-bold text-slate-800">{formatCurrency(billMetrics.totalBilled)}</p>
          </div>
          <div className="p-3 bg-emerald-50 rounded-lg">
            <p className="text-xs text-emerald-700">মোট আদায়</p>
            <p className="text-base font-bold text-emerald-700">{formatCurrency(billMetrics.totalCollected)}</p>
          </div>
          <div className="p-3 bg-rose-50 rounded-lg">
            <p className="text-xs text-rose-700">মোট বকেয়া</p>
            <p className="text-base font-bold text-rose-700">{formatCurrency(billMetrics.totalDue)}</p>
          </div>
          <div className="p-3 bg-amber-50 rounded-lg">
            <p className="text-xs text-amber-800">বর্তমান মিল রেট</p>
            <p className="text-base font-bold text-amber-800">{formatCurrency(billMetrics.mealRate)}</p>
          </div>
        </div>
      </div>

      <div className="bg-white rounded-[8px] border border-slate-200 p-4 shadow-sm overflow-x-auto">
        <table className="w-full text-sm text-left">
          <thead className="bg-slate-50 border-b border-slate-200 text-slate-700">
            <tr>
              <th className="py-3 px-4 font-bold">ছাত্র</th>
              <th className="py-3 px-3 font-bold">মোড</th>
              <th className="py-3 px-3 font-bold text-center">মিল সংখ্যা</th>
              <th className="py-3 px-3 font-bold text-right">প্রদেয়</th>
              <th className="py-3 px-3 font-bold text-right">আদায়</th>
              <th className="py-3 px-3 font-bold text-right">বকেয়া</th>
              <th className="py-3 px-3 font-bold text-center">স্ট্যাটাস</th>
              <th className="py-3 px-3 font-bold text-right">অ্যাকশন</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100">
            {loadingBills ? (
              <tr>
                <td colSpan={8} className="py-10 text-center text-slate-500">
                  <Loader2 className="w-6 h-6 animate-spin mx-auto text-[#1C7D5A]" />
                </td>
              </tr>
            ) : bills.length === 0 ? (
              <tr>
                <td colSpan={8} className="py-10 text-center text-slate-500">
                  {selectedMonth} মাসের কোনো বিল জেনারেট করা হয়নি। উপরে &ldquo;বিল জেনারেট করুন&rdquo; বাটনে ক্লিক করুন।
                </td>
              </tr>
            ) : (
              bills.map((b) => (
                <tr key={b._id} className="hover:bg-slate-50/70">
                  <td className="py-3 px-4">
                    <div className="font-semibold text-slate-800">{b.student_name}</div>
                    <div className="text-xs text-slate-500">
                      {b.class_name} | {b.meal_plan_name}
                    </div>
                  </td>
                  <td className="py-3 px-3 text-xs font-medium">
                    {b.billing_mode === "MealRate" ? "মিল-রেট" : "ফিক্সড"}
                  </td>
                  <td className="py-3 px-3 text-center font-semibold">{b.meal_count || 0}</td>
                  <td className="py-3 px-3 text-right font-bold">{formatCurrency(b.net_payable)}</td>
                  <td className="py-3 px-3 text-right font-semibold text-emerald-700">
                    {formatCurrency(b.paid_amount)}
                  </td>
                  <td className="py-3 px-3 text-right font-semibold text-rose-600">
                    {formatCurrency(b.due_amount)}
                  </td>
                  <td className="py-3 px-3 text-center">
                    <span
                      className={`text-[11px] font-bold px-2 py-0.5 rounded-full ${
                        b.status === "Paid"
                          ? "bg-emerald-50 text-emerald-700"
                          : b.status === "Partial"
                          ? "bg-amber-50 text-amber-700"
                          : "bg-rose-50 text-rose-700"
                      }`}
                    >
                      {b.status === "Paid" ? "পরিশোধিত" : b.status === "Partial" ? "আংশিক" : "বকেয়া"}
                    </span>
                  </td>
                  <td className="py-3 px-3 text-right">
                    {b.due_amount > 0 ? (
                      <button
                        onClick={() => openCollectModal(b)}
                        className="px-3 py-1.5 bg-[#1C7D5A] hover:bg-[#123628] text-white text-xs font-semibold rounded-md inline-flex items-center gap-1 cursor-pointer"
                      >
                        <Wallet className="w-3.5 h-3.5" /> আদায়
                      </button>
                    ) : (
                      <span className="text-xs text-slate-400">{b.last_receipt_no || "সম্পন্ন"}</span>
                    )}
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>

      {collectTarget && (
        <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-4">
          <form
            onSubmit={handleCollectSubmit}
            className="bg-white rounded-xl border border-slate-200 shadow-2xl w-full max-w-md overflow-hidden"
          >
            <div className="px-6 py-4 bg-[#123628] text-white flex items-center justify-between">
              <div>
                <h3 className="font-bold text-base">বোর্ডিং ফি আদায়</h3>
                <p className="text-xs text-white/75">
                  {collectTarget.student_name} ({collectTarget.month})
                </p>
              </div>
              <button
                type="button"
                onClick={() => setCollectTarget(null)}
                className="p-1.5 hover:bg-white/10 rounded-lg cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="p-6 space-y-4">
              <div className="p-3 bg-slate-50 rounded-lg flex justify-between text-sm">
                <span className="text-slate-600">বর্তমান বকেয়া:</span>
                <span className="font-bold text-rose-600">{formatCurrency(collectTarget.due_amount)}</span>
              </div>

              <div>
                <label className="text-xs font-bold text-slate-600 mb-1 block">আদায়কৃত টাকা (৳)</label>
                <input
                  type="number"
                  min={1}
                  max={collectTarget.due_amount}
                  required
                  value={collectForm.paid_amount}
                  onChange={(e) => setCollectForm({ ...collectForm, paid_amount: e.target.value })}
                  className="w-full px-3 py-2 text-base font-bold border border-slate-200 rounded-lg"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="text-xs font-bold text-slate-600 mb-1 block">পেমেন্ট মাধ্যম</label>
                  <select
                    value={collectForm.payment_method}
                    onChange={(e) => setCollectForm({ ...collectForm, payment_method: e.target.value })}
                    className="w-full px-3 py-2 text-sm border border-slate-200 rounded-lg bg-white"
                  >
                    <option value="Cash">ক্যাশ (Cash)</option>
                    <option value="bKash">বিকাশ (bKash)</option>
                    <option value="Nagad">নগদ (Nagad)</option>
                    <option value="Bank">ব্যাংক (Bank)</option>
                  </select>
                </div>
                <div>
                  <label className="text-xs font-bold text-slate-600 mb-1 block">অ্যাকাউন্ট</label>
                  <select
                    value={collectForm.account_id}
                    onChange={(e) => setCollectForm({ ...collectForm, account_id: e.target.value })}
                    className="w-full px-3 py-2 text-sm border border-slate-200 rounded-lg bg-white"
                  >
                    {accounts.length === 0 ? (
                      <option value="">ডিফল্ট ক্যাশ</option>
                    ) : (
                      accounts.map((acc) => (
                        <option key={acc._id} value={acc._id}>
                          {acc.name}
                        </option>
                      ))
                    )}
                  </select>
                </div>
              </div>

              <div>
                <label className="text-xs font-bold text-slate-600 mb-1 block">মন্তব্য (ঐচ্ছিক)</label>
                <input
                  type="text"
                  value={collectForm.remarks}
                  onChange={(e) => setCollectForm({ ...collectForm, remarks: e.target.value })}
                  placeholder="রসিদ বা মন্তব্য..."
                  className="w-full px-3 py-2 text-sm border border-slate-200 rounded-lg"
                />
              </div>
            </div>

            <div className="px-6 py-4 border-t border-slate-200 bg-slate-50 flex justify-end gap-3">
              <button
                type="button"
                onClick={() => setCollectTarget(null)}
                className="px-4 py-2 text-sm font-semibold text-slate-600 hover:bg-slate-200/70 rounded-lg cursor-pointer"
              >
                বাতিল
              </button>
              <button
                type="submit"
                disabled={collecting}
                className="px-5 py-2 bg-[#1C7D5A] hover:bg-[#123628] text-white text-sm font-semibold rounded-lg flex items-center gap-2 cursor-pointer"
              >
                {collecting ? <Loader2 className="w-4 h-4 animate-spin" /> : <Wallet className="w-4 h-4" />}
                নিশ্চিত করুন
              </button>
            </div>
          </form>
        </div>
      )}
    </div>
  );
};

export default BoardingBillingPage;
