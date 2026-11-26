import { useState, useEffect, useCallback } from "react";
import { Clock, Utensils, Save, Loader2 } from "lucide-react";
import { toast } from "react-hot-toast";
import boardingService from "../../../services/boardingService";
import { WEEKDAYS_BN, WEEKDAY_KEYS } from "./boardingConstants";
import BoardingPageHeader from "./BoardingPageHeader";

const MealSchedulePage = () => {
  const [loading, setLoading] = useState(true);
  const [schedules, setSchedules] = useState([]);
  const [activeIdx, setActiveIdx] = useState(0);
  const [saving, setSaving] = useState(false);

  const fetchSchedules = useCallback(async () => {
    try {
      setLoading(true);
      const res = await boardingService.getSchedules();
      if (res.success) {
        setSchedules(
          (res.data || []).map((s) => ({
            ...s,
            weekly_menu: { ...(s.weekly_menu || {}) },
          }))
        );
      }
    } catch {
      toast.error("মিল শিডিউল লোড করতে সমস্যা হয়েছে");
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchSchedules();
  }, [fetchSchedules]);

  const current = schedules[activeIdx];

  const handleFieldChange = (field, value) => {
    setSchedules((prev) =>
      prev.map((item, idx) => (idx === activeIdx ? { ...item, [field]: value } : item))
    );
  };

  const handleWeeklyMenuChange = (day, value) => {
    setSchedules((prev) =>
      prev.map((item, idx) =>
        idx === activeIdx
          ? {
              ...item,
              weekly_menu: { ...(item.weekly_menu || {}), [day]: value },
            }
          : item
      )
    );
  };

  const handleSave = async () => {
    if (!current) return;
    try {
      setSaving(true);
      await boardingService.updateSchedule(current._id, {
        start_time: current.start_time,
        end_time: current.end_time,
        default_menu: current.default_menu,
        weekly_menu: current.weekly_menu,
      });
      toast.success(`${current.meal_name_bn || current.meal_name} এর শিডিউল ও মেনু সংরক্ষিত হয়েছে`);
      fetchSchedules();
    } catch (err) {
      toast.error(err.response?.data?.message || "শিডিউল আপডেট ব্যর্থ হয়েছে");
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="space-y-5 animate-in fade-in duration-500">
      <BoardingPageHeader
        title="মিল শিডিউল ও সাপ্তাহিক মেনু চার্ট"
        subtitle="সকাল, দুপুর ও রাতের খাবারের সময় এবং বার অনুযায়ী সাপ্তাহিক মেনু নির্ধারণ করুন"
        icon={Utensils}
      />

      {loading ? (
        <div className="bg-white rounded-[8px] border border-slate-200 p-12 text-center">
          <Loader2 className="w-7 h-7 animate-spin mx-auto text-[#1C7D5A] mb-2" />
          <p className="text-sm text-slate-500">শিডিউল লোড হচ্ছে...</p>
        </div>
      ) : (
        <div className="bg-white rounded-[8px] border border-slate-200 shadow-sm overflow-hidden">
          {/* Meal Selector Tabs */}
          <div className="px-6 pt-4 border-b border-slate-200 flex flex-wrap items-center justify-between gap-3 bg-slate-50">
            <div className="flex gap-2">
              {schedules.map((s, idx) => (
                <button
                  key={s._id || s.meal_name}
                  onClick={() => setActiveIdx(idx)}
                  className={`px-5 py-2.5 text-sm font-bold rounded-t-lg border-b-2 transition-all cursor-pointer ${
                    idx === activeIdx
                      ? "border-[#1C7D5A] text-[#1C7D5A] bg-white"
                      : "border-transparent text-slate-600 hover:text-slate-800"
                  }`}
                >
                  {s.meal_name_bn || s.meal_name}{" "}
                  <span className="text-xs font-normal text-slate-400 ml-1">
                    ({s.start_time} - {s.end_time})
                  </span>
                </button>
              ))}
            </div>

            <button
              onClick={handleSave}
              disabled={saving || !current}
              className="mb-2 px-5 py-2 bg-[#1C7D5A] hover:bg-[#123628] text-white text-sm font-semibold rounded-lg shadow-sm flex items-center gap-2 transition-colors disabled:opacity-60 cursor-pointer"
            >
              {saving ? <Loader2 className="w-4 h-4 animate-spin" /> : <Save className="w-4 h-4" />}
              পরিবর্তন সংরক্ষণ করুন
            </button>
          </div>

          {current && (
            <div className="p-6 space-y-6">
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 bg-slate-50 p-4 rounded-xl border border-slate-200">
                <div>
                  <label className="text-xs font-bold text-slate-600 mb-1.5 flex items-center gap-1">
                    <Clock className="w-3.5 h-3.5 text-[#1C7D5A]" /> শুরু হওয়ার সময়
                  </label>
                  <input
                    type="time"
                    value={current.start_time || ""}
                    onChange={(e) => handleFieldChange("start_time", e.target.value)}
                    className="w-full px-3 py-2 bg-white border border-slate-200 rounded-lg text-sm font-semibold focus:outline-none focus:border-[#1C7D5A]"
                  />
                </div>
                <div>
                  <label className="text-xs font-bold text-slate-600 mb-1.5 flex items-center gap-1">
                    <Clock className="w-3.5 h-3.5 text-[#1C7D5A]" /> শেষ হওয়ার সময়
                  </label>
                  <input
                    type="time"
                    value={current.end_time || ""}
                    onChange={(e) => handleFieldChange("end_time", e.target.value)}
                    className="w-full px-3 py-2 bg-white border border-slate-200 rounded-lg text-sm font-semibold focus:outline-none focus:border-[#1C7D5A]"
                  />
                </div>
                <div>
                  <label className="text-xs font-bold text-slate-600 mb-1.5 block">ডিফল্ট মেনু</label>
                  <input
                    type="text"
                    value={current.default_menu || ""}
                    onChange={(e) => handleFieldChange("default_menu", e.target.value)}
                    placeholder="যেমন: ভাত, ডাল ও মাছ"
                    className="w-full px-3 py-2 bg-white border border-slate-200 rounded-lg text-sm focus:outline-none focus:border-[#1C7D5A]"
                  />
                </div>
              </div>

              <div>
                <h3 className="text-sm font-bold text-slate-800 mb-3">
                  সাপ্তাহিক মেনু চার্ট ({current.meal_name_bn || current.meal_name})
                </h3>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                  {WEEKDAY_KEYS.map((day) => (
                    <div
                      key={day}
                      className={`p-4 rounded-xl border ${
                        day === "Friday"
                          ? "bg-amber-50/70 border-amber-200"
                          : "bg-slate-50/70 border-slate-200"
                      }`}
                    >
                      <label className="text-xs font-bold text-slate-700 mb-2 flex items-center justify-between">
                        <span>{WEEKDAYS_BN[day]}</span>
                        {day === "Friday" && (
                          <span className="text-[10px] px-2 py-0.5 bg-amber-100 text-amber-800 rounded-full">
                            জুমা স্পেশাল
                          </span>
                        )}
                      </label>
                      <input
                        type="text"
                        value={current.weekly_menu?.[day] || ""}
                        onChange={(e) => handleWeeklyMenuChange(day, e.target.value)}
                        placeholder="মেনু লিখুন..."
                        className="w-full px-3 py-2 bg-white border border-slate-200 rounded-lg text-sm focus:outline-none focus:border-[#1C7D5A]"
                      />
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default MealSchedulePage;
