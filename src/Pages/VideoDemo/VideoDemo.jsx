import React, { useState, useEffect, useMemo, useRef } from "react";
import { Link, useNavigate } from "react-router-dom";
import {
  LayoutDashboard,
  UserPlus,
  Users,
  UserCheck,
  Briefcase,
  CalendarCheck,
  BookOpen,
  GraduationCap,
  CreditCard,
  Award,
  Calculator,
  FileBarChart,
  LayoutTemplate,
  Library,
  CalendarDays,
  MessageSquare,
  Package,
  Settings,
  ShieldAlert,
  Contact,
  School,
  FileText,
  Wallet,
  Receipt,
  Banknote,
  TrendingDown,
  TrendingUp,
  FilePieChart,
  DollarSign,
  HeartHandshake,
  Smartphone,
  ClipboardList,
  Globe,
  User,
  LayoutGrid,
  Clock,
  Building2,
  Calendar,
  CalendarPlus,
  Edit,
  Table,
  Printer,
  FileCheck,
  List,
  Shapes,
  BookMarked,
  ChevronDown,
  ChevronRight,
  Menu,
  X,
  Play,
  PlayCircle,
  Video,
  Sparkles,
  Search,
  ExternalLink,
  ArrowRight,
  ArrowLeft,
  Moon,
  Sun,
  Maximize,
  Minimize,
  Bell,
  Home,
  CheckCircle2,
  Info,
  HelpCircle,
  Share2,
  Flame,
  Languages,
  PhoneCall,
  Phone
} from "lucide-react";
import adminService from "../../services/adminService";
import { useTranslation } from "react-i18next";
import { useTheme } from "../../context/ThemeContext";

const WhatsAppIcon = ({ className = "w-5 h-5" }) => (
  <svg className={`fill-current ${className}`} viewBox="0 0 24 24">
    <path d="M.057 24l1.687-6.163c-1.041-1.804-1.588-3.849-1.587-5.946.003-6.556 5.338-11.891 11.893-11.891 3.181.001 6.167 1.24 8.413 3.488 2.245 2.248 3.481 5.236 3.48 8.414-.003 6.557-5.338 11.892-11.893 11.892-1.99-.001-3.951-.5-5.688-1.448l-6.305 1.654zm6.597-3.807c1.676.995 3.276 1.591 5.392 1.592 5.448 0 9.886-4.434 9.889-9.885.002-5.462-4.415-9.89-9.881-9.892-5.452 0-9.887 4.434-9.889 9.884-.001 2.225.651 3.891 1.746 5.634l-.999 3.648 3.742-.981zm11.387-5.464c-.074-.124-.272-.198-.57-.347-.297-.149-1.758-.868-2.031-.967-.272-.099-.47-.149-.669.149-.198.297-.768.967-.941 1.165-.173.198-.347.223-.644.074-.297-.149-1.255-.462-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.297-.347.446-.521.151-.172.2-.296.3-.495.099-.198.05-.372-.025-.521-.075-.148-.669-1.611-.916-2.206-.242-.579-.487-.501-.669-.51l-.57-.01c-.198 0-.52.074-.792.372s-1.04 1.016-1.04 2.479 1.065 2.876 1.213 3.074c.149.198 2.095 3.2 5.076 4.487.709.306 1.263.489 1.694.626.712.226 1.36.194 1.872.118.571-.085 1.758-.719 2.006-1.413.248-.695.248-1.29.173-1.414z" />
  </svg>
);

// Helper: Extract YouTube 11-char Video ID
const getYouTubeId = (url) => {
  if (!url || typeof url !== "string") return null;
  const match = url.trim().match(
    /(?:youtu\.be\/|youtube\.com\/(?:embed\/|v\/|watch\?v=|watch\?.+&v=|shorts\/))([\w-]{11})/
  );
  return match ? match[1] : null;
};

// Helper: Compute iframe embed URL
const computeEmbedUrl = (url) => {
  if (!url || typeof url !== "string") return "";
  const trimmed = url.trim();
  if (trimmed.includes("/embed/")) {
    return trimmed;
  }
  const ytId = getYouTubeId(trimmed);
  if (ytId) {
    return `https://www.youtube-nocookie.com/embed/${ytId}?autoplay=1&rel=0&modestbranding=1`;
  }
  const vimeoMatch = trimmed.match(/vimeo\.com\/(?:video\/)?([0-9]+)/);
  if (vimeoMatch && vimeoMatch[1]) {
    return `https://player.vimeo.com/video/${vimeoMatch[1]}?autoplay=1`;
  }
  return trimmed;
};

// Admin Menu Hierarchy Definition (matches adminNavigation.jsx with full Bengali labels & metadata)
const ADMIN_MENU_SECTIONS = [
  {
    title: "মূল",
    titleEn: "Main",
    links: [
      {
        id: "dashboard",
        name: "ড্যাশবোর্ড",
        nameEn: "Dashboard",
        path: "/admin",
        icon: LayoutDashboard,
        defaultVideo: {
          title: "মাদ্রাসার মূল ড্যাশবোর্ড পরিচিতি ও গুরুত্বপূর্ণ ডাটা অ্যানালিটিক্স",
          description: "এই ভিডিওতে মাদ্রাসার দৈনিক উপস্থিতি, বকেয়া ও আদায়কৃত ফি, মোট শিক্ষার্থী, শিক্ষক-কর্মচারী এবং সার্বিক অ্যাকাডেমিক পরিসংখ্যানের সারসংক্ষেপ কীভাবে ড্যাশবোর্ডে পর্যবেক্ষণ করবেন তা বিস্তারিত তুলে ধরা হয়েছে।",
          videoUrl: "https://youtu.be/YSoh7gUbNEg?si=LZAVn6EVDehvzeCj",
          duration: "০২:১৫ মিনিট"
        }
      }
    ]
  },
  {
    title: "প্রশাসনিক",
    titleEn: "Academic & Administrative",
    links: [
      {
        id: "admission",
        name: "ভর্তি",
        nameEn: "Admission",
        icon: UserPlus,
        children: [
          {
            id: "student-list",
            name: "ছাত্র-ছাত্রী তালিকা",
            nameEn: "Student List",
            path: "/admin/student/list",
            icon: Users,
            defaultVideo: {
              title: "ছাত্র-ছাত্রী তালিকা দেখা, ফিল্টারিং ও শিক্ষার্থী প্রোফাইল অনুসন্ধান",
              description: "ক্লাস, সেকশন ও রোল অনুযায়ী ছাত্র-ছাত্রীদের তালিকা ফিল্টার করা, শিক্ষার্থীর ব্যক্তিগত তথ্য দেখা, এডিট করা ও ডাটা এক্সপোর্ট করার পূর্ণাঙ্গ নিয়মাবলী।",
              videoUrl: "https://www.youtube.com/watch?v=ScMzIvxBSi4",
              duration: "০৩:১০ মিনিট"
            }
          },
          {
            id: "admission-create",
            name: "ভর্তি ফর্ম",
            nameEn: "Create Admission",
            path: "/admin/admission/create",
            icon: UserPlus,
            defaultVideo: {
              title: "ভর্তি ফর্ম পূরণ ও নতুন শিক্ষার্থী নিবন্ধন পদ্ধতি",
              description: "নতুন শিক্ষার্থীর ব্যক্তিগত তথ্য, অভিভাবকের তথ্য, শিক্ষাবর্ষ, ক্লাস, সেকশন নির্বাচন করে দ্রুত ভর্তি নিশ্চিতকরণ এবং স্বয়ংক্রিয় স্টুডেন্ট আইডি ও রোল নম্বর তৈরির পদ্ধতি।",
              videoUrl: "https://www.youtube.com/watch?v=ScMzIvxBSi4",
              duration: "০৪:২৫ মিনিট"
            }
          },
          {
            id: "admission-online",
            name: "অনলাইন ভর্তি",
            nameEn: "Online Admission",
            path: "/admin/admissions/online",
            icon: Globe,
            defaultVideo: {
              title: "অনলাইন ভর্তি আবেদন পর্যালোচনা, যাচাই ও অনুমোদন",
              description: "ওয়েবসাইট থেকে আসা অভিভাবকদের অনলাইন ভর্তি আবেদনপত্রসমূহ যাচাই-বাছাই করে এক ক্লিকে স্থায়ী ভর্তি তালিকায় অন্তর্ভুক্ত করার নিয়মাবলী।",
              videoUrl: "https://www.youtube.com/watch?v=ScMzIvxBSi4",
              duration: "০২:৪০ মিনিট"
            }
          },
          {
            id: "admission-report",
            name: "ভর্তি রিপোর্ট",
            nameEn: "Admission Report",
            path: "/admin/admission/report",
            icon: FileText,
            defaultVideo: {
              title: "ভর্তি সংক্রান্ত রিপোর্ট ও বিশ্লেষণ",
              description: "মাসভিত্তিক বা সেশনভিত্তিক মোট ভর্তির সংখ্যা, বিভাগ অনুযায়ী পরিসংখ্যান এবং ভর্তি সংক্রান্ত বিস্তারিত প্রতিবেদন প্রিন্ট ও ডাউনলোড করার উপায়।",
              videoUrl: "https://www.youtube.com/watch?v=ScMzIvxBSi4",
              duration: "০২:১৫ মিনিট"
            }
          }
        ]
      },
      {
        id: "parents",
        name: "অভিভাবক",
        nameEn: "Parents",
        icon: Contact,
        children: [
          {
            id: "parent-list",
            name: "অভিভাবক তালিকা",
            nameEn: "Parent List",
            path: "/admin/parents/list",
            icon: Users,
            defaultVideo: {
              title: "অভিভাবকদের তালিকা ও যোগাযোগ তথ্য",
              description: "মাদ্রাসার সকল শিক্ষার্থীর পিতা-মাতা বা অভিভাবকের নাম, মোবাইল নম্বর, পেশা এবং তাদের সাথে দ্রুত যোগাযোগের গাইড।",
              videoUrl: "https://www.youtube.com/watch?v=ScMzIvxBSi4",
              duration: "০২:০৫ মিনিট"
            }
          }
        ]
      },
      {
        id: "employee",
        name: "স্টাফ / শিক্ষক",
        nameEn: "Employee",
        icon: Briefcase,
        children: [
          {
            id: "employee-list",
            name: "স্টাফ তালিকা",
            nameEn: "Employee List",
            path: "/admin/employee/list",
            icon: Users,
            defaultVideo: {
              title: "মাদ্রাসার সকল শিক্ষক ও কর্মকর্তা-কর্মচারীর তালিকা",
              description: "সকল শিক্ষকের পদবী, বিভাগ, ফোন নম্বর, জয়েনিং তারিখ ও প্রোফাইল ডাটা সহজে অনুসন্ধান এবং ম্যানেজমেন্ট।",
              videoUrl: "https://www.youtube.com/watch?v=ScMzIvxBSi4",
              duration: "০২:৫০ মিনিট"
            }
          },
          {
            id: "employee-create",
            name: "নতুন স্টাফ যোগ করুন",
            nameEn: "Add New Employee",
            path: "/admin/employee/create",
            icon: UserPlus,
            defaultVideo: {
              title: "নতুন শিক্ষক বা স্টাফ যোগ করার নিয়ম",
              description: "নতুন কোনো শিক্ষক বা কর্মচারী নিয়োগের সময় তার যাবতীয় তথ্য, শিক্ষাগত যোগ্যতা ও অ্যাকাউন্ট তৈরি করার পদ্ধতি।",
              videoUrl: "https://www.youtube.com/watch?v=ScMzIvxBSi4",
              duration: "০৩:১৫ মিনিট"
            }
          },
          {
            id: "employee-designation",
            name: "পদবী যোগ করুন",
            nameEn: "Add Designation",
            path: "/admin/employee/designation",
            icon: Award,
            defaultVideo: {
              title: "পদবী ও বিভাগ কনফিগারেশন",
              description: "মুহতামিম, নাযেমে তালিমাত, সিনিয়র শিক্ষক, সহকারী শিক্ষক ইত্যাদি পদবী তৈরি ও পরিচালনা।",
              videoUrl: "https://www.youtube.com/watch?v=ScMzIvxBSi4",
              duration: "০১:৪৫ মিনিট"
            }
          },
          {
            id: "employee-salary-setup",
            name: "বেতন সেটআপ",
            nameEn: "Salary Setup",
            path: "/admin/employee/salary-setup",
            icon: DollarSign,
            defaultVideo: {
              title: "শিক্ষক ও কর্মকর্তা-কর্মচারীদের মাসিক বেতন নির্ধারণ",
              description: "মূল বেতন, বাড়িভাড়া, চিকিৎসা ভাতা ও কর্তনসহ স্বয়ংক্রিয় মাসিক বেতন স্কেল নির্ধারণ করার পদ্ধতি।",
              videoUrl: "https://www.youtube.com/watch?v=ScMzIvxBSi4",
              duration: "০৩:৩০ মিনিট"
            }
          }
        ]
      },
      {
        id: "attendance",
        name: "উপস্থিতি",
        nameEn: "Attendance",
        icon: CalendarCheck,
        children: [
          {
            id: "attendance-student",
            name: "ছাত্র উপস্থিতি",
            nameEn: "Student Attendance",
            path: "/admin/attendance/student",
            icon: User,
            defaultVideo: {
              title: "দৈনিক ছাত্র হাজিরা গ্রহণ ও অনুপস্থিতি এসএমএস",
              description: "ক্লাস ও সেকশন ধরে এক ক্লিকে ছাত্র-ছাত্রীদের দৈনিক উপস্থিতি গ্রহণ এবং অনুপস্থিত হলে তাৎক্ষণিক স্বয়ংক্রিয় এসএমএস প্রেরণের নিয়ম।",
              videoUrl: "https://www.youtube.com/watch?v=ScMzIvxBSi4",
              duration: "০৩:২০ মিনিট"
            }
          },
          {
            id: "attendance-employee",
            name: "স্টাফ উপস্থিতি",
            nameEn: "Employee Attendance",
            path: "/admin/attendance/employee",
            icon: Briefcase,
            defaultVideo: {
              title: "শিক্ষক ও কর্মচারীদের দৈনিক উপস্থিতি গ্রহণ",
              description: "হাতে বা বায়োমেট্রিক/ডিভাইসের মাধ্যমে শিক্ষক ও স্টাফদের আগমন ও প্রস্থান সময়সহ হাজিরা রেকর্ড করার উপায়।",
              videoUrl: "https://www.youtube.com/watch?v=ScMzIvxBSi4",
              duration: "০২:১০ মিনিট"
            }
          },
          {
            id: "attendance-report-student",
            name: "ছাত্র উপস্থিতি রিপোর্ট",
            nameEn: "Student Attendance Report",
            path: "/admin/attendance/report/student",
            icon: FilePieChart,
            defaultVideo: {
              title: "মাসিক ও বাৎসরিক ছাত্র হাজিরা প্রতিবেদন",
              description: "কোন ছাত্র কতদিন উপস্থিত ছিল, শতকরা হার এবং ক্লাস ভিত্তিক হাজিরা সামারি প্রিন্ট করার পদ্ধতি।",
              videoUrl: "https://www.youtube.com/watch?v=ScMzIvxBSi4",
              duration: "০২:১৫ মিনিট"
            }
          }
        ]
      },
      {
        id: "academic",
        name: "একাডেমিক",
        nameEn: "Academic",
        icon: School,
        children: [
          {
            id: "academic-class",
            name: "ক্লাস তালিকা",
            nameEn: "Class List",
            path: "/admin/academic/class",
            icon: LayoutGrid,
            defaultVideo: {
              title: "মাদ্রাসার জামাত / ক্লাস ব্যবস্থাপনা",
              description: "নূরানী, নাজেরা, হেফজ, কিতাব বিভাগসহ যেকোনো জামাত বা শ্রেণি তৈরি ও পরিচালনা।",
              videoUrl: "https://www.youtube.com/watch?v=ScMzIvxBSi4",
              duration: "০২:০০ মিনিট"
            }
          },
          {
            id: "academic-section",
            name: "সেকশন তালিকা",
            nameEn: "Section List",
            path: "/admin/academic/section",
            icon: Shapes,
            defaultVideo: {
              title: "শাখা বা সেকশন তৈরি ও বিন্যাস",
              description: "ক, খ, গ শাখা বা ছাত্র/ছাত্রী আলাদা সেকশন তৈরি এবং ক্লাস অনুযায়ী বণ্টন।",
              videoUrl: "https://www.youtube.com/watch?v=ScMzIvxBSi4",
              duration: "০১:৫০ মিনিট"
            }
          },
          {
            id: "academic-schedule-class",
            name: "ক্লাস রুটিন",
            nameEn: "Class Schedule",
            path: "/admin/academic/schedule/class",
            icon: Clock,
            defaultVideo: {
              title: "ক্লাস ভিত্তিক সময়সূচী বা সাপ্তাহিক রুটিন তৈরি",
              description: "প্রতিটি ক্লাসের বিষয় ও পিরিয়ড অনুযায়ী স্বয়ংক্রিয় ও সুবিন্যস্ত রুটিন তৈরি ও প্রিন্ট।",
              videoUrl: "https://www.youtube.com/watch?v=ScMzIvxBSi4",
              duration: "০৩:৪০ মিনিট"
            }
          },
          {
            id: "academic-syllabus",
            name: "ক্লাস সিলেবাস",
            nameEn: "Class Syllabus",
            path: "/admin/academic/syllabus",
            icon: ClipboardList,
            defaultVideo: {
              title: "ক্লাস ও পরীক্ষার সিলেবাস আপলোড ও সংরক্ষণ",
              description: "টার্মভিত্তিক পড়া ও কিতাবের পাঠ্যসূচি পিডিএফ বা ডক আকারে সংরক্ষণ ও প্রকাশ।",
              videoUrl: "https://www.youtube.com/watch?v=ScMzIvxBSi4",
              duration: "০২:১০ মিনিট"
            }
          }
        ]
      },
      {
        id: "homework",
        name: "হোমওয়ার্ক",
        nameEn: "Homework",
        icon: BookOpen,
        children: [
          {
            id: "homework-list",
            name: "হোমওয়ার্ক প্রদান ও তালিকা",
            nameEn: "Home Work",
            path: "/admin/homework/list",
            icon: BookOpen,
            defaultVideo: {
              title: "শিক্ষার্থীদের দৈনিক সবক ও বাড়ির কাজ প্রদান",
              description: "বিষয় ও অধ্যায়ভিত্তিক হোমওয়ার্ক এন্ট্রি এবং অভিভাবকদের পোর্টালে সরাসরি পৌঁছে দেওয়া।",
              videoUrl: "https://www.youtube.com/watch?v=ScMzIvxBSi4",
              duration: "০২:২০ মিনিট"
            }
          }
        ]
      },
      {
        id: "examination",
        name: "পরীক্ষা",
        nameEn: "Examination",
        icon: GraduationCap,
        children: [
          {
            id: "exam-term",
            name: "পরীক্ষার নাম ও টার্ম",
            nameEn: "Exam Name",
            path: "/admin/exam/term",
            icon: FileText,
            defaultVideo: {
              title: "১ম সাময়িক, অর্ধ-বার্ষিক ও বার্ষিক পরীক্ষার টার্ম সেটআপ",
              description: "পরীক্ষার সেশন, নাম ও পরীক্ষার শর্তাবলী নির্ধারণ করার নিয়ম।",
              videoUrl: "https://www.youtube.com/watch?v=ScMzIvxBSi4",
              duration: "০১:৫৫ মিনিট"
            }
          },
          {
            id: "exam-schedule",
            name: "পরীক্ষার সময়সূচি",
            nameEn: "Exam Schedule",
            path: "/admin/exam/schedule",
            icon: CalendarDays,
            defaultVideo: {
              title: "পরীক্ষার তারিখ, সময় ও হল সিট সংক্রান্ত রুটিন তৈরি",
              description: "বিষয়ভিত্তিক পরীক্ষার রুটিন ও পরীক্ষার হল সিট প্ল্যানিং করার পদ্ধতি।",
              videoUrl: "https://www.youtube.com/watch?v=ScMzIvxBSi4",
              duration: "০৩:০০ মিনিট"
            }
          },
          {
            id: "exam-marks-entry",
            name: "নম্বর এন্ট্রি",
            nameEn: "Mark Entries",
            path: "/admin/exam/marks/entry",
            icon: Edit,
            defaultVideo: {
              title: "মৌখিক ও লিখিত পরীক্ষার নম্বর এন্ট্রি পদ্ধতি",
              description: "সহজে ও দ্রুত প্রতিটি বিষয়ের নম্বর ইনপুট করা এবং সর্বোচ্চ ও সর্বনিম্ন নম্বরের স্বয়ংক্রিয় হিসাব।",
              videoUrl: "https://www.youtube.com/watch?v=ScMzIvxBSi4",
              duration: "০৩:৫০ মিনিট"
            }
          },
          {
            id: "exam-tabulation",
            name: "ট্যাবুলেশন শিট ও ফলাফল",
            nameEn: "Tabulation Sheet",
            path: "/admin/exam/tabulation",
            icon: Table,
            defaultVideo: {
              title: "স্বয়ংক্রিয় রেজাল্ট কার্ড, মেধা তালিকা ও ট্যাবুলেশন শিট তৈরি",
              description: "এক ক্লিকে আকর্ষণীয় মার্কশিট, গ্রেড পয়েন্ট ও মেধা স্থানসহ রেজাল্ট প্রকাশ ও প্রিন্ট করার পদ্ধতি।",
              videoUrl: "https://www.youtube.com/watch?v=ScMzIvxBSi4",
              duration: "০৪:১০ মিনিট"
            }
          }
        ]
      }
    ]
  },
  {
    title: "অন্যান্য",
    titleEn: "Management & Others",
    links: [
      {
        id: "office-accounting",
        name: "অফিস হিসাবরক্ষণ",
        nameEn: "Office Accounting",
        icon: Calculator,
        children: [
          {
            id: "fees-collect",
            name: "ফি গ্রহণ",
            nameEn: "Collect Fees",
            path: "/admin/accounting/fees/collect",
            icon: DollarSign,
            defaultVideo: {
              title: "ছাত্র-ছাত্রীদের থেকে ফি আদায় ও স্বয়ংক্রিয় রসিদ প্রিন্ট",
              description: "বকেয়া ফি চেক করা, আংশিক বা পূর্ণ বেতন গ্রহণ, ডিসকাউন্ট যুক্ত করা এবং প্রিন্টেবল মানি রিসিট তৈরির নিয়ম।",
              videoUrl: "https://www.youtube.com/watch?v=ScMzIvxBSi4",
              duration: "০৪:১৫ মিনিট"
            }
          },
          {
            id: "fees-type",
            name: "ফি এর ধরন",
            nameEn: "Fee Type",
            path: "/admin/accounting/fees/type",
            icon: Settings,
            defaultVideo: {
              title: "ভর্তি ফি, মাসিক বেতন, পরীক্ষা ফিসহ বিভিন্ন ফি ক্যাটাগরি তৈরি",
              description: "প্রতিটি ক্লাসের জন্য আলাদা আলাদা ফি কাঠামো নির্ধারণ করার উপায়।",
              videoUrl: "https://www.youtube.com/watch?v=ScMzIvxBSi4",
              duration: "০২:২০ মিনিট"
            }
          },
          {
            id: "payroll-monthly",
            name: "মাসিক পেরোল ও বেতন বিতরণ",
            nameEn: "Monthly Payroll",
            path: "/admin/accounting/payroll/monthly",
            icon: Calculator,
            defaultVideo: {
              title: "সকল শিক্ষকের মাসিক বেতন বিতরণ ও পে-স্লিপ প্রিন্ট",
              description: "উপস্থিতি অনুযায়ী বোনাস ও কর্তনসহ এক ক্লিকে সকলের বেতন শিট ও পে-স্লিপ প্রিন্ট করার নিয়ম।",
              videoUrl: "https://www.youtube.com/watch?v=ScMzIvxBSi4",
              duration: "০৩:৪৫ মিনিট"
            }
          },
          {
            id: "donation-receive",
            name: "দান ও অনুদান গ্রহণ",
            nameEn: "Receive Donation",
            path: "/admin/accounting/donation/create",
            icon: HeartHandshake,
            defaultVideo: {
              title: "সাধারণ দান, যাকাত, ফিতরা ও আজীবন দাতার অনুদান গ্রহণ",
              description: "দাতাদের নাম, ঠিকানা ও অনুদানের খাত সংরক্ষণ এবং তাৎক্ষণিক অনুদান রসিদ প্রদান।",
              videoUrl: "https://www.youtube.com/watch?v=ScMzIvxBSi4",
              duration: "০২:৫০ মিনিট"
            }
          },
          {
            id: "expense-add",
            name: "ব্যয় ভাউচার এন্ট্রি",
            nameEn: "Add Expense",
            path: "/admin/accounting/expense/create",
            icon: CreditCard,
            defaultVideo: {
              title: "দৈনিক ও মাসিক যাবতীয় খরচের ভাউচার এন্ট্রি",
              description: "বাজার খরচ, বিদ্যুৎ বিল, আপ্যায়ন, ভবন রক্ষণাবেক্ষণ ইত্যাদি খাতের খরচের হিসাব সংরক্ষণ।",
              videoUrl: "https://www.youtube.com/watch?v=ScMzIvxBSi4",
              duration: "০২:২৫ মিনিট"
            }
          },
          {
            id: "report-income-expense",
            name: "আয় ও ব্যয় রিপোর্ট",
            nameEn: "Income & Expense Report",
            path: "/admin/accounting/report/income-expense",
            icon: FileText,
            defaultVideo: {
              title: "সার্বিক ক্যাশ বুক ও আয়-ব্যয়ের লাভ-লোকসান ব্যালেন্স শিট",
              description: "যেকোনো নির্দিষ্ট তারিখ অনুযায়ী মোট আয়, মোট ব্যয় ও চূড়ান্ত ব্যাংকিং ব্যালেন্স হিসাব বের করার গাইড।",
              videoUrl: "https://www.youtube.com/watch?v=ScMzIvxBSi4",
              duration: "০৩:১৫ মিনিট"
            }
          }
        ]
      },
      {
        id: "card-management",
        name: "কার্ড ব্যবস্থাপনা",
        nameEn: "Card Management",
        icon: CreditCard,
        children: [
          {
            id: "card-student",
            name: "শিক্ষার্থী আইডি কার্ড",
            nameEn: "Student ID Card",
            path: "/admin/card/student",
            icon: Contact,
            defaultVideo: {
              title: "কিউআর কোডসহ ডিজিটাল শিক্ষার্থী আইডি কার্ড তৈরি ও প্রিন্ট",
              description: "ছবি, বারকোড/কিউআর কোড এবং মাদ্রাসার লোগো সংবলিত প্রফেশনাল আইডি কার্ড তৈরি।",
              videoUrl: "https://www.youtube.com/watch?v=ScMzIvxBSi4",
              duration: "০৩:০০ মিনিট"
            }
          },
          {
            id: "card-admit-generate",
            name: "এডমিট কার্ড তৈরি",
            nameEn: "Generate Admit Card",
            path: "/admin/card/admit-generate",
            icon: Printer,
            defaultVideo: {
              title: "পরীক্ষার প্রবেশপত্র বা এডমিট কার্ড এক ক্লিকে তৈরি",
              description: "পরীক্ষার্থীদের ফি পরিশোধ যাচাই সাপেক্ষে পরীক্ষার প্রবেশপত্র প্রিন্ট করার সুবিধা।",
              videoUrl: "https://www.youtube.com/watch?v=ScMzIvxBSi4",
              duration: "০২:৪০ মিনিট"
            }
          }
        ]
      },
      {
        id: "certificate-management",
        name: "সনদপত্র ব্যবস্থাপনা",
        nameEn: "Certificate Management",
        icon: Award,
        children: [
          {
            id: "certificate-student",
            name: "শিক্ষার্থী সনদ তৈরি",
            nameEn: "Generate Student",
            path: "/admin/certificate/student",
            icon: Users,
            defaultVideo: {
              title: "প্রশংসাপত্র, প্রত্যয়নপত্র ও ক্যারেক্টার সার্টিফিকেট তৈরি",
              description: "মাদ্রাসার অফিসিয়াল সিল ও প্যাডসহ শিক্ষার্থীর প্রশংসাপত্র বা ছাড়পত্র প্রস্তুত করার উপায়।",
              videoUrl: "https://www.youtube.com/watch?v=ScMzIvxBSi4",
              duration: "০২:৫০ মিনিট"
            }
          }
        ]
      },
      {
        id: "sms-portal",
        name: "বার্তা / এসএমএস পোর্টাল",
        nameEn: "Message",
        path: "/admin/sms-portal",
        icon: MessageSquare,
        defaultVideo: {
          title: "বাল্ক বাংলা এসএমএস ও নোটিফিকেশন প্রেরণ পদ্ধতি",
          description: "সকল অভিভাবক বা নির্দিষ্ট ক্লাসে এক ক্লিকে ছুটির নোটিশ, জরুরি বিজ্ঞপ্তি বা শুভেচ্ছা বার্তা পাঠানোর নিয়ম।",
          videoUrl: "https://www.youtube.com/watch?v=ScMzIvxBSi4",
          duration: "০২:৪৫ মিনিট"
        }
      },
      {
        id: "library",
        name: "স্মার্ট লাইব্রেরি",
        nameEn: "Library",
        path: "/admin/library",
        icon: Library,
        defaultVideo: {
          title: "মাদ্রাসার কিতাব ও বই ইস্যু-ফেরত ব্যবস্থাপনা",
          description: "লাইব্রেরির কিতাবের তালিকা সংরক্ষণ, ছাত্র ও শিক্ষকদের কিতাব ইস্যু ও ফেরত নেওয়ার রেকর্ড রাখা।",
          videoUrl: "https://www.youtube.com/watch?v=ScMzIvxBSi4",
          duration: "০৩:১০ মিনিট"
        }
      },
      {
        id: "frontend-manager",
        name: "ফ্রন্টএন্ড ম্যানেজার",
        nameEn: "Frontend",
        path: "/admin/frontend",
        icon: LayoutTemplate,
        defaultVideo: {
          title: "মাদ্রাসার পাবলিক ওয়েবসাইট ও নোটিশ বোর্ড নিয়ন্ত্রণ",
          description: "মাদ্রাসার ছবি, ব্যানার, নোটিশ, শিক্ষকদের তথ্য ও স্লাইডার সহজে ওয়েবসাইট পেজে আপডেট করা।",
          videoUrl: "https://www.youtube.com/watch?v=ScMzIvxBSi4",
          duration: "০৩:৩০ মিনিট"
        }
      },
      {
        id: "settings",
        name: "সিস্টেম সেটিংস",
        nameEn: "Settings",
        path: "/admin/settings",
        icon: Settings,
        defaultVideo: {
          title: "মাদ্রাসার নাম, লোগো ও সার্বিক কনফিগারেশন সেটিংস",
          description: "মাদ্রাসার তথ্য আপডেট, সেশন পরিবর্তন ও ব্যাকআপ নেওয়ার সাধারণ সেটিংস গাইড।",
          videoUrl: "https://www.youtube.com/watch?v=ScMzIvxBSi4",
          duration: "০২:৩০ মিনিট"
        }
      }
    ]
  }
];

// Flatten all playable items into a list for easy Next / Previous and search indexing
const getAllPlayableItems = () => {
  const items = [];
  ADMIN_MENU_SECTIONS.forEach((section) => {
    section.links.forEach((mainLink) => {
      if (mainLink.children && mainLink.children.length > 0) {
        mainLink.children.forEach((subLink) => {
          items.push({
            ...subLink,
            sectionTitle: section.title,
            mainMenuName: mainLink.name,
            mainMenuId: mainLink.id,
            mainMenuIcon: mainLink.icon
          });
        });
      } else {
        items.push({
          ...mainLink,
          sectionTitle: section.title,
          mainMenuName: mainLink.name,
          mainMenuId: mainLink.id,
          mainMenuIcon: mainLink.icon
        });
      }
    });
  });
  return items;
};

const ALL_PLAYABLE_ITEMS = getAllPlayableItems();

const VideoDemo = () => {
  const navigate = useNavigate();
  const { theme, toggleTheme } = useTheme();
  const { t, i18n } = useTranslation();
  const activeItemRef = useRef(null);

  // Selected item state: defaults to Dashboard (first item in serial order)
  const [selectedItem, setSelectedItem] = useState(() => {
    return ALL_PLAYABLE_ITEMS[0] || null;
  });

  // Open accordion main menus (initially empty or matching the first item)
  const [openMenus, setOpenMenus] = useState(() => {
    const first = ALL_PLAYABLE_ITEMS[0];
    if (first?.mainMenuId && first.mainMenuId !== first.id) {
      return { [first.mainMenuId]: true };
    }
    return {};
  });

  // Mobile sidebar drawer state
  const [isMobileSidebarOpen, setIsMobileSidebarOpen] = useState(false);

  // Search query
  const [searchQuery, setSearchQuery] = useState("");

  // Fullscreen state
  const [isFullScreen, setIsFullScreen] = useState(false);

  // Server uploaded tutorial videos map { pathOrMenuKey: videoDoc }
  const [serverVideosMap, setServerVideosMap] = useState({});
  const [loadingVideos, setLoadingVideos] = useState(false);

  // Smoothly scroll sidebar to keep the active menu item in view
  useEffect(() => {
    if (activeItemRef.current) {
      activeItemRef.current.scrollIntoView({
        behavior: "smooth",
        block: "nearest"
      });
    }
  }, [selectedItem?.id]);

  // Fetch tutorial videos from backend
  useEffect(() => {
    const loadTutorialVideos = async () => {
      try {
        setLoadingVideos(true);
        const res = await adminService.getPublicTutorialVideos({ panelKey: "admin" });
        if (res?.success && Array.isArray(res?.data)) {
          const map = {};
          res.data.forEach((vid) => {
            if (vid.path) map[vid.path] = vid;
            if (vid.menuKey) map[vid.menuKey] = vid;
            if (vid.subMenu) map[vid.subMenu] = vid;
          });
          setServerVideosMap(map);
        }
      } catch (err) {
        console.warn("Could not load dynamic tutorial videos, using built-in defaults:", err);
      } finally {
        setLoadingVideos(false);
      }
    };

    loadTutorialVideos();
  }, []);

  // Toggle main menu accordion
  const handleToggleMenu = (menuId) => {
    setOpenMenus((prev) => ({
      ...prev,
      [menuId]: !prev[menuId]
    }));
  };

  // Select a feature to play
  const handleSelectItem = (item) => {
    setSelectedItem(item);
    if (item.mainMenuId && item.mainMenuId !== item.id) {
      setOpenMenus((prev) => ({
        ...prev,
        [item.mainMenuId]: true
      }));
    }
    if (window.innerWidth < 1024) {
      setIsMobileSidebarOpen(false);
    }
  };

  // Compute active video details (Server uploaded takes priority over default)
  const currentVideoData = useMemo(() => {
    if (!selectedItem) return null;
    const serverMatch =
      serverVideosMap[selectedItem.path] ||
      serverVideosMap[selectedItem.id] ||
      serverVideosMap[selectedItem.name];

    if (serverMatch && serverMatch.videoUrl && serverMatch.isPublished !== false) {
      return {
        title: serverMatch.title || selectedItem.defaultVideo?.title,
        description: serverMatch.description || selectedItem.defaultVideo?.description,
        videoUrl: serverMatch.videoUrl,
        embedUrl: serverMatch.embedUrl || computeEmbedUrl(serverMatch.videoUrl),
        duration: serverMatch.duration || selectedItem.defaultVideo?.duration,
        isCustom: true
      };
    }

    // Default built-in video
    return {
      title: selectedItem.defaultVideo?.title || `${selectedItem.name} - ডেমো টিউটোরিয়াল`,
      description:
        selectedItem.defaultVideo?.description ||
        "মাদ্রাসা ম্যানেজমেন্ট সফটওয়্যারের এই ফিচারটির বিস্তারিত ব্যবহারবিধি ভিডিও টিউটোরিয়ালের মাধ্যমে দেখে নিন।",
      videoUrl: selectedItem.defaultVideo?.videoUrl || "https://www.youtube.com/watch?v=ScMzIvxBSi4",
      embedUrl: computeEmbedUrl(selectedItem.defaultVideo?.videoUrl || "https://www.youtube.com/watch?v=ScMzIvxBSi4"),
      duration: selectedItem.defaultVideo?.duration || "০৩:০০ মিনিট",
      isCustom: false
    };
  }, [selectedItem, serverVideosMap]);

  // Current item index for Next / Previous buttons
  const currentIndex = ALL_PLAYABLE_ITEMS.findIndex((it) => it.id === selectedItem?.id);
  const prevItem = currentIndex > 0 ? ALL_PLAYABLE_ITEMS[currentIndex - 1] : null;
  const nextItem = currentIndex < ALL_PLAYABLE_ITEMS.length - 1 ? ALL_PLAYABLE_ITEMS[currentIndex + 1] : null;

  const handleNext = () => {
    if (nextItem) {
      handleSelectItem(nextItem);
    }
  };

  const handlePrev = () => {
    if (prevItem) {
      handleSelectItem(prevItem);
    }
  };

  // Filtered items based on search query
  const filteredSearchItems = useMemo(() => {
    if (!searchQuery.trim()) return [];
    const q = searchQuery.toLowerCase();
    return ALL_PLAYABLE_ITEMS.filter(
      (it) =>
        it.name.toLowerCase().includes(q) ||
        it.nameEn?.toLowerCase().includes(q) ||
        it.mainMenuName?.toLowerCase().includes(q) ||
        it.defaultVideo?.title?.toLowerCase().includes(q)
    );
  }, [searchQuery]);

  // Toggle fullscreen
  const toggleFullScreen = () => {
    if (!document.fullscreenElement) {
      document.documentElement.requestFullscreen?.();
      setIsFullScreen(true);
    } else {
      document.exitFullscreen?.();
      setIsFullScreen(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#f8fafc] text-slate-800 flex flex-col font-bangla transition-colors duration-300">
      {/* ============================================================== */}
      {/* 1. TOP HEADER (Cloned Admin Navbar matching image) */}
      {/* ============================================================== */}
      <header className="h-16 bg-white/95 backdrop-blur-md border-b border-slate-200/80 fixed top-0 right-0 left-0 lg:left-72 z-30 flex items-center justify-between px-3 sm:px-6 shadow-xs">
        {/* Left: Mobile hamburger & Badge */}
        <div className="flex items-center gap-2 sm:gap-3">
          <button
            onClick={() => setIsMobileSidebarOpen(true)}
            className="lg:hidden p-2 text-slate-600 hover:text-emerald-700 hover:bg-emerald-50 rounded-xl transition-all"
            aria-label="Open sidebar"
          >
            <Menu className="w-5 h-5" />
          </button>

          {/* Green Pill Badge as in User's Screenshot */}
          <div className="flex items-center gap-2 px-3 py-1 bg-emerald-50 text-emerald-800 border border-emerald-200/80 rounded-full shadow-2xs">
            <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></span>
            <span className="text-xs font-bold tracking-tight">অ্যাডমিন প্যানেল</span>
          </div>

          {/* Breadcrumb path */}
          <div className="hidden md:flex items-center gap-1.5 text-xs text-slate-500 font-medium ml-1">
            <span className="text-slate-400">/</span>
            <span>{selectedItem?.sectionTitle}</span>
            <ChevronRight className="w-3.5 h-3.5 text-slate-300" />
            <span className="text-slate-700 font-semibold">{selectedItem?.mainMenuName}</span>
            {selectedItem?.mainMenuName !== selectedItem?.name && (
              <>
                <ChevronRight className="w-3.5 h-3.5 text-slate-300" />
                <span className="text-[#1C7D5A] font-bold">{selectedItem?.name}</span>
              </>
            )}
          </div>
        </div>

        {/* Right: Actions, Language, Theme, Notification & User Avatar */}
        <div className="flex items-center gap-1.5 sm:gap-3">
          {/* Back to Home Button */}
          <Link
            to="/"
            className="hidden sm:inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full border border-slate-200 text-slate-600 hover:text-[#1C7D5A] hover:bg-emerald-50 text-xs font-semibold transition-all shadow-2xs"
            title="মূল ওয়েবসাইটে ফিরে যান"
          >
            <Home className="w-3.5 h-3.5 text-[#1C7D5A]" />
            <span>হোম পেজ</span>
          </Link>

          {/* Request Free Demo CTA */}
          <Link
            to="/free-demo"
            className="bg-[#0e7c55] hover:bg-[#0a6646] active:scale-95 text-white font-semibold text-xs px-3 sm:px-3.5 py-1.5 rounded-lg shadow-xs hover:shadow-emerald-700/20 transition-all flex items-center gap-1.5 shrink-0"
          >
            <Sparkles className="w-3.5 h-3.5" />
            <span>ফ্রি ডেমো আবেদন</span>
          </Link>

          {/* Fullscreen icon */}
          <button
            onClick={toggleFullScreen}
            className="hidden sm:flex p-1.5 text-slate-500 hover:text-[#1C7D5A] hover:bg-slate-100 rounded-lg transition-all"
            title={isFullScreen ? "পূর্ণ পর্দা বন্ধ করুন" : "পূর্ণ পর্দা"}
          >
            {isFullScreen ? <Minimize className="w-4 h-4" /> : <Maximize className="w-4 h-4" />}
          </button>

          {/* Theme toggle */}
          <button
            onClick={toggleTheme}
            className="p-1.5 text-slate-500 hover:text-[#1C7D5A] hover:bg-slate-100 rounded-lg transition-all"
            title="থিম পরিবর্তন"
          >
            {theme === "dark" ? <Sun className="w-4 h-4 text-amber-500" /> : <Moon className="w-4 h-4" />}
          </button>

          {/* Notification bell */}
          <div className="relative">
            <button className="p-1.5 text-slate-500 hover:text-[#1C7D5A] hover:bg-slate-100 rounded-lg transition-all">
              <Bell className="w-4 h-4" />
            </button>
            <span className="absolute top-1 right-1 w-2 h-2 bg-emerald-500 rounded-full ring-2 ring-white"></span>
          </div>

          {/* Profile Circle matching screenshot */}
          <div className="flex items-center gap-2 pl-2 border-l border-slate-200">
            <div className="relative">
              <div className="w-8 h-8 rounded-full bg-[#1C7D5A]/15 border-2 border-[#1C7D5A]/30 flex items-center justify-center text-[#1C7D5A] font-bold text-xs shadow-xs">
                <span>আ</span>
              </div>
              <span className="absolute bottom-0 right-0 w-2.5 h-2.5 bg-emerald-500 border-2 border-white rounded-full"></span>
            </div>
            <span className="hidden sm:inline-block text-xs font-bold text-slate-700">
              অ্যাডমিন
            </span>
          </div>
        </div>
      </header>

      {/* ============================================================== */}
      {/* 2. LEFT SIDEBAR (Exact Clone of Admin Sidebar) */}
      {/* ============================================================== */}
      {/* Mobile Backdrop */}
      {isMobileSidebarOpen && (
        <div
          className="fixed inset-0 bg-slate-900/60 z-40 lg:hidden backdrop-blur-xs transition-opacity animate-fade-in"
          onClick={() => setIsMobileSidebarOpen(false)}
        />
      )}

      <aside
        className={`fixed inset-y-0 left-0 z-50 w-72 bg-[#123628] text-white border-r border-[#1C7D5A]/20 flex flex-col transform transition-transform duration-300 ease-in-out lg:translate-x-0 shadow-2xl ${isMobileSidebarOpen ? "translate-x-0" : "-translate-x-full"
          }`}
      >
        {/* Sidebar Header with Logo */}
        <div className="p-4 flex items-center justify-between border-b border-white/10 bg-[#0d271d]">
          <Link to="/" className="flex items-center gap-3 min-w-0 group">
            <div className="h-11 w-11 bg-white rounded-xl p-1 flex items-center justify-center shadow-md shrink-0 group-hover:scale-105 transition-transform">
              <img
                src="/madrasa-sheba-logo.png"
                alt="Madrasa Sheba Logo"
                className="w-full h-full object-contain"
                onError={(e) => {
                  e.currentTarget.src = "/mlogo.jpg";
                }}
              />
            </div>
            <div className="min-w-0 flex-1">
              <h1 className="font-bold text-sm text-white tracking-tight leading-tight truncate">
                জামিয়া উসদিয়া
              </h1>
              <span className="inline-block text-[11px] font-semibold text-[#EAB33C] tracking-wide mt-0.5">
                অ্যাডমিন প্যানেল
              </span>
            </div>
          </Link>
          <button
            onClick={() => setIsMobileSidebarOpen(false)}
            className="lg:hidden p-1.5 text-white/70 hover:text-white hover:bg-white/10 rounded-lg transition-all"
            aria-label="Close sidebar"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Sidebar Navigation */}
        <nav className="flex-1 overflow-y-auto px-4 py-5 custom-scrollbar space-y-6 select-none">
          {ADMIN_MENU_SECTIONS.map((section, sIdx) => (
            <div key={sIdx}>
              {/* Section Divider & Label */}
              <div className="flex items-center gap-3 px-3 mb-2.5">
                <span className="text-[11px] font-bold text-[#EAB33C] uppercase tracking-wider">
                  {section.title}
                </span>
                <div className="h-px flex-1 bg-white/15" />
              </div>

              {/* Main Links */}
              <div className="space-y-1">
                {section.links.map((link) => {
                  const hasChildren = link.children && link.children.length > 0;
                  const isMenuOpen = openMenus[link.id];

                  // Check if any child is selected
                  const isAnyChildSelected =
                    hasChildren && link.children.some((child) => child.id === selectedItem?.id);
                  const isSelfSelected = !hasChildren && selectedItem?.id === link.id;

                  if (hasChildren) {
                    return (
                      <div key={link.id} className="mb-1">
                        <button
                          type="button"
                          onClick={() => handleToggleMenu(link.id)}
                          className={`w-full flex items-center justify-between px-3 py-2.5 rounded-lg transition-all duration-200 group text-[14px] cursor-pointer ${isAnyChildSelected
                            ? "bg-[#1C7D5A] font-semibold text-white shadow-sm border-l-[3px] border-[#EAB33C]"
                            : "text-white/85 hover:bg-white/10 hover:text-white"
                            }`}
                        >
                          <div className="flex items-center gap-3 min-w-0">
                            {link.icon ? (
                              <div
                                className={`w-8 h-8 rounded-lg flex items-center justify-center transition-all duration-200 shrink-0 ${isAnyChildSelected
                                  ? "bg-white/20 text-[#EAB33C] shadow-sm"
                                  : "text-white/85 group-hover:bg-white/10 group-hover:text-white"
                                  }`}
                              >
                                <link.icon className="w-4.5 h-4.5" />
                              </div>
                            ) : (
                              <div className="w-8 shrink-0" />
                            )}
                            <span className="truncate font-medium">{link.name}</span>
                          </div>
                          {isMenuOpen ? (
                            <ChevronDown className="w-3.5 h-3.5 text-white/80 group-hover:text-white transition-transform" />
                          ) : (
                            <ChevronRight className="w-3.5 h-3.5 text-white/80 group-hover:text-white transition-transform" />
                          )}
                        </button>

                        {/* Submenu Accordion */}
                        {isMenuOpen && (
                          <div className="mt-1 space-y-1 animate-fade-in-down origin-top overflow-hidden pl-3">
                            {link.children.map((child) => {
                              const isChildActive = selectedItem?.id === child.id;
                              return (
                                <button
                                  type="button"
                                  key={child.id}
                                  ref={isChildActive ? activeItemRef : null}
                                  onClick={() =>
                                    handleSelectItem({
                                      ...child,
                                      sectionTitle: section.title,
                                      mainMenuName: link.name,
                                      mainMenuId: link.id,
                                      mainMenuIcon: link.icon
                                    })
                                  }
                                  className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-lg transition-all duration-200 group text-[13.5px] cursor-pointer ${isChildActive
                                    ? "bg-[#1C7D5A] text-white font-semibold shadow-sm border-l-[3px] border-[#EAB33C]"
                                    : "text-white/80 hover:bg-white/10 hover:text-white"
                                    }`}
                                >
                                  {child.icon ? (
                                    <div
                                      className={`w-7 h-7 rounded-lg flex items-center justify-center transition-all duration-200 shrink-0 ${isChildActive
                                        ? "bg-white/20 text-[#EAB33C] shadow-sm"
                                        : "text-white/70 group-hover:bg-white/10 group-hover:text-white"
                                        }`}
                                    >
                                      <child.icon className="w-4 h-4" />
                                    </div>
                                  ) : (
                                    <div className="w-7 flex items-center justify-center shrink-0">
                                      <div
                                        className={`w-1.5 h-1.5 rounded-full transition-all duration-300 ${isChildActive
                                          ? "bg-[#EAB33C] scale-125 ring-4 ring-[#EAB33C]/20"
                                          : "bg-white/40 group-hover:bg-[#EAB33C]"
                                          }`}
                                      />
                                    </div>
                                  )}
                                  <span className="truncate font-medium text-left">{child.name}</span>
                                </button>
                              );
                            })}
                          </div>
                        )}
                      </div>
                    );
                  }

                  // Single leaf link (e.g. Dashboard)
                  return (
                    <button
                      type="button"
                      key={link.id}
                      ref={isSelfSelected ? activeItemRef : null}
                      onClick={() =>
                        handleSelectItem({
                          ...link,
                          sectionTitle: section.title,
                          mainMenuName: link.name,
                          mainMenuId: link.id,
                          mainMenuIcon: link.icon
                        })
                      }
                      className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-lg transition-all duration-200 group text-[14px] cursor-pointer ${isSelfSelected
                        ? "bg-[#1C7D5A] text-white font-semibold shadow-sm border-l-[3px] border-[#EAB33C]"
                        : "text-white/85 hover:bg-white/10 hover:text-white"
                        }`}
                    >
                      {link.icon ? (
                        <div
                          className={`w-8 h-8 rounded-lg flex items-center justify-center transition-all duration-200 shrink-0 ${isSelfSelected
                            ? "bg-white/20 text-[#EAB33C] shadow-sm"
                            : "text-white/85 group-hover:bg-white/10 group-hover:text-white"
                            }`}
                        >
                          <link.icon className="w-4.5 h-4.5" />
                        </div>
                      ) : (
                        <div className="w-8 shrink-0" />
                      )}
                      <span className="truncate font-medium text-left">{link.name}</span>
                    </button>
                  );
                })}
              </div>
            </div>
          ))}
        </nav>

        {/* Sidebar Footer with Help Hotline */}
        <div className="p-3.5 border-t border-white/10 bg-[#0d271d] flex items-center justify-between text-xs text-slate-300">
          <div className="flex items-center gap-2">
            <span className="w-2 h-2 rounded-full bg-emerald-400"></span>
            <span className="text-[11px] font-bold text-white/90">ভিডিও কোর্স মোড</span>
          </div>
          <Link
            to="/contact"
            className="text-[11px] text-[#EAB33C] hover:underline font-semibold"
          >
            সাপোর্ট হেল্পলাইন
          </Link>
        </div>
      </aside>

      {/* ============================================================== */}
      {/* 3. MAIN CONTENT: Center Video Card & Viewer (Requirements 2,3,4) */}
      {/* ============================================================== */}
      <main className="flex-1 lg:ml-72 pt-25 px-3 sm:px-6 lg:px-40 pb-12 flex flex-col justify-start">
        {/* View-Only Course Guide Alert Banner */}

        {/* Video Header: Dynamic Feature Title & Call Helpline */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 sm:gap-4 mb-4 sm:mb-5">
          {/* Left: Module Tag, Icon & Title */}
          <div className="flex items-center gap-3 min-w-0">
            {selectedItem?.icon ? (
              <div className="w-10 h-10 sm:w-11 sm:h-11 rounded-xl bg-emerald-50 text-[#1C7D5A] border border-emerald-200/70 flex items-center justify-center shrink-0 shadow-2xs">
                <selectedItem.icon className="w-5 h-5" />
              </div>
            ) : (
              <div className="w-10 h-10 sm:w-11 sm:h-11 rounded-xl bg-emerald-50 text-[#1C7D5A] border border-emerald-200/70 flex items-center justify-center shrink-0 shadow-2xs">
                <PlayCircle className="w-5 h-5 text-[#1C7D5A]" />
              </div>
            )}

            <div className="min-w-0">
              <div className="flex items-center gap-2 mb-0.5">
                <span className="inline-flex items-center gap-1.5 px-2 py-0.5 rounded-full text-[11px] font-bold bg-emerald-50 text-emerald-800 border border-emerald-200/80">
                  <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse"></span>
                  {selectedItem?.mainMenuName || selectedItem?.sectionTitle || "ভিডিও টিউটোরিয়াল"}
                </span>

                <span className="inline-flex items-center gap-1 text-[11px] font-semibold text-emerald-800 bg-emerald-100/70 border border-emerald-200/60 px-2 py-0.5 rounded-md">
                  <span>সিরিয়াল: {currentIndex + 1} / {ALL_PLAYABLE_ITEMS.length}</span>
                </span>

                {currentVideoData?.duration && (
                  <span className="inline-flex items-center gap-1 text-[11px] font-medium text-slate-500 bg-slate-100 px-2 py-0.5 rounded-md">
                    <Clock className="w-3 h-3 text-slate-400" />
                    <span>{currentVideoData.duration}</span>
                  </span>
                )}
              </div>

              <h2 className="text-base sm:text-xl font-bold text-slate-900 tracking-tight leading-snug truncate">
                {selectedItem?.name || currentVideoData?.title || "ড্যাশবোর্ড ভিডিও ডেমো"}
              </h2>
            </div>
          </div>

          {/* Right: Call & Helpline Actions */}
          <div className="flex items-center gap-2 self-start sm:self-center shrink-0">
            <a
              href="tel:01830630365"
              className="inline-flex items-center gap-2 px-3.5 py-2 sm:px-4  rounded-full bg-[#1C7D5A] hover:bg-[#145a40] text-white font-semibold text-xs sm:text-sm shadow-sm hover:shadow-md hover:shadow-emerald-900/15 active:scale-95 transition-all duration-200 group"
              title="সরাসরি কথা বলুন: 01830-630365"
            >
              <div className="w-7 h-7 rounded-full bg-white/15 flex items-center justify-center group-hover:bg-white/25 transition-colors">
                <WhatsAppIcon className="w-3 h-3 text-emerald-200 group-hover:animate-bounce" />

              </div>
              <div className="flex flex-col text-left">
                <span className="text-xs sm:text-sm font-bold tracking-wide">কল করুন: ০১৮৩০-৬৩০৩৬৫</span>
              </div>
            </a>
          </div>
        </div>
        {/* ============================================================== */}
        {/* CENTER VIDEO CARD (Identical to user's uploaded screenshot) */}
        {/* ============================================================== */}
        <div className="w-full  flex flex-col">
          {/* Main Video Player Container */}
          <div className="relative w-full bg-slate-950 rounded-[15px]  shadow-[0_20px_50px_rgba(0,0,0,0.18)] overflow-hidden border border-slate-800/80 group">
            {/* 16:9 Aspect Ratio Box */}
            <div className="relative w-full aspect-video bg-black flex items-center justify-center">
              {currentVideoData?.embedUrl ? (
                <iframe
                  key={currentVideoData.embedUrl}
                  src={currentVideoData.embedUrl}
                  title={currentVideoData.title || "Feature Demo Video"}
                  allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
                  allowFullScreen
                  className="w-full h-full border-0 absolute inset-0"
                />
              ) : (
                <div className="flex flex-col items-center justify-center text-center p-8 text-white">
                  <PlayCircle className="w-16 h-16 text-emerald-500 mb-3 animate-pulse" />
                  <p className="text-base font-bold">ভিডিও লোড হচ্ছে...</p>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Pagination & Serial Progress */}
        <div className="flex flex-col sm:flex-row items-center justify-between gap-3 mt-6 pt-4 border-t border-slate-200/70">
          <div className="text-xs font-semibold text-slate-600 flex items-center gap-2">
            <span className="w-2 h-2 rounded-full bg-[#1C7D5A]"></span>
            <span>ভিডিও নং {currentIndex + 1} / {ALL_PLAYABLE_ITEMS.length}</span>
            <span className="text-slate-400">|</span>
            <span className="text-slate-500 truncate max-w-50 sm:max-w-xs">{selectedItem?.name}</span>
          </div>

          {/* Course Navigation Controls (Prev / Next) */}
          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={handlePrev}
              disabled={!prevItem}
              className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-bold transition-all ${prevItem
                ? "bg-slate-100 hover:bg-slate-200 text-slate-700 cursor-pointer active:scale-95"
                : "bg-slate-50 text-slate-300 cursor-not-allowed"
                }`}
              title={prevItem ? `পূর্ববর্তী: ${prevItem.name}` : "পূর্ববর্তী কোনো ভিডিও নেই"}
            >
              <ArrowLeft className="w-3.5 h-3.5" />
              <span>পূর্ববর্তী</span>
            </button>

            <button
              type="button"
              onClick={handleNext}
              disabled={!nextItem}
              className={`inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-xl text-xs font-bold transition-all ${nextItem
                ? "bg-[#1C7D5A] hover:bg-[#145a40] text-white shadow-xs cursor-pointer active:scale-95"
                : "bg-slate-100 text-slate-300 cursor-not-allowed"
                }`}
              title={nextItem ? `পরবর্তী: ${nextItem.name}` : "পরবর্তী কোনো ভিডিও নেই"}
            >
              <span>পরবর্তী ভিডিও</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>
      </main>
    </div>
  );
};

export default VideoDemo;
