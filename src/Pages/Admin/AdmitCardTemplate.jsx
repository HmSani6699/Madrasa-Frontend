import { useState } from "react";
import { 
  Plus, 
  Search, 
  FileText, 
  Settings2, 
  Layers, 
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
  Check,
  Info,
  Table as TableIcon
} from "lucide-react";

const AdmitCardTemplate = () => {
  const [searchTerm, setSearchTerm] = useState("");
  
  // Modal States
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [modalType, setModalType] = useState("add"); // "add" | "edit"
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);

  // Focus States
  const [selectedTemplate, setSelectedTemplate] = useState(null);

  // Form States
  const [formData, setFormData] = useState({
    name: "Final Exam 2026 Template",
    title: "Annual Examination Admit Card",
    primaryColor: "#4f46e5",
    secondaryColor: "#0f172a",
    instructions: [
      "Bring this admit card to every examination.",
      "Electronic devices are strictly prohibited.",
      "Report to the exam hall 30 minutes early.",
      "Follow all instructions from the invigilator."
    ],
    showSubjectTable: true,
    showRoomNo: true,
    showPhoto: true,
    status: "active"
  });

  // Sample Data
  const [templates, setTemplates] = useState([
    { 
      id: 1, 
      name: "Final Exam 2026 Template", 
      title: "Annual Examination Admit Card",
      primaryColor: "#4f46e5",
      secondaryColor: "#0f172a",
      instructions: ["Bring this card.", "No phones.", "30 mins early."],
      showSubjectTable: true,
      showRoomNo: true,
      showPhoto: true,
      status: "active" 
    },
    { 
      id: 2, 
      name: "Monthly Test Layout", 
      title: "Monthly Progress Test",
      primaryColor: "#0891b2",
      secondaryColor: "#1e293b",
      instructions: ["Regular test rules apply."],
      showSubjectTable: false,
      showRoomNo: true,
      showPhoto: false,
      status: "active" 
    },
  ]);

  // Handlers
  const handleInstructionChange = (index, value) => {
    const newInstructions = [...formData.instructions];
    newInstructions[index] = value;
    setFormData({...formData, instructions: newInstructions});
  };

  const addInstruction = () => {
    setFormData({...formData, instructions: [...formData.instructions, ""]});
  };

  const removeInstruction = (index) => {
    setFormData({...formData, instructions: formData.instructions.filter((_, i) => i !== index)});
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
      primaryColor: template.primaryColor,
      secondaryColor: template.secondaryColor,
      instructions: template.instructions,
      showSubjectTable: template.showSubjectTable,
      showRoomNo: template.showRoomNo,
      showPhoto: template.showPhoto,
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
      title: "",
      primaryColor: "#4f46e5",
      secondaryColor: "#0f172a",
      instructions: [],
      showSubjectTable: true,
      showRoomNo: true,
      showPhoto: true,
      status: "active"
    });
    setSelectedTemplate(null);
  };

  const filteredTemplates = templates.filter(t => 
    t.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="space-y-10 animate-in fade-in duration-500 p-6 md:p-10 text-slate-800">
      {/* Header */}
      <div className="bg-white rounded-[3rem] border-2 border-slate-200 p-10 flex flex-col lg:flex-row justify-between items-center gap-8 shadow-sm relative overflow-hidden">
        <div className="flex items-center gap-8 relative z-10">
          <div className="w-20 h-20 bg-amber-50 rounded-[2rem] flex items-center justify-center border-2 border-amber-100/50 shadow-inner">
            <FileText className="w-10 h-10 text-amber-600" />
          </div>
          <div>
            <h1 className="text-3xl md:text-4xl font-black tracking-tight text-center lg:text-left uppercase">Admit Card Templates</h1>
            <p className="text-slate-500 font-bold mt-2 text-lg text-center lg:text-left">Design official examination permits</p>
          </div>
        </div>

        <button 
          onClick={openAddModal}
          className="w-full lg:w-auto px-10 py-5 bg-slate-900 text-white rounded-[1.5rem] font-black shadow-2xl hover:bg-black hover:scale-[1.02] active:scale-95 transition-all flex items-center justify-center gap-3 group relative z-10"
        >
          <Plus className="w-6 h-6 group-hover:rotate-90 transition-transform" />
          Create Admit Layout
        </button>
      </div>

      {/* Toolbar */}
      <div className="flex flex-col lg:flex-row gap-6">
        <div className="flex-1 bg-white rounded-[2.5rem] border-2 border-slate-100 p-3 flex items-center shadow-sm">
            <div className="px-5 text-slate-400">
               <Search className="w-5 h-5" />
            </div>
            <input 
              placeholder="Search layouts by name..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="flex-1 bg-transparent border-none outline-none text-sm font-bold text-slate-800 placeholder:text-slate-300"
            />
        </div>
      </div>

      {/* Templates Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-10">
        {filteredTemplates.map((template) => (
          <div key={template.id} className="group bg-white rounded-[3.5rem] border-2 border-slate-100 shadow-xl shadow-slate-100/20 hover:border-amber-500/20 transition-all duration-300 overflow-hidden flex flex-col relative">
            {/* Action Bar */}
            <div className="absolute top-8 right-8 flex gap-2 translate-y-3 opacity-0 group-hover:translate-y-0 group-hover:opacity-100 transition-all z-20">
                <button 
                    onClick={() => openEditModal(template)}
                    className="p-4 bg-white border-2 border-slate-100 text-slate-400 hover:text-amber-600 hover:border-amber-100 rounded-2xl transition-all shadow-lg"
                >
                    <Edit3 className="w-5 h-5" />
                </button>
                <button 
                    onClick={() => openDeleteModal(template)}
                    className="p-4 bg-white border-2 border-slate-100 text-slate-400 hover:text-rose-600 hover:border-rose-100 rounded-2xl transition-all shadow-lg"
                >
                    <Trash2 className="w-5 h-5" />
                </button>
            </div>

            <div className="p-10 flex gap-10 h-full">
                {/* Visual Preview Section */}
                <div className="w-48 bg-slate-50 rounded-[2.5rem] border-2 border-slate-100 flex flex-col overflow-hidden shrink-0 group-hover:border-amber-100 transition-colors">
                    <div style={{ backgroundColor: template.primaryColor }} className="h-4 w-full" />
                    <div className="flex-1 p-4 flex flex-col gap-3">
                         <div className="h-2 bg-slate-200 rounded-full w-3/4 mx-auto" />
                         <div className="aspect-square bg-white border border-slate-100 rounded-xl flex items-center justify-center">
                            <ImageIcon className="w-6 h-6 text-slate-100" />
                         </div>
                         <div className="space-y-1.5 pt-2">
                             <div className="h-1 bg-slate-100 rounded-full" />
                             <div className="h-1 bg-slate-100 rounded-full w-5/6" />
                             <div className="h-1 bg-slate-100 rounded-full w-4/6" />
                         </div>
                         <div className="mt-auto h-8 bg-slate-100/50 border border-dashed border-slate-200 rounded-md" />
                    </div>
                </div>

                {/* Info Section */}
                <div className="flex-1 space-y-6">
                    <div className="space-y-2">
                        <span className="text-[10px] font-black text-amber-600 uppercase tracking-[0.3em]">Institutional Grade</span>
                        <h2 className="text-2xl font-black tracking-tight group-hover:text-amber-600 transition-colors uppercase">{template.name}</h2>
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                        <div className="space-y-1">
                            <p className="text-[9px] font-black text-slate-400 uppercase tracking-widest">Header Theme</p>
                            <div className="flex items-center gap-2">
                                <div style={{ backgroundColor: template.primaryColor }} className="w-4 h-4 rounded-full" />
                                <span className="text-[10px] font-bold font-mono">{template.primaryColor}</span>
                            </div>
                        </div>
                        <div className="space-y-1">
                            <p className="text-[9px] font-black text-slate-400 uppercase tracking-widest">Meta Stats</p>
                            <p className="text-[10px] font-black text-slate-800">{template.instructions.length} Instructions</p>
                        </div>
                    </div>

                    <div className="flex flex-wrap gap-2 pt-2">
                        {template.showSubjectTable && <span className="px-3 py-1 bg-blue-50 text-blue-600 rounded-lg text-[8px] font-black uppercase tracking-widest border border-blue-100">Subject Matrix</span>}
                        {template.showRoomNo && <span className="px-3 py-1 bg-purple-50 text-purple-600 rounded-lg text-[8px] font-black uppercase tracking-widest border border-purple-100">Room Allocation</span>}
                        {template.showPhoto && <span className="px-3 py-1 bg-emerald-50 text-emerald-600 rounded-lg text-[8px] font-black uppercase tracking-widest border border-emerald-100">Photo Enabled</span>}
                    </div>

                    <div className="mt-auto pt-6 flex items-center justify-between border-t border-slate-50">
                        <div className="flex items-center gap-2 text-amber-600">
                             <span className="text-[10px] font-black uppercase tracking-widest">Review Layout</span>
                             <ChevronRight className="w-4 h-4" />
                        </div>
                        <p className="text-[10px] font-black text-slate-200">ID: {template.id}</p>
                    </div>
                </div>
            </div>
          </div>
        ))}
      </div>

      {/* Add/Edit Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 bg-slate-900/70 backdrop-blur-md z-[100] flex items-center justify-center p-6 lg:p-10">
          <div className="bg-white rounded-[3rem] w-full max-w-6xl shadow-2xl animate-in scale-in duration-300 overflow-hidden flex flex-col max-h-[95vh]">
             <div className="p-10 border-b-2 border-slate-50 flex items-center justify-between shrink-0">
                <div className="flex items-center gap-5">
                    <div className="w-14 h-14 bg-amber-50 text-amber-600 rounded-2xl flex items-center justify-center border-2 border-amber-100/50 shadow-inner">
                        <Settings2 className="w-8 h-8" />
                    </div>
                    <div>
                        <h2 className="text-2xl font-black text-slate-800 tracking-tight">
                            {modalType === 'add' ? 'Architect Admit Permit' : 'Reconfigure Layout Specs'}
                        </h2>
                        <p className="text-xs font-black text-slate-400 uppercase tracking-widest mt-1">Examination Security & Design</p>
                    </div>
                </div>
                <button onClick={() => setIsModalOpen(false)} className="p-4 bg-slate-50 hover:bg-slate-100 text-slate-400 rounded-2xl transition-all">
                    <X className="w-6 h-6" />
                </button>
             </div>
             
             <div className="p-10 space-y-12 overflow-y-auto custom-scrollbar">
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-16">
                    {/* Left: Configuration */}
                    <div className="space-y-10">
                        {/* Section 1: Identity */}
                        <div className="space-y-6">
                            <div className="flex items-center gap-3">
                                <div className="w-8 h-8 bg-slate-900 text-white rounded-full flex items-center justify-center text-[10px] font-black">01</div>
                                <h3 className="text-sm font-black text-slate-800 uppercase tracking-widest">Metadata Identity</h3>
                            </div>
                            <div className="grid grid-cols-1 gap-6">
                                <div className="space-y-2">
                                    <label className="text-[10px] font-black text-slate-400 uppercase ml-2">Internal Template Name</label>
                                    <input 
                                        type="text"
                                        value={formData.name}
                                        onChange={(e) => setFormData({...formData, name: e.target.value})}
                                        placeholder="e.g. Annual Exam 2026 Layout"
                                        className="w-full bg-slate-50 border-2 border-slate-100 rounded-2xl px-6 py-4 text-sm font-bold focus:border-amber-500 outline-none transition-all"
                                    />
                                </div>
                                <div className="space-y-2">
                                    <label className="text-[10px] font-black text-slate-400 uppercase ml-2">Public Document Title</label>
                                    <input 
                                        type="text"
                                        value={formData.title}
                                        onChange={(e) => setFormData({...formData, title: e.target.value})}
                                        placeholder="e.g. ADMIT CARD: ANNUAL EXAMINATION"
                                        className="w-full bg-slate-50 border-2 border-slate-100 rounded-2xl px-6 py-4 text-sm font-bold focus:border-amber-500 outline-none transition-all"
                                    />
                                </div>
                            </div>
                        </div>

                        {/* Section 2: Visual Layer */}
                        <div className="space-y-6">
                            <div className="flex items-center gap-3">
                                <div className="w-8 h-8 bg-slate-900 text-white rounded-full flex items-center justify-center text-[10px] font-black">02</div>
                                <h3 className="text-sm font-black text-slate-800 uppercase tracking-widest">Visual Layers</h3>
                            </div>
                            <div className="grid grid-cols-2 gap-6">
                                <div className="space-y-2">
                                    <label className="text-[10px] font-black text-slate-400 uppercase ml-2">Brand Primary</label>
                                    <div className="flex items-center gap-3 bg-slate-50 p-4 rounded-2xl border-2 border-slate-100">
                                        <input type="color" value={formData.primaryColor} onChange={(e) => setFormData({...formData, primaryColor: e.target.value})} className="w-10 h-10 rounded-lg cursor-pointer border-none" />
                                        <span className="text-xs font-mono font-bold">{formData.primaryColor}</span>
                                    </div>
                                </div>
                                <div className="space-y-2">
                                    <label className="text-[10px] font-black text-slate-400 uppercase ml-2">Accent Secondary</label>
                                    <div className="flex items-center gap-3 bg-slate-50 p-4 rounded-2xl border-2 border-slate-100">
                                        <input type="color" value={formData.secondaryColor} onChange={(e) => setFormData({...formData, secondaryColor: e.target.value})} className="w-10 h-10 rounded-lg cursor-pointer border-none" />
                                        <span className="text-xs font-mono font-bold">{formData.secondaryColor}</span>
                                    </div>
                                </div>
                            </div>

                            <div className="grid grid-cols-3 gap-4 pt-4">
                                <button onClick={() => setFormData({...formData, showSubjectTable: !formData.showSubjectTable})} className={`p-5 rounded-[1.5rem] border-2 flex flex-col items-center gap-3 transition-all ${formData.showSubjectTable ? 'bg-blue-50 border-blue-500 text-blue-600' : 'bg-slate-50 border-slate-100 text-slate-300'}`}>
                                    <TableIcon className="w-6 h-6" />
                                    <span className="text-[8px] font-black uppercase tracking-widest">Subject Matrix</span>
                                </button>
                                <button onClick={() => setFormData({...formData, showRoomNo: !formData.showRoomNo})} className={`p-5 rounded-[1.5rem] border-2 flex flex-col items-center gap-3 transition-all ${formData.showRoomNo ? 'bg-purple-50 border-purple-500 text-purple-600' : 'bg-slate-50 border-slate-100 text-slate-300'}`}>
                                    <Layers className="w-6 h-6" />
                                    <span className="text-[8px] font-black uppercase tracking-widest">Halls / Room</span>
                                </button>
                                <button onClick={() => setFormData({...formData, showPhoto: !formData.showPhoto})} className={`p-5 rounded-[1.5rem] border-2 flex flex-col items-center gap-3 transition-all ${formData.showPhoto ? 'bg-emerald-50 border-emerald-500 text-emerald-600' : 'bg-slate-50 border-slate-100 text-slate-300'}`}>
                                    <ImageIcon className="w-6 h-6" />
                                    <span className="text-[8px] font-black uppercase tracking-widest">Photo ID</span>
                                </button>
                            </div>
                        </div>

                        {/* Section 3: Legal/Instructions */}
                        <div className="space-y-6">
                            <div className="flex items-center justify-between">
                                <div className="flex items-center gap-3">
                                    <div className="w-8 h-8 bg-slate-900 text-white rounded-full flex items-center justify-center text-[10px] font-black">03</div>
                                    <h3 className="text-sm font-black text-slate-800 uppercase tracking-widest">Candidate Directives</h3>
                                </div>
                                <button onClick={addInstruction} className="px-4 py-2 bg-slate-900 text-white rounded-xl text-[10px] font-black uppercase tracking-widest hover:bg-black transition-all flex items-center gap-2">
                                    <Plus className="w-3 h-3" /> Append Directive
                                </button>
                            </div>
                            <div className="space-y-3">
                                {formData.instructions.map((inst, index) => (
                                    <div key={index} className="flex gap-3 animate-in slide-in-from-right duration-300">
                                        <div className="flex-1 relative">
                                            <Info className="absolute left-5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-300" />
                                            <input 
                                                value={inst}
                                                onChange={(e) => handleInstructionChange(index, e.target.value)}
                                                placeholder="Enter examination instruction..."
                                                className="w-full bg-slate-50 border-2 border-slate-100 rounded-2xl pl-14 pr-6 py-4 text-xs font-bold focus:border-amber-500 outline-none transition-all"
                                            />
                                        </div>
                                        <button onClick={() => removeInstruction(index)} className="p-4 bg-rose-50 text-rose-500 rounded-2xl hover:bg-rose-100 transition-all">
                                            <Trash2 className="w-5 h-5" />
                                        </button>
                                    </div>
                                ))}
                            </div>
                        </div>
                    </div>

                    {/* Right: Architectural Preview */}
                    <div className="bg-slate-900 rounded-[4rem] p-12 flex flex-col items-center justify-center gap-10 relative overflow-hidden shadow-2xl">
                         <div className="absolute top-10 left-10 flex items-center gap-3">
                              <div className="w-2 h-2 rounded-full bg-amber-500 animate-pulse" />
                              <span className="text-[10px] font-black text-slate-500 uppercase tracking-[0.3em]">Architectural Master Render</span>
                         </div>

                         {/* The Admit Card Render */}
                         <div className="w-[420px] bg-white rounded-3xl overflow-hidden shadow-[0_40px_100px_rgba(0,0,0,0.4)] flex flex-col text-slate-800 border-8 border-white">
                            {/* Top Accent */}
                            <div style={{ backgroundColor: formData.primaryColor }} className="h-6 w-full" />
                            
                            <div className="p-10 space-y-8">
                                {/* Header */}
                                <div className="text-center space-y-2 border-b-2 border-slate-50 pb-6">
                                    <h4 className="text-[11px] font-black uppercase tracking-[0.2em]">{formData.title || 'Official Admit Permit'}</h4>
                                    <p className="text-[8px] font-bold text-slate-400">Institutional Examination Department</p>
                                </div>

                                {/* Body Content */}
                                <div className="flex gap-8">
                                    {formData.showPhoto && (
                                        <div className="w-24 h-24 bg-slate-50 border-2 border-slate-100 rounded-2xl flex items-center justify-center shrink-0">
                                            <ImageIcon className="w-10 h-10 text-slate-100" />
                                        </div>
                                    )}
                                    <div className="flex-1 grid grid-cols-1 gap-3">
                                        <div className="flex justify-between border-b border-slate-50 pb-1.5"><span className="text-[8px] font-black text-slate-300 uppercase">Identity</span><span className="text-[9px] font-black text-slate-800">CANDIDATE NAME</span></div>
                                        <div className="flex justify-between border-b border-slate-50 pb-1.5"><span className="text-[8px] font-black text-slate-300 uppercase">Roll No</span><span className="text-[9px] font-black text-slate-800">000000</span></div>
                                        <div className="flex justify-between border-b border-slate-50 pb-1.5"><span className="text-[8px] font-black text-slate-300 uppercase">Class</span><span className="text-[9px] font-black text-slate-800">LEVEL - SECTION</span></div>
                                        {formData.showRoomNo && <div className="flex justify-between border-b border-slate-50 pb-1.5"><span className="text-[8px] font-black text-slate-300 uppercase">Venue</span><span className="text-[9px] font-black text-slate-800">HALL - ROOM</span></div>}
                                    </div>
                                </div>

                                {/* Subject Matrix */}
                                {formData.showSubjectTable && (
                                    <div className="space-y-2 pt-4">
                                        <p className="text-[8px] font-black text-slate-300 uppercase tracking-widest text-center">Examination Schedule Matrix</p>
                                        <div className="border-2 border-slate-50 rounded-2xl overflow-hidden">
                                            <div className="grid grid-cols-3 bg-slate-50 p-2 text-[7px] font-black uppercase"><span>Code</span><span>Subject</span><span className="text-right">Time</span></div>
                                            <div className="grid grid-cols-3 p-2 text-[8px] font-bold border-b border-slate-50"><span>ARB-101</span><span>Arabic Lit</span><span className="text-right">09:00 AM</span></div>
                                            <div className="grid grid-cols-3 p-2 text-[8px] font-bold"><span>HAD-202</span><span>Hadith Studies</span><span className="text-right">01:30 PM</span></div>
                                        </div>
                                    </div>
                                )}

                                {/* Instructions */}
                                <div className="space-y-3 pt-4">
                                    <p className="text-[8px] font-black text-slate-300 uppercase tracking-widest">Candidate Directives</p>
                                    <div className="space-y-1.5">
                                        {formData.instructions.slice(0, 3).map((inst, i) => (
                                            <div key={i} className="flex items-center gap-2 text-[7px] font-bold text-slate-500">
                                                <div className="w-1 h-1 rounded-full bg-slate-200" />
                                                {inst || 'Directive text goes here...'}
                                            </div>
                                        ))}
                                    </div>
                                </div>
                            </div>

                            {/* Signatures */}
                            <div className="mt-auto px-10 py-8 flex justify-between items-end bg-slate-50/50 border-t border-slate-50 relative overflow-hidden">
                                <div className="absolute right-0 bottom-0 w-32 h-32 bg-slate-900/5 rotate-12 translate-x-12 translate-y-12 rounded-full" />
                                <div className="flex flex-col items-center">
                                    <div className="w-20 border-b border-slate-300 mb-1" />
                                    <span className="text-[6px] font-black text-slate-400 uppercase">Principal</span>
                                </div>
                                <div className="flex flex-col items-center">
                                    <div className="w-20 border-b border-slate-300 mb-1" />
                                    <span className="text-[6px] font-black text-slate-400 uppercase">Controller</span>
                                </div>
                            </div>
                         </div>

                         <div className="max-w-[300px] text-center">
                             <p className="text-[10px] font-bold text-slate-500 uppercase tracking-widest">A4 Layout Preview Configuration</p>
                         </div>
                    </div>
                </div>

                <div className="flex gap-6 shrink-0 pt-6">
                    <button onClick={() => setIsModalOpen(false)} className="flex-1 py-5 text-slate-400 font-black text-sm uppercase tracking-widest hover:bg-slate-50 rounded-2xl transition-all">Discard Permit Layout</button>
                    <button 
                        onClick={handleAction} 
                        className="flex-[2] py-5 bg-amber-600 text-white font-black text-sm uppercase tracking-widest rounded-2xl shadow-2xl shadow-amber-100 hover:bg-amber-700 active:scale-95 transition-all flex items-center justify-center gap-3"
                    >
                        <ShieldCheck className="w-5 h-5" /> {modalType === 'add' ? 'Finalize Permit Specs' : 'Commit Logical Specs'}
                    </button>
                </div>
             </div>
          </div>
        </div>
      )}

      {/* Delete Confirmation */}
      {isDeleteModalOpen && (
        <div className="fixed inset-0 bg-slate-900/70 backdrop-blur-md z-[100] flex items-center justify-center p-6 text-slate-800">
           <div className="bg-white rounded-[3rem] w-full max-w-md shadow-2xl animate-in zoom-in duration-300 overflow-hidden">
              <div className="p-10 text-center space-y-8">
                <div className="w-24 h-24 bg-rose-50 text-rose-500 rounded-[2.5rem] flex items-center justify-center mx-auto border-4 border-white shadow-2xl shadow-rose-100 relative">
                    <AlertCircle className="w-10 h-10" />
                </div>
                <div className="space-y-3">
                    <h2 className="text-3xl font-black tracking-tight">Incinerate Permit?</h2>
                    <p className="text-sm font-bold text-slate-400 px-6 leading-relaxed uppercase tracking-widest">
                        Permanent removal of logic for <span className="text-slate-800 font-black">{selectedTemplate?.name}</span>.
                    </p>
                </div>
                
                <div className="flex flex-col gap-4">
                    <button onClick={handleDelete} className="w-full py-5 bg-rose-500 text-white font-black rounded-2xl hover:bg-rose-600 active:scale-95 transition-all uppercase tracking-widest text-xs">Confirm Destruction</button>
                    <button onClick={() => setIsDeleteModalOpen(false)} className="w-full py-5 font-black text-slate-400 hover:bg-slate-50 rounded-2xl transition-all uppercase tracking-widest text-xs">Retain Integrity</button>
                </div>
              </div>
           </div>
        </div>
      )}
    </div>
  );
};

export default AdmitCardTemplate;
