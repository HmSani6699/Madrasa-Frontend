import { useState } from "react";
import { 
  CalendarCheck, 
  Search, 
  Filter, 
  CheckCircle2, 
  XCircle, 
  Clock, 
  FileText,
  UserCheck
} from "lucide-react";
import { toast } from "react-hot-toast";

const LeaveManagement = () => {
  const [searchTerm, setSearchTerm] = useState("");
  
  // Mock Data for now
  const [leaves, setLeaves] = useState([
     { id: 1, name: "Rahim Ali", role: "Student", type: "Sick Leave", date: "2025-05-15", reason: "High fever", status: "pending" },
     { id: 2, name: "Karim Ullah", role: "Teacher", type: "Casual Leave", date: "2025-05-20", reason: "Family event", status: "approved" },
  ]);

  const handleAction = (id, status) => {
      setLeaves(leaves.map(l => l.id === id ? { ...l, status } : l));
      toast.success(`Leave ${status} successfully`);
  };

  return (
    <div className="space-y-6 animate-in fade-in duration-500 p-4 md:p-8">
      {/* Header */}
      <div className="bg-white rounded-[2.5rem] border-2 border-slate-200 p-8 flex flex-col md:flex-row justify-between items-center gap-6 shadow-sm">
        <div className="flex items-center gap-6">
          <div className="w-16 h-16 bg-blue-50 rounded-2xl flex items-center justify-center border-2 border-blue-100 uppercase text-blue-600 font-black">
            <CalendarCheck className="w-8 h-8" />
          </div>
          <div>
            <h1 className="text-2xl md:text-3xl font-black text-slate-800">
              Leave Management
            </h1>
            <p className="text-slate-500 font-bold mt-1">Review and approve leave requests</p>
          </div>
        </div>
      </div>

      {/* List */}
      <div className="bg-white rounded-[2rem] border-2 border-slate-200 shadow-sm overflow-hidden min-h-[500px]">
          <div className="p-6 border-b-2 border-slate-50 flex justify-between items-center">
              <h3 className="font-black text-slate-700">Requests</h3>
              <div className="relative">
                  <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-300" />
                  <input 
                    placeholder="Search..." 
                    className="pl-10 pr-4 py-2 bg-slate-50 rounded-xl text-sm font-bold outline-none focus:ring-2 focus:ring-blue-500/20"
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                  />
              </div>
          </div>
          
          <div className="overflow-x-auto">
              <table className="w-full">
                  <thead className="bg-slate-50 text-[10px] uppercase font-black text-slate-500 tracking-widest text-left">
                      <tr>
                          <th className="px-6 py-4">Applicant</th>
                          <th className="px-6 py-4">Type</th>
                          <th className="px-6 py-4">Date</th>
                          <th className="px-6 py-4">Reason</th>
                          <th className="px-6 py-4 text-center">Status</th>
                          <th className="px-6 py-4 text-right">Actions</th>
                      </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-50">
                      {leaves.filter(l => l.name.toLowerCase().includes(searchTerm.toLowerCase())).map(leave => (
                          <tr key={leave.id} className="hover:bg-slate-50/50 transition-colors">
                              <td className="px-6 py-4">
                                  <div>
                                      <p className="font-bold text-slate-800">{leave.name}</p>
                                      <p className="text-xs text-slate-500">{leave.role}</p>
                                  </div>
                              </td>
                              <td className="px-6 py-4 text-sm font-bold text-slate-600">{leave.type}</td>
                              <td className="px-6 py-4 text-sm font-bold text-slate-600">{leave.date}</td>
                              <td className="px-6 py-4 text-sm text-slate-500 italic">"{leave.reason}"</td>
                              <td className="px-6 py-4 text-center">
                                  <span className={`px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-widest ${
                                      leave.status === 'approved' ? 'bg-emerald-50 text-emerald-600' :
                                      leave.status === 'rejected' ? 'bg-rose-50 text-rose-600' :
                                      'bg-amber-50 text-amber-600'
                                  }`}>
                                      {leave.status}
                                  </span>
                              </td>
                              <td className="px-6 py-4 text-right">
                                  {leave.status === 'pending' && (
                                      <div className="flex justify-end gap-2">
                                          <button 
                                            onClick={() => handleAction(leave.id, 'approved')}
                                            className="p-2 bg-emerald-50 text-emerald-600 rounded-lg hover:bg-emerald-100 transition-colors" title="Approve">
                                              <CheckCircle2 className="w-4 h-4" />
                                          </button>
                                          <button 
                                            onClick={() => handleAction(leave.id, 'rejected')}
                                            className="p-2 bg-rose-50 text-rose-600 rounded-lg hover:bg-rose-100 transition-colors" title="Reject">
                                              <XCircle className="w-4 h-4" />
                                          </button>
                                      </div>
                                  )}
                              </td>
                          </tr>
                      ))}
                  </tbody>
              </table>
          </div>
      </div>
    </div>
  );
};

export default LeaveManagement;
