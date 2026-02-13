import { useState } from "react";
import { 
  FileText, 
  Send, 
  Calendar, 
  Clock, 
  AlertCircle, 
  CheckCircle2, 
  XCircle,
  Clock3
} from "lucide-react";

const LeaveApplication = () => {
  const [formData, setFormData] = useState({
    fromDate: "",
    toDate: "",
    reason: "",
  });

  const [applications, setApplications] = useState([
    {
      id: 1,
      fromDate: "2026-03-05",
      toDate: "2026-03-07",
      reason: "Family funeral in village",
      status: "Approved",
      appliedOn: "2026-03-01",
    },
    {
      id: 2,
      fromDate: "2026-03-15",
      toDate: "2026-03-16",
      reason: "Medical appointment",
      status: "Pending",
      appliedOn: "2026-03-12",
    },
  ]);

  const handleSubmit = (e) => {
    e.preventDefault();
    console.log("Leave Application Submitted:", formData);
    // Mocking submission
    const newApp = {
        id: applications.length + 1,
        ...formData,
        status: "Pending",
        appliedOn: new Date().toISOString().split('T')[0]
    };
    setApplications([newApp, ...applications]);
    setFormData({ fromDate: "", toDate: "", reason: "" });
  };

  return (
    <div className="space-y-8 pb-12 animate-in fade-in duration-700">
      {/* Header */}
      <div className="bg-white rounded-[2.5rem] p-8 md:p-12 border-2 border-slate-50 shadow-sm flex flex-col md:flex-row justify-between items-center gap-8 relative overflow-hidden">
        <div className="absolute -right-10 -top-10 w-40 h-40 bg-emerald-50 rounded-full blur-3xl opacity-50"></div>
        <div className="flex items-center gap-6 relative z-10">
          <div className="w-16 h-16 md:w-20 md:h-20 bg-emerald-50 rounded-2xl md:rounded-3xl flex items-center justify-center border-2 border-emerald-100 shadow-inner text-[#00bd7f]">
            <FileText className="w-8 h-8 md:w-10 md:h-10" />
          </div>
          <div>
            <h1 className="text-2xl md:text-4xl font-black text-slate-800 tracking-tight uppercase leading-none mb-2 md:mb-3">Leave Application</h1>
            <p className="text-slate-500 font-bold text-xs md:text-base">Submit and track student leave requests</p>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-5 gap-8">
        {/* Application Form */}
        <div className="lg:col-span-2">
          <div className="bg-white rounded-[2.5rem] p-8 md:p-10 border-2 border-slate-50 shadow-xl shadow-slate-200/50">
            <h3 className="text-xl font-black text-slate-800 uppercase tracking-tight mb-8 flex items-center gap-3">
              <Send className="w-5 h-5 text-[#00bd7f]" />
              New Application
            </h3>
            <form onSubmit={handleSubmit} className="space-y-6">
              <div className="grid grid-cols-1 gap-6">
                <div className="space-y-2">
                  <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">From Date</label>
                  <div className="relative">
                    <Calendar className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                    <input
                      type="date"
                      required
                      value={formData.fromDate}
                      onChange={(e) => setFormData({ ...formData, fromDate: e.target.value })}
                      className="w-full pl-12 pr-4 py-4 bg-slate-50 border-2 border-slate-100 rounded-2xl text-sm font-bold text-slate-700 focus:outline-none focus:border-[#00bd7f] transition-all"
                    />
                  </div>
                </div>
                <div className="space-y-2">
                  <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">To Date</label>
                  <div className="relative">
                    <Calendar className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                    <input
                      type="date"
                      required
                      value={formData.toDate}
                      onChange={(e) => setFormData({ ...formData, toDate: e.target.value })}
                      className="w-full pl-12 pr-4 py-4 bg-slate-50 border-2 border-slate-100 rounded-2xl text-sm font-bold text-slate-700 focus:outline-none focus:border-[#00bd7f] transition-all"
                    />
                  </div>
                </div>
                <div className="space-y-2">
                  <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">Reason for Leave</label>
                  <textarea
                    required
                    placeholder="Briefly state the reason..."
                    value={formData.reason}
                    onChange={(e) => setFormData({ ...formData, reason: e.target.value })}
                    rows="4"
                    className="w-full px-6 py-4 bg-slate-50 border-2 border-slate-100 rounded-2xl text-sm font-bold text-slate-700 focus:outline-none focus:border-[#00bd7f] transition-all resize-none"
                  ></textarea>
                </div>
              </div>
              <button
                type="submit"
                className="w-full py-5 bg-[#00bd7f] text-white rounded-3xl font-black text-xs uppercase tracking-widest hover:bg-[#00a570] transition-all shadow-xl shadow-emerald-200 active:scale-95 flex items-center justify-center gap-3"
              >
                Submit Application
              </button>
            </form>
          </div>
        </div>

        {/* Status Tracker */}
        <div className="lg:col-span-3">
          <div className="bg-white rounded-[2.5rem] p-8 md:p-10 border-2 border-slate-50 shadow-sm min-h-full">
            <h3 className="text-xl font-black text-slate-800 uppercase tracking-tight mb-8 flex items-center gap-3">
              <Clock3 className="w-5 h-5 text-slate-400" />
              Application History
            </h3>
            <div className="space-y-6">
              {applications.map((app) => (
                <div 
                  key={app.id} 
                  className="p-6 bg-slate-50/50 rounded-3xl border border-slate-100 hover:bg-white hover:shadow-lg transition-all group"
                >
                  <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6">
                    <div className="flex items-center gap-6">
                      <div className={`w-14 h-14 rounded-2xl flex items-center justify-center border shadow-inner transition-transform group-hover:scale-110 ${
                        app.status === "Approved" ? "bg-emerald-50 text-emerald-600 border-emerald-100" :
                        app.status === "Rejected" ? "bg-rose-50 text-rose-600 border-rose-100" :
                        "bg-amber-50 text-amber-600 border-amber-100"
                      }`}>
                        {app.status === "Approved" ? <CheckCircle2 className="w-7 h-7" /> :
                         app.status === "Rejected" ? <XCircle className="w-7 h-7" /> :
                         <Clock className="w-7 h-7" />}
                      </div>
                      <div>
                        <h4 className="text-base font-black text-slate-800 uppercase tracking-tight mb-1">
                          {app.fromDate} to {app.toDate}
                        </h4>
                        <p className="text-xs font-bold text-slate-500 line-clamp-1">{app.reason}</p>
                        <p className="text-[9px] font-black text-slate-400 uppercase tracking-widest mt-2 flex items-center gap-2">
                           Applied on {app.appliedOn}
                        </p>
                      </div>
                    </div>
                    <div className="flex flex-col items-end gap-2 w-full md:w-auto">
                      <span className={`px-4 py-1.5 rounded-xl text-[10px] font-black uppercase tracking-widest border ${
                        app.status === "Approved" ? "bg-emerald-100 text-emerald-700 border-emerald-200" :
                        app.status === "Rejected" ? "bg-rose-100 text-rose-700 border-rose-200" :
                        "bg-amber-100 text-amber-700 border-amber-200"
                      }`}>
                        {app.status}
                      </span>
                      {app.status === "Pending" && (
                         <p className="text-[9px] font-bold text-amber-600 uppercase italic">Awaiting Review</p>
                      )}
                    </div>
                  </div>
                </div>
              ))}

              {applications.length === 0 && (
                <div className="py-20 text-center">
                  <AlertCircle className="w-12 h-12 text-slate-200 mx-auto mb-4" />
                  <p className="text-slate-400 font-bold uppercase text-xs">No applications found</p>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>

     
    </div>
  );
};

// Internal icon for emergency
const Phone = ({ className }) => (
  <svg className={className} xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72 12.84 12.84 0 0 0 .7 2.81 2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45 12.84 12.84 0 0 0 2.81.7A2 2 0 0 1 22 16.92z"></path></svg>
);

export default LeaveApplication;
