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
    FileText,
    Calculator
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
        { name: "Collect Fees", path: "/admin/accounting/fees/collect", icon: DollarSign },
        { name: "Fee Type", path: "/admin/accounting/fees/type", icon: Settings },
      ]
    },
    {
      name: "Payroll",
      icon: Banknote,
      children: [
        { name: "Monthly Payroll", path: "/admin/accounting/payroll/monthly", icon: Calculator },
        { name: "Salary Setup", path: "/admin/accounting/payroll/setup", icon: DollarSign },
        { name: "Advance & Loans", path: "/admin/accounting/payroll/advance", icon: Wallet },
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
      name: "Accounting Report",
      icon: FilePieChart,
      children: [
        { name: "Fee Collection Report", path: "/admin/accounting/report/free-collection", icon: FileText },
        { name: "Due Fees Report", path: "/admin/accounting/report/due-fees", icon: FileText },
        { name: "Salary Report", path: "/admin/accounting/report/salary", icon: FileText },
        { name: "Donation Report", path: "/admin/accounting/report/donation", icon: FileText },
        { name: "Income & Expense Report", path: "/admin/accounting/report/income-expense", icon: FileText },
        { name: "Account Ledger Report", path: "/admin/accounting/report/accounts", icon: FileText },
        { name: "Boarding & Transport Report", path: "/admin/accounting/report/boarding-transport", icon: FileText },
      ]
    },
    {
      name: "Settings",
      path: "/admin/settings",
      icon: Settings,
    },
  ];
