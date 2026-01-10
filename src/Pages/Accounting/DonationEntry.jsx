import React, { useState } from 'react';
import { 
  HeartHandshake, 
  Printer, 
  Save, 
  User, 
  Phone, 
  MapPin, 
  Banknote,
  Calendar
} from 'lucide-react';

const DonationEntry = () => {
  const [formData, setFormData] = useState({
    donorName: '',
    phone: '',
    address: '',
    amount: '',
    type: 'General Fund (Sadaqah)',
    paymentMode: 'Cash',
    remarks: '',
    date: new Date().toISOString().split('T')[0]
  });

  const donationTypes = [
    "General Fund (Sadaqah)",
    "Zakat Fund",
    "Lillah Fund",
    "Construction Fund",
    "Student Sponsorship",
    "Iftar Fund"
  ];

  return (
    <div className="max-w-4xl mx-auto p-6 space-y-8 animate-in fade-in duration-500">
      
      <div className="flex items-center justify-between">
        <div>
           <h1 className="text-2xl font-bold text-slate-800 flex items-center gap-2">
             <HeartHandshake className="w-8 h-8 text-emerald-600" />
             Receive Donation
           </h1>
           <p className="text-slate-500 mt-1">Record a new contribution to the madrasa fund.</p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
         {/* Form Section */}
         <div className="lg:col-span-2 bg-white rounded-2xl border border-slate-200 shadow-sm p-6">
            <h3 className="text-lg font-bold text-slate-700 mb-6 border-b pb-2">Donor Details</h3>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
                <div className="space-y-2">
                    <label className="text-sm font-semibold text-slate-600">Donor Name</label>
                    <div className="relative">
                        <User className="absolute left-3 top-3 w-4 h-4 text-slate-400" />
                        <input 
                          type="text" 
                          className="w-full pl-10 pr-4 py-2 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-primary/20"
                          placeholder="e.g. Abdullah Al Mamun"
                          value={formData.donorName}
                          onChange={(e) => setFormData({...formData, donorName: e.target.value})}
                        />
                    </div>
                </div>

                <div className="space-y-2">
                    <label className="text-sm font-semibold text-slate-600">Phone Number</label>
                     <div className="relative">
                        <Phone className="absolute left-3 top-3 w-4 h-4 text-slate-400" />
                        <input 
                          type="text" 
                          className="w-full pl-10 pr-4 py-2 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-primary/20"
                          placeholder="017..."
                          value={formData.phone}
                          onChange={(e) => setFormData({...formData, phone: e.target.value})}
                        />
                    </div>
                </div>

                <div className="span-full md:col-span-2 space-y-2">
                    <label className="text-sm font-semibold text-slate-600">Address (Optional)</label>
                     <div className="relative">
                        <MapPin className="absolute left-3 top-3 w-4 h-4 text-slate-400" />
                        <input 
                          type="text" 
                          className="w-full pl-10 pr-4 py-2 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-primary/20"
                          placeholder="Village, Area..."
                           value={formData.address}
                          onChange={(e) => setFormData({...formData, address: e.target.value})}
                        />
                    </div>
                </div>
            </div>

            <h3 className="text-lg font-bold text-slate-700 mb-6 border-b pb-2 mt-8">Donation Details</h3>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                 <div className="space-y-2">
                    <label className="text-sm font-semibold text-slate-600">Amount (BDT)</label>
                    <div className="relative">
                        <span className="absolute left-4 top-2 text-lg font-bold text-slate-400">৳</span>
                        <input 
                          type="number" 
                          className="w-full pl-10 pr-4 py-2 text-xl font-bold text-slate-800 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-primary/20"
                          placeholder="0.00"
                           value={formData.amount}
                          onChange={(e) => setFormData({...formData, amount: e.target.value})}
                        />
                    </div>
                </div>

                <div className="space-y-2">
                    <label className="text-sm font-semibold text-slate-600">Fund Type</label>
                    <select 
                      className="w-full px-4 py-2.5 bg-white border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-primary/20 appearance-none"
                      value={formData.type}
                      onChange={(e) => setFormData({...formData, type: e.target.value})}
                    >
                        {donationTypes.map(t => <option key={t} value={t}>{t}</option>)}
                    </select>
                </div>

                <div className="space-y-2">
                    <label className="text-sm font-semibold text-slate-600">Payment Mode</label>
                    <div className="flex gap-4">
                        {['Cash', 'Bank Transfer', 'bKash/Nagad'].map(mode => (
                            <label key={mode} className={`
                                flex-1 py-2 text-center rounded-xl border cursor-pointer text-sm font-medium transition-all
                                ${formData.paymentMode === mode ? 'bg-emerald-50 border-emerald-500 text-emerald-700' : 'bg-white border-slate-200 text-slate-500 hover:border-slate-300'}
                            `}>
                                <input 
                                  type="radio" 
                                  name="paymentMode" 
                                  value={mode} 
                                  className="hidden" 
                                  checked={formData.paymentMode === mode}
                                  onChange={(e) => setFormData({...formData, paymentMode: e.target.value})}
                                />
                                {mode}
                            </label>
                        ))}
                    </div>
                </div>

                 <div className="space-y-2">
                    <label className="text-sm font-semibold text-slate-600">Date</label>
                    <div className="relative">
                       <Calendar className="absolute left-3 top-3 w-4 h-4 text-slate-400" />
                       <input 
                         type="date"
                         className="w-full pl-10 pr-4 py-2 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-primary/20"
                         value={formData.date}
                         onChange={(e) => setFormData({...formData, date: e.target.value})}
                       />
                    </div>
                </div>
            </div>

            <div className="mt-8 flex items-center justify-end gap-4">
                <button className="px-6 py-2.5 text-slate-500 font-semibold hover:bg-slate-50 rounded-xl transition-all">Cancel</button>
                <button className="px-8 py-2.5 bg-primary text-white font-bold rounded-xl shadow-lg shadow-primary/20 hover:scale-105 transition-transform flex items-center gap-2">
                    <Save className="w-5 h-5" />
                    Save Record
                </button>
            </div>
         </div>

         {/* Receipt Preview Section (Right Side) */}
         <div className="space-y-6">
             <div className="bg-white p-6 rounded-none border border-slate-200 relative shadow-md" id="receipt-preview">
                 {/* Receipt Design */}
                 <div className="text-center border-b-2 border-slate-800 pb-4 mb-4 border-dashed">
                     <h2 className="text-xl font-black uppercase tracking-widest text-slate-900">MMS Madrasa</h2>
                     <p className="text-xs text-slate-500">Official Donation Receipt</p>
                 </div>
                 
                 <div className="space-y-3 text-sm">
                     <div className="flex justify-between">
                         <span className="text-slate-500">Date:</span>
                         <span className="font-mono font-bold">{formData.date}</span>
                     </div>
                     <div className="flex justify-between">
                         <span className="text-slate-500">Receipt #:</span>
                         <span className="font-mono font-bold">DON-8821</span>
                     </div>
                 </div>

                 <div className="my-6 border-y border-slate-100 py-4 space-y-2">
                     <p className="text-xs text-slate-500 uppercase tracking-wider">Received From</p>
                     <p className="font-bold text-lg text-slate-800">{formData.donorName || "Guest Donor"}</p>
                     <p className="text-sm text-slate-500">{formData.phone}</p>
                 </div>

                 <div className="bg-emerald-50 p-4 rounded-xl border border-emerald-100 text-center mb-6">
                     <p className="text-xs font-bold text-emerald-600 uppercase mb-1">Amount Received</p>
                     <p className="text-3xl font-black text-emerald-700">৳ {formData.amount || "0"}</p>
                     <p className="text-[10px] text-emerald-500 mt-1 uppercase font-bold">{formData.type}</p>
                 </div>

                 <div className="text-xs text-center text-slate-400 italic">
                     May Allah accept your donation and bless you abundantly.
                 </div>

                  {/* Hole punch circles visual */}
                 <div className="absolute -left-3 top-1/2 w-6 h-6 bg-slate-50 rounded-full"></div>
                 <div className="absolute -right-3 top-1/2 w-6 h-6 bg-slate-50 rounded-full"></div>
             </div>

             <button className="w-full py-3 bg-slate-800 text-white font-bold rounded-xl shadow-lg flex items-center justify-center gap-2 hover:bg-slate-900 transition-all">
                 <Printer className="w-5 h-5" />
                 Print Receipt
             </button>
         </div>

      </div>
    </div>
  );
};

export default DonationEntry;
