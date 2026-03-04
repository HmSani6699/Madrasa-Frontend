import { useState, useMemo, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import {
  Search,
  Filter,
  Download,
  Eye,
  Plus,
  Users,
  GraduationCap,
  CheckCircle,
  XCircle,
  MoreVertical,
  Phone,
  Mail,
  MapPin,
  Calendar,
  BookOpen,
  X,
  Edit2,
  Trash2,
  UserCheck,
  CreditCard,
  ChevronLeft,
  ChevronRight,
  User,
  SquarePen,
  ImageIcon,
  Upload,
  Home,
  Calculator,
} from "lucide-react";
import SelectInputField from "../../components/SelectInputField";
import axiosInstance from "../../api/axiosInstance";
import { toast } from "react-hot-toast";
// Header Container Component Removed Duplicate Link Import

const StudentList = () => {
  const [searchTerm, setSearchTerm] = useState("");
  const [classFilter, setClassFilter] = useState("all");
  const [sectionFilter, setSectionFilter] = useState("all");
  const [openMenuId, setOpenMenuId] = useState(null);
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 10;
  const navigate = useNavigate();

  // New states for Action UI
  const [editStudent, setEditStudent] = useState(null);
  const [deleteStudent, setDeleteStudent] = useState(null);
  const [idCardStudent, setIdCardStudent] = useState(null);
  const [showStatusToast, setShowStatusToast] = useState(null);
  const [students, setStudents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [classes, setClasses] = useState([]);
  const [sections, setSections] = useState([]);
  const [isFilterOpen,setIsFilterOpen]=useState(false)
  const [tempFilters, setTempFilters] = useState({
    class_id: "all",
    section_id: "all"
  });
  const [filterSections, setFilterSections] = useState([]);
  const [feeTypes, setFeeTypes] = useState([]);

  const fetchData = async () => {
    try {
      const [classesRes, sectionsRes, feeTypesRes] = await Promise.all([
        axiosInstance.get("/v1/classes"),
        axiosInstance.get("/v1/sections"),
        axiosInstance.get("/fee-type/v1")
      ]);
      if (classesRes.data.success) setClasses(classesRes.data.data);
      if (sectionsRes.data.success) setSections(sectionsRes.data.data);
      if (feeTypesRes.data.success) setFeeTypes(feeTypesRes.data.data);
    } catch (err) {
      console.error("Error fetching filter data:", err);
    }
  };

  const fetchStudents = async () => {
    setLoading(true);
    try {
      const response = await axiosInstance.get("/v1/students", {
        params: {
          class_id: classFilter,
          section_id: sectionFilter,
          search: searchTerm,
          page: currentPage,
          limit: itemsPerPage
        }
      });
      if (response.data.success) {
        setStudents(response.data.data);
      }
    } catch (err) {
      console.error("Error fetching students:", err);
      toast.error("Failed to fetch students");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  useEffect(() => {
    const updateFilteredSections = () => {
      if (tempFilters.class_id === "all") {
        setFilterSections([]);
        setTempFilters(prev => ({ ...prev, section_id: "all" }));
      } else {
        const filtered = sections.filter(s => s.class_id === tempFilters.class_id);
        setFilterSections(filtered);
        setTempFilters(prev => ({ ...prev, section_id: "all" }));
      }
    };
    updateFilteredSections();
  }, [tempFilters.class_id, sections]);

  useEffect(() => {
    fetchStudents();
  }, [classFilter, sectionFilter, searchTerm, currentPage]);

  const handleClickOutside = () => setOpenMenuId(null);
  useEffect(() => {
    window.addEventListener("click", handleClickOutside);
    return () => window.removeEventListener("click", handleClickOutside);
  }, []);

  // Action Handlers
  const handleAction = (label, student) => {
    setOpenMenuId(null);
    if (label === "Edit Info") {
      setEditStudent(student);
    } else if (label === "Delete Record") {
      setDeleteStudent(student);
    } else if (label === "Download ID") {
      setIdCardStudent(student);
    } else if (label === "Change Status") {
      setShowStatusToast(`Status for ${student.id} updated!`);
      setTimeout(() => setShowStatusToast(null), 3000);
    } else if (label === "View Profile") {
      navigate(`/admin/student/profile/${student._id}`);
    }
  };

  const applyFilters = () => {
    setClassFilter(tempFilters.class_id);
    setSectionFilter(tempFilters.section_id);
    setIsFilterOpen(false);
    setCurrentPage(1);
  };

  const resetFilters = () => {
    setTempFilters({ class_id: "all", section_id: "all" });
    setClassFilter("all");
    setSectionFilter("all");
    setIsFilterOpen(false);
    setCurrentPage(1);
  };

  // Expanded Sample Data REMOVED - Using API data
  
  // Filtered Results - Now handled by backend or local set
  const filteredStudents = Array.isArray(students) ? students : [];

  // Pagination Logic
  const totalPages = Math.ceil(filteredStudents.length / itemsPerPage);
  const currentStudents = useMemo(() => {
    const startIndex = (currentPage - 1) * itemsPerPage;
    return filteredStudents.slice(startIndex, startIndex + itemsPerPage);
  }, [currentPage, filteredStudents]);

  // Reset to page 1 on search/filter change
  useState(() => {
    setCurrentPage(1);
  }, [searchTerm, classFilter, sectionFilter]);

  return (
    <div className="animate-in fade-in duration-500">
    {/* Header */}
      <div className="flex items-center justify-between mb-5 w-full">
        <div>
          <h1 className="text-[20px] font-black text-slate-800 flex items-center gap-3">
            <Users className="w-8 h-8 text-[#00bd7f]" />
           Student Management
          </h1>
          <p className=" text-[14px] text-slate-500 font-bold mt-1">
            Manage all student records
          </p>
        </div>

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


      {/* Stats Summary */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
        {[
         
          {
            label: "Total Student",
            value: students.length,
            icon: GraduationCap,
            color: "text-blue-600",
            bg: "bg-blue-100",
          },
          {
            label: "Active",
            value: students.filter((s) => s.status === "active").length,
            icon: CheckCircle,
            color: "text-emerald-600",
            bg: "bg-emerald-100",
          },
          {
            label: "Inactive",
            value: students.filter((s) => s.status === "inactive").length,
            icon: XCircle,
            color: "text-rose-600",
            bg: "bg-rose-100",
          },
        ].map((stat, idx) => (
          <div
            key={idx}
            className="bg-white rounded-[8px] p-5 flex items-center justify-between shadow-lg"
          >
            <div>
              <p className="text-xs font-bold text-slate-500 uppercase mb-1">
                {stat.label}
              </p>
              <p className="text-2xl font-black text-slate-800">{stat.value}</p>
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
      <div className="bg-white rounded-[20px] border-2 border-slate-100 shadow-xl shadow-slate-100/50 overflow-hidden relative mt-8">
        {loading ? (
          <div className="flex-1 flex flex-col items-center justify-center py-20">
            <div className="w-12 h-12 border-4 border-[#00bd7f] border-t-transparent rounded-full animate-spin mb-4"></div>
            <p className="text-slate-500 font-bold">Loading students...</p>
          </div>
        ) : (
          <>
              <div className="overflow-x-auto border border-gray-200 rounded-[8px]">
                
                  <div className="p-4 flex items-center justify-between border-b border-b-gray-200">
                <h2 className="text-[18px] font-semibold">Students List</h2>

                <div>
                   <div className="flex items-center gap-4">
          
            <div className="relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
              <input
                type="text"
                placeholder="Search by Name or Student ID..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-10 pr-4 py-2 bg-[#e6f4ef] border border-slate-200 text-slate-900 rounded-[8px] outline-none focus:ring-0.5 focus:ring-emerald-500 transition-all"
              />
                    </div>
                   
                      <div className="relative">
                          <button
                        onClick={()=>setIsFilterOpen(!isFilterOpen)}
                        className=" px-4 py-2 bg-[#e6f4ef]  rounded-[8px] cursor-pointer flex items-center gap-2"
                      >
                      <Filter className="h-4 w-4"/>  Filter
                        </button>
                        
                        {
                          isFilterOpen && <div className="absolute top-[50px] right-0 z-[100]  whitespace-nowrap flex flex-col gap-2 bg-white border border-gray-200 p-4 rounded-[8px] shadow-lg lg:w-[300px] w-full z-20"> 
                          
                          <div className="flex flex-col gap-4">
                            <SelectInputField 
                                title={'Class'}
                                options={[{ value: "all", label: "All Classes" }, ...classes.map(c => ({ value: c._id, label: c.name }))]}
                                value={tempFilters.class_id}
                                setValue={(val) => setTempFilters({ ...tempFilters, class_id: val })}
                            />
                            <SelectInputField 
                                title={'Section'}
                                options={[{ value: "all", label: "All Sections" }, ...filterSections.map(s => ({ value: s._id, label: s.name }))]}
                                value={tempFilters.section_id}
                                setValue={(val) => setTempFilters({ ...tempFilters, section_id: val })}
                                disabled={tempFilters.class_id === "all"}
                            />
                           
                          </div>
                          <div className="flex items-end justify-end gap-4 mt-2.5">
                            <button
                                onClick={resetFilters}
                                className=" px-4 py-2 bg-[#e6f4ef]  rounded-[8px] cursor-pointer"
                            >
                                Reset
                            </button>

                            <button
                                onClick={applyFilters}
                                className=" px-4 py-2 bg-[#00bd7f] text-white rounded-[8px] cursor-pointer"
                            >
                                Apply
                            </button>
                        </div>
                          </div>
                        }
                      </div>
          </div>
                </div>
              </div>
            <table className="w-full">
              <thead className="bg-[#e6f4ef]">
                <tr className="whitespace-nowrap">
                  <th className="px-10 py-3.5 text-left text-[12px] font-black">
                    Student ID
                  </th>
                  <th className="px-10 py-3.5 text-left text-[12px] font-black">
                    Student Info
                  </th>
                  <th className="px-10 py-3.5 text-left text-[12px] font-black">
                    Academic
                  </th>
                  <th className="px-10 py-3.5 text-left text-[12px] font-black">
                    Guardian
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
              {currentStudents.map((student,i) => (
                <tr
                  key={student.id}
                  className="group hover:bg-amber-50/10 transition-all duration-300"
                >
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span className="text-sm font-black text-emerald-700">
                      {student.student_id || student.id}
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded-full border-2 border-emerald-100 overflow-hidden shadow-sm">
                        <img
                          src={student.photo}
                          alt={student.firstName}
                          className="w-full h-full object-cover"
                        />
                      </div>
                      <div>
                        <p className="text-sm font-bold text-slate-800">
                          {student.firstName} {student.lastName}
                        </p>
                        <p className="text-[10px] text-slate-500 font-bold uppercase tracking-wider">
                          {student.gender}
                        </p>
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="space-y-1">
                      <p className="text-sm font-bold text-slate-700">
                        {student.classInfo?.name || "N/A"} ({student.sectionInfo?.name || "N/A"})
                      </p>
                      <p className="text-xs font-black text-emerald-600">
                        Roll: {student.roll_number || student.rollNo}
                      </p>
                    </div>
                  </td>
                <td className="px-6 py-4 whitespace-nowrap">
                    <p className="text-sm font-bold text-slate-800">
                      {student.guardian?.fatherName || student.guardianName}
                    </p>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="space-y-1 text-xs font-bold text-slate-600">
                      <div className="flex items-center gap-1.5">
                        <Phone className="w-3.5 h-3.5 text-emerald-500" />
                        {student?.guardian?.contact}
                      </div>
                      {/* <div className="flex items-center gap-1.5">
                        <Mail className="w-3.5 h-3.5 text-emerald-500" />
                        {student.email}
                      </div> */}
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span
                      className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full text-[10px] font-black uppercase tracking-widest border-2 ${
                        student.status === "active"
                          ? "bg-emerald-50 text-emerald-700 border-emerald-100"
                          : "bg-rose-50 text-rose-700 border-rose-100"
                      }`}
                    >
                      <div
                        className={`w-1.5 h-1.5 rounded-full ${
                          student.status === "active"
                            ? "bg-emerald-500"
                            : "bg-rose-500"
                        }`}
                      />
                      {student.status}
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="flex items-center gap-4">
                      <button className="cursor-pointer" onClick={() => handleAction("View Profile", student)}>
                        <Eye className="w-5 h-5 text-[#00bd7f]"  />
                      </button>
                      <button className="cursor-pointer" onClick={() => handleAction("Edit Info", student)}>
                         <SquarePen className="w-4 h-4 text-[#00bd7f]" />
                        </button>
                        <button className="cursor-pointer" onClick={() => handleAction("Delete Record", student)}>
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
              {(currentPage - 1) * itemsPerPage + 1}
            </span>{" "}
            to{" "}
            <span className="text-slate-900">
              {Math.min(currentPage * itemsPerPage, filteredStudents.length)}
            </span>{" "}
            of <span className="text-slate-900">{filteredStudents.length}</span>{" "}
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
                  className={`w-10 h-10 rounded-xl text-xs font-black transition-all border-2 ${
                    currentPage === i + 1
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

          </>
        )}
      </div>

      {/* Action Modals */}
      {editStudent && (
        <EditModal 
          student={editStudent} 
          classes={classes}
          sections={sections}
          feeTypes={feeTypes}
          onClose={() => setEditStudent(null)} 
          onSuccess={() => {
            setEditStudent(null);
            fetchStudents();
          }}
        />
      )}
      {deleteStudent && (
        <DeleteModal
          student={deleteStudent}
          onClose={() => setDeleteStudent(null)}
          onSuccess={() => {
            setDeleteStudent(null);
            fetchStudents();
          }}
        />
      )}
      {idCardStudent && (
        <IDCardModal
          student={idCardStudent}
          onClose={() => setIdCardStudent(null)}
        />
      )}

      {/* Success Feedback Toast */}
      {showStatusToast && (
        <div className="fixed bottom-8 left-1/2 -translate-x-1/2 z-[200] animate-in slide-in-from-bottom-10 duration-500">
          <div className="bg-slate-900 text-white px-6 py-3 rounded-2xl shadow-2xl flex items-center gap-3">
            <div className="w-6 h-6 bg-emerald-500 rounded-full flex items-center justify-center">
              <CheckCircle className="w-4 h-4 text-white" />
            </div>
            <p className="text-sm font-bold">{showStatusToast}</p>
          </div>
        </div>
      )}
    </div>
  );
};

// --- Sub-Components (Modals) ---

const EditModal = ({ student, classes, sections: allSections, feeTypes, onClose, onSuccess }) => {
  const [formData, setFormData] = useState({
    ...student,
    dateOfBirth: student.dateOfBirth ? new Date(student.dateOfBirth).toISOString().split("T")[0] : "",
    fees: student.fees || {},
    gender: student.gender || "Male"
  });
  const [loading, setLoading] = useState(false);

  const handleFieldChange = (field, value) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const handleImageUpload = (file, field) => {
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        handleFieldChange(field, reader.result);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleUpdate = async () => {
    setLoading(true);
    try {
      // Clean up the payload to send only database-relevant fields
      const payload = { ...formData };
      delete payload.guardian; 
      delete payload.classInfo;
      delete payload.sectionInfo;
      delete payload.status;
      delete payload.id;
      
      const response = await axiosInstance.put(`/v1/students/${student._id}`, payload);
      if (response.data.success) {
        toast.success("Student profile updated!");
        onSuccess();
      }
    } catch (err) {
      console.error("Update error:", err);
      toast.error(err.response?.data?.message || "Failed to update student");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div
      className="fixed inset-0 bg-slate-900/60 backdrop-blur-sm z-[110] flex items-center justify-center p-4"
      onClick={onClose}
    >
      <div
        className="bg-white rounded-3xl w-full max-w-4xl max-h-[95vh] overflow-y-auto shadow-2xl animate-in zoom-in duration-300"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="p-6 border-b-2 border-slate-100 flex items-center justify-between sticky top-0 bg-white z-10">
          <h2 className="text-xl font-black text-slate-800">
            Edit Student Profile
          </h2>
          <button
            onClick={onClose}
            className="p-2 hover:bg-slate-100 rounded-xl transition-all"
          >
            <X className="w-5 h-5 text-slate-400" />
          </button>
        </div>

        <div className="p-8 space-y-8 text-left">
          {/* Bio Section */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            <div>
              <label className="text-sm font-bold text-slate-700 mb-2 block">
                Full Name <span className="text-red-500">*</span>
              </label>
              <input
                type="text"
                required
                value={formData.firstName}
                onChange={(e) => handleFieldChange("firstName", e.target.value)}
                className="w-full px-4 py-3 bg-[#e6f4ef] border border-slate-200 text-slate-900 rounded-xl outline-none focus:ring-1 focus:ring-emerald-500 transition-all"
                placeholder="Enter student name"
              />
            </div>

            <div>
              <label className="text-sm font-bold text-slate-700 mb-2 block">
                Gender <span className="text-red-500">*</span>
              </label>
              <select
                required
                value={formData.gender}
                onChange={(e) => handleFieldChange("gender", e.target.value)}
                className="w-full px-4 py-3 bg-[#e6f4ef] border border-slate-200 text-slate-900 rounded-xl outline-none focus:ring-1 focus:ring-emerald-500 transition-all"
              >
                <option value="Male">Male</option>
                <option value="Female">Female</option>
                <option value="Other">Other</option>
              </select>
            </div>

            <div>
              <label className="text-sm font-bold text-slate-700 mb-2 block">
                Date of Birth <span className="text-red-500">*</span>
              </label>
              <input
                type="date"
                required
                value={formData.dateOfBirth}
                onChange={(e) => handleFieldChange("dateOfBirth", e.target.value)}
                className="w-full px-4 py-3 bg-[#e6f4ef] border border-slate-200 text-slate-900 rounded-xl outline-none focus:ring-1 focus:ring-emerald-500 transition-all"
              />
            </div>

            <div>
              <label className="text-sm font-bold text-slate-700 mb-2 block">
                Blood Group
              </label>
              <select
                value={formData.bloodGroup}
                onChange={(e) => handleFieldChange("bloodGroup", e.target.value)}
                className="w-full px-4 py-3 bg-[#e6f4ef] border border-slate-200 text-slate-900 rounded-xl outline-none focus:ring-1 focus:ring-emerald-500 transition-all"
              >
                <option value="">Select Blood Group</option>
                {["A+", "A-", "B+", "B-", "AB+", "AB-", "O+", "O-"].map(bg => (
                  <option key={bg} value={bg}>{bg}</option>
                ))}
              </select>
            </div>

            <div>
              <label className="text-sm font-bold text-slate-700 mb-2 block">
                Assigned Class <span className="text-red-500">*</span>
              </label>
              <select
                required
                value={formData.class_id}
                onChange={(e) => handleFieldChange("class_id", e.target.value)}
                className="w-full px-4 py-3 bg-[#e6f4ef] border border-slate-200 text-slate-900 rounded-xl outline-none focus:ring-1 focus:ring-emerald-500 transition-all"
              >
                <option value="">Select Class</option>
                {classes.map((cls) => (
                  <option key={cls._id} value={cls._id}>{cls.name}</option>
                ))}
              </select>
            </div>

            <div>
              <label className="text-sm font-bold text-slate-700 mb-2 block">
                Section
              </label>
              <select
                value={formData.section_id}
                onChange={(e) => handleFieldChange("section_id", e.target.value)}
                className="w-full px-4 py-3 bg-[#e6f4ef] border border-slate-200 text-slate-900 rounded-xl outline-none focus:ring-1 focus:ring-emerald-500 transition-all"
              >
                <option value="">Select Section</option>
                {allSections
                  .filter(sec => sec.class_id === formData.class_id)
                  .map((sec) => (
                    <option key={sec._id} value={sec._id}>{sec.name}</option>
                  ))}
              </select>
            </div>

            {/* Photo Upload */}
            <div className="col-span-full">
              <div className="flex items-center gap-6 p-4 bg-emerald-50/50 rounded-2xl border-2 border-emerald-100">
                <div className="relative">
                  {formData.photo ? (
                    <img
                      src={formData.photo}
                      alt="Student"
                      className="w-20 h-20 rounded-xl object-cover border-2 border-emerald-200 shadow-sm"
                    />
                  ) : (
                    <div className="w-20 h-20 rounded-xl bg-emerald-100 flex items-center justify-center border-2 border-emerald-200 border-dashed">
                      <ImageIcon className="w-8 h-8 text-emerald-400" />
                    </div>
                  )}
                  <label className="absolute -bottom-2 -right-2 p-1.5 bg-emerald-600 text-white rounded-lg shadow-lg cursor-pointer hover:bg-emerald-700 transition-colors">
                    <Upload className="w-3.5 h-3.5" />
                    <input
                      type="file"
                      className="hidden"
                      onChange={(e) => handleImageUpload(e.target.files?.[0], "photo")}
                    />
                  </label>
                </div>
                <div>
                  <p className="font-bold text-emerald-900 text-sm">
                    Student Photo
                  </p>
                  <p className="text-xs text-emerald-600 font-medium mt-0.5">
                    Update student's passport size photo
                  </p>
                </div>
              </div>
            </div>
          </div>

          {/* Fee Setup Section */}
          <div className="space-y-6">
            <div className="flex items-center gap-2 text-emerald-700 pb-2 border-b-2 border-slate-100">
              <Calculator className="w-5 h-5" />
              <h4 className="font-black">Fee Setup (ফি সেটআপ)</h4>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              {feeTypes?.map((type, i) => (
                <div key={i} className="p-4 rounded-2xl border-2 border-slate-100 bg-white shadow-sm">
                  <div className="flex items-center justify-between mb-3">
                    <div className="flex items-center gap-2">
                      <div className="w-8 h-8 rounded-lg bg-emerald-50 flex items-center justify-center">
                        <Home className="w-4 h-4 text-[#00bd7f]" />
                      </div>
                      <span className="font-bold text-sm text-slate-700">{type?.name}</span>
                    </div>
                    <label className="relative inline-flex items-center cursor-pointer">
                      <input
                        type="checkbox"
                        className="sr-only peer"
                        checked={!!formData.fees?.[type.name]}
                        onChange={(e) => {
                          const currentFees = { ...(formData.fees || {}) };
                          if (e.target.checked) {
                            currentFees[type.name] = "0";
                          } else {
                            delete currentFees[type.name];
                          }
                          handleFieldChange("fees", currentFees);
                        }}
                      />
                      <div className="w-10 h-5 bg-gray-200 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-4 after:w-4 after:transition-all peer-checked:bg-[#00bd7f]"></div>
                    </label>
                  </div>

                  {formData.fees?.[type.name] !== undefined && (
                    <div className="relative animate-in slide-in-from-top-1 duration-200">
                      <div className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 font-bold text-xs">৳</div>
                      <input
                        type="number"
                        value={formData.fees[type.name]}
                        onChange={(e) => {
                          const currentFees = { ...(formData.fees || {}) };
                          currentFees[type.name] = e.target.value;
                          handleFieldChange("fees", currentFees);
                        }}
                        placeholder="0.00"
                        className="w-full pl-7 pr-3 py-2 bg-[#f8fafc] border border-slate-200 rounded-lg text-sm font-bold text-slate-700 outline-none focus:border-[#00bd7f]"
                      />
                    </div>
                  )}
                </div>
              ))}
            </div>
          </div>

          {/* Note Section */}
          <div>
            <label className="text-sm font-bold text-slate-700 mb-2 block">
              Internal Note / Details
            </label>
            <textarea
              rows="3"
              value={formData.note}
              onChange={(e) => handleFieldChange("note", e.target.value)}
              className="w-full px-4 py-3 bg-[#e6f4ef] border border-slate-200 text-slate-900 rounded-xl outline-none focus:ring-1 focus:ring-emerald-500 transition-all placeholder:text-slate-400"
              placeholder="Enter internal details about the student..."
            />
          </div>

          {/* Action Buttons */}
          <div className="pt-6 flex justify-end gap-3 sticky bottom-0 bg-white pb-2 border-t border-slate-50 mt-4">
            <button
              onClick={onClose}
              className="px-6 py-2.5 text-sm font-bold text-slate-600 hover:bg-slate-50 rounded-xl transition-all border border-slate-200"
            >
              Cancel
            </button>
            <button
              onClick={handleUpdate}
              disabled={loading}
              className="px-8 py-2.5 bg-[#00bd7f] text-white text-sm font-black rounded-xl shadow-lg shadow-emerald-100 disabled:opacity-50 hover:bg-[#009b68] transition-all"
            >
              {loading ? "Saving..." : "Save Changes"}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

const DeleteModal = ({ student, onClose, onSuccess }) => {
  const [loading, setLoading] = useState(false);

  const handleDelete = async () => {
    setLoading(true);
    try {
      const response = await axiosInstance.delete(`/v1/students/${student._id}`);
      if (response.data.success) {
        toast.success("Student record deleted");
        onSuccess();
      }
    } catch (err) {
      console.error("Delete error:", err);
      toast.error(err.response?.data?.message || "Failed to delete student");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div
      className="fixed inset-0 bg-slate-900/60 backdrop-blur-sm z-[110] flex items-center justify-center p-4"
      onClick={onClose}
    >
      <div
        className="bg-white rounded-3xl w-full max-w-md shadow-2xl animate-in zoom-in duration-300 overflow-hidden"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="bg-rose-50 p-8 flex flex-col items-center text-center">
          <div className="w-16 h-16 bg-rose-100 rounded-full flex items-center justify-center mb-4">
            <Trash2 className="w-8 h-8 text-rose-600" />
          </div>
          <h2 className="text-xl font-black text-slate-800 mb-2">
            Delete Student Record?
          </h2>
          <p className="text-sm font-bold text-slate-500">
            You are about to delete{" "}
            <span className="text-rose-600 font-black">
              {student.firstName}'s
            </span>{" "}
            record. This action cannot be undone.
          </p>
        </div>
        <div className="p-6 flex justify-center gap-3 bg-white">
          <button
            onClick={onClose}
            className="px-8 py-2.5 text-sm font-bold text-slate-600 hover:bg-slate-50 rounded-xl transition-all border-2 border-slate-100"
          >
            Go Back
          </button>
          <button
            onClick={handleDelete}
            disabled={loading}
            className="px-8 py-2.5 bg-rose-600 text-white text-sm font-bold rounded-xl shadow-lg shadow-rose-200 hover:bg-rose-700 disabled:opacity-50"
          >
            {loading ? "Deleting..." : "Delete Now"}
          </button>
        </div>
      </div>
    </div>
  );
};

const IDCardModal = ({ student, onClose }) => (
  <div
    className="fixed inset-0 bg-slate-900/60 backdrop-blur-sm z-[110] flex items-center justify-center p-4"
    onClick={onClose}
  >
    <div
      className="bg-white rounded-3xl w-full max-w-sm max-h-[90vh] overflow-y-auto shadow-2xl animate-in zoom-in duration-300"
      onClick={(e) => e.stopPropagation()}
    >
      <div className="p-6 border-b-2 border-slate-100 flex items-center justify-between sticky top-0 bg-white z-10">
        <h2 className="text-lg font-black text-slate-800">
          Student ID Preview
        </h2>
        <button
          onClick={onClose}
          className="p-2 hover:bg-slate-100 rounded-xl transition-all"
        >
          <X className="w-5 h-5 text-slate-400" />
        </button>
      </div>
      <div className="p-8 flex flex-col items-center">
        {/* ID Card UI */}
        <div className="w-full aspect-[1/1.6] bg-gradient-to-br from-emerald-500 to-teal-700 rounded-2xl shadow-xl p-6 text-white flex flex-col items-center relative overflow-hidden">
          <div className="absolute top-0 right-0 w-32 h-32 bg-white/10 rounded-full -mr-16 -mt-16" />
          <div className="w-24 h-24 rounded-full border-4 border-white/30 shadow-lg overflow-hidden mb-4 relative z-10">
            <img
              src={student.photo}
              className="w-full h-full object-cover"
              alt="ID"
            />
          </div>
          <h3 className="text-lg font-black tracking-tight">
            {student.firstName} {student.lastName}
          </h3>
          <p className="text-[10px] font-bold opacity-80 uppercase mb-6 tracking-widest">
            {student.id}
          </p>

          <div className="w-full space-y-3 pt-4 border-t border-white/20">
            <div className="flex justify-between text-[10px] font-bold uppercase">
              <span className="opacity-60">Class</span>
              <span>{student.classInfo?.name || "N/A"}</span>
            </div>
            <div className="flex justify-between text-[10px] font-bold uppercase">
              <span className="opacity-60">Section</span>
              <span>{student.sectionInfo?.name || "N/A"}</span>
            </div>
            <div className="flex justify-between text-[10px] font-bold uppercase">
              <span className="opacity-60">Roll No</span>
              <span>{student.roll_number || student.rollNo}</span>
            </div>
            <div className="flex justify-between text-[10px] font-bold uppercase">
              <span className="opacity-60">Blood</span>
              <span>{student.bloodGroup}</span>
            </div>
          </div>

          <div className="mt-auto pt-6 w-full flex justify-center">
            <div className="bg-white rounded-lg p-2">
              <div className="w-8 h-8 bg-slate-800 rounded-sm" />
            </div>
          </div>
        </div>

        <div className="w-full mt-6">
          <button
            onClick={() => alert("Downloading ID Card...")}
            className="w-full flex items-center justify-center gap-2 py-3 bg-[#00bd7f] text-white font-black rounded-xl shadow-lg shadow-emerald-100 hover:scale-[1.02] transition-all"
          >
            <Download className="w-4 h-4" />
            Download PDF
          </button>
        </div>
      </div>
    </div>
  </div>
);

export default StudentList;
