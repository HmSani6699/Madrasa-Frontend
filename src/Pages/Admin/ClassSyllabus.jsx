import { useState, useEffect } from "react";
import {
  Plus,
  Search,
  Filter,
  Trash2,
  BookOpen,
  X,
  File,
  SquarePen,
  ClipboardList,
  Download,
  AlertCircle
} from "lucide-react";
import axiosInstance from "../../api/axiosInstance";
import { toast } from "react-hot-toast";
import InputField from "../../components/InputField";
import SelectInputField from "../../components/SelectInputField";
import RichTextEditor from "../../components/RichTextEditor";

const ClassSyllabus = () => {
  const [searchTerm, setSearchTerm] = useState("");
  const [loading, setLoading] = useState(true);
  const [classes, setClasses] = useState([]);
  const [subjects, setSubjects] = useState([]);
  const [syllabuses, setSyllabuses] = useState([]);
  const [filterClassId, setFilterClassId] = useState("");
  const [filterSubjectId, setFilterSubjectId] = useState("");
  const [isFilterOpen, setIsFilterOpen] = useState(false);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [modalType, setModalType] = useState("add"); // "add" | "edit"
  const [selectedSyllabus, setSelectedSyllabus] = useState(null);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);

  // Form States
  const [formData, setFormData] = useState({
    class_id: "",
    subject_id: "",
    description: "",
    status: "active",
  });

  const fetchData = async () => {
    setLoading(true);
    try {
      const [classRes, subjectRes] = await Promise.all([
        axiosInstance.get("/v1/classes"),
        axiosInstance.get("/v1/subjects"),
      ]);

      if (classRes.data.success) {
        setClasses(classRes.data.data);
      }
      if (subjectRes.data.success) {
        setSubjects(subjectRes.data.data);
      }

      const syllabusRes = await axiosInstance.get("/v1/syllabuses");
      if (syllabusRes.data.success) {
        setSyllabuses(syllabusRes.data.data);
      }
    } catch (err) {
      console.error("Error fetching data:", err);
      toast.error("Failed to fetch data");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  const openAddModal = () => {
    resetForm();
    setModalType("add");
    setIsModalOpen(true);
  };

  const openEditModal = (syllabus) => {
    setSelectedSyllabus(syllabus);
    setFormData({
      class_id: syllabus.class_id || "",
      subject_id: syllabus.subject_id || "",
      description: syllabus.description || "",
      status: syllabus.status || "active",
    });
    setModalType("edit");
    setIsModalOpen(true);
  };

  const openDeleteModal = (syllabus) => {
    setSelectedSyllabus(syllabus);
    setIsDeleteModalOpen(true);
  };

  const handleAction = async () => {
    try {
      if (modalType === "add") {
        const res = await axiosInstance.post("/v1/syllabuses", formData);
        if (res.data.success) {
          toast.success("Syllabus added successfully!");
          fetchData();
        }
      } else {
        const res = await axiosInstance.put(`/v1/syllabuses/${selectedSyllabus._id}`, formData);
        if (res.data.success) {
          toast.success("Syllabus updated successfully!");
          fetchData();
        }
      }
      setIsModalOpen(false);
      resetForm();
    } catch (err) {
      console.error("Error saving syllabus:", err);
      toast.error("Failed to save syllabus");
    }
  };

  const handleDelete = async () => {
    try {
      const res = await axiosInstance.delete(`/v1/syllabuses/${selectedSyllabus._id}`);
      if (res.data.success) {
        toast.success("Syllabus deleted successfully!");
        fetchData();
      }
      setIsDeleteModalOpen(false);
      setSelectedSyllabus(null);
    } catch (err) {
      console.error("Error deleting syllabus:", err);
      toast.error("Failed to delete syllabus");
    }
  };

  const handleDownload = (syllabus) => {
    // Basic download implementation: open a new window with the description (HTML) content
    const win = window.open('', '_blank');
    const className = classes.find(c => c._id === syllabus.class_id)?.name || "N/A";
    const subjectName = subjects.find(s => s._id === syllabus.subject_id)?.name || "N/A";

    win.document.write(`
      <!DOCTYPE html>
      <html>
        <head>
          <title>Syllabus - ${className} - ${subjectName}</title>
          <link href="https://fonts.googleapis.com/css2?family=Inter:wght@400;600;800&display=swap" rel="stylesheet">
          <link href="https://fonts.googleapis.com/css2?family=Amiri:wght@700&display=swap" rel="stylesheet">
          <style>
            @page {
              size: A4;
              margin: 20mm;
            }
            html {
              background-color: #f1f5f9;
            }
            body { 
              font-family: 'Inter', sans-serif; 
              line-height: 1.8; 
              color: #334155;
              width: 210mm;
              min-height: 297mm;
              margin: 30px auto;
              padding: 10mm;
              box-sizing: border-box;
              background-color: white;
              box-shadow: 0 10px 25px -5px rgba(0, 0, 0, 0.1), 0 8px 10px -6px rgba(0, 0, 0, 0.1);
            }
            .header-container {
              border-bottom: 3px solid #164366;
              padding-bottom: 8px;
              margin-bottom: 24px;
              text-align: center;
            }
            .header-top {
              display: flex;
              align-items: center;
              justify-content: center;
              gap: 8px;
              margin-bottom: -16px;
            }
            .header-top span:first-child {
              font-size: 25px;
              font-weight: 700;
              color: #164366;
              text-transform: uppercase;
              white-space: nowrap;
            }
            .header-top img {
              width: 60px;
              height: 60px;
              object-fit: contain;
            }
            .header-top span:last-child {
              font-size: 23px;
              font-family: 'Amiri', serif;
              font-weight: 700;
              color: #164366;
              white-space: nowrap;
              line-height: 1;
            }
            .header-title-bn {
              font-size: 35px;
              font-weight: 900;
              color: #1e293b;
              margin: 0;
            }
            .header-address, .header-estd {
              font-size: 13px;
              font-weight: 700;
              color: #334155;
              margin: 0;
            }
            .page-title-wrapper {
              text-align: center;
              margin-bottom: 32px;
            }
            .page-title {
              display: inline-block;
              font-size: 22px;
              font-weight: 900;
              color: #1e293b;
              border-bottom: 2px solid #1e293b;
              padding-bottom: 4px;
              text-transform: uppercase;
              letter-spacing: 1px;
              margin: 0;
            }
            .meta { 
              display: flex;
              justify-content: center;
              gap: 30px;
              font-size: 16px;
              font-weight: 600; 
              color: #64748b; 
              margin-bottom: 20px;
            }
            .meta p { margin: 0; }
            .meta span { color: #00315e; }
            .content { 
              margin-top: 30px; 
              font-size: 15px;
            }
            .content img {
              max-width: 100%;
              max-height: 400px;
              object-fit: contain;
              height: auto;
              border-radius: 8px;
              margin: 20px 0;
              page-break-inside: avoid;
            }
            .content ul, .content ol {
              padding-left: 20px;
            }
            .content p {
              margin-bottom: 15px;
            }
            .footer {
              margin-top: 60px;
              text-align: center;
              font-size: 12px;
              color: #94a3b8;
              border-top: 1px solid #e2e8f0;
              padding-top: 20px;
            }
            @media print {
              html { background-color: white; }
              body { 
                margin: 0; 
                padding: 0; 
                box-shadow: none;
                width: auto;
                min-height: auto;
              }
            }
          </style>
        </head>
        <body>
          <div class="header-container">
            <div class="header-top">
              <span>Pakunda Islamia Madrasa</span>
              <img src="/mlogo.jpg" alt="Logo" onerror="this.style.display='none'" />
              <span>الْمَدْرَسَةُ الْإِسْلَامِيَّةُ وَدَارُ الْأَيْتَامِ بِنَاكُونْدَا</span>
            </div>
            <h2 class="header-title-bn">পাকুন্ডা ইসলামিয়া মাদ্রাসা ও এতিমখানা</h2>
            <p class="header-address">পাকুন্ডা, সোনামুড়ী, নারায়ণগঞ্জ,</p>
            <p class="header-estd">স্থাপিত : ২০০০ খ্রি</p>
          </div>
          
          <div class="page-title-wrapper">
            <h3 class="page-title">Class Syllabus</h3>
          </div>

          <div class="meta">
            <p>Class: <span>${className}</span></p>
            <p>Subject: <span>${subjectName}</span></p>
          </div>

          <div class="content">
            ${syllabus.description}
          </div>
          <div class="footer">
            <p>Generated on ${new Date().toLocaleDateString()}</p>
          </div>
          <script>
            window.onload = function() { 
              setTimeout(function() { window.print(); }, 500);
            }
          </script>
        </body>
      </html>
    `);
    win.document.close();
  };

  const resetForm = () => {
    setFormData({
      class_id: "",
      subject_id: "",
      description: "",
      status: "active",
    });
    setSelectedSyllabus(null);
  };

  const filteredSyllabuses = syllabuses.filter((s) => {
    const className = classes.find(c => c._id === s.class_id)?.name || "";
    const subjectName = subjects.find(sub => sub._id === s.subject_id)?.name || "";

    const matchesSearch = className.toLowerCase().includes(searchTerm.toLowerCase()) ||
      subjectName.toLowerCase().includes(searchTerm.toLowerCase());

    const matchesClass = filterClassId ? s.class_id === filterClassId : true;
    const matchesSubject = filterSubjectId ? s.subject_id === filterSubjectId : true;

    return matchesSearch && matchesClass && matchesSubject;
  });

  return (
    <div className="animate-in fade-in duration-500">
      {/* Header */}
      <div className="flex items-center justify-between mb-5 w-full">
        <div>
          <h1 className="text-[20px] font-black text-slate-800 flex items-center gap-3">
            <ClipboardList className="w-8 h-8 text-[#00315e]" />
            Class Syllabus
          </h1>
          <p className=" text-[14px] text-slate-500 font-bold mt-1">
            Manage academic class syllabus
          </p>
        </div>

        <div className="flex flex-col md:flex-row items-center gap-4 w-full md:w-auto">
          <div className="relative w-full md:w-auto">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
            <input
              type="text"
              placeholder="Search by Title..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-10 pr-4 py-2 bg-[#fff] border border-slate-200 text-slate-900 rounded-[8px] outline-none focus:ring-0.5 focus:ring-blue-500 transition-all"
            />
          </div>

          <div className="relative w-full md:w-auto">
            <button
              onClick={() => setIsFilterOpen(!isFilterOpen)}
              className="px-4 py-2 w-full md:w-auto justify-center bg-white border border-slate-200 rounded-[8px] cursor-pointer flex items-center gap-2"
            >
              <Filter className="h-4 w-4" /> Filter
            </button>
            {isFilterOpen && (
              <div className="absolute top-[50px] right-0 z-[100] w-[300px] flex flex-col gap-4 bg-white border border-gray-200 p-4 rounded-[8px] shadow-lg">
                <SelectInputField
                  title="Filter by Class"
                  options={[{ value: "", label: "All Classes" }, ...classes.map(c => ({ value: c._id, label: c.name }))]}
                  value={filterClassId}
                  setValue={setFilterClassId}
                />
                <SelectInputField
                  title="Filter by Subject"
                  options={[{ value: "", label: "All Subjects" }, ...subjects.map(s => ({ value: s._id, label: s.name }))]}
                  value={filterSubjectId}
                  setValue={setFilterSubjectId}
                />
              </div>
            )}
          </div>


          <button
            onClick={openAddModal}
            className="w-full md:w-auto px-4 py-2 bg-[#00315e] text-white rounded-[8px] cursor-pointer flex items-center justify-center gap-2 whitespace-nowrap"
          >
            <Plus className="w-4 h-4" />
            Add Syllabus
          </button>
        </div>
      </div>

      {/* Syllabus List Table */}
      <div className="bg-white rounded-[8px] shadow-xl shadow-slate-100/50 overflow-hidden relative">
        {loading ? (
          <div className="flex-1 flex flex-col items-center justify-center py-20">
            <div className="w-12 h-12 border-4 border-[#00315e] border-t-transparent rounded-full animate-spin mb-4"></div>
            <p className="text-slate-500 font-bold">Loading syllabuses...</p>
          </div>
        ) : filteredSyllabuses.length === 0 ? (
          <div className="flex-1 flex flex-col items-center justify-center py-20">
            <div className="w-16 h-16 bg-slate-50 text-slate-400 rounded-full flex items-center justify-center mb-4">
              <Search className="w-8 h-8" />
            </div>
            <p className="text-slate-500 font-bold">No syllabus data found</p>
          </div>
        ) : (
          <div className="overflow-x-auto rounded-[8px]">
            <table className="w-full">
              <thead className="bg-[#00315e24]">
                <tr>
                  <th className="px-10 py-3.5 text-left text-[12px] font-black">
                    ID
                  </th>
                  <th className="px-10 py-3.5 text-center text-[12px] font-black">
                    Class
                  </th>
                  <th className="px-10 py-3.5 text-center text-[12px] font-black">
                    Subject
                  </th>
                  <th className="px-10 py-3.5 text-center text-[12px] font-black">
                    Status
                  </th>
                  <th className="px-10 py-3.5 text-center text-[12px] font-black">
                    Action
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y-2 divide-slate-50">
                {filteredSyllabuses.map((syllabus, i) => (
                  <tr
                    key={syllabus._id}
                    className="group hover:bg-amber-50/10 transition-all duration-300"
                  >
                    <td className="px-10 py-3.5 text-left">

                      {i + 1}

                    </td>
                    <td className="px-10 py-3.5 text-center">

                      {classes.find(c => c._id === syllabus.class_id)?.name || "N/A"}

                    </td>
                    <td className="px-10 py-3.5 text-center">
                      <span className="px-3 py-1 rounded-lg bg-slate-100 text-slate-500 text-xs font-bold">
                        {subjects.find(s => s._id === syllabus.subject_id)?.name || "N/A"}
                      </span>
                    </td>
                    <td className="px-10 py-3.5 text-center">
                      <div
                        className={`inline-flex items-center gap-2 px-3 py-1 rounded-lg border transition-all ${syllabus.status === "active"
                          ? "bg-blue-50 border-blue-100 text-blue-700"
                          : "bg-slate-50 border-slate-100 text-slate-400"
                          }`}
                      >
                        <span className="text-[10px] font-black uppercase tracking-widest">
                          {syllabus.status}
                        </span>
                      </div>
                    </td>
                    <td>
                      <div className="flex items-center gap-3 justify-center">
                        <button className="cursor-pointer" onClick={() => handleDownload(syllabus)}>
                          <Download className="w-4 h-4  text-[#00315e]" />
                        </button>
                        <button className="cursor-pointer" onClick={() => openEditModal(syllabus)}>
                          <SquarePen className="w-4 h-4  text-[#00315e]" />
                        </button>
                        <button className="cursor-pointer" onClick={() => openDeleteModal(syllabus)}>
                          <Trash2 className="w-4 h-4 text-red-500" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* Add/Edit Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 bg-slate-900/70 backdrop-blur-md z-[100] flex items-center justify-center p-6 sm:p-10">
          <div className="bg-white rounded-[8px] w-full max-w-lg shadow-[0_32px_64px_-16px_rgba(0,0,0,0.2)] animate-in fade-in zoom-in duration-300 overflow-hidden flex flex-col max-h-[90vh]">
            <div className="p-5 border-b-2 border-slate-50 flex items-center justify-between bg-gradient-to-r from-white to-slate-50/50">
              <h2 className="text-[20px] font-black text-slate-800 tracking-tight">
                {modalType === "add" ? "Add New Syllabus" : "Update Syllabus"}
              </h2>
              <button
                onClick={() => setIsModalOpen(false)}
                className="p-[2px] bg-slate-100 hover:bg-red-500 text-slate-500 hover:text-white rounded-2xl transition-all active:scale-90 cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="p-5 flex flex-col gap-4 overflow-y-auto flex-1">

              <div className="flex items-center justify-between gap-4 overflow-x-auto">
                <SelectInputField
                  title={'Class'}
                  options={classes.map(c => ({ value: c._id, label: c.name }))}
                  value={formData.class_id}
                  setValue={(val) => setFormData({ ...formData, class_id: val })}
                />
                <SelectInputField
                  title={'Subject'}
                  options={subjects.map(s => ({ value: s._id, label: s.name }))}
                  value={formData.subject_id}
                  setValue={(val) => setFormData({ ...formData, subject_id: val })}
                />
              </div>

              <RichTextEditor
                title="Description"
                value={formData.description}
                setValue={(val) => setFormData({ ...formData, description: val })}
                placeholder="Enter syllabus description..."
              />

              <SelectInputField
                title={'Status'}
                options={[{ value: "active", label: "Active" }, { value: "inactive", label: "Inactive" }]}
                value={formData.status}
                setValue={(val) => setFormData({ ...formData, status: val })}
              />

              <div className="flex items-end justify-end gap-4 mt-6">
                <button
                  onClick={() => setIsModalOpen(false)}
                  className=" px-4 py-2 bg-red-200 text-red-700 rounded-[8px] cursor-pointer"
                >
                  Cancel
                </button>

                <button
                  onClick={handleAction}
                  className=" px-4 py-2 bg-[#00315e] text-white rounded-[8px] cursor-pointer"
                >
                  {modalType === "add" ? "Add Syllabus" : "Update Syllabus"}
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Delete Confirmation Modal */}
      {isDeleteModalOpen && (
        <div className="fixed inset-0 bg-slate-900/70 backdrop-blur-md z-[100] flex items-center justify-center p-6">
          <div className="bg-white rounded-[8px] w-full max-w-md shadow-2xl animate-in fade-in zoom-in duration-300 overflow-hidden">
            <div className="p-6 text-center space-y-8">
              <div className="w-15 h-15 bg-rose-50 text-rose-500 rounded-[2.5rem] flex items-center justify-center mx-auto border-4 border-white shadow-2xl shadow-rose-100 relative">
                <div className="absolute inset-0 bg-rose-500 rounded-[2.5rem] animate-ping opacity-10" />
                <AlertCircle className="w-10 h-10 relative z-10" />
              </div>
              <div className="space-y-3">
                <h2 className="text-3xl font-black text-slate-800 tracking-tight">
                  Are you sure
                </h2>
                <p className="text-sm font-bold text-slate-400 px-6 leading-relaxed">
                  আপনি কি এই সিলেবাসটি মুছে ফেলতে চান?
                </p>
              </div>

              <div className="flex flex-col lg:flex-row gap-4 mt-4">
                <button
                  onClick={() => setIsDeleteModalOpen(false)}
                  className="w-full py-5 font-black text-slate-400 border border-slate-200 cursor-pointer hover:bg-slate-50 rounded-[8px] transition-all uppercase tracking-widest text-[14px]"
                >
                  Cancel
                </button>{" "}
                <button
                  onClick={handleDelete}
                  className="w-full py-5 bg-rose-500 text-white font-black cursor-pointer rounded-[8px] shadow-xl shadow-rose-200 hover:bg-rose-600 active:scale-95 transition-all uppercase tracking-widest text-[14px]"
                >
                  Delete
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default ClassSyllabus;
