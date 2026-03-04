import { useState, useEffect, useRef } from "react";
import { Outlet, Link, useLocation, useParams } from "react-router";
import { 
  Phone, 
  Mail, 
  Facebook, 
  Twitter, 
  Youtube,
  Instagram,
  Menu,
  X,
  LogInIcon
} from "lucide-react";
import { usePortalSettings } from "../context/PortalSettingsContext";

const PortalLayout = () => {
  const { settings } = usePortalSettings();
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [activeSection, setActiveSection] = useState("hero");
  const location = useLocation();
  const observer = useRef(null);

  useEffect(() => {
    // Only run intersection observer on the portal home page sections
    // This assumes the sections exist on the home page (MadrasaPortal)
    const options = {
      root: null,
      rootMargin: "-20% 0px -60% 0px",
      threshold: [0, 0.1, 0.2]
    };

    const handleIntersect = (entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          setActiveSection(entry.target.id);
        }
      });
    };

    observer.current = new IntersectionObserver(handleIntersect, options);

    const sections = ["hero", "about", "academic", "students", "teachers", "gallery", "photos"];
    sections.forEach((id) => {
      const el = document.getElementById(id);
      if (el) observer.current.observe(el);
    });

    return () => {
      if (observer.current) observer.current.disconnect();
    };
  }, [location.pathname]);

  const navItems = [
    // { id: "hero", label: "হোম" },
    { id: "academic", label: "ক্লাস কারিকুলাম" },
    { id: "students", label: "শিক্ষার্থী" },
    { id: "teachers", label: "শিক্ষক" },
  ];

const { slug } = useParams();
  
  


  return (
    <div className="min-h-screen bg-white transition-colors duration-300 font-sans">
      {/* Navigation Group (Top Bar + Header) */}
      <div className="relative z-[100]">
      

        {/* 2. Header / Navigation (White) - Sticky */}
        <header className="bg-white py-4 shadow-md sticky top-0 z-[100] border-b border-slate-100">
          <div className="max-w-[1440px] mx-auto px-6 flex items-center justify-between">
            {/* Left Column (Branding) */}
            <div className="flex items-center">
               <Link to={`/${slug}`} className="flex items-center gap-3 md:gap-5 group">
                  {/* Larger Logo */}
                  <div className="w-10 h-10 md:w-14 md:h-14 bg-white rounded-full p-1 border border-slate-200 shadow-sm group-hover:border-[#059669] transition-all">
                     <div className="w-full h-full bg-[#059669] rounded-full flex items-center justify-center text-white text-[10px] md:text-sm font-black italic shadow-inner">{settings.branding.logoText}</div>
                  </div>
                  
                  {/* Name and Tagline Column */}
                  <div className="flex flex-col justify-center">
                     <h1 className="text-lg md:text-2xl lg:text-3xl font-black text-[#042f2c] tracking-tight italic leading-tight">{settings.branding.name}</h1>
                     <p className="hidden xs:block text-[8px] md:text-[10px] font-bold text-slate-400 uppercase tracking-[0.3em] leading-none mt-1">{settings.branding.tagline}</p>
                  </div>
               </Link>
            </div>

            

            {/* Desktop Navigation */}
            <nav className="hidden lg:flex items-center gap-6 text-[14px] font-black text-slate-700 uppercase tracking-widest leading-loose">
               <Link to={`/${slug}`}>হোম </Link>
               {navItems.map((item) => (
                  <a 
                    key={item.id}
                    href={`#${item.id}`} 
                    className={`transition-all whitespace-nowrap  ${
                      activeSection === item.id 
                        ? "text-[#059669] border-b-2 border-[#059669]" 
                        : "hover:text-[#059669] border-b-2 border-transparent"
                    }`}
                  >
                    {item.label}
                  </a>
               ))}
              <Link to={`/${slug}/online-admission`}>অনলাইন ভর্তি</Link>

            
           
          <Link to={'/login'}> <button 
             
             className="flex items-center gap-2 px-6 py-2 text-sm font-bold bg-primary text-white rounded-[8px] shadow-lg shadow-primary/20 hover:scale-[1.02] transition-all"
           >
             <LogInIcon className="w-4 h-4" />
          Login
           </button></Link>
      
            </nav>

            {/* Mobile Menu Button */}
            <button 
              onClick={() => setIsMenuOpen(!isMenuOpen)}
              className="lg:hidden p-2 text-slate-600 hover:text-[#059669] transition-colors"
            >
              {isMenuOpen ? <X className="w-8 h-8" /> : <Menu className="w-8 h-8" />}
            </button>
          </div>

          {/* Mobile Navigation Menu Overlay */}
          <div className={`lg:hidden fixed inset-0 top-[110px] bg-white z-[90] transition-all duration-350 border-t border-slate-100 ${isMenuOpen ? "opacity-100 translate-x-0" : "opacity-0 translate-x-full pointer-events-none"}`}>
            <nav className="flex flex-col items-center justify-center py-10 gap-6 text-sm font-black text-slate-700 uppercase tracking-[0.2em] overflow-y-auto max-h-[calc(100vh-110px)]">
                {navItems.map((item) => (
                  <a 
                    key={item.id}
                    href={`#${item.id}`} 
                    onClick={() => setIsMenuOpen(false)} 
                    className={`transition-all ${activeSection === item.id ? "text-[#059669]" : "hover:text-[#059669]"}`}
                  >
                    {item.label}
                  </a>
                ))}
               <Link to="online-admission" onClick={() => setIsMenuOpen(false)} className="mt-4 px-8 py-3 bg-[#059669] text-white rounded-full text-xs">অনলাইন ভর্তি ফরম</Link>
            </nav>
          </div>
        </header>
      </div>

      <main>
        <Outlet />
      </main>

      {/* 3. Custom Footer (Dark Teal) */}
      <footer className="bg-[#042f2c] text-slate-400 py-10 border-t border-white/5">
       


        <div className="max-w-[1200px] mx-auto px-6">

          <div className="text-center flex flex-col items-center justify-center">
  <div className="w-16 h-16 bg-[#059669] rounded-full flex items-center justify-center text-white text-3xl font-black italic mx-auto md:mx-0 mb-4 shadow-xl">{settings.branding.logoText}</div>
               <p className="text-[25px] font-medium leading-[2] ">
                আল কুরআনুল কারীম একাডেমি
              </p>
             
              
              <div className="lg:flex items-center gap-5">  <p className="text-[14px] font-medium leading-[2] ">
                Dhaka, Bangladesh
              </p>
 <p>{settings.contact.phone}</p>
            </div>
             <div className="flex  gap-4 items-center justify-center  mt-5">
                  <a href={settings.contact.social.facebook} target="_blank" rel="noopener noreferrer" className="w-10 h-10 rounded-full bg-white/5 flex items-center justify-center text-slate-300 hover:bg-[#059669] hover:text-white transition-all cursor-pointer"><Facebook className="w-4 h-4" /></a>
                  <a href={settings.contact.social.twitter} target="_blank" rel="noopener noreferrer" className="w-10 h-10 rounded-full bg-white/5 flex items-center justify-center text-slate-300 hover:bg-[#059669] hover:text-white transition-all cursor-pointer"><Twitter className="w-4 h-4" /></a>
                  <a href={settings.contact.social.instagram} target="_blank" rel="noopener noreferrer" className="w-10 h-10 rounded-full bg-white/5 flex items-center justify-center text-slate-300 hover:bg-[#059669] hover:text-white transition-all cursor-pointer"><Instagram className="w-4 h-4" /></a>
               </div>
          </div>


        
          
          <div className="pt-8 mt-8  border-t border-white/5 text-center">
            <p className="text-[14px] font-black   opacity-30">© 2026 Talim Soft. All rights reserved.</p>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default PortalLayout;
