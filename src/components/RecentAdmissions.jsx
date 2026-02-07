import {
  MoreHorizontal,
  User,
  CheckCircle,
  Clock,
  XCircle,
} from "lucide-react";
import { Link } from "react-router";
import { useTranslation } from "react-i18next";

const RecentAdmissions = () => {
  const { t } = useTranslation();
  // Mock Data
  const students = [
    {
      id: 1,
      name: "Abdullah Al Mamun",
      class: "Hifz",
      section: "A",
      date: "2024-01-05",
      status: "Approved",
    },
    {
      id: 2,
      name: "Fatima Zuhra",
      class: "Kitab",
      section: "B",
      date: "2024-01-06",
      status: "Pending",
    },
    {
      id: 3,
      name: "Omar Faruk",
      class: "Nurani",
      section: "A",
      date: "2024-01-06",
      status: "Rejected",
    },
    {
      id: 4,
      name: "Ayesha Siddiqa",
      class: "Hifz",
      section: "C",
      date: "2024-01-07",
      status: "Approved",
    },
    {
      id: 5,
      name: "Ismail Hossain",
      class: "Kitab",
      section: "A",
      date: "2024-01-07",
      status: "Pending",
    },
  ];

  return (
    <div className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden">
      <div className="p-6 border-b border-gray-50 flex items-center justify-between">
        <div>
          <h3 className="font-bold text-gray-800">{t("dashboard.recent_admissions")}</h3>
          <p className="text-sm text-gray-500">
            {t("dashboard.recent_admissions_desc")}
          </p>
        </div>
        <Link to={'/admin/student/list'}><button className="text-sm text-primary font-medium hover:underline">
          {t("common.view_all")}
        </button></Link>
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
              {/* <th className="text-right py-3 px-6 text-xs font-semibold text-gray-500 uppercase tracking-wider">
                Action
              </th> */}
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-50">
            {students.map((student) => (
              <tr
                key={student.id}
                className="hover:bg-gray-50/50 transition-colors group whitespace-nowrap"
              >
                <td className="py-3 px-6">
                  <div className="flex items-center gap-3">
                    <div className="w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center text-primary text-xs font-bold">
                      {student.name.charAt(0)}
                    </div>
                    <p className="text-sm font-medium text-gray-900">
                      {student.name}
                    </p>
                  </div>
                </td>
                <td className="py-3 px-6">
                  <p className="text-sm text-gray-600">
                    {student.class} - {student.section}
                  </p>
                </td>
                <td className="py-3 px-6">
                  <p className="text-sm text-gray-500">{student.date}</p>
                </td>
                <td className="py-3 px-6 text-center">
                  <span
                    className={`inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-medium border ${
                      student.status === "Approved"
                        ? "bg-emerald-50 text-emerald-700 border-emerald-100"
                        : student.status === "Pending"
                        ? "bg-amber-50 text-amber-700 border-amber-100"
                        : "bg-rose-50 text-rose-700 border-rose-100"
                    }`}
                  >
                    {student.status === "Approved" && (
                      <CheckCircle className="w-3 h-3" />
                    )}
                    {student.status === "Pending" && (
                      <Clock className="w-3 h-3" />
                    )}
                    {student.status === "Rejected" && (
                      <XCircle className="w-3 h-3" />
                    )}
                    {t(`common.${student.status.toLowerCase()}`)}
                  </span>
                </td>
                {/* <td className="py-3 px-6 text-right">
                  <button className="p-1.5 text-gray-400 hover:text-gray-600 hover:bg-gray-100 rounded-lg transition-colors">
                    <MoreHorizontal className="w-4 h-4" />
                  </button>
                </td> */}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default RecentAdmissions;
