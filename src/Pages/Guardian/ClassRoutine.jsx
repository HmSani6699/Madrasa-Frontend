import { useState } from "react";
import { 
  Calendar, 
  Clock, 
  MapPin, 
  Download, 
  BookOpen, 
  X,
  User
} from "lucide-react";
import jsPDF from "jspdf";
import "jspdf-autotable";
import { useTranslation } from "react-i18next";

const GuardianClassRoutine = () => {
  const [selectedPeriod, setSelectedPeriod] = useState(null);
  const { t } = useTranslation();

  const days = ["Sat", "Sun", "Mon", "Tue", "Wed", "Thu","Fri"];
  const periods = ["08:00 AM - 08:40 AM", "08:45 AM - 09:25 AM", "09:30 AM - 10:10 AM", "10:15 AM - 10:55 AM", "11:00 AM - 11:40 AM", "11:45 AM - 12:25 PM", "12:30 PM - 01:10 PM"];


  // Mock Schedule Data - In real app, fetch from API
  const scheduleData = {
    "Sat": [
      { subject: "Al-Quran", class: "Hifz - Sec A", room: "Hall 01", time: "08:00 AM - 08:40 AM" },
      { subject: "Arabic", class: "Mishkat - Sec B", room: "Room 102", time: "08:45 AM - 09:25 AM" },
      null, // Free period
      { subject: "Fiqh", class: "Hidayah", room: "Main Room", time: "10:15 AM - 10:55 AM" },
    ],
    "Sun": [
      { subject: "Hadith", class: "Dawra", room: "Hall 02", time: "08:00 AM - 08:40 AM" },
      null,
      { subject: "Bangla", class: "Class 8", room: "Room 105", time: "09:30 AM - 10:10 AM" },
    ],
    // ... add more days as needed
  };

  const handleDownloadPDF = () => {
    const doc = new jsPDF({ orientation: 'landscape' });

    doc.setFontSize(18);
    doc.setTextColor(0, 189, 127); // #00bd7f
    doc.text(t('teacher.schedule.my_class_routine'), 14, 15);
    doc.setFontSize(10);
    doc.setTextColor(100);
    doc.text(t('teacher.schedule.academic_weekly_schedule'), 14, 22);

    const tableColumn = ["Day/Time", ...periods];
    const tableRows = [];

    days.forEach(day => {
      const rowData = [day];
      const daySchedule = scheduleData[day] || [];
      
      periods.forEach((_, index) => {
        const period = daySchedule[index];
        if (period) {
          rowData.push(`${period.subject}\n(${period.class})\n${period.room}`);
        } else {
          rowData.push("-");
        }
      });
      tableRows.push(rowData);
    });

    doc.autoTable({
      head: [tableColumn],
      body: tableRows,
      startY: 30,
      styles: { fontSize: 8, cellPadding: 2, overflow: 'linebreak', halign: 'center', valign: 'middle' },
      headStyles: { fillColor: [0, 189, 127], textColor: 255, fontStyle: 'bold' }, // #00bd7f
      columnStyles: { 0: { fontStyle: 'bold', fillColor: [240, 240, 240] } },
      theme: 'grid'
    });

    doc.save("My_Class_Routine.pdf");
  };

  return (
    <div className="min-h-screen bg-slate-50/50 p-4 md:p-8 animate-in fade-in duration-500">
      <div className="max-w-[1600px] mx-auto space-y-6">
        
        {/* Header Section */}
        <div className="bg-white rounded-[20px] p-6 md:p-8 border border-slate-200 shadow-sm flex flex-col md:flex-row justify-between items-center gap-6">
          <div className="flex items-center gap-5">
            <div className="w-14 h-14 bg-[#00bd7f]/10 rounded-2xl flex items-center justify-center border border-[#00bd7f]/20 shadow-sm">
              <Calendar className="w-7 h-7 text-[#00bd7f]" />
            </div>
            <div>
              <h1 className="text-2xl font-black text-slate-800 tracking-tight">{t('teacher.schedule.my_class_routine')}</h1>
              <p className="text-slate-500 font-bold text-sm mt-1">{t('teacher.schedule.academic_weekly_schedule')}</p>
            </div>
          </div>
          
           <button 
            onClick={handleDownloadPDF}
            className="group px-6 py-3 bg-slate-900 hover:bg-[#00bd7f] text-white rounded-xl font-bold transition-all shadow-lg hover:shadow-[#00bd7f]/30 active:scale-95 flex items-center gap-2.5 text-sm uppercase tracking-widest"
          >
            <Download className="w-4 h-4 group-hover:animate-bounce" />
            {t('teacher.schedule.download_pdf')}
          </button>
        </div>

        {/* Schedule Grid */}
        <div className="bg-white rounded-[25px] border border-slate-200 shadow-sm overflow-hidden">
        <div className="overflow-x-auto pb-4 custom-scrollbar">
            <table className="w-full min-w-[1200px] border-collapse">
              <thead>
                <tr>
                  <th className="p-4 w-32 bg-slate-50 border-b border-r border-slate-200 text-left sticky left-0 z-10">
                    <div className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Day / Time</div>
                  </th>
                  {periods.map((period, index) => (
                    <th key={index} className="p-4 min-w-[160px] bg-slate-50/50 border-b border-slate-200 text-center">
                      <div className="flex flex-col items-center gap-1">
                        <span className="text-xs font-black text-slate-700">{period}</span>
                         <span className="text-[9px] font-bold text-slate-400 uppercase tracking-widest">Period {index + 1}</span>
                      </div>
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {days.map((day, dayIndex) => (
                  <tr key={dayIndex} className="group hover:bg-slate-50/30 transition-colors">
                    <td className="p-4 bg-slate-50 border-r border-b border-slate-200 font-black text-slate-700 text-center text-sm sticky left-0 z-10 group-hover:bg-slate-100 transition-colors">
                      {day}
                    </td>
                    {periods.map((_, periodIndex) => {
                       const daySchedule = scheduleData[day] || [];
                       const period = daySchedule[periodIndex];
                       
                       return (
                        <td key={periodIndex} className="p-2 border-b border-r border-slate-100 relative h-32 align-top">
                          {period ? (
                            <div 
                              onClick={() => setSelectedPeriod({ ...period, day, periodIndex })}
                              className="h-full p-3 rounded-xl bg-[#00bd7f]/5 border border-[#00bd7f]/20 hover:border-[#00bd7f] hover:shadow-md transition-all cursor-pointer flex flex-col justify-between group/card"
                            >
                              <div>
                                <h4 className="font-bold text-slate-800 text-sm leading-tight mb-1 group-hover/card:text-[#00bd7f] transition-colors line-clamp-2">
                                  {period.subject}
                                </h4>
                                <div className="flex items-center gap-1.5 text-[10px] font-bold text-slate-500 uppercase tracking-wider">
                                  <BookOpen className="w-3 h-3" />
                                  <span className="truncate">{period.class}</span>
                                </div>
                              </div>
                              <div className="flex items-center gap-1.5 text-[10px] font-bold text-[#00bd7f] bg-white px-2 py-1 rounded-md w-fit border border-[#00bd7f]/20 w-full">
                                      <User />
                                      <p>Sadiqur</p>
                              </div>
                            </div>
                          ) : (
                            <div className="h-full flex items-center justify-center">
                               <span className="w-1.5 h-1.5 rounded-full bg-slate-200"></span>
                            </div>
                          )}
                        </td>
                      );
                    })}
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

      </div>

      {/* Period Details Modal */}
      {selectedPeriod && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/40 backdrop-blur-sm animate-in fade-in duration-200">
          <div className="bg-white rounded-[2rem] w-full max-w-md shadow-2xl border border-white/20 relative overflow-hidden animate-in zoom-in-95 duration-200">
             <div className="absolute top-0 left-0 w-full h-32 bg-[#00bd7f] flex items-center justify-center px-6">
                <div className="w-full flex justify-between items-start">
                   <div className="text-white">
                      <p className="text-[#00bd7f] font-black text-[10px] uppercase tracking-widest bg-white px-3 py-1 rounded-full mb-2 inline-block shadow-sm">
                        {t('teacher.schedule.period_details')}
                      </p>
                      <h2 className="text-3xl font-black tracking-tight">{selectedPeriod.subject}</h2>
                   </div>
                    <button 
                      onClick={() => setSelectedPeriod(null)}
                      className="p-2 bg-white/20 hover:bg-white/30 rounded-full text-white transition-colors"
                    >
                      <X className="w-5 h-5" />
                    </button>
                </div>
                 {/* Decorative circles */}
                 <div className="absolute -bottom-10 -right-10 w-40 h-40 bg-white/10 rounded-full blur-2xl"></div>
                 <div className="absolute top-10 -left-10 w-20 h-20 bg-white/10 rounded-full blur-xl"></div>
             </div>

             <div className="pt-36 px-8 pb-8 space-y-6">
                <div className="space-y-4">
                   <div className="flex items-center gap-4 p-4 rounded-2xl bg-slate-50 border border-slate-100">
                      <div className="w-10 h-10 rounded-xl bg-blue-50 text-blue-600 flex items-center justify-center">
                         <Clock className="w-5 h-5" />
                      </div>
                      <div>
                         <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">{t('teacher.schedule.time')}</p>
                         <p className="font-bold text-slate-800">{selectedPeriod.time}</p>
                      </div>
                   </div>

                   <div className="flex items-center gap-4 p-4 rounded-2xl bg-slate-50 border border-slate-100">
                      <div className="w-10 h-10 rounded-xl bg-purple-50 text-purple-600 flex items-center justify-center">
                         <BookOpen className="w-5 h-5" />
                      </div>
                      <div>
                         <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">{t('teacher.schedule.class')}</p>
                         <p className="font-bold text-slate-800">{selectedPeriod.class}</p>
                      </div>
                   </div>

                   <div className="flex items-center gap-4 p-4 rounded-2xl bg-slate-50 border border-slate-100">
                      <div className="w-10 h-10 rounded-xl bg-emerald-50 text-emerald-600 flex items-center justify-center">
                         <MapPin className="w-5 h-5" />
                      </div>
                      <div>
                         <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">{t('teacher.schedule.room')}</p>
                         <p className="font-bold text-slate-800">{selectedPeriod.room}</p>
                      </div>
                   </div>
                </div>

                <div className="pt-4 border-t border-slate-100">
                   <button 
                      onClick={() => setSelectedPeriod(null)}
                      className="w-full py-3.5 bg-slate-100 hover:bg-slate-200 text-slate-600 font-bold rounded-xl transition-colors text-sm uppercase tracking-widest"
                   >
                      {t('teacher.schedule.close')}
                   </button>
                </div>
             </div>
          </div>
        </div>
      )}

    </div>
  );
};

export default GuardianClassRoutine;
