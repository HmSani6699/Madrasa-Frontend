import { useState, useEffect } from "react";
import {
  Plus,
  Search,

  Filter,

  Trash2,

  Layers,

  X,
  
  File,

  SquarePen,
} from "lucide-react";
import axiosInstance from "../../api/axiosInstance";
import { toast } from "react-hot-toast";
import InputField from "../../components/InputField";
import SelectInputField from "../../components/SelectInputField";

const ClassList = () => {
  const [searchTerm, setSearchTerm] = useState("");
  const [loading, setLoading] = useState(true);
  const [sections, setSections] = useState([]);
  const [classes, setClasses] = useState([]);
  const [isExportModalOpen, setIsExportModalOpen] = useState(false);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [modalType, setModalType] = useState("add"); // "add" | "edit"
  const [selectedClass, setSelectedClass] = useState(null);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);

  // Form States
  const [formData, setFormData] = useState({
    name: "",
    
    section_id: "", // Store selected section ID
    students: "",
    subjects: "",
    status: "active",
  });

  const fetchData = async () => {
    setLoading(true);
    try {
      const [classRes, sectionRes] = await Promise.all([
        axiosInstance.get("/v1/classes"),
        axiosInstance.get("/v1/sections")
      ]);
      
      if (classRes.data.success) {
        setClasses(classRes.data.data);
      }
      if (sectionRes.data.success) {
        setSections(sectionRes.data.data);
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

  const openEditModal = (cls) => {
    setSelectedClass(cls);
    setFormData({
      name: cls.name || "",
      
      section_id: cls.section_id || "", 
      students: cls.students || "",
      subjects: cls.subjects || "",
      status: cls.status || "active",
    });
    setModalType("edit");
    setIsModalOpen(true);
  };

  const openDeleteModal = (cls) => {
    setSelectedClass(cls);
    setIsDeleteModalOpen(true);
  };

  const handleAction = async () => {
    try {
      if (modalType === "add") {
        const response = await axiosInstance.post("/v1/classes", formData);
        if (response.data.success) {
          toast.success("Class added successfully!");
          fetchData();
        }
      } else {
        const response = await axiosInstance.put(`/v1/classes/${selectedClass._id}`, formData);
        if (response.data.success) {
          toast.success("Class updated successfully!");
          fetchData();
        }
      }
      setIsModalOpen(false);
      resetForm();
    } catch (err) {
      console.error("Action error:", err);
      toast.error("Operation failed");
    }
  };

  const handleDelete = async () => {
    try {
      const response = await axiosInstance.delete(`/v1/classes/${selectedClass._id}`);
      if (response.data.success) {
        toast.success("Class deleted successfully!");
        fetchData();
      }
      setIsDeleteModalOpen(false);
      setSelectedClass(null);
    } catch (err) {
      console.error("Delete error:", err);
      toast.error("Failed to delete class");
    }
  };

  const resetForm = () => {
    setFormData({
      name: "",
      level: "Primary",
      section_id: "",
      students: "",
      subjects: "",
      status: "active",
    });
    setSelectedClass(null);
  };

  const filteredClasses = Array.isArray(classes) ? classes.filter((c) =>
    c.name.toLowerCase().includes(searchTerm.toLowerCase())
  ) : [];

  return (
    <div className=" animate-in fade-in duration-500 ">
      {/* Header */}
      <div className="flex items-center justify-between mb-5 w-full">
        <div>
          <h1 className="text-[20px] font-black text-slate-800 flex items-center gap-3">
            <Layers className="w-8 h-8 text-[#00bd7f]" />
            Class Name
          </h1>
          <p className=" text-[14px] text-slate-500 font-bold mt-1">
            Manage academic class Name
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
            Add Class
          </button>
        </div>
      </div>

      {/* Class List Table */}
      <div className="bg-white rounded-[8px] border-2 border-slate-100 shadow-xl shadow-slate-100/50 overflow-hidden relative">
        {loading ? (
          <div className="flex-1 flex flex-col items-center justify-center py-20">
            <div className="w-12 h-12 border-4 border-[#00bd7f] border-t-transparent rounded-full animate-spin mb-4"></div>
            <p className="text-slate-500 font-bold">Loading classes...</p>
          </div>
        ) : (
            <div className="overflow-x-auto border border-gray-200 rounded-[8px]">
              <div className="p-4 flex items-center justify-between border-b border-b-gray-200">
                <h2 className="text-[18px] font-semibold">Class Name List</h2>

                <div>
                   <div className="flex items-center gap-4">
          
            <div className="relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
              <input
                type="text"
                placeholder="Search by Class Name..."
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
                  <th className="px-10 py-3.5 text-left text-[12px] font-black">
                    Name
                  </th>
                  <th className="px-10 py-3.5 text-center text-[12px] font-black">
                 Section
                  </th>
                  <th className="px-10 py-3.5 text-center text-[12px] font-black">
                    Students
                  </th>
                  <th className="px-10 py-3.5 text-center text-[12px] font-black">
                    Subjects
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
                {filteredClasses.map((cls) => (
                  <tr
                    key={cls._id}
                    className="group hover:bg-amber-50/10 transition-all duration-300"
                  >
                    <td className="px-10 py-3.5">
                      <span 
                        onClick={() => openEditModal(cls)}
                        className="text-base font-black text-slate-800 tracking-tight cursor-pointer hover:text-[#00bd7f] transition-colors"
                      >
                        {cls.name}
                      </span>
                    </td>
                    <td className="px-10 py-3.5 text-center">
                      <span className="px-3 py-1 rounded-lg bg-slate-100 text-slate-500 text-xs font-bold">
                        {sections.find(s => s._id === cls.section_id)?.name || "N/A"}
                      </span>
                    </td>
                    <td className="px-10 py-3.5 text-center">
                      <span className="text-sm font-bold text-slate-500">
                        {cls.students}
                      </span>
                    </td>
                    <td className="px-10 py-3.5 text-center">
                      <span className="text-sm font-bold text-slate-500">
                        {cls.subjects}
                      </span>
                    </td>
                    <td className="px-10 py-3.5 text-center">
                      <div
                        className={`inline-flex items-center gap-2 px-3 py-1 rounded-lg border transition-all ${
                          cls.status === "active"
                            ? "bg-emerald-50 border-emerald-100 text-emerald-600"
                            : "bg-slate-50 border-slate-100 text-slate-400"
                        }`}
                      >
                        <span className="text-[10px] font-black uppercase tracking-widest">
                          {cls.status}
                        </span>
                      </div>
                    </td>
                    <td>
                      <div className="flex items-center gap-3 justify-center">
                        <button className="cursor-pointer" onClick={() => openEditModal(cls)}>
                         <SquarePen className="w-4 w-4  text-[#00bd7f]" />
                        </button>
                        <button className="cursor-pointer" onClick={() => openDeleteModal(cls)}>
                         <Trash2 className="w-4 w-4 text-red-500" />
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
                {modalType === "add" ? "Add New Class" : "Update Class"}
              </h2>
              <button
                onClick={() => setIsModalOpen(false)}
                className="p-[2px] bg-slate-100 hover:bg-red-500 text-slate-500 hover:text-white rounded-2xl transition-all active:scale-90 cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="p-5 flex flex-col gap-4">

              <InputField 
                title={'Class Name'} 
                placeholder={'Enter your calss name'} 
                value={formData.name}
                setValue={(val) => setFormData({ ...formData, name: val })}
              />
            
                <SelectInputField 
                    title={'Section'} 
                    options={sections.map(s => ({ value: s._id, label: s.name }))} 
                    value={formData.section_id}
                    setValue={(val) => setFormData({ ...formData, section_id: val })}
                />
             
              <div className="flex items-center justify-between gap-4">
                  <InputField 
                    title={'No of Students'} 
                    placeholder={'Enter your  number'} 
                    type={'number'}
                    value={formData.students}
                    setValue={(val) => setFormData({ ...formData, students: parseInt(val) || 0 })}
                  />
                  <InputField 
                    title={'No of Subjects'} 
                    placeholder={'Enter your  number'} 
                    type={'number'} 
                    value={formData.subjects}
                    setValue={(val) => setFormData({ ...formData, subjects: parseInt(val) || 0 })}
                  />
              </div>
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
                {modalType === "add" ? "Add Class" : "Update Class"}
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
                  Are you sure you want to delete class <span className="font-bold text-slate-700">{selectedClass?.name}</span>?
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

export default ClassList;
