import { 
  FileText, 
  CheckCircle2, 
  Calendar, 
  Clock, 
  HelpCircle, 
  ArrowLeft,
  Info,
  BadgeAlert,
  ClipboardCheck,
  PhoneCall
} from "lucide-react";
import { Link } from "react-router-dom";

const AdmissionGuidelines = () => {
  const steps = [
    {
      title: "অনলাইন আবেদন",
      desc: "প্রথমে আমাদের ওয়েবসাইট থেকে অনলাইন ভর্তি ফরমটি নির্ভুলভাবে পূরণ করুন।"
    },
    {
      title: "কাগজপত্র জমা",
      desc: "আবেদন ফরমের প্রিন্ট কপির সাথে প্রয়োজনীয় সকল নথিপত্র মাদরাসা অফিসে জমা দিন।"
    },
    {
      title: "মৌখিক ও লিখিত পরীক্ষা",
      desc: "নির্ধারিত তারিখে শিক্ষার্থীকে মৌখিক ও লিখিত পরীক্ষায় অংশগ্রহণ করতে হবে।"
    },
    {
      title: "ভর্তি সম্পন্ন",
      desc: "পরীক্ষায় উত্তীর্ণ হওয়ার পর ভর্তির ফি প্রদান করে ভর্তি নিশ্চিত করুন।"
    }
  ];

  const requirements = [
    "শিক্ষার্থীর ৪ কপি পাসপোর্ট সাইজ রঙ্গিন ছবি।",
    "অনলাইন জন্ম নিবন্ধন সনদের ফটোকপি।",
    "পিতা ও মাতার এনআইডি কার্ডের ফটোকপি।",
    "পূর্ববর্তী প্রতিষ্ঠানের ছাড়পত্র (প্রযোজ্য ক্ষেত্রে)।",
    "পিতা/মাতা/অভিভাবকের ২ কপি পাসপোর্ট সাইজ ছবি।"
  ];

  return (
    <div className="bg-white min-h-screen font-sans">
      {/* 1. Hero Banner */}
      <section className="relative h-[300px] md:h-[400px] flex items-center justify-center overflow-hidden">
        <div className="absolute inset-0">
          <img 
            src="https://images.unsplash.com/photo-1523050335123-5e9264a0f443?q=80&w=2070" 
            className="w-full h-full object-cover" 
            alt="Admission Guidelines Banner" 
          />
          <div className="absolute inset-0 bg-[#042f2c]/85 backdrop-blur-[2px]" />
        </div>
        
        <div className="relative z-10 text-center px-6">
          <div className="flex items-center justify-center gap-2 text-emerald-400 font-bold mb-4 animate-in slide-in-from-top duration-700">
             <Link to="/portal/global-international" className="hover:text-white transition-colors flex items-center gap-1">
                <ArrowLeft className="w-4 h-4" /> Home
             </Link>
             <span>/</span>
             <span className="text-white opacity-60">ভর্তির নিয়মাবলী</span>
          </div>
          <h1 className="text-3xl md:text-5xl lg:text-6xl font-black text-white italic tracking-tight mb-4 lowercase">ভর্তি আবেদনের নিয়মাবলী</h1>
          <p className="text-emerald-50/70 text-base md:text-lg max-w-[600px] mx-auto font-medium">সহজ ও সুশৃঙ্খল ভর্তি প্রক্রিয়ার মাধ্যমে আপনার সন্তানের দ্বীনি শিক্ষার যাত্রা শুরু করুন।</p>
        </div>
      </section>

      {/* 2. Main Content Section */}
      <section className="py-16 md:py-24 px-6">
        <div className="max-w-[1240px] mx-auto">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-12">
            
            {/* Left Column: Guidelines & Process */}
            <div className="lg:col-span-2 space-y-16">
              
              {/* Introduction */}
              <div>
                <div className="flex items-center gap-3 mb-6">
                  <div className="w-10 h-10 bg-emerald-50 text-[#059669] rounded-xl flex items-center justify-center shadow-sm">
                    <Info className="w-6 h-6" />
                  </div>
                  <h2 className="text-2xl md:text-3xl font-black text-[#042f2c] italic">ভর্তি তথ্য ও যোগ্যতা</h2>
                </div>
                <p className="text-slate-600 leading-loose text-lg italic">
                  সবাইকে আল-কুরআনুল কারীম একাডেমিতে স্বাগত জানাচ্ছি। আমরা প্রতিটি শিক্ষাবর্ষের শুরুতে নতুন শিক্ষার্থী ভর্তি করে থাকি। তবে আসন খালি থাকা সাপেক্ষে বছরের যে কোনো সময় ভর্তি হওয়া সম্ভব। আমাদের একাডেমিতে নার্সারি থেকে হিফজ ও কিতাব বিভাগ পর্যন্ত ভর্তির সুযোগ রয়েছে।
                </p>
              </div>

              {/* Step by Step Process */}
              <div>
                <div className="flex items-center gap-3 mb-10">
                  <div className="w-10 h-10 bg-emerald-50 text-[#059669] rounded-xl flex items-center justify-center shadow-sm">
                    <ClipboardCheck className="w-6 h-6" />
                  </div>
                  <h2 className="text-2xl md:text-3xl font-black text-[#042f2c] italic">ভর্তি প্রক্রিয়া</h2>
                </div>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                  {steps.map((step, i) => (
                    <div key={i} className="p-8 bg-slate-50 rounded-[2.5rem] border border-slate-100 hover:shadow-lg transition-all group">
                      <div className="w-12 h-12 bg-[#059669] text-white rounded-2xl flex items-center justify-center font-black text-xl mb-6 shadow-lg shadow-emerald-900/10">
                        {i + 1}
                      </div>
                      <h3 className="text-xl font-black text-[#042f2c] mb-3 italic">{step.title}</h3>
                      <p className="text-slate-500 font-medium italic leading-relaxed">{step.desc}</p>
                    </div>
                  ))}
                </div>
              </div>

              {/* Important Documents */}
              <div className="bg-[#042f2c] rounded-[3rem] p-10 md:p-16 text-white relative overflow-hidden">
                <div className="absolute top-0 right-0 w-64 h-64 bg-emerald-500/10 rounded-full blur-3xl -mr-32 -mt-32"></div>
                <div className="relative z-10">
                  <div className="flex items-center gap-4 mb-10">
                    <FileText className="w-8 h-8 text-emerald-400" />
                    <h2 className="text-2xl md:text-3xl font-black italic">প্রয়োজনীয় কাগজপত্র</h2>
                  </div>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    {requirements.map((req, i) => (
                      <div key={i} className="flex items-start gap-4 p-4 bg-white/5 rounded-2xl border border-white/10 italic">
                        <CheckCircle2 className="w-5 h-5 text-emerald-400 mt-1 flex-shrink-0" />
                        <span className="font-medium text-emerald-50">{req}</span>
                      </div>
                    ))}
                  </div>
                </div>
              </div>

            </div>

            {/* Right Column: Sidebar Info */}
            <div className="space-y-8">
              
              {/* Timing Card */}
              <div className="bg-emerald-50 rounded-[2.5rem] p-8 border border-emerald-100 shadow-sm">
                <div className="flex items-center gap-3 mb-6">
                  <Clock className="w-6 h-6 text-[#059669]" />
                  <h3 className="text-xl font-black text-[#042f2c] italic">অফিস সময়সূচী</h3>
                </div>
                <div className="space-y-4">
                  <div className="flex justify-between items-center text-sm italic font-bold text-slate-600">
                    <span>শনিবার - বৃহস্পতিবার:</span>
                    <span className="text-[#059669]">সকাল ৮ - বিকাল ৪টা</span>
                  </div>
                  <div className="flex justify-between items-center text-sm italic font-bold text-slate-400">
                    <span>শুক্রবার:</span>
                    <span>সাপ্তাহিক ছুটি</span>
                  </div>
                </div>
              </div>

              {/* Helpline Card */}
              <div className="bg-white rounded-[2.5rem] p-8 border border-slate-100 shadow-[0_10px_40px_-15px_rgba(0,0,0,0.1)]">
                <div className="flex items-center gap-3 mb-6">
                  <HelpCircle className="w-6 h-6 text-[#059669]" />
                  <h3 className="text-xl font-black text-[#042f2c] italic">সহযোগিতার জন্য</h3>
                </div>
                <p className="text-slate-500 text-sm mb-8 italic">ভর্তি বিষয়ক যে কোনো তথ্যের জন্য আমাদের হেল্পলাইনে যোগাযোগ করুন।</p>
                <a href="tel:+8801755111111" className="flex items-center gap-4 p-4 bg-[#059669] text-white rounded-2xl hover:scale-105 transition-all shadow-lg shadow-emerald-900/20">
                  <div className="w-10 h-10 bg-white/20 rounded-xl flex items-center justify-center">
                    <PhoneCall className="w-5 h-5" />
                  </div>
                  <div>
                    <p className="text-[10px] font-bold opacity-80 uppercase tracking-widest">কল করুন</p>
                    <p className="text-lg font-black tracking-tight">+৮৮০১৭৫৫-১১১১১১</p>
                  </div>
                </a>
              </div>

              {/* Deadline Alert */}
              <div className="bg-red-50 rounded-[2.5rem] p-8 border border-red-100 text-center">
                <BadgeAlert className="w-10 h-10 text-red-500 mx-auto mb-4" />
                <h4 className="text-lg font-black text-red-900 italic mb-2">ভর্তির সময়সীমা</h4>
                <p className="text-red-700 text-xs font-bold leading-relaxed italic">২০২৫ শিক্ষাবর্ষের ভর্তি কার্যক্রম শুরু হয়েছে। দ্রুত আপনার সন্তানের আসন নিশ্চিত করুন।</p>
              </div>

            </div>
          </div>
        </div>
      </section>

      {/* 3. CTA Section */}
      <section className="pb-24 px-6 text-center">
        <div className="max-w-[800px] mx-auto bg-slate-50 rounded-[4rem] p-12 md:p-20 relative overflow-hidden group">
           <div className="absolute top-0 right-0 w-32 h-32 bg-emerald-500/5 rounded-full -mr-16 -mt-16 transition-transform duration-700"></div>
           <h2 className="text-3xl md:text-4xl font-black text-[#042f2c] italic mb-8 relative z-10">আপনি কি ভর্তির জন্য প্রস্তুত?</h2>
           <p className="text-slate-600 text-lg mb-10 font-medium italic relative z-10">অনলাইনে আবেদন করলে আমাদের প্রতিনিধিবৃন্দ আপনার সাথে যোগাযোগ করবে।</p>
           <div className="flex justify-center gap-6 relative z-10">
              <Link to="../online-admission" className="px-12 py-5 bg-[#059669] text-white font-black rounded-full shadow-2xl shadow-emerald-900/40 hover:scale-105 transition-all">অনলাইন ভর্তি ফরম</Link>
           </div>
        </div>
      </section>
    </div>
  );
};

export default AdmissionGuidelines;
