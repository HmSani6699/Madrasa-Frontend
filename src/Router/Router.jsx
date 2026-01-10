import { createBrowserRouter, Navigate } from "react-router-dom";
// import Login from "../Pages/Auth/Login";
import AuthLayout from "../layouts/AuthLayout";
import MainLayout from "../layouts/MainLayout";
import ProtectedRoute from "./ProtectedRoute";

// Role-Based Dashboards
import SuperAdminDashboard from "../Pages/SuperAdmin/Dashboard";
import MadrasaList from "../Pages/SuperAdmin/MadrasaList";
import Settings from "../Pages/SuperAdmin/Settings";
import AdminDashboard from "../Pages/Admin/Dashboard";
import Placeholder from "../Pages/Admin/Placeholder";
import { adminNavigation } from "../navigation/adminNavigation";
import { teacherNavigation } from "../navigation/teacherNavigation";
import { studentNavigation } from "../navigation/studentNavigation";
import { guardianNavigation } from "../navigation/guardianNavigation";
import { talimatNavigation } from "../navigation/talimatNavigation";
import { accountingNavigation } from "../navigation/accountingNavigation";
import TalimatDashboard from "../Pages/Talimat/Dashboard";
import AccountingDashboard from "../Pages/Accounting/Dashboard";
import TeachersDashboard from "../Pages/Teachers/Dashboard";
import StudentsDashboard from "../Pages/Students/Dashboard";
import StaffDashboard from "../Pages/Staff/Dashboard";
import MySchedule from "../Pages/Teachers/MySchedule";
import MarkAttendance from "../Pages/Teachers/MarkAttendance";
import HomeworkManager from "../Pages/Teachers/HomeworkManager";
import Gradebook from "../Pages/Teachers/Gradebook";
import MySubjects from "../Pages/Teachers/MySubjects";
import TeacherStudentList from "../Pages/Teachers/StudentList";
import NoticeBoard from "../Pages/Teachers/NoticeBoard";
import TeacherProfile from "../Pages/Teachers/Profile";
import TeacherExamSchedule from "../Pages/Teachers/ExamSchedule";
import TeacherAttendanceReport from "../Pages/Teachers/AttendanceReport";
import FrontendManager from "../pages/Admin/FrontendManager";
import OnlineAdmissionList from "../pages/Admin/OnlineAdmissionList";
import CreateAdmission from "../pages/Admin/CreateAdmission";
import StudentList from "../pages/Admin/StudentList";
import StudentProfile from "../pages/Admin/StudentProfile";
import DeactivatedStudentList from "../pages/Admin/DeactivatedStudentList";
import ParentList from "../pages/Admin/ParentList";
import DeactivatedParentList from "../pages/Admin/DeactivatedParentList";
import EmployeeList from "../pages/Admin/EmployeeList";
import DepartmentList from "../pages/Admin/DepartmentList";
import DesignationList from "../pages/Admin/DesignationList";
import DeactivatedEmployeeList from "../pages/Admin/DeactivatedEmployeeList";
import CreateEmployee from "../pages/Admin/CreateEmployee";
import StudentAttendance from "../Pages/Admin/StudentAttendance";
import EmployeeAttendance from "../Pages/Admin/EmployeeAttendance";
import SubjectWiseAttendance from "../Pages/Admin/SubjectWiseAttendance";
import ExamAttendance from "../Pages/Admin/ExamAttendance";
import ClassSectionList from "../Pages/Admin/ClassSectionList";
import ControlClass from "../Pages/Admin/ControlClass";
import AssignTeacher from "../Pages/Admin/AssignTeacher";
import SubjectList from "../Pages/Admin/SubjectList";
import ClassAssign from "../Pages/Admin/ClassAssign";
import ClassSchedule from "../Pages/Admin/ClassSchedule";
import TeacherSchedule from "../Pages/Admin/TeacherSchedule";
import HomeworkList from "../Pages/Admin/HomeworkList";
import HomeworkReport from "../Pages/Admin/HomeworkReport";
import ExamTerm from "../Pages/Admin/ExamTerm";
import ExamHall from "../Pages/Admin/ExamHall";
import ExamDistribution from "../Pages/Admin/ExamDistribution";
import ExamSetup from "../Pages/Admin/ExamSetup";
import MarksheetTemplate from "../Pages/Admin/MarksheetTemplate";
import ExamScheduleList from "../Pages/Admin/ExamScheduleList";
import AddExamSchedule from "../Pages/Admin/AddExamSchedule";
import MarkEntries from "../Pages/Admin/MarkEntries";
import GeneratePosition from "../Pages/Admin/GeneratePosition";
import GradesRange from "../Pages/Admin/GradesRange";
import IdCardTemplate from "../Pages/Admin/IdCardTemplate";
import StudentIdCard from "../Pages/Admin/StudentIdCard";
import EmployeeIdCard from "../Pages/Admin/EmployeeIdCard";
import AdmitCardTemplate from "../Pages/Admin/AdmitCardTemplate";
import GenerateAdmitCard from "../Pages/Admin/GenerateAdmitCard";
import CertificateTemplate from "../Pages/Admin/CertificateTemplate";
import GenerateStudentCertificate from "../Pages/Admin/GenerateStudentCertificate";
import GenerateEmployeeCertificate from "../Pages/Admin/GenerateEmployeeCertificate";
import ProductList from "../Pages/Admin/ProductList";
import CategoryList from "../Pages/Admin/CategoryList";
import StoreList from "../Pages/Admin/StoreList";
import SupplierList from "../Pages/Admin/SupplierList";
import UnitList from "../Pages/Admin/UnitList";
import PurchaseList from "../Pages/Admin/PurchaseList";
import SalesList from "../Pages/Admin/SalesList";
import IssueList from "../Pages/Admin/IssueList";
import LibraryManager from "../Pages/Admin/LibraryManager";
import EventsManager from "../Pages/Admin/EventsManager";
import MessageCenter from "../Pages/Admin/MessageCenter";
import StudentReports from "../Pages/Admin/StudentReports";
import FeesReports from "../Pages/Admin/FeesReports";
import FinancialReports from "../Pages/Admin/FinancialReports";
import AttendanceReports from "../Pages/Admin/AttendanceReports";
import ExamReports from "../Pages/Admin/ExamReports";
import InventoryReports from "../Pages/Admin/InventoryReports";
import SettingsPage from "../Pages/Admin/SettingsPage";
import DonationEntry from "../Pages/Accounting/DonationEntry";
import FeeCollection from "../Pages/Accounting/FeeCollection";
import PayrollProcess from "../Pages/Accounting/PayrollProcess";

// Guardian Pages
import ChildSelection from "../Pages/Guardian/ChildSelection";
import AcademicSummary from "../Pages/Guardian/AcademicSummary";
import FeesAndDues from "../Pages/Guardian/FeesAndDues";
import PaymentHistory from "../Pages/Guardian/PaymentHistory";
import ExamResults from "../Pages/Guardian/ExamResults";
import ProgressAnalytics from "../Pages/Guardian/ProgressAnalytics";
import GuardianAttendance from "../Pages/Guardian/Attendance";
import GuardianProfile from "../Pages/Guardian/Profile";
import GuardianDashboard from "../Pages/Guardian/Dashboard";

// Student Pages
import StudentSchedule from "../Pages/Students/Schedule";
import StudentSubjects from "../Pages/Students/Subjects";
import PendingTasks from "../Pages/Students/PendingTasks";
import SubmissionHistory from "../Pages/Students/SubmissionHistory";
import StudentExamSchedule from "../Pages/Students/ExamSchedule";
import StudentResults from "../Pages/Students/Results";
import StudentLibrary from "../Pages/Students/Library";
import EBooks from "../Pages/Students/EBooks";
import StudentProfilePage from "../Pages/Students/Profile";

// Helper to flatten routes
const flattenRoutes = (navItems) => {
  let routes = [];
  navItems.forEach(item => {
    if (item.path && item.path !== '/admin' && item.path !== '/teacher') {
      let element = <Placeholder title={item.name} />;
      
      // Map specific paths to their components
      if (item.path === "/admin/frontend") {
        element = <FrontendManager />;
      }
      if (item.path === "/admin/admissions/online") {
        element = <OnlineAdmissionList />;
      }
      if (item.path === "/admin/admission/create") {
        element = <CreateAdmission />;
      }
      if (item.path.startsWith("/admin/student/profile/")) {
        element = <StudentProfile />;
      }
      if (item.path === "/admin/student/list") {
        element = <StudentList />;
      }
      if (item.path === "/admin/student/deactive") {
        element = <DeactivatedStudentList />;
      }
      if (item.path === "/admin/parents/list") {
        element = <ParentList />;
      }
      if (item.path === "/admin/parents/deactive") {
        element = <DeactivatedParentList />;
      }
      if (item.path === "/admin/employee/list") {
        element = <EmployeeList />;
      }
      if (item.path === "/admin/employee/create") {
        element = <CreateEmployee />;
      }
      if (item.path === "/admin/employee/department") {
        element = <DepartmentList />;
      }
      if (item.path === "/admin/employee/designation") {
        element = <DesignationList />;
      }
      if (item.path === "/admin/employee/deactive") {
        element = <DeactivatedEmployeeList />;
      }
      if (item.path === "/admin/attendance/student") {
        element = <StudentAttendance />;
      }
      if (item.path === "/admin/attendance/employee") {
        element = <EmployeeAttendance />;
      }
      if (item.path === "/admin/attendance/subject") {
        element = <SubjectWiseAttendance />;
      }
      if (item.path === "/admin/attendance/exam") {
        element = <ExamAttendance />;
      }
      if (item.path === "/admin/academic/class-section") {
        element = <ClassSectionList />;
      }
      if (item.path === "/admin/academic/control-class") {
        element = <ControlClass />;
      }
      if (item.path === "/admin/academic/assign-teacher") {
        element = <AssignTeacher />;
      }
      if (item.path === "/admin/academic/subject") {
        element = <SubjectList />;
      }
      if (item.path === "/admin/academic/class-assign") {
        element = <ClassAssign />;
      }
      if (item.path === "/admin/academic/schedule/class") {
        element = <ClassSchedule />;
      }
      if (item.path === "/admin/academic/schedule/teacher") {
        element = <TeacherSchedule />;
      }
      if (item.path === "/admin/homework/list") {
        element = <HomeworkList />;
      }
      if (item.path === "/admin/homework/report") {
        element = <HomeworkReport />;
      }
      if (item.path === "/admin/exam/term") {
        element = <ExamTerm />;
      }
      if (item.path === "/admin/exam/hall") {
        element = <ExamHall />;
      }
      if (item.path === "/admin/exam/distribution") {
        element = <ExamDistribution />;
      }
      if (item.path === "/admin/exam/setup") {
        element = <ExamSetup />;
      }
      if (item.path === "/admin/exam/template") {
        element = <MarksheetTemplate />;
      }
      if (item.path === "/admin/exam/schedule/list") {
        element = <ExamScheduleList />;
      }
      if (item.path === "/admin/exam/schedule/add") {
        element = <AddExamSchedule />;
      }
      if (item.path === "/admin/exam/marks/entry") {
        element = <MarkEntries />;
      }
      if (item.path === "/admin/exam/marks/position") {
        element = <GeneratePosition />;
      }
      if (item.path === "/admin/exam/marks/grades") {
        element = <GradesRange />;
      }
      if (item.path === "/admin/card/template") {
        element = <IdCardTemplate />;
      }
      if (item.path === "/admin/card/student") {
        element = <StudentIdCard />;
      }
      if (item.path === "/admin/card/employee") {
        element = <EmployeeIdCard />;
      }
      if (item.path === "/admin/card/admit-template") {
        element = <AdmitCardTemplate />;
      }
      if (item.path === "/admin/card/admit-generate") {
        element = <GenerateAdmitCard />;
      }
      if (item.path === "/admin/certificate/template") {
        element = <CertificateTemplate />;
      }
      if (item.path === "/admin/certificate/student") {
        element = <GenerateStudentCertificate />;
      }
      if (item.path === "/admin/certificate/employee") {
        element = <GenerateEmployeeCertificate />;
      }
      if (item.path === "/admin/inventory/product") {
        element = <ProductList />;
      }
      if (item.path === "/admin/inventory/category") {
        element = <CategoryList />;
      }
      if (item.path === "/admin/inventory/store") {
        element = <StoreList />;
      }
      if (item.path === "/admin/inventory/supplier") {
        element = <SupplierList />;
      }
      if (item.path === "/admin/inventory/unit") {
        element = <UnitList />;
      }
      if (item.path === "/admin/inventory/purchase") {
        element = <PurchaseList />;
      }
      if (item.path === "/admin/inventory/sales") {
        element = <SalesList />;
      }
      if (item.path === "/admin/inventory/issue") {
        element = <IssueList />;
      }
      if (item.path === "/admin/library") {
        element = <LibraryManager />;
      }
      if (item.path === "/admin/events") {
        element = <EventsManager />;
      }
      if (item.path === "/admin/message") {
        element = <MessageCenter />;
      }
      
      // Accounting Routes Mapping
      if (item.path === "/admin/accounting/donation/create") {
        element = <DonationEntry />;
      }
      if (item.path === "/admin/accounting/fees/collect") {
        element = <FeeCollection />;
      }
      if (item.path === "/admin/accounting/payroll/process") {
        element = <PayrollProcess />;
      }
      
      // Reports
      if (item.path?.startsWith("/admin/reports/student")) {
        element = <StudentReports />;
      }
      if (item.path?.startsWith("/admin/reports/fees")) {
        element = <FeesReports />;
      }
      if (item.path?.startsWith("/admin/reports/finance")) {
        element = <FinancialReports />;
      }
      if (item.path?.startsWith("/admin/reports/attendance")) {
        element = <AttendanceReports />;
      }
      if (item.path?.startsWith("/admin/reports/exam")) {
        element = <ExamReports />;
      }
      if (item.path?.startsWith("/admin/reports/inventory")) {
        element = <InventoryReports />;
      }
      
      // Settings
      if (item.path === "/admin/settings") {
        element = <SettingsPage />;
      }

      // Teacher Routes Mapping
      if (item.path === "/teacher/academic/schedule") {
        element = <MySchedule />;
      }
      if (item.path === "/teacher/attendance/daily" || item.path === "/teacher/attendance/subject") {
        element = <MarkAttendance />;
      }
      if (item.path?.startsWith("/teacher/homework")) {
        element = <HomeworkManager />;
      }
      if (item.path === "/teacher/exam/marks") {
        element = <Gradebook />;
      }
      
      if (item.path === "/teacher/academic/subjects") {
        element = <MySubjects />;
      }
      if (item.path?.startsWith("/teacher/student")) {
        element = <TeacherStudentList />;
      }
      if (item.path?.startsWith("/teacher/notice")) {
        element = <NoticeBoard />;
      }
      
      if (item.path === "/teacher/exam/schedule") {
        element = <TeacherExamSchedule />;
      }
      if (item.path === "/teacher/attendance/report") {
        element = <TeacherAttendanceReport />;
      }
      
      // Secondary/Shared Teacher Routes
      if (item.path?.startsWith("/teacher/message")) {
        element = <MessageCenter />;
      }
      if (item.path?.startsWith("/teacher/library")) {
        element = <LibraryManager />;
      }
      if (item.path === "/teacher/profile") {
        element = <TeacherProfile />;
      }

      // Guardian Routes Mapping
      if (item.path === "/guardian/dashboard") element = <GuardianDashboard />;
      if (item.path === "/guardian/children/selection") element = <ChildSelection />;
      if (item.path === "/guardian/children/summary") element = <AcademicSummary />;
      if (item.path === "/guardian/finance/fees") element = <FeesAndDues />;
      if (item.path === "/guardian/finance/history") element = <PaymentHistory />;
      if (item.path === "/guardian/performance/results") element = <ExamResults />;
      if (item.path === "/guardian/performance/analytics") element = <ProgressAnalytics />;
      if (item.path === "/guardian/attendance") element = <GuardianAttendance />;
      if (item.path === "/guardian/notice") element = <NoticeBoard />;
      if (item.path === "/guardian/message") element = <MessageCenter />;
      if (item.path === "/guardian/profile") element = <GuardianProfile />;

      // Student Routes Mapping
      if (item.path === "/student/dashboard") element = <StudentsDashboard />;
      if (item.path === "/student/academic/schedule") element = <StudentSchedule />;
      if (item.path === "/student/academic/subjects") element = <StudentSubjects />;
      if (item.path === "/student/homework/pending") element = <PendingTasks />;
      if (item.path === "/student/homework/history") element = <SubmissionHistory />;
      if (item.path === "/student/exam/schedule") element = <StudentExamSchedule />;
      if (item.path === "/student/exam/results") element = <StudentResults />;
      if (item.path === "/student/library") element = <StudentLibrary />;
      if (item.path === "/student/library/ebooks") element = <EBooks />;
      if (item.path === "/student/notice") element = <NoticeBoard />;
      if (item.path === "/student/message") element = <MessageCenter />;
      if (item.path === "/student/profile") element = <StudentProfilePage />;

      routes.push({ path: item.path, element });
    }
    if (item.children) {
      routes = [...routes, ...flattenRoutes(item.children)];
    }
  });
  return routes;
};

import MadrasaPortal from "../Pages/Portal/MadrasaPortal";
import AboutUs from "../Pages/Portal/AboutUs";
import AdmissionGuidelines from "../Pages/Portal/AdmissionGuidelines";
import OnlineAdmissionForm from "../Pages/Portal/OnlineAdmissionForm";
import PortalLayout from "../layouts/PortalLayout";
import Login from "../pages/Auth/Login";
import AccountDeactivated from "../pages/Auth/AccountDeactivated";

const adminRoutes = flattenRoutes(adminNavigation);
const teacherRoutes = flattenRoutes(teacherNavigation);
const studentRoutes = flattenRoutes(studentNavigation);
const guardianRoutes = flattenRoutes(guardianNavigation);
const talimatRoutes = flattenRoutes(talimatNavigation);
const accountingRoutes = flattenRoutes(accountingNavigation);

const router = createBrowserRouter([
  {
    path: "/",
    element: <Navigate to="/login" replace />,
  },
  {
    path: "/portal/:slug",
    element: <PortalLayout />,
    children: [
      { index: true, element: <MadrasaPortal /> },
      { path: "about", element: <AboutUs /> },
      { path: "admission", element: <AdmissionGuidelines /> },
      { path: "online-admission", element: <OnlineAdmissionForm /> }
    ]
  },
  {
    element: <AuthLayout />,
    children: [
      {
        path: "/login",
        element: <Login />,
      },
      {
        path: "/account-deactivated",
        element: <AccountDeactivated />,
      },
    ],
  },
  {
    element: <ProtectedRoute />, // Wrap with Main Layout
    children: [
      {
        element: <MainLayout />,
        children: [
          // Super Admin Routes
          {
            element: <ProtectedRoute allowedRoles={["super_admin"]} />,
            children: [
              { path: "/super-admin", element: <SuperAdminDashboard /> },
              { path: "/super-admin/madrasas", element: <MadrasaList /> },
              { path: "/super-admin/settings", element: <Settings /> },
            ],
          },
          // Admin (Muhtamim) Routes - accessible by talimat and accountant for specific modules
          {
            element: <ProtectedRoute allowedRoles={["admin", "talimat", "accountant"]} />,
            children: [
              { path: "/admin", element: <AdminDashboard /> },
              { path: "/admin/student/profile/:id", element: <StudentProfile /> },
              ...adminRoutes
            ],
          },
          // Talimat Routes
          {
            element: <ProtectedRoute allowedRoles={["talimat", "admin"]} />,
            children: [
              { path: "/talimat", element: <TalimatDashboard /> },
              ...talimatRoutes
            ],
          },
          // Accounting Routes
          {
            element: <ProtectedRoute allowedRoles={["accountant", "admin"]} />,
            children: [
              { path: "/accounting", element: <AccountingDashboard /> },
              ...accountingRoutes
            ],
          },
          // Other Roles
           {
             element: <ProtectedRoute allowedRoles={["teacher", "admin", "talimat"]} />,
             children: [
               { path: "/teacher", element: <TeachersDashboard /> },
               ...teacherRoutes
             ],
           },
           {
             element: <ProtectedRoute allowedRoles={["student"]} />,
             children: [
               { path: "/student", element: <Navigate to="/student/dashboard" replace /> },
               { path: "/student/dashboard", element: <StudentsDashboard /> },
               ...studentRoutes
             ],
           },
           {
             element: <ProtectedRoute allowedRoles={["guardian"]} />,
             children: [
               { path: "/guardian", element: <Navigate to="/guardian/dashboard" replace /> },
               ...guardianRoutes
             ],
           },
           { path: "/students", element: <StudentsDashboard /> },
           { path: "/staff", element: <StaffDashboard /> },
        ],
      },
    ],
  },
  {
    path: "/unauthorized",
    element: <div className="p-10 text-center"><h1>Unauthorized Access</h1><a href="/login" className="text-blue-500">Go to Login</a></div>
  },
  {
    path: "*",
    element: <div className="p-10 text-center"><h1>404 - Page Not Found</h1></div>
  }
]);

export default router;
