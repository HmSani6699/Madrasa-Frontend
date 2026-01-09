import { useState } from "react";
import {
  Search,
  Filter,
  Download,
  Eye,
  CheckCircle,
  XCircle,
  Clock,
  User,
  Phone,
  Mail,
  Calendar,
  BookOpen,
  Users,
  MapPin,
  FileText,
  X
} from "lucide-react";

const OnlineAdmissionList = () => {
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [classFilter, setClassFilter] = useState("all");
  const [selectedApplication, setSelectedApplication] = useState(null);

  // Sample data - in production this would come from an API
  const applications = [
    {
      id: 1,
      applicationDate: "2026-01-08",
      academicYear: "2025-2026",
      student: {
        firstName: "মোহাম্মদ",
        lastName: "রহমান",
        gender: "Male",
        dateOfBirth: "2015-05-15",
        class: "Class 5",
        subject: "General",
        phone: "01712345678",
        email: "rahman@example.com",
        photo: "https://api.dicebear.com/7.x/avataaars/svg?seed=1"
      },
      guardian: {
        fatherName: "আব্দুল করিম",
        motherName: "ফাতেমা বেগম",
        fatherOccupation: "Business",
        motherOccupation: "Housewife",
        contact: "01712345678",
        email: "karim@example.com",
        address: "Dhaka, Bangladesh",
        photo: "https://api.dicebear.com/7.x/avataaars/svg?seed=father1"
      },
      transport: {
        required: true,
        route: "Mirpur - Dhanmondi"
      },
      hostel: {
        required: false,
        roomType: ""
      },
      status: "pending",
      remarks: ""
    },
    {
      id: 2,
      applicationDate: "2026-01-07",
      academicYear: "2025-2026",
      student: {
        firstName: "আয়েশা",
        lastName: "খাতুন",
        gender: "Female",
        dateOfBirth: "2014-08-20",
        class: "Class 6",
        subject: "Science",
        phone: "01823456789",
        email: "ayesha@example.com",
        photo: "https://api.dicebear.com/7.x/avataaars/svg?seed=2"
      },
      guardian: {
        fatherName: "মোহাম্মদ আলী",
        motherName: "সালমা বেগম",
        fatherOccupation: "Teacher",
        motherOccupation: "Doctor",
        contact: "01823456789",
        email: "ali@example.com",
        address: "Chittagong, Bangladesh",
        photo: "https://api.dicebear.com/7.x/avataaars/svg?seed=father2"
      },
      transport: {
        required: false,
        route: ""
      },
      hostel: {
        required: true,
        roomType: "Shared Room"
      },
      status: "approved",
      remarks: "Excellent academic record"
    },
    {
      id: 3,
      applicationDate: "2026-01-06",
      academicYear: "2025-2026",
      student: {
        firstName: "ইউসুফ",
        lastName: "হোসেন",
        gender: "Male",
        dateOfBirth: "2016-03-10",
        class: "Class 4",
        subject: "General",
        phone: "01934567890",
        email: "yusuf@example.com",
        photo: "https://api.dicebear.com/7.x/avataaars/svg?seed=3"
      },
      guardian: {
        fatherName: "হোসেন আহমেদ",
        motherName: "রুবিনা আক্তার",
        fatherOccupation: "Engineer",
        motherOccupation: "Housewife",
        contact: "01934567890",
        email: "hosen@example.com",
        address: "Sylhet, Bangladesh",
        photo: "https://api.dicebear.com/7.x/avataaars/svg?seed=father3"
      },
      transport: {
        required: true,
        route: "Gulshan - Banani"
      },
      hostel: {
        required: false,
        roomType: ""
      },
      status: "rejected",
      remarks: "Age requirement not met"
    }
  ];

  const getStatusBadge = (status) => {
    const styles = {
      pending: "bg-yellow-100 text-yellow-700 border-yellow-200",
      approved: "bg-green-100 text-green-700 border-green-200",
      rejected: "bg-red-100 text-red-700 border-red-200"
    };
    const icons = {
      pending: Clock,
      approved: CheckCircle,
      rejected: XCircle
    };
    const Icon = icons[status];
    return (
      <span className={`inline-flex items-center gap-1 px-3 py-1 rounded-full text-xs font-bold border ${styles[status]}`}>
        <Icon className="w-3 h-3" />
        {status.charAt(0).toUpperCase() + status.slice(1)}
      </span>
    );
  };

  const filteredApplications = applications.filter(app => {
    const matchesSearch = 
      app.student.firstName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      app.student.lastName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      app.guardian.fatherName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      app.student.phone.includes(searchTerm);
    
    const matchesStatus = statusFilter === "all" || app.status === statusFilter;
    const matchesClass = classFilter === "all" || app.student.class === classFilter;
    
    return matchesSearch && matchesStatus && matchesClass;
  });

  const handleStatusChange = (id, newStatus) => {
    // In production, this would make an API call
    console.log(`Changing status of application ${id} to ${newStatus}`);
    alert(`Application ${id} status changed to ${newStatus}`);
  };

  return (
    <div className="space-y-6 animate-in fade-in duration-500">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-extrabold text-slate-900 dark:text-white">Online Admission Applications</h1>
          <p className="text-slate-500 text-sm font-medium">Review and manage student admission requests</p>
        </div>
        <button className="flex items-center gap-2 px-6 py-2 text-sm font-bold bg-primary text-white rounded-xl shadow-lg shadow-primary/20 hover:scale-[1.02] transition-all">
          <Download className="w-4 h-4" />
          Export to Excel
        </button>
      </div>

      {/* Filters */}
      <div className="bg-white dark:bg-slate-800 rounded-2xl border border-slate-100 dark:border-slate-700 p-6">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          {/* Search */}
          <div className="md:col-span-2">
            <label className="text-xs font-bold text-slate-500 uppercase mb-2 block">Search</label>
            <div className="relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
              <input
                type="text"
                placeholder="Search by name, phone..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-10 pr-4 py-2.5 bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-xl outline-none focus:ring-2 focus:ring-primary/20"
              />
            </div>
          </div>

          {/* Status Filter */}
          <div>
            <label className="text-xs font-bold text-slate-500 uppercase mb-2 block">Status</label>
            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
              className="w-full px-4 py-2.5 bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-xl outline-none focus:ring-2 focus:ring-primary/20"
            >
              <option value="all">All Status</option>
              <option value="pending">Pending</option>
              <option value="approved">Approved</option>
              <option value="rejected">Rejected</option>
            </select>
          </div>

          {/* Class Filter */}
          <div>
            <label className="text-xs font-bold text-slate-500 uppercase mb-2 block">Class</label>
            <select
              value={classFilter}
              onChange={(e) => setClassFilter(e.target.value)}
              className="w-full px-4 py-2.5 bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-xl outline-none focus:ring-2 focus:ring-primary/20"
            >
              <option value="all">All Classes</option>
              <option value="Class 4">Class 4</option>
              <option value="Class 5">Class 5</option>
              <option value="Class 6">Class 6</option>
            </select>
          </div>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <div className="bg-white dark:bg-slate-800 rounded-2xl border border-slate-100 dark:border-slate-700 p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-xs font-bold text-slate-500 uppercase mb-1">Total Applications</p>
              <p className="text-3xl font-black text-slate-900 dark:text-white">{applications.length}</p>
            </div>
            <div className="w-12 h-12 bg-blue-100 dark:bg-blue-900/20 rounded-xl flex items-center justify-center">
              <FileText className="w-6 h-6 text-blue-600" />
            </div>
          </div>
        </div>

        <div className="bg-white dark:bg-slate-800 rounded-2xl border border-slate-100 dark:border-slate-700 p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-xs font-bold text-slate-500 uppercase mb-1">Pending</p>
              <p className="text-3xl font-black text-yellow-600">{applications.filter(a => a.status === 'pending').length}</p>
            </div>
            <div className="w-12 h-12 bg-yellow-100 dark:bg-yellow-900/20 rounded-xl flex items-center justify-center">
              <Clock className="w-6 h-6 text-yellow-600" />
            </div>
          </div>
        </div>

        <div className="bg-white dark:bg-slate-800 rounded-2xl border border-slate-100 dark:border-slate-700 p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-xs font-bold text-slate-500 uppercase mb-1">Approved</p>
              <p className="text-3xl font-black text-green-600">{applications.filter(a => a.status === 'approved').length}</p>
            </div>
            <div className="w-12 h-12 bg-green-100 dark:bg-green-900/20 rounded-xl flex items-center justify-center">
              <CheckCircle className="w-6 h-6 text-green-600" />
            </div>
          </div>
        </div>

        <div className="bg-white dark:bg-slate-800 rounded-2xl border border-slate-100 dark:border-slate-700 p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-xs font-bold text-slate-500 uppercase mb-1">Rejected</p>
              <p className="text-3xl font-black text-red-600">{applications.filter(a => a.status === 'rejected').length}</p>
            </div>
            <div className="w-12 h-12 bg-red-100 dark:bg-red-900/20 rounded-xl flex items-center justify-center">
              <XCircle className="w-6 h-6 text-red-600" />
            </div>
          </div>
        </div>
      </div>

      {/* Applications List */}
      <div className="bg-white dark:bg-slate-800 rounded-2xl border border-slate-100 dark:border-slate-700 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-slate-50 dark:bg-slate-900 border-b border-slate-100 dark:border-slate-700">
              <tr>
                <th className="px-6 py-4 text-left text-xs font-black text-slate-500 uppercase tracking-wider">Student</th>
                <th className="px-6 py-4 text-left text-xs font-black text-slate-500 uppercase tracking-wider">Class</th>
                <th className="px-6 py-4 text-left text-xs font-black text-slate-500 uppercase tracking-wider">Guardian</th>
                <th className="px-6 py-4 text-left text-xs font-black text-slate-500 uppercase tracking-wider">Contact</th>
                <th className="px-6 py-4 text-left text-xs font-black text-slate-500 uppercase tracking-wider">Applied Date</th>
                <th className="px-6 py-4 text-left text-xs font-black text-slate-500 uppercase tracking-wider">Status</th>
                <th className="px-6 py-4 text-left text-xs font-black text-slate-500 uppercase tracking-wider">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 dark:divide-slate-700">
              {filteredApplications.map((app) => (
                <tr key={app.id} className="hover:bg-slate-50 dark:hover:bg-slate-900/50 transition-colors">
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-3">
                      <img src={app.student.photo} alt={app.student.firstName} className="w-10 h-10 rounded-full" />
                      <div>
                        <p className="font-bold text-slate-900 dark:text-white">{app.student.firstName} {app.student.lastName}</p>
                        <p className="text-xs text-slate-500">{app.student.gender}</p>
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <span className="inline-block px-3 py-1 bg-primary/10 text-primary text-xs font-bold rounded-lg">
                      {app.student.class}
                    </span>
                  </td>
                  <td className="px-6 py-4">
                    <p className="font-bold text-slate-900 dark:text-white text-sm">{app.guardian.fatherName}</p>
                    <p className="text-xs text-slate-500">{app.guardian.fatherOccupation}</p>
                  </td>
                  <td className="px-6 py-4">
                    <div className="space-y-1">
                      <p className="text-sm text-slate-600 dark:text-slate-400 flex items-center gap-1">
                        <Phone className="w-3 h-3" />
                        {app.student.phone}
                      </p>
                      <p className="text-xs text-slate-500 flex items-center gap-1">
                        <Mail className="w-3 h-3" />
                        {app.student.email}
                      </p>
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <p className="text-sm text-slate-600 dark:text-slate-400 flex items-center gap-1">
                      <Calendar className="w-3 h-3" />
                      {app.applicationDate}
                    </p>
                  </td>
                  <td className="px-6 py-4">
                    {getStatusBadge(app.status)}
                  </td>
                  <td className="px-6 py-4">
                    <button
                      onClick={() => setSelectedApplication(app)}
                      className="flex items-center gap-1 px-3 py-1.5 bg-slate-100 dark:bg-slate-700 text-slate-700 dark:text-slate-300 text-xs font-bold rounded-lg hover:bg-slate-200 dark:hover:bg-slate-600 transition-colors"
                    >
                      <Eye className="w-3 h-3" />
                      View Details
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {filteredApplications.length === 0 && (
          <div className="text-center py-12">
            <FileText className="w-12 h-12 text-slate-300 mx-auto mb-4" />
            <p className="text-slate-500 font-medium">No applications found</p>
          </div>
        )}
      </div>

      {/* Detail Modal */}
      {selectedApplication && (
        <div 
          className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4"
          onClick={() => setSelectedApplication(null)}
        >
          <div 
            className="bg-white dark:bg-slate-800 rounded-3xl max-w-4xl w-full max-h-[90vh] overflow-y-auto"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Modal Header */}
            <div className="sticky top-0 bg-white dark:bg-slate-800 border-b border-slate-100 dark:border-slate-700 px-8 py-6 flex items-center justify-between">
              <div>
                <h2 className="text-2xl font-black text-slate-900 dark:text-white">Application Details</h2>
                <p className="text-sm text-slate-500">Application ID: #{selectedApplication.id}</p>
              </div>
              <button
                onClick={() => setSelectedApplication(null)}
                className="p-2 hover:bg-slate-100 dark:hover:bg-slate-700 rounded-xl transition-colors"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Modal Content */}
            <div className="p-8 space-y-8">
              {/* Student Information */}
              <div>
                <h3 className="text-lg font-black text-slate-900 dark:text-white mb-4 flex items-center gap-2">
                  <User className="w-5 h-5 text-primary" />
                  Student Information
                </h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6 bg-slate-50 dark:bg-slate-900 rounded-2xl p-6">
                  <div className="md:col-span-2 flex items-center gap-4">
                    <img src={selectedApplication.student.photo} alt="Student" className="w-20 h-20 rounded-full border-4 border-white shadow-lg" />
                    <div>
                      <p className="text-xl font-black text-slate-900 dark:text-white">
                        {selectedApplication.student.firstName} {selectedApplication.student.lastName}
                      </p>
                      <p className="text-sm text-slate-500">{selectedApplication.student.gender}</p>
                    </div>
                  </div>
                  <div>
                    <label className="text-xs font-bold text-slate-500 uppercase block mb-1">Date of Birth</label>
                    <p className="font-bold text-slate-900 dark:text-white">{selectedApplication.student.dateOfBirth}</p>
                  </div>
                  <div>
                    <label className="text-xs font-bold text-slate-500 uppercase block mb-1">Class</label>
                    <p className="font-bold text-slate-900 dark:text-white">{selectedApplication.student.class}</p>
                  </div>
                  <div>
                    <label className="text-xs font-bold text-slate-500 uppercase block mb-1">Subject</label>
                    <p className="font-bold text-slate-900 dark:text-white">{selectedApplication.student.subject}</p>
                  </div>
                  <div>
                    <label className="text-xs font-bold text-slate-500 uppercase block mb-1">Phone</label>
                    <p className="font-bold text-slate-900 dark:text-white">{selectedApplication.student.phone}</p>
                  </div>
                  <div className="md:col-span-2">
                    <label className="text-xs font-bold text-slate-500 uppercase block mb-1">Email</label>
                    <p className="font-bold text-slate-900 dark:text-white">{selectedApplication.student.email}</p>
                  </div>
                </div>
              </div>

              {/* Guardian Information */}
              <div>
                <h3 className="text-lg font-black text-slate-900 dark:text-white mb-4 flex items-center gap-2">
                  <Users className="w-5 h-5 text-primary" />
                  Guardian Information
                </h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6 bg-slate-50 dark:bg-slate-900 rounded-2xl p-6">
                  <div>
                    <label className="text-xs font-bold text-slate-500 uppercase block mb-1">Father's Name</label>
                    <p className="font-bold text-slate-900 dark:text-white">{selectedApplication.guardian.fatherName}</p>
                  </div>
                  <div>
                    <label className="text-xs font-bold text-slate-500 uppercase block mb-1">Mother's Name</label>
                    <p className="font-bold text-slate-900 dark:text-white">{selectedApplication.guardian.motherName}</p>
                  </div>
                  <div>
                    <label className="text-xs font-bold text-slate-500 uppercase block mb-1">Father's Occupation</label>
                    <p className="font-bold text-slate-900 dark:text-white">{selectedApplication.guardian.fatherOccupation}</p>
                  </div>
                  <div>
                    <label className="text-xs font-bold text-slate-500 uppercase block mb-1">Mother's Occupation</label>
                    <p className="font-bold text-slate-900 dark:text-white">{selectedApplication.guardian.motherOccupation}</p>
                  </div>
                  <div>
                    <label className="text-xs font-bold text-slate-500 uppercase block mb-1">Contact</label>
                    <p className="font-bold text-slate-900 dark:text-white">{selectedApplication.guardian.contact}</p>
                  </div>
                  <div>
                    <label className="text-xs font-bold text-slate-500 uppercase block mb-1">Email</label>
                    <p className="font-bold text-slate-900 dark:text-white">{selectedApplication.guardian.email}</p>
                  </div>
                  <div className="md:col-span-2">
                    <label className="text-xs font-bold text-slate-500 uppercase block mb-1">Address</label>
                    <p className="font-bold text-slate-900 dark:text-white">{selectedApplication.guardian.address}</p>
                  </div>
                </div>
              </div>

              {/* Additional Information */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {/* Transport */}
                <div>
                  <h3 className="text-lg font-black text-slate-900 dark:text-white mb-4 flex items-center gap-2">
                    <MapPin className="w-5 h-5 text-primary" />
                    Transport Details
                  </h3>
                  <div className="bg-slate-50 dark:bg-slate-900 rounded-2xl p-6">
                    <p className="text-sm text-slate-600 dark:text-slate-400 mb-2">Transport Required:</p>
                    <p className="font-bold text-slate-900 dark:text-white mb-4">
                      {selectedApplication.transport.required ? "Yes" : "No"}
                    </p>
                    {selectedApplication.transport.required && (
                      <>
                        <p className="text-sm text-slate-600 dark:text-slate-400 mb-2">Route:</p>
                        <p className="font-bold text-slate-900 dark:text-white">{selectedApplication.transport.route}</p>
                      </>
                    )}
                  </div>
                </div>

                {/* Hostel */}
                <div>
                  <h3 className="text-lg font-black text-slate-900 dark:text-white mb-4 flex items-center gap-2">
                    <BookOpen className="w-5 h-5 text-primary" />
                    Hostel Details
                  </h3>
                  <div className="bg-slate-50 dark:bg-slate-900 rounded-2xl p-6">
                    <p className="text-sm text-slate-600 dark:text-slate-400 mb-2">Hostel Required:</p>
                    <p className="font-bold text-slate-900 dark:text-white mb-4">
                      {selectedApplication.hostel.required ? "Yes" : "No"}
                    </p>
                    {selectedApplication.hostel.required && (
                      <>
                        <p className="text-sm text-slate-600 dark:text-slate-400 mb-2">Room Type:</p>
                        <p className="font-bold text-slate-900 dark:text-white">{selectedApplication.hostel.roomType}</p>
                      </>
                    )}
                  </div>
                </div>
              </div>

              {/* Status Actions */}
              <div>
                <h3 className="text-lg font-black text-slate-900 dark:text-white mb-4">Application Status</h3>
                <div className="bg-slate-50 dark:bg-slate-900 rounded-2xl p-6">
                  <div className="flex items-center justify-between mb-4">
                    <span className="text-sm font-bold text-slate-600 dark:text-slate-400">Current Status:</span>
                    {getStatusBadge(selectedApplication.status)}
                  </div>
                  <div className="flex gap-3">
                    <button
                      onClick={() => handleStatusChange(selectedApplication.id, 'approved')}
                      className="flex-1 flex items-center justify-center gap-2 px-4 py-3 bg-green-500 text-white font-bold rounded-xl hover:bg-green-600 transition-colors"
                    >
                      <CheckCircle className="w-4 h-4" />
                      Approve
                    </button>
                    <button
                      onClick={() => handleStatusChange(selectedApplication.id, 'rejected')}
                      className="flex-1 flex items-center justify-center gap-2 px-4 py-3 bg-red-500 text-white font-bold rounded-xl hover:bg-red-600 transition-colors"
                    >
                      <XCircle className="w-4 h-4" />
                      Reject
                    </button>
                    <button
                      onClick={() => handleStatusChange(selectedApplication.id, 'pending')}
                      className="flex-1 flex items-center justify-center gap-2 px-4 py-3 bg-yellow-500 text-white font-bold rounded-xl hover:bg-yellow-600 transition-colors"
                    >
                      <Clock className="w-4 h-4" />
                      Mark Pending
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default OnlineAdmissionList;
