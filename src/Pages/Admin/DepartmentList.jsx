import { useState } from "react";
import { 
  Building2, 
  Plus, 
  Search, 
  Edit2, 
  Trash2, 
  Users, 
  ChevronRight,
  MoreVertical,
  X,
  CheckCircle,
  AlertTriangle
} from "lucide-react";

const DepartmentList = () => {
  const [departments, setDepartments] = useState([
    { id: 1, name: "Academic", head: "মাওলানা আব্দুল হাই", staffCount: 25, color: "bg-blue-500" },
    { id: 2, name: "Arabic", head: "муфти আব্দুর রহমান", staffCount: 18, color: "bg-emerald-500" },
    { id: 3, name: "Administration", head: "আহমেদ আলী", staffCount: 8, color: "bg-purple-500" },
    { id: 4, name: "Maintenance", head: "কামাল উদ্দিন", staffCount: 12, color: "bg-amber-500" },
    { id: 5, name: "Kitchen", head: "সাইফুল ইসলাম", staffCount: 15, color: "bg-rose-500" },
  ]);

  const [searchTerm, setSearchTerm] = useState("");
  const [showAddModal, setShowAddModal] = useState(false);
  const [editDept, setEditDept] = useState(null);
  const [deleteDept, setDeleteDept] = useState(null);
  const [toast, setToast] = useState(null);

  const filteredDepts = departments.filter(d => 
    d.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handleSave = (name) => {
    if (editDept) {
      setDepartments(prev => prev.map(d => d.id === editDept.id ? { ...d, name } : d));
      setToast(`Department "${name}" updated!`);
    } else {
      const newDept = {
        id: Date.now(),
        name,
        head: "Unassigned",
        staffCount: 0,
        color: "bg-slate-500"
      };
      setDepartments([...departments, newDept]);
      setToast(`New department "${name}" created!`);
    }
    setShowAddModal(false);
    setEditDept(null);
    setTimeout(() => setToast(null), 3000);
  };

  const handleDelete = () => {
    setDepartments(prev => prev.filter(d => d.id !== deleteDept.id));
    setToast(`Department "${deleteDept.name}" removed.`);
    setDeleteDept(null);
    setTimeout(() => setToast(null), 3000);
  };

  return (
    <div className="p-3 sm:p-4 md:p-6 lg:p-8 space-y-8 animate-in fade-in duration-500">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 bg-white p-8 rounded-[2.5rem] border-2 border-slate-100 shadow-sm relative overflow-hidden">
        <div className="absolute top-0 right-0 w-64 h-64 bg-blue-50 rounded-full -mr-32 -mt-32 opacity-40" />
        <div className="flex items-center gap-5 relative z-10">
          <div className="w-16 h-16 bg-blue-50 rounded-2xl flex items-center justify-center shadow-inner">
             <Building2 className="w-8 h-8 text-blue-600" />
          </div>
          <div>
            <h1 className="text-2xl sm:text-4xl font-black text-slate-800 tracking-tight">Departments</h1>
            <p className="text-slate-500 text-sm font-bold uppercase tracking-widest mt-1">Organize your institutional sectors</p>
          </div>
        </div>
        <button 
          onClick={() => setShowAddModal(true)}
          className="relative z-10 flex items-center justify-center gap-2 px-8 py-4 bg-blue-600 text-white font-black rounded-2xl shadow-xl shadow-blue-200 hover:shadow-2xl hover:scale-[1.02] active:scale-95 transition-all text-sm uppercase tracking-widest"
        >
          <Plus className="w-5 h-5" /> New Department
        </button>
      </div>

      {/* Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredDepts.map(dept => (
          <div key={dept.id} className="bg-white rounded-[2rem] border-2 border-slate-50 p-6 shadow-sm hover:border-blue-200 hover:shadow-xl transition-all group relative overflow-hidden">
             <div className={`absolute top-0 right-0 w-2 h-full ${dept.color}`} />
             <div className="flex justify-between items-start mb-6">
                <div className={`w-14 h-14 ${dept.color} bg-opacity-10 rounded-2xl flex items-center justify-center`}>
                   <Building2 className={`w-7 h-7 ${dept.color.replace('bg-', 'text-')}`} />
                </div>
                <div className="flex gap-1">
                   <button onClick={() => { setEditDept(dept); setShowAddModal(true); }} className="p-2.5 bg-slate-50 text-slate-400 hover:text-blue-600 hover:bg-blue-50 rounded-xl transition-all"><Edit2 className="w-4 h-4" /></button>
                   <button onClick={() => setDeleteDept(dept)} className="p-2.5 bg-slate-50 text-slate-400 hover:text-rose-600 hover:bg-rose-50 rounded-xl transition-all"><Trash2 className="w-4 h-4" /></button>
                </div>
             </div>
             <h3 className="text-xl font-black text-slate-800 mb-2 truncate">{dept.name}</h3>
             <div className="space-y-3">
                <div className="flex items-center gap-3 text-slate-500">
                   <Users className="w-4 h-4" />
                   <span className="text-xs font-bold uppercase tracking-tighter">{dept.staffCount} Staff Members</span>
                </div>
                <div className="px-4 py-3 bg-slate-50 rounded-xl border border-slate-100 flex items-center justify-between group-hover:bg-blue-50 transition-colors">
                   <div>
                      <p className="text-[9px] font-black text-slate-400 uppercase tracking-widest mb-0.5">Dept Head</p>
                      <p className="text-xs font-black text-slate-700">{dept.head}</p>
                   </div>
                   <ChevronRight className="w-4 h-4 text-slate-300 transition-transform group-hover:translate-x-1" />
                </div>
             </div>
          </div>
        ))}
      </div>

      {/* Modal */}
      {showAddModal && (
        <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-sm z-[200] flex items-center justify-center p-4" onClick={() => { setShowAddModal(false); setEditDept(null); }}>
           <div className="bg-white rounded-[2.5rem] w-full max-w-md shadow-2xl animate-in zoom-in duration-300 overflow-hidden" onClick={e => e.stopPropagation()}>
              <div className="p-8 border-b-2 border-slate-50 flex items-center justify-between bg-slate-50/50">
                 <h2 className="text-2xl font-black text-slate-800 tracking-tight">{editDept ? 'Edit Department' : 'New Department'}</h2>
                 <button onClick={() => { setShowAddModal(false); setEditDept(null); }} className="p-3 bg-white border-2 border-slate-100 text-slate-400 hover:text-rose-500 rounded-xl transition-all"><X className="w-5 h-5" /></button>
              </div>
              <form onSubmit={(e) => { e.preventDefault(); handleSave(e.target.deptName.value); }} className="p-8 space-y-6">
                 <div className="space-y-2">
                    <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest flex items-center gap-2">
                       <Building2 className="w-3.5 h-3.5 text-blue-500" /> Department Name
                    </label>
                    <input 
                      name="deptName"
                      required
                      autoFocus
                      defaultValue={editDept?.name || ""}
                      placeholder="e.g. Arabic Foundation"
                      className="w-full px-5 py-4 bg-slate-50 border-2 border-transparent focus:border-blue-500 focus:bg-white rounded-2xl outline-none font-bold text-slate-800 transition-all shadow-inner"
                    />
                 </div>
                 <div className="flex gap-4">
                    <button type="button" onClick={() => { setShowAddModal(false); setEditDept(null); }} className="flex-1 py-4 bg-slate-100 text-slate-600 font-black rounded-2xl hover:bg-slate-200 transition-all uppercase text-xs tracking-widest">Cancel</button>
                    <button type="submit" className="flex-1 py-4 bg-blue-600 text-white font-black rounded-2xl shadow-xl shadow-blue-200 hover:scale-[1.02] transition-all uppercase text-xs tracking-widest">Save Changes</button>
                 </div>
              </form>
           </div>
        </div>
      )}

      {/* Delete Confirmation */}
      {deleteDept && (
        <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-sm z-[200] flex items-center justify-center p-4" onClick={() => setDeleteDept(null)}>
           <div className="bg-white rounded-[2.5rem] p-10 max-w-sm w-full text-center shadow-2xl animate-in zoom-in duration-300" onClick={e => e.stopPropagation()}>
              <div className="w-20 h-20 bg-rose-50 rounded-3xl flex items-center justify-center mx-auto mb-8 shadow-inner">
                 <Trash2 className="w-10 h-10 text-rose-500" />
              </div>
              <h2 className="text-2xl font-black text-slate-800 mb-3 tracking-tight">Remove Dept?</h2>
              <p className="text-sm font-bold text-slate-500 mb-8 leading-relaxed">Deleting <span className="text-rose-600">{deleteDept.name}</span> will unassign its members. This Cannot be undone.</p>
              <div className="flex gap-4">
                 <button onClick={() => setDeleteDept(null)} className="flex-1 py-4 bg-slate-100 text-slate-600 font-black rounded-2xl hover:bg-slate-200 transition-all uppercase text-xs tracking-widest">Wait, No</button>
                 <button onClick={handleDelete} className="flex-1 py-4 bg-rose-600 text-white font-black rounded-2xl shadow-xl shadow-rose-200 hover:scale-105 transition-all uppercase text-xs tracking-widest">Confirm</button>
              </div>
           </div>
        </div>
      )}

      {/* Toast */}
      {toast && (
        <div className="fixed bottom-10 left-1/2 -translate-x-1/2 z-[300] animate-in slide-in-from-bottom-5 duration-500 px-4">
           <div className="bg-slate-900 border border-slate-800 text-white px-8 py-4 rounded-[2rem] shadow-2xl flex items-center gap-4">
              <div className="w-8 h-8 bg-blue-500 rounded-full flex items-center justify-center shadow-blue-500/50 shadow-lg">
                 <CheckCircle className="w-5 h-5" />
              </div>
              <p className="text-sm font-black tracking-tight">{toast}</p>
           </div>
        </div>
      )}
    </div>
  );
};

export default DepartmentList;
