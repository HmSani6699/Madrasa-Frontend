import { useState } from "react";
import { Link, useParams } from "react-router-dom";
import { ArrowRight } from "lucide-react";

const FeeTable = ({ title, fees, borderClass = "" }) => (
  <div className={`lg:w-1/2 w-full ${borderClass}`}>
    <h2 className="font-bold text-[#464A53] text-[20px] text-center mb-[10px]">
      {title}
    </h2>
    <div className="border border-gray-500 rounded-[12px] overflow-hidden">
      <div className="flex items-center justify-between bg-[#043334] text-white px-[30px] py-[8px]">
        <h2>মেনু</h2>
        <h2>টাকা</h2>
      </div>
      {fees.items.map((row, idx) => (
        <div
          key={idx}
          className="flex items-center justify-between border-b border-gray-400 px-[30px] py-[8px]"
        >
          <h2>{row.label}</h2>
          <h2>{row.amount}</h2>
        </div>
      ))}
      <div className="bg-[#043334] text-white px-[30px] py-[8px]">
        <h2 className="text-end font-semibold">মোট {fees.total}</h2>
      </div>
    </div>
  </div>
);

const AdmissionGuidelines = () => {
  const { slug } = useParams();
  const basePath = slug ? `/${slug}` : "";
  const [selectedClass, setSelectedClass] = useState("1");

  const classes = [
    {
      id: "1",
      name: "Class One",
      subjects: "4",
      students: "30",
      nonResidential: {
        items: [
          { label: "ভর্তি ফি", amount: "২০০০" },
          { label: "বেতন", amount: "১০০০" },
          { label: "প্রাইভেট", amount: "১০০০" },
        ],
        total: "৪০০০",
      },
      residential: {
        items: [
          { label: "ভর্তি ফি", amount: "২০০০" },
          { label: "বেতন", amount: "১০০০" },
          { label: "থাকা ও খাওয়া", amount: "২০০০" },
        ],
        total: "৫০০০",
      },
    },
    {
      id: "2",
      name: "Class Two",
      subjects: "4",
      students: "30",
      nonResidential: {
        items: [
          { label: "ভর্তি ফি", amount: "২০০০" },
          { label: "বেতন", amount: "১২০০" },
          { label: "প্রাইভেট", amount: "১০০০" },
        ],
        total: "৪২০০",
      },
      residential: {
        items: [
          { label: "ভর্তি ফি", amount: "২০০০" },
          { label: "বেতন", amount: "১২০০" },
          { label: "থাকা ও খাওয়া", amount: "২০০০" },
        ],
        total: "৫২০০",
      },
    },
    {
      id: "3",
      name: "Class Three",
      subjects: "5",
      students: "30",
      nonResidential: {
        items: [
          { label: "ভর্তি ফি", amount: "২৫০০" },
          { label: "বেতন", amount: "১২০০" },
          { label: "প্রাইভেট", amount: "১০০০" },
        ],
        total: "৪৭০০",
      },
      residential: {
        items: [
          { label: "ভর্তি ফি", amount: "২৫০০" },
          { label: "বেতন", amount: "১২০০" },
          { label: "থাকা ও খাওয়া", amount: "২০০০" },
        ],
        total: "৫৭০০",
      },
    },
  ];

  const activeClass = classes.find((c) => c.id === selectedClass) || classes[0];

  return (
    <div className="pb-16">
      {/* Header */}
      <div className="bg-[#F4FBFF]">
        <div className="py-14 flex flex-col gap-3 text-center px-4">
          <h1 className="text-[#2E3138] text-[24px] lg:text-[32px] font-[700]">
            ভর্তি
          </h1>
          <p className="text-[#464A53] text-[16px] lg:text-[18px] font-[500] max-w-[883px] mx-auto leading-relaxed">
            যে কোনো প্রয়োজনে যোগাযোগ করতে সরাসরি আমাদের অফিস ভিজিট করতে পারেন।
            তাছাড়া হটলাইন নম্বরে কল করে জেনে নিতে পারেন ভর্তি সংক্রান্ত যেকোনো
            তথ্য। নিচে শ্রেণি ভিত্তিক ফি কাঠামো দেখে অনলাইন আবেদন করুন।
          </p>
          <div className="mt-4">
            <Link
              to={`${basePath}/online-admission`}
              className="inline-flex items-center gap-2 bg-[#07A698] hover:bg-[#043334] text-white font-semibold px-6 py-2.5 rounded-full shadow-md transition-colors"
            >
              অনলাইন ভর্তি ফরম পূরণ করুন
              <ArrowRight className="w-4 h-4" />
            </Link>
          </div>
        </div>
      </div>

      {/* Interactive Fee Structure Section */}
      <div className="bg-[#07A698] mt-[40px] relative overflow-hidden">
        <div className="absolute top-0 right-0 pointer-events-none">
          <img className="w-[500px]" src="/portal/testi-shape-1.png" alt="" />
        </div>

        <div className="lg:max-w-[1200px] mx-auto lg:py-[80px] py-[40px] px-[15px] relative z-10">
          <div className="flex flex-col md:flex-row justify-between gap-10 md:gap-16">
            {/* Left Class Selector */}
            <div className="w-full md:w-5/12 flex flex-col gap-4">
              {classes.map((cls) => {
                const isSelected = selectedClass === cls.id;
                return (
                  <div key={cls.id} className="relative">
                    <div
                      onClick={() => setSelectedClass(cls.id)}
                      className={`rounded-[8px] h-fit p-4 flex flex-col gap-2 cursor-pointer transition-colors ${
                        isSelected
                          ? "bg-[#D4E9E7] text-[#043334] shadow-md"
                          : "bg-white/10 hover:bg-white/20 text-white"
                      }`}
                    >
                      <div className="flex gap-3 items-center">
                        <div className="w-[50px] h-[50px] overflow-hidden bg-white rounded-[6px] flex-shrink-0">
                          <img
                            className="w-full h-full object-cover rounded-[6px]"
                            alt="Class"
                            src="/portal/teacher1.png"
                          />
                        </div>
                        <div>
                          <h4 className="text-lg leading-[22px] font-[600]">
                            {cls.name}
                          </h4>
                          <div className="flex items-center gap-[12px] mt-[5px]">
                            <p className="text-sm leading-[18px]">
                              Subject: <span className="font-bold pl-[3px]">{cls.subjects}</span>
                            </p>
                            <p className="text-sm leading-[18px]">
                              Student: <span className="font-bold pl-[3px]">{cls.students}</span>
                            </p>
                          </div>
                        </div>
                      </div>
                    </div>
                    {isSelected && (
                      <>
                        <img
                          alt=""
                          src="/portal/comment.svg"
                          className="absolute bottom-4 -right-[30px] hidden md:block"
                        />
                        <img
                          alt=""
                          src="/portal/down_comment.svg"
                          className="absolute -bottom-5 right-3 block md:hidden"
                        />
                      </>
                    )}
                  </div>
                );
              })}
            </div>

            {/* Right Fee Structure Tables */}
            <div className="bg-[#D4E9E7] rounded-[8px] w-full md:w-7/12 px-[20px] py-[30px] lg:flex items-start justify-between gap-6 h-fit shadow-lg">
              <FeeTable
                title="অনাবাসিক"
                fees={activeClass.nonResidential}
              />
              <FeeTable
                title="আবাসিক"
                fees={activeClass.residential}
                borderClass="lg:border-l-[3px] lg:border-[#07A698] lg:pl-6 mt-[25px] lg:mt-0"
              />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AdmissionGuidelines;
