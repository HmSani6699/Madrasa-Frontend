import React, { useState } from 'react';
import { 
  Users, 
  User, 
  Calendar, 
  Search, 
  TrendingUp, 
  BookOpen, 
  Clock,
  Filter,
  BarChart2,
  ChevronRight,
  Download,
  Share2,
  Printer,
  Save
} from 'lucide-react';
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  AreaChart,
  Area,
  Radar,
  RadarChart,
  PolarGrid,
  PolarAngleAxis,
  PolarRadiusAxis,
  Legend,
  BarChart,
  Bar
} from 'recharts';
import { useTranslation } from 'react-i18next';
import SelectInputField from '../../components/SelectInputField';
import InputField from '../../components/InputField';

const StudentAcademicReport = () => {
  const { t } = useTranslation();
  const [activeTab, setActiveTab] = useState('single'); // 'single' or 'class'
  const [loading, setLoading] = useState(false);
  const [showReport, setShowReport] = useState(false);
  const [studentId, setStudentId] = useState('');
  const [startDate, setStartDate] = useState('');
  const [endDate, setEndDate] = useState('');

  const setDateRange = (days) => {
    const end = new Date();
    const start = new Date();
    start.setDate(end.getDate() - days);
    
    setEndDate(end.toISOString().split('T')[0]);
    setStartDate(start.toISOString().split('T')[0]);
  };

  const handleFilter = () => {
    if (activeTab === 'single') {
      setLoading(true);
      // Simulate API call
      setTimeout(() => {
        setLoading(false);
        setShowReport(true);
      }, 1000);
    }
  };

  // Mock data for individual student performance
  const studentData = [
    { date: '2024-01-01', score: 65, readingTime: 40, status: 'Present' },
    { date: '2024-01-02', score: 68, readingTime: 45, status: 'Present' },
    { date: '2024-01-03', score: 72, readingTime: 50, status: 'Present' },
    { date: '2024-01-04', score: 70, readingTime: 55, status: 'Present' },
    { date: '2024-01-05', score: 75, readingTime: 60, status: 'Present' },
    { date: '2024-01-06', score: 82, readingTime: 70, status: 'Present' },
    { date: '2024-01-07', score: 85, readingTime: 75, status: 'Present' },
  ];

  const subjectPerformanceAggregated = [
    { name: t('subjects.bangla'), avgScore: 88, consistency: '6/7', readingStatus: 'Regular', trend: '+5%' },
    { name: t('subjects.english'), avgScore: 82, consistency: '5/7', readingStatus: 'Improving', trend: '+2%' },
    { name: t('subjects.math'), avgScore: 75, consistency: '7/7', readingStatus: 'Regular', trend: '-3%' },
    { name: t('subjects.arabic_grammar'), avgScore: 92, consistency: '7/7', readingStatus: 'Excellent', trend: '+8%' },
    { name: t('subjects.quran'), avgScore: 96, consistency: '7/7', readingStatus: 'Excellent', trend: '+1%' },
  ];

  const subjectPerformance = [
    { subject: t('subjects.quran'), score: 90, fullMark: 100 },
    { subject: t('subjects.arabic'), score: 75, fullMark: 100 },
    { subject: t('subjects.fiqh'), score: 85, fullMark: 100 },
    { subject: t('subjects.hadith'), score: 80, fullMark: 100 },
    { subject: t('subjects.english'), score: 65, fullMark: 100 },
    { subject: t('subjects.math'), score: 70, fullMark: 100 },
  ];

  const classPerformance = [
    { section: 'A', avgScore: 78, attendance: 92 },
    { section: 'B', avgScore: 72, attendance: 88 },
    { section: 'C', avgScore: 85, attendance: 95 },
    { section: 'D', avgScore: 65, attendance: 82 },
  ];

  return (
    <div className="p-6 bg-gray-50/50 min-h-screen space-y-6">
      {/* Header Section */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-gray-800">{t('student_academic_report_page.title')}</h1>
        
        </div>
        {/* Tabs Section */}
      <div className="bg-white p-1 rounded-2xl flex w-fit border border-gray-100 shadow-sm">
        <button
          onClick={() => setActiveTab('single')}
          className={`flex items-center gap-2 px-6 py-2.5 rounded-xl transition-all font-medium ${
            activeTab === 'single'
              ? 'bg-[#00bd7e] text-white shadow-md'
              : 'text-gray-500 hover:text-gray-700'
          }`}
        >
          <User size={18} />
          {t('student_academic_report_page.single_student')}
        </button>
        <button
          onClick={() => setActiveTab('class')}
          className={`flex items-center gap-2 px-6 py-2.5 rounded-xl transition-all font-medium ${
            activeTab === 'class'
              ? 'bg-[#00bd7e] text-white shadow-md'
              : 'text-gray-500 hover:text-gray-700'
          }`}
        >
          <Users size={18} />
          {t('student_academic_report_page.class_overview')}
        </button>
      </div>
      </div>

     

      {/* Filters Section - Mockup Pill Style */}
      <div className="bg-white p-3 rounded-[3rem] border border-gray-200 shadow-sm">
        <div className="flex flex-col lg:flex-row items-center gap-3">
          {activeTab === 'single' ? (
            <div className="relative flex-1 min-w-[200px]">
              <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
              <input
                type="text"
                placeholder={t('student_academic_report_page.student_placeholder')}
                value={studentId}
                onChange={(e) => setStudentId(e.target.value)}
                className="w-full pl-11 pr-4 py-3 bg-gray-100/50 border-none rounded-full focus:ring-2 focus:ring-[#00bd7e]/20 transition-all text-sm font-medium"
              />
            </div>
          ) : (
            <div className="flex-1 min-w-[200px]">
               <select className="w-full px-6 py-3 bg-gray-100/50 border-none rounded-full focus:ring-2 focus:ring-[#00bd7e]/20 transition-all text-sm font-medium appearance-none cursor-pointer">
                  <option>{t('student_academic_report_page.class')}</option>
                  <option>{t('common.class')} 6</option>
                  <option>{t('common.class')} 7</option>
                  <option>{t('common.class')} 8</option>
               </select>
            </div>
          )}
          
          <div className="flex flex-col md:flex-row items-center gap-3 w-full lg:w-auto">
            <div className="relative group w-full md:w-48">
              <input 
                type="date"
                value={startDate}
                onChange={(e) => setStartDate(e.target.value)}
                className="w-full px-6 py-3 bg-gray-100/50 border-none rounded-full text-sm font-medium focus:ring-2 focus:ring-[#00bd7e]/20 transition-all appearance-none cursor-pointer text-gray-500"
              />
              {!startDate && <span className="absolute left-6 top-1/2 -translate-y-1/2 pointer-events-none text-sm font-medium text-gray-500">{t('student_academic_report_page.start_date')}</span>}
            </div>
            
            <div className="relative group w-full md:w-48">
              <input 
                type="date"
                value={endDate}
                onChange={(e) => setEndDate(e.target.value)}
                className="w-full px-6 py-3 bg-gray-100/50 border-none rounded-full text-sm font-medium focus:ring-2 focus:ring-[#00bd7e]/20 transition-all appearance-none cursor-pointer text-gray-500"
              />
              {!endDate && <span className="absolute left-6 top-1/2 -translate-y-1/2 pointer-events-none text-sm font-medium text-gray-500">{t('student_academic_report_page.end_date')}</span>}
            </div>

            <button
              onClick={handleFilter}
              disabled={loading}
              className={`px-10 py-3 rounded-full transition-all font-bold uppercase tracking-tight text-sm
               ${loading ? 'bg-gray-300 cursor-not-allowed' : 'bg-gray-200 hover:bg-[#00bd7e] hover:text-white text-gray-600'} min-w-[120px]`}
            >
              {loading ? '...' : t('student_academic_report_page.filter')}
            </button>
          </div>
        </div>
      </div>

      {activeTab === 'single' ? (
        showReport ? (
          <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-700">
            {/* Student Profile Overview - Mockup Style */}
            <div className="bg-white p-6 rounded-3xl border border-gray-100 shadow-sm flex flex-col md:flex-row items-center gap-6 relative">
              <div className="w-16 h-16 bg-[#e6f4ef] rounded-full flex items-center justify-center text-[#00bd7e] shrink-0 overflow-hidden border-2 border-white shadow-sm">
                <div className="w-full h-full bg-[#8bc34a] flex items-center justify-center">
                   <User size={32} className="text-white" />
                </div>
              </div>
              <div className="flex-1 text-center md:text-left">
                <h2 className="text-lg font-bold text-gray-800">Muhammad Ibrahim</h2>
                <div className="flex flex-col md:flex-row md:items-center gap-x-4 gap-y-1 mt-1">
                  <span className="text-sm font-medium text-gray-500">ST-2025-001Hifz - {t('common.class')} A</span>
                  <span className="hidden md:block w-1 h-1 bg-gray-300 rounded-full"></span>
                  <span className="text-sm font-medium text-gray-500">{t('student_academic_report_page.guardian')}: Abdul Karim</span>
                </div>
              </div>
            </div>

            {/* Student Report Grid Section */}
            <div className="bg-white rounded-2xl border border-gray-200 shadow-sm overflow-hidden">
               <div className="px-6 py-4 border-b border-gray-100 flex items-center justify-between bg-gray-50/30">
                  <h3 className="font-bold text-gray-700">{t('student_academic_report_page.student_report')}</h3>
                  <div className="flex items-center gap-3">
                    <button title={t('common.save')} className="p-1.5 text-gray-500 hover:text-emerald-500 transition-colors">
                      <Save size={18} />
                    </button>
                    <button title={t('reports_page.consolidated_report')} className="p-1.5 text-gray-500 hover:text-emerald-500 transition-colors">
                      <Printer size={18} />
                    </button>
                  </div>
               </div>
               
               <div className="overflow-x-auto">
                 <table className="w-full border-collapse">
                   <thead>
                     <tr>
                       <th className="border border-gray-200 p-4 w-32 bg-gray-50/50"></th>
                       {['bangla', 'english', 'math', 'arabic'].map((sub) => (
                         <th key={sub} className="border border-gray-200 p-4 bg-white min-w-[120px]">
                           <div className="flex flex-col items-center gap-1">
                             <div className="px-4 py-1.5 border border-gray-200 rounded-md text-sm font-medium min-w-[100px] text-center">
                               {t(`subjects.${sub}`)}
                             </div>
                           </div>
                         </th>
                       ))}
                     </tr>
                   </thead>
                   <tbody>
                     {Array.from({ length: 5 }).map((_, idx) => {
                       const dateObj = new Date(startDate || new Date());
                       dateObj.setDate(dateObj.getDate() + idx);
                       const dateStr = dateObj.toLocaleDateString('en-GB');
                       const dayStr = dateObj.toLocaleDateString('en-US', { weekday: 'long' });
                       
                       return (
                         <tr key={idx}>
                           <td className="border border-gray-200 p-4 text-center bg-gray-50/10">
                             <div className="flex flex-col items-center">
                               <span className="text-[10px] font-bold text-gray-400 uppercase leading-none">{dateStr}</span>
                               <span className="text-[10px] text-gray-300 italic -mt-1">{dayStr}</span>
                             </div>
                           </td>
                           {['bangla', 'english', 'math', 'arabic'].map((sub) => {
                              const isEnglishFail = sub === 'english' && idx === 1;
                              return (
                               <td key={sub} className="border border-gray-200 p-4 text-center group hover:bg-gray-50/30 transition-colors">
                                 <div className="animate-in fade-in duration-500">
                                   <p className="text-sm font-medium text-gray-800">{t(`subjects.${sub}`)}</p>
                                   <p className={`text-sm ${isEnglishFail ? 'text-rose-500' : 'text-gray-600'}`}>
                                     {isEnglishFail ? t('common.not_good') : t('common.good')}
                                   </p>
                                 </div>
                               </td>
                              );
                           })}
                         </tr>
                       );
                     })}
                   </tbody>
                 </table>
               </div>
            </div>
          </div>
        ) : (
          <div className="flex flex-col items-center justify-center py-20 space-y-4 opacity-40">
            <div className="w-20 h-20 bg-gray-100 rounded-full flex items-center justify-center text-gray-400">
              <Search size={32} />
            </div>
            <p className="text-gray-500 font-bold uppercase tracking-widest text-sm">{t('student_academic_report_page.filter_msg')}</p>
          </div>
        )
      ) : (
        showReport ? (
          <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-700">
            {/* Class Overview Header */}
            <div className="bg-[#00bd7e] p-6 rounded-3xl text-white shadow-lg relative overflow-hidden">
               <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-4">
                  <div>
                    <h2 className="text-xl font-black uppercase tracking-tight">{t('common.class')} 8 - {t('common.section')} A {t('student_academic_report_page.class_overview')}</h2>
                    <p className="text-sm font-medium opacity-90 mt-1">{t('student_academic_report_page.academic_summary')}</p>
                  </div>
                  <div className="flex gap-4">
                    <div className="bg-white/20 px-4 py-2 rounded-2xl backdrop-blur-md">
                      <p className="text-[10px] font-black uppercase tracking-widest opacity-70">{t('student_academic_report_page.total_students')}</p>
                      <p className="text-lg font-bold">42</p>
                    </div>
                    <div className="bg-white/20 px-4 py-2 rounded-2xl backdrop-blur-md">
                      <p className="text-[10px] font-black uppercase tracking-widest opacity-70">{t('student_academic_report_page.avg_attendance')}</p>
                      <p className="text-lg font-bold">94%</p>
                    </div>
                  </div>
               </div>
               <BarChart2 className="absolute -right-4 -bottom-4 w-32 h-32 opacity-10 -rotate-12" />
            </div>

            {/* Class Report Grid Section */}
            <div className="bg-white rounded-2xl border border-gray-200 shadow-sm overflow-hidden">
               <div className="px-6 py-4 border-b border-gray-100 flex items-center justify-between bg-gray-50/30">
                  <h3 className="font-bold text-gray-700 uppercase tracking-tight text-sm">{t('student_academic_report_page.performance_grid')}</h3>
                  <div className="flex items-center gap-3">
                    <button title={t('common.download')} className="p-2 text-gray-400 hover:text-gray-600 transition-all hover:scale-110">
                      <Download size={20} />
                    </button>
                    <button title={t('common.share')} className="p-2 text-gray-400 hover:text-gray-600 transition-all hover:scale-110">
                      <Share2 size={20} />
                    </button>
                  </div>
               </div>
               
               <div className="overflow-x-auto">
                 <table className="w-full border-collapse">
                   <thead>
                     <tr>
                       <th className="border border-gray-200 p-4 w-32 bg-gray-50/30"></th>
                       {['quran', 'arabic', 'fiqh', 'hadith', 'english', 'math'].map((sub) => (
                         <th key={sub} className="border border-gray-200 p-4 bg-white min-w-[120px]">
                           <div className="px-4 py-1.5 border border-gray-200 rounded-md text-[11px] font-black uppercase tracking-widest text-center text-gray-600">
                             {t(`subjects.${sub}`)}
                           </div>
                         </th>
                       ))}
                     </tr>
                   </thead>
                   <tbody>
                     {Array.from({ length: 5 }).map((_, idx) => {
                       const dateObj = new Date(startDate || new Date());
                       dateObj.setDate(dateObj.getDate() + idx);
                       const dateStr = dateObj.toLocaleDateString('en-GB');
                       const dayStr = dateObj.toLocaleDateString('en-US', { weekday: 'long' });
                       
                       return (
                         <tr key={idx}>
                           <td className="border border-gray-200 p-4 text-center bg-gray-50/10">
                             <div className="flex flex-col items-center">
                               <span className="text-[10px] font-bold text-gray-500 uppercase leading-none">{dateStr}</span>
                               <span className="text-[9px] text-gray-400 italic -mt-1 uppercase tracking-tighter">{dayStr}</span>
                             </div>
                           </td>
                           {['quran', 'arabic', 'fiqh', 'hadith', 'english', 'math'].map((sub) => {
                              const avgVal = 70 + Math.floor(Math.random() * 25);
                              return (
                               <td key={sub} className="border border-gray-200 p-4 text-center group hover:bg-emerald-50/30 transition-colors">
                                  <div className="animate-in zoom-in-95 duration-500">
                                    <p className="text-[10px] font-medium text-gray-400 uppercase tracking-widest mb-1">{t(`subjects.${sub}`)}</p>
                                    <div className="flex flex-col items-center">
                                      <span className={`text-[11px] font-bold ${avgVal > 85 ? 'text-emerald-600' : 'text-amber-600'}`}>
                                        {avgVal}% {t('reports_page.analysis')}
                                      </span>
                                      <div className="w-8 h-1 bg-gray-100 rounded-full mt-1 overflow-hidden">
                                         <div className={`h-full ${avgVal > 85 ? 'bg-emerald-500' : 'bg-amber-500'}`} style={{ width: `${avgVal}%` }}></div>
                                      </div>
                                    </div>
                                  </div>
                               </td>
                              );
                           })}
                         </tr>
                       );
                     })}
                   </tbody>
                 </table>
               </div>
            </div>
          </div>
        ) : (
          <div className="flex flex-col items-center justify-center py-20 space-y-4 opacity-40">
            <div className="w-20 h-20 bg-gray-100 rounded-full flex items-center justify-center text-gray-400">
              <Users size={32} />
            </div>
            <p className="text-gray-500 font-bold uppercase tracking-widest text-sm">{t('student_academic_report_page.overview_msg')}</p>
          </div>
        )
      )}

     
    </div>
  );
};

export default StudentAcademicReport;
