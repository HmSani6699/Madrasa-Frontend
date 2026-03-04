import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import "./index.css";
import { RouterProvider } from "react-router-dom";
import router from "./Router/Router.jsx";
import "./i18n"; // Initialize i18n
import { AuthProvider } from "./context/AuthContext";
import { ThemeProvider } from "./context/ThemeContext";
import { PortalSettingsProvider } from "./context/PortalSettingsContext";

import { Toaster } from "react-hot-toast";

createRoot(document.getElementById("root")).render(
  <StrictMode>
    <AuthProvider>
      <ThemeProvider>
        <PortalSettingsProvider>
          <Toaster position="top-right" reverseOrder={false} />
          <RouterProvider router={router} />
        </PortalSettingsProvider>
      </ThemeProvider>
    </AuthProvider>
  </StrictMode>
);
