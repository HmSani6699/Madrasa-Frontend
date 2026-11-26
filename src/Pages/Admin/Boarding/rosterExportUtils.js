import XLSX from "xlsx-js-style";
import { RESIDENTIAL_BADGE, WEEKDAYS_BN } from "./boardingConstants";

export const MEAL_COLUMNS = [
  { key: "breakfast", label: "সকাল" },
  { key: "lunch", label: "দুপুর" },
  { key: "dinner", label: "রাত" },
];

export const MEAL_TYPE_FILTER_LABELS = {
  all: "সকল মিল (সব ধরন)",
  "meal:breakfast": "সকাল (Breakfast)",
  "meal:lunch": "দুপুর (Lunch)",
  "meal:dinner": "রাত (Dinner)",
  "res:Residential": "আবাসিক (Residential)",
  "res:Non-Residential": "অনাবাসিক (Non-Residential)",
  "res:Lillah": "লিল্লাহ / ফ্রি (Lillah)",
};

const csvEscape = (value) => {
  const str = String(value ?? "");
  return /[",\n\r]/.test(str) ? `"${str.replace(/"/g, '""')}"` : str;
};

export const formatMealStatus = (isOn, isDelivered) => {
  if (!isOn) return "বন্ধ";
  return isDelivered ? "উপস্থিত" : "বাকি";
};

export const computeRosterMetrics = (rows, visibleMeals) => {
  const totals = {
    students: rows.length,
    residential: 0,
    nonResidential: 0,
    lillah: 0,
    breakfast: 0,
    breakfastDelivered: 0,
    lunch: 0,
    lunchDelivered: 0,
    dinner: 0,
    dinnerDelivered: 0,
    totalMeals: 0,
  };

  const classMap = new Map();

  for (const row of rows) {
    const className = row.class_name || "N/A";
    if (!classMap.has(className)) {
      classMap.set(className, {
        className,
        students: 0,
        residential: 0,
        nonResidential: 0,
        lillah: 0,
        breakfast: 0,
        breakfastDelivered: 0,
        lunch: 0,
        lunchDelivered: 0,
        dinner: 0,
        dinnerDelivered: 0,
        totalMeals: 0,
      });
    }

    const cls = classMap.get(className);
    cls.students += 1;

    if (row.residential_type === "Residential") {
      totals.residential += 1;
      cls.residential += 1;
    } else if (row.residential_type === "Non-Residential") {
      totals.nonResidential += 1;
      cls.nonResidential += 1;
    } else if (row.residential_type === "Lillah") {
      totals.lillah += 1;
      cls.lillah += 1;
    }

    let rowMeals = 0;
    for (const { key } of visibleMeals) {
      const isOn = Number(row[key] || 0) === 1 ? 1 : 0;
      const isDelivered = isOn && Boolean(row[`${key}_delivered`]) ? 1 : 0;
      totals[key] += isOn;
      totals[`${key}Delivered`] += isDelivered;
      cls[key] += isOn;
      cls[`${key}Delivered`] += isDelivered;
      rowMeals += isOn;
    }

    totals.totalMeals += rowMeals;
    cls.totalMeals += rowMeals;
  }

  const byClass = Array.from(classMap.values()).sort((a, b) =>
    a.className.localeCompare(b.className, undefined, { numeric: true })
  );

  return { totals, byClass };
};

const computeGuestSummary = (guestMeals, visibleMeals) => {
  const summary = {
    peopleCount: 0,
    breakfast: 0,
    lunch: 0,
    dinner: 0,
    totalMeals: 0,
  };

  for (const g of guestMeals) {
    const qty = Number(g.count || 1);
    summary.peopleCount += qty;
    for (const { key } of visibleMeals) {
      const mealQty = Number(g[key] || 0) * qty;
      summary[key] += mealQty;
      summary.totalMeals += mealQty;
    }
  }

  return summary;
};

/* =========================
   CLEAN CSV EXPORT
========================= */

export const buildRosterCsv = ({
  selectedDate,
  weekday,
  classFilter,
  mealTypeFilter,
  searchTerm,
  rows,
  guestMeals,
  visibleMeals,
  metrics,
}) => {
  const lines = [];
  const pushRow = (cells) => lines.push(cells.map(csvEscape).join(","));

  const weekdayLabel = WEEKDAYS_BN[weekday] || weekday || "";
  const includeGuests =
    classFilter === "all" && !mealTypeFilter.startsWith("res:") && !searchTerm.trim() && guestMeals.length > 0;
  const guestSummary = includeGuests ? computeGuestSummary(guestMeals, visibleMeals) : null;

  // Put title/filter info starting in Col B so Col A stays compact for SL numbers
  pushRow([
    "",
    "দৈনিক মিল ও অ্যাটেনডেন্স রিপোর্ট",
    `তারিখ: ${selectedDate}${weekdayLabel ? ` (${weekdayLabel})` : ""}`,
    `ক্লাস: ${classFilter === "all" ? "সকল" : classFilter}`,
    `মিল: ${MEAL_TYPE_FILTER_LABELS[mealTypeFilter] || mealTypeFilter}`,
    searchTerm.trim() ? `সার্চ: ${searchTerm.trim()}` : "",
  ]);
  pushRow([]);

  // 1. One-View Top Summary Table (Class-wise + Grand Total)
  pushRow(["", "ক্লাস ও সার্বিক সারসংক্ষেপ (SUMMARY OVERVIEW)"]);
  const summaryHeaders = ["#", "ক্লাস / গ্রুপ", "মোট ছাত্র", "আবাসিক", "অনাবাসিক", "লিল্লাহ"];
  for (const meal of visibleMeals) {
    summaryHeaders.push(`${meal.label} মিল`, `${meal.label} উপস্থিত`);
  }
  summaryHeaders.push("মোট বেলা");
  pushRow(summaryHeaders);

  metrics.byClass.forEach((cls, idx) => {
    const cells = [idx + 1, cls.className, cls.students, cls.residential, cls.nonResidential, cls.lillah];
    for (const meal of visibleMeals) {
      cells.push(cls[meal.key], cls[`${meal.key}Delivered`]);
    }
    cells.push(cls.totalMeals);
    pushRow(cells);
  });

  if (guestSummary) {
    const gCells = ["-", "অতিথি / শিক্ষক", guestSummary.peopleCount, 0, 0, 0];
    for (const meal of visibleMeals) {
      gCells.push(guestSummary[meal.key], guestSummary[meal.key]);
    }
    gCells.push(guestSummary.totalMeals);
    pushRow(gCells);
  }

  const grandCells = [
    "",
    "সর্বমোট (TOTAL)",
    metrics.totals.students + (guestSummary?.peopleCount || 0),
    metrics.totals.residential,
    metrics.totals.nonResidential,
    metrics.totals.lillah,
  ];
  for (const meal of visibleMeals) {
    grandCells.push(
      metrics.totals[meal.key] + (guestSummary?.[meal.key] || 0),
      metrics.totals[`${meal.key}Delivered`] + (guestSummary?.[meal.key] || 0)
    );
  }
  grandCells.push(metrics.totals.totalMeals + (guestSummary?.totalMeals || 0));
  pushRow(grandCells);

  pushRow([]);

  // 2. Student Attendance Table
  pushRow(["", "ছাত্রদের মিল অ্যাটেনডেন্স তালিকা (STUDENT ATTENDANCE)"]);
  const studentHeaders = ["ক্রম", "ছাত্রের নাম", "আইডি", "রোল", "ক্লাস", "ধরন"];
  for (const meal of visibleMeals) {
    studentHeaders.push(meal.label);
  }
  studentHeaders.push("মোট বেলা", "প্যাকেজ");
  pushRow(studentHeaders);

  rows.forEach((row, idx) => {
    const badge = RESIDENTIAL_BADGE[row.residential_type]?.label || row.residential_type || "";
    const cells = [
      idx + 1,
      row.student_name || "",
      row.student_code || "",
      row.roll_number || "",
      row.class_name || "N/A",
      badge,
    ];
    let rowTotal = 0;
    for (const meal of visibleMeals) {
      const isOn = Number(row[meal.key] || 0) === 1;
      const isDelivered = Boolean(row[`${meal.key}_delivered`]);
      if (isOn) rowTotal += 1;
      cells.push(formatMealStatus(isOn, isDelivered));
    }
    cells.push(rowTotal, row.meal_plan_name || "");
    pushRow(cells);
  });

  if (guestSummary) {
    pushRow([]);
    pushRow(["", "অতিথি ও শিক্ষক মিল তালিকা (GUEST MEALS)"]);
    pushRow(["ক্রম", "নাম", "ধরন", "জনসংখ্যা", "", "", ...visibleMeals.map((m) => m.label), "মোট বেলা"]);
    guestMeals.forEach((g, idx) => {
      const qty = Number(g.count || 1);
      const typeLabel =
        g.guest_type === "Teacher" ? "শিক্ষক" : g.guest_type === "Guardian" ? "অভিভাবক" : "মেহমান";
      let total = 0;
      const mealCounts = visibleMeals.map((m) => {
        const c = Number(g[m.key] || 0) * qty;
        total += c;
        return c;
      });
      pushRow([idx + 1, g.guest_name || "", typeLabel, qty, "", "", ...mealCounts, total]);
    });
  }

  return "\uFEFF" + lines.join("\r\n");
};

/* =========================
   STYLED EXCEL (.XLSX) EXPORT
========================= */

const THIN_BORDER = {
  top: { style: "thin", color: { rgb: "CBD5E1" } },
  bottom: { style: "thin", color: { rgb: "CBD5E1" } },
  left: { style: "thin", color: { rgb: "CBD5E1" } },
  right: { style: "thin", color: { rgb: "CBD5E1" } },
};

const TOTAL_BORDER = {
  top: { style: "thin", color: { rgb: "1C7D5A" } },
  bottom: { style: "medium", color: { rgb: "123628" } },
  left: { style: "thin", color: { rgb: "CBD5E1" } },
  right: { style: "thin", color: { rgb: "CBD5E1" } },
};

const makeCell = (v, style = {}) => ({
  v,
  t: typeof v === "number" ? "n" : "s",
  s: style,
});

const getStatusStyle = (statusText, baseBg) => {
  const base = {
    font: { name: "Calibri", sz: 10, bold: true, color: { rgb: "475569" } },
    fill: { patternType: "solid", fgColor: { rgb: baseBg } },
    alignment: { horizontal: "center", vertical: "center" },
    border: THIN_BORDER,
  };
  if (statusText === "উপস্থিত") {
    return {
      ...base,
      font: { ...base.font, color: { rgb: "15803D" } },
      fill: { patternType: "solid", fgColor: { rgb: "DCFCE7" } },
    };
  }
  if (statusText === "বাকি") {
    return {
      ...base,
      font: { ...base.font, color: { rgb: "B45309" } },
      fill: { patternType: "solid", fgColor: { rgb: "FEF3C7" } },
    };
  }
  return {
    ...base,
    font: { ...base.font, bold: false, color: { rgb: "94A3B8" } },
  };
};

export const exportStyledExcel = ({
  selectedDate,
  weekday,
  classFilter,
  mealTypeFilter,
  searchTerm,
  rows,
  guestMeals,
  visibleMeals,
  metrics,
  filename,
}) => {
  const weekdayLabel = WEEKDAYS_BN[weekday] || weekday || "";
  const includeGuests =
    classFilter === "all" && !mealTypeFilter.startsWith("res:") && !searchTerm.trim() && guestMeals.length > 0;
  const guestSummary = includeGuests ? computeGuestSummary(guestMeals, visibleMeals) : null;

  const summaryColCount = 7 + visibleMeals.length * 2;
  const studentColCount = 8 + visibleMeals.length;
  const totalCols = Math.max(summaryColCount, studentColCount);

  const padRow = (arr) => {
    const out = [...arr];
    while (out.length < totalCols) out.push(makeCell("", {}));
    return out;
  };

  const aoa = [];
  const merges = [];
  const rowHeights = [];

  // Row 0: Title Banner
  const titleStyle = {
    font: { name: "Calibri", sz: 14, bold: true, color: { rgb: "FFFFFF" } },
    fill: { patternType: "solid", fgColor: { rgb: "123628" } },
    alignment: { horizontal: "left", vertical: "center" },
  };
  const titleRow = Array.from({ length: totalCols }, (_, i) =>
    makeCell(
      i === 0 ? `  দৈনিক মিল ও অ্যাটেনডেন্স রিপোর্ট  |  তারিখ: ${selectedDate}${weekdayLabel ? ` (${weekdayLabel})` : ""}` : "",
      titleStyle
    )
  );
  aoa.push(titleRow);
  merges.push({ s: { r: 0, c: 0 }, e: { r: 0, c: totalCols - 1 } });
  rowHeights.push({ hpt: 30 });

  // Row 1: Filter info bar
  const metaStyle = {
    font: { name: "Calibri", sz: 10, bold: true, color: { rgb: "123628" } },
    fill: { patternType: "solid", fgColor: { rgb: "ECFDF5" } },
    alignment: { horizontal: "left", vertical: "center" },
    border: { bottom: { style: "thin", color: { rgb: "A7F3D0" } } },
  };
  const filterText = `  ক্লাস: ${classFilter === "all" ? "সকল ক্লাস" : classFilter}    •    মিল ধরন: ${
    MEAL_TYPE_FILTER_LABELS[mealTypeFilter] || mealTypeFilter
  }    •    সার্চ: ${searchTerm.trim() || "নেই"}`;
  aoa.push(
    Array.from({ length: totalCols }, (_, i) => makeCell(i === 0 ? filterText : "", metaStyle))
  );
  merges.push({ s: { r: 1, c: 0 }, e: { r: 1, c: totalCols - 1 } });
  rowHeights.push({ hpt: 22 });

  // Row 2: Spacer
  aoa.push(padRow([]));
  rowHeights.push({ hpt: 10 });

  // Row 3: Summary section heading
  const sectionHeadingStyle = {
    font: { name: "Calibri", sz: 11, bold: true, color: { rgb: "123628" } },
    alignment: { horizontal: "left", vertical: "center" },
  };
  aoa.push(padRow([makeCell("সার্বিক ও ক্লাস অনুযায়ী সারসংক্ষেপ (Summary Overview)", sectionHeadingStyle)]));
  merges.push({ s: { r: 3, c: 0 }, e: { r: 3, c: totalCols - 1 } });
  rowHeights.push({ hpt: 22 });

  // Row 4: Summary Table Headers
  const summaryHeaderStyle = {
    font: { name: "Calibri", sz: 10, bold: true, color: { rgb: "FFFFFF" } },
    fill: { patternType: "solid", fgColor: { rgb: "1C7D5A" } },
    alignment: { horizontal: "center", vertical: "center", wrapText: true },
    border: THIN_BORDER,
  };
  const summaryHeaderLeft = {
    ...summaryHeaderStyle,
    alignment: { horizontal: "left", vertical: "center" },
  };

  const summaryHeaderLabels = ["#", "ক্লাস / গ্রুপ", "মোট ছাত্র", "আবাসিক", "অনাবাসিক", "লিল্লাহ"];
  for (const meal of visibleMeals) {
    summaryHeaderLabels.push(`${meal.label} মিল`, `${meal.label} উপস্থিত`);
  }
  summaryHeaderLabels.push("মোট বেলা");
  aoa.push(
    padRow(
      summaryHeaderLabels.map((lbl, i) => makeCell(lbl, i === 1 ? summaryHeaderLeft : summaryHeaderStyle))
    )
  );
  rowHeights.push({ hpt: 24 });

  // Summary Rows per Class
  metrics.byClass.forEach((cls, idx) => {
    const bg = idx % 2 === 0 ? "FFFFFF" : "F8FAFC";
    const cellStyle = {
      font: { name: "Calibri", sz: 10, color: { rgb: "1E293B" } },
      fill: { patternType: "solid", fgColor: { rgb: bg } },
      alignment: { horizontal: "center", vertical: "center" },
      border: THIN_BORDER,
    };
    const nameStyle = {
      ...cellStyle,
      font: { ...cellStyle.font, bold: true },
      alignment: { horizontal: "left", vertical: "center" },
    };

    const rowVals = [idx + 1, cls.className, cls.students, cls.residential, cls.nonResidential, cls.lillah];
    for (const meal of visibleMeals) {
      rowVals.push(cls[meal.key], cls[`${meal.key}Delivered`]);
    }
    rowVals.push(cls.totalMeals);
    aoa.push(padRow(rowVals.map((v, i) => makeCell(v, i === 1 ? nameStyle : cellStyle))));
    rowHeights.push({ hpt: 20 });
  });

  // Optional Guest Summary Row inside Summary Table
  if (guestSummary) {
    const guestRowStyle = {
      font: { name: "Calibri", sz: 10, color: { rgb: "92400E" } },
      fill: { patternType: "solid", fgColor: { rgb: "FFFBEB" } },
      alignment: { horizontal: "center", vertical: "center" },
      border: THIN_BORDER,
    };
    const guestNameStyle = {
      ...guestRowStyle,
      font: { ...guestRowStyle.font, bold: true },
      alignment: { horizontal: "left", vertical: "center" },
    };
    const gVals = ["—", "অতিথি / শিক্ষক", guestSummary.peopleCount, 0, 0, 0];
    for (const meal of visibleMeals) {
      gVals.push(guestSummary[meal.key], guestSummary[meal.key]);
    }
    gVals.push(guestSummary.totalMeals);
    aoa.push(padRow(gVals.map((v, i) => makeCell(v, i === 1 ? guestNameStyle : guestRowStyle))));
    rowHeights.push({ hpt: 20 });
  }

  // Grand Total Row
  const totalStyle = {
    font: { name: "Calibri", sz: 10, bold: true, color: { rgb: "123628" } },
    fill: { patternType: "solid", fgColor: { rgb: "D1FAE5" } },
    alignment: { horizontal: "center", vertical: "center" },
    border: TOTAL_BORDER,
  };
  const totalLabelStyle = {
    ...totalStyle,
    alignment: { horizontal: "left", vertical: "center" },
  };
  const grandVals = [
    "",
    "সর্বমোট (TOTAL)",
    metrics.totals.students + (guestSummary?.peopleCount || 0),
    metrics.totals.residential,
    metrics.totals.nonResidential,
    metrics.totals.lillah,
  ];
  for (const meal of visibleMeals) {
    grandVals.push(
      metrics.totals[meal.key] + (guestSummary?.[meal.key] || 0),
      metrics.totals[`${meal.key}Delivered`] + (guestSummary?.[meal.key] || 0)
    );
  }
  grandVals.push(metrics.totals.totalMeals + (guestSummary?.totalMeals || 0));
  aoa.push(padRow(grandVals.map((v, i) => makeCell(v, i === 1 ? totalLabelStyle : totalStyle))));
  rowHeights.push({ hpt: 22 });

  // Spacer
  aoa.push(padRow([]));
  rowHeights.push({ hpt: 12 });

  // Student Attendance Heading
  const studentHeadingRowIdx = aoa.length;
  aoa.push(padRow([makeCell("ছাত্রদের মিল অ্যাটেনডেন্স তালিকা (Student Meal Attendance)", sectionHeadingStyle)]));
  merges.push({ s: { r: studentHeadingRowIdx, c: 0 }, e: { r: studentHeadingRowIdx, c: totalCols - 1 } });
  rowHeights.push({ hpt: 22 });

  // Student Headers
  const stHeaderStyle = {
    font: { name: "Calibri", sz: 10, bold: true, color: { rgb: "FFFFFF" } },
    fill: { patternType: "solid", fgColor: { rgb: "123628" } },
    alignment: { horizontal: "center", vertical: "center" },
    border: THIN_BORDER,
  };
  const stHeaderLeft = { ...stHeaderStyle, alignment: { horizontal: "left", vertical: "center" } };
  const studentHeaders = ["ক্রম", "ছাত্রের নাম", "আইডি", "রোল", "ক্লাস", "ধরন"];
  for (const meal of visibleMeals) {
    studentHeaders.push(meal.label);
  }
  studentHeaders.push("মোট বেলা", "প্যাকেজ");
  aoa.push(
    padRow(
      studentHeaders.map((lbl, i) =>
        makeCell(lbl, i === 1 || i === studentHeaders.length - 1 ? stHeaderLeft : stHeaderStyle)
      )
    )
  );
  rowHeights.push({ hpt: 24 });

  // Student Data Rows
  rows.forEach((row, idx) => {
    const bg = idx % 2 === 0 ? "FFFFFF" : "F8FAFC";
    const baseCell = {
      font: { name: "Calibri", sz: 10, color: { rgb: "1E293B" } },
      fill: { patternType: "solid", fgColor: { rgb: bg } },
      alignment: { horizontal: "center", vertical: "center" },
      border: THIN_BORDER,
    };
    const leftCell = { ...baseCell, alignment: { horizontal: "left", vertical: "center" } };
    const nameCell = { ...leftCell, font: { ...baseCell.font, bold: true } };

    const badge = RESIDENTIAL_BADGE[row.residential_type]?.label || row.residential_type || "";
    const cells = [
      makeCell(idx + 1, baseCell),
      makeCell(row.student_name || "", nameCell),
      makeCell(row.student_code || "", baseCell),
      makeCell(row.roll_number || "", baseCell),
      makeCell(row.class_name || "N/A", baseCell),
      makeCell(badge, baseCell),
    ];

    let rowTotal = 0;
    for (const meal of visibleMeals) {
      const isOn = Number(row[meal.key] || 0) === 1;
      const isDelivered = Boolean(row[`${meal.key}_delivered`]);
      if (isOn) rowTotal += 1;
      const statusText = formatMealStatus(isOn, isDelivered);
      cells.push(makeCell(statusText, getStatusStyle(statusText, bg)));
    }

    cells.push(
      makeCell(rowTotal, { ...baseCell, font: { ...baseCell.font, bold: true, color: { rgb: "123628" } } }),
      makeCell(row.meal_plan_name || "", leftCell)
    );

    aoa.push(padRow(cells));
    rowHeights.push({ hpt: 20 });
  });

  // Optional Guest List below if present
  if (guestSummary) {
    aoa.push(padRow([]));
    rowHeights.push({ hpt: 12 });

    const guestHeadingRowIdx = aoa.length;
    aoa.push(padRow([makeCell("অতিথি ও শিক্ষক মিল তালিকা (Guest Meals)", sectionHeadingStyle)]));
    merges.push({ s: { r: guestHeadingRowIdx, c: 0 }, e: { r: guestHeadingRowIdx, c: totalCols - 1 } });
    rowHeights.push({ hpt: 22 });

    const gHeaders = ["ক্রম", "নাম", "ধরন", "জনসংখ্যা", ...visibleMeals.map((m) => m.label), "মোট বেলা"];
    aoa.push(padRow(gHeaders.map((lbl, i) => makeCell(lbl, i === 1 ? stHeaderLeft : stHeaderStyle))));
    rowHeights.push({ hpt: 22 });

    guestMeals.forEach((g, idx) => {
      const bg = idx % 2 === 0 ? "FFFFFF" : "F8FAFC";
      const baseCell = {
        font: { name: "Calibri", sz: 10, color: { rgb: "1E293B" } },
        fill: { patternType: "solid", fgColor: { rgb: bg } },
        alignment: { horizontal: "center", vertical: "center" },
        border: THIN_BORDER,
      };
      const nameCell = { ...baseCell, font: { ...baseCell.font, bold: true }, alignment: { horizontal: "left", vertical: "center" } };
      const qty = Number(g.count || 1);
      const typeLabel =
        g.guest_type === "Teacher" ? "শিক্ষক" : g.guest_type === "Guardian" ? "অভিভাবক" : "মেহমান";
      let total = 0;
      const mealCells = visibleMeals.map((m) => {
        const c = Number(g[m.key] || 0) * qty;
        total += c;
        return makeCell(c, baseCell);
      });
      aoa.push(
        padRow([
          makeCell(idx + 1, baseCell),
          makeCell(g.guest_name || "", nameCell),
          makeCell(typeLabel, baseCell),
          makeCell(qty, baseCell),
          ...mealCells,
          makeCell(total, { ...baseCell, font: { ...baseCell.font, bold: true } }),
        ])
      );
      rowHeights.push({ hpt: 20 });
    });
  }

  const ws = XLSX.utils.aoa_to_sheet(aoa);
  ws["!merges"] = merges;
  ws["!rows"] = rowHeights;

  // Clean explicit column widths so nothing truncates or stretches
  const colWidths = [
    { wch: 6 },  // SL / #
    { wch: 24 }, // Name / Class
    { wch: 13 }, // ID / Total Students
    { wch: 11 }, // Roll / Residential
    { wch: 13 }, // Class / Non-Res
    { wch: 13 }, // Type / Lillah
  ];
  while (colWidths.length < totalCols - 1) {
    colWidths.push({ wch: 13 });
  }
  colWidths.push({ wch: 22 }); // Last column (Total or Meal Plan)
  ws["!cols"] = colWidths;

  const wb = XLSX.utils.book_new();
  XLSX.utils.book_append_sheet(wb, ws, "Meal Attendance");
  XLSX.writeFile(wb, filename);
};
