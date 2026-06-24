import React, { useState, useEffect } from "react";
import { 
  MessageSquare, 
  Send, 
  CreditCard, 
  History, 
  DollarSign, 
  AlertTriangle, 
  Users, 
  BookOpen, 
  UserCheck, 
  TrendingUp,
  CheckCircle2,
  Clock,
  Smartphone,
  Search,
  Plus,
  HelpCircle,
  Briefcase,
  GraduationCap
} from "lucide-react";
import portalService from "../../services/portalService";
import axiosInstance from "../../api/axiosInstance";

const SmsPortal = () => {
  // Tabs State: "send" or "recharge"
  const [activeTab, setActiveTab] = useState("send");
  
  // Wallet & Recharge States
  const [wallet, setWallet] = useState({ balance: 0.00, rates: { single: 0.30, bulk: 0.25, masking: 0.40 } });
  const [recharges, setRecharges] = useState([]);
  const [rechargeAmount, setRechargeAmount] = useState("");
  const [senderNumber, setSenderNumber] = useState("");
  const [transactionId, setTransactionId] = useState("");
  
  // Broadcast Compose States
  const [recipientType, setRecipientType] = useState("Student"); // Student, Parent, Teacher, Class
  const [recipientId, setRecipientId] = useState("");
  const [classId, setClassId] = useState("");
  const [message, setMessage] = useState("");
  const [smsType, setSmsType] = useState("Single"); // Single, Bulk, Masking
  
  // Dynamic Option Lists
  const [students, setStudents] = useState([]);
  const [parents, setParents] = useState([]);
  const [teachers, setTeachers] = useState([]);
  const [classes, setClasses] = useState([]);
  
  // Status States
  const [loading, setLoading] = useState(false);
  const [submittingRecharge, setSubmittingRecharge] = useState(false);
  const [sendingBroadcast, setSendingBroadcast] = useState(false);
  const [successMsg, setSuccessMsg] = useState("");
  const [errorMsg, setErrorMsg] = useState("");

  const loadInitialData = async () => {
    try {
      setLoading(true);
      setErrorMsg("");
      
      // Fetch active balance & past recharge history
      const balRes = await portalService.getSmsBalance();
      const recRes = await portalService.getSmsRecharges();
      if (balRes.success) setWallet(balRes.data);
      if (recRes.success) setRecharges(recRes.data);

      // Fetch directory listings for selectors
      const [classRes, studRes, parentRes, staffRes] = await Promise.all([
        axiosInstance.get('/v1/classes').catch(() => ({ data: { data: [] } })),
        axiosInstance.get('/v1/students?limit=200').catch(() => ({ data: { data: [] } })),
        axiosInstance.get('/v1/parents').catch(() => ({ data: { data: [] } })),
        axiosInstance.get('/v1/staffs').catch(() => ({ data: { data: [] } }))
      ]);

      setClasses(classRes?.data?.data || []);
      setStudents(studRes?.data?.data || []);
      setParents(parentRes?.data?.data || []);
      
      const staffList = staffRes?.data?.data || [];
      const teacherList = staffList.filter(s => s.role === 'teacher' || s.designation?.toLowerCase().includes('teacher'));
      setTeachers(teacherList.length > 0 ? teacherList : staffList);

    } catch (err) {
      console.error("Failed to sync SMS configs", err);
      setErrorMsg("Failed to load SMS system directories.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadInitialData();
  }, []);

  const handleRechargeSubmit = async (e) => {
    e.preventDefault();
    if (Number(rechargeAmount) < 100) {
      setErrorMsg("Minimum recharge request is BDT 100.");
      return;
    }

    try {
      setSubmittingRecharge(true);
      setErrorMsg("");
      setSuccessMsg("");
      
      const res = await portalService.submitSmsRecharge({
        amount: Number(rechargeAmount),
        senderNumber,
        transactionId
      });

      if (res.success) {
        setSuccessMsg("Recharge request logged! Pending approval from Super Admin.");
        setRechargeAmount("");
        setSenderNumber("");
        setTransactionId("");
        
        // Reload recharge list
        const recRes = await portalService.getSmsRecharges();
        if (recRes.success) setRecharges(recRes.data);
        
        setTimeout(() => setSuccessMsg(""), 4000);
      }
    } catch (err) {
      setErrorMsg(err.response?.data?.message || "Failed to submit recharge request.");
    } finally {
      setSubmittingRecharge(false);
    }
  };

  const handleSendBroadcast = async (e) => {
    e.preventDefault();
    if (!message.trim()) {
      setErrorMsg("Please compose a message before broadcasting.");
      return;
    }

    try {
      setSendingBroadcast(true);
      setErrorMsg("");
      setSuccessMsg("");
      
      const payload = {
        recipientType,
        recipientId: recipientId || undefined,
        classId: classId || undefined,
        message,
        smsType
      };

      const res = await portalService.broadcastSms(payload);
      if (res.success) {
        setSuccessMsg(`SMS dispatched successfully to ${res.data.totalSent} recipients!`);
        setMessage("");
        setRecipientId("");
        setClassId("");
        
        // Reload balance
        const balRes = await portalService.getSmsBalance();
        if (balRes.success) setWallet(balRes.data);
        
        setTimeout(() => setSuccessMsg(""), 4000);
      }
    } catch (err) {
      setErrorMsg(err.response?.data?.message || "Failed to send SMS. Ensure balance is sufficient.");
    } finally {
      setSendingBroadcast(false);
    }
  };

  // Pricing & Broadcast counts helper
  const getSelectedRate = () => {
    if (smsType === 'Bulk') return wallet.rates.bulk;
    if (smsType === 'Masking') return wallet.rates.masking;
    return wallet.rates.single;
  };

  const countRecipients = () => {
    if (recipientType === 'Student') {
      if (recipientId) return 1;
      return students.length;
    }
    if (recipientType === 'Class') {
      if (!classId) return 0;
      return students.filter(s => s.class_id === classId).length;
    }
    if (recipientType === 'Teacher') {
      if (recipientId) return 1;
      return teachers.length;
    }
    if (recipientType === 'Parent') {
      if (recipientId) return 1;
      return parents.length;
    }
    return 0;
  };

  const charCount = message.length;
  const smsFactor = charCount === 0 ? 0 : Math.ceil(charCount / 160);
  const estimatedCost = Number((countRecipients() * getSelectedRate() * smsFactor).toFixed(2));

  return (
    <div className="min-h-screen bg-slate-50/50 p-4 md:p-8 animate-in fade-in duration-500">
      <div className="max-w-[1600px] mx-auto space-y-8">
        
        {/* Header Block */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 bg-white p-8 rounded-[24px] border border-slate-200 shadow-sm">
          <div className="flex items-center gap-4">
            <div className="w-14 h-14 bg-indigo-50 rounded-2xl flex items-center justify-center border border-indigo-100 shadow-inner">
              <Smartphone className="w-7 h-7 text-indigo-600" />
            </div>
            <div>
              <h1 className="text-3xl font-black text-slate-800 tracking-tight uppercase">Message & Notification Center</h1>
              <p className="text-xs font-bold text-slate-400 uppercase tracking-widest mt-0.5">Send custom announcements and manage prepaid balance</p>
            </div>
          </div>
          <div className="flex gap-3">
            <button 
              onClick={() => setActiveTab("recharge")}
              className="flex items-center gap-2 px-6 py-3 bg-indigo-600 text-white font-black rounded-xl shadow-lg shadow-indigo-200 hover:scale-[1.02] active:scale-95 transition-all text-xs uppercase tracking-wider"
            >
              <Plus className="w-4 h-4" />
              Recharge Balance
            </button>
          </div>
        </div>

        {/* Global Feedback alerts */}
        {successMsg && (
          <div className="bg-emerald-50 border border-emerald-100 text-emerald-600 px-6 py-4 rounded-2xl flex items-center gap-3 animate-bounce">
            <CheckCircle2 className="w-5 h-5 text-emerald-500" />
            <span className="text-xs font-black uppercase tracking-wider">{successMsg}</span>
          </div>
        )}
        {errorMsg && (
          <div className="bg-rose-50 border border-rose-100 text-rose-600 px-6 py-4 rounded-2xl flex items-center gap-3">
            <AlertTriangle className="w-5 h-5 text-rose-500" />
            <span className="text-xs font-black uppercase tracking-wider">{errorMsg}</span>
          </div>
        )}

        {/* Quick Stats Banner */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          <div className="bg-white p-6 rounded-[22px] border border-slate-200 shadow-sm flex items-center gap-5 hover:border-indigo-200 transition-colors">
            <div className="w-14 h-14 bg-emerald-50 rounded-2xl flex items-center justify-center">
              <DollarSign className="w-7 h-7 text-emerald-600" />
            </div>
            <div>
              <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Active BDT Wallet Balance</p>
              <p className="text-2xl font-black text-slate-800">৳ {wallet.balance.toFixed(2)}</p>
            </div>
          </div>

          <div className="bg-white p-6 rounded-[22px] border border-slate-200 shadow-sm flex items-center gap-5 hover:border-indigo-200 transition-colors">
            <div className="w-14 h-14 bg-indigo-50 rounded-2xl flex items-center justify-center">
              <MessageSquare className="w-7 h-7 text-indigo-600" />
            </div>
            <div>
              <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Broadcast SMS Rate</p>
              <p className="text-2xl font-black text-slate-800">৳ {wallet.rates.bulk} <span className="text-xs text-slate-400 font-bold uppercase">/ SMS</span></p>
            </div>
          </div>

          <div className="bg-white p-6 rounded-[22px] border border-slate-200 shadow-sm flex items-center gap-5 hover:border-indigo-200 transition-colors">
            <div className="w-14 h-14 bg-amber-50 rounded-2xl flex items-center justify-center">
              <Clock className="w-7 h-7 text-amber-600 animate-pulse" />
            </div>
            <div>
              <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Pending Recharge requests</p>
              <p className="text-2xl font-black text-slate-800">{recharges.filter(r => r.status === "Pending").length} Requests</p>
            </div>
          </div>
        </div>

        {/* Spacious Main Console card */}
        <div className="bg-white rounded-[24px] border border-slate-200 shadow-sm overflow-hidden flex flex-col">
          
          {/* Tab selectors at the top */}
          <div className="flex border-b border-slate-200 bg-slate-50/50">
            <button 
              onClick={() => setActiveTab("send")}
              className={`flex-1 py-6 font-black text-xs tracking-widest uppercase flex items-center justify-center gap-2 transition-all ${
                activeTab === "send"
                  ? "bg-white text-indigo-600 border-b-2 border-indigo-600"
                  : "text-slate-400 hover:text-slate-600"
              }`}
            >
              <Send className="w-4 h-4" />
              Compose Custom Broadcast
            </button>
            
            <button 
              onClick={() => setActiveTab("recharge")}
              className={`flex-1 py-6 font-black text-xs tracking-widest uppercase flex items-center justify-center gap-2 transition-all ${
                activeTab === "recharge"
                  ? "bg-white text-indigo-600 border-b-2 border-indigo-600"
                  : "text-slate-400 hover:text-slate-600"
              }`}
            >
              <CreditCard className="w-4 h-4" />
              Wallet Balance & Recharges
            </button>
          </div>

          {/* TAB 1: COMPOSE BROADCAST */}
          {activeTab === "send" && (
            <form onSubmit={handleSendBroadcast} className="p-8 space-y-8">
              
              {/* Recipient Category selector Cards (Gorgeous interactive layout from old design) */}
              <div className="space-y-4">
                <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest block">
                  Select Recipient Category
                </label>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                  {[
                    { id: "Student", label: "Students", icon: GraduationCap },
                    { id: "Parent", label: "Guardians / Parents", icon: Users },
                    { id: "Teacher", label: "Teachers / Staff", icon: Briefcase },
                    { id: "Class", label: "Class-Wise Broadcast", icon: BookOpen }
                  ].map((cat) => (
                    <button
                      key={cat.id}
                      type="button"
                      onClick={() => {
                        setRecipientType(cat.id);
                        setRecipientId("");
                        setClassId("");
                      }}
                      className={`p-5 rounded-2xl border-2 flex flex-col items-center gap-3 transition-all group ${
                        recipientType === cat.id
                          ? "bg-indigo-50 border-indigo-500 text-indigo-600 shadow-md shadow-indigo-100/50 scale-[1.02]"
                          : "bg-white border-slate-100 text-slate-400 hover:border-indigo-200 hover:text-indigo-600"
                      }`}
                    >
                      <cat.icon 
                        className={`w-7 h-7 ${recipientType === cat.id ? "text-indigo-600" : "text-slate-300 group-hover:text-indigo-500"}`}
                      />
                      <span className="text-xs font-black uppercase tracking-tight">
                        {cat.label}
                      </span>
                    </button>
                  ))}
                </div>
              </div>

              {/* Conditional dropdown depending on Category */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                
                {recipientType === 'Class' ? (
                  <div className="space-y-2">
                    <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest block">
                      Choose Target Class
                    </label>
                    <select 
                      required
                      className="w-full px-5 py-4 bg-slate-50 border border-slate-100 rounded-2xl font-bold text-slate-700 outline-none focus:border-indigo-500 focus:bg-white transition-all text-sm shadow-inner"
                      value={classId}
                      onChange={(e) => setClassId(e.target.value)}
                    >
                      <option value="">-- Click to select class --</option>
                      {classes.map(c => (
                        <option key={c._id} value={c._id}>{c.name}</option>
                      ))}
                    </select>
                  </div>
                ) : (
                  <div className="space-y-2">
                    <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest block">
                      Selective Broadcast (Send to single or broadcast to all)
                    </label>
                    <select 
                      className="w-full px-5 py-4 bg-slate-50 border border-slate-100 rounded-2xl font-bold text-slate-700 outline-none focus:border-indigo-500 focus:bg-white transition-all text-sm shadow-inner"
                      value={recipientId}
                      onChange={(e) => setRecipientId(e.target.value)}
                    >
                      <option value="">Broadcast to All {recipientType}s</option>
                      {recipientType === 'Student' && students.map(s => (
                        <option key={s._id} value={s._id}>{s.firstName} {s.lastName || ''} (Roll: {s.roll_number || 'N/A'})</option>
                      ))}
                      {recipientType === 'Teacher' && teachers.map(t => (
                        <option key={t._id} value={t._id}>{t.name} (Phone: {t.phone})</option>
                      ))}
                      {recipientType === 'Parent' && parents.map(p => (
                        <option key={p._id} value={p._id}>{p.fatherName || p.motherName || 'Parent'} (Phone: {p.contact})</option>
                      ))}
                    </select>
                  </div>
                )}

                {/* SMS Category Selector */}
                <div className="space-y-2">
                  <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest block">
                    Choose SMS Cost Rate Type
                  </label>
                  <select 
                    className="w-full px-5 py-4 bg-slate-50 border border-slate-100 rounded-2xl font-bold text-slate-700 outline-none focus:border-indigo-500 focus:bg-white transition-all text-sm shadow-inner"
                    value={smsType}
                    onChange={(e) => setSmsType(e.target.value)}
                  >
                    <option value="Single">Single SMS (৳ {wallet.rates.single} / message)</option>
                    <option value="Bulk">Bulk SMS (৳ {wallet.rates.bulk} / message)</option>
                    <option value="Masking">Masking / Sender ID Name (৳ {wallet.rates.masking} / message)</option>
                  </select>
                </div>

              </div>

              {/* Message Composer Area */}
              <div className="space-y-3">
                <div className="flex justify-between items-center">
                  <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest block">
                    Announcements Message Body
                  </label>
                  <span className="text-[10px] font-black text-indigo-600 uppercase tracking-widest">
                    {charCount} Characters / {smsFactor} SMS (160 Chars/SMS)
                  </span>
                </div>
                <textarea 
                  required
                  placeholder="Type your message announcement here..."
                  className="w-full bg-slate-50 border border-slate-100 rounded-[2rem] px-8 py-6 text-sm font-bold focus:border-indigo-500 focus:bg-white outline-none transition-all shadow-inner min-h-[160px] resize-none leading-relaxed"
                  value={message}
                  onChange={(e) => setMessage(e.target.value)}
                />
              </div>

              {/* Broadcast Calculation details & trigger */}
              <div className="bg-slate-50 border border-slate-200/80 rounded-[20px] p-6 flex flex-col md:flex-row md:items-center justify-between gap-6">
                <div>
                  <p className="text-[9px] font-bold text-slate-400 uppercase tracking-widest">Estimated cost breakdown</p>
                  <h3 className="text-xl font-extrabold text-slate-800 mt-1">
                    ৳ {estimatedCost.toFixed(2)}{" "}
                    <span className="text-xs text-slate-400 font-bold uppercase tracking-wider">
                      (Total {countRecipients()} recipients * ৳ {getSelectedRate()} * {smsFactor} SMS)
                    </span>
                  </h3>
                </div>
                <button 
                  type="submit"
                  disabled={sendingBroadcast || estimatedCost > wallet.balance || countRecipients() === 0}
                  className="px-10 py-4 bg-indigo-600 hover:bg-indigo-700 text-white font-black rounded-xl shadow-xl shadow-indigo-100 hover:scale-[1.02] active:scale-95 transition-all text-xs uppercase tracking-widest flex items-center gap-2 disabled:opacity-40 disabled:pointer-events-none"
                >
                  <Send className="w-4 h-4" />
                  {sendingBroadcast ? "Sending Broadcast..." : "Send Custom Message"}
                </button>
              </div>

            </form>
          )}

          {/* TAB 2: RECHARGE & WALLET */}
          {activeTab === "recharge" && (
            <div className="p-8 space-y-10 animate-in slide-in-from-right-10 duration-300">
              
              <div className="grid grid-cols-1 xl:grid-cols-3 gap-8">
                
                {/* Bkash payment manual recharge form */}
                <div className="xl:col-span-1 bg-slate-50 border border-slate-150 rounded-[22px] p-6 space-y-6">
                  <div className="flex items-center gap-2 border-b border-slate-200 pb-3">
                    <CreditCard className="w-5 h-5 text-indigo-600" />
                    <h4 className="text-xs font-black text-slate-700 uppercase tracking-wider">Balance Recharge Ticket</h4>
                  </div>

                  {/* Operator Merchant Details */}
                  <div className="bg-indigo-50 border border-indigo-100 text-indigo-700 p-4 rounded-xl space-y-1 text-xs">
                    <p className="font-extrabold">Bkash / Nagad Merchant</p>
                    <p className="font-bold font-mono">Number: +880 1700 000000</p>
                    <p className="text-[10px] text-indigo-600">Minimum payment amount: BDT 100.</p>
                  </div>

                  <form onSubmit={handleRechargeSubmit} className="space-y-4">
                    <div className="space-y-1">
                      <label className="text-[9px] font-black text-slate-400 uppercase tracking-widest">Recharge Amount (৳)</label>
                      <input 
                        type="number"
                        required
                        placeholder="e.g. 150"
                        className="w-full px-4 py-3 bg-white border border-slate-200 rounded-xl font-bold text-slate-700 outline-none focus:ring-2 focus:ring-indigo-100 text-sm shadow-sm"
                        value={rechargeAmount}
                        onChange={(e) => setRechargeAmount(e.target.value)}
                      />
                      {rechargeAmount && Number(rechargeAmount) < 100 && (
                        <p className="text-[9px] text-rose-500 font-bold uppercase tracking-wider mt-1 flex items-center gap-1">
                          <AlertTriangle className="w-3.5 h-3.5" /> Amount must be BDT 100 or more
                        </p>
                      )}
                    </div>

                    <div className="space-y-1">
                      <label className="text-[9px] font-black text-slate-400 uppercase tracking-widest">Sender Phone Number</label>
                      <input 
                        type="text"
                        required
                        placeholder="e.g. 01712XXXXXX"
                        className="w-full px-4 py-3 bg-white border border-slate-200 rounded-xl font-bold text-slate-700 outline-none focus:ring-2 focus:ring-indigo-100 text-sm shadow-sm font-mono"
                        value={senderNumber}
                        onChange={(e) => setSenderNumber(e.target.value)}
                      />
                    </div>

                    <div className="space-y-1">
                      <label className="text-[9px] font-black text-slate-400 uppercase tracking-widest">Transaction ID (TrxID)</label>
                      <input 
                        type="text"
                        required
                        placeholder="e.g. TR_BKA897A"
                        className="w-full px-4 py-3 bg-white border border-slate-200 rounded-xl font-bold text-slate-700 outline-none focus:ring-2 focus:ring-indigo-100 text-sm shadow-sm font-mono uppercase"
                        value={transactionId}
                        onChange={(e) => setTransactionId(e.target.value)}
                      />
                    </div>

                    <button 
                      type="submit"
                      disabled={submittingRecharge || Number(rechargeAmount) < 100}
                      className="w-full py-3.5 bg-indigo-600 hover:bg-indigo-700 text-white font-black rounded-xl shadow-lg shadow-indigo-100 hover:scale-[1.01] active:scale-95 transition-all text-xs uppercase tracking-widest disabled:opacity-40"
                    >
                      {submittingRecharge ? "Submitting Ticket..." : "Submit Recharge details"}
                    </button>
                  </form>
                </div>

                {/* History table */}
                <div className="xl:col-span-2 space-y-4">
                  <div className="flex items-center gap-2 px-2">
                    <History className="w-5 h-5 text-slate-400" />
                    <h4 className="text-xs font-black text-slate-700 uppercase tracking-wider">Recharge approvals history</h4>
                  </div>

                  <div className="bg-white border border-slate-200 rounded-[22px] overflow-hidden shadow-sm">
                    <table className="w-full text-left border-collapse">
                      <thead>
                        <tr className="bg-slate-50 border-b border-slate-200">
                          <th className="px-6 py-4 text-[10px] font-black text-slate-400 uppercase tracking-widest">Date</th>
                          <th className="px-6 py-4 text-[10px] font-black text-slate-400 uppercase tracking-widest">Amount</th>
                          <th className="px-6 py-4 text-[10px] font-black text-slate-400 uppercase tracking-widest">Sender Phone</th>
                          <th className="px-6 py-4 text-[10px] font-black text-slate-400 uppercase tracking-widest">Transaction ID</th>
                          <th className="px-6 py-4 text-[10px] font-black text-slate-400 uppercase tracking-widest text-center">Status</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-slate-100">
                        {recharges.length === 0 ? (
                          <tr>
                            <td colSpan="5" className="px-6 py-8 text-center font-bold text-slate-400 uppercase text-xs">No past recharge history found.</td>
                          </tr>
                        ) : (
                          recharges.map((req) => (
                            <tr key={req._id} className="hover:bg-slate-50/50 transition-colors">
                              <td className="px-6 py-4 text-xs font-bold text-slate-500">
                                {new Date(req.created_at).toLocaleDateString()}
                              </td>
                              <td className="px-6 py-4 font-black text-slate-800">
                                ৳ {req.amount.toFixed(2)}
                              </td>
                              <td className="px-6 py-4 font-mono font-bold text-slate-600 text-xs">
                                {req.senderNumber}
                              </td>
                              <td className="px-6 py-4">
                                <span className="bg-slate-50 text-slate-600 font-mono font-bold text-xs px-2.5 py-1.5 rounded-lg border border-slate-200">
                                  {req.transactionId}
                                </span>
                              </td>
                              <td className="px-6 py-4 text-center">
                                <span className={`text-[9px] font-black px-2.5 py-1 rounded-full uppercase tracking-wider border ${
                                  req.status === 'Pending' ? 'bg-amber-50 text-amber-500 border-amber-200/50 animate-pulse' :
                                  req.status === 'Approved' ? 'bg-emerald-50 text-emerald-500 border-emerald-200/50' :
                                  'bg-rose-50 text-rose-500 border-rose-200/50'
                                }`}>
                                  {req.status}
                                </span>
                              </td>
                            </tr>
                          ))
                        )}
                      </tbody>
                    </table>
                  </div>
                </div>

              </div>

            </div>
          )}

        </div>

      </div>
    </div>
  );
};

export default SmsPortal;
