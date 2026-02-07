import React, { useState, useEffect } from "react";
import {
  Search,
  User,
  CreditCard,
  CheckCircle,
  AlertCircle,
  Printer,
  Calculator,
} from "lucide-react";

const PaySalary = () => {
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedStudent, setSelectedStudent] = useState(null);

  // Payment State
  const [selectedFeeIds, setSelectedFeeIds] = useState([]);
  const [discount, setDiscount] = useState("");
  const [paidAmount, setPaidAmount] = useState("");
  const [paymentMethod, setPaymentMethod] = useState("Cash");

  // Voucher State
  const [showVoucher, setShowVoucher] = useState(false);
  const [paymentRecord, setPaymentRecord] = useState(null);

  const handleSearch = (e) => {
    e.preventDefault();
    // Simulate finding a student
    const student = {
      id: "EMP-2025-001",
      name: "Muhammad Ibrahim",
      class: "Senior Teacher",
      guardian: "N/A",
      address: "Mirpur, Dhaka",
      fees: [
        { id: 1, head: "Basic Salary (Jan)", amount: 15000, isPaid: false },
        { id: 2, head: "House Rent Allowance", amount: 5000, isPaid: false },
        { id: 3, head: "Medical Allowance", amount: 2000, isPaid: false },
      ],
    };
    setSelectedStudent(student);
    // Auto-select all unpaid fees initially
    setSelectedFeeIds(student.fees.filter((f) => !f.isPaid).map((f) => f.id));
    // Reset payment fields
    setDiscount("");
    setPaidAmount("");
  };

  const toggleFeeSelection = (id) => {
    setSelectedFeeIds((prev) =>
      prev.includes(id) ? prev.filter((feeId) => feeId !== id) : [...prev, id]
    );
  };

  // Calculations
  const selectedFees =
    selectedStudent?.fees.filter((f) => selectedFeeIds.includes(f.id)) || [];
  const subTotal = selectedFees.reduce((acc, curr) => acc + curr.amount, 0);
  const discountVal = parseFloat(discount) || 0;
  const grandTotal = Math.max(0, subTotal - discountVal);
  const paidVal = parseFloat(paidAmount) || 0;
  const due = Math.max(0, grandTotal - paidVal);

  // Auto-fill paid amount when fees are selected (standard behavior)
  useEffect(() => {
    if (subTotal > 0 && discount === "" && paidAmount === "") {
      setPaidAmount(subTotal);
    }
  }, [subTotal]);

  const handleConfirmPayment = () => {
    if (!selectedStudent || paidVal <= 0) return;

    const record = {
      voucherNo: `SV-${Date.now().toString().slice(-6)}`,
      date: new Date().toLocaleDateString('en-GB', { day: '2-digit', month: 'long', year: 'numeric' }),
      staffName: selectedStudent.name,
      staffId: selectedStudent.id,
      address: selectedStudent.address || "Dhaka, Bangladesh",
      items: selectedFees.map(f => ({ head: f.head, amount: f.amount })),
      subTotal: subTotal,
      discount: discountVal,
      grandTotal: grandTotal,
      paidAmount: paidVal,
      due: due,
      method: paymentMethod
    };

    setPaymentRecord(record);
    setShowVoucher(true);
  };

  return (
    <div className="max-w-5xl mx-auto p-6 space-y-8 animate-in fade-in duration-500 relative">
      {/* Header */}
      <div>
        <h1 className="text-2xl font-bold text-slate-800 tracking-tight">Pay Salary</h1>
        <p className="text-sm text-slate-500 font-medium">Process staff payroll and generate payment vouchers</p>
      </div>

      {/* Search Bar */}
      <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm flex flex-col md:flex-row gap-4 items-center">
        <div className="relative flex-1 w-full">
          <Search className="absolute left-4 top-3.5 w-5 h-5 text-slate-400" />
          <input
            type="text"
            className="w-full pl-12 pr-4 py-3 bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-primary/20 transition-all font-medium"
            placeholder="Search by Employee ID or Phone Number"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
        <button
          onClick={handleSearch}
          className="px-8 py-3 bg-primary text-white font-bold rounded-xl shadow-lg shadow-primary/20 hover:scale-[1.02] active:scale-[0.98] transition-all w-full md:w-auto cursor-pointer"
        >
          Find Employee
        </button>
      </div>

      {selectedStudent && (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Left Column: Student Profile & Fee Selection */}
          <div className="lg:col-span-2 space-y-6">
            {/* Student Mini Profile */}
            <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm flex items-center gap-6">
              <div className="w-20 h-20 bg-[#00bd7f]/10 rounded-2xl flex items-center justify-center text-[#00bd7f]">
                <User className="w-10 h-10" />
              </div>
              <div>
                <h2 className="text-xl font-bold text-slate-800">
                  {selectedStudent.name}
                </h2>
                <div className="flex gap-4 mt-1 text-sm text-slate-500 font-medium">
                  <span className="bg-slate-100 px-2 py-0.5 rounded text-slate-600">
                    {selectedStudent.id}
                  </span>
                  <span className="text-[#00bd7f]">{selectedStudent.class}</span>
                </div>
                <p className="text-xs text-slate-400 mt-1 uppercase font-bold tracking-wider">
                  Address: {selectedStudent.address || "Dhaka"}
                </p>
              </div>
            </div>

            {/* Payable Fees List */}
            <div className="bg-white border border-slate-200 rounded-2xl shadow-sm overflow-hidden">
              <div className="p-4 bg-slate-50 border-b border-slate-200 flex justify-between items-center">
                <h3 className="font-bold text-slate-700">Select Components</h3>
                <div className="flex gap-2">
                  <select
                    className="px-3 py-1.5 text-xs font-bold border border-slate-300 rounded-lg text-slate-600 focus:outline-none hover:border-primary"
                    onChange={(e) => {
                      if (e.target.value) {
                        const newFeeId =
                          selectedStudent.fees.length + Math.random();
                        const newFee = {
                          id: newFeeId,
                          head: `${e.target.value} Allowance`,
                          amount: 1000,
                          isPaid: false,
                        };
                        setSelectedStudent((prev) => ({
                          ...prev,
                          fees: [...prev.fees, newFee],
                        }));
                        setSelectedFeeIds((prev) => [...prev, newFeeId]);
                        e.target.value = ""; // Reset
                      }
                    }}
                  >
                    <option value="">+ Add Component</option>
                    <option value="Overtime">Overtime</option>
                    <option value="Bonus">Bonus</option>
                    <option value="Travel">Travel</option>
                  </select>
                </div>
              </div>
              <div className="divide-y divide-slate-100 max-h-[400px] overflow-y-auto">
                {selectedStudent.fees
                  .filter((f) => !f.isPaid)
                  .map((fee) => (
                    <div
                      key={fee.id}
                      className={`p-4 flex items-center justify-between group transition-colors cursor-pointer ${
                        selectedFeeIds.includes(fee.id)
                          ? "bg-primary/5"
                          : "hover:bg-slate-50"
                      }`}
                      onClick={() => toggleFeeSelection(fee.id)}
                    >
                      <div className="flex items-center gap-4">
                        <input
                          type="checkbox"
                          className="w-5 h-5 rounded border-slate-300 text-primary focus:ring-primary pointer-events-none"
                          checked={selectedFeeIds.includes(fee.id)}
                          readOnly
                        />
                        <div>
                          <p className="font-bold text-slate-800">{fee.head}</p>
                          <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">
                            Payroll Component
                          </p>
                        </div>
                      </div>
                      <p className="font-bold text-slate-800">৳ {fee.amount}</p>
                    </div>
                  ))}
              </div>
              <div className="p-4 bg-slate-50 border-t border-slate-200">
                <div className="flex justify-between items-center text-slate-600">
                  <span className="text-sm font-bold uppercase tracking-widest text-slate-400">Subtotal</span>
                  <span className="text-xl font-black text-slate-900">৳ {subTotal}</span>
                </div>
              </div>
            </div>
          </div>

          {/* Right Column: Payment & Calculation */}
          <div className="space-y-6">
            <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm space-y-6">
              <h3 className="font-bold text-slate-800 border-b pb-2 flex items-center gap-2 uppercase text-xs tracking-widest">
                <Calculator className="w-5 h-5 text-slate-400" />
                Payment Summary
              </h3>

              <div className="space-y-4">
                {/* Discount Field */}
                <div>
                  <label className="text-xs font-bold text-slate-500 uppercase flex justify-between">
                    Deductions / Adjust.
                  </label>
                  <input
                    type="number"
                    className="w-full mt-1 p-3 border border-slate-200 rounded-xl font-bold text-lg text-slate-600 focus:outline-none focus:ring-2 focus:ring-primary/20"
                    placeholder="0"
                    value={discount}
                    onChange={(e) => setDiscount(e.target.value)}
                  />
                </div>

                {/* Grand Total Display */}
                <div className="flex justify-between items-center py-2 border-y border-dashed border-slate-200">
                  <span className="font-bold text-slate-700">Net Payable</span>
                  <span className="font-black text-2xl text-[#00bd7f]">
                    ৳ {grandTotal}
                  </span>
                </div>

                {/* Paid Amount Input */}
                <div>
                  <label className="text-xs font-bold text-slate-500 uppercase">
                    Disbursed Amount
                  </label>
                  <input
                    type="number"
                    className="w-full mt-1 p-3 border border-slate-200 rounded-xl font-bold text-2xl focus:outline-none focus:ring-2 focus:ring-primary/20 text-slate-800"
                    placeholder="0"
                    value={paidAmount}
                    onChange={(e) => setPaidAmount(e.target.value)}
                  />
                </div>

                <div>
                  <label className="text-xs font-bold text-slate-500 uppercase">
                    Payment Method
                  </label>
                  <select 
                    value={paymentMethod}
                    onChange={(e) => setPaymentMethod(e.target.value)}
                    className="w-full mt-1 p-3 border border-slate-200 rounded-xl bg-white font-medium focus:outline-none focus:ring-2 focus:ring-primary/20"
                  >
                    <option>Cash</option>
                    <option>Bank Transfer</option>
                    <option>Mobile Banking</option>
                  </select>
                </div>
              </div>

              <button 
                onClick={handleConfirmPayment}
                className="w-full py-4 bg-[#00bd7f] text-white font-bold rounded-xl shadow-lg shadow-emerald-100 hover:scale-[1.02] active:scale-[0.98] transition-all flex items-center justify-center gap-2 cursor-pointer"
              >
                <CheckCircle className="w-5 h-5" />
                CONFIRM PAYMENT
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Branded Voucher Modal */}
      {showVoucher && paymentRecord && (
        <div className="fixed inset-0 z-[100] overflow-y-auto bg-slate-900/60 backdrop-blur-sm animate-in fade-in duration-300 flex justify-center py-10 px-4">
          <div className="bg-white w-full max-w-2xl h-fit rounded-[32px] shadow-2xl relative print:p-0 print:shadow-none print:w-full print:max-w-none">
            
            {/* Modal Header (Hidden on Print) */}
            <div className="p-6 bg-slate-50 border-b flex justify-between items-center print:hidden rounded-t-[32px]">
               <h3 className="text-lg font-black text-slate-800 uppercase tracking-tight">Payment Successful</h3>
               <button onClick={() => setShowVoucher(false)} className="text-slate-400 hover:text-slate-600 transition-colors">
                  <AlertCircle className="w-6 h-6 rotate-45" />
               </button>
            </div>

            {/* Voucher Content */}
            <div id="salary-voucher" className="p-10 space-y-8 font-outfit">
               {/* Institutional Header */}
               <div className="flex justify-between items-start border-b-2 border-slate-900 pb-8">
                  <div className="space-y-2">
                     <div className="w-12 h-12 bg-slate-900 rounded-xl flex items-center justify-center text-white font-black text-2xl">M</div>
                     <h2 className="text-2xl font-black text-slate-900 uppercase">Madrasatul Madina</h2>
                     <p className="text-sm font-bold text-slate-500 uppercase tracking-widest">Mirpur-10, Dhaka-1216, Bangladesh</p>
                  </div>
                  <div className="text-right">
                     <div className="inline-block bg-slate-900 text-white px-6 py-2 rounded-lg font-black text-xs uppercase tracking-widest mb-4">Salary Voucher</div>
                     <p className="text-xs font-black text-slate-400 uppercase tracking-tighter">Voucher No: <span className="text-slate-900">{paymentRecord.voucherNo}</span></p>
                     <p className="text-xs font-black text-slate-400 uppercase tracking-tighter mt-1">Date: <span className="text-slate-900">{paymentRecord.date}</span></p>
                  </div>
               </div>

               {/* Recipient Info */}
               <div className="grid grid-cols-2 gap-10 bg-slate-50 p-6 rounded-2xl border border-slate-100">
                  <div>
                    <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-2">Recipient Staff</p>
                    <p className="text-lg font-black text-slate-800">{paymentRecord.staffName}</p>
                    <p className="text-xs font-bold text-primary mt-1">{paymentRecord.staffId}</p>
                  </div>
                  <div>
                    <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-2">Staff Address</p>
                    <p className="text-sm font-bold text-slate-600 leading-relaxed">{paymentRecord.address}</p>
                  </div>
               </div>

               {/* Table */}
               <div className="space-y-4">
                  <table className="w-full text-left">
                     <thead>
                        <tr className="text-[10px] font-black text-slate-400 uppercase tracking-widest">
                           <th className="pb-4">Description of Payment</th>
                           <th className="pb-4 text-right">Amount (BDT)</th>
                        </tr>
                     </thead>
                     <tbody className="divide-y divide-slate-100">
                        {paymentRecord.items.map((item, i) => (
                           <tr key={i}>
                              <td className="py-4 text-sm font-bold text-slate-700">{item.head}</td>
                              <td className="py-4 text-sm font-black text-slate-900 text-right">৳ {item.amount.toLocaleString()}</td>
                           </tr>
                        ))}
                     </tbody>
                     <tfoot>
                        <tr className="border-t-2 border-slate-900">
                           <td className="py-6 text-sm font-black text-slate-800 uppercase tracking-wider">Net Total Disbursed</td>
                           <td className="py-6 text-2xl font-black text-slate-900 text-right">৳ {paymentRecord.paidAmount.toLocaleString()}</td>
                        </tr>
                     </tfoot>
                  </table>
               </div>

               {/* Footer / Signatures */}
               <div className="pt-20 grid grid-cols-2 gap-20">
                  <div className="border-t border-slate-900 pt-4">
                     <p className="text-xs font-black text-slate-900 uppercase text-center tracking-widest italic">Staff Signature</p>
                  </div>
                  <div className="border-t border-slate-900 pt-4 text-right">
                     <p className="text-xs font-black text-slate-900 uppercase text-center tracking-widest italic">Authorized Signature</p>
                  </div>
               </div>

               <div className="text-center pt-10">
                  <p className="text-[10px] font-bold text-slate-400 uppercase tracking-[0.2em]">Computer Generated Voucher • No Signature Required for Validation</p>
               </div>
            </div>

            {/* Modal Controls (Hidden on Print) */}
            <div className="p-8 bg-slate-50 border-t flex justify-center gap-4 print:hidden rounded-b-[32px]">
               <button 
                  onClick={() => window.print()}
                  className="px-10 py-4 bg-slate-900 text-white font-black rounded-2xl text-xs uppercase tracking-widest hover:scale-105 active:scale-95 transition-all flex items-center gap-2 shadow-xl shadow-slate-200"
               >
                  <Printer className="w-4 h-4" /> Print Voucher
               </button>
               <button 
                  onClick={() => setShowVoucher(false)}
                  className="px-10 py-4 bg-white text-slate-400 font-black rounded-2xl text-xs uppercase tracking-widest border border-slate-100 hover:text-slate-600 transition-all"
               >
                  Close
               </button>
            </div>
          </div>

          <style dangerouslySetInnerHTML={{ __html: `
            @media print {
              body * { visibility: hidden; }
              #salary-voucher, #salary-voucher * { visibility: visible; }
              #salary-voucher { position: absolute; left: 0; top: 0; width: 100%; margin: 0; padding: 20px; }
              .print\\:hidden { display: none !important; }
            }
          `}} />
        </div>
      )}
    </div>
  );
};

export default PaySalary;
