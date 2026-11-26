export const MEAL_PLANS = [
  {
    id: "full_3_meals",
    name: "পূর্ণ বোর্ডিং (৩ বেলা)",
    allowed_meals: { breakfast: true, lunch: true, dinner: true },
    default_fee: 3500,
  },
  {
    id: "daycare_lunch",
    name: "ডে-কেয়ার (শুধু দুপুর)",
    allowed_meals: { breakfast: false, lunch: true, dinner: false },
    default_fee: 1500,
  },
  {
    id: "morning_lunch",
    name: "সকাল ও দুপুর (২ বেলা)",
    allowed_meals: { breakfast: true, lunch: true, dinner: false },
    default_fee: 2400,
  },
  {
    id: "lunch_dinner",
    name: "দুপুর ও রাত (২ বেলা)",
    allowed_meals: { breakfast: false, lunch: true, dinner: true },
    default_fee: 2600,
  },
  {
    id: "lillah_free",
    name: "লিল্লাহ / ফ্রি বোর্ডিং (৩ বেলা)",
    allowed_meals: { breakfast: true, lunch: true, dinner: true },
    default_fee: 0,
  },
];

export const WEEKDAYS_BN = {
  Saturday: "শনিবার",
  Sunday: "রবিবার",
  Monday: "সোমবার",
  Tuesday: "মঙ্গলবার",
  Wednesday: "বুধবার",
  Thursday: "বৃহস্পতিবার",
  Friday: "শুক্রবার",
};

export const WEEKDAY_KEYS = [
  "Saturday",
  "Sunday",
  "Monday",
  "Tuesday",
  "Wednesday",
  "Thursday",
  "Friday",
];

export const RESIDENTIAL_BADGE = {
  Residential: {
    label: "আবাসিক",
    className: "bg-emerald-50 text-emerald-700 border-emerald-200",
  },
  "Non-Residential": {
    label: "অনাবাসিক",
    className: "bg-blue-50 text-blue-700 border-blue-200",
  },
  Lillah: {
    label: "লিল্লাহ / ফ্রি",
    className: "bg-amber-50 text-amber-700 border-amber-200",
  },
};

export const BAZAR_CATEGORIES = [
  { value: "Fresh", label: "কাঁচাবাজার / মাছ-মাংস (Fresh)" },
  { value: "Dry", label: "শুকনো বাজার (Dry)" },
  { value: "Fuel", label: "জ্বালানি / গ্যাস / খড়ি (Fuel)" },
];

export const INVENTORY_UNITS = [
  { value: "kg", label: "কেজি (kg)" },
  { value: "liter", label: "লিটার (liter)" },
  { value: "pcs", label: "টি / পিস (pcs)" },
  { value: "packet", label: "প্যাকেট (packet)" },
  { value: "mon", label: "মণ (mon)" },
];

export const getTodayDateStr = () => {
  const now = new Date();
  const offset = now.getTimezoneOffset() * 60000;
  return new Date(now.getTime() - offset).toISOString().slice(0, 10);
};

export const getCurrentMonthStr = () => {
  return getTodayDateStr().slice(0, 7);
};

export const formatCurrency = (val) => {
  return `৳ ${Number(val || 0).toLocaleString("en-IN")}`;
};
