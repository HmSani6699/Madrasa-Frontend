import { useState } from "react";
import { 
  Layout, 
  Image as ImageIcon, 
  Type, 
  List, 
  Save, 
  Eye, 
  Plus, 
  Trash2, 
  ChevronRight,
  Monitor,
  Smartphone,
  Users,
  Film
} from "lucide-react";

const FrontendManager = () => {
  const [activeTab, setActiveTab] = useState("hero");
  const [previewDevice, setPreviewDevice] = useState("desktop");

  const [heroData, setHeroData] = useState({
    heading: "Building a Better Future with Islamic Education",
    subheading: "Join our community of learners where tradition meets innovation.",
    primaryBtn: "Apply for Admission",
    secondaryBtn: "Browse Courses"
  });

  const [stats, setStats] = useState([
    { label: "Students", val: "1200+" },
    { label: "Teachers", val: "45+" },
    { label: "Classes", val: "24+" },
    { label: "Awards", val: "15+" }
  ]);

  const sections = [
    { id: "hero", name: "Hero Section", icon: Type },
    { id: "about", name: "About Us", icon: Layout },
    { id: "stats", name: "Statistics", icon: List },
    { id: "faculty", name: "Faculty Setup", icon: Users },
    { id: "gallery", name: "Media Gallery", icon: ImageIcon },
  ];

  const handleUpdateHero = (field, val) => setHeroData(prev => ({ ...prev, [field]: val }));

  return (
    <div className="space-y-6 animate-in fade-in duration-500">
      {/* Header Area */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-extrabold text-slate-900 dark:text-white">Frontend Manager</h1>
          <p className="text-slate-500 text-sm font-medium">Control how your Madrasa appears to the public.</p>
        </div>
        <div className="flex items-center gap-3">
           <button className="flex items-center gap-2 px-4 py-2 text-sm font-bold bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-700 dark:text-slate-200 rounded-xl hover:bg-slate-50 transition-all">
             <Eye className="w-4 h-4" />
             View Portal
           </button>
           <button className="flex items-center gap-2 px-6 py-2 text-sm font-bold bg-primary text-white rounded-xl shadow-lg shadow-primary/20 hover:scale-[1.02] transition-all">
             <Save className="w-4 h-4" />
             Save Changes
           </button>
        </div>
      </div>

      <div className="grid grid-cols-1 xl:grid-cols-12 gap-8">
        {/* Sidebar / Tabs */}
        <div className="xl:col-span-3 space-y-2">
           {sections.map((s) => (
             <button
               key={s.id}
               onClick={() => setActiveTab(s.id)}
               className={`w-full flex items-center justify-between p-4 rounded-2xl transition-all ${
                 activeTab === s.id 
                 ? "bg-primary text-white shadow-lg shadow-primary/20" 
                 : "bg-white dark:bg-slate-800 text-slate-600 dark:text-slate-400 border border-slate-100 dark:border-slate-700 hover:border-primary/50"
               }`}
             >
               <div className="flex items-center gap-3">
                 <s.icon className={`w-5 h-5 ${activeTab === s.id ? "text-white" : "text-primary"}`} />
                 <span className="font-bold text-sm tracking-tight">{s.name}</span>
               </div>
               <ChevronRight className={`w-4 h-4 opacity-50 ${activeTab === s.id ? "hidden" : ""}`} />
             </button>
           ))}
        </div>

        {/* Editor Content */}
        <div className="xl:col-span-9 space-y-6">
           <div className="bg-white dark:bg-slate-800 rounded-[2rem] border border-slate-100 dark:border-slate-700 shadow-sm overflow-hidden min-h-[500px]">
              <div className="p-6 md:p-8">
                 {activeTab === "hero" && (
                   <div className="space-y-6 animate-in slide-in-from-right-4 duration-300">
                      <div>
                        <label className="text-sm font-bold text-slate-900 dark:text-white mb-2 block">Main Heading</label>
                        <input 
                           type="text" 
                           value={heroData.heading}
                           onChange={(e) => handleUpdateHero('heading', e.target.value)}
                           className="w-full px-4 py-3 bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-xl focus:ring-2 focus:ring-primary/20 focus:border-primary outline-none transition-all dark:text-white"
                        />
                      </div>
                      <div>
                        <label className="text-sm font-bold text-slate-900 dark:text-white mb-2 block">Hero Description</label>
                        <textarea 
                           rows="4"
                           value={heroData.subheading}
                           onChange={(e) => handleUpdateHero('subheading', e.target.value)}
                           className="w-full px-4 py-3 bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-xl focus:ring-2 focus:ring-primary/20 focus:border-primary outline-none transition-all dark:text-white"
                        />
                      </div>
                      <div className="flex flex-col md:flex-row gap-6">
                         <div className="flex-1">
                            <label className="text-sm font-bold text-slate-900 dark:text-white mb-2 block">Primary Button</label>
                            <input type="text" value={heroData.primaryBtn} onChange={(e) => handleUpdateHero('primaryBtn', e.target.value)} className="w-full px-4 py-3 bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-xl dark:text-white" />
                         </div>
                         <div className="flex-1">
                            <label className="text-sm font-bold text-slate-900 dark:text-white mb-2 block">Secondary Button</label>
                            <input type="text" value={heroData.secondaryBtn} onChange={(e) => handleUpdateHero('secondaryBtn', e.target.value)} className="w-full px-4 py-3 bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-xl dark:text-white" />
                         </div>
                      </div>
                   </div>
                 )}

                 {activeTab === "stats" && (
                    <div className="space-y-6 animate-in slide-in-from-right-4 duration-300">
                       <h3 className="font-bold text-slate-900 dark:text-white">Counter Statistics</h3>
                       <div className="space-y-4">
                          {stats.map((item, i) => (
                            <div key={i} className="flex items-center gap-4 p-4 bg-slate-50 dark:bg-slate-900 rounded-2xl border border-slate-100 dark:border-slate-800">
                               <div className="flex-1">
                                  <label className="text-[10px] font-bold text-slate-500 uppercase mb-1 block">Label</label>
                                  <input type="text" defaultValue={item.label} className="w-full bg-transparent font-bold dark:text-white outline-none" />
                               </div>
                               <div className="w-32">
                                  <label className="text-[10px] font-bold text-slate-500 uppercase mb-1 block">Value</label>
                                  <input type="text" defaultValue={item.val} className="w-full bg-transparent font-bold text-primary outline-none" />
                               </div>
                               <button className="p-2 text-red-500 hover:bg-red-50 dark:hover:bg-red-900/10 rounded-lg transition-colors">
                                 <Trash2 className="w-5 h-5" />
                               </button>
                            </div>
                          ))}
                       </div>
                       <button className="flex items-center gap-2 text-primary font-bold text-sm bg-primary/5 px-4 py-3 rounded-xl border border-primary/20 border-dashed hover:bg-primary/10 transition-all w-full justify-center">
                          <Plus className="w-4 h-4" />
                          Add New Statistic
                       </button>
                    </div>
                 )}

                 {activeTab === "about" && (
                    <div className="space-y-6 animate-in slide-in-from-right-4 duration-300">
                       <div>
                         <label className="text-sm font-bold text-slate-900 dark:text-white mb-2 block">About Section Title</label>
                         <input type="text" defaultValue="Providing Excellence in Islamic & Academic Learning" className="w-full px-4 py-3 bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-xl dark:text-white" />
                       </div>
                       <div>
                         <label className="text-sm font-bold text-slate-900 dark:text-white mb-2 block">Content Description</label>
                         <textarea rows="4" className="w-full px-4 py-3 bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-xl dark:text-white" defaultValue="Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed do eiusmod tempor incididunt ut labore et dolore magna aliqua." />
                       </div>
                       <div>
                         <label className="text-sm font-bold text-slate-900 dark:text-white mb-4 block">Key Highlights</label>
                         <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            {[1, 2, 3, 4].map(idx => (
                               <input key={idx} type="text" className="px-4 py-3 bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-xl text-sm dark:text-white" placeholder={`Highlight ${idx}`} />
                            ))}
                         </div>
                       </div>
                    </div>
                 )}

                 {activeTab === "gallery" && (
                    <div className="space-y-6 animate-in slide-in-from-right-4 duration-300">
                       <div className="flex items-center justify-between">
                          <h3 className="font-bold text-slate-900 dark:text-white">Media Gallery</h3>
                          <button className="text-xs font-bold text-primary flex items-center gap-1">Bulk Upload <ImageIcon className="w-3.5 h-3.5" /></button>
                       </div>
                       <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4">
                          {[1, 2, 3, 4, 5, 6].map(i => (
                            <div key={i} className="relative aspect-square rounded-2xl overflow-hidden group">
                               <img src={`https://picsum.photos/seed/${i + 50}/200`} className="w-full h-full object-cover" alt="Gallery" />
                               <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-2">
                                  <button className="p-2 bg-white/20 hover:bg-white/40 text-white rounded-lg backdrop-blur-sm transition-all"><Trash2 className="w-4 h-4" /></button>
                                  <button className="p-2 bg-white/20 hover:bg-white/40 text-white rounded-lg backdrop-blur-sm transition-all"><ImageIcon className="w-4 h-4" /></button>
                               </div>
                            </div>
                          ))}
                          <button className="aspect-square rounded-2xl border-2 border-dashed border-slate-200 dark:border-slate-700 flex flex-col items-center justify-center text-slate-400 hover:border-primary hover:text-primary transition-all">
                             <Plus className="w-6 h-6 mb-2" />
                             <span className="text-xs font-bold uppercase tracking-widest">Add Media</span>
                          </button>
                       </div>
                    </div>
                 )}

                 {activeTab === "faculty" && (
                    <div className="space-y-6 animate-in slide-in-from-right-4 duration-300">
                       <h3 className="font-bold text-slate-900 dark:text-white">Featured Faculty</h3>
                       <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                          {[1, 2, 3].map(i => (
                            <div key={i} className="p-4 bg-slate-50 dark:bg-slate-900 rounded-2xl flex items-center gap-4 border border-slate-100 dark:border-slate-800">
                               <div className="w-16 h-16 rounded-xl overflow-hidden">
                                  <img src={`https://api.dicebear.com/7.x/avataaars/svg?seed=${i + 15}`} alt="Avatar" />
                               </div>
                               <div className="flex-1 min-w-0">
                                  <input type="text" defaultValue="Md. Abdur Rahman" className="w-full bg-transparent font-bold text-sm dark:text-white outline-none" />
                                  <input type="text" defaultValue="Senior Teacher" className="w-full bg-transparent text-xs text-primary font-bold outline-none" />
                               </div>
                               <button className="p-2 text-slate-400 hover:text-red-500 transition-colors">
                                 <Trash2 className="w-4 h-4" />
                               </button>
                            </div>
                          ))}
                       </div>
                       <button className="flex items-center gap-2 text-primary font-bold text-sm bg-primary/5 px-4 py-3 rounded-xl border border-primary/20 border-dashed hover:bg-primary/10 transition-all w-full justify-center">
                          <Plus className="w-4 h-4" />
                          Add Member
                       </button>
                    </div>
                 )}
              </div>
           </div>

           {/* Preview Mockup */}
           <div className="bg-slate-100 dark:bg-slate-900 rounded-[2rem] p-4 md:p-8">
              <div className="flex items-center justify-between mb-6">
                 <h3 className="text-sm font-extrabold text-slate-500 uppercase tracking-widest">Live Preview</h3>
                 <div className="flex items-center gap-1 bg-white dark:bg-slate-800 p-1 rounded-xl shadow-sm border border-slate-200 dark:border-slate-700">
                    <button 
                      onClick={() => setPreviewDevice("desktop")}
                      className={`p-2 rounded-lg transition-all ${previewDevice === "desktop" ? "bg-primary/10 text-primary" : "text-slate-400"}`}
                    >
                      <Monitor className="w-4 h-4" />
                    </button>
                    <button 
                      onClick={() => setPreviewDevice("mobile")}
                      className={`p-2 rounded-lg transition-all ${previewDevice === "mobile" ? "bg-primary/10 text-primary" : "text-slate-400"}`}
                    >
                      <Smartphone className="w-4 h-4" />
                    </button>
                 </div>
              </div>

              <div className={`mx-auto bg-white dark:bg-slate-950 rounded-2xl shadow-2xl overflow-hidden transition-all duration-500 ${previewDevice === "mobile" ? "max-w-[320px] aspect-[9/16]" : "w-full min-h-[400px]"}`}>
                  <div className="p-4 md:p-6 border-b border-slate-100 dark:border-slate-900 flex items-center justify-between">
                     <div className="flex items-center gap-2">
                        <div className="w-6 h-6 bg-primary rounded-lg" />
                        <span className="text-[10px] font-bold dark:text-white font-sans uppercase tracking-tight">Madrasa Portal</span>
                     </div>
                     <div className="hidden sm:flex gap-4">
                        <div className="w-12 h-1 bg-slate-100 dark:bg-slate-800 rounded-full" />
                        <div className="w-12 h-1 bg-slate-100 dark:bg-slate-800 rounded-full" />
                     </div>
                  </div>
                  <div className="p-8 md:p-12 space-y-6 text-center lg:text-left">
                     <h2 className="text-2xl md:text-3xl font-extrabold text-slate-900 dark:text-white leading-tight">
                        {heroData.heading}
                     </h2>
                     <p className="text-xs md:text-sm text-slate-500 max-w-lg leading-relaxed">
                        {heroData.subheading}
                     </p>
                     <div className="pt-4 flex flex-wrap justify-center lg:justify-start gap-3">
                        <div className="px-6 py-3 bg-primary text-white text-[10px] font-bold rounded-xl shadow-lg shadow-primary/20">{heroData.primaryBtn}</div>
                        <div className="px-6 py-3 bg-slate-100 dark:bg-slate-900 text-slate-600 dark:text-slate-400 text-[10px] font-bold rounded-xl">{heroData.secondaryBtn}</div>
                     </div>
                  </div>
              </div>
           </div>
        </div>
      </div>
    </div>
  );
};

export default FrontendManager;
