import { useState, useEffect } from "react";
import { useLocation } from "react-router-dom";
import { 
  Package, 
  Search, 
  Filter, 
  Download, 
  Box, 
  TrendingUp, 
  TrendingDown, 
  ClipboardList, 
  AlertTriangle,
  MoreVertical,
  ChevronDown,
  Printer,
  Calendar,
  Layers
} from "lucide-react";

const InventoryReports = () => {
  const location = useLocation();
  const [activeTab, setActiveTab] = useState("stock");

  useEffect(() => {
    const path = location.pathname;
    if (path.includes("purchase")) setActiveTab("purchase");
    else if (path.includes("sales")) setActiveTab("sales");
    else if (path.includes("issue")) setActiveTab("issue");
    else setActiveTab("stock");
  }, [location.pathname]);

  const tabs = [
    { id: "stock", label: "Stock Report", icon: Box },
    { id: "purchase", label: "Purchase Report", icon: TrendingDown },
    { id: "sales", label: "Sales Report", icon: TrendingUp },
    { id: "issue", label: "Issue Report", icon: ClipboardList },
  ];

  return (
    <div className="min-h-screen bg-slate-50/50 p-4 md:p-8 animate-in fade-in duration-500">
      <div className="max-w-[1600px] mx-auto space-y-8">
        
        {/* Header Section */}
        <div className="bg-white rounded-[2.5rem] border border-slate-200 p-8 shadow-sm flex flex-col lg:flex-row justify-between items-center gap-6">
          <div className="flex items-center gap-6">
            <div className="w-16 h-16 bg-rose-50 rounded-2xl flex items-center justify-center border border-rose-100 shadow-inner">
              <Package className="w-8 h-8 text-rose-600" />
            </div>
            <div>
              <h1 className="text-2xl md:text-3xl font-black text-slate-800 tracking-tight text-uppercase">Inventory Analytics</h1>
              <p className="text-slate-500 font-bold mt-1">Detailed stock levels, procurement history, and resource distribution metrics</p>
            </div>
          </div>

          <div className="flex gap-4 w-full lg:w-auto">
             <button className="flex-1 lg:flex-none px-8 py-4 bg-slate-100 text-slate-600 rounded-2xl font-black hover:bg-slate-200 transition-all flex items-center justify-center gap-3 border border-slate-200">
               <Calendar className="w-5 h-5" />
               Custom Range
            </button>
            <button className="flex-[2] lg:flex-none px-8 py-4 bg-rose-600 text-white rounded-2xl font-black shadow-xl shadow-rose-100 hover:bg-rose-700 hover:scale-[1.02] active:scale-95 transition-all flex items-center justify-center gap-3">
              <Download className="w-5 h-5" />
              Export Stock
            </button>
          </div>
        </div>

        {/* Tab Navigation */}
        <div className="bg-white p-2 rounded-[2.5rem] border border-slate-200 shadow-sm flex flex-wrap gap-2">
           {tabs.map((tab) => (
             <button
               key={tab.id}
               onClick={() => setActiveTab(tab.id)}
               className={`flex items-center gap-3 px-6 py-4 rounded-[2rem] font-black transition-all ${
                 activeTab === tab.id 
                   ? "bg-rose-600 text-white shadow-lg shadow-rose-100 scale-[1.02]" 
                   : "text-slate-400 hover:bg-slate-50 hover:text-slate-600"
               }`}
             >
               <tab.icon className={`w-5 h-5 ${activeTab === tab.id ? "text-white" : "text-slate-300"}`} />
               {tab.label}
             </button>
           ))}
        </div>

        {/* Warning Section (Conditional) */}
        {activeTab === "stock" && (
           <div className="bg-amber-50 rounded-[2.5rem] border border-amber-100 p-8 flex items-center gap-6 shadow-sm">
              <div className="w-12 h-12 bg-white rounded-2xl flex items-center justify-center shadow-sm">
                 <AlertTriangle className="w-6 h-6 text-amber-600" />
              </div>
              <div className="flex-1">
                 <h4 className="text-sm font-black text-amber-800 uppercase tracking-widest">Low Stock Alert</h4>
                 <p className="text-xs font-bold text-amber-600 mt-1">12 items are currently below the safety threshold. Consider restock as soon as possible.</p>
              </div>
              <button className="px-6 py-3 bg-white text-amber-600 rounded-xl text-[10px] font-black uppercase tracking-widest hover:bg-amber-100 transition-all">Review Items</button>
           </div>
        )}

        {/* Filters and List */}
        <div className="bg-white rounded-[3rem] border border-slate-200 p-10 shadow-sm overflow-hidden">
           <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-4 gap-8 mb-10">
              <div className="space-y-3">
                 <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest px-1">Category</label>
                 <select className="w-full bg-slate-50 border border-slate-100 rounded-2xl px-6 py-4 text-sm font-bold focus:border-rose-500 outline-none appearance-none cursor-pointer">
                    <option>All Categories</option>
                    <option>Stationery</option>
                    <option>Uniforms</option>
                    <option>Books</option>
                 </select>
              </div>
              <div className="space-y-3">
                 <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest px-1">Storage Location</label>
                 <select className="w-full bg-slate-50 border border-slate-100 rounded-2xl px-6 py-4 text-sm font-bold focus:border-rose-500 outline-none appearance-none cursor-pointer">
                    <option>Main Warehouse</option>
                    <option>Stationery Room</option>
                 </select>
              </div>
              <div className="space-y-3 lg:col-span-2 flex items-end">
                 <div className="relative flex-1">
                    <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-300" />
                    <input className="w-full bg-slate-50 border border-slate-100 rounded-2xl pl-10 pr-6 py-4 text-sm font-bold focus:border-rose-500 outline-none transition-all" placeholder="Search by product name or code..." />
                 </div>
                 <button className="ml-4 px-8 py-4 bg-slate-900 text-white rounded-2xl font-black uppercase tracking-widest text-[11px] hover:bg-slate-800 transition-all shadow-xl shadow-slate-200 shrink-0">
                    Apply Filter
                 </button>
              </div>
           </div>

           <div className="overflow-x-auto">
              <table className="w-full border-collapse">
                 <thead>
                    <tr className="border-b border-slate-50 text-[10px] font-black text-slate-400 uppercase tracking-widest">
                       <th className="px-8 py-5 text-left">Product Details</th>
                       <th className="px-8 py-5 text-left">Category</th>
                       <th className="px-8 py-5 text-center">Current Stock</th>
                       <th className="px-8 py-5 text-center">Unit</th>
                       <th className="px-8 py-5 text-center">Stock Value</th>
                       <th className="px-8 py-5 text-right">Actions</th>
                    </tr>
                 </thead>
                 <tbody className="divide-y divide-slate-50">
                    {[1, 2, 3, 4, 5].map((i) => (
                       <tr key={i} className="group hover:bg-slate-50/50 transition-all">
                          <td className="px-8 py-6">
                             <div className="flex items-center gap-4">
                                <div className="w-12 h-12 bg-rose-50 rounded-2xl flex items-center justify-center group-hover:rotate-12 transition-transform">
                                   <Layers className="w-6 h-6 text-rose-400" />
                                </div>
                                <div>
                                   <p className="text-sm font-black text-slate-800 uppercase tracking-tight">White Board Markers</p>
                                   <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest font-mono">CODE: ST-90{i}</p>
                                </div>
                             </div>
                          </td>
                          <td className="px-8 py-6">
                             <span className="text-xs font-black text-slate-400 uppercase tracking-widest bg-slate-50 px-3 py-1 rounded-lg border border-slate-100">Stationery</span>
                          </td>
                          <td className="px-8 py-6 text-center">
                             <span className={`text-sm font-black ${i === 3 ? 'text-rose-500 animate-pulse' : 'text-slate-800'}`}>
                                {i === 3 ? '5' : '150'}
                             </span>
                          </td>
                          <td className="px-8 py-6 text-center text-xs font-bold text-slate-400 uppercase tracking-widest">Pcs</td>
                          <td className="px-8 py-6 text-center">
                             <span className="text-sm font-black text-slate-800">${(i * 45).toFixed(2)}</span>
                          </td>
                          <td className="px-8 py-6 text-right">
                             <button className="p-2.5 bg-white border border-slate-200 rounded-xl text-slate-400 hover:text-rose-600 hover:border-rose-200 shadow-sm transition-all">
                                <Printer className="w-4 h-4" />
                             </button>
                          </td>
                       </tr>
                    ))}
                 </tbody>
              </table>
           </div>
        </div>

      </div>
    </div>
  );
};

export default InventoryReports;
