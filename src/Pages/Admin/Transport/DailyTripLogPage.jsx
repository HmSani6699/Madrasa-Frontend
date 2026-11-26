import { useState, useEffect, useCallback } from "react";
import {
  ClipboardList,
  Search,
  Bus,
  CheckCircle2,
  XCircle,
  Clock,
  Loader2,
  Printer,
  Sunrise,
  Sunset,
} from "lucide-react";
import { toast } from "react-hot-toast";
import transportService from "../../../services/transportService";
import { TRIP_STATUS_OPTIONS, getTodayDateStr } from "./transportConstants";
import TransportPageHeader from "./TransportPageHeader";
import TransportKpiCards from "./TransportKpiCards";

const DailyTripLogPage = () => {
  const [selectedDate, setSelectedDate] = useState(getTodayDateStr());
  const [routeFilter, setRouteFilter] = useState("all");
  const [searchTerm, setSearchTerm] = useState("");
  const [loading, setLoading] = useState(true);
  const [roster, setRoster] = useState([]);
  const [routes, setRoutes] = useState([]);
  const [summary, setSummary] = useState({
    total: 0,
    pickupBoarded: 0,
    pickupDropped: 0,
    pickupAbsent: 0,
    returnBoarded: 0,
    returnDropped: 0,
    returnAbsent: 0,
  });

  const fetchTrips = useCallback(async () => {
    try {
      setLoading(true);
      const res = await transportService.getDailyTrips({
        date: selectedDate,
        route_id: routeFilter,
        search: searchTerm,
      });
      if (res.success) {
        setRoster(res.data?.roster || []);
        setRoutes(res.data?.routes || []);
        setSummary(res.data?.summary || {});
      }
    } catch {
      toast.error("দৈনিক ট্রিপ তথ্য লোড ব্যর্থ হয়েছে");
    } finally {
      setLoading(false);
    }
  }, [selectedDate, routeFilter, searchTerm]);

  useEffect(() => {
    fetchTrips();
  }, [fetchTrips]);

  const handleStatusChange = async (studentId, trip, status) => {
    try {
      await transportService.updateTripStatus({
        date: selectedDate,
        student_id: studentId,
        trip,
        status,
      });
      fetchTrips();
    } catch {
      toast.error("স্ট্যাটাস আপডেট ব্যর্থ হয়েছে");
    }
  };

  const handleBulkStatus = async (trip, status) => {
    try {
      const res = await transportService.bulkUpdateTripStatus({
        date: selectedDate,
        route_id: routeFilter,
        trip,
        status,
      });
      toast.success(res.message || "সবার স্ট্যাটাস আপডেট হয়েছে");
      fetchTrips();
    } catch {
      toast.error("বাল্ক আপডেট ব্যর্থ হয়েছে");
    }
  };

  const kpiCards = [
    {
      title: "মোট নির্ধারিত ছাত্র",
      value: `${summary.total || 0} জন`,
      subtitle: `তারিখ: ${selectedDate}`,
      icon: Bus,
      color: "text-emerald-600",
      bg: "bg-emerald-50",
    },
    {
      title: "সকাল পিকআপ (আসা)",
      value: `${(summary.pickupBoarded || 0) + (summary.pickupDropped || 0)} জন`,
      subtitle: `গাড়িতে: ${summary.pickupBoarded || 0} | পৌঁছেছে: ${summary.pickupDropped || 0}`,
      icon: Sunrise,
      color: "text-amber-600",
      bg: "bg-amber-50",
    },
    {
      title: "বিকাল রিটার্ন (যাওয়া)",
      value: `${(summary.returnBoarded || 0) + (summary.returnDropped || 0)} জন`,
      subtitle: `গাড়িতে: ${summary.returnBoarded || 0} | বাসায়: ${summary.returnDropped || 0}`,
      icon: Sunset,
      color: "text-blue-600",
      bg: "bg-blue-50",
    },
    {
      title: "অনুপস্থিত",
      value: `${summary.pickupAbsent || 0} / ${summary.returnAbsent || 0}`,
      subtitle: "সকাল অনুপস্থিত / বিকাল অনুপস্থিত",
      icon: XCircle,
      color: "text-rose-600",
      bg: "bg-rose-50",
    },
  ];

  const getBadgeStyle = (val) => {
    return (
      TRIP_STATUS_OPTIONS.find((o) => o.value === val)?.className ||
      "bg-slate-100 text-slate-600 border-slate-200"
    );
  };

  return (
    <div className="space-y-5 animate-in fade-in duration-500">
      <TransportPageHeader
        title="দৈনিক পিকআপ ও ড্রপ ট্রিপ লগ"
        subtitle="সকালের পিকআপ এবং বিকালের রিটার্ন ট্রিপে প্রতিটি ছাত্রের অবস্থান ও উপস্থিতি রেকর্ড করুন"
        icon={ClipboardList}
        rightActions={
          <button
            type="button"
            onClick={() => window.print()}
            className="px-4 py-2.5 bg-white border border-slate-200 hover:border-[#1C7D5A] text-slate-700 rounded-lg text-sm font-bold flex items-center gap-1.5 shadow-sm cursor-pointer print:hidden"
          >
            <Printer className="w-4 h-4 text-[#1C7D5A]" />
            ট্রিপ শিট প্রিন্ট
          </button>
        }
      />

      <TransportKpiCards cards={kpiCards} />

      {/* Controls */}
      <div className="bg-white rounded-lg border border-slate-200 p-4 shadow-sm space-y-3 print:hidden">
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
          <input
            type="date"
            value={selectedDate}
            onChange={(e) => setSelectedDate(e.target.value)}
            className="px-3 py-2 border border-slate-200 rounded-lg text-sm font-semibold outline-none focus:border-[#1C7D5A]"
          />
          <select
            value={routeFilter}
            onChange={(e) => setRouteFilter(e.target.value)}
            className="px-3 py-2 border border-slate-200 rounded-lg text-sm outline-none focus:border-[#1C7D5A]"
          >
            <option value="all">সকল সক্রিয় রুট</option>
            {routes.map((r) => (
              <option key={r._id} value={r._id}>
                {r.route_name}
              </option>
            ))}
          </select>
          <div className="relative">
            <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
            <input
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              placeholder="ছাত্রের নাম, আইডি বা স্টপেজ..."
              className="w-full pl-9 pr-3 py-2 border border-slate-200 rounded-lg text-sm outline-none focus:border-[#1C7D5A]"
            />
          </div>
        </div>

        {/* Quick Bulk Actions */}
        <div className="flex flex-wrap items-center gap-2 pt-2 border-t border-slate-100">
          <span className="text-xs font-bold text-slate-500 mr-1">দ্রুত আপডেট:</span>
          <button
            type="button"
            onClick={() => handleBulkStatus("pickup", "boarded")}
            className="px-3 py-1.5 rounded-lg bg-blue-50 text-blue-700 hover:bg-blue-100 text-xs font-bold cursor-pointer"
          >
            সকাল: সবাই গাড়িতে উঠেছে
          </button>
          <button
            type="button"
            onClick={() => handleBulkStatus("pickup", "dropped")}
            className="px-3 py-1.5 rounded-lg bg-emerald-50 text-emerald-700 hover:bg-emerald-100 text-xs font-bold cursor-pointer"
          >
            সকাল: মাদ্রাসায় পৌঁছেছে
          </button>
          <button
            type="button"
            onClick={() => handleBulkStatus("return", "boarded")}
            className="px-3 py-1.5 rounded-lg bg-indigo-50 text-indigo-700 hover:bg-indigo-100 text-xs font-bold cursor-pointer"
          >
            বিকাল: রিটার্ন গাড়িতে উঠেছে
          </button>
          <button
            type="button"
            onClick={() => handleBulkStatus("return", "dropped")}
            className="px-3 py-1.5 rounded-lg bg-teal-50 text-teal-700 hover:bg-teal-100 text-xs font-bold cursor-pointer"
          >
            বিকাল: বাসায় পৌঁছেছে
          </button>
        </div>
      </div>

      {/* Roster Table */}
      <div className="bg-white rounded-lg border border-slate-200 shadow-sm overflow-x-auto">
        {loading ? (
          <div className="p-12 text-center">
            <Loader2 className="w-7 h-7 animate-spin mx-auto text-[#1C7D5A] mb-2" />
            <p className="text-sm text-slate-500">ট্রিপ তালিকা লোড হচ্ছে...</p>
          </div>
        ) : roster.length === 0 ? (
          <div className="p-12 text-center">
            <Clock className="w-10 h-10 text-slate-300 mx-auto mb-2" />
            <p className="text-sm font-bold text-slate-600">এই রুটে কোনো সক্রিয় ছাত্র পাওয়া যায়নি</p>
          </div>
        ) : (
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-slate-50 border-b border-slate-200 text-xs font-bold text-slate-600">
                <th className="py-3 px-4">ছাত্র ও শ্রেণি</th>
                <th className="py-3 px-4">রুট ও স্টপেজ</th>
                <th className="py-3 px-4">অভিভাবক ফোন</th>
                <th className="py-3 px-4">সকাল পিকআপ (আসা)</th>
                <th className="py-3 px-4">বিকাল রিটার্ন (যাওয়া)</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 text-sm">
              {roster.map((r) => (
                <tr key={r._id} className="hover:bg-slate-50/60">
                  <td className="py-3 px-4">
                    <div className="font-bold text-slate-800">{r.student_name}</div>
                    <div className="text-xs text-slate-500">
                      {r.class_name} • রোল: {r.roll_number || "—"}
                    </div>
                  </td>
                  <td className="py-3 px-4">
                    <div className="font-semibold text-slate-700">{r.route_name || "—"}</div>
                    <div className="text-xs text-slate-500">
                      স্টপেজ: {r.stoppage || "—"} {r.vehicle_no ? `(${r.vehicle_no})` : ""}
                    </div>
                  </td>
                  <td className="py-3 px-4 text-xs font-semibold text-slate-600">
                    {r.guardian_contact || "—"}
                  </td>
                  <td className="py-3 px-4">
                    {r.trip_type === "Drop" ? (
                      <span className="text-xs text-slate-400">শুধু যাওয়া</span>
                    ) : (
                      <div className="flex items-center gap-2">
                        <select
                          value={r.pickup_status}
                          onChange={(e) => handleStatusChange(r.student_id, "pickup", e.target.value)}
                          className={`px-2.5 py-1 rounded-lg text-xs font-bold border outline-none cursor-pointer ${getBadgeStyle(
                            r.pickup_status
                          )}`}
                        >
                          {TRIP_STATUS_OPTIONS.map((opt) => (
                            <option key={opt.value} value={opt.value}>
                              {opt.label}
                            </option>
                          ))}
                        </select>
                        {r.pickup_time && (
                          <span className="text-[11px] text-slate-400 flex items-center gap-0.5">
                            <CheckCircle2 className="w-3 h-3 text-emerald-500" />
                            {r.pickup_time}
                          </span>
                        )}
                      </div>
                    )}
                  </td>
                  <td className="py-3 px-4">
                    {r.trip_type === "Pickup" ? (
                      <span className="text-xs text-slate-400">শুধু আসা</span>
                    ) : (
                      <div className="flex items-center gap-2">
                        <select
                          value={r.return_status}
                          onChange={(e) => handleStatusChange(r.student_id, "return", e.target.value)}
                          className={`px-2.5 py-1 rounded-lg text-xs font-bold border outline-none cursor-pointer ${getBadgeStyle(
                            r.return_status
                          )}`}
                        >
                          {TRIP_STATUS_OPTIONS.map((opt) => (
                            <option key={opt.value} value={opt.value}>
                              {opt.label}
                            </option>
                          ))}
                        </select>
                        {r.return_time && (
                          <span className="text-[11px] text-slate-400 flex items-center gap-0.5">
                            <CheckCircle2 className="w-3 h-3 text-emerald-500" />
                            {r.return_time}
                          </span>
                        )}
                      </div>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>
    </div>
  );
};

export default DailyTripLogPage;
