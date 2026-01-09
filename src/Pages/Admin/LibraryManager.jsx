import { useState } from "react";
import { 
  Library, 
  Search, 
  Filter, 
  Plus, 
  BookOpen, 
  User, 
  Calendar, 
  MoreVertical, 
  BookMarked,
  CheckCircle2,
  XCircle,
  Hash,
  ArrowRightLeft
} from "lucide-react";

const LibraryManager = () => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [books] = useState([
    { id: 1, title: "Kitab At-Tawheed", author: "Shaykh Muhammad ibn Abd-al-Wahhab", category: "Aqidah", isbn: "978-0123456789", status: "available", location: "Shelf A-1" },
    { id: 2, title: "Principles of Jurisprudence", author: "Dr. Ahmed Mansour", category: "Fiqh", isbn: "978-9876543210", status: "borrowed", dueDate: "2026-01-15", borrower: "Abdullah Ali" },
    { id: 3, title: "History of Islam", author: "Prof. Khalid Yahya", category: "History", isbn: "978-5544332211", status: "available", location: "Shelf C-4" },
    { id: 4, title: "Arabic Grammar Vol 1", author: "Maulana Zafar", category: "Language", isbn: "978-1122334455", status: "lost", location: "N/A" },
  ]);

  return (
    <div className="min-h-screen bg-slate-50/50 p-4 md:p-8 animate-in fade-in duration-500">
      <div className="max-w-[1600px] mx-auto space-y-8">
        
        {/* Header Section */}
        <div className="bg-white rounded-[2.5rem] border border-slate-200 p-8 shadow-sm flex flex-col lg:flex-row justify-between items-center gap-6">
          <div className="flex items-center gap-6">
            <div className="w-16 h-16 bg-emerald-50 rounded-2xl flex items-center justify-center border border-emerald-100 shadow-inner">
              <Library className="w-8 h-8 text-emerald-600" />
            </div>
            <div>
              <h1 className="text-2xl md:text-3xl font-black text-slate-800 tracking-tight">Library Catalog</h1>
              <p className="text-slate-500 font-bold mt-1">Manage institutional books, periodicals, and borrowing history</p>
            </div>
          </div>

          <div className="flex gap-4 w-full lg:w-auto">
            <button className="flex-1 lg:flex-none px-8 py-4 bg-slate-100 text-slate-600 rounded-2xl font-black hover:bg-slate-200 transition-all flex items-center justify-center gap-3">
              <ArrowRightLeft className="w-5 h-5" />
              Issue/Return
            </button>
            <button 
              onClick={() => setIsModalOpen(true)}
              className="flex-[2] lg:flex-none px-8 py-4 bg-emerald-600 text-white rounded-2xl font-black shadow-xl shadow-emerald-100 hover:bg-emerald-700 hover:scale-[1.02] active:scale-95 transition-all flex items-center justify-center gap-3"
            >
              <Plus className="w-5 h-5" />
              Add New Book
            </button>
          </div>
        </div>

        {/* Search and Filters */}
        <div className="flex flex-col md:flex-row gap-4">
          <div className="flex-1 relative">
            <Search className="absolute left-6 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400" />
            <input 
              type="text"
              placeholder="Search books by title, author, or ISBN..."
              className="w-full bg-white border border-slate-200 rounded-2xl pl-14 pr-6 py-4 text-sm font-bold focus:border-emerald-500 outline-none shadow-sm transition-all"
            />
          </div>
          <div className="flex gap-4">
            <button className="px-6 py-4 bg-white border border-slate-200 rounded-2xl flex items-center gap-3 font-bold text-slate-600 hover:bg-slate-50 transition-all shadow-sm">
              <Filter className="w-4 h-4" />
              Category
            </button>
            <button className="px-6 py-4 bg-white border border-slate-200 rounded-2xl flex items-center gap-3 font-bold text-slate-600 hover:bg-slate-50 transition-all shadow-sm">
              <BookMarked className="w-4 h-4" />
              Reserved
            </button>
          </div>
        </div>

        {/* Books Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8">
          {books.map((book) => (
            <div key={book.id} className="group bg-white rounded-[2.5rem] border border-slate-200 shadow-sm hover:shadow-2xl hover:border-emerald-200 transition-all duration-500 flex flex-col overflow-hidden">
               {/* Cover Area */}
               <div className="h-40 bg-slate-100 flex items-center justify-center relative group-hover:bg-slate-50 transition-colors">
                  <BookOpen className="w-12 h-12 text-slate-200 group-hover:text-emerald-100 transition-colors" />
                  <div className={`absolute top-4 right-4 px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-widest border border-white shadow-sm ${
                    book.status === 'available' ? 'bg-emerald-500 text-white' : 
                    book.status === 'borrowed' ? 'bg-amber-500 text-white' : 
                    'bg-slate-400 text-white'
                  }`}>
                    {book.status}
                  </div>
               </div>

               <div className="p-8 flex-1 flex flex-col">
                  <div className="flex justify-between items-start mb-4">
                     <span className="px-3 py-1 bg-slate-50 border border-slate-100 rounded-lg text-[10px] font-black text-slate-400 uppercase tracking-widest leading-none">
                       {book.category}
                     </span>
                     <button className="text-slate-300 hover:text-slate-600 transition-all">
                       <MoreVertical className="w-5 h-5" />
                     </button>
                  </div>

                  <h3 className="text-lg font-black text-slate-800 leading-tight group-hover:text-emerald-600 transition-colors tracking-tight">{book.title}</h3>
                  <p className="text-xs font-bold text-slate-400 mt-1">by {book.author}</p>

                  <div className="mt-8 space-y-3 pt-6 border-t border-slate-50 border-dashed">
                     <div className="flex items-center justify-between text-[11px] font-bold">
                        <span className="text-slate-400 flex items-center gap-2"><Hash className="w-3.5 h-3.5" /> ISBN</span>
                        <span className="text-slate-600 font-black tracking-tight">{book.isbn}</span>
                     </div>
                     {book.status === 'borrowed' ? (
                       <div className="flex items-center justify-between text-[11px] font-bold text-amber-600">
                          <span className="flex items-center gap-2"><User className="w-3.5 h-3.5" /> Borrower</span>
                          <span className="font-black">{book.borrower}</span>
                       </div>
                     ) : (
                       <div className="flex items-center justify-between text-[11px] font-bold">
                          <span className="text-slate-400 flex items-center gap-2"><Library className="w-3.5 h-3.5" /> Location</span>
                          <span className="text-slate-600 font-black">{book.location}</span>
                       </div>
                     )}
                  </div>

                  <div className="mt-auto pt-8 flex gap-3">
                     <button className={`flex-1 py-3 text-[10px] font-black uppercase tracking-widest rounded-2xl transition-all shadow-lg flex items-center justify-center gap-2 ${
                        book.status === 'available' 
                        ? 'bg-emerald-600 text-white shadow-emerald-100 hover:bg-emerald-700' 
                        : 'bg-slate-100 text-slate-400 cursor-not-allowed'
                     }`}>
                        {book.status === 'available' ? 'Issue Book' : 'Manage'}
                     </button>
                  </div>
               </div>
            </div>
          ))}

          {/* New Book Card */}
          <button 
            onClick={() => setIsModalOpen(true)}
            className="group bg-emerald-50/20 rounded-[2.5rem] border-4 border-dashed border-emerald-100 flex flex-col items-center justify-center p-12 hover:border-emerald-300 hover:bg-emerald-50/50 transition-all min-h-[400px]"
          >
            <div className="w-16 h-16 bg-white rounded-2xl flex items-center justify-center shadow-lg group-hover:scale-110 group-hover:bg-emerald-600 transition-all mb-4">
              <Plus className="w-8 h-8 text-emerald-300 group-hover:text-white" />
            </div>
            <p className="text-lg font-black text-emerald-400 group-hover:text-emerald-600 uppercase tracking-tight">Add New Title</p>
          </button>
        </div>

      </div>

      {/* Creation Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 bg-slate-900/40 backdrop-blur-md z-[100] flex items-center justify-center p-4">
          <div className="bg-white rounded-[3rem] w-full max-w-2xl shadow-2xl animate-in zoom-in duration-300 overflow-hidden">
             <div className="p-10 border-b border-slate-50 flex items-center justify-between">
                <div className="flex items-center gap-4">
                   <div className="w-12 h-12 bg-emerald-50 rounded-2xl flex items-center justify-center border border-emerald-100">
                      <Library className="w-6 h-6 text-emerald-600" />
                   </div>
                   <h2 className="text-3xl font-black text-slate-800 tracking-tight">Add New Book</h2>
                </div>
                <button onClick={() => setIsModalOpen(false)} className="p-3 hover:bg-slate-100 rounded-2xl transition-all">
                  <Plus className="w-8 h-8 text-slate-300 rotate-45" />
                </button>
             </div>
             <div className="p-10 space-y-6">
                <div className="space-y-3">
                   <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Book Title</label>
                   <input className="w-full bg-slate-50 border border-slate-100 rounded-2xl px-6 py-4 text-sm font-bold focus:border-emerald-500 transition-all outline-none" placeholder="e.g. Sahih Al-Bukhari" />
                </div>
                <div className="grid grid-cols-2 gap-6">
                   <div className="space-y-3">
                      <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Author Name</label>
                      <input className="w-full bg-slate-50 border border-slate-100 rounded-2xl px-6 py-4 text-sm font-bold focus:border-emerald-500 outline-none transition-all" />
                   </div>
                   <div className="space-y-3">
                      <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Category</label>
                      <select className="w-full bg-slate-50 border border-slate-100 rounded-2xl px-6 py-4 text-sm font-bold focus:border-emerald-500 outline-none appearance-none cursor-pointer">
                        <option>General</option>
                        <option>Hadith</option>
                        <option>Fiqh</option>
                        <option>Arabic</option>
                      </select>
                   </div>
                </div>
                <div className="grid grid-cols-2 gap-6">
                   <div className="space-y-3">
                      <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest">ISBN Number</label>
                      <input className="w-full bg-slate-50 border border-slate-100 rounded-2xl px-6 py-4 text-sm font-bold focus:border-emerald-500 outline-none transition-all" />
                   </div>
                   <div className="space-y-3">
                      <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Storage Location</label>
                      <input className="w-full bg-slate-50 border border-slate-100 rounded-2xl px-6 py-4 text-sm font-bold focus:border-emerald-500 outline-none transition-all" placeholder="e.g. Shelf B-2" />
                   </div>
                </div>

                <div className="pt-6 flex gap-6">
                   <button onClick={() => setIsModalOpen(false)} className="flex-1 py-4 text-slate-400 font-black hover:text-slate-600 transition-all">Discard</button>
                   <button onClick={() => setIsModalOpen(false)} className="flex-1 py-4 bg-emerald-600 text-white font-black rounded-2xl shadow-xl shadow-emerald-100 hover:bg-emerald-700 transition-all">Save Title</button>
                </div>
             </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default LibraryManager;
