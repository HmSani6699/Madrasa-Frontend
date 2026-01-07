import { FileText, UserPlus, AlertTriangle, ArrowRight } from "lucide-react";
import { Link } from "react-router";

const ActionItem = ({ icon: Icon, title, desc, link, color }) => (
    <Link to={link || '#'} className="flex items-center gap-4 p-4 rounded-xl hover:bg-gray-50 transition-colors group border border-transparent hover:border-gray-100">
        <div className={`w-10 h-10 rounded-full flex items-center justify-center ${color} group-hover:scale-110 transition-transform`}>
            <Icon className="w-5 h-5" />
        </div>
        <div className="flex-1">
            <h4 className="font-semibold text-gray-800 text-sm group-hover:text-primary transition-colors">{title}</h4>
            <p className="text-xs text-gray-500">{desc}</p>
        </div>
        <ArrowRight className="w-4 h-4 text-gray-300 group-hover:text-primary transition-colors" />
    </Link>
);

const ActionCenter = () => {
  return (
    <div className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden h-full flex flex-col">
        <div className="p-5 border-b border-gray-50 bg-gray-50/30">
            <h3 className="font-bold text-gray-800 flex items-center gap-2">
                <AlertTriangle className="w-4 h-4 text-amber-500" />
                Attention Needed
            </h3>
        </div>
        
        <div className="p-2 space-y-1 flex-1">
            <ActionItem 
                icon={UserPlus}
                title="3 New Admission Requests"
                desc="Waiting for approval since morning"
                color="bg-purple-50 text-purple-600"
                link="/admin/admission/online" // updated based on Nav
            />
            <ActionItem 
                icon={FileText}
                title="2 Teacher Leave Applications"
                desc="Moulana Yusuf & 1 other"
                color="bg-rose-50 text-rose-600"
                link="/admin/employee/list"
            />
             <ActionItem 
                icon={AlertTriangle}
                title="Low Stock Alert: Rice"
                desc="Kitchen inventory below 10kg"
                color="bg-amber-50 text-amber-600"
                link="/admin/inventory/stock"
            />
        </div>
        
        <div className="p-3 border-t border-gray-50 bg-gray-50/30 text-center">
            <button className="text-xs font-semibold text-gray-500 hover:text-primary transition-colors uppercase tracking-wider">
                Dismiss All Notifications
            </button>
        </div>
    </div>
  );
};

export default ActionCenter;
