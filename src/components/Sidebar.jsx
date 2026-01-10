import { useState } from "react";
import { NavLink, useLocation } from "react-router";
import { useAuth } from "../context/AuthContext";
import { 
  LayoutDashboard, 
  Settings, 
  LogOut,
  Building2,
  ChevronDown,
  ChevronRight,
  Circle,
  X
} from "lucide-react";
import { adminNavigation } from "../navigation/adminNavigation";
import { teacherNavigation } from "../navigation/teacherNavigation";
import { studentNavigation } from "../navigation/studentNavigation";
import { guardianNavigation } from "../navigation/guardianNavigation";
import { talimatNavigation } from "../navigation/talimatNavigation";
import { accountingNavigation } from "../navigation/accountingNavigation";
import { useTranslation } from "react-i18next";
import MadrasaSwitcher from "./MadrasaSwitcher";

const SidebarItem = ({ item, level = 0 }) => {
  const [isOpen, setIsOpen] = useState(false);
  const location = useLocation();
  const { t } = useTranslation();
  const hasChildren = item.children && item.children.length > 0;
  const isActive = item.path && location.pathname === item.path;
  
  // Helper to generate translation keys from English names
  const getTransKey = (name) => {
    const key = name.toLowerCase().replace(/ /g, '_').replace(/&/g, '').replace(/_+/g, '_');
    return `sidebar.${key}`;
  };

  const isChildActive = (children) => {
    if (!children) return false;
    return children.some(child => 
      (child.path && location.pathname === child.path) || isChildActive(child.children)
    );
  };
  
  const activeChild = isChildActive(item.children);

  useState(() => {
    if (hasChildren && activeChild) {
      setIsOpen(true);
    }
  }, []);

  if (hasChildren) {
    return (
      <div className="mb-1">
        <button
          onClick={() => setIsOpen(!isOpen)}
          className={`w-full flex items-center justify-between px-3 py-2.5 rounded-xl transition-all duration-200 group text-[14px] ${
            activeChild
              ? "bg-primary/5 dark:bg-primary/10 text-primary font-semibold"
              : "text-fg-secondary hover:bg-primary/5 dark:hover:bg-primary/10 hover:text-primary"
          }`}
        >
           <div className="flex items-center gap-3">
             {item.icon ? (
                <div className={`w-8 h-8 rounded-lg flex items-center justify-center transition-all duration-200 ${
                  activeChild 
                    ? "bg-primary/10 dark:bg-primary/20 text-primary shadow-sm" 
                    : "text-fg-secondary group-hover:bg-primary/10 dark:group-hover:bg-primary/20 group-hover:text-primary"
                }`}>
                  <item.icon className="w-[18px] h-[18px]" />
                </div>
             ) : (
               <div className="w-8" />
             )}
             <span className="truncate font-medium">{t(getTransKey(item.name), item.name)}</span>
           </div>
           {isOpen ? <ChevronDown className="w-3.5 h-3.5 text-fg-secondary group-hover:text-primary" /> : <ChevronRight className="w-3.5 h-3.5 text-fg-secondary group-hover:text-primary" />}
        </button>
        {isOpen && (
            <div className="mt-1 space-y-1 animate-fade-in-down origin-top overflow-hidden pl-4">
                {item.children.map((child, index) => (
                    <SidebarItem key={index} item={child} level={level + 1} />
                ))}
            </div>
        )}
      </div>
    );
  }

  return (
    <NavLink
      to={item.path}
      end
      className={({ isActive }) =>
        `flex items-center gap-3 px-3 py-2.5 rounded-xl transition-all duration-200 group text-[14px] ${
          isActive
            ? "bg-primary/5 dark:bg-primary/10 text-primary font-semibold"
            : level > 0 
              ? "text-fg-secondary hover:text-primary ml-5"
              : "text-fg-secondary hover:bg-primary/5 dark:hover:bg-primary/10 hover:text-primary"
        }`
      }
    >
      {item.icon ? (
        <div className={`w-8 h-8 rounded-lg flex items-center justify-center transition-all duration-200 ${
          location.pathname === item.path 
            ? "bg-primary/10 dark:bg-primary/20 text-primary shadow-sm" 
            : "text-fg-secondary group-hover:bg-primary/10 dark:group-hover:bg-primary/20 group-hover:text-primary"
        }`}>
           <item.icon className="w-[18px] h-[18px]" />
        </div>
      ) : level > 0 ? (
        <div className="flex items-center gap-3">
           <div className={`w-[6px] h-[6px] rounded-full transition-all duration-300 ${location.pathname === item.path ? "bg-primary scale-125 ring-4 ring-primary/10 dark:ring-primary/20" : "bg-gray-300 dark:bg-slate-600 group-hover:bg-primary group-hover:ring-4 group-hover:ring-primary/10 dark:group-hover:ring-primary/20"}`} />
        </div>
      ) : (
        <div className="w-8" />
      )}
      <span className="truncate font-medium">{t(getTransKey(item.name), item.name)}</span>
    </NavLink>
  );
};

const Sidebar = ({ isMobileOpen, closeMobile }) => {
  const { user, logout } = useAuth();
  const { t } = useTranslation();
  
  const superAdminLinks = [
    { title: "Main", links: [
      { name: "Dashboard", path: "/super-admin", icon: LayoutDashboard },
      { name: "Madrasas", path: "/super-admin/madrasas", icon: Building2 },
    ]},
    { title: "Settings", links: [
      { name: "Settings", path: "/super-admin/settings", icon: Settings },
    ]}
  ];

  const adminLinks = [
    { title: "Main", links: adminNavigation.slice(0, 1) },
    { title: "Academic", links: adminNavigation.slice(1, 10) },
    { title: "Management", links: adminNavigation.slice(10) }
  ];

  const teacherLinks = [
    { title: "Main", links: teacherNavigation.slice(0, 1) },
    { title: "Academic", links: teacherNavigation.slice(1, 5) },
    { title: "Others", links: teacherNavigation.slice(5) }
  ];

  const getLinks = () => {
    switch (user?.role) {
      case "super_admin":
        return superAdminLinks;
      case "admin":
        return adminLinks;
      case "teacher":
        return teacherLinks;
      case "student":
        return [{ title: "Student Portal", links: studentNavigation }];
      case "guardian":
        return [{ title: "Guardian Portal", links: guardianNavigation }];
      case "talimat":
        return [{ title: "Education Secretary", links: talimatNavigation }];
      case "accountant":
        return [{ title: "Accountant Portal", links: accountingNavigation }];
      default:
        return [{ title: "Main", links: [{ name: "Dashboard", path: "/teacher", icon: LayoutDashboard }] }];
    }
  };

  const sections = getLinks();

  const sidebarClasses = `
    fixed inset-y-0 left-0 z-50 w-72 bg-surface border-r border-border flex flex-col transform transition-all duration-300 ease-in-out md:translate-x-0
    ${isMobileOpen ? "translate-x-0" : "-translate-x-full"}
  `;

  return (
    <aside className={sidebarClasses}>
      {/* Header */}
      <div className="p-6 flex items-center justify-between h-[73px]">
        <div className="flex items-center gap-3">
            <div className="w-9 h-9 bg-primary rounded-xl flex items-center justify-center text-white font-bold shadow-lg shadow-primary/20">
              M
            </div>
            <span className="font-bold text-xl text-fg-main tracking-tight">MMS SaaS</span>
        </div>
        <button 
          onClick={closeMobile} 
          className="md:hidden p-2 text-fg-muted hover:text-red-500 hover:bg-red-50 rounded-lg transition-all"
        >
          <X className="w-5 h-5" />
        </button>
      </div>

      {/* Organization Card */}
      <div className="px-5 mb-6">
        <MadrasaSwitcher />
      </div>

      {/* Navigation */}
      <nav className="flex-1 overflow-y-auto px-4 custom-scrollbar space-y-6">
        {sections.map((section, sIndex) => (
          <div key={sIndex}>
            <div className="flex items-center gap-3 px-3 mb-3">
              <span className="text-[11px] font-bold text-fg-muted uppercase tracking-widest">{t(`sidebar.${section.title.toLowerCase().replace(/ /g, '_')}`, section.title)}</span>
              <div className="h-[1px] flex-1 bg-border" />
            </div>
            <div className="space-y-0.5">
              {section.links.map((link, index) => (
                <div key={index} onClick={() => window.innerWidth < 768 && !link.children && closeMobile()}> 
                  <SidebarItem item={link} />
                </div>
              ))}
            </div>
          </div>
        ))}
      </nav>

      {/* Footer / Logout only */}
      <div className="p-4 border-t border-border mt-auto">
        <button
          onClick={logout}
          className="w-full flex items-center justify-center gap-2 px-4 py-2.5 text-sm font-medium text-red-600 hover:bg-red-50 dark:hover:bg-red-900/10 rounded-xl transition-all duration-200 border border-transparent hover:border-red-100 dark:hover:border-red-900/30"
        >
          <LogOut className="w-4 h-4" />
          {t('navbar.sign_out')}
        </button>
      </div>
    </aside>
  );
};

export default Sidebar;
