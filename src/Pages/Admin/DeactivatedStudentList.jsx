import { useState, useMemo } from "react";
import { 
  Users, 
  Search, 
  RotateCcw, 
  Trash2, 
  UserX, 
  ChevronLeft, 
  ChevronRight,
  ShieldAlert,
  GraduationCap,
  Calendar,
  MoreVertical,
  CheckCircle,
  X
} from "lucide-react";

const DeactivatedStudentList = () => {
  const [searchTerm, setSearchTerm] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 10;
  
  // States for confirmation modals
  const [showRestoreModal, setShowRestoreModal] = useState(null);
  const [showDeleteModal, setShowDeleteModal] = useState(null);
  const [toast, setToast] = useState(null);

  // Sample Deactivated Data
  const deactivatedStudents = useMemo(() => [
    { id: "STU2025003", firstName: "ইউসুফ", lastName: "হোসেন", gender: "Male", class: "Class 4", section: "Section A", phone: "01934567890", email: "stu3@mms.com", deactivationDate: "2025-02-15", reason: "Payment Pending" },
    { id: "STU2025008", firstName: "খাদিজা", lastName: "তুল কোবরা", gender: "Female", class: "Class 6", section: "Section C", phone: "01212345678", email: "stu8@mms.com", deactivationDate: "2025-02-20", reason: "Administrative Review" },
    { id: "STU2025013", firstName: "সালেহ", lastName: "আহমেদ", gender: "Male", class: "Class 5", section: "Section C", phone: "01944567890", email: "stu13@mms.com", deactivationDate: "2025-02-22", reason: "Disciplinary Issue" },
    { id: "STU2025018", firstName: "রোকাইয়া", lastName: "বেগম", gender: "Female", class: "Class 4", section: "Section C", phone: "01299012345", email: "stu18@mms.com", deactivationDate: "2025-02-28", reason: "Long Absence" },
  ], []);

  const filtered = useMemo(() => {
    return deactivatedStudents.filter(s => 
      s.firstName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      s.lastName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      s.id.toLowerCase().includes(searchTerm.toLowerCase())
    );
  }, [searchTerm, deactivatedStudents]);

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
         <div className="relative z-10">
            <div className="flex items-center gap-3 mb-2">
              <div className="w-12 h-12 bg-rose-100 rounded-2xl flex items-center justify-center">
                <UserX className="w-6 h-6 text-rose-600" />
              </div>
              <h1 className="text-3xl font-black text-slate-800 tracking-tight">Login Deactive</h1>
            </div>
            <p className="text-slate-500 font-bold">Manage student accounts with suspended portal access</p>
         </div>
      </div>

      {/* Control Bar */}
      <div className="bg-white rounded-3xl border-2 border-slate-200 p-6 shadow-sm flex flex-col lg:flex-row lg:items-center justify-between gap-4">
        <div className="relative max-w-md w-full">
           <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
           <input 
              type="text" 
              placeholder="Search deactivated students..." 
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-10 pr-4 py-3 bg-slate-50 border-2 border-slate-100 rounded-xl outline-none focus:border-rose-500 transition-all font-bold text-sm"
           />
        </div>
        <div className="flex items-center gap-3 text-xs font-black text-slate-400 uppercase tracking-widest">
           <ShieldAlert className="w-4 h-4 text-rose-500" />
           {filtered.length} Restricted Accounts
        </div>
      </div>

      {/* Table Section */}
      <div className="bg-white rounded-[2.5rem] border-2 border-slate-200 shadow-sm overflow-hidden">
         <div className="overflow-x-auto">
            <table className="w-full">
               <thead className="bg-slate-50 border-b-2 border-slate-100 uppercase text-[10px] font-black tracking-widest text-slate-400">
                  <tr>
                     <th className="px-6 py-5 text-left">Student</th>
                     <th className="px-6 py-5 text-left">Deactivation</th>
                     <th className="px-6 py-5 text-left">Reason</th>
                     <th className="px-6 py-5 text-left">Status</th>
                     <th className="px-6 py-5 text-right">Actions</th>
                  </tr>
               </thead>
               <tbody className="divide-y-2 divide-slate-50">
                  {currentItems.map((student) => (
                    <tr key={student.id} className="hover:bg-rose-50/30 transition-all group">
                       <td className="px-6 py-5">
                          <div className="flex items-center gap-3">
                             <div className="w-10 h-10 rounded-full bg-slate-100 border-2 border-white shadow-sm overflow-hidden">
                                <img src={`https://api.dicebear.com/7.x/avataaars/svg?seed=${student.id}`} alt="Avatar" />
                             </div>
                             <div>
                                <p className="text-sm font-black text-slate-800">{student.firstName} {student.lastName}</p>
                                <p className="text-[10px] font-bold text-rose-600 uppercase tracking-widest">{student.id}</p>
                             </div>
                          </div>
                       </td>
                       <td className="px-6 py-5">
                          <div className="flex items-center gap-2 text-xs font-bold text-slate-600">
                             <Calendar className="w-3.5 h-3.5 text-slate-400" />
                             {student.deactivationDate}
                          </div>
                       </td>
                       <td className="px-6 py-5">
                          <span className="text-xs font-bold text-slate-500">{student.reason}</span>
                       </td>
                       <td className="px-6 py-5">
                          <span className="px-3 py-1 bg-rose-100 text-rose-700 text-[10px] font-black uppercase rounded-full tracking-widest">Restricted</span>
                       </td>
                       <td className="px-6 py-5 text-right">
                          <div className="flex items-center justify-end gap-2">
                             <button 
                                onClick={() => setShowRestoreModal(student)}
                                className="p-2 bg-emerald-50 text-emerald-600 rounded-lg hover:bg-emerald-100 transition-all group-hover:scale-110"
                                title="Reactivate Account"
                             >
                                <RotateCcw className="w-4 h-4" />
                             </button>
                             <button 
                                onClick={() => setShowDeleteModal(student)}
                                className="p-2 bg-rose-50 text-rose-600 rounded-lg hover:bg-rose-100 transition-all group-hover:scale-110"
                                title="Permanent Delete"
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
         <div className="p-6 bg-slate-50/50 border-t-2 border-slate-100 flex items-center justify-between">
            <p className="text-xs font-bold text-slate-400 tracking-widest uppercase">Page {currentPage} of {totalPages || 1}</p>
            <div className="flex gap-2">
               <button 
                  disabled={currentPage === 1}
                  onClick={() => setCurrentPage(p => p - 1)}
                  className="p-2 bg-white rounded-xl border border-slate-200 text-slate-400 hover:text-rose-500 transition-all disabled:opacity-50"
               >
                  <ChevronLeft className="w-5 h-5" />
               </button>
               <button 
                   disabled={currentPage === totalPages || totalPages === 0}
                   onClick={() => setCurrentPage(p => p + 1)}
                   className="p-2 bg-white rounded-xl border border-slate-200 text-slate-400 hover:text-rose-500 transition-all disabled:opacity-50"
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
              <h2 className="text-xl font-black text-slate-800 mb-2">Reactivate Account?</h2>
              <p className="text-sm font-bold text-slate-500 mb-8">This will restore full portal access for <span className="text-emerald-600 font-black">{showRestoreModal.firstName}</span>.</p>
              <div className="flex gap-3">
                 <button onClick={() => setShowRestoreModal(null)} className="flex-1 py-3 bg-slate-100 text-slate-600 font-bold rounded-xl hover:bg-slate-200 transition-all">Cancel</button>
                 <button onClick={() => handleActionComplete("Account restored successfully!")} className="flex-1 py-3 bg-emerald-500 text-white font-black rounded-xl shadow-lg shadow-emerald-200 hover:scale-[1.02] transition-all">Restore</button>
              </div>
           </div>
        </div>
      )}

      {showDeleteModal && (
        <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-sm z-[200] flex items-center justify-center p-4" onClick={() => setShowDeleteModal(null)}>
           <div className="bg-white rounded-[2rem] p-8 max-w-sm w-full text-center shadow-2xl animate-in zoom-in duration-300" onClick={e => e.stopPropagation()}>
              <div className="w-16 h-16 bg-rose-50 rounded-full flex items-center justify-center mx-auto mb-6">
                 <Trash2 className="w-8 h-8 text-rose-500" />
              </div>
              <h2 className="text-xl font-black text-slate-800 mb-2">Permanent Delete?</h2>
              <p className="text-sm font-bold text-slate-500 mb-8 text-balance uppercase tracking-tighter">This action is irreversible and will remove all student data.</p>
              <div className="flex gap-3">
                 <button onClick={() => setShowDeleteModal(null)} className="flex-1 py-3 bg-slate-100 text-slate-600 font-bold rounded-xl hover:bg-slate-200 transition-all">Go Back</button>
                 <button onClick={() => handleActionComplete("Account deleted permanently!")} className="flex-1 py-3 bg-rose-600 text-white font-black rounded-xl shadow-lg shadow-rose-200 hover:scale-[1.02] transition-all">Delete</button>
              </div>
           </div>
        </div>
      )}

      {/* Toast */}
      {toast && (
        <div className="fixed bottom-8 left-1/2 -translate-x-1/2 z-[300] animate-in slide-in-from-bottom-10 duration-500">
          <div className="bg-slate-900 text-white px-6 py-3 rounded-2xl shadow-2xl flex items-center gap-3">
            <CheckCircle className="w-4 h-4 text-emerald-400" />
            <p className="text-sm font-bold text-white">{toast}</p>
          </div>
        </div>
      )}
    </div>
  );
};

export default DeactivatedStudentList;
