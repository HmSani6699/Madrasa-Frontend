import { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import {
  User,
  Users,
  Briefcase,
  GraduationCap,
  Building2,
  Calendar,
  Phone,
  Mail,
  MapPin,
  Map,
  Lock,
  Facebook,
  Twitter,
  Linkedin,
  CreditCard,
  ShieldCheck,
  ShieldAlert,
  Heart,
  Droplets,
  Plus,
  ArrowLeft,
  Save,
  ChevronDown,
  FileText,
  Upload,
  Image as ImageIcon,
} from "lucide-react";
import axiosInstance from "../../api/axiosInstance";
import { toast } from "react-hot-toast";
import SelectInputField from "../../components/SelectInputField";
import InputField from "../../components/InputField";

/**
 * CreateEmployee Component
 * Transitions Employee registration to a dedicated single-page layout.
 * Matches the institutional dark green theme from the reference image.
 */
const CreateEmployee = () => {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [departments, setDepartments] = useState([]);
  const [designations, setDesignations] = useState([]);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const desigsRes = await axiosInstance.get("/v1/designations")
        if (desigsRes?.data?.success) setDesignations(desigsRes?.data?.data);
      } catch (err) {
        console.error("Error fetching dynamic data:", err);
      }
    };
    fetchData();
  }, []);
  // useEffect(() => {
  //   const fetchData = async () => {
  //     try {
  //       const [deptsRes, desigsRes] = await Promise.all([
  //         // axiosInstance.get("/v1/departments"),
  //         axiosInstance.get("/v1/designations")
  //       ]);

  //       console.log(desigsRes);


  //       // if (deptsRes.data.success) setDepartments(deptsRes.data.data);
  //       if (desigsRes?.data?.success) setDesignations(desigsRes?.data?.data);
  //     } catch (err) {
  //       console.error("Error fetching dynamic data:", err);
  //     }
  //   };
  //   fetchData();
  // }, []);

  const [formData, setFormData] = useState({
    // Academic Details
    role: "Admin",
    joinDate: "2026-01-08",
    designation: "",
    department: "Administrator",
    qualification: "",
    totalExperience: "",

    // Employee Details
    employeeID: "",
    name: "",
    gender: "",
    bloodGroup: "",
    dob: "",
    phone: "",
    email: "",
    address: "",
    photo: null,

    // Login Details
    password: "",
    confirmPassword: "",

    // Social Links
    facebook: "",
    twitter: "",
    linkedin: "",

    // Bank Details
    paymentMethod: "Mobile Banking", // Options: "Bank", "Mobile Banking", "None"
    bankName: "",
    holderName: "",
    bankBranch: "",
    bankAddress: "",
    ifscCode: "",
    accountNo: "",
    mobileMethods: ["Bkash"], // Options: "Bkash", "Nagad", "Rocket"
    mobileNumber: "",
  });

  const handleInputChange = (field, value) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
  };

  const handleImageUpload = (file) => {
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        handleInputChange("photo", reader.result);
      };
      reader.readAsDataURL(file);
    }
  };

  const [params, setParams] = useState(new URLSearchParams(window.location.search));
  const editId = params.get("id");

  useEffect(() => {
    const fetchEmployee = async () => {
      if (!editId) return;
      setLoading(true);
      try {
        const response = await axiosInstance.get(`/v1/staff/${editId}`);
        if (response.data.success) {
          const emp = response.data.data;
          setFormData({
            role: emp.userId?.role ? emp.userId.role.charAt(0).toUpperCase() + emp.userId.role.slice(1) : "Staff",
            joinDate: emp.joinDate ? new Date(emp.joinDate).toISOString().split('T')[0] : "",
            designation: emp.designation,
            department: emp.department,
            qualification: emp.qualification || "",
            totalExperience: emp.totalExperience || "",
            employeeID: emp.employeeID || "",
            name: emp.name,
            gender: emp.gender,
            bloodGroup: emp.bloodGroup,
            dob: emp.dob ? new Date(emp.dob).toISOString().split('T')[0] : "",
            phone: emp.phone,
            email: emp.userId?.email || "",
            address: emp.address,
            photo: emp.photo,
            password: "", // Don't pre-fill password
            confirmPassword: "",
            facebook: emp.socialLinks?.facebook || "",
            twitter: emp.socialLinks?.twitter || "",
            linkedin: emp.socialLinks?.linkedin || "",
            paymentMethod: emp.paymentDetails?.paymentMethod || "None",
            bankName: emp.paymentDetails?.bankName || "",
            holderName: emp.paymentDetails?.holderName || "",
            bankBranch: emp.paymentDetails?.bankBranch || "",
            bankAddress: emp.paymentDetails?.bankAddress || "",
            ifscCode: emp.paymentDetails?.ifscCode || "",
            accountNo: emp.paymentDetails?.accountNo || "",
            mobileMethods: emp.paymentDetails?.mobileMethods || [],
            mobileNumber: emp.paymentDetails?.mobileNumber || ""
          });
        }
      } catch (err) {
        console.error(err);
        toast.error("Failed to fetch employee details");
      } finally {
        setLoading(false);
      }
    };
    fetchEmployee();
  }, [editId]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!editId && formData.password !== formData.confirmPassword) {
      return toast.error("Passwords do not match");
    }
    setLoading(true);

    try {
      const payload = {
        ...formData,
        paymentMethod: formData.paymentMethod,
        bankDetails: {
          bankName: formData.bankName,
          holderName: formData.holderName,
          bankBranch: formData.bankBranch,
          bankAddress: formData.bankAddress,
          ifscCode: formData.ifscCode,
          accountNo: formData.accountNo
        }
      };

      let response;
      if (editId) {
        response = await axiosInstance.put(`/v1/staff/${editId}`, payload);
      } else {
        response = await axiosInstance.post("/v1/staff", payload);
      }

      if (response.data.success) {
        toast.success(editId ? "Employee updated successfully!" : "Employee created successfully!");
        navigate("/admin/employee/list");
      }
    } catch (err) {
      console.error("Employee save error:", err);
      toast.error(err.response?.data?.message || err.response?.data?.error || "Failed to save employee");
    } finally {
      setLoading(false);
    }
  };



  console.log(designations);


  return (
    <div className="min-h-screen  p-4 animate-in fade-in duration-700">
      {/* Page Header */}
      <div className="flex items-center justify-between mb-5 w-full">
        <div>
          <h1 className="text-[20px] font-black text-slate-800 flex items-center gap-3">
            <Users className="w-8 h-8 text-[#00315e]" />
            New Staff
          </h1>
        </div>

        <div className="flex items-center gap-3">
          <button
            onClick={() => navigate("/admin/employee/list")}
            className="w-full sm:w-auto flex items-center justify-center gap-2 px-5 py-2.5 text-sm font-bold bg-[#00315e] text-white rounded-[8px] hover:bg-[#00315e] transition-all shadow-sm cursor-pointer"
          >
            <User className="w-4 h-4" /> All Staff List
          </button>
        </div>
      </div>

      <form
        onSubmit={handleSubmit}
        className="max-w-7xl mx-auto space-y-12 pb-20"
      >
        {/* Academic Details Section */}
        <SectionContainer
          id="academic"
          title="Academic Details"
          icon={GraduationCap}
        >
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-5">
            <FormInput
              label="Employee ID"
              field="employeeID"
              data={formData}
              setter={handleInputChange}
              required
              icon={Briefcase}
              placeholder="e.g., EMP-101"
            />
            <FormSelect
              label="Role"
              field="role"
              options={["Select", "Teacher", "Talimat", "Accountant", "Staff"]}
              data={formData}
              setter={handleInputChange}
              required
              icon={Briefcase}
            />

            <FormInput
              label="Joining Date"
              field="joinDate"
              type="date"
              data={formData}
              setter={handleInputChange}
              required
              icon={Calendar}
            />

            <FormSelect
              label="Designation"
              field="designation"
              options={["Select", ...designations.map(d => d.title || d.name || d._id)]}
              data={formData}
              setter={handleInputChange}
              required
              icon={Briefcase}
            />

            <FormSelect
              label="Department"
              field="department"
              // options={["Select", ...departments.map(d => d.name || d.title || d._id)]}
              options={["Select", "Academic", "Boading", " IT "]}
              data={formData}
              setter={handleInputChange}

              icon={Building2}
            />

            <FormInput
              label="Qualification"
              field="qualification"
              data={formData}
              setter={handleInputChange}
              icon={GraduationCap}
              placeholder="Enter Qualification"
            />

            <FormInput
              label="Total Experience"
              field="totalExperience"
              data={formData}
              setter={handleInputChange}
              icon={Briefcase}
              placeholder="e.g., 5 years"
            />
          </div>
        </SectionContainer>

        {/* Employee Details Section */}
        <SectionContainer id="personal" title="Employee Details" icon={User}>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            <FormInput
              label="Name"
              field="name"
              data={formData}
              setter={handleInputChange}
              required
              icon={User}
              placeholder={"Enter Your Name"}
            />
            <FormSelect
              label="Gender"
              field="gender"
              options={["Select", "Male", "Female"]}
              data={formData}
              setter={handleInputChange}
              icon={Users}
            />
            <FormSelect
              label="Blood group"
              field="bloodGroup"
              options={[
                "Select",
                "A+",
                "A-",
                "B+",
                "B-",
                "O+",
                "O-",
                "AB+",
                "AB-",
              ]}
              data={formData}
              setter={handleInputChange}
              icon={Droplets}
            />
            <FormInput
              label="Date Of Birth"
              field="dob"
              type="date"
              data={formData}
              setter={handleInputChange}
              icon={Calendar}
            />
            <FormInput
              label="Mobile No"
              field="phone"
              data={formData}
              setter={handleInputChange}
              required
              icon={Phone}
              placeholder={"019XXXXXXXX"}
            />
            {/* <FormInput
              label="Email"
              field="email"
              type="email"
              data={formData}
              setter={handleInputChange}
              required
              icon={Mail}
            /> */}
            <FormInput
              label="Address"
              field="address"
              data={formData}
              setter={handleInputChange}
              required
              icon={MapPin}
              placeholder={"Enter Address"}
            />

            {/* Profile Picture Upload - Full Width Span */}
            <div className="md:col-span-2 lg:col-span-3 mt-4">
              <label className="text-slate-500 text-[10px] font-black uppercase tracking-widest mb-4 block">
                Profile Picture
              </label>
              <div
                className="relative group border-2 border-dashed border-slate-200 rounded-[8px] bg-[#00315e24] hover:bg-[#00315e33] hover:border-[#00315e] transition-all p-12 text-center cursor-pointer"
                onClick={() => document.getElementById("photo-upload").click()}
              >
                <input
                  id="photo-upload"
                  type="file"
                  accept="image/*"
                  onChange={(e) => handleImageUpload(e.target.files?.[0])}
                  className="hidden"
                />

                {formData.photo ? (
                  <div className="flex flex-col items-center gap-4">
                    <img
                      src={formData.photo}
                      alt="Preview"
                      className="w-32 h-32 rounded-3xl object-cover border-4 border-white shadow-2xl"
                    />
                    <p className="text-slate-800 font-black text-sm">
                      Image Captured Successfully
                    </p>
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        handleInputChange("photo", null);
                      }}
                      className="text-slate-400 hover:text-rose-500 transition-colors text-xs underline"
                    >
                      Remove Photo
                    </button>
                  </div>
                ) : (
                  <div className="flex flex-col items-center gap-4">
                    <div className="w-20 h-20 bg-white rounded-3xl flex items-center justify-center group-hover:scale-110 transition-transform shadow-sm">
                      <Upload className="w-10 h-10 text-[#00315e]" />
                    </div>
                    <div>
                      <h4 className="text-xl font-black text-slate-800 mb-1">
                        Drag and drop a file here or click
                      </h4>
                      <p className="text-slate-400 text-[10px] font-black uppercase tracking-widest">
                        Supports JPG, PNG (Max 5MB)
                      </p>
                    </div>
                  </div>
                )}

                {/* Decorative Icon */}
                <div className="absolute top-1/2 right-12 -translate-y-1/2 opacity-[0.03] hidden lg:block">
                  <ImageIcon className="w-48 h-48 text-slate-800 rotate-12" />
                </div>
              </div>
            </div>
          </div>
        </SectionContainer>

        {/* Login Details Section */}
        <SectionContainer id="login" title="Login Details" icon={Lock}>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-2 gap-8">
            <FormInput
              label="Password"
              field="password"
              type="password"
              data={formData}
              setter={handleInputChange}
              required
              icon={Lock}
              placeholder={"......"}
            />
            <FormInput
              label="Retype Password"
              field="confirmPassword"
              type="password"
              data={formData}
              setter={handleInputChange}
              required
              icon={Lock}
              placeholder={"......"}
            />
          </div>
        </SectionContainer>

        {/* Social Links Section */}
        <SectionContainer id="social" title="Social Links" icon={Facebook}>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <FormInput
              label="Facebook"
              field="facebook"
              placeholder="eg: https://www.facebook.com/username"
              data={formData}
              setter={handleInputChange}
              icon={Facebook}
            />
            <FormInput
              label="Twitter"
              field="twitter"
              placeholder="eg: https://www.twitter.com/username"
              data={formData}
              setter={handleInputChange}
              icon={Twitter}
            />
            <FormInput
              label="Linkedin"
              field="linkedin"
              placeholder="eg: https://www.linkedin.com/username"
              data={formData}
              setter={handleInputChange}
              icon={Linkedin}
            />
          </div>
        </SectionContainer>

        {/* Bank & Payment Details Section */}
        <SectionContainer id="bank" title="Payment Details" icon={CreditCard}>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 mb-8">
            <FormSelect
              label="Payment Method"
              field="paymentMethod"
              options={["Bank", "Mobile Banking", "None"]}
              data={formData}
              setter={handleInputChange}
              required
              icon={ShieldCheck}
            />
          </div>

          {formData.paymentMethod === "Bank" && (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 animate-in slide-in-from-top-4 duration-500">
              <FormInput
                label="Bank Name"
                field="bankName"
                data={formData}
                setter={handleInputChange}
                required
                icon={Building2}
                placeholder="Enter Bank Name"
              />
              <FormInput
                label="Holder Name"
                field="holderName"
                data={formData}
                setter={handleInputChange}
                required
                icon={User}
                placeholder="Enter Account Holder Name"
              />
              <FormInput
                label="Bank Branch"
                field="bankBranch"
                data={formData}
                setter={handleInputChange}
                required
                icon={MapPin}
                placeholder="Enter Branch Name"
              />
              <FormInput
                label="Bank Address"
                field="bankAddress"
                data={formData}
                setter={handleInputChange}
                icon={Map}
                placeholder="Enter Bank Address"
              />
              <FormInput
                label="IFSC Code"
                field="ifscCode"
                data={formData}
                setter={handleInputChange}
                icon={ShieldCheck}
                placeholder="Enter IFSC/Routing Code"
              />
              <FormInput
                label="Account No"
                field="accountNo"
                data={formData}
                setter={handleInputChange}
                required
                icon={CreditCard}
                placeholder="Enter Account Number"
              />
            </div>
          )}

          {formData.paymentMethod === "Mobile Banking" && (
            <div className="space-y-8 animate-in slide-in-from-top-4 duration-500">
              <div className="space-y-4">
                <label className="text-slate-500 text-[14px] font-black tracking-widest flex items-center gap-3 transition-colors">
                  Mobile Banking Methods{" "}
                  <span className="text-[#00bd7f]">*</span>
                </label>
                <div className="flex flex-wrap gap-4">
                  {["Bkash", "Nagad", "Rocket"].map((method) => (
                    <button
                      key={method}
                      type="button"
                      onClick={() => {
                        const currentMethods = formData.mobileMethods || [];
                        const newMethods = currentMethods.includes(method)
                          ? currentMethods.filter((m) => m !== method)
                          : [...currentMethods, method];
                        handleInputChange("mobileMethods", newMethods);
                      }}
                      className={`px-6 py-3 rounded-[8px] font-bold text-sm transition-all flex items-center gap-2 border-2 ${formData.mobileMethods?.includes(method)
                        ? "bg-[#00315e] border-[#00315e] text-white shadow-lg "
                        : "bg-[#00315e24] border-transparent text-slate-600 hover:border-slate-300"
                        }`}
                    >
                      <div
                        className={`w-4 h-4 rounded-md border-2 flex items-center justify-center ${formData.mobileMethods?.includes(method)
                          ? "bg-white border-white"
                          : "bg-white border-slate-200"
                          }`}
                      >
                        {formData.mobileMethods?.includes(method) && (
                          <ShieldCheck className="w-3 h-3 text-[#00315e]" />
                        )}
                      </div>
                      {method}
                    </button>
                  ))}
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                <FormInput
                  label="Mobile Number"
                  field="mobileNumber"
                  data={formData}
                  setter={handleInputChange}
                  required
                  icon={Phone}
                  placeholder="01XXXXXXXXX"
                />
              </div>
            </div>
          )}

          {formData.paymentMethod === "None" && (
            <div className="p-6 bg-slate-50 rounded-2xl border-2 border-dashed border-slate-200 text-center">
              <p className="text-slate-500 font-bold italic">
                No payment details provided. Staff will be paid in cash or
                through other manual methods.
              </p>
            </div>
          )}
        </SectionContainer>

        {/* Floating Action Bar */}
        <div className="flex flex-col lg:flex-row items-end justify-end gap-4">
          <button
            type="button"
            onClick={() => navigate("/admin/employee/list")}
            className="flex-1 md:flex-none px-8 py-3 text-slate-600 font-bold rounded-[8px] bg-red-500 text-white transition-all text-sm active:scale-95 cursor-pointer"
          >
            Cancel
          </button>
          <button
            type="submit"
            className="flex-1 md:flex-none px-8 py-3 bg-[#00315e] text-white font-bold rounded-[8px] shadow-sm hover:scale-[1.02] transition-all text-sm flex items-center justify-center gap-2 active:scale-95 cursor-pointer"
          >
            <Save className="w-4 h-4" /> Save
          </button>
        </div>
      </form>
    </div>
  );
};

/**
 * Reusable Section Container
 */
const SectionContainer = ({ title, icon: Icon, children }) => (
  <div className="bg-white dark:bg-white rounded-[8px] p-4 sm:p-6 md:p-8 shadow-sm hover:shadow-md transition-shadow mb-6">
    <div className="flex items-center gap-3 mb-6 pb-4 border-b-2 border-slate-200 dark:border-slate-200">
      <div className="w-10 h-10 rounded-xl bg-[#00315e24] flex items-center justify-center">
        <Icon className="w-5 h-5 text-[#00315e]" />
      </div>
      <h2 className="text-xl font-black text-[#00315e]">
        {title}
      </h2>
    </div>
    {children}
  </div>
);

/**
 * Reusable Control Elements
 */
const FormInput = ({
  label,
  field,
  type = "text",
  data,
  setter,
  required,
  icon: Icon,
  placeholder,
}) => (
  <div className="w-full">
    <label className="text-sm font-bold text-slate-700 dark:text-slate-700 mb-2 block">
      {label} {required && <span className="text-red-500">*</span>}
    </label>
    <div className="relative">
      <input
        type={type}
        value={data[field]}
        onChange={(e) => setter(field, e.target.value)}
        placeholder={placeholder}
        required={required}
        className="w-full px-4 py-2 bg-[#00315e24] dark:bg-[#00315e24] border border-slate-200 dark:border-slate-200 text-slate-900 dark:text-slate-900 rounded-[8px] outline-none focus:ring-1 focus:ring-[#00315e] focus:border-[#00315e] transition-all"
      />
    </div>
  </div>
);

const FormSelect = ({
  label,
  field,
  options,
  data,
  setter,
  required,
  icon: Icon,
}) => (
  <div className="w-full">
    <label className="text-sm font-bold text-slate-700 dark:text-slate-700 mb-2 block">
      {label} {required && <span className="text-red-500">*</span>}
    </label>
    <div className="relative">
      <select
        value={data[field]}
        onChange={(e) => setter(field, e.target.value)}
        required={required}
        className="w-full px-4 py-2 bg-[#00315e24] dark:bg-[#00315e24] border border-slate-200 dark:border-slate-200 text-slate-900 dark:text-slate-900 rounded-[8px] outline-none focus:ring-1 focus:ring-[#00315e] focus:border-[#00315e] transition-all appearance-none cursor-pointer"
      >
        {options.map((opt) => (
          <option key={opt} value={opt}>
            {opt}
          </option>
        ))}
      </select>
      <div className="absolute right-4 top-1/2 -translate-y-1/2 flex items-center pointer-events-none">
        <ChevronDown className="w-4 h-4 text-slate-400" />
      </div>
    </div>
  </div>
);

const FormTextarea = ({
  label,
  field,
  data,
  setter,
  required,
  icon: Icon,
  placeholder,
}) => (
  <div className="w-full">
    <label className="text-sm font-bold text-slate-700 dark:text-slate-700 mb-2 block">
      {label} {required && <span className="text-red-500">*</span>}
    </label>
    <div className="relative">
      <textarea
        value={data[field]}
        onChange={(e) => setter(field, e.target.value)}
        placeholder={placeholder}
        required={required}
        rows={2}
        className="w-full px-4 py-2 bg-[#00315e24] dark:bg-[#00315e24] border border-slate-200 dark:border-slate-200 text-slate-900 dark:text-slate-900 rounded-[8px] outline-none focus:ring-1 focus:ring-[#00315e] focus:border-[#00315e] transition-all resize-none"
      />
    </div>
  </div>
);

export default CreateEmployee;
