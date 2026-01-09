import { useState } from "react";
import { 
  MessageSquare, 
  Search, 
  Plus, 
  Inbox, 
  Send, 
  FileText, 
  Trash2, 
  Star, 
  MoreVertical, 
  CheckCircle2, 
  User,
  Paperclip,
  Smile,
  ChevronRight,
  Filter,
  Download
} from "lucide-react";

const MessageCenter = () => {
  const [activeFolder, setActiveFolder] = useState("inbox");
  const [selectedMessage, setSelectedMessage] = useState(null);

  const messages = [
    { id: 1, sender: "Maulana Abdur Rashid", role: "Admin", subject: "Meeting regarding Exam Setup", preview: "Assalamu Alaikum, we need to discuss the upcoming mid-term exam schedule...", time: "10:30 AM", status: "unread", starred: true },
    { id: 2, sender: "Hafiz Ahmed Ullah", role: "Teacher", subject: "Student Attendance Report", preview: "I have uploaded the attendance report for Section B. Please review.", time: "Yesterday", status: "read", starred: false },
    { id: 3, sender: "Zubair Ahmed", role: "Accountant", subject: "Salary Disbursement", preview: "The salary for December has been processed for all staff members.", time: "Jan 07", status: "read", starred: false },
    { id: 4, sender: "Aisha Siddiqua", role: "Teacher", subject: "Leave Application Request", preview: "Requesting leave for two days due to family emergency. Need approval.", time: "Jan 05", status: "read", starred: true },
  ];

  const folders = [
    { id: "inbox", label: "Inbox", icon: Inbox, count: 2 },
    { id: "sent", label: "Sent", icon: Send, count: 0 },
    { id: "drafts", label: "Drafts", icon: FileText, count: 5 },
    { id: "starred", label: "Starred", icon: Star, count: 2 },
    { id: "trash", label: "Trash", icon: Trash2, count: 0 },
  ];

  return (
    <div className="min-h-screen bg-slate-50/50 p-4 md:p-8 animate-in fade-in duration-500">
      <div className="max-w-[1600px] mx-auto h-[calc(100vh-160px)] flex flex-col lg:flex-row gap-8">
        
        {/* Left Sidebar: Folders */}
        <div className="w-full lg:w-72 flex flex-col gap-6">
           <div className="bg-white rounded-[2.5rem] border border-slate-200 p-6 flex flex-col gap-6 shadow-sm overflow-hidden">
              <button className="w-full py-4 bg-indigo-600 text-white rounded-2xl font-black shadow-xl shadow-indigo-100 hover:bg-indigo-700 hover:scale-[1.02] active:scale-95 transition-all flex items-center justify-center gap-3">
                 <Plus className="w-5 h-5" />
                 Compose
              </button>

              <div className="space-y-1">
                 {folders.map((folder) => (
                    <button 
                       key={folder.id}
                       onClick={() => setActiveFolder(folder.id)}
                       className={`w-full flex items-center justify-between px-4 py-3.5 rounded-2xl font-bold transition-all ${
                         activeFolder === folder.id 
                           ? 'bg-indigo-50 text-indigo-600' 
                           : 'text-slate-500 hover:bg-slate-50 hover:text-slate-700'
                       }`}
                    >
                       <div className="flex items-center gap-3 text-sm">
                          <folder.icon className={`w-4 h-4 ${activeFolder === folder.id ? 'text-indigo-600' : 'text-slate-400'}`} />
                          {folder.label}
                       </div>
                       {folder.count > 0 && (
                         <span className={`text-[10px] font-black px-2 py-0.5 rounded-full ${
                           activeFolder === folder.id ? 'bg-indigo-600 text-white' : 'bg-slate-100 text-slate-400'
                         }`}>{folder.count}</span>
                       )}
                    </button>
                 ))}
              </div>
           </div>

           {/* Contacts Hint */}
           <div className="bg-gradient-to-br from-indigo-600 to-violet-700 rounded-[2.5rem] p-8 text-white shadow-xl shadow-indigo-100 relative overflow-hidden group">
              <MessageSquare className="absolute -right-6 -bottom-6 w-36 h-36 text-white opacity-10 group-hover:scale-110 transition-transform duration-700" />
              <h3 className="text-xl font-black tracking-tight relative z-10">Smart Connect</h3>
              <p className="text-indigo-100 text-sm font-bold mt-4 relative z-10">Communicate with students, parents, and staff seamlessly in one place.</p>
           </div>
        </div>

        {/* Middle: Message List */}
        <div className="flex-1 flex flex-col gap-6 h-full">
           <div className="bg-white rounded-[2.5rem] border border-slate-200 shadow-sm flex flex-col h-full overflow-hidden">
              <div className="p-8 border-b border-slate-100 flex items-center justify-between bg-white relative z-20">
                 <div className="flex items-center gap-4">
                    <h2 className="text-2xl font-black text-slate-800 tracking-tight uppercase tracking-widest">{activeFolder}</h2>
                    <div className="px-3 py-1 bg-slate-100 rounded-lg text-[10px] font-black text-slate-400">
                       {messages.length} Messages
                    </div>
                 </div>
                 <div className="flex gap-3">
                    <button className="p-3 bg-slate-50 hover:bg-slate-100 rounded-2xl text-slate-400 transition-all border border-slate-100">
                       <Filter className="w-4 h-4" />
                    </button>
                    <div className="relative">
                       <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                       <input className="bg-slate-50 border border-slate-100 rounded-2xl pl-10 pr-6 py-2.5 text-xs font-bold focus:border-indigo-500 outline-none w-64 transition-all" placeholder="Search mail..." />
                    </div>
                 </div>
              </div>

              <div className="flex-1 overflow-y-auto custom-scrollbar">
                 {messages.map((msg) => (
                    <div 
                       key={msg.id}
                       onClick={() => setSelectedMessage(msg)}
                       className={`group p-8 border-b border-slate-50 cursor-pointer transition-all flex items-center gap-6 relative ${
                         selectedMessage?.id === msg.id ? 'bg-indigo-50/30' : 'hover:bg-slate-50/50'
                       }`}
                    >
                       <div className={`absolute left-0 top-0 w-1 h-full transition-all ${
                         msg.status === 'unread' ? 'bg-indigo-600' : 'bg-transparent'
                       }`}></div>
                       
                       <div className="flex items-center gap-4 shrink-0">
                          <button className={`p-2 rounded-xl transition-all ${msg.starred ? 'text-amber-400' : 'text-slate-200 group-hover:text-slate-400'}`}>
                             <Star className={`w-4 h-4 ${msg.starred ? 'fill-amber-400' : ''}`} />
                          </button>
                          <div className="w-12 h-12 bg-slate-100 rounded-2xl flex items-center justify-center border-2 border-white shadow-sm overflow-hidden group-hover:scale-110 transition-transform">
                             <span className="font-black text-slate-400 uppercase">{msg.sender.charAt(0)}</span>
                          </div>
                       </div>

                       <div className="flex-1 min-w-0">
                          <div className="flex items-center justify-between mb-1">
                             <div className="flex items-center gap-2">
                                <h4 className={`text-sm tracking-tight ${msg.status === 'unread' ? 'font-black text-slate-800' : 'font-bold text-slate-600'}`}>{msg.sender}</h4>
                                <span className="px-2 py-0.5 bg-slate-50 border border-slate-100 rounded-md text-[9px] font-black text-slate-400 uppercase tracking-widest">{msg.role}</span>
                             </div>
                             <span className="text-[10px] font-bold text-slate-400">{msg.time}</span>
                          </div>
                          <p className={`text-sm truncate ${msg.status === 'unread' ? 'font-black text-slate-700' : 'font-medium text-slate-500'}`}>{msg.subject}</p>
                          <p className="text-xs text-slate-400 truncate mt-1">{msg.preview}</p>
                       </div>

                       <div className="flex items-center gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                          <button className="p-2.5 bg-white border border-slate-200 rounded-xl text-slate-400 hover:text-rose-600 transition-all shadow-sm">
                             <Trash2 className="w-4 h-4" />
                          </button>
                          <button className="p-2.5 bg-white border border-slate-200 rounded-xl text-slate-400 hover:text-indigo-600 transition-all shadow-sm">
                             <MoreVertical className="w-4 h-4" />
                          </button>
                       </div>
                    </div>
                 ))}
              </div>
           </div>
        </div>

        {/* Right: Message View (Conditional) */}
        {selectedMessage && (
           <div className="hidden xl:flex w-[450px] bg-white rounded-[2.5rem] border border-slate-200 shadow-sm flex-col overflow-hidden animate-in slide-in-from-right duration-500">
              <div className="p-8 border-b border-slate-50 flex items-center justify-between bg-slate-50/30">
                 <button onClick={() => setSelectedMessage(null)} className="p-2.5 bg-white border border-slate-200 rounded-xl text-slate-400 hover:text-slate-600 shadow-sm">
                    <ChevronRight className="w-5 h-5 rotate-180" />
                 </button>
                 <div className="flex gap-3">
                    <button className="p-2.5 bg-white border border-slate-200 rounded-xl text-slate-400 hover:text-indigo-600 shadow-sm">
                       <CheckCircle2 className="w-5 h-5" />
                    </button>
                    <button className="p-2.5 bg-white border border-slate-200 rounded-xl text-slate-400 hover:text-rose-600 shadow-sm">
                       <Trash2 className="w-5 h-5" />
                    </button>
                 </div>
              </div>

              <div className="flex-1 p-8 overflow-y-auto custom-scrollbar space-y-8">
                 <div className="flex items-center gap-6">
                    <div className="w-16 h-16 bg-slate-100 rounded-3xl flex items-center justify-center border-4 border-white shadow-lg overflow-hidden shrink-0">
                       <span className="text-2xl font-black text-slate-400 uppercase">{selectedMessage.sender.charAt(0)}</span>
                    </div>
                    <div>
                       <h3 className="text-xl font-black text-slate-800 tracking-tight leading-none">{selectedMessage.sender}</h3>
                       <p className="text-xs font-bold text-slate-400 mt-2">{selectedMessage.role} · Jan 09, 2026 · 10:30 AM</p>
                    </div>
                 </div>

                 <div className="space-y-4">
                    <h2 className="text-2xl font-black text-slate-800 tracking-tight leading-tight uppercase tracking-tighter">{selectedMessage.subject}</h2>
                    <div className="prose prose-slate prose-sm text-slate-500 font-medium leading-relaxed">
                       {selectedMessage.preview}
                       <br /><br />
                       Dear Team,<br />
                       I hope this message finds you well. I'm reaching out to finalize the details for the upcoming academic module updates. We need to ensure that all teachers have their schedules updated by the end of this week.
                       <br /><br />
                       Please let me know if you have any questions or require further assistance.
                       <br /><br />
                       Best regards,<br />
                       {selectedMessage.sender}
                    </div>
                 </div>

                 <div className="pt-8 border-t border-slate-50">
                    <div className="p-4 bg-slate-50 rounded-[2rem] border border-slate-100 flex items-center justify-between">
                       <div className="flex items-center gap-3">
                          <div className="w-10 h-10 bg-white rounded-xl flex items-center justify-center border border-slate-100">
                             <FileText className="w-5 h-5 text-indigo-400" />
                          </div>
                          <div>
                             <p className="text-xs font-black text-slate-700">Exam_Schedule.pdf</p>
                             <p className="text-[10px] font-bold text-slate-400">1.2 MB</p>
                          </div>
                       </div>
                       <button className="p-2.5 bg-white hover:bg-slate-50 border border-slate-100 rounded-xl text-slate-400 transition-all">
                          <Download className="w-4 h-4" />
                       </button>
                    </div>
                 </div>
              </div>

              {/* Quick Reply Bar */}
              <div className="p-8 border-t border-slate-50 bg-slate-50/50">
                 <div className="relative group">
                    <textarea 
                       className="w-full bg-white border border-slate-200 rounded-[2rem] pl-6 pr-20 py-5 text-sm font-bold focus:border-indigo-500 outline-none transition-all shadow-sm resize-none"
                       placeholder="Type your reply here..."
                       rows="2"
                    ></textarea>
                    <div className="absolute right-4 bottom-4 flex items-center gap-2">
                       <button className="p-2 text-slate-300 hover:text-slate-500 transition-all"><Paperclip className="w-4 h-4" /></button>
                       <button className="p-2 text-slate-300 hover:text-slate-500 transition-all"><Smile className="w-4 h-4" /></button>
                       <button className="w-10 h-10 bg-indigo-600 text-white rounded-xl flex items-center justify-center shadow-lg shadow-indigo-100 hover:bg-indigo-700 transition-all">
                          <Send className="w-4 h-4" />
                       </button>
                    </div>
                 </div>
              </div>
           </div>
        )}

      </div>
    </div>
  );
};

export default MessageCenter;
