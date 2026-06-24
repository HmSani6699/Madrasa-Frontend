import React, { useState, useEffect } from "react";
import { 
  MessageSquare, 
  DollarSign, 
  Check, 
  X, 
  Activity, 
  Settings, 
  TrendingUp, 
  Clock, 
  Smartphone, 
  CheckCircle2, 
  AlertCircle 
} from "lucide-react";
import adminService from "../../services/adminService";

const SmsSettings = () => {
  const [rates, setRates] = useState({ singleSmsRate: 0.30, bulkSmsRate: 0.25, maskingSmsRate: 0.40 });
  const [recharges, setRecharges] = useState([]);
  const [loading, setLoading] = useState(false);
  const [updatingRates, setUpdatingRates] = useState(false);
  const [successMsg, setSuccessMsg] = useState("");
  const [errorMsg, setErrorMsg] = useState("");

  const loadData = async () => {
    try {
      setLoading(true);
      const ratesRes = await adminService.getSmsRates();
      const rechargesRes = await adminService.getSmsRecharges();
      
      if (ratesRes.success) setRates(ratesRes.data);
      if (rechargesRes.success) setRecharges(rechargesRes.data);
    } catch (err) {
      console.error("Failed to load SMS settings", err);
      setErrorMsg("Failed to fetch rates or recharges history.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadData();
  }, []);

  const handleUpdateRates = async (e) => {
    e.preventDefault();
    try {
      setUpdatingRates(true);
      setSuccessMsg("");
      setErrorMsg("");
      const res = await adminService.updateSmsRates(rates);
      if (res.success) {
        setSuccessMsg("SMS rates updated successfully!");
        setTimeout(() => setSuccessMsg(""), 3000);
      }
    } catch (err) {
      setErrorMsg("Failed to update SMS rates.");
    } finally {
      setUpdatingRates(false);
    }
  };

  const handleProcessRecharge = async (id, status) => {
    try {
      const res = await adminService.processSmsRecharge(id, status);
      if (res.success) {
        setSuccessMsg(`Recharge request successfully ${status.toLowerCase()}!`);
        loadData();
        setTimeout(() => setSuccessMsg(""), 3000);
      }
    } catch (err) {
      setErrorMsg("Failed to process recharge request.");
    }
  };

  // KPI Calculations
  const pendingRequests = recharges.filter(r => r.status === "Pending");
  const approvedTotal = recharges.filter(r => r.status === "Approved").reduce((sum, r) => sum + r.amount, 0);

  return (
    <div className="p-6 md:p-10 space-y-10 max-w-7xl mx-auto animate-in fade-in duration-500">
      
      {/* Title */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-slate-100 pb-6">
        <div className="flex items-center gap-4">
          <div className="w-14 h-14 bg-primary/10 rounded-2xl flex items-center justify-center border border-primary/20 shadow-inner">
            <MessageSquare className="w-7 h-7 text-primary" />
          </div>
          <div>
            <h1 className="text-3xl font-black text-slate-800 tracking-tight uppercase">SMS Engine Controls</h1>
            <p className="text-xs font-bold text-slate-400 uppercase tracking-widest mt-0.5">Configure SMS pricing rates and verify wallet recharge receipts</p>
          </div>
        </div>
      </div>

      {/* Success and Error Alerts */}
      {successMsg && (
        <div className="bg-emerald-50 border border-emerald-100/50 text-emerald-600 px-6 py-4 rounded-2xl flex items-center gap-3 animate-bounce">
          <CheckCircle2 className="w-5 h-5 text-emerald-500" />
          <span className="text-xs font-black uppercase tracking-wider">{successMsg}</span>
        </div>
      )}
      {errorMsg && (
        <div className="bg-rose-50 border border-rose-100/50 text-rose-600 px-6 py-4 rounded-2xl flex items-center gap-3">
          <AlertCircle className="w-5 h-5 text-rose-500" />
          <span className="text-xs font-black uppercase tracking-wider">{errorMsg}</span>
        </div>
      )}

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-slate-50 border border-slate-150 rounded-3xl p-6 flex items-center justify-between hover:shadow-md transition-shadow">
          <div>
            <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Pending Approvals</p>
            <h3 className="text-3xl font-black text-slate-800 tracking-tight mt-1">{pendingRequests.length} Requests</h3>
          </div>
          <div className="w-12 h-12 bg-amber-500/10 rounded-xl flex items-center justify-center">
            <Clock className="w-6 h-6 text-amber-500 animate-pulse" />
          </div>
        </div>

        <div className="bg-slate-50 border border-slate-150 rounded-3xl p-6 flex items-center justify-between hover:shadow-md transition-shadow">
          <div>
            <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Total Approved Revenue</p>
            <h3 className="text-3xl font-black text-slate-800 tracking-tight mt-1">৳ {approvedTotal.toFixed(2)}</h3>
          </div>
          <div className="w-12 h-12 bg-primary/10 rounded-xl flex items-center justify-center">
            <TrendingUp className="w-6 h-6 text-primary" />
          </div>
        </div>

        <div className="bg-slate-50 border border-slate-150 rounded-3xl p-6 flex items-center justify-between hover:shadow-md transition-shadow">
          <div>
            <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Total Logged Submissions</p>
            <h3 className="text-3xl font-black text-slate-800 tracking-tight mt-1">{recharges.length} Submissions</h3>
          </div>
          <div className="w-12 h-12 bg-indigo-500/10 rounded-xl flex items-center justify-center">
            <Activity className="w-6 h-6 text-indigo-500" />
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 xl:grid-cols-3 gap-10">
        
        {/* Left Column: Config rates */}
        <div className="xl:col-span-1 bg-slate-50 border border-slate-150 rounded-3xl p-8 space-y-6 h-fit">
          <div className="flex items-center gap-3 border-b border-slate-200/60 pb-4">
            <Settings className="w-5 h-5 text-slate-500" />
            <h4 className="text-sm font-black text-slate-700 uppercase tracking-wider">SMS Pricing System</h4>
          </div>

          <form onSubmit={handleUpdateRates} className="space-y-6">
            <div className="space-y-2">
              <label className="text-[9px] font-black text-slate-400 uppercase tracking-widest">Single SMS Rate (৳ / SMS)</label>
              <input 
                type="number"
                step="0.01"
                required
                className="w-full px-4 py-3 bg-white border border-slate-200 rounded-xl font-bold text-slate-700 outline-none focus:ring-2 focus:ring-primary/20 transition-all shadow-sm"
                value={rates.singleSmsRate}
                onChange={(e) => setRates({ ...rates, singleSmsRate: e.target.value })}
              />
            </div>

            <div className="space-y-2">
              <label className="text-[9px] font-black text-slate-400 uppercase tracking-widest">Bulk SMS Rate (৳ / SMS)</label>
              <input 
                type="number"
                step="0.01"
                required
                className="w-full px-4 py-3 bg-white border border-slate-200 rounded-xl font-bold text-slate-700 outline-none focus:ring-2 focus:ring-primary/20 transition-all shadow-sm"
                value={rates.bulkSmsRate}
                onChange={(e) => setRates({ ...rates, bulkSmsRate: e.target.value })}
              />
            </div>

            <div className="space-y-2">
              <label className="text-[9px] font-black text-slate-400 uppercase tracking-widest">Masking / Unique Name SMS Rate (৳ / SMS)</label>
              <input 
                type="number"
                step="0.01"
                required
                className="w-full px-4 py-3 bg-white border border-slate-200 rounded-xl font-bold text-slate-700 outline-none focus:ring-2 focus:ring-primary/20 transition-all shadow-sm"
                value={rates.maskingSmsRate}
                onChange={(e) => setRates({ ...rates, maskingSmsRate: e.target.value })}
              />
            </div>

            <button 
              type="submit"
              disabled={updatingRates}
              className="w-full py-3.5 bg-primary text-white font-black rounded-xl shadow-lg shadow-primary/20 hover:scale-[1.01] active:scale-95 transition-all uppercase tracking-widest text-[10px]"
            >
              {updatingRates ? "Updating Rates..." : "Save Pricing Configuration"}
            </button>
          </form>
        </div>

        {/* Right Column: Verify Bkash/Nagad Recharges */}
        <div className="xl:col-span-2 space-y-6">
          <h3 className="text-sm font-black text-slate-700 uppercase tracking-wider px-2 flex items-center gap-2">
            <Smartphone className="w-4 h-4 text-slate-400" /> Bkash/Nagad Manual Recharge Verification Desk
          </h3>

          <div className="bg-white border border-slate-150 rounded-3xl overflow-hidden shadow-sm">
            <div className="overflow-x-auto">
              <table className="w-full text-left border-collapse">
                <thead>
                  <tr className="bg-slate-50 border-b border-slate-100">
                    <th className="px-6 py-4 text-[10px] font-black text-slate-400 uppercase tracking-widest">Madrasa Name</th>
                    <th className="px-6 py-4 text-[10px] font-black text-slate-400 uppercase tracking-widest">Amount (BDT)</th>
                    <th className="px-6 py-4 text-[10px] font-black text-slate-400 uppercase tracking-widest">Sender Phone</th>
                    <th className="px-6 py-4 text-[10px] font-black text-slate-400 uppercase tracking-widest">Transaction ID</th>
                    <th className="px-6 py-4 text-[10px] font-black text-slate-400 uppercase tracking-widest">Status</th>
                    <th className="px-6 py-4 text-[10px] font-black text-slate-400 uppercase tracking-widest text-center">Verify Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  {loading ? (
                    <tr>
                      <td colSpan="6" className="px-6 py-10 text-center font-bold text-slate-400 uppercase text-xs">Loading SMS Recharge Requests...</td>
                    </tr>
                  ) : recharges.length === 0 ? (
                    <tr>
                      <td colSpan="6" className="px-6 py-10 text-center font-bold text-slate-400 uppercase text-xs">No Recharge Submissions Found.</td>
                    </tr>
                  ) : (
                    recharges.map((req) => (
                      <tr key={req._id} className="hover:bg-slate-50/50 transition-colors">
                        <td className="px-6 py-4">
                          <p className="font-extrabold text-slate-700">{req.madrasaName}</p>
                          <p className="text-[10px] text-slate-400 font-bold">{new Date(req.created_at).toLocaleString()}</p>
                        </td>
                        <td className="px-6 py-4 font-black text-slate-800">
                          ৳ {req.amount.toFixed(2)}
                        </td>
                        <td className="px-6 py-4 font-mono font-bold text-slate-600">
                          {req.senderNumber}
                        </td>
                        <td className="px-6 py-4">
                          <span className="bg-slate-100 text-slate-600 font-mono font-black text-xs px-2.5 py-1.5 rounded-lg border border-slate-200">
                            {req.transactionId}
                          </span>
                        </td>
                        <td className="px-6 py-4">
                          <span className={`text-[9px] font-black px-2.5 py-1 rounded-full uppercase tracking-wider border ${
                            req.status === 'Pending' ? 'bg-amber-50 text-amber-500 border-amber-200/50 animate-pulse' :
                            req.status === 'Approved' ? 'bg-emerald-50 text-emerald-500 border-emerald-200/50' :
                            'bg-rose-50 text-rose-500 border-rose-200/50'
                          }`}>
                            {req.status}
                          </span>
                        </td>
                        <td className="px-6 py-4 text-center">
                          {req.status === 'Pending' ? (
                            <div className="flex items-center justify-center gap-2">
                              <button 
                                onClick={() => handleProcessRecharge(req._id, 'Approved')}
                                className="p-2 bg-emerald-50 hover:bg-emerald-500 text-emerald-500 hover:text-white rounded-xl border border-emerald-100 hover:scale-105 active:scale-95 transition-all shadow-sm"
                                title="Approve & Credit Balance"
                              >
                                <Check className="w-4 h-4" />
                              </button>
                              <button 
                                onClick={() => handleProcessRecharge(req._id, 'Rejected')}
                                className="p-2 bg-rose-50 hover:bg-rose-500 text-rose-500 hover:text-white rounded-xl border border-rose-100 hover:scale-105 active:scale-95 transition-all shadow-sm"
                                title="Reject Request"
                              >
                                <X className="w-4 h-4" />
                              </button>
                            </div>
                          ) : (
                            <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">
                              {req.processed_at ? `Verified on ${new Date(req.processed_at).toLocaleDateString()}` : 'Processed'}
                            </span>
                          )}
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

    </div>
  );
};

export default SmsSettings;
