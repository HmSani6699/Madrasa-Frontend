export const WEEKDAY_KEYS = [
  "Saturday",
  "Sunday",
  "Monday",
  "Tuesday",
  "Wednesday",
  "Thursday",
  "Friday",
];

export const WEEKDAY_BN = {
  Saturday: "শনিবার",
  Sunday: "রবিবার",
  Monday: "সোমবার",
  Tuesday: "মঙ্গলবার",
  Wednesday: "বুধবার",
  Thursday: "বৃহস্পতিবার",
  Friday: "শুক্রবার",
};

export const MONTHS_BN = [
  "জানুয়ারি",
  "ফেব্রুয়ারি",
  "মার্চ",
  "এপ্রিল",
  "মে",
  "জুন",
  "জুলাই",
  "আগস্ট",
  "সেপ্টেম্বর",
  "অক্টোবর",
  "নভেম্বর",
  "ডিসেম্বর",
];

export const WEEK_ORDINAL_BN = ["১ম", "২য়", "৩য়", "৪র্থ", "৫ম"];

const BN_DIGITS = ["০", "১", "২", "৩", "৪", "৫", "৬", "৭", "৮", "৯"];

export const ATTENDANCE_OPTIONS = [
  { value: "উপস্থিত", label: "উপস্থিত" },
  { value: "অনুপস্থিত", label: "অনুপস্থিত" },
  { value: "ছুটি", label: "ছুটি" },
];

export const toBanglaDigits = (val) => {
  if (val === null || val === undefined) return "";
  return String(val).replace(/\d/g, (d) => BN_DIGITS[Number(d)]);
};

export const getTodayDateStr = () => {
  const now = new Date();
  const utc = now.getTime() + now.getTimezoneOffset() * 60000;
  const bd = new Date(utc + 6 * 3600000);
  return bd.toISOString().slice(0, 10);
};

export const getCurrentMonthStr = () => getTodayDateStr().slice(0, 7);

export const parseUtcDate = (dateStr) => {
  const [y, m, d] = String(dateStr).split("-").map(Number);
  return new Date(Date.UTC(y, m - 1, d));
};

export const addDays = (dateStr, days) => {
  const dt = parseUtcDate(dateStr);
  dt.setUTCDate(dt.getUTCDate() + days);
  return dt.toISOString().slice(0, 10);
};

export const getWeekdayKey = (dateStr) => {
  const dt = parseUtcDate(dateStr);
  const names = [
    "Sunday",
    "Monday",
    "Tuesday",
    "Wednesday",
    "Thursday",
    "Friday",
    "Saturday",
  ];
  return names[dt.getUTCDay()];
};

export const getSaturdayWeekStart = (dateStr) => {
  const dt = parseUtcDate(dateStr);
  const daysSinceSaturday = (dt.getUTCDay() + 1) % 7;
  dt.setUTCDate(dt.getUTCDate() - daysSinceSaturday);
  return dt.toISOString().slice(0, 10);
};

export const getMonthSaturdayWeeks = (monthStr) => {
  const [year, month] = String(monthStr).split("-").map(Number);
  const daysInMonth = new Date(Date.UTC(year, month, 0)).getUTCDate();
  const weeks = [];
  for (let day = 1; day <= daysInMonth; day++) {
    const dt = new Date(Date.UTC(year, month - 1, day));
    if (dt.getUTCDay() === 6) {
      const weekStart = dt.toISOString().slice(0, 10);
      const weekEnd = addDays(weekStart, 6);
      const index = weeks.length + 1;
      weeks.push({
        weekNumber: index,
        ordinalBn: WEEK_ORDINAL_BN[index - 1] || `${toBanglaDigits(index)}ম`,
        weekStart,
        weekEnd,
        shortRangeBn: `${toBanglaDigits(weekStart.slice(8, 10))}/${toBanglaDigits(
          weekStart.slice(5, 7)
        )}-${toBanglaDigits(weekEnd.slice(8, 10))}/${toBanglaDigits(
          weekEnd.slice(5, 7)
        )}`,
      });
    }
  }
  return weeks;
};

export const getWeekInfoForDate = (dateStr) => {
  const weekStart = getSaturdayWeekStart(dateStr);
  const weekEnd = addDays(weekStart, 6);
  const monthStr = weekStart.slice(0, 7);
  const weeks = getMonthSaturdayWeeks(monthStr);
  const found = weeks.find((w) => w.weekStart === weekStart) || {
    weekNumber: 1,
    ordinalBn: "১ম",
    weekStart,
    weekEnd,
  };
  const [year, month] = monthStr.split("-").map(Number);
  return {
    ...found,
    monthStr,
    year,
    monthNameBn: MONTHS_BN[month - 1] || monthStr,
    yearBn: toBanglaDigits(year),
    weekdayKey: getWeekdayKey(dateStr),
    weekdayBn: WEEKDAY_BN[getWeekdayKey(dateStr)] || "",
  };
};

export const formatBanglaFullDate = (dateStr) => {
  if (!dateStr) return "";
  const [y, m, d] = String(dateStr).split("-");
  const weekdayBn = WEEKDAY_BN[getWeekdayKey(dateStr)] || "";
  return `${toBanglaDigits(d)}/${toBanglaDigits(m)}/${toBanglaDigits(y)}${
    weekdayBn ? ` (${weekdayBn})` : ""
  }`;
};

export const formatBanglaMonthYear = (monthStr) => {
  if (!monthStr) return "";
  const [y, m] = String(monthStr).split("-").map(Number);
  return `${MONTHS_BN[m - 1] || monthStr} ${toBanglaDigits(y)}`;
};

export const getSectionsForClass = (sections = [], classId = "") => {
  if (!classId) return [];
  return sections.filter(
    (s) =>
      s.class_id?._id === classId ||
      s.class_id === classId ||
      s.classId?._id === classId ||
      s.classId === classId
  );
};

export const hasRowContent = (row) => {
  if (!row) return false;
  const hasLesson = Boolean(
    row.sabak?.para?.trim() ||
      row.sabak?.page?.trim() ||
      row.sat_sabak?.para?.trim() ||
      row.sat_sabak?.page?.trim() ||
      row.sat_sabak?.amount?.trim() ||
      (row.sat_sabak?.mistakes !== "" &&
        row.sat_sabak?.mistakes !== null &&
        row.sat_sabak?.mistakes !== undefined) ||
      row.amukhta?.para?.trim() ||
      row.amukhta?.page?.trim() ||
      row.amukhta?.amount?.trim() ||
      (row.amukhta?.mistakes !== "" &&
        row.amukhta?.mistakes !== null &&
        row.amukhta?.mistakes !== undefined) ||
      row.daily_tilawat?.trim() ||
      row.teacher_signature?.trim()
  );
  if (hasLesson) return true;
  return row.attendance === "অনুপস্থিত" || row.attendance === "ছুটি";
};
