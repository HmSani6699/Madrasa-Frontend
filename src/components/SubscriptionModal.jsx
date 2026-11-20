import React, { useState } from "react";
import {
  X,
  CheckCircle2,
  Phone,
  MessageCircle,
  Building2,
  User,
  MapPin,
  Sparkles,
  ArrowRight,
} from "lucide-react";
import demoService from "../services/demoService";
import { toast } from "react-hot-toast";

// Official Support WhatsApp Number
const OFFICIAL_WHATSAPP_NUMBER = "8801986544021";

const BANGLADESH_DISTRICTS = [
  "ঢাকা", "চট্টগ্রাম", "সিলেট", "রাজশাহী", "খুলনা", "বরিশাল", "রংপুর", "ময়মনসিংহ",
  "কুমিল্লা", "বগুড়া", "ব্রাহ্মণবাড়িয়া", "চাঁদপুর", "ফেনী", "নোয়াখালী", "লক্ষ্মীপুর",
  "কক্সবাজার", "গাজীপুর", "নারায়ণগঞ্জ", "নরসিংদী", "টাঙ্গাইল", "কিশোরগঞ্জ", "মানিকগঞ্জ",
  "মুন্সীগঞ্জ", "ফরিদপুর", "মাদারীপুর", "শরীয়তপুর", "রাজবাড়ী", "গোপালগঞ্জ", "নেত্রকোণা",
  "জামালপুর", "শেরপুর", "পাবনা", "সিরাজগঞ্জ", "নাটোর", "নওগাঁ", "চাঁপাইনবাবগঞ্জ",
  "জয়পুরহাট", "যশোর", "ঝিনাইদহ", "কুষ্টিয়া", "মাগুরা", "মেহেরপুর", "চুয়াডাঙ্গা",
  "নড়াইল", "সাতক্ষীরা", "বাগেরহাট", "পটুয়াখালী", "পিরোজপুর", "ভোলা", "ঝালকাঠি",
  "বরগুনা", "হবিগঞ্জ", "মৌলভীবাজার", "সুনামগঞ্জ", "দিনাজপুর", "কুড়িগ্রাম", "গাইবান্ধা",
  "নীলফামারী", "পঞ্চগড়", "ঠাকুরগাঁও", "লালমনিরহাট"
];

const MADRASA_TYPES = [
  "কওমী মাদ্রাসা",
  "আলিয়া মাদ্রাসা",
  "নূরানী ও হিফজ মাদ্রাসা",
  "ক্যাডেট / কিন্ডারগার্টেন মাদ্রাসা",
  "মহিলা / বালিকা মাদ্রাসা",
  "অন্যান্য"
];

const STUDENT_RANGES = [
  "৫০ জনের নিচে",
  "৫০ - ১০০ জন",
  "১০০ - ২৫০ জন",
  "২৫০ - ৫০০ জন",
  "৫০০+ জন"
];

const SubscriptionModal = ({ isOpen, onClose, selectedPlan, billingCycle = "monthly" }) => {
  const [formData, setFormData] = useState({
    applicantName: "",
    whatsapp: "",
    madrasaName: "",
    madrasaType: "কওমী মাদ্রাসা",
    studentCount: "১০০ - ২৫০ জন",
    district: "ঢাকা",
    address: "",
    notes: "",
  });

  const [loading, setLoading] = useState(false);
  const [submitted, setSubmitted] = useState(false);

  if (!isOpen) return null;

  const planName = selectedPlan?.name || "স্ট্যান্ডার্ড";
  const planPrice =
    billingCycle === "yearly"
      ? selectedPlan?.priceYearly || "৳৫৮০ /মাস"
      : selectedPlan?.priceMonthly || "৳৭০০ /মাস";

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!formData.applicantName.trim()) {
      toast.error("অনুগ্রহ করে আপনার নাম লিখুন");
      return;
    }
    if (!formData.whatsapp.trim()) {
      toast.error("অনুগ্রহ করে সক্রিয় হোয়াটসঅ্যাপ নম্বর লিখুন");
      return;
    }
    if (!formData.madrasaName.trim()) {
      toast.error("অনুগ্রহ করে মাদ্রাসার নাম লিখুন");
      return;
    }

    try {
      setLoading(true);
      const payload = {
        applicantName: formData.applicantName.trim(),
        whatsapp: formData.whatsapp.trim(),
        phone: formData.whatsapp.trim(),
        madrasaName: formData.madrasaName.trim(),
        madrasaType: formData.madrasaType,
        studentCount: formData.studentCount,
        district: formData.district,
        address: formData.address.trim(),
        interestedFeatures: selectedPlan
          ? [
            `প্যাকেজ: ${planName}`,
            `বিলিং: ${billingCycle === "yearly" ? "বার্ষিক" : "মাসিক"}`,
            `মূল্য: ${planPrice}`,
          ]
          : ["ফ্রি ডেমো"],
        notes: formData.notes?.trim()
          ? `${selectedPlan ? `প্যাকেজ: ${planName} (${billingCycle === "yearly" ? "বার্ষিক" : "মাসিক"}), ` : ""}${formData.notes.trim()}`
          : (selectedPlan ? `প্যাকেজ সাবস্ক্রিপশন আবেদন - প্যাকেজ: ${planName} (${billingCycle === "yearly" ? "বার্ষিক বিলিং" : "মাসিক বিলিং"})` : "ফ্রি ডেমো আবেদন"),
      };

      await demoService.submitDemoRequest(payload);
      toast.success("আপনার ফ্রি ডেমোর আবেদনটি সফলভাবে গ্রহণ করা হয়েছে!");
      setSubmitted(true);
    } catch (error) {
      console.error("Submission failed:", error);
      toast.error(error.response?.data?.message || "আবেদন পাঠাতে ব্যর্থ হয়েছে। আবার চেষ্টা করুন।");
    } finally {
      setLoading(false);
    }
  };

  const handleWhatsAppDirect = () => {
    const text = encodeURIComponent(
      `আসসালামু আলাইকুম। আমি "${planName}" প্যাকেজ (${billingCycle === "yearly" ? "বার্ষিক" : "মাসিক"}) সাবস্ক্রাইব করতে আগ্রহী।\nমাদ্রাসার নাম: ${formData.madrasaName || "মাদ্রাসার নাম"}\nনাম: ${formData.applicantName || "নাম"}\nমোবাইল: ${formData.whatsapp || ""}`
    );
    window.open(`https://wa.me/${OFFICIAL_WHATSAPP_NUMBER}?text=${text}`, "_blank");
  };

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-black/60 backdrop-blur-xs flex items-center justify-center p-3 sm:p-4 font-bangla animate-fade-in">
      <div className="fixed inset-0" onClick={onClose} />

      <div className="relative bg-white rounded-[10px] shadow-2xl max-w-lg sm:max-w-2xl w-full overflow-hidden  z-10 transition-all">
        {/* Header Ribbon */}
        <div className="bg-linear-to-r from-[#1C7D5A] to-[#0e7c55] px-6 py-5 text-white relative">
          <button
            onClick={onClose}
            className="absolute top-4 right-4 w-8 h-8 rounded-full bg-white/10 hover:bg-white/20 flex items-center justify-center text-white transition-colors cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
          <div className="flex items-center gap-2 text-xs font-semibold uppercase tracking-wider text-emerald-200 mb-1">
            <Sparkles className="w-4 h-4 text-amber-300" />
            <span>প্যাকেজ সাবস্ক্রিপশন ও ডেমো</span>
          </div>
          <h3 className="text-xl sm:text-2xl font-black">
            {planName} প্যাকেজ নির্বাচন করেছেন
          </h3>
          <p className="text-emerald-100 text-xs sm:text-sm mt-1">
            {billingCycle === "yearly" ? "বার্ষিক বিলিং (১৭% সাশ্রয়ী)" : "মাসিক বিলিং"} • {planPrice}
          </p>
        </div>

        {submitted ? (
          <div className="p-8 text-center space-y-4">
            <div className="w-16 h-16 rounded-full bg-emerald-100 text-[#1C7D5A] flex items-center justify-center mx-auto">
              <CheckCircle2 className="w-10 h-10" />
            </div>
            <h4 className="text-2xl font-bold text-slate-900">
              ধন্যবাদ! আপনার আবেদন গৃহীত হয়েছে
            </h4>
            <p className="text-slate-600 text-sm leading-relaxed max-w-sm mx-auto">
              আমাদের টিম খুব শীঘ্রই আপনার হোয়াটসঅ্যাপ বা মোবাইলে যোগাযোগ করে প্যানেল সেটআপ ও অ্যাক্টিভেশন সম্পন্ন করে দেবে।
            </p>
            <div className="pt-4 flex flex-col sm:flex-row gap-3 justify-center">
              <button
                onClick={handleWhatsAppDirect}
                className="bg-emerald-600 hover:bg-emerald-700 text-white font-semibold px-5 py-2.5 rounded-xl text-sm flex items-center justify-center gap-2 shadow-md transition-all cursor-pointer"
              >
                <MessageCircle className="w-4 h-4" />
                <span>সরাসরি হোয়াটসঅ্যাপে কথা বলুন</span>
              </button>
              <button
                onClick={onClose}
                className="border border-slate-200 text-slate-700 hover:bg-slate-50 font-semibold px-5 py-2.5 rounded-xl text-sm transition-all cursor-pointer"
              >
                বন্ধ করুন
              </button>
            </div>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="p-6 sm:p-7 space-y-4 sm:space-y-5 max-h-[80vh] overflow-y-auto">
            {/* Row 1: Name & Phone */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-semibold text-slate-700 mb-1.5">
                  আপনার নাম <span className="text-red-500">*</span>
                </label>
                <div className="relative">
                  <User className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                  <input
                    type="text"
                    name="applicantName"
                    required
                    placeholder="উদাঃ মাওলানা আব্দুল্লাহ"
                    value={formData.applicantName}
                    onChange={handleChange}
                    className="w-full pl-10 pr-4 py-2.5 rounded-lg border border-slate-200 focus:border-emerald-500 focus:ring-2 focus:ring-emerald-500/20 outline-none text-sm transition-all bg-slate-50/50 hover:bg-white"
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-semibold text-slate-700 mb-1.5">
                  আপনার ফোন নাম্বার <span className="text-red-500">*</span> ( Whatsapp )
                </label>
                <div className="relative">
                  <Phone className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                  <input
                    type="tel"
                    name="whatsapp"
                    required
                    placeholder="০১৭XX-XXXXXX"
                    value={formData.whatsapp}
                    onChange={handleChange}
                    className="w-full pl-10 pr-4 py-2.5 rounded-lg border border-slate-200 focus:border-emerald-500 focus:ring-2 focus:ring-emerald-500/20 outline-none text-sm transition-all bg-slate-50/50 hover:bg-white"
                  />
                </div>
              </div>
            </div>

            {/* Row 2: Madrasa Name */}
            <div>
              <label className="block text-sm font-semibold text-slate-700 mb-1.5">
                মাদ্রাসার নাম <span className="text-red-500">*</span>
              </label>
              <div className="relative">
                <Building2 className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                <input
                  type="text"
                  name="madrasaName"
                  required
                  placeholder="উদাঃ জামিয়া ইসলামিয়া দারুল উলুম"
                  value={formData.madrasaName}
                  onChange={handleChange}
                  className="w-full pl-10 pr-4 py-2.5 rounded-lg border border-slate-200 focus:border-emerald-500 focus:ring-2 focus:ring-emerald-500/20 outline-none text-sm transition-all bg-slate-50/50 hover:bg-white"
                />
              </div>
            </div>

            {/* Row 3: Madrasa Type & Student Count */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-semibold text-slate-700 mb-1.5">
                  মাদ্রাসার ধরন <span className="text-red-500">*</span>
                </label>
                <select
                  name="madrasaType"
                  value={formData.madrasaType}
                  onChange={handleChange}
                  className="w-full px-3.5 py-2.5 rounded-lg border border-slate-200 focus:border-emerald-500 focus:ring-2 focus:ring-emerald-500/20 outline-none text-sm transition-all bg-slate-50/50 hover:bg-white cursor-pointer"
                >
                  {MADRASA_TYPES.map((type) => (
                    <option key={type} value={type}>
                      {type}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-sm font-semibold text-slate-700 mb-1.5">
                  আনুমানিক ছাত্র-ছাত্রী সংখ্যা
                </label>
                <select
                  name="studentCount"
                  value={formData.studentCount}
                  onChange={handleChange}
                  className="w-full px-3.5 py-2.5 rounded-lg border border-slate-200 focus:border-emerald-500 focus:ring-2 focus:ring-emerald-500/20 outline-none text-sm transition-all bg-slate-50/50 hover:bg-white cursor-pointer"
                >
                  {STUDENT_RANGES.map((range) => (
                    <option key={range} value={range}>
                      {range}
                    </option>
                  ))}
                </select>
              </div>
            </div>

            {/* Row 4: District & Address */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-semibold text-slate-700 mb-1.5">
                  জেলা <span className="text-red-500">*</span>
                </label>
                <div className="relative">
                  <MapPin className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400 pointer-events-none" />
                  <select
                    name="district"
                    value={formData.district}
                    onChange={handleChange}
                    className="w-full pl-10 pr-3.5 py-2.5 rounded-lg border border-slate-200 focus:border-emerald-500 focus:ring-2 focus:ring-emerald-500/20 outline-none text-sm transition-all bg-slate-50/50 hover:bg-white cursor-pointer"
                  >
                    {BANGLADESH_DISTRICTS.map((dist) => (
                      <option key={dist} value={dist}>
                        {dist}
                      </option>
                    ))}
                  </select>
                </div>
              </div>

              <div>
                <label className="block text-sm font-semibold text-slate-700 mb-1.5">
                  থানা / বিস্তারিত ঠিকানা
                </label>
                <input
                  type="text"
                  name="address"
                  placeholder="উদাঃ চকবাজার, কোতোয়ালী"
                  value={formData.address}
                  onChange={handleChange}
                  className="w-full px-4 py-2.5 rounded-lg border border-slate-200 focus:border-emerald-500 focus:ring-2 focus:ring-emerald-500/20 outline-none text-sm transition-all bg-slate-50/50 hover:bg-white"
                />
              </div>
            </div>

            {/* Row 5: Extra Note */}
            <div className="pt-2 border-t border-slate-100">
              <label className="block text-sm font-semibold text-slate-700 mb-1.5">
                অতিরিক্ত কোনো জিজ্ঞাসা বা বিশেষ বার্তা (ঐচ্ছিক)
              </label>
              <textarea
                name="notes"
                rows="3"
                placeholder="আপনার মাদ্রাসার কোনো নির্দিষ্ট চাহিদা বা প্রশ্ন থাকলে এখানে লিখতে পারেন..."
                value={formData.notes}
                onChange={handleChange}
                className="w-full px-4 py-2.5 rounded-lg border border-slate-200 focus:border-emerald-500 focus:ring-2 focus:ring-emerald-500/20 outline-none text-sm transition-all bg-slate-50/50 hover:bg-white resize-none"
              />
            </div>

            {/* Submit Button */}
            <button
              type="submit"
              disabled={loading}
              className="w-full bg-[#0e7c55] hover:bg-[#0a6646] active:scale-98 text-white font-bold text-base sm:text-lg py-3 px-6 rounded-full shadow-lg shadow-emerald-800/20 hover:shadow-xl hover:shadow-emerald-800/30 transition-all duration-200 flex items-center justify-center gap-2.5 disabled:opacity-60 cursor-pointer"
            >
              {loading ? (
                <>
                  <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
                  <span>আবেদন জমা হচ্ছে...</span>
                </>
              ) : (
                <>
                  <span>ফ্রি ডেমোর আবেদন সাবমিট করুন</span>
                  <ArrowRight className="w-5 h-5" />
                </>
              )}
            </button>
          </form>
        )}
      </div>
    </div>
  );
};

export default SubscriptionModal;
