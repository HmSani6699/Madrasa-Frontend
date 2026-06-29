import React from "react";

const SelectInputField = ({
  title,
  value,
  setValue,
  options,
  required,
  type,
  bgColor
}) => {
  return (
    <div className="w-full">
      <label className="text-sm font-bold text-slate-700 dark:text-slate-700 mb-2 block ">
        {title} {required && <span className="text-red-500">*</span>}
      </label>
      <select
        type={type || "text"}
        required={required || false}
        value={value}
        onChange={(e) => setValue(e.target.value)}
        className={`w-full px-4 py-2 ${bgColor || "bg-[#fff] dark:bg-[#fff]"} border border-slate-200 dark:border-slate-200 text-slate-900 dark:text-slate-900 rounded-[6px] outline-none focus:outline-none focus:ring-0.5 focus:ring-[#013f77] focus:border-[#013f77] transition-all`}
      >
        <option value="">--Select--</option>

        {options?.map((item, i) => (
          <option key={i} value={item?.value}>{item?.label || item?.value}</option>
        ))}
      </select>
    </div>
  );
};

export default SelectInputField;
