import { useState, useEffect, useCallback, useMemo, useRef } from "react";
import {
  Search,
  Calendar,
  CheckCircle2,
  UserPlus,
  Trash2,
  CheckCheck,
  Loader2,
  Download,
  ChevronDown,
  FileSpreadsheet,
  X,
} from "lucide-react";
import { toast } from "react-hot-toast";
import boardingService from "../../../services/boardingService";
import axiosInstance from "../../../api/axiosInstance";
import endpoints from "../../../api/endpoints";
import { RESIDENTIAL_BADGE } from "./boardingConstants";
import {
  MEAL_COLUMNS,
  computeRosterMetrics,
  buildRosterCsv,
  exportStyledExcel,
} from "./rosterExportUtils";

const MealSwitch = ({ checked, onChange, disabled }) => (
  <button
    type="button"
    disabled={disabled}
    onClick={onChange}
    className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors cursor-pointer ${checked ? "bg-[#1C7D5A]" : "bg-slate-300"
      } ${disabled ? "opacity-50 cursor-not-allowed" : ""}`}
    aria-pressed={checked}
  >
    <span
      className={`inline-block h-4 w-4 transform rounded-full bg-white shadow transition-transform ${checked ? "translate-x-6" : "translate-x-1"
        }`}
    />
  </button>
);

const DailyRosterTab = ({
  selectedDate,
  onDateChange,
  onRefreshDashboard,
  isGuestModalOpen = false,
  onCloseGuestModal,
}) => {
  const [loading, setLoading] = useState(true);
  const [rosterData, setRosterData] = useState({
    roster: [],
    guestMeals: [],
    summary: {},
    todayMenu: [],
    weekday: "",
  });
  const [searchTerm, setSearchTerm] = useState("");
  const [classFilter, setClassFilter] = useState("all");
  const [mealTypeFilter, setMealTypeFilter] = useState("all");
  const [apiClasses, setApiClasses] = useState([]);
  const [togglingKey, setTogglingKey] = useState(null);
  const [isExportMenuOpen, setIsExportMenuOpen] = useState(false);
  const exportMenuRef = useRef(null);

  // Guest Meal Form
  const [guestForm, setGuestForm] = useState({
    guest_name: "",
    guest_type: "Guest",
    breakfast: 0,
    lunch: 1,
    dinner: 0,
    count: 1,
    note: "",
  });
  const [addingGuest, setAddingGuest] = useState(false);

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
        // Fallback to classes present in roster rows
      });
    return () => {
      active = false;
    };
  }, []);

  const fetchRoster = useCallback(async () => {
    try {
      setLoading(true);
      const res = await boardingService.getDailyRoster({
        date: selectedDate,
      });
      if (res.success) {
        setRosterData(res.data);
      }
    } catch (err) {
      toast.error("ডেইলি মিল রোস্টার লোড করতে সমস্যা হয়েছে");
      console.error(err);
    } finally {
      setLoading(false);
    }
  }, [selectedDate]);

  useEffect(() => {
    fetchRoster();
  }, [fetchRoster]);

  useEffect(() => {
    if (!isGuestModalOpen) return;
    const handleKeyDown = (e) => {
      if (e.key === "Escape") onCloseGuestModal?.();
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [isGuestModalOpen, onCloseGuestModal]);

  const handleToggle = async (studentId, meal, currentVal) => {
    const nextVal = currentVal ? 0 : 1;
    const key = `${studentId}-${meal}`;
    setTogglingKey(key);

    // Optimistic update
    setRosterData((prev) => ({
      ...prev,
      roster: prev.roster.map((row) =>
        row.student_id === studentId
          ? {
            ...row,
            [meal]: nextVal,
            ...(nextVal === 0 ? { [`${meal}_delivered`]: false } : {}),
          }
          : row
      ),
    }));

    try {
      await boardingService.toggleMeal({
        date: selectedDate,
        student_id: studentId,
        meal,
        value: nextVal,
      });
      fetchRoster();
      onRefreshDashboard?.();
    } catch {
      toast.error("মিল স্ট্যাটাস পরিবর্তন করা যায়নি");
      fetchRoster();
    } finally {
      setTogglingKey(null);
    }
  };

  const handleDeliverSingle = async (studentId, meal, currentDelivered) => {
    try {
      await boardingService.deliverMeals({
        date: selectedDate,
        meal,
        student_id: studentId,
        delivered: !currentDelivered,
        mark_all: false,
      });
      fetchRoster();
      onRefreshDashboard?.();
    } catch {
      toast.error("ডেলিভারি মার্ক করতে সমস্যা হয়েছে");
    }
  };

  const classOptions = useMemo(() => {
    const names = new Set(apiClasses);
    for (const row of rosterData.roster) {
      names.add(row.class_name || "N/A");
    }
    return Array.from(names).sort((a, b) =>
      a.localeCompare(b, undefined, { numeric: true })
    );
  }, [apiClasses, rosterData.roster]);

  const activeMeal = useMemo(
    () => (mealTypeFilter.startsWith("meal:") ? mealTypeFilter.slice(5) : null),
    [mealTypeFilter]
  );

  const visibleMeals = useMemo(
    () => (activeMeal ? MEAL_COLUMNS.filter((m) => m.key === activeMeal) : MEAL_COLUMNS),
    [activeMeal]
  );

  const filteredRoster = useMemo(() => {
    const q = searchTerm.trim().toLowerCase();
    return rosterData.roster.filter((row) => {
      if (classFilter !== "all" && (row.class_name || "N/A") !== classFilter) {
        return false;
      }
      if (mealTypeFilter.startsWith("res:")) {
        const resType = mealTypeFilter.slice(4);
        if (row.residential_type !== resType) return false;
      } else if (activeMeal) {
        const hasMeal =
          Number(row[activeMeal] || 0) === 1 || Boolean(row.allowed_meals?.[activeMeal]);
        if (!hasMeal) return false;
      }
      if (q) {
        const haystack = [row.student_name, row.student_code, row.roll_number, row.class_name]
          .filter(Boolean)
          .join(" ")
          .toLowerCase();
        if (!haystack.includes(q)) return false;
      }
      return true;
    });
  }, [rosterData.roster, classFilter, mealTypeFilter, activeMeal, searchTerm]);

  const metrics = useMemo(
    () => computeRosterMetrics(filteredRoster, visibleMeals),
    [filteredRoster, visibleMeals]
  );

  const handleDeliverAll = async (meal, delivered = true) => {
    const targetIds = filteredRoster.map((r) => r.student_id);
    if (targetIds.length === 0) return;

    try {
      await boardingService.deliverMeals({
        date: selectedDate,
        meal,
        delivered,
        mark_all: true,
        student_ids: targetIds,
      });
      toast.success(
        delivered
          ? "ফিল্টারকৃত সকল চালু মিল উপস্থিত হিসেবে চিহ্নিত হয়েছে"
          : "ফিল্টারকৃত মিলের উপস্থিতি বাতিল করা হয়েছে"
      );
      fetchRoster();
      onRefreshDashboard?.();
    } catch {
      toast.error("বাল্ক অ্যাটেনডেন্স আপডেট ব্যর্থ হয়েছে");
    }
  };

  const getExportBaseFilename = () => {
    const safeClass =
      classFilter === "all" ? "" : `-${classFilter.replace(/[^\w\u0980-\u09FF-]+/g, "_")}`;
    return `meal-attendance-${selectedDate}${safeClass}`;
  };

  useEffect(() => {
    if (!isExportMenuOpen) return;
    const handleOutsideClick = (e) => {
      if (exportMenuRef.current && !exportMenuRef.current.contains(e.target)) {
        setIsExportMenuOpen(false);
      }
    };
    window.addEventListener("mousedown", handleOutsideClick);
    return () => window.removeEventListener("mousedown", handleOutsideClick);
  }, [isExportMenuOpen]);

  const handleExportExcel = () => {
    if (filteredRoster.length === 0 && (rosterData.guestMeals?.length || 0) === 0) {
      toast.error("এক্সপোর্ট করার মতো কোনো তথ্য পাওয়া যায়নি");
      return;
    }
    setIsExportMenuOpen(false);
    exportStyledExcel({
      selectedDate,
      weekday: rosterData.weekday,
      classFilter,
      mealTypeFilter,
      searchTerm,
      rows: filteredRoster,
      guestMeals: rosterData.guestMeals || [],
      visibleMeals,
      metrics,
      filename: `${getExportBaseFilename()}.xlsx`,
    });
    toast.success("ডিজাইন করা Excel রিপোর্ট ডাউনলোড হয়েছে");
  };

  const handleExportCSV = () => {
    if (filteredRoster.length === 0 && (rosterData.guestMeals?.length || 0) === 0) {
      toast.error("এক্সপোর্ট করার মতো কোনো তথ্য পাওয়া যায়নি");
      return;
    }
    setIsExportMenuOpen(false);
    const csvContent = buildRosterCsv({
      selectedDate,
      weekday: rosterData.weekday,
      classFilter,
      mealTypeFilter,
      searchTerm,
      rows: filteredRoster,
      guestMeals: rosterData.guestMeals || [],
      visibleMeals,
      metrics,
    });

    const blob = new Blob([csvContent], { type: "text/csv;charset=utf-8;" });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.setAttribute("download", `${getExportBaseFilename()}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
    toast.success("CSV রিপোর্ট ডাউনলোড হয়েছে");
  };

  const handleAddGuestMeal = async (e) => {
    e.preventDefault();
    if (!guestForm.guest_name.trim()) {
      return toast.error("মেহমান বা শিক্ষকের নাম লিখুন");
    }
    if (!guestForm.breakfast && !guestForm.lunch && !guestForm.dinner) {
      return toast.error("কমপক্ষে এক বেলার মিল নির্বাচন করুন");
    }

    try {
      setAddingGuest(true);
      await boardingService.addGuestMeal({
        ...guestForm,
        date: selectedDate,
        count: Number(guestForm.count) || 1,
      });
      toast.success("অতিথি মিল যুক্ত করা হয়েছে");
      setGuestForm({
        guest_name: "",
        guest_type: "Guest",
        breakfast: 0,
        lunch: 1,
        dinner: 0,
        count: 1,
        note: "",
      });
      fetchRoster();
      onRefreshDashboard?.();
      onCloseGuestModal?.();
    } catch (err) {
      toast.error(err.response?.data?.message || "অতিথি মিল যোগ করতে সমস্যা হয়েছে");
    } finally {
      setAddingGuest(false);
    }
  };

  const handleDeleteGuest = async (id) => {
    try {
      await boardingService.deleteGuestMeal(id);
      toast.success("অতিথি মিল মুছে ফেলা হয়েছে");
      fetchRoster();
      onRefreshDashboard?.();
    } catch {
      toast.error("মুছতে সমস্যা হয়েছে");
    }
  };

  return (
    <div className="space-y-6">

      {/* Filters & Export CSV */}
      <div className="space-y-4">
        <div className="flex flex-col lg:flex-row gap-3 items-stretch lg:items-center lg:justify-between">
          <div className="relative flex-1 w-full lg:max-w-[300px]">
            <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              placeholder="ছাত্রের নাম, আইডি বা রোল খুঁজুন..."
              className="w-full pl-9 pr-3 py-2 text-sm bg-white border border-slate-200 rounded-lg focus:outline-none focus:border-[#1C7D5A]"
            />
          </div>

          <div className="flex flex-wrap items-center gap-2.5">
            <div className="flex items-center gap-2 px-3 py-2 bg-emerald-50/70 border border-emerald-200 rounded-lg">
              <Calendar className="w-4 h-4 text-[#1C7D5A] shrink-0" />
              <input
                type="date"
                value={selectedDate}
                onChange={(e) => onDateChange(e.target.value)}
                className="text-sm font-semibold text-slate-700 bg-transparent focus:outline-none cursor-pointer"
                aria-label="তারিখ নির্বাচন করুন"
              />
            </div>

            <select
              value={classFilter}
              onChange={(e) => setClassFilter(e.target.value)}
              aria-label="ক্লাস ফিল্টার"
              className="px-3 py-2 text-sm font-semibold text-slate-700 bg-emerald-50/70 border border-emerald-200 rounded-lg focus:outline-none focus:border-[#1C7D5A] cursor-pointer"
            >
              <option value="all">সকল ক্লাস</option>
              {classOptions.map((cls) => (
                <option key={cls} value={cls}>
                  {cls}
                </option>
              ))}
            </select>

            <select
              value={mealTypeFilter}
              onChange={(e) => setMealTypeFilter(e.target.value)}
              aria-label="মিল ধরন ফিল্টার"
              className="px-3 py-2 text-sm font-semibold text-slate-700 bg-emerald-50/70 border border-emerald-200 rounded-lg focus:outline-none focus:border-[#1C7D5A] cursor-pointer"
            >
              <option value="all">সকল মিল (সব ধরন)</option>
              <optgroup label="মিল বেলা অনুযায়ী">
                <option value="meal:breakfast">সকাল (Breakfast)</option>
                <option value="meal:lunch">দুপুর (Lunch)</option>
                <option value="meal:dinner">রাত (Dinner)</option>
              </optgroup>
              <optgroup label="ছাত্রের ধরন অনুযায়ী">
                <option value="res:Residential">আবাসিক (Residential)</option>
                <option value="res:Non-Residential">অনাবাসিক (Non-Residential)</option>
                <option value="res:Lillah">লিল্লাহ / ফ্রি (Lillah)</option>
              </optgroup>
            </select>

            <div className="relative" ref={exportMenuRef}>
              <div className="inline-flex rounded-lg shadow-sm overflow-hidden">
                <button
                  type="button"
                  onClick={handleExportExcel}
                  disabled={loading || (filteredRoster.length === 0 && (rosterData.guestMeals?.length || 0) === 0)}
                  className="px-3.5 py-2 text-sm font-semibold bg-[#1C7D5A] hover:bg-[#123628] text-white transition-colors flex items-center gap-1.5 cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  <FileSpreadsheet className="w-4 h-4" />
                  Export Excel
                </button>
                <button
                  type="button"
                  onClick={() => setIsExportMenuOpen((prev) => !prev)}
                  disabled={loading || (filteredRoster.length === 0 && (rosterData.guestMeals?.length || 0) === 0)}
                  aria-label="এক্সপোর্ট ফরম্যাট নির্বাচন করুন"
                  className="px-2 py-2 bg-[#166649] hover:bg-[#123628] text-white border-l border-white/20 transition-colors cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  <ChevronDown className="w-4 h-4" />
                </button>
              </div>

              {isExportMenuOpen && (
                <div className="absolute right-0 mt-1.5 w-52 bg-white border border-slate-200 rounded-lg shadow-lg z-30 py-1">
                  <button
                    type="button"
                    onClick={handleExportExcel}
                    className="w-full px-3.5 py-2 text-left text-xs font-semibold text-slate-700 hover:bg-emerald-50 hover:text-[#123628] flex items-center gap-2 cursor-pointer"
                  >
                    <FileSpreadsheet className="w-4 h-4 text-[#1C7D5A]" />
                    Excel (.xlsx) — ডিজাইনসহ
                  </button>
                  <button
                    type="button"
                    onClick={handleExportCSV}
                    className="w-full px-3.5 py-2 text-left text-xs font-semibold text-slate-700 hover:bg-emerald-50 hover:text-[#123628] flex items-center gap-2 cursor-pointer"
                  >
                    <Download className="w-4 h-4 text-slate-500" />
                    CSV (.csv) — ক্লিন ফরম্যাট
                  </button>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Daily Meal Attendance Table */}
        <div className="overflow-x-auto border border-slate-200 rounded-lg bg-white">
          <table className="w-full text-sm text-left">
            <thead className="bg-slate-50 text-slate-700 border-b border-slate-200">
              <tr>
                <th className="py-3 px-4 font-bold">ছাত্রের তথ্য</th>
                <th className="py-3 px-3 font-bold">ধরন / প্যাকেজ</th>
                {visibleMeals.map((meal) => {
                  const totalOn = metrics.totals[meal.key] || 0;
                  const totalDelivered = metrics.totals[`${meal.key}Delivered`] || 0;
                  const allVisibleDelivered = totalOn > 0 && totalDelivered === totalOn;

                  return (
                    <th key={meal.key} className="py-3 px-3 font-bold text-center">
                      <div className="inline-flex items-center gap-1.5">
                        <span>
                          {meal.label} ({totalOn})
                        </span>
                        {totalOn > 0 && (
                          <button
                            type="button"
                            onClick={() => handleDeliverAll(meal.key, !allVisibleDelivered)}
                            title={
                              allVisibleDelivered
                                ? `${meal.label} এর সবার উপস্থিতি বাতিল করুন`
                                : `${meal.label} এর ফিল্টারকৃত সবার উপস্থিতি মার্ক করুন`
                            }
                            className={`p-1 rounded border transition-colors cursor-pointer ${allVisibleDelivered
                              ? "bg-emerald-100 border-emerald-300 text-emerald-800"
                              : "bg-white border-slate-200 text-slate-500 hover:text-[#1C7D5A] hover:border-emerald-300"
                              }`}
                          >
                            <CheckCheck className="w-3.5 h-3.5" />
                          </button>
                        )}
                      </div>
                    </th>
                  );
                })}
                <th className="py-3 px-3 font-bold text-center">মোট</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {loading ? (
                <tr>
                  <td colSpan={3 + visibleMeals.length} className="py-10 text-center text-slate-500">
                    <Loader2 className="w-6 h-6 animate-spin mx-auto text-[#1C7D5A] mb-2" />
                    লোড হচ্ছে...
                  </td>
                </tr>
              ) : filteredRoster.length === 0 ? (
                <tr>
                  <td colSpan={3 + visibleMeals.length} className="py-10 text-center text-slate-500">
                    {rosterData.roster.length === 0
                      ? 'কোনো সক্রিয় বোর্ডিং ছাত্র পাওয়া যায়নি। "বোর্ডিং ছাত্র তালিকা" ট্যাব থেকে ছাত্র যুক্ত করুন।'
                      : "নির্বাচিত ফিল্টার অনুযায়ী কোনো ছাত্র পাওয়া যায়নি।"}
                  </td>
                </tr>
              ) : (
                filteredRoster.map((row) => {
                  const badge = RESIDENTIAL_BADGE[row.residential_type] || RESIDENTIAL_BADGE.Residential;
                  const totalForRow = visibleMeals.reduce(
                    (sum, m) => sum + (Number(row[m.key] || 0) === 1 ? 1 : 0),
                    0
                  );

                  return (
                    <tr key={row.student_id} className="hover:bg-slate-50/70 transition-colors">
                      <td className="py-3 px-4">
                        <div className="font-semibold text-slate-800">{row.student_name}</div>
                        <div className="text-xs text-slate-500">
                          {row.class_name} {row.roll_number ? `| রোল: ${row.roll_number}` : ""}{" "}
                          {row.student_code ? `| ${row.student_code}` : ""}
                        </div>
                      </td>
                      <td className="py-3 px-3">
                        <span
                          className={`inline-block text-[11px] font-bold px-2 py-0.5 rounded-full border ${badge.className}`}
                        >
                          {badge.label}
                        </span>
                        <div className="text-[11px] text-slate-500 mt-0.5">{row.meal_plan_name}</div>
                      </td>

                      {visibleMeals.map(({ key }) => {
                        const isOn = Number(row[key]) === 1;
                        const isDelivered = Boolean(row[`${key}_delivered`]);
                        return (
                          <td key={key} className="py-3 px-3 text-center">
                            <div className="inline-flex items-center gap-2">
                              <MealSwitch
                                checked={isOn}
                                disabled={togglingKey === `${row.student_id}-${key}`}
                                onChange={() => handleToggle(row.student_id, key, isOn)}
                              />
                              {isOn && (
                                <button
                                  type="button"
                                  onClick={() => handleDeliverSingle(row.student_id, key, isDelivered)}
                                  title={isDelivered ? "উপস্থিতি সম্পন্ন (ডেলিভার্ড)" : "উপস্থিতি মার্ক করুন"}
                                  className={`p-1 rounded-md border transition-colors cursor-pointer ${isDelivered
                                    ? "bg-emerald-50 border-emerald-300 text-emerald-700"
                                    : "bg-white border-slate-200 text-slate-400 hover:text-slate-600"
                                    }`}
                                >
                                  <CheckCircle2 className="w-4 h-4" />
                                </button>
                              )}
                            </div>
                          </td>
                        );
                      })}

                      <td className="py-3 px-3 text-center">
                        <span className="font-bold text-slate-800 bg-slate-100 px-2.5 py-1 rounded-md text-xs">
                          {totalForRow} বেলা
                        </span>
                      </td>
                    </tr>
                  );
                })
              )}
            </tbody>
            {!loading && filteredRoster.length > 0 && (
              <tfoot className="bg-slate-50/90 border-t border-slate-200 text-xs font-bold text-slate-700">
                <tr>
                  <td className="py-2.5 px-4" colSpan={2}>
                    মোট ({metrics.totals.students} জন ছাত্র)
                  </td>
                  {visibleMeals.map((meal) => (
                    <td key={meal.key} className="py-2.5 px-3 text-center">
                      <span>{metrics.totals[meal.key]} মিল</span>
                      <span className="text-emerald-700 ml-1">
                        ({metrics.totals[`${meal.key}Delivered`]} উপস্থিত)
                      </span>
                    </td>
                  ))}
                  <td className="py-2.5 px-3 text-center text-[#123628]">
                    {metrics.totals.totalMeals} বেলা
                  </td>
                </tr>
              </tfoot>
            )}
          </table>
        </div>

        {/* Class-wise Summary Preview */}
        {!loading && metrics.byClass.length > 0 && (
          <div className="bg-slate-50 border border-slate-200 rounded-lg px-4 py-3 flex flex-wrap items-center justify-between gap-2">
            <div className="flex flex-wrap items-center gap-2">
              <span className="text-xs font-bold text-slate-700">ক্লাস অনুযায়ী সারাংশ:</span>
              {metrics.byClass.map((cls) => (
                <span
                  key={cls.className}
                  className="inline-flex items-center gap-1.5 text-xs font-medium bg-white border border-slate-200 text-slate-700 px-2.5 py-1 rounded-md"
                >
                  <span className="font-bold text-slate-800">{cls.className}:</span>
                  <span>{cls.students} জন</span>
                  <span className="text-emerald-700 font-semibold">({cls.totalMeals} বেলা)</span>
                </span>
              ))}
            </div>
            <div className="text-xs font-bold text-[#123628]">
              সর্বমোট: {metrics.totals.students} জন | {metrics.totals.totalMeals} বেলা
            </div>
          </div>
        )}
      </div>

      {/* Guest / Teacher Meal Table */}
      {rosterData.guestMeals?.length > 0 && (
        <div className="bg-white rounded-lg border border-slate-200 p-5 shadow-sm">
          <div className="flex items-center gap-2 mb-4">
            <UserPlus className="w-5 h-5 text-[#1C7D5A]" />
            <h3 className="font-bold text-slate-800 text-base">
              অতিথি, শিক্ষক ও অভিভাবক মিল (Guest Meal)
            </h3>
          </div>

          <div className="overflow-x-auto border border-slate-200 rounded-lg">
            <table className="w-full text-sm text-left">
              <thead className="bg-slate-50 border-b border-slate-200 text-slate-700">
                <tr>
                  <th className="py-2.5 px-4 font-bold">নাম</th>
                  <th className="py-2.5 px-3 font-bold">ধরন</th>
                  <th className="py-2.5 px-3 font-bold text-center">জন</th>
                  <th className="py-2.5 px-3 font-bold text-center">বেলা সমূহ</th>
                  <th className="py-2.5 px-3 font-bold text-right">অ্যাকশন</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {rosterData.guestMeals.map((g) => (
                  <tr key={g._id}>
                    <td className="py-2.5 px-4 font-medium text-slate-800">{g.guest_name}</td>
                    <td className="py-2.5 px-3 text-xs text-slate-600">
                      {g.guest_type === "Teacher"
                        ? "শিক্ষক"
                        : g.guest_type === "Guardian"
                          ? "অভিভাবক"
                          : "মেহমান"}
                    </td>
                    <td className="py-2.5 px-3 text-center font-semibold">{g.count || 1}</td>
                    <td className="py-2.5 px-3 text-center text-xs">
                      {[
                        g.breakfast ? "সকাল" : null,
                        g.lunch ? "দুপুর" : null,
                        g.dinner ? "রাত" : null,
                      ]
                        .filter(Boolean)
                        .join(" + ")}
                    </td>
                    <td className="py-2.5 px-3 text-right">
                      <button
                        onClick={() => handleDeleteGuest(g._id)}
                        className="p-1.5 text-rose-500 hover:bg-rose-50 rounded-lg cursor-pointer"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* Guest / Teacher Meal Modal */}
      {isGuestModalOpen && (
        <div
          className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-4"
          onClick={() => onCloseGuestModal?.()}
        >
          <form
            onSubmit={handleAddGuestMeal}
            onClick={(e) => e.stopPropagation()}
            className="bg-white rounded-[10px] shadow-2xl w-full max-w-lg overflow-hidden"
          >
            <div className="px-6 py-4 bg-[#123628] text-white flex items-center justify-between">
              <div className="flex items-center gap-2.5">
                <UserPlus className="w-5 h-5 text-emerald-300" />
                <div>
                  <h3 className="font-bold text-base">অতিথি, শিক্ষক ও অভিভাবক মিল যোগ করুন</h3>
                  <p className="text-xs text-white/75">তারিখ: {selectedDate}</p>
                </div>
              </div>
              <button
                type="button"
                onClick={() => onCloseGuestModal?.()}
                className="p-1.5 hover:bg-white/10 rounded-lg cursor-pointer"
                aria-label="মডাল বন্ধ করুন"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="p-6 space-y-4">
              <div>
                <label className="text-xs font-bold text-slate-600 mb-1 block">নাম / বিবরণ *</label>
                <input
                  type="text"
                  value={guestForm.guest_name}
                  onChange={(e) => setGuestForm({ ...guestForm, guest_name: e.target.value })}
                  placeholder="যেমন: মাওলানা করিম / মেহমান"
                  className="w-full px-3 py-2 text-sm border border-slate-200 rounded-lg focus:outline-none focus:border-[#1C7D5A]"
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="text-xs font-bold text-slate-600 mb-1 block">ধরন</label>
                  <select
                    value={guestForm.guest_type}
                    onChange={(e) => setGuestForm({ ...guestForm, guest_type: e.target.value })}
                    className="w-full px-3 py-2 text-sm border border-slate-200 rounded-lg bg-white focus:outline-none focus:border-[#1C7D5A]"
                  >
                    <option value="Teacher">শিক্ষক / স্টাফ</option>
                    <option value="Guest">মেহমান</option>
                    <option value="Guardian">অভিভাবক</option>
                  </select>
                </div>
                <div>
                  <label className="text-xs font-bold text-slate-600 mb-1 block">জনসংখ্যা</label>
                  <input
                    type="number"
                    min={1}
                    value={guestForm.count}
                    onChange={(e) => setGuestForm({ ...guestForm, count: e.target.value })}
                    className="w-full px-3 py-2 text-sm border border-slate-200 rounded-lg focus:outline-none focus:border-[#1C7D5A]"
                  />
                </div>
              </div>

              <div>
                <label className="text-xs font-bold text-slate-600 mb-2 block">বেলা নির্বাচন করুন *</label>
                <div className="flex items-center gap-5 p-3 bg-slate-50 rounded-lg border border-slate-200">
                  <label className="inline-flex items-center gap-1.5 text-xs font-semibold text-slate-700 cursor-pointer">
                    <input
                      type="checkbox"
                      checked={guestForm.breakfast === 1}
                      onChange={(e) => setGuestForm({ ...guestForm, breakfast: e.target.checked ? 1 : 0 })}
                      className="accent-[#1C7D5A] w-4 h-4"
                    />
                    সকাল
                  </label>
                  <label className="inline-flex items-center gap-1.5 text-xs font-semibold text-slate-700 cursor-pointer">
                    <input
                      type="checkbox"
                      checked={guestForm.lunch === 1}
                      onChange={(e) => setGuestForm({ ...guestForm, lunch: e.target.checked ? 1 : 0 })}
                      className="accent-[#1C7D5A] w-4 h-4"
                    />
                    দুপুর
                  </label>
                  <label className="inline-flex items-center gap-1.5 text-xs font-semibold text-slate-700 cursor-pointer">
                    <input
                      type="checkbox"
                      checked={guestForm.dinner === 1}
                      onChange={(e) => setGuestForm({ ...guestForm, dinner: e.target.checked ? 1 : 0 })}
                      className="accent-[#1C7D5A] w-4 h-4"
                    />
                    রাত
                  </label>
                </div>
              </div>
            </div>

            <div className="px-6 py-4 border-t border-slate-200 bg-slate-50 flex justify-end gap-3">
              <button
                type="button"
                onClick={() => onCloseGuestModal?.()}
                className="px-4 py-2 text-sm font-semibold text-slate-600 hover:bg-slate-200/70 rounded-lg cursor-pointer"
              >
                বাতিল
              </button>
              <button
                type="submit"
                disabled={addingGuest}
                className="py-2 px-5 bg-[#1C7D5A] hover:bg-[#123628] text-white text-sm font-semibold rounded-lg transition-colors flex items-center justify-center gap-1.5 cursor-pointer disabled:opacity-60"
              >
                {addingGuest ? <Loader2 className="w-4 h-4 animate-spin" /> : <UserPlus className="w-4 h-4" />}
                যোগ করুন
              </button>
            </div>
          </form>
        </div>
      )}
    </div>
  );
};

export default DailyRosterTab;
