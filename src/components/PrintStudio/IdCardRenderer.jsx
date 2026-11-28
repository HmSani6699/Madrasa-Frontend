import React from "react";
import { User, Phone, Droplets, MapPin, ShieldCheck } from "lucide-react";
import { QrMatrixSvg, BarcodeSvg } from "./QrMatrixSvg";
import { formatDateDisplay, toBanglaDigits } from "./printPresets";

// SVG Geometric & Islamic Pattern helpers for crisp vector card headers
const CardHeaderArtwork = ({ presetKey, primary, secondary, accent }) => {
  if (presetKey === "royal_wave") {
    return (
      <svg viewBox="0 0 300 110" preserveAspectRatio="none" className="absolute inset-0 w-full h-full">
        <defs>
          <linearGradient id={`grad-${presetKey}`} x1="0" y1="0" x2="1" y2="1">
            <stop offset="0%" stopColor={primary} />
            <stop offset="100%" stopColor={secondary} />
          </linearGradient>
        </defs>
        <path d="M0,0 L300,0 L300,74 Q225,108 150,82 T0,92 Z" fill={`url(#grad-${presetKey})`} />
        <path d="M0,84 Q75,64 150,82 T300,72 L300,82 Q225,112 150,90 T0,98 Z" fill={accent} opacity="0.9" />
      </svg>
    );
  }

  if (presetKey === "teal_ribbon") {
    return (
      <svg viewBox="0 0 300 110" preserveAspectRatio="none" className="absolute inset-0 w-full h-full">
        <polygon points="0,0 300,0 300,72 0,104" fill={primary} />
        <polygon points="0,95 300,63 300,74 0,106" fill={accent} />
        <polygon points="180,0 300,0 300,72 135,88" fill={secondary} opacity="0.45" />
      </svg>
    );
  }

  if (presetKey === "ottoman_tile") {
    return (
      <svg viewBox="0 0 300 110" preserveAspectRatio="none" className="absolute inset-0 w-full h-full">
        <rect width="300" height="96" fill={primary} />
        <rect y="94" width="300" height="5" fill={accent} />
        <g opacity="0.16" stroke={accent} strokeWidth="1" fill="none">
          {[25, 75, 125, 175, 225, 275].map((cx) => (
            <g key={cx} transform={`translate(${cx}, 46)`}>
              <polygon points="0,-24 7,-7 24,0 7,7 0,24 -7,7 -24,0 -7,-7" />
              <circle r="11" />
            </g>
          ))}
        </g>
      </svg>
    );
  }

  if (presetKey === "executive_dark") {
    return (
      <svg viewBox="0 0 300 110" preserveAspectRatio="none" className="absolute inset-0 w-full h-full">
        <rect width="300" height="92" fill={primary} />
        <polygon points="0,88 300,70 300,94 0,94" fill={secondary} />
        <rect y="92" width="300" height="4" fill={accent} />
        <circle cx="275" cy="18" r="36" fill={accent} opacity="0.12" />
      </svg>
    );
  }

  if (presetKey === "classic_green") {
    return (
      <svg viewBox="0 0 300 110" preserveAspectRatio="none" className="absolute inset-0 w-full h-full">
        <rect width="300" height="92" fill={primary} />
        <rect y="92" width="300" height="4" fill={accent} />
        <rect x="6" y="6" width="288" height="80" rx="6" fill="none" stroke={accent} strokeOpacity="0.35" strokeWidth="1" />
      </svg>
    );
  }

  // Default: emerald_mihrab
  return (
    <svg viewBox="0 0 300 115" preserveAspectRatio="none" className="absolute inset-0 w-full h-full">
      <defs>
        <linearGradient id="mihrab-g" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor={primary} />
          <stop offset="100%" stopColor={secondary} />
        </linearGradient>
      </defs>
      <path d="M0,0 L300,0 L300,82 Q150,115 0,82 Z" fill="url(#mihrab-g)" />
      <path d="M0,82 Q150,115 300,82" fill="none" stroke={accent} strokeWidth="3.5" />
      <circle cx="30" cy="22" r="24" fill={accent} opacity="0.08" />
      <circle cx="270" cy="22" r="24" fill={accent} opacity="0.08" />
    </svg>
  );
};

const WatermarkCrest = ({ logo, color }) => (
  <div className="absolute inset-0 flex items-center justify-center pointer-events-none opacity-[0.045] z-0">
    {logo ? (
      <img src={logo} alt="" className="w-36 h-36 object-contain grayscale" />
    ) : (
      <ShieldCheck className="w-36 h-36" style={{ color }} />
    )}
  </div>
);

const IdCardBackFace = ({ template, person, madrasa, isHorizontal }) => {
  const primary = template.primary_color || "#123628";
  const secondary = template.secondary_color || "#1C7D5A";
  const accent = template.accent_color || "#EAB33C";
  const idValue = person.employeeID || person.student_id || person.admissionNo || person.roll_number || person._id || "ID-001";

  return (
    <div
      className={`relative bg-white overflow-hidden flex flex-col justify-between border border-slate-200 shadow-lg select-none ${
        isHorizontal ? "w-[374px] h-[236px] rounded-2xl" : "w-[236px] h-[374px] rounded-2xl"
      }`}
      style={{ fontFamily: "'Baloo Da 2', 'Hind Siliguri', sans-serif" }}
    >
      {/* Top Magnetic / Accent Header */}
      <div style={{ backgroundColor: primary }} className="px-4 py-2.5 flex items-center justify-between text-white shrink-0">
        <div className="flex items-center gap-2 min-w-0">
          {madrasa.logo && (
            <img src={madrasa.logo} alt="Logo" className="w-6 h-6 rounded-full bg-white p-0.5 object-contain shrink-0" />
          )}
          <span className="text-[10px] font-bold truncate">{madrasa.name}</span>
        </div>
        <span
          className="text-[8px] font-extrabold px-2 py-0.5 rounded-full uppercase tracking-wider shrink-0"
          style={{ backgroundColor: accent, color: primary }}
        >
          তথ্য ও যাচাই
        </span>
      </div>

      {/* Watermark */}
      {template.show_watermark !== false && <WatermarkCrest logo={madrasa.logo} color={primary} />}

      {/* Body Content */}
      <div className={`relative z-10 flex-1 ${isHorizontal ? "px-5 py-3 flex gap-4 items-center" : "px-4 py-3 flex flex-col justify-between"}`}>
        <div className="space-y-1.5 flex-1 text-[9.5px] text-slate-700">
          <div className="bg-slate-50/90 border border-slate-200/80 rounded-lg p-2 space-y-1">
            {person.fatherName && (
              <div className="flex justify-between gap-2">
                <span className="text-slate-400 font-semibold">পিতার নাম:</span>
                <span className="font-bold text-slate-800 text-right truncate">{person.fatherName}</span>
              </div>
            )}
            {(person.phone || person.parent_contact) && (
              <div className="flex justify-between gap-2">
                <span className="text-slate-400 font-semibold">জরুরি ফোন:</span>
                <span className="font-bold text-emerald-700">{toBanglaDigits(person.phone || person.parent_contact)}</span>
              </div>
            )}
            {(person.bloodGroup || person.blood_group) && (
              <div className="flex justify-between gap-2">
                <span className="text-slate-400 font-semibold">রক্তের গ্রুপ:</span>
                <span className="font-extrabold text-rose-600">{person.bloodGroup || person.blood_group}</span>
              </div>
            )}
            {person.dob && (
              <div className="flex justify-between gap-2">
                <span className="text-slate-400 font-semibold">জন্ম তারিখ:</span>
                <span className="font-bold">{formatDateDisplay(person.dob, true)}</span>
              </div>
            )}
            {template.valid_thru && (
              <div className="flex justify-between gap-2">
                <span className="text-slate-400 font-semibold">মেয়াদ:</span>
                <span className="font-bold">{template.valid_thru}</span>
              </div>
            )}
          </div>

          <div className="text-[8.5px] leading-snug text-slate-600 px-1">
            <span className="font-bold text-slate-700">ঠিকানা: </span>
            {person.address || madrasa.address}
          </div>

          <div
            className="text-[8px] leading-tight p-1.5 rounded-md border"
            style={{ backgroundColor: `${secondary}10`, borderColor: `${secondary}30`, color: primary }}
          >
            {template.back_note || "কার্ডটি হারিয়ে গেলে অনুগ্রহ করে মাদ্রাসা অফিসে জমা দিন।"}
          </div>
        </div>

        {/* QR + Barcode + Sign */}
        <div className={`flex ${isHorizontal ? "flex-col items-center justify-between h-full py-1" : "items-end justify-between pt-2 border-t border-dashed border-slate-200"}`}>
          <div className="flex flex-col items-center gap-1">
            <div className="p-1 bg-white border border-slate-200 rounded-md shadow-xs">
              <QrMatrixSvg value={`${madrasa.code}|${idValue}|${person.name}`} size={isHorizontal ? 54 : 46} fg={primary} />
            </div>
            <span className="text-[7px] font-mono font-bold text-slate-400">{idValue}</span>
          </div>

          <div className="flex flex-col items-center">
            <div className="w-20 border-b border-slate-400 mb-0.5 h-5 flex items-end justify-center">
              <span className="text-[9px] italic font-semibold text-slate-400/70">Authorized</span>
            </div>
            <span className="text-[8px] font-bold text-slate-700">{template.right_sign_label || "মুহতামিম / অধ্যক্ষ"}</span>
          </div>
        </div>
      </div>

      {/* Bottom Bar */}
      <div
        style={{ backgroundColor: secondary }}
        className="px-3 py-1.5 text-white text-[8px] flex items-center justify-between shrink-0"
      >
        <span className="truncate flex items-center gap-1">
          <MapPin className="w-2.5 h-2.5 shrink-0" /> {madrasa.address}
        </span>
        <span className="font-bold shrink-0 flex items-center gap-1 ml-2">
          <Phone className="w-2.5 h-2.5" /> {toBanglaDigits(madrasa.phone)}
        </span>
      </div>
    </div>
  );
};

export const IdCardRenderer = ({
  template = {},
  person = {},
  madrasa = {},
  targetType = "student",
  side = "front", // "front" | "back" | "both"
}) => {
  const presetKey = template.preset_key || "emerald_mihrab";
  const isHorizontal =
    template.layout === "horizontal" ||
    presetKey === "corporate_horizontal" ||
    presetKey === "modern_sky";

  if (side === "both") {
    return (
      <div className="flex flex-wrap items-center justify-center gap-4">
        <IdCardRenderer template={template} person={person} madrasa={madrasa} targetType={targetType} side="front" />
        <IdCardBackFace template={template} person={person} madrasa={madrasa} isHorizontal={isHorizontal} />
      </div>
    );
  }

  if (side === "back") {
    return <IdCardBackFace template={template} person={person} madrasa={madrasa} isHorizontal={isHorizontal} />;
  }

  const primary = template.primary_color || "#123628";
  const secondary = template.secondary_color || "#1C7D5A";
  const accent = template.accent_color || "#EAB33C";
  const textColor = template.text_color || "#ffffff";
  const fields = Array.isArray(template.fields) ? template.fields : [];
  const hasField = (k) => fields.length === 0 || fields.includes(k);

  const idValue =
    targetType === "employee"
      ? person.employeeID || person.id || "EMP-001"
      : person.student_id || person.admissionNo || person.roll_number || "STD-001";

  const blood = person.bloodGroup || person.blood_group || "";
  const phone = person.phone || person.parent_contact || "";

  // Build dynamic info rows
  const infoRows = [];
  if (targetType === "employee") {
    if (hasField("id_no")) infoRows.push({ label: "আইডি নং", value: idValue });
    if (hasField("department") && person.department) infoRows.push({ label: "বিভাগ", value: person.department });
    if (hasField("joinDate") && person.joinDate) infoRows.push({ label: "যোগদান", value: formatDateDisplay(person.joinDate, true) });
    if (hasField("phone") && phone) infoRows.push({ label: "মোবাইল", value: toBanglaDigits(phone) });
    if (hasField("bloodGroup") && blood) infoRows.push({ label: "রক্তের গ্রুপ", value: blood, highlight: true });
  } else {
    if (hasField("id_no")) infoRows.push({ label: "আইডি নং", value: idValue });
    if (hasField("class") && person.class) infoRows.push({ label: "শ্রেণি", value: person.class });
    if (hasField("section") && person.section) infoRows.push({ label: "শাখা", value: person.section });
    if (hasField("roll") && person.roll_number) infoRows.push({ label: "রোল নং", value: toBanglaDigits(person.roll_number) });
    if (hasField("fatherName") && person.fatherName) infoRows.push({ label: "পিতা", value: person.fatherName });
    if (hasField("phone") && phone) infoRows.push({ label: "মোবাইল", value: toBanglaDigits(phone) });
    if (hasField("academicYear") && person.academicYear) infoRows.push({ label: "শিক্ষাবর্ষ", value: toBanglaDigits(person.academicYear) });
  }

  /* =========================
     HORIZONTAL CR80 CARD
  ========================= */
  if (isHorizontal) {
    return (
      <div
        className="relative w-[374px] h-[236px] bg-white rounded-2xl overflow-hidden shadow-lg border border-slate-200 flex select-none"
        style={{ fontFamily: "'Baloo Da 2', 'Hind Siliguri', sans-serif" }}
      >
        {template.show_watermark !== false && <WatermarkCrest logo={madrasa.logo} color={primary} />}

        {/* Left Spine Strip */}
        <div
          style={{ backgroundColor: primary, color: textColor }}
          className="w-11 shrink-0 flex flex-col items-center justify-between py-3 px-1 relative z-10"
        >
          <div className="w-7 h-7 rounded-lg bg-white p-0.5 flex items-center justify-center shadow-xs">
            {madrasa.logo ? (
              <img src={madrasa.logo} alt="" className="w-full h-full object-contain rounded-md" />
            ) : (
              <span className="text-[10px] font-black" style={{ color: primary }}>ম</span>
            )}
          </div>
          <span
            className="text-[8px] font-extrabold uppercase tracking-[0.22em] whitespace-nowrap -rotate-90 origin-center"
            style={{ color: accent }}
          >
            {targetType === "employee" ? "STAFF ID" : "STUDENT ID"}
          </span>
          <div className="w-2.5 h-2.5 rounded-full" style={{ backgroundColor: accent }} />
        </div>

        {/* Main Card Body */}
        <div className="flex-1 flex flex-col justify-between p-3.5 relative z-10">
          {/* Top Institution Header */}
          <div className="flex items-start justify-between gap-2 pb-2 border-b" style={{ borderColor: `${primary}20` }}>
            <div className="min-w-0">
              {template.show_arabic_header !== false && madrasa.arabicName && (
                <p className="font-arabic text-[10px] leading-none mb-0.5 truncate" style={{ color: secondary }}>
                  {madrasa.arabicName}
                </p>
              )}
              <h3 className="text-[12.5px] font-extrabold leading-tight truncate" style={{ color: primary }}>
                {madrasa.name}
              </h3>
              <p className="text-[8.5px] font-semibold text-slate-500 truncate">{madrasa.address}</p>
            </div>
            <span
              className="px-2 py-0.5 rounded-md text-[8px] font-extrabold shrink-0"
              style={{ backgroundColor: `${accent}25`, color: primary, border: `1px solid ${accent}` }}
            >
              {template.title || (targetType === "employee" ? "শিক্ষক / স্টাফ কার্ড" : "পরিচয়পত্র")}
            </span>
          </div>

          {/* Center Photo + Details */}
          <div className="flex items-center gap-3.5 my-1">
            {template.show_photo !== false && (
              <div className="flex flex-col items-center gap-1 shrink-0">
                <div
                  className="w-[74px] h-[86px] rounded-xl overflow-hidden bg-slate-100 flex items-center justify-center shadow-sm"
                  style={{ border: `2.5px solid ${secondary}` }}
                >
                  {person.photo ? (
                    <img src={person.photo} alt={person.name} className="w-full h-full object-cover" />
                  ) : (
                    <User className="w-8 h-8 text-slate-300" />
                  )}
                </div>
                {blood && hasField("bloodGroup") && (
                  <span className="inline-flex items-center gap-0.5 px-1.5 py-0.5 rounded-full bg-rose-50 border border-rose-200 text-rose-700 text-[8px] font-extrabold">
                    <Droplets className="w-2.5 h-2.5" /> {blood}
                  </span>
                )}
              </div>
            )}

            <div className="flex-1 min-w-0">
              <h4 className="text-[14px] font-black text-slate-900 leading-tight truncate">{person.name}</h4>
              <p className="text-[10px] font-bold mb-1.5 truncate" style={{ color: secondary }}>
                {targetType === "employee"
                  ? person.designation || person.role
                  : `${person.class || "শ্রেণি"}${person.section ? ` • ${person.section}` : ""}`}
              </p>

              <div className="space-y-0.5 text-[9.5px]">
                {infoRows.slice(0, 5).map((row) => (
                  <div key={row.label} className="flex items-center justify-between gap-2 border-b border-slate-100/80 pb-0.5">
                    <span className="text-slate-400 font-semibold shrink-0">{row.label}:</span>
                    <span className={`font-bold truncate ${row.highlight ? "text-rose-600" : "text-slate-800"}`}>
                      {row.value}
                    </span>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Bottom QR / Barcode / Signature */}
          <div className="flex items-end justify-between pt-1.5 border-t border-slate-100">
            <div className="flex items-center gap-2">
              {template.show_qr !== false && (
                <QrMatrixSvg value={`${madrasa.code}|${idValue}|${person.name}`} size={30} fg={primary} />
              )}
              {template.show_barcode && <BarcodeSvg value={idValue} width={78} height={20} fg={primary} />}
            </div>
            <div className="text-center">
              <div className="w-20 border-b border-slate-400 mb-0.5" />
              <span className="text-[8px] font-bold text-slate-600">{template.right_sign_label || "মুহতামিম / অধ্যক্ষ"}</span>
            </div>
          </div>
        </div>
      </div>
    );
  }

  /* =========================
     VERTICAL CR80 CARD
  ========================= */
  return (
    <div
      className="relative w-[236px] h-[374px] bg-white rounded-2xl overflow-hidden shadow-lg border border-slate-200 flex flex-col justify-between select-none"
      style={{ fontFamily: "'Baloo Da 2', 'Hind Siliguri', sans-serif" }}
    >
      {template.show_watermark !== false && <WatermarkCrest logo={madrasa.logo} color={primary} />}

      {/* Decorative Header */}
      <div className="relative h-[96px] shrink-0 flex flex-col items-center justify-start pt-2.5 px-3 text-center">
        <CardHeaderArtwork presetKey={presetKey} primary={primary} secondary={secondary} accent={accent} />

        <div className="relative z-10 flex items-center gap-2 w-full">
          <div className="w-9 h-9 rounded-full bg-white p-0.5 shadow-md flex items-center justify-center shrink-0 border border-white/80">
            {madrasa.logo ? (
              <img src={madrasa.logo} alt="" className="w-full h-full object-contain rounded-full" />
            ) : (
              <span className="text-xs font-black" style={{ color: primary }}>ম</span>
            )}
          </div>
          <div className="min-w-0 text-left flex-1" style={{ color: textColor }}>
            {template.show_arabic_header !== false && madrasa.arabicName && (
              <p className="font-arabic text-[8.5px] leading-none opacity-90 truncate mb-0.5">{madrasa.arabicName}</p>
            )}
            <h3 className="text-[11px] font-extrabold leading-tight line-clamp-2">{madrasa.name}</h3>
          </div>
        </div>

        {/* Card Type Pill */}
        <div
          className="relative z-10 mt-1 px-3 py-0.5 rounded-full text-[8.5px] font-black uppercase tracking-wider shadow-xs"
          style={{ backgroundColor: accent, color: primary }}
        >
          {template.title || (targetType === "employee" ? "কর্মী পরিচয়পত্র" : "শিক্ষার্থী পরিচয়পত্র")}
        </div>
      </div>

      {/* Photo + Name + Info */}
      <div className="relative z-10 flex-1 px-3.5 pt-1 pb-2 flex flex-col items-center">
        {template.show_photo !== false && (
          <div className="relative -mt-3 mb-1.5">
            <div
              className={`w-[74px] h-[82px] bg-slate-100 overflow-hidden flex items-center justify-center shadow-md ${
                presetKey === "royal_wave" ? "rounded-full w-[78px] h-[78px]" : "rounded-xl"
              }`}
              style={{ border: `3px solid #ffffff`, outline: `2px solid ${secondary}` }}
            >
              {person.photo ? (
                <img src={person.photo} alt={person.name} className="w-full h-full object-cover" />
              ) : (
                <User className="w-9 h-9 text-slate-300" />
              )}
            </div>
            {blood && hasField("bloodGroup") && (
              <span className="absolute -bottom-1 -right-2 px-1.5 py-0.5 rounded-full bg-rose-600 text-white text-[8px] font-black border-2 border-white shadow-xs">
                {blood}
              </span>
            )}
          </div>
        )}

        <h4 className="text-[13px] font-black text-slate-900 text-center leading-tight line-clamp-1">
          {person.name || "শিক্ষার্থীর নাম"}
        </h4>
        <p className="text-[9.5px] font-bold mb-2 text-center" style={{ color: secondary }}>
          {targetType === "employee"
            ? person.designation || person.role
            : `${person.class || "শ্রেণি"}${person.section ? ` (${person.section})` : ""}`}
        </p>

        {/* Data Rows */}
        <div className="w-full bg-slate-50/85 border border-slate-200/70 rounded-xl px-2.5 py-1.5 space-y-1 text-[9px] flex-1">
          {infoRows.slice(0, 6).map((row) => (
            <div key={row.label} className="flex justify-between items-center gap-1.5 border-b border-slate-200/50 last:border-none pb-0.5 last:pb-0">
              <span className="text-slate-500 font-semibold shrink-0">{row.label}</span>
              <span className={`font-bold text-right truncate ${row.highlight ? "text-rose-600" : "text-slate-800"}`}>
                {row.value}
              </span>
            </div>
          ))}
        </div>

        {/* Bottom QR + Signature */}
        <div className="w-full flex items-end justify-between pt-2 mt-1">
          <div className="flex items-center gap-1.5">
            {template.show_qr !== false && (
              <QrMatrixSvg value={`${madrasa.code}|${idValue}|${person.name}`} size={30} fg={primary} />
            )}
            {template.show_barcode && <BarcodeSvg value={idValue} width={58} height={20} fg={primary} />}
          </div>
          <div className="text-center">
            <div className="w-20 border-b border-slate-400 mb-0.5" />
            <span className="text-[7.5px] font-bold text-slate-600">{template.right_sign_label || "মুহতামিম / অধ্যক্ষ"}</span>
          </div>
        </div>
      </div>

      {/* Footer Strip */}
      <div
        style={{ backgroundColor: primary, color: textColor }}
        className="px-3 py-1.5 text-[8px] font-semibold flex items-center justify-between shrink-0"
      >
        <span className="truncate">{madrasa.phone ? `ফোন: ${toBanglaDigits(madrasa.phone)}` : madrasa.address}</span>
        {template.valid_thru && <span style={{ color: accent }} className="font-extrabold shrink-0 ml-1">{template.valid_thru}</span>}
      </div>
    </div>
  );
};
