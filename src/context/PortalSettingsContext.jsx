import { createContext, useContext, useState, useEffect } from "react";

const PortalSettingsContext = createContext();

export const usePortalSettings = () => {
  const context = useContext(PortalSettingsContext);
  if (!context) {
    throw new Error("usePortalSettings must be used within a PortalSettingsProvider");
  }
  return context;
};

const defaultSettings = {
  branding: {
    name: "আল কুরআনুল কারীম একাডেমি",
    tagline: "Madrasha, Education, Management",
    logoText: "AK",
  },
  contact: {
    phone: "+8801755-111111",
    email: "info@mms-it.com",
    address: "Dhaka, Bangladesh",
    social: {
      facebook: "#",
      twitter: "#",
      youtube: "#",
      instagram: "#"
    }
  },
  hero: {
    slides: [
      {
        image: "https://plus.unsplash.com/premium_photo-1661884485590-b186b518779d?q=80&w=2070",
        title: "আল-কুরআনুল কারীম একাডেমি",
        subtitle: "নাজরা বিভাগ, হিফজ বিভাগ, মাদ্দে একাডেমি",
        accent: "সুন্নাহ ও কোরআন ভিত্তিক সঠিক পদ্ধতিতে পাঠদান"
      },
      {
        image: "https://images.unsplash.com/photo-1591604129939-f1efa4d9f7fa?q=80&w=2070",
        title: "আধুনিক দ্বীনি শিক্ষা প্রতিষ্ঠান",
        subtitle: "উন্নত পরিবেশে সঠিক তিলাওয়াত ও হিফজ শিক্ষা",
        accent: "অভিজ্ঞ হাফেজ ও কারীগণের তত্ত্বাবধানে পরিচালিত"
      },
      {
        image: "https://images.unsplash.com/photo-1466442929976-97f336a657be?q=80&w=1974",
        title: "আপনার সন্তানের উজ্জ্বল ভবিষ্যৎ",
        subtitle: "হৃদয়ে ঈমান ও আমলের চর্চা ই আমাদের লক্ষ্য",
        accent: "সুন্দর ও সুশৃঙ্খল পরিবেশের নিশ্চয়তা"
      }
    ]
  },
  stats: [
    { val: "৫০০+", label: "শিক্ষার্থী" },
    { val: "৩০+", label: "শিক্ষক" },
    { val: "১৫+", label: "শ্রেণী" },
    { val: "১০+", label: "পুরস্কার" }
  ],
  about: {
    badge: "আমাদের সম্পর্কে",
    title: "আধুনিক সুশিক্ষিত ও আদর্শ জাতির অন্যতম প্রধান কারিগর গঠন",
    description: "আল-কুরআনুল কারীম একাডেমি একটি উত্তর আধুনিক দ্বীনি প্রতিষ্ঠান। যেখানে সুন্নাহ ও কোরআন ভিত্তিক সঠিক পদ্ধতিতে পাঠদান করা হয়। সঠিক দ্বীনি শিক্ষা ই পারে একটি সুন্দর ও শান্তিময় সমাজ উপহার দিতে।",
    highlights: [
      "উন্নত আধুনিক পদ্ধতিতে পাঠদান",
      "অভিজ্ঞ ও দক্ষ হাফেজ ও কারী",
      "সুশৃঙ্খল পরিবেশ ও আধুনিক পাঠদান",
      "মাসিক বিশেষ মূল্যায়নের ব্যবস্থা"
    ],
    mainImage: "https://images.unsplash.com/photo-1591604129939-f1efa4d9f7fa?q=80&w=2070",
    principalImage: "https://images.unsplash.com/photo-1540561214051-518451f2f87a?q=80&w=1974"
  },
  curriculum: {
    badge: "পাঠ্যক্রম",
    title: "বিশেষ ক্লাস কারিকুলাম"
  },
  students: {
    badge: "আমাদের শিক্ষার্থী",
    title: "আমাদের কৃতি শিক্ষার্থী বৃন্দ",
    items: [
      { name: "হযরত আলী", dept: "হিফজ বিভাগ", image: "https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?q=80&w=1974" },
      { name: "ওমর ফারুক", dept: "নাজরা বিভাগ", image: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?q=80&w=1974" },
      { name: "উসমান গনী", dept: "হিফজ বিভাগ", image: "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?q=80&w=1974" },
      { name: "আবু বকর", dept: "মাদ্দে একাডেমি", image: "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?q=80&w=1974" }
    ]
  },
  teachers: {
    badge: "আমাদের শিক্ষক",
    title: "আমাদের হিতাকাঙ্খী শিক্ষক বৃন্দ",
    items: [
      { name: "মুফতি আব্দুর রহমান", role: "সিনিয়র শিক্ষক", image: "https://images.unsplash.com/photo-1566492031773-4f4e44671857?q=80&w=1974" },
      { name: "হাফেজ মাওলানা ওবায়দুল্লাহ", role: "হিফজ বিভাগীয় প্রধান", image: "https://images.unsplash.com/photo-1560250097-0b93528c311a?q=80&w=1974" },
      { name: "মাওলানা মাহমুদ হাসান", role: "আরবি সাহিত্যিক", image: "https://images.unsplash.com/photo-1463453091185-61582044d556?q=80&w=1974" }
    ]
  },
  gallery: {
    videos: [
      { title: "বার্ষিক পুরষ্কার বিতরণী অনুষ্ঠান ২০২৪", thumb: "https://images.unsplash.com/photo-1523050353055-f112d624bf3b?q=80&w=2070" },
      { title: "হিফজ প্রতিযোগিতার বিশেষ মুহূর্ত", thumb: "https://images.unsplash.com/photo-1540561214051-518451f2f87a?q=80&w=1974" }
    ],
    photos: [1, 2, 3, 4, 5, 6, 7, 8]
  },
  footer: {
    aboutText: "আল-কুরআনুল কারীম একাডেমি একটি উত্তর আধুনিক দ্বীনি প্রতিষ্ঠান। যেখানে সুন্নাহ ও কোরআন ভিত্তিক সঠিক পদ্ধতিতে পাঠদান করা হয়।",
    copyright: `© ${new Date().getFullYear()} AL-QORANUL KAREEM ACADEMY. All rights reserved.`
  }
};

export const PortalSettingsProvider = ({ children }) => {
  const [settings, setSettings] = useState(() => {
    const saved = localStorage.getItem("portal_settings");
    return saved ? JSON.parse(saved) : defaultSettings;
  });

  const updateSettings = (newSettings) => {
    setSettings(newSettings);
    localStorage.setItem("portal_settings", JSON.stringify(newSettings));
  };

  const resetSettings = () => {
    setSettings(defaultSettings);
    localStorage.removeItem("portal_settings");
  };

  return (
    <PortalSettingsContext.Provider value={{ settings, updateSettings, resetSettings }}>
      {children}
    </PortalSettingsContext.Provider>
  );
};
