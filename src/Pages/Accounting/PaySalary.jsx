import React, { useState, useEffect } from "react";
import {
  Search,
  User,
  CreditCard,
  CheckCircle,
  AlertCircle,
  Printer,
  Calculator,
  Wallet
} from "lucide-react";
import axiosInstance from "../../api/axiosInstance";
import { toast } from "react-hot-toast";

const PaySalary = () => {
  const [searchTerm, setSearchTerm] = useState("");
  const [ledgers, setLedgers] = useState([]);
  const [selectedStaff, setSelectedStaff] = useState(null);
  const [loading, setLoading] = useState(false);
  const [processing, setProcessing] = useState(false);

  // Payment State
  const [amount, setAmount] = useState("");
  const [paymentType, setPaymentType] = useState("regular");
  const [paymentMethod, setPaymentMethod] = useState("Cash");
  const [note, setNote] = useState("");

  // Voucher State
  const [showVoucher, setShowVoucher] = useState(false);
  const [paymentRecord, setPaymentRecord] = useState(null);

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

  const handleSearch = (e) => {
    e.preventDefault();
    if (!searchTerm) {
       setSelectedStaff(null);
       return;
    }
    const found = ledgers.find(l => 
       l.name.toLowerCase().includes(searchTerm.toLowerCase()) || 
       l.phone?.includes(searchTerm)
    );
    
    if (found) {
       setSelectedStaff(found);
       setAmount("");
       setNote("");
       // Auto-set payment type based on balance
       if (found.balance > 0) {
          setPaymentType("regular");
          setAmount(found.balance);
       } else {
          setPaymentType("advance");
       }
    } else {
       toast.error("No staff found with that term.");
    }
  };

  const handleConfirmPayment = async () => {
    if (!selectedStaff || !amount || parseFloat(amount) <= 0) return;

    try {
      setProcessing(true);
      const res = await axiosInstance.post('/payroll/v1/payment', {
         staff_id: selectedStaff._id,
         amount: parseFloat(amount),
         payment_type: paymentType,
         payment_method: paymentMethod,
         note: note
      });

      if (res.data.success) {
         toast.success(res.data.message);
         
         const record = {
            voucherNo: `PAY-${Date.now().toString().slice(-6)}`,
            date: new Date().toLocaleDateString('en-GB', { day: '2-digit', month: 'long', year: 'numeric' }),
            staffName: selectedStaff.name,
            staffId: selectedStaff._id,
            type: paymentType === 'advance' ? 'Advance Salary' : 'Regular Payment',
            amount: parseFloat(amount),
            method: paymentMethod,
            note: note
          };
      
          setPaymentRecord(record);
          setShowVoucher(true);
          
          fetchLedgers(); // Refresh ledgers
      }
    } catch (error) {
      toast.error(error.response?.data?.message || "Failed to process payment");
    } finally {
      setProcessing(false);
    }
  };

  const currentBalance = selectedStaff ? selectedStaff.balance : 0;
  const isDue = currentBalance > 0;
  const isAdvance = currentBalance < 0;

  return (
    <div className="max-w-6xl mx-auto p-6 space-y-8 animate-in fade-in duration-500 relative">
      {/* Header */}
      <div>
        <h1 className="text-2xl font-bold text-slate-800 tracking-tight">Pay Salary & Advances</h1>
        <p className="text-sm text-slate-500 font-medium">Issue regular payments or advance loans based on real-time ledgers</p>
      </div>

      {/* Search Bar */}
      <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm flex flex-col md:flex-row gap-4 items-center">
        <div className="relative flex-1 w-full">
          <Search className="absolute left-4 top-3.5 w-5 h-5 text-slate-400" />
          <input
            type="text"
            className="w-full pl-12 pr-4 py-3 bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-500/20 transition-all font-medium"
            placeholder="Search Staff by Name or Phone..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            onKeyDown={(e) => e.key === 'Enter' && handleSearch(e)}
          />
        </div>
        <button
          onClick={handleSearch}
          className="px-8 py-3 bg-slate-900 text-white font-bold rounded-xl shadow-lg shadow-slate-900/20 hover:scale-[1.02] active:scale-[0.98] transition-all w-full md:w-auto cursor-pointer"
        >
          Find Staff
        </button>
      </div>

      {selectedStaff && (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Left Column: Staff Profile & Balance */}
          <div className="lg:col-span-2 space-y-6">
            <div className="bg-white p-8 rounded-2xl border border-slate-200 shadow-sm flex flex-col md:flex-row items-center gap-8">
              <div className="w-24 h-24 bg-indigo-50 rounded-full flex items-center justify-center text-indigo-500 shrink-0">
                <User className="w-12 h-12" />
              </div>
              <div className="flex-1 text-center md:text-left">
                <h2 className="text-2xl font-black text-slate-800">
                  {selectedStaff.name}
                </h2>
                <div className="flex flex-wrap justify-center md:justify-start gap-4 mt-2 text-sm text-slate-500 font-medium">
                  <span className="bg-slate-100 px-3 py-1 rounded-full text-slate-600">
                    {selectedStaff.role}
                  </span>
                  <span className="text-indigo-600 px-3 py-1 bg-indigo-50 rounded-full">
                     Monthly Salary: ৳ {selectedStaff.total_salary}
                  </span>
                </div>
              </div>
            </div>

            {/* Current Ledger Balance Card */}
            <div className={`p-8 rounded-2xl shadow-sm border ${isDue ? 'bg-emerald-50 border-emerald-100' : isAdvance ? 'bg-rose-50 border-rose-100' : 'bg-slate-50 border-slate-200'}`}>
               <h3 className={`text-sm font-bold uppercase tracking-widest mb-2 ${isDue ? 'text-emerald-600' : isAdvance ? 'text-rose-600' : 'text-slate-500'}`}>
                  Current Ledger Status
               </h3>
               <div className="flex items-center justify-between">
                  <div>
                     <p className={`text-5xl font-black ${isDue ? 'text-emerald-700' : isAdvance ? 'text-rose-700' : 'text-slate-800'}`}>
                        {isAdvance ? '- ৳ ' : isDue ? '+ ৳ ' : '৳ '}
                        {Math.abs(currentBalance).toLocaleString()}
                     </p>
                     <p className={`text-sm mt-2 font-medium ${isDue ? 'text-emerald-600/80' : isAdvance ? 'text-rose-600/80' : 'text-slate-500'}`}>
                        {isDue ? 'Company owes this staff (Due Salary)' : isAdvance ? 'Staff owes company (Advance Taken)' : 'Accounts are completely cleared.'}
                     </p>
                  </div>
                  <Wallet className={`w-16 h-16 opacity-20 ${isDue ? 'text-emerald-700' : isAdvance ? 'text-rose-700' : 'text-slate-800'}`} />
               </div>
            </div>
          </div>

          {/* Right Column: Payment Processing */}
          <div className="space-y-6">
            <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm space-y-6">
              <h3 className="font-bold text-slate-800 border-b pb-4 flex items-center gap-2 uppercase text-xs tracking-widest">
                <Calculator className="w-5 h-5 text-slate-400" />
                Process Transaction
              </h3>

              <div className="space-y-5">
                 <div>
                  <label className="text-xs font-bold text-slate-500 uppercase">
                    Transaction Type
                  </label>
                  <select 
                    value={paymentType}
                    onChange={(e) => setPaymentType(e.target.value)}
                    className="w-full mt-1.5 p-3.5 border border-slate-200 rounded-xl bg-slate-50 font-bold focus:outline-none focus:ring-2 focus:ring-indigo-500/20 text-slate-700"
                  >
                    <option value="regular">Regular Payment (Clear Due)</option>
                    <option value="advance">Issue Advance / Loan</option>
                  </select>
                </div>

                <div>
                  <label className="text-xs font-bold text-slate-500 uppercase">
                    Disbursed Amount (৳)
                  </label>
                  <input
                    type="number"
                    className="w-full mt-1.5 p-3.5 border border-slate-200 rounded-xl font-black text-2xl focus:outline-none focus:ring-2 focus:ring-indigo-500/20 text-indigo-700 bg-indigo-50/30"
                    placeholder="0"
                    value={amount}
                    onChange={(e) => setAmount(e.target.value)}
                  />
                </div>

                <div>
                  <label className="text-xs font-bold text-slate-500 uppercase">
                    Payment Method
                  </label>
                  <select 
                    value={paymentMethod}
                    onChange={(e) => setPaymentMethod(e.target.value)}
                    className="w-full mt-1.5 p-3 border border-slate-200 rounded-xl bg-white font-medium focus:outline-none focus:ring-2 focus:ring-indigo-500/20"
                  >
                    <option>Cash</option>
                    <option>Bank Transfer</option>
                    <option>Mobile Banking</option>
                  </select>
                </div>

                <div>
                  <label className="text-xs font-bold text-slate-500 uppercase">
                    Remarks / Note
                  </label>
                  <input
                    type="text"
                    className="w-full mt-1.5 p-3 border border-slate-200 rounded-xl font-medium text-slate-600 focus:outline-none focus:ring-2 focus:ring-indigo-500/20"
                    placeholder="e.g. Eid Advance"
                    value={note}
                    onChange={(e) => setNote(e.target.value)}
                  />
                </div>
              </div>

              <button 
                onClick={handleConfirmPayment}
                disabled={processing}
                className="w-full py-4 mt-4 bg-indigo-600 text-white font-black rounded-xl shadow-lg shadow-indigo-200 hover:bg-indigo-700 transition-all flex items-center justify-center gap-2 cursor-pointer disabled:opacity-50"
              >
                {processing ? "Processing..." : (
                  <>
                     <CheckCircle className="w-5 h-5" />
                     CONFIRM TRANSACTION
                  </>
                )}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Branded Voucher Modal */}
      {showVoucher && paymentRecord && (
        <div className="fixed inset-0 z-[100] overflow-y-auto bg-slate-900/60 backdrop-blur-sm animate-in fade-in duration-300 flex justify-center py-10 px-4">
          <div className="bg-white w-full max-w-2xl h-fit rounded-[32px] shadow-2xl relative print:p-0 print:shadow-none print:w-full print:max-w-none">
            
            {/* Modal Header */}
            <div className="p-6 bg-slate-50 border-b flex justify-between items-center print:hidden rounded-t-[32px]">
               <h3 className="text-lg font-black text-slate-800 uppercase tracking-tight">Transaction Successful</h3>
               <button onClick={() => setShowVoucher(false)} className="text-slate-400 hover:text-slate-600 transition-colors">
                  <AlertCircle className="w-6 h-6 rotate-45" />
               </button>
            </div>

            {/* Voucher Content */}
            <div id="salary-voucher" className="p-10 space-y-8 font-sans">
               <div className="flex justify-between items-start border-b-2 border-slate-900 pb-8">
                  <div className="space-y-2">
                     <h2 className="text-2xl font-black text-slate-900 uppercase tracking-tighter">Madrasatul Madina</h2>
                     <p className="text-xs font-bold text-slate-500 uppercase tracking-widest">Dhaka, Bangladesh</p>
                  </div>
                  <div className="text-right">
                     <div className="inline-block bg-slate-900 text-white px-6 py-2 rounded-lg font-black text-xs uppercase tracking-widest mb-4">PAYMENT VOUCHER</div>
                     <p className="text-xs font-black text-slate-400 uppercase tracking-tighter">Ref: <span className="text-slate-900">{paymentRecord.voucherNo}</span></p>
                     <p className="text-xs font-black text-slate-400 uppercase tracking-tighter mt-1">Date: <span className="text-slate-900">{paymentRecord.date}</span></p>
                  </div>
               </div>

               <div className="grid grid-cols-2 gap-10 bg-slate-50 p-6 rounded-2xl border border-slate-100">
                  <div>
                    <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-2">Issued To</p>
                    <p className="text-lg font-black text-slate-800">{paymentRecord.staffName}</p>
                  </div>
                  <div>
                    <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-2">Payment Details</p>
                    <p className="text-sm font-bold text-slate-600 uppercase">{paymentRecord.type}</p>
                    <p className="text-xs font-bold text-slate-500 mt-1">Method: {paymentRecord.method}</p>
                  </div>
               </div>

               <div className="py-8 flex items-center justify-between border-y-2 border-dashed border-slate-200">
                  <p className="text-sm font-black text-slate-800 uppercase tracking-wider">Total Amount Paid</p>
                  <p className="text-4xl font-black text-slate-900">৳ {paymentRecord.amount.toLocaleString()}</p>
               </div>
               
               {paymentRecord.note && (
                 <p className="text-sm font-bold text-slate-500 italic text-center">Note: {paymentRecord.note}</p>
               )}

               <div className="pt-20 grid grid-cols-2 gap-20">
                  <div className="border-t border-slate-900 pt-4">
                     <p className="text-xs font-black text-slate-900 uppercase text-center tracking-widest italic">Recipient Signature</p>
                  </div>
                  <div className="border-t border-slate-900 pt-4 text-right">
                     <p className="text-xs font-black text-slate-900 uppercase text-center tracking-widest italic">Authorized By</p>
                  </div>
               </div>
            </div>

            {/* Modal Controls */}
            <div className="p-8 bg-slate-50 border-t flex justify-center gap-4 print:hidden rounded-b-[32px]">
               <button 
                  onClick={() => window.print()}
                  className="px-10 py-4 bg-slate-900 text-white font-black rounded-2xl text-xs uppercase tracking-widest hover:scale-105 active:scale-95 transition-all flex items-center gap-2"
               >
                  <Printer className="w-4 h-4" /> Print Voucher
               </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default PaySalary;
