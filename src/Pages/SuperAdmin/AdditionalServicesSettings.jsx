import React, { useState, useEffect } from "react";
import {
  Sparkles,
  Plus,
  Edit,
  Trash2,
  RefreshCw,
  Search,
  X,
  Save,
  CheckCircle2,
  Video,
  CreditCard,
  BookOpen,
  Printer,
  ShoppingBag,
  Layers,
  ShieldCheck,
  Laptop,
  Phone,
  MessageSquare,
  Eye,
  AlertCircle,
  Tag,
  DollarSign,
  Image as ImageIcon,
  ListOrdered
} from "lucide-react";
import adminService from "../../services/adminService";
import { toast } from "react-hot-toast";

const ICON_MAP = {
  Video,
  CreditCard,
  BookOpen,
  Printer,
  Sparkles,
  ShoppingBag,
  Layers,
  ShieldCheck,
  Laptop,
  Phone,
  MessageSquare
};

const CATEGORIES = [
  "ডিজিটাল মিডিয়া ও মার্কেটিং",
  "প্রিন্টিং ও ব্র্যান্ডিং",
  "স্টেশনারি ও প্রিন্টিং",
  "হার্ডওয়্যার ও অটোমেশন",
  "অন্যান্য সেবা"
];

const INITIAL_FORM = {
  title: "",
  category: "ডিজিটাল মিডিয়া ও মার্কেটিং",
  shortDesc: "",
  description: "",
  features: ["", ""],
  price: "",
  badge: "জনপ্রিয়",
  icon: "Sparkles",
  image: "",
  order: 1,
  isActive: true
};

const AdditionalServicesSettings = () => {
  const [services, setServices] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [categoryFilter, setCategoryFilter] = useState("all");

  // Create / Edit Modal State
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingId, setEditingId] = useState(null);
  const [formData, setFormData] = useState(INITIAL_FORM);
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Delete Confirmation State
  const [deletingService, setDeletingService] = useState(null);
  const [isDeleting, setIsDeleting] = useState(false);

  useEffect(() => {
    fetchServices();
  }, [statusFilter, categoryFilter]);

  const fetchServices = async (searchQuery = searchTerm) => {
    try {
      setLoading(true);
      const params = {};
      if (statusFilter !== "all") params.status = statusFilter;
      if (categoryFilter !== "all") params.category = categoryFilter;
      if (searchQuery && searchQuery.trim()) params.search = searchQuery.trim();

      const res = await adminService.getAllAdditionalServices(params);
      if (res?.success && Array.isArray(res.data)) {
        setServices(res.data);
      } else {
        setServices([]);
      }
    } catch (err) {
      console.error("Failed to fetch additional services:", err);
      toast.error("সেবা তালিকা লোড করতে সমস্যা হয়েছে");
    } finally {
      setLoading(false);
    }
  };

  const handleSearchSubmit = (e) => {
    e.preventDefault();
    fetchServices(searchTerm);
  };

  const handleOpenCreateModal = () => {
    setEditingId(null);
    setFormData({
      ...INITIAL_FORM,
      order: services.length + 1,
      features: ["", ""]
    });
    setIsModalOpen(true);
  };

  const handleOpenEditModal = (service) => {
    setEditingId(service._id);
    setFormData({
      title: service.title || "",
      category: service.category || "ডিজিটাল মিডিয়া ও মার্কেটিং",
      shortDesc: service.shortDesc || "",
      description: service.description || "",
      features: Array.isArray(service.features) && service.features.length > 0 
        ? [...service.features] 
        : ["", ""],
      price: service.price || "",
      badge: service.badge || "",
      icon: service.icon || "Sparkles",
      image: service.image || "",
      order: service.order || 1,
      isActive: service.isActive !== undefined ? service.isActive : true
    });
    setIsModalOpen(true);
  };

  const handleFeatureChange = (index, value) => {
    const updated = [...formData.features];
    updated[index] = value;
    setFormData({ ...formData, features: updated });
  };

  const handleAddFeature = () => {
    setFormData({ ...formData, features: [...formData.features, ""] });
  };

  const handleRemoveFeature = (index) => {
    const updated = formData.features.filter((_, i) => i !== index);
    setFormData({ ...formData, features: updated.length > 0 ? updated : [""] });
  };

  const handleSubmitForm = async (e) => {
    e.preventDefault();

    if (!formData.title.trim()) {
      toast.error("সেবার নাম/শিরোনাম আবশ্যক");
      return;
    }

    try {
      setIsSubmitting(true);
      const cleanedFeatures = formData.features
        .map((f) => (typeof f === "string" ? f.trim() : ""))
        .filter(Boolean);

      const payload = {
        ...formData,
        features: cleanedFeatures
      };

      if (editingId) {
        const res = await adminService.updateAdditionalService(editingId, payload);
        if (res?.success) {
          toast.success("সেবা সফলভাবে আপডেট হয়েছে");
          setIsModalOpen(false);
          fetchServices();
        } else {
          toast.error(res?.message || "আপডেট ব্যর্থ হয়েছে");
        }
      } else {
        const res = await adminService.createAdditionalService(payload);
        if (res?.success) {
          toast.success("নতুন সেবা সফলভাবে যুক্ত হয়েছে");
          setIsModalOpen(false);
          fetchServices();
        } else {
          toast.error(res?.message || "সেবা তৈরি ব্যর্থ হয়েছে");
        }
      }
    } catch (err) {
      console.error("Save service error:", err);
      toast.error(err.response?.data?.message || "সংরক্ষণ করতে সমস্যা হয়েছে");
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleToggleStatus = async (service) => {
    try {
      const res = await adminService.toggleAdditionalServiceStatus(service._id, !service.isActive);
      if (res?.success) {
        toast.success(res.message || "স্ট্যাটাস পরিবর্তিত হয়েছে");
        setServices((prev) =>
          prev.map((s) => (s._id === service._id ? { ...s, isActive: !s.isActive } : s))
        );
      }
    } catch (err) {
      console.error("Toggle status error:", err);
      toast.error("স্ট্যাটাস পরিবর্তন ব্যর্থ হয়েছে");
    }
  };

  const handleDeleteConfirm = async () => {
    if (!deletingService) return;
    try {
      setIsDeleting(true);
      const res = await adminService.deleteAdditionalService(deletingService._id);
      if (res?.success) {
        toast.success("সেবাটি সফলভাবে মুছে ফেলা হয়েছে");
        setDeletingService(null);
        fetchServices();
      } else {
        toast.error(res?.message || "মুছতে সমস্যা হয়েছে");
      }
    } catch (err) {
      console.error("Delete service error:", err);
      toast.error("সেবা মুছতে সমস্যা হয়েছে");
    } finally {
      setIsDeleting(false);
    }
  };

  // Stats calculation
  const totalServices = services.length;
  const activeServices = services.filter((s) => s.isActive).length;
  const inactiveServices = totalServices - activeServices;
  const uniqueCategories = Array.from(new Set(services.map((s) => s.category).filter(Boolean))).length;

  return (
    <div className="p-4 sm:p-6 lg:p-8 space-y-6 max-w-7xl mx-auto font-bangla">
      {/* Top Header Card */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 bg-white p-6 rounded-2xl border border-slate-100 shadow-sm">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <span className="p-2 rounded-xl bg-emerald-50 text-emerald-600">
              <Sparkles className="w-6 h-6" />
            </span>
            <h1 className="text-2xl font-bold text-slate-800 tracking-tight">
              অতিরিক্ত সেবা ও প্রোডাক্টস সেটিংস
            </h1>
          </div>
          <p className="text-slate-500 text-sm">
            সফটওয়্যারের পাশাপাশি ভর্তি প্রচার ভিডিও, স্টুডেন্ট আইডি কার্ড, কাস্টমাইজড খাতা, পিওএস মেশিন ও অন্যান্য সামগ্রী ম্যানেজ করুন
          </p>
        </div>

        <button
          onClick={handleOpenCreateModal}
          className="flex items-center gap-2 px-5 py-2.5 bg-emerald-600 hover:bg-emerald-700 active:scale-95 text-white font-medium rounded-xl shadow-sm hover:shadow-md transition-all cursor-pointer"
        >
          <Plus className="w-4 h-4" />
          <span>নতুন সেবা যোগ করুন</span>
        </button>
      </div>

      {/* Top Stats Cards */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="bg-white p-4 rounded-xl border border-slate-100 shadow-xs flex items-center justify-between">
          <div>
            <p className="text-xs font-medium text-slate-500">মোট সেবা ও সামগ্রী</p>
            <p className="text-2xl font-bold text-slate-800 mt-1">{totalServices}</p>
          </div>
          <div className="w-10 h-10 rounded-lg bg-blue-50 text-blue-600 flex items-center justify-center">
            <Layers className="w-5 h-5" />
          </div>
        </div>

        <div className="bg-white p-4 rounded-xl border border-slate-100 shadow-xs flex items-center justify-between">
          <div>
            <p className="text-xs font-medium text-slate-500">সক্রিয় সেবা</p>
            <p className="text-2xl font-bold text-emerald-600 mt-1">{activeServices}</p>
          </div>
          <div className="w-10 h-10 rounded-lg bg-emerald-50 text-emerald-600 flex items-center justify-center">
            <CheckCircle2 className="w-5 h-5" />
          </div>
        </div>

        <div className="bg-white p-4 rounded-xl border border-slate-100 shadow-xs flex items-center justify-between">
          <div>
            <p className="text-xs font-medium text-slate-500">নিষ্ক্রিয় সেবা</p>
            <p className="text-2xl font-bold text-slate-400 mt-1">{inactiveServices}</p>
          </div>
          <div className="w-10 h-10 rounded-lg bg-slate-100 text-slate-500 flex items-center justify-center">
            <AlertCircle className="w-5 h-5" />
          </div>
        </div>

        <div className="bg-white p-4 rounded-xl border border-slate-100 shadow-xs flex items-center justify-between">
          <div>
            <p className="text-xs font-medium text-slate-500">ক্যাটাগরি সংখ্যা</p>
            <p className="text-2xl font-bold text-amber-600 mt-1">{uniqueCategories || CATEGORIES.length}</p>
          </div>
          <div className="w-10 h-10 rounded-lg bg-amber-50 text-amber-600 flex items-center justify-center">
            <Tag className="w-5 h-5" />
          </div>
        </div>
      </div>

      {/* Filter and Search Bar */}
      <div className="bg-white p-4 rounded-xl border border-slate-100 shadow-xs flex flex-col md:flex-row items-center justify-between gap-3">
        <form onSubmit={handleSearchSubmit} className="relative w-full md:w-96">
          <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            placeholder="সেবার নাম, ক্যাটাগরি বা বিবরণ দিয়ে খুঁজুন..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-9 pr-4 py-2 text-sm bg-slate-50 border border-slate-200 rounded-lg focus:outline-none focus:border-emerald-500 focus:bg-white transition-colors"
          />
        </form>

        <div className="flex items-center gap-2 w-full md:w-auto">
          {/* Category Filter */}
          <select
            value={categoryFilter}
            onChange={(e) => setCategoryFilter(e.target.value)}
            className="px-3 py-2 text-sm bg-slate-50 border border-slate-200 rounded-lg focus:outline-none focus:border-emerald-500 text-slate-700 cursor-pointer"
          >
            <option value="all">সকল ক্যাটাগরি</option>
            {CATEGORIES.map((cat) => (
              <option key={cat} value={cat}>
                {cat}
              </option>
            ))}
          </select>

          {/* Status Filter */}
          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            className="px-3 py-2 text-sm bg-slate-50 border border-slate-200 rounded-lg focus:outline-none focus:border-emerald-500 text-slate-700 cursor-pointer"
          >
            <option value="all">সকল স্ট্যাটাস</option>
            <option value="active">সক্রিয়</option>
            <option value="inactive">নিষ্ক্রিয়</option>
          </select>

          <button
            onClick={() => {
              setSearchTerm("");
              setStatusFilter("all");
              setCategoryFilter("all");
              fetchServices("");
            }}
            title="রিফ্রেশ করুন"
            className="p-2 text-slate-500 hover:text-slate-700 hover:bg-slate-100 rounded-lg transition-colors cursor-pointer"
          >
            <RefreshCw className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* Services List Grid */}
      {loading ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-2 gap-6">
          {[1, 2, 3, 4].map((n) => (
            <div
              key={n}
              className="bg-white rounded-2xl border border-slate-100 p-6 shadow-xs animate-pulse space-y-4"
            >
              <div className="h-44 bg-slate-100 rounded-xl" />
              <div className="h-5 bg-slate-200 rounded w-2/3" />
              <div className="h-4 bg-slate-100 rounded w-full" />
              <div className="h-4 bg-slate-100 rounded w-4/5" />
            </div>
          ))}
        </div>
      ) : services.length === 0 ? (
        <div className="bg-white rounded-2xl border border-slate-100 p-12 text-center shadow-xs">
          <div className="w-16 h-16 rounded-full bg-slate-100 text-slate-400 mx-auto flex items-center justify-center mb-4">
            <Sparkles className="w-8 h-8" />
          </div>
          <h3 className="text-lg font-bold text-slate-700">কোনো সেবা পাওয়া যায়নি</h3>
          <p className="text-slate-400 text-sm mt-1 max-w-sm mx-auto">
            আপনার সার্চ বা ফিল্টারের সাথে মিলে এমন কোনো সেবা খুঁজে পাওয়া যায়নি।
          </p>
          <button
            onClick={handleOpenCreateModal}
            className="mt-5 inline-flex items-center gap-2 px-4 py-2 bg-emerald-600 text-white rounded-xl text-sm font-medium hover:bg-emerald-700 cursor-pointer"
          >
            <Plus className="w-4 h-4" />
            <span>নতুন সেবা যোগ করুন</span>
          </button>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {services.map((service) => {
            const IconComp = ICON_MAP[service.icon] || Sparkles;

            return (
              <div
                key={service._id}
                className={`bg-white rounded-2xl border transition-all duration-200 overflow-hidden flex flex-col justify-between shadow-xs hover:shadow-md ${
                  service.isActive
                    ? "border-slate-200/80 hover:border-emerald-300"
                    : "border-slate-200 opacity-75 bg-slate-50/50"
                }`}
              >
                <div>
                  {/* Card Media Header */}
                  <div className="relative aspect-16/9 bg-slate-100 overflow-hidden group">
                    {service.image ? (
                      <img
                        src={service.image}
                        alt={service.title}
                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                      />
                    ) : (
                      <div className="w-full h-full flex flex-col items-center justify-center text-slate-400 bg-linear-to-br from-emerald-50 to-teal-50">
                        <IconComp className="w-12 h-12 text-emerald-600/40" />
                        <span className="text-xs text-slate-400 mt-2">ছবি দেওয়া হয়নি</span>
                      </div>
                    )}

                    {/* Gradient Overlay */}
                    <div className="absolute inset-0 bg-linear-to-t from-black/60 via-transparent to-transparent pointer-events-none" />

                    {/* Badges on Image */}
                    <div className="absolute top-3 left-3 flex flex-wrap gap-1.5">
                      <span className="px-2.5 py-1 bg-white/90 backdrop-blur-md text-emerald-800 text-xs font-semibold rounded-lg shadow-xs flex items-center gap-1">
                        <IconComp className="w-3.5 h-3.5 text-emerald-600" />
                        <span>{service.category}</span>
                      </span>
                      {service.badge && (
                        <span className="px-2.5 py-1 bg-amber-500 text-white text-xs font-bold rounded-lg shadow-xs">
                          {service.badge}
                        </span>
                      )}
                    </div>

                    {/* Top Right Order & Status */}
                    <div className="absolute top-3 right-3 flex items-center gap-1.5">
                      <span className="px-2 py-0.5 bg-black/60 backdrop-blur-md text-white text-xs rounded-md">
                        ক্রম: {service.order}
                      </span>
                    </div>

                    {/* Price tag on image bottom */}
                    {service.price && (
                      <div className="absolute bottom-3 left-3 bg-emerald-600/90 backdrop-blur-md text-white px-3 py-1 rounded-lg text-xs sm:text-sm font-bold shadow-md">
                        {service.price}
                      </div>
                    )}
                  </div>

                  {/* Card Content */}
                  <div className="p-5 sm:p-6 space-y-4">
                    <div>
                      <h3 className="text-lg font-bold text-slate-900 group-hover:text-emerald-700 transition-colors">
                        {service.title}
                      </h3>
                      {service.shortDesc && (
                        <p className="text-slate-600 text-xs sm:text-sm mt-1 leading-relaxed">
                          {service.shortDesc}
                        </p>
                      )}
                    </div>

                    {/* Features list preview */}
                    {Array.isArray(service.features) && service.features.length > 0 && (
                      <div className="space-y-1.5 pt-2 border-t border-slate-100">
                        {service.features.slice(0, 3).map((feat, i) => (
                          <div key={i} className="flex items-center gap-2 text-xs text-slate-600">
                            <CheckCircle2 className="w-3.5 h-3.5 text-emerald-500 shrink-0" />
                            <span className="truncate">{feat}</span>
                          </div>
                        ))}
                        {service.features.length > 3 && (
                          <p className="text-[11px] text-slate-400 pl-5">
                            + আরও {service.features.length - 3}টি বিশেষ সুবিধা
                          </p>
                        )}
                      </div>
                    )}
                  </div>
                </div>

                {/* Card Action Footer */}
                <div className="p-4 bg-slate-50/80 border-t border-slate-100 flex items-center justify-between gap-3">
                  <div className="flex items-center gap-2">
                    <button
                      type="button"
                      onClick={() => handleToggleStatus(service)}
                      className={`relative inline-flex h-6 w-11 shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 ease-in-out focus:outline-none ${
                        service.isActive ? "bg-emerald-600" : "bg-slate-300"
                      }`}
                    >
                      <span
                        className={`pointer-events-none inline-block h-5 w-5 transform rounded-full bg-white shadow ring-0 transition duration-200 ease-in-out ${
                          service.isActive ? "translate-x-5" : "translate-x-0"
                        }`}
                      />
                    </button>
                    <span className="text-xs font-medium text-slate-500">
                      {service.isActive ? "সক্রিয়" : "নিষ্ক্রিয়"}
                    </span>
                  </div>

                  <div className="flex items-center gap-1.5">
                    <button
                      onClick={() => handleOpenEditModal(service)}
                      className="p-2 text-slate-600 hover:text-emerald-700 hover:bg-emerald-50 rounded-lg transition-colors cursor-pointer"
                      title="এডিট করুন"
                    >
                      <Edit className="w-4 h-4" />
                    </button>
                    <button
                      onClick={() => setDeletingService(service)}
                      className="p-2 text-slate-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors cursor-pointer"
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

      {/* Add / Edit Service Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs font-bangla overflow-y-auto">
          <div className="bg-white rounded-3xl max-w-2xl w-full p-6 sm:p-8 shadow-2xl relative my-8 border border-slate-100 animate-scale-up max-h-[90vh] overflow-y-auto">
            {/* Modal Close Button */}
            <button
              onClick={() => setIsModalOpen(false)}
              className="absolute top-5 right-5 p-2 text-slate-400 hover:text-slate-600 hover:bg-slate-100 rounded-full transition-colors cursor-pointer"
            >
              <X className="w-5 h-5" />
            </button>

            <div className="flex items-center gap-3 mb-6 pb-4 border-b border-slate-100">
              <div className="w-10 h-10 rounded-xl bg-emerald-50 text-emerald-600 flex items-center justify-center">
                {editingId ? <Edit className="w-5 h-5" /> : <Plus className="w-5 h-5" />}
              </div>
              <div>
                <h3 className="text-xl font-bold text-slate-800">
                  {editingId ? "সেবা ও সামগ্রী আপডেট করুন" : "নতুন সেবা / সামগ্রী যোগ করুন"}
                </h3>
                <p className="text-xs text-slate-500">
                  মাদরাসার জন্য প্রয়োজনীয় প্রোডাক্ট বা সার্ভিসের তথ্য প্রদান করুন
                </p>
              </div>
            </div>

            <form onSubmit={handleSubmitForm} className="space-y-4">
              {/* Title */}
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1.5">
                  সেবা / পণ্যের নাম <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  required
                  placeholder="যেমন: ভর্তি প্রচারণা ভিডিও / স্মার্ট আইডি কার্ড"
                  value={formData.title}
                  onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                  className="w-full px-3.5 py-2.5 text-sm bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:border-emerald-500 focus:bg-white"
                />
              </div>

              {/* Category & Badge */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1.5">ক্যাটাগরি</label>
                  <select
                    value={formData.category}
                    onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                    className="w-full px-3.5 py-2.5 text-sm bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:border-emerald-500 text-slate-700"
                  >
                    {CATEGORIES.map((cat) => (
                      <option key={cat} value={cat}>
                        {cat}
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1.5">
                    ট্যাগ / ব্যাজ (ঐচ্ছিক)
                  </label>
                  <input
                    type="text"
                    placeholder="যেমন: জনপ্রিয়, হট সার্ভিস, নতুন"
                    value={formData.badge}
                    onChange={(e) => setFormData({ ...formData, badge: e.target.value })}
                    className="w-full px-3.5 py-2.5 text-sm bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:border-emerald-500 focus:bg-white"
                  />
                </div>
              </div>

              {/* Price & Order */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1.5">
                    মূল্য / প্রাইসিং টেক্সট
                  </label>
                  <input
                    type="text"
                    placeholder="যেমন: শুরু মাত্র ৩,০০০৳ থেকে / আলোচনা সাপেক্ষে"
                    value={formData.price}
                    onChange={(e) => setFormData({ ...formData, price: e.target.value })}
                    className="w-full px-3.5 py-2.5 text-sm bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:border-emerald-500 focus:bg-white"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1.5">
                    প্রদর্শনের ক্রম (Order)
                  </label>
                  <input
                    type="number"
                    min="1"
                    value={formData.order}
                    onChange={(e) => setFormData({ ...formData, order: parseInt(e.target.value) || 1 })}
                    className="w-full px-3.5 py-2.5 text-sm bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:border-emerald-500 focus:bg-white"
                  />
                </div>
              </div>

              {/* Icon Selector */}
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1.5">
                  আইকন নির্বাচন করুন
                </label>
                <div className="grid grid-cols-4 sm:grid-cols-6 gap-2">
                  {Object.keys(ICON_MAP).map((iconKey) => {
                    const CurrIcon = ICON_MAP[iconKey];
                    const isSelected = formData.icon === iconKey;
                    return (
                      <button
                        key={iconKey}
                        type="button"
                        onClick={() => setFormData({ ...formData, icon: iconKey })}
                        className={`flex flex-col items-center justify-center p-2 rounded-xl border text-xs transition-all cursor-pointer ${
                          isSelected
                            ? "border-emerald-500 bg-emerald-50 text-emerald-700 font-bold shadow-xs"
                            : "border-slate-200 hover:bg-slate-50 text-slate-600"
                        }`}
                      >
                        <CurrIcon className="w-5 h-5 mb-1" />
                        <span className="text-[10px] truncate max-w-full">{iconKey}</span>
                      </button>
                    );
                  })}
                </div>
              </div>

              {/* Short Tagline / Description */}
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1.5">
                  সংক্ষিপ্ত বিবরণ (Short Tagline)
                </label>
                <input
                  type="text"
                  placeholder="যেমন: নতুন শিক্ষাবর্ষে শিক্ষার্থী ভর্তির সংখ্যা বাড়াতে আকর্ষণীয় ভিডিও"
                  value={formData.shortDesc}
                  onChange={(e) => setFormData({ ...formData, shortDesc: e.target.value })}
                  className="w-full px-3.5 py-2.5 text-sm bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:border-emerald-500 focus:bg-white"
                />
              </div>

              {/* Full Description */}
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1.5">
                  বিস্তারিত বিবরণ (Full Description)
                </label>
                <textarea
                  rows="3"
                  placeholder="এই সেবা বা প্রোডাক্টের বিস্তারিত বিবরণ লিখুন..."
                  value={formData.description}
                  onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                  className="w-full px-3.5 py-2.5 text-sm bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:border-emerald-500 focus:bg-white resize-none"
                />
              </div>

              {/* Image URL */}
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1.5">
                  ছবি বা ব্যানারের লিঙ্ক (Image URL)
                </label>
                <input
                  type="url"
                  placeholder="https://images.unsplash.com/photo-..."
                  value={formData.image}
                  onChange={(e) => setFormData({ ...formData, image: e.target.value })}
                  className="w-full px-3.5 py-2.5 text-sm bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:border-emerald-500 focus:bg-white"
                />
                {formData.image && (
                  <div className="mt-2 w-full h-32 rounded-xl overflow-hidden border border-slate-200 relative bg-slate-100">
                    <img
                      src={formData.image}
                      alt="Preview"
                      className="w-full h-full object-cover"
                      onError={(e) => {
                        e.target.style.display = "none";
                      }}
                    />
                  </div>
                )}
              </div>

              {/* Dynamic Features List */}
              <div>
                <div className="flex items-center justify-between mb-1.5">
                  <label className="text-xs font-bold text-slate-700">
                    মূল বৈশিষ্ট্যসমূহ (Bullet Points)
                  </label>
                  <button
                    type="button"
                    onClick={handleAddFeature}
                    className="text-xs text-emerald-600 hover:text-emerald-700 font-semibold flex items-center gap-1 cursor-pointer"
                  >
                    <Plus className="w-3.5 h-3.5" />
                    <span>ফিচার যোগ করুন</span>
                  </button>
                </div>
                <div className="space-y-2">
                  {formData.features.map((feat, index) => (
                    <div key={index} className="flex items-center gap-2">
                      <input
                        type="text"
                        placeholder={`ফিচার ${index + 1}: যেমন- ওয়াটারপ্রুফ টেকসই ডিজাইন`}
                        value={feat}
                        onChange={(e) => handleFeatureChange(index, e.target.value)}
                        className="flex-1 px-3 py-2 text-sm bg-slate-50 border border-slate-200 rounded-lg focus:outline-none focus:border-emerald-500 focus:bg-white"
                      />
                      {formData.features.length > 1 && (
                        <button
                          type="button"
                          onClick={() => handleRemoveFeature(index)}
                          className="p-2 text-slate-400 hover:text-red-500 rounded-lg hover:bg-red-50 cursor-pointer"
                        >
                          <X className="w-4 h-4" />
                        </button>
                      )}
                    </div>
                  ))}
                </div>
              </div>

              {/* Active Toggle */}
              <div className="flex items-center gap-2.5 pt-2">
                <input
                  type="checkbox"
                  id="isActive"
                  checked={formData.isActive}
                  onChange={(e) => setFormData({ ...formData, isActive: e.target.checked })}
                  className="w-4 h-4 text-emerald-600 rounded-sm border-slate-300 focus:ring-emerald-500 cursor-pointer"
                />
                <label htmlFor="isActive" className="text-xs font-bold text-slate-700 cursor-pointer">
                  হোমপেজে সরাসরি প্রদর্শন করুন (Active)
                </label>
              </div>

              {/* Modal Buttons */}
              <div className="flex items-center justify-end gap-3 pt-4 border-t border-slate-100">
                <button
                  type="button"
                  onClick={() => setIsModalOpen(false)}
                  className="px-4 py-2 text-sm font-medium text-slate-600 hover:bg-slate-100 rounded-xl transition-colors cursor-pointer"
                >
                  বাতিল
                </button>
                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="flex items-center gap-2 px-5 py-2.5 bg-emerald-600 hover:bg-emerald-700 disabled:opacity-50 text-white text-sm font-medium rounded-xl shadow-xs cursor-pointer"
                >
                  <Save className="w-4 h-4" />
                  <span>{isSubmitting ? "সংরক্ষণ হচ্ছে..." : "সংরক্ষণ করুন"}</span>
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Delete Confirmation Modal */}
      {deletingService && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs font-bangla">
          <div className="bg-white rounded-2xl max-w-md w-full p-6 shadow-2xl relative border border-slate-100 animate-scale-up text-center">
            <div className="w-12 h-12 rounded-full bg-red-50 text-red-600 flex items-center justify-center mx-auto mb-4">
              <Trash2 className="w-6 h-6" />
            </div>
            <h3 className="text-lg font-bold text-slate-800">সেবাটি মুছে ফেলতে চান?</h3>
            <p className="text-xs text-slate-500 mt-1.5 leading-relaxed">
              "<span className="font-semibold text-slate-700">{deletingService.title}</span>" মুছে ফেললে এটি ওয়েবসাইট থেকে অপসারিত হবে।
            </p>

            <div className="flex items-center justify-center gap-3 mt-6">
              <button
                type="button"
                onClick={() => setDeletingService(null)}
                className="px-4 py-2 text-sm font-medium text-slate-600 hover:bg-slate-100 rounded-xl transition-colors cursor-pointer"
              >
                না, রাখুন
              </button>
              <button
                type="button"
                disabled={isDeleting}
                onClick={handleDeleteConfirm}
                className="px-5 py-2 bg-red-600 hover:bg-red-700 disabled:opacity-50 text-white text-sm font-medium rounded-xl shadow-xs cursor-pointer"
              >
                {isDeleting ? "মুছে ফেলা হচ্ছে..." : "হ্যাঁ, মুছে ফেলুন"}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default AdditionalServicesSettings;
