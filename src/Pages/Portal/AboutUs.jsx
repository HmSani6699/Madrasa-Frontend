import { 
  History, 
  Target, 
  Eye, 
  Heart, 
  BookOpen, 
  Award, 
  CheckCircle2,
  ArrowLeft
} from "lucide-react";
import { Link } from "react-router";

const AboutUs = () => {
  return (
    <div className="bg-white min-h-screen font-sans">
      {/* 1. Hero Banner */}
      <section className="relative h-[400px] flex items-center justify-center overflow-hidden">
        <div className="absolute inset-0">
          <img 
            src="https://images.unsplash.com/photo-1591604129939-f1efa4d9f7fa?q=80&w=2070" 
            className="w-full h-full object-cover" 
            alt="About Banner" 
          />
          <div className="absolute inset-0 bg-[#042f2c]/80 backdrop-blur-[2px]" />
        </div>
        
        <div className="relative z-10 text-center px-6">
          <div className="flex items-center justify-center gap-2 text-emerald-400 font-bold mb-4 animate-in slide-in-from-top duration-700">
             <Link to="/portal/global-international" className="hover:text-white transition-colors flex items-center gap-1">
                <ArrowLeft className="w-4 h-4" /> Home
             </Link>
             <span>/</span>
             <span className="text-white opacity-60">বিস্তারিত জানুন</span>
          </div>
          <h1 className="text-3xl md:text-5xl lg:text-6xl font-black text-white italic tracking-tight mb-4">আমাদের সম্পর্কে বিস্তারিত</h1>
          <p className="text-emerald-50/70 text-base md:text-lg max-w-[600px] mx-auto font-medium">আধুনিক সুশিক্ষিত ও আদর্শ জাতির অন্যতম প্রধান কারিগর গঠন আমাদের লক্ষ্য।</p>
        </div>
      </section>

      {/* 2. core mission & vision */}
      <section className="py-24 px-6">
        <div className="max-w-[1240px] mx-auto">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-20 items-center mb-32">
            <div className="relative order-2 lg:order-1">
               <div className="rounded-[3rem] overflow-hidden shadow-2xl p-3 bg-white border border-slate-100">
                  <img src="https://images.unsplash.com/photo-1533854775446-65c4a2f5d8ef?q=80&w=2070" className="w-full h-auto rounded-[2.5rem]" alt="Mission" />
               </div>
               <div className="absolute -bottom-10 -right-10 w-40 h-40 bg-[#059669] rounded-full flex flex-col items-center justify-center text-white shadow-2xl border-4 border-white">
                  <Target className="w-10 h-10 mb-1" />
                  <span className="text-xs font-black uppercase tracking-widest">Our Mission</span>
               </div>
            </div>
            <div className="order-1 lg:order-2">
               <span className="text-[#059669] font-black text-xs uppercase tracking-[0.3em] mb-4 block">Institutional Goal</span>
               <h2 className="text-4xl font-black text-[#042f2c] italic mb-8 leading-tight">আমাদের লক্ষ্য ও উদ্দেশ্য <br /> (Our Mission)</h2>
               <p className="text-slate-600 text-lg leading-loose italic mb-8">
                 আল-কুরআনুল কারীম একাডেমি একটি উত্তর আধুনিক দ্বীনি প্রতিষ্ঠান। আমাদের মূল লক্ষ্য হলো সুন্নাহ ও কোরআন ভিত্তিক সঠিক পদ্ধতিতে পাঠদান করে একটি আদর্শ ও নৈতিকবান প্রজন্ম গড়ে তোলা। আমরা বিশ্বাস করি সঠিক দ্বীনি শিক্ষা ই পারে একটি সুন্দর ও শান্তিময় সমাজ উপহার দিতে।
               </p>
               <div className="space-y-4">
                  {[
                    "সুন্নাহ ভিত্তিক জীবন গড়ার সঠিক দিকনির্দেশনা",
                    "আধুনিক ও যুগোপযোগী শিক্ষা ব্যবস্থার সমন্বয়",
                    "উন্নত চরিত্র ও নৈতিকতা গঠন",
                    "সামাজিক ও ধর্মীয় দায়বদ্ধতা সচেতনতা"
                  ].map((item, i) => (
                    <div key={i} className="flex items-center gap-4">
                      <div className="w-6 h-6 rounded-full bg-emerald-50 flex items-center justify-center text-[#059669]"><CheckCircle2 className="w-4 h-4" /></div>
                      <span className="text-slate-800 font-bold italic">{item}</span>
                    </div>
                  ))}
               </div>
            </div>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-20 items-center">
            <div>
               <span className="text-[#059669] font-black text-xs uppercase tracking-[0.3em] mb-4 block">Forward Thinking</span>
               <h2 className="text-4xl font-black text-[#042f2c] italic mb-8 leading-tight">আমাদের স্বপ্ন ও ভিশন <br /> (Our Vision)</h2>
               <p className="text-slate-600 text-lg leading-loose italic mb-8">
                 ভবিষ্যতে আমরা এমন একটি সমাজ কল্পনা করি যেখানে প্রতিটি শিশু হবে কোরআনের আলোয় আলোকিত। আমরা একটি আন্তর্জাতিক মান সম্পন্ন দ্বীনি শিক্ষা প্রতিষ্ঠান হিসেবে নিজেদের গড়ে তুলতে চাই, যেখানে ছাত্ররা কেবল ধর্মীয় জ্ঞানে নয় বরং আধুনিক সকল বিদ্যায় পারদর্শী হবে।
               </p>
               <div className="grid grid-cols-2 gap-6">
                  <div className="p-6 bg-slate-50 rounded-3xl border border-slate-100 group hover:bg-[#059669] transition-all">
                     <BookOpen className="w-10 h-10 text-[#059669] group-hover:text-white mb-4 transition-colors" />
                     <h4 className="font-black text-slate-800 group-hover:text-white italic transition-colors">আন্তর্জাতিক সিলেবাস</h4>
                  </div>
                  <div className="p-6 bg-slate-50 rounded-3xl border border-slate-100 group hover:bg-[#059669] transition-all">
                     <Award className="w-10 h-10 text-[#059669] group-hover:text-white mb-4 transition-colors" />
                     <h4 className="font-black text-slate-800 group-hover:text-white italic transition-colors">শ্রেষ্ঠত্বের সম্মান</h4>
                  </div>
               </div>
            </div>
            <div className="relative">
               <div className="rounded-[3rem] overflow-hidden shadow-2xl p-3 bg-white border border-slate-100">
                  <img src="https://images.unsplash.com/photo-1544367567-0f2fcb009e0b?q=80&w=2040" className="w-full h-auto rounded-[2.5rem]" alt="Vision" />
               </div>
               <div className="absolute -top-10 -left-10 w-40 h-40 bg-[#042f2c] rounded-full flex flex-col items-center justify-center text-white shadow-2xl border-4 border-white">
                  <Eye className="w-10 h-10 mb-1" />
                  <span className="text-xs font-black uppercase tracking-widest">Our Vision</span>
               </div>
            </div>
          </div>
        </div>
      </section>

      {/* 3. Core Values Grid */}
      <section className="py-24 bg-[#042f2c] relative overflow-hidden">
        <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-emerald-500/10 rounded-full blur-[100px] -mr-40 -mt-40"></div>
        <div className="max-w-[1240px] mx-auto px-6 relative z-10">
          <div className="text-center mb-20">
             <span className="inline-block px-4 py-1.5 bg-white/10 text-[#059669] text-[10px] font-black uppercase tracking-widest rounded-full mb-4">Core Principles</span>
             <h2 className="text-4xl font-black text-white italic">আমাদের মূল বৈশিষ্ট্যসমূহ</h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {[
              { icon: Heart, title: "তাকওয়া ও খোদাভীতি", desc: "প্রতিটি কাজে আল্লাহর সন্তুষ্টি অর্জন ই আমাদের প্রধান লক্ষ্য।" },
              { icon: History, title: "ঐতিহ্য ও সংস্কৃতি", desc: "সুদীর্ঘ দ্বীনি ঐতিহ্যকে ধারণ করে আধুনিকতার সমন্বয়।" },
              { icon: BookOpen, title: "মানসম্মত পাঠদান", desc: "অভিজ্ঞ শিক্ষকমন্ডলী দ্বারা প্রতিটি ছাত্রকে ব্যক্তিগত যত্ন প্রদান।" },
              { icon: Target, title: "সঠিক আকিদা", desc: "আহলে সুন্নাত ওয়াল জামাআতের সঠিক আকিদা অনুযায়ী জীবন পরিচালনা।" },
              { icon: Eye, title: "সামাজিক নেতৃত্ব", desc: "ছাত্রদের এমনভাবে গড়ে তোলা যাতে তারা ভবিষ্যতে সমাজকে নেতৃত্ব দিতে পারে।" },
              { icon: Award, title: "পূর্ণাঙ্গ শিক্ষা", desc: "কিতাব ও আমলের পাশাপাশি আধুনিক প্রযুক্তি ও ভাষায় পারদর্শিতা।" }
            ].map((value, i) => (
              <div key={i} className="p-10 bg-white/5 backdrop-blur-md border border-white/10 rounded-[3rem] hover:bg-white/10 transition-all group">
                <div className="w-16 h-16 bg-white rounded-2xl flex items-center justify-center text-[#059669] mb-8 shadow-xl group-hover:scale-110 transition-transform">
                  <value.icon className="w-8 h-8" />
                </div>
                <h3 className="text-2xl font-black text-white italic mb-4">{value.title}</h3>
                <p className="text-emerald-50/60 font-medium leading-relaxed italic">{value.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* 4. Contact CTA */}
      <section className="py-32 bg-white px-6">
        <div className="max-w-[1000px] mx-auto bg-[#f0f9f6] rounded-[4rem] p-12 md:p-20 text-center relative overflow-hidden group">
           <div className="absolute top-0 right-0 w-32 h-32 bg-[#059669]/10 rounded-full -mr-16 -mt-16 group-hover:scale-150 transition-transform duration-700"></div>
           <div className="absolute bottom-0 left-0 w-32 h-32 bg-[#059669]/10 rounded-full -ml-16 -mb-16 group-hover:scale-150 transition-transform duration-700"></div>
           
           <h2 className="text-4xl md:text-5xl font-black text-[#042f2c] italic mb-8 relative z-10">আপনার সন্তানের দ্বীনি শিক্ষার জন্য <br /> আজই যোগাযোগ করুন</h2>
           <p className="text-slate-600 text-lg mb-12 max-w-[600px] mx-auto font-medium relative z-10 italic">আমরা আপনাকে ও আপনার সন্তানকে আমাদের এই দ্বীনি পরিবারে স্বাগত জানাতে সদা প্রস্তুত।</p>
           
           <div className="flex flex-wrap justify-center gap-6 relative z-10">
              <button className="px-12 py-5 bg-[#059669] text-white font-black rounded-full shadow-2xl shadow-emerald-900/40 hover:scale-105 transition-all">অনলাইন ভর্তি ফরম</button>
              <button className="px-12 py-5 bg-white border-2 border-slate-200 text-[#042f2c] font-black rounded-full hover:border-[#059669] hover:text-[#059669] transition-all">সাক্ষাতের জন্য অ্যাপয়েন্টমেন্ট</button>
           </div>
        </div>
      </section>
    </div>
  );
};

export default AboutUs;
