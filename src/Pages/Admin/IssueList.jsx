import { useState } from "react";
import { 
  ClipboardList, 
  Search, 
  Filter, 
  MoreVertical, 
  Plus, 
  Eye, 
  User, 
  Building2, 
  Calendar,
  Layers,
  CheckCircle2,
  ChevronDown,
  ArrowUpRight
} from "lucide-react";

const IssueList = () => {
  const [issues] = useState([
    { id: 1, issueNo: "ISS-2026-001", receiver: "Maulana Abdur Rashid", department: "Academic", date: "2026-01-08", items: 5, status: "issued" },
    { id: 2, issueNo: "ISS-2026-002", receiver: "Zaid Bin Harith", department: "Administration", date: "2026-01-09", items: 2, status: "issued" },
    { id: 3, issueNo: "ISS-2026-003", receiver: "Hafiz Ahmed Ullah", department: "Hifz", date: "2026-01-09", items: 12, status: "pending" },
  ]);

  return (
    <div className="min-h-screen bg-slate-50/50 p-4 md:p-8 animate-in fade-in duration-500">
      <div className="max-w-[1600px] mx-auto space-y-8">
        
        {/* Header Section */}
        <div className="bg-white rounded-[2.5rem] border border-slate-200 p-8 shadow-sm flex flex-col lg:flex-row justify-between items-center gap-6">
          <div className="flex items-center gap-6">
            <div className="w-16 h-16 bg-rose-50 rounded-2xl flex items-center justify-center border border-rose-100 shadow-inner">
              <ClipboardList className="w-8 h-8 text-rose-600" />
            </div>
            <div>
              <h1 className="text-2xl md:text-3xl font-black text-slate-800 tracking-tight">Inventory Issue</h1>
              <p className="text-slate-500 font-bold mt-1">Track and manage items issued to staff members and departments</p>
            </div>
          </div>

          <button className="w-full lg:w-auto px-8 py-4 bg-rose-600 text-white rounded-2xl font-black shadow-xl shadow-rose-100 hover:bg-rose-700 hover:scale-[1.02] active:scale-95 transition-all flex items-center justify-center gap-3">
            <Plus className="w-5 h-5" />
            Issue New Item
          </button>
        </div>

        {/* Filters */}
        <div className="flex flex-col md:flex-row gap-4">
          <div className="flex-1 relative">
            <Search className="absolute left-6 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400" />
            <input 
              type="text"
              placeholder="Search by issue number or staff name..."
              className="w-full bg-white border border-slate-200 rounded-2xl pl-14 pr-6 py-4 text-sm font-bold focus:border-rose-500 outline-none shadow-sm transition-all"
            />
          </div>
          <div className="flex gap-4">
            <div className="bg-white border border-slate-200 rounded-2xl px-6 py-4 flex items-center gap-3 font-bold text-slate-600 shadow-sm cursor-pointer hover:bg-slate-50 transition-all">
               <Building2 className="w-4 h-4 text-slate-400" />
               Department
               <ChevronDown className="w-4 h-4 text-slate-300" />
            </div>
            <button className="px-6 py-4 bg-white border border-slate-200 rounded-2xl flex items-center gap-3 font-bold text-slate-600 hover:bg-slate-50 transition-all shadow-sm">
              <Filter className="w-4 h-4" />
              Status
            </button>
          </div>
        </div>

        {/* Issue Table */}
        <div className="bg-white rounded-[2.5rem] border border-slate-200 shadow-sm overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full border-collapse">
              <thead>
                <tr className="border-b border-slate-50 bg-slate-50/50">
                  <th className="px-8 py-6 text-left text-[10px] font-black text-slate-400 uppercase tracking-widest">Issue No</th>
                  <th className="px-8 py-6 text-left text-[10px] font-black text-slate-400 uppercase tracking-widest">Received By</th>
                  <th className="px-8 py-6 text-center text-[10px] font-black text-slate-400 uppercase tracking-widest">Items</th>
                  <th className="px-8 py-6 text-center text-[10px] font-black text-slate-400 uppercase tracking-widest">Issue Date</th>
                  <th className="px-8 py-6 text-center text-[10px] font-black text-slate-400 uppercase tracking-widest">Status</th>
                  <th className="px-8 py-6 text-right text-[10px] font-black text-slate-400 uppercase tracking-widest">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-50">
                {issues.map((issue) => (
                  <tr key={issue.id} className="group hover:bg-slate-50/50 transition-all duration-300">
                    <td className="px-8 py-6">
                      <div className="flex items-center gap-4">
                        <div className="w-12 h-12 bg-rose-50 rounded-2xl flex items-center justify-center border border-rose-100 group-hover:bg-rose-600 group-hover:scale-110 transition-all duration-500">
                          <ArrowUpRight className="w-6 h-6 text-rose-500 group-hover:text-white" />
                        </div>
                        <div>
                          <p className="text-sm font-black text-slate-800 group-hover:text-rose-600 transition-colors uppercase tracking-tight">{issue.issueNo}</p>
                          <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Procurement Issue</p>
                        </div>
                      </div>
                    </td>
                    <td className="px-8 py-6">
                      <div className="flex items-center gap-3">
                         <div className="w-8 h-8 bg-slate-50 rounded-full flex items-center justify-center border border-slate-100">
                            <User className="w-4 h-4 text-slate-300" />
                         </div>
                         <div>
                            <p className="text-sm font-bold text-slate-700">{issue.receiver}</p>
                            <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest flex items-center gap-1">
                               <Building2 className="w-3 h-3" /> {issue.department}
                            </p>
                         </div>
                      </div>
                    </td>
                    <td className="px-8 py-6 text-center">
                       <div className="inline-flex items-center gap-2 px-3 py-1 bg-slate-100 rounded-lg">
                          <Layers className="w-3.5 h-3.5 text-slate-400" />
                          <span className="text-xs font-black text-slate-600">{issue.items} Items</span>
                       </div>
                    </td>
                    <td className="px-8 py-6 text-center">
                       <p className="text-sm font-bold text-slate-600">{new Date(issue.date).toLocaleDateString('en-GB', { day: '2-digit', month: 'short', year: 'numeric' })}</p>
                    </td>
                    <td className="px-8 py-6 text-center">
                       <div className={`inline-flex items-center gap-2 px-4 py-1.5 rounded-full text-[10px] font-black uppercase tracking-widest border ${
                         issue.status === 'issued' ? 'bg-emerald-50 text-emerald-600 border-emerald-100' : 'bg-amber-50 text-amber-600 border-amber-100'
                       }`}>
                         <CheckCircle2 className="w-3 h-3" />
                         {issue.status}
                       </div>
                    </td>
                    <td className="px-8 py-6 text-right">
                      <div className="flex items-center justify-end gap-3 opacity-0 group-hover:opacity-100 transition-all">
                        <button className="p-2.5 bg-white border border-slate-200 rounded-xl text-slate-400 hover:text-rose-600 hover:border-rose-200 shadow-sm transition-all">
                          <Eye className="w-4 h-4" />
                        </button>
                        <button className="p-2.5 bg-rose-50 border border-rose-100 rounded-xl text-rose-400 hover:text-rose-600 hover:bg-rose-100 shadow-sm transition-all">
                          <MoreVertical className="w-4 h-4" />
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
    </div>
  );
};

export default IssueList;
