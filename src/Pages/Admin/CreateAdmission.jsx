import { useState, useEffect, useCallback } from "react";
import {
  User,
  Users,
  MapPin,
  Home,
  Calendar,
  Phone,
  Mail,
  BookOpen,
  Save,
  X,
  Upload,
  ImageIcon,
  Search,
  UserPlus,
  Smartphone,
  UserCheck,
  Lock,
  Calculator,
  User2,
  Plus,
  Trash2,
  Printer,
  CheckCircle2,
  Bus,
  QrCode,
  Globe,
} from "lucide-react";
import { Link, useSearchParams, useNavigate, useLocation } from "react-router";
import InputField from "../../components/InputField";
import TextareaField from "../../components/TextareaField";
import SelectInputField from "../../components/SelectInputField";
import axiosInstance from "../../api/axiosInstance";
import { toast } from "react-hot-toast";

import VoucherModal from "../../components/VoucherModal/VoucherModal";

const CreateAdmission = () => {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const location = useLocation();
  const isEdit = searchParams.get("edit") === "true";
  const editId = searchParams.get("id");
  const guardianIdParam = searchParams.get("guardianId");

  const [useExistingGuardian, setUseExistingGuardian] = useState(false);
  const [guardianSearchTerm, setGuardianSearchTerm] = useState("");

  const [showVoucher, setShowVoucher] = useState(true);
  const [loading, setLoading] = useState(false);
  const [guardians, setGuardians] = useState([]);
  const [subscriptionLimitError, setSubscriptionLimitError] = useState(null);
  const [classes, setClasses] = useState([]);
  const [allSections, setAllSections] = useState([]);
  const [feeTypes, setFeeTypes] = useState([]);

  const fetchData = useCallback(async () => {
    try {
      const [parentsRes, classesRes, sectionsRes, feeTypesRes] = await Promise.all([
        axiosInstance.get("/v1/parents"),
        axiosInstance.get("/v1/classes"),
        axiosInstance.get("/v1/sections"),
        axiosInstance.get("/fee-type/v1")
      ]);

      if (parentsRes.data.success) {
        console.log("Fetched guardians:", parentsRes.data.data);
        setGuardians(parentsRes.data.data);
      }
      if (classesRes.data.success) setClasses(classesRes.data.data);
      if (sectionsRes.data.success) setAllSections(sectionsRes.data.data);
      if (feeTypesRes.data.success) setFeeTypes(feeTypesRes.data.data);
    } catch (err) {
      console.error("Error fetching admission data:", err);
    }
  }, []);

  const fetchEditData = useCallback(async () => {
    if (!isEdit || !editId) return;
    setLoading(true);
    try {
      const res = await axiosInstance.get(`/v1/students/${editId}`);
      if (res.data.success) {
        const studentData = res.data.data;
        const guardianData = studentData.guardian;

        setFormData({
          academicYear: studentData.academicYear || "2026",
          admissionDate: studentData.admissionDate ? new Date(studentData.admissionDate).toISOString().split("T")[0] : "",
          position: "Existing", // Assuming existing if editing
          students: [{
            _id: studentData._id,
            firstName: studentData.firstName,
            gender: studentData.gender,
            dateOfBirth: studentData.dateOfBirth ? new Date(studentData.dateOfBirth).toISOString().split("T")[0] : "",
            bloodGroup: studentData.bloodGroup,
            class_id: studentData.class_id,
            section_id: studentData.section_id,
            photo: studentData.photo,
            transport: studentData.transport || { required: false, route: "" },
            hostel: studentData.hostel || { required: false, roomType: "" },
            fees: studentData.fees || {},
            note: studentData.note || "",
            student_id: studentData.student_id
          }],
          guardian: {
            fatherName: guardianData?.fatherName || "",
            motherName: guardianData?.motherName || "",
            fatherOccupation: guardianData?.fatherOccupation || "",
            motherOccupation: guardianData?.motherOccupation || "",
            contact: guardianData?.contact || "",
            email: guardianData?.email || "",
            address: guardianData?.address || "",
            fatherPhoto: guardianData?.fatherPhoto || "",
            motherPhoto: guardianData?.motherPhoto || "",
            guardianNID: guardianData?.guardianNID || "",
          }
        });
      }
    } catch (err) {
      console.error("Error fetching edit data:", err);
      toast.error("Failed to load admission details for editing");
    } finally {
      setLoading(false);
    }
  }, [isEdit, editId]);

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  useEffect(() => {
    if (isEdit) fetchEditData();
  }, [isEdit, fetchEditData]);

  // Handle Pre-fill from Online Admission
  useEffect(() => {
    if (location.state?.preFill && location.state?.applicationData) {
      const app = location.state.applicationData;
      setFormData(prev => ({
        ...prev,
        guardian: {
          ...prev.guardian,
          fatherName: app.guardian?.fatherName || "",
          motherName: app.guardian?.motherName || "",
          fatherOccupation: app.guardian?.fatherOccupation || "",
          motherOccupation: app.guardian?.motherOccupation || "",
          // fatherContact: app.guardian?.fatherContact || app.guardian?.fatherContact || "",
          contact: app.guardian?.fatherContact || "",
          motherContact: app.guardian?.motherContact || app.guardian?.motherContact || "",
          email: app.guardian?.email || "",
          address: app.guardian?.address?.present || app.guardian?.address || "",
          fatherPhoto: app.guardian?.fatherPhoto || app.guardian?.fatherNID || "",
          motherPhoto: app.guardian?.motherPhoto || app.guardian?.motherNID || "",
          guardianNID: app.guardian?.guardianNID || "",
        },
        students: app.students?.map((s, idx) => ({
          firstName: s.name || s.firstName || "",
          gender: s.gender === "male" ? "Male" : s.gender === "female" ? "Female" : (s.gender || "Male"),
          dateOfBirth: s.dob || s.dateOfBirth || "",
          bloodGroup: s.bloodGroup || "",
          class_id: s.appliedClass || s.class_id || "",
          section_id: s.section || s.section_id || "",
          photo: s.photo || "",
          password: "password",
          transport: { required: false, route: "" },
          hostel: { required: false, roomType: "" },
          fees: {},
          note: s.note || "",
          student_id: `TS${Math.random().toString(10).slice(2, 6)}`,
          id: Date.now() + idx
        })) || prev.students
      }));
      toast.success("আবেদন থেকে তথ্যগুলো লোড করা হয়েছে");
    }
  }, [location.state]);

  const initialStudent = {
    firstName: "",
    gender: "Male",
    dateOfBirth: "",
    bloodGroup: "",
    class_id: "",
    section_id: "",
    photo: "",
    password: "password",
    transport: {
      required: false,
      route: "",
    },
    hostel: {
      required: false,
      roomType: "",
    },
    fees: {}, // To store { "Fee Name": "Amount" }
    note: "",
    student_id: `TS${Math.random().toString(10).slice(2, 6)}`
  };

  const [formData, setFormData] = useState({
    academicYear: "2026",
    admissionDate: new Date().toISOString().split("T")[0],
    position: "New",
    students: [{ ...initialStudent }],
    guardian: {
      fatherName: "",
      motherName: "",
      fatherOccupation: "",
      motherOccupation: "",
      contact: "",
      email: "",
      address: "",
      fatherPhoto: "",
      motherPhoto: "",
      guardianNID: "",
    },
    guardian_id: null,
  });

  const handleInputChange = (section, field, value) => {
    if (section) {
      setFormData((prev) => ({
        ...prev,
        [section]: {
          ...prev[section],
          [field]: value,
        },
      }));
    } else {
      setFormData((prev) => ({
        ...prev,
        [field]: value,
      }));
    }
  };

  const handleStudentChange = (index, field, value, subSection = null) => {
    const updatedStudents = [...formData.students];
    if (subSection) {
      updatedStudents[index][subSection] = {
        ...updatedStudents[index][subSection],
        [field]: value,
      };
    } else {
      updatedStudents[index][field] = value;
    }
    setFormData((prev) => ({ ...prev, students: updatedStudents }));
  };

  const addStudent = () => {
    if (isEdit) {
      toast.error("Cannot add students in single-student edit mode");
      return;
    }
    setFormData((prev) => ({
      ...prev,
      students: [...prev.students, { ...initialStudent, id: Date.now() }],
    }));
  };

  const removeStudent = (id) => {
    if (formData.students.length > 1) {
      setFormData((prev) => ({
        ...prev,
        students: prev.students.filter((s) => s.id !== id && s._id !== id),
      }));
    }
  };

  const handleImageUpload = (file, section, field, index = null) => {
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        if (index !== null) {
          handleStudentChange(index, field, reader.result);
        } else {
          handleInputChange(section, field, reader.result);
        }
      };
      reader.readAsDataURL(file);
    }
  };

  const selectGuardian = (guardian) => {
    setFormData((prev) => ({
      ...prev,
      guardian: {
        fatherName: guardian.fatherName || "",
        motherName: guardian.motherName || "",
        fatherOccupation: guardian.fatherOccupation || "",
        motherOccupation: guardian.motherOccupation || "",
        contact: guardian.contact || "",
        motherContact: guardian.motherContact || "",
        email: guardian.email || "",
        address: guardian.address || "",
        fatherPhoto: guardian.fatherPhoto || "",
        motherPhoto: guardian.motherPhoto || "",
        guardianNID: guardian.guardianNID || "",
      },
      guardian_id: guardian._id,
    }));
    setUseExistingGuardian(false);
    setGuardianSearchTerm("");
    toast.success("Guardian information loaded!");
  };

  const filteredGuardians = guardians.filter(
    (g) => {
      const search = guardianSearchTerm.toLowerCase();
      const fatherName = g.fatherName?.toLowerCase() || "";
      const motherName = g.motherName?.toLowerCase() || "";
      const contact = g.contact || "";
      const email = g.email?.toLowerCase() || "";

      return fatherName.includes(search) ||
        motherName.includes(search) ||
        contact.includes(search) ||
        email.includes(search);
    }
  );

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      let response;
      if (isEdit) {
        const payload = {
          ...formData,
          guardianId: guardianIdParam
        };
        response = await axiosInstance.put("/v1/admission", payload);
      } else {
        response = await axiosInstance.post("/v1/admission", formData);
      }

      if (response.data.success) {
        toast.success(isEdit ? "Admission updated successfully!" : "Admission created successfully!");

        // If this was a pre-filled admission from an online application
        if (!isEdit && location.state?.preFill && location.state?.applicationData?._id) {
          try {
            await axiosInstance.put(`/v1/online-admission/${location.state.applicationData._id}/status`, {
              status: "approved"
            });
          } catch (statusErr) {
            console.error("Failed to update original application status:", statusErr);
          }
        }

        if (isEdit) {
          navigate("/admin/admission/report");
        } else {
          setShowVoucher(true);
        }
      }
    } catch (err) {
      console.error("Admission error:", err);
      if (err.response?.status === 403 && err.response?.data?.message?.includes("capacity")) {
        // Parse numbers from the message for a beautiful modal
        const msg = err.response.data.message;
        const limitMatch = msg.match(/allows up to (\d+)/);
        const currentMatch = msg.match(/currently have (\d+)/);
        const addMatch = msg.match(/tried to add (\d+)/);
        setSubscriptionLimitError({
          limit: limitMatch ? limitMatch[1] : "?",
          current: currentMatch ? currentMatch[1] : "?",
          adding: addMatch ? addMatch[1] : "?",
        });
      } else {
        toast.error(err.response?.data?.message || err.response?.data?.error || "Failed to process admission");
      }
    } finally {
      setLoading(false);
    }
  };

  const handleReset = () => {
    if (confirm("Are you sure you want to reset the form?")) {
      setFormData({
        academicYear: "2025-2026",
        admissionDate: new Date().toISOString().split("T")[0],
        position: "New",
        students: [{ ...initialStudent, id: Date.now() }],
        guardian: {
          fatherName: "Md Sadiq",
          motherName: "Mis Adiba",
          fatherOccupation: "Fermer",
          motherOccupation: "Home Meker",
          contact: "01996359111",
          email: "sadiq@gmail.com",
          address: "Pakunda",
          fatherPhoto: "",
          motherPhoto: "",
          guardianNID: "",
        },
      });
    }
  };








  return (
    <div className="space-y-6  animate-in fade-in duration-500  ">

      {/* ── Subscription Limit Exceeded Modal ── */}
      {subscriptionLimitError && (
        <div
          className="fixed inset-0 z-[999] flex items-center justify-center p-4"
          style={{ backgroundColor: "rgba(0,0,0,0.55)", backdropFilter: "blur(4px)" }}
          onClick={() => setSubscriptionLimitError(null)}
        >
          <div
            className="relative bg-white rounded-2xl shadow-2xl w-full max-w-md overflow-hidden p-4"
            onClick={(e) => e.stopPropagation()}
            style={{ animation: "modalPop 0.3s cubic-bezier(0.34,1.56,0.64,1)" }}
          >
            {/* Red top bar */}
            <div className="flex items-center justify-center ">
              <svg width="100" height="100" viewBox="0 0 24 24" fill="red">
                <path d="M12 9v4M12 17h.01M10.29 3.86L1.82 18a2 2 0 001.71 3h16.94a2 2 0 001.71-3L13.71 3.86a2 2 0 00-3.42 0z" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
              </svg>
            </div>

            {/* Body */}
            <div >
              <p style={{ color: "#374151", fontSize: "15px", lineHeight: 1.7, marginBottom: "20px", textAlign: "center" }}>
                আপনার বর্তমান প্ল্যানে সর্বোচ্চ{" "}
                <strong style={{ color: "#ff4d4d" }}>{subscriptionLimitError.limit} জন</strong> শিক্ষার্থী যোগ করা যাবে।
                এই মুহূর্তে{" "}
                <strong style={{ color: "#374151" }}>{subscriptionLimitError.current} জন</strong> শিক্ষার্থী নিবন্ধিত আছে।
                আর নতুন শিক্ষার্থী যোগ করার সুযোগ নেই।
              </p>

              {/* Stats row */}
              {/* <div
                style={{
                  display: "grid",
                  gridTemplateColumns: "1fr 1fr 1fr",
                  gap: "12px",
                  marginBottom: "20px",
                }}
              >
                {[
                  { label: "প্ল্যান সীমা", value: subscriptionLimitError.limit + " জন", color: "#6366f1" },
                  { label: "নিবন্ধিত", value: subscriptionLimitError.current + " জন", color: "#f59e0b" },
                  { label: "যোগ করতে চান", value: subscriptionLimitError.adding + " জন", color: "#ef4444" },
                ].map((s) => (
                  <div
                    key={s.label}
                    style={{
                      textAlign: "center",
                      background: "#f8fafc",
                      borderRadius: "10px",
                      padding: "12px 8px",
                      border: "1px solid #e2e8f0",
                    }}
                  >
                    <div style={{ fontSize: "20px", fontWeight: 900, color: s.color }}>{s.value}</div>
                    <div style={{ fontSize: "11px", color: "#94a3b8", marginTop: "3px" }}>{s.label}</div>
                  </div>
                ))}
              </div> */}

              {/* Upgrade tip */}
              <div
                style={{
                  background: "linear-gradient(135deg, #eff6ff 0%, #f0fdf4 100%)",
                  borderRadius: "12px",
                  padding: "14px 16px",
                  border: "1px solid #bfdbfe",
                  marginBottom: "20px",
                  display: "flex",
                  alignItems: "flex-start",
                  gap: "10px",
                }}
              >
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" style={{ flexShrink: 0, marginTop: "2px" }}>
                  <path d="M13 16h-1v-4h-1m1-4h.01M12 2a10 10 0 100 20A10 10 0 0012 2z" stroke="#3b82f6" strokeWidth="2" strokeLinecap="round" />
                </svg>
                <p style={{ color: "#1e40af", fontSize: "13px", lineHeight: 1.6, margin: 0 }}>
                  আরও শিক্ষার্থী যোগ করতে <strong>সুপার অ্যাডমিনের</strong> সাথে যোগাযোগ করুন এবং
                  আপনার প্ল্যান আপগ্রেড করুন।
                </p>
              </div>

              {/* Buttons */}
              <div style={{ display: "flex", gap: "10px" }}>
                <button
                  onClick={() => setSubscriptionLimitError(null)}
                  style={{
                    flex: 1,
                    padding: "11px 0",
                    borderRadius: "10px",
                    border: "2px solid #e2e8f0",
                    background: "white",
                    color: "#374151",
                    fontWeight: 700,
                    fontSize: "14px",
                    cursor: "pointer",
                  }}
                >
                  ঠিক আছে
                </button>
                <button
                  onClick={() => { setSubscriptionLimitError(null); window.location.href = "/admin/support"; }}
                  style={{
                    flex: 1,
                    padding: "11px 0",
                    borderRadius: "10px",
                    border: "none",
                    background: "linear-gradient(135deg, #013f77 0%, #013f7724 100%)",
                    color: "white",
                    fontWeight: 700,
                    fontSize: "14px",
                    cursor: "pointer",
                  }}
                >
                  আপগ্রেড করুন →
                </button>
              </div>
            </div>
          </div>

          <style>{`
            @keyframes modalPop {
              from { transform: scale(0.85); opacity: 0; }
              to   { transform: scale(1);    opacity: 1; }
            }
          `}</style>
        </div>
      )}
      {/* Header */}
      <div className="flex items-center justify-between mb-5 w-full">
        <div>
          <h1 className="text-[20px] font-black text-slate-800 flex items-center gap-3">
            <Users className="w-8 h-8 text-[#013f77]" />
            Create Student
          </h1>

        </div>

        <div className="flex items-center gap-3">
          <Link to={"/admin/student/list"}>
            <button
              type="button"
              className="w-full sm:w-auto flex items-center justify-center gap-2 px-5 py-2.5 text-sm font-bold bg-[#013f77] text-white rounded-[8px] hover:bg-[#013f77] transition-all shadow-sm cursor-pointer"
            >
              <User2 className="w-4 h-4" />
              All Student
            </button>
          </Link>
        </div>
      </div>



      <form onSubmit={handleSubmit} className="space-y-8">
        {/* Academic Year & Admission Date */}
        <div className="bg-white dark:bg-white rounded-[8px]  p-4 sm:p-6 md:p-8 shadow-sm hover:shadow-md transition-shadow">
          <div className="flex items-center gap-3 mb-6 pb-4 border-b-2 border-slate-200 dark:border-slate-200">
            <div className="w-10 h-10 rounded-xl bg-[#013f7724] flex items-center justify-center">
              <Calendar className="w-5 h-5 text-[#013f77]" />
            </div>
            <h2 className="text-xl font-black text-[#013f77]">
              Academic Information
            </h2>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            <SelectInputField
              title={" Academic Year"}
              value={formData.academicYear}
              setValue={(val) => handleInputChange(null, "academicYear", val)}
              options={[{ value: "2025-2026" }, { value: "2026-2027" }]}
              required={true}
              bgColor={"bg-[#013f7724]"}
            />

            <InputField
              title={"Admission Date "}
              value={formData.admissionDate}
              setValue={(val) => handleInputChange(null, "admissionDate", val)}
              type={"date"}
              required={true}
              placeholder={"Admission Date "}
            />

            <SelectInputField
              title={"Positon"}
              value={formData.position}
              setValue={(val) => handleInputChange(null, "position", val)}
              options={[{ value: "Old" }, { value: "New" }]}
              required={true}
              bgColor={"bg-[#013f7724]"}
            />
          </div>
        </div>

        {/* Guardian Information */}
        <div className="bg-white dark:bg-white rounded-[8px]  p-4 sm:p-6 md:p-8 shadow-sm hover:shadow-md transition-shadow">
          <div className="flex items-center justify-between mb-6 pb-4 border-b-2 border-slate-200 dark:border-slate-200">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-[#013f7724] flex items-center justify-center">
                <Users className="w-5 h-5 text-[#013f77]" />
              </div>
              <h2 className="text-xl font-black text-[#013f77]">
                Guardian Information
              </h2>
            </div>
            <button
              type="button"
              onClick={() => setUseExistingGuardian(!useExistingGuardian)}
              className={`flex items-center gap-2 px-4 py-2.5 text-sm font-bold rounded-[8px] ransition-all bg-[#013f77] text-white shadow-lg  cursor-pointer`}
            >
              {useExistingGuardian ? (
                <>
                  <UserPlus className="w-4 h-4" />
                  Add New Guardian
                </>
              ) : (
                <>
                  <Search className="w-4 h-4" />
                  Use Existing Guardian
                </>
              )}
            </button>
            {!useExistingGuardian && formData.guardian_id && (
              <button
                type="button"
                onClick={() => handleInputChange(null, "guardian_id", null)}
                className="flex items-center gap-2 px-4 py-2.5 text-sm font-bold rounded-[8px] transition-all bg-red-100 text-red-600 hover:bg-red-200 cursor-pointer"
              >
                <X className="w-4 h-4" />
                Clear Selected Guardian
              </button>
            )}
          </div>

          {/* Existing Guardian Selection */}
          {useExistingGuardian && (
            <div className="mb-6 p-6 bg-white dark:bg-white rounded-2xl border-2 border-slate-200 dark:border-slate-200 shadow-sm">
              <label className="text-sm font-bold text-slate-700 dark:text-slate-700 mb-3 block">
                Search Existing Guardian
              </label>
              <div className="relative mb-4">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                <input
                  type="text"
                  value={guardianSearchTerm}
                  onChange={(e) => setGuardianSearchTerm(e.target.value)}
                  className="w-full pl-10 pr-4 py-3 bg-[#013f7724] dark:bg-[#013f7724]   dark:border-slate-200 text-slate-900 dark:text-slate-900 rounded-[8px] outline-none focus:ring-1 focus:ring-[#013f77] focus:border-[#013f77] transition-all"
                  placeholder="Search by father's name, mother's name, or contact..."
                />
              </div>

              <div className="space-y-3 max-h-96 overflow-y-auto pr-2 custom-scrollbar">
                {filteredGuardians.length > 0 ? (
                  filteredGuardians.map((guardian) => (
                    <div
                      key={guardian._id}
                      onClick={() => selectGuardian(guardian)}
                      className="p-4 bg-slate-50 dark:bg-slate-50 rounded-[8px] border-1 border-slate-200 dark:border-slate-200 hover:border-[#013f77] hover:bg-[#013f7724] cursor-pointer transition-all hover:shadow-md group relative overflow-hidden"
                    >
                      <div className="absolute top-0 right-0 p-2 opacity-0 group-hover:opacity-100 transition-opacity">
                        <UserCheck className="w-5 h-5 text-[#013f77]" />
                      </div>
                      <div className="flex items-start justify-between">
                        <div className="flex-1">
                          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-3">
                            <div>
                              <p className="text-[10px] font-black text-slate-400 uppercase tracking-wider mb-1">
                                Father's Name
                              </p>
                              <p className="font-bold text-slate-800">
                                {guardian.fatherName}
                              </p>
                            </div>
                            <div>
                              <p className="text-[10px] font-black text-slate-400 uppercase tracking-wider mb-1">
                                Mother's Name
                              </p>
                              <p className="font-bold text-slate-800">
                                {guardian.motherName}
                              </p>
                            </div>
                          </div>
                          <div className="flex flex-wrap gap-4 pt-3 border-t border-slate-200">
                            <div className="flex items-center gap-2">
                              <div className="w-6 h-6 rounded-full bg-[#013f7724] flex items-center justify-center">
                                <Phone className="w-3 h-3 text-[#013f77]" />
                              </div>
                              <p className="text-xs font-bold text-slate-600">
                                {guardian.contact}
                              </p>
                            </div>
                            {guardian.email && (
                              <div className="flex items-center gap-2">
                                <div className="w-6 h-6 rounded-full bg-blue-100 flex items-center justify-center">
                                  <Mail className="w-3 h-3 text-blue-500" />
                                </div>
                                <p className="text-xs font-bold text-slate-600">
                                  {guardian.email}
                                </p>
                              </div>
                            )}
                            <div className="flex items-center gap-2">
                              <div className="w-6 h-6 rounded-full bg-orange-100 flex items-center justify-center">
                                <MapPin className="w-3 h-3 text-orange-500" />
                              </div>
                              <p className="text-xs font-bold text-slate-600 truncate max-w-[200px]">
                                {guardian.address}
                              </p>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  ))
                ) : (
                  <div className="text-center py-10 bg-slate-50 rounded-2xl border-2 border-dashed border-slate-200">
                    <Users className="w-12 h-12 text-slate-300 mx-auto mb-3" />
                    <p className="text-slate-500 font-bold">
                      {guardianSearchTerm ? "No matching guardians found" : "Start typing to search guardians"}
                    </p>
                  </div>
                )}
              </div>
            </div>
          )}

          {!useExistingGuardian && formData.guardian_id ? (
            <div className="p-6 bg-[#013f7724] rounded-3xl border-2 border-[#013f7724] shadow-sm relative overflow-hidden">
              {/* Read-only guardian template */}
              <div className="absolute top-0 right-0 p-4 opacity-50">
                <UserCheck className="w-16 h-16 text-[#013f77]" />
              </div>
              <h3 className="text-lg font-black text-[#013f77] mb-6 flex items-center gap-2">
                <UserCheck className="w-5 h-5" />
                Selected Guardian
              </h3>

              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-6">
                <div>
                  <p className="text-[11px] font-black text-slate-400 uppercase tracking-wider mb-1">Father's Name</p>
                  <p className="font-bold text-slate-800">{formData.guardian.fatherName || "N/A"}</p>
                </div>
                <div>
                  <p className="text-[11px] font-black text-slate-400 uppercase tracking-wider mb-1">Mother's Name</p>
                  <p className="font-bold text-slate-800">{formData.guardian.motherName || "N/A"}</p>
                </div>
                <div>
                  <p className="text-[11px] font-black text-slate-400 uppercase tracking-wider mb-1">Contact Number</p>
                  <div className="flex items-center gap-2">
                    <Phone className="w-4 h-4 text-[#013f77]" />
                    <p className="font-bold text-slate-800">{formData.guardian.contact || "N/A"}</p>
                  </div>
                </div>
                {formData.guardian.email && (
                  <div>
                    <p className="text-[11px] font-black text-slate-400 uppercase tracking-wider mb-1">Email</p>
                    <div className="flex items-center gap-2">
                      <Mail className="w-4 h-4 text-[#013f77]" />
                      <p className="font-bold text-slate-800">{formData.guardian.email}</p>
                    </div>
                  </div>
                )}
                <div className="lg:col-span-2">
                  <p className="text-[11px] font-black text-slate-400 uppercase tracking-wider mb-1">Address</p>
                  <div className="flex items-center gap-2">
                    <MapPin className="w-4 h-4 text-[#013f77]" />
                    <p className="font-bold text-slate-800">{formData.guardian.address || "N/A"}</p>
                  </div>
                </div>
              </div>

              {/* Photos */}
              <div className="flex gap-4 pt-6 border-t border-[#013f7724]">
                {formData.guardian.fatherPhoto && (
                  <div className="flex items-center gap-3">
                    <img src={formData.guardian.fatherPhoto} alt="Father" className="w-12 h-12 rounded-xl object-cover border-2 border-[#013f7724]" />
                    <div className="text-xs font-bold text-[#013f77]">Father's Photo</div>
                  </div>
                )}
                {formData.guardian.motherPhoto && (
                  <div className="flex items-center gap-3">
                    <img src={formData.guardian.motherPhoto} alt="Mother" className="w-12 h-12 rounded-xl object-cover border-2 border-[#013f7724]" />
                    <div className="text-xs font-bold text-[#013f77]">Mother's Photo</div>
                  </div>
                )}
                {formData.guardian.guardianNID && (
                  <div className="flex items-center gap-3">
                    <img src={formData.guardian.guardianNID} alt="NID" className="w-12 h-12 rounded-xl object-cover border-2 border-[#013f7724]" />
                    <div className="text-xs font-bold text-[#013f77]">NID Document</div>
                  </div>
                )}
              </div>
            </div>
          ) : (
            <>
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                <InputField
                  title={"Father's Name"}
                  value={formData.guardian.fatherName}
                  setValue={(val) => handleInputChange("guardian", "fatherName", val)}
                  required={true}
                  placeholder={"Enter your father name"}
                />
                <InputField
                  title={"Mother's Name"}
                  value={formData.guardian.motherName}
                  setValue={(val) => handleInputChange("guardian", "motherName", val)}
                  required={true}
                  placeholder={"Enter your Mother name"}
                />
                <InputField
                  title={"Father's Occupation"}
                  value={formData.guardian.fatherOccupation}
                  setValue={(val) => handleInputChange("guardian", "fatherOccupation", val)}
                  placeholder={"Father's Occupation"}
                />
                <InputField
                  title={" Mother's Occupation"}
                  value={formData.guardian.motherOccupation}
                  setValue={(val) => handleInputChange("guardian", "motherOccupation", val)}
                  placeholder={" Mother's Occupation"}
                />
                <InputField
                  title={"Contact Number (Father's)"}
                  value={formData.guardian.contact}
                  setValue={(val) => handleInputChange("guardian", "contact", val)}
                  required={true}
                  type={"number"}
                  placeholder={"019XXXXXXXX"}
                />
                <InputField
                  title={"Contact Number  (Mother's)"}
                  value={formData.guardian.motherContact || ""}
                  setValue={(val) => handleInputChange("guardian", "motherContact", val)}
                  type={"number"}
                  placeholder={"019XXXXXXXX"}
                />

                <TextareaField
                  title={"Address"}
                  value={formData.guardian.address}
                  setValue={(val) => handleInputChange("guardian", "address", val)}
                  required={true}
                  placeholder={"Address"}
                  className="bg-[#013f7724] border-[#013f7724] focus:ring-[#013f77] focus:border-[#013f77]"
                />
              </div>

              {/* Guardian Photos and NID */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-6  ">
                {/* Father's Photo */}
                <div className="flex flex-col items-center gap-4 p-4 bg-white rounded-[6px] border-1 border-[#013f7724] shadow-sm">
                  <div className="relative">
                    {formData.guardian.fatherPhoto ? (
                      <img
                        src={formData.guardian.fatherPhoto}
                        alt="Father"
                        className="w-24 h-24 rounded-2xl object-cover border-2 border-[#013f7724] shadow-sm"
                      />
                    ) : (
                      <div className="w-24 h-24 rounded-2xl bg-[#013f7724] flex items-center justify-center border-2 border-[#013f7724] border-dashed">
                        <ImageIcon className="w-10 h-10 text-[#013f77]" />
                      </div>
                    )}
                    <label className="absolute -bottom-2 -right-2 p-2 bg-[#013f77] text-white rounded-xl shadow-lg cursor-pointer hover:bg-[#013f77] transition-colors">
                      <Upload className="w-4 h-4" />
                      <input
                        type="file"
                        className="hidden"
                        onChange={(e) =>
                          handleImageUpload(
                            e.target.files?.[0],
                            "guardian",
                            "fatherPhoto"
                          )
                        }
                      />
                    </label>
                  </div>
                  <div className="text-center">
                    <p className="font-bold text-slate-800 text-sm">Father's  NID Card</p>
                    <p className="text-[10px] text-slate-500 font-bold mt-1 uppercase tracking-wider">Required for ID</p>
                  </div>
                </div>

                {/* Mother's Photo */}
                <div className="flex flex-col items-center gap-4 p-4 bg-white rounded-[6px] border-1 border-[#013f7724] shadow-sm">
                  <div className="relative">
                    {formData.guardian.motherPhoto ? (
                      <img
                        src={formData.guardian.motherPhoto}
                        alt="Mother"
                        className="w-24 h-24 rounded-2xl object-cover border-2 border-[#013f7724] shadow-sm"
                      />
                    ) : (
                      <div className="w-24 h-24 rounded-2xl bg-[#013f7724] flex items-center justify-center border-2 border-[#013f7724] border-dashed">
                        <ImageIcon className="w-10 h-10 text-[#013f77]" />
                      </div>
                    )}
                    <label className="absolute -bottom-2 -right-2 p-2 bg-[#013f77] text-white rounded-xl shadow-lg cursor-pointer hover:bg-[#013f77] transition-colors">
                      <Upload className="w-4 h-4" />
                      <input
                        type="file"
                        className="hidden"
                        onChange={(e) =>
                          handleImageUpload(
                            e.target.files?.[0],
                            "guardian",
                            "motherPhoto"
                          )
                        }
                      />
                    </label>
                  </div>
                  <div className="text-center">
                    <p className="font-bold text-slate-800 text-sm">Mother's  NID Card</p>
                    <p className="text-[10px] text-slate-500 font-bold mt-1 uppercase tracking-wider">Required for ID</p>
                  </div>
                </div>

                {/* Guardian NID */}
                <div className="flex flex-col items-center gap-4 p-4 bg-white rounded-[6px] border-1 border-[#013f7724] shadow-sm">
                  <div className="relative">
                    {formData.guardian.guardianNID ? (
                      <img
                        src={formData.guardian.guardianNID}
                        alt="NID"
                        className="w-24 h-24 rounded-2xl object-cover border-2 border-[#013f7724] shadow-sm"
                      />
                    ) : (
                      <div className="w-24 h-24 rounded-2xl bg-[#013f7724] flex items-center justify-center border-2 border-[#013f7724] border-dashed">
                        <UserCheck className="w-10 h-10 text-[#013f77]" />
                      </div>
                    )}
                    <label className="absolute -bottom-2 -right-2 p-2 bg-[#013f77] text-white rounded-xl shadow-lg cursor-pointer hover:bg-[#013f77] transition-colors">
                      <Upload className="w-4 h-4" />
                      <input
                        type="file"
                        className="hidden"
                        onChange={(e) =>
                          handleImageUpload(
                            e.target.files?.[0],
                            "guardian",
                            "guardianNID"
                          )
                        }
                      />
                    </label>
                  </div>
                  <div className="text-center">
                    <p className="font-bold text-slate-800 text-sm">Guardian NID Card</p>
                    <p className="text-[10px] text-slate-500 font-bold mt-1 uppercase tracking-wider">Or Birth Certificate</p>
                  </div>
                </div>
              </div>
            </>
          )}
        </div>

        {/* Students Section */}
        <div className="space-y-8">
          <div className="flex items-center justify-between">
            <h2 className="text-2xl font-black text-slate-800 dark:text-slate-800 flex items-center gap-3">
              <Users className="w-8 h-8 text-[#013f77]" />
              Student List ({formData.students.length})
            </h2>
            <button
              type="button"
              onClick={addStudent}
              className=" cursor-pointer flex items-center gap-2 px-6 py-2.5 bg-[#013f77] text-white font-black rounded-[8px] hover:bg-[#013f77] transition-all shadow-lg "
            >
              <Plus className="w-5 h-5" />
              Add Another Student
            </button>
          </div>

          {formData.students.map((student, index) => (
            <div
              key={student.id}
              className="relative bg-white dark:bg-white rounded-[8px] p-4 sm:p-6 md:p-8 shadow-sm hover:shadow-md transition-shadow animate-in slide-in-from-bottom duration-500"
            >
              {formData.students.length > 1 && (
                <button
                  type="button"
                  onClick={() => removeStudent(student.id)}
                  className="absolute -top-4 -right-4 p-3 bg-red-100 text-red-600 rounded-2xl hover:bg-red-200 transition-all shadow-sm border-2 border-red-200 group"
                >
                  <Trash2 className="w-5 h-5 group-hover:scale-110 transition-transform" />
                </button>
              )}
              <div className="flex items-center gap-3 mb-8 pb-4 border-b-2 border-slate-100 dark:border-slate-100">
                <div className="w-12 h-12 rounded-[8px] bg-[#013f77] flex items-center justify-center text-white font-black shadow-lg ">
                  {index + 1}
                </div>
                <div>
                  <h3 className="text-xl font-black text-[#013f77]">
                    Student {index + 1} Setup
                  </h3>

                </div>
              </div>
              {/* Student Bio */}
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
                <div>
                  <label className="text-sm font-bold text-slate-700 dark:text-slate-700 mb-2 block">
                    Full Name  <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="text"
                    required
                    value={student.firstName}
                    onChange={(e) =>
                      handleStudentChange(index, "firstName", e.target.value)
                    }
                    className="w-full px-4 py-3 bg-[#013f7724] dark:bg-[#013f7724] border border-slate-200 dark:border-slate-200 text-slate-900 dark:text-slate-900 rounded-[6px] outline-none focus:ring-1 focus:ring-[#013f77] focus:border-[#013f77] transition-all"
                    placeholder="Enter student name"
                  />
                </div>

                <div>
                  <label className="text-sm font-bold text-slate-700 dark:text-slate-700 mb-2 block">
                    Gender  <span className="text-red-500">*</span>
                  </label>
                  <select
                    required
                    value={student.gender}
                    onChange={(e) =>
                      handleStudentChange(index, "gender", e.target.value)
                    }
                    className="w-full px-4 py-3 bg-[#013f7724] dark:bg-[#013f7724] border border-slate-200 dark:border-slate-200 text-slate-900 dark:text-slate-900 rounded-[6px] outline-none focus:ring-1 focus:ring-[#013f77] focus:border-[#013f77] transition-all"
                  >
                    <option value="Male">Male</option>
                    <option value="Female">Female</option>
                  </select>
                </div>
                <div>
                  <label className="text-sm font-bold text-slate-700 dark:text-slate-700 mb-2 block">
                    Date of Birth <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="date"
                    required
                    value={student.dateOfBirth}
                    onChange={(e) =>
                      handleStudentChange(index, "dateOfBirth", e.target.value)
                    }
                    className="w-full px-4 py-3 bg-[#013f7724] dark:bg-[#013f7724] border border-slate-200 dark:border-slate-200 text-slate-900 dark:text-slate-900 rounded-[6px] outline-none focus:ring-1 focus:ring-[#013f77] focus:border-[#013f77] transition-all"
                  />
                </div>
                <div>
                  <label className="text-sm font-bold text-slate-700 dark:text-slate-700 mb-2 block">
                    Blood Group
                  </label>
                  <select
                    value={student.bloodGroup}
                    onChange={(e) =>
                      handleStudentChange(index, "bloodGroup", e.target.value)
                    }
                    className="w-full px-4 py-3 bg-[#013f7724] dark:bg-[#013f7724] border border-slate-200 dark:border-slate-200 text-slate-900 dark:text-slate-900 rounded-[6px] outline-none focus:ring-1 focus:ring-[#013f77] focus:border-[#013f77] transition-all"
                  >
                    <option value="">Select Blood Group</option>
                    <option value="A+">A+</option>
                    <option value="A-">A-</option>
                    <option value="B+">B+</option>
                    <option value="B-">B-</option>
                    <option value="AB+">AB+</option>
                    <option value="AB-">AB-</option>
                    <option value="O+">O+</option>
                    <option value="O-">O-</option>
                  </select>
                </div>
                <div>
                  <label className="text-sm font-bold text-slate-700 dark:text-slate-700 mb-2 block">
                    Assigned Class <span className="text-red-500">*</span>
                  </label>
                  <select
                    required
                    value={student.class_id}
                    onChange={(e) =>
                      handleStudentChange(index, "class_id", e.target.value)
                    }
                    className="w-full px-4 py-3 bg-[#013f7724] dark:bg-[#013f7724] border border-slate-200 dark:border-slate-200 text-slate-900 dark:text-slate-900 rounded-[6px] outline-none focus:ring-1 focus:ring-[#013f77] focus:border-[#013f77] transition-all"
                  >
                    <option value="">Select Class</option>
                    {classes.map((cls) => (
                      <option key={cls._id} value={cls._id}>{cls.name}</option>
                    ))}
                  </select>
                </div>
                <div>
                  <label className="text-sm font-bold text-slate-700 dark:text-slate-700 mb-2 block">
                    Section
                  </label>
                  <select
                    value={student.section_id}
                    onChange={(e) =>
                      handleStudentChange(index, "section_id", e.target.value)
                    }
                    className="w-full px-4 py-3 bg-[#013f7724] dark:bg-[#013f7724] border border-slate-200 dark:border-slate-200 text-slate-900 dark:text-slate-900 rounded-[6px] outline-none focus:ring-1 focus:ring-[#013f77] focus:border-[#013f77] transition-all"
                  >
                    <option value="">Select Section</option>
                    {allSections
                      .filter(sec => sec.class_id === student.class_id)
                      .map((sec) => (
                        <option key={sec._id} value={sec._id}>{sec.name}</option>
                      ))}
                  </select>
                </div>

                {/* Photo Upload for this student */}
                <div className="col-span-full">
                  <div className="flex items-center gap-6 p-4 bg-[#013f7724] rounded-[6px] ">
                    <div className="relative">
                      {student.photo ? (
                        <img
                          src={student.photo}
                          alt="Student"
                          className="w-20 h-20 rounded-[6px] object-cover border-2 border-[#013f7724] shadow-sm"
                        />
                      ) : (
                        <div className="w-20 h-20 rounded-xl bg-[#013f7724] flex items-center justify-center border-1 border-[#013f7724] border-dashed">
                          <ImageIcon className="w-8 h-8 text-[#013f77]" />
                        </div>
                      )}
                      <label className="absolute -bottom-2 -right-2 p-1.5 bg-[#013f77] text-white rounded-lg shadow-lg cursor-pointer hover:bg-[#013f77] transition-colors">
                        <Upload className="w-3.5 h-3.5" />
                        <input
                          type="file"
                          className="hidden"
                          onChange={(e) =>
                            handleImageUpload(
                              e.target.files?.[0],
                              "student",
                              "photo",
                              index,
                            )
                          }
                        />
                      </label>
                    </div>
                    <div>
                      <p className="font-bold text-[#013f77] text-sm">
                        Student Photo
                      </p>
                      <p className="text-xs text-[#013f77] font-medium mt-0.5">
                        High quality passport size photo recommended
                      </p>
                    </div>
                  </div>
                </div>
              </div>
              {/* Fee Setup (ফি সেটআপ) */}

              {feeTypes?.length > 0 && (<div><div className="flex items-center gap-2 mb-6 text-[#013f77]">
                <Calculator className="w-5 h-5" />
                <h4 className="font-black">Fee Setup (ফি সেটআপ)</h4>
              </div>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                  {feeTypes?.map((type, i) => (
                    <div key={i} className="p-5 rounded-[6px]  bg-[#f2f2f3] shadow-sm hover:shadow-md transition-all duration-300">
                      <div className="flex items-center justify-between mb-4">
                        <div className="flex items-center gap-3 text-[#013f77]">
                          <div className="w-8 h-8 rounded-[8px] bg-[#013f7724] flex items-center justify-center">
                            <Home className="w-4 h-4 text-[#013f77]" />
                          </div>
                          <span className="font-bold text-slate-700">{type?.name}</span>
                        </div>
                        <label className="relative inline-flex items-center cursor-pointer">
                          <input
                            type="checkbox"
                            className="sr-only peer"
                            checked={!!student.fees?.[type.name]}
                            onChange={(e) => {
                              const currentFees = { ...(student.fees || {}) };
                              if (e.target.checked) {
                                currentFees[type.name] = "0";
                              } else {
                                delete currentFees[type.name];
                              }
                              handleStudentChange(index, "fees", currentFees);
                            }}
                          />
                          <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-[#013f77]"></div>
                        </label>
                      </div>

                      {/* Dynamic Amount Input */}
                      {student.fees?.[type.name] !== undefined && (
                        <div className="animate-in slide-in-from-top-2 duration-300">
                          <div className="relative group">
                            <div className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 font-bold group-focus-within:text-[#013f77] transition-colors">৳</div>
                            <input
                              type="number"
                              value={student.fees[type.name]}
                              onChange={(e) => {
                                const currentFees = { ...(student.fees || {}) };
                                currentFees[type.name] = e.target.value;
                                handleStudentChange(index, "fees", currentFees);
                              }}
                              placeholder="Enter amount"
                              className="w-full pl-8 pr-4 py-2.5 bg-[#013f7724] border-2 border-slate-100 rounded-[6px] outline-none focus:border-[#013f77] focus:bg-white text-sm font-bold text-slate-700 transition-all placeholder:text-slate-300"
                            />
                          </div>
                        </div>
                      )}
                    </div>
                  ))}
                </div></div>)}



              <div className="grid-cols-1 sm:col-span-2 lg:col-span-3 mt-[20px]">
                <label className="text-sm font-bold text-slate-700 dark:text-slate-700 mb-2 block">
                  Note
                </label>
                <textarea

                  rows="3"
                  value={student.note}
                  onChange={(e) => handleStudentChange(index, "note", e.target.value)}
                  className="w-full px-4 py-3 bg-[#013f7724] dark:bg-[#013f7724] border-1 border-slate-200 dark:border-slate-200 text-slate-900 dark:text-slate-900 rounded-[6px] outline-none focus:ring-0.5 focus:ring-[#013f77] focus:border-[#013f77] transition-all"
                  placeholder="Enter full Detals in Student"
                />
              </div>
            </div>
          ))}
        </div>

        {/* Submit Button */}
        <div className="flex flex-col sm:flex-row items-center justify-end gap-4  border-t-2 border-slate-100">
          <button
            type="button"
            onClick={handleReset}
            className="w-full sm:w-auto flex items-center justify-center gap-2 px-5 py-2.5 text-sm font-bold bg-red-500 text-white rounded-[8px] hover:bg-red-700 transition-all shadow-sm cursor-pointer"
          >
            <X className="w-5 h-5" />
            Reset Form
          </button>
          <button
            type="submit"
            className="w-full sm:w-auto flex items-center justify-center gap-2 px-5 py-2.5 text-sm font-bold bg-[#013f77] text-white rounded-[8px] hover:bg-[#013f77] transition-all shadow-sm cursor-pointer"
          >
            <CheckCircle2 className="w-5 h-5" />
            Save
          </button>
        </div>
      </form>

      {/* Voucher Modal */}
      {showVoucher && (
        <VoucherModal
          formData={formData}
          onClose={() => {
            setShowVoucher(false);
            handleReset();
          }}
        />
      )}
    </div>
  );
};

export default CreateAdmission;





