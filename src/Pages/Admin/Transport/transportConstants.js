export const VEHICLE_TYPES = [
  { value: "Bus", label: "বাস (Bus)" },
  { value: "Microbus", label: "মাইক্রোবাস (Microbus)" },
  { value: "Van", label: "স্কুল ভ্যান (Van)" },
  { value: "Auto/CNG", label: "অটো / সিএনজি (Auto/CNG)" },
  { value: "Other", label: "অন্যান্য (Other)" },
];

export const VEHICLE_STATUS_BADGE = {
  Active: {
    label: "সক্রিয়",
    className: "bg-emerald-50 text-emerald-700 border-emerald-200",
  },
  Maintenance: {
    label: "মেরামতাধীন",
    className: "bg-amber-50 text-amber-700 border-amber-200",
  },
  Inactive: {
    label: "বন্ধ",
    className: "bg-slate-100 text-slate-600 border-slate-200",
  },
};

export const TRIP_TYPES = [
  { value: "Both", label: "উভয়মুখী (যাওয়া ও আসা)" },
  { value: "Pickup", label: "শুধু আসা (Morning Pickup)" },
  { value: "Drop", label: "শুধু যাওয়া (Evening Drop)" },
];

export const TRIP_TYPE_BADGE = {
  Both: { label: "আসা + যাওয়া", className: "bg-emerald-50 text-emerald-700 border-emerald-200" },
  Pickup: { label: "শুধু আসা", className: "bg-blue-50 text-blue-700 border-blue-200" },
  Drop: { label: "শুধু যাওয়া", className: "bg-purple-50 text-purple-700 border-purple-200" },
};

export const TRIP_STATUS_OPTIONS = [
  { value: "pending", label: "অপেক্ষমান", className: "bg-slate-100 text-slate-600 border-slate-200" },
  { value: "boarded", label: "গাড়িতে উঠেছে", className: "bg-blue-50 text-blue-700 border-blue-200" },
  { value: "dropped", label: "পৌঁছে গেছে", className: "bg-emerald-50 text-emerald-700 border-emerald-200" },
  { value: "absent", label: "অনুপস্থিত", className: "bg-rose-50 text-rose-700 border-rose-200" },
];

export const EXPENSE_CATEGORIES = [
  { value: "Fuel", label: "জ্বালানি / তেল-গ্যাস (Fuel)" },
  { value: "Maintenance", label: "মেরামত ও সার্ভিসিং (Maintenance)" },
  { value: "Driver Allowance", label: "ড্রাইভার / হেল্পার ভাতা" },
  { value: "Toll & Parking", label: "টোল ও পার্কিং" },
  { value: "Insurance & Tax", label: "ট্যাক্স, ফিটনেস ও ইন্স্যুরেন্স" },
  { value: "Other", label: "অন্যান্য খরচ" },
];

export const EXPENSE_UNITS = [
  { value: "liter", label: "লিটার (liter)" },
  { value: "cng", label: "ঘনমিটার / CNG" },
  { value: "pcs", label: "টি / পিস" },
  { value: "service", label: "সার্ভিস" },
];

export const getTodayDateStr = () => {
  const now = new Date();
  const offset = now.getTimezoneOffset() * 60000;
  return new Date(now.getTime() - offset).toISOString().slice(0, 10);
};

export const getCurrentMonthStr = () => getTodayDateStr().slice(0, 7);

export const formatCurrency = (val) => `৳ ${Number(val || 0).toLocaleString("en-IN")}`;
