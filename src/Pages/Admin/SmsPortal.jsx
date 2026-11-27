import { useState, useEffect, useMemo, useCallback } from "react";
import {
  MessageSquare,
  Send,
  Wallet,
  AlertTriangle,
  Users,
  BookOpen,
  Briefcase,
  GraduationCap,
  Copy,
  Check,
  Loader2,
  Clock,
  CheckCircle2,
  XCircle,
  History,
} from "lucide-react";
import { toast } from "react-hot-toast";
import portalService from "../../services/portalService";
import axiosInstance from "../../api/axiosInstance";

const QUICK_TEMPLATES = [
  {
    label: "ছুটির নোটিশ",
    text: "আসসালামু আলাইকুম। আগামীকাল অনিবার্য কারণবশত মাদ্রাসার সকল শ্রেণির পাঠদান বন্ধ থাকবে।",
  },
  {
    label: "অভিভাবক সমাবেশ",
    text: "আসসালামু আলাইকুম। আগামী শনিবার সকাল ১০:০০ টায় মাদ্রাসায় অভিভাবক সমাবেশ অনুষ্ঠিত হবে।",
  },
  {
    label: "বকেয়া ফি",
    text: "আসসালামু আলাইকুম। আপনার সন্তানের চলতি মাসের মাদ্রাসার ফি পরিশোধ করার জন্য অনুরোধ করা যাচ্ছে।",
  },
  {
    label: "পরীক্ষার নোটিশ",
    text: "আসসালামু আলাইকুম। আগামী সপ্তাহ থেকে সাময়িক পরীক্ষা শুরু হবে। যথাসময়ে উপস্থিত থাকার অনুরোধ রইল।",
  },
];

const MERCHANT_NUMBER = "+880 1700 000000";

const SmsPortal = () => {
  const [activeTab, setActiveTab] = useState("send");
  const [copiedMerchant, setCopiedMerchant] = useState(false);

  // Wallet & Recharge States
  const [wallet, setWallet] = useState({
    balance: 0.0,
    rates: { single: 0.3, bulk: 0.25, masking: 0.4 },
  });
  const [recharges, setRecharges] = useState([]);
  const [smsLogs, setSmsLogs] = useState([]);
  const [logCategoryFilter, setLogCategoryFilter] = useState("all");
  const [rechargeAmount, setRechargeAmount] = useState("");
  const [senderNumber, setSenderNumber] = useState("");
  const [transactionId, setTransactionId] = useState("");

  // Broadcast Compose States
  const [recipientType, setRecipientType] = useState("Student");
  const [recipientId, setRecipientId] = useState("");
  const [classId, setClassId] = useState("");
  const [message, setMessage] = useState("");
  const [smsType, setSmsType] = useState("Bulk");

  // Directory Lists
  const [students, setStudents] = useState([]);
  const [parents, setParents] = useState([]);
  const [teachers, setTeachers] = useState([]);
  const [classes, setClasses] = useState([]);

  // Loading States
  const [loading, setLoading] = useState(false);
  const [submittingRecharge, setSubmittingRecharge] = useState(false);
  const [sendingBroadcast, setSendingBroadcast] = useState(false);

  const loadInitialData = useCallback(async () => {
    try {
      setLoading(true);
      const [balRes, recRes, logsRes, classRes, studRes, parentRes, staffRes] = await Promise.all([
        portalService.getSmsBalance(),
        portalService.getSmsRecharges(),
        portalService.getSmsLogs({ limit: 100 }).catch(() => ({ data: [] })),
        axiosInstance.get("/v1/classes").catch(() => ({ data: { data: [] } })),
        axiosInstance.get("/v1/students?limit=200").catch(() => ({ data: { data: [] } })),
        axiosInstance.get("/v1/parents").catch(() => ({ data: { data: [] } })),
        axiosInstance.get("/v1/staffs").catch(() => ({ data: { data: [] } })),
      ]);

      if (balRes?.success) setWallet(balRes.data);
      if (recRes?.success) setRecharges(recRes.data || []);
      if (logsRes?.success) setSmsLogs(logsRes.data || []);

      setClasses(classRes?.data?.data || []);
      setStudents(studRes?.data?.data || []);
      setParents(parentRes?.data?.data || []);

      const staffList = staffRes?.data?.data || [];
      const teacherList = staffList.filter(
        (s) => s.role === "teacher" || s.designation?.toLowerCase().includes("teacher")
      );
      setTeachers(teacherList.length > 0 ? teacherList : staffList);
    } catch (err) {
      console.error("Failed to sync SMS configs", err);
      toast.error("এসএমএস তথ্য লোড করা যায়নি");
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    loadInitialData();
  }, [loadInitialData]);

  const handleCopyMerchant = async () => {
    try {
      await navigator.clipboard.writeText(MERCHANT_NUMBER.replace(/\s+/g, ""));
      setCopiedMerchant(true);
      toast.success("নম্বর কপি হয়েছে");
      setTimeout(() => setCopiedMerchant(false), 2000);
    } catch {
      toast.error("কপি করা যায়নি");
    }
  };

  const handleRechargeSubmit = async (e) => {
    e.preventDefault();
    if (Number(rechargeAmount) < 100) {
      toast.error("সর্বনিম্ন রিচার্জ ৳ ১০০");
      return;
    }

    try {
      setSubmittingRecharge(true);
      const res = await portalService.submitSmsRecharge({
        amount: Number(rechargeAmount),
        senderNumber: senderNumber.trim(),
        transactionId: transactionId.trim(),
      });

      if (res.success) {
        toast.success("রিচার্জ অনুরোধ জমা হয়েছে (অনুমোদনের অপেক্ষায়)");
        setRechargeAmount("");
        setSenderNumber("");
        setTransactionId("");

        const recRes = await portalService.getSmsRecharges();
        if (recRes.success) setRecharges(recRes.data || []);
      }
    } catch (err) {
      toast.error(err.response?.data?.message || "রিচার্জ অনুরোধ ব্যর্থ হয়েছে");
    } finally {
      setSubmittingRecharge(false);
    }
  };

  const handleSendBroadcast = async (e) => {
    e.preventDefault();
    if (!message.trim()) {
      toast.error("অনুগ্রহ করে বার্তা লিখুন");
      return;
    }

    try {
      setSendingBroadcast(true);
      const res = await portalService.broadcastSms({
        recipientType,
        recipientId: recipientId || undefined,
        classId: classId || undefined,
        message: message.trim(),
        smsType,
      });

      if (res.success) {
        toast.success(`${res.data.totalSent} জন প্রাপকের কাছে বার্তা পাঠানো হয়েছে`);
        setMessage("");
        setRecipientId("");
        setClassId("");

        const [balRes, logsRes] = await Promise.all([
          portalService.getSmsBalance(),
          portalService.getSmsLogs({ limit: 100 }).catch(() => null),
        ]);
        if (balRes.success) setWallet(balRes.data);
        if (logsRes?.success) setSmsLogs(logsRes.data || []);
      }
    } catch (err) {
      toast.error(err.response?.data?.message || "বার্তা পাঠানো যায়নি");
    } finally {
      setSendingBroadcast(false);
    }
  };

  const getSelectedRate = () => {
    if (smsType === "Bulk") return Number(wallet.rates?.bulk ?? 0.25);
    if (smsType === "Masking") return Number(wallet.rates?.masking ?? 0.4);
    return Number(wallet.rates?.single ?? 0.3);
  };

  const getStudentClassId = (s) => s?.class_id?._id || s?.class_id || s?.classId?._id || s?.classId;

  const countRecipients = () => {
    if (recipientType === "Student") return recipientId ? 1 : students.length;
    if (recipientType === "Class") {
      if (!classId) return 0;
      return students.filter((s) => String(getStudentClassId(s)) === String(classId)).length;
    }
    if (recipientType === "Teacher") return recipientId ? 1 : teachers.length;
    if (recipientType === "Parent") return recipientId ? 1 : parents.length;
    return 0;
  };

  const isUnicode = useMemo(
    () => Array.from(message).some((ch) => ch.charCodeAt(0) > 127),
    [message]
  );
  const charCount = message.length;
  const singleLimit = isUnicode ? 70 : 160;
  const multiLimit = isUnicode ? 67 : 153;
  const smsSegments =
    charCount === 0 ? 0 : charCount <= singleLimit ? 1 : Math.ceil(charCount / multiLimit);

  const totalRecipients = countRecipients();
  const activeRate = getSelectedRate();
  const estimatedCost = Number((totalRecipients * activeRate).toFixed(2));
  const isInsufficientBalance = estimatedCost > Number(wallet.balance || 0);
  const pendingCount = recharges.filter((r) => r.status === "Pending").length;

  const categories = [
    { id: "Student", label: "শিক্ষার্থী", icon: GraduationCap },
    { id: "Parent", label: "অভিভাবক", icon: Users },
    { id: "Teacher", label: "শিক্ষক", icon: Briefcase },
    { id: "Class", label: "শ্রেণি", icon: BookOpen },
  ];

  const renderStatus = (status) => {
    if (status === "Approved") {
      return (
        <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-medium bg-emerald-50 text-emerald-700 border border-emerald-200">
          <CheckCircle2 className="w-3 h-3" /> অনুমোদিত
        </span>
      );
    }
    if (status === "Rejected") {
      return (
        <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-medium bg-rose-50 text-rose-700 border border-rose-200">
          <XCircle className="w-3 h-3" /> বাতিল
        </span>
      );
    }
    return (
      <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-medium bg-amber-50 text-amber-700 border border-amber-200">
        <Clock className="w-3 h-3" /> অপেক্ষমান
      </span>
    );
  };

  return (
    <div className="space-y-5 animate-in fade-in duration-300">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div className="flex items-center gap-3">
          <div className="w-11 h-11 rounded-xl bg-[#1C7D5A]/10 text-[#1C7D5A] flex items-center justify-center shrink-0">
            <MessageSquare className="w-5 h-5" />
          </div>
          <div>
            <h1 className="text-xl font-bold text-slate-800 dark:text-slate-100">
              বার্তা ও এসএমএস
            </h1>
            <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
              শিক্ষার্থী, অভিভাবক ও শিক্ষকদের কাছে বার্তা পাঠান এবং ব্যালেন্স পরিচালনা করুন
            </p>
          </div>
        </div>

        {/* Clean Tab Switcher */}
        <div className="inline-flex p-1 rounded-lg bg-slate-100 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 self-start sm:self-auto">
          <button
            type="button"
            onClick={() => setActiveTab("send")}
            className={`px-4 py-2 rounded-md text-xs font-semibold flex items-center gap-1.5 transition-all cursor-pointer ${
              activeTab === "send"
                ? "bg-white dark:bg-slate-900 text-[#1C7D5A] shadow-sm"
                : "text-slate-600 dark:text-slate-400 hover:text-slate-900"
            }`}
          >
            <Send className="w-3.5 h-3.5" />
            বার্তা পাঠান
          </button>
          <button
            type="button"
            onClick={() => setActiveTab("recharge")}
            className={`px-4 py-2 rounded-md text-xs font-semibold flex items-center gap-1.5 transition-all cursor-pointer ${
              activeTab === "recharge"
                ? "bg-white dark:bg-slate-900 text-[#1C7D5A] shadow-sm"
                : "text-slate-600 dark:text-slate-400 hover:text-slate-900"
            }`}
          >
            <Wallet className="w-3.5 h-3.5" />
            ওয়ালেট ও রিচার্জ
            {pendingCount > 0 && (
              <span className="ml-1 px-1.5 py-0.2 rounded-full text-[10px] font-bold bg-amber-500 text-white">
                {pendingCount}
              </span>
            )}
          </button>
          <button
            type="button"
            onClick={() => setActiveTab("logs")}
            className={`px-4 py-2 rounded-md text-xs font-semibold flex items-center gap-1.5 transition-all cursor-pointer ${
              activeTab === "logs"
                ? "bg-white dark:bg-slate-900 text-[#1C7D5A] shadow-sm"
                : "text-slate-600 dark:text-slate-400 hover:text-slate-900"
            }`}
          >
            <History className="w-3.5 h-3.5" />
            এসএমএস লগ
          </button>
        </div>
      </div>

      {/* Minimal 3-Card Summary Row */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div className="bg-white dark:bg-slate-900 p-4 rounded-xl border border-slate-200 dark:border-slate-800 flex items-center justify-between">
          <div>
            <p className="text-xs font-medium text-slate-500 dark:text-slate-400">বর্তমান ব্যালেন্স</p>
            <p className="text-xl font-bold text-[#1C7D5A] mt-1">
              ৳ {Number(wallet.balance || 0).toFixed(2)}
            </p>
          </div>
          <button
            type="button"
            onClick={() => setActiveTab("recharge")}
            className="text-xs font-semibold text-[#1C7D5A] hover:underline cursor-pointer"
          >
            + রিচার্জ
          </button>
        </div>

        <div className="bg-white dark:bg-slate-900 p-4 rounded-xl border border-slate-200 dark:border-slate-800 flex items-center justify-between">
          <div>
            <p className="text-xs font-medium text-slate-500 dark:text-slate-400">
              এসএমএস রেট ({smsType})
            </p>
            <p className="text-xl font-bold text-slate-800 dark:text-slate-100 mt-1">
              ৳ {activeRate.toFixed(2)}{" "}
              <span className="text-xs font-normal text-slate-400">/ SMS</span>
            </p>
          </div>
          <MessageSquare className="w-5 h-5 text-slate-300 dark:text-slate-600" />
        </div>

        <div className="bg-white dark:bg-slate-900 p-4 rounded-xl border border-slate-200 dark:border-slate-800 flex items-center justify-between">
          <div>
            <p className="text-xs font-medium text-slate-500 dark:text-slate-400">
              অপেক্ষমান রিচার্জ
            </p>
            <p className="text-xl font-bold text-slate-800 dark:text-slate-100 mt-1">
              {pendingCount} টি
            </p>
          </div>
          <Clock className="w-5 h-5 text-slate-300 dark:text-slate-600" />
        </div>
      </div>

      {/* TAB 1: COMPOSE */}
      {activeTab === "send" && (
        <form
          onSubmit={handleSendBroadcast}
          className="bg-white dark:bg-slate-900 rounded-xl border border-slate-200 dark:border-slate-800 p-5 md:p-6 space-y-5"
        >
          {/* Recipient Type Tabs */}
          <div className="space-y-2">
            <label className="text-xs font-semibold text-slate-600 dark:text-slate-300 block">
              প্রাপকের ধরন
            </label>
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5">
              {categories.map((cat) => {
                const Icon = cat.icon;
                const active = recipientType === cat.id;
                return (
                  <button
                    key={cat.id}
                    type="button"
                    onClick={() => {
                      setRecipientType(cat.id);
                      setRecipientId("");
                      setClassId("");
                    }}
                    className={`py-2.5 px-3.5 rounded-lg border text-sm font-semibold flex items-center justify-center gap-2 transition-all cursor-pointer ${
                      active
                        ? "border-[#1C7D5A] bg-[#1C7D5A]/8 text-[#1C7D5A] dark:text-emerald-400"
                        : "border-slate-200 dark:border-slate-700 text-slate-600 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-800"
                    }`}
                  >
                    <Icon className="w-4 h-4" />
                    {cat.label}
                  </button>
                );
              })}
            </div>
          </div>

          {/* Target & SMS Rate Row */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-1.5">
              <label className="text-xs font-semibold text-slate-600 dark:text-slate-300 block">
                {recipientType === "Class" ? "শ্রেণি নির্বাচন করুন" : "প্রাপক নির্বাচন করুন"}
              </label>
              {recipientType === "Class" ? (
                <select
                  required
                  value={classId}
                  onChange={(e) => setClassId(e.target.value)}
                  className="w-full px-3.5 py-2.5 bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-lg text-sm text-slate-700 dark:text-slate-200 outline-none focus:border-[#1C7D5A]"
                >
                  <option value="">-- শ্রেণি বাছাই করুন --</option>
                  {classes.map((c) => (
                    <option key={c._id} value={c._id}>
                      {c.name}
                    </option>
                  ))}
                </select>
              ) : (
                <select
                  value={recipientId}
                  onChange={(e) => setRecipientId(e.target.value)}
                  className="w-full px-3.5 py-2.5 bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-lg text-sm text-slate-700 dark:text-slate-200 outline-none focus:border-[#1C7D5A]"
                >
                  <option value="">
                    সকল{" "}
                    {recipientType === "Student"
                      ? `শিক্ষার্থী (${students.length})`
                      : recipientType === "Parent"
                      ? `অভিভাবক (${parents.length})`
                      : `শিক্ষক (${teachers.length})`}
                  </option>
                  {recipientType === "Student" &&
                    students.map((s) => (
                      <option key={s._id} value={s._id}>
                        {s.firstName} {s.lastName || ""} (রোল: {s.roll_number || "N/A"})
                      </option>
                    ))}
                  {recipientType === "Teacher" &&
                    teachers.map((t) => (
                      <option key={t._id} value={t._id}>
                        {t.name} ({t.phone || "নম্বর নেই"})
                      </option>
                    ))}
                  {recipientType === "Parent" &&
                    parents.map((p) => (
                      <option key={p._id} value={p._id}>
                        {p.fatherName || p.motherName || "অভিভাবক"} ({p.contact || "নম্বর নেই"})
                      </option>
                    ))}
                </select>
              )}
            </div>

            <div className="space-y-1.5">
              <label className="text-xs font-semibold text-slate-600 dark:text-slate-300 block">
                এসএমএস ধরন
              </label>
              <select
                value={smsType}
                onChange={(e) => setSmsType(e.target.value)}
                className="w-full px-3.5 py-2.5 bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-lg text-sm text-slate-700 dark:text-slate-200 outline-none focus:border-[#1C7D5A]"
              >
                <option value="Bulk">
                  Bulk SMS (৳ {Number(wallet.rates?.bulk ?? 0.25).toFixed(2)} / SMS)
                </option>
                <option value="Single">
                  Single SMS (৳ {Number(wallet.rates?.single ?? 0.3).toFixed(2)} / SMS)
                </option>
                <option value="Masking">
                  Masking SMS (৳ {Number(wallet.rates?.masking ?? 0.4).toFixed(2)} / SMS)
                </option>
              </select>
            </div>
          </div>

          {/* Message Body */}
          <div className="space-y-2">
            <div className="flex flex-wrap items-center justify-between gap-2">
              <label className="text-xs font-semibold text-slate-600 dark:text-slate-300">
                বার্তা লিখুন
              </label>
              <span className="text-xs text-slate-400">
                {charCount} অক্ষর • {smsSegments} অংশ ({isUnicode ? "৭০ অক্ষর/অংশ" : "160 chars/part"})
              </span>
            </div>

            <textarea
              required
              rows={5}
              placeholder="এখানে আপনার বার্তা লিখুন..."
              value={message}
              onChange={(e) => setMessage(e.target.value)}
              className="w-full px-4 py-3 bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-lg text-sm text-slate-800 dark:text-slate-100 outline-none focus:border-[#1C7D5A] leading-relaxed resize-y"
            />

            {/* Subtle Template Chips */}
            <div className="flex flex-wrap items-center gap-1.5 pt-0.5">
              <span className="text-xs text-slate-400 mr-1">টেমপ্লেট:</span>
              {QUICK_TEMPLATES.map((tpl) => (
                <button
                  key={tpl.label}
                  type="button"
                  onClick={() => setMessage(tpl.text)}
                  className="px-2.5 py-1 rounded-md text-xs text-slate-600 dark:text-slate-300 bg-slate-50 dark:bg-slate-800 hover:bg-[#1C7D5A]/10 hover:text-[#1C7D5A] border border-slate-200 dark:border-slate-700 transition-colors cursor-pointer"
                >
                  {tpl.label}
                </button>
              ))}
            </div>
          </div>

          {/* Clean Footer Action Bar */}
          <div className="pt-4 border-t border-slate-100 dark:border-slate-800 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div className="text-sm text-slate-600 dark:text-slate-300 flex flex-wrap items-center gap-x-4 gap-y-1">
              <span>
                প্রাপক: <strong className="text-slate-800 dark:text-slate-100">{totalRecipients} জন</strong>
              </span>
              <span>
                সম্ভাব্য খরচ:{" "}
                <strong className="text-[#1C7D5A]">৳ {estimatedCost.toFixed(2)}</strong>
              </span>
              {isInsufficientBalance && totalRecipients > 0 && (
                <span className="text-xs font-semibold text-rose-600 flex items-center gap-1">
                  <AlertTriangle className="w-3.5 h-3.5" />
                  পর্যাপ্ত ব্যালেন্স নেই
                </span>
              )}
            </div>

            <button
              type="submit"
              disabled={
                loading ||
                sendingBroadcast ||
                isInsufficientBalance ||
                totalRecipients === 0 ||
                !message.trim()
              }
              className="px-6 py-2.5 bg-[#1C7D5A] hover:bg-[#156347] text-white text-sm font-semibold rounded-lg transition-colors flex items-center justify-center gap-2 disabled:opacity-45 disabled:pointer-events-none cursor-pointer"
            >
              {sendingBroadcast ? (
                <>
                  <Loader2 className="w-4 h-4 animate-spin" />
                  পাঠানো হচ্ছে...
                </>
              ) : (
                <>
                  <Send className="w-4 h-4" />
                  বার্তা পাঠান
                </>
              )}
            </button>
          </div>
        </form>
      )}

      {/* TAB 2: WALLET & RECHARGE */}
      {activeTab === "recharge" && (
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-5 items-start">
          {/* Recharge Form */}
          <div className="lg:col-span-4 bg-white dark:bg-slate-900 rounded-xl border border-slate-200 dark:border-slate-800 p-5 space-y-4">
            <h2 className="text-sm font-bold text-slate-800 dark:text-slate-100">
              রিচার্জ অনুরোধ
            </h2>

            <div className="bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-lg p-3.5 space-y-1.5">
              <div className="flex items-center justify-between text-xs text-slate-500 dark:text-slate-400">
                <span>bKash / Nagad Merchant</span>
                <span>সর্বনিম্ন ৳ ১০০</span>
              </div>
              <div className="flex items-center justify-between gap-2">
                <span className="font-mono text-sm font-bold text-slate-800 dark:text-slate-100">
                  {MERCHANT_NUMBER}
                </span>
                <button
                  type="button"
                  onClick={handleCopyMerchant}
                  className="text-xs font-semibold text-[#1C7D5A] flex items-center gap-1 hover:underline cursor-pointer"
                >
                  {copiedMerchant ? <Check className="w-3.5 h-3.5" /> : <Copy className="w-3.5 h-3.5" />}
                  {copiedMerchant ? "কপি হয়েছে" : "কপি"}
                </button>
              </div>
            </div>

            <form onSubmit={handleRechargeSubmit} className="space-y-3.5">
              <div className="space-y-1">
                <label className="text-xs font-semibold text-slate-600 dark:text-slate-300 block">
                  পরিমাণ (৳)
                </label>
                <input
                  type="number"
                  min={100}
                  required
                  placeholder="যেমন: ৫০০"
                  value={rechargeAmount}
                  onChange={(e) => setRechargeAmount(e.target.value)}
                  className="w-full px-3.5 py-2.5 bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-lg text-sm text-slate-800 dark:text-slate-100 outline-none focus:border-[#1C7D5A]"
                />
              </div>

              <div className="space-y-1">
                <label className="text-xs font-semibold text-slate-600 dark:text-slate-300 block">
                  প্রেরকের নম্বর
                </label>
                <input
                  type="text"
                  required
                  placeholder="017XXXXXXXX"
                  value={senderNumber}
                  onChange={(e) => setSenderNumber(e.target.value)}
                  className="w-full px-3.5 py-2.5 bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-lg text-sm font-mono text-slate-800 dark:text-slate-100 outline-none focus:border-[#1C7D5A]"
                />
              </div>

              <div className="space-y-1">
                <label className="text-xs font-semibold text-slate-600 dark:text-slate-300 block">
                  ট্রানজেকশন আইডি (TrxID)
                </label>
                <input
                  type="text"
                  required
                  placeholder="TR_BKA897A"
                  value={transactionId}
                  onChange={(e) => setTransactionId(e.target.value)}
                  className="w-full px-3.5 py-2.5 bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-lg text-sm font-mono uppercase text-slate-800 dark:text-slate-100 outline-none focus:border-[#1C7D5A]"
                />
              </div>

              <button
                type="submit"
                disabled={submittingRecharge || Number(rechargeAmount) < 100}
                className="w-full py-2.5 bg-[#1C7D5A] hover:bg-[#156347] text-white text-sm font-semibold rounded-lg transition-colors disabled:opacity-45 disabled:pointer-events-none cursor-pointer"
              >
                {submittingRecharge ? "জমা হচ্ছে..." : "অনুরোধ জমা দিন"}
              </button>
            </form>
          </div>

          {/* Recharge History Table */}
          <div className="lg:col-span-8 bg-white dark:bg-slate-900 rounded-xl border border-slate-200 dark:border-slate-800 overflow-hidden">
            <div className="px-5 py-4 border-b border-slate-100 dark:border-slate-800 flex items-center justify-between">
              <h2 className="text-sm font-bold text-slate-800 dark:text-slate-100">
                রিচার্জ ইতিহাস
              </h2>
              <span className="text-xs text-slate-400">মোট {recharges.length} টি</span>
            </div>

            <div className="overflow-x-auto">
              <table className="w-full text-left border-collapse">
                <thead>
                  <tr className="bg-slate-50 dark:bg-slate-800/60 border-b border-slate-200 dark:border-slate-800 text-xs font-semibold text-slate-500 dark:text-slate-400">
                    <th className="px-5 py-3">তারিখ</th>
                    <th className="px-5 py-3">পরিমাণ</th>
                    <th className="px-5 py-3">নম্বর</th>
                    <th className="px-5 py-3">TrxID</th>
                    <th className="px-5 py-3 text-center">অবস্থা</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100 dark:divide-slate-800 text-sm">
                  {recharges.length === 0 ? (
                    <tr>
                      <td colSpan={5} className="px-5 py-12 text-center text-xs text-slate-400">
                        কোনো রিচার্জ ইতিহাস পাওয়া যায়নি
                      </td>
                    </tr>
                  ) : (
                    recharges.map((req) => (
                      <tr
                        key={req._id}
                        className="hover:bg-slate-50/60 dark:hover:bg-slate-800/40 transition-colors"
                      >
                        <td className="px-5 py-3.5 text-xs text-slate-500 whitespace-nowrap">
                          {new Date(req.created_at).toLocaleDateString("bn-BD")}
                        </td>
                        <td className="px-5 py-3.5 font-bold text-slate-800 dark:text-slate-100 whitespace-nowrap">
                          ৳ {Number(req.amount || 0).toFixed(2)}
                        </td>
                        <td className="px-5 py-3.5 font-mono text-xs text-slate-600 dark:text-slate-300 whitespace-nowrap">
                          {req.senderNumber}
                        </td>
                        <td className="px-5 py-3.5 font-mono text-xs text-slate-600 dark:text-slate-300 whitespace-nowrap">
                          {req.transactionId}
                        </td>
                        <td className="px-5 py-3.5 text-center whitespace-nowrap">
                          {renderStatus(req.status)}
                        </td>
                      </tr>
                    ))
                  )}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}

      {/* TAB 3: SMS LOGS */}
      {activeTab === "logs" && (
        <div className="bg-white dark:bg-slate-900 rounded-xl border border-slate-200 dark:border-slate-800 overflow-hidden">
          <div className="px-5 py-4 border-b border-slate-100 dark:border-slate-800 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
            <div>
              <h2 className="text-sm font-bold text-slate-800 dark:text-slate-100">
                প্রেরিত এসএমএস লগ
              </h2>
              <p className="text-xs text-slate-400 mt-0.5">
                হাজিরা অটো-এসএমএস ও ব্রডকাস্ট বার্তার ডেলিভারি রেকর্ড
              </p>
            </div>
            <div className="flex items-center gap-2">
              {[
                { id: "all", label: "সব" },
                { id: "attendance", label: "হাজিরা (Auto)" },
                { id: "broadcast", label: "ব্রডকাস্ট" },
              ].map((item) => (
                <button
                  key={item.id}
                  type="button"
                  onClick={() => setLogCategoryFilter(item.id)}
                  className={`px-3 py-1.5 rounded-lg text-xs font-semibold border transition-colors cursor-pointer ${
                    logCategoryFilter === item.id
                      ? "bg-[#1C7D5A] text-white border-[#1C7D5A]"
                      : "bg-white dark:bg-slate-800 text-slate-600 dark:text-slate-300 border-slate-200 dark:border-slate-700 hover:bg-slate-50"
                  }`}
                >
                  {item.label}
                </button>
              ))}
            </div>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="bg-slate-50 dark:bg-slate-800/60 border-b border-slate-200 dark:border-slate-800 text-xs font-semibold text-slate-500 dark:text-slate-400">
                  <th className="px-5 py-3">সময়</th>
                  <th className="px-5 py-3">ধরন</th>
                  <th className="px-5 py-3">প্রাপক ও নম্বর</th>
                  <th className="px-5 py-3">বার্তা</th>
                  <th className="px-5 py-3 text-right">খরচ</th>
                  <th className="px-5 py-3 text-center">অবস্থা</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 dark:divide-slate-800 text-sm">
                {smsLogs.filter((l) => logCategoryFilter === "all" || (l.category || "broadcast") === logCategoryFilter).length === 0 ? (
                  <tr>
                    <td colSpan={6} className="px-5 py-12 text-center text-xs text-slate-400">
                      কোনো এসএমএস লগ পাওয়া যায়নি
                    </td>
                  </tr>
                ) : (
                  smsLogs
                    .filter((l) => logCategoryFilter === "all" || (l.category || "broadcast") === logCategoryFilter)
                    .map((log) => (
                      <tr key={log._id} className="hover:bg-slate-50/60 dark:hover:bg-slate-800/40 transition-colors">
                        <td className="px-5 py-3.5 text-xs text-slate-500 whitespace-nowrap">
                          {log.sentAt ? new Date(log.sentAt).toLocaleString("bn-BD") : "-"}
                        </td>
                        <td className="px-5 py-3.5 whitespace-nowrap">
                          <span className={`inline-flex items-center px-2 py-0.5 rounded-full text-[11px] font-semibold ${
                            log.category === "attendance"
                              ? "bg-indigo-50 text-indigo-700 border border-indigo-200"
                              : "bg-slate-100 text-slate-700 border border-slate-200"
                          }`}>
                            {log.category === "attendance" ? `হাজিরা (${log.attendanceStatus || ""})` : "ব্রডকাস্ট"}
                          </span>
                        </td>
                        <td className="px-5 py-3.5 whitespace-nowrap">
                          <p className="text-xs font-bold text-slate-800 dark:text-slate-100">{log.recipientName}</p>
                          <p className="text-[11px] font-mono text-slate-500">{log.to}</p>
                        </td>
                        <td className="px-5 py-3.5 text-xs text-slate-600 dark:text-slate-300 max-w-md">
                          {log.message}
                        </td>
                        <td className="px-5 py-3.5 text-right text-xs font-bold text-slate-800 dark:text-slate-100 whitespace-nowrap">
                          ৳ {Number(log.cost || 0).toFixed(2)}
                        </td>
                        <td className="px-5 py-3.5 text-center whitespace-nowrap">
                          <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-[11px] font-semibold ${
                            log.status === "failed"
                              ? "bg-rose-50 text-rose-700 border border-rose-200"
                              : "bg-emerald-50 text-emerald-700 border border-emerald-200"
                          }`}>
                            {log.status === "failed" ? "ব্যর্থ" : log.status === "simulated" ? "লগড (Sim)" : "প্রেরিত"}
                          </span>
                        </td>
                      </tr>
                    ))
                )}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  );
};

export default SmsPortal;
