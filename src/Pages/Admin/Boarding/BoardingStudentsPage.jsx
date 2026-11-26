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
  UtensilsCrossed,
  ShoppingBag,
  Wallet,
  Download,
} from "lucide-react";
import { toast } from "react-hot-toast";
import axiosInstance from "../../../api/axiosInstance";
import endpoints from "../../../api/endpoints";
import boardingService from "../../../services/boardingService";
import { MEAL_PLANS, RESIDENTIAL_BADGE, formatCurrency, getTodayDateStr } from "./boardingConstants";
import BoardingPageHeader from "./BoardingPageHeader";
import BoardingKpiCards from "./BoardingKpiCards";

const csvEscape = (value) => {
  const str = String(value ?? "");
  return /[",\n\r]/.test(str) ? `"${str.replace(/"/g, '""')}"` : str;
};

const BoardingStudentsPage = () => {
  const [loading, setLoading] = useState(true);
  const [students, setStudents] = useState([]);
  const [dashboard, setDashboard] = useState(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [classFilter, setClassFilter] = useState("all");
  const [residentialFilter, setResidentialFilter] = useState("all");
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
    residential_type: "Residential",
    meal_plan_id: "full_3_meals",
    monthly_fee: 3500,
    waiver_percent: 0,
    billing_mode: "Fixed",
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
      .catch(() => {
        // Fallback to classes present in boarding student rows
      });
    return () => {
      active = false;
    };
  }, []);

  const fetchBoardingStudents = useCallback(async () => {
    try {
      setLoading(true);
      const res = await boardingService.getBoardingStudents({
        residential_type: residentialFilter,
        status: statusFilter,
        class_name: classFilter,
        search: searchTerm,
      });
      if (res.success) {
        const list = res.data || [];
        setStudents(list);
        const fetchedClasses = list.map((s) => s.class_name).filter(Boolean);
        if (fetchedClasses.length > 0) {
          setSeenClasses((prev) => Array.from(new Set([...prev, ...fetchedClasses])));
        }
      }
    } catch {
      toast.error("বোর্ডিং ছাত্র তালিকা লোড ব্যর্থ হয়েছে");
    } finally {
      setLoading(false);
    }
  }, [residentialFilter, statusFilter, classFilter, searchTerm]);

  const classOptions = useMemo(() => {
    const names = new Set([...apiClasses, ...seenClasses]);
    return Array.from(names).sort((a, b) =>
      a.localeCompare(b, undefined, { numeric: true })
    );
  }, [apiClasses, seenClasses]);

  const handleExportCSV = () => {
    if (students.length === 0) {
      toast.error("ডাউনলোড করার মতো কোনো রেকর্ড পাওয়া যায়নি");
      return;
    }

    const headers = [
      "ক্রম",
      "আইডি",
      "ছাত্রের নাম",
      "শ্রেণি",
      "শাখা",
      "রোল",
      "অভিভাবকের মোবাইল",
      "আবাসিক ধরন",
      "মিল প্যাকেজ",
      "বরাদ্দকৃত বেলা",
      "বিলিং মোড",
      "মাসিক ফি",
      "ছাড় (%)",
      "নিট প্রদেয়",
      "স্ট্যাটাস",
    ];

    const rows = students.map((st, idx) => {
      const badgeLabel = RESIDENTIAL_BADGE[st.residential_type]?.label || st.residential_type || "";
      const mealsLabel = [
        st.allowed_meals?.breakfast ? "সকাল" : null,
        st.allowed_meals?.lunch ? "দুপুর" : null,
        st.allowed_meals?.dinner ? "রাত" : null,
      ]
        .filter(Boolean)
        .join(" • ");
      const billingLabel = st.billing_mode === "MealRate" ? "মিল-রেট" : "ফিক্সড";
      const statusLabel = st.status === "Active" ? "সক্রিয়" : "নিষ্ক্রিয়";

      return [
        idx + 1,
        st.student_code || "",
        st.student_name || "",
        st.class_name || "N/A",
        st.section_name || "",
        st.roll_number || "",
        st.guardian_contact || "",
        badgeLabel,
        st.meal_plan_name || "",
        mealsLabel,
        billingLabel,
        st.monthly_fee ?? 0,
        st.waiver_percent ?? 0,
        st.net_monthly_fee ?? 0,
        statusLabel,
      ];
    });

    const csvContent =
      "\uFEFF" +
      [headers, ...rows].map((row) => row.map(csvEscape).join(",")).join("\r\n");

    const blob = new Blob([csvContent], { type: "text/csv;charset=utf-8;" });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    const safeClass =
      classFilter === "all" ? "" : `-${classFilter.replace(/[^\w\u0980-\u09FF-]+/g, "_")}`;
    link.href = url;
    link.setAttribute("download", `boarding-students-${getTodayDateStr()}${safeClass}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
    toast.success("CSV রেকর্ড ডাউনলোড হয়েছে");
  };

  const fetchAdmissionStudents = useCallback(async () => {
    if (!isAddModalOpen) return;
    try {
      setLoadingAdmission(true);
      const res = await boardingService.getAdmissionStudents({
        residential_filter: admissionFilter,
        search: admissionSearch,
      });
      if (res.success) setAdmissionStudents(res.data || []);
    } catch {
      toast.error("অ্যাডমিশন ছাত্র তালিকা আনতে সমস্যা হয়েছে");
    } finally {
      setLoadingAdmission(false);
    }
  }, [isAddModalOpen, admissionFilter, admissionSearch]);

  const fetchDashboard = useCallback(async () => {
    try {
      const res = await boardingService.getDashboard(getTodayDateStr());
      if (res.success) setDashboard(res.data);
    } catch {
      // Non-blocking KPI refresh
    }
  }, []);

  useEffect(() => {
    fetchBoardingStudents();
  }, [fetchBoardingStudents]);

  useEffect(() => {
    fetchDashboard();
  }, [fetchDashboard]);

  useEffect(() => {
    fetchAdmissionStudents();
  }, [fetchAdmissionStudents]);

  const handlePlanChange = (planId, isEdit = false) => {
    const plan = MEAL_PLANS.find((p) => p.id === planId) || MEAL_PLANS[0];
    if (isEdit) {
      setEditForm((prev) => ({
        ...prev,
        meal_plan_id: planId,
        meal_plan_name: plan.name,
        allowed_meals: { ...plan.allowed_meals },
        monthly_fee: planId === "lillah_free" ? 0 : prev.monthly_fee || plan.default_fee,
        waiver_percent: planId === "lillah_free" ? 100 : prev.waiver_percent,
        residential_type: planId === "lillah_free" ? "Lillah" : prev.residential_type,
      }));
    } else {
      setEnrollForm((prev) => ({
        ...prev,
        meal_plan_id: planId,
        monthly_fee: plan.default_fee,
        waiver_percent: planId === "lillah_free" ? 100 : 0,
        residential_type: planId === "lillah_free" ? "Lillah" : prev.residential_type,
      }));
    }
  };

  const handleResidentialChange = (type, isEdit = false) => {
    if (isEdit) {
      setEditForm((prev) => ({
        ...prev,
        residential_type: type,
        ...(type === "Lillah"
          ? { meal_plan_id: "lillah_free", monthly_fee: 0, waiver_percent: 100 }
          : {}),
      }));
    } else {
      setEnrollForm((prev) => ({
        ...prev,
        residential_type: type,
        ...(type === "Lillah"
          ? { meal_plan_id: "lillah_free", monthly_fee: 0, waiver_percent: 100 }
          : type === "Non-Residential"
            ? { meal_plan_id: "daycare_lunch", monthly_fee: 1500, waiver_percent: 0 }
            : { meal_plan_id: "full_3_meals", monthly_fee: 3500, waiver_percent: 0 }),
      }));
    }
  };

  const toggleSelectStudent = (id) => {
    setSelectedIds((prev) =>
      prev.includes(id) ? prev.filter((item) => item !== id) : [...prev, id]
    );
  };

  const handleBulkEnroll = async () => {
    if (selectedIds.length === 0) return toast.error("কমপক্ষে একজন ছাত্র নির্বাচন করুন");
    try {
      setSubmittingEnroll(true);
      await boardingService.bulkEnrollStudents({
        student_ids: selectedIds,
        residential_type: enrollForm.residential_type,
        meal_plan_id: enrollForm.meal_plan_id,
        monthly_fee: Number(enrollForm.monthly_fee) || 0,
        waiver_percent: Number(enrollForm.waiver_percent) || 0,
        billing_mode: enrollForm.billing_mode,
      });
      toast.success(`${selectedIds.length} জন ছাত্র বোর্ডিংয়ে যুক্ত হয়েছে`);
      setSelectedIds([]);
      setIsAddModalOpen(false);
      fetchBoardingStudents();
      fetchDashboard();
    } catch (err) {
      toast.error(err.response?.data?.message || "ছাত্র যুক্ত করতে সমস্যা হয়েছে");
    } finally {
      setSubmittingEnroll(false);
    }
  };

  const openEditModal = (st) => {
    setEditingStudent(st);
    setEditForm({
      residential_type: st.residential_type,
      meal_plan_id: st.meal_plan_id,
      meal_plan_name: st.meal_plan_name,
      allowed_meals: { ...(st.allowed_meals || { breakfast: true, lunch: true, dinner: true }) },
      monthly_fee: st.monthly_fee ?? 0,
      waiver_percent: st.waiver_percent ?? 0,
      billing_mode: st.billing_mode || "Fixed",
      status: st.status || "Active",
      note: st.note || "",
    });
  };

  const handleSaveEdit = async (e) => {
    e.preventDefault();
    if (!editingStudent || !editForm) return;
    try {
      setSavingEdit(true);
      await boardingService.updateBoardingStudent(editingStudent._id, editForm);
      toast.success("ছাত্রের বোর্ডিং প্যাকেজ আপডেট হয়েছে");
      setEditingStudent(null);
      fetchBoardingStudents();
      fetchDashboard();
    } catch (err) {
      toast.error(err.response?.data?.message || "আপডেট করতে সমস্যা হয়েছে");
    } finally {
      setSavingEdit(false);
    }
  };

  const handleDeleteStudent = async (st) => {
    if (!window.confirm(`আপনি কি "${st.student_name}" কে বোর্ডিং তালিকা থেকে সরাতে চান?`)) return;
    try {
      await boardingService.deleteBoardingStudent(st._id);
      toast.success("বোর্ডিং তালিকা থেকে সরানো হয়েছে");
      fetchBoardingStudents();
      fetchDashboard();
    } catch {
      toast.error("মুছতে সমস্যা হয়েছে");
    }
  };

  const previewNetFee =
    enrollForm.residential_type === "Lillah" || enrollForm.meal_plan_id === "lillah_free"
      ? 0
      : Math.max(
        0,
        Math.round(
          (Number(enrollForm.monthly_fee) || 0) *
          (1 - (Number(enrollForm.waiver_percent) || 0) / 100)
        )
      );

  const mealsToday = dashboard?.mealsToday || { breakfast: 0, lunch: 0, dinner: 0, total: 0 };
  const studentsSummary = dashboard?.studentsSummary || {
    total: 0,
    residential: 0,
    nonResidential: 0,
    lillah: 0,
  };
  const monthlyFinance = dashboard?.monthlyFinance || {
    collected: 0,
    bazarExpense: 0,
    balance: 0,
    mealRate: 0,
  };

  const kpiCards = [
    {
      title: "আজকের মোট মিল",
      value: `${mealsToday.total} বেলা`,
      subtitle: `সকাল: ${mealsToday.breakfast} | দুপুর: ${mealsToday.lunch} | রাত: ${mealsToday.dinner}`,
      icon: UtensilsCrossed,
      color: "text-emerald-600",
      bg: "bg-emerald-50",
    },
    {
      title: "মোট বোর্ডিং ছাত্র",
      value: `${studentsSummary.total} জন`,
      subtitle: `আবাসিক: ${studentsSummary.residential} | অনাবাসিক: ${studentsSummary.nonResidential}${studentsSummary.lillah > 0 ? ` | লিল্লাহ: ${studentsSummary.lillah}` : ""
        }`,
      icon: Users,
      color: "text-blue-600",
      bg: "bg-blue-50",
    },
    {
      title: "আজকের বাজার খরচ",
      value: formatCurrency(dashboard?.todayBazarCost || 0),
      subtitle: `মিল রেট (চলতি মাস): ${formatCurrency(monthlyFinance.mealRate)}`,
      icon: ShoppingBag,
      color: "text-amber-600",
      bg: "bg-amber-50",
    },
    {
      title: "চলতি মাসের ব্যালেন্স",
      value: formatCurrency(monthlyFinance.balance),
      subtitle: `আদায়: ${formatCurrency(monthlyFinance.collected)} বনাম খরচ: ${formatCurrency(
        monthlyFinance.bazarExpense
      )}`,
      icon: Wallet,
      color: monthlyFinance.balance >= 0 ? "text-emerald-600" : "text-rose-600",
      bg: monthlyFinance.balance >= 0 ? "bg-emerald-50" : "bg-rose-50",
    },
  ];

  return (
    <div className="space-y-5 animate-in fade-in duration-500">
      <BoardingPageHeader
        title="বোর্ডিং ছাত্র ও মিল প্যাকেজ"
        subtitle="অ্যাডমিশন ডাটাবেস থেকে আবাসিক/অনাবাসিক ফিল্টার, মিল প্যাকেজ এবং ওয়েভার সেটআপ"
        icon={Users}
        rightActions={
          <button
            onClick={() => setIsAddModalOpen(true)}
            className="px-4 py-2 bg-[#1C7D5A] hover:bg-[#123628] text-white text-sm font-semibold rounded-lg shadow-sm flex items-center gap-2 transition-colors cursor-pointer"
          >
            <UserPlus className="w-4 h-4" /> নতুন ছাত্র যুক্ত করুন
          </button>
        }
      />

      {/* 4 Top KPI Summary Cards */}
      <BoardingKpiCards cards={kpiCards} />

      <div className=" space-y-4">
        {/* Filters */}
        <div className="flex flex-col lg:flex-row gap-3">
          <div className="relative flex-1">
            <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              placeholder="ছাত্রের নাম, রোল বা আইডি দিয়ে খুঁজুন..."
              className="w-full pl-9 pr-3 py-2 text-sm border border-slate-200 rounded-lg focus:outline-none focus:border-[#1C7D5A]"
            />
          </div>
          <div className="flex flex-wrap items-center gap-3">
            <select
              value={classFilter}
              onChange={(e) => setClassFilter(e.target.value)}
              aria-label="শ্রেণি ফিল্টার"
              className="px-3 py-2 text-sm border border-slate-200 rounded-lg bg-white font-medium"
            >
              <option value="all">সকল শ্রেণি</option>
              {classOptions.map((cls) => (
                <option key={cls} value={cls}>
                  {cls}
                </option>
              ))}
            </select>
            <select
              value={residentialFilter}
              onChange={(e) => setResidentialFilter(e.target.value)}
              className="px-3 py-2 text-sm border border-slate-200 rounded-lg bg-white font-medium"
            >
              <option value="all">সকল আবাসিক ধরন</option>
              <option value="Residential">আবাসিক (Residential)</option>
              <option value="Non-Residential">অনাবাসিক (Non-Residential)</option>
              <option value="Lillah">লিল্লাহ / ফ্রি (Lillah)</option>
            </select>
            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
              className="px-3 py-2 text-sm border border-slate-200 rounded-lg bg-white font-medium"
            >
              <option value="all">সকল স্ট্যাটাস</option>
              <option value="Active">সক্রিয় (Active)</option>
              <option value="Inactive">নিষ্ক্রিয় (Inactive)</option>
            </select>
            <button
              type="button"
              onClick={handleExportCSV}
              disabled={loading || students.length === 0}
              className="px-3.5 py-2 text-sm font-semibold bg-[#1C7D5A] hover:bg-[#123628] text-white rounded-lg shadow-sm flex items-center justify-center gap-1.5 transition-colors cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed whitespace-nowrap"
            >
              <Download className="w-4 h-4" />
              CSV ডাউনলোড
            </button>
          </div>
        </div>

        {/* Table */}
        <div className="overflow-x-auto border border-slate-200 rounded-lg">
          <table className="w-full text-sm text-left">
            <thead className="bg-slate-50 border-b border-slate-200 text-slate-700">
              <tr>
                <th className="py-3 px-4 font-bold">ছাত্রের নাম</th>
                <th className="py-3 px-3 font-bold">আবাসিক ধরন</th>
                <th className="py-3 px-3 font-bold">মিল প্যাকেজ</th>
                <th className="py-3 px-3 font-bold text-right">মাসিক ফি</th>
                <th className="py-3 px-3 font-bold text-center">ছাড় (Waiver)</th>
                <th className="py-3 px-3 font-bold text-right">নিট প্রদেয়</th>
                <th className="py-3 px-3 font-bold text-center">স্ট্যাটাস</th>
                <th className="py-3 px-3 font-bold text-right">অ্যাকশন</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {loading ? (
                <tr>
                  <td colSpan={8} className="py-10 text-center text-slate-500">
                    <Loader2 className="w-6 h-6 animate-spin mx-auto text-[#1C7D5A] mb-2" />
                    লোড হচ্ছে...
                  </td>
                </tr>
              ) : students.length === 0 ? (
                <tr>
                  <td colSpan={8} className="py-10 text-center text-slate-500">
                    এখনো কোনো ছাত্র বোর্ডিংয়ে যুক্ত করা হয়নি।
                  </td>
                </tr>
              ) : (
                students.map((st) => {
                  const badge =
                    RESIDENTIAL_BADGE[st.residential_type] || RESIDENTIAL_BADGE.Residential;
                  return (
                    <tr key={st._id} className="hover:bg-slate-50/70">
                      <td className="py-3 px-4">
                        <div className="font-semibold text-slate-800">{st.student_name}</div>
                        <div className="text-xs text-slate-500">
                          {st.class_name} {st.roll_number ? `| রোল: ${st.roll_number}` : ""}
                        </div>
                      </td>
                      <td className="py-3 px-3">
                        <span
                          className={`text-[11px] font-bold px-2.5 py-0.5 rounded-full border ${badge.className}`}
                        >
                          {badge.label}
                        </span>
                      </td>
                      <td className="py-3 px-3">
                        <div className="font-medium text-slate-800 text-xs">{st.meal_plan_name}</div>
                        <div className="text-[11px] text-slate-500">
                          {[
                            st.allowed_meals?.breakfast ? "সকাল" : null,
                            st.allowed_meals?.lunch ? "দুপুর" : null,
                            st.allowed_meals?.dinner ? "রাত" : null,
                          ]
                            .filter(Boolean)
                            .join(" • ")}{" "}
                          ({st.billing_mode === "MealRate" ? "মিল-রেট" : "ফিক্সড"})
                        </div>
                      </td>
                      <td className="py-3 px-3 text-right font-medium text-slate-700">
                        {formatCurrency(st.monthly_fee)}
                      </td>
                      <td className="py-3 px-3 text-center">
                        {st.waiver_percent > 0 ? (
                          <span className="text-xs font-bold px-2 py-0.5 rounded bg-amber-50 text-amber-700 border border-amber-200">
                            {st.waiver_percent}%
                          </span>
                        ) : (
                          <span className="text-xs text-slate-400">০%</span>
                        )}
                      </td>
                      <td className="py-3 px-3 text-right font-bold text-[#1C7D5A]">
                        {formatCurrency(st.net_monthly_fee)}
                      </td>
                      <td className="py-3 px-3 text-center">
                        <span
                          className={`text-[11px] font-bold px-2 py-0.5 rounded-full ${st.status === "Active"
                            ? "bg-emerald-50 text-emerald-700"
                            : "bg-slate-100 text-slate-600"
                            }`}
                        >
                          {st.status === "Active" ? "সক্রিয়" : "নিষ্ক্রিয়"}
                        </span>
                      </td>
                      <td className="py-3 px-3 text-right">
                        <div className="inline-flex items-center gap-1">
                          <button
                            onClick={() => openEditModal(st)}
                            className="p-1.5 text-slate-600 hover:bg-slate-100 rounded-lg cursor-pointer"
                            title="প্যাকেজ এডিট"
                          >
                            <Edit2 className="w-4 h-4" />
                          </button>
                          <button
                            onClick={() => handleDeleteStudent(st)}
                            className="p-1.5 text-rose-500 hover:bg-rose-50 rounded-lg cursor-pointer"
                            title="মুছে ফেলুন"
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
      </div>

      {/* Add Student Modal */}
      {isAddModalOpen && (
        <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-xl shadow-2xl w-full max-w-4xl max-h-[90vh] flex flex-col overflow-hidden">
            <div className="px-6 py-4 bg-[#123628] text-white flex items-center justify-between">
              <div>
                <h3 className="font-bold text-base">অ্যাডমিশন ডাটাবেস থেকে ছাত্র বোর্ডিংয়ে যুক্ত করুন</h3>
                <p className="text-xs text-white/75">আবাসিক ও অনাবাসিক ফিল্টার করে মিল প্যাকেজ অ্যাসাইন করুন</p>
              </div>
              <button
                onClick={() => setIsAddModalOpen(false)}
                className="p-1.5 hover:bg-white/10 rounded-lg cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="p-6 overflow-y-auto space-y-5">
              <div className="p-4 rounded-xl bg-slate-50 border border-slate-200 grid grid-cols-1 md:grid-cols-5 gap-3">
                <div>
                  <label className="text-xs font-bold text-slate-600 mb-1 block">বোর্ডিং ধরন</label>
                  <select
                    value={enrollForm.residential_type}
                    onChange={(e) => handleResidentialChange(e.target.value, false)}
                    className="w-full px-3 py-2 text-sm border border-slate-200 rounded-lg bg-white"
                  >
                    <option value="Residential">আবাসিক (Residential)</option>
                    <option value="Non-Residential">অনাবাসিক (Non-Residential)</option>
                    <option value="Lillah">লিল্লাহ / ফ্রি (Lillah)</option>
                  </select>
                </div>
                <div className="md:col-span-2">
                  <label className="text-xs font-bold text-slate-600 mb-1 block">মিল প্যাকেজ</label>
                  <select
                    value={enrollForm.meal_plan_id}
                    onChange={(e) => handlePlanChange(e.target.value, false)}
                    className="w-full px-3 py-2 text-sm border border-slate-200 rounded-lg bg-white"
                  >
                    {MEAL_PLANS.map((p) => (
                      <option key={p.id} value={p.id}>
                        {p.name}
                      </option>
                    ))}
                  </select>
                </div>
                <div>
                  <label className="text-xs font-bold text-slate-600 mb-1 block">মাসিক ফি (৳)</label>
                  <input
                    type="number"
                    min={0}
                    disabled={enrollForm.residential_type === "Lillah"}
                    value={enrollForm.monthly_fee}
                    onChange={(e) => setEnrollForm({ ...enrollForm, monthly_fee: e.target.value })}
                    className="w-full px-3 py-2 text-sm border border-slate-200 rounded-lg bg-white disabled:bg-slate-100"
                  />
                </div>
                <div>
                  <label className="text-xs font-bold text-slate-600 mb-1 block">
                    ছাড় (%) — নিট: {formatCurrency(previewNetFee)}
                  </label>
                  <input
                    type="number"
                    min={0}
                    max={100}
                    disabled={enrollForm.residential_type === "Lillah"}
                    value={enrollForm.waiver_percent}
                    onChange={(e) => setEnrollForm({ ...enrollForm, waiver_percent: e.target.value })}
                    className="w-full px-3 py-2 text-sm border border-slate-200 rounded-lg bg-white disabled:bg-slate-100"
                  />
                </div>
              </div>

              <div className="flex flex-col sm:flex-row gap-3 justify-between items-center">
                <div className="flex flex-wrap gap-1.5">
                  {[
                    { key: "not-enrolled", label: "যুক্ত নয়" },
                    { key: "residential", label: "অ্যাডমিশনে আবাসিক" },
                    { key: "non-residential", label: "অ্যাডমিশনে অনাবাসিক" },
                    { key: "all", label: "সকল ছাত্র" },
                  ].map((f) => (
                    <button
                      key={f.key}
                      type="button"
                      onClick={() => setAdmissionFilter(f.key)}
                      className={`px-3 py-1.5 text-xs font-semibold rounded-lg border transition-colors cursor-pointer ${admissionFilter === f.key
                        ? "bg-[#1C7D5A] text-white border-[#1C7D5A]"
                        : "bg-white text-slate-600 border-slate-200 hover:bg-slate-50"
                        }`}
                    >
                      {f.label}
                    </button>
                  ))}
                </div>
                <div className="relative w-full sm:w-64">
                  <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
                  <input
                    type="text"
                    value={admissionSearch}
                    onChange={(e) => setAdmissionSearch(e.target.value)}
                    placeholder="নাম বা আইডি খুঁজুন..."
                    className="w-full pl-9 pr-3 py-1.5 text-sm border border-slate-200 rounded-lg"
                  />
                </div>
              </div>

              <div className="border border-slate-200 rounded-lg overflow-hidden max-h-72 overflow-y-auto">
                <table className="w-full text-sm text-left">
                  <thead className="bg-slate-50 border-b border-slate-200 sticky top-0">
                    <tr>
                      <th className="py-2.5 px-3 w-10"></th>
                      <th className="py-2.5 px-3 font-bold">নাম ও শ্রেণি</th>
                      <th className="py-2.5 px-3 font-bold">অ্যাডমিশন স্ট্যাটাস</th>
                      <th className="py-2.5 px-3 font-bold">বোর্ডিং অবস্থা</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100">
                    {loadingAdmission ? (
                      <tr>
                        <td colSpan={4} className="py-8 text-center text-slate-500">
                          <Loader2 className="w-5 h-5 animate-spin mx-auto text-[#1C7D5A]" />
                        </td>
                      </tr>
                    ) : admissionStudents.length === 0 ? (
                      <tr>
                        <td colSpan={4} className="py-8 text-center text-slate-500">
                          কোনো ছাত্র পাওয়া যায়নি
                        </td>
                      </tr>
                    ) : (
                      admissionStudents.map((st) => {
                        const checked = selectedIds.includes(st._id);
                        return (
                          <tr
                            key={st._id}
                            onClick={() => toggleSelectStudent(st._id)}
                            className={`cursor-pointer transition-colors ${checked ? "bg-emerald-50/70" : "hover:bg-slate-50"
                              }`}
                          >
                            <td className="py-2.5 px-3 text-center">
                              <input
                                type="checkbox"
                                checked={checked}
                                onChange={() => { }}
                                className="accent-[#1C7D5A] w-4 h-4"
                              />
                            </td>
                            <td className="py-2.5 px-3">
                              <div className="font-semibold text-slate-800">{st.name}</div>
                              <div className="text-xs text-slate-500">
                                {st.class_name} {st.roll_number ? `| রোল: ${st.roll_number}` : ""}{" "}
                                {st.student_code ? `| ${st.student_code}` : ""}
                              </div>
                            </td>
                            <td className="py-2.5 px-3">
                              <span
                                className={`text-[11px] font-bold px-2 py-0.5 rounded-full border ${st.hostel_required
                                  ? "bg-emerald-50 text-emerald-700 border-emerald-200"
                                  : "bg-slate-100 text-slate-600 border-slate-200"
                                  }`}
                              >
                                {st.hostel_required ? "আবাসিক" : "অনাবাসিক"}
                              </span>
                            </td>
                            <td className="py-2.5 px-3 text-xs">
                              {st.is_enrolled ? (
                                <span className="text-emerald-700 font-semibold">যুক্ত আছে</span>
                              ) : (
                                <span className="text-slate-400">যুক্ত নয়</span>
                              )}
                            </td>
                          </tr>
                        );
                      })
                    )}
                  </tbody>
                </table>
              </div>
            </div>

            <div className="px-6 py-4 border-t border-slate-200 bg-slate-50 flex items-center justify-between">
              <span className="text-xs font-bold text-slate-600">নির্বাচিত ছাত্র: {selectedIds.length} জন</span>
              <div className="flex gap-3">
                <button
                  onClick={() => setIsAddModalOpen(false)}
                  className="px-4 py-2 text-sm font-semibold text-slate-600 hover:bg-slate-200/70 rounded-lg cursor-pointer"
                >
                  বাতিল
                </button>
                <button
                  onClick={handleBulkEnroll}
                  disabled={submittingEnroll || selectedIds.length === 0}
                  className="px-5 py-2 bg-[#1C7D5A] hover:bg-[#123628] text-white text-sm font-semibold rounded-lg flex items-center gap-2 disabled:opacity-50 cursor-pointer"
                >
                  {submittingEnroll ? <Loader2 className="w-4 h-4 animate-spin" /> : <Check className="w-4 h-4" />}
                  বোর্ডিংয়ে যুক্ত করুন
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Edit Modal */}
      {editingStudent && editForm && (
        <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-4">
          <form
            onSubmit={handleSaveEdit}
            className="bg-white rounded-xl border border-slate-200 shadow-2xl w-full max-w-lg overflow-hidden"
          >
            <div className="px-6 py-4 bg-[#123628] text-white flex items-center justify-between">
              <div>
                <h3 className="font-bold text-base">বোর্ডিং প্যাকেজ এডিট</h3>
                <p className="text-xs text-white/75">{editingStudent.student_name}</p>
              </div>
              <button
                type="button"
                onClick={() => setEditingStudent(null)}
                className="p-1.5 hover:bg-white/10 rounded-lg cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="p-6 space-y-4">
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="text-xs font-bold text-slate-600 mb-1 block">আবাসিক ধরন</label>
                  <select
                    value={editForm.residential_type}
                    onChange={(e) => handleResidentialChange(e.target.value, true)}
                    className="w-full px-3 py-2 text-sm border border-slate-200 rounded-lg bg-white"
                  >
                    <option value="Residential">আবাসিক</option>
                    <option value="Non-Residential">অনাবাসিক</option>
                    <option value="Lillah">লিল্লাহ / ফ্রি</option>
                  </select>
                </div>
                <div>
                  <label className="text-xs font-bold text-slate-600 mb-1 block">স্ট্যাটাস</label>
                  <select
                    value={editForm.status}
                    onChange={(e) => setEditForm({ ...editForm, status: e.target.value })}
                    className="w-full px-3 py-2 text-sm border border-slate-200 rounded-lg bg-white"
                  >
                    <option value="Active">সক্রিয় (Active)</option>
                    <option value="Inactive">নিষ্ক্রিয় (Inactive)</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="text-xs font-bold text-slate-600 mb-1 block">মিল প্যাকেজ</label>
                <select
                  value={editForm.meal_plan_id}
                  onChange={(e) => handlePlanChange(e.target.value, true)}
                  className="w-full px-3 py-2 text-sm border border-slate-200 rounded-lg bg-white"
                >
                  {MEAL_PLANS.map((p) => (
                    <option key={p.id} value={p.id}>
                      {p.name}
                    </option>
                  ))}
                </select>
              </div>

              <div className="flex items-center gap-4 p-3 bg-slate-50 rounded-lg border border-slate-200">
                <span className="text-xs font-bold text-slate-600">বরাদ্দকৃত বেলা:</span>
                {["breakfast", "lunch", "dinner"].map((meal) => (
                  <label key={meal} className="inline-flex items-center gap-1.5 text-xs font-semibold cursor-pointer">
                    <input
                      type="checkbox"
                      checked={Boolean(editForm.allowed_meals?.[meal])}
                      onChange={(e) =>
                        setEditForm({
                          ...editForm,
                          allowed_meals: { ...editForm.allowed_meals, [meal]: e.target.checked },
                        })
                      }
                      className="accent-[#1C7D5A] w-4 h-4"
                    />
                    {meal === "breakfast" ? "সকাল" : meal === "lunch" ? "দুপুর" : "রাত"}
                  </label>
                ))}
              </div>

              <div className="grid grid-cols-3 gap-3">
                <div>
                  <label className="text-xs font-bold text-slate-600 mb-1 block">মাসিক ফি (৳)</label>
                  <input
                    type="number"
                    min={0}
                    disabled={editForm.residential_type === "Lillah"}
                    value={editForm.monthly_fee}
                    onChange={(e) => setEditForm({ ...editForm, monthly_fee: Number(e.target.value) })}
                    className="w-full px-3 py-2 text-sm border border-slate-200 rounded-lg"
                  />
                </div>
                <div>
                  <label className="text-xs font-bold text-slate-600 mb-1 block">ছাড় (%)</label>
                  <input
                    type="number"
                    min={0}
                    max={100}
                    disabled={editForm.residential_type === "Lillah"}
                    value={editForm.waiver_percent}
                    onChange={(e) => setEditForm({ ...editForm, waiver_percent: Number(e.target.value) })}
                    className="w-full px-3 py-2 text-sm border border-slate-200 rounded-lg"
                  />
                </div>
                <div>
                  <label className="text-xs font-bold text-slate-600 mb-1 block">বিলিং মোড</label>
                  <select
                    value={editForm.billing_mode}
                    onChange={(e) => setEditForm({ ...editForm, billing_mode: e.target.value })}
                    className="w-full px-3 py-2 text-sm border border-slate-200 rounded-lg bg-white"
                  >
                    <option value="Fixed">ফিক্সড</option>
                    <option value="MealRate">মিল-রেট</option>
                  </select>
                </div>
              </div>
            </div>

            <div className="px-6 py-4 border-t border-slate-200 bg-slate-50 flex justify-end gap-3">
              <button
                type="button"
                onClick={() => setEditingStudent(null)}
                className="px-4 py-2 text-sm font-semibold text-slate-600 hover:bg-slate-200/70 rounded-lg cursor-pointer"
              >
                বাতিল
              </button>
              <button
                type="submit"
                disabled={savingEdit}
                className="px-5 py-2 bg-[#1C7D5A] hover:bg-[#123628] text-white text-sm font-semibold rounded-lg flex items-center gap-2 cursor-pointer"
              >
                {savingEdit ? <Loader2 className="w-4 h-4 animate-spin" /> : <Check className="w-4 h-4" />}
                আপডেট করুন
              </button>
            </div>
          </form>
        </div>
      )}
    </div>
  );
};

export default BoardingStudentsPage;
