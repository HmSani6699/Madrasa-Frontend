import React, { useState, useEffect, useRef } from "react";
import { Link, useNavigate, useLocation } from "react-router-dom";
import {
    Monitor,
    ExternalLink,
    X,
    Menu,
    ShieldCheck,
    ChevronRight,
    ArrowRight,
    Sparkles,
    School,
    UserCheck,
    GraduationCap,
    Users,
    ArrowUpRight,
    User,
    LogOut,
    LayoutDashboard,
    ChevronDown,
    VideoIcon,
} from "lucide-react";
import { useAuth } from "../../../context/AuthContext";

import logo from '../../../../public/weblogo.png';

const Nabver = ({ onOpenDemoModal }) => {
    const { user, logout } = useAuth();
    const [scrolled, setScrolled] = useState(false);
    const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
    const [profileDropdownOpen, setProfileDropdownOpen] = useState(false);
    const profileDropdownRef = useRef(null);

    const navigate = useNavigate();
    const location = useLocation();
    const isHome = location.pathname === "/";
    const isPackagesPage = location.pathname === "/packages" || location.pathname === "/pricing";
    const isContactPage = location.pathname === "/contact" || location.pathname === "/contact-us";
    const isVideoDemoPage = location.pathname === "/video-demo";

    const getDashboardPath = () => {
        if (!user) return "/login";
        const roleRedirects = {
            super_admin: "/super-admin",
            admin: "/admin",
            mohtamim: "/admin",
            teacher: "/teacher",
            student: "/student/dashboard",
            guardian: "/guardian/dashboard",
            accountant: "/accounting",
            talimat: "/talimat",
        };
        return roleRedirects[user.role] || "/admin";
    };

    const getRoleLabel = (role) => {
        const roleLabels = {
            super_admin: "সুপার অ্যাডমিন",
            admin: "অ্যাডমিন",
            mohtamim: "মুহতামিম",
            teacher: "শিক্ষক",
            student: "শিক্ষার্থী",
            guardian: "অভিভাবক",
            accountant: "হিসাবরক্ষক",
            talimat: "তালিমাত",
        };
        return roleLabels[role] || (role ? role.replace("_", " ") : "ইউজার");
    };

    const handleLogout = async () => {
        setProfileDropdownOpen(false);
        setMobileMenuOpen(false);
        try {
            await logout();
        } catch (error) {
            console.error("Logout error:", error);
        }
        navigate("/");
    };

    const userAvatar = user?.avatar || user?.photo || user?.image;
    const userInitial = user?.name ? user.name.trim().charAt(0).toUpperCase() : "U";

    useEffect(() => {
        const handleScroll = () => {
            if (window.scrollY > 20) {
                setScrolled(true);
            } else {
                setScrolled(false);
            }
        };
        window.addEventListener("scroll", handleScroll);
        return () => window.removeEventListener("scroll", handleScroll);
    }, []);

    // Close dropdowns on outside click or escape key
    useEffect(() => {
        const handleClickOutside = (event) => {
            if (profileDropdownRef.current && !profileDropdownRef.current.contains(event.target)) {
                setProfileDropdownOpen(false);
            }
        };
        const handleKeyDown = (event) => {
            if (event.key === "Escape") {
                setProfileDropdownOpen(false);
            }
        };

        document.addEventListener("mousedown", handleClickOutside);
        document.addEventListener("keydown", handleKeyDown);
        return () => {
            document.removeEventListener("mousedown", handleClickOutside);
            document.removeEventListener("keydown", handleKeyDown);
        };
    }, []);

    // Close menus on route change
    useEffect(() => {
        setProfileDropdownOpen(false);
        setMobileMenuOpen(false);
    }, [location.pathname]);

    return (
        <>
            <header
                className={`sticky top-0 z-50 w-full transition-all duration-300 ${scrolled
                    ? "bg-white/90 backdrop-blur-md shadow-sm border-b border-emerald-950/5"
                    : "bg-white/70 backdrop-blur-xs border-b border-slate-200/40"
                    }`}
            >
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="flex items-center justify-between h-16.25 gap-3">
                        {/* ====== LEFT: Logo ====== */}
                        <Link
                            to="/"
                            className="flex items-center h-full"
                        >
                            <div className="w-50 h-11.25">
                                <img src={logo} alt="Logo" className="w-full" />
                            </div>
                        </Link>

                        {/* ====== CENTER: Navigation Island (Pill) ====== */}
                        <nav className="hidden md:flex items-center">
                            <div className="bg-[#f0f6f3]/90 border border-emerald-950/5 p-1 rounded-full flex items-center space-x-1 shadow-2xs">
                                <Link
                                    to="/"
                                    className={`${isHome ? "bg-[#ebf7f2] text-[#1C7D5A] font-bold" : "text-slate-600 hover:text-[#1C7D5A] hover:bg-white/80 font-medium"} text-sm px-4 py-1.5 rounded-full shadow-xs transition-all`}
                                >
                                    হোম
                                </Link>
                                <a
                                    href={isHome ? "#features" : "/#features"}
                                    className="text-slate-600 hover:text-[#1C7D5A] hover:bg-white/80 font-medium text-sm px-4 py-1.5 rounded-full transition-all"
                                >
                                    ফিচার
                                </a>

                                <Link
                                    to="/packages"
                                    className={`${isPackagesPage ? "bg-[#ebf7f2] text-[#1C7D5A] font-bold" : "text-slate-600 hover:text-[#1C7D5A] hover:bg-white/80 font-medium"} text-sm px-4 py-1.5 rounded-full transition-all`}
                                >
                                    প্যাকেজ
                                </Link>

                                <a
                                    href={isHome ? "#additional-services" : "/#additional-services"}
                                    className="text-slate-600 hover:text-[#1C7D5A] hover:bg-white/80 font-medium text-sm px-4 py-1.5 rounded-full transition-all"
                                >
                                    অন্যান্য সেবা
                                </a>

                                <Link
                                    to="/contact"
                                    className={`${isContactPage ? "bg-[#ebf7f2] text-[#1C7D5A] font-bold" : "text-slate-600 hover:text-[#1C7D5A] hover:bg-white/80 font-medium"} text-sm px-4 py-1.5 rounded-full transition-all`}
                                >
                                    যোগাযোগ
                                </Link>
                            </div>
                        </nav>

                        {/* ====== RIGHT: Action Controls & Buttons ====== */}
                        <div className="flex items-center gap-2 sm:gap-3">
                            {user ? (
                                /* Logged-in Profile Avatar with Dropdown */
                                <div className="relative" ref={profileDropdownRef}>
                                    <button
                                        type="button"
                                        onClick={() => setProfileDropdownOpen((prev) => !prev)}
                                        className="flex items-center gap-2 p-1 sm:px-2.5 sm:py-1.5 rounded-full hover:bg-emerald-50/80 border border-emerald-200/60 bg-emerald-50/30 transition-all cursor-pointer focus:outline-none focus:ring-2 focus:ring-[#1C7D5A]/20"
                                        aria-expanded={profileDropdownOpen}
                                        aria-haspopup="true"
                                    >
                                        <div className="relative">
                                            <div className="w-8.5 h-8.5 sm:w-9 sm:h-9 rounded-full overflow-hidden border-2 border-[#1C7D5A]/40 bg-[#1C7D5A]/10 flex items-center justify-center text-[#1C7D5A] font-bold text-sm shadow-xs">
                                                {userAvatar ? (
                                                    <img
                                                        src={userAvatar}
                                                        alt={user.name || "Profile"}
                                                        className="w-full h-full object-cover"
                                                    />
                                                ) : (
                                                    <span>{userInitial}</span>
                                                )}
                                            </div>
                                            <span className="absolute bottom-0 right-0 w-2.5 h-2.5 bg-emerald-500 border-2 border-white rounded-full"></span>
                                        </div>

                                        <div className="hidden sm:flex flex-col text-left">
                                            <span className="text-xs font-bold text-slate-800 leading-tight max-w-[110px] truncate">
                                                {user.name || "ব্যবহারকারী"}
                                            </span>
                                            <span className="text-[10px] text-emerald-700 font-medium">
                                                {getRoleLabel(user.role)}
                                            </span>
                                        </div>

                                        <ChevronDown
                                            className={`w-3.5 h-3.5 text-slate-500 transition-transform duration-200 ${profileDropdownOpen ? "rotate-180" : ""
                                                }`}
                                        />
                                    </button>

                                    {/* Profile Dropdown Menu */}
                                    {profileDropdownOpen && (
                                        <div className="absolute right-0 top-full mt-2 w-64 bg-white rounded-2xl shadow-xl border border-slate-100 py-2.5 z-50 animate-fade-in origin-top-right">
                                            {/* User Info Header */}
                                            <div className="px-4 py-3 border-b border-slate-100 flex items-center gap-3">
                                                <div className="w-10 h-10 rounded-full overflow-hidden border border-[#1C7D5A]/30 bg-[#1C7D5A]/10 flex items-center justify-center text-[#1C7D5A] font-bold text-sm shrink-0">
                                                    {userAvatar ? (
                                                        <img
                                                            src={userAvatar}
                                                            alt={user.name || "Profile"}
                                                            className="w-full h-full object-cover"
                                                        />
                                                    ) : (
                                                        <span>{userInitial}</span>
                                                    )}
                                                </div>
                                                <div className="flex-1 min-w-0">
                                                    <p className="text-sm font-bold text-slate-800 truncate">
                                                        {user.name || "ব্যবহারকারী"}
                                                    </p>
                                                    <div className="inline-block mt-0.5">
                                                        <span className="text-[11px] font-semibold text-[#1C7D5A] bg-emerald-50 px-2 py-0.5 rounded-md border border-emerald-100">
                                                            {getRoleLabel(user.role)}
                                                        </span>
                                                    </div>
                                                    {(user.email || user.phone) && (
                                                        <p className="text-[11px] text-slate-500 truncate mt-1">
                                                            {user.email || user.phone}
                                                        </p>
                                                    )}
                                                </div>
                                            </div>

                                            {/* Action Links */}
                                            <div className="p-1.5 space-y-1">
                                                <Link
                                                    to={getDashboardPath()}
                                                    onClick={() => setProfileDropdownOpen(false)}
                                                    className="w-full flex items-center justify-between px-3 py-2 text-sm font-medium text-slate-700 hover:text-[#1C7D5A] hover:bg-emerald-50/80 rounded-xl transition-all group"
                                                >
                                                    <div className="flex items-center gap-2.5">
                                                        <div className="w-8 h-8 rounded-lg bg-emerald-50 text-[#1C7D5A] flex items-center justify-center group-hover:bg-[#1C7D5A] group-hover:text-white transition-colors">
                                                            <LayoutDashboard className="w-4 h-4" />
                                                        </div>
                                                        <span>ড্যাশবোর্ড</span>
                                                    </div>
                                                    <ArrowRight className="w-3.5 h-3.5 text-slate-400 group-hover:text-[#1C7D5A] group-hover:translate-x-0.5 transition-all" />
                                                </Link>

                                                <div className="h-px bg-slate-100 my-1" />

                                                <button
                                                    type="button"
                                                    onClick={handleLogout}
                                                    className="w-full flex items-center gap-2.5 px-3 py-2 text-sm font-medium text-rose-600 hover:bg-rose-50 rounded-xl transition-all cursor-pointer group"
                                                >
                                                    <div className="w-8 h-8 rounded-lg bg-rose-50 text-rose-600 flex items-center justify-center group-hover:bg-rose-600 group-hover:text-white transition-colors">
                                                        <LogOut className="w-4 h-4" />
                                                    </div>
                                                    <span>লগআউট</span>
                                                </button>
                                            </div>
                                        </div>
                                    )}
                                </div>
                            ) : (
                                /* Non-logged-in Guest View */
                                <>
                                    <Link
                                        to="/video-demo"
                                        className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full border border-emerald-600/30 bg-emerald-50/70 hover:bg-emerald-100/80 text-[#1C7D5A] text-xs sm:text-sm font-semibold transition-all hover:scale-105 shadow-2xs"
                                        title="ভিডিও ডেমো ও টিউটোরিয়াল দেখুন"
                                    >
                                        <span className="relative flex h-2 w-2">
                                            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
                                            <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-600"></span>
                                        </span>
                                        <VideoIcon className="w-3.5 h-3.5 text-[#1C7D5A]" />
                                        <span>Video Demo</span>
                                    </Link>
                                    <Link
                                        to="/login"
                                        className="text-slate-700 hover:text-[#1C7D5A] font-semibold text-sm px-3.5 py-2 rounded-xl hover:bg-emerald-50/70 transition-all hidden sm:inline-block"
                                    >
                                        লগইন
                                    </Link>

                                    {/* Primary Register CTA Button */}
                                    <Link
                                        to="/free-demo"
                                        className="bg-[#0e7c55] hover:bg-[#0a6646] active:scale-95 text-white font-semibold text-xs sm:text-sm px-3.5 sm:px-5 py-2 sm:py-2.5 rounded-lg shadow-xs hover:shadow-md hover:shadow-emerald-700/20 transition-all duration-200 flex items-center gap-1.5 sm:gap-2 group"
                                    >
                                        <span>ফ্রি ডেমো দেখুন</span>
                                        <ArrowUpRight className="w-4 h-4 sm:w-3.5 sm:h-3.5 text-white group-hover:translate-x-0.5 transition-transform" />
                                    </Link>
                                </>
                            )}

                            {/* Mobile Hamburger Menu Toggle Button */}
                            <button
                                type="button"
                                onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
                                className="md:hidden p-2 rounded-xl text-slate-700 hover:text-emerald-800 hover:bg-slate-100 transition-colors cursor-pointer"
                                aria-label="Toggle navigation menu"
                            >
                                {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
                            </button>
                        </div>
                    </div>
                </div>

                {/* ====== MOBILE DRAWER ====== */}
                {mobileMenuOpen && (
                    <div className="md:hidden bg-white/95 backdrop-blur-xl border-b border-slate-200 px-4 pt-3 pb-6 animate-fade-in-down shadow-xl">
                        <div className="flex flex-col space-y-2">
                            <Link
                                to="/"
                                onClick={() => setMobileMenuOpen(false)}
                                className={`${isHome ? "bg-emerald-50 text-emerald-800 font-semibold" : "text-slate-700 hover:bg-slate-50 font-medium"} px-4 py-2.5 rounded-xl text-base`}
                            >
                                হোম
                            </Link>
                            <a
                                href={isHome ? "#features" : "/#features"}
                                onClick={() => setMobileMenuOpen(false)}
                                className="text-slate-700 hover:bg-slate-50 font-medium px-4 py-2.5 rounded-xl text-base"
                            >
                                ফিচার
                            </a>
                            {isHome ? (
                                <a
                                    href="#pricing"
                                    onClick={() => setMobileMenuOpen(false)}
                                    className="text-slate-700 hover:bg-slate-50 font-medium px-4 py-2.5 rounded-xl text-base"
                                >
                                    প্যাকেজ
                                </a>
                            ) : (
                                <Link
                                    to="/packages"
                                    onClick={() => setMobileMenuOpen(false)}
                                    className={`${isPackagesPage ? "bg-emerald-50 text-emerald-800 font-semibold" : "text-slate-700 hover:bg-slate-50 font-medium"} px-4 py-2.5 rounded-xl text-base`}
                                >
                                    প্যাকেজ
                                </Link>
                            )}
                            <a
                                href={isHome ? "#additional-services" : "/#additional-services"}
                                onClick={() => setMobileMenuOpen(false)}
                                className="text-slate-700 hover:bg-slate-50 font-medium px-4 py-2.5 rounded-xl text-base"
                            >
                                অন্যান্য সেবা
                            </a>
                            <Link
                                to="/video-demo"
                                onClick={() => setMobileMenuOpen(false)}
                                className={`${isVideoDemoPage ? "bg-emerald-50 text-emerald-800 font-semibold" : "text-slate-700 hover:bg-slate-50 font-medium"} px-4 py-2.5 rounded-xl text-base flex items-center gap-2`}
                            >
                                <VideoIcon className="w-4 h-4 text-[#1C7D5A]" />
                                <span>Video Demo (ভিডিও ডেমো)</span>
                            </Link>
                            <Link
                                to="/contact"
                                onClick={() => setMobileMenuOpen(false)}
                                className={`${isContactPage ? "bg-emerald-50 text-emerald-800 font-semibold" : "text-slate-700 hover:bg-slate-50 font-medium"} px-4 py-2.5 rounded-xl text-base`}
                            >
                                যোগাযোগ
                            </Link>

                            <div className="pt-4 border-t border-slate-100 flex flex-col gap-2.5">
                                {user ? (
                                    <>
                                        <div className="flex items-center gap-3 p-3 bg-emerald-50/50 rounded-xl border border-emerald-100">
                                            <div className="w-10 h-10 rounded-full overflow-hidden border border-[#1C7D5A]/30 bg-[#1C7D5A]/10 flex items-center justify-center text-[#1C7D5A] font-bold text-sm shrink-0">
                                                {userAvatar ? (
                                                    <img
                                                        src={userAvatar}
                                                        alt={user.name || "Profile"}
                                                        className="w-full h-full object-cover"
                                                    />
                                                ) : (
                                                    <span>{userInitial}</span>
                                                )}
                                            </div>
                                            <div className="flex-1 min-w-0">
                                                <p className="text-sm font-bold text-slate-800 truncate">
                                                    {user.name || "ব্যবহারকারী"}
                                                </p>
                                                <span className="text-xs text-[#1C7D5A] font-semibold">
                                                    {getRoleLabel(user.role)}
                                                </span>
                                            </div>
                                        </div>

                                        <Link
                                            to={getDashboardPath()}
                                            onClick={() => setMobileMenuOpen(false)}
                                            className="w-full bg-[#0e7c55] hover:bg-[#0a6646] text-white font-semibold py-2.5 rounded-xl flex items-center justify-center gap-2 shadow-xs transition-colors"
                                        >
                                            <LayoutDashboard className="w-4 h-4" />
                                            <span>ড্যাশবোর্ড এ যান</span>
                                        </Link>

                                        <button
                                            type="button"
                                            onClick={handleLogout}
                                            className="w-full text-center border border-rose-200 text-rose-600 font-semibold py-2.5 rounded-xl hover:bg-rose-50 flex items-center justify-center gap-2 transition-colors cursor-pointer"
                                        >
                                            <LogOut className="w-4 h-4" />
                                            <span>লগআউট</span>
                                        </button>
                                    </>
                                ) : (
                                    <>
                                        <Link
                                            to="/free-demo"
                                            onClick={() => setMobileMenuOpen(false)}
                                            className="w-full bg-emerald-50 text-emerald-800 font-semibold py-3 rounded-xl border border-emerald-200/70 flex items-center justify-center gap-2"
                                        >
                                            <Monitor className="w-4 h-4" />
                                            <span>প্যানেল ডেমো দেখুন</span>
                                        </Link>

                                        <div className="grid grid-cols-2 gap-2 pt-1">
                                            <Link
                                                to="/login"
                                                onClick={() => setMobileMenuOpen(false)}
                                                className="w-full text-center border border-slate-200 text-slate-700 font-semibold py-2.5 rounded-xl hover:bg-slate-50"
                                            >
                                                লগইন
                                            </Link>
                                            <Link
                                                to="/free-demo"
                                                onClick={() => setMobileMenuOpen(false)}
                                                className="w-full text-center bg-[#0e7c55] text-white font-semibold py-2.5 rounded-xl hover:bg-[#0a6646] shadow-sm"
                                            >
                                                ফ্রি ডেমো আবেদন
                                            </Link>
                                        </div>
                                    </>
                                )}
                            </div>
                        </div>
                    </div>
                )}
            </header>
        </>
    );
};

export default Nabver;
