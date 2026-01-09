import {
  LayoutDashboard,
  Users,
  CreditCard,
  BarChart3,
  CalendarCheck,
  Bell,
  UserCircle,
  MessageSquare
} from "lucide-react";

export const guardianNavigation = [
  {
    name: "Guardian Dashboard",
    path: "/guardian/dashboard",
    icon: LayoutDashboard,
  },
  {
    name: "My Children",
    icon: Users,
    children: [
      { name: "Switch Child", path: "/guardian/children/selection" },
      { name: "Academic Summary", path: "/guardian/children/summary" },
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
    name: "Performance",
    icon: BarChart3,
    children: [
      { name: "Exam Results", path: "/guardian/performance/results" },
      { name: "Progress Analytics", path: "/guardian/performance/analytics" },
    ],
  },
  {
    name: "Attendance",
    icon: CalendarCheck,
    path: "/guardian/attendance",
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
