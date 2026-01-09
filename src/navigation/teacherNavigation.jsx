import {
  LayoutDashboard,
  CalendarDays,
  UserCheck,
  BookOpen,
  GraduationCap,
  Users,
  MessageSquare,
  Library,
  Settings,
  ClipboardCheck,
  FileSpreadsheet
} from "lucide-react";

export const teacherNavigation = [
  {
    name: "Dashboard",
    path: "/teacher",
    icon: LayoutDashboard,
  },
  {
    name: "My Academic",
    icon: CalendarDays,
    children: [
      { name: "My Schedule", path: "/teacher/academic/schedule" },
      { name: "My Subjects", path: "/teacher/academic/subjects" },
    ],
  },
  {
    name: "Attendance",
    icon: UserCheck,
    children: [
      { name: "Daily Attendance", path: "/teacher/attendance/daily" },
      { name: "Subject Wise", path: "/teacher/attendance/subject" },
      { name: "Attendance Report", path: "/teacher/attendance/report" },
    ],
  },
  {
    name: "Homework",
    icon: BookOpen,
    children: [
      { name: "Add Homework", path: "/teacher/homework/add" },
      { name: "Homework List", path: "/teacher/homework/list" },
      { name: "Evaluation", path: "/teacher/homework/evaluation" },
    ],
  },
  {
    name: "Examinations",
    icon: GraduationCap,
    children: [
      { name: "Exam Schedule", path: "/teacher/exam/schedule" },
      { name: "Mark Entries", path: "/teacher/exam/marks" },
    ],
  },
  {
    name: "Students",
    icon: Users,
    children: [
      { name: "Student List", path: "/teacher/student/list" },
    ],
  },
  {
    name: "Communication",
    icon: MessageSquare,
    children: [
      { name: "Notice Board", path: "/teacher/notice" },
      { name: "Message Center", path: "/teacher/message" },
    ],
  },
  {
    name: "Utility",
    icon: Library,
    children: [
      { name: "Library", path: "/teacher/library" },
    ],
  },
  {
    name: "My Profile",
    path: "/teacher/profile",
    icon: Settings,
  },
];
