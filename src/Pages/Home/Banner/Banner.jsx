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
      <section className="relative overflow-hidden pt-8 pb-16 sm:pt-14 sm:pb-24 bg-linear-to-b from-[#f9fbfa] via-white to-[#f4f8f6]">
        {/* ====== 1. ISLAMIC GEOMETRIC BACKGROUND PATTERN (SVG) ====== */}
        <div className="absolute inset-0 pointer-events-none select-none z-0">
          {/* Subtle Ambient Radial Glow */}
          <div className="absolute top-0 left-1/2 -translate-x-1/2 w-200 h-112.5 bg-linear-to-b from-emerald-500/10 via-teal-400/5 to-transparent rounded-full blur-3xl" />

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
            <Link
              to="/free-demo"
              className="group inline-flex items-center gap-2 bg-[#fef9ee] hover:bg-[#fef3d6] text-[#b45309] border border-[#fde68a] text-xs sm:text-sm font-semibold px-4 sm:px-5 py-1 rounded-full shadow-2xs transition-all duration-200 hover:scale-102 cursor-pointer font-bangla"
            >
              <Sparkles className="w-3.5 h-3.5 sm:w-4 sm:h-4 text-amber-500 animate-pulse" />
              <span>এক ক্লিকে মাদ্রাসা প্যানেল • ফ্রি লাইভ ডেমো</span>
              <ChevronRight className="w-3 h-3 sm:w-3.5 sm:h-3.5 text-amber-600 group-hover:translate-x-0.5 transition-transform" />
            </Link>
          </div>

          {/* ====== 3. BISMILLAH CALLIGRAPHY ====== */}
          <div className="my-2 select-none">
            <div className="flex items-center justify-center gap-3">
              <span className="h-px w-8 sm:w-16 bg-linear-to-r from-transparent to-emerald-700/30" />
              <h2
                className="font-arabic text-2xl sm:text-3xl md:text-4xl text-[#14532d] font-bold tracking-wider drop-shadow-2xs"
                dir="rtl"
              >
                بِسْمِ اللَّهِ الرَّحْمَٰنِ الرَّحِيمِ
              </h2>
              <span className="h-px w-8 sm:w-16 bg-linear-to-l from-transparent to-emerald-700/30" />
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
                <Check className="w-2.5 h-2.5 stroke-3" />
              </div>
              <span>রেজিস্ট্রেশন ছাড়াই প্যানেল প্রবেশ</span>
            </div>

            <div className="flex items-center gap-1.5">
              <div className="w-4 h-4 rounded-full border border-emerald-500/80 text-emerald-600 flex items-center justify-center bg-emerald-50">
                <Check className="w-2.5 h-2.5 stroke-3" />
              </div>
              <span>বাংলায় সাপোর্ট</span>
            </div>

            <div className="flex items-center gap-1.5">
              <div className="w-4 h-4 rounded-full border border-emerald-500/80 text-emerald-600 flex items-center justify-center bg-emerald-50">
                <Check className="w-2.5 h-2.5 stroke-3" />
              </div>
              <span>যেকোনো সময় বাতিল</span>
            </div>
          </div>

          {/* ====== 8. SHOWCASE CONTAINER (VIDEO DEMO & DASHBOARD PREVIEW) ====== */}
          <div className="mt-10 sm:mt-14 max-w-5xl mx-auto relative px-1 sm:px-4">
            {/* Ambient Background Aura */}
            <div className="absolute -inset-3 sm:-inset-6 bg-linear-to-tr from-emerald-500/15 via-teal-400/10 to-amber-500/10 rounded-[2.5rem] blur-2xl -z-10 pointer-events-none" />

            {/* Showcase Main Presentation Canvas */}
            <div className="relative rounded-xl   from-[#f1f5f4] via-[#f9fbfa] to-[#eaf2ef]  shadow-2xl   overflow-hidden backdrop-blur-xs">
              <div className="relative w-full aspect-video rounded-xl  overflow-hidden bg-slate-950 shadow-2xl border border-slate-800">
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
            </div>
          </div>
        </div>
      </section>

    </>
  );
};

export default Banner;
