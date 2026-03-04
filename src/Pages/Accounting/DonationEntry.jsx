import React, { useState } from 'react';
import { 
  HeartHandshake, 
  Printer, 
  Save, 
  User, 
  Phone, 
  MapPin, 
  Banknote,
  Calendar,
  Plus,
  X 
} from 'lucide-react';
import { useTranslation } from 'react-i18next';
import SelectInputField from '../../components/SelectInputField';
import InputField from '../../components/InputField';
import Voucher from '../../components/Voucher';
import accountantService from '../../services/accountantService';

const DonationEntry = () => {
  const { t } = useTranslation();
  const [formData, setFormData] = useState({
    donorName: '',
    phone: '',
    address: '',
    amount: '',
    type: 'general',
    paymentMode: 'Cash',
    remarks: '',
    date: new Date().toISOString().split('T')[0]
  });

  const [donationTypes, setDonationTypes] = useState([
    "general",
    "zakat",
    "lillah",
    "construction",
    "sponsorship",
    "iftar"
  ]);

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [showVoucher, setShowVoucher] = useState(false);
  const [newFundName, setNewFundName] = useState('');

  const handleAddFundType = (e) => {
    e.preventDefault();
    if (newFundName.trim() && !donationTypes.includes(newFundName.trim())) {
      setDonationTypes([...donationTypes, newFundName.trim()]);
      setFormData({ ...formData, type: newFundName.trim() });
      setNewFundName('');
      setIsModalOpen(false);
    }
  };

  const getFundLabel = (type) => {
    const key = `donation_page.types.${type}`;
    const translated = t(key);
    return translated === key ? type : translated;
  };

  const handleSave = async (e) => {
    e.preventDefault();
    if (!formData.amount || !formData.donorName) {
        alert("Please fill in the required fields");
        return;
    }
    
    try {
        await accountantService.addDonation(formData);
        alert("Donation saved successfully!");
        setFormData({
            donorName: '',
            phone: '',
            address: '',
            amount: '',
            type: 'general',
            paymentMode: 'Cash',
            remarks: '',
            date: formData.date
        });
    } catch (err) {
        alert("Error saving donation: " + (err.response?.data?.error || err.message));
    }
  };

  return (
    <div className="max-w-4xl mx-auto p-6 space-y-8 animate-in fade-in duration-500 relative">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold text-slate-800 flex items-center gap-2">
          <HeartHandshake className="w-8 h-8 text-emerald-600" />
          {t('donation_page.title')}
        </h1>
        <button
          onClick={() => setIsModalOpen(true)}
          className="px-8 py-3 bg-primary text-white font-bold rounded-xl shadow-lg shadow-primary/20 hover:scale-[1.02] active:scale-[0.98] transition-all w-full md:w-auto cursor-pointer flex items-center justify-center gap-2"
        >
          <Plus className="w-5 h-5" />
          {t('donation_page.add_type')}
        </button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
         <div className="lg:col-span-2 bg-white rounded-2xl border border-slate-200 shadow-sm p-6">
            <h3 className="text-lg font-bold text-slate-700 mb-6 border-b pb-2">{t('donation_page.donor_details')}</h3>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
                <div className="space-y-2">
                    <label className="text-sm font-semibold text-slate-600">{t('donation_page.donor_name')}</label>
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
                    <label className="text-sm font-semibold text-slate-600">{t('donation_page.phone')}</label>
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
                    <label className="text-sm font-semibold text-slate-600">{t('donation_page.address_opt')}</label>
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

            <h3 className="text-lg font-bold text-slate-700 mb-6 border-b pb-2 mt-8">{t('donation_page.donation_details')}</h3>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                 <div className="space-y-2">
                    <label className="text-sm font-semibold text-slate-600">{t('donation_page.amount_bdt')}</label>
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
                    <label className="text-sm font-semibold text-slate-600">{t('donation_page.fund_type')}</label>
                    <select 
                      className="w-full px-4 py-2.5 bg-white border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-primary/20 appearance-none font-bold text-slate-700"
                      value={formData.type}
                      onChange={(e) => setFormData({...formData, type: e.target.value})}
                    >
                        {donationTypes.map(t_item => <option key={t_item} value={t_item}>{getFundLabel(t_item)}</option>)}
                    </select>
                </div>

                <SelectInputField 
                  title={t('donation_page.payment_mode')} 
                  options={[
                    { value: "Cash" },
                    { value: "Bkash" },
                    { value: "Nagad" }
                  ]}
                  value={formData.paymentMode}
                  onChange={(val) => setFormData({...formData, paymentMode: val})}
                />
                <InputField 
                  title={t('donation_page.date')} 
                  type={'date'}
                  value={formData.date}
                  onChange={(val) => setFormData({...formData, date: val})}
                />
            </div>

            <div className="mt-8 flex items-center justify-end gap-4">
                <button 
                    onClick={() => setFormData({...formData, donorName: '', amount: '', phone: '', address: '', remarks: ''})}
                    className="px-6 py-2.5 text-slate-500 font-semibold hover:bg-slate-50 rounded-xl transition-all"
                >
                    {t('common.cancel')}
                </button>
                <button 
                    onClick={handleSave}
                    className="px-8 py-2.5 bg-primary text-white font-bold rounded-xl shadow-lg shadow-primary/20 hover:scale-105 transition-transform flex items-center gap-2"
                >
                    <Save className="w-5 h-5" />
                    {t('donation_page.save_record')}
                </button>
            </div>
         </div>

         <div className="space-y-6">
             <div className="bg-white p-6 rounded-none border border-slate-200 relative shadow-md">
                 <div className="text-center border-b-2 border-slate-800 pb-4 mb-4 border-dashed">
                     <h2 className="text-xl font-black uppercase tracking-widest text-slate-900">MMS Madrasa</h2>
                     <p className="text-xs text-slate-500">{t('donation_page.receipt')}</p>
                 </div>
                 <div className="space-y-3 text-sm">
                     <div className="flex justify-between">
                         <span className="text-slate-500">{t('donation_page.date')}:</span>
                         <span className="font-mono font-bold">{formData.date}</span>
                     </div>
                     <div className="flex justify-between">
                         <span className="text-slate-500">{t('donation_page.receipt_no')}</span>
                         <span className="font-mono font-bold">DON-8821</span>
                     </div>
                 </div>
                 <div className="my-6 border-y border-slate-100 py-4 space-y-2">
                     <p className="text-xs text-slate-500 uppercase tracking-wider">{t('donation_page.received_from')}</p>
                     <p className="font-bold text-lg text-slate-800">{formData.donorName || "Guest Donor"}</p>
                     <p className="text-sm text-slate-500">{formData.phone}</p>
                 </div>
                 <div className="bg-emerald-50 p-4 rounded-xl border border-emerald-100 text-center mb-6">
                     <p className="text-xs font-bold text-emerald-600 uppercase mb-1">{t('donation_page.amount_received')}</p>
                     <p className="text-3xl font-black text-emerald-700">৳ {formData.amount || "0"}</p>
                     <p className="text-[10px] text-emerald-500 mt-1 uppercase font-bold">{getFundLabel(formData.type)}</p>
                 </div>
                 <div className="text-xs text-center text-slate-400 italic">
                     {t('donation_page.prayer')}
                 </div>
             </div>
             <button 
                onClick={() => setShowVoucher(true)}
                className="w-full py-3 bg-slate-800 text-white font-bold rounded-xl shadow-lg flex items-center justify-center gap-2 hover:bg-slate-900 transition-all cursor-pointer"
             >
                 <Printer className="w-5 h-5" />
                 {t('donation_page.print')}
             </button>
         </div>
      </div>

      {showVoucher && (
        <Voucher 
          data={{
            receiptNo: `DON-${Math.floor(Math.random() * 9000) + 1000}`,
            date: formData.date,
            donorName: formData.donorName || "Guest Donor",
            amount: formData.amount,
            purpose: `${getFundLabel(formData.type)} donation`,
            amountInWords: "" 
          }}
          onClose={() => setShowVoucher(false)}
        />
      )}

      {isModalOpen && (
        <div className="fixed inset-0 z-[150] flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm animate-in fade-in duration-300">
          <div className="bg-white w-full max-w-md rounded-2xl shadow-2xl overflow-hidden relative">
            <div className="p-6 bg-slate-50 border-b flex justify-between items-center">
              <h1 className="text-xl font-bold text-slate-800 flex items-center gap-2">
                {t('donation_page.add_fund')}
              </h1>
              <button onClick={() => setIsModalOpen(false)} className="text-slate-400 hover:text-slate-600 transition-colors">
                <X className="w-6 h-6" />
              </button>
            </div>
            <form onSubmit={handleAddFundType} className="p-6 space-y-6">
              <div className="space-y-2">
                <label className="text-sm font-semibold text-slate-600">{t('donation_page.fund_name')}</label>
                <input 
                  type="text" 
                  autoFocus
                  className="w-full px-4 py-3 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-primary/20 font-bold text-slate-700"
                  placeholder="e.g. Crisis Relief Fund"
                  value={newFundName}
                  onChange={(e) => setNewFundName(e.target.value)}
                />
              </div>
              <div className="flex gap-3">
                <button type="button" onClick={() => setIsModalOpen(false)} className="flex-1 py-3 bg-slate-100 text-slate-600 font-bold rounded-xl hover:bg-slate-200 transition-all">
                  {t('common.cancel')}
                </button>
                <button type="submit" className="flex-1 py-3 bg-primary text-white font-bold rounded-xl shadow-lg shadow-primary/20 hover:scale-[1.02] active:scale-[0.98] transition-all">
                  {t('donation_page.add_fund')}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default DonationEntry;
