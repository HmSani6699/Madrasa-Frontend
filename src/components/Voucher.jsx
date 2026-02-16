import React from 'react';
import { Printer, X, CheckCircle2, User, MapPin, Receipt, Calendar, Banknote } from 'lucide-react';
import { useTranslation } from 'react-i18next';

const Voucher = ({ data, onClose, madrasaName = "জিন্নুরাইন তাহফিজুল কুরআন মহিলা মাদ্রাসা", address = "৫ নং শহীদ তিতুমীর রোড, ওমর টাউন, আশানিয়া, বিপি" }) => {
  const { t } = useTranslation();

  const printVoucher = () => {
    window.print();
  };

  // Helper to convert number to words (Simplified for BDT)
  const numberToWords = (num) => {
    if (!num) return "";
    // This is a very basic placeholder. In a real app, you'd use a library or a robust function.
    return `${num} Taka Only`; 
  };

  return (
    <div className="fixed inset-0 z-[200] flex items-center justify-center p-4 bg-slate-900/80 backdrop-blur-md animate-in fade-in duration-300">
      <div className="bg-white w-full max-w-4xl rounded-2xl shadow-2xl overflow-hidden flex flex-col max-h-[90vh]">
        
        {/* Header / Actions */}
        <div className="p-4 bg-slate-50 border-b flex justify-between items-center no-print">
          <h2 className="text-lg font-bold text-slate-800 flex items-center gap-2">
            <Receipt className="w-5 h-5 text-primary" />
            {t('donation_page.receipt') || 'Voucher Preview'}
          </h2>
          <div className="flex gap-3">
            <button 
              onClick={printVoucher}
              className="px-6 py-2 bg-primary text-white font-bold rounded-xl shadow-lg shadow-primary/20 hover:scale-105 transition-all flex items-center gap-2 cursor-pointer"
            >
              <Printer className="w-4 h-4" />
              {t('common.print') || 'Print Voucher'}
            </button>
            <button 
              onClick={onClose}
              className="p-2 text-slate-400 hover:text-slate-600 transition-colors cursor-pointer"
            >
              <X className="w-6 h-6" />
            </button>
          </div>
        </div>

        {/* Scrollable Preview Area */}
        <div className="flex-1 overflow-y-auto p-8 bg-slate-100/50 flex justify-center">
          
          {/* THE VOUCHER CARD */}
          <div 
            id="printable-voucher"
            className="bg-white w-full max-w-[800px] aspect-[1.6/1] border-[1px] border-slate-200 shadow-xl relative overflow-hidden p-8 flex flex-col font-sans voucher-card"
            style={{
                backgroundImage: 'radial-gradient(circle at 2px 2px, rgba(0, 189, 127, 0.05) 1px, transparent 0)',
                backgroundSize: '24px 24px'
            }}
          >
            {/* Elegant Border Decoration */}
            <div className="absolute top-0 left-0 w-24 h-24 border-t-4 border-l-4 border-primary/20 rounded-tl-3xl -ml-2 -mt-2"></div>
            <div className="absolute bottom-0 right-0 w-24 h-24 border-b-4 border-r-4 border-primary/20 rounded-br-3xl -mr-2 -mb-2"></div>

            {/* Header Section */}
            <div className="flex justify-between items-start border-b-2 border-primary/10 pb-4 relative z-10">
              <div className="flex gap-4 items-center">
                <div className="w-16 h-16 bg-primary rounded-2xl flex items-center justify-center text-white shadow-lg shadow-primary/30">
                  <Receipt className="w-10 h-10" />
                </div>
                <div>
                  <h1 className="text-2xl font-black text-slate-900 leading-tight">{madrasaName}</h1>
                  <p className="text-xs font-bold text-slate-500 uppercase tracking-widest mt-1 opacity-80">Jinnurain Tahfijul Quran Mahila Madrasa</p>
                  <div className="flex items-center gap-2 mt-2 text-slate-400">
                    <MapPin className="w-3 h-3" />
                    <span className="text-[10px] font-semibold">{address}</span>
                  </div>
                </div>
              </div>
              <div className="text-right">
                <div className="bg-primary/5 px-4 py-2 rounded-xl border border-primary/10 mb-2">
                    <p className="text-[10px] font-bold text-primary uppercase tracking-tighter">Receipt No</p>
                    <p className="text-lg font-black text-slate-800 font-mono">#{data?.receiptNo || '2025-0001'}</p>
                </div>
                <div className="flex items-center justify-end gap-2 text-slate-500">
                    <Calendar className="w-3 h-3" />
                    <span className="text-xs font-bold">{data?.date || new Date().toLocaleDateString()}</span>
                </div>
              </div>
            </div>

            {/* Voucher Title */}
            <div className="text-center my-6 relative z-10">
                <span className="bg-slate-900 text-white px-8 py-2 rounded-full text-sm font-black uppercase tracking-[0.2em]">
                    {t('donation_page.receipt') || 'টাকা প্রাপ্তি রশিদ'}
                </span>
            </div>

            {/* Body Section */}
            <div className="flex-1 space-y-4 pt-2 relative z-10">
              <div className="flex items-end gap-2 text-slate-700">
                <span className="text-sm font-bold whitespace-nowrap">{t('donation_page.received_from') || 'দাতার নাম / দাতার ঠিকানা'}:</span>
                <span className="flex-1 border-b border-dashed border-slate-300 font-bold text-lg px-2 pb-0.5 text-slate-900">
                    {data?.donorName || data?.studentName}
                </span>
              </div>

              <div className="flex items-end gap-2 text-slate-700">
                <span className="text-sm font-bold whitespace-nowrap">{t('donation_page.purpose') || 'বাবদ / উদ্দেশ্য'}:</span>
                <span className="flex-1 border-b border-dashed border-slate-300 font-semibold px-2 pb-0.5 italic">
                    {data?.purpose || 'General Donation / Admission Fee'}
                </span>
              </div>

              <div className="grid grid-cols-2 gap-8 items-end mt-4">
                 <div className="flex items-end gap-3 bg-primary/5 p-4 rounded-2xl border border-primary/10">
                    <Banknote className="w-8 h-8 text-primary opacity-50" />
                    <div className="flex flex-col">
                        <span className="text-[10px] font-bold text-primary uppercase">{t('donation_page.amount_received') || 'প্রাপ্ত পরিমাণ'}</span>
                        <div className="flex items-center gap-1">
                            <span className="text-2xl font-black text-slate-900 leading-none">৳ {data?.amount || '0.00'}</span>
                        </div>
                    </div>
                 </div>
                 <div className="flex flex-col gap-1">
                    <span className="text-[10px] font-bold text-slate-400 uppercase">{t('donation_page.in_words') || 'কথায়'}</span>
                    <span className="text-sm font-bold text-slate-700 border-b border-dashed border-slate-300 pb-1 italic">
                        {data?.amountInWords || numberToWords(data?.amount)}
                    </span>
                 </div>
              </div>
            </div>

            {/* Footer / Signatures */}
            <div className="mt-auto grid grid-cols-2 gap-12 pt-8 relative z-10">
              <div className="flex flex-col items-center">
                <div className="w-32 border-b-2 border-slate-200"></div>
                <span className="text-[10px] font-bold text-slate-400 uppercase mt-2">{t('donation_page.receiver') || 'আদায়কারী / Receiver'}</span>
              </div>
              <div className="flex flex-col items-center">
                <div className="w-32 border-b-2 border-slate-900"></div>
                <span className="text-[10px] font-bold text-slate-900 uppercase mt-2">{t('donation_page.principal') || 'মুহতামিম / Principal'}</span>
              </div>
            </div>

            {/* Background Decoration (Islamic Pattern) */}
            <div className="absolute right-[-40px] bottom-[-40px] opacity-[0.03] rotate-12 pointer-events-none">
                <svg width="300" height="300" viewBox="0 0 100 100" fill="currentColor" className="text-primary">
                    <path d="M50 0L61.2 38.8H100L68.8 61.2L80 100L50 77.5L20 100L31.2 61.2L0 38.8H38.8L50 0Z" />
                </svg>
            </div>
            
          </div>
        </div>

        {/* Print Styles */}
        <style>
          {`
            @media print {
              body * {
                visibility: hidden;
              }
              #printable-voucher, #printable-voucher * {
                visibility: visible;
              }
              #printable-voucher {
                position: absolute;
                left: 0;
                top: 0;
                width: 100% !important;
                max-width: none !important;
                box-shadow: none !important;
                border: none !important;
              }
              .no-print {
                display: none !important;
              }
            }
          `}
        </style>

      </div>
    </div>
  );
};

export default Voucher;
