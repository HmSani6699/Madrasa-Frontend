import React, { useState } from "react";
import { Link } from "react-router-dom";
import {
  Rocket,
  Sparkles,
  Crown,
  Check,
  X as CrossIcon,
  ArrowRight,
  PhoneCall,
  MessageCircle,
  HelpCircle,
  ChevronDown,
  ChevronUp,
  ShieldCheck,
  Building2,
  Users,
  CheckCircle2,
  Headphones,
  Database,
  Globe,
  Award,
  Zap,
} from "lucide-react";
import Nabver from "../Home/Nabver/Nabver";
import SubscriptionModal from "../../components/SubscriptionModal";

// Official Support WhatsApp
const OFFICIAL_WHATSAPP_NUMBER = "8801986544021";

const DETAILED_PACKAGES = [
  {
    id: "basic",
    name: "বেসিক",
    subtitle: "ছোট প্রতিষ্ঠানের জন্য",
    monthlyPrice: "৳৯৫০",
    yearlyPrice: "৳৪১৫",
    yearlyBilled: "৳৪,৯৮০/বছর",
    icon: Rocket,
    studentLimitText: "১০০ ছাত্র পর্যন্ত",
    userLimitText: "৫ জন শিক্ষক/স্টাফ ইউজার",
    smsQuota: "৫০০ এসএমএস ফ্রি",
    isPopular: false,
    colorTheme: "amber",
    description: "মক্তব, হিফজখানা বা নতুন মাদ্রাসার ডিজিটাল যাত্রার জন্য একদম উপযুক্ত প্যাকেজ।",
    highlights: [
      "১০০ ছাত্র ব্যবস্থাপনা",
      "৫ ইউজার অ্যাকাউন্ট",
      "বেসিক রিপোর্ট জেনারেশন",
      "ইমেইল ও মেসেজ সাপোর্ট",
      "অনলাইন ভর্তি ফরম",
    ],
  },
  {
    id: "standard",
    name: "স্ট্যান্ডার্ড",
    subtitle: "মাঝারি প্রতিষ্ঠানের জন্য",
    monthlyPrice: "৳১৪৫০",
    yearlyPrice: "৳৫৮০",
    yearlyBilled: "৳৬,৯৬০/বছর",
    icon: Sparkles,
    studentLimitText: "১৮০ ছাত্র পর্যন্ত",
    userLimitText: "১৫ জন শিক্ষক/স্টাফ ইউজার",
    smsQuota: "২,০০০ এসএমএস ফ্রি",
    isPopular: true,
    badgeText: "সবচেয়ে জনপ্রিয়",
    colorTheme: "emerald",
    description: "মাঝারি কওমী ও আলিয়া মাদ্রাসার জন্য সর্বাধিক ব্যবহৃত ও স্বয়ংসম্পূর্ণ প্যাকেজ।",
    highlights: [
      "১৮০ ছাত্র ব্যবস্থাপনা",
      "১৫ ইউজার অ্যাকাউন্ট",
      "২,০০০ ফ্রি বাংলা এসএমএস",
      "এডভান্সড রিপোর্ট ও অডিট",
      "এডমিট ও আইডি কার্ড প্রিন্ট",
      "অভিভাবক নোটিফিকেশন",
    ],
  },
  {
    id: "premium",
    name: "প্রিমিয়াম",
    subtitle: "বড় প্রতিষ্ঠানের জন্য",
    monthlyPrice: "৳২৪৫০",
    yearlyPrice: "৳৮৩০",
    yearlyBilled: "৳৯,৯৬০/বছর",
    icon: Crown,
    studentLimitText: "আনলিমিটেড ছাত্র",
    userLimitText: "আনলিমিটেড ইউজার",
    smsQuota: "১০,০০০ এসএমএস ফ্রি",
    isPopular: false,
    colorTheme: "emerald-dark",
    description: "বড় জামিয়া, বহুমুখী শাখা বা সম্পূর্ণ আধুনিক ডিজিটাল মাদ্রাসার সর্বাধুনিক সমাধান।",
    highlights: [
      "আনলিমিটেড ছাত্র ও শিক্ষক",
      "১০,০০০ ফ্রি বাংলা এসএমএস",
      "কাস্টম ডোমেইন কানেকশন",
      "সম্পূর্ণ পে-রোল ও বেতন",
      "২৪/৭ ডেডিকেটেড সাপোর্ট",
      "ভিআইপি অনবোর্ডিং ট্রেনিং",
    ],
  },
];

// বিস্তারিত তুলনামূলক ফিচার টেবিল
const COMPARISON_CATEGORIES = [
  {
    name: "শিক্ষার্থী ও ভর্তি ব্যবস্থাপনা",
    features: [
      {
        title: "সর্বোচ্চ ছাত্র সংখ্যা সীমা",
        basic: "২০০ ছাত্র",
        standard: "৭০০ ছাত্র",
        premium: "আনলিমিটেড",
      },
      {
        title: "ডিজিটাল স্টুডেন্ট প্রোফাইল ও ডাটাবেজ",
        basic: true,
        standard: true,
        premium: true,
      },
      {
        title: "অনলাইন ভর্তি আবেদন ফরম ও অনুমোদন",
        basic: true,
        standard: true,
        premium: true,
      },
      {
        title: "শিক্ষার্থী ডিজিটাল আইডি কার্ড তৈরি",
        basic: "বেসিক",
        standard: "অটো জেনারেটেড",
        premium: "কাস্টমাইজড + কিউআর",
      },
      {
        title: "প্রশংসাপত্র ও চারিত্রিক সনদপত্র",
        basic: false,
        standard: true,
        premium: true,
      },
    ],
  },
  {
    name: "তালিমাত ও একাডেমিক",
    features: [
      {
        title: "শিক্ষক ও স্টাফ ইউজার একাউন্ট",
        basic: "৫ জন",
        standard: "১৫ জন",
        premium: "আনলিমিটেড",
      },
      {
        title: "শ্রেণী ও সেকশন ভিত্তিক ক্লাস রুটিন",
        basic: true,
        standard: true,
        premium: true,
      },
      {
        title: "দৈনিক হাজিরা ট্র্যাকিং ও অনুপস্থিতি রিপোর্ট",
        basic: true,
        standard: true,
        premium: true,
      },
      {
        title: "প্রতিদিনের হোমওয়ার্ক ও ডায়েরি প্রদান",
        basic: true,
        standard: true,
        premium: true,
      },
      {
        title: "পরীক্ষার রুটিন ও সিট প্ল্যানিং",
        basic: "বেসিক",
        standard: true,
        premium: true,
      },
      {
        title: "পরীক্ষার প্রবেশপত্র (Admit Card) প্রিন্ট",
        basic: false,
        standard: true,
        premium: true,
      },
      {
        title: "স্বয়ংক্রিয় মার্কশিট ও রেজাল্ট প্রসেসিং",
        basic: "সাধারণ",
        standard: "অটোমেটিক",
        premium: "সম্পূর্ণ কাস্টমাইজড",
      },
      {
        title: "মেধা তালিকা (Tabulation Sheet) প্রিন্ট",
        basic: false,
        standard: true,
        premium: true,
      },
    ],
  },
  {
    name: "হিসাব, ফি ও বেতন ব্যবস্থাপনা",
    features: [
      {
        title: "মাসিক ফি কালেকশন ও ডিজিটাল রসিদ",
        basic: true,
        standard: true,
        premium: true,
      },
      {
        title: "বকেয়া ফি ট্র্যাকিং ও তালিকা",
        basic: true,
        standard: true,
        premium: true,
      },
      {
        title: "শিক্ষক-কর্মচারীদের মাসিক বেতন ও পে-রোল",
        basic: false,
        standard: "বেসিক",
        premium: "পূর্ণাঙ্গ অটোমেশন",
      },
      {
        title: "দান, সদকা ও লিল্লাহ ফান্ডের রসিদ",
        basic: false,
        standard: true,
        premium: true,
      },
      {
        title: "দৈনিক ক্যাশবুক ও আয়-ব্যয় ভাউচার",
        basic: "বেসিক",
        standard: true,
        premium: true,
      },
      {
        title: "বাৎসরিক অডিট ও আর্থিক স্টেটমেন্ট এক্সপোর্ট",
        basic: false,
        standard: true,
        premium: true,
      },
    ],
  },
  {
    name: "যোগাযোগ, এসএমএস ও নিরাপত্তা",
    features: [
      {
        title: "ফ্রি রেজিস্ট্রেশন এসএমএস কোটা",
        basic: "৫০০ টি",
        standard: "২,০০০ টি",
        premium: "১০,০০০ টি",
      },
      {
        title: "বাংলা ভাষায় ডায়নামিক বাল্ক এসএমএস",
        basic: true,
        standard: true,
        premium: true,
      },
      {
        title: "ডিজিটাল নোটিশ বোর্ড ও ঘোষণা",
        basic: true,
        standard: true,
        premium: true,
      },
      {
        title: "অভিভাবকদের জন্য স্বতন্ত্র পোর্টাল এক্সেস",
        basic: false,
        standard: true,
        premium: true,
      },
      {
        title: "ক্লাউড ডেটাবেজ ও দৈনিক অটো ব্যাকআপ",
        basic: true,
        standard: true,
        premium: true,
      },
      {
        title: "নিজস্ব কাস্টম ডোমেইন কানেকশন",
        basic: false,
        standard: false,
        premium: "✓ বিনামূল্যে সেটআপ",
      },
      {
        title: "টেকনিক্যাল সাপোর্ট ও হেল্পডেস্ক",
        basic: "ইমেইল সাপোর্ট",
        standard: "ফোন ও হোয়াটসঅ্যাপ",
        premium: "২৪/৭ ডেডিকেটেড ম্যানেজার",
      },
    ],
  },
];

// সাধারণ প্রশ্ন ও উত্তর (FAQs)
const FAQ_LIST = [
  {
    question: "প্যাকেজ সাবস্ক্রিপশন নিলে কি তাৎক্ষণিক চালু হয়ে যাবে?",
    answer:
      "হ্যাঁ! আপনার আবেদন পাওয়ার সাথে সাথে আমাদের কারিগরি টিম আপনার মাদ্রাসার নামে নিজস্ব পোর্টাল ও অ্যাকাউন্ট তৈরি করে দেবে এবং সর্বোচ্চ ২ থেকে ৩ ঘণ্টার মধ্যে পুরো সিস্টেম আপনার ব্যবহারে প্রস্তুত হয়ে যাবে।",
  },
  {
    question: "আমরা কি যেকোনো সময় প্যাকেজ পরিবর্তন বা আপগ্রেড করতে পারব?",
    answer:
      "অবশ্যই। আপনার মাদ্রাসায় ছাত্র সংখ্যা বৃদ্ধি পেলে বা অতিরিক্ত ফিচারের প্রয়োজন হলে আপনি যেকোনো সময় বেসিক থেকে স্ট্যান্ডার্ড বা প্রিমিয়ামে আপগ্রেড করতে পারবেন। আপনার পূর্বের সমস্ত ডেটা সম্পূর্ণ অক্ষুণ্ণ থাকবে।",
  },
  {
    question: "আমাদের মাদ্রাসার ডেটা ও তথ্য কতটা নিরাপদ?",
    answer:
      "আমরা ব্যাংক-গ্রেড SSL এনক্রিপশন ও বিশ্বস্ত ক্লাউড সার্ভার ব্যবহার করি। প্রতিদিন স্বয়ংক্রিয়ভাবে ক্লাউড ব্যাকআপ তৈরি হয়, তাই ডেটা হারানোর কোনো সম্ভাবনা নেই। আপনার মাদ্রাসার তথ্য কেবল আপনার নির্ধারিত ইউজাররাই দেখতে পাবেন।",
  },
  {
    question: "পেমেন্ট কীভাবে পরিশোধ করা যায়?",
    answer:
      "আপনি বিকাশ, নগদ, রকেট, উপায় অথবা যেকোনো ব্যাংক অ্যাকাউন্ট/কার্ডের মাধ্যমে খুব সহজেই মাসিক বা বাৎসরিক ফি পরিশোধ করতে পারবেন। প্রতি পেমেন্টের বিপরীতে স্বয়ংক্রিয় ভ্যাটযুক্ত মানি রিসিট পাবেন।",
  },
  {
    question: "আমাদের স্টাফ বা শিক্ষকদের কি সফটওয়্যার ব্যবহারের ট্রেনিং দেওয়া হবে?",
    answer:
      "হ্যাঁ! আমাদের স্পেশাল অনবোর্ডিং টিম আপনার মুহতামিম, নাজেমে তালিমাত ও হিসাবরক্ষককে ভিডিও কলের মাধ্যমে স্ক্রিন শেয়ার করে সহজ ভাষায় হাতে-কলমে প্রশিক্ষণ দিয়ে দেবে। এছাড়াও রয়েছে বাংলায় সম্পূর্ণ ভিডিও টিউটোরিয়াল গাইড।",
  },
  {
    question: "আমাদের মাদ্রাসা যদি অনেক বড় হয় বা একাধিক শাখা থাকে?",
    answer:
      "সেক্ষেত্রে আমাদের 'কাস্টম / এন্টারপ্রাইজ' প্ল্যান আপনার জন্য আদর্শ। সেন্ট্রালাইজড ম্যানেজমেন্টের মাধ্যমে একটি সিঙ্গেল ড্যাশবোর্ড থেকে আপনার সকল ব্রাঞ্চের হিসাব ও ছাত্র ট্র্যাকিং করতে পারবেন।",
  },
];

const PackageDetails = () => {
  const [billingCycle, setBillingCycle] = useState("monthly"); // "monthly" | "yearly"
  const [selectedStudentFilter, setSelectedStudentFilter] = useState("all");
  const [expandedFaq, setExpandedFaq] = useState(0);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedPlan, setSelectedPlan] = useState(null);

  const handleOpenSubscription = (pkg) => {
    setSelectedPlan({
      name: pkg.name,
      priceMonthly: `${pkg.monthlyPrice} /মাস`,
      priceYearly: `${pkg.yearlyPrice} /মাস`,
      features: pkg.highlights,
    });
    setIsModalOpen(true);
  };

  const handleOpenCustom = () => {
    setSelectedPlan({
      name: "কাস্টম / এন্টারপ্রাইজ প্যাকেজ",
      priceMonthly: "আলোচনা সাপেক্ষে",
      priceYearly: "আলোচনা সাপেক্ষে",
      features: ["মাল্টি-ব্রাঞ্চ সাপোর্ট", "কাস্টম ফিচার", "ডেডিকেটেড ক্লাউড সার্ভার"],
    });
    setIsModalOpen(true);
  };

  const renderCellContent = (val) => {
    if (val === true) {
      return (
        <span className="inline-flex items-center justify-center w-6 h-6 rounded-full bg-emerald-100 text-[#1C7D5A]">
          <Check className="w-4 h-4 stroke-[2.5]" />
        </span>
      );
    }
    if (val === false) {
      return (
        <span className="inline-flex items-center justify-center w-6 h-6 rounded-full bg-slate-100 text-slate-400">
          <CrossIcon className="w-3.5 h-3.5 stroke-[2]" />
        </span>
      );
    }
    return <span className="text-xs sm:text-sm font-semibold text-slate-700">{val}</span>;
  };

  return (
    <div className="min-h-screen bg-[#fafcfb] text-slate-800 font-bangla antialiased selection:bg-emerald-500 selection:text-white">
      {/* Header / Navbar */}
      <Nabver />

      {/* ====== HERO BANNER ====== */}
      <section className="relative pt-16 pb-8  bg-gradient-to-b from-[#f0f7f3] via-[#fafcfb] to-white   overflow-hidden">
        <div className="absolute inset-0 pointer-events-none select-none">
          <div className="absolute top-0 right-1/4 w-[500px] h-[300px] bg-emerald-400/10 rounded-full blur-3xl" />
          <div className="absolute bottom-0 left-1/4 w-[400px] h-[250px] bg-amber-400/10 rounded-full blur-3xl" />
        </div>

        <div className="relative z-10 max-w-7xl mx-auto  text-center">


          {/* Top Pill Badge */}
          <div className="inline-flex items-center gap-1.5 px-4 py-1 rounded-full border border-emerald-200 bg-white text-xs sm:text-sm font-semibold text-[#1C7D5A] shadow-2xs mb-4">
            <Award className="w-4 h-4 text-emerald-600" />
            <span>স্বচ্ছ ও সাশ্রয়ী মূল্যতালিকা</span>
          </div>

          {/* Main Title */}
          <h1 className="text-3xl sm:text-4xl lg:text-5xl font-black text-slate-900 tracking-tight leading-[1.25] mb-4 max-w-4xl mx-auto">
            আপনার মাদ্রাসার জন্য   <span className="text-[#1C7D5A]">পূর্ণাঙ্গ প্যাকেজ</span>
          </h1>

          {/* Subtitle */}
          <p className="text-slate-600 text-sm sm:text-base lg:text-lg max-w-2xl mx-auto font-normal leading-relaxed mb-8">
            কোনো প্রকার লুক্কায়িত চার্জ নেই। আপনার মাদ্রাসার বর্তমান শিক্ষার্থী সংখ্যা ও প্রয়োজনীয়তা অনুযায়ী সেরা প্যাকেজটি বেছে নিন। যেকোনো সময় আপগ্রেড করা সম্ভব।
          </p>

          {/* Monthly / Yearly Toggle */}
          <div className="inline-flex items-center p-1.5 bg-white rounded-full border border-slate-200  mb-6">
            <button
              type="button"
              onClick={() => setBillingCycle("monthly")}
              className={`px-6 py-2 rounded-full text-xs sm:text-sm font-bold transition-all duration-200 cursor-pointer ${billingCycle === "monthly"
                ? "bg-[#1C7D5A] text-white shadow-xs"
                : "text-slate-600 hover:text-slate-900"
                }`}
            >
              মাসিক বিলিং
            </button>
            <button
              type="button"
              onClick={() => setBillingCycle("yearly")}
              className={`px-5 sm:px-6 py-2 rounded-full text-xs sm:text-sm font-bold transition-all duration-200 flex items-center gap-2 cursor-pointer ${billingCycle === "yearly"
                ? "bg-[#1C7D5A] text-white shadow-xs"
                : "text-slate-600 hover:text-slate-900"
                }`}
            >
              <span>বার্ষিক বিলিং</span>
              <span
                className={`text-[11px] font-extrabold px-2 py-0.5 rounded-full ${billingCycle === "yearly"
                  ? "bg-amber-300 text-slate-900"
                  : "bg-emerald-100 text-[#1C7D5A]"
                  }`}
              >
                ১৭% ছাড়
              </span>
            </button>
          </div>


        </div>
      </section>

      {/* ====== 3 CARDS SECTION ====== */}
      <section className="py-8 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-7 sm:gap-8 items-stretch">
          {DETAILED_PACKAGES.map((pkg) => {
            const IconComponent = pkg.icon;
            const currentPrice =
              billingCycle === "yearly" ? pkg.yearlyPrice : pkg.monthlyPrice;
            const isFilterActive =
              selectedStudentFilter === "all" || selectedStudentFilter === pkg.id;

            return (
              <div
                key={pkg.id}
                className={`relative bg-white rounded-2xl p-7 sm:p-8 flex flex-col justify-between transition-all duration-300 ${pkg.isPopular
                  ? "border-2 border-[#1C7D5A] shadow-[0_12px_40px_-6px_rgba(28,125,90,0.18)] -translate-y-1 sm:-translate-y-2 ring-4 ring-emerald-50"
                  : "border border-slate-200/90 shadow-[0_4px_20px_-4px_rgba(0,0,0,0.04)] hover:shadow-xl hover:border-slate-300"
                  } ${!isFilterActive ? "opacity-50 scale-98" : "opacity-100"}`}
              >
                {/* সবচেয়ে জনপ্রিয় ব্যাজ */}
                {pkg.isPopular && (
                  <div className="absolute -top-3.5 left-1/2 -translate-x-1/2 bg-[#f59e0b] text-slate-950 font-bold text-xs px-4 py-1 rounded-full shadow-md whitespace-nowrap tracking-wide flex items-center gap-1">
                    <Sparkles className="w-3.5 h-3.5" />
                    <span>{pkg.badgeText}</span>
                  </div>
                )}

                <div>
                  {/* আইকন ও শিরোনাম */}
                  <div className="flex items-center justify-between mb-4">
                    <div className="w-12 h-12 rounded-xl bg-[#fdf8ec] flex items-center justify-center text-[#d97706] shadow-2xs">
                      <IconComponent className="w-6 h-6 stroke-[2.2]" />
                    </div>
                    <span className="text-xs font-semibold text-slate-500 bg-slate-100 px-2.5 py-1 rounded-full">
                      {pkg.studentLimitText}
                    </span>
                  </div>

                  <h3 className="text-2xl font-black text-slate-900 mb-1">
                    {pkg.name}
                  </h3>
                  <p className="text-slate-500 text-xs sm:text-sm font-normal mb-4">
                    {pkg.subtitle}
                  </p>

                  <p className="text-slate-600 text-xs leading-relaxed mb-5 min-h-[36px]">
                    {pkg.description}
                  </p>

                  {/* মূল্য বক্স */}
                  <div className="bg-[#f8faf9] rounded-xl p-4 border border-slate-100 mb-6">
                    <div className="flex items-baseline gap-1">
                      <span className="text-3xl sm:text-4xl font-black text-[#1C7D5A] tracking-tight">
                        {currentPrice}
                      </span>
                      <span className="text-xs sm:text-sm text-slate-500 font-normal">
                        /মাস
                      </span>
                    </div>
                    {billingCycle === "yearly" ? (
                      <p className="text-xs text-emerald-700 font-semibold mt-1">
                        বিল্ড {pkg.yearlyBilled} (১৭% সাশ্রয়ী)
                      </p>
                    ) : (
                      <p className="text-xs text-slate-400 mt-1">
                        মাসিক ভিত্তিক বিলিং
                      </p>
                    )}
                  </div>

                  {/* সাবস্ক্রিপশন বাটন */}
                  <button
                    type="button"
                    onClick={() => handleOpenSubscription(pkg)}
                    className={`w-full py-3 px-4 rounded-xl text-sm font-bold transition-all duration-200 cursor-pointer flex items-center justify-center gap-2 mb-6 ${pkg.isPopular
                      ? "bg-[#1C7D5A] hover:bg-[#156346] text-white shadow-md shadow-emerald-800/20 active:scale-98"
                      : "bg-slate-100 hover:bg-slate-200 text-slate-800 border border-slate-200 active:scale-98"
                      }`}
                  >
                    <span>সাবস্ক্রিপশন কিনুন</span>
                    <ArrowRight className="w-4 h-4" />
                  </button>

                  {/* ফিচার হাইলাইটস */}
                  <div className="space-y-3 pt-2 border-t border-slate-100">
                    <p className="text-[11px] font-bold text-slate-400 uppercase tracking-wider">
                      প্যাকেজে অন্তর্ভুক্ত রয়েছে:
                    </p>
                    {pkg.highlights.map((feat, idx) => (
                      <div
                        key={idx}
                        className="flex items-start gap-2.5 text-xs sm:text-sm text-slate-700 font-medium"
                      >
                        <Check className="w-4 h-4 text-[#1C7D5A] stroke-[2.5] shrink-0 mt-0.5" />
                        <span>{feat}</span>
                      </div>
                    ))}
                  </div>
                </div>

                <div className="mt-6 pt-4 border-t border-slate-100 text-center">
                  <a
                    href="#comparison"
                    className="text-xs font-semibold text-slate-500 hover:text-[#1C7D5A] transition-colors"
                  >
                    বিস্তারিত ফিচার তালিকা দেখুন ↓
                  </a>
                </div>
              </div>
            );
          })}
        </div>
      </section>

      {/* ====== FEATURE COMPARISON TABLE ====== */}
      <section id="comparison" className="py-16 sm:py-20 bg-white border-y border-slate-200/80">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-2xl mx-auto mb-12">
            <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-emerald-50 text-[#1C7D5A] text-xs font-bold mb-3">
              <Zap className="w-3.5 h-3.5" />
              <span>বিস্তারিত তুলনামূলক চার্ট</span>
            </div>
            <h2 className="text-2xl sm:text-3xl lg:text-4xl font-black text-slate-900 tracking-tight">
              প্যাকেজগুলোর সকল ফিচারের তুলনা
            </h2>
            <p className="text-slate-500 text-sm mt-2">
              প্রতিটি মডিউলের বিস্তারিত সক্ষমতা এক নজরে দেখে নিন
            </p>
          </div>

          {/* টেবিল কনটেইনার */}
          <div className="overflow-x-auto rounded-2xl border border-slate-200 shadow-xs bg-white">
            <table className="w-full border-collapse text-left">
              <thead>
                <tr className="bg-[#f8faf9] border-b border-slate-200 text-slate-900">
                  <th className="py-5 px-6 font-black text-base sm:text-lg w-2/5">
                    মডিউল ও ফিচারসমূহ
                  </th>
                  <th className="py-5 px-4 font-black text-center text-sm sm:text-base w-1/5">
                    <span className="block text-slate-900">বেসিক</span>
                    <span className="text-xs font-normal text-slate-500">
                      {billingCycle === "yearly" ? "৳৪১৫/মাস" : "৳৫০০/মাস"}
                    </span>
                  </th>
                  <th className="py-5 px-4 font-black text-center text-sm sm:text-base bg-emerald-50/70 border-x border-emerald-200 text-[#1C7D5A] w-1/5 relative">
                    <span className="inline-block bg-[#1C7D5A] text-white text-[10px] font-bold px-2 py-0.5 rounded-full mb-1">
                      জনপ্রিয়
                    </span>
                    <span className="block font-black">স্ট্যান্ডার্ড</span>
                    <span className="text-xs font-normal text-emerald-800">
                      {billingCycle === "yearly" ? "৳৫৮০/মাস" : "৳৭০০/মাস"}
                    </span>
                  </th>
                  <th className="py-5 px-4 font-black text-center text-sm sm:text-base w-1/5">
                    <span className="block text-slate-900">প্রিমিয়াম</span>
                    <span className="text-xs font-normal text-slate-500">
                      {billingCycle === "yearly" ? "৳৮৩০/মাস" : "৳১,০০০/মাস"}
                    </span>
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {COMPARISON_CATEGORIES.map((category, catIdx) => (
                  <React.Fragment key={catIdx}>
                    {/* Category Title Row */}
                    <tr className="bg-slate-100/70">
                      <td
                        colSpan={4}
                        className="py-3 px-6 text-xs sm:text-sm font-extrabold text-slate-700 tracking-wider uppercase"
                      >
                        {category.name}
                      </td>
                    </tr>

                    {/* Features under category */}
                    {category.features.map((item, fIdx) => (
                      <tr
                        key={fIdx}
                        className="hover:bg-slate-50/80 transition-colors"
                      >
                        <td className="py-3.5 px-6 text-xs sm:text-sm font-medium text-slate-700">
                          {item.title}
                        </td>
                        <td className="py-3.5 px-4 text-center">
                          {renderCellContent(item.basic)}
                        </td>
                        <td className="py-3.5 px-4 text-center bg-emerald-50/40 border-x border-emerald-100">
                          {renderCellContent(item.standard)}
                        </td>
                        <td className="py-3.5 px-4 text-center">
                          {renderCellContent(item.premium)}
                        </td>
                      </tr>
                    ))}
                  </React.Fragment>
                ))}

                {/* Bottom CTA Row inside Table */}
                <tr className="bg-slate-50">
                  <td className="py-5 px-6 font-bold text-slate-700 text-sm">
                    প্যাকেজ নির্বাচন করুন
                  </td>
                  <td className="py-5 px-4 text-center">
                    <button
                      type="button"
                      onClick={() => handleOpenSubscription(DETAILED_PACKAGES[0])}
                      className="px-4 py-2 rounded-lg bg-white border border-slate-300 text-slate-700 text-xs font-bold hover:bg-slate-100 transition-all cursor-pointer"
                    >
                      বেসিক নিন
                    </button>
                  </td>
                  <td className="py-5 px-4 text-center bg-emerald-50/70 border-x border-emerald-200">
                    <button
                      type="button"
                      onClick={() => handleOpenSubscription(DETAILED_PACKAGES[1])}
                      className="px-4 py-2 rounded-lg bg-[#1C7D5A] text-white text-xs font-bold hover:bg-[#156346] shadow-sm transition-all cursor-pointer"
                    >
                      স্ট্যান্ডার্ড নিন
                    </button>
                  </td>
                  <td className="py-5 px-4 text-center">
                    <button
                      type="button"
                      onClick={() => handleOpenSubscription(DETAILED_PACKAGES[2])}
                      className="px-4 py-2 rounded-lg bg-white border border-slate-300 text-slate-700 text-xs font-bold hover:bg-slate-100 transition-all cursor-pointer"
                    >
                      প্রিমিয়াম নিন
                    </button>
                  </td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>
      </section>

      {/* ====== ENTERPRISE / CUSTOM PACKAGE CALLOUT ====== */}
      <section className="py-14 sm:py-16 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="bg-gradient-to-r from-slate-900 via-slate-800 to-[#0e4e37] rounded-3xl p-8 sm:p-12 text-white relative overflow-hidden shadow-2xl">
          <div className="absolute right-0 top-0 w-96 h-96 bg-emerald-500/10 rounded-full blur-3xl pointer-events-none" />

          <div className="relative z-10 flex flex-col lg:flex-row lg:items-center justify-between gap-8">
            <div className="max-w-2xl">
              <span className="bg-emerald-500/20 text-emerald-300 border border-emerald-400/30 text-xs font-bold px-3 py-1 rounded-full uppercase tracking-wider mb-3 inline-block">
                বড় মাদ্রাসা বা মাদ্রাসা বোর্ডের জন্য
              </span>
              <h3 className="text-2xl sm:text-3xl lg:text-4xl font-black mb-3">
                কাস্টম এন্টারপ্রাইজ সমাধান প্রয়োজন?
              </h3>
              <p className="text-slate-300 text-sm sm:text-base leading-relaxed mb-4">
                আপনার যদি একাধিক মাদ্রাসা শাখা থাকে, বিশেষ কাস্টম মডিউল বা নিজস্ব সার্ভারে ডেটাবেজ হোস্ট করতে চান—আমাদের বিশেষজ্ঞ ইঞ্জিনিয়ারিং টিম আপনার জন্য সম্পূর্ণ কাস্টমাইজড সফটওয়্যার সলিউশন প্রদান করবে।
              </p>
              <div className="flex flex-wrap gap-4 text-xs text-slate-300">
                <span className="flex items-center gap-1.5">
                  <CheckCircle2 className="w-4 h-4 text-emerald-400" /> মাল্টি-ব্রাঞ্চ সেন্ট্রাল কন্ট্রোল
                </span>
                <span className="flex items-center gap-1.5">
                  <CheckCircle2 className="w-4 h-4 text-emerald-400" /> ডেডিকেটেড ক্লাউড ব্যাকআপ
                </span>
                <span className="flex items-center gap-1.5">
                  <CheckCircle2 className="w-4 h-4 text-emerald-400" /> কাস্টম এপিআই ও এসএমএস গেটওয়ে
                </span>
              </div>
            </div>

            <div className="flex flex-col sm:flex-row lg:flex-col gap-3 shrink-0">
              <button
                type="button"
                onClick={handleOpenCustom}
                className="bg-[#1C7D5A] hover:bg-[#156346] text-white font-bold py-3.5 px-6 rounded-xl shadow-lg shadow-emerald-900/40 text-sm flex items-center justify-center gap-2 transition-all cursor-pointer"
              >
                <span>কাস্টম কোটেশন চান</span>
                <ArrowRight className="w-4 h-4" />
              </button>

              <a
                href={`https://wa.me/${OFFICIAL_WHATSAPP_NUMBER}?text=${encodeURIComponent(
                  "আসসালামু আলাইকুম। আমি বড় মাদ্রাসা / এন্টারপ্রাইজ কাস্টম সলিউশন সম্পর্কে বিস্তারিত আলোচনা করতে আগ্রহী।"
                )}`}
                target="_blank"
                rel="noreferrer"
                className="bg-white/10 hover:bg-white/20 border border-white/20 text-white font-semibold py-3.5 px-6 rounded-xl text-sm flex items-center justify-center gap-2 transition-all"
              >
                <MessageCircle className="w-4 h-4 text-emerald-400" />
                <span>হোয়াটসঅ্যাপে আলোচনা</span>
              </a>
            </div>
          </div>
        </div>
      </section>

      {/* ====== FAQ ACCORDION ====== */}
      <section className="py-14 sm:py-20 bg-[#f8faf9] border-t border-slate-200/80">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <span className="bg-white border border-slate-200 text-slate-600 text-xs font-semibold px-3 py-1 rounded-full mb-3 inline-block">
              সাধারণ জিজ্ঞাসা (FAQ)
            </span>
            <h2 className="text-2xl sm:text-3xl font-black text-slate-900">
              প্যাকেজ ও পেমেন্ট সম্পর্কিত প্রশ্নাবলী
            </h2>
            <p className="text-slate-500 text-sm mt-2">
              আপনার মনের সাধারণ প্রশ্নগুলোর উত্তর পেয়ে যাবেন এখানে
            </p>
          </div>

          <div className="space-y-3">
            {FAQ_LIST.map((faq, idx) => {
              const isOpen = expandedFaq === idx;
              return (
                <div
                  key={idx}
                  className="bg-white rounded-2xl border border-slate-200/90 shadow-2xs overflow-hidden transition-all duration-200"
                >
                  <button
                    type="button"
                    onClick={() => setExpandedFaq(isOpen ? null : idx)}
                    className="w-full p-5 text-left flex items-center justify-between gap-4 font-bold text-slate-800 hover:text-[#1C7D5A] transition-colors cursor-pointer"
                  >
                    <span className="text-sm sm:text-base">{faq.question}</span>
                    <span className="w-7 h-7 rounded-full bg-slate-100 flex items-center justify-center text-slate-500 shrink-0">
                      {isOpen ? (
                        <ChevronUp className="w-4 h-4" />
                      ) : (
                        <ChevronDown className="w-4 h-4" />
                      )}
                    </span>
                  </button>
                  {isOpen && (
                    <div className="px-5 pb-5 text-slate-600 text-xs sm:text-sm leading-relaxed border-t border-slate-100 pt-3">
                      {faq.answer}
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* ====== FOOTER CTA ====== */}
      <section className="py-12 bg-white border-t border-slate-200 text-center">
        <div className="max-w-3xl mx-auto px-4">
          <h3 className="text-xl sm:text-2xl font-black text-slate-900 mb-2">
            এখনও সিদ্ধান্ত নিতে পারছেন না?
          </h3>
          <p className="text-slate-500 text-sm mb-6">
            আমাদের কাস্টমার কেয়ার টিম আপনার মাদ্রাসার জন্য সঠিক প্ল্যান নির্বাচনে সম্পূর্ণ বিনামূল্যে পরামর্শ দেবে।
          </p>
          <div className="flex flex-wrap items-center justify-center gap-4">
            <Link
              to="/free-demo"
              className="bg-[#1C7D5A] hover:bg-[#156346] text-white font-bold py-2.5 px-6 rounded-xl text-sm shadow-md transition-all"
            >
              ফ্রি লাইভ ডেমো দেখুন
            </Link>
            <a
              href="tel:+8801986544021"
              className="bg-slate-100 hover:bg-slate-200 text-slate-800 font-bold py-2.5 px-6 rounded-xl text-sm flex items-center gap-2 transition-all"
            >
              <PhoneCall className="w-4 h-4 text-[#1C7D5A]" />
              <span>কল করুন: 01986-544021</span>
            </a>
          </div>
        </div>
      </section>

      {/* সাবস্ক্রিপশন মডাল */}
      <SubscriptionModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        selectedPlan={selectedPlan}
        billingCycle={billingCycle}
      />
    </div>
  );
};

export default PackageDetails;