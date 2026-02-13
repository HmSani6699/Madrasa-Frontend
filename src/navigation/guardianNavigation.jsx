import {
  LayoutDashboard,
  Users,
  CreditCard,
  BarChart3,
  CalendarCheck,
  Bell,
  UserCircle,
  MessageSquare,
  FileText,
  GraduationCap,
  ClipboardList
} from "lucide-react";

export const guardianNavigation = [
  {
    name: "Guardian Dashboard",
    path: "/guardian/dashboard",
    icon: LayoutDashboard,
  },
  {
    name: "Academic",
    icon: GraduationCap,
    children: [
      { name: "Subject List", path: "/guardian/academic/subjects" },
      { name: "Class Routine", path: "/guardian/academic/routine" },
    ],
  },
  {
    name: "Examination",
    icon: ClipboardList,
    children: [
      { name: "Exam Schedule", path: "/guardian/examination/schedule" },
      { name: "Exam Result", path: "/guardian/examination/results" },
    ],
  },
  {
    name: "Finance",
    icon: CreditCard,
    children: [
      { name: "Fees & Dues", path: "/guardian/finance/fees" },
      { name: "Payment History", path: "/guardian/finance/history" },
    ],
  },
  {
    name: "Attendance",
    icon: CalendarCheck,
    path: "/guardian/attendance",
  },
  {
    name: "Leave Application",
    icon: FileText,
    path: "/guardian/leave-application",
  },
  {
    name: "Communication",
    icon: MessageSquare,
    children: [
      { name: "School Notices", path: "/guardian/notice" },
      { name: "Teacher Connect", path: "/guardian/message" },
    ],
  },
  {
    name: "Parent Profile",
    path: "/guardian/profile",
    icon: UserCircle,
  },
];
