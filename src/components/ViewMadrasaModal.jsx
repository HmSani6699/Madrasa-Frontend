import { ShieldCheck, ShieldAlert, MapPin, Users, Phone, Mail, User, BookOpen, Calendar, DollarSign, Award } from "lucide-react";
import Modal from "./Modal";

const ViewMadrasaModal = ({ isOpen, onClose, madrasa }) => {
  if (!madrasa) return null;

  const sub = madrasa.subscription || {};
  const planName = sub.plan 
    ? sub.plan.charAt(0).toUpperCase() + sub.plan.slice(1) 
    : madrasa.plan || "Basic";
  const billingCycle = sub.billingCycle 
    ? sub.billingCycle.charAt(0).toUpperCase() + sub.billingCycle.slice(1) 
    : "Monthly";
  const price = sub.price !== undefined ? sub.price : 999;
  const studentLimit = sub.studentLimit || 150;
  const studentCount = madrasa.students || 0;
  const capacityPercent = Math.min(100, Math.round((studentCount / studentLimit) * 100));

  const nextBillingDateFormatted = sub.nextBillingDate
    ? new Date(sub.nextBillingDate).toLocaleDateString("en-US", {
        year: "numeric",
        month: "long",
        day: "numeric",
      })
    : "N/A";

  return (
    <Modal isOpen={isOpen} onClose={onClose} title="Madrasa Profile & Subscription Details">
      <div className="space-y-6 max-h-[80vh] overflow-y-auto px-1">
        {/* Header Section */}
        <div className="flex items-start justify-between bg-gradient-to-r from-primary/5 to-transparent p-4 rounded-2xl border border-primary/10">
          <div>
            <h2 className="text-xl font-bold text-gray-900">{madrasa.name}</h2>
            <div className="flex flex-wrap items-center gap-2 mt-1">
              <span className={`inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-semibold border ${
                madrasa.status === 'Active' ? 'bg-emerald-50 text-emerald-700 border-emerald-100' :
                madrasa.status === 'Suspended' ? 'bg-amber-50 text-amber-700 border-amber-100' :
                'bg-rose-50 text-rose-700 border-rose-100'
              }`}>
                {madrasa.status === 'Active' ? <ShieldCheck className="w-3 h-3" /> : <ShieldAlert className="w-3 h-3" />}
                {madrasa.status}
              </span>
              <span className="text-gray-300">|</span>
              <span className="text-sm text-gray-500 flex items-center gap-1">
                <MapPin className="w-3 h-3" /> {madrasa.location}
              </span>
            </div>
          </div>
          <div className="w-12 h-12 bg-primary/10 rounded-full flex items-center justify-center text-primary font-bold text-lg border border-primary/20 shrink-0">
            {madrasa.name.charAt(0)}
          </div>
        </div>

        {/* Subscription Detail Card */}
        <div className="bg-white border border-gray-150 rounded-2xl p-4 shadow-sm space-y-4">
          <div className="flex items-center justify-between border-b border-gray-100 pb-3">
            <h3 className="font-bold text-gray-800 flex items-center gap-1.5">
              <Award className="w-5 h-5 text-primary" /> Active SaaS Subscription
            </h3>
            <span className="bg-primary/10 text-primary text-xs font-bold px-3 py-1 rounded-full border border-primary/20">
              {planName} Plan
            </span>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-1">
              <p className="text-xs text-gray-400 flex items-center gap-1"><DollarSign className="w-3 h-3" /> Rate / Cycle</p>
              <p className="text-sm font-bold text-gray-800">{price} BDT <span className="text-xs font-normal text-gray-400">({billingCycle})</span></p>
            </div>
            
            <div className="space-y-1">
              <p className="text-xs text-gray-400 flex items-center gap-1"><Calendar className="w-3 h-3" /> Next Payment Due</p>
              <p className="text-sm font-bold text-gray-800">{nextBillingDateFormatted}</p>
            </div>
          </div>

          {/* Capacity Progress bar */}
          <div className="space-y-1 pt-2">
            <div className="flex justify-between text-xs">
              <span className="text-gray-400 font-medium flex items-center gap-1">
                <Users className="w-3 h-3" /> Student Capacity Usage
              </span>
              <span className="font-semibold text-gray-700">{studentCount} / {studentLimit} ({capacityPercent}%)</span>
            </div>
            <div className="w-full bg-gray-100 h-2.5 rounded-full overflow-hidden">
              <div 
                className={`h-full rounded-full transition-all duration-500 ${
                  capacityPercent > 90 ? 'bg-rose-500' :
                  capacityPercent > 75 ? 'bg-amber-500' :
                  'bg-primary'
                }`}
                style={{ width: `${capacityPercent}%` }}
              ></div>
            </div>
          </div>
        </div>

        {/* Info Grid */}
        <div className="bg-gray-50/50 border border-gray-100 rounded-2xl p-4 space-y-4">
          <h3 className="text-xs font-semibold text-gray-400 uppercase tracking-wider">Administrator Contact</h3>
          
          <div className="grid grid-cols-2 gap-4">
            <div className="p-3 bg-white rounded-xl border border-gray-100">
              <p className="text-xs text-gray-400 mb-1 flex items-center gap-1"><User className="w-3 h-3" /> Administrator</p>
              <p className="text-sm font-semibold text-gray-800">{madrasa.admin}</p>
            </div>
            
            <div className="p-3 bg-white rounded-xl border border-gray-100">
              <p className="text-xs text-gray-400 mb-1 flex items-center gap-1"><Phone className="w-3 h-3" /> Phone</p>
              <p className="text-sm font-semibold text-gray-800">{madrasa.phone}</p>
            </div>
          </div>
          
          <div className="p-3 bg-white rounded-xl border border-gray-100">
            <p className="text-xs text-gray-400 mb-1 flex items-center gap-1"><Mail className="w-3 h-3" /> Email Address</p>
            <p className="text-sm font-semibold text-gray-800">{madrasa.email}</p>
          </div>

          <div className="p-3 bg-white rounded-xl border border-gray-100">
            <p className="text-xs text-gray-400 mb-1 flex items-center gap-1"><MapPin className="w-3 h-3" /> Full Location Address</p>
            <p className="text-sm font-semibold text-gray-800">{madrasa.address || 'N/A'}</p>
          </div>
        </div>

        {/* Footer Actions */}
        <div className="pt-4 border-t border-gray-100 flex justify-end">
          <button 
            onClick={onClose}
            className="px-5 py-2.5 bg-gray-100 hover:bg-gray-200 text-gray-700 rounded-xl text-sm font-medium transition-colors cursor-pointer"
          >
            Close
          </button>
        </div>
      </div>
    </Modal>
  );
};

export default ViewMadrasaModal;
