import React, { useState, useEffect } from "react";
import {
  Users,
  CheckCircle,
  Clock,
  AlertTriangle,
  Banknote,
  Search,
  Download,
  Calendar,
  Play
} from "lucide-react";
import { useTranslation } from "react-i18next";
import { Link } from "react-router-dom"; // Fixed from react-router to react-router-dom
import SalarySetupModal from "../../components/SalarySetupModal";
import axiosInstance from "../../api/axiosInstance";
import { toast } from "react-hot-toast";

const PayrollProcess = () => {
  const { t } = useTranslation();
  
  const [loading, setLoading] = useState(false);
  const [generating, setGenerating] = useState(false);
  const [openSalarySetupModal, setOpenSalarySetupModal] = useState(false);
  const [ledgers, setLedgers] = useState([]);
  
  const [month, setMonth] = useState(new Date().getMonth() + 1);
  const [year, setYear] = useState(new Date().getFullYear());

  const months = [
    { value: 1, label: "January" }, { value: 2, label: "February" },
    { value: 3, label: "March" }, { value: 4, label: "April" },
    { value: 5, label: "May" }, { value: 6, label: "June" },
    { value: 7, label: "July" }, { value: 8, label: "August" },
    { value: 9, label: "September" }, { value: 10, label: "October" },
    { value: 11, label: "November" }, { value: 12, label: "December" }
  ];

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

  useEffect(() => {
    fetchLedgers();
  }, []);

  const handleGenerate = async () => {
    if (!window.confirm(`Are you sure you want to generate payroll for ${months.find(m => m.value == month).label} ${year}?`)) {
      return;
    }
    try {
      setGenerating(true);
      const res = await axiosInstance.post('/payroll/v1/generate', { month, year });
      if (res.data.success) {
        toast.success(res.data.message);
        fetchLedgers(); // Refresh data to show updated balances
      }
    } catch (error) {
      toast.error(error.response?.data?.message || "Failed to generate payroll");
    } finally {
      setGenerating(false);
    }
  };

  const totalPayable = ledgers.filter(l => l.balance > 0).reduce((acc, curr) => acc + curr.balance, 0);
  const totalAdvance = Math.abs(ledgers.filter(l => l.balance < 0).reduce((acc, curr) => acc + curr.balance, 0));

  return (
    <div className="max-w-7xl mx-auto p-6 space-y-8 animate-in fade-in duration-500">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-slate-800">
            Payroll Generation
          </h1>
          <p className="text-sm text-slate-500 mt-1">Generate monthly salaries and view current ledger balances</p>
        </div>
        <div className="flex gap-3">
          <Link to={"/admin/accounting/payroll/history"}>
            <button className="px-4 py-2 border border-slate-200 rounded-lg text-slate-600 font-semibold hover:bg-slate-50 cursor-pointer transition-colors">
              Ledger History
            </button>
          </Link>
          <button
            onClick={() => setOpenSalarySetupModal(true)}
            className="px-6 py-2 bg-indigo-600 text-white font-bold rounded-lg shadow-lg shadow-indigo-600/20 hover:scale-105 transition-all cursor-pointer"
          >
            Salary Setup
          </button>
        </div>
      </div>

      {/* Generation Panel */}
      <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm flex flex-col md:flex-row items-end gap-4">
         <div className="w-full md:w-1/3">
            <label className="block text-xs font-bold text-slate-500 uppercase mb-2">Select Month</label>
            <div className="relative">
              <Calendar className="absolute left-3 top-2.5 w-5 h-5 text-slate-400" />
              <select 
                value={month} 
                onChange={(e) => setMonth(e.target.value)}
                className="w-full pl-10 pr-4 py-2 border border-slate-200 rounded-lg focus:outline-none focus:border-indigo-500 bg-white"
              >
                {months.map(m => (
                  <option key={m.value} value={m.value}>{m.label}</option>
                ))}
              </select>
            </div>
         </div>
         <div className="w-full md:w-1/3">
            <label className="block text-xs font-bold text-slate-500 uppercase mb-2">Select Year</label>
            <select 
              value={year} 
              onChange={(e) => setYear(e.target.value)}
              className="w-full px-4 py-2 border border-slate-200 rounded-lg focus:outline-none focus:border-indigo-500 bg-white"
            >
              {[2024, 2025, 2026, 2027, 2028].map(y => (
                <option key={y} value={y}>{y}</option>
              ))}
            </select>
         </div>
         <div className="w-full md:w-1/3">
            <button 
              onClick={handleGenerate}
              disabled={generating}
              className="w-full flex items-center justify-center gap-2 px-6 py-2.5 bg-slate-900 text-white font-bold rounded-lg hover:bg-slate-800 transition-colors disabled:opacity-50"
            >
              {generating ? (
                <span className="w-5 h-5 border-2 border-white/20 border-t-white rounded-full animate-spin"></span>
              ) : (
                <Play className="w-4 h-4 fill-current" />
              )}
              {generating ? "Generating..." : "Generate Payroll"}
            </button>
         </div>
      </div>

      {/* Summary Stats */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="bg-gradient-to-br from-emerald-500 to-teal-600 p-6 rounded-2xl shadow-lg shadow-teal-500/20 text-white">
          <p className="text-xs font-bold text-teal-100 uppercase tracking-widest mb-2">
            Total Due Payable (Company Owes)
          </p>
          <h3 className="text-4xl font-black">৳ {totalPayable.toLocaleString()}</h3>
        </div>
        <div className="bg-gradient-to-br from-rose-500 to-pink-600 p-6 rounded-2xl shadow-lg shadow-rose-500/20 text-white">
          <p className="text-xs font-bold text-pink-100 uppercase tracking-widest mb-2">
            Total Advance (Staff Owes)
          </p>
          <h3 className="text-4xl font-black">৳ {totalAdvance.toLocaleString()}</h3>
        </div>
      </div>

      {/* Ledger Table */}
      <div className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden">
        <div className="p-4 border-b border-slate-200 bg-slate-50 flex items-center justify-between gap-4">
          <div className="flex items-center gap-2 text-slate-500">
            <Users className="w-5 h-5" />
            <span className="font-bold text-sm uppercase">Current Ledger Balances</span>
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-slate-50 text-slate-500 text-xs uppercase font-bold tracking-wider">
                <th className="p-4 border-b border-slate-200">Staff Name</th>
                <th className="p-4 border-b border-slate-200">Role</th>
                <th className="p-4 border-b border-slate-200">Setup Basic</th>
                <th className="p-4 border-b border-slate-200">Setup Total</th>
                <th className="p-4 border-b border-slate-200 text-right">Current Balance</th>
                <th className="p-4 border-b border-slate-200 text-center">Status</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {loading ? (
                <tr>
                  <td colSpan="6" className="p-8 text-center text-slate-500">Loading ledgers...</td>
                </tr>
              ) : ledgers.length === 0 ? (
                 <tr>
                  <td colSpan="6" className="p-8 text-center text-slate-500">No staff records found.</td>
                </tr>
              ) : ledgers.map((emp) => {
                const isAdvance = emp.balance < 0;
                const isDue = emp.balance > 0;
                
                return (
                  <tr key={emp._id} className="hover:bg-slate-50/50 transition-colors whitespace-nowrap">
                    <td className="p-4 font-bold text-slate-800">{emp.name}</td>
                    <td className="p-4 text-slate-500 text-sm">{emp.role}</td>
                    <td className="p-4 text-slate-600 font-medium">৳ {emp.basic_salary}</td>
                    <td className="p-4 text-indigo-600 font-medium">৳ {emp.total_salary}</td>
                    <td className="p-4 text-right">
                       <span className={`font-black text-lg ${isAdvance ? 'text-rose-600' : isDue ? 'text-emerald-600' : 'text-slate-400'}`}>
                          {isAdvance ? '- ৳ ' : isDue ? '+ ৳ ' : '৳ '}
                          {Math.abs(emp.balance).toLocaleString()}
                       </span>
                    </td>
                    <td className="p-4 text-center">
                      {isAdvance ? (
                        <span className="inline-flex items-center gap-1 px-2.5 py-1 bg-rose-100 text-rose-700 text-[10px] font-bold uppercase rounded-full border border-rose-200">
                          Advance
                        </span>
                      ) : isDue ? (
                        <span className="inline-flex items-center gap-1 px-2.5 py-1 bg-emerald-100 text-emerald-700 text-[10px] font-bold uppercase rounded-full border border-emerald-200">
                          Due Payable
                        </span>
                      ) : (
                         <span className="inline-flex items-center gap-1 px-2.5 py-1 bg-slate-100 text-slate-600 text-[10px] font-bold uppercase rounded-full border border-slate-200">
                          Cleared
                        </span>
                      )}
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>

      {openSalarySetupModal && (
        <SalarySetupModal onClose={() => setOpenSalarySetupModal(false)} />
      )}
    </div>
  );
};

export default PayrollProcess;
