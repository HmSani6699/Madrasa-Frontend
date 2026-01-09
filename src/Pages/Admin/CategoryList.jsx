import { useState } from "react";
import { 
  Layers, 
  Search, 
  Plus, 
  MoreVertical, 
  Edit3, 
  Trash2, 
  Package, 
  ChevronRight,
  PlusCircle
} from "lucide-react";

const CategoryList = () => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [categories] = useState([
    { id: 1, name: "Stationery", description: "All paper, pens, and writing materials", productCount: 145 },
    { id: 2, name: "Books", description: "Curriculum text books and library additions", productCount: 82 },
    { id: 3, name: "Uniform", description: "Dress sets, hats, and footwear", productCount: 24 },
    { id: 4, name: "Electronics", description: "Calculators, tablets, and lab equipment", productCount: 12 },
  ]);

  return (
    <div className="min-h-screen bg-slate-50/50 p-4 md:p-8 animate-in fade-in duration-500">
      <div className="max-w-[1600px] mx-auto space-y-8">
        
        {/* Header Section */}
        <div className="bg-white rounded-[2.5rem] border border-slate-200 p-8 shadow-sm flex flex-col lg:flex-row justify-between items-center gap-6">
          <div className="flex items-center gap-6">
            <div className="w-16 h-16 bg-violet-50 rounded-2xl flex items-center justify-center border border-violet-100 shadow-inner">
              <Layers className="w-8 h-8 text-violet-600" />
            </div>
            <div>
              <h1 className="text-2xl md:text-3xl font-black text-slate-800 tracking-tight">Product Categories</h1>
              <p className="text-slate-500 font-bold mt-1">Organize your inventory into meaningful groups</p>
            </div>
          </div>

          <button 
            onClick={() => setIsModalOpen(true)}
            className="w-full lg:w-auto px-8 py-4 bg-violet-600 text-white rounded-2xl font-black shadow-xl shadow-violet-100 hover:bg-violet-700 hover:scale-[1.02] active:scale-95 transition-all flex items-center justify-center gap-3"
          >
            <Plus className="w-5 h-5" />
            New Category
          </button>
        </div>

        {/* Search Bar */}
        <div className="relative">
          <Search className="absolute left-6 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400" />
          <input 
            type="text"
            placeholder="Search categories..."
            className="w-full bg-white border border-slate-200 rounded-2xl pl-14 pr-6 py-4 text-sm font-bold focus:border-violet-500 outline-none shadow-sm transition-all"
          />
        </div>

        {/* Categories Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8">
          {categories.map((cat) => (
            <div key={cat.id} className="group bg-white rounded-[2.5rem] border border-slate-200 shadow-sm hover:shadow-2xl hover:border-violet-200 transition-all duration-500 flex flex-col">
              <div className="p-8 flex-1">
                <div className="flex justify-between items-start mb-6">
                  <div className="w-12 h-12 bg-slate-50 rounded-2xl flex items-center justify-center border border-slate-100 group-hover:bg-violet-50 group-hover:border-violet-100 transition-colors">
                    <Package className="w-6 h-6 text-slate-400 group-hover:text-violet-600" />
                  </div>
                  <button className="p-2 hover:bg-slate-50 rounded-xl text-slate-300 hover:text-slate-600 transition-all">
                    <MoreVertical className="w-5 h-5" />
                  </button>
                </div>

                <h3 className="text-xl font-black text-slate-800 tracking-tight group-hover:text-violet-600 transition-colors">{cat.name}</h3>
                <p className="text-xs font-bold text-slate-400 mt-2 line-clamp-2">{cat.description}</p>

                <div className="mt-8 flex items-center justify-between p-4 bg-slate-50 rounded-2xl group-hover:bg-violet-50/50 transition-colors">
                  <div className="flex flex-col">
                    <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Products</span>
                    <span className="text-lg font-black text-slate-700 group-hover:text-violet-700">{cat.productCount} Items</span>
                  </div>
                  <div className="w-10 h-10 bg-white rounded-xl flex items-center justify-center border border-slate-100 group-hover:border-violet-200 shadow-sm">
                    <ChevronRight className="w-5 h-5 text-slate-300 group-hover:text-violet-600" />
                  </div>
                </div>
              </div>

              <div className="p-6 bg-slate-50/50 border-t border-slate-100 rounded-b-[2.5rem] flex gap-3">
                 <button className="flex-1 py-3 bg-white border border-slate-200 text-slate-600 rounded-xl text-[10px] font-black uppercase tracking-widest hover:border-violet-200 hover:text-violet-600 transition-all flex items-center justify-center gap-2">
                   <Edit3 className="w-3.5 h-3.5" /> Edit
                 </button>
                 <button className="p-3 bg-rose-50 border border-rose-100 text-rose-400 rounded-xl hover:bg-rose-100 hover:text-rose-600 transition-all">
                   <Trash2 className="w-4 h-4" />
                 </button>
              </div>
            </div>
          ))}

          {/* Add Category Card */}
          <button 
            onClick={() => setIsModalOpen(true)}
            className="group bg-violet-50/20 rounded-[2.5rem] border-4 border-dashed border-violet-100 flex flex-col items-center justify-center p-12 hover:border-violet-300 hover:bg-violet-50/50 transition-all min-h-[300px]"
          >
            <div className="w-16 h-16 bg-white rounded-2xl flex items-center justify-center shadow-lg group-hover:scale-110 group-hover:bg-violet-600 transition-all mb-4">
              <PlusCircle className="w-8 h-8 text-violet-300 group-hover:text-white" />
            </div>
            <p className="text-lg font-black text-violet-400 group-hover:text-violet-600 tracking-tight">Add New Category</p>
          </button>
        </div>

      </div>

      {/* Creation Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 bg-slate-900/40 backdrop-blur-md z-[100] flex items-center justify-center p-4">
          <div className="bg-white rounded-[3rem] w-full max-w-xl shadow-2xl animate-in zoom-in duration-300 overflow-hidden">
             <div className="p-10 border-b border-slate-50 flex items-center justify-between">
                <div className="flex items-center gap-4">
                   <div className="w-12 h-12 bg-violet-50 rounded-2xl flex items-center justify-center border border-violet-100">
                      <Layers className="w-6 h-6 text-violet-600" />
                   </div>
                   <h2 className="text-3xl font-black text-slate-800 tracking-tight">New Category</h2>
                </div>
                <button onClick={() => setIsModalOpen(false)} className="p-3 hover:bg-slate-100 rounded-2xl transition-all">
                  <Plus className="w-8 h-8 text-slate-300 rotate-45" />
                </button>
             </div>
             <div className="p-10 space-y-6">
                <div className="space-y-3">
                   <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Category Name</label>
                   <input className="w-full bg-slate-50 border border-slate-100 rounded-2xl px-6 py-4 text-sm font-bold focus:border-violet-500 outline-none transition-all" placeholder="e.g. Lab Equipment" />
                </div>
                <div className="space-y-3">
                   <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Description</label>
                   <textarea rows="4" className="w-full bg-slate-50 border border-slate-100 rounded-2xl px-6 py-4 text-sm font-bold focus:border-violet-500 outline-none transition-all resize-none" placeholder="Brief details about items in this category..."></textarea>
                </div>

                <div className="pt-6 flex gap-6">
                   <button onClick={() => setIsModalOpen(false)} className="flex-1 py-4 text-slate-400 font-black hover:text-slate-600 transition-all">Discard</button>
                   <button onClick={() => setIsModalOpen(false)} className="flex-1 py-4 bg-violet-600 text-white font-black rounded-2xl shadow-xl shadow-violet-100 hover:bg-violet-700 transition-all">Create Category</button>
                </div>
             </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default CategoryList;
