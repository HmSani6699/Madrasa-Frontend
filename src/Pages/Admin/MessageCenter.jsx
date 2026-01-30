import { useState, useMemo } from "react";
import {
  Smartphone,
  Send,
  Users,
  GraduationCap,
  Briefcase,
  Search,
  Plus,
  History,
  CheckCircle2,
  AlertCircle,
  Hash,
  MessageSquare,
  Clock,
  Filter,
  MoreVertical,
  ChevronRight,
  ShieldCheck,
  Zap,
  LayoutGrid,
} from "lucide-react";

const MessageCenter = () => {
  const [activeTab, setActiveTab] = useState("send");
  const [recipientType, setRecipientType] = useState("student");
  const [message, setMessage] = useState("");
  const [showSuccessToast, setShowSuccessToast] = useState(false);

  // Mock Data
  const stats = [
    {
      label: "SMS Sent",
      value: "1,284",
      icon: Send,
      color: "text-blue-600",
      bg: "bg-blue-100",
    },
    {
      label: "Available Credits",
      value: "8,716",
      icon: Hash,
      color: "text-emerald-600",
      bg: "bg-emerald-100",
    },
    {
      label: "Delivery Rate",
      value: "98.5%",
      icon: ShieldCheck,
      color: "text-purple-600",
      bg: "bg-purple-100",
    },
    {
      label: "Today's Volume",
      value: "142",
      icon: Zap,
      color: "text-amber-600",
      bg: "bg-amber-100",
    },
  ];

  const smsHistory = [
    {
      id: 1,
      recipient: "Abdur Rahman (STU001)",
      type: "Individual",
      message: "Guardian Meeting tomorrow at 10 AM.",
      status: "delivered",
      time: "10:30 AM",
    },
    {
      id: 2,
      recipient: "Class 5 - All Students",
      type: "Bulk",
      message: "Reminder: Mid-term exams start from Monday.",
      status: "delivered",
      time: "Yesterday",
    },
    {
      id: 3,
      recipient: "Hafiz Ahmed (Teacher)",
      type: "Individual",
      message: "Please submit the attendance report.",
      status: "failed",
      time: "Jan 12",
    },
    {
      id: 4,
      recipient: "Section B - Guardians",
      type: "Bulk",
      message: "Winter vacation starts from 15th January.",
      status: "delivered",
      time: "Jan 10",
    },
  ];

  const handleSendMessage = () => {
    if (message.trim()) {
      setShowSuccessToast(true);
      setTimeout(() => setShowSuccessToast(false), 3000);
      setMessage("");
    }
  };

  return (
    <div className="min-h-screen bg-slate-50/50 p-4 md:p-8 animate-in fade-in duration-500">
      <div className="max-w-[1600px] mx-auto space-y-8">
        {/* Header */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 bg-white p-8 rounded-[2.5rem] border border-slate-200 shadow-sm">
          <div>
            <h1 className="text-3xl font-black text-slate-800 tracking-tight flex items-center gap-3">
              <Smartphone className="w-8 h-8 text-indigo-600" />
              SMS Management
            </h1>
            <p className="text-slate-500 font-bold mt-1 uppercase tracking-widest text-[10px]">
              Send and manage institutional communications
            </p>
          </div>
          <div className="flex gap-4">
            <button className="flex items-center gap-2 px-6 py-3 bg-indigo-600 text-white font-black rounded-2xl shadow-xl shadow-indigo-100 hover:bg-indigo-700 hover:scale-[1.02] active:scale-95 transition-all">
              <Plus className="w-5 h-5" />
              Add Credits
            </button>
          </div>
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {stats.map((stat, idx) => (
            <div
              key={idx}
              className="bg-white p-6 rounded-[2rem] border border-slate-200 shadow-sm flex items-center gap-5 group hover:border-indigo-200 transition-all"
            >
              <div
                className={`w-14 h-14 ${stat.bg} rounded-2xl flex items-center justify-center group-hover:scale-110 transition-transform`}
              >
                <stat.icon className={`w-7 h-7 ${stat.color}`} />
              </div>
              <div>
                <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest leading-none mb-1">
                  {stat.label}
                </p>
                <p className="text-2xl font-black text-slate-800 leading-none">
                  {stat.value}
                </p>
              </div>
            </div>
          ))}
        </div>

        {/* Main Content Areas */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 h-full">
          {/* Left Column: Form */}
          <div className="lg:col-span-2 space-y-8">
            <div className="bg-white rounded-[2.5rem] border border-slate-200 shadow-sm overflow-hidden flex flex-col h-full">
              <div className="flex border-b border-slate-100 bg-slate-50/50">
                <button
                  onClick={() => setActiveTab("send")}
                  className={`flex-1 py-6 font-black text-sm tracking-widest uppercase flex items-center justify-center gap-2 transition-all ${
                    activeTab === "send"
                      ? "bg-white text-indigo-600 border-b-2 border-indigo-600"
                      : "text-slate-400 hover:text-slate-600"
                  }`}
                >
                  <Send className="w-4 h-4" />
                  Send SMS
                </button>
                <button
                  onClick={() => setActiveTab("bulk")}
                  className={`flex-1 py-6 font-black text-sm tracking-widest uppercase flex items-center justify-center gap-2 transition-all ${
                    activeTab === "bulk"
                      ? "bg-white text-indigo-600 border-b-2 border-indigo-600"
                      : "text-slate-400 hover:text-slate-600"
                  }`}
                >
                  <LayoutGrid className="w-4 h-4" />
                  Bulk SMS
                </button>
              </div>

              <div className="p-8 space-y-8 flex-1">
                {/* Recipient Selection */}
                <div className="space-y-4">
                  <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest block">
                    Recipient Category
                  </label>
                  <div className="grid grid-cols-3 gap-4">
                    {[
                      { id: "student", label: "Students", icon: GraduationCap },
                      { id: "teacher", label: "Teachers", icon: Briefcase },
                      { id: "guardian", label: "Guardians", icon: Users },
                    ].map((type) => (
                      <button
                        key={type.id}
                        onClick={() => setRecipientType(type.id)}
                        className={`p-4 rounded-2xl border-2 flex flex-col items-center gap-2 transition-all group ${
                          recipientType === type.id
                            ? "bg-indigo-50 border-indigo-500 text-indigo-600 shadow-md shadow-indigo-100/50 scale-[1.02]"
                            : "bg-white border-slate-100 text-slate-400 hover:border-indigo-200 hover:text-indigo-400"
                        }`}
                      >
                        <type.icon
                          className={`w-6 h-6 ${recipientType === type.id ? "text-indigo-600" : "text-slate-300 group-hover:text-indigo-400"}`}
                        />
                        <span className="text-xs font-black uppercase tracking-tighter">
                          {type.label}
                        </span>
                      </button>
                    ))}
                  </div>
                </div>

                {/* Specific Recipient / Targeting */}
                <div className="space-y-4">
                  <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest block">
                    {activeTab === "send"
                      ? "Search Recipient"
                      : "Select Targets"}
                  </label>
                  <div className="relative">
                    <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400" />
                    <input
                      className="w-full bg-slate-50 border border-slate-100 rounded-2xl pl-12 pr-6 py-4 text-sm font-bold focus:border-indigo-500 focus:bg-white outline-none transition-all shadow-inner"
                      placeholder={
                        activeTab === "send"
                          ? `Search ${recipientType} by name or ID...`
                          : `Select classes, sections or departments...`
                      }
                    />
                  </div>
                </div>

                {/* Message Box */}
                <div className="space-y-4">
                  <div className="flex justify-between items-center">
                    <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest block">
                      Message Body
                    </label>
                    <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest">
                      {message.length} Characters /{" "}
                      {Math.ceil(message.length / 160) || 1} SMS
                    </span>
                  </div>
                  <div className="relative group">
                    <textarea
                      className="w-full bg-slate-50 border border-slate-100 rounded-[2rem] px-8 py-6 text-sm font-bold focus:border-indigo-500 focus:bg-white outline-none transition-all shadow-inner min-h-[200px] resize-none"
                      placeholder="Type your message here..."
                      value={message}
                      onChange={(e) => setMessage(e.target.value)}
                    ></textarea>
                    <div className="absolute right-6 bottom-6 flex gap-2">
                      <button className="p-3 bg-white border border-slate-200 rounded-xl text-slate-400 hover:text-indigo-600 transition-all shadow-sm">
                        <Clock className="w-5 h-5" />
                      </button>
                    </div>
                  </div>
                </div>

                {/* Action Buttons */}
                <div className="pt-4 flex gap-4">
                  <button
                    onClick={handleSendMessage}
                    disabled={!message.trim()}
                    className="flex-1 py-5 bg-indigo-600 text-white font-black rounded-[2rem] shadow-xl shadow-indigo-100 hover:bg-indigo-700 hover:scale-[1.01] active:scale-95 transition-all flex items-center justify-center gap-3 disabled:opacity-50 disabled:cursor-not-allowed uppercase tracking-[0.2em] text-sm"
                  >
                    <Send className="w-5 h-5" />
                    Send Message Now
                  </button>
                </div>
              </div>
            </div>
          </div>

          {/* Right Column: History & Tips */}
          <div className="space-y-8">
            {/* SMS History Sidebar */}
            <div className="bg-white rounded-[2.5rem] border border-slate-200 shadow-sm flex flex-col h-full max-h-[700px]">
              <div className="p-8 border-b border-slate-100 flex items-center justify-between bg-slate-50/30">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 bg-white rounded-xl flex items-center justify-center border border-slate-100 shadow-sm">
                    <History className="w-5 h-5 text-indigo-600" />
                  </div>
                  <h3 className="text-lg font-black text-slate-800 tracking-tight">
                    Recent History
                  </h3>
                </div>
                <button className="text-[10px] font-black text-indigo-600 uppercase tracking-widest hover:underline">
                  View All
                </button>
              </div>

              <div className="flex-1 overflow-y-auto custom-scrollbar p-6 space-y-4">
                {smsHistory.map((log) => (
                  <div
                    key={log.id}
                    className="p-5 bg-slate-50/50 border border-slate-100 rounded-3xl hover:bg-white hover:border-indigo-100 hover:shadow-lg hover:shadow-indigo-50 transition-all group cursor-pointer relative overflow-hidden"
                  >
                    <div
                      className={`absolute top-0 left-0 w-1 h-full ${log.status === "delivered" ? "bg-emerald-500" : "bg-rose-500"}`}
                    ></div>
                    <div className="flex justify-between items-start mb-2">
                      <span className="text-[10px] font-black text-slate-400 uppercase tracking-tighter shrink-0">
                        {log.type}
                      </span>
                      <span className="text-[9px] font-bold text-slate-400 uppercase">
                        {log.time}
                      </span>
                    </div>
                    <h4 className="text-sm font-black text-slate-800 truncate mb-1 pr-4">
                      {log.recipient}
                    </h4>
                    <p className="text-xs text-slate-500 font-medium line-clamp-2 leading-relaxed mb-3">
                      {log.message}
                    </p>
                    <div className="flex items-center justify-between pt-3 border-t border-slate-100">
                      <div className="flex items-center gap-1.5">
                        {log.status === "delivered" ? (
                          <CheckCircle2 className="w-3.5 h-3.5 text-emerald-500" />
                        ) : (
                          <AlertCircle className="w-3.5 h-3.5 text-rose-500" />
                        )}
                        <span
                          className={`text-[10px] font-black uppercase tracking-tight ${log.status === "delivered" ? "text-emerald-600" : "text-rose-600"}`}
                        >
                          {log.status}
                        </span>
                      </div>
                      <ChevronRight className="w-4 h-4 text-slate-300 group-hover:text-indigo-400 group-hover:translate-x-1 transition-all" />
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Quick Tips Card */}
            <div className="bg-gradient-to-br from-indigo-700 to-violet-800 rounded-[2.5rem] p-8 text-white shadow-xl shadow-indigo-100 relative overflow-hidden group">
              <MessageSquare className="absolute -right-8 -bottom-8 w-44 h-44 text-white opacity-10 group-hover:scale-110 group-hover:-rotate-12 transition-all duration-700" />
              <div className="relative z-10">
                <h3 className="text-xl font-black tracking-tight mb-4 flex items-center gap-2">
                  <AlertCircle className="w-5 h-5 text-indigo-200" />
                  SMS Protocol
                </h3>
                <ul className="space-y-4">
                  {[
                    "Character limit per SMS is 160 chars.",
                    "Unicode characters (Bangla) reduce limit.",
                    "Do not send sensitive credentials via SMS.",
                    "Credits are non-refundable after use.",
                  ].map((tip, i) => (
                    <li
                      key={i}
                      className="flex gap-3 text-sm font-bold text-indigo-100 items-start"
                    >
                      <div className="w-5 h-5 rounded-full bg-white/10 flex items-center justify-center shrink-0 mt-0.5 mt-0.5">
                        <span className="text-[10px] text-white">{i + 1}</span>
                      </div>
                      {tip}
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Success Feedback Toast */}
      {showSuccessToast && (
        <div className="fixed bottom-12 left-1/2 -translate-x-1/2 z-[200] animate-in slide-in-from-bottom-20 duration-500">
          <div className="bg-slate-900 border border-slate-800 backdrop-blur-xl py-5 px-8 rounded-[2rem] shadow-2xl flex items-center gap-4">
            <div className="w-10 h-10 bg-emerald-500 rounded-full flex items-center justify-center">
              <CheckCircle2 className="w-6 h-6 text-white" />
            </div>
            <div>
              <p className="text-white font-black tracking-tight">
                SMS Sent Successfully!
              </p>
              <p className="text-slate-400 text-xs font-bold uppercase tracking-widest">
                Message has been queued for delivery.
              </p>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default MessageCenter;
