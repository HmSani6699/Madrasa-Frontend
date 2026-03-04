import { useState } from "react";
import Modal from "./Modal";
import { Loader2, Plus } from "lucide-react";
import adminService from "../services/adminService";

const AddMadrasaModal = ({ isOpen, onClose }) => {
  const [formData, setFormData] = useState({
    name: "",
    address: "",
    adminName: "",
    email: "",
    adminPassword: "",
    phone: "",
    plan: "standard", // basic, standard, premium
 
  });
  const [loading, setLoading] = useState(false);

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
        plan: "standard",
       
      });
      alert("Madrasa created successfully!");
    } catch (err) {
      setLoading(false);
      alert(err.response?.data?.message || "Failed to create madrasa.");
    }
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose} title="Add New Madrasa">
      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Madrasa Name</label>
          <input
            type="text"
            required
            className="w-full px-4 py-2 rounded-xl border border-gray-200 outline-none focus:border-primary focus:ring-2 focus:ring-primary/20 transition-all"
            placeholder="e.g. Jamia Islamia"
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

        <div className="grid grid-cols-2 gap-4">
            <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Admin Name</label>
                <input
                    type="text"
                    required
                    className="w-full px-4 py-2 rounded-xl border border-gray-200 outline-none focus:border-primary focus:ring-2 focus:ring-primary/20 transition-all"
                    placeholder="Muhtamim Name"
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
                    placeholder="+880 1XXX..."
                    value={formData.phone}
                    onChange={(e) => setFormData({...formData, phone: e.target.value})}
                />
            </div>
        </div>

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
            placeholder="Set a password for the admin"
            value={formData.adminPassword}
            onChange={(e) => setFormData({...formData, adminPassword: e.target.value})}
          />
        </div>
        
        <div>
           <label className="block text-sm font-medium text-gray-700 mb-1">Subscription Plan</label>
           <select 
             className="w-full px-4 py-2 rounded-xl border border-gray-200 outline-none focus:border-primary focus:ring-2 focus:ring-primary/20 transition-all bg-white"
             value={formData.plan}
             onChange={(e) => setFormData({...formData, plan: e.target.value})}
           >
               <option value="basic">Basic (Free)</option>
               <option value="standard">Standard (Paid)</option>
               <option value="premium">Premium (Enterprise)</option>
           </select>
        </div>
      

        <div className="pt-4 flex gap-3">
            <button 
                type="button" 
                onClick={onClose}
                className="flex-1 px-4 py-2 rounded-xl border border-gray-200 text-gray-600 hover:bg-gray-50 font-medium transition-colors"
            >
                Cancel
            </button>
            <button 
                type="submit" 
                disabled={loading}
                className="flex-1 bg-primary hover:bg-primary-dark text-white rounded-xl font-medium shadow-lg shadow-primary/25 flex items-center justify-center gap-2 transition-all active:scale-95 disabled:opacity-70 disabled:cursor-not-allowed"
            >
                {loading ? <Loader2 className="w-5 h-5 animate-spin" /> : "Create Madrasa"}
            </button>
        </div>
      </form>
    </Modal>
  );
};

export default AddMadrasaModal;
