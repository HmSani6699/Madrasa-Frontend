import { useState } from "react";
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
  Image as ImageIcon,
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
} from "lucide-react";
import { Link } from "react-router";

const CreateAdmission = () => {
  const [useExistingGuardian, setUseExistingGuardian] = useState(false);
  const [guardianSearchTerm, setGuardianSearchTerm] = useState("");

  // Sample existing guardians - in production this would come from API
  const existingGuardians = [
    {
      id: 1,
      fatherName: "আব্দুল করিম",
      motherName: "ফাতেমা বেগম",
      fatherOccupation: "Business",
      motherOccupation: "Housewife",
      contact: "01712345678",
      email: "karim@example.com",
      address: "Dhaka, Bangladesh",
      children: ["মোহাম্মদ রহমান"],
    },
    {
      id: 2,
      fatherName: "মোহাম্মদ আলী",
      motherName: "সালমা বেগম",
      fatherOccupation: "Teacher",
      motherOccupation: "Doctor",
      contact: "01823456789",
      email: "ali@example.com",
      address: "Chittagong, Bangladesh",
      children: ["আয়েশা খাতুন"],
    },
  ];

  const [showVoucher, setShowVoucher] = useState(false);

  const initialStudent = {
    id: Date.now(),
    firstName: "",
    gender: "Male",
    dateOfBirth: "",
    bloodGroup: "",
    class: "",
    phone: "",
    section: "",
    photo: "",
    password: "password",
    financial: {
      admissionFee: "0",
      monthlyFee: "0",
      hostelFee: "0",
      transportFee: "0",
    },
    transport: {
      required: false,
      route: "",
    },
    hostel: {
      required: false,
      roomType: "",
    },
  };

  const [formData, setFormData] = useState({
    academicYear: "2025-2026",
    admissionDate: new Date().toISOString().split("T")[0],
    students: [{ ...initialStudent }],
    guardian: {
      fatherName: "",
      motherName: "",
      fatherOccupation: "",
      motherOccupation: "",
      contact: "",
      email: "",
      address: "",
      fatherDocument: "",
      motherDocument: "",
    },
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
    setFormData((prev) => ({
      ...prev,
      students: [...prev.students, { ...initialStudent, id: Date.now() }],
    }));
  };

  const removeStudent = (id) => {
    if (formData.students.length > 1) {
      setFormData((prev) => ({
        ...prev,
        students: prev.students.filter((s) => s.id !== id),
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
        fatherName: guardian.fatherName,
        motherName: guardian.motherName,
        fatherOccupation: guardian.fatherOccupation,
        motherOccupation: guardian.motherOccupation,
        contact: guardian.contact,
        email: guardian.email,
        address: guardian.address,
      },
    }));
    setUseExistingGuardian(false);
    setGuardianSearchTerm("");
  };

  const filteredGuardians = existingGuardians.filter(
    (g) =>
      g.fatherName.toLowerCase().includes(guardianSearchTerm.toLowerCase()) ||
      g.motherName.toLowerCase().includes(guardianSearchTerm.toLowerCase()) ||
      g.contact.includes(guardianSearchTerm)
  );

  const handleSubmit = (e) => {
    e.preventDefault();
    console.log("Full Admission Data:", formData);
    setShowVoucher(true);
  };

  const handleReset = () => {
    if (confirm("Are you sure you want to reset the form?")) {
      setFormData({
        academicYear: "2025-2026",
        admissionDate: new Date().toISOString().split("T")[0],
        students: [{ ...initialStudent, id: Date.now() }],
        guardian: {
          fatherName: "",
          motherName: "",
          fatherOccupation: "",
          motherOccupation: "",
          contact: "",
          email: "",
          address: "",
          fatherDocument: "",
          motherDocument: "",
        },
      });
    }
  };

  return (
    <div className="space-y-6 sm:space-y-8 animate-in fade-in duration-500 p-3 sm:p-4 md:p-6 lg:p-8">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 bg-white dark:bg-white p-6 rounded-3xl border-2 border-slate-200 dark:border-slate-200 shadow-sm text-center md:text-left">
        <div>
          <h1 className="text-2xl sm:text-3xl font-black text-slate-800 dark:text-slate-800 mb-1">
            Create New Admission
          </h1>
          <p className="text-slate-600 dark:text-slate-600 text-sm font-semibold">
            Add new students to the system under a single guardian
          </p>
        </div>
        <div className="flex items-center gap-3">
          <Link to={"/admin/student/list"}>
            <button
              type="button"
              className="w-full sm:w-auto flex items-center justify-center gap-2 px-5 py-2.5 text-sm font-bold bg-[#00bd7f] text-white rounded-xl hover:bg-[#009b68] transition-all shadow-sm cursor-pointer"
            >
              <User2 className="w-4 h-4" />
              All Student
            </button>
          </Link>
        </div>
      </div>

      <form onSubmit={handleSubmit} className="space-y-8">
        {/* Academic Year & Admission Date */}
        <div className="bg-white dark:bg-white rounded-3xl border-2 border-slate-200 dark:border-slate-200 p-4 sm:p-6 md:p-8 shadow-sm hover:shadow-md transition-shadow">
          <div className="flex items-center gap-3 mb-6 pb-4 border-b-2 border-slate-200 dark:border-slate-200">
            <div className="w-10 h-10 rounded-xl bg-emerald-100 dark:bg-emerald-100 flex items-center justify-center">
              <Calendar className="w-5 h-5 text-emerald-600" />
            </div>
            <h2 className="text-xl font-black text-emerald-700 dark:text-emerald-700">
              Academic Information
            </h2>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-2 gap-6">
            <div>
              <label className="text-sm font-bold text-slate-700 dark:text-slate-700 mb-2 block">
                Academic Year <span className="text-red-500">*</span>
              </label>
              <input
                type="text"
                required
                value={formData.academicYear}
                onChange={(e) =>
                  handleInputChange(null, "academicYear", e.target.value)
                }
                className="w-full px-4 py-3 bg-[#e6f4ef] dark:bg-[#e6f4ef] border-2 border-slate-200 dark:border-slate-200 text-slate-900 dark:text-slate-900 rounded-xl outline-none focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 transition-all"
                placeholder="2025-2026"
              />
            </div>
            <div>
              <label className="text-sm font-bold text-slate-700 dark:text-slate-700 mb-2 block">
                Admission Date <span className="text-red-500">*</span>
              </label>
              <input
                type="date"
                required
                value={formData.admissionDate}
                onChange={(e) =>
                  handleInputChange(null, "admissionDate", e.target.value)
                }
                className="w-full px-4 py-3 bg-[#e6f4ef] dark:bg-[#e6f4ef] border-2 border-slate-200 dark:border-slate-200 text-slate-900 dark:text-slate-900 rounded-xl outline-none focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 transition-all"
              />
            </div>
          </div>
        </div>

        {/* Guardian Information */}
        <div className="bg-white dark:bg-white rounded-3xl border-2 border-slate-200 dark:border-slate-200 p-4 sm:p-6 md:p-8 shadow-sm hover:shadow-md transition-shadow">
          <div className="flex items-center justify-between mb-6 pb-4 border-b-2 border-slate-200 dark:border-slate-200">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-emerald-100 dark:bg-emerald-100 flex items-center justify-center">
                <Users className="w-5 h-5 text-emerald-600" />
              </div>
              <h2 className="text-xl font-black text-emerald-700 dark:text-emerald-700">
                Guardian Information
              </h2>
            </div>
            <button
              type="button"
              onClick={() => setUseExistingGuardian(!useExistingGuardian)}
              className={`flex items-center gap-2 px-4 py-2 text-sm font-bold rounded-xl transition-all bg-[#00bd7f] text-white shadow-lg shadow-emerald-500/30 cursor-pointer`}
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
                  className="w-full pl-10 pr-4 py-3 bg-[#e6f4ef] dark:bg-[#e6f4ef] border-2 border-slate-200 dark:border-slate-200 text-slate-900 dark:text-slate-900 rounded-xl outline-none focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 transition-all"
                  placeholder="Search by father's name, mother's name, or contact..."
                />
              </div>

              <div className="space-y-3 max-h-96 overflow-y-auto">
                {filteredGuardians.length > 0 ? (
                  filteredGuardians.map((guardian) => (
                    <div
                      key={guardian.id}
                      onClick={() => selectGuardian(guardian)}
                      className="p-4 bg-white dark:bg-white rounded-xl border-2 border-slate-200 dark:border-slate-200 hover:border-[#00bd7f] cursor-pointer transition-all hover:shadow-md group"
                    >
                      <div className="flex items-start justify-between">
                        <div className="flex-1">
                          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 mb-2">
                            <div>
                              <p className="text-xs font-bold text-slate-500 uppercase mb-1">
                                Father's Name
                              </p>
                              <p className="font-bold text-slate-700 dark:text-slate-700">
                                {guardian.fatherName}
                              </p>
                            </div>
                            <div>
                              <p className="text-xs font-bold text-slate-500 uppercase mb-1">
                                Mother's Name
                              </p>
                              <p className="font-bold text-slate-700 dark:text-slate-700">
                                {guardian.motherName}
                              </p>
                            </div>
                          </div>
                          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 mb-2">
                            <div>
                              <p className="text-xs text-slate-600 dark:text-slate-400">
                                <Phone className="w-3 h-3 inline mr-1" />
                                {guardian.contact}
                              </p>
                            </div>
                            <div>
                              <p className="text-xs text-slate-600 dark:text-slate-400">
                                <Mail className="w-3 h-3 inline mr-1" />
                                {guardian.email}
                              </p>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  ))
                ) : (
                  <div className="text-center py-8">
                    <Users className="w-12 h-12 text-slate-300 mx-auto mb-3" />
                    <p className="text-slate-500 font-medium">
                      No results found
                    </p>
                  </div>
                )}
              </div>
            </div>
          )}

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            <div>
              <label className="text-sm font-bold text-slate-700 dark:text-slate-700 mb-2 block">
                Father's Name <span className="text-red-500">*</span>
              </label>
              <input
                type="text"
                required
                value={formData.guardian.fatherName}
                onChange={(e) =>
                  handleInputChange("guardian", "fatherName", e.target.value)
                }
                className="w-full px-4 py-3 bg-[#e6f4ef] dark:bg-[#e6f4ef] border-2 border-slate-200 dark:border-slate-200 text-slate-900 dark:text-slate-900 rounded-xl outline-none focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 transition-all"
                placeholder="Enter father's name"
              />
            </div>
            <div>
              <label className="text-sm font-bold text-slate-700 dark:text-slate-700 mb-2 block">
                Mother's Name <span className="text-red-500">*</span>
              </label>
              <input
                type="text"
                required
                value={formData.guardian.motherName}
                onChange={(e) =>
                  handleInputChange("guardian", "motherName", e.target.value)
                }
                className="w-full px-4 py-3 bg-[#e6f4ef] dark:bg-[#e6f4ef] border-2 border-slate-200 dark:border-slate-200 text-slate-900 dark:text-slate-900 rounded-xl outline-none focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 transition-all"
                placeholder="Enter mother's name"
              />
            </div>
            <div>
              <label className="text-sm font-bold text-slate-700 dark:text-slate-700 mb-2 block">
                Father's Occupation
              </label>
              <input
                type="text"
                value={formData.guardian.fatherOccupation}
                onChange={(e) =>
                  handleInputChange(
                    "guardian",
                    "fatherOccupation",
                    e.target.value
                  )
                }
                className="w-full px-4 py-3 bg-[#e6f4ef] dark:bg-[#e6f4ef] border-2 border-slate-200 dark:border-slate-200 text-slate-900 dark:text-slate-900 rounded-xl outline-none focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 transition-all"
                placeholder="Enter occupation"
              />
            </div>
            <div>
              <label className="text-sm font-bold text-slate-700 dark:text-slate-700 mb-2 block">
                Mother's Occupation
              </label>
              <input
                type="text"
                value={formData.guardian.motherOccupation}
                onChange={(e) =>
                  handleInputChange(
                    "guardian",
                    "motherOccupation",
                    e.target.value
                  )
                }
                className="w-full px-4 py-3 bg-[#e6f4ef] dark:bg-[#e6f4ef] border-2 border-slate-200 dark:border-slate-200 text-slate-900 dark:text-slate-900 rounded-xl outline-none focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 transition-all"
                placeholder="Enter occupation"
              />
            </div>
            <div>
              <label className="text-sm font-bold text-slate-700 dark:text-slate-700 mb-2 block">
                Contact Number (Father's){" "}
                <span className="text-red-500">*</span>
              </label>
              <input
                type="tel"
                required
                value={formData.guardian.contact}
                onChange={(e) =>
                  handleInputChange("guardian", "contact", e.target.value)
                }
                className="w-full px-4 py-3 bg-[#e6f4ef] dark:bg-[#e6f4ef] border-2 border-slate-200 dark:border-slate-200 text-slate-900 dark:text-slate-900 rounded-xl outline-none focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 transition-all"
                placeholder="01XXXXXXXXX"
              />
            </div>
            <div>
              <label className="text-sm font-bold text-slate-700 dark:text-slate-700 mb-2 block">
                Contact Number (Mother's)
              </label>
              <input
                type="tel"
                value={formData.guardian.email || ""}
                onChange={(e) =>
                  handleInputChange("guardian", "email", e.target.value)
                }
                className="w-full px-4 py-3 bg-[#e6f4ef] dark:bg-[#e6f4ef] border-2 border-slate-200 dark:border-slate-200 text-slate-900 dark:text-slate-900 rounded-xl outline-none focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 transition-all"
                placeholder="01XXXXXXXXX"
              />
            </div>
            <div className="grid-cols-1 sm:col-span-2 lg:col-span-3">
              <label className="text-sm font-bold text-slate-700 dark:text-slate-700 mb-2 block">
                Address <span className="text-red-500">*</span>
              </label>
              <textarea
                required
                rows="3"
                value={formData.guardian.address}
                onChange={(e) =>
                  handleInputChange("guardian", "address", e.target.value)
                }
                className="w-full px-4 py-3 bg-[#e6f4ef] dark:bg-[#e6f4ef] border-2 border-slate-200 dark:border-slate-200 text-slate-900 dark:text-slate-900 rounded-xl outline-none focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 transition-all"
                placeholder="Enter full address"
              />
            </div>
          </div>

          {/* Document Uploads Sub-grid */}
          {/* <div className="mt-8 pt-8 border-t-2 border-slate-100"> */}
          {/* <div className="grid grid-cols-1 md:grid-cols-2 gap-8"> */}
          {/* Father's Document Upload */}
          {/* <div className="w-full">
                <label className="text-sm font-bold text-slate-700 dark:text-slate-700 mb-3 block">
                  Father's Document (ID Card, NID, etc.)
                </label>
                <div className="flex flex-col sm:flex-row items-center sm:items-start gap-6">
                  {formData.guardian.fatherDocument ? (
                    <div className="relative group">
                      <div className="w-44 h-44 rounded-2xl overflow-hidden border-4 border-emerald-200 dark:border-emerald-800 shadow-lg">
                        <img
                          src={formData.guardian.fatherDocument}
                          alt="Father's Document"
                          className="w-full h-full object-cover"
                        />
                      </div>
                      <button
                        type="button"
                        onClick={() =>
                          handleInputChange("guardian", "fatherDocument", "")
                        }
                        className="absolute -top-3 -right-3 p-2.5 bg-red-500 text-white rounded-full shadow-lg hover:bg-red-600 transition-all hover:scale-110"
                      >
                        <X className="w-4 h-4" />
                      </button>
                    </div>
                  ) : (
                    <div className="w-44 h-44 rounded-2xl border-4 border-dashed border-slate-200 dark:border-slate-200 flex items-center justify-center bg-[#e6f4ef] dark:bg-[#e6f4ef]">
                      <div className="text-center">
                        <ImageIcon className="w-14 h-14 text-emerald-400 mx-auto mb-2" />
                        <p className="text-xs text-emerald-600 font-bold">
                          No Document
                        </p>
                      </div>
                    </div>
                  )}

                  <div className="flex-1">
                    <label className="block cursor-pointer group">
                      <div className="border-3 border-dashed border-slate-200 dark:border-slate-200 rounded-2xl p-8 bg-[#e6f4ef] dark:bg-[#e6f4ef] hover:bg-[#d9ede6] transition-all">
                        <div className="flex flex-col items-center text-center gap-3">
                          <div className="w-16 h-16 rounded-full bg-white dark:bg-white flex items-center justify-center group-hover:scale-110 transition-transform">
                            <Upload className="w-8 h-8 text-[#00bd7f]" />
                          </div>
                          <div>
                            <p className="text-sm font-bold text-slate-700 dark:text-slate-700 mb-1">
                              {formData.guardian.fatherDocument
                                ? "Change Document"
                                : "Upload Father's Document"}
                            </p>
                            <p className="text-xs text-slate-500 dark:text-slate-500">
                              Click to browse or drag and drop
                            </p>
                            <p className="text-xs text-slate-400 dark:text-slate-400 mt-1">
                              PNG, JPG, PDF up to 5MB
                            </p>
                          </div>
                        </div>
                      </div>
                      <input
                        type="file"
                        accept="image/*,.pdf"
                        className="hidden"
                        onChange={(e) =>
                          handleImageUpload(
                            e.target.files?.[0],
                            "guardian",
                            "fatherDocument"
                          )
                        }
                      />
                    </label>
                  </div>
                </div>
              </div> */}
          {/* </div> */}

          {/* Mother's Document Upload */}
          {/* <div className="w-full">
              <label className="text-sm font-bold text-slate-700 dark:text-slate-700 mb-3 block">
                Mother's Document (ID Card, NID, etc.)
              </label>
              <div className="flex flex-col sm:flex-row items-center sm:items-start gap-6">
                {formData.guardian.motherDocument ? (
                  <div className="relative group">
                    <div className="w-44 h-44 rounded-2xl overflow-hidden border-4 border-emerald-200 dark:border-emerald-800 shadow-lg">
                      <img
                        src={formData.guardian.motherDocument}
                        alt="Mother's Document"
                        className="w-full h-full object-cover"
                      />
                    </div>
                    <button
                      type="button"
                      onClick={() =>
                        handleInputChange("guardian", "motherDocument", "")
                      }
                      className="absolute -top-3 -right-3 p-2.5 bg-red-500 text-white rounded-full shadow-lg hover:bg-red-600 transition-all hover:scale-110"
                    >
                      <X className="w-4 h-4" />
                    </button>
                  </div>
                ) : (
                  <div className="w-44 h-44 rounded-2xl border-4 border-dashed border-slate-200 dark:border-slate-200 flex items-center justify-center bg-[#e6f4ef] dark:bg-[#e6f4ef]">
                    <div className="text-center">
                      <ImageIcon className="w-14 h-14 text-emerald-400 mx-auto mb-2" />
                      <p className="text-xs text-emerald-600 font-bold">
                        No Document
                      </p>
                    </div>
                  </div>
                )}

                <div className="flex-1">
                  <label className="block cursor-pointer group">
                    <div className="border-3 border-dashed border-slate-200 dark:border-slate-200 rounded-2xl p-8 bg-[#e6f4ef] dark:bg-[#e6f4ef] hover:bg-[#d9ede6] transition-all">
                      <div className="flex flex-col items-center text-center gap-3">
                        <div className="w-16 h-16 rounded-full bg-white dark:bg-white flex items-center justify-center group-hover:scale-110 transition-transform">
                          <Upload className="w-8 h-8 text-[#00bd7f]" />
                        </div>
                        <div>
                          <p className="text-sm font-bold text-slate-700 dark:text-slate-700 mb-1">
                            {formData.guardian.motherDocument
                              ? "Change Document"
                              : "Upload Mother's Document"}
                          </p>
                          <p className="text-xs text-slate-500 dark:text-slate-500">
                            Click to browse or drag and drop
                          </p>
                          <p className="text-xs text-slate-400 dark:text-slate-400 mt-1">
                            PNG, JPG, PDF up to 5MB
                          </p>
                        </div>
                      </div>
                    </div>
                    <input
                      type="file"
                      accept="image/*,.pdf"
                      className="hidden"
                      onChange={(e) =>
                        handleImageUpload(
                          e.target.files?.[0],
                          "guardian",
                          "motherDocument"
                        )
                      }
                    />
                  </label>
                </div>
              </div>
            </div> */}
          {/* </div> */}
        </div>

        {/* Students Section */}
        <div className="space-y-8">
          <div className="flex items-center justify-between">
            <h2 className="text-2xl font-black text-slate-800 dark:text-slate-800 flex items-center gap-3">
              <Users className="w-8 h-8 text-[#00bd7f]" />
              Student List ({formData.students.length})
            </h2>
            <button
              type="button"
              onClick={addStudent}
              className="flex items-center gap-2 px-6 py-3 bg-[#00bd7f] text-white font-black rounded-2xl hover:bg-[#009b68] transition-all shadow-lg shadow-emerald-500/20"
            >
              <Plus className="w-5 h-5" />
              Add Another Student
            </button>
          </div>

          {formData.students.map((student, index) => (
            <div
              key={student.id}
              className="relative bg-white dark:bg-white rounded-3xl border-2 border-slate-200 dark:border-slate-200 p-4 sm:p-6 md:p-8 shadow-sm hover:shadow-md transition-shadow animate-in slide-in-from-bottom duration-500"
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
                <div className="w-12 h-12 rounded-2xl bg-emerald-500 flex items-center justify-center text-white font-black shadow-lg shadow-emerald-500/30">
                  {index + 1}
                </div>
                <div>
                  <h3 className="text-xl font-black text-emerald-800">
                    Student #{index + 1} Setup
                  </h3>
                  <p className="text-sm font-bold text-slate-500">
                    Personal and Financial Details
                  </p>
                </div>
              </div>

              {/* Student Bio */}
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
                <div>
                  <label className="text-sm font-bold text-slate-700 dark:text-slate-700 mb-2 block">
                    Full Name <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="text"
                    required
                    value={student.firstName}
                    onChange={(e) =>
                      handleStudentChange(index, "firstName", e.target.value)
                    }
                    className="w-full px-4 py-3 bg-[#e6f4ef] dark:bg-[#e6f4ef] border-2 border-slate-200 dark:border-slate-200 text-slate-900 dark:text-slate-900 rounded-xl outline-none focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 transition-all"
                    placeholder="Enter student name"
                  />
                </div>
                <div>
                  <label className="text-sm font-bold text-slate-700 dark:text-slate-700 mb-2 block">
                    Gender <span className="text-red-500">*</span>
                  </label>
                  <select
                    required
                    value={student.gender}
                    onChange={(e) =>
                      handleStudentChange(index, "gender", e.target.value)
                    }
                    className="w-full px-4 py-3 bg-[#e6f4ef] dark:bg-[#e6f4ef] border-2 border-slate-200 dark:border-slate-200 text-slate-900 dark:text-slate-900 rounded-xl outline-none focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 transition-all"
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
                    className="w-full px-4 py-3 bg-[#e6f4ef] dark:bg-[#e6f4ef] border-2 border-slate-200 dark:border-slate-200 text-slate-900 dark:text-slate-900 rounded-xl outline-none focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 transition-all"
                  />
                </div>
                {/* <div>
                  <label className="text-sm font-bold text-slate-700 dark:text-slate-700 mb-2 block">
                    Phone Number <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="tel"
                    required
                    value={student.phone}
                    onChange={(e) =>
                      handleStudentChange(index, "phone", e.target.value)
                    }
                    className="w-full px-4 py-3 bg-[#e6f4ef] dark:bg-[#e6f4ef] border-2 border-slate-200 dark:border-slate-200 text-slate-900 dark:text-slate-900 rounded-xl outline-none focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 transition-all"
                    placeholder="01XXXXXXXXX"
                  />
                </div> */}
                <div>
                  <label className="text-sm font-bold text-slate-700 dark:text-slate-700 mb-2 block">
                    Blood Group
                  </label>
                  <select
                    value={student.bloodGroup}
                    onChange={(e) =>
                      handleStudentChange(index, "bloodGroup", e.target.value)
                    }
                    className="w-full px-4 py-3 bg-[#e6f4ef] dark:bg-[#e6f4ef] border-2 border-slate-200 dark:border-slate-200 text-slate-900 dark:text-slate-900 rounded-xl outline-none focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 transition-all"
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
                    value={student.class}
                    onChange={(e) =>
                      handleStudentChange(index, "class", e.target.value)
                    }
                    className="w-full px-4 py-3 bg-[#e6f4ef] dark:bg-[#e6f4ef] border-2 border-slate-200 dark:border-slate-200 text-slate-900 dark:text-slate-900 rounded-xl outline-none focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 transition-all"
                  >
                    <option value="">Select Class</option>
                    <option value="Nursery">Nursery</option>
                    <option value="KG">KG</option>
                    <option value="Class 1">Class 1</option>
                    <option value="Class 2">Class 2</option>
                    <option value="Class 3">Class 3</option>
                    <option value="Class 4">Class 4</option>
                    <option value="Class 5">Class 5</option>
                  </select>
                </div>
                <div>
                  <label className="text-sm font-bold text-slate-700 dark:text-slate-700 mb-2 block">
                    Section
                  </label>
                  <select
                    value={student.section}
                    onChange={(e) =>
                      handleStudentChange(index, "section", e.target.value)
                    }
                    className="w-full px-4 py-3 bg-[#e6f4ef] dark:bg-[#e6f4ef] border-2 border-slate-200 dark:border-slate-200 text-slate-900 dark:text-slate-900 rounded-xl outline-none focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 transition-all"
                  >
                    <option value="">Select Section</option>
                    <option value="A">A</option>
                    <option value="B">B</option>
                    <option value="C">C</option>
                  </select>
                </div>
                {/* <div>
                  <label className="text-sm font-bold text-slate-700 dark:text-slate-700 mb-2 block">
                    Login Password <span className="text-red-500">*</span>
                  </label>
                  <div className="relative">
                    <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                    <input
                      type="text"
                      required
                      value={student.password}
                      onChange={(e) =>
                        handleStudentChange(index, "password", e.target.value)
                      }
                      className="w-full pl-10 pr-4 py-3 bg-[#e6f4ef] dark:bg-[#e6f4ef] border-2 border-slate-200 dark:border-slate-200 text-slate-900 dark:text-slate-900 rounded-xl outline-none focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 transition-all"
                      placeholder="Admission password"
                    />
                  </div>
                </div> */}

                {/* Photo Upload for this student */}
                <div className="col-span-full">
                  <div className="flex items-center gap-6 p-4 bg-emerald-50/50 rounded-2xl border-2 border-emerald-100">
                    <div className="relative">
                      {student.photo ? (
                        <img
                          src={student.photo}
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
                          onChange={(e) =>
                            handleImageUpload(
                              e.target.files?.[0],
                              "student",
                              "photo",
                              index
                            )
                          }
                        />
                      </label>
                    </div>
                    <div>
                      <p className="font-bold text-emerald-900 text-sm">
                        Student Photo
                      </p>
                      <p className="text-xs text-emerald-600 font-medium mt-0.5">
                        High quality passport size photo recommended
                      </p>
                    </div>
                  </div>
                </div>
              </div>

              {/* Fee Setup for this student */}
              <div className="bg-slate-50 dark:bg-slate-50/50 rounded-2xl p-6 border-2 border-slate-100 mb-8">
                <div className="flex items-center gap-2 mb-6 text-emerald-700">
                  <Calculator className="w-5 h-5" />
                  <h4 className="font-black">Fee Setup (ফি সেটআপ)</h4>
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
                  <div>
                    <label className="text-xs font-black text-slate-500 uppercase mb-2 block">
                      Admission Fee
                    </label>
                    <input
                      type="number"
                      value={student.financial.admissionFee}
                      onChange={(e) =>
                        handleStudentChange(
                          index,
                          "admissionFee",
                          e.target.value,
                          "financial"
                        )
                      }
                      className="w-full px-4 py-2.5 bg-white border-2 border-slate-200 rounded-xl outline-none focus:ring-2 focus:ring-emerald-500"
                    />
                  </div>
                  <div>
                    <label className="text-xs font-black text-slate-500 uppercase mb-2 block">
                      Monthly Fee
                    </label>
                    <input
                      type="number"
                      value={student.financial.monthlyFee}
                      onChange={(e) =>
                        handleStudentChange(
                          index,
                          "monthlyFee",
                          e.target.value,
                          "financial"
                        )
                      }
                      className="w-full px-4 py-2.5 bg-white border-2 border-slate-200 rounded-xl outline-none focus:ring-2 focus:ring-emerald-500"
                    />
                  </div>
                  <div>
                    <label className="text-xs font-black text-slate-500 uppercase mb-2 block">
                      Boarding Fee
                    </label>
                    <input
                      type="number"
                      value={student.financial.hostelFee}
                      onChange={(e) =>
                        handleStudentChange(
                          index,
                          "hostelFee",
                          e.target.value,
                          "financial"
                        )
                      }
                      className="w-full px-4 py-2.5 bg-white border-2 border-slate-200 rounded-xl outline-none focus:ring-2 focus:ring-emerald-500"
                    />
                  </div>
                  <div>
                    <label className="text-xs font-black text-slate-500 uppercase mb-2 block">
                      Transport Fee
                    </label>
                    <input
                      type="number"
                      value={student.financial.transportFee}
                      onChange={(e) =>
                        handleStudentChange(
                          index,
                          "transportFee",
                          e.target.value,
                          "financial"
                        )
                      }
                      className="w-full px-4 py-2.5 bg-white border-2 border-slate-200 rounded-xl outline-none focus:ring-2 focus:ring-emerald-500"
                    />
                  </div>
                </div>
              </div>

              {/* Transport & Hostel for this student */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="p-5 rounded-2xl border-2 border-slate-100 bg-white shadow-sm hover:shadow-md transition-shadow">
                  <div className="flex items-center justify-between mb-4">
                    <div className="flex items-center gap-2 text-emerald-700">
                      <Bus className="w-5 h-5" />
                      <span className="font-bold">Transport Service</span>
                    </div>
                    <label className="relative inline-flex items-center cursor-pointer">
                      <input
                        type="checkbox"
                        className="sr-only peer"
                        checked={student.transport.required}
                        onChange={(e) =>
                          handleStudentChange(
                            index,
                            "required",
                            e.target.checked,
                            "transport"
                          )
                        }
                      />
                      <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-[#00bd7f]"></div>
                    </label>
                  </div>
                  {student.transport.required && (
                    <select
                      value={student.transport.route}
                      onChange={(e) =>
                        handleStudentChange(
                          index,
                          "route",
                          e.target.value,
                          "transport"
                        )
                      }
                      className="w-full px-4 py-2.5 bg-[#e6f4ef] border-2 border-slate-200 rounded-xl outline-none focus:ring-2 focus:ring-emerald-500"
                    >
                      <option value="">Select Route</option>
                      <option value="Mirpur - Dhanmondi">
                        Mirpur - Dhanmondi
                      </option>
                      <option value="Gulshan - Banani">Gulshan - Banani</option>
                      <option value="Uttara - Mohakhali">
                        Uttara - Mohakhali
                      </option>
                    </select>
                  )}
                </div>

                <div className="p-5 rounded-2xl border-2 border-slate-100 bg-white shadow-sm hover:shadow-md transition-shadow">
                  <div className="flex items-center justify-between mb-4">
                    <div className="flex items-center gap-2 text-emerald-700">
                      <Home className="w-5 h-5" />
                      <span className="font-bold">Hostel Service</span>
                    </div>
                    <label className="relative inline-flex items-center cursor-pointer">
                      <input
                        type="checkbox"
                        className="sr-only peer"
                        checked={student.hostel.required}
                        onChange={(e) =>
                          handleStudentChange(
                            index,
                            "required",
                            e.target.checked,
                            "hostel"
                          )
                        }
                      />
                      <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-[#00bd7f]"></div>
                    </label>
                  </div>
                  {student.hostel.required && (
                    <select
                      value={student.hostel.roomType}
                      onChange={(e) =>
                        handleStudentChange(
                          index,
                          "roomType",
                          e.target.value,
                          "hostel"
                        )
                      }
                      className="w-full px-4 py-2.5 bg-[#e6f4ef] border-2 border-slate-200 rounded-xl outline-none focus:ring-2 focus:ring-emerald-500"
                    >
                      <option value="">Select Room Type</option>
                      <option value="Single Room">Single Room</option>
                      <option value="Shared Room">Shared Room</option>
                      <option value="Dormitory">Dormitory</option>
                    </select>
                  )}
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Submit Button */}
        <div className="flex flex-col sm:flex-row items-center justify-end gap-4 pt-4 border-t-2 border-slate-100">
          <button
            type="button"
            onClick={handleReset}
            className="w-full sm:w-auto flex items-center justify-center gap-2 px-8 py-4 text-sm font-black bg-slate-100 text-slate-600 rounded-2xl hover:bg-slate-200 transition-all border-2 border-slate-200 shadow-sm"
          >
            <X className="w-5 h-5" />
            Reset Form
          </button>
          <button
            type="submit"
            className="w-full sm:w-auto flex items-center justify-center gap-3 px-12 py-4 text-base font-black bg-[#00bd7f] text-white rounded-2xl hover:bg-[#009b68] transition-all shadow-xl shadow-emerald-500/30 hover:-translate-y-1"
          >
            <CheckCircle2 className="w-6 h-6" />
            Complete Admission
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

// Voucher Modal Component
const VoucherModal = ({ formData, onClose }) => {
  const handlePrint = () => {
    window.print();
  };

  const totalAdmission = formData.students.reduce(
    (acc, s) => acc + (Number(s.financial.admissionFee) || 0),
    0
  );
  const totalMonthly = formData.students.reduce(
    (acc, s) => acc + (Number(s.financial.monthlyFee) || 0),
    0
  );
  const totalHostel = formData.students.reduce(
    (acc, s) => acc + (Number(s.financial.hostelFee) || 0),
    0
  );
  const totalTransport = formData.students.reduce(
    (acc, s) => acc + (Number(s.financial.transportFee) || 0),
    0
  );

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm animate-in fade-in duration-300">
      <div className="bg-white w-full max-w-4xl max-h-[90vh] overflow-y-auto rounded-[2.5rem] shadow-2xl flex flex-col">
        {/* Modal Header */}
        <div className="p-6 border-b-2 border-slate-100 flex items-center justify-between sticky top-0 bg-white/80 backdrop-blur-md z-10">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-emerald-500 flex items-center justify-center">
              <Printer className="w-6 h-6 text-white" />
            </div>
            <h2 className="text-xl font-black text-slate-800">
              Admission Voucher
            </h2>
          </div>
          <div className="flex items-center gap-3">
            <button
              onClick={handlePrint}
              className="flex items-center gap-2 px-5 py-2.5 bg-emerald-500 text-white font-black rounded-xl hover:bg-emerald-600 transition-all shadow-lg shadow-emerald-500/20"
            >
              <Printer className="w-4 h-4" />
              Print Voucher
            </button>
            <button
              onClick={onClose}
              className="p-2.5 bg-slate-100 text-slate-500 rounded-xl hover:bg-slate-200 transition-all"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Voucher Content */}
        <div className="p-8 print-content" id="printable-voucher">
          <style>
            {`
              @media print {
                body * { visibility: hidden; }
                #printable-voucher, #printable-voucher * { visibility: visible; }
                #printable-voucher {
                  position: absolute;
                  left: 0;
                  top: 0;
                  width: 100%;
                  margin: 0;
                  padding: 20px;
                }
                .no-print { display: none !important; }
              }
            `}
          </style>

          {/* Institutional Header */}
          <div className="flex justify-between items-start border-b-4 border-emerald-500 pb-8 mb-8">
            <div>
              <h1 className="text-4xl font-black text-emerald-700 tracking-tighter mb-2">
                MADRASA MANAGEMENT SYSTEM
              </h1>
              <p className="text-slate-500 font-bold uppercase tracking-widest text-sm">
                Official Admission Receipt
              </p>
            </div>
            <div className="text-right">
              <div className="text-emerald-700 font-black text-lg mb-1">
                VOICE NO: {Date.now().toString().slice(-6)}
              </div>
              <div className="text-slate-500 font-bold">
                DATE: {formData.admissionDate}
              </div>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-12 mb-10">
            {/* Guardian Info Card */}
            <div className="space-y-4">
              <h3 className="text-xs font-black text-slate-400 uppercase tracking-widest border-b-2 border-slate-100 pb-2">
                Guardian Details
              </h3>
              <div>
                <p className="text-lg font-black text-slate-800">
                  {formData.guardian.fatherName}
                </p>
                <p className="text-sm font-bold text-slate-500 italic">
                  Father & Lead Guardian
                </p>
              </div>
              <div className="space-y-1">
                <p className="text-sm font-bold text-slate-700 flex items-center gap-2">
                  <Phone className="w-3.5 h-3.5" /> {formData.guardian.contact}
                </p>
                <p className="text-sm font-bold text-slate-700 flex items-center gap-2">
                  <MapPin className="w-3.5 h-3.5" /> {formData.guardian.address}
                </p>
              </div>
            </div>

            {/* Admission Summary */}
            <div className="space-y-4">
              <h3 className="text-xs font-black text-slate-400 uppercase tracking-widest border-b-2 border-slate-100 pb-2">
                Academic Summary
              </h3>
              <div className="grid grid-cols-2 gap-4">
                <div className="p-4 bg-slate-50 rounded-2xl border-2 border-slate-100">
                  <p className="text-[10px] font-black text-slate-400 uppercase mb-1">
                    Academic Year
                  </p>
                  <p className="text-sm font-black text-slate-800">
                    {formData.academicYear}
                  </p>
                </div>
                <div className="p-4 bg-slate-50 rounded-2xl border-2 border-slate-100">
                  <p className="text-[10px] font-black text-slate-400 uppercase mb-1">
                    Students
                  </p>
                  <p className="text-sm font-black text-slate-800">
                    {formData.students.length}
                  </p>
                </div>
              </div>
            </div>
          </div>

          {/* Students Table */}
          <div className="mb-10">
            <h3 className="text-xs font-black text-slate-400 uppercase tracking-widest mb-4">
              Enrolled Students
            </h3>
            <div className="border-2 border-slate-200 rounded-3xl overflow-hidden shadow-sm">
              <table className="w-full text-left border-collapse">
                <thead>
                  <tr className="bg-slate-50 border-b-2 border-slate-200">
                    <th className="p-4 text-xs font-black text-slate-500 uppercase">
                      Student Name
                    </th>
                    <th className="p-4 text-xs font-black text-slate-500 uppercase">
                      Class
                    </th>
                    <th className="p-4 text-xs font-black text-slate-500 uppercase text-right">
                      Adm. Fee
                    </th>
                    <th className="p-4 text-xs font-black text-slate-500 uppercase text-right">
                      Monthly
                    </th>
                  </tr>
                </thead>
                <tbody className="divide-y-2 divide-slate-100">
                  {formData.students.map((s, idx) => (
                    <tr key={idx}>
                      <td className="p-4">
                        <p className="font-black text-slate-800">
                          {s.firstName}
                        </p>
                        <p className="text-[10px] font-bold text-slate-400">
                          ID: {Date.now().toString().slice(-4)}
                        </p>
                      </td>
                      <td className="p-4 font-bold text-slate-600">
                        {s.class} ({s.section})
                      </td>
                      <td className="p-4 font-black text-slate-800 text-right">
                        ৳{s.financial.admissionFee}
                      </td>
                      <td className="p-4 font-black text-slate-800 text-right">
                        ৳{s.financial.monthlyFee}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>

          {/* Financial Breakdown */}
          <div className="flex justify-end gap-12">
            <div className="w-80 space-y-4">
              <div className="flex justify-between items-center text-slate-600 font-bold">
                <span>Subtotal Admission</span>
                <span>৳{totalAdmission}</span>
              </div>
              <div className="flex justify-between items-center text-slate-600 font-bold">
                <span>Subtotal Monthly</span>
                <span>৳{totalMonthly}</span>
              </div>
              {totalHostel > 0 && (
                <div className="flex justify-between items-center text-slate-600 font-bold">
                  <span>Subtotal Hostel</span>
                  <span>৳{totalHostel}</span>
                </div>
              )}
              {totalTransport > 0 && (
                <div className="flex justify-between items-center text-slate-600 font-bold">
                  <span>Subtotal Transport</span>
                  <span>৳{totalTransport}</span>
                </div>
              )}
              <div className="pt-4 border-t-2 border-emerald-500 flex justify-between items-center text-emerald-700">
                <span className="text-xl font-black">Total Payable</span>
                <span className="text-2xl font-black">
                  ৳
                  {totalAdmission + totalMonthly + totalHostel + totalTransport}
                </span>
              </div>
            </div>
          </div>

          {/* Signatures */}
          <div className="mt-20 flex justify-between">
            <div className="text-center w-48 pt-4 border-t-2 border-slate-200">
              <p className="text-sm font-black text-slate-800">Accountant</p>
            </div>
            <div className="text-center w-48 pt-4 border-t-2 border-slate-200">
              <p className="text-sm font-black text-slate-800">
                Guardian Signature
              </p>
            </div>
            <div className="text-center w-48 pt-4 border-t-2 border-emerald-500">
              <p className="text-sm font-black text-emerald-700">Principal</p>
            </div>
          </div>
        </div>

        {/* Modal Footer */}
        <div className="p-6 bg-slate-50 border-t-2 border-slate-100 text-center">
          <p className="text-slate-400 text-xs font-bold uppercase tracking-widest">
            Computer generated voucher - No seal required
          </p>
        </div>
      </div>
    </div>
  );
};

export default CreateAdmission;
