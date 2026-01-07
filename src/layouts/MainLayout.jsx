import { useState } from "react";
import { Outlet } from "react-router";
import { Menu, X } from "lucide-react";
import Sidebar from "../components/Sidebar";
import Navbar from "../components/Navbar";

const MainLayout = () => {
  const [isMobileSidebarOpen, setIsMobileSidebarOpen] = useState(false);

  return (
    <div className="min-h-screen bg-background flex transition-colors duration-300">
      {/* Mobile Sidebar Overlay */}
      {isMobileSidebarOpen && (
        <div 
          className="fixed inset-0 bg-gray-900/60 z-40 md:hidden backdrop-blur-[2px] transition-all duration-300 animate-in fade-in"
          onClick={() => setIsMobileSidebarOpen(false)}
        />
      )}

      {/* Sidebar - Passed mobile state */}
      <Sidebar 
        isMobileOpen={isMobileSidebarOpen} 
        closeMobile={() => setIsMobileSidebarOpen(false)} 
      />

      <div className="flex-1 md:ml-72 flex flex-col min-h-screen transition-all duration-300 w-full overflow-x-hidden pt-[73px]">
        {/* Top Navbar */}
        <Navbar onMenuClick={() => setIsMobileSidebarOpen(true)} />

        {/* Main Content Area */}
        <main className="flex-1 p-4 md:p-8">
          <div className="max-w-7xl mx-auto">
            <Outlet />
          </div>
        </main>
      </div>
    </div>
  );
};

export default MainLayout;
