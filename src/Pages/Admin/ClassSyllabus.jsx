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
  const [isExportModalOpen, setIsExportModalOpen] = useState(false);
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
      <html>
        <head>
          <title>Syllabus - ${className} - ${subjectName}</title>
          <style>
            body { font-family: Arial, sans-serif; padding: 40px; line-height: 1.6; }
            h1 { color: #00bd7f; border-bottom: 2px solid #00bd7f; padding-bottom: 10px; }
            .meta { font-weight: bold; margin-bottom: 20px; color: #64748b; }
            .content { margin-top: 30px; }
          </style>
        </head>
        <body>
          <h1>Class Syllabus</h1>
          <div class="meta">
            <p>Class: ${className}</p>
            <p>Subject: ${subjectName}</p>
          </div>
          <div class="content">
            ${syllabus.description}
          </div>
          <script>
            window.onload = function() { window.print(); }
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
    return className.toLowerCase().includes(searchTerm.toLowerCase()) || 
           subjectName.toLowerCase().includes(searchTerm.toLowerCase());
  });

  return (
    <div className=" animate-in fade-in duration-500 ">
      {/* Header */}
      <div className="flex items-center justify-between mb-5 w-full">
        <div>
          <h1 className="text-[20px] font-black text-slate-800 flex items-center gap-3">
            <ClipboardList className="w-8 h-8 text-[#00bd7f]" />
            Class Syllabus
          </h1>
          <p className=" text-[14px] text-slate-500 font-bold mt-1">
            Manage academic class syllabus
          </p>
        </div>

        <div className="flex gap-3 w-full md:w-auto">
          <div className="relative">
             <button
                onClick={()=>setIsExportModalOpen(!isExportModalOpen)}
                className=" px-4 py-2 bg-[#e6f4ef]  rounded-[8px] cursor-pointer flex items-center gap-2"
          >
            <File className="h-4 w-4"/>
                Export
            </button>
            
            {
              isExportModalOpen && <div className="absolute top-[50px] right-0 z-[100]  whitespace-nowrap flex flex-col gap-2 bg-white border border-gray-200 p-4 rounded-[8px] shadow-lg"> 
                <button 
                  onClick={() => {
                    toast.success("Exporting as PDF...");
                    setIsExportModalOpen(false);
                  }}
                  className="hover:text-[#00bd7f] transition-colors cursor-pointer text-left"
                >  
                  Export as PDF
                </button>
                <button 
                  onClick={() => {
                    toast.success("Exporting as Excel...");
                    setIsExportModalOpen(false);
                  }}
                  className="hover:text-[#00bd7f] transition-colors cursor-pointer text-left"
                >
                  Export as Excel
                </button>
              </div>
            }
          </div>
          <button
            onClick={openAddModal}
           className="w-full px-4 py-2 bg-[#00bd7f] text-white rounded-[8px] cursor-pointer flex items-center gap-2"
          >
            <Plus className="w-4 h-4" />
            Add Syllabus
          </button>
        </div>
      </div>

      {/* Syllabus List Table */}
      <div className="bg-white rounded-[8px] border-2 border-slate-100 shadow-xl shadow-slate-100/50 overflow-hidden relative">
        {loading ? (
          <div className="flex-1 flex flex-col items-center justify-center py-20">
            <div className="w-12 h-12 border-4 border-[#00bd7f] border-t-transparent rounded-full animate-spin mb-4"></div>
            <p className="text-slate-500 font-bold">Loading syllabuses...</p>
          </div>
        ) : (
            <div className="overflow-x-auto border border-gray-200 rounded-[8px]">
              <div className="p-4 flex items-center justify-between border-b border-b-gray-200">
                <h2 className="text-[18px] font-semibold">Syllabus List</h2>

                <div>
                   <div className="flex items-center gap-4">
          
            <div className="relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
              <input
                type="text"
                placeholder="Search by Title..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-10 pr-4 py-2 bg-[#e6f4ef] border border-slate-200 text-slate-900 rounded-[8px] outline-none focus:ring-0.5 focus:ring-emerald-500 transition-all"
              />
                    </div>
                     <button
                        onClick={() => toast.success("Filter feature coming soon!")}
                        className=" px-4 py-2 bg-[#e6f4ef]  rounded-[8px] cursor-pointer flex items-center gap-2"
                      >
                      <Filter className="h-4 w-4"/>  Filter
                </button>
          </div>
                </div>
              </div>
            <table className="w-full">
              <thead className="bg-[#e6f4ef]">
                <tr>
                
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
                {filteredSyllabuses.length > 0 ? filteredSyllabuses.map((syllabus) => (
                  <tr
                    key={syllabus._id}
                    className="group hover:bg-amber-50/10 transition-all duration-300"
                  >
                    <td className="px-10 py-3.5 text-center">
                      <span className="px-3 py-1 rounded-lg bg-slate-100 text-slate-500 text-xs font-bold">
                        {classes.find(c => c._id === syllabus.class_id)?.name || "N/A"}
                      </span>
                    </td>
                    <td className="px-10 py-3.5 text-center">
                      <span className="px-3 py-1 rounded-lg bg-slate-100 text-slate-500 text-xs font-bold">
                        {subjects.find(s => s._id === syllabus.subject_id)?.name || "N/A"}
                      </span>
                    </td>
                    <td className="px-10 py-3.5 text-center">
                      <div
                        className={`inline-flex items-center gap-2 px-3 py-1 rounded-lg border transition-all ${
                          syllabus.status === "active"
                            ? "bg-emerald-50 border-emerald-100 text-emerald-600"
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
                         <Download className="w-4 w-4  text-[#00bd7f]" />
                        </button>
                        <button className="cursor-pointer" onClick={() => openEditModal(syllabus)}>
                         <SquarePen className="w-4 w-4  text-[#00bd7f]" />
                        </button>
                        <button className="cursor-pointer" onClick={() => openDeleteModal(syllabus)}>
                         <Trash2 className="w-4 w-4 text-red-500" />
                        </button>
                      </div>
                    </td>
                  </tr>
                )) : (
                  <tr>
                    <td colSpan="5" className="px-10 py-20 text-center text-slate-500 font-bold">
                      No syllabus data available. Click "Add Syllabus" to create one.
                    </td>
                  </tr>
                )}
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

            <div className="p-5 flex flex-col gap-4">
             

              <div className="flex items-center justify-between gap-4">
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
                options={[{value:"active", label: "Active"},{value:"inactive", label: "Inactive"}]}
                value={formData.status}
                setValue={(val) => setFormData({ ...formData, status: val })}
               />

              <div className="flex items-end justify-end gap-4 mt-2.5">
                <button
                  onClick={() => setIsModalOpen(false)}
                  className=" px-4 py-2 bg-[#e6f4ef]  rounded-[8px] cursor-pointer"
                >
                  Cancel
                </button>

                <button
                  onClick={handleAction}
                  className=" px-4 py-2 bg-[#00bd7f] text-white rounded-[8px] cursor-pointer"
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
            <div className="p-8 text-center space-y-6">
               <div className="w-16 h-16 bg-red-50 text-red-500 rounded-full flex items-center justify-center mx-auto">
                 <Trash2 className="w-8 h-8" />
               </div>
              <div className="space-y-2">
                <h2 className="text-xl font-bold text-slate-800">Confirm Deletion</h2>
                <p className="text-slate-500">
                  Are you sure you want to delete this syllabus?
                </p>
              </div>
              <div className="flex gap-3">
                <button
                  onClick={() => setIsDeleteModalOpen(false)}
                  className="flex-1 py-2 bg-slate-100 text-slate-600 rounded-[8px] font-bold cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  onClick={handleDelete}
                  className="flex-1 py-2 bg-red-500 text-white rounded-[8px] font-bold cursor-pointer"
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
