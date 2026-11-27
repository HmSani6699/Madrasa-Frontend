import {
  WEEKDAY_KEYS,
  WEEKDAY_BN,
  WEEK_ORDINAL_BN,
  toBanglaDigits,
  formatBanglaMonthYear,
} from "./hifzUtils";

const escapeHtml = (str) => {
  if (str === null || str === undefined) return "";
  return String(str)
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#39;");
};

const renderSingleKhataPageHtml = ({
  madrasa,
  studentName = "",
  rollNumber = "",
  className = "",
  monthLabel = "",
  yearLabel = "",
  weekNumber = 1,
  days = [],
  weeklyReview = {},
  blankMode = false,
}) => {
  const rows = blankMode
    ? WEEKDAY_KEYS.map((key) => ({
        weekdayBn: WEEKDAY_BN[key],
        attendance: "",
        sabak: { para: "", page: "" },
        sat_sabak: { para: "", page: "", amount: "", mistakes: "" },
        amukhta: { para: "", page: "", amount: "", mistakes: "" },
        daily_tilawat: "",
        teacher_signature: "",
        shortDateBn: "",
      }))
    : days;

  const weekPills = WEEK_ORDINAL_BN.map((ord, idx) => {
    const active = !blankMode && idx + 1 === weekNumber;
    return `<span class="week-pill ${active ? "active" : ""}">${ord}</span>`;
  }).join(" / ");

  const attLabel = (val) => {
    if (!val) return "";
    if (val === "উপস্থিত") return `<span class="att-p">উপস্থিত</span>`;
    if (val === "অনুপস্থিত") return `<span class="att-a">অনুপস্থিত</span>`;
    if (val === "ছুটি") return `<span class="att-l">ছুটি</span>`;
    return escapeHtml(val);
  };

  return `
    <div class="khata-page">
      <div class="madrasa-banner">
        <div class="madrasa-brand">
          ${
            madrasa?.logo
              ? `<img src="${escapeHtml(madrasa.logo)}" alt="Logo" class="logo" onerror="this.style.display='none'" />`
              : ""
          }
          <div>
            <div class="madrasa-name">${escapeHtml(madrasa?.name || "হিফজ বিভাগ — তথ্য খাতা")}</div>
            ${
              madrasa?.address || madrasa?.phone
                ? `<div class="madrasa-sub">${escapeHtml(madrasa?.address || "")} ${
                    madrasa?.phone ? `| ফোন: ${escapeHtml(madrasa.phone)}` : ""
                  }</div>`
                : ""
            }
          </div>
        </div>
        ${className ? `<div class="class-badge">ক্লাস: ${escapeHtml(className)}</div>` : ""}
      </div>

      <div class="khata-meta">
        <div class="title-box">সাপ্তাহিক তথ্য-</div>
        <div class="meta-lines">
          <div class="meta-row">
            <span class="meta-label">ছাত্র/ছাত্রীর নাম :</span>
            <span class="meta-val">${
              blankMode
                ? "&nbsp;"
                : `${escapeHtml(studentName)}${
                    rollNumber ? ` (রোল ${escapeHtml(toBanglaDigits(rollNumber))})` : ""
                  }`
            }</span>
          </div>
          <div class="meta-row-split">
            <div class="meta-row">
              <span class="meta-label">মাস :</span>
              <span class="meta-val">${blankMode ? "&nbsp;" : escapeHtml(monthLabel)}</span>
            </div>
            <div class="meta-row">
              <span class="meta-label">সন :</span>
              <span class="meta-val">${blankMode ? "&nbsp;" : escapeHtml(yearLabel)}</span>
            </div>
          </div>
        </div>
      </div>

      <table class="khata-table">
        <thead>
          <tr>
            <th rowspan="2" style="width: 72px;">বার</th>
            <th rowspan="2" style="width: 58px;">উপস্থিতি</th>
            <th colspan="2">সবক</th>
            <th colspan="4">সাত সবক</th>
            <th colspan="4">আমুখতা</th>
            <th rowspan="2" style="width: 78px;">দৈনিক তিলাওয়াত</th>
            <th rowspan="2" style="width: 74px;">শিক্ষকের স্বাক্ষর</th>
            <th rowspan="2" style="width: 62px;">তারিখ</th>
          </tr>
          <tr>
            <th style="width: 44px;">পারা</th>
            <th style="width: 44px;">পৃষ্ঠা</th>
            <th style="width: 44px;">পারা</th>
            <th style="width: 44px;">পৃষ্ঠা</th>
            <th style="width: 56px;">পরিমাণ</th>
            <th style="width: 38px;">ভুল</th>
            <th style="width: 44px;">পারা</th>
            <th style="width: 44px;">পৃষ্ঠা</th>
            <th style="width: 56px;">পরিমাণ</th>
            <th style="width: 38px;">ভুল</th>
          </tr>
        </thead>
        <tbody>
          ${rows
            .map(
              (r) => `
            <tr>
              <td class="day-cell">${escapeHtml(r.weekdayBn)}</td>
              <td class="center">${attLabel(r.attendance)}</td>
              <td class="center">${escapeHtml(r.sabak?.para || "")}</td>
              <td class="center">${escapeHtml(r.sabak?.page || "")}</td>
              <td class="center">${escapeHtml(r.sat_sabak?.para || "")}</td>
              <td class="center">${escapeHtml(r.sat_sabak?.page || "")}</td>
              <td class="center">${escapeHtml(r.sat_sabak?.amount || "")}</td>
              <td class="center err">${
                r.sat_sabak?.mistakes !== "" && r.sat_sabak?.mistakes !== undefined
                  ? escapeHtml(toBanglaDigits(r.sat_sabak.mistakes))
                  : ""
              }</td>
              <td class="center">${escapeHtml(r.amukhta?.para || "")}</td>
              <td class="center">${escapeHtml(r.amukhta?.page || "")}</td>
              <td class="center">${escapeHtml(r.amukhta?.amount || "")}</td>
              <td class="center err">${
                r.amukhta?.mistakes !== "" && r.amukhta?.mistakes !== undefined
                  ? escapeHtml(toBanglaDigits(r.amukhta.mistakes))
                  : ""
              }</td>
              <td class="center">${escapeHtml(r.daily_tilawat || "")}</td>
              <td class="center sig">${escapeHtml(r.teacher_signature || "")}</td>
              <td class="center date-cell">${escapeHtml(r.shortDateBn || "")}</td>
            </tr>`
            )
            .join("")}
        </tbody>
      </table>

      <div class="bottom-grid">
        <div class="bottom-box">
          <div class="week-line">সপ্তাহ: ${weekPills}</div>
          <div class="field-label">বণ্টনকৃত সাপ্তাহিক শনিবার পারাসমূহ</div>
          <div class="field-box">${
            blankMode ? "&nbsp;" : escapeHtml(weeklyReview?.assigned_saturday_paras || "")
          }</div>
        </div>
        <div class="bottom-box">
          <div class="field-title">তিলাওয়াতকৃত সাপ্তাহিক শনিবার পারা</div>
          <div class="sat-grid">
            <div>
              <div class="sub-label">মোট</div>
              <div class="field-box">${
                blankMode ? "&nbsp;" : escapeHtml(weeklyReview?.recited_total_paras || "")
              }</div>
            </div>
            <div>
              <div class="sub-label">কোন কোন পারা</div>
              <div class="field-box">${
                blankMode ? "&nbsp;" : escapeHtml(weeklyReview?.recited_which_paras || "")
              }</div>
            </div>
            <div>
              <div class="sub-label">মোট লোকমার সংখ্যা</div>
              <div class="field-box">${
                blankMode ||
                weeklyReview?.saturday_lokma_count === "" ||
                weeklyReview?.saturday_lokma_count === undefined
                  ? "&nbsp;"
                  : escapeHtml(toBanglaDigits(weeklyReview.saturday_lokma_count))
              }</div>
            </div>
          </div>
        </div>
      </div>

      <div class="print-footer">
        <span>প্রধান উস্তাদের স্বাক্ষর: _____________________</span>
        <span>অভিভাবকের স্বাক্ষর: _____________________</span>
        <span>মুহতামিম / নাজিমে তালিমাত: _____________________</span>
      </div>
    </div>
  `;
};

const openKhataPrintWindow = (title, pagesHtml) => {
  const win = window.open("", "_blank", "width=1100,height=780");
  if (!win) {
    throw new Error("পপ-আপ ব্লক করা আছে। অনুগ্রহ করে ব্রাউজারের পপ-আপ অনুমতি দিন।");
  }

  const html = `
    <!DOCTYPE html>
    <html lang="bn">
    <head>
      <meta charset="UTF-8" />
      <title>${escapeHtml(title)}</title>
      <link rel="preconnect" href="https://fonts.googleapis.com" />
      <link href="https://fonts.googleapis.com/css2?family=Baloo+Da+2:wght@400;500;600;700&display=swap" rel="stylesheet" />
      <style>
        @page { size: A4 landscape; margin: 9mm; }
        * { box-sizing: border-box; }
        body {
          margin: 0;
          padding: 0;
          font-family: 'Baloo Da 2', 'Hind Siliguri', Arial, sans-serif;
          color: #0f172a;
          background: #fff;
        }
        .khata-page {
          page-break-after: always;
          border: 1.5px solid #123628;
          border-radius: 8px;
          padding: 12px 14px;
          background: #fff;
        }
        .khata-page:last-child { page-break-after: auto; }
        .madrasa-banner {
          display: flex;
          align-items: center;
          justify-content: space-between;
          border-bottom: 1.5px solid #1C7D5A;
          padding-bottom: 6px;
          margin-bottom: 8px;
        }
        .madrasa-brand { display: flex; align-items: center; gap: 10px; }
        .logo { width: 34px; height: 34px; object-fit: contain; border-radius: 6px; }
        .madrasa-name { font-size: 16px; font-weight: 700; color: #123628; }
        .madrasa-sub { font-size: 11px; color: #475569; }
        .class-badge {
          background: #e8f5f0;
          color: #123628;
          border: 1px solid #1C7D5A;
          padding: 2px 10px;
          border-radius: 999px;
          font-size: 12px;
          font-weight: 700;
        }
        .khata-meta {
          display: flex;
          align-items: center;
          gap: 14px;
          margin-bottom: 8px;
        }
        .title-box {
          border: 1.5px solid #123628;
          border-radius: 6px;
          padding: 6px 14px;
          font-size: 17px;
          font-weight: 700;
          color: #123628;
          background: #e8f5f0;
          white-space: nowrap;
        }
        .meta-lines { flex: 1; font-size: 12.5px; }
        .meta-row { display: flex; align-items: baseline; gap: 6px; margin-bottom: 2px; }
        .meta-row-split { display: grid; grid-template-columns: 1fr 1fr; gap: 16px; }
        .meta-label { font-weight: 700; color: #1e293b; white-space: nowrap; }
        .meta-val {
          flex: 1;
          border-bottom: 1px dashed #64748b;
          padding-bottom: 1px;
          font-weight: 600;
          color: #0f172a;
        }
        .khata-table {
          width: 100%;
          border-collapse: collapse;
          font-size: 11.5px;
          margin-bottom: 8px;
        }
        .khata-table th, .khata-table td {
          border: 1px solid #94a3b8;
          padding: 4px 5px;
          height: 28px;
        }
        .khata-table thead th {
          background: #e8f5f0;
          color: #123628;
          font-weight: 700;
          text-align: center;
        }
        .day-cell { font-weight: 700; color: #123628; background: #f8fafc; }
        .center { text-align: center; }
        .err { color: #dc2626; font-weight: 700; }
        .sig { font-size: 10.5px; }
        .date-cell { font-size: 10.5px; color: #334155; white-space: nowrap; }
        .att-p { color: #15803d; font-weight: 600; font-size: 10.5px; }
        .att-a { color: #dc2626; font-weight: 700; font-size: 10.5px; }
        .att-l { color: #d97706; font-weight: 600; font-size: 10.5px; }
        .bottom-grid {
          display: grid;
          grid-template-columns: 1fr 1.2fr;
          gap: 10px;
          margin-top: 4px;
        }
        .bottom-box {
          border: 1px solid #94a3b8;
          border-radius: 6px;
          padding: 7px 10px;
          font-size: 11.5px;
        }
        .week-line { font-weight: 600; margin-bottom: 5px; color: #1e293b; }
        .week-pill { display: inline-block; padding: 0 5px; border-radius: 999px; }
        .week-pill.active {
          border: 1.5px solid #1C7D5A;
          background: #e8f5f0;
          color: #123628;
          font-weight: 700;
        }
        .field-title { font-weight: 700; color: #123628; margin-bottom: 4px; }
        .field-label, .sub-label { font-size: 10.5px; color: #475569; margin-bottom: 2px; font-weight: 600; }
        .field-box {
          border: 1px solid #cbd5e1;
          border-radius: 4px;
          padding: 4px 8px;
          min-height: 24px;
          font-weight: 600;
          background: #f8fafc;
        }
        .sat-grid {
          display: grid;
          grid-template-columns: 0.7fr 1.4fr 0.8fr;
          gap: 8px;
        }
        .print-footer {
          display: flex;
          justify-content: space-between;
          margin-top: 14px;
          font-size: 11px;
          color: #475569;
          padding-top: 4px;
        }
        @media print {
          body { -webkit-print-color-adjust: exact; print-color-adjust: exact; }
        }
      </style>
    </head>
    <body>
      ${pagesHtml}
      <script>
        window.onload = function() {
          setTimeout(function() { window.print(); }, 350);
        };
      </script>
    </body>
    </html>
  `;
  win.document.open();
  win.document.write(html);
  win.document.close();
};

export const printSingleWeekKhata = ({ madrasa, khataData, className = "" }) => {
  if (!khataData) return;
  const pageHtml = renderSingleKhataPageHtml({
    madrasa,
    studentName: khataData.student?.name || "",
    rollNumber: khataData.student?.roll_number || "",
    className,
    monthLabel: khataData.weekInfo?.monthNameBn || "",
    yearLabel: `${khataData.weekInfo?.yearBn || ""} ইং`,
    weekNumber: khataData.weekInfo?.weekNumber || 1,
    days: khataData.days || [],
    weeklyReview: khataData.weekly_review || {},
  });
  openKhataPrintWindow(
    `হিফজ সাপ্তাহিক খাতা - ${khataData.student?.name || ""}`,
    pageHtml
  );
};

export const printStudentMonthKhata = ({ madrasa, printData }) => {
  const students = printData?.students || [];
  if (students.length === 0) return;
  const monthLabel = formatBanglaMonthYear(printData.month);
  const pagesHtml = students
    .flatMap((st) =>
      (st.weeks || []).map((wk) =>
        renderSingleKhataPageHtml({
          madrasa,
          studentName: st.name,
          rollNumber: st.roll_number,
          className: st.class_name,
          monthLabel: wk.weekInfo?.monthNameBn || monthLabel,
          yearLabel: `${wk.weekInfo?.yearBn || ""} ইং`,
          weekNumber: wk.weekNumber || 1,
          days: wk.days || [],
          weeklyReview: wk.weekly_review || {},
        })
      )
    )
    .join("");

  openKhataPrintWindow(
    `হিফজ মাসিক খাতা - ${students.length === 1 ? students[0].name : "পুরো ক্লাস"}`,
    pagesHtml
  );
};

export const printBlankKhataForm = ({ madrasa, className = "" }) => {
  const pageHtml = renderSingleKhataPageHtml({
    madrasa,
    className,
    blankMode: true,
  });
  openKhataPrintWindow("ফাঁকা হিফজ তথ্য খাতা", pageHtml);
};
