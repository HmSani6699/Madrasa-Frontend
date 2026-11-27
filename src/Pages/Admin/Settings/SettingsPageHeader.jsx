import React from "react";

const SettingsPageHeader = ({
  title,
  subtitle,
  icon: IconComp,
  rightActions = null,
}) => {
  return (
    <div className="bg-white rounded-2xl border border-slate-200/80 p-5 md:p-6 shadow-sm flex flex-col md:flex-row md:items-center justify-between gap-4">
      <div className="flex items-center gap-3.5">
        {IconComp && (
          <div className="w-12 h-12 rounded-xl bg-[#1C7D5A]/10 text-[#1C7D5A] border border-[#1C7D5A]/15 flex items-center justify-center shrink-0">
            <IconComp className="w-6 h-6" />
          </div>
        )}
        <div>
          <h1 className="text-xl md:text-2xl font-bold text-slate-800 tracking-tight">
            {title}
          </h1>
          {subtitle && (
            <p className="text-xs md:text-sm text-slate-500 mt-0.5">{subtitle}</p>
          )}
        </div>
      </div>

      {rightActions && (
        <div className="flex flex-wrap items-center gap-2.5">{rightActions}</div>
      )}
    </div>
  );
};

export default SettingsPageHeader;
