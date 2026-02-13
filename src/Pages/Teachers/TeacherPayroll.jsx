import { useState } from "react";
import { 
  Wallet, 
  Download, 
  Calendar, 
  CheckCircle2, 
  Clock,
  TrendingUp,
  CreditCard,
  FileText
} from "lucide-react";
import { useTranslation } from "react-i18next";
import jsPDF from "jspdf";
import "jspdf-autotable";

const TeacherPayroll = () => {
  const { t } = useTranslation();
  const [selectedYear, setSelectedYear] = useState("2024");

  // Mock Payroll Data
  const payrollData = [
    { id: "PAY-2024-001", month: "January", year: "2024", date: "02-02-2024", amount: 12500, status: "Paid", type: "Bank Transfer" },
    { id: "PAY-2024-002", month: "February", year: "2024", date: "03-03-2024", amount: 12500, status: "Paid", type: "Bank Transfer" },
    { id: "PAY-2024-003", month: "March", year: "2024", date: "02-04-2024", amount: 13500, status: "Paid", type: "Bank Transfer", bonus: 1000 },
    { id: "PAY-2024-004", month: "April", year: "2024", date: "05-05-2024", amount: 12500, status: "Paid", type: "Bank Transfer" },
    { id: "PAY-2024-005", month: "May", year: "2024", date: "03-06-2024", amount: 12500, status: "Paid", type: "Cash" },
    { id: "PAY-2024-006", month: "June", year: "2024", date: "02-07-2024", amount: 18500, status: "Paid", type: "Bank Transfer", bonus: 6000 },
    { id: "PAY-2024-007", month: "July", year: "2024", date: "Pending", amount: 12500, status: "Pending", type: "-" },
  ];

  const downloadSlip = (record) => {
    const doc = new jsPDF();
    
    // Header
    doc.setFontSize(22);
    doc.setTextColor(0, 189, 127); // Brand Color
    doc.text("PAYSLIP", 105, 20, { align: "center" });
    
    doc.setFontSize(10);
    doc.setTextColor(100);
    doc.text(`Slip ID: ${record.id}`, 105, 28, { align: "center" });
    
    // Details
    doc.autoTable({
      startY: 40,
      head: [[{ content: 'Description', colSpan: 2 }]],
      body: [
        ['Payment Month', `${record.month}, ${record.year}`],
        ['Payment Date', record.date],
        ['Payment Method', record.type],
        ['Status', record.status],
        ['Base Salary', '12500 BDT'],
        ['Bonus/Allowances', record.bonus ? `${record.bonus} BDT` : '0 BDT'],
        [{ content: 'Total Amount', styles: { fontStyle: 'bold', fillColor: [240, 255, 248] } }, { content: `${record.amount} BDT`, styles: { fontStyle: 'bold', fillColor: [240, 255, 248] } }],
      ],
      theme: 'grid',
      headStyles: { fillColor: [0, 189, 127] },
    });

    doc.save(`Payslip_${record.month}_${record.year}.pdf`);
  };

  return (
    <div className="min-h-screen bg-slate-50/50 p-4 md:p-8 animate-in fade-in duration-500">
      <div className="max-w-[1600px] mx-auto space-y-6 md:space-y-8">
        
        {/* Header Section */}
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 bg-white p-6 rounded-[20px] border border-slate-200 shadow-sm">
           <div className="flex items-center gap-4">
              <div className="w-12 h-12 bg-[#00bd7f]/10 rounded-xl flex items-center justify-center border border-[#00bd7f]/20">
                 <Wallet className="w-6 h-6 text-[#00bd7f]" />
              </div>
              <div>
                 <h1 className="text-xl md:text-2xl font-black text-slate-800 tracking-tight">{t('teacher.payroll.title')}</h1>
                 <p className="text-slate-500 text-xs md:text-sm font-bold">{t('teacher.payroll.subtitle')}</p>
              </div>
           </div>

           <div className="flex items-center gap-3">
              <div className="px-4 py-2 bg-emerald-50 text-emerald-700 rounded-lg border border-emerald-100 font-bold text-sm flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4" />
                {t('teacher.payroll.status_active')}
              </div>
           </div>
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 md:gap-6">
          <div className="bg-white p-6 rounded-[20px] border border-slate-200 shadow-sm relative overflow-hidden group">
            <div className="absolute right-0 top-0 w-32 h-32 bg-[#00bd7f]/5 rounded-bl-[100px] transition-all group-hover:bg-[#00bd7f]/10"></div>
            <div className="relative">
              <p className="text-slate-500 font-bold text-sm mb-1">{t('teacher.payroll.net_salary')}</p>
              <h3 className="text-3xl font-black text-slate-800">৳ 12,500</h3>
              <div className="mt-4 flex items-center gap-2 text-xs font-bold text-emerald-600 bg-emerald-50 w-fit px-2 py-1 rounded-md">
                <TrendingUp className="w-3 h-3" />
                <span>Basic Pay</span>
              </div>
            </div>
          </div>

          <div className="bg-white p-6 rounded-[20px] border border-slate-200 shadow-sm relative overflow-hidden group">
            <div className="absolute right-0 top-0 w-32 h-32 bg-indigo-50/50 rounded-bl-[100px] transition-all group-hover:bg-indigo-50"></div>
            <div className="relative">
              <p className="text-slate-500 font-bold text-sm mb-1">{t('teacher.payroll.total_earned')}</p>
              <h3 className="text-3xl font-black text-slate-800">৳ 82,000</h3>
              <p className="text-xs font-medium text-slate-400 mt-2">Year: 2024</p>
            </div>
          </div>

          <div className="bg-white p-6 rounded-[20px] border border-slate-200 shadow-sm relative overflow-hidden group">
            <div className="absolute right-0 top-0 w-32 h-32 bg-orange-50/50 rounded-bl-[100px] transition-all group-hover:bg-orange-50"></div>
            <div className="relative">
              <p className="text-slate-500 font-bold text-sm mb-1">{t('teacher.payroll.last_payment')}</p>
              <h3 className="text-3xl font-black text-slate-800">02 July</h3>
              <p className="text-xs font-medium text-slate-400 mt-2">Via Bank Transfer</p>
            </div>
          </div>
        </div>

        {/* Payroll History */}
        <div className="bg-white rounded-[20px] border border-slate-200 shadow-sm overflow-hidden">
          <div className="p-6 border-b border-slate-100 flex flex-col md:flex-row justify-between items-center gap-4">
             <h2 className="text-lg font-black text-slate-800 flex items-center gap-2">
                <Clock className="w-5 h-5 text-slate-400" />
                {t('teacher.payroll.payment_history')}
             </h2>
             <select 
                value={selectedYear}
                onChange={(e) => setSelectedYear(e.target.value)}
                className="px-4 py-2 bg-slate-50 border border-slate-200 rounded-xl text-sm font-bold text-slate-600 focus:outline-none focus:border-[#00bd7f]"
             >
                <option value="2024">2024</option>
                <option value="2023">2023</option>
             </select>
          </div>
          
          <div className="overflow-x-auto">
             <table className="w-full min-w-[800px]">
                <thead>
                   <tr className="bg-slate-50 border-b border-slate-200">
                      <th className="px-6 py-4 text-left text-[10px] font-black text-slate-500 uppercase tracking-widest">{t('teacher.payroll.month')}</th>
                      <th className="px-6 py-4 text-left text-[10px] font-black text-slate-500 uppercase tracking-widest">{t('teacher.payroll.date')}</th>
                      <th className="px-6 py-4 text-left text-[10px] font-black text-slate-500 uppercase tracking-widest">{t('teacher.payroll.amount')}</th>
                      <th className="px-6 py-4 text-left text-[10px] font-black text-slate-500 uppercase tracking-widest">{t('teacher.payroll.method')}</th>
                      <th className="px-6 py-4 text-center text-[10px] font-black text-slate-500 uppercase tracking-widest">{t('teacher.payroll.p_status')}</th>
                      <th className="px-6 py-4 text-right text-[10px] font-black text-slate-500 uppercase tracking-widest">{t('teacher.payroll.actions')}</th>
                   </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                   {payrollData.map((record, index) => (
                      <tr key={index} className="group hover:bg-slate-50/50 transition-colors">
                         <td className="px-6 py-4">
                            <div className="flex items-center gap-3">
                               <div className="w-8 h-8 rounded-lg bg-indigo-50 flex items-center justify-center text-indigo-600 font-bold text-xs">
                                  {record.month.substring(0, 3)}
                               </div>
                               <span className="font-bold text-slate-700 text-sm">{record.month}</span>
                            </div>
                         </td>
                         <td className="px-6 py-4">
                            <span className="text-xs font-bold text-slate-500">{record.date}</span>
                         </td>
                         <td className="px-6 py-4">
                            <span className="font-black text-slate-700">৳ {record.amount.toLocaleString()}</span>
                            {record.bonus && <span className="ml-2 text-[10px] bg-amber-50 text-amber-600 px-1.5 py-0.5 rounded font-bold">+ Bonus</span>}
                         </td>
                         <td className="px-6 py-4">
                            <div className="flex items-center gap-2">
                               <CreditCard className="w-3 h-3 text-slate-400" />
                               <span className="text-xs font-medium text-slate-600">{record.type}</span>
                            </div>
                         </td>
                         <td className="px-6 py-4 text-center">
                            <span className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-[10px] font-black uppercase tracking-wide border ${
                               record.status === 'Paid' 
                                  ? 'bg-emerald-50 text-emerald-600 border-emerald-100' 
                                  : 'bg-amber-50 text-amber-600 border-amber-100'
                            }`}>
                               <span className={`w-1.5 h-1.5 rounded-full ${record.status === 'Paid' ? 'bg-emerald-500' : 'bg-amber-500'}`}></span>
                               {record.status}
                            </span>
                         </td>
                         <td className="px-6 py-4 text-right">
                            {record.status === 'Paid' && (
                               <button 
                                 onClick={() => downloadSlip(record)}
                                 className="inline-flex items-center gap-2 px-3 py-1.5 text-xs font-bold text-[#00bd7f] hover:bg-[#00bd7f]/10 rounded-lg transition-colors"
                               >
                                  <FileText className="w-3 h-3" />
                                  Slip
                               </button>
                            )}
                         </td>
                      </tr>
                   ))}
                </tbody>
             </table>
          </div>
        </div>

      </div>
    </div>
  );
};

export default TeacherPayroll;
