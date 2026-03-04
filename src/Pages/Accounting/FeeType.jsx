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

const FeeType = () => {
  const [searchTerm, setSearchTerm] = useState("");
  const [loading, setLoading] = useState(true);
  const [feeTypes, setFeeTypes] = useState([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [modalType, setModalType] = useState("add"); // "add" | "edit"
  const [selectedFeeType, setSelectedFeeType] = useState(null);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);

  // Form State
  const [formData, setFormData] = useState({
    name: "",
    pay_type: "Monthly",
    status: "active"
  });

  useEffect(() => {
    fetchFeeTypes();
  }, []);

  const fetchFeeTypes = async () => {
    setLoading(true);
    try {
      const response = await axiosInstance.get("/fee-type/v1");
      if (response.data.success) {
        setFeeTypes(response.data.data);
      }
    } catch (error) {
      toast.error("Failed to fetch fee types");
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  const openAddModal = () => {
    setFormData({ name: "", pay_type: "Monthly", status: "active" });
    setModalType("add");
    setIsModalOpen(true);
  };

  const openEditModal = (feeType) => {
    setFormData({
      name: feeType.name,
      pay_type: feeType.pay_type,
      status: feeType.status
    });
    setSelectedFeeType(feeType);
    setModalType("edit");
    setIsModalOpen(true);
  };

  const openDeleteModal = (feeType) => {
    setSelectedFeeType(feeType);
    setIsDeleteModalOpen(true);
  };

  const handleAction = async () => {
    if (!formData.name) return toast.error("Please enter a fee type name");
    
    try {
      if (modalType === "add") {
        const response = await axiosInstance.post("/fee-type/v1", formData);
        if (response.data.success) {
          toast.success("Fee Type added successfully");
          fetchFeeTypes();
          setIsModalOpen(false);
        }
      } else {
        const response = await axiosInstance.put(`/fee-type/v1/${selectedFeeType._id}`, formData);
        if (response.data.success) {
          toast.success("Fee Type updated successfully");
          fetchFeeTypes();
          setIsModalOpen(false);
        }
      }
    } catch (error) {
      toast.error(error.response?.data?.message || "Operation failed");
    }
  };

  const handleDelete = async () => {
    try {
      const response = await axiosInstance.delete(`/fee-type/v1/${selectedFeeType._id}`);
      if (response.data.success) {
        toast.success("Fee Type deleted successfully");
        fetchFeeTypes();
        setIsDeleteModalOpen(false);
      }
    } catch (error) {
      toast.error("Failed to delete fee type");
    }
  };

  const filteredFeeTypes = feeTypes.filter(ft => 
    ft.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className=" animate-in fade-in duration-500 ">
      {/* Header */}
      <div className="flex items-center justify-between mb-5 w-full">
        <div>
          <h1 className="text-[20px] font-black text-slate-800 flex items-center gap-3">
            <Layers className="w-8 h-8 text-[#00bd7f]" />
            Fee Setup
          </h1>
          <p className=" text-[14px] text-slate-500 font-bold mt-1">
            Manage academic Fee setup
          </p>
        </div>

        <div className="flex gap-3 w-full md:w-auto">
          <button
            onClick={openAddModal}
           className="w-full px-4 py-2 bg-[#00bd7f] text-white rounded-[8px] cursor-pointer flex items-center gap-2 transition-all hover:bg-[#00a670] active:scale-95"
          >
            <Plus className="w-4 h-4" />
            Add Fee Type
          </button>
        </div>
      </div>

      {/* Fee Type List Table */}
      <div className="bg-white rounded-[8px] border-2 border-slate-100 shadow-xl shadow-slate-100/50 overflow-hidden relative">
        {loading ? (
          <div className="flex-1 flex flex-col items-center justify-center py-20">
            <div className="w-12 h-12 border-4 border-[#00bd7f] border-t-transparent rounded-full animate-spin mb-4"></div>
            <p className="text-slate-500 font-bold">Loading fee types...</p>
          </div>
        ) : (
            <div className="overflow-x-auto border border-gray-200 rounded-[8px]">
              <div className="p-4 flex items-center justify-between border-b border-b-gray-200">
                <h2 className="text-[18px] font-semibold">Fee Type List</h2>

                <div>
                   <div className="flex items-center gap-4">
          
            <div className="relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
              <input
                type="text"
                placeholder="Search by Fee Type Name..."
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
                  <th className="px-10 py-3.5 text-left text-[12px] font-black uppercase tracking-wider">
                    Name
                  </th>
                  <th className="px-10 py-3.5 text-center text-[12px] font-black uppercase tracking-wider">
                    Pay Type
                  </th>
                  <th className="px-10 py-3.5 text-center text-[12px] font-black uppercase tracking-wider">
                    Status
                  </th>
                  <th className="px-10 py-3.5 text-center text-[12px] font-black uppercase tracking-wider">
                    Action
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y-2 divide-slate-50">
                {filteredFeeTypes.length > 0 ? (
                  filteredFeeTypes.map((ft) => (
                    <tr
                      key={ft._id}
                      className="group hover:bg-emerald-50/30 transition-all duration-300"
                    >
                      <td className="px-10 py-3.5">
                        <span 
                          onClick={() => openEditModal(ft)}
                          className="text-base font-black text-slate-800 tracking-tight cursor-pointer hover:text-[#00bd7f] transition-colors"
                        >
                          {ft.name}
                        </span>
                      </td>
                      <td className="px-10 py-3.5 text-center">
                        <span className="px-3 py-1 rounded-lg bg-emerald-50 text-[#00bd7f] text-xs font-bold">
                          {ft.pay_type}
                        </span>
                      </td>
                      <td className="px-10 py-3.5 text-center">
                        <div
                          className={`inline-flex items-center gap-2 px-3 py-1 rounded-lg border transition-all ${
                            ft.status === "active"
                              ? "bg-emerald-50 border-emerald-100 text-emerald-600"
                              : "bg-slate-50 border-slate-100 text-slate-400"
                          }`}
                        >
                          <span className="text-[10px] font-black uppercase tracking-widest">
                            {ft.status}
                          </span>
                        </div>
                      </td>
                      <td>
                        <div className="flex items-center gap-3 justify-center">
                          <button className="cursor-pointer p-1.5 hover:bg-emerald-50 rounded-lg transition-colors" onClick={() => openEditModal(ft)}>
                           <SquarePen className="w-4 h-4 text-[#00bd7f]" />
                          </button>
                          <button className="cursor-pointer p-1.5 hover:bg-red-50 rounded-lg transition-colors" onClick={() => openDeleteModal(ft)}>
                           <Trash2 className="w-4 h-4 text-red-500" />
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan="4" className="px-10 py-10 text-center text-slate-400 font-bold">
                      No Fee Types found.
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
                {modalType === "add" ? "Add Fee Type" : "Update Fee Type"}
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
                title={'Fee Type Name'} 
                placeholder={'Enter fee type name (e.g., Admission Fee)'} 
                value={formData.name}
                setValue={(val) => setFormData({...formData, name: val})}
              />
               <SelectInputField 
                title={'Pay Type'} 
                options={[
                  {value:"On Time", label: "On Time"},
                  {value:"Monthly", label: "Monthly"},
                  {value:"Annual", label: "Annual"}
                ]}
                value={formData.pay_type}
                
              
               setValue={(val) => setFormData({ ...formData, pay_type: val })}
                
               />
               <SelectInputField 
                title={'Status'} 
                options={[
                  {value:"active", label: "Active"},
                  {value:"inactive", label: "Inactive"}
                ]}
                value={formData.status}
                
               setValue={(val) => setFormData({ ...formData, status: val })}
               />

              <div className="flex items-center justify-end gap-3 mt-4 pt-4 border-t border-slate-50">
                <button
                  onClick={() => setIsModalOpen(false)}
                  className="px-6 py-2.5 bg-slate-100 text-slate-600 rounded-[8px] font-bold hover:bg-slate-200 transition-all cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  onClick={handleAction}
                  className="px-6 py-2.5 bg-[#00bd7f] text-white rounded-[8px] font-bold hover:bg-[#00a670] shadow-lg shadow-emerald-200 transition-all active:scale-95 cursor-pointer"
                >
                  {modalType === "add" ? "Save Fee Type" : "Update changes"}
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
                  Are you sure you want to delete fee type <span className="font-bold text-slate-700">{selectedFeeType?.name}</span>?
                </p>
                <p className="text-xs text-red-400">This action cannot be undone.</p>
              </div>
              <div className="flex gap-3">
                <button
                  onClick={() => setIsDeleteModalOpen(false)}
                  className="flex-1 py-2.5 bg-slate-100 text-slate-600 rounded-[8px] font-bold hover:bg-slate-200 cursor-pointer transition-all"
                >
                  Cancel
                </button>
                <button
                  onClick={handleDelete}
                  className="flex-1 py-2.5 bg-red-500 text-white rounded-[8px] font-bold hover:bg-red-600 shadow-lg shadow-red-100 cursor-pointer transition-all active:scale-95"
                >
                  Delete Now
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};


export default FeeType;
