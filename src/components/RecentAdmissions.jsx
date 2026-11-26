import { useState, useEffect } from "react";
import {
  CheckCircle,
  Clock,
  XCircle,
  Loader2,
  AlertCircle,
} from "lucide-react";
import { Link } from "react-router-dom";
import { useTranslation } from "react-i18next";
import teacherService from "../services/teacherService";

const getTimestamp = (student) => {
  const raw = student?.created_at || student?.admissionDate || student?.createdAt || 0;
  const time = new Date(raw).getTime();
  return Number.isNaN(time) ? 0 : time;
};

const RecentAdmissions = () => {
  const { t, i18n } = useTranslation();
  const [students, setStudents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [errorMsg, setErrorMsg] = useState("");

  useEffect(() => {
    fetchRecentStudents();
  }, []);

  const fetchRecentStudents = async () => {
    try {
      setLoading(true);
      setErrorMsg("");
      const res = await teacherService.getStudents();
      const allStudents = Array.isArray(res?.data) ? res.data : [];
      const sorted = [...allStudents]
        .sort((a, b) => getTimestamp(b) - getTimestamp(a))
        .slice(0, 5);
      setStudents(sorted);
    } catch (err) {
      console.error("Failed to fetch recent students", err);
      setErrorMsg(err?.response?.data?.message || "সাম্প্রতিক ভর্তি তথ্য লোড করা যায়নি");
      setStudents([]);
    } finally {
      setLoading(false);
    }
  };

  const formatDate = (rawDate) => {
    if (!rawDate) return "—";
    const dt = new Date(rawDate);
    if (Number.isNaN(dt.getTime())) return String(rawDate);
    const locale = i18n?.language?.startsWith("bn") ? "bn-BD" : "en-GB";
    return dt.toLocaleDateString(locale, {
      day: "2-digit",
      month: "short",
      year: "numeric",
    });
  };

  const getStatusMeta = (student) => {
    const raw = String(student?.status || student?.admissionStatus || "active").toLowerCase();
    if (raw === "active" || raw === "approved") {
      return {
        label: raw === "active" ? t("student_list.status_options.active", "সক্রিয়") : t("common.approved", "অনুমোদিত"),
        className: "bg-emerald-50 text-emerald-700 border-emerald-100",
        icon: <CheckCircle className="w-3 h-3" />,
      };
    }
    if (raw === "pending") {
      return {
        label: t("common.pending", "অপেক্ষমান"),
        className: "bg-amber-50 text-amber-700 border-amber-100",
        icon: <Clock className="w-3 h-3" />,
      };
    }
    return {
      label: raw === "inactive" ? t("student_list.status_options.inactive", "নিষ্ক্রিয়") : t("common.rejected", "প্রত্যাখ্যাত"),
      className: "bg-rose-50 text-rose-700 border-rose-100",
      icon: <XCircle className="w-3 h-3" />,
    };
  };

  return (
    <div className="bg-white rounded-[8px] border border-gray-100 shadow-sm overflow-hidden">
      <div className="p-6 border-b border-gray-50 flex items-center justify-between">
        <div>
          <h3 className="font-bold text-gray-800">{t("dashboard.recent_admissions")}</h3>
          <p className="text-sm text-gray-500">
            {t("dashboard.recent_admissions_desc")}
          </p>
        </div>
        <Link
          to="/admin/student/list"
          className="text-sm text-primary font-medium hover:underline cursor-pointer"
        >
          {t("common.view_all")}
        </Link>
      </div>

      <div className="overflow-x-auto">
        <table className="w-full">
          <thead className="bg-gray-50/50">
            <tr>
              <th className="text-left py-3 px-6 text-xs font-semibold text-gray-500 uppercase tracking-wider">
                {t("common.student_name")}
              </th>
              <th className="text-left py-3 px-6 text-xs font-semibold text-gray-500 uppercase tracking-wider">
                {t("dashboard.class_info")}
              </th>
              <th className="text-left py-3 px-6 text-xs font-semibold text-gray-500 uppercase tracking-wider">
                {t("common.date")}
              </th>
              <th className="text-center py-3 px-6 text-xs font-semibold text-gray-500 uppercase tracking-wider">
                {t("common.status")}
              </th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-50">
            {loading ? (
              <tr>
                <td colSpan="4" className="py-10 text-center">
                  <Loader2 className="w-8 h-8 animate-spin mx-auto text-primary" />
                  <p className="mt-2 text-gray-500 text-sm">{t("common.loading") || "Loading..."}</p>
                </td>
              </tr>
            ) : errorMsg ? (
              <tr>
                <td colSpan="4" className="py-10 text-center text-sm text-rose-600">
                  <div className="flex flex-col items-center gap-2">
                    <AlertCircle className="w-6 h-6 text-rose-500" />
                    <span>{errorMsg}</span>
                    <button
                      type="button"
                      onClick={fetchRecentStudents}
                      className="text-xs font-semibold text-primary hover:underline cursor-pointer"
                    >
                      আবার চেষ্টা করুন
                    </button>
                  </div>
                </td>
              </tr>
            ) : students.length === 0 ? (
              <tr>
                <td colSpan="4" className="py-10 text-center text-gray-500 text-sm">
                  {t("dashboard.no_recent_admissions") || "No recent admissions found."}
                </td>
              </tr>
            ) : (
              students.map((student, idx) => {
                const studentName =
                  student?.name ||
                  `${student?.firstName || ""} ${student?.lastName || ""}`.trim() ||
                  "Unknown";
                const className = student?.classInfo?.name || student?.class || "N/A";
                const sectionName = student?.sectionInfo?.name || student?.section || "";
                const statusMeta = getStatusMeta(student);
                const profileLink = student?._id
                  ? `/admin/student/profile/${student._id}`
                  : "/admin/student/list";

                return (
                  <tr
                    key={student?._id || student?.id || idx}
                    className="hover:bg-gray-50/50 transition-colors group whitespace-nowrap"
                  >
                    <td className="py-3 px-6">
                      <Link
                        to={profileLink}
                        className="flex items-center gap-3 hover:text-primary transition-colors"
                      >
                        {student?.photo ? (
                          <img
                            src={student.photo}
                            alt={studentName}
                            className="w-8 h-8 rounded-full object-cover border border-gray-200 shrink-0"
                          />
                        ) : (
                          <div className="w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center text-primary text-xs font-bold shrink-0">
                            {studentName.charAt(0)}
                          </div>
                        )}
                        <div>
                          <p className="text-sm font-medium text-gray-900 group-hover:text-primary">
                            {studentName}
                          </p>
                          {(student?.student_id || student?.roll_number) && (
                            <p className="text-[11px] text-gray-400">
                              {student.student_id || `#${student.roll_number}`}
                            </p>
                          )}
                        </div>
                      </Link>
                    </td>
                    <td className="py-3 px-6">
                      <p className="text-sm text-gray-600">
                        {className}
                        {sectionName ? ` - ${sectionName}` : ""}
                      </p>
                    </td>
                    <td className="py-3 px-6">
                      <p className="text-sm text-gray-500">
                        {formatDate(student?.admissionDate || student?.date || student?.created_at)}
                      </p>
                    </td>
                    <td className="py-3 px-6 text-center">
                      <span
                        className={`inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-medium border ${statusMeta.className}`}
                      >
                        {statusMeta.icon}
                        {statusMeta.label}
                      </span>
                    </td>
                  </tr>
                );
              })
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default RecentAdmissions;
