import React from "react";
import { Award, ShieldCheck, User } from "lucide-react";
import { QrMatrixSvg } from "./QrMatrixSvg";
import { formatDateDisplay, interpolateCertificateBody, toBanglaDigits } from "./printPresets";

const CertificateCornerFiligree = ({ color, pos = "tl" }) => {
  const transforms = {
    tl: "",
    tr: "scale-x-[-1]",
    bl: "scale-y-[-1]",
    br: "scale-x-[-1] scale-y-[-1]",
  };
  return (
    <svg viewBox="0 0 90 90" className={`w-16 h-16 pointer-events-none ${transforms[pos]}`} fill="none">
      <path d="M4,86 L4,18 Q4,4 18,4 L86,4" stroke={color} strokeWidth="2.5" />
      <path d="M12,72 L12,24 Q12,12 24,12 L72,12" stroke={color} strokeWidth="1.2" opacity="0.65" />
      <path d="M4,30 Q22,28 28,4" stroke={color} strokeWidth="1.2" opacity="0.65" />
      <circle cx="18" cy="18" r="4" fill={color} opacity="0.9" />
      <circle cx="32" cy="12" r="2" fill={color} opacity="0.65" />
      <circle cx="12" cy="32" r="2" fill={color} opacity="0.65" />
    </svg>
  );
};

const GoldRibbonSeal = ({ primary, accent, label = "অনুমোদিত" }) => (
  <div className="relative flex flex-col items-center justify-center select-none">
    <div
      className="w-16 h-16 rounded-full flex flex-col items-center justify-center shadow-md border-4 border-double text-center p-1"
      style={{
        background: `radial-gradient(circle at 30% 30%, #fef08a, ${accent} 65%, #92400e 100%)`,
        borderColor: primary,
        color: primary,
      }}
    >
      <Award className="w-5 h-5" />
      <span className="text-[7px] font-black leading-none mt-0.5 uppercase">{label}</span>
    </div>
  </div>
);

export const CertificateRenderer = ({
  template = {},
  recipient = {},
  targetType = "student",
  madrasa = {},
  certificateNo = "CERT-2026-0001",
  issueDate = new Date(),
  customData = {},
  customBodyText = "",
}) => {
  const presetKey = template.preset_key || "royal_gold";
  const isLetterhead = presetKey === "official_letterhead" || template.layout === "portrait";
  const primary = template.primary_color || "#123628";
  const secondary = template.secondary_color || "#1C7D5A";
  const accent = template.accent_color || "#C99327";
  const paperBg = template.paper_bg || "#fffdf8";

  const vars = {
    name: recipient.name || "—",
    father_name: recipient.fatherName || recipient.father_name || "—",
    mother_name: recipient.motherName || recipient.mother_name || "—",
    class: recipient.class || "—",
    section: recipient.section || "—",
    roll: recipient.roll_number ? toBanglaDigits(recipient.roll_number) : "—",
    admission_no: recipient.admissionNo || recipient.admission_no || recipient.student_id || "—",
    session: toBanglaDigits(recipient.academicYear || new Date().getFullYear()),
    dob: recipient.dob ? formatDateDisplay(recipient.dob, true) : "—",
    address: recipient.address || madrasa.address || "—",
    employee_id: recipient.employeeID || "—",
    designation: recipient.designation || recipient.role || "—",
    department: recipient.department || "—",
    join_date: recipient.joinDate ? formatDateDisplay(recipient.joinDate, true) : "—",
    custom_note: customData.achievement || customData.meritPosition || "অসাধারণ সাফল্য",
  };

  const renderedBody = interpolateCertificateBody(customBodyText || template.body_template || "", vars);
  const issueDateStr = formatDateDisplay(issueDate, true);

  /* =========================
     PORTRAIT OFFICIAL LETTERHEAD (প্রত্যয়ন পত্র / টিসি / অভিজ্ঞতা সনদ)
  ========================= */
  if (isLetterhead) {
    return (
      <div
        className="relative bg-white mx-auto shadow-lg overflow-hidden avoid-break flex flex-col justify-between"
        style={{
          width: "100%",
          maxWidth: "740px",
          minHeight: "980px",
          backgroundColor: paperBg,
          border: `1.5px solid ${primary}30`,
          fontFamily: "'Baloo Da 2', 'Hind Siliguri', sans-serif",
        }}
      >
        {/* Top Accent Ribbon */}
        <div className="h-3 w-full" style={{ background: `linear-gradient(90deg, ${primary}, ${accent}, ${secondary})` }} />

        {/* Subtle Watermark */}
        {template.show_watermark !== false && (
          <div className="absolute inset-0 flex items-center justify-center pointer-events-none opacity-[0.045] z-0">
            {madrasa.logo ? (
              <img src={madrasa.logo} alt="" className="w-80 h-80 object-contain grayscale" />
            ) : (
              <ShieldCheck className="w-72 h-72" style={{ color: primary }} />
            )}
          </div>
        )}

        <div className="p-8 sm:p-12 relative z-10 flex-1 flex flex-col">
          {/* Official Letterhead Header */}
          <div className="flex items-center justify-between gap-5 pb-5 border-b-[3px]" style={{ borderColor: primary }}>
            <div className="w-20 h-20 rounded-2xl bg-white p-1.5 shadow-sm flex items-center justify-center shrink-0" style={{ border: `2px solid ${accent}` }}>
              {madrasa.logo ? (
                <img src={madrasa.logo} alt="Logo" className="w-full h-full object-contain" />
              ) : (
                <Award className="w-10 h-10" style={{ color: primary }} />
              )}
            </div>

            <div className="text-center flex-1">
              {template.show_bismillah !== false && (
                <p className="font-arabic text-sm mb-1" style={{ color: secondary }}>
                  بِسْمِ اللَّهِ الرَّحْمَٰنِ الرَّحِيمِ
                </p>
              )}
              {madrasa.arabicName && (
                <p className="font-arabic text-base font-bold leading-tight mb-1" style={{ color: primary }}>
                  {madrasa.arabicName}
                </p>
              )}
              <h1 className="text-2xl font-black tracking-tight" style={{ color: primary }}>
                {madrasa.name}
              </h1>
              <p className="text-xs font-bold text-slate-600 mt-0.5">
                {madrasa.address} • স্থাপিত: {madrasa.established} • ফোন: {toBanglaDigits(madrasa.phone)}
              </p>
            </div>

            {template.show_photo && (
              <div
                className="w-20 h-24 rounded-xl bg-slate-50 overflow-hidden flex items-center justify-center shrink-0"
                style={{ border: `2px solid ${secondary}` }}
              >
                {recipient.photo ? (
                  <img src={recipient.photo} alt="" className="w-full h-full object-cover" />
                ) : (
                  <User className="w-8 h-8 text-slate-300" />
                )}
              </div>
            )}
          </div>

          {/* Memo No & Date Bar */}
          <div className="flex justify-between items-center text-xs font-bold text-slate-600 py-3 border-b border-slate-200">
            <span>স্মারক নং (Ref): <span className="font-mono font-black text-slate-900">{certificateNo}</span></span>
            <span>তারিখ: <span className="font-black text-slate-900">{issueDateStr}</span></span>
          </div>

          {/* Document Title Banner */}
          <div className="text-center my-7 space-y-1.5">
            {template.arabic_title && (
              <p className="font-arabic text-lg font-bold" style={{ color: secondary }}>
                {template.arabic_title}
              </p>
            )}
            <div
              className="inline-block px-8 py-2 rounded-full text-xl font-black tracking-wide shadow-xs"
              style={{
                backgroundColor: `${primary}10`,
                color: primary,
                border: `1.5px solid ${accent}`,
              }}
            >
              {template.title || template.certificate_type || "প্রত্যয়ন পত্র"}
            </div>
            {template.subtitle && (
              <p className="text-[11px] font-bold uppercase tracking-[0.2em] text-slate-400">{template.subtitle}</p>
            )}
          </div>

          {/* Formal Recipient Summary Box */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 bg-slate-50/90 border border-slate-200 rounded-xl p-4 mb-6 text-xs">
            <div>
              <span className="text-[10px] font-bold text-slate-400 block">নাম</span>
              <span className="font-black text-slate-900">{vars.name}</span>
            </div>
            {targetType === "student" ? (
              <>
                <div>
                  <span className="text-[10px] font-bold text-slate-400 block">শ্রেণি ও শাখা</span>
                  <span className="font-bold text-slate-800">{vars.class} ({vars.section})</span>
                </div>
                <div>
                  <span className="text-[10px] font-bold text-slate-400 block">রোল / আইডি</span>
                  <span className="font-bold text-slate-800">{vars.roll} / {vars.admission_no}</span>
                </div>
                <div>
                  <span className="text-[10px] font-bold text-slate-400 block">শিক্ষাবর্ষ</span>
                  <span className="font-bold text-slate-800">{vars.session}</span>
                </div>
              </>
            ) : (
              <>
                <div>
                  <span className="text-[10px] font-bold text-slate-400 block">পদবী</span>
                  <span className="font-bold text-slate-800">{vars.designation}</span>
                </div>
                <div>
                  <span className="text-[10px] font-bold text-slate-400 block">বিভাগ</span>
                  <span className="font-bold text-slate-800">{vars.department}</span>
                </div>
                <div>
                  <span className="text-[10px] font-bold text-slate-400 block">কর্মী আইডি</span>
                  <span className="font-mono font-bold text-slate-800">{vars.employee_id}</span>
                </div>
              </>
            )}
          </div>

          {/* Main Formal Body */}
          <div className="flex-1 text-[15px] leading-[2] text-slate-800 whitespace-pre-line text-justify px-1">
            {renderedBody}
          </div>

          {customData?.remarks && (
            <div className="mt-5 p-3 rounded-lg bg-amber-50/70 border border-amber-200 text-xs text-amber-900">
              <span className="font-bold">বিশেষ মন্তব্য: </span>
              {customData.remarks}
            </div>
          )}

          {/* Signatures + QR Footer */}
          <div className="pt-14 mt-auto flex items-end justify-between gap-6">
            {template.show_qr !== false ? (
              <div className="flex flex-col items-center">
                <div className="p-1.5 bg-white border border-slate-200 rounded-lg shadow-xs">
                  <QrMatrixSvg value={`${madrasa.code}|${certificateNo}|${vars.name}`} size={54} fg={primary} />
                </div>
                <span className="text-[8px] font-mono text-slate-400 mt-1">{certificateNo}</span>
              </div>
            ) : (
              <div />
            )}

            <div className="flex-1 grid grid-cols-3 gap-6 text-center text-xs">
              <div>
                <div className="border-t border-slate-400 pt-1.5 font-bold text-slate-700">
                  {template.left_sign_label || "অফিস সহকারী"}
                </div>
              </div>
              <div>
                <div className="border-t border-slate-400 pt-1.5 font-bold text-slate-700">
                  {template.middle_sign_label || "নাজিমে তালিমাত"}
                </div>
              </div>
              <div>
                <div className="border-t border-slate-500 pt-1.5 font-black text-slate-900">
                  {template.right_sign_label || "মুহতামিম / অধ্যক্ষ"}
                </div>
              </div>
            </div>
          </div>
        </div>

        <div className="h-2 w-full" style={{ backgroundColor: primary }} />
      </div>
    );
  }

  /* =========================
     LANDSCAPE ORNAMENTAL CERTIFICATE
  ========================= */
  return (
    <div
      className="relative mx-auto shadow-xl overflow-hidden avoid-break flex flex-col justify-between"
      style={{
        width: "100%",
        maxWidth: "960px",
        aspectRatio: "1.414 / 1",
        backgroundColor: paperBg,
        border: `10px solid ${primary}`,
        fontFamily: "'Baloo Da 2', 'Hind Siliguri', sans-serif",
      }}
    >
      {/* Inner Gold Double Frame */}
      <div
        className="absolute inset-2.5 pointer-events-none"
        style={{ border: `2.5px solid ${accent}` }}
      />
      <div
        className="absolute inset-4 pointer-events-none"
        style={{ border: `1px dashed ${secondary}55` }}
      />

      {/* Corner Ornaments */}
      <div className="absolute top-3 left-3 z-10"><CertificateCornerFiligree color={accent} pos="tl" /></div>
      <div className="absolute top-3 right-3 z-10"><CertificateCornerFiligree color={accent} pos="tr" /></div>
      <div className="absolute bottom-3 left-3 z-10"><CertificateCornerFiligree color={accent} pos="bl" /></div>
      <div className="absolute bottom-3 right-3 z-10"><CertificateCornerFiligree color={accent} pos="br" /></div>

      {/* Sapphire Modern diagonal ribbons */}
      {presetKey === "sapphire_modern" && (
        <>
          <div
            className="absolute -top-12 -left-12 w-40 h-40 rotate-45 pointer-events-none opacity-90"
            style={{ background: `linear-gradient(135deg, ${primary}, ${accent})` }}
          />
          <div
            className="absolute -bottom-12 -right-12 w-40 h-40 rotate-45 pointer-events-none opacity-90"
            style={{ background: `linear-gradient(135deg, ${accent}, ${secondary})` }}
          />
        </>
      )}

      {/* Watermark */}
      {template.show_watermark !== false && (
        <div className="absolute inset-0 flex items-center justify-center pointer-events-none opacity-[0.045] z-0">
          {madrasa.logo ? (
            <img src={madrasa.logo} alt="" className="w-72 h-72 object-contain grayscale" />
          ) : (
            <Award className="w-72 h-72" style={{ color: primary }} />
          )}
        </div>
      )}

      {/* Certificate Main Content */}
      <div className="relative z-10 flex-1 flex flex-col justify-between px-10 sm:px-14 py-8 text-center">
        {/* Top Row: Serial + Institution + Date */}
        <div className="flex items-start justify-between gap-4">
          <div className="text-left text-[10px] font-bold text-slate-500">
            <span className="block uppercase tracking-wider text-slate-400">সনদ নং</span>
            <span className="font-mono font-black text-slate-800">{certificateNo}</span>
          </div>

          <div className="flex flex-col items-center">
            {template.show_bismillah !== false && (
              <p className="font-arabic text-xs mb-1" style={{ color: secondary }}>
                بِسْمِ اللَّهِ الرَّحْمَٰنِ الرَّحِيمِ
              </p>
            )}
            <div className="flex items-center gap-2.5">
              {madrasa.logo && (
                <img
                  src={madrasa.logo}
                  alt="Logo"
                  className="w-11 h-11 rounded-full bg-white p-0.5 object-contain shadow-xs"
                  style={{ border: `1.5px solid ${accent}` }}
                />
              )}
              <div className="text-center">
                <h2 className="text-lg sm:text-xl font-black leading-tight" style={{ color: primary }}>
                  {madrasa.name}
                </h2>
                <p className="text-[10.5px] font-semibold text-slate-500">{madrasa.address}</p>
              </div>
            </div>
          </div>

          <div className="text-right text-[10px] font-bold text-slate-500">
            <span className="block uppercase tracking-wider text-slate-400">প্রদানের তারিখ</span>
            <span className="font-black text-slate-800">{issueDateStr}</span>
          </div>
        </div>

        {/* Center Title Banner */}
        <div className="my-2 space-y-1">
          {template.arabic_title && (
            <p className="font-arabic text-lg font-bold" style={{ color: secondary }}>
              {template.arabic_title}
            </p>
          )}
          <div
            className="inline-block px-10 py-1.5 rounded-full text-xl sm:text-2xl font-black tracking-wide shadow-sm"
            style={{
              background: `linear-gradient(90deg, ${primary}, ${secondary})`,
              color: "#ffffff",
              border: `2px solid ${accent}`,
            }}
          >
            {template.title || template.certificate_type || "প্রশংসাপত্র ও সনদ"}
          </div>
          {template.subtitle && (
            <p className="text-[10px] font-extrabold uppercase tracking-[0.28em]" style={{ color: accent }}>
              {template.subtitle}
            </p>
          )}
        </div>

        {/* Highlighted Recipient Name Ribbon */}
        <div className="my-1">
          <p className="text-[11px] font-bold text-slate-400 uppercase tracking-widest">গৌরবের সাথে প্রদান করা হলো</p>
          <h1
            className="text-2xl sm:text-3xl font-black tracking-tight mt-0.5 inline-block px-8 pb-1 border-b-2"
            style={{ color: primary, borderColor: accent }}
          >
            {vars.name}
          </h1>
          <p className="text-xs font-bold mt-1" style={{ color: secondary }}>
            {targetType === "student"
              ? `পিতা: ${vars.father_name} • শ্রেণি: ${vars.class} • রোল: ${vars.roll} • শিক্ষাবর্ষ: ${vars.session}`
              : `${vars.designation} • ${vars.department} বিভাগ • কর্মী আইডি: ${vars.employee_id}`}
          </p>
        </div>

        {/* Body Text */}
        <div className="max-w-3xl mx-auto text-[13.5px] sm:text-[14px] leading-relaxed text-slate-700 whitespace-pre-line font-medium">
          {renderedBody}
        </div>

        {/* Bottom Signatures & Gold Seal */}
        <div className="flex items-end justify-between gap-6 pt-3">
          <div className="flex flex-col items-center w-36">
            <div className="w-full border-b border-slate-400 h-6 mb-1" />
            <span className="text-[10px] font-bold text-slate-700">{template.left_sign_label || "শ্রেণি শিক্ষক"}</span>
          </div>

          <div className="flex items-center gap-4">
            {template.show_qr !== false && (
              <div className="p-1 bg-white border border-slate-200 rounded-md shadow-xs">
                <QrMatrixSvg value={`${madrasa.code}|${certificateNo}|${vars.name}`} size={44} fg={primary} />
              </div>
            )}
            <GoldRibbonSeal primary={primary} accent={accent} label="সত্যায়িত" />
          </div>

          <div className="flex flex-col items-center w-36">
            <div className="w-full border-b border-slate-500 h-6 mb-1" />
            <span className="text-[10px] font-black text-slate-900">{template.right_sign_label || "মুহতামিম / অধ্যক্ষ"}</span>
          </div>
        </div>
      </div>
    </div>
  );
};
