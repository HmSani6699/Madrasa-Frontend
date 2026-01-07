import { ShieldCheck, ShieldAlert, MapPin, Users, Phone, Mail, User, BookOpen } from "lucide-react";
import Modal from "./Modal";

const ViewMadrasaModal = ({ isOpen, onClose, madrasa }) => {
  if (!madrasa) return null;

  return (
    <Modal isOpen={isOpen} onClose={onClose} title="Madrasa Details">
      <div className="space-y-6">
        {/* Header Section */}
        <div className="flex items-start justify-between">
            <div>
                <h2 className="text-xl font-bold text-gray-900">{madrasa.name}</h2>
                <div className="flex items-center gap-2 mt-1">
                    <span className={`inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-medium border ${
                        madrasa.status === 'Active' ? 'bg-emerald-50 text-emerald-700 border-emerald-100' :
                        madrasa.status === 'Pending' ? 'bg-amber-50 text-amber-700 border-amber-100' :
                        'bg-rose-50 text-rose-700 border-rose-100'
                    }`}>
                        {madrasa.status === 'Active' ? <ShieldCheck className="w-3 h-3" /> : <ShieldAlert className="w-3 h-3" />}
                        {madrasa.status}
                    </span>
                    <span className="text-gray-400">|</span>
                    <span className="text-sm text-gray-500 flex items-center gap-1">
                        <MapPin className="w-3 h-3" /> {madrasa.location}
                    </span>
                </div>
            </div>
            <div className="w-12 h-12 bg-primary/10 rounded-full flex items-center justify-center text-primary font-bold text-lg">
                {madrasa.name.charAt(0)}
            </div>
        </div>

        {/* Info Grid */}
        <div className="grid grid-cols-2 gap-4">
            <div className="p-3 bg-gray-50 rounded-xl border border-gray-100">
                <p className="text-xs text-gray-400 mb-1 flex items-center gap-1"><User className="w-3 h-3" /> Administrator</p>
                <p className="text-sm font-semibold text-gray-800">{madrasa.admin}</p>
            </div>
            <div className="p-3 bg-gray-50 rounded-xl border border-gray-100">
                <p className="text-xs text-gray-400 mb-1 flex items-center gap-1"><Users className="w-3 h-3" /> Total Students</p>
                <p className="text-sm font-semibold text-gray-800">{madrasa.students}</p>
            </div>
            <div className="p-3 bg-gray-50 rounded-xl border border-gray-100">
                <p className="text-xs text-gray-400 mb-1 flex items-center gap-1"><Phone className="w-3 h-3" /> Phone</p>
                <p className="text-sm font-semibold text-gray-800">{madrasa.phone}</p>
            </div>
            <div className="p-3 bg-gray-50 rounded-xl border border-gray-100">
                <p className="text-xs text-gray-400 mb-1 flex items-center gap-1"><BookOpen className="w-3 h-3" /> Plan</p>
                <p className="text-sm font-semibold text-gray-800">{madrasa.plan}</p>
            </div>
        </div>
        
        <div className="p-3 bg-gray-50 rounded-xl border border-gray-100">
            <p className="text-xs text-gray-400 mb-1 flex items-center gap-1"><Mail className="w-3 h-3" /> Email Address</p>
            <p className="text-sm font-semibold text-gray-800">{madrasa.email}</p>
        </div>

        <div className="p-3 bg-gray-50 rounded-xl border border-gray-100">
            <p className="text-xs text-gray-400 mb-1 flex items-center gap-1"><MapPin className="w-3 h-3" /> Full Address</p>
            <p className="text-sm font-semibold text-gray-800">{madrasa.address || 'N/A'}</p>
        </div>

        {/* Footer Actions */}
        <div className="pt-4 border-t border-gray-100 flex justify-end">
             <button 
                onClick={onClose}
                className="px-4 py-2 bg-gray-100 hover:bg-gray-200 text-gray-700 rounded-lg text-sm font-medium transition-colors"
            >
                Close
            </button>
        </div>
      </div>
    </Modal>
  );
};

export default ViewMadrasaModal;
