import { useState, useEffect, useCallback } from "react";
import { Plus, Trash2, ShoppingBag, Search, Loader2 } from "lucide-react";
import { toast } from "react-hot-toast";
import boardingService from "../../../services/boardingService";
import {
  BAZAR_CATEGORIES,
  INVENTORY_UNITS,
  formatCurrency,
  getCurrentMonthStr,
  getTodayDateStr,
} from "./boardingConstants";

const BazarExpenseTab = ({ onRefreshDashboard }) => {
  const [loading, setLoading] = useState(true);
  const [bazarList, setBazarList] = useState([]);
  const [summary, setSummary] = useState({ total: 0, fresh: 0, dry: 0, fuel: 0 });
  const [monthFilter, setMonthFilter] = useState(getCurrentMonthStr());
  const [categoryFilter, setCategoryFilter] = useState("all");
  const [searchTerm, setSearchTerm] = useState("");
  const [submitting, setSubmitting] = useState(false);

  const [form, setForm] = useState({
    date: getTodayDateStr(),
    item_name: "",
    category: "Fresh",
    quantity: "",
    unit: "kg",
    unit_price: "",
    buyer_name: "",
    notes: "",
    add_to_inventory: true,
  });

  const fetchBazar = useCallback(async () => {
    try {
      setLoading(true);
      const res = await boardingService.getBazarList({
        month: monthFilter,
        category: categoryFilter,
        search: searchTerm,
      });
      if (res.success) {
        setBazarList(res.data || []);
        setSummary(res.summary || { total: 0, fresh: 0, dry: 0, fuel: 0 });
      }
    } catch {
      toast.error("বাজার তালিকা লোড করতে সমস্যা হয়েছে");
    } finally {
      setLoading(false);
    }
  }, [monthFilter, categoryFilter, searchTerm]);

  useEffect(() => {
    fetchBazar();
  }, [fetchBazar]);

  const computedTotal = (Number(form.quantity) || 0) * (Number(form.unit_price) || 0);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!form.item_name.trim() || !form.quantity || form.unit_price === "") {
      return toast.error("পণ্যের নাম, পরিমাণ ও একক মূল্য দিন");
    }

    try {
      setSubmitting(true);
      const res = await boardingService.createBazarEntry({
        ...form,
        quantity: Number(form.quantity),
        unit_price: Number(form.unit_price),
        total_cost: Number(computedTotal.toFixed(2)),
        add_to_inventory: form.category === "Dry" ? form.add_to_inventory : false,
      });
      toast.success(res.message || "বাজার খরচ সংরক্ষিত হয়েছে");
      setForm({
        ...form,
        item_name: "",
        quantity: "",
        unit_price: "",
        notes: "",
      });
      fetchBazar();
      onRefreshDashboard?.();
    } catch (err) {
      toast.error(err.response?.data?.message || "বাজার খরচ সংরক্ষণ ব্যর্থ হয়েছে");
    } finally {
      setSubmitting(false);
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm("এই বাজার ভাউচারটি কি মুছে ফেলতে চান?")) return;
    try {
      await boardingService.deleteBazarEntry(id);
      toast.success("বাজার এন্ট্রি মুছে ফেলা হয়েছে");
      fetchBazar();
      onRefreshDashboard?.();
    } catch {
      toast.error("মুছতে সমস্যা হয়েছে");
    }
  };

  return (
    <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
      {/* Left: Daily Bazar Entry Form */}
      <div className="lg:col-span-4">
        <form
          onSubmit={handleSubmit}
          className="bg-white rounded-[8px] border border-slate-200 p-5 shadow-sm space-y-4 sticky top-24"
        >
          <div className="flex items-center gap-2 pb-3 border-b border-slate-100">
            <div className="p-2 bg-emerald-50 text-[#1C7D5A] rounded-lg">
              <ShoppingBag className="w-5 h-5" />
            </div>
            <div>
              <h3 className="font-bold text-slate-800 text-base">দৈনিক বাজার খরচ এন্ট্রি</h3>
              <p className="text-xs text-slate-500">কাঁচাবাজার, শুকনো বাজার ও জ্বালানি ভাউচার</p>
            </div>
          </div>

          <div>
            <label className="text-xs font-bold text-slate-600 mb-1 block">তারিখ *</label>
            <input
              type="date"
              required
              value={form.date}
              onChange={(e) => setForm({ ...form, date: e.target.value })}
              className="w-full px-3 py-2 text-sm border border-slate-200 rounded-lg focus:outline-none focus:border-[#1C7D5A]"
            />
          </div>

          <div>
            <label className="text-xs font-bold text-slate-600 mb-1 block">ক্যাটাগরি *</label>
            <select
              value={form.category}
              onChange={(e) => setForm({ ...form, category: e.target.value })}
              className="w-full px-3 py-2 text-sm border border-slate-200 rounded-lg bg-white focus:outline-none focus:border-[#1C7D5A]"
            >
              {BAZAR_CATEGORIES.map((c) => (
                <option key={c.value} value={c.value}>
                  {c.label}
                </option>
              ))}
            </select>
          </div>

          <div>
            <label className="text-xs font-bold text-slate-600 mb-1 block">পণ্য / বিবরণ *</label>
            <input
              type="text"
              required
              value={form.item_name}
              onChange={(e) => setForm({ ...form, item_name: e.target.value })}
              placeholder="যেমন: চাল, রুই মাছ, সয়াবিন তেল, গ্যাস সিলিন্ডার"
              className="w-full px-3 py-2 text-sm border border-slate-200 rounded-lg focus:outline-none focus:border-[#1C7D5A]"
            />
          </div>

          <div className="grid grid-cols-3 gap-2">
            <div>
              <label className="text-xs font-bold text-slate-600 mb-1 block">পরিমাণ *</label>
              <input
                type="number"
                step="any"
                min="0.01"
                required
                value={form.quantity}
                onChange={(e) => setForm({ ...form, quantity: e.target.value })}
                placeholder="১০"
                className="w-full px-3 py-2 text-sm border border-slate-200 rounded-lg"
              />
            </div>
            <div>
              <label className="text-xs font-bold text-slate-600 mb-1 block">একক</label>
              <select
                value={form.unit}
                onChange={(e) => setForm({ ...form, unit: e.target.value })}
                className="w-full px-2 py-2 text-sm border border-slate-200 rounded-lg bg-white"
              >
                {INVENTORY_UNITS.map((u) => (
                  <option key={u.value} value={u.value}>
                    {u.value}
                  </option>
                ))}
              </select>
            </div>
            <div>
              <label className="text-xs font-bold text-slate-600 mb-1 block">দর (৳) *</label>
              <input
                type="number"
                step="any"
                min="0"
                required
                value={form.unit_price}
                onChange={(e) => setForm({ ...form, unit_price: e.target.value })}
                placeholder="৬৫"
                className="w-full px-3 py-2 text-sm border border-slate-200 rounded-lg"
              />
            </div>
          </div>

          <div className="p-3 bg-emerald-50 border border-emerald-200 rounded-lg flex items-center justify-between">
            <span className="text-xs font-bold text-emerald-800">মোট খরচ:</span>
            <span className="text-lg font-extrabold text-[#1C7D5A]">{formatCurrency(computedTotal)}</span>
          </div>

          {form.category === "Dry" && (
            <label className="flex items-center gap-2 p-2.5 rounded-lg bg-amber-50 border border-amber-200 text-xs font-semibold text-amber-900 cursor-pointer">
              <input
                type="checkbox"
                checked={form.add_to_inventory}
                onChange={(e) => setForm({ ...form, add_to_inventory: e.target.checked })}
                className="accent-[#1C7D5A] w-4 h-4"
              />
              শুকনো বাজার ইনভেন্টরি স্টকে স্বয়ংক্রিয়ভাবে যোগ করুন
            </label>
          )}

          <div>
            <label className="text-xs font-bold text-slate-600 mb-1 block">বাজারকারীর নাম</label>
            <input
              type="text"
              value={form.buyer_name}
              onChange={(e) => setForm({ ...form, buyer_name: e.target.value })}
              placeholder="যেমন: হাফেজ রফিক / বাবুর্চি"
              className="w-full px-3 py-2 text-sm border border-slate-200 rounded-lg"
            />
          </div>

          <button
            type="submit"
            disabled={submitting}
            className="w-full py-2.5 bg-[#1C7D5A] hover:bg-[#123628] text-white font-semibold text-sm rounded-lg shadow-sm flex items-center justify-center gap-2 transition-colors cursor-pointer disabled:opacity-60"
          >
            {submitting ? <Loader2 className="w-4 h-4 animate-spin" /> : <Plus className="w-4 h-4" />}
            ভাউচার সংরক্ষণ করুন
          </button>
        </form>
      </div>

      {/* Right: Bazar Summary + History Table */}
      <div className="lg:col-span-8 space-y-4">
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
          <div className="bg-white p-4 rounded-[8px] border border-slate-200 shadow-sm">
            <p className="text-xs text-slate-500">মোট বাজার</p>
            <p className="text-lg font-bold text-slate-800">{formatCurrency(summary.total)}</p>
          </div>
          <div className="bg-white p-4 rounded-[8px] border border-slate-200 shadow-sm">
            <p className="text-xs text-slate-500">কাঁচাবাজার (Fresh)</p>
            <p className="text-lg font-bold text-emerald-700">{formatCurrency(summary.fresh)}</p>
          </div>
          <div className="bg-white p-4 rounded-[8px] border border-slate-200 shadow-sm">
            <p className="text-xs text-slate-500">শুকনো বাজার (Dry)</p>
            <p className="text-lg font-bold text-amber-700">{formatCurrency(summary.dry)}</p>
          </div>
          <div className="bg-white p-4 rounded-[8px] border border-slate-200 shadow-sm">
            <p className="text-xs text-slate-500">জ্বালানি (Fuel)</p>
            <p className="text-lg font-bold text-rose-700">{formatCurrency(summary.fuel)}</p>
          </div>
        </div>

        <div className="bg-white rounded-[8px] border border-slate-200 p-4 shadow-sm space-y-4">
          <div className="flex flex-col sm:flex-row gap-3">
            <div className="relative flex-1">
              <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
              <input
                type="text"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                placeholder="পণ্য বা বাজারকারীর নাম খুঁজুন..."
                className="w-full pl-9 pr-3 py-2 text-sm border border-slate-200 rounded-lg"
              />
            </div>
            <input
              type="month"
              value={monthFilter}
              onChange={(e) => setMonthFilter(e.target.value)}
              className="px-3 py-2 text-sm border border-slate-200 rounded-lg font-medium"
            />
            <select
              value={categoryFilter}
              onChange={(e) => setCategoryFilter(e.target.value)}
              className="px-3 py-2 text-sm border border-slate-200 rounded-lg bg-white font-medium"
            >
              <option value="all">সকল ক্যাটাগরি</option>
              <option value="Fresh">Fresh (কাঁচাবাজার)</option>
              <option value="Dry">Dry (শুকনো বাজার)</option>
              <option value="Fuel">Fuel (জ্বালানি)</option>
            </select>
          </div>

          <div className="overflow-x-auto border border-slate-200 rounded-lg">
            <table className="w-full text-sm text-left">
              <thead className="bg-slate-50 border-b border-slate-200 text-slate-700">
                <tr>
                  <th className="py-3 px-4 font-bold">তারিখ</th>
                  <th className="py-3 px-3 font-bold">পণ্য ও ক্যাটাগরি</th>
                  <th className="py-3 px-3 font-bold text-center">পরিমাণ</th>
                  <th className="py-3 px-3 font-bold text-right">দর</th>
                  <th className="py-3 px-3 font-bold text-right">মোট</th>
                  <th className="py-3 px-3 font-bold">বাজারকারী</th>
                  <th className="py-3 px-3 font-bold text-right">অ্যাকশন</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {loading ? (
                  <tr>
                    <td colSpan={7} className="py-10 text-center text-slate-500">
                      <Loader2 className="w-6 h-6 animate-spin mx-auto text-[#1C7D5A]" />
                    </td>
                  </tr>
                ) : bazarList.length === 0 ? (
                  <tr>
                    <td colSpan={7} className="py-10 text-center text-slate-500">
                      এই মাসে কোনো বাজার খরচের রেকর্ড পাওয়া যায়নি।
                    </td>
                  </tr>
                ) : (
                  bazarList.map((item) => (
                    <tr key={item._id} className="hover:bg-slate-50/70">
                      <td className="py-3 px-4 text-xs font-medium text-slate-600">{item.date}</td>
                      <td className="py-3 px-3">
                        <div className="font-semibold text-slate-800">{item.item_name}</div>
                        <span
                          className={`inline-block text-[10px] font-bold px-2 py-0.5 rounded-full ${
                            item.category === "Fresh"
                              ? "bg-emerald-50 text-emerald-700"
                              : item.category === "Dry"
                              ? "bg-amber-50 text-amber-700"
                              : "bg-rose-50 text-rose-700"
                          }`}
                        >
                          {item.category}
                        </span>
                      </td>
                      <td className="py-3 px-3 text-center text-xs font-semibold">
                        {item.quantity} {item.unit}
                      </td>
                      <td className="py-3 px-3 text-right text-xs">{formatCurrency(item.unit_price)}</td>
                      <td className="py-3 px-3 text-right font-bold text-slate-800">
                        {formatCurrency(item.total_cost)}
                      </td>
                      <td className="py-3 px-3 text-xs text-slate-600">{item.buyer_name || "-"}</td>
                      <td className="py-3 px-3 text-right">
                        <button
                          onClick={() => handleDelete(item._id)}
                          className="p-1.5 text-rose-500 hover:bg-rose-50 rounded-lg cursor-pointer"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
};

export default BazarExpenseTab;
