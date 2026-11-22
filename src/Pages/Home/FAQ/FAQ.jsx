import React, { useState } from "react";
import { ChevronDown, MessageCircleQuestion, HelpCircle, PhoneCall, ArrowRight } from "lucide-react";
import { Link } from "react-router-dom";

const FAQ_DATA = [
  {
    question: "প্যানেল কীভাবে দেখব?",
    answer:
      "আপনি খুব সহজেই আমাদের ওয়েবসাইটে \"ফ্রি ডেমো দেখুন\" বাটনে ক্লিক করে সরাসরি সফটওয়্যারের লাইভ ডেমো দেখতে পারেন। এছাড়াও আমাদের হটলাইনে কল করলে অথবা হোয়াটসঅ্যাপে যোগাযোগ করলে আমাদের প্রতিনিধি আপনাকে সম্পূর্ণ প্যানেলটির একটি ফ্রি ভার্চুয়াল প্রেজেন্টেশন প্রদর্শন করবেন।",
  },
  {
    question: "আমার ডেটা কি নিরাপদ থাকবে?",
    answer:
      "আলহামদুলিল্লাহ, আপনার মাদরাসার সকল তথ্য ও ডেটা শতভাগ নিরাপদ এবং সুরক্ষিত। আমরা এন্টারপ্রাইজ গ্রেড এনক্রিপশন ও উচ্চমানের ক্লাউড সার্ভার ব্যবহার করি। আপনার মাদরাসার অনুমতি ছাড়া অন্য কেউ আপনার কোনো ডেটা দেখতে বা পরিবর্তন করতে পারবে না। এছাড়াও স্বয়ংক্রিয় ব্যাকআপ সিস্টেম চালু থাকে।",
  },
  {
    question: "কিভাবে পেমেন্ট করবো?",
    answer:
      "আপনি বিকাশ (bKash), নগদ (Nagad), রকেট (Rocket), অথবা যেকোনো ব্যাংক ট্রান্সফারের মাধ্যমে সহজেই মাসিক বা বাৎসরিক সাবস্ক্রিপশন ফি পরিশোধ করতে পারবেন। পেমেন্ট সম্পন্ন হওয়ার সাথে সাথেই সিস্টেমে ডিজিটাল মানি রিসিট জেনারেট হয়ে যাবে।",
  },
  {
    question: "প্যাকেজ কি পরিবর্তন করা যাবে?",
    answer:
      "জ্বী, অবশ্যই! আপনার মাদরাসার ছাত্রসংখ্যা বা শাখার সংখ্যা বৃদ্ধি পেলে আপনি যেকোনো সময় আপনার বর্তমান প্যাকেজটি নতুন যেকোনো প্যাকেজে আপগ্রেড বা পরিবর্তন করতে পারবেন। প্যাকেজ পরিবর্তনে পূর্বের কোনো তথ্যের ক্ষতি হবে না।",
  },
  {
    question: "প্রশিক্ষণ পাওয়া যাবে কি?",
    answer:
      "হ্যাঁ, সম্পূর্ণ বিনামূল্যে! সফটওয়্যারটি চালুর পর আপনার মাদরাসার মুহতামিম, শিক্ষক ও হিসাবরক্ষকদের ব্যবহারের পূর্ণাঙ্গ প্রশিক্ষণ প্রদান করা হবে। পাশাপাশি আমাদের ডেডিকেটেড সাপোর্ট টিম সার্বক্ষণিক যেকোনো সমস্যা সমাধানে প্রস্তুত থাকে।",
  },
  {
    question: "এসএমএস চার্জ কেমন?",
    answer:
      "আমাদের সফটওয়্যারে প্রতিটি নন-মাস্কিং ও মাস্কিং এসএমএস চার্জ অত্যন্ত সাশ্রয়ী (সর্বনিম্ন সরকারি রেট অনুযায়ী)। প্যাকেজের সাথে নির্ধারিত ফ্রি এসএমএস ছাড়াও আপনি যেকোনো সময় অতিরিক্ত এসএমএস বান্ডেল সাশ্রয়ী মূল্যে রিচার্জ করে নিতে পারবেন।",
  },
];

const FAQ = () => {
  const [openIndex, setOpenIndex] = useState(null);

  const toggleFAQ = (index) => {
    setOpenIndex((prev) => (prev === index ? null : index));
  };

  return (
    <section id="faq" className="relative py-16 sm:py-24 bg-[#fbfcfa] font-bangla overflow-hidden">
      {/* Background Subtle Gradient Accents */}
      <div className="absolute top-1/4 left-1/2 -translate-x-1/2 w-[600px] h-[300px] bg-emerald-100/30 rounded-full blur-3xl pointer-events-none" />

      <div className="relative z-10 max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* ====== Header Section matching Screenshot ====== */}
        <div className="text-center max-w-2xl mx-auto mb-10 sm:mb-14">
          {/* Top Pill Badge */}
          <div className="inline-flex items-center justify-center px-4 py-1 rounded-full border border-slate-200/90 bg-white text-xs sm:text-sm font-semibold text-slate-700 shadow-2xs mb-3.5">
            জিজ্ঞাস্য
          </div>

          {/* Main Title matching Screenshot */}
          <h2 className="text-3xl sm:text-4xl lg:text-[2.65rem] font-black text-slate-900 tracking-tight leading-[1.3] mb-3">
            প্রায়শই জিজ্ঞাসিত <span className="text-[#0d6e4b]">প্রশ্ন</span>
          </h2>

          {/* Subtitle with Contact Link */}
          <p className="text-slate-500 text-sm sm:text-base font-normal max-w-xl mx-auto">
            আপনার প্রশ্নের উত্তর খুঁজে না পেলে{" "}
            <a
              href="#contact"
              className="text-[#0d6e4b] hover:text-[#095237] font-medium underline underline-offset-4 decoration-emerald-300 hover:decoration-emerald-500 transition-all"
            >
              যোগাযোগ করুন
            </a>
            ।
          </p>
        </div>

        {/* ====== Accordion List ====== */}
        <div className="space-y-3.5 sm:space-y-4">
          {FAQ_DATA.map((faq, index) => {
            const isOpen = openIndex === index;
            return (
              <div
                key={index}
                className={`bg-white rounded-xl sm:rounded-2xl border transition-all duration-200 ${
                  isOpen
                    ? "border-emerald-500/40 shadow-sm ring-1 ring-emerald-500/10"
                    : "border-slate-200/80 shadow-2xs hover:border-slate-300 hover:shadow-xs"
                }`}
              >
                <button
                  type="button"
                  onClick={() => toggleFAQ(index)}
                  className="w-full py-4 sm:py-4.5 px-5 sm:px-6 flex items-center justify-between text-left gap-4 focus:outline-hidden cursor-pointer select-none"
                  aria-expanded={isOpen}
                >
                  <span
                    className={`text-base sm:text-[17px] font-semibold transition-colors duration-150 ${
                      isOpen ? "text-[#0d6e4b]" : "text-slate-800"
                    }`}
                  >
                    {faq.question}
                  </span>
                  <div
                    className={`w-7 h-7 rounded-full flex items-center justify-center shrink-0 transition-colors duration-200 ${
                      isOpen ? "bg-emerald-50 text-[#0d6e4b]" : "text-slate-400 group-hover:text-slate-600"
                    }`}
                  >
                    <ChevronDown
                      className={`w-4 h-4 transition-transform duration-300 ${
                        isOpen ? "rotate-180 text-[#0d6e4b]" : "text-slate-400"
                      }`}
                    />
                  </div>
                </button>

                {/* Answer Container with Smooth Height Transition */}
                <div
                  className={`grid transition-all duration-300 ease-in-out ${
                    isOpen ? "grid-rows-[1fr] opacity-100" : "grid-rows-[0fr] opacity-0"
                  }`}
                >
                  <div className="overflow-hidden">
                    <div className="px-5 sm:px-6 pb-4.5 pt-1 text-slate-600 text-sm sm:text-[15px] leading-relaxed border-t border-slate-100/90">
                      {faq.answer}
                    </div>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
};

export default FAQ;
