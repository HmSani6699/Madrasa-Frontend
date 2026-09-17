import React, { useState, useEffect, useMemo, useRef } from 'react';
import {
  Search,
  User,
  CreditCard,
  CheckCircle,
  AlertCircle,
  Printer,
  Calculator,
  Loader2,
  Calendar,
  Clock,
  Plus,
  Trash2,
  Receipt,
  RotateCcw,
  Sparkles,
  ArrowRight,
  ChevronDown,
  Layers,
  Banknote,
  ShieldAlert,
  FileText
} from 'lucide-react';
import { useTranslation } from 'react-i18next';
import { toast } from 'react-hot-toast';
import Voucher from '../../components/Voucher';
import accountantService from '../../services/accountantService';

const ALL_MONTHS = [
  { name: 'January', bn: 'জানুয়ারি', short: 'Jan' },
  { name: 'February', bn: 'ফেব্রুয়ারি', short: 'Feb' },
  { name: 'March', bn: 'মার্চ', short: 'Mar' },
  { name: 'April', bn: 'এপ্রিল', short: 'Apr' },
  { name: 'May', bn: 'মে', short: 'May' },
  { name: 'June', bn: 'জুন', short: 'Jun' },
  { name: 'July', bn: 'জুলাই', short: 'Jul' },
  { name: 'August', bn: 'আগস্ট', short: 'Aug' },
  { name: 'September', bn: 'সেপ্টেম্বর', short: 'Sep' },
  { name: 'October', bn: 'অক্টোবর', short: 'Oct' },
  { name: 'November', bn: 'নভেম্বর', short: 'Nov' },
  { name: 'December', bn: 'ডিসেম্বর', short: 'Dec' }
];

const FeeCollection = () => {
  const { t } = useTranslation();
  const isBangla = t('fee_report.multiple_view') === 'মাল্টিপল ভিউ';

  // Search & Student State
  const [searchTerm, setSearchTerm] = useState('');
  const [searchResults, setSearchResults] = useState([]);
  const [isSearching, setIsSearching] = useState(false);
  const [showSearchDropdown, setShowSearchDropdown] = useState(false);
  const [selectedStudent, setSelectedStudent] = useState(null);
  const [studentHistory, setStudentHistory] = useState([]);

  // System Fee Types & Accounts
  const [systemFeeTypes, setSystemFeeTypes] = useState([]);
  const [accounts, setAccounts] = useState([]);
  const [selectedAccount, setSelectedAccount] = useState('');
  const [paymentMethod, setPaymentMethod] = useState('Cash');
  const [paymentDate, setPaymentDate] = useState(new Date().toISOString().split('T')[0]);
  const [paymentRemarks, setPaymentRemarks] = useState('');

  // Months & Advance Management
  const currentMonthIdx = new Date().getMonth();
  const currentYear = new Date().getFullYear();
  const [selectedBaseMonth, setSelectedBaseMonth] = useState(ALL_MONTHS[currentMonthIdx].name);
  const [selectedYear, setSelectedYear] = useState(currentYear.toString());
  const [advanceMonths, setAdvanceMonths] = useState([]); // array of month names e.g. ["October", "November"]

  // Active Fee Items
  // Each item: { id, head, amount, type, period, isAdvance, isSelected }
  const [feeItems, setFeeItems] = useState([]);

  // Previous Due state
  const [previousDue, setPreviousDue] = useState(0);
  const [includePreviousDue, setIncludePreviousDue] = useState(true);
  const [isEditingPreviousDue, setIsEditingPreviousDue] = useState(false);
  const [customPreviousDue, setCustomPreviousDue] = useState('');

  // Calculations
  const [discount, setDiscount] = useState('');
  const [paidAmount, setPaidAmount] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Voucher Modal State
  const [voucherData, setVoucherData] = useState(null);
  const [showVoucher, setShowVoucher] = useState(false);

  const searchContainerRef = useRef(null);

  // Close search dropdown on click outside
  useEffect(() => {
    const handleClickOutside = (e) => {
      if (searchContainerRef.current && !searchContainerRef.current.contains(e.target)) {
        setShowSearchDropdown(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  // Initial Data Load
  useEffect(() => {
    fetchAccounts();
    fetchSystemFeeTypes();
  }, []);

  const fetchAccounts = async () => {
    try {
      const res = await accountantService.getAccounts();
      if (res.success && res.data) {
        setAccounts(res.data);
        if (res.data.length > 0) {
          setSelectedAccount(res.data[0]._id);
        }
      }
    } catch (err) {
      console.error('Failed to fetch accounts', err);
    }
  };

  const fetchSystemFeeTypes = async () => {
    try {
      const res = await accountantService.getFeeTypes();
      if (res.success && res.data) {
        setSystemFeeTypes(res.data);
      }
    } catch (err) {
      console.error('Failed to fetch fee types', err);
    }
  };

  // Live Student Search
  useEffect(() => {
    const query = searchTerm.trim();
    if (!query) {
      setSearchResults([]);
      return;
    }

    const timer = setTimeout(async () => {
      setIsSearching(true);
      try {
        const res = await accountantService.getStudents({ search: query, limit: 15 });
        if (res.success || res.data) {
          const list = res.data || [];
          setSearchResults(list);
          setShowSearchDropdown(true);
        }
      } catch (err) {
        console.error('Search error', err);
      } finally {
        setIsSearching(false);
      }
    }, 280);

    return () => clearTimeout(timer);
  }, [searchTerm]);

  const handleSearchSubmit = async (e) => {
    if (e) e.preventDefault();
    if (!searchTerm.trim()) {
      toast.error(isBangla ? 'অনুগ্রহ করে শিক্ষার্থী আইডি, নাম বা রোল লিখুন' : 'Please enter student ID, Name or Roll');
      return;
    }

    setIsSearching(true);
    try {
      const res = await accountantService.getStudents({ search: searchTerm.trim(), limit: 10 });
      const students = res.data || [];
      if (students.length > 0) {
        // If exact match or single result, select immediately
        selectStudent(students[0]);
        setShowSearchDropdown(false);
      } else {
        toast.error(isBangla ? 'কোন শিক্ষার্থী পাওয়া যায়নি' : 'Student not found');
      }
    } catch (err) {
      console.error('Search error', err);
      toast.error(isBangla ? 'সার্চ ব্যর্থ হয়েছে' : 'Search failed');
    } finally {
      setIsSearching(false);
    }
  };

  // Select Student and Load History & Assigned Fees
  const selectStudent = async (student) => {
    setSelectedStudent(student);
    setSearchTerm(`${student.firstName || ''} ${student.lastName || ''}`.trim());
    setShowSearchDropdown(false);
    setDiscount('');
    setPaidAmount('');
    setAdvanceMonths([]);

    // Fetch Fee History & Outstanding Due
    try {
      const historyRes = await accountantService.getStudentFeeHistory(student._id || student.student_id);
      if (historyRes.success && historyRes.data) {
        setStudentHistory(historyRes.data.transactions || []);
        const due = Number(historyRes.data.previous_due) || 0;
        setPreviousDue(due);
        setCustomPreviousDue(due.toString());
      } else {
        setStudentHistory([]);
        setPreviousDue(0);
        setCustomPreviousDue('0');
      }
    } catch (err) {
      console.warn('Could not fetch student fee history:', err);
      setStudentHistory([]);
      setPreviousDue(0);
      setCustomPreviousDue('0');
    }

    // Build Initial Assigned Fee Items
    buildFeeItems(student, selectedBaseMonth, []);
  };

  // Construct Fee Items based on student profile and selected months
  const buildFeeItems = (student, baseMonth, advMonths = []) => {
    if (!student) return;

    const studentFees = student.fees || {};
    const items = [];
    let idCounter = 1;

    // 1. Initial Assigned Fees for the Base Month
    const feeKeys = Object.keys(studentFees);
    if (feeKeys.length > 0) {
      feeKeys.forEach((headName) => {
        const amount = parseFloat(studentFees[headName]) || 0;
        // Determine type if matched with system fee types
        const matchedType = systemFeeTypes.find(t => t.name.toLowerCase() === headName.toLowerCase());
        const payType = matchedType?.pay_type || 'Monthly';

        items.push({
          id: `base-${idCounter++}`,
          head: headName,
          amount: amount,
          type: payType,
          period: `${baseMonth} ${selectedYear}`,
          isAdvance: false,
          isSelected: true
        });
      });
    } else {
      // If student has no specific fee assigned, default to Tuition Fee or system fee types
      items.push({
        id: `base-${idCounter++}`,
        head: isBangla ? 'মাসিক বেতন (Monthly Tuition)' : 'Monthly Tuition Fee',
        amount: 500,
        type: 'Monthly',
        period: `${baseMonth} ${selectedYear}`,
        isAdvance: false,
        isSelected: true
      });
    }

    // 2. Advance Monthly Fees (Only for monthly fee heads)
    advMonths.forEach((advMonth) => {
      feeKeys.forEach((headName) => {
        const matchedType = systemFeeTypes.find(t => t.name.toLowerCase() === headName.toLowerCase());
        const payType = matchedType?.pay_type || 'Monthly';

        // Only duplicate monthly fees for advance months
        if (payType === 'Monthly') {
          const amount = parseFloat(studentFees[headName]) || 0;
          items.push({
            id: `adv-${advMonth}-${idCounter++}`,
            head: headName,
            amount: amount,
            type: payType,
            period: `${advMonth} ${selectedYear}`,
            isAdvance: true,
            isSelected: true
          });
        }
      });
    });

    setFeeItems(items);
  };

  // Advance Month Quick Presets
  const handleQuickAdvancePreset = (numMonths) => {
    const baseIdx = ALL_MONTHS.findIndex(m => m.name === selectedBaseMonth);
    const newAdvMonths = [];
    for (let i = 1; i <= numMonths; i++) {
      const targetIdx = (baseIdx + i) % 12;
      newAdvMonths.push(ALL_MONTHS[targetIdx].name);
    }
    setAdvanceMonths(newAdvMonths);
    buildFeeItems(selectedStudent, selectedBaseMonth, newAdvMonths);
  };

  // Toggle single advance month chip
  const toggleAdvanceMonth = (monthName) => {
    if (monthName === selectedBaseMonth) return; // cannot advance base month
    let updated;
    if (advanceMonths.includes(monthName)) {
      updated = advanceMonths.filter(m => m !== monthName);
    } else {
      updated = [...advanceMonths, monthName];
    }
    setAdvanceMonths(updated);
    buildFeeItems(selectedStudent, selectedBaseMonth, updated);
  };

  // Change Base Month
  const handleBaseMonthChange = (monthName) => {
    setSelectedBaseMonth(monthName);
    // Remove if previously selected as advance
    const updatedAdv = advanceMonths.filter(m => m !== monthName);
    setAdvanceMonths(updatedAdv);
    buildFeeItems(selectedStudent, monthName, updatedAdv);
  };

  // Toggle Individual Fee Item Selection
  const toggleItemSelection = (id) => {
    setFeeItems(prev => prev.map(item => item.id === id ? { ...item, isSelected: !item.isSelected } : item));
  };

  // Update item amount inline
  const updateItemAmount = (id, newAmount) => {
    const val = Math.max(0, parseFloat(newAmount) || 0);
    setFeeItems(prev => prev.map(item => item.id === id ? { ...item, amount: val } : item));
  };

  // Remove a line item
  const removeItem = (id) => {
    setFeeItems(prev => prev.filter(item => item.id !== id));
  };

  // Add Custom Extra Fee Item from system fee types
  const handleAddExtraFee = (feeTypeName) => {
    if (!feeTypeName) return;
    const newId = `custom-${Date.now()}`;
    const matched = systemFeeTypes.find(f => f.name === feeTypeName);
    setFeeItems(prev => [
      ...prev,
      {
        id: newId,
        head: feeTypeName,
        amount: 0,
        type: matched?.pay_type || 'One-time',
        period: `${selectedBaseMonth} ${selectedYear}`,
        isAdvance: false,
        isSelected: true
      }
    ]);
  };

  // Calculations
  const selectedFees = useMemo(() => feeItems.filter(f => f.isSelected), [feeItems]);
  const subTotal = useMemo(() => selectedFees.reduce((acc, curr) => acc + (Number(curr.amount) || 0), 0), [selectedFees]);
  const effectivePreviousDue = includePreviousDue ? Math.max(0, Number(previousDue) || 0) : 0;
  const grossTotal = subTotal + effectivePreviousDue;
  const discountVal = Math.min(grossTotal, Math.max(0, parseFloat(discount) || 0));
  const grandTotal = Math.max(0, grossTotal - discountVal);
  const paidVal = Math.max(0, parseFloat(paidAmount) || 0);
  const dueVal = Math.max(0, grandTotal - paidVal);

  // Auto-fill paid amount when grand total changes and user hasn't typed custom
  useEffect(() => {
    if (grandTotal > 0 && paidAmount === '') {
      setPaidAmount(grandTotal.toString());
    }
  }, [grandTotal]);

  // Handle Full Pay Quick Button
  const handleFullPay = () => {
    setPaidAmount(grandTotal.toString());
  };

  // Handle Submit & Checkout
  const handleCollectPayment = async () => {
    if (!selectedStudent) {
      toast.error(isBangla ? 'অনুগ্রহ করে শিক্ষার্থী নির্বাচন করুন' : 'Please select a student');
      return;
    }

    if (selectedFees.length === 0 && effectivePreviousDue <= 0) {
      toast.error(isBangla ? 'কোন ফি বা বকেয়া নির্বাচিত নেই' : 'No fee items or previous dues selected');
      return;
    }

    if (!selectedAccount) {
      toast.error(isBangla ? 'অনুগ্রহ করে একটি ডিপোজিট একাউন্ট নির্বাচন করুন' : 'Please select a deposit account');
      return;
    }

    setIsSubmitting(true);
    try {
      const monthsCovered = Array.from(new Set([selectedBaseMonth, ...advanceMonths]));
      const dateStr = new Date().toISOString().slice(0, 10).replace(/-/g, '');
      const randomNum = Math.floor(1000 + Math.random() * 9000);
      const generatedReceiptNo = `REC-${dateStr}-${randomNum}`;

      const payload = {
        student_id: selectedStudent._id ? selectedStudent._id.toString() : selectedStudent.student_id,
        fee_ids: selectedFees.map(f => f.id),
        paid_amount: paidVal,
        discount: discountVal,
        payment_method: paymentMethod,
        account_id: selectedAccount,
        receipt_no: generatedReceiptNo,
        months: monthsCovered,
        subtotal: subTotal,
        previous_due: effectivePreviousDue,
        advance_amount: selectedFees.filter(f => f.isAdvance).reduce((acc, curr) => acc + curr.amount, 0),
        net_payable: grandTotal,
        remaining_due: dueVal,
        remarks: paymentRemarks,
        date: paymentDate,
        is_simple_flow: true,
        fee_details: selectedFees.map(f => ({
          head: f.head,
          month: f.period,
          period: f.period,
          amount: f.amount
        }))
      };

      const res = await accountantService.collectFee(payload);

      if (res.success) {
        toast.success(isBangla ? 'ফি সফলভাবে গ্রহণ করা হয়েছে!' : 'Fee collected successfully!');
        
        // Prepare Voucher Data
        const accountObj = accounts.find(a => a._id === selectedAccount);
        const receiptData = {
          receiptNo: res.receipt_no || generatedReceiptNo,
          date: new Date(paymentDate).toLocaleDateString(),
          studentName: `${selectedStudent.firstName || ''} ${selectedStudent.lastName || ''}`.trim(),
          studentId: selectedStudent.student_id || selectedStudent.id || selectedStudent._id,
          rollNumber: selectedStudent.roll_number || '',
          className: selectedStudent.classInfo?.name || selectedStudent.class_name || selectedStudent.class || 'N/A',
          guardianName: selectedStudent.guardian?.fatherName || selectedStudent.guardian?.motherName || selectedStudent.guardian || 'N/A',
          paymentMethod: paymentMethod,
          accountName: accountObj?.name || 'Main Cash',
          feeDetails: selectedFees.map(f => ({
            head: f.head,
            period: f.period,
            amount: f.amount
          })),
          previousDue: effectivePreviousDue,
          subtotal: subTotal,
          discount: discountVal,
          netPayable: grandTotal,
          paidAmount: paidVal,
          amount: paidVal,
          remainingDue: dueVal
        };

        setVoucherData(receiptData);
        setShowVoucher(true);

        // Refresh data
        fetchAccounts();
        selectStudent(selectedStudent);
      }
    } catch (err) {
      console.error('Payment collection error:', err);
      toast.error(err.response?.data?.message || err.message || 'Failed to process payment');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="animate-in fade-in duration-300 pb-12">

      {/* Page Header */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 mb-6">
        <div>
          <h1 className="text-xl sm:text-2xl font-black text-slate-800 flex items-center gap-2.5">
            <div className="w-10 h-10 rounded-xl bg-[#00315e] text-white flex items-center justify-center shadow-md shadow-[#00315e]/20">
              <CreditCard className="w-5 h-5" />
            </div>
            {isBangla ? 'শিক্ষার্থী ফি কালেকশন ও রিসিট' : 'Student Fee Collection & Receipt'}
          </h1>
          <p className="text-xs font-semibold text-slate-500 mt-1">
            {isBangla ? 'শিক্ষার্থী খুঁজুন, বকেয়া ও অগ্রিম ফি হিসাব করুন এবং ডিজিটাল রশিদ প্রিন্ট করুন।' : 'Search student, manage past dues and advance collections with instant vouchers.'}
          </p>
        </div>

        {selectedStudent && (
          <button
            onClick={() => {
              setSelectedStudent(null);
              setSearchTerm('');
              setFeeItems([]);
            }}
            className="px-4 py-2 text-xs font-bold text-slate-600 bg-white border border-slate-200 rounded-lg hover:bg-slate-50 transition-all flex items-center gap-1.5 shadow-sm cursor-pointer"
          >
            <RotateCcw className="w-3.5 h-3.5" />
            {isBangla ? 'অন্য শিক্ষার্থী খুঁজুন' : 'Search Another Student'}
          </button>
        )}
      </div>

      {/* Search Header Card */}
      <div className="bg-white rounded-xl shadow-md border border-slate-200/80 p-5 mb-6 relative">
        <div className="flex flex-col md:flex-row gap-3 items-center">
          <div ref={searchContainerRef} className="relative flex-1 w-full">
            <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
            <input
              type="text"
              className="w-full pl-10 pr-10 py-3 bg-slate-50/70 border border-slate-200 text-slate-900 rounded-lg outline-none focus:bg-white focus:ring-2 focus:ring-[#00315e]/20 focus:border-[#00315e] transition-all font-semibold text-sm placeholder:text-slate-400"
              placeholder={isBangla ? 'শিক্ষার্থী আইডি (যেমন TS2548), পুরো নাম অথবা রোল নম্বর দ্বারা খুঁজুন...' : 'Search by Student ID (e.g. TS2548), Name, or Roll number...'}
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              onFocus={() => {
                if (searchResults.length > 0) setShowSearchDropdown(true);
              }}
              onKeyDown={(e) => {
                if (e.key === 'Enter') handleSearchSubmit(e);
              }}
            />
            {isSearching && (
              <Loader2 className="absolute right-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-[#00315e] animate-spin" />
            )}

            {/* Live Autocomplete Dropdown */}
            {showSearchDropdown && searchResults.length > 0 && (
              <div className="absolute top-full left-0 right-0 mt-2 bg-white rounded-xl shadow-2xl border border-slate-200 z-50 overflow-hidden max-h-72 overflow-y-auto">
                <div className="p-2 bg-slate-50 border-b border-slate-100 text-[11px] font-black text-slate-500 uppercase tracking-wider flex justify-between">
                  <span>{isBangla ? 'প্রাপ্ত ফলাফল' : 'Matching Students'} ({searchResults.length})</span>
                  <span>{isBangla ? 'ক্লিক করে নির্বাচন করুন' : 'Click to select'}</span>
                </div>
                {searchResults.map((s) => (
                  <div
                    key={s._id || s.student_id}
                    onClick={() => selectStudent(s)}
                    className="p-3 hover:bg-[#00315e]/5 transition-colors cursor-pointer border-b border-slate-50 flex items-center justify-between gap-3 group"
                  >
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded-full bg-slate-100 border border-slate-200 flex items-center justify-center text-[#00315e] font-black text-sm overflow-hidden flex-shrink-0">
                        {s.photo ? (
                          <img src={s.photo} alt={s.firstName} className="w-full h-full object-cover" />
                        ) : (
                          <User className="w-5 h-5 opacity-60" />
                        )}
                      </div>
                      <div>
                        <h4 className="font-bold text-slate-900 text-sm group-hover:text-[#00315e] transition-colors">
                          {`${s.firstName || ''} ${s.lastName || ''}`.trim()}
                        </h4>
                        <div className="flex items-center gap-2 mt-0.5 text-xs text-slate-500 font-medium">
                          <span className="bg-slate-100 text-slate-700 px-1.5 py-0.5 rounded font-mono font-bold">
                            {s.student_id || s.id || 'N/A'}
                          </span>
                          {s.roll_number && <span>Roll: {s.roll_number}</span>}
                          <span>Class: {s.classInfo?.name || s.class_name || s.class || 'N/A'}</span>
                        </div>
                      </div>
                    </div>
                    <ArrowRight className="w-4 h-4 text-slate-300 group-hover:text-[#00315e] group-hover:translate-x-1 transition-all" />
                  </div>
                ))}
              </div>
            )}
          </div>

          <button
            onClick={handleSearchSubmit}
            disabled={isSearching}
            className="px-6 py-3 bg-[#00315e] text-white font-bold rounded-lg hover:bg-[#002140] transition-all flex items-center justify-center gap-2 shadow-sm cursor-pointer disabled:opacity-50 flex-shrink-0 w-full md:w-auto"
          >
            {isSearching ? <Loader2 className="w-4 h-4 animate-spin" /> : <Search className="w-4 h-4" />}
            {isBangla ? 'শিক্ষার্থী খুঁজুন' : 'Find Student'}
          </button>
        </div>
      </div>

      {selectedStudent && (
        <div className="space-y-6">

          {/* Student Profile Ribbon */}
          <div className="bg-white rounded-xl shadow-md border border-slate-200 p-5 flex flex-col md:flex-row items-center gap-6 relative overflow-hidden">
            <div className="absolute top-0 right-0 w-32 h-32 bg-[#00315e]/5 rounded-bl-full pointer-events-none"></div>

            <div className="w-20 h-20 rounded-2xl border-2 border-[#00315e]/20 overflow-hidden shadow-sm flex-shrink-0 bg-slate-50 flex items-center justify-center">
              {selectedStudent.photo ? (
                <img src={selectedStudent.photo} alt={selectedStudent.firstName} className="w-full h-full object-cover" />
              ) : (
                <User className="w-10 h-10 text-[#00315e]/40" />
              )}
            </div>

            <div className="flex-1 grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-4 w-full">
              <div>
                <p className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">{isBangla ? 'শিক্ষার্থী' : 'Student Name'}</p>
                <h3 className="text-lg font-black text-slate-900 leading-tight mt-0.5">
                  {`${selectedStudent.firstName || ''} ${selectedStudent.lastName || ''}`.trim()}
                </h3>
                <span className="inline-block mt-1 font-mono text-xs font-black text-[#00315e] bg-[#00315e]/10 px-2 py-0.5 rounded">
                  {selectedStudent.student_id || selectedStudent.id || selectedStudent._id}
                </span>
              </div>

              <div>
                <p className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">{isBangla ? 'শ্রেণী ও রোল' : 'Class & Roll'}</p>
                <p className="font-bold text-slate-800 text-sm mt-0.5">
                  {selectedStudent.classInfo?.name || selectedStudent.class_name || selectedStudent.class || 'N/A'}
                </p>
                <p className="text-xs text-slate-500 font-medium">
                  {selectedStudent.roll_number ? `Roll: ${selectedStudent.roll_number}` : 'Roll: -'}
                  {selectedStudent.sectionInfo?.name ? ` (${selectedStudent.sectionInfo.name})` : ''}
                </p>
              </div>

              <div>
                <p className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">{isBangla ? 'অভিভাবক' : 'Guardian'}</p>
                <p className="font-bold text-slate-800 text-sm mt-0.5">
                  {selectedStudent.guardian?.fatherName || selectedStudent.guardian?.motherName || selectedStudent.guardian || 'N/A'}
                </p>
                <p className="text-xs text-slate-500 font-medium">
                  {selectedStudent.guardian?.phone || selectedStudent.contactNumber || 'N/A'}
                </p>
              </div>

              <div>
                <p className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">{isBangla ? 'অবস্থা' : 'Status'}</p>
                <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-black tracking-wide border bg-emerald-50 text-emerald-700 border-emerald-200 mt-1">
                  <div className="w-2 h-2 rounded-full bg-emerald-500"></div>
                  {selectedStudent.admissionStatus || 'Active'}
                </span>
              </div>
            </div>
          </div>

          {/* Previous Due Banner */}
          {previousDue > 0 && (
            <div className="bg-amber-50 border-2 border-amber-200 rounded-xl p-4 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 shadow-sm">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-amber-500 text-white flex items-center justify-center flex-shrink-0 shadow-sm">
                  <ShieldAlert className="w-5 h-5" />
                </div>
                <div>
                  <h4 className="font-black text-amber-900 text-sm sm:text-base flex items-center gap-2">
                    {isBangla ? 'পূর্বের অনাদায়ী বকেয়া রয়েছে' : 'Outstanding Previous Due Found'}
                    <span className="text-xs font-bold bg-amber-200/80 text-amber-900 px-2 py-0.5 rounded-full">
                      ৳ {previousDue.toLocaleString()}
                    </span>
                  </h4>
                  <p className="text-xs text-amber-800 mt-0.5">
                    {isBangla
                      ? 'এই শিক্ষার্থীর পূর্বের মাসের অবসান না হওয়া বকেয়া রয়েছে। আপনি চাইলে বর্তমান জমার সাথে এটি আদায় করতে পারেন।'
                      : 'This student has unpaid dues from past months. You can include it in the current payment.'}
                  </p>
                </div>
              </div>

              <div className="flex items-center gap-3 w-full sm:w-auto justify-between sm:justify-end">
                <label className="flex items-center gap-2 cursor-pointer bg-white px-3 py-1.5 rounded-lg border border-amber-300 shadow-sm">
                  <input
                    type="checkbox"
                    className="w-4 h-4 rounded text-[#00315e] focus:ring-[#00315e]"
                    checked={includePreviousDue}
                    onChange={(e) => setIncludePreviousDue(e.target.checked)}
                  />
                  <span className="text-xs font-black text-slate-800">
                    {isBangla ? 'বকেয়া যোগ করুন' : 'Include in Payment'}
                  </span>
                </label>
              </div>
            </div>
          )}

          {/* Main Workspace: Fee Selection & Checkout Desk */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">

            {/* Left Column (2 Cols): Month Controls & Itemized Fees */}
            <div className="lg:col-span-2 space-y-6">

              {/* Month Selection & Advance Selector Card */}
              <div className="bg-white rounded-xl shadow-md border border-slate-200 p-5">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-4 border-b border-slate-100">
                  <div>
                    <h3 className="text-sm font-black text-slate-900 flex items-center gap-2">
                      <Calendar className="w-4 h-4 text-[#00315e]" />
                      {isBangla ? 'মাস ও অগ্রিম ফি নির্বাচন (Advance Collection)' : 'Billing Month & Advance Selection'}
                    </h3>
                    <p className="text-xs text-slate-500 mt-0.5">
                      {isBangla ? 'বর্তমান ফি এর মাস নির্ধারণ করুন এবং প্রয়োজনে অগ্রিম মাস যোগ করুন।' : 'Select active billing month and optionally include upcoming months in advance.'}
                    </p>
                  </div>

                  {/* Base Month Selector */}
                  <div className="flex items-center gap-2">
                    <span className="text-xs font-bold text-slate-500 whitespace-nowrap">{isBangla ? 'মূল মাস:' : 'Base Month:'}</span>
                    <select
                      className="px-3 py-1.5 bg-slate-50 border border-slate-300 rounded-lg text-xs font-black text-slate-800 outline-none focus:ring-2 focus:ring-[#00315e]/20 cursor-pointer"
                      value={selectedBaseMonth}
                      onChange={(e) => handleBaseMonthChange(e.target.value)}
                    >
                      {ALL_MONTHS.map(m => (
                        <option key={m.name} value={m.name}>
                          {isBangla ? m.bn : m.name} ({selectedYear})
                        </option>
                      ))}
                    </select>
                  </div>
                </div>

                {/* Advance Month Presets */}
                <div className="mt-4">
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-[11px] font-black text-slate-600 uppercase tracking-wider">
                      {isBangla ? 'অগ্রিম মাসের কুইক অপশন' : 'Quick Advance Options'}
                    </span>
                    {advanceMonths.length > 0 && (
                      <button
                        onClick={() => {
                          setAdvanceMonths([]);
                          buildFeeItems(selectedStudent, selectedBaseMonth, []);
                        }}
                        className="text-[11px] font-bold text-rose-600 hover:underline cursor-pointer"
                      >
                        {isBangla ? 'অগ্রিম বাতিল করুন' : 'Clear Advance'}
                      </button>
                    )}
                  </div>

                  <div className="flex flex-wrap gap-2">
                    <button
                      type="button"
                      onClick={() => handleQuickAdvancePreset(0)}
                      className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all cursor-pointer border ${advanceMonths.length === 0 ? 'bg-[#00315e] text-white border-[#00315e] shadow-sm' : 'bg-slate-50 text-slate-700 border-slate-200 hover:bg-slate-100'}`}
                    >
                      {isBangla ? 'শুধু বর্তমান মাস' : 'Only Base Month'}
                    </button>
                    <button
                      type="button"
                      onClick={() => handleQuickAdvancePreset(1)}
                      className="px-3 py-1.5 rounded-lg text-xs font-bold bg-slate-50 text-slate-700 border border-slate-200 hover:bg-[#00315e]/10 hover:text-[#00315e] transition-all cursor-pointer"
                    >
                      +১ মাস অগ্রিম (+1 Month)
                    </button>
                    <button
                      type="button"
                      onClick={() => handleQuickAdvancePreset(2)}
                      className="px-3 py-1.5 rounded-lg text-xs font-bold bg-slate-50 text-slate-700 border border-slate-200 hover:bg-[#00315e]/10 hover:text-[#00315e] transition-all cursor-pointer"
                    >
                      +২ মাস অগ্রিম (+2 Months)
                    </button>
                    <button
                      type="button"
                      onClick={() => handleQuickAdvancePreset(3)}
                      className="px-3 py-1.5 rounded-lg text-xs font-bold bg-slate-50 text-slate-700 border border-slate-200 hover:bg-[#00315e]/10 hover:text-[#00315e] transition-all cursor-pointer"
                    >
                      +৩ মাস অগ্রিম (+3 Months)
                    </button>
                  </div>

                  {/* Interactive Month Chips */}
                  <div className="mt-3 pt-3 border-t border-slate-100 flex flex-wrap gap-1.5">
                    {ALL_MONTHS.map(m => {
                      const isBase = m.name === selectedBaseMonth;
                      const isAdv = advanceMonths.includes(m.name);
                      return (
                        <button
                          key={m.name}
                          type="button"
                          disabled={isBase}
                          onClick={() => toggleAdvanceMonth(m.name)}
                          className={`px-2.5 py-1 rounded-md text-[11px] font-black transition-all cursor-pointer flex items-center gap-1 ${isBase ? 'bg-slate-200 text-slate-500 cursor-not-allowed border border-slate-300' : isAdv ? 'bg-[#00315e] text-white border border-[#00315e] shadow-sm' : 'bg-white text-slate-700 border border-slate-200 hover:bg-slate-50'}`}
                        >
                          {isBangla ? m.bn : m.short}
                          {isBase && <span className="text-[9px] opacity-75">(Base)</span>}
                          {isAdv && <CheckCircle className="w-3 h-3" />}
                        </button>
                      );
                    })}
                  </div>
                </div>
              </div>

              {/* Itemized Assigned Fee List Table */}
              <div className="bg-white rounded-xl shadow-md border border-slate-200 overflow-hidden">
                <div className="p-4 bg-slate-50/80 border-b border-slate-200 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                  <div>
                    <h3 className="font-black text-slate-900 text-sm flex items-center gap-2">
                      <Layers className="w-4 h-4 text-[#00315e]" />
                      {isBangla ? 'নির্ধারিত ফি তালিকা (Fee Breakdown)' : 'Assigned Fee Breakdown'}
                    </h3>
                    <p className="text-xs text-slate-500 mt-0.5">
                      {isBangla ? 'শিক্ষার্থীর প্যাকেজ থেকে ফি সমূহ লোড হয়েছে। প্রয়োজনে পরিমাণ পরিবর্তন বা ফি যোগ করতে পারেন।' : 'Auto-loaded from student fee package. You can customize amounts or add fees.'}
                    </p>
                  </div>

                  {/* Add Extra Fee Dropdown */}
                  <div className="flex items-center gap-2">
                    <select
                      className="px-3 py-1.5 bg-white border border-slate-300 rounded-lg text-xs font-bold text-slate-700 outline-none focus:ring-2 focus:ring-[#00315e]/20 cursor-pointer"
                      onChange={(e) => {
                        handleAddExtraFee(e.target.value);
                        e.target.value = '';
                      }}
                    >
                      <option value="">+ {isBangla ? 'অন্যান্য ফি যোগ করুন' : 'Add Extra Fee'}</option>
                      {systemFeeTypes.map(type => (
                        <option key={type._id} value={type.name}>{type.name} ({type.pay_type})</option>
                      ))}
                    </select>
                  </div>
                </div>

                <div className="overflow-x-auto">
                  <table className="w-full text-left text-xs">
                    <thead className="bg-[#00315e]/5 text-slate-700 font-black border-b border-slate-200">
                      <tr>
                        <th className="py-3 px-4 w-12 text-center">
                          <input
                            type="checkbox"
                            className="w-4 h-4 rounded text-[#00315e] focus:ring-[#00315e]"
                            checked={feeItems.length > 0 && feeItems.every(f => f.isSelected)}
                            onChange={(e) => {
                              const checked = e.target.checked;
                              setFeeItems(prev => prev.map(f => ({ ...f, isSelected: checked })));
                            }}
                          />
                        </th>
                        <th className="py-3 px-4">{isBangla ? 'ফি এর বিবরণ' : 'Fee Head'}</th>
                        <th className="py-3 px-4">{isBangla ? 'মাস / সময়কাল' : 'Period / Month'}</th>
                        <th className="py-3 px-4">{isBangla ? 'ধরন' : 'Type'}</th>
                        <th className="py-3 px-4 text-right">{isBangla ? 'পরিমাণ (৳)' : 'Amount (৳)'}</th>
                        <th className="py-3 px-4 w-12 text-center"></th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-100 font-medium text-slate-700">
                      {feeItems.map((fee) => (
                        <tr
                          key={fee.id}
                          className={`transition-colors ${fee.isSelected ? (fee.isAdvance ? 'bg-sky-50/40 hover:bg-sky-50/70' : 'hover:bg-slate-50/80') : 'opacity-50 bg-slate-50/30'}`}
                        >
                          <td className="py-3 px-4 text-center">
                            <input
                              type="checkbox"
                              className="w-4 h-4 rounded text-[#00315e] focus:ring-[#00315e]"
                              checked={fee.isSelected}
                              onChange={() => toggleItemSelection(fee.id)}
                            />
                          </td>
                          <td className="py-3 px-4">
                            <p className="font-bold text-slate-900 text-sm flex items-center gap-2">
                              {fee.head}
                              {fee.isAdvance && (
                                <span className="text-[10px] font-black uppercase tracking-wider bg-sky-100 text-sky-800 px-1.5 py-0.5 rounded">
                                  {isBangla ? 'অগ্রিম' : 'Advance'}
                                </span>
                              )}
                            </p>
                          </td>
                          <td className="py-3 px-4 text-slate-500 font-bold">
                            {fee.period}
                          </td>
                          <td className="py-3 px-4">
                            <span className="text-[10px] font-bold px-2 py-0.5 rounded bg-slate-100 text-slate-600">
                              {fee.type}
                            </span>
                          </td>
                          <td className="py-3 px-4 text-right">
                            <div className="inline-flex items-center gap-1">
                              <span className="text-slate-400 font-bold">৳</span>
                              <input
                                type="number"
                                min="0"
                                className="w-24 text-right px-2 py-1 bg-white border border-slate-200 rounded font-black text-slate-800 focus:outline-none focus:ring-1 focus:ring-[#00315e]"
                                value={fee.amount}
                                onChange={(e) => updateItemAmount(fee.id, e.target.value)}
                              />
                            </div>
                          </td>
                          <td className="py-3 px-4 text-center">
                            <button
                              type="button"
                              onClick={() => removeItem(fee.id)}
                              className="p-1 text-slate-300 hover:text-rose-500 transition-colors cursor-pointer"
                              title="Remove item"
                            >
                              <Trash2 className="w-3.5 h-3.5" />
                            </button>
                          </td>
                        </tr>
                      ))}

                      {feeItems.length === 0 && (
                        <tr>
                          <td colSpan="6" className="py-8 text-center text-slate-400 font-bold">
                            {isBangla ? 'কোন ফি পাওয়া যায়নি' : 'No fee items available.'}
                          </td>
                        </tr>
                      )}
                    </tbody>
                  </table>
                </div>
              </div>

              {/* Student Payment History Table */}
              {studentHistory.length > 0 && (
                <div className="bg-white rounded-xl shadow-md border border-slate-200 overflow-hidden">
                  <div className="p-4 bg-slate-50 border-b border-slate-200 flex items-center justify-between">
                    <h3 className="font-black text-slate-800 text-xs sm:text-sm flex items-center gap-2">
                      <FileText className="w-4 h-4 text-[#00315e]" />
                      {isBangla ? 'এই শিক্ষার্থীর পূর্ববর্তী পেমেন্ট হিস্ট্রি' : 'Previous Payment History for this Student'}
                    </h3>
                    <span className="text-xs font-bold text-slate-500">
                      {studentHistory.length} {isBangla ? 'টি রেকর্ড' : 'records'}
                    </span>
                  </div>

                  <div className="overflow-x-auto max-h-60 overflow-y-auto">
                    <table className="w-full text-left text-xs">
                      <thead className="bg-slate-100/70 text-slate-600 font-black border-b border-slate-200 sticky top-0">
                        <tr>
                          <th className="py-2.5 px-4">{isBangla ? 'তারিখ' : 'Date'}</th>
                          <th className="py-2.5 px-4">{isBangla ? 'রিসিট নং' : 'Receipt No'}</th>
                          <th className="py-2.5 px-4">{isBangla ? 'মাস / ফি' : 'Month / Items'}</th>
                          <th className="py-2.5 px-4 text-right">{isBangla ? 'পরিশোধিত' : 'Paid'}</th>
                          <th className="py-2.5 px-4 text-right">{isBangla ? 'অবশিষ্ট বকেয়া' : 'Due'}</th>
                          <th className="py-2.5 px-4 text-center">{isBangla ? 'একশন' : 'Action'}</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-slate-100 font-medium text-slate-700">
                        {studentHistory.map((tx) => (
                          <tr key={tx._id} className="hover:bg-slate-50">
                            <td className="py-2.5 px-4 font-bold text-slate-600">
                              {new Date(tx.date || tx.created_at).toLocaleDateString()}
                            </td>
                            <td className="py-2.5 px-4 font-mono font-bold text-[#00315e]">
                              {tx.receipt_no || `#${tx._id.slice(-6)}`}
                            </td>
                            <td className="py-2.5 px-4 text-slate-600 truncate max-w-[160px]">
                              {tx.months && tx.months.length > 0 ? tx.months.join(', ') : (tx.description || 'Fees')}
                            </td>
                            <td className="py-2.5 px-4 text-right font-black text-slate-900">
                              ৳ {Number(tx.amount || 0).toLocaleString()}
                            </td>
                            <td className="py-2.5 px-4 text-right font-black">
                              <span className={Number(tx.remaining_due) > 0 ? 'text-amber-600' : 'text-emerald-600'}>
                                ৳ {Number(tx.remaining_due || 0).toLocaleString()}
                              </span>
                            </td>
                            <td className="py-2.5 px-4 text-center">
                              <button
                                type="button"
                                onClick={() => {
                                  setVoucherData({
                                    receiptNo: tx.receipt_no || `REC-${tx._id.slice(-6)}`,
                                    date: new Date(tx.date || tx.created_at).toLocaleDateString(),
                                    studentName: tx.student_name || `${selectedStudent.firstName || ''} ${selectedStudent.lastName || ''}`.trim(),
                                    studentId: tx.student_id || selectedStudent.student_id,
                                    rollNumber: tx.student_roll || selectedStudent.roll_number,
                                    className: selectedStudent.classInfo?.name || selectedStudent.class_name || 'N/A',
                                    guardianName: selectedStudent.guardian?.fatherName || 'N/A',
                                    paymentMethod: tx.payment_method || 'Cash',
                                    accountName: tx.account_name || 'Main Cash',
                                    feeDetails: tx.fee_details || [],
                                    previousDue: tx.previous_due || 0,
                                    subtotal: tx.subtotal || tx.amount,
                                    discount: tx.discount || 0,
                                    netPayable: tx.net_payable || tx.amount,
                                    paidAmount: tx.amount,
                                    amount: tx.amount,
                                    remainingDue: tx.remaining_due || 0
                                  });
                                  setShowVoucher(true);
                                }}
                                className="px-2.5 py-1 bg-slate-100 hover:bg-[#00315e] hover:text-white rounded text-[11px] font-bold text-slate-700 transition-all cursor-pointer"
                              >
                                {isBangla ? 'রিসিট দেখুন' : 'View Receipt'}
                              </button>
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </div>
              )}

            </div>

            {/* Right Column (1 Col): Cashier Calculation & Checkout Panel (Sticky) */}
            <div className="space-y-6">
              <div className="bg-white rounded-xl shadow-lg border border-slate-200 p-5 sticky top-4">
                <div className="flex items-center justify-between pb-3 border-b border-slate-200 mb-4">
                  <h3 className="font-black text-slate-900 text-sm flex items-center gap-2">
                    <Calculator className="w-4 h-4 text-[#00315e]" />
                    {isBangla ? 'পেমেন্ট ও হিসাব ডেস্ক' : 'Payment Calculation Desk'}
                  </h3>
                  <span className="text-[10px] font-black uppercase tracking-wider bg-slate-100 text-slate-600 px-2 py-0.5 rounded">
                    Cashier
                  </span>
                </div>

                <div className="space-y-4 text-xs">

                  {/* Subtotal */}
                  <div className="flex justify-between items-center font-bold text-slate-600">
                    <span>{isBangla ? 'ফি সাবটোটাল (বর্তমান + অগ্রিম)' : 'Fee Subtotal:'}</span>
                    <span className="font-black text-sm text-slate-900">৳ {subTotal.toLocaleString()}</span>
                  </div>

                  {/* Previous Due Line */}
                  <div className="flex justify-between items-center font-bold text-slate-600">
                    <span className="flex items-center gap-1 text-amber-800">
                      ★ {isBangla ? 'পূর্বের বকেয়া (Due):' : 'Previous Due Balance:'}
                    </span>
                    <span className={`font-black text-sm ${includePreviousDue ? 'text-amber-700' : 'text-slate-400 line-through'}`}>
                      ৳ {effectivePreviousDue.toLocaleString()}
                    </span>
                  </div>

                  {/* Discount / Waiver */}
                  <div>
                    <div className="flex justify-between items-center mb-1">
                      <label className="font-bold text-slate-500 uppercase text-[10px]">
                        {isBangla ? 'মওকুফ / ডিসকাউন্ট (৳)' : 'Discount / Waiver (৳)'}
                      </label>
                      <div className="flex gap-1">
                        <button
                          type="button"
                          onClick={() => setDiscount('100')}
                          className="text-[10px] bg-slate-100 hover:bg-slate-200 px-1.5 py-0.5 rounded font-bold text-slate-700 cursor-pointer"
                        >
                          100
                        </button>
                        <button
                          type="button"
                          onClick={() => setDiscount('200')}
                          className="text-[10px] bg-slate-100 hover:bg-slate-200 px-1.5 py-0.5 rounded font-bold text-slate-700 cursor-pointer"
                        >
                          200
                        </button>
                        <button
                          type="button"
                          onClick={() => setDiscount('500')}
                          className="text-[10px] bg-slate-100 hover:bg-slate-200 px-1.5 py-0.5 rounded font-bold text-slate-700 cursor-pointer"
                        >
                          500
                        </button>
                      </div>
                    </div>
                    <div className="relative">
                      <span className="absolute left-3 top-1/2 -translate-y-1/2 font-bold text-slate-400">৳</span>
                      <input
                        type="number"
                        min="0"
                        className="w-full pl-8 pr-3 py-2 bg-slate-50 border border-slate-200 rounded-lg font-bold text-slate-800 focus:bg-white focus:outline-none focus:ring-2 focus:ring-[#00315e]/20"
                        placeholder="0"
                        value={discount}
                        onChange={(e) => setDiscount(e.target.value)}
                      />
                    </div>
                  </div>

                  {/* Net Payable Highlight */}
                  <div className="p-3.5 rounded-xl bg-[#00315e]/5 border border-[#00315e]/15">
                    <span className="text-[10px] font-black uppercase tracking-wider text-slate-500 block">
                      {isBangla ? 'সর্বমোট নিট প্রদেয় (Net Payable)' : 'Total Net Payable'}
                    </span>
                    <div className="flex items-baseline justify-between mt-1">
                      <span className="text-2xl font-black text-[#00315e]">
                        ৳ {grandTotal.toLocaleString()}
                      </span>
                      <button
                        type="button"
                        onClick={handleFullPay}
                        className="text-[11px] font-black text-[#00315e] hover:underline cursor-pointer"
                      >
                        {isBangla ? 'পুরো পরিশোধ (Full Pay)' : 'Full Pay'}
                      </button>
                    </div>
                  </div>

                  {/* Paid Amount Input */}
                  <div>
                    <label className="font-bold text-slate-700 uppercase text-[10px] block mb-1">
                      {isBangla ? 'জমার পরিমাণ (Paid Amount) *' : 'Amount Received *'}
                    </label>
                    <div className="relative">
                      <span className="absolute left-3 top-1/2 -translate-y-1/2 font-black text-slate-500 text-sm">৳</span>
                      <input
                        type="number"
                        min="0"
                        className={`w-full pl-8 pr-3 py-2.5 bg-white border-2 rounded-lg font-black text-base focus:outline-none transition-all ${paidVal < grandTotal && paidVal > 0 ? 'border-amber-300 text-amber-800 focus:border-amber-500' : 'border-slate-300 text-slate-900 focus:border-[#00315e]'}`}
                        value={paidAmount}
                        onChange={(e) => setPaidAmount(e.target.value)}
                      />
                    </div>
                  </div>

                  {/* Due or Fully Paid Status Badge */}
                  {grandTotal > 0 && (
                    <div className={`p-2.5 rounded-lg text-xs font-black flex items-center justify-between ${dueVal > 0 ? 'bg-amber-50 text-amber-800 border border-amber-200' : 'bg-emerald-50 text-emerald-800 border border-emerald-200'}`}>
                      <span>{dueVal > 0 ? (isBangla ? 'অবশিষ্ট বকেয়া থাকবে:' : 'Remaining Due:') : (isBangla ? 'সম্পূর্ণ পরিশোধিত' : 'Fully Paid')}</span>
                      <span className="text-sm font-black">৳ {dueVal.toLocaleString()}</span>
                    </div>
                  )}

                  {/* Payment Method */}
                  <div>
                    <label className="font-bold text-slate-500 uppercase text-[10px] block mb-1">
                      {isBangla ? 'পেমেন্ট পদ্ধতি' : 'Payment Method'}
                    </label>
                    <select
                      className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-lg font-bold text-slate-700 outline-none focus:bg-white focus:ring-2 focus:ring-[#00315e]/20 cursor-pointer"
                      value={paymentMethod}
                      onChange={(e) => setPaymentMethod(e.target.value)}
                    >
                      <option value="Cash">{isBangla ? 'নগদ ক্যাশ (Cash)' : 'Cash'}</option>
                      <option value="Bank Transfer">{isBangla ? 'ব্যাংক ট্রান্সফার (Bank Transfer)' : 'Bank Transfer'}</option>
                      <option value="bKash">bKash (বিকাশ)</option>
                      <option value="Nagad">Nagad (নগদ)</option>
                      <option value="Rocket">Rocket (রকেট)</option>
                    </select>
                  </div>

                  {/* Deposit Account */}
                  <div>
                    <label className="font-bold text-slate-500 uppercase text-[10px] block mb-1">
                      {isBangla ? 'জমা একাউন্ট (Deposit Account)' : 'Deposit Financial Account'}
                    </label>
                    <select
                      className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-lg font-bold text-slate-700 outline-none focus:bg-white focus:ring-2 focus:ring-[#00315e]/20 cursor-pointer"
                      value={selectedAccount}
                      onChange={(e) => setSelectedAccount(e.target.value)}
                    >
                      {accounts.length > 0 ? (
                        accounts.map(acc => (
                          <option key={acc._id} value={acc._id}>
                            {acc.name} (৳ {Number(acc.balance || 0).toLocaleString()})
                          </option>
                        ))
                      ) : (
                        <option value="default-cash">Main Cash (মেইন ক্যাশ)</option>
                      )}
                    </select>
                  </div>

                  {/* Payment Date & Remarks */}
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                    <div>
                      <label className="font-bold text-slate-500 uppercase text-[10px] block mb-1">
                        {isBangla ? 'তারিখ' : 'Date'}
                      </label>
                      <input
                        type="date"
                        className="w-full px-2.5 py-1.5 bg-slate-50 border border-slate-200 rounded-lg font-bold text-slate-700 text-xs outline-none"
                        value={paymentDate}
                        onChange={(e) => setPaymentDate(e.target.value)}
                      />
                    </div>
                    <div>
                      <label className="font-bold text-slate-500 uppercase text-[10px] block mb-1">
                        {isBangla ? 'মন্তব্য (অপশনাল)' : 'Remarks'}
                      </label>
                      <input
                        type="text"
                        placeholder="e.g. Cleared"
                        className="w-full px-2.5 py-1.5 bg-slate-50 border border-slate-200 rounded-lg font-medium text-slate-700 text-xs outline-none"
                        value={paymentRemarks}
                        onChange={(e) => setPaymentRemarks(e.target.value)}
                      />
                    </div>
                  </div>

                  {/* Checkout Button */}
                  <button
                    type="button"
                    onClick={handleCollectPayment}
                    disabled={isSubmitting || !selectedStudent || (selectedFees.length === 0 && effectivePreviousDue <= 0)}
                    className="w-full mt-4 py-3.5 bg-[#00315e] text-white font-black rounded-xl shadow-lg shadow-[#00315e]/25 hover:bg-[#002140] hover:-translate-y-0.5 active:translate-y-0 transition-all flex items-center justify-center gap-2 cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:transform-none text-sm"
                  >
                    {isSubmitting ? (
                      <Loader2 className="w-4 h-4 animate-spin" />
                    ) : (
                      <Printer className="w-4 h-4" />
                    )}
                    {dueVal > 0 && paidVal > 0
                      ? (isBangla ? 'আংশিক পেমেন্ট ও রশিদ প্রিন্ট' : 'Confirm Partial Payment & Print')
                      : (isBangla ? 'পেমেন্ট নিশ্চিত ও রশিদ প্রিন্ট' : 'Confirm Payment & Print Receipt')}
                  </button>

                </div>
              </div>
            </div>

          </div>

        </div>
      )}

      {/* Printable Money Receipt / Voucher Modal */}
      {showVoucher && voucherData && (
        <Voucher
          data={voucherData}
          onClose={() => setShowVoucher(false)}
        />
      )}

    </div>
  );
};

export default FeeCollection;
