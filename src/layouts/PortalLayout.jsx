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
  Loader2,
  AlertCircle,
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
  const { settings, loadPortalBySlug, loading, notFound } = usePortalSettings();
  const { slug } = useParams();
  const location = useLocation();
  const [isOpenMenu, setIsOpenMenu] = useState(false);
  const [isOpenProfileMenu, setIsOpenProfileMenu] = useState(false);
  const [failedBannerSrc, setFailedBannerSrc] = useState(null);
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
  const madrasaName = settings?.branding?.name || "মাদ্রাসা পোর্টাল";
  const englishName = settings?.branding?.englishName || madrasaName;
  const englishLocation =
    settings?.branding?.englishLocation || settings?.contact?.address || "";
  const arabicName = settings?.branding?.arabicName || "";
  const arabicLocation = settings?.branding?.arabicLocation || "";
  const logoSrc = settings?.branding?.logo || "/portal/school.png";
  const headerBanner = settings?.branding?.headerBanner || "";
  const showHeaderBanner = Boolean(headerBanner && failedBannerSrc !== headerBanner);
  const rawFooterLogo = settings?.branding?.footerLogo;
  const footerLogoSrc =
    rawFooterLogo && rawFooterLogo !== "/whitelogo.png"
      ? rawFooterLogo
      : logoSrc;
  const adminPhoto =
    settings?.profile?.adminPhoto ||
    settings?.about?.principalImage ||
    logoSrc ||
    "/portal/Teacher/teacher1.png";
  const phone = settings?.contact?.phone || "";
  const email = settings?.contact?.email || "";
  const social = settings?.contact?.social || {};

  const themeStyle = {
    "--portal-primary": settings?.theme?.primary || "#1C7D5A",
    "--portal-primary-dark": settings?.theme?.primaryDark || "#123628",
    "--portal-primary-light": settings?.theme?.primaryLight || "#e8f5f0",
    "--portal-secondary": settings?.theme?.secondary || "#EAB33C",
    "--portal-secondary-dark": settings?.theme?.secondaryDark || "#c99327",
  };

  const navLinks = [
    { path: basePath || "/", label: "হোম", icon: HomeIcon, exact: true },
    { path: `${basePath}/about`, label: "আমাদের সম্পর্কে", icon: Users },
    { path: `${basePath}/admission`, label: "ভর্তি", icon: GraduationCap },
    { path: `${basePath}/contact`, label: "যোগাযোগ", icon: ContactIcon },
  ];

  const isActive = (linkPath, exact = false) => {
    if (exact) {
      return location.pathname === linkPath || location.pathname === `${linkPath}/`;
    }
    return location.pathname.startsWith(linkPath);
  };

  const socialItems = [
    { href: social.facebook, Icon: FacebookIcon, label: "Facebook" },
    { href: social.youtube, Icon: YouTubeIcon, label: "YouTube" },
    { href: social.twitter, Icon: TwitterIcon, label: "Twitter" },
    { href: social.linkedin, Icon: LinkedInIcon, label: "LinkedIn" },
    { href: social.instagram, Icon: InstagramIcon, label: "Instagram" },
  ].filter((item) => Boolean(item.href && item.href.trim()));

  if (loading && !settings?.madrasa) {
    return (
      <div
        style={themeStyle}
        className="portal-root min-h-screen flex items-center justify-center"
      >
        <div className="flex flex-col items-center gap-3 text-center px-4">
          <Loader2 className="w-10 h-10 text-[#1C7D5A] animate-spin" />
          <p className="text-[#123628] font-semibold text-base">
            পোর্টাল তথ্য লোড হচ্ছে...
          </p>
        </div>
      </div>
    );
  }

  if (notFound) {
    return (
      <div
        style={themeStyle}
        className="portal-root min-h-screen flex items-center justify-center px-4"
      >
        <div className="max-w-md w-full bg-white rounded-2xl border border-[#1C7D5A]/15 shadow-lg p-8 text-center space-y-4">
          <div className="w-14 h-14 mx-auto rounded-2xl bg-[#fef8eb] text-[#c99327] flex items-center justify-center">
            <AlertCircle className="w-7 h-7" />
          </div>
          <h1 className="text-2xl font-bold text-[#123628]">প্রতিষ্ঠান পাওয়া যায়নি</h1>
          <p className="text-sm text-slate-600">
            দুঃখিত, এই পোর্টাল লিংকের সাথে কোনো নিবন্ধিত মাদ্রাসা খুঁজে পাওয়া যায়নি।
          </p>
          <Link
            to="/"
            className="inline-flex items-center justify-center px-6 py-2.5 rounded-xl bg-[#1C7D5A] hover:bg-[#123628] text-white font-semibold text-sm transition-colors"
          >
            মূল হোম পেজে ফিরে যান
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div style={themeStyle} className="portal-root relative flex flex-col">
      {/* ======> Top Support Bar <====== */}
      <div className="hidden lg:block bg-[#123628] text-white py-[10px] font-semibold border-b border-white/10">
        <div className="max-w-[1200px] mx-auto px-4 flex items-center justify-between">
          <div className="flex items-center lg:gap-[30px] gap-[10px]">
            {phone && (
              <a
                href={`https://wa.me/${phone.replace(/[^\d]/g, "")}`}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-[6px] text-[14px] lg:text-[15px] hover:text-[#EAB33C] transition-colors"
              >
                <WhatsAppIcon className="w-4 h-4 text-[#EAB33C]" />
                <span>{phone}</span>
              </a>
            )}
            {email && (
              <a
                href={`mailto:${email}`}
                className="flex items-center gap-[6px] text-[14px] lg:text-[15px] hover:text-[#EAB33C] transition-colors"
              >
                <Mail className="w-4 h-4 text-[#EAB33C]" />
                <span>{email}</span>
              </a>
            )}
            {!phone && !email && (
              <span className="text-[14px] text-white/85">{madrasaName}</span>
            )}
          </div>
          {socialItems.length > 0 && (
            <div className="justify-center lg:justify-start gap-[12px] hidden lg:flex">
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
                    <div className="group hover:bg-[#1C7D5A] h-[34px] w-[34px] flex items-center justify-center rounded-full bg-white/10 border border-white/15 transition-colors duration-300 cursor-pointer">
                      <SocialIcon className="text-white w-[16px] h-[16px] transition-colors" />
                    </div>
                  </a>
                );
              })}
            </div>
          )}
        </div>
      </div>

      {/* ======> Institutional Triple Branding Header (Desktop) <====== */}
      <div className="bg-white/85 lg:block hidden border-b border-[#1C7D5A]/10">
        {showHeaderBanner ? (
          <div className="max-w-[1200px] mx-auto px-4 py-2.5 flex items-center justify-center">
            <Link
              to={basePath || "/"}
              className="w-full flex items-center justify-center"
            >
              <img
                src={headerBanner}
                alt={madrasaName}
                className="max-h-[120px] w-auto max-w-full object-contain mx-auto"
                onError={() => setFailedBannerSrc(headerBanner)}
              />
            </Link>
          </div>
        ) : (
          <div
            className={`lg:flex items-center ${arabicName ? "justify-between" : "justify-center gap-10"
              } max-w-[1060px] mx-auto px-4 py-3`}
          >
            {/* English / Primary Name */}
            <div className={arabicName ? "text-center" : "text-left"}>
              <h2 className="text-[26px] xl:text-[30px] font-bold text-[#123628]">
                {englishName}
              </h2>
              {englishLocation && (
                <p className="font-semibold text-slate-600 text-[15px]">
                  {englishLocation}
                </p>
              )}
            </div>

            {/* Madrasa Crest Logo */}
            <Link
              to={basePath || "/"}
              className="w-[120px] flex-shrink-0 flex justify-center"
            >
              <img
                src={logoSrc}
                alt={madrasaName}
                className="w-[110px] h-[110px] object-contain"
                onError={(e) => {
                  e.currentTarget.src = "/portal/school.png";
                }}
              />
            </Link>

            {/* Arabic Name (shown when configured) */}
            {arabicName && (
              <div className="text-center" dir="rtl">
                <h2 className="text-[26px] xl:text-[30px] font-bold text-[#123628] font-arabic">
                  {arabicName}
                </h2>
                {arabicLocation && (
                  <p className="font-semibold text-slate-600 text-[15px] font-arabic">
                    {arabicLocation}
                  </p>
                )}
              </div>
            )}
          </div>
        )}
      </div>

      {/* ======> Main Sticky White Navbar <====== */}
      <div className="bg-white sticky top-0 z-50 shadow-xs border-b border-slate-100">
        {/* Desktop Navbar */}
        <div className="hidden max-w-[1200px] mx-auto px-4 py-[10px] lg:flex items-center justify-between">
          <Link to={basePath || "/"} className="flex items-center gap-3">
            <div className="w-[42px] h-[42px] bg-white rounded-full border-[#1C7D5A] border-2 overflow-hidden flex items-center justify-center p-0.5">
              <img
                src={logoSrc}
                alt="Logo"
                className="w-full h-full object-contain"
                onError={(e) => {
                  e.currentTarget.src = "/portal/school.png";
                }}
              />
            </div>
            <span className="font-bold text-[#123628] text-[16px] max-w-[240px] truncate">
              {madrasaName}
            </span>
          </Link>

          <div className="flex items-center gap-[30px]">
            {navLinks.map((item) => {
              const active = isActive(item.path, item.exact);
              return (
                <div key={item.path} className="group relative pb-1">
                  <Link
                    to={item.path}
                    className={`transition-colors duration-300 font-semibold text-[16px] ${active
                      ? "text-[#1C7D5A]"
                      : "text-[#0f172a] hover:text-[#1C7D5A]"
                      }`}
                  >
                    {item.label}
                  </Link>
                  <div
                    className={`absolute left-0 bottom-0 h-[2px] bg-[#1C7D5A] transition-all duration-300 ${active ? "w-full" : "w-0 group-hover:w-full"
                      }`}
                  />
                </div>
              );
            })}
          </div>

          {/* Right Profile Dropdown + Login */}
          <div className="relative flex items-center gap-3" ref={profileRef}>
            <Link
              to={`${basePath}/online-admission`}
              className="px-4 py-1.5 rounded-full bg-[#e8f5f0] hover:bg-[#1C7D5A] text-[#1C7D5A] hover:text-white text-[14px] font-semibold transition-colors"
            >
              অনলাইন ভর্তি
            </Link>

            <button
              type="button"
              onClick={() => setIsOpenProfileMenu(!isOpenProfileMenu)}
              className="flex items-center justify-center cursor-pointer focus:outline-none"
              aria-label="Account menu"
            >
              <div className="w-[40px] h-[40px] bg-white rounded-full border-[#1C7D5A] border-2 overflow-hidden">
                <img
                  className="w-full h-full object-cover"
                  src={adminPhoto}
                  alt={settings?.profile?.adminName || "Admin"}
                  onError={(e) => {
                    e.currentTarget.src = "/portal/Teacher/teacher1.png";
                  }}
                />
              </div>
            </button>

            {isOpenProfileMenu && (
              <div className="absolute top-[50px] right-0 bg-white z-50 border border-slate-200 rounded-[12px] shadow-lg p-[20px] min-w-[240px]">
                <div className="flex items-center justify-center">
                  <div className="w-[54px] h-[54px] bg-white rounded-full border-[#1C7D5A] border-2 overflow-hidden">
                    <img
                      className="w-full h-full object-cover"
                      src={adminPhoto}
                      alt={settings?.profile?.adminName || "Principal"}
                      onError={(e) => {
                        e.currentTarget.src = "/portal/Teacher/teacher1.png";
                      }}
                    />
                  </div>
                </div>
                <h2 className="text-[17px] whitespace-nowrap font-bold text-[#123628] text-center mt-2">
                  {settings?.profile?.adminName || madrasaName}
                </h2>
                {settings?.profile?.designation && (
                  <p className="text-[12px] text-slate-500 text-center">
                    {settings.profile.designation}
                  </p>
                )}
                <div className="border-[#1C7D5A]/20 border-t my-[10px]" />

                <div className="flex flex-col gap-[12px] mt-[12px]">
                  <Link
                    to={`${basePath}/online-admission`}
                    onClick={() => setIsOpenProfileMenu(false)}
                    className="text-[15px] font-semibold text-[#123628] hover:text-[#1C7D5A] transition-colors text-center"
                  >
                    অনলাইন ভর্তি ফরম
                  </Link>
                  <Link to="/login" onClick={() => setIsOpenProfileMenu(false)}>
                    <button
                      type="button"
                      className="flex items-center justify-center gap-[6px] text-white bg-[#1C7D5A] hover:bg-[#123628] py-[8px] px-[15px] rounded-[8px] w-full font-semibold transition-colors cursor-pointer"
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
            <div className="w-[40px] h-[40px] bg-white rounded-full border-[#1C7D5A] border-2 overflow-hidden">
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
          <h2 className="text-[18px] sm:text-[20px] truncate max-w-[220px] font-bold text-[#123628]">
            {madrasaName}
          </h2>
          <button
            type="button"
            onClick={() => setIsOpenMenu(!isOpenMenu)}
            className="p-1 text-[#123628] cursor-pointer"
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
                    className="flex items-center gap-[10px] py-1.5 text-[#0f172a] hover:text-[#1C7D5A] font-semibold"
                  >
                    <div className="w-[30px] h-[30px] flex items-center justify-center rounded-full bg-[#e8f5f0] text-[#1C7D5A]">
                      <Icon className="w-4 h-4" />
                    </div>
                    {item.label}
                  </Link>
                );
              })}
              <Link
                to={`${basePath}/online-admission`}
                onClick={() => setIsOpenMenu(false)}
                className="flex items-center gap-[10px] py-1.5 text-[#1C7D5A] font-bold"
              >
                <div className="w-[30px] h-[30px] flex items-center justify-center rounded-full bg-[#e8f5f0] text-[#1C7D5A]">
                  <GraduationCap className="w-4 h-4" />
                </div>
                অনলাইন ভর্তি ফরম
              </Link>
            </div>

            <Link to="/login" onClick={() => setIsOpenMenu(false)}>
              <button
                type="button"
                className="flex items-center justify-center gap-[6px] text-white bg-[#1C7D5A] hover:bg-[#123628] py-[8px] px-[15px] rounded-[8px] mt-[20px] w-full font-semibold transition-colors"
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

      {/* ======> Brand Footer <====== */}
      <footer className="mt-[40px]">
        <PortalReveal>
          <div className="portal-footer-container text-white w-full relative p-[15px] bg-[#081812]">
            <div className="max-w-[1280px] mx-auto lg:flex items-center justify-between lg:px-[50px] lg:py-[30px] relative z-10 gap-10">
              {/* Brand Column */}
              <div className="w-full mt-[30px] lg:mt-0">
                <div className="flex justify-center items-center lg:justify-start gap-[14px]">
                  <div className="w-[70px] h-[70px] shrink-0 rounded-full bg-white p-1.5 flex items-center justify-center overflow-hidden shadow-md">
                    <img
                      className="w-full h-full object-contain"
                      src={footerLogoSrc}
                      alt={madrasaName}
                      onError={(e) => {
                        e.currentTarget.src = "/portal/school.png";
                      }}
                    />
                  </div>

                </div>
                <p className="text-slate-300 text-[16px] mt-[20px] lg:pr-[60px] text-center lg:text-left leading-relaxed">
                  {settings?.footer?.aboutText ||
                    `${madrasaName} — কুরআন ও সুন্নাহর আলোকে আধুনিক শিক্ষা ও নৈতিক চরিত্র গঠনের নির্ভরযোগ্য প্রতিষ্ঠান।`}
                </p>

                {socialItems.length > 0 && (
                  <div className="flex justify-center lg:justify-start gap-[12px] mt-[22px]">
                    {socialItems.map((item, idx) => {
                      const FooterSocialIcon = item.Icon;
                      return (
                        <a
                          key={idx}
                          href={item.href}
                          target="_blank"
                          rel="noopener noreferrer"
                          aria-label={item.label}
                          className="group hover:bg-[#1C7D5A] h-[36px] w-[36px] flex items-center justify-center rounded-full bg-white/10 border border-white/15 transition-colors duration-300 cursor-pointer"
                        >
                          <FooterSocialIcon className="text-white w-[16px] h-[16px] transition-colors" />
                        </a>
                      );
                    })}
                  </div>
                )}
              </div>

              {/* Quick Links Column */}
              <div className="w-full whitespace-nowrap mt-[40px] lg:mt-0 text-center lg:text-left">
                <h2 className="text-[22px] font-semibold mb-[18px] text-[#EAB33C]">
                  দ্রুত তথ্য
                </h2>
                <p className="text-[17px] mb-[10px]">
                  <Link to={basePath || "/"} className="hover:text-[#EAB33C] transition-colors">
                    হোম
                  </Link>
                </p>
                <p className="text-[17px] mb-[10px]">
                  <Link to={`${basePath}/about`} className="hover:text-[#EAB33C] transition-colors">
                    আমাদের সম্পর্কে
                  </Link>
                </p>
                <p className="text-[17px] mb-[10px]">
                  <Link to={`${basePath}/admission`} className="hover:text-[#EAB33C] transition-colors">
                    ভর্তি
                  </Link>
                </p>
                <p className="text-[17px] mb-[10px]">
                  <Link to={`${basePath}/contact`} className="hover:text-[#EAB33C] transition-colors">
                    যোগাযোগ
                  </Link>
                </p>
              </div>

              {/* Contact Column */}
              <div className="whitespace-nowrap mt-[40px] lg:mt-0 text-center lg:text-left">
                <h2 className="text-[22px] font-semibold mb-[18px] text-[#EAB33C]">
                  যোগাযোগ করুন
                </h2>
                {phone && (
                  <p className="text-[17px] mb-[10px]">
                    <span className="text-slate-300">ফোন: </span> {phone}
                  </p>
                )}
                {email && (
                  <p className="text-[17px] mb-[10px]">
                    <span className="text-slate-300">ইমেইল: </span> {email}
                  </p>
                )}
                {settings?.contact?.address && (
                  <p className="text-[17px] mb-[10px] whitespace-normal max-w-[280px] mx-auto lg:mx-0">
                    <span className="text-slate-300">ঠিকানা: </span>
                    {settings.contact.address}
                  </p>
                )}
              </div>
            </div>

            <div className="border-t-[1px] border-white/10 py-[20px] mt-6 relative z-10">
              <p className="text-center text-[14px] text-slate-300">
                {settings?.footer?.copyright ||
                  `© ${new Date().getFullYear()} ${madrasaName}. সর্বস্বত্ব সংরক্ষিত।`}
              </p>
            </div>
          </div>
        </PortalReveal>
      </footer>
    </div>
  );
};

export default PortalLayout;
