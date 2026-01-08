import { useState, useEffect, useCallback } from "react";
import { Link } from "react-router";
import { 
  Users, 
  GraduationCap, 
  BookOpen, 
  Award, 
  PlayCircle,
  ArrowRight,
  ChevronLeft,
  ChevronRight
} from "lucide-react";

const MadrasaPortal = () => {
  // --- Responsive Window Logic ---
  const [windowWidth, setWindowWidth] = useState(window.innerWidth);
  useEffect(() => {
    const handleResize = () => setWindowWidth(window.innerWidth);
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  // Responsive breakpoints logic
  const getVisibleItems = (type) => {
    if (windowWidth < 640) return 1; // mobile
    if (windowWidth < 1024) return type === 'students' ? 2 : 2; // tablet
    return type === 'students' ? 5 : 3; // desktop
  };

  const visibleStudents = getVisibleItems('students');
  const visibleTeachers = getVisibleItems('teachers');
  const visibleVideos = getVisibleItems('videos');

  // --- Hero Slider State & Logic ---
  const [currentSlide, setCurrentSlide] = useState(0);
  const slides = [
    {
      image: "https://plus.unsplash.com/premium_photo-1661884485590-b186b518779d?q=80&w=2070",
      title: "আল-কুরআনুল কারীম একাডেমি",
      subtitle: "নাজরা বিভাগ, হিফজ বিভাগ, মাদ্দে একাডেমি",
      accent: "সুন্নাহ ও কোরআন ভিত্তিক সঠিক পদ্ধতিতে পাঠদান"
    },
    {
      image: "https://images.unsplash.com/photo-1591604129939-f1efa4d9f7fa?q=80&w=2070",
      title: "আধুনিক দ্বীনি শিক্ষা প্রতিষ্ঠান",
      subtitle: "উন্নত পরিবেশে সঠিক তিলাওয়াত ও হিফজ শিক্ষা",
      accent: "অভিজ্ঞ হাফেজ ও কারীগণের তত্ত্বাবধানে পরিচালিত"
    },
    {
      image: "https://images.unsplash.com/photo-1466442929976-97f336a657be?q=80&w=1974",
      title: "আপনার সন্তানের উজ্জ্বল ভবিষ্যৎ",
      subtitle: "হৃদয়ে ঈমান ও আমলের চর্চা ই আমাদের লক্ষ্য",
      accent: "সুন্দর ও সুশৃঙ্খল পরিবেশের নিশ্চয়তা"
    }
  ];

  const nextSlide = useCallback(() => {
    setCurrentSlide((prev) => (prev === slides.length - 1 ? 0 : prev + 1));
  }, [slides.length]);

  const prevSlide = () => {
    setCurrentSlide((prev) => (prev === 0 ? slides.length - 1 : prev - 1));
  };

  useEffect(() => {
    const timer = setInterval(nextSlide, 5000);
    return () => clearInterval(timer);
  }, [nextSlide]);

  // --- Student Slider State & Logic ---
  const [studentIndex, setStudentIndex] = useState(0);
  const students = [
    { name: "হযরত আলী", dept: "হিফজ বিভাগ", id: 1, image: "https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?q=80&w=1974" },
    { name: "ওমর ফারুক", dept: "নাজরা বিভাগ", id: 2, image: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?q=80&w=1974" },
    { name: "উসমান গনী", dept: "হিফজ বিভাগ", id: 3, image: "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?q=80&w=1974" },
    { name: "আবু বকর", dept: "মাদ্দে একাডেমি", id: 4, image: "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?q=80&w=1974" },
    { name: "খালেদ বিন ওয়ালিদ", dept: "হিফজ বিভাগ", id: 5, image: "https://images.unsplash.com/photo-1519085360753-af0119f7cbe7?q=80&w=1974" },
    { name: "তারেক বিন জিয়াদ", dept: "নাজরা বিভাগ", id: 6, image: "https://images.unsplash.com/photo-1542343633-ce3256f2183e?q=80&w=1974" },
    { name: "সালাহউদ্দিন আইয়ুবী", dept: "হিফজ বিভাগ", id: 7, image: "https://images.unsplash.com/photo-1503443207922-dff7d543fd0e?q=80&w=1974" },
    { name: "মুহাম্মদ আল-ফাতিহ", dept: "মাদ্দে একাডেমি", id: 8, image: "https://images.unsplash.com/photo-1513956589380-bad6acb9b9d4?q=80&w=1974" }
  ];

  const maxStudentIndex = Math.max(0, students.length - visibleStudents);

  const nextStudent = () => {
    setStudentIndex((prev) => (prev >= maxStudentIndex ? 0 : prev + 1));
  };

  const prevStudent = () => {
    setStudentIndex((prev) => (prev <= 0 ? maxStudentIndex : prev - 1));
  };

  // --- Teacher Slider State & Logic ---
  const [teacherIndex, setTeacherIndex] = useState(0);
  const teachers = [
    { name: "মুফতি আব্দুর রহমান", role: "সিনিয়র শিক্ষক", image: "https://images.unsplash.com/photo-1566492031773-4f4e44671857?q=80&w=1974" },
    { name: "হাফেজ মাওলানা ওবায়দুল্লাহ", role: "হিফজ বিভাগীয় প্রধান", image: "https://images.unsplash.com/photo-1560250097-0b93528c311a?q=80&w=1974" },
    { name: "মাওলানা মাহমুদ হাসান", role: "আরবি সাহিত্যিক", image: "https://images.unsplash.com/photo-1463453091185-61582044d556?q=80&w=1974" },
    { name: "মাওলানা সাইফুল ইসলাম", role: "সিনিয়র মুহাদ্দিস", image: "https://images.unsplash.com/photo-1504257432389-52343af06ae3?q=80&w=1974" },
    { name: "মুফতি সালমান আহমদ", role: "শাইখুল হাদিস", image: "https://images.unsplash.com/photo-1556157382-97dee2dcbfe6?q=80&w=1974" }
  ];

  const maxTeacherIndex = Math.max(0, teachers.length - visibleTeachers);

  const nextTeacher = () => {
    setTeacherIndex((prev) => (prev >= maxTeacherIndex ? 0 : prev + 1));
  };

  const prevTeacher = () => {
    setTeacherIndex((prev) => (prev <= 0 ? maxTeacherIndex : prev - 1));
  };

  // --- Video Slider State & Logic ---
  const [videoIndex, setVideoIndex] = useState(0);
  const videos = [
    { title: "বার্ষিক পুরষ্কার বিতরণী অনুষ্ঠান ২০২৪", thumb: "https://images.unsplash.com/photo-1523050353055-f112d624bf3b?q=80&w=2070" },
    { title: "হিফজ প্রতিযোগিতার বিশেষ মুহূর্ত", thumb: "https://images.unsplash.com/photo-1540561214051-518451f2f87a?q=80&w=1974" },
    { title: "উন্নত দ্বীনি শিক্ষা ও আধুনিক পরিবেশ", thumb: "https://images.unsplash.com/photo-1591604129939-f1efa4d9f7fa?q=80&w=2070" },
    { title: "মাদরাসা প্রাঙ্গণে বিশেষ দোয়ার মাহফিল", thumb: "https://images.unsplash.com/photo-1563911302283-d2bc1d9e7290?q=80&w=1976" },
    { title: "খতমে কুরআন ও ইফতার মাহফিল", thumb: "https://images.unsplash.com/photo-1582213702164-ff884d00a84c?q=80&w=2070" }
  ];

  const maxVideoIndex = Math.max(0, videos.length - visibleVideos);

  const nextVideo = () => {
    setVideoIndex((prev) => (prev >= maxVideoIndex ? 0 : prev + 1));
  };

  const prevVideo = () => {
    setVideoIndex((prev) => (prev <= 0 ? maxVideoIndex : prev - 1));
  };

  return (
    <div className="overflow-hidden font-sans bg-white pb-20">
      {/* 1. Hero Section (Premium Slider) */}
      <section id="hero" className="relative h-[600px] md:h-[700px] lg:h-[800px] w-full overflow-hidden">
        {/* Slides */}
        {slides.map((slide, index) => (
          <div
            key={index}
            className={`absolute inset-0 transition-opacity duration-1000 ease-in-out ${
              index === currentSlide ? "opacity-100 z-10" : "opacity-0 z-0"
            }`}
          >
            {/* Background Image with Overlay */}
            <div className="absolute inset-0">
               <img src={slide.image} className="w-full h-full object-cover scale-105" alt="Banner" />
               <div className="absolute inset-0 bg-gradient-to-r from-[#042f2c]/90 via-[#042f2c]/60 to-transparent" />
            </div>

            {/* Content Container */}
            <div className="max-w-[1400px] mx-auto px-6 md:px-10 h-full flex items-center justify-center md:justify-start relative z-20">
               <div className={`max-w-[700px] text-center md:text-left transition-all duration-700 delay-300 ${
                 index === currentSlide ? "translate-y-0 opacity-100" : "translate-y-10 opacity-0"
               }`}>
                  <span className="inline-block px-3 py-1 md:px-4 md:py-1.5 bg-[#059669] text-white text-[8px] md:text-[10px] font-black uppercase tracking-widest rounded-full mb-4 md:mb-6 shadow-xl">
                    {slide.accent}
                  </span>
                  <h1 className="text-3xl sm:text-4xl md:text-6xl lg:text-7xl font-black text-white mb-4 md:mb-6 italic leading-tight tracking-tight drop-shadow-2xl">
                    {slide.title}
                  </h1>
                  <p className="text-emerald-50/80 text-base sm:text-lg md:text-2xl font-bold italic mb-8 md:mb-10 leading-relaxed max-w-[500px] mx-auto md:mx-0">
                    {slide.subtitle}
                  </p>
                  
                  <div className="flex flex-col sm:flex-row flex-wrap justify-center md:justify-start gap-4 md:gap-6">
                     <Link to="admission" className="px-6 md:px-10 py-3 md:py-4 bg-[#059669] text-white font-black text-xs md:text-sm rounded-full shadow-2xl shadow-emerald-900/40 flex items-center justify-center gap-2 hover:scale-105 transition-all">
                       ভর্তি আবেদনের নিয়মাবলী
                       <ArrowRight className="w-4 h-4" />
                     </Link>
                     <button className="px-6 md:px-10 py-3 md:py-4 bg-white/10 backdrop-blur-md border border-white/20 text-white font-black text-xs md:text-sm rounded-full flex items-center justify-center gap-2 hover:bg-white/20 transition-all">
                       আমাদের সম্পর্কে জানুন
                     </button>
                  </div>
               </div>
            </div>
          </div>
        ))}

            {/* Navigation Arrows - Show on hover */}
            <div className="absolute inset-0 flex items-center justify-between p-4 z-30 pointer-events-none opacity-0 group-hover:opacity-100 transition-opacity duration-300">
               <button 
                  onClick={prevSlide}
                  className="w-12 h-12 rounded-full bg-white/10 backdrop-blur-md border border-white/20 text-white flex items-center justify-center hover:bg-[#059669] hover:border-[#059669] transition-all pointer-events-auto"
               >
                  <ChevronLeft className="w-6 h-6" />
               </button>
               <button 
                  onClick={nextSlide}
                  className="w-12 h-12 rounded-full bg-white/10 backdrop-blur-md border border-white/20 text-white flex items-center justify-center hover:bg-[#059669] hover:border-[#059669] transition-all pointer-events-auto"
               >
                  <ChevronRight className="w-6 h-6" />
               </button>
            </div>

        {/* Slide Dots - Always visible */}
        <div className="absolute bottom-10 left-1/2 -translate-x-1/2 z-30 flex gap-3">
           {slides.map((_, index) => (
             <button
               key={index}
               onClick={() => setCurrentSlide(index)}
               className={`h-2 rounded-full transition-all duration-500 ${
                 index === currentSlide ? "w-12 bg-[#059669] shadow-[0_0_20px_rgba(5,150,105,0.5)]" : "w-3 bg-white/40 hover:bg-white/60"
               }`}
             />
           ))}
        </div>
      </section>

      {/* 2. Overlapping Stats Cards */}
      <div className="max-w-[1000px] mx-auto px-4 relative z-30 -mb-10 md:-mb-20 mt-12 md:mt-20 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
         {[
           { val: "৫০০+", label: "শিক্ষার্থী", icon: Users },
           { val: "৩০+", label: "শিক্ষক", icon: GraduationCap },
           { val: "১৫+", label: "শ্রেণী", icon: BookOpen },
           { val: "১০+", label: "পুরস্কার", icon: Award }
         ].map((stat, i) => (
           <div key={i} className="bg-white p-6 md:p-8 rounded-3xl shadow-[0_10px_40px_-10px_rgba(0,0,0,0.1)] border border-slate-50 text-center hover:translate-y-[-5px] transition-all">
              <div className="w-12 h-12 bg-emerald-50 text-[#059669] rounded-2xl flex items-center justify-center mx-auto mb-4 border border-emerald-100">
                 <stat.icon className="w-6 h-6" />
              </div>
              <h3 className="text-3xl font-black text-[#042f2c] mb-1 italic">{stat.val}</h3>
              <p className="text-[11px] font-bold text-slate-400 uppercase tracking-widest">{stat.label}</p>
           </div>
         ))}
      </div>

      {/* 3. About Section */}
      <section id="about" className="pt-32 md:pt-40 pb-24 bg-white relative">
         <div className="max-w-[1200px] mx-auto px-6 flex flex-col lg:flex-row items-center gap-12 lg:gap-20">
            <div className="flex-1 relative mb-12 lg:mb-0">
                <div className="rounded-[3rem] overflow-hidden shadow-2xl bg-white p-3 border border-slate-100">
                   <img src="https://images.unsplash.com/photo-1591604129939-f1efa4d9f7fa?q=80&w=2070" className="w-full h-auto rounded-[2.5rem]" alt="Madrasa Campus" />
                </div>
               <div className="absolute bottom-[-30px] right-2 sm:right-[-20px] md:right-[-40px] w-32 h-32 md:w-48 md:h-48 rounded-full border-[6px] md:border-[10px] border-white shadow-2xl overflow-hidden z-20 transition-all duration-500">
                  <img src="https://images.unsplash.com/photo-1540561214051-518451f2f87a?q=80&w=1974" className="w-full h-full object-cover bg-emerald-50" alt="Principal" />
               </div>
            </div>
            <div className="flex-1">
               <span className="inline-block px-4 py-1.5 bg-emerald-50 border border-emerald-100 text-[#059669] text-[10px] font-black uppercase tracking-widest rounded-full mb-6">আমাদের সম্পর্কে</span>
               <h2 className="text-2xl md:text-[30px] font-black text-[#042f2c] mb-6 md:mb-8 italic leading-[1.2]"> আধুনিক সুশিক্ষিত ও আদর্শ জাতির অন্যতম প্রধান কারিগর গঠন</h2>
               <p className="text-slate-600 font-medium mb-8 md:mb-10 leading-relaxed text-base md:text-lg italic">
                 আল-কুরআনুল কারীম একাডেমি একটি উত্তর আধুনিক দ্বীনি প্রতিষ্ঠান। যেখানে সুন্নাহ ও কোরআন ভিত্তিক সঠিক পদ্ধতিতে পাঠদান করা হয়। 
                 সঠিক দ্বীনি শিক্ষা ই পারে একটি সুন্দর ও শান্তিময় সমাজ উপহার দিতে।
               </p>
               
               <div className="space-y-4 mb-10">
                  {[
                    "উন্নত আধুনিক পদ্ধতিতে পাঠদান",
                    "অভিজ্ঞ ও দক্ষ হাফেজ ও কারী",
                    "সুশৃঙ্খল পরিবেশ ও আধুনিক পাঠদান",
                    "মাসিক বিশেষ মূল্যায়নের ব্যবস্থা"
                  ].map((text, i) => (
                    <div key={i} className="flex items-center gap-3">
                       <div className="w-5 h-5 bg-emerald-500 rounded-full flex items-center justify-center text-white"><ArrowRight className="w-3 h-3" /></div>
                       <span className="text-slate-800 font-bold italic">{text}</span>
                    </div>
                  ))}
               </div>

               <Link to="about" className="inline-block px-10 py-4 bg-[#059669] text-white font-black text-sm rounded-full shadow-xl shadow-emerald-900/20 hover:scale-105 transition-all text-center">
                  বিস্তারিত জানুন
               </Link>
            </div>
         </div>
      </section>

      {/* 4. Curriculum Section */}
      <section id="academic" className="py-24 bg-[#059669] relative overflow-hidden">
         <div className="absolute top-0 right-0 w-[600px] h-[600px] bg-white opacity-5 rounded-full blur-[100px] -mr-32 -mt-32"></div>
         <div className="max-w-[1200px] mx-auto px-6 relative z-10">
            <div className="text-center mb-16">
               <span className="inline-block px-4 py-1.5 bg-white/10 text-white text-[10px] font-black uppercase tracking-widest rounded-full mb-4">পাঠ্যক্রম</span>
               <h2 className="text-2xl sm:text-3xl md:text-4xl font-black text-white italic">বিশেষ ক্লাস কারিকুলাম</h2>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
               {[1, 2, 3, 4, 5, 6].map((idx) => (
                  <div key={idx} className="bg-white/10 backdrop-blur-md border border-white/20 p-6 rounded-3xl flex items-center gap-6 hover:bg-white/20 transition-all cursor-pointer">
                     <div className="w-14 h-14 bg-white rounded-2xl flex items-center justify-center text-[#059669] shadow-lg">
                        <BookOpen className="w-7 h-7" />
                     </div>
                     <div>
                        <h4 className="text-white font-black text-xl italic uppercase tracking-tight">Class {idx === 1 ? 'One' : idx === 2 ? 'Two' : 'Three'}</h4>
                        <p className="text-emerald-50/50 text-xs font-bold tracking-widest mt-1">Syllabus 2025</p>
                     </div>
                  </div>
               ))}
            </div>
         </div>
      </section>

      {/* 5. Student Showcase Slider */}
      <section id="students" className="py-24 bg-white">
         <div className="max-w-[1400px] mx-auto px-6">
            <div className="text-center mb-16 px-4">
               <span className="inline-block px-4 py-1.5 bg-slate-100 text-slate-500 text-[10px] font-black uppercase tracking-widest rounded-full mb-4">আমাদের শিক্ষার্থী</span>
               <h2 className="text-2xl sm:text-3xl md:text-4xl font-black text-[#042f2c] italic">আমাদের কৃতি শিক্ষার্থী বৃন্দ</h2>
            </div>
            
            <div className="relative group/nav px-12 md:px-16">
               <div className="relative overflow-hidden px-4">
                  <div 
                    className="transition-transform duration-700 ease-in-out"
                    style={{ transform: `translateX(calc(-${studentIndex} * (100% + 2rem) / ${visibleStudents}))` }}
                  >
                     <div className="flex gap-8">
                        {students.map((student) => (
                           <div 
                             key={student.id} 
                             className="text-center group flex-shrink-0"
                             style={{ width: `calc((100% - ${(visibleStudents - 1) * 2}rem) / ${visibleStudents})` }}
                           >
                           <div className="relative mb-6 mx-auto">
                              <div className="w-32 h-32 md:w-40 md:h-40 rounded-full border-4 border-emerald-50 p-1.5 group-hover:border-[#059669] group-hover:scale-105 transition-all mx-auto bg-white shadow-lg overflow-hidden">
                                 <img src={student.image} className="w-full h-full rounded-full object-cover bg-slate-50 shadow-inner" alt="Student" />
                              </div>
                              <div className="absolute bottom-2 right-4 md:right-8 w-8 h-8 bg-white rounded-full shadow-lg flex items-center justify-center border border-slate-100">
                                 <div className="w-2 h-2 bg-emerald-500 rounded-full animate-pulse" />
                              </div>
                           </div>
                           <h4 className="font-black text-xl text-slate-800 italic">{student.name}</h4>
                           <p className="text-[10px] font-black text-[#059669] uppercase tracking-[0.2em] mt-1">{student.dept}</p>
                        </div>
                     ))}
                     </div>
                  </div>
               </div>

               <button 
                  onClick={prevStudent} 
                  className="absolute left-0 top-1/2 -translate-y-1/2 w-12 h-12 rounded-full bg-white border border-slate-100 flex items-center justify-center text-slate-400 hover:bg-[#059669] hover:text-white transition-all shadow-xl z-20 group/btn opacity-0 group-hover/nav:opacity-100 -translate-x-4 group-hover/nav:translate-x-0"
               >
                  <ChevronLeft className="w-6 h-6" />
               </button>
               <button 
                  onClick={nextStudent} 
                  className="absolute right-0 top-1/2 -translate-y-1/2 w-12 h-12 rounded-full bg-white border border-slate-100 flex items-center justify-center text-slate-400 hover:bg-[#059669] hover:text-white transition-all shadow-xl z-20 group/btn opacity-0 group-hover/nav:opacity-100 translate-x-4 group-hover/nav:translate-x-0"
               >
                  <ChevronRight className="w-6 h-6" />
               </button>

               {/* Student Pagination Dots - Always visible */}
               <div className="flex justify-center gap-2 mt-12">
                  {Array.from({ length: maxStudentIndex + 1 }).map((_, i) => (
                    <button key={i} onClick={() => setStudentIndex(i)} className={`h-1.5 rounded-full transition-all duration-300 ${i === studentIndex ? "w-8 bg-[#059669]" : "w-2 bg-slate-200 hover:bg-slate-300"}`} />
                  ))}
               </div>
            </div>
         </div>
      </section>

      {/* 6. Teachers Section Slider */}
      <section id="teachers" className="py-24 bg-[#f8fafc]">
         <div className="max-w-[1400px] mx-auto px-6">
            <div className="text-center mb-16 px-4">
               <span className="inline-block px-4 py-1.5 bg-emerald-50 text-[#059669] text-[10px] font-black uppercase tracking-widest rounded-full mb-4">আমাদের শিক্ষক</span>
               <h2 className="text-2xl sm:text-3xl md:text-4xl font-black text-[#042f2c] italic">আমাদের হিতাকাঙ্খী শিক্ষক বৃন্দ</h2>
            </div>
            
            <div className="relative group/nav px-6 md:px-12">
               <div className="relative overflow-hidden">
                  <div 
                    className="transition-transform duration-700 ease-in-out"
                    style={{ transform: `translateX(calc(-${teacherIndex} * (100% + 2rem) / ${visibleTeachers}))` }}
                  >
                     <div className="flex gap-8">
                        {teachers.map((teacher, idx) => (
                           <div 
                             key={idx} 
                             className="group transition-all duration-500 text-center flex-shrink-0"
                             style={{ width: `calc((100% - ${(visibleTeachers - 1) * 2}rem) / ${visibleTeachers})` }}
                           >
                           <div className="relative mb-8 rounded-[3rem] overflow-hidden aspect-[4/5] shadow-2xl">
                              <img src={teacher.image} className="w-full h-full object-cover grayscale group-hover:grayscale-0 transition-all duration-500 scale-105 group-hover:scale-100" alt="Teacher" />
                              <div className="absolute inset-x-0 bottom-0 h-1/2 bg-gradient-to-t from-[#042f2c] to-transparent" />
                              <div className="absolute bottom-6 left-6 right-6 flex justify-center opacity-0 group-hover:opacity-100 transition-all translate-y-4 group-hover:translate-y-0">
                                 <button className="px-8 py-3 bg-[#059669] text-white font-black text-xs rounded-full shadow-2xl hover:bg-emerald-500 transition-colors">প্রোফাইল দেখুন</button>
                              </div>
                           </div>
                           <div className="pb-6">
                              <h3 className="text-2xl font-black text-[#042f2c] italic mb-1">{teacher.name}</h3>
                              <p className="text-[10px] font-black uppercase text-emerald-600 tracking-[0.2em]">{teacher.role}</p>
                           </div>
                        </div>
                     ))}
                     </div>
                  </div>
               </div>

               <button 
                  onClick={prevTeacher} 
                  className="absolute left-0 top-1/2 -translate-y-1/2 w-12 h-12 rounded-full bg-white border border-slate-100 flex items-center justify-center text-slate-400 hover:bg-[#059669] hover:text-white transition-all shadow-xl z-20 group/btn opacity-0 group-hover/nav:opacity-100 -translate-x-4 group-hover/nav:translate-x-0"
               >
                  <ChevronLeft className="w-6 h-6" />
               </button>
               <button 
                  onClick={nextTeacher} 
                  className="absolute right-0 top-1/2 -translate-y-1/2 w-12 h-12 rounded-full bg-white border border-slate-100 flex items-center justify-center text-slate-400 hover:bg-[#059669] hover:text-white transition-all shadow-xl z-20 group/btn opacity-0 group-hover/nav:opacity-100 translate-x-4 group-hover/nav:translate-x-0"
               >
                  <ChevronRight className="w-6 h-6" />
               </button>

               {/* Teacher Pagination Dots - Always visible */}
               <div className="flex justify-center gap-2 mt-12">
                  {Array.from({ length: maxTeacherIndex + 1 }).map((_, i) => (
                    <button key={i} onClick={() => setTeacherIndex(i)} className={`h-1.5 rounded-full transition-all duration-300 ${i === teacherIndex ? "w-8 bg-[#059669]" : "w-2 bg-slate-200 hover:bg-slate-300"}`} />
                  ))}
               </div>
            </div>
         </div>
      </section>

      {/* 7. Gallery Slider Sections (Video & Photo) */}
      <section id="gallery" className="py-24 bg-[#059669]">
         <div className="max-w-[1400px] mx-auto px-6">
            <div className="mb-16 px-4">
               <span className="text-white font-black text-xs tracking-widest uppercase opacity-70 mb-2 block">ভিডিও গ্যালারি</span>
               <h2 className="text-2xl sm:text-3xl md:text-4xl font-black text-white italic">আমাদের একাডেমির ভিডিও গ্যালারি ঘুরে দেখুন</h2>
            </div>

            <div className="relative group/nav">
               <div className="relative overflow-hidden px-4">
                  <div 
                    className="transition-transform duration-700 ease-in-out"
                    style={{ transform: `translateX(calc(-${videoIndex} * (100% + 2rem) / ${visibleVideos}))` }}
                  >
                     <div className="flex gap-8">
                        {videos.map((vid, i) => (
                           <div 
                             key={i} 
                             className="group cursor-pointer flex-shrink-0"
                             style={{ width: `calc((100% - ${(visibleVideos - 1) * 2}rem) / ${visibleVideos})` }}
                           >
                           <div className="bg-white/10 p-3 rounded-[2.5rem] border border-white/20 relative mb-6 overflow-hidden">
                              <div className="relative rounded-[2rem] overflow-hidden aspect-video">
                                 <img src={vid.thumb} className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700" alt="Video Thumbnail" />
                                 <div className="absolute inset-0 bg-[#042f2c]/40 flex items-center justify-center group-hover:bg-[#042f2c]/20 transition-all">
                                    <div className="w-16 h-16 bg-[#059669] text-white rounded-full flex items-center justify-center shadow-2xl group-hover:scale-115 transition-all">
                                       <PlayCircle className="w-8 h-8 fill-current" />
                                    </div>
                                 </div>
                              </div>
                           </div>
                           <h4 className="text-white font-black text-xl italic px-4 group-hover:text-emerald-300 transition-colors">{vid.title}</h4>
                        </div>
                     ))}
                     </div>
                  </div>
               </div>

               {/* Floating Side Controls - Show on hover */}
               <button 
                  onClick={prevVideo} 
                  className="absolute left-[-20px] top-1/2 -translate-y-1/2 w-12 h-12 rounded-full bg-white border border-slate-100 flex items-center justify-center text-slate-400 hover:bg-[#059669] hover:text-white transition-all shadow-xl z-20 group/btn opacity-0 group-hover/nav:opacity-100 -translate-x-4 group-hover/nav:translate-x-0"
               >
                  <ChevronLeft className="w-6 h-6" />
               </button>
               <button 
                  onClick={nextVideo} 
                  className="absolute right-[-20px] top-1/2 -translate-y-1/2 w-12 h-12 rounded-full bg-white border border-slate-100 flex items-center justify-center text-slate-400 hover:bg-[#059669] hover:text-white transition-all shadow-xl z-20 group/btn opacity-0 group-hover/nav:opacity-100 translate-x-4 group-hover/nav:translate-x-0"
               >
                  <ChevronRight className="w-6 h-6" />
               </button>

               {/* Video Pagination Dots - Always visible */}
               <div className="flex justify-center gap-2 mt-12">
                  {Array.from({ length: maxVideoIndex + 1 }).map((_, i) => (
                    <button 
                       key={i} 
                       onClick={() => setVideoIndex(i)} 
                       className={`h-1.5 rounded-full transition-all duration-300 ${i === videoIndex ? "w-8 bg-white" : "w-2 bg-white/30 hover:bg-white/50"}`} 
                    />
                  ))}
               </div>
            </div>
         </div>
      </section>

      <section id="photos" className="py-24 bg-white">
         <div className="max-w-[1200px] mx-auto px-6 text-center">
            <span className="inline-block px-4 py-1.5 bg-emerald-50 text-[#059669] text-[10px] font-black uppercase tracking-widest rounded-full mb-4">ফটো গ্যালারি</span>
            <h2 className="text-2xl sm:text-3xl md:text-4xl font-black text-[#042f2c] italic mb-16">আমাদের একাডেমির ছবি গ্যালারি ঘুরে দেখুন</h2>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
               {[1, 2, 3, 4, 5, 6, 7, 8].map((i) => (
                  <div key={i} className="relative rounded-3xl overflow-hidden group aspect-square shadow-md">
                     <img src={`https://picsum.photos/seed/${i + 22}/400`} className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700" alt="Gallery" />
                     <div className="absolute inset-0 bg-[#059669]/20 opacity-0 group-hover:opacity-100 transition-opacity" />
                  </div>
               ))}
            </div>
         </div>
      </section>
    </div>
  );
};

export default MadrasaPortal;
