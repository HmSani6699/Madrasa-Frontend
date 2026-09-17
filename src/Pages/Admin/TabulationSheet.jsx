import { useState, useEffect, useRef } from "react";
import jsPDF from "jspdf";
import html2canvas from "html2canvas";
import {
  Table,
  Search,
  Filter,
  Download,
  FileText,
  Printer,
  ChevronDown,
  School,
  X,
  Layers,
  CheckCircle2
} from "lucide-react";
import SelectInputField from "../../components/SelectInputField";
import axiosInstance from "../../api/axiosInstance";
import { toast } from "react-hot-toast";

const TabulationSheet = () => {
  const [exams, setExams] = useState([]);
  const [classes, setClasses] = useState([]);
  const [sections, setSections] = useState([]);
  const [grades, setGrades] = useState([]);

  const [selectedExam, setSelectedExam] = useState("");
  const [selectedClass, setSelectedClass] = useState("");
  const [selectedSection, setSelectedSection] = useState("");

  const [isFilterOpen, setIsFilterOpen] = useState(false);
  const [loading, setLoading] = useState(false);

  const [students, setStudents] = useState([]);
  const [subjects, setSubjects] = useState([]);
  const [isGenerated, setIsGenerated] = useState(false);
  const [isPreviewOpen, setIsPreviewOpen] = useState(false);
  const [tabulationData, setTabulationData] = useState([]);
  
  const pdfRef = useRef(null);

  useEffect(() => {
    fetchInitialData();
  }, []);

  useEffect(() => {
    if (selectedClass) {
      fetchSections(selectedClass);
    } else {
      setSections([]);
      setSelectedSection("");
    }
  }, [selectedClass]);

  const fetchInitialData = async () => {
    try {
      const [examNamesRes, classesRes, gradesRes] = await Promise.all([
        axiosInstance.get("/v1/exam-names"),
        axiosInstance.get("/v1/classes"),
        axiosInstance.get("/v1/grades"),
      ]);

      if (examNamesRes.data?.success) {
        setExams(
          examNamesRes.data.data.map((ex) => ({
            value: ex._id,
            label: ex.name || "Unknown Exam",
          }))
        );
      }
      if (classesRes.data?.success) {
        setClasses(
          classesRes.data.data.map((c) => ({ value: c._id, label: c.name }))
        );
      }
      if (gradesRes.data?.success) {
        setGrades(gradesRes.data.data);
      }
    } catch (err) {
      console.error(err);
      toast.error("Failed to load initial data");
    }
  };

  const fetchSections = async (classId) => {
    try {
      const res = await axiosInstance.get(`/v1/sections?class_id=${classId}`);
      if (res.data?.success) {
        setSections(
          res.data.data.map((s) => ({ value: s._id, label: s.name }))
        );
      }
    } catch (error) {
      console.error(error);
      toast.error("Failed to load sections");
    }
  };

  const handleGenerate = async () => {
    if (!selectedExam || !selectedClass) {
      toast.error("Please select Exam and Class");
      return;
    }
    setIsFilterOpen(false);
    setLoading(true);

    try {
      let studentUrl = `/v1/students?class_id=${selectedClass}`;
      if (selectedSection) {
        studentUrl += `&section_id=${selectedSection}`;
      }

      const [studentsRes, subjectsRes, resultsRes] = await Promise.all([
        axiosInstance.get(studentUrl),
        axiosInstance.get(`/v1/subjects?class_id=${selectedClass}`),
        axiosInstance.get(`/v1/results?exam_id=${selectedExam}&class_id=${selectedClass}`)
      ]);

      let fetchedStudents = [];
      let fetchedSubjects = [];
      let fetchedResults = [];

      if (studentsRes.data?.success) fetchedStudents = studentsRes.data.data;
      if (subjectsRes.data?.success) fetchedSubjects = subjectsRes.data.data;
      if (resultsRes.data?.success) fetchedResults = resultsRes.data.data;

      setStudents(fetchedStudents);
      setSubjects(fetchedSubjects);

      // Process tabulation data
      const processedData = fetchedStudents.map((student) => {
        let totalMarks = 0;
        let totalPoints = 0;
        let hasFailed = false;
        let subjectCount = fetchedSubjects.length;

        const studentMarks = {};

        fetchedSubjects.forEach(subject => {
          const result = fetchedResults.find(r => 
            (r.student_id === student._id || r.student_id?._id === student._id) && 
            (r.subject_id === subject._id || r.subject_id?._id === subject._id)
          );

          let mark = result ? result.marks_obtained : 0;
          studentMarks[subject._id] = mark;
          totalMarks += mark;

          let point = 0;
          const matchedGrade = grades.find(g => mark >= g.min_marks && mark <= g.max_marks);
          if (matchedGrade) {
             point = matchedGrade.grade_point;
          }
          
          if (point === 0) {
             hasFailed = true;
          }
          totalPoints += point;
        });

        const gpa = subjectCount > 0 ? (totalPoints / subjectCount) : 0;
        const resultStatus = hasFailed ? "Failed" : "Passed";

        return {
          ...student,
          marks: studentMarks,
          totalMarks,
          gpa: gpa.toFixed(2),
          resultStatus
        };
      });

      processedData.sort((a, b) => {
        if (a.resultStatus === "Passed" && b.resultStatus === "Failed") return -1;
        if (a.resultStatus === "Failed" && b.resultStatus === "Passed") return 1;
        
        const gpaA = parseFloat(a.gpa);
        const gpaB = parseFloat(b.gpa);
        if (gpaB !== gpaA) return gpaB - gpaA;
        
        return b.totalMarks - a.totalMarks;
      });

      processedData.forEach((student, index) => {
        student.roll_number = (index + 1).toString();
      });

      setTabulationData(processedData);
      setIsGenerated(true);

    } catch (err) {
      console.error(err);
      toast.error("Failed to generate tabulation sheet");
    } finally {
      setLoading(false);
    }
  };

  const exportToCSV = () => {
    if (!tabulationData || tabulationData.length === 0) return;

    const headers = ["Student Name", "Roll Number", "ID"];
    subjects.forEach(subject => headers.push(`"${subject.name}"`));
    headers.push(`"Grand Total"`, `"GPA"`, `"Result"`);

    const headersRow = headers.map(h => h.startsWith('"') ? h : `"${h}"`).join(",");

    const rows = tabulationData.map(student => {
      const row = [
        `"${student.firstName} ${student.lastName}"`,
        `"${student.roll_number || "N/A"}"`,
        `"${student._id?.slice(-6)}"`
      ];
      
      subjects.forEach(subject => {
        row.push(student.marks[subject._id] !== undefined ? student.marks[subject._id] : 0);
      });

      row.push(student.totalMarks, student.gpa, `"${student.resultStatus}"`);
      return row.join(",");
    });

    const csvContent = "\uFEFF" + [headersRow, ...rows].join("\n");
    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.setAttribute("href", url);
    link.setAttribute("download", `tabulation_sheet.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
  };

  const exportToPDF = async () => {
    if (!pdfRef.current) return;
    const element = pdfRef.current;
    element.style.display = 'block';
    const canvas = await html2canvas(element, { scale: 2 });
    const data = canvas.toDataURL('image/png');
    const pdf = new jsPDF('l', 'px', 'a4');
    const imgProperties = pdf.getImageProperties(data);
    const pdfWidth = pdf.internal.pageSize.getWidth();
    const pdfHeight = (imgProperties.height * pdfWidth) / imgProperties.width;
    pdf.addImage(data, 'PNG', 0, 0, pdfWidth, pdfHeight);
    pdf.save('tabulation-sheet.pdf');
    element.style.display = 'none';
    setIsPreviewOpen(false);
  };

  return (
    <div className="animate-in fade-in duration-500">
      <div className="flex items-center justify-between mb-5 w-full relative z-50">
        <div>
          <h1 className="text-[20px] font-black text-slate-800 flex items-center gap-3">
            <Table className="w-8 h-8 text-[#00315e]" />
            Tabulation Sheet
          </h1>
          <p className="text-[14px] text-slate-500 font-bold mt-1">
            Comprehensive mark sheet and result analysis
          </p>
        </div>

        <div className="flex gap-3">
          <div className="relative">
            <button
              onClick={() => setIsFilterOpen(!isFilterOpen)}
              className="px-4 py-2 bg-[#00315e] text-white rounded-[8px] font-bold hover:bg-blue-900 transition-all flex items-center justify-center gap-2 cursor-pointer"
            >
              <Filter className="h-4 w-4" /> Filter
            </button>

            {isFilterOpen && (
              <div className="absolute right-0 top-full mt-2 w-[calc(100vw-2rem)] sm:w-80 max-w-[320px] bg-white rounded-[8px] shadow-2xl border border-slate-200 z-50 p-5 space-y-4 animate-in fade-in slide-in-from-top-2 duration-200">
                <div className="flex items-center justify-between border-b border-slate-100 pb-3">
                  <h3 className="font-black text-slate-800 text-sm flex items-center gap-2">
                    <Filter className="w-4 h-4 text-[#00315e]" />
                    Filter Options
                  </h3>
                  <button
                    onClick={() => setIsFilterOpen(false)}
                    className="text-slate-400 hover:text-slate-600 cursor-pointer"
                  >
                    <X className="w-4 h-4" />
                  </button>
                </div>
                
                <SelectInputField
                  title="Exam"
                  options={exams}
                  value={selectedExam}
                  setValue={setSelectedExam}
                />
                <div className="grid grid-cols-2 gap-3">
                  <SelectInputField
                    title="Class"
                    options={classes}
                    value={selectedClass}
                    setValue={setSelectedClass}
                  />
                  <SelectInputField
                    title="Section (Optional)"
                    options={sections}
                    value={selectedSection}
                    setValue={setSelectedSection}
                  />
                </div>

                <div className="flex items-end justify-end gap-3 pt-2">
                  <button
                    onClick={() => setIsFilterOpen(false)}
                    className="px-4 py-2 bg-red-50 hover:bg-red-100 rounded-[8px] cursor-pointer text-red-600 font-bold transition-all text-sm w-full"
                  >
                    Cancel
                  </button>
                  <button
                    onClick={handleGenerate}
                    className="px-4 py-2 bg-[#00315e] text-white rounded-[8px] font-bold hover:bg-blue-900 transition-all flex items-center justify-center gap-2 cursor-pointer text-sm w-full"
                  >
                    Generate
                  </button>
                </div>
              </div>
            )}
          </div>

          {isGenerated && !loading && (
            <>
              <button 
                onClick={exportToCSV}
                className="px-4 py-2 bg-[#00315e] text-white rounded-[8px] font-bold shadow-sm hover:bg-blue-900 transition-all flex items-center justify-center gap-2"
              >
                <FileText className="w-4 h-4" />
                Export CSV
              </button>
              <button 
                onClick={() => setIsPreviewOpen(true)}
                className="px-4 py-2 bg-[#00315e] text-white rounded-[8px] font-bold shadow-sm hover:bg-blue-900 transition-all flex items-center justify-center gap-2"
              >
                <Download className="w-4 h-4" />
                Export PDF
              </button>
            </>
          )}
        </div>
      </div>

      {/* Main Content Area */}
      {loading ? (
        <div className="bg-white rounded-[8px] shadow-xl shadow-slate-100/50 border border-gray-200 mb-20 p-16 flex flex-col items-center justify-center text-center animate-in fade-in">
          <div className="w-12 h-12 border-4 border-[#00315e] border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <h3 className="text-xl font-black text-slate-800 mb-1">Loading Data</h3>
          <p className="text-slate-500 font-bold">Please wait while we generate the tabulation sheet.</p>
        </div>
      ) : isGenerated ? (
        <div className="bg-white rounded-[8px] shadow-xl shadow-slate-100/50 overflow-hidden relative animate-in fade-in slide-in-from-bottom-4 duration-500">
          <div className="overflow-x-auto rounded-t-[8px]">
            <table className="w-full border-collapse">
              <thead className="bg-[#00315e24]">
                <tr className="whitespace-nowrap">
                  <th className="px-6 py-3.5 text-left text-[12px] font-black text-slate-800">Student Particulars</th>
                  {subjects.map(subject => (
                    <th key={subject._id} className="px-4 py-3.5 text-center text-[12px] font-black text-slate-800">{subject.name}</th>
                  ))}
                  <th className="px-4 py-3.5 text-center text-[12px] font-black text-[#00315e] bg-blue-50/50">Grand Total</th>
                  <th className="px-4 py-3.5 text-center text-[12px] font-black text-slate-800">GPA</th>
                  <th className="px-6 py-3.5 text-center text-[12px] font-black text-slate-800">Result</th>
                </tr>
              </thead>
              <tbody className="divide-y-2 divide-slate-100">
                {tabulationData.length === 0 ? (
                  <tr>
                    <td colSpan={subjects.length + 4} className="text-center py-10 text-slate-500 font-bold">
                      No students found for this selection.
                    </td>
                  </tr>
                ) : (
                  tabulationData.map((student, i) => (
                    <tr key={student._id} className="group hover:bg-amber-50/10 transition-all duration-300">
                      <td className="px-6 py-4 bg-white group-hover:bg-amber-50/10 whitespace-nowrap">
                        <div className="flex items-center gap-3">
                          {student.photo ? (
                            <div className="w-8 h-8 rounded-full overflow-hidden shadow-sm shrink-0">
                              <img src={student.photo} alt={student.firstName} className="w-full h-full object-cover" />
                            </div>
                          ) : (
                            <div className="w-8 h-8 bg-slate-100 rounded-full flex items-center justify-center font-black text-slate-600 text-xs shadow-sm shrink-0">
                              {i < 9 ? `0${i + 1}` : i + 1}
                            </div>
                          )}
                          <div>
                            <p className="text-sm font-bold text-slate-800">{student.firstName} {student.lastName}</p>
                            <p className="text-[10px] text-slate-500 font-bold uppercase tracking-wider">ROLL: {student.roll_number || "N/A"} <span className="text-slate-300 mx-1">•</span> ID: {student._id?.slice(-6)}</p>
                          </div>
                        </div>
                      </td>
                      {subjects.map(subject => (
                        <td key={subject._id} className="px-4 py-4 text-center font-mono text-sm font-bold text-slate-700 whitespace-nowrap">
                          {student.marks[subject._id]}
                        </td>
                      ))}
                      <td className="px-4 py-4 text-center bg-blue-50/30 whitespace-nowrap">
                        <p className="text-sm font-black text-[#00315e]">{student.totalMarks}</p>
                      </td>
                      <td className="px-4 py-4 text-center whitespace-nowrap">
                        <p className="text-sm font-black text-slate-800">{student.gpa}</p>
                      </td>
                      <td className="px-6 py-4 text-center whitespace-nowrap">
                        <span className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full text-[10px] font-black uppercase tracking-widest border ${student.resultStatus === 'Failed' ? 'bg-rose-50 text-rose-700 border-rose-100' : 'bg-blue-50 text-blue-700 border-blue-100'}`}>
                          <div className={`w-1.5 h-1.5 rounded-full ${student.resultStatus === 'Failed' ? 'bg-rose-500' : 'bg-blue-500'}`} />
                          {student.resultStatus}
                        </span>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </div>
      ) : (
        <div className="bg-white rounded-[12px] shadow-sm border-2 border-dashed border-slate-200 flex flex-col items-center justify-center text-center animate-in fade-in duration-500 py-[50px]">
          <div className="relative mb-8 group cursor-pointer" onClick={() => setIsFilterOpen(true)}>
            <div className="absolute inset-0 bg-[#00315e]/10 rounded-full animate-ping opacity-75"></div>
            <div className="relative w-24 h-24 bg-[#00315e]/5 rounded-full flex items-center justify-center border-4 border-white shadow-xl transition-transform group-hover:scale-110 duration-300">
              <Filter className="w-10 h-10 text-[#00315e]" />
            </div>
          </div>
          <h2 className="text-2xl md:text-2xl font-black text-slate-800 mb-4 tracking-tight">
            প্রথমে ডাটা ফিল্টার করুন, তারপর টেবিল
          </h2>
        </div>
      )}

      {/* PDF Layout Container - Used exclusively for rendering the PDF via html2canvas */}
      <div 
        ref={pdfRef} 
        style={{ display: 'none', width: '1120px' }} 
        className="bg-white p-12 text-slate-800"
      >
        <div className="flex items-center justify-between border-b-2 border-slate-200 pb-8 mb-8">
          <div className="w-24 h-24 bg-slate-50 border-2 border-slate-100 rounded-2xl flex items-center justify-center shrink-0">
             <span className="text-[10px] font-black text-slate-300">LOGO</span>
          </div>
          <div className="flex-1 text-center px-4">
             <h1 className="text-4xl font-black tracking-tight uppercase text-slate-900">Madrasa Management System</h1>
             <h2 className="text-xl font-bold text-slate-500 mt-2">Tabulation Sheet & Result Analysis</h2>
          </div>
          <div className="w-24 h-24 border-2 border-slate-800 rounded-lg p-2 flex flex-col items-center justify-center gap-1">
             <div className="w-full flex justify-between">
                <div className="w-6 h-6 bg-slate-800"></div>
                <div className="w-6 h-6 bg-slate-800"></div>
             </div>
             <div className="w-10 h-10 bg-slate-800"></div>
             <span className="text-[7px] font-black uppercase mt-1">SCAN QR</span>
          </div>
        </div>

        <div className="flex justify-between items-center mb-6 text-sm font-black uppercase tracking-widest text-slate-600">
           <span>Exam: {exams.find(e => e.value === selectedExam)?.label || "N/A"}</span>
           <span>Class: {classes.find(c => c.value === selectedClass)?.label || "N/A"}</span>
        </div>

        <table className="w-full border-collapse border border-slate-300 text-[10px]">
          <thead>
            <tr className="bg-slate-100 text-slate-800 text-left font-black uppercase tracking-wider">
              <th className="p-3 border border-slate-300">Roll</th>
              <th className="p-3 border border-slate-300">Student Name</th>
              <th className="p-3 border border-slate-300">ID</th>
              {subjects.map(subject => (
                <th key={subject._id} className="p-3 border border-slate-300">{subject.name}</th>
              ))}
              <th className="p-3 border border-slate-300">Total</th>
              <th className="p-3 border border-slate-300">GPA</th>
              <th className="p-3 border border-slate-300">Result</th>
            </tr>
          </thead>
          <tbody>
            {tabulationData.map(student => (
              <tr key={student._id} className="font-bold text-slate-700">
                <td className="p-3 border border-slate-300">{student.roll_number || "N/A"}</td>
                <td className="p-3 border border-slate-300">{student.firstName} {student.lastName}</td>
                <td className="p-3 border border-slate-300">{student._id?.slice(-6)}</td>
                {subjects.map(subject => (
                  <td key={subject._id} className="p-3 border border-slate-300">
                    {student.marks[subject._id] !== undefined ? student.marks[subject._id] : "-"}
                  </td>
                ))}
                <td className="p-3 border border-slate-300">{student.totalMarks}</td>
                <td className="p-3 border border-slate-300">{student.gpa}</td>
                <td className="p-3 border border-slate-300">{student.resultStatus}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Generation Preview Modal */}
      {isPreviewOpen && (
          <div className="fixed inset-0 bg-slate-900/80 backdrop-blur-xl z-[100] flex items-center justify-center p-6 sm:p-10 lg:p-20">
              <div className="bg-white rounded-[4rem] w-full h-full max-w-7xl shadow-[0_0_100px_rgba(0,0,0,0.4)] flex flex-col overflow-hidden animate-in zoom-in duration-300">
                   {/* Modal Header */}
                   <div className="p-10 border-b-2 border-slate-50 flex items-center justify-between shrink-0 bg-white">
                        <div className="flex items-center gap-6">
                            <div className="w-16 h-16 bg-blue-50 text-blue-600 rounded-[1.5rem] flex items-center justify-center shadow-inner border-2 border-blue-100/50">
                                <FileText className="w-8 h-8" />
                            </div>
                            <div>
                                <h2 className="text-3xl font-black text-slate-800 tracking-tight">Print Engine Preview</h2>
                                <p className="text-xs font-black text-slate-400 uppercase tracking-[0.2em] mt-1">Template: <span className="text-blue-500">Tabulation Result Sheet</span></p>
                            </div>
                        </div>
                        <div className="flex gap-4">
                            <button 
                              onClick={exportToPDF} 
                              className="flex items-center gap-3 px-8 py-4 bg-slate-900 text-white rounded-2xl font-black text-sm hover:bg-black shadow-xl shadow-slate-200 transition-all"
                            >
                                <Download className="w-5 h-5" /> Download PDF
                            </button>
                            <button 
                              onClick={() => {
                                const el = pdfRef.current;
                                el.style.display = 'block';
                                window.print();
                                el.style.display = 'none';
                              }} 
                              className="flex items-center gap-3 px-8 py-4 bg-[#00315e] text-white rounded-2xl font-black text-sm hover:bg-blue-900 shadow-xl shadow-blue-100 transition-all"
                            >
                                <Printer className="w-5 h-5" /> Print Sheet
                            </button>
                            <button onClick={() => setIsPreviewOpen(false)} className="p-4 text-slate-400 hover:bg-slate-50 rounded-2xl transition-all ml-4">
                                <X className="w-8 h-8" />
                            </button>
                        </div>
                   </div>

                   {/* Preview Container */}
                   <div className="flex-1 overflow-y-auto p-12 lg:p-20 bg-slate-100/30 custom-scrollbar flex justify-center">
                        {/* A visible miniature clone of the layout for preview */}
                        <div className="w-[1120px] bg-white p-12 text-slate-800 shadow-[0_40px_100px_rgba(0,0,0,0.2)] border-8 border-white scale-[0.6] origin-top md:scale-[0.8] lg:scale-[0.9] xl:scale-100 transition-transform">
                          <div className="flex items-center justify-between border-b-2 border-slate-200 pb-8 mb-8">
                            <div className="w-24 h-24 bg-slate-50 border-2 border-slate-100 rounded-2xl flex items-center justify-center shrink-0">
                               <span className="text-[10px] font-black text-slate-300">LOGO</span>
                            </div>
                            <div className="flex-1 text-center px-4">
                               <h1 className="text-4xl font-black tracking-tight uppercase text-slate-900">Madrasa Management System</h1>
                               <h2 className="text-xl font-bold text-slate-500 mt-2">Tabulation Sheet & Result Analysis</h2>
                            </div>
                            <div className="w-24 h-24 border-2 border-slate-800 rounded-lg p-2 flex flex-col items-center justify-center gap-1">
                               <div className="w-full flex justify-between">
                                  <div className="w-6 h-6 bg-slate-800"></div>
                                  <div className="w-6 h-6 bg-slate-800"></div>
                               </div>
                               <div className="w-10 h-10 bg-slate-800"></div>
                               <span className="text-[7px] font-black uppercase mt-1">SCAN QR</span>
                            </div>
                          </div>

                          <div className="flex justify-between items-center mb-6 text-sm font-black uppercase tracking-widest text-slate-600">
                             <span>Exam: {exams.find(e => e.value === selectedExam)?.label || "N/A"}</span>
                             <span>Class: {classes.find(c => c.value === selectedClass)?.label || "N/A"}</span>
                          </div>

                          <table className="w-full border-collapse border border-slate-300 text-[10px]">
                            <thead>
                              <tr className="bg-slate-100 text-slate-800 text-left font-black uppercase tracking-wider">
                                <th className="p-3 border border-slate-300">Roll</th>
                                <th className="p-3 border border-slate-300">Student Name</th>
                                <th className="p-3 border border-slate-300">ID</th>
                                {subjects.map(subject => (
                                  <th key={subject._id} className="p-3 border border-slate-300">{subject.name}</th>
                                ))}
                                <th className="p-3 border border-slate-300">Total</th>
                                <th className="p-3 border border-slate-300">GPA</th>
                                <th className="p-3 border border-slate-300">Result</th>
                              </tr>
                            </thead>
                            <tbody>
                              {tabulationData.map(student => (
                                <tr key={student._id} className="font-bold text-slate-700">
                                  <td className="p-3 border border-slate-300">{student.roll_number || "N/A"}</td>
                                  <td className="p-3 border border-slate-300">{student.firstName} {student.lastName}</td>
                                  <td className="p-3 border border-slate-300">{student._id?.slice(-6)}</td>
                                  {subjects.map(subject => (
                                    <td key={subject._id} className="p-3 border border-slate-300">
                                      {student.marks[subject._id] !== undefined ? student.marks[subject._id] : "-"}
                                    </td>
                                  ))}
                                  <td className="p-3 border border-slate-300">{student.totalMarks}</td>
                                  <td className="p-3 border border-slate-300">{student.gpa}</td>
                                  <td className="p-3 border border-slate-300">{student.resultStatus}</td>
                                </tr>
                              ))}
                            </tbody>
                          </table>
                        </div>
                   </div>
              </div>
          </div>
      )}
    </div>
  );
};

export default TabulationSheet;

