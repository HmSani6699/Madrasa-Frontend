import { useState } from "react";
import { usePortalSettings } from "../../context/PortalSettingsContext";
import { PortalReveal } from "./components/PortalPrimitives";
import { X } from "lucide-react";

const AboutUs = () => {
  const { settings } = usePortalSettings();
  const [showIntroVideo, setShowIntroVideo] = useState(false);

  const allTeachers = [
    { id: 5, name: "Noman Hossain", position: "English Teacher", img: "/portal/Teacher/teacher5.png" },
    { id: 6, name: "Nasir Uddin", position: "Bangla Teacher", img: "/portal/Teacher/teacher6.png" },
    { id: 1, name: "Sadiqur Rahman", position: "Founder & Principal", img: "/portal/Teacher/teacher1.png" },
    { id: 2, name: "Mahfuj Alom", position: "Hadis Teacher", img: "/portal/Teacher/teacher2.png" },
    { id: 3, name: "Jubayer Hossain", position: "Bangla Teacher", img: "/portal/Teacher/teacher3.png" },
    { id: 4, name: "Mominul Islam", position: "Arabic Teacher", img: "/portal/Teacher/teacher4.png" },
    { id: 7, name: "Noman Hossain", position: "English Teacher", img: "/portal/Teacher/teacher5.png" },
    { id: 8, name: "Nasir Uddin", position: "Bangla Teacher", img: "/portal/Teacher/teacher6.png" },
    { id: 9, name: "Mominul Islam", position: "Arabic Teacher", img: "/portal/Teacher/teacher4.png" },
    { id: 10, name: "Mahfuj Alom", position: "Hadis Teacher", img: "/portal/Teacher/teacher2.png" },
  ];

  return (
    <div className="pb-16">
      {/* ======> About Banner <===== */}
      <PortalReveal>
        <div className="portal-about-banner w-full py-[60px]">
          <div className="max-w-[1200px] mx-auto lg:flex items-center justify-center gap-[30px] px-[15px]">
            <div className="lg:w-1/2 text-center lg:text-left">
              <PortalReveal>
                <img
                  src="/portal/logo1.png"
                  alt={settings?.branding?.name || "Logo"}
                  className="mx-auto lg:mx-0 max-h-[70px] w-auto"
                />
                <p className="text-white mt-[15px] text-[18px] leading-relaxed">
                  {settings?.branding?.name || "EduSadiq"} হলো একটি আধুনিক
                  শিক্ষাপ্রতিষ্ঠান ব্যবস্থাপনা প্ল্যাটফর্ম, যেখানে প্রযুক্তির
                  মাধ্যমে শিক্ষা পরিচালনা আরও সহজ, স্মার্ট ও কার্যকর করা হয়।
                  ইতিমধ্যেই ১৫০+ প্রতিষ্ঠান, ২০,০০০+ শিক্ষার্থী, ৮০০+ শিক্ষক এবং
                  ১৯,০০০+ অভিভাবক আমাদের সেবার সাথে যুক্ত হয়ে উপকৃত হচ্ছেন।
                </p>
              </PortalReveal>
            </div>
            <div className="lg:w-1/2 lg:mt-0 mt-[25px]">
              <PortalReveal>
                <div
                  onClick={() => setShowIntroVideo(true)}
                  className="h-full w-full border-[5px] border-white/80 rounded-[20px] relative cursor-pointer group overflow-hidden"
                >
                  <img
                    className="h-full w-full rounded-[15px] object-cover group-hover:scale-105 transition-transform duration-500"
                    src="/portal/about1.jpg"
                    alt="About Banner"
                  />
                  <img
                    className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-16 h-16 group-hover:scale-110 transition-transform"
                    src="/portal/video_play_green.svg"
                    alt="Play Video"
                  />
                </div>
              </PortalReveal>
            </div>
          </div>
        </div>
      </PortalReveal>

      {/* ====> Founder Card <===== */}
      <div className="w-full md:w-[754px] lg:w-[813px] mx-auto mt-[50px] px-[10px]">
        <PortalReveal>
          <div className="flex flex-col md:flex-row items-center gap-4 md:gap-10 lg:border-2 border-[#53DFC3] bg-[#F5F5F5] rounded-[12px] overflow-hidden shadow-sm">
            <div className="w-full md:w-[320px] flex-shrink-0">
              <img
                className="h-[340px] w-full object-cover lg:rounded-l-[10px]"
                src="/portal/bgre.jpg"
                alt="Founder"
              />
            </div>
            <div className="flex flex-col gap-4 p-5 md:pr-8">
              <h1 className="text-[#162726] text-[15px] font-[400] leading-[24px]">
                অত্র প্রতিষ্ঠানের প্রতিষ্ঠাতা একজন মেধাবী, অভিজ্ঞ ও
                শিক্ষানুরাগী ব্যক্তিত্ব, যিনি শিক্ষার্থীদের নৈতিকতা ও আধুনিক
                শিক্ষার সমন্বয়ে গড়ে তুলতে দৃঢ় প্রতিশ্রুতিবদ্ধ। তাঁর দক্ষ
                নেতৃত্বে প্রতিষ্ঠানটি শিক্ষাক্ষেত্রে একটি গ্রহণযোগ্য অবস্থান
                তৈরি করেছে।
              </h1>
              <div>
                <h2 className="text-[#2872A4] text-[20px] font-[600] leading-[28px]">
                  হাফেজ সাদিকুর রহমান সানি
                </h2>
                <p className="text-slate-600 text-[14px] font-[500] leading-[18px]">
                  অত্র প্রতিষ্ঠানের প্রতিষ্ঠাতা
                </p>
              </div>
            </div>
          </div>
        </PortalReveal>
      </div>

      {/* =====> Instructors Grid <====== */}
      <div className="w-full lg:max-w-[1096px] mx-auto py-12 bg-[#F5F5F5] rounded-[10px] px-5 relative lg:mt-[40px] mt-[30px] mb-[50px]">
        <div className="mx-auto grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-4">
          {allTeachers.map((item, i) => (
            <PortalReveal key={i}>
              <div className="w-full max-w-[186px] mx-auto bg-white rounded-[8px] shadow-xs overflow-hidden">
                <div className="h-16 overflow-hidden bg-[#F5F5F5]" />
                <div className="mx-auto w-24 h-24 relative -mt-12 border-4 border-white rounded-full overflow-hidden shadow-sm">
                  <img
                    className="object-cover object-top w-full h-full"
                    src={item.img}
                    alt={item.name}
                  />
                </div>
                <div className="p-3 text-center">
                  <h3 className="text-black text-[18px] font-[600] leading-[24px]">
                    {item.name}
                  </h3>
                  <p className="text-slate-500 text-[13px] font-[500] leading-[18px] mt-1">
                    {item.position}
                  </p>
                </div>
              </div>
            </PortalReveal>
          ))}
        </div>
      </div>

      {/* Video Modal */}
      {showIntroVideo && (
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
              className="absolute top-3 right-3 z-10 w-8 h-8 bg-white rounded-full flex items-center justify-center text-slate-900 cursor-pointer"
            >
              <X className="w-4 h-4" />
            </button>
            <iframe
              className="w-full h-full"
              src="https://www.youtube.com/embed/Hv8yinlIWJ8?autoplay=1"
              title="Academy Introduction"
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
