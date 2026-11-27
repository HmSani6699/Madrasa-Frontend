import { useState, useEffect, useRef } from "react";
import { Outlet, Link, useLocation, useParams } from "react-router-dom";
import {
  Mail,
  Menu,
  X,
  LogIn,
  Home as HomeIcon,
  Users,
  GraduationCap,
  Contact as ContactIcon,
} from "lucide-react";
import { usePortalSettings } from "../context/PortalSettingsContext";
import {
  WhatsAppIcon,
  FacebookIcon,
  YouTubeIcon,
  TwitterIcon,
  LinkedInIcon,
  InstagramIcon,
  PortalReveal,
} from "../Pages/Portal/components/PortalPrimitives";
import "../Pages/Portal/portal.css";

const PortalLayout = () => {
  const { settings, loadPortalBySlug } = usePortalSettings();
  const { slug } = useParams();
  const location = useLocation();
  const [isOpenMenu, setIsOpenMenu] = useState(false);
  const [isOpenProfileMenu, setIsOpenProfileMenu] = useState(false);
  const profileRef = useRef(null);

  useEffect(() => {
    if (slug) {
      loadPortalBySlug(slug);
    }
  }, [slug, loadPortalBySlug]);

  useEffect(() => {
    const handleClickOutside = (e) => {
      if (profileRef.current && !profileRef.current.contains(e.target)) {
        setIsOpenProfileMenu(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const basePath = slug ? `/${slug}` : "";
  const logoSrc = settings?.branding?.logo || "/portal/school.png";
  const footerLogoSrc = settings?.branding?.footerLogo || "/portal/logo2.png";
  const phone = settings?.contact?.phone || "+8801830-630365";
  const email = settings?.contact?.email || "info.edusadiq@gmail.com";
  const social = settings?.contact?.social || {};

  const navLinks = [
    { path: basePath || "/", label: "হোম", icon: HomeIcon, exact: true },
    { path: `${basePath}/about`, label: "আমাদের সম্পর্কে", icon: Users },
    { path: `${basePath}/admission`, label: "ভর্তি", icon: GraduationCap },
    { path: `${basePath}/contact`, label: "যোগাযোগ", icon: ContactIcon },
  ];

  const isActive = (linkPath, exact = false) => {
    if (exact) return location.pathname === linkPath || location.pathname === `${linkPath}/`;
    return location.pathname.startsWith(linkPath);
  };

  const socialItems = [
    { href: social.facebook || "https://www.facebook.com/official.edusadiq", Icon: FacebookIcon, label: "Facebook" },
    { href: social.youtube || "https://www.youtube.com/@Edusadiq1", Icon: YouTubeIcon, label: "YouTube" },
    { href: social.twitter || "https://www.facebook.com/official.edusadiq", Icon: TwitterIcon, label: "Twitter" },
    { href: social.linkedin || "https://www.facebook.com/official.edusadiq", Icon: LinkedInIcon, label: "LinkedIn" },
    { href: social.instagram || "https://www.facebook.com/official.edusadiq", Icon: InstagramIcon, label: "Instagram" },
  ];

  return (
    <div className="portal-root relative flex flex-col">
      {/* ======> Top Support Bar <====== */}
      <div className="hidden lg:block bg-[#043334] text-white py-[10px] font-semibold border-b border-gray-500">
        <div className="max-w-[1200px] mx-auto px-4 flex items-center justify-between">
          <div className="flex items-center lg:gap-[30px] gap-[10px]">
            <a
              href={`https://wa.me/${phone.replace(/[^\d]/g, "")}`}
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-[6px] text-[14px] lg:text-[16px] hover:text-[#07A698] transition-colors"
            >
              <WhatsAppIcon className="w-4 h-4" />
              <span>{phone}</span>
            </a>
            <a
              href={`mailto:${email}`}
              className="flex items-center gap-[6px] text-[14px] lg:text-[16px] hover:text-[#07A698] transition-colors"
            >
              <Mail className="w-4 h-4" />
              <span>{email}</span>
            </a>
          </div>
          <div className="justify-center lg:justify-start gap-[15px] hidden lg:flex">
            {socialItems.map((socialItem) => {
              const SocialIcon = socialItem.Icon;
              return (
                <a
                  key={socialItem.label}
                  href={socialItem.href}
                  target="_blank"
                  rel="noopener noreferrer"
                  aria-label={socialItem.label}
                >
                  <div className="group hover:bg-[#07A698] h-[35px] w-[35px] flex items-center justify-center rounded-full bg-slate-200 transition-colors duration-500 cursor-pointer">
                    <SocialIcon className="text-black w-[18px] h-[18px] group-hover:text-white transition-colors" />
                  </div>
                </a>
              );
            })}
          </div>
        </div>
      </div>

      {/* ======> Institutional Triple Branding Header (Desktop) <====== */}
      <div className="bg-white/60 lg:block hidden border-b border-slate-100">
        <div className="lg:flex items-center justify-between max-w-[1060px] mx-auto px-4 py-2">
          {/* English Name */}
          <div className="text-center">
            <h2 className="text-[28px] xl:text-[30px] font-bold text-[#162726]">
              {settings?.branding?.englishName || "Al-Quranul Kareem Academy"}
            </h2>
            <p className="font-semibold text-slate-600 text-[15px]">
              {settings?.branding?.englishLocation || "Pakunda, Sonargon, Narayongonj"}
            </p>
          </div>
          {/* Madrasa Crest Logo */}
          <Link to={basePath || "/"} className="w-[135px] flex-shrink-0 flex justify-center">
            <img
              src={logoSrc}
              alt={settings?.branding?.name || "Madrasa Logo"}
              className="w-[135px] h-auto object-contain"
              onError={(e) => {
                e.currentTarget.src = "/portal/school.png";
              }}
            />
          </Link>
          {/* Arabic Name */}
          <div className="text-center" dir="rtl">
            <h2 className="text-[26px] xl:text-[30px] font-bold text-[#162726] font-arabic">
              {settings?.branding?.arabicName || "أكاديمية القرآن الكريم الإسلامية التعليمية"}
            </h2>
            <p className="font-semibold text-slate-600 text-[15px] font-arabic">
              {settings?.branding?.arabicLocation || "بَكُونْدَا، سُونَارْغَاوْ، نَارَايَنْغَنْج"}
            </p>
          </div>
        </div>
      </div>

      {/* ======> Main Sticky White Navbar <====== */}
      <div className="bg-white sticky top-0 z-50 shadow-xs">
        {/* Desktop Navbar */}
        <div className="hidden max-w-[1200px] mx-auto px-4 py-[10px] lg:flex items-center justify-between">
          <Link to={basePath || "/"} className="flex items-center justify-center">
            <div className="w-[40px] h-[40px] bg-white rounded-full border-[#07A698] border-2 overflow-hidden flex items-center justify-center">
              <img
                src={logoSrc}
                alt="Logo"
                className="w-full h-full object-contain"
                onError={(e) => {
                  e.currentTarget.src = "/portal/school.png";
                }}
              />
            </div>
          </Link>

          <div className="flex items-center gap-[30px]">
            {navLinks.map((item) => {
              const active = isActive(item.path, item.exact);
              return (
                <div key={item.path} className="group relative pb-1">
                  <Link
                    to={item.path}
                    className={`transition-colors duration-300 font-semibold text-[16px] ${
                      active ? "text-[#07A698]" : "text-[#162726] hover:text-[#07A698]"
                    }`}
                  >
                    {item.label}
                  </Link>
                  <div
                    className={`absolute left-0 bottom-0 h-[2px] bg-[#07A698] transition-all duration-300 ${
                      active ? "w-full" : "w-0 group-hover:w-full"
                    }`}
                  />
                </div>
              );
            })}
          </div>

          {/* Right Profile Dropdown + Login */}
          <div className="relative" ref={profileRef}>
            <button
              type="button"
              onClick={() => setIsOpenProfileMenu(!isOpenProfileMenu)}
              className="flex items-center justify-center cursor-pointer focus:outline-none"
              aria-label="Account menu"
            >
              <div className="w-[40px] h-[40px] bg-white rounded-full border-[#07A698] border-2 overflow-hidden">
                <img
                  className="w-full h-full object-cover"
                  src="/portal/Teacher/teacher1.png"
                  alt="Admin"
                />
              </div>
            </button>

            {isOpenProfileMenu && (
              <div className="absolute top-[50px] right-0 bg-white z-50 border border-slate-200 rounded-[8px] shadow-lg p-[20px] min-w-[230px]">
                <div className="flex items-center justify-center">
                  <div className="w-[50px] h-[50px] bg-white rounded-full border-[#07A698] border-2 overflow-hidden">
                    <img
                      className="w-full h-full object-cover"
                      src="/portal/Teacher/teacher1.png"
                      alt="Principal"
                    />
                  </div>
                </div>
                <h2 className="text-[18px] whitespace-nowrap font-bold text-[#1d5276] text-center mt-2">
                  {settings?.profile?.adminName || "MD: Sadiqur Rahman"}
                </h2>
                <div className="border-[#07A698] border my-[8px]" />

                <div className="flex flex-col gap-[12px] mt-[14px]">
                  <Link
                    to={`${basePath}/online-admission`}
                    onClick={() => setIsOpenProfileMenu(false)}
                    className="text-[15px] font-semibold text-[#1d5276] hover:text-[#07A698] transition-colors text-center"
                  >
                    অনলাইন ভর্তি ফরম
                  </Link>
                  <Link to="/login" onClick={() => setIsOpenProfileMenu(false)}>
                    <button
                      type="button"
                      className="flex items-center justify-center gap-[6px] text-white bg-[#07A698] hover:bg-[#058c80] py-[6px] px-[15px] rounded-[6px] w-full font-semibold transition-colors cursor-pointer"
                    >
                      Log In <LogIn className="w-4 h-4" />
                    </button>
                  </Link>
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Mobile Navbar */}
        <div className="lg:hidden flex items-center justify-between bg-white max-w-[1200px] mx-auto py-[12px] px-[14px]">
          <Link to={basePath || "/"} className="flex items-center gap-[6px]">
            <div className="w-[40px] h-[40px] bg-white rounded-full border-[#07A698] border-2 overflow-hidden">
              <img
                src={logoSrc}
                alt="Logo"
                className="w-full h-full object-contain"
                onError={(e) => {
                  e.currentTarget.src = "/portal/school.png";
                }}
              />
            </div>
          </Link>
          <h2 className="text-[18px] sm:text-[20px] truncate max-w-[220px] font-bold text-[#1d5276]">
            {settings?.branding?.name || "আল-কুরআনুল কারীম একাডেমি"}
          </h2>
          <button
            type="button"
            onClick={() => setIsOpenMenu(!isOpenMenu)}
            className="p-1 text-[#162726] cursor-pointer"
            aria-label="Toggle Menu"
          >
            {isOpenMenu ? <X className="w-7 h-7" /> : <Menu className="w-7 h-7" />}
          </button>
        </div>

        {/* Mobile Dropdown Drawer */}
        {isOpenMenu && (
          <div className="lg:hidden absolute top-full left-0 bg-white w-full z-[100] p-[20px] border-t border-slate-200 shadow-xl">
            <div className="flex flex-col gap-[12px]">
              {navLinks.map((item) => {
                const Icon = item.icon;
                return (
                  <Link
                    key={item.path}
                    to={item.path}
                    onClick={() => setIsOpenMenu(false)}
                    className="flex items-center gap-[10px] py-1.5 text-[#162726] hover:text-[#07A698] font-semibold"
                  >
                    <div className="w-[30px] h-[30px] flex items-center justify-center rounded-full bg-[#07a6981a] text-[#07A698]">
                      <Icon className="w-4 h-4" />
                    </div>
                    {item.label}
                  </Link>
                );
              })}
              <Link
                to={`${basePath}/online-admission`}
                onClick={() => setIsOpenMenu(false)}
                className="flex items-center gap-[10px] py-1.5 text-[#07A698] font-bold"
              >
                <div className="w-[30px] h-[30px] flex items-center justify-center rounded-full bg-[#07a6981a] text-[#07A698]">
                  <GraduationCap className="w-4 h-4" />
                </div>
                অনলাইন ভর্তি ফরম
              </Link>
            </div>

            <Link to="/login" onClick={() => setIsOpenMenu(false)}>
              <button
                type="button"
                className="flex items-center justify-center gap-[6px] text-white bg-[#07A698] py-[8px] px-[15px] rounded-[6px] mt-[20px] w-full font-semibold"
              >
                Log In <LogIn className="w-4 h-4" />
              </button>
            </Link>
          </div>
        )}
      </div>

      {/* ======> Main Page Outlet <====== */}
      <main className="flex-1">
        <Outlet />
      </main>

      {/* ======> Footer (Cloned from Edu-Main-Landing-Demo Footer) <====== */}
      <footer className="mt-[40px]">
        <PortalReveal>
          <div className="portal-footer-container text-white w-full relative p-[15px] bg-[#1e567b]">
            <div className="h-full w-full top-0 left-0 opacity-[0.30] absolute pointer-events-none" />
            <div className="max-w-[1280px] mx-auto lg:flex items-center justify-between lg:px-[50px] lg:py-[30px] relative z-10 gap-10">
              {/* Brand Column */}
              <div className="w-full mt-[30px] lg:mt-0">
                <div className="flex justify-center items-center lg:justify-start gap-[20px]">
                  <div className="w-[200px]">
                    <img
                      className="w-[200px] h-auto"
                      src={footerLogoSrc}
                      alt="Portal Footer Logo"
                      onError={(e) => {
                        e.currentTarget.src = "/portal/logo2.png";
                      }}
                    />
                  </div>
                </div>
                <p className="text-white text-[17px] mt-[25px] lg:pr-[60px] text-center lg:text-left leading-relaxed">
                  {settings?.footer?.aboutText ||
                    "Edusadiq মাদ্রাসা ম্যানেজমেন্ট সফটওয়্যার। ছাত্র, শিক্ষক, হিসাব ও ফলাফল ব্যবস্থাপনা সবকিছু এখন এক প্ল্যাটফর্মে সহজ ও সাশ্রয়ীভাবে।"}
                </p>
                {/* Social Links */}
                <div className="flex justify-center lg:justify-start gap-[15px] mt-[25px]">
                  {[
                    { href: social.facebook || "#", Icon: FacebookIcon },
                    { href: social.twitter || "#", Icon: TwitterIcon },
                    { href: social.linkedin || "#", Icon: LinkedInIcon },
                    { href: social.instagram || "#", Icon: InstagramIcon },
                  ].map((item, idx) => {
                    const FooterSocialIcon = item.Icon;
                    return (
                      <a
                        key={idx}
                        href={item.href}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="group hover:bg-[#07A698] h-[35px] w-[35px] flex items-center justify-center rounded-full bg-slate-200 transition-colors duration-500 cursor-pointer"
                      >
                        <FooterSocialIcon className="text-black w-[18px] h-[18px] group-hover:text-white transition-colors" />
                      </a>
                    );
                  })}
                </div>
              </div>

              {/* Quick Links Column */}
              <div className="w-full whitespace-nowrap mt-[40px] lg:mt-0 text-center lg:text-left">
                <h2 className="text-[25px] font-semibold mb-[20px]">দ্রুত তথ্য</h2>
                <p className="text-[18px] mb-[10px]">
                  <Link to={basePath || "/"} className="hover:text-[#07A698] transition-colors">
                    হোম
                  </Link>
                </p>
                <p className="text-[18px] mb-[10px]">
                  <Link to={`${basePath}/about`} className="hover:text-[#07A698] transition-colors">
                    আমাদের সম্পর্কে
                  </Link>
                </p>
                <p className="text-[18px] mb-[10px]">
                  <Link to={`${basePath}/admission`} className="hover:text-[#07A698] transition-colors">
                    ভর্তি
                  </Link>
                </p>
                <p className="text-[18px] mb-[10px]">
                  <Link to={`${basePath}/contact`} className="hover:text-[#07A698] transition-colors">
                    যোগাযোগ
                  </Link>
                </p>
              </div>

              {/* Contact Column */}
              <div className="whitespace-nowrap mt-[40px] lg:mt-0 text-center lg:text-left">
                <h2 className="text-[25px] font-semibold mb-[20px]">যোগাযোগ করুন</h2>
                <p className="text-[18px] mb-[10px]">
                  <span>ফোন: </span> {phone}
                </p>
                <p className="text-[18px] mb-[10px]">
                  <span>ইমেইল: </span> {email}
                </p>
                <p className="text-[18px] mb-[10px]">
                  <span>সাপোর্ট : </span> {phone}
                </p>
              </div>
            </div>

            <div className="border-t-[1px] border-[#ffffff26] py-[20px] mt-6 relative z-10">
              <p className="text-center text-[14px]">
                {settings?.footer?.copyright || "© Edusadiq. All Rights Reserved."}
              </p>
            </div>
          </div>
        </PortalReveal>
      </footer>
    </div>
  );
};

export default PortalLayout;
