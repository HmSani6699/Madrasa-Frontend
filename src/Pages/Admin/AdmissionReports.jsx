import { useState, useEffect, useCallback } from "react";
import {
  UserPlus,
  Search,
  Filter,
  Download,
  FileText,
  Briefcase,
  Calendar,
  Layers,
  ChevronDown,
  Printer,
  Table as TableIcon,
  FileSpreadsheet,
  FileJson,
  MoreHorizontal,
  Users,
  ChevronRight,
  ChevronLeft,
  Eye,
  Trash2,
  Edit,
  Plus,
  Phone
} from "lucide-react";

import jsPDF from "jspdf";
import "jspdf-autotable";
import * as XLSX from "xlsx";

import SelectInputField from "../../components/SelectInputField";
import { Link, useNavigate } from "react-router";
import axiosInstance from "../../api/axiosInstance";
import { toast } from "react-hot-toast";

const AdmissionReports = () => {
  const navigate = useNavigate();
  const [searchTerm, setSearchTerm] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 10;
  const [filters, setFilters] = useState({
    class_id: "All",
    academicYear: "2025-2026"
  });

  const [admissions, setAdmissions] = useState([]);
  const [totalItems, setTotalItems] = useState(0);
  const [loading, setLoading] = useState(false);
  const [classes, setClasses] = useState([]);
  const [showFilter, setShowFilter] = useState(false);

  const fetchClasses = useCallback(async () => {
    try {
      const res = await axiosInstance.get("/v1/classes");
      if (res.data.success) {
        setClasses(res.data.data.map(c => ({ label: c.name, value: c._id })));
      }
    } catch (err) {
      console.error("Error fetching classes:", err);
    }
  }, []);

  const fetchAdmissions = useCallback(async () => {
    setLoading(true);
    try {
      const params = new URLSearchParams({
        page: currentPage,
        limit: itemsPerPage,
        search: searchTerm,
        academicYear: filters.academicYear === "All" ? "" : filters.academicYear,
        class_id: filters.class_id === "All" ? "" : filters.class_id
      });

      const res = await axiosInstance.get(`/v1/admission?${params.toString()}`);
      if (res.data.success) {
        setAdmissions(res.data.data);
        setTotalItems(res.data.total);
      }
    } catch (err) {
      console.error("Error fetching admissions:", err);
      toast.error("Failed to fetch admission reports");
    } finally {
      setLoading(false);
    }
  }, [currentPage, itemsPerPage, searchTerm, filters]);

  useEffect(() => {
    fetchClasses();
  }, [fetchClasses]);

  useEffect(() => {
    fetchAdmissions();
  }, [fetchAdmissions]);

  const handleDelete = async (id) => {
    if (!window.confirm("Are you sure you want to delete this admission?")) return;

    try {
      const res = await axiosInstance.delete(`/v1/admission/${id}`);
      if (res.data.success) {
        toast.success("Admission deleted successfully");
        fetchAdmissions();
      }
    } catch (err) {
      console.error("Delete error:", err);
      toast.error(err.response?.data?.message || "Failed to delete admission");
    }
  };

  const stats = [
    { label: 'Total Admissions', value: totalItems.toLocaleString(), delta: '', color: 'emerald', icon: FileText },
    { label: 'Filtered Result', value: totalItems.toLocaleString(), delta: '', color: 'blue', icon: Users },
    { label: 'Academic Year', value: filters.academicYear, delta: '', color: 'indigo', icon: Calendar },
  ];

  const totalPages = Math.ceil(totalItems / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const endIndex = Math.min(startIndex + itemsPerPage, totalItems);

  const paginate = (pageNumber) => {
    if (pageNumber >= 1 && pageNumber <= totalPages) {
      setCurrentPage(pageNumber);
    }
  };

  const handleExportPDF = () => {
    const doc = new jsPDF();
    const tableColumn = ["Student ID", "Full Name", "Class", "Guardian Contact", "Admission Date"];
    const tableRows = admissions.map(student => [
      student.student_id || student._id.toString().slice(-6).toUpperCase(),
      student.firstName,
      student.classInfo?.name || "N/A",
      student.guardian?.contact || "N/A",
      new Date(student.admissionDate).toLocaleDateString()
    ]);

    doc.setFontSize(18);
    doc.text("Admission Report", 14, 22);
    doc.setFontSize(11);
    doc.setTextColor(100);
    doc.text(`Generated on: ${new Date().toLocaleDateString()}`, 14, 30);

    doc.autoTable({
      head: [tableColumn],
      body: tableRows,
      startY: 35,
      styles: { fontSize: 9, cellPadding: 3 },
      headStyles: { fillStyle: '#00bd7f', textColor: [255, 255, 255] },
      alternateRowStyles: { fillColor: [248, 250, 252] },
    });

    doc.save(`Admission_Report_${new Date().getTime()}.pdf`);
  };

  const handleExportExcel = () => {
    const exportData = admissions.map(student => ({
      "Student ID": student.student_id || student._id.toString().slice(-6).toUpperCase(),
      "Full Name": student.firstName,
      "Class": student.classInfo?.name || "N/A",
      "Guardian": student.guardian?.fatherName || "N/A",
      "Contact": student.guardian?.contact || "N/A",
      "Date": new Date(student.admissionDate).toLocaleDateString()
    }));
    const worksheet = XLSX.utils.json_to_sheet(exportData);
    const workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, worksheet, "Admission Report");
    XLSX.writeFile(workbook, `Admission_Report_${new Date().getTime()}.xlsx`);
  };

  return (
    <div className="min-h-screen bg-[#f8fafc]  animate-in fade-in duration-700">
      <div className="max-w-[1600px] mx-auto space-y-8">
        {/* Header */}
        <div className="flex items-center justify-between mb-5 w-full">
          <div>
            <h1 className="text-[20px] font-black text-slate-800 flex items-center gap-3">
              <FileText className="w-8 h-8 text-[#00bd7f]" />
              Admission Report
            </h1>

          </div>

          <div className="flex items-center gap-3 w-full md:w-auto">
            {/* Quick Search */}
            <div className="relative hidden md:block w-64">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
              <input
                type="text"
                placeholder="Search by name or ID..."
                className="w-full pl-10 pr-4 py-2 bg-[#e6f4ef] border border-slate-200 text-slate-900 rounded-[8px] outline-none focus:ring-0.5 focus:ring-emerald-500 transition-all"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>

            <div className="relative">
              <button onClick={() => setShowFilter(!showFilter)} className="px-4 py-2 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-[8px] cursor-pointer flex items-center gap-2 font-bold transition-colors border border-slate-200" > <Filter className="w-4 h-4 text-slate-500" /> Filter</button>

              {
                showFilter && (
                  <div className="absolute top-full right-0 mt-2 bg-white rounded-lg shadow-lg p-4 w-full lg:w-[250px] z-50 border border-slate-100 animate-in fade-in zoom-in duration-200">
                    <SelectInputField
                      title={'Academic Year'}
                      value={filters.academicYear}
                      setValue={(val) => setFilters({ ...filters, academicYear: val })}
                      options={[{ label: "2025-2026", value: "2025-2026" }, { label: "2026-2027", value: "2026-2027" }]}
                    />
                    <div className="mt-4">
                      <SelectInputField
                        title={'Class'}
                        value={filters.class_id}
                        setValue={(val) => setFilters({ ...filters, class_id: val })}
                        options={[{ label: "All Classes", value: "All" }, ...classes]}
                      />
                    </div>

                    <div className="flex justify-end gap-2 mt-6">
                      <button
                        onClick={() => {
                          setFilters({ class_id: "All", academicYear: "2025-2026" });
                          setShowFilter(false);
                          setCurrentPage(1);
                          fetchAdmissions();
                        }}
                        className="px-4 py-2 text-xs font-bold bg-slate-100 text-slate-600 rounded-[8px] cursor-pointer hover:bg-slate-200 transition-colors"
                      >
                        Reset
                      </button>
                      <button
                        onClick={() => {
                          setShowFilter(false);
                          setCurrentPage(1);
                          fetchAdmissions();
                        }}
                        className="px-4 py-2 text-xs font-bold bg-[#00bd7f] text-white rounded-[8px] cursor-pointer hover:bg-[#009b68] transition-colors"
                      >
                        Apply
                      </button>
                    </div>
                  </div>
                )
              }
            </div>

            <Link to="/admin/admission/create" className="w-full sm:w-auto">
              <button

                className="w-full px-4 py-2 bg-[#00bd7f] text-white rounded-[8px] cursor-pointer flex items-center gap-2"
              >
                <Plus className="w-4 h-4" />
                Add Student
              </button>
            </Link>
          </div>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {stats.map((stat, idx) => (
            <div key={idx} className="bg-white rounded-[12px] shadow-sm border border-slate-100 p-5 hover:shadow-md transition-all relative overflow-hidden group">
              <div className="absolute -top-[50%] -right-[50%] h-[200px] w-[200px] bg-emerald-50 rounded-full group-hover:scale-110 transition-transform duration-500"></div>
              <div className="flex items-center justify-between relative z-10">
                <div>
                  <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-1">
                    {stat.label}
                  </p>
                  <p className="text-2xl font-black text-slate-800">
                    {stat.value}
                  </p>
                </div>
                <div className={`w-12 h-12 bg-white border border-slate-100 rounded-xl flex items-center justify-center shadow-sm`}>
                  <stat.icon className={`w-5 h-5 text-[#00bd7f]`} />
                </div>
              </div>
            </div>
          ))}
        </div>



        {/* Individual Student Records */}
        <div className="bg-white rounded-[8px]  shadow-sm overflow-hidden min-h-[400px]">
          <div>
            <div className="px-5 py-3 border-b-2 border-slate-100 flex justify-between items-center">
              <h2 className="text-[18px] font-black text-slate-800  tracking-tight flex items-center gap-3 whitespace-nowrap">
                <Users className="w-6 h-6 text-[#00bd7f]" />
                Detailed Records
              </h2>

              <div className="flex items-center gap-4 w-full lg:w-auto relative z-10">
                <button
                  onClick={handleExportPDF}
                  className="flex items-center gap-2 border border-gray-100 px-4 py-2 rounded-[8px]"
                >
                  <Printer className="w-4 h-4" />
                  PDF
                </button>
                <button
                  onClick={handleExportExcel}
                  className="flex items-center gap-2 border border-gray-100 px-4 py-2 rounded-[8px]"
                >
                  <FileSpreadsheet className="w-4 h-4" />
                  Excel
                </button>
              </div> </div>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full border-collapse">
              <thead className="bg-[#e6f4ef]">
                <tr className="whitespace-nowrap">
                  <th className="px-10 py-3 text-[14px] text-left">Student ID</th>
                  <th className="px-10 py-3 text-[14px] text-left">Full Name</th>
                  <th className="px-10 py-3 text-[14px] text-center">Class</th>
                  <th className="px-10 py-3 text-[14px] text-center">Guardian</th>
                  <th className="px-10 py-3 text-[14px] text-center">Admission Date</th>
                  <th className="px-10 py-3 text-[14px] text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {loading ? (
                  <tr>
                    <td colSpan="6" className="px-10 py-20 text-center font-bold text-slate-400">Loading records...</td>
                  </tr>
                ) : admissions.length > 0 ? (
                  admissions.map((student, i) => (
                    <tr key={student._id} className="group hover:bg-slate-50/50 transition-all text-center md:text-left whitespace-nowrap">
                      <td className="px-10 py-3 font-mono text-xs font-black text-slate-400 uppercase">
                        {student.student_id || student._id.toString().slice(-6).toUpperCase()}
                      </td>
                      <td className="px-10 py-3">
                        <div className="flex items-center gap-4 justify-center md:justify-start">
                          <div className="w-10 h-10 bg-[#00bd7f]/10 rounded-xl flex items-center justify-center font-black text-[#00bd7f]">
                            <img
                              src={student.photo}
                              alt={student.firstName}
                              className="w-full h-full object-cover rounded-full"
                            />
                          </div>
                          <span className="text-sm font-black text-slate-800 uppercase tracking-tight">{student.firstName}</span>
                        </div>
                      </td>
                      <td className="px-10 py-3 text-center">
                        <span className="text-xs font-black text-slate-700 uppercase">{student.classInfo?.name || "N/A"}</span>
                      </td>
                      <td className="px-10 py-3 ">
                        <p className="font-semibold text-[16px]">{student.guardian?.fatherName || "N/A"}</p>
                        <p className="flex items-center gap-2 text-[14px]"> <Phone className="h-3 w-3" /> {student.guardian?.contact || "N/A"}</p>
                      </td>
                      <td className="px-10 py-3 text-center font-bold text-slate-500">
                        {student.admissionDate ? new Date(student.admissionDate).toLocaleDateString() : "N/A"}
                      </td>
                      <td className="px-10 py-3 text-right">
                        <div className="flex items-center justify-end gap-2">
                          <Link to={`/admin/student/profile/${student._id}`}>
                            <button className="text-[#00bd7f] mt-[10px] cursor-pointer" title="View Profile">
                              <Eye className="w-5 h-5" />
                            </button>
                          </Link>
                          <Link to={`/admin/admission/create?edit=true&id=${student._id}&guardianId=${student.guardian_id}`}>
                            <button className="text-blue-600 mt-[10px] cursor-pointer" title="Edit Admission">
                              <Edit className="w-4 h-4" />
                            </button>
                          </Link>
                          <button
                            onClick={() => handleDelete(student._id)}
                            className="text-red-600  cursor-pointer" title="Delete record">
                            <Trash2 className="w-4 h-4" />
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan="6" className="px-10 py-20 text-center font-bold text-slate-400">No admissions found for the selected filters.</td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>

          {/* Pagination Controls */}
          <div className="bg-slate-50/50 px-6 py-4 border-t-2 border-slate-50 flex flex-col sm:flex-row items-center justify-between gap-4">
            <p className="text-xs font-bold text-slate-500 uppercase tracking-wider">
              Showing{" "}
              <span className="text-slate-900">
                {totalItems === 0 ? 0 : (currentPage - 1) * itemsPerPage + 1}
              </span>{" "}
              to{" "}
              <span className="text-slate-900">
                {Math.min(currentPage * itemsPerPage, totalItems)}
              </span>{" "}
              of <span className="text-slate-900">{totalItems}</span>{" "}
              students
            </p>
            <div className="flex items-center gap-2">
              <button
                disabled={currentPage === 1}
                onClick={() => setCurrentPage((p) => Math.max(1, p - 1))}
                className="p-2 border-2 border-slate-200 rounded-xl bg-white text-slate-600 hover:bg-slate-50 hover:border-emerald-500 hover:text-emerald-600 disabled:opacity-50 disabled:cursor-not-allowed transition-all"
              >
                <ChevronLeft className="w-5 h-5" />
              </button>
              <div className="flex items-center gap-1">
                {[...Array(totalPages)].map((_, i) => (
                  <button
                    key={i + 1}
                    onClick={() => setCurrentPage(i + 1)}
                    className={`w-10 h-10 rounded-xl text-xs font-black transition-all border-2 ${currentPage === i + 1
                      ? "bg-[#00bd7f] border-[#00bd7f] text-white shadow-lg shadow-emerald-200"
                      : "bg-white border-slate-200 text-slate-600 hover:border-emerald-500 hover:text-emerald-600"
                      }`}
                  >
                    {i + 1}
                  </button>
                ))}
              </div>
              <button
                disabled={currentPage === totalPages}
                onClick={() => setCurrentPage((p) => Math.min(totalPages, p + 1))}
                className="p-2 border-2 border-slate-200 rounded-xl bg-white text-slate-600 hover:bg-slate-50 hover:border-emerald-500 hover:text-emerald-600 disabled:opacity-50 disabled:cursor-not-allowed transition-all"
              >
                <ChevronRight className="w-5 h-5" />
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AdmissionReports;
