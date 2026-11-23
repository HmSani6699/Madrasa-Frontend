import React, { useState, useEffect } from "react";
import {
  Sparkles,
  Video,
  CreditCard,
  BookOpen,
  Printer,
  ShoppingBag,
  Layers,
  ShieldCheck,
  Laptop,
  Phone,
  MessageSquare,
  CheckCircle2,
  ArrowRight,
  Send,
  X,
  Building2,
  User,
  MapPin,
  ExternalLink
} from "lucide-react";
import additionalService from "../../../services/additionalService";
import axiosInstance from "../../../api/axiosInstance";
import endpoints from "../../../api/endpoints";
import { toast } from "react-hot-toast";

const WhatsAppIcon = ({ className = "w-5 h-5" }) => (
  <svg className={`fill-current ${className}`} viewBox="0 0 24 24">
    <path d="M.057 24l1.687-6.163c-1.041-1.804-1.588-3.849-1.587-5.946.003-6.556 5.338-11.891 11.893-11.891 3.181.001 6.167 1.24 8.413 3.488 2.245 2.248 3.481 5.236 3.48 8.414-.003 6.557-5.338 11.892-11.893 11.892-1.99-.001-3.951-.5-5.688-1.448l-6.305 1.654zm6.597-3.807c1.676.995 3.276 1.591 5.392 1.592 5.448 0 9.886-4.434 9.889-9.885.002-5.462-4.415-9.89-9.881-9.892-5.452 0-9.887 4.434-9.889 9.884-.001 2.225.651 3.891 1.746 5.634l-.999 3.648 3.742-.981zm11.387-5.464c-.074-.124-.272-.198-.57-.347-.297-.149-1.758-.868-2.031-.967-.272-.099-.47-.149-.669.149-.198.297-.768.967-.941 1.165-.173.198-.347.223-.644.074-.297-.149-1.255-.462-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.297-.347.446-.521.151-.172.2-.296.3-.495.099-.198.05-.372-.025-.521-.075-.148-.669-1.611-.916-2.206-.242-.579-.487-.501-.669-.51l-.57-.01c-.198 0-.52.074-.792.372s-1.04 1.016-1.04 2.479 1.065 2.876 1.213 3.074c.149.198 2.095 3.2 5.076 4.487.709.306 1.263.489 1.694.626.712.226 1.36.194 1.872.118.571-.085 1.758-.719 2.006-1.413.248-.695.248-1.29.173-1.414z" />
  </svg>
);

const ICON_MAP = {
  Video,
  CreditCard,
  BookOpen,
  Printer,
  Sparkles,
  ShoppingBag,
  Layers,
  ShieldCheck,
  Laptop,
  Phone,
  MessageSquare
};

const DEFAULT_SERVICES = [
  {
    _id: "def-1",
    title: "ভর্তি প্রচারণা ভিডিও ও অ্যানিমেশন",
    category: "ডিজিটাল মিডিয়া ও মার্কেটিং",
    shortDesc: "নতুন শিক্ষাবর্ষে শিক্ষার্থী ভর্তির সংখ্যা বৃদ্ধি করতে প্রফেশনাল ইসলামিক ভিডিও ও সোশ্যাল মিডিয়া বিজ্ঞাপন।",
    description: "আপনার মাদরাসার সার্বিক সুযোগ-সুবিধা, হিফজ ও কিতাব বিভাগের বিশেষত্ব, দক্ষ শিক্ষকবৃন্দ এবং মনোরম পরিবেশ তুলে ধরে আকর্ষণীয় ফুল এইচডি প্রোমো ভিডিও। যা ফেসবুক ও ইউটিউবে প্রচারের মাধ্যমে দ্রুত শিক্ষার্থী ও অভিভাবকদের দৃষ্টি আকর্ষণ করে।",
    features: [
      "১০৮০p ফুল এইচডি প্রফেশনাল ভিডিও ও মোশন গ্রাফিক্স",
      "মার্জিত ইসলামিক ব্যাকগ্রাউন্ড সাউন্ড ও আকর্ষনীয় ভয়েসওভার",
      "ফেসবুক ও ইউটিউব সাইজ অনুযায়ী অপ্টিমাইজড ফরম্যাট",
      "সোশ্যাল মিডিয়া পেজে বুস্টিং ও প্রচারণার টেকনিক্যাল গাইডলাইন"
    ],
    price: "শুরু মাত্র ৩,০০০৳ থেকে",
    badge: "জনপ্রিয় ও ফলপ্রসূ",
    icon: "Video",
    image: "https://images.unsplash.com/photo-1574717024653-61fd2cf4d44d?auto=format&fit=crop&q=80&w=800",
    order: 1,
    isActive: true
  },
  {
    _id: "def-2",
    title: "স্মার্ট স্টুডেন্ট আইডি কার্ড ও ফিতা",
    category: "প্রিন্টিং ও ব্র্যান্ডিং",
    shortDesc: "প্রিমিয়াম পিভিসি প্লাস্টিক কার্ড, বারকোড/কিউআর কোড এবং মাদরাসার নামযুক্ত ডিজিটাল প্রিন্টেড ফিতা।",
    description: "শিক্ষার্থীদের সার্বিক নিরাপত্তা ও প্রতিষ্ঠানের আধুনিকায়নে ওয়াটারপ্রুফ টেকসই ডিজিটাল পিভিসি কার্ড। যা মাদরাসা সেবা সফটওয়্যারের সাথে অটো স্ক্যান হয়ে উপস্থিতি ও ফি কালেকশনে কাজ করে।",
    features: [
      "উন্নত মানের ওয়াটারপ্রুফ টেকসই পিভিসি প্লাস্টিক কার্ড",
      "সফটওয়্যার সাপোর্টেড ডিজিটাল কিউআর কোড ও বারকোড",
      "মাদরাসার নাম ও লোগো সম্বলিত প্রিমিয়াম সাটিন ফিতা ও হোল্ডার",
      "সম্পূর্ণ ফ্রি আধুনিক ও আকর্ষণীয় টেমপ্লেট ডিজাইন"
    ],
    price: "প্রতি পিস মাত্র ২৫৳ থেকে",
    badge: "প্রয়োজনীয় সামগ্রী",
    icon: "CreditCard",
    image: "https://images.unsplash.com/photo-1589330694653-dad6bc01cf0e?auto=format&fit=crop&q=80&w=800",
    order: 2,
    isActive: true
  },
  {
    _id: "def-3",
    title: "মাদরাসার তথ্য সংবলিত কাস্টমাইজড খাতা",
    category: "স্টেশনারি ও প্রিন্টিং",
    shortDesc: "মাদরাসার নাম, মনোগ্রাম, ক্লাসের রুটিন ও ইসলামিক নিয়মাবলী যুক্ত দৃষ্টিনন্দন খাতা ও ডায়েরি।",
    description: "শিক্ষার্থীদের ক্লাসের পড়া, হোমওয়ার্ক ও পরীক্ষার জন্য প্রিমিয়াম ৮০ জিএসএম স্মুথ পেপারের কাস্টমাইজড খাতা। খাতার কভারে মাদরাসার পরিচিতি, লক্ষ্য-উদ্দেশ্য ও জরুরি যোগাযোগের নম্বর থাকায় প্রতিষ্ঠানের ব্র্যান্ডিং ছড়িয়ে পড়ে।",
    features: [
      "মাদরাসার নিজস্ব লোগো ও ছবিযুক্ত চাররঙা গ্লসি প্রচ্ছদ",
      "৮০ জিএসএম প্রিমিয়াম স্মুথ হোয়াইট পেপার (লিখতে অত্যন্ত আরামদায়ক)",
      "ক্লাস ওয়ার্ক, হোমওয়ার্ক, হিফজ ট্র্যাকার ও পরীক্ষার জন্য উপযোগী",
      "বিভিন্ন সাইজ (দস্তা, ডিমাই) এবং পেজ সংখ্যায় কাস্টমাইজ করার সুবিধা"
    ],
    price: "প্রতি পিস মাত্র ৩৫৳ থেকে",
    badge: "ব্র্যান্ডিং সামগ্রী",
    icon: "BookOpen",
    image: "https://images.unsplash.com/photo-1544716278-ca5e3f4abd8c?auto=format&fit=crop&q=80&w=800",
    order: 3,
    isActive: true
  },
];

const OFFICIAL_PHONE_RAW = "01830630365";
const OFFICIAL_PHONE_FORMATTED = "01830-630365";

const AdditionalServices = () => {
  const [services, setServices] = useState(DEFAULT_SERVICES);
  const [loading, setLoading] = useState(true);

  // Inquiry Modal State
  const [selectedService, setSelectedService] = useState(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [inquiryForm, setInquiryForm] = useState({
    name: "",
    phone: "",
    madrasaName: "",
    address: "",
    message: ""
  });

  useEffect(() => {
    fetchServices();
  }, []);

  const fetchServices = async () => {
    try {
      setLoading(true);
      const res = await additionalService.getPublicAdditionalServices();
      if (res?.success && Array.isArray(res.data) && res.data.length > 0) {
        setServices(res.data);
      } else {
        setServices(DEFAULT_SERVICES);
      }
    } catch (err) {
      console.error("Public additional services fetch error:", err);
      setServices(DEFAULT_SERVICES);
    } finally {
      setLoading(false);
    }
  };

  const handleOpenInquiry = (service) => {
    setSelectedService(service);
    setInquiryForm({
      name: "",
      phone: "",
      madrasaName: "",
      address: "",
      message: `আমি '${service.title}' সম্পর্কে বিস্তারিত জানতে ও অর্ডার করতে আগ্রহী।`
    });
  };

  const handleSubmitInquiry = async (e) => {
    e.preventDefault();

    if (!inquiryForm.name.trim()) {
      toast.error("অনুগ্রহ করে আপনার নাম লিখুন");
      return;
    }
    if (!inquiryForm.phone.trim()) {
      toast.error("অনুগ্রহ করে মোবাইল নম্বর প্রদান করুন");
      return;
    }

    try {
      setIsSubmitting(true);
      const combinedMessage = `[সেবা ও সামগ্রী অর্ডার/পরামর্শ]\nসেবা: ${selectedService?.title || "অনির্দিষ্ট"}\nক্যাটাগরি: ${selectedService?.category || "সাধারণ"}\nমাদরাসা: ${inquiryForm.madrasaName || "উল্লেখ নেই"}\nঠিকানা: ${inquiryForm.address || "উল্লেখ নেই"}\nবার্তা: ${inquiryForm.message || "কোনো অতিরিক্ত বার্তা নেই"}`;

      const res = await axiosInstance.post(endpoints.contact.submit, {
        name: inquiryForm.name.trim(),
        phone: inquiryForm.phone.trim(),
        message: combinedMessage
      });

      if (res.data?.success) {
        toast.success("আপনার অনুরোধ সফলভাবে গৃহীত হয়েছে! আমাদের টিম শীঘ্রই যোগাযোগ করবে।");
        setSelectedService(null);
      } else {
        toast.error(res.data?.message || "অনুরোধ পাঠাতে ব্যর্থ হয়েছে।");
      }
    } catch (err) {
      console.error("Submit service inquiry error:", err);
      toast.error(err.response?.data?.message || "অনুরোধ পাঠানো সম্ভব হয়নি। অনুগ্রহ করে সরাসরি কল করুন।");
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleWhatsAppChat = (service) => {
    const text = encodeURIComponent(
      `আসসালামু আলাইকুম। আমি মাদ্রাসা সেবা ওয়েবসাইট থেকে '${service.title}' (${service.category}) সম্পর্কে বিস্তারিত তথ্য ও অর্ডার প্রক্রিয়া জানতে আগ্রহী।`
    );
    window.open(`https://wa.me/88${OFFICIAL_PHONE_RAW}?text=${text}`, "_blank");
  };

  return (
    <section id="additional-services" className="relative py-16 sm:py-24 bg-white overflow-hidden font-bangla">
      {/* Background Decorative Blur & Gradient */}
      <div className="absolute top-1/3 left-0 w-80 h-80 bg-emerald-50/60 rounded-full blur-3xl -translate-y-1/2 -translate-x-1/2 pointer-events-none" />
      <div className="absolute bottom-10 right-0 w-80 h-80 bg-amber-50/70 rounded-full blur-3xl translate-y-1/2 translate-x-1/2 pointer-events-none" />

      <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* ====== Header Section ====== */}
        <div className="text-center max-w-3xl mx-auto mb-12 sm:mb-16">
          {/* Top Pill Badge */}
          <div className="inline-flex items-center gap-1.5 px-4 py-1.5 rounded-full border border-emerald-200/90 bg-emerald-50/80 text-xs sm:text-sm font-semibold text-emerald-800 shadow-2xs mb-4">
            <Sparkles className="w-3.5 h-3.5 text-emerald-600 animate-pulse" />
            <span>অতিরিক্ত সেবা ও হার্ডওয়্যার সলিউশন</span>
          </div>

          {/* Main Title */}
          <h2 className="text-3xl sm:text-4xl lg:text-[2.20rem] font-black text-slate-900 tracking-tight leading-[1.3] mb-4">
            সফটওয়্যারের পাশাপাশি আমাদের <span className="text-[#EAB33C]">প্রয়োজনীয় সেবা</span>

          </h2>

          {/* Subtitle */}
          <p className="text-slate-600 text-sm sm:text-base font-normal max-w-2xl mx-auto leading-relaxed">
            মাদরাসার প্রচার-প্রচারণা, প্রাতিষ্ঠানিক ব্র্যান্ডিং এবং দ্রুত ফি ব্যবস্থাপনায় সফটওয়্যারের সাথে আমরা সরবরাহ করি মানসম্মত ডিজিটাল সামগ্রী ও প্রয়োজনীয় হার্ডওয়্যার
          </p>
        </div>

        {/* ====== Services Cards Grid ====== */}
        {loading ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-2 gap-8">
            {[1, 2, 3, 4].map((n) => (
              <div
                key={n}
                className="bg-white rounded-3xl border border-slate-100 p-6 shadow-sm animate-pulse space-y-4"
              >
                <div className="w-full aspect-video bg-slate-100 rounded-2xl" />
                <div className="h-6 bg-slate-200 rounded w-2/3" />
                <div className="h-4 bg-slate-100 rounded w-full" />
                <div className="h-4 bg-slate-100 rounded w-4/5" />
                <div className="pt-4 flex justify-between items-center">
                  <div className="h-8 bg-slate-200 rounded-lg w-28" />
                  <div className="h-10 bg-slate-200 rounded-xl w-32" />
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {services.map((service) => {
              const IconComponent = ICON_MAP[service.icon] || Sparkles;

              return (
                <div
                  key={service._id || service.title}
                  className="bg-white rounded-[15px] border border-slate-200/80 hover:border-emerald-400 shadow-sm hover:shadow-xl transition-all duration-300 flex flex-col justify-between overflow-hidden group"
                >
                  <div>
                    {/* Media Header Container */}
                    <div className="relative aspect-video bg-slate-900 overflow-hidden">
                      {service.image ? (
                        <img
                          src={service.image}
                          alt={service.title}
                          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700"
                        />
                      ) : (
                        <div className="w-full h-full bg-linear-to-br from-emerald-800 to-slate-900 flex items-center justify-center">
                          <IconComponent className="w-16 h-16 text-emerald-400/50" />
                        </div>
                      )}

                      {/* Gradient Overlay */}
                      <div className="absolute inset-0 bg-linear-to-t from-slate-950/80 via-slate-950/30 to-transparent" />

                      {/* Badges on Top */}
                      <div className="absolute top-4 left-4 flex flex-wrap items-center gap-2">
                        <span className="px-3 py-1 bg-white/95 backdrop-blur-md text-emerald-800 text-xs font-bold rounded-full shadow-sm flex items-center gap-1.5">
                          <IconComponent className="w-3.5 h-3.5 text-emerald-600" />
                          <span>{service.category}</span>
                        </span>
                        {service.badge && (
                          <span className="px-3 py-1 bg-[#EAB33C] text-slate-950 text-xs font-black rounded-full shadow-sm">
                            {service.badge}
                          </span>
                        )}
                      </div>

                      {/* Price Pill at Bottom of Image */}
                      {service.price && (
                        <div className="absolute bottom-4 left-4">
                          <div className="inline-flex items-center px-3.5 py-1.5 rounded-xl bg-emerald-600/95 backdrop-blur-md text-white text-xs sm:text-sm font-bold shadow-lg border border-emerald-400/30">
                            {service.price}
                          </div>
                        </div>
                      )}
                    </div>

                    {/* Content Section */}
                    <div className="p-4 space-y-5">
                      <div>
                        <h3 className="text-xl sm:text-[20px] font-bold text-slate-900 group-hover:text-emerald-700 transition-colors leading-snug">
                          {service.title}
                        </h3>
                        {service.shortDesc && (
                          <p className="text-slate-600 text-sm mt-2 leading-relaxed">
                            {service.shortDesc}
                          </p>
                        )}
                      </div>

                      {/* Features Bullet List */}
                      {Array.isArray(service.features) && service.features.length > 0 && (
                        <div className="space-y-2.5 pt-2 border-t border-slate-100">
                          {service.features.slice(0, 3).map((feature, idx) => (
                            <div key={idx} className="flex items-start gap-2.5 text-xs sm:text-sm text-slate-700">
                              <span className="mt-0.5 rounded-full p-0.5 bg-emerald-100 text-emerald-700 shrink-0">
                                <CheckCircle2 className="w-3.5 h-3.5" />
                              </span>
                              <span className="leading-relaxed">{feature}</span>
                            </div>
                          ))}
                        </div>
                      )}
                    </div>
                  </div>

                  {/* Card Action Buttons */}
                  <div className="px-6 pb-6 sm:px-8 sm:pb-8 pt-2 flex items-center gap-3">
                    <button
                      type="button"
                      onClick={() => handleOpenInquiry(service)}
                      className="flex-1 flex items-center justify-center gap-2 px-5 py-3 rounded-full bg-[#1C7D5A] hover:bg-[#156045] active:scale-[0.98] text-white font-bold text-sm shadow-md shadow-emerald-900/10 transition-all cursor-pointer"
                    >
                      <span>অর্ডার বা বিস্তারিত জানুন</span>
                      <ArrowRight className="w-4 h-4" />
                    </button>

                    <button
                      type="button"
                      onClick={() => handleWhatsAppChat(service)}
                      className="w-11 h-11 flex items-center justify-center rounded-xl bg-emerald-50 hover:bg-emerald-100 text-emerald-600 hover:text-emerald-700 transition-colors border border-emerald-200/60 cursor-pointer shrink-0"
                      title="হোয়াটসঅ্যাপে চ্যাট করুন"
                      aria-label="হোয়াটসঅ্যাপে চ্যাট করুন"
                    >
                      <WhatsAppIcon className="w-5 h-5" />
                    </button>
                  </div>
                </div>
              );
            })}
          </div>
        )}

        {/* Direct Phone / Contact Banner */}
        <div className="mt-12 bg-linear-to-r from-emerald-800 to-teal-900 rounded-3xl p-6 sm:p-8 text-white shadow-xl flex flex-col md:flex-row items-center justify-between gap-6">
          <div className="flex items-center gap-4 text-center md:text-left">
            <div className="w-14 h-14 rounded-2xl bg-white/10 backdrop-blur-md flex items-center justify-center text-white shrink-0 mx-auto md:mx-0">
              <Phone className="w-7 h-7 text-[#EAB33C]" />
            </div>
            <div>
              <h4 className="text-lg sm:text-xl font-bold">
                কাস্টমাইজড কোনো সেবা বা সামগ্রীর প্রয়োজন?
              </h4>
              <p className="text-xs sm:text-sm text-emerald-100 mt-1">
                মাদরাসার চাহিদা অনুযায়ী যেকোনো কাস্টম প্রিন্টিং বা হার্ডওয়্যার সলিউশন পেতে সরাসরি আমাদের প্রতিনিধির সাথে কথা বলুন।
              </p>
            </div>
          </div>

          <div className="flex items-center gap-3 shrink-0">
            <a
              href={`tel:${OFFICIAL_PHONE_RAW}`}
              className="px-6 py-3 bg-[#EAB33C] hover:bg-[#d69f2e] text-slate-950 font-bold rounded-xl text-sm shadow-md transition-all flex items-center gap-2"
            >
              <Phone className="w-4 h-4" />
              <span>কল করুন: {OFFICIAL_PHONE_FORMATTED}</span>
            </a>
          </div>
        </div>
      </div>

      {/* ====== Order / Inquiry Modal ====== */}
      {selectedService && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-xs font-bangla animate-fade-in">
          <div className="bg-white rounded-3xl max-w-lg w-full p-6 sm:p-8 shadow-2xl relative border border-slate-100 max-h-[90vh] overflow-y-auto">
            {/* Close Button */}
            <button
              type="button"
              onClick={() => setSelectedService(null)}
              className="absolute top-5 right-5 p-2 text-slate-400 hover:text-slate-600 hover:bg-slate-100 rounded-full transition-colors cursor-pointer"
            >
              <X className="w-5 h-5" />
            </button>

            {/* Modal Header */}
            <div className="mb-6 pr-6">
              <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-lg bg-emerald-50 text-emerald-700 text-xs font-semibold mb-2">
                <Sparkles className="w-3.5 h-3.5" />
                <span>{selectedService.category}</span>
              </div>
              <h3 className="text-xl font-bold text-slate-900 leading-snug">
                {selectedService.title}
              </h3>
              <p className="text-xs text-slate-500 mt-1">
                অর্ডার করতে বা বিস্তারিত পরামর্শ পেতে নিচের ফর্মটি পূরণ করুন
              </p>
            </div>

            {/* Inquiry Form */}
            <form onSubmit={handleSubmitInquiry} className="space-y-4">
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">
                  আপনার নাম <span className="text-red-500">*</span>
                </label>
                <div className="relative">
                  <User className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
                  <input
                    type="text"
                    required
                    placeholder="যেমন: মুহতামিম / প্রিন্সিপাল"
                    value={inquiryForm.name}
                    onChange={(e) => setInquiryForm({ ...inquiryForm, name: e.target.value })}
                    className="w-full pl-9 pr-3.5 py-2.5 text-sm bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:border-emerald-500 focus:bg-white"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">
                  মোবাইল নম্বর <span className="text-red-500">*</span>
                </label>
                <div className="relative">
                  <Phone className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
                  <input
                    type="tel"
                    required
                    placeholder="০১XXXXXXXXX"
                    value={inquiryForm.phone}
                    onChange={(e) => setInquiryForm({ ...inquiryForm, phone: e.target.value })}
                    className="w-full pl-9 pr-3.5 py-2.5 text-sm bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:border-emerald-500 focus:bg-white"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">
                  মাদরাসার নাম (ঐচ্ছিক)
                </label>
                <div className="relative">
                  <Building2 className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
                  <input
                    type="text"
                    placeholder="আপনার মাদরাসার পুরো নাম"
                    value={inquiryForm.madrasaName}
                    onChange={(e) => setInquiryForm({ ...inquiryForm, madrasaName: e.target.value })}
                    className="w-full pl-9 pr-3.5 py-2.5 text-sm bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:border-emerald-500 focus:bg-white"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">
                  জেলা / ঠিকানা (ঐচ্ছিক)
                </label>
                <div className="relative">
                  <MapPin className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
                  <input
                    type="text"
                    placeholder="যেমন: ঢাকা / চট্টগ্রাম"
                    value={inquiryForm.address}
                    onChange={(e) => setInquiryForm({ ...inquiryForm, address: e.target.value })}
                    className="w-full pl-9 pr-3.5 py-2.5 text-sm bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:border-emerald-500 focus:bg-white"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">
                  অতিরিক্ত তথ্য / পরিমাণ (যদি থাকে)
                </label>
                <textarea
                  rows="2"
                  value={inquiryForm.message}
                  onChange={(e) => setInquiryForm({ ...inquiryForm, message: e.target.value })}
                  className="w-full px-3.5 py-2 text-sm bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:border-emerald-500 focus:bg-white resize-none"
                />
              </div>

              <div className="pt-2 flex flex-col gap-2">
                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="w-full py-3 bg-[#1C7D5A] hover:bg-[#156045] disabled:opacity-50 text-white font-bold text-sm rounded-xl shadow-md transition-all flex items-center justify-center gap-2 cursor-pointer"
                >
                  <Send className="w-4 h-4" />
                  <span>{isSubmitting ? "অনুরোধ পাঠানো হচ্ছে..." : "অর্ডার বা পরামর্শের অনুরোধ পাঠান"}</span>
                </button>

                <button
                  type="button"
                  onClick={() => handleWhatsAppChat(selectedService)}
                  className="w-full py-2.5 bg-emerald-50 hover:bg-emerald-100 text-emerald-800 font-semibold text-xs rounded-xl transition-colors flex items-center justify-center gap-2 cursor-pointer"
                >
                  <WhatsAppIcon className="w-4 h-4 text-emerald-600" />
                  <span>সরাসরি হোয়াটসঅ্যাপে কথা বলুন</span>
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </section>
  );
};

export default AdditionalServices;
