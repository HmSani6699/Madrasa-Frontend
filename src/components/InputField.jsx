import React from "react";

const InputField = ({
  title,
  value,
  setValue,
  required,
  type,
  placeholder,
}) => {
  return (
    <div className="w-full">
      <label className="text-sm font-bold text-slate-700 dark:text-slate-700 mb-2 block">
        {title} {required && <span className="text-red-500">*</span>}
      </label>
      <input
        type={type || "text"}
        required={required || false}
        value={value}
        onChange={(e) => setValue(e.target.value)}
        className="w-full px-4 py-2 bg-slate-50 dark:bg-slate-50 border border-slate-200 dark:border-slate-200 text-slate-900 dark:text-slate-900 rounded-[8px] outline-none focus:ring-1 focus:ring-[#1C7D5A] focus:border-[#1C7D5A] transition-all"
        placeholder={placeholder}
      />
    </div>
  );
};

export default InputField;
