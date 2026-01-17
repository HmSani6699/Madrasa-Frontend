import { useState, useMemo } from "react";
import {
  Receipt,
  Search,
  Filter,
  Download,
  Send,
  AlertCircle,
  TrendingDown,
  Users,
  Calendar,
  MoreVertical,
  Printer,
  ChevronRight,
  Wallet,
  Clock,
  CheckCircle2,
} from "lucide-react";

/**
 * DuesPending Component
 * A premium dashboard for administrators to track and manage student fee arrears.
 */
const DuesPending = () => {
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedClass, setSelectedClass] = useState("all");
  const [activeTab, setActiveTab] = useState("all");

  // Mock data for the demonstration
  const [allStudents] = useState([
    {
      id: "ST001",
      name: "Abdullah Ibn Zayd",
      class: "Hifz",
      section: "A",
      amount: 2500,
      month: "January 2026",
      status: "Critical",
      daysPending: 45,
      phone: "01700000001",
    },
    {
      id: "ST042",
      name: "Fatimah Zahra",
      class: "Nursery",
      section: "B",
      amount: 1200,
      month: "January 2026",
      status: "Recent",
      daysPending: 5,
      phone: "01700000002",
    },
    {
      id: "ST089",
      name: "Umar Faruq",
      class: "Class 5",
      section: "C",
      amount: 3000,
      month: "December 2025",
      status: "Critical",
      daysPending: 72,
      phone: "01700000003",
    },
    {
      id: "ST115",
      name: "Ayesha Siddiqua",
      class: "Class 2",
      section: "A",
      amount: 1500,
      month: "January 2026",
      status: "Recent",
      daysPending: 12,
      phone: "01700000004",
    },
    {
      id: "ST204",
      name: "Ali Murtaza",
      class: "Class 8",
      section: "B",
      amount: 4500,
      month: "November 2025",
      status: "Critical",
      daysPending: 90,
      phone: "01700000005",
    },
    {
      id: "ST301",
      name: "Zainab Binte Ali",
      class: "Hifz",
      section: "B",
      amount: 2000,
      month: "January 2026",
      status: "Recent",
      daysPending: 15,
      phone: "01700000006",
    },
  ]);

  // Derived state for filtering
  const filteredStudents = useMemo(() => {
    return allStudents.filter((student) => {
      const matchesSearch =
        student.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        student.id.toLowerCase().includes(searchTerm.toLowerCase());
      const matchesClass =
        selectedClass === "all" ||
        student.class.toLowerCase() === selectedClass.toLowerCase();

      let matchesTab = true;
      if (activeTab === "this-month") matchesTab = student.daysPending <= 30;
      if (activeTab === "overdue") matchesTab = student.daysPending > 30;

      return matchesSearch && matchesClass && matchesTab;
    });
  }, [allStudents, searchTerm, selectedClass, activeTab]);

  // Dynamic Statistics
  const stats = useMemo(() => {
    const totalArrears = filteredStudents.reduce(
      (acc, curr) => acc + curr.amount,
      0
    );
    const criticalCount = filteredStudents.filter(
      (s) => s.status === "Critical"
    ).length;
    const oldestPending = Math.max(
      ...filteredStudents.map((s) => s.daysPending),
      0
    );

    return [
      {
        label: "Total Arrears",
        value: `৳ ${totalArrears.toLocaleString()}`,
        icon: Wallet,
        color: "rose",
        trend: "Current selection",
      },
      {
        label: "Pending Students",
        value: filteredStudents.length.toString(),
        icon: Users,
        color: "amber",
        trend: "Filtered view",
      },
      {
        label: "Critical Cases",
        value: criticalCount.toString(),
        icon: AlertCircle,
        color: "orange",
        trend: `${criticalCount} require urgent action`,
      },
      {
        label: "Max Delay",
        value: `${oldestPending} Days`,
        icon: Clock,
        color: "emerald",
        trend: "Oldest pending payment",
      },
    ];
  }, [filteredStudents]);

  // Handlers
  const handleCollectFees = (studentId) => {
    console.log(`Navigating to fee collection for student: ${studentId}`);
    // In a real app, use navigate(`/admin/accounting/fees/collect?id=${studentId}`)
    alert(`Redirecting to collect fees for ${studentId}`);
  };

  const handleSendSMS = (student) => {
    console.log(`Sending SMS reminder to: ${student.phone}`);
    alert(`SMS Reminder sent to ${student.name} at ${student.phone}`);
  };

  const handleBulkSMS = () => {
    alert(`Sending bulk SMS reminders to ${filteredStudents.length} parents.`);
  };

  const handlePrint = () => {
    window.print();
  };

  return (
    <div className="min-h-screen bg-slate-50/50 p-4 md:p-8 animate-in fade-in duration-500">
      <div className="max-w-[1600px] mx-auto space-y-8">
        {/* Header Section */}
        <div className="bg-white rounded-[2rem] md:rounded-[2.5rem] border border-slate-200 p-6 md:p-8 shadow-sm flex flex-col lg:flex-row justify-between items-start lg:items-center gap-6">
          <div className="flex items-center gap-4 md:gap-6">
            <div className="w-12 h-12 md:w-16 md:h-16 bg-rose-50 rounded-xl md:rounded-2xl flex items-center justify-center border border-rose-100 shadow-inner shrink-0 text-rose-600">
              <Receipt className="w-6 h-6 md:w-8 md:h-8" />
            </div>
            <div>
              <h1 className="text-xl md:text-3xl font-black text-slate-800 tracking-tight  leading-none">
                Dues Pending
              </h1>
              <p className="text-slate-500 font-bold mt-1 text-xs md:text-sm">
                Track and manage student arrears
              </p>
            </div>
          </div>

          <div className="flex flex-wrap gap-3 w-full lg:w-auto">
            <button className="flex-1 lg:flex-none px-4 md:px-6 py-3 md:py-4 bg-slate-100 text-slate-600 rounded-xl md:rounded-2xl font-black hover:bg-slate-200 transition-all flex items-center justify-center gap-2 border border-slate-200 uppercase tracking-widest text-[9px] md:text-[10px]">
              <Download className="w-4 h-4" />
              Export
            </button>
            <button
              onClick={handlePrint}
              className="flex-1 lg:flex-none px-4 md:px-6 py-3 md:py-4 bg-rose-600 text-white rounded-xl md:rounded-2xl font-black shadow-xl shadow-rose-100 hover:bg-rose-700 hover:scale-[1.02] active:scale-95 transition-all flex items-center justify-center gap-2 uppercase tracking-widest text-[9px] md:text-[10px]"
            >
              <Printer className="w-4 h-4" />
              Print
            </button>
          </div>
        </div>

        {/* Statistics Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 md:gap-6">
          {stats.map((stat) => (
            <div
              key={stat.label}
              className="bg-white rounded-[1.5rem] md:rounded-[2rem] border border-slate-200 p-5 md:p-6 shadow-sm group hover:border-rose-200 transition-all"
            >
              <div className="flex justify-between items-center mb-4">
                <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">
                  {stat.label}
                </p>
                <div
                  className={`w-8 h-8 md:w-10 md:h-10 rounded-lg md:rounded-xl flex items-center justify-center bg-${stat.color}-50 text-${stat.color}-600 group-hover:scale-110 transition-transform`}
                >
                  <stat.icon className="w-4 h-4 md:w-5 md:h-5" />
                </div>
              </div>
              <div className="space-y-1">
                <h4 className="text-2xl md:text-3xl font-black text-slate-800 tracking-tight">
                  {stat.value}
                </h4>
                <p
                  className={`text-[10px] font-bold text-slate-400 flex items-center gap-1`}
                >
                  {stat.trend}
                </p>
              </div>
            </div>
          ))}
        </div>

        {/* Filter & List Section */}
        <div className="bg-white rounded-[2rem] md:rounded-[3rem] border border-slate-200 shadow-sm overflow-hidden">
          <div className="p-6 md:p-8 border-b border-slate-50 bg-slate-50/20 flex flex-col xl:flex-row justify-between items-start xl:items-center gap-6 md:gap-8">
            <div className="flex-1 w-full space-y-4">
              <div className="flex items-center gap-3">
                <h2 className="text-xl md:text-2xl font-black text-slate-800 tracking-tight ">
                  Defaulters List
                </h2>
                <div className="px-2 py-0.5 md:px-3 md:py-1 bg-rose-100 text-rose-600 rounded-lg text-[9px] md:text-[10px] font-black uppercase tracking-widest border border-rose-200">
                  High Priority
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-3 md:gap-4">
                <div className="relative">
                  <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-300" />
                  <input
                    className="bg-white border border-slate-200 rounded-xl pl-10 pr-6 py-3 text-sm font-bold focus:border-rose-500 outline-none w-full shadow-sm transition-all text-slate-700"
                    placeholder="Search ID or Name..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                  />
                </div>
                <select
                  className="bg-white border border-slate-200 rounded-xl px-4 py-3 text-sm font-bold focus:border-rose-500 outline-none shadow-sm cursor-pointer text-slate-700"
                  value={selectedClass}
                  onChange={(e) => setSelectedClass(e.target.value)}
                >
                  <option value="all">Every Class</option>
                  <option value="hifz">Hifz</option>
                  <option value="nursery">Nursery</option>
                  <option value="class 2">Class 2</option>
                  <option value="class 5">Class 5</option>
                  <option value="class 8">Class 8</option>
                </select>
                <button className="px-4 py-3 bg-slate-900 text-white rounded-xl text-[10px] font-black uppercase tracking-widest hover:bg-slate-800 transition-all shadow-xl shadow-slate-200 flex items-center justify-center gap-2 sm:col-span-2 md:col-span-1">
                  <Filter className="w-4 h-4" />
                  Filters
                </button>
              </div>
            </div>

            <div className="flex items-center gap-2 md:gap-3 bg-slate-100 p-1.5 md:p-2 rounded-xl md:rounded-2xl w-full xl:w-auto overflow-x-auto no-scrollbar">
              {[
                { id: "all", label: "All Time" },
                { id: "this-month", label: "This Month" },
                { id: "overdue", label: "Overdue" },
              ].map((tab) => (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id)}
                  className={`px-4 md:px-6 py-2 rounded-lg md:rounded-xl text-[9px] md:text-[10px] font-black uppercase tracking-widest transition-all whitespace-nowrap ${
                    activeTab === tab.id
                      ? "bg-white text-rose-600 shadow-sm border border-slate-200/50"
                      : "text-slate-400 hover:text-slate-600"
                  }`}
                >
                  {tab.label}
                </button>
              ))}
            </div>
          </div>

          <div className="overflow-x-auto scrollbar-thin scrollbar-thumb-slate-200">
            <table className="w-full border-collapse min-w-[900px]">
              <thead>
                <tr className="border-b border-slate-50 text-[10px] font-black text-slate-400 uppercase tracking-widest bg-slate-50/10">
                  <th className="px-6 md:px-8 py-4 md:py-6 text-left">
                    Student Info
                  </th>
                  <th className="px-6 md:px-8 py-4 md:py-6 text-center">
                    Class / Section
                  </th>
                  <th className="px-6 md:px-8 py-4 md:py-6 text-center">
                    Month
                  </th>
                  <th className="px-6 md:px-8 py-4 md:py-6 text-center">
                    Amount
                  </th>
                  <th className="px-6 md:px-8 py-4 md:py-6 text-center">
                    Delay
                  </th>
                  <th className="px-6 md:px-8 py-4 md:py-6 text-center">
                    Severity
                  </th>
                  <th className="px-6 md:px-8 py-4 md:py-6 text-right">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-50">
                {filteredStudents.length > 0 ? (
                  filteredStudents.map((student) => (
                    <tr
                      key={student.id}
                      className="group hover:bg-slate-50/50 transition-all"
                    >
                      <td className="px-6 md:px-8 py-4 md:py-6">
                        <div className="flex items-center gap-3">
                          <div className="w-10 h-10 md:w-12 md:h-12 bg-slate-100 rounded-[0.75rem] md:rounded-[1rem] flex items-center justify-center font-black text-slate-400 group-hover:bg-rose-50 group-hover:text-rose-600 transition-all shrink-0">
                            {student.name
                              .split(" ")
                              .map((n) => n[0])
                              .join("")}
                          </div>
                          <div className="min-w-0">
                            <p className="text-sm font-black text-slate-800 uppercase tracking-tight truncate">
                              {student.name}
                            </p>
                            <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">
                              {student.id}
                            </p>
                          </div>
                        </div>
                      </td>
                      <td className="px-6 md:px-8 py-4 md:py-6 text-center">
                        <div className="inline-flex flex-col">
                          <span className="text-xs font-black text-slate-700 uppercase">
                            {student.class}
                          </span>
                          <span className="text-[9px] font-bold text-slate-400 uppercase tracking-widest">
                            Sec: {student.section}
                          </span>
                        </div>
                      </td>
                      <td className="px-6 md:px-8 py-4 md:py-6 text-center whitespace-nowrap">
                        <div className="inline-flex items-center gap-1.5 px-3 py-1 bg-slate-50 rounded-lg border border-slate-100">
                          <Calendar className="w-3 h-3 text-slate-400" />
                          <span className="text-[10px] font-black text-slate-600 uppercase tracking-tighter">
                            {student.month}
                          </span>
                        </div>
                      </td>
                      <td className="px-6 md:px-8 py-4 md:py-6 text-center whitespace-nowrap">
                        <span className="text-base font-black text-slate-800 group-hover:text-rose-600 transition-colors">
                          ৳ {student.amount.toLocaleString()}
                        </span>
                      </td>
                      <td className="px-6 md:px-8 py-4 md:py-6 text-center">
                        <div className="flex flex-col items-center">
                          <span
                            className={`text-[10px] font-black ${
                              student.daysPending > 30
                                ? "text-rose-500"
                                : "text-slate-500"
                            }`}
                          >
                            {student.daysPending} Days
                          </span>
                          <div className="w-10 h-1 bg-slate-100 rounded-full mt-1.5 overflow-hidden">
                            <div
                              className={`h-full ${
                                student.daysPending > 60
                                  ? "bg-rose-500"
                                  : student.daysPending > 30
                                  ? "bg-orange-500"
                                  : "bg-emerald-500"
                              }`}
                              style={{
                                width: `${Math.min(student.daysPending, 100)}%`,
                              }}
                            />
                          </div>
                        </div>
                      </td>
                      <td className="px-6 md:px-8 py-4 md:py-6 text-center">
                        <div
                          className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-[9px] font-black uppercase tracking-widest border ${
                            student.status === "Critical"
                              ? "bg-rose-50 text-rose-500 border-rose-100"
                              : "bg-amber-50 text-amber-600 border-amber-100"
                          }`}
                        >
                          <div
                            className={`w-1 h-1 rounded-full ${
                              student.status === "Critical"
                                ? "bg-rose-500"
                                : "bg-amber-500"
                            } animate-pulse`}
                          />
                          {student.status}
                        </div>
                      </td>
                      <td className="px-6 md:px-8 py-4 md:py-6 text-right">
                        <div className="flex justify-end gap-1.5 md:gap-2">
                          <button
                            onClick={() => handleCollectFees(student.id)}
                            className="p-2 md:p-2.5 bg-emerald-50 text-emerald-600 rounded-lg md:rounded-xl hover:bg-emerald-600 hover:text-white transition-all shadow-sm border border-emerald-100 group/btn shrink-0"
                            title="Collect Fees"
                          >
                            <ChevronRight className="w-4 h-4 group-hover/btn:translate-x-0.5 transition-transform" />
                          </button>
                          <button
                            onClick={() => handleSendSMS(student)}
                            className="p-2 md:p-2.5 bg-blue-50 text-blue-600 rounded-lg md:rounded-xl hover:bg-blue-600 hover:text-white transition-all shadow-sm border border-blue-100 shrink-0"
                            title="Send SMS"
                          >
                            <Send className="w-4 h-4" />
                          </button>
                          <button className="p-2 md:p-2.5 bg-slate-50 text-slate-400 rounded-lg md:rounded-xl hover:bg-slate-200 hover:text-slate-600 transition-all border border-slate-100 shrink-0">
                            <MoreVertical className="w-4 h-4" />
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan="7" className="px-8 py-20 text-center">
                      <div className="flex flex-col items-center gap-4">
                        <div className="w-16 h-16 bg-slate-50 rounded-full flex items-center justify-center border border-dashed border-slate-200">
                          <Search className="w-8 h-8 text-slate-200" />
                        </div>
                        <p className="text-slate-400 font-bold uppercase tracking-widest text-xs">
                          No matching defaulters found
                        </p>
                      </div>
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>

          <div className="p-6 md:p-8 bg-slate-50/50 flex flex-col md:flex-row justify-between items-center border-t border-slate-100 gap-6">
            <p className="text-[10px] font-black uppercase tracking-widest text-slate-400">
              Showing{" "}
              <span className="text-slate-900 font-black">
                {filteredStudents.length}
              </span>{" "}
              results
            </p>
            <div className="flex gap-2 w-full md:w-auto">
              <button className="flex-1 md:flex-none px-6 py-2 bg-white text-slate-600 rounded-xl text-[10px] font-black uppercase tracking-widest border border-slate-200 hover:bg-slate-50 transition-all shadow-sm">
                Prev
              </button>
              <button className="flex-1 md:flex-none px-6 py-2 bg-slate-900 text-white rounded-xl text-[10px] font-black uppercase tracking-widest shadow-xl shadow-slate-200 hover:bg-slate-800 transition-all">
                Next
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default DuesPending;
