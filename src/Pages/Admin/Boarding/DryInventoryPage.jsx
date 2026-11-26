import { useState, useEffect, useCallback } from "react";
import { Package, AlertTriangle, Plus, Minus, Trash2, X, Loader2 } from "lucide-react";
import { toast } from "react-hot-toast";
import boardingService from "../../../services/boardingService";
import { INVENTORY_UNITS, getTodayDateStr } from "./boardingConstants";
import BoardingPageHeader from "./BoardingPageHeader";

const DryInventoryPage = () => {
  const [loading, setLoading] = useState(true);
  const [inventory, setInventory] = useState([]);
  const [lowStockItems, setLowStockItems] = useState([]);
  const [recentLogs, setRecentLogs] = useState([]);

  const [newItemForm, setNewItemForm] = useState({
    item_name: "",
    current_stock: "",
    unit: "kg",
    min_alert_level: "10",
  });
  const [creatingItem, setCreatingItem] = useState(false);

  const [adjustModal, setAdjustModal] = useState(null);
  const [adjustForm, setAdjustForm] = useState({ quantity: "", note: "" });
  const [adjusting, setAdjusting] = useState(false);

  const fetchInventory = useCallback(async () => {
    try {
      setLoading(true);
      const res = await boardingService.getInventory();
      if (res.success) {
        setInventory(res.data || []);
        setLowStockItems(res.lowStockItems || []);
        setRecentLogs(res.recentLogs || []);
      }
    } catch {
      toast.error("ইনভেন্টরি লোড করতে সমস্যা হয়েছে");
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchInventory();
  }, [fetchInventory]);

  const handleCreateItem = async (e) => {
    e.preventDefault();
    if (!newItemForm.item_name.trim()) return toast.error("আইটেমের নাম দিন");
    try {
      setCreatingItem(true);
      await boardingService.createInventoryItem({
        item_name: newItemForm.item_name,
        current_stock: Number(newItemForm.current_stock || 0),
        unit: newItemForm.unit,
        min_alert_level: Number(newItemForm.min_alert_level || 5),
      });
      toast.success("নতুন স্টক আইটেম যোগ হয়েছে");
      setNewItemForm({ item_name: "", current_stock: "", unit: "kg", min_alert_level: "10" });
      fetchInventory();
    } catch (err) {
      toast.error(err.response?.data?.message || "আইটেম যোগ ব্যর্থ হয়েছে");
    } finally {
      setCreatingItem(false);
    }
  };

  const handleAdjustSubmit = async (e) => {
    e.preventDefault();
    if (!adjustModal || !adjustForm.quantity) return;
    try {
      setAdjusting(true);
      const res = await boardingService.adjustInventoryStock(adjustModal.item._id, {
        type: adjustModal.type,
        quantity: Number(adjustForm.quantity),
        date: getTodayDateStr(),
        note: adjustForm.note,
      });
      toast.success(res.message || "স্টক আপডেট সম্পন্ন");
      setAdjustModal(null);
      setAdjustForm({ quantity: "", note: "" });
      fetchInventory();
    } catch (err) {
      toast.error(err.response?.data?.message || "স্টক পরিবর্তন ব্যর্থ হয়েছে");
    } finally {
      setAdjusting(false);
    }
  };

  const handleDeleteInventory = async (id) => {
    if (!window.confirm("এই স্টক আইটেমটি কি মুছে ফেলতে চান?")) return;
    try {
      await boardingService.deleteInventoryItem(id);
      toast.success("আইটেম মুছে ফেলা হয়েছে");
      fetchInventory();
    } catch {
      toast.error("মুছতে সমস্যা হয়েছে");
    }
  };

  return (
    <div className="space-y-5 animate-in fade-in duration-500">
      <BoardingPageHeader
        title="শুকনো বাজার স্টক ও ইনভেন্টরি"
        subtitle="চাল, ডাল, তেল, আটা ইত্যাদি বাল্ক স্টক পরিচালনা ও লো-স্টক সতর্কতা"
        icon={Package}
        lowStockCount={lowStockItems.length}
      />

      {lowStockItems.length > 0 && (
        <div className="bg-amber-50 border border-amber-300 rounded-[8px] p-4 flex items-start gap-3">
          <AlertTriangle className="w-5 h-5 text-amber-600 shrink-0 mt-0.5" />
          <div>
            <h4 className="text-sm font-bold text-amber-900">
              লো-স্টক সতর্কতা! ({lowStockItems.length}টি আইটেম ন্যূনতম মজুদের নিচে)
            </h4>
            <p className="text-xs text-amber-800 mt-1">
              দ্রুত বাজার করুন:{" "}
              {lowStockItems.map((i) => `${i.item_name} (${i.current_stock} ${i.unit})`).join(" • ")}
            </p>
          </div>
        </div>
      )}

      <div className="bg-white rounded-[8px] border border-slate-200 p-5 shadow-sm space-y-5">
        <form
          onSubmit={handleCreateItem}
          className="grid grid-cols-1 sm:grid-cols-12 gap-3 items-end bg-slate-50 p-4 rounded-lg border border-slate-200"
        >
          <div className="sm:col-span-4">
            <label className="text-xs font-bold text-slate-600 mb-1 block">পণ্যের নাম *</label>
            <input
              type="text"
              required
              value={newItemForm.item_name}
              onChange={(e) => setNewItemForm({ ...newItemForm, item_name: e.target.value })}
              placeholder="যেমন: মিনিকেট চাল, মসুর ডাল, সয়াবিন তেল"
              className="w-full px-3 py-2 text-sm border border-slate-200 rounded-lg bg-white"
            />
          </div>
          <div className="sm:col-span-2">
            <label className="text-xs font-bold text-slate-600 mb-1 block">প্রাথমিক স্টক</label>
            <input
              type="number"
              step="any"
              min="0"
              value={newItemForm.current_stock}
              onChange={(e) => setNewItemForm({ ...newItemForm, current_stock: e.target.value })}
              placeholder="৫০"
              className="w-full px-3 py-2 text-sm border border-slate-200 rounded-lg bg-white"
            />
          </div>
          <div className="sm:col-span-2">
            <label className="text-xs font-bold text-slate-600 mb-1 block">একক</label>
            <select
              value={newItemForm.unit}
              onChange={(e) => setNewItemForm({ ...newItemForm, unit: e.target.value })}
              className="w-full px-3 py-2 text-sm border border-slate-200 rounded-lg bg-white"
            >
              {INVENTORY_UNITS.map((u) => (
                <option key={u.value} value={u.value}>
                  {u.label}
                </option>
              ))}
            </select>
          </div>
          <div className="sm:col-span-2">
            <label className="text-xs font-bold text-slate-600 mb-1 block">অ্যালার্ট সীমা</label>
            <input
              type="number"
              step="any"
              min="0"
              value={newItemForm.min_alert_level}
              onChange={(e) => setNewItemForm({ ...newItemForm, min_alert_level: e.target.value })}
              className="w-full px-3 py-2 text-sm border border-slate-200 rounded-lg bg-white"
            />
          </div>
          <div className="sm:col-span-2">
            <button
              type="submit"
              disabled={creatingItem}
              className="w-full py-2 px-4 bg-[#1C7D5A] hover:bg-[#123628] text-white text-sm font-semibold rounded-lg flex items-center justify-center gap-1.5 cursor-pointer"
            >
              {creatingItem ? <Loader2 className="w-4 h-4 animate-spin" /> : <Plus className="w-4 h-4" />}
              যোগ করুন
            </button>
          </div>
        </form>

        <div className="overflow-x-auto border border-slate-200 rounded-lg">
          <table className="w-full text-sm text-left">
            <thead className="bg-slate-50 border-b border-slate-200 text-slate-700">
              <tr>
                <th className="py-3 px-4 font-bold">পণ্যের নাম</th>
                <th className="py-3 px-3 font-bold text-center">বর্তমান মজুদ</th>
                <th className="py-3 px-3 font-bold text-center">সতর্কতা সীমা</th>
                <th className="py-3 px-3 font-bold text-center">অবস্থা</th>
                <th className="py-3 px-3 font-bold text-right">স্টক আপডেট / অ্যাকশন</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {loading ? (
                <tr>
                  <td colSpan={5} className="py-10 text-center text-slate-500">
                    <Loader2 className="w-6 h-6 animate-spin mx-auto text-[#1C7D5A]" />
                  </td>
                </tr>
              ) : inventory.length === 0 ? (
                <tr>
                  <td colSpan={5} className="py-10 text-center text-slate-500">
                    ইনভেন্টরিতে এখনো কোনো শুকনো বাজার পণ্য যোগ করা হয়নি।
                  </td>
                </tr>
              ) : (
                inventory.map((item) => {
                  const isLow = Number(item.current_stock || 0) <= Number(item.min_alert_level || 0);
                  return (
                    <tr key={item._id} className="hover:bg-slate-50/70">
                      <td className="py-3 px-4 font-semibold text-slate-800">{item.item_name}</td>
                      <td className="py-3 px-3 text-center font-bold text-slate-800">
                        {item.current_stock} {item.unit}
                      </td>
                      <td className="py-3 px-3 text-center text-xs text-slate-500">
                        {item.min_alert_level} {item.unit}
                      </td>
                      <td className="py-3 px-3 text-center">
                        {isLow ? (
                          <span className="text-[11px] font-bold px-2.5 py-0.5 rounded-full bg-rose-50 text-rose-700 border border-rose-200">
                            লো-স্টক
                          </span>
                        ) : (
                          <span className="text-[11px] font-bold px-2.5 py-0.5 rounded-full bg-emerald-50 text-emerald-700 border border-emerald-200">
                            পর্যাপ্ত
                          </span>
                        )}
                      </td>
                      <td className="py-3 px-3 text-right">
                        <div className="inline-flex items-center gap-1.5">
                          <button
                            onClick={() => {
                              setAdjustModal({ item, type: "in" });
                              setAdjustForm({ quantity: "", note: "" });
                            }}
                            className="px-2.5 py-1 text-xs font-bold bg-emerald-50 text-emerald-700 border border-emerald-200 rounded-md hover:bg-emerald-100 inline-flex items-center gap-1 cursor-pointer"
                          >
                            <Plus className="w-3 h-3" /> স্টক ইন
                          </button>
                          <button
                            onClick={() => {
                              setAdjustModal({ item, type: "out" });
                              setAdjustForm({ quantity: "", note: "দৈনিক রান্নায় খরচ" });
                            }}
                            className="px-2.5 py-1 text-xs font-bold bg-amber-50 text-amber-800 border border-amber-200 rounded-md hover:bg-amber-100 inline-flex items-center gap-1 cursor-pointer"
                          >
                            <Minus className="w-3 h-3" /> খরচ বিয়োগ
                          </button>
                          <button
                            onClick={() => handleDeleteInventory(item._id)}
                            className="p-1.5 text-rose-500 hover:bg-rose-50 rounded-md cursor-pointer"
                          >
                            <Trash2 className="w-4 h-4" />
                          </button>
                        </div>
                      </td>
                    </tr>
                  );
                })
              )}
            </tbody>
          </table>
        </div>

        {recentLogs.length > 0 && (
          <div>
            <h4 className="text-xs font-bold text-slate-600 mb-2">সাম্প্রতিক স্টক লেনদেন</h4>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-2">
              {recentLogs.slice(0, 9).map((log) => (
                <div
                  key={log._id}
                  className="p-2.5 rounded-lg border border-slate-100 bg-slate-50 flex items-center justify-between text-xs"
                >
                  <div>
                    <span className="font-bold text-slate-700">{log.item_name}</span>
                    <p className="text-[11px] text-slate-500">
                      {log.date} • {log.note}
                    </p>
                  </div>
                  <span className={`font-bold ${log.type === "in" ? "text-emerald-700" : "text-rose-600"}`}>
                    {log.type === "in" ? "+" : "-"}
                    {log.quantity} {log.unit}
                  </span>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>

      {adjustModal && (
        <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-4">
          <form
            onSubmit={handleAdjustSubmit}
            className="bg-white rounded-xl border border-slate-200 shadow-2xl w-full max-w-md overflow-hidden"
          >
            <div className="px-6 py-4 bg-[#123628] text-white flex items-center justify-between">
              <div>
                <h3 className="font-bold text-base">
                  {adjustModal.type === "in" ? "বাল্ক স্টক যোগ করুন" : "দৈনিক খরচ / ব্যবহার বিয়োগ"}
                </h3>
                <p className="text-xs text-white/75">
                  {adjustModal.item.item_name} (বর্তমান: {adjustModal.item.current_stock}{" "}
                  {adjustModal.item.unit})
                </p>
              </div>
              <button
                type="button"
                onClick={() => setAdjustModal(null)}
                className="p-1.5 hover:bg-white/10 rounded-lg cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="p-6 space-y-4">
              <div>
                <label className="text-xs font-bold text-slate-600 mb-1 block">
                  পরিমাণ ({adjustModal.item.unit}) *
                </label>
                <input
                  type="number"
                  step="any"
                  min="0.01"
                  required
                  value={adjustForm.quantity}
                  onChange={(e) => setAdjustForm({ ...adjustForm, quantity: e.target.value })}
                  className="w-full px-3 py-2 text-base font-bold border border-slate-200 rounded-lg"
                />
              </div>
              <div>
                <label className="text-xs font-bold text-slate-600 mb-1 block">বিবরণ / নোট</label>
                <input
                  type="text"
                  value={adjustForm.note}
                  onChange={(e) => setAdjustForm({ ...adjustForm, note: e.target.value })}
                  placeholder="যেমন: আজকের রান্নায় খরচ"
                  className="w-full px-3 py-2 text-sm border border-slate-200 rounded-lg"
                />
              </div>
            </div>

            <div className="px-6 py-4 border-t border-slate-200 bg-slate-50 flex justify-end gap-3">
              <button
                type="button"
                onClick={() => setAdjustModal(null)}
                className="px-4 py-2 text-sm font-semibold text-slate-600 hover:bg-slate-200/70 rounded-lg cursor-pointer"
              >
                বাতিল
              </button>
              <button
                type="submit"
                disabled={adjusting}
                className="px-5 py-2 bg-[#1C7D5A] hover:bg-[#123628] text-white text-sm font-semibold rounded-lg cursor-pointer"
              >
                {adjusting ? "সংরক্ষণ হচ্ছে..." : "নিশ্চিত করুন"}
              </button>
            </div>
          </form>
        </div>
      )}
    </div>
  );
};

export default DryInventoryPage;
