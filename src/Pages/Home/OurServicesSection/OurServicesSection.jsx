import React from "react";
import {
  GraduationCap,
  Wallet,
  HandCoins,
  BarChart3,
  MessageSquare,
  ShieldCheck,
} from "lucide-react";

// সার্ভিস ডাটা লিস্ট (স্ক্রিনশট অনুযায়ী হুবহু সাজানো)
const SERVICES_DATA = [
  {
    id: 1,
    title: "ছাত্র ব্যবস্থাপনা",
    description: "ভর্তি, হাজিরা, রোল ও হোমওয়ার্ক — সবকিছু এক জায়গায়।",
    icon: GraduationCap,
  },
  {
    id: 2,
    title: "ফি ও বেতন",
    description: "ক্লাস ভিত্তিক ফি, বিশেষ ফি, বকেয়া ও কালেকশন রিপোর্ট।",
    icon: Wallet,
  },
  {
    id: 3,
    title: "ডোনেশন ও স্পন্সর",
    description: "মাসিক দাতা, কন্ট্রিবিউশন ট্র্যাকিং ও ডোনেশন রেকর্ড।",
    icon: HandCoins,
  },
  {
    id: 4,
    title: "একাউন্টস ও ফান্ড",
    description: "আয়-ব্যয়, ব্যালেন্স শিট, ক্যাশবুক ও বার্ষিক রিপোর্ট।",
    icon: BarChart3,
  },
  {
    id: 5,
    title: "এসএমএস নোটিফিকেশন",
    description: "অভিভাবকদের কাছে স্বয়ংক্রিয় বাংলা এসএমএস।",
    icon: MessageSquare,
  },
  {
    id: 6,
    title: "নিরাপদ মাল্টি-টেন্যান্ট",
    description: "প্রতিটি প্রতিষ্ঠান আলাদা ও সুরক্ষিত প্যানেল।",
    icon: ShieldCheck,
  },
];

const OurServicesSection = () => {
  return (
    <section id="features" className="relative py-16 sm:py-20 lg:py-24 bg-[#f8faf9] text-slate-800 font-bangla overflow-hidden">
      {/* ব্যাকগ্রাউন্ড সফট এম্বিয়েন্ট ব্লার */}
      <div className="absolute inset-0 pointer-events-none select-none overflow-hidden">
        <div className="absolute top-1/4 left-1/2 -translate-x-1/2 w-150 h-75 bg-emerald-500/5 rounded-full blur-3xl" />
      </div>

      <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* ====== হেডার সেকশন ====== */}
        <div className="text-center max-w-2xl mx-auto mb-12 sm:mb-16">
          {/* টপ পিল ব্যাজ */}
          <div className="inline-flex items-center justify-center px-4 py-1 rounded-full border border-slate-200/80 bg-white/90 text-xs sm:text-sm font-medium text-slate-700 shadow-2xs mb-4">
            কেন মাদ্রাসা সেবা?
          </div>

          {/* প্রধান শিরোনাম */}
          <h2 className="text-3xl sm:text-4xl lg:text-[2.75rem] font-black text-slate-900 tracking-tight leading-[1.3] mb-3">
            সম্পূর্ণ <span className="text-[#1C7D5A]">ডিজিটাল সমাধান</span>
          </h2>

          {/* সাবটাইটেল */}
          <p className="text-slate-500 text-sm sm:text-base font-normal">
            আপনার মাদ্রাসা পরিচালনার সকল প্রয়োজন মেটাতে তৈরি।
          </p>
        </div>

        {/* ====== সার্ভিস কার্ডস গ্রিড (৩ কলাম, ২ সারি) ====== */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-7">
          {SERVICES_DATA.map((service) => {
            const IconComponent = service.icon;
            return (
              <div
                key={service.id}
                className="group relative bg-white rounded-lg p-5  border border-slate-100 shadow-[0_2px_15px_-3px_rgba(0,0,0,0.03)] hover:shadow-[0_12px_30px_-5px_rgba(28,125,90,0.12)] hover:border-emerald-200/80 hover:-translate-y-1 transition-all duration-300 ease-out text-left"
              >
                {/* আইকন বক্স */}
                <div className="w-12 h-12 rounded-xl bg-[#1C7D5A] flex items-center justify-center text-white mb-6 group-hover:scale-105 group-hover:bg-[#156346] transition-all duration-300 shadow-xs">
                  <IconComponent className="w-6 h-6 stroke-[1.9]" />
                </div>

                {/* কার্ড শিরোনাম */}
                <h3 className="text-lg sm:text-xl font-bold text-slate-900 mb-2 group-hover:text-[#1C7D5A] transition-colors duration-200">
                  {service.title}
                </h3>

                {/* কার্ড বর্ণনা */}
                <p className="text-slate-500 text-sm sm:text-[15px] font-normal leading-relaxed">
                  {service.description}
                </p>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
};

export default OurServicesSection;
