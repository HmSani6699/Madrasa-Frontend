import React, { useState } from 'react';
import { 
  Settings, 
  Save, 
  Search,
  User,
  Calculator
} from 'lucide-react';

const SalarySetup = () => {
  const [searchTerm, setSearchTerm] = useState('');

  // Mock Employee Data
  const [employees, setEmployees] = useState([
    { id: 1, name: "Maulana Ahmed", designation: "Head Teacher", basic: 20000, housing: 5000, medical: 2000, transport: 1000 },
    { id: 2, name: "Hafiz Karim", designation: "Teacher", basic: 15000, housing: 3000, medical: 1500, transport: 500 },
    { id: 3, name: "Abdul Jabbar", designation: "Staff", basic: 10000, housing: 2000, medical: 1000, transport: 500 },
  ]);

  const handleSalaryChange = (id, field, value) => {
    setEmployees(prev => prev.map(emp => 
      emp.id === id ? { ...emp, [field]: parseFloat(value) || 0 } : emp
    ));
  };

  const filteredEmployees = employees.filter(e => e.name.toLowerCase().includes(searchTerm.toLowerCase()));

  return (
    <div className="max-w-7xl mx-auto p-6 space-y-8 animate-in fade-in duration-500">
      
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
           <h1 className="text-2xl font-bold text-slate-800 flex items-center gap-2">
             <Settings className="w-8 h-8 text-primary" />
             Salary Configuration
           </h1>
           <p className="text-slate-500 mt-1">Set base salary and allowances for each employee.</p>
        </div>
        <button className="px-6 py-2.5 bg-emerald-600 text-white font-bold rounded-xl shadow-lg shadow-emerald-200 hover:bg-emerald-700 transition-all flex items-center gap-2">
            <Save className="w-5 h-5" /> Save All Changes
        </button>
      </div>

      {/* Search & Table */}
      <div className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden">
         <div className="p-4 border-b border-slate-200 bg-slate-50 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
             <h3 className="font-bold text-slate-700">Employee List</h3>
             <div className="relative w-full sm:w-64">
                 <Search className="absolute left-3 top-2.5 w-4 h-4 text-slate-400" />
                 <input 
                    type="text" 
                    placeholder="Search employee..." 
                    className="w-full pl-9 pr-4 py-2 text-sm border border-slate-200 rounded-lg focus:outline-none focus:border-primary" 
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                 />
             </div>
         </div>
         
         <div className="overflow-x-auto">
             <table className="w-full text-left border-collapse">
                 <thead>
                     <tr className="bg-slate-50 text-slate-500 text-xs uppercase font-bold tracking-wider">
                         <th className="p-4 border-b border-slate-200 min-w-[200px]">Employee Details</th>
                         <th className="p-4 border-b border-slate-200 w-32">Basic Salary</th>
                         <th className="p-4 border-b border-slate-200 w-32">House Rent</th>
                         <th className="p-4 border-b border-slate-200 w-32">Medical</th>
                         <th className="p-4 border-b border-slate-200 w-32 text-indigo-600">Transport</th>
                         <th className="p-4 border-b border-slate-200 w-40 text-emerald-700 text-right">Gross Total</th>
                     </tr>
                 </thead>
                 <tbody className="divide-y divide-slate-100">
                     {filteredEmployees.map((emp) => {
                         const gross = emp.basic + emp.housing + emp.medical + emp.transport;
                         return (
                            <tr key={emp.id} className="hover:bg-slate-50/50 transition-colors group">
                                <td className="p-4">
                                    <div className="flex items-center gap-3">
                                        <div className="w-10 h-10 bg-slate-100 rounded-full flex items-center justify-center text-slate-400 font-bold">
                                            {emp.name.charAt(0)}
                                        </div>
                                        <div>
                                            <p className="font-bold text-slate-800 text-sm">{emp.name}</p>
                                            <p className="text-xs text-slate-500">{emp.designation}</p>
                                        </div>
                                    </div>
                                </td>
                                <td className="p-4">
                                    <input 
                                      type="number" 
                                      className="w-full p-2 border border-slate-200 rounded-lg font-medium text-slate-700 focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all"
                                      value={emp.basic}
                                      onChange={(e) => handleSalaryChange(emp.id, 'basic', e.target.value)}
                                    />
                                </td>
                                <td className="p-4">
                                     <input 
                                      type="number" 
                                      className="w-full p-2 border border-slate-200 rounded-lg font-medium text-slate-600 focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all"
                                      value={emp.housing}
                                      onChange={(e) => handleSalaryChange(emp.id, 'housing', e.target.value)}
                                    />
                                </td>
                                <td className="p-4">
                                     <input 
                                      type="number" 
                                      className="w-full p-2 border border-slate-200 rounded-lg font-medium text-slate-600 focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all"
                                      value={emp.medical}
                                      onChange={(e) => handleSalaryChange(emp.id, 'medical', e.target.value)}
                                    />
                                </td>
                                <td className="p-4">
                                     <input 
                                      type="number" 
                                      className="w-full p-2 border border-indigo-100 bg-indigo-50/30 rounded-lg font-medium text-indigo-700 focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 transition-all"
                                      value={emp.transport}
                                      onChange={(e) => handleSalaryChange(emp.id, 'transport', e.target.value)}
                                    />
                                </td>
                                <td className="p-4 text-right">
                                    <p className="text-lg font-black text-slate-800">৳ {gross}</p>
                                    <p className="text-[10px] text-slate-400 font-bold uppercase tracking-wider">Monthly</p>
                                </td>
                            </tr>
                         )
                     })}
                 </tbody>
             </table>
         </div>
      </div>
      
      <div className="bg-blue-50 border border-blue-100 p-4 rounded-xl flex items-start gap-3">
          <Calculator className="w-5 h-5 text-blue-600 mt-0.5" />
          <div className="text-sm text-blue-800">
              <span className="font-bold">Note:</span> Changing salary structures here will affect the next payroll generation. Past payroll records will remain unchanged.
          </div>
      </div>

    </div>
  );
};

export default SalarySetup;
