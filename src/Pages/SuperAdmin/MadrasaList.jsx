import { useState, useEffect } from "react";
import { Search, Filter, MoreHorizontal, Eye, Edit, Trash2, ShieldCheck, ShieldAlert, Plus } from "lucide-react";
import AddMadrasaModal from "../../components/AddMadrasaModal";
import ViewMadrasaModal from "../../components/ViewMadrasaModal";
import EditMadrasaModal from "../../components/EditMadrasaModal";
import ChangeStatusModal from "../../components/ChangeStatusModal";
import DeleteConfirmationModal from "../../components/DeleteConfirmationModal";
import adminService from "../../services/adminService";
import toast from "react-hot-toast";

const MadrasaList = () => {
  const [allMadrasas, setAllMadrasas] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState("All");
  const [isModalOpen, setIsModalOpen] = useState(false);
  
  // CRUD States
  const [selectedMadrasa, setSelectedMadrasa] = useState(null);
  const [isViewOpen, setIsViewOpen] = useState(false);
  const [isEditOpen, setIsEditOpen] = useState(false);
  const [isChangeStatusOpen, setIsChangeStatusOpen] = useState(false);
  const [isDeleteOpen, setIsDeleteOpen] = useState(false);
  
  // Dropdown State
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
      const data = await adminService.getMadrasas();
      setAllMadrasas(data.data || []);
    } catch (err) {
      console.error("Failed to fetch madrasas", err);
    } finally {
      setLoading(false);
    }
  };

  // Filter Logic
  const filteredMadrasas = allMadrasas.filter(madrasa => {
    const matchesSearch = (madrasa.name?.toLowerCase().includes(searchTerm.toLowerCase())) || 
                           (madrasa.admin?.toLowerCase().includes(searchTerm.toLowerCase()));
    const matchesStatus = statusFilter === "All" || madrasa.status === statusFilter;
    return matchesSearch && matchesStatus;
  });

  return (
    <div className="space-y-6 animate-fade-in">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Madrasa Management</h1>
          <p className="text-gray-500 text-sm">View and manage all registered tenants.</p>
        </div>
        <div className="flex flex-wrap gap-3">
             <button 
                onClick={() => setIsModalOpen(true)}
                className="bg-primary hover:bg-primary-dark text-white px-5 py-2.5 rounded-xl font-medium shadow-lg shadow-primary/25 flex items-center gap-2 transition-all active:scale-95 cursor-pointer"
             >
                <Plus className="w-5 h-5" />
                Add New Madrasa
            </button>
             <div className="relative">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                <input 
                    type="text" 
                    placeholder="Search madrasas..." 
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="pl-9 pr-4 py-2.5 rounded-xl border border-gray-200 bg-white outline-none focus:border-primary focus:ring-2 focus:ring-primary/20 w-full sm:w-64 shadow-sm"
                />
            </div>
            <select 
                value={statusFilter}
                onChange={(e) => setStatusFilter(e.target.value)}
                className="px-4 py-2.5 rounded-xl border border-gray-200 bg-white outline-none focus:border-primary focus:ring-2 focus:ring-primary/20 shadow-sm cursor-pointer"
            >
                <option value="All">All Status</option>
                <option value="Active">Active</option>
                <option value="Pending">Pending</option>
                <option value="Suspended">Suspended</option>
            </select>
        </div>
      </div>

      {/* Table Card */}
      <div className="bg-white border border-gray-100 rounded-2xl shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gray-50/50 border-b border-gray-100">
              <tr>
                <th className="text-left py-4 px-6 text-xs font-semibold text-gray-500 uppercase tracking-wider">Madrasa Info</th>
                <th className="text-left py-4 px-6 text-xs font-semibold text-gray-500 uppercase tracking-wider">Admin & Contact</th>
                <th className="text-left py-4 px-6 text-xs font-semibold text-gray-500 uppercase tracking-wider">Plan</th>
                <th className="text-center py-4 px-6 text-xs font-semibold text-gray-500 uppercase tracking-wider">Status</th>
                <th className="text-right py-4 px-6 text-xs font-semibold text-gray-500 uppercase tracking-wider">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-50">
               {filteredMadrasas.map((item) => {
                 const studentLimit = item.subscription?.studentLimit || 150;
                 return (
                   <tr key={item._id || item.id} className="hover:bg-gray-50/50 transition-colors group">
                     <td className="py-4 px-6">
                       <div>
                           <p className="font-semibold text-gray-900">{item.name}</p>
                           <p className="text-xs text-gray-500 flex items-center gap-1">
                               <span className="w-1.5 h-1.5 rounded-full bg-gray-300"></span>
                               {item.location} • <span className="font-semibold text-gray-700">{item.students} / {studentLimit}</span> Students
                           </p>
                       </div>
                     </td>
                     <td className="py-4 px-6">
                       <div>
                           <p className="text-sm font-medium text-gray-800">{item.admin}</p>
                           <p className="text-xs text-gray-500">{item.phone}</p>
                       </div>
                     </td>
                     <td className="py-4 px-6">
                       <span className={`inline-block px-2.5 py-1 rounded-lg text-xs font-bold ${
                           item.plan === 'Premium' ? 'bg-purple-50 text-purple-700 border border-purple-100' :
                           item.plan === 'Standard' ? 'bg-blue-50 text-blue-700 border border-blue-100' :
                           'bg-gray-100 text-gray-600 border border-gray-200'
                       }`}>
                           {item.plan}
                       </span>
                     </td>
                     <td className="py-4 px-6 text-center">
                       <span className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold border ${
                           item.status === 'Active' ? 'bg-emerald-50 text-emerald-700 border-emerald-100' :
                           item.status === 'Suspended' ? 'bg-amber-50 text-amber-700 border-amber-100' :
                           'bg-rose-50 text-rose-700 border-rose-100'
                       }`}>
                            {item.status === 'Active' && <ShieldCheck className="w-3 h-3" />}
                            {item.status === 'Suspended' && <ShieldAlert className="w-3 h-3" />}
                            {item.status === 'Blocked' && <ShieldAlert className="w-3 h-3" />}
                           {item.status}
                       </span>
                     </td>
                  <td className="py-4 px-6 text-right relative">
                    <button 
                        onClick={(e) => {
                            e.stopPropagation();
                            setOpenDropdownId(openDropdownId === (item._id || item.id) ? null : (item._id || item.id));
                        }}
                        className="p-2 text-gray-400 hover:text-gray-600 hover:bg-gray-100 rounded-lg transition-colors cursor-pointer" 
                        title="More Options">
                        <MoreHorizontal className="w-5 h-5" />
                    </button>
                    
                    {openDropdownId === (item._id || item.id) && (
                        <div className="absolute right-8 top-12 w-48 bg-white rounded-xl shadow-xl border border-gray-100 z-50 py-2 animate-in fade-in zoom-in-95 text-left">
                            <button 
                                onClick={(e) => { e.stopPropagation(); setSelectedMadrasa(item); setIsViewOpen(true); setOpenDropdownId(null); }}
                                className="w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-50 hover:text-blue-600 flex items-center gap-2 cursor-pointer"
                            >
                                <Eye className="w-4 h-4" /> View Details
                            </button>
                            <button 
                                onClick={(e) => { e.stopPropagation(); setSelectedMadrasa(item); setIsEditOpen(true); setOpenDropdownId(null); }}
                                className="w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-50 hover:text-amber-600 flex items-center gap-2 cursor-pointer"
                            >
                                <Edit className="w-4 h-4" /> Edit Info
                            </button>
                            <button 
                                onClick={(e) => { e.stopPropagation(); setSelectedMadrasa(item); setIsChangeStatusOpen(true); setOpenDropdownId(null); }}
                                className="w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-50 hover:text-emerald-600 flex items-center gap-2 cursor-pointer"
                            >
                                <ShieldAlert className="w-4 h-4" /> Change Status
                            </button>
                            <div className="border-t border-gray-100 my-1"></div>
                            <button 
                                onClick={(e) => { e.stopPropagation(); setSelectedMadrasa(item); setIsDeleteOpen(true); setOpenDropdownId(null); }}
                                className="w-full text-left px-4 py-2 text-sm text-rose-600 hover:bg-rose-50 flex items-center gap-2 cursor-pointer"
                            >
                                <Trash2 className="w-4 h-4" /> Delete
                            </button>
                        </div>
                    )}
                  </td>
                </tr>
                 );
               })}
            </tbody>
          </table>
        </div>
         {filteredMadrasas.length === 0 && (
            <div className="p-10 text-center text-gray-500">
                No madrasas found matching your filters.
            </div>
        )}
      </div>
      
      {/* Modals */}
      <AddMadrasaModal 
        isOpen={isModalOpen} 
        onClose={() => {
          setIsModalOpen(false);
          fetchMadrasas();
        }} 
      />
      
      <ViewMadrasaModal 
        isOpen={isViewOpen} 
        onClose={() => setIsViewOpen(false)} 
        madrasa={selectedMadrasa} 
      />

      <EditMadrasaModal 
        isOpen={isEditOpen} 
        onClose={() => {
          setIsEditOpen(false);
          fetchMadrasas();
        }} 
        madrasa={selectedMadrasa} 
      />

      <ChangeStatusModal 
        isOpen={isChangeStatusOpen}
        onClose={() => {
          setIsChangeStatusOpen(false);
          fetchMadrasas();
        }}
        madrasa={selectedMadrasa}
      />

      <DeleteConfirmationModal
        isOpen={isDeleteOpen}
        onClose={() => setIsDeleteOpen(false)}
        onDelete={async () => {
            try {
                await adminService.deleteMadrasa(selectedMadrasa._id);
               toast.success('Madrasa deleted successfully!')
                fetchMadrasas();
            } catch (err) {
                toast.error(err.response?.data?.message || "Failed to delete madrasa.");
            }
        }}
        itemName={selectedMadrasa?.name}
      />
    </div>
  );
};

export default MadrasaList;
