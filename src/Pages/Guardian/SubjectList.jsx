import { useState } from "react";
import { 
  BookOpen, 
  User, 
  ChevronRight, 
  Award, 
  Star,
  BookMarked,
  Info,
  Calendar,
  LayoutDashboard,
  Search,
  Clock
} from "lucide-react";
import { useAuth } from "../../context/AuthContext";

const GuardianSubjectList = () => {
  const { activeChild } = useAuth();
  const [searchQuery, setSearchQuery] = useState("");

  const subjects = [
    { 
      id: 1, 
      name: "Bangla", 
      code: "ARB-101", 
      teacher: "Sheikh Abdullah", 
      credits: "4.0", 
      type: "Core",
      description: "Advanced study of Arabic syntax and word construction principles.",
      progress: 90,
      attendance: "95%"
    },
    { 
      id: 2, 
      name: "Arabic", 
      code: "QRN-202", 
      teacher: "Ustad Junaid", 
      credits: "3.5", 
      type: "Practical",
      description: "Phonetic articulation and rules of recitation (Makharij).",
      progress: 75,
      attendance: "98%"
    },
    { 
      id: 3, 
      name: "English", 
      code: "FQS-301", 
      teacher: "Mufti Omar", 
      credits: "3.0", 
      type: "Core",
      description: "Comprehensive study of Shariah laws and daily application.",
      progress: 82,
      attendance: "92%"
    },
    { 
      id: 4, 
      name: "Math", 
      code: "HDT-402", 
      teacher: "Sheikh Abdullah", 
      credits: "3.0", 
      type: "Core",
      description: "Principles of Hadith narrations and verification metrics.",
      progress: 94,
      attendance: "96%"
     },
     { 
      id: 1, 
      name: "Bangla", 
      code: "ARB-101", 
      teacher: "Sheikh Abdullah", 
      credits: "4.0", 
      type: "Core",
      description: "Advanced study of Arabic syntax and word construction principles.",
      progress: 90,
      attendance: "95%"
    },
    { 
      id: 2, 
      name: "Arabic", 
      code: "QRN-202", 
      teacher: "Ustad Junaid", 
      credits: "3.5", 
      type: "Practical",
      description: "Phonetic articulation and rules of recitation (Makharij).",
      progress: 75,
      attendance: "98%"
    },
  ];

  const filteredSubjects = subjects.filter(subject => 
    subject.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    subject.code.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="min-h-screen bg-[#f8fafc] p-4 md:p-8 animate-in fade-in duration-500">
      <div className="max-w-[1600px] mx-auto space-y-6 md:space-y-10">
        
        

        {/* Subjects Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-5">
           {filteredSubjects.map((subject) => (
              <div key={subject.id} className="bg-white rounded-[20px] border border-slate-200/60 shadow-lg  overflow-hidden group  transition-all duration-500 flex flex-col">
                 <div className="p-6 flex-1">
                    <div className="flex justify-center items-center mb-5">
                       <div className="w-20 h-20 bg-slate-50 rounded-[2rem] flex items-center justify-center text-slate-300 group-hover:bg-primary group-hover:text-white transition-all duration-500 shadow-inner rotate-6 group-hover:rotate-0">
                          <BookMarked className="w-10 h-10" />
                       </div>
                      
                    </div>

                    <h3 className="text-[18px] md:text-[25px] font-black text-slate-800  tracking-tight leading-none group-hover:text-primary transition-colors text-center">{subject.name}</h3>
                    <div className="flex items-center justify-center gap-3 bg-[#00bd7f3b] py-2 rounded-[8px] mt-5 text-[#00bd7f]">
                       <Clock className="w-4 h-4" />
                       80:00 AM - 80:40 AM
                 </div>

                    <div className=" border border-slate-100/80 bg-white shadow-sm p-4 rounded-[8px] mt-5">
                       <div className="flex items-center gap-4">
                          <div className="w-12 h-12 bg-slate-50 rounded-2xl flex items-center justify-center text-slate-400 group-hover:bg-white group-hover:shadow-lg transition-all">
                             <User className="w-6 h-6" />
                          </div>
                          <div>
                             <p className="text-[9px] font-black text-slate-400 uppercase tracking-widest leading-none mb-1.5">Class Teacher</p>
                             <span className="text-xs font-black text-slate-800 uppercase tracking-tight">{subject.teacher}</span>
                          </div>
                       </div>
                    
                    </div>
                     
                    <div className="flex items-center justify-center">
                       <button className="cursor-pointer text-center bg-primary text-white px-4 py-3 rounded-[8px] w-full mt-5"> View Syllabus</button>
                    </div>
              
                 </div>
              </div>
           ))}
        </div>

      

      </div>
    </div>
  );
};

export default GuardianSubjectList;
