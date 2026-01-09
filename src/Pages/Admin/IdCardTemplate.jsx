import { useState } from "react";
import { 
  Plus, 
  Search, 
  CreditCard, 
  Settings2, 
  Layout, 
  Palette, 
  Type, 
  CheckCircle2, 
  MoreVertical, 
  Edit3, 
  Trash2,
  AlertCircle,
  X,
  ShieldCheck,
  ChevronRight,
  Filter,
  Image as ImageIcon,
  Smartphone,
  Check
} from "lucide-react";

const IdCardTemplate = () => {
  const [searchTerm, setSearchTerm] = useState("");
  
  // Modal States
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [modalType, setModalType] = useState("add"); // "add" | "edit"
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);

  // Focus States
  const [selectedTemplate, setSelectedTemplate] = useState(null);

  // Form States
  const [formData, setFormData] = useState({
    name: "Classic Student Card",
    title: "Student ID Card",
    headerColor: "#4f46e5",
    footerColor: "#4f46e5",
    textColor: "#ffffff",
    layout: "vertical", // vertical | horizontal
    fields: ["Student Name", "Admission No", "Class", "Section", "Roll No", "Blood Group"],
    status: "active"
  });

  // Sample Data
  const [templates, setTemplates] = useState([
    { 
      id: 1, 
      name: "Classic Student Card", 
      title: "Student ID Card",
      headerColor: "#4f46e5",
      footerColor: "#4f46e5",
      textColor: "#ffffff",
      layout: "vertical",
      fields: ["Student Name", "Admission No", "Class", "Section", "Roll No"],
      status: "active" 
    },
    { 
      id: 2, 
      name: "Professional Employee Card", 
      title: "Employee ID Card",
      headerColor: "#0f172a",
      footerColor: "#0f172a",
      textColor: "#ffffff",
      layout: "horizontal",
      fields: ["Employee Name", "Employee ID", "Designation", "Department"],
      status: "active" 
    },
  ]);

  const availableFields = [
    "Student Name", "Admission No", "Class", "Section", "Roll No", 
    "Blood Group", "Date of Birth", "Father's Name", "Mother's Name",
    "Emergency Contact", "Address", "Employee ID", "Designation", "Department"
  ];

  // Handlers
  const toggleField = (field) => {
    setFormData(prev => ({
      ...prev,
      fields: prev.fields.includes(field)
        ? prev.fields.filter(f => f !== field)
        : [...prev.fields, field]
    }));
  };

  const handleAction = () => {
    if (modalType === "add") {
      const newTemplate = {
        id: Date.now(),
        ...formData
      };
      setTemplates([...templates, newTemplate]);
    } else {
      setTemplates(templates.map(t => t.id === selectedTemplate.id ? { ...t, ...formData } : t));
    }
    setIsModalOpen(false);
    resetForm();
  };

  const handleDelete = () => {
    setTemplates(templates.filter(t => t.id !== selectedTemplate.id));
    setIsDeleteModalOpen(false);
    setSelectedTemplate(null);
  };

  const openAddModal = () => {
    resetForm();
    setModalType("add");
    setIsModalOpen(true);
  };

  const openEditModal = (template) => {
    setSelectedTemplate(template);
    setFormData({
      name: template.name,
      title: template.title,
      headerColor: template.headerColor,
      footerColor: template.footerColor,
      textColor: template.textColor,
      layout: template.layout,
      fields: template.fields,
      status: template.status
    });
    setModalType("edit");
    setIsModalOpen(true);
  };

  const openDeleteModal = (template) => {
    setSelectedTemplate(template);
    setIsDeleteModalOpen(true);
  };

  const resetForm = () => {
    setFormData({
      name: "",
      title: "Student ID Card",
      headerColor: "#4f46e5",
      footerColor: "#4f46e5",
      textColor: "#ffffff",
      layout: "vertical",
      fields: [],
      status: "active"
    });
    setSelectedTemplate(null);
  };

  const filteredTemplates = templates.filter(t => 
    t.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="space-y-10 animate-in fade-in duration-500 p-6 md:p-10">
      {/* Header */}
      <div className="bg-white rounded-[3rem] border-2 border-slate-200 p-10 flex flex-col lg:flex-row justify-between items-center gap-8 shadow-sm relative overflow-hidden">
        <div className="flex items-center gap-8 relative z-10">
          <div className="w-20 h-20 bg-indigo-50 rounded-[2rem] flex items-center justify-center border-2 border-indigo-100/50 shadow-inner">
            <CreditCard className="w-10 h-10 text-indigo-600" />
          </div>
          <div>
            <h1 className="text-3xl md:text-4xl font-black text-slate-800 tracking-tight text-center lg:text-left">ID Card Templates</h1>
            <p className="text-slate-500 font-bold mt-2 text-lg text-center lg:text-left">Design and manage identification card layouts</p>
          </div>
        </div>

        <button 
          onClick={openAddModal}
          className="w-full lg:w-auto px-10 py-5 bg-indigo-600 text-white rounded-[1.5rem] font-black shadow-2xl shadow-indigo-100 hover:bg-indigo-700 hover:scale-[1.02] active:scale-95 transition-all flex items-center justify-center gap-3 group relative z-10"
        >
          <Plus className="w-6 h-6 group-hover:rotate-90 transition-transform" />
          Create Template
        </button>
      </div>

      {/* Toolbar */}
      <div className="flex flex-col lg:flex-row gap-6">
        <div className="flex-1 bg-white rounded-[2.5rem] border-2 border-slate-100 p-3 flex items-center shadow-sm">
            <div className="px-5 text-slate-400">
               <Search className="w-5 h-5" />
            </div>
            <input 
              placeholder="Search templates by name..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="flex-1 bg-transparent border-none outline-none text-sm font-bold text-slate-800 placeholder:text-slate-300"
            />
            <div className="h-10 w-px bg-slate-100 mx-2 hidden lg:block" />
            <button className="px-6 py-3 text-slate-400 hover:text-indigo-600 transition-colors hidden lg:flex items-center gap-2 font-black text-[10px] uppercase tracking-widest">
                <Filter className="w-4 h-4" /> Filter By Type
            </button>
        </div>
      </div>

      {/* Templates Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-8">
        {filteredTemplates.map((template) => (
          <div key={template.id} className="group bg-white rounded-[3rem] border-2 border-slate-100 shadow-xl shadow-slate-100/20 hover:border-indigo-500/20 transition-all duration-300 overflow-hidden flex flex-col relative">
            {/* Action Bar */}
            <div className="absolute top-6 right-6 flex gap-2 translate-y-3 opacity-0 group-hover:translate-y-0 group-hover:opacity-100 transition-all z-20">
                <button 
                    onClick={() => openEditModal(template)}
                    className="p-3 bg-white border-2 border-slate-100 text-slate-400 hover:text-indigo-600 hover:border-indigo-100 rounded-2xl transition-all shadow-lg"
                >
                    <Edit3 className="w-4 h-4" />
                </button>
                <button 
                    onClick={() => openDeleteModal(template)}
                    className="p-3 bg-white border-2 border-slate-100 text-slate-400 hover:text-rose-600 hover:border-rose-100 rounded-2xl transition-all shadow-lg"
                >
                    <Trash2 className="w-4 h-4" />
                </button>
            </div>

            <div className="p-8 space-y-6">
              {/* Preview Box */}
              <div className="aspect-[3/4] bg-slate-50 rounded-[2rem] border-2 border-dashed border-slate-200 flex items-center justify-center relative overflow-hidden group-hover:border-indigo-200 transition-colors">
                 {/* Mock ID Card */}
                 <div className={`w-4/5 ${template.layout === 'vertical' ? 'h-4/5' : 'h-3/5'} bg-white rounded-xl shadow-inner border border-slate-100 flex flex-col overflow-hidden`}>
                    <div style={{ backgroundColor: template.headerColor }} className="h-1/5 flex items-center justify-center p-2">
                        <span style={{ color: template.textColor }} className="text-[8px] font-black uppercase tracking-widest text-center leading-none">{template.title}</span>
                    </div>
                    <div className="flex-1 p-4 flex flex-col items-center gap-2">
                        <div className="w-12 h-12 bg-slate-100 rounded-lg flex items-center justify-center border border-slate-200">
                            <ImageIcon className="w-6 h-6 text-slate-300" />
                        </div>
                        <div className="w-full space-y-1">
                            <div className="h-2 bg-slate-100 rounded-full w-3/4 mx-auto" />
                            <div className="h-1.5 bg-slate-50 rounded-full w-1/2 mx-auto" />
                        </div>
                        <div className="w-full mt-2 grid grid-cols-2 gap-1 px-2">
                            <div className="h-1 bg-slate-50 rounded-full" />
                            <div className="h-1 bg-slate-50 rounded-full" />
                            <div className="h-1 bg-slate-50 rounded-full" />
                            <div className="h-1 bg-slate-50 rounded-full" />
                        </div>
                    </div>
                    <div style={{ backgroundColor: template.footerColor }} className="h-[10%] flex items-center justify-center">
                        <div className="w-1/2 h-1 bg-white/20 rounded-full" />
                    </div>
                 </div>
              </div>

              <div className="space-y-2">
                 <h2 className="text-xl font-black text-slate-800 group-hover:text-indigo-600 transition-colors uppercase tracking-tight">{template.name}</h2>
                 <div className="flex items-center gap-2">
                     <span className={`px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-widest ${
                         template.layout === 'vertical' ? 'bg-amber-50 text-amber-600' : 'bg-emerald-50 text-emerald-600'
                     }`}>
                         {template.layout} Layout
                     </span>
                     <span className="text-[10px] font-black text-slate-400 border-l-2 border-slate-100 pl-2 uppercase tracking-widest">
                         {template.fields.length} Fields
                     </span>
                 </div>
              </div>
            </div>

            <div className="mt-auto px-8 py-5 bg-slate-50/50 flex items-center justify-between border-t-2 border-slate-50">
                <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">
                    Status: <span className="text-emerald-500">{template.status}</span>
                </p>
                <div className="flex items-center gap-2 text-indigo-500 group-hover:translate-x-1 transition-transform">
                    <span className="text-xs font-black uppercase tracking-tighter">Edit Design</span>
                    <ChevronRight className="w-4 h-4" />
                </div>
            </div>
          </div>
        ))}
      </div>

      {/* Add/Edit Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 bg-slate-900/70 backdrop-blur-md z-[100] flex items-center justify-center p-6 lg:p-10">
          <div className="bg-white rounded-[3rem] w-full max-w-5xl shadow-2xl animate-in scale-in duration-300 overflow-hidden flex flex-col max-h-[90vh]">
             <div className="p-10 border-b-2 border-slate-50 flex items-center justify-between shrink-0">
                <div className="flex items-center gap-5">
                    <div className="w-14 h-14 bg-indigo-50 text-indigo-600 rounded-2xl flex items-center justify-center border-2 border-indigo-100/50 shadow-inner">
                        <Settings2 className="w-8 h-8" />
                    </div>
                    <div>
                        <h2 className="text-2xl font-black text-slate-800 tracking-tight">
                            {modalType === 'add' ? 'Design ID Card Template' : 'Edit Template Design'}
                        </h2>
                        <p className="text-xs font-black text-slate-400 uppercase tracking-widest mt-1">Template Configuration & Visuals</p>
                    </div>
                </div>
                <button onClick={() => setIsModalOpen(false)} className="p-4 bg-slate-50 hover:bg-slate-100 text-slate-400 rounded-2xl transition-all">
                    <X className="w-6 h-6" />
                </button>
             </div>
             
             <div className="p-10 space-y-10 overflow-y-auto custom-scrollbar">
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
                    {/* Left Side: Configuration */}
                    <div className="space-y-8">
                        {/* Section 1: Basic Info */}
                        <div className="space-y-6">
                            <div className="flex items-center gap-3">
                                <div className="w-8 h-8 bg-slate-900 text-white rounded-full flex items-center justify-center text-[10px] font-black">01</div>
                                <h3 className="text-sm font-black text-slate-800 uppercase tracking-widest">Metadata</h3>
                            </div>
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                <div className="space-y-2">
                                    <label className="text-[10px] font-black text-slate-400 uppercase">Template Name</label>
                                    <input 
                                        type="text"
                                        value={formData.name}
                                        onChange={(e) => setFormData({...formData, name: e.target.value})}
                                        placeholder="e.g. Classic Student"
                                        className="w-full bg-slate-50 border-2 border-slate-100 rounded-2xl px-6 py-4 text-sm font-bold focus:border-indigo-500 outline-none transition-all"
                                    />
                                </div>
                                <div className="space-y-2">
                                    <label className="text-[10px] font-black text-slate-400 uppercase">Card Title</label>
                                    <input 
                                        type="text"
                                        value={formData.title}
                                        onChange={(e) => setFormData({...formData, title: e.target.value})}
                                        placeholder="e.g. Student ID Card"
                                        className="w-full bg-slate-50 border-2 border-slate-100 rounded-2xl px-6 py-4 text-sm font-bold focus:border-indigo-500 outline-none transition-all"
                                    />
                                </div>
                            </div>
                        </div>

                        {/* Section 2: Visuals */}
                        <div className="space-y-6">
                            <div className="flex items-center gap-3">
                                <div className="w-8 h-8 bg-slate-900 text-white rounded-full flex items-center justify-center text-[10px] font-black">02</div>
                                <h3 className="text-sm font-black text-slate-800 uppercase tracking-widest">Visual Style</h3>
                            </div>
                            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                                <div className="space-y-2">
                                    <label className="text-[10px] font-black text-slate-400 uppercase">Header Color</label>
                                    <div className="flex items-center gap-3 bg-slate-50 p-3 rounded-2xl border-2 border-slate-100">
                                        <input 
                                            type="color"
                                            value={formData.headerColor}
                                            onChange={(e) => setFormData({...formData, headerColor: e.target.value})}
                                            className="w-10 h-10 rounded-lg cursor-pointer border-none"
                                        />
                                        <span className="text-xs font-bold font-mono text-slate-500 uppercase">{formData.headerColor}</span>
                                    </div>
                                </div>
                                <div className="space-y-2">
                                    <label className="text-[10px] font-black text-slate-400 uppercase">Footer Color</label>
                                    <div className="flex items-center gap-3 bg-slate-50 p-3 rounded-2xl border-2 border-slate-100">
                                        <input 
                                            type="color"
                                            value={formData.footerColor}
                                            onChange={(e) => setFormData({...formData, footerColor: e.target.value})}
                                            className="w-10 h-10 rounded-lg cursor-pointer border-none"
                                        />
                                        <span className="text-xs font-bold font-mono text-slate-500 uppercase">{formData.footerColor}</span>
                                    </div>
                                </div>
                                <div className="space-y-2">
                                    <label className="text-[10px] font-black text-slate-400 uppercase">Text (Head/Foot)</label>
                                    <div className="flex items-center gap-3 bg-slate-50 p-3 rounded-2xl border-2 border-slate-100">
                                        <input 
                                            type="color"
                                            value={formData.textColor}
                                            onChange={(e) => setFormData({...formData, textColor: e.target.value})}
                                            className="w-10 h-10 rounded-lg cursor-pointer border-none"
                                        />
                                        <span className="text-xs font-bold font-mono text-slate-500 uppercase">{formData.textColor}</span>
                                    </div>
                                </div>
                            </div>

                            <div className="space-y-3">
                                <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Select Layout Architecture</label>
                                <div className="grid grid-cols-2 gap-4">
                                    <button 
                                        onClick={() => setFormData({...formData, layout: 'vertical'})}
                                        className={`p-6 rounded-3xl border-2 transition-all flex flex-col items-center gap-3 ${
                                            formData.layout === 'vertical' ? 'bg-indigo-50 border-indigo-500 shadow-xl shadow-indigo-100/50' : 'bg-slate-50 border-slate-100 hover:border-slate-200'
                                        }`}
                                    >
                                        <div className={`w-10 h-14 rounded-md border-2 ${formData.layout === 'vertical' ? 'border-indigo-500 bg-white' : 'border-slate-300'}`} />
                                        <span className={`text-[10px] font-black uppercase tracking-widest ${formData.layout === 'vertical' ? 'text-indigo-600' : 'text-slate-400'}`}>Vertical Layout</span>
                                    </button>
                                    <button 
                                        onClick={() => setFormData({...formData, layout: 'horizontal'})}
                                        className={`p-6 rounded-3xl border-2 transition-all flex flex-col items-center gap-3 ${
                                            formData.layout === 'horizontal' ? 'bg-indigo-50 border-indigo-500 shadow-xl shadow-indigo-100/50' : 'bg-slate-50 border-slate-100 hover:border-slate-200'
                                        }`}
                                    >
                                        <div className={`w-14 h-10 rounded-md border-2 ${formData.layout === 'horizontal' ? 'border-indigo-500 bg-white' : 'border-slate-300'}`} />
                                        <span className={`text-[10px] font-black uppercase tracking-widest ${formData.layout === 'horizontal' ? 'text-indigo-600' : 'text-slate-400'}`}>Horizontal Layout</span>
                                    </button>
                                </div>
                            </div>
                        </div>

                        {/* Section 3: Dynamic Fields */}
                        <div className="space-y-6">
                            <div className="flex items-center gap-3">
                                <div className="w-8 h-8 bg-slate-900 text-white rounded-full flex items-center justify-center text-[10px] font-black">03</div>
                                <h3 className="text-sm font-black text-slate-800 uppercase tracking-widest">Data Fields</h3>
                            </div>
                            <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
                                {availableFields.map(field => (
                                    <button
                                        key={field}
                                        onClick={() => toggleField(field)}
                                        className={`py-3 px-4 rounded-xl text-[10px] font-black uppercase tracking-tight border-2 transition-all flex items-center justify-between text-left ${
                                            formData.fields.includes(field)
                                                ? 'bg-indigo-50 border-indigo-500 text-indigo-600'
                                                : 'bg-white border-slate-100 text-slate-400 hover:border-slate-200'
                                        }`}
                                    >
                                        {field}
                                        {formData.fields.includes(field) && <Check className="w-3 h-3" />}
                                    </button>
                                ))}
                            </div>
                        </div>
                    </div>

                    {/* Right Side: LIVE PREVIEW */}
                    <div className="bg-slate-50/50 rounded-[3rem] border-2 border-slate-100 p-10 flex flex-col items-center justify-center gap-8 relative overflow-hidden">
                        <div className="absolute top-8 left-8 flex items-center gap-2">
                             <div className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
                             <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Live Architectural Preview</span>
                        </div>

                        {/* Card Preview Container */}
                        <div className={`bg-white shadow-2xl rounded-2xl overflow-hidden border border-slate-100 transition-all duration-500 ${
                            formData.layout === 'vertical' ? 'w-[280px] h-[440px]' : 'w-[440px] h-[280px]'
                        }`}>
                            {/* Header */}
                            <div style={{ backgroundColor: formData.headerColor }} className="h-[15%] flex items-center justify-center px-4">
                                <h4 style={{ color: formData.textColor }} className="text-[10px] font-black uppercase tracking-[0.2em] text-center leading-tight">
                                    {formData.title || 'Institutional ID Card'}
                                </h4>
                            </div>

                            {/* Body */}
                            <div className={`p-6 flex ${formData.layout === 'vertical' ? 'flex-col' : 'flex-row'} items-center gap-6 h-[75%]`}>
                                <div className={`${formData.layout === 'vertical' ? 'w-24 h-24' : 'w-28 h-28'} bg-slate-100 border-2 border-slate-200 rounded-xl flex items-center justify-center shrink-0 shadow-inner`}>
                                   <ImageIcon className="w-10 h-10 text-slate-300" />
                                </div>
                                <div className="flex-1 space-y-3 w-full">
                                    <div className="space-y-1">
                                        <div className="h-4 bg-slate-100 rounded-md w-3/4 mx-auto md:mx-0" />
                                        <div className="h-3 bg-slate-50 rounded-md w-1/2 mx-auto md:mx-0" />
                                    </div>
                                    <div className="grid grid-cols-1 gap-2 border-t border-slate-50 pt-3">
                                        {formData.fields.slice(0, 4).map((f, i) => (
                                            <div key={i} className="flex justify-between items-center text-[8px] font-bold text-slate-400 uppercase">
                                                <span>{f}:</span>
                                                <span className="text-slate-800">**********</span>
                                            </div>
                                        ))}
                                        {formData.fields.length > 4 && (
                                            <div className="text-[7px] text-center text-slate-300 font-bold uppercase tracking-widest">+{formData.fields.length - 4} more fields</div>
                                        )}
                                    </div>
                                </div>
                            </div>

                            {/* Footer */}
                            <div style={{ backgroundColor: formData.footerColor }} className="h-[10%] flex items-center justify-between px-6">
                                <div className="w-12 h-1 bg-white/30 rounded-full" />
                                <div className="flex gap-1">
                                    <div className="w-1 h-1 bg-white/30 rounded-full" />
                                    <div className="w-1 h-1 bg-white/30 rounded-full" />
                                </div>
                            </div>
                        </div>

                        <div className="max-w-[300px] text-center">
                            <p className="text-[10px] font-bold text-slate-400 leading-relaxed italic">
                                Preview displays a mockup profile. The final card will dynamically populate with real data based on selected parameters.
                            </p>
                        </div>
                    </div>
                </div>

                <div className="flex gap-6 shrink-0 pt-6 border-t-2 border-slate-50">
                    <button onClick={() => setIsModalOpen(false)} className="flex-1 py-5 text-slate-400 font-black text-sm uppercase tracking-widest hover:bg-slate-50 rounded-2xl transition-all">Discard Design</button>
                    <button 
                        onClick={handleAction} 
                        className="flex-[2] py-5 bg-indigo-600 text-white font-black text-sm uppercase tracking-widest rounded-2xl shadow-2xl shadow-indigo-100 hover:bg-indigo-700 active:scale-95 transition-all flex items-center justify-center gap-3"
                    >
                        <ShieldCheck className="w-5 h-5" /> {modalType === 'add' ? 'Finalize Template' : 'Push Reconfigurations'}
                    </button>
                </div>
             </div>
          </div>
        </div>
      )}

      {/* Delete Confirmation */}
      {isDeleteModalOpen && (
        <div className="fixed inset-0 bg-slate-900/70 backdrop-blur-md z-[100] flex items-center justify-center p-6">
           <div className="bg-white rounded-[3rem] w-full max-w-md shadow-2xl animate-in fade-in zoom-in duration-300 overflow-hidden">
              <div className="p-10 text-center space-y-8">
                <div className="w-24 h-24 bg-rose-50 text-rose-500 rounded-[2.5rem] flex items-center justify-center mx-auto border-4 border-white shadow-2xl shadow-rose-100 relative">
                    <AlertCircle className="w-10 h-10" />
                </div>
                <div className="space-y-3">
                    <h2 className="text-3xl font-black text-slate-800 tracking-tight">Incinerate Template?</h2>
                    <p className="text-sm font-bold text-slate-400 px-6 leading-relaxed">
                        This action will permanently delete <span className="text-slate-800 font-black">{selectedTemplate?.name}</span> and all associated visual configs.
                    </p>
                </div>
                
                <div className="flex flex-col gap-4">
                    <button onClick={handleDelete} className="w-full py-5 bg-rose-500 text-white font-black rounded-2xl shadow-xl shadow-rose-200 hover:bg-rose-600 active:scale-95 transition-all uppercase tracking-widest text-xs">Confirm Destruction</button>
                    <button onClick={() => setIsDeleteModalOpen(false)} className="w-full py-5 font-black text-slate-400 hover:bg-slate-50 rounded-2xl transition-all uppercase tracking-widest text-xs">Retain Configuration</button>
                </div>
              </div>
           </div>
        </div>
      )}
    </div>
  );
};

export default IdCardTemplate;
