import { useState, useEffect, useCallback } from "react";
import {
  Bus,
  MapPin,
  Plus,
  Edit2,
  Trash2,
  X,
  Loader2,
  Phone,
  Users,
  Clock,
  Search,
  CheckCircle2,
  Wallet,
} from "lucide-react";
import { toast } from "react-hot-toast";
import transportService from "../../../services/transportService";
import {
  VEHICLE_TYPES,
  VEHICLE_STATUS_BADGE,
  formatCurrency,
  getTodayDateStr,
} from "./transportConstants";
import TransportPageHeader from "./TransportPageHeader";
import TransportKpiCards from "./TransportKpiCards";

const emptyVehicleForm = {
  vehicle_no: "",
  vehicle_name: "",
  vehicle_type: "Van",
  seat_capacity: 14,
  driver_name: "",
  driver_phone: "",
  driver_license: "",
  helper_name: "",
  helper_phone: "",
  fitness_expiry: "",
  tax_token_expiry: "",
  insurance_expiry: "",
  status: "Active",
  note: "",
};

const emptyRouteForm = {
  route_name: "",
  route_code: "",
  vehicle_id: "",
  start_point: "",
  end_point: "মাদ্রাসা ক্যাম্পাস",
  morning_start_time: "07:00",
  afternoon_return_time: "16:30",
  default_fee: 1000,
  stops: [{ stop_name: "", pickup_time: "07:15", drop_time: "16:45", monthly_fee: 1000, landmark: "" }],
  status: "Active",
  note: "",
};

const VehiclesRoutesPage = () => {
  const [activeTab, setActiveTab] = useState("routes");
  const [loading, setLoading] = useState(true);
  const [dashboard, setDashboard] = useState(null);
  const [vehicles, setVehicles] = useState([]);
  const [routes, setRoutes] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");

  // Vehicle Modal
  const [isVehicleModalOpen, setIsVehicleModalOpen] = useState(false);
  const [editingVehicleId, setEditingVehicleId] = useState(null);
  const [vehicleForm, setVehicleForm] = useState(emptyVehicleForm);
  const [savingVehicle, setSavingVehicle] = useState(false);

  // Route Modal
  const [isRouteModalOpen, setIsRouteModalOpen] = useState(false);
  const [editingRouteId, setEditingRouteId] = useState(null);
  const [routeForm, setRouteForm] = useState(emptyRouteForm);
  const [savingRoute, setSavingRoute] = useState(false);

  const fetchAll = useCallback(async () => {
    try {
      setLoading(true);
      const [dashRes, vehRes, routeRes] = await Promise.all([
        transportService.getDashboard(getTodayDateStr()),
        transportService.getVehicles({ search: searchTerm }),
        transportService.getRoutes({ search: searchTerm }),
      ]);
      if (dashRes.success) setDashboard(dashRes.data);
      if (vehRes.success) setVehicles(vehRes.data || []);
      if (routeRes.success) setRoutes(routeRes.data || []);
    } catch {
      toast.error("ট্রান্সপোর্ট তথ্য লোড করতে সমস্যা হয়েছে");
    } finally {
      setLoading(false);
    }
  }, [searchTerm]);

  useEffect(() => {
    fetchAll();
  }, [fetchAll]);

  const openAddVehicle = () => {
    setEditingVehicleId(null);
    setVehicleForm(emptyVehicleForm);
    setIsVehicleModalOpen(true);
  };

  const openEditVehicle = (v) => {
    setEditingVehicleId(v._id);
    setVehicleForm({
      vehicle_no: v.vehicle_no || "",
      vehicle_name: v.vehicle_name || "",
      vehicle_type: v.vehicle_type || "Van",
      seat_capacity: v.seat_capacity || 14,
      driver_name: v.driver_name || "",
      driver_phone: v.driver_phone || "",
      driver_license: v.driver_license || "",
      helper_name: v.helper_name || "",
      helper_phone: v.helper_phone || "",
      fitness_expiry: v.fitness_expiry || "",
      tax_token_expiry: v.tax_token_expiry || "",
      insurance_expiry: v.insurance_expiry || "",
      status: v.status || "Active",
      note: v.note || "",
    });
    setIsVehicleModalOpen(true);
  };

  const handleSaveVehicle = async (e) => {
    e.preventDefault();
    try {
      setSavingVehicle(true);
      const payload = {
        ...vehicleForm,
        seat_capacity: Number(vehicleForm.seat_capacity || 14),
      };
      if (editingVehicleId) {
        await transportService.updateVehicle(editingVehicleId, payload);
        toast.success("গাড়ির তথ্য আপডেট হয়েছে");
      } else {
        await transportService.createVehicle(payload);
        toast.success("নতুন গাড়ি যুক্ত হয়েছে");
      }
      setIsVehicleModalOpen(false);
      fetchAll();
    } catch (err) {
      toast.error(err.response?.data?.message || "সংরক্ষণ ব্যর্থ হয়েছে");
    } finally {
      setSavingVehicle(false);
    }
  };

  const handleDeleteVehicle = async (id, no) => {
    if (!window.confirm(`${no} গাড়িটি কি মুছে ফেলতে চান?`)) return;
    try {
      await transportService.deleteVehicle(id);
      toast.success("গাড়ি মুছে ফেলা হয়েছে");
      fetchAll();
    } catch {
      toast.error("মুছতে সমস্যা হয়েছে");
    }
  };

  const openAddRoute = () => {
    setEditingRouteId(null);
    setRouteForm({
      ...emptyRouteForm,
      vehicle_id: vehicles.find((v) => v.status === "Active")?._id || "",
    });
    setIsRouteModalOpen(true);
  };

  const openEditRoute = (r) => {
    setEditingRouteId(r._id);
    setRouteForm({
      route_name: r.route_name || "",
      route_code: r.route_code || "",
      vehicle_id: r.vehicle_id || "",
      start_point: r.start_point || "",
      end_point: r.end_point || "মাদ্রাসা ক্যাম্পাস",
      morning_start_time: r.morning_start_time || "07:00",
      afternoon_return_time: r.afternoon_return_time || "16:30",
      default_fee: r.default_fee ?? 1000,
      stops:
        r.stops && r.stops.length > 0
          ? r.stops
          : [{ stop_name: "", pickup_time: "07:15", drop_time: "16:45", monthly_fee: r.default_fee ?? 1000, landmark: "" }],
      status: r.status || "Active",
      note: r.note || "",
    });
    setIsRouteModalOpen(true);
  };

  const handleAddStopRow = () => {
    setRouteForm((prev) => ({
      ...prev,
      stops: [
        ...prev.stops,
        {
          stop_name: "",
          pickup_time: "",
          drop_time: "",
          monthly_fee: Number(prev.default_fee || 0),
          landmark: "",
        },
      ],
    }));
  };

  const handleStopChange = (idx, field, val) => {
    setRouteForm((prev) => ({
      ...prev,
      stops: prev.stops.map((s, i) => (i === idx ? { ...s, [field]: val } : s)),
    }));
  };

  const handleRemoveStopRow = (idx) => {
    setRouteForm((prev) => ({
      ...prev,
      stops: prev.stops.filter((_, i) => i !== idx),
    }));
  };

  const handleSaveRoute = async (e) => {
    e.preventDefault();
    const cleanedStops = (routeForm.stops || [])
      .filter((s) => s.stop_name && s.stop_name.trim())
      .map((s) => ({
        ...s,
        stop_name: s.stop_name.trim(),
        monthly_fee: Number(s.monthly_fee ?? routeForm.default_fee ?? 0),
      }));

    try {
      setSavingRoute(true);
      const payload = {
        ...routeForm,
        default_fee: Number(routeForm.default_fee || 0),
        stops: cleanedStops,
      };
      if (editingRouteId) {
        await transportService.updateRoute(editingRouteId, payload);
        toast.success("রুটের তথ্য আপডেট হয়েছে");
      } else {
        await transportService.createRoute(payload);
        toast.success("নতুন রুট তৈরি হয়েছে");
      }
      setIsRouteModalOpen(false);
      fetchAll();
    } catch (err) {
      toast.error(err.response?.data?.message || "রুট সংরক্ষণ ব্যর্থ হয়েছে");
    } finally {
      setSavingRoute(false);
    }
  };

  const handleDeleteRoute = async (id, name) => {
    if (!window.confirm(`${name} রুটটি কি মুছে ফেলতে চান?`)) return;
    try {
      await transportService.deleteRoute(id);
      toast.success("রুট মুছে ফেলা হয়েছে");
      fetchAll();
    } catch {
      toast.error("মুছতে সমস্যা হয়েছে");
    }
  };

  const kpiCards = [
    {
      title: "মোট গাড়ি ও আসন",
      value: `${dashboard?.vehiclesSummary?.active || 0} / ${dashboard?.vehiclesSummary?.total || 0}`,
      subtitle: `মোট আসন ক্ষমতা: ${dashboard?.vehiclesSummary?.totalSeats || 0} জন`,
      icon: Bus,
      color: "text-emerald-600",
      bg: "bg-emerald-50",
    },
    {
      title: "সক্রিয় রুট",
      value: `${dashboard?.routesSummary?.active || 0} টি`,
      subtitle: `মোট নির্ধারিত রুট: ${dashboard?.routesSummary?.total || 0} টি`,
      icon: MapPin,
      color: "text-blue-600",
      bg: "bg-blue-50",
    },
    {
      title: "পরিবহন ছাত্র",
      value: `${dashboard?.studentsSummary?.total || 0} জন`,
      subtitle: `আসা+যাওয়া: ${dashboard?.studentsSummary?.bothWay || 0} | সম্ভাব্য ফি: ${formatCurrency(
        dashboard?.studentsSummary?.expectedMonthlyFee
      )}`,
      icon: Users,
      color: "text-indigo-600",
      bg: "bg-indigo-50",
    },
    {
      title: "চলতি মাসের ব্যালেন্স",
      value: formatCurrency(dashboard?.monthlyFinance?.balance),
      subtitle: `আদায়: ${formatCurrency(dashboard?.monthlyFinance?.collected)} | খরচ: ${formatCurrency(
        dashboard?.monthlyFinance?.expense
      )}`,
      icon: Wallet,
      color: "text-amber-600",
      bg: "bg-amber-50",
    },
  ];

  return (
    <div className="space-y-5 animate-in fade-in duration-500">
      <TransportPageHeader
        title="গাড়ি, ড্রাইভার ও রুট ম্যানেজমেন্ট"
        subtitle="মাদ্রাসার গাড়ি, চালকের তথ্য, রুট, স্টপেজ ও এলাকাভিত্তিক ভাড়া নির্ধারণ করুন"
        icon={Bus}
        expiryAlerts={dashboard?.expiryAlerts || []}
        rightActions={
          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={openAddVehicle}
              className="px-4 py-2.5 bg-white border border-slate-200 hover:border-[#1C7D5A] text-slate-700 rounded-lg text-sm font-bold flex items-center gap-1.5 shadow-sm transition-colors cursor-pointer"
            >
              <Plus className="w-4 h-4 text-[#1C7D5A]" />
              নতুন গাড়ি
            </button>
            <button
              type="button"
              onClick={openAddRoute}
              className="px-4 py-2.5 bg-[#1C7D5A] hover:bg-[#156347] text-white rounded-lg text-sm font-bold flex items-center gap-1.5 shadow-sm transition-colors cursor-pointer"
            >
              <Plus className="w-4 h-4" />
              নতুন রুট
            </button>
          </div>
        }
      />

      <TransportKpiCards cards={kpiCards} />

      {/* Tabs + Search */}
      <div className="bg-white rounded-lg border border-slate-200 p-4 shadow-sm flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div className="flex gap-2">
          <button
            type="button"
            onClick={() => setActiveTab("routes")}
            className={`px-4 py-2 rounded-lg text-sm font-bold flex items-center gap-2 transition-all cursor-pointer ${
              activeTab === "routes"
                ? "bg-[#1C7D5A] text-white shadow-sm"
                : "bg-slate-100 text-slate-600 hover:bg-slate-200"
            }`}
          >
            <MapPin className="w-4 h-4" />
            রুট ও স্টপেজ ({routes.length})
          </button>
          <button
            type="button"
            onClick={() => setActiveTab("vehicles")}
            className={`px-4 py-2 rounded-lg text-sm font-bold flex items-center gap-2 transition-all cursor-pointer ${
              activeTab === "vehicles"
                ? "bg-[#1C7D5A] text-white shadow-sm"
                : "bg-slate-100 text-slate-600 hover:bg-slate-200"
            }`}
          >
            <Bus className="w-4 h-4" />
            গাড়ি ও ড্রাইভার ({vehicles.length})
          </button>
        </div>

        <div className="relative w-full sm:w-72">
          <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            placeholder={activeTab === "routes" ? "রুট বা এলাকা খুঁজুন..." : "গাড়ি নম্বর বা ড্রাইভার..."}
            className="w-full pl-9 pr-3 py-2 border border-slate-200 rounded-lg text-sm outline-none focus:border-[#1C7D5A]"
          />
        </div>
      </div>

      {/* Content */}
      {loading ? (
        <div className="bg-white rounded-lg border border-slate-200 p-12 text-center">
          <Loader2 className="w-7 h-7 animate-spin mx-auto text-[#1C7D5A] mb-2" />
          <p className="text-sm text-slate-500">তথ্য লোড হচ্ছে...</p>
        </div>
      ) : activeTab === "routes" ? (
        routes.length === 0 ? (
          <div className="bg-white rounded-lg border border-slate-200 p-12 text-center">
            <MapPin className="w-10 h-10 text-slate-300 mx-auto mb-2" />
            <p className="text-sm font-bold text-slate-600">কোনো রুট তৈরি করা হয়নি</p>
            <p className="text-xs text-slate-400 mt-1">নতুন রুট তৈরি করে স্টপেজ ও মাসিক ভাড়া নির্ধারণ করুন</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
            {routes.map((r) => (
              <div
                key={r._id}
                className="bg-white rounded-lg border border-slate-200 p-5 shadow-sm hover:shadow-md transition-shadow space-y-4"
              >
                <div className="flex items-start justify-between gap-3">
                  <div>
                    <div className="flex items-center gap-2 flex-wrap">
                      {r.route_code && (
                        <span className="px-2 py-0.5 rounded bg-emerald-50 text-[#1C7D5A] text-xs font-black border border-emerald-200">
                          {r.route_code}
                        </span>
                      )}
                      <h3 className="text-base font-bold text-slate-800">{r.route_name}</h3>
                      <span
                        className={`px-2 py-0.5 rounded-full text-[11px] font-bold border ${
                          r.status === "Active"
                            ? "bg-emerald-50 text-emerald-700 border-emerald-200"
                            : "bg-slate-100 text-slate-600 border-slate-200"
                        }`}
                      >
                        {r.status === "Active" ? "সক্রিয়" : "বন্ধ"}
                      </span>
                    </div>
                    <p className="text-xs text-slate-500 mt-1">
                      {r.start_point || "শুরু"} → {r.end_point || "মাদ্রাসা"}
                    </p>
                  </div>

                  <div className="flex items-center gap-1">
                    <button
                      type="button"
                      onClick={() => openEditRoute(r)}
                      className="p-1.5 text-slate-500 hover:text-[#1C7D5A] hover:bg-emerald-50 rounded-lg transition-colors cursor-pointer"
                    >
                      <Edit2 className="w-4 h-4" />
                    </button>
                    <button
                      type="button"
                      onClick={() => handleDeleteRoute(r._id, r.route_name)}
                      className="p-1.5 text-slate-500 hover:text-rose-600 hover:bg-rose-50 rounded-lg transition-colors cursor-pointer"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                </div>

                <div className="grid grid-cols-2 sm:grid-cols-3 gap-2 text-xs bg-slate-50 p-3 rounded-lg border border-slate-100">
                  <div>
                    <span className="text-slate-400 block">গাড়ি</span>
                    <span className="font-bold text-slate-700">{r.vehicle_no || "নির্ধারিত নয়"}</span>
                  </div>
                  <div>
                    <span className="text-slate-400 block">ড্রাইভার</span>
                    <span className="font-bold text-slate-700">{r.driver_name || "—"}</span>
                  </div>
                  <div>
                    <span className="text-slate-400 block">ছাত্র / আসন</span>
                    <span className="font-bold text-[#1C7D5A]">
                      {r.assigned_students_count || 0} / {r.seat_capacity || "—"} জন
                    </span>
                  </div>
                  <div>
                    <span className="text-slate-400 block">সকাল ছাড়া</span>
                    <span className="font-semibold text-slate-700">{r.morning_start_time || "—"}</span>
                  </div>
                  <div>
                    <span className="text-slate-400 block">বিকাল রিটার্ন</span>
                    <span className="font-semibold text-slate-700">{r.afternoon_return_time || "—"}</span>
                  </div>
                  <div>
                    <span className="text-slate-400 block">বেস মাসিক ভাড়া</span>
                    <span className="font-bold text-slate-800">{formatCurrency(r.default_fee)}</span>
                  </div>
                </div>

                {r.stops && r.stops.length > 0 && (
                  <div>
                    <p className="text-xs font-bold text-slate-600 mb-2">স্টপেজ সমূহ ({r.stops.length}টি):</p>
                    <div className="flex flex-wrap gap-1.5">
                      {r.stops.map((st, idx) => (
                        <span
                          key={idx}
                          className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-md bg-white border border-slate-200 text-xs text-slate-700"
                        >
                          <span className="w-1.5 h-1.5 rounded-full bg-[#1C7D5A]" />
                          <span className="font-semibold">{st.stop_name}</span>
                          {st.pickup_time && <span className="text-slate-400">({st.pickup_time})</span>}
                          <span className="text-[#1C7D5A] font-bold">{formatCurrency(st.monthly_fee)}</span>
                        </span>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            ))}
          </div>
        )
      ) : vehicles.length === 0 ? (
        <div className="bg-white rounded-lg border border-slate-200 p-12 text-center">
          <Bus className="w-10 h-10 text-slate-300 mx-auto mb-2" />
          <p className="text-sm font-bold text-slate-600">কোনো গাড়ি যুক্ত করা হয়নি</p>
        </div>
      ) : (
        <div className="bg-white rounded-lg border border-slate-200 shadow-sm overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-slate-50 border-b border-slate-200 text-xs font-bold text-slate-600">
                <th className="py-3 px-4">গাড়ির নম্বর ও ধরন</th>
                <th className="py-3 px-4">আসন</th>
                <th className="py-3 px-4">ড্রাইভার ও হেল্পার</th>
                <th className="py-3 px-4">রুট</th>
                <th className="py-3 px-4">ডকুমেন্ট মেয়াদ</th>
                <th className="py-3 px-4">অবস্থা</th>
                <th className="py-3 px-4 text-right">অ্যাকশন</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 text-sm">
              {vehicles.map((v) => {
                const badge = VEHICLE_STATUS_BADGE[v.status] || VEHICLE_STATUS_BADGE.Active;
                return (
                  <tr key={v._id} className="hover:bg-slate-50/60">
                    <td className="py-3 px-4">
                      <div className="font-bold text-slate-800">{v.vehicle_no}</div>
                      <div className="text-xs text-slate-500">
                        {v.vehicle_type} {v.vehicle_name ? `• ${v.vehicle_name}` : ""}
                      </div>
                    </td>
                    <td className="py-3 px-4 font-bold text-slate-700">{v.seat_capacity} আসন</td>
                    <td className="py-3 px-4">
                      <div className="font-semibold text-slate-800">{v.driver_name}</div>
                      <div className="text-xs text-slate-500 flex items-center gap-1">
                        <Phone className="w-3 h-3" /> {v.driver_phone}
                      </div>
                      {v.helper_name && (
                        <div className="text-[11px] text-slate-400">
                          হেল্পার: {v.helper_name} ({v.helper_phone || "—"})
                        </div>
                      )}
                    </td>
                    <td className="py-3 px-4 text-xs font-semibold text-slate-600">
                      {v.assigned_routes_count || 0} টি রুট
                    </td>
                    <td className="py-3 px-4 text-xs text-slate-600 space-y-0.5">
                      {v.fitness_expiry && <div>ফিটনেস: {v.fitness_expiry}</div>}
                      {v.tax_token_expiry && <div>ট্যাক্স: {v.tax_token_expiry}</div>}
                      {v.insurance_expiry && <div>ইন্স্যুরেন্স: {v.insurance_expiry}</div>}
                      {!v.fitness_expiry && !v.tax_token_expiry && !v.insurance_expiry && (
                        <span className="text-slate-400">—</span>
                      )}
                    </td>
                    <td className="py-3 px-4">
                      <span className={`px-2.5 py-0.5 rounded-full text-xs font-bold border ${badge.className}`}>
                        {badge.label}
                      </span>
                    </td>
                    <td className="py-3 px-4 text-right">
                      <div className="inline-flex items-center gap-1">
                        <button
                          type="button"
                          onClick={() => openEditVehicle(v)}
                          className="p-1.5 text-slate-500 hover:text-[#1C7D5A] hover:bg-emerald-50 rounded-lg cursor-pointer"
                        >
                          <Edit2 className="w-4 h-4" />
                        </button>
                        <button
                          type="button"
                          onClick={() => handleDeleteVehicle(v._id, v.vehicle_no)}
                          className="p-1.5 text-slate-500 hover:text-rose-600 hover:bg-rose-50 rounded-lg cursor-pointer"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      )}

      {/* Vehicle Modal */}
      {isVehicleModalOpen && (
        <div className="fixed inset-0 z-50 bg-black/50 flex items-center justify-center p-4">
          <div className="bg-white rounded-xl max-w-2xl w-full max-h-[90vh] overflow-y-auto shadow-xl">
            <div className="px-6 py-4 border-b border-slate-100 flex items-center justify-between sticky top-0 bg-white z-10">
              <h3 className="text-base font-bold text-slate-800 flex items-center gap-2">
                <Bus className="w-5 h-5 text-[#1C7D5A]" />
                {editingVehicleId ? "গাড়ির তথ্য সম্পাদনা" : "নতুন গাড়ি ও ড্রাইভার যুক্ত করুন"}
              </h3>
              <button
                type="button"
                onClick={() => setIsVehicleModalOpen(false)}
                className="p-1 text-slate-400 hover:text-slate-600 cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleSaveVehicle} className="p-6 space-y-4">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="text-xs font-bold text-slate-700 mb-1 block">গাড়ির নম্বর / প্লেট *</label>
                  <input
                    required
                    value={vehicleForm.vehicle_no}
                    onChange={(e) => setVehicleForm({ ...vehicleForm, vehicle_no: e.target.value })}
                    placeholder="যেমন: ঢাকা মেট্রো-চ-১১-২২৩৩"
                    className="w-full px-3 py-2 border border-slate-200 rounded-lg text-sm outline-none focus:border-[#1C7D5A]"
                  />
                </div>
                <div>
                  <label className="text-xs font-bold text-slate-700 mb-1 block">গাড়ির নাম / মডেল</label>
                  <input
                    value={vehicleForm.vehicle_name}
                    onChange={(e) => setVehicleForm({ ...vehicleForm, vehicle_name: e.target.value })}
                    placeholder="যেমন: হিনো বাস / নোয়া মাইক্রো"
                    className="w-full px-3 py-2 border border-slate-200 rounded-lg text-sm outline-none focus:border-[#1C7D5A]"
                  />
                </div>
                <div>
                  <label className="text-xs font-bold text-slate-700 mb-1 block">গাড়ির ধরন</label>
                  <select
                    value={vehicleForm.vehicle_type}
                    onChange={(e) => setVehicleForm({ ...vehicleForm, vehicle_type: e.target.value })}
                    className="w-full px-3 py-2 border border-slate-200 rounded-lg text-sm outline-none focus:border-[#1C7D5A]"
                  >
                    {VEHICLE_TYPES.map((t) => (
                      <option key={t.value} value={t.value}>
                        {t.label}
                      </option>
                    ))}
                  </select>
                </div>
                <div>
                  <label className="text-xs font-bold text-slate-700 mb-1 block">আসন সংখ্যা *</label>
                  <input
                    type="number"
                    min={1}
                    required
                    value={vehicleForm.seat_capacity}
                    onChange={(e) => setVehicleForm({ ...vehicleForm, seat_capacity: e.target.value })}
                    className="w-full px-3 py-2 border border-slate-200 rounded-lg text-sm outline-none focus:border-[#1C7D5A]"
                  />
                </div>
                <div>
                  <label className="text-xs font-bold text-slate-700 mb-1 block">ড্রাইভারের নাম *</label>
                  <input
                    required
                    value={vehicleForm.driver_name}
                    onChange={(e) => setVehicleForm({ ...vehicleForm, driver_name: e.target.value })}
                    placeholder="চালকের নাম"
                    className="w-full px-3 py-2 border border-slate-200 rounded-lg text-sm outline-none focus:border-[#1C7D5A]"
                  />
                </div>
                <div>
                  <label className="text-xs font-bold text-slate-700 mb-1 block">ড্রাইভারের মোবাইল *</label>
                  <input
                    required
                    value={vehicleForm.driver_phone}
                    onChange={(e) => setVehicleForm({ ...vehicleForm, driver_phone: e.target.value })}
                    placeholder="01XXXXXXXXX"
                    className="w-full px-3 py-2 border border-slate-200 rounded-lg text-sm outline-none focus:border-[#1C7D5A]"
                  />
                </div>
                <div>
                  <label className="text-xs font-bold text-slate-700 mb-1 block">লাইসেন্স নম্বর</label>
                  <input
                    value={vehicleForm.driver_license}
                    onChange={(e) => setVehicleForm({ ...vehicleForm, driver_license: e.target.value })}
                    className="w-full px-3 py-2 border border-slate-200 rounded-lg text-sm outline-none focus:border-[#1C7D5A]"
                  />
                </div>
                <div>
                  <label className="text-xs font-bold text-slate-700 mb-1 block">অবস্থা</label>
                  <select
                    value={vehicleForm.status}
                    onChange={(e) => setVehicleForm({ ...vehicleForm, status: e.target.value })}
                    className="w-full px-3 py-2 border border-slate-200 rounded-lg text-sm outline-none focus:border-[#1C7D5A]"
                  >
                    <option value="Active">সক্রিয় (Active)</option>
                    <option value="Maintenance">মেরামতাধীন (Maintenance)</option>
                    <option value="Inactive">বন্ধ (Inactive)</option>
                  </select>
                </div>
                <div>
                  <label className="text-xs font-bold text-slate-700 mb-1 block">হেল্পারের নাম</label>
                  <input
                    value={vehicleForm.helper_name}
                    onChange={(e) => setVehicleForm({ ...vehicleForm, helper_name: e.target.value })}
                    className="w-full px-3 py-2 border border-slate-200 rounded-lg text-sm outline-none focus:border-[#1C7D5A]"
                  />
                </div>
                <div>
                  <label className="text-xs font-bold text-slate-700 mb-1 block">হেল্পারের মোবাইল</label>
                  <input
                    value={vehicleForm.helper_phone}
                    onChange={(e) => setVehicleForm({ ...vehicleForm, helper_phone: e.target.value })}
                    className="w-full px-3 py-2 border border-slate-200 rounded-lg text-sm outline-none focus:border-[#1C7D5A]"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 pt-2 border-t border-slate-100">
                <div>
                  <label className="text-xs font-bold text-slate-700 mb-1 block">ফিটনেস মেয়াদ</label>
                  <input
                    type="date"
                    value={vehicleForm.fitness_expiry}
                    onChange={(e) => setVehicleForm({ ...vehicleForm, fitness_expiry: e.target.value })}
                    className="w-full px-3 py-2 border border-slate-200 rounded-lg text-sm outline-none focus:border-[#1C7D5A]"
                  />
                </div>
                <div>
                  <label className="text-xs font-bold text-slate-700 mb-1 block">ট্যাক্স টোকেন মেয়াদ</label>
                  <input
                    type="date"
                    value={vehicleForm.tax_token_expiry}
                    onChange={(e) => setVehicleForm({ ...vehicleForm, tax_token_expiry: e.target.value })}
                    className="w-full px-3 py-2 border border-slate-200 rounded-lg text-sm outline-none focus:border-[#1C7D5A]"
                  />
                </div>
                <div>
                  <label className="text-xs font-bold text-slate-700 mb-1 block">ইন্স্যুরেন্স মেয়াদ</label>
                  <input
                    type="date"
                    value={vehicleForm.insurance_expiry}
                    onChange={(e) => setVehicleForm({ ...vehicleForm, insurance_expiry: e.target.value })}
                    className="w-full px-3 py-2 border border-slate-200 rounded-lg text-sm outline-none focus:border-[#1C7D5A]"
                  />
                </div>
              </div>

              <div className="flex justify-end gap-2 pt-3 border-t border-slate-100">
                <button
                  type="button"
                  onClick={() => setIsVehicleModalOpen(false)}
                  className="px-4 py-2 rounded-lg text-sm font-bold text-slate-600 hover:bg-slate-100 cursor-pointer"
                >
                  বাতিল
                </button>
                <button
                  type="submit"
                  disabled={savingVehicle}
                  className="px-5 py-2 rounded-lg text-sm font-bold bg-[#1C7D5A] text-white hover:bg-[#156347] flex items-center gap-2 cursor-pointer disabled:opacity-60"
                >
                  {savingVehicle ? <Loader2 className="w-4 h-4 animate-spin" /> : <CheckCircle2 className="w-4 h-4" />}
                  সংরক্ষণ করুন
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Route Modal */}
      {isRouteModalOpen && (
        <div className="fixed inset-0 z-50 bg-black/50 flex items-center justify-center p-4">
          <div className="bg-white rounded-xl max-w-3xl w-full max-h-[90vh] overflow-y-auto shadow-xl">
            <div className="px-6 py-4 border-b border-slate-100 flex items-center justify-between sticky top-0 bg-white z-10">
              <h3 className="text-base font-bold text-slate-800 flex items-center gap-2">
                <MapPin className="w-5 h-5 text-[#1C7D5A]" />
                {editingRouteId ? "রুট ও স্টপেজ সম্পাদনা" : "নতুন রুট ও স্টপেজ তৈরি করুন"}
              </h3>
              <button
                type="button"
                onClick={() => setIsRouteModalOpen(false)}
                className="p-1 text-slate-400 hover:text-slate-600 cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleSaveRoute} className="p-6 space-y-5">
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                <div className="sm:col-span-2">
                  <label className="text-xs font-bold text-slate-700 mb-1 block">রুটের নাম *</label>
                  <input
                    required
                    value={routeForm.route_name}
                    onChange={(e) => setRouteForm({ ...routeForm, route_name: e.target.value })}
                    placeholder="যেমন: রুট-১ (মিরপুর - মাদ্রাসা)"
                    className="w-full px-3 py-2 border border-slate-200 rounded-lg text-sm outline-none focus:border-[#1C7D5A]"
                  />
                </div>
                <div>
                  <label className="text-xs font-bold text-slate-700 mb-1 block">রুট কোড</label>
                  <input
                    value={routeForm.route_code}
                    onChange={(e) => setRouteForm({ ...routeForm, route_code: e.target.value })}
                    placeholder="R-01"
                    className="w-full px-3 py-2 border border-slate-200 rounded-lg text-sm outline-none focus:border-[#1C7D5A]"
                  />
                </div>
                <div>
                  <label className="text-xs font-bold text-slate-700 mb-1 block">নির্ধারিত গাড়ি</label>
                  <select
                    value={routeForm.vehicle_id}
                    onChange={(e) => setRouteForm({ ...routeForm, vehicle_id: e.target.value })}
                    className="w-full px-3 py-2 border border-slate-200 rounded-lg text-sm outline-none focus:border-[#1C7D5A]"
                  >
                    <option value="">গাড়ি নির্বাচন করুন</option>
                    {vehicles.map((v) => (
                      <option key={v._id} value={v._id}>
                        {v.vehicle_no} ({v.driver_name})
                      </option>
                    ))}
                  </select>
                </div>
                <div>
                  <label className="text-xs font-bold text-slate-700 mb-1 block">শুরুর স্থান</label>
                  <input
                    value={routeForm.start_point}
                    onChange={(e) => setRouteForm({ ...routeForm, start_point: e.target.value })}
                    placeholder="যেমন: মিরপুর-১০"
                    className="w-full px-3 py-2 border border-slate-200 rounded-lg text-sm outline-none focus:border-[#1C7D5A]"
                  />
                </div>
                <div>
                  <label className="text-xs font-bold text-slate-700 mb-1 block">গন্তব্য</label>
                  <input
                    value={routeForm.end_point}
                    onChange={(e) => setRouteForm({ ...routeForm, end_point: e.target.value })}
                    className="w-full px-3 py-2 border border-slate-200 rounded-lg text-sm outline-none focus:border-[#1C7D5A]"
                  />
                </div>
                <div>
                  <label className="text-xs font-bold text-slate-700 mb-1 block">সকালে ছাড়ার সময়</label>
                  <input
                    type="time"
                    value={routeForm.morning_start_time}
                    onChange={(e) => setRouteForm({ ...routeForm, morning_start_time: e.target.value })}
                    className="w-full px-3 py-2 border border-slate-200 rounded-lg text-sm outline-none focus:border-[#1C7D5A]"
                  />
                </div>
                <div>
                  <label className="text-xs font-bold text-slate-700 mb-1 block">বিকালে ফেরার সময়</label>
                  <input
                    type="time"
                    value={routeForm.afternoon_return_time}
                    onChange={(e) => setRouteForm({ ...routeForm, afternoon_return_time: e.target.value })}
                    className="w-full px-3 py-2 border border-slate-200 rounded-lg text-sm outline-none focus:border-[#1C7D5A]"
                  />
                </div>
                <div>
                  <label className="text-xs font-bold text-slate-700 mb-1 block">ডিফল্ট মাসিক ভাড়া (৳)</label>
                  <input
                    type="number"
                    min={0}
                    value={routeForm.default_fee}
                    onChange={(e) => setRouteForm({ ...routeForm, default_fee: e.target.value })}
                    className="w-full px-3 py-2 border border-slate-200 rounded-lg text-sm font-bold outline-none focus:border-[#1C7D5A]"
                  />
                </div>
              </div>

              {/* Stoppages */}
              <div className="border-t border-slate-100 pt-4">
                <div className="flex items-center justify-between mb-3">
                  <div>
                    <h4 className="text-sm font-bold text-slate-800 flex items-center gap-1.5">
                      <Clock className="w-4 h-4 text-[#1C7D5A]" />
                      স্টপেজ সমূহ ও এলাকাভিত্তিক ভাড়া
                    </h4>
                    <p className="text-xs text-slate-500">প্রতিটি স্টপেজের নাম, সময় এবং মাসিক ভাড়া যোগ করুন</p>
                  </div>
                  <button
                    type="button"
                    onClick={handleAddStopRow}
                    className="px-3 py-1.5 bg-emerald-50 text-[#1C7D5A] hover:bg-emerald-100 rounded-lg text-xs font-bold flex items-center gap-1 cursor-pointer"
                  >
                    <Plus className="w-3.5 h-3.5" /> স্টপেজ যোগ
                  </button>
                </div>

                <div className="space-y-2.5">
                  {routeForm.stops.map((st, idx) => (
                    <div
                      key={idx}
                      className="grid grid-cols-1 sm:grid-cols-12 gap-2 items-center bg-slate-50 p-2.5 rounded-lg border border-slate-200"
                    >
                      <input
                        value={st.stop_name}
                        onChange={(e) => handleStopChange(idx, "stop_name", e.target.value)}
                        placeholder="স্টপেজের নাম (যেমন: কাজীপাড়া)"
                        className="sm:col-span-4 px-2.5 py-1.5 bg-white border border-slate-200 rounded text-xs outline-none focus:border-[#1C7D5A]"
                      />
                      <input
                        type="time"
                        value={st.pickup_time}
                        onChange={(e) => handleStopChange(idx, "pickup_time", e.target.value)}
                        title="পিকআপ সময়"
                        className="sm:col-span-2 px-2 py-1.5 bg-white border border-slate-200 rounded text-xs outline-none focus:border-[#1C7D5A]"
                      />
                      <input
                        type="time"
                        value={st.drop_time}
                        onChange={(e) => handleStopChange(idx, "drop_time", e.target.value)}
                        title="ড্রপ সময়"
                        className="sm:col-span-2 px-2 py-1.5 bg-white border border-slate-200 rounded text-xs outline-none focus:border-[#1C7D5A]"
                      />
                      <input
                        type="number"
                        min={0}
                        value={st.monthly_fee}
                        onChange={(e) => handleStopChange(idx, "monthly_fee", e.target.value)}
                        placeholder="ভাড়া ৳"
                        className="sm:col-span-3 px-2.5 py-1.5 bg-white border border-slate-200 rounded text-xs font-bold outline-none focus:border-[#1C7D5A]"
                      />
                      <button
                        type="button"
                        onClick={() => handleRemoveStopRow(idx)}
                        className="sm:col-span-1 p-1.5 text-rose-500 hover:bg-rose-50 rounded flex justify-center cursor-pointer"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  ))}
                </div>
              </div>

              <div className="flex items-center justify-between pt-3 border-t border-slate-100">
                <select
                  value={routeForm.status}
                  onChange={(e) => setRouteForm({ ...routeForm, status: e.target.value })}
                  className="px-3 py-2 border border-slate-200 rounded-lg text-sm font-semibold outline-none focus:border-[#1C7D5A]"
                >
                  <option value="Active">সক্রিয় (Active)</option>
                  <option value="Inactive">বন্ধ (Inactive)</option>
                </select>
                <div className="flex gap-2">
                  <button
                    type="button"
                    onClick={() => setIsRouteModalOpen(false)}
                    className="px-4 py-2 rounded-lg text-sm font-bold text-slate-600 hover:bg-slate-100 cursor-pointer"
                  >
                    বাতিল
                  </button>
                  <button
                    type="submit"
                    disabled={savingRoute}
                    className="px-5 py-2 rounded-lg text-sm font-bold bg-[#1C7D5A] text-white hover:bg-[#156347] flex items-center gap-2 cursor-pointer disabled:opacity-60"
                  >
                    {savingRoute ? <Loader2 className="w-4 h-4 animate-spin" /> : <CheckCircle2 className="w-4 h-4" />}
                    সংরক্ষণ করুন
                  </button>
                </div>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default VehiclesRoutesPage;
