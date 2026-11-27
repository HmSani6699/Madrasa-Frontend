import React, { useState, useEffect, useMemo, useCallback } from 'react';
import {
  HeartHandshake,
  Printer,
  Save,
  User,
  Phone,
  MapPin,
  Calendar,
  Plus,
  X,
  Search,
  FilterX,
  CreditCard,
  TrendingUp,
  Users,
  Receipt,
  Loader2,
  ChevronLeft,
  ChevronRight,
  FileText,
  Download
} from 'lucide-react';
import { useTranslation } from 'react-i18next';
import { toast } from 'react-hot-toast';
import Voucher from '../../components/Voucher';
import accountantService from '../../services/accountantService';

const LOCAL_DONATIONS_KEY = 'madrasa_donations_local';

const INITIAL_DONATION_TYPES = [
  'general',
  'zakat',
  'lillah',
  'construction',
  'sponsorship',
  'iftar'
];

const PAYMENT_MODES = ['Cash', 'Bkash', 'Nagad', 'Bank'];

const getTodayDate = () => new Date().toISOString().split('T')[0];

const csvEscape = (value) => {
  const str = String(value ?? '');
  return /[",\n\r]/.test(str) ? `"${str.replace(/"/g, '""')}"` : str;
};

const createInitialForm = (defaultType = 'general') => ({
  donorName: '',
  phone: '',
  address: '',
  amount: '',
  type: defaultType,
  paymentMode: 'Cash',
  remarks: '',
  date: getTodayDate()
});

const generateReceiptNo = () => `DON-${Math.floor(1000 + Math.random() * 9000)}`;

const readLocalDonations = () => {
  try {
    const raw = localStorage.getItem(LOCAL_DONATIONS_KEY);
    const parsed = raw ? JSON.parse(raw) : [];
    return Array.isArray(parsed) ? parsed : [];
  } catch {
    return [];
  }
};

const writeLocalDonations = (list) => {
  try {
    localStorage.setItem(LOCAL_DONATIONS_KEY, JSON.stringify(list));
  } catch {
    // Ignore storage quota errors
  }
};

const normalizeDonation = (item, idx = 0) => ({
  id: item?._id || item?.id || `local-${idx}-${Date.now()}`,
  receiptNo: item?.receiptNo || item?.receipt_no || `DON-${String(idx + 1).padStart(4, '0')}`,
  donorName: item?.donorName || item?.donor_name || item?.donor || 'Guest Donor',
  phone: item?.phone || '',
  address: item?.address || '',
  amount: Number(item?.amount || 0),
  type: item?.type || item?.fundType || 'general',
  paymentMode: item?.paymentMode || item?.payment_mode || item?.method || 'Cash',
  remarks: item?.remarks || item?.purpose || '',
  date: item?.date ? String(item.date).split('T')[0] : getTodayDate()
});

const DonationEntry = () => {
  const { t } = useTranslation();

  const [donations, setDonations] = useState([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  const [donationTypes, setDonationTypes] = useState(INITIAL_DONATION_TYPES);
  const [formData, setFormData] = useState(() => createInitialForm());

  // Modals
  const [isDonationModalOpen, setIsDonationModalOpen] = useState(false);
  const [isFundModalOpen, setIsFundModalOpen] = useState(false);
  const [newFundName, setNewFundName] = useState('');
  const [selectedVoucher, setSelectedVoucher] = useState(null);

  // Filters & Pagination
  const [searchTerm, setSearchTerm] = useState('');
  const [typeFilter, setTypeFilter] = useState('all');
  const [paymentFilter, setPaymentFilter] = useState('all');
  const [dateFilter, setDateFilter] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 10;

  const getFundLabel = useCallback(
    (type) => {
      if (!type) return '-';
      const key = `donation_page.types.${type}`;
      const translated = t(key);
      return translated === key ? type : translated;
    },
    [t]
  );

  const fetchDonations = useCallback(async () => {
    setLoading(true);
    try {
      const res = await accountantService.getDonations();
      let rawList = Array.isArray(res) ? res : Array.isArray(res?.data) ? res.data : [];

      // Migrate any legacy local-only donations once if backend is empty
      const localList = readLocalDonations();
      if (rawList.length === 0 && localList.length > 0) {
        const migrated = [];
        for (const item of localList) {
          try {
            const created = await accountantService.addDonation({
              donorName: item.donorName || item.donor_name || 'Guest Donor',
              phone: item.phone || '',
              address: item.address || '',
              amount: Number(item.amount || 0),
              type: item.type || 'general',
              paymentMode: item.paymentMode || 'Cash',
              remarks: item.remarks || '',
              date: item.date || getTodayDate(),
              receiptNo: item.receiptNo || undefined
            });
            if (created?.data) migrated.push(created.data);
          } catch {
            // Keep local if migration fails
          }
        }
        if (migrated.length > 0) {
          writeLocalDonations([]);
          rawList = migrated;
        }
      }

      const normalized = rawList.map((item, idx) => normalizeDonation(item, idx));
      setDonations(normalized);

      const extraTypes = normalized
        .map((d) => d.type)
        .filter((tp) => tp && !INITIAL_DONATION_TYPES.includes(tp));
      if (extraTypes.length > 0) {
        setDonationTypes((prev) => Array.from(new Set([...prev, ...extraTypes])));
      }
    } catch (err) {
      if (err?.response?.status === 404) {
        const localList = readLocalDonations().map((item, idx) => normalizeDonation(item, idx));
        setDonations(localList);
        const extraTypes = localList
          .map((d) => d.type)
          .filter((tp) => tp && !INITIAL_DONATION_TYPES.includes(tp));
        if (extraTypes.length > 0) {
          setDonationTypes((prev) => Array.from(new Set([...prev, ...extraTypes])));
        }
      } else {
        toast.error(err?.response?.data?.message || 'অনুদানের তালিকা লোড করতে সমস্যা হয়েছে');
      }
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchDonations();
  }, [fetchDonations]);

  const handleOpenAddModal = () => {
    setFormData(createInitialForm(donationTypes[0] || 'general'));
    setIsDonationModalOpen(true);
  };

  const handleCloseAddModal = () => {
    setIsDonationModalOpen(false);
    setFormData(createInitialForm(donationTypes[0] || 'general'));
  };

  const handleAddFundType = (e) => {
    e.preventDefault();
    const trimmed = newFundName.trim();
    if (!trimmed) {
      toast.error('অনুগ্রহ করে ফান্ডের নাম লিখুন');
      return;
    }
    if (!donationTypes.includes(trimmed)) {
      setDonationTypes((prev) => [...prev, trimmed]);
    }
    setFormData((prev) => ({ ...prev, type: trimmed }));
    setNewFundName('');
    setIsFundModalOpen(false);
    toast.success('নতুন ফান্ডের ধরন যোগ হয়েছে');
  };

  const buildVoucherPayload = (donation) => ({
    receiptNo: donation.receiptNo,
    date: donation.date,
    donorName: donation.donorName || 'Guest Donor',
    amount: donation.amount,
    purpose: `${getFundLabel(donation.type)} donation`,
    badgeTitle: 'Donation\nReceipt',
    amountInWords: ''
  });

  const saveDonation = async (openVoucherAfterSave = false) => {
    if (!formData.donorName.trim() || !formData.amount || Number(formData.amount) <= 0) {
      toast.error('অনুগ্রহ করে দাতার নাম ও সঠিক পরিমাণ লিখুন');
      return;
    }

    const receiptNo = generateReceiptNo();
    const payload = {
      ...formData,
      donorName: formData.donorName.trim(),
      phone: formData.phone.trim(),
      address: formData.address.trim(),
      remarks: formData.remarks.trim(),
      amount: Number(formData.amount),
      receiptNo
    };

    setSaving(true);
    try {
      const res = await accountantService.addDonation(payload);
      const savedItem = normalizeDonation(res?.data || payload, donations.length);
      setDonations((prev) => [savedItem, ...prev]);
      toast.success(res?.message || 'অনুদান সফলভাবে সংরক্ষণ করা হয়েছে!');
      handleCloseAddModal();
      if (openVoucherAfterSave) {
        setSelectedVoucher(buildVoucherPayload(savedItem));
      }
    } catch (err) {
      if (err?.response?.status === 404) {
        const localItem = normalizeDonation(
          { ...payload, id: `local-${Date.now()}` },
          donations.length
        );
        const updated = [localItem, ...donations];
        setDonations(updated);
        writeLocalDonations(updated);
        toast.success('অনুদান সফলভাবে সংরক্ষণ করা হয়েছে!');
        handleCloseAddModal();
        if (openVoucherAfterSave) {
          setSelectedVoucher(buildVoucherPayload(localItem));
        }
      } else {
        toast.error(err?.response?.data?.error || err?.response?.data?.message || err.message);
      }
    } finally {
      setSaving(false);
    }
  };

  const handleSave = async (e) => {
    e.preventDefault();
    await saveDonation(false);
  };

  // Filtered donations
  const filteredDonations = useMemo(() => {
    const query = searchTerm.trim().toLowerCase();
    return donations.filter((item) => {
      const matchesSearch =
        !query ||
        item.donorName.toLowerCase().includes(query) ||
        item.phone.toLowerCase().includes(query) ||
        item.address.toLowerCase().includes(query) ||
        item.receiptNo.toLowerCase().includes(query) ||
        item.remarks.toLowerCase().includes(query);

      const matchesType = typeFilter === 'all' || item.type === typeFilter;
      const matchesPayment =
        paymentFilter === 'all' ||
        item.paymentMode.toLowerCase() === paymentFilter.toLowerCase();
      const matchesDate = !dateFilter || item.date === dateFilter;

      return matchesSearch && matchesType && matchesPayment && matchesDate;
    });
  }, [donations, searchTerm, typeFilter, paymentFilter, dateFilter]);

  useEffect(() => {
    setCurrentPage(1);
  }, [searchTerm, typeFilter, paymentFilter, dateFilter]);

  // Stats based on filtered donations
  const stats = useMemo(() => {
    const totalAmount = filteredDonations.reduce((sum, item) => sum + Number(item.amount || 0), 0);
    const uniqueDonors = new Set(
      filteredDonations.map((item) => item.donorName.trim().toLowerCase()).filter(Boolean)
    ).size;
    return {
      totalAmount,
      totalCount: filteredDonations.length,
      uniqueDonors
    };
  }, [filteredDonations]);

  const totalPages = Math.ceil(filteredDonations.length / itemsPerPage);
  const paginatedDonations = useMemo(() => {
    const start = (currentPage - 1) * itemsPerPage;
    return filteredDonations.slice(start, start + itemsPerPage);
  }, [filteredDonations, currentPage]);

  const hasActiveFilters = searchTerm || typeFilter !== 'all' || paymentFilter !== 'all' || dateFilter;

  const resetFilters = () => {
    setSearchTerm('');
    setTypeFilter('all');
    setPaymentFilter('all');
    setDateFilter('');
  };

  const handleExportCSV = () => {
    if (filteredDonations.length === 0) {
      toast.error('ডাউনলোড করার মতো কোনো তথ্য নেই');
      return;
    }

    const headers = [
      'ক্রম',
      'রসিদ নং',
      'দাতার নাম',
      'ফোন',
      'ঠিকানা',
      'ফান্ডের ধরন',
      'পরিমাণ (৳)',
      'পেমেন্ট মাধ্যম',
      'তারিখ',
      'মন্তব্য'
    ];

    const rows = filteredDonations.map((d, idx) =>
      [
        idx + 1,
        d.receiptNo,
        d.donorName,
        d.phone || '-',
        d.address || '-',
        getFundLabel(d.type),
        d.amount,
        d.paymentMode,
        d.date,
        d.remarks || '-'
      ]
        .map(csvEscape)
        .join(',')
    );

    const totalAmount = filteredDonations.reduce((sum, d) => sum + Number(d.amount || 0), 0);

    const totalRow = [
      '',
      '',
      '',
      '',
      '',
      `মোট (${filteredDonations.length} টি)`,
      totalAmount,
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
    a.download = `donations-${getTodayDate()}.csv`;
    a.click();
    URL.revokeObjectURL(url);
  };

  const getTypeBadgeClass = (type) => {
    switch (String(type).toLowerCase()) {
      case 'zakat':
        return 'bg-amber-50 text-amber-700 border-amber-200';
      case 'lillah':
        return 'bg-indigo-50 text-indigo-700 border-indigo-200';
      case 'construction':
        return 'bg-sky-50 text-sky-700 border-sky-200';
      case 'sponsorship':
        return 'bg-purple-50 text-purple-700 border-purple-200';
      case 'iftar':
        return 'bg-orange-50 text-orange-700 border-orange-200';
      default:
        return 'bg-emerald-50 text-[#1C7D5A] border-emerald-200';
    }
  };

  return (
    <div className="animate-in fade-in duration-500 space-y-6 pb-16">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-[20px] md:text-2xl font-black text-slate-800 flex items-center gap-3">
            <HeartHandshake className="w-8 h-8 text-[#1C7D5A]" />
            {t('donation_page.title')}
          </h1>
          <p className="text-sm text-slate-500 font-bold mt-1">
            {t('donation_page.history')} • {t('donation_page.receipt')}
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-3">
          <button
            type="button"
            onClick={() => setIsFundModalOpen(true)}
            className="px-4 py-2.5 bg-white border border-slate-200 hover:border-[#1C7D5A] text-slate-700 rounded-lg font-bold text-sm flex items-center gap-2 shadow-sm cursor-pointer transition-all"
          >
            <Plus className="w-4 h-4 text-[#1C7D5A]" />
            {t('donation_page.add_type')}
          </button>

          <button
            type="button"
            onClick={handleOpenAddModal}
            className="px-5 py-2.5 bg-[#1C7D5A] hover:bg-[#123628] text-white rounded-lg font-bold text-sm flex items-center gap-2 shadow-sm cursor-pointer transition-all active:scale-95"
          >
            <Plus className="w-4 h-4" />
            {t('donation_page.add_donation')}
          </button>
        </div>
      </div>

      {/* KPI Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div className="bg-white rounded-lg p-5 shadow-sm border border-slate-200 flex items-center justify-between">
          <div>
            <p className="text-xs font-bold text-slate-400 uppercase tracking-wider">
              {t('donation_page.total_collection')}
            </p>
            <p className="text-2xl font-black text-[#1C7D5A] mt-1">
              ৳ {stats.totalAmount.toLocaleString()}
            </p>
          </div>
          <div className="w-11 h-11 bg-emerald-50 text-[#1C7D5A] rounded-xl flex items-center justify-center">
            <TrendingUp className="w-5 h-5" />
          </div>
        </div>

        <div className="bg-white rounded-lg p-5 shadow-sm border border-slate-200 flex items-center justify-between">
          <div>
            <p className="text-xs font-bold text-slate-400 uppercase tracking-wider">
              {t('donation_page.donation_details')}
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
              {t('donation_page.unique_donors')}
            </p>
            <p className="text-2xl font-black text-slate-800 mt-1">{stats.uniqueDonors}</p>
          </div>
          <div className="w-11 h-11 bg-amber-50 text-amber-600 rounded-xl flex items-center justify-center">
            <Users className="w-5 h-5" />
          </div>
        </div>
      </div>

      {/* Filters */}
      <div className=" grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-3 items-center">
        <div className="relative lg:col-span-2">
          <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            placeholder="দাতার নাম, ফোন, রসিদ নং..."
            className="w-full pl-9 pr-3 py-2 bg-slate-50 border border-slate-200 rounded-lg text-sm font-medium text-slate-800 outline-none focus:ring-1 focus:ring-[#1C7D5A] focus:border-[#1C7D5A]"
          />
        </div>

        <select
          value={typeFilter}
          onChange={(e) => setTypeFilter(e.target.value)}
          className="px-3 py-2 bg-white border border-slate-200 rounded-lg text-sm font-semibold text-slate-700 outline-none focus:ring-1 focus:ring-[#1C7D5A] focus:border-[#1C7D5A]"
        >
          <option value="all">
            {t('donation_page.fund_type')} ({t('common.all') || 'All'})
          </option>
          {donationTypes.map((type) => (
            <option key={type} value={type}>
              {getFundLabel(type)}
            </option>
          ))}
        </select>

        <select
          value={paymentFilter}
          onChange={(e) => setPaymentFilter(e.target.value)}
          className="px-3 py-2 bg-white border border-slate-200 rounded-lg text-sm font-semibold text-slate-700 outline-none focus:ring-1 focus:ring-[#1C7D5A] focus:border-[#1C7D5A]"
        >
          <option value="all">
            {t('donation_page.payment_mode')} ({t('common.all') || 'All'})
          </option>
          {PAYMENT_MODES.map((mode) => (
            <option key={mode} value={mode}>
              {mode}
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
              title={t('common.reset')}
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

      {/* Donations Table */}
      <div className="bg-white rounded-lg border border-slate-200 shadow-sm overflow-hidden">
        {loading ? (
          <div className="py-20 flex flex-col items-center justify-center">
            <Loader2 className="w-8 h-8 animate-spin text-[#1C7D5A] mb-3" />
            <p className="text-sm font-bold text-slate-500">তথ্য লোড হচ্ছে...</p>
          </div>
        ) : filteredDonations.length === 0 ? (
          <div className="py-20 px-4 text-center space-y-3">
            <div className="w-16 h-16 bg-emerald-50 text-[#1C7D5A] rounded-full flex items-center justify-center mx-auto">
              <HeartHandshake className="w-8 h-8" />
            </div>
            <p className="text-base font-bold text-slate-700">
              {t('common.no_records') || 'কোনো অনুদানের রেকর্ড পাওয়া যায়নি'}
            </p>
            <p className="text-xs text-slate-400">
              উপরের "{t('donation_page.add_donation')}" বাটনে ক্লিক করে নতুন অনুদান যোগ করুন
            </p>
            <div className="pt-2">
              <button
                type="button"
                onClick={handleOpenAddModal}
                className="px-5 py-2.5 bg-[#1C7D5A] hover:bg-[#123628] text-white rounded-lg text-sm font-bold inline-flex items-center gap-2 cursor-pointer transition-all"
              >
                <Plus className="w-4 h-4" />
                {t('donation_page.add_donation')}
              </button>
            </div>
          </div>
        ) : (
          <>
            <div className="overflow-x-auto">
              <table className="w-full text-left border-collapse min-w-225">
                <thead className="bg-[#1C7D5A18] text-slate-800 text-[11px] uppercase font-black tracking-wider whitespace-nowrap">
                  <tr>
                    <th className="px-5 py-3.5"># / {t('donation_page.receipt_btn')}</th>
                    <th className="px-5 py-3.5">{t('donation_page.donor_details')}</th>
                    <th className="px-5 py-3.5 text-center">{t('donation_page.fund_type')}</th>
                    <th className="px-5 py-3.5 text-right">{t('donation_page.amount_bdt')}</th>
                    <th className="px-5 py-3.5 text-center">{t('donation_page.payment_mode')}</th>
                    <th className="px-5 py-3.5 text-center">{t('donation_page.date')}</th>
                    <th className="px-5 py-3.5 text-right">{t('donation_page.receipt_btn')}</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100 text-sm">
                  {paginatedDonations.map((donation, idx) => {
                    const serialNo = (currentPage - 1) * itemsPerPage + idx + 1;
                    return (
                      <tr key={donation.id} className="hover:bg-slate-50/70 transition-colors">
                        <td className="px-5 py-3.5 whitespace-nowrap">
                          <div className="text-xs font-black text-slate-400">#{serialNo}</div>
                          <div className="text-xs font-mono font-bold text-slate-700">
                            {donation.receiptNo}
                          </div>
                        </td>

                        <td className="px-5 py-3.5">
                          <div className="flex items-center gap-3">
                            <div className="w-9 h-9 rounded-full bg-emerald-50 text-[#1C7D5A] border border-emerald-100 flex items-center justify-center font-black text-sm shrink-0">
                              {(donation.donorName || 'G').charAt(0).toUpperCase()}
                            </div>
                            <div className="min-w-0">
                              <p className="font-bold text-slate-800 truncate">
                                {donation.donorName}
                              </p>
                              <div className="flex flex-wrap items-center gap-x-3 gap-y-0.5 text-xs text-slate-500">
                                {donation.phone && (
                                  <span className="inline-flex items-center gap-1">
                                    <Phone className="w-3 h-3 text-slate-400" />
                                    {donation.phone}
                                  </span>
                                )}
                                {donation.address && (
                                  <span className="inline-flex items-center gap-1 truncate max-w-50">
                                    <MapPin className="w-3 h-3 text-slate-400" />
                                    {donation.address}
                                  </span>
                                )}
                              </div>
                              {donation.remarks && (
                                <p className="text-[11px] text-slate-400 truncate max-w-65 mt-0.5">
                                  {donation.remarks}
                                </p>
                              )}
                            </div>
                          </div>
                        </td>

                        <td className="px-5 py-3.5 text-center whitespace-nowrap">
                          <span
                            className={`inline-flex items-center px-2.5 py-1 rounded-full text-xs font-bold border ${getTypeBadgeClass(
                              donation.type
                            )}`}
                          >
                            {getFundLabel(donation.type)}
                          </span>
                        </td>

                        <td className="px-5 py-3.5 text-right whitespace-nowrap">
                          <span className="text-base font-black text-[#1C7D5A]">
                            ৳ {Number(donation.amount || 0).toLocaleString()}
                          </span>
                        </td>

                        <td className="px-5 py-3.5 text-center whitespace-nowrap">
                          <span className="inline-flex items-center gap-1.5 px-2.5 py-1 bg-slate-100 text-slate-700 rounded-md text-xs font-bold">
                            <CreditCard className="w-3.5 h-3.5 text-slate-500" />
                            {donation.paymentMode}
                          </span>
                        </td>

                        <td className="px-5 py-3.5 text-center whitespace-nowrap">
                          <span className="inline-flex items-center gap-1.5 text-xs font-semibold text-slate-600">
                            <Calendar className="w-3.5 h-3.5 text-slate-400" />
                            {donation.date}
                          </span>
                        </td>

                        <td className="px-5 py-3.5 text-right whitespace-nowrap">
                          <button
                            type="button"
                            onClick={() => setSelectedVoucher(buildVoucherPayload(donation))}
                            title={t('donation_page.print')}
                            className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-slate-100 hover:bg-[#1C7D5A] text-slate-700 hover:text-white rounded-lg text-xs font-bold transition-colors cursor-pointer"
                          >
                            <Printer className="w-3.5 h-3.5" />
                            {t('donation_page.receipt_btn')}
                          </button>
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
                  মোট {filteredDonations.length} টি রেকর্ডের মধ্যে {(currentPage - 1) * itemsPerPage + 1} -{' '}
                  {Math.min(currentPage * itemsPerPage, filteredDonations.length)} দেখানো হচ্ছে
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
                      className={`w-8 h-8 rounded-lg text-xs font-bold border transition-all cursor-pointer ${currentPage === page
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

      {/* Add Donation Modal */}
      {isDonationModalOpen && (
        <div className="fixed inset-0 z-[120] bg-slate-900/60 backdrop-blur-sm flex items-center justify-center p-4 animate-in fade-in duration-200">
          <div className="bg-white rounded-[16px] w-full max-w-2xl shadow-2xl overflow-hidden flex flex-col max-h-[92vh] animate-in zoom-in duration-200">
            <div className="p-5 border-b border-slate-100 flex justify-between items-center bg-slate-50 shrink-0">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 bg-emerald-50 text-[#1C7D5A] rounded-xl flex items-center justify-center border border-emerald-100">
                  <HeartHandshake className="w-5 h-5" />
                </div>
                <div>
                  <h2 className="font-black text-slate-800 text-base">
                    {t('donation_page.add_donation')}
                  </h2>
                  <p className="text-xs font-bold text-slate-400">
                    {t('donation_page.donor_details')} & {t('donation_page.donation_details')}
                  </p>
                </div>
              </div>
              <button
                type="button"
                onClick={handleCloseAddModal}
                className="p-1.5 text-slate-400 hover:text-slate-700 hover:bg-slate-200/60 rounded-full transition-colors cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleSave} className="p-6 space-y-5 overflow-y-auto">
              <div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-1.5">
                    <label className="text-xs font-bold text-slate-700 block">
                      {t('donation_page.donor_name')} <span className="text-rose-500">*</span>
                    </label>
                    <div className="relative">
                      <User className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                      <input
                        type="text"
                        required
                        autoFocus
                        className="w-full pl-9 pr-3 py-2 border border-slate-200 rounded-[8px] text-sm font-semibold text-slate-800 outline-none focus:ring-1 focus:ring-[#1C7D5A] focus:border-[#1C7D5A]"
                        placeholder="e.g. Abdullah Al Mamun"
                        value={formData.donorName}
                        onChange={(e) => setFormData({ ...formData, donorName: e.target.value })}
                      />
                    </div>
                  </div>

                  <div className="space-y-1.5">
                    <label className="text-xs font-bold text-slate-700 block">
                      {t('donation_page.phone')}
                    </label>
                    <div className="relative">
                      <Phone className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                      <input
                        type="text"
                        className="w-full pl-9 pr-3 py-2 border border-slate-200 rounded-[8px] text-sm font-semibold text-slate-800 outline-none focus:ring-1 focus:ring-[#1C7D5A] focus:border-[#1C7D5A]"
                        placeholder="017..."
                        value={formData.phone}
                        onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                      />
                    </div>
                  </div>

                  <div className="md:col-span-2 space-y-1.5">
                    <label className="text-xs font-bold text-slate-700 block">
                      {t('donation_page.address_opt')}
                    </label>
                    <div className="relative">
                      <MapPin className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                      <input
                        type="text"
                        className="w-full pl-9 pr-3 py-2 border border-slate-200 rounded-[8px] text-sm font-medium text-slate-800 outline-none focus:ring-1 focus:ring-[#1C7D5A] focus:border-[#1C7D5A]"
                        placeholder="Village, Area..."
                        value={formData.address}
                        onChange={(e) => setFormData({ ...formData, address: e.target.value })}
                      />
                    </div>
                  </div>
                </div>
              </div>

              <div>
                <h3 className="text-xs font-black uppercase tracking-wider text-slate-500 border-b border-slate-100 pb-2 mb-3">
                  {t('donation_page.donation_details')}
                </h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-1.5">
                    <label className="text-xs font-bold text-slate-700 block">
                      {t('donation_page.amount_bdt')} <span className="text-rose-500">*</span>
                    </label>
                    <div className="relative">
                      <span className="absolute left-3.5 top-1/2 -translate-y-1/2 text-base font-black text-slate-400">
                        ৳
                      </span>
                      <input
                        type="number"
                        required
                        min="1"
                        className="w-full pl-9 pr-3 py-2 text-base font-black text-[#1C7D5A] border border-slate-200 rounded-[8px] outline-none focus:ring-1 focus:ring-[#1C7D5A] focus:border-[#1C7D5A]"
                        placeholder="0.00"
                        value={formData.amount}
                        onChange={(e) => setFormData({ ...formData, amount: e.target.value })}
                      />
                    </div>
                  </div>

                  <div className="space-y-1.5">
                    <div className="flex items-center justify-between">
                      <label className="text-xs font-bold text-slate-700">
                        {t('donation_page.fund_type')}
                      </label>
                      <button
                        type="button"
                        onClick={() => setIsFundModalOpen(true)}
                        className="text-[11px] font-bold text-[#1C7D5A] hover:underline flex items-center gap-0.5 cursor-pointer"
                      >
                        <Plus className="w-3 h-3" /> {t('donation_page.add_type')}
                      </button>
                    </div>
                    <select
                      className="w-full px-3 py-2 bg-white border border-slate-200 rounded-[8px] text-sm font-bold text-slate-700 outline-none focus:ring-1 focus:ring-[#1C7D5A] focus:border-[#1C7D5A]"
                      value={formData.type}
                      onChange={(e) => setFormData({ ...formData, type: e.target.value })}
                    >
                      {donationTypes.map((typeItem) => (
                        <option key={typeItem} value={typeItem}>
                          {getFundLabel(typeItem)}
                        </option>
                      ))}
                    </select>
                  </div>

                  <div className="space-y-1.5">
                    <label className="text-xs font-bold text-slate-700 block">
                      {t('donation_page.payment_mode')}
                    </label>
                    <select
                      className="w-full px-3 py-2 bg-white border border-slate-200 rounded-[8px] text-sm font-bold text-slate-700 outline-none focus:ring-1 focus:ring-[#1C7D5A] focus:border-[#1C7D5A]"
                      value={formData.paymentMode}
                      onChange={(e) => setFormData({ ...formData, paymentMode: e.target.value })}
                    >
                      {PAYMENT_MODES.map((mode) => (
                        <option key={mode} value={mode}>
                          {mode}
                        </option>
                      ))}
                    </select>
                  </div>

                  <div className="space-y-1.5">
                    <label className="text-xs font-bold text-slate-700 block">
                      {t('donation_page.date')}
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
                      {t('expense_page.remarks_opt') || 'মন্তব্য (ঐচ্ছিক)'}
                    </label>
                    <div className="relative">
                      <FileText className="absolute left-3 top-2.5 w-4 h-4 text-slate-400" />
                      <input
                        type="text"
                        className="w-full pl-9 pr-3 py-2 border border-slate-200 rounded-[8px] text-sm font-medium text-slate-800 outline-none focus:ring-1 focus:ring-[#1C7D5A] focus:border-[#1C7D5A]"
                        placeholder="অতিরিক্ত কোনো নোট বা উদ্দেশ্য..."
                        value={formData.remarks}
                        onChange={(e) => setFormData({ ...formData, remarks: e.target.value })}
                      />
                    </div>
                  </div>
                </div>
              </div>

              <div className="pt-4 flex flex-wrap items-center justify-end gap-3 border-t border-slate-100">
                <button
                  type="button"
                  onClick={handleCloseAddModal}
                  className="px-5 py-2 text-xs font-bold text-slate-600 bg-slate-100 hover:bg-slate-200 rounded-[8px] transition-colors cursor-pointer"
                >
                  {t('common.cancel')}
                </button>
                <button
                  type="button"
                  disabled={saving}
                  onClick={() => saveDonation(true)}
                  className="px-5 py-2 bg-slate-800 hover:bg-slate-900 text-white text-xs font-bold rounded-[8px] flex items-center gap-2 transition-all cursor-pointer disabled:opacity-50"
                >
                  <Printer className="w-4 h-4" />
                  {t('donation_page.save_record')} & {t('donation_page.receipt_btn')}
                </button>
                <button
                  type="submit"
                  disabled={saving}
                  className="px-6 py-2 bg-[#1C7D5A] hover:bg-[#123628] text-white text-xs font-black rounded-[8px] flex items-center gap-2 shadow-sm transition-all cursor-pointer disabled:opacity-50"
                >
                  {saving ? <Loader2 className="w-4 h-4 animate-spin" /> : <Save className="w-4 h-4" />}
                  {t('donation_page.save_record')}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Add Fund Type Modal */}
      {isFundModalOpen && (
        <div className="fixed inset-0 z-[150] flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm animate-in fade-in duration-200">
          <div className="bg-white w-full max-w-md rounded-[16px] shadow-2xl overflow-hidden animate-in zoom-in duration-200">
            <div className="p-5 bg-slate-50 border-b border-slate-100 flex justify-between items-center">
              <h2 className="text-base font-black text-slate-800 flex items-center gap-2">
                <Plus className="w-5 h-5 text-[#1C7D5A]" />
                {t('donation_page.add_fund')}
              </h2>
              <button
                type="button"
                onClick={() => setIsFundModalOpen(false)}
                className="p-1 text-slate-400 hover:text-slate-600 rounded-full cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>
            <form onSubmit={handleAddFundType} className="p-6 space-y-5">
              <div className="space-y-1.5">
                <label className="text-xs font-bold text-slate-700 block">
                  {t('donation_page.fund_name')}
                </label>
                <input
                  type="text"
                  autoFocus
                  className="w-full px-4 py-2.5 border border-slate-200 rounded-[8px] focus:outline-none focus:ring-1 focus:ring-[#1C7D5A] focus:border-[#1C7D5A] font-bold text-sm text-slate-700"
                  placeholder="e.g. Crisis Relief Fund"
                  value={newFundName}
                  onChange={(e) => setNewFundName(e.target.value)}
                />
              </div>
              <div className="flex justify-end gap-3 pt-2">
                <button
                  type="button"
                  onClick={() => setIsFundModalOpen(false)}
                  className="px-5 py-2 bg-slate-100 text-slate-600 text-xs font-bold rounded-[8px] hover:bg-slate-200 transition-all cursor-pointer"
                >
                  {t('common.cancel')}
                </button>
                <button
                  type="submit"
                  className="px-6 py-2 bg-[#1C7D5A] hover:bg-[#123628] text-white text-xs font-black rounded-[8px] shadow-sm transition-all cursor-pointer"
                >
                  {t('donation_page.add_fund')}
                </button>
              </div>
            </form>
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

export default DonationEntry;
