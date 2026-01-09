import { 
    LayoutDashboard, 
    BookOpen, 
    Calendar, 
    FileText, 
    Users, 
    ClipboardCheck, 
    Award,
    PenTool,
    GraduationCap,
    Library,
    MessageSquare,
    Settings,
    Clock,
    UserCheck,
    ScrollText
  } from "lucide-react";
  
  // Reusing Teacher Navigation items where applicable, but defining explicitly for clarity and customizability
  export const talimatNavigation = [
    {
      name: "Overview",
      path: "/talimat",
      icon: LayoutDashboard,
    },
    {
      name: "Academic Control",
      icon: GraduationCap,
      children: [
        { name: "Class Scheduling", path: "/admin/academic/schedule/class", icon: Calendar }, // Reusing Admin page for full control
        { name: "Teacher Routine", path: "/admin/academic/schedule/teacher", icon: Clock },
        { name: "Assign Teachers", path: "/admin/academic/assign-teacher", icon: UserCheck },
        { name: "Subject Manager", path: "/admin/academic/subject", icon: BookOpen },
      ]
    },
    {
      name: "My Curriculum", // Teacher Feature
      icon: BookOpen,
      children: [
        { name: "My Schedule", path: "/teacher/academic/schedule", icon: Calendar },
        { name: "Assigned Subjects", path: "/teacher/academic/subjects", icon: BookOpen },
      ]
    },
    {
      name: "Examinations",
      icon: ScrollText,
      children: [
        { name: "Exam Setup", path: "/admin/exam/setup", icon: Settings },
        { name: "Hall Management", path: "/admin/exam/hall", icon: Users },
        { name: "Marks Entry", path: "/teacher/exam/marks", icon: PenTool }, // Can enter marks
        { name: "Result Cards", path: "/admin/exam/marks/position", icon: Award },
        { name: "Tabulation Sheet", path: "/admin/reports/exam", icon: FileText },
      ]
    },
    {
      name: "Students",
      icon: Users,
      children: [
        { name: "Student List", path: "/teacher/student/list", icon: Users },
        { name: "Attendance Log", path: "/teacher/attendance/report", icon: ClipboardCheck },
      ]
    },
    {
      name: "Campus Library",
      path: "/teacher/library",
      icon: Library,
    },
    {
      name: "Communication",
      path: "/teacher/message",
      icon: MessageSquare,
    },
    {
      name: "Profile",
      path: "/teacher/profile", // Can use Teacher profile or create specific one
      icon: UserCheck,
    },
  ];
