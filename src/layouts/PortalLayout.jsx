import { useState, useEffect, useRef } from "react";
import { Outlet, Link, useLocation } from "react-router";
import { 
  Phone, 
  Mail, 
  Facebook, 
  Twitter, 
  Youtube,
  Instagram,
  Menu,
  X
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
    { id: "hero", label: "হোম" },
    { id: "about", label: "আমাদের সম্পর্কে" },
    { id: "academic", label: "ক্লাস কারিকুলাম" },
    { id: "students", label: "শিক্ষার্থী" },
    { id: "teachers", label: "শিক্ষক" },
    { id: "gallery", label: "ভিডিও" },
    { id: "photos", label: "ফটো গ্যালারি" },
  ];

  return (
    <div className="min-h-screen bg-white transition-colors duration-300 font-sans">
      {/* Navigation Group (Top Bar + Header) */}
      <div className="relative z-[100]">
        {/* 1. Top Bar (Dark Teal) */}
        <div className="bg-[#042f2c] text-white py-2 text-[11px] font-medium border-b border-white/5">
          <div className="max-w-[1400px] mx-auto px-6 flex justify-between items-center">
            <div className="flex gap-6 opacity-90">
              <span className="flex items-center gap-1.5"><Phone className="w-3 h-3 text-emerald-400" /> {settings.contact.phone}</span>
              <span className="flex items-center gap-1.5 hidden sm:flex"><Mail className="w-3 h-3 text-emerald-400" /> {settings.contact.email}</span>
            </div>
            <div className="flex gap-4 opacity-80">
              <a href={settings.contact.social.facebook} target="_blank" rel="noopener noreferrer"><Facebook className="w-3.5 h-3.5 hover:text-emerald-400 cursor-pointer transition-colors" /></a>
              <a href={settings.contact.social.twitter} target="_blank" rel="noopener noreferrer"><Twitter className="w-3.5 h-3.5 hover:text-emerald-400 cursor-pointer transition-colors" /></a>
              <a href={settings.contact.social.youtube} target="_blank" rel="noopener noreferrer"><Youtube className="w-3.5 h-3.5 hover:text-emerald-400 cursor-pointer transition-colors" /></a>
            </div>
          </div>
        </div>

        {/* 2. Header / Navigation (White) - Sticky */}
        <header className="bg-white py-4 shadow-md sticky top-0 z-[100] border-b border-slate-100">
          <div className="max-w-[1440px] mx-auto px-6 flex items-center justify-between">
            {/* Left Column (Branding) */}
            <div className="flex items-center">
               <Link to="/portal/global-international" className="flex items-center gap-3 md:gap-5 group">
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
            <nav className="hidden lg:flex items-center gap-6 text-[11px] font-black text-slate-700 uppercase tracking-widest leading-loose">
               {navItems.map((item) => (
                  <a 
                    key={item.id}
                    href={`#${item.id}`} 
                    className={`transition-all whitespace-nowrap pb-1 ${
                      activeSection === item.id 
                        ? "text-[#059669] border-b-2 border-[#059669]" 
                        : "hover:text-[#059669] border-b-2 border-transparent"
                    }`}
                  >
                    {item.label}
                  </a>
               ))}
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
      <footer className="bg-[#042f2c] text-slate-400 py-20 border-t border-white/5">
        <div className="max-w-[1200px] mx-auto px-6">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-12 lg:gap-20 mb-20 text-center md:text-left">
            <div className="col-span-1 md:col-span-1">
               <div className="w-16 h-16 bg-[#059669] rounded-2xl flex items-center justify-center text-white text-3xl font-black italic mx-auto md:mx-0 mb-8 shadow-xl">{settings.branding.logoText}</div>
               <p className="text-sm font-medium leading-[2] italic">
                 {settings.footer.aboutText}
               </p>
               <div className="flex gap-4 justify-center md:justify-start mt-8">
                  <a href={settings.contact.social.facebook} target="_blank" rel="noopener noreferrer" className="w-10 h-10 rounded-full bg-white/5 flex items-center justify-center text-slate-300 hover:bg-[#059669] hover:text-white transition-all cursor-pointer"><Facebook className="w-4 h-4" /></a>
                  <a href={settings.contact.social.twitter} target="_blank" rel="noopener noreferrer" className="w-10 h-10 rounded-full bg-white/5 flex items-center justify-center text-slate-300 hover:bg-[#059669] hover:text-white transition-all cursor-pointer"><Twitter className="w-4 h-4" /></a>
                  <a href={settings.contact.social.instagram} target="_blank" rel="noopener noreferrer" className="w-10 h-10 rounded-full bg-white/5 flex items-center justify-center text-slate-300 hover:bg-[#059669] hover:text-white transition-all cursor-pointer"><Instagram className="w-4 h-4" /></a>
               </div>
            </div>
            
            <div>
              <h4 className="font-black text-white mb-10 text-xl italic underline decoration-[#059669] underline-offset-8">Quick Info</h4>
              <ul className="space-y-6 text-sm font-bold opacity-70 italic tracking-wide">
                <li><Link to="online-admission" className="hover:text-white transition-colors">Admission</Link></li>
                <li><a href="#" className="hover:text-white transition-colors">Our History</a></li>
                <li><a href="#" className="hover:text-primary transition-colors">Portfolio</a></li>
                <li><a href="#" className="hover:text-white transition-colors">Career</a></li>
              </ul>
            </div>

            <div>
              <h4 className="font-black text-white mb-10 text-xl italic underline decoration-[#059669] underline-offset-8">Services</h4>
              <ul className="space-y-6 text-sm font-bold opacity-70 italic tracking-wide">
                <li><a href="#" className="hover:text-white transition-colors">Online Education</a></li>
                <li><a href="#" className="hover:text-white transition-colors">Institutional Care</a></li>
                <li><a href="#" className="hover:text-primary transition-colors">E-Commerce</a></li>
                <li><a href="#" className="hover:text-white transition-colors">MMS System</a></li>
              </ul>
            </div>

            <div>
              <h4 className="font-black text-white mb-10 text-xl italic underline decoration-[#059669] underline-offset-8">Contact with us</h4>
              <ul className="space-y-6 text-[13px] font-bold opacity-70 italic tracking-wide">
                <li>{settings.contact.address}</li>
                <li>{settings.contact.email}</li>
                <li>{settings.contact.phone}</li>
              </ul>
            </div>
          </div>
          
          <div className="pt-10 border-t border-white/5 text-center">
            <p className="text-[11px] font-black uppercase tracking-[0.3em] opacity-30">{settings.footer.copyright}</p>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default PortalLayout;
