import { useState } from "react";
import { 
  Table, 
  Search, 
  Filter, 
  Download, 
  FileText, 
  Printer, 
  ChevronDown,
  School
} from "lucide-react";

const GuardianExamResults = () => {
  const [selectedSession, setSelectedSession] = useState("Academic Session 2026");
  const [selectedClass, setSelectedClass] = useState("Class 5");
  return (
    <div className="space-y-8 animate-in fade-in duration-500 p-4 md:p-8">
      {/* Header */}
      <div className="bg-white rounded-[20px] border-2 border-slate-200 p-8 flex flex-col md:flex-row justify-between items-center gap-6 shadow-sm">
        <div className="flex items-center gap-6">
          <div className="w-16 h-16 bg-emerald-50 rounded-2xl flex items-center justify-center border-2 border-emerald-100">
            <Table className="w-8 h-8 text-[#00bd7f]" />
          </div>
          <div>
            <h1 className="text-2xl md:text-3xl font-black text-slate-800">
              Tabulation Sheet
            </h1>
           
          </div>
        </div>

        <div className="flex gap-4">
           <button className="px-6 py-4 bg-white border-2 border-slate-200 text-slate-600 rounded-[8px] font-black shadow-sm hover:border-[#00bd7f] hover:text-[#00bd7f] transition-all flex items-center justify-center gap-3">
             <Printer className="w-5 h-5" />
             Print
           </button>
           <button className="px-8  bg-[#00bd7f] text-white rounded-[8px] font-black shadow-xl shadow-emerald-200 hover:bg-[#009b68] transition-all flex items-center justify-center gap-3">
             <Download className="w-5 h-5" />
             Export PDF
           </button>
        </div>
      </div>

      {/* Control Bar */}
      <div className="bg-white p-6 rounded-[20px] border-2 border-slate-200 shadow-sm">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-2">
                <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest px-1">Session</label>
                <div className="relative group">
                    <select 
                      value={selectedSession}
                      onChange={(e) => setSelectedSession(e.target.value)}
                      className="w-full bg-slate-50 border-2 border-slate-100 rounded-xl px-4 py-3 text-sm font-bold focus:border-[#00bd7f] outline-none appearance-none cursor-pointer transition-all"
                    >
                      <option>Academic Session 2026</option>
                      <option>Academic Session 2025</option>
                    </select>
                    <ChevronDown className="absolute right-4 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-300 pointer-events-none group-focus-within:text-[#00bd7f]" />
                </div>
              </div>


              <div className="flex items-end">
                <button className="w-full py-3.5 bg-[#00bd7f] text-white rounded-[8px] font-black  tracking-widest  shadow-lg hover:bg-slate-700 transition-all flex items-center justify-center gap-2">
                  <Filter className="w-4 h-4 text-[#00bd7f]" />
                Filter
                </button>
              </div>
          </div>
      </div>

      {/* Tabulation Table */}
      <div className="bg-white rounded-[20px] border-2 border-slate-200 shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full border-collapse">
              <thead>
                <tr className="bg-slate-50/50 text-[10px] font-black text-slate-400 uppercase tracking-widest whitespace-nowrap">
                   
                    <th className="px-4 py-6 whitespace-nowrap text-center border-r border-slate-100 min-w-[80px]">Quran</th>
                    <th className="px-4 py-6 whitespace-nowrap text-center border-r border-slate-100 min-w-[80px]">Hadith</th>
                    <th className="px-4 py-6 whitespace-nowrap text-center border-r border-slate-100 min-w-[80px]">Fiqh</th>
                    <th className="px-4 py-6 whitespace-nowrap text-center border-r border-slate-100 min-w-[80px]">Arabic</th>
                    <th className="px-4 py-6 whitespace-nowrap text-center border-r border-slate-100 min-w-[80px]">English</th>
                    <th className="px-4 py-6 whitespace-nowrap text-center border-r border-slate-100 bg-[#f0f9f6] text-[#00bd7f]">Grand Total</th>
                    <th className="px-4 py-6 whitespace-nowrap text-center border-r border-slate-100">GPA</th>
                    <th className="px-6 py-6 text-center border-r border-slate-100">Result</th>
                </tr>
              </thead>
              <tbody className="divide-y-2 divide-slate-50">
                {[1, 2, 3, 4, 5, 6, 7, 8].map((i) => (
                    <tr key={i} className="group hover:bg-emerald-50/10 transition-all">
                     
                      {['85', '92', '78', '95', '88'].map((mark, idx) => (
                          <td key={idx} className="px-4 py-6 text-center border-r border-slate-50 font-mono text-sm font-bold text-slate-600">
                            {parseInt(mark) - i}
                          </td>
                      ))}
                      <td className="px-4 py-6 text-center bg-[#f0f9f6]/30 border-r border-slate-50">
                          <p className="text-sm font-black text-[#00bd7f]">{438 - (i * 3)}</p>
                      </td>
                      <td className="px-4 py-6 text-center border-r border-slate-50">
                          <p className="text-sm font-black text-slate-800">{(5.0 - (i * 0.05)).toFixed(2)}</p>
                      </td>
                      <td className="px-6 py-6 text-center border-r border-slate-50">
                          <span className={`px-3 py-1 rounded-full text-[9px] font-black uppercase tracking-widest ${i > 6 ? 'bg-rose-50 text-rose-500 border border-rose-100' : 'bg-emerald-50 text-[#00bd7f] border border-emerald-100'}`}>
                            {i > 6 ? 'Failed' : 'Passed'}
                          </span>
                      </td>
                    </tr>
                ))}
              </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default GuardianExamResults;
