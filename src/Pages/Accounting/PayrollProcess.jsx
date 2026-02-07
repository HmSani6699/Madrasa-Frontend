import React, { useState } from "react";
import {
  Users,
  CheckCircle,
  Clock,
  AlertTriangle,
  Banknote,
  Search,
  Download,
} from "lucide-react";
import { useTranslation } from "react-i18next";
import { Link } from "react-router";
import SalarySetupModal from "../../components/SalarySetupModal";

const PayrollProcess = () => {
  const { t } = useTranslation();
  // Mock Employee Data for Payroll
  const employees = [
    {
      id: 1,
      name: "Maulana Ahmed",
      role: "Head Teacher",
      basic: 25000,
      allowance: 5000,
      deduction: 0,
      status: "pending",
    },
    {
      id: 2,
      name: "Hafiz Karim",
      role: "Teacher",
      basic: 18000,
      allowance: 2000,
      deduction: 500,
      status: "paid",
    },
    {
      id: 3,
      name: "Abdul Jabbar",
      role: "Staff",
      basic: 12000,
      allowance: 1000,
      deduction: 0,
      status: "pending",
    },
  ];

  const [openSalarySetupModal, setOpenSalarySetupModal] = useState(false);

  console.log(openSalarySetupModal);

  return (
    <div className="max-w-6xl mx-auto p-6 space-y-8 animate-in fade-in duration-500">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-slate-800">
            {t('payroll_process.title')}
          </h1>
         
        </div>
        <div className="flex gap-3">
          <Link to={"/admin/accounting/payroll/history"}>
            <button className="px-4 py-2 border border-slate-200 rounded-lg text-slate-600 font-semibold hover:bg-slate-50 cursor-pointer">
              {t('payroll_process.view_history')}
            </button>
          </Link>
          <button
            onClick={() => setOpenSalarySetupModal(!openSalarySetupModal)}
            className="px-6 py-2 bg-primary text-white font-bold rounded-lg shadow-lg shadow-primary/20 hover:scale-105 transition-all cursor-pointer"
          >
            {t('payroll_process.salary_setup')}
          </button>
        </div>
      </div>

      {/* Summary Stats */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm">
          <p className="text-xs font-bold text-slate-400 uppercase tracking-widest mb-2">
            {t('payroll_process.total_payable')}
          </p>
          <h3 className="text-3xl font-black text-slate-800">৳ 145,000</h3>
          <p className="text-sm text-slate-500 mt-1">{t('payroll_process.for_employees', { count: 12 })}</p>
        </div>
        <div className="bg-indigo-50 p-6 rounded-2xl border border-indigo-100 shadow-sm">
          <p className="text-xs font-bold text-indigo-400 uppercase tracking-widest mb-2">
            {t('payroll_process.disbursed')}
          </p>
          <h3 className="text-3xl font-black text-indigo-700">৳ 22,500</h3>
          <p className="text-sm text-indigo-500 mt-1">{t('payroll_process.employees_paid', { count: 2 })}</p>
        </div>
        <div className="bg-amber-50 p-6 rounded-2xl border border-amber-100 shadow-sm">
          <p className="text-xs font-bold text-amber-500 uppercase tracking-widest mb-2">
            {t('payroll_process.pending')}
          </p>
          <h3 className="text-3xl font-black text-amber-700">৳ 122,500</h3>
          <p className="text-sm text-amber-600/80 mt-1">{t('payroll_process.action_required')}</p>
        </div>
      </div>

      {/* Employee List Table */}
      <div className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden">
        <div className="p-4 border-b border-slate-200 bg-slate-50 flex items-center justify-between gap-4">
          <div className="flex items-center gap-2 text-slate-500">
            <Users className="w-5 h-5" />
            <span className="font-bold text-sm uppercase">{t('payroll_process.employee_list')}</span>
          </div>
          <div className="relative max-w-sm w-full">
            <Search className="absolute left-3 top-2.5 w-4 h-4 text-slate-400" />
            <input
              type="text"
              placeholder={t('payroll_process.search_employee')}
              className="w-full pl-9 pr-4 py-2 text-sm border border-slate-200 rounded-lg focus:outline-none focus:border-primary"
            />
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-slate-50 text-slate-500 text-xs uppercase font-bold tracking-wider">
                <th className="p-4 border-b border-slate-200">{t('salary_report.employee')}</th>
                <th className="p-4 border-b border-slate-200">{t('common.role')}</th>
                <th className="p-4 border-b border-slate-200 whitespace-nowrap">
                  {t('payroll_process.base_salary')}
                </th>
                <th className="p-4 border-b border-slate-200">{t('payroll_process.allowances')}</th>
                <th className="p-4 border-b border-slate-200 text-rose-500">
                  {t('payroll_process.deductions')}
                </th>
                <th className="p-4 border-b border-slate-200 text-emerald-600 whitespace-nowrap">
                  {t('payroll_process.net_payable')}
                </th>
                <th className="p-4 border-b border-slate-200 text-center">
                  {t('common.status')}
                </th>
                <th className="p-4 border-b border-slate-200 text-right">
                  {t('salary_report.action')}
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {employees.map((emp) => {
                const netPay = emp.basic + emp.allowance - emp.deduction;
                const isPaid = emp.status === "Paid";

                return (
                  <tr
                    key={emp.id}
                    className="hover:bg-slate-50/50 transition-colors whitespace-nowrap"
                  >
                    <td className="p-4 font-bold text-slate-800">{emp.name}</td>
                    <td className="p-4 text-slate-500 text-sm">{emp.role}</td>
                    <td className="p-4 text-slate-600 font-medium">
                      ৳ {emp.basic}
                    </td>
                    <td className="p-4 text-green-600 font-medium">
                      + {emp.allowance}
                    </td>
                    <td className="p-4 text-rose-500 font-medium">
                      - {emp.deduction}
                    </td>
                    <td className="p-4 font-black text-slate-800">
                      ৳ {netPay}
                    </td>
                    <td className="p-4 text-center">
                      {isPaid ? (
                        <span className="inline-flex items-center gap-1 px-2 py-1 bg-emerald-100 text-emerald-700 text-[10px] font-bold uppercase rounded-full">
                          <CheckCircle className="w-3 h-3" /> {t('salary_report.statuses.paid')}
                        </span>
                      ) : (
                        <span className="inline-flex items-center gap-1 px-2 py-1 bg-amber-100 text-amber-700 text-[10px] font-bold uppercase rounded-full">
                          <Clock className="w-3 h-3" /> {t('salary_report.statuses.pending')}
                        </span>
                      )}
                    </td>
                    <td className="p-4 text-right">
                      {isPaid ? (
                        <button className="p-2 text-slate-400 hover:text-primary transition-colors">
                          <Download className="w-4 h-4" />
                        </button>
                      ) : (
                        <button className="px-4 py-1.5 bg-slate-900 text-white text-xs font-bold rounded-lg hover:bg-slate-800 transition-all shadow-md">
                          {t('payroll_process.pay_now')}
                        </button>
                      )}
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>

      {openSalarySetupModal && (
        <SalarySetupModal onClose={setOpenSalarySetupModal} />
      )}
    </div>
  );
};

export default PayrollProcess;
