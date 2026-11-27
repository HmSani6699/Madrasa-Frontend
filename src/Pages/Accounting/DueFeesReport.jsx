import { useState, useEffect, useMemo, useCallback } from "react";
import { useNavigate } from "react-router-dom";
import {
  AlertCircle,
  Search,
  Printer,
  Download,
  FilterX,
  Loader2,
  ChevronLeft,
  ChevronRight,
  Users,
  Wallet,
  UtensilsCrossed,
  Bus,
  ArrowRight,
  Phone,
} from "lucide-react";
import { toast } from "react-hot-toast";
import accountantService from "../../services/accountantService";
import { useAuth } from "../../context/AuthContext";
import { exportToCSV, printHtmlReport, formatBDT } from "../../utils/reportExport";

const ITEMS_PER_PAGE = 15;

const DueFeesReport = () => {
  const { currentMadrasa } = useAuth();
  const navigate = useNavigate();
  const [rows, setRows] = useState([]);
  const [classes, setClasses] = useState([]);
  const [loading, setLoading] = useState(true);

  const [searchTerm, setSearchTerm] = useState("");
  const [selectedClass, setSelectedClass] = useState("all");
  const [dueType, setDueType] = useState("all");
  const [currentPage, setCurrentPage] = useState(1);

  const fetchDueReport = useCallback(async () => {
    setLoading(true);
    try {
      const res = await accountantService.getDueFeesReport({
        class_id: selectedClass,
        due_type: dueType,
      });
      if (res?.success) {
        setRows(res.data || []);
        setClasses(res.classes || []);
      }
    } catch (err) {
      console.error("Due Fees Report Error:", err);
      toast.error(err?.response?.data?.message || "বকেয়া ফি রিপোর্ট লোড করতে সমস্যা হয়েছে");
    } finally {
      setLoading(false);
    }
  }, [selectedClass, dueType]);

  useEffect(() => {
    fetchDueReport();
  }, [fetchDueReport]);

  const filteredRows = useMemo(() => {
    const q = searchTerm.trim().toLowerCase();
    if (!q) return rows;
    return rows.filter(
      (r) =>
        (r.name || "").toLowerCase().includes(q) ||
        (r.student_code || "").toLowerCase().includes(q) ||
        (r.roll_number || "").toLowerCase().includes(q) ||
        (r.guardian_name || "").toLowerCase().includes(q) ||
        (r.guardian_phone || "").toLowerCase().includes(q)
    );
  }, [rows, searchTerm]);

  useEffect(() => {
    setCurrentPage(1);
  }, [searchTerm, selectedClass, dueType]);

  const totals = useMemo(
    () => ({
      students: filteredRows.length,
      tuition: filteredRows.reduce((s, r) => s + Number(r.tuition_due || 0), 0),
      boarding: filteredRows.reduce((s, r) => s + Number(r.boarding_due || 0), 0),
      transport: filteredRows.reduce((s, r) => s + Number(r.transport_due || 0), 0),
      grandTotal: filteredRows.reduce((s, r) => s + Number(r.total_due || 0), 0),
    }),
    [filteredRows]
  );

  const totalPages = Math.max(1, Math.ceil(filteredRows.length / ITEMS_PER_PAGE));
  const paginatedRows = useMemo(() => {
    const start = (currentPage - 1) * ITEMS_PER_PAGE;
    return filteredRows.slice(start, start + ITEMS_PER_PAGE);
  }, [filteredRows, currentPage]);

  const hasActiveFilters = searchTerm || selectedClass !== "all" || dueType !== "all";

  const resetFilters = () => {
    setSearchTerm("");
    setSelectedClass("all");
    setDueType("all");
  };

  const handleExportCSV = () => {
    if (filteredRows.length === 0) {
      toast.error("ডাউনলোড করার মতো কোনো তথ্য নেই");
      return;
    }
    const headers = [
      "ক্রম",
      "আইডি",
      "শিক্ষার্থীর নাম",
      "ক্লাস",
      "রোল",
      "অভিভাবক",
      "মোবাইল",
      "টিউশন/ফি বকেয়া (৳)",
      "বোর্ডিং বকেয়া (৳)",
      "ট্রান্সপোর্ট বকেয়া (৳)",
      "সর্বমোট বকেয়া (৳)",
    ];
    const dataRows = filteredRows.map((r, i) => [
      i + 1,
      r.student_code,
      r.name,
      r.class_name,
      r.roll_number,
      r.guardian_name,
      r.guardian_phone,
      r.tuition_due,
      r.boarding_due,
      r.transport_due,
      r.total_due,
    ]);
    const totalRow = [
      "",
      "",
      `মোট (${totals.students} জন)`,
      "",
      "",
      "",
      "",
      totals.tuition,
      totals.boarding,
      totals.transport,
      totals.grandTotal,
    ];
    exportToCSV({ filename: "due-fees-report", headers, rows: dataRows, totalRow });
  };

  const handlePrint = () => {
    if (filteredRows.length === 0) {
      toast.error("প্রিন্ট করার মতো কোনো তথ্য নেই");
      return;
    }
    printHtmlReport({
      title: "বকেয়া ফি রিপোর্ট (Due Fees Report)",
      subtitle: `মোট বকেয়া শিক্ষার্থী: ${totals.students} জন`,
      madrasaName: currentMadrasa?.name || "মাদ্রাসা ব্যবস্থাপনা",
      madrasaAddress: currentMadrasa?.address || "",
      summaryItems: [
        { label: "বকেয়া শিক্ষার্থী", value: `${totals.students} জন` },
        { label: "টিউশন/একাডেমিক বকেয়া", value: formatBDT(totals.tuition) },
        { label: "বোর্ডিং বকেয়া", value: formatBDT(totals.boarding) },
        { label: "ট্রান্সপোর্ট বকেয়া", value: formatBDT(totals.transport) },
        { label: "সর্বমোট বকেয়া", value: formatBDT(totals.grandTotal) },
      ],
      columns: [
        { label: "ক্রম", align: "center" },
        { label: "আইডি" },
        { label: "শিক্ষার্থীর নাম" },
        { label: "ক্লাস ও রোল" },
        { label: "অভিভাবক ও ফোন" },
        { label: "টিউশন বকেয়া", align: "right" },
        { label: "বোর্ডিং বকেয়া", align: "right" },
        { label: "ট্রান্সপোর্ট বকেয়া", align: "right" },
        { label: "সর্বমোট বকেয়া", align: "right" },
      ],
      rows: filteredRows.map((r, i) => [
        i + 1,
        r.student_code,
        r.name,
        `${r.class_name} (রোল: ${r.roll_number})`,
        `${r.guardian_name} (${r.guardian_phone})`,
        formatBDT(r.tuition_due),
        formatBDT(r.boarding_due),
        formatBDT(r.transport_due),
        formatBDT(r.total_due),
      ]),
    });
  };

  return (
    <div className="space-y-6 pb-16 animate-in fade-in duration-500">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-xl md:text-2xl font-black text-slate-800 flex items-center gap-3">
            <AlertCircle className="w-7 h-7 text-rose-600" />
            বকেয়া ফি রিপোর্ট (Due Fees Report)
          </h1>
          <p className="text-sm text-slate-500 font-semibold mt-1">
            একাডেমিক ফি, বোর্ডিং ও ট্রান্সপোর্ট মিলিয়ে বকেয়া থাকা শিক্ষার্থীদের তালিকা
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-2.5">
          <button
            type="button"
            onClick={handlePrint}
            className="px-4 py-2 bg-white border border-slate-200 hover:border-[#1C7D5A] text-slate-700 rounded-lg font-bold text-xs flex items-center gap-2 shadow-sm cursor-pointer transition-colors"
          >
            <Printer className="w-4 h-4 text-[#1C7D5A]" />
            রিপোর্ট প্রিন্ট
          </button>
          <button
            type="button"
            onClick={handleExportCSV}
            className="px-4 py-2 bg-[#1C7D5A] hover:bg-[#123628] text-white rounded-lg font-bold text-xs flex items-center gap-2 shadow-sm cursor-pointer transition-colors"
          >
            <Download className="w-4 h-4" />
            CSV ডাউনলোড
          </button>
        </div>
      </div>

      {/* KPI Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4">
        <div className="bg-white rounded-lg p-4 shadow-sm border border-slate-200 flex items-center justify-between">
          <div>
            <p className="text-xs font-bold text-slate-400">বকেয়া শিক্ষার্থী</p>
            <p className="text-xl font-black text-slate-800 mt-1">{totals.students} জন</p>
          </div>
          <div className="w-10 h-10 bg-slate-100 text-slate-700 rounded-xl flex items-center justify-center">
            <Users className="w-5 h-5" />
          </div>
        </div>

        <div className="bg-white rounded-lg p-4 shadow-sm border border-slate-200 flex items-center justify-between">
          <div>
            <p className="text-xs font-bold text-slate-400">একাডেমিক / টিউশন</p>
            <p className="text-xl font-black text-amber-600 mt-1">{formatBDT(totals.tuition)}</p>
          </div>
          <div className="w-10 h-10 bg-amber-50 text-amber-600 rounded-xl flex items-center justify-center">
            <Wallet className="w-5 h-5" />
          </div>
        </div>

        <div className="bg-white rounded-lg p-4 shadow-sm border border-slate-200 flex items-center justify-between">
          <div>
            <p className="text-xs font-bold text-slate-400">বোর্ডিং বকেয়া</p>
            <p className="text-xl font-black text-indigo-600 mt-1">{formatBDT(totals.boarding)}</p>
          </div>
          <div className="w-10 h-10 bg-indigo-50 text-indigo-600 rounded-xl flex items-center justify-center">
            <UtensilsCrossed className="w-5 h-5" />
          </div>
        </div>

        <div className="bg-white rounded-lg p-4 shadow-sm border border-slate-200 flex items-center justify-between">
          <div>
            <p className="text-xs font-bold text-slate-400">ট্রান্সপোর্ট বকেয়া</p>
            <p className="text-xl font-black text-sky-600 mt-1">{formatBDT(totals.transport)}</p>
          </div>
          <div className="w-10 h-10 bg-sky-50 text-sky-600 rounded-xl flex items-center justify-center">
            <Bus className="w-5 h-5" />
          </div>
        </div>

        <div className="bg-white rounded-lg p-4 shadow-sm border border-rose-200 flex items-center justify-between">
          <div>
            <p className="text-xs font-bold text-rose-500">সর্বমোট বকেয়া</p>
            <p className="text-xl font-black text-rose-600 mt-1">{formatBDT(totals.grandTotal)}</p>
          </div>
          <div className="w-10 h-10 bg-rose-50 text-rose-600 rounded-xl flex items-center justify-center">
            <AlertCircle className="w-5 h-5" />
          </div>
        </div>
      </div>

      {/* Filters */}
      <div className="bg-white p-4 rounded-lg border border-slate-200 shadow-sm grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3 items-center">
        <div className="relative lg:col-span-2">
          <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            placeholder="ছাত্রের নাম, আইডি, রোল বা অভিভাবকের মোবাইল..."
            className="w-full pl-9 pr-3 py-2 bg-slate-50 border border-slate-200 rounded-lg text-sm font-medium text-slate-800 outline-none focus:border-[#1C7D5A]"
          />
        </div>

        <select
          value={selectedClass}
          onChange={(e) => setSelectedClass(e.target.value)}
          className="px-3 py-2 bg-white border border-slate-200 rounded-lg text-sm font-semibold text-slate-700 outline-none focus:border-[#1C7D5A]"
        >
          <option value="all">সকল ক্লাস</option>
          {classes.map((cls) => (
            <option key={cls._id} value={cls._id}>
              {cls.name}
            </option>
          ))}
        </select>

        <div className="flex items-center gap-2">
          <select
            value={dueType}
            onChange={(e) => setDueType(e.target.value)}
            className="w-full px-3 py-2 bg-white border border-slate-200 rounded-lg text-sm font-semibold text-slate-700 outline-none focus:border-[#1C7D5A]"
          >
            <option value="all">সকল বকেয়ার ধরন</option>
            <option value="tuition">টিউশন / একাডেমিক ফি</option>
            <option value="boarding">বোর্ডিং বিল</option>
            <option value="transport">ট্রান্সপোর্ট বিল</option>
          </select>
          {hasActiveFilters && (
            <button
              type="button"
              onClick={resetFilters}
              title="রিসেট"
              className="p-2 bg-slate-100 hover:bg-rose-50 text-slate-600 hover:text-rose-600 rounded-lg border border-slate-200 cursor-pointer shrink-0"
            >
              <FilterX className="w-4 h-4" />
            </button>
          )}
        </div>
      </div>

      {/* Table */}
      <div className="bg-white rounded-lg border border-slate-200 shadow-sm overflow-hidden">
        {loading ? (
          <div className="py-20 flex flex-col items-center justify-center">
            <Loader2 className="w-8 h-8 animate-spin text-[#1C7D5A] mb-3" />
            <p className="text-sm font-bold text-slate-500">তথ্য লোড হচ্ছে...</p>
          </div>
        ) : filteredRows.length === 0 ? (
          <div className="py-20 text-center space-y-2">
            <AlertCircle className="w-10 h-10 text-emerald-400 mx-auto" />
            <p className="text-sm font-bold text-slate-500">
              কোনো বকেয়া শিক্ষার্থী পাওয়া যায়নি
            </p>
          </div>
        ) : (
          <>
            <div className="overflow-x-auto">
              <table className="w-full text-left border-collapse min-w-[980px]">
                <thead className="bg-[#1C7D5A18] text-slate-800 text-[11px] uppercase font-black tracking-wider whitespace-nowrap">
                  <tr>
                    <th className="px-4 py-3.5">#</th>
                    <th className="px-4 py-3.5">শিক্ষার্থীর তথ্য</th>
                    <th className="px-4 py-3.5">ক্লাস ও রোল</th>
                    <th className="px-4 py-3.5">অভিভাবক ও ফোন</th>
                    <th className="px-4 py-3.5 text-right">টিউশন বকেয়া</th>
                    <th className="px-4 py-3.5 text-right">বোর্ডিং বকেয়া</th>
                    <th className="px-4 py-3.5 text-right">ট্রান্সপোর্ট বকেয়া</th>
                    <th className="px-4 py-3.5 text-right">সর্বমোট বকেয়া</th>
                    <th className="px-4 py-3.5 text-right">অ্যাকশন</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100 text-sm">
                  {paginatedRows.map((row, idx) => {
                    const serial = (currentPage - 1) * ITEMS_PER_PAGE + idx + 1;
                    return (
                      <tr key={row._id} className="hover:bg-slate-50/70 transition-colors">
                        <td className="px-4 py-3 text-xs font-bold text-slate-400">#{serial}</td>
                        <td className="px-4 py-3">
                          <div className="font-bold text-slate-800">{row.name}</div>
                          <div className="text-xs font-mono text-slate-400">ID: {row.student_code}</div>
                        </td>
                        <td className="px-4 py-3 whitespace-nowrap">
                          <div className="text-xs font-bold text-slate-700">{row.class_name}</div>
                          <div className="text-[11px] text-slate-400">
                            {row.section_name ? `${row.section_name} • ` : ""}রোল: {row.roll_number}
                          </div>
                        </td>
                        <td className="px-4 py-3">
                          <div className="text-xs font-bold text-slate-700">{row.guardian_name}</div>
                          <div className="text-xs text-slate-500 inline-flex items-center gap-1">
                            <Phone className="w-3 h-3 text-slate-400" />
                            {row.guardian_phone}
                          </div>
                        </td>
                        <td className="px-4 py-3 text-right whitespace-nowrap font-bold text-amber-600">
                          {row.tuition_due > 0 ? formatBDT(row.tuition_due) : "-"}
                        </td>
                        <td className="px-4 py-3 text-right whitespace-nowrap font-bold text-indigo-600">
                          {row.boarding_due > 0 ? formatBDT(row.boarding_due) : "-"}
                        </td>
                        <td className="px-4 py-3 text-right whitespace-nowrap font-bold text-sky-600">
                          {row.transport_due > 0 ? formatBDT(row.transport_due) : "-"}
                        </td>
                        <td className="px-4 py-3 text-right whitespace-nowrap font-black text-rose-600">
                          {formatBDT(row.total_due)}
                        </td>
                        <td className="px-4 py-3 text-right whitespace-nowrap">
                          <button
                            type="button"
                            onClick={() => navigate("/admin/accounting/fees/collect")}
                            className="inline-flex items-center gap-1 px-3 py-1.5 bg-emerald-50 hover:bg-[#1C7D5A] text-[#1C7D5A] hover:text-white border border-emerald-200 rounded-lg text-xs font-bold transition-colors cursor-pointer"
                          >
                            আদায় করুন
                            <ArrowRight className="w-3.5 h-3.5" />
                          </button>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
                <tfoot className="bg-slate-50 border-t-2 border-slate-200 text-sm font-black">
                  <tr>
                    <td colSpan="4" className="px-4 py-3 text-right text-slate-700">
                      মোট ({totals.students} জন শিক্ষার্থী):
                    </td>
                    <td className="px-4 py-3 text-right text-amber-600 whitespace-nowrap">
                      {formatBDT(totals.tuition)}
                    </td>
                    <td className="px-4 py-3 text-right text-indigo-600 whitespace-nowrap">
                      {formatBDT(totals.boarding)}
                    </td>
                    <td className="px-4 py-3 text-right text-sky-600 whitespace-nowrap">
                      {formatBDT(totals.transport)}
                    </td>
                    <td className="px-4 py-3 text-right text-rose-600 whitespace-nowrap">
                      {formatBDT(totals.grandTotal)}
                    </td>
                    <td></td>
                  </tr>
                </tfoot>
              </table>
            </div>

            {totalPages > 1 && (
              <div className="bg-slate-50/70 px-5 py-3.5 border-t border-slate-200 flex flex-col sm:flex-row items-center justify-between gap-3">
                <p className="text-xs font-bold text-slate-500">
                  মোট {filteredRows.length} টি রেকর্ডের মধ্যে{" "}
                  {(currentPage - 1) * ITEMS_PER_PAGE + 1} -{" "}
                  {Math.min(currentPage * ITEMS_PER_PAGE, filteredRows.length)} দেখানো হচ্ছে
                </p>
                <div className="flex items-center gap-1.5">
                  <button
                    type="button"
                    disabled={currentPage === 1}
                    onClick={() => setCurrentPage((p) => Math.max(1, p - 1))}
                    className="p-1.5 border border-slate-200 rounded-lg bg-white text-slate-600 disabled:opacity-40 cursor-pointer"
                  >
                    <ChevronLeft className="w-4 h-4" />
                  </button>
                  <span className="px-3 text-xs font-bold text-slate-700">
                    পৃষ্ঠা {currentPage} / {totalPages}
                  </span>
                  <button
                    type="button"
                    disabled={currentPage === totalPages}
                    onClick={() => setCurrentPage((p) => Math.min(totalPages, p + 1))}
                    className="p-1.5 border border-slate-200 rounded-lg bg-white text-slate-600 disabled:opacity-40 cursor-pointer"
                  >
                    <ChevronRight className="w-4 h-4" />
                  </button>
                </div>
              </div>
            )}
          </>
        )}
      </div>
    </div>
  );
};

export default DueFeesReport;
