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
  Users,
} from "lucide-react";
import { usePortalSettings } from "../../context/PortalSettingsContext";
import {
  PortalReveal,
  PortalOdometer,
  ZapBadge,
} from "./components/PortalPrimitives";

const CurriculumIcon = ({ index }) => {
  const idx = index % 4;
  if (idx === 0) return <GraduationCap className="w-6 h-6 text-[#1C7D5A]" />;
  if (idx === 1) return <BookOpen className="w-6 h-6 text-[#c99327]" />;
  if (idx === 2) return <Star className="w-6 h-6 text-[#123628]" />;
  return <Presentation className="w-6 h-6 text-[#1C7D5A]" />;
};

const YouTubeLiteCard = ({ youtubeId, title }) => {
  const [playing, setPlaying] = useState(false);

  return (
    <div className="rounded-[12px] overflow-hidden bg-black shadow-lg aspect-video relative group border border-white/15">
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
            <div className="w-14 h-10 bg-[#123628]/90 group-hover:bg-[#EAB33C] rounded-xl flex items-center justify-center text-white group-hover:text-[#123628] transition-colors shadow-xl">
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
  const heroTitle = settings?.branding?.name || "মাদ্রাসা পোর্টাল";
  const heroSubtitle =
    settings?.branding?.tagline || settings?.contact?.address || "";
  const heroBadges =
    Array.isArray(settings?.hero?.badges) && settings.hero.badges.length > 0
      ? settings.hero.badges
      : ["কুরআন ও সুন্নাহ ভিত্তিক শিক্ষা", "আধুনিক ডিজিটাল ব্যবস্থাপনা"];

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
        <div className="bg-[#123628] h-full lg:flex items-start justify-between px-4 lg:px-10 text-white portal-hero-section pt-[40px] lg:pt-[50px] pb-[150px] lg:pb-0">
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
                <div className="w-[125px] lg:w-[135px] h-[125px] lg:h-[135px] bg-white rounded-full border-[#EAB33C] border-[3px] overflow-hidden flex items-center justify-center p-1.5 shadow-xl">
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

            {heroSubtitle && (
              <PortalReveal>
                <div className="text-center flex items-center justify-center">
                  <p className="font-semibold text-[#EAB33C] text-[18px] lg:mt-1 mt-[8px]">
                    {heroSubtitle}
                  </p>
                </div>
              </PortalReveal>
            )}

            <div className="flex items-center justify-center gap-[20px] mt-[20px] flex-wrap">
              {heroBadges.map((badgeText, idx) => (
                <PortalReveal key={idx}>
                  <a
                    href={idx === 0 ? "#curriculum" : `${basePath}/admission`}
                    className="flex items-center gap-[8px] hover:text-[#EAB33C] transition-colors"
                  >
                    <CheckCircle2 className="w-5 h-5 text-[#EAB33C]" />
                    <span>{badgeText}</span>
                  </a>
                </PortalReveal>
              ))}
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
              <PortalReveal key={stat.key || idx}>
                <div className="bg-white p-[20px] rounded-[15px] lg:w-[165px] py-[20px] shadow-md border border-[#1C7D5A]/10 hover:border-[#1C7D5A]/30 hover:shadow-lg transition-all">
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
                    <h2 className="text-[#123628] text-[20px] lg:text-[22px] font-bold">
                      <PortalOdometer value={stat.val} /> {stat.suffix || ""}
                    </h2>
                    <p className="text-[#1C7D5A] font-semibold text-sm">{stat.label}</p>
                  </div>
                </div>
              </PortalReveal>
            ))}
          </div>
        </div>
      </div>

      {/* ===== 2. About Section ===== */}
      <section className="relative">
        <div className="absolute top-0 left-0 mt-[40px] pointer-events-none opacity-60 hidden sm:block">
          <img className="w-[400px]" src="/portal/about_shape.png" alt="" />
        </div>

        <div className="lg:mt-[150px] mt-[80px] relative p-[10px] lg:flex items-start gap-[85px] lg:max-w-[900px] lg:mx-auto">
          {/* Campus + Overlapping Principal Portrait */}
          <div className="relative lg:h-[350px] flex-shrink-0">
            <div className="rounded-[15px] bg-white h-[260px] sm:h-[300px] w-full max-w-[400px] mx-auto lg:mx-0 overflow-hidden shadow-sm border border-[#1C7D5A]/15">
              <img
                className="w-full h-full object-cover rounded-[15px]"
                src={settings?.about?.mainImage || "/portal/office.jpeg"}
                alt={heroTitle}
                onError={(e) => {
                  e.currentTarget.src = "/portal/office.jpeg";
                }}
              />
            </div>

            {/* Desktop Overlapping Principal */}
            <div className="absolute lg:-bottom-[20px] lg:-right-[50px] lg:block hidden w-[200px] h-[210px] rounded-t-full border-[3px] border-[#1C7D5A] p-[3px] bg-white rounded-b-[6px] shadow-md overflow-hidden">
              <img
                className="w-full h-full object-cover rounded-t-full rounded-b-[6px]"
                src={
                  settings?.about?.principalImage ||
                  "/portal/Teacher/teacher6-2.png"
                }
                alt={settings?.profile?.adminName || "Principal"}
                onError={(e) => {
                  e.currentTarget.src = "/portal/Teacher/teacher6-2.png";
                }}
              />
            </div>

            {/* Mobile Overlapping Principal */}
            <div className="lg:hidden flex items-center justify-center relative -mt-20">
              <div className="w-[180px] h-[195px] rounded-t-full border-[3px] border-[#1C7D5A] p-[3px] bg-white rounded-b-[6px] shadow-md overflow-hidden">
                <img
                  className="w-full h-full object-cover rounded-t-full rounded-b-[6px]"
                  src={
                    settings?.about?.principalImage ||
                    "/portal/Teacher/teacher6-2.png"
                  }
                  alt={settings?.profile?.adminName || "Principal"}
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
                  text={settings?.about?.badge || "আমাদের সম্পর্কে"}
                  className="mb-[15px]"
                />
              </PortalReveal>
              <PortalReveal>
                <h2 className="text-[28px] lg:text-[30px] font-bold text-[#123628] leading-tight">
                  {settings?.about?.title || `${heroTitle} — পরিচিতি ও লক্ষ্য`}
                </h2>
              </PortalReveal>
            </div>

            {/* Tab Buttons */}
            <div className="flex items-center gap-[10px] mb-[15px] mt-[14px] flex-wrap">
              {aboutTabs.map((item) => (
                <PortalReveal key={item.id}>
                  <button
                    type="button"
                    onClick={() => setOpenTab(item.id)}
                    className={`${
                      openTab === item.id
                        ? "bg-[#1C7D5A] text-white border-[#1C7D5A]"
                        : "text-[#123628] bg-white border-slate-200"
                    } hover:bg-[#1C7D5A] hover:text-white border rounded-full py-[5px] px-[14px] text-[14px] font-semibold transition-colors cursor-pointer`}
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
                  <p className="text-[15px] text-slate-700 mb-[20px] leading-relaxed">
                    {settings?.about?.description ||
                      `${heroTitle} শিক্ষার্থীদের দ্বীনি ও আধুনিক শিক্ষার সমন্বয়ে নৈতিক, যোগ্য ও আদর্শ নাগরিক হিসেবে গড়ে তুলতে প্রতিশ্রুতিবদ্ধ।`}
                  </p>
                  <div className="flex flex-col gap-[10px]">
                    {(settings?.about?.highlights?.length
                      ? settings.about.highlights
                      : [
                          "অভিজ্ঞ উস্তাদ ও সুশৃঙ্খল পাঠদান পরিবেশ",
                          "অভিভাবক ও শিক্ষার্থীবান্ধব আধুনিক ব্যবস্থাপনা",
                        ]
                    ).map((text, i) => (
                      <div key={i} className="flex items-center gap-[10px]">
                        <span className="text-[#1C7D5A] bg-white border border-[#1C7D5A]/20 shadow-sm h-[30px] w-[30px] rounded-full text-[13px] font-bold flex items-center justify-center flex-shrink-0">
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
                  <p className="text-[15px] text-slate-700 mb-[20px] leading-relaxed">
                    {settings?.about?.vision ||
                      "কুরআন-সুন্নাহর আলোকে ও আধুনিক প্রযুক্তির সমন্বয়ে একটি আদর্শ দ্বীনি শিক্ষা প্রতিষ্ঠান হিসেবে শিক্ষার্থীদের নৈতিক ও মেধার পূর্ণ বিকাশ সাধন করা।"}
                  </p>
                </PortalReveal>
              )}

              {openTab === 3 && (
                <div className="flex flex-col gap-[10px]">
                  {(settings?.about?.goals?.length
                    ? settings.about.goals
                    : [
                        "শিক্ষার্থীদের মধ্যে নৈতিকতা, আমল-আখলাক ও নেতৃত্বের গুণাবলি বিকাশ করা।",
                        "অভিজ্ঞ উস্তাদ ও আধুনিক শিক্ষাদান পদ্ধতির মাধ্যমে মানসম্মত পাঠদান নিশ্চিত করা।",
                        "অভিভাবকদের সাথে নিয়মিত যোগাযোগ ও ডিজিটাল উপস্থিতি-ফলাফল সেবা প্রদান।",
                        "জাতীয় ও দ্বীনি শিক্ষাবোর্ডে কৃতিত্বপূর্ণ ফলাফল অর্জন।",
                      ]
                  ).map((goal, idx) => (
                    <div key={idx} className="flex items-center gap-[10px]">
                      <span className="text-[#1C7D5A] bg-white border border-[#1C7D5A]/20 shadow-sm h-[30px] w-[30px] rounded-full text-[13px] font-bold flex items-center justify-center flex-shrink-0">
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
                  className="bg-[#1C7D5A] hover:bg-[#123628] text-white rounded-full py-[7px] px-[18px] text-[14px] font-semibold mt-[25px] transition-colors cursor-pointer shadow-xs"
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
        className="bg-gradient-to-br from-[#123628] via-[#174b37] to-[#1C7D5A] lg:mt-[100px] mt-[50px] relative py-[60px] px-[10px] sm:px-[25px] overflow-hidden"
      >
        <div className="max-w-[1100px] mx-auto">
          <div className="absolute top-0 right-0 pointer-events-none opacity-40">
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
                {settings?.curriculum?.title || "শ্রেণি ও পাঠ্যক্রম পরিচিতি"}
              </h2>
            </PortalReveal>
          </div>

          {curriculumItems.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-[20px] mt-[10px] lg:mt-[40px] relative z-10">
              {curriculumItems.map((item, idx) => (
                <PortalReveal key={item.id || idx}>
                  <div className="border border-white/20 bg-white/95 flex items-center gap-[18px] p-[20px] rounded-[14px] hover:bg-white hover:shadow-lg transition-all">
                    <div className="bg-[#e8f5f0] p-[15px] rounded-[12px] shadow-2xs flex-shrink-0">
                      <CurriculumIcon index={idx} />
                    </div>
                    <div className="flex flex-col min-w-0">
                      <h3 className="font-bold text-[19px] text-[#123628] truncate">
                        {item.name}
                      </h3>
                      <p className="text-slate-600 text-[14px] font-medium">
                        বিষয়: <span className="text-[#1C7D5A] font-bold">{item.subjectCount ?? item.subject ?? 0}টি</span>
                        {item.studentCount !== undefined && (
                          <>
                            {" "}• শিক্ষার্থী: <span className="text-[#123628] font-bold">{item.studentCount} জন</span>
                          </>
                        )}
                      </p>
                    </div>
                  </div>
                </PortalReveal>
              ))}
            </div>
          ) : (
            <div className="relative z-10 mt-8 bg-white/10 border border-white/15 rounded-2xl p-8 text-center text-white/85">
              এখনও কোনো শ্রেণি বা পাঠ্যক্রম যুক্ত করা হয়নি।
            </div>
          )}
        </div>
      </section>

      {/* ===== 4. All Students Showcase Marquee ===== */}
      <section className="max-w-[1471px] mx-auto mt-[60px] lg:mt-[100px] px-4">
        <div>
          <PortalReveal>
            <ZapBadge
              text={settings?.students?.badge || "আমাদের শিক্ষার্থী"}
              className="justify-center"
            />
          </PortalReveal>
          <PortalReveal>
            <p className="text-[#123628] mt-[20px] text-[30px] text-center leading-[34px] font-[700]">
              {settings?.students?.title || "আমাদের শিক্ষার্থী বৃন্দ"}
            </p>
          </PortalReveal>
        </div>

        {studentItems.length === 0 ? (
          <div className="max-w-[700px] mx-auto mt-8 bg-white rounded-2xl border border-[#1C7D5A]/15 p-8 text-center text-slate-500">
            <Users className="w-8 h-8 text-[#1C7D5A] mx-auto mb-2 opacity-70" />
            এখনও কোনো শিক্ষার্থীর তথ্য যুক্ত করা হয়নি।
          </div>
        ) : studentItems.length < 4 ? (
          <div className="flex flex-wrap justify-center gap-6 pt-16 pb-6">
            {studentItems.map((item, i) => (
              <div
                key={item.id || i}
                className="w-[210px] h-[195px] portal-student-card flex flex-col items-center flex-shrink-0"
              >
                <div className="w-[102px] h-[102px] p-1 rounded-full portal-circle-shadow bg-white -mt-12 overflow-hidden flex-shrink-0 border-2 border-[#1C7D5A]/20">
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
                  <h4 className="text-lg leading-[26px] font-[700] text-[#123628] text-center truncate w-full">
                    {item.name}
                  </h4>
                  {item.address && (
                    <h5 className="text-xs leading-[18px] font-[500] text-slate-500 truncate max-w-full">
                      {item.address}
                    </h5>
                  )}
                  <div className="flex items-center gap-2 mt-2 flex-wrap justify-center">
                    {item.className && (
                      <p className="text-xs leading-[18px] font-[500] text-slate-600">
                        শ্রেণি:{" "}
                        <span className="text-[#1C7D5A] font-semibold">
                          {item.className}
                        </span>
                      </p>
                    )}
                    {item.roll && (
                      <p className="text-xs leading-[18px] font-[500] text-slate-600">
                        রোল:{" "}
                        <span className="text-[#1C7D5A] font-semibold">{item.roll}</span>
                      </p>
                    )}
                  </div>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="portal-marquee-wrap flex items-center overflow-hidden mt-4 relative py-4">
            <div className="portal-marquee-track gap-5 pt-14 pb-4">
              {[...studentItems, ...studentItems].map((item, i) => (
                <div
                  key={`${item.id || i}-${i}`}
                  className="w-[205px] h-[195px] portal-student-card flex flex-col items-center flex-shrink-0"
                >
                  <div className="w-[102px] h-[102px] p-1 rounded-full portal-circle-shadow bg-white -mt-12 overflow-hidden flex-shrink-0 border-2 border-[#1C7D5A]/20">
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
                    <h4 className="text-lg leading-[26px] font-[700] text-[#123628] text-center truncate w-full">
                      {item.name}
                    </h4>
                    {item.address && (
                      <h5 className="text-xs leading-[18px] font-[500] text-slate-500 truncate max-w-full">
                        {item.address}
                      </h5>
                    )}
                    <div className="flex items-center gap-2 mt-2">
                      {item.className && (
                        <p className="text-xs leading-[18px] font-[500] text-slate-600">
                          শ্রেণি:{" "}
                          <span className="text-[#1C7D5A] font-semibold">
                            {item.className}
                          </span>
                        </p>
                      )}
                      {item.roll && (
                        <p className="text-xs leading-[18px] font-[500] text-slate-600">
                          রোল:{" "}
                          <span className="text-[#1C7D5A] font-semibold">{item.roll}</span>
                        </p>
                      )}
                    </div>
                  </div>
                </div>
              ))}
            </div>

            <div className="hidden sm:block absolute top-0 bottom-0 left-0 w-32 lg:w-52 bg-gradient-to-r from-[#f4f8f6] to-transparent pointer-events-none z-10" />
            <div className="hidden sm:block absolute top-0 bottom-0 right-0 w-32 lg:w-52 bg-gradient-to-l from-[#f4f8f6] to-transparent pointer-events-none z-10" />
          </div>
        )}
      </section>

      {/* ===== 5. All Teachers Section ===== */}
      <section className="max-w-[960px] mx-auto lg:mt-[50px] mt-[30px] p-[10px]">
        <div>
          <PortalReveal>
            <ZapBadge
              text={settings?.teachers?.badge || "আমাদের শিক্ষক"}
              className="justify-center"
            />
          </PortalReveal>
          <PortalReveal>
            <p className="text-[#123628] mt-[20px] text-[30px] text-center leading-[34px] font-[700]">
              {settings?.teachers?.title || "আমাদের সম্মানিত শিক্ষক বৃন্দ"}
            </p>
          </PortalReveal>
        </div>

        {teacherItems.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-[20px] mt-[45px]">
            {teacherItems.map((teacher, idx) => (
              <PortalReveal key={teacher.id || idx}>
                <div className="border border-[#1C7D5A]/15 bg-white rounded-[14px] shadow-md overflow-hidden hover:shadow-lg transition-shadow">
                  <div className="portal-teacher-bg lg:h-[300px] h-[340px] overflow-hidden">
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
                    <h2 className="text-[#123628] text-center text-[20px] font-bold truncate">
                      {teacher.name}
                    </h2>
                    <p className="text-white text-center text-[14px] font-semibold bg-[#1C7D5A] py-[6px] px-3 rounded-full mt-[10px] truncate">
                      {teacher.role || "শিক্ষক"}
                    </p>
                  </div>
                </div>
              </PortalReveal>
            ))}
          </div>
        ) : (
          <div className="mt-8 bg-white rounded-2xl border border-[#1C7D5A]/15 p-8 text-center text-slate-500">
            এখনও কোনো শিক্ষকের তথ্য যুক্ত করা হয়নি।
          </div>
        )}
      </section>

      {/* ===== 6. Video Gallery Section ===== */}
      {videoItems.length > 0 && (
        <PortalReveal>
          <section className="bg-gradient-to-br from-[#123628] via-[#174b37] to-[#1C7D5A] lg:mt-[100px] mt-[50px] relative py-[60px] px-[10px] sm:px-[25px] overflow-hidden">
            <div className="absolute top-0 right-0 pointer-events-none opacity-40">
              <img className="w-[500px]" src="/portal/testi-shape-1.png" alt="" />
            </div>

            <div className="max-w-[1100px] mx-auto relative z-10">
              <div className="lg:flex items-center justify-between mb-6">
                <div>
                  <ZapBadge text={settings?.gallery?.videoBadge || "ভিডিও গ্যালারি"} />
                  <h2 className="text-[28px] lg:text-[30px] font-bold my-[20px] text-white">
                    {settings?.gallery?.videoTitle || `${heroTitle} — ভিডিও গ্যালারি`}
                  </h2>
                </div>
                {videoItems.length > 3 && (
                  <div className="lg:flex items-center gap-[16px] relative z-40 hidden">
                    <button
                      type="button"
                      onClick={handlePrevVideo}
                      aria-label="Previous videos"
                      className="cursor-pointer hover:bg-[#EAB33C] hover:text-[#123628] bg-white p-[10px] rounded-full text-[#1C7D5A] transition-colors"
                    >
                      <ArrowLeft className="w-4 h-4" />
                    </button>
                    <button
                      type="button"
                      onClick={handleNextVideo}
                      aria-label="Next videos"
                      className="cursor-pointer hover:bg-[#EAB33C] hover:text-[#123628] bg-white p-[10px] rounded-full text-[#1C7D5A] transition-colors"
                    >
                      <ArrowRight className="w-4 h-4" />
                    </button>
                  </div>
                )}
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-[20px] relative z-40">
                {visibleVideos.map((vid, idx) => (
                  <YouTubeLiteCard
                    key={vid.youtubeId || idx}
                    youtubeId={vid.youtubeId}
                    title={vid.title}
                  />
                ))}
              </div>
            </div>
          </section>
        </PortalReveal>
      )}

      {/* ===== 7. Photo Gallery Section ===== */}
      {photoItems.length > 0 && (
        <section className="max-w-[1100px] mx-auto lg:mt-[50px] relative py-[60px] p-[10px]">
          <div className="flex items-center justify-center">
            <div>
              <PortalReveal>
                <ZapBadge
                  text={settings?.gallery?.photoBadge || "ছবি গ্যালারি"}
                  className="justify-center"
                />
              </PortalReveal>
              <PortalReveal>
                <h2 className="text-[26px] lg:text-[30px] font-bold my-[20px] text-[#123628] text-center">
                  {settings?.gallery?.photoTitle || `${heroTitle}-এর ছবি গ্যালারি`}
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
                    className="lg:h-[200px] h-[250px] w-full overflow-hidden border border-[#1C7D5A]/15 rounded-[12px] bg-white shadow-xs group cursor-pointer block"
                  >
                    <img
                      className="h-full w-full object-cover rounded-[12px] group-hover:scale-105 transition-transform duration-500"
                      src={resolvedSrc}
                      alt={`${heroTitle} gallery ${idx + 1}`}
                    />
                  </button>
                </PortalReveal>
              );
            })}
          </div>
        </section>
      )}

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
              className="absolute -top-4 -right-4 w-9 h-9 bg-white text-[#123628] rounded-full shadow-lg flex items-center justify-center hover:bg-[#1C7D5A] hover:text-white transition-colors cursor-pointer"
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
