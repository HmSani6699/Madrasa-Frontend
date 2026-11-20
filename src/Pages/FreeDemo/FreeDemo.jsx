import React, { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import {
  Building2,
  User,
  Phone,
  MessageCircle,
  MapPin,
  Users,
  CheckCircle2,
  Sparkles,
  ArrowRight,
  ShieldCheck,
  Clock,
  Send,
  HelpCircle,
  ChevronRight,
  School,
  Check,
  Layers,
  ArrowLeft,
  Home,
  Play,
  FileText,
  Video,
  MonitorPlay,
  ExternalLink
} from "lucide-react";
import Nabver from "../Home/Nabver/Nabver";
import demoService from "../../services/demoService";
import { toast } from "react-hot-toast";

// Official Support WhatsApp Number (Bangladesh)
const OFFICIAL_WHATSAPP_NUMBER = "8801986544021";

// অফিসিয়াল ডেমো ভিডিও লিঙ্ক (প্রয়োজনে আপনার ইউটিউব এমবেড লিঙ্ক এখানে বসাতে পারেন)
const DEFAULT_DEMO_VIDEO = {
  videoUrl: "https://www.youtube.com/watch?v=ScMzIvxBSi4",
  embedUrl: "https://www.youtube-nocookie.com/embed/ScMzIvxBSi4",
  title: "মাদ্রাসা ম্যানেজমেন্ট সফটওয়্যার পরিচিতি ও ডেমো ভিডিও",
  description: "ভিডিওর মাধ্যমে সফটওয়্যারটির সকল আধুনিক ফিচার ও ব্যবহারবিধি বিস্তারিত দেখে নিন",
  isActive: true
};
const DEFAULT_DEMO_VIDEO_URL = DEFAULT_DEMO_VIDEO.embedUrl;

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

const FEATURE_OPTIONS = [
  { id: "admission", label: "ভর্তি ও ছাত্র তথ্য" },
  { id: "accounting", label: "মাসিক ফী ও একাউন্টিং" },
  { id: "attendance", label: "হাজিরা ও এসএমএস" },
  { id: "exam", label: "পরীক্ষা ও রেজাল্ট শিট" },
  { id: "id_card", label: "আইডি ও এডমিট কার্ড" },
  { id: "portal", label: "মাদ্রাসার নিজস্ব ওয়েবসাইট" },
  { id: "library", label: "লাইব্রেরি ও কিতাব স্টক" },
  { id: "payroll", label: "শিক্ষকদের বেতন-ভাতা" }
];

const FreeDemo = () => {
  const navigate = useNavigate();

  // Active Tab: "video" (ভিডিও দেখুন) first, then "apply" (আবেদন করুন)
  const [activeTab, setActiveTab] = useState("video");
  const [videoConfig, setVideoConfig] = useState(DEFAULT_DEMO_VIDEO);

  // Fetch dynamic demo video settings from backend
  useEffect(() => {
    let isMounted = true;
    const fetchVideoSettings = async () => {
      try {
        const res = await demoService.getDemoVideo();
        if (isMounted && res?.success && res?.data) {
          const config = {
            videoUrl: res.data.videoUrl || DEFAULT_DEMO_VIDEO.videoUrl,
            embedUrl: res.data.embedUrl || DEFAULT_DEMO_VIDEO.embedUrl,
            title: res.data.title || DEFAULT_DEMO_VIDEO.title,
            description: res.data.description || DEFAULT_DEMO_VIDEO.description,
            isActive: res.data.isActive !== undefined ? res.data.isActive : true
          };
          setVideoConfig(config);
          if (!config.isActive) {
            setActiveTab("apply");
          }
        }
      } catch (err) {
        console.error("Failed to load demo video settings:", err);
      }
    };
    fetchVideoSettings();
    return () => {
      isMounted = false;
    };
  }, []);

  const [formData, setFormData] = useState({
    madrasaName: "",
    madrasaType: "কওমী মাদ্রাসা",
    applicantName: "",
    designation: "মুহতামিম / প্রিন্সিপাল",
    whatsapp: "",
    phone: "",
    district: "ঢাকা",
    address: "",
    studentCount: "১০০ - ২৫০ জন",
    interestedFeatures: ["admission", "accounting", "attendance", "exam"],
    notes: ""
  });

  const [loading, setLoading] = useState(false);
  const [submittedData, setSubmittedData] = useState(null);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleFeatureToggle = (featureId) => {
    setFormData((prev) => {
      const exists = prev.interestedFeatures.includes(featureId);
      return {
        ...prev,
        interestedFeatures: exists
          ? prev.interestedFeatures.filter((id) => id !== featureId)
          : [...prev.interestedFeatures, featureId]
      };
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!formData.madrasaName.trim()) {
      toast.error("অনুগ্রহ করে মাদ্রাসার নাম লিখুন");
      return;
    }
    if (!formData.applicantName.trim()) {
      toast.error("অনুগ্রহ করে আপনার নাম লিখুন");
      return;
    }
    if (!formData.whatsapp.trim()) {
      toast.error("অনুগ্রহ করে হোয়াটসঅ্যাপ নম্বরটি দিন");
      return;
    }

    try {
      setLoading(true);
      const res = await demoService.submitDemoRequest(formData);

      if (res.success) {
        toast.success("আলহামদুলিল্লাহ! আপনার আবেদনটি সফলভাবে গৃহীত হয়েছে।");
        setSubmittedData({ ...formData });
        window.scrollTo({ top: 0, behavior: "smooth" });
      } else {
        toast.error(res.message || "আবেদন ব্যর্থ হয়েছে");
      }
    } catch (err) {
      console.error("Demo submission failed:", err);
      // Even if network fails on local/cloud, give clear user guidance
      const errMsg = err?.response?.data?.message || "সার্ভারে সমস্যা হয়েছে। সরাসরি আমাদের হোয়াটসঅ্যাপে যোগাযোগ করতে পারেন।";
      toast.error(errMsg);
    } finally {
      setLoading(false);
    }
  };

  const getDirectWhatsAppUrl = () => {
    const madrasa = submittedData?.madrasaName || formData.madrasaName || "আমাদের মাদ্রাসা";
    const name = submittedData?.applicantName || formData.applicantName || "প্রতিনিধি";
    const phone = submittedData?.whatsapp || formData.whatsapp || "";
    const text = encodeURIComponent(
      `আসসালামু আলাইকুম। আমি ${name}, ${madrasa}-এর জন্য ফ্রি ডেমো পোর্টালে আবেদন করেছি।\nআমার ফোন/হোয়াটসঅ্যাপ: ${phone}\nদয়া করে আমাকে ডেমো পোর্টাল সেটআপ করে বিস্তারিত জানান।`
    );
    return `https://wa.me/${OFFICIAL_WHATSAPP_NUMBER}?text=${text}`;
  };

  return (
    <div className="min-h-screen bg-[#f8faf9] text-slate-800 font-bangla antialiased selection:bg-emerald-500 selection:text-white">
      {/* Navbar */}
      <Nabver />

      {/* Background Decorative Islamic Ambient Patterns */}
      <div className="relative overflow-hidden pt-6 pb-20 sm:pt-10 sm:pb-28">
        <div className="absolute inset-0 pointer-events-none select-none z-0">
          <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[900px] h-[450px] bg-gradient-to-b from-emerald-500/10 via-teal-400/5 to-transparent rounded-full blur-3xl" />
        </div>

        <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">


          {/* If already successfully submitted, show the Success View */}
          {submittedData ? (
            <div className="max-w-2xl mx-auto bg-white rounded-[8px] border border-emerald-100 shadow-xl p-6 text-center animate-fade-in">
              {/* Animated Drawing Checkmark */}
              <div className="relative w-20 h-20 mx-auto mb-6 flex items-center justify-center">
                <div className="absolute inset-0 rounded-3xl bg-emerald-500/20 blur-md" />
                <div className="relative w-20 h-20 bg-gradient-to-tr from-[#1C7D5A] via-emerald-600 to-teal-500 rounded-3xl flex items-center justify-center shadow-xl shadow-emerald-700/25 ring-8 ring-emerald-50">
                  <svg
                    className="w-10 h-10 text-white drop-shadow-xs"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="3"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  >
                    <path
                      d="M4 12l5 5L20 6"
                      strokeDasharray="24"
                      strokeDashoffset="24"
                    >
                      <animate
                        attributeName="stroke-dashoffset"
                        from="24"
                        to="0"
                        dur="0.65s"
                        fill="freeze"
                        calcMode="spline"
                        keySplines="0.4, 0, 0.2, 1"
                        keyTimes="0; 1"
                      />
                    </path>
                  </svg>
                </div>
              </div>

              <div className="inline-flex items-center gap-2 bg-emerald-50 text-emerald-800 border border-emerald-200/80 text-xs sm:text-sm font-semibold px-4 py-1.5 rounded-full mb-3">
                <Sparkles className="w-4 h-4 text-emerald-600" />
                <span>আবেদন সফলভাবে গৃহীত হয়েছে</span>
              </div>

              {/* Arabic Alhamdulillah (Matching Home Page Bismillah Style) */}
              <div className="my-3 select-none">
                <div className="flex items-center justify-center gap-3">
                  <span className="h-[1px] w-8 sm:w-16 bg-gradient-to-r from-transparent to-emerald-700/30" />
                  <h2
                    className="font-arabic text-2xl sm:text-3xl md:text-4xl text-[#14532d] font-bold tracking-wider drop-shadow-2xs"
                    dir="rtl"
                  >
                    الْحَمْدُ لِلَّهِ
                  </h2>
                  <span className="h-[1px] w-8 sm:w-16 bg-gradient-to-l from-transparent to-emerald-700/30" />
                </div>
              </div>

              <h2 className="text-2xl sm:text-3xl font-extrabold text-slate-900 mt-2">
                আপনার আবেদনটি জমা হয়েছে
              </h2>

              <p className="mt-4 text-slate-600 text-base sm:text-lg leading-relaxed max-w-lg mx-auto">
                আমাদের বিশেষজ্ঞ টিম খুব দ্রুত আপনার হোয়াটসঅ্যাপ নম্বরে যোগাযোগ করে ডেমো পোর্টাল প্রদান করবে।
              </p>

              {/* Action Buttons: Home & Direct WhatsApp */}
              <div className="space-y-3 pt-3">
                <div className="flex flex-col sm:flex-row items-center justify-center gap-3">
                  <Link
                    to="/"
                    className="w-full sm:w-auto inline-flex items-center justify-center gap-2 border border-slate-200 bg-white text-slate-700 hover:bg-slate-50 font-semibold py-3.5 px-6 rounded-xl transition-colors shadow-xs"
                  >
                    <Home className="w-4 h-4 text-slate-500" />
                    <span>হোমে ফিরে যান</span>
                  </Link>
                  <a
                    href={getDirectWhatsAppUrl()}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="w-full sm:w-auto inline-flex items-center justify-center gap-3 bg-[#25D366] hover:bg-[#20ba5a] active:scale-95 text-white font-bold text-base sm:text-lg py-3.5 px-6 rounded-xl shadow-lg shadow-emerald-600/20 hover:shadow-xl transition-all duration-200 group"
                  >
                    <MessageCircle className="w-6 h-6 fill-white" />
                    <span>দেরি না করে এখনই হোয়াটসঅ্যাপে চ্যাট করুন</span>
                    <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
                  </a>
                </div>
              </div>


            </div>
          ) : (
            /* Main Free Demo Content & Form */
            <div className="">
              {/* ====== TOP HEADER & DUAL TAB TOGGLE ====== */}
              <div className="space-y-4">
                <div className="flex flex-col items-center justify-center text-center">
                  <div className="inline-flex items-center gap-2 bg-[#fef9ee] text-[#b45309] border border-[#fde68a] text-xs font-semibold px-3.5 py-1.5 rounded-full mb-3 shadow-2xs">
                    <Sparkles className="w-3.5 h-3.5 text-amber-500 animate-pulse" />
                    <span>কোনো চার্জ ছাড়াই সম্পূর্ণ ফ্রি ডেমো</span>
                  </div>

                  <h1 className="text-3xl sm:text-4xl lg:text-[2.6rem] font-extrabold text-slate-900 leading-[1.25] tracking-tight">
                    আপনার মাদ্রাসার জন্য{" "}
                    <span className="text-[#1C7D5A]">ফ্রি ডেমো পোর্টাল</span> নিন
                  </h1>

                  <p className="text-xs sm:text-sm md:text-base text-slate-600 mt-2 max-w-xl text-center leading-relaxed">
                    {activeTab === "apply"
                      ? "মাদ্রাসা ডেমো আবেদন ফর্ম — নিচের তথ্যগুলো পূরণ করে আবেদন জমা দিন"
                      : (videoConfig.description || "ভিডিওর মাধ্যমে সফটওয়্যারটির সকল আধুনিক ফিচার ও ব্যবহারবিধি বিস্তারিত দেখে নিন")}
                  </p>

                  {/* Dual Segmented Toggle: ভিডিও দেখুন (First) / আবেদন করুন (Second) */}
                  <div className="mt-5 inline-flex p-1 bg-[#edf7f2] rounded-full border border-[#d6ecdf] shadow-xs">
                    <button
                      type="button"
                      onClick={() => setActiveTab("video")}
                      className={`px-6 sm:px-8 py-2 rounded-full text-sm sm:text-base font-bold transition-all duration-200 cursor-pointer ${activeTab === "video"
                        ? "bg-white text-[#1C7D5A] shadow-xs"
                        : "text-[#1C7D5A]/80 hover:text-[#1C7D5A]"
                        }`}
                    >
                      ভিডিও দেখুন
                    </button>

                    <button
                      type="button"
                      onClick={() => setActiveTab("apply")}
                      className={`px-6 sm:px-8 py-2 rounded-full text-sm sm:text-base font-bold transition-all duration-200 cursor-pointer ${activeTab === "apply"
                        ? "bg-white text-[#1C7D5A] shadow-xs"
                        : "text-[#1C7D5A]/80 hover:text-[#1C7D5A]"
                        }`}
                    >
                      আবেদন করুন
                    </button>
                  </div>
                </div>
              </div>

              {/* Dynamic View: Form or Video */}
              {activeTab === "apply" ? (
                /* ====== RIGHT COLUMN: Demo Application Form ====== */
                <div className="max-w-[650px] mx-auto mt-[30px] transition-all duration-300">
                  <div className="bg-white rounded-[8px] border border-slate-200/90 shadow-xl p-[25px] relative">
                    <form onSubmit={handleSubmit} className="space-y-6">


                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                        <div>
                          <label className="block text-sm font-semibold text-slate-700 mb-1.5">
                            আপনার নাম <span className="text-rose-500">*</span>
                          </label>
                          <div className="relative">
                            <User className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                            <input
                              type="text"
                              name="applicantName"
                              required
                              placeholder="উদাঃ মাওলানা আব্দুল্লাহ"
                              value={formData.applicantName}
                              onChange={handleInputChange}
                              className="w-full pl-10 pr-4 py-2.5 rounded-[8px] border border-slate-200 focus:border-emerald-500 focus:ring-2 focus:ring-emerald-500/20 outline-none text-sm transition-all bg-slate-50/50 hover:bg-white"
                            />
                          </div>
                        </div>

                        <div>
                          <label className="block text-sm font-semibold text-slate-700 mb-1.5">
                            আপনার ফোন নাম্বার <span className="text-rose-500">*</span> ( Whatsapp )
                          </label>
                          <div className="relative">
                            <Phone className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                            <input
                              type="tel"
                              name="whatsapp"
                              required
                              placeholder="০১৭XX-XXXXXX"
                              value={formData.whatsapp}
                              onChange={handleInputChange}
                              className="w-full pl-10 pr-4 py-2.5 rounded-[8px] border border-slate-200 focus:border-emerald-500 focus:ring-2 focus:ring-emerald-500/20 outline-none text-sm transition-all bg-slate-50/50 hover:bg-white"
                            />
                          </div>
                        </div>
                      </div>

                      {/* Section 1: Madrasa Basic Info */}
                      <div className="space-y-4">
                        <div>
                          <label className="block text-sm font-semibold text-slate-700 mb-1.5">
                            মাদ্রাসার নাম <span className="text-rose-500">*</span>
                          </label>
                          <div className="relative">
                            <Building2 className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                            <input
                              type="text"
                              name="madrasaName"
                              required
                              placeholder="উদাঃ জামিয়া ইসলামিয়া দারুল উলুম"
                              value={formData.madrasaName}
                              onChange={handleInputChange}
                              className="w-full pl-10 pr-4 py-2.5 rounded-[8px] border border-slate-200 focus:border-emerald-500 focus:ring-2 focus:ring-emerald-500/20 outline-none text-sm transition-all bg-slate-50/50 hover:bg-white"
                            />
                          </div>
                        </div>

                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                          <div>
                            <label className="block text-sm font-semibold text-slate-700 mb-1.5">
                              মাদ্রাসার ধরন <span className="text-rose-500">*</span>
                            </label>
                            <select
                              name="madrasaType"
                              value={formData.madrasaType}
                              onChange={handleInputChange}
                              className="w-full px-3.5 py-2 rounded-[8px] border border-slate-200 focus:border-emerald-500 focus:ring-2 focus:ring-emerald-500/20 outline-none text-sm transition-all bg-slate-50/50"
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
                              onChange={handleInputChange}
                              className="w-full px-3.5 py-2 rounded-[8px] border border-slate-200 focus:border-emerald-500 focus:ring-2 focus:ring-emerald-500/20 outline-none text-sm transition-all bg-slate-50/50"
                            >
                              {STUDENT_RANGES.map((range) => (
                                <option key={range} value={range}>
                                  {range}
                                </option>
                              ))}
                            </select>
                          </div>
                        </div>

                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                          <div>
                            <label className="block text-sm font-semibold text-slate-700 mb-1.5">
                              জেলা <span className="text-rose-500">*</span>
                            </label>
                            <div className="relative">
                              <MapPin className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                              <select
                                name="district"
                                value={formData.district}
                                onChange={handleInputChange}
                                className="w-full pl-10 pr-3.5 py-2 rounded-[8px] border border-slate-200 focus:border-emerald-500 focus:ring-2 focus:ring-emerald-500/20 outline-none text-sm transition-all bg-slate-50/50"
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
                              placeholder="উদাঃ চকবাজার, কোতোয়ালী"
                              value={formData.address}
                              onChange={handleInputChange}
                              className="w-full px-4 py-2.5 rounded-[8px] border border-slate-200 focus:border-emerald-500 focus:ring-2 focus:ring-emerald-500/20 outline-none text-sm transition-all bg-slate-50/50 hover:bg-white"
                            />
                          </div>
                        </div>
                      </div>



                      {/* Section 4: Extra Note */}
                      <div className="pt-2 border-t border-slate-100">
                        <label className="block text-sm font-semibold text-slate-700 mb-1.5">
                          অতিরিক্ত কোনো জিজ্ঞাসা বা বিশেষ বার্তা (ঐচ্ছিক)
                        </label>
                        <textarea
                          name="notes"
                          rows="3"
                          placeholder="আপনার মাদ্রাসার কোনো নির্দিষ্ট চাহিদা বা প্রশ্ন থাকলে এখানে লিখতে পারেন..."
                          value={formData.notes}
                          onChange={handleInputChange}
                          className="w-full px-4 py-2.5 rounded-[8px] border border-slate-200 focus:border-emerald-500 focus:ring-2 focus:ring-emerald-500/20 outline-none text-sm transition-all bg-slate-50/50 hover:bg-white resize-none"
                        />
                      </div>



                      {/* Submit Button */}
                      <button
                        type="submit"
                        disabled={loading}
                        className="w-full bg-[#0e7c55] hover:bg-[#0a6646] active:scale-98 text-white font-bold text-base sm:text-lg py-2.5 px-6 rounded-full shadow-lg shadow-emerald-800/20 hover:shadow-xl hover:shadow-emerald-800/30 transition-all duration-200 flex items-center justify-center gap-2.5 disabled:opacity-60 cursor-pointer"
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
                  </div>
                </div>
              ) : (
                /* ====== VIDEO SHOWCASE VIEW ====== */
                <div className="max-w-4xl mx-auto mt-[30px] transition-all duration-300 space-y-6">
                  {/* Video Player Card */}
                  <div className="bg-white rounded-[8px] border border-slate-200/90 shadow-xl p-4  relative overflow-hidden">
                    {/* Ambient Glow */}
                    <div className="absolute top-0 right-0 -mr-20 -mt-20 w-72 h-72 bg-emerald-500/10 rounded-full blur-3xl pointer-events-none" />



                    {/* Responsive Video Container (16:9) */}
                    <div className="relative w-full aspect-video rounded-[8px] overflow-hidden bg-slate-950 shadow-2xl border border-slate-800">
                      <iframe
                        className="w-full h-full object-cover"
                        src={videoConfig.embedUrl || videoConfig.videoUrl || DEFAULT_DEMO_VIDEO_URL}
                        title={videoConfig.title || "মাদ্রাসা ম্যানেজমেন্ট সফটওয়্যার ডেমো ভিডিও"}
                        allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
                        allowFullScreen
                      />
                    </div>


                  </div>
                </div>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default FreeDemo;
