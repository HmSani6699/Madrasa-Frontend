import { useState } from "react";
import { usePortalSettings } from "../../context/PortalSettingsContext";
import { PortalReveal } from "./components/PortalPrimitives";
import { X, Play } from "lucide-react";

const AboutUs = () => {
  const { settings } = usePortalSettings();
  const [showIntroVideo, setShowIntroVideo] = useState(false);

  const madrasaName = settings?.branding?.name || "মাদ্রাসা পোর্টাল";
  const logoSrc = settings?.branding?.logo || "/portal/school.png";
  const bannerImage = settings?.about?.mainImage || "/portal/about1.jpg";
  const introVideoUrl = settings?.about?.introVideoUrl || "";
  const founder = settings?.about?.founder || {};
  const allTeachers = settings?.teachers?.all?.length
    ? settings.teachers.all
    : settings?.teachers?.items || [];

  return (
    <div className="pb-16">
      {/* ======> About Banner <===== */}
      <PortalReveal>
        <div className="portal-about-banner w-full py-[60px]">
          <div className="max-w-[1200px] mx-auto lg:flex items-center justify-center gap-[30px] px-[15px]">
            <div className="lg:w-1/2 text-center lg:text-left">
              <PortalReveal>
                <div className="inline-flex items-center gap-3 bg-white/10 backdrop-blur-xs px-4 py-2 rounded-2xl border border-white/20">
                  <img
                    src={logoSrc}
                    alt={madrasaName}
                    className="h-[52px] w-[52px] object-contain rounded-xl bg-white p-1"
                    onError={(e) => {
                      e.currentTarget.src = "/portal/school.png";
                    }}
                  />
                  <span className="text-white font-bold text-[20px]">
                    {madrasaName}
                  </span>
                </div>
                <p className="text-white/95 mt-[18px] text-[18px] leading-relaxed">
                  {settings?.about?.bannerText ||
                    settings?.about?.description ||
                    `${madrasaName} একটি আদর্শ ও আধুনিক শিক্ষাপ্রতিষ্ঠান, যেখানে প্রযুক্তির মাধ্যমে শিক্ষা পরিচালনা আরও সহজ, স্মার্ট ও কার্যকর করা হয়।`}
                </p>
              </PortalReveal>
            </div>

            <div className="lg:w-1/2 lg:mt-0 mt-[25px]">
              <PortalReveal>
                <div
                  onClick={() => introVideoUrl && setShowIntroVideo(true)}
                  className={`h-[260px] sm:h-[320px] w-full border-[4px] border-white/80 rounded-[20px] relative group overflow-hidden shadow-xl ${
                    introVideoUrl ? "cursor-pointer" : ""
                  }`}
                >
                  <img
                    className="h-full w-full rounded-[15px] object-cover group-hover:scale-105 transition-transform duration-500"
                    src={bannerImage}
                    alt={madrasaName}
                    onError={(e) => {
                      e.currentTarget.src = "/portal/about1.jpg";
                    }}
                  />
                  {introVideoUrl && (
                    <div className="absolute inset-0 bg-black/20 flex items-center justify-center">
                      <div className="w-16 h-16 rounded-full bg-[#1C7D5A] text-white flex items-center justify-center shadow-xl border-2 border-[#EAB33C] group-hover:scale-110 transition-transform">
                        <Play className="w-7 h-7 fill-current ml-0.5" />
                      </div>
                    </div>
                  )}
                </div>
              </PortalReveal>
            </div>
          </div>
        </div>
      </PortalReveal>

      {/* ====> Founder / Principal Card <===== */}
      {(founder?.name || settings?.profile?.adminName) && (
        <div className="w-full md:w-[754px] lg:w-[850px] mx-auto mt-[50px] px-[10px]">
          <PortalReveal>
            <div className="flex flex-col md:flex-row items-center gap-4 md:gap-10 border-2 border-[#1C7D5A]/25 bg-white rounded-[16px] overflow-hidden shadow-md">
              <div className="w-full md:w-[320px] flex-shrink-0">
                <img
                  className="h-[340px] w-full object-cover object-top"
                  src={
                    founder?.image ||
                    settings?.about?.principalImage ||
                    "/portal/bgre.jpg"
                  }
                  alt={founder?.name || settings?.profile?.adminName}
                  onError={(e) => {
                    e.currentTarget.src = "/portal/bgre.jpg";
                  }}
                />
              </div>
              <div className="flex flex-col gap-4 p-6 md:pr-8">
                <p className="text-[#334155] text-[15px] font-[400] leading-[26px]">
                  {founder?.bio ||
                    `${madrasaName}-এর পরিচালনায় শিক্ষার্থীদের নৈতিকতা, আদর্শ চরিত্র ও আধুনিক শিক্ষার সমন্বয়ে যোগ্য নাগরিক হিসেবে গড়ে তোলার নিরলস প্রচেষ্টা অব্যাহত রয়েছে।`}
                </p>
                <div className="pt-2 border-t border-slate-100">
                  <h2 className="text-[#123628] text-[22px] font-[700] leading-[28px]">
                    {founder?.name || settings?.profile?.adminName}
                  </h2>
                  <p className="text-[#1C7D5A] text-[14px] font-[600] leading-[20px] mt-0.5">
                    {founder?.designation ||
                      settings?.profile?.designation ||
                      "প্রতিষ্ঠাতা ও মুহতামিম"}
                  </p>
                </div>
              </div>
            </div>
          </PortalReveal>
        </div>
      )}

      {/* =====> Instructors Grid <====== */}
      <div className="w-full lg:max-w-[1096px] mx-auto py-12 bg-[#e8f5f0]/50 border border-[#1C7D5A]/10 rounded-[16px] px-5 relative lg:mt-[40px] mt-[30px] mb-[50px]">
        <h2 className="text-center text-[24px] lg:text-[28px] font-bold text-[#123628] mb-8">
          {settings?.teachers?.title || "আমাদের সম্মানিত শিক্ষক ও স্টাফ বৃন্দ"}
        </h2>

        {allTeachers.length > 0 ? (
          <div className="mx-auto grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-4">
            {allTeachers.map((item, i) => (
              <PortalReveal key={item.id || i}>
                <div className="w-full max-w-[200px] mx-auto bg-white rounded-[12px] border border-[#1C7D5A]/10 shadow-xs overflow-hidden hover:shadow-md transition-shadow">
                  <div className="h-16 overflow-hidden bg-gradient-to-r from-[#123628] to-[#1C7D5A]" />
                  <div className="mx-auto w-24 h-24 relative -mt-12 border-4 border-white rounded-full overflow-hidden shadow-sm bg-white">
                    <img
                      className="object-cover object-top w-full h-full"
                      src={item.image || item.img || "/portal/Teacher/teacher5.png"}
                      alt={item.name}
                      onError={(e) => {
                        e.currentTarget.src = "/portal/Teacher/teacher5.png";
                      }}
                    />
                  </div>
                  <div className="p-3 text-center">
                    <h3 className="text-[#123628] text-[17px] font-[700] leading-[24px] truncate">
                      {item.name}
                    </h3>
                    <p className="text-[#1C7D5A] text-[13px] font-[600] leading-[18px] mt-1 truncate">
                      {item.role || item.position || "শিক্ষক"}
                    </p>
                    {item.department && (
                      <p className="text-slate-500 text-[12px] mt-0.5 truncate">
                        {item.department}
                      </p>
                    )}
                  </div>
                </div>
              </PortalReveal>
            ))}
          </div>
        ) : (
          <p className="text-center text-slate-500 py-6">
            এখনও কোনো শিক্ষকের তথ্য যুক্ত করা হয়নি।
          </p>
        )}
      </div>

      {/* Video Modal */}
      {showIntroVideo && introVideoUrl && (
        <div
          className="fixed inset-0 z-[200] bg-black/80 flex items-center justify-center p-4"
          onClick={() => setShowIntroVideo(false)}
        >
          <div
            className="relative max-w-3xl w-full bg-black rounded-2xl overflow-hidden aspect-video"
            onClick={(e) => e.stopPropagation()}
          >
            <button
              type="button"
              onClick={() => setShowIntroVideo(false)}
              className="absolute top-3 right-3 z-10 w-8 h-8 bg-white rounded-full flex items-center justify-center text-[#123628] hover:bg-[#1C7D5A] hover:text-white transition-colors cursor-pointer"
            >
              <X className="w-4 h-4" />
            </button>
            <iframe
              className="w-full h-full"
              src={
                introVideoUrl.includes("?")
                  ? `${introVideoUrl}&autoplay=1`
                  : `${introVideoUrl}?autoplay=1`
              }
              title={`${madrasaName} Introduction`}
              allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
              allowFullScreen
            />
          </div>
        </div>
      )}
    </div>
  );
};

export default AboutUs;
