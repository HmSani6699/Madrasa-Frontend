import { useState, useEffect, useCallback } from "react";
import { Fuel, Plus, Trash2, Search, Loader2 } from "lucide-react";
import { toast } from "react-hot-toast";
import transportService from "../../../services/transportService";
import {
  EXPENSE_CATEGORIES,
  EXPENSE_UNITS,
  formatCurrency,
  getCurrentMonthStr,
  getTodayDateStr,
} from "./transportConstants";
import TransportPageHeader from "./TransportPageHeader";

const TransportExpensesPage = () => {
  const [loading, setLoading] = useState(true);
  const [expenses, setExpenses] = useState([]);
  const [vehicles, setVehicles] = useState([]);
  const [accounts, setAccounts] = useState([]);
  const [summary, setSummary] = useState({ total: 0, fuel: 0, maintenance: 0, allowance: 0, other: 0 });
  const [monthFilter, setMonthFilter] = useState(getCurrentMonthStr());
  const [vehicleFilter, setVehicleFilter] = useState("all");
  const [categoryFilter, setCategoryFilter] = useState("all");
  const [searchTerm, setSearchTerm] = useState("");
  const [submitting, setSubmitting] = useState(false);

  const [form, setForm] = useState({
    date: getTodayDateStr(),
    vehicle_id: "",
    category: "Fuel",
    title: "",
    quantity: "",
    unit: "liter",
    odometer_km: "",
    amount: "",
    paid_by: "",
    account_id: "",
    notes: "",
  });

  const fetchExpenses = useCallback(async () => {
    try {
      setLoading(true);
      const res = await transportService.getExpenses({
        month: monthFilter,
        vehicle_id: vehicleFilter,
        category: categoryFilter,
        search: searchTerm,
      });
      if (res.success) {
        setExpenses(res.data || []);
        setSummary(res.summary || { total: 0, fuel: 0, maintenance: 0, allowance: 0, other: 0 });
        setVehicles(res.vehicles || []);
        setAccounts(res.accounts || []);
      }
    } catch {
      toast.error("খরচের তালিকা লোড করতে সমস্যা হয়েছে");
    } finally {
      setLoading(false);
    }
  }, [monthFilter, vehicleFilter, categoryFilter, searchTerm]);

  useEffect(() => {
    fetchExpenses();
  }, [fetchExpenses]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!form.title.trim() || !form.amount) {
      return toast.error("খরচের বিবরণ ও টাকার পরিমাণ দিন");
    }

    try {
      setSubmitting(true);
      const res = await transportService.createExpense({
        ...form,
        amount: Number(form.amount),
        quantity: form.quantity !== "" ? Number(form.quantity) : null,
        odometer_km: form.odometer_km !== "" ? Number(form.odometer_km) : null,
      });
      toast.success(res.message || "পরিবহন খরচ সংরক্ষিত হয়েছে");
      setForm((prev) => ({
        ...prev,
        title: "",
        quantity: "",
        odometer_km: "",
        amount: "",
        notes: "",
      }));
      fetchExpenses();
    } catch (err) {
      toast.error(err.response?.data?.message || "খরচ সংরক্ষণ ব্যর্থ হয়েছে");
    } finally {
      setSubmitting(false);
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm("এই খরচের ভাউচারটি কি মুছে ফেলতে চান?")) return;
    try {
      await transportService.deleteExpense(id);
      toast.success("খরচের এন্ট্রি মুছে ফেলা হয়েছে");
      fetchExpenses();
    } catch {
      toast.error("মুছতে সমস্যা হয়েছে");
    }
  };

  return (
    <div className="space-y-5 animate-in fade-in duration-500">
      <TransportPageHeader
        title="জ্বালানি, মেরামত ও পরিবহন খরচ"
        subtitle="গাড়িভিত্তিক দৈনিক তেল-গ্যাস, সার্ভিসিং, ড্রাইভার ভাতা এবং অফিস অ্যাকাউন্ট সমন্বয়"
        icon={Fuel}
      />

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Left: Entry Form */}
        <div className="lg:col-span-4">
          <form
            onSubmit={handleSubmit}
            className="bg-white rounded-lg border border-slate-200 p-5 shadow-sm space-y-4 sticky top-24"
          >
            <div className="flex items-center gap-2 pb-3 border-b border-slate-100">
              <div className="p-2 bg-emerald-50 text-[#1C7D5A] rounded-lg">
                <Fuel className="w-5 h-5" />
              </div>
              <div>
                <h3 className="font-bold text-slate-800 text-base">নতুন পরিবহন খরচ এন্ট্রি</h3>
                <p className="text-xs text-slate-500">তেল/গ্যাস, মেরামত ও অন্যান্য ভাউচার</p>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="text-xs font-bold text-slate-700 mb-1 block">তারিখ *</label>
                <input
                  type="date"
                  required
                  value={form.date}
                  onChange={(e) => setForm({ ...form, date: e.target.value })}
                  className="w-full px-3 py-2 border border-slate-200 rounded-lg text-sm outline-none focus:border-[#1C7D5A]"
                />
              </div>
              <div>
                <label className="text-xs font-bold text-slate-700 mb-1 block">গাড়ি নির্বাচন</label>
                <select
                  value={form.vehicle_id}
                  onChange={(e) => setForm({ ...form, vehicle_id: e.target.value })}
                  className="w-full px-3 py-2 border border-slate-200 rounded-lg text-sm outline-none focus:border-[#1C7D5A]"
                >
                  <option value="">সাধারণ / সকল</option>
                  {vehicles.map((v) => (
                    <option key={v._id} value={v._id}>
                      {v.vehicle_no}
                    </option>
                  ))}
                </select>
              </div>
            </div>

            <div>
              <label className="text-xs font-bold text-slate-700 mb-1 block">খরচের খাত *</label>
              <select
                value={form.category}
                onChange={(e) => setForm({ ...form, category: e.target.value })}
                className="w-full px-3 py-2 border border-slate-200 rounded-lg text-sm outline-none focus:border-[#1C7D5A]"
              >
                {EXPENSE_CATEGORIES.map((c) => (
                  <option key={c.value} value={c.value}>
                    {c.label}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="text-xs font-bold text-slate-700 mb-1 block">খরচের বিবরণ *</label>
              <input
                required
                value={form.title}
                onChange={(e) => setForm({ ...form, title: e.target.value })}
                placeholder="যেমন: অকটেন / সিএনজি / ব্রেক প্যাড পরিবর্তন"
                className="w-full px-3 py-2 border border-slate-200 rounded-lg text-sm outline-none focus:border-[#1C7D5A]"
              />
            </div>

            <div className="grid grid-cols-3 gap-2">
              <div>
                <label className="text-xs font-bold text-slate-700 mb-1 block">পরিমাণ</label>
                <input
                  type="number"
                  step="0.01"
                  min={0}
                  value={form.quantity}
                  onChange={(e) => setForm({ ...form, quantity: e.target.value })}
                  placeholder="0"
                  className="w-full px-2.5 py-2 border border-slate-200 rounded-lg text-sm outline-none focus:border-[#1C7D5A]"
                />
              </div>
              <div>
                <label className="text-xs font-bold text-slate-700 mb-1 block">একক</label>
                <select
                  value={form.unit}
                  onChange={(e) => setForm({ ...form, unit: e.target.value })}
                  className="w-full px-2 py-2 border border-slate-200 rounded-lg text-sm outline-none focus:border-[#1C7D5A]"
                >
                  {EXPENSE_UNITS.map((u) => (
                    <option key={u.value} value={u.value}>
                      {u.label}
                    </option>
                  ))}
                </select>
              </div>
              <div>
                <label className="text-xs font-bold text-slate-700 mb-1 block">মিটার (km)</label>
                <input
                  type="number"
                  min={0}
                  value={form.odometer_km}
                  onChange={(e) => setForm({ ...form, odometer_km: e.target.value })}
                  placeholder="km"
                  className="w-full px-2.5 py-2 border border-slate-200 rounded-lg text-sm outline-none focus:border-[#1C7D5A]"
                />
              </div>
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="text-xs font-bold text-slate-700 mb-1 block">মোট টাকা (৳) *</label>
                <input
                  type="number"
                  required
                  min={1}
                  value={form.amount}
                  onChange={(e) => setForm({ ...form, amount: e.target.value })}
                  placeholder="0"
                  className="w-full px-3 py-2 border border-slate-200 rounded-lg text-sm font-bold text-[#1C7D5A] outline-none focus:border-[#1C7D5A]"
                />
              </div>
              <div>
                <label className="text-xs font-bold text-slate-700 mb-1 block">পরিশোধকারী</label>
                <input
                  value={form.paid_by}
                  onChange={(e) => setForm({ ...form, paid_by: e.target.value })}
                  placeholder="ড্রাইভার / অফিস"
                  className="w-full px-3 py-2 border border-slate-200 rounded-lg text-sm outline-none focus:border-[#1C7D5A]"
                />
              </div>
            </div>

            <div>
              <label className="text-xs font-bold text-slate-700 mb-1 block">
                অফিস অ্যাকাউন্ট থেকে খরচ সমন্বয় (ঐচ্ছিক)
              </label>
              <select
                value={form.account_id}
                onChange={(e) => setForm({ ...form, account_id: e.target.value })}
                className="w-full px-3 py-2 border border-slate-200 rounded-lg text-sm outline-none focus:border-[#1C7D5A]"
              >
                <option value="">অ্যাকাউন্ট লিংক না করে শুধু রেকর্ড করুন</option>
                {accounts.map((acc) => (
                  <option key={acc._id} value={acc._id}>
                    {acc.name} (ব্যালেন্স: {formatCurrency(acc.balance)})
                  </option>
                ))}
              </select>
            </div>

            <button
              type="submit"
              disabled={submitting}
              className="w-full py-2.5 bg-[#1C7D5A] hover:bg-[#156347] text-white rounded-lg text-sm font-bold flex items-center justify-center gap-2 shadow-sm cursor-pointer disabled:opacity-60"
            >
              {submitting ? <Loader2 className="w-4 h-4 animate-spin" /> : <Plus className="w-4 h-4" />}
              খরচ সংরক্ষণ করুন
            </button>
          </form>
        </div>

        {/* Right: Summary & History */}
        <div className="lg:col-span-8 space-y-4">
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
            <div className="bg-white p-4 rounded-lg border border-slate-200 shadow-sm">
              <p className="text-xs text-slate-500 font-semibold">মোট খরচ</p>
              <p className="text-lg font-bold text-slate-800 mt-1">{formatCurrency(summary.total)}</p>
            </div>
            <div className="bg-white p-4 rounded-lg border border-slate-200 shadow-sm">
              <p className="text-xs text-slate-500 font-semibold">জ্বালানি (Fuel)</p>
              <p className="text-lg font-bold text-amber-600 mt-1">{formatCurrency(summary.fuel)}</p>
            </div>
            <div className="bg-white p-4 rounded-lg border border-slate-200 shadow-sm">
              <p className="text-xs text-slate-500 font-semibold">মেরামত</p>
              <p className="text-lg font-bold text-rose-600 mt-1">{formatCurrency(summary.maintenance)}</p>
            </div>
            <div className="bg-white p-4 rounded-lg border border-slate-200 shadow-sm">
              <p className="text-xs text-slate-500 font-semibold">ভাতা ও অন্যান্য</p>
              <p className="text-lg font-bold text-blue-600 mt-1">
                {formatCurrency((summary.allowance || 0) + (summary.other || 0))}
              </p>
            </div>
          </div>

          <div className=" grid grid-cols-1 sm:grid-cols-4 gap-3">
            <input
              type="month"
              value={monthFilter}
              onChange={(e) => setMonthFilter(e.target.value)}
              className="px-3 py-2 border border-slate-200 rounded-lg text-sm outline-none focus:border-[#1C7D5A]"
            />
            <select
              value={vehicleFilter}
              onChange={(e) => setVehicleFilter(e.target.value)}
              className="px-3 py-2 border border-slate-200 rounded-lg text-sm outline-none focus:border-[#1C7D5A]"
            >
              <option value="all">সকল গাড়ি</option>
              {vehicles.map((v) => (
                <option key={v._id} value={v._id}>
                  {v.vehicle_no}
                </option>
              ))}
            </select>
            <select
              value={categoryFilter}
              onChange={(e) => setCategoryFilter(e.target.value)}
              className="px-3 py-2 border border-slate-200 rounded-lg text-sm outline-none focus:border-[#1C7D5A]"
            >
              <option value="all">সকল খাত</option>
              {EXPENSE_CATEGORIES.map((c) => (
                <option key={c.value} value={c.value}>
                  {c.label}
                </option>
              ))}
            </select>
            <div className="relative">
              <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
              <input
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                placeholder="বিবরণ খুঁজুন..."
                className="w-full pl-9 pr-3 py-2 border border-slate-200 rounded-lg text-sm outline-none focus:border-[#1C7D5A]"
              />
            </div>
          </div>

          <div className="bg-white rounded-lg border border-slate-200 shadow-sm overflow-x-auto">
            {loading ? (
              <div className="p-10 text-center">
                <Loader2 className="w-6 h-6 animate-spin mx-auto text-[#1C7D5A]" />
              </div>
            ) : expenses.length === 0 ? (
              <div className="p-10 text-center text-sm text-slate-500">কোনো খরচের রেকর্ড পাওয়া যায়নি</div>
            ) : (
              <table className="w-full text-left border-collapse">
                <thead>
                  <tr className="bg-slate-50 border-b border-slate-200 text-xs font-bold text-slate-600">
                    <th className="py-3 px-4">তারিখ</th>
                    <th className="py-3 px-4">গাড়ি ও খাত</th>
                    <th className="py-3 px-4">বিবরণ</th>
                    <th className="py-3 px-4">টাকা</th>
                    <th className="py-3 px-4 text-right">অ্যাকশন</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100 text-sm">
                  {expenses.map((ex) => (
                    <tr key={ex._id} className="hover:bg-slate-50/60">
                      <td className="py-3 px-4 text-xs font-semibold text-slate-600 whitespace-nowrap">
                        {ex.date}
                      </td>
                      <td className="py-3 px-4">
                        <div className="font-bold text-slate-800 text-xs">{ex.vehicle_no || "সাধারণ"}</div>
                        <span className="inline-block mt-0.5 px-2 py-0.5 rounded bg-slate-100 text-slate-700 text-[11px] font-semibold">
                          {ex.category}
                        </span>
                      </td>
                      <td className="py-3 px-4">
                        <div className="font-semibold text-slate-800">{ex.title}</div>
                        <div className="text-xs text-slate-500">
                          {ex.quantity ? `${ex.quantity} ${ex.unit || ""}` : ""}
                          {ex.odometer_km ? ` • ${ex.odometer_km} km` : ""}
                          {ex.paid_by ? ` • পরিশোধ: ${ex.paid_by}` : ""}
                        </div>
                      </td>
                      <td className="py-3 px-4 font-bold text-rose-600">{formatCurrency(ex.amount)}</td>
                      <td className="py-3 px-4 text-right">
                        <button
                          type="button"
                          onClick={() => handleDelete(ex._id)}
                          className="p-1.5 text-slate-400 hover:text-rose-600 hover:bg-rose-50 rounded-lg cursor-pointer"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default TransportExpensesPage;
