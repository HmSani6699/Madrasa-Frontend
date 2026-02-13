import { useState } from "react";
import { 
  Calendar, 
  Clock, 
  MapPin, 
  Download,
  ClipboardCheck,
  FileText,
  Printer
} from "lucide-react";
import jsPDF from "jspdf";
import "jspdf-autotable";
import { useTranslation } from "react-i18next";

const GuardianExamSchedule = () => {
   const { t } = useTranslation();
   
   // Data derived from the reference image (approximate dates)
   const examDates = [
      { date: "22-10-25", day: "Saturday" },
      { date: "23-10-25", day: "Sunday" },
      { date: "25-10-25", day: "Tuesday" },
      { date: "28-10-25", day: "Friday" }, // Assuming Friday is off or exam day based on context
      { date: "30-10-25", day: "Sunday" },
      { date: "01-11-25", day: "Tuesday" },
      { date: "03-11-25", day: "Thursday" },
      { date: "05-11-25", day: "Saturday" },
      { date: "08-11-25", day: "Tuesday" },
      { date: "10-11-25", day: "Thursday" },
      { date: "12-11-25", day: "Saturday" },
   ];

   const classes = [
      "Kulliya-1",
      "Kulliya-2",
      "Sanabiah",
      "Mutawassitah",
      "Ibtidaiyah"
   ];

   // Mock mapping of Class -> Date -> Subject
   const scheduleData = {
      "Kulliya-1": {
         "22-10-25": "Tafsir",
         "23-10-25": "Bukhari",
         "25-10-25": "Muslim",
         "30-11-25": "Abu Daud", // Note: Date formats might need consistency
         "01-11-25": "Tirmidhi",
         "05-11-25": "Nasai",
         "10-11-25": "Ibn Majah"
      },
      "Kulliya-2": {
         "22-10-25": "Hidayah",
         "25-10-25": "Kanz",
         "28-10-25": "Nurul Anwar",
         "01-11-25": "Siraji",
         "05-11-25": "Aqidah",
         "12-11-25": "Balaghat"
      },
      "Sanabiah": {
         "22-10-25": "Mishkat-1",
         "23-10-25": "Mishkat-2",
         "25-10-25": "Jalalayn",
         "01-11-25": "Riyadus Salihin",
         "08-11-25": "Usul Fiqh"
      },
      "Mutawassitah": {
         "22-10-25": "Sharh Jami",
         "25-10-25": "Mukhtasar",
         "30-10-25": "Kafiya",
         "05-11-25": "Quduri",
         "10-11-25": "Sharh Wiqaya"
      },
      "Ibtidaiyah": {
         "22-10-25": "Bangla",
         "23-10-25": "English",
         "25-10-25": "Math",
         "30-10-25": "History",
         "01-11-25": "Science",
         "05-11-25": "Geography",
         "08-11-25": "Computer",
         "10-11-25": "Drawing",
         "12-11-25": "GK"
      }
   };

   const handleDownloadPDF = () => {
      const doc = new jsPDF({ orientation: "landscape" });

      // Header
      doc.setFontSize(18);
      doc.setTextColor(0, 0, 0);
      doc.text("Madrasatul Huda Al-Islamiyyah As-Salafiyyah", 148, 15, { align: "center" });
      doc.setFontSize(12);
      doc.text("Annual Examination Routine - 2025", 148, 22, { align: "center" });
      doc.setFontSize(10);
      doc.text("Abdullahpur, Rahimpur, Thakurgaon", 148, 27, { align: "center" });

      // Exam Timing
      doc.setFontSize(11);
      doc.text(`${t('teacher.exam.exam_time')}: 09:30 AM - 12:30 PM`, 14, 35);

      // Table Data
      const tableHead = [
         [
            { content: t('teacher.exam.class_date'), rowSpan: 2, styles: { halign: 'center', valign: 'middle' } },
            ...examDates.map(d => ({ content: `${d.date}\n${d.day}`, styles: { halign: 'center' } }))
         ]
      ];

      const tableBody = classes.map(cls => {
         const row = [cls]; // First column is class name
         examDates.forEach(dateObj => {
            const subject = scheduleData[cls]?.[dateObj.date] || "-";
            row.push(subject);
         });
         return row;
      });

      doc.autoTable({
         head: tableHead,
         body: tableBody,
         startY: 40,
         styles: { 
            fontSize: 9, 
            cellPadding: 2, 
            lineColor: [200, 200, 200], 
            lineWidth: 0.1,
            textColor: [0, 0, 0]
         },
         headStyles: { 
            fillColor: [240, 240, 240], 
            textColor: [0, 0, 0],
            fontStyle: 'bold',
            lineWidth: 0.1,
            lineColor: [150, 150, 150]
         },
         theme: 'grid',
         columnStyles: {
            0: { fontStyle: 'bold', fillColor: [250, 250, 250], cellWidth: 25 }
         }
      });

      // Footer - Rules
      let finalY = doc.lastAutoTable.finalY + 10;
      doc.setFontSize(10);
      doc.setFont("helvetica", "bold");
      doc.text("Important Instructions:", 14, finalY);
      doc.setFont("helvetica", "normal");
      doc.setFontSize(9);
      finalY += 5;
      doc.text("1. Students must enter the hall 15 minutes before the exam starts.", 14, finalY);
      finalY += 5;
      doc.text("2. No mobile phones or electronic devices are allowed.", 14, finalY);
      finalY += 5;
      doc.text("3. All outstanding dues must be cleared before 08/10/2025.", 14, finalY);

      // Signature
      doc.text("Principal's Signature", 250, finalY + 20, { align: "center" });
      doc.line(230, finalY + 15, 270, finalY + 15);

      doc.save("Exam_Routine_2025.pdf");
   };

  return (
    <div className="min-h-screen bg-slate-50/50 p-4 md:p-8 animate-in fade-in duration-500">
      <div className="max-w-[1600px] mx-auto space-y-6 md:space-y-8">
        
        {/* Header Section */}
        <div className="bg-white rounded-[1.5rem] p-6 border border-slate-200 shadow-sm flex flex-col md:flex-row justify-between items-center gap-6">
          <div className="flex items-center gap-4">
            <div className="w-14 h-14 bg-[#00bd7f]/10 rounded-xl flex items-center justify-center border border-[#00bd7f]/20">
              <ClipboardCheck className="w-7 h-7 text-[#00bd7f]" />
            </div>
            <div>
              <h1 className="text-2xl font-black text-slate-800 tracking-tight">Examination Routine</h1>
             
            </div>
          </div>

          <div className="flex gap-3">
            <button 
               onClick={handleDownloadPDF}
               className="px-6 py-3 bg-[#00bd7f] text-white rounded-xl font-bold shadow-lg shadow-[#00bd7f]/20 hover:bg-[#00a870] transition-all flex items-center gap-2"
            >
               <Download className="w-4 h-4" />
               Download PDF
            </button>
          </div>
        </div>

        {/* Routine Card */}
        <div className="bg-white rounded-[1.5rem] border border-slate-200 shadow-sm overflow-hidden p-1">
           <div className="p-6 md:p-8 border-b border-slate-100 bg-slate-50/30 text-center">
               <h2 className="text-xl md:text-2xl font-black text-slate-800 uppercase tracking-tight mb-2">Madrasatul Huda Al-Islamiyyah As-Salafiyyah</h2>
               <p className="text-slate-500 font-medium">Abdullahpur, Rahimpur, Thakurgaon</p>
               <div className="mt-4 px-4 py-1.5 bg-indigo-50 text-indigo-700 font-bold text-sm inline-block rounded-full border border-indigo-100">
                  Exam Timing: 09:30 AM - 12:30 PM
               </div>
           </div>
           
           <div className="overflow-x-auto">
              <div className="min-w-[1200px] p-6">
                 <table className="w-full border-collapse border border-slate-200">
                    <thead>
                       <tr className="whitespace-nowrap">
                          <th className="border border-slate-200 bg-slate-100/50 p-4 text-left min-w-[150px]">
                             <div className="flex flex-col gap-1">
                                <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Class / Date</span>
                             </div>
                          </th>
                          {examDates.map((item, index) => (
                             <th key={index} className="border border-slate-200 bg-slate-50 p-3 text-center min-w-[100px]">
                                <div className="flex flex-col items-center">
                                   <span className="text-xs font-bold text-slate-800">{item.date}</span>
                                   <span className="text-[10px] font-medium text-slate-500 uppercase">{item.day}</span>
                                </div>
                             </th>
                          ))}
                       </tr>
                    </thead>
                    <tbody>
                       {classes.map((cls, rowIndex) => (
                          <tr key={rowIndex} className="hover:bg-slate-50/50 transition-colors  whitespace-nowrap">
                             <td className="border border-slate-200 p-4 bg-slate-50/30 font-bold text-slate-700 text-sm">
                                {cls}
                             </td>
                             {examDates.map((dateObj, colIndex) => {
                                const subject = scheduleData[cls]?.[dateObj.date];
                                return (
                                   <td key={colIndex} className="border border-slate-200 p-3 text-center relative h-16 group">
                                      {subject ? (
                                         <span className="font-bold text-slate-800 text-sm">{subject}</span>
                                      ) : (
                                         <span className="text-slate-300 transform scale-150 block">-</span>
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

           {/* Footer Rules */}
           <div className="p-8 bg-slate-50/30 border-t border-slate-100">
              <div className="max-w-4xl">
                 <h3 className="text-sm font-black text-slate-800 uppercase tracking-widest mb-4 flex items-center gap-2">
                    <FileText className="w-4 h-4 text-slate-400" />
                    Important Instructions
                 </h3>
                 <ul className="space-y-2.5">
                    <li className="flex items-start gap-3 text-sm text-slate-600 font-medium">
                       <span className="w-1.5 h-1.5 rounded-full bg-slate-400 mt-2 shrink-0"></span>
                       {t('teacher.exam.instruction_1')}
                    </li>
                    <li className="flex items-start gap-3 text-sm text-slate-600 font-medium">
                       <span className="w-1.5 h-1.5 rounded-full bg-slate-400 mt-2 shrink-0"></span>
                       {t('teacher.exam.instruction_2')}
                    </li>
                    <li className="flex items-start gap-3 text-sm text-slate-600 font-medium">
                       <span className="w-1.5 h-1.5 rounded-full bg-slate-400 mt-2 shrink-0"></span>
                       {t('teacher.exam.instruction_3')}
                    </li>
                    <li className="flex items-start gap-3 text-sm text-slate-600 font-medium">
                       <span className="w-1.5 h-1.5 rounded-full bg-slate-400 mt-2 shrink-0"></span>
                       {t('teacher.exam.instruction_4')} <span className="text-[#00bd7f] font-bold">08/10/2025</span>.
                    </li>
                 </ul>
              </div>

              <div className="mt-16 flex justify-end px-12">
                 <div className="text-center">
                    <div className="w-48 border-b-2 border-slate-300 mb-2"></div>
                    <p className="text-sm font-bold text-slate-600 uppercase">Principal's Signature</p>
                 </div>
              </div>
           </div>
        </div>

      </div>
    </div>
  );
};

export default GuardianExamSchedule;
