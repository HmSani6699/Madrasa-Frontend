import { useState } from "react";
import { 
  Truck, 
  Search, 
  Plus, 
  MoreVertical, 
  Edit3, 
  Trash2, 
  Phone, 
  Mail, 
  User, 
  Globe,
  PlusCircle,
  Building
} from "lucide-react";

const SupplierList = () => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [suppliers] = useState([
    { id: 1, name: "Ideal Publications", contactPerson: "Mr. Zahid", phone: "+880 1700-112233", email: "info@idealpub.com", address: "Motijheel, Dhaka", status: "active" },
    { id: 2, name: "Rainbow Electronics", contactPerson: "Hassan Ali", phone: "+880 1811-223344", email: "sales@rainbow.com", address: "Multi-plan Center, Dhaka", status: "active" },
    { id: 3, name: "Uniform World", contactPerson: "Amina Begum", phone: "+880 1922-334455", email: "contact@uniformworld.com", address: "Mirpur, Dhaka", status: "inactive" },
  ]);

  return (
    <div className="min-h-screen bg-slate-50/50 p-4 md:p-8 animate-in fade-in duration-500">
      <div className="max-w-[1600px] mx-auto space-y-8">
        
        {/* Header Section */}
        <div className="bg-white rounded-[2.5rem] border border-slate-200 p-8 shadow-sm flex flex-col lg:flex-row justify-between items-center gap-6">
          <div className="flex items-center gap-6">
            <div className="w-16 h-16 bg-amber-50 rounded-2xl flex items-center justify-center border border-amber-100 shadow-inner">
              <Truck className="w-8 h-8 text-amber-600" />
            </div>
            <div>
              <h1 className="text-2xl md:text-3xl font-black text-slate-800 tracking-tight">Suppliers & Vendors</h1>
              <p className="text-slate-500 font-bold mt-1">Manage institutional procurement partners and vendor profiles</p>
            </div>
          </div>

          <button 
            onClick={() => setIsModalOpen(true)}
            className="w-full lg:w-auto px-8 py-4 bg-amber-600 text-white rounded-2xl font-black shadow-xl shadow-amber-100 hover:bg-amber-700 hover:scale-[1.02] active:scale-95 transition-all flex items-center justify-center gap-3"
          >
            <Plus className="w-5 h-5" />
            Add New Supplier
          </button>
        </div>

        {/* Search Bar */}
        <div className="relative">
          <Search className="absolute left-6 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400" />
          <input 
            type="text"
            placeholder="Search suppliers by name, email or phone..."
            className="w-full bg-white border border-slate-200 rounded-2xl pl-14 pr-6 py-4 text-sm font-bold focus:border-amber-500 outline-none shadow-sm transition-all"
          />
        </div>

        {/* Suppliers List */}
        <div className="bg-white rounded-[2.5rem] border border-slate-200 shadow-sm overflow-hidden">
           <div className="overflow-x-auto">
              <table className="w-full border-collapse">
                <thead>
                  <tr className="border-b border-slate-50 bg-slate-50/50">
                    <th className="px-8 py-6 text-left text-[10px] font-black text-slate-400 uppercase tracking-widest">Supplier Name</th>
                    <th className="px-8 py-6 text-left text-[10px] font-black text-slate-400 uppercase tracking-widest">Contact Person</th>
                    <th className="px-8 py-6 text-left text-[10px] font-black text-slate-400 uppercase tracking-widest">Contact Details</th>
                    <th className="px-8 py-6 text-center text-[10px] font-black text-slate-400 uppercase tracking-widest">Status</th>
                    <th className="px-8 py-6 text-right text-[10px] font-black text-slate-400 uppercase tracking-widest">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-50">
                  {suppliers.map((sup) => (
                    <tr key={sup.id} className="group hover:bg-slate-50/50 transition-all duration-300">
                      <td className="px-8 py-6">
                        <div className="flex items-center gap-4">
                          <div className="w-12 h-12 bg-slate-100 rounded-2xl flex items-center justify-center border-2 border-white shadow-sm overflow-hidden group-hover:scale-110 transition-transform">
                             <Building className="w-6 h-6 text-slate-300" />
                          </div>
                          <div>
                            <p className="text-sm font-black text-slate-800 group-hover:text-amber-600 transition-colors uppercase tracking-tight">{sup.name}</p>
                            <p className="text-[11px] font-bold text-slate-400">{sup.address}</p>
                          </div>
                        </div>
                      </td>
                      <td className="px-8 py-6">
                         <div className="flex items-center gap-3">
                            <div className="w-8 h-8 bg-slate-50 rounded-full flex items-center justify-center border border-slate-100">
                               <User className="w-4 h-4 text-slate-400" />
                            </div>
                            <span className="text-sm font-bold text-slate-600">{sup.contactPerson}</span>
                         </div>
                      </td>
                      <td className="px-8 py-6">
                         <div className="space-y-1">
                            <div className="flex items-center gap-2 text-[11px] font-bold text-slate-500">
                               <Phone className="w-3.5 h-3.5 text-slate-300" /> {sup.phone}
                            </div>
                            <div className="flex items-center gap-2 text-[11px] font-bold text-slate-500">
                               <Mail className="w-3.5 h-3.5 text-slate-300" /> {sup.email}
                            </div>
                         </div>
                      </td>
                      <td className="px-8 py-6 text-center">
                         <span className={`px-4 py-1.5 rounded-full text-[10px] font-black uppercase tracking-widest border ${
                           sup.status === 'active' ? 'bg-emerald-50 text-emerald-600 border-emerald-100' : 'bg-slate-50 text-slate-400 border-slate-100'
                         }`}>
                           {sup.status}
                         </span>
                      </td>
                      <td className="px-8 py-6 text-right">
                        <div className="flex items-center justify-end gap-3 opacity-0 group-hover:opacity-100 transition-all">
                          <button className="p-2.5 bg-white border border-slate-200 rounded-xl text-slate-400 hover:text-amber-600 hover:border-amber-200 shadow-sm transition-all">
                            <Edit3 className="w-4 h-4" />
                          </button>
                          <button className="p-2.5 bg-rose-50 border border-rose-100 rounded-xl text-rose-400 hover:text-rose-600 hover:bg-rose-100 shadow-sm transition-all">
                            <Trash2 className="w-4 h-4" />
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
           </div>
        </div>

      </div>

      {/* Creation Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 bg-slate-900/40 backdrop-blur-md z-[100] flex items-center justify-center p-4">
          <div className="bg-white rounded-[3rem] w-full max-w-2xl shadow-2xl animate-in zoom-in duration-300 overflow-hidden">
             <div className="p-10 border-b border-slate-50 flex items-center justify-between">
                <div className="flex items-center gap-4">
                   <div className="w-12 h-12 bg-amber-50 rounded-2xl flex items-center justify-center border border-amber-100">
                      <Truck className="w-6 h-6 text-amber-600" />
                   </div>
                   <h2 className="text-3xl font-black text-slate-800 tracking-tight">New Supplier Profile</h2>
                </div>
                <button onClick={() => setIsModalOpen(false)} className="p-3 hover:bg-slate-100 rounded-2xl transition-all">
                  <Plus className="w-8 h-8 text-slate-300 rotate-45" />
                </button>
             </div>
             <div className="p-10 space-y-6">
                <div className="grid grid-cols-2 gap-6">
                   <div className="space-y-3">
                      <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Business Name</label>
                      <input className="w-full bg-slate-50 border border-slate-100 rounded-2xl px-6 py-4 text-sm font-bold focus:border-amber-500 outline-none transition-all" placeholder="e.g. Acme Supplies Ltd" />
                   </div>
                   <div className="space-y-3">
                      <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Contact Person</label>
                      <input className="w-full bg-slate-50 border border-slate-100 rounded-2xl px-6 py-4 text-sm font-bold focus:border-amber-500 outline-none transition-all" />
                   </div>
                </div>
                <div className="grid grid-cols-2 gap-6">
                   <div className="space-y-3">
                      <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Phone Number</label>
                      <input className="w-full bg-slate-50 border border-slate-100 rounded-2xl px-6 py-4 text-sm font-bold focus:border-amber-500 outline-none transition-all" />
                   </div>
                   <div className="space-y-3">
                      <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Email Address</label>
                      <input type="email" className="w-full bg-slate-50 border border-slate-100 rounded-2xl px-6 py-4 text-sm font-bold focus:border-amber-500 outline-none transition-all" />
                   </div>
                </div>
                <div className="space-y-3">
                   <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Business Address</label>
                   <textarea rows="3" className="w-full bg-slate-50 border border-slate-100 rounded-2xl px-6 py-4 text-sm font-bold focus:border-amber-500 outline-none transition-all resize-none"></textarea>
                </div>

                <div className="pt-6 flex gap-6">
                   <button onClick={() => setIsModalOpen(false)} className="flex-1 py-4 text-slate-400 font-black hover:text-slate-600 transition-all">Discard</button>
                   <button onClick={() => setIsModalOpen(false)} className="flex-1 py-4 bg-amber-600 text-white font-black rounded-2xl shadow-xl shadow-amber-100 hover:bg-amber-700 transition-all">Save Supplier</button>
                </div>
             </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default SupplierList;
