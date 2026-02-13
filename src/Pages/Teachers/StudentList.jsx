import { useState } from "react";
import { 
  Users, 
  Search, 
  Filter, 
  Mail, 
  Eye
} from "lucide-react";
import { useTranslation } from "react-i18next";

const StudentList = () => {
  const [searchTerm, setSearchTerm] = useState("");
  const { t } = useTranslation();

  // Mock Student Data
  const students = [
    { id: "ST-2024-001", name: "Abdullah Al Mamun", class: "Hifz", section: "A", roll: "01", guardian: "Abdul Malek", phone: "+8801712345678", status: "Active" },
    { id: "ST-2024-002", name: "Muhammad Yasin", class: "Hifz", section: "A", roll: "02", guardian: "Kabir Hossain", phone: "+8801812345678", status: "Active" },
    { id: "ST-2024-003", name: "Omar Faruk", class: "Hifz", section: "A", roll: "03", guardian: "Nurul Islam", phone: "+8801912345678", status: "Inactive" },
    { id: "ST-2024-004", name: "Sakib Al Hasan", class: "Kitab", section: "B", roll: "01", guardian: "Jalal Uddin", phone: "+8801612345678", status: "Active" },
    { id: "ST-2024-005", name: "Tamim Iqbal", class: "Kitab", section: "B", roll: "02", guardian: "Mokarram Hossain", phone: "+8801512345678", status: "Active" },
  ];

  return (
    <div className="min-h-screen bg-slate-50/50 p-4 md:p-8 animate-in fade-in duration-500">
      <div className="max-w-[1600px] mx-auto space-y-6">
        
        {/* Header */}
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 bg-white p-6 rounded-[20px] border border-slate-200 shadow-sm">
           <div className="flex items-center gap-4">
              <div className="w-12 h-12 bg-[#00bd7f]/10 rounded-xl flex items-center justify-center border border-[#00bd7f]/20">
                 <Users className="w-6 h-6 text-[#00bd7f]" />
              </div>
              <div>
                 <h1 className="text-xl md:text-2xl font-black text-slate-800 tracking-tight">{t('teacher.students.student_directory')}</h1>
                
              </div>
           </div>

           <div className="flex flex-col sm:flex-row gap-3 w-full md:w-auto">
              <div className="relative group">
                 <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400 group-focus-within:text-[#00bd7f] transition-colors" />
                 <input 
                    type="text" 
                    placeholder={t('teacher.students.search_students')} 
                    className="w-full sm:w-64 pl-10 pr-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#00bd7f]/20 focus:border-[#00bd7f] transition-all text-sm font-medium"
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                 />
              </div>
              <button className="flex items-center justify-center gap-2 px-4 py-2.5 bg-white border border-slate-200 hover:border-slate-300 hover:bg-slate-50 text-slate-600 rounded-xl transition-all text-sm font-bold active:scale-95">
                 <Filter className="w-4 h-4" />
                 <span>{t('teacher.students.all_classes')}</span>
              </button>
           </div>
        </div>

        {/* Student Table */}
        <div className="bg-white rounded-[20px] border border-slate-200 shadow-sm overflow-hidden">
           <div className="overflow-x-auto">
              <table className="w-full min-w-[1000px]">
                 <thead>
                    <tr className="bg-slate-50 border-b border-slate-200">
                       <th className="px-6 py-4 text-left text-[10px] font-black text-slate-500 uppercase tracking-widest">{t('teacher.students.id')}</th>
                       <th className="px-6 py-4 text-left text-[10px] font-black text-slate-500 uppercase tracking-widest">{t('teacher.students.student_name')}</th>
                       <th className="px-6 py-4 text-left text-[10px] font-black text-slate-500 uppercase tracking-widest">{t('teacher.students.class_section')}</th>
                       <th className="px-6 py-4 text-left text-[10px] font-black text-slate-500 uppercase tracking-widest">{t('teacher.students.roll_no')}</th>
                       <th className="px-6 py-4 text-left text-[10px] font-black text-slate-500 uppercase tracking-widest">{t('teacher.students.guardian_phone')}</th>
                       <th className="px-6 py-4 text-left text-[10px] font-black text-slate-500 uppercase tracking-widest">{t('teacher.students.status')}</th>
                       <th className="px-6 py-4 text-right text-[10px] font-black text-slate-500 uppercase tracking-widest">{t('teacher.students.actions')}</th>
                    </tr>
                 </thead>
                 <tbody className="divide-y divide-slate-100">
                    {students.map((student, index) => (
                       <tr key={index} className="group hover:bg-slate-50/50 transition-colors">
                          <td className="px-6 py-4">
                             <span className="font-mono text-xs font-bold text-slate-500 bg-slate-100 px-2 py-1 rounded-md">{student.id}</span>
                          </td>
                          <td className="px-6 py-4">
                             <div className="flex items-center gap-3">
                                <div className="w-8 h-8 rounded-full bg-indigo-50 flex items-center justify-center text-indigo-600 font-bold text-xs ring-2 ring-white shadow-sm">
                                   {student.name.charAt(0)}
                                </div>
                                <span className="font-bold text-slate-700 text-sm group-hover:text-[#00bd7f] transition-colors">{student.name}</span>
                             </div>
                          </td>
                          <td className="px-6 py-4">
                             <span className="text-xs font-bold text-slate-600">{student.class} <span className="text-slate-400">•</span> {student.section}</span>
                          </td>
                          <td className="px-6 py-4">
                             <span className="text-xs font-bold text-slate-600">#{student.roll}</span>
                          </td>
                          <td className="px-6 py-4">
                             <div className="flex flex-col">
                                <span className="text-xs font-bold text-slate-700">{student.guardian}</span>
                                <span className="text-[10px] font-medium text-slate-400">{student.phone}</span>
                             </div>
                          </td>
                          <td className="px-6 py-4">
                             <span className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-[10px] font-black uppercase tracking-wide border ${
                                student.status === 'Active' 
                                   ? 'bg-emerald-50 text-emerald-600 border-emerald-100' 
                                   : 'bg-red-50 text-red-600 border-red-100'
                             }`}>
                                <span className={`w-1.5 h-1.5 rounded-full ${student.status === 'Active' ? 'bg-emerald-500' : 'bg-red-500'}`}></span>
                                {student.status === 'Active' ? t('teacher.students.active') : t('teacher.students.inactive')}
                             </span>
                          </td>
                          <td className="px-6 py-4 text-right">
                             <div className="flex items-center justify-end gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                                <button className="p-2 text-slate-400 hover:text-[#00bd7f] hover:bg-[#00bd7f]/5 rounded-lg transition-all" title={t('teacher.students.view_profile')}>
                                   <Eye className="w-4 h-4" />
                                </button>
                                <button className="p-2 text-slate-400 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition-all" title={t('teacher.students.message_guardian')}>
                                   <Mail className="w-4 h-4" />
                                </button>
                             </div>
                          </td>
                       </tr>
                    ))}
                 </tbody>
              </table>
           </div>
        </div>
      </div>
    </div>
  );
};

export default StudentList;
