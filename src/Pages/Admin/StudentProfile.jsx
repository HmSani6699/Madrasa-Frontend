import { useState, useMemo, useEffect } from "react";
import { useParams, Link, useNavigate } from "react-router";
import {
  User,
  Shield,
  BookOpen,
  DollarSign,
  FileText,
  Phone,
  Mail,
  MapPin,
  Calendar,
  ChevronLeft,
  Printer,
  Edit2,
  CheckCircle,
  CheckCircle2,
  Clock,
  AlertCircle,
  GraduationCap,
  Users,
  Download,
  Eye,
  ArrowUpRight,
  TrendingUp,
  CreditCard,
  X,
  File,
  DownloadIcon,
  Loader2
} from "lucide-react";
import SelectInputField from "../../components/SelectInputField";
import portalService from "../../services/portalService";

const StudentProfile = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState("summary");
  const [showEditModal, setShowEditModal] = useState(false);
  const [showToast, setShowToast] = useState(null);
  const [loading, setLoading] = useState(true);
  const [student, setStudent] = useState(null);

  useEffect(() => {
    fetchStudentProfile();
  }, [id]);

  const fetchStudentProfile = async () => {
    try {
      setLoading(true);
      const data = await portalService.getStudentPortalData(id);
      setStudent(data.data);
    } catch (err) {
      console.error("Failed to fetch student profile", err);
    } finally {
      setLoading(false);
    }
  };

  const handlePrint = () => {
    window.print();
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <Loader2 className="w-10 h-10 animate-spin text-[#00bd7f]" />
      </div>
    );
  }

  if (!student) {
    return (
      <div className="flex flex-col items-center justify-center min-h-screen space-y-4">
        <AlertCircle className="w-12 h-12 text-rose-500" />
        <h2 className="text-xl font-bold text-slate-800">Student Profile Not Found</h2>
        <Link to="/admin/student/list" className="text-[#00bd7f] font-bold hover:underline">Back to Student List</Link>
      </div>
    );
  }

  const tabs = [
    { id: "summary", label: "Dashboard", icon: TrendingUp },
    { id: "personal", label: "Personal & Guardian", icon: User },
    { id: "academic", label: "Academic Hub", icon: BookOpen },
    { id: "financial", label: "Financial Ledger", icon: DollarSign },
    { id: "documents", label: "Documents", icon: FileText },
  ];

  return (
    <div className="space-y-6 sm:space-y-8 animate-in fade-in duration-500 p-4 sm:p-6 lg:p-10 bg-slate-50/50 min-h-screen">
      {/* Top Navigation & Actions */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div className="flex items-center gap-4">
          <Link to="/admin/student/list">
            <button className="p-2.5 bg-white border-2 border-slate-200 rounded-[8px] hover:bg-slate-50 transition-all shadow-sm">
              <ChevronLeft className="w-5 h-5 text-slate-600" />
            </button>
          </Link>
          <div>
            <h1 className="text-2xl font-black text-slate-800 tracking-tight">Student Profile</h1>
            <p className="text-slate-500 text-xs font-bold uppercase tracking-widest">ID: {student.id}</p>
          </div>
        </div>
        <div className="flex items-center gap-2 no-print">
          {/* <button 
            onClick={handlePrint}
            className="flex items-center gap-2 px-5 py-2.5 bg-white text-slate-700 font-bold rounded-xl border-2 border-slate-100 hover:bg-slate-50 transition-all shadow-sm"
          >
            <Printer className="w-4 h-4" />
            Print Profile
          </button> */}
          <button 
            onClick={() => navigate(`/admin/student/list`)}
            className="flex items-center gap-2 px-5 py-2.5 bg-[#00bd7f] text-white font-bold rounded-[8px] shadow-lg shadow-emerald-500/20 hover:scale-[1.02] transition-all cursor-pointer"
          >
            <User className="w-4 h-4" />
            Student List
          </button>
        </div>
      </div>

      {/* Profile Header Card */}
      <div className="bg-white rounded-[8px]  p-5 border-1 border-gray-200 sm:p-8 shadow-sm overflow-hidden relative">
        <div className="absolute top-0 right-0 w-64 h-64 bg-[#e6f4ef] rounded-full -mr-32 -mt-32 opacity-50" />
        <div className="relative flex flex-col lg:flex-row items-center lg:items-start gap-8">
          <div className="w-32 h-32 sm:w-40 sm:h-40 rounded-[2.5rem] border-4 border-white shadow-2xl overflow-hidden bg-slate-100 ring-8 ring-[#e6f4ef]">
            <img src={student.photo} alt="Student" className="w-full h-full object-cover" />
          </div>
          <div className="flex-1 text-center lg:text-left space-y-4">
            <div>
              <div className="flex flex-col sm:flex-row items-center gap-3 mb-2">
                <h2 className="text-3xl font-black text-slate-800">{student.firstName} {student.lastName}</h2>
                <span className={`px-4 py-1.5 rounded-full text-[10px] font-black uppercase tracking-widest border-2 ${
                  student.status === 'active' 
                    ? 'bg-emerald-50 text-emerald-700 border-emerald-100' 
                    : 'bg-rose-50 text-rose-700 border-rose-100'
                }`}>
                  {student.status}
                </span>
              </div>
              <p className="text-slate-500 font-bold flex items-center justify-center lg:justify-start gap-2">
                <GraduationCap className="w-4 h-4 text-[#00bd7f]" />
                {student.class} • {student.section} • Roll No: {student.rollNo}
              </p>
            </div>
            
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 pt-4 border-t border-slate-100">
              <div className="space-y-1">
                <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest leading-none">Attendance</p>
                <p className="text-xl font-black text-emerald-600">{student.academic.attendance}%</p>
              </div>
              <div className="space-y-1">
                <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest leading-none">GPA Status</p>
                <p className="text-xl font-black text-blue-600">{student.academic.avgGrade}</p>
              </div>
              <div className="space-y-1">
                <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest leading-none">Financial</p>
                <p className={`text-xl font-black ${student.financial.pendingFees > 0 ? 'text-rose-500' : 'text-emerald-600'}`}>
                  ${student.financial.pendingFees}
                </p>
              </div>
              <div className="space-y-1">
                <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest leading-none">Religion</p>
                <p className="text-xl font-black text-slate-800">{student.religion}</p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Tabs Navigation */}
      <div className="flex flex-wrap gap-2 bg-[#e6f4ef] p-1.5 rounded-2xl w-fit mx-auto lg:mx-0 no-print">
        {tabs.map((tab) => (
          <button
            key={tab.id}
            onClick={() => setActiveTab(tab.id)}
            className={`flex items-center gap-2 px-6 py-3 rounded-xl text-sm font-bold transition-all ${
              activeTab === tab.id 
                ? 'bg-[#00bd7f] text-white shadow-lg' 
                : 'text-slate-600 hover:bg-white/50'
            }`}
          >
            <tab.icon className="w-4 h-4" />
            {tab.label}
          </button>
        ))}
      </div>

      {/* Tab Content */}
      <div className="space-y-8 animate-in slide-in-from-bottom-5 duration-700">
        {/* Summary Tab */}
        {activeTab === "summary" && (
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            <div className="lg:col-span-2 space-y-8">
               {/* Quick Overview Cards */}
               <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                 <div className="bg-white p-6 rounded-3xl border-2 border-slate-200 shadow-sm flex items-center gap-4">
                    <div className="w-12 h-12 bg-blue-100 rounded-2xl flex items-center justify-center">
                      <TrendingUp className="w-6 h-6 text-blue-600" />
                    </div>
                    <div>
                      <p className="text-xs font-bold text-slate-400 uppercase">Current Standing</p>
                      <p className="text-lg font-black text-slate-800">Top 5% of Class</p>
                    </div>
                 </div>
                 <div className="bg-white p-6 rounded-3xl border-2 border-slate-200 shadow-sm flex items-center gap-4">
                    <div className="w-12 h-12 bg-emerald-100 rounded-2xl flex items-center justify-center">
                      <CheckCircle className="w-6 h-6 text-emerald-600" />
                    </div>
                    <div>
                      <p className="text-xs font-bold text-slate-400 uppercase">Recent Activity</p>
                      <p className="text-lg font-black text-slate-800">Fee Paid (Feb)</p>
                    </div>
                 </div>
               </div>

               {/* Academic Performance Chart Simulation */}
               <div className="bg-white p-8 rounded-[2rem] border-2 border-slate-200 shadow-sm">
                  <div className="flex items-center justify-between mb-8">
                    <h3 className="text-lg font-black text-slate-800 flex items-center gap-2">
                       <TrendingUp className="w-5 h-5 text-[#00bd7f]" />
                       Marks Distribution
                    </h3>
                  </div>
                  <div className="space-y-6">
                    {student.academic.marks.map((m, i) => (
                      <div key={i} className="space-y-2">
                        <div className="flex justify-between text-sm font-bold">
                          <span className="text-slate-700">{m.subject}</span>
                          <span className="text-[#00bd7f]">{m.marks}/100</span>
                        </div>
                        <div className="h-2.5 bg-slate-100 rounded-full overflow-hidden">
                          <div 
                            className="h-full bg-gradient-to-r from-emerald-400 to-[#00bd7f] rounded-full" 
                            style={{ width: `${m.marks}%` }}
                          />
                        </div>
                      </div>
                    ))}
                  </div>
               </div>
            </div>

            {/* Sidebar Stats */}
            <div className="space-y-8">
               <div className="bg-slate-900 rounded-[2rem] p-8 text-white relative overflow-hidden">
                 <div className="absolute bottom-0 right-0 w-32 h-32 bg-white/5 rounded-full -mb-16 -mr-16" />
                 <h3 className="text-lg font-black mb-6 flex items-center gap-2">
                   <DollarSign className="w-5 h-5 text-emerald-400" />
                   Financial Pulse
                 </h3>
                 <div className="space-y-6 relative z-10">
                   <div>
                     <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-1">Total Due</p>
                     <p className="text-3xl font-black text-emerald-400">${student.financial.pendingFees}</p>
                   </div>
                   <div className="grid grid-cols-2 gap-4 pt-6 border-t border-white/10">
                      <div>
                        <p className="text-[10px] font-bold text-slate-400 uppercase">Paid</p>
                        <p className="text-lg font-black text-white">${student.financial.paidFees}</p>
                      </div>
                      <div>
                        <p className="text-[10px] font-bold text-slate-400 uppercase">Ledger</p>
                        <p className="text-lg font-black text-white">4 Receipts</p>
                      </div>
                   </div>
                   <button className="w-full py-3 bg-white/10 hover:bg-white/20 text-white text-xs font-black uppercase tracking-widest rounded-xl transition-all border border-white/5">
                     View All Invoices
                   </button>
                 </div>
               </div>

               <div className="bg-white p-6 rounded-[2rem] border-2 border-slate-200 shadow-sm space-y-4">
                  <h3 className="text-sm font-black text-slate-800 uppercase tracking-widest px-2">Quick Contacts</h3>
                  <div className="space-y-3">
                    <a href={`tel:${student.phone}`} className="flex items-center gap-3 p-3 rounded-2xl bg-[#e6f4ef] hover:bg-[#d9ede6] transition-all group">
                      <div className="w-10 h-10 bg-white rounded-xl flex items-center justify-center shadow-sm">
                        <Phone className="w-4 h-4 text-[#00bd7f]" />
                      </div>
                      <div>
                        <p className="text-[10px] font-bold text-slate-400 uppercase">Call Student</p>
                        <p className="text-sm font-black text-slate-700 group-hover:text-[#00bd7f]">{student.phone}</p>
                      </div>
                    </a>
                    <a href={`mailto:${student.email}`} className="flex items-center gap-3 p-3 rounded-2xl bg-[#e6f4ef] hover:bg-[#d9ede6] transition-all group">
                      <div className="w-10 h-10 bg-white rounded-xl flex items-center justify-center shadow-sm">
                        <Mail className="w-4 h-4 text-[#00bd7f]" />
                      </div>
                      <div>
                        <p className="text-[10px] font-bold text-slate-400 uppercase">Send Email</p>
                        <p className="text-sm font-black text-slate-700 group-hover:text-[#00bd7f] truncate w-32">{student.email}</p>
                      </div>
                    </a>
                  </div>
               </div>
            </div>
          </div>
        )}

        {/* Personal & Guardian Tab */}
        {activeTab === "personal" && (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <div className="bg-white p-8 rounded-[2rem] border-2 border-slate-200 shadow-sm space-y-6">
               <h3 className="text-lg font-black text-slate-800 flex items-center gap-2 border-b-2 border-slate-100 pb-4">
                 <User className="w-5 h-5 text-[#00bd7f]" />
                 Personal Details
               </h3>
               <div className="grid grid-cols-2 gap-6">
                 <div><p className="text-[10px] font-black text-slate-400 uppercase">Full Name</p><p className="font-bold text-slate-700">{student.firstName} {student.lastName}</p></div>
                 <div><p className="text-[10px] font-black text-slate-400 uppercase">Blood Group</p><p className="font-bold text-slate-700 text-rose-600">{student.bloodGroup}</p></div>
                 <div><p className="text-[10px] font-black text-slate-400 uppercase">Date of Birth</p><p className="font-bold text-slate-700">12 Oct 2012</p></div>
                 <div><p className="text-[10px] font-black text-slate-400 uppercase">Religion</p><p className="font-bold text-slate-700">{student.religion}</p></div>
                 <div className="col-span-2"><p className="text-[10px] font-black text-slate-400 uppercase">Residential Address</p><p className="font-bold text-slate-700 leading-relaxed text-sm">{student.address}</p></div>
               </div>
            </div>

            <div className="bg-white p-8 rounded-[2rem] border-2 border-slate-200 shadow-sm space-y-6">
               <h3 className="text-lg font-black text-slate-800 flex items-center gap-2 border-b-2 border-slate-100 pb-4">
                 <Users className="w-5 h-5 text-[#00bd7f]" />
                 Guardian Information
               </h3>
               <div className="space-y-6">
                 <div className="flex items-center gap-4 bg-slate-50 p-4 rounded-2xl border border-slate-100">
                    <div className="w-14 h-14 rounded-full border-2 border-white shadow-sm overflow-hidden bg-white"><img src={student.guardian.father.photo} className="w-full h-full object-cover" /></div>
                    <div>
                      <p className="text-[10px] font-black text-slate-400 uppercase">Father's Info</p>
                      <p className="font-black text-slate-800">{student.guardian.father.name}</p>
                      <p className="text-xs font-bold text-slate-500">{student.guardian.father.phone} • {student.guardian.father.occupation}</p>
                    </div>
                 </div>
                 <div className="flex items-center gap-4 bg-slate-50 p-4 rounded-2xl border border-slate-100">
                    <div className="w-14 h-14 rounded-full border-2 border-white shadow-sm overflow-hidden bg-white"><img src={student.guardian.mother.photo} className="w-full h-full object-cover" /></div>
                    <div>
                      <p className="text-[10px] font-black text-slate-400 uppercase">Mother's Info</p>
                      <p className="font-black text-slate-800">{student.guardian.mother.name}</p>
                      <p className="text-xs font-bold text-slate-500">{student.guardian.mother.phone} • {student.guardian.mother.occupation}</p>
                    </div>
                 </div>
               </div>
            </div>
          </div>
        )}

        {/* Financial Tab */}
        {activeTab === "financial" && (
           <div className="space-y-8">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                {[
                  { label: "Total Fee Package", value: `$${student.financial.totalFees}`, icon: DollarSign, color: "text-blue-600", bg: "bg-blue-100" },
                  { label: "Amount Paid", value: `$${student.financial.paidFees}`, icon: CheckCircle, color: "text-emerald-600", bg: "bg-emerald-100" },
                  { label: "Outstanding Balance", value: `$${student.financial.pendingFees}`, icon: AlertCircle, color: "text-rose-600", bg: "bg-rose-100" }
                ].map((item, i) => (
                  <div key={i} className="bg-white p-6 rounded-3xl border-2 border-slate-200 shadow-sm flex items-center justify-between">
                    <div>
                      <p className="text-xs font-bold text-slate-500 uppercase mb-1">{item.label}</p>
                      <p className="text-2xl font-black text-slate-800">{item.value}</p>
                    </div>
                    <div className={`w-12 h-12 ${item.bg} rounded-2xl flex items-center justify-center`}><item.icon className={`w-6 h-6 ${item.color}`} /></div>
                  </div>
                ))}
              </div>

              <div className="bg-white rounded-[2rem] border-2 border-slate-200 shadow-sm overflow-hidden">
                <div className="p-6 border-b border-slate-100 bg-slate-50/50 flex items-center justify-between">
                  <h3 className="text-lg font-black text-slate-800">Transaction History</h3>
                  
                <div className="lg:w-[300px]">
                   <SelectInputField options={[
                  {value:"Last 7 day"},
                  {value:"Last 30 day"},
                  {value:"Last 90 day"},
                  {value:"Last 180 day"},
                  {value:"Last 365 day"},
                  
                ]} />
               </div>
                </div>
                <div className="overflow-x-auto">
                  <table className="w-full">
                    <thead>
                      <tr className="bg-slate-50 border-b border-slate-100">
                        <th className="px-6 py-4 text-left text-[10px] font-black text-slate-400 uppercase">Invoice ID</th>
                        <th className="px-6 py-4 text-left text-[10px] font-black text-slate-400 uppercase">Date</th>
                        <th className="px-6 py-4 text-left text-[10px] font-black text-slate-400 uppercase">Description</th>
                        <th className="px-6 py-4 text-left text-[10px] font-black text-slate-400 uppercase">Amount</th>
                        <th className="px-6 py-4 text-left text-[10px] font-black text-slate-400 uppercase">Status</th>
                        <th className="px-6 py-4 text-left text-[10px] font-black text-slate-400 uppercase">Invoice</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y-2 divide-slate-50">
                      {student.financial.history.map((inv, i) => (
                        <tr key={i} className="hover:bg-slate-50 transition-all font-bold text-sm">
                          <td className="px-6 py-4 text-emerald-600">{inv.id}</td>
                          <td className="px-6 py-4 text-slate-500">{inv.date}</td>
                          <td className="px-6 py-4 text-slate-800">{inv.type}</td>
                          <td className="px-6 py-4 text-slate-800">${inv.amount}</td>
                          <td className="px-6 py-4">
                            <span className={`px-3 py-1 rounded-full text-[10px] uppercase ${inv.status === 'Paid' ? 'bg-emerald-100 text-emerald-700' : 'bg-amber-100 text-amber-700'}`}>
                              {inv.status}
                            </span>
                          </td>
                          <td className="px-6 py-4">
                            <div className="flex items-center gap-5">
                              <FileText className="text-[14px]" />
                            <DownloadIcon className="text-[14px] text-[#00bd7f]"/>
                            </div>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
           </div>
        )}

        {/* Academic Tab */}
        {activeTab === "academic" && (
           <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
              <div className="bg-white p-8 rounded-[2rem] border-2 border-slate-200 shadow-sm space-y-6">
                <div className="flex items-center justify-between border-b-2 border-slate-100 pb-4">
                  <h3 className="text-lg font-black text-slate-800 flex items-center gap-2">
                    <BookOpen className="w-5 h-5 text-[#00bd7f]" />
                    Exam Reports
                  </h3>
                  <button className="p-2 border border-slate-100 rounded-xl hover:bg-slate-50 transition-all text-slate-500"><Download className="w-4 h-4" /></button>
                </div>
                <div className="space-y-4">
                   <div className="p-4 bg-[#e6f4ef] rounded-2xl flex items-center justify-between border-2 border-emerald-100">
                      <div>
                        <p className="text-sm font-black text-emerald-800">{student.academic.lastExam}</p>
                        <p className="text-xs font-bold text-emerald-600">Final Marksheet Released</p>
                      </div>
                      <div className="text-right">
                        <p className="text-xl font-black text-emerald-900">GPA {student.academic.lastGPA}</p>
                        <p className="text-[10px] font-black text-white bg-emerald-500 px-2 py-0.5 rounded-full uppercase tracking-tighter">PASSED</p>
                      </div>
                   </div>
                   <div className="space-y-2">
                      <p className="text-xs font-black text-slate-400 uppercase tracking-widest px-1">Detailed Marks</p>
                      <div className="grid grid-cols-1 gap-2">
                         {student.academic.marks.map((m, i) => (
                           <div key={i} className="flex justify-between items-center bg-slate-50 p-3 rounded-xl border border-slate-100">
                             <span className="text-sm font-bold text-slate-700">{m.subject}</span>
                             <div className="flex gap-4 items-center">
                               <span className="text-xs font-black text-slate-400">{m.marks}/100</span>
                               <span className="w-8 text-center text-sm font-black text-[#00bd7f]">{m.grade}</span>
                             </div>
                           </div>
                         ))}
                      </div>
                   </div>
                </div>
              </div>

              <div className="bg-white p-8 rounded-[2rem] border-2 border-slate-200 shadow-sm space-y-6 text-center">
                 <h3 className="text-lg font-black text-slate-800 flex items-center gap-2 border-b-2 border-slate-100 pb-4 text-left">
                   <Clock className="w-5 h-5 text-[#00bd7f]" />
                   Attendance Pulse
                 </h3>
                 <div className="py-10 flex flex-col items-center justify-center">
                    <div className="relative w-48 h-48 mb-6">
                      <svg className="w-full h-full transform -rotate-90">
                        <circle cx="96" cy="96" r="80" stroke="currentColor" strokeWidth="12" fill="transparent" className="text-slate-100" />
                        <circle cx="96" cy="96" r="80" stroke="currentColor" strokeWidth="12" fill="transparent" strokeDasharray={2 * Math.PI * 80} strokeDashoffset={2 * Math.PI * 80 * (1 - student.academic.attendance / 100)} className="text-[#00bd7f]" />
                      </svg>
                      <div className="absolute inset-0 flex flex-col items-center justify-center">
                        <p className="text-4xl font-black text-slate-800">{student.academic.attendance}%</p>
                        <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Total Presence</p>
                      </div>
                    </div>
                    <div className="grid grid-cols-3 gap-8 w-full">
                       <div><p className="text-xl font-black text-slate-800">188</p><p className="text-[10px] font-bold text-slate-400 uppercase">Present</p></div>
                       <div><p className="text-xl font-black text-rose-500">12</p><p className="text-[10px] font-bold text-slate-400 uppercase">Absent</p></div>
                       <div><p className="text-xl font-black text-amber-500">04</p><p className="text-[10px] font-bold text-slate-400 uppercase">Leaves</p></div>
                    </div>
                 </div>
              </div>
           </div>
        )}

        {/* Documents Tab */}
        {activeTab === "documents" && (
           <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
              {[
                { name: "Birth Certificate", size: "1.2 MB", date: "2024-05-12" },
                { name: "Prior Result Sheet", size: "2.5 MB", date: "2024-06-20" },
                { name: "Guardian NID", size: "850 KB", date: "2025-01-10" },
                { name: "Admission Form", size: "3.1 MB", date: "2025-01-11" }
              ].map((doc, i) => (
                <div key={i} className="bg-white p-6 rounded-3xl border-2 border-slate-200 shadow-sm hover:border-[#00bd7f] transition-all group cursor-pointer">
                  <div className="w-12 h-12 bg-slate-50 rounded-2xl flex items-center justify-center mb-4 group-hover:bg-[#e6f4ef] transition-colors">
                    <FileText className="w-6 h-6 text-slate-400 group-hover:text-[#00bd7f]" />
                  </div>
                  <h4 className="text-sm font-black text-slate-800 mb-1">{doc.name}</h4>
                  <p className="text-xs font-bold text-slate-500 flex justify-between">
                    <span>{doc.size}</span>
                    <span>{doc.date}</span>
                  </p>
                  <div className="mt-6 flex gap-2">
                    <button className="flex-1 py-2 bg-slate-50 text-[10px] font-black uppercase text-slate-600 rounded-lg hover:bg-slate-100">View</button>
                    <button className="flex-1 py-2 bg-slate-50 text-[10px] font-black uppercase text-slate-600 rounded-lg hover:bg-slate-100">Download</button>
                  </div>
                </div>
              ))}
           </div>
        )}
      </div>

      {/* Profile Edit Modal */}
      {showEditModal && (
        <EditProfileModal 
          student={student} 
          onClose={() => setShowEditModal(false)} 
          onSave={() => {
            setShowEditModal(false);
            setShowToast("Profile updated successfully!");
            setTimeout(() => setShowToast(null), 3000);
          }}
        />
      )}

      {/* Toast Notification */}
      {showToast && (
        <div className="fixed bottom-8 left-1/2 -translate-x-1/2 z-[200] animate-in slide-in-from-bottom-10 duration-500">
          <div className="bg-slate-900 text-white px-6 py-3 rounded-2xl shadow-2xl flex items-center gap-3">
             <div className="w-6 h-6 bg-emerald-500 rounded-full flex items-center justify-center">
                <CheckCircle2 className="w-4 h-4 text-white" />
             </div>
             <p className="text-sm font-bold">{showToast}</p>
          </div>
        </div>
      )}

      {/* Print Styles */}
      <style>{`
        @media print {
          .no-print { display: none !important; }
          body { background: white !important; }
          .p-10 { padding: 0 !important; }
          .rounded-\\[2rem\\] { border-radius: 0 !important; border: none !important; }
          .shadow-sm, .shadow-lg, .shadow-2xl { shadow: none !important; }
          .bg-slate-50\\/50 { background: white !important; }
          .bg-white { background: white !important; }
        }
      `}</style>
    </div>
  );
};

const EditProfileModal = ({ student, onClose, onSave }) => {
  const [formData, setFormData] = useState({ ...student });

  return (
    <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-sm z-[150] flex items-center justify-center p-4" onClick={onClose}>
      <div className="bg-white rounded-[2.5rem] w-full max-w-4xl max-h-[90vh] overflow-y-auto shadow-2xl animate-in zoom-in duration-300" onClick={e => e.stopPropagation()}>
        <div className="sticky top-0 bg-white border-b-2 border-slate-100 p-8 flex items-center justify-between z-10">
          <div>
            <h2 className="text-2xl font-black text-slate-800">Edit Student Profile</h2>
            <p className="text-xs font-bold text-slate-400 uppercase tracking-widest mt-1">Update all student & guardian information</p>
          </div>
          <button onClick={onClose} className="p-3 hover:bg-slate-50 rounded-2xl transition-all border-2 border-slate-50"><X className="w-6 h-6 text-slate-400" /></button>
        </div>

        <div className="p-8 space-y-12">
           {/* Section: Personal Info */}
           <div className="space-y-6">
              <h3 className="text-sm font-black text-slate-800 uppercase tracking-widest flex items-center gap-2 border-b-2 border-slate-50 pb-4">
                 <User className="w-4 h-4 text-[#00bd7f]" /> Personal Information
              </h3>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                 <div className="space-y-2">
                    <label className="text-[10px] font-black text-slate-400 uppercase">First Name</label>
                    <input 
                       value={formData.firstName} 
                       onChange={e => setFormData({...formData, firstName: e.target.value})}
                       className="w-full px-4 py-3 bg-slate-50 border-2 border-slate-100 rounded-xl outline-none focus:border-[#00bd7f] transition-all font-bold text-sm"
                    />
                 </div>
                 <div className="space-y-2">
                    <label className="text-[10px] font-black text-slate-400 uppercase">Last Name</label>
                    <input 
                       value={formData.lastName} 
                       onChange={e => setFormData({...formData, lastName: e.target.value})}
                       className="w-full px-4 py-3 bg-slate-50 border-2 border-slate-100 rounded-xl outline-none focus:border-[#00bd7f] transition-all font-bold text-sm"
                    />
                 </div>
                 <div className="space-y-2">
                    <label className="text-[10px] font-black text-slate-400 uppercase">Blood Group</label>
                    <input 
                       value={formData.bloodGroup} 
                       onChange={e => setFormData({...formData, bloodGroup: e.target.value})}
                       className="w-full px-4 py-3 bg-slate-50 border-2 border-slate-100 rounded-xl outline-none focus:border-[#00bd7f] transition-all font-bold text-sm"
                    />
                 </div>
                 <div className="space-y-2">
                    <label className="text-[10px] font-black text-slate-400 uppercase">Phone</label>
                    <input 
                       value={formData.phone} 
                       onChange={e => setFormData({...formData, phone: e.target.value})}
                       className="w-full px-4 py-3 bg-slate-50 border-2 border-slate-100 rounded-xl outline-none focus:border-[#00bd7f] transition-all font-bold text-sm"
                    />
                 </div>
                 <div className="space-y-2 md:col-span-2">
                    <label className="text-[10px] font-black text-slate-400 uppercase">Address</label>
                    <input 
                       value={formData.address} 
                       onChange={e => setFormData({...formData, address: e.target.value})}
                       className="w-full px-4 py-3 bg-slate-50 border-2 border-slate-100 rounded-xl outline-none focus:border-[#00bd7f] transition-all font-bold text-sm"
                    />
                 </div>
              </div>
           </div>

           {/* Section: Guardian Info */}
           <div className="space-y-6">
              <h3 className="text-sm font-black text-slate-800 uppercase tracking-widest flex items-center gap-2 border-b-2 border-slate-50 pb-4">
                 <Users className="w-4 h-4 text-[#00bd7f]" /> Guardian Information
              </h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                 {/* Father's Info */}
                 <div className="space-y-4 p-6 bg-slate-50 rounded-3xl border-2 border-slate-100">
                    <p className="text-[10px] font-black text-slate-800 uppercase tracking-widest bg-white w-fit px-3 py-1 rounded-full border border-slate-200">Father's Record</p>
                    <div className="space-y-3">
                       <input 
                          value={formData.guardian.father.name} 
                          onChange={e => setFormData({...formData, guardian: {...formData.guardian, father: {...formData.guardian.father, name: e.target.value}}})}
                          placeholder="Name" 
                          className="w-full px-4 py-2.5 bg-white border border-slate-200 rounded-xl outline-none focus:border-[#00bd7f] transition-all font-bold text-sm"
                       />
                       <input 
                          value={formData.guardian.father.phone} 
                          onChange={e => setFormData({...formData, guardian: {...formData.guardian, father: {...formData.guardian.father, phone: e.target.value}}})}
                          placeholder="Phone" 
                          className="w-full px-4 py-2.5 bg-white border border-slate-200 rounded-xl outline-none focus:border-[#00bd7f] transition-all font-bold text-sm"
                       />
                    </div>
                 </div>
                 {/* Mother's Info */}
                 <div className="space-y-4 p-6 bg-slate-50 rounded-3xl border-2 border-slate-100">
                    <p className="text-[10px] font-black text-slate-800 uppercase tracking-widest bg-white w-fit px-3 py-1 rounded-full border border-slate-200">Mother's Record</p>
                    <div className="space-y-3">
                       <input 
                          value={formData.guardian.mother.name} 
                          onChange={e => setFormData({...formData, guardian: {...formData.guardian, mother: {...formData.guardian.mother, name: e.target.value}}})}
                          placeholder="Name" 
                          className="w-full px-4 py-2.5 bg-white border border-slate-200 rounded-xl outline-none focus:border-[#00bd7f] transition-all font-bold text-sm"
                       />
                       <input 
                          value={formData.guardian.mother.phone} 
                          onChange={e => setFormData({...formData, guardian: {...formData.guardian, mother: {...formData.guardian.mother, phone: e.target.value}}})}
                          placeholder="Phone" 
                          className="w-full px-4 py-2.5 bg-white border border-slate-200 rounded-xl outline-none focus:border-[#00bd7f] transition-all font-bold text-sm"
                       />
                    </div>
                 </div>
              </div>
           </div>
        </div>

        <div className="sticky bottom-0 bg-white border-t-2 border-slate-100 p-8 flex justify-end gap-3 z-10">
           <button onClick={onClose} className="px-8 py-3 text-sm font-bold text-slate-500 hover:bg-slate-50 rounded-2xl transition-all">Cancel</button>
           <button onClick={onSave} className="px-10 py-3 bg-[#00bd7f] text-white text-sm font-black rounded-2xl shadow-xl shadow-emerald-500/20 hover:scale-[1.02] transition-all">Save Profile Changes</button>
        </div>
      </div>
    </div>
  );
};

export default StudentProfile;
