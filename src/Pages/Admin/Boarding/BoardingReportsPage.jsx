import { useState, useEffect, useCallback } from "react";
import { Printer, FileBarChart, Loader2 } from "lucide-react";
import { toast } from "react-hot-toast";
import boardingService from "../../../services/boardingService";
import {
  WEEKDAYS_BN,
  formatCurrency,
  getCurrentMonthStr,
  getTodayDateStr,
} from "./boardingConstants";
import BoardingPageHeader from "./BoardingPageHeader";

const BoardingReportsPage = () => {
  const [selectedDate, setSelectedDate] = useState(getTodayDateStr());
  const [reportMonth, setReportMonth] = useState(getCurrentMonthStr());
  const [slipData, setSlipData] = useState(null);
  const [monthlyReport, setMonthlyReport] = useState(null);
  const [loading, setLoading] = useState(true);

  const fetchReports = useCallback(async () => {
    try {
      setLoading(true);
      const [slipRes, repRes] = await Promise.all([
        boardingService.getKitchenSlip(selectedDate),
        boardingService.getMonthlyReport(reportMonth),
      ]);
      if (slipRes.success) setSlipData(slipRes.data);
      if (repRes.success) setMonthlyReport(repRes.data);
    } catch {
      toast.error("রিপোর্ট লোড করতে সমস্যা হয়েছে");
    } finally {
      setLoading(false);
    }
  }, [selectedDate, reportMonth]);

  useEffect(() => {
    fetchReports();
  }, [fetchReports]);

  const handlePrintKitchenSlip = () => {
    if (!slipData) return;
    const printWin = window.open("", "_blank", "width=800,height=900");
    if (!printWin) return toast.error("পপ-আপ ব্লক করা আছে, অনুগ্রহ করে অনুমোদন দিন");

    const { counts, menuList, madrasa, date, weekday, guestMeals } = slipData;
    const html = `
      <!DOCTYPE html>
      <html lang="bn">
      <head>
        <meta charset="UTF-8" />
        <title>Daily Kitchen Summary Slip - ${date}</title>
        <style>
          body { font-family: 'Baloo Da 2', 'Hind Siliguri', Arial, sans-serif; padding: 24px; color: #0f172a; }
          .header { text-align: center; border-bottom: 2px solid #123628; padding-bottom: 12px; margin-bottom: 18px; }
          .header h1 { margin: 0; font-size: 22px; color: #123628; }
          .header p { margin: 4px 0 0; font-size: 13px; color: #475569; }
          .badge { display: inline-block; background: #1C7D5A; color: #fff; padding: 4px 12px; border-radius: 4px; font-weight: bold; font-size: 13px; margin-top: 8px; }
          table { width: 100%; border-collapse: collapse; margin-top: 14px; font-size: 14px; }
          th, td { border: 1px solid #cbd5e1; padding: 8px 10px; text-align: left; }
          th { background: #f1f5f9; font-weight: bold; }
          .center { text-align: center; }
          .total-row { background: #e8f5f0; font-weight: bold; font-size: 15px; }
          .section-title { font-size: 15px; font-weight: bold; margin-top: 20px; color: #123628; }
          .footer { margin-top: 36px; display: flex; justify-content: space-between; font-size: 12px; color: #475569; }
          .sig { border-top: 1px solid #64748b; padding-top: 6px; width: 180px; text-align: center; }
          @media print { body { padding: 10px; } }
        </style>
      </head>
      <body>
        <div class="header">
          <h1>${madrasa?.name || "মাদ্রাসা বোর্ডিং বিভাগ"}</h1>
          <p>${madrasa?.address || ""} ${madrasa?.phone ? `| ফোন: ${madrasa.phone}` : ""}</p>
          <div class="badge">ডেইলি কিচেন সামারি স্লিপ — ${date} (${WEEKDAYS_BN[weekday] || weekday})</div>
        </div>

        <div class="section-title">১. বেলার খাবারের মোট সংখ্যা (বাবুর্চি শিট)</div>
        <table>
          <thead>
            <tr>
              <th>বিবরণ</th>
              <th class="center">সকালের নাস্তা</th>
              <th class="center">দুপুরের খাবার</th>
              <th class="center">রাতের খাবার</th>
            </tr>
          </thead>
          <tbody>
            <tr>
              <td>ছাত্র সংখ্যা (বোর্ডিং)</td>
              <td class="center">${counts.student.breakfast}</td>
              <td class="center">${counts.student.lunch}</td>
              <td class="center">${counts.student.dinner}</td>
            </tr>
            <tr>
              <td>অতিথি / শিক্ষক / মেহমান</td>
              <td class="center">${counts.guest.breakfast}</td>
              <td class="center">${counts.guest.lunch}</td>
              <td class="center">${counts.guest.dinner}</td>
            </tr>
            <tr class="total-row">
              <td>সর্বমোট রান্নার সংখ্যা</td>
              <td class="center">${counts.total.breakfast} জন</td>
              <td class="center">${counts.total.lunch} জন</td>
              <td class="center">${counts.total.dinner} জন</td>
            </tr>
          </tbody>
        </table>

        <div class="section-title">২. আজকের নির্ধারিত মেনু ও সময়</div>
        <table>
          <thead>
            <tr>
              <th>বেলা</th>
              <th>সময়</th>
              <th>আজকের মেনু</th>
            </tr>
          </thead>
          <tbody>
            ${menuList
              .map(
                (m) => `
              <tr>
                <td><strong>${m.meal_name_bn}</strong></td>
                <td>${m.start_time} - ${m.end_time}</td>
                <td>${m.menu}</td>
              </tr>`
              )
              .join("")}
          </tbody>
        </table>

        ${
          guestMeals && guestMeals.length > 0
            ? `<div class="section-title">৩. অতিথি মিলের তালিকা</div>
               <p style="font-size:13px;">${guestMeals
                 .map((g) => `${g.guest_name} (${g.count} জন)`)
                 .join(", ")}</p>`
            : ""
        }

        <div class="footer">
          <div class="sig">বোর্ডিং সুপারভাইজার</div>
          <div class="sig">প্রধান বাবুর্চি</div>
          <div class="sig">মুহতামিম / অধ্যক্ষ</div>
        </div>
        <script>window.onload = function() { window.print(); }</script>
      </body>
      </html>
    `;
    printWin.document.write(html);
    printWin.document.close();
  };

  return (
    <div className="space-y-5 animate-in fade-in duration-500">
      <BoardingPageHeader
        title="কিচেন সামারি স্লিপ ও মাসিক রিপোর্ট"
        subtitle="বাবুর্চির জন্য প্রিন্টযোগ্য দৈনিক কিচেন শিট এবং মাসিক আয়-ব্যয়ের লাভ/ক্ষতি হিসাব"
        icon={FileBarChart}
      />

      {loading ? (
        <div className="bg-white rounded-[8px] border border-slate-200 p-12 text-center">
          <Loader2 className="w-7 h-7 animate-spin mx-auto text-[#1C7D5A] mb-2" />
          <p className="text-sm text-slate-500">রিপোর্ট লোড হচ্ছে...</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Daily Kitchen Slip */}
          <div className="bg-white rounded-[8px] border border-slate-200 p-5 shadow-sm">
            <div className="flex flex-wrap items-center justify-between gap-3 mb-4 pb-3 border-b border-slate-100">
              <div>
                <h3 className="font-bold text-slate-800 text-base">কিচেন সামারি স্লিপ</h3>
                <p className="text-xs text-slate-500">
                  বার: {WEEKDAYS_BN[slipData?.weekday] || ""}
                </p>
              </div>
              <div className="flex items-center gap-2">
                <input
                  type="date"
                  value={selectedDate}
                  onChange={(e) => setSelectedDate(e.target.value)}
                  className="px-3 py-1.5 text-xs border border-slate-200 rounded-lg font-medium"
                />
                <button
                  onClick={handlePrintKitchenSlip}
                  disabled={!slipData}
                  className="px-4 py-2 bg-[#1C7D5A] hover:bg-[#123628] text-white text-xs font-bold rounded-lg shadow-sm flex items-center gap-1.5 cursor-pointer disabled:opacity-50"
                >
                  <Printer className="w-4 h-4" /> প্রিন্ট স্লিপ
                </button>
              </div>
            </div>

            {slipData && (
              <div className="space-y-4">
                <div className="grid grid-cols-3 gap-3 text-center">
                  <div className="p-3 rounded-lg bg-emerald-50 border border-emerald-200">
                    <p className="text-xs font-semibold text-emerald-800">সকালের নাস্তা</p>
                    <p className="text-2xl font-extrabold text-[#123628] mt-1">
                      {slipData.counts.total.breakfast}
                    </p>
                    <p className="text-[11px] text-emerald-700 mt-0.5">
                      ছাত্র: {slipData.counts.student.breakfast} | অতিথি: {slipData.counts.guest.breakfast}
                    </p>
                  </div>
                  <div className="p-3 rounded-lg bg-emerald-50 border border-emerald-200">
                    <p className="text-xs font-semibold text-emerald-800">দুপুরের খাবার</p>
                    <p className="text-2xl font-extrabold text-[#123628] mt-1">
                      {slipData.counts.total.lunch}
                    </p>
                    <p className="text-[11px] text-emerald-700 mt-0.5">
                      ছাত্র: {slipData.counts.student.lunch} | অতিথি: {slipData.counts.guest.lunch}
                    </p>
                  </div>
                  <div className="p-3 rounded-lg bg-emerald-50 border border-emerald-200">
                    <p className="text-xs font-semibold text-emerald-800">রাতের খাবার</p>
                    <p className="text-2xl font-extrabold text-[#123628] mt-1">
                      {slipData.counts.total.dinner}
                    </p>
                    <p className="text-[11px] text-emerald-700 mt-0.5">
                      ছাত্র: {slipData.counts.student.dinner} | অতিথি: {slipData.counts.guest.dinner}
                    </p>
                  </div>
                </div>

                <div className="space-y-2 text-xs">
                  {slipData.menuList?.map((m) => (
                    <div
                      key={m.meal_name}
                      className="flex items-center justify-between p-2.5 bg-slate-50 rounded-md border border-slate-100"
                    >
                      <span className="font-bold text-slate-700">
                        {m.meal_name_bn} ({m.start_time})
                      </span>
                      <span className="text-slate-600">{m.menu}</span>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>

          {/* Monthly Income vs Expense Report */}
          <div className="bg-white rounded-[8px] border border-slate-200 p-5 shadow-sm">
            <div className="flex items-center justify-between gap-3 mb-4 pb-3 border-b border-slate-100">
              <div>
                <h3 className="font-bold text-slate-800 text-base">মাসিক আয়-ব্যয় ও মিল রেট রিপোর্ট</h3>
                <p className="text-xs text-slate-500">বোর্ডিং আদায় বনাম মোট বাজার খরচের লাভ/ক্ষতি</p>
              </div>
              <input
                type="month"
                value={reportMonth}
                onChange={(e) => setReportMonth(e.target.value)}
                className="px-3 py-1.5 text-xs border border-slate-200 rounded-lg font-semibold"
              />
            </div>

            {monthlyReport && (
              <div className="space-y-3">
                <div className="grid grid-cols-2 gap-3">
                  <div className="p-3 rounded-lg bg-emerald-50 border border-emerald-200">
                    <p className="text-xs text-emerald-800">মোট ফি আদায় (আয়)</p>
                    <p className="text-lg font-bold text-emerald-700">
                      {formatCurrency(monthlyReport.totalCollected)}
                    </p>
                    <p className="text-[11px] text-emerald-700/80">
                      বকেয়া: {formatCurrency(monthlyReport.totalDue)}
                    </p>
                  </div>
                  <div className="p-3 rounded-lg bg-rose-50 border border-rose-200">
                    <p className="text-xs text-rose-800">মোট বাজার খরচ (ব্যয়)</p>
                    <p className="text-lg font-bold text-rose-700">
                      {formatCurrency(monthlyReport.totalBazarCost)}
                    </p>
                    <p className="text-[11px] text-rose-700/80">
                      মোট মিল: {monthlyReport.totalMeals} | রেট: {formatCurrency(monthlyReport.mealRate)}
                    </p>
                  </div>
                </div>

                <div
                  className={`p-3.5 rounded-lg border flex items-center justify-between ${
                    monthlyReport.netProfitLoss >= 0
                      ? "bg-[#e8f5f0] border-emerald-300 text-[#123628]"
                      : "bg-rose-50 border-rose-300 text-rose-800"
                  }`}
                >
                  <span className="text-sm font-bold">
                    নিট ব্যালেন্স ({monthlyReport.netProfitLoss >= 0 ? "উদ্বৃত্ত / লাভ" : "ঘাটতি / ক্ষতি"}):
                  </span>
                  <span className="text-xl font-extrabold">
                    {formatCurrency(monthlyReport.netProfitLoss)}
                  </span>
                </div>

                <div className="grid grid-cols-3 gap-2 text-center text-xs pt-1">
                  <div className="p-2 bg-slate-50 rounded border border-slate-100">
                    <p className="text-slate-500">কাঁচাবাজার</p>
                    <p className="font-bold text-slate-800">
                      {formatCurrency(monthlyReport.bazarByCategory?.Fresh)}
                    </p>
                  </div>
                  <div className="p-2 bg-slate-50 rounded border border-slate-100">
                    <p className="text-slate-500">শুকনো বাজার</p>
                    <p className="font-bold text-slate-800">
                      {formatCurrency(monthlyReport.bazarByCategory?.Dry)}
                    </p>
                  </div>
                  <div className="p-2 bg-slate-50 rounded border border-slate-100">
                    <p className="text-slate-500">জ্বালানি</p>
                    <p className="font-bold text-slate-800">
                      {formatCurrency(monthlyReport.bazarByCategory?.Fuel)}
                    </p>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
};

export default BoardingReportsPage;
