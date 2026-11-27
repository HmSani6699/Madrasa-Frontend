import React from 'react';
import { TrendingUp, FileText } from 'lucide-react';
import AccountingLedgerPage from '../../components/AccountingLedgerPage';

const INCOME_CONFIG = {
  mode: 'income',
  isExpense: false,
  storageKey: 'madrasa_incomes_local',
  categoriesStorageKey: 'madrasa_income_categories_local',
  voucherPrefix: 'INC',
  csvFilePrefix: 'incomes',
  translationNamespace: 'income_page',
  icon: TrendingUp,
  itemIcon: FileText,
  initialCategories: [
    'general',
    'asset_sale',
    'service_fee',
    'grant',
    'rent',
    'miscellaneous'
  ],
  categoryBadgeMap: {
    asset_sale: 'bg-amber-50 text-amber-700 border-amber-200',
    service_fee: 'bg-sky-50 text-sky-700 border-sky-200',
    grant: 'bg-indigo-50 text-indigo-700 border-indigo-200',
    rent: 'bg-purple-50 text-purple-700 border-purple-200',
    miscellaneous: 'bg-slate-100 text-slate-700 border-slate-200',
    general: 'bg-emerald-50 text-[#1C7D5A] border-emerald-200'
  },
  labels: {
    subtitleSuffix: 'আয়ের তালিকা ও রসিদ',
    addButtonFallback: 'আয় যোগ করুন',
    editModalTitleFallback: 'আয় সম্পাদনা করুন',
    kpiTotalLabel: 'মোট আয়',
    kpiCountLabel: 'মোট রসিদ',
    searchPlaceholder: 'উৎসের নাম, ভাউচার নং, খাত বা মন্তব্য...',
    emptyStateTitle: 'কোনো আয়ের রেকর্ড পাওয়া যায়নি',
    emptyStateHint: 'উপরের "আয় যোগ করুন" বাটনে ক্লিক করে নতুন আয় যোগ করুন',
    voucherColHeader: 'রসিদ নং',
    titleColHeader: 'উৎসের নাম / বিবরণ',
    categoryColHeader: 'আয়ের বিভাগ',
    printActionLabel: 'রসিদ',
    titlePlaceholder: 'যেমন: পুরাতন আসবাবপত্র বিক্রয়',
    categoryPlaceholder: 'যেমন: সম্পদ বিক্রয়',
    emptyCategoryError: 'অনুগ্রহ করে বিভাগের নাম লিখুন',
    categoryAddedToast: 'নতুন আয়ের বিভাগ যোগ হয়েছে',
    validationError: 'অনুগ্রহ করে আয়ের উৎসের নাম ও সঠিক পরিমাণ লিখুন',
    savedToast: 'আয় সফলভাবে সংরক্ষণ করা হয়েছে!',
    updatedToast: 'আয়ের তথ্য আপডেট করা হয়েছে!',
    deletedToast: 'আয়ের রেকর্ড মুছে ফেলা হয়েছে',
    emptyExportToast: 'ডাউনলোড করার মতো কোনো আয়ের তথ্য নেই',
    deleteModalTitle: 'আয়ের রেকর্ড মুছবেন?',
    deleteModalDesc: 'আপনি কি নিশ্চিত যে এই আয়ের রেকর্ডটি স্থায়ীভাবে মুছে ফেলতে চান?',
    voucherBadge: 'Income\nReceipt',
    voucherModalTitle: 'অফিসিয়াল আয় রসিদ',
    voucherPartyTitle: 'আয়ের উৎস',
    voucherSummaryTitle: 'প্রাপ্তি সারসংক্ষেপ',
    voucherDateLabel: 'রসিদ তারিখ',
    voucherNoPrefix: 'রসিদ নং:'
  }
};

const IncomeEntry = () => <AccountingLedgerPage config={INCOME_CONFIG} />;

export default IncomeEntry;
