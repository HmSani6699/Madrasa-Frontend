import { useState, useEffect } from "react";
import { createPortal } from "react-dom";
import {
  Search,
  Filter,
  ChevronDown,
  MessageSquare,
  MessageCircle,
  Phone,
  Mail,
  User,
  Calendar,
  CheckCircle2,
  Clock,
  Trash2,
  Eye,
  X,
  RefreshCw,
  Send,
  AlertCircle,
  CheckCheck,
  FileText
} from "lucide-react";
import adminService from "../../services/adminService";
import { toast } from "react-hot-toast";

const STATUS_CONFIG = {
  unread: {
    label: "অপঠিত",
    badgeClass: "bg-rose-50 text-rose-700 border-rose-200",
    dotClass: "bg-rose-500",
  },
  read: {
    label: "পঠিত",
    badgeClass: "bg-blue-50 text-blue-700 border-blue-200",
    dotClass: "bg-blue-500",
  },
  replied: {
    label: "উত্তর সম্পন্ন",
    badgeClass: "bg-amber-50 text-amber-700 border-amber-200",
    dotClass: "bg-amber-500",
  },
  resolved: {
    label: "সমাধান সম্পন্ন",
    badgeClass: "bg-emerald-50 text-emerald-700 border-emerald-200",
    dotClass: "bg-emerald-600",
  },
};

const ContactMessages = () => {
  const [messages, setMessages] = useState([]);
  const [stats, setStats] = useState({
    total: 0,
    unread: 0,
    read: 0,
    replied: 0,
    resolved: 0,
  });
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");

  // Detail Modal State
  const [selectedMessage, setSelectedMessage] = useState(null);
  const [isDetailOpen, setIsDetailOpen] = useState(false);
  const [editingNotes, setEditingNotes] = useState("");
  const [editingStatus, setEditingStatus] = useState("unread");
  const [isUpdating, setIsUpdating] = useState(false);

  useEffect(() => {
    fetchMessages();
  }, [statusFilter]);

  const fetchMessages = async (searchQuery = searchTerm) => {
    try {
      setLoading(true);
      const res = await adminService.getContactMessages({
        status: statusFilter,
        search: searchQuery,
      });
      if (res.success) {
        setMessages(res.data || []);
        if (res.stats) {
          setStats(res.stats);
        }
      }
    } catch (err) {
      console.error("Failed to load contact messages:", err);
      toast.error("যোগাযোগ বার্তা লোড করতে সমস্যা হয়েছে");
    } finally {
      setLoading(false);
    }
  };

  const handleSearchSubmit = (e) => {
    e.preventDefault();
    fetchMessages(searchTerm);
  };

  const handleOpenDetail = (item) => {
    setSelectedMessage(item);
    setEditingNotes(item.adminNotes || "");
    setEditingStatus(item.status || "unread");
    setIsDetailOpen(true);

    // If message is unread, automatically mark as read when opened
    if (item.status === "unread") {
      adminService
        .updateContactMessageStatus(item._id, { status: "read" })
        .then((res) => {
          if (res.success) {
            setMessages((prev) =>
              prev.map((m) => (m._id === item._id ? { ...m, status: "read" } : m))
            );
            setStats((prev) => ({
              ...prev,
              unread: Math.max(0, prev.unread - 1),
              read: (prev.read || 0) + 1,
            }));
            setEditingStatus("read");
          }
        })
        .catch(() => {});
    }
  };

  const handleStatusUpdate = async (id, newStatus, newNotes) => {
    try {
      setIsUpdating(true);
      const res = await adminService.updateContactMessageStatus(id, {
        status: newStatus,
        adminNotes: newNotes,
      });
      if (res.success) {
        toast.success("স্ট্যাটাস ও নোট সফলভাবে আপডেট হয়েছে");
        setMessages((prev) =>
          prev.map((m) =>
            m._id === id
              ? { ...m, status: newStatus, adminNotes: newNotes, updatedAt: new Date() }
              : m
          )
        );
        if (selectedMessage && selectedMessage._id === id) {
          setSelectedMessage((prev) => ({
            ...prev,
            status: newStatus,
            adminNotes: newNotes,
          }));
        }
        // Update stats
        fetchMessages(searchTerm);
      }
    } catch (err) {
      console.error("Update failed:", err);
      toast.error("আপডেট করতে ব্যর্থ হয়েছে");
    } finally {
      setIsUpdating(false);
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm("আপনি কি নিশ্চিতভাবে এই বার্তাটি মুছে ফেলতে চান?")) return;

    try {
      const res = await adminService.deleteContactMessage(id);
      if (res.success) {
        toast.success("বার্তা মুছে ফেলা হয়েছে");
        setMessages((prev) => prev.filter((m) => m._id !== id));
        if (selectedMessage && selectedMessage._id === id) {
          setIsDetailOpen(false);
        }
        fetchMessages(searchTerm);
      }
    } catch (err) {
      console.error("Delete failed:", err);
      toast.error("মুছে ফেলতে ব্যর্থ হয়েছে");
    }
  };

  const generateWhatsAppLink = (item) => {
    let phone = (item.phone || "").replace(/[\s\-+]/g, "");
    if (phone.startsWith("0")) {
      phone = "88" + phone;
    }
    const message = encodeURIComponent(
      `আসসালামু আলাইকুম ${item.name || ""} সাহেব। মাদ্রাসা সেবা (Madrasa Sheba) থেকে যোগাযোগ করছি।\nওয়েবসাইটে আপনার প্রেরিত বার্তার প্রেক্ষিতে আমরা আপনার সাথে কানেক্ট হতে পেরে আনন্দিত। আপনার বিষয়টি নিয়ে বিস্তারিত আলোচনা করতে আপনি কি এখন ফ্রি আছেন?`
    );
    return `https://wa.me/${phone}?text=${message}`;
  };

  return (
    <div className="space-y-6 font-bangla animate-fade-in pb-12">
      {/* Top Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-gray-900 flex items-center gap-2">
            <span>যোগাযোগ বার্তা সমূহ</span>
            <span className="text-xs bg-emerald-100 text-emerald-800 font-bold px-2.5 py-0.5 rounded-full">
              {stats.total || messages.length} টি বার্তা
            </span>
            {stats.unread > 0 && (
              <span className="text-xs bg-rose-100 text-rose-800 font-bold px-2.5 py-0.5 rounded-full animate-pulse">
                {stats.unread} টি অপঠিত
              </span>
            )}
          </h1>
          <p className="text-gray-500 text-sm mt-0.5">
            ওয়েবসাইটের যোগাযোগ ফর্ম থেকে ব্যবহারকারীদের পাঠানো বার্তা ও প্রশ্নাবলীর তালিকা।
          </p>
        </div>

        {/* Controls: Search, Filter, Refresh */}
        <div className="flex flex-wrap items-center gap-3">
          {/* Search Form */}
          <form onSubmit={handleSearchSubmit} className="relative min-w-[240px] sm:w-64 md:w-72">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400 pointer-events-none" />
            <input
              type="text"
              placeholder="নাম, ফোন, ইমেইল বা বার্তা..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-9 pr-9 py-2 rounded-[8px] border border-gray-200 bg-white text-sm text-gray-800 placeholder-gray-400 outline-none focus:border-emerald-600 focus:ring-2 focus:ring-emerald-500/20 hover:border-gray-300 transition-all"
            />
            {searchTerm && (
              <button
                type="button"
                onClick={() => {
                  setSearchTerm("");
                  fetchMessages("");
                }}
                className="absolute right-2.5 top-1/2 -translate-y-1/2 p-1 text-gray-400 hover:text-gray-600 rounded-full hover:bg-gray-100 transition-colors"
                title="সার্চ মুছুন"
              >
                <X className="w-3.5 h-3.5" />
              </button>
            )}
          </form>

          {/* Status Filter */}
          <div className="relative">
            <Filter className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400 pointer-events-none" />
            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
              className="w-full sm:w-auto appearance-none pl-9 pr-9 py-2 rounded-[8px] border border-gray-200 bg-white text-sm font-medium text-gray-700 outline-none focus:border-emerald-600 focus:ring-2 focus:ring-emerald-500/20 cursor-pointer hover:border-gray-300 transition-all"
            >
              <option value="all">সবগুলো স্ট্যাটাস</option>
              <option value="unread">অপঠিত</option>
              <option value="read">পঠিত</option>
              <option value="replied">উত্তর সম্পন্ন</option>
              <option value="resolved">সমাধান সম্পন্ন</option>
            </select>
            <ChevronDown className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400 pointer-events-none" />
          </div>

          {/* Refresh Button */}
          <button
            type="button"
            onClick={() => fetchMessages()}
            className="inline-flex items-center justify-center gap-2 bg-[#123628] border border-gray-200 hover:bg-emerald-600 hover:border-gray-300 text-gray-300 px-4 py-2 rounded-[8px] text-sm font-semibold transition-all shadow-xs cursor-pointer active:scale-95 shrink-0"
            title="রিফ্রেশ করুন"
          >
            <RefreshCw className={`w-4 h-4 ${loading ? "animate-spin text-emerald-400" : "text-gray-300"}`} />
            <span>রিফ্রেশ</span>
          </button>
        </div>
      </div>

      {/* Summary Stats Cards */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
        <div className="bg-white p-4 rounded-xl border border-gray-100 shadow-2xs">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-gray-500">মোট বার্তা</span>
            <div className="w-8 h-8 rounded-lg bg-gray-100 text-gray-600 flex items-center justify-center">
              <MessageSquare className="w-4 h-4" />
            </div>
          </div>
          <p className="text-2xl font-extrabold text-gray-900 mt-2">{stats.total || 0}</p>
        </div>

        <div className="bg-white p-4 rounded-xl border border-rose-100 shadow-2xs">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-rose-600">অপঠিত</span>
            <div className="w-8 h-8 rounded-lg bg-rose-50 text-rose-600 flex items-center justify-center">
              <AlertCircle className="w-4 h-4" />
            </div>
          </div>
          <p className="text-2xl font-extrabold text-rose-700 mt-2">{stats.unread || 0}</p>
        </div>

        <div className="bg-white p-4 rounded-xl border border-amber-100 shadow-2xs">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-amber-600">উত্তর সম্পন্ন</span>
            <div className="w-8 h-8 rounded-lg bg-amber-50 text-amber-600 flex items-center justify-center">
              <CheckCircle2 className="w-4 h-4" />
            </div>
          </div>
          <p className="text-2xl font-extrabold text-amber-700 mt-2">{stats.replied || 0}</p>
        </div>

        <div className="bg-white p-4 rounded-xl border border-emerald-100 shadow-2xs">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-emerald-600">সমাধান সম্পন্ন</span>
            <div className="w-8 h-8 rounded-lg bg-emerald-50 text-emerald-600 flex items-center justify-center">
              <CheckCheck className="w-4 h-4" />
            </div>
          </div>
          <p className="text-2xl font-extrabold text-emerald-700 mt-2">{stats.resolved || 0}</p>
        </div>
      </div>

      {/* Messages Table */}
      <div className="bg-white rounded-[8px] border border-gray-200 shadow-xs overflow-hidden">
        {loading ? (
          <div className="p-12 text-center text-gray-400">
            <RefreshCw className="w-8 h-8 animate-spin mx-auto mb-3 text-emerald-600" />
            <p className="text-sm">বার্তা লোড হচ্ছে...</p>
          </div>
        ) : messages.length === 0 ? (
          <div className="p-16 text-center text-gray-500">
            <MessageSquare className="w-12 h-12 stroke-1 mx-auto mb-3 text-gray-300" />
            <p className="text-base font-semibold text-gray-700">কোনো বার্তা পাওয়া যায়নি</p>
            <p className="text-xs text-gray-400 mt-1">
              ব্যবহারকারীরা যোগাযোগ ফর্ম পূরণ করলে বার্তাগুলো এখানে জমা হবে।
            </p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left text-sm text-gray-600">
              <thead className="bg-[#123628] border-b border-gray-200 text-gray-300 font-bold text-xs uppercase tracking-wider">
                <tr className="whitespace-nowrap">
                  <th className="py-3.5 px-4">প্রেরকের নাম</th>
                  <th className="py-3.5 px-4">মোবাইল / হোয়াটসঅ্যাপ</th>
                  <th className="py-3.5 px-4">ইমেইল</th>
                  <th className="py-3.5 px-4">বার্তার সারসংক্ষেপ</th>
                  <th className="py-3.5 px-4">স্ট্যাটাস</th>
                  <th className="py-3.5 px-4">প্রেরণের সময়</th>
                  <th className="py-3.5 px-4 text-right">অ্যাকশন</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100">
                {messages.map((item) => {
                  const cfg = STATUS_CONFIG[item.status] || STATUS_CONFIG.unread;
                  return (
                    <tr
                      key={item._id}
                      className={`hover:bg-emerald-50/20 transition-colors group cursor-pointer ${
                        item.status === "unread" ? "bg-amber-50/30 font-medium" : ""
                      }`}
                      onClick={() => handleOpenDetail(item)}
                    >
                      {/* Sender Name */}
                      <td className="py-3.5 px-4">
                        <div className="font-bold text-gray-900 group-hover:text-emerald-700 transition-colors flex items-center gap-2">
                          {item.name}
                          {item.status === "unread" && (
                            <span className="w-2 h-2 rounded-full bg-rose-500 shrink-0" />
                          )}
                        </div>
                      </td>

                      {/* Phone / WhatsApp */}
                      <td className="py-3.5 px-4" onClick={(e) => e.stopPropagation()}>
                        {item.phone ? (
                          <div className="flex items-center gap-1.5">
                            <a
                              href={generateWhatsAppLink(item)}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="inline-flex items-center gap-1 bg-[#25D366] hover:bg-[#20ba5a] text-white font-semibold text-xs px-2.5 py-1 rounded-md shadow-2xs transition-all active:scale-95"
                              title="হোয়াটসঅ্যাপে চ্যাট করুন"
                            >
                              <MessageCircle className="w-3.5 h-3.5 fill-white" />
                              <span>{item.phone}</span>
                            </a>
                            <a
                              href={`tel:${item.phone}`}
                              className="p-1 hover:bg-gray-100 text-gray-500 rounded-md transition-colors"
                              title="সরাসরি কল করুন"
                            >
                              <Phone className="w-3.5 h-3.5" />
                            </a>
                          </div>
                        ) : (
                          <span className="text-gray-400 text-xs">-</span>
                        )}
                      </td>

                      {/* Email */}
                      <td className="py-3.5 px-4" onClick={(e) => e.stopPropagation()}>
                        {item.email ? (
                          <a
                            href={`mailto:${item.email}?subject=মাদ্রাসা সেবা (Madrasa Sheba) থেকে বার্তা`}
                            className="text-xs text-emerald-700 hover:text-emerald-800 hover:underline flex items-center gap-1"
                            title="ইমেইল পাঠান"
                          >
                            <Mail className="w-3.5 h-3.5 text-gray-400 shrink-0" />
                            <span className="truncate max-w-[160px]">{item.email}</span>
                          </a>
                        ) : (
                          <span className="text-gray-400 text-xs">-</span>
                        )}
                      </td>

                      {/* Message excerpt */}
                      <td className="py-3.5 px-4 max-w-xs">
                        <p className="text-xs text-gray-700 truncate" title={item.message}>
                          {item.message}
                        </p>
                      </td>

                      {/* Status */}
                      <td className="py-3.5 px-4" onClick={(e) => e.stopPropagation()}>
                        <span
                          className={`inline-flex items-center gap-1.5 text-xs font-semibold px-2.5 py-1 rounded-full border ${cfg.badgeClass}`}
                        >
                          <span className={`w-1.5 h-1.5 rounded-full ${cfg.dotClass}`} />
                          <span>{cfg.label}</span>
                        </span>
                      </td>

                      {/* Date */}
                      <td className="py-3.5 px-4 text-xs text-gray-500 whitespace-nowrap">
                        {item.createdAt
                          ? new Date(item.createdAt).toLocaleDateString("bn-BD", {
                              day: "numeric",
                              month: "short",
                              year: "numeric",
                              hour: "2-digit",
                              minute: "2-digit",
                            })
                          : "-"}
                      </td>

                      {/* Actions */}
                      <td className="py-3.5 px-4 text-right" onClick={(e) => e.stopPropagation()}>
                        <div className="flex items-center justify-end gap-1.5">
                          <button
                            onClick={() => handleOpenDetail(item)}
                            className="p-1.5 hover:bg-gray-100 text-gray-600 rounded-lg transition-colors cursor-pointer"
                            title="বিস্তারিত দেখুন ও নোট যোগ করুন"
                          >
                            <Eye className="w-4 h-4" />
                          </button>
                          <button
                            onClick={() => handleDelete(item._id)}
                            className="p-1.5 hover:bg-rose-50 text-rose-500 rounded-lg transition-colors cursor-pointer"
                            title="বার্তা মুছে ফেলুন"
                          >
                            <Trash2 className="w-4 h-4" />
                          </button>
                        </div>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* Detail & Action Modal */}
      {isDetailOpen && selectedMessage && createPortal(
        <div className="fixed inset-0 z-[9999] overflow-y-auto bg-slate-900/60 backdrop-blur-sm p-4 sm:p-6 flex justify-center items-center">
          {/* Backdrop click to close */}
          <div
            className="fixed inset-0"
            onClick={() => setIsDetailOpen(false)}
          />

          <div className="relative my-auto bg-white rounded-2xl max-w-xl w-full shadow-2xl border border-slate-100 z-10 max-h-[90vh] flex flex-col overflow-hidden animate-scale-in">
            {/* Modal Header */}
            <div className="p-5 sm:p-6 pb-4 border-b border-gray-100 flex items-center justify-between gap-3 shrink-0 bg-white">
              <div className="flex items-center gap-3 min-w-0">
                <div className="w-11 h-11 rounded-2xl bg-emerald-100 text-[#1C7D5A] flex items-center justify-center shrink-0">
                  <MessageSquare className="w-5 h-5" />
                </div>
                <div className="min-w-0">
                  <h3 className="text-lg font-bold text-gray-900 truncate">{selectedMessage.name}</h3>
                  <p className="text-xs text-gray-500">
                    মেসেজ আইডি: <span className="font-mono">{selectedMessage._id}</span>
                  </p>
                </div>
              </div>

              {/* Close Button */}
              <button
                onClick={() => setIsDetailOpen(false)}
                className="p-2 hover:bg-gray-100 text-gray-400 hover:text-gray-700 rounded-xl transition-colors cursor-pointer shrink-0"
                title="বন্ধ করুন"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Modal Body */}
            <div className="p-5 sm:p-6 space-y-5 overflow-y-auto flex-1">
              {/* Contact Info Pills */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div className="p-3 bg-slate-50 rounded-xl border border-slate-100 flex items-center gap-3">
                  <div className="w-9 h-9 rounded-lg bg-emerald-50 text-emerald-700 flex items-center justify-center shrink-0">
                    <Phone className="w-4 h-4" />
                  </div>
                  <div className="min-w-0">
                    <p className="text-[11px] font-medium text-gray-400">মোবাইল / হোয়াটসঅ্যাপ</p>
                    <p className="text-sm font-bold text-gray-800 truncate">
                      {selectedMessage.phone || "প্রদান করা হয়নি"}
                    </p>
                  </div>
                </div>

                <div className="p-3 bg-slate-50 rounded-xl border border-slate-100 flex items-center gap-3">
                  <div className="w-9 h-9 rounded-lg bg-blue-50 text-blue-700 flex items-center justify-center shrink-0">
                    <Mail className="w-4 h-4" />
                  </div>
                  <div className="min-w-0">
                    <p className="text-[11px] font-medium text-gray-400">ইমেইল</p>
                    <p className="text-sm font-bold text-gray-800 truncate">
                      {selectedMessage.email || "প্রদান করা হয়নি"}
                    </p>
                  </div>
                </div>
              </div>

              {/* Quick Communication Buttons */}
              <div className="flex flex-wrap gap-2.5">
                {selectedMessage.phone && (
                  <>
                    <a
                      href={generateWhatsAppLink(selectedMessage)}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex items-center gap-2 bg-[#25D366] hover:bg-[#20ba5a] text-white font-bold text-xs px-3.5 py-2 rounded-xl shadow-xs transition-all active:scale-95 cursor-pointer"
                    >
                      <MessageCircle className="w-4 h-4 fill-white" />
                      <span>হোয়াটসঅ্যাপ চ্যাট শুরু করুন</span>
                    </a>
                    <a
                      href={`tel:${selectedMessage.phone}`}
                      className="inline-flex items-center gap-2 bg-slate-800 hover:bg-slate-900 text-white font-bold text-xs px-3.5 py-2 rounded-xl shadow-xs transition-all active:scale-95 cursor-pointer"
                    >
                      <Phone className="w-4 h-4" />
                      <span>সরাসরি কল দিন</span>
                    </a>
                  </>
                )}
                {selectedMessage.email && (
                  <a
                    href={`mailto:${selectedMessage.email}?subject=মাদ্রাসা সেবা (Madrasa Sheba) থেকে বার্তা`}
                    className="inline-flex items-center gap-2 bg-emerald-700 hover:bg-emerald-800 text-white font-bold text-xs px-3.5 py-2 rounded-xl shadow-xs transition-all active:scale-95 cursor-pointer"
                  >
                    <Mail className="w-4 h-4" />
                    <span>ইমেইলের উত্তর দিন</span>
                  </a>
                )}
              </div>

              {/* Full Message Box */}
              <div>
                <label className="block text-xs font-bold text-gray-700 mb-1.5 flex items-center gap-1.5">
                  <FileText className="w-4 h-4 text-emerald-600" />
                  <span>প্রেরকের বার্তা:</span>
                </label>
                <div className="p-4 rounded-xl bg-slate-50 border border-slate-200 text-sm text-gray-800 whitespace-pre-wrap leading-relaxed">
                  {selectedMessage.message}
                </div>
                <div className="mt-1.5 flex items-center justify-between text-[11px] text-gray-400">
                  <span>
                    প্রেরণের তারিখ:{" "}
                    {selectedMessage.createdAt
                      ? new Date(selectedMessage.createdAt).toLocaleString("bn-BD")
                      : "-"}
                  </span>
                  {selectedMessage.updatedAt && (
                    <span>
                      সর্বশেষ আপডেট:{" "}
                      {new Date(selectedMessage.updatedAt).toLocaleString("bn-BD")}
                    </span>
                  )}
                </div>
              </div>

              {/* Status Selector & Admin Notes */}
              <div className="pt-3 border-t border-gray-100 space-y-4">
                <div>
                  <label className="block text-xs font-bold text-gray-700 mb-1.5">
                    স্ট্যাটাস পরিবর্তন করুন:
                  </label>
                  <select
                    value={editingStatus}
                    onChange={(e) => setEditingStatus(e.target.value)}
                    className="w-full px-3.5 py-2.5 rounded-xl border border-gray-200 bg-white text-sm font-semibold text-gray-800 outline-none focus:border-emerald-600 focus:ring-2 focus:ring-emerald-500/20 transition-all cursor-pointer"
                  >
                    <option value="unread">অপঠিত (Unread)</option>
                    <option value="read">পঠিত (Read)</option>
                    <option value="replied">উত্তর সম্পন্ন (Replied)</option>
                    <option value="resolved">সমাধান সম্পন্ন (Resolved)</option>
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-bold text-gray-700 mb-1.5">
                    অ্যাডমিন ইন্টারনাল নোট (Internal Notes):
                  </label>
                  <textarea
                    rows={3}
                    value={editingNotes}
                    onChange={(e) => setEditingNotes(e.target.value)}
                    placeholder="যেমন: ফোনে কথা বলে সমাধান জানানো হয়েছে, অথবা অফার দেওয়া হয়েছে..."
                    className="w-full px-3.5 py-2.5 rounded-xl border border-gray-200 bg-white text-sm text-gray-800 placeholder-gray-400 outline-none focus:border-emerald-600 focus:ring-2 focus:ring-emerald-500/20 transition-all resize-y"
                  />
                </div>
              </div>
            </div>

            {/* Modal Footer */}
            <div className="p-4 sm:p-5 border-t border-gray-100 flex items-center justify-between gap-3 shrink-0 bg-slate-50/50">
              <button
                type="button"
                onClick={() => handleDelete(selectedMessage._id)}
                className="inline-flex items-center gap-1.5 text-xs font-bold text-rose-600 hover:text-rose-700 hover:bg-rose-50 px-3 py-2 rounded-xl transition-colors cursor-pointer"
              >
                <Trash2 className="w-4 h-4" />
                <span>বার্তা মুছুন</span>
              </button>

              <div className="flex items-center gap-2">
                <button
                  type="button"
                  onClick={() => setIsDetailOpen(false)}
                  className="px-4 py-2 text-xs font-bold text-gray-600 hover:bg-gray-100 rounded-xl transition-colors cursor-pointer"
                >
                  বাতিল
                </button>
                <button
                  type="button"
                  disabled={isUpdating}
                  onClick={() =>
                    handleStatusUpdate(selectedMessage._id, editingStatus, editingNotes)
                  }
                  className="inline-flex items-center gap-2 bg-[#1C7D5A] hover:bg-[#156649] text-white text-xs font-bold px-5 py-2.5 rounded-xl shadow-xs transition-all active:scale-95 disabled:opacity-60 cursor-pointer"
                >
                  {isUpdating ? (
                    <RefreshCw className="w-4 h-4 animate-spin" />
                  ) : (
                    <CheckCircle2 className="w-4 h-4" />
                  )}
                  <span>সংরক্ষণ করুন</span>
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

export default ContactMessages;
