import { useState } from "react";
import { Link, useParams } from "react-router-dom";
import {
  BookOpen,
  GraduationCap,
  Star,
  Presentation,
  ArrowLeft,
  ArrowRight,
  CheckCircle2,
  Play,
  X,
} from "lucide-react";
import { usePortalSettings } from "../../context/PortalSettingsContext";
import {
  PortalReveal,
  PortalOdometer,
  ZapBadge,
} from "./components/PortalPrimitives";

const CurriculumIcon = ({ index }) => {
  const idx = index % 4;
  if (idx === 0) return <GraduationCap className="w-6 h-6 text-blue-500" />;
  if (idx === 1) return <BookOpen className="w-6 h-6 text-green-500" />;
  if (idx === 2) return <Star className="w-6 h-6 text-yellow-500" />;
  return <Presentation className="w-6 h-6 text-purple-500" />;
};

const YouTubeLiteCard = ({ youtubeId, title }) => {
  const [playing, setPlaying] = useState(false);

  return (
    <div className="rounded-[10px] overflow-hidden bg-black shadow-lg aspect-video relative group">
      {playing ? (
        <iframe
          className="w-full h-full"
          src={`https://www.youtube.com/embed/${youtubeId}?autoplay=1`}
          title={title || "YouTube Video"}
          allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
          allowFullScreen
        />
      ) : (
        <button
          type="button"
          onClick={() => setPlaying(true)}
          className="w-full h-full relative block cursor-pointer focus:outline-none"
          aria-label={title || "Play video"}
        >
          <img
            src={`https://i.ytimg.com/vi/${youtubeId}/hqdefault.jpg`}
            alt={title || "Video thumbnail"}
            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
          />
          <div className="absolute inset-0 bg-black/25 group-hover:bg-black/15 transition-colors flex items-center justify-center">
            <div className="w-14 h-10 bg-black/80 group-hover:bg-[#ff0000] rounded-xl flex items-center justify-center text-white transition-colors shadow-xl">
              <Play className="w-5 h-5 fill-current ml-0.5" />
            </div>
          </div>
        </button>
      )}
    </div>
  );
};

const MadrasaPortal = () => {
  const { settings } = usePortalSettings();
  const { slug } = useParams();
  const basePath = slug ? `/${slug}` : "";

  const [openTab, setOpenTab] = useState(1);
  const [videoStart, setVideoStart] = useState(0);
  const [lightboxImage, setLightboxImage] = useState(null);

  const stats = settings?.stats || [];
  const curriculumItems = settings?.curriculum?.items || [];
  const studentItems = settings?.students?.items || [];
  const teacherItems = settings?.teachers?.items || [];
  const videoItems = settings?.gallery?.videos || [];
  const photoItems = settings?.gallery?.photos || [];

  const logoSrc = settings?.branding?.logo || "/portal/school.png";
  const heroTitle = settings?.branding?.name || "আল-কুরআনুল কারীম একাডেমি";
  const heroSubtitle =
    settings?.branding?.tagline ||
    settings?.contact?.address ||
    "পাকুন্ডা, সোনারগাঁ, নারায়ণগঞ্জ";

  const aboutTabs = [
    { id: 1, title: "আমাদের লক্ষ্য" },
    { id: 2, title: "আমাদের দৃষ্টিভঙ্গি" },
    { id: 3, title: "আমাদের গোল" },
  ];

  const handlePrevVideo = () => {
    if (videoItems.length <= 3) return;
    setVideoStart((prev) => (prev === 0 ? videoItems.length - 3 : prev - 1));
  };

  const handleNextVideo = () => {
    if (videoItems.length <= 3) return;
    setVideoStart((prev) => (prev >= videoItems.length - 3 ? 0 : prev + 1));
  };

  const visibleVideos =
    videoItems.length > 3
      ? videoItems.slice(videoStart, videoStart + 3)
      : videoItems;

  return (
    <div className="lg:max-w-[1280px] mx-auto relative pb-10">
      {/* ===== 1. Hero Banner + Overlapping Stat Cards ===== */}
      <div className="lg:h-[560px]">
        <div className="bg-[#043334] h-full lg:flex items-start justify-between px-4 lg:px-10 text-white portal-hero-section pt-[40px] lg:pt-[50px] pb-[150px] lg:pb-0">
          {/* Left Student Image */}
          <PortalReveal className="hidden lg:block mt-[50px] flex-shrink-0">
            <img
              src={settings?.hero?.leftImage || "/portal/im1.png"}
              alt="Student"
              className="max-h-[410px] w-auto object-contain relative z-10"
            />
          </PortalReveal>

          {/* Center Madrasa Identity */}
          <div className="text-center relative z-10 mx-auto pt-2">
            <PortalReveal>
              <div className="flex items-center justify-center">
                <div className="w-[125px] lg:w-[135px] h-[125px] lg:h-[135px] bg-white rounded-full border-[#07A698] border-2 overflow-hidden flex items-center justify-center p-1 shadow-lg">
                  <img
                    src={logoSrc}
                    alt={heroTitle}
                    className="w-full h-full object-contain"
                    onError={(e) => {
                      e.currentTarget.src = "/portal/school.png";
                    }}
                  />
                </div>
              </div>
            </PortalReveal>

            <PortalReveal>
              <h2 className="lg:text-[35px] text-[24px] sm:text-[28px] font-bold text-white lg:mt-[14px] mt-[22px] leading-snug">
                {heroTitle}
              </h2>
            </PortalReveal>

            <PortalReveal>
              <div className="text-center flex items-center justify-center">
                <p className="font-semibold text-[#07A698] text-[18px] lg:mt-1 mt-[8px]">
                  {heroSubtitle}
                </p>
              </div>
            </PortalReveal>

            <div className="flex items-center justify-center gap-[20px] mt-[20px] flex-wrap">
              <PortalReveal>
                <a href="#curriculum" className="flex items-center gap-[8px] hover:text-[#07A698] transition-colors">
                  <CheckCircle2 className="w-5 h-5 text-[#07A698]" />
                  <span>গ্রেট লাইফ</span>
                </a>
              </PortalReveal>
              <PortalReveal>
                <div className="flex items-center gap-[8px]">
                  <CheckCircle2 className="w-5 h-5 text-[#07A698]" />
                  <span>গ্রেট সার্টিফিকেট</span>
                </div>
              </PortalReveal>
            </div>
          </div>

          {/* Right Student Image */}
          <PortalReveal className="hidden lg:block mt-[70px] flex-shrink-0">
            <img
              src={settings?.hero?.rightImage || "/portal/im2.png"}
              alt="Student"
              className="max-h-[390px] w-auto object-contain relative z-10"
            />
          </PortalReveal>
        </div>

        {/* Overlapping 4 Stat Cards */}
        <div>
          <div className="grid grid-cols-2 lg:grid-cols-4 lg:gap-[20px] gap-[10px] relative z-30 lg:-mt-[135px] -mt-[120px] rounded-[10px] lg:p-[30px] p-[10px] lg:max-w-[790px] mx-auto">
            {stats.map((stat, idx) => (
              <PortalReveal key={idx}>
                <div className="bg-white p-[20px] rounded-[15px] lg:w-[160px] py-[20px] shadow-sm hover:shadow-md transition-shadow">
                  <div className="flex items-center justify-center">
                    <img
                      className="w-[50px] h-[50px] object-contain"
                      src={
                        stat.icon ||
                        (idx === 0
                          ? "/portal/section.png"
                          : idx === 1
                          ? "/portal/student.png"
                          : idx === 2
                          ? "/portal/teacher.png"
                          : "/portal/staff.png")
                      }
                      alt={stat.label}
                    />
                  </div>
                  <div className="text-center mt-[10px]">
                    <h2 className="text-[#1d5276] text-[20px] lg:text-[22px] font-bold">
                      <PortalOdometer value={stat.val} /> {stat.suffix || ""}
                    </h2>
                    <p className="text-[#1d5276] font-medium">{stat.label}</p>
                  </div>
                </div>
              </PortalReveal>
            ))}
          </div>
        </div>
      </div>

      {/* ===== 2. About Section ===== */}
      <section className="relative">
        <div className="absolute top-0 left-0 mt-[40px] pointer-events-none opacity-80 hidden sm:block">
          <img className="w-[400px]" src="/portal/about_shape.png" alt="" />
        </div>

        <div className="lg:mt-[150px] mt-[80px] relative p-[10px] lg:flex items-start gap-[85px] lg:max-w-[900px] lg:mx-auto">
          {/* Campus + Overlapping Principal Portrait */}
          <div className="relative lg:h-[350px] flex-shrink-0">
            <div className="rounded-[15px] bg-white h-[260px] sm:h-[300px] w-full max-w-[400px] mx-auto lg:mx-0 overflow-hidden shadow-sm">
              <img
                className="w-full h-full object-cover rounded-[15px]"
                src={settings?.about?.mainImage || "/portal/office.jpeg"}
                alt="Madrasa Campus"
                onError={(e) => {
                  e.currentTarget.src = "/portal/office.jpeg";
                }}
              />
            </div>

            {/* Desktop Overlapping Principal */}
            <div className="absolute lg:-bottom-[20px] lg:-right-[50px] lg:block hidden w-[200px] h-[210px] rounded-t-full border-[3px] p-[3px] bg-white rounded-b-[6px] shadow-md overflow-hidden">
              <img
                className="w-full h-full object-cover rounded-t-full rounded-b-[6px]"
                src={
                  settings?.about?.principalImage ||
                  "/portal/Teacher/teacher6-2.png"
                }
                alt="Principal"
                onError={(e) => {
                  e.currentTarget.src = "/portal/Teacher/teacher6-2.png";
                }}
              />
            </div>

            {/* Mobile Overlapping Principal */}
            <div className="lg:hidden flex items-center justify-center relative -mt-20">
              <div className="w-[180px] h-[195px] rounded-t-full border-[3px] p-[3px] bg-white rounded-b-[6px] shadow-md overflow-hidden">
                <img
                  className="w-full h-full object-cover rounded-t-full rounded-b-[6px]"
                  src={
                    settings?.about?.principalImage ||
                    "/portal/Teacher/teacher6-2.png"
                  }
                  alt="Principal"
                  onError={(e) => {
                    e.currentTarget.src = "/portal/Teacher/teacher6-2.png";
                  }}
                />
              </div>
            </div>
          </div>

          {/* Right Tabs & Content */}
          <div className="lg:mt-0 mt-[30px] flex-1">
            <div>
              <PortalReveal>
                <ZapBadge
                  text={settings?.about?.badge || "ক্লাস পাঠ্যক্রম"}
                  className="mb-[15px]"
                />
              </PortalReveal>
              <PortalReveal>
                <h2 className="text-[30px] font-bold text-black leading-tight">
                  {settings?.about?.title || "ফিচার ক্লাস কারিকুলাম"}
                </h2>
              </PortalReveal>
            </div>

            {/* Tab Buttons */}
            <div className="flex items-center gap-[10px] mb-[15px] mt-[12px] flex-wrap">
              {aboutTabs.map((item) => (
                <PortalReveal key={item.id}>
                  <button
                    type="button"
                    onClick={() => setOpenTab(item.id)}
                    className={`${
                      openTab === item.id
                        ? "bg-[#07A698] text-white border-[#07A698]"
                        : "text-black bg-white border-slate-200"
                    } hover:bg-[#07A698] hover:text-white border rounded-full py-[4px] px-[12px] text-[14px] font-medium transition-colors cursor-pointer`}
                  >
                    {item.title}
                  </button>
                </PortalReveal>
              ))}
            </div>

            {/* Tab Content */}
            <div className="mt-4">
              {openTab === 1 && (
                <PortalReveal>
                  <p className="text-[14px] text-slate-700 mb-[20px] leading-relaxed">
                    {settings?.about?.description ||
                      "আমাদের লক্ষ্য হলো উচ্চমানের, সহজলভ্য শিক্ষা প্রদান করা যা জ্ঞান এবং বাস্তব-জগতের প্রয়োগের মধ্যে ব্যবধান পূরণ করে।"}
                  </p>
                  <div className="flex flex-col gap-[10px]">
                    {(settings?.about?.highlights?.length
                      ? settings.about.highlights
                      : [
                          "মানসম্মত ক্লাস পাঠ্যক্রম এবং বিশেষজ্ঞ শিক্ষক",
                          "ছাত্রদের অংশগ্রহণ এবং ধরে রাখা",
                        ]
                    ).map((text, i) => (
                      <div key={i} className="flex items-center gap-[10px]">
                        <span className="text-[#07A698] bg-white shadow-md h-[30px] w-[30px] rounded-full text-[14px] font-bold flex items-center justify-center flex-shrink-0">
                          0{i + 1}
                        </span>
                        <p className="text-[14px] text-slate-800">{text}</p>
                      </div>
                    ))}
                  </div>
                </PortalReveal>
              )}

              {openTab === 2 && (
                <PortalReveal>
                  <p className="text-[14px] text-slate-700 mb-[20px] leading-relaxed">
                    আমরা একটি অগ্রণী শিক্ষা প্রতিষ্ঠান হিসেবে নিজেদের গড়ে তুলতে
                    চাই, যেখানে প্রযুক্তিনির্ভর, গবেষণাভিত্তিক এবং জীবনমুখী
                    শিক্ষার সমন্বয়ে ছাত্রছাত্রীরা আগামী দিনের বিশ্বনাগরিক হিসেবে
                    প্রস্তুত হবে।
                  </p>
                </PortalReveal>
              )}

              {openTab === 3 && (
                <div className="flex flex-col gap-[10px]">
                  {[
                    "শিক্ষার্থীদের মধ্যে নেতৃত্ব, সৃজনশীলতা এবং সমস্যা সমাধানের দক্ষতা তৈরি করা।",
                    "প্রযুক্তি ও আধুনিক শিক্ষাদান পদ্ধতির ব্যবহার নিশ্চিত করা।",
                    "নৈতিকতা ও মূল্যবোধ ভিত্তিক শিক্ষা বিস্তারে কাজ করা।",
                    "জাতীয় ও আন্তর্জাতিক পর্যায়ে শিক্ষার মান উন্নয়ন ও স্বীকৃতি অর্জন।",
                  ].map((goal, idx) => (
                    <div key={idx} className="flex items-center gap-[10px]">
                      <span className="text-[#07A698] bg-white shadow-md h-[30px] w-[30px] rounded-full text-[14px] font-bold flex items-center justify-center flex-shrink-0">
                        0{idx + 1}
                      </span>
                      <p className="text-[14px] text-slate-800">{goal}</p>
                    </div>
                  ))}
                </div>
              )}

              <Link to={`${basePath}/about`}>
                <button
                  type="button"
                  className="bg-[#07A698] hover:bg-[#058c80] text-white rounded-full py-[6px] px-[16px] text-[14px] font-semibold mt-[25px] transition-colors cursor-pointer"
                >
                  আরও দেখুন
                </button>
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* ===== 3. Class Curriculum Section ===== */}
      <section
        id="curriculum"
        className="bg-[#07A698] lg:mt-[100px] mt-[50px] relative py-[60px] px-[10px] sm:px-[25px] overflow-hidden"
      >
        <div className="max-w-[1100px] mx-auto">
          <div className="absolute top-0 right-0 pointer-events-none">
            <img className="w-[500px]" src="/portal/testi-shape-1.png" alt="" />
          </div>

          <div className="relative z-10">
            <PortalReveal>
              <ZapBadge
                text={settings?.curriculum?.badge || "ক্লাস পাঠ্যক্রম"}
                className="justify-center"
              />
            </PortalReveal>
            <PortalReveal>
              <h2 className="text-[30px] font-bold my-[20px] text-white text-center">
                {settings?.curriculum?.title || "ফিচার ক্লাস কারিকুলাম"}
              </h2>
            </PortalReveal>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-[20px] mt-[10px] lg:mt-[40px] relative z-10">
            {curriculumItems.map((item, idx) => (
              <PortalReveal key={idx}>
                <div className="border border-slate-200 bg-[#e2e6ef] flex items-center gap-[20px] p-[20px] rounded-[10px] hover:bg-white transition-colors">
                  <div className="bg-white p-[15px] rounded-[10px] shadow-xs">
                    <CurriculumIcon index={idx} />
                  </div>
                  <div className="flex flex-col">
                    <h3 className="font-semibold text-[20px] text-[#162726]">
                      Class {item.name}
                    </h3>
                    <p className="text-slate-600 text-[15px]">
                      Subject: {item.subject}
                    </p>
                  </div>
                </div>
              </PortalReveal>
            ))}
          </div>
        </div>
      </section>

      {/* ===== 4. All Students Showcase Marquee ===== */}
      <section className="max-w-[1471px] mx-auto mt-[60px] lg:mt-[100px]">
        <div>
          <PortalReveal>
            <ZapBadge
              text={settings?.students?.badge || "আমাদের শিক্ষার্থী"}
              className="justify-center"
            />
          </PortalReveal>
          <PortalReveal>
            <p className="text-[#1D5276] mt-[20px] text-[30px] text-center leading-[34px] font-[600]">
              {settings?.students?.title || "আমাদের শিক্ষার্থী বৃন্দ"}
            </p>
          </PortalReveal>
        </div>

        <div className="portal-marquee-wrap flex items-center overflow-hidden mt-4 relative py-4">
          <div className="portal-marquee-track gap-5 pt-14 pb-4">
            {[...studentItems, ...studentItems].map((item, i) => (
              <div
                key={i}
                className="w-[200px] h-[195px] portal-student-card flex flex-col items-center flex-shrink-0"
              >
                <div className="w-[102px] h-[102px] p-1 rounded-full portal-circle-shadow bg-white -mt-12 overflow-hidden flex-shrink-0">
                  <img
                    alt={item.name}
                    className="w-full h-full object-cover rounded-full"
                    src={item.image || "/portal/student/student1.jpeg"}
                    onError={(e) => {
                      e.currentTarget.src = "/portal/student/student1.jpeg";
                    }}
                  />
                </div>
                <div className="flex flex-col items-center w-full px-4 pt-2">
                  <h4 className="text-xl leading-[28px] font-[600] text-[#162726] text-center truncate w-full">
                    {item.name}
                  </h4>
                  <h5 className="text-sm leading-[18px] font-[500] text-[#5D636F] truncate max-w-full">
                    {item.address || "Pakunda, Sonargon"}
                  </h5>
                  <div className="flex items-center gap-2 mt-2">
                    <p className="text-xs leading-[18px] font-[500] text-[#5D636F]">
                      Class:{" "}
                      <span className="text-[#07A698]">
                        {item.className || item.dept || "Five"}
                      </span>
                    </p>
                    <p className="text-xs leading-[18px] font-[500] text-[#5D636F]">
                      Roll:{" "}
                      <span className="text-[#07A698]">{item.roll || "2"}</span>
                    </p>
                  </div>
                </div>
              </div>
            ))}
          </div>

          <div className="hidden sm:block absolute top-0 bottom-0 left-0 w-32 lg:w-52 bg-gradient-to-r from-[#f2f4f7] to-transparent pointer-events-none z-10" />
          <div className="hidden sm:block absolute top-0 bottom-0 right-0 w-32 lg:w-52 bg-gradient-to-l from-[#f2f4f7] to-transparent pointer-events-none z-10" />
        </div>
      </section>

      {/* ===== 5. All Teachers Section ===== */}
      <section className="max-w-[900px] mx-auto lg:mt-[50px] mt-[30px] p-[10px]">
        <div>
          <PortalReveal>
            <ZapBadge
              text={settings?.teachers?.badge || "আমাদের শিক্ষক"}
              className="justify-center"
            />
          </PortalReveal>
          <PortalReveal>
            <p className="text-[#1D5276] mt-[20px] text-[30px] text-center leading-[34px] font-[600]">
              {settings?.teachers?.title || "আমাদের বিশেষজ্ঞ শিক্ষক বৃন্দ"}
            </p>
          </PortalReveal>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-[20px] mt-[45px]">
          {teacherItems.map((teacher, idx) => (
            <PortalReveal key={idx}>
              <div className="border border-slate-200 bg-white rounded-[10px] shadow-md overflow-hidden">
                <div className="portal-teacher-bg lg:h-[300px] h-[360px] overflow-hidden">
                  <img
                    className="h-full w-full object-cover object-top"
                    src={teacher.image || "/portal/Teacher/teacher5.png"}
                    alt={teacher.name}
                    onError={(e) => {
                      e.currentTarget.src = "/portal/Teacher/teacher5.png";
                    }}
                  />
                </div>
                <div className="p-[20px] bg-white">
                  <h2 className="text-[#1D5276] text-center text-[20px] font-semibold">
                    {teacher.name}
                  </h2>
                  <p className="text-white text-center text-[14px] font-semibold bg-[#07A698] py-[5px] rounded-full mt-[10px]">
                    {teacher.role || "Classs: Five"}
                  </p>
                </div>
              </div>
            </PortalReveal>
          ))}
        </div>
      </section>

      {/* ===== 6. Video Gallery Section ===== */}
      <PortalReveal>
        <section className="bg-[#07A698] lg:mt-[100px] mt-[50px] relative py-[60px] px-[10px] sm:px-[25px] overflow-hidden">
          <div className="absolute top-0 right-0 pointer-events-none">
            <img className="w-[500px]" src="/portal/testi-shape-1.png" alt="" />
          </div>

          <div className="max-w-[1100px] mx-auto relative z-10">
            <div className="lg:flex items-center justify-between mb-6">
              <div>
                <ZapBadge text="ভিডিও গ্যালারি" />
                <h2 className="text-[28px] lg:text-[30px] font-bold my-[20px] text-white">
                  {settings?.gallery?.videoTitle ||
                    "Edusadiq ব্যবহার করার বিস্তারিত টিউটোরিয়াল"}
                </h2>
              </div>
              <div className="lg:flex items-center gap-[16px] relative z-40 hidden">
                <button
                  type="button"
                  onClick={handlePrevVideo}
                  aria-label="Previous videos"
                  className="cursor-pointer hover:bg-gray-200 bg-white p-[10px] rounded-full text-[#07A698] transition-colors"
                >
                  <ArrowLeft className="w-4 h-4" />
                </button>
                <button
                  type="button"
                  onClick={handleNextVideo}
                  aria-label="Next videos"
                  className="cursor-pointer hover:bg-gray-200 bg-white p-[10px] rounded-full text-[#07A698] transition-colors"
                >
                  <ArrowRight className="w-4 h-4" />
                </button>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-[20px] relative z-40">
              {visibleVideos.map((vid, idx) => (
                <YouTubeLiteCard
                  key={vid.youtubeId || idx}
                  youtubeId={vid.youtubeId || "Hv8yinlIWJ8"}
                  title={vid.title}
                />
              ))}
            </div>
          </div>
        </section>
      </PortalReveal>

      {/* ===== 7. Photo Gallery Section ===== */}
      <section className="max-w-[1100px] mx-auto lg:mt-[50px] relative py-[60px] p-[10px]">
        <div className="flex items-center justify-center">
          <div>
            <PortalReveal>
              <ZapBadge text="ছবি গ্যালারি" className="justify-center" />
            </PortalReveal>
            <PortalReveal>
              <h2 className="text-[26px] lg:text-[30px] font-bold my-[20px] text-[#162726] text-center">
                আমাদের একাডেমির ছবি গ্যালারি ঘুরে দেখুন
              </h2>
            </PortalReveal>
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-[20px] mt-[20px]">
          {photoItems.map((imgSrc, idx) => {
            const resolvedSrc =
              typeof imgSrc === "string"
                ? imgSrc
                : `/portal/gallery/img${(idx % 8) + 1}.jpg`;
            return (
              <PortalReveal key={idx}>
                <button
                  type="button"
                  onClick={() => setLightboxImage(resolvedSrc)}
                  className="lg:h-[200px] h-[250px] w-full overflow-hidden border border-slate-200 rounded-[10px] bg-white shadow-xs group cursor-pointer block"
                >
                  <img
                    className="h-full w-full object-cover rounded-[10px] group-hover:scale-105 transition-transform duration-500"
                    src={resolvedSrc}
                    alt={`Academy gallery ${idx + 1}`}
                  />
                </button>
              </PortalReveal>
            );
          })}
        </div>
      </section>

      {/* Lightbox Modal for Gallery */}
      {lightboxImage && (
        <div
          className="fixed inset-0 z-[200] bg-black/80 backdrop-blur-xs flex items-center justify-center p-4"
          onClick={() => setLightboxImage(null)}
        >
          <div
            className="relative max-w-4xl w-full bg-white rounded-2xl p-2 shadow-2xl"
            onClick={(e) => e.stopPropagation()}
          >
            <button
              type="button"
              onClick={() => setLightboxImage(null)}
              className="absolute -top-4 -right-4 w-9 h-9 bg-white text-slate-800 rounded-full shadow-lg flex items-center justify-center hover:bg-[#07A698] hover:text-white transition-colors cursor-pointer"
            >
              <X className="w-5 h-5" />
            </button>
            <img
              src={lightboxImage}
              alt="Gallery Preview"
              className="w-full max-h-[80vh] object-contain rounded-xl"
            />
          </div>
        </div>
      )}
    </div>
  );
};

export default MadrasaPortal;
