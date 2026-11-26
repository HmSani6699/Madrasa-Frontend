import { useState, useEffect, useCallback, useMemo } from "react";
import {
  UserPlus,
  Search,
  Edit2,
  Trash2,
  X,
  Check,
  Loader2,
  Users,
  Bus,
  MapPin,
  Download,
  Wallet,
} from "lucide-react";
import { toast } from "react-hot-toast";
import axiosInstance from "../../../api/axiosInstance";
import endpoints from "../../../api/endpoints";
import transportService from "../../../services/transportService";
import {
  TRIP_TYPES,
  TRIP_TYPE_BADGE,
  formatCurrency,
  getTodayDateStr,
} from "./transportConstants";
import TransportPageHeader from "./TransportPageHeader";
import TransportKpiCards from "./TransportKpiCards";

const csvEscape = (value) => {
  const str = String(value ?? "");
  return /[",\n\r]/.test(str) ? `"${str.replace(/"/g, '""')}"` : str;
};

const TransportStudentsPage = () => {
  const [loading, setLoading] = useState(true);
  const [students, setStudents] = useState([]);
  const [routes, setRoutes] = useState([]);
  const [dashboard, setDashboard] = useState(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [routeFilter, setRouteFilter] = useState("all");
  const [classFilter, setClassFilter] = useState("all");
  const [tripFilter, setTripFilter] = useState("all");
  const [statusFilter, setStatusFilter] = useState("all");
  const [apiClasses, setApiClasses] = useState([]);
  const [seenClasses, setSeenClasses] = useState([]);

  // Add Student Modal
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [admissionStudents, setAdmissionStudents] = useState([]);
  const [loadingAdmission, setLoadingAdmission] = useState(false);
  const [admissionFilter, setAdmissionFilter] = useState("not-enrolled");
  const [admissionSearch, setAdmissionSearch] = useState("");
  const [selectedIds, setSelectedIds] = useState([]);
  const [enrollForm, setEnrollForm] = useState({
    route_id: "",
    stoppage: "",
    trip_type: "Both",
    monthly_fee: 1000,
    waiver_percent: 0,
  });
  const [submittingEnroll, setSubmittingEnroll] = useState(false);

  // Edit Modal
  const [editingStudent, setEditingStudent] = useState(null);
  const [editForm, setEditForm] = useState(null);
  const [savingEdit, setSavingEdit] = useState(false);

  useEffect(() => {
    let active = true;
    axiosInstance
      .get(endpoints.common.classes)
      .then((res) => {
        if (active && res.data?.success && Array.isArray(res.data.data)) {
          setApiClasses(res.data.data.map((c) => c.name).filter(Boolean));
        }
      })
      .catch(() => { });
    return () => {
      active = false;
    };
  }, []);

  const fetchData = useCallback(async () => {
    try {
      setLoading(true);
      const [stRes, routeRes, dashRes] = await Promise.all([
        transportService.getTransportStudents({
          route_id: routeFilter,
          class_name: classFilter,
          trip_type: tripFilter,
          status: statusFilter,
          search: searchTerm,
        }),
        transportService.getRoutes(),
        transportService.getDashboard(getTodayDateStr()),
      ]);
      if (stRes.success) {
        const list = stRes.data || [];
        setStudents(list);
        const fetchedClasses = list.map((s) => s.class_name).filter(Boolean);
        if (fetchedClasses.length > 0) {
          setSeenClasses((prev) => Array.from(new Set([...prev, ...fetchedClasses])));
        }
      }
      if (routeRes.success) {
        setRoutes(routeRes.data || []);
      }
      if (dashRes.success) setDashboard(dashRes.data);
    } catch {
      toast.error("ট্রান্সপোর্ট ছাত্র তালিকা লোড ব্যর্থ হয়েছে");
    } finally {
      setLoading(false);
    }
  }, [routeFilter, classFilter, tripFilter, statusFilter, searchTerm]);

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  const classOptions = useMemo(() => {
    const names = new Set([...apiClasses, ...seenClasses]);
    return Array.from(names).sort((a, b) => a.localeCompare(b, undefined, { numeric: true }));
  }, [apiClasses, seenClasses]);

  const fetchAdmissionStudents = useCallback(async () => {
    try {
      setLoadingAdmission(true);
      const res = await transportService.getAdmissionStudents({
        filter: admissionFilter,
        search: admissionSearch,
      });
      if (res.success) setAdmissionStudents(res.data || []);
    } catch {
      toast.error("ভর্তি ছাত্রদের তালিকা লোড ব্যর্থ হয়েছে");
    } finally {
      setLoadingAdmission(false);
    }
  }, [admissionFilter, admissionSearch]);

  useEffect(() => {
    if (isAddModalOpen) fetchAdmissionStudents();
  }, [isAddModalOpen, fetchAdmissionStudents]);

  const openAddModal = () => {
    const firstActiveRoute = routes.find((r) => r.status === "Active") || routes[0];
    const firstStop = firstActiveRoute?.stops?.[0];
    setEnrollForm({
      route_id: firstActiveRoute?._id || "",
      stoppage: firstStop?.stop_name || "",
      trip_type: "Both",
      monthly_fee: firstStop?.monthly_fee ?? firstActiveRoute?.default_fee ?? 1000,
      waiver_percent: 0,
    });
    setSelectedIds([]);
    setIsAddModalOpen(true);
  };

  const handleEnrollRouteChange = (routeId) => {
    const r = routes.find((rt) => rt._id === routeId);
    const firstStop = r?.stops?.[0];
    setEnrollForm((prev) => ({
      ...prev,
      route_id: routeId,
      stoppage: firstStop?.stop_name || "",
      monthly_fee: firstStop?.monthly_fee ?? r?.default_fee ?? prev.monthly_fee,
    }));
  };

  const handleEnrollStopChange = (stopName) => {
    const r = routes.find((rt) => rt._id === enrollForm.route_id);
    const st = r?.stops?.find((s) => s.stop_name === stopName);
    setEnrollForm((prev) => ({
      ...prev,
      stoppage: stopName,
      monthly_fee: st?.monthly_fee ?? r?.default_fee ?? prev.monthly_fee,
    }));
  };

  const handleBulkEnroll = async () => {
    if (selectedIds.length === 0) return toast.error("কমপক্ষে একজন ছাত্র নির্বাচন করুন");
    if (!enrollForm.route_id) return toast.error("দয়া করে একটি রুট নির্বাচন করুন");

    try {
      setSubmittingEnroll(true);
      const res = await transportService.bulkEnrollStudents({
        student_ids: selectedIds,
        ...enrollForm,
        monthly_fee: Number(enrollForm.monthly_fee || 0),
        waiver_percent: Number(enrollForm.waiver_percent || 0),
      });
      toast.success(res.message || "ছাত্রদের ট্রান্সপোর্টে যুক্ত করা হয়েছে");
      setIsAddModalOpen(false);
      setSelectedIds([]);
      fetchData();
    } catch (err) {
      toast.error(err.response?.data?.message || "যুক্ত করতে সমস্যা হয়েছে");
    } finally {
      setSubmittingEnroll(false);
    }
  };

  const openEditModal = (st) => {
    setEditingStudent(st);
    setEditForm({
      route_id: st.route_id || "",
      stoppage: st.stoppage || "",
      trip_type: st.trip_type || "Both",
      monthly_fee: st.monthly_fee ?? 0,
      waiver_percent: st.waiver_percent ?? 0,
      pickup_address: st.address || "",
      status: st.status || "Active",
      note: st.note || "",
    });
  };

  const handleSaveEdit = async (e) => {
    e.preventDefault();
    if (!editingStudent || !editForm) return;
    try {
      setSavingEdit(true);
      await transportService.updateTransportStudent(editingStudent._id, {
        ...editForm,
        monthly_fee: Number(editForm.monthly_fee || 0),
        waiver_percent: Number(editForm.waiver_percent || 0),
      });
      toast.success("ছাত্রের ট্রান্সপোর্ট তথ্য আপডেট হয়েছে");
      setEditingStudent(null);
      fetchData();
    } catch (err) {
      toast.error(err.response?.data?.message || "আপডেট ব্যর্থ হয়েছে");
    } finally {
      setSavingEdit(false);
    }
  };

  const handleDelete = async (id, name) => {
    if (!window.confirm(`${name} কে ট্রান্সপোর্ট থেকে সরাতে চান?`)) return;
    try {
      await transportService.deleteTransportStudent(id);
      toast.success("ছাত্রটি ট্রান্সপোর্ট তালিকা থেকে সরানো হয়েছে");
      fetchData();
    } catch {
      toast.error("মুছতে সমস্যা হয়েছে");
    }
  };

  const handleExportCSV = () => {
    if (students.length === 0) return toast.error("ডাউনলোড করার মতো কোনো তথ্য নেই");
    const headers = [
      "ক্রম",
      "আইডি",
      "ছাত্রের নাম",
      "শ্রেণি",
      "রুট",
      "স্টপেজ",
      "গাড়ি",
      "ট্রিপ",
      "মাসিক ফি",
      "ছাড় (%)",
      "নিট ফি",
      "অভিভাবক মোবাইল",
      "অবস্থা",
    ];
    const rows = students.map((s, idx) =>
      [
        idx + 1,
        s.student_code,
        s.student_name,
        s.class_name,
        s.route_name,
        s.stoppage,
        s.vehicle_no,
        s.trip_type,
        s.monthly_fee,
        s.waiver_percent,
        s.net_monthly_fee,
        s.guardian_contact,
        s.status,
      ]
        .map(csvEscape)
        .join(",")
    );
    const csv = "\uFEFF" + [headers.join(","), ...rows].join("\n");
    const blob = new Blob([csv], { type: "text/csv;charset=utf-8;" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `transport-students-${getTodayDateStr()}.csv`;
    a.click();
    URL.revokeObjectURL(url);
  };

  const selectedEnrollRoute = routes.find((r) => r._id === enrollForm.route_id);
  const selectedEditRoute = routes.find((r) => r._id === editForm?.route_id);

  const kpiCards = [
    {
      title: "মোট পরিবহন ছাত্র",
      value: `${dashboard?.studentsSummary?.total || 0} জন`,
      subtitle: `নিষ্ক্রিয়: ${dashboard?.studentsSummary?.inactive || 0} জন`,
      icon: Users,
      color: "text-emerald-600",
      bg: "bg-emerald-50",
    },
    {
      title: "উভয়মুখী (আসা+যাওয়া)",
      value: `${dashboard?.studentsSummary?.bothWay || 0} জন`,
      subtitle: `শুধু আসা: ${dashboard?.studentsSummary?.pickupOnly || 0} | শুধু যাওয়া: ${dashboard?.studentsSummary?.dropOnly || 0
        }`,
      icon: Bus,
      color: "text-blue-600",
      bg: "bg-blue-50",
    },
    {
      title: "সক্রিয় রুট",
      value: `${dashboard?.routesSummary?.active || 0} টি`,
      subtitle: `সক্রিয় গাড়ি: ${dashboard?.vehiclesSummary?.active || 0} টি`,
      icon: MapPin,
      color: "text-indigo-600",
      bg: "bg-indigo-50",
    },
    {
      title: "সম্ভাব্য মাসিক আয়",
      value: formatCurrency(dashboard?.studentsSummary?.expectedMonthlyFee),
      subtitle: `চলতি মাসে আদায়: ${formatCurrency(dashboard?.monthlyFinance?.collected)}`,
      icon: Wallet,
      color: "text-amber-600",
      bg: "bg-amber-50",
    },
  ];

  return (
    <div className="space-y-5 animate-in fade-in duration-500">
      <TransportPageHeader
        title="ট্রান্সপোর্ট ছাত্র তালিকা ও রুট বরাদ্দ"
        subtitle="অ্যাডমিশন থেকে ছাত্রদের রুট, স্টপেজ ও মাসিক পরিবহন ফি নির্ধারণ করুন"
        icon={Users}
        rightActions={
          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={handleExportCSV}
              className="px-3.5 py-2.5 bg-white border border-slate-200 hover:border-[#1C7D5A] text-slate-700 rounded-lg text-sm font-bold flex items-center gap-1.5 shadow-sm cursor-pointer"
            >
              <Download className="w-4 h-4 text-[#1C7D5A]" />
              CSV
            </button>
            <button
              type="button"
              onClick={openAddModal}
              className="px-4 py-2.5 bg-[#1C7D5A] hover:bg-[#156347] text-white rounded-lg text-sm font-bold flex items-center gap-1.5 shadow-sm cursor-pointer"
            >
              <UserPlus className="w-4 h-4" />
              ছাত্র যুক্ত করুন
            </button>
          </div>
        }
      />

      <TransportKpiCards cards={kpiCards} />

      {/* Filters */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-3">
        <div className="relative">
          <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            placeholder="নাম, আইডি, স্টপেজ..."
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
          value={classFilter}
          onChange={(e) => setClassFilter(e.target.value)}
          className="px-3 py-2 border border-slate-200 rounded-lg text-sm outline-none focus:border-[#1C7D5A]"
        >
          <option value="all">সকল শ্রেণি</option>
          {classOptions.map((c) => (
            <option key={c} value={c}>
              {c}
            </option>
          ))}
        </select>
        <select
          value={tripFilter}
          onChange={(e) => setTripFilter(e.target.value)}
          className="px-3 py-2 border border-slate-200 rounded-lg text-sm outline-none focus:border-[#1C7D5A]"
        >
          <option value="all">সকল ট্রিপ</option>
          {TRIP_TYPES.map((t) => (
            <option key={t.value} value={t.value}>
              {t.label}
            </option>
          ))}
        </select>
        <select
          value={statusFilter}
          onChange={(e) => setStatusFilter(e.target.value)}
          className="px-3 py-2 border border-slate-200 rounded-lg text-sm outline-none focus:border-[#1C7D5A]"
        >
          <option value="all">সকল অবস্থা</option>
          <option value="Active">সক্রিয়</option>
          <option value="Inactive">নিষ্ক্রিয়</option>
        </select>
      </div>

      {/* Table */}
      <div className="bg-white rounded-lg border border-slate-200 shadow-sm overflow-x-auto">
        {loading ? (
          <div className="p-12 text-center">
            <Loader2 className="w-7 h-7 animate-spin mx-auto text-[#1C7D5A] mb-2" />
            <p className="text-sm text-slate-500">তালিকা লোড হচ্ছে...</p>
          </div>
        ) : students.length === 0 ? (
          <div className="p-12 text-center">
            <Bus className="w-10 h-10 text-slate-300 mx-auto mb-2" />
            <p className="text-sm font-bold text-slate-600">কোনো ট্রান্সপোর্ট ছাত্র পাওয়া যায়নি</p>
            <p className="text-xs text-slate-400 mt-1">উপরের "ছাত্র যুক্ত করুন" বাটনে ক্লিক করে ছাত্র বরাদ্দ করুন</p>
          </div>
        ) : (
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-slate-50 border-b border-slate-200 text-xs font-bold text-slate-600">
                <th className="py-3 px-4">ছাত্রের তথ্য</th>
                <th className="py-3 px-4">রুট ও স্টপেজ</th>
                <th className="py-3 px-4">ট্রিপ ধরন</th>
                <th className="py-3 px-4">মাসিক ফি</th>
                <th className="py-3 px-4">অভিভাবক</th>
                <th className="py-3 px-4">অবস্থা</th>
                <th className="py-3 px-4 text-right">অ্যাকশন</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 text-sm">
              {students.map((st) => {
                const tripBadge = TRIP_TYPE_BADGE[st.trip_type] || TRIP_TYPE_BADGE.Both;
                return (
                  <tr key={st._id} className="hover:bg-slate-50/60">
                    <td className="py-3 px-4">
                      <div className="font-bold text-slate-800">{st.student_name}</div>
                      <div className="text-xs text-slate-500">
                        {st.class_name}
                        {st.section_name ? ` (${st.section_name})` : ""} • রোল: {st.roll_number || "—"} • আইডি:{" "}
                        {st.student_code || "—"}
                      </div>
                    </td>
                    <td className="py-3 px-4">
                      <div className="font-semibold text-slate-800">{st.route_name || "রুট নির্ধারিত নয়"}</div>
                      <div className="text-xs text-slate-500">
                        স্টপেজ: {st.stoppage || "—"} {st.vehicle_no ? `• ${st.vehicle_no}` : ""}
                      </div>
                    </td>
                    <td className="py-3 px-4">
                      <span className={`px-2.5 py-0.5 rounded-full text-xs font-bold border ${tripBadge.className}`}>
                        {tripBadge.label}
                      </span>
                    </td>
                    <td className="py-3 px-4">
                      <div className="font-bold text-[#1C7D5A]">{formatCurrency(st.net_monthly_fee)}</div>
                      {Number(st.waiver_percent || 0) > 0 && (
                        <div className="text-[11px] text-slate-400">
                          মূল: {formatCurrency(st.monthly_fee)} ({st.waiver_percent}% ছাড়)
                        </div>
                      )}
                    </td>
                    <td className="py-3 px-4 text-xs text-slate-600">
                      <div className="font-semibold">{st.guardian_name || "—"}</div>
                      <div>{st.guardian_contact || "—"}</div>
                    </td>
                    <td className="py-3 px-4">
                      <span
                        className={`px-2.5 py-0.5 rounded-full text-xs font-bold border ${st.status === "Active"
                            ? "bg-emerald-50 text-emerald-700 border-emerald-200"
                            : "bg-slate-100 text-slate-600 border-slate-200"
                          }`}
                      >
                        {st.status === "Active" ? "সক্রিয়" : "নিষ্ক্রিয়"}
                      </span>
                    </td>
                    <td className="py-3 px-4 text-right">
                      <div className="inline-flex items-center gap-1">
                        <button
                          type="button"
                          onClick={() => openEditModal(st)}
                          className="p-1.5 text-slate-500 hover:text-[#1C7D5A] hover:bg-emerald-50 rounded-lg cursor-pointer"
                        >
                          <Edit2 className="w-4 h-4" />
                        </button>
                        <button
                          type="button"
                          onClick={() => handleDelete(st._id, st.student_name)}
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
        )}
      </div>

      {/* Enroll Modal */}
      {isAddModalOpen && (
        <div className="fixed inset-0 z-50 bg-black/50 flex items-center justify-center p-4">
          <div className="bg-white rounded-xl max-w-4xl w-full max-h-[90vh] flex flex-col shadow-xl overflow-hidden">
            <div className="px-6 py-4 border-b border-slate-100 flex items-center justify-between">
              <h3 className="text-base font-bold text-slate-800 flex items-center gap-2">
                <UserPlus className="w-5 h-5 text-[#1C7D5A]" />
                অ্যাডমিশন থেকে ট্রান্সপোর্টে ছাত্র যুক্ত করুন
              </h3>
              <button
                type="button"
                onClick={() => setIsAddModalOpen(false)}
                className="p-1 text-slate-400 hover:text-slate-600 cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="p-6 space-y-4 overflow-y-auto flex-1">
              {/* Route & Fee Setup */}
              <div className="bg-emerald-50/60 border border-emerald-200 rounded-lg p-4 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-3">
                <div>
                  <label className="text-xs font-bold text-slate-700 mb-1 block">রুট নির্বাচন *</label>
                  <select
                    value={enrollForm.route_id}
                    onChange={(e) => handleEnrollRouteChange(e.target.value)}
                    className="w-full px-2.5 py-2 bg-white border border-slate-200 rounded-lg text-xs font-semibold outline-none focus:border-[#1C7D5A]"
                  >
                    <option value="">রুট বেছে নিন</option>
                    {routes.map((r) => (
                      <option key={r._id} value={r._id}>
                        {r.route_name}
                      </option>
                    ))}
                  </select>
                </div>
                <div>
                  <label className="text-xs font-bold text-slate-700 mb-1 block">স্টপেজ</label>
                  {selectedEnrollRoute?.stops?.length > 0 ? (
                    <select
                      value={enrollForm.stoppage}
                      onChange={(e) => handleEnrollStopChange(e.target.value)}
                      className="w-full px-2.5 py-2 bg-white border border-slate-200 rounded-lg text-xs font-semibold outline-none focus:border-[#1C7D5A]"
                    >
                      <option value="">স্টপেজ বেছে নিন</option>
                      {selectedEnrollRoute.stops.map((s, idx) => (
                        <option key={idx} value={s.stop_name}>
                          {s.stop_name} ({formatCurrency(s.monthly_fee)})
                        </option>
                      ))}
                    </select>
                  ) : (
                    <input
                      value={enrollForm.stoppage}
                      onChange={(e) => setEnrollForm({ ...enrollForm, stoppage: e.target.value })}
                      placeholder="স্টপেজের নাম"
                      className="w-full px-2.5 py-2 bg-white border border-slate-200 rounded-lg text-xs outline-none focus:border-[#1C7D5A]"
                    />
                  )}
                </div>
                <div>
                  <label className="text-xs font-bold text-slate-700 mb-1 block">ট্রিপ ধরন</label>
                  <select
                    value={enrollForm.trip_type}
                    onChange={(e) => setEnrollForm({ ...enrollForm, trip_type: e.target.value })}
                    className="w-full px-2.5 py-2 bg-white border border-slate-200 rounded-lg text-xs font-semibold outline-none focus:border-[#1C7D5A]"
                  >
                    {TRIP_TYPES.map((t) => (
                      <option key={t.value} value={t.value}>
                        {t.label}
                      </option>
                    ))}
                  </select>
                </div>
                <div>
                  <label className="text-xs font-bold text-slate-700 mb-1 block">মাসিক ফি (৳)</label>
                  <input
                    type="number"
                    min={0}
                    value={enrollForm.monthly_fee}
                    onChange={(e) => setEnrollForm({ ...enrollForm, monthly_fee: e.target.value })}
                    className="w-full px-2.5 py-2 bg-white border border-slate-200 rounded-lg text-xs font-bold outline-none focus:border-[#1C7D5A]"
                  />
                </div>
                <div>
                  <label className="text-xs font-bold text-slate-700 mb-1 block">ছাড় (%)</label>
                  <input
                    type="number"
                    min={0}
                    max={100}
                    value={enrollForm.waiver_percent}
                    onChange={(e) => setEnrollForm({ ...enrollForm, waiver_percent: e.target.value })}
                    className="w-full px-2.5 py-2 bg-white border border-slate-200 rounded-lg text-xs font-bold outline-none focus:border-[#1C7D5A]"
                  />
                </div>
              </div>

              {/* Search & Filter admission students */}
              <div className="flex flex-col sm:flex-row gap-2">
                <div className="relative flex-1">
                  <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
                  <input
                    value={admissionSearch}
                    onChange={(e) => setAdmissionSearch(e.target.value)}
                    placeholder="ছাত্রের নাম, রোল বা আইডি খুঁজুন..."
                    className="w-full pl-9 pr-3 py-2 border border-slate-200 rounded-lg text-sm outline-none focus:border-[#1C7D5A]"
                  />
                </div>
                <select
                  value={admissionFilter}
                  onChange={(e) => setAdmissionFilter(e.target.value)}
                  className="px-3 py-2 border border-slate-200 rounded-lg text-sm outline-none focus:border-[#1C7D5A]"
                >
                  <option value="not-enrolled">এখনো যুক্ত হয়নি</option>
                  <option value="transport-required">ভর্তিতে পরিবহন চেয়েছে</option>
                  <option value="all">সকল ছাত্র</option>
                </select>
              </div>

              {/* Student Selection List */}
              <div className="border border-slate-200 rounded-lg max-h-72 overflow-y-auto divide-y divide-slate-100">
                {loadingAdmission ? (
                  <div className="p-8 text-center">
                    <Loader2 className="w-5 h-5 animate-spin mx-auto text-[#1C7D5A]" />
                  </div>
                ) : admissionStudents.length === 0 ? (
                  <div className="p-8 text-center text-sm text-slate-500">কোনো ছাত্র পাওয়া যায়নি</div>
                ) : (
                  admissionStudents.map((st) => {
                    const checked = selectedIds.includes(st._id);
                    return (
                      <label
                        key={st._id}
                        className={`flex items-center justify-between px-4 py-2.5 cursor-pointer hover:bg-slate-50 ${checked ? "bg-emerald-50/60" : ""
                          }`}
                      >
                        <div className="flex items-center gap-3">
                          <input
                            type="checkbox"
                            checked={checked}
                            onChange={() =>
                              setSelectedIds((prev) =>
                                prev.includes(st._id)
                                  ? prev.filter((id) => id !== st._id)
                                  : [...prev, st._id]
                              )
                            }
                            className="w-4 h-4 accent-[#1C7D5A]"
                          />
                          <div>
                            <div className="text-sm font-bold text-slate-800">{st.name}</div>
                            <div className="text-xs text-slate-500">
                              {st.class_name} • রোল: {st.roll_number || "—"} • ঠিকানা: {st.address || "—"}
                            </div>
                          </div>
                        </div>
                        <div className="text-right text-xs">
                          {st.is_enrolled ? (
                            <span className="px-2 py-0.5 rounded bg-emerald-100 text-emerald-700 font-bold">
                              যুক্ত আছে ({st.route_name})
                            </span>
                          ) : st.transport_required ? (
                            <span className="px-2 py-0.5 rounded bg-blue-100 text-blue-700 font-bold">
                              আবেদনে পরিবহন চেয়েছে
                            </span>
                          ) : null}
                        </div>
                      </label>
                    );
                  })
                )}
              </div>
            </div>

            <div className="px-6 py-4 border-t border-slate-100 flex items-center justify-between bg-slate-50">
              <span className="text-xs font-bold text-slate-600">নির্বাচিত: {selectedIds.length} জন</span>
              <div className="flex gap-2">
                <button
                  type="button"
                  onClick={() => setIsAddModalOpen(false)}
                  className="px-4 py-2 rounded-lg text-sm font-bold text-slate-600 hover:bg-slate-200 cursor-pointer"
                >
                  বাতিল
                </button>
                <button
                  type="button"
                  onClick={handleBulkEnroll}
                  disabled={submittingEnroll || selectedIds.length === 0}
                  className="px-5 py-2 rounded-lg text-sm font-bold bg-[#1C7D5A] text-white hover:bg-[#156347] flex items-center gap-1.5 cursor-pointer disabled:opacity-60"
                >
                  {submittingEnroll ? <Loader2 className="w-4 h-4 animate-spin" /> : <Check className="w-4 h-4" />}
                  ট্রান্সপোর্টে যুক্ত করুন
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Edit Modal */}
      {editingStudent && editForm && (
        <div className="fixed inset-0 z-50 bg-black/50 flex items-center justify-center p-4">
          <div className="bg-white rounded-xl max-w-lg w-full shadow-xl overflow-hidden">
            <div className="px-6 py-4 border-b border-slate-100 flex items-center justify-between">
              <h3 className="text-base font-bold text-slate-800">
                {editingStudent.student_name} — ট্রান্সপোর্ট সম্পাদনা
              </h3>
              <button
                type="button"
                onClick={() => setEditingStudent(null)}
                className="p-1 text-slate-400 hover:text-slate-600 cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>
            <form onSubmit={handleSaveEdit} className="p-6 space-y-4">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="text-xs font-bold text-slate-700 mb-1 block">রুট</label>
                  <select
                    value={editForm.route_id}
                    onChange={(e) => {
                      const r = routes.find((rt) => rt._id === e.target.value);
                      const firstStop = r?.stops?.[0];
                      setEditForm({
                        ...editForm,
                        route_id: e.target.value,
                        stoppage: firstStop?.stop_name || editForm.stoppage,
                        monthly_fee: firstStop?.monthly_fee ?? r?.default_fee ?? editForm.monthly_fee,
                      });
                    }}
                    className="w-full px-3 py-2 border border-slate-200 rounded-lg text-sm outline-none focus:border-[#1C7D5A]"
                  >
                    <option value="">রুট বেছে নিন</option>
                    {routes.map((r) => (
                      <option key={r._id} value={r._id}>
                        {r.route_name}
                      </option>
                    ))}
                  </select>
                </div>
                <div>
                  <label className="text-xs font-bold text-slate-700 mb-1 block">স্টপেজ</label>
                  {selectedEditRoute?.stops?.length > 0 ? (
                    <select
                      value={editForm.stoppage}
                      onChange={(e) => {
                        const st = selectedEditRoute.stops.find((s) => s.stop_name === e.target.value);
                        setEditForm({
                          ...editForm,
                          stoppage: e.target.value,
                          monthly_fee: st?.monthly_fee ?? editForm.monthly_fee,
                        });
                      }}
                      className="w-full px-3 py-2 border border-slate-200 rounded-lg text-sm outline-none focus:border-[#1C7D5A]"
                    >
                      <option value="">স্টপেজ বেছে নিন</option>
                      {selectedEditRoute.stops.map((s, idx) => (
                        <option key={idx} value={s.stop_name}>
                          {s.stop_name} ({formatCurrency(s.monthly_fee)})
                        </option>
                      ))}
                    </select>
                  ) : (
                    <input
                      value={editForm.stoppage}
                      onChange={(e) => setEditForm({ ...editForm, stoppage: e.target.value })}
                      className="w-full px-3 py-2 border border-slate-200 rounded-lg text-sm outline-none focus:border-[#1C7D5A]"
                    />
                  )}
                </div>
                <div>
                  <label className="text-xs font-bold text-slate-700 mb-1 block">ট্রিপ ধরন</label>
                  <select
                    value={editForm.trip_type}
                    onChange={(e) => setEditForm({ ...editForm, trip_type: e.target.value })}
                    className="w-full px-3 py-2 border border-slate-200 rounded-lg text-sm outline-none focus:border-[#1C7D5A]"
                  >
                    {TRIP_TYPES.map((t) => (
                      <option key={t.value} value={t.value}>
                        {t.label}
                      </option>
                    ))}
                  </select>
                </div>
                <div>
                  <label className="text-xs font-bold text-slate-700 mb-1 block">অবস্থা</label>
                  <select
                    value={editForm.status}
                    onChange={(e) => setEditForm({ ...editForm, status: e.target.value })}
                    className="w-full px-3 py-2 border border-slate-200 rounded-lg text-sm outline-none focus:border-[#1C7D5A]"
                  >
                    <option value="Active">সক্রিয়</option>
                    <option value="Inactive">নিষ্ক্রিয়</option>
                  </select>
                </div>
                <div>
                  <label className="text-xs font-bold text-slate-700 mb-1 block">মাসিক ফি (৳)</label>
                  <input
                    type="number"
                    min={0}
                    value={editForm.monthly_fee}
                    onChange={(e) => setEditForm({ ...editForm, monthly_fee: e.target.value })}
                    className="w-full px-3 py-2 border border-slate-200 rounded-lg text-sm font-bold outline-none focus:border-[#1C7D5A]"
                  />
                </div>
                <div>
                  <label className="text-xs font-bold text-slate-700 mb-1 block">ছাড় (%)</label>
                  <input
                    type="number"
                    min={0}
                    max={100}
                    value={editForm.waiver_percent}
                    onChange={(e) => setEditForm({ ...editForm, waiver_percent: e.target.value })}
                    className="w-full px-3 py-2 border border-slate-200 rounded-lg text-sm font-bold outline-none focus:border-[#1C7D5A]"
                  />
                </div>
              </div>

              <div>
                <label className="text-xs font-bold text-slate-700 mb-1 block">পিকআপ ঠিকানা</label>
                <input
                  value={editForm.pickup_address}
                  onChange={(e) => setEditForm({ ...editForm, pickup_address: e.target.value })}
                  className="w-full px-3 py-2 border border-slate-200 rounded-lg text-sm outline-none focus:border-[#1C7D5A]"
                />
              </div>

              <div className="flex justify-end gap-2 pt-3 border-t border-slate-100">
                <button
                  type="button"
                  onClick={() => setEditingStudent(null)}
                  className="px-4 py-2 rounded-lg text-sm font-bold text-slate-600 hover:bg-slate-100 cursor-pointer"
                >
                  বাতিল
                </button>
                <button
                  type="submit"
                  disabled={savingEdit}
                  className="px-5 py-2 rounded-lg text-sm font-bold bg-[#1C7D5A] text-white hover:bg-[#156347] flex items-center gap-1.5 cursor-pointer"
                >
                  {savingEdit && <Loader2 className="w-4 h-4 animate-spin" />}
                  আপডেট করুন
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default TransportStudentsPage;
