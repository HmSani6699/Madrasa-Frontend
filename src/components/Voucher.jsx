import React from 'react';
import { Printer, X, Receipt, Calendar, Banknote, Building2 } from 'lucide-react';
import { useTranslation } from 'react-i18next';

const numberToWordsBDT = (num) => {
  const n = Math.floor(Math.abs(Number(num) || 0));
  if (n === 0) return 'Zero Taka Only';

  const ones = ['', 'One', 'Two', 'Three', 'Four', 'Five', 'Six', 'Seven', 'Eight', 'Nine',
    'Ten', 'Eleven', 'Twelve', 'Thirteen', 'Fourteen', 'Fifteen', 'Sixteen', 'Seventeen', 'Eighteen', 'Nineteen'];
  const tens = ['', '', 'Twenty', 'Thirty', 'Forty', 'Fifty', 'Sixty', 'Seventy', 'Eighty', 'Ninety'];

  const convertLessThanOneThousand = (number) => {
    let current = '';
    if (number % 100 < 20) {
      current = ones[number % 100];
      number = Math.floor(number / 100);
    } else {
      current = ones[number % 10];
      number = Math.floor(number / 10);
      current = tens[number % 10] + (current ? ' ' + current : '');
      number = Math.floor(number / 10);
    }
    if (number === 0) return current;
    return ones[number] + ' Hundred' + (current ? ' ' + current : '');
  };

  let word = '';
  const crore = Math.floor(n / 10000000);
  const lakh = Math.floor((n % 10000000) / 100000);
  const thousand = Math.floor((n % 100000) / 1000);
  const remainder = n % 1000;

  if (crore > 0) word += convertLessThanOneThousand(crore) + ' Crore ';
  if (lakh > 0) word += convertLessThanOneThousand(lakh) + ' Lakh ';
  if (thousand > 0) word += convertLessThanOneThousand(thousand) + ' Thousand ';
  if (remainder > 0) word += convertLessThanOneThousand(remainder);

  return word.trim() + ' Taka Only';
};

const Voucher = ({ 
  data, 
  onClose, 
  madrasaName = "Pakunda Islamia Madrsa", 
  address = "Pakunda, Sonargoan, Narayongonj" 
}) => {
  const { t } = useTranslation();

  const printVoucher = () => {
    window.print();
  };

  const hasItems = data?.feeDetails && data.feeDetails.length > 0;
  const isBangla = t('fee_report.multiple_view') === "মাল্টিপল ভিউ";

  return (
    <div className="fixed inset-0 z-[200] flex items-center justify-center p-4 bg-slate-900/80 backdrop-blur-md animate-in fade-in duration-300">
      <div className="bg-white w-full max-w-4xl rounded-2xl shadow-2xl overflow-hidden flex flex-col max-h-[92vh]">
        
        {/* Header / Actions */}
        <div className="p-4 bg-slate-50 border-b flex justify-between items-center no-print">
          <h2 className="text-lg font-bold text-slate-800 flex items-center gap-2">
            <Receipt className="w-5 h-5 text-[#00315e]" />
            {isBangla ? 'টাকা প্রাপ্তির মানি রিসিট' : 'Money Receipt / Voucher'}
          </h2>
          <div className="flex gap-3">
            <button 
              onClick={printVoucher}
              className="px-6 py-2 bg-[#00315e] text-white font-bold rounded-xl shadow-lg shadow-[#00315e]/20 hover:bg-[#002140] transition-all flex items-center gap-2 cursor-pointer"
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
        <div className="flex-1 overflow-y-auto p-4 sm:p-8 bg-slate-100/60 flex justify-center">
          
          {/* THE VOUCHER CARD */}
          <div 
            id="printable-voucher"
            className="bg-white w-full max-w-[820px] border border-slate-300 shadow-xl relative overflow-hidden p-6 sm:p-8 flex flex-col font-sans voucher-card rounded-lg"
          >
            {/* Corner Borders */}
            <div className="absolute top-0 left-0 w-16 h-16 border-t-4 border-l-4 border-[#00315e]/30 rounded-tl-xl"></div>
            <div className="absolute bottom-0 right-0 w-16 h-16 border-b-4 border-r-4 border-[#00315e]/30 rounded-br-xl"></div>

            {/* Header Section */}
            <div className="flex justify-between items-start border-b-2 border-slate-200 pb-4 relative z-10">
              <div className="flex gap-3.5 items-center">
                <div className="w-14 h-14 bg-[#00315e] rounded-xl flex items-center justify-center text-white shadow-md">
                  <Building2 className="w-8 h-8" />
                </div>
                <div>
                  <h1 className="text-xl sm:text-2xl font-black text-slate-900 leading-tight">
                    {data?.madrasaName || madrasaName}
                  </h1>
                  <p className="text-xs font-semibold text-slate-500 mt-0.5">
                    {data?.address || address}
                  </p>
                </div>
              </div>

              <div className="text-right">
                <div className="bg-[#00315e]/5 px-3.5 py-1.5 rounded-lg border border-[#00315e]/15 mb-1.5 inline-block">
                  <p className="text-[10px] font-black text-[#00315e] uppercase tracking-wider">
                    {isBangla ? 'রিসিট নং' : 'Receipt No'}
                  </p>
                  <p className="text-base sm:text-lg font-black text-slate-900 font-mono">
                    #{data?.receiptNo || '2026-0001'}
                  </p>
                </div>
                <div className="flex items-center justify-end gap-1.5 text-slate-500 text-xs font-bold">
                  <Calendar className="w-3.5 h-3.5" />
                  <span>{data?.date || new Date().toLocaleDateString()}</span>
                </div>
              </div>
            </div>

            {/* Voucher Title Badge */}
            <div className="text-center my-4 relative z-10">
              <span className="bg-[#00315e] text-white px-6 py-1.5 rounded-full text-xs font-black uppercase tracking-widest shadow-sm">
                {hasItems ? (isBangla ? 'ফি আদায়ের রিসিট' : 'Fee Collection Receipt') : (isBangla ? 'টাকা প্রাপ্তি রশিদ' : 'Money Receipt')}
              </span>
            </div>

            {/* Student / Payee Info Bar */}
            <div className="bg-slate-50 border border-slate-200 rounded-lg p-3 sm:p-4 mb-4 grid grid-cols-2 sm:grid-cols-4 gap-3 text-xs z-10">
              <div>
                <span className="text-slate-400 font-bold uppercase block text-[10px]">
                  {isBangla ? 'শিক্ষার্থীর নাম' : 'Student Name'}
                </span>
                <span className="font-black text-slate-800 text-sm">
                  {data?.studentName || data?.donorName || 'N/A'}
                </span>
              </div>
              <div>
                <span className="text-slate-400 font-bold uppercase block text-[10px]">
                  {isBangla ? 'আইডি / রোল' : 'Student ID / Roll'}
                </span>
                <span className="font-bold text-slate-800">
                  {data?.studentId || 'N/A'} {data?.rollNumber ? `(Roll: ${data.rollNumber})` : ''}
                </span>
              </div>
              <div>
                <span className="text-slate-400 font-bold uppercase block text-[10px]">
                  {isBangla ? 'শ্রেণী / বিভাগ' : 'Class / Section'}
                </span>
                <span className="font-bold text-slate-800">
                  {data?.className || 'N/A'}
                </span>
              </div>
              <div>
                <span className="text-slate-400 font-bold uppercase block text-[10px]">
                  {isBangla ? 'পেমেন্ট পদ্ধতি' : 'Payment Method'}
                </span>
                <span className="font-black text-[#00315e]">
                  {data?.paymentMethod || 'Cash'} {data?.accountName ? `(${data.accountName})` : ''}
                </span>
              </div>
            </div>

            {/* Itemized Table if Fee Details exist */}
            {hasItems ? (
              <div className="border border-slate-200 rounded-lg overflow-hidden mb-4 z-10">
                <table className="w-full text-left text-xs">
                  <thead className="bg-[#00315e]/10 text-slate-700 font-black border-b border-slate-200">
                    <tr>
                      <th className="py-2 px-3 w-10 text-center">#</th>
                      <th className="py-2 px-3">{isBangla ? 'ফি এর বিবরণ' : 'Fee Description'}</th>
                      <th className="py-2 px-3">{isBangla ? 'মাস / সময়কাল' : 'Month / Period'}</th>
                      <th className="py-2 px-3 text-right">{isBangla ? 'পরিমাণ' : 'Amount'}</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100 font-medium text-slate-700">
                    {data.feeDetails.map((item, idx) => (
                      <tr key={idx} className="hover:bg-slate-50/60">
                        <td className="py-2 px-3 text-center text-slate-400">{idx + 1}</td>
                        <td className="py-2 px-3 font-bold text-slate-800">{item.head}</td>
                        <td className="py-2 px-3 text-slate-500">{item.period || item.month || 'Current'}</td>
                        <td className="py-2 px-3 text-right font-black text-slate-800">৳ {Number(item.amount || 0).toLocaleString()}</td>
                      </tr>
                    ))}
                    {Number(data?.previousDue) > 0 && (
                      <tr className="bg-amber-50/60 text-amber-900 font-bold">
                        <td className="py-2 px-3 text-center text-amber-600">★</td>
                        <td className="py-2 px-3">{isBangla ? 'পূর্বের বকেয়া' : 'Previous Due Balance'}</td>
                        <td className="py-2 px-3 text-amber-700">{isBangla ? 'অনাদায়ী' : 'Outstanding'}</td>
                        <td className="py-2 px-3 text-right font-black">৳ {Number(data.previousDue).toLocaleString()}</td>
                      </tr>
                    )}
                  </tbody>
                </table>
              </div>
            ) : (
              <div className="flex items-end gap-2 text-slate-700 mb-4 z-10">
                <span className="text-xs font-bold whitespace-nowrap">{isBangla ? 'উদ্দেশ্য / বাবদ' : 'Purpose'}:</span>
                <span className="flex-1 border-b border-dashed border-slate-300 font-bold text-sm px-2 pb-0.5 text-slate-800 italic">
                  {data?.purpose || 'Fee Collection'}
                </span>
              </div>
            )}

            {/* Financial Totals Grid */}
            <div className="bg-slate-50 border border-slate-200 rounded-lg p-3.5 mb-4 z-10">
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 text-xs mb-3 pb-3 border-b border-slate-200">
                <div>
                  <span className="text-slate-400 font-bold uppercase text-[10px] block">
                    {isBangla ? 'উপমোট' : 'Subtotal'}
                  </span>
                  <span className="font-bold text-slate-700 text-sm">
                    ৳ {Number(data?.subtotal || data?.amount || 0).toLocaleString()}
                  </span>
                </div>
                <div>
                  <span className="text-slate-400 font-bold uppercase text-[10px] block">
                    {isBangla ? 'মওকুফ / ছাড়' : 'Discount / Waiver'}
                  </span>
                  <span className="font-bold text-rose-600 text-sm">
                    ৳ {Number(data?.discount || 0).toLocaleString()}
                  </span>
                </div>
                <div>
                  <span className="text-slate-400 font-bold uppercase text-[10px] block">
                    {isBangla ? 'নিট প্রদেয়' : 'Net Payable'}
                  </span>
                  <span className="font-bold text-slate-800 text-sm">
                    ৳ {Number(data?.netPayable || data?.amount || 0).toLocaleString()}
                  </span>
                </div>
                <div>
                  <span className="text-slate-400 font-bold uppercase text-[10px] block">
                    {isBangla ? 'অবশিষ্ট বকেয়া' : 'Remaining Due'}
                  </span>
                  <span className={`font-black text-sm ${Number(data?.remainingDue) > 0 ? 'text-amber-600' : 'text-emerald-600'}`}>
                    ৳ {Number(data?.remainingDue || 0).toLocaleString()}
                  </span>
                </div>
              </div>

              {/* Amount Paid Callout */}
              <div className="flex flex-col sm:flex-row justify-between items-center gap-2">
                <div className="flex items-center gap-2">
                  <Banknote className="w-6 h-6 text-[#00315e]" />
                  <div>
                    <span className="text-[10px] font-black text-[#00315e] uppercase tracking-wider block">
                      {isBangla ? 'পরিশোধিত টাকা (Paid Amount)' : 'Amount Received'}
                    </span>
                    <span className="text-2xl font-black text-slate-900 leading-none">
                      ৳ {Number(data?.amount || data?.paidAmount || 0).toLocaleString()}
                    </span>
                  </div>
                </div>
                <div className="text-right sm:text-right w-full sm:w-auto">
                  <span className="text-[10px] font-bold text-slate-400 uppercase block">
                    {isBangla ? 'কথায়' : 'In Words'}
                  </span>
                  <span className="text-xs font-bold text-slate-700 italic">
                    {data?.amountInWords || numberToWordsBDT(data?.amount || data?.paidAmount)}
                  </span>
                </div>
              </div>
            </div>

            {/* Footer / Signatures */}
            <div className="mt-8 grid grid-cols-2 gap-12 pt-6 relative z-10">
              <div className="flex flex-col items-center">
                <div className="w-36 border-b-2 border-slate-300"></div>
                <span className="text-[10px] font-bold text-slate-500 uppercase mt-1.5">
                  {isBangla ? 'আদায়কারী / Cashier' : 'Authorized Cashier'}
                </span>
              </div>
              <div className="flex flex-col items-center">
                <div className="w-36 border-b-2 border-slate-800"></div>
                <span className="text-[10px] font-bold text-slate-800 uppercase mt-1.5">
                  {isBangla ? 'মুহতামিম / Principal' : 'Principal Signature'}
                </span>
              </div>
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
                padding: 20px !important;
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
