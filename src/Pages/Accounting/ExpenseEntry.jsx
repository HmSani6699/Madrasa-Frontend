import React from 'react';
import { TrendingDown, Briefcase } from 'lucide-react';
import AccountingLedgerPage from '../../components/AccountingLedgerPage';

const EXPENSE_CONFIG = {
  mode: 'expense',
  isExpense: true,
  storageKey: 'madrasa_expenses_local',
  categoriesStorageKey: 'madrasa_expense_categories_local',
  voucherPrefix: 'EXP',
  csvFilePrefix: 'expenses',
  translationNamespace: 'expense_page',
  icon: TrendingDown,
  itemIcon: Briefcase,
  initialCategories: [
    'general',
    'utility',
    'maintenance',
    'office',
    'transport',
    'food_ration',
    'miscellaneous'
  ],
  categoryBadgeMap: {
    utility: 'bg-amber-50 text-amber-700 border-amber-200',
    maintenance: 'bg-sky-50 text-sky-700 border-sky-200',
    office: 'bg-indigo-50 text-indigo-700 border-indigo-200',
    transport: 'bg-purple-50 text-purple-700 border-purple-200',
    food_ration: 'bg-orange-50 text-orange-700 border-orange-200',
    miscellaneous: 'bg-slate-100 text-slate-700 border-slate-200',
    general: 'bg-rose-50 text-rose-700 border-rose-200'
  },
  labels: {
    subtitleSuffix: 'ব্যয়ের তালিকা ও ভাউচার',
    addButtonFallback: 'খরচ যোগ করুন',
    editModalTitleFallback: 'খরচ সম্পাদনা করুন',
    kpiTotalLabel: 'মোট ব্যয়',
    kpiCountLabel: 'মোট ভাউচার',
    searchPlaceholder: 'বিবরণ, ভাউচার নং, খাত বা মন্তব্য...',
    emptyStateTitle: 'কোনো খরচের রেকর্ড পাওয়া যায়নি',
    emptyStateHint: 'উপরের "খরচ যোগ করুন" বাটনে ক্লিক করে নতুন খরচ যোগ করুন',
    voucherColHeader: 'ভাউচার নং',
    titleColHeader: 'বিবরণ / আইটেমের নাম',
    categoryColHeader: 'ব্যয়ের বিভাগ',
    printActionLabel: 'ভাউচার',
    titlePlaceholder: 'যেমন: জানুয়ারি ২০২৬ বিদ্যুৎ বিল',
    categoryPlaceholder: 'যেমন: প্রচারণা খরচ',
    emptyCategoryError: 'অনুগ্রহ করে বিভাগের নাম লিখুন',
    categoryAddedToast: 'নতুন ব্যয়ের বিভাগ যোগ হয়েছে',
    validationError: 'অনুগ্রহ করে খরচের বিবরণ ও সঠিক পরিমাণ লিখুন',
    savedToast: 'খরচ সফলভাবে সংরক্ষণ করা হয়েছে!',
    updatedToast: 'খরচের তথ্য আপডেট করা হয়েছে!',
    deletedToast: 'খরচের রেকর্ড মুছে ফেলা হয়েছে',
    emptyExportToast: 'ডাউনলোড করার মতো কোনো খরচের তথ্য নেই',
    deleteModalTitle: 'খরচের রেকর্ড মুছবেন?',
    deleteModalDesc: 'আপনি কি নিশ্চিত যে এই খরচের রেকর্ডটি স্থায়ীভাবে মুছে ফেলতে চান?',
    voucherBadge: 'Payment\nVoucher',
    voucherModalTitle: 'অফিসিয়াল পেমেন্ট ভাউচার',
    voucherPartyTitle: 'ব্যয়ের বিবরণ',
    voucherSummaryTitle: 'পেমেন্ট সারসংক্ষেপ',
    voucherDateLabel: 'ভাউচার তারিখ',
    voucherNoPrefix: 'ভাউচার নং:'
  }
};

const ExpenseEntry = () => <AccountingLedgerPage config={EXPENSE_CONFIG} />;

export default ExpenseEntry;
