import { useState } from "react";
import { 
  Package, 
  Search, 
  Filter, 
  MoreVertical, 
  Plus, 
  Edit3, 
  Trash2, 
  Eye, 
  AlertCircle,
  CheckCircle2,
  Layers,
  BarChart3,
  ChevronDown
} from "lucide-react";

const ProductList = () => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [products] = useState([
    { id: 1, name: "Student Diary 2026", category: "Stationery", unit: "Pcs", price: 15.50, stock: 150, status: "in-stock" },
    { id: 2, name: "Oxford English Text Book", category: "Books", unit: "Pcs", price: 45.00, stock: 45, status: "low-stock" },
    { id: 3, name: "Madrasa Uniform - Medium", category: "Uniform", unit: "Set", price: 75.00, stock: 0, status: "out-of-stock" },
    { id: 4, name: "Scientific Calculator", category: "Electronics", unit: "Pcs", price: 120.00, stock: 12, status: "in-stock" },
  ]);

  return (
    <div className="min-h-screen bg-slate-50/50 p-4 md:p-8 animate-in fade-in duration-500">
      <div className="max-w-[1600px] mx-auto space-y-8">
        
        {/* Header Section */}
        <div className="bg-white rounded-[2.5rem] border border-slate-200 p-8 shadow-sm flex flex-col lg:flex-row justify-between items-center gap-6">
          <div className="flex items-center gap-6">
            <div className="w-16 h-16 bg-emerald-50 rounded-2xl flex items-center justify-center border border-emerald-100 shadow-inner">
              <Package className="w-8 h-8 text-emerald-600" />
            </div>
            <div>
              <h1 className="text-2xl md:text-3xl font-black text-slate-800 tracking-tight">Product Inventory</h1>
              <p className="text-slate-500 font-bold mt-1">Manage institutional assets, supplies, and merchandise</p>
            </div>
          </div>

          <button 
            onClick={() => setIsModalOpen(true)}
            className="w-full lg:w-auto px-8 py-4 bg-emerald-600 text-white rounded-2xl font-black shadow-xl shadow-emerald-100 hover:bg-emerald-700 hover:scale-[1.02] active:scale-95 transition-all flex items-center justify-center gap-3"
          >
            <Plus className="w-5 h-5" />
            Add New Product
          </button>
        </div>

        {/* Stats Row */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {[
            { label: "Total Products", value: "452", icon: Layers, color: "blue" },
            { label: "Low Stock Items", value: "12", icon: AlertCircle, color: "rose" },
            { label: "Out of Stock", value: "3", icon: Package, color: "amber" },
            { label: "In Stock", value: "437", icon: CheckCircle2, color: "emerald" },
          ].map((stat, i) => (
            <div key={i} className="bg-white rounded-3xl border border-slate-200 p-6 flex items-center gap-5 shadow-sm">
               <div className={`w-12 h-12 bg-${stat.color}-50 rounded-2xl flex items-center justify-center`}>
                  <stat.icon className={`w-6 h-6 text-${stat.color}-600`} />
               </div>
               <div>
                  <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">{stat.label}</p>
                  <p className="text-2xl font-black text-slate-800">{stat.value}</p>
               </div>
            </div>
          ))}
        </div>

        {/* Control Bar */}
        <div className="flex flex-col md:flex-row gap-4">
          <div className="flex-1 relative">
            <Search className="absolute left-6 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400" />
            <input 
              type="text"
              placeholder="Search by product name or code..."
              className="w-full bg-white border border-slate-200 rounded-2xl pl-14 pr-6 py-4 text-sm font-bold focus:border-emerald-500 outline-none shadow-sm transition-all"
            />
          </div>
          <div className="flex gap-4">
            <button className="px-6 py-4 bg-white border border-slate-200 rounded-2xl flex items-center gap-3 font-bold text-slate-600 hover:bg-slate-50 transition-all shadow-sm">
              <Filter className="w-4 h-4" />
              Category
            </button>
            <button className="px-6 py-4 bg-white border border-slate-200 rounded-2xl flex items-center gap-3 font-bold text-slate-600 hover:bg-slate-50 transition-all shadow-sm">
              <BarChart3 className="w-4 h-4" />
              Reports
            </button>
          </div>
        </div>

        {/* Product Table */}
        <div className="bg-white rounded-[2.5rem] border border-slate-200 shadow-sm overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full border-collapse">
              <thead>
                <tr className="border-b border-slate-50 bg-slate-50/50">
                  <th className="px-8 py-6 text-left text-[10px] font-black text-slate-400 uppercase tracking-widest">Product Info</th>
                  <th className="px-8 py-6 text-left text-[10px] font-black text-slate-400 uppercase tracking-widest">Category</th>
                  <th className="px-8 py-6 text-center text-[10px] font-black text-slate-400 uppercase tracking-widest">Unit Price</th>
                  <th className="px-8 py-6 text-center text-[10px] font-black text-slate-400 uppercase tracking-widest">Stock</th>
                  <th className="px-8 py-6 text-center text-[10px] font-black text-slate-400 uppercase tracking-widest">Status</th>
                  <th className="px-8 py-6 text-right text-[10px] font-black text-slate-400 uppercase tracking-widest">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-50">
                {products.map((product) => (
                  <tr key={product.id} className="group hover:bg-slate-50/50 transition-all duration-300">
                    <td className="px-8 py-6">
                      <div className="flex items-center gap-4">
                        <div className="w-12 h-12 bg-slate-100 rounded-2xl flex items-center justify-center border-2 border-white shadow-sm overflow-hidden group-hover:scale-110 transition-transform">
                          <Package className="w-6 h-6 text-slate-300" />
                        </div>
                        <div>
                          <p className="text-sm font-black text-slate-800 group-hover:text-emerald-600 transition-colors uppercase tracking-tight">{product.name}</p>
                          <p className="text-[11px] font-bold text-slate-400">ID: PRD-00{product.id}</p>
                        </div>
                      </div>
                    </td>
                    <td className="px-8 py-6">
                      <span className="px-4 py-1.5 bg-slate-100 text-slate-600 rounded-full text-[10px] font-black uppercase tracking-wider">
                        {product.category}
                      </span>
                    </td>
                    <td className="px-8 py-6 text-center">
                      <p className="text-sm font-black text-slate-800">${product.price.toFixed(2)}</p>
                      <p className="text-[10px] font-bold text-slate-400">per {product.unit}</p>
                    </td>
                    <td className="px-8 py-6 text-center">
                      <p className={`text-sm font-black ${product.stock <= 10 ? 'text-rose-600' : 'text-slate-800'}`}>{product.stock}</p>
                      <p className="text-[10px] font-bold text-slate-400">{product.unit} Available</p>
                    </td>
                    <td className="px-8 py-6 text-center">
                      <div className={`inline-flex items-center gap-2 px-4 py-1.5 rounded-full text-[10px] font-black uppercase tracking-widest border ${
                        product.status === 'in-stock' ? 'bg-emerald-50 text-emerald-600 border-emerald-100' :
                        product.status === 'low-stock' ? 'bg-amber-50 text-amber-600 border-amber-100' :
                        'bg-rose-50 text-rose-600 border-rose-100'
                      }`}>
                        <div className={`w-1.5 h-1.5 rounded-full ${
                          product.status === 'in-stock' ? 'bg-emerald-500' :
                          product.status === 'low-stock' ? 'bg-amber-500' :
                          'bg-rose-500'
                        }`} />
                        {product.status.replace('-', ' ')}
                      </div>
                    </td>
                    <td className="px-8 py-6 text-right">
                      <div className="flex items-center justify-end gap-3 opacity-0 group-hover:opacity-100 transition-all">
                        <button className="p-2.5 bg-white border border-slate-200 rounded-xl text-slate-400 hover:text-emerald-600 hover:border-emerald-200 shadow-sm transition-all">
                          <Eye className="w-4 h-4" />
                        </button>
                        <button className="p-2.5 bg-white border border-slate-200 rounded-xl text-slate-400 hover:text-emerald-600 hover:border-emerald-200 shadow-sm transition-all">
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
                   <div className="w-12 h-12 bg-emerald-50 rounded-2xl flex items-center justify-center border border-emerald-100">
                      <Package className="w-6 h-6 text-emerald-600" />
                   </div>
                   <h2 className="text-3xl font-black text-slate-800 tracking-tight">Add Product</h2>
                </div>
                <button onClick={() => setIsModalOpen(false)} className="p-3 hover:bg-slate-100 rounded-2xl transition-all">
                  <Plus className="w-8 h-8 text-slate-300 rotate-45" />
                </button>
             </div>
             <div className="p-10 space-y-8">
                <div className="space-y-3">
                   <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Product Name</label>
                   <input className="w-full bg-slate-50 border border-slate-100 rounded-2xl px-6 py-4 text-sm font-bold focus:border-emerald-500 transition-all outline-none" placeholder="e.g. Sharpies Mechanical Pencil" />
                </div>
                <div className="grid grid-cols-2 gap-6">
                   <div className="space-y-3">
                      <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Category</label>
                      <select className="w-full bg-slate-50 border border-slate-100 rounded-2xl px-6 py-4 text-sm font-bold focus:border-emerald-500 outline-none appearance-none cursor-pointer">
                        <option>Choose Category</option>
                        <option>Books</option>
                        <option>Stationery</option>
                        <option>Electronics</option>
                      </select>
                   </div>
                   <div className="space-y-3">
                      <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Unit of Measure</label>
                      <select className="w-full bg-slate-50 border border-slate-100 rounded-2xl px-6 py-4 text-sm font-bold focus:border-emerald-500 outline-none appearance-none cursor-pointer">
                        <option>Pcs</option>
                        <option>Set</option>
                        <option>Kg</option>
                        <option>Box</option>
                      </select>
                   </div>
                </div>
                <div className="grid grid-cols-2 gap-6">
                   <div className="space-y-3">
                      <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Unit Price</label>
                      <input type="number" className="w-full bg-slate-50 border border-slate-100 rounded-2xl px-6 py-4 text-sm font-bold focus:border-emerald-500 transition-all outline-none" placeholder="0.00" />
                   </div>
                   <div className="space-y-3">
                      <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Initial Stock</label>
                      <input type="number" className="w-full bg-slate-50 border border-slate-100 rounded-2xl px-6 py-4 text-sm font-bold focus:border-emerald-500 transition-all outline-none" placeholder="0" />
                   </div>
                </div>

                <div className="pt-6 flex gap-6">
                   <button onClick={() => setIsModalOpen(false)} className="flex-1 py-4 text-slate-400 font-black hover:text-slate-600 transition-all">Discard</button>
                   <button onClick={() => setIsModalOpen(false)} className="flex-1 py-4 bg-emerald-600 text-white font-black rounded-2xl shadow-xl shadow-emerald-100 hover:bg-emerald-700 transition-all">Save Product</button>
                </div>
             </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default ProductList;
