import React, { useState, useEffect, useMemo } from "react";
import { 
  Receipt, 
  Search, 
  History,
  TrendingUp,
  CreditCard,
  CheckCircle2,
  AlertCircle,
  FileText,
  Calendar,
  X
} from "lucide-react";
import axiosInstance from "../../api/axiosInstance";
import { toast } from "react-hot-toast";
import { useTranslation } from "react-i18next";
import { Link } from "react-router-dom";

const SalaryHistory = () => {
  const { t } = useTranslation();
  const [searchTerm, setSearchTerm] = useState("");
  const [ledgers, setLedgers] = useState([]);
  const [loading, setLoading] = useState(false);
  
  // Statement Modal State
  const [selectedStaff, setSelectedStaff] = useState(null);
  const [history, setHistory] = useState([]);
  const [historyLoading, setHistoryLoading] = useState(false);

  useEffect(() => {
    fetchLedgers();
  }, []);

  const fetchLedgers = async () => {
    try {
      setLoading(true);
      const res = await axiosInstance.get('/payroll/v1/ledgers');
      if (res.data.success) {
        setLedgers(res.data.data);
      }
    } catch (error) {
      toast.error(error.response?.data?.message || "Failed to fetch ledgers");
    } finally {
      setLoading(false);
    }
  };

  const fetchHistory = async (staff) => {
    setSelectedStaff(staff);
    try {
      setHistoryLoading(true);
      const res = await axiosInstance.get(`/payroll/v1/history/${staff._id}`);
      if (res.data.success) {
        setHistory(res.data.data);
      }
    } catch (error) {
      toast.error(error.response?.data?.message || "Failed to fetch history");
      setSelectedStaff(null);
    } finally {
      setHistoryLoading(false);
    }
  };

  const filteredLedgers = useMemo(() => {
    return ledgers.filter(record => 
      record.name.toLowerCase().includes(searchTerm.toLowerCase()) || 
      record.role.toLowerCase().includes(searchTerm.toLowerCase())
    );
  }, [ledgers, searchTerm]);

  const totalDue = ledgers.filter(l => l.balance > 0).reduce((acc, curr) => acc + curr.balance, 0);
  const totalAdvance = Math.abs(ledgers.filter(l => l.balance < 0).reduce((acc, curr) => acc + curr.balance, 0));

  return (
    <div className="min-h-screen bg-slate-50/50 p-4 md:p-8 animate-in fade-in duration-500">
      <div className="max-w-7xl mx-auto space-y-8">
        
        {/* Header Section */}
        <div className="bg-white rounded-[20px] border border-slate-200 p-6 md:p-8 shadow-sm flex flex-col lg:flex-row justify-between items-start lg:items-center gap-6">
          <div className="flex items-center gap-4 md:gap-6">
            <div className="w-12 h-12 md:w-16 md:h-16 bg-blue-50 rounded-xl md:rounded-2xl flex items-center justify-center border border-blue-100 shadow-inner shrink-0 text-blue-600">
              <History className="w-6 h-6 md:w-8 md:h-8" />
            </div>
            <div>
              <h1 className="text-xl md:text-3xl font-black text-slate-800 tracking-tight leading-none">Ledger Statement</h1>
              <p className="text-sm text-slate-500 mt-2 font-medium">View detailed transaction history and balances for all staff.</p>
            </div>
          </div>
          <Link to="/admin/accounting/payroll/pay">
            <button className="px-8 py-3 bg-slate-900 text-white font-bold rounded-xl shadow-lg shadow-slate-900/20 hover:scale-[1.02] active:scale-[0.98] transition-all cursor-pointer">
              Go to Payments
            </button>
          </Link>
        </div>

        {/* Statistics Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 md:gap-6">
            <div className="bg-white rounded-[2rem] border border-slate-200 p-5 md:p-6 shadow-sm group">
              <div className="flex justify-between items-center mb-4">
                <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Total Company Liability (Due)</p>
                <div className={`w-10 h-10 rounded-xl flex items-center justify-center bg-emerald-50 text-emerald-600`}>
                  <CreditCard className="w-5 h-5" />
                </div>
              </div>
              <div>
                <h4 className="text-2xl md:text-4xl font-black text-emerald-700 tracking-tight">৳ {totalDue.toLocaleString()}</h4>
              </div>
            </div>

            <div className="bg-white rounded-[2rem] border border-slate-200 p-5 md:p-6 shadow-sm group">
              <div className="flex justify-between items-center mb-4">
                <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Total Issued Advances</p>
                <div className={`w-10 h-10 rounded-xl flex items-center justify-center bg-rose-50 text-rose-600`}>
                  <TrendingUp className="w-5 h-5" />
                </div>
              </div>
              <div>
                <h4 className="text-2xl md:text-4xl font-black text-rose-700 tracking-tight">৳ {totalAdvance.toLocaleString()}</h4>
              </div>
            </div>
        </div>

        {/* Ledger List Section */}
        <div className="bg-white rounded-[20px] border border-slate-200 shadow-sm overflow-hidden">
          <div className="p-5 border-b border-slate-50 bg-slate-50 flex flex-col md:flex-row justify-between items-center gap-4">
             <div className="flex items-center gap-3 w-full md:w-auto">
                <h2 className="text-xl font-black text-slate-800 tracking-tight">Staff Ledgers</h2>
             </div>
             <div className="relative w-full md:w-80">
                <Search className="absolute left-3 top-2.5 w-4 h-4 text-slate-400" />
                <input
                  type="text"
                  placeholder="Search by name or role..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="w-full pl-9 pr-4 py-2 text-sm border border-slate-200 rounded-lg focus:outline-none focus:border-indigo-500"
                />
             </div>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full border-collapse">
              <thead>
                <tr className="border-b border-slate-100 text-[10px] font-black text-slate-400 uppercase tracking-widest bg-slate-50/50">
                  <th className="px-6 py-4 text-left">Staff Info</th>
                  <th className="px-6 py-4 text-center">Base Salary</th>
                  <th className="px-6 py-4 text-right">Current Balance</th>
                  <th className="px-6 py-4 text-center">Status</th>
                  <th className="px-6 py-4 text-right">Action</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-50">
                {loading ? (
                   <tr>
                    <td colSpan="5" className="px-8 py-20 text-center text-slate-400 font-bold">Loading ledgers...</td>
                  </tr>
                ) : filteredLedgers.length > 0 ? (
                  filteredLedgers.map((record) => {
                     const isDue = record.balance > 0;
                     const isAdvance = record.balance < 0;

                     return (
                        <tr key={record._id} className="group hover:bg-slate-50/50 transition-all whitespace-nowrap">
                           <td className="px-6 py-4">
                           <div className="flex items-center gap-3">
                              <div className="w-10 h-10 bg-indigo-50 rounded-lg flex items-center justify-center font-black text-indigo-600 shrink-0">
                                 {record.name.charAt(0)}
                              </div>
                              <div>
                                 <p className="text-sm font-black text-slate-800">{record.name}</p>
                                 <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">{record.role}</p>
                              </div>
                           </div>
                           </td>
                           <td className="px-6 py-4 text-center">
                              <span className="text-sm font-bold text-slate-600">৳ {record.basic_salary}</span>
                           </td>
                           <td className="px-6 py-4 text-right">
                              <span className={`text-lg font-black ${isDue ? 'text-emerald-600' : isAdvance ? 'text-rose-600' : 'text-slate-400'}`}>
                                 {isAdvance ? '- ৳ ' : isDue ? '+ ৳ ' : '৳ '}
                                 {Math.abs(record.balance).toLocaleString()}
                              </span>
                           </td>
                           <td className="px-6 py-4 text-center">
                              {isAdvance ? (
                                 <span className="inline-flex items-center px-2.5 py-1 bg-rose-50 text-rose-600 text-[10px] font-black uppercase rounded-lg border border-rose-100">Advance</span>
                              ) : isDue ? (
                                 <span className="inline-flex items-center px-2.5 py-1 bg-emerald-50 text-emerald-600 text-[10px] font-black uppercase rounded-lg border border-emerald-100">Due</span>
                              ) : (
                                 <span className="inline-flex items-center px-2.5 py-1 bg-slate-100 text-slate-500 text-[10px] font-black uppercase rounded-lg">Cleared</span>
                              )}
                           </td>
                           <td className="px-6 py-4 text-right">
                           <button 
                              onClick={() => fetchHistory(record)}
                              className="px-4 py-2 bg-white text-indigo-600 border border-indigo-200 font-bold text-xs uppercase rounded-lg hover:bg-indigo-50 transition-colors"
                           >
                              View Statement
                           </button>
                           </td>
                        </tr>
                     )
                  })
                ) : (
                  <tr>
                    <td colSpan="5" className="px-8 py-20 text-center">
                       <div className="flex flex-col items-center gap-4">
                          <p className="text-slate-400 font-bold uppercase tracking-widest text-xs">No ledgers found.</p>
                       </div>
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>
      </div>

      {/* Statement Modal */}
      {selectedStaff && (
         <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-sm flex items-center justify-center p-4 animate-in fade-in duration-200">
            <div className="bg-white rounded-3xl w-full max-w-4xl max-h-[90vh] flex flex-col overflow-hidden shadow-2xl">
               <div className="p-6 border-b border-slate-100 flex justify-between items-center bg-slate-50">
                  <div>
                     <h2 className="text-xl font-black text-slate-800">Ledger Statement</h2>
                     <p className="text-sm font-bold text-slate-500 mt-1">{selectedStaff.name} • {selectedStaff.role}</p>
                  </div>
                  <button onClick={() => setSelectedStaff(null)} className="p-2 hover:bg-slate-200 rounded-full transition-colors text-slate-500">
                     <X className="w-5 h-5" />
                  </button>
               </div>
               
               <div className="p-6 flex-1 overflow-y-auto bg-slate-50/50">
                  <div className="space-y-4">
                     {historyLoading ? (
                        <p className="text-center text-slate-500 font-bold p-10">Loading history...</p>
                     ) : history.length > 0 ? (
                        history.map((item, idx) => (
                           <div key={idx} className="bg-white p-5 rounded-2xl border border-slate-100 shadow-sm flex items-center justify-between">
                              <div className="flex items-center gap-4">
                                 <div className={`w-12 h-12 rounded-xl flex items-center justify-center font-black ${
                                    item.type === 'generation' ? 'bg-indigo-50 text-indigo-600' :
                                    item.type === 'advance' ? 'bg-rose-50 text-rose-600' :
                                    'bg-emerald-50 text-emerald-600'
                                 }`}>
                                    {item.type === 'generation' ? <Calendar className="w-5 h-5" /> :
                                     item.type === 'advance' ? <TrendingUp className="w-5 h-5" /> :
                                     <Receipt className="w-5 h-5" />}
                                 </div>
                                 <div>
                                    <p className="font-bold text-slate-800">{item.title}</p>
                                    <p className="text-xs font-bold text-slate-400 mt-1">
                                       {new Date(item.date).toLocaleDateString('en-GB', { day: '2-digit', month: 'short', year: 'numeric' })}
                                       {item.method && ` • via ${item.method}`}
                                    </p>
                                 </div>
                              </div>
                              <div className="text-right">
                                 <p className={`text-xl font-black ${
                                    item.sign === '+' ? 'text-emerald-600' : 'text-rose-600'
                                 }`}>
                                    {item.sign} ৳ {item.amount.toLocaleString()}
                                 </p>
                              </div>
                           </div>
                        ))
                     ) : (
                        <div className="text-center py-20 bg-white rounded-2xl border border-slate-100">
                           <FileText className="w-10 h-10 text-slate-300 mx-auto mb-3" />
                           <p className="text-slate-500 font-bold">No transactions found for this staff.</p>
                        </div>
                     )}
                  </div>
               </div>
               
               <div className="p-6 border-t border-slate-100 bg-white flex justify-between items-center">
                  <p className="text-sm font-bold text-slate-500 uppercase tracking-widest">Ending Balance</p>
                  <p className={`text-3xl font-black ${selectedStaff.balance > 0 ? 'text-emerald-600' : selectedStaff.balance < 0 ? 'text-rose-600' : 'text-slate-800'}`}>
                     {selectedStaff.balance < 0 ? '- ৳ ' : selectedStaff.balance > 0 ? '+ ৳ ' : '৳ '}
                     {Math.abs(selectedStaff.balance).toLocaleString()}
                  </p>
               </div>
            </div>
         </div>
      )}

    </div>
  );
};

export default SalaryHistory;
