import {
  LayoutDashboard,
  UserPlus,
  Users,
  UserCheck,
  Briefcase,
  CalendarCheck,
  BookOpen,
  MonitorPlay,
  ClipboardList,
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
  FileText
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
      { name: "Create Admission", path: "/admin/admission/create" },
      { name: "Online Admission", path: "/admin/admissions/online" },
    ],
  },
  {
    name: "Student Details",
    icon: Users,
    children: [
      { name: "Student List", path: "/admin/student/list" },
      { name: "Login Deactive", path: "/admin/student/deactive" },
    ],
  },
  {
    name: "Parents",
    icon: Contact,
    children: [
        { name: "Parent List", path: "/admin/parents/list" },
        { name: "Login Deactive", path: "/admin/parents/deactive" },
    ]
  },
  {
    name: "Employee",
    icon: Briefcase,
    children: [
      { name: "Add New Employee", path: "/admin/employee/create" },
      { name: "Employee List", path: "/admin/employee/list" },
      { name: "Add Department", path: "/admin/employee/department" },
      { name: "Add Designation", path: "/admin/employee/designation" },
      { name: "Login Deactive", path: "/admin/employee/deactive" },
    ],
  },
  {
    name: "Attendance",
    icon: CalendarCheck,
    children: [
      { name: "Student", path: "/admin/attendance/student" },
      { name: "Subject Wise", path: "/admin/attendance/subject" },
      { name: "Employee", path: "/admin/attendance/employee" },
      { name: "Exam", path: "/admin/attendance/exam" },
    ],
  },
  {
    name: "Academic",
    icon: School,
    children: [
      { name: "Class & Section", path: "/admin/academic/class-section" },
      { name: "Control Class", path: "/admin/academic/control-class" },
      { name: "Assign Class Teacher", path: "/admin/academic/assign-teacher" },
      { name: "Subject", path: "/admin/academic/subject" },
      { name: "Class Assign", path: "/admin/academic/class-assign" }, 
      { name: "Class Schedule", path: "/admin/academic/schedule/class" },
      { name: "Teacher Schedule", path: "/admin/academic/schedule/teacher" },
    ],
  },
  {
    name: "Homework",
    icon: BookOpen,
    children: [
      { name: "Home Work", path: "/admin/homework/list" },
      { name: "Evaluation Report", path: "/admin/homework/report" },
    ],
  },
  {
    name: "Exam Master",
    icon: GraduationCap,
    children: [
      { 
          name: "Exam",
          children: [
              { name: "Exam Term", path: "/admin/exam/term" },
              { name: "Exam Hall", path: "/admin/exam/hall" },
              { name: "Distribution", path: "/admin/exam/distribution" },
              { name: "Exam Setup", path: "/admin/exam/setup" },
              { name: "Marksheet Template", path: "/admin/exam/template" },
          ]
      },
      { 
          name: "Exam Schedule",
          children: [
              { name: "Schedule", path: "/admin/exam/schedule/list" },
              { name: "Add Schedule", path: "/admin/exam/schedule/add" },
          ]
       },
      { 
          name: "Marks",
          children: [
              { name: "Mark Entries", path: "/admin/exam/marks/entry" },
              { name: "Generate Position", path: "/admin/exam/marks/position" },
              { name: "Grades Range", path: "/admin/exam/marks/grades" },
          ]
       },
    ],
  },
  {
    name: "Card Management",
    icon: CreditCard,
    children: [
      { name: "ID Card Template", path: "/admin/card/template" },
      { name: "Student ID Card", path: "/admin/card/student" },
      { name: "Employee ID Card", path: "/admin/card/employee" },
      { name: "Admit Card Template", path: "/admin/card/admit-template" },
      { name: "Generate Admit Card", path: "/admin/card/admit-generate" },
    ],
  },
  {
    name: "Certificate Management",
    icon: Award,
    children: [
      { name: "Certificate Template", path: "/admin/certificate/template" },
      { name: "Generate Student", path: "/admin/certificate/student" },
      { name: "Generate Employee", path: "/admin/certificate/employee" },
    ],
  },
  {
    name: "Office Accounting",
    icon: Calculator,
    path: "/admin/accounting", // Might expand later
  },
  {
    name: "Reports",
    icon: FileBarChart,
    children: [
      { 
          name: "Student Reports",
          children: [
              { name: "Login Credential", path: "/admin/reports/student/login" },
              { name: "Admission Report", path: "/admin/reports/student/admission" },
              { name: "Class & Section Report", path: "/admin/reports/student/class-section" },
              { name: "Sibling Report", path: "/admin/reports/student/sibling" },
          ]
      },
      {
          name: "Fees Reports",
          children: [
              { name: "Fees Report", path: "/admin/reports/fees/general" },
              { name: "Receipts Report", path: "/admin/reports/fees/receipts" },
              { name: "Due Fees Report", path: "/admin/reports/fees/due" },
              { name: "Fine Report", path: "/admin/reports/fees/fine" },
          ]
      },
      {
          name: "Financial Reports",
          children: [
             { name: "Account Statement", path: "/admin/reports/finance/statement" },
             { name: "Income Reports", path: "/admin/reports/finance/income" },
             { name: "Expense Reports", path: "/admin/reports/finance/expense" },
             { name: "Transaction Reports", path: "/admin/reports/finance/transactions" },
             { name: "Balance Sheet", path: "/admin/reports/finance/balance" },
             { name: "Income Vs Expense", path: "/admin/reports/finance/income-vs-expense" },
          ]
      },
      {
          name: "Attendance Reports",
          children: [
              { name: "Student Reports", path: "/admin/reports/attendance/student" }, // ambiguous in request, handled as sub-cat
              { name: "Student Daily Reports", path: "/admin/reports/attendance/student-daily" },
              { name: "Student Overview", path: "/admin/reports/attendance/student-overview" },
              { name: "Subject Wise Reports", path: "/admin/reports/attendance/subject-wise" },
              { name: "Subject Wise By Day", path: "/admin/reports/attendance/subject-day" },
              { name: "Subject Wise By Month", path: "/admin/reports/attendance/subject-month" },
              { name: "Employee Reports", path: "/admin/reports/attendance/employee" },
          ]
      },
      {
          name: "Exam Reports",
          children: [
              { name: "Examination", path: "/admin/reports/exam/list" },
              { name: "Report Card", path: "/admin/reports/exam/card" },
              { name: "Tabulation Sheet", path: "/admin/reports/exam/tabulation" },
              { name: "Progress Reports", path: "/admin/reports/exam/progress" },
          ]
      },
      {
           name: "Inventory Reports",
           children: [
               { name: "Stock Report", path: "/admin/reports/inventory/stock" },
               { name: "Purchase Report", path: "/admin/reports/inventory/purchase" },
               { name: "Sales Report", path: "/admin/reports/inventory/sales" },
               { name: "Issue Report", path: "/admin/reports/inventory/issue" },
           ]
      }
    ],
  },
  {
    name: "Frontend",
    icon: LayoutTemplate,
    path: "/admin/frontend",
  },
  {
    name: "Library",
    icon: Library,
    path: "/admin/library",
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
    name: "Inventory",
    icon: Package,
    children: [
      { name: "Product", path: "/admin/inventory/product" },
      { name: "Category", path: "/admin/inventory/category" },
      { name: "Store", path: "/admin/inventory/store" },
      { name: "Supplier", path: "/admin/inventory/supplier" },
      { name: "Unit", path: "/admin/inventory/unit" },
      { name: "Purchase", path: "/admin/inventory/purchase" },
      { name: "Sales", path: "/admin/inventory/sales" },
      { name: "Issue", path: "/admin/inventory/issue" },
    ],
  },
  {
    name: "Settings",
    icon: Settings,
    path: "/admin/settings",
  },
];
