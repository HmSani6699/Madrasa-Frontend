import { useState } from "react";
import { useAuth } from "../../context/AuthContext";
import { 
  MessageSquare, 
  Send, 
  User, 
  Search, 
  Plus, 
  Clock, 
  CheckCircle2, 
  ChevronRight,
  ShieldCheck,
  Zap,
  MessageCircle,
  HelpCircle,
  Users,
  Star,
  Sparkles
} from "lucide-react";

const GuardianCommunication = () => {
  const { activeChild } = useAuth();
  const [activeChat, setActiveChat] = useState(null);
  const [message, setMessage] = useState("");
  const [showInquiryModal, setShowInquiryModal] = useState(false);

  const teacherList = [
    { id: 1, name: "Sheikh Abdullah", subject: "Arabic Context", status: "Online", lastMessage: "The pronunciation is improving...", time: "10:30 AM", unread: 0 },
    { id: 2, name: "Ustad Junaid", subject: "Quranic Hifz", status: "Offline", lastMessage: "Please review Surah Al-Baqarah", time: "Yesterday", unread: 2 },
    { id: 3, name: "Mufti Omar", subject: "Islamic Fiqh", status: "Away", lastMessage: "The test will be hosted on Monday", time: "Jan 12", unread: 0 },
  ];

  const handleSendMessage = () => {
    if (message.trim()) {
      setMessage("");
      // Logic for sending message would go here
    }
  };

  return (
    <div className="space-y-8 pb-12 animate-in fade-in duration-700">
      {/* Header Section */}
      <div className="bg-white rounded-[2.5rem] p-8 md:p-12 border-2 border-slate-50 shadow-sm flex flex-col lg:flex-row justify-between items-center gap-8 relative overflow-hidden">
        <div className="absolute -right-10 -top-10 w-40 h-40 bg-indigo-50 rounded-full blur-3xl opacity-50"></div>
        <div className="flex items-center gap-6 relative z-10">
          <div className="w-16 h-16 md:w-20 md:h-20 bg-indigo-600 rounded-2xl md:rounded-3xl flex items-center justify-center border-2 border-indigo-500 shadow-xl text-white">
            <MessageSquare className="w-8 h-8 md:w-10 md:h-10" />
          </div>
          <div>
            <h1 className="text-2xl md:text-4xl font-black text-slate-800 tracking-tight uppercase leading-none mb-2 md:mb-3">Teacher Connect</h1>
            <p className="text-slate-500 font-bold text-xs md:text-base">Direct encrypted communication for {activeChild?.name || "Parental Support"}</p>
          </div>
        </div>
        
        <button 
          onClick={() => setShowInquiryModal(true)}
          className="px-8 py-5 bg-slate-900 text-white rounded-[2rem] font-black text-[10px] uppercase tracking-[0.2em] shadow-2xl hover:bg-slate-800 transition-all active:scale-95 flex items-center gap-3 relative z-10"
        >
          <HelpCircle className="w-4 h-4" />
          Submit Official Inquiry
        </button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 h-[700px]">
         
         {/* Instructor Thread List */}
         <div className="lg:col-span-1 bg-white rounded-[3.5rem] border-2 border-slate-50 shadow-xl shadow-slate-200/50 flex flex-col overflow-hidden">
            <div className="p-8 border-b-2 border-slate-50">
               <div className="relative">
                  <Search className="absolute left-6 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                  <input 
                     className="w-full bg-slate-50 border-2 border-slate-100 rounded-2xl pl-14 pr-6 py-4 text-[10px] font-black uppercase tracking-widest focus:border-indigo-500 focus:bg-white outline-none transition-all shadow-inner"
                     placeholder="Search Instructors..."
                  />
               </div>
            </div>

            <div className="flex-1 overflow-y-auto p-4 space-y-2 custom-scrollbar">
               {teacherList.map((teacher) => (
                  <button 
                     key={teacher.id}
                     onClick={() => setActiveChat(teacher)}
                     className={`w-full p-6 rounded-[2.5rem] flex items-center gap-5 transition-all group ${
                        activeChat?.id === teacher.id ? 'bg-indigo-600 text-white shadow-xl shadow-indigo-100' : 'hover:bg-slate-50'
                     }`}
                  >
                     <div className="relative shrink-0">
                        <div className={`w-14 h-14 rounded-2xl flex items-center justify-center text-lg font-black ${
                           activeChat?.id === teacher.id ? 'bg-white/20' : 'bg-slate-900 text-white'
                        }`}>
                           {teacher.name.split(' ').map(n => n[0]).join('')}
                        </div>
                        <div className={`absolute -bottom-1 -right-1 w-4 h-4 rounded-full border-4 ${
                           activeChat?.id === teacher.id ? 'border-indigo-600' : 'border-white'
                        } ${
                           teacher.status === 'Online' ? 'bg-emerald-500' : 
                           teacher.status === 'Away' ? 'bg-amber-500' : 'bg-slate-400'
                        }`}></div>
                     </div>
                     <div className="text-left min-w-0 flex-1">
                        <div className="flex justify-between items-start mb-1">
                           <h4 className="font-black text-[13px] uppercase tracking-tight truncate">{teacher.name}</h4>
                           <span className={`text-[9px] font-black uppercase tracking-widest ${
                              activeChat?.id === teacher.id ? 'text-white/60' : 'text-slate-400'
                           }`}>{teacher.time}</span>
                        </div>
                        <p className={`text-[10px] font-bold uppercase tracking-widest mb-2 ${
                            activeChat?.id === teacher.id ? 'text-white/80' : 'text-slate-500'
                        }`}>{teacher.subject}</p>
                        <p className={`text-xs truncate italic ${
                           activeChat?.id === teacher.id ? 'text-white/70' : 'text-slate-400'
                        }`}>"{teacher.lastMessage}"</p>
                     </div>
                     {teacher.unread > 0 && activeChat?.id !== teacher.id && (
                        <div className="w-6 h-6 bg-indigo-600 rounded-full flex items-center justify-center text-[9px] font-black text-white shrink-0 shadow-lg">
                           {teacher.unread}
                        </div>
                     )}
                  </button>
               ))}
            </div>
         </div>

         {/* Chat Interface */}
         <div className="lg:col-span-2 bg-white rounded-[3.5rem] border-2 border-slate-50 shadow-xl shadow-slate-200/50 flex flex-col overflow-hidden relative">
            {!activeChat ? (
               <div className="flex-1 flex flex-col items-center justify-center p-20 text-center">
                  <div className="w-24 h-24 bg-slate-50 rounded-full flex items-center justify-center mb-8 animate-bounce">
                     <MessageCircle className="w-12 h-12 text-slate-300" />
                  </div>
                  <h3 className="text-2xl font-black text-slate-800 uppercase tracking-tight mb-4">Select an Instructor</h3>
                  <p className="text-[11px] font-black text-slate-400 uppercase tracking-[3px] max-w-sm leading-loose">
                     Initiate a direct dialogue with your child's mentors for real-time progress updates.
                  </p>
               </div>
            ) : (
               <>
                  {/* Chat Header */}
                  <div className="p-8 border-b-2 border-slate-50 flex justify-between items-center bg-white relative z-10">
                     <div className="flex items-center gap-5">
                        <div className="w-12 h-12 bg-slate-900 text-white rounded-2xl flex items-center justify-center font-black">
                           {activeChat.name.split(' ').map(n => n[0]).join('')}
                        </div>
                        <div>
                           <h4 className="font-black text-lg uppercase tracking-tight text-slate-800">{activeChat.name}</h4>
                           <div className="flex items-center gap-2">
                              <div className={`w-1.5 h-1.5 rounded-full ${
                                 activeChat.status === 'Online' ? 'bg-emerald-500' : 'bg-slate-300'
                              }`}></div>
                              <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest">{activeChat.status}</span>
                           </div>
                        </div>
                     </div>
                     <div className="flex gap-3">
                        <button className="p-4 rounded-2xl bg-slate-50 text-slate-400 hover:text-slate-600 transition-all border border-slate-100">
                           <Clock className="w-5 h-5" />
                        </button>
                        <button className="p-4 rounded-2xl bg-slate-50 text-slate-400 hover:text-slate-600 transition-all border border-slate-100">
                           <Star className="w-5 h-5" />
                        </button>
                     </div>
                  </div>

                  {/* Messages Area */}
                  <div className="flex-1 overflow-y-auto p-10 space-y-10 bg-[url('https://www.transparenttextures.com/patterns/cubes.png')] bg-fixed opacity-80 backdrop-grayscale">
                     <div className="flex justify-center">
                        <span className="px-6 py-2 bg-slate-100 rounded-full text-[9px] font-black text-slate-400 uppercase tracking-[3px] border border-slate-200">
                           Conversation with {activeChat.name}
                        </span>
                     </div>

                     <div className="flex items-start gap-4">
                        <div className="w-10 h-10 bg-slate-900 rounded-full shrink-0"></div>
                        <div className="max-w-[80%] space-y-2">
                           <div className="bg-white p-6 rounded-[2rem] rounded-tl-none border-2 border-slate-50 shadow-sm">
                              <p className="text-sm font-medium text-slate-700 leading-relaxed italic">
                                 "Assalamu Alaikum. I wanted to update you on {activeChild?.name}'s recent performance in Surah Al-Baqarah. The memorization speed is excellent."
                              </p>
                           </div>
                           <p className="text-[9px] font-black text-slate-300 uppercase tracking-widest ml-2">10:15 AM</p>
                        </div>
                     </div>

                     <div className="flex items-start gap-4 justify-end">
                        <div className="max-w-[80%] space-y-2 text-right">
                           <div className="bg-indigo-600 p-6 rounded-[2rem] rounded-tr-none shadow-xl shadow-indigo-100 text-white">
                              <p className="text-sm font-medium leading-relaxed italic">
                                 "Wa Alaikum Assalam. Thank you, Ustad. We are practicing every evening at home. Is there anything specific we should focus on next?"
                              </p>
                           </div>
                           <p className="text-[9px] font-black text-slate-300 uppercase tracking-widest mr-2">10:28 AM</p>
                        </div>
                     </div>

                     <div className="flex items-start gap-4">
                        <div className="w-10 h-10 bg-slate-900 rounded-full shrink-0"></div>
                        <div className="max-w-[80%] space-y-2">
                           <div className="bg-white p-6 rounded-[2rem] rounded-tl-none border-2 border-slate-50 shadow-sm">
                              <p className="text-sm font-medium text-slate-700 leading-relaxed italic">
                                 "Excellent. Focus on the Tajweed rules for 'Madd' in the next session. The pronunciation is improving day by day."
                              </p>
                           </div>
                           <p className="text-[9px] font-black text-slate-300 uppercase tracking-widest ml-2">10:30 AM <CheckCircle2 className="inline w-3 h-3 text-indigo-500 ml-1" /></p>
                        </div>
                     </div>
                  </div>

                  {/* Message Input */}
                  <div className="p-8 border-t-2 border-slate-50 bg-white">
                     <div className="relative group">
                        <textarea 
                           className="w-full bg-slate-50 border-2 border-slate-100 rounded-[2.5rem] px-10 py-6 text-sm font-bold focus:border-indigo-500 focus:bg-white outline-none transition-all shadow-inner h-24 resize-none"
                           placeholder="Draft your message..."
                           value={message}
                           onChange={(e) => setMessage(e.target.value)}
                        ></textarea>
                        <div className="absolute right-6 bottom-6">
                           <button 
                              onClick={handleSendMessage}
                              disabled={!message.trim()}
                              className="p-4 bg-slate-900 text-white rounded-full shadow-2xl hover:scale-110 active:scale-95 transition-all disabled:opacity-30 disabled:hover:scale-100"
                           >
                              <Send className="w-6 h-6" />
                           </button>
                        </div>
                     </div>
                  </div>
               </>
            )}
         </div>
      </div>

      {/* Inquiry Modal Mockup */}
      {showInquiryModal && (
         <div className="fixed inset-0 z-[500] flex items-center justify-center p-6 bg-slate-900/40 backdrop-blur-xl animate-in fade-in duration-300">
            <div className="bg-white rounded-[3.5rem] w-full max-w-2xl p-12 shadow-2xl relative overflow-hidden">
               <div className="absolute top-0 right-0 w-32 h-32 bg-indigo-50 rounded-full -mr-10 -mt-10 blur-3xl"></div>
               <h3 className="text-3xl font-black text-slate-800 uppercase tracking-tight mb-8 relative z-10">Official Inquiry</h3>
               <div className="space-y-6 relative z-10">
                  <div className="space-y-2">
                     <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest block">Inquiry Type</label>
                     <select className="w-full bg-slate-50 border-2 border-slate-100 rounded-2xl px-6 py-4 text-sm font-bold outline-none focus:border-indigo-500 transition-all uppercase tracking-widest">
                        <option>Academic Inquiry</option>
                        <option>Financial Question</option>
                        <option>Infrastructure/Safety</option>
                        <option>Behavioral Report</option>
                     </select>
                  </div>
                  <div className="space-y-2">
                     <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest block">Detailed Description</label>
                     <textarea className="w-full bg-slate-50 border-2 border-slate-100 rounded-[2rem] px-8 py-6 text-sm font-bold outline-none focus:border-indigo-500 min-h-[150px] resize-none"></textarea>
                  </div>
                  <div className="pt-4 flex gap-4">
                     <button 
                        onClick={() => setShowInquiryModal(false)}
                        className="flex-1 py-5 bg-slate-100 text-slate-500 rounded-[2rem] font-black text-[10px] uppercase tracking-widest hover:bg-slate-200 transition-all"
                     >
                        Cancel
                     </button>
                     <button className="flex-[2] py-5 bg-indigo-600 text-white rounded-[2rem] font-black text-[10px] uppercase tracking-widest shadow-xl shadow-indigo-100 hover:bg-indigo-700 transition-all active:scale-95">
                        Submit Official Request
                     </button>
                  </div>
               </div>
            </div>
         </div>
      )}
    </div>
  );
};

export default GuardianCommunication;
