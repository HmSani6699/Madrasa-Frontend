import React, { useState, useEffect } from "react";
import { createPortal } from "react-dom";
import {
    Star,
    Play,
    X,
    Building2,
    Sparkles,
    Quote,
    CheckCircle2,
    ExternalLink
} from "lucide-react";
import reviewService from "../../../services/reviewService";
import client1 from "../../../../public/sayed.jpg"
import client2 from "../../../../public/suny.jpg"
import client3 from "../../../../public/noman.jpg"

// Helper: Extract YouTube ID
const getYouTubeId = (url) => {
    if (!url || typeof url !== "string") return null;
    const match = url.trim().match(
        /(?:youtu\.be\/|youtube\.com\/(?:embed\/|v\/|watch\?v=|watch\?.+&v=|shorts\/))([\w-]{11})/
    );
    return match ? match[1] : null;
};

// Helper: Compute embed URL
const computeEmbedUrl = (url) => {
    if (!url || typeof url !== "string") return "";
    const trimmed = url.trim();
    if (trimmed.includes("/embed/")) {
        return trimmed;
    }
    const ytId = getYouTubeId(trimmed);
    if (ytId) {
        return `https://www.youtube-nocookie.com/embed/${ytId}`;
    }
    return trimmed;
};

// Helper: Compute thumbnail URL
const computeThumbnailUrl = (url, customThumb) => {
    if (customThumb && typeof customThumb === "string" && customThumb.trim()) {
        return customThumb.trim();
    }
    const ytId = getYouTubeId(url);
    if (ytId) {
        return `https://img.youtube.com/vi/${ytId}/hqdefault.jpg`;
    }
    return "https://images.unsplash.com/photo-1584697964190-705b893683f1?auto=format&fit=crop&q=80&w=800";
};

// Default fallback reviews (matching the user's reference design)
const DEFAULT_REVIEWS = [
    {
        _id: "seed-1",
        reviewerName: "মাওলানা আবদুর রহমান",
        img: client1,
        designation: "প্রিন্সিপাল",
        madrasaName: "দারুল উলুম মাদ্রাসা",
        videoUrl: "https://www.youtube.com/watch?v=ScMzIvxBSi4",
        embedUrl: "https://www.youtube-nocookie.com/embed/ScMzIvxBSi4",
        youtubeId: "ScMzIvxBSi4",
        thumbnailUrl: "https://img.youtube.com/vi/ScMzIvxBSi4/hqdefault.jpg",
        rating: 5,
        quote: "মাদ্রাসা সেবা ব্যবহার করে আমরা প্রতিষ্ঠানের কাজের গতি কয়েকগুণ বাড়িয়ে নিতে পেরেছি। আলহামদুলিল্লাহ।",
        order: 1
    },
    {
        _id: "seed-2",
        img: client2,
        reviewerName: "মুফতি সাইফুল ইসলাম",
        designation: "পরিচালক",
        madrasaName: "জামিয়া কাসিমিয়া",
        videoUrl: "https://www.youtube.com/watch?v=ScMzIvxBSi4",
        embedUrl: "https://www.youtube-nocookie.com/embed/ScMzIvxBSi4",
        youtubeId: "ScMzIvxBSi4",
        thumbnailUrl: "https://img.youtube.com/vi/ScMzIvxBSi4/hqdefault.jpg",
        rating: 5,
        quote: "ফি কালেকশন ও একাউন্টস এতো সহজ আগে কখনো মনে হয়নি। অভিভাবকরাও খুব খুশি এসএমএস সিস্টেমে।",
        order: 2
    },
    {
        _id: "seed-3",
        img: client3,
        reviewerName: "হাফেজ আবু বকর",
        designation: "শিক্ষক",
        madrasaName: "আল-আমিন একাডেমি",
        videoUrl: "https://www.youtube.com/watch?v=ScMzIvxBSi4",
        embedUrl: "https://www.youtube-nocookie.com/embed/ScMzIvxBSi4",
        youtubeId: "ScMzIvxBSi4",
        thumbnailUrl: "https://img.youtube.com/vi/ScMzIvxBSi4/hqdefault.jpg",
        rating: 5,
        quote: "বাংলা সাপোর্ট ও ইসলামিক ডিজাইন আমাদের জন্য পারফেক্ট। সাপোর্ট টিম সবসময় আন্তরিক ও তৎপর।",
        order: 3
    }
];

const Reviews = () => {
    const [reviews, setReviews] = useState(DEFAULT_REVIEWS);
    const [loading, setLoading] = useState(true);
    const [activeVideo, setActiveVideo] = useState(null);

    useEffect(() => {
        fetchReviews();
    }, []);

    const fetchReviews = async () => {
        try {
            setLoading(true);
            const res = await reviewService.getPublicReviews();
            if (res?.success && Array.isArray(res.data) && res.data.length > 0) {
                setReviews(res.data);
            } else {
                setReviews(DEFAULT_REVIEWS);
            }
        } catch (err) {
            console.error("Public reviews fetch error:", err);
            setReviews(DEFAULT_REVIEWS);
        } finally {
            setLoading(false);
        }
    };

    const handleOpenVideo = (review) => {
        const embed = review.embedUrl || computeEmbedUrl(review.videoUrl);
        setActiveVideo({
            ...review,
            embedUrl: embed
        });
    };





    return (
        <section className="relative py-16 sm:py-24 bg-white overflow-hidden font-bangla">
            {/* Background Decorative Accents */}
            <div className="absolute top-1/2 left-0 w-72 h-72 bg-emerald-50/50 rounded-full blur-3xl -translate-y-1/2 -translate-x-1/2 pointer-events-none" />
            <div className="absolute top-1/3 right-0 w-80 h-80 bg-amber-50/60 rounded-full blur-3xl -translate-y-1/2 translate-x-1/2 pointer-events-none" />

            <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                {/* ====== Header Section matching Screenshot ====== */}
                <div className="text-center max-w-3xl mx-auto mb-12 sm:mb-16">
                    {/* Top Pill Badge */}
                    <div className="inline-flex items-center justify-center px-4 py-1 rounded-full border border-amber-200/80 bg-amber-50/70 text-xs sm:text-sm font-semibold text-amber-800 shadow-2xs mb-3.5">
                        প্রশংসাপত্র
                    </div>

                    {/* Main Title matching Screenshot */}
                    <h2 className="text-3xl sm:text-4xl lg:text-[2.65rem] font-black text-slate-900 tracking-tight leading-[1.3] mb-3">
                        আমাদের <span className="text-[#EAB33C]">গ্রাহকরা</span> যা বলছেন
                    </h2>

                    {/* Subtitle */}
                    <p className="text-slate-500 text-sm sm:text-base font-normal max-w-2xl mx-auto">
                        দেশের শীর্ষস্থানীয় মাদরাসা সমূহের সম্মানিত মুহতামিম ও শিক্ষকদের বাস্তব অভিজ্ঞতা ও অনুপ্রেরণামূলক বক্তব্য
                    </p>
                </div>

                {/* ====== Video Review Cards Grid ====== */}
                {loading ? (
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-8">
                        {[1, 2, 3].map((n) => (
                            <div
                                key={n}
                                className="bg-white rounded-2xl border border-slate-100 p-6 shadow-sm animate-pulse space-y-4"
                            >
                                <div className="w-full aspect-video bg-slate-200 rounded-xl" />
                                <div className="flex gap-1">
                                    {[1, 2, 3, 4, 5].map((s) => (
                                        <div key={s} className="w-4 h-4 bg-slate-200 rounded-full" />
                                    ))}
                                </div>
                                <div className="h-4 bg-slate-200 rounded w-full" />
                                <div className="h-4 bg-slate-200 rounded w-4/5" />
                                <div className="pt-4 flex items-center gap-3">
                                    <div className="w-12 h-12 bg-slate-200 rounded-full" />
                                    <div className="space-y-2 flex-1">
                                        <div className="h-4 bg-slate-200 rounded w-2/3" />
                                        <div className="h-3 bg-slate-200 rounded w-1/2" />
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                ) : (
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-8">
                        {reviews.map((review) => {
                            const thumbnail =
                                review.thumbnailUrl ||
                                computeThumbnailUrl(review.videoUrl, review.customThumbnail);

                            return (
                                <div
                                    key={review._id || review.reviewerName}
                                    className="bg-white rounded-2xl border border-slate-200/80 hover:border-emerald-300 shadow-sm hover:shadow-xl transition-all duration-300 flex flex-col justify-between overflow-hidden group"
                                >
                                    {/* Top: Video Thumbnail & Play Trigger */}
                                    <div className="relative aspect-video bg-slate-900 overflow-hidden cursor-pointer">
                                        <img
                                            src={thumbnail}
                                            alt={review.reviewerName}
                                            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                                        />
                                        {/* Gradient Overlay */}
                                        <div className="absolute inset-0 bg-linear-to-t from-black/60 via-black/20 to-transparent group-hover:from-black/75 transition-colors flex items-center justify-center">
                                            {/* Animated Play Button */}
                                            <button
                                                type="button"
                                                onClick={() => handleOpenVideo(review)}
                                                className="relative flex items-center justify-center cursor-pointer transform group-hover:scale-110 transition-transform duration-300"
                                                title="ভিডিও দেখুন"
                                            >
                                                {/* Pulse Ring */}
                                                <span className="absolute w-14 h-14 rounded-full bg-red-600/40 animate-ping" />
                                                <span className="relative w-14 h-14 rounded-full bg-red-600 hover:bg-red-700 text-white flex items-center justify-center shadow-lg shadow-red-600/40 border-2 border-white/80">
                                                    <Play className="w-6 h-6 fill-white ml-0.5" />
                                                </span>
                                            </button>
                                        </div>

                                        {/* YouTube Watch Pill */}
                                        <div className="absolute bottom-3 left-3 bg-black/60 backdrop-blur-md text-white text-[11px] font-semibold px-2.5 py-0.5 rounded-full flex items-center gap-1.5">
                                            <Play className="w-3 h-3 fill-red-500 text-red-500" />
                                            <span>ভিডিও রিভিউ</span>
                                        </div>
                                    </div>

                                    {/* Middle: Stars and Quote */}
                                    <div className="p-6 flex-1 flex flex-col justify-between">
                                        <div>
                                            {/* 5 Golden Stars matching Screenshot */}
                                            <div className="flex items-center gap-1 mb-3">
                                                {[...Array(review.rating || 5)].map((_, i) => (
                                                    <Star
                                                        key={i}
                                                        className="w-4 h-4 sm:w-4.5 sm:h-4.5 fill-[#EAB33C] text-[#EAB33C]"
                                                    />
                                                ))}
                                            </div>

                                            {/* Review Quote matching Screenshot */}
                                            <p className="text-slate-700 text-sm sm:text-[15px] font-medium leading-relaxed mb-6">
                                                "{review.quote || "মাদ্রাসা সেবা ব্যবহার করে আমাদের প্রতিষ্ঠানের কার্যক্রম অত্যন্ত সুশৃঙ্খল ও সহজ হয়েছে। আলহামদুলিল্লাহ।"}"
                                            </p>
                                        </div>


                                        {/* Bottom: Reviewer Identity matching Screenshot */}
                                        <div className="pt-4 border-t border-slate-100 flex items-center gap-3.5">
                                            {/* Green Circular Icon with Madrasa/Building motif */}
                                            <div className="w-11 h-11 rounded-full text-white flex items-center justify-center shadow-xs shrink-0">
                                                <img src={review.img} alt="logo" className="rounded-full" />
                                            </div>

                                            <div className="min-w-0">
                                                <h4 className="text-[15px] font-bold text-slate-900 leading-tight truncate">
                                                    {review.reviewerName}
                                                </h4>
                                                <p className="text-xs text-slate-500 mt-0.5 truncate">
                                                    {review.designation}, {review.madrasaName}
                                                </p>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            );
                        })}
                    </div>
                )}
            </div>

            {/* ====== Video Modal Player ====== */}
            {activeVideo &&
                createPortal(
                    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/85 backdrop-blur-sm font-bangla animate-fade-in">
                        <div className="bg-slate-900 rounded-3xl max-w-4xl w-full p-4 sm:p-6 shadow-2xl relative border border-slate-800">
                            {/* Close Button */}
                            <button
                                type="button"
                                onClick={() => setActiveVideo(null)}
                                className="absolute top-4 right-4 p-2.5 text-white/70 hover:text-white hover:bg-white/10 rounded-full transition-all cursor-pointer z-10"
                            >
                                <X className="w-6 h-6" />
                            </button>

                            {/* Video Header Info */}
                            <div className="mb-4 pr-12 flex items-center gap-3">
                                <div className="w-10 h-11 rounded-full bg-[#1C7D5A] text-white flex items-center justify-center shrink-0">
                                    <Building2 className="w-5 h-5" />
                                </div>
                                <div>
                                    <h3 className="text-base sm:text-lg font-bold text-white truncate">
                                        {activeVideo.reviewerName}
                                    </h3>
                                    <p className="text-xs text-slate-400">
                                        {activeVideo.designation}, {activeVideo.madrasaName}
                                    </p>
                                </div>
                            </div>

                            {/* Responsive 16:9 Video Embed Player */}
                            <div className="relative aspect-video rounded-2xl overflow-hidden bg-black border border-slate-800 shadow-inner">
                                <iframe
                                    src={
                                        activeVideo.embedUrl
                                            ? `${activeVideo.embedUrl}${activeVideo.embedUrl.includes("?") ? "&" : "?"}autoplay=1`
                                            : ""
                                    }
                                    title={activeVideo.reviewerName}
                                    className="w-full h-full"
                                    allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                                    allowFullScreen
                                />
                            </div>

                            {/* Testimonial Quote in Modal Footer */}
                            {activeVideo.quote && (
                                <div className="mt-4 p-3.5 bg-slate-800/80 rounded-xl border border-slate-700/60">
                                    <p className="text-xs sm:text-sm text-slate-300 italic font-medium leading-relaxed">
                                        "{activeVideo.quote}"
                                    </p>
                                </div>
                            )}
                        </div>
                    </div>,
                    document.body
                )}
        </section>
    );
};

export default Reviews;
