import React, { useRef } from "react";
import { Printer, X, CheckCircle, Building2, User, Calendar, CreditCard, Award } from "lucide-react";

const PayslipPrintModal = ({ data, onClose }) => {
  if (!data) return null;

  const { payroll, staff, madrasa } = data;

  const formatCurrency = (amt) => {
    return new Intl.NumberFormat('en-BD', {
      style: 'currency',
      currency: 'BDT',
      minimumFractionDigits: 0
    }).format(amt || 0);
  };

  const getMonthName = (monthNumber) => {
    const months = [
      "জানুয়ারি (January)", "ফেব্রুয়ারি (February)", "মার্চ (March)",
      "এপ্রিল (April)", "মে (May)", "জুন (June)", "জুলাই (July)",
      "আগস্ট (August)", "সেপ্টেম্বর (September)", "অক্টোবর (October)",
      "নভেম্বর (November)", "ডিসেম্বর (December)"
    ];
    return months[(monthNumber || 1) - 1];
  };

  const handlePrint = () => {
    window.print();
  };

  const basicSalary = parseFloat(payroll?.basic_salary || 0);
  const houseRent = parseFloat(payroll?.house_rent || 0);
  const medical = parseFloat(payroll?.medical_allowance || 0);
  const transport = parseFloat(payroll?.transport_allowance || 0);
  const otherAllowance = parseFloat(payroll?.other_allowance || 0);
  const bonus = parseFloat(payroll?.bonus || 0);

  const absentDeduction = parseFloat(payroll?.absent_deduction || 0);
  const advanceDeduction = parseFloat(payroll?.advance_deduction || 0);
  const totalDeduction = absentDeduction + advanceDeduction;

  const totalEarnings = basicSalary + houseRent + medical + transport + otherAllowance + bonus;
  const netPayable = parseFloat(payroll?.net_payable || 0);
  const paidAmount = parseFloat(payroll?.paid_amount || 0);
  const remainingDue = parseFloat(payroll?.remaining_due || 0);

  return (
    <div className="fixed inset-0 z-[150] bg-slate-900/60 backdrop-blur-sm flex items-center justify-center p-4 sm:p-6 overflow-y-auto animate-in fade-in duration-300">
      <div className="bg-white rounded-[24px] w-full max-w-3xl shadow-2xl overflow-hidden flex flex-col my-auto max-h-[95vh] print:m-0 print:p-0 print:max-w-none print:shadow-none print:rounded-none">
        
        {/* Modal Top Bar (Hidden on Print) */}
        <div className="p-4 sm:p-5 border-b border-slate-100 flex items-center justify-between bg-slate-50 print:hidden">
          <div className="flex items-center gap-2">
            <Award className="w-5 h-5 text-[#00315e]" />
            <h3 className="text-base font-black text-slate-800">
              বেতন স্লিপ প্রিভিউ (Salary Slip Preview)
            </h3>
          </div>
          <div className="flex items-center gap-3">
            <button
              onClick={handlePrint}
              className="px-4 py-2 bg-[#00315e] text-white rounded-[8px] font-bold text-xs flex items-center gap-2 hover:bg-[#002547] transition-all shadow-md cursor-pointer"
            >
              <Printer className="w-4 h-4" />
              প্রিন্ট করুন (Print Slip)
            </button>
            <button
              onClick={onClose}
              className="p-2 text-slate-400 hover:text-slate-600 hover:bg-slate-200 rounded-full transition-colors cursor-pointer"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Printable Payslip Body */}
        <div id="printable-payslip" className="p-8 sm:p-10 overflow-y-auto flex-1 font-sans text-slate-800 space-y-6 print:p-6">
          
          {/* Institution Header */}
          <div className="text-center border-b-2 border-slate-800 pb-5">
            <h1 className="text-2xl sm:text-3xl font-black text-slate-900 uppercase tracking-tight">
              {madrasa?.name || "মাদ্রাসাতুল মদিনা (Madrasatul Madina)"}
            </h1>
            <p className="text-xs font-bold text-slate-500 mt-1 uppercase tracking-wider">
              {madrasa?.address || "ঢাকা, বাংলাদেশ"} • {madrasa?.phone || "Phone: +880 1700-000000"}
            </p>
            <div className="mt-3 inline-block bg-[#00315e] text-white px-5 py-1 rounded-full text-xs font-black uppercase tracking-widest print:border print:border-black print:text-black print:bg-transparent">
              কর্মচারী বেতন রশিদ / SALARY PAYSLIP
            </div>
          </div>

          {/* Reference & Date Bar */}
          <div className="flex justify-between items-center text-xs font-bold text-slate-600 bg-slate-50 p-3 rounded-[8px] border border-slate-100">
            <div>
              রশিদ নং: <span className="font-black text-slate-900">{payroll?.voucher_no || `PAY-${payroll?._id?.toString().slice(-6).toUpperCase()}`}</span>
            </div>
            <div>
              বেতনের মাস: <span className="font-black text-[#00315e]">{getMonthName(payroll?.month)}, {payroll?.year}</span>
            </div>
            <div>
              তারিখ: <span className="font-black text-slate-900">{new Date(payroll?.created_at || Date.now()).toLocaleDateString('en-GB')}</span>
            </div>
          </div>

          {/* Staff Info Grid */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 p-4 rounded-[8px] border border-slate-200 bg-white">
            <div>
              <p className="text-[10px] font-black uppercase text-slate-400 tracking-wider">কর্মীর নাম (Name)</p>
              <p className="text-sm font-black text-slate-900 mt-0.5">{staff?.name || "N/A"}</p>
            </div>
            <div>
              <p className="text-[10px] font-black uppercase text-slate-400 tracking-wider">এমপ্লয়ি আইডি (Staff ID)</p>
              <p className="text-sm font-black text-slate-800 mt-0.5">{staff?.employeeID || "N/A"}</p>
            </div>
            <div>
              <p className="text-[10px] font-black uppercase text-slate-400 tracking-wider">পদবী (Designation)</p>
              <p className="text-sm font-bold text-slate-700 mt-0.5">{staff?.designation || staff?.role || "Staff"}</p>
            </div>
            <div>
              <p className="text-[10px] font-black uppercase text-slate-400 tracking-wider">বিভাগ (Department)</p>
              <p className="text-sm font-bold text-slate-700 mt-0.5">{staff?.department || "Academic"}</p>
            </div>
          </div>

          {/* Breakdown Table: Earnings & Deductions */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            
            {/* Earnings Section */}
            <div className="border border-slate-200 rounded-[8px] overflow-hidden">
              <div className="bg-[#00315e24] px-4 py-2.5 font-black text-xs text-[#00315e] uppercase tracking-wide">
                উপার্জন ও ভাতাসমূহ (Earnings / Allowances)
              </div>
              <table className="w-full text-xs">
                <tbody className="divide-y divide-slate-100">
                  <tr className="hover:bg-slate-50">
                    <td className="px-4 py-2 font-bold text-slate-600">মূল বেতন (Basic Salary)</td>
                    <td className="px-4 py-2 text-right font-black text-slate-900">{formatCurrency(basicSalary)}</td>
                  </tr>
                  <tr className="hover:bg-slate-50">
                    <td className="px-4 py-2 font-bold text-slate-600">বাড়ি ভাড়া (House Rent)</td>
                    <td className="px-4 py-2 text-right font-bold text-slate-700">{formatCurrency(houseRent)}</td>
                  </tr>
                  <tr className="hover:bg-slate-50">
                    <td className="px-4 py-2 font-bold text-slate-600">চিকিৎসা ভাতা (Medical Allowance)</td>
                    <td className="px-4 py-2 text-right font-bold text-slate-700">{formatCurrency(medical)}</td>
                  </tr>
                  <tr className="hover:bg-slate-50">
                    <td className="px-4 py-2 font-bold text-slate-600">যাতায়াত ভাতা (Transport Allowance)</td>
                    <td className="px-4 py-2 text-right font-bold text-slate-700">{formatCurrency(transport)}</td>
                  </tr>
                  {otherAllowance > 0 && (
                    <tr className="hover:bg-slate-50">
                      <td className="px-4 py-2 font-bold text-slate-600">অন্যান্য ভাতা (Other Allowance)</td>
                      <td className="px-4 py-2 text-right font-bold text-slate-700">{formatCurrency(otherAllowance)}</td>
                    </tr>
                  )}
                  {bonus > 0 && (
                    <tr className="hover:bg-emerald-50/40">
                      <td className="px-4 py-2 font-bold text-emerald-700">উৎসব/বিশেষ বোনাস (Bonus)</td>
                      <td className="px-4 py-2 text-right font-black text-emerald-700">+{formatCurrency(bonus)}</td>
                    </tr>
                  )}
                </tbody>
                <tfoot>
                  <tr className="bg-slate-50 font-black border-t border-slate-200">
                    <td className="px-4 py-2.5 text-slate-900">মোট উপার্জন (Gross Earnings)</td>
                    <td className="px-4 py-2.5 text-right text-slate-900">{formatCurrency(totalEarnings)}</td>
                  </tr>
                </tfoot>
              </table>
            </div>

            {/* Deductions Section */}
            <div className="border border-slate-200 rounded-[8px] overflow-hidden">
              <div className="bg-rose-50 px-4 py-2.5 font-black text-xs text-rose-800 uppercase tracking-wide">
                কর্তনসমূহ (Deductions)
              </div>
              <table className="w-full text-xs">
                <tbody className="divide-y divide-slate-100">
                  <tr className="hover:bg-slate-50">
                    <td className="px-4 py-2 font-bold text-slate-600">অনুপস্থিতি কর্তন (Absent Deduction)</td>
                    <td className="px-4 py-2 text-right font-bold text-rose-600">
                      {absentDeduction > 0 ? `-${formatCurrency(absentDeduction)}` : "৳ 0"}
                    </td>
                  </tr>
                  <tr className="hover:bg-slate-50">
                    <td className="px-4 py-2 font-bold text-slate-600">অগ্রিম বেতন কর্তন (Advance Recovery)</td>
                    <td className="px-4 py-2 text-right font-bold text-rose-600">
                      {advanceDeduction > 0 ? `-${formatCurrency(advanceDeduction)}` : "৳ 0"}
                    </td>
                  </tr>
                  <tr className="hover:bg-slate-50">
                    <td className="px-4 py-2 font-bold text-slate-400">অন্যান্য কর্তন (Other Deductions)</td>
                    <td className="px-4 py-2 text-right font-bold text-slate-400">৳ 0</td>
                  </tr>
                </tbody>
                <tfoot>
                  <tr className="bg-rose-50/50 font-black border-t border-slate-200">
                    <td className="px-4 py-2.5 text-rose-900">মোট কর্তন (Total Deductions)</td>
                    <td className="px-4 py-2.5 text-right text-rose-700">
                      {totalDeduction > 0 ? `-${formatCurrency(totalDeduction)}` : "৳ 0"}
                    </td>
                  </tr>
                </tfoot>
              </table>
            </div>

          </div>

          {/* Net Salary Highlight Box */}
          <div className="bg-slate-50 p-4 sm:p-6 rounded-[8px] border border-slate-200 flex flex-col sm:flex-row items-center justify-between gap-4">
            <div>
              <p className="text-xs font-black uppercase tracking-wider text-slate-500">
                চলতি মাসের সর্বমোট প্রদেয় বেতন (Net Payable Salary)
              </p>
              <p className="text-xs font-bold text-slate-400 mt-1">
                উপার্জন ৳{totalEarnings.toLocaleString()} - কর্তন ৳{totalDeduction.toLocaleString()}
              </p>
            </div>
            <div className="text-right">
              <span className="text-2xl sm:text-3xl font-black text-[#00315e]">
                {formatCurrency(netPayable)}
              </span>
            </div>
          </div>

          {/* Payment Status Summary Bar */}
          <div className="grid grid-cols-3 gap-3 p-3 bg-white rounded-[8px] border border-slate-200 text-center text-xs">
            <div>
              <span className="text-[10px] font-black uppercase text-slate-400 block">পরিশোধিত (Paid)</span>
              <span className="font-black text-emerald-700 text-sm mt-0.5 block">{formatCurrency(paidAmount)}</span>
            </div>
            <div>
              <span className="text-[10px] font-black uppercase text-slate-400 block">বকেয়া (Remaining Due)</span>
              <span className="font-black text-rose-700 text-sm mt-0.5 block">{formatCurrency(remainingDue)}</span>
            </div>
            <div>
              <span className="text-[10px] font-black uppercase text-slate-400 block">পেমেন্ট স্ট্যাটাস (Status)</span>
              <span className={`inline-block px-2.5 py-0.5 rounded-full text-[10px] font-black uppercase tracking-wider mt-1 ${
                payroll?.status === 'paid' ? 'bg-emerald-100 text-emerald-800' :
                payroll?.status === 'partial' ? 'bg-amber-100 text-amber-800' :
                'bg-rose-100 text-rose-800'
              }`}>
                {payroll?.status === 'paid' ? 'পরিশোধিত (Paid)' :
                 payroll?.status === 'partial' ? 'আংশিক (Partial)' :
                 'বকেয়া (Unpaid)'}
              </span>
            </div>
          </div>

          {payroll?.note && (
            <p className="text-xs font-bold text-slate-500 italic bg-slate-50 p-2.5 rounded-[6px] border border-slate-100">
              মন্তব্য / Note: {payroll.note}
            </p>
          )}

          {/* Signatures */}
          <div className="pt-16 grid grid-cols-3 gap-8 text-center text-xs">
            <div>
              <div className="border-t border-slate-800 pt-2 font-bold text-slate-700">
                কর্মচারীর স্বাক্ষর (Staff Signature)
              </div>
            </div>
            <div>
              <div className="border-t border-slate-800 pt-2 font-bold text-slate-700">
                হিসাবরক্ষক (Accountant)
              </div>
            </div>
            <div>
              <div className="border-t border-slate-800 pt-2 font-bold text-slate-700">
                মুহতামিম / অধ্যক্ষ (Authorized Signature)
              </div>
            </div>
          </div>

        </div>

        {/* Modal Bottom Footer (Hidden on Print) */}
        <div className="p-4 bg-slate-50 border-t border-slate-100 flex justify-end gap-3 print:hidden">
          <button
            onClick={onClose}
            className="px-5 py-2.5 bg-slate-200 text-slate-700 font-bold rounded-[8px] text-xs hover:bg-slate-300 transition-colors cursor-pointer"
          >
            বন্ধ করুন (Close)
          </button>
          <button
            onClick={handlePrint}
            className="px-6 py-2.5 bg-[#00315e] text-white font-bold rounded-[8px] text-xs flex items-center gap-2 hover:bg-[#002547] transition-all shadow-md cursor-pointer"
          >
            <Printer className="w-4 h-4" />
            প্রিন্ট করুন (Print Slip)
          </button>
        </div>

      </div>
    </div>
  );
};

export default PayslipPrintModal;
