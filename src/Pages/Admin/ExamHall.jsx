import { useState } from "react";
import { 
  Plus, 
  Search, 
  MapPin, 
  Users, 
  Edit3, 
  Trash2, 
  Monitor,
  CheckCircle2,
  XCircle,
  MoreVertical
} from "lucide-react";

const ExamHall = () => {
  const [searchTerm, setSearchTerm] = useState("");
  const [isModalOpen, setIsModalOpen] = useState(false);

  // Sample Data: Exam Halls
  const [halls, setHalls] = useState([
    { id: 1, name: "Main Auditorium", capacity: 250, floor: "Ground Floor", status: "available" },
    { id: 2, name: "Computer Lab 1", capacity: 40, floor: "2nd Floor", status: "available" },
    { id: 3, name: "Lecture Hall A", capacity: 120, floor: "1st Floor", status: "under_maintenance" },
    { id: 4, name: "Zubair Hall", capacity: 80, floor: "3rd Floor", status: "available" },
  ]);

  return (
    <div className="space-y-8 animate-in fade-in duration-500 p-4 md:p-8">
      {/* Header */}
      <div className="bg-white rounded-[2.5rem] border-2 border-slate-200 p-8 flex flex-col md:flex-row justify-between items-center gap-6 shadow-sm">
        <div className="flex items-center gap-6">
          <div className="w-16 h-16 bg-blue-50 rounded-2xl flex items-center justify-center border-2 border-blue-100">
            <MapPin className="w-8 h-8 text-blue-600" />
          </div>
          <div>
            <h1 className="text-2xl md:text-3xl font-black text-slate-800">Exam Hall</h1>
            <p className="text-slate-500 font-bold mt-1">Manage examination venues and seating layouts</p>
          </div>
        </div>

        <button 
          onClick={() => setIsModalOpen(true)}
          className="w-full md:w-auto px-8 py-4 bg-blue-600 text-white rounded-2xl font-black shadow-xl shadow-blue-200 hover:bg-blue-700 hover:scale-[1.02] active:scale-95 transition-all flex items-center justify-center gap-3"
        >
          <Plus className="w-5 h-5" />
          Add Exam Hall
        </button>
      </div>

      {/* Main Content Area */}
      <div className="bg-white rounded-[2.5rem] border-2 border-slate-200 shadow-sm overflow-hidden">
        {/* Toolbar */}
        <div className="p-6 border-b-2 border-slate-50 flex flex-col md:flex-row gap-4 items-center justify-between">
          <div className="relative w-full md:w-96">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-300" />
            <input 
              placeholder="Search halls by name or floor..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-12 pr-4 py-3 bg-slate-50 border-2 border-slate-100 rounded-2xl text-sm font-bold outline-none focus:border-blue-500 transition-all"
            />
          </div>
          <div className="flex items-center gap-3">
             <div className="px-4 py-2 bg-emerald-50 text-emerald-600 rounded-xl text-[10px] font-black uppercase tracking-widest border border-emerald-100">
                {halls.filter(h => h.status === 'available').length} Available
             </div>
             <div className="px-4 py-2 bg-rose-50 text-rose-600 rounded-xl text-[10px] font-black uppercase tracking-widest border border-rose-100">
                {halls.filter(h => h.status !== 'available').length} Occupied
             </div>
          </div>
        </div>

        {/* Table */}
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-slate-50/50">
              <tr>
                <th className="px-8 py-5 text-left text-[10px] font-black text-slate-400 uppercase tracking-widest">Hall Name</th>
                <th className="px-8 py-5 text-center text-[10px] font-black text-slate-400 uppercase tracking-widest">Floor</th>
                <th className="px-8 py-5 text-center text-[10px] font-black text-slate-400 uppercase tracking-widest">Seating Capacity</th>
                <th className="px-8 py-5 text-center text-[10px] font-black text-slate-400 uppercase tracking-widest">Status</th>
                <th className="px-8 py-5 text-right text-[10px] font-black text-slate-400 uppercase tracking-widest">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y-2 divide-slate-50">
              {halls.map((hall) => (
                <tr key={hall.id} className="group hover:bg-blue-50/30 transition-colors">
                  <td className="px-8 py-6">
                    <div className="flex items-center gap-3">
                       <div className="w-10 h-10 bg-white border-2 border-slate-50 rounded-xl flex items-center justify-center shadow-sm group-hover:border-blue-200 transition-colors">
                          <Monitor className="w-5 h-5 text-blue-500" />
                       </div>
                       <span className="text-sm font-black text-slate-800">{hall.name}</span>
                    </div>
                  </td>
                  <td className="px-8 py-6 text-center">
                    <span className="text-xs font-bold text-slate-500">{hall.floor}</span>
                  </td>
                  <td className="px-8 py-6 text-center">
                    <div className="inline-flex items-center gap-2 px-4 py-1.5 bg-slate-100 rounded-full">
                       <Users className="w-3.5 h-3.5 text-slate-400" />
                       <span className="text-xs font-black text-slate-700">{hall.capacity} Seats</span>
                    </div>
                  </td>
                  <td className="px-8 py-6 text-center">
                    <span className={`inline-flex items-center gap-1.5 px-4 py-1.5 rounded-xl text-[10px] font-black uppercase tracking-widest border-2 ${
                      hall.status === 'available' 
                        ? 'bg-emerald-50 text-emerald-600 border-emerald-100' 
                        : 'bg-rose-50 text-rose-600 border-rose-100'
                    }`}>
                      {hall.status === 'available' ? <CheckCircle2 className="w-3 h-3" /> : <XCircle className="w-3 h-3" />}
                      {hall.status.replace('_', ' ')}
                    </span>
                  </td>
                  <td className="px-8 py-6 text-right">
                    <div className="flex items-center justify-end gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                      <button className="p-2.5 bg-white border-2 border-slate-100 text-slate-400 hover:text-blue-600 hover:border-blue-200 rounded-xl transition-all shadow-sm">
                        <Edit3 className="w-4 h-4" />
                      </button>
                      <button className="p-2.5 bg-white border-2 border-slate-100 text-slate-400 hover:text-rose-600 hover:border-rose-200 rounded-xl transition-all shadow-sm">
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Simplified Modal Mock */}
      {isModalOpen && (
        <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-sm z-[100] flex items-center justify-center p-4">
           <div className="bg-white rounded-[3rem] w-full max-w-xl shadow-2xl animate-in fade-in zoom-in duration-300">
              <div className="p-10 border-b-2 border-slate-50 flex items-center justify-between">
                 <h2 className="text-2xl font-black text-slate-800 tracking-tight">Add Exam Venue</h2>
                 <button onClick={() => setIsModalOpen(false)} className="p-2 hover:bg-slate-100 rounded-xl"><Plus className="w-6 h-6 text-slate-300 rotate-45" /></button>
              </div>
              <div className="p-8 space-y-6">
                 <div className="grid grid-cols-2 gap-6">
                    <div className="space-y-2 col-span-2">
                        <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Hall / Room Name</label>
                        <input className="w-full bg-slate-50 border-2 border-slate-100 rounded-2xl px-6 py-4 text-sm font-bold focus:border-blue-500 outline-none" placeholder="e.g. Science Block Room 302" />
                    </div>
                    <div className="space-y-2">
                        <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Floor</label>
                        <select className="w-full bg-slate-50 border-2 border-slate-100 rounded-2xl px-6 py-4 text-sm font-bold focus:border-blue-500 outline-none appearance-none">
                            <option>Ground Floor</option>
                            <option>1st Floor</option>
                            <option>2nd Floor</option>
                            <option>3rd Floor</option>
                        </select>
                    </div>
                    <div className="space-y-2">
                        <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Seating Capacity</label>
                        <input type="number" className="w-full bg-slate-50 border-2 border-slate-100 rounded-2xl px-6 py-4 text-sm font-bold focus:border-blue-500 outline-none" placeholder="e.g. 50" />
                    </div>
                 </div>
                 <div className="pt-6 flex gap-4">
                    <button onClick={() => setIsModalOpen(false)} className="flex-1 py-4 text-slate-500 font-black">Discard</button>
                    <button onClick={() => setIsModalOpen(false)} className="flex-1 py-4 bg-blue-600 text-white font-black rounded-2xl shadow-xl shadow-blue-200">Save Venue</button>
                 </div>
              </div>
           </div>
        </div>
      )}
    </div>
  );
};

export default ExamHall;
