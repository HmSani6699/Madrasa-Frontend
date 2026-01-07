import { useState } from "react";
import { Search, Filter, MoreHorizontal, Eye, Edit, Trash2, ShieldCheck, ShieldAlert, Plus } from "lucide-react";
import AddMadrasaModal from "../../components/AddMadrasaModal";
import ViewMadrasaModal from "../../components/ViewMadrasaModal";
import EditMadrasaModal from "../../components/EditMadrasaModal";
import DeleteConfirmationModal from "../../components/DeleteConfirmationModal";

// Mock Data
const allMadrasas = [
  { id: 1, name: "Jamia Islamia Dhaka", address: "Mirpur-10, Dhaka", admin: "Mufti Rahman", email: "info@jamia.com", phone: "+8801711223344", students: 1250, status: "Active", plan: "Premium", location: "Dhaka" },
  { id: 2, name: "Darul Uloom Chittagong", address: "Hathazari, Chittagong", admin: "Moulana Ahmed", email: "contact@darululoom.com", phone: "+8801811223344", students: 850, status: "Active", plan: "Standard", location: "Chittagong" },
  { id: 3, name: "Madrasa Ayesha Siddiqa", address: "Zindabazar, Sylhet", admin: "Hafiz Karim", email: "admin@ayesha.com", phone: "+8801911223344", students: 320, status: "Pending", plan: "Basic", location: "Sylhet" },
  { id: 4, name: "Al-Huda Institute", address: "Boalia, Rajshahi", admin: "Mufti Solaiman", email: "support@alhuda.com", phone: "+8801611223344", students: 450, status: "Active", plan: "Standard", location: "Rajshahi" },
  { id: 5, name: "Nurul Quran Academy", address: "Mohammadpur, Dhaka", admin: "Moulana Yusuf", email: "info@nurulquran.com", phone: "+8801511223344", students: 120, status: "Suspended", plan: "Basic", location: "Dhaka" },
  { id: 6, name: "Tamirul Millat", address: "Jatrabari, Dhaka", admin: "Dr. Abu Bakr", email: "admin@tamirul.com", phone: "+8801311223344", students: 2500, status: "Active", plan: "Premium", location: "Dhaka" },
  { id: 7, name: "Jamia Hussainia", address: "Kandirpar, Comilla", admin: "Mufti Ilyas", email: "contact@hussainia.com", phone: "+8801411223344", students: 600, status: "Active", plan: "Standard", location: "Comilla" },
];

const MadrasaList = () => {
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState("All");
  const [isModalOpen, setIsModalOpen] = useState(false);
  
  // CRUD States
  const [selectedMadrasa, setSelectedMadrasa] = useState(null);
  const [isViewOpen, setIsViewOpen] = useState(false);
  const [isEditOpen, setIsEditOpen] = useState(false);
  const [isDeleteOpen, setIsDeleteOpen] = useState(false);

  // Filter Logic
  const filteredMadrasas = allMadrasas.filter(madrasa => {
    const matchesSearch = madrasa.name.toLowerCase().includes(searchTerm.toLowerCase()) || 
                          madrasa.admin.toLowerCase().includes(searchTerm.toLowerCase());
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
              {filteredMadrasas.map((item) => (
                <tr key={item.id} className="hover:bg-gray-50/50 transition-colors group">
                  <td className="py-4 px-6">
                    <div>
                        <p className="font-semibold text-gray-900">{item.name}</p>
                        <p className="text-xs text-gray-500 flex items-center gap-1">
                            <span className="w-1.5 h-1.5 rounded-full bg-gray-300"></span>
                            {item.location} • {item.students} Students
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
                    <span className={`inline-block px-2 py-1 rounded text-xs font-bold ${
                        item.plan === 'Premium' ? 'bg-purple-50 text-purple-700 border border-purple-100' :
                        item.plan === 'Standard' ? 'bg-blue-50 text-blue-700 border border-blue-100' :
                        'bg-gray-100 text-gray-600 border border-gray-200'
                    }`}>
                        {item.plan}
                    </span>
                  </td>
                  <td className="py-4 px-6 text-center">
                    <span className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-medium border ${
                        item.status === 'Active' ? 'bg-emerald-50 text-emerald-700 border-emerald-100' :
                        item.status === 'Pending' ? 'bg-amber-50 text-amber-700 border-amber-100' :
                        'bg-rose-50 text-rose-700 border-rose-100'
                    }`}>
                         {item.status === 'Active' && <ShieldCheck className="w-3 h-3" />}
                         {item.status === 'Suspended' && <ShieldAlert className="w-3 h-3" />}
                        {item.status}
                    </span>
                  </td>
                  <td className="py-4 px-6 text-right">
                    <div className="flex items-center justify-end gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                        <button 
                            onClick={() => { setSelectedMadrasa(item); setIsViewOpen(true); }}
                            className="p-2 text-gray-400 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition-colors" 
                            title="View Details">
                            <Eye className="w-4 h-4" />
                        </button>
                         <button 
                            onClick={() => { setSelectedMadrasa(item); setIsEditOpen(true); }}
                            className="p-2 text-gray-400 hover:text-amber-600 hover:bg-amber-50 rounded-lg transition-colors" 
                            title="Edit">
                            <Edit className="w-4 h-4" />
                        </button>
                         <button 
                            onClick={() => { setSelectedMadrasa(item); setIsDeleteOpen(true); }}
                            className="p-2 text-gray-400 hover:text-rose-600 hover:bg-rose-50 rounded-lg transition-colors" 
                            title="Delete">
                            <Trash2 className="w-4 h-4" />
                        </button>
                    </div>
                  </td>
                </tr>
              ))}
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
      <AddMadrasaModal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} />
      
      <ViewMadrasaModal 
        isOpen={isViewOpen} 
        onClose={() => setIsViewOpen(false)} 
        madrasa={selectedMadrasa} 
      />

      <EditMadrasaModal 
        isOpen={isEditOpen} 
        onClose={() => setIsEditOpen(false)} 
        madrasa={selectedMadrasa} 
      />

      <DeleteConfirmationModal
        isOpen={isDeleteOpen}
        onClose={() => setIsDeleteOpen(false)}
        onDelete={() => {
            // Mock Deletion logic
            return new Promise(resolve => setTimeout(resolve, 1000));
        }}
        itemName={selectedMadrasa?.name}
      />
    </div>
  );
};

export default MadrasaList;
