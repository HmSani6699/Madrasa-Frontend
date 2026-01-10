import React, { useState } from 'react';
import { 
  Settings, 
  Save, 
  Plus, 
  Trash2, 
  Edit2,
  Check
} from 'lucide-react';

const FeeSetup = () => {
  const [activeTab, setActiveTab] = useState('heads'); // heads | assign

  // Mock Fee Heads
  const [feeHeads, setFeeHeads] = useState([
    { id: 1, name: "Monthly Tuition Fee", type: "Monthly" },
    { id: 2, name: "Admission Fee", type: "One-time" },
    { id: 3, name: "Exam Fee", type: "Per Exam" },
    { id: 4, name: "Sports Fee", type: "Annual" },
  ]);

  // Mock Classes & Amounts
  const [classFees, setClassFees] = useState([
    { id: 101, className: "Play Group", amount: 0 },
    { id: 102, className: "Nursery", amount: 0 },
    { id: 103, className: "Class 1", amount: 0 },
    { id: 104, className: "Class 2", amount: 0 },
    { id: 105, className: "Hifz - Group A", amount: 0 },
    { id: 106, className: "Hifz - Group B", amount: 0 },
  ]);

  const [selectedHead, setSelectedHead] = useState(feeHeads[0]);

  const handleAmountChange = (id, newAmount) => {
    setClassFees(prev => prev.map(c => 
      c.id === id ? { ...c, amount: newAmount } : c
    ));
  };

  return (
    <div className="max-w-6xl mx-auto p-6 space-y-8 animate-in fade-in duration-500">
      
      {/* Header */}
      <div>
        <h1 className="text-2xl font-bold text-slate-800 flex items-center gap-2">
          <Settings className="w-8 h-8 text-primary" />
          Fee Configuration
        </h1>
        <p className="text-slate-500 mt-1">Manage fee types and set amounts for each class.</p>
      </div>

      {/* Tabs */}
      <div className="flex gap-4 border-b border-slate-200">
          <button 
            onClick={() => setActiveTab('heads')}
            className={`pb-3 px-4 text-sm font-bold transition-all ${activeTab === 'heads' ? 'text-primary border-b-2 border-primary' : 'text-slate-500 hover:text-slate-700'}`}
          >
              1. Fee Heads
          </button>
           <button 
            onClick={() => setActiveTab('assign')}
            className={`pb-3 px-4 text-sm font-bold transition-all ${activeTab === 'assign' ? 'text-primary border-b-2 border-primary' : 'text-slate-500 hover:text-slate-700'}`}
          >
              2. Assign Amounts
          </button>
      </div>

      {activeTab === 'heads' && (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm h-fit">
                  <h3 className="font-bold text-slate-700 mb-4">Add New Fee Type</h3>
                  <div className="space-y-4">
                      <div>
                          <label className="text-xs font-bold text-slate-500 uppercase">Fee Name</label>
                          <input type="text" placeholder="e.g. Lab Fee" className="w-full mt-1 p-2 border border-slate-200 rounded-lg focus:outline-none focus:border-primary" />
                      </div>
                      <div>
                          <label className="text-xs font-bold text-slate-500 uppercase">Frequency</label>
                          <select className="w-full mt-1 p-2 border border-slate-200 rounded-lg bg-white focus:outline-none focus:border-primary">
                              <option>Monthly</option>
                              <option>One-time</option>
                              <option>Annual</option>
                          </select>
                      </div>
                      <button className="w-full py-2 bg-slate-800 text-white font-bold rounded-lg hover:bg-slate-900 transition-all flex items-center justify-center gap-2">
                          <Plus className="w-4 h-4" /> Create Fee Head
                      </button>
                  </div>
              </div>

              <div className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden">
                   <div className="p-4 bg-slate-50 border-b border-slate-200">
                       <h3 className="font-bold text-slate-700">Existing Fee Heads</h3>
                   </div>
                   <div className="divide-y divide-slate-100">
                       {feeHeads.map(head => (
                           <div key={head.id} className="p-4 flex items-center justify-between group">
                               <div>
                                   <p className="font-bold text-slate-800">{head.name}</p>
                                   <p className="text-xs text-slate-500 uppercase">{head.type}</p>
                               </div>
                               <div className="flex gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                                   <button className="p-2 text-blue-500 hover:bg-blue-50 rounded-lg"><Edit2 className="w-4 h-4" /></button>
                                   <button className="p-2 text-rose-500 hover:bg-rose-50 rounded-lg"><Trash2 className="w-4 h-4" /></button>
                               </div>
                           </div>
                       ))}
                   </div>
              </div>
          </div>
      )}

      {activeTab === 'assign' && (
          <div className="space-y-6">
              <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-sm flex items-center gap-4">
                  <span className="font-bold text-slate-500 text-sm uppercase">Select Fee Head:</span>
                  <div className="flex gap-2 overflow-x-auto pb-1">
                      {feeHeads.map(head => (
                          <button 
                            key={head.id}
                            onClick={() => setSelectedHead(head)}
                            className={`px-4 py-2 rounded-lg text-sm font-bold whitespace-nowrap transition-all ${selectedHead.id === head.id ? 'bg-primary text-white shadow-md' : 'bg-slate-50 text-slate-600 hover:bg-slate-100'}`}
                          >
                              {head.name}
                          </button>
                      ))}
                  </div>
              </div>

              <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm">
                  <div className="flex justify-between items-center mb-6">
                      <div>
                          <h3 className="font-bold text-lg text-slate-800">Set Amounts for {selectedHead.name}</h3>
                          <p className="text-sm text-slate-500">Enter the amount applicable for each class. Use 0 if not applicable.</p>
                      </div>
                      <button className="px-6 py-2.5 bg-emerald-600 text-white font-bold rounded-xl shadow-lg shadow-emerald-200 hover:bg-emerald-700 transition-all flex items-center gap-2">
                          <Save className="w-4 h-4" /> Save Changes
                      </button>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                      {classFees.map(cls => (
                          <div key={cls.id} className="flex items-center gap-4 p-4 rounded-xl bg-slate-50 border border-slate-100 hover:border-slate-300 transition-colors">
                              <div className="flex-1">
                                  <p className="font-bold text-slate-700">{cls.className}</p>
                              </div>
                              <div className="relative w-32">
                                  <span className="absolute left-3 top-2.5 text-slate-400 font-bold">৳</span>
                                  <input 
                                    type="number" 
                                    className="w-full pl-8 pr-3 py-2 border border-slate-200 rounded-lg font-bold text-slate-800 focus:outline-none focus:ring-2 focus:ring-primary/20"
                                    defaultValue={cls.amount === 0 ? "" : cls.amount}
                                    placeholder="0"
                                    onChange={(e) => handleAmountChange(cls.id, e.target.value)}
                                  />
                              </div>
                          </div>
                      ))}
                  </div>
              </div>
          </div>
      )}

    </div>
  );
};

export default FeeSetup;
