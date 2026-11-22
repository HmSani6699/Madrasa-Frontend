import React, { useState } from "react";
import {
    Phone,
    Mail,
    MapPin,
    Smartphone,
    Info,
    MessageSquare,
    Send,
    CheckCircle2,
    Clock,
    Sparkles,
    Headphones,
    ChevronRight,
} from "lucide-react";
import { toast } from "react-hot-toast";
import Nabver from "../Home/Nabver/Nabver";
import Footer from "../Footer/Footer";
import { Link } from "react-router";
import contactService from "../../services/contactService";

const ContactUs = () => {
    const [formData, setFormData] = useState({
        name: "",
        phone: "",
        email: "",
        message: "",
    });
    const [isSubmitting, setIsSubmitting] = useState(false);

    const contactCards = [
        {
            id: "whatsapp",
            icon: Smartphone,
            title: "হোয়াটসঅ্যাপ",
            value: "01830630365",
            action: "https://wa.me/01830630365",
            isExternal: true,
        },
        {
            id: "email",
            icon: Mail,
            title: "ইমেইল",
            value: "ouremailpoint@gmail.com",
            action: "mailto:ouremailpoint@gmail.com",
        },
        {
            id: "address",
            icon: MapPin,
            title: "ঠিকানা",
            value: "বাড়ি-৩১, রোড-২, ৬ষ্ঠ তলা, ব্লক-সি, বনশ্রী, রামপুরা, ঢাকা-১২১৯।",
            action: "https://maps.google.com/?q=Dhaka,Bangladesh",
            isExternal: true,
        },
    ];

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData((prev) => ({
            ...prev,
            [name]: value,
        }));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        if (!formData.name.trim()) {
            toast.error("অনুগ্রহ করে আপনার নাম লিখুন");
            return;
        }
        if (!formData.phone.trim() && !formData.email.trim()) {
            toast.error("অনুগ্রহ করে আপনার মোবাইল নম্বর অথবা ইমেইল দিন");
            return;
        }
        if (!formData.message.trim()) {
            toast.error("অনুগ্রহ করে আপনার বার্তা লিখুন");
            return;
        }

        setIsSubmitting(true);

        try {
            const res = await contactService.submitMessage(formData);
            if (res.success) {
                toast.success(res.message || "আপনার বার্তা সফলভাবে পাঠানো হয়েছে! আমরা শীঘ্রই যোগাযোগ করব।");
                setFormData({
                    name: "",
                    phone: "",
                    email: "",
                    message: "",
                });
            } else {
                toast.error(res.message || "বার্তা পাঠাতে সমস্যা হয়েছে। পুনরায় চেষ্টা করুন।");
            }
        } catch (error) {
            const errorMsg = error?.response?.data?.message || "বার্তা পাঠাতে সমস্যা হয়েছে। পুনরায় চেষ্টা করুন।";
            toast.error(errorMsg);
        } finally {
            setIsSubmitting(false);
        }
    };

    return (
        <div className="min-h-screen flex flex-col bg-[#fbfdfb] font-bangla text-slate-800 antialiased selection:bg-emerald-500 selection:text-white">
            {/* নেভিগেশন বার */}
            <Nabver />

            {/* মূল কন্টেন্ট এরিয়া */}
            <main className="relative flex-1 py-12 sm:py-16 lg:py-20 px-4 sm:px-6 lg:px-8 bg-linear-to-b from-[#f2f8f5] via-[#fafdfb] to-[#edf6f2] overflow-hidden">
                {/* ব্যাকগ্রাউন্ড অ্যাম্বিয়েন্ট গ্লো */}
                <div className="absolute inset-0 pointer-events-none select-none overflow-hidden z-0">
                    <div className="absolute top-0 left-1/2 -translate-x-1/2 w-160 sm:w-200 h-96 bg-linear-to-b from-emerald-500/12 via-teal-400/5 to-transparent rounded-full blur-3xl" />
                    <div className="absolute -bottom-20 right-0 w-80 sm:w-96 h-80 sm:h-96 bg-linear-to-tl from-emerald-500/10 to-transparent rounded-full blur-3xl" />
                    <div className="absolute top-1/3 -left-20 w-72 sm:w-80 h-72 sm:h-80 bg-linear-to-br from-teal-500/10 to-transparent rounded-full blur-3xl" />
                </div>

                <div className="relative z-10 max-w-5xl mx-auto">
                    {/* টপ পিল ব্যাজ */}
                    <div className="flex items-center justify-center mb-4 sm:mb-5">
                        <Link
                            to="/free-demo"
                            className="group inline-flex items-center gap-2 bg-white/90 hover:bg-white text-emerald-800 border border-emerald-200/90 text-xs sm:text-sm font-semibold px-4 sm:px-5 py-1.5 rounded-full shadow-xs hover:shadow-sm transition-all duration-200 hover:scale-102 cursor-pointer font-bangla backdrop-blur-xs"
                        >
                            <Headphones className="w-3.5 h-3.5 sm:w-4 sm:h-4 text-emerald-600 animate-pulse" />
                            <span>২৪/৭ সরাসরি সাপোর্ট • দ্রুত সমাধান ও পরামর্শ</span>
                            <ChevronRight className="w-3 h-3 sm:w-3.5 sm:h-3.5 text-emerald-700 group-hover:translate-x-0.5 transition-transform" />
                        </Link>
                    </div>

                    {/* হেডিং সেকশন */}
                    <div className="text-center mb-10 sm:mb-14">
                        <h1 className="text-3xl sm:text-4xl lg:text-[42px] font-extrabold text-[#123628] tracking-tight">
                            আমাদের সাথে <span className="bg-linear-to-r from-[#1C7D5A] via-[#157150] to-[#0f4d36] bg-clip-text text-transparent">যোগাযোগ</span>
                        </h1>
                        <p className="mt-3 text-sm sm:text-base text-slate-600 max-w-xl mx-auto font-medium">
                            আপনার যেকোনো প্রশ্ন বা পরামর্শ জানাতে নিচের ফর্মটি পূরণ করুন বা সরাসরি যোগাযোগ করুন।
                        </p>
                    </div>

                    {/* যোগাযোগ কার্ড গ্রিড */}
                    <div className="space-y-5 sm:space-y-6">
                        {/* প্রথম সারি: ৩টি কার্ড */}
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-5 sm:gap-6">
                            {contactCards.slice(0, 3).map((item) => {
                                const IconComponent = item.icon;
                                return (
                                    <a
                                        key={item.id}
                                        href={item.action}
                                        target={item.isExternal ? "_blank" : undefined}
                                        rel={item.isExternal ? "noopener noreferrer" : undefined}
                                        className="bg-linear-to-b from-white to-[#fbfdfb] rounded-2xl p-6 sm:p-7 border border-slate-200/70 shadow-[0_4px_20px_-4px_rgba(18,54,40,0.05)] hover:shadow-[0_10px_25px_-5px_rgba(28,125,90,0.12)] hover:border-emerald-300 transition-all duration-300 hover:-translate-y-1 flex flex-col items-center justify-center text-center group cursor-pointer"
                                    >
                                        <div className="w-12 h-12 rounded-xl bg-linear-to-br from-[#1C7D5A] via-[#166e4e] to-[#0f4e37] flex items-center justify-center text-white shadow-md shadow-emerald-900/15 group-hover:scale-110 group-hover:shadow-emerald-900/25 transition-all duration-300">
                                            <IconComponent className="w-6 h-6 stroke-[2.2]" />
                                        </div>
                                        <h3 className="mt-4 font-bold text-slate-800 text-base sm:text-lg group-hover:text-[#123628] transition-colors">
                                            {item.title}
                                        </h3>
                                        <p className="mt-1 text-sm text-slate-600 font-medium group-hover:text-[#1C7D5A] transition-colors break-all">
                                            {item.value}
                                        </p>
                                    </a>
                                );
                            })}
                        </div>

                        {/* দ্বিতীয় সারি: ২টি কার্ড (সেন্টারে অ্যালাইন) */}
                        <div className="flex flex-col md:flex-row justify-center gap-5 sm:gap-6">
                            {contactCards.slice(3, 5).map((item) => {
                                const IconComponent = item.icon;
                                return (
                                    <a
                                        key={item.id}
                                        href={item.action}
                                        target={item.isExternal ? "_blank" : undefined}
                                        rel={item.isExternal ? "noopener noreferrer" : undefined}
                                        className="w-full md:w-[calc(33.333%-14px)] bg-linear-to-b from-white to-[#fbfdfb] rounded-2xl p-6 sm:p-7 border border-slate-200/70 shadow-[0_4px_20px_-4px_rgba(18,54,40,0.05)] hover:shadow-[0_10px_25px_-5px_rgba(28,125,90,0.12)] hover:border-emerald-300 transition-all duration-300 hover:-translate-y-1 flex flex-col items-center justify-center text-center group cursor-pointer"
                                    >
                                        <div className="w-12 h-12 rounded-xl bg-linear-to-br from-[#1C7D5A] via-[#166e4e] to-[#0f4e37] flex items-center justify-center text-white shadow-md shadow-emerald-900/15 group-hover:scale-110 group-hover:shadow-emerald-900/25 transition-all duration-300">
                                            <IconComponent className="w-6 h-6 stroke-[2.2]" />
                                        </div>
                                        <h3 className="mt-4 font-bold text-slate-800 text-base sm:text-lg group-hover:text-[#123628] transition-colors">
                                            {item.title}
                                        </h3>
                                        <p className="mt-1 text-sm text-slate-600 font-medium group-hover:text-[#1C7D5A] transition-colors break-all">
                                            {item.value}
                                        </p>
                                    </a>
                                );
                            })}
                        </div>
                    </div>

                    {/* যোগাযোগ ফর্ম */}
                    <div className="mt-10 sm:mt-14 max-w-2xl mx-auto relative">
                        {/* পেছনে হালকা ব্যাকড্রপ গ্লো */}
                        <div className="absolute -inset-1.5 bg-linear-to-r from-emerald-500/15 via-teal-400/10 to-emerald-500/15 rounded-3xl blur-xl opacity-70 pointer-events-none" />

                        <div className="relative bg-white/95 backdrop-blur-md rounded-xl p-6 sm:p-8 md:p-10 border border-emerald-100/80 shadow-[0_10px_35px_-8px_rgba(18,54,40,0.08)]">
                            {/* ফর্মের উপরে ছোট সাব-হেডিং */}
                            <div className="text-center pb-6 mb-6 border-b border-slate-100">

                                <h2 className="text-xl sm:text-2xl font-bold text-[#123628]">
                                    আমাদের সরাসরি বার্তা পাঠান
                                </h2>
                                <p className="text-xs sm:text-sm text-slate-500 mt-1">
                                    আপনার বার্তা পাঠানোর পর আমাদের প্রতিনিধি দ্রুত যোগাযোগ করবেন
                                </p>
                            </div>

                            <form onSubmit={handleSubmit} className="space-y-5">
                                {/* নাম ও মোবাইল */}
                                <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                                    <div>
                                        <label
                                            htmlFor="name"
                                            className="block text-sm font-semibold text-slate-700 mb-2"
                                        >
                                            নাম
                                        </label>
                                        <input
                                            type="text"
                                            id="name"
                                            name="name"
                                            value={formData.name}
                                            onChange={handleChange}
                                            placeholder="আপনার নাম"
                                            className="w-full px-4 py-2.5 sm:py-3 rounded-xl border border-slate-200 bg-slate-50/50 hover:bg-white focus:bg-white focus:outline-none focus:ring-2 focus:ring-[#1C7D5A]/25 focus:border-[#1C7D5A] text-slate-800 placeholder-slate-400 text-sm transition-all shadow-2xs"
                                            required
                                        />
                                    </div>

                                    <div>
                                        <label
                                            htmlFor="phone"
                                            className="block text-sm font-semibold text-slate-700 mb-2"
                                        >
                                            মোবাইল
                                        </label>
                                        <input
                                            type="tel"
                                            id="phone"
                                            name="phone"
                                            value={formData.phone}
                                            onChange={handleChange}
                                            placeholder="০১৯২..."
                                            className="w-full px-4 py-2.5 sm:py-3 rounded-xl border border-slate-200 bg-slate-50/50 hover:bg-white focus:bg-white focus:outline-none focus:ring-2 focus:ring-[#1C7D5A]/25 focus:border-[#1C7D5A] text-slate-800 placeholder-slate-400 text-sm transition-all shadow-2xs"
                                        />
                                    </div>
                                </div>

                                {/* ইমেইল */}
                                <div>
                                    <label
                                        htmlFor="email"
                                        className="block text-sm font-semibold text-slate-700 mb-2"
                                    >
                                        ইমেইল
                                    </label>
                                    <input
                                        type="email"
                                        id="email"
                                        name="email"
                                        value={formData.email}
                                        onChange={handleChange}
                                        placeholder="email@example.com"
                                        className="w-full px-4 py-2.5 sm:py-3 rounded-xl border border-slate-200 bg-slate-50/50 hover:bg-white focus:bg-white focus:outline-none focus:ring-2 focus:ring-[#1C7D5A]/25 focus:border-[#1C7D5A] text-slate-800 placeholder-slate-400 text-sm transition-all shadow-2xs"
                                    />
                                </div>

                                {/* বার্তা */}
                                <div>
                                    <label
                                        htmlFor="message"
                                        className="block text-sm font-semibold text-slate-700 mb-2"
                                    >
                                        বার্তা
                                    </label>
                                    <textarea
                                        id="message"
                                        name="message"
                                        rows={4}
                                        value={formData.message}
                                        onChange={handleChange}
                                        placeholder="আপনার বার্তা লিখুন..."
                                        className="w-full px-4 py-3 rounded-xl border border-slate-200 bg-slate-50/50 hover:bg-white focus:bg-white focus:outline-none focus:ring-2 focus:ring-[#1C7D5A]/25 focus:border-[#1C7D5A] text-slate-800 placeholder-slate-400 text-sm transition-all resize-y min-h-27.5 shadow-2xs"
                                        required
                                    />
                                </div>

                                {/* সাবমিট বাটন */}
                                <button
                                    type="submit"
                                    disabled={isSubmitting}
                                    className="w-full py-3.5 px-6 rounded-xl bg-linear-to-r from-[#1C7D5A] via-[#166e4e] to-[#12533b] hover:from-[#156649] hover:via-[#125a3f] hover:to-[#0f4430] active:scale-[0.99] text-white font-bold text-base flex items-center justify-center gap-2.5 shadow-md shadow-emerald-900/15 hover:shadow-lg hover:shadow-emerald-900/25 transition-all duration-200 cursor-pointer disabled:opacity-70 disabled:cursor-not-allowed"
                                >
                                    {isSubmitting ? (
                                        <div className="flex items-center gap-2">
                                            <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
                                            <span>পাঠানো হচ্ছে...</span>
                                        </div>
                                    ) : (
                                        <>
                                            <Send className="w-5 h-5" />
                                            <span>বার্তা পাঠান</span>
                                        </>
                                    )}
                                </button>
                            </form>
                        </div>
                    </div>
                </div>
            </main>

            {/* ফুটার */}
            <Footer />
        </div>
    );
};

export default ContactUs;
