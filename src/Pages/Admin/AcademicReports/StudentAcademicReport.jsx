import React, { useState, useEffect } from 'react';
import { 
  Users, 
  User, 
  Search, 
  Filter,
  Printer,
  Download,
  Share2,
  Save,
  BarChart2
} from 'lucide-react';
import { useTranslation } from 'react-i18next';
import axiosInstance from '../../../api/axiosInstance';
import SelectInputField from '../../../components/SelectInputField';
import InputField from '../../../components/InputField';
import { toast } from 'react-hot-toast';

const StudentAcademicReport = () => {
  const { t } = useTranslation();
  const [activeTab, setActiveTab] = useState('single'); // 'single' or 'class'
  const [loading, setLoading] = useState(false);
  const [showReport, setShowReport] = useState(false);
  const [isFilterModalOpen, setIsFilterModalOpen] = useState(false);

  // Filters State
  const [studentId, setStudentId] = useState('');
  const [classId, setClassId] = useState('');
  const [sectionId, setSectionId] = useState('');
  const [examId, setExamId] = useState('');

  // Dropdown Data
  const [classes, setClasses] = useState([]);
  const [sections, setSections] = useState([]);
  const [exams, setExams] = useState([]);

  // Report Data
  const [singleReport, setSingleReport] = useState([]);
  const [classReport, setClassReport] = useState([]);
  const [subjects, setSubjects] = useState([]); 
  const [classStudents, setClassStudents] = useState([]);

  useEffect(() => {
    fetchDropdowns();
  }, []);

  const fetchDropdowns = async () => {
    try {
      const [classRes, sectionRes, examRes] = await Promise.all([
        axiosInstance.get('/v1/classes').catch(() => ({ data: { data: [] } })),
        axiosInstance.get('/v1/sections').catch(() => ({ data: { data: [] } })),
        axiosInstance.get('/v1/exam-names').catch(() => ({ data: { data: [] } }))
      ]);

      if (classRes.data?.data) setClasses(classRes.data.data.map(c => ({ value: c._id, label: c.name })));
      if (sectionRes.data?.data) setSections(sectionRes.data.data.map(s => ({ value: s._id, label: s.name })));
      if (examRes.data?.data) setExams(examRes.data.data.map(e => ({ value: e._id, label: e.name })));
    } catch (err) {
      console.error("Failed to fetch dropdowns", err);
    }
  };

  const handleFilter = async () => {
    setLoading(true);
    setIsFilterModalOpen(false);
    
    try {
      if (activeTab === 'single') {
        if (!studentId) {
          toast.error("Please enter Student ID");
          setLoading(false);
          return;
        }
        
        let url = `/v1/academic-reports/student/${studentId}`;
        if (examId) url += `?exam_id=${examId}`;
        
        const res = await axiosInstance.get(url);
        if (res.data?.success) {
          setSingleReport(res.data.data);
          setShowReport(true);
        } else {
          toast.error(res.data?.message || "Failed to fetch report");
          setShowReport(false);
        }
      } else {
        if (!classId) {
          toast.error("Please select a class");
          setLoading(false);
          return;
        }
        
        const params = new URLSearchParams();
        params.append('class_id', classId);
        if (sectionId) params.append('section_id', sectionId);
        if (examId) params.append('exam_id', examId);
        
        const res = await axiosInstance.get(`/v1/academic-reports?${params.toString()}`);
        if (res.data?.success) {
          const reports = res.data.data;
          setClassReport(reports);
          
          // Process data for class grid
          const uniqueSubjects = [...new Set(reports.map(item => item.subject_id?.name || item.subject_id || 'Unknown Subject'))];
          const studentMap = {};
          
          reports.forEach(report => {
            const sid = report.student_id?.name || report.student_id || 'Unknown Student';
            if (!studentMap[sid]) {
              studentMap[sid] = { name: sid, marks: {} };
            }
            const subName = report.subject_id?.name || report.subject_id || 'Unknown Subject';
            studentMap[sid].marks[subName] = report.marks_obtained;
          });
          
          setSubjects(uniqueSubjects);
          setClassStudents(Object.values(studentMap));
          setShowReport(true);
        } else {
          toast.error(res.data?.message || "Failed to fetch report");
          setShowReport(false);
        }
      }
    } catch (error) {
      console.error(error);
      toast.error("Error fetching reports");
      setShowReport(false);
    } finally {
      setLoading(false);
    }
  };

  const resetFilters = () => {
    setStudentId('');
    setClassId('');
    setSectionId('');
    setExamId('');
    setShowReport(false);
    setIsFilterModalOpen(false);
  };

  return (
    <div className="p-6 bg-gray-50/50 min-h-screen space-y-6">
      {/* Header Section */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-gray-800">{t('student_academic_report_page.title', 'Academic Reports')}</h1>
        </div>
        
        <div className="flex items-center gap-4">
          {/* Tabs Section */}
          <div className="bg-white p-1 rounded-2xl flex w-fit border border-gray-100 shadow-sm">
            <button
              onClick={() => { setActiveTab('single'); setShowReport(false); }}
              className={`flex items-center gap-2 px-6 py-2.5 rounded-xl transition-all font-medium ${
                activeTab === 'single'
                  ? 'bg-[#00315e] text-white shadow-md'
                  : 'text-gray-500 hover:text-gray-700'
              }`}
            >
              <User size={18} />
              {t('student_academic_report_page.single_student', 'Single Student')}
            </button>
            <button
              onClick={() => { setActiveTab('class'); setShowReport(false); }}
              className={`flex items-center gap-2 px-6 py-2.5 rounded-xl transition-all font-medium ${
                activeTab === 'class'
                  ? 'bg-[#00315e] text-white shadow-md'
                  : 'text-gray-500 hover:text-gray-700'
              }`}
            >
              <Users size={18} />
              {t('student_academic_report_page.class_overview', 'Class Overview')}
            </button>
          </div>

          {/* Filter Button */}
          <div className="relative">
            <button
              onClick={() => setIsFilterModalOpen(!isFilterModalOpen)}
              className="px-6 py-2.5 bg-white border border-gray-200 text-[#00315e] font-bold rounded-xl cursor-pointer flex items-center gap-2 hover:bg-gray-50 transition-all shadow-sm"
            >
              <Filter className="h-4 w-4" /> Filter
            </button>
            
            {/* Filter Modal */}
            {isFilterModalOpen && (
              <div className="absolute top-[50px] right-0 z-[100] flex flex-col gap-3 bg-white border border-gray-200 p-5 rounded-2xl shadow-xl w-[320px]">
                <h3 className="font-bold text-gray-700 mb-2 border-b pb-2">Filter Reports</h3>
                
                {activeTab === 'single' ? (
                  <InputField
                    title={'Student ID'}
                    placeholder={'Enter Student ID'}
                    value={studentId}
                    setValue={setStudentId}
                  />
                ) : (
                  <>
                    <SelectInputField
                      title={'Class'}
                      options={[{ value: '', label: 'Select Class' }, ...classes]}
                      value={classId}
                      setValue={setClassId}
                    />
                    <SelectInputField
                      title={'Section'}
                      options={[{ value: '', label: 'Select Section' }, ...sections]}
                      value={sectionId}
                      setValue={setSectionId}
                    />
                  </>
                )}
                
                <SelectInputField
                  title={'Exam Term'}
                  options={[{ value: '', label: 'Select Exam (Optional)' }, ...exams]}
                  value={examId}
                  setValue={setExamId}
                />

                <div className="flex items-center justify-end gap-3 mt-4">
                  <button
                    onClick={resetFilters}
                    className="px-4 py-2 bg-rose-50 text-rose-600 font-bold rounded-lg hover:bg-rose-100 transition-colors"
                  >
                    Reset
                  </button>
                  <button
                    onClick={handleFilter}
                    disabled={loading}
                    className="px-6 py-2 bg-[#00315e] text-white font-bold rounded-lg hover:bg-[#00315e]/90 transition-colors flex items-center justify-center min-w-[100px]"
                  >
                    {loading ? <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div> : "Apply"}
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Loading State */}
      {loading && (
        <div className="flex flex-col items-center justify-center py-32">
          <div className="w-12 h-12 border-4 border-[#00315e] border-t-transparent rounded-full animate-spin"></div>
          <p className="text-gray-500 font-bold mt-4 animate-pulse">Fetching Reports...</p>
        </div>
      )}

      {/* Report Display */}
      {!loading && activeTab === 'single' && (
        showReport ? (
          <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-700">
            {/* Student Profile Overview */}
            <div className="bg-white p-6 rounded-3xl border border-gray-100 shadow-sm flex flex-col md:flex-row items-center gap-6 relative">
              <div className="w-16 h-16 bg-blue-50 rounded-full flex items-center justify-center text-[#00315e] shrink-0 overflow-hidden border-2 border-white shadow-sm">
                <div className="w-full h-full bg-[#00315e] flex items-center justify-center">
                   <User size={32} className="text-white" />
                </div>
              </div>
              <div className="flex-1 text-center md:text-left">
                <h2 className="text-lg font-bold text-gray-800">
                  {singleReport.length > 0 ? (singleReport[0].student_id?.name || singleReport[0].student_id || studentId) : studentId}
                </h2>
                <div className="flex flex-col md:flex-row md:items-center gap-x-4 gap-y-1 mt-1">
                  <span className="text-sm font-medium text-gray-500">Student ID: {studentId}</span>
                </div>
              </div>
            </div>

            {/* Student Report Grid Section */}
            <div className="bg-white rounded-2xl border border-gray-200 shadow-sm overflow-hidden">
               <div className="px-6 py-4 border-b border-gray-100 flex items-center justify-between bg-gray-50/30">
                  <h3 className="font-bold text-gray-700">{t('student_academic_report_page.student_report', 'Student Report')}</h3>
                  <div className="flex items-center gap-3">
                    <button title={t('common.save', 'Save')} className="p-1.5 text-gray-500 hover:text-[#00315e] transition-colors">
                      <Save size={18} />
                    </button>
                    <button title={t('common.print', 'Print')} className="p-1.5 text-gray-500 hover:text-[#00315e] transition-colors">
                      <Printer size={18} />
                    </button>
                  </div>
               </div>
               
               <div className="overflow-x-auto">
                 {singleReport.length > 0 ? (
                 <table className="w-full border-collapse">
                   <thead>
                     <tr>
                       <th className="border-b border-gray-200 p-4 bg-gray-50/50 text-left font-bold text-gray-600">Subject</th>
                       <th className="border-b border-gray-200 p-4 bg-gray-50/50 text-center font-bold text-gray-600">Full Mark</th>
                       <th className="border-b border-gray-200 p-4 bg-gray-50/50 text-center font-bold text-gray-600">Marks Obtained</th>
                       <th className="border-b border-gray-200 p-4 bg-gray-50/50 text-center font-bold text-gray-600">Grade</th>
                       <th className="border-b border-gray-200 p-4 bg-gray-50/50 text-center font-bold text-gray-600">Remarks</th>
                     </tr>
                   </thead>
                   <tbody>
                     {singleReport.map((report, idx) => (
                       <tr key={idx} className="hover:bg-gray-50/50 transition-colors">
                         <td className="border-b border-gray-100 p-4 font-bold text-gray-800">
                           {report.subject_id?.name || report.subject_id || 'N/A'}
                         </td>
                         <td className="border-b border-gray-100 p-4 text-center text-gray-600 font-medium">
                           {report.total_marks || '-'}
                         </td>
                         <td className="border-b border-gray-100 p-4 text-center">
                           <span className="bg-[#00315e]/10 text-[#00315e] px-3 py-1 rounded-md font-bold">
                             {report.marks_obtained || '-'}
                           </span>
                         </td>
                         <td className="border-b border-gray-100 p-4 text-center">
                           <span className={`font-bold ${report.grade === 'F' ? 'text-rose-500' : 'text-emerald-500'}`}>
                             {report.grade || '-'}
                           </span>
                         </td>
                         <td className="border-b border-gray-100 p-4 text-center text-gray-500 text-sm">
                           {report.remarks || '-'}
                         </td>
                       </tr>
                     ))}
                   </tbody>
                 </table>
                 ) : (
                   <div className="p-10 text-center text-gray-500 font-medium">
                     No academic reports found for this student.
                   </div>
                 )}
               </div>
            </div>
          </div>
        ) : (
          <div className="flex flex-col items-center justify-center py-32 space-y-4 opacity-40">
            <div className="w-20 h-20 bg-gray-100 rounded-full flex items-center justify-center text-gray-400">
              <Search size={32} />
            </div>
            <p className="text-gray-500 font-bold uppercase tracking-widest text-sm">Please filter to view reports</p>
          </div>
        )
      )}

      {!loading && activeTab === 'class' && (
        showReport ? (
          <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-700">
            {/* Class Overview Header */}
            <div className="bg-[#00315e] p-6 rounded-3xl text-white shadow-lg relative overflow-hidden">
               <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-4">
                  <div>
                    <h2 className="text-xl font-black uppercase tracking-tight">Class Overview</h2>
                    <p className="text-sm font-medium opacity-90 mt-1">Consolidated view of all students' marks</p>
                  </div>
                  <div className="flex gap-4">
                    <div className="bg-white/20 px-4 py-2 rounded-2xl backdrop-blur-md">
                      <p className="text-[10px] font-black uppercase tracking-widest opacity-70">Students with marks</p>
                      <p className="text-lg font-bold">{classStudents.length}</p>
                    </div>
                  </div>
               </div>
               <BarChart2 className="absolute -right-4 -bottom-4 w-32 h-32 opacity-10 -rotate-12" />
            </div>

            {/* Class Report Grid Section */}
            <div className="bg-white rounded-2xl border border-gray-200 shadow-sm overflow-hidden">
               <div className="px-6 py-4 border-b border-gray-100 flex items-center justify-between bg-gray-50/30">
                  <h3 className="font-bold text-gray-700 uppercase tracking-tight text-sm">Performance Grid</h3>
                  <div className="flex items-center gap-3">
                    <button title="Download" className="p-2 text-gray-400 hover:text-[#00315e] transition-all hover:scale-110">
                      <Download size={20} />
                    </button>
                    <button title="Share" className="p-2 text-gray-400 hover:text-[#00315e] transition-all hover:scale-110">
                      <Share2 size={20} />
                    </button>
                  </div>
               </div>
               
               <div className="overflow-x-auto">
                 {classStudents.length > 0 ? (
                 <table className="w-full border-collapse">
                   <thead>
                     <tr>
                       <th className="border-b border-r border-gray-200 p-4 bg-gray-50/50 text-left font-bold text-gray-600 sticky left-0 z-10 w-48">
                         Student
                       </th>
                       {subjects.map((sub, idx) => (
                         <th key={idx} className="border-b border-gray-200 p-4 bg-gray-50/50 text-center min-w-[120px]">
                           <div className="px-3 py-1 bg-white border border-gray-200 rounded-md text-[11px] font-black uppercase tracking-widest text-gray-600">
                             {sub}
                           </div>
                         </th>
                       ))}
                     </tr>
                   </thead>
                   <tbody>
                     {classStudents.map((student, idx) => (
                       <tr key={idx} className="hover:bg-blue-50/30 transition-colors">
                         <td className="border-b border-r border-gray-200 p-4 bg-white/50 sticky left-0 z-10 font-bold text-gray-800 text-sm">
                           {student.name}
                         </td>
                         {subjects.map((sub, subIdx) => {
                           const mark = student.marks[sub];
                           return (
                             <td key={subIdx} className="border-b border-gray-100 p-4 text-center">
                               {mark !== undefined ? (
                                 <span className="font-bold text-[#00315e]">{mark}</span>
                               ) : (
                                 <span className="text-gray-300">-</span>
                               )}
                             </td>
                           );
                         })}
                       </tr>
                     ))}
                   </tbody>
                 </table>
                 ) : (
                   <div className="p-10 text-center text-gray-500 font-medium">
                     No reports found for the selected class/section.
                   </div>
                 )}
               </div>
            </div>
          </div>
        ) : (
          <div className="flex flex-col items-center justify-center py-32 space-y-4 opacity-40">
            <div className="w-20 h-20 bg-gray-100 rounded-full flex items-center justify-center text-gray-400">
              <Users size={32} />
            </div>
            <p className="text-gray-500 font-bold uppercase tracking-widest text-sm">Please select a class to view overview</p>
          </div>
        )
      )}

    </div>
  );
};

export default StudentAcademicReport;
