import { 
    LayoutDashboard, 
    Wallet, 
    Receipt, 
    Banknote, 
    TrendingDown, 
    TrendingUp, 
    FilePieChart,
    Users,
    CreditCard,
    DollarSign,
    Settings
  } from "lucide-react";
  
  export const accountingNavigation = [
    {
      name: "Financial Overview",
      path: "/accounting",
      icon: LayoutDashboard,
    },
    {
      name: "Fees Collection",
      icon: Wallet,
      children: [
        { name: "Collect Fees", path: "/admin/reports/fees", icon: DollarSign }, // Using admin path as placeholder for now, ideally needs a collection page
        { name: "Dues Pending", path: "/guardian/finance/fees", icon: Receipt }, // Specific view for tracking
        { name: "Fee Reports", path: "/admin/reports/fees", icon: FilePieChart },
      ]
    },
    {
      name: "Payroll",
      icon: Banknote,
      children: [
        { name: "Employee Salaries", path: "/admin/employee/list", icon: Users },
        { name: "Salary Slip", path: "/admin/certificate/employee", icon: Receipt },
      ]
    },
    {
      name: "Expenses",
      icon: TrendingDown,
      children: [
        { name: "Add Expense", path: "/admin/inventory/purchase", icon: CreditCard },
        { name: "Expense Report", path: "/admin/reports/finance", icon: FilePieChart },
      ]
    },
    {
      name: "Income",
      icon: TrendingUp,
      children: [
        { name: "Other Income", path: "/admin/inventory/sales", icon: DollarSign },
        { name: "Income Report", path: "/admin/reports/finance", icon: FilePieChart },
      ]
    },
    {
      name: "Settings",
      path: "/admin/settings",
      icon: Settings,
    },
  ];
