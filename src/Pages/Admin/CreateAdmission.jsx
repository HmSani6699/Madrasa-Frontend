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
import InputField from "../../components/InputField";
import TextareaField from "../../components/TextareaField";
import SelectInputField from "../../components/SelectInputField";

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
  };

  const [formData, setFormData] = useState({
    academicYear: "2025-2026",
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
      g.contact.includes(guardianSearchTerm),
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
        position: "New",
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

  const allFeeType = [
    { name: "Admission Fee" },
    { name: "Monthly Fee" },
    { name: "Boding Fee" },
    { name: "Card Fee" },
    { name: "Tussion Fee" },
    { name: "utiliy Fee" },
  ];

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
            <div className="w-10 h-10 rounded-xl bg-[#e6f4ef] flex items-center justify-center">
              <Calendar className="w-5 h-5 text-[#00bd7f]" />
            </div>
            <h2 className="text-xl font-black text-[#00bd7f]">
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
            />
          </div>
        </div>

        {/* Guardian Information */}
        <div className="bg-white dark:bg-white rounded-3xl border-2 border-slate-200 dark:border-slate-200 p-4 sm:p-6 md:p-8 shadow-sm hover:shadow-md transition-shadow">
          <div className="flex items-center justify-between mb-6 pb-4 border-b-2 border-slate-200 dark:border-slate-200">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-[#e6f4ef] flex items-center justify-center">
                <Users className="w-5 h-5 text-[#00bd7f]" />
              </div>
              <h2 className="text-xl font-black text-[#00bd7f]">
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
            />
          </div>
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
                    Full Name <span className="text-[#00bd7f]">*</span>
                  </label>
                  <input
                    type="text"
                    required
                    value={student.firstName}
                    onChange={(e) =>
                      handleStudentChange(index, "firstName", e.target.value)
                    }
                    className="w-full px-4 py-3 bg-[#e6f4ef] dark:bg-[#e6f4ef] border border-slate-200 dark:border-slate-200 text-slate-900 dark:text-slate-900 rounded-xl outline-none focus:ring-1 focus:ring-emerald-500 focus:border-emerald-500 transition-all"
                    placeholder="Enter student name"
                  />
                </div>

                <div>
                  <label className="text-sm font-bold text-slate-700 dark:text-slate-700 mb-2 block">
                    Gender <span className="text-[#00bd7f]">*</span>
                  </label>
                  <select
                    required
                    value={student.gender}
                    onChange={(e) =>
                      handleStudentChange(index, "gender", e.target.value)
                    }
                    className="w-full px-4 py-3 bg-[#e6f4ef] dark:bg-[#e6f4ef] border border-slate-200 dark:border-slate-200 text-slate-900 dark:text-slate-900 rounded-xl outline-none focus:ring-1 focus:ring-emerald-500 focus:border-emerald-500 transition-all"
                  >
                    <option value="Male">Male</option>
                    <option value="Female">Female</option>
                  </select>
                </div>
                <div>
                  <label className="text-sm font-bold text-slate-700 dark:text-slate-700 mb-2 block">
                    Date of Birth <span className="text-[#00bd7f]">*</span>
                  </label>
                  <input
                    type="date"
                    required
                    value={student.dateOfBirth}
                    onChange={(e) =>
                      handleStudentChange(index, "dateOfBirth", e.target.value)
                    }
                    className="w-full px-4 py-3 bg-[#e6f4ef] dark:bg-[#e6f4ef] border border-slate-200 dark:border-slate-200 text-slate-900 dark:text-slate-900 rounded-xl outline-none focus:ring-1 focus:ring-emerald-500 focus:border-emerald-500 transition-all"
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
                    className="w-full px-4 py-3 bg-[#e6f4ef] dark:bg-[#e6f4ef] border border-slate-200 dark:border-slate-200 text-slate-900 dark:text-slate-900 rounded-xl outline-none focus:ring-1 focus:ring-emerald-500 focus:border-emerald-500 transition-all"
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
                    Assigned Class <span className="text-[#00bd7f]">*</span>
                  </label>
                  <select
                    required
                    value={student.class}
                    onChange={(e) =>
                      handleStudentChange(index, "class", e.target.value)
                    }
                    className="w-full px-4 py-3 bg-[#e6f4ef] dark:bg-[#e6f4ef] border border-slate-200 dark:border-slate-200 text-slate-900 dark:text-slate-900 rounded-xl outline-none focus:ring-1 focus:ring-emerald-500 focus:border-emerald-500 transition-all"
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
                    className="w-full px-4 py-3 bg-[#e6f4ef] dark:bg-[#e6f4ef] border border-slate-200 dark:border-slate-200 text-slate-900 dark:text-slate-900 rounded-xl outline-none focus:ring-1 focus:ring-emerald-500 focus:border-emerald-500 transition-all"
                  >
                    <option value="">Select Section</option>
                    <option value="A">A</option>
                    <option value="B">B</option>
                    <option value="C">C</option>
                  </select>
                </div>

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
                              index,
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
              {/* Fee Setup (ফি সেটআপ) */}
              <div className="flex items-center gap-2 mb-6 text-emerald-700">
                <Calculator className="w-5 h-5" />
                <h4 className="font-black">Fee Setup (ফি সেটআপ)</h4>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                {allFeeType?.map((type, i) => (
                  <div key={i} className="p-5 rounded-3xl border-2 border-slate-100 bg-white shadow-sm hover:shadow-md transition-all duration-300">
                    <div className="flex items-center justify-between mb-4">
                      <div className="flex items-center gap-3 text-emerald-700">
                        <div className="w-8 h-8 rounded-lg bg-emerald-50 flex items-center justify-center">
                          <Home className="w-4 h-4 text-[#00bd7f]" />
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
                        <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-[#00bd7f]"></div>
                      </label>
                    </div>

                    {/* Dynamic Amount Input */}
                    {student.fees?.[type.name] !== undefined && (
                      <div className="animate-in slide-in-from-top-2 duration-300">
                        <div className="relative group">
                          <div className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 font-bold group-focus-within:text-[#00bd7f] transition-colors">৳</div>
                          <input
                            type="number"
                            value={student.fees[type.name]}
                            onChange={(e) => {
                              const currentFees = { ...(student.fees || {}) };
                              currentFees[type.name] = e.target.value;
                              handleStudentChange(index, "fees", currentFees);
                            }}
                            placeholder="Enter amount"
                            className="w-full pl-8 pr-4 py-2.5 bg-[#f8fafc] border-2 border-slate-100 rounded-xl outline-none focus:border-[#00bd7f] focus:bg-white text-sm font-bold text-slate-700 transition-all placeholder:text-slate-300"
                          />
                        </div>
                      </div>
                    )}
                  </div>
                ))}
              </div>

              <div className="grid-cols-1 sm:col-span-2 lg:col-span-3 mt-[20px]">
                <label className="text-sm font-bold text-slate-700 dark:text-slate-700 mb-2 block">
                  Note <span className="text-[#00bd7f]">*</span>
                </label>
                <textarea
                  required
                  rows="3"
                  value={student.note}
                  onChange={(e) => handleStudentChange(index, "note", e.target.value)}
                  className="w-full px-4 py-3 bg-[#e6f4ef] dark:bg-[#e6f4ef] border-1 border-slate-200 dark:border-slate-200 text-slate-900 dark:text-slate-900 rounded-xl outline-none focus:ring-1 focus:ring-emerald-500 focus:border-emerald-500 transition-all"
                  placeholder="Enter full Detals in Student"
                />
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

// Voucher Modal Component
const VoucherModal = ({ formData, onClose }) => {
  const handlePrint = () => {
    window.print();
  };

  // Extract all unique fee names present in the current students
  const activeFeeNames = Array.from(
    new Set(
      formData.students.flatMap((s) => Object.keys(s.fees || {}))
    )
  );

  // Grouped subtotals for the breakdown
  const feeSubtotals = activeFeeNames.reduce((acc, feeName) => {
    acc[feeName] = formData.students.reduce(
      (sum, s) => sum + (Number(s.fees?.[feeName]) || 0),
      0
    );
    return acc;
  }, {});

  const totalPayable = Object.values(feeSubtotals).reduce((a, b) => a + b, 0);

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm animate-in fade-in duration-300">
      <div className="bg-white w-full max-w-4xl max-h-[90vh] overflow-y-auto rounded-[2.5rem] shadow-2xl flex flex-col">
        {/* Modal Header */}
        <div className="p-6 border-b-2 border-slate-100 flex items-center justify-between sticky top-0 bg-white/80 backdrop-blur-md z-10">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-[#00bd7f] flex items-center justify-center">
              <Printer className="w-6 h-6 text-white" />
            </div>
            <h2 className="text-xl font-black text-slate-800">
              Admission Voucher
            </h2>
          </div>
          <div className="flex items-center gap-3">
            <button
              onClick={handlePrint}
              className="flex items-center gap-2 px-5 py-2.5 bg-[#00bd7f] text-white font-black rounded-xl hover:bg-[#009b68] transition-all shadow-lg shadow-emerald-500/20 shadow-[#00bd7f]/20 cursor-pointer"
            >
              <Printer className="w-4 h-4" />
              Print Voucher
            </button>
            <button
              onClick={onClose}
              className="p-2.5 bg-slate-100 text-slate-500 rounded-xl hover:bg-slate-200 transition-all cursor-pointer"
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
          <div className="flex justify-between items-start border-b-4 border-[#00bd7f] pb-8 mb-8">
            <div>
              <h1 className="text-4xl font-black text-[#00bd7f] tracking-tighter mb-2">
                MADRASA MANAGEMENT SYSTEM
              </h1>
              <p className="text-slate-500 font-bold uppercase tracking-widest text-sm">
                Official Admission Receipt
              </p>
            </div>
            <div className="text-right">
              <div className="text-[#00bd7f] font-black text-lg mb-1">
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
                    <th className="p-4 text-xs font-black text-slate-500 uppercase">
                      Fee Details
                    </th>
                    <th className="p-4 text-xs font-black text-slate-500 uppercase text-right">
                      Subtotal
                    </th>
                  </tr>
                </thead>
                <tbody className="divide-y-2 divide-slate-100">
                  {formData.students.map((s, idx) => {
                    const studentTotal = Object.values(s.fees || {}).reduce((sum, val) => sum + (Number(val) || 0), 0);
                    return (
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
                        <td className="p-4">
                          <div className="flex flex-wrap gap-2 text-[10px]">
                            {Object.entries(s.fees || {}).map(([name, val]) => (
                              <span key={name} className="px-2 py-1 bg-slate-50 rounded-lg font-bold text-slate-500 border border-slate-100">
                                {name}: ৳{val}
                              </span>
                            ))}
                          </div>
                        </td>
                        <td className="p-4 font-black text-slate-800 text-right">
                          ৳{studentTotal}
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          </div>

          {/* Financial Breakdown */}
          <div className="flex justify-end gap-12">
            <div className="w-80 space-y-4">
              {Object.entries(feeSubtotals).map(([feeName, amount]) => (
                <div key={feeName} className="flex justify-between items-center text-slate-600 font-bold">
                  <span>Subtotal {feeName}</span>
                  <span>৳{amount}</span>
                </div>
              ))}
              <div className="pt-4 border-t-2 border-[#00bd7f] flex justify-between items-center text-[#00bd7f]">
                <span className="text-xl font-black">Total Payable</span>
                <span className="text-2xl font-black">
                  ৳{totalPayable}
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
            <div className="text-center w-48 pt-4 border-t-2 border-[#00bd7f]">
              <p className="text-sm font-black text-[#00bd7f]">Principal</p>
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
