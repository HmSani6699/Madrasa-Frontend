import { AlertTriangle, Bus } from "lucide-react";

const TransportPageHeader = ({
  title,
  subtitle,
  icon = Bus,
  expiryAlerts = [],
  rightActions = null,
}) => {
  const IconComp = icon;
  return (
    <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
      <div className="flex items-center gap-3">
        <div className="w-11 h-11 rounded-xl bg-[#1C7D5A]/10 text-[#1C7D5A] flex items-center justify-center shrink-0">
          <IconComp className="w-6 h-6" />
        </div>
        <div>
          <h1 className="text-xl font-bold text-slate-800">{title}</h1>
          {subtitle && <p className="text-xs text-slate-500 mt-0.5">{subtitle}</p>}
        </div>
      </div>

      <div className="flex flex-wrap items-center gap-2">
        {expiryAlerts.length > 0 && (
          <div
            title={expiryAlerts
              .map((a) => `${a.vehicle_no}: ${a.doc_type} (${a.expiry_date})`)
              .join("\n")}
            className="px-3 py-2 bg-amber-50 border border-amber-300 text-amber-800 rounded-lg text-xs font-bold flex items-center gap-1.5"
          >
            <AlertTriangle className="w-4 h-4 text-amber-600" />
            ডকুমেন্ট মেয়াদ সতর্কতা ({expiryAlerts.length})
          </div>
        )}
        {rightActions}
      </div>
    </div>
  );
};

export default TransportPageHeader;
