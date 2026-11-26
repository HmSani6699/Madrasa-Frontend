import { useState, useEffect, useCallback } from "react";
import {
  UtensilsCrossed,
  Sunrise,
  Sun,
  Moon,
  ClipboardList,
  UserPlus,
} from "lucide-react";
import { toast } from "react-hot-toast";
import boardingService from "../../../services/boardingService";
import { getTodayDateStr } from "./boardingConstants";
import BoardingPageHeader from "./BoardingPageHeader";
import BoardingKpiCards from "./BoardingKpiCards";
import DailyRosterTab from "./DailyRosterTab";

const DailyRosterPage = () => {
  const [selectedDate, setSelectedDate] = useState(getTodayDateStr());
  const [dashboard, setDashboard] = useState(null);
  const [isGuestModalOpen, setIsGuestModalOpen] = useState(false);

  const fetchDashboard = useCallback(async () => {
    try {
      const res = await boardingService.getDashboard(selectedDate);
      if (res.success) {
        setDashboard(res.data);
      }
    } catch (err) {
      console.error("Failed to fetch boarding dashboard:", err);
      toast.error("বোর্ডিং ড্যাশবোর্ড লোড করতে সমস্যা হয়েছে");
    }
  }, [selectedDate]);

  useEffect(() => {
    let active = true;
    boardingService
      .getDashboard(selectedDate)
      .then((res) => {
        if (active && res.success) setDashboard(res.data);
      })
      .catch(() => {
        if (active) toast.error("বোর্ডিং ড্যাশবোর্ড লোড করতে সমস্যা হয়েছে");
      });
    return () => {
      active = false;
    };
  }, [selectedDate]);

  const mealsToday = dashboard?.mealsToday || {
    breakfast: 0,
    lunch: 0,
    dinner: 0,
    total: 0,
    studentBreakfast: 0,
    studentLunch: 0,
    studentDinner: 0,
    guestBreakfast: 0,
    guestLunch: 0,
    guestDinner: 0,
    deliveredBreakfast: 0,
    deliveredLunch: 0,
    deliveredDinner: 0,
    deliveredTotal: 0,
  };

  const guestTotal =
    (mealsToday.guestBreakfast || 0) +
    (mealsToday.guestLunch || 0) +
    (mealsToday.guestDinner || 0);
  const studentTotal = Math.max(0, (mealsToday.total || 0) - guestTotal);

  const kpiCards = [
    {

      value: `${mealsToday.total || 0} মোট মিল`,
      subtitle: `ছাত্র: ${studentTotal} | উপস্থিত: ${mealsToday.deliveredTotal || 0}${guestTotal > 0 ? ` | অতিথি: ${guestTotal}` : ""
        }`,
      icon: UtensilsCrossed,
      color: "text-emerald-600",
      bg: "bg-emerald-50",
    },
    {

      value: `${mealsToday.breakfast || 0} সকাল`,
      subtitle: `ছাত্র: ${mealsToday.studentBreakfast ?? mealsToday.breakfast ?? 0} | উপস্থিত: ${mealsToday.deliveredBreakfast || 0
        }${mealsToday.guestBreakfast > 0 ? ` | অতিথি: ${mealsToday.guestBreakfast}` : ""}`,
      icon: Sunrise,
      color: "text-amber-600",
      bg: "bg-amber-50",
    },
    {

      value: `${mealsToday.lunch || 0} দুপুর`,
      subtitle: `ছাত্র: ${mealsToday.studentLunch ?? mealsToday.lunch ?? 0} | উপস্থিত: ${mealsToday.deliveredLunch || 0
        }${mealsToday.guestLunch > 0 ? ` | অতিথি: ${mealsToday.guestLunch}` : ""}`,
      icon: Sun,
      color: "text-blue-600",
      bg: "bg-blue-50",
    },
    {

      value: `${mealsToday.dinner || 0} রাত`,
      subtitle: `ছাত্র: ${mealsToday.studentDinner ?? mealsToday.dinner ?? 0} | উপস্থিত: ${mealsToday.deliveredDinner || 0
        }${mealsToday.guestDinner > 0 ? ` | অতিথি: ${mealsToday.guestDinner}` : ""}`,
      icon: Moon,
      color: "text-indigo-600",
      bg: "bg-indigo-50",
    },
  ];

  return (
    <div className="space-y-5 animate-in fade-in duration-500">
      <BoardingPageHeader
        title="দৈনিক মিল ও রোস্টার"
        subtitle="তারিখ অনুযায়ী আজকের মিলের সারসংক্ষেপ, ছাত্রদের মিল রোস্টার এবং অতিথি মিল পরিচালনা করুন"
        icon={ClipboardList}
        rightActions={
          <button
            type="button"
            onClick={() => setIsGuestModalOpen(true)}
            className="py-2 px-4 bg-[#1C7D5A] hover:bg-[#123628] text-white text-sm font-semibold rounded-lg shadow-sm transition-colors flex items-center justify-center gap-1.5 cursor-pointer"
          >
            <UserPlus className="w-4 h-4" />
            অতিথি মিল যোগ করুন
          </button>
        }
      />

      {/* 4 Top Dynamic Meal Report Cards */}
      <BoardingKpiCards cards={kpiCards} />

      <DailyRosterTab
        selectedDate={selectedDate}
        onDateChange={setSelectedDate}
        onRefreshDashboard={fetchDashboard}
        isGuestModalOpen={isGuestModalOpen}
        onCloseGuestModal={() => setIsGuestModalOpen(false)}
      />
    </div>
  );
};

export default DailyRosterPage;
