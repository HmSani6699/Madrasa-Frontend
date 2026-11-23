import { useState, useEffect, useMemo } from "react";
import { createPortal } from "react-dom";
import { Link } from "react-router-dom";
import {
  Video,
  Play,
  Edit,
  RefreshCw,
  ExternalLink,
  X,
  Save,
  CheckCircle2,
  Globe,
  Film,
  Sparkles,
  Youtube,
  Search,
  Check,
  AlertCircle,
  Eye,
  Trash2,
  Filter,
  Layers,
  ChevronDown,
  ChevronRight,
  BookOpen,
  UserCheck,
  Calculator,
  GraduationCap,
  Users,
  Settings as SettingsIcon,
  HelpCircle,
  Clock,
  PlayCircle
} from "lucide-react";
import adminService from "../../services/adminService";
import { toast } from "react-hot-toast";

// Helper: Extract YouTube ID
const getYouTubeId = (url) => {
  if (!url || typeof url !== "string") return null;
  const match = url.match(
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

  const vimeoMatch = trimmed.match(/vimeo\.com\/(?:video\/)?([0-9]+)/);
  if (vimeoMatch && vimeoMatch[1]) {
    return `https://player.vimeo.com/video/${vimeoMatch[1]}`;
  }

  return trimmed;
};

// Helper: Compute thumbnail
const computeThumbnail = (url) => {
  const ytId = getYouTubeId(url);
  if (ytId) {
    return `https://img.youtube.com/vi/${ytId}/mqdefault.jpg`;
  }
  return null;
};

// Default Landing Page Single Intro Video
const DEFAULT_INTRO_VIDEO = {
  videoUrl: "https://www.youtube.com/watch?v=ScMzIvxBSi4",
  embedUrl: "https://www.youtube-nocookie.com/embed/ScMzIvxBSi4",
  title: "মাদ্রাসা ম্যানেজমেন্ট সফটওয়্যার পরিচিতি ও ডেমো ভিডিও",
  description: "ভিডিওর মাধ্যমে সফটওয়্যারটির সকল আধুনিক ফিচার ও ব্যবহারবিধি বিস্তারিত দেখে নিন",
  isActive: true
};

// Panels Configuration
const PANELS = [
  { key: "admin", name: "মূল অ্যাডমিন (মুহতামিম) প্যানেল", role: "admin" },
  { key: "teacher", name: "শিক্ষক প্যানেল", role: "teacher" },
  { key: "accountant", name: "হিসাবরক্ষক প্যানেল", role: "accountant" },
  { key: "talimat", name: "তালিমাত প্যানেল", role: "talimat" },
  { key: "student", name: "শিক্ষার্থী পোর্টাল", role: "student" },
  { key: "guardian", name: "অভিভাবক পোর্টাল", role: "guardian" }
];

// All Menus Definition for Admin (Mohtamim) Panel
const ADMIN_PANEL_MENUS = [
  {
    mainMenu: "ড্যাশবোর্ড",
    mainMenuEn: "Dashboard",
    subMenus: [
      {
        subMenu: "ওভারভিউ ও ড্যাশবোর্ড",
        subMenuEn: "Overview",
        path: "/admin",
        key: "dashboard",
        defaultTitle: "মাদ্রাসার মূল ড্যাশবোর্ড পরিচিতি ও গুরুত্বপূর্ণ ডাটা অ্যানালিটিক্স",
        defaultDesc: "মাদ্রাসার দৈনিক উপস্থিতি, বকেয়া ও আদায়কৃত ফি এবং সার্বিক অ্যাকাডেমিক পরিসংখ্যানের সারসংক্ষেপ।"
      }
    ]
  },
  {
    mainMenu: "ভর্তি",
    mainMenuEn: "Admission",
    subMenus: [
      {
        subMenu: "ছাত্র-ছাত্রী তালিকা",
        subMenuEn: "Student List",
        path: "/admin/student/list",
        key: "admission-list",
        defaultTitle: "ছাত্র-ছাত্রী তালিকা দেখা, ফিল্টারিং ও শিক্ষার্থী প্রোফাইল অনুসন্ধান",
        defaultDesc: "ক্লাস, সেকশন ও রোল অনুযায়ী ছাত্র-ছাত্রীদের তালিকা ফিল্টার করা ও প্রোফাইল ডাটা দেখা।"
      },
      {
        subMenu: "ভর্তি ফর্ম",
        subMenuEn: "Create Admission",
        path: "/admin/admission/create",
        key: "admission-create",
        defaultTitle: "ভর্তি ফর্ম পূরণ ও নতুন শিক্ষার্থী নিবন্ধন পদ্ধতি",
        defaultDesc: "নতুন শিক্ষার্থীর ব্যক্তিগত তথ্য, অভিভাবকের তথ্য এবং স্বয়ংক্রিয় স্টুডেন্ট আইডি ও রোল নম্বর তৈরির পদ্ধতি।"
      },
      {
        subMenu: "অনলাইন ভর্তি",
        subMenuEn: "Online Admission",
        path: "/admin/admissions/online",
        key: "admission-online",
        defaultTitle: "অনলাইন ভর্তি আবেদন পর্যালোচনা, যাচাই ও অনুমোদন",
        defaultDesc: "ওয়েবসাইট থেকে আসা অভিভাবকদের অনলাইন ভর্তি আবেদনপত্রসমূহ যাচাই-বাছাই ও স্থায়ী তালিকায় অন্তর্ভুক্তি।"
      },
      {
        subMenu: "ভর্তি রিপোর্ট",
        subMenuEn: "Admission Report",
        path: "/admin/admission/report",
        key: "admission-report",
        defaultTitle: "ভর্তি সংক্রান্ত রিপোর্ট ও বিশ্লেষণ",
        defaultDesc: "মাসভিত্তিক বা সেশনভিত্তিক মোট ভর্তির সংখ্যা ও বিস্তারিত প্রতিবেদন ডাউনলোড।"
      }
    ]
  },
  {
    mainMenu: "অভিভাবক",
    mainMenuEn: "Parents",
    subMenus: [
      {
        subMenu: "অভিভাবক তালিকা",
        subMenuEn: "Parent List",
        path: "/admin/parents/list",
        key: "parent-list",
        defaultTitle: "অভিভাবকদের তালিকা ও যোগাযোগ তথ্য",
        defaultDesc: "সকল শিক্ষার্থীর পিতা-মাতা বা অভিভাবকের নাম, মোবাইল নম্বর ও দ্রুত যোগাযোগের গাইড।"
      }
    ]
  },
  {
    mainMenu: "স্টাফ / শিক্ষক",
    mainMenuEn: "Employee",
    subMenus: [
      {
        subMenu: "স্টাফ তালিকা",
        subMenuEn: "Employee List",
        path: "/admin/employee/list",
        key: "employee-list",
        defaultTitle: "মাদ্রাসার সকল শিক্ষক ও কর্মকর্তা-কর্মচারীর তালিকা",
        defaultDesc: "সকল শিক্ষকের পদবী, বিভাগ, ফোন নম্বর ও প্রোফাইল ডাটা সহজে অনুসন্ধান।"
      },
      {
        subMenu: "নতুন স্টাফ যোগ করুন",
        subMenuEn: "Add New Employee",
        path: "/admin/employee/create",
        key: "employee-create",
        defaultTitle: "নতুন শিক্ষক বা স্টাফ যোগ করার নিয়ম",
        defaultDesc: "নতুন শিক্ষক বা কর্মচারী নিয়োগের সময় তার যাবতীয় তথ্য ও অ্যাকাউন্ট তৈরির পদ্ধতি।"
      },
      {
        subMenu: "পদবী যোগ করুন",
        subMenuEn: "Add Designation",
        path: "/admin/employee/designation",
        key: "employee-designation",
        defaultTitle: "পদবী ও বিভাগ কনফিগারেশন",
        defaultDesc: "মুহতামিম, নাযেমে তালিমাত, সিনিয়র শিক্ষক ইত্যাদি পদবী তৈরি ও পরিচালনা।"
      },
      {
        subMenu: "বেতন সেটআপ",
        subMenuEn: "Salary Setup",
        path: "/admin/employee/salary-setup",
        key: "employee-salary-setup",
        defaultTitle: "শিক্ষক ও কর্মকর্তা-কর্মচারীদের মাসিক বেতন নির্ধারণ",
        defaultDesc: "মূল বেতন, বাড়িভাড়া ও বিভিন্ন ভাতা সহ মাসিক বেতন স্কেল নির্ধারণ করার পদ্ধতি।"
      }
    ]
  },
  {
    mainMenu: "উপস্থিতি",
    mainMenuEn: "Attendance",
    subMenus: [
      {
        subMenu: "ছাত্র উপস্থিতি",
        subMenuEn: "Student Attendance",
        path: "/admin/attendance/student",
        key: "attendance-student",
        defaultTitle: "দৈনিক ছাত্র হাজিরা গ্রহণ ও অনুপস্থিতি এসএমএস",
        defaultDesc: "ক্লাস ও সেকশন ধরে এক ক্লিকে ছাত্র-ছাত্রীদের দৈনিক উপস্থিতি গ্রহণ ও স্বয়ংক্রিয় এসএমএস প্রেরণ।"
      },
      {
        subMenu: "স্টাফ উপস্থিতি",
        subMenuEn: "Employee Attendance",
        path: "/admin/attendance/employee",
        key: "attendance-employee",
        defaultTitle: "শিক্ষক ও কর্মচারীদের দৈনিক উপস্থিতি গ্রহণ",
        defaultDesc: "হাতে বা ডিভাইসের মাধ্যমে শিক্ষক ও কর্মচারীদের হাজিরা রেকর্ড করার উপায়।"
      },
      {
        subMenu: "উপস্থিতি রিপোর্ট",
        subMenuEn: "Attendance Report",
        path: "/admin/attendance/report/student",
        key: "attendance-report",
        defaultTitle: "মাসিক ও বাৎসরিক হাজিরা প্রতিবেদন",
        defaultDesc: "শিক্ষার্থী ও স্টাফদের উপস্থিতির হার ও রিপোর্ট প্রিন্ট করার পদ্ধতি।"
      }
    ]
  },
  {
    mainMenu: "একাডেমিক",
    mainMenuEn: "Academic",
    subMenus: [
      {
        subMenu: "ক্লাস তালিকা",
        subMenuEn: "Class List",
        path: "/admin/academic/class",
        key: "academic-class",
        defaultTitle: "মাদ্রাসার জামাত / ক্লাস ব্যবস্থাপনা",
        defaultDesc: "নূরানী, নাজেরা, হেফজ, কিতাব বিভাগসহ যেকোনো জামাত তৈরি ও পরিচালনা।"
      },
      {
        subMenu: "সেকশন তালিকা",
        subMenuEn: "Section List",
        path: "/admin/academic/section",
        key: "academic-section",
        defaultTitle: "শাখা বা সেকশন তৈরি ও বিন্যাস",
        defaultDesc: "ক, খ, গ শাখা বা ছাত্র/ছাত্রী আলাদা সেকশন তৈরি এবং বণ্টন।"
      },
      {
        subMenu: "ক্লাস রুটিন",
        subMenuEn: "Class Schedule",
        path: "/admin/academic/schedule/class",
        key: "academic-routine",
        defaultTitle: "ক্লাস ভিত্তিক সময়সূচী বা সাপ্তাহিক রুটিন তৈরি",
        defaultDesc: "প্রতিটি ক্লাসের বিষয় ও পিরিয়ড অনুযায়ী স্বয়ংক্রিয় রুটিন তৈরি ও প্রিন্ট।"
      },
      {
        subMenu: "ক্লাস সিলেবাস",
        subMenuEn: "Class Syllabus",
        path: "/admin/academic/syllabus",
        key: "academic-syllabus",
        defaultTitle: "ক্লাস ও পরীক্ষার সিলেবাস আপলোড ও সংরক্ষণ",
        defaultDesc: "টার্মভিত্তিক পড়া ও পাঠ্যসূচি পিডিএফ আকারে প্রকাশ।"
      }
    ]
  },
  {
    mainMenu: "পরীক্ষা",
    mainMenuEn: "Examination",
    subMenus: [
      {
        subMenu: "পরীক্ষার টার্ম ও নাম",
        subMenuEn: "Exam Term",
        path: "/admin/exam/term",
        key: "exam-term",
        defaultTitle: "সাময়িক ও বার্ষিক পরীক্ষার টার্ম সেটআপ",
        defaultDesc: "পরীক্ষার সেশন ও নাম নির্ধারণ করার নিয়ম।"
      },
      {
        subMenu: "পরীক্ষার রুটিন",
        subMenuEn: "Exam Schedule",
        path: "/admin/exam/schedule",
        key: "exam-schedule",
        defaultTitle: "পরীক্ষার তারিখ, সময় ও হল সিট সংক্রান্ত রুটিন তৈরি",
        defaultDesc: "বিষয়ভিত্তিক পরীক্ষার রুটিন ও পরীক্ষার হল সিট প্ল্যানিং করার পদ্ধতি।"
      },
      {
        subMenu: "নম্বর এন্ট্রি",
        subMenuEn: "Mark Entries",
        path: "/admin/exam/marks/entry",
        key: "exam-marks",
        defaultTitle: "মৌখিক ও লিখিত পরীক্ষার নম্বর এন্ট্রি পদ্ধতি",
        defaultDesc: "সহজে প্রতিটি বিষয়ের নম্বর ইনপুট ও স্বয়ংক্রিয় যোগফল হিসাব।"
      },
      {
        subMenu: "ট্যাবুলেশন শিট ও ফলাফল",
        subMenuEn: "Tabulation Sheet",
        path: "/admin/exam/tabulation",
        key: "exam-tabulation",
        defaultTitle: "স্বয়ংক্রিয় রেজাল্ট কার্ড, মেধা তালিকা ও ট্যাবুলেশন শিট",
        defaultDesc: "এক ক্লিকে আকর্ষণীয় মার্কশিট ও গ্রেড পয়েন্টসহ ফলাফল প্রকাশ ও প্রিন্ট।"
      }
    ]
  },
  {
    mainMenu: "অফিস হিসাবরক্ষণ",
    mainMenuEn: "Office Accounting",
    subMenus: [
      {
        subMenu: "ফি গ্রহণ",
        subMenuEn: "Collect Fees",
        path: "/admin/accounting/fees/collect",
        key: "fees-collect",
        defaultTitle: "ছাত্র-ছাত্রীদের থেকে ফি আদায় ও স্বয়ংক্রিয় রসিদ প্রিন্ট",
        defaultDesc: "বকেয়া ফি চেক, আংশিক বা পূর্ণ বেতন গ্রহণ ও প্রিন্টেবল রিসিট তৈরি।"
      },
      {
        subMenu: "ফি এর ধরন",
        subMenuEn: "Fee Type",
        path: "/admin/accounting/fees/type",
        key: "fees-type",
        defaultTitle: "ভর্তি ফি, মাসিক বেতন ইত্যাদি ক্যাটাগরি তৈরি",
        defaultDesc: "প্রতিটি ক্লাসের জন্য আলাদা আলাদা ফি কাঠামো নির্ধারণ করার উপায়।"
      },
      {
        subMenu: "মাসিক পেরোল",
        subMenuEn: "Monthly Payroll",
        path: "/admin/accounting/payroll/monthly",
        key: "payroll-monthly",
        defaultTitle: "সকল শিক্ষকের মাসিক বেতন বিতরণ ও পে-স্লিপ প্রিন্ট",
        defaultDesc: "এক ক্লিকে বেতন শিট তৈরি ও পে-স্লিপ প্রিন্ট করার নিয়ম।"
      },
      {
        subMenu: "দান ও অনুদান",
        subMenuEn: "Receive Donation",
        path: "/admin/accounting/donation/create",
        key: "donation-create",
        defaultTitle: "সাধারণ দান, যাকাত ও আজীবন দাতার অনুদান গ্রহণ",
        defaultDesc: "দাতাদের তথ্য সংরক্ষণ ও তাৎক্ষণিক অনুদান রসিদ প্রদান।"
      },
      {
        subMenu: "ব্যয় ভাউচার",
        subMenuEn: "Add Expense",
        path: "/admin/accounting/expense/create",
        key: "expense-create",
        defaultTitle: "দৈনিক ও মাসিক যাবতীয় খরচের ভাউচার এন্ট্রি",
        defaultDesc: "বাজার খরচ, বিদ্যুৎ বিল ইত্যাদি খরচের হিসাব সংরক্ষণ।"
      },
      {
        subMenu: "আয় ও ব্যয় রিপোর্ট",
        subMenuEn: "Accounting Report",
        path: "/admin/accounting/report/income-expense",
        key: "accounting-report",
        defaultTitle: "সার্বিক ক্যাশ বুক ও আয়-ব্যয়ের লাভ-লোকসান ব্যালেন্স শিট",
        defaultDesc: "মোট আয়, মোট ব্যয় ও চূড়ান্ত ব্যালেন্স হিসাবের প্রতিবেদন।"
      }
    ]
  },
  {
    mainMenu: "কার্ড ও সনদপত্র",
    mainMenuEn: "Card & Certificate",
    subMenus: [
      {
        subMenu: "শিক্ষার্থী আইডি কার্ড",
        subMenuEn: "Student ID Card",
        path: "/admin/card/student",
        key: "card-student",
        defaultTitle: "কিউআর কোডসহ ডিজিটাল শিক্ষার্থী আইডি কার্ড তৈরি ও প্রিন্ট",
        defaultDesc: "ছবি ও লোগো সংবলিত প্রফেশনাল আইডি কার্ড প্রিন্ট করার সুবিধা।"
      },
      {
        subMenu: "এডমিট কার্ড তৈরি",
        subMenuEn: "Generate Admit Card",
        path: "/admin/card/admit-generate",
        key: "card-admit",
        defaultTitle: "পরীক্ষার প্রবেশপত্র বা এডমিট কার্ড এক ক্লিকে তৈরি",
        defaultDesc: "ফি পরিশোধ যাচাই সাপেক্ষে এডমিট কার্ড প্রিন্ট করার নিয়ম।"
      },
      {
        subMenu: "সনদপত্র তৈরি",
        subMenuEn: "Certificate",
        path: "/admin/certificate/student",
        key: "certificate-student",
        defaultTitle: "প্রশংসাপত্র, প্রত্যয়নপত্র ও ক্যারেক্টার সার্টিফিকেট তৈরি",
        defaultDesc: "মাদ্রাসার অফিসিয়াল সিল ও প্যাডসহ শিক্ষার্থীর প্রশংসাপত্র প্রস্তুত করার উপায়।"
      }
    ]
  },
  {
    mainMenu: "বার্তা ও অন্যান্য",
    mainMenuEn: "SMS & Other Services",
    subMenus: [
      {
        subMenu: "এসএমএস পোর্টাল",
        subMenuEn: "SMS Portal",
        path: "/admin/sms-portal",
        key: "sms-portal",
        defaultTitle: "বাল্ক বাংলা এসএমএস ও নোটিফিকেশন প্রেরণ পদ্ধতি",
        defaultDesc: "সকল অভিভাবক বা নির্দিষ্ট ক্লাসে এক ক্লিকে এসএমএস পাঠানোর নিয়ম।"
      },
      {
        subMenu: "স্মার্ট লাইব্রেরি",
        subMenuEn: "Library",
        path: "/admin/library",
        key: "library",
        defaultTitle: "মাদ্রাসার কিতাব ও বই ইস্যু-ফেরত ব্যবস্থাপনা",
        defaultDesc: "লাইব্রেরির কিতাবের তালিকা সংরক্ষণ ও ইস্যু-ফেরতের রেকর্ড।"
      },
      {
        subMenu: "ফ্রন্টএন্ড ম্যানেজার",
        subMenuEn: "Frontend",
        path: "/admin/frontend",
        key: "frontend-manager",
        defaultTitle: "মাদ্রাসার পাবলিক ওয়েবসাইট ও নোটিশ বোর্ড নিয়ন্ত্রণ",
        defaultDesc: "ছবি, ব্যানার, নোটিশ ও স্লাইডার সহজে ওয়েবসাইট পেজে আপডেট করা।"
      },
      {
        subMenu: "সিস্টেম সেটিংস",
        subMenuEn: "Settings",
        path: "/admin/settings",
        key: "settings",
        defaultTitle: "মাদ্রাসার নাম, লোগো ও সার্বিক কনফিগারেশন সেটিংস",
        defaultDesc: "মাদ্রাসার তথ্য আপডেট, সেশন পরিবর্তন ও ব্যাকআপ নেওয়ার সেটিংস।"
      }
    ]
  }
];

const DemoVideoSettings = () => {
  // Active Tab: 'menu_tutorials' | 'intro_video'
  const [activeTab, setActiveTab] = useState("menu_tutorials");

  // Selected Panel
  const [selectedPanel, setSelectedPanel] = useState("admin");

  // Search & Filter state
  const [searchQuery, setSearchQuery] = useState("");
  const [statusFilter, setStatusFilter] = useState("all"); // 'all' | 'published' | 'draft' | 'no_video'

  // Server data for tutorial videos
  const [tutorialVideos, setTutorialVideos] = useState([]);
  const [loadingTutorials, setLoadingTutorials] = useState(false);

  // Intro video state
  const [introVideoData, setIntroVideoData] = useState(DEFAULT_INTRO_VIDEO);
  const [loadingIntro, setLoadingIntro] = useState(false);

  // Modal: Edit Tutorial Video
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [editingTarget, setEditingTarget] = useState(null); // The menu item being edited
  const [tutorialForm, setTutorialForm] = useState({
    videoUrl: "",
    title: "",
    description: "",
    duration: "",
    isPublished: true
  });
  const [isSavingTutorial, setIsSavingTutorial] = useState(false);

  // Modal: Preview Video
  const [previewModalVideo, setPreviewModalVideo] = useState(null);

  // Modal: Edit Intro Video
  const [isIntroModalOpen, setIsIntroModalOpen] = useState(false);
  const [introForm, setIntroForm] = useState({
    videoUrl: "",
    title: "",
    description: "",
    isActive: true
  });
  const [isSavingIntro, setIsSavingIntro] = useState(false);

  // Fetch all tutorial videos
  const fetchTutorialVideos = async () => {
    try {
      setLoadingTutorials(true);
      const res = await adminService.getAllTutorialVideos({ panelKey: selectedPanel });
      if (res?.success && Array.isArray(res?.data)) {
        setTutorialVideos(res.data);
      }
    } catch (err) {
      console.warn("Could not load backend tutorial videos, falling back:", err);
    } finally {
      setLoadingTutorials(false);
    }
  };

  // Fetch landing intro video
  const fetchIntroVideo = async () => {
    try {
      setLoadingIntro(true);
      const res = await adminService.getDemoVideoSettings();
      if (res?.success && res?.data) {
        setIntroVideoData({
          videoUrl: res.data.videoUrl || DEFAULT_INTRO_VIDEO.videoUrl,
          embedUrl: res.data.embedUrl || computeEmbedUrl(res.data.videoUrl),
          title: res.data.title || DEFAULT_INTRO_VIDEO.title,
          description: res.data.description || DEFAULT_INTRO_VIDEO.description,
          isActive: res.data.isActive !== undefined ? res.data.isActive : true,
          updatedAt: res.data.updatedAt || new Date()
        });
      }
    } catch (err) {
      console.error("Failed to load intro video:", err);
    } finally {
      setLoadingIntro(false);
    }
  };

  useEffect(() => {
    fetchTutorialVideos();
    fetchIntroVideo();
  }, [selectedPanel]);

  // Index existing server videos by path or key
  const serverVideosMap = useMemo(() => {
    const map = {};
    tutorialVideos.forEach((v) => {
      if (v.path) map[v.path] = v;
      if (v.menuKey) map[v.menuKey] = v;
      if (v.subMenu) map[v.subMenu] = v;
    });
    return map;
  }, [tutorialVideos]);

  // Combine static menu definition with server videos
  const fullMenuItemsList = useMemo(() => {
    const list = [];
    const matchedServerIds = new Set();

    ADMIN_PANEL_MENUS.forEach((menuGroup) => {
      menuGroup.subMenus.forEach((sub) => {
        const serverDoc =
          serverVideosMap[sub.path] || serverVideosMap[sub.key] || serverVideosMap[sub.subMenu];
        if (serverDoc?._id) matchedServerIds.add(serverDoc._id.toString());
        list.push({
          ...sub,
          mainMenu: menuGroup.mainMenu,
          mainMenuEn: menuGroup.mainMenuEn,
          serverDoc,
          hasVideo: Boolean(serverDoc && serverDoc.videoUrl),
          isPublished: serverDoc ? Boolean(serverDoc.isPublished) : false,
          currentVideoUrl: serverDoc?.videoUrl || "",
          currentTitle: serverDoc?.title || sub.defaultTitle,
          currentDesc: serverDoc?.description || sub.defaultDesc,
          currentDuration: serverDoc?.duration || "০৩:০০ মিনিট"
        });
      });
    });

    // Also include any server video that was created custom
    tutorialVideos.forEach((v) => {
      if (v._id && !matchedServerIds.has(v._id.toString())) {
        list.push({
          key: v.menuKey || v._id.toString(),
          path: v.path || "/custom",
          subMenu: v.subMenu || "কাস্টম টিউটোরিয়াল",
          subMenuEn: v.subMenuEn || "Custom",
          mainMenu: v.mainMenu || "অন্যান্য টিউটোরিয়াল",
          mainMenuEn: v.mainMenuEn || "Custom",
          serverDoc: v,
          hasVideo: true,
          isPublished: Boolean(v.isPublished),
          currentVideoUrl: v.videoUrl || "",
          currentTitle: v.title || v.subMenu,
          currentDesc: v.description || "",
          currentDuration: v.duration || "০৩:০০ মিনিট",
          isCustomCreated: true
        });
      }
    });

    return list;
  }, [serverVideosMap, tutorialVideos]);

  // Filtered menu items based on Search & Status
  const filteredMenuItems = useMemo(() => {
    return fullMenuItemsList.filter((item) => {
      // Status filter
      if (statusFilter === "published" && (!item.hasVideo || !item.isPublished)) return false;
      if (statusFilter === "draft" && (!item.hasVideo || item.isPublished)) return false;
      if (statusFilter === "no_video" && item.hasVideo) return false;

      // Search query
      if (searchQuery.trim()) {
        const q = searchQuery.toLowerCase();
        return (
          item.mainMenu.toLowerCase().includes(q) ||
          item.subMenu.toLowerCase().includes(q) ||
          item.path.toLowerCase().includes(q) ||
          item.currentTitle.toLowerCase().includes(q)
        );
      }

      return true;
    });
  }, [fullMenuItemsList, searchQuery, statusFilter]);

  // Statistics
  const totalMenus = fullMenuItemsList.length;
  const publishedCount = fullMenuItemsList.filter((i) => i.hasVideo && i.isPublished).length;
  const draftCount = fullMenuItemsList.filter((i) => i.hasVideo && !i.isPublished).length;
  const missingCount = fullMenuItemsList.filter((i) => !i.hasVideo).length;

  // Open Add New Tutorial Modal
  const handleOpenAddNewTutorial = () => {
    setEditingTarget(null);
    setTutorialForm({
      mainMenu: "ভর্তি",
      subMenu: "",
      path: "",
      videoUrl: "",
      title: "",
      description: "",
      duration: "০৩:০০ মিনিট",
      isPublished: true
    });
    setIsEditModalOpen(true);
  };

  // Open Edit Modal for a Submenu
  const handleOpenEditTutorial = (item) => {
    setEditingTarget(item);
    setTutorialForm({
      mainMenu: item.mainMenu,
      subMenu: item.subMenu,
      path: item.path,
      videoUrl: item.currentVideoUrl || "https://www.youtube.com/watch?v=ScMzIvxBSi4",
      title: item.currentTitle || `${item.mainMenu} - ${item.subMenu}`,
      description: item.currentDesc || "",
      duration: item.currentDuration || "০৩:০০ মিনিট",
      isPublished: item.serverDoc ? item.serverDoc.isPublished !== false : true
    });
    setIsEditModalOpen(true);
  };

  // Save / Upsert Tutorial Video (Create & Update)
  const handleSaveTutorial = async (e) => {
    e.preventDefault();
    if (!tutorialForm.videoUrl.trim()) {
      toast.error("অনুগ্রহ করে ভিডিও লিঙ্ক দিন");
      return;
    }

    try {
      setIsSavingTutorial(true);
      const isNew = !editingTarget;
      const subMenu = editingTarget ? editingTarget.subMenu : (tutorialForm.subMenu?.trim() || "টিউটোরিয়াল");
      const mainMenu = editingTarget ? editingTarget.mainMenu : (tutorialForm.mainMenu?.trim() || "সাধারণ");
      const path = editingTarget ? editingTarget.path : (tutorialForm.path?.trim() || `/admin/custom-${Date.now()}`);
      const menuKey = editingTarget ? editingTarget.key : (path.replace(/^\//, '').replace(/\//g, '-') || `custom-${Date.now()}`);

      const payload = {
        id: editingTarget?.serverDoc?._id,
        panelKey: selectedPanel,
        menuKey,
        path,
        mainMenu,
        mainMenuEn: editingTarget ? editingTarget.mainMenuEn : mainMenu,
        subMenu,
        subMenuEn: editingTarget ? editingTarget.subMenuEn : subMenu,
        title: tutorialForm.title?.trim() || `${mainMenu} - ${subMenu}`,
        description: tutorialForm.description?.trim() || "",
        videoUrl: tutorialForm.videoUrl.trim(),
        duration: tutorialForm.duration?.trim() || "০৩:০০ মিনিট",
        isPublished: Boolean(tutorialForm.isPublished)
      };

      const res = await adminService.saveTutorialVideo(payload);
      if (res?.success) {
        toast.success(res.message || "ভিডিও সফলভাবে সংরক্ষিত ও আপডেট হয়েছে!");
        setIsEditModalOpen(false);
        fetchTutorialVideos();
      } else {
        toast.error(res?.message || "সংরক্ষণ ব্যর্থ হয়েছে");
      }
    } catch (err) {
      console.error("Save tutorial error:", err);
      toast.error("সার্ভার এরর: ভিডিও সংরক্ষণ করা যায়নি");
    } finally {
      setIsSavingTutorial(false);
    }
  };

  // Toggle Publish Status
  const handleTogglePublish = async (item) => {
    if (!item.serverDoc?._id) {
      // If not saved to DB yet, open modal to save first
      handleOpenEditTutorial(item);
      return;
    }

    try {
      const res = await adminService.toggleTutorialVideoPublish(item.serverDoc._id);
      if (res?.success) {
        toast.success(res.message || "পাবলিশ স্ট্যাটাস সফলভাবে পরিবর্তিত হয়েছে");
        fetchTutorialVideos();
      }
    } catch (err) {
      toast.error("স্ট্যাটাস আপডেট করতে সমস্যা হয়েছে");
    }
  };

  // Delete Video
  const handleDeleteTutorial = async (item) => {
    if (!item.serverDoc?._id) return;
    if (!window.confirm(`আপনি কি "${item.subMenu}" এর ভিডিও মুছে ফেলতে চান?`)) return;

    try {
      const res = await adminService.deleteTutorialVideo(item.serverDoc._id);
      if (res?.success) {
        toast.success("ভিডিও সফলভাবে মুছে ফেলা হয়েছে");
        fetchTutorialVideos();
      }
    } catch (err) {
      toast.error("ভিডিও মুছতে সমস্যা হয়েছে");
    }
  };

  // Save Intro Video
  const handleSaveIntro = async (e) => {
    e.preventDefault();
    if (!introForm.videoUrl.trim()) {
      toast.error("ভিডিও লিঙ্ক দিন");
      return;
    }

    try {
      setIsSavingIntro(true);
      const res = await adminService.updateDemoVideoSettings(introForm);
      if (res?.success) {
        toast.success("পরিচিতি ভিডিও সফলভাবে সংরক্ষিত হয়েছে");
        setIntroVideoData({
          ...introForm,
          embedUrl: computeEmbedUrl(introForm.videoUrl),
          updatedAt: new Date()
        });
        setIsIntroModalOpen(false);
      }
    } catch (err) {
      toast.error("ভিডিও আপডেট করতে সমস্যা হয়েছে");
    } finally {
      setIsSavingIntro(false);
    }
  };

  return (
    <div className="space-y-6 font-bangla animate-fade-in pb-16">
      {/* ============================================================== */}
      {/* 1. TOP HEADER & NAVIGATION */}
      {/* ============================================================== */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 bg-white p-5 rounded-2xl border border-slate-200 shadow-xs">
        <div>
          <div className="flex items-center gap-2">
            <h1 className="text-xl sm:text-2xl font-bold text-slate-900">
              ভিডিও ডেমো ও কোর্স সেটিংস
            </h1>
            <span className="text-xs bg-emerald-100 text-emerald-800 font-bold px-2.5 py-0.5 rounded-full">
              সুপার অ্যাডমিন কন্ট্রোল
            </span>
          </div>
          <p className="text-slate-500 text-xs sm:text-sm mt-1">
            প্রতিটি প্যানেলের মেইন মেনু ও সাবমেনু অনুযায়ী সরাসরি ভিডিও টিউটোরিয়াল আপলোড, পাবলিশ ও নিয়ন্ত্রণ করুন।
          </p>
        </div>

        {/* Global Action Buttons */}
        <div className="flex flex-wrap items-center gap-2.5 shrink-0">
          {/* Add New Video Button */}
          <button
            type="button"
            onClick={handleOpenAddNewTutorial}
            className="inline-flex items-center gap-1.5 bg-[#1C7D5A] hover:bg-[#145a40] text-white px-4 py-2 rounded-xl text-xs sm:text-sm font-bold shadow-xs transition-all cursor-pointer active:scale-95"
          >
            <Sparkles className="w-4 h-4" />
            <span>+ নতুন ভিডিও যুক্ত করুন</span>
          </button>

          <button
            type="button"
            onClick={() => {
              fetchTutorialVideos();
              fetchIntroVideo();
            }}
            className="inline-flex items-center gap-1.5 bg-slate-100 hover:bg-slate-200 text-slate-700 px-3.5 py-2 rounded-xl text-xs font-semibold transition-all cursor-pointer"
            title="রিফ্রেশ করুন"
          >
            <RefreshCw className={`w-3.5 h-3.5 ${loadingTutorials ? "animate-spin text-[#1C7D5A]" : ""}`} />
            <span>রিফ্রেশ</span>
          </button>

          {/* View Public Video Demo Page */}
          <Link
            to="/video-demo"
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-1.5 bg-emerald-50 hover:bg-emerald-100 text-[#1C7D5A] border border-emerald-200 px-3.5 py-2 rounded-xl text-xs font-semibold shadow-xs transition-all cursor-pointer active:scale-95"
            title="লাইভ ভিডিও ডেমো পেজ দেখুন"
          >
            <ExternalLink className="w-3.5 h-3.5" />
            <span>লাইভ ডেমো পেজ</span>
          </Link>
        </div>
      </div>

      {/* ============================================================== */}
      {/* 2. TABS SELECTOR */}
      {/* ============================================================== */}
      <div className="flex border-b border-slate-200 space-x-2">
        <button
          type="button"
          onClick={() => setActiveTab("menu_tutorials")}
          className={`pb-3 px-4 text-sm font-bold border-b-2 transition-all flex items-center gap-2 cursor-pointer ${
            activeTab === "menu_tutorials"
              ? "border-[#1C7D5A] text-[#1C7D5A]"
              : "border-transparent text-slate-500 hover:text-slate-800"
          }`}
        >
          <Layers className="w-4 h-4" />
          <span>মেনুভিত্তিক ভিডিও টিউটোরিয়াল (Video Demo)</span>
          <span className="text-[11px] bg-emerald-100 text-[#1C7D5A] px-2 py-0.5 rounded-full font-bold">
            {publishedCount}/{totalMenus}
          </span>
        </button>

        <button
          type="button"
          onClick={() => setActiveTab("intro_video")}
          className={`pb-3 px-4 text-sm font-bold border-b-2 transition-all flex items-center gap-2 cursor-pointer ${
            activeTab === "intro_video"
              ? "border-[#1C7D5A] text-[#1C7D5A]"
              : "border-transparent text-slate-500 hover:text-slate-800"
          }`}
        >
          <Film className="w-4 h-4" />
          <span>পরিচিতি ভিডিও (ফ্রি ডেমো আবেদন পেজ)</span>
        </button>
      </div>

      {/* ============================================================== */}
      {/* TAB 1: MENU TUTORIAL VIDEOS MANAGEMENT (Requirement 5) */}
      {/* ============================================================== */}
      {activeTab === "menu_tutorials" && (
        <div className="space-y-6">
          {/* Panel Selector & Stats Row */}
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            {/* Panel Selector Dropdown Card */}
            <div className="bg-white p-4 rounded-2xl border border-slate-200 shadow-xs flex flex-col justify-between">
              <span className="text-xs text-slate-400 font-bold uppercase tracking-wider">
                প্যানেল নির্বাচন করুন
              </span>
              <select
                value={selectedPanel}
                onChange={(e) => setSelectedPanel(e.target.value)}
                className="mt-2 w-full p-2 bg-slate-50 border border-slate-300 rounded-xl text-xs sm:text-sm font-bold text-slate-800 focus:outline-none focus:border-[#1C7D5A] transition-all cursor-pointer"
              >
                {PANELS.map((p) => (
                  <option key={p.key} value={p.key}>
                    {p.name}
                  </option>
                ))}
              </select>
            </div>

            {/* Stat: Published */}
            <div className="bg-emerald-50/80 border border-emerald-200 p-4 rounded-2xl shadow-xs flex items-center justify-between">
              <div>
                <p className="text-xs text-emerald-800 font-bold">ভিডিও পাবলিশড</p>
                <p className="text-2xl font-black text-emerald-900 mt-1">{publishedCount}</p>
              </div>
              <div className="w-10 h-10 rounded-xl bg-emerald-600 text-white flex items-center justify-center shadow-sm">
                <CheckCircle2 className="w-5 h-5" />
              </div>
            </div>

            {/* Stat: Draft */}
            <div className="bg-amber-50/80 border border-amber-200 p-4 rounded-2xl shadow-xs flex items-center justify-between">
              <div>
                <p className="text-xs text-amber-800 font-bold">ড্রাফট / অপ্রকাশিত</p>
                <p className="text-2xl font-black text-amber-900 mt-1">{draftCount}</p>
              </div>
              <div className="w-10 h-10 rounded-xl bg-amber-500 text-white flex items-center justify-center shadow-sm">
                <Clock className="w-5 h-5" />
              </div>
            </div>

            {/* Stat: Missing Videos */}
            <div className="bg-slate-50 border border-slate-200 p-4 rounded-2xl shadow-xs flex items-center justify-between">
              <div>
                <p className="text-xs text-slate-500 font-bold">ভিডিও যুক্ত নেই</p>
                <p className="text-2xl font-black text-slate-700 mt-1">{missingCount}</p>
              </div>
              <div className="w-10 h-10 rounded-xl bg-slate-300 text-slate-700 flex items-center justify-center">
                <AlertCircle className="w-5 h-5" />
              </div>
            </div>
          </div>

          {/* Search & Filter Bar */}
          <div className="bg-white p-4 rounded-2xl border border-slate-200 shadow-xs flex flex-col sm:flex-row items-center justify-between gap-3">
            <div className="relative w-full sm:w-80">
              <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2 pointer-events-none" />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="মেনু বা ফিচারের নাম খুঁজুন..."
                className="w-full pl-9 pr-3 py-2 text-xs bg-slate-50 border border-slate-200 focus:bg-white focus:border-[#1C7D5A] rounded-xl focus:outline-none transition-all"
              />
              {searchQuery && (
                <button
                  onClick={() => setSearchQuery("")}
                  className="absolute right-2.5 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600"
                >
                  <X className="w-3.5 h-3.5" />
                </button>
              )}
            </div>

            {/* Status Pills */}
            <div className="flex flex-wrap items-center gap-1.5 w-full sm:w-auto">
              <span className="text-xs text-slate-400 font-bold mr-1">ফিল্টার:</span>
              {[
                { key: "all", label: "সকল মেনু" },
                { key: "published", label: "পাবলিশড" },
                { key: "draft", label: "ড্রাফট" },
                { key: "no_video", label: "ভিডিও নেই" }
              ].map((f) => (
                <button
                  key={f.key}
                  type="button"
                  onClick={() => setStatusFilter(f.key)}
                  className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-all cursor-pointer ${
                    statusFilter === f.key
                      ? "bg-[#1C7D5A] text-white shadow-xs"
                      : "bg-slate-100 hover:bg-slate-200 text-slate-600"
                  }`}
                >
                  {f.label}
                </button>
              ))}
            </div>
          </div>

          {/* Menus & Tutorial Videos Table */}
          <div className="bg-white rounded-2xl border border-slate-200 shadow-xs overflow-hidden">
            {loadingTutorials ? (
              <div className="p-12 text-center text-slate-400">
                <RefreshCw className="w-8 h-8 animate-spin mx-auto mb-2 text-[#1C7D5A]" />
                <p className="text-sm">ভিডিও তথ্য লোড হচ্ছে...</p>
              </div>
            ) : filteredMenuItems.length === 0 ? (
              <div className="p-12 text-center text-slate-400">
                <Film className="w-10 h-10 mx-auto mb-2 text-slate-300" />
                <p className="text-sm font-bold text-slate-600">কোনো মেনু পাওয়া যায়নি</p>
                <p className="text-xs text-slate-400 mt-1">অন্য কোনো কি-ওয়ার্ড দিয়ে অনুসন্ধান করুন</p>
              </div>
            ) : (
              <div className="overflow-x-auto">
                <table className="w-full text-left text-sm text-slate-600">
                  <thead className="bg-[#123628] border-b border-slate-200 text-gray-200 text-xs font-bold uppercase tracking-wider">
                    <tr>
                      <th className="py-3.5 px-4">প্রধান মেনু</th>
                      <th className="py-3.5 px-4">সাবমেনু / ফিচার</th>
                      <th className="py-3.5 px-4">টিউটোরিয়াল ভিডিও ও লিঙ্ক</th>
                      <th className="py-3.5 px-4">স্থিতি (পাবলিশ)</th>
                      <th className="py-3.5 px-4 text-right">অ্যাকশন</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100">
                    {filteredMenuItems.map((item, idx) => {
                      const ytThumb = computeThumbnail(item.currentVideoUrl);
                      return (
                        <tr key={idx} className="hover:bg-emerald-50/20 transition-colors">
                          {/* Main Menu */}
                          <td className="py-3 px-4 font-bold text-slate-800 whitespace-nowrap">
                            <span className="px-2.5 py-1 bg-slate-100 text-slate-700 rounded-md text-xs">
                              {item.mainMenu}
                            </span>
                          </td>

                          {/* Submenu */}
                          <td className="py-3 px-4">
                            <div>
                              <p className="font-bold text-slate-900">{item.subMenu}</p>
                              <span className="text-[10px] text-slate-400 font-mono">
                                {item.path}
                              </span>
                            </div>
                          </td>

                          {/* Video Thumbnail, Title & Duration */}
                          <td className="py-3 px-4">
                            {item.hasVideo ? (
                              <div className="flex items-center gap-3">
                                <div
                                  onClick={() =>
                                    setPreviewModalVideo({
                                      title: item.currentTitle,
                                      embedUrl: computeEmbedUrl(item.currentVideoUrl),
                                      description: item.currentDesc
                                    })
                                  }
                                  className="relative w-20 h-12 bg-slate-900 rounded-lg overflow-hidden shrink-0 border border-slate-200 shadow-xs cursor-pointer group"
                                  title="ভিডিও প্লে করুন"
                                >
                                  {ytThumb ? (
                                    <img
                                      src={ytThumb}
                                      alt="Thumbnail"
                                      className="w-full h-full object-cover group-hover:scale-105 transition-transform"
                                    />
                                  ) : (
                                    <Video className="w-5 h-5 text-white/70 mx-auto my-auto" />
                                  )}
                                  <div className="absolute inset-0 bg-black/30 group-hover:bg-black/10 transition-colors flex items-center justify-center">
                                    <Play className="w-4 h-4 text-white fill-white" />
                                  </div>
                                </div>
                                <div className="max-w-xs">
                                  <p className="text-xs font-bold text-slate-800 truncate" title={item.currentTitle}>
                                    {item.currentTitle}
                                  </p>
                                  <div className="flex items-center gap-1.5 mt-0.5">
                                    <span className="text-[10px] text-slate-400">
                                      {item.currentDuration}
                                    </span>
                                    <span className="text-slate-300">&bull;</span>
                                    <a
                                      href={item.currentVideoUrl}
                                      target="_blank"
                                      rel="noopener noreferrer"
                                      className="text-[10px] text-[#1C7D5A] hover:underline flex items-center gap-0.5"
                                    >
                                      <span>লিঙ্ক</span>
                                      <ExternalLink className="w-2.5 h-2.5" />
                                    </a>
                                  </div>
                                </div>
                              </div>
                            ) : (
                              <div className="flex items-center gap-2 text-slate-400 text-xs">
                                <AlertCircle className="w-4 h-4 text-amber-500" />
                                <span>ভিডিও যুক্ত করা হয়নি (ডিফল্ট চলছে)</span>
                              </div>
                            )}
                          </td>

                          {/* Publish Status Toggle */}
                          <td className="py-3 px-4">
                            {item.hasVideo ? (
                              <button
                                type="button"
                                onClick={() => handleTogglePublish(item)}
                                className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-bold transition-all cursor-pointer ${
                                  item.isPublished
                                    ? "bg-emerald-100 text-emerald-800 hover:bg-emerald-200"
                                    : "bg-amber-100 text-amber-800 hover:bg-amber-200"
                                }`}
                                title="ক্লিক করে স্ট্যাটাস পরিবর্তন করুন"
                              >
                                {item.isPublished ? (
                                  <>
                                    <Check className="w-3 h-3" />
                                    <span>পাবলিশড</span>
                                  </>
                                ) : (
                                  <>
                                    <Clock className="w-3 h-3" />
                                    <span>ড্রাফট</span>
                                  </>
                                )}
                              </button>
                            ) : (
                              <span className="text-[11px] text-slate-400 bg-slate-100 px-2 py-0.5 rounded-md font-medium">
                                ভিডিও নেই
                              </span>
                            )}
                          </td>

                          {/* Action Buttons */}
                          <td className="py-3 px-4 text-right whitespace-nowrap">
                            <div className="inline-flex items-center gap-1.5">
                              {/* Edit / Upload Video Button */}
                              <button
                                type="button"
                                onClick={() => handleOpenEditTutorial(item)}
                                className="p-1.5 bg-[#1C7D5A]/10 hover:bg-[#1C7D5A] text-[#1C7D5A] hover:text-white rounded-lg transition-all cursor-pointer"
                                title="ভিডিও লিঙ্ক আপলোড / পরিবর্তন করুন"
                              >
                                <Edit className="w-4 h-4" />
                              </button>

                              {/* Preview Video Button */}
                              {item.hasVideo && (
                                <button
                                  type="button"
                                  onClick={() =>
                                    setPreviewModalVideo({
                                      title: item.currentTitle,
                                      embedUrl: computeEmbedUrl(item.currentVideoUrl),
                                      description: item.currentDesc
                                    })
                                  }
                                  className="p-1.5 bg-slate-100 hover:bg-slate-200 text-slate-600 rounded-lg transition-all cursor-pointer"
                                  title="প্রিভিউ দেখুন"
                                >
                                  <Eye className="w-4 h-4" />
                                </button>
                              )}

                              {/* Delete Button */}
                              {item.serverDoc && (
                                <button
                                  type="button"
                                  onClick={() => handleDeleteTutorial(item)}
                                  className="p-1.5 bg-rose-50 hover:bg-rose-600 text-rose-600 hover:text-white rounded-lg transition-all cursor-pointer"
                                  title="ভিডিও মুছুন"
                                >
                                  <Trash2 className="w-4 h-4" />
                                </button>
                              )}
                            </div>
                          </td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              </div>
            )}
          </div>
        </div>
      )}

      {/* ============================================================== */}
      {/* TAB 2: LANDING PAGE INTRO VIDEO MANAGEMENT */}
      {/* ============================================================== */}
      {activeTab === "intro_video" && (
        <div className="space-y-6">
          <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-xs flex flex-col md:flex-row md:items-center justify-between gap-4">
            <div>
              <h2 className="text-lg font-bold text-slate-900">
                মূল পরিচিতি ভিডিও (ফ্রি ডেমো আবেদন পেজ)
              </h2>
              <p className="text-slate-500 text-xs sm:text-sm mt-0.5">
                এটি "/free-demo" পেজের উপরে প্রদর্শিত সিস্টেম পরিচিতি ভিডিও।
              </p>
            </div>

            <div className="flex items-center gap-2">
              <button
                type="button"
                onClick={() => {
                  setIntroForm({
                    videoUrl: introVideoData.videoUrl,
                    title: introVideoData.title,
                    description: introVideoData.description,
                    isActive: introVideoData.isActive
                  });
                  setIsIntroModalOpen(true);
                }}
                className="bg-[#1C7D5A] hover:bg-[#145a40] text-white px-4 py-2 rounded-xl text-xs sm:text-sm font-bold shadow-xs transition-all flex items-center gap-1.5"
              >
                <Edit className="w-4 h-4" />
                <span>ভিডিও পরিবর্তন করুন</span>
              </button>

              <Link
                to="/free-demo"
                target="_blank"
                rel="noopener noreferrer"
                className="bg-emerald-50 hover:bg-emerald-100 text-emerald-800 border border-emerald-200 px-3.5 py-2 rounded-xl text-xs sm:text-sm font-bold transition-all flex items-center gap-1.5"
              >
                <ExternalLink className="w-4 h-4" />
                <span>পেজ দেখুন</span>
              </Link>
            </div>
          </div>

          {/* Intro Video Display Card */}
          <div className="bg-white rounded-2xl border border-slate-200 p-6 shadow-xs grid grid-cols-1 md:grid-cols-2 gap-6 items-center">
            <div className="relative aspect-video bg-black rounded-xl overflow-hidden shadow-md">
              <iframe
                src={introVideoData.embedUrl}
                title={introVideoData.title}
                allowFullScreen
                className="w-full h-full border-0"
              />
            </div>
            <div className="space-y-3">
              <span className="text-xs bg-emerald-100 text-emerald-800 font-bold px-2.5 py-1 rounded-full">
                সক্রিয় ভিডিও
              </span>
              <h3 className="text-base sm:text-lg font-bold text-slate-900">
                {introVideoData.title}
              </h3>
              <p className="text-xs sm:text-sm text-slate-600 leading-relaxed">
                {introVideoData.description}
              </p>
              <div className="pt-2">
                <span className="text-xs text-slate-400 font-mono">
                  URL: {introVideoData.videoUrl}
                </span>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* ============================================================== */}
      {/* MODAL: EDIT / UPLOAD TUTORIAL VIDEO FOR SUBMENU */}
      {/* ============================================================== */}
      {isEditModalOpen && (
        <div className="fixed inset-0 bg-slate-900/60 z-50 flex items-center justify-center p-4 backdrop-blur-xs animate-fade-in">
          <div className="bg-white w-full max-w-xl rounded-2xl shadow-2xl border border-slate-200 overflow-hidden flex flex-col max-h-[90vh]">
            {/* Modal Header */}
            <div className="p-4 sm:p-5 border-b border-slate-100 flex items-center justify-between bg-slate-50">
              <div>
                <h3 className="text-base font-bold text-slate-900 flex items-center gap-2">
                  <Play className="w-4 h-4 text-[#1C7D5A]" />
                  <span>
                    {editingTarget ? "ভিডিও টিউটোরিয়াল এডিট ও কনফিগারেশন" : "নতুন ভিডিও টিউটোরিয়াল যুক্ত করুন"}
                  </span>
                </h3>
                <p className="text-xs text-slate-500 mt-0.5">
                  {editingTarget
                    ? `${editingTarget.mainMenu} > ${editingTarget.subMenu}`
                    : "যেকোনো মেনু বা ফিচারের জন্য নতুন ডেমো ভিডিও যুক্ত করুন"}
                </p>
              </div>
              <button
                type="button"
                onClick={() => setIsEditModalOpen(false)}
                className="p-1 text-slate-400 hover:text-slate-600 rounded-lg hover:bg-slate-200"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Modal Form */}
            <form onSubmit={handleSaveTutorial} className="p-5 overflow-y-auto space-y-4 text-xs sm:text-sm">
              {/* Menu and Submenu selection when adding a new tutorial */}
              {!editingTarget ? (
                <div className="space-y-3 p-3 bg-slate-50 rounded-xl border border-slate-200">
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    <div>
                      <label className="block font-bold text-slate-700 mb-1">মেনু / বিভাগ</label>
                      <select
                        value={tutorialForm.mainMenu}
                        onChange={(e) => setTutorialForm((prev) => ({ ...prev, mainMenu: e.target.value }))}
                        className="w-full p-2 bg-white border border-slate-300 rounded-xl text-xs font-semibold focus:outline-none focus:border-[#1C7D5A]"
                      >
                        {ADMIN_PANEL_MENUS.map((m) => (
                          <option key={m.mainMenu} value={m.mainMenu}>
                            {m.mainMenu}
                          </option>
                        ))}
                        <option value="অন্যান্য সেবা">অন্যান্য সেবা</option>
                      </select>
                    </div>
                    <div>
                      <label className="block font-bold text-slate-700 mb-1">
                        সাবমেনু / ফিচার নাম <span className="text-rose-500">*</span>
                      </label>
                      <input
                        type="text"
                        required
                        value={tutorialForm.subMenu}
                        onChange={(e) => setTutorialForm((prev) => ({ ...prev, subMenu: e.target.value }))}
                        placeholder="যেমন: ভর্তি ফর্ম বা অনলাইন ভর্তি"
                        className="w-full p-2 bg-white border border-slate-300 rounded-xl text-xs font-semibold focus:outline-none focus:border-[#1C7D5A]"
                      />
                    </div>
                  </div>
                </div>
              ) : (
                <div className="p-3 bg-emerald-50/70 border border-emerald-100 rounded-xl">
                  <span className="text-[10px] font-bold text-emerald-800 uppercase tracking-wider">মেনু ও পাথ:</span>
                  <p className="text-xs font-bold text-slate-800 mt-0.5">
                    {editingTarget.mainMenu} &gt; {editingTarget.subMenu}
                  </p>
                  <span className="text-[10px] text-slate-400 font-mono">{editingTarget.path}</span>
                </div>
              )}

              {/* Video URL Input */}
              <div>
                <label className="block font-bold text-slate-700 mb-1">
                  ভিডিও লিঙ্ক (YouTube / Vimeo / Embed URL) <span className="text-rose-500">*</span>
                </label>
                <input
                  type="text"
                  required
                  value={tutorialForm.videoUrl}
                  onChange={(e) =>
                    setTutorialForm((prev) => ({ ...prev, videoUrl: e.target.value }))
                  }
                  placeholder="যেমন: https://www.youtube.com/watch?v=..."
                  className="w-full p-2.5 bg-slate-50 border border-slate-300 rounded-xl focus:bg-white focus:border-[#1C7D5A] focus:outline-none transition-all text-xs"
                />
              </div>

              {/* Instant Live Preview inside modal */}
              {computeEmbedUrl(tutorialForm.videoUrl) && (
                <div className="relative aspect-video w-full bg-black rounded-xl overflow-hidden shadow-xs border border-slate-200">
                  <iframe
                    src={computeEmbedUrl(tutorialForm.videoUrl)}
                    title="Live Preview"
                    allowFullScreen
                    className="w-full h-full border-0"
                  />
                </div>
              )}

              {/* Video Title Input */}
              <div>
                <label className="block font-bold text-slate-700 mb-1">
                  ভিডিও টিউটোরিয়াল শিরোনাম
                </label>
                <input
                  type="text"
                  value={tutorialForm.title}
                  onChange={(e) =>
                    setTutorialForm((prev) => ({ ...prev, title: e.target.value }))
                  }
                  placeholder="ভিডিওর শিরোনাম দিন"
                  className="w-full p-2.5 bg-slate-50 border border-slate-300 rounded-xl focus:bg-white focus:border-[#1C7D5A] focus:outline-none transition-all text-xs"
                />
              </div>

              {/* Duration Input */}
              <div>
                <label className="block font-bold text-slate-700 mb-1">
                  ভিডিও সময়কাল (Duration)
                </label>
                <input
                  type="text"
                  value={tutorialForm.duration}
                  onChange={(e) =>
                    setTutorialForm((prev) => ({ ...prev, duration: e.target.value }))
                  }
                  placeholder="যেমন: ০৩:৪৫ মিনিট"
                  className="w-full p-2.5 bg-slate-50 border border-slate-300 rounded-xl focus:bg-white focus:border-[#1C7D5A] focus:outline-none transition-all text-xs"
                />
              </div>

              {/* Description Input */}
              <div>
                <label className="block font-bold text-slate-700 mb-1">
                  ফিচার পরিচিতি বা বিস্তারিত বিবরণ
                </label>
                <textarea
                  rows={3}
                  value={tutorialForm.description}
                  onChange={(e) =>
                    setTutorialForm((prev) => ({ ...prev, description: e.target.value }))
                  }
                  placeholder="ব্যবহারকারীদের জন্য নির্দেশনামূলক বিবরণ লিখুন..."
                  className="w-full p-2.5 bg-slate-50 border border-slate-300 rounded-xl focus:bg-white focus:border-[#1C7D5A] focus:outline-none transition-all text-xs"
                />
              </div>

              {/* Publish Toggle Checkbox */}
              <div className="pt-2 flex items-center gap-2">
                <input
                  type="checkbox"
                  id="publishCheckbox"
                  checked={tutorialForm.isPublished}
                  onChange={(e) =>
                    setTutorialForm((prev) => ({ ...prev, isPublished: e.target.checked }))
                  }
                  className="w-4 h-4 text-[#1C7D5A] rounded-sm focus:ring-[#1C7D5A] cursor-pointer"
                />
                <label htmlFor="publishCheckbox" className="font-bold text-slate-800 cursor-pointer text-xs">
                  সরাসরি ওয়েবসাইটে পাবলিশ করুন (প্রকাশিত রাখুন)
                </label>
              </div>

              {/* Action Buttons */}
              <div className="pt-3 border-t border-slate-100 flex items-center justify-end gap-2.5">
                <button
                  type="button"
                  onClick={() => setIsEditModalOpen(false)}
                  className="px-4 py-2 border border-slate-300 text-slate-700 rounded-xl font-bold hover:bg-slate-100 text-xs"
                >
                  বাতিল
                </button>
                <button
                  type="submit"
                  disabled={isSavingTutorial}
                  className="px-5 py-2 bg-[#1C7D5A] hover:bg-[#145a40] text-white rounded-xl font-bold shadow-xs hover:shadow-md transition-all flex items-center gap-1.5 text-xs cursor-pointer"
                >
                  {isSavingTutorial && <RefreshCw className="w-3.5 h-3.5 animate-spin" />}
                  <span>সংরক্ষণ করুন</span>
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* ============================================================== */}
      {/* MODAL: VIDEO PREVIEW MODAL */}
      {/* ============================================================== */}
      {previewModalVideo && (
        <div className="fixed inset-0 bg-black/80 z-50 flex items-center justify-center p-4 backdrop-blur-sm animate-fade-in">
          <div className="bg-slate-950 w-full max-w-3xl rounded-3xl overflow-hidden border border-slate-800 shadow-2xl flex flex-col">
            <div className="p-4 flex items-center justify-between border-b border-slate-800 text-white">
              <p className="text-sm font-bold truncate max-w-lg">{previewModalVideo.title}</p>
              <button
                onClick={() => setPreviewModalVideo(null)}
                className="p-1.5 text-slate-400 hover:text-white rounded-lg hover:bg-white/10"
              >
                <X className="w-5 h-5" />
              </button>
            </div>
            <div className="relative aspect-video w-full bg-black">
              <iframe
                src={previewModalVideo.embedUrl}
                title={previewModalVideo.title}
                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                allowFullScreen
                className="w-full h-full border-0"
              />
            </div>
            {previewModalVideo.description && (
              <div className="p-4 bg-slate-900 text-xs text-slate-300 leading-relaxed border-t border-slate-800">
                {previewModalVideo.description}
              </div>
            )}
          </div>
        </div>
      )}

      {/* ============================================================== */}
      {/* MODAL: EDIT INTRO VIDEO */}
      {/* ============================================================== */}
      {isIntroModalOpen && (
        <div className="fixed inset-0 bg-slate-900/60 z-50 flex items-center justify-center p-4 backdrop-blur-xs animate-fade-in">
          <div className="bg-white w-full max-w-lg rounded-2xl shadow-2xl border border-slate-200 overflow-hidden flex flex-col">
            <div className="p-4 sm:p-5 border-b border-slate-100 flex items-center justify-between bg-slate-50">
              <h3 className="text-base font-bold text-slate-900">
                পরিচিতি ভিডিও পরিবর্তন
              </h3>
              <button
                type="button"
                onClick={() => setIsIntroModalOpen(false)}
                className="p-1 text-slate-400 hover:text-slate-600 rounded-lg hover:bg-slate-200"
              >
                <X className="w-5 h-5" />
              </button>
            </div>
            <form onSubmit={handleSaveIntro} className="p-5 space-y-4 text-xs sm:text-sm">
              <div>
                <label className="block font-bold text-slate-700 mb-1">ভিডিও লিঙ্ক</label>
                <input
                  type="text"
                  required
                  value={introForm.videoUrl}
                  onChange={(e) => setIntroForm((p) => ({ ...p, videoUrl: e.target.value }))}
                  className="w-full p-2.5 bg-slate-50 border border-slate-300 rounded-xl focus:outline-none focus:border-[#1C7D5A] text-xs"
                />
              </div>
              <div>
                <label className="block font-bold text-slate-700 mb-1">ভিডিওর শিরোনাম</label>
                <input
                  type="text"
                  value={introForm.title}
                  onChange={(e) => setIntroForm((p) => ({ ...p, title: e.target.value }))}
                  className="w-full p-2.5 bg-slate-50 border border-slate-300 rounded-xl focus:outline-none focus:border-[#1C7D5A] text-xs"
                />
              </div>
              <div>
                <label className="block font-bold text-slate-700 mb-1">বিবরণ</label>
                <textarea
                  rows={3}
                  value={introForm.description}
                  onChange={(e) => setIntroForm((p) => ({ ...p, description: e.target.value }))}
                  className="w-full p-2.5 bg-slate-50 border border-slate-300 rounded-xl focus:outline-none focus:border-[#1C7D5A] text-xs"
                />
              </div>
              <div className="pt-3 border-t border-slate-100 flex items-center justify-end gap-2.5">
                <button
                  type="button"
                  onClick={() => setIsIntroModalOpen(false)}
                  className="px-4 py-2 border border-slate-300 text-slate-700 rounded-xl font-bold text-xs"
                >
                  বাতিল
                </button>
                <button
                  type="submit"
                  disabled={isSavingIntro}
                  className="px-5 py-2 bg-[#1C7D5A] text-white rounded-xl font-bold text-xs"
                >
                  {isSavingIntro ? "সংরক্ষণ হচ্ছে..." : "সংরক্ষণ করুন"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default DemoVideoSettings;
