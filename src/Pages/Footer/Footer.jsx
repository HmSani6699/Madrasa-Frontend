import React from "react";
import { Link } from "react-router-dom";
import {
    Phone,
    Mail,
    MapPin,
    Clock,
    ArrowRight,
    ArrowUp,
    Sparkles,
    ShieldCheck,
    Headphones,
    Database,
    CheckCircle2,
    ExternalLink,
    Heart,
    BookOpen,
    Users,
    Wallet,
    GraduationCap,
    Bell,
    Globe,
    Youtube,
    Facebook,
    Linkedin,
} from "lucide-react";

import logo from "../../../public/whitelogo.png"

const OFFICIAL_PHONE = "01830-630365";
const OFFICIAL_PHONE_RAW = "01830-630365";
const OFFICIAL_EMAIL = "madrasasheba@gmail.com";

const Footer = () => {
    const scrollToTop = () => {
        window.scrollTo({
            top: 0,
            behavior: "smooth",
        });
    };

    const currentYear = new Date().getFullYear();

    return (
        <footer id="contact" className="relative bg-[#081812] text-slate-300 font-bangla overflow-hidden">
            {/* ====== ব্যাকগ্রাউন্ড এম্বিয়েন্ট ইফেক্ট ও ডেকোরেশন ====== */}
            <div className="absolute inset-0 pointer-events-none select-none overflow-hidden">
                {/* টপ ব্লার আভা */}
                <div className="absolute -top-32 left-1/2 -translate-x-1/2 w-175 h-87.5 bg-emerald-500/10 rounded-full blur-[120px]" />
                {/* বটম রাইট ব্লার আভা */}
                <div className="absolute -bottom-20 right-0 w-112.5 h-112.5 bg-teal-500/5 rounded-full blur-[100px]" />
                {/* বটম লেফট ব্লার আভা */}
                <div className="absolute bottom-10 left-0 w-100 h-100 bg-emerald-600/5 rounded-full blur-[100px]" />

                {/* সূক্ষ্ম ইসলামিক জ্যামিতিক গ্রিড প্যাটার্ন ব্যাকগ্রাউন্ড */}
                <div
                    className="absolute inset-0 opacity-[0.03]"
                    style={{
                        backgroundImage: `radial-gradient(#10b981 1px, transparent 1px), radial-gradient(#10b981 1px, #081812 1px)`,
                        backgroundSize: `40px 40px`,
                        backgroundPosition: `0 0, 20px 20px`
                    }}
                />
            </div>



            {/* ====== ২. মূল ফুটার গ্রিড সেকশন ====== */}
            <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-8 pb-14 border-t border-emerald-950/80">
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-12 gap-10 lg:gap-8">

                    {/* কলাম ১: লোগো ও ব্র্যান্ড পরিচিতি (৫ কলাম স্প্যান) */}
                    <div className="lg:col-span-4 space-y-5">
                        {/* লোগো ও প্রিমিয়াম ব্যাজ */}
                        <div className="flex items-center gap-3">
                            <Link to="/" className="inline-block  p-2 rounded-2xl transition-all">
                                <img
                                    src={logo}
                                    alt="মাদ্রাসা সেবা"
                                    className="h-11.5 w-full object-contain"
                                    onError={(e) => {
                                        // ফলব্যাক যদি লোগো লোড হতে সমস্যা হয়
                                        e.currentTarget.style.display = 'none';
                                    }}
                                />
                            </Link>

                        </div>

                        {/* ব্র্যান্ড ডেসক্রিপশন */}
                        <p className="text-slate-400 text-sm leading-relaxed">
                            মাদ্রাসা সেবা — কওমী, আলিয়া ও হিফজ মাদ্রাসার জন্য তৈরি ক্লাউড ভিত্তিক একটি স্বয়ংসম্পূর্ণ আধুনিক ম্যানেজমেন্ট ইকোসিস্টেম। শিক্ষার্থী ভর্তি, উপস্থিতি, বেতন সংগ্রহ, হিসাব-নিকাশ ও ফলাফল তৈরি করুন সম্পূর্ণ নির্ভুলভাবে।
                        </p>

                        {/* সোশ্যাল মিডিয়া লিংকস */}
                        <div className="space-y-2 pt-2">
                            <p className="text-xs text-slate-400 font-medium">আমাদের সোশ্যাল মিডিয়ায় যুক্ত থাকুন:</p>
                            <div className="flex items-center gap-2.5">
                                <a
                                    href="https://facebook.com"
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    aria-label="Facebook"
                                    className="w-9 h-9 rounded-xl bg-white/5 hover:bg-[#1877F2] hover:text-white text-slate-300 border border-white/10 flex items-center justify-center transition-all duration-200 hover:-translate-y-0.5"
                                >
                                    <Facebook className="w-4 h-4" />
                                </a>
                                <a
                                    href="https://youtube.com"
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    aria-label="YouTube"
                                    className="w-9 h-9 rounded-xl bg-white/5 hover:bg-[#FF0000] hover:text-white text-slate-300 border border-white/10 flex items-center justify-center transition-all duration-200 hover:-translate-y-0.5"
                                >
                                    <Youtube className="w-4 h-4" />
                                </a>
                                <a
                                    href={`https://wa.me/${OFFICIAL_PHONE_RAW}`}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    aria-label="WhatsApp"
                                    className="w-9 h-9 rounded-xl bg-white/5 hover:bg-[#25D366] hover:text-white text-slate-300 border border-white/10 flex items-center justify-center transition-all duration-200 hover:-translate-y-0.5"
                                >
                                    <svg className="w-4 h-4 fill-current" viewBox="0 0 24 24">
                                        <path d="M.057 24l1.687-6.163c-1.041-1.804-1.588-3.849-1.587-5.946.003-6.556 5.338-11.891 11.893-11.891 3.181.001 6.167 1.24 8.413 3.488 2.245 2.248 3.481 5.236 3.48 8.414-.003 6.557-5.338 11.892-11.893 11.892-1.99-.001-3.951-.5-5.688-1.448l-6.305 1.654zm6.597-3.807c1.676.995 3.276 1.591 5.392 1.592 5.448 0 9.886-4.434 9.889-9.885.002-5.462-4.415-9.89-9.881-9.892-5.452 0-9.887 4.434-9.889 9.884-.001 2.225.651 3.891 1.746 5.634l-.999 3.648 3.742-.981zm11.387-5.464c-.074-.124-.272-.198-.57-.347-.297-.149-1.758-.868-2.031-.967-.272-.099-.47-.149-.669.149-.198.297-.768.967-.941 1.165-.173.198-.347.223-.644.074-.297-.149-1.255-.462-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.297-.347.446-.521.151-.172.2-.296.3-.495.099-.198.05-.372-.025-.521-.075-.148-.669-1.611-.916-2.206-.242-.579-.487-.501-.669-.51l-.57-.01c-.198 0-.52.074-.792.372s-1.04 1.016-1.04 2.479 1.065 2.876 1.213 3.074c.149.198 2.095 3.2 5.076 4.487.709.306 1.263.489 1.694.626.712.226 1.36.194 1.872.118.571-.085 1.758-.719 2.006-1.413.248-.695.248-1.29.173-1.414z" />
                                    </svg>
                                </a>
                                <a
                                    href="https://linkedin.com"
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    aria-label="LinkedIn"
                                    className="w-9 h-9 rounded-xl bg-white/5 hover:bg-[#0A66C2] hover:text-white text-slate-300 border border-white/10 flex items-center justify-center transition-all duration-200 hover:-translate-y-0.5"
                                >
                                    <Linkedin className="w-4 h-4" />
                                </a>
                            </div>
                        </div>
                    </div>

                    {/* কলাম ২: দ্রুত লিংক (২ কলাম স্প্যান) */}
                    <div className="lg:col-span-2 space-y-4">
                        <h3 className="text-white text-base font-bold tracking-wide flex items-center gap-2">
                            <span className="w-2 h-2 rounded-full bg-emerald-400" />
                            দ্রুত লিংক
                        </h3>
                        <ul className="space-y-2.5 text-sm text-slate-400">
                            <li>
                                <Link to="/" className="hover:text-emerald-400 transition-colors flex items-center gap-1.5">
                                    <span className="text-emerald-500/60">›</span> হোম
                                </Link>
                            </li>
                            <li>
                                <a href="#features" className="hover:text-emerald-400 transition-colors flex items-center gap-1.5">
                                    <span className="text-emerald-500/60">›</span> সকল ফিচারসমূহ
                                </a>
                            </li>
                            <li>
                                <Link to="/packages" className="hover:text-emerald-400 transition-colors flex items-center gap-1.5">
                                    <span className="text-emerald-500/60">›</span> প্যাকেজ ও প্রাইসিং
                                </Link>
                            </li>
                            <li>
                                <Link to="/free-demo" className="hover:text-emerald-400 transition-colors flex items-center gap-1.5">
                                    <span className="text-emerald-500/60">›</span> ফ্রি লাইভ ডেমো
                                </Link>
                            </li>
                            <li>
                                <Link to="/login" className="hover:text-emerald-400 transition-colors flex items-center gap-1.5">
                                    <span className="text-emerald-500/60">›</span> সিস্টেম লগইন
                                </Link>
                            </li>
                            <li>
                                <a href="#contact" className="hover:text-emerald-400 transition-colors flex items-center gap-1.5">
                                    <span className="text-emerald-500/60">›</span> আমাদের সাথে যোগাযোগ
                                </a>
                            </li>
                        </ul>
                    </div>

                    {/* কলাম ৩: প্রধান মডিউল ও ফিচার (৩ কলাম স্প্যান) */}
                    <div className="lg:col-span-3 space-y-4">
                        <h3 className="text-white text-base font-bold tracking-wide flex items-center gap-2">
                            <span className="w-2 h-2 rounded-full bg-amber-400" />
                            প্রধান মডিউলসমূহ
                        </h3>
                        <ul className="space-y-2.5 text-sm text-slate-400">
                            <li className="flex items-center gap-2 hover:text-slate-200 transition-colors">
                                <GraduationCap className="w-4 h-4 text-emerald-400 shrink-0" />
                                <span>ভর্তি ও শিক্ষার্থী ব্যবস্থাপনা</span>
                            </li>
                            <li className="flex items-center gap-2 hover:text-slate-200 transition-colors">
                                <Wallet className="w-4 h-4 text-emerald-400 shrink-0" />
                                <span>ফি কালেকশন ও ভাউচার রসিদ</span>
                            </li>
                            <li className="flex items-center gap-2 hover:text-slate-200 transition-colors">
                                <Users className="w-4 h-4 text-emerald-400 shrink-0" />
                                <span>শিক্ষক, স্টাফ ও হাজিরা ট্র্যাকিং</span>
                            </li>
                            <li className="flex items-center gap-2 hover:text-slate-200 transition-colors">
                                <Bell className="w-4 h-4 text-emerald-400 shrink-0" />
                                <span>স্বয়ংক্রিয় বাংলা এসএমএস নোটিফিকেশন</span>
                            </li>
                            <li className="flex items-center gap-2 hover:text-slate-200 transition-colors">
                                <BookOpen className="w-4 h-4 text-emerald-400 shrink-0" />
                                <span>পরীক্ষার ফলাফল ও অটোমেটিক মার্কশিট</span>
                            </li>
                            <li className="flex items-center gap-2 hover:text-slate-200 transition-colors">
                                <Globe className="w-4 h-4 text-emerald-400 shrink-0" />
                                <span>মাদ্রাসার জন্য পূর্ণাঙ্গ ওয়েবসাইট পোর্টাল</span>
                            </li>
                        </ul>
                    </div>

                    {/* কলাম ৪: যোগাযোগ ও সহায়তা (৩ কলাম স্প্যান) */}
                    <div className="lg:col-span-3 space-y-4">
                        <h3 className="text-white text-base font-bold tracking-wide flex items-center gap-2">
                            <span className="w-2 h-2 rounded-full bg-teal-400" />
                            যোগাযোগ ও সাপোর্ট
                        </h3>

                        <div className="space-y-3 text-sm">
                            {/* ফোন নম্বর */}
                            <a
                                href={`tel:${OFFICIAL_PHONE_RAW}`}
                                className="flex items-center gap-2"
                            >
                                <div className="w-8 h-8 rounded-lg bg-emerald-500/10 group-hover:bg-emerald-500/20 text-emerald-400 flex items-center justify-center shrink-0 transition-colors">
                                    <Phone className="w-4 h-4" />
                                </div>
                                <div>

                                    <span className="font-semibold font-mono text-emerald-300">{OFFICIAL_PHONE}</span>
                                </div>
                            </a>

                            {/* ইমেইল */}
                            <a
                                href={`mailto:${OFFICIAL_EMAIL}`}
                                className="flex items-center gap-2"
                            >
                                <div className="w-8 h-8 rounded-lg bg-emerald-500/10 group-hover:bg-emerald-500/20 text-emerald-400 flex items-center justify-center shrink-0 transition-colors">
                                    <Mail className="w-4 h-4" />
                                </div>
                                <div>

                                    <span className="font-semibold text-xs text-slate-200">{OFFICIAL_EMAIL}</span>
                                </div>
                            </a>

                            {/* ঠিকানা */}
                            <div className="flex items-center gap-2">
                                <div className="w-8 h-8 rounded-lg bg-emerald-500/10 text-emerald-400 flex items-center justify-center shrink-0">
                                    <MapPin className="w-4 h-4" />
                                </div>
                                <div>

                                    <span className="text-xs text-slate-200">House-31, Road-2, 6th Floor, Block-C, Banasree, Rampura, Dhaka, 1219</span>
                                </div>
                            </div>

                            {/* কর্মঘণ্টা */}
                            <div className="flex items-center gap-2 text-xs text-slate-400 pt-1">
                                <Clock className="w-3.5 h-3.5 text-amber-400 shrink-0" />
                                <span>শনি — বৃহস্পতি (সকাল ৯:০০ - রাত ১০:০০)</span>
                            </div>
                        </div>
                    </div>

                </div>
            </div>

            {/* ====== ৩. বটম সাব-ফুটার ও কপিরাইট বার ====== */}
            <div className="relative z-10 border-t border-emerald-950/90 bg-[#05100c]/80 backdrop-blur-md">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">


                    {/* কপিরাইট লেখা */}
                    <div className="text-center ">
                        <p className="text-center text-slate-400">
                            © {currentYear} <span className=" text-slate-400">মাদ্রাসা সেবা (Madrasa Sheba)</span>। সর্বস্বত্ব সংরক্ষিত।
                        </p>

                    </div>
                </div>
            </div>
        </footer>
    );
};

export default Footer;
