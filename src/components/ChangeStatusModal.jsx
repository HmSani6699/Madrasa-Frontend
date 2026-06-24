import { useState, useEffect } from "react";
import Modal from "./Modal";
import { Loader2, Save, ShieldAlert, ShieldCheck } from "lucide-react";
import adminService from "../services/adminService";
import toast from "react-hot-toast";

const ChangeStatusModal = ({ isOpen, onClose, madrasa }) => {
  const [status, setStatus] = useState("Active");
  const [statusMessage, setStatusMessage] = useState("");
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (madrasa && isOpen) {
      setStatus(madrasa.status || "Active");
      setStatusMessage(madrasa.statusMessage || "");
    }
  }, [madrasa, isOpen]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      await adminService.updateMadrasa(madrasa._id, { status, statusMessage });
      setLoading(false);
      toast.success("Status updated successfully!");
      onClose();
    } catch (err) {
      setLoading(false);
      toast.error(err.response?.data?.message || "Failed to update status.");
    }
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose} title="Change Madrasa Status">
      <form onSubmit={handleSubmit} className="space-y-6 px-1">
        
        {/* Status Selection */}
        <div className="space-y-4">
          <div>
            <label className="block text-sm font-semibold text-gray-800 mb-2">
              Administrative Status
            </label>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
              <div 
                onClick={() => setStatus("Active")}
                className={`flex flex-col items-center justify-center p-3 rounded-xl border-2 cursor-pointer transition-all ${
                  status === "Active" 
                    ? "border-emerald-500 bg-emerald-50/50" 
                    : "border-gray-100 hover:border-gray-200 bg-white"
                }`}
              >
                <ShieldCheck className={`w-6 h-6 mb-1 ${status === "Active" ? "text-emerald-500" : "text-gray-400"}`} />
                <span className={`text-xs font-bold ${status === "Active" ? "text-emerald-700" : "text-gray-500"}`}>Active</span>
              </div>
              
              <div 
                onClick={() => setStatus("Suspended")}
                className={`flex flex-col items-center justify-center p-3 rounded-xl border-2 cursor-pointer transition-all ${
                  status === "Suspended" 
                    ? "border-amber-500 bg-amber-50/50" 
                    : "border-gray-100 hover:border-gray-200 bg-white"
                }`}
              >
                <ShieldAlert className={`w-6 h-6 mb-1 ${status === "Suspended" ? "text-amber-500" : "text-gray-400"}`} />
                <span className={`text-xs font-bold ${status === "Suspended" ? "text-amber-700" : "text-gray-500"}`}>Suspended</span>
              </div>
              
              <div 
                onClick={() => setStatus("Blocked")}
                className={`flex flex-col items-center justify-center p-3 rounded-xl border-2 cursor-pointer transition-all ${
                  status === "Blocked" 
                    ? "border-rose-500 bg-rose-50/50" 
                    : "border-gray-100 hover:border-gray-200 bg-white"
                }`}
              >
                <ShieldAlert className={`w-6 h-6 mb-1 ${status === "Blocked" ? "text-rose-500" : "text-gray-400"}`} />
                <span className={`text-xs font-bold ${status === "Blocked" ? "text-rose-700" : "text-gray-500"}`}>Blocked</span>
              </div>
            </div>
          </div>

          {/* Custom Message Field */}
          <div className={`transition-all duration-300 overflow-hidden ${status !== "Active" ? "opacity-100 max-h-96" : "opacity-0 max-h-0"}`}>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Custom Suspension/Block Notice
            </label>
            <textarea
              className="w-full px-4 py-3 rounded-xl border border-gray-200 outline-none focus:border-primary focus:ring-2 focus:ring-primary/20 transition-all text-sm resize-none bg-gray-50/50"
              rows="4"
              placeholder="Write a clear reason why the madrasa is suspended or blocked..."
              value={statusMessage}
              onChange={(e) => setStatusMessage(e.target.value)}
            ></textarea>
            <p className="text-xs text-gray-500 mt-1.5">
              This message will be shown directly on the tenant's login overlay lock screen.
            </p>
          </div>
        </div>

        {/* Footer Actions */}
        <div className="pt-4 flex gap-3 border-t border-gray-100">
          <button
            type="button"
            onClick={onClose}
            className="flex-1 px-4 py-2.5 rounded-xl border border-gray-200 text-gray-600 hover:bg-gray-50 font-medium transition-colors cursor-pointer"
          >
            Cancel
          </button>
          <button
            type="submit"
            disabled={loading}
            className={`flex-1 text-white rounded-xl font-medium shadow-lg flex items-center justify-center gap-2 transition-all active:scale-95 disabled:opacity-70 disabled:cursor-not-allowed cursor-pointer ${
              status === "Active" ? "bg-emerald-600 hover:bg-emerald-700 shadow-emerald-500/25" :
              status === "Suspended" ? "bg-amber-500 hover:bg-amber-600 shadow-amber-500/25" :
              "bg-rose-600 hover:bg-rose-700 shadow-rose-500/25"
            }`}
          >
            {loading ? (
              <Loader2 className="w-5 h-5 animate-spin" />
            ) : (
              <>
                <Save className="w-4 h-4" /> Save Status
              </>
            )}
          </button>
        </div>
      </form>
    </Modal>
  );
};

export default ChangeStatusModal;
