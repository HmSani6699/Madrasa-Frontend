import { useState } from "react";
import { 
  User, 
  Users, 
  MapPin, 
  CheckCircle2, 
  ArrowRight, 
  ArrowLeft, 
  Upload, 
  Phone,
  Mail,
  GraduationCap,
  Calendar,
  ShieldCheck,
  Send
} from "lucide-react";
import { Link } from "react-router-dom";

const OnlineAdmissionForm = () => {
  const [step, setStep] = useState(1);
  const [formData, setFormData] = useState({
    // Student Info
    studentName: "",
    dob: "",
    gender: "",
    bloodGroup: "",
    appliedClass: "",
    
    // Guardian Info
    fatherName: "",
    motherName: "",
    guardianPhone: "",
    guardianEmail: "",
    
    // Address Info
    presentAddress: "",
    permanentAddress: "",
    lastSchool: "",
  });

  const [submitted, setSubmitted] = useState(false);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const nextStep = () => setStep((prev) => prev + 1);
  const prevStep = () => setStep((prev) => prev - 1);

  const handleSubmit = (e) => {
    e.preventDefault();
    // Simulate API call
    setTimeout(() => {
      setSubmitted(true);
    }, 1500);
  };

  if (submitted) {
    return (
      <div className="min-h-[80vh] flex items-center justify-center px-6">
        <div className="max-w-md w-full text-center space-y-8 animate-in zoom-in duration-500">
          <div className="w-24 h-24 bg-emerald-100 text-[#059669] rounded-full flex items-center justify-center mx-auto shadow-xl shadow-emerald-900/10">
            <CheckCircle2 className="w-12 h-12" />
          </div>
          <div>
            <h2 className="text-3xl font-black text-[#042f2c] italic mb-4">আবেদন সফল হয়েছে!</h2>
            <p className="text-slate-600 font-medium italic">আপনার আবেদনটি আমরা পেয়েছি। খুব শীঘ্রই আমাদের প্রতিনিধি আপনার সাথে যোগাযোগ করবেন।</p>
          </div>
          <Link 
            to="/portal/global-international" 
            className="inline-block px-10 py-4 bg-[#059669] text-white font-black rounded-full shadow-lg hover:scale-105 transition-all text-sm"
          >
            হোম পেজে ফিরে যান
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-white min-h-screen font-sans">
      {/* 1. Simple Header */}
      <section className="bg-[#042f2c] pt-20 pb-12 px-6">
        <div className="max-w-[1240px] mx-auto text-center">
            <h1 className="text-3xl md:text-5xl font-black text-white italic mb-4">অনলাইন ভর্তি ফরম</h1>
            <p className="text-emerald-50/60 max-w-md mx-auto italic font-medium">নিচের ধাপগুলো অনুসরণ করে নির্ভুলভাবে তথ্য পূরণ করুন।</p>
        </div>
      </section>

      {/* 2. Progress Indicator */}
      <div className="max-w-[800px] mx-auto px-6 -mt-8 relative z-10 font-sans">
        <div className="bg-white p-4 rounded-3xl shadow-xl border border-slate-100 flex justify-between items-center">
          {[1, 2, 3].map((s) => (
            <div key={s} className="flex items-center gap-3">
              <div className={`w-10 h-10 rounded-full flex items-center justify-center font-black transition-all ${
                step >= s ? "bg-[#059669] text-white shadow-lg" : "bg-slate-100 text-slate-400"
              }`}>
                {s}
              </div>
              <span className={`hidden sm:block text-xs font-black uppercase tracking-widest ${
                step >= s ? "text-[#059669]" : "text-slate-400"
              }`}>
                {s === 1 ? "শিক্ষার্থী" : s === 2 ? "অভিভাবক" : "ঠিকানা"}
              </span>
              {s < 3 && <div className={`w-8 h-[2px] hidden md:block ${step > s ? "bg-[#059669]" : "bg-slate-100"}`} />}
            </div>
          ))}
        </div>
      </div>

      {/* 3. Form Content */}
      <section className="py-20 px-6">
        <div className="max-w-[900px] mx-auto">
          <form onSubmit={handleSubmit} className="space-y-12">
            
            {/* Step 1: Student Information */}
            {step === 1 && (
              <div className="space-y-8 animate-in slide-in-from-right duration-500">
                <div className="flex items-center gap-4 mb-8">
                    <div className="w-12 h-12 bg-emerald-50 text-[#059669] rounded-2xl flex items-center justify-center">
                        <User className="w-6 h-6" />
                    </div>
                    <h2 className="text-2xl font-black text-[#042f2c] italic">শিক্ষার্থীর তথ্য</h2>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                  <div className="space-y-2">
                    <label className="text-sm font-black text-slate-700 italic uppercase">শিক্ষার্থীর পূর্ণ নাম (বাংলায়)</label>
                    <input 
                      required
                      type="text" 
                      name="studentName" 
                      value={formData.studentName} 
                      onChange={handleChange}
                      placeholder="যেমন: মুহাম্মদ আলী"
                      className="w-full px-6 py-4 bg-slate-50 border border-slate-100 rounded-2xl focus:ring-2 focus:ring-[#059669]/20 focus:border-[#059669] outline-none transition-all italic font-medium"
                    />
                  </div>
                  <div className="space-y-2">
                    <label className="text-sm font-black text-slate-700 italic uppercase">জন্ম তারিখ</label>
                    <input 
                      required
                      type="date" 
                      name="dob" 
                      value={formData.dob} 
                      onChange={handleChange}
                      className="w-full px-6 py-4 bg-slate-50 border border-slate-100 rounded-2xl focus:ring-2 focus:ring-[#059669]/20 focus:border-[#059669] outline-none transition-all italic font-medium"
                    />
                  </div>
                  <div className="space-y-2">
                    <label className="text-sm font-black text-slate-700 italic uppercase">লিঙ্গ</label>
                    <select 
                      name="gender" 
                      value={formData.gender} 
                      onChange={handleChange}
                      className="w-full px-6 py-4 bg-slate-50 border border-slate-100 rounded-2xl focus:ring-2 focus:ring-[#059669]/20 focus:border-[#059669] outline-none transition-all italic font-medium"
                    >
                      <option value="">নির্বাচন করুন</option>
                      <option value="male">ছাত্র</option>
                      <option value="female">ছাত্রী</option>
                    </select>
                  </div>
                  <div className="space-y-2">
                    <label className="text-sm font-black text-slate-700 italic uppercase">পছন্দকৃত শ্রেণী</label>
                    <select 
                      required
                      name="appliedClass" 
                      value={formData.appliedClass} 
                      onChange={handleChange}
                      className="w-full px-6 py-4 bg-slate-50 border border-slate-100 rounded-2xl focus:ring-2 focus:ring-[#059669]/20 focus:border-[#059669] outline-none transition-all italic font-medium"
                    >
                      <option value="">নির্বাচন করুন</option>
                      <option value="nursery">নার্সারি</option>
                      <option value="one">প্রথম শ্রেণী</option>
                      <option value="hifz">হিফজ বিভাগ</option>
                    </select>
                  </div>
                </div>
              </div>
            )}

            {/* Step 2: Guardian Information */}
            {step === 2 && (
              <div className="space-y-8 animate-in slide-in-from-right duration-500">
                <div className="flex items-center gap-4 mb-8">
                    <div className="w-12 h-12 bg-emerald-50 text-[#059669] rounded-2xl flex items-center justify-center">
                        <Users className="w-6 h-6" />
                    </div>
                    <h2 className="text-2xl font-black text-[#042f2c] italic">অভিভাবকের তথ্য</h2>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                  <div className="space-y-2">
                    <label className="text-sm font-black text-slate-700 italic uppercase">পিতার নাম</label>
                    <input 
                      required
                      type="text" 
                      name="fatherName" 
                      value={formData.fatherName} 
                      onChange={handleChange}
                      className="w-full px-6 py-4 bg-slate-50 border border-slate-100 rounded-2xl focus:ring-2 focus:ring-[#059669]/20 focus:border-[#059669] outline-none transition-all italic font-medium"
                    />
                  </div>
                  <div className="space-y-2">
                    <label className="text-sm font-black text-slate-700 italic uppercase">মাতার নাম</label>
                    <input 
                      required
                      type="text" 
                      name="motherName" 
                      value={formData.motherName} 
                      onChange={handleChange}
                      className="w-full px-6 py-4 bg-slate-50 border border-slate-100 rounded-2xl focus:ring-2 focus:ring-[#059669]/20 focus:border-[#059669] outline-none transition-all italic font-medium"
                    />
                  </div>
                  <div className="space-y-2">
                    <label className="text-sm font-black text-slate-700 italic uppercase">মোবাইল নম্বর</label>
                    <input 
                      required
                      type="tel" 
                      name="guardianPhone" 
                      value={formData.guardianPhone} 
                      onChange={handleChange}
                      placeholder="০১XXXX-XXXXXX"
                      className="w-full px-6 py-4 bg-slate-50 border border-slate-100 rounded-2xl focus:ring-2 focus:ring-[#059669]/20 focus:border-[#059669] outline-none transition-all italic font-medium"
                    />
                  </div>
                  <div className="space-y-2">
                    <label className="text-sm font-black text-slate-700 italic uppercase">ইমেইল (যদি থাকে)</label>
                    <input 
                      type="email" 
                      name="guardianEmail" 
                      value={formData.guardianEmail} 
                      onChange={handleChange}
                      className="w-full px-6 py-4 bg-slate-50 border border-slate-100 rounded-2xl focus:ring-2 focus:ring-[#059669]/20 focus:border-[#059669] outline-none transition-all italic font-medium"
                    />
                  </div>
                </div>
              </div>
            )}

            {/* Step 3: Address Information */}
            {step === 3 && (
              <div className="space-y-8 animate-in slide-in-from-right duration-500">
                <div className="flex items-center gap-4 mb-8">
                    <div className="w-12 h-12 bg-emerald-50 text-[#059669] rounded-2xl flex items-center justify-center">
                        <MapPin className="w-6 h-6" />
                    </div>
                    <h2 className="text-2xl font-black text-[#042f2c] italic">ঠিকানা ও অন্যান্য</h2>
                </div>

                <div className="space-y-8">
                  <div className="space-y-2">
                    <label className="text-sm font-black text-slate-700 italic uppercase">বর্তমান ঠিকানা</label>
                    <textarea 
                      required
                      name="presentAddress" 
                      value={formData.presentAddress} 
                      onChange={handleChange}
                      rows="3"
                      className="w-full px-6 py-4 bg-slate-50 border border-slate-100 rounded-2xl focus:ring-2 focus:ring-[#059669]/20 focus:border-[#059669] outline-none transition-all italic font-medium resize-none"
                    />
                  </div>
                  <div className="space-y-2">
                    <label className="text-sm font-black text-slate-700 italic uppercase">স্থায়ী ঠিকানা</label>
                    <textarea 
                      name="permanentAddress" 
                      value={formData.permanentAddress} 
                      onChange={handleChange}
                      rows="3"
                      className="w-full px-6 py-4 bg-slate-50 border border-slate-100 rounded-2xl focus:ring-2 focus:ring-[#059669]/20 focus:border-[#059669] outline-none transition-all italic font-medium resize-none"
                    />
                  </div>
                  <div className="space-y-2">
                    <label className="text-sm font-black text-slate-700 italic uppercase">পূর্ববর্তী শিক্ষা প্রতিষ্ঠানের নাম (যদি থাকে)</label>
                    <input 
                      type="text" 
                      name="lastSchool" 
                      value={formData.lastSchool} 
                      onChange={handleChange}
                      className="w-full px-6 py-4 bg-slate-50 border border-slate-100 rounded-2xl focus:ring-2 focus:ring-[#059669]/20 focus:border-[#059669] outline-none transition-all italic font-medium"
                    />
                  </div>
                </div>
              </div>
            )}

            {/* Navigation Buttons */}
            <div className="pt-10 flex border-t border-slate-100 justify-between items-center">
              {step > 1 ? (
                <button 
                  type="button" 
                  onClick={prevStep}
                  className="flex items-center gap-2 px-8 py-4 text-[#059669] font-black italic hover:bg-emerald-50 rounded-2xl transition-all"
                >
                  <ArrowLeft className="w-4 h-4" /> পূর্ববর্তী
                </button>
              ) : <div />}

              {step < 3 ? (
                <button 
                  type="button" 
                  onClick={nextStep}
                  className="flex items-center gap-2 px-10 py-4 bg-[#059669] text-white font-black italic rounded-2xl shadow-lg shadow-emerald-900/10 hover:scale-105 transition-all"
                >
                  পরবর্তী ধাপ <ArrowRight className="w-4 h-4" />
                </button>
              ) : (
                <button 
                  type="submit"
                  className="flex items-center gap-3 px-12 py-5 bg-[#042f2c] text-white font-black italic rounded-2xl shadow-2xl hover:bg-[#059669] transition-all"
                >
                  আবেদন করুন <Send className="w-5 h-5" />
                </button>
              )}
            </div>
          </form>
        </div>
      </section>

      {/* Safety Notice */}
      <section className="bg-slate-50 py-12 px-6">
        <div className="max-w-[400px] mx-auto text-center flex flex-col items-center gap-4">
             <div className="w-10 h-10 bg-white rounded-full flex items-center justify-center border border-slate-200 shadow-sm text-slate-400">
               <ShieldCheck className="w-5 h-5" />
             </div>
             <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest leading-loose">আপনার সকল তথ্য সম্পূর্ণ নিরাপদ এবং শুধুমাত্র ভর্তির কাজে ব্যবহৃত হবে।</p>
        </div>
      </section>
    </div>
  );
};

export default OnlineAdmissionForm;
