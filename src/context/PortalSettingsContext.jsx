import { createContext, useContext, useState, useEffect, useCallback } from "react";
import axiosInstance from "../api/axiosInstance";

const PortalSettingsContext = createContext();

// eslint-disable-next-line react-refresh/only-export-components
export const usePortalSettings = () => {
  const context = useContext(PortalSettingsContext);
  if (!context) {
    throw new Error("usePortalSettings must be used within a PortalSettingsProvider");
  }
  return context;
};

const defaultSettings = {
  branding: {
    name: "আল-কুরআনুল কারীম একাডেমি",
    englishName: "Al-Quranul Kareem Academy",
    englishLocation: "Pakunda, Sonargon, Narayongonj",
    arabicName: "أكاديمية القرآن الكريم الإسلامية التعليمية",
    arabicLocation: "بَكُونْدَا، سُونَارْغَاوْ، نَارَايَنْغَنْج",
    tagline: "পাকুন্ডা, সোনারগাঁ, নারায়ণগঞ্জ",
    logoText: "AK",
    logo: "/portal/school.png",
    footerLogo: "/portal/logo2.png",
  },
  contact: {
    phone: "+8801830-630365",
    email: "info.edusadiq@gmail.com",
    address: "পাকুন্ডা, সোনারগাঁ, নারায়ণগঞ্জ",
    officeHours: "শনিবার - শুক্রবার (সকাল ৯ টা থেকে রাত ৮ টা)",
    phoneHours: "ফোনে সকাল ১০টা হতে রাত ১১টা",
    social: {
      facebook: "https://www.facebook.com/official.edusadiq",
      twitter: "https://www.facebook.com/official.edusadiq",
      youtube: "https://www.youtube.com/@Edusadiq1",
      linkedin: "https://www.facebook.com/official.edusadiq",
      instagram: "https://www.facebook.com/official.edusadiq",
    },
  },
  hero: {
    leftImage: "/portal/im1.png",
    rightImage: "/portal/im2.png",
    badges: ["গ্রেট লাইফ", "গ্রেট সার্টিফিকেট"],
    slides: [
      {
        image: "/portal/office.jpeg",
        title: "আল-কুরআনুল কারীম একাডেমি",
        subtitle: "পাকুন্ডা, সোনারগাঁ, নারায়ণগঞ্জ",
        accent: "সুন্নাহ ও কোরআন ভিত্তিক সঠিক পদ্ধতিতে পাঠদান",
      },
    ],
  },
  stats: [
    { val: "150", suffix: " টি+", label: "প্রতিষ্ঠান", icon: "/portal/section.png" },
    { val: "20000", suffix: "জন+", label: "শিক্ষার্থী", icon: "/portal/student.png" },
    { val: "800", suffix: "জন+", label: "শিক্ষক", icon: "/portal/teacher.png" },
    { val: "19000", suffix: "জন+", label: "অভিভাবক", icon: "/portal/staff.png" },
  ],
  about: {
    badge: "ক্লাস পাঠ্যক্রম",
    title: "ফিচার ক্লাস কারিকুলাম",
    description:
      "আমাদের লক্ষ্য হলো উচ্চমানের, সহজলভ্য শিক্ষা প্রদান করা যা জ্ঞান এবং বাস্তব-জগতের প্রয়োগের মধ্যে ব্যবধান পূরণ করে।",
    highlights: [
      "মানসম্মত ক্লাস পাঠ্যক্রম এবং বিশেষজ্ঞ শিক্ষক",
      "ছাত্রদের অংশগ্রহণ এবং ধরে রাখা",
    ],
    mainImage: "/portal/office.jpeg",
    principalImage: "/portal/Teacher/teacher6-2.png",
  },
  curriculum: {
    badge: "ক্লাস পাঠ্যক্রম",
    title: "ফিচার ক্লাস কারিকুলাম",
    items: [
      { name: "One", subject: "5", color: "text-blue-500" },
      { name: "Two", subject: "5", color: "text-green-500" },
      { name: "Three", subject: "5", color: "text-yellow-500" },
      { name: "Four", subject: "5", color: "text-purple-500" },
      { name: "Five", subject: "5", color: "text-purple-500" },
      { name: "Six", subject: "5", color: "text-purple-500" },
    ],
  },
  students: {
    badge: "আমাদের শিক্ষার্থী",
    title: "আমাদের শিক্ষার্থী বৃন্দ",
    items: [
      { name: "Sadiq", image: "/portal/student/student1.jpeg", address: "Pakunda, Sonargon", className: "Five", roll: "2" },
      { name: "Najmul", image: "/portal/student/student2.jpeg", address: "Rupgonj", className: "Five", roll: "3" },
      { name: "Noman", image: "/portal/student/student3.jpeg", address: "Baliyapara", className: "Five", roll: "4" },
      { name: "Thalha", image: "/portal/student/student4.jpeg", address: "Monohordi", className: "Five", roll: "5" },
      { name: "Al-Amin", image: "/portal/student/student5.jpeg", address: "Gaptoli", className: "Five", roll: "6" },
      { name: "Jakir", image: "/portal/student/student6.jpeg", address: "Araihajar", className: "Five", roll: "7" },
      { name: "Roni", image: "/portal/student/student7.jpeg", address: "Taltola", className: "Five", roll: "8" },
      { name: "Parbase", image: "/portal/student/student8.jpeg", address: "Sirabo", className: "Five", roll: "9" },
    ],
  },
  teachers: {
    badge: "আমাদের শিক্ষক",
    title: "আমাদের বিশেষজ্ঞ শিক্ষক বৃন্দ",
    items: [
      { name: "Md Sadiqur Rahman", role: "Classs: Five", image: "/portal/Teacher/teacher5.png" },
      { name: "Md Sadiqur Rahman", role: "Classs: Five", image: "/portal/Teacher/teacher6.png" },
      { name: "Md Sadiqur Rahman", role: "Classs: Five", image: "/portal/Teacher/teacher5.png" },
    ],
  },
  gallery: {
    videoTitle: "Edusadiq ব্যবহার করার বিস্তারিত টিউটোরিয়াল",
    videos: [
      { youtubeId: "Hv8yinlIWJ8", title: "প্রতিষ্ঠান পরিচালনা ও ড্যাশবোর্ড" },
      { youtubeId: "YHMEcsyWo4s", title: "ভর্তি ও শিক্ষার্থী ব্যবস্থাপনা" },
      { youtubeId: "RfViGSywCxA", title: "হিসাব ও ফলাফল ব্যবস্থাপনা" },
    ],
    photos: [
      "/portal/gallery/img8.jpg",
      "/portal/gallery/img1.jpg",
      "/portal/gallery/img2.jpeg",
      "/portal/gallery/img7.jpeg",
      "/portal/gallery/img3.jpeg",
      "/portal/gallery/img4.jpeg",
      "/portal/gallery/img5.jpeg",
      "/portal/gallery/img6.jpeg",
    ],
  },
  footer: {
    aboutText:
      "Edusadiq মাদ্রাসা ম্যানেজমেন্ট সফটওয়্যার। ছাত্র, শিক্ষক, হিসাব ও ফলাফল ব্যবস্থাপনা সবকিছু এখন এক প্ল্যাটফর্মে সহজ ও সাশ্রয়ীভাবে।",
    copyright: "© Edusadiq. All Rights Reserved.",
  },
  sms: {
    admission: false,
    fees: false,
    attendance: false,
  },
  profile: {
    institutionName: "আল-কুরআনুল কারীম একাডেমি",
    slogan: "পাকুন্ডা, সোনারগাঁ, নারায়ণগঞ্জ",
    address: "পাকুন্ডা, সোনারগাঁ, নারায়ণগঞ্জ",
    email: "info.edusadiq@gmail.com",
    phone: "+8801830-630365",
    adminName: "MD: Sadiqur Rahman",
    designation: "Principal",
  },
};

const RESERVED_PATHS = new Set([
  "",
  "login",
  "admin",
  "super-admin",
  "teacher",
  "student",
  "guardian",
  "talimat",
  "accounting",
  "staff",
  "students",
  "free-demo",
  "video-demo",
  "contact",
  "contact-us",
  "packages",
  "pricing",
  "account-deactivated",
  "unauthorized",
]);

const mergePortalData = (remoteSettings = {}, madrasa = null) => {
  const merged = {
    ...defaultSettings,
    branding: {
      ...defaultSettings.branding,
      ...(remoteSettings.branding || {}),
      name: remoteSettings.branding?.name || madrasa?.name || defaultSettings.branding.name,
      englishName:
        remoteSettings.branding?.englishName ||
        madrasa?.name ||
        defaultSettings.branding.englishName,
      englishLocation:
        remoteSettings.branding?.englishLocation ||
        madrasa?.address ||
        defaultSettings.branding.englishLocation,
      tagline:
        remoteSettings.branding?.tagline ||
        madrasa?.address ||
        defaultSettings.branding.tagline,
      logo: remoteSettings.branding?.logo || madrasa?.logo || defaultSettings.branding.logo,
    },
    contact: {
      ...defaultSettings.contact,
      ...(remoteSettings.contact || {}),
      phone: remoteSettings.contact?.phone || madrasa?.phone || defaultSettings.contact.phone,
      email: remoteSettings.contact?.email || madrasa?.email || defaultSettings.contact.email,
      address:
        remoteSettings.contact?.address || madrasa?.address || defaultSettings.contact.address,
      social: {
        ...defaultSettings.contact.social,
        ...(remoteSettings.contact?.social || {}),
      },
    },
    hero: {
      ...defaultSettings.hero,
      ...(remoteSettings.hero || {}),
      slides:
        remoteSettings.hero?.slides?.length > 0
          ? remoteSettings.hero.slides
          : defaultSettings.hero.slides,
    },
    stats:
      remoteSettings.stats?.length > 0
        ? remoteSettings.stats
        : defaultSettings.stats,
    about: {
      ...defaultSettings.about,
      ...(remoteSettings.about || {}),
      title: remoteSettings.about?.title || defaultSettings.about.title,
      description: remoteSettings.about?.description || defaultSettings.about.description,
      highlights:
        remoteSettings.about?.highlights?.length > 0
          ? remoteSettings.about.highlights
          : defaultSettings.about.highlights,
    },
    curriculum: {
      ...defaultSettings.curriculum,
      ...(remoteSettings.curriculum || {}),
      title: remoteSettings.curriculum?.title || defaultSettings.curriculum.title,
      items:
        remoteSettings.curriculum?.items?.length > 0
          ? remoteSettings.curriculum.items
          : defaultSettings.curriculum.items,
    },
    students: {
      ...defaultSettings.students,
      ...(remoteSettings.students || {}),
      items:
        remoteSettings.students?.items?.length > 0
          ? remoteSettings.students.items
          : defaultSettings.students.items,
    },
    teachers: {
      ...defaultSettings.teachers,
      ...(remoteSettings.teachers || {}),
      items:
        remoteSettings.teachers?.items?.length > 0
          ? remoteSettings.teachers.items
          : defaultSettings.teachers.items,
    },
    gallery: {
      ...defaultSettings.gallery,
      ...(remoteSettings.gallery || {}),
      videos:
        remoteSettings.gallery?.videos?.length > 0
          ? remoteSettings.gallery.videos
          : defaultSettings.gallery.videos,
      photos:
        remoteSettings.gallery?.photos?.length > 0
          ? remoteSettings.gallery.photos
          : defaultSettings.gallery.photos,
    },
    footer: {
      ...defaultSettings.footer,
      ...(remoteSettings.footer || {}),
    },
    admission_form: remoteSettings.admission_form || null,
    madrasa: madrasa || null,
  };
  return merged;
};

export const PortalSettingsProvider = ({ children }) => {
  const [settings, setSettings] = useState(defaultSettings);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const loadPortalBySlug = useCallback(async (slug) => {
    if (!slug || RESERVED_PATHS.has(slug)) {
      setLoading(false);
      return;
    }

    setLoading(true);
    setError(null);
    try {
      const response = await axiosInstance.get(`/portal/v1/${slug}`);
      const payload = response.data;
      if (payload?.success) {
        setSettings(mergePortalData(payload.data?.settings, payload.data?.madrasa));
      } else {
        setError(payload?.message || "Failed to load settings");
      }
    } catch (err) {
      // Fallback gracefully to defaultSettings so demo/preview portals render cleanly
      console.warn("Portal settings fallback used:", err?.message);
      setError(err?.response?.data?.message || err.message);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    const slug = window.location.pathname.split("/")[1];
    loadPortalBySlug(slug);
  }, [loadPortalBySlug]);

  const updateSettings = (newSettings) => {
    setSettings(newSettings);
    localStorage.setItem("portal_settings", JSON.stringify(newSettings));
  };

  const resetSettings = () => {
    setSettings(defaultSettings);
    localStorage.removeItem("portal_settings");
  };

  return (
    <PortalSettingsContext.Provider
      value={{
        settings,
        updateSettings,
        resetSettings,
        loadPortalBySlug,
        loading,
        error,
      }}
    >
      {children}
    </PortalSettingsContext.Provider>
  );
};
