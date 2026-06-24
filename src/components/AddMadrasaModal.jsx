import { useState, useEffect } from "react";
import Modal from "./Modal";
import { Loader2, Plus, Calendar, DollarSign, Activity, Users } from "lucide-react";
import adminService from "../services/adminService";
import toast from "react-hot-toast";

const AddMadrasaModal = ({ isOpen, onClose }) => {
  const [plans, setPlans] = useState([]);
  const [formData, setFormData] = useState({
    name: "",
    address: "",
    adminName: "",
    email: "",
    adminPassword: "",
    phone: "",
    plan: "basic",
    billingCycle: "monthly",
    price: 999,
    studentLimit: 150,
    nextBillingDate: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString().split('T')[0]
  });
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const fetchPlans = async () => {
      try {
        const res = await adminService.getPlans();
        const plansList = res.data || [];
        setPlans(plansList);
        if (plansList.length > 0) {
          const firstPlan = plansList[0];
          setFormData(prev => ({
            ...prev,
            plan: firstPlan.name.toLowerCase(),
            price: firstPlan.priceMonthly,
            studentLimit: firstPlan.studentLimit
          }));
        }
      } catch (err) {
        console.error("Failed to load plans", err);
      }
    };
    if (isOpen) {
      fetchPlans();
    }
  }, [isOpen]);

  const handlePlanOrCycleChange = (updatedField, value) => {
    const updatedForm = { ...formData, [updatedField]: value };
    const pName = updatedForm.plan.toLowerCase();
    const cycle = updatedForm.billingCycle.toLowerCase();
    
    const matchedPlan = plans.find(pl => pl.name.toLowerCase() === pName) || plans[0];
    
    let basePrice = 999;
    let limit = 150;
    if (matchedPlan) {
      basePrice = cycle === 'monthly' ? matchedPlan.priceMonthly : matchedPlan.priceYearly;
      limit = matchedPlan.studentLimit;
    }

    const days = cycle === 'yearly' ? 365 : 30;
    const futureDate = new Date(Date.now() + days * 24 * 60 * 60 * 1000).toISOString().split('T')[0];

    setFormData({
      ...updatedForm,
      price: basePrice,
      studentLimit: limit,
      nextBillingDate: futureDate
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    
    try {
      // Map frontend fields to backend expected names
      const payload = {
        madrasaName: formData.name,
        address: formData.address,
        adminName: formData.adminName,
        adminEmail: formData.email,
        adminPassword: formData.adminPassword,
        phone: formData.phone,
        plan: formData.plan,
        billingCycle: formData.billingCycle,
        price: Number(formData.price),
        studentLimit: Number(formData.studentLimit),
        nextBillingDate: formData.nextBillingDate
      };

      await adminService.createMadrasa(payload);
      setLoading(false);
      onClose();
      
      // Reset form
      setFormData({ 
        name: "", 
        address: "", 
        adminName: "", 
        email: "", 
        adminPassword: "",
        phone: "", 
        plan: plans.length > 0 ? plans[0].name.toLowerCase() : "basic",
        billingCycle: "monthly",
        price: plans.length > 0 ? plans[0].priceMonthly : 999,
        studentLimit: plans.length > 0 ? plans[0].studentLimit : 150,
        nextBillingDate: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString().split('T')[0]
      });

      toast.success('Madrasa and Admin created successfully!');

    } catch (err) {
      setLoading(false);
      toast.error(err.response?.data?.message || "Failed to create madrasa.");
    }
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose} title="Add New Madrasa (SaaS)">
      <form onSubmit={handleSubmit} className="space-y-4 max-h-[80vh] overflow-y-auto px-1">
        {/* Core Info */}
        <div className="bg-gray-50/50 p-4 rounded-2xl border border-gray-100 space-y-4">
          <h3 className="text-xs font-semibold text-gray-400 uppercase tracking-wider mb-2">Madrasa Information</h3>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Madrasa Name</label>
            <input
              type="text"
              required
              className="w-full px-4 py-2 rounded-xl border border-gray-200 outline-none focus:border-primary focus:ring-2 focus:ring-primary/20 transition-all"
              placeholder="e.g. Jamia Islamia Madrasa"
              value={formData.name}
              onChange={(e) => setFormData({...formData, name: e.target.value})}
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Address</label>
            <input
              type="text"
              required
              className="w-full px-4 py-2 rounded-xl border border-gray-200 outline-none focus:border-primary focus:ring-2 focus:ring-primary/20 transition-all"
              placeholder="e.g. 123 Madrasa Road, Dhaka"
              value={formData.address}
              onChange={(e) => setFormData({...formData, address: e.target.value})}
            />
          </div>
        </div>

        {/* Administrator Credentials */}
        <div className="bg-gray-50/50 p-4 rounded-2xl border border-gray-100 space-y-4">
          <h3 className="text-xs font-semibold text-gray-400 uppercase tracking-wider mb-2">Administrator Account</h3>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Admin Name</label>
              <input
                type="text"
                required
                className="w-full px-4 py-2 rounded-xl border border-gray-200 outline-none focus:border-primary focus:ring-2 focus:ring-primary/20 transition-all"
                placeholder="Muhtamim/Principal"
                value={formData.adminName}
                onChange={(e) => setFormData({...formData, adminName: e.target.value})}
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Phone Number</label>
              <input
                type="tel"
                required
                className="w-full px-4 py-2 rounded-xl border border-gray-200 outline-none focus:border-primary focus:ring-2 focus:ring-primary/20 transition-all"
                placeholder="01712XXXXXX"
                value={formData.phone}
                onChange={(e) => setFormData({...formData, phone: e.target.value})}
              />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Email Address</label>
              <input
                type="email"
                required
                className="w-full px-4 py-2 rounded-xl border border-gray-200 outline-none focus:border-primary focus:ring-2 focus:ring-primary/20 transition-all"
                placeholder="admin@madrasa.com"
                value={formData.email}
                onChange={(e) => setFormData({...formData, email: e.target.value})}
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Admin Password</label>
              <input
                type="password"
                required
                className="w-full px-4 py-2 rounded-xl border border-gray-200 outline-none focus:border-primary focus:ring-2 focus:ring-primary/20 transition-all"
                placeholder="Set secure password"
                value={formData.adminPassword}
                onChange={(e) => setFormData({...formData, adminPassword: e.target.value})}
              />
            </div>
          </div>
        </div>

        {/* Subscription Plan System */}
        <div className="bg-gray-50/50 p-4 rounded-2xl border border-gray-100 space-y-4">
          <h3 className="text-xs font-semibold text-gray-400 uppercase tracking-wider mb-2">SaaS Subscription Config</h3>
          
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1 flex items-center gap-1">
                <Activity className="w-3.5 h-3.5 text-primary" /> Plan Tier
              </label>
              <select 
                className="w-full px-4 py-2 rounded-xl border border-gray-200 outline-none focus:border-primary focus:ring-2 focus:ring-primary/20 transition-all bg-white cursor-pointer text-sm"
                value={formData.plan}
                onChange={(e) => handlePlanOrCycleChange('plan', e.target.value)}
              >
                {plans.map(p => (
                  <option key={p._id} value={p.name.toLowerCase()}>
                    {p.name} ({p.studentLimit} Students)
                  </option>
                ))}
                {plans.length === 0 && (
                  <option value="basic">Basic Plan (150 Students)</option>
                )}
              </select>
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Billing Cycle</label>
              <select 
                className="w-full px-4 py-2 rounded-xl border border-gray-200 outline-none focus:border-primary focus:ring-2 focus:ring-primary/20 transition-all bg-white cursor-pointer text-sm"
                value={formData.billingCycle}
                onChange={(e) => handlePlanOrCycleChange('billingCycle', e.target.value)}
              >
                <option value="monthly">Monthly Cycle</option>
                <option value="yearly">Yearly Cycle</option>
              </select>
            </div>
          </div>

          <div className="grid grid-cols-3 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1 flex items-center gap-1">
                <Users className="w-3.5 h-3.5 text-primary" /> Limit
              </label>
              <input
                type="number"
                disabled
                className="w-full px-4 py-2 rounded-xl border border-gray-200 outline-none bg-gray-100 text-gray-500 font-semibold"
                value={formData.studentLimit}
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1 flex items-center gap-1">
                <DollarSign className="w-3.5 h-3.5 text-primary" /> Price (BDT)
              </label>
              <input
                type="number"
                required
                className="w-full px-4 py-2 rounded-xl border border-gray-200 outline-none focus:border-primary focus:ring-2 focus:ring-primary/20 transition-all text-sm"
                value={formData.price}
                onChange={(e) => setFormData({...formData, price: Number(e.target.value)})}
              />
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1 flex items-center gap-1">
                <Calendar className="w-3.5 h-3.5 text-primary" /> Due Date
              </label>
              <input
                type="date"
                required
                className="w-full px-4 py-2 rounded-xl border border-gray-200 outline-none focus:border-primary focus:ring-2 focus:ring-primary/20 transition-all text-sm"
                value={formData.nextBillingDate}
                onChange={(e) => setFormData({...formData, nextBillingDate: e.target.value})}
              />
            </div>
          </div>
        </div>

        {/* Footer Actions */}
        <div className="pt-4 flex gap-3 border-t border-gray-100">
          <button 
            type="button" 
            onClick={onClose}
            className="flex-1 px-4 py-2 rounded-xl border border-gray-200 text-gray-600 hover:bg-gray-50 font-medium transition-colors cursor-pointer"
          >
            Cancel
          </button>
          <button 
            type="submit" 
            disabled={loading}
            className="flex-1 bg-primary hover:bg-primary-dark text-white rounded-xl font-medium shadow-lg shadow-primary/25 flex items-center justify-center gap-2 transition-all active:scale-95 disabled:opacity-70 disabled:cursor-not-allowed cursor-pointer"
          >
            {loading ? <Loader2 className="w-5 h-5 animate-spin" /> : "Create Madrasa"}
          </button>
        </div>
      </form>
    </Modal>
  );
};

export default AddMadrasaModal;
