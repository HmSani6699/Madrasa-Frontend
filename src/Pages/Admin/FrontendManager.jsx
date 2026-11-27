import { useState, useEffect } from "react";
import {
  Layout,
  Image as ImageIcon,
  Type,
  Save,
  Plus,
  Trash2,
  ChevronRight,
  Monitor,
  Users,
  Globe,
  Loader2,
} from "lucide-react";
import { toast } from "react-hot-toast";
import { usePortalSettings } from "../../context/PortalSettingsContext";

const FrontendManager = () => {
  const { settings, updateSettings, saving } = usePortalSettings();
  const [activeTab, setActiveTab] = useState("branding");
  const [localSettings, setLocalSettings] = useState(settings);

  useEffect(() => {
    setLocalSettings(settings);
  }, [settings]);

  const handleUpdate = (path, value) => {
    const keys = path.split(".");
    setLocalSettings((prev) => {
      const next = structuredClone(prev);
      let current = next;
      for (let i = 0; i < keys.length - 1; i++) {
        if (!current[keys[i]] || typeof current[keys[i]] !== "object") {
          current[keys[i]] = {};
        }
        current = current[keys[i]];
      }
      current[keys[keys.length - 1]] = value;
      return next;
    });
  };

  const handleSave = async () => {
    const res = await updateSettings(localSettings);
    if (res?.success === false) {
      toast.error(res.message || "পরিবর্তন সংরক্ষণ করতে সমস্যা হয়েছে!");
    } else {
      toast.success("পোর্টালের তথ্য সফলভাবে সংরক্ষণ করা হয়েছে!");
    }
  };

  const sections = [
    { id: "branding", name: "Branding & Contact", icon: Globe },
    { id: "hero", name: "Hero Section", icon: Monitor },
    { id: "about", name: "About Us", icon: Layout },
    { id: "faculty", name: "Teachers", icon: Users },
    { id: "gallery", name: "Media Gallery", icon: ImageIcon },
    { id: "footer", name: "Footer Info", icon: Type },
  ];

  const handleImageUpload = (file, cb) => {
    if (!file) return;
    const reader = new FileReader();
    reader.onloadend = () => cb(reader.result);
    reader.readAsDataURL(file);
  };

  return (
    <div className="space-y-6 animate-in fade-in duration-500">
      {/* Header Area */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-extrabold text-slate-900">
            Frontend Manager
          </h1>
          <p className="text-sm text-slate-500">
            পাবলিক পোর্টালের ব্র্যান্ডিং, কন্টেন্ট ও যোগাযোগের তথ্য এখান থেকে আপডেট করুন
          </p>
        </div>
        <button
          type="button"
          onClick={handleSave}
          disabled={saving}
          className="flex items-center gap-2 px-6 py-2.5 text-sm font-bold bg-[#1C7D5A] hover:bg-[#123628] disabled:opacity-60 text-white rounded-xl shadow-lg shadow-[#1C7D5A]/20 transition-all cursor-pointer self-start md:self-auto"
        >
          {saving ? (
            <Loader2 className="w-4 h-4 animate-spin" />
          ) : (
            <Save className="w-4 h-4" />
          )}
          {saving ? "Saving..." : "Save All Changes"}
        </button>
      </div>

      <div className="grid grid-cols-1 xl:grid-cols-12 gap-8">
        {/* Sidebar / Tabs */}
        <div className="xl:col-span-3 space-y-2">
          {sections.map((s) => (
            <button
              key={s.id}
              type="button"
              onClick={() => setActiveTab(s.id)}
              className={`w-full flex items-center justify-between p-4 rounded-2xl transition-all cursor-pointer ${
                activeTab === s.id
                  ? "bg-primary text-white shadow-lg shadow-primary/20"
                  : "bg-white text-slate-600 border border-slate-100 hover:border-primary/50"
              }`}
            >
              <div className="flex items-center gap-3">
                <s.icon
                  className={`w-5 h-5 ${
                    activeTab === s.id ? "text-white" : "text-primary"
                  }`}
                />
                <span className="font-bold text-sm tracking-tight">
                  {s.name}
                </span>
              </div>
              <ChevronRight
                className={`w-4 h-4 opacity-50 ${
                  activeTab === s.id ? "hidden" : ""
                }`}
              />
            </button>
          ))}
        </div>

        {/* Editor Content */}
        <div className="xl:col-span-9 space-y-6">
          <div className="bg-white rounded-[20px] border border-gray-100 shadow-xl overflow-hidden">
            <div className="p-6 md:p-8">
              {activeTab === "branding" && (
                <div className="space-y-6 animate-in slide-in-from-right-4 duration-300">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                    <div>
                      <label className="text-sm font-bold text-slate-700 mb-1.5 block">
                        Madrasa Name (Bangla)
                      </label>
                      <input
                        type="text"
                        value={localSettings?.branding?.name || ""}
                        onChange={(e) => handleUpdate("branding.name", e.target.value)}
                        placeholder="মাদ্রাসার নাম"
                        className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl outline-none focus:border-[#1C7D5A]"
                      />
                    </div>
                    <div>
                      <label className="text-sm font-bold text-slate-700 mb-1.5 block">
                        English Name
                      </label>
                      <input
                        type="text"
                        value={localSettings?.branding?.englishName || ""}
                        onChange={(e) =>
                          handleUpdate("branding.englishName", e.target.value)
                        }
                        placeholder="Madrasa English Name"
                        className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl outline-none focus:border-[#1C7D5A]"
                      />
                    </div>
                    <div>
                      <label className="text-sm font-bold text-slate-700 mb-1.5 block">
                        Arabic Name (Optional)
                      </label>
                      <input
                        type="text"
                        dir="rtl"
                        value={localSettings?.branding?.arabicName || ""}
                        onChange={(e) =>
                          handleUpdate("branding.arabicName", e.target.value)
                        }
                        placeholder="الاسم العربي للمدرسة"
                        className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl outline-none focus:border-[#1C7D5A]"
                      />
                    </div>
                    <div>
                      <label className="text-sm font-bold text-slate-700 mb-1.5 block">
                        Tagline / Location
                      </label>
                      <input
                        type="text"
                        value={localSettings?.branding?.tagline || ""}
                        onChange={(e) =>
                          handleUpdate("branding.tagline", e.target.value)
                        }
                        placeholder="ঠিকানা বা স্লোগান"
                        className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl outline-none focus:border-[#1C7D5A]"
                      />
                    </div>
                    <div>
                      <label className="text-sm font-bold text-slate-700 mb-1.5 block">
                        Contact Phone
                      </label>
                      <input
                        type="text"
                        value={localSettings?.contact?.phone || ""}
                        onChange={(e) =>
                          handleUpdate("contact.phone", e.target.value)
                        }
                        placeholder="+8801XXXXXXXXX"
                        className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl outline-none focus:border-[#1C7D5A]"
                      />
                    </div>
                    <div>
                      <label className="text-sm font-bold text-slate-700 mb-1.5 block">
                        Contact Email
                      </label>
                      <input
                        type="email"
                        value={localSettings?.contact?.email || ""}
                        onChange={(e) =>
                          handleUpdate("contact.email", e.target.value)
                        }
                        placeholder="info@madrasa.com"
                        className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl outline-none focus:border-[#1C7D5A]"
                      />
                    </div>
                    <div className="md:col-span-2">
                      <label className="text-sm font-bold text-slate-700 mb-1.5 block">
                        Address
                      </label>
                      <input
                        type="text"
                        value={localSettings?.contact?.address || ""}
                        onChange={(e) =>
                          handleUpdate("contact.address", e.target.value)
                        }
                        placeholder="পূর্ণ ঠিকানা"
                        className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl outline-none focus:border-[#1C7D5A]"
                      />
                    </div>
                    <div>
                      <label className="text-sm font-bold text-slate-700 mb-1.5 block">
                        Facebook URL
                      </label>
                      <input
                        type="url"
                        value={localSettings?.contact?.social?.facebook || ""}
                        onChange={(e) =>
                          handleUpdate("contact.social.facebook", e.target.value)
                        }
                        placeholder="https://facebook.com/..."
                        className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl outline-none focus:border-[#1C7D5A]"
                      />
                    </div>
                    <div>
                      <label className="text-sm font-bold text-slate-700 mb-1.5 block">
                        YouTube URL
                      </label>
                      <input
                        type="url"
                        value={localSettings?.contact?.social?.youtube || ""}
                        onChange={(e) =>
                          handleUpdate("contact.social.youtube", e.target.value)
                        }
                        placeholder="https://youtube.com/..."
                        className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl outline-none focus:border-[#1C7D5A]"
                      />
                    </div>
                    <div className="md:col-span-2">
                      <label className="text-sm font-bold text-slate-700 mb-1.5 block">
                        Institution Logo
                      </label>
                      <div className="flex items-center gap-4">
                        {localSettings?.branding?.logo && (
                          <img
                            src={localSettings.branding.logo}
                            alt="Logo"
                            className="w-16 h-16 rounded-xl object-contain border border-slate-200 p-1"
                          />
                        )}
                        <label className="flex items-center gap-2 px-4 py-2.5 bg-slate-50 border-2 border-dashed border-slate-300 rounded-xl cursor-pointer hover:border-[#1C7D5A]">
                          <ImageIcon className="w-4 h-4 text-slate-500" />
                          <span className="text-sm font-semibold text-slate-600">
                            Upload Logo
                          </span>
                          <input
                            type="file"
                            accept="image/*"
                            className="hidden"
                            onChange={(e) =>
                              handleImageUpload(e.target.files?.[0], (res) =>
                                handleUpdate("branding.logo", res)
                              )
                            }
                          />
                        </label>
                      </div>
                    </div>
                  </div>
                </div>
              )}

              {activeTab === "hero" && (
                <div className="space-y-6 animate-in slide-in-from-right-4 duration-300">
                  <div>
                    <label className="text-sm font-bold text-slate-700 mb-2 block">
                      Hero Highlight Badges
                    </label>
                    <div className="space-y-2">
                      {(localSettings?.hero?.badges || []).map((badge, idx) => (
                        <div key={idx} className="flex gap-2">
                          <input
                            type="text"
                            value={badge}
                            onChange={(e) => {
                              const next = [...(localSettings?.hero?.badges || [])];
                              next[idx] = e.target.value;
                              handleUpdate("hero.badges", next);
                            }}
                            className="flex-1 px-4 py-2 bg-slate-50 border border-slate-200 rounded-xl text-sm"
                          />
                          <button
                            type="button"
                            onClick={() => {
                              const next = (localSettings?.hero?.badges || []).filter(
                                (_, i) => i !== idx
                              );
                              handleUpdate("hero.badges", next);
                            }}
                            className="p-2 text-red-400 hover:text-red-500"
                          >
                            <Trash2 className="w-4 h-4" />
                          </button>
                        </div>
                      ))}
                      <button
                        type="button"
                        onClick={() =>
                          handleUpdate("hero.badges", [
                            ...(localSettings?.hero?.badges || []),
                            "",
                          ])
                        }
                        className="text-xs font-bold text-primary cursor-pointer"
                      >
                        + Add Badge
                      </button>
                    </div>
                  </div>
                </div>
              )}

              {activeTab === "about" && (
                <div className="space-y-6 animate-in slide-in-from-right-4 duration-300">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div>
                      <label className="text-sm font-bold text-slate-900 mb-2 block">
                        Badge Text
                      </label>
                      <input
                        type="text"
                        value={localSettings?.about?.badge || ""}
                        onChange={(e) => handleUpdate("about.badge", e.target.value)}
                        className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl outline-none"
                      />
                    </div>
                    <div>
                      <label className="text-sm font-bold text-slate-900 mb-2 block">
                        Main Title
                      </label>
                      <input
                        type="text"
                        value={localSettings?.about?.title || ""}
                        onChange={(e) => handleUpdate("about.title", e.target.value)}
                        className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl outline-none"
                      />
                    </div>
                  </div>
                  <div>
                    <label className="text-sm font-bold text-slate-900 mb-2 block">
                      Mission / Description
                    </label>
                    <textarea
                      rows="3"
                      value={localSettings?.about?.description || ""}
                      onChange={(e) =>
                        handleUpdate("about.description", e.target.value)
                      }
                      className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl outline-none"
                    />
                  </div>
                  <div>
                    <label className="text-sm font-bold text-slate-900 mb-2 block">
                      Vision (দৃষ্টিভঙ্গি)
                    </label>
                    <textarea
                      rows="3"
                      value={localSettings?.about?.vision || ""}
                      onChange={(e) => handleUpdate("about.vision", e.target.value)}
                      className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl outline-none"
                    />
                  </div>

                  {/* Image Uploads */}
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div>
                      <label className="text-sm font-bold text-slate-900 mb-2 block">
                        Madrasa Campus Image
                      </label>
                      <div className="space-y-3">
                        {localSettings?.about?.mainImage && (
                          <div className="relative w-full h-40 rounded-xl overflow-hidden border-2 border-slate-200">
                            <img
                              src={localSettings.about.mainImage}
                              alt="Madrasa Campus"
                              className="w-full h-full object-cover"
                            />
                          </div>
                        )}
                        <label className="flex items-center justify-center gap-2 px-4 py-3 bg-white border-2 border-dashed border-slate-300 rounded-xl cursor-pointer hover:border-primary hover:bg-primary/5 transition-all">
                          <ImageIcon className="w-5 h-5 text-slate-400" />
                          <span className="text-sm font-bold text-slate-600">
                            Change Campus Image
                          </span>
                          <input
                            type="file"
                            accept="image/*"
                            className="hidden"
                            onChange={(e) =>
                              handleImageUpload(e.target.files?.[0], (res) =>
                                handleUpdate("about.mainImage", res)
                              )
                            }
                          />
                        </label>
                      </div>
                    </div>

                    <div>
                      <label className="text-sm font-bold text-slate-900 mb-2 block">
                        Principal/Admin Image
                      </label>
                      <div className="space-y-3">
                        {localSettings?.about?.principalImage && (
                          <div className="relative w-full h-40 rounded-xl overflow-hidden border-2 border-slate-200">
                            <img
                              src={localSettings.about.principalImage}
                              alt="Principal"
                              className="w-full h-full object-cover"
                            />
                          </div>
                        )}
                        <label className="flex items-center justify-center gap-2 px-4 py-3 bg-white border-2 border-dashed border-slate-300 rounded-xl cursor-pointer hover:border-primary hover:bg-primary/5 transition-all">
                          <ImageIcon className="w-5 h-5 text-slate-400" />
                          <span className="text-sm font-bold text-slate-600">
                            Change Principal Image
                          </span>
                          <input
                            type="file"
                            accept="image/*"
                            className="hidden"
                            onChange={(e) =>
                              handleImageUpload(e.target.files?.[0], (res) =>
                                handleUpdate("about.principalImage", res)
                              )
                            }
                          />
                        </label>
                      </div>
                    </div>
                  </div>

                  <div>
                    <label className="text-sm font-bold text-slate-900 mb-4 block">
                      Key Highlights (Bullets)
                    </label>
                    <div className="space-y-3">
                      {(localSettings?.about?.highlights || []).map((h, i) => (
                        <div key={i} className="flex gap-2">
                          <input
                            type="text"
                            value={h}
                            onChange={(e) => {
                              const newHighlights = [
                                ...(localSettings?.about?.highlights || []),
                              ];
                              newHighlights[i] = e.target.value;
                              handleUpdate("about.highlights", newHighlights);
                            }}
                            className="flex-1 px-4 py-2 bg-slate-50 border border-slate-200 rounded-xl text-sm"
                          />
                          <button
                            type="button"
                            onClick={() => {
                              const newHighlights = (
                                localSettings?.about?.highlights || []
                              ).filter((_, idx) => idx !== i);
                              handleUpdate("about.highlights", newHighlights);
                            }}
                            className="p-2 text-red-400 hover:text-red-500"
                          >
                            <Trash2 className="w-4 h-4" />
                          </button>
                        </div>
                      ))}
                      <button
                        type="button"
                        onClick={() =>
                          handleUpdate("about.highlights", [
                            ...(localSettings?.about?.highlights || []),
                            "",
                          ])
                        }
                        className="text-xs font-bold text-primary cursor-pointer"
                      >
                        + Add Highlight
                      </button>
                    </div>
                  </div>
                </div>
              )}

              {activeTab === "gallery" && (
                <div className="space-y-6 animate-in slide-in-from-right-4 duration-300">
                  <div className="flex items-center justify-between">
                    <h3 className="font-bold text-slate-900">Photo Gallery</h3>
                  </div>
                  <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4">
                    {(localSettings?.gallery?.photos || []).map((src, i) => (
                      <div
                        key={i}
                        className="relative aspect-square rounded-2xl overflow-hidden group border border-slate-200"
                      >
                        <img
                          src={src}
                          className="w-full h-full object-cover"
                          alt="Gallery"
                        />
                        <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-2">
                          <button
                            type="button"
                            onClick={() => {
                              const next = (
                                localSettings?.gallery?.photos || []
                              ).filter((_, idx) => idx !== i);
                              handleUpdate("gallery.photos", next);
                            }}
                            className="p-2 bg-red-500/80 hover:bg-red-600 text-white rounded-lg transition-all cursor-pointer"
                          >
                            <Trash2 className="w-4 h-4" />
                          </button>
                        </div>
                      </div>
                    ))}
                    <label className="aspect-square rounded-2xl border-2 border-dashed border-slate-200 flex flex-col items-center justify-center text-slate-400 hover:border-primary hover:text-primary transition-all cursor-pointer">
                      <Plus className="w-6 h-6 mb-2" />
                      <span className="text-xs font-bold uppercase tracking-widest">
                        Add Photo
                      </span>
                      <input
                        type="file"
                        accept="image/*"
                        className="hidden"
                        onChange={(e) =>
                          handleImageUpload(e.target.files?.[0], (res) =>
                            handleUpdate("gallery.photos", [
                              ...(localSettings?.gallery?.photos || []),
                              res,
                            ])
                          )
                        }
                      />
                    </label>
                  </div>
                </div>
              )}

              {activeTab === "faculty" && (
                <div className="space-y-6 animate-in slide-in-from-right-4 duration-300">
                  <div>
                    <h3 className="font-bold text-slate-900">
                      Teachers & Staff (Synced Automatically from Staff Directory)
                    </h3>
                    <p className="text-xs text-slate-500 mt-1">
                      শিক্ষক ও স্টাফ তালিকা সরাসরি আপনার প্রতিষ্ঠানের Staff ডাটাবেস থেকে লোড হয়।
                    </p>
                  </div>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {(localSettings?.teachers?.items || []).map((item, i) => (
                      <div
                        key={item.id || i}
                        className="p-4 bg-slate-50 rounded-2xl flex items-center gap-4 border border-slate-100"
                      >
                        <div className="w-16 h-16 rounded-xl overflow-hidden bg-slate-200 flex-shrink-0">
                          <img
                            src={item.image || "/portal/Teacher/teacher5.png"}
                            alt={item.name}
                            className="w-full h-full object-cover"
                          />
                        </div>
                        <div className="flex-1 min-w-0">
                          <p className="font-bold text-sm text-slate-900 truncate">
                            {item.name}
                          </p>
                          <p className="text-xs text-primary font-bold truncate">
                            {item.role}
                          </p>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {activeTab === "footer" && (
                <div className="space-y-6 animate-in slide-in-from-right-4 duration-300">
                  <div>
                    <label className="text-sm font-bold text-slate-900 mb-2 block">
                      Footer About Text
                    </label>
                    <textarea
                      rows="3"
                      value={localSettings?.footer?.aboutText || ""}
                      onChange={(e) =>
                        handleUpdate("footer.aboutText", e.target.value)
                      }
                      className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl outline-none"
                    />
                  </div>
                  <div>
                    <label className="text-sm font-bold text-slate-900 mb-2 block">
                      Copyright Text
                    </label>
                    <input
                      type="text"
                      value={localSettings?.footer?.copyright || ""}
                      onChange={(e) =>
                        handleUpdate("footer.copyright", e.target.value)
                      }
                      className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl outline-none"
                    />
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
