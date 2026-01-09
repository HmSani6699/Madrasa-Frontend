import { useState, useMemo, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import {
  Search,
  Filter,
  Download,
  Eye,
  Plus,
  Users,
  CheckCircle,
  XCircle,
  MoreVertical,
  Phone,
  Mail,
  MapPin,
  Calendar,
  Contact,
  X,
  Edit2,
  Trash2,
  UserCheck,
  MessageCircle,
  ChevronLeft,
  ChevronRight,
  Briefcase,
  AlertTriangle,
  FileText
} from "lucide-react";

const ParentList = () => {
  const [parents, setParents] = useState([
    { id: "PAR2025001", name: "আব্দুল করিম", occupation: "Businessman", phone: "01700000001", email: "karim@example.com", address: "Dhanmondi, Dhaka", status: "active", childrenCount: 2, photo: "https://api.dicebear.com/7.x/avataaars/svg?seed=PAR1" },
    { id: "PAR2025002", name: "মোহাম্মদ আলী", occupation: "Teacher", phone: "01800000002", email: "ali@example.com", address: "Mirpur, Dhaka", status: "active", childrenCount: 1, photo: "https://api.dicebear.com/7.x/avataaars/svg?seed=PAR2" },
    { id: "PAR2025003", name: "হোসেন আহমেদ", occupation: "Doctor", phone: "01900000003", email: "hossain@example.com", address: "Uttara, Dhaka", status: "inactive", childrenCount: 1, photo: "https://api.dicebear.com/7.x/avataaars/svg?seed=PAR3" },
    { id: "PAR2025004", name: "আব্দুল্লাহ মাহমুদ", occupation: "Engineer", phone: "01600000004", email: "mahmud@example.com", address: "Gulshan, Dhaka", status: "active", childrenCount: 3, photo: "https://api.dicebear.com/7.x/avataaars/svg?seed=PAR4" },
    { id: "PAR2025005", name: "সাইফুল ইসলাম", occupation: "Banker", phone: "01500000005", email: "saiful@example.com", address: "Banani, Dhaka", status: "active", childrenCount: 1, photo: "https://api.dicebear.com/7.x/avataaars/svg?seed=PAR5" },
    { id: "PAR2025006", name: "জসিম উদ্দিন", occupation: "Farmer", phone: "01400000006", email: "jasim@example.com", address: "Gazipur", status: "active", childrenCount: 2, photo: "https://api.dicebear.com/7.x/avataaars/svg?seed=PAR6" },
    { id: "PAR2025007", name: "মনির হোসেন", occupation: "Driver", phone: "01300000007", email: "monir@example.com", address: "Narayanganj", status: "active", childrenCount: 1, photo: "https://api.dicebear.com/7.x/avataaars/svg?seed=PAR7" },
    { id: "PAR2025008", name: "রেজাউল করিম", occupation: "Lawyer", phone: "01200000008", email: "rezaul@example.com", address: "Cumilla", status: "inactive", childrenCount: 2, photo: "https://api.dicebear.com/7.x/avataaars/svg?seed=PAR8" },
    { id: "PAR2025009", name: "নুরুল ইসলাম", occupation: "Imam", phone: "01100000009", email: "nurul@example.com", address: "Sylhet", status: "active", childrenCount: 1, photo: "https://api.dicebear.com/7.x/avataaars/svg?seed=PAR9" },
    { id: "PAR2025010", name: "শাহাদাত হোসেন", occupation: "Clerk", phone: "01000000010", email: "shahadat@example.com", address: "Rajshahi", status: "active", childrenCount: 2, photo: "https://api.dicebear.com/7.x/avataaars/svg?seed=PAR10" },
    { id: "PAR2025011", name: "ফয়সাল আহমেদ", occupation: "Pilot", phone: "01720000011", email: "faisal@example.com", address: "Chittagong", status: "active", childrenCount: 1, photo: "https://api.dicebear.com/7.x/avataaars/svg?seed=PAR11" },
    { id: "PAR2025012", name: "আরিফ রহমান", occupation: "Chef", phone: "01830000012", email: "arif@example.com", address: "Barishal", status: "active", childrenCount: 1, photo: "https://api.dicebear.com/7.x/avataaars/svg?seed=PAR12" },
    { id: "PAR2025013", name: "মাহবুব আলম", occupation: "Journalist", phone: "01940000013", email: "mahbub@example.com", address: "Khulna", status: "inactive", childrenCount: 1, photo: "https://api.dicebear.com/7.x/avataaars/svg?seed=PAR13" },
    { id: "PAR2025014", name: "হারুনুর রশিদ", occupation: "Technician", phone: "01650000014", email: "harun@example.com", address: "Rangpur", status: "active", childrenCount: 2, photo: "https://api.dicebear.com/7.x/avataaars/svg?seed=PAR14" },
    { id: "PAR2025015", name: "মতিউর রহমান", occupation: "Architect", phone: "01560000015", email: "motiur@example.com", address: "Mymensingh", status: "active", childrenCount: 3, photo: "https://api.dicebear.com/7.x/avataaars/svg?seed=PAR15" },
  ]);

  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [openMenuId, setOpenMenuId] = useState(null);
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 10;
  const navigate = useNavigate();

  // New states for Action UI
  const [showAddModal, setShowAddModal] = useState(false);
  const [editParent, setEditParent] = useState(null);
  const [viewParent, setViewParent] = useState(null);
  const [deleteParent, setDeleteParent] = useState(null);
  const [showStatusToast, setShowStatusToast] = useState(null);

  // Close menu when clicking elsewhere
  const handleClickOutside = () => setOpenMenuId(null);
  useEffect(() => {
    window.addEventListener('click', handleClickOutside);
    return () => window.removeEventListener('click', handleClickOutside);
  }, []);

  // Action Handlers
  const handleAction = (label, parent) => {
    setOpenMenuId(null);
    if (label === 'Edit Info') {
      setEditParent(parent);
    } else if (label === 'Delete Record') {
      setDeleteParent(parent);
    } else if (label === 'Change Status') {
      const newStatus = parent.status === 'active' ? 'inactive' : 'active';
      setParents(prev => prev.map(p => p.id === parent.id ? { ...p, status: newStatus } : p));
      setShowStatusToast(`${parent.name}'s status changed to ${newStatus}`);
      setTimeout(() => setShowStatusToast(null), 3000);
    } else if (label === 'Message') {
      setShowStatusToast(`Direct messaging feature for ${parent.name} coming soon!`);
      setTimeout(() => setShowStatusToast(null), 3000);
    }
  };

  const handleExport = () => {
    setShowStatusToast("Generating Parent Directory export (CSV)...");
    setTimeout(() => {
        setShowStatusToast("Export complete! Check your downloads.");
    }, 2000);
  };

  const handleSaveNew = (newParentData) => {
    const newId = `PAR2025${String(parents.length + 1).padStart(3, '0')}`;
    const newParent = {
      ...newParentData,
      id: newId,
      status: 'active',
      childrenCount: 0,
      photo: `https://api.dicebear.com/7.x/avataaars/svg?seed=${newId}`
    };
    setParents([newParent, ...parents]);
    setShowAddModal(false);
    setShowStatusToast(`${newParent.name} added to directory!`);
    setTimeout(() => setShowStatusToast(null), 3000);
  };

  const handleUpdate = (updatedData) => {
    setParents(prev => prev.map(p => p.id === updatedData.id ? { ...p, ...updatedData } : p));
    setEditParent(null);
    setShowStatusToast(`Record for ${updatedData.name} updated successfully!`);
    setTimeout(() => setShowStatusToast(null), 3000);
  };

  const handleDelete = () => {
    setParents(prev => prev.filter(p => p.id !== deleteParent.id));
    setShowStatusToast(`${deleteParent.name}'s record has been removed.`);
    setDeleteParent(null);
    setTimeout(() => setShowStatusToast(null), 3000);
  };

  // Filtered Results
  const filteredParents = useMemo(() => {
    return parents.filter(parent => {
      const matchesSearch = 
        parent.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        parent.id.toLowerCase().includes(searchTerm.toLowerCase()) ||
        parent.phone.includes(searchTerm);
      
      const matchesStatus = statusFilter === "all" || parent.status === statusFilter;
      
      return matchesSearch && matchesStatus;
    });
  }, [searchTerm, statusFilter, parents]);

  // Pagination Logic
  const totalPages = Math.ceil(filteredParents.length / itemsPerPage);
  const currentParents = useMemo(() => {
    const startIndex = (currentPage - 1) * itemsPerPage;
    return filteredParents.slice(startIndex, startIndex + itemsPerPage);
  }, [currentPage, filteredParents]);

  // Reset to page 1 on search/filter change
  useEffect(() => {
    setCurrentPage(1);
  }, [searchTerm, statusFilter]);

  return (
    <div className="space-y-6 sm:space-y-8 animate-in fade-in duration-500 p-3 sm:p-4 md:p-6 lg:p-8">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 bg-white dark:bg-white p-6 rounded-3xl border-2 border-slate-200 shadow-sm text-center md:text-left">
        <div className="flex items-center gap-4 justify-center md:justify-start">
          <div className="w-14 h-14 bg-[#e6f4ef] rounded-2xl flex items-center justify-center">
             <Contact className="w-7 h-7 text-[#00bd7f]" />
          </div>
          <div>
            <h1 className="text-2xl sm:text-3xl font-black text-slate-800 mb-1">Parent Directory</h1>
            <p className="text-slate-600 text-sm font-semibold">Manage and communicate with all guardians</p>
          </div>
        </div>
        <div className="flex flex-col sm:flex-row items-center gap-3">
          <button 
            onClick={handleExport}
            className="w-full sm:w-auto flex items-center justify-center gap-2 px-5 py-2.5 text-sm font-bold bg-slate-100 text-slate-700 rounded-xl hover:bg-slate-200 transition-all border border-slate-200"
          >
            <Download className="w-4 h-4" />
            Export Data
          </button>
          <button 
            onClick={() => setShowAddModal(true)}
            className="w-full flex items-center justify-center gap-2 px-5 py-2.5 text-sm font-bold bg-[#00bd7f] text-white rounded-xl shadow-lg shadow-emerald-500/30 hover:shadow-xl hover:shadow-emerald-500/40 hover:scale-[1.02] transition-all"
          >
            <Plus className="w-4 h-4" />
            Add Parent
          </button>
        </div>
      </div>

      {/* Stats Summary */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {[
          { label: "Total Parents", value: parents.length, icon: Contact, color: "text-blue-600", bg: "bg-blue-100" },
          { label: "Active Portal", value: parents.filter(s => s.status === 'active').length, icon: CheckCircle, color: "text-emerald-600", bg: "bg-emerald-100" },
          { label: "Suspended", value: parents.filter(s => s.status === 'inactive').length, icon: XCircle, color: "text-rose-600", bg: "bg-rose-100" },
          { label: "Avg Children", value: (parents.reduce((acc, p) => acc + p.childrenCount, 0) / parents.length).toFixed(1), icon: Users, color: "text-amber-600", bg: "bg-amber-100" }
        ].map((stat, idx) => (
          <div key={idx} className="bg-white rounded-2xl border-2 border-slate-200 p-6 flex items-center justify-between shadow-sm">
            <div>
              <p className="text-xs font-bold text-slate-500 uppercase mb-1">{stat.label}</p>
              <p className="text-2xl font-black text-slate-800">{stat.value}</p>
            </div>
            <div className={`w-12 h-12 ${stat.bg} rounded-xl flex items-center justify-center`}>
              <stat.icon className={`w-6 h-6 ${stat.color}`} />
            </div>
          </div>
        ))}
      </div>

      {/* Filters Area */}
      <div className="bg-white rounded-3xl border-2 border-slate-200 p-4 sm:p-6 md:p-8 shadow-sm">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="md:col-span-2">
            <label className="text-sm font-bold text-slate-700 mb-2 block">Quick Search</label>
            <div className="relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
              <input
                type="text"
                placeholder="Search by ID, Name or Phone..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-10 pr-4 py-3 bg-[#e6f4ef] border-2 border-slate-200 text-slate-900 rounded-xl outline-none focus:ring-2 focus:ring-emerald-500 transition-all"
              />
            </div>
          </div>
          <div>
            <label className="text-sm font-bold text-slate-700 mb-2 block">Portal Status</label>
            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
              className="w-full px-4 py-3 bg-[#e6f4ef] border-2 border-slate-200 text-slate-900 rounded-xl outline-none focus:ring-2 focus:ring-emerald-500 transition-all appearance-none"
            >
              <option value="all">All Status</option>
              <option value="active">Active</option>
              <option value="inactive">Inactive</option>
            </select>
          </div>
        </div>
      </div>

      {/* Table Container */}
      <div className="bg-white rounded-3xl border-2 border-slate-200 shadow-sm overflow-hidden flex flex-col">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-[#e6f4ef] border-b-2 border-slate-200">
              <tr>
                <th className="px-6 py-4 text-left text-xs font-black text-slate-600 uppercase tracking-wider">Parent ID</th>
                <th className="px-6 py-4 text-left text-xs font-black text-slate-600 uppercase tracking-wider">Parent Info</th>
                <th className="px-6 py-4 text-left text-xs font-black text-slate-600 uppercase tracking-wider">Occupation</th>
                <th className="px-6 py-4 text-left text-xs font-black text-slate-600 uppercase tracking-wider">Children</th>
                <th className="px-6 py-4 text-left text-xs font-black text-slate-600 uppercase tracking-wider">Contact</th>
                <th className="px-6 py-4 text-left text-xs font-black text-slate-600 uppercase tracking-wider">Status</th>
                <th className="px-6 py-4 text-left text-xs font-black text-slate-600 uppercase tracking-wider">Action</th>
              </tr>
            </thead>
            <tbody className="divide-y-2 divide-slate-100">
              {currentParents.map((parent) => (
                <tr key={parent.id} className="hover:bg-slate-50 transition-colors">
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span className="text-sm font-black text-emerald-700">{parent.id}</span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded-full border-2 border-emerald-100 overflow-hidden shadow-sm bg-slate-100">
                        <img src={parent.photo} alt={parent.name} className="w-full h-full object-cover" />
                      </div>
                      <div>
                        <p className="text-sm font-bold text-slate-800">{parent.name}</p>
                        <p className="text-[10px] text-slate-500 font-bold uppercase tracking-wider">{parent.address}</p>
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="flex items-center gap-2 text-sm font-bold text-slate-700">
                       <Briefcase className="w-3.5 h-3.5 text-emerald-500" />
                       {parent.occupation}
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="inline-flex items-center gap-2 px-3 py-1 bg-amber-50 text-amber-700 border border-amber-100 rounded-full text-xs font-black">
                       <Users className="w-3.5 h-3.5" />
                       {parent.childrenCount}
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="space-y-1 text-xs font-bold text-slate-600">
                      <div className="flex items-center gap-1.5"><Phone className="w-3.5 h-3.5 text-emerald-500" />{parent.phone}</div>
                      <div className="flex items-center gap-1.5"><Mail className="w-3.5 h-3.5 text-emerald-500" />{parent.email}</div>
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full text-[10px] font-black uppercase tracking-widest border-2 ${
                      parent.status === 'active' 
                        ? 'bg-emerald-50 text-emerald-700 border-emerald-100' 
                        : 'bg-rose-50 text-rose-700 border-rose-100'
                    }`}>
                      <div className={`w-1.5 h-1.5 rounded-full ${parent.status === 'active' ? 'bg-emerald-500' : 'bg-rose-500'}`} />
                      {parent.status}
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="flex items-center gap-2">
                      <button 
                        onClick={() => setViewParent(parent)}
                        className="p-2 hover:bg-emerald-50 text-emerald-600 rounded-lg transition-all"
                        title="View Detailed Profile"
                      >
                        <Eye className="w-4 h-4" />
                      </button>
                      <div className="relative">
                        <button 
                          onClick={(e) => {
                            e.stopPropagation();
                            setOpenMenuId(openMenuId === parent.id ? null : parent.id);
                          }}
                          className={`p-2 rounded-lg transition-all ${openMenuId === parent.id ? 'bg-slate-100 text-[#00bd7f]' : 'hover:bg-slate-100 text-slate-400'}`}
                        >
                          <MoreVertical className="w-4 h-4" />
                        </button>
                        
                        {openMenuId === parent.id && (
                          <div className="absolute right-0 mt-2 w-48 bg-white rounded-2xl shadow-xl border-2 border-slate-100 z-50 py-2 animate-in fade-in slide-in-from-top-2 duration-200">
                            {[
                              { label: 'Edit Info', icon: Edit2, color: 'text-slate-600', hover: 'hover:bg-slate-50' },
                              { label: 'Message', icon: MessageCircle, color: 'text-slate-600', hover: 'hover:bg-slate-50' },
                              { label: 'Change Status', icon: UserCheck, color: 'text-slate-600', hover: 'hover:bg-slate-50' },
                              { label: 'Delete Record', icon: Trash2, color: 'text-rose-500', hover: 'hover:bg-rose-50' },
                            ].map((action, i) => (
                              <button 
                                key={i}
                                onClick={() => handleAction(action.label, parent)}
                                className={`w-full flex items-center gap-3 px-4 py-2.5 text-xs font-bold ${action.color} ${action.hover} transition-colors first:rounded-t-xl last:rounded-b-xl`}
                              >
                                <action.icon className="w-4 h-4" />
                                {action.label}
                              </button>
                            ))}
                          </div>
                        )}
                      </div>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* Pagination Controls */}
        <div className="bg-[#e6f4ef]/30 px-6 py-4 border-t-2 border-slate-200 flex flex-col sm:flex-row items-center justify-between gap-4">
          <p className="text-xs font-bold text-slate-500 uppercase tracking-wider">
            Showing <span className="text-slate-900">{(currentPage-1)*itemsPerPage + 1}</span> to <span className="text-slate-900">{Math.min(currentPage*itemsPerPage, filteredParents.length)}</span> of <span className="text-slate-900">{filteredParents.length}</span> records
          </p>
          <div className="flex items-center gap-2">
            <button 
              disabled={currentPage === 1}
              onClick={() => setCurrentPage(p => Math.max(1, p - 1))}
              className="p-2 border-2 border-slate-200 rounded-xl bg-white text-slate-600 hover:bg-slate-50 hover:border-emerald-500 hover:text-emerald-600 disabled:opacity-50 disabled:cursor-not-allowed transition-all"
            >
              <ChevronLeft className="w-5 h-5" />
            </button>
            <div className="flex items-center gap-1">
              {[...Array(totalPages)].map((_, i) => (
                <button
                  key={i+1}
                  onClick={() => setCurrentPage(i + 1)}
                  className={`w-10 h-10 rounded-xl text-xs font-black transition-all border-2 ${
                    currentPage === i + 1 
                      ? 'bg-[#00bd7f] border-[#00bd7f] text-white shadow-lg shadow-emerald-200' 
                      : 'bg-white border-slate-200 text-slate-600 hover:border-emerald-500 hover:text-emerald-600'
                  }`}
                >
                  {i + 1}
                </button>
              ))}
            </div>
            <button 
              disabled={currentPage === totalPages || totalPages === 0}
              onClick={() => setCurrentPage(p => Math.min(totalPages, p + 1))}
              className="p-2 border-2 border-slate-200 rounded-xl bg-white text-slate-600 hover:bg-slate-50 hover:border-emerald-500 hover:text-emerald-600 disabled:opacity-50 disabled:cursor-not-allowed transition-all"
            >
              <ChevronRight className="w-5 h-5" />
            </button>
          </div>
        </div>
      </div>

      {/* Action Modals */}
      {showAddModal && (
        <ParentFormModal 
          onClose={() => setShowAddModal(false)}
          onSave={handleSaveNew}
          title="Add New Parent"
        />
      )}

      {editParent && (
        <ParentFormModal 
          parent={editParent}
          onClose={() => setEditParent(null)}
          onSave={handleUpdate}
          title="Edit Parent Information"
        />
      )}

      {viewParent && (
        <ParentViewModal 
          parent={viewParent}
          onClose={() => setViewParent(null)}
        />
      )}

      {deleteParent && (
        <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-sm z-[200] flex items-center justify-center p-4" onClick={() => setDeleteParent(null)}>
           <div className="bg-white rounded-[2rem] p-8 max-w-sm w-full text-center shadow-2xl animate-in zoom-in duration-300" onClick={e => e.stopPropagation()}>
              <div className="w-16 h-16 bg-rose-50 rounded-full flex items-center justify-center mx-auto mb-6">
                 <Trash2 className="w-8 h-8 text-rose-500" />
              </div>
              <h2 className="text-xl font-black text-slate-800 mb-2">Confirm Delete</h2>
              <p className="text-sm font-bold text-slate-500 mb-8 uppercase tracking-tighter leading-tight">Are you sure you want to remove <span className="text-rose-600">{deleteParent.name}</span> from the directory? This action is permanent.</p>
              <div className="flex gap-3">
                 <button onClick={() => setDeleteParent(null)} className="flex-1 py-3 bg-slate-100 text-slate-600 font-bold rounded-xl hover:bg-slate-200 transition-all">Cancel</button>
                 <button onClick={handleDelete} className="flex-1 py-3 bg-rose-600 text-white font-black rounded-xl shadow-lg shadow-rose-200 hover:scale-[1.02] transition-all">Confirm Delete</button>
              </div>
           </div>
        </div>
      )}

      {showStatusToast && (
        <div className="fixed bottom-8 left-1/2 -translate-x-1/2 z-[300] animate-in slide-in-from-bottom-10 duration-500 px-4 w-full max-w-md text-center">
          <div className="bg-slate-900 text-white px-6 py-3 rounded-2xl shadow-2xl flex items-center justify-center gap-3">
            <div className="w-6 h-6 bg-emerald-500 rounded-full flex items-center justify-center shrink-0">
              <CheckCircle className="w-4 h-4 text-white" />
            </div>
            <p className="text-sm font-bold">{showStatusToast}</p>
          </div>
        </div>
      )}
    </div>
  );
};

const ParentFormModal = ({ parent, onClose, onSave, title }) => {
  const [formData, setFormData] = useState(parent || {
    name: "",
    occupation: "",
    phone: "",
    email: "",
    address: ""
  });

  const handleSubmit = (e) => {
    e.preventDefault();
    onSave(formData);
  };

  return (
    <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-sm z-[200] flex items-center justify-center p-4 overflow-y-auto" onClick={onClose}>
      <form 
        onSubmit={handleSubmit}
        className="bg-white rounded-[2.5rem] w-full max-w-2xl shadow-2xl animate-in zoom-in duration-300 overflow-hidden relative" 
        onClick={e => e.stopPropagation()}
      >
        <div className="p-8 border-b-2 border-slate-50 flex items-center justify-between sticky top-0 bg-white/80 backdrop-blur-md z-10">
          <div>
            <h2 className="text-2xl font-black text-slate-800 tracking-tight">{title}</h2>
            <p className="text-xs font-bold text-slate-400 uppercase tracking-widest mt-1">Provide detailed guardian credentials</p>
          </div>
          <button type="button" onClick={onClose} className="p-3 hover:bg-rose-50 text-slate-400 hover:text-rose-500 rounded-2xl transition-all border-2 border-transparent hover:border-rose-100">
            <X className="w-6 h-6" />
          </button>
        </div>

        <div className="p-8 space-y-8">
           <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-2">
                 <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest flex items-center gap-2">
                   <Contact className="w-3 h-3 text-emerald-500" /> Full Name
                 </label>
                 <input 
                    required
                    value={formData.name}
                    onChange={e => setFormData({...formData, name: e.target.value})}
                    placeholder="Enter full name" 
                    className="w-full px-4 py-3 bg-slate-50 border-2 border-slate-100 rounded-xl outline-none focus:border-emerald-500 transition-all font-bold text-sm"
                 />
              </div>
              <div className="space-y-2">
                 <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest flex items-center gap-2">
                   <Briefcase className="w-3 h-3 text-emerald-500" /> Occupation
                 </label>
                 <input 
                    required
                    value={formData.occupation}
                    onChange={e => setFormData({...formData, occupation: e.target.value})}
                    placeholder="e.g. Businessman" 
                    className="w-full px-4 py-3 bg-slate-50 border-2 border-slate-100 rounded-xl outline-none focus:border-emerald-500 transition-all font-bold text-sm"
                 />
              </div>
              <div className="space-y-2">
                 <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest flex items-center gap-2">
                   <Phone className="w-3 h-3 text-emerald-500" /> Phone Number
                 </label>
                 <input 
                    required
                    value={formData.phone}
                    onChange={e => setFormData({...formData, phone: e.target.value})}
                    placeholder="017xxxxxxxx" 
                    className="w-full px-4 py-3 bg-slate-50 border-2 border-slate-100 rounded-xl outline-none focus:border-emerald-500 transition-all font-bold text-sm"
                 />
              </div>
              <div className="space-y-2">
                 <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest flex items-center gap-2">
                   <Mail className="w-3 h-3 text-emerald-500" /> Email Address
                 </label>
                 <input 
                    type="email"
                    required
                    value={formData.email}
                    onChange={e => setFormData({...formData, email: e.target.value})}
                    placeholder="example@mail.com" 
                    className="w-full px-4 py-3 bg-slate-50 border-2 border-slate-100 rounded-xl outline-none focus:border-emerald-500 transition-all font-bold text-sm"
                 />
              </div>
              <div className="space-y-2 md:col-span-2">
                 <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest flex items-center gap-2">
                   <MapPin className="w-3 h-3 text-emerald-500" /> Residential Address
                 </label>
                 <input 
                    required
                    value={formData.address}
                    onChange={e => setFormData({...formData, address: e.target.value})}
                    placeholder="Sector, Area, City" 
                    className="w-full px-4 py-3 bg-slate-50 border-2 border-slate-100 rounded-xl outline-none focus:border-emerald-500 transition-all font-bold text-sm"
                 />
              </div>
           </div>
           
           <div className="bg-amber-50 border-2 border-amber-100 rounded-2xl p-4 flex gap-3">
              <AlertTriangle className="w-5 h-5 text-amber-500 shrink-0 mt-0.5" />
              <div>
                 <p className="text-xs font-black text-amber-800 uppercase tracking-tight mb-1">Information Security</p>
                 <p className="text-[11px] font-bold text-amber-700 leading-relaxed">Guardian contact details are used for sensitive system communications and authentication. Ensure all data is verified before saving.</p>
              </div>
           </div>
        </div>

        <div className="p-8 border-t-2 border-slate-50 flex items-center justify-end gap-3 bg-slate-50/50">
           <button type="button" onClick={onClose} className="px-8 py-3 bg-white text-slate-600 font-bold rounded-2xl border-2 border-slate-100 hover:bg-slate-50 transition-all">Cancel Operation</button>
           <button type="submit" className="px-10 py-3 bg-[#00bd7f] text-white font-black rounded-2xl shadow-xl shadow-emerald-500/20 hover:scale-[1.02] active:scale-95 transition-all flex items-center gap-2">
              <FileText className="w-4 h-4" />
              Save Parent Data
           </button>
        </div>
      </form>
    </div>
  );
};

const ParentViewModal = ({ parent, onClose }) => {
  // Mock Linked Students for the view
  const linkedStudents = [
    { id: "MMS2025001", name: "আব্দুর রহমান", class: "Hifz Section", roll: "01", photo: "https://api.dicebear.com/7.x/avataaars/svg?seed=ST1" },
    { id: "MMS2025042", name: "ফাতিমা আক্তার", class: "Ibtidaiya", roll: "12", photo: "https://api.dicebear.com/7.x/avataaars/svg?seed=ST2" },
  ].slice(0, parent.childrenCount || 1);

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
                 <img src={parent.photo} alt={parent.name} className="w-full h-full object-cover" />
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
              <span className={`inline-flex items-center gap-1.5 px-4 py-2 rounded-xl text-xs font-black uppercase tracking-widest border-2 ${
                parent.status === 'active' 
                  ? 'bg-emerald-50 text-emerald-700 border-emerald-100' 
                  : 'bg-rose-50 text-rose-700 border-rose-100'
              }`}>
                {parent.status} Portal
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
                 <h4 className="text-[10px] font-black text-slate-400 uppercase tracking-[0.2em]">Primary Residence</h4>
                 <div className="flex items-start gap-4 p-4 bg-slate-50 rounded-2xl group hover:bg-emerald-50/30 transition-all border-2 border-transparent hover:border-emerald-100">
                    <div className="w-10 h-10 bg-white rounded-xl flex items-center justify-center shrink-0 shadow-sm transition-transform">
                       <MapPin className="w-4 h-4 text-emerald-600" />
                    </div>
                    <p className="text-sm font-bold text-slate-600 leading-relaxed">{parent.address}</p>
                 </div>
              </div>
           </div>

           {/* Linked Students Section */}
           <div className="space-y-4 pt-6 border-t-2 border-slate-50">
              <h4 className="text-[10px] font-black text-slate-400 uppercase tracking-[0.2em] flex items-center gap-2">
                 <Users className="w-3.5 h-3.5 text-emerald-500" /> Associated Students ({parent.childrenCount})
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
                          <p className="text-[10px] font-bold text-emerald-600">{student.class} • Roll {student.roll}</p>
                       </div>
                    </div>
                 ))}
                 {parent.childrenCount === 0 && (
                   <p className="text-xs font-bold text-slate-400 italic py-2">No linked student records found.</p>
                 )}
              </div>
           </div>
        </div>

        <div className="p-8 bg-slate-50/50 border-t-2 border-slate-50 flex gap-4">
           <button onClick={() => alert('Opening bulk SMS gate...')} className="flex-1 py-4 bg-emerald-600 text-white font-black rounded-[1.5rem] shadow-xl shadow-emerald-200 flex items-center justify-center gap-2 hover:bg-emerald-700 transition-all">
              <MessageCircle className="w-4 h-4" /> Message Guardian
           </button>
           <button onClick={onClose} className="px-10 py-4 bg-white text-slate-600 font-bold rounded-[1.5rem] border-2 border-slate-200 hover:bg-slate-50 transition-all">Close</button>
        </div>
      </div>
    </div>
  );
};

export default ParentList;
