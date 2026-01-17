import { useState, useEffect } from "react";
import Modal from "./Modal";
import { CheckCircle2, Loader2, Save, Settings, X } from "lucide-react";

const SalarySetupModal = ({ isOpen, onClose, madrasa }) => {
  return (
    <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-sm z-[200] flex items-center justify-center p-4 overflow-y-auto">
      <div className="p-8 border-b-2 border-slate-50  sticky top-0 bg-white backdrop-blur-md z-10 rounded-[20px]">
        <div className="flex items-center justify-between mb-6 border-b-2 border-gray-200 pb-[20px]">
          <div>
            <h2 className="text-2xl font-black text-slate-800 tracking-tight flex items-center">
              <Settings className="w-8 h-8 text-primary" />
              Salary Setup
            </h2>
          </div>
          <button
            type="button"
            onClick={() => onClose(false)}
            className="p-3 hover:bg-rose-50 text-slate-400 hover:text-rose-500 rounded-2xl transition-all border-2 border-transparent hover:border-rose-100 cursor-pointer"
          >
            <X className="w-6 h-6" />
          </button>
        </div>

        {/* Form */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
          <div>
            <label className=" font-bold text-slate-700 dark:text-slate-700  block">
              Employee <span className="text-red-500">*</span>
            </label>
            <select
              required
              className="w-full px-4 py-3 bg-[#e6f4ef] dark:bg-[#e6f4ef] border-2 border-slate-200 dark:border-slate-200 text-slate-900 dark:text-slate-900 rounded-xl outline-none focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 transition-all"
            >
              <option value="Male">Md Jakir Hosen</option>
              <option value="Female">Md Noman</option>
            </select>
          </div>
          <div>
            <label className="text-xs font-black text-slate-500 uppercase mb-2 block">
              Basic Salary
            </label>
            <input
              type="number"
              className="w-full px-4 py-2.5 bg-white border-2 border-slate-200 rounded-xl outline-none focus:ring-2 focus:ring-emerald-500"
            />
          </div>
          <div>
            <label className="text-xs font-black text-slate-500 uppercase mb-2 block">
              House Rent
            </label>
            <input
              type="number"
              className="w-full px-4 py-2.5 bg-white border-2 border-slate-200 rounded-xl outline-none focus:ring-2 focus:ring-emerald-500"
            />
          </div>
          <div>
            <label className="text-xs font-black text-slate-500 uppercase mb-2 block">
              Medical
            </label>
            <input
              type="number"
              className="w-full px-4 py-2.5 bg-white border-2 border-slate-200 rounded-xl outline-none focus:ring-2 focus:ring-emerald-500"
            />
          </div>
          <div>
            <label className="text-xs font-black text-slate-500 uppercase mb-2 block">
              Transport
            </label>
            <input
              type="number"
              className="w-full px-4 py-2.5 bg-white border-2 border-slate-200 rounded-xl outline-none focus:ring-2 focus:ring-emerald-500"
            />
          </div>
          <div>
            <label className="text-xs font-black text-slate-500 uppercase mb-2 block">
              Bonus
            </label>
            <input
              type="number"
              className="w-full px-4 py-2.5 bg-white border-2 border-slate-200 rounded-xl outline-none focus:ring-2 focus:ring-emerald-500"
            />
          </div>
        </div>

        {/* Submit Button */}
        <div className="flex flex-col sm:flex-row items-center justify-end gap-4 mt-10 ">
          <button
            type="button"
            className="w-full sm:w-auto flex items-center justify-center gap-2 px-8 py-4 text-sm font-black bg-slate-100 text-slate-600 rounded-2xl hover:bg-slate-200 transition-all border-2 border-slate-200 shadow-sm cursor-pointer"
            onClick={() => onClose(false)}
          >
            <X className="w-5 h-5" />
            Cancel
          </button>
          <button
            onClick={() => onClose(false)}
            type="submit"
            className="w-full sm:w-auto flex items-center justify-center gap-3 px-12 py-4 text-base font-black bg-[#00bd7f] text-white rounded-2xl hover:bg-[#009b68] transition-all shadow-xl shadow-emerald-500/30 hover:-translate-y-1 cursor-pointer"
          >
            <CheckCircle2 className="w-6 h-6" />
            Save
          </button>
        </div>
      </div>
    </div>
  );
};

export default SalarySetupModal;
