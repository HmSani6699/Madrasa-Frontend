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
    { id: "stock", label: "Inventory Stock", icon: Box },
    { id: "purchase", label: "Procurement Log", icon: TrendingDown },
    { id: "sales", label: "Distribution Tracking", icon: TrendingUp },
    { id: "issue", label: "Asset Allocation", icon: ClipboardList },
  ];

  return (
    <div className="min-h-screen bg-slate-50/50 p-4 md:p-8 animate-in fade-in duration-500">
      <div className="max-w-[1600px] mx-auto space-y-8">
        
        {/* Header Section */}
        <div className="bg-white rounded-[2.5rem] border border-slate-200 p-8 shadow-sm flex flex-col lg:flex-row justify-between items-center gap-6">
          <div className="flex items-center gap-6">
            <div className="w-16 h-16 bg-[#e6f4ef] rounded-2xl flex items-center justify-center border border-emerald-100 shadow-inner">
              <Package className="w-8 h-8 text-[#00bd7f]" />
            </div>
            <div>
              <h1 className="text-2xl md:text-3xl font-black text-slate-800 tracking-tight text-uppercase">Asset Intelligence</h1>
              <p className="text-slate-500 font-bold mt-1">Detailed stock levels, procurement history, and resource distribution metrics</p>
            </div>
          </div>

          <div className="flex gap-4 w-full lg:w-auto">
             <button className="flex-1 lg:flex-none px-8 py-4 bg-slate-100 text-slate-600 rounded-2xl font-black hover:bg-slate-200 transition-all flex items-center justify-center gap-3 border border-slate-200 uppercase tracking-widest text-[11px]">
               <Calendar className="w-5 h-5 text-[#00bd7f]" />
               Range Query
            </button>
            <button className="flex-[2] lg:flex-none px-8 py-4 bg-[#00bd7f] text-white rounded-2xl font-black shadow-xl shadow-emerald-100 hover:bg-[#009b68] hover:scale-[1.02] active:scale-95 transition-all flex items-center justify-center gap-3 uppercase tracking-widest text-[11px]">
              <Download className="w-5 h-5" />
              Inventory Export
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
                   ? "bg-[#00bd7f] text-white shadow-lg shadow-emerald-100 scale-[1.02]" 
                   : "text-slate-400 hover:bg-slate-50 hover:text-slate-600"
               }`}
             >
               <tab.icon className={`w-5 h-5 ${activeTab === tab.id ? "text-white" : "text-slate-300"}`} />
               {tab.label}
             </button>
           ))}
        </div>

        {/* Warning Section (Enhanced) */}
        {activeTab === "stock" && (
           <div className="bg-[#fff9f2] rounded-[2.5rem] border border-amber-100 p-8 flex flex-col md:flex-row items-center gap-6 shadow-sm group">
              <div className="w-14 h-14 bg-white rounded-2xl flex items-center justify-center shadow-md group-hover:bg-amber-500 transition-colors">
                 <AlertTriangle className="w-7 h-7 text-amber-500 group-hover:text-white transition-colors" />
              </div>
              <div className="flex-1 text-center md:text-left">
                 <h4 className="text-[10px] font-black text-amber-800 uppercase tracking-[2px]">Resource Depletion Warning</h4>
                 <p className="text-sm font-bold text-slate-600 mt-1">12 essential inventory items are currently below the critical threshold levels.</p>
              </div>
              <button className="px-8 py-4 bg-white text-amber-600 border border-amber-100 rounded-2xl text-[10px] font-black uppercase tracking-widest hover:bg-amber-500 hover:text-white transition-all shadow-sm">Initiate Restock Protocol</button>
           </div>
        )}

        {/* Asset Tracking Workspace */}
        <div className="bg-white rounded-[3rem] border border-slate-200 p-10 shadow-sm overflow-hidden">
           <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-4 gap-8 mb-10">
              <div className="space-y-3">
                 <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest px-1">Asset Category</label>
                 <div className="relative group">
                    <select className="w-full bg-white border border-slate-200 rounded-xl px-4 py-3 text-sm font-bold focus:border-[#00bd7f] outline-none appearance-none cursor-pointer group-hover:border-slate-300 transition-all shadow-sm">
                       <option>Institutional Assets</option>
                       <option>Stationery Supplies</option>
                       <option>Uniform Inventory</option>
                       <option>Textbook Repository</option>
                    </select>
                    <ChevronDown className="absolute right-4 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-300 pointer-events-none group-focus-within:text-[#00bd7f]" />
                 </div>
              </div>
              <div className="space-y-3">
                 <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest px-1">Storage Vault</label>
                 <div className="relative group">
                    <select className="w-full bg-white border border-slate-200 rounded-xl px-4 py-3 text-sm font-bold focus:border-[#00bd7f] outline-none appearance-none cursor-pointer shadow-sm">
                       <option>Central Warehouse</option>
                       <option>Sub-Station 01</option>
                    </select>
                    <ChevronDown className="absolute right-4 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-300 pointer-events-none" />
                 </div>
              </div>
              <div className="space-y-3 lg:col-span-2 flex items-end gap-4">
                 <div className="relative flex-1 group">
                    <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-300 group-focus-within:text-[#00bd7f]" />
                    <input className="w-full bg-white border border-slate-200 rounded-xl pl-10 pr-6 py-3.5 text-sm font-bold focus:border-[#00bd7f] outline-none transition-all shadow-sm" placeholder="Search Assets by SKU or Name..." />
                 </div>
                 <button className="px-10 py-3.5 bg-slate-900 text-white rounded-xl font-black uppercase tracking-widest text-[10px] hover:bg-slate-800 transition-all shadow-xl shadow-slate-200 shrink-0 flex items-center gap-3">
                    <Filter className="w-4 h-4 text-[#00bd7f]" />
                    Run Audit
                 </button>
              </div>
           </div>

           <div className="overflow-x-auto">
              <table className="w-full border-collapse">
                 <thead>
                    <tr className="border-b border-slate-50 text-[10px] font-black text-slate-400 uppercase tracking-widest">
                       <th className="px-8 py-5 text-left">Asset Descriptor</th>
                       <th className="px-8 py-5 text-left">Classification</th>
                       <th className="px-8 py-5 text-center">In-Stock</th>
                       <th className="px-8 py-5 text-center">Unit Metric</th>
                       <th className="px-8 py-5 text-center">Valuation (৳)</th>
                       <th className="px-8 py-5 text-right">Actions</th>
                    </tr>
                 </thead>
                 <tbody className="divide-y divide-slate-50">
                    {[1, 2, 3, 4, 5, 6].map((i) => (
                       <tr key={i} className="group hover:bg-slate-50/50 transition-all uppercase">
                          <td className="px-8 py-6">
                             <div className="flex items-center gap-4">
                                <div className="w-12 h-12 bg-slate-50 border border-slate-100 rounded-2xl flex items-center justify-center group-hover:bg-[#e6f4ef] group-hover:border-emerald-100 transition-all">
                                   <Layers className="w-6 h-6 text-slate-300 group-hover:text-[#00bd7f]" />
                                </div>
                                <div>
                                   <p className="text-sm font-black text-slate-800 tracking-tight">Technical Asset {i + 124}</p>
                                   <p className="text-[10px] font-bold text-slate-400 tracking-widest font-mono">SKU ID: AST-Q81-0{i}</p>
                                </div>
                             </div>
                          </td>
                          <td className="px-8 py-6">
                             <span className="text-[10px] font-black text-slate-500 tracking-widest bg-slate-100/50 px-3 py-1.5 rounded-lg border border-slate-200">Admin Supplies</span>
                          </td>
                          <td className="px-8 py-6 text-center">
                             <span className={`text-sm font-black font-mono ${i === 2 ? 'text-rose-500 animate-pulse' : 'text-slate-800'}`}>
                                {i === 2 ? 'LOW (08)' : '182.00'}
                             </span>
                          </td>
                          <td className="px-8 py-6 text-center text-[10px] font-black text-slate-400 tracking-widest">Global Pcs</td>
                          <td className="px-8 py-6 text-center">
                             <span className="text-sm font-black text-slate-800 font-mono tracking-tighter">{(i * 1250).toLocaleString()}.00</span>
                          </td>
                          <td className="px-8 py-6 text-right">
                             <button className="p-2.5 bg-white border border-slate-200 rounded-xl text-slate-400 hover:text-[#00bd7f] hover:border-[#00bd7f] shadow-sm transition-all">
                                <Printer className="w-4 h-4" />
                             </button>
                          </td>
                       </tr>
                    ))}
                 </tbody>
              </table>
           </div>

           {/* Inventory Summary Footer */}
           <div className="mt-10 p-10 bg-slate-50/30 rounded-[2.5rem] border border-slate-50 flex flex-col md:flex-row justify-between items-center gap-8">
              <div className="flex gap-12">
                 <div className="flex flex-col">
                    <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-1">Total Asset Value</span>
                    <span className="text-2xl font-black text-slate-800 tracking-tighter">৳ 2.4M</span>
                 </div>
                 <div className="w-px h-10 bg-slate-200"></div>
                 <div className="flex flex-col">
                    <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-1">Periodic Consumables</span>
                    <span className="text-2xl font-black text-slate-800 tracking-tighter">৳ 128K</span>
                 </div>
              </div>
              <p className="text-[10px] font-black text-[#00bd7f] bg-[#e6f4ef] px-6 py-2 rounded-full tracking-widest">STOCK AUDIT: VERIFIED BY SYSTEM</p>
           </div>
        </div>
      </div>
    </div>
  );
};

export default InventoryReports;
