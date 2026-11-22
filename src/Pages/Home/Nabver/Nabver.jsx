import React, { useState, useEffect } from "react";
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
} from "lucide-react";
import { useAuth } from "../../../context/AuthContext";

import logo from '../../../../public/weblogo.png'

const Nabver = ({ onOpenDemoModal }) => {
    const { user } = useAuth();
    const [scrolled, setScrolled] = useState(false);
    const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
    const navigate = useNavigate();
    const location = useLocation();
    const isHome = location.pathname === "/";
    const isPackagesPage = location.pathname === "/packages" || location.pathname === "/pricing";
    const isContactPage = location.pathname === "/contact" || location.pathname === "/contact-us";

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

    const openDemo = (path) => {
        setShowRoleModal(false);
        setMobileMenuOpen(false);
        if (path) {
            navigate(path);
        } else {
            setShowRoleModal(true);
        }
    };

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
                                <img src={logo} alt="" className="w-full" />
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
                                <Link
                                    to={getDashboardPath()}
                                    className="bg-emerald-50 hover:bg-emerald-100 text-[#1C7D5A] border border-emerald-200 font-semibold text-xs sm:text-sm px-3.5 py-2 rounded-xl transition-all flex items-center gap-1.5 shadow-2xs"
                                >
                                    <span>ড্যাশবোর্ড</span>
                                    <ArrowRight className="w-3.5 h-3.5" />
                                </Link>
                            ) : (
                                <Link
                                    to="/login"
                                    className="text-slate-700 hover:text-[#1C7D5A] font-semibold text-sm px-3.5 py-2 rounded-xl hover:bg-emerald-50/70 transition-all hidden sm:inline-block"
                                >
                                    লগইন
                                </Link>
                            )}

                            {/* Primary Register CTA Button */}
                            <Link
                                to="/free-demo"
                                className="bg-[#0e7c55] hover:bg-[#0a6646] active:scale-95 text-white font-semibold text-xs sm:text-sm px-3.5 sm:px-5 py-2 sm:py-2.5 rounded-lg shadow-xs hover:shadow-md hover:shadow-emerald-700/20 transition-all duration-200 flex items-center gap-1.5 sm:gap-2 group"
                            >
                                <span>ফ্রি ডেমো দেখুন</span>
                                <ArrowUpRight className="w-4 h-4 sm:w-3.5 sm:h-3.5 text-white group-hover:translate-x-0.5 transition-transform" />
                            </Link>

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
                            <Link
                                to="/contact"
                                onClick={() => setMobileMenuOpen(false)}
                                className={`${isContactPage ? "bg-emerald-50 text-emerald-800 font-semibold" : "text-slate-700 hover:bg-slate-50 font-medium"} px-4 py-2.5 rounded-xl text-base`}
                            >
                                যোগাযোগ
                            </Link>

                            <div className="pt-4 border-t border-slate-100 flex flex-col gap-2.5">
                                <Link
                                    to="/free-demo"
                                    onClick={() => setMobileMenuOpen(false)}
                                    className="w-full bg-emerald-50 text-emerald-800 font-semibold py-3 rounded-xl border border-emerald-200/70 flex items-center justify-center gap-2"
                                >
                                    <Monitor className="w-4 h-4" />
                                    <span>প্যানেল ডেমো দেখুন</span>
                                </Link>

                                <div className="grid grid-cols-2 gap-2 pt-1">
                                    {user ? (
                                        <Link
                                            to={getDashboardPath()}
                                            onClick={() => setMobileMenuOpen(false)}
                                            className="w-full text-center bg-emerald-50 text-emerald-800 font-semibold py-2.5 rounded-xl border border-emerald-200"
                                        >
                                            ড্যাশবোর্ড
                                        </Link>
                                    ) : (
                                        <Link
                                            to="/login"
                                            onClick={() => setMobileMenuOpen(false)}
                                            className="w-full text-center border border-slate-200 text-slate-700 font-semibold py-2.5 rounded-xl hover:bg-slate-50"
                                        >
                                            লগইন
                                        </Link>
                                    )}
                                    <Link
                                        to="/free-demo"
                                        onClick={() => setMobileMenuOpen(false)}
                                        className="w-full text-center bg-[#0e7c55] text-white font-semibold py-2.5 rounded-xl hover:bg-[#0a6646] shadow-sm"
                                    >
                                        ফ্রি ডেমো আবেদন
                                    </Link>
                                </div>
                            </div>
                        </div>
                    </div>
                )}
            </header>
        </>
    );
};

export default Nabver;
