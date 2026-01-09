import {
  LayoutDashboard,
  CalendarDays,
  PenTool,
  Trophy,
  BookOpen,
  Bell,
  User,
  MessageSquare,
  Library
} from "lucide-react";

export const studentNavigation = [
  {
    name: "Dashboard",
    path: "/student/dashboard",
    icon: LayoutDashboard,
  },
  {
    name: "My Academics",
    icon: CalendarDays,
    children: [
      { name: "My Schedule", path: "/student/academic/schedule" },
      { name: "My Subjects", path: "/student/academic/subjects" },
    ],
  },
  {
    name: "Assignments",
    icon: PenTool,
    children: [
      { name: "Pending Tasks", path: "/student/homework/pending" },
      { name: "Submission History", path: "/student/homework/history" },
    ],
  },
  {
    name: "Evaluation",
    icon: Trophy,
    children: [
      { name: "Exam Schedule", path: "/student/exam/schedule" },
      { name: "Progress Report", path: "/student/exam/results" },
    ],
  },
  {
    name: "Resources",
    icon: Library,
    children: [
      { name: "Digital Library", path: "/student/library" },
      { name: "E-Books", path: "/student/library/ebooks" },
    ],
  },
  {
    name: "Communication",
    icon: MessageSquare,
    children: [
      { name: "Notice Board", path: "/student/notice" },
      { name: "Message Center", path: "/student/message" },
    ],
  },
  {
    name: "My Profile",
    path: "/student/profile",
    icon: User,
  },
];
