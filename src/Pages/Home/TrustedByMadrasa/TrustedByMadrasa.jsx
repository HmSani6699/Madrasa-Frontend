import React, { useState } from "react";
import { Link } from "react-router-dom";
import {
    Building2,
    ShieldCheck,
    MapPin,
    Users,
    CheckCircle2,
    Sparkles,
    Star,
    ArrowRight,
    GraduationCap,
    BookOpen,
    Award,
    Check,
} from "lucide-react";

// শীর্ষ মাদরাসাসমূহের তালিকা (প্রোডাকশন গ্রেড ডাটা)
const MADRASAS_ROW_ONE = [
    {
        id: 1,
        name: "জামিয়া কুরআনিয়া আরাবিয়া লালবাগ",
        shortName: "লালবাগ মাদ্রাসা",
        location: "লালবাগ, ঢাকা",
        category: "কওমি মাদ্রাসা",
        students: "১,৫০০+ শিক্ষার্থী",
        established: "১৯৫০",
        theme: "from-emerald-600 to-teal-800",
        badgeColor: "bg-emerald-50 text-emerald-700 border-emerald-200",
        verified: true,
    },
    {
        id: 2,
        name: "দারুল উলুম মুঈনুল ইসলাম হাটহাজারী",
        shortName: "হাটহাজারী মাদ্রাসা",
        location: "হাটহাজারী, চট্টগ্রাম",
        category: "কওমি মাদ্রাসা",
        students: "৩,২০০+ শিক্ষার্থী",
        established: "১৯০১",
        theme: "from-teal-600 to-emerald-900",
        badgeColor: "bg-teal-50 text-teal-700 border-teal-200",
        verified: true,
    },
    {
        id: 3,
        name: "জামিয়া ইসলামিয়া দারুল উলুম মাদানিয়া",
        shortName: "যাত্রাবাড়ী মাদ্রাসা",
        location: "যাত্রাবাড়ী, ঢাকা",
        category: "কওমি মাদ্রাসা",
        students: "২,১০০+ শিক্ষার্থী",
        established: "১৯৮০",
        theme: "from-amber-600 to-emerald-800",
        badgeColor: "bg-amber-50 text-amber-700 border-amber-200",
        verified: true,
    },
    {
        id: 4,
        name: "তানযীমুল উম্মাহ হিফয ও ক্যাডেট মাদরাসা",
        shortName: "তানযীমুল উম্মাহ",
        location: "উত্তরা, ঢাকা",
        category: "ক্যাডেট মাদ্রাসা",
        students: "১,২০০+ শিক্ষার্থী",
        established: "১৯৯৯",
        theme: "from-emerald-700 to-slate-800",
        badgeColor: "bg-emerald-50 text-emerald-700 border-emerald-200",
        verified: true,
    },
    {
        id: 5,
        name: "জামিয়া রাহমানিয়া আরাবিয়া মোহাম্মদপুর",
        shortName: "রাহমানিয়া আরাবিয়া",
        location: "মোহাম্মদপুর, ঢাকা",
        category: "কওমি মাদ্রাসা",
        students: "১,৪৫০+ শিক্ষার্থী",
        established: "১৯৮৮",
        theme: "from-emerald-600 to-teal-700",
        badgeColor: "bg-emerald-50 text-emerald-700 border-emerald-200",
        verified: true,
    },
    {
        id: 6,
        name: "বায়তুশ শরফ আদর্শ কামিল মাদ্রাসা",
        shortName: "বায়তুশ শরফ",
        location: "ধানমন্ডি / চট্টগ্রাম",
        category: "কামিল মাদ্রাসা",
        students: "২,৪০০+ শিক্ষার্থী",
        established: "১৯৮২",
        theme: "from-teal-700 to-emerald-800",
        badgeColor: "bg-teal-50 text-teal-700 border-teal-200",
        verified: true,
    },
    {
        id: 7,
        name: "মারকাযুদ দাওয়াহ আল-ইসলামিয়া",
        shortName: "মারকাযুদ দাওয়াহ",
        location: "পল্লবী, ঢাকা",
        category: "উচ্চতর গবেষণা",
        students: "৭৫০+ শিক্ষার্থী",
        established: "১৯৯৬",
        theme: "from-slate-700 to-emerald-900",
        badgeColor: "bg-slate-50 text-slate-700 border-slate-200",
        verified: true,
    },
    {
        id: 8,
        name: "জামিয়া মাদানিয়া আঙ্গুরা মুহাম্মদপুর",
        shortName: "আঙ্গুরা মাদ্রাসা",
        location: "বিয়ানীবাজার, সিলেট",
        category: "কওমি মাদ্রাসা",
        students: "১,১০০+ শিক্ষার্থী",
        established: "১৯৫৮",
        theme: "from-emerald-700 to-cyan-900",
        badgeColor: "bg-emerald-50 text-emerald-700 border-emerald-200",
        verified: true,
    },
];

const MADRASAS_ROW_TWO = [
    {
        id: 9,
        name: "দারুল উলুম দেওবন্দ মডেল মাদ্রাসা",
        shortName: "দেওবন্দ মডেল",
        location: "মিরপুর, ঢাকা",
        category: "মডেল একাডেমি",
        students: "৮৫০+ শিক্ষার্থী",
        established: "২০১০",
        theme: "from-emerald-600 to-teal-800",
        badgeColor: "bg-emerald-50 text-emerald-700 border-emerald-200",
        verified: true,
    },
    {
        id: 10,
        name: "জামিয়া ইসলামিয়া ইউনুছিয়া ব্রাহ্মণবাড়িয়া",
        shortName: "ইউনুছিয়া মাদ্রাসা",
        location: "সদর, ব্রাহ্মণবাড়িয়া",
        category: "কওমি মাদ্রাসা",
        students: "১,৬০০+ শিক্ষার্থী",
        established: "১৯১৪",
        theme: "from-teal-700 to-emerald-900",
        badgeColor: "bg-teal-50 text-teal-700 border-teal-200",
        verified: true,
    },
    {
        id: 11,
        name: "আল-হিকমাহ ইন্টারন্যাশনাল তাহফিজ একাডেমি",
        shortName: "আল-হিকমাহ একাডেমি",
        location: "ধানমন্ডি, ঢাকা",
        category: "তাহফিজুল কুরআন",
        students: "৬৫০+ শিক্ষার্থী",
        established: "২০১৬",
        theme: "from-amber-600 to-teal-800",
        badgeColor: "bg-amber-50 text-amber-700 border-amber-200",
        verified: true,
    },
    {
        id: 12,
        name: "জামিয়া কাসেমুল উলুম জামিল মাদ্রাসা",
        shortName: "জামিল মাদ্রাসা বগুড়া",
        location: "বগুড়া সদর",
        category: "কওমি মাদ্রাসা",
        students: "১,৩০০+ শিক্ষার্থী",
        established: "১৯৬০",
        theme: "from-emerald-700 to-slate-900",
        badgeColor: "bg-emerald-50 text-emerald-700 border-emerald-200",
        verified: true,
    },
    {
        id: 13,
        name: "রওজাতুল কুরআন মডেল মহিলা মাদ্রাসা",
        shortName: "রওজাতুল কুরআন",
        location: "জয়দেবপুর, গাজীপুর",
        category: "মহিলা শাখা",
        students: "৯০০+ ছাত্রী",
        established: "২০১২",
        theme: "from-rose-600 to-emerald-800",
        badgeColor: "bg-rose-50 text-rose-700 border-rose-200",
        verified: true,
    },
    {
        id: 14,
        name: "দারুল ফালাহ ইসলামিক ক্যাডেট একাডেমি",
        shortName: "দারুল ফালাহ একাডেমি",
        location: "সোনাডাঙ্গা, খুলনা",
        category: "ক্যাডেট একাডেমি",
        students: "৭২০+ শিক্ষার্থী",
        established: "২০১৫",
        theme: "from-teal-600 to-cyan-900",
        badgeColor: "bg-teal-50 text-teal-700 border-teal-200",
        verified: true,
    },
    {
        id: 15,
        name: "জামিয়া নূরিয়া ইসলামিয়া আশরাফাবাদ",
        shortName: "নূরিয়া ইসলামিয়া",
        location: "কামরাঙ্গীরচর, ঢাকা",
        category: "কওমি মাদ্রাসা",
        students: "১,৮০০+ শিক্ষার্থী",
        established: "১৯৪১",
        theme: "from-emerald-700 to-teal-900",
        badgeColor: "bg-emerald-50 text-emerald-700 border-emerald-200",
        verified: true,
    },
    {
        id: 16,
        name: "আল-মানার ইসলামিক তাহফিজ ইনস্টিটিউট",
        shortName: "আল-মানার ইনস্টিটিউট",
        location: "মতিহার, রাজশাহী",
        category: "তাহফিজুল কুরআন",
        students: "৮০০+ শিক্ষার্থী",
        established: "২০১৮",
        theme: "from-amber-600 to-emerald-900",
        badgeColor: "bg-amber-50 text-amber-700 border-amber-200",
        verified: true,
    },
];

// স্ট্যাটস মেট্রিক
const TRUST_METRICS = [
    { label: "সক্রিয় মাদরাসা পার্টনার", value: "১০০+" },
    { label: "সরাসরি পরিচালিত শিক্ষার্থী", value: "৩৫,০০০+" },
    { label: "সারাদেশের বিভাগ ও জেলায়", value: "৬৪ জেলা" },
    { label: "মুহতামিম সন্তুষ্টি স্কোর", value: "৯৯.৮%" },
];

// প্রতিটি মাদরাসা কার্ডের জন্য প্রিমিয়াম UI কম্পোনেন্ট
const MadrasaCard = ({ item }) => {
    return (
        <div
            className="group relative flex items-center gap-3.5 bg-white/95 hover:bg-white rounded-2xl p-3.5 sm:p-4 border border-slate-200/80 hover:border-emerald-500/50 shadow-2xs hover:shadow-xl hover:shadow-emerald-950/8 transition-all duration-300 hover:-translate-y-1 w-72.5 sm:w-85 shrink-0 cursor-default select-none"
        >
            {/* বামে মাদরাসা ক্রিস্ট / প্রিমিয়াম আইকন লোগো */}
            <div className="relative shrink-0">
                <div
                    className={`w-12 h-12 sm:w-13 sm:h-13 rounded-xl bg-linear-to-br ${item.theme} flex items-center justify-center text-white shadow-md shadow-emerald-900/15 group-hover:scale-105 group-hover:rotate-1 transition-all duration-300 ring-2 ring-white/60`}
                >
                    <Building2 className="w-6 h-6 stroke-[1.8] text-emerald-50" />
                </div>
                {/* ভেরিফাইড ব্যাজ আইকন */}
                <span
                    className="absolute -bottom-1 -right-1 w-4.5 h-4.5 rounded-full bg-emerald-500 text-white flex items-center justify-center border-2 border-white shadow-xs"
                    title="ভেরিফাইড মাদরাসা"
                >
                    <Check className="w-2.5 h-2.5 stroke-3" />
                </span>
            </div>

            {/* ডানে টেক্সট ও মেটাডাটা */}
            <div className="min-w-0 flex-1">
                {/* উপরের সারি: ক্যাটাগরি ও স্টুডেন্ট কাউন্ট */}
                <div className="flex items-center justify-between gap-1 mb-1">
                    <span
                        className={`text-[10px] sm:text-[11px] font-semibold px-2 py-0.5 rounded-full border ${item.badgeColor}`}
                    >
                        {item.category}
                    </span>
                    <span className="text-[10px] text-slate-600 font-medium flex items-center gap-1">
                        <Users className="w-3 h-3 text-slate-600" />
                        {item.students}
                    </span>
                </div>

                {/* মাঝের সারি: মাদরাসার মূল নাম */}
                <h4 className="font-bangla font-bold text-slate-800 group-hover:text-emerald-700 text-xs sm:text-sm line-clamp-1 leading-snug transition-colors">
                    {item.name}
                </h4>

                {/* নিচের সারি: লোকেশন */}
                <div className="flex items-center gap-1.5 mt-1 text-[11px] text-slate-600 font-bangla">
                    <MapPin className="w-3 h-3 text-emerald-600 shrink-0" />
                    <span className="truncate">{item.location}</span>
                </div>
            </div>
        </div>
    );
};

const TrustedByMadrasa = () => {
    return (
        <section className="relative overflow-hidden pt-12 pb-16 sm:pt-16 sm:pb-24 bg-linear-to-b from-[#f8faf9] via-white to-[#f4f8f6] border-y border-emerald-950/5">
            {/* ====== 1. BACKGROUND DECORATIONS (ISLAMIC ARABESQUE & AMBIENCE) ====== */}
            <div className="absolute inset-0 pointer-events-none select-none z-0">
                {/* সেন্টার সফট এম্বিয়েন্ট ব্লার */}
                <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-175 h-87.5 bg-linear-to-r from-emerald-500/5 via-teal-400/5 to-amber-500/5 rounded-full blur-3xl" />

                {/* ইসলামিক জ্যামিতিক প্যাটার্ন ব্যাকগ্রাউন্ড */}
                <svg
                    className="absolute inset-0 w-full h-full opacity-[0.025]"
                    xmlns="http://www.w3.org/2000/svg"
                >
                    <defs>
                        <pattern
                            id="trusted-stars"
                            width="60"
                            height="60"
                            patternUnits="userSpaceOnUse"
                        >
                            <path
                                d="M30 6 L35 21 L50 16 L44 30 L54 44 L39 39 L30 54 L21 39 L6 44 L16 30 L10 16 L25 21 Z"
                                fill="none"
                                stroke="#1C7D5A"
                                strokeWidth="1"
                            />
                        </pattern>
                    </defs>
                    <rect width="100%" height="100%" fill="url(#trusted-stars)" />
                </svg>
            </div>

            <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                {/* ====== 2. TOP HEADER SECTION (UI/UX 10-YEAR SENIOR CRAFT) ====== */}
                <div className="text-center max-w-3xl mx-auto mb-4 ">
                    {/* ট্রাস্ট ব্যাজ পিল */}
                    <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-emerald-50/90 border border-emerald-200/80 text-emerald-800 text-xs sm:text-sm font-semibold mb-3.5 shadow-2xs">
                        <span className="flex h-2 w-2 rounded-full bg-emerald-500 animate-ping" />
                        <span className="h-1.5 w-1.5 rounded-full bg-emerald-600 -ml-3" />
                        <ShieldCheck className="w-3.5 h-3.5 text-emerald-600" />
                        <span>দেশজুড়ে বিশ্বস্ত প্রতিষ্ঠান • আলহামদুলিল্লাহ</span>
                    </div>

                    {/* প্রধান শিরোনাম */}
                    <h2 className="text-2xl sm:text-4xl md:text-[2.6rem] font-black text-slate-900 tracking-tight font-bangla leading-tight">
                        সারাদেশের{" "}
                        <span className="relative inline-block text-emerald-700">
                            ১০০+ শীর্ষ মাদরাসায়
                            {/* স্টাইলিশ আন্ডারলাইন গ্রাফিক্স */}
                            <svg
                                className="absolute -bottom-1.5 left-0 w-full h-2 text-emerald-500/30"
                                viewBox="0 0 100 12"
                                preserveAspectRatio="none"
                                fill="none"
                                stroke="currentColor"
                                strokeWidth="4"
                            >
                                <path d="M0,6 Q50,12 100,6" />
                            </svg>
                        </span>{" "}
                        আস্থার সাথে
                    </h2>

                    {/* সাবটাইটেল */}
                    <p className="mt-3.5 text-slate-600 text-sm sm:text-base font-medium font-bangla leading-relaxed">
                        মাদরাসার পরিচালনায় দেশের সর্বাধিক নির্ভরযোগ্য ক্লাউড ম্যানেজমেন্ট
                        সফটওয়্যার।
                    </p>


                </div>
            </div>

            {/* ====== 4. DUAL-ROW INFINITE SMOOTH MARQUEE (PAUSE ON HOVER) ====== */}
            <div className="relative w-full overflow-hidden marquee-pause-group mt-2">
                {/* বাম ও ডানের গ্রেডিয়েন্ট মাস্ক ফেড (Seamless Infinite Fade Effect) */}
                <div className="absolute top-0 left-0 bottom-0 w-16 sm:w-36 md:w-56 bg-linear-to-r from-[#f8faf9] via-[#f8faf9]/90 to-transparent z-20 pointer-events-none" />
                <div className="absolute top-0 right-0 bottom-0 w-16 sm:w-36 md:w-56 bg-linear-to-l from-[#f4f8f6] via-[#f4f8f6]/90 to-transparent z-20 pointer-events-none" />

                {/* প্রথম সারি: বামে স্ক্রল (Row 1 - Left) */}
                <div className="flex gap-4 py-2 sm:py-3">
                    <div className="animate-marquee-scroll-left flex gap-4">
                        {/* অরিজিনাল আইটেমস */}
                        {MADRASAS_ROW_ONE.map((item) => (
                            <MadrasaCard key={`row1-a-${item.id}`} item={item} />
                        ))}
                        {/* ডুপ্লিকেট আইটেমস নিরবচ্ছিন্ন লুপের জন্য */}
                        {MADRASAS_ROW_ONE.map((item) => (
                            <MadrasaCard key={`row1-b-${item.id}`} item={item} />
                        ))}
                    </div>
                </div>

                {/* দ্বিতীয় সারি: ডানে স্ক্রল / রিভার্স (Row 2 - Right) */}
                <div className="flex gap-4 py-2 sm:py-3">
                    <div className="animate-marquee-scroll-right flex gap-4">
                        {/* অরিজিনাল আইটেমস */}
                        {MADRASAS_ROW_TWO.map((item) => (
                            <MadrasaCard key={`row2-a-${item.id}`} item={item} />
                        ))}
                        {/* ডুপ্লিকেট আইটেমস নিরবচ্ছিন্ন লুপের জন্য */}
                        {MADRASAS_ROW_TWO.map((item) => (
                            <MadrasaCard key={`row2-b-${item.id}`} item={item} />
                        ))}
                    </div>
                </div>
            </div>
        </section>
    );
};

export default TrustedByMadrasa;
