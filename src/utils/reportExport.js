const csvEscape = (value) => {
  const str = String(value ?? "");
  return /[",\n\r]/.test(str) ? `"${str.replace(/"/g, '""')}"` : str;
};

export const formatBDT = (amount) => {
  const num = Number(amount || 0);
  return `৳ ${num.toLocaleString("en-US")}`;
};

export const exportToCSV = ({ filename, headers, rows, totalRow = null }) => {
  const lines = [
    headers.map(csvEscape).join(","),
    ...rows.map((row) => row.map(csvEscape).join(",")),
  ];
  if (totalRow) {
    lines.push(totalRow.map(csvEscape).join(","));
  }
  const csv = "\uFEFF" + lines.join("\n");
  const blob = new Blob([csv], { type: "text/csv;charset=utf-8;" });
  const url = URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = url;
  a.download = `${filename}-${new Date().toISOString().split("T")[0]}.csv`;
  a.click();
  URL.revokeObjectURL(url);
};

const escapeHtml = (val) =>
  String(val ?? "")
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;");

export const printHtmlReport = ({
  title,
  subtitle = "",
  madrasaName = "মাদ্রাসা ব্যবস্থাপনা",
  madrasaAddress = "",
  summaryItems = [],
  columns = [],
  rows = [],
}) => {
  const iframe = document.createElement("iframe");
  iframe.style.display = "none";
  document.body.appendChild(iframe);

  const summaryHtml =
    summaryItems.length > 0
      ? `<div class="summary-grid">${summaryItems
          .map(
            (item) =>
              `<div class="summary-box">
                 <div class="summary-label">${escapeHtml(item.label)}</div>
                 <div class="summary-val">${escapeHtml(item.value)}</div>
               </div>`
          )
          .join("")}</div>`
      : "";

  const headerHtml = `<tr>${columns
    .map(
      (col) =>
        `<th style="text-align:${col.align || "left"}">${escapeHtml(col.label)}</th>`
    )
    .join("")}</tr>`;

  const bodyHtml = rows
    .map(
      (row) =>
        `<tr>${columns
          .map(
            (col, idx) =>
              `<td style="text-align:${col.align || "left"}">${escapeHtml(row[idx] ?? "-")}</td>`
          )
          .join("")}</tr>`
    )
    .join("");

  const doc = iframe.contentWindow.document;
  doc.open();
  doc.write(`
    <!DOCTYPE html>
    <html>
      <head>
        <title>${escapeHtml(title)}</title>
        <style>
          @page { size: A4 landscape; margin: 12mm; }
          body { font-family: 'Segoe UI', Tahoma, Arial, sans-serif; color: #1e293b; margin: 0; padding: 0; font-size: 12px; }
          .header { text-align: center; border-bottom: 2px solid #1C7D5A; padding-bottom: 10px; margin-bottom: 14px; }
          .header h1 { margin: 0; font-size: 20px; color: #0f172a; }
          .header .addr { margin: 2px 0 6px; font-size: 11px; color: #475569; }
          .header .report-title { display: inline-block; background: #1C7D5A; color: #fff; padding: 4px 14px; border-radius: 999px; font-weight: 700; font-size: 12px; }
          .meta { display: flex; justify-content: space-between; font-size: 11px; color: #64748b; margin-bottom: 12px; }
          .summary-grid { display: flex; gap: 10px; margin-bottom: 14px; flex-wrap: wrap; }
          .summary-box { flex: 1; min-width: 140px; border: 1px solid #cbd5e1; border-radius: 6px; padding: 8px 12px; background: #f8fafc; }
          .summary-label { font-size: 10px; color: #64748b; font-weight: 700; text-transform: uppercase; }
          .summary-val { font-size: 15px; font-weight: 800; color: #0f172a; margin-top: 2px; }
          table { width: 100%; border-collapse: collapse; margin-top: 6px; }
          th { background: #e8f3ef; color: #0f172a; font-weight: 700; padding: 8px 10px; border: 1px solid #cbd5e1; font-size: 11px; }
          td { padding: 7px 10px; border: 1px solid #e2e8f0; font-size: 11px; }
          tr:nth-child(even) td { background: #f8fafc; }
          .footer { margin-top: 18px; display: flex; justify-content: space-between; font-size: 10px; color: #64748b; border-top: 1px dashed #cbd5e1; padding-top: 8px; }
        </style>
      </head>
      <body>
        <div class="header">
          <h1>${escapeHtml(madrasaName)}</h1>
          ${madrasaAddress ? `<div class="addr">${escapeHtml(madrasaAddress)}</div>` : ""}
          <div class="report-title">${escapeHtml(title)}</div>
        </div>
        <div class="meta">
          <span>${escapeHtml(subtitle)}</span>
          <span>প্রিন্ট তারিখ: ${new Date().toLocaleDateString("bn-BD")}</span>
        </div>
        ${summaryHtml}
        <table>
          <thead>${headerHtml}</thead>
          <tbody>${bodyHtml}</tbody>
        </table>
        <div class="footer">
          <span>মোট রেকর্ড: ${rows.length} টি</span>
          <span>স্বাক্ষর (হিসাবরক্ষক / মুহতামিম): ______________________</span>
        </div>
      </body>
    </html>
  `);
  doc.close();

  setTimeout(() => {
    iframe.contentWindow.focus();
    iframe.contentWindow.print();
    setTimeout(() => {
      document.body.removeChild(iframe);
    }, 1000);
  }, 300);
};

export const MONTH_OPTIONS = [
  { value: "all", label: "সকল মাস (All)", num: "all" },
  { value: "01", label: "জানুয়ারি (January)", num: 1 },
  { value: "02", label: "ফেব্রুয়ারি (February)", num: 2 },
  { value: "03", label: "মার্চ (March)", num: 3 },
  { value: "04", label: "এপ্রিল (April)", num: 4 },
  { value: "05", label: "মে (May)", num: 5 },
  { value: "06", label: "জুন (June)", num: 6 },
  { value: "07", label: "জুলাই (July)", num: 7 },
  { value: "08", label: "আগস্ট (August)", num: 8 },
  { value: "09", label: "সেপ্টেম্বর (September)", num: 9 },
  { value: "10", label: "অক্টোবর (October)", num: 10 },
  { value: "11", label: "নভেম্বর (November)", num: 11 },
  { value: "12", label: "ডিসেম্বর (December)", num: 12 },
];

export const getMonthLabelBn = (monthNum) => {
  const found = MONTH_OPTIONS.find((m) => m.num === Number(monthNum));
  return found ? found.label : String(monthNum || "-");
};
