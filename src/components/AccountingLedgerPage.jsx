import React, { useState, useEffect, useMemo, useCallback } from 'react';
import {
  Printer,
  Save,
  Calendar,
  Plus,
  X,
  Search,
  FilterX,
  CreditCard,
  Receipt,
  ChevronLeft,
  ChevronRight,
  FileText,
  Download,
  SquarePen,
  Trash2,
  Layers,
  AlertTriangle
} from 'lucide-react';
import { useTranslation } from 'react-i18next';
import { toast } from 'react-hot-toast';
import Voucher from './Voucher';
import accountantService from '../services/accountantService';

const PAYMENT_MODES = ['Cash', 'Bank', 'bKash', 'Nagad'];
const ITEMS_PER_PAGE = 10;

const getTodayDate = () => new Date().toISOString().split('T')[0];

const csvEscape = (value) => {
  const str = String(value ?? '');
  return /[",\n\r]/.test(str) ? `"${str.replace(/"/g, '""')}"` : str;
};

const readLocalList = (key) => {
  try {
    const raw = localStorage.getItem(key);
    const parsed = raw ? JSON.parse(raw) : [];
    return Array.isArray(parsed) ? parsed : [];
  } catch {
    return [];
  }
};

const writeLocalList = (key, list) => {
  try {
    localStorage.setItem(key, JSON.stringify(list));
  } catch {
    // Ignore storage quota errors
  }
};

const AccountingLedgerPage = ({ config }) => {
  const { t } = useTranslation();
  const {
    mode,
    storageKey,
    categoriesStorageKey,
    voucherPrefix,
    csvFilePrefix,
    initialCategories,
    translationNamespace,
    icon: PageIcon,
    itemIcon: ItemIcon,
    isExpense,
    labels,
    categoryBadgeMap
  } = config;

  const [records, setRecords] = useState([]);
  const [categories, setCategories] = useState(() => {
    const saved = readLocalList(categoriesStorageKey);
    return Array.from(new Set([...initialCategories, ...saved]));
  });

  const createInitialForm = useCallback(
    (defaultCategory = initialCategories[0] || 'general') => ({
      title: '',
      amount: '',
      category: defaultCategory,
      paymentMode: 'Cash',
      remarks: '',
      date: getTodayDate()
    }),
    [initialCategories]
  );

  const [formData, setFormData] = useState(() => createInitialForm());
  const [editingRecord, setEditingRecord] = useState(null);
  const [deleteTarget, setDeleteTarget] = useState(null);

  // Modals
  const [isEntryModalOpen, setIsEntryModalOpen] = useState(false);
  const [isCategoryModalOpen, setIsCategoryModalOpen] = useState(false);
  const [newCategoryName, setNewCategoryName] = useState('');
  const [selectedVoucher, setSelectedVoucher] = useState(null);

  // Filters & Pagination
  const [searchTerm, setSearchTerm] = useState('');
  const [categoryFilter, setCategoryFilter] = useState('all');
  const [paymentFilter, setPaymentFilter] = useState('all');
  const [dateFilter, setDateFilter] = useState('');
  const [currentPage, setCurrentPage] = useState(1);

  const normalizeRecord = useCallback(
    (item, idx = 0) => ({
      id: item?.id || item?._id || `${mode}-${idx}-${Date.now()}`,
      voucherNo:
        item?.voucherNo ||
        `${voucherPrefix}-${String(idx + 1001).padStart(4, '0')}`,
      title: item?.title || item?.particulars || item?.sourceName || '',
      amount: Number(item?.amount || 0),
      category: item?.category || initialCategories[0] || 'general',
      paymentMode: item?.paymentMode || 'Cash',
      remarks: item?.remarks || '',
      date: item?.date ? String(item.date).split('T')[0] : getTodayDate()
    }),
    [initialCategories, mode, voucherPrefix]
  );

  useEffect(() => {
    let active = true;
    const loadRecords = async () => {
      try {
        const res = await accountantService.getLedgerEntries(mode);
        const apiList = Array.isArray(res?.data) ? res.data : [];
        const localList = readLocalList(storageKey);

        // Migrate any legacy local-only entries into backend once
        if (localList.length > 0 && apiList.length === 0) {
          const migrated = [];
          for (const item of localList) {
            try {
              const created = await accountantService.createLedgerEntry({
                mode,
                title: item.title || item.particulars || item.sourceName || 'Entry',
                amount: Number(item.amount || 0),
                category: item.category || initialCategories[0] || 'general',
                paymentMode: item.paymentMode || 'Cash',
                remarks: item.remarks || '',
                date: item.date || getTodayDate(),
                voucherNo: item.voucherNo || undefined
              });
              if (created?.data) migrated.push(created.data);
            } catch {
              // Keep local item if migration fails
            }
          }
          if (migrated.length > 0) {
            writeLocalList(storageKey, []);
          }
          const finalList = (migrated.length > 0 ? migrated : localList).map((item, idx) =>
            normalizeRecord(item, idx)
          );
          if (active) {
            setRecords(finalList);
            const extraCategories = finalList
              .map((r) => r.category)
              .filter((c) => c && !initialCategories.includes(c));
            if (extraCategories.length > 0) {
              setCategories((prev) => Array.from(new Set([...prev, ...extraCategories])));
            }
          }
          return;
        }

        const normalized = apiList.map((item, idx) => normalizeRecord(item, idx));
        if (active) {
          setRecords(normalized);
          const extraCategories = normalized
            .map((r) => r.category)
            .filter((c) => c && !initialCategories.includes(c));
          if (extraCategories.length > 0) {
            setCategories((prev) => Array.from(new Set([...prev, ...extraCategories])));
          }
        }
      } catch {
        const localList = readLocalList(storageKey).map((item, idx) =>
          normalizeRecord(item, idx)
        );
        if (active) {
          setRecords(localList);
          const extraCategories = localList
            .map((r) => r.category)
            .filter((c) => c && !initialCategories.includes(c));
          if (extraCategories.length > 0) {
            setCategories((prev) => Array.from(new Set([...prev, ...extraCategories])));
          }
        }
      }
    };
    loadRecords();
    return () => {
      active = false;
    };
  }, [initialCategories, mode, normalizeRecord, storageKey]);

  const getCategoryLabel = useCallback(
    (cat) => {
      if (!cat) return '-';
      const key = `${translationNamespace}.categories.${cat}`;
      const translated = t(key);
      return translated === key ? cat : translated;
    },
    [t, translationNamespace]
  );

  const openAddModal = () => {
    setEditingRecord(null);
    setFormData(createInitialForm(categories[0] || 'general'));
    setIsEntryModalOpen(true);
  };

  const openEditModal = (record) => {
    setEditingRecord(record);
    setFormData({
      title: record.title,
      amount: String(record.amount),
      category: record.category,
      paymentMode: record.paymentMode,
      remarks: record.remarks || '',
      date: record.date || getTodayDate()
    });
    setIsEntryModalOpen(true);
  };

  const closeEntryModal = () => {
    setIsEntryModalOpen(false);
    setEditingRecord(null);
    setFormData(createInitialForm(categories[0] || 'general'));
  };

  const handleAddCategory = (e) => {
    e.preventDefault();
    const trimmed = newCategoryName.trim();
    if (!trimmed) {
      toast.error(labels.emptyCategoryError);
      return;
    }
    if (!categories.includes(trimmed)) {
      const nextCategories = [...categories, trimmed];
      setCategories(nextCategories);
      const customOnly = nextCategories.filter((c) => !initialCategories.includes(c));
      writeLocalList(categoriesStorageKey, customOnly);
    }
    setFormData((prev) => ({ ...prev, category: trimmed }));
    setNewCategoryName('');
    setIsCategoryModalOpen(false);
    toast.success(labels.categoryAddedToast);
  };

  const buildVoucherPayload = (record) => {
    const categoryLabel = getCategoryLabel(record.category);
    return {
      receiptNo: record.voucherNo,
      date: record.date,
      amount: record.amount,
      subtotal: record.amount,
      paidAmount: record.amount,
      remainingDue: 0,
      purpose: record.remarks ? `${record.title} (${record.remarks})` : record.title,
      badgeTitle: labels.voucherBadge,
      modalTitle: labels.voucherModalTitle,
      partyTitle: labels.voucherPartyTitle,
      partyName: record.title,
      partySubtitle: `${categoryLabel} • ${record.paymentMode}`,
      partyIdText: `${labels.voucherNoPrefix} ${record.voucherNo}`,
      summaryTitle: labels.voucherSummaryTitle,
      summaryYearLabel: labels.voucherDateLabel,
      year: record.date,
      summaryRightValue: record.paymentMode,
      summaryRightLabel: t(`${translationNamespace}.payment_mode`),
      tableTitle: t(`${translationNamespace}.details`),
      partyColLabel: t(`${translationNamespace}.${isExpense ? 'particulars' : 'source_name'}`),
      categoryColLabel: t(`${translationNamespace}.category`),
      detailsColLabel: t(`${translationNamespace}.remarks_opt`),
      categoryLabel,
      feeDetails: [
        {
          head: record.title,
          period: record.remarks || categoryLabel,
          amount: record.amount
        }
      ]
    };
  };

  const saveRecord = async (openVoucherAfterSave = false) => {
    if (!formData.title.trim() || !formData.amount || Number(formData.amount) <= 0) {
      toast.error(labels.validationError);
      return;
    }

    const basePayload = {
      mode,
      title: formData.title.trim(),
      amount: Number(formData.amount),
      category: formData.category,
      paymentMode: formData.paymentMode,
      remarks: formData.remarks.trim(),
      date: formData.date || getTodayDate()
    };

    let savedRecord;
    let updatedList;

    try {
      if (editingRecord) {
        const res = await accountantService.updateLedgerEntry(editingRecord.id, basePayload);
        savedRecord = normalizeRecord(res?.data || { ...editingRecord, ...basePayload });
        updatedList = records.map((r) => (r.id === editingRecord.id ? savedRecord : r));
        toast.success(labels.updatedToast);
      } else {
        const voucherNo = `${voucherPrefix}-${Math.floor(1000 + Math.random() * 9000)}`;
        const res = await accountantService.createLedgerEntry({ ...basePayload, voucherNo });
        savedRecord = normalizeRecord(res?.data || { ...basePayload, id: `${mode}-${Date.now()}`, voucherNo });
        updatedList = [savedRecord, ...records];
        toast.success(labels.savedToast);
      }
      setRecords(updatedList);
      closeEntryModal();
      if (openVoucherAfterSave) {
        setSelectedVoucher(buildVoucherPayload(savedRecord));
      }
    } catch (err) {
      if (!err?.response || err?.response?.status === 404) {
        if (editingRecord) {
          savedRecord = normalizeRecord({ ...editingRecord, ...basePayload });
          updatedList = records.map((r) => (r.id === editingRecord.id ? savedRecord : r));
          toast.success(labels.updatedToast);
        } else {
          const voucherNo = `${voucherPrefix}-${Math.floor(1000 + Math.random() * 9000)}`;
          savedRecord = normalizeRecord({ ...basePayload, id: `${mode}-${Date.now()}`, voucherNo });
          updatedList = [savedRecord, ...records];
          toast.success(labels.savedToast);
        }
        setRecords(updatedList);
        writeLocalList(storageKey, updatedList);
        closeEntryModal();
        if (openVoucherAfterSave) {
          setSelectedVoucher(buildVoucherPayload(savedRecord));
        }
      } else {
        toast.error(err?.response?.data?.message || 'সংরক্ষণ করতে সমস্যা হয়েছে');
      }
    }
  };

  const handleFormSubmit = (e) => {
    e.preventDefault();
    saveRecord(false);
  };

  const confirmDelete = async () => {
    if (!deleteTarget) return;
    try {
      await accountantService.deleteLedgerEntry(deleteTarget.id);
    } catch {
      // Fallback to local delete if record only existed locally
    }
    const updatedList = records.filter((r) => r.id !== deleteTarget.id);
    setRecords(updatedList);
    writeLocalList(storageKey, updatedList);
    setDeleteTarget(null);
    toast.success(labels.deletedToast);
  };

  // Filtered records
  const filteredRecords = useMemo(() => {
    const query = searchTerm.trim().toLowerCase();
    return records.filter((item) => {
      const matchesSearch =
        !query ||
        item.title.toLowerCase().includes(query) ||
        item.voucherNo.toLowerCase().includes(query) ||
        (item.remarks || '').toLowerCase().includes(query) ||
        getCategoryLabel(item.category).toLowerCase().includes(query);

      const matchesCategory = categoryFilter === 'all' || item.category === categoryFilter;
      const matchesPayment =
        paymentFilter === 'all' ||
        item.paymentMode.toLowerCase() === paymentFilter.toLowerCase();
      const matchesDate = !dateFilter || item.date === dateFilter;

      return matchesSearch && matchesCategory && matchesPayment && matchesDate;
    });
  }, [records, searchTerm, categoryFilter, paymentFilter, dateFilter, getCategoryLabel]);

  useEffect(() => {
    setCurrentPage(1);
  }, [searchTerm, categoryFilter, paymentFilter, dateFilter]);

  const stats = useMemo(() => {
    const totalAmount = filteredRecords.reduce((sum, item) => sum + Number(item.amount || 0), 0);
    const activeCategories = new Set(
      filteredRecords.map((item) => item.category).filter(Boolean)
    ).size;
    return {
      totalAmount,
      totalCount: filteredRecords.length,
      activeCategories
    };
  }, [filteredRecords]);

  const totalPages = Math.ceil(filteredRecords.length / ITEMS_PER_PAGE);
  const paginatedRecords = useMemo(() => {
    const start = (currentPage - 1) * ITEMS_PER_PAGE;
    return filteredRecords.slice(start, start + ITEMS_PER_PAGE);
  }, [filteredRecords, currentPage]);

  const hasActiveFilters =
    searchTerm || categoryFilter !== 'all' || paymentFilter !== 'all' || dateFilter;

  const resetFilters = () => {
    setSearchTerm('');
    setCategoryFilter('all');
    setPaymentFilter('all');
    setDateFilter('');
  };

  const handleExportCSV = () => {
    if (filteredRecords.length === 0) {
      toast.error(labels.emptyExportToast);
      return;
    }

    const headers = [
      'ক্রম',
      labels.voucherColHeader,
      labels.titleColHeader,
      labels.categoryColHeader,
      'পরিমাণ (৳)',
      'পেমেন্ট মাধ্যম',
      'তারিখ',
      'মন্তব্য'
    ];

    const rows = filteredRecords.map((item, idx) =>
      [
        idx + 1,
        item.voucherNo,
        item.title,
        getCategoryLabel(item.category),
        item.amount,
        item.paymentMode,
        item.date,
        item.remarks || '-'
      ]
        .map(csvEscape)
        .join(',')
    );

    const totalRow = [
      '',
      '',
      '',
      `মোট (${filteredRecords.length} টি)`,
      stats.totalAmount,
      '',
      '',
      ''
    ]
      .map(csvEscape)
      .join(',');

    const csv = '\uFEFF' + [headers.join(','), ...rows, totalRow].join('\n');
    const blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `${csvFilePrefix}-${getTodayDate()}.csv`;
    a.click();
    URL.revokeObjectURL(url);
  };

  const getCategoryBadgeClass = (cat) => {
    const key = String(cat).toLowerCase();
    return categoryBadgeMap[key] || (isExpense
      ? 'bg-rose-50 text-rose-700 border-rose-200'
      : 'bg-emerald-50 text-[#1C7D5A] border-emerald-200');
  };

  const amountColorClass = isExpense ? 'text-rose-600' : 'text-[#1C7D5A]';
  const iconAccentClass = isExpense ? 'text-rose-600' : 'text-[#1C7D5A]';
  const kpiIconBgClass = isExpense ? 'bg-rose-50 text-rose-600' : 'bg-emerald-50 text-[#1C7D5A]';
  const badgeIconWrapClass = isExpense
    ? 'bg-rose-50 text-rose-600 border-rose-100'
    : 'bg-emerald-50 text-[#1C7D5A] border-emerald-100';

  return (
    <div className="animate-in fade-in duration-500 space-y-6 pb-16">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-[20px] md:text-2xl font-black text-slate-800 flex items-center gap-3">
            <PageIcon className={`w-8 h-8 ${iconAccentClass}`} />
            {t(`${translationNamespace}.title`)}
          </h1>
          <p className="text-sm text-slate-500 font-bold mt-1">
            {t(`${translationNamespace}.details`)} • {labels.subtitleSuffix}
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-3">
          <button
            type="button"
            onClick={() => setIsCategoryModalOpen(true)}
            className="px-4 py-2.5 bg-white border border-slate-200 hover:border-[#1C7D5A] text-slate-700 rounded-lg font-bold text-sm flex items-center gap-2 shadow-sm cursor-pointer transition-all"
          >
            <Plus className="w-4 h-4 text-[#1C7D5A]" />
            {t(`${translationNamespace}.add_category`)}
          </button>

          <button
            type="button"
            onClick={openAddModal}
            className="px-5 py-2.5 bg-[#1C7D5A] hover:bg-[#123628] text-white rounded-lg font-bold text-sm flex items-center gap-2 shadow-sm cursor-pointer transition-all active:scale-95"
          >
            <Plus className="w-4 h-4" />
            {t(`${translationNamespace}.${isExpense ? 'add_expense' : 'add_income'}`) || labels.addButtonFallback}
          </button>
        </div>
      </div>

      {/* KPI Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div className="bg-white rounded-lg p-5 shadow-sm border border-slate-200 flex items-center justify-between">
          <div>
            <p className="text-xs font-bold text-slate-400 uppercase tracking-wider">
              {labels.kpiTotalLabel}
            </p>
            <p className={`text-2xl font-black mt-1 ${amountColorClass}`}>
              ৳ {stats.totalAmount.toLocaleString()}
            </p>
          </div>
          <div className={`w-11 h-11 rounded-xl flex items-center justify-center ${kpiIconBgClass}`}>
            <PageIcon className="w-5 h-5" />
          </div>
        </div>

        <div className="bg-white rounded-lg p-5 shadow-sm border border-slate-200 flex items-center justify-between">
          <div>
            <p className="text-xs font-bold text-slate-400 uppercase tracking-wider">
              {labels.kpiCountLabel}
            </p>
            <p className="text-2xl font-black text-slate-800 mt-1">{stats.totalCount}</p>
          </div>
          <div className="w-11 h-11 bg-blue-50 text-blue-600 rounded-xl flex items-center justify-center">
            <Receipt className="w-5 h-5" />
          </div>
        </div>

        <div className="bg-white rounded-lg p-5 shadow-sm border border-slate-200 flex items-center justify-between">
          <div>
            <p className="text-xs font-bold text-slate-400 uppercase tracking-wider">
              {t(`${translationNamespace}.category`)}
            </p>
            <p className="text-2xl font-black text-slate-800 mt-1">{stats.activeCategories}</p>
          </div>
          <div className="w-11 h-11 bg-amber-50 text-amber-600 rounded-xl flex items-center justify-center">
            <Layers className="w-5 h-5" />
          </div>
        </div>
      </div>

      {/* Filters */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-3 items-center">
        <div className="relative lg:col-span-2">
          <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            placeholder={labels.searchPlaceholder}
            className="w-full pl-9 pr-3 py-2 bg-slate-50 border border-slate-200 rounded-lg text-sm font-medium text-slate-800 outline-none focus:ring-1 focus:ring-[#1C7D5A] focus:border-[#1C7D5A]"
          />
        </div>

        <select
          value={categoryFilter}
          onChange={(e) => setCategoryFilter(e.target.value)}
          className="px-3 py-2 bg-white border border-slate-200 rounded-lg text-sm font-semibold text-slate-700 outline-none focus:ring-1 focus:ring-[#1C7D5A] focus:border-[#1C7D5A]"
        >
          <option value="all">
            {t(`${translationNamespace}.category`)} ({t('common.all') || 'All'})
          </option>
          {categories.map((cat) => (
            <option key={cat} value={cat}>
              {getCategoryLabel(cat)}
            </option>
          ))}
        </select>

        <select
          value={paymentFilter}
          onChange={(e) => setPaymentFilter(e.target.value)}
          className="px-3 py-2 bg-white border border-slate-200 rounded-lg text-sm font-semibold text-slate-700 outline-none focus:ring-1 focus:ring-[#1C7D5A] focus:border-[#1C7D5A]"
        >
          <option value="all">
            {t(`${translationNamespace}.payment_mode`)} ({t('common.all') || 'All'})
          </option>
          {PAYMENT_MODES.map((modeItem) => (
            <option key={modeItem} value={modeItem}>
              {modeItem}
            </option>
          ))}
        </select>

        <div className="flex items-center gap-2">
          <input
            type="date"
            value={dateFilter}
            onChange={(e) => setDateFilter(e.target.value)}
            className="w-full px-3 py-2 bg-white border border-slate-200 rounded-lg text-sm font-semibold text-slate-700 outline-none focus:ring-1 focus:ring-[#1C7D5A] focus:border-[#1C7D5A]"
          />
          {hasActiveFilters && (
            <button
              type="button"
              onClick={resetFilters}
              title={t('common.reset') || 'Reset'}
              className="p-2 bg-slate-100 hover:bg-rose-50 text-slate-600 hover:text-rose-600 rounded-lg border border-slate-200 transition-colors cursor-pointer shrink-0"
            >
              <FilterX className="w-4 h-4" />
            </button>
          )}
          <button
            type="button"
            onClick={handleExportCSV}
            title="CSV ডাউনলোড করুন"
            className="px-3.5 py-2 bg-white border border-slate-200 hover:border-[#1C7D5A] text-slate-700 rounded-lg text-sm font-bold flex items-center gap-1.5 shadow-sm cursor-pointer transition-colors shrink-0"
          >
            <Download className="w-4 h-4 text-[#1C7D5A]" />
            CSV
          </button>
        </div>
      </div>

      {/* Table Card */}
      <div className="bg-white rounded-lg border border-slate-200 shadow-sm overflow-hidden">
        {filteredRecords.length === 0 ? (
          <div className="py-20 px-4 text-center space-y-3">
            <div className={`w-16 h-16 rounded-full flex items-center justify-center mx-auto ${kpiIconBgClass}`}>
              <PageIcon className="w-8 h-8" />
            </div>
            <p className="text-base font-bold text-slate-700">
              {labels.emptyStateTitle}
            </p>
            <p className="text-xs text-slate-400">
              {labels.emptyStateHint}
            </p>
            <div className="pt-2">
              <button
                type="button"
                onClick={openAddModal}
                className="px-5 py-2.5 bg-[#1C7D5A] hover:bg-[#123628] text-white rounded-lg text-sm font-bold inline-flex items-center gap-2 cursor-pointer transition-all"
              >
                <Plus className="w-4 h-4" />
                {t(`${translationNamespace}.${isExpense ? 'add_expense' : 'add_income'}`) || labels.addButtonFallback}
              </button>
            </div>
          </div>
        ) : (
          <>
            <div className="overflow-x-auto">
              <table className="w-full text-left border-collapse min-w-225">
                <thead className="bg-[#1C7D5A18] text-slate-800 text-[11px] uppercase font-black tracking-wider whitespace-nowrap">
                  <tr>
                    <th className="px-5 py-3.5"># / {labels.voucherColHeader}</th>
                    <th className="px-5 py-3.5">
                      {t(`${translationNamespace}.${isExpense ? 'particulars' : 'source_name'}`)}
                    </th>
                    <th className="px-5 py-3.5 text-center">
                      {t(`${translationNamespace}.category`)}
                    </th>
                    <th className="px-5 py-3.5 text-right">
                      {t(`${translationNamespace}.amount_bdt`)}
                    </th>
                    <th className="px-5 py-3.5 text-center">
                      {t(`${translationNamespace}.payment_mode`)}
                    </th>
                    <th className="px-5 py-3.5 text-center">
                      {t(`${translationNamespace}.date`)}
                    </th>
                    <th className="px-5 py-3.5 text-right">অ্যাকশন</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100 text-sm">
                  {paginatedRecords.map((record, idx) => {
                    const serialNo = (currentPage - 1) * ITEMS_PER_PAGE + idx + 1;
                    return (
                      <tr key={record.id} className="hover:bg-slate-50/70 transition-colors">
                        <td className="px-5 py-3.5 whitespace-nowrap">
                          <div className="text-xs font-black text-slate-400">#{serialNo}</div>
                          <div className="text-xs font-mono font-bold text-slate-700">
                            {record.voucherNo}
                          </div>
                        </td>

                        <td className="px-5 py-3.5">
                          <div className="flex items-center gap-3">
                            <div className={`w-9 h-9 rounded-full border flex items-center justify-center shrink-0 ${badgeIconWrapClass}`}>
                              <ItemIcon className="w-4 h-4" />
                            </div>
                            <div className="min-w-0">
                              <p className="font-bold text-slate-800 truncate">
                                {record.title}
                              </p>
                              {record.remarks && (
                                <p className="text-[11px] text-slate-400 truncate max-w-65 mt-0.5">
                                  {record.remarks}
                                </p>
                              )}
                            </div>
                          </div>
                        </td>

                        <td className="px-5 py-3.5 text-center whitespace-nowrap">
                          <span
                            className={`inline-flex items-center px-2.5 py-1 rounded-full text-xs font-bold border ${getCategoryBadgeClass(
                              record.category
                            )}`}
                          >
                            {getCategoryLabel(record.category)}
                          </span>
                        </td>

                        <td className="px-5 py-3.5 text-right whitespace-nowrap">
                          <span className={`text-base font-black ${amountColorClass}`}>
                            ৳ {Number(record.amount || 0).toLocaleString()}
                          </span>
                        </td>

                        <td className="px-5 py-3.5 text-center whitespace-nowrap">
                          <span className="inline-flex items-center gap-1.5 px-2.5 py-1 bg-slate-100 text-slate-700 rounded-md text-xs font-bold">
                            <CreditCard className="w-3.5 h-3.5 text-slate-500" />
                            {record.paymentMode}
                          </span>
                        </td>

                        <td className="px-5 py-3.5 text-center whitespace-nowrap">
                          <span className="inline-flex items-center gap-1.5 text-xs font-semibold text-slate-600">
                            <Calendar className="w-3.5 h-3.5 text-slate-400" />
                            {record.date}
                          </span>
                        </td>

                        <td className="px-5 py-3.5 text-right whitespace-nowrap">
                          <div className="inline-flex items-center gap-1.5 justify-end">
                            <button
                              type="button"
                              onClick={() => setSelectedVoucher(buildVoucherPayload(record))}
                              title={t(`${translationNamespace}.print_voucher`)}
                              className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-slate-100 hover:bg-[#1C7D5A] text-slate-700 hover:text-white rounded-lg text-xs font-bold transition-colors cursor-pointer"
                            >
                              <Printer className="w-3.5 h-3.5" />
                              {labels.printActionLabel}
                            </button>
                            <button
                              type="button"
                              onClick={() => openEditModal(record)}
                              title={t('common.edit') || 'Edit'}
                              className="p-1.5 text-[#1C7D5A] hover:bg-emerald-50 rounded-lg transition-colors cursor-pointer"
                            >
                              <SquarePen className="w-4 h-4" />
                            </button>
                            <button
                              type="button"
                              onClick={() => setDeleteTarget(record)}
                              title={t('common.delete') || 'Delete'}
                              className="p-1.5 text-rose-500 hover:bg-rose-50 rounded-lg transition-colors cursor-pointer"
                            >
                              <Trash2 className="w-4 h-4" />
                            </button>
                          </div>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>

            {totalPages > 1 && (
              <div className="bg-slate-50/70 px-5 py-3.5 border-t border-slate-200 flex flex-col sm:flex-row items-center justify-between gap-3">
                <p className="text-xs font-bold text-slate-500">
                  মোট {filteredRecords.length} টি রেকর্ডের মধ্যে{' '}
                  {(currentPage - 1) * ITEMS_PER_PAGE + 1} -{' '}
                  {Math.min(currentPage * ITEMS_PER_PAGE, filteredRecords.length)} দেখানো হচ্ছে
                </p>
                <div className="flex items-center gap-1.5">
                  <button
                    type="button"
                    disabled={currentPage === 1}
                    onClick={() => setCurrentPage((p) => Math.max(1, p - 1))}
                    className="p-1.5 border border-slate-200 rounded-lg bg-white text-slate-600 hover:border-[#1C7D5A] hover:text-[#1C7D5A] disabled:opacity-40 cursor-pointer disabled:cursor-not-allowed"
                  >
                    <ChevronLeft className="w-4 h-4" />
                  </button>
                  {Array.from({ length: totalPages }, (_, i) => i + 1).map((page) => (
                    <button
                      key={page}
                      type="button"
                      onClick={() => setCurrentPage(page)}
                      className={`w-8 h-8 rounded-lg text-xs font-bold border transition-all cursor-pointer ${
                        currentPage === page
                          ? 'bg-[#1C7D5A] border-[#1C7D5A] text-white'
                          : 'bg-white border-slate-200 text-slate-600 hover:border-[#1C7D5A]'
                      }`}
                    >
                      {page}
                    </button>
                  ))}
                  <button
                    type="button"
                    disabled={currentPage === totalPages}
                    onClick={() => setCurrentPage((p) => Math.min(totalPages, p + 1))}
                    className="p-1.5 border border-slate-200 rounded-[8px] bg-white text-slate-600 hover:border-[#1C7D5A] hover:text-[#1C7D5A] disabled:opacity-40 cursor-pointer disabled:cursor-not-allowed"
                  >
                    <ChevronRight className="w-4 h-4" />
                  </button>
                </div>
              </div>
            )}
          </>
        )}
      </div>

      {/* Add / Edit Entry Modal */}
      {isEntryModalOpen && (
        <div className="fixed inset-0 z-[120] bg-slate-900/60 backdrop-blur-sm flex items-center justify-center p-4 animate-in fade-in duration-200">
          <div className="bg-white rounded-[16px] w-full max-w-2xl shadow-2xl overflow-hidden flex flex-col max-h-[92vh] animate-in zoom-in duration-200">
            <div className="p-5 border-b border-slate-100 flex justify-between items-center bg-slate-50 shrink-0">
              <div className="flex items-center gap-3">
                <div className={`w-10 h-10 rounded-xl flex items-center justify-center border ${badgeIconWrapClass}`}>
                  <PageIcon className="w-5 h-5" />
                </div>
                <div>
                  <h2 className="font-black text-slate-800 text-base">
                    {editingRecord
                      ? t(`${translationNamespace}.${isExpense ? 'edit_expense' : 'edit_income'}`) || labels.editModalTitleFallback
                      : t(`${translationNamespace}.${isExpense ? 'add_expense' : 'add_income'}`) || labels.addButtonFallback}
                  </h2>
                  <p className="text-xs font-bold text-slate-400">
                    {t(`${translationNamespace}.details`)}
                  </p>
                </div>
              </div>
              <button
                type="button"
                onClick={closeEntryModal}
                className="p-1.5 text-slate-400 hover:text-slate-700 hover:bg-slate-200/60 rounded-full transition-colors cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleFormSubmit} className="p-6 space-y-5 overflow-y-auto">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="md:col-span-2 space-y-1.5">
                  <label className="text-xs font-bold text-slate-700 block">
                    {t(`${translationNamespace}.${isExpense ? 'particulars' : 'source_name'}`)}{' '}
                    <span className="text-rose-500">*</span>
                  </label>
                  <div className="relative">
                    <ItemIcon className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                    <input
                      type="text"
                      required
                      autoFocus
                      className="w-full pl-9 pr-3 py-2 border border-slate-200 rounded-[8px] text-sm font-semibold text-slate-800 outline-none focus:ring-1 focus:ring-[#1C7D5A] focus:border-[#1C7D5A]"
                      placeholder={labels.titlePlaceholder}
                      value={formData.title}
                      onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                    />
                  </div>
                </div>

                <div className="space-y-1.5">
                  <label className="text-xs font-bold text-slate-700 block">
                    {t(`${translationNamespace}.amount_bdt`)} <span className="text-rose-500">*</span>
                  </label>
                  <div className="relative">
                    <span className="absolute left-3.5 top-1/2 -translate-y-1/2 text-base font-black text-slate-400">
                      ৳
                    </span>
                    <input
                      type="number"
                      required
                      min="1"
                      step="any"
                      className={`w-full pl-9 pr-3 py-2 text-base font-black border border-slate-200 rounded-[8px] outline-none focus:ring-1 focus:ring-[#1C7D5A] focus:border-[#1C7D5A] ${amountColorClass}`}
                      placeholder="0.00"
                      value={formData.amount}
                      onChange={(e) => setFormData({ ...formData, amount: e.target.value })}
                    />
                  </div>
                </div>

                <div className="space-y-1.5">
                  <div className="flex items-center justify-between">
                    <label className="text-xs font-bold text-slate-700">
                      {t(`${translationNamespace}.category`)}
                    </label>
                    <button
                      type="button"
                      onClick={() => setIsCategoryModalOpen(true)}
                      className="text-[11px] font-bold text-[#1C7D5A] hover:underline flex items-center gap-0.5 cursor-pointer"
                    >
                      <Plus className="w-3 h-3" /> {t(`${translationNamespace}.add_category`)}
                    </button>
                  </div>
                  <select
                    className="w-full px-3 py-2 bg-white border border-slate-200 rounded-[8px] text-sm font-bold text-slate-700 outline-none focus:ring-1 focus:ring-[#1C7D5A] focus:border-[#1C7D5A]"
                    value={formData.category}
                    onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                  >
                    {categories.map((cat) => (
                      <option key={cat} value={cat}>
                        {getCategoryLabel(cat)}
                      </option>
                    ))}
                  </select>
                </div>

                <div className="space-y-1.5">
                  <label className="text-xs font-bold text-slate-700 block">
                    {t(`${translationNamespace}.payment_mode`)}
                  </label>
                  <select
                    className="w-full px-3 py-2 bg-white border border-slate-200 rounded-[8px] text-sm font-bold text-slate-700 outline-none focus:ring-1 focus:ring-[#1C7D5A] focus:border-[#1C7D5A]"
                    value={formData.paymentMode}
                    onChange={(e) => setFormData({ ...formData, paymentMode: e.target.value })}
                  >
                    {PAYMENT_MODES.map((modeItem) => (
                      <option key={modeItem} value={modeItem}>
                        {modeItem}
                      </option>
                    ))}
                  </select>
                </div>

                <div className="space-y-1.5">
                  <label className="text-xs font-bold text-slate-700 block">
                    {t(`${translationNamespace}.date`)}
                  </label>
                  <input
                    type="date"
                    className="w-full px-3 py-2 bg-white border border-slate-200 rounded-[8px] text-sm font-bold text-slate-700 outline-none focus:ring-1 focus:ring-[#1C7D5A] focus:border-[#1C7D5A]"
                    value={formData.date}
                    onChange={(e) => setFormData({ ...formData, date: e.target.value })}
                  />
                </div>

                <div className="md:col-span-2 space-y-1.5">
                  <label className="text-xs font-bold text-slate-700 block">
                    {t(`${translationNamespace}.remarks_opt`)}
                  </label>
                  <div className="relative">
                    <FileText className="absolute left-3 top-2.5 w-4 h-4 text-slate-400" />
                    <input
                      type="text"
                      className="w-full pl-9 pr-3 py-2 border border-slate-200 rounded-[8px] text-sm font-medium text-slate-800 outline-none focus:ring-1 focus:ring-[#1C7D5A] focus:border-[#1C7D5A]"
                      placeholder="অতিরিক্ত কোনো নোট বা বিবরণ..."
                      value={formData.remarks}
                      onChange={(e) => setFormData({ ...formData, remarks: e.target.value })}
                    />
                  </div>
                </div>
              </div>

              <div className="pt-4 flex flex-wrap items-center justify-end gap-3 border-t border-slate-100">
                <button
                  type="button"
                  onClick={closeEntryModal}
                  className="px-5 py-2 text-xs font-bold text-slate-600 bg-slate-100 hover:bg-slate-200 rounded-[8px] transition-colors cursor-pointer"
                >
                  {t('common.cancel')}
                </button>
                <button
                  type="button"
                  onClick={() => saveRecord(true)}
                  className="px-5 py-2 bg-slate-800 hover:bg-slate-900 text-white text-xs font-bold rounded-[8px] flex items-center gap-2 transition-all cursor-pointer"
                >
                  <Printer className="w-4 h-4" />
                  {t(`${translationNamespace}.save_record`)} & {labels.printActionLabel}
                </button>
                <button
                  type="submit"
                  className="px-6 py-2 bg-[#1C7D5A] hover:bg-[#123628] text-white text-xs font-black rounded-[8px] flex items-center gap-2 shadow-sm transition-all cursor-pointer"
                >
                  <Save className="w-4 h-4" />
                  {t(`${translationNamespace}.save_record`)}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Add Category Modal */}
      {isCategoryModalOpen && (
        <div className="fixed inset-0 z-[150] flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm animate-in fade-in duration-200">
          <div className="bg-white w-full max-w-md rounded-[16px] shadow-2xl overflow-hidden animate-in zoom-in duration-200">
            <div className="p-5 bg-slate-50 border-b border-slate-100 flex justify-between items-center">
              <h2 className="text-base font-black text-slate-800 flex items-center gap-2">
                <Plus className="w-5 h-5 text-[#1C7D5A]" />
                {t(`${translationNamespace}.add_category_modal`)}
              </h2>
              <button
                type="button"
                onClick={() => setIsCategoryModalOpen(false)}
                className="p-1 text-slate-400 hover:text-slate-600 rounded-full cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleAddCategory} className="p-6 space-y-5">
              <div className="space-y-1.5">
                <label className="text-xs font-bold text-slate-700 block">
                  {t(`${translationNamespace}.category_name`)}
                </label>
                <input
                  type="text"
                  autoFocus
                  className="w-full px-4 py-2.5 border border-slate-200 rounded-[8px] focus:outline-none focus:ring-1 focus:ring-[#1C7D5A] focus:border-[#1C7D5A] font-bold text-sm text-slate-700"
                  placeholder={labels.categoryPlaceholder}
                  value={newCategoryName}
                  onChange={(e) => setNewCategoryName(e.target.value)}
                />
              </div>

              <div className="flex justify-end gap-3 pt-2">
                <button
                  type="button"
                  onClick={() => setIsCategoryModalOpen(false)}
                  className="px-5 py-2 bg-slate-100 text-slate-600 text-xs font-bold rounded-[8px] hover:bg-slate-200 transition-all cursor-pointer"
                >
                  {t('common.cancel')}
                </button>
                <button
                  type="submit"
                  className="px-6 py-2 bg-[#1C7D5A] hover:bg-[#123628] text-white text-xs font-black rounded-[8px] shadow-sm transition-all cursor-pointer"
                >
                  {t(`${translationNamespace}.add_category`)}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Delete Confirmation Modal */}
      {deleteTarget && (
        <div className="fixed inset-0 z-[160] flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm animate-in fade-in duration-200">
          <div className="bg-white w-full max-w-sm rounded-[16px] shadow-2xl overflow-hidden p-6 space-y-4 animate-in zoom-in duration-200">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-full bg-rose-50 text-rose-600 flex items-center justify-center shrink-0">
                <AlertTriangle className="w-5 h-5" />
              </div>
              <div>
                <h3 className="text-base font-black text-slate-800">{labels.deleteModalTitle}</h3>
                <p className="text-xs text-slate-500 font-medium mt-0.5">
                  {deleteTarget.voucherNo} • {deleteTarget.title}
                </p>
              </div>
            </div>
            <p className="text-xs font-semibold text-slate-600">{labels.deleteModalDesc}</p>
            <div className="flex justify-end gap-2 pt-2">
              <button
                type="button"
                onClick={() => setDeleteTarget(null)}
                className="px-4 py-2 bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-bold rounded-[8px] cursor-pointer"
              >
                {t('common.cancel')}
              </button>
              <button
                type="button"
                onClick={confirmDelete}
                className="px-4 py-2 bg-rose-600 hover:bg-rose-700 text-white text-xs font-bold rounded-[8px] cursor-pointer"
              >
                {t('common.delete') || 'Delete'}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Printable Voucher Modal */}
      {selectedVoucher && (
        <Voucher data={selectedVoucher} onClose={() => setSelectedVoucher(null)} />
      )}
    </div>
  );
};

export default AccountingLedgerPage;
