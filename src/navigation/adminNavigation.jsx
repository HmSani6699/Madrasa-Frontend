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
} from "lucide-react";

export const adminNavigation = [
  {
    name: "Dashboard",
    path: "/admin",
    icon: LayoutDashboard,
  },
  {
    name: "Admission",
    icon: UserPlus,
    children: [
      { name: "Student List", path: "/admin/student/list", icon: Users },
      { name: "Create Admission", path: "/admin/admission/create", icon: UserPlus },
      { name: "Online Admission", path: "/admin/admissions/online", icon: Globe },
      { name: "Admission Report", path: "/admin/admission/report", icon: FileText },
    ],
  },
  {
    name: "Parents",
    icon: Contact,
    children: [
      { name: "Parent List", path: "/admin/parents/list", icon: Users },
    ],
  },
  {
    name: "Employee",
    icon: Briefcase,
    children: [
      { name: "Employee List", path: "/admin/employee/list", icon: Users },
      { name: "Add New Employee", path: "/admin/employee/create", icon: UserPlus },
      { name: "Add Designation", path: "/admin/employee/designation", icon: Award },
    ],
  },
  {
    name: "Attendance",
    icon: CalendarCheck,
    children: [
      {
        name: "Mark Attendance",
        icon: UserCheck,
        children: [
          { name: "Student", path: "/admin/attendance/student", icon: User },
          { name: "Employee", path: "/admin/attendance/employee", icon: Briefcase },
          { name: "Exam", path: "/admin/attendance/exam", icon: GraduationCap },
        ],
      },
      {
        name: "Attendance Report",
        icon: FileBarChart,
        children: [
          {
            name: "Student Attendance Report",
            path: "/admin/attendance/report/student",
            icon: FilePieChart,
          },
          {
            name: "Staff Attendance Report",
            path: "/admin/attendance/report/staff",
            icon: FilePieChart,
          },
          {
            name: "Exam Attendant Report",
            path: "/admin/attendance/report/exam",
            icon: FilePieChart,
          },
        ],
      },
    ],
  },
  {
    name: "Academic",
    icon: School,
    children: [
      {
        name: "Department & Section",
        path: "/admin/academic/department-section",
        icon: LayoutGrid,
      },
      { name: "Subject", path: "/admin/academic/subject", icon: BookOpen },
      { name: "Class Assign", path: "/admin/academic/class-assign", icon: ClipboardList },
      { name: "Class Schedule", path: "/admin/academic/schedule/class", icon: Clock },
      { name: "Assign Class Teacher", path: "/admin/academic/assign-teacher", icon: UserCheck },
      { name: "Teacher Schedule", path: "/admin/academic/schedule/teacher", icon: Clock },
      {
        name: "Student Academic Report",
        path: "/admin/academic/student-academic-report",
        icon: FileBarChart,
      },
    ],
  },
  {
    name: "Homework",
    icon: BookOpen,
    children: [{ name: "Home Work", path: "/admin/homework/list", icon: BookOpen }],
  },
  {
    name: "Examination",
    icon: GraduationCap,
    children: [
      {
        name: "Exam",
        icon: FileCheck,
        children: [
          { name: "Exam Name", path: "/admin/exam/term", icon: FileText },
          { name: "Exam Hall", path: "/admin/exam/hall", icon: Building2 },
          { name: "Exam Setup", path: "/admin/exam/setup", icon: Settings },
        ],
      },
      {
        name: "Exam Schedule",
        icon: Calendar,
        children: [
          { name: "Schedule", path: "/admin/exam/schedule/list", icon: List },
          { name: "Add Schedule", path: "/admin/exam/schedule/add", icon: CalendarPlus },
        ],
      },
      {
        name: "Marks",
        icon: TrendingUp,
        children: [
          { name: "Mark Entries", path: "/admin/exam/marks/entry", icon: Edit },
          { name: "Grades Range", path: "/admin/exam/marks/grades", icon: Award },
          { name: "Tabulation Sheet", path: "/admin/reports/exam/tabulation", icon: Table },
        ],
      },
    ],
  },
  {
    name: "Office Accounting",
    icon: Calculator,
    children: [
      {
        name: "Fees Collection",
        icon: Wallet,
        children: [
          {
            name: "Collect Fees",
            path: "/admin/accounting/fees/collect",
            icon: DollarSign,
          },
          {
            name: "Fee Setup",
            path: "/admin/accounting/fees/setup",
            icon: Settings,
          },
        ],
      },
      {
        name: "Payroll",
        icon: Banknote,
        children: [
          {
            name: "Pay Salary",
            path: "/admin/accounting/payroll/pay",
            icon: DollarSign,
          },
          {
            name: "Process Salary",
            path: "/admin/accounting/payroll/process",
            icon: Calculator,
          },
        
          {
            name: "Salary History",
            path: "/admin/accounting/payroll/history",
            icon: Receipt,
          },
        ],
      },
      {
        name: "Donation",
        icon: HeartHandshake,
        children: [
          {
            name: "Receive Donation",
            path: "/admin/accounting/donation/create",
            icon: HeartHandshake,
          },
          {
            name: "Donation History",
            path: "/admin/accounting/donation/list",
            icon: ClipboardList,
          },
        ],
      },
      {
        name: "Expenses",
        icon: TrendingDown,
        children: [
          {
            name: "Add Expense",
            path: "/admin/accounting/expense/create",
            icon: CreditCard,
          },
        ],
      },
      {
        name: "Income",
        icon: TrendingUp,
        children: [
          {
            name: "Add Income",
            path: "/admin/accounting/income/create",
            icon: DollarSign,
          },
        ],
      },
      {
        name: "Accounting Report",
        icon: FileBarChart,
        children: [
          {
            name: "Free Collection Report",
            path: "/admin/accounting/report/free-collection",
            icon: FileText,
          },
          {
            name: "Salary Report",
            path: "/admin/accounting/report/salary",
            icon: FileText,
          },
          {
            name: "Donation Report",
            path: "/admin/accounting/report/donation",
            icon: FileText,
          },
          {
            name: "Income & Expense Report",
            path: "/admin/accounting/report/income-expense",
            icon: FileText,
          },
        ],
      },
    ],
  },
  {
    name: "Card Management",
    icon: CreditCard,
    children: [
      { name: "ID Card Template", path: "/admin/card/template", icon: LayoutTemplate },
      { name: "Student ID Card", path: "/admin/card/student", icon: Contact },
      { name: "Employee ID Card", path: "/admin/card/employee", icon: Contact },
      { name: "Admit Card Template", path: "/admin/card/admit-template", icon: FileText },
      { name: "Generate Admit Card", path: "/admin/card/admit-generate", icon: Printer },
    ],
  },
  {
    name: "Certificate Management",
    icon: Award,
    children: [
      { name: "Certificate Template", path: "/admin/certificate/template", icon: Award },
      { name: "Generate Student", path: "/admin/certificate/student", icon: Users },
      { name: "Generate Employee", path: "/admin/certificate/employee", icon: Users },
    ],
  },
  {
    name: "Events",
    icon: CalendarDays,
    path: "/admin/events",
  },
  {
    name: "Message",
    icon: MessageSquare,
    path: "/admin/message",
  },
  {
    name: "Library",
    icon: Library,
    path: "/admin/library",
  },
  {
    name: "Frontend",
    icon: LayoutTemplate,
    path: "/admin/frontend",
  },

  {
    name: "Settings",
    icon: Settings,
    path: "/admin/settings",
  },
];
