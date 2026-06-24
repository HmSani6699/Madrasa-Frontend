import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import {
  Search,
  Filter,
  Download,
  Eye,
  CheckCircle,
  XCircle,
  Clock,
  User,
  Phone,
  Mail,
  Calendar,
  BookOpen,
  Users,
  MapPin,
  FileText,
  X,
  Plus,
} from "lucide-react";
import SelectInputField from "../../components/SelectInputField";
import { useEffect } from "react";
import axiosInstance from "../../api/axiosInstance";

const OnlineAdmissionList = () => {
  const navigate = useNavigate();
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [classFilter, setClassFilter] = useState("all");
  const [selectedApplication, setSelectedApplication] = useState(null);
  const [applications, setApplications] = useState([]);
  const [loading, setLoading] = useState(true);
  const [total, setTotal] = useState(0);
  const [isFilterOpen, setIsFilterOpen] = useState(false)

  const fetchApplications = async () => {
    setLoading(true);
    try {
      const response = await axiosInstance.get(`/v1/online-admission?searchTerm=${searchTerm}&status=${statusFilter}&class_id=${classFilter}`);
      if (response.data.success) {
        setApplications(response.data.data);
        setTotal(response.data.total);
      }
    } catch (error) {
      console.error("Fetch Applications Error:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchApplications();
  }, [searchTerm, statusFilter, classFilter]);

  const getStatusBadge = (status) => {
    const styles = {
      pending: "bg-yellow-100 text-yellow-700 border-yellow-200",
      approved: "bg-green-100 text-green-700 border-green-200",
      rejected: "bg-red-100 text-red-700 border-red-200",
    };
    const icons = {
      pending: Clock,
      approved: CheckCircle,
      rejected: XCircle,
    };
    const Icon = icons[status];
    return (
      <span
        className={`inline-flex items-center gap-1 px-3 py-1 rounded-full text-xs font-bold border ${styles[status]}`}
      >
        <Icon className="w-3 h-3" />
        {status.charAt(0).toUpperCase() + status.slice(1)}
      </span>
    );
  };

  const filteredApplications = applications.filter((app) => {
    // Safety check for guardian
    const guardian = app.guardian || {};
    const students = app.students || (app.student ? [app.student] : []);

    const matchesSearch =
      students.some(s =>
        (s.name || `${s.firstName || ""} ${s.lastName || ""}`).toLowerCase().includes(searchTerm.toLowerCase())
      ) ||
      (guardian.fatherName || "").toLowerCase().includes(searchTerm.toLowerCase()) ||
      (guardian.fatherContact || app.student?.phone || "").includes(searchTerm);

    const matchesStatus = statusFilter === "all" || app.status === statusFilter;

    const matchesClass =
      classFilter === "all" ||
      students.some(s => (s.appliedClass || s.class) === classFilter);

    return matchesSearch && matchesStatus && matchesClass;
  });

  const handleStatusChange = async (id, newStatus, application) => {
    if (newStatus === "approved") {
      // For approval, redirect to the official admission form with pre-filled data
      navigate("/admin/admission/create", {
        state: {
          preFill: true,
          applicationData: application
        }
      });
      return;
    }

    try {
      const response = await axiosInstance.put(`/v1/online-admission/${id}/status`, { status: newStatus });
      if (response.data.success) {
        alert(`Application ${newStatus} successfully!`);
        fetchApplications();
        setSelectedApplication(null);
      } else {
        alert(response.data.message || "Failed to update status");
      }
    } catch (error) {
      console.error("Status Update Error:", error);
      alert("An error occurred while updating status");
    }
  };





  return (
    <div className="space-y-6  animate-in fade-in duration-500">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">



        <h1 className="text-[20px] font-black text-slate-800 flex items-center gap-3">
          <FileText className="w-8 h-8 text-[#00bd7f]" />
          Online Admission Applications
        </h1>


        <div className="flex items-center justify-between gap-4">
          {/* Search */}
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
            <input
              type="text"
              placeholder="Search by ID, Name or Phone..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-10 pr-4 py-2 bg-[#e6f4ef] border border-slate-200 text-slate-900 rounded-[8px] outline-none focus:ring-0.5 focus:ring-emerald-500 transition-all"
            />
          </div>

          {/* filter */}
          <div className="relative">
            <button
              onClick={() => setIsFilterOpen(!isFilterOpen)}
              className=" px-4 py-2 bg-[#e6f4ef]  rounded-[8px] cursor-pointer flex items-center gap-2"
            >
              <Filter className="h-4 w-4" />  Filter
            </button>

            {
              isFilterOpen && <div className="absolute top-[50px] right-0 z-[100]  whitespace-nowrap flex flex-col gap-2 bg-white border border-gray-200 p-4 rounded-[8px] shadow-lg lg:w-[300px] w-full z-20">

                <div className="flex flex-col gap-4">
                  {/* Status Filter */}
                  <SelectInputField title={"Class"} options={[
                    { value: "Class One" },
                    { value: "Class Two" }
                  ]} />
                  <SelectInputField title={"Group"} options={[
                    { value: "A" },
                    { value: "B" }
                  ]} />
                  <SelectInputField title={"Status"} options={[
                    { value: "Approved" },
                    { value: "Pending" },
                    { value: "Rejected" }
                  ]} />

                </div>
                <div className="flex items-end justify-end gap-4 mt-2.5">
                  <button
                    onClick={() => setIsFilterOpen(false)}
                    className=" px-4 py-2 bg-[#e6f4ef]  rounded-[8px] cursor-pointer"
                  >
                    Cancel
                  </button>

                  <button

                    className=" px-4 py-2 bg-[#00bd7f] text-white rounded-[8px] cursor-pointer"
                  >
                    Apply
                  </button>
                </div>
              </div>
            }
          </div>

          {/* Ad student */}
          <div className="flex gap-3 w-full md:w-auto">
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



      </div>


      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <div className="bg-white rounded-[10px] border-1 border-gray-100 shadow-lg p-6 relative overflow-hidden">
          <div className="absolute -top-[50%] -left-[50%] h-[200px] w-[200px] bg-emerald-50 rounded-full group-hover:scale-110 transition-transform duration-500"></div>
          <div className="flex items-center justify-between relative z-[10]">
            <div>
              <p className="text-xs font-bold text-slate-500 uppercase mb-1">
                Total
              </p>
              <p className="text-3xl font-black text-slate-900 ">
                {applications.length}
              </p>
            </div>
            <div className="w-12 h-12 bg-blue-100 dark:bg-blue-900/20 rounded-xl flex items-center justify-center">
              <FileText className="w-6 h-6 text-blue-600" />
            </div>
          </div>
        </div>

        <div className="bg-white rounded-[10px] border-1 border-gray-100 shadow-lg p-6 relative overflow-hidden">
          <div className="absolute -top-[50%] -left-[50%] h-[200px] w-[200px] bg-emerald-50 rounded-full group-hover:scale-110 transition-transform duration-500"></div>
          <div className="flex items-center justify-between relative z-[10]">
            <div>
              <p className="text-xs font-bold text-slate-500 uppercase mb-1">
                Pending
              </p>
              <p className="text-3xl font-black text-yellow-600">
                {applications.filter((a) => a.status === "pending").length}
              </p>
            </div>
            <div className="w-12 h-12 bg-yellow-100 dark:bg-yellow-900/20 rounded-xl flex items-center justify-center">
              <Clock className="w-6 h-6 text-yellow-600" />
            </div>
          </div>
        </div>

        <div className="bg-white rounded-[10px] border-1 border-gray-100 shadow-lg p-6 relative overflow-hidden">
          <div className="absolute -top-[50%] -left-[50%] h-[200px] w-[200px] bg-emerald-50 rounded-full group-hover:scale-110 transition-transform duration-500"></div>
          <div className="flex items-center justify-between relative z-[10]">
            <div>
              <p className="text-xs font-bold text-slate-500 uppercase mb-1">
                Approved
              </p>
              <p className="text-3xl font-black text-green-600">
                {applications.filter((a) => a.status === "approved").length}
              </p>
            </div>
            <div className="w-12 h-12 bg-green-100 dark:bg-green-900/20 rounded-xl flex items-center justify-center">
              <CheckCircle className="w-6 h-6 text-green-600" />
            </div>
          </div>
        </div>

        <div className="bg-white rounded-[10px] border-1 border-gray-100 shadow-lg p-6 relative overflow-hidden">
          <div className="absolute -top-[50%] -left-[50%] h-[200px] w-[200px] bg-emerald-50 rounded-full group-hover:scale-110 transition-transform duration-500"></div>
          <div className="flex items-center justify-between relative z-[10]">
            <div>
              <p className="text-xs font-bold text-slate-500 uppercase mb-1">
                Rejected
              </p>
              <p className="text-3xl font-black text-red-600">
                {applications.filter((a) => a.status === "rejected").length}
              </p>
            </div>
            <div className="w-12 h-12 bg-red-100 dark:bg-red-900/20 rounded-xl flex items-center justify-center">
              <XCircle className="w-6 h-6 text-red-600" />
            </div>
          </div>
        </div>
      </div>




      {/* Applications List */}
      <div className="bg-white  rounded-[10px] border border-gray-100 shadow-lg overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className=" bg-[#e6f4ef]  border-gray-100 dark:border-slate-700">
              <tr className="cursor-pointer whitespace-nowrap">
                <th className="px-6 py-4 text-left text-xs font-black text-slate-500 uppercase tracking-wider">
                  Student
                </th>
                <th className="px-6 py-4 text-left text-xs font-black text-slate-500 uppercase tracking-wider">
                  Class
                </th>
                <th className="px-6 py-4 text-left text-xs font-black text-slate-500 uppercase tracking-wider">
                  Guardian
                </th>
                <th className="px-6 py-4 text-left text-xs font-black text-slate-500 uppercase tracking-wider">
                  Contact
                </th>
                <th className="px-6 py-4 text-left text-xs font-black text-slate-500 uppercase tracking-wider">
                  Applied Date
                </th>
                <th className="px-6 py-4 text-left text-xs font-black text-slate-500 uppercase tracking-wider">
                  Status
                </th>
                <th className="px-6 py-4 text-left text-xs font-black text-slate-500 uppercase tracking-wider text-center">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody className="">
              {filteredApplications.map((app) => (
                <tr
                  key={app._id || app.id}
                  className=" dark:hover:bg-gray-100 transition-colors cursor-pointer"
                >
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 bg-[#e6f4ef] text-primary rounded-full flex items-center justify-center font-black">
                        <img
                          src={app.students?.[0]?.photo || app.student?.photo || ""}
                          alt={app.students?.[0]?.name || app.student?.firstName || "N/A"}
                          className="w-14 h-14 object-cover"
                        />
                      </div>
                      <div>

                        <p className="font-bold">
                          {app.students?.[0]?.name || app.student?.firstName || "N/A"}
                          {app.students?.length > 1 && <span className="text-xs text-primary ml-1">(+{app.students.length - 1} more)</span>}
                        </p>
                        <p className="text-xs text-slate-500">
                          {app.students?.[0]?.gender || app.student?.gender || ""}
                        </p>
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span className="inline-block px-3 py-1 bg-primary/10 text-primary text-xs font-bold rounded-lg">
                      {app.students?.[0]?.appliedClass || app.student?.class || "N/A"}
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <p className="font-bold">
                      {app.guardian?.fatherName || "N/A"}
                    </p>
                    <p className="text-xs text-slate-500 whitespace-nowrap">
                      {app.guardian?.fatherOccupation || "Guardian"}
                    </p>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="space-y-1">
                      <p className="text-sm text-slate-600 dark:text-slate-400 flex items-center gap-1">
                        <Phone className="w-3 h-3" />
                        {app.guardian?.fatherContact || app.student?.phone || "N/A"}
                      </p>

                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <p className="text-sm text-slate-600 dark:text-slate-400 flex items-center gap-1">
                      <Calendar className="w-3 h-3" />
                      {app.created_at ? new Date(app.created_at).toLocaleDateString() : (app.applicationDate || "N/A")}
                    </p>
                  </td>
                  <td className="px-6 py-4">{getStatusBadge(app.status)}</td>
                  <td className="px-6 py-4 whitespace-nowrap text-center">
                    <button
                      onClick={() => setSelectedApplication(app)}
                      className="inline-flex items-center gap-2 bg-[#00bd7f] text-white px-5 py-2 rounded-lg hover:bg-[#009b68] transition-all"
                    >
                      <Eye className="w-3 h-3" />
                      View Details
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {filteredApplications.length === 0 && (
          <div className="text-center py-12">
            <FileText className="w-12 h-12 text-slate-300 mx-auto mb-4" />
            <p className="text-slate-500 font-medium">No applications found</p>
          </div>
        )}
      </div>

      {/* Detail Modal */}
      {selectedApplication && (
        <div
          className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4"
          onClick={() => setSelectedApplication(null)}
        >
          <div
            className="bg-white rounded-[8px] max-w-4xl w-full max-h-[90vh] overflow-y-auto"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Modal Header */}
            <div className="sticky top-0 bg-white  border-b border-gray-100  px-8 py-6 flex items-center justify-between">
              <div>
                <h2 className="text-2xl font-black text-slate-900 ">
                  Application Details
                </h2>
                <p className="text-sm text-slate-500">
                  Application ID: #{selectedApplication._id || selectedApplication.id}
                </p>
              </div>
              <button
                onClick={() => setSelectedApplication(null)}
                className="p-2   rounded-xl transition-colors bg-white cursor-pointer hover:bg-red-500 hover:text-white"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Modal Content */}
            <div className="p-8 space-y-8">
              {/* Guardian Information */}
              <div>
                <h3 className="text-lg font-black text-slate-900  mb-4 flex items-center gap-2">
                  <Users className="w-5 h-5 text-primary" />
                  Guardian Information
                </h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6 bg-slate-50  rounded-2xl p-6">
                  <div>
                    <label className="text-xs font-bold text-slate-500 uppercase block mb-1">Father's Name</label>
                    <p className="font-bold">{selectedApplication.guardian?.fatherName || "N/A"}</p>
                  </div>
                  <div>
                    <label className="text-xs font-bold text-slate-500 uppercase block mb-1">Mother's Name</label>
                    <p className="font-bold">{selectedApplication.guardian?.motherName || "N/A"}</p>
                  </div>
                  <div>
                    <label className="text-xs font-bold text-slate-500 uppercase block mb-1">Phone ( Father )</label>
                    <p className="font-bold">{selectedApplication.guardian?.fatherContact || "N/A"}</p>
                  </div>
                  <div>
                    <label className="text-xs font-bold text-slate-500 uppercase block mb-1">Phone ( Mother )</label>
                    <p className="font-bold">{selectedApplication.guardian?.motherContact || "N/A"}</p>
                  </div>
                  <div>
                    <label className="text-xs font-bold text-slate-500 uppercase block mb-1">Email</label>
                    <p className="font-bold">{selectedApplication.guardian?.email || "N/A"}</p>
                  </div>
                  <div className="">
                    <label className="text-xs font-bold text-slate-500 uppercase block mb-1">Address (Present)</label>
                    <p className="font-bold">{selectedApplication.guardian?.address || "N/A"}</p>
                  </div>
                </div>

                {/* Guardian Documents */}
                <div className="mt-6">
                  <h4 className="text-sm font-black text-slate-900 mb-4 flex items-center gap-2">
                    <FileText className="w-4 h-4 text-primary" />
                    Uploaded Documents
                  </h4>
                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                    {[
                      { label: "Father's NID", key: "fatherNID" },
                      { label: "Mother's NID", key: "motherNID" },
                      { label: "Guardian's NID", key: "guardianNID" }
                    ].map((doc) => (
                      <div key={doc.key} className="bg-slate-50 border-2 border-slate-100 rounded-xl p-3 flex flex-col items-center justify-center min-h-[140px] relative group overflow-hidden">
                        {selectedApplication.guardian?.[doc.key] ? (
                          <>
                            <img
                              src={selectedApplication.guardian[doc.key]}
                              alt={doc.label}
                              className="w-full h-full object-contain transition-transform group-hover:scale-110 cursor-zoom-in"
                              onClick={() => window.open(selectedApplication.guardian[doc.key], '_blank')}
                            />
                            <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                              <span className="text-[10px] text-white font-bold bg-primary px-3 py-1 rounded-full">View Large</span>
                            </div>
                          </>
                        ) : (
                          <div className="flex flex-col items-center gap-2 text-slate-300">
                            <FileText size={32} />
                            <span className="text-[10px] font-bold uppercase tracking-widest">{doc.label}</span>
                            <span className="text-[8px] italic">Not Uploaded</span>
                          </div>
                        )}
                        {selectedApplication.guardian?.[doc.key] && (
                          <div className="absolute bottom-2 left-2 right-2 bg-white/80 backdrop-blur-sm rounded-lg p-1 text-center">
                            <span className="text-[10px] font-black text-slate-700">{doc.label}</span>
                          </div>
                        )}
                      </div>
                    ))}
                  </div>
                </div>
              </div>

              {/* Students Information */}
              <div>
                <h3 className="text-lg font-black text-slate-900  mb-4 flex items-center gap-2">
                  <User className="w-5 h-5 text-primary" />
                  Students ({selectedApplication.students?.length || (selectedApplication.student ? 1 : 0)})
                </h3>
                <div className="space-y-4">
                  {(selectedApplication.students || [selectedApplication.student]).filter(Boolean).map((student, idx) => (
                    <div key={idx} className="grid grid-cols-1 md:grid-cols-3 gap-6 bg-slate-50  rounded-2xl p-6">
                      <div className="flex items-center gap-4">
                        <div className="w-12 h-12 bg-white rounded-full flex items-center justify-center font-black shadow-sm border border-slate-100">
                          <img
                            src={student.photo || ""}
                            alt={student.name || student.firstName || "N/A"}
                            className="w-10 h-10 object-cover"
                          />
                        </div>
                        <div>
                          <p className="font-bold">{student.name || student.firstName || "N/A"}</p>
                          <p className="text-xs text-slate-500">{student.gender || "N/A"}</p>
                        </div>
                      </div>
                      <div>
                        <label className="text-xs font-bold text-slate-500 uppercase block mb-1">Date of Birth</label>
                        <p className="font-bold">{student.dob || student.dateOfBirth || "N/A"}</p>
                      </div>
                      <div>
                        <label className="text-xs font-bold text-slate-500 uppercase block mb-1">Applied Class</label>
                        <p className="font-bold">{student.appliedClass || student.class || "N/A"}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>




              {/* Status Actions */}
              <div>
                <h3 className="text-lg font-black text-slate-900 dark:text-white mb-4">
                  Application Status
                </h3>
                <div className="bg-slate-50 dark:bg-slate-900 rounded-2xl p-6">
                  <div className="flex items-center justify-between mb-4">
                    <span className="text-sm font-bold text-slate-600 dark:text-slate-400">
                      Current Status:
                    </span>
                    {getStatusBadge(selectedApplication.status)}
                  </div>
                  <div className="flex gap-3">
                    <button
                      onClick={() =>
                        handleStatusChange(selectedApplication._id || selectedApplication.id, "approved", selectedApplication)
                      }
                      className="flex-1 flex items-center justify-center gap-2 px-4 py-3 bg-green-500 text-white font-bold rounded-xl hover:bg-green-600 transition-colors"
                    >
                      <CheckCircle className="w-4 h-4" />
                      Approve
                    </button>
                    <button
                      onClick={() =>
                        handleStatusChange(selectedApplication._id || selectedApplication.id, "rejected")
                      }
                      className="flex-1 flex items-center justify-center gap-2 px-4 py-3 bg-red-500 text-white font-bold rounded-xl hover:bg-red-600 transition-colors"
                    >
                      <XCircle className="w-4 h-4" />
                      Reject
                    </button>

                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default OnlineAdmissionList;
