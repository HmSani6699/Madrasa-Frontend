import { useState, useMemo } from "react";
import { 
  Contact, 
  Search, 
  RotateCcw, 
  Trash2, 
  UserX, 
  ChevronLeft, 
  ChevronRight,
  ShieldAlert,
  Calendar,
  CheckCircle,
  Briefcase,
  Eye,
  X,
  Phone,
  Mail,
  MapPin,
  Users,
  MessageCircle
} from "lucide-react";

const DeactivatedParentList = () => {
  const [searchTerm, setSearchTerm] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 10;
  
  // Sample Deactivated Parent Data
  const [deactivatedParents, setDeactivatedParents] = useState([
    { id: "PAR2025003", name: "হোসেন আহমেদ", occupation: "Doctor", phone: "01900000003", email: "hossain@example.com", address: "Uttara, Dhaka", deactivationDate: "2025-01-10", reason: "Multiple Login Failures" },
    { id: "PAR2025008", name: "রেজাউল করিম", occupation: "Lawyer", phone: "01200000008", email: "rezaul@example.com", address: "Cumilla", deactivationDate: "2025-01-22", reason: "Administrative Review" },
    { id: "PAR2025013", name: "মাহবুব আলম", occupation: "Journalist", phone: "01940000013", email: "mahbub@example.com", address: "Khulna", deactivationDate: "2025-02-05", reason: "Account Security Compromised" },
  ]);
  
  // States for confirmation modals
  const [showRestoreModal, setShowRestoreModal] = useState(null);
  const [showViewModal, setShowViewModal] = useState(null);
  const [showDeleteModal, setShowDeleteModal] = useState(null);
  const [toast, setToast] = useState(null);

  const handleRestore = () => {
    setDeactivatedParents(prev => prev.filter(p => p.id !== showRestoreModal.id));
    handleActionComplete(`Full portal access restored for ${showRestoreModal.name}!`);
  };

  const handleDelete = () => {
    setDeactivatedParents(prev => prev.filter(p => p.id !== showDeleteModal.id));
    handleActionComplete(`Data record for ${showDeleteModal.name} permanently removed.`);
  };

  const filtered = useMemo(() => {
    return deactivatedParents.filter(p => 
      p.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      p.id.toLowerCase().includes(searchTerm.toLowerCase()) ||
      p.phone.includes(searchTerm)
    );
  }, [searchTerm, deactivatedParents]);

  const totalPages = Math.ceil(filtered.length / itemsPerPage);
  const currentItems = filtered.slice((currentPage - 1) * itemsPerPage, currentPage * itemsPerPage);

  const handleActionComplete = (msg) => {
    setToast(msg);
    setTimeout(() => setToast(null), 3000);
    setShowRestoreModal(null);
    setShowDeleteModal(null);
  };

  return (
    <div className="space-y-8 animate-in fade-in duration-500 p-4 sm:p-6 lg:p-8">
      {/* Header Section */}
      <div className="bg-white rounded-[2.5rem] border-2 border-slate-200 p-8 shadow-sm flex flex-col md:flex-row md:items-center justify-between gap-6 overflow-hidden relative">
         <div className="absolute top-0 right-0 w-64 h-64 bg-rose-50 rounded-full -mr-32 -mt-32 opacity-50 no-print" />
         <div className="relative z-10 text-center md:text-left">
            <div className="flex items-center gap-3 mb-2 justify-center md:justify-start">
              <div className="w-12 h-12 bg-rose-100 rounded-2xl flex items-center justify-center">
                <UserX className="w-6 h-6 text-rose-600" />
              </div>
              <h1 className="text-3xl font-black text-slate-800 tracking-tight">Parent Login Deactive</h1>
            </div>
            <p className="text-slate-500 font-bold">Manage parent accounts with suspended portal access</p>
         </div>
      </div>

      {/* Control Bar */}
      <div className="bg-white rounded-3xl border-2 border-slate-200 p-6 shadow-sm flex flex-col lg:flex-row lg:items-center justify-between gap-4">
        <div className="relative max-w-md w-full mx-auto md:mx-0">
           <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
           <input 
              type="text" 
              placeholder="Search deactivated parents..." 
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-10 pr-4 py-3 bg-slate-50 border-2 border-slate-100 rounded-xl outline-none focus:border-rose-500 transition-all font-bold text-sm"
           />
        </div>
        <div className="flex items-center gap-3 text-xs font-black text-slate-400 uppercase tracking-widest justify-center">
           <ShieldAlert className="w-4 h-4 text-rose-500" />
           {filtered.length} Inactive Guardian Accounts
        </div>
      </div>

      {/* Table Section */}
      <div className="bg-white rounded-[2.5rem] border-2 border-slate-200 shadow-sm overflow-hidden flex flex-col">
         <div className="overflow-x-auto">
            <table className="w-full text-center sm:text-left">
               <thead className="bg-[#fff1f2] border-b-2 border-slate-100 uppercase text-[10px] font-black tracking-widest text-slate-500">
                  <tr>
                     <th className="px-6 py-5">Parent</th>
                     <th className="px-6 py-5">Occupation</th>
                     <th className="px-6 py-5">Deactivation</th>
                     <th className="px-6 py-5">Reason</th>
                     <th className="px-6 py-5 text-right">Actions</th>
                  </tr>
               </thead>
               <tbody className="divide-y-2 divide-slate-50 text-center sm:text-left">
                  {currentItems.map((parent) => (
                    <tr key={parent.id} className="hover:bg-rose-50/30 transition-all group">
                       <td className="px-6 py-5">
                          <div className="flex items-center gap-3 justify-center sm:justify-start">
                             <div className="w-10 h-10 rounded-full bg-slate-100 border-2 border-white shadow-sm overflow-hidden">
                                <img src={`https://api.dicebear.com/7.x/avataaars/svg?seed=${parent.id}`} alt="Avatar" />
                             </div>
                             <div>
                                <p className="text-sm font-black text-slate-800">{parent.name}</p>
                                <p className="text-[10px] font-bold text-rose-600 uppercase tracking-widest">{parent.id}</p>
                             </div>
                          </div>
                       </td>
                       <td className="px-6 py-5">
                          <div className="flex items-center gap-2 text-xs font-bold text-slate-600 justify-center sm:justify-start">
                             <Briefcase className="w-3.5 h-3.5 text-slate-400" />
                             {parent.occupation}
                          </div>
                       </td>
                       <td className="px-6 py-5">
                          <div className="flex items-center gap-2 text-xs font-bold text-slate-600 justify-center sm:justify-start">
                             <Calendar className="w-3.5 h-3.5 text-slate-400" />
                             {parent.deactivationDate}
                          </div>
                       </td>
                       <td className="px-6 py-5">
                          <span className="text-xs font-bold text-slate-500">{parent.reason}</span>
                       </td>
                       <td className="px-6 py-5 text-right">
                          <div className="flex items-center justify-end gap-2">
                             <button 
                                onClick={() => setShowViewModal(parent)}
                                className="p-2 bg-blue-50 text-blue-600 rounded-lg hover:bg-blue-100 transition-all group-hover:scale-110"
                                title="View Parent Details"
                             >
                                <Eye className="w-4 h-4" />
                             </button>
                             <button 
                                onClick={() => setShowRestoreModal(parent)}
                                className="p-2 bg-emerald-50 text-emerald-600 rounded-lg hover:bg-emerald-100 transition-all group-hover:scale-110"
                                title="Restore Parent Hub Access"
                             >
                                <RotateCcw className="w-4 h-4" />
                             </button>
                             <button 
                                onClick={() => setShowDeleteModal(parent)}
                                className="p-2 bg-rose-50 text-rose-600 rounded-lg hover:bg-rose-100 transition-all group-hover:scale-110"
                                title="Permanent File Delete"
                             >
                                <Trash2 className="w-4 h-4" />
                             </button>
                          </div>
                       </td>
                    </tr>
                  ))}
               </tbody>
            </table>
         </div>

         {/* Pagination */}
         <div className="p-6 bg-slate-50 flex items-center justify-between border-t-2 border-slate-100">
            <p className="text-[10px] font-black text-slate-400 tracking-widest uppercase">Page {currentPage} of {totalPages || 1}</p>
            <div className="flex gap-2">
               <button 
                  disabled={currentPage === 1}
                  onClick={() => setCurrentPage(p => p - 1)}
                  className="p-2 bg-white rounded-xl border-2 border-slate-200 text-slate-400 hover:text-rose-500 transition-all disabled:opacity-50"
               >
                  <ChevronLeft className="w-5 h-5" />
               </button>
               <button 
                   disabled={currentPage === totalPages || totalPages === 0}
                   onClick={() => setCurrentPage(p => p + 1)}
                   className="p-2 bg-white rounded-xl border-2 border-slate-200 text-slate-400 hover:text-rose-500 transition-all disabled:opacity-50"
               >
                  <ChevronRight className="w-5 h-5" />
               </button>
            </div>
         </div>
      </div>

      {/* Confirmation Modals */}
      {showRestoreModal && (
        <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-sm z-[200] flex items-center justify-center p-4" onClick={() => setShowRestoreModal(null)}>
           <div className="bg-white rounded-[2rem] p-8 max-w-sm w-full text-center shadow-2xl animate-in zoom-in duration-300" onClick={e => e.stopPropagation()}>
              <div className="w-16 h-16 bg-emerald-50 rounded-full flex items-center justify-center mx-auto mb-6">
                 <RotateCcw className="w-8 h-8 text-emerald-500" />
              </div>
              <h2 className="text-xl font-black text-slate-800 mb-2">Restore Parent Hub?</h2>
              <p className="text-sm font-bold text-slate-500 mb-8">This will restore full portal access for <span className="text-emerald-600 font-black">{showRestoreModal.name}</span>.</p>
              <div className="flex gap-3">
                 <button onClick={() => setShowRestoreModal(null)} className="flex-1 py-3 bg-slate-100 text-slate-600 font-bold rounded-xl hover:bg-slate-200 transition-all">Cancel</button>
                 <button onClick={handleRestore} className="flex-1 py-3 bg-emerald-500 text-white font-black rounded-xl shadow-lg shadow-emerald-200 hover:scale-[1.02] transition-all">Enable</button>
              </div>
           </div>
        </div>
      )}

      {showViewModal && (
        <ParentViewModal 
          parent={showViewModal}
          onClose={() => setShowViewModal(null)}
        />
      )}

      {showDeleteModal && (
        <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-sm z-[200] flex items-center justify-center p-4" onClick={() => setShowDeleteModal(null)}>
           <div className="bg-white rounded-[2rem] p-8 max-w-sm w-full text-center shadow-2xl animate-in zoom-in duration-300" onClick={e => e.stopPropagation()}>
              <div className="w-16 h-16 bg-rose-50 rounded-full flex items-center justify-center mx-auto mb-6">
                 <Trash2 className="w-8 h-8 text-rose-500" />
              </div>
              <h2 className="text-xl font-black text-slate-800 mb-2">Delete Parent Data?</h2>
              <p className="text-sm font-bold text-slate-500 mb-8 uppercase tracking-tighter">Warning: This will also remove the link to their associated students.</p>
              <div className="flex gap-3">
                 <button onClick={() => setShowDeleteModal(null)} className="flex-1 py-3 bg-slate-100 text-slate-600 font-bold rounded-xl hover:bg-slate-200 transition-all">Cancel</button>
                 <button onClick={handleDelete} className="flex-1 py-3 bg-rose-600 text-white font-black rounded-xl shadow-lg shadow-rose-200 hover:scale-[1.02] transition-all">Delete</button>
              </div>
           </div>
        </div>
      )}

      {/* Toast */}
      {toast && (
        <div className="fixed bottom-8 left-1/2 -translate-x-1/2 z-[300] animate-in slide-in-from-bottom-10 duration-500">
          <div className="bg-slate-900 text-white px-6 py-3 rounded-2xl shadow-2xl flex items-center gap-3 border border-slate-800">
            <CheckCircle className="w-4 h-4 text-emerald-400" />
            <p className="text-sm font-bold text-white">{toast}</p>
          </div>
        </div>
      )}
    </div>
  );
};

const ParentViewModal = ({ parent, onClose }) => {
  // Mock Linked Students for the view
  const linkedStudents = [
    { id: "MMS2025001", name: "আব্দুর রহমান", class: "Hifz Section", roll: "01", photo: "https://api.dicebear.com/7.x/avataaars/svg?seed=ST1" },
  ];

  return (
    <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-sm z-[200] flex items-center justify-center p-4 overflow-y-auto" onClick={onClose}>
      <div 
        className="bg-white rounded-[3rem] w-full max-w-2xl shadow-2xl animate-in zoom-in duration-300 overflow-hidden relative" 
        onClick={e => e.stopPropagation()}
      >
        {/* Profile Banner */}
        <div className="h-32 bg-gradient-to-r from-emerald-600 to-teal-500 relative">
           <div className="absolute -bottom-12 left-8 p-1 bg-white rounded-3xl shadow-xl">
              <div className="w-24 h-24 rounded-2xl overflow-hidden border-2 border-slate-50">
                 <img src={`https://api.dicebear.com/7.x/avataaars/svg?seed=${parent.id}`} alt={parent.name} className="w-full h-full object-cover" />
              </div>
           </div>
           <button onClick={onClose} className="absolute top-6 right-6 p-2 bg-white/20 hover:bg-white text-white hover:text-emerald-600 rounded-xl transition-all backdrop-blur-md">
             <X className="w-5 h-5" />
           </button>
        </div>

        <div className="px-8 pt-16 pb-8">
           <div className="flex flex-col md:flex-row md:items-start justify-between gap-4 mb-8 text-center md:text-left">
              <div>
                 <h2 className="text-3xl font-black text-slate-800 tracking-tight">{parent.name}</h2>
                 <p className="flex items-center justify-center md:justify-start gap-2 text-emerald-600 font-black uppercase text-xs tracking-widest mt-1">
                    <Briefcase className="w-3 h-3" /> {parent.occupation}
                 </p>
              </div>
              <span className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl text-xs font-black uppercase tracking-widest border-2 bg-rose-50 text-rose-700 border-rose-100">
                Inactive Portal
              </span>
           </div>

           <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-8">
              <div className="space-y-4">
                 <h4 className="text-[10px] font-black text-slate-400 uppercase tracking-[0.2em]">Contact Details</h4>
                 <div className="space-y-3">
                    <div className="flex items-center gap-4 group">
                       <div className="w-10 h-10 bg-slate-50 rounded-xl flex items-center justify-center group-hover:bg-emerald-50 transition-colors">
                          <Phone className="w-4 h-4 text-emerald-500" />
                       </div>
                       <div>
                          <p className="text-[10px] font-black text-slate-400 uppercase">Primary Phone</p>
                          <p className="text-sm font-bold text-slate-700">{parent.phone}</p>
                       </div>
                    </div>
                    <div className="flex items-center gap-4 group">
                       <div className="w-10 h-10 bg-slate-50 rounded-xl flex items-center justify-center group-hover:bg-emerald-50 transition-colors">
                          <Mail className="w-4 h-4 text-emerald-500" />
                       </div>
                       <div>
                          <p className="text-[10px] font-black text-slate-400 uppercase">Email ID</p>
                          <p className="text-sm font-bold text-slate-700">{parent.email}</p>
                       </div>
                    </div>
                 </div>
              </div>
              <div className="space-y-4">
                 <h4 className="text-[10px] font-black text-slate-400 uppercase tracking-[0.2em]">Deactivation Data</h4>
                 <div className="p-4 bg-rose-50 border-2 border-rose-100 rounded-2xl">
                    <div className="flex items-center gap-2 mb-2">
                       <ShieldAlert className="w-4 h-4 text-rose-500" />
                       <p className="text-xs font-black text-rose-800 uppercase tracking-tighter">Account Suspended</p>
                    </div>
                    <p className="text-xs font-bold text-rose-700 leading-relaxed mb-1">Reason: {parent.reason}</p>
                    <p className="text-[10px] font-black text-rose-400 uppercase">Date: {parent.deactivationDate}</p>
                 </div>
              </div>
           </div>

           {/* Linked Students Section */}
           <div className="space-y-4 pt-6 border-t-2 border-slate-50">
              <h4 className="text-[10px] font-black text-slate-400 uppercase tracking-[0.2em] flex items-center gap-2">
                 <Users className="w-3.5 h-3.5 text-emerald-500" /> Associated Students
              </h4>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                 {linkedStudents.map((student, i) => (
                    <div key={i} className="flex items-center gap-4 p-3 border-2 border-slate-100 rounded-[1.5rem] hover:border-emerald-200 hover:bg-emerald-50/20 transition-all group">
                       <div className="w-10 h-10 rounded-xl overflow-hidden shadow-sm group-hover:scale-105 transition-transform">
                          <img src={student.photo} alt={student.name} />
                       </div>
                       <div>
                          <p className="text-[10px] font-black text-slate-400 tracking-tighter uppercase mb-0.5">{student.id}</p>
                          <p className="text-xs font-black text-slate-800">{student.name}</p>
                          <p className="text-[10px] font-bold text-emerald-600">{student.class}</p>
                       </div>
                    </div>
                 ))}
              </div>
           </div>
        </div>

        <div className="p-8 bg-slate-50/50 border-t-2 border-slate-50 flex gap-4">
           <button onClick={onClose} className="w-full py-4 bg-white text-slate-600 font-bold rounded-[1.5rem] border-2 border-slate-200 hover:bg-slate-50 transition-all">Close Profile View</button>
        </div>
      </div>
    </div>
  );
};

export default DeactivatedParentList;
