import { useState, useMemo, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import {
  Search,
  Filter,
  Download,
  Eye,
  Plus,
  Users,
  GraduationCap,
  CheckCircle,
  XCircle,
  MoreVertical,
  Phone,
  Mail,
  MapPin,
  Calendar,
  BookOpen,
  X,
  Edit2,
  Trash2,
  UserCheck,
  CreditCard,
  ChevronLeft,
  ChevronRight
} from "lucide-react";
// Header Container Component Removed Duplicate Link Import

const StudentList = () => {
  const [searchTerm, setSearchTerm] = useState("");
  const [classFilter, setClassFilter] = useState("all");
  const [sectionFilter, setSectionFilter] = useState("all");
  const [openMenuId, setOpenMenuId] = useState(null);
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 10;
  const navigate = useNavigate();

  // New states for Action UI
  const [editStudent, setEditStudent] = useState(null);
  const [deleteStudent, setDeleteStudent] = useState(null);
  const [idCardStudent, setIdCardStudent] = useState(null);
  const [showStatusToast, setShowStatusToast] = useState(null);

  // Close menu when clicking elsewhere
  const handleClickOutside = () => setOpenMenuId(null);
  useEffect(() => {
    window.addEventListener('click', handleClickOutside);
    return () => window.removeEventListener('click', handleClickOutside);
  }, []);

  // Action Handlers
  const handleAction = (label, student) => {
    setOpenMenuId(null);
    if (label === 'Edit Info') {
      setEditStudent(student);
    } else if (label === 'Delete Record') {
      setDeleteStudent(student);
    } else if (label === 'Download ID') {
      setIdCardStudent(student);
    } else if (label === 'Change Status') {
      setShowStatusToast(`Status for ${student.id} updated!`);
      setTimeout(() => setShowStatusToast(null), 3000);
    }
  };

  // Expanded Sample Data (20 Students)
  const students = useMemo(() => [
    { id: "STU2025001", firstName: "মোহাম্মদ", lastName: "রহমান", gender: "Male", class: "Class 5", section: "Section A", rollNo: "01", phone: "01712345678", email: "stu1@mms.com", status: "active", photo: "https://api.dicebear.com/7.x/avataaars/svg?seed=STU1", admissionDate: "2025-01-10", bloodGroup: "A+", guardian: "আব্দুল করিম" },
    { id: "STU2025002", firstName: "আয়েশা", lastName: "খাতুন", gender: "Female", class: "Class 6", section: "Section B", rollNo: "12", phone: "01823456789", email: "stu2@mms.com", status: "active", photo: "https://api.dicebear.com/7.x/avataaars/svg?seed=STU2", admissionDate: "2025-01-12", bloodGroup: "O+", guardian: "মোহাম্মদ আলী" },
    { id: "STU2025003", firstName: "ইউসুফ", lastName: "হোসেন", gender: "Male", class: "Class 4", section: "Section A", rollNo: "05", phone: "01934567890", email: "stu3@mms.com", status: "inactive", photo: "https://api.dicebear.com/7.x/avataaars/svg?seed=STU3", admissionDate: "2025-01-15", bloodGroup: "B+", guardian: "হোসেন আহমেদ" },
    { id: "STU2025004", firstName: "ফাতিমা", lastName: "জোহরা", gender: "Female", class: "Class 5", section: "Section C", rollNo: "03", phone: "01612345678", email: "stu4@mms.com", status: "active", photo: "https://api.dicebear.com/7.x/avataaars/svg?seed=STU4", admissionDate: "2025-01-18", bloodGroup: "AB+", guardian: "আব্দুল্লাহ মাহমুদ" },
    { id: "STU2025005", firstName: "আব্দুল্লাহ", lastName: "মামুন", gender: "Male", class: "Class 6", section: "Section A", rollNo: "09", phone: "01512345678", email: "stu5@mms.com", status: "active", photo: "https://api.dicebear.com/7.x/avataaars/svg?seed=STU5", admissionDate: "2025-01-20", bloodGroup: "A-", guardian: "সাইফুল ইসলাম" },
    { id: "STU2025006", firstName: "সুরাইয়া", lastName: "আক্তার", gender: "Female", class: "Class 4", section: "Section B", rollNo: "15", phone: "01412345678", email: "stu6@mms.com", status: "active", photo: "https://api.dicebear.com/7.x/avataaars/svg?seed=STU6", admissionDate: "2025-01-22", bloodGroup: "B-", guardian: "জসিম উদ্দিন" },
    { id: "STU2025007", firstName: "ওমর", lastName: "ফারুক", gender: "Male", class: "Class 5", section: "Section B", rollNo: "20", phone: "01312345678", email: "stu7@mms.com", status: "active", photo: "https://api.dicebear.com/7.x/avataaars/svg?seed=STU7", admissionDate: "2025-01-25", bloodGroup: "O-", guardian: "মনির হোসেন" },
    { id: "STU2025008", firstName: "খাদিজা", lastName: "তুল কোবরা", gender: "Female", class: "Class 6", section: "Section C", rollNo: "02", phone: "01212345678", email: "stu8@mms.com", status: "inactive", photo: "https://api.dicebear.com/7.x/avataaars/svg?seed=STU8", admissionDate: "2025-01-28", bloodGroup: "A+", guardian: "রেজাউল করিম" },
    { id: "STU2025009", firstName: "ইব্রাহিম", lastName: "খলিল", gender: "Male", class: "Class 4", section: "Section C", rollNo: "08", phone: "01112345678", email: "stu9@mms.com", status: "active", photo: "https://api.dicebear.com/7.x/avataaars/svg?seed=STU9", admissionDate: "2025-01-30", bloodGroup: "B+", guardian: "নুরুল ইসলাম" },
    { id: "STU2025010", firstName: "মারিয়া", lastName: "ইসলাম", gender: "Female", class: "Class 5", section: "Section A", rollNo: "11", phone: "01012345678", email: "stu10@mms.com", status: "active", photo: "https://api.dicebear.com/7.x/avataaars/svg?seed=STU10", admissionDate: "2025-02-01", bloodGroup: "O+", guardian: "শাহাদাত হোসেন" },
    { id: "STU2025011", firstName: "হাসান", lastName: "মাহমুদ", gender: "Male", class: "Class 6", section: "Section B", rollNo: "05", phone: "01722345678", email: "stu11@mms.com", status: "active", photo: "https://api.dicebear.com/7.x/avataaars/svg?seed=STU11", admissionDate: "2025-02-05", bloodGroup: "A+", guardian: "ফয়সাল আহমেদ" },
    { id: "STU2025012", firstName: "তাসনিম", lastName: "আরা", gender: "Female", class: "Class 4", section: "Section A", rollNo: "18", phone: "01833456789", email: "stu12@mms.com", status: "active", photo: "https://api.dicebear.com/7.x/avataaars/svg?seed=STU12", admissionDate: "2025-02-08", bloodGroup: "B+", guardian: "আরিফ রহমান" },
    { id: "STU2025013", firstName: "সালেহ", lastName: "আহমেদ", gender: "Male", class: "Class 5", section: "Section C", rollNo: "07", phone: "01944567890", email: "stu13@mms.com", status: "inactive", photo: "https://api.dicebear.com/7.x/avataaars/svg?seed=STU13", admissionDate: "2025-02-10", bloodGroup: "AB+", guardian: "মাহবুব আলম" },
    { id: "STU2025014", firstName: "সুমায়া", lastName: "জাহান", gender: "Female", class: "Class 6", section: "Section A", rollNo: "10", phone: "01655678901", email: "stu14@mms.com", status: "active", photo: "https://api.dicebear.com/7.x/avataaars/svg?seed=STU14", admissionDate: "2025-02-12", bloodGroup: "O+", guardian: "হারুনুর রশিদ" },
    { id: "STU2025015", firstName: "আবু", lastName: "বকর", gender: "Male", class: "Class 4", section: "Section B", rollNo: "14", phone: "01566789012", email: "stu15@mms.com", status: "active", photo: "https://api.dicebear.com/7.x/avataaars/svg?seed=STU15", admissionDate: "2025-02-15", bloodGroup: "A-", guardian: "মতিউর রহমান" },
    { id: "STU2025016", firstName: "জান্নাতুল", lastName: "ফেরদৌস", gender: "Female", class: "Class 5", section: "Section B", rollNo: "04", phone: "01477890123", email: "stu16@mms.com", status: "active", photo: "https://api.dicebear.com/7.x/avataaars/svg?seed=STU16", admissionDate: "2025-02-18", bloodGroup: "B-", guardian: "সুলতান আহমেদ" },
    { id: "STU2025017", firstName: "মুসা", lastName: "ইব্রাহিম", gender: "Male", class: "Class 6", section: "Section C", rollNo: "22", phone: "01388901234", email: "stu17@mms.com", status: "active", photo: "https://api.dicebear.com/7.x/avataaars/svg?seed=STU17", admissionDate: "2025-02-20", bloodGroup: "O-", guardian: "ইকবাল হোসেন" },
    { id: "STU2025018", firstName: "রোকাইয়া", lastName: "বেগম", gender: "Female", class: "Class 4", section: "Section C", rollNo: "19", phone: "01299012345", email: "stu18@mms.com", status: "inactive", photo: "https://api.dicebear.com/7.x/avataaars/svg?seed=STU18", admissionDate: "2025-02-22", bloodGroup: "A+", guardian: "কামাল উদ্দিন" },
    { id: "STU2025019", firstName: "তালহা", lastName: "জুবায়ের", gender: "Male", class: "Class 5", section: "Section A", rollNo: "13", phone: "01100123456", email: "stu19@mms.com", status: "active", photo: "https://api.dicebear.com/7.x/avataaars/svg?seed=STU19", admissionDate: "2025-02-25", bloodGroup: "B+", guardian: "নুর নবী" },
    { id: "STU2025020", firstName: "মেহজাবিন", lastName: "চৌধুরী", gender: "Female", class: "Class 6", section: "Section B", rollNo: "01", phone: "01011123456", email: "stu20@mms.com", status: "active", photo: "https://api.dicebear.com/7.x/avataaars/svg?seed=STU20", admissionDate: "2025-02-28", bloodGroup: "O+", guardian: "আমজাদ হোসেন" },
  ], []);

  // Filtered Results
  const filteredStudents = useMemo(() => {
    return students.filter(student => {
      const matchesSearch = 
        student.firstName.toLowerCase().includes(searchTerm.toLowerCase()) ||
        student.lastName.toLowerCase().includes(searchTerm.toLowerCase()) ||
        student.id.toLowerCase().includes(searchTerm.toLowerCase()) ||
        student.phone.includes(searchTerm);
      
      const matchesClass = classFilter === "all" || student.class === classFilter;
      const matchesSection = sectionFilter === "all" || student.section === sectionFilter;
      
      return matchesSearch && matchesClass && matchesSection;
    });
  }, [searchTerm, classFilter, sectionFilter, students]);

  // Pagination Logic
  const totalPages = Math.ceil(filteredStudents.length / itemsPerPage);
  const currentStudents = useMemo(() => {
    const startIndex = (currentPage - 1) * itemsPerPage;
    return filteredStudents.slice(startIndex, startIndex + itemsPerPage);
  }, [currentPage, filteredStudents]);

  // Reset to page 1 on search/filter change
  useState(() => {
    setCurrentPage(1);
  }, [searchTerm, classFilter, sectionFilter]);

  return (
    <div className="space-y-6 sm:space-y-8 animate-in fade-in duration-500 p-3 sm:p-4 md:p-6 lg:p-8">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 bg-white dark:bg-white p-6 rounded-3xl border-2 border-slate-200 shadow-sm text-center md:text-left">
        <div>
          <h1 className="text-2xl sm:text-3xl font-black text-slate-800 mb-1">Student Records</h1>
          <p className="text-slate-600 text-sm font-semibold">Manage and view all registered students</p>
        </div>
        <div className="flex flex-col sm:flex-row items-center gap-3">
          <button className="w-full sm:w-auto flex items-center justify-center gap-2 px-5 py-2.5 text-sm font-bold bg-slate-100 text-slate-700 rounded-xl hover:bg-slate-200 transition-all border border-slate-200">
            <Download className="w-4 h-4" />
            Export List
          </button>
          <Link to="/admin/admission/create" className="w-full sm:w-auto">
            <button className="w-full flex items-center justify-center gap-2 px-5 py-2.5 text-sm font-bold bg-[#00bd7f] text-white rounded-xl shadow-lg shadow-emerald-500/30 hover:shadow-xl hover:shadow-emerald-500/40 hover:scale-[1.02] transition-all">
              <Plus className="w-4 h-4" />
              New Admission
            </button>
          </Link>
        </div>
      </div>

      {/* Stats Summary */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {[
          { label: "Total Records", value: students.length, icon: GraduationCap, color: "text-blue-600", bg: "bg-blue-100" },
          { label: "Active", value: students.filter(s => s.status === 'active').length, icon: CheckCircle, color: "text-emerald-600", bg: "bg-emerald-100" },
          { label: "Inactive", value: students.filter(s => s.status === 'inactive').length, icon: XCircle, color: "text-rose-600", bg: "bg-rose-100" },
          { label: "Showing", value: `${currentStudents.length} of ${filteredStudents.length}`, icon: Users, color: "text-amber-600", bg: "bg-amber-100" }
        ].map((stat, idx) => (
          <div key={idx} className="bg-white rounded-2xl border-2 border-slate-200 p-6 flex items-center justify-between shadow-sm">
            <div>
              <p className="text-xs font-bold text-slate-500 uppercase mb-1">{stat.label}</p>
              <p className="text-2xl font-black text-slate-800">{stat.value}</p>
            </div>
            <div className={`w-12 h-12 ${stat.bg} rounded-xl flex items-center justify-center`}>
              <stat.icon className={`w-6 h-6 ${stat.color}`} />
            </div>
          </div>
        ))}
      </div>

      {/* Filters Area */}
      <div className="bg-white rounded-3xl border-2 border-slate-200 p-4 sm:p-6 md:p-8 shadow-sm">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
          <div className="md:col-span-2">
            <label className="text-sm font-bold text-slate-700 mb-2 block">Quick Search</label>
            <div className="relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
              <input
                type="text"
                placeholder="Search by ID, Name or Phone..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-10 pr-4 py-3 bg-[#e6f4ef] border-2 border-slate-200 text-slate-900 rounded-xl outline-none focus:ring-2 focus:ring-emerald-500 transition-all"
              />
            </div>
          </div>
          <div>
            <label className="text-sm font-bold text-slate-700 mb-2 block">Class</label>
            <select
              value={classFilter}
              onChange={(e) => setClassFilter(e.target.value)}
              className="w-full px-4 py-3 bg-[#e6f4ef] border-2 border-slate-200 text-slate-900 rounded-xl outline-none focus:ring-2 focus:ring-emerald-500 transition-all appearance-none"
            >
              <option value="all">All Classes</option>
              <option value="Class 4">Class 4</option>
              <option value="Class 5">Class 5</option>
              <option value="Class 6">Class 6</option>
            </select>
          </div>
          <div>
            <label className="text-sm font-bold text-slate-700 mb-2 block">Section</label>
            <select
              value={sectionFilter}
              onChange={(e) => setSectionFilter(e.target.value)}
              className="w-full px-4 py-3 bg-[#e6f4ef] border-2 border-slate-200 text-slate-900 rounded-xl outline-none focus:ring-2 focus:ring-emerald-500 transition-all"
            >
              <option value="all">All Sections</option>
              <option value="Section A">Section A</option>
              <option value="Section B">Section B</option>
              <option value="Section C">Section C</option>
            </select>
          </div>
        </div>
      </div>

      {/* Table Container */}
      <div className="bg-white rounded-3xl border-2 border-slate-200 shadow-sm overflow-hidden flex flex-col">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-[#e6f4ef] border-b-2 border-slate-200">
              <tr>
                <th className="px-6 py-4 text-left text-xs font-black text-slate-600 uppercase tracking-wider">Student ID</th>
                <th className="px-6 py-4 text-left text-xs font-black text-slate-600 uppercase tracking-wider">Student Info</th>
                <th className="px-6 py-4 text-left text-xs font-black text-slate-600 uppercase tracking-wider">Academic</th>
                <th className="px-6 py-4 text-left text-xs font-black text-slate-600 uppercase tracking-wider">Guardian</th>
                <th className="px-6 py-4 text-left text-xs font-black text-slate-600 uppercase tracking-wider">Contact</th>
                <th className="px-6 py-4 text-left text-xs font-black text-slate-600 uppercase tracking-wider">Status</th>
                <th className="px-6 py-4 text-left text-xs font-black text-slate-600 uppercase tracking-wider">Action</th>
              </tr>
            </thead>
            <tbody className="divide-y-2 divide-slate-100">
              {currentStudents.map((student) => (
                <tr key={student.id} className="hover:bg-slate-50 transition-colors">
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span className="text-sm font-black text-emerald-700">{student.id}</span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded-full border-2 border-emerald-100 overflow-hidden shadow-sm">
                        <img src={student.photo} alt={student.firstName} className="w-full h-full object-cover" />
                      </div>
                      <div>
                        <p className="text-sm font-bold text-slate-800">{student.firstName} {student.lastName}</p>
                        <p className="text-[10px] text-slate-500 font-bold uppercase tracking-wider">{student.gender}</p>
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="space-y-1">
                      <p className="text-sm font-bold text-slate-700">{student.class} ({student.section})</p>
                      <p className="text-xs font-black text-emerald-600">Roll: {student.rollNo}</p>
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <p className="text-sm font-bold text-slate-800">{student.guardian}</p>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="space-y-1 text-xs font-bold text-slate-600">
                      <div className="flex items-center gap-1.5"><Phone className="w-3.5 h-3.5 text-emerald-500" />{student.phone}</div>
                      <div className="flex items-center gap-1.5"><Mail className="w-3.5 h-3.5 text-emerald-500" />{student.email}</div>
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full text-[10px] font-black uppercase tracking-widest border-2 ${
                      student.status === 'active' 
                        ? 'bg-emerald-50 text-emerald-700 border-emerald-100' 
                        : 'bg-rose-50 text-rose-700 border-rose-100'
                    }`}>
                      <div className={`w-1.5 h-1.5 rounded-full ${student.status === 'active' ? 'bg-emerald-500' : 'bg-rose-500'}`} />
                      {student.status}
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="flex items-center gap-2">
                      <button onClick={() => navigate(`/admin/student/profile/${student.id}`)} className="p-2 hover:bg-emerald-50 text-emerald-600 rounded-lg transition-all"><Eye className="w-4 h-4" /></button>
                      <div className="relative">
                        <button 
                          onClick={(e) => {
                            e.stopPropagation();
                            setOpenMenuId(openMenuId === student.id ? null : student.id);
                          }}
                          className={`p-2 rounded-lg transition-all ${openMenuId === student.id ? 'bg-slate-100 text-[#00bd7f]' : 'hover:bg-slate-100 text-slate-400'}`}
                        >
                          <MoreVertical className="w-4 h-4" />
                        </button>
                        
                        {openMenuId === student.id && (
                          <div className="absolute right-0 mt-2 w-48 bg-white rounded-2xl shadow-xl border-2 border-slate-100 z-50 py-2 animate-in fade-in slide-in-from-top-2 duration-200">
                            {[
                              { label: 'View Profile', icon: User, color: 'text-slate-600', hover: 'hover:bg-slate-50' },
                              { label: 'Edit Info', icon: Edit2, color: 'text-slate-600', hover: 'hover:bg-slate-50' },
                              { label: 'Change Status', icon: UserCheck, color: 'text-slate-600', hover: 'hover:bg-slate-50' },
                              { label: 'Download ID', icon: CreditCard, color: 'text-slate-600', hover: 'hover:bg-slate-50' },
                              { label: 'Delete Record', icon: Trash2, color: 'text-rose-500', hover: 'hover:bg-rose-50' },
                            ].map((action, i) => (
                              <button 
                                key={i}
                                onClick={() => {
                                  if (action.label === 'View Profile') {
                                    navigate(`/admin/student/profile/${student.id}`);
                                  } else {
                                    handleAction(action.label, student);
                                  }
                                }}
                                className={`w-full flex items-center gap-3 px-4 py-2.5 text-xs font-bold ${action.color} ${action.hover} transition-colors first:rounded-t-xl last:rounded-b-xl`}
                              >
                                <action.icon className="w-4 h-4" />
                                {action.label}
                              </button>
                            ))}
                          </div>
                        )}
                      </div>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* Pagination Controls */}
        <div className="bg-[#e6f4ef]/30 px-6 py-4 border-t-2 border-slate-200 flex flex-col sm:flex-row items-center justify-between gap-4">
          <p className="text-xs font-bold text-slate-500 uppercase tracking-wider">
            Showing <span className="text-slate-900">{(currentPage-1)*itemsPerPage + 1}</span> to <span className="text-slate-900">{Math.min(currentPage*itemsPerPage, filteredStudents.length)}</span> of <span className="text-slate-900">{filteredStudents.length}</span> students
          </p>
          <div className="flex items-center gap-2">
            <button 
              disabled={currentPage === 1}
              onClick={() => setCurrentPage(p => Math.max(1, p - 1))}
              className="p-2 border-2 border-slate-200 rounded-xl bg-white text-slate-600 hover:bg-slate-50 hover:border-emerald-500 hover:text-emerald-600 disabled:opacity-50 disabled:cursor-not-allowed transition-all"
            >
              <ChevronLeft className="w-5 h-5" />
            </button>
            <div className="flex items-center gap-1">
              {[...Array(totalPages)].map((_, i) => (
                <button
                  key={i+1}
                  onClick={() => setCurrentPage(i + 1)}
                  className={`w-10 h-10 rounded-xl text-xs font-black transition-all border-2 ${
                    currentPage === i + 1 
                      ? 'bg-[#00bd7f] border-[#00bd7f] text-white shadow-lg shadow-emerald-200' 
                      : 'bg-white border-slate-200 text-slate-600 hover:border-emerald-500 hover:text-emerald-600'
                  }`}
                >
                  {i + 1}
                </button>
              ))}
            </div>
            <button 
              disabled={currentPage === totalPages}
              onClick={() => setCurrentPage(p => Math.min(totalPages, p + 1))}
              className="p-2 border-2 border-slate-200 rounded-xl bg-white text-slate-600 hover:bg-slate-50 hover:border-emerald-500 hover:text-emerald-600 disabled:opacity-50 disabled:cursor-not-allowed transition-all"
            >
              <ChevronRight className="w-5 h-5" />
            </button>
          </div>
        </div>
        
        {filteredStudents.length === 0 && (
          <div className="text-center py-20 bg-slate-50">
            <GraduationCap className="w-16 h-16 text-slate-200 mx-auto mb-4" />
            <p className="text-slate-500 font-bold">No students found matching your criteria</p>
          </div>
        )}
      </div>

      {/* Action Modals */}
      {editStudent && <EditModal student={editStudent} onClose={() => setEditStudent(null)} />}
      {deleteStudent && <DeleteModal student={deleteStudent} onClose={() => setDeleteStudent(null)} />}
      {idCardStudent && <IDCardModal student={idCardStudent} onClose={() => setIdCardStudent(null)} />}

      {/* Success Feedback Toast */}
      {showStatusToast && (
        <div className="fixed bottom-8 left-1/2 -translate-x-1/2 z-[200] animate-in slide-in-from-bottom-10 duration-500">
          <div className="bg-slate-900 text-white px-6 py-3 rounded-2xl shadow-2xl flex items-center gap-3">
            <div className="w-6 h-6 bg-emerald-500 rounded-full flex items-center justify-center">
              <CheckCircle className="w-4 h-4 text-white" />
            </div>
            <p className="text-sm font-bold">{showStatusToast}</p>
          </div>
        </div>
      )}
    </div>
  );
};

// --- Sub-Components (Modals) ---

const EditModal = ({ student, onClose }) => {
  const [formData, setFormData] = useState({ ...student });
  
  return (
    <div 
      className="fixed inset-0 bg-slate-900/60 backdrop-blur-sm z-[110] flex items-center justify-center p-4"
      onClick={onClose}
    >
      <div 
        className="bg-white rounded-3xl w-full max-w-xl max-h-[90vh] overflow-y-auto shadow-2xl animate-in zoom-in duration-300"
        onClick={e => e.stopPropagation()}
      >
        <div className="p-6 border-b-2 border-slate-100 flex items-center justify-between sticky top-0 bg-white z-10">
          <h2 className="text-xl font-black text-slate-800">Edit Student Info</h2>
          <button onClick={onClose} className="p-2 hover:bg-slate-100 rounded-xl transition-all"><X className="w-5 h-5 text-slate-400" /></button>
        </div>
        <div className="p-8 space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <div className="col-span-2">
              <label className="text-[10px] font-black text-slate-400 uppercase mb-1 block">Full Name</label>
              <div className="flex gap-2">
                <input 
                  value={formData.firstName} 
                  onChange={e => setFormData({...formData, firstName: e.target.value})}
                  className="w-full px-4 py-2.5 bg-[#e6f4ef] border-2 border-slate-100 rounded-xl outline-none focus:border-[#00bd7f] transition-all text-sm font-bold"
                />
                <input 
                  value={formData.lastName} 
                  onChange={e => setFormData({...formData, lastName: e.target.value})}
                  className="w-full px-4 py-2.5 bg-[#e6f4ef] border-2 border-slate-100 rounded-xl outline-none focus:border-[#00bd7f] transition-all text-sm font-bold"
                />
              </div>
            </div>
            <div>
              <label className="text-[10px] font-black text-slate-400 uppercase mb-1 block">Class</label>
              <input value={formData.class} className="w-full px-4 py-2.5 bg-slate-50 border-2 border-slate-100 rounded-xl text-sm font-bold text-slate-500" disabled />
            </div>
            <div>
              <label className="text-[10px] font-black text-slate-400 uppercase mb-1 block">Roll No</label>
              <input 
                value={formData.rollNo} 
                onChange={e => setFormData({...formData, rollNo: e.target.value})}
                className="w-full px-4 py-2.5 bg-[#e6f4ef] border-2 border-slate-100 rounded-xl outline-none focus:border-[#00bd7f] transition-all text-sm font-bold"
              />
            </div>
            <div className="col-span-2">
              <label className="text-[10px] font-black text-slate-400 uppercase mb-1 block">Phone Number</label>
              <input 
                value={formData.phone} 
                onChange={e => setFormData({...formData, phone: e.target.value})}
                className="w-full px-4 py-2.5 bg-[#e6f4ef] border-2 border-slate-100 rounded-xl outline-none focus:border-[#00bd7f] transition-all text-sm font-bold"
              />
            </div>
          </div>
          <div className="pt-6 flex justify-end gap-3">
            <button onClick={onClose} className="px-6 py-2.5 text-sm font-bold text-slate-600 hover:bg-slate-50 rounded-xl transition-all">Cancel</button>
            <button onClick={() => { alert('Changes Saved!'); onClose(); }} className="px-8 py-2.5 bg-[#00bd7f] text-white text-sm font-bold rounded-xl shadow-lg shadow-emerald-200">Save Changes</button>
          </div>
        </div>
      </div>
    </div>
  );
};

const DeleteModal = ({ student, onClose }) => (
  <div 
    className="fixed inset-0 bg-slate-900/60 backdrop-blur-sm z-[110] flex items-center justify-center p-4"
    onClick={onClose}
  >
    <div 
      className="bg-white rounded-3xl w-full max-w-md shadow-2xl animate-in zoom-in duration-300 overflow-hidden"
      onClick={e => e.stopPropagation()}
    >
      <div className="bg-rose-50 p-8 flex flex-col items-center text-center">
        <div className="w-16 h-16 bg-rose-100 rounded-full flex items-center justify-center mb-4">
          <Trash2 className="w-8 h-8 text-rose-600" />
        </div>
        <h2 className="text-xl font-black text-slate-800 mb-2">Delete Student Record?</h2>
        <p className="text-sm font-bold text-slate-500">You are about to delete <span className="text-rose-600 font-black">{student.firstName}'s</span> record. This action cannot be undone.</p>
      </div>
      <div className="p-6 flex justify-center gap-3 bg-white">
        <button onClick={onClose} className="px-8 py-2.5 text-sm font-bold text-slate-600 hover:bg-slate-50 rounded-xl transition-all border-2 border-slate-100">Go Back</button>
        <button onClick={() => { alert('Record Deleted!'); onClose(); }} className="px-8 py-2.5 bg-rose-600 text-white text-sm font-bold rounded-xl shadow-lg shadow-rose-200 hover:bg-rose-700">Delete Now</button>
      </div>
    </div>
  </div>
);

const IDCardModal = ({ student, onClose }) => (
  <div 
    className="fixed inset-0 bg-slate-900/60 backdrop-blur-sm z-[110] flex items-center justify-center p-4"
    onClick={onClose}
  >
    <div 
      className="bg-white rounded-3xl w-full max-w-sm max-h-[90vh] overflow-y-auto shadow-2xl animate-in zoom-in duration-300"
      onClick={e => e.stopPropagation()}
    >
      <div className="p-6 border-b-2 border-slate-100 flex items-center justify-between sticky top-0 bg-white z-10">
        <h2 className="text-lg font-black text-slate-800">Student ID Preview</h2>
        <button onClick={onClose} className="p-2 hover:bg-slate-100 rounded-xl transition-all"><X className="w-5 h-5 text-slate-400" /></button>
      </div>
      <div className="p-8 flex flex-col items-center">
        {/* ID Card UI */}
        <div className="w-full aspect-[1/1.6] bg-gradient-to-br from-emerald-500 to-teal-700 rounded-2xl shadow-xl p-6 text-white flex flex-col items-center relative overflow-hidden">
          <div className="absolute top-0 right-0 w-32 h-32 bg-white/10 rounded-full -mr-16 -mt-16" />
          <div className="w-24 h-24 rounded-full border-4 border-white/30 shadow-lg overflow-hidden mb-4 relative z-10">
            <img src={student.photo} className="w-full h-full object-cover" alt="ID" />
          </div>
          <h3 className="text-lg font-black tracking-tight">{student.firstName} {student.lastName}</h3>
          <p className="text-[10px] font-bold opacity-80 uppercase mb-6 tracking-widest">{student.id}</p>
          
          <div className="w-full space-y-3 pt-4 border-t border-white/20">
            <div className="flex justify-between text-[10px] font-bold uppercase"><span className="opacity-60">Class</span><span>{student.class}</span></div>
            <div className="flex justify-between text-[10px] font-bold uppercase"><span className="opacity-60">Roll No</span><span>{student.rollNo}</span></div>
            <div className="flex justify-between text-[10px] font-bold uppercase"><span className="opacity-60">Blood</span><span>{student.bloodGroup}</span></div>
          </div>
          
          <div className="mt-auto pt-6 w-full flex justify-center">
             <div className="bg-white rounded-lg p-2"><div className="w-8 h-8 bg-slate-800 rounded-sm" /></div>
          </div>
        </div>

        <div className="w-full mt-6">
          <button onClick={() => alert('Downloading ID Card...')} className="w-full flex items-center justify-center gap-2 py-3 bg-[#00bd7f] text-white font-black rounded-xl shadow-lg shadow-emerald-100 hover:scale-[1.02] transition-all">
            <Download className="w-4 h-4" />
            Download PDF
          </button>
        </div>
      </div>
    </div>
  </div>
);

export default StudentList;
