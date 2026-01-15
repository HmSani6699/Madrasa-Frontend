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
  UserPlus
} from "lucide-react";

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
      children: ["মোহাম্মদ রহমান"]
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
      children: ["আয়েশা খাতুন"]
    }
  ];

  const [formData, setFormData] = useState({
    // Academic Year
    academicYear: "2025-2026",
    admissionDate: new Date().toISOString().split('T')[0],
    
    // Student Information
    student: {
      firstName: "",
      lastName: "",
      gender: "Male",
      dateOfBirth: "",
      bloodGroup: "",
      class: "",
      phone: "",
      email: "",
      section: "",
      photo: ""
    },
    
    // Guardian Information
    guardian: {
      fatherName: "",
      motherName: "",
      fatherOccupation: "",
      motherOccupation: "",
      contact: "",
      email: "",
      address: "",
      fatherDocument: "",
      motherDocument: ""
    },
    
    // Transport Details
    transport: {
      required: false,
      route: ""
    },
    
    // Hostel Details
    hostel: {
      required: false,
      roomType: ""
    }
  });

  const handleInputChange = (section, field, value) => {
    if (section) {
      setFormData(prev => ({
        ...prev,
        [section]: {
          ...prev[section],
          [field]: value
        }
      }));
    } else {
      setFormData(prev => ({
        ...prev,
        [field]: value
      }));
    }
  };

  const handleImageUpload = (section, field, file) => {
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        handleInputChange(section, field, reader.result);
      };
      reader.readAsDataURL(file);
    }
  };

  const selectGuardian = (guardian) => {
    setFormData(prev => ({
      ...prev,
      guardian: {
        fatherName: guardian.fatherName,
        motherName: guardian.motherName,
        fatherOccupation: guardian.fatherOccupation,
        motherOccupation: guardian.motherOccupation,
        contact: guardian.contact,
        email: guardian.email,
        address: guardian.address
      }
    }));
    setUseExistingGuardian(false);
    setGuardianSearchTerm("");
  };

  const filteredGuardians = existingGuardians.filter(g =>
    g.fatherName.toLowerCase().includes(guardianSearchTerm.toLowerCase()) ||
    g.motherName.toLowerCase().includes(guardianSearchTerm.toLowerCase()) ||
    g.contact.includes(guardianSearchTerm)
  );

  const handleSubmit = (e) => {
    e.preventDefault();
    console.log("Admission Data:", formData);
    alert("Admission created successfully!");
  };

  const handleReset = () => {
    if (confirm("Are you sure you want to reset the form?")) {
      setFormData({
        academicYear: "2025-2026",
        admissionDate: new Date().toISOString().split('T')[0],
        student: {
          firstName: "",
          lastName: "",
          gender: "Male",
          dateOfBirth: "",
          bloodGroup: "",
          class: "",
          phone: "",
          email: "",
          section: "",
          photo: ""
        },
        guardian: {
          fatherName: "",
          motherName: "",
          fatherOccupation: "",
          motherOccupation: "",
          contact: "",
          email: "",
          address: "",
          fatherDocument: "",
          motherDocument: ""
        },
        transport: {
          required: false,
          route: ""
        },
        hostel: {
          required: false,
          roomType: ""
        }
      });
    }
  };

  return (
    <div className="space-y-6 sm:space-y-8 animate-in fade-in duration-500 p-3 sm:p-4 md:p-6 lg:p-8">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 bg-white dark:bg-white p-6 rounded-3xl border-2 border-slate-200 dark:border-slate-200 shadow-sm text-center md:text-left">
        <div>
          <h1 className="text-2xl sm:text-3xl font-black text-slate-800 dark:text-slate-800 mb-1">Create New Admission</h1>
          <p className="text-slate-600 dark:text-slate-600 text-sm font-semibold">Add a new student to the system</p>
        </div>
        <div className="flex items-center gap-3">
          <button
            type="button"
            onClick={handleReset}
            className="w-full sm:w-auto flex items-center justify-center gap-2 px-5 py-2.5 text-sm font-bold bg-[#00bd7f] text-white rounded-xl hover:bg-[#009b68] transition-all shadow-sm"
          >
            <X className="w-4 h-4" />
            Reset Form
          </button>
        </div>
      </div>

      <form onSubmit={handleSubmit} className="space-y-8">
        {/* Academic Year & Admission Date */}
        <div className="bg-white dark:bg-white rounded-3xl border-2 border-slate-200 dark:border-slate-200 p-4 sm:p-6 md:p-8 shadow-sm hover:shadow-md transition-shadow">
          <div className="flex items-center gap-3 mb-6 pb-4 border-b-2 border-slate-200 dark:border-slate-200">
            <div className="w-10 h-10 rounded-xl bg-emerald-100 dark:bg-emerald-100 flex items-center justify-center">
              <Calendar className="w-5 h-5 text-emerald-600" />
            </div>
            <h2 className="text-xl font-black text-emerald-700 dark:text-emerald-700">Academic Information</h2>
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
                onChange={(e) => handleInputChange(null, 'academicYear', e.target.value)}
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
                onChange={(e) => handleInputChange(null, 'admissionDate', e.target.value)}
                className="w-full px-4 py-3 bg-[#e6f4ef] dark:bg-[#e6f4ef] border-2 border-slate-200 dark:border-slate-200 text-slate-900 dark:text-slate-900 rounded-xl outline-none focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 transition-all"
              />
            </div>
          </div>
        </div>

        {/* Student Information */}
        <div className="bg-white dark:bg-white rounded-3xl border-2 border-slate-200 dark:border-slate-200 p-4 sm:p-6 md:p-8 shadow-sm hover:shadow-md transition-shadow">
          <div className="flex items-center gap-3 mb-6 pb-4 border-b-2 border-slate-200 dark:border-slate-200">
            <div className="w-10 h-10 rounded-xl bg-emerald-100 dark:bg-emerald-100 flex items-center justify-center">
              <User className="w-5 h-5 text-emerald-600" />
            </div>
            <h2 className="text-xl font-black text-emerald-700 dark:text-emerald-700">Student Information</h2>
          </div>
          
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            <div>
              <label className="text-sm font-bold text-slate-700 dark:text-slate-700 mb-2 block">
                First Name <span className="text-red-500">*</span>
              </label>
              <input
                type="text"
                required
                value={formData.student.firstName}
                onChange={(e) => handleInputChange('student', 'firstName', e.target.value)}
                className="w-full px-4 py-3 bg-[#e6f4ef] dark:bg-[#e6f4ef] border-2 border-slate-200 dark:border-slate-200 text-slate-900 dark:text-slate-900 rounded-xl outline-none focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 transition-all"
                placeholder="Enter first name"
              />
            </div>
            <div>
              <label className="text-sm font-bold text-slate-700 dark:text-slate-700 mb-2 block">
                Last Name <span className="text-red-500">*</span>
              </label>
              <input
                type="text"
                required
                value={formData.student.lastName}
                onChange={(e) => handleInputChange('student', 'lastName', e.target.value)}
                className="w-full px-4 py-3 bg-[#e6f4ef] dark:bg-[#e6f4ef] border-2 border-slate-200 dark:border-slate-200 text-slate-900 dark:text-slate-900 rounded-xl outline-none focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 transition-all"
                placeholder="Enter last name"
              />
            </div>
            <div>
              <label className="text-sm font-bold text-slate-700 dark:text-slate-700 mb-2 block">
                Gender <span className="text-red-500">*</span>
              </label>
              <select
                required
                value={formData.student.gender}
                onChange={(e) => handleInputChange('student', 'gender', e.target.value)}
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
                value={formData.student.dateOfBirth}
                onChange={(e) => handleInputChange('student', 'dateOfBirth', e.target.value)}
                className="w-full px-4 py-3 bg-[#e6f4ef] dark:bg-[#e6f4ef] border-2 border-slate-200 dark:border-slate-200 text-slate-900 dark:text-slate-900 rounded-xl outline-none focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 transition-all"
              />
            </div>
            <div>
              <label className="text-sm font-bold text-slate-700 dark:text-slate-700 mb-2 block">
                Class <span className="text-red-500">*</span>
              </label>
              <select
                required
                value={formData.student.class}
                onChange={(e) => handleInputChange('student', 'class', e.target.value)}
                className="w-full px-4 py-3 bg-[#e6f4ef] dark:bg-[#e6f4ef] border-2 border-slate-200 dark:border-slate-200 text-slate-900 dark:text-slate-900 rounded-xl outline-none focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 transition-all"
              >
                <option value="">Select Class</option>
                <option value="Class 1">Class 1</option>
                <option value="Class 2">Class 2</option>
                <option value="Class 3">Class 3</option>
                <option value="Class 4">Class 4</option>
                <option value="Class 5">Class 5</option>
                <option value="Class 6">Class 6</option>
                <option value="Class 7">Class 7</option>
                <option value="Class 8">Class 8</option>
                <option value="Class 9">Class 9</option>
                <option value="Class 10">Class 10</option>
              </select>
            </div>
            <div>
              <label className="text-sm font-bold text-slate-700 dark:text-slate-700 mb-2 block">
                Section <span className="text-red-500">*</span>
              </label>
              <select
                required
                value={formData.student.section}
                onChange={(e) => handleInputChange('student', 'section', e.target.value)}
                className="w-full px-4 py-3 bg-[#e6f4ef] dark:bg-[#e6f4ef] border-2 border-slate-200 dark:border-slate-200 text-slate-900 dark:text-slate-900 rounded-xl outline-none focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 transition-all"
              >
                <option value="">Select Section</option>
                <option value="A">Section A</option>
                <option value="B">Section B</option>
                <option value="C">Section C</option>
              </select>
            </div>
            <div>
              <label className="text-sm font-bold text-slate-700 dark:text-slate-700 mb-2 block">
                Blood Group <span className="text-red-500">*</span>
              </label>
              <select
                required
                value={formData.student.bloodGroup}
                onChange={(e) => handleInputChange('student', 'bloodGroup', e.target.value)}
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
                Phone Number <span className="text-red-500">*</span>
              </label>
              <input
                type="tel"
                required
                value={formData.student.phone}
                onChange={(e) => handleInputChange('student', 'phone', e.target.value)}
                className="w-full px-4 py-3 bg-[#e6f4ef] dark:bg-[#e6f4ef] border-2 border-slate-200 dark:border-slate-200 text-slate-900 dark:text-slate-900 rounded-xl outline-none focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 transition-all"
                placeholder="01XXXXXXXXX"
              />
            </div>
            <div>
              <label className="text-sm font-bold text-slate-700 dark:text-slate-700 mb-2 block">
                Email
              </label>
              <input
                type="email"
                value={formData.student.email}
                onChange={(e) => handleInputChange('student', 'email', e.target.value)}
                className="w-full px-4 py-3 bg-[#e6f4ef] dark:bg-[#e6f4ef] border-2 border-slate-200 dark:border-slate-200 text-slate-900 dark:text-slate-900 rounded-xl outline-none focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 transition-all"
                placeholder="student@example.com"
              />
            </div>
            
            {/* Student Photo Upload */}
            <div className="grid-cols-1 sm:col-span-2 lg:col-span-3">
              <label className="text-sm font-bold text-slate-700 dark:text-slate-700 mb-3 block">
                Student Photo
              </label>
              <div className="flex flex-col sm:flex-row items-center sm:items-start gap-6">
                {formData.student.photo ? (
                  <div className="relative group">
                    <div className="w-44 h-44 rounded-2xl overflow-hidden border-4 border-emerald-200 dark:border-emerald-800 shadow-lg">
                      <img src={formData.student.photo} alt="Student" className="w-full h-full object-cover" />
                    </div>
                    <button
                      type="button"
                      onClick={() => handleInputChange('student', 'photo', '')}
                      className="absolute -top-3 -right-3 p-2.5 bg-red-500 text-white rounded-full shadow-lg hover:bg-red-600 transition-all hover:scale-110"
                    >
                      <X className="w-4 h-4" />
                    </button>
                  </div>
                ) : (
                  <div className="w-44 h-44 rounded-2xl border-4 border-dashed border-slate-200 dark:border-slate-200 flex items-center justify-center bg-[#e6f4ef] dark:bg-[#e6f4ef]">
                    <div className="text-center">
                      <ImageIcon className="w-14 h-14 text-emerald-400 mx-auto mb-2" />
                      <p className="text-xs text-emerald-600 font-bold">No Photo</p>
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
                            {formData.student.photo ? 'Change Photo' : 'Upload Student Photo'}
                          </p>
                          <p className="text-xs text-slate-500 dark:text-slate-500">
                            Click to browse or drag and drop
                          </p>
                          <p className="text-xs text-slate-400 dark:text-slate-400 mt-1">
                            PNG, JPG up to 5MB
                          </p>
                        </div>
                      </div>
                    </div>
                    <input
                      type="file"
                      accept="image/*"
                      className="hidden"
                      onChange={(e) => handleImageUpload('student', 'photo', e.target.files?.[0])}
                    />
                  </label>
                </div>
              </div>
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
              <h2 className="text-xl font-black text-emerald-700 dark:text-emerald-700">Guardian Information</h2>
            </div>
            <button
              type="button"
              onClick={() => setUseExistingGuardian(!useExistingGuardian)}
              className={`flex items-center gap-2 px-4 py-2 text-sm font-bold rounded-xl transition-all ${
                useExistingGuardian
                  ? 'bg-[#00bd7f] text-white shadow-lg shadow-emerald-500/30'
                  : 'bg-slate-100 dark:bg-slate-700 text-slate-700 dark:text-slate-700 hover:bg-slate-200 dark:hover:bg-slate-600'
              }`}
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
                              <p className="text-xs font-bold text-slate-500 uppercase mb-1">Father's Name</p>
                              <p className="font-bold text-slate-700 dark:text-slate-700">{guardian.fatherName}</p>
                            </div>
                            <div>
                              <p className="text-xs font-bold text-slate-500 uppercase mb-1">Mother's Name</p>
                              <p className="font-bold text-slate-700 dark:text-slate-700">{guardian.motherName}</p>
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
                          <div className="flex items-center gap-2 mt-2">
                            <span className="text-xs font-bold text-emerald-600 dark:text-emerald-400">
                              Existing Children:
                            </span>
                            {guardian.children.map((child, idx) => (
                              <span
                                key={idx}
                                className="inline-block px-2 py-1 bg-emerald-50 dark:bg-emerald-50 text-emerald-700 dark:text-emerald-700 text-xs font-bold rounded-lg border border-emerald-100"
                              >
                                {child}
                              </span>
                            ))}
                          </div>
                        </div>
                        <button
                          type="button"
                          className="ml-4 px-3 py-1.5 bg-[#00bd7f] text-white text-xs font-bold rounded-lg opacity-0 group-hover:opacity-100 transition-opacity"
                        >
                          Select
                        </button>
                      </div>
                    </div>
                  ))
                ) : (
                  <div className="text-center py-8">
                    <Users className="w-12 h-12 text-slate-300 mx-auto mb-3" />
                    <p className="text-slate-500 font-medium">
                      {guardianSearchTerm ? 'No guardians found matching your search' : 'Start typing to search for existing guardians'}
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
                onChange={(e) => handleInputChange('guardian', 'fatherName', e.target.value)}
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
                onChange={(e) => handleInputChange('guardian', 'motherName', e.target.value)}
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
                onChange={(e) => handleInputChange('guardian', 'fatherOccupation', e.target.value)}
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
                onChange={(e) => handleInputChange('guardian', 'motherOccupation', e.target.value)}
                className="w-full px-4 py-3 bg-[#e6f4ef] dark:bg-[#e6f4ef] border-2 border-slate-200 dark:border-slate-200 text-slate-900 dark:text-slate-900 rounded-xl outline-none focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 transition-all"
                placeholder="Enter occupation"
              />
            </div>
            <div>
              <label className="text-sm font-bold text-slate-700 dark:text-slate-700 mb-2 block">
                Contact Number <span className="text-red-500">*</span>
              </label>
              <input
                type="tel"
                required
                value={formData.guardian.contact}
                onChange={(e) => handleInputChange('guardian', 'contact', e.target.value)}
                className="w-full px-4 py-3 bg-[#e6f4ef] dark:bg-[#e6f4ef] border-2 border-slate-200 dark:border-slate-200 text-slate-900 dark:text-slate-900 rounded-xl outline-none focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 transition-all"
                placeholder="01XXXXXXXXX"
              />
            </div>
            <div>
              <label className="text-sm font-bold text-slate-700 dark:text-slate-700 mb-2 block">
                Email
              </label>
              <input
                type="email"
                value={formData.guardian.email}
                onChange={(e) => handleInputChange('guardian', 'email', e.target.value)}
                className="w-full px-4 py-3 bg-[#e6f4ef] dark:bg-[#e6f4ef] border-2 border-slate-200 dark:border-slate-200 text-slate-900 dark:text-slate-900 rounded-xl outline-none focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 transition-all"
                placeholder="guardian@example.com"
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
                onChange={(e) => handleInputChange('guardian', 'address', e.target.value)}
                className="w-full px-4 py-3 bg-[#e6f4ef] dark:bg-[#e6f4ef] border-2 border-slate-200 dark:border-slate-200 text-slate-900 dark:text-slate-900 rounded-xl outline-none focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 transition-all"
                placeholder="Enter full address"
              />
            </div>
            
            {/* Document Uploads Sub-grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 lg:col-span-3">
              {/* Father's Document Upload */}
              <div className="w-full">
              <label className="text-sm font-bold text-slate-700 dark:text-slate-700 mb-3 block">
                Father's Document (ID Card, NID, etc.)
              </label>
              <div className="flex flex-col sm:flex-row items-center sm:items-start gap-6">
                {formData.guardian.fatherDocument ? (
                  <div className="relative group">
                    <div className="w-44 h-44 rounded-2xl overflow-hidden border-4 border-emerald-200 dark:border-emerald-800 shadow-lg">
                      <img src={formData.guardian.fatherDocument} alt="Father's Document" className="w-full h-full object-cover" />
                    </div>
                    <button
                      type="button"
                      onClick={() => handleInputChange('guardian', 'fatherDocument', '')}
                      className="absolute -top-3 -right-3 p-2.5 bg-red-500 text-white rounded-full shadow-lg hover:bg-red-600 transition-all hover:scale-110"
                    >
                      <X className="w-4 h-4" />
                    </button>
                  </div>
                ) : (
                  <div className="w-44 h-44 rounded-2xl border-4 border-dashed border-slate-200 dark:border-slate-200 flex items-center justify-center bg-[#e6f4ef] dark:bg-[#e6f4ef]">
                    <div className="text-center">
                      <ImageIcon className="w-14 h-14 text-emerald-400 mx-auto mb-2" />
                      <p className="text-xs text-emerald-600 font-bold">No Document</p>
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
                            {formData.guardian.fatherDocument ? 'Change Document' : 'Upload Father\'s Document'}
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
                      onChange={(e) => handleImageUpload('guardian', 'fatherDocument', e.target.files?.[0])}
                    />
                  </label>
                </div>
              </div>
            </div>
              
              {/* Mother's Document Upload */}
              <div className="w-full">
              <label className="text-sm font-bold text-slate-700 dark:text-slate-700 mb-3 block">
                Mother's Document (ID Card, NID, etc.)
              </label>
              <div className="flex flex-col sm:flex-row items-center sm:items-start gap-6">
                {formData.guardian.motherDocument ? (
                  <div className="relative group">
                    <div className="w-44 h-44 rounded-2xl overflow-hidden border-4 border-emerald-200 dark:border-emerald-800 shadow-lg">
                      <img src={formData.guardian.motherDocument} alt="Mother's Document" className="w-full h-full object-cover" />
                    </div>
                    <button
                      type="button"
                      onClick={() => handleInputChange('guardian', 'motherDocument', '')}
                      className="absolute -top-3 -right-3 p-2.5 bg-red-500 text-white rounded-full shadow-lg hover:bg-red-600 transition-all hover:scale-110"
                    >
                      <X className="w-4 h-4" />
                    </button>
                  </div>
                ) : (
                  <div className="w-44 h-44 rounded-2xl border-4 border-dashed border-slate-200 dark:border-slate-200 flex items-center justify-center bg-[#e6f4ef] dark:bg-[#e6f4ef]">
                    <div className="text-center">
                      <ImageIcon className="w-14 h-14 text-emerald-400 mx-auto mb-2" />
                      <p className="text-xs text-emerald-600 font-bold">No Document</p>
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
                            {formData.guardian.motherDocument ? 'Change Document' : 'Upload Mother\'s Document'}
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
                    />
                  </label>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

        {/* Transport & Hostel Details */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {/* Transport */}
          <div className="bg-white dark:bg-white rounded-3xl border-2 border-slate-200 dark:border-slate-200 p-4 sm:p-6 md:p-8 shadow-sm hover:shadow-md transition-shadow">
            <div className="flex items-center gap-3 mb-6 pb-4 border-b-2 border-slate-200 dark:border-slate-200">
              <div className="w-10 h-10 rounded-xl bg-emerald-100 dark:bg-emerald-100 flex items-center justify-center">
                <MapPin className="w-5 h-5 text-emerald-600" />
              </div>
              <h2 className="text-xl font-black text-emerald-700 dark:text-emerald-700">Transport</h2>
            </div>
            <div className="space-y-4">
              <div className="flex items-center gap-3">
                <input
                  type="checkbox"
                  id="transportRequired"
                  checked={formData.transport.required}
                  onChange={(e) => handleInputChange('transport', 'required', e.target.checked)}
                  className="w-5 h-5 text-emerald-600 rounded border-2 border-slate-300 focus:ring-2 focus:ring-emerald-500"
                />
                <label htmlFor="transportRequired" className="text-sm font-bold text-slate-700 dark:text-slate-700 cursor-pointer">
                  Transport Required
                </label>
              </div>
              {formData.transport.required && (
                <div>
                  <label className="text-sm font-bold text-slate-700 dark:text-slate-700 mb-2 block">
                    Select Route <span className="text-red-500">*</span>
                  </label>
                  <select
                    required={formData.transport.required}
                    value={formData.transport.route}
                    onChange={(e) => handleInputChange('transport', 'route', e.target.value)}
                    className="w-full px-4 py-3 bg-[#e6f4ef] dark:bg-[#e6f4ef] border-2 border-slate-200 dark:border-slate-200 text-slate-900 dark:text-slate-900 rounded-xl outline-none focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 transition-all"
                  >
                    <option value="">Select Route</option>
                    <option value="Mirpur - Dhanmondi">Mirpur - Dhanmondi</option>
                    <option value="Gulshan - Banani">Gulshan - Banani</option>
                    <option value="Uttara - Mohakhali">Uttara - Mohakhali</option>
                    <option value="Badda - Rampura">Badda - Rampura</option>
                  </select>
                </div>
              )}
            </div>
          </div>

          {/* Hostel */}
          <div className="bg-white dark:bg-white rounded-3xl border-2 border-slate-200 dark:border-slate-200 p-4 sm:p-6 md:p-8 shadow-sm hover:shadow-md transition-shadow">
            <div className="flex items-center gap-3 mb-6 pb-4 border-b-2 border-slate-200 dark:border-slate-200">
              <div className="w-10 h-10 rounded-xl bg-emerald-100 dark:bg-emerald-100 flex items-center justify-center">
                <Home className="w-5 h-5 text-emerald-600" />
              </div>
              <h2 className="text-xl font-black text-emerald-700 dark:text-emerald-700">Hostel</h2>
            </div>
            <div className="space-y-4">
              <div className="flex items-center gap-3">
                <input
                  type="checkbox"
                  id="hostelRequired"
                  checked={formData.hostel.required}
                  onChange={(e) => handleInputChange('hostel', 'required', e.target.checked)}
                  className="w-5 h-5 text-emerald-600 rounded border-2 border-slate-300 focus:ring-2 focus:ring-emerald-500"
                />
                <label htmlFor="hostelRequired" className="text-sm font-bold text-slate-700 dark:text-slate-700 cursor-pointer">
                  Hostel Required
                </label>
              </div>
              {formData.hostel.required && (
                <div>
                  <label className="text-sm font-bold text-slate-700 dark:text-slate-700 mb-2 block">
                    Room Type <span className="text-red-500">*</span>
                  </label>
                  <select
                    required={formData.hostel.required}
                    value={formData.hostel.roomType}
                    onChange={(e) => handleInputChange('hostel', 'roomType', e.target.value)}
                    className="w-full px-4 py-3 bg-[#e6f4ef] dark:bg-[#e6f4ef] border-2 border-slate-200 dark:border-slate-200 text-slate-900 dark:text-slate-900 rounded-xl outline-none focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 transition-all"
                  >
                    <option value="">Select Room Type</option>
                    <option value="Single Room">Single Room</option>
                    <option value="Shared Room">Shared Room (2 Students)</option>
                    <option value="Dormitory">Dormitory (4+ Students)</option>
                  </select>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Submit Button */}
        <div className="flex flex-col sm:flex-row items-center justify-end gap-4 pt-4">
          <button
            type="submit"
            className="w-full sm:w-auto flex items-center justify-center gap-2 px-10 py-4 text-base font-bold bg-[#00bd7f] text-white rounded-2xl shadow-lg shadow-emerald-500/30 hover:shadow-xl hover:shadow-emerald-500/40 hover:scale-[1.02] transition-all"
          >
            <Save className="w-5 h-5" />
            Create Admission
          </button>
        </div>
      </form>
    </div>
  );
};

export default CreateAdmission;
