import { useState, useEffect } from "react";
import { Search, Plus, Edit, Trash2, Layers, Check, ShieldAlert, Loader2, DollarSign, Users, Award, AlignLeft } from "lucide-react";
import adminService from "../../services/adminService";
import toast from "react-hot-toast";

const PlanList = () => {
  const [plans, setPlans] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");

  // Modals state
  const [isAddOpen, setIsAddOpen] = useState(false);
  const [isEditOpen, setIsEditOpen] = useState(false);
  const [isDeleteOpen, setIsDeleteOpen] = useState(false);
  const [selectedPlan, setSelectedPlan] = useState(null);

  // Form states
  const [formData, setFormData] = useState({
    name: "",
    priceMonthly: "",
    priceYearly: "",
    studentLimit: "",
    description: "",
    featuresText: "" // newline separated features
  });

  useEffect(() => {
    fetchPlans();
  }, []);

  const fetchPlans = async () => {
    try {
      setLoading(true);
      const res = await adminService.getPlans();
      setPlans(res.data || []);
    } catch (err) {
      console.error("Failed to fetch plans", err);
      toast.error("Failed to fetch subscription plans.");
    } finally {
      setLoading(false);
    }
  };

  const handleOpenAdd = () => {
    setFormData({
      name: "",
      priceMonthly: "",
      priceYearly: "",
      studentLimit: "",
      description: "",
      featuresText: ""
    });
    setIsAddOpen(true);
  };

  const handleOpenEdit = (plan) => {
    setSelectedPlan(plan);
    setFormData({
      name: plan.name,
      priceMonthly: plan.priceMonthly,
      priceYearly: plan.priceYearly,
      studentLimit: plan.studentLimit,
      description: plan.description || "",
      featuresText: plan.features ? plan.features.join("\n") : ""
    });
    setIsEditOpen(true);
  };

  const handleOpenDelete = (plan) => {
    setSelectedPlan(plan);
    setIsDeleteOpen(true);
  };

  const handleAddSubmit = async (e) => {
    e.preventDefault();
    try {
      const payload = {
        name: formData.name,
        priceMonthly: Number(formData.priceMonthly),
        priceYearly: Number(formData.priceYearly),
        studentLimit: Number(formData.studentLimit),
        description: formData.description,
        features: formData.featuresText.split("\n").map(f => f.trim()).filter(Boolean)
      };

      await adminService.createPlan(payload);
      toast.success("Subscription plan created successfully!");
      setIsAddOpen(false);
      fetchPlans();
    } catch (err) {
      toast.error(err.response?.data?.message || "Failed to create plan.");
    }
  };

  const handleEditSubmit = async (e) => {
    e.preventDefault();
    try {
      const payload = {
        name: formData.name,
        priceMonthly: Number(formData.priceMonthly),
        priceYearly: Number(formData.priceYearly),
        studentLimit: Number(formData.studentLimit),
        description: formData.description,
        features: formData.featuresText.split("\n").map(f => f.trim()).filter(Boolean)
      };

      await adminService.updatePlan(selectedPlan._id, payload);
      toast.success("Subscription plan updated successfully!");
      setIsEditOpen(false);
      fetchPlans();
    } catch (err) {
      toast.error(err.response?.data?.message || "Failed to update plan.");
    }
  };

  const handleDeleteSubmit = async () => {
    try {
      await adminService.deletePlan(selectedPlan._id);
      toast.success("Subscription plan deleted successfully!");
      setIsDeleteOpen(false);
      fetchPlans();
    } catch (err) {
      toast.error(err.response?.data?.message || "Failed to delete plan.");
    }
  };

  const filteredPlans = plans.filter(plan =>
    plan.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    plan.description?.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="space-y-6 animate-fade-in">
      {/* Header section */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-gray-900 flex items-center gap-2">
            <Layers className="w-6 h-6 text-primary" /> SaaS Subscription Plans
          </h1>

        </div>

        <div className="flex flex-wrap gap-3">

          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
            <input
              type="text"
              placeholder="Search plans..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-9 pr-4 py-2.5 rounded-xl border border-gray-200 bg-white outline-none focus:border-primary focus:ring-2 focus:ring-primary/20 w-full sm:w-64 shadow-sm"
            />
          </div>
          <button
            onClick={handleOpenAdd}
            className="bg-primary hover:bg-primary-dark text-white px-5 py-2.5 rounded-xl font-medium shadow-lg shadow-primary/25 flex items-center gap-2 transition-all active:scale-95 cursor-pointer"
          >
            <Plus className="w-5 h-5" />
            Add Dynamic Plan
          </button>


        </div>
      </div>

      {/* Plan Grid */}
      {loading ? (
        <div className="flex flex-col items-center justify-center p-20 space-y-4">
          <Loader2 className="w-10 h-10 text-primary animate-spin" />
          <p className="text-gray-500 text-sm">Fetching subscriptions data...</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredPlans.map((plan) => (
            <div
              key={plan._id}
              className="bg-white  rounded-2xl p-6 shadow-lg flex flex-col justify-between hover:shadow-md transition-all duration-300 relative overflow-hidden group"
            >
              {/* Premium Gradient bar */}
              <div className="absolute top-0 inset-x-0 h-1.5 bg-gradient-to-r from-primary to-indigo-500 transform scale-x-0 group-hover:scale-x-100 transition-transform origin-left duration-300"></div>

              <div>
                {/* Title & Limits */}
                <div className="flex justify-between items-start mb-3">
                  <div>
                    <h3 className="text-xl font-bold text-gray-900 group-hover:text-primary transition-colors">{plan.name}</h3>
                    <p className="text-xs text-gray-400 mt-0.5 flex items-center gap-1">
                      <Users className="w-3 h-3 text-primary" /> Max {plan.studentLimit} Students
                    </p>
                  </div>
                  <span className="bg-primary/10 text-primary border border-primary/20 text-xs font-bold px-2.5 py-1 rounded-lg">
                    {plan.studentLimit} Limit
                  </span>
                </div>

                {/* Description */}
                <p className="text-gray-500 text-sm mb-4 min-h-[40px] leading-relaxed">
                  {plan.description || "No description provided."}
                </p>

                {/* Rates */}
                <div className="bg-gray-50 rounded-xl p-4 border border-gray-100 grid grid-cols-2 gap-4 mb-4">
                  <div>
                    <p className="text-[10px] text-gray-400 font-semibold uppercase tracking-wider">Monthly Rate</p>
                    <p className="text-lg font-extrabold text-gray-900">{plan.priceMonthly} TK</p>
                  </div>
                  <div>
                    <p className="text-[10px] text-gray-400 font-semibold uppercase tracking-wider">Yearly Rate</p>
                    <p className="text-lg font-extrabold text-indigo-600">{plan.priceYearly} TK</p>
                  </div>
                </div>

                {/* Features */}
                <div className="space-y-2 mb-6">
                  <p className="text-xs font-bold text-gray-400 uppercase tracking-widest">Included Features</p>
                  {plan.features && plan.features.length > 0 ? (
                    <ul className="space-y-1.5">
                      {plan.features.slice(0, 5).map((feat, idx) => (
                        <li key={idx} className="text-xs text-gray-600 flex items-center gap-2">
                          <Check className="w-3.5 h-3.5 text-emerald-500 shrink-0" />
                          <span className="truncate">{feat}</span>
                        </li>
                      ))}
                      {plan.features.length > 5 && (
                        <li className="text-[11px] text-primary font-medium pl-5">
                          + {plan.features.length - 5} more features
                        </li>
                      )}
                    </ul>
                  ) : (
                    <p className="text-xs text-gray-400 italic">No specific features configured.</p>
                  )}
                </div>
              </div>

              {/* Actions Footer */}
              <div className="border-t border-gray-100 pt-4 flex gap-2 mt-auto">
                <button
                  onClick={() => handleOpenEdit(plan)}
                  className="flex-1 py-2 px-3 border border-gray-200 text-gray-700 hover:border-primary hover:text-primary rounded-xl text-xs font-semibold flex items-center justify-center gap-1.5 transition-colors cursor-pointer"
                >
                  <Edit className="w-3.5 h-3.5" /> Edit
                </button>
                <button
                  onClick={() => handleOpenDelete(plan)}
                  className="py-2 px-3 border border-red-100 text-red-500 hover:bg-red-50 rounded-xl text-xs font-semibold flex items-center justify-center gap-1.5 transition-colors cursor-pointer"
                >
                  <Trash2 className="w-3.5 h-3.5" />
                </button>
              </div>
            </div>
          ))}

          {filteredPlans.length === 0 && (
            <div className="col-span-full bg-white border border-gray-100 rounded-2xl p-10 text-center text-gray-500">
              No subscription plans matching your filter.
            </div>
          )}
        </div>
      )}

      {/* ================= ADD MODAL ================= */}
      {isAddOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm animate-fade-in">
          <div className="bg-white rounded-2xl shadow-xl border border-gray-100 max-w-lg w-full p-6 space-y-4 animate-scale-up">
            <div className="flex items-center gap-2 pb-2 border-b border-gray-100">
              <Award className="w-5 h-5 text-primary" />
              <h2 className="text-xl font-bold text-gray-900">Add Subscription Plan</h2>
            </div>

            <form onSubmit={handleAddSubmit} className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Plan Name</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Platinum"
                  className="w-full px-4 py-2 rounded-xl border border-gray-200 outline-none focus:border-primary focus:ring-2 focus:ring-primary/20 transition-all"
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1 flex items-center gap-1">
                    <DollarSign className="w-3.5 h-3.5 text-primary" /> Monthly Price (BDT)
                  </label>
                  <input
                    type="number"
                    required
                    placeholder="999"
                    className="w-full px-4 py-2 rounded-xl border border-gray-200 outline-none focus:border-primary focus:ring-2 focus:ring-primary/20 transition-all"
                    value={formData.priceMonthly}
                    onChange={(e) => setFormData({ ...formData, priceMonthly: e.target.value })}
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1 flex items-center gap-1">
                    <DollarSign className="w-3.5 h-3.5 text-indigo-500" /> Yearly Price (BDT)
                  </label>
                  <input
                    type="number"
                    required
                    placeholder="9990"
                    className="w-full px-4 py-2 rounded-xl border border-gray-200 outline-none focus:border-primary focus:ring-2 focus:ring-primary/20 transition-all"
                    value={formData.priceYearly}
                    onChange={(e) => setFormData({ ...formData, priceYearly: e.target.value })}
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1 flex items-center gap-1">
                    <Users className="w-3.5 h-3.5 text-primary" /> Student Capacity Limit
                  </label>
                  <input
                    type="number"
                    required
                    placeholder="150"
                    className="w-full px-4 py-2 rounded-xl border border-gray-200 outline-none focus:border-primary focus:ring-2 focus:ring-primary/20 transition-all"
                    value={formData.studentLimit}
                    onChange={(e) => setFormData({ ...formData, studentLimit: e.target.value })}
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1 flex items-center gap-1">
                    <AlignLeft className="w-3.5 h-3.5 text-primary" /> Short Description
                  </label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. Best for large Madrasas"
                    className="w-full px-4 py-2 rounded-xl border border-gray-200 outline-none focus:border-primary focus:ring-2 focus:ring-primary/20 transition-all"
                    value={formData.description}
                    onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Features List (One feature per line)
                </label>
                <textarea
                  rows={4}
                  placeholder="Admin Dashboard&#10;Teacher Dashboard&#10;Attendance Manager"
                  className="w-full px-4 py-2 rounded-xl border border-gray-200 outline-none focus:border-primary focus:ring-2 focus:ring-primary/20 transition-all font-mono text-xs"
                  value={formData.featuresText}
                  onChange={(e) => setFormData({ ...formData, featuresText: e.target.value })}
                ></textarea>
              </div>

              <div className="pt-4 flex gap-3 border-t border-gray-100">
                <button
                  type="button"
                  onClick={() => setIsAddOpen(false)}
                  className="flex-1 px-4 py-2 rounded-xl border border-gray-200 text-gray-600 hover:bg-gray-50 font-medium transition-colors cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="flex-1 bg-primary hover:bg-primary-dark text-white rounded-xl font-medium shadow-lg shadow-primary/25 transition-all active:scale-95 cursor-pointer"
                >
                  Save Plan
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* ================= EDIT MODAL ================= */}
      {isEditOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm animate-fade-in">
          <div className="bg-white rounded-2xl shadow-xl border border-gray-100 max-w-lg w-full p-6 space-y-4 animate-scale-up">
            <div className="flex items-center gap-2 pb-2 border-b border-gray-100">
              <Award className="w-5 h-5 text-primary" />
              <h2 className="text-xl font-bold text-gray-900">Edit Plan: {selectedPlan?.name}</h2>
            </div>

            <form onSubmit={handleEditSubmit} className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Plan Name</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Platinum"
                  className="w-full px-4 py-2 rounded-xl border border-gray-200 outline-none focus:border-primary focus:ring-2 focus:ring-primary/20 transition-all"
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1 flex items-center gap-1">
                    <DollarSign className="w-3.5 h-3.5 text-primary" /> Monthly Price (BDT)
                  </label>
                  <input
                    type="number"
                    required
                    placeholder="999"
                    className="w-full px-4 py-2 rounded-xl border border-gray-200 outline-none focus:border-primary focus:ring-2 focus:ring-primary/20 transition-all"
                    value={formData.priceMonthly}
                    onChange={(e) => setFormData({ ...formData, priceMonthly: e.target.value })}
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1 flex items-center gap-1">
                    <DollarSign className="w-3.5 h-3.5 text-indigo-500" /> Yearly Price (BDT)
                  </label>
                  <input
                    type="number"
                    required
                    placeholder="9990"
                    className="w-full px-4 py-2 rounded-xl border border-gray-200 outline-none focus:border-primary focus:ring-2 focus:ring-primary/20 transition-all"
                    value={formData.priceYearly}
                    onChange={(e) => setFormData({ ...formData, priceYearly: e.target.value })}
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1 flex items-center gap-1">
                    <Users className="w-3.5 h-3.5 text-primary" /> Student Capacity Limit
                  </label>
                  <input
                    type="number"
                    required
                    placeholder="150"
                    className="w-full px-4 py-2 rounded-xl border border-gray-200 outline-none focus:border-primary focus:ring-2 focus:ring-primary/20 transition-all"
                    value={formData.studentLimit}
                    onChange={(e) => setFormData({ ...formData, studentLimit: e.target.value })}
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1 flex items-center gap-1">
                    <AlignLeft className="w-3.5 h-3.5 text-primary" /> Short Description
                  </label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. Best for large Madrasas"
                    className="w-full px-4 py-2 rounded-xl border border-gray-200 outline-none focus:border-primary focus:ring-2 focus:ring-primary/20 transition-all"
                    value={formData.description}
                    onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Features List (One feature per line)
                </label>
                <textarea
                  rows={4}
                  placeholder="Admin Dashboard&#10;Teacher Dashboard&#10;Attendance Manager"
                  className="w-full px-4 py-2 rounded-xl border border-gray-200 outline-none focus:border-primary focus:ring-2 focus:ring-primary/20 transition-all font-mono text-xs"
                  value={formData.featuresText}
                  onChange={(e) => setFormData({ ...formData, featuresText: e.target.value })}
                ></textarea>
              </div>

              <div className="pt-4 flex gap-3 border-t border-gray-100">
                <button
                  type="button"
                  onClick={() => setIsEditOpen(false)}
                  className="flex-1 px-4 py-2 rounded-xl border border-gray-200 text-gray-600 hover:bg-gray-50 font-medium transition-colors cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="flex-1 bg-primary hover:bg-primary-dark text-white rounded-xl font-medium shadow-lg shadow-primary/25 transition-all active:scale-95 cursor-pointer"
                >
                  Save Changes
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* ================= DELETE CONFIRMATION ================= */}
      {isDeleteOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm animate-fade-in">
          <div className="bg-white rounded-2xl shadow-xl border border-gray-100 max-w-sm w-full p-6 space-y-4 text-center animate-scale-up">
            <div className="w-12 h-12 bg-red-50 text-red-500 rounded-full flex items-center justify-center mx-auto border border-red-100">
              <ShieldAlert className="w-6 h-6" />
            </div>

            <div>
              <h3 className="text-lg font-bold text-gray-900">Delete Subscription Plan</h3>
              <p className="text-gray-500 text-sm mt-1">
                Are you sure you want to delete plan <span className="font-semibold text-gray-800">"{selectedPlan?.name}"</span>?
                This action is irreversible.
              </p>
            </div>

            <div className="flex gap-3">
              <button
                onClick={() => setIsDeleteOpen(false)}
                className="flex-1 py-2 rounded-xl border border-gray-200 text-gray-600 hover:bg-gray-50 font-medium transition-colors cursor-pointer"
              >
                Cancel
              </button>
              <button
                onClick={handleDeleteSubmit}
                className="flex-1 bg-red-500 hover:bg-red-600 text-white rounded-xl font-medium shadow-lg shadow-red-500/20 transition-all active:scale-95 cursor-pointer"
              >
                Yes, Delete
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default PlanList;
