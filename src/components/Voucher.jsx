import React from 'react';
import { Printer, X, Receipt, QrCode, Globe, Phone } from 'lucide-react';
import { useTranslation } from 'react-i18next';
import logo from '/mlogo.jpg';

const Voucher = ({ 
  data, 
  onClose, 
  madrasaName = "পাকুন্ডা ইসলামিয়া মাদ্রাসা ও এতিমখানা", 
  address = "পাকুন্ডা, সোনামুড়ী, নারায়ণগঞ্জ" 
}) => {
  const { t } = useTranslation();
  const isBangla = t('fee_report.multiple_view') === "মাল্টিপল ভিউ";
  const hasItems = data?.feeDetails && data.feeDetails.length > 0;
  const isVoided = Boolean(data?.isVoided || data?.status === 'Voided');

  const handlePrint = () => {
    const printContent = document.getElementById('printable-voucher');
    if (!printContent) return;

    const iframe = document.createElement('iframe');
    iframe.style.display = 'none';
    document.body.appendChild(iframe);

    const doc = iframe.contentWindow.document;
    const styles = Array.from(document.querySelectorAll('style, link[rel="stylesheet"]'))
      .map(s => s.outerHTML)
      .join('');

    doc.open();
    doc.write(`
      <!DOCTYPE html>
      <html>
        <head>
          <title>${isBangla ? 'ফি ভাউচার' : 'Fee Voucher'} - ${data?.receiptNo || 'Receipt'}</title>
          ${styles}
          <style>
            @import url('https://fonts.googleapis.com/css2?family=Amiri:wght@700&display=swap');
            @page { 
              size: A4 portrait; 
              margin: 0; 
            }
            html, body {
              margin: 0 !important;
              padding: 0 !important;
              width: 210mm !important;
              height: 297mm !important;
              max-height: 297mm !important;
              overflow: hidden !important;
              -webkit-print-color-adjust: exact !important;
              print-color-adjust: exact !important;
              background: white;
            }
            .font-arabic { font-family: 'Amiri', serif; }
            #print-wrap {
              width: 210mm !important;
              height: 297mm !important;
              max-height: 297mm !important;
              padding: 12mm 15mm 0 15mm !important;
              box-sizing: border-box !important;
              display: flex !important;
              flex-direction: column !important;
              justify-content: space-between !important;
              background-color: #f0f3f6 !important;
              position: relative !important;
              z-index: 0 !important;
              overflow: hidden !important;
              page-break-after: avoid !important;
              page-break-inside: avoid !important;
            }
            #print-wrap .voucher-footer {
              margin-left: -15mm !important;
              margin-right: -15mm !important;
              margin-bottom: 0 !important;
              margin-top: auto !important;
            }
            .clip-voucher-badge {
              clip-path: polygon(0 0, 100% 0, 100% 100%, 50% 85%, 0 100%);
            }
          </style>
        </head>
        <body>
          <div id="print-wrap">
            ${printContent.innerHTML}
          </div>
        </body>
      </html>
    `);
    doc.close();

    setTimeout(() => {
      iframe.contentWindow.focus();
      iframe.contentWindow.print();
      setTimeout(() => {
        document.body.removeChild(iframe);
      }, 1000);
    }, 500);
  };

  const subTotalAmount = Number(data?.subtotal || data?.amount || 0);
  const discountAmount = Number(data?.discount || 0);
  const prevDueAmount = Number(data?.previousDue || 0);
  const totalPayableAmount = Number(data?.netPayable || data?.amount || (subTotalAmount + prevDueAmount - discountAmount));
  const paidAmountVal = Number(data?.paidAmount || data?.amount || 0);
  const dueAmountVal = Number(data?.remainingDue || 0);

  return (
    <div className="fixed inset-0 z-[200] flex items-center justify-center p-3 sm:p-4 bg-slate-900/70 backdrop-blur-sm animate-in fade-in duration-300">
      <div className="bg-white w-full max-w-4xl max-h-[92vh] overflow-y-auto rounded-xl shadow-2xl flex flex-col">
        
        {/* Modal Top Bar */}
        <div className="p-4 sm:p-5 bg-slate-50 border-b border-slate-200 flex items-center justify-between sticky top-0 bg-white/95 backdrop-blur-md z-20">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-[#164366] text-white flex items-center justify-center shadow-md">
              <Receipt className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-base sm:text-lg font-black text-slate-800">
                {isBangla ? 'অফিসিয়াল ফি ভাউচার ও মানি রিসিট' : 'Official Fee Voucher & Receipt'}
              </h2>
              <p className="text-xs text-slate-500 font-medium">
                #{data?.receiptNo || 'REC'} • {data?.date || new Date().toISOString().split('T')[0]}
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <button 
              onClick={handlePrint}
              className="px-5 py-2 bg-[#164366] hover:bg-[#0f2e47] text-white text-xs font-bold rounded-lg shadow-md transition-all flex items-center gap-2 cursor-pointer"
            >
              <Printer className="w-4 h-4" />
              {t('common.print') || (isBangla ? 'রশিদ প্রিন্ট করুন' : 'Print Voucher')}
            </button>
            <button 
              onClick={onClose}
              className="p-2 text-slate-400 hover:text-slate-700 rounded-lg hover:bg-slate-100 transition-colors cursor-pointer"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Scrollable Printable Area */}
        <div className="flex-1 overflow-y-auto p-3 sm:p-6 bg-slate-100 flex justify-center">
          
          {/* THE OFFICIAL INSTITUTIONAL VOUCHER */}
          <div 
            id="printable-voucher"
            className="w-full max-w-[794px] bg-[#f0f3f6] p-6 sm:p-8 relative z-0 flex flex-col shadow-lg border border-slate-300 rounded-sm"
          >
            {/* Full Page Logo Watermark */}
            <div className="absolute inset-0 flex items-center justify-center opacity-[0.06] pointer-events-none z-0 overflow-hidden">
              <img src={logo} alt="Watermark" className="w-[45%] max-w-xl object-contain grayscale" />
            </div>

            {/* Void / Cancelled Watermark & Banner */}
            {isVoided && (
              <>
                <div className="absolute inset-0 pointer-events-none flex items-center justify-center z-30 select-none overflow-hidden">
                  <div className="text-rose-600/15 font-black text-6xl sm:text-8xl transform -rotate-45 tracking-widest border-8 border-rose-600/15 rounded-3xl p-6 sm:p-10 uppercase text-center">
                    <div>CANCELLED</div>
                    <div className="text-3xl sm:text-5xl mt-2 tracking-normal">বাতিলকৃত</div>
                  </div>
                </div>

                <div className="bg-rose-50 border-2 border-rose-400 text-rose-800 px-4 py-2.5 rounded-lg mb-4 text-center z-20 shadow-xs relative">
                  <span className="font-black text-xs sm:text-sm uppercase tracking-wider block">
                    {isBangla ? '⚠️ এই রিসিটটি বাতিল (VOIDED) করা হয়েছে' : '⚠️ THIS RECEIPT HAS BEEN VOIDED / CANCELLED'}
                  </span>
                  {data?.voidReason && (
                    <span className="text-xs font-semibold text-rose-700 mt-0.5 block">
                      {isBangla ? 'বাতিলের কারণ:' : 'Reason:'} {data.voidReason}
                    </span>
                  )}
                </div>
              </>
            )}

            <style>{`
              @import url('https://fonts.googleapis.com/css2?family=Amiri:wght@700&display=swap');
              .font-arabic { font-family: 'Amiri', serif; }
              .clip-voucher-badge {
                clip-path: polygon(0 0, 100% 0, 100% 100%, 50% 85%, 0 100%);
              }
            `}</style>

            {/* Institutional Header */}
            <div className="flex justify-between items-start border-b-[3px] border-[#164366] pb-2 mb-2 relative z-10">
              <div className="flex items-center gap-4 sm:gap-6">
                {/* Logo Circle */}
                <div className="w-20 h-20 sm:w-24 sm:h-24 flex flex-col items-center justify-center overflow-hidden shrink-0">
                  <img src={logo} alt="Madrasa Logo" className="w-full h-full object-contain" />
                </div>
                <div className="text-center pt-1">
                  <h1 className="text-[22px] sm:text-[26px] leading-none font-arabic font-bold text-[#164366] mb-1">
                    الْمَدْرَسَةُ الْإِسْلَامِيَّةُ وَدَارُ الْأَيْتَامِ بِنَاكُونْدَا
                  </h1>
                  <h2 className="text-xl sm:text-2xl font-black text-slate-800 mb-0.5">
                    {madrasaName}
                  </h2>
                  <p className="text-[12px] sm:text-[13px] font-bold text-slate-700">
                    {address},
                  </p>
                  <p className="text-[12px] sm:text-[13px] font-bold text-slate-700">
                    স্থাপিত : ২০০০ খ্রি
                  </p>
                </div>
              </div>

              {/* Right Ribbon Badge */}
              <div className="absolute right-0 top-[-10px]">
                <div className="bg-[#164366] text-white w-[85px] sm:w-[90px] pt-3 sm:pt-4 pb-7 sm:pb-8 flex flex-col items-center justify-center relative clip-voucher-badge shadow-sm">
                  <div className="border border-white/50 p-1 mb-1 rounded">
                    <QrCode className="w-7 h-7 sm:w-8 sm:h-8" />
                  </div>
                  <span className="text-[10px] sm:text-[11px] font-black uppercase text-center leading-tight">
                    {data?.badgeTitle ? (
                      data.badgeTitle
                    ) : (
                      <>
                        Fee<br />Voucher
                      </>
                    )}
                  </span>
                </div>
              </div>
            </div>

            {/* Voice No & Date Bar */}
            <div className="flex justify-between text-[11px] font-bold text-slate-500 mb-5 uppercase tracking-wider mt-3 relative z-10">
              <span>VOICE NO: {data?.receiptNo || 'N/A'}</span>
              <span>DATE: {data?.date || new Date().toISOString().split('T')[0]}</span>
            </div>

            {/* Guardian Info & Academic Summary Bar with Vertical Divider */}
            <div className="flex items-stretch justify-between mb-6 px-4 relative z-10">
              {/* Guardian Info */}
              <div className="w-5/12 text-center">
                <h3 className="text-base sm:text-lg font-bold text-slate-700 mb-1">
                  {data?.donorName ? 'Donor Details' : 'Guardian Details'}
                </h3>
                <div>
                  <p className="text-xl sm:text-2xl font-black text-slate-800">
                    {data?.guardianName && data.guardianName !== 'N/A' && data.guardianName.trim() !== ''
                      ? data.guardianName
                      : (data?.donorName ? data.donorName : 'Father & Lead Guardian')}
                  </p>
                  <p className="text-xs sm:text-sm font-bold text-slate-600 mt-0.5">
                    {data?.donorName
                      ? 'Donor Contributor'
                      : (data?.guardianName && data.guardianName !== 'N/A' && data.guardianName.trim() !== '' ? 'Father & Lead Guardian' : '')}
                  </p>
                </div>
              </div>

              {/* Double Vertical Line Separator */}
              <div className="flex items-center justify-center w-1/12">
                <div className="h-full flex gap-1.5 min-h-[55px]">
                  <div className="w-1.5 h-full bg-[#164366]"></div>
                  <div className="w-[1.5px] h-full bg-[#164366]"></div>
                </div>
              </div>

              {/* Academic Summary */}
              <div className="w-5/12 text-center">
                <h3 className="text-base sm:text-lg font-bold text-slate-700 mb-1">
                  {data?.donorName ? 'Payment Summary' : 'Academic Summary'}
                </h3>
                <div className="flex justify-center gap-8">
                  <div>
                    <p className="text-lg sm:text-xl font-black text-slate-800">
                      {data?.year || new Date().getFullYear().toString()}
                    </p>
                    <p className="text-xs font-bold text-slate-600 mt-0.5">Academic Year</p>
                  </div>
                  <div>
                    <p className="text-lg sm:text-xl font-black text-slate-800">
                      {data?.rollNumber ? String(data.rollNumber).padStart(2, '0') : '01'}
                    </p>
                    <p className="text-xs font-bold text-slate-600 mt-0.5">
                      {data?.rollNumber ? 'Student Roll' : 'Student'}
                    </p>
                  </div>
                </div>
              </div>
            </div>

            {/* Enrolled Students / Fee Details Table */}
            <div className="mb-5 relative z-10">
              <h3 className="text-base sm:text-lg font-bold text-slate-800 mb-2.5">
                {data?.donorName ? 'Donation Details' : 'Enrolled Students'}
              </h3>

              <div className="border border-[#b8c7d4] bg-transparent">
                <table className="w-full text-left border-collapse">
                  <thead>
                    <tr className="border-b border-[#b8c7d4]">
                      <th className="p-3 text-xs sm:text-sm font-bold text-slate-800 border-r border-[#b8c7d4]">
                        {data?.donorName ? 'Donor Name' : 'Student Name'}
                      </th>
                      <th className="p-3 text-xs sm:text-sm font-bold text-slate-800 border-r border-[#b8c7d4] text-center">
                        {data?.donorName ? 'Fund Category' : 'Class'}
                      </th>
                      <th className="p-3 text-xs sm:text-sm font-bold text-slate-800 border-r border-[#b8c7d4]">
                        Fee Details
                      </th>
                      <th className="p-3 text-xs sm:text-sm font-bold text-slate-800 text-center">
                        Subtotal
                      </th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-[#b8c7d4]">
                    <tr className="bg-transparent">
                      <td className="p-3.5 border-r border-[#b8c7d4] align-top">
                        <p className="font-black text-slate-800 text-center text-base sm:text-lg">
                          {data?.studentName || data?.donorName || 'N/A'}
                        </p>
                        <p className="text-[10px] font-bold text-slate-400 text-center mt-1">
                          ID: {data?.studentId || 'N/A'}
                        </p>
                      </td>
                      <td className="p-3.5 border-r border-[#b8c7d4] font-bold text-slate-800 align-top text-center text-xs sm:text-sm">
                        {data?.className || data?.purpose || 'N/A'}
                      </td>
                      <td className="p-0 border-r border-[#b8c7d4] align-top">
                        <div className="flex flex-col divide-y divide-[#b8c7d4]">
                          {hasItems ? (
                            <>
                              {data.feeDetails.map((item, idx) => (
                                <div key={idx} className="px-3.5 py-1.5 flex justify-between text-xs font-bold text-slate-700">
                                  <span>{item.head} {item.period ? `(${item.period})` : ''}</span>
                                  <span>৳ {Number(item.amount || 0).toLocaleString()}</span>
                                </div>
                              ))}
                              {prevDueAmount > 0 && (
                                <div className="px-3.5 py-1.5 flex justify-between text-xs font-bold text-amber-900 bg-amber-50/60">
                                  <span>পূর্বের বকেয়া (Previous Due)</span>
                                  <span>৳ {prevDueAmount.toLocaleString()}</span>
                                </div>
                              )}
                            </>
                          ) : (
                            <div className="px-3.5 py-2 flex justify-between text-xs font-bold text-slate-700">
                              <span>{data?.purpose || 'Fee Collection'}</span>
                              <span>৳ {Number(data?.amount || 0).toLocaleString()}</span>
                            </div>
                          )}
                        </div>
                      </td>
                      <td className="p-3.5 font-black text-slate-800 text-center align-middle text-base sm:text-lg">
                        ৳ {subTotalAmount.toLocaleString()}
                      </td>
                    </tr>
                  </tbody>
                </table>
              </div>
            </div>

            {/* Financial Totals Breakdown */}
            <div className="flex justify-end mb-6 relative z-10">
              <div className="w-60 space-y-1.5">
                <div className="flex justify-between items-center text-xs sm:text-sm font-bold text-slate-800">
                  <span>Sub Total</span>
                  <span className="font-black">৳ {subTotalAmount.toLocaleString()}</span>
                </div>
                {discountAmount > 0 ? (
                  <div className="flex justify-between items-center text-xs sm:text-sm font-bold text-rose-600">
                    <span>Discount</span>
                    <span className="font-black">- ৳ {discountAmount.toLocaleString()}</span>
                  </div>
                ) : (
                  <div className="flex justify-between items-center text-xs sm:text-sm font-bold text-slate-800">
                    <span>Discount</span>
                    <span className="font-black">0</span>
                  </div>
                )}
                {prevDueAmount > 0 && (
                  <div className="flex justify-between items-center text-xs sm:text-sm font-bold text-amber-800">
                    <span>Previous Due</span>
                    <span className="font-black">+ ৳ {prevDueAmount.toLocaleString()}</span>
                  </div>
                )}
                <div className="flex justify-between items-center text-xs sm:text-sm font-bold text-slate-800 border-t border-slate-300 pt-1 mt-1">
                  <span>Total Amount</span>
                  <span className="font-black">৳ {totalPayableAmount.toLocaleString()}</span>
                </div>
              </div>
            </div>

            {/* Signatures & Paid / Due Colored Boxes */}
            <div className="mt-auto flex justify-between items-end pt-6 pb-2 relative z-10">
              {/* Accountant Signature */}
              <div className="text-center w-40 ml-2">
                <div className="h-14 flex items-center justify-center">
                  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 300 100" className="h-10 opacity-80">
                    <path d="M10,80 Q40,10 80,70 T150,60 T220,80 Q250,30 280,60" fill="none" stroke="#164366" strokeWidth="4" strokeLinecap="round" strokeLinejoin="round" />
                    <path d="M120,40 Q130,20 140,50" fill="none" stroke="#164366" strokeWidth="3" strokeLinecap="round" />
                  </svg>
                </div>
                <div className="pt-1.5 border-t border-slate-400">
                  <p className="text-xs sm:text-sm font-bold text-slate-800">একাউন্ট্যান্ট</p>
                </div>
              </div>

              {/* Paid & Due Boxes */}
              <div className="flex h-16 sm:h-20 shadow-sm rounded overflow-hidden">
                <div className="bg-[#164366] text-white w-28 sm:w-32 px-3 py-2 text-center flex flex-col justify-center border-r border-white/20">
                  <span className="text-xs sm:text-sm font-bold">Paid</span>
                  <span className="text-xl sm:text-2xl font-black mt-0.5">
                    ৳ {paidAmountVal.toLocaleString()}
                  </span>
                </div>
                <div className="bg-[#d32f2f] text-white w-28 sm:w-32 px-3 py-2 text-center flex flex-col justify-center">
                  <span className="text-xs sm:text-sm font-bold">Deu</span>
                  <span className="text-xl sm:text-2xl font-black mt-0.5">
                    ৳ {dueAmountVal.toLocaleString()}
                  </span>
                </div>
              </div>
            </div>

            {/* Institutional Footer Strip */}
            <div className="voucher-footer bg-[#164366] text-white py-2.5 px-6 sm:px-8 flex justify-center items-center gap-8 text-xs font-bold -mx-6 sm:-mx-8 -mb-6 sm:-mb-8 mt-6 shrink-0 relative z-10">
              <div className="flex items-center gap-2">
                <Globe className="w-3.5 h-3.5" />
                <span>www.pakundamadrasa.com</span>
              </div>
              <div className="flex items-center gap-2">
                <Phone className="w-3.5 h-3.5" />
                <span>01986544021</span>
              </div>
            </div>

          </div>
        </div>

      </div>
    </div>
  );
};

export default Voucher;
