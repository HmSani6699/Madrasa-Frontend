import { useState } from "react";
import { 
  UserPlus, 
  Search, 
  Filter, 
  Download, 
  FileText, 
  Briefcase,
  Calendar,
  Layers,
  ChevronDown,
  Printer,
  Table as TableIcon,
  FileSpreadsheet,
  FileJson,
  MoreHorizontal,
  Users,
  ChevronRight,
  ChevronLeft,
  Eye
} from "lucide-react";

import jsPDF from "jspdf";
import "jspdf-autotable";
import * as XLSX from "xlsx";

import SelectInputField from "../../components/SelectInputField";
import { Link } from "react-router";

const AdmissionReports = () => {
  const [searchTerm, setSearchTerm] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 10;
  const [filters, setFilters] = useState({
    class: "All",
    group: "All",
    year: "2026"
  });

  const stats = [
    { label: 'Total Admissions', value: '1,284', delta: '+12%', color: 'emerald' },
    { label: 'Active Students', value: '42', delta: '+5', color: 'blue' },
    { label: 'Inactive Students', value: '92%', delta: 'Optimal', color: 'indigo' },
    
  ];

  const classData = [
    { class: 'Hifz Class', group: 'Tahfiz', count: 120, capacity: 130, year: '2026' },
    { class: 'Class One', group: 'General', count: 45, capacity: 50, year: '2026' },
    { class: 'Class Two', group: 'General', count: 38, capacity: 50, year: '2026' },
    { class: 'Class Three', group: 'General', count: 42, capacity: 50, year: '2026' },
    { class: 'Nursery', group: 'Pre-Primary', count: 65, capacity: 70, year: '2026' },
  ];

  const studentList = [
    { id: 'ADM001', name: 'Habibullah Khan', class: 'Hifz Class', group: 'Tahfiz', date: '2026-01-10' },
    { id: 'ADM002', name: 'Ismail Hossain', class: 'Class One', group: 'General', date: '2026-01-12' },
    { id: 'ADM003', name: 'Abdur Rahman', class: 'Class Two', group: 'General', date: '2026-01-15' },
    { id: 'ADM004', name: 'Omar Faruk', class: 'Nursery', group: 'Pre-Primary', date: '2026-01-20' },
    // Adding more mock data to demonstrate pagination
    { id: 'ADM005', name: 'Ahmad Abdullah', class: 'Class Three', group: 'General', date: '2026-01-22' },
    { id: 'ADM006', name: 'Zaid Al-Hassan', class: 'Nursery', group: 'Pre-Primary', date: '2026-01-25' },
    { id: 'ADM007', name: 'Yusuf Ahmed', class: 'Hifz Class', group: 'Tahfiz', date: '2026-01-28' },
    { id: 'ADM008', name: 'Ibrahim Ali', class: 'Class One', group: 'General', date: '2026-02-01' },
    { id: 'ADM009', name: 'Mustafa Kamal', class: 'Class Two', group: 'General', date: '2026-02-03' },
    { id: 'ADM010', name: 'Salman Farisi', class: 'Class Three', group: 'General', date: '2026-02-05' },
    { id: 'ADM011', name: 'Bilal Habashi', class: 'Nursery', group: 'Pre-Primary', date: '2026-02-07' },
    { id: 'ADM012', name: 'Hamza Abdul', class: 'Hifz Class', group: 'Tahfiz', date: '2026-02-09' },
  ];

  // Pagination Logic
  const totalItems = studentList.length;
  const totalPages = Math.ceil(totalItems / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const endIndex = Math.min(startIndex + itemsPerPage, totalItems);
  const currentItems = studentList.slice(startIndex, endIndex);

  const paginate = (pageNumber) => {
    if (pageNumber >= 1 && pageNumber <= totalPages) {
      setCurrentPage(pageNumber);
    }
  };

  const handleExportPDF = () => {
    const doc = new jsPDF();
    const tableColumn = ["Student ID", "Full Name", "Class", "Group", "Admission Date"];
    const tableRows = studentList.map(student => [
      student.id,
      student.name,
      student.class,
      student.group,
      student.date
    ]);

    doc.setFontSize(18);
    doc.text("Admission Report", 14, 22);
    doc.setFontSize(11);
    doc.setTextColor(100);
    doc.text(`Generated on: ${new Date().toLocaleDateString()}`, 14, 30);

    doc.autoTable({
      head: [tableColumn],
      body: tableRows,
      startY: 35,
      styles: { fontSize: 9, cellPadding: 3 },
      headStyles: { fillStyle: '#00bd7f', textColor: [255, 255, 255] },
      alternateRowStyles: { fillColor: [248, 250, 252] },
    });

    doc.save(`Admission_Report_${new Date().getTime()}.pdf`);
  };

  const handleExportExcel = () => {
    const worksheet = XLSX.utils.json_to_sheet(studentList);
    const workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, worksheet, "Admission Report");
    XLSX.writeFile(workbook, `Admission_Report_${new Date().getTime()}.xlsx`);
  };

  return (
    <div className="min-h-screen bg-[#f8fafc] p-4 md:p-4 animate-in fade-in duration-700">
      <div className="max-w-[1600px] mx-auto space-y-8">
        
        {/* Header Section */}
        <div className="bg-white rounded-[20px] border-2 border-slate-100  shadow-sm flex flex-col lg:flex-row justify-between items-center gap-6 relative overflow-hidden p-5">
         
          
          <div className="flex items-center gap-2 relative z-10">
           <FileText className="w-8 h-8" />
               <h1 className="text-[18px] md:text-3xl font-black text-slate-800 tracking-tight ">Admission Report</h1>
             
           
          </div>

         <Link to={'/admin/admission/create'}><button className="px-6 py-2  text-[16px] text-white cursor-pointer bg-[#00bd7f] hover:text-white transition-all rounded-[8px] shadow-sm ">New Admission</button> </Link>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
           {stats.map((stat, idx) => (
               <div className="bg-white rounded-2xl border-1 border-gray-100 shadow-lg p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-xs font-bold text-slate-500 uppercase mb-1">
              {stat.label}
              </p>
              <p className="text-3xl font-black text-yellow-600">
                {stat.value}
              </p>
            </div>
            <div className="w-12 h-12 bg-yellow-100 dark:bg-yellow-900/20 rounded-xl flex items-center justify-center">
                       <Users className="w-6 h-6 text-yellow-600" />
                       {
                          stat.status ==="approved"
                       }
            </div>
          </div>
        </div>
           ))}
           </div>
           
          

              {/* Filters & Search */}
        <div className="bg-white p-6 rounded-[20px] border-2 border-slate-100 shadow-sm flex flex-col xl:flex-row gap-6 items-start xl:items-center justify-between">
           <SelectInputField title={'Year'} type={'year'} />
                  <SelectInputField title={'Class'}/>
                  <SelectInputField title={'Groupe'}/>
                
                  <button className="px-6 py-2  text-[16px] text-white cursor-pointer bg-[#00bd7f] hover:text-white transition-all rounded-[8px] shadow-sm lg:mt-[25px]">Search</button>
        </div>

    

        {/* Individual Student Records */}
        <div className="bg-white rounded-[20px] border-2 border-slate-100 shadow-sm overflow-hidden">
                  <div>
                      <div className="p-5 border-b-2 border-slate-100 flex justify-between items-center">
              <h2 className="text-xl font-black text-slate-800 uppercase tracking-tight flex items-center gap-3">
                <Users className="w-6 h-6 text-[#00bd7f]" />
                Detailed Records
              </h2>
                 
                  
                   <div className="flex flex-wrap gap-4 w-full lg:w-auto relative z-10">
             <button 
                onClick={handleExportPDF}
                className="flex-1 lg:flex-none px-6 py-4 bg-white text-slate-600 rounded-2xl font-black hover:bg-slate-50 transition-all flex items-center justify-center gap-3 border-2 border-slate-100 uppercase tracking-widest text-[10px] cursor-pointer"
              >
               <Printer className="w-4 h-4" />
               PDF
            </button>
            <button 
                onClick={handleExportExcel}
                className="flex-1 lg:flex-none px-6 py-4 bg-white text-slate-600 rounded-2xl font-black hover:bg-slate-50 transition-all flex items-center justify-center gap-3 border-2 border-slate-100 uppercase tracking-widest text-[10px] cursor-pointer"
              >
               <FileSpreadsheet className="w-4 h-4" />
               Excel
            </button>
            {/* <button className="flex-1 lg:flex-none px-6 py-4 bg-white text-slate-600 rounded-2xl font-black hover:bg-slate-50 transition-all flex items-center justify-center gap-3 border-2 border-slate-100 uppercase tracking-widest text-[10px]">
               <FileJson className="w-4 h-4" />
               CSV
            </button> */}
          </div> </div>
           </div>
           <div className="overflow-x-auto">
              <table className="w-full border-collapse">
                 <thead>
                    <tr className="bg-slate-50/50 border-b-2 border-slate-100 text-[10px] font-black text-slate-400 uppercase tracking-[0.2em]">
                       <th className="px-10 py-3 text-left">Student ID</th>
                       <th className="px-10 py-3 text-left">Full Name</th>
                       <th className="px-10 py-3 text-center">Class / Group</th>
                       <th className="px-10 py-3 text-center">Admission Date</th>
                       <th className="px-10 py-3 text-right">Actions</th>
                    </tr>
                 </thead>
                 <tbody className="divide-y divide-slate-100">
                    {currentItems.map((student, i) => (
                       <tr key={i} className="group hover:bg-slate-50/50 transition-all">
                          <td className="px-10 py-4 font-mono text-xs font-black text-slate-400">{student.id}</td>
                          <td className="px-10 py-4">
                             <div className="flex items-center gap-4">
                                <div className="w-10 h-10 bg-[#00bd7f]/10 rounded-xl flex items-center justify-center font-black text-[#00bd7f]">
                                   {student.name.charAt(0)}
                                </div>
                                <span className="text-sm font-black text-slate-800 uppercase tracking-tight">{student.name}</span>
                             </div>
                          </td>
                          <td className="px-10 py-4 text-center">
                             <div className="inline-flex flex-col">
                                <span className="text-xs font-black text-slate-700 uppercase">{student.class}</span>
                                <span className="text-[10px] font-bold text-slate-400 uppercase">{student.group}</span>
                             </div>
                          </td>
                          <td className="px-10 py-4 text-center font-bold text-slate-500">{student.date}</td>
                          <td className="px-10 py-4 text-right">
                            
                             <Link to={'/admin/student/profile/STU2025001'}> <button className="p-2.5 bg-white border-2 border-slate-100 rounded-xl text-slate-400 hover:text-[#00bd7f] hover:border-[#00bd7f] transition-all">
                                <Eye className="w-4 h-4" />
                             </button></Link>
                          </td>
                       </tr>
                    ))}
                 </tbody>
              </table>
           </div>
           
           {/* Pagination Controls */}
        <div className="bg-white px-6 py-4 border-t-2 border-slate-100 flex flex-col sm:flex-row items-center justify-between gap-4">
          <p className="text-xs font-bold text-slate-500 uppercase tracking-wider">
            Showing <span className="text-slate-900">{totalItems === 0 ? 0 : startIndex + 1}</span> to{" "}
            <span className="text-slate-900">{endIndex}</span> of{" "}
            <span className="text-slate-900">{totalItems}</span> students
          </p>
          <div className="flex items-center gap-3">
            <button
              onClick={() => paginate(currentPage - 1)}
              disabled={currentPage === 1}
              className="px-4 py-2 border-2 border-slate-100 rounded-xl bg-white text-slate-600 hover:bg-[#00bd7f] hover:border-[#00bd7f] hover:text-white disabled:opacity-40 disabled:hover:bg-white disabled:hover:border-slate-100 disabled:hover:text-slate-600 transition-all flex items-center gap-2 group"
            >
              <ChevronLeft className="w-4 h-4 group-hover:-translate-x-0.5 transition-transform" />
              <span className="text-[10px] font-black uppercase">Prev</span>
            </button>

            <div className="flex items-center gap-1.5">
              {[...Array(totalPages)].map((_, i) => (
                <button
                  key={i + 1}
                  onClick={() => paginate(i + 1)}
                  className={`w-9 h-9 rounded-xl text-xs font-black transition-all border-2 
                    ${currentPage === i + 1 
                      ? "bg-[#00bd7f] border-[#00bd7f] text-white shadow-lg shadow-emerald-100" 
                      : "bg-white border-slate-100 text-slate-500 hover:border-[#00bd7f] hover:text-[#00bd7f]"
                    }
                  `}
                >
                  {i + 1}
                </button>
              ))}
            </div>

            <button
              onClick={() => paginate(currentPage + 1)}
              disabled={currentPage === totalPages}
              className="px-4 py-2 border-2 border-slate-100 rounded-xl bg-white text-slate-600 hover:bg-[#00bd7f] hover:border-[#00bd7f] hover:text-white disabled:opacity-40 disabled:hover:bg-white disabled:hover:border-slate-100 disabled:hover:text-slate-600 transition-all flex items-center gap-2 group"
            >
              <span className="text-[10px] font-black uppercase">Next</span>
              <ChevronRight className="w-4 h-4 group-hover:translate-x-0.5 transition-transform" />
            </button>
          </div>
        </div>
        </div>
      </div>
    </div>
  );
};

export default AdmissionReports;
