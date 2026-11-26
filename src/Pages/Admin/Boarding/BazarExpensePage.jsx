import { ShoppingBag } from "lucide-react";
import BoardingPageHeader from "./BoardingPageHeader";
import BazarExpenseTab from "./BazarExpenseTab";

const BazarExpensePage = () => {
  return (
    <div className="space-y-5 animate-in fade-in duration-500">
      <BoardingPageHeader
        title="বোর্ডিং বাজার ও খরচ ব্যবস্থাপনা"
        subtitle="দৈনিক কাঁচাবাজার, মাছ-মাংস, শুকনো বাজার ও জ্বালানি খরচের ভাউচার এন্ট্রি ও ইতিহাস"
        icon={ShoppingBag}
      />
      <BazarExpenseTab />
    </div>
  );
};

export default BazarExpensePage;
