import { useState, useRef, useEffect } from "react";
import { 
  Bell, 
  MessageSquare, 
  Maximize,
  Minimize,
  Menu,
  Moon,
  Sun,
  User,
  Settings,
  LogOut,
  ChevronDown,
  Globe
} from "lucide-react";
import { useAuth } from "../context/AuthContext";
import { useTheme } from "../context/ThemeContext";

import { Link } from "react-router";
import { useTranslation } from "react-i18next";

const Navbar = ({ onMenuClick }) => {
  const { user, logout } = useAuth();
   const { theme, toggleTheme } = useTheme();
   const { t, i18n } = useTranslation();
   const [isFullScreen, setIsFullScreen] = useState(false);
   const [activeDropdown, setActiveDropdown] = useState(null);
   
   const dropdownRef = useRef(null);
 
   const toggleFullScreen = () => {
     if (!document.fullscreenElement) {
       document.documentElement.requestFullscreen();
       setIsFullScreen(true);
     } else {
       if (document.exitFullscreen) {
         document.exitFullscreen();
         setIsFullScreen(false);
       }
     }
   };
 
   useEffect(() => {
     const handleClickOutside = (event) => {
       if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
         setActiveDropdown(null)
       }
     };
     document.addEventListener("mousedown", handleClickOutside);
     return () => document.removeEventListener("mousedown", handleClickOutside);
   }, []);
 
   const toggleDropdown = (name) => {
     setActiveDropdown(activeDropdown === name ? null : name);
   };
 
   const notifications = [
     { title: "New Admission", time: "5 min ago", desc: "A new student has registered." },
     { title: "Staff Leave", time: "1 hour ago", desc: "Teacher Omar requested leave." },
     { title: "Fee Collection", time: "2 hours ago", desc: "Daily collection report is ready." },
   ];
 
   const messages = [
     { from: "Principal Office", time: "10:30 AM", msg: "Meeting at 2:00 PM today." },
     { from: "Accounts", time: "Yesterday", msg: "Monthly budget needs review." },
   ];
 
   return (
     <header className="h-[73px] bg-surface/80 backdrop-blur-md border-b border-border flex items-center justify-between px-4 md:px-6 fixed top-0 right-0 left-0 md:left-72 z-30 transition-all duration-300">
       <div className="flex items-center gap-4">
         <button 
           onClick={onMenuClick}
           className="md:hidden p-2 text-fg-muted hover:text-primary hover:bg-primary/5 rounded-xl transition-all"
         >
           <Menu className="w-6 h-6" />
         </button>
         
         <Link 
           to="/portal/global-international" 
           target="_blank"
           className="hidden sm:flex items-center gap-2 px-3 py-1.5 bg-primary/5 text-primary hover:bg-primary/10 rounded-xl transition-all border border-primary/10"
         >
           <Globe className="w-4 h-4" />
           <span className="text-xs font-bold uppercase tracking-wider">{t('navbar.view_portal')}</span>
         </Link>
       </div>
 
       <div className="flex items-center gap-2 md:gap-4 ml-auto" ref={dropdownRef}>
         <div className="flex items-center gap-1 md:gap-2 pr-2 md:pr-4 border-r border-border">
            {/* Language Switcher */}
            {/* Language Switcher Dropdown */}
            <div className="relative">
              <button 
                onClick={() => toggleDropdown('language')}
                className={`flex items-center gap-2 px-3 py-2 rounded-xl transition-all font-bold text-xs uppercase ${activeDropdown === 'language' ? 'bg-primary/10 text-primary' : 'text-fg-muted hover:text-primary hover:bg-primary/5'}`}
                title="Switch Language"
              >
                <Globe className="w-4 h-4" />
                <span>{i18n.language === 'en' ? 'English' : 'বাংলা'}</span>
                <ChevronDown className={`w-3 h-3 transition-transform ${activeDropdown === 'language' ? 'rotate-180' : ''}`} />
              </button>

              {activeDropdown === 'language' && (
                <div className="absolute right-0 top-full mt-3 w-40 bg-surface rounded-2xl shadow-xl border border-border py-2 animate-fade-in-down origin-top-right overflow-hidden z-50">
                  <button 
                    onClick={() => {
                      i18n.changeLanguage('bn');
                      setActiveDropdown(null);
                    }}
                    className={`w-full text-left px-4 py-2 text-sm font-medium hover:bg-primary/5 transition-colors ${i18n.language === 'bn' ? 'text-primary' : 'text-fg-muted'}`}
                  >
                    বাংলা (Bengali)
                  </button>
                  <button 
                    onClick={() => {
                      i18n.changeLanguage('en');
                      setActiveDropdown(null);
                    }}
                    className={`w-full text-left px-4 py-2 text-sm font-medium hover:bg-primary/5 transition-colors ${i18n.language === 'en' ? 'text-primary' : 'text-fg-muted'}`}
                  >
                    English
                  </button>
                </div>
              )}
            </div>
 
            <button 
              onClick={toggleTheme}
              className="p-2.5 text-fg-muted hover:text-primary hover:bg-primary/5 rounded-xl transition-all"
            >
              {theme === "light" ? <Moon className="w-5 h-5" /> : <Sun className="w-5 h-5 text-amber-500" />}
            </button>

           <div className="relative">
             <button 
               onClick={() => toggleDropdown('notifications')}
               className={`p-2.5 rounded-xl transition-all ${activeDropdown === 'notifications' ? 'bg-primary/10 text-primary' : 'text-fg-muted hover:text-primary hover:bg-primary/5'}`}
             >
               <Bell className="w-5 h-5" />
             </button>
             <span className="absolute top-2 right-2 w-2 h-2 bg-red-500 border-2 border-surface rounded-full ring-1 ring-red-500/20"></span>
             
             {activeDropdown === 'notifications' && (
               <div className="absolute right-0 mt-3 w-80 bg-surface rounded-2xl shadow-xl border border-border py-4 animate-fade-in-down origin-top-right overflow-hidden z-50">
                  <div className="px-5 pb-3 border-b border-border flex items-center justify-between">
                    <h3 className="font-bold text-fg-main">{t("navbar.notifications")}</h3>
                    <span className="text-[10px] font-bold text-primary bg-primary/5 px-2 py-0.5 rounded-full">3 {t("navbar.new")}</span>
                  </div>
                  <div className="max-h-[300px] overflow-y-auto custom-scrollbar">
                    {notifications.map((n, i) => (
                      <div key={i} className="px-5 py-3 hover:bg-gray-50 dark:hover:bg-slate-700/50 cursor-pointer transition-colors border-b border-border last:border-0">
                        <div className="flex items-start justify-between mb-1">
                          <p className="text-sm font-bold text-fg-main">{n.title}</p>
                          <span className="text-[10px] text-fg-muted font-medium">{n.time}</span>
                        </div>
                        <p className="text-xs text-fg-muted leading-relaxed line-clamp-2">{n.desc}</p>
                      </div>
                    ))}
                  </div>
                  <div className="px-5 pt-3 mt-1 text-center border-t border-border">
                    <button className="text-xs font-bold text-primary hover:underline">{t("navbar.view_all_notifications")}</button>
                  </div>
               </div>
             )}
           </div>

           <div className="relative">
             <button 
               onClick={() => toggleDropdown('messages')}
               className={`p-2.5 rounded-xl transition-all ${activeDropdown === 'messages' ? 'bg-primary/10 text-primary' : 'text-fg-muted hover:text-primary hover:bg-primary/5'}`}
             >
               <MessageSquare className="w-5 h-5" />
             </button>
             <span className="absolute top-2 right-2 w-2 h-2 bg-blue-500 border-2 border-surface rounded-full ring-1 ring-blue-500/20"></span>

             {activeDropdown === 'messages' && (
               <div className="absolute right-0 mt-3 w-80 bg-surface rounded-2xl shadow-xl border border-border py-4 animate-fade-in-down origin-top-right overflow-hidden z-50">
                  <div className="px-5 pb-3 border-b border-border flex items-center justify-between">
                    <h3 className="font-bold text-fg-main">{t("navbar.messages")}</h3>
                    <span className="text-[10px] font-bold text-blue-500 bg-blue-50 dark:bg-blue-900/30 px-2 py-0.5 rounded-full">2 {t("navbar.new")}</span>
                  </div>
                  <div className="max-h-[300px] overflow-y-auto custom-scrollbar">
                    {messages.map((m, i) => (
                      <div key={i} className="px-5 py-4 hover:bg-gray-50 dark:hover:bg-slate-700/50 cursor-pointer transition-colors border-b border-border last:border-0">
                        <div className="flex items-center gap-3">
                          <div className="w-10 h-10 rounded-full bg-blue-100 dark:bg-blue-900/40 flex items-center justify-center text-blue-600 dark:text-blue-400 font-bold shrink-0">
                            {m.from[0]}
                          </div>
                          <div className="flex-1 min-w-0">
                            <div className="flex items-center justify-between mb-1">
                              <p className="text-sm font-bold text-fg-main truncate">{m.from}</p>
                              <span className="text-[10px] text-fg-muted font-medium shrink-0">{m.time}</span>
                            </div>
                            <p className="text-xs text-fg-muted truncate">{m.msg}</p>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                  <div className="px-5 pt-3 mt-1 text-center border-t border-border">
                    <button className="text-xs font-bold text-primary hover:underline">{t("navbar.see_all_messages")}</button>
                  </div>
               </div>
             )}
           </div>

           <button 
             onClick={toggleFullScreen}
             className="hidden lg:flex p-2.5 text-fg-muted hover:text-primary hover:bg-primary/5 rounded-xl transition-all"
           >
             {isFullScreen ? <Minimize className="w-5 h-5" /> : <Maximize className="w-5 h-5" />}
           </button>
        </div>

        <div className="flex items-center gap-3 pl-2 relative">
            <div 
              onClick={() => toggleDropdown('profile')}
              className="relative cursor-pointer group"
            >
              <div className="w-10 h-10 rounded-xl overflow-hidden border-2 border-border group-hover:border-primary/30 transition-all shadow-sm">
                {user?.avatar ? (
                  <img src={user.avatar} alt={user?.name} className="w-full h-full object-cover" />
                ) : (
                  <div className="w-full h-full bg-primary/10 flex items-center justify-center text-primary font-bold">
                    {user?.name?.[0] || 'U'}
                  </div>
                )}
              </div>
              <span className="absolute bottom-[-2px] right-[-2px] w-3 h-3 bg-green-500 border-2 border-surface rounded-full"></span>
            </div>
            
            <div 
              onClick={() => toggleDropdown('profile')}
              className="hidden sm:flex flex-col cursor-pointer group"
            >
              <div className="flex items-center gap-1">
                <span className="text-sm font-bold text-fg-main leading-none mb-1 group-hover:text-primary transition-colors">{user?.name}</span>
                <ChevronDown className={`w-3 h-3 text-fg-muted transition-transform ${activeDropdown === 'profile' ? 'rotate-180' : ''}`} />
              </div>
              <span className="text-[10px] text-fg-muted font-semibold uppercase tracking-wider">{user?.role?.replace('_', ' ')}</span>
            </div>

            {activeDropdown === 'profile' && (
               <div className="absolute right-0 top-full mt-3 w-56 bg-surface rounded-2xl shadow-xl border border-border py-3 animate-fade-in-down origin-top-right overflow-hidden z-50">
                  <div className="px-4 py-2 border-b border-border mb-2">
                    <p className="text-xs font-semibold text-fg-muted uppercase tracking-wider">{t("navbar.account")}</p>
                  </div>
                  <button className="w-full flex items-center gap-3 px-4 py-2 text-sm text-fg-muted hover:bg-gray-50 dark:hover:bg-slate-700/50 hover:text-primary transition-all">
                    <User className="w-4 h-4" />
                    <span>{t("navbar.profile")}</span>
                  </button>
                  <button className="w-full flex items-center gap-3 px-4 py-2 text-sm text-fg-muted hover:bg-gray-50 dark:hover:bg-slate-700/50 hover:text-primary transition-all">
                    <Settings className="w-4 h-4" />
                    <span>{t("navbar.settings")}</span>
                  </button>
                  <div className="h-[1px] bg-border my-2 mx-4" />
                  <button 
                    onClick={logout}
                    className="w-full flex items-center gap-3 px-4 py-2 text-sm text-red-500 hover:bg-red-50 dark:hover:bg-red-950/30 transition-all font-medium"
                  >
                    <LogOut className="w-4 h-4" />
                    <span>{t("navbar.sign_out")}</span>
                  </button>
                 </div>
            )}
        </div>
      </div>

    </header>
  );
};

export default Navbar;
