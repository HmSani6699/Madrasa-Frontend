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

import logo from '../../../../public/weblogo.png'

const Nabver = ({ onOpenDemoModal }) => {
    const [scrolled, setScrolled] = useState(false);
    const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
    const [showPreviewBadge, setShowPreviewBadge] = useState(true);
    const [showRoleModal, setShowRoleModal] = useState(false);
    const navigate = useNavigate();
    const location = useLocation();
    const isHome = location.pathname === "/";
    const isPackagesPage = location.pathname === "/packages" || location.pathname === "/pricing";

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

                                <a
                                    href={isHome ? "#contact" : "/#contact"}
                                    className="text-slate-600 hover:text-[#1C7D5A] hover:bg-white/80 font-medium text-sm px-4 py-1.5 rounded-full transition-all"
                                >
                                    যোগাযোগ
                                </a>
                            </div>
                        </nav>

                        {/* ====== RIGHT: Action Controls & Buttons ====== */}
                        <div className="hidden lg:flex items-center gap-3">
                            {/* Login Button */}
                            <Link
                                to="/login"
                                className="text-slate-700 hover:text-[#1C7D5A] font-semibold text-sm px-3.5 py-2 rounded-xl hover:bg-emerald-50/70 transition-all"
                            >
                                লগইন
                            </Link>

                            {/* Primary Register CTA Button */}
                            <Link
                                to="/free-demo"
                                className="bg-[#0e7c55] hover:bg-[#0a6646] active:scale-95 text-white font-semibold text-sm px-5 py-2.5 rounded-lg shadow-xs hover:shadow-md hover:shadow-emerald-700/20 transition-all duration-200 flex items-center gap-2 group"
                            >
                                <span>ফ্রি ডেমো দেখুন</span>
                                <ArrowUpRight className="w-5 h-5 sm:w-3.5 sm:h-3.5 text-white group-hover:translate-x-0.5 transition-transform" />
                            </Link>
                        </div>
                    </div>
                </div>

                {/* ====== MOBILE DRAWER ====== */}
                {mobileMenuOpen && (
                    <div className="lg:hidden bg-white/95 backdrop-blur-xl border-b border-slate-200 px-4 pt-3 pb-6 animate-fade-in-down shadow-xl">
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
                                href={isHome ? "#contact" : "/#contact"}
                                onClick={() => setMobileMenuOpen(false)}
                                className="text-slate-700 hover:bg-slate-50 font-medium px-4 py-2.5 rounded-xl text-base"
                            >
                                যোগাযোগ
                            </a>

                            <div className="pt-4 border-t border-slate-100 flex flex-col gap-2.5">
                                <button
                                    onClick={() => openDemo()}
                                    className="w-full bg-emerald-50 text-emerald-800 font-semibold py-3 rounded-xl border border-emerald-200/70 flex items-center justify-center gap-2"
                                >
                                    <Monitor className="w-4 h-4" />
                                    <span>প্যানেল ডেমো দেখুন</span>
                                </button>

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
                            </div>
                        </div>
                    </div>
                )}
            </header>
        </>
    );
};

export default Nabver;
