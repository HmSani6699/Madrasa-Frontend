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
  theme: {
    primary: "#1C7D5A",
    primaryDark: "#123628",
    primaryLight: "#e8f5f0",
    secondary: "#EAB33C",
    secondaryDark: "#c99327",
  },
  branding: {
    name: "",
    englishName: "",
    englishLocation: "",
    arabicName: "",
    arabicLocation: "",
    tagline: "",
    logoText: "MS",
    logo: "/portal/school.png",
    footerLogo: "/portal/school.png",
    headerBanner: "",
  },
  contact: {
    phone: "",
    email: "",
    address: "",
    officeHours: "শনিবার - বৃহস্পতিবার (সকাল ৮ টা থেকে বিকাল ৫ টা)",
    phoneHours: "ফোনে সকাল ৯টা হতে রাত ৯টা",
    mapEmbedUrl: "",
    social: {
      facebook: "",
      twitter: "",
      youtube: "",
      linkedin: "",
      instagram: "",
    },
  },
  hero: {
    leftImage: "/portal/im1.png",
    rightImage: "/portal/im2.png",
    badges: ["কুরআন ও সুন্নাহ ভিত্তিক শিক্ষা", "আধুনিক ডিজিটাল ব্যবস্থাপনা"],
    slides: [],
  },
  stats: [
    { key: "classes", val: "0", suffix: "টি", label: "শ্রেণি / বিভাগ", icon: "/portal/section.png" },
    { key: "students", val: "0", suffix: "জন", label: "শিক্ষার্থী", icon: "/portal/student.png" },
    { key: "teachers", val: "0", suffix: "জন", label: "শিক্ষক", icon: "/portal/teacher.png" },
    { key: "guardians", val: "0", suffix: "জন", label: "অভিভাবক", icon: "/portal/staff.png" },
  ],
  about: {
    badge: "আমাদের সম্পর্কে",
    title: "",
    description: "",
    vision: "",
    goals: [],
    highlights: [],
    mainImage: "/portal/office.jpeg",
    principalImage: "/portal/Teacher/teacher6-2.png",
    bannerText: "",
    introVideoUrl: "",
    founder: {
      name: "",
      designation: "প্রতিষ্ঠাতা ও মুহতামিম",
      bio: "",
      image: "/portal/bgre.jpg",
    },
  },
  curriculum: {
    badge: "ক্লাস পাঠ্যক্রম",
    title: "শ্রেণি ও পাঠ্যক্রম পরিচিতি",
    items: [],
  },
  students: {
    badge: "আমাদের শিক্ষার্থী",
    title: "আমাদের শিক্ষার্থী বৃন্দ",
    items: [],
  },
  teachers: {
    badge: "আমাদের শিক্ষক",
    title: "আমাদের সম্মানিত শিক্ষক বৃন্দ",
    items: [],
    all: [],
  },
  admissionFees: [],
  gallery: {
    videoBadge: "ভিডিও গ্যালারি",
    videoTitle: "ভিডিও গ্যালারি",
    videos: [],
    photoBadge: "ছবি গ্যালারি",
    photoTitle: "আমাদের প্রতিষ্ঠানের ছবি গ্যালারি",
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
    aboutText: "",
    copyright: "",
  },
  sms: {
    admission: false,
    fees: false,
    attendance: false,
  },
  profile: {
    institutionName: "",
    slogan: "",
    address: "",
    email: "",
    phone: "",
    adminName: "",
    adminPhoto: "",
    designation: "মুহতামিম / অধ্যক্ষ",
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
  const instName =
    remoteSettings.branding?.name ||
    remoteSettings.profile?.institutionName ||
    madrasa?.name ||
    "";
  const instAddress =
    remoteSettings.contact?.address ||
    remoteSettings.profile?.address ||
    madrasa?.address ||
    "";

  return {
    ...defaultSettings,
    ...remoteSettings,
    theme: {
      ...defaultSettings.theme,
      ...(remoteSettings.theme || {}),
    },
    branding: {
      ...defaultSettings.branding,
      ...(remoteSettings.branding || {}),
      name: instName,
      englishName: remoteSettings.branding?.englishName || instName,
      englishLocation: remoteSettings.branding?.englishLocation || instAddress,
      tagline: remoteSettings.branding?.tagline || instAddress,
      logo: remoteSettings.branding?.logo || madrasa?.logo || defaultSettings.branding.logo,
      footerLogo:
        (remoteSettings.branding?.footerLogo &&
        remoteSettings.branding.footerLogo !== "/whitelogo.png"
          ? remoteSettings.branding.footerLogo
          : "") ||
        remoteSettings.branding?.logo ||
        madrasa?.logo ||
        defaultSettings.branding.logo,
      headerBanner: remoteSettings.branding?.headerBanner || "",
    },
    contact: {
      ...defaultSettings.contact,
      ...(remoteSettings.contact || {}),
      phone: remoteSettings.contact?.phone ?? madrasa?.phone ?? "",
      email: remoteSettings.contact?.email ?? madrasa?.email ?? "",
      address: instAddress,
      social: {
        ...defaultSettings.contact.social,
        ...(remoteSettings.contact?.social || {}),
      },
    },
    hero: {
      ...defaultSettings.hero,
      ...(remoteSettings.hero || {}),
      badges: Array.isArray(remoteSettings.hero?.badges)
        ? remoteSettings.hero.badges
        : defaultSettings.hero.badges,
      slides: Array.isArray(remoteSettings.hero?.slides)
        ? remoteSettings.hero.slides
        : defaultSettings.hero.slides,
    },
    stats: Array.isArray(remoteSettings.stats)
      ? remoteSettings.stats
      : defaultSettings.stats,
    about: {
      ...defaultSettings.about,
      ...(remoteSettings.about || {}),
      goals: Array.isArray(remoteSettings.about?.goals)
        ? remoteSettings.about.goals
        : defaultSettings.about.goals,
      highlights: Array.isArray(remoteSettings.about?.highlights)
        ? remoteSettings.about.highlights
        : defaultSettings.about.highlights,
      founder: {
        ...defaultSettings.about.founder,
        ...(remoteSettings.about?.founder || {}),
      },
    },
    curriculum: {
      ...defaultSettings.curriculum,
      ...(remoteSettings.curriculum || {}),
      items: Array.isArray(remoteSettings.curriculum?.items)
        ? remoteSettings.curriculum.items
        : defaultSettings.curriculum.items,
    },
    students: {
      ...defaultSettings.students,
      ...(remoteSettings.students || {}),
      items: Array.isArray(remoteSettings.students?.items)
        ? remoteSettings.students.items
        : defaultSettings.students.items,
    },
    teachers: {
      ...defaultSettings.teachers,
      ...(remoteSettings.teachers || {}),
      items: Array.isArray(remoteSettings.teachers?.items)
        ? remoteSettings.teachers.items
        : defaultSettings.teachers.items,
      all: Array.isArray(remoteSettings.teachers?.all)
        ? remoteSettings.teachers.all
        : Array.isArray(remoteSettings.teachers?.items)
        ? remoteSettings.teachers.items
        : defaultSettings.teachers.all,
    },
    admissionFees: Array.isArray(remoteSettings.admissionFees)
      ? remoteSettings.admissionFees
      : defaultSettings.admissionFees,
    gallery: {
      ...defaultSettings.gallery,
      ...(remoteSettings.gallery || {}),
      videos: Array.isArray(remoteSettings.gallery?.videos)
        ? remoteSettings.gallery.videos
        : defaultSettings.gallery.videos,
      photos:
        Array.isArray(remoteSettings.gallery?.photos) &&
        remoteSettings.gallery.photos.length > 0
          ? remoteSettings.gallery.photos
          : defaultSettings.gallery.photos,
    },
    footer: {
      ...defaultSettings.footer,
      ...(remoteSettings.footer || {}),
    },
    profile: {
      ...defaultSettings.profile,
      ...(remoteSettings.profile || {}),
      institutionName: remoteSettings.profile?.institutionName || instName,
      address: remoteSettings.profile?.address || instAddress,
      phone: remoteSettings.profile?.phone ?? madrasa?.phone ?? "",
      email: remoteSettings.profile?.email ?? madrasa?.email ?? "",
    },
    admission_form: remoteSettings.admission_form || null,
    madrasa: madrasa || null,
  };
};

export const PortalSettingsProvider = ({ children }) => {
  const [settings, setSettings] = useState(defaultSettings);
  const [loading, setLoading] = useState(false);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState(null);
  const [notFound, setNotFound] = useState(false);
  const [loadedSlug, setLoadedSlug] = useState(null);

  const loadPortalBySlug = useCallback(
    async (slug, force = false) => {
      if (!slug || RESERVED_PATHS.has(slug)) {
        setLoading(false);
        return;
      }
      if (!force && loadedSlug === slug) {
        return;
      }

      setLoading(true);
      setError(null);
      setNotFound(false);
      try {
        const response = await axiosInstance.get(`/portal/v1/${slug}`);
        const payload = response.data;
        if (payload?.success) {
          setSettings(mergePortalData(payload.data?.settings, payload.data?.madrasa));
          setLoadedSlug(slug);
        } else {
          setError(payload?.message || "Failed to load settings");
        }
      } catch (err) {
        if (err?.response?.status === 404) {
          setNotFound(true);
        }
        setError(err?.response?.data?.message || err.message);
      } finally {
        setLoading(false);
      }
    },
    [loadedSlug]
  );

  const loadManagedSettings = useCallback(async () => {
    const token = localStorage.getItem("accessToken");
    if (!token) return;

    setLoading(true);
    try {
      const response = await axiosInstance.get("/portal/v1/manage/settings");
      const payload = response.data;
      if (payload?.success) {
        setSettings(mergePortalData(payload.data?.settings, payload.data?.madrasa));
      }
    } catch (err) {
      console.warn("Failed to load managed portal settings:", err?.message);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    const firstSegment = window.location.pathname.split("/")[1];
    if (firstSegment && !RESERVED_PATHS.has(firstSegment)) {
      loadPortalBySlug(firstSegment);
    } else if (localStorage.getItem("accessToken")) {
      loadManagedSettings();
    }
  }, [loadPortalBySlug, loadManagedSettings]);

  const updateSettings = async (newSettings) => {
    setSettings(newSettings);
    try {
      // Remove any legacy oversized cache so base64 portal images never exhaust localStorage quota
      localStorage.removeItem("portal_settings");
    } catch {
      // Ignore storage errors
    }

    const token = localStorage.getItem("accessToken");
    if (!token) return { success: true };

    setSaving(true);
    try {
      const response = await axiosInstance.put("/portal/v1/manage/settings", newSettings);
      if (response.data?.success && response.data?.data) {
        const merged = mergePortalData(
          response.data.data.settings,
          response.data.data.madrasa
        );
        setSettings(merged);
        return { success: true, data: merged };
      }
      return { success: true };
    } catch (err) {
      console.error("Failed to save portal settings:", err);
      return {
        success: false,
        message: err?.response?.data?.message || "সেটিংস সংরক্ষণ করতে সমস্যা হয়েছে",
      };
    } finally {
      setSaving(false);
    }
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
        loadManagedSettings,
        loading,
        saving,
        error,
        notFound,
      }}
    >
      {children}
    </PortalSettingsContext.Provider>
  );
};
