import { useState, useMemo, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import {
  Search,
  Download,
  Eye,
  Plus,
  Users,
  CheckCircle,
  XCircle,
  MoreVertical,
  Phone,
  Mail,
  MapPin,
  Calendar,
  Contact,
  X,
  Edit2,
  Trash2,
  UserCheck,
  MessageCircle,
  ChevronLeft,
  ChevronRight,
  Briefcase,
  AlertTriangle,
  FileText,
  Building2,
  Stethoscope,
  GraduationCap,
  Facebook,
  Twitter,
  Linkedin,
  CreditCard,
  Lock,
  ShieldCheck,
  User,
  Heart,
  Droplets,
  Map,
  ShieldAlert,
  Save,
  ChevronDown,
  SquarePen,
} from "lucide-react";
import SelectInputField from "../../components/SelectInputField";
import axiosInstance from "../../api/axiosInstance";
import { toast } from "react-hot-toast";

const EmployeeList = () => {
  const [employees, setEmployees] = useState([]);
  const [loading, setLoading] = useState(true);
  const [deptFilter, setDeptFilter] = useState("all");
  const [searchTerm, setSearchTerm] = useState("");

  const [openMenuId, setOpenMenuId] = useState(null);
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 10;
  const navigate = useNavigate();

  const [showAddModal, setShowAddModal] = useState(false);
  const [editEmp, setEditEmp] = useState(null);
  const [viewEmp, setViewEmp] = useState(null);
  const [deleteEmp, setDeleteEmp] = useState(null);
  const [showToast, setShowToast] = useState(null);

  const fetchEmployees = async () => {
    setLoading(true);
    try {
      const response = await axiosInstance.get("/v1/staff");
      if (response.data.success) {
        setEmployees(response.data.data);
      }
    } catch (err) {
      console.error("Error fetching employees:", err);
      toast.error("Failed to fetch employees");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchEmployees();
  }, [deptFilter, searchTerm]);



  const handleClickOutside = () => setOpenMenuId(null);
  useEffect(() => {
    window.addEventListener("click", handleClickOutside);
    return () => window.removeEventListener("click", handleClickOutside);
  }, []);

  const handleAction = (label, emp) => {
    setOpenMenuId(null);
    if (label === "Edit Info") navigate(`/admin/employee/create?id=${emp._id}`);
    else if (label === "Delete Record") setDeleteEmp(emp);
    else if (label === "Change Status") {
      const newStatus = emp.status === "active" ? "inactive" : "active";
      setEmployees((prev) =>
        prev.map((p) => (p.id === emp.id ? { ...p, status: newStatus } : p)),
      );
      setShowToast(`${emp.name}'s status changed to ${newStatus}`);
      setTimeout(() => setShowToast(null), 3000);
    } else if (label === "Message") {
      setShowToast(`Messaging ${emp.name}...`);
      setTimeout(() => setShowToast(null), 3000);
    }
  };

  const filteredEmployees = useMemo(() => {
    return employees.filter((emp) => {
      const matchesSearch =
        emp.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        emp.id.toLowerCase().includes(searchTerm.toLowerCase());
      const matchesDept = deptFilter === "all" || emp.department === deptFilter;
      return matchesSearch && matchesDept;
    });
  }, [searchTerm, deptFilter, employees]);

  const currentItems = useMemo(() => {
    const start = (currentPage - 1) * itemsPerPage;
    return filteredEmployees.slice(start, start + itemsPerPage);
  }, [currentPage, filteredEmployees]);

  const handleSaveNew = (data) => {
    const newId = `EMP${1000 + employees.length + 1}`;
    setEmployees([
      {
        ...data,
        id: newId,
        status: "active",
        photo: `https://api.dicebear.com/7.x/avataaars/svg?seed=${newId}`,
      },
      ...employees,
    ]);
    setShowAddModal(false);
    setShowToast(`${data.name} added successfully!`);
    setTimeout(() => setShowToast(null), 3000);
  };

  const handleUpdate = (data) => {
    setEmployees((prev) =>
      prev.map((p) => (p.id === data.id ? { ...p, ...data } : p)),
    );
    setEditEmp(null);
    setShowToast(`${data.name}'s record updated!`);
    setTimeout(() => setShowToast(null), 3000);
  };

  const handleDelete = async () => {
    try {
      const response = await axiosInstance.delete(`/v1/staff/${deleteEmp._id}`);
      if (response.data.success) {
        setEmployees((prev) => prev.filter((p) => p._id !== deleteEmp._id));
        setShowToast(`${deleteEmp.name} removed from system.`);
      }
    } catch (err) {
      console.error(err);
      toast.error("Failed to delete employee");
    }
    setDeleteEmp(null);
    setTimeout(() => setShowToast(null), 3000);
  };

  const departments = [
    "Academic",
    "Arabic",
    "Administration",
    "Maintenance",
    "Kitchen",
  ];

  return (
    <div className="animate-in fade-in duration-500">
      {/* Header */}
      <div className="flex items-center justify-between mb-5 w-full">
        <div>
          <h1 className="text-[20px] font-black text-slate-800 flex items-center gap-3">
            <Users className="w-8 h-8 text-[#00315e]" />
            Employee Management
          </h1>
        </div>

        <div className="flex items-center justify-between gap-4">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
            <input
              type="text"
              placeholder="Search by ID or Name..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-10 pr-4 py-2 bg-[#fff] border border-slate-200 text-slate-900 rounded-[8px] outline-none focus:ring-0.5 focus:ring-blue-500 transition-all"
            />
          </div>

          <div className="flex gap-3 w-full md:w-auto">
            <Link to="/admin/employee/create" className="w-full sm:w-auto">
              <button className="w-full px-4 py-2 bg-[#00315e] text-white rounded-[8px] cursor-pointer flex items-center gap-2">
                <Plus className="w-4 h-4" />
                Add Staff
              </button>
            </Link>
          </div>
        </div>
      </div>

      {/* Stats Summary */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
        {[
          {
            label: "Total Staff",
            value: employees.length,
            icon: Users,
            color: "text-blue-600",
            bg: "bg-blue-100",
          },
          {
            label: "Active",
            value: employees.filter((e) => e.status === "active").length,
            icon: CheckCircle,
            color: "text-blue-600",
            bg: "bg-blue-100",
          },
          {
            label: "Inactive",
            value: employees.filter((e) => e.status === "inactive").length,
            icon: XCircle,
            color: "text-rose-600",
            bg: "bg-rose-100",
          },
        ].map((stat, idx) => (
          <div
            key={idx}
            className="bg-white rounded-[8px] p-5 flex items-center justify-between shadow-lg relative overflow-hidden"
          >
            <div className="absolute -top-[5%] -left-[20%] h-[200px] w-[200px] bg-[#00315e24] rounded-full group-hover:scale-110 transition-transform duration-500"></div>

            <div className="z-[10]">
              <p className="text-2xl font-black text-slate-800 mb-1">{stat.value}</p>
              <p className="text-xs font-bold text-slate-500 uppercase ">
                {stat.label}
              </p>
            </div>
            <div
              className={`w-12 h-12 ${stat.bg} rounded-xl flex items-center justify-center`}
            >
              <stat.icon className={`w-6 h-6 ${stat.color}`} />
            </div>
          </div>
        ))}
      </div>

      {/* Table Container */}
      <div className="bg-white rounded-[10px] shadow-xl shadow-slate-100/50 overflow-hidden relative mt-8">
        {loading ? (
          <div className="flex-1 flex flex-col items-center justify-center py-20">
            <div className="w-12 h-12 border-4 border-[#00315e] border-t-transparent rounded-full animate-spin mb-4"></div>
            <p className="text-slate-500 font-bold">Loading staff data...</p>
          </div>
        ) : filteredEmployees.length === 0 ? (
          <div className="flex-1 flex flex-col items-center justify-center py-20">
            <div className="w-16 h-16 bg-slate-50 text-slate-400 rounded-full flex items-center justify-center mb-4">
              <Search className="w-8 h-8" />
            </div>
            <p className="text-slate-500 font-bold">No staff found</p>
          </div>
        ) : (
          <>
            <div className="overflow-x-auto rounded-t-[8px]">
              <table className="w-full">
                <thead className="bg-[#00315e24]">
                  <tr className="whitespace-nowrap">
                    <th className="px-10 py-3.5 text-left text-[12px] font-black">
                      Employee ID
                    </th>
                    <th className="px-10 py-3.5 text-left text-[12px] font-black">
                      Employee Info
                    </th>
                    <th className="px-10 py-3.5 text-left text-[12px] font-black">
                      Department
                    </th>
                    <th className="px-10 py-3.5 text-left text-[12px] font-black">
                      Contact
                    </th>
                    <th className="px-10 py-3.5 text-left text-[12px] font-black">
                      Status
                    </th>
                    <th className="px-10 py-3.5 text-left text-[12px] font-black">
                      Action
                    </th>
                  </tr>
                </thead>
                <tbody className="divide-y-2 divide-slate-100">
                  {currentItems.map((emp, i) => (
                    <tr
                      key={emp._id}
                      className="group hover:bg-amber-50/10 transition-all duration-300"
                    >
                      <td className="px-6 py-4 whitespace-nowrap text-center">
                        <span className="text-sm font-black ">
                          {i + 1}
                        </span>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="flex items-center gap-3">
                          <div className="w-10 h-10 rounded-full overflow-hidden shadow-sm">
                            <img
                              src={emp.photo}
                              alt={emp.name}
                              className="w-full h-full object-cover"
                            />
                          </div>
                          <div>
                            <p className="text-sm font-bold text-slate-800">
                              {emp.name}
                            </p>
                            <p className="text-[10px] text-slate-500 font-bold uppercase tracking-wider">
                              {emp.designation}
                            </p>
                          </div>
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <span className="px-3 py-1 bg-blue-50 text-[#00315e] rounded-md text-xs font-bold uppercase">
                          {emp.department}
                        </span>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="space-y-1 text-xs font-bold text-slate-600">
                          <div className="flex items-center gap-1.5">
                            <Phone className="w-3.5 h-3.5 text-[#00315e]" />
                            {emp.phone}
                          </div>
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <span
                          className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full text-[10px] font-black uppercase tracking-widest  ${emp.status === "active"
                            ? "bg-blue-50 text-blue-700 border-blue-100"
                            : "bg-rose-50 text-rose-700 border-rose-100"
                            }`}
                        >
                          <div
                            className={`w-1.5 h-1.5 rounded-full ${emp.status === "active"
                              ? "bg-blue-500"
                              : "bg-rose-500"
                              }`}
                          />
                          {emp.status}
                        </span>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="flex items-center gap-4">
                          <button
                            className="cursor-pointer"
                            onClick={(e) => {
                              e.stopPropagation();
                              setViewEmp(emp);
                            }}
                          >
                            <Eye className="w-5 h-5 text-[#00315e]" />
                          </button>
                          <Link to={`/admin/employee/create?id=${emp._id}`} className="cursor-pointer">
                            <SquarePen className="w-4 h-4 text-[#00315e]" />
                          </Link>
                          <button
                            className="cursor-pointer"
                            onClick={(e) => {
                              e.stopPropagation();
                              setDeleteEmp(emp);
                            }}
                          >
                            <Trash2 className="w-4 h-4 text-red-500" />
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            {/* Pagination Controls */}
            <div className="bg-slate-50/50 px-6 py-4 border-t-2 border-slate-50 flex flex-col sm:flex-row items-center justify-between gap-4">
              <p className="text-xs font-bold text-slate-500 uppercase tracking-wider">
                Showing{" "}
                <span className="text-slate-900">
                  {(currentPage - 1) * itemsPerPage + (currentItems.length > 0 ? 1 : 0)}
                </span>{" "}
                to{" "}
                <span className="text-slate-900">
                  {(currentPage - 1) * itemsPerPage + currentItems.length}
                </span>{" "}
                of <span className="text-slate-900">{filteredEmployees.length}</span>{" "}
                staff
              </p>
              <div className="flex items-center gap-2">
                <button
                  disabled={currentPage === 1}
                  onClick={() => setCurrentPage((p) => Math.max(1, p - 1))}
                  className="p-2 border-2 border-slate-200 rounded-xl bg-white text-slate-600 hover:bg-slate-50 hover:border-[#00315e] hover:text-[#00315e] disabled:opacity-50 disabled:cursor-not-allowed transition-all"
                >
                  <ChevronLeft className="w-5 h-5" />
                </button>
                <div className="flex items-center gap-1">
                  {[...Array(Math.max(1, Math.ceil(filteredEmployees.length / itemsPerPage)))].map((_, i) => (
                    <button
                      key={i + 1}
                      onClick={() => setCurrentPage(i + 1)}
                      className={`w-10 h-10 rounded-xl text-xs font-black transition-all border-2 ${currentPage === i + 1
                        ? "bg-[#00315e] border-[#00315e] text-white cursor-pointer"
                        : "bg-white border-slate-200 text-slate-600 hover:border-[#00315e] hover:text-[#00315e] cursor-pointer"
                        }`}
                    >
                      {i + 1}
                    </button>
                  ))}
                </div>
                <button
                  disabled={currentPage === Math.max(1, Math.ceil(filteredEmployees.length / itemsPerPage))}
                  onClick={() => setCurrentPage((p) => Math.min(Math.max(1, Math.ceil(filteredEmployees.length / itemsPerPage)), p + 1))}
                  className="p-2 border-2 border-slate-200 rounded-xl bg-white text-slate-600 hover:bg-slate-50 hover:border-[#00315e] hover:text-[#00315e] disabled:opacity-50 disabled:cursor-not-allowed transition-all"
                >
                  <ChevronRight className="w-5 h-5" />
                </button>
              </div>
            </div>
          </>
        )}
      </div>

      {/* Modals & Toasts */}
      {showAddModal && (
        <EmployeeFormModal
          onClose={() => setShowAddModal(false)}
          onSave={handleSaveNew}
          title="Add Staff Member"
          departments={departments}
        />
      )}
      {editEmp && (
        <EmployeeFormModal
          emp={editEmp}
          onClose={() => setEditEmp(null)}
          onSave={handleUpdate}
          title="Edit Staff Record"
          departments={departments}
        />
      )}
      {viewEmp && (
        <EmployeeViewModal emp={viewEmp} onClose={() => setViewEmp(null)} />
      )}

      {deleteEmp && (
        <div
          className="fixed inset-0 bg-slate-900/60 backdrop-blur-sm z-[200] flex items-center justify-center p-4"
          onClick={() => setDeleteEmp(null)}
        >
          <div
            className="bg-white rounded-[2.5rem] p-10 max-w-sm w-full text-center shadow-2xl animate-in zoom-in duration-300"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="w-20 h-20 bg-rose-50 rounded-3xl flex items-center justify-center mx-auto mb-8 shadow-inner">
              <Trash2 className="w-10 h-10 text-rose-500" />
            </div>
            <h2 className="text-2xl font-black text-slate-800 mb-3 tracking-tight">
              Erase Record?
            </h2>
            <p className="text-sm font-bold text-slate-500 mb-8 leading-relaxed">
              Are you sure you want to permanently delete{" "}
              <span className="text-rose-600">{deleteEmp.name}</span>? This
              Cannot be undone.
            </p>
            <div className="flex gap-4">
              <button
                onClick={() => setDeleteEmp(null)}
                className="flex-1 py-4 bg-slate-100 text-slate-600 font-black rounded-2xl hover:bg-slate-200 transition-all uppercase text-xs tracking-widest"
              >
                Cancel
              </button>
              <button
                onClick={handleDelete}
                className="flex-1 py-4 bg-rose-600 text-white font-black rounded-2xl shadow-xl shadow-rose-200 hover:scale-105 transition-all uppercase text-xs tracking-widest"
              >
                Delete Now
              </button>
            </div>
          </div>
        </div>
      )}

      {showToast && (
        <div className="fixed bottom-10 left-1/2 -translate-x-1/2 z-[300] animate-in slide-in-from-bottom-5 duration-500 px-4">
          <div className="bg-slate-900 border border-slate-800 text-white px-8 py-4 rounded-[2rem] shadow-2xl flex items-center gap-4">
            <div className="w-8 h-8 bg-emerald-500 rounded-full flex items-center justify-center shadow-emerald-500/50 shadow-lg">
              <CheckCircle className="w-5 h-5" />
            </div>
            <p className="text-sm font-black tracking-tight">{showToast}</p>
          </div>
        </div>
      )}
    </div>
  );
};

const EmployeeFormModal = ({ emp, onClose, onSave, title, departments }) => {
  const [formData, setFormData] = useState(
    emp || {
      branch: "Main Branch",
      role: "Teacher",
      joinDate: "2026-01-08",
      designation: "Senior Teacher",
      department: departments[0],
      qualification: "",
      experience: "",
      name: "",
      gender: "Male",
      religion: "Islam",
      bloodGroup: "A+",
      dob: "",
      phone: "",
      email: "",
      presentAddress: "",
      permanentAddress: "",
      username: "",
      password: "",
      confirmPassword: "",
      facebook: "",
      twitter: "",
      linkedin: "",
      bankName: "",
      holderName: "",
      bankBranch: "",
      bankAddress: "",
      ifscCode: "",
      accountNo: "",
      skipBank: false,
    },
  );

  const [activeSection, setActiveSection] = useState("Academic");

  const sections = [
    { id: "Academic", icon: GraduationCap, label: "Academic Info" },
    { id: "Personal", icon: User, label: "Personal Bio" },
    { id: "Login", icon: Lock, label: "Login Access" },
    { id: "Social", icon: Facebook, label: "Social Reach" },
    { id: "Bank", icon: CreditCard, label: "Bank Account" },
  ];

  return (
    <div
      className="fixed inset-0 bg-slate-900/40 backdrop-blur-xl z-[200] flex items-center justify-center p-4 overflow-hidden"
      onClick={onClose}
    >
      {/* Decorative Background Elements */}
      <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-emerald-400/20 rounded-full blur-[100px] animate-pulse" />
      <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-blue-400/10 rounded-full blur-[100px] animate-pulse delay-700" />

      <div
        className="bg-white/80 border border-white/50 rounded-[4rem] w-full max-w-5xl h-[85vh] shadow-[0_32px_120px_-10px_rgba(0,0,0,0.3)] flex flex-col animate-in zoom-in duration-700 overflow-hidden relative"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Modal Header */}
        <div className="px-12 py-10 border-b border-slate-100 flex items-center justify-between shrink-0 relative bg-white/40 backdrop-blur-sm">
          <div className="flex items-center gap-6">
            <div className="w-16 h-16 bg-gradient-to-br from-emerald-600 to-teal-400 rounded-3xl flex items-center justify-center shadow-2xl shadow-emerald-200 rotate-3 group-hover:rotate-6 transition-transform">
              <Briefcase className="w-8 h-8 text-white" />
            </div>
            <div>
              <h2 className="text-4xl font-black text-slate-800 tracking-tight flex items-center gap-3">
                {title}
              </h2>
              <p className="text-[11px] font-black text-slate-400 uppercase tracking-[0.3em] mt-1.5 flex items-center gap-2">
                <span className="w-2 h-2 bg-emerald-500 rounded-full animate-ping" />
                Human Capital Gateway
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="group p-5 bg-slate-50 border border-slate-200 text-slate-400 hover:text-rose-500 hover:border-rose-100 rounded-[2rem] transition-all hover:scale-110 active:scale-90 shadow-sm"
          >
            <X className="w-7 h-7 group-hover:rotate-90 transition-transform duration-500" />
          </button>
        </div>

        <div className="flex flex-1 overflow-hidden">
          {/* Sidebar Navigation */}
          <div className="w-72 border-r border-slate-100 p-8 flex flex-col gap-4 shrink-0 bg-slate-50/20 backdrop-blur-md">
            {sections.map((s) => (
              <button
                key={s.id}
                onClick={() => setActiveSection(s.id)}
                className={`group relative flex items-center gap-5 px-6 py-5 rounded-[2rem] text-sm font-black transition-all ${activeSection === s.id
                  ? "text-white translate-x-3"
                  : "text-slate-400 hover:bg-white hover:text-emerald-600 hover:translate-x-1"
                  }`}
              >
                {activeSection === s.id && (
                  <div className="absolute inset-0 bg-gradient-to-r from-emerald-600 to-teal-500 rounded-[2rem] shadow-[0_15px_40px_-5px_rgba(16,185,129,0.3)] animate-in slide-in-from-left-4 duration-500" />
                )}
                <div
                  className={`relative z-10 w-10 h-10 rounded-xl flex items-center justify-center transition-all ${activeSection === s.id
                    ? "bg-white/20"
                    : "bg-slate-100 group-hover:bg-emerald-50"
                    }`}
                >
                  <s.icon
                    className={`w-5 h-5 transition-transform group-hover:scale-110 ${activeSection === s.id
                      ? "text-white"
                      : "text-slate-400 group-hover:text-emerald-600"
                      }`}
                  />
                </div>
                <span className="relative z-10 tracking-tight">{s.label}</span>
                {activeSection === s.id && (
                  <div className="absolute -left-2 top-1/2 -translate-y-1/2 w-1.5 h-8 bg-white rounded-full transition-all" />
                )}
              </button>
            ))}
          </div>

          {/* Form Content */}
          <form
            onSubmit={(e) => {
              e.preventDefault();
              onSave(formData);
            }}
            className="flex-1 overflow-y-auto p-12 custom-scrollbar bg-white/30 backdrop-blur-sm shadow-inner selection:bg-emerald-100"
          >
            {activeSection === "Academic" && (
              <div className="space-y-10 animate-in fade-in slide-in-from-bottom-8 duration-700">
                <SectionHeader
                  title="Academic Professional Data"
                  subtitle="Define the employee's role and hierarchy within the institution"
                />
                <div className="grid grid-cols-1 md:grid-cols-2 gap-10">
                  <FormInput
                    label="Institutional Branch"
                    field="branch"
                    type="select"
                    options={["Main Branch", "South Campus"]}
                    formData={formData}
                    setFormData={setFormData}
                    icon={Building2}
                  />
                  <FormInput
                    label="Access Role"
                    field="role"
                    type="select"
                    options={["Teacher", "Admin", "Staff", "Manager"]}
                    formData={formData}
                    setFormData={setFormData}
                    icon={ShieldCheck}
                  />
                  <FormInput
                    label="Joining Date"
                    field="joinDate"
                    type="date"
                    formData={formData}
                    setFormData={setFormData}
                    icon={Calendar}
                  />
                  <FormInput
                    label="Official Designation"
                    field="designation"
                    type="select"
                    options={[
                      "Senior Teacher",
                      "Head Teacher",
                      "Accountant",
                      "Clerk",
                    ]}
                    formData={formData}
                    setFormData={setFormData}
                    icon={GraduationCap}
                  />
                  <FormInput
                    label="Primary Department"
                    field="department"
                    type="select"
                    options={departments}
                    formData={formData}
                    setFormData={setFormData}
                    icon={Building2}
                  />
                  <FormInput
                    label="Professional Qualification"
                    field="qualification"
                    placeholder="e.g. M.A in Arabic"
                    formData={formData}
                    setFormData={setFormData}
                    icon={FileText}
                  />
                  <FormInput
                    label="Institutional Experience"
                    field="experience"
                    placeholder="e.g. 10 Years in Qawmi Madrasa"
                    isFull
                    formData={formData}
                    setFormData={setFormData}
                    icon={Briefcase}
                  />
                </div>
              </div>
            )}

            {activeSection === "Personal" && (
              <div className="space-y-10 animate-in fade-in slide-in-from-bottom-8 duration-700">
                <SectionHeader
                  title="Core Employee Bio"
                  subtitle="Essential personal identification and contact information"
                />
                <div className="grid grid-cols-1 md:grid-cols-2 gap-10">
                  <FormInput
                    label="Legal Full Name"
                    field="name"
                    required
                    formData={formData}
                    setFormData={setFormData}
                    icon={User}
                  />
                  <FormInput
                    label="Gender Identity"
                    field="gender"
                    type="select"
                    options={["Male", "Female", "Other"]}
                    formData={formData}
                    setFormData={setFormData}
                    icon={Users}
                  />
                  <FormInput
                    label="Religious Affiliation"
                    field="religion"
                    type="select"
                    options={["Islam", "Hinduism", "Christianity", "Others"]}
                    formData={formData}
                    setFormData={setFormData}
                    icon={Heart}
                  />
                  <FormInput
                    label="Blood Type"
                    field="bloodGroup"
                    type="select"
                    options={["A+", "A-", "B+", "B-", "O+", "O-", "AB+", "AB-"]}
                    formData={formData}
                    setFormData={setFormData}
                    icon={Droplets}
                  />
                  <FormInput
                    label="Birth Date"
                    field="dob"
                    type="date"
                    formData={formData}
                    setFormData={setFormData}
                    icon={Calendar}
                  />
                  <FormInput
                    label="Mobile Contact"
                    field="phone"
                    required
                    placeholder="017xxxxxxxx"
                    formData={formData}
                    setFormData={setFormData}
                    icon={Phone}
                  />
                  <FormInput
                    label="Official Email"
                    field="email"
                    type="email"
                    placeholder="example@mail.com"
                    formData={formData}
                    setFormData={setFormData}
                    icon={Mail}
                  />
                  <div className="md:col-span-2 space-y-10">
                    <FormInput
                      label="Resident Address (Present)"
                      field="presentAddress"
                      type="textarea"
                      formData={formData}
                      setFormData={setFormData}
                      icon={MapPin}
                    />
                    <FormInput
                      label="Native Address (Permanent)"
                      field="permanentAddress"
                      type="textarea"
                      formData={formData}
                      setFormData={setFormData}
                      icon={Map}
                    />
                  </div>
                  <div className="md:col-span-2 relative group p-12 border-4 border-dashed border-slate-100 rounded-[4rem] bg-slate-50/50 hover:bg-emerald-50/30 hover:border-emerald-200 transition-all cursor-pointer text-center group-hover:scale-[1.01]">
                    <div className="w-24 h-24 bg-white rounded-[2rem] shadow-xl flex items-center justify-center mx-auto mb-6 group-hover:rotate-6 transition-transform">
                      <Users className="w-12 h-12 text-emerald-500" />
                    </div>
                    <h4 className="text-xl font-black text-slate-800 tracking-tight">
                      Biometric Photo Capture
                    </h4>
                    <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mt-2 px-12 leading-relaxed">
                      Drag high-resolution portrait here or click to browse
                      files
                    </p>
                    <div className="absolute -top-4 -right-4 w-12 h-12 bg-white rounded-full shadow-lg border border-slate-100 flex items-center justify-center animate-bounce">
                      <Plus className="w-6 h-6 text-emerald-600" />
                    </div>
                  </div>
                </div>
              </div>
            )}

            {activeSection === "Login" && (
              <div className="h-full flex flex-col justify-center animate-in fade-in slide-in-from-bottom-8 duration-700">
                <div className="max-w-md mx-auto w-full space-y-12 py-10">
                  <SectionHeader
                    title="System Access Security"
                    subtitle="Configure portal credentials for official institutional use"
                    centered
                  />
                  <div className="space-y-8">
                    <FormInput
                      label="Portal Username"
                      field="username"
                      required
                      icon={User}
                      formData={formData}
                      setFormData={setFormData}
                    />
                    <FormInput
                      label="Secure Password"
                      field="password"
                      type="password"
                      required
                      icon={Lock}
                      formData={formData}
                      setFormData={setFormData}
                    />
                    <FormInput
                      label="Validate Password"
                      field="confirmPassword"
                      type="password"
                      required
                      icon={Lock}
                      formData={formData}
                      setFormData={setFormData}
                    />
                  </div>
                  <div className="p-6 bg-blue-50 border-2 border-blue-100 rounded-3xl flex items-center gap-5">
                    <ShieldAlert className="w-8 h-8 text-blue-500 shrink-0" />
                    <p className="text-[11px] font-bold text-blue-800 leading-relaxed uppercase tracking-tight">
                      Passwords must be at least 8 characters and include
                      numeric complexity.
                    </p>
                  </div>
                </div>
              </div>
            )}

            {activeSection === "Social" && (
              <div className="h-full flex flex-col justify-center animate-in fade-in slide-in-from-bottom-8 duration-700">
                <div className="max-w-xl mx-auto w-full space-y-12 py-10">
                  <SectionHeader
                    title="Digital Footprint"
                    subtitle="Link professional social media profiles for the directory"
                    centered
                  />
                  <div className="space-y-8">
                    <FormInput
                      label="Facebook Identity"
                      field="facebook"
                      placeholder="https://facebook.com/username"
                      icon={Facebook}
                      formData={formData}
                      setFormData={setFormData}
                    />
                    <FormInput
                      label="Twitter / X Profile"
                      field="twitter"
                      placeholder="https://twitter.com/username"
                      icon={Twitter}
                      formData={formData}
                      setFormData={setFormData}
                    />
                    <FormInput
                      label="LinkedIn Professional"
                      field="linkedin"
                      placeholder="https://linkedin.com/in/username"
                      icon={Linkedin}
                      formData={formData}
                      setFormData={setFormData}
                    />
                  </div>
                </div>
              </div>
            )}

            {activeSection === "Bank" && (
              <div className="space-y-10 animate-in fade-in slide-in-from-bottom-8 duration-700">
                <div className="flex items-center justify-between bg-gradient-to-r from-amber-600 to-orange-400 p-10 rounded-[3rem] shadow-2xl shadow-orange-200 border border-white/20">
                  <div className="flex items-center gap-6">
                    <div className="w-16 h-16 bg-white/20 backdrop-blur-md rounded-[1.5rem] flex items-center justify-center border border-white/30">
                      <CreditCard className="w-8 h-8 text-white" />
                    </div>
                    <div>
                      <p className="text-xl font-black text-white tracking-tight uppercase">
                        Skip Financial Registry?
                      </p>
                      <p className="text-orange-50 text-[10px] font-bold uppercase tracking-widest mt-1 opacity-80">
                        You can provide these details during payroll setup
                        later.
                      </p>
                    </div>
                  </div>
                  <button
                    type="button"
                    onClick={() =>
                      setFormData({ ...formData, skipBank: !formData.skipBank })
                    }
                    className={`w-20 h-11 rounded-full border-4 border-white/30 transition-all relative ${formData.skipBank
                      ? "bg-white shadow-[0_0_20px_rgba(255,255,255,0.4)]"
                      : "bg-black/20"
                      }`}
                  >
                    <div
                      className={`absolute top-1 w-7 h-7 rounded-full transition-all duration-500 transform ${formData.skipBank
                        ? "left-10 bg-orange-600"
                        : "left-1.5 bg-white/60"
                        }`}
                    />
                  </button>
                </div>

                {!formData.skipBank && (
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-10">
                    <FormInput
                      label="Institution Bank"
                      field="bankName"
                      required
                      icon={Building2}
                      formData={formData}
                      setFormData={setFormData}
                    />
                    <FormInput
                      label="Beneficiary Holder"
                      field="holderName"
                      required
                      icon={User}
                      formData={formData}
                      setFormData={setFormData}
                    />
                    <FormInput
                      label="Operational Branch"
                      field="bankBranch"
                      required
                      icon={MapPin}
                      formData={formData}
                      setFormData={setFormData}
                    />
                    <FormInput
                      label="IFSC / SWIFT Code"
                      field="ifscCode"
                      icon={ShieldCheck}
                      formData={formData}
                      setFormData={setFormData}
                    />
                    <FormInput
                      label="Checking Account No"
                      field="accountNo"
                      required
                      icon={CreditCard}
                      formData={formData}
                      setFormData={setFormData}
                    />
                    <div className="md:col-span-2">
                      <FormInput
                        label="Bank Physical Address"
                        field="bankAddress"
                        type="textarea"
                        icon={Map}
                        formData={formData}
                        setFormData={setFormData}
                      />
                    </div>
                  </div>
                )}
              </div>
            )}
          </form>
        </div>

        {/* Modal Footer */}
        <div className="p-10 border-t border-slate-100 flex items-center justify-between bg-slate-50/50 backdrop-blur-md relative overflow-hidden">
          <div className="absolute bottom-0 left-0 w-full h-1 bg-gradient-to-r from-transparent via-blue-500 to-transparent opacity-20" />
          <div className="flex items-center gap-4 text-slate-400 relative z-10 font-bold text-[11px] uppercase tracking-widest">
            <div className="w-10 h-10 bg-white rounded-xl shadow-sm flex items-center justify-center">
              <ShieldCheck className="w-5 h-5 text-emerald-500" />
            </div>
            <span>Blockchain-Encrypted Registry Protocol</span>
          </div>
          <div className="flex gap-6 relative z-10">
            <button
              onClick={onClose}
              className="px-14 py-5 bg-white text-slate-600 font-black rounded-[2.5rem] border-2 border-slate-200 hover:bg-slate-50 hover:border-slate-300 transition-all uppercase text-[10px] tracking-[0.2em] hover:scale-105 active:scale-95"
            >
              Discard Data
            </button>
            <button
              onClick={(e) => onSave(formData)}
              className="group px-16 py-5 bg-gradient-to-r from-emerald-600 to-teal-500 text-white font-black rounded-[2.5rem] shadow-[0_20px_50px_-10px_rgba(16,185,129,0.4)] hover:shadow-[0_25px_60px_-10px_rgba(16,185,129,0.5)] hover:scale-[1.05] active:scale-95 transition-all uppercase text-[10px] tracking-[0.2em] flex items-center gap-3"
            >
              <Save className="w-5 h-5 group-hover:animate-bounce" /> Commit
              Staff Profile
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

// Reusable Section Header Component
const SectionHeader = ({ title, subtitle, centered }) => (
  <div
    className={`space-y-2 pb-6 border-b-2 border-slate-50/50 ${centered ? "text-center" : ""
      }`}
  >
    <h3 className="text-3xl font-black text-slate-800 tracking-tight bg-gradient-to-br from-slate-900 via-slate-700 to-slate-500 bg-clip-text text-transparent">
      {title}
    </h3>
    <p className="text-[11px] font-black text-slate-400 uppercase tracking-[0.25em]">
      {subtitle}
    </p>
  </div>
);

// Reusable Input Component for the form
const FormInput = ({
  label,
  field,
  type = "text",
  options,
  required,
  isFull,
  placeholder,
  formData,
  setFormData,
  icon: Icon,
}) => {
  return (
    <div className={`${isFull ? "md:col-span-2" : ""} space-y-4 group`}>
      <label className="text-[11px] font-black text-slate-400 uppercase tracking-widest flex items-center gap-3 group-focus-within:text-emerald-500 transition-colors">
        <div className="w-8 h-8 bg-slate-100 group-focus-within:bg-emerald-500 group-focus-within:text-white rounded-lg flex items-center justify-center transition-all group-focus-within:shadow-lg group-focus-within:shadow-emerald-200 group-focus-within:scale-110">
          {Icon && <Icon className="w-4 h-4" />}
        </div>
        {label} {required && <span className="text-rose-500 text-lg">*</span>}
      </label>
      {type === "select" ? (
        <div className="relative">
          <select
            value={formData[field]}
            onChange={(e) =>
              setFormData({ ...formData, [field]: e.target.value })
            }
            className="w-full px-8 py-5 bg-slate-100/50 border-2 border-transparent focus:border-emerald-500 focus:bg-white rounded-[2rem] outline-none font-black text-slate-800 transition-all appearance-none cursor-pointer shadow-inner focus:shadow-[0_10px_30px_-10px_rgba(16,185,129,0.2)]"
          >
            {options.map((opt) => (
              <option key={opt} value={opt}>
                {opt}
              </option>
            ))}
          </select>
          <div className="absolute right-6 top-1/2 -translate-y-1/2 w-8 h-8 bg-white rounded-full flex items-center justify-center pointer-events-none shadow-sm">
            <ChevronDown className="w-4 h-4 text-emerald-600" />
          </div>
        </div>
      ) : type === "textarea" ? (
        <textarea
          value={formData[field]}
          onChange={(e) =>
            setFormData({ ...formData, [field]: e.target.value })
          }
          placeholder={placeholder}
          rows={4}
          className="w-full px-8 py-6 bg-slate-100/50 border-2 border-transparent focus:border-emerald-500 focus:bg-white rounded-[2.5rem] outline-none font-black text-slate-800 transition-all resize-none shadow-inner focus:shadow-[0_15px_40px_-5px_rgba(16,185,129,0.2)]"
        />
      ) : (
        <div className="relative">
          <input
            type={type}
            value={formData[field]}
            onChange={(e) =>
              setFormData({ ...formData, [field]: e.target.value })
            }
            placeholder={placeholder}
            className="w-full px-8 py-5 bg-slate-100/50 border-2 border-transparent focus:border-emerald-500 focus:bg-white rounded-[2rem] outline-none font-black text-slate-800 transition-all shadow-inner focus:shadow-[0_10px_30px_-10px_rgba(16,185,129,0.2)]"
          />
          {type === "password" && (
            <Lock className="absolute right-8 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-300" />
          )}
        </div>
      )}
    </div>
  );
};

const EmployeeViewModal = ({ emp, onClose }) => {
  return (
    <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-sm z-[200] flex items-start justify-center p-10 overflow-y-auto">
      <div
        className="bg-white rounded-[3.5rem] w-full max-w-4xl shadow-2xl animate-in zoom-in duration-300 overflow-hidden"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="h-56 bg-gradient-to-br from-emerald-600 via-teal-500 to-emerald-700 relative overflow-hidden">
          <div
            className="absolute inset-0 opacity-20"
            style={{
              backgroundImage:
                "radial-gradient(circle at 2px 2px, white 1px, transparent 0)",
              backgroundSize: "24px 24px",
            }}
          />
          <div className="absolute -bottom-20 left-12 p-2 bg-white rounded-[2.5rem] shadow-2xl relative z-10">
            <div className="w-40 h-40 rounded-[2rem] overflow-hidden border-2 border-slate-50">
              <img
                src={emp.photo}
                alt=""
                className="w-full h-full object-cover"
              />
            </div>
          </div>
          <button
            onClick={onClose}
            className="absolute top-8 right-8 p-4 bg-white/20 hover:bg-white text-white hover:text-emerald-600 rounded-[1.5rem] transition-all backdrop-blur-md border border-white/20 z-20"
          >
            <X className="w-6 h-6" />
          </button>

          <div className="absolute bottom-8 right-12 text-right hidden md:block">
            <p className="text-[10px] font-black text-emerald-100 uppercase tracking-[0.3em] mb-1">
              Authenticated Entity
            </p>
            <h3 className="text-4xl font-black text-white tracking-widest">
              {emp.id}
            </h3>
          </div>
        </div>

        <div className="px-12 pt-24 pb-12">
          <div className="flex flex-col md:flex-row md:items-end justify-between gap-8 mb-12 border-b-2 border-slate-50 pb-10">
            <div>
              <h2 className="text-5xl font-black text-slate-800 tracking-tighter leading-none mb-4">
                {emp.name}
              </h2>
              <div className="flex flex-wrap gap-3">
                <span className="px-5 py-2 bg-emerald-50 text-emerald-600 rounded-2xl text-[10px] font-black uppercase tracking-widest border-2 border-emerald-100">
                  {emp.designation}
                </span>
                <span className="px-5 py-2 bg-blue-50 text-blue-600 rounded-2xl text-[10px] font-black uppercase tracking-widest border-2 border-blue-100">
                  {emp.department}
                </span>
                <span className="px-5 py-2 bg-slate-50 text-slate-500 rounded-2xl text-[10px] font-black uppercase tracking-widest border-2 border-slate-100">
                  {emp.branch}
                </span>
              </div>
            </div>
            <div className="flex gap-4">
              <div className="bg-slate-50 p-6 rounded-[2rem] border-2 border-slate-100 text-center min-w-[120px]">
                <p className="text-[9px] font-black text-slate-400 uppercase tracking-widest mb-1">
                  Status
                </p>
                <p
                  className={`text-sm font-black uppercase tracking-widest ${emp.status === "active"
                    ? "text-emerald-600"
                    : "text-rose-500"
                    }`}
                >
                  {emp.status}
                </p>
              </div>
            </div>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-12">
            {/* Left Column: Personal & Contact */}
            <div className="lg:col-span-1 space-y-10 group">
              <div className="space-y-6">
                <h4 className="text-[10px] font-black text-emerald-500 uppercase tracking-[0.3em] flex items-center gap-2">
                  <User className="w-3 h-3" /> Core Identity
                </h4>
                <div className="space-y-5">
                  <InfoRow label="Gender" value={emp.gender} icon={Users} />
                  <InfoRow label="Religion" value={emp.religion} icon={Heart} />
                  <InfoRow
                    label="Blood Group"
                    value={emp.bloodGroup}
                    icon={Droplets}
                  />
                  <InfoRow
                    label="Date of Birth"
                    value={emp.dob}
                    icon={Calendar}
                  />
                </div>
              </div>
              <div className="space-y-6">
                <h4 className="text-[10px] font-black text-emerald-500 uppercase tracking-[0.3em] flex items-center gap-2">
                  <Phone className="w-3 h-3" /> Communication
                </h4>
                <div className="space-y-5">
                  <InfoRow label="Mobile" value={emp.phone} icon={Phone} />
                  <InfoRow label="Email" value={emp.email} icon={Mail} />
                </div>
              </div>
            </div>

            {/* Center Column: Professional & Address */}
            <div className="lg:col-span-1 space-y-10">
              <div className="space-y-6">
                <h4 className="text-[10px] font-black text-blue-500 uppercase tracking-[0.3em] flex items-center gap-2">
                  <GraduationCap className="w-3 h-3" /> Professional
                </h4>
                <div className="space-y-5">
                  <InfoRow
                    label="Joining Date"
                    value={emp.joinDate}
                    icon={Calendar}
                    color="blue"
                  />
                  <InfoRow
                    label="Qualification"
                    value={emp.qualification}
                    icon={FileText}
                    color="blue"
                  />
                  <InfoRow
                    label="Experience"
                    value={emp.experience}
                    icon={Briefcase}
                    color="blue"
                  />
                  <InfoRow
                    label="Username"
                    value={emp.username}
                    icon={Lock}
                    color="blue"
                  />
                </div>
              </div>
              <div className="space-y-6">
                <h4 className="text-[10px] font-black text-blue-500 uppercase tracking-[0.3em] flex items-center gap-2">
                  <MapPin className="w-3 h-3" /> Residence
                </h4>
                <div className="p-5 bg-slate-50 rounded-[1.5rem] border border-slate-100">
                  <p className="text-[9px] font-black text-slate-400 uppercase mb-2">
                    Present Address
                  </p>
                  <p className="text-xs font-bold text-slate-700 leading-relaxed">
                    {emp.presentAddress}
                  </p>
                </div>
              </div>
            </div>

            {/* Right Column: Bank & Social */}
            <div className="lg:col-span-1 space-y-10">
              <div className="space-y-6">
                <h4 className="text-[10px] font-black text-amber-500 uppercase tracking-[0.3em] flex items-center gap-2">
                  <CreditCard className="w-3 h-3" /> Financial Data
                </h4>
                {emp.bankName ? (
                  <div className="p-6 bg-gradient-to-br from-amber-50 to-orange-50 rounded-[2rem] border-2 border-amber-100/50 shadow-inner group">
                    <div className="flex items-center gap-4 mb-4">
                      <div className="w-10 h-10 bg-white rounded-xl flex items-center justify-center shadow-sm">
                        <Building2 className="w-5 h-5 text-amber-600" />
                      </div>
                      <div>
                        <p className="text-[10px] font-black text-amber-800 uppercase tracking-tighter">
                          Primary Bank
                        </p>
                        <p className="text-sm font-black text-slate-800">
                          {emp.bankName}
                        </p>
                      </div>
                    </div>
                    <div className="space-y-3 pt-3 border-t border-amber-200/40">
                      <p className="text-[10px] font-bold text-slate-500 tracking-widest uppercase">
                        Account Number
                      </p>
                      <p className="text-lg font-black text-slate-800 tracking-widest">
                        **** **** {emp.accountNo?.slice(-4)}
                      </p>
                    </div>
                  </div>
                ) : (
                  <div className="p-6 bg-slate-50 rounded-[2rem] border-2 border-dashed border-slate-200 text-center">
                    <ShieldAlert className="w-8 h-8 text-slate-300 mx-auto mb-2" />
                    <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">
                      Bank Details Skipped
                    </p>
                  </div>
                )}
              </div>
              <div className="space-y-6">
                <h4 className="text-[10px] font-black text-slate-400 uppercase tracking-[0.3em] flex items-center gap-2">
                  <Linkedin className="w-3 h-3" /> Connect
                </h4>
                <div className="flex gap-4">
                  {[
                    {
                      icon: Facebook,
                      color: "text-blue-600",
                      bg: "bg-blue-50",
                    },
                    { icon: Twitter, color: "text-cyan-500", bg: "bg-cyan-50" },
                    {
                      icon: Linkedin,
                      color: "text-blue-700",
                      bg: "bg-blue-50",
                    },
                  ].map((social, i) => (
                    <button
                      key={i}
                      className={`w-12 h-12 ${social.bg} ${social.color} rounded-2xl flex items-center justify-center hover:scale-110 active:scale-90 transition-all shadow-sm border border-transparent hover:border-slate-200`}
                    >
                      <social.icon className="w-5 h-5" />
                    </button>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>

        <div className="p-10 bg-slate-50 border-t-2 border-slate-100 flex items-center justify-between">
          <div className="flex gap-3">
            <button
              onClick={() => alert("Printing full profile...")}
              className="px-8 py-4 bg-white text-slate-600 font-black rounded-[1.5rem] border-2 border-slate-200 hover:bg-slate-100 transition-all text-[10px] uppercase tracking-widest flex items-center gap-2"
            >
              <FileText className="w-4 h-4 text-emerald-500" /> Export Dossier
            </button>
          </div>
          <button
            onClick={onClose}
            className="px-12 py-4 bg-slate-900 text-white font-black rounded-[1.5rem] hover:bg-black transition-all text-xs uppercase tracking-[0.2em] shadow-2xl"
          >
            Close
          </button>
        </div>
      </div>
    </div>
  );
};

// Reusable Info Row for Detail View
const InfoRow = ({ label, value, icon: Icon, color = "emerald" }) => {
  const colorMap = {
    emerald: "text-emerald-500 bg-emerald-50 border-emerald-100",
    blue: "text-blue-500 bg-blue-50 border-blue-100",
  };
  return (
    <div className="flex items-center gap-4 group cursor-default">
      <div
        className={`w-10 h-10 rounded-xl flex items-center justify-center border transition-all group-hover:scale-110 ${colorMap[color]}`}
      >
        <Icon className="w-4 h-4" />
      </div>
      <div>
        <p className="text-[9px] font-black text-slate-400 uppercase tracking-widest mb-0.5">
          {label}
        </p>
        <p className="text-[13px] font-black text-slate-700 group-hover:text-emerald-600 transition-colors">
          {value || "Not Specified"}
        </p>
      </div>
    </div>
  );
};

export default EmployeeList;
