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
  FileText,
  Ban,
  AlertTriangle,
  X
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
  const [selectedMonths, setSelectedMonths] = useState([ALL_MONTHS[currentMonthIdx].name]);
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

  // Void / Cancel Modal State
  const [voidTargetTx, setVoidTargetTx] = useState(null);
  const [voidReason, setVoidReason] = useState('');
  const [isVoiding, setIsVoiding] = useState(false);

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

  // Get Payment Status for a specific month and year
  const getMonthPaymentStatus = (monthName, yearStr = selectedYear, transactions = studentHistory) => {
    if (!transactions || transactions.length === 0) {
      return { status: 'Unpaid', paidAmount: 0, remainingDue: 0, receiptNo: null, date: null, transaction: null, headsPaid: [] };
    }

    const matchingTx = transactions.filter(tx => {
      if (tx.status === 'Voided' || tx.is_voided) return false;
      const hasMonth = tx.months && tx.months.some(m => m && m.toLowerCase() === monthName.toLowerCase());
      const hasDetail = tx.fee_details && tx.fee_details.some(fd => {
        const periodStr = (fd.period || fd.month || '').toLowerCase();
        return periodStr.includes(monthName.toLowerCase()) && (!yearStr || periodStr.includes(yearStr));
      });

      const txYear = tx.year ? tx.year.toString() : (tx.date ? new Date(tx.date).getFullYear().toString() : '');
      const yearMatch = !yearStr || !txYear || txYear === yearStr;

      return (hasMonth || hasDetail) && yearMatch;
    });

    if (matchingTx.length === 0) {
      return { status: 'Unpaid', paidAmount: 0, remainingDue: 0, receiptNo: null, date: null, transaction: null, headsPaid: [] };
    }

    const getTxTime = (tx) => {
      if (tx.created_at) {
        const t = new Date(tx.created_at).getTime();
        if (!isNaN(t) && t > 0) return t;
      }
      if (tx.date) {
        const t = new Date(tx.date).getTime();
        if (!isNaN(t) && t > 0) return t;
      }
      return 0;
    };

    const sortedMatching = [...matchingTx].sort((a, b) => getTxTime(b) - getTxTime(a));
    const latestTx = sortedMatching[0];
    const latestTxTime = getTxTime(latestTx);

    const headsPaid = [];
    matchingTx.forEach(tx => {
      if (tx.fee_details && Array.isArray(tx.fee_details)) {
        tx.fee_details.forEach(fd => {
          const periodStr = (fd.period || fd.month || '').toLowerCase();
          if (periodStr.includes(monthName.toLowerCase()) && !headsPaid.includes(fd.head)) {
            headsPaid.push(fd.head);
          }
        });
      }
    });

    let totalPaid = matchingTx.reduce((sum, tx) => sum + (Number(tx.amount) || 0), 0);
    let remainingDue = Number(latestTx.remaining_due) || 0;

    // Sort all active transactions chronologically (oldest to newest)
    const allChronTx = [...transactions]
      .filter(tx => tx.status !== 'Voided' && !tx.is_voided)
      .sort((a, b) => getTxTime(a) - getTxTime(b));
    const latestOverallTx = allChronTx[allChronTx.length - 1];
    const currentOverallDue = latestOverallTx && latestOverallTx.remaining_due !== undefined
      ? Number(latestOverallTx.remaining_due)
      : (previousDue !== undefined ? Number(previousDue) : 0);

    // If remaining due was left after latestTx, check subsequent transactions
    if (remainingDue > 0) {
      if (currentOverallDue === 0) {
        // If overall student due is currently 0, all past dues have been 100% paid and cleared
        const originalBill = Number(latestTx.subtotal) || Number(latestTx.net_payable) || (totalPaid + remainingDue);
        totalPaid = Math.max(totalPaid, originalBill);
        remainingDue = 0;
      } else {
        // Check subsequent transactions strictly occurring after latestTx
        const subsequentTxs = allChronTx.filter(tx => {
          const txTime = getTxTime(tx);
          if (txTime > latestTxTime) return true;
          if (txTime === latestTxTime && tx._id !== latestTx._id) {
            const idxSub = transactions.indexOf(tx);
            const idxLatest = transactions.indexOf(latestTx);
            return idxSub < idxLatest; // smaller index in API response means newer
          }
          return false;
        });

        for (const subTx of subsequentTxs) {
          const subRemaining = Number(subTx.remaining_due) || 0;
          const subPrevDue = Number(subTx.previous_due) || 0;
          const subPaid = Number(subTx.amount) || 0;

          if (subRemaining === 0) {
            remainingDue = 0;
            break;
          }

          if (subPrevDue > 0) {
            if (subPaid >= subPrevDue) {
              remainingDue = 0;
              break;
            } else {
              const cleared = Math.min(remainingDue, Math.max(0, subPaid));
              remainingDue = Math.max(0, remainingDue - cleared);
            }
          }

          remainingDue = Math.min(remainingDue, subRemaining);
          if (remainingDue === 0) break;
        }

        remainingDue = Math.min(remainingDue, currentOverallDue);
        if (remainingDue === 0) {
          const originalBill = Number(latestTx.subtotal) || Number(latestTx.net_payable) || (totalPaid + (Number(latestTx.remaining_due) || 0));
          totalPaid = Math.max(totalPaid, originalBill);
        }
      }
    }

    let status = 'Unpaid';
    if (remainingDue === 0 && (totalPaid > 0 || Number(latestTx.net_payable) > 0 || Number(latestTx.discount) > 0)) {
      status = 'Paid';
    } else if (remainingDue > 0 && totalPaid > 0) {
      status = 'Partial';
    } else if (remainingDue === 0 && Number(latestTx.net_payable) > 0) {
      status = 'Paid';
    } else if (remainingDue > 0) {
      status = 'Partial';
    }

    return {
      status,
      paidAmount: totalPaid,
      remainingDue,
      receiptNo: latestTx.receipt_no,
      date: latestTx.date || latestTx.created_at,
      transaction: latestTx,
      headsPaid
    };
  };

  // Get Annual/One-time fees paid for this academic year
  const getAnnualFeesPaid = (yearStr = selectedYear, transactions = studentHistory) => {
    const paidHeads = {};
    if (!transactions || transactions.length === 0) return paidHeads;

    transactions.forEach(tx => {
      if (tx.status === 'Voided' || tx.is_voided) return;
      const txYear = tx.year ? tx.year.toString() : (tx.date ? new Date(tx.date).getFullYear().toString() : '');
      if (yearStr && txYear && txYear !== yearStr) return;

      if (tx.fee_details && Array.isArray(tx.fee_details)) {
        tx.fee_details.forEach(fd => {
          const matchedType = systemFeeTypes.find(t => t.name.toLowerCase() === fd.head?.toLowerCase());
          const isAnnualOrOneTime = matchedType?.pay_type === 'Annual' || matchedType?.pay_type === 'One-time';
          if (isAnnualOrOneTime && (Number(tx.amount) > 0 || Number(tx.remaining_due) === 0)) {
            paidHeads[fd.head] = {
              receiptNo: tx.receipt_no,
              date: tx.date || tx.created_at,
              amount: fd.amount,
              period: fd.period || fd.month || '',
              months: tx.months || []
            };
          }
        });
      }
    });

    return paidHeads;
  };

  // Status of the currently selected base month
  const currentBaseMonthStatus = useMemo(() => {
    return getMonthPaymentStatus(selectedBaseMonth, selectedYear, studentHistory);
  }, [selectedBaseMonth, selectedYear, studentHistory]);

  // Find the next unpaid month
  const nextUnpaidMonth = useMemo(() => {
    if (!selectedStudent) return null;
    const baseIdx = ALL_MONTHS.findIndex(m => m.name === selectedBaseMonth);
    for (let i = 1; i < 12; i++) {
      const idx = (baseIdx + i) % 12;
      const mName = ALL_MONTHS[idx].name;
      const st = getMonthPaymentStatus(mName, selectedYear, studentHistory);
      if (st.status !== 'Paid') {
        return ALL_MONTHS[idx];
      }
    }
    return null;
  }, [selectedStudent, selectedBaseMonth, selectedYear, studentHistory]);

  // Select Student and Load History & Assigned Fees
  const selectStudent = async (student) => {
    setSelectedStudent(student);
    setSearchTerm(`${student.firstName || ''} ${student.lastName || ''}`.trim());
    setShowSearchDropdown(false);
    setDiscount('');
    const initialMonth = ALL_MONTHS[currentMonthIdx].name;
    setSelectedMonths([initialMonth]);
    setSelectedBaseMonth(initialMonth);
    setAdvanceMonths([]);

    // Fetch Fee History & Outstanding Due
    let transactions = [];
    let currentDue = 0;
    try {
      const historyRes = await accountantService.getStudentFeeHistory(student._id || student.student_id);
      if (historyRes.success && historyRes.data) {
        transactions = historyRes.data.transactions || [];
        setStudentHistory(transactions);
        currentDue = Number(historyRes.data.previous_due) || 0;
        setPreviousDue(currentDue);
        setCustomPreviousDue(currentDue.toString());
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

    // Build Initial Assigned Fee Items with history
    buildFeeItems(student, initialMonth, [], transactions, currentDue);
  };

  // Construct Fee Items based on student profile and selected months
  const buildFeeItems = (student, baseMonth, advMonths = [], transactions = studentHistory, currentDueOverride = undefined) => {
    if (!student) return;

    if (!baseMonth && (!advMonths || advMonths.length === 0)) {
      setFeeItems([]);
      const effDue = currentDueOverride !== undefined
        ? (includePreviousDue ? Math.max(0, Number(currentDueOverride) || 0) : 0)
        : (includePreviousDue ? Math.max(0, Number(previousDue) || 0) : 0);
      setPaidAmount(effDue > 0 ? effDue.toString() : '0');
      return;
    }

    const studentFees = student.fees || {};
    const items = [];
    let idCounter = 1;

    const baseMonthStatus = baseMonth ? getMonthPaymentStatus(baseMonth, selectedYear, transactions) : { status: 'Unpaid', headsPaid: [] };
    const annualPaidMap = getAnnualFeesPaid(selectedYear, transactions);

    // 1. Initial Assigned Fees for the Base Month
    const feeKeys = Object.keys(studentFees);
    if (baseMonth) {
      if (feeKeys.length > 0) {
        feeKeys.forEach((headName) => {
          const amount = parseFloat(studentFees[headName]) || 0;
          const matchedType = systemFeeTypes.find(t => t.name.toLowerCase() === headName.toLowerCase());
          const payType = matchedType?.pay_type || 'Monthly';

          const isAnnual = payType === 'Annual' || payType === 'One-time';
          const annualPaidInfo = isAnnual
            ? (annualPaidMap[headName] || Object.entries(annualPaidMap).find(([k]) => k.toLowerCase() === headName.toLowerCase())?.[1])
            : null;
          const isAnnualAlreadyPaid = Boolean(annualPaidInfo);

          // If annual/one-time fee has already been paid, do not show it in next/future billing months
          if (isAnnual && isAnnualAlreadyPaid) {
            const paidInBaseMonth = annualPaidInfo.months?.some(m => m && m.toLowerCase() === baseMonth.toLowerCase()) ||
              annualPaidInfo.period?.toLowerCase().includes(baseMonth.toLowerCase());

            if (!paidInBaseMonth) {
              return; // Skip displaying in next months
            }
          }

          const isMonthAlreadyPaid = baseMonthStatus.status === 'Paid';
          const isHeadInPaidMonth = baseMonthStatus.headsPaid && baseMonthStatus.headsPaid.some(h => h && h.toLowerCase() === headName.toLowerCase());

          const isItemPaid = isAnnualAlreadyPaid || (isMonthAlreadyPaid && isHeadInPaidMonth) || isMonthAlreadyPaid;

          items.push({
            id: `base-${idCounter++}`,
            head: headName,
            amount: amount,
            type: payType,
            period: `${baseMonth} ${selectedYear}`,
            isAdvance: false,
            isPaid: isItemPaid,
            isAnnualPaid: isAnnualAlreadyPaid,
            paidStatus: isItemPaid ? 'Paid' : (baseMonthStatus.status === 'Partial' ? 'Partial' : 'Unpaid'),
            paidReceipt: isAnnualAlreadyPaid ? annualPaidInfo.receiptNo : baseMonthStatus.receiptNo,
            paidDate: isAnnualAlreadyPaid ? annualPaidInfo.date : baseMonthStatus.date,
            // Already paid items are unchecked by default
            isSelected: !isItemPaid
          });
        });
      } else {
        const isMonthAlreadyPaid = baseMonthStatus.status === 'Paid';
        items.push({
          id: `base-${idCounter++}`,
          head: isBangla ? 'মাসিক বেতন (Monthly Tuition)' : 'Monthly Tuition Fee',
          amount: 500,
          type: 'Monthly',
          period: `${baseMonth} ${selectedYear}`,
          isAdvance: false,
          isPaid: isMonthAlreadyPaid,
          paidStatus: isMonthAlreadyPaid ? 'Paid' : 'Unpaid',
          paidReceipt: baseMonthStatus.receiptNo,
          paidDate: baseMonthStatus.date,
          isSelected: !isMonthAlreadyPaid
        });
      }
    }

    // 2. Advance Monthly Fees (Only for monthly recurring heads)
    advMonths.forEach((advMonth) => {
      const advMonthStatus = getMonthPaymentStatus(advMonth, selectedYear, transactions);
      if (feeKeys.length > 0) {
        feeKeys.forEach((headName) => {
          const matchedType = systemFeeTypes.find(t => t.name.toLowerCase() === headName.toLowerCase());
          const payType = matchedType?.pay_type || 'Monthly';

          if (payType === 'Monthly') {
            const amount = parseFloat(studentFees[headName]) || 0;
            const isAdvPaid = advMonthStatus.status === 'Paid';
            const isHeadInAdv = advMonthStatus.headsPaid && advMonthStatus.headsPaid.some(h => h && h.toLowerCase() === headName.toLowerCase());
            const isItemPaid = isAdvPaid || (advMonthStatus.status === 'Paid' && isHeadInAdv);

            items.push({
              id: `adv-${advMonth}-${idCounter++}`,
              head: headName,
              amount: amount,
              type: payType,
              period: `${advMonth} ${selectedYear}`,
              isAdvance: true,
              isPaid: isItemPaid,
              paidStatus: isItemPaid ? 'Paid' : (advMonthStatus.status === 'Partial' ? 'Partial' : 'Unpaid'),
              paidReceipt: advMonthStatus.receiptNo,
              paidDate: advMonthStatus.date,
              isSelected: !isItemPaid
            });
          }
        });
      } else {
        const isAdvPaid = advMonthStatus.status === 'Paid';
        items.push({
          id: `adv-${advMonth}-${idCounter++}`,
          head: isBangla ? 'মাসিক বেতন (Monthly Tuition)' : 'Monthly Tuition Fee',
          amount: 500,
          type: 'Monthly',
          period: `${advMonth} ${selectedYear}`,
          isAdvance: true,
          isPaid: isAdvPaid,
          paidStatus: isAdvPaid ? 'Paid' : 'Unpaid',
          paidReceipt: advMonthStatus.receiptNo,
          paidDate: advMonthStatus.date,
          isSelected: !isAdvPaid
        });
      }
    });

    setFeeItems(items);

    // Auto calculate initial payable amount
    const activeFees = items.filter(f => f.isSelected);
    const activeSub = activeFees.reduce((acc, curr) => acc + (Number(curr.amount) || 0), 0);
    const effDue = currentDueOverride !== undefined
      ? (includePreviousDue ? Math.max(0, Number(currentDueOverride) || 0) : 0)
      : (includePreviousDue ? Math.max(0, Number(previousDue) || 0) : 0);
    const activeGross = activeSub + effDue;
    setPaidAmount(activeGross > 0 ? activeGross.toString() : '0');
  };

  // Advance Month Quick Presets
  const handleQuickAdvancePreset = (numMonths) => {
    const startMonth = selectedMonths[0] || selectedBaseMonth || ALL_MONTHS[currentMonthIdx].name;
    const baseIdx = ALL_MONTHS.findIndex(m => m.name === startMonth);
    const newSelected = [startMonth];
    for (let i = 1; i <= numMonths; i++) {
      const targetIdx = (baseIdx + i) % 12;
      const targetName = ALL_MONTHS[targetIdx].name;
      if (!newSelected.includes(targetName)) {
        newSelected.push(targetName);
      }
    }
    newSelected.sort((a, b) => {
      const idxA = ALL_MONTHS.findIndex(m => m.name === a);
      const idxB = ALL_MONTHS.findIndex(m => m.name === b);
      return idxA - idxB;
    });
    setSelectedMonths(newSelected);
    const base = newSelected[0] || '';
    const adv = newSelected.slice(1);
    setSelectedBaseMonth(base);
    setAdvanceMonths(adv);
    buildFeeItems(selectedStudent, base, adv, studentHistory);
  };

  // Toggle single month in multi-month selection
  const handleMonthToggle = (monthName) => {
    let updated;
    if (selectedMonths.includes(monthName)) {
      updated = selectedMonths.filter(m => m !== monthName);
    } else {
      updated = [...selectedMonths, monthName];
    }

    // Sort chronologically Jan -> Dec
    updated.sort((a, b) => {
      const idxA = ALL_MONTHS.findIndex(m => m.name === a);
      const idxB = ALL_MONTHS.findIndex(m => m.name === b);
      return idxA - idxB;
    });

    setSelectedMonths(updated);
    const base = updated.length > 0 ? updated[0] : '';
    const adv = updated.length > 1 ? updated.slice(1) : [];
    setSelectedBaseMonth(base);
    setAdvanceMonths(adv);
    buildFeeItems(selectedStudent, base, adv, studentHistory);
  };

  // Select all unpaid months for this year
  const handleSelectAllUnpaidMonths = () => {
    const unpaid = ALL_MONTHS.filter(m => {
      const st = getMonthPaymentStatus(m.name, selectedYear, studentHistory);
      return st.status !== 'Paid';
    }).map(m => m.name);

    if (unpaid.length === 0) {
      toast.info(isBangla ? 'এই বছরের সকল মাসের ফি ইতিমধ্যে সম্পূর্ণ পরিশোধিত!' : 'All months for this year are already paid!');
      return;
    }

    setSelectedMonths(unpaid);
    const base = unpaid[0] || '';
    const adv = unpaid.slice(1);
    setSelectedBaseMonth(base);
    setAdvanceMonths(adv);
    buildFeeItems(selectedStudent, base, adv, studentHistory);
  };

  // Clear all selected months
  const handleClearSelectedMonths = () => {
    setSelectedMonths([]);
    setSelectedBaseMonth('');
    setAdvanceMonths([]);
    buildFeeItems(selectedStudent, '', [], studentHistory);
  };

  // Toggle single advance month chip (legacy support)
  const toggleAdvanceMonth = (monthName) => {
    handleMonthToggle(monthName);
  };

  // Change Base Month
  const handleBaseMonthChange = (monthName) => {
    setSelectedMonths([monthName]);
    setSelectedBaseMonth(monthName);
    setAdvanceMonths([]);
    buildFeeItems(selectedStudent, monthName, [], studentHistory);
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
        isPaid: false,
        paidStatus: 'Unpaid',
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
      const monthsCovered = selectedMonths.length > 0
        ? selectedMonths
        : Array.from(new Set([selectedBaseMonth, ...advanceMonths].filter(Boolean)));
      const dateStr = new Date().toISOString().slice(0, 10).replace(/-/g, '');
      const randomNum = Math.floor(1000 + Math.random() * 9000);
      const generatedReceiptNo = `REC-${dateStr}-${randomNum}`;

      const effectivePaidVal = paidAmount !== '' ? Math.max(0, parseFloat(paidAmount) || 0) : grandTotal;
      const effectiveDueVal = Math.max(0, grandTotal - effectivePaidVal);

      const payload = {
        student_id: selectedStudent._id ? selectedStudent._id.toString() : selectedStudent.student_id,
        fee_ids: selectedFees.map(f => f.id),
        paid_amount: effectivePaidVal,
        discount: discountVal,
        payment_method: paymentMethod,
        account_id: selectedAccount,
        receipt_no: generatedReceiptNo,
        months: monthsCovered,
        year: selectedYear,
        subtotal: subTotal,
        previous_due: effectivePreviousDue,
        advance_amount: selectedFees.filter(f => f.isAdvance).reduce((acc, curr) => acc + curr.amount, 0),
        net_payable: grandTotal,
        remaining_due: effectiveDueVal,
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
        const clsName = selectedStudent.classInfo?.name || selectedStudent.class_name || selectedStudent.class || 'N/A';
        const secName = selectedStudent.sectionInfo?.name || selectedStudent.section_name || selectedStudent.section || '';
        const classFormatted = secName ? `${clsName} (${secName})` : `${clsName} (N/A)`;
        const gName = selectedStudent.guardian?.fatherName || selectedStudent.guardian?.motherName || (typeof selectedStudent.guardian === 'string' ? selectedStudent.guardian : '') || selectedStudent.father_name || selectedStudent.fatherName || '';

        const receiptData = {
          receiptNo: res.receipt_no || generatedReceiptNo,
          date: paymentDate || new Date().toISOString().split('T')[0],
          studentName: `${selectedStudent.firstName || ''} ${selectedStudent.lastName || ''}`.trim(),
          studentId: selectedStudent.student_id || selectedStudent.id || selectedStudent._id,
          rollNumber: selectedStudent.roll_number || '',
          className: classFormatted,
          guardianName: gName,
          year: selectedYear || new Date().getFullYear().toString(),
          academicYear: selectedYear || new Date().getFullYear().toString(),
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
          paidAmount: effectivePaidVal,
          amount: effectivePaidVal,
          remainingDue: effectiveDueVal
        };

        setVoucherData(receiptData);
        setShowVoucher(true);

        // Refresh data
        fetchAccounts();
        await selectStudent(selectedStudent);
      }
    } catch (err) {
      console.error('Payment collection error:', err);
      toast.error(err.response?.data?.message || err.message || 'Failed to process payment');
    } finally {
      setIsSubmitting(false);
    }
  };

  // Void / Cancel Fee Transaction with Audit Trail and Auto-Rollback
  const handleConfirmVoid = async () => {
    if (!voidTargetTx) return;
    if (!voidReason.trim()) {
      toast.error(isBangla ? 'অনুগ্রহ করে বাতিলের কারণ উল্লেখ করুন' : 'Please provide a reason for cancellation');
      return;
    }

    setIsVoiding(true);
    try {
      const res = await accountantService.voidTransaction(voidTargetTx._id, voidReason.trim());
      if (res.success) {
        toast.success(isBangla ? 'রশিদ ও ট্রানজেকশন সফলভাবে বাতিল করা হয়েছে!' : 'Transaction successfully voided!');
        setVoidTargetTx(null);
        setVoidReason('');
        // Refresh accounts and student history
        fetchAccounts();
        if (selectedStudent) {
          await selectStudent(selectedStudent);
        }
      }
    } catch (err) {
      console.error('Failed to void transaction', err);
      toast.error(err.response?.data?.message || (isBangla ? 'ট্রানজেকশন বাতিল করা সম্ভব হয়নি' : 'Failed to void transaction'));
    } finally {
      setIsVoiding(false);
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

            <div className="w-20 h-20 rounded-2xl border border-[#00315e]/20 overflow-hidden shadow-sm flex-shrink-0 bg-slate-50 flex items-center justify-center">
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
                <div className="flex items-center gap-2 flex-wrap mt-1">
                  <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-black tracking-wide border bg-emerald-50 text-emerald-700 border-emerald-200">
                    <div className="w-2 h-2 rounded-full bg-emerald-500"></div>
                    {selectedStudent.admissionStatus || 'Active'}
                  </span>
                  {previousDue > 0 && (
                    <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-black tracking-wide border bg-amber-50 text-amber-800 border-amber-300 shadow-2xs">
                      <ShieldAlert className="w-3.5 h-3.5 text-amber-600" />
                      {isBangla ? `পূর্বের বকেয়া: ৳${previousDue.toLocaleString()}` : `Due: ৳${previousDue.toLocaleString()}`}
                    </span>
                  )}
                </div>
              </div>
            </div>
          </div>

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
                </div>

                {/* Status Indicator Banner for Selected Base Month */}
                {selectedMonths.length <= 1 && currentBaseMonthStatus.status === 'Paid' && (
                  <div className="mt-4 p-4 bg-emerald-50 border border-emerald-300 rounded-xl shadow-sm">
                    <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
                      <div className="flex items-start gap-3">
                        <div className="w-9 h-9 rounded-xl bg-emerald-600 text-white flex items-center justify-center flex-shrink-0 shadow-md shadow-emerald-600/20">
                          <CheckCircle className="w-5 h-5" />
                        </div>
                        <div>
                          <div className="flex items-center gap-2 flex-wrap">
                            <h4 className="font-black text-emerald-950 text-sm">
                              {isBangla
                                ? `${ALL_MONTHS.find(m => m.name === selectedBaseMonth)?.bn || selectedBaseMonth} ${selectedYear} এর ফি ইতিমধ্যে সম্পূর্ণ পরিশোধিত!`
                                : `${selectedBaseMonth} ${selectedYear} Fee is Already Paid in Full!`}
                            </h4>
                            <span className="bg-emerald-200/90 text-emerald-900 text-[10px] font-black px-2 py-0.5 rounded-full uppercase tracking-wider">
                              {isBangla ? 'পরিশোধিত' : 'Paid'}
                            </span>
                          </div>
                          <p className="text-xs text-emerald-800 mt-1 font-medium flex flex-wrap items-center gap-x-3 gap-y-0.5">
                            <span>
                              {isBangla ? 'রশিদ নং:' : 'Receipt No:'}{' '}
                              <strong className="font-mono font-black text-emerald-900">{currentBaseMonthStatus.receiptNo || 'N/A'}</strong>
                            </span>
                            {currentBaseMonthStatus.date && (
                              <span>
                                {isBangla ? 'তারিখ:' : 'Date:'}{' '}
                                <strong>{new Date(currentBaseMonthStatus.date).toLocaleDateString()}</strong>
                              </span>
                            )}
                            <span>
                              {isBangla ? 'পরিশোধিত:' : 'Paid:'}{' '}
                              <strong>৳ {Number(currentBaseMonthStatus.paidAmount || 0).toLocaleString()}</strong>
                            </span>
                            <span>
                              {isBangla ? 'অবশিষ্ট বকেয়া:' : 'Due:'}{' '}
                              <strong>৳ 0</strong>
                            </span>
                          </p>
                        </div>
                      </div>

                      <div className="flex items-center gap-2 w-full sm:w-auto justify-end flex-wrap">
                        {currentBaseMonthStatus.transaction && (
                          <button
                            type="button"
                            onClick={() => {
                              const tx = currentBaseMonthStatus.transaction;
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
                                paidAmount: currentBaseMonthStatus.paidAmount || tx.amount,
                                amount: currentBaseMonthStatus.paidAmount || tx.amount,
                                remainingDue: currentBaseMonthStatus.remainingDue !== undefined ? currentBaseMonthStatus.remainingDue : (tx.remaining_due || 0)
                              });
                              setShowVoucher(true);
                            }}
                            className="px-3 py-1.5 bg-white text-emerald-800 border border-emerald-300 rounded-lg text-xs font-bold hover:bg-emerald-100/70 transition-all flex items-center gap-1.5 shadow-sm cursor-pointer"
                          >
                            <Receipt className="w-3.5 h-3.5 text-emerald-700" />
                            {isBangla ? 'রশিদ দেখুন' : 'View Receipt'}
                          </button>
                        )}

                        {nextUnpaidMonth && (
                          <button
                            type="button"
                            onClick={() => handleBaseMonthChange(nextUnpaidMonth.name)}
                            className="px-3 py-1.5 bg-[#00315e] text-white rounded-lg text-xs font-bold hover:bg-[#002140] transition-all flex items-center gap-1.5 shadow-sm cursor-pointer"
                          >
                            {isBangla ? `পরবর্তী মাস (${nextUnpaidMonth.bn}) →` : `Next (${nextUnpaidMonth.short}) →`}
                          </button>
                        )}
                      </div>
                    </div>
                  </div>
                )}

                {selectedMonths.length <= 1 && currentBaseMonthStatus.status === 'Partial' && (
                  <div className="mt-4 p-4 bg-amber-50 border-2 border-amber-300 rounded-xl shadow-sm">
                    <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
                      <div className="flex items-start gap-3">
                        <div className="w-9 h-9 rounded-xl bg-amber-500 text-white flex items-center justify-center flex-shrink-0 shadow-md shadow-amber-500/20">
                          <AlertCircle className="w-5 h-5" />
                        </div>
                        <div>
                          <div className="flex items-center gap-2 flex-wrap">
                            <h4 className="font-black text-amber-950 text-sm">
                              {isBangla
                                ? `${ALL_MONTHS.find(m => m.name === selectedBaseMonth)?.bn || selectedBaseMonth} ${selectedYear} এর ফি আংশিক পরিশোধিত!`
                                : `${selectedBaseMonth} ${selectedYear} Fee is Partially Paid!`}
                            </h4>
                            <span className="bg-amber-200 text-amber-900 text-[10px] font-black px-2 py-0.5 rounded-full">
                              {isBangla ? `বকেয়া ৳${currentBaseMonthStatus.remainingDue}` : `Due ৳${currentBaseMonthStatus.remainingDue}`}
                            </span>
                          </div>
                          <p className="text-xs text-amber-800 mt-1 font-medium flex flex-wrap items-center gap-x-3 gap-y-0.5">
                            <span>
                              {isBangla ? 'পূর্বে পরিশোধিত:' : 'Paid so far:'}{' '}
                              <strong>৳ {Number(currentBaseMonthStatus.paidAmount || 0).toLocaleString()}</strong>
                            </span>
                            <span>
                              {isBangla ? 'রশিদ নং:' : 'Receipt No:'}{' '}
                              <strong className="font-mono font-black">{currentBaseMonthStatus.receiptNo || 'N/A'}</strong>
                            </span>
                          </p>
                        </div>
                      </div>
                    </div>
                  </div>
                )}

                {/* Multi-month Selection Info Summary */}
                {selectedMonths.length > 1 && (
                  <div className="mt-4 p-3.5 bg-sky-50 border border-sky-200 rounded-xl shadow-xs flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
                    <div className="flex items-center gap-2.5">
                      <div className="w-8 h-8 rounded-lg bg-[#00315e] text-white flex items-center justify-center font-black text-xs shrink-0 shadow-sm">
                        {selectedMonths.length}
                      </div>
                      <div>
                        <h4 className="text-xs font-black text-[#00315e] flex items-center gap-1.5">
                          <span>{isBangla ? 'একাধিক মাস নির্বাচিত হয়েছে' : 'Multiple Months Selected'}</span>
                          <span className="text-[10px] bg-sky-200/80 text-sky-900 px-1.5 py-0.2 rounded font-bold">
                            {selectedMonths.length} {isBangla ? 'টি মাস' : 'Months'}
                          </span>
                        </h4>
                        <p className="text-[11px] text-slate-600 mt-0.5 font-medium">
                          {selectedMonths.map(m => ALL_MONTHS.find(x => x.name === m)?.bn || m).join(', ')} ({selectedYear})
                        </p>
                      </div>
                    </div>
                    <button
                      type="button"
                      onClick={() => handleQuickAdvancePreset(0)}
                      className="text-xs font-bold text-slate-600 hover:text-rose-600 bg-white border border-slate-200 hover:border-rose-200 px-2.5 py-1 rounded-lg transition-all cursor-pointer whitespace-nowrap shadow-2xs"
                    >
                      {isBangla ? 'শুধু একটি মাস রাখুন' : 'Keep Single Month'}
                    </button>
                  </div>
                )}

                {/* 12 Months Status Bar & Navigation */}
                <div className="mt-4 pt-3 border-t border-slate-100">
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2.5 mb-2.5 w-full">
                    <div>
                      <div className="flex items-center gap-2">
                        <span className="text-[11px] font-black text-slate-700 uppercase tracking-wider">
                          {isBangla ? 'সকল মাসের অবস্থা ও নির্বাচন' : 'Monthly Status & Selection'}
                        </span>

                      </div>
                      <p className="text-[11px] text-slate-500 mt-0.5">
                        {isBangla ? 'এক বা একাধিক মাসের উপর ক্লিক করে নির্বাচন বা বাতিল করুন।' : 'Click any month to select or deselect for fee collection.'}
                      </p>
                    </div>

                    <div className="flex items-center gap-2 flex-wrap justify-end ml-auto">
                      <button
                        type="button"
                        onClick={handleSelectAllUnpaidMonths}
                        className="text-[10px] font-black text-[#00315e] bg-sky-50 hover:bg-sky-100 px-2.5 py-1 rounded-md border border-sky-200 transition-all cursor-pointer shadow-2xs"
                        title={isBangla ? 'সকল বকেয়া মাস নির্বাচন করুন' : 'Select all unpaid months'}
                      >
                        {isBangla ? 'বকেয়া মাসসমূহ নির্বাচন' : 'Select All Unpaid'}
                      </button>

                      {selectedMonths.length > 0 && (
                        <button
                          type="button"
                          onClick={handleClearSelectedMonths}
                          className="text-[10px] font-bold text-rose-600 hover:text-rose-700 px-2 py-1 rounded-md hover:bg-rose-50 transition-all cursor-pointer"
                        >
                          {isBangla ? 'সব মুছুন' : 'Clear'}
                        </button>
                      )}

                      <div className="flex items-center gap-2.5 text-[10px] font-bold pl-2 border-l border-slate-200">
                        <span className="flex items-center gap-1 text-emerald-700">
                          <span className="w-2 h-2 rounded-full bg-emerald-500"></span>
                          {isBangla ? 'পরিশোধিত' : 'Paid'}
                        </span>
                        <span className="flex items-center gap-1 text-amber-700">
                          <span className="w-2 h-2 rounded-full bg-amber-500"></span>
                          {isBangla ? 'আংশিক' : 'Partial'}
                        </span>
                        <span className="flex items-center gap-1 text-slate-500">
                          <span className="w-2 h-2 rounded-full bg-slate-300"></span>
                          {isBangla ? 'বকেয়া' : 'Unpaid'}
                        </span>
                      </div>
                    </div>
                  </div>

                  <div className="grid grid-cols-3 sm:grid-cols-4 md:grid-cols-6 gap-2">
                    {ALL_MONTHS.map(m => {
                      const isSelected = selectedMonths.includes(m.name);
                      const mStatus = getMonthPaymentStatus(m.name, selectedYear, studentHistory);
                      const isPaid = mStatus.status === 'Paid';
                      const isPartial = mStatus.status === 'Partial';

                      let chipClasses = 'bg-white text-slate-700 border-slate-200 hover:bg-slate-50 hover:border-slate-300';
                      if (isSelected) {
                        chipClasses = isPaid
                          ? 'bg-emerald-600 text-white border-emerald-700 shadow-md ring-2 ring-emerald-400'
                          : isPartial
                            ? 'bg-amber-600 text-white border-amber-700 shadow-md ring-2 ring-amber-400'
                            : 'bg-[#00315e] text-white border-[#00315e] shadow-md ring-2 ring-[#00315e]/30';
                      } else if (isPaid) {
                        chipClasses = 'bg-emerald-50 text-emerald-800 border-emerald-200 hover:bg-emerald-100/80';
                      } else if (isPartial) {
                        chipClasses = 'bg-amber-50 text-amber-800 border-amber-200 hover:bg-amber-100/80';
                      }

                      return (
                        <button
                          key={m.name}
                          type="button"
                          onClick={() => handleMonthToggle(m.name)}
                          className={`p-2.5 rounded-lg text-xs font-black transition-all cursor-pointer flex flex-col items-center justify-center border text-center relative select-none ${chipClasses}`}
                          title={`${m.name}: ${isPaid ? (isBangla ? 'সম্পূর্ণ পরিশোধিত' : 'Fully Paid') : isPartial ? (isBangla ? `আংশিক বকেয়া ৳${mStatus.remainingDue}` : `Partial Due ৳${mStatus.remainingDue}`) : (isBangla ? 'বকেয়া' : 'Unpaid')} - ${isSelected ? (isBangla ? 'ক্লিক করে বাতিল করুন' : 'Click to deselect') : (isBangla ? 'ক্লিক করে নির্বাচন করুন' : 'Click to select')}`}
                        >
                          {isSelected && (
                            <span className="absolute -top-1.5 -right-1.5 w-4 h-4 rounded-full bg-white text-[#00315e] font-black text-[9px] flex items-center justify-center shadow-md ring-1 ring-black/10">
                              ✓
                            </span>
                          )}
                          <span className="text-xs font-black">{isBangla ? m.bn : m.short}</span>
                          <span className="text-[10px] mt-0.5 flex items-center gap-0.5 font-bold">
                            {isPaid ? (
                              <span className={`flex items-center gap-0.5 ${isSelected ? 'text-emerald-100' : 'text-emerald-700'}`}>
                                <CheckCircle className="w-3 h-3" />
                                <span>{isBangla ? 'পেইড' : 'Paid'}</span>
                              </span>
                            ) : isPartial ? (
                              <span className={isSelected ? 'text-amber-100 font-bold' : 'text-amber-800 font-bold'}>
                                ৳{mStatus.remainingDue}
                              </span>
                            ) : (
                              <span className={isSelected ? 'text-slate-200' : 'text-slate-400'}>
                                {isBangla ? 'বকেয়া' : 'Due'}
                              </span>
                            )}
                          </span>
                        </button>
                      );
                    })}
                  </div>
                </div>

                {/* Advance Month Presets */}
                <div className="mt-4 pt-3 border-t border-slate-100">
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-[11px] font-black text-slate-600 uppercase tracking-wider">
                      {isBangla ? 'অগ্রিম মাস যোগ করার শর্টকাট (Quick Advance Options)' : 'Quick Advance Options'}
                    </span>
                    {selectedMonths.length > 1 && (
                      <button
                        onClick={() => handleQuickAdvancePreset(0)}
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
                      className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all cursor-pointer border ${selectedMonths.length <= 1 ? 'bg-[#00315e] text-white border-[#00315e] shadow-sm' : 'bg-slate-50 text-slate-700 border-slate-200 hover:bg-slate-100'}`}
                    >
                      {isBangla ? 'শুধু ১ মাস' : 'Only 1 Month'}
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
                      {isBangla ? 'শিক্ষার্থীর ফি সমূহ  প্রয়োজনে পরিমাণ পরিবর্তন বা ফি যোগ করতে পারেন।' : 'Auto-loaded from student fee package. You can customize amounts or add fees.'}
                    </p>
                  </div>

                  {/* Add Extra Fee Dropdown */}
                  <div className="flex items-center gap-2">
                    <select
                      className="px-3 py-1.5 bg-white border border-slate-300 rounded-[4px] text-xs font-bold text-slate-700 outline-none focus:ring-0.1 focus:ring-[#00315e]/20 cursor-pointer"
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
                      <tr className='whitespace-nowrap'>
                        <th className="py-3 px-4 w-12 text-center">
                          <input
                            type="checkbox"
                            className="w-4 h-4 rounded text-[#00315e] focus:ring-[#00315e]"
                            checked={
                              (feeItems.length > 0 ? feeItems.every(f => f.isSelected) : true) &&
                              (previousDue > 0 ? includePreviousDue : true) &&
                              (feeItems.length > 0 || previousDue > 0)
                            }
                            onChange={(e) => {
                              const checked = e.target.checked;
                              setFeeItems(prev => prev.map(f => ({ ...f, isSelected: checked })));
                              if (previousDue > 0) {
                                setIncludePreviousDue(checked);
                              }
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
                      {/* Previous Due Row */}
                      {previousDue > 0 && (
                        <tr
                          className={`transition-colors border-b-2 border-amber-200/60 ${includePreviousDue
                            ? 'bg-amber-50/70 hover:bg-amber-100/60 text-slate-900 font-bold'
                            : 'bg-slate-50/40 text-slate-400 opacity-60 border-b border-slate-100'
                            }`}
                        >
                          <td className="py-3 px-4 text-center">
                            <input
                              type="checkbox"
                              className="w-4 h-4 rounded text-amber-600 focus:ring-amber-500 cursor-pointer"
                              checked={includePreviousDue}
                              onChange={(e) => setIncludePreviousDue(e.target.checked)}
                            />
                          </td>
                          <td className="py-3 px-4">
                            <div className="flex items-center gap-2 flex-wrap">
                              <p className={`font-black text-sm ${includePreviousDue ? 'text-amber-950' : 'text-slate-500'}`}>
                                {isBangla ? 'পূর্বের বকেয়া' : 'Previous Due Balance'}
                              </p>
                              <span className="text-[10px] font-black uppercase tracking-wider bg-amber-200 text-amber-900 border border-amber-300 px-2 py-0.5 rounded-full flex items-center gap-1 shadow-2xs">
                                <ShieldAlert className="w-3 h-3 text-amber-700" />
                                {isBangla ? 'বকেয়া' : 'Due'}
                              </span>
                            </div>
                            <p className="text-[10px] text-amber-800/80 mt-0.5 font-normal">
                              {isBangla ? 'পূর্ববর্তী ট্রানজেকশনের অনাদায়ী বকেয়া' : 'Unpaid balance from past records'}
                            </p>
                          </td>
                          <td className="py-3 px-4 text-amber-900 font-bold">
                            <span className="px-2 py-0.5 bg-amber-100/80 rounded text-amber-800 text-[11px] font-bold">
                              {isBangla ? 'বিগত কিস্তি' : 'Past Dues'}
                            </span>
                          </td>
                          <td className="py-3 px-4">
                            <span className="text-[10px] font-bold px-2 py-0.5 rounded bg-amber-100 text-amber-800">
                              {isBangla ? 'বকেয়া' : 'Due'}
                            </span>
                          </td>
                          <td className="py-3 px-4 text-right">
                            <div className="inline-flex items-center gap-1">
                              <span className="text-amber-700 font-bold">৳</span>
                              <input
                                type="number"
                                min="0"
                                className={`w-24 text-right px-2 py-1 bg-white border rounded font-black focus:outline-none focus:ring-1 focus:ring-amber-500 ${includePreviousDue ? 'border-amber-300 text-amber-950 shadow-2xs' : 'border-slate-200 text-slate-400'
                                  }`}
                                value={customPreviousDue !== '' ? customPreviousDue : previousDue}
                                onChange={(e) => {
                                  const val = e.target.value;
                                  setCustomPreviousDue(val);
                                  const num = Math.max(0, parseFloat(val) || 0);
                                  setPreviousDue(num);
                                }}
                              />
                            </div>
                          </td>
                          <td className="py-3 px-4 text-center">
                            <button
                              type="button"
                              onClick={() => setIncludePreviousDue(!includePreviousDue)}
                              className={`p-1 transition-colors cursor-pointer ${includePreviousDue ? 'text-amber-600 hover:text-rose-600' : 'text-slate-400 hover:text-emerald-600'}`}
                              title={includePreviousDue ? (isBangla ? 'বকেয়া বাদ দিন' : 'Exclude Due') : (isBangla ? 'বকেয়া যোগ করুন' : 'Include Due')}
                            >
                              {includePreviousDue ? <Trash2 className="w-3.5 h-3.5" /> : <Plus className="w-3.5 h-3.5" />}
                            </button>
                          </td>
                        </tr>
                      )}
                      {feeItems.map((fee) => (
                        <tr
                          key={fee.id}
                          className={`transition-colors ${fee.isPaid
                            ? 'bg-emerald-50/30 hover:bg-emerald-50/60 text-slate-800'
                            : fee.isSelected
                              ? (fee.isAdvance ? 'bg-sky-50/40 hover:bg-sky-50/70' : 'hover:bg-slate-50/80')
                              : 'opacity-50 bg-slate-50/30'
                            }`}
                        >
                          <td className="py-3 px-4 text-center">
                            <input
                              type="checkbox"
                              className="w-4 h-4 rounded text-[#00315e] focus:ring-[#00315e] cursor-pointer"
                              checked={fee.isSelected}
                              onChange={() => toggleItemSelection(fee.id)}
                            />
                          </td>
                          <td className="py-3 px-4">
                            <div className="flex items-center gap-2 flex-wrap">
                              <p className="font-bold text-slate-900 text-sm">{fee.head}</p>
                              {fee.isAdvance && (
                                <span className="text-[10px] font-black uppercase tracking-wider bg-sky-100 text-sky-800 px-1.5 py-0.5 rounded">
                                  {isBangla ? 'অগ্রিম' : 'Advance'}
                                </span>
                              )}
                              {fee.isPaid && (
                                <span className="text-[10px] font-black tracking-wide bg-emerald-100 text-emerald-800 border border-emerald-300 px-2 py-0.5 rounded-full flex items-center gap-1 shadow-2xs">
                                  <CheckCircle className="w-3 h-3 text-emerald-600" />
                                  {fee.isAnnualPaid
                                    ? (isBangla ? 'বার্ষিক ফি পরিশোধিত' : 'Annual Fee Paid')
                                    : (isBangla ? 'পরিশোধিত (Paid)' : 'Paid')}
                                </span>
                              )}
                              {!fee.isPaid && fee.paidStatus === 'Partial' && (
                                <span className="text-[10px] font-black tracking-wide bg-amber-100 text-amber-800 border border-amber-300 px-2 py-0.5 rounded-full flex items-center gap-1">
                                  <AlertCircle className="w-3 h-3 text-amber-600" />
                                  {isBangla ? 'আংশিক পরিশোধিত' : 'Partial Paid'}
                                </span>
                              )}
                              {!fee.isPaid && fee.paidStatus !== 'Partial' && (
                                <span className="text-[10px] font-bold text-slate-500 bg-slate-100 px-1.5 py-0.5 rounded">
                                  {isBangla ? 'বকেয়া' : 'Due'}
                                </span>
                              )}
                            </div>
                            {fee.paidReceipt && fee.isPaid && (
                              <p className="text-[10px] text-emerald-700 font-mono font-medium mt-0.5">
                                {isBangla ? 'রশিদ নং:' : 'Receipt:'} <strong>{fee.paidReceipt}</strong>
                              </p>
                            )}
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
                                className={`w-24 text-right px-2 py-1 bg-white border rounded font-black focus:outline-none focus:ring-1 focus:ring-[#00315e] ${fee.isPaid ? 'border-emerald-200 text-emerald-900 bg-emerald-50/20' : 'border-slate-200 text-slate-800'
                                  }`}
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

                      {feeItems.length === 0 && previousDue <= 0 && (
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
                        className="w-full pl-8 pr-3 py-2 bg-slate-50 border border-slate-200 rounded-[4px] font-bold text-slate-800 focus:bg-white focus:outline-none focus:ring-2 focus:ring-[#00315e]/20"
                        placeholder="0"
                        value={discount}
                        onChange={(e) => setDiscount(e.target.value)}
                      />
                    </div>
                  </div>

                  {/* Net Payable Highlight */}
                  <div className="p-3.5  bg-[#00315e]/5 border border-[#00315e]/15">
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
                        className={`w-full pl-8 pr-3 py-2.5 bg-white border rounded-[4px] font-black text-base focus:outline-none transition-all ${paidVal < grandTotal && paidVal > 0 ? 'border-amber-300 text-amber-800 focus:border-amber-500' : 'border-slate-300 text-slate-900 focus:border-[#00315e]'}`}
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

                  {/* Cleared Notice if Fully Paid */}
                  {selectedFees.length === 0 && effectivePreviousDue <= 0 && currentBaseMonthStatus.status === 'Paid' && (
                    <div className="p-3 bg-emerald-50 border border-emerald-300 rounded-xl text-center">
                      <CheckCircle className="w-5 h-5 text-emerald-600 mx-auto mb-1" />
                      <p className="text-xs font-black text-emerald-950">
                        {isBangla ? 'এই মাসের সকল ফি পরিশোধিত' : 'All Fees Paid for this Month'}
                      </p>
                      <p className="text-[11px] text-emerald-700 mt-0.5">
                        {isBangla ? 'বর্তমান ও পূর্বের কোন বকেয়া নেই।' : 'No outstanding amount due.'}
                      </p>
                      {nextUnpaidMonth && (
                        <button
                          type="button"
                          onClick={() => handleBaseMonthChange(nextUnpaidMonth.name)}
                          className="mt-2.5 px-3 py-1.5 bg-emerald-700 text-white rounded-lg text-xs font-bold hover:bg-emerald-800 transition-all inline-flex items-center gap-1 shadow-xs cursor-pointer"
                        >
                          <ArrowRight className="w-3.5 h-3.5" />
                          {isBangla ? `পরবর্তী মাস (${nextUnpaidMonth.bn}) এর ফি জমা নিন` : `Collect Fees for ${nextUnpaidMonth.short}`}
                        </button>
                      )}
                    </div>
                  )}

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
                    {selectedFees.length === 0 && effectivePreviousDue <= 0 && currentBaseMonthStatus.status === 'Paid'
                      ? (isBangla ? 'সকল ফি পরিশোধিত (Paid)' : 'All Fees Paid')
                      : dueVal > 0 && paidVal > 0
                        ? (isBangla ? 'আংশিক পেমেন্ট ও রশিদ প্রিন্ট' : 'Confirm Partial Payment & Print')
                        : (isBangla ? 'পেমেন্ট নিশ্চিত ও রশিদ প্রিন্ট' : 'Confirm Payment & Print Receipt')}
                  </button>

                </div>
              </div>
            </div>

          </div>

          {/* Student Payment History Table (Full Width) */}
          {studentHistory.length > 0 && (
            <div className="bg-white rounded-xl shadow-md border border-slate-200 overflow-hidden">
              <div className="p-4 bg-slate-50 border-b border-slate-200 flex items-center justify-between">
                <h3 className="font-black text-slate-800 text-xs sm:text-sm flex items-center gap-2">
                  <FileText className="w-4 h-4 text-[#00315e]" />
                  {isBangla ? 'এই শিক্ষার্থীর পূর্ববর্তী পেমেন্ট হিস্ট্রি' : 'Previous Payment History for this Student'}
                </h3>
                <span className="text-xs font-bold text-slate-500 bg-white border border-slate-200 px-2.5 py-0.5 rounded-full">
                  {studentHistory.length} {isBangla ? 'টি রেকর্ড' : 'records'}
                </span>
              </div>

              <div className="overflow-x-auto">
                <table className="w-full text-left text-xs">
                  <thead className="bg-slate-100/70 text-slate-600 font-black border-b border-slate-200">
                    <tr className='whitespace-nowrap'>
                      <th className="py-3 px-4">{isBangla ? 'তারিখ' : 'Date'}</th>
                      <th className="py-3 px-4">{isBangla ? 'রিসিট নং' : 'Receipt No'}</th>
                      <th className="py-3 px-4">{isBangla ? 'মাস / ফি বিবরণ' : 'Month / Fee Items'}</th>
                      <th className="py-3 px-4">{isBangla ? 'মেথড ও একাউন্ট' : 'Method & Account'}</th>
                      <th className="py-3 px-4 text-right">{isBangla ? 'সাবটোটাল' : 'Subtotal'}</th>
                      <th className="py-3 px-4 text-right">{isBangla ? 'মওকুফ' : 'Discount'}</th>
                      <th className="py-3 px-4 text-right">{isBangla ? 'পরিশোধিত' : 'Paid'}</th>
                      <th className="py-3 px-4 text-right">{isBangla ? 'অবশিষ্ট বকেয়া' : 'Due'}</th>
                      <th className="py-3 px-4 text-center">{isBangla ? 'একশন' : 'Action'}</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100 font-medium text-slate-700">
                    {studentHistory.map((tx) => {
                      const isTxVoided = tx.status === 'Voided' || tx.is_voided;
                      return (
                        <tr key={tx._id} className={`transition-colors ${isTxVoided ? 'bg-rose-50/40 text-slate-500 hover:bg-rose-50/70' : 'hover:bg-slate-50/80'}`}>
                          <td className="py-3 px-4 font-bold text-slate-600 whitespace-nowrap">
                            {new Date(tx.date || tx.created_at).toLocaleDateString()}
                          </td>
                          <td className="py-3 px-4 font-mono font-bold whitespace-nowrap">
                            <span className={isTxVoided ? 'text-slate-500 line-through' : 'text-[#00315e]'}>
                              {tx.receipt_no || `#${(tx._id || '').slice(-6)}`}
                            </span>
                            {isTxVoided && (
                              <span className="ml-1.5 px-1.5 py-0.5 rounded text-[10px] font-black bg-rose-100 text-rose-800 border border-rose-200 uppercase">
                                {isBangla ? 'বাতিলকৃত' : 'Voided'}
                              </span>
                            )}
                          </td>
                          <td className="py-3 px-4 text-slate-700">
                            {tx.months && tx.months.length > 0 ? (
                              <span className={`inline-flex items-center gap-1 px-2 py-0.5 rounded font-mono text-xs font-bold ${isTxVoided ? 'bg-slate-200/60 text-slate-500 line-through' : 'bg-[#00315e]/10 text-[#00315e]'}`}>
                                {tx.months.join(', ')}
                              </span>
                            ) : (
                              <span className={isTxVoided ? 'line-through text-slate-400' : ''}>{tx.description || 'Fees'}</span>
                            )}
                            {isTxVoided && tx.void_reason && (
                              <span className="text-[10px] text-rose-700 font-medium block mt-0.5">
                                {isBangla ? 'বাতিলের কারণ:' : 'Reason:'} {tx.void_reason}
                              </span>
                            )}
                          </td>
                          <td className="py-3 px-4 text-slate-600 whitespace-nowrap">
                            <span className={`font-bold ${isTxVoided ? 'text-slate-500' : 'text-slate-800'}`}>{tx.payment_method || 'Cash'}</span>
                            {tx.account_name && (
                              <span className="text-slate-400 text-[11px] block">{tx.account_name}</span>
                            )}
                          </td>
                          <td className="py-3 px-4 text-right font-bold text-slate-600 whitespace-nowrap">
                            <span className={isTxVoided ? 'line-through text-slate-400' : ''}>
                              ৳ {Number(tx.subtotal || tx.amount || 0).toLocaleString()}
                            </span>
                          </td>
                          <td className="py-3 px-4 text-right font-bold text-slate-500 whitespace-nowrap">
                            {Number(tx.discount || 0) > 0 ? `৳ ${Number(tx.discount).toLocaleString()}` : '-'}
                          </td>
                          <td className="py-3 px-4 text-right font-black whitespace-nowrap">
                            <span className={isTxVoided ? 'line-through text-slate-400' : 'text-emerald-700'}>
                              ৳ {Number(tx.amount || 0).toLocaleString()}
                            </span>
                          </td>
                          <td className="py-3 px-4 text-right font-black whitespace-nowrap">
                            <span className={isTxVoided ? 'text-slate-400' : (Number(tx.remaining_due) > 0 ? 'text-amber-600 bg-amber-50 px-2 py-0.5 rounded' : 'text-slate-400')}>
                              ৳ {Number(tx.remaining_due || 0).toLocaleString()}
                            </span>
                          </td>
                          <td className="py-3 px-4 text-center whitespace-nowrap">
                            <div className="inline-flex items-center gap-1.5">
                              <button
                                type="button"
                                onClick={() => {
                                  const cName = selectedStudent.classInfo?.name || selectedStudent.class_name || selectedStudent.class || 'N/A';
                                  const sName = selectedStudent.sectionInfo?.name || selectedStudent.section_name || selectedStudent.section || '';
                                  const classFmt = sName ? `${cName} (${sName})` : `${cName} (N/A)`;
                                  const guarName = selectedStudent.guardian?.fatherName || selectedStudent.guardian?.motherName || (typeof selectedStudent.guardian === 'string' ? selectedStudent.guardian : '') || selectedStudent.father_name || selectedStudent.fatherName || '';
                                  const txDate = tx.date ? new Date(tx.date).toISOString().split('T')[0] : (tx.created_at ? new Date(tx.created_at).toISOString().split('T')[0] : new Date().toISOString().split('T')[0]);
                                  const txYear = tx.year || selectedYear || (tx.date ? new Date(tx.date).getFullYear().toString() : new Date().getFullYear().toString());

                                  setVoucherData({
                                    receiptNo: tx.receipt_no || `REC-${(tx._id || '').slice(-6)}`,
                                    date: txDate,
                                    studentName: tx.student_name || `${selectedStudent.firstName || ''} ${selectedStudent.lastName || ''}`.trim(),
                                    studentId: tx.student_id || selectedStudent.student_id,
                                    rollNumber: tx.student_roll || selectedStudent.roll_number,
                                    className: classFmt,
                                    guardianName: guarName,
                                    year: txYear,
                                    academicYear: txYear,
                                    paymentMethod: tx.payment_method || 'Cash',
                                    accountName: tx.account_name || 'Main Cash',
                                    feeDetails: tx.fee_details || [],
                                    previousDue: tx.previous_due || 0,
                                    subtotal: tx.subtotal || tx.amount,
                                    discount: tx.discount || 0,
                                    netPayable: tx.net_payable || tx.amount,
                                    paidAmount: tx.amount,
                                    amount: tx.amount,
                                    remainingDue: tx.remaining_due || 0,
                                    isVoided: isTxVoided,
                                    status: tx.status,
                                    voidReason: tx.void_reason
                                  });
                                  setShowVoucher(true);
                                }}
                                className={`px-2.5 py-1.5 rounded-lg text-xs font-bold transition-all cursor-pointer inline-flex items-center gap-1 ${
                                  isTxVoided
                                    ? 'bg-slate-100 text-slate-600 hover:bg-slate-200'
                                    : 'bg-[#00315e]/10 hover:bg-[#00315e] hover:text-white text-[#00315e]'
                                }`}
                              >
                                <Receipt className="w-3.5 h-3.5" />
                                {isBangla ? 'রশিদ' : 'Receipt'}
                              </button>

                              {!isTxVoided && (
                                <button
                                  type="button"
                                  onClick={() => {
                                    setVoidTargetTx(tx);
                                    setVoidReason('');
                                  }}
                                  className="px-2.5 py-1.5 bg-rose-50 hover:bg-rose-600 hover:text-white text-rose-700 border border-rose-200 hover:border-rose-600 rounded-lg text-xs font-bold transition-all cursor-pointer inline-flex items-center gap-1 shadow-2xs"
                                  title={isBangla ? 'রশিদ ও ট্রানজেকশন বাতিল করুন' : 'Void transaction and rollback balance'}
                                >
                                  <Ban className="w-3.5 h-3.5" />
                                  {isBangla ? 'বাতিল' : 'Void'}
                                </button>
                              )}
                            </div>
                          </td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              </div>
            </div>
          )}

          {/* Void / Cancel Transaction Modal */}
          {voidTargetTx && (
            <div className="fixed inset-0 z-[220] flex items-center justify-center p-4 bg-slate-900/80 backdrop-blur-xs animate-in fade-in duration-200">
              <div className="bg-white w-full max-w-md rounded-2xl shadow-2xl overflow-hidden border border-slate-200 animate-in zoom-in-95 duration-200">
                {/* Modal Header */}
                <div className="p-4 bg-rose-50 border-b border-rose-100 flex items-center justify-between">
                  <div className="flex items-center gap-2.5">
                    <div className="w-8 h-8 rounded-lg bg-rose-600 text-white flex items-center justify-center shadow-sm shadow-rose-600/20">
                      <Ban className="w-4 h-4" />
                    </div>
                    <div>
                      <h3 className="text-sm font-black text-rose-950">
                        {isBangla ? 'রশিদ ও ট্রানজেকশন বাতিলকরণ' : 'Void / Cancel Transaction'}
                      </h3>
                      <p className="text-[11px] text-rose-700 font-medium">
                        {isBangla ? 'অর্থ ও বকেয়া স্বয়ংক্রিয়ভাবে রোলব্যাক হবে' : 'Accounts and student dues will auto-rollback'}
                      </p>
                    </div>
                  </div>
                  <button
                    onClick={() => setVoidTargetTx(null)}
                    className="p-1 text-slate-400 hover:text-slate-600 rounded-md hover:bg-slate-100 transition-colors"
                  >
                    <X className="w-4 h-4" />
                  </button>
                </div>

                {/* Modal Body */}
                <div className="p-5 space-y-4 text-xs text-slate-700">
                  {/* Transaction Snapshot Card */}
                  <div className="p-3.5 bg-slate-50 border border-slate-200 rounded-xl space-y-2">
                    <div className="flex justify-between items-center">
                      <span className="text-slate-500 font-medium">{isBangla ? 'রশিদ নং:' : 'Receipt No:'}</span>
                      <span className="font-mono font-black text-[#00315e]">{voidTargetTx.receipt_no || `#${(voidTargetTx._id || '').slice(-6)}`}</span>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-slate-500 font-medium">{isBangla ? 'শিক্ষার্থী:' : 'Student:'}</span>
                      <span className="font-bold text-slate-900">{voidTargetTx.student_name || selectedStudent?.firstName || 'N/A'}</span>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-slate-500 font-medium">{isBangla ? 'পরিশোধিত অর্থ (ফেরত হবে):' : 'Amount to Rollback:'}</span>
                      <span className="font-black text-rose-700 text-sm">৳ {Number(voidTargetTx.amount || 0).toLocaleString()}</span>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-slate-500 font-medium">{isBangla ? 'অ্যাকাউন্ট:' : 'Deposit Account:'}</span>
                      <span className="font-bold text-slate-800">{voidTargetTx.account_name || 'Main Cash'}</span>
                    </div>
                    {voidTargetTx.months && voidTargetTx.months.length > 0 && (
                      <div className="flex justify-between items-center">
                        <span className="text-slate-500 font-medium">{isBangla ? 'সংশ্লিষ্ট মাস:' : 'Months:'}</span>
                        <span className="font-mono font-bold text-sky-800">{voidTargetTx.months.join(', ')}</span>
                      </div>
                    )}
                  </div>

                  {/* Rollback Alert */}
                  <div className="p-3 bg-amber-50 border border-amber-200 rounded-lg text-amber-900 text-[11px] leading-relaxed flex items-start gap-2">
                    <AlertTriangle className="w-4 h-4 text-amber-600 shrink-0 mt-0.5" />
                    <span>
                      {isBangla
                        ? `সতর্কতা: বাতিল নিশ্চিত করলে ${voidTargetTx.account_name || 'ডিপোজিট একাউন্ট'} থেকে ৳${Number(voidTargetTx.amount || 0).toLocaleString()} মাইনাস হবে এবং শিক্ষার্থীর বকেয়া পূর্বের অবস্থায় পুনঃস্থাপন করা হবে।`
                        : `Warning: Confirming will deduct ৳${Number(voidTargetTx.amount || 0).toLocaleString()} from ${voidTargetTx.account_name || 'account'} and restore the student's due balance.`}
                    </span>
                  </div>

                  {/* Reason Input */}
                  <div>
                    <label className="block text-[11px] font-black text-slate-700 uppercase tracking-wider mb-1.5">
                      {isBangla ? 'বাতিলের কারণ লিখুন *' : 'Reason for Cancellation *'}
                    </label>
                    <textarea
                      rows={2}
                      className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-lg text-xs font-semibold text-slate-800 placeholder:text-slate-400 focus:bg-white focus:outline-none focus:ring-2 focus:ring-rose-500/20 focus:border-rose-500 transition-all resize-none"
                      placeholder={isBangla ? 'যেমন: ভুল শিক্ষার্থী নির্বাচন করা হয়েছিল / ভুল পরিমাণ টাইপ হয়েছে...' : 'e.g. Wrong student selected / Incorrect amount typed...'}
                      value={voidReason}
                      onChange={(e) => setVoidReason(e.target.value)}
                    />

                    {/* Quick Reason Chips */}
                    <div className="flex items-center gap-1.5 flex-wrap mt-2">
                      {[
                        { bn: 'ভুল শিক্ষার্থী নির্বাচন', en: 'Wrong Student' },
                        { bn: 'ভুল টাকার পরিমাণ', en: 'Wrong Amount' },
                        { bn: 'ভুল মাস নির্বাচন', en: 'Wrong Month' },
                        { bn: 'অভিভাবকের অনুরোধ', en: 'Parent Request' }
                      ].map((chip) => (
                        <button
                          key={chip.en}
                          type="button"
                          onClick={() => setVoidReason(isBangla ? chip.bn : chip.en)}
                          className="text-[10px] font-bold px-2 py-0.5 bg-slate-100 hover:bg-rose-50 hover:text-rose-700 text-slate-600 rounded-md border border-slate-200 transition-colors cursor-pointer"
                        >
                          {isBangla ? chip.bn : chip.en}
                        </button>
                      ))}
                    </div>
                  </div>
                </div>

                {/* Modal Footer */}
                <div className="p-4 bg-slate-50 border-t border-slate-200 flex items-center justify-end gap-2.5">
                  <button
                    type="button"
                    onClick={() => setVoidTargetTx(null)}
                    disabled={isVoiding}
                    className="px-4 py-2 bg-white border border-slate-200 text-slate-600 text-xs font-bold rounded-lg hover:bg-slate-100 transition-all cursor-pointer"
                  >
                    {isBangla ? 'ফিরে যান' : 'Cancel'}
                  </button>
                  <button
                    type="button"
                    onClick={handleConfirmVoid}
                    disabled={isVoiding || !voidReason.trim()}
                    className="px-5 py-2 bg-rose-600 hover:bg-rose-700 disabled:opacity-50 text-white text-xs font-bold rounded-lg shadow-md shadow-rose-600/20 transition-all cursor-pointer flex items-center gap-1.5"
                  >
                    {isVoiding && <Loader2 className="w-3.5 h-3.5 animate-spin" />}
                    <span>{isBangla ? 'হ্যাঁ, বাতিল নিশ্চিত করুন' : 'Confirm Void'}</span>
                  </button>
                </div>
              </div>
            </div>
          )}

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
