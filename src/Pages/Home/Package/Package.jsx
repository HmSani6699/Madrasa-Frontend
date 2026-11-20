import React, { useState } from "react";
import { Link } from "react-router-dom";
import {
  Rocket,
  Sparkles,
  Crown,
  Check,
  ArrowRight,
  PhoneCall,
  MessageSquare,
} from "lucide-react";
import SubscriptionModal from "../../../components/SubscriptionModal";

// প্যাকেজ ডেটা (স্ক্রিনশটের সাথে হুবহু মিল রেখে তৈরি)
const PACKAGES_DATA = [
  {
    id: "basic",
    name: "বেসিক",
    subtitle: "ছোট প্রতিষ্ঠানের জন্য",
    monthlyPrice: "৯৫০",
    yearlyPrice: "৳৪১৫",
    yearlyBilled: "৳৪,৯৮০/বছর",
    icon: Rocket,
    isPopular: false,
    features: [
      "১00 ছাত্র",
      "৫ ইউজার",
      "বেসিক রিপোর্ট",
      "ইমেইল সাপোর্ট",
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
    isPopular: true,
    badgeText: "সবচেয়ে জনপ্রিয়",
    features: [
      "৭০০ ছাত্র",
      "১৫ ইউজার",
      "এসএমএস ২,০০০",
      "এডভান্সড রিপোর্ট",
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
    isPopular: false,
    features: [
      "আনলিমিটেড ছাত্র",
      "আনলিমিটেড ইউজার",
      "এসএমএস ১০,০০০",
      "কাস্টম ডোমেইন",
      "ডেডিকেটেড সাপোর্ট",
    ],
  },
];

const Package = () => {
  const [billingCycle, setBillingCycle] = useState("monthly"); // "monthly" | "yearly"
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedPlan, setSelectedPlan] = useState(null);

  const handleOpenSubscription = (pkg) => {
    setSelectedPlan({
      name: pkg.name,
      priceMonthly: `${pkg.monthlyPrice} /মাস`,
      priceYearly: `${pkg.yearlyPrice} /মাস`,
      features: pkg.features,
    });
    setIsModalOpen(true);
  };

  const handleOpenCustom = () => {
    setSelectedPlan({
      name: "কাস্টম / এন্টারপ্রাইজ",
      priceMonthly: "আলোচনা সাপেক্ষে",
      priceYearly: "আলোচনা সাপেক্ষে",
      features: ["আপনার চাহিদা অনুযায়ী সম্পূর্ণ কাস্টমাইজড"],
    });
    setIsModalOpen(true);
  };

  return (
    <section id="pricing" className="relative py-16 sm:py-20 lg:py-24 bg-white text-slate-800 font-bangla overflow-hidden">
      {/* ব্যাকগ্রাউন্ড সফট আভা */}
      <div className="absolute inset-0 pointer-events-none select-none overflow-hidden">
        <div className="absolute top-1/3 left-1/2 -translate-x-1/2 w-[700px] h-[350px] bg-emerald-500/5 rounded-full blur-3xl" />
      </div>

      <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* ====== হেডার সেকশন ====== */}
        <div className="text-center max-w-2xl mx-auto mb-10 sm:mb-12">
          {/* টপ পিল ব্যাজ */}
          <div className="inline-flex items-center justify-center px-4 py-1 rounded-full border border-slate-200/90 bg-[#f8faf9] text-xs sm:text-sm font-medium text-slate-600 shadow-2xs mb-3">
            প্যাকেজ ও মূল্য
          </div>

          {/* প্রধান শিরোনাম */}
          <h2 className="text-3xl sm:text-4xl lg:text-[2.65rem] font-black text-slate-900 tracking-tight leading-[1.3] mb-3">
            আপনার জন্য <span className="text-[#1C7D5A]">সঠিক প্যাকেজ</span>
          </h2>

          {/* সাবটাইটেল */}
          <p className="text-slate-500 text-sm sm:text-base font-normal">
            স্বচ্ছ মূল্য, কোনো লুক্কায়িত চার্জ নেই। যেকোনো সময় বদলান।
          </p>

          {/* মাসিক / বার্ষিক টগল বাটন */}
          <div className="mt-6 inline-flex items-center p-1 bg-slate-100/90 rounded-full border border-slate-200/80 shadow-2xs">
            <button
              type="button"
              onClick={() => setBillingCycle("monthly")}
              className={`px-5 py-1.5 rounded-full text-xs sm:text-sm font-semibold transition-all duration-200 cursor-pointer ${billingCycle === "monthly"
                ? "bg-white text-slate-900 shadow-xs"
                : "text-slate-600 hover:text-slate-900"
                }`}
            >
              মাসিক
            </button>
            <button
              type="button"
              onClick={() => setBillingCycle("yearly")}
              className={`px-4 sm:px-5 py-1.5 rounded-full text-xs sm:text-sm font-semibold transition-all duration-200 flex items-center gap-1.5 cursor-pointer ${billingCycle === "yearly"
                ? "bg-white text-[#1C7D5A] shadow-xs"
                : "text-slate-600 hover:text-slate-900"
                }`}
            >
              <span>বার্ষিক</span>
              <span className="bg-[#e8f6f0] text-[#1C7D5A] text-[11px] font-bold px-2 py-0.5 rounded-full">
                -১৭%
              </span>
            </button>
          </div>
        </div>

        {/* ====== প্যাকেজ কার্ডস গ্রিড (৩ কলাম) ====== */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-7 lg:gap-8 items-stretch pt-4">
          {PACKAGES_DATA.map((pkg) => {
            const IconComponent = pkg.icon;
            const currentPrice =
              billingCycle === "yearly" ? pkg.yearlyPrice : pkg.monthlyPrice;

            return (
              <div
                key={pkg.id}
                className={`relative bg-white rounded-[16px] p-7 sm:p-8 flex flex-col justify-between transition-all duration-300 ${pkg.isPopular
                  ? "border-2 border-[#1C7D5A] shadow-[0_12px_36px_-6px_rgba(28,125,90,0.12)] -translate-y-1 lg:-translate-y-2"
                  : "border border-slate-200/80 shadow-[0_2px_15px_-3px_rgba(0,0,0,0.03)] hover:shadow-xl hover:border-slate-300"
                  }`}
              >
                {/* সবচেয়ে জনপ্রিয় ব্যাজ */}
                {pkg.isPopular && (
                  <div className="absolute -top-3.5 left-1/2 -translate-x-1/2 bg-[#f59e0b] text-slate-950 font-bold text-xs px-4 py-0.5 rounded-full shadow-xs whitespace-nowrap tracking-wide">
                    {pkg.badgeText}
                  </div>
                )}

                <div>
                  {/* আইকন বক্স (হলুদ/অ্যাম্বার ব্যাকগ্রাউন্ডে নরম সফট লুক) */}
                  <div className="w-11 h-11 rounded-xl bg-[#fdf8ec] flex items-center justify-center text-[#d97706] mb-5 shadow-2xs">
                    <IconComponent className="w-5 h-5 stroke-[2.2]" />
                  </div>

                  {/* প্যাকেজের নাম */}
                  <h3 className="text-xl sm:text-2xl font-black text-slate-900 mb-1">
                    {pkg.name}
                  </h3>

                  {/* ছোট প্রতিষ্ঠানের জন্য / বিবরণ */}
                  <p className="text-slate-500 text-xs sm:text-sm font-normal mb-5">
                    {pkg.subtitle}
                  </p>

                  {/* মূল্য সেকশন */}
                  <div className="mb-6 flex items-baseline gap-1">
                    <span className="text-3xl sm:text-4xl font-black text-[#1C7D5A] tracking-tight">
                      {currentPrice}
                    </span>
                    <span className="text-xs sm:text-sm text-slate-500 font-normal">
                      /মাস
                    </span>
                    {billingCycle === "yearly" && (
                      <span className="ml-2 text-[11px] text-emerald-700 bg-emerald-50 font-medium px-2 py-0.5 rounded-md">
                        বিল্ড {pkg.yearlyBilled}
                      </span>
                    )}
                  </div>

                  {/* সাবস্ক্রিপশন কিনুন বাটন */}
                  <button
                    type="button"
                    onClick={() => handleOpenSubscription(pkg)}
                    className={`w-full py-2.5 sm:py-3 px-4 rounded-xl text-sm font-bold transition-all duration-200 cursor-pointer flex items-center justify-center gap-1.5 mb-7 ${pkg.isPopular
                      ? "bg-[#1C7D5A] hover:bg-[#156346] active:scale-98 text-white shadow-md shadow-emerald-800/20"
                      : "bg-[#f8faf9] hover:bg-slate-100 active:scale-98 text-slate-800 border border-slate-200/90"
                      }`}
                  >
                    <span>সাবস্ক্রিপশন কিনুন</span>
                  </button>

                  {/* ফিচার তালিকা */}
                  <div className="space-y-3 pt-1 border-t border-slate-100">
                    {pkg.features.map((feat, idx) => (
                      <div
                        key={idx}
                        className="flex items-center gap-2.5 text-xs sm:text-sm text-slate-700 font-medium"
                      >
                        <Check className="w-4 h-4 text-[#1C7D5A] stroke-[2.5] shrink-0" />
                        <span>{feat}</span>
                      </div>
                    ))}
                  </div>
                </div>

                {/* কার্ডের নিচে হালকা স্টাইল প্যাডিং */}
                <div className="mt-6" />
              </div>
            );
          })}
        </div>

        {/* ====== নিচের লিংক ও কাস্টম প্যাকেজ সেকশন ====== */}
        <div className="mt-8 text-center space-y-4">
          {/* সকল প্যাকেজ ও তুলনা দেখুন */}
          <div>
            <Link
              to="/packages"
              className="inline-flex items-center gap-2 text-sm sm:text-base font-bold text-[#1C7D5A] hover:text-[#156346] hover:underline transition-all group cursor-pointer"
            >
              <span>সকল প্যাকেজ ও তুলনা দেখুন</span>
              <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
            </Link>
          </div>
        </div>
      </div>

      {/* সাবস্ক্রিপশন ও বুকিং মডাল */}
      <SubscriptionModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        selectedPlan={selectedPlan}
        billingCycle={billingCycle}
      />
    </section>
  );
};

export default Package;