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
    Settings,
    FileText
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
      ]
    },
    {
      name: "Income",
      icon: TrendingUp,
      children: [
        { name: "Other Income", path: "/admin/inventory/sales", icon: DollarSign },
      ]
    },
    {
      name: "Reports",
      icon: FilePieChart,
      children: [
        { name: "Fee Reports", path: "/admin/reports/fees", icon: FilePieChart },
        { name: "Expense Report", path: "/admin/reports/finance", icon: FilePieChart },
        { name: "Income Report", path: "/admin/reports/finance", icon: FilePieChart },
        { name: "Salary Report", path: "/admin/accounting/report/salary", icon: FileText },
        { name: "Donation Report", path: "/admin/accounting/report/donation", icon: FileText },
        { name: "Income & Expense Report", path: "/admin/accounting/report/income-expense", icon: FileText },
      ]
    },
    {
      name: "Settings",
      path: "/admin/settings",
      icon: Settings,
    },
  ];
