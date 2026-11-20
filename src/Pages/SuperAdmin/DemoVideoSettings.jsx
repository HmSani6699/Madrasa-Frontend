import { useState, useEffect } from "react";
import { createPortal } from "react-dom";
import { Link } from "react-router-dom";
import {
  Video,
  Play,
  Edit,
  RefreshCw,
  ExternalLink,
  X,
  Save,
  CheckCircle2,
  Globe,
  Film,
  Sparkles,
  Youtube
} from "lucide-react";
import adminService from "../../services/adminService";
import { toast } from "react-hot-toast";

const DEFAULT_VIDEO_CONFIG = {
  videoUrl: "https://www.youtube.com/watch?v=ScMzIvxBSi4",
  embedUrl: "https://www.youtube-nocookie.com/embed/ScMzIvxBSi4",
  title: "মাদ্রাসা ম্যানেজমেন্ট সফটওয়্যার পরিচিতি ও ডেমো ভিডিও",
  description: "ভিডিওর মাধ্যমে সফটওয়্যারটির সকল আধুনিক ফিচার ও ব্যবহারবিধি বিস্তারিত দেখে নিন",
  isActive: true
};

// Helper: Extract YouTube ID
const getYouTubeId = (url) => {
  if (!url || typeof url !== "string") return null;
  const match = url.match(
    /(?:youtu\.be\/|youtube\.com\/(?:embed\/|v\/|watch\?v=|watch\?.+&v=|shorts\/))([\w-]{11})/
  );
  return match ? match[1] : null;
};

// Helper: Compute embed URL
const computeEmbedUrl = (url) => {
  if (!url || typeof url !== "string") return "";
  const trimmed = url.trim();

  if (trimmed.includes("/embed/")) {
    return trimmed;
  }

  const ytId = getYouTubeId(trimmed);
  if (ytId) {
    return `https://www.youtube-nocookie.com/embed/${ytId}`;
  }

  const vimeoMatch = trimmed.match(/vimeo\.com\/(?:video\/)?([0-9]+)/);
  if (vimeoMatch && vimeoMatch[1]) {
    return `https://player.vimeo.com/video/${vimeoMatch[1]}`;
  }

  return trimmed;
};

const DemoVideoSettings = () => {
  const [videoData, setVideoData] = useState(DEFAULT_VIDEO_CONFIG);
  const [loading, setLoading] = useState(true);

  // Edit Modal State
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [editingForm, setEditingForm] = useState({
    videoUrl: "",
    title: "",
    description: "",
    isActive: true
  });
  const [isSaving, setIsSaving] = useState(false);

  // Preview Modal State
  const [isPreviewModalOpen, setIsPreviewModalOpen] = useState(false);

  useEffect(() => {
    fetchSettings();
  }, []);

  const fetchSettings = async () => {
    try {
      setLoading(true);
      const res = await adminService.getDemoVideoSettings();
      if (res?.success && res?.data) {
        setVideoData({
          videoUrl: res.data.videoUrl || DEFAULT_VIDEO_CONFIG.videoUrl,
          embedUrl: res.data.embedUrl || computeEmbedUrl(res.data.videoUrl),
          title: res.data.title || DEFAULT_VIDEO_CONFIG.title,
          description: res.data.description || DEFAULT_VIDEO_CONFIG.description,
          isActive: res.data.isActive !== undefined ? res.data.isActive : true,
          updatedAt: res.data.updatedAt || new Date()
        });
      } else {
        setVideoData(DEFAULT_VIDEO_CONFIG);
      }
    } catch (err) {
      console.error("Failed to load demo video settings:", err);
      toast.error("ভিডিও তথ্য লোড করতে সমস্যা হয়েছে");
      setVideoData(DEFAULT_VIDEO_CONFIG);
    } finally {
      setLoading(false);
    }
  };

  const handleOpenEdit = () => {
    setEditingForm({
      videoUrl: videoData.videoUrl || "",
      title: videoData.title || "",
      description: videoData.description || "",
      isActive: videoData.isActive !== undefined ? videoData.isActive : true
    });
    setIsEditModalOpen(true);
  };

  const handleEditChange = (e) => {
    const { name, value, type, checked } = e.target;
    setEditingForm((prev) => ({
      ...prev,
      [name]: type === "checkbox" ? checked : value
    }));
  };

  const handleSaveVideo = async (e) => {
    e.preventDefault();

    if (!editingForm.videoUrl.trim()) {
      toast.error("অনুগ্রহ করে ভিডিও লিঙ্ক দিন");
      return;
    }

    try {
      setIsSaving(true);
      const res = await adminService.updateDemoVideoSettings(editingForm);
      if (res?.success) {
        toast.success(res.message || "ভিডিও সেটিংস সফলভাবে সংরক্ষিত হয়েছে");
        setVideoData({
          ...editingForm,
          embedUrl: computeEmbedUrl(editingForm.videoUrl),
          updatedAt: new Date()
        });
        setIsEditModalOpen(false);
      } else {
        toast.error(res?.message || "সংরক্ষণ ব্যর্থ হয়েছে");
      }
    } catch (err) {
      console.error("Save error:", err);
      toast.error("সার্ভার এরর: ভিডিও সংরক্ষণ করা যায়নি");
    } finally {
      setIsSaving(false);
    }
  };

  const ytId = getYouTubeId(videoData.videoUrl);
  const editingEmbedUrl = computeEmbedUrl(editingForm.videoUrl);

  return (
    <div className="space-y-6 font-bangla animate-fade-in pb-12">
      {/* Top Header - Matching DemoRequests.jsx Style */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-gray-900 flex items-center gap-2">
            <span>ডেমো ভিডিও সেটিংস</span>
            <span className="text-xs bg-emerald-100 text-emerald-800 font-bold px-2.5 py-0.5 rounded-full">
              ১টি কনফিগারেশন
            </span>
          </h1>
          <p className="text-gray-500 text-sm mt-0.5">
            ফ্রি ডেমো আবেদন পেজে প্রদর্শিত পরিচিতি ভিডিও ডায়নামিকালি পরিবর্তন ও নিয়ন্ত্রণ করুন।
          </p>
        </div>

        {/* Controls: Refresh, Change Video & Public Link */}
        <div className="flex flex-wrap items-center gap-3">
          {/* Refresh Button */}
          <button
            type="button"
            onClick={fetchSettings}
            className="inline-flex items-center justify-center gap-2 bg-[#123628] border border-gray-200 hover:bg-emerald-600 hover:border-gray-300 text-gray-300 px-4 py-2 rounded-[8px] text-sm font-semibold transition-all shadow-xs cursor-pointer active:scale-95 shrink-0"
            title="রিফ্রেশ করুন"
          >
            <RefreshCw className={`w-4 h-4 ${loading ? "animate-spin text-emerald-600" : "text-gray-300"}`} />
            <span>রিফ্রেশ</span>
          </button>

          {/* Edit / Change Video Button */}
          <button
            type="button"
            onClick={handleOpenEdit}
            className="inline-flex items-center justify-center gap-2 bg-[#1C7D5A] hover:bg-[#145a40] text-white px-4 py-2 rounded-[8px] text-sm font-semibold transition-all shadow-xs cursor-pointer active:scale-95 shrink-0"
          >
            <Edit className="w-4 h-4" />
            <span>ভিডিও পরিবর্তন করুন</span>
          </button>

          {/* Public Page Link */}
          <Link
            to="/free-demo"
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center justify-center gap-2 bg-emerald-50 border border-emerald-200 hover:bg-emerald-100 text-[#1C7D5A] px-3.5 py-2 rounded-[8px] text-sm font-semibold transition-all shadow-xs shrink-0 active:scale-95"
            title="পাবলিক পেজ দেখুন"
          >
            <ExternalLink className="w-4 h-4 text-[#1C7D5A]" />
            <span>পাবলিক পেজ দেখুন</span>
          </Link>
        </div>
      </div>

      {/* Videos Table - Matching DemoRequests.jsx Table Design */}
      <div className="bg-white rounded-[8px] border border-gray-200 shadow-xs overflow-hidden">
        {loading ? (
          <div className="p-12 text-center text-gray-400">
            <RefreshCw className="w-8 h-8 animate-spin mx-auto mb-3 text-emerald-600" />
            <p className="text-sm">ভিডিও তথ্য লোড হচ্ছে...</p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left text-sm text-gray-600">
              <thead className="bg-[#123628] border-b border-gray-200 text-gray-300 font-bold text-xs uppercase tracking-wider">
                <tr className="whitespace-nowrap">
                  <th className="py-3.5 px-4">ভিডিও ও থাম্বনেইল</th>
                  <th className="py-3.5 px-4">ভিডিও লিঙ্ক (URL)</th>
                  <th className="py-3.5 px-4">বিবরণ / সাবটাইটেল</th>
                  <th className="py-3.5 px-4">স্ট্যাটাস</th>
                  <th className="py-3.5 px-4">সর্বশেষ আপডেট</th>
                  <th className="py-3.5 px-4 text-right">অ্যাকশন</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100">
                <tr
                  className="hover:bg-emerald-50/20 transition-colors group cursor-pointer"
                  onClick={() => setIsPreviewModalOpen(true)}
                >
                  {/* Thumbnail & Title */}
                  <td className="py-3.5 px-4">
                    <div className="flex items-center gap-3">
                      <div className="relative w-24 h-14 bg-slate-900 rounded-lg overflow-hidden shrink-0 border border-slate-200 shadow-xs flex items-center justify-center">
                        {ytId ? (
                          <img
                            src={`https://img.youtube.com/vi/${ytId}/mqdefault.jpg`}
                            alt={videoData.title}
                            className="w-full h-full object-cover"
                          />
                        ) : (
                          <Video className="w-6 h-6 text-white/70" />
                        )}
                        <div className="absolute inset-0 bg-black/35 group-hover:bg-black/15 transition-colors flex items-center justify-center">
                          <div className="w-7 h-7 rounded-full bg-white/90 flex items-center justify-center shadow-md">
                            <Play className="w-3.5 h-3.5 text-emerald-800 fill-emerald-800 ml-0.5" />
                          </div>
                        </div>
                      </div>
                      <div className="min-w-0 max-w-[260px]">
                        <div className="font-bold text-gray-900 group-hover:text-emerald-700 transition-colors line-clamp-1">
                          {videoData.title || "মাদ্রাসা ডেমো পরিচিতি ভিডিও"}
                        </div>
                        <div className="text-xs text-gray-500 flex items-center gap-1.5 mt-0.5">
                          <span className="inline-block px-2 py-0.5 bg-emerald-50 text-emerald-800 border border-emerald-200 rounded text-[11px] font-medium">
                            ফ্রি ডেমো ভিডিও (Primary)
                          </span>
                        </div>
                      </div>
                    </div>
                  </td>

                  {/* Video Link */}
                  <td className="py-3.5 px-4" onClick={(e) => e.stopPropagation()}>
                    <div className="flex items-center gap-2">
                      <a
                        href={videoData.videoUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="inline-flex items-center gap-1.5 bg-slate-100 hover:bg-slate-200 text-slate-700 font-mono text-xs px-2.5 py-1.5 rounded-lg border border-slate-200 transition-all max-w-[220px] truncate"
                        title="সরাসরি লিঙ্কে ভিজিট করুন"
                      >
                        <Youtube className="w-3.5 h-3.5 text-rose-500 shrink-0" />
                        <span className="truncate">{videoData.videoUrl}</span>
                        <ExternalLink className="w-3 h-3 text-slate-400 shrink-0" />
                      </a>
                    </div>
                  </td>

                  {/* Description */}
                  <td className="py-3.5 px-4 max-w-[260px]">
                    <p className="text-xs text-gray-600 line-clamp-2 leading-relaxed">
                      {videoData.description || "কোনো বিবরণ প্রদান করা হয়নি"}
                    </p>
                  </td>

                  {/* Status */}
                  <td className="py-3.5 px-4" onClick={(e) => e.stopPropagation()}>
                    <span
                      className={`inline-flex items-center gap-1.5 text-xs font-semibold px-2.5 py-1 rounded-full border ${videoData.isActive
                          ? "bg-emerald-50 text-emerald-700 border-emerald-200"
                          : "bg-rose-50 text-rose-700 border-rose-200"
                        }`}
                    >
                      <span
                        className={`w-1.5 h-1.5 rounded-full ${videoData.isActive ? "bg-emerald-600" : "bg-rose-500"
                          }`}
                      />
                      <span>{videoData.isActive ? "সক্রিয় (Active)" : "নিষ্ক্রিয় (Inactive)"}</span>
                    </span>
                  </td>

                  {/* Date */}
                  <td className="py-3.5 px-4 text-xs text-gray-500 whitespace-nowrap">
                    {videoData.updatedAt
                      ? new Date(videoData.updatedAt).toLocaleDateString("bn-BD", {
                        day: "numeric",
                        month: "short",
                        year: "numeric"
                      })
                      : "-"}
                  </td>

                  {/* Actions */}
                  <td className="py-3.5 px-4 text-right" onClick={(e) => e.stopPropagation()}>
                    <div className="flex items-center justify-end gap-1.5">
                      <button
                        onClick={() => setIsPreviewModalOpen(true)}
                        className="p-1.5 hover:bg-emerald-50 text-emerald-700 rounded-lg transition-colors cursor-pointer"
                        title="ভিডিও প্লে করে দেখুন"
                      >
                        <Play className="w-4 h-4 fill-emerald-700" />
                      </button>
                      <button
                        onClick={handleOpenEdit}
                        className="p-1.5 hover:bg-gray-100 text-[#1C7D5A] rounded-lg transition-colors cursor-pointer"
                        title="ভিডিও সেটিংস পরিবর্তন করুন"
                      >
                        <Edit className="w-4 h-4" />
                      </button>
                    </div>
                  </td>
                </tr>
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* Edit Video Modal - Matching DemoRequests Detail Modal Style */}
      {isEditModalOpen && createPortal(
        <div className="fixed inset-0 z-[9999] overflow-y-auto bg-slate-900/60 backdrop-blur-sm p-4 sm:p-6 flex justify-center items-center">
          {/* Backdrop click to close */}
          <div
            className="fixed inset-0"
            onClick={() => setIsEditModalOpen(false)}
          />

          <div className="relative my-auto bg-white rounded-2xl sm:rounded-3xl max-w-xl w-full shadow-2xl border border-slate-100 z-10 max-h-[90vh] flex flex-col overflow-hidden">
            {/* Modal Header - Fixed at Top */}
            <div className="p-5 sm:p-6 pb-4 border-b border-gray-100 flex items-center justify-between gap-3 shrink-0 bg-white">
              <div className="flex items-center gap-3 min-w-0">
                <div className="w-11 h-11 rounded-2xl bg-emerald-100 text-[#1C7D5A] flex items-center justify-center shrink-0">
                  <Video className="w-6 h-6" />
                </div>
                <div className="min-w-0">
                  <h3 className="text-xl font-bold text-gray-900 truncate">ভিডিও পরিবর্তন করুন</h3>
                  <p className="text-xs text-gray-500">
                    ফ্রি ডেমো আবেদন পেজের ভিডিও লিংক ও টেক্সট আপডেট করুন
                  </p>
                </div>
              </div>

              {/* Close Button */}
              <button
                type="button"
                onClick={() => setIsEditModalOpen(false)}
                className="text-gray-400 hover:text-gray-700 p-2 rounded-full hover:bg-gray-100 transition-colors shrink-0 cursor-pointer"
                title="বন্ধ করুন"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Form wrapping scrollable body and fixed footer */}
            <form onSubmit={handleSaveVideo} className="flex flex-col flex-1 overflow-hidden">
              {/* Scrollable Body */}
              <div className="p-5 sm:p-6 overflow-y-auto space-y-4 flex-1">
                {/* Video URL */}
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-1.5">
                    ইউটিউব / ভিডিও লিঙ্ক <span className="text-rose-500">*</span>
                  </label>
                  <div className="relative">
                    <Youtube className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-rose-500" />
                    <input
                      type="url"
                      name="videoUrl"
                      required
                      placeholder="https://www.youtube.com/watch?v=..."
                      value={editingForm.videoUrl}
                      onChange={handleEditChange}
                      className="w-full pl-10 pr-4 py-2.5 rounded-[8px] border border-gray-200 focus:border-emerald-600 focus:ring-2 focus:ring-emerald-500/20 outline-none text-sm transition-all font-mono"
                    />
                  </div>
                  <p className="text-[11px] text-gray-400 mt-1">
                    ইউটিউব ওয়াচ লিঙ্ক, শর্ট লিঙ্ক (youtu.be), বা এমবেড লিঙ্ক সাপোর্ট করে।
                  </p>
                </div>

                {/* Title */}
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-1.5">
                    ভিডিওর শিরোনাম (Title)
                  </label>
                  <input
                    type="text"
                    name="title"
                    placeholder="উদাঃ মাদ্রাসা ম্যানেজমেন্ট সফটওয়্যার ডেমো ভিডিও"
                    value={editingForm.title}
                    onChange={handleEditChange}
                    className="w-full px-4 py-2.5 rounded-[8px] border border-gray-200 focus:border-emerald-600 focus:ring-2 focus:ring-emerald-500/20 outline-none text-sm transition-all"
                  />
                </div>

                {/* Description */}
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-1.5">
                    সংক্ষিপ্ত বিবরণ (Description)
                  </label>
                  <textarea
                    name="description"
                    rows={3}
                    placeholder="ভিডিওর বিবরণ বা সাবটাইটেল লিখুন..."
                    value={editingForm.description}
                    onChange={handleEditChange}
                    className="w-full px-4 py-2.5 rounded-[8px] border border-gray-200 focus:border-emerald-600 focus:ring-2 focus:ring-emerald-500/20 outline-none text-sm transition-all resize-none"
                  />
                </div>

                {/* Status Toggle */}
                <div className="flex items-center justify-between p-3.5 bg-gray-50 rounded-[8px] border border-gray-200/80">
                  <div>
                    <span className="text-sm font-semibold text-gray-800 block">ভিডিও প্রদর্শন স্ট্যাটাস</span>
                    <span className="text-xs text-gray-500">চালু থাকলে পাবলিক পেজে ভিডিও প্রদর্শিত হবে</span>
                  </div>
                  <label className="relative inline-flex items-center cursor-pointer">
                    <input
                      type="checkbox"
                      name="isActive"
                      checked={editingForm.isActive}
                      onChange={handleEditChange}
                      className="sr-only peer"
                    />
                    <div className="w-11 h-6 bg-gray-300 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-[#1C7D5A]" />
                  </label>
                </div>

                {/* Real-time Video Preview Inside Modal */}
                {editingEmbedUrl && (
                  <div>
                    <label className="block text-xs font-semibold text-gray-500 mb-1.5 uppercase tracking-wider">
                      ভিডিও প্রিভিউ
                    </label>
                    <div className="relative w-full aspect-video rounded-xl overflow-hidden bg-slate-900 border border-gray-200 shadow-sm">
                      <iframe
                        className="w-full h-full object-cover"
                        src={editingEmbedUrl}
                        title="ভিডিও প্রিভিউ"
                        allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                        allowFullScreen
                      />
                    </div>
                  </div>
                )}
              </div>

              {/* Fixed Footer */}
              <div className="p-4 sm:p-5 border-t border-gray-100 bg-gray-50/80 flex items-center justify-end gap-3 shrink-0">
                <button
                  type="button"
                  onClick={() => setIsEditModalOpen(false)}
                  className="px-5 py-2.5 border border-gray-200 text-gray-600 hover:bg-gray-100 bg-white font-semibold rounded-[8px] text-sm transition-all cursor-pointer"
                >
                  বাতিল
                </button>
                <button
                  type="submit"
                  disabled={isSaving}
                  className="px-6 py-2.5 bg-[#1C7D5A] hover:bg-[#145a40] text-white font-semibold rounded-[8px] text-sm shadow-xs transition-all flex items-center gap-2 disabled:opacity-60 cursor-pointer"
                >
                  {isSaving ? (
                    <>
                      <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                      <span>সংরক্ষণ হচ্ছে...</span>
                    </>
                  ) : (
                    <>
                      <Save className="w-4 h-4" />
                      <span>সংরক্ষণ করুন</span>
                    </>
                  )}
                </button>
              </div>
            </form>
          </div>
        </div>,
        document.body
      )}

      {/* Video Watch / Preview Modal */}
      {isPreviewModalOpen && createPortal(
        <div className="fixed inset-0 z-[9999] overflow-y-auto bg-slate-950/80 backdrop-blur-sm p-4 sm:p-6 flex justify-center items-center">
          {/* Backdrop click to close */}
          <div
            className="fixed inset-0"
            onClick={() => setIsPreviewModalOpen(false)}
          />

          <div className="relative my-auto bg-white rounded-2xl sm:rounded-3xl max-w-2xl w-full p-4 sm:p-6 shadow-2xl border border-slate-100 z-10 max-h-[92vh] flex flex-col overflow-hidden">
            {/* Header with Title & Close Button */}
            <div className="flex items-center justify-between pb-3 border-b border-gray-100 mb-3 shrink-0">
              <div className="flex items-center gap-2.5 min-w-0">
                <div className="w-8 h-8 rounded-lg bg-emerald-100 text-emerald-800 flex items-center justify-center shrink-0">
                  <Play className="w-4 h-4 fill-emerald-800" />
                </div>
                <h3 className="font-bold text-gray-900 text-base truncate">
                  {videoData.title || "ডেমো ভিডিও প্রিভিউ"}
                </h3>
              </div>

              {/* Close Button */}
              <button
                type="button"
                onClick={() => setIsPreviewModalOpen(false)}
                className="text-gray-400 hover:text-gray-700 p-1.5 rounded-full hover:bg-gray-100 transition-colors shrink-0 cursor-pointer"
                title="বন্ধ করুন"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Video Player (16:9) */}
            <div className="relative w-full aspect-video rounded-xl overflow-hidden bg-black shadow-lg border border-slate-800 shrink-0">
              <iframe
                className="w-full h-full object-cover"
                src={videoData.embedUrl || computeEmbedUrl(videoData.videoUrl)}
                title={videoData.title || "ডেমো ভিডিও"}
                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
                allowFullScreen
              />
            </div>

            {/* Info Footer */}
            <div className="mt-3 flex flex-col sm:flex-row sm:items-center justify-between gap-3 shrink-0 pt-2 border-t border-gray-100">
              <p className="text-xs text-gray-500 line-clamp-1">{videoData.description || "কোনো বিবরণ দেওয়া হয়নি"}</p>

              <div className="flex items-center gap-2 shrink-0">
                <button
                  type="button"
                  onClick={() => {
                    setIsPreviewModalOpen(false);
                    handleOpenEdit();
                  }}
                  className="px-4 py-2 bg-[#1C7D5A] hover:bg-[#145a40] text-white text-xs font-semibold rounded-[8px] transition-all flex items-center gap-1.5 cursor-pointer"
                >
                  <Edit className="w-3.5 h-3.5" />
                  <span>এডিট করুন</span>
                </button>
                <button
                  type="button"
                  onClick={() => setIsPreviewModalOpen(false)}
                  className="px-4 py-2 border border-gray-200 text-gray-600 hover:bg-gray-50 text-xs font-semibold rounded-[8px] transition-all cursor-pointer"
                >
                  বন্ধ করুন
                </button>
              </div>
            </div>
          </div>
        </div>,
        document.body
      )}
    </div>
  );
};

export default DemoVideoSettings;
