import React from "react";

const TextareaField = ({
  title,
  value,
  setValue,
  required,
  type,
  placeholder,
}) => {
  return (
    <div className="grid-cols-1 sm:col-span-2 lg:col-span-3">
      <label className="text-sm font-bold text-slate-700 dark:text-slate-700 mb-2 block">
        {title} {required && <span className="text-red-500">*</span>}
      </label>
      <textarea
        type={type || "text"}
        required={required || false}
        value={value}
        onChange={(e) => setValue(e.target.value)}
        rows="3"
        className="w-full px-4 py-3 bg-[#e6f4ef] dark:bg-[#e6f4ef] border border-slate-200 dark:border-slate-200 text-slate-900 dark:text-slate-900 rounded-xl outline-none focus:ring-1 focus:ring-emerald-500 focus:border-emerald-500 transition-all"
        placeholder={placeholder}
      />
    </div>
  );
};

export default TextareaField;
