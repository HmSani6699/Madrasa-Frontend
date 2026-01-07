import { createBrowserRouter, Navigate } from "react-router";
import Login from "../Pages/Auth/Login";
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
import TalimatDashboard from "../Pages/Talimat/Dashboard";
import AccountingDashboard from "../Pages/Accounting/Dashboard";
import TeachersDashboard from "../Pages/Teachers/Dashboard";
import StudentsDashboard from "../Pages/Students/Dashboard";
import StaffDashboard from "../Pages/Staff/Dashboard";
import FrontendManager from "../Pages/Admin/FrontendManager";

// Helper to flatten routes
const flattenRoutes = (navItems) => {
  let routes = [];
  navItems.forEach(item => {
    if (item.path && item.path !== '/admin') {
      let element = <Placeholder title={item.name} />;
      
      // Map specific paths to their components
      if (item.path === "/admin/frontend") {
        element = <FrontendManager />;
      }

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
import PortalLayout from "../layouts/PortalLayout";

const adminRoutes = flattenRoutes(adminNavigation);

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
      { path: "about", element: <AboutUs /> }
    ]
  },
  {
    element: <AuthLayout />,
    children: [
      {
        path: "/login",
        element: <Login />,
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
          // Admin (Muhtamim) Routes
          {
            element: <ProtectedRoute allowedRoles={["admin"]} />,
            children: [
              { path: "/admin", element: <AdminDashboard /> },
              ...adminRoutes
            ],
          },
          // Talimat Routes
          {
            element: <ProtectedRoute allowedRoles={["talimat", "admin"]} />,
            children: [
              { path: "/talimat", element: <TalimatDashboard /> },
            ],
          },
          // Accounting Routes
          {
            element: <ProtectedRoute allowedRoles={["accountant", "admin"]} />,
            children: [
              { path: "/accounting", element: <AccountingDashboard /> },
            ],
          },
          // Other Roles
           { path: "/teachers", element: <TeachersDashboard /> },
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
