import { useState, useEffect } from "react";
import { Search, Loader2, Wallet, DollarSign, Calendar, Clock, CheckCircle2, AlertTriangle, HelpCircle, ArrowRightLeft, ShieldAlert, Award, FileSpreadsheet, MoreHorizontal } from "lucide-react";
import adminService from "../../services/adminService";
import toast from "react-hot-toast";

const BillingList = () => {
  const [madrasas, setMadrasas] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");

  // Modals state
  const [selectedMadrasa, setSelectedMadrasa] = useState(null);
  const [isRecordOpen, setIsRecordOpen] = useState(false);
  const [isGraceOpen, setIsGraceOpen] = useState(false);
  const [isToggleOpen, setIsToggleOpen] = useState(false);

  // Form selections
  const [graceDays, setGraceDays] = useState(15);
  const [recordCycle, setRecordCycle] = useState("monthly"); // monthly or yearly

  // Dropdown state
  const [openDropdownId, setOpenDropdownId] = useState(null);

  useEffect(() => {
    fetchMadrasas();

    // Close dropdown on outside click
    const handleClickOutside = () => setOpenDropdownId(null);
    document.addEventListener("click", handleClickOutside);
    return () => document.removeEventListener("click", handleClickOutside);
  }, []);

  const fetchMadrasas = async () => {
    try {
      setLoading(true);
      const res = await adminService.getMadrasas();
      setMadrasas(res.data || []);
    } catch (err) {
      console.error("Failed to fetch madrasas for billing list", err);
      toast.error("Failed to load SaaS billing profiles.");
    } finally {
      setLoading(false);
    }
  };

  // Helper to calculate days remaining or overdue
  const calculateBillingInfo = (madrasa) => {
    const sub = madrasa.subscription || {};
    const nextDate = sub.nextBillingDate ? new Date(sub.nextBillingDate) : null;
    const status = madrasa.status || "Active";

    if (!nextDate) return { daysRemaining: null, category: "no-cycle" };

    const today = new Date();
    // Normalize to midnight for clean integer diffs
    nextDate.setHours(0, 0, 0, 0);
    today.setHours(0, 0, 0, 0);

    const diffTime = nextDate - today;
    const daysRemaining = Math.ceil(diffTime / (1000 * 60 * 60 * 24));

    if (status.toLowerCase() === 'suspended' || status.toLowerCase() === 'blocked') {
      return { daysRemaining, category: "suspended" };
    }

    if (daysRemaining < 0) {
      return { daysRemaining, category: "overdue" };
    } else if (daysRemaining <= 5) {
      return { daysRemaining, category: "due-soon" };
    } else {
      return { daysRemaining, category: "active" };
    }
  };

  const filteredMadrasas = madrasas.filter(item =>
    item.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    item.admin?.toLowerCase().includes(searchTerm.toLowerCase())
  );

  // Record Payment Submit Handler
  const handleRecordPayment = async () => {
    if (!selectedMadrasa) return;
    try {
      const sub = selectedMadrasa.subscription || {};
      const currentNextDate = sub.nextBillingDate ? new Date(sub.nextBillingDate) : new Date();

      // If currentNextDate is in the past, add from today. Otherwise, extend from current due date.
      const baseDate = currentNextDate > new Date() ? currentNextDate : new Date();

      const extensionDays = recordCycle === 'yearly' ? 365 : 30;
      const newNextBillingDate = new Date(baseDate.getTime() + extensionDays * 24 * 60 * 60 * 1000).toISOString().split('T')[0];

      // Determine renewal price
      const planName = sub.plan || "basic";
      let renewalPrice = sub.price || 999;
      if (planName === 'basic') renewalPrice = recordCycle === 'monthly' ? 999 : 9990;
      else if (planName === 'standard') renewalPrice = recordCycle === 'monthly' ? 1499 : 14990;
      else if (planName === 'premium') renewalPrice = recordCycle === 'monthly' ? 1999 : 19990;

      const payload = {
        plan: planName,
        billingCycle: recordCycle,
        price: renewalPrice,
        status: "Active", // Resets to active
        nextBillingDate: newNextBillingDate
      };

      await adminService.updateMadrasa(selectedMadrasa._id, payload);
      toast.success(`Payment recorded! Subscription extended to ${newNextBillingDate}`);
      setIsRecordOpen(false);
      fetchMadrasas();
    } catch (err) {
      toast.error(err.response?.data?.message || "Failed to record payment.");
    }
  };

  // Grant Grace Period Submit Handler
  const handleGracePeriod = async () => {
    if (!selectedMadrasa) return;
    try {
      const today = new Date();
      const currentNextDate = selectedMadrasa.subscription?.nextBillingDate
        ? new Date(selectedMadrasa.subscription.nextBillingDate)
        : new Date();

      // Extend from today or current date, whichever is greater
      const baseDate = currentNextDate > today ? currentNextDate : today;
      const newNextBillingDate = new Date(baseDate.getTime() + graceDays * 24 * 60 * 60 * 1000).toISOString().split('T')[0];

      const payload = {
        status: "Active", // Re-activate if suspended
        nextBillingDate: newNextBillingDate
      };

      await adminService.updateMadrasa(selectedMadrasa._id, payload);
      toast.success(`Grace Period Granted! Extension set to ${newNextBillingDate}`);
      setIsGraceOpen(false);
      fetchMadrasas();
    } catch (err) {
      toast.error(err.response?.data?.message || "Failed to grant grace period.");
    }
  };

  // Toggle administrative suspension
  const handleToggleStatus = async () => {
    if (!selectedMadrasa) return;
    try {
      const newStatus = selectedMadrasa.status === 'Active' ? 'Suspended' : 'Active';
      const payload = {
        status: newStatus
      };

      await adminService.updateMadrasa(selectedMadrasa._id, payload);
      toast.success(`Access status toggled to: ${newStatus}`);
      setIsToggleOpen(false);
      fetchMadrasas();
    } catch (err) {
      toast.error(err.response?.data?.message || "Failed to update access status.");
    }
  };

  // Stat summary calculators
  const stats = {
    total: madrasas.length,
    active: 0,
    dueSoon: 0,
    overdue: 0,
    suspended: 0
  };

  madrasas.forEach(item => {
    const info = calculateBillingInfo(item);
    if (info.category === 'active') stats.active++;
    else if (info.category === 'due-soon') stats.dueSoon++;
    else if (info.category === 'overdue') stats.overdue++;
    else if (info.category === 'suspended') stats.suspended++;
  });

  return (
    <div className="space-y-6 animate-fade-in">
      {/* Header Panel */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-gray-900 flex items-center gap-2">
            <Wallet className="w-6 h-6 text-primary" />  Billing & Payments
          </h1>
        </div>

        <div className="relative">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
          <input
            type="text"
            placeholder="Search madrasa name or admin..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="pl-9 pr-4 py-2.5 rounded-xl border border-gray-200 bg-white outline-none focus:border-primary focus:ring-2 focus:ring-primary/20 w-full sm:w-80 shadow-sm"
          />
        </div>
      </div>

      {/* KPI Counters Banner */}
      <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
        <div className="bg-white  p-4 rounded-2xl shadow-lg text-center">
          <p className="text-xs text-gray-400 font-bold uppercase tracking-wider">Total Accounts</p>
          <p className="text-2xl font-extrabold text-gray-900 mt-1">{stats.total}</p>
        </div>
        <div className=" shadow-lg bg-emerald-50 border border-emerald-100 p-4 rounded-2xl text-center">
          <p className="text-xs text-emerald-600 font-bold uppercase tracking-wider">Paid & Active</p>
          <p className="text-2xl font-extrabold text-emerald-700 mt-1">{stats.active}</p>
        </div>
        <div className=" shadow-lg bg-amber-50 border border-amber-100 p-4 rounded-2xl text-center">
          <p className="text-xs text-amber-600 font-bold uppercase tracking-wider">Due in 5 Days</p>
          <p className="text-2xl font-extrabold text-amber-700 mt-1">{stats.dueSoon}</p>
        </div>
        <div className=" shadow-lg bg-rose-50 border border-rose-100 p-4 rounded-2xl text-center">
          <p className="text-xs text-rose-600 font-bold uppercase tracking-wider">Overdue Bills</p>
          <p className="text-2xl font-extrabold text-rose-700 mt-1">{stats.overdue}</p>
        </div>
        <div className=" shadow-lg bg-gray-100 border border-gray-200 p-4 rounded-2xl text-center col-span-2 md:col-span-1">
          <p className="text-xs text-gray-500 font-bold uppercase tracking-wider">Suspended Access</p>
          <p className="text-2xl font-extrabold text-gray-700 mt-1">{stats.suspended}</p>
        </div>
      </div>

      {/* Table Main Wrapper */}
      <div className="bg-white  rounded-[10px] shadow-sm overflow-hidden">
        {loading ? (
          <div className="flex flex-col items-center justify-center p-20 space-y-4">
            <Loader2 className="w-10 h-10 text-primary animate-spin" />
            <p className="text-gray-500 text-sm">Loading billing structures...</p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse overflow-x-auto white-space-nowrap">
              <thead>
                <tr className="bg-gray-50 border-b border-gray-150  font-bold text-gray-500 white-space-nowrap tracking-wider">
                  <th className="py-3 px-10 whitespace-nowrap text-[14px]">Madrasa & Contact</th>
                  <th className="py-3 px-10 whitespace-nowrap text-[14px]">Plan Profile</th>
                  <th className="py-3 px-10 whitespace-nowrap text-[14px]">Due Date</th>
                  <th className="py-3 px-10 whitespace-nowrap text-[14px]">Status </th>
                  <th className="py-3 px-10 whitespace-nowrap text-[14px] text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100 text-sm">
                {filteredMadrasas.map((item) => {
                  const billingInfo = calculateBillingInfo(item);
                  const sub = item.subscription || {};

                  return (
                    <tr key={item._id} className="hover:bg-gray-50/50 transition-colors">
                      {/* Madrasa Details */}
                      <td className="py-4 px-6">
                        <div>
                          <p className="font-bold text-gray-900">{item.name}</p>
                          <p className="text-xs text-gray-400 mt-0.5">{item.admin} | {item.phone}</p>
                        </div>
                      </td>

                      {/* Plan Profile */}
                      <td className="py-4 px-6">
                        <div>
                          <span className="inline-block bg-primary/10 text-primary text-xs font-bold px-2 py-0.5 rounded uppercase">
                            {sub.plan || "Basic"}
                          </span>
                          <p className="text-xs text-gray-500 mt-1">
                            ৳{sub.price || 999} / <span className="capitalize">{sub.billingCycle || "monthly"}</span>
                          </p>
                        </div>
                      </td>

                      {/* Due Date */}
                      <td className="py-4 px-6">
                        {sub.nextBillingDate ? (
                          <div>
                            <p className="font-medium text-gray-800">
                              {new Date(sub.nextBillingDate).toLocaleDateString()}
                            </p>

                            {/* Days remaining badge calculations */}
                            {billingInfo.category === 'overdue' && (
                              <p className="text-xs text-rose-600 font-semibold flex items-center gap-1 mt-0.5">
                                <Clock className="w-3 h-3" /> Overdue by {Math.abs(billingInfo.daysRemaining)} days
                              </p>
                            )}
                            {billingInfo.category === 'due-soon' && (
                              <p className="text-xs text-amber-600 font-semibold flex items-center gap-1 mt-0.5">
                                <Clock className="w-3 h-3 animate-pulse" /> Expiring in {billingInfo.daysRemaining} days
                              </p>
                            )}
                            {billingInfo.category === 'active' && (
                              <p className="text-xs text-emerald-600 font-semibold flex items-center gap-1 mt-0.5">
                                <Clock className="w-3 h-3" /> {billingInfo.daysRemaining} days remaining
                              </p>
                            )}
                          </div>
                        ) : (
                          <span className="text-gray-400 text-xs italic">No active cycle</span>
                        )}
                      </td>

                      {/* Status Indicator */}
                      <td className="py-4 px-6">
                        {billingInfo.category === 'active' && (
                          <span className="bg-emerald-100 text-emerald-800 text-[11px] font-bold px-2.5 py-1 rounded-full flex items-center gap-1 w-fit">
                            <CheckCircle2 className="w-3.5 h-3.5" /> Paid & Active
                          </span>
                        )}
                        {billingInfo.category === 'due-soon' && (
                          <span className="bg-amber-100 text-amber-800 text-[11px] font-bold px-2.5 py-1 rounded-full flex items-center gap-1 w-fit animate-pulse">
                            <AlertTriangle className="w-3.5 h-3.5" /> Payment Due
                          </span>
                        )}
                        {billingInfo.category === 'overdue' && (
                          <span className="bg-red-100 text-red-800 text-[11px] font-bold px-2.5 py-1 rounded-full flex items-center gap-1 w-fit">
                            <AlertTriangle className="w-3.5 h-3.5" /> Overdue Block
                          </span>
                        )}
                        {billingInfo.category === 'suspended' && (
                          <span className="bg-gray-150 text-gray-700 text-[11px] font-bold px-2.5 py-1 rounded-full flex items-center gap-1 w-fit">
                            <ShieldAlert className="w-3.5 h-3.5" /> Suspended
                          </span>
                        )}
                      </td>

                      {/* Action Triggers — Three-dot dropdown */}
                      <td className="py-4 px-6 text-right relative">
                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            setOpenDropdownId(openDropdownId === item._id ? null : item._id);
                          }}
                          className="p-2 text-gray-400 hover:text-gray-600 hover:bg-gray-100 rounded-lg transition-colors cursor-pointer"
                          title="More Options"
                        >
                          <MoreHorizontal className="w-5 h-5" />
                        </button>

                        {openDropdownId === item._id && (
                          <div className="absolute right-8 top-12 w-52 bg-white rounded-xl shadow-xl border border-gray-100 z-50 py-2 animate-in fade-in zoom-in-95 text-left">
                            <button
                              onClick={(e) => { e.stopPropagation(); setSelectedMadrasa(item); setRecordCycle(sub.billingCycle || "monthly"); setIsRecordOpen(true); setOpenDropdownId(null); }}
                              className="w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-50 hover:text-primary flex items-center gap-2 cursor-pointer"
                            >
                              <DollarSign className="w-4 h-4" /> Record Payment
                            </button>
                            <button
                              onClick={(e) => { e.stopPropagation(); setSelectedMadrasa(item); setGraceDays(15); setIsGraceOpen(true); setOpenDropdownId(null); }}
                              className="w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-50 hover:text-indigo-600 flex items-center gap-2 cursor-pointer"
                            >
                              <Clock className="w-4 h-4" /> Grace Period
                            </button>
                            <div className="border-t border-gray-100 my-1"></div>
                            <button
                              onClick={(e) => { e.stopPropagation(); setSelectedMadrasa(item); setIsToggleOpen(true); setOpenDropdownId(null); }}
                              className={`w-full text-left px-4 py-2 text-sm flex items-center gap-2 cursor-pointer ${item.status === 'Active'
                                  ? 'text-rose-600 hover:bg-rose-50'
                                  : 'text-emerald-600 hover:bg-emerald-50'
                                }`}
                            >
                              <ShieldAlert className="w-4 h-4" />
                              {item.status === 'Active' ? 'Suspend Access' : 'Reactivate Access'}
                            </button>
                          </div>
                        )}
                      </td>
                    </tr>
                  );
                })}

                {filteredMadrasas.length === 0 && (
                  <tr>
                    <td colSpan={5} className="py-10 text-center text-gray-500">
                      No matching Madrasas found.
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* ================= RECORD PAYMENT MODAL ================= */}
      {isRecordOpen && selectedMadrasa && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm animate-fade-in">
          <div className="bg-white rounded-2xl shadow-xl border border-gray-100 max-w-md w-full p-6 space-y-4 animate-scale-up">
            <div className="flex items-center gap-2 pb-2 border-b border-gray-100">
              <DollarSign className="w-5 h-5 text-primary" />
              <h2 className="text-xl font-bold text-gray-900">Record Subscription Payment</h2>
            </div>

            <p className="text-gray-500 text-sm">
              Confirm payment receipt for <span className="font-semibold text-gray-800">"{selectedMadrasa.name}"</span>.
              This will extend their SaaS subscription and immediately ensure active portal permissions.
            </p>

            <div className="bg-gray-50 p-4 rounded-xl space-y-3 border border-gray-100">
              <div className="flex justify-between text-xs text-gray-400 font-bold uppercase">
                <span>Current Plan</span>
                <span>Renewal Cycle</span>
              </div>
              <div className="flex justify-between font-bold text-gray-900">
                <span className="uppercase text-primary">{selectedMadrasa.subscription?.plan || "Basic"}</span>
                <select
                  className="bg-white border border-gray-200 rounded px-2 py-0.5 outline-none font-medium cursor-pointer text-xs"
                  value={recordCycle}
                  onChange={(e) => setRecordCycle(e.target.value)}
                >
                  <option value="monthly">Monthly Extension</option>
                  <option value="yearly">Yearly Extension</option>
                </select>
              </div>
            </div>

            <div className="flex gap-3 pt-2">
              <button
                onClick={() => setIsRecordOpen(false)}
                className="flex-1 py-2 rounded-xl border border-gray-200 text-gray-600 hover:bg-gray-50 font-medium transition-colors cursor-pointer"
              >
                Cancel
              </button>
              <button
                onClick={handleRecordPayment}
                className="flex-1 bg-primary hover:bg-primary-dark text-white rounded-xl font-medium shadow-lg shadow-primary/25 transition-all active:scale-95 cursor-pointer"
              >
                Record & Renew
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ================= GRACE PERIOD MODAL ================= */}
      {isGraceOpen && selectedMadrasa && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm animate-fade-in">
          <div className="bg-white rounded-2xl shadow-xl border border-gray-100 max-w-sm w-full p-6 space-y-4 animate-scale-up">
            <div className="flex items-center gap-2 pb-2 border-b border-gray-100">
              <Clock className="w-5 h-5 text-indigo-500" />
              <h2 className="text-xl font-bold text-gray-900">Grant Grace Period</h2>
            </div>

            <p className="text-gray-500 text-sm">
              Extend access for <span className="font-semibold text-gray-800">"{selectedMadrasa.name}"</span> temporarily without charging immediately.
            </p>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Select Extension Duration</label>
              <select
                className="w-full px-4 py-2 rounded-xl border border-gray-200 outline-none focus:border-primary focus:ring-2 focus:ring-primary/20 bg-white cursor-pointer"
                value={graceDays}
                onChange={(e) => setGraceDays(Number(e.target.value))}
              >
                <option value={7}>7 Days Extension</option>
                <option value={15}>15 Days Extension</option>
                <option value={30}>30 Days Extension</option>
              </select>
            </div>

            <div className="flex gap-3 pt-2">
              <button
                onClick={() => setIsGraceOpen(false)}
                className="flex-1 py-2 rounded-xl border border-gray-200 text-gray-600 hover:bg-gray-50 font-medium transition-colors cursor-pointer"
              >
                Cancel
              </button>
              <button
                onClick={handleGracePeriod}
                className="flex-1 bg-indigo-500 hover:bg-indigo-600 text-white rounded-xl font-medium shadow-lg shadow-indigo-500/20 transition-all active:scale-95 cursor-pointer"
              >
                Grant Extension
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ================= SUSPEND / ACTIVATE MODAL ================= */}
      {isToggleOpen && selectedMadrasa && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm animate-fade-in">
          <div className="bg-white rounded-2xl shadow-xl border border-gray-100 max-w-sm w-full p-6 space-y-4 text-center animate-scale-up">
            <div className="w-12 h-12 bg-red-50 text-red-500 rounded-full flex items-center justify-center mx-auto border border-red-100">
              <ShieldAlert className="w-6 h-6" />
            </div>

            <div>
              <h3 className="text-lg font-bold text-gray-900">
                {selectedMadrasa.status === 'Active' ? 'Suspend Portal Access' : 'Re-activate Portal Access'}
              </h3>
              <p className="text-gray-500 text-sm mt-1">
                Are you sure you want to {selectedMadrasa.status === 'Active' ? 'suspend' : 're-activate'} portal access for <span className="font-semibold text-gray-800">"{selectedMadrasa.name}"</span>?
              </p>
            </div>

            <div className="flex gap-3">
              <button
                onClick={() => setIsToggleOpen(false)}
                className="flex-1 py-2 rounded-xl border border-gray-200 text-gray-600 hover:bg-gray-50 font-medium transition-colors cursor-pointer"
              >
                Cancel
              </button>
              <button
                onClick={handleToggleStatus}
                className={`flex-1 text-white rounded-xl font-medium shadow-lg transition-all active:scale-95 cursor-pointer ${selectedMadrasa.status === 'Active'
                  ? 'bg-red-500 hover:bg-red-600 shadow-red-500/20'
                  : 'bg-emerald-500 hover:bg-emerald-600 shadow-emerald-500/20'
                  }`}
              >
                Yes, Confirm
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default BillingList;
