import { useState, useMemo } from "react";
import { 
  ShieldAlert, 
  Search, 
  RotateCcw, 
  Trash2, 
  CheckCircle,
  X,
  Phone,
  Mail,
  Calendar,
  Contact,
  AlertTriangle,
  Building2,
  Briefcase
} from "lucide-react";

const DeactivatedEmployeeList = () => {
  const [searchTerm, setSearchTerm] = useState("");
  const [employees, setEmployees] = useState([
    { id: "EMP1004", name: "কামাল উদ্দিন", designation: "Security Guard", department: "Maintenance", phone: "01644455566", email: "kamal@mms.com", deactivationDate: "2025-01-05", reason: "Multiple unauthorized absences" },
    { id: "EMP1009", name: "জসিম উদ্দিন", designation: "Assistant Cook", department: "Kitchen", phone: "01788899900", email: "jasim@mms.com", deactivationDate: "2025-01-12", reason: "Administrative suspension" },
  ]);

  const [showRestoreModal, setShowRestoreModal] = useState(null);
  const [showDeleteModal, setShowDeleteModal] = useState(null);
  const [toast, setToast] = useState(null);

  const filtered = useMemo(() => {
    return employees.filter(e => 
      e.name.toLowerCase().includes(searchTerm.toLowerCase()) || 
      e.id.toLowerCase().includes(searchTerm.toLowerCase())
    );
  }, [searchTerm, employees]);

  const handleRestore = () => {
    setEmployees(prev => prev.filter(e => e.id !== showRestoreModal.id));
    setToast(`Access restored for ${showRestoreModal.name}!`);
    setShowRestoreModal(null);
    setTimeout(() => setToast(null), 3000);
  };

  const handleDelete = () => {
    setEmployees(prev => prev.filter(e => e.id !== showDeleteModal.id));
    setToast(`Permanent data erase complete for ${showDeleteModal.name}.`);
    setShowDeleteModal(null);
    setTimeout(() => setToast(null), 3000);
  };

  return (
    <div className="p-3 sm:p-4 md:p-6 lg:p-8 space-y-8 animate-in fade-in duration-500">
      {/* Warning Header */}
      <div className="bg-rose-600 rounded-[2.5rem] p-8 md:p-12 text-white relative overflow-hidden shadow-2xl shadow-rose-200">
         <div className="absolute top-0 right-0 w-96 h-96 bg-white/10 rounded-full -mr-48 -mt-48 blur-3xl" />
         <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-8">
            <div className="flex items-center gap-6">
               <div className="w-20 h-20 bg-white/20 backdrop-blur-md rounded-3xl flex items-center justify-center border border-white/30 shadow-xl">
                  <ShieldAlert className="w-10 h-10 text-white" />
               </div>
               <div>
                  <h1 className="text-3xl md:text-5xl font-black tracking-tight">Login Deactive</h1>
                  <p className="text-rose-100 text-sm font-bold uppercase tracking-[0.2em] mt-2">Staff Suspension & Recovery Center</p>
               </div>
            </div>
            <div className="bg-white/10 backdrop-blur-md border border-white/20 p-6 rounded-[2rem] text-center md:text-left">
               <p className="text-[10px] font-black uppercase tracking-widest text-rose-100 mb-1">Suspended Records</p>
               <p className="text-4xl font-black">{employees.length}</p>
            </div>
         </div>
      </div>

      {/* Filter Section */}
      <div className="bg-white rounded-[2rem] border-2 border-slate-100 p-6 shadow-sm">
         <div className="relative">
            <Search className="absolute left-5 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400" />
            <input 
               type="text" 
               placeholder="Search by ID or Name..." 
               value={searchTerm}
               onChange={(e) => setSearchTerm(e.target.value)}
               className="w-full pl-14 pr-6 py-5 bg-slate-50 border-2 border-transparent focus:border-rose-500 focus:bg-white rounded-3xl outline-none font-bold text-slate-800 transition-all shadow-inner placeholder:text-slate-400"
            />
         </div>
      </div>

      {/* Grid of Suspended Accounts */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
         {filtered.map(emp => (
            <div key={emp.id} className="bg-white rounded-[2.5rem] border-2 border-slate-50 overflow-hidden shadow-sm hover:border-rose-200 transition-all group flex flex-col h-full">
               <div className="p-8 pb-0">
                  <div className="flex items-start justify-between mb-6">
                     <div className="w-16 h-16 rounded-2xl overflow-hidden border-2 border-slate-100 group-hover:scale-110 transition-transform">
                        <img src={`https://api.dicebear.com/7.x/avataaars/svg?seed=${emp.id}`} alt="" />
                     </div>
                     <div className="text-right">
                        <p className="text-[10px] font-black text-rose-500 uppercase tracking-tighter mb-0.5">{emp.id}</p>
                        <p className="text-lg font-black text-slate-800">{emp.name}</p>
                        <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">{emp.designation}</p>
                     </div>
                  </div>
                  
                  <div className="bg-rose-50 rounded-2xl p-5 border-2 border-rose-100/50 mb-6 group-hover:bg-rose-100/30 transition-colors">
                     <div className="flex items-center gap-2 mb-2">
                        <AlertTriangle className="w-3.5 h-3.5 text-rose-600" />
                        <p className="text-[10px] font-black text-rose-600 uppercase tracking-widest">Reason for Suspension</p>
                     </div>
                     <p className="text-xs font-bold text-slate-700 leading-relaxed italic">"{emp.reason}"</p>
                  </div>

                  <div className="space-y-3 mb-8">
                     <div className="flex items-center gap-3 text-slate-500">
                        <Calendar className="w-4 h-4 text-rose-400" />
                        <span className="text-xs font-bold">Suspended on: {emp.deactivationDate}</span>
                     </div>
                     <div className="flex items-center gap-3 text-slate-500">
                        <Building2 className="w-4 h-4 text-rose-400" />
                        <span className="text-xs font-bold">{emp.department} Dept</span>
                     </div>
                  </div>
               </div>

               <div className="mt-auto p-4 bg-slate-50 border-t-2 border-slate-50 flex gap-3">
                  <button 
                     onClick={() => setShowRestoreModal(emp)}
                     className="flex-1 py-4 bg-emerald-500 text-white font-black rounded-2xl shadow-lg shadow-emerald-100 hover:scale-105 active:scale-95 transition-all text-[10px] uppercase tracking-widest flex items-center justify-center gap-2"
                  >
                     <RotateCcw className="w-4 h-4" /> Restore Access
                  </button>
                  <button 
                     onClick={() => setShowDeleteModal(emp)}
                     className="p-4 bg-white border-2 border-slate-100 text-slate-400 hover:text-rose-600 hover:bg-rose-50 rounded-2xl transition-all"
                  >
                     <Trash2 className="w-5 h-5" />
                  </button>
               </div>
            </div>
         ))}
      </div>

      {filtered.length === 0 && (
        <div className="py-20 text-center bg-white rounded-[3rem] border-2 border-dashed border-slate-200">
           <div className="w-20 h-20 bg-slate-50 rounded-full flex items-center justify-center mx-auto mb-6">
              <ShieldAlert className="w-10 h-10 text-slate-300" />
           </div>
           <h3 className="text-xl font-black text-slate-400 uppercase tracking-widest">No Suspended Accounts Found</h3>
        </div>
      )}

      {/* Restore Modal */}
      {showRestoreModal && (
        <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-sm z-[200] flex items-center justify-center p-4" onClick={() => setShowRestoreModal(null)}>
           <div className="bg-white rounded-[3rem] p-10 max-w-sm w-full text-center shadow-2xl animate-in zoom-in duration-300" onClick={e => e.stopPropagation()}>
              <div className="relative mb-8">
                 <div className="w-24 h-24 bg-emerald-50 rounded-full flex items-center justify-center mx-auto shadow-inner relative z-10">
                    <RotateCcw className="w-10 h-10 text-emerald-500 animate-spin-slow" />
                 </div>
                 <div className="absolute top-0 left-1/2 -translate-x-1/2 w-24 h-24 bg-emerald-400/20 rounded-full animate-ping" />
              </div>
              <h2 className="text-2xl font-black text-slate-800 mb-2">Reactivate Portal?</h2>
              <p className="text-sm font-bold text-slate-500 mb-8 leading-relaxed">This will grant <span className="text-emerald-600 font-black">{showRestoreModal.name}</span> full access to their official portal immediately.</p>
              <div className="flex gap-4">
                 <button onClick={() => setShowRestoreModal(null)} className="flex-1 py-4 bg-slate-50 text-slate-600 font-black rounded-2xl hover:bg-slate-100 transition-all uppercase text-[10px] tracking-widest">Dismiss</button>
                 <button onClick={handleRestore} className="flex-1 py-4 bg-emerald-600 text-white font-black rounded-2xl shadow-xl shadow-emerald-200 hover:scale-105 active:scale-95 transition-all uppercase text-[10px] tracking-widest">Confirm Restore</button>
              </div>
           </div>
        </div>
      )}

      {/* Delete Modal */}
      {showDeleteModal && (
        <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-sm z-[200] flex items-center justify-center p-4" onClick={() => setShowDeleteModal(null)}>
           <div className="bg-white rounded-[3rem] p-10 max-w-sm w-full text-center shadow-2xl animate-in zoom-in duration-300" onClick={e => e.stopPropagation()}>
              <div className="w-20 h-20 bg-rose-50 rounded-3xl flex items-center justify-center mx-auto mb-8 shadow-inner">
                 <Trash2 className="w-10 h-10 text-rose-500" />
              </div>
              <h2 className="text-2xl font-black text-slate-800 mb-3 tracking-tight">Purge Data?</h2>
              <p className="text-sm font-bold text-slate-500 mb-8 leading-relaxed italic text-rose-600">"Warning: This will permanently remove all employment history and credentials for {showDeleteModal.name}."</p>
              <div className="flex gap-4">
                 <button onClick={() => setShowDeleteModal(null)} className="flex-1 py-4 bg-slate-50 text-slate-600 font-black rounded-2xl hover:bg-slate-100 transition-all uppercase text-[10px] tracking-widest">Keep Record</button>
                 <button onClick={handleDelete} className="flex-1 py-4 bg-rose-600 text-white font-black rounded-2xl shadow-xl shadow-rose-200 hover:scale-105 active:scale-95 transition-all uppercase text-[10px] tracking-widest">Confirm Erase</button>
              </div>
           </div>
        </div>
      )}

      {/* Toast */}
      {toast && (
        <div className="fixed bottom-10 left-1/2 -translate-x-1/2 z-[300] animate-in slide-in-from-bottom-5 duration-500 px-4">
           <div className="bg-slate-900 border border-slate-700 text-white px-8 py-4 rounded-full shadow-2xl flex items-center gap-4 border-t-emerald-500/50">
              <CheckCircle className="w-5 h-5 text-emerald-400" />
              <p className="text-sm font-black tracking-tight">{toast}</p>
           </div>
        </div>
      )}
    </div>
  );
};

export default DeactivatedEmployeeList;
