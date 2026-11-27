import { useState } from "react";
import { Link, useParams } from "react-router-dom";
import { Home, ChevronRight } from "lucide-react";
import { toast } from "react-hot-toast";
import { usePortalSettings } from "../../context/PortalSettingsContext";

const PortalContact = () => {
  const { settings } = usePortalSettings();
  const { slug } = useParams();
  const basePath = slug ? `/${slug}` : "";

  const [formData, setFormData] = useState({
    name: "",
    number: "",
    description: "",
  });

  const handleSubmit = (e) => {
    e.preventDefault();
    toast.success("আপনার বার্তা সফলভাবে পাঠানো হয়েছে! আমরা শীঘ্রই যোগাযোগ করব।");
    setFormData({ name: "", number: "", description: "" });
  };

  return (
    <div className="pb-16">
      {/* Breadcrumb */}
      <div className="flex items-center gap-[10px] py-[30px] max-w-[1200px] mx-auto px-[15px]">
        <Link to={basePath || "/"} className="flex items-center gap-1.5 text-[#1d5276] hover:text-[#07A698]">
          <Home className="w-4 h-4" />
          <span>হোম</span>
        </Link>
        <ChevronRight className="w-4 h-4 text-[#1d5276]" />
        <p className="text-gray-500">যোগাযোগ</p>
      </div>

      {/* Header */}
      <div className="bg-[#F4FBFF]">
        <div className="py-14 flex flex-col gap-3 text-center px-4">
          <h1 className="text-[#2E3138] text-[24px] lg:text-[28px] font-[700]">
            যোগাযোগ
          </h1>
          <p className="text-[#464A53] text-[16px] lg:text-[18px] font-[500] max-w-[883px] mx-auto">
            যে কোনো প্রয়োজনে যোগাযোগ করতে সরাসরি আমাদের অফিস ভিজিট করতে পারেন।
            তাছাড়া হটলাইন নম্বরে কল করে জেনে নিতে পারেন ওয়েবসাইট সংক্রান্ত যেকোনো
            তথ্য। এছাড়াও উল্লেখিত মেইলে কিংবা ফেসবুক ম্যাসেঞ্জারেও নক দিতে
            পারেন।
          </p>
        </div>
      </div>

      {/* Map & Details */}
      <div className="max-w-[1100px] mx-auto mt-[30px] px-[15px]">
        <div className="grid grid-cols-1 lg:grid-cols-2 py-[30px] gap-8 lg:gap-14">
          <div className="overflow-hidden bg-white rounded-[20px] shadow-sm border border-slate-200">
            <div className="p-1">
              <iframe
                title="Madrasa Location Map"
                className="w-full h-[365px] rounded-[18px]"
                src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3680.403684594337!2d90.34984647048685!3d22.713232282279513!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x375534204212d309%3A0xea060a02396e8889!2sRainbow%20Computer%20Training%20Institute!5e0!3m2!1sen!2sbd!4v1699362621241!5m2!1sen!2sbd"
                allowFullScreen=""
                loading="lazy"
                referrerPolicy="no-referrer-when-downgrade"
              />
            </div>
          </div>

          <div className="flex flex-col gap-5 justify-center">
            <div>
              <h2 className="text-[#2E3138] text-[22px] md:text-[26px] font-[700]">
                {settings?.branding?.name || "এডুকেশন ম্যানেজমেন্ট ওয়েবসাইট"}
              </h2>
              <p className="text-[#2E3138] text-[15px] md:text-[18px] mt-1">
                {settings?.contact?.address || "পাকুন্ডা, সোনারগাঁ, নারায়ণগঞ্জ"}
              </p>
            </div>
            <div>
              <h2 className="text-[#2E3138] text-[22px] md:text-[26px] font-[700]">
                হেল্পলাইন
              </h2>
              <p className="text-[#2E3138] text-[15px] md:text-[18px] mt-1">
                Phone: {settings?.contact?.phone || "01830-630365"}
              </p>
              <p className="text-[#2E3138] text-[15px] md:text-[18px]">
                E-mail: {settings?.contact?.email || "info.edusadiq@gmail.com"}
              </p>
            </div>
            <div>
              <h2 className="text-[#2E3138] text-[22px] md:text-[26px] font-[700]">
                অফিস ভিজিটের সময়
              </h2>
              <p className="text-[#2E3138] text-[15px] md:text-[18px] mt-1">
                {settings?.contact?.officeHours ||
                  "শনিবার - শুক্রবার (সকাল ৯ টা থেকে রাত ৮ টা)"}
              </p>
              <p className="text-[#2E3138] text-[15px] md:text-[18px]">
                {settings?.contact?.phoneHours || "ফোনে সকাল ১০টা হতে রাত ১১টা"}
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Contact Form */}
      <div className="mt-[20px] lg:w-[600px] mx-auto px-4">
        <div className="bg-white rounded-2xl shadow-sm border border-slate-100 py-[25px] px-6">
          <h2 className="text-[#1D5276] text-[23px] leading-[30px] font-[700] mb-2 text-center">
            আপনার যেকোনো প্রয়োজনে আমরা আছি আপনার পাশেই
          </h2>
          <p className="text-[#374151] text-sm sm:text-base mb-5 text-center">
            যে কোন উদ্বেগ বা অনুসন্ধান সম্পর্কে আমাদের সাথে যোগাযোগ করুন.
          </p>

          <form onSubmit={handleSubmit}>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-4">
              <div>
                <label
                  htmlFor="portal-contact-name"
                  className="text-[#111827] text-base font-[500] mb-1.5 block"
                >
                  আপনার নাম
                </label>
                <input
                  id="portal-contact-name"
                  name="name"
                  type="text"
                  value={formData.name}
                  onChange={(e) =>
                    setFormData({ ...formData, name: e.target.value })
                  }
                  placeholder="আপনার নাম"
                  required
                  className="w-full px-[12px] py-[10px] outline-none rounded-md border border-[#D1D5DB] focus:border-[#07A698] shadow-xs"
                />
              </div>
              <div>
                <label
                  htmlFor="portal-contact-number"
                  className="text-[#111827] text-base font-[500] mb-1.5 block"
                >
                  মোবাইল নম্বর
                </label>
                <input
                  id="portal-contact-number"
                  name="number"
                  type="text"
                  value={formData.number}
                  onChange={(e) =>
                    setFormData({ ...formData, number: e.target.value })
                  }
                  placeholder="মোবাইল নম্বর"
                  required
                  className="w-full px-[12px] py-[10px] outline-none rounded-md border border-[#D1D5DB] focus:border-[#07A698] shadow-xs"
                />
              </div>
            </div>

            <label
              htmlFor="portal-contact-description"
              className="text-[#111827] text-base font-[500] mb-1.5 block"
            >
              নোট
            </label>
            <textarea
              id="portal-contact-description"
              name="description"
              value={formData.description}
              onChange={(e) =>
                setFormData({ ...formData, description: e.target.value })
              }
              placeholder="দয়া করে আমাদের জানান আপনি কি বা কোন বিষয়ে জানতে চান"
              required
              className="w-full px-[12px] py-[10px] outline-none rounded-md border border-[#D1D5DB] focus:border-[#07A698] h-[120px] shadow-xs"
            />

            <div className="flex justify-center md:justify-start">
              <button
                type="submit"
                className="text-white bg-[#07A698] hover:bg-[#058c80] transition-colors flex items-center justify-center py-[10px] px-6 rounded-md mt-5 font-semibold cursor-pointer"
              >
                জমা দিন
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default PortalContact;
