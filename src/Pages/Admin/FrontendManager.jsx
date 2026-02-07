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
  Film,
  MapPin,
  Globe
} from "lucide-react";
import { usePortalSettings } from "../../context/PortalSettingsContext";
import InputField from "../../components/InputField";

const FrontendManager = () => {
  const { settings, updateSettings, resetSettings } = usePortalSettings();
  const [activeTab, setActiveTab] = useState("branding");
  const [previewDevice, setPreviewDevice] = useState("desktop");
  
  // Local state for form to avoid excessive context updates during typing
  const [localSettings, setLocalSettings] = useState(settings);

  const handleUpdate = (path, value) => {
    const keys = path.split('.');
    setLocalSettings(prev => {
      const newState = { ...prev };
      let current = newState;
      for (let i = 0; i < keys.length - 1; i++) {
        current = current[keys[i]];
      }
      current[keys[keys.length - 1]] = value;
      return newState;
    });
  };

  const handleSave = () => {
    updateSettings(localSettings);
    alert("Changes saved successfully!");
  };

  const sections = [
    { id: "branding", name: "Branding & Contact", icon: Globe },
    { id: "hero", name: "Hero Slider", icon: Monitor },
    { id: "about", name: "About Us", icon: Layout },
    { id: "faculty", name: "Teachers", icon: Users },
    { id: "gallery", name: "Media Gallery", icon: ImageIcon },
    { id: "footer", name: "Footer Info", icon: Type },
  ];

  return (
    <div className="space-y-6 animate-in fade-in duration-500">
      {/* Header Area */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-extrabold text-slate-900 ">Frontend Manager</h1>
          
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
           <div className="bg-white bg-white  rounded-[20px] border border-gray-100 shadow-xl overflow-hidden ">
              <div className="p-6 md:p-8">
                  {activeTab === "branding" && (
                    <div className="space-y-6 animate-in slide-in-from-right-4 duration-300">
                     
                        <InputField title={'Madrasa Name'} placeholder={'Madrasa Name'}/>
                       
                   <InputField type={'file'}/>
                     
                   <div className="flex items-end justify-end">
         
           <button 
            
             className="flex items-center gap-2 px-6 py-2 text-sm font-bold bg-primary text-white rounded-xl shadow-lg shadow-primary/20 hover:scale-[1.02] transition-all"
           >
             <Save className="w-4 h-4" />
             Save 
           </button>
        </div>
                     
                    </div>
                  )}

                  {activeTab === "hero" && (
                    <div className="space-y-8 animate-in slide-in-from-right-4 duration-300">
                       {localSettings.hero.slides.map((slide, idx) => (
                         <div key={idx} className="p-6 bg-slate-50 dark:bg-slate-900 rounded-[20px] border border-slate-100 dark:border-slate-800 space-y-4">
                            <div className="flex items-center justify-between">
                               <h4 className="font-black text-slate-900 dark:text-white underline decoration-primary underline-offset-4 tracking-tight italic">Slide #{idx + 1}</h4>
                            </div>
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                               <div className="md:col-span-2">
                                  <label className="text-xs font-bold text-slate-500 uppercase mb-2 block">Background Image</label>
                                  <div className="space-y-3">
                                     {slide.image && (
                                       <div className="relative w-full h-32 rounded-xl overflow-hidden border-2 border-slate-200 dark:border-slate-700">
                                          <img src={slide.image} alt={`Slide ${idx + 1}`} className="w-full h-full object-cover" />
                                          <div className="absolute inset-0 bg-black/40 opacity-0 hover:opacity-100 transition-opacity flex items-center justify-center">
                                             <button 
                                               onClick={() => {
                                                 const newSlides = [...localSettings.hero.slides];
                                                 newSlides[idx].image = '';
                                                 handleUpdate('hero.slides', newSlides);
                                               }}
                                               className="px-4 py-2 bg-red-500 text-white text-xs font-bold rounded-lg hover:bg-red-600 transition-colors"
                                             >
                                               Remove Image
                                             </button>
                                          </div>
                                       </div>
                                     )}
                                     <label className="flex items-center justify-center gap-2 px-4 py-3 bg-white dark:bg-slate-950 border-2 border-dashed border-slate-300 dark:border-slate-700 rounded-xl cursor-pointer hover:border-primary hover:bg-primary/5 transition-all">
                                        <ImageIcon className="w-5 h-5 text-slate-400" />
                                        <span className="text-sm font-bold text-slate-600 dark:text-slate-400">
                                           {slide.image ? 'Change Image' : 'Upload Image'}
                                        </span>
                                        <input 
                                          type="file" 
                                          accept="image/*"
                                          className="hidden"
                                          onChange={(e) => {
                                            const file = e.target.files?.[0];
                                            if (file) {
                                              const reader = new FileReader();
                                              reader.onloadend = () => {
                                                const newSlides = [...localSettings.hero.slides];
                                                newSlides[idx].image = reader.result;
                                                handleUpdate('hero.slides', newSlides);
                                              };
                                              reader.readAsDataURL(file);
                                            }
                                          }}
                                        />
                                     </label>
                                  </div>
                               </div>
                               <div className="md:col-span-2">
                                  <label className="text-xs font-bold text-slate-500 uppercase mb-1 block">Title (Main Heading)</label>
                                  <textarea value={slide.title} onChange={(e) => {
                                    const newSlides = [...localSettings.hero.slides];
                                    newSlides[idx].title = e.target.value;
                                    handleUpdate('hero.slides', newSlides);
                                  }} className="w-full px-4 py-2 bg-white dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-xl outline-none dark:text-white font-bold" rows="2" />
                               </div>
                               <div>
                                  <label className="text-xs font-bold text-slate-500 uppercase mb-1 block">Subtitle</label>
                                  <input type="text" value={slide.subtitle} onChange={(e) => {
                                    const newSlides = [...localSettings.hero.slides];
                                    newSlides[idx].subtitle = e.target.value;
                                    handleUpdate('hero.slides', newSlides);
                                  }} className="w-full px-4 py-2 bg-white dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-xl outline-none dark:text-white" />
                               </div>
                               <div>
                                  <label className="text-xs font-bold text-slate-500 uppercase mb-1 block">Accent Text</label>
                                  <input type="text" value={slide.accent} onChange={(e) => {
                                    const newSlides = [...localSettings.hero.slides];
                                    newSlides[idx].accent = e.target.value;
                                    handleUpdate('hero.slides', newSlides);
                                  }} className="w-full px-4 py-2 bg-white dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-xl outline-none dark:text-white" />
                               </div>
                            </div>
                         </div>
                       ))}
                    </div>
                  )}

                 

                  {activeTab === "about" && (
                    <div className="space-y-6 animate-in slide-in-from-right-4 duration-300">
                       <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                         <div>
                            <label className="text-sm font-bold text-slate-900 dark:text-white mb-2 block">Badge Text</label>
                            <input type="text" value={localSettings.about.badge} onChange={(e) => handleUpdate('about.badge', e.target.value)} className="w-full px-4 py-3 bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-xl outline-none" />
                         </div>
                         <div>
                            <label className="text-sm font-bold text-slate-900 dark:text-white mb-2 block">Main Title</label>
                            <input type="text" value={localSettings.about.title} onChange={(e) => handleUpdate('about.title', e.target.value)} className="w-full px-4 py-3 bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-xl outline-none" />
                         </div>
                       </div>
                       <div>
                         <label className="text-sm font-bold text-slate-900 dark:text-white mb-2 block">Content Description</label>
                         <textarea rows="4" value={localSettings.about.description} onChange={(e) => handleUpdate('about.description', e.target.value)} className="w-full px-4 py-3 bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-xl outline-none" />
                       </div>

                       {/* Image Uploads */}
                       <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                         {/* Madrasa Campus Image */}
                         <div>
                            <label className="text-sm font-bold text-slate-900 dark:text-white mb-2 block">Madrasa Campus Image</label>
                            <div className="space-y-3">
                               {localSettings.about.mainImage && (
                                 <div className="relative w-full h-40 rounded-xl overflow-hidden border-2 border-slate-200 dark:border-slate-700">
                                    <img src={localSettings.about.mainImage} alt="Madrasa Campus" className="w-full h-full object-cover" />
                                    <div className="absolute inset-0 bg-black/40 opacity-0 hover:opacity-100 transition-opacity flex items-center justify-center">
                                       <button 
                                         onClick={() => handleUpdate('about.mainImage', '')}
                                         className="px-4 py-2 bg-red-500 text-white text-xs font-bold rounded-lg hover:bg-red-600 transition-colors"
                                       >
                                         Remove Image
                                       </button>
                                    </div>
                                 </div>
                               )}
                               <label className="flex items-center justify-center gap-2 px-4 py-3 bg-white dark:bg-slate-950 border-2 border-dashed border-slate-300 dark:border-slate-700 rounded-xl cursor-pointer hover:border-primary hover:bg-primary/5 transition-all">
                                  <ImageIcon className="w-5 h-5 text-slate-400" />
                                  <span className="text-sm font-bold text-slate-600 dark:text-slate-400">
                                     {localSettings.about.mainImage ? 'Change Image' : 'Upload Image'}
                                  </span>
                                  <input 
                                    type="file" 
                                    accept="image/*"
                                    className="hidden"
                                    onChange={(e) => {
                                      const file = e.target.files?.[0];
                                      if (file) {
                                        const reader = new FileReader();
                                        reader.onloadend = () => {
                                          handleUpdate('about.mainImage', reader.result);
                                        };
                                        reader.readAsDataURL(file);
                                      }
                                    }}
                                  />
                               </label>
                            </div>
                         </div>

                         {/* Principal/Admin Image */}
                         <div>
                            <label className="text-sm font-bold text-slate-900 dark:text-white mb-2 block">Principal/Admin Image</label>
                            <div className="space-y-3">
                               {localSettings.about.principalImage && (
                                 <div className="relative w-full h-40 rounded-xl overflow-hidden border-2 border-slate-200 dark:border-slate-700">
                                    <img src={localSettings.about.principalImage} alt="Principal" className="w-full h-full object-cover" />
                                    <div className="absolute inset-0 bg-black/40 opacity-0 hover:opacity-100 transition-opacity flex items-center justify-center">
                                       <button 
                                         onClick={() => handleUpdate('about.principalImage', '')}
                                         className="px-4 py-2 bg-red-500 text-white text-xs font-bold rounded-lg hover:bg-red-600 transition-colors"
                                       >
                                         Remove Image
                                       </button>
                                    </div>
                                 </div>
                               )}
                               <label className="flex items-center justify-center gap-2 px-4 py-3 bg-white dark:bg-slate-950 border-2 border-dashed border-slate-300 dark:border-slate-700 rounded-xl cursor-pointer hover:border-primary hover:bg-primary/5 transition-all">
                                  <ImageIcon className="w-5 h-5 text-slate-400" />
                                  <span className="text-sm font-bold text-slate-600 dark:text-slate-400">
                                     {localSettings.about.principalImage ? 'Change Image' : 'Upload Image'}
                                  </span>
                                  <input 
                                    type="file" 
                                    accept="image/*"
                                    className="hidden"
                                    onChange={(e) => {
                                      const file = e.target.files?.[0];
                                      if (file) {
                                        const reader = new FileReader();
                                        reader.onloadend = () => {
                                          handleUpdate('about.principalImage', reader.result);
                                        };
                                        reader.readAsDataURL(file);
                                      }
                                    }}
                                  />
                               </label>
                            </div>
                         </div>
                       </div>

                       <div>
                         <label className="text-sm font-bold text-slate-900 dark:text-white mb-4 block">Key Highlights (Bullets)</label>
                         <div className="space-y-3">
                            {localSettings.about.highlights.map((h, i) => (
                               <div key={i} className="flex gap-2">
                                  <input type="text" value={h} onChange={(e) => {
                                    const newHighlights = [...localSettings.about.highlights];
                                    newHighlights[i] = e.target.value;
                                    handleUpdate('about.highlights', newHighlights);
                                  }} className="flex-1 px-4 py-2 bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-xl text-sm" />
                                  <button onClick={() => {
                                    const newHighlights = localSettings.about.highlights.filter((_, idx) => idx !== i);
                                    handleUpdate('about.highlights', newHighlights);
                                  }} className="p-2 text-red-400 hover:text-red-500"><Trash2 className="w-4 h-4" /></button>
                               </div>
                            ))}
                            <button onClick={() => handleUpdate('about.highlights', [...localSettings.about.highlights, ""])} className="text-xs font-bold text-primary">+ Add Highlight</button>
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
                        <h3 className="font-bold text-slate-900 dark:text-white">Featured Teachers</h3>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                           {localSettings.teachers.items.map((item, i) => (
                             <div key={i} className="p-4 bg-slate-50 dark:bg-slate-900 rounded-2xl flex items-center gap-4 border border-slate-100 dark:border-slate-800">
                                <div className="w-16 h-16 rounded-xl overflow-hidden bg-slate-200">
                                   <img src={item.image} alt="Avatar" className="w-full h-full object-cover" />
                                </div>
                                <div className="flex-1 min-w-0">
                                   <input type="text" value={item.name} onChange={(e) => {
                                     const newItems = [...localSettings.teachers.items];
                                     newItems[i].name = e.target.value;
                                     handleUpdate('teachers.items', newItems);
                                   }} className="w-full bg-transparent font-bold text-sm dark:text-white outline-none" />
                                   <input type="text" value={item.role} onChange={(e) => {
                                     const newItems = [...localSettings.teachers.items];
                                     newItems[i].role = e.target.value;
                                     handleUpdate('teachers.items', newItems);
                                   }} className="w-full bg-transparent text-xs text-primary font-bold outline-none" />
                                </div>
                             </div>
                           ))}
                        </div>
                     </div>
                  )}

                  {activeTab === "footer" && (
                    <div className="space-y-6 animate-in slide-in-from-right-4 duration-300">
                       <div>
                         <label className="text-sm font-bold text-slate-900 dark:text-white mb-2 block">Footer About Text</label>
                         <textarea rows="3" value={localSettings.footer.aboutText} onChange={(e) => handleUpdate('footer.aboutText', e.target.value)} className="w-full px-4 py-3 bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-xl outline-none" />
                       </div>
                       <div>
                         <label className="text-sm font-bold text-slate-900 dark:text-white mb-2 block">Copyright Text</label>
                         <input type="text" value={localSettings.footer.copyright} onChange={(e) => handleUpdate('footer.copyright', e.target.value)} className="w-full px-4 py-3 bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-xl outline-none" />
                       </div>
                    </div>
                  )}
              </div>
           </div>

        
        </div>
      </div>
    </div>
  );
};

export default FrontendManager;
