import { useState, useEffect } from "react";
import { createPortal } from "react-dom";
import {
  Video,
  Play,
  Plus,
  Edit,
  Trash2,
  RefreshCw,
  Search,
  ExternalLink,
  X,
  Save,
  CheckCircle2,
  Star,
  Building2,
  User,
  Quote,
  Eye,
  Film,
  Sparkles,
  AlertCircle
} from "lucide-react";
import adminService from "../../services/adminService";
import { toast } from "react-hot-toast";

// Helper: Extract YouTube ID
const getYouTubeId = (url) => {
  if (!url || typeof url !== "string") return null;
  const match = url.trim().match(
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
  return trimmed;
};

// Helper: Compute thumbnail
const computeThumbnailUrl = (url) => {
  const ytId = getYouTubeId(url);
  if (ytId) {
    return `https://img.youtube.com/vi/${ytId}/hqdefault.jpg`;
  }
  return "";
};

const INITIAL_FORM = {
  reviewerName: "",
  designation: "মুহতামিম / প্রিন্সিপাল",
  madrasaName: "",
  videoUrl: "",
  rating: 5,
  quote: "",
  order: 1,
  isActive: true
};

const ReviewSettings = () => {
  const [reviews, setReviews] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");

  // Create / Edit Modal State
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingId, setEditingId] = useState(null);
  const [formData, setFormData] = useState(INITIAL_FORM);
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Video Preview Modal State
  const [previewVideo, setPreviewVideo] = useState(null);

  // Delete Confirmation State
  const [deletingReview, setDeletingReview] = useState(null);
  const [isDeleting, setIsDeleting] = useState(false);

  useEffect(() => {
    fetchReviews();
  }, [statusFilter]);

  const fetchReviews = async (searchQuery = searchTerm) => {
    try {
      setLoading(true);
      const params = {};
      if (statusFilter !== "all") params.status = statusFilter;
      if (searchQuery && searchQuery.trim()) params.search = searchQuery.trim();

      const res = await adminService.getAllReviews(params);
      if (res?.success && Array.isArray(res.data)) {
        setReviews(res.data);
      } else {
        setReviews([]);
      }
    } catch (err) {
      console.error("Failed to fetch reviews:", err);
      toast.error("ভিডিও রিভিউ লোড করতে সমস্যা হয়েছে");
    } finally {
      setLoading(false);
    }
  };

  const handleSearchSubmit = (e) => {
    e.preventDefault();
    fetchReviews(searchTerm);
  };

  const handleOpenCreateModal = () => {
    setEditingId(null);
    setFormData({
      ...INITIAL_FORM,
      order: reviews.length + 1
    });
    setIsModalOpen(true);
  };

  const handleOpenEditModal = (review) => {
    setEditingId(review._id);
    setFormData({
      reviewerName: review.reviewerName || "",
      designation: review.designation || "মুহতামিম / প্রিন্সিপাল",
      madrasaName: review.madrasaName || "",
      videoUrl: review.videoUrl || "",
      rating: review.rating || 5,
      quote: review.quote || "",
      order: review.order || 1,
      isActive: review.isActive !== undefined ? review.isActive : true
    });
    setIsModalOpen(true);
  };

  const handleSubmitForm = async (e) => {
    e.preventDefault();

    if (!formData.reviewerName.trim()) {
      toast.error("রিভিউয়ারের নাম আবশ্যক");
      return;
    }
    if (!formData.madrasaName.trim()) {
      toast.error("মাদ্রাসার নাম আবশ্যক");
      return;
    }
    if (!formData.videoUrl.trim()) {
      toast.error("ইউটিউব ভিডিও লিঙ্ক আবশ্যক");
      return;
    }

    const ytId = getYouTubeId(formData.videoUrl);
    if (!ytId) {
      toast.error("সঠিক ইউটিউব ভিডিও লিঙ্ক প্রদান করুন (যেমন: https://www.youtube.com/watch?v=...)");
      return;
    }

    try {
      setIsSubmitting(true);
      if (editingId) {
        const res = await adminService.updateReview(editingId, formData);
        if (res?.success) {
          toast.success("ভিডিও রিভিউ সফলভাবে আপডেট হয়েছে");
          setIsModalOpen(false);
          fetchReviews();
        } else {
          toast.error(res?.message || "আপডেট ব্যর্থ হয়েছে");
        }
      } else {
        const res = await adminService.createReview(formData);
        if (res?.success) {
          toast.success("নতুন ভিডিও রিভিউ সফলভাবে যুক্ত হয়েছে");
          setIsModalOpen(false);
          fetchReviews();
        } else {
          toast.error(res?.message || "রিভিউ তৈরি ব্যর্থ হয়েছে");
        }
      }
    } catch (err) {
      console.error("Save review error:", err);
      toast.error(err.response?.data?.message || "সংরক্ষণ করতে সমস্যা হয়েছে");
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleToggleStatus = async (review) => {
    try {
      const res = await adminService.toggleReviewStatus(review._id, !review.isActive);
      if (res?.success) {
        toast.success(res.message || "স্ট্যাটাস পরিবর্তিত হয়েছে");
        setReviews((prev) =>
          prev.map((r) => (r._id === review._id ? { ...r, isActive: !r.isActive } : r))
        );
      }
    } catch (err) {
      console.error("Toggle status error:", err);
      toast.error("স্ট্যাটাস পরিবর্তন ব্যর্থ হয়েছে");
    }
  };

  const handleDeleteConfirm = async () => {
    if (!deletingReview) return;
    try {
      setIsDeleting(true);
      const res = await adminService.deleteReview(deletingReview._id);
      if (res?.success) {
        toast.success("রিভিউটি সফলভাবে মুছে ফেলা হয়েছে");
        setDeletingReview(null);
        fetchReviews();
      } else {
        toast.error(res?.message || "মুছতে সমস্যা হয়েছে");
      }
    } catch (err) {
      console.error("Delete review error:", err);
      toast.error("রিভিউ মুছতে সমস্যা হয়েছে");
    } finally {
      setIsDeleting(false);
    }
  };

  // Preview YouTube video in modal
  const handlePreview = (review) => {
    const embedUrl = review.embedUrl || computeEmbedUrl(review.videoUrl);
    setPreviewVideo({
      ...review,
      embedUrl
    });
  };

  // Stats calculation
  const totalReviews = reviews.length;
  const activeReviews = reviews.filter((r) => r.isActive).length;
  const inactiveReviews = totalReviews - activeReviews;

  // Form preview helpers
  const currentYtId = getYouTubeId(formData.videoUrl);
  const currentThumb = computeThumbnailUrl(formData.videoUrl);

  return (
    <div className="p-4 sm:p-6 lg:p-8 space-y-6 max-w-7xl mx-auto font-bangla">
      {/* Top Header */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 bg-white p-6 rounded-2xl border border-slate-100 shadow-sm">
        <div>
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-emerald-500 to-teal-700 flex items-center justify-center text-white shadow-md shadow-emerald-500/20">
              <Film className="w-6 h-6" />
            </div>
            <div>
              <h1 className="text-2xl font-black text-slate-800 tracking-tight flex items-center gap-2">
                ভিডিও রিভিউ ও প্রশংসাপত্র
                <span className="text-xs font-semibold px-2.5 py-0.5 rounded-full bg-emerald-50 text-emerald-700 border border-emerald-200">
                  হোমপেজ CMS
                </span>
              </h1>
              <p className="text-xs sm:text-sm text-slate-500 mt-0.5">
                ওয়েবসাইটের হোমপেজে গ্রাহকদের ভিডিও রিভিউ নিয়ন্ত্রণ করুন (ইউটিউব লিঙ্ক দ্বারা)
              </p>
            </div>
          </div>
        </div>

        <div className="flex items-center gap-2 w-full sm:w-auto">
          <button
            onClick={() => fetchReviews()}
            disabled={loading}
            className="p-2.5 text-slate-600 hover:text-emerald-700 hover:bg-emerald-50 rounded-xl border border-slate-200 transition-all cursor-pointer"
            title="রিফ্রেশ করুন"
          >
            <RefreshCw className={`w-4 h-4 ${loading ? "animate-spin text-emerald-600" : ""}`} />
          </button>
          <button
            onClick={handleOpenCreateModal}
            className="flex-1 sm:flex-none inline-flex items-center justify-center gap-2 px-5 py-2.5 bg-gradient-to-r from-emerald-600 to-teal-700 hover:from-emerald-700 hover:to-teal-800 text-white rounded-xl font-bold text-sm shadow-md shadow-emerald-600/20 hover:shadow-lg transition-all cursor-pointer"
          >
            <Plus className="w-4 h-4" />
            নতুন রিভিউ যোগ করুন
          </button>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div className="bg-white p-5 rounded-2xl border border-slate-100 shadow-sm flex items-center gap-4">
          <div className="w-12 h-12 rounded-xl bg-blue-50 text-blue-600 flex items-center justify-center font-bold">
            <Film className="w-6 h-6" />
          </div>
          <div>
            <div className="text-2xl font-black text-slate-800">{totalReviews}</div>
            <div className="text-xs font-medium text-slate-500">মোট ভিডিও রিভিউ</div>
          </div>
        </div>

        <div className="bg-white p-5 rounded-2xl border border-slate-100 shadow-sm flex items-center gap-4">
          <div className="w-12 h-12 rounded-xl bg-emerald-50 text-emerald-600 flex items-center justify-center font-bold">
            <CheckCircle2 className="w-6 h-6" />
          </div>
          <div>
            <div className="text-2xl font-black text-emerald-600">{activeReviews}</div>
            <div className="text-xs font-medium text-slate-500">হোমপেজে দৃশ্যমান (সক্রিয়)</div>
          </div>
        </div>

        <div className="bg-white p-5 rounded-2xl border border-slate-100 shadow-sm flex items-center gap-4">
          <div className="w-12 h-12 rounded-xl bg-amber-50 text-amber-600 flex items-center justify-center font-bold">
            <Star className="w-6 h-6 fill-amber-400 text-amber-500" />
          </div>
          <div>
            <div className="text-2xl font-black text-slate-800">{inactiveReviews}</div>
            <div className="text-xs font-medium text-slate-500">অপ্রকাশিত (নিষ্ক্রিয়)</div>
          </div>
        </div>
      </div>

      {/* Filter and Search Bar */}
      <div className="bg-white p-4 rounded-2xl border border-slate-100 shadow-sm flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3">
        {/* Status Filter Tabs */}
        <div className="flex items-center gap-1 p-1 bg-slate-100 rounded-xl">
          <button
            onClick={() => setStatusFilter("all")}
            className={`px-3 py-1.5 text-xs font-bold rounded-lg transition-all cursor-pointer ${
              statusFilter === "all"
                ? "bg-white text-emerald-700 shadow-xs"
                : "text-slate-600 hover:text-slate-900"
            }`}
          >
            সবগুলো ({totalReviews})
          </button>
          <button
            onClick={() => setStatusFilter("active")}
            className={`px-3 py-1.5 text-xs font-bold rounded-lg transition-all cursor-pointer ${
              statusFilter === "active"
                ? "bg-white text-emerald-700 shadow-xs"
                : "text-slate-600 hover:text-slate-900"
            }`}
          >
            সক্রিয় ({activeReviews})
          </button>
          <button
            onClick={() => setStatusFilter("inactive")}
            className={`px-3 py-1.5 text-xs font-bold rounded-lg transition-all cursor-pointer ${
              statusFilter === "inactive"
                ? "bg-white text-emerald-700 shadow-xs"
                : "text-slate-600 hover:text-slate-900"
            }`}
          >
            নিষ্ক্রিয় ({inactiveReviews})
          </button>
        </div>

        {/* Search */}
        <form onSubmit={handleSearchSubmit} className="relative flex-1 max-w-sm">
          <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
          <input
            type="text"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            placeholder="রিভিউয়ার বা মাদ্রাসার নাম খুঁজুন..."
            className="w-full pl-9 pr-4 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs sm:text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500 transition-all"
          />
        </form>
      </div>

      {/* Reviews Cards / Grid */}
      {loading ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {[1, 2, 3].map((n) => (
            <div
              key={n}
              className="bg-white rounded-2xl border border-slate-100 p-5 shadow-sm animate-pulse space-y-4"
            >
              <div className="w-full h-44 bg-slate-200 rounded-xl" />
              <div className="h-4 bg-slate-200 rounded w-3/4" />
              <div className="h-3 bg-slate-200 rounded w-1/2" />
              <div className="h-10 bg-slate-100 rounded-xl mt-4" />
            </div>
          ))}
        </div>
      ) : reviews.length === 0 ? (
        <div className="bg-white rounded-2xl border border-slate-100 p-12 text-center max-w-md mx-auto shadow-sm">
          <div className="w-16 h-16 mx-auto mb-4 rounded-2xl bg-emerald-50 text-emerald-600 flex items-center justify-center">
            <Film className="w-8 h-8" />
          </div>
          <h3 className="text-lg font-bold text-slate-800 mb-1">কোনো ভিডিও রিভিউ পাওয়া যায়নি</h3>
          <p className="text-xs sm:text-sm text-slate-500 mb-6">
            হোমপেজের জন্য প্রথম গ্রাহক ভিডিও প্রশংসাপত্র যুক্ত করতে নিচের বাটনে চাপ দিন।
          </p>
          <button
            onClick={handleOpenCreateModal}
            className="inline-flex items-center gap-2 px-5 py-2.5 bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl font-bold text-sm shadow-md transition-all cursor-pointer"
          >
            <Plus className="w-4 h-4" />
            নতুন রিভিউ যোগ করুন
          </button>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {reviews.map((review) => {
            const thumb =
              review.thumbnailUrl ||
              computeThumbnailUrl(review.videoUrl) ||
              "https://images.unsplash.com/photo-1584697964190-705b893683f1?auto=format&fit=crop&q=80&w=800";

            return (
              <div
                key={review._id}
                className={`bg-white rounded-2xl border transition-all duration-300 flex flex-col justify-between overflow-hidden group shadow-sm hover:shadow-md ${
                  review.isActive ? "border-slate-200 hover:border-emerald-300" : "border-slate-200/60 opacity-80"
                }`}
              >
                <div>
                  {/* Video Thumbnail with Play Button */}
                  <div className="relative aspect-video bg-slate-900 overflow-hidden cursor-pointer">
                    <img
                      src={thumb}
                      alt={review.reviewerName}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                    />
                    <div className="absolute inset-0 bg-black/40 group-hover:bg-black/25 transition-colors flex items-center justify-center">
                      <button
                        type="button"
                        onClick={() => handlePreview(review)}
                        className="w-12 h-12 rounded-full bg-red-600 hover:bg-red-700 text-white flex items-center justify-center shadow-lg transform group-hover:scale-110 transition-transform cursor-pointer"
                        title="ভিডিও প্লে করুন"
                      >
                        <Play className="w-5 h-5 fill-current ml-0.5" />
                      </button>
                    </div>

                    {/* Order Badge */}
                    <div className="absolute top-3 left-3 bg-slate-900/80 backdrop-blur-md text-white text-[11px] font-bold px-2.5 py-1 rounded-lg">
                      ক্রম: #{review.order || 1}
                    </div>

                    {/* Active/Inactive Status Badge */}
                    <div className="absolute top-3 right-3">
                      <span
                        className={`text-[11px] font-bold px-2.5 py-1 rounded-lg backdrop-blur-md flex items-center gap-1 ${
                          review.isActive
                            ? "bg-emerald-600/90 text-white"
                            : "bg-rose-600/90 text-white"
                        }`}
                      >
                        {review.isActive ? "হোমপেজে দৃশ্যমান" : "নিষ্ক্রিয়"}
                      </span>
                    </div>
                  </div>

                  {/* Card Body */}
                  <div className="p-5 space-y-3">
                    {/* Stars */}
                    <div className="flex items-center gap-1">
                      {[...Array(review.rating || 5)].map((_, i) => (
                        <Star key={i} className="w-4 h-4 fill-amber-400 text-amber-400" />
                      ))}
                      <span className="text-xs font-semibold text-slate-400 ml-1">
                        ({review.rating || 5}.0)
                      </span>
                    </div>

                    {/* Quote */}
                    {review.quote ? (
                      <p className="text-xs sm:text-sm text-slate-700 font-medium italic line-clamp-3">
                        "{review.quote}"
                      </p>
                    ) : (
                      <p className="text-xs text-slate-400 italic">কোনো লিখিত বক্তব্য নেই</p>
                    )}

                    {/* Reviewer Details */}
                    <div className="pt-3 border-t border-slate-100 flex items-center gap-3">
                      <div className="w-10 h-10 rounded-full bg-emerald-100 text-emerald-800 flex items-center justify-center shrink-0">
                        <Building2 className="w-5 h-5" />
                      </div>
                      <div className="min-w-0">
                        <h4 className="text-sm font-bold text-slate-900 truncate">
                          {review.reviewerName}
                        </h4>
                        <p className="text-xs text-slate-500 truncate">
                          {review.designation} • {review.madrasaName}
                        </p>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Card Footer Actions */}
                <div className="px-5 py-3.5 bg-slate-50 border-t border-slate-100 flex items-center justify-between gap-2">
                  <div className="flex items-center gap-2">
                    <button
                      type="button"
                      onClick={() => handleToggleStatus(review)}
                      className={`text-xs font-bold px-2.5 py-1.5 rounded-lg border transition-all cursor-pointer ${
                        review.isActive
                          ? "bg-white text-emerald-700 border-emerald-200 hover:bg-emerald-50"
                          : "bg-white text-slate-600 border-slate-200 hover:bg-slate-100"
                      }`}
                    >
                      {review.isActive ? "নিষ্ক্রিয় করুন" : "সক্রিয় করুন"}
                    </button>
                    <a
                      href={review.videoUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="p-1.5 text-slate-400 hover:text-red-600 rounded-lg transition-colors cursor-pointer"
                      title="ইউটিউবে খুলুন"
                    >
                      <ExternalLink className="w-4 h-4" />
                    </a>
                  </div>

                  <div className="flex items-center gap-1">
                    <button
                      type="button"
                      onClick={() => handleOpenEditModal(review)}
                      className="p-2 text-slate-600 hover:text-emerald-700 hover:bg-white rounded-lg transition-all cursor-pointer"
                      title="সম্পাদনা করুন"
                    >
                      <Edit className="w-4 h-4" />
                    </button>
                    <button
                      type="button"
                      onClick={() => setDeletingReview(review)}
                      className="p-2 text-slate-400 hover:text-rose-600 hover:bg-rose-50 rounded-lg transition-all cursor-pointer"
                      title="মুছে ফেলুন"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* ===================== CREATE / EDIT MODAL ===================== */}
      {isModalOpen &&
        createPortal(
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs font-bangla animate-fade-in overflow-y-auto">
            <div className="bg-white rounded-2xl max-w-xl w-full p-6 sm:p-7 shadow-2xl border border-slate-100 relative my-8 max-h-[90vh] overflow-y-auto">
              <button
                type="button"
                onClick={() => setIsModalOpen(false)}
                className="absolute top-5 right-5 p-2 text-slate-400 hover:text-slate-600 hover:bg-slate-100 rounded-full transition-all cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>

              <div className="flex items-center gap-3 mb-6">
                <div className="w-10 h-10 rounded-xl bg-emerald-50 text-emerald-600 flex items-center justify-center font-bold">
                  {editingId ? <Edit className="w-5 h-5" /> : <Plus className="w-5 h-5" />}
                </div>
                <div>
                  <h3 className="text-xl font-black text-slate-800">
                    {editingId ? "ভিডিও রিভিউ সম্পাদনা" : "নতুন ভিডিও রিভিউ যোগ করুন"}
                  </h3>
                  <p className="text-xs text-slate-500">
                    ইউটিউব ভিডিও লিঙ্ক ও রিভিউয়ারের বিস্তারিত তথ্য প্রদান করুন
                  </p>
                </div>
              </div>

              <form onSubmit={handleSubmitForm} className="space-y-4">
                {/* Reviewer Name */}
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1.5">
                    রিভিউয়ারের নাম <span className="text-rose-500">*</span>
                  </label>
                  <input
                    type="text"
                    required
                    value={formData.reviewerName}
                    onChange={(e) => setFormData({ ...formData, reviewerName: e.target.value })}
                    placeholder="উদাঃ মাওলানা আবদুর রহমান"
                    className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500"
                  />
                </div>

                {/* Designation & Madrasa Name Grid */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div>
                    <label className="block text-xs font-bold text-slate-700 mb-1.5">
                      পদবী <span className="text-rose-500">*</span>
                    </label>
                    <input
                      type="text"
                      required
                      value={formData.designation}
                      onChange={(e) => setFormData({ ...formData, designation: e.target.value })}
                      placeholder="উদাঃ মুহতামিম / প্রিন্সিপাল"
                      className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-bold text-slate-700 mb-1.5">
                      মাদ্রাসার নাম <span className="text-rose-500">*</span>
                    </label>
                    <input
                      type="text"
                      required
                      value={formData.madrasaName}
                      onChange={(e) => setFormData({ ...formData, madrasaName: e.target.value })}
                      placeholder="উদাঃ দারুল উলুম মাদ্রাসা, ঢাকা"
                      className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500"
                    />
                  </div>
                </div>

                {/* YouTube Video URL */}
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1.5">
                    ইউটিউব ভিডিও লিঙ্ক (YouTube URL) <span className="text-rose-500">*</span>
                  </label>
                  <input
                    type="url"
                    required
                    value={formData.videoUrl}
                    onChange={(e) => setFormData({ ...formData, videoUrl: e.target.value })}
                    placeholder="https://www.youtube.com/watch?v=..."
                    className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500 font-mono text-xs"
                  />
                  <p className="text-[11px] text-slate-400 mt-1">
                    ইউটিউব ওয়াচ লিঙ্ক, শর্টস (Shorts) বা শেয়ার লিঙ্ক (youtu.be) গ্রহণযোগ্য।
                  </p>
                </div>

                {/* Live YouTube Preview Box */}
                {formData.videoUrl && (
                  <div className="p-3 bg-slate-50 rounded-xl border border-slate-200 space-y-2">
                    <div className="flex items-center justify-between text-xs">
                      <span className="font-bold text-slate-700 flex items-center gap-1.5">
                        <Play className="w-3.5 h-3.5 text-red-600 fill-current" />
                        ইউটিউব ভিডিও প্রিভিউ
                      </span>
                      {currentYtId ? (
                        <span className="text-emerald-600 font-semibold flex items-center gap-1">
                          <CheckCircle2 className="w-3.5 h-3.5" />
                          আইডি সনাক্ত হয়েছে ({currentYtId})
                        </span>
                      ) : (
                        <span className="text-rose-500 font-semibold flex items-center gap-1">
                          <AlertCircle className="w-3.5 h-3.5" />
                          অকার্যকর লিঙ্ক
                        </span>
                      )}
                    </div>
                    {currentYtId && (
                      <div className="relative aspect-video rounded-lg overflow-hidden border border-slate-200 bg-black">
                        <iframe
                          src={`https://www.youtube-nocookie.com/embed/${currentYtId}`}
                          title="Preview"
                          className="w-full h-full"
                          allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                          allowFullScreen
                        />
                      </div>
                    )}
                  </div>
                )}

                {/* Rating & Order */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div>
                    <label className="block text-xs font-bold text-slate-700 mb-1.5">
                      স্টার রেটিং (১-৫)
                    </label>
                    <div className="flex items-center gap-1.5 p-2 bg-slate-50 border border-slate-200 rounded-xl">
                      {[1, 2, 3, 4, 5].map((star) => (
                        <button
                          key={star}
                          type="button"
                          onClick={() => setFormData({ ...formData, rating: star })}
                          className="p-1 cursor-pointer transition-transform hover:scale-110"
                        >
                          <Star
                            className={`w-6 h-6 ${
                              star <= formData.rating
                                ? "fill-amber-400 text-amber-400"
                                : "text-slate-300"
                            }`}
                          />
                        </button>
                      ))}
                      <span className="text-xs font-bold text-slate-600 ml-auto mr-1">
                        {formData.rating} স্টার
                      </span>
                    </div>
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-slate-700 mb-1.5">
                      সিরিয়াল / প্রদর্শনের ক্রম
                    </label>
                    <input
                      type="number"
                      min="1"
                      value={formData.order}
                      onChange={(e) => setFormData({ ...formData, order: e.target.value })}
                      className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500"
                    />
                  </div>
                </div>

                {/* Quote / Testimonial text */}
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1.5">
                    সংক্ষিপ্ত বক্তব্য বা কোট (Quote)
                  </label>
                  <textarea
                    rows="3"
                    value={formData.quote}
                    onChange={(e) => setFormData({ ...formData, quote: e.target.value })}
                    placeholder="উদাঃ মাদ্রাসা সেবা ব্যবহার করে আমরা প্রতিষ্ঠানের কাজের গতি কয়েকগুণ বাড়িয়ে নিতে পেরেছি। আলহামদুলিল্লাহ।"
                    className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500"
                  />
                </div>

                {/* Active Checkbox */}
                <div className="flex items-center gap-3 pt-2">
                  <input
                    type="checkbox"
                    id="isActive"
                    checked={formData.isActive}
                    onChange={(e) => setFormData({ ...formData, isActive: e.target.checked })}
                    className="w-4 h-4 text-emerald-600 rounded focus:ring-emerald-500 cursor-pointer"
                  />
                  <label htmlFor="isActive" className="text-xs font-bold text-slate-700 cursor-pointer">
                    হোমপেজে সরাসরি প্রদর্শন করুন (Active)
                  </label>
                </div>

                {/* Submit Buttons */}
                <div className="flex items-center justify-end gap-3 pt-4 border-t border-slate-100">
                  <button
                    type="button"
                    onClick={() => setIsModalOpen(false)}
                    className="px-4 py-2.5 text-xs font-bold text-slate-600 hover:text-slate-800 hover:bg-slate-100 rounded-xl transition-all cursor-pointer"
                  >
                    বাতিল
                  </button>
                  <button
                    type="submit"
                    disabled={isSubmitting}
                    className="inline-flex items-center gap-2 px-6 py-2.5 bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl font-bold text-sm shadow-md transition-all cursor-pointer disabled:opacity-50"
                  >
                    <Save className="w-4 h-4" />
                    {isSubmitting ? "সংরক্ষণ হচ্ছে..." : editingId ? "আপডেট করুন" : "যুক্ত করুন"}
                  </button>
                </div>
              </form>
            </div>
          </div>,
          document.body
        )}

      {/* ===================== VIDEO PLAYER MODAL ===================== */}
      {previewVideo &&
        createPortal(
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm font-bangla animate-fade-in">
            <div className="bg-slate-900 rounded-2xl max-w-3xl w-full p-4 sm:p-6 shadow-2xl relative">
              <button
                type="button"
                onClick={() => setPreviewVideo(null)}
                className="absolute top-4 right-4 p-2 text-white/70 hover:text-white hover:bg-white/10 rounded-full transition-all cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>

              <div className="mb-3 pr-8">
                <h3 className="text-base sm:text-lg font-bold text-white truncate">
                  {previewVideo.reviewerName} • {previewVideo.madrasaName}
                </h3>
                <p className="text-xs text-slate-400">{previewVideo.designation}</p>
              </div>

              <div className="relative aspect-video rounded-xl overflow-hidden bg-black border border-slate-800">
                <iframe
                  src={previewVideo.embedUrl ? `${previewVideo.embedUrl}?autoplay=1` : ""}
                  title={previewVideo.reviewerName}
                  className="w-full h-full"
                  allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                  allowFullScreen
                />
              </div>
            </div>
          </div>,
          document.body
        )}

      {/* ===================== DELETE CONFIRMATION MODAL ===================== */}
      {deletingReview &&
        createPortal(
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs font-bangla animate-fade-in">
            <div className="bg-white rounded-2xl max-w-md w-full p-6 shadow-2xl border border-slate-100 text-center">
              <div className="w-12 h-12 rounded-full bg-rose-50 text-rose-600 flex items-center justify-center mx-auto mb-4">
                <Trash2 className="w-6 h-6" />
              </div>
              <h3 className="text-lg font-bold text-slate-800 mb-1">রিভিউ মুছে ফেলতে চান?</h3>
              <p className="text-xs text-slate-500 mb-6">
                "{deletingReview.reviewerName}" এর এই ভিডিও রিভিউটি স্থায়ীভাবে মুছে ফেলা হবে।
              </p>
              <div className="flex items-center justify-center gap-3">
                <button
                  type="button"
                  onClick={() => setDeletingReview(null)}
                  className="px-4 py-2 text-xs font-bold text-slate-600 hover:bg-slate-100 rounded-xl transition-all cursor-pointer"
                >
                  বাতিল
                </button>
                <button
                  type="button"
                  onClick={handleDeleteConfirm}
                  disabled={isDeleting}
                  className="px-5 py-2 bg-rose-600 hover:bg-rose-700 text-white rounded-xl text-xs font-bold shadow-md transition-all cursor-pointer disabled:opacity-50"
                >
                  {isDeleting ? "মুছে ফেলা হচ্ছে..." : "হ্যাঁ, মুছে ফেলুন"}
                </button>
              </div>
            </div>
          </div>,
          document.body
        )}
    </div>
  );
};

export default ReviewSettings;
