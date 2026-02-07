import React, { useState, useEffect } from 'react';
import { 
  Search, 
  User, 
  CreditCard, 
  CheckCircle,
  AlertCircle,
  Printer,
  Calculator
} from 'lucide-react';

import { useTranslation } from 'react-i18next';

const FeeCollection = () => {
  const { t } = useTranslation();
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedStudent, setSelectedStudent] = useState(null);
  
  // Payment State
  const [selectedFeeIds, setSelectedFeeIds] = useState([]);
  const [discount, setDiscount] = useState("");
  const [paidAmount, setPaidAmount] = useState("");

  const handleSearch = (e) => {
    e.preventDefault();
    // Simulate finding a student
    const student = {
      id: "ST-2025-001",
      name: "Muhammad Ibrahim",
      class: "Hifz - Class A",
      guardian: "Abdul Karim",
      fees: [
        { id: 1, head: "Monthly Tuition (Jan)", amount: 1000, isPaid: false },
        { id: 2, head: "Exam Fee", amount: 500, isPaid: false },
        { id: 3, head: "Previous Dues", amount: 200, isPaid: false },
      ]
    };
    setSelectedStudent(student);
    // Auto-select all unpaid fees initially
    setSelectedFeeIds(student.fees.filter(f => !f.isPaid).map(f => f.id));
    // Reset payment fields
    setDiscount("");
    setPaidAmount("");
  };

  const toggleFeeSelection = (id) => {
    setSelectedFeeIds(prev => 
      prev.includes(id) ? prev.filter(feeId => feeId !== id) : [...prev, id]
    );
  };

  // Calculations
  const selectedFees = selectedStudent?.fees.filter(f => selectedFeeIds.includes(f.id)) || [];
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

  return (
    <div className="max-w-5xl mx-auto p-6 space-y-8 animate-in fade-in duration-500">
      
      {/* Header */}
      <div>
        <h1 className="text-2xl font-bold text-slate-800">{t('fee_collection.title')}</h1>
        <p className="text-slate-500">{t('fee_collection.subtitle')}</p>
      </div>

      {/* Search Bar */}
      <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm flex flex-col md:flex-row gap-4 items-center">
         <div className="relative flex-1 w-full">
            <Search className="absolute left-4 top-3.5 w-5 h-5 text-slate-400" />
            <input 
              type="text" 
              className="w-full pl-12 pr-4 py-3 bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-primary/20 transition-all font-medium"
              placeholder={t('fee_collection.search_placeholder')}
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
         </div>
         <button 
           onClick={handleSearch}
           className="px-8 py-3 bg-primary text-white font-bold rounded-xl shadow-lg shadow-primary/20 hover:scale-[1.02] active:scale-[0.98] transition-all w-full md:w-auto cursor-pointer"
         >
           {t('fee_collection.find_student')}
         </button>
      </div>

      {selectedStudent && (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            
            {/* Left Column: Student Profile & Fee Selection */}
            <div className="lg:col-span-2 space-y-6">
                {/* Student Mini Profile */}
                <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm flex items-center gap-6">
                    <div className="w-20 h-20 bg-slate-100 rounded-full flex items-center justify-center text-slate-400">
                        <User className="w-10 h-10" />
                    </div>
                    <div>
                        <h2 className="text-xl font-bold text-slate-800">{selectedStudent.name}</h2>
                        <div className="flex gap-4 mt-1 text-sm text-slate-500 font-medium">
                            <span className="bg-slate-100 px-2 py-0.5 rounded text-slate-600">{selectedStudent.id}</span>
                            <span>{selectedStudent.class}</span>
                        </div>
                        <p className="text-sm text-slate-400 mt-1">{t('student_academic_report_page.guardian')}: {selectedStudent.guardian}</p>
                    </div>
                </div>

                {/* Payable Fees List */}
                <div className="bg-white border border-slate-200 rounded-2xl shadow-sm overflow-hidden">
                    <div className="p-4 bg-slate-50 border-b border-slate-200 flex justify-between items-center">
                        <h3 className="font-bold text-slate-700">{t('fee_collection.select_fees')}</h3>
                        <div className="flex gap-2">
                             <select 
                                className="px-3 py-1.5 text-xs font-bold border border-slate-300 rounded-lg text-slate-600 focus:outline-none hover:border-primary"
                                onChange={(e) => {
                                    if(e.target.value) {
                                        const newFeeId = selectedStudent.fees.length + Math.random();
                                        const newFee = { id: newFeeId, head: `Monthly Tuition (${e.target.value})`, amount: 1000, isPaid: false };
                                        setSelectedStudent(prev => ({
                                            ...prev,
                                            fees: [...prev.fees, newFee]
                                        }));
                                        setSelectedFeeIds(prev => [...prev, newFeeId]);
                                        e.target.value = ""; // Reset
                                    }
                                }}
                             >
                                 <option value="">{t('fee_collection.add_advance')}</option>
                                 <option value="Feb">February</option>
                                 <option value="Mar">March</option>
                                 <option value="Apr">April</option>
                                 <option value="May">May</option>
                                 <option value="Jun">June</option>
                                 <option value="Full Year">Full Year (12 Months)</option>
                             </select>
                        </div>
                    </div>
                    <div className="divide-y divide-slate-100 max-h-[400px] overflow-y-auto">
                        {selectedStudent.fees.filter(f => !f.isPaid).map(fee => (
                            <div 
                              key={fee.id} 
                              className={`p-4 flex items-center justify-between group transition-colors cursor-pointer ${selectedFeeIds.includes(fee.id) ? 'bg-primary/5' : 'hover:bg-slate-50'}`}
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
                                        <p className="text-xs text-slate-500">
                                            {fee.head.includes('Jan') ? t('fee_collection.due_today') : t('fee_collection.advance_payment')}
                                        </p>
                                    </div>
                                </div>
                                <p className="font-bold text-slate-800">৳ {fee.amount}</p>
                            </div>
                        ))}
                    </div>
                     <div className="p-4 bg-slate-50 border-t border-slate-200">
                         <div className="flex justify-between items-center text-slate-600">
                             <span className="text-sm font-bold">{t('fee_collection.subtotal')}</span>
                             <span className="text-xl font-bold">৳ {subTotal}</span>
                         </div>
                     </div>
                </div>
            </div>

            {/* Right Column: Payment & Calculation */}
            <div className="space-y-6">
                <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm space-y-6">
                    <h3 className="font-bold text-slate-800 border-b pb-2 flex items-center gap-2">
                        <Calculator className="w-5 h-5 text-slate-400" />
                        {t('fee_collection.payment_calculation')}
                    </h3>
                    
                    <div className="space-y-4">
                         
                         {/* Discount Field */}
                         <div>
                            <label className="text-xs font-bold text-slate-500 uppercase flex justify-between">
                                {t('fee_collection.discount_waiver')}
                                <span className="text-[10px] text-primary cursor-pointer hover:underline">{t('fee_collection.apply_preset')}</span>
                            </label>
                            <input 
                              type="number" 
                              className="w-full mt-1 p-3 border border-slate-200 rounded-xl font-bold text-lg text-slate-600 focus:outline-none focus:ring-2 focus:ring-primary/20" 
                              placeholder="0"
                              value={discount}
                              onChange={(e) => setDiscount(e.target.value)}
                            />
                            <p className="text-[10px] text-slate-400 mt-1">{t('fee_collection.deducting_from', { amount: subTotal })}</p>
                         </div>

                         {/* Net Payable Display */}
                         <div className="flex justify-between items-center py-2 border-y border-dashed border-slate-200">
                             <span className="font-bold text-slate-700">{t('fee_collection.net_payable')}</span>
                             <span className="font-black text-2xl text-slate-800">৳ {grandTotal}</span>
                         </div>

                         {/* Paid Amount Input */}
                         <div>
                            <label className="text-xs font-bold text-slate-500 uppercase">{t('fee_collection.paid_amount')}</label>
                            <input 
                              type="number" 
                              className={`w-full mt-1 p-3 border rounded-xl font-bold text-2xl focus:outline-none focus:ring-2 transition-all ${paidVal < grandTotal && paidVal > 0 ? 'border-amber-300 ring-amber-100 text-amber-700' : 'border-slate-200 focus:ring-primary/20 text-emerald-700'}`}
                              placeholder="0"
                              value={paidAmount}
                              onChange={(e) => setPaidAmount(e.target.value)}
                            />
                         </div>

                         {/* Remaining Due Calculation */}
                         {grandTotal > 0 && (
                             <div className={`p-4 rounded-xl text-sm font-bold flex justify-between items-center ${paidVal < grandTotal ? 'bg-amber-50 text-amber-700' : 'bg-emerald-50 text-emerald-700'}`}>
                                 <span>{paidVal < grandTotal ? t('fee_collection.remaining_due') : t('fee_collection.fully_paid')}</span>
                                 <span className="text-lg">{paidVal < grandTotal ? `৳ ${due}` : t('fee_collection.fully_paid')}</span>
                             </div>
                         )}
                         
                         <div>
                            <label className="text-xs font-bold text-slate-500 uppercase">{t('fee_collection.payment_method')}</label>
                            <select className="w-full mt-1 p-3 border border-slate-200 rounded-xl bg-white font-medium focus:outline-none focus:ring-2 focus:ring-primary/20">
                                <option>{t('expense_page.categories.cash') || 'Cash'}</option>
                                <option>{t('fee_report.multiple_view') === "মাল্টিপল ভিউ" ? "ব্যাংক ট্রান্সফার" : "Bank Transfer"}</option>
                                <option>{t('fee_report.multiple_view') === "মাল্টিপল ভিউ" ? "মোবাইল ব্যাংকিং" : "Mobile Banking"}</option>
                            </select>
                         </div>
                    </div>

                    <button className="w-full py-4 bg-emerald-600 text-white font-bold rounded-xl shadow-lg shadow-emerald-200 hover:scale-[1.02] active:scale-[0.98] transition-all flex items-center justify-center gap-2 cursor-pointer">
                        <CheckCircle className="w-5 h-5" />
                        {paidVal < grandTotal ? t('fee_collection.confirm_partial') : t('fee_collection.confirm_payment')}
                    </button>
                    
                </div>
            </div>

        </div>
      )}

    </div>
  );
};

export default FeeCollection;
