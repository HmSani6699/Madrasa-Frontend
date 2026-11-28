import React from "react";
import { User, GraduationCap, MapPin, ShieldCheck } from "lucide-react";
import { QrMatrixSvg } from "./QrMatrixSvg";
import { formatDateDisplay, toBanglaDigits } from "./printPresets";

const AdmitOrnamentCorner = ({ color, flip = false }) => (
  <svg
    viewBox="0 0 48 48"
    className={`w-7 h-7 pointer-events-none ${flip ? "scale-x-[-1]" : ""}`}
    fill="none"
  >
    <path d="M2,46 L2,10 Q2,2 10,2 L46,2" stroke={color} strokeWidth="2.5" />
    <path d="M8,36 L8,14 Q8,8 14,8 L36,8" stroke={color} strokeWidth="1" opacity="0.55" />
    <circle cx="11" cy="11" r="2.2" fill={color} />
  </svg>
);

const OttomanStrip = ({ primary, accent }) => (
  <div
    className="h-3 w-full"
    style={{
      backgroundImage: `repeating-linear-gradient(45deg, ${primary} 0, ${primary} 8px, ${accent} 8px, ${accent} 12px)`,
    }}
  />
);

export const AdmitCardRenderer = ({
  template = {},
  student = {},
  exam = {},
  schedules = [],
  madrasa = {},
  seatInfo = {},
}) => {
  const presetKey = template.preset_key || "islamic_heritage";
  const isCompact = presetKey === "compact_ticket" || template.density === "compact";
  const primary = template.primary_color || "#123628";
  const secondary = template.secondary_color || "#1C7D5A";
  const accent = template.accent_color || "#EAB33C";
  const paperBg = template.paper_bg || "#ffffff";

  const studentSchedules = (schedules || []).filter(
    (s) => !s.class_id || !student.class_id || String(s.class_id) === String(student.class_id)
  );
  const displaySchedules = studentSchedules.length > 0 ? studentSchedules : schedules || [];
  const rollStr = student.roll_number || "01";
  const idStr = student.student_id || student.admissionNo || "N/A";
  const roomNo = seatInfo.roomNo || displaySchedules[0]?.room_no || "হল রুম-০১";
  const seatNo = seatInfo.seatNo || `S-${toBanglaDigits(rollStr)}`;

  /* =========================
     COMPACT TICKET (4 per A4)
  ========================= */
  if (isCompact) {
    return (
      <div
        className="relative bg-white rounded-xl overflow-hidden border-2 flex flex-col justify-between shadow-sm avoid-break"
        style={{
          borderColor: primary,
          backgroundColor: paperBg,
          fontFamily: "'Baloo Da 2', 'Hind Siliguri', sans-serif",
          minHeight: "250px",
        }}
      >
        {/* Header */}
        <div style={{ backgroundColor: primary }} className="px-4 py-2 text-white flex items-center justify-between gap-2">
          <div className="flex items-center gap-2 min-w-0">
            {madrasa.logo && (
              <img src={madrasa.logo} alt="" className="w-7 h-7 rounded-full bg-white p-0.5 object-contain shrink-0" />
            )}
            <div className="min-w-0">
              <h4 className="text-[11px] font-extrabold truncate">{madrasa.name}</h4>
              <p className="text-[8px] opacity-85 truncate">{exam?.name || "বার্ষিক পরীক্ষা ২০২৬"}</p>
            </div>
          </div>
          <span
            className="px-2 py-0.5 rounded-md text-[8.5px] font-black shrink-0"
            style={{ backgroundColor: accent, color: primary }}
          >
            {template.title || "প্রবেশপত্র"}
          </span>
        </div>

        {/* Body */}
        <div className="p-3.5 flex gap-3 items-center flex-1">
          {template.show_photo !== false && (
            <div
              className="w-16 h-20 rounded-lg bg-slate-100 overflow-hidden flex items-center justify-center shrink-0"
              style={{ border: `2px solid ${secondary}` }}
            >
              {student.photo ? (
                <img src={student.photo} alt="" className="w-full h-full object-cover" />
              ) : (
                <User className="w-7 h-7 text-slate-300" />
              )}
            </div>
          )}
          <div className="flex-1 min-w-0 space-y-1 text-[10px]">
            <div className="flex items-center justify-between gap-2">
              <h3 className="text-[12.5px] font-black text-slate-900 truncate">{student.name}</h3>
              <span
                className="px-2 py-0.5 rounded font-black text-[9.5px] shrink-0"
                style={{ backgroundColor: `${primary}12`, color: primary }}
              >
                রোল: {toBanglaDigits(rollStr)}
              </span>
            </div>
            {student.fatherName && (
              <p className="text-slate-600 truncate">
                <span className="font-semibold text-slate-400">পিতা: </span>
                {student.fatherName}
              </p>
            )}
            <div className="grid grid-cols-2 gap-x-3 gap-y-0.5 text-[9.5px] pt-1">
              <div>
                <span className="text-slate-400">শ্রেণি: </span>
                <span className="font-bold text-slate-800">{student.class || "—"}</span>
              </div>
              <div>
                <span className="text-slate-400">আইডি: </span>
                <span className="font-bold text-slate-800">{idStr}</span>
              </div>
              {template.show_room_no !== false && (
                <div>
                  <span className="text-slate-400">কক্ষ: </span>
                  <span className="font-bold text-slate-800">{roomNo}</span>
                </div>
              )}
              {template.show_seat_no !== false && (
                <div>
                  <span className="text-slate-400">সিট: </span>
                  <span className="font-extrabold" style={{ color: secondary }}>
                    {seatNo}
                  </span>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="px-3.5 py-2 border-t border-dashed border-slate-200 flex items-end justify-between bg-slate-50/70">
          {template.show_qr !== false ? (
            <QrMatrixSvg value={`ADMIT|${exam?.name || "EXAM"}|${idStr}|${rollStr}`} size={30} fg={primary} />
          ) : (
            <div />
          )}
          <div className="flex gap-6 text-center">
            <div>
              <div className="w-20 border-b border-slate-400 mb-0.5" />
              <span className="text-[7.5px] font-bold text-slate-600">{template.left_sign_label || "পরীক্ষা নিয়ন্ত্রক"}</span>
            </div>
            <div>
              <div className="w-20 border-b border-slate-400 mb-0.5" />
              <span className="text-[7.5px] font-bold text-slate-600">{template.right_sign_label || "মুহতামিম"}</span>
            </div>
          </div>
        </div>
      </div>
    );
  }

  /* =========================
     STANDARD ADMIT CARD (2 per A4 or Full)
  ========================= */
  return (
    <div
      className="relative rounded-2xl overflow-hidden shadow-md avoid-break"
      style={{
        backgroundColor: paperBg,
        border: `2.5px solid ${primary}`,
        fontFamily: "'Baloo Da 2', 'Hind Siliguri', sans-serif",
      }}
    >
      {/* Top decorative strip for Ottoman / Executive */}
      {presetKey === "ottoman_tile" && <OttomanStrip primary={primary} accent={accent} />}
      {presetKey !== "ottoman_tile" && (
        <div className="h-2 w-full" style={{ background: `linear-gradient(90deg, ${primary}, ${accent}, ${secondary})` }} />
      )}

      {/* Corner Ornaments */}
      {(presetKey === "islamic_heritage" || presetKey === "mihrab_arch" || presetKey === "kufi_heritage") && (
        <>
          <div className="absolute top-3 left-2 z-10">
            <AdmitOrnamentCorner color={accent} />
          </div>
          <div className="absolute top-3 right-2 z-10">
            <AdmitOrnamentCorner color={accent} flip />
          </div>
        </>
      )}

      {/* Masjid Silhouette Watermark */}
      {presetKey === "masjid_silhouette" && (
        <svg viewBox="0 0 400 90" className="absolute bottom-10 left-0 w-full opacity-[0.045] pointer-events-none">
          <path
            d="M0,90 L0,65 L35,65 L35,30 L42,15 L49,30 L49,65 L110,65 Q140,25 170,65 L185,65 Q200,15 215,65 L230,65 Q260,25 290,65 L351,65 L351,30 L358,15 L365,30 L365,65 L400,65 L400,90 Z"
            fill={primary}
          />
        </svg>
      )}

      <div className="p-5 sm:p-6 relative z-10 space-y-4">
        {/* Institution Header */}
        <div className="flex items-center justify-between gap-4 pb-3 border-b-2" style={{ borderColor: `${primary}25` }}>
          <div className="flex items-center gap-3 min-w-0">
            <div
              className="w-14 h-14 rounded-2xl bg-white p-1 shadow-sm flex items-center justify-center shrink-0"
              style={{ border: `1.5px solid ${accent}` }}
            >
              {madrasa.logo ? (
                <img src={madrasa.logo} alt="Logo" className="w-full h-full object-contain" />
              ) : (
                <GraduationCap className="w-7 h-7" style={{ color: primary }} />
              )}
            </div>
            <div className="min-w-0">
              {template.show_bismillah !== false && (
                <p className="font-arabic text-xs leading-none mb-1" style={{ color: secondary }}>
                  بِسْمِ اللَّهِ الرَّحْمَٰنِ الرَّحِيمِ • {template.arabic_title || "بطاقة دخول الامتحان"}
                </p>
              )}
              <h2 className="text-base sm:text-lg font-black leading-tight truncate" style={{ color: primary }}>
                {madrasa.name}
              </h2>
              <p className="text-[10.5px] font-semibold text-slate-500 flex items-center gap-1 truncate">
                <MapPin className="w-3 h-3 shrink-0" style={{ color: secondary }} />
                {madrasa.address} {madrasa.phone ? `• ফোন: ${toBanglaDigits(madrasa.phone)}` : ""}
              </p>
            </div>
          </div>

          <div className="text-right shrink-0">
            <div
              className="inline-block px-3.5 py-1 rounded-lg text-[11px] font-black tracking-wide shadow-xs"
              style={{ backgroundColor: primary, color: "#ffffff", borderBottom: `3px solid ${accent}` }}
            >
              {template.title || "প্রবেশপত্র / ADMIT CARD"}
            </div>
            <p className="text-[10.5px] font-extrabold mt-1" style={{ color: secondary }}>
              {exam?.name || "বার্ষিক পরীক্ষা ২০২৬"}
            </p>
          </div>
        </div>

        {/* Candidate Information Row */}
        <div className="flex flex-col sm:flex-row gap-4 items-stretch">
          {template.show_photo !== false && (
            <div className="flex flex-col items-center justify-center shrink-0">
              <div
                className="w-24 h-28 rounded-xl bg-slate-100 overflow-hidden flex items-center justify-center shadow-inner"
                style={{ border: `2px solid ${secondary}` }}
              >
                {student.photo ? (
                  <img src={student.photo} alt={student.name} className="w-full h-full object-cover" />
                ) : (
                  <User className="w-10 h-10 text-slate-300" />
                )}
              </div>
              <span className="text-[9px] font-bold text-slate-500 mt-1">পরীক্ষার্থীর ছবি</span>
            </div>
          )}

          <div className="flex-1 grid grid-cols-2 sm:grid-cols-3 gap-2.5 bg-white/80 rounded-xl p-3 border border-slate-200/80 text-xs">
            <div className="col-span-2 sm:col-span-2">
              <span className="text-[9.5px] font-bold text-slate-400 block">পরীক্ষার্থীর নাম</span>
              <span className="text-sm font-black text-slate-900">{student.name || "—"}</span>
            </div>
            <div className="text-left sm:text-right">
              <span className="text-[9.5px] font-bold text-slate-400 block">রোল নম্বর</span>
              <span
                className="inline-block px-2.5 py-0.5 rounded-md text-xs font-black"
                style={{ backgroundColor: `${accent}30`, color: primary }}
              >
                {toBanglaDigits(rollStr)}
              </span>
            </div>

            <div>
              <span className="text-[9.5px] font-bold text-slate-400 block">পিতার নাম</span>
              <span className="font-bold text-slate-800">{student.fatherName || "—"}</span>
            </div>
            <div>
              <span className="text-[9.5px] font-bold text-slate-400 block">শ্রেণি / জামাত</span>
              <span className="font-bold text-slate-800">
                {student.class || "—"} {student.section ? `(${student.section})` : ""}
              </span>
            </div>
            <div className="text-left sm:text-right">
              <span className="text-[9.5px] font-bold text-slate-400 block">দাখেলা / আইডি</span>
              <span className="font-mono font-bold text-slate-700">{idStr}</span>
            </div>

            {template.show_room_no !== false && (
              <div>
                <span className="text-[9.5px] font-bold text-slate-400 block">পরীক্ষার হল / কক্ষ</span>
                <span className="font-bold text-slate-800">{roomNo}</span>
              </div>
            )}
            {template.show_seat_no !== false && (
              <div>
                <span className="text-[9.5px] font-bold text-slate-400 block">সিট নম্বর</span>
                <span className="font-extrabold" style={{ color: secondary }}>
                  {seatNo}
                </span>
              </div>
            )}
            <div>
              <span className="text-[9.5px] font-bold text-slate-400 block">শিক্ষাবর্ষ</span>
              <span className="font-bold text-slate-800">{toBanglaDigits(student.academicYear || new Date().getFullYear())}</span>
            </div>
          </div>
        </div>

        {/* Dynamic Exam Schedule Table */}
        {template.show_subject_table !== false && (
          <div className="rounded-xl overflow-hidden border" style={{ borderColor: `${primary}25` }}>
            <div
              className="px-3 py-1.5 text-[10px] font-black uppercase tracking-wider flex items-center justify-between"
              style={{ backgroundColor: `${primary}10`, color: primary }}
            >
              <span>পরীক্ষার সময়সূচি (Exam Schedule)</span>
              <span>{displaySchedules.length > 0 ? `${toBanglaDigits(displaySchedules.length)}টি বিষয়` : "নমুনা সূচি"}</span>
            </div>
            <table className="w-full text-[10px] border-collapse bg-white">
              <thead>
                <tr className="bg-slate-50 text-slate-600 border-b border-slate-200">
                  <th className="py-1.5 px-2.5 text-left font-bold">তারিখ</th>
                  <th className="py-1.5 px-2.5 text-left font-bold">বিষয় / কিতাব</th>
                  <th className="py-1.5 px-2.5 text-center font-bold">সময়</th>
                  <th className="py-1.5 px-2.5 text-right font-bold">কক্ষ</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {(displaySchedules.length > 0
                  ? displaySchedules.slice(0, 8)
                  : [
                      { exam_date: new Date(), subjectName: "কুরআন ও তাজবিদ", start_time: "09:00", end_time: "12:00", room_no: roomNo },
                      { exam_date: new Date(Date.now() + 86400000), subjectName: "আরবি সাহিত্য ও ব্যাকরণ", start_time: "09:00", end_time: "12:00", room_no: roomNo },
                    ]
                ).map((sch, idx) => (
                  <tr key={idx}>
                    <td className="py-1 px-2.5 font-semibold text-slate-700">{formatDateDisplay(sch.exam_date, true)}</td>
                    <td className="py-1 px-2.5 font-bold text-slate-800">
                      {sch.subjectName} {sch.subjectCode ? `(${sch.subjectCode})` : ""}
                    </td>
                    <td className="py-1 px-2.5 text-center text-slate-600">
                      {sch.start_time || "০৯:০০"} – {sch.end_time || "১২:০০"}
                    </td>
                    <td className="py-1 px-2.5 text-right font-semibold text-slate-600">{sch.room_no || roomNo}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}

        {/* Instructions + QR + Signatures */}
        <div className="grid grid-cols-1 sm:grid-cols-12 gap-3 items-end pt-1">
          <div className="sm:col-span-7 space-y-1">
            <p className="text-[10px] font-black uppercase tracking-wider" style={{ color: primary }}>
              পরীক্ষার্থীর জন্য নির্দেশাবলি:
            </p>
            <ul className="space-y-0.5 text-[9.5px] text-slate-600 list-disc pl-4">
              {(template.instructions || []).filter(Boolean).slice(0, 4).map((inst, i) => (
                <li key={i}>{inst}</li>
              ))}
            </ul>
          </div>

          <div className="sm:col-span-5 flex items-end justify-between gap-2 pt-2">
            {template.show_qr !== false && (
              <div className="flex flex-col items-center">
                <div className="p-1 bg-white border border-slate-200 rounded-md">
                  <QrMatrixSvg value={`ADMIT|${exam?.name || "EXAM"}|${idStr}|${rollStr}`} size={40} fg={primary} />
                </div>
                <span className="text-[7px] font-bold text-slate-400 mt-0.5">যাচাই কিউআর</span>
              </div>
            )}

            <div className="flex gap-4 text-center ml-auto">
              <div>
                <div className="w-24 border-b border-slate-400 h-6 mb-1" />
                <span className="text-[8.5px] font-bold text-slate-700">{template.left_sign_label || "পরীক্ষা নিয়ন্ত্রক"}</span>
              </div>
              <div>
                <div className="w-24 border-b border-slate-400 h-6 mb-1" />
                <span className="text-[8.5px] font-bold text-slate-700">{template.right_sign_label || "মুহতামিম / অধ্যক্ষ"}</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

/* =========================
   EXAM DESK SEAT STICKER
========================= */
export const SeatStickerCard = ({ student = {}, exam = {}, madrasa = {}, seatInfo = {}, primaryColor = "#123628", accentColor = "#EAB33C" }) => {
  const rollStr = student.roll_number || "01";
  const seatNo = seatInfo.seatNo || `S-${toBanglaDigits(rollStr)}`;
  const roomNo = seatInfo.roomNo || "হল রুম-০১";

  return (
    <div
      className="bg-white rounded-xl border-2 border-dashed p-3 flex flex-col justify-between shadow-xs avoid-break"
      style={{ borderColor: primaryColor, fontFamily: "'Baloo Da 2', 'Hind Siliguri', sans-serif" }}
    >
      <div className="flex items-center justify-between gap-2 pb-1.5 border-b" style={{ borderColor: `${primaryColor}20` }}>
        <div className="flex items-center gap-1.5 min-w-0">
          {madrasa.logo && <img src={madrasa.logo} alt="" className="w-5 h-5 rounded-full object-contain shrink-0" />}
          <span className="text-[9.5px] font-extrabold truncate" style={{ color: primaryColor }}>
            {madrasa.name}
          </span>
        </div>
        <span className="text-[8px] font-black px-1.5 py-0.5 rounded" style={{ backgroundColor: accentColor, color: primaryColor }}>
          সিট স্টিকার
        </span>
      </div>

      <div className="py-2 flex items-center justify-between gap-2">
        <div className="min-w-0">
          <p className="text-[8.5px] font-bold text-slate-400 truncate">{exam?.name || "পরীক্ষা ২০২৬"}</p>
          <h4 className="text-xs font-black text-slate-900 truncate">{student.name}</h4>
          <p className="text-[9.5px] font-bold text-slate-600">
            {student.class} {student.section ? `• ${student.section}` : ""}
          </p>
        </div>
        <div
          className="px-3 py-1.5 rounded-lg text-center shrink-0"
          style={{ backgroundColor: primaryColor, color: "#ffffff" }}
        >
          <span className="text-[7.5px] uppercase block opacity-80">রোল</span>
          <span className="text-base font-black leading-none">{toBanglaDigits(rollStr)}</span>
        </div>
      </div>

      <div className="flex items-center justify-between text-[8.5px] font-bold pt-1 border-t border-slate-100 text-slate-600">
        <span>কক্ষ: {roomNo}</span>
        <span style={{ color: primaryColor }}>সিট: {seatNo}</span>
      </div>
    </div>
  );
};
