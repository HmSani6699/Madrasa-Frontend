import { useState } from "react";
import { Link, useParams } from "react-router-dom";
import { Home, ChevronRight, Loader2 } from "lucide-react";
import { toast } from "react-hot-toast";
import { usePortalSettings } from "../../context/PortalSettingsContext";
import axiosInstance from "../../api/axiosInstance";

const PortalContact = () => {
  const { settings } = usePortalSettings();
  const { slug } = useParams();
  const basePath = slug ? `/${slug}` : "";

  const [submitting, setSubmitting] = useState(false);
  const [formData, setFormData] = useState({
    name: "",
    number: "",
    description: "",
  });

  const madrasaName = settings?.branding?.name || "মাদ্রাসা পোর্টাল";
  const address = settings?.contact?.address || "";
  const phone = settings?.contact?.phone || "";
  const email = settings?.contact?.email || "";

  const mapSrc =
    settings?.contact?.mapEmbedUrl ||
    `https://maps.google.com/maps?q=${encodeURIComponent(
      address || madrasaName || "Dhaka, Bangladesh"
    )}&t=&z=14&ie=UTF8&iwloc=&output=embed`;

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!slug) {
      toast.success("আপনার বার্তা সফলভাবে পাঠানো হয়েছে!");
      setFormData({ name: "", number: "", description: "" });
      return;
    }

    setSubmitting(true);
    try {
      const response = await axiosInstance.post(`/portal/v1/${slug}/contact`, {
        name: formData.name,
        phone: formData.number,
        message: formData.description,
      });
      if (response.data?.success) {
        toast.success(
          response.data.message ||
            "আপনার বার্তা সফলভাবে পাঠানো হয়েছে! আমরা শীঘ্রই যোগাযোগ করব।"
        );
        setFormData({ name: "", number: "", description: "" });
      } else {
        toast.error(response.data?.message || "বার্তা পাঠানো যায়নি।");
      }
    } catch (error) {
      toast.error(
        error?.response?.data?.message ||
          "বার্তা পাঠাতে সমস্যা হয়েছে। অনুগ্রহ করে পরে আবার চেষ্টা করুন।"
      );
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="pb-16">
      {/* Breadcrumb */}
      <div className="flex items-center gap-[10px] py-[30px] max-w-[1200px] mx-auto px-[15px]">
        <Link
          to={basePath || "/"}
          className="flex items-center gap-1.5 text-[#123628] hover:text-[#1C7D5A] font-medium"
        >
          <Home className="w-4 h-4" />
          <span>হোম</span>
        </Link>
        <ChevronRight className="w-4 h-4 text-[#1C7D5A]" />
        <p className="text-slate-500">যোগাযোগ</p>
      </div>

      {/* Header */}
      <div className="bg-[#e8f5f0]">
        <div className="py-14 flex flex-col gap-3 text-center px-4">
          <h1 className="text-[#123628] text-[24px] lg:text-[32px] font-[700]">
            যোগাযোগ
          </h1>
          <p className="text-[#334155] text-[16px] lg:text-[18px] font-[500] max-w-[883px] mx-auto">
            যেকোনো প্রয়োজনে যোগাযোগ করতে সরাসরি আমাদের অফিসে ভিজিট করতে পারেন।
            তাছাড়া হেল্পলাইন নম্বরে কল করে বা নিচের ফরমের মাধ্যমে জেনে নিতে পারেন
            প্রতিষ্ঠান সংক্রান্ত যেকোনো তথ্য।
          </p>
        </div>
      </div>

      {/* Map & Details */}
      <div className="max-w-[1100px] mx-auto mt-[30px] px-[15px]">
        <div className="grid grid-cols-1 lg:grid-cols-2 py-[30px] gap-8 lg:gap-14">
          <div className="overflow-hidden bg-white rounded-[20px] shadow-sm border border-[#1C7D5A]/15">
            <div className="p-1.5">
              <iframe
                title={`${madrasaName} Location Map`}
                className="w-full h-[365px] rounded-[16px]"
                src={mapSrc}
                allowFullScreen=""
                loading="lazy"
                referrerPolicy="no-referrer-when-downgrade"
              />
            </div>
          </div>

          <div className="flex flex-col gap-5 justify-center">
            <div>
              <h2 className="text-[#123628] text-[22px] md:text-[26px] font-[700]">
                {madrasaName}
              </h2>
              {address && (
                <p className="text-[#334155] text-[15px] md:text-[18px] mt-1">
                  {address}
                </p>
              )}
            </div>
            {(phone || email) && (
              <div>
                <h2 className="text-[#123628] text-[22px] md:text-[26px] font-[700]">
                  হেল্পলাইন
                </h2>
                {phone && (
                  <p className="text-[#334155] text-[15px] md:text-[18px] mt-1">
                    ফোন: {phone}
                  </p>
                )}
                {email && (
                  <p className="text-[#334155] text-[15px] md:text-[18px]">
                    ইমেইল: {email}
                  </p>
                )}
              </div>
            )}
            <div>
              <h2 className="text-[#123628] text-[22px] md:text-[26px] font-[700]">
                অফিস ভিজিটের সময়
              </h2>
              <p className="text-[#334155] text-[15px] md:text-[18px] mt-1">
                {settings?.contact?.officeHours ||
                  "শনিবার - বৃহস্পতিবার (সকাল ৮ টা থেকে বিকাল ৫ টা)"}
              </p>
              <p className="text-[#334155] text-[15px] md:text-[18px]">
                {settings?.contact?.phoneHours || "ফোনে সকাল ৯টা হতে রাত ৯টা"}
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Contact Form */}
      <div className="mt-[20px] lg:w-[600px] mx-auto px-4">
        <div className="bg-white rounded-2xl shadow-md border border-[#1C7D5A]/15 py-[28px] px-6">
          <h2 className="text-[#123628] text-[23px] leading-[30px] font-[700] mb-2 text-center">
            আপনার যেকোনো প্রয়োজনে আমরা আছি আপনার পাশেই
          </h2>
          <p className="text-[#334155] text-sm sm:text-base mb-5 text-center">
            যেকোনো প্রশ্ন বা অনুসন্ধানের জন্য আমাদের সাথে যোগাযোগ করুন।
          </p>

          <form onSubmit={handleSubmit}>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-4">
              <div>
                <label
                  htmlFor="portal-contact-name"
                  className="text-[#0f172a] text-base font-[500] mb-1.5 block"
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
                  className="w-full px-[12px] py-[10px] outline-none rounded-lg border border-slate-300 focus:border-[#1C7D5A] focus:ring-2 focus:ring-[#1C7D5A]/15 shadow-2xs"
                />
              </div>
              <div>
                <label
                  htmlFor="portal-contact-number"
                  className="text-[#0f172a] text-base font-[500] mb-1.5 block"
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
                  className="w-full px-[12px] py-[10px] outline-none rounded-lg border border-slate-300 focus:border-[#1C7D5A] focus:ring-2 focus:ring-[#1C7D5A]/15 shadow-2xs"
                />
              </div>
            </div>

            <label
              htmlFor="portal-contact-description"
              className="text-[#0f172a] text-base font-[500] mb-1.5 block"
            >
              বার্তা / নোট
            </label>
            <textarea
              id="portal-contact-description"
              name="description"
              value={formData.description}
              onChange={(e) =>
                setFormData({ ...formData, description: e.target.value })
              }
              placeholder="দয়া করে আমাদের জানান আপনি কোন বিষয়ে জানতে চান"
              required
              className="w-full px-[12px] py-[10px] outline-none rounded-lg border border-slate-300 focus:border-[#1C7D5A] focus:ring-2 focus:ring-[#1C7D5A]/15 h-[120px] shadow-2xs"
            />

            <div className="flex justify-center md:justify-start">
              <button
                type="submit"
                disabled={submitting}
                className="text-white bg-[#1C7D5A] hover:bg-[#123628] disabled:opacity-60 transition-colors flex items-center justify-center gap-2 py-[10px] px-7 rounded-lg mt-5 font-semibold cursor-pointer"
              >
                {submitting ? (
                  <>
                    <Loader2 className="w-4 h-4 animate-spin" />
                    পাঠানো হচ্ছে...
                  </>
                ) : (
                  "জমা দিন"
                )}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default PortalContact;
