import { useState } from "react";
import { 
  Home, 
  Search, 
  Plus, 
  MoreVertical, 
  Edit3, 
  Trash2, 
  MapPin, 
  User, 
  Phone,
  BarChart,
  PlusCircle
} from "lucide-react";

const StoreList = () => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [stores] = useState([
    { id: 1, name: "Main Warehouse", location: "Ground Floor, Sector A", contactPerson: "Hafiz Ibrahim", phone: "+880 1711-223344", capacity: "High" },
    { id: 2, name: "Stationery Room", location: "Admin Block, 1st Floor", contactPerson: "Sarah Khan", phone: "+880 1822-334455", capacity: "Medium" },
    { id: 3, name: "Boys Hostel Store", location: "Hostel Building, Basement", contactPerson: "Zubair Ahmed", phone: "+880 1933-445566", capacity: "Medium" },
  ]);

  return (
    <div className="min-h-screen bg-slate-50/50 p-4 md:p-8 animate-in fade-in duration-500">
      <div className="max-w-[1600px] mx-auto space-y-8">
        
        {/* Header Section */}
        <div className="bg-white rounded-[2.5rem] border border-slate-200 p-8 shadow-sm flex flex-col lg:flex-row justify-between items-center gap-6">
          <div className="flex items-center gap-6">
            <div className="w-16 h-16 bg-blue-50 rounded-2xl flex items-center justify-center border border-blue-100 shadow-inner">
              <Home className="w-8 h-8 text-blue-600" />
            </div>
            <div>
              <h1 className="text-2xl md:text-3xl font-black text-slate-800 tracking-tight">Inventory Stores</h1>
              <p className="text-slate-500 font-bold mt-1">Manage physical storage locations and warehouse staff</p>
            </div>
          </div>

          <button 
            onClick={() => setIsModalOpen(true)}
            className="w-full lg:w-auto px-8 py-4 bg-blue-600 text-white rounded-2xl font-black shadow-xl shadow-blue-100 hover:bg-blue-700 hover:scale-[1.02] active:scale-95 transition-all flex items-center justify-center gap-3"
          >
            <Plus className="w-5 h-5" />
            Add New Store
          </button>
        </div>

        {/* Search Bar */}
        <div className="relative">
          <Search className="absolute left-6 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400" />
          <input 
            type="text"
            placeholder="Search stores by name or location..."
            className="w-full bg-white border border-slate-200 rounded-2xl pl-14 pr-6 py-4 text-sm font-bold focus:border-blue-500 outline-none shadow-sm transition-all"
          />
        </div>

        {/* Stores Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {stores.map((store) => (
            <div key={store.id} className="group bg-white rounded-[2.5rem] border border-slate-200 shadow-sm hover:shadow-2xl hover:border-blue-200 transition-all duration-500 flex flex-col">
              <div className="p-8 flex-1">
                <div className="flex justify-between items-start mb-6">
                  <div className="w-12 h-12 bg-slate-50 rounded-2xl flex items-center justify-center border border-slate-100 group-hover:bg-blue-50 group-hover:border-blue-100 transition-colors">
                    <Home className="w-6 h-6 text-slate-400 group-hover:text-blue-600" />
                  </div>
                  <button className="p-2 hover:bg-slate-50 rounded-xl text-slate-300 hover:text-slate-600 transition-all">
                    <MoreVertical className="w-5 h-5" />
                  </button>
                </div>

                <h3 className="text-xl font-black text-slate-800 tracking-tight group-hover:text-blue-600 transition-colors uppercase tracking-tight">{store.name}</h3>
                
                <div className="mt-6 space-y-4">
                   <div className="flex items-center gap-3 text-slate-500">
                      <MapPin className="w-4 h-4 text-slate-300" />
                      <span className="text-sm font-bold">{store.location}</span>
                   </div>
                   <div className="flex items-center gap-3 text-slate-500">
                      <User className="w-4 h-4 text-slate-300" />
                      <span className="text-sm font-bold">{store.contactPerson}</span>
                   </div>
                   <div className="flex items-center gap-3 text-slate-500">
                      <Phone className="w-4 h-4 text-slate-300" />
                      <span className="text-sm font-bold">{store.phone}</span>
                   </div>
                </div>

                <div className="mt-8 flex items-center justify-between p-4 bg-slate-50 rounded-2xl group-hover:bg-blue-50/50 transition-colors">
                  <div className="flex flex-col">
                    <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Capacity Level</span>
                    <span className={`text-lg font-black ${store.capacity === 'High' ? 'text-emerald-600' : 'text-amber-600'}`}>{store.capacity}</span>
                  </div>
                  <div className="w-10 h-10 bg-white rounded-xl flex items-center justify-center border border-slate-100 group-hover:border-blue-200 shadow-sm">
                    <BarChart className="w-5 h-5 text-slate-300 group-hover:text-blue-600" />
                  </div>
                </div>
              </div>

              <div className="p-6 bg-slate-50/50 border-t border-slate-100 rounded-b-[2.5rem] flex gap-3">
                 <button className="flex-1 py-3.5 bg-white border border-slate-200 text-slate-600 rounded-2xl text-[10px] font-black uppercase tracking-widest hover:border-blue-200 hover:text-blue-600 transition-all flex items-center justify-center gap-2">
                   <Edit3 className="w-4 h-4" /> Edit Details
                 </button>
                 <button className="p-3.5 bg-rose-50 border border-rose-100 text-rose-400 rounded-2xl hover:bg-rose-100 hover:text-rose-600 transition-all">
                   <Trash2 className="w-4 h-4" />
                 </button>
              </div>
            </div>
          ))}

          {/* Add Store Card */}
          <button 
            onClick={() => setIsModalOpen(true)}
            className="group bg-blue-50/20 rounded-[2.5rem] border-4 border-dashed border-blue-100 flex flex-col items-center justify-center p-12 hover:border-blue-300 hover:bg-blue-50/50 transition-all min-h-[350px]"
          >
            <div className="w-16 h-16 bg-white rounded-2xl flex items-center justify-center shadow-lg group-hover:scale-110 group-hover:bg-blue-600 transition-all mb-4">
              <PlusCircle className="w-8 h-8 text-blue-300 group-hover:text-white" />
            </div>
            <p className="text-lg font-black text-blue-400 group-hover:text-blue-600 uppercase tracking-tight">Add New Store</p>
          </button>
        </div>

      </div>

      {/* Creation Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 bg-slate-900/40 backdrop-blur-md z-[100] flex items-center justify-center p-4">
          <div className="bg-white rounded-[3rem] w-full max-w-xl shadow-2xl animate-in zoom-in duration-300 overflow-hidden">
             <div className="p-10 border-b border-slate-50 flex items-center justify-between">
                <div className="flex items-center gap-4">
                   <div className="w-12 h-12 bg-blue-50 rounded-2xl flex items-center justify-center border border-blue-100">
                      <Home className="w-6 h-6 text-blue-600" />
                   </div>
                   <h2 className="text-3xl font-black text-slate-800 tracking-tight">New Store Location</h2>
                </div>
                <button onClick={() => setIsModalOpen(false)} className="p-3 hover:bg-slate-100 rounded-2xl transition-all">
                  <Plus className="w-8 h-8 text-slate-300 rotate-45" />
                </button>
             </div>
             <div className="p-10 space-y-6">
                <div className="space-y-3">
                   <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Store Name</label>
                   <input className="w-full bg-slate-50 border border-slate-100 rounded-2xl px-6 py-4 text-sm font-bold focus:border-blue-500 outline-none transition-all" placeholder="e.g. Science Lab Store" />
                </div>
                <div className="space-y-3">
                   <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Location / Address</label>
                   <input className="w-full bg-slate-50 border border-slate-100 rounded-2xl px-6 py-4 text-sm font-bold focus:border-blue-500 outline-none transition-all" placeholder="e.g. Block C, Room 204" />
                </div>
                <div className="grid grid-cols-2 gap-6">
                   <div className="space-y-3">
                      <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Contact Person</label>
                      <input className="w-full bg-slate-50 border border-slate-100 rounded-2xl px-6 py-4 text-sm font-bold focus:border-blue-500 outline-none transition-all" />
                   </div>
                   <div className="space-y-3">
                      <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Phone Number</label>
                      <input className="w-full bg-slate-50 border border-slate-100 rounded-2xl px-6 py-4 text-sm font-bold focus:border-blue-500 outline-none transition-all" />
                   </div>
                </div>

                <div className="pt-6 flex gap-6">
                   <button onClick={() => setIsModalOpen(false)} className="flex-1 py-4 text-slate-400 font-black hover:text-slate-600 transition-all">Discard</button>
                   <button onClick={() => setIsModalOpen(false)} className="flex-1 py-4 bg-blue-600 text-white font-black rounded-2xl shadow-xl shadow-blue-100 hover:bg-blue-700 transition-all">Create Store</button>
                </div>
             </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default StoreList;
