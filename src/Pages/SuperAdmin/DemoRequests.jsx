import { useState, useEffect } from "react";
import { createPortal } from "react-dom";
import { Link } from "react-router-dom";
import {
  Search,
  Filter,
  ChevronDown,
  MessageCircle,
  Phone,
  Building2,
  User,
  Calendar,
  CheckCircle2,
  Clock,
  Trash2,
  Edit,
  ExternalLink,
  MapPin,
  RefreshCw,
  Eye,
  X,
  FileText,
  Video
} from "lucide-react";
import adminService from "../../services/adminService";
import { toast } from "react-hot-toast";

const STATUS_CONFIG = {
  pending: {
    label: "অপেক্ষমাণ",
    badgeClass: "bg-amber-50 text-amber-700 border-amber-200",
    dotClass: "bg-amber-500"
  },
  contacted: {
    label: "যোগাযোগ সম্পন্ন",
    badgeClass: "bg-blue-50 text-blue-700 border-blue-200",
    dotClass: "bg-blue-500"
  },
  portal_created: {
    label: "পোর্টাল প্রদান করা হয়েছে",
    badgeClass: "bg-emerald-50 text-emerald-700 border-emerald-200",
    dotClass: "bg-emerald-600"
  },
  rejected: {
    label: "বাতিল",
    badgeClass: "bg-rose-50 text-rose-700 border-rose-200",
    dotClass: "bg-rose-500"
  }
};

const DemoRequests = () => {
  const [requests, setRequests] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");

  // Detail Modal State
  const [selectedRequest, setSelectedRequest] = useState(null);
  const [isDetailOpen, setIsDetailOpen] = useState(false);
  const [editingNotes, setEditingNotes] = useState("");
  const [editingStatus, setEditingStatus] = useState("pending");
  const [isUpdating, setIsUpdating] = useState(false);

  useEffect(() => {
    fetchRequests();
  }, [statusFilter]);

  const fetchRequests = async (searchQuery = searchTerm) => {
    try {
      setLoading(true);
      const res = await adminService.getDemoRequests({
        status: statusFilter,
        search: searchQuery
      });
      if (res.success) {
        setRequests(res.data || []);
      }
    } catch (err) {
      console.error("Failed to load demo requests:", err);
      toast.error("ডেমো আবেদন তালিকা লোড করতে সমস্যা হয়েছে");
    } finally {
      setLoading(false);
    }
  };

  const handleSearchSubmit = (e) => {
    e.preventDefault();
    fetchRequests(searchTerm);
  };

  const handleOpenDetail = (item) => {
    setSelectedRequest(item);
    setEditingNotes(item.adminNotes || "");
    setEditingStatus(item.status || "pending");
    setIsDetailOpen(true);
  };

  const handleStatusUpdate = async (id, newStatus, newNotes) => {
    try {
      setIsUpdating(true);
      const res = await adminService.updateDemoRequestStatus(id, {
        status: newStatus,
        adminNotes: newNotes
      });
      if (res.success) {
        toast.success("স্ট্যাটাস সফলভাবে আপডেট হয়েছে");
        setRequests((prev) =>
          prev.map((r) =>
            r._id === id
              ? { ...r, status: newStatus, adminNotes: newNotes, updatedAt: new Date() }
              : r
          )
        );
        if (selectedRequest && selectedRequest._id === id) {
          setSelectedRequest((prev) => ({
            ...prev,
            status: newStatus,
            adminNotes: newNotes
          }));
        }
      }
    } catch (err) {
      console.error("Update failed:", err);
      toast.error("আপডেট করতে ব্যর্থ হয়েছে");
    } finally {
      setIsUpdating(false);
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm("আপনি কি নিশ্চিতভাবে এই আবেদনটি মুছে ফেলতে চান?")) return;

    try {
      const res = await adminService.deleteDemoRequest(id);
      if (res.success) {
        toast.success("আবেদন মুছে ফেলা হয়েছে");
        setRequests((prev) => prev.filter((r) => r._id !== id));
        if (selectedRequest && selectedRequest._id === id) {
          setIsDetailOpen(false);
        }
      }
    } catch (err) {
      console.error("Delete failed:", err);
      toast.error("মুছে ফেলতে ব্যর্থ হয়েছে");
    }
  };

  const generateWhatsAppLink = (item) => {
    let phone = (item.whatsapp || "").replace(/[\s\-+]/g, "");
    if (phone.startsWith("0")) {
      phone = "88" + phone;
    }
    const message = encodeURIComponent(
      `আসসালামু আলাইকুম ${item.applicantName || ""} সাহেব। মাদ্রাসা সেবা (Madrasa Sheba) সফটওয়্যার থেকে যোগাযোগ করছি।\nআপনার মাদ্রাসা "${item.madrasaName}"-এর জন্য ফ্রি ডেমো আবেদনের প্রেক্ষিতে আমরা আপনার সাথে কানেক্ট হতে পেরে আনন্দিত। ডেমো পোর্টাল সেটআপ ও বিস্তারিত জানার জন্য আপনি কি এখন ফ্রি আছেন?`
    );
    return `https://wa.me/${phone}?text=${message}`;
  };

  return (
    <div className="space-y-6 font-bangla animate-fade-in pb-12">
      {/* Top Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-gray-900 flex items-center gap-2">
            <span>ফ্রি ডেমো আবেদনসমূহ</span>
            <span className="text-xs bg-emerald-100 text-emerald-800 font-bold px-2.5 py-0.5 rounded-full">
              {requests.length} টি আবেদন
            </span>
          </h1>
          <p className="text-gray-500 text-sm mt-0.5">
            নতুন ইউজারদের সাথে হোয়াটসঅ্যাপে যোগাযোগ করুন।
          </p>
        </div>



        {/* Controls: Search, Status Filter & Refresh */}
        <div className="flex flex-wrap items-center gap-3">
          {/* Search Form */}
          <form onSubmit={handleSearchSubmit} className="relative min-w-[240px] sm:w-64 md:w-72">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400 pointer-events-none" />
            <input
              type="text"
              placeholder="মাদ্রাসা, নাম বা ফোন..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-9 pr-9 py-2 rounded-[8px] border border-gray-200 bg-white text-sm text-gray-800 placeholder-gray-400 outline-none focus:border-emerald-600 focus:ring-2 focus:ring-emerald-500/20  hover:border-gray-300 transition-all"
            />
            {searchTerm && (
              <button
                type="button"
                onClick={() => {
                  setSearchTerm("");
                  fetchRequests("");
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
              className="w-full sm:w-auto appearance-none pl-9 pr-9 py-2 rounded-[8px] border border-gray-200 bg-white text-sm font-medium text-gray-700 outline-none focus:border-emerald-600 focus:ring-2 focus:ring-emerald-500/20  cursor-pointer hover:border-gray-300 transition-all"
            >
              <option value="all">সবগুলো স্ট্যাটাস</option>
              <option value="pending">অপেক্ষমাণ</option>
              <option value="contacted">যোগাযোগ সম্পন্ন</option>
              <option value="portal_created">পোর্টাল প্রদান করা হয়েছে</option>
              <option value="rejected">বাতিল</option>
            </select>
            <ChevronDown className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400 pointer-events-none" />
          </div>

          {/* Refresh Button */}
          <button
            type="button"
            onClick={() => fetchRequests()}
            className="inline-flex items-center justify-center gap-2 bg-[#123628] border border-gray-200 hover:bg-emerald-600 hover:border-gray-300 text-gray-300 px-4 py-2 rounded-[8px] text-sm font-semibold transition-all shadow-xs cursor-pointer active:scale-95 shrink-0"
            title="রিফ্রেশ করুন"
          >
            <RefreshCw className={`w-4 h-4 ${loading ? "animate-spin text-emerald-600" : "text-gray-300"}`} />
            <span>রিফ্রেশ</span>
          </button>

          {/* Video Settings Shortcut */}
          <Link
            to="/super-admin/demo-video"
            className="inline-flex items-center justify-center gap-2 bg-emerald-50 border border-emerald-200 hover:bg-emerald-100 text-[#1C7D5A] px-3.5 py-2 rounded-[8px] text-sm font-semibold transition-all shadow-xs shrink-0 active:scale-95"
            title="ডেমো ভিডিও সেটিংস পরিবর্তন করুন"
          >
            <Video className="w-4 h-4 text-[#1C7D5A]" />
            <span>ভিডিও সেটিংস</span>
          </Link>
        </div>
      </div>


      {/* Requests Table */}
      <div className="bg-white rounded-[8px]  border-gray-200 shadow-xs overflow-hidden">
        {loading ? (
          <div className="p-12 text-center text-gray-400">
            <RefreshCw className="w-8 h-8 animate-spin mx-auto mb-3 text-emerald-600" />
            <p className="text-sm">ডেমো আবেদন লোড হচ্ছে...</p>
          </div>
        ) : requests.length === 0 ? (
          <div className="p-16 text-center text-gray-500">
            <Building2 className="w-12 h-12 stroke-1 mx-auto mb-3 text-gray-300" />
            <p className="text-base font-semibold text-gray-700">কোনো আবেদন পাওয়া যায়নি</p>
            <p className="text-xs text-gray-400 mt-1">
              ইউজাররা ফ্রি ডেমোর ফর্ম পূরণ করলে তা এখানে স্বয়ংক্রিয়ভাবে প্রদর্শিত হবে।
            </p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left text-sm text-gray-600">
              <thead className="bg-[#123628] border-b border-gray-200 text-gray-300 font-bold text-xs uppercase tracking-wider">
                <tr className="whitespace-nowrap">
                  <th className=" whitespace-nowrap py-3.5 px-4">মাদ্রাসার তথ্য</th>
                  <th className=" whitespace-nowrap py-3.5 px-4">আবেদনকারী</th>
                  <th className=" whitespace-nowrap py-3.5 px-4">হোয়াটসঅ্যাপ যোগাযোগ</th>
                  <th className=" whitespace-nowrap py-3.5 px-4">অবস্থান ও সাইজ</th>
                  <th className=" whitespace-nowrap py-3.5 px-4">স্ট্যাটাস</th>
                  <th className=" whitespace-nowrap py-3.5 px-4">আবেদনের তারিখ</th>
                  <th className=" whitespace-nowrap py-3.5 px-4 text-right">অ্যাকশন</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100">
                {requests.map((item) => {
                  const cfg = STATUS_CONFIG[item.status] || STATUS_CONFIG.pending;
                  return (
                    <tr
                      key={item._id}
                      className="hover:bg-emerald-50/20 transition-colors group cursor-pointer"
                      onClick={() => handleOpenDetail(item)}
                    >
                      {/* Madrasa info */}
                      <td className="py-3.5 px-4">
                        <div className="font-bold text-gray-900 group-hover:text-emerald-700 transition-colors">
                          {item.madrasaName}
                        </div>
                        <div className="text-xs text-gray-500 flex items-center gap-1.5 mt-0.5">
                          <span className="inline-block px-2 py-0.5 bg-gray-100 rounded text-[11px] font-medium text-gray-600">
                            {item.madrasaType}
                          </span>
                        </div>
                      </td>

                      {/* Applicant info */}
                      <td className="py-3.5 px-4">
                        <div className="font-semibold text-gray-800">{item.applicantName}</div>
                        <div className="text-xs text-gray-500">{item.designation}</div>
                      </td>

                      {/* WhatsApp contact */}
                      <td className="py-3.5 px-4" onClick={(e) => e.stopPropagation()}>
                        <div className="flex items-center gap-2">
                          <a
                            href={generateWhatsAppLink(item)}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="inline-flex items-center gap-1.5 bg-[#25D366] hover:bg-[#20ba5a] text-white font-bold text-xs px-3 py-1.5 rounded-lg shadow-xs transition-all active:scale-95"
                            title="সরাসরি হোয়াটসঅ্যাপে চ্যাট করুন"
                          >
                            <MessageCircle className="w-3.5 h-3.5 fill-white" />
                            <span>{item.whatsapp}</span>
                          </a>
                        </div>
                      </td>

                      {/* Location & size */}
                      <td className="py-3.5 px-4">
                        <div className="text-xs font-semibold text-gray-700 flex items-center gap-1">
                          <MapPin className="w-3.5 h-3.5 text-gray-400 shrink-0" />
                          <span>{item.district}</span>
                        </div>
                        <div className="text-xs text-gray-500 mt-0.5">{item.studentCount}</div>
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
                            year: "numeric"
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
                            title="আবেদন মুছে ফেলুন"
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
      {isDetailOpen && selectedRequest && createPortal(
        <div className="fixed inset-0 z-[9999] overflow-y-auto bg-slate-900/60 backdrop-blur-sm p-4 sm:p-6 flex justify-center items-center">
          {/* Backdrop click to close */}
          <div
            className="fixed inset-0"
            onClick={() => setIsDetailOpen(false)}
          />

          <div className="relative my-auto bg-white rounded-2xl sm:rounded-3xl max-w-xl w-full shadow-2xl border border-slate-100 z-10 max-h-[90vh] flex flex-col overflow-hidden">
            {/* Modal Header - Fixed at Top */}
            <div className="p-5 sm:p-6 pb-4 border-b border-gray-100 flex items-center justify-between gap-3 shrink-0 bg-white">
              <div className="flex items-center gap-3 min-w-0">
                <div className="w-11 h-11 rounded-2xl bg-emerald-100 text-[#1C7D5A] flex items-center justify-center shrink-0">
                  <Building2 className="w-5 h-5" />
                </div>
                <div className="min-w-0">
                  <h3 className="text-lg font-bold text-gray-900 truncate">{selectedRequest.madrasaName}</h3>
                  <p className="text-xs text-gray-500">
                    আবেদনের আইডি: <span className="font-mono">{selectedRequest._id}</span>
                  </p>
                </div>
              </div>

              {/* Close Button */}
              <button
                type="button"
                onClick={() => setIsDetailOpen(false)}
                className="text-gray-400 hover:text-gray-700 p-2 rounded-full hover:bg-gray-100 transition-colors shrink-0 cursor-pointer"
                title="বন্ধ করুন"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Modal Scrollable Body */}
            <div className="p-5 sm:p-6 overflow-y-auto space-y-5 flex-1">
              {/* Direct WhatsApp Callout */}
              <div className="p-4 rounded-2xl bg-emerald-50 border border-emerald-200/80 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                <div>
                  <div className="text-xs font-semibold text-emerald-800">হোয়াটসঅ্যাপ যোগাযোগ:</div>
                  <div className="text-base font-bold text-emerald-950 font-mono mt-0.5">
                    {selectedRequest.whatsapp}
                  </div>
                </div>
                <a
                  href={generateWhatsAppLink(selectedRequest)}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center justify-center gap-2 bg-[#25D366] hover:bg-[#20ba5a] text-white font-bold text-sm px-4 py-2.5 rounded-xl shadow-xs transition-all active:scale-95 shrink-0"
                >
                  <MessageCircle className="w-4 h-4 fill-white" />
                  <span>হোয়াটসঅ্যাপে চ্যাট করুন</span>
                </a>
              </div>

              {/* Details Grid */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 p-4 bg-gray-50 rounded-2xl text-xs sm:text-sm border border-gray-100">
                <div>
                  <span className="text-gray-400 block text-xs">আবেদনকারী:</span>
                  <span className="font-semibold text-gray-800">
                    {selectedRequest.applicantName} ({selectedRequest.designation})
                  </span>
                </div>
                <div>
                  <span className="text-gray-400 block text-xs">মাদ্রাসার ধরন:</span>
                  <span className="font-semibold text-gray-800">{selectedRequest.madrasaType}</span>
                </div>
                <div>
                  <span className="text-gray-400 block text-xs">ছাত্র-ছাত্রী সংখ্যা:</span>
                  <span className="font-semibold text-gray-800">{selectedRequest.studentCount}</span>
                </div>
                <div>
                  <span className="text-gray-400 block text-xs">জেলা ও ঠিকানা:</span>
                  <span className="font-semibold text-gray-800">
                    {selectedRequest.district} {selectedRequest.address ? `, ${selectedRequest.address}` : ""}
                  </span>
                </div>
                {selectedRequest.phone && (
                  <div>
                    <span className="text-gray-400 block text-xs">বিকল্প ফোন:</span>
                    <span className="font-mono font-medium text-gray-800">{selectedRequest.phone}</span>
                  </div>
                )}
                <div>
                  <span className="text-gray-400 block text-xs">আবেদনের সময়:</span>
                  <span className="text-gray-700">
                    {new Date(selectedRequest.createdAt).toLocaleString("bn-BD")}
                  </span>
                </div>
              </div>

              {/* User Note */}
              {selectedRequest.notes && (
                <div className="p-3 bg-amber-50/70 border border-amber-200 rounded-xl text-xs text-amber-900">
                  <span className="font-bold block mb-1">গ্রাহকের বিশেষ বার্তা:</span>
                  <p className="italic">{selectedRequest.notes}</p>
                </div>
              )}

              {/* Status Update Form */}
              <div className="space-y-4 pt-3 border-t border-gray-100">
                <div>
                  <label className="block text-xs font-bold text-gray-700 mb-1.5 uppercase">
                    আবেদন স্ট্যাটাস পরিবর্তন করুন
                  </label>
                  <select
                    value={editingStatus}
                    onChange={(e) => setEditingStatus(e.target.value)}
                    className="w-full px-3.5 py-2.5 rounded-xl border border-gray-200 text-sm font-semibold outline-none focus:border-emerald-600 focus:ring-2 focus:ring-emerald-500/20 bg-white"
                  >
                    <option value="pending">অপেক্ষমাণ (Pending)</option>
                    <option value="contacted">যোগাযোগ সম্পন্ন (Contacted)</option>
                    <option value="portal_created">পোর্টাল প্রদান করা হয়েছে (Portal Created)</option>
                    <option value="rejected">বাতিল (Rejected)</option>
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-bold text-gray-700 mb-1.5 uppercase">
                    অ্যাডমিন নোট / মন্তব্য (টিমের অভ্যন্তরীণ ব্যবহারের জন্য)
                  </label>
                  <textarea
                    rows="3"
                    placeholder="উদাঃ হোয়াটসঅ্যাপে কথা হয়েছে, পোর্টাল ইউজারনেম ও পাসওয়ার্ড দেওয়া হয়েছে..."
                    value={editingNotes}
                    onChange={(e) => setEditingNotes(e.target.value)}
                    className="w-full px-3.5 py-2.5 rounded-xl border border-gray-200 text-sm outline-none focus:border-emerald-600 focus:ring-2 focus:ring-emerald-500/20 bg-white resize-none"
                  />
                </div>
              </div>
            </div>

            {/* Modal Footer - Fixed at Bottom */}
            <div className="p-4 sm:p-5 border-t border-gray-100 bg-gray-50/80 flex items-center justify-between gap-3 shrink-0">
              <button
                type="button"
                onClick={() => handleDelete(selectedRequest._id)}
                className="text-rose-600 hover:bg-rose-50 px-3.5 py-2 rounded-xl text-sm font-semibold transition-colors flex items-center gap-1.5 cursor-pointer"
              >
                <Trash2 className="w-4 h-4" />
                <span>আবেদন মুছুন</span>
              </button>

              <div className="flex items-center gap-2">
                <button
                  type="button"
                  onClick={() => setIsDetailOpen(false)}
                  className="border border-gray-200 hover:bg-gray-100 bg-white text-gray-600 px-4 py-2 rounded-xl text-sm font-semibold transition-colors cursor-pointer"
                >
                  বন্ধ করুন
                </button>
                <button
                  type="button"
                  disabled={isUpdating}
                  onClick={() =>
                    handleStatusUpdate(selectedRequest._id, editingStatus, editingNotes)
                  }
                  className="bg-[#1C7D5A] hover:bg-[#0a6646] active:scale-95 text-white px-5 py-2 rounded-xl text-sm font-bold shadow-sm transition-all cursor-pointer disabled:opacity-50"
                >
                  {isUpdating ? "সংরক্ষণ হচ্ছে..." : "আপডেট সংরক্ষণ করুন"}
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

export default DemoRequests;
