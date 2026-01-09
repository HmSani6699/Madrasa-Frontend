import { useState } from "react";
import { useNavigate } from "react-router-dom";
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
  Image as ImageIcon
} from "lucide-react";

/**
 * CreateEmployee Component
 * Transitions Employee registration to a dedicated single-page layout.
 * Matches the institutional dark green theme from the reference image.
 */
const CreateEmployee = () => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    // Academic Details
    role: "Admin",
    joinDate: "2026-01-08",
    designation: "",
    department: "Administrator",
    qualification: "",
    qualification: "",
    totalExperience: "",

    // Employee Details
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
    skipBank: false,
    bankName: "",
    holderName: "",
    bankBranch: "",
    bankAddress: "",
    ifscCode: "",
    accountNo: ""
  });

  const handleInputChange = (field, value) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const handleImageUpload = (file) => {
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        handleInputChange('photo', reader.result);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    console.log("Submitting Employee Data:", formData);
    // In a real app, this would be an API call
    alert("Employee created successfully!");
    navigate("/admin/employee/list");
  };

  return (
    <div className="min-h-screen bg-slate-50 p-4 sm:p-6 lg:p-10 animate-in fade-in duration-700">
      {/* Page Header */}
      <div className="max-w-7xl mx-auto mb-10 flex flex-col md:flex-row md:items-center justify-between gap-6 border-b border-slate-200 pb-8">
        <div className="flex items-center gap-6">
          <button 
            onClick={() => navigate("/admin/employee/list")}
            className="w-12 h-12 bg-white hover:bg-slate-50 text-slate-400 rounded-2xl flex items-center justify-center transition-all hover:scale-110 active:scale-90 shadow-sm border border-slate-200"
          >
            <ArrowLeft className="w-6 h-6" />
          </button>
          <div>
            <h1 className="text-3xl md:text-5xl font-black text-slate-800 tracking-tighter">New Staff Entry</h1>
            <p className="text-slate-500 text-xs font-bold uppercase tracking-[0.3em] mt-2">Institutional Management Protocol</p>
          </div>
        </div>
        <div className="flex gap-4">
          <button 
            type="button" 
            onClick={() => window.location.reload()}
            className="px-6 py-3 bg-white text-slate-600 font-black rounded-xl hover:bg-slate-50 transition-all uppercase text-[10px] tracking-widest border border-slate-200"
          >
            Clear Form
          </button>
          <button 
            onClick={handleSubmit}
            className="px-8 py-3 bg-[#00bd7f] text-white font-black rounded-xl hover:bg-[#00d992] transition-all shadow-xl shadow-emerald-500/20 uppercase text-[10px] tracking-widest flex items-center gap-2"
          >
            <Save className="w-4 h-4" /> Save Record
          </button>
        </div>
      </div>

      <form onSubmit={handleSubmit} className="max-w-7xl mx-auto space-y-12 pb-20">
        
        {/* Academic Details Section */}
        <SectionContainer 
          id="academic" 
          title="Academic Details" 
          icon={GraduationCap}
        >
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            <FormSelect label="Role" field="role" options={["Admin", "Teacher", "Staff", "Manager"]} data={formData} setter={handleInputChange} required icon={ShieldCheck} />
            <FormInput label="Joining Date" field="joinDate" type="date" data={formData} setter={handleInputChange} required icon={Calendar} />
            <FormSelect label="Designation" field="designation" options={["Select", "Head Teacher", "Accountant", "Clerk"]} data={formData} setter={handleInputChange} required icon={Briefcase} />
            <FormSelect label="Department" field="department" options={["Administrator", "Academic", "Maintenance"]} data={formData} setter={handleInputChange} required icon={Building2} />
            <FormInput label="Qualification" field="qualification" data={formData} setter={handleInputChange} icon={FileText} />
            <FormInput label="Total Experience" field="totalExperience" data={formData} setter={handleInputChange} icon={Briefcase} />
          </div>
        </SectionContainer>

        {/* Employee Details Section */}
        <SectionContainer 
          id="personal" 
          title="Employee Details" 
          icon={User}
        >
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            <FormInput label="Name" field="name" data={formData} setter={handleInputChange} required icon={User} />
            <FormSelect label="Gender" field="gender" options={["Select", "Male", "Female", "Other"]} data={formData} setter={handleInputChange} icon={Users} />
            <FormSelect label="Blood group" field="bloodGroup" options={["Select", "A+", "A-", "B+", "B-", "O+", "O-", "AB+", "AB-"]} data={formData} setter={handleInputChange} icon={Droplets} />
            <FormInput label="Date Of Birth" field="dob" type="date" data={formData} setter={handleInputChange} icon={Calendar} />
            <FormInput label="Mobile No" field="phone" data={formData} setter={handleInputChange} required icon={Phone} />
            <FormInput label="Email" field="email" type="email" data={formData} setter={handleInputChange} required icon={Mail} />
            <FormInput label="Address" field="address" data={formData} setter={handleInputChange} required icon={MapPin} />
            
            {/* Profile Picture Upload - Full Width Span */}
            <div className="md:col-span-2 lg:col-span-3 mt-4">
              <label className="text-slate-500 text-[10px] font-black uppercase tracking-widest mb-4 block">Profile Picture</label>
              <div 
                className="relative group border-2 border-dashed border-slate-200 rounded-[2.5rem] bg-[#e6f4ef] hover:bg-[#d9ede6] hover:border-emerald-300 transition-all p-12 text-center cursor-pointer"
                onClick={() => document.getElementById('photo-upload').click()}
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
                    <img src={formData.photo} alt="Preview" className="w-32 h-32 rounded-3xl object-cover border-4 border-white shadow-2xl" />
                    <p className="text-slate-800 font-black text-sm">Image Captured Successfully</p>
                    <button 
                      onClick={(e) => { e.stopPropagation(); handleInputChange('photo', null); }}
                      className="text-slate-400 hover:text-rose-500 transition-colors text-xs underline"
                    >
                      Remove Photo
                    </button>
                  </div>
                ) : (
                  <div className="flex flex-col items-center gap-4">
                    <div className="w-20 h-20 bg-white rounded-3xl flex items-center justify-center group-hover:scale-110 transition-transform shadow-sm">
                      <Upload className="w-10 h-10 text-[#00bd7f]" />
                    </div>
                    <div>
                      <h4 className="text-xl font-black text-slate-800 mb-1">Drag and drop a file here or click</h4>
                      <p className="text-slate-400 text-[10px] font-black uppercase tracking-widest">Supports JPG, PNG (Max 5MB)</p>
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
        <SectionContainer 
          id="login" 
          title="Login Details" 
          icon={Lock}
        >
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-2 gap-8">
            <FormInput label="Password" field="password" type="password" data={formData} setter={handleInputChange} required icon={Lock} />
            <FormInput label="Retype Password" field="confirmPassword" type="password" data={formData} setter={handleInputChange} required icon={Lock} />
          </div>
        </SectionContainer>

        {/* Social Links Section */}
        <SectionContainer 
          id="social" 
          title="Social Links" 
          icon={Facebook}
        >
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <FormInput label="Facebook" field="facebook" placeholder="eg: https://www.facebook.com/username" data={formData} setter={handleInputChange} icon={Facebook} />
            <FormInput label="Twitter" field="twitter" placeholder="eg: https://www.twitter.com/username" data={formData} setter={handleInputChange} icon={Twitter} />
            <FormInput label="Linkedin" field="linkedin" placeholder="eg: https://www.linkedin.com/username" data={formData} setter={handleInputChange} icon={Linkedin} />
          </div>
        </SectionContainer>

        {/* Bank Details Section */}
        <SectionContainer 
          id="bank" 
          title="Bank Details" 
          icon={CreditCard}
        >
          <div className="mb-8">
            <label className="flex items-center gap-4 cursor-pointer group">
              <div 
                className={`w-6 h-6 rounded-md border-2 transition-all flex items-center justify-center ${formData.skipBank ? 'bg-[#00bd7f] border-[#00bd7f]' : 'border-slate-300 group-hover:border-[#00bd7f]'}`}
                onClick={() => handleInputChange('skipBank', !formData.skipBank)}
              >
                {formData.skipBank && <ShieldCheck className="w-4 h-4 text-white" />}
              </div>
              <span className="text-slate-600 text-sm font-black uppercase tracking-widest opacity-60 group-hover:opacity-100 transition-opacity">Skipped Bank Details</span>
            </label>
          </div>

          {!formData.skipBank && (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 animate-in slide-in-from-top-4 duration-500">
              <FormInput label="Bank Name" field="bankName" data={formData} setter={handleInputChange} required icon={Building2} />
              <FormInput label="Holder Name" field="holderName" data={formData} setter={handleInputChange} required icon={User} />
              <FormInput label="Bank Branch" field="bankBranch" data={formData} setter={handleInputChange} required icon={MapPin} />
              <FormInput label="Bank Address" field="bankAddress" data={formData} setter={handleInputChange} icon={Map} />
              <FormInput label="IFSC Code" field="ifscCode" data={formData} setter={handleInputChange} icon={ShieldCheck} />
              <FormInput label="Account No" field="accountNo" data={formData} setter={handleInputChange} required icon={CreditCard} />
            </div>
          )}
        </SectionContainer>

        {/* Floating Action Bar */}
        <div className="sticky bottom-10 left-0 right-0 z-50 px-4">
           <div className="max-w-7xl mx-auto rounded-[3rem] bg-white/80 backdrop-blur-3xl border border-slate-200 p-4 shadow-[0_25px_80px_rgba(0,0,0,0.1)] flex items-center justify-between">
              <div className="px-8 hidden md:block">
                 <p className="text-slate-400 text-[9px] font-black uppercase tracking-widest">Entry Status</p>
                 <p className="text-slate-800 font-black text-xs flex items-center gap-2">
                    <span className="w-2 h-2 bg-emerald-500 rounded-full animate-pulse" />
                    Profile Assembly in Progress
                 </p>
              </div>
              <div className="flex gap-4 w-full md:w-auto">
                 <button 
                  type="button"
                  onClick={() => navigate("/admin/employee/list")}
                  className="flex-1 md:flex-none px-10 py-5 bg-slate-100 text-slate-600 font-black rounded-full hover:bg-slate-200 transition-all uppercase text-[10px] tracking-widest active:scale-95"
                 >
                    Discard Changes
                 </button>
                 <button 
                  type="submit"
                  className="flex-1 md:flex-none px-14 py-5 bg-[#00bd7f] text-white font-black rounded-full shadow-2xl shadow-emerald-500/30 hover:scale-[1.02] transition-all uppercase text-[10px] tracking-widest flex items-center justify-center gap-3 active:scale-95"
                 >
                    <Save className="w-5 h-5" /> Commit Staff Registry
                 </button>
              </div>
           </div>
        </div>

      </form>
    </div>
  );
};

/**
 * Reusable Section Container
 */
const SectionContainer = ({ title, icon: Icon, children }) => (
  <div className="bg-white rounded-[1.5rem] border-2 border-slate-200 p-8 sm:p-10 shadow-sm hover:shadow-md transition-shadow space-y-8 animate-in slide-in-from-bottom-5 duration-700">
    <div className="flex items-center gap-4 py-2 border-b-2 border-slate-50">
      <div className="w-10 h-10 bg-[#e6f4ef] rounded-xl flex items-center justify-center">
        <Icon className="w-5 h-5 text-[#00bd7f]" />
      </div>
      <div className="flex-1 flex items-center gap-6">
        <h2 className="text-xl font-black text-rose-500 tracking-tight whitespace-nowrap">{title}</h2>
        <div className="h-[2px] w-full bg-slate-50" />
      </div>
    </div>
    {children}
  </div>
);

/**
 * Reusable Control Elements
 */
const FormInput = ({ label, field, type = "text", data, setter, required, icon: Icon, placeholder }) => (
  <div className="space-y-4 group">
    <label className="text-slate-500 text-[10px] font-black uppercase tracking-widest flex items-center gap-3 transition-colors group-focus-within:text-emerald-600">
      {label} {required && <span className="text-rose-500 text-lg">*</span>}
    </label>
    <div className="relative">
      <input 
        type={type}
        value={data[field]}
        onChange={e => setter(field, e.target.value)}
        placeholder={placeholder}
        required={required}
        className="w-full bg-[#e6f4ef] text-slate-800 px-6 py-4 rounded-xl border-2 border-transparent focus:border-[#00bd7f] focus:bg-white outline-none font-bold text-sm transition-all focus:shadow-[0_10px_30px_rgba(0,189,127,0.1)]"
      />
      {Icon && <Icon className="absolute right-6 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400 group-focus-within:text-[#00bd7f] transition-colors" />}
    </div>
  </div>
);

const FormSelect = ({ label, field, options, data, setter, required, icon: Icon }) => (
  <div className="space-y-4 group">
    <label className="text-slate-500 text-[10px] font-black uppercase tracking-widest flex items-center gap-3 transition-colors group-focus-within:text-emerald-600">
      {label} {required && <span className="text-rose-500 text-lg">*</span>}
    </label>
    <div className="relative">
      <select 
        value={data[field]}
        onChange={e => setter(field, e.target.value)}
        required={required}
        className="w-full bg-[#e6f4ef] text-slate-800 px-6 py-4 rounded-xl border-2 border-transparent focus:border-[#00bd7f] focus:bg-white outline-none font-bold text-sm transition-all appearance-none cursor-pointer"
      >
        {options.map(opt => <option key={opt} value={opt}>{opt}</option>)}
      </select>
      <div className="absolute right-6 top-1/2 -translate-y-1/2 flex items-center gap-2 pointer-events-none">
        {Icon && <Icon className="w-4 h-4 text-slate-400 group-focus-within:text-[#00bd7f] transition-colors" />}
        <ChevronDown className="w-4 h-4 text-slate-400 group-focus-within:text-[#00bd7f] transition-colors" />
      </div>
    </div>
  </div>
);

const FormTextarea = ({ label, field, data, setter, required, icon: Icon, placeholder }) => (
  <div className="space-y-4 group">
    <label className="text-slate-500 text-[10px] font-black uppercase tracking-widest flex items-center gap-3 transition-colors group-focus-within:text-emerald-600">
      {label} {required && <span className="text-rose-500 text-lg">*</span>}
    </label>
    <div className="relative">
      <textarea 
        value={data[field]}
        onChange={e => setter(field, e.target.value)}
        placeholder={placeholder}
        required={required}
        rows={2}
        className="w-full bg-[#e6f4ef] text-slate-800 px-6 py-4 rounded-xl border-2 border-transparent focus:border-[#00bd7f] focus:bg-white outline-none font-bold text-sm transition-all resize-none shadow-inner"
      />
      {Icon && <Icon className="absolute right-6 bottom-6 w-4 h-4 text-slate-400 group-focus-within:text-[#00bd7f] transition-colors" />}
    </div>
  </div>
);

export default CreateEmployee;
