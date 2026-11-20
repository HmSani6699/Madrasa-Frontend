import React, { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import {
  ArrowRight,
  Sparkles,
  Check,
  TrendingUp,
  Users,
  School,
  Building2,
  CheckCircle2,
  ShieldCheck,
  ExternalLink,
  ChevronRight,
  Layers,
  BarChart3,
  Monitor,
  MessageCircle,
  X,
  UserCheck,
  GraduationCap,
  Play,
  Video,
} from "lucide-react";
import demoService from "../../../services/demoService";

const OFFICIAL_WHATSAPP_NUMBER = "8801986544021";

// ডিফল্ট ডেমো ভিডিও কনফিগারেশন (ডেমো পেজের মতো)
const DEFAULT_DEMO_VIDEO = {
  videoUrl: "https://www.youtube.com/watch?v=ScMzIvxBSi4",
  embedUrl: "https://www.youtube-nocookie.com/embed/ScMzIvxBSi4",
  title: "মাদ্রাসা ম্যানেজমেন্ট সফটওয়্যার পরিচিতি ও ডেমো ভিডিও",
  description: "ভিডিওর মাধ্যমে সফটওয়্যারটির সকল আধুনিক ফিচার ও ব্যবহারবিধি বিস্তারিত দেখে নিন",
  isActive: true,
};

// Embed URL Helper
const getEmbedUrl = (url) => {
  if (!url || typeof url !== "string") return "";
  const trimmed = url.trim();
  if (trimmed.includes("/embed/")) return trimmed;
  const ytMatch = trimmed.match(
    /(?:youtu\.be\/|youtube\.com\/(?:embed\/|v\/|watch\?v=|watch\?.+&v=|shorts\/))([\w-]{11})/
  );
  if (ytMatch && ytMatch[1]) {
    return `https://www.youtube-nocookie.com/embed/${ytMatch[1]}`;
  }
  const vimeoMatch = trimmed.match(/vimeo\.com\/(?:video\/)?([0-9]+)/);
  if (vimeoMatch && vimeoMatch[1]) {
    return `https://player.vimeo.com/video/${vimeoMatch[1]}`;
  }
  return trimmed;
};

const Banner = () => {
  const [showRoleModal, setShowRoleModal] = useState(false);
  const [showcaseTab, setShowcaseTab] = useState("video"); // "video" (default as requested) or "preview"
  const [videoConfig, setVideoConfig] = useState(DEFAULT_DEMO_VIDEO);
  const navigate = useNavigate();

  // Fetch dynamic demo video settings from backend
  useEffect(() => {
    let isMounted = true;
    const fetchVideoSettings = async () => {
      try {
        const res = await demoService.getDemoVideo();
        if (isMounted && res?.success && res?.data) {
          const config = {
            videoUrl: res.data.videoUrl || DEFAULT_DEMO_VIDEO.videoUrl,
            embedUrl:
              res.data.embedUrl ||
              getEmbedUrl(res.data.videoUrl) ||
              DEFAULT_DEMO_VIDEO.embedUrl,
            title: res.data.title || DEFAULT_DEMO_VIDEO.title,
            description: res.data.description || DEFAULT_DEMO_VIDEO.description,
            isActive:
              res.data.isActive !== undefined ? res.data.isActive : true,
          };
          setVideoConfig(config);
          if (config.isActive === false) {
            setShowcaseTab("preview");
          }
        }
      } catch (err) {
        console.error("Failed to load demo video in Banner:", err);
      }
    };
    fetchVideoSettings();
    return () => {
      isMounted = false;
    };
  }, []);

  return (
    <>
      <section className="relative overflow-hidden pt-8 pb-16 sm:pt-14 sm:pb-24 bg-gradient-to-b from-[#f9fbfa] via-white to-[#f4f8f6]">
        {/* ====== 1. ISLAMIC GEOMETRIC BACKGROUND PATTERN (SVG) ====== */}
        <div className="absolute inset-0 pointer-events-none select-none z-0">
          {/* Subtle Ambient Radial Glow */}
          <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[800px] h-[450px] bg-gradient-to-b from-emerald-500/10 via-teal-400/5 to-transparent rounded-full blur-3xl" />

          {/* Islamic Arabesque Geometric Tessellation */}
          <svg
            className="absolute inset-0 w-full h-full opacity-[0.035]"
            xmlns="http://www.w3.org/2000/svg"
          >
            <defs>
              <pattern
                id="islamic-stars"
                width="64"
                height="64"
                patternUnits="userSpaceOnUse"
              >
                {/* 8-pointed Islamic Star Geometry (Khatim) */}
                <path
                  d="M32 6 L38 22 L54 16 L48 32 L58 48 L42 42 L32 58 L22 42 L6 48 L16 32 L10 16 L26 22 Z"
                  fill="none"
                  stroke="#1C7D5A"
                  strokeWidth="1.2"
                />
                <circle
                  cx="32"
                  cy="32"
                  r="4.5"
                  fill="none"
                  stroke="#d97706"
                  strokeWidth="0.9"
                />
                <path
                  d="M0 0 L16 16 M64 0 L48 16 M0 64 L16 48 M64 64 L48 48"
                  stroke="#1C7D5A"
                  strokeWidth="0.8"
                />
              </pattern>
            </defs>
            <rect width="100%" height="100%" fill="url(#islamic-stars)" />
          </svg>
        </div>

        <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          {/* ====== 2. TOP PILL BADGE ====== */}
          <div className="inline-flex items-center justify-center mb-4 sm:mb-5">
            <button
              onClick={() => setShowRoleModal(true)}
              className="group inline-flex items-center gap-2 bg-[#fef9ee] hover:bg-[#fef3d6] text-[#b45309] border border-[#fde68a] text-xs sm:text-sm font-semibold px-4 sm:px-5 py-1 rounded-full shadow-2xs transition-all duration-200 hover:scale-102 cursor-pointer font-bangla"
            >
              <Sparkles className="w-3.5 h-3.5 sm:w-4 sm:h-4 text-amber-500 animate-pulse" />
              <span>এক ক্লিকে মাদ্রাসা প্যানেল • রেজিস্ট্রেশন ছাড়াই</span>
              <ChevronRight className="w-3 h-3 sm:w-3.5 sm:h-3.5 text-amber-600 group-hover:translate-x-0.5 transition-transform" />
            </button>
          </div>

          {/* ====== 3. BISMILLAH CALLIGRAPHY ====== */}
          <div className="my-2 select-none">
            <div className="flex items-center justify-center gap-3">
              <span className="h-[1px] w-8 sm:w-16 bg-gradient-to-r from-transparent to-emerald-700/30" />
              <h2
                className="font-arabic text-2xl sm:text-3xl md:text-4xl text-[#14532d] font-bold tracking-wider drop-shadow-2xs"
                dir="rtl"
              >
                بِسْمِ اللَّهِ الرَّحْمَٰنِ الرَّحِيمِ
              </h2>
              <span className="h-[1px] w-8 sm:w-16 bg-gradient-to-l from-transparent to-emerald-700/30" />
            </div>
          </div>

          {/* ====== 4. MAIN HERO HEADING ====== */}
          <h1 className="text-3xl sm:text-5xl md:text-6xl lg:text-[4.2rem] font-black text-slate-900 tracking-tight font-bangla leading-[1.18] sm:leading-[1.15] max-w-5xl mx-auto mt-3">
            আধুনিক{" "}
            <span className="text-[#d97706] inline-block drop-shadow-xs">
              মাদ্রাসা
            </span>{" "}
            ব্যবস্থাপনা
            <br className="hidden sm:inline" /> এক প্ল্যাটফর্মে
          </h1>

          {/* ====== 5. SUBTITLE / LEAD TEXT ====== */}
          <p className="mt-4 sm:mt-5 text-slate-600 text-sm sm:text-lg md:text-xl font-medium font-bangla max-w-3xl mx-auto leading-relaxed">
            সাবস্ক্রিপশন ভিত্তিক সম্পূর্ণ ক্লাউড সফটওয়্যার — ছাত্র ভর্তি থেকে
            একাউন্টস, এসএমএস ও রিপোর্ট পর্যন্ত। সবকিছু বাংলায়।
          </p>

          {/* ====== 6. CALL TO ACTION BUTTONS ====== */}
          <div className="mt-7 sm:mt-9 flex flex-col sm:flex-row items-center justify-center gap-3 sm:gap-4 font-bangla mx-auto">
            {/* Primary CTA */}
            <Link
              to="/free-demo"
              className="w-full sm:w-auto bg-[#0e7c55] hover:bg-[#0a6646] active:scale-95 text-white font-bold text-sm sm:text-base px-6 sm:px-7 py-3 sm:py-3.5 rounded-xl shadow-lg shadow-emerald-800/20 hover:shadow-xl hover:shadow-emerald-800/30 hover:-translate-y-0.5 transition-all duration-200 flex items-center justify-center gap-2 group cursor-pointer"
            >
              <span>ফ্রি ডেমো আবেদন করুন</span>
              <ArrowRight className="w-4 h-4 sm:w-4.5 sm:h-4.5 group-hover:translate-x-1 transition-transform" />
            </Link>

            {/* Secondary CTA - WhatsApp */}
            <a
              href={`https://wa.me/${OFFICIAL_WHATSAPP_NUMBER}?text=${encodeURIComponent(
                "আসসালামু আলাইকুম, মাদ্রাসা সেবা সফটওয়্যার সম্পর্কে বিস্তারিত জানতে চাই।"
              )}`}
              target="_blank"
              rel="noopener noreferrer"
              className="w-full sm:w-auto bg-white hover:bg-slate-50 active:scale-95 text-slate-700 hover:text-slate-900 border border-slate-200/90 hover:border-slate-300 font-bold text-sm sm:text-base px-6 py-3 sm:py-3.5 rounded-xl shadow-2xs hover:shadow-xs transition-all duration-200 flex items-center justify-center gap-2 cursor-pointer"
            >
              <MessageCircle className="w-4.5 h-4.5 text-[#25D366] fill-[#25D366]" />
              <span>হোয়াটসঅ্যাপে যোগাযোগ করুন</span>
            </a>
          </div>

          {/* ====== 7. TRUST VALUE PROPOSITIONS (CHECKMARKS) ====== */}
          <div className="mt-6 sm:mt-8 flex flex-wrap items-center justify-center gap-4 sm:gap-7 text-xs sm:text-sm font-semibold text-slate-600 font-bangla">
            <div className="flex items-center gap-1.5">
              <div className="w-4 h-4 rounded-full border border-emerald-500/80 text-emerald-600 flex items-center justify-center bg-emerald-50">
                <Check className="w-2.5 h-2.5 stroke-[3]" />
              </div>
              <span>রেজিস্ট্রেশন ছাড়াই প্যানেল প্রবেশ</span>
            </div>

            <div className="flex items-center gap-1.5">
              <div className="w-4 h-4 rounded-full border border-emerald-500/80 text-emerald-600 flex items-center justify-center bg-emerald-50">
                <Check className="w-2.5 h-2.5 stroke-[3]" />
              </div>
              <span>বাংলায় সাপোর্ট</span>
            </div>

            <div className="flex items-center gap-1.5">
              <div className="w-4 h-4 rounded-full border border-emerald-500/80 text-emerald-600 flex items-center justify-center bg-emerald-50">
                <Check className="w-2.5 h-2.5 stroke-[3]" />
              </div>
              <span>যেকোনো সময় বাতিল</span>
            </div>
          </div>

          {/* ====== 8. SHOWCASE CONTAINER (VIDEO DEMO & DASHBOARD PREVIEW) ====== */}
          <div className="mt-10 sm:mt-14 max-w-5xl mx-auto relative px-1 sm:px-4">
            {/* Ambient Background Aura */}
            <div className="absolute -inset-3 sm:-inset-6 bg-gradient-to-tr from-emerald-500/15 via-teal-400/10 to-amber-500/10 rounded-[2.5rem] blur-2xl -z-10 pointer-events-none" />

            {/* Showcase Main Presentation Canvas */}
            <div className="relative rounded-2xl sm:rounded-3xl bg-gradient-to-b from-[#f1f5f4] via-[#f9fbfa] to-[#eaf2ef] border border-slate-200/90 shadow-2xl p-3 sm:p-6 md:p-8 overflow-hidden backdrop-blur-xs">
              
              {/* Canvas Header Bar with macOS Window Dots & Dual Mode Switcher */}
              <div className="flex flex-col sm:flex-row items-center justify-between gap-3 mb-3.5 sm:mb-5 pb-3 border-b border-slate-200/70">
                {/* Window Dots & Context Label */}
                <div className="flex items-center gap-2">
                  <div className="flex items-center gap-1.5">
                    <span className="w-2.5 h-2.5 rounded-full bg-rose-500/80 inline-block" />
                    <span className="w-2.5 h-2.5 rounded-full bg-amber-500/80 inline-block" />
                    <span className="w-2.5 h-2.5 rounded-full bg-emerald-500/80 inline-block" />
                  </div>
                  <span className="text-xs font-semibold text-slate-600 ml-2 font-bangla hidden sm:inline">
                    {showcaseTab === "video"
                      ? (videoConfig.title || "মাদ্রাসা ম্যানেজমেন্ট সফটওয়্যার পরিচিতি ও ডেমো ভিডিও")
                      : "মাদ্রাসা সেবা ক্লাউড ড্যাশবোর্ড প্রিভিউ"}
                  </span>
                </div>

                {/* Segmented Dual Switcher: ভিডিও ডেমো | ড্যাশবোর্ড ভিউ */}
                <div className="inline-flex p-1 bg-white/95 backdrop-blur-xs rounded-full border border-slate-200/90 shadow-xs">
                  <button
                    type="button"
                    onClick={() => setShowcaseTab("video")}
                    className={`inline-flex items-center gap-1.5 px-4 sm:px-5 py-1.5 rounded-full text-xs sm:text-sm font-bold transition-all duration-200 cursor-pointer ${
                      showcaseTab === "video"
                        ? "bg-[#1C7D5A] text-white shadow-xs"
                        : "text-slate-600 hover:text-emerald-700"
                    }`}
                  >
                    <Video className="w-3.5 h-3.5" />
                    <span>ভিডিও ডেমো</span>
                  </button>

                  <button
                    type="button"
                    onClick={() => setShowcaseTab("preview")}
                    className={`inline-flex items-center gap-1.5 px-4 sm:px-5 py-1.5 rounded-full text-xs sm:text-sm font-bold transition-all duration-200 cursor-pointer ${
                      showcaseTab === "preview"
                        ? "bg-[#1C7D5A] text-white shadow-xs"
                        : "text-slate-600 hover:text-emerald-700"
                    }`}
                  >
                    <Monitor className="w-3.5 h-3.5" />
                    <span>ড্যাশবোর্ড ভিউ</span>
                  </button>
                </div>
              </div>

              {/* Dynamic Showcase Media Canvas */}
              {showcaseTab === "video" ? (
                /* ====== 1. VIDEO PLAYER VIEW (Just like Demo Page) ====== */
                <div className="relative w-full aspect-video rounded-xl sm:rounded-2xl overflow-hidden bg-slate-950 shadow-2xl border border-slate-800">
                  <iframe
                    className="w-full h-full object-cover"
                    src={
                      videoConfig.embedUrl ||
                      getEmbedUrl(videoConfig.videoUrl) ||
                      DEFAULT_DEMO_VIDEO.embedUrl
                    }
                    title={
                      videoConfig.title ||
                      "মাদ্রাসা ম্যানেজমেন্ট সফটওয়্যার পরিচিতি ও ডেমো ভিডিও"
                    }
                    allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
                    allowFullScreen
                  />
                </div>
              ) : (
                /* ====== 2. DASHBOARD 3D MOCKUP GRAPHIC CANVAS ====== */
                <div className="relative w-full">
                  {/* Floating Stat Badge 1 (Left): আজকের কালেকশন */}
                  <div className="absolute left-3 sm:left-6 md:left-8 top-1/4 sm:top-1/3 -translate-y-1/2 z-30 animate-float-slow select-none hidden sm:block">
                    <div className="bg-white/95 backdrop-blur-md rounded-xl sm:rounded-2xl p-2.5 sm:p-4 shadow-xl border border-slate-100/90 flex items-center gap-2.5 sm:gap-3.5 hover:scale-105 transition-transform">
                      <div className="w-9 h-9 sm:w-11 sm:h-11 rounded-lg sm:rounded-xl bg-emerald-100/80 text-emerald-700 flex items-center justify-center shadow-xs shrink-0">
                        <TrendingUp className="w-5 h-5 sm:w-6 sm:h-6" />
                      </div>
                      <div className="text-left font-bangla">
                        <div className="text-[10px] sm:text-xs text-slate-500 font-medium leading-none mb-1">
                          আজকের কালেকশন
                        </div>
                        <div className="text-sm sm:text-lg md:text-xl font-black text-slate-900 leading-none">
                          ৳ ৪২,৫০০
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Floating Stat Badge 2 (Right): মোট ছাত্র */}
                  <div className="absolute right-3 sm:right-6 md:right-8 bottom-1/4 sm:bottom-1/3 z-30 animate-float-reverse select-none hidden sm:block">
                    <div className="bg-white/95 backdrop-blur-md rounded-xl sm:rounded-2xl p-2.5 sm:p-4 shadow-xl border border-slate-100/90 flex items-center gap-2.5 sm:gap-3.5 hover:scale-105 transition-transform">
                      <div className="w-9 h-9 sm:w-11 sm:h-11 rounded-lg sm:rounded-xl bg-amber-100/80 text-amber-700 flex items-center justify-center shadow-xs shrink-0">
                        <Users className="w-5 h-5 sm:w-6 sm:h-6" />
                      </div>
                      <div className="text-left font-bangla">
                        <div className="text-[10px] sm:text-xs text-slate-500 font-medium leading-none mb-1">
                          মোট ছাত্র
                        </div>
                        <div className="text-sm sm:text-lg md:text-xl font-black text-slate-900 leading-none">
                          ৮৫৯
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* The 3D Mockup Graphic Canvas */}
                  <div className="relative w-full overflow-hidden rounded-xl sm:rounded-2xl bg-white shadow-inner border border-slate-200/50">
                    <div className="relative w-full aspect-[16/10] sm:aspect-[16/9] md:aspect-[21/11] overflow-hidden group">
                      <img
                        src="/hero-preview.jpg"
                        alt="Madrasa Sheba Dashboard 3D Mockup"
                        className="w-full h-full object-cover object-[center_68%] sm:object-[center_67%] select-none pointer-events-none transform scale-[1.04] group-hover:scale-[1.07] transition-transform duration-700 ease-out"
                      />

                      {/* Gentle gradient overlay for pristine aesthetic */}
                      <div className="absolute inset-0 bg-gradient-to-t from-slate-900/10 via-transparent to-transparent pointer-events-none" />

                      {/* Interactive Quick Try Button Overlay on Hover */}
                      <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 bg-slate-950/20 backdrop-blur-2xs transition-all duration-300">
                        <button
                          onClick={() => setShowRoleModal(true)}
                          className="bg-white hover:bg-emerald-50 text-emerald-800 font-bold px-6 py-3 rounded-xl shadow-xl flex items-center gap-2 font-bangla transform translate-y-2 group-hover:translate-y-0 transition-all cursor-pointer"
                        >
                          <Monitor className="w-5 h-5 text-emerald-700" />
                          <span>লাইভ ড্যাশবোর্ড পরীক্ষা করুন</span>
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              )}

              {/* Description subtitle when in video mode */}
              {showcaseTab === "video" && videoConfig?.description && (
                <div className="mt-3 text-center">
                  <p className="text-xs sm:text-sm text-slate-600 font-bangla">
                    {videoConfig.description}
                  </p>
                </div>
              )}

              {/* ====== FLOATING BOTTOM PREVIEW DOCK (As seen in the design) ====== */}
              <div className="mt-4 sm:mt-5 pt-3 sm:pt-4 border-t border-slate-200/70 flex flex-col md:flex-row items-center justify-between gap-3 text-xs text-slate-600 font-bangla">
                <div className="flex items-center gap-2">
                  <div className="w-6 h-6 rounded-lg bg-[#1C7D5A] flex items-center justify-center text-amber-400">
                    <ShieldCheck className="w-3.5 h-3.5" />
                  </div>
                  <span className="font-bold text-slate-800">
                    মাদ্রাসা সেবা ক্লাউড সফটওয়্যার
                  </span>
                  <span className="hidden sm:inline text-slate-400">•</span>
                  <span className="hidden sm:inline text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded-md font-semibold">
                    সক্রিয় ভার্সন ৩.০
                  </span>
                </div>

                <div className="flex items-center gap-2 flex-wrap justify-center">
                  <button
                    onClick={() => setShowRoleModal(true)}
                    className="hover:text-emerald-700 hover:underline inline-flex items-center gap-1 font-semibold cursor-pointer"
                  >
                    <span>ডেমো প্যানেল সুইচ করুন</span>
                    <ChevronRight className="w-3.5 h-3.5" />
                  </button>
                  <span className="text-slate-300">|</span>
                  <Link
                    to="/free-demo"
                    className="text-emerald-700 font-bold hover:underline"
                  >
                    ফ্রি ডেমো আবেদন
                  </Link>
                  <span className="text-slate-300">|</span>
                  <Link
                    to="/login"
                    className="text-emerald-700 font-bold hover:underline"
                  >
                    সফটওয়্যারে প্রবেশ করুন
                  </Link>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ====== QUICK ROLE / PANEL DEMO MODAL ====== */}
      {showRoleModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm animate-fade-in">
          <div className="bg-white rounded-3xl max-w-lg w-full p-6 sm:p-8 shadow-2xl border border-slate-100 relative">
            <button
              onClick={() => setShowRoleModal(false)}
              className="absolute top-5 right-5 text-slate-400 hover:text-slate-700 p-2 rounded-full hover:bg-slate-100 transition-colors"
            >
              <X className="w-5 h-5" />
            </button>

            <div className="flex items-center gap-3 mb-2">
              <div className="w-10 h-10 rounded-xl bg-emerald-100 text-[#1C7D5A] flex items-center justify-center">
                <Sparkles className="w-5 h-5" />
              </div>
              <div>
                <h3 className="text-xl font-bold text-slate-900 font-bangla">
                  সরাসরি প্যানেল প্রিভিউ
                </h3>
                <p className="text-xs text-slate-500 font-bangla">
                  রেজিস্ট্রেশন ছাড়াই যেকোনো প্যানেল ভিজিট করুন
                </p>
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 my-6">
              <Link
                to="/admin"
                onClick={() => setShowRoleModal(false)}
                className="group p-4 rounded-2xl border border-emerald-100 hover:border-emerald-500 bg-emerald-50/40 hover:bg-emerald-50 transition-all flex items-center gap-3"
              >
                <div className="w-10 h-10 rounded-xl bg-[#1C7D5A] text-white flex items-center justify-center shadow-xs group-hover:scale-105 transition-transform">
                  <School className="w-5 h-5" />
                </div>
                <div className="text-left">
                  <div className="font-bold text-slate-900 text-sm font-bangla group-hover:text-emerald-800">
                    মুহতামিম প্যানেল
                  </div>
                  <div className="text-xs text-slate-500 font-bangla">অ্যাডমিন ড্যাশবোর্ড</div>
                </div>
              </Link>

              <Link
                to="/teacher"
                onClick={() => setShowRoleModal(false)}
                className="group p-4 rounded-2xl border border-slate-200 hover:border-emerald-500 hover:bg-emerald-50/30 transition-all flex items-center gap-3"
              >
                <div className="w-10 h-10 rounded-xl bg-amber-500 text-white flex items-center justify-center shadow-xs group-hover:scale-105 transition-transform">
                  <UserCheck className="w-5 h-5" />
                </div>
                <div className="text-left">
                  <div className="font-bold text-slate-900 text-sm font-bangla group-hover:text-emerald-800">
                    উস্তাদ প্যানেল
                  </div>
                  <div className="text-xs text-slate-500 font-bangla">শিক্ষক ড্যাশবোর্ড</div>
                </div>
              </Link>

              <Link
                to="/guardian"
                onClick={() => setShowRoleModal(false)}
                className="group p-4 rounded-2xl border border-slate-200 hover:border-emerald-500 hover:bg-emerald-50/30 transition-all flex items-center gap-3"
              >
                <div className="w-10 h-10 rounded-xl bg-teal-600 text-white flex items-center justify-center shadow-xs group-hover:scale-105 transition-transform">
                  <Users className="w-5 h-5" />
                </div>
                <div className="text-left">
                  <div className="font-bold text-slate-900 text-sm font-bangla group-hover:text-emerald-800">
                    অভিভাবক পোর্টাল
                  </div>
                  <div className="text-xs text-slate-500 font-bangla">ফী ও হাজিরা তথ্য</div>
                </div>
              </Link>

              <Link
                to="/demo-madrasa"
                onClick={() => setShowRoleModal(false)}
                className="group p-4 rounded-2xl border border-slate-200 hover:border-emerald-500 hover:bg-emerald-50/30 transition-all flex items-center gap-3"
              >
                <div className="w-10 h-10 rounded-xl bg-indigo-600 text-white flex items-center justify-center shadow-xs group-hover:scale-105 transition-transform">
                  <GraduationCap className="w-5 h-5" />
                </div>
                <div className="text-left">
                  <div className="font-bold text-slate-900 text-sm font-bangla group-hover:text-emerald-800">
                    জামিয়া পোর্টাল
                  </div>
                  <div className="text-xs text-slate-500 font-bangla">পাবলিক ওয়েবসাইট</div>
                </div>
              </Link>
            </div>

            <div className="bg-emerald-50 rounded-2xl p-4 mb-3 border border-emerald-200/80 flex flex-col sm:flex-row items-center justify-between gap-3 text-xs">
              <span className="font-bangla font-semibold text-emerald-950 text-center sm:text-left">
                নিজের মাদ্রাসার নামে সম্পূর্ণ ফ্রি ডেমো পোর্টাল নিতে চান?
              </span>
              <Link
                to="/free-demo"
                onClick={() => setShowRoleModal(false)}
                className="bg-[#1C7D5A] hover:bg-[#0a6646] text-white font-bold px-4 py-2 rounded-xl inline-flex items-center gap-1.5 transition-colors shrink-0 shadow-xs"
              >
                <span>ফ্রি ডেমো আবেদন</span>
                <ChevronRight className="w-3.5 h-3.5" />
              </Link>
            </div>

            <div className="bg-slate-50 rounded-2xl p-4 flex items-center justify-between text-xs text-slate-600">
              <span className="font-bangla">
                লাইভ ডেমোতে যেকোনো ফিচার পরীক্ষা করে দেখুন
              </span>
              <Link
                to="/login"
                onClick={() => setShowRoleModal(false)}
                className="font-bold text-[#1C7D5A] hover:underline inline-flex items-center gap-1 font-bangla"
              >
                লগইন করুন <ChevronRight className="w-3.5 h-3.5" />
              </Link>
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default Banner;
