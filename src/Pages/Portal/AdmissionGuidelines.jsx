import { useState } from "react";
import { Link, useParams } from "react-router-dom";
import { ArrowRight, GraduationCap } from "lucide-react";
import { usePortalSettings } from "../../context/PortalSettingsContext";

const formatAmount = (amount) => {
  const num = Number(amount);
  if (Number.isNaN(num)) return String(amount || 0);
  return `৳${num.toLocaleString("bn-BD")}`;
};

const FeeTable = ({ title, fees, borderClass = "" }) => {
  const items = fees?.items || [];
  const total =
    fees?.total !== undefined
      ? fees.total
      : items.reduce((sum, r) => sum + (Number(r.amount) || 0), 0);

  return (
    <div className={`lg:w-1/2 w-full ${borderClass}`}>
      <h2 className="font-bold text-[#123628] text-[20px] text-center mb-[12px]">
        {title}
      </h2>
      <div className="border border-[#1C7D5A]/30 rounded-[12px] overflow-hidden bg-white shadow-xs">
        <div className="flex items-center justify-between bg-[#123628] text-white px-[24px] py-[10px] font-semibold">
          <h2>বিবরণ</h2>
          <h2>টাকা</h2>
        </div>
        {items.length > 0 ? (
          items.map((row, idx) => (
            <div
              key={idx}
              className="flex items-center justify-between border-b border-slate-200 px-[24px] py-[10px] text-[#0f172a]"
            >
              <span className="font-medium">{row.label}</span>
              <span className="font-semibold text-[#1C7D5A]">
                {formatAmount(row.amount)}
              </span>
            </div>
          ))
        ) : (
          <div className="px-[24px] py-[18px] text-center text-sm text-slate-500">
            এই শ্রেণির ফি নির্ধারণ করা হয়নি
          </div>
        )}
        <div className="bg-[#123628] text-[#EAB33C] px-[24px] py-[10px]">
          <h2 className="text-end font-bold">মোট {formatAmount(total)}</h2>
        </div>
      </div>
    </div>
  );
};

const AdmissionGuidelines = () => {
  const { settings } = usePortalSettings();
  const { slug } = useParams();
  const basePath = slug ? `/${slug}` : "";

  const classes = settings?.admissionFees || [];
  const [selectedClassId, setSelectedClassId] = useState("");

  const activeClass =
    classes.find((c) => c.id === selectedClassId) || classes[0] || null;
  const activeId = activeClass?.id || "";

  return (
    <div className="pb-16">
      {/* Header */}
      <div className="bg-[#e8f5f0]">
        <div className="py-14 flex flex-col gap-3 text-center px-4">
          <h1 className="text-[#123628] text-[26px] lg:text-[34px] font-[700]">
            ভর্তি তথ্য ও ফি কাঠামো
          </h1>
          <p className="text-[#334155] text-[16px] lg:text-[18px] font-[500] max-w-[883px] mx-auto leading-relaxed">
            {settings?.branding?.name
              ? `${settings.branding.name}-এ ভর্তির`
              : "ভর্তির"}{" "}
            যেকোনো প্রয়োজনে সরাসরি আমাদের অফিসে যোগাযোগ করতে পারেন
            {settings?.contact?.phone
              ? ` অথবা ${settings.contact.phone} নম্বরে কল করে জেনে নিতে পারেন`
              : ""}
            । নিচে শ্রেণি ভিত্তিক ফি কাঠামো দেখে অনলাইনে আবেদন করুন।
          </p>
          <div className="mt-4">
            <Link
              to={`${basePath}/online-admission`}
              className="inline-flex items-center gap-2 bg-[#1C7D5A] hover:bg-[#123628] text-white font-semibold px-6 py-2.5 rounded-full shadow-md transition-colors"
            >
              অনলাইন ভর্তি ফরম পূরণ করুন
              <ArrowRight className="w-4 h-4" />
            </Link>
          </div>
        </div>
      </div>

      {/* Interactive Fee Structure Section */}
      <div className="bg-gradient-to-br from-[#123628] via-[#174b37] to-[#1C7D5A] mt-[40px] relative overflow-hidden">
        <div className="absolute top-0 right-0 pointer-events-none opacity-35">
          <img className="w-[500px]" src="/portal/testi-shape-1.png" alt="" />
        </div>

        <div className="lg:max-w-[1200px] mx-auto lg:py-[70px] py-[40px] px-[15px] relative z-10">
          {classes.length > 0 && activeClass ? (
            <div className="flex flex-col md:flex-row justify-between gap-10 md:gap-12">
              {/* Left Class Selector */}
              <div className="w-full md:w-5/12 flex flex-col gap-4">
                {classes.map((cls) => {
                  const isSelected = activeId === cls.id;
                  return (
                    <div key={cls.id} className="relative">
                      <div
                        onClick={() => setSelectedClassId(cls.id)}
                        className={`rounded-[12px] h-fit p-4 flex flex-col gap-2 cursor-pointer transition-all ${
                          isSelected
                            ? "bg-[#e8f5f0] text-[#123628] shadow-md border-2 border-[#EAB33C]"
                            : "bg-white/10 hover:bg-white/20 text-white border border-white/15"
                        }`}
                      >
                        <div className="flex gap-3 items-center">
                          <div
                            className={`w-[50px] h-[50px] rounded-[10px] flex items-center justify-center flex-shrink-0 ${
                              isSelected
                                ? "bg-[#1C7D5A] text-white"
                                : "bg-white/15 text-[#EAB33C]"
                            }`}
                          >
                            <GraduationCap className="w-6 h-6" />
                          </div>
                          <div>
                            <h4 className="text-lg leading-[22px] font-[700]">
                              {cls.name}
                            </h4>
                            <div className="flex items-center gap-[12px] mt-[5px]">
                              <p className="text-sm leading-[18px]">
                                বিষয়:{" "}
                                <span className="font-bold pl-[2px]">
                                  {cls.subjects}টি
                                </span>
                              </p>
                              <p className="text-sm leading-[18px]">
                                শিক্ষার্থী:{" "}
                                <span className="font-bold pl-[2px]">
                                  {cls.students} জন
                                </span>
                              </p>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>

              {/* Right Fee Structure Tables */}
              <div className="bg-[#e8f5f0] rounded-[14px] w-full md:w-7/12 px-[20px] py-[28px] lg:flex items-start justify-between gap-6 h-fit shadow-xl border border-white/40">
                <FeeTable
                  title="অনাবাসিক"
                  fees={activeClass.nonResidential}
                />
                <FeeTable
                  title="আবাসিক"
                  fees={activeClass.residential}
                  borderClass="lg:border-l-[2px] lg:border-[#1C7D5A]/30 lg:pl-6 mt-[25px] lg:mt-0"
                />
              </div>
            </div>
          ) : (
            <div className="bg-white/10 border border-white/20 rounded-2xl p-10 text-center text-white">
              <p className="text-lg font-semibold mb-2">
                এখনও শ্রেণিভিত্তিক ফি কাঠামো যুক্ত করা হয়নি
              </p>
              <p className="text-sm text-white/80 mb-5">
                ভর্তি সংক্রান্ত ফি জানতে অনুগ্রহ করে আমাদের অফিসে যোগাযোগ করুন অথবা অনলাইনে আবেদন করুন।
              </p>
              <Link
                to={`${basePath}/online-admission`}
                className="inline-flex items-center gap-2 bg-[#EAB33C] text-[#123628] font-bold px-6 py-2.5 rounded-full hover:bg-white transition-colors"
              >
                অনলাইন আবেদন করুন <ArrowRight className="w-4 h-4" />
              </Link>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default AdmissionGuidelines;
