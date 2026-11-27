import { useState, useMemo } from "react";
import {
  Library,
  Search,
  Plus,
  BookOpen,
  User,
  Calendar,
  ArrowRightLeft,
  SquarePen,
  Trash2,
  X,
  RotateCcw,
} from "lucide-react";
import { toast } from "react-hot-toast";
import InputField from "../../components/InputField";
import SelectInputField from "../../components/SelectInputField";

const INITIAL_BOOKS = [
  {
    id: 1,
    title: "Kitab At-Tawheed",
    author: "Shaykh Muhammad ibn Abd-al-Wahhab",
    category: "Aqidah",
    isbn: "978-0123456789",
    status: "available",
    location: "Shelf A-1",
  },
  {
    id: 2,
    title: "Principles of Jurisprudence",
    author: "Dr. Ahmed Mansour",
    category: "Fiqh",
    isbn: "978-9876543210",
    status: "borrowed",
    dueDate: "2026-01-15",
    borrower: "Abdullah Ali",
    location: "Shelf B-2",
  },
  {
    id: 3,
    title: "History of Islam",
    author: "Prof. Khalid Yahya",
    category: "History",
    isbn: "978-5544332211",
    status: "available",
    location: "Shelf C-4",
  },
  {
    id: 4,
    title: "Arabic Grammar Vol 1",
    author: "Maulana Zafar",
    category: "Language",
    isbn: "978-1122334455",
    status: "lost",
    location: "N/A",
  },
];

const CATEGORY_OPTIONS = [
  { value: "General", label: "General" },
  { value: "Aqidah", label: "Aqidah" },
  { value: "Hadith", label: "Hadith" },
  { value: "Fiqh", label: "Fiqh" },
  { value: "History", label: "History" },
  { value: "Language", label: "Language" },
  { value: "Arabic", label: "Arabic" },
];

const STATUS_OPTIONS = [
  { value: "available", label: "Available" },
  { value: "borrowed", label: "Borrowed" },
  { value: "reserved", label: "Reserved" },
  { value: "lost", label: "Lost" },
];

const STATUS_BADGE = {
  available: "bg-emerald-50 text-emerald-700 border-emerald-200",
  borrowed: "bg-amber-50 text-amber-700 border-amber-200",
  reserved: "bg-blue-50 text-blue-700 border-blue-200",
  lost: "bg-rose-50 text-rose-700 border-rose-200",
};

const STATUS_DOT = {
  available: "bg-emerald-500",
  borrowed: "bg-amber-500",
  reserved: "bg-blue-500",
  lost: "bg-rose-500",
};

const EMPTY_FORM = {
  title: "",
  author: "",
  category: "General",
  isbn: "",
  location: "",
  status: "available",
};

const LibraryManager = () => {
  const [books, setBooks] = useState(INITIAL_BOOKS);
  const [searchTerm, setSearchTerm] = useState("");
  const [categoryFilter, setCategoryFilter] = useState("all");
  const [statusFilter, setStatusFilter] = useState("all");

  // Add / Edit Modal
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [modalType, setModalType] = useState("add");
  const [selectedBook, setSelectedBook] = useState(null);
  const [formData, setFormData] = useState(EMPTY_FORM);

  // Issue / Return Modal
  const [isIssueModalOpen, setIsIssueModalOpen] = useState(false);
  const [issueBookId, setIssueBookId] = useState("");
  const [borrowerName, setBorrowerName] = useState("");
  const [dueDate, setDueDate] = useState("");

  // Delete Modal
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [bookToDelete, setBookToDelete] = useState(null);

  const categories = useMemo(() => {
    const set = new Set([
      ...CATEGORY_OPTIONS.map((c) => c.value),
      ...books.map((b) => b.category).filter(Boolean),
    ]);
    return Array.from(set);
  }, [books]);

  const filteredBooks = useMemo(() => {
    const query = searchTerm.trim().toLowerCase();
    return books.filter((book) => {
      const matchesQuery =
        !query ||
        book.title.toLowerCase().includes(query) ||
        book.author.toLowerCase().includes(query) ||
        (book.isbn || "").toLowerCase().includes(query) ||
        (book.borrower || "").toLowerCase().includes(query);
      const matchesCategory =
        categoryFilter === "all" || book.category === categoryFilter;
      const matchesStatus =
        statusFilter === "all" || book.status === statusFilter;
      return matchesQuery && matchesCategory && matchesStatus;
    });
  }, [books, searchTerm, categoryFilter, statusFilter]);

  const openAddModal = () => {
    setFormData(EMPTY_FORM);
    setSelectedBook(null);
    setModalType("add");
    setIsModalOpen(true);
  };

  const openEditModal = (book) => {
    setSelectedBook(book);
    setFormData({
      title: book.title || "",
      author: book.author || "",
      category: book.category || "General",
      isbn: book.isbn || "",
      location: book.location || "",
      status: book.status || "available",
    });
    setModalType("edit");
    setIsModalOpen(true);
  };

  const handleSaveBook = () => {
    if (!formData.title.trim()) {
      return toast.error("Please enter book title");
    }
    if (!formData.author.trim()) {
      return toast.error("Please enter author name");
    }

    if (modalType === "add") {
      const nextId =
        books.length > 0 ? Math.max(...books.map((b) => b.id)) + 1 : 1;
      const newBook = {
        id: nextId,
        title: formData.title.trim(),
        author: formData.author.trim(),
        category: formData.category || "General",
        isbn: formData.isbn.trim() || "N/A",
        location: formData.location.trim() || "N/A",
        status: formData.status || "available",
      };
      setBooks((prev) => [newBook, ...prev]);
      toast.success("Book added successfully");
    } else if (selectedBook) {
      setBooks((prev) =>
        prev.map((b) =>
          b.id === selectedBook.id
            ? {
                ...b,
                title: formData.title.trim(),
                author: formData.author.trim(),
                category: formData.category || "General",
                isbn: formData.isbn.trim() || "N/A",
                location: formData.location.trim() || "N/A",
                status: formData.status || "available",
                ...(formData.status !== "borrowed"
                  ? { borrower: undefined, dueDate: undefined }
                  : {}),
              }
            : b
        )
      );
      toast.success("Book updated successfully");
    }
    setIsModalOpen(false);
  };

  const openIssueReturnModal = (book = null) => {
    if (book) {
      setIssueBookId(String(book.id));
      setBorrowerName(book.borrower || "");
      setDueDate(book.dueDate || "");
    } else {
      const firstActionable =
        books.find((b) => b.status === "available" || b.status === "borrowed") ||
        books[0];
      setIssueBookId(firstActionable ? String(firstActionable.id) : "");
      setBorrowerName(firstActionable?.borrower || "");
      setDueDate(firstActionable?.dueDate || "");
    }
    setIsIssueModalOpen(true);
  };

  const selectedIssueBook = useMemo(
    () => books.find((b) => String(b.id) === String(issueBookId)) || null,
    [books, issueBookId]
  );

  const handleIssueReturnSubmit = () => {
    if (!selectedIssueBook) {
      return toast.error("Please select a book");
    }

    if (selectedIssueBook.status === "borrowed") {
      setBooks((prev) =>
        prev.map((b) =>
          b.id === selectedIssueBook.id
            ? { ...b, status: "available", borrower: undefined, dueDate: undefined }
            : b
        )
      );
      toast.success(`"${selectedIssueBook.title}" returned successfully`);
      setIsIssueModalOpen(false);
      return;
    }

    if (!borrowerName.trim()) {
      return toast.error("Please enter borrower name");
    }

    setBooks((prev) =>
      prev.map((b) =>
        b.id === selectedIssueBook.id
          ? {
              ...b,
              status: "borrowed",
              borrower: borrowerName.trim(),
              dueDate: dueDate || undefined,
            }
          : b
      )
    );
    toast.success(`"${selectedIssueBook.title}" issued to ${borrowerName.trim()}`);
    setIsIssueModalOpen(false);
  };

  const openDeleteModal = (book) => {
    setBookToDelete(book);
    setIsDeleteModalOpen(true);
  };

  const handleDelete = () => {
    if (!bookToDelete) return;
    setBooks((prev) => prev.filter((b) => b.id !== bookToDelete.id));
    toast.success("Book deleted successfully");
    setIsDeleteModalOpen(false);
    setBookToDelete(null);
  };

  return (
    <div className="animate-in fade-in duration-500">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-5 w-full">
        <div>
          <h1 className="text-[20px] font-black text-slate-800 flex items-center gap-3">
            <Library className="w-8 h-8 text-[#1C7D5A]" />
            Library Catalog
          </h1>
          <p className="text-[14px] text-slate-500 font-bold mt-1">
            Manage library books, availability, and issue/return records
          </p>
        </div>

        <div className="flex items-center gap-3 w-full md:w-auto">
          <button
            type="button"
            onClick={() => openIssueReturnModal(null)}
            className="flex-1 md:flex-none px-4 py-2 bg-white border border-slate-200 text-slate-700 rounded-[8px] cursor-pointer flex items-center justify-center gap-2 font-bold hover:bg-slate-50 transition-all shadow-sm"
          >
            <ArrowRightLeft className="w-4 h-4 text-[#1C7D5A]" />
            Issue/Return
          </button>
          <button
            type="button"
            onClick={openAddModal}
            className="flex-1 md:flex-none px-4 py-2 bg-[#1C7D5A] text-white rounded-[8px] cursor-pointer flex items-center justify-center gap-2 font-bold transition-all hover:bg-[#123628] active:scale-95 shadow-sm"
          >
            <Plus className="w-4 h-4" />
            Add New Book
          </button>
        </div>
      </div>

      {/* Library Table Section */}
      <div className="overflow-hidden relative bg-white rounded-[8px] border border-gray-200">
        <div className="p-4 flex flex-col lg:flex-row lg:items-center justify-between gap-4 border-b border-b-gray-200">
          <div className="flex items-center gap-2.5">
            <h2 className="text-[18px] font-semibold text-slate-800">Book List</h2>
            <span className="px-2.5 py-0.5 rounded-full bg-[#1C7D5A18] text-[#1C7D5A] text-xs font-bold">
              {filteredBooks.length}
            </span>
          </div>

          <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
              <input
                type="text"
                placeholder="Search by title, author, or ISBN..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full sm:w-64 pl-10 pr-4 py-2 bg-white border border-slate-200 text-slate-900 rounded-[8px] text-sm outline-none focus:ring-1 focus:ring-[#1C7D5A] focus:border-[#1C7D5A] transition-all"
              />
            </div>

            <select
              value={categoryFilter}
              onChange={(e) => setCategoryFilter(e.target.value)}
              className="px-3 py-2 bg-white border border-slate-200 rounded-[8px] text-sm font-medium text-slate-700 outline-none focus:ring-1 focus:ring-[#1C7D5A] focus:border-[#1C7D5A] cursor-pointer"
            >
              <option value="all">All Categories</option>
              {categories.map((cat) => (
                <option key={cat} value={cat}>
                  {cat}
                </option>
              ))}
            </select>

            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
              className="px-3 py-2 bg-white border border-slate-200 rounded-[8px] text-sm font-medium text-slate-700 outline-none focus:ring-1 focus:ring-[#1C7D5A] focus:border-[#1C7D5A] cursor-pointer"
            >
              <option value="all">All Status</option>
              {STATUS_OPTIONS.map((opt) => (
                <option key={opt.value} value={opt.value}>
                  {opt.label}
                </option>
              ))}
            </select>
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full border-collapse">
            <thead className="bg-[#1C7D5A18]">
              <tr>
                <th className="px-5 py-3.5 text-left text-[12px] font-black uppercase tracking-wider text-slate-700 w-14">
                  SL
                </th>
                <th className="px-5 py-3.5 text-left text-[12px] font-black uppercase tracking-wider text-slate-700">
                  Book Title
                </th>
                <th className="px-5 py-3.5 text-left text-[12px] font-black uppercase tracking-wider text-slate-700">
                  Author
                </th>
                <th className="px-5 py-3.5 text-center text-[12px] font-black uppercase tracking-wider text-slate-700">
                  Category
                </th>
                <th className="px-5 py-3.5 text-left text-[12px] font-black uppercase tracking-wider text-slate-700">
                  ISBN
                </th>
                <th className="px-5 py-3.5 text-left text-[12px] font-black uppercase tracking-wider text-slate-700">
                  Location / Borrower
                </th>
                <th className="px-5 py-3.5 text-center text-[12px] font-black uppercase tracking-wider text-slate-700">
                  Status
                </th>
                <th className="px-5 py-3.5 text-center text-[12px] font-black uppercase tracking-wider text-slate-700">
                  Action
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {filteredBooks.length > 0 ? (
                filteredBooks.map((book, index) => (
                  <tr
                    key={book.id}
                    className="group hover:bg-[#1C7D5A]/5 transition-all duration-200"
                  >
                    <td className="px-5 py-3.5 text-sm font-bold text-slate-500">
                      {index + 1}
                    </td>
                    <td className="px-5 py-3.5">
                      <div className="flex items-center gap-3">
                        <div className="w-9 h-9 rounded-lg bg-[#1C7D5A]/10 flex items-center justify-center shrink-0">
                          <BookOpen className="w-4 h-4 text-[#1C7D5A]" />
                        </div>
                        <span
                          onClick={() => openEditModal(book)}
                          className="text-sm font-bold text-slate-800 cursor-pointer hover:text-[#1C7D5A] transition-colors"
                        >
                          {book.title}
                        </span>
                      </div>
                    </td>
                    <td className="px-5 py-3.5 text-sm font-medium text-slate-600">
                      {book.author}
                    </td>
                    <td className="px-5 py-3.5 text-center">
                      <span className="px-3 py-1 rounded-lg bg-slate-100 text-slate-700 text-xs font-bold">
                        {book.category}
                      </span>
                    </td>
                    <td className="px-5 py-3.5 text-xs font-mono font-semibold text-slate-600 whitespace-nowrap">
                      {book.isbn}
                    </td>
                    <td className="px-5 py-3.5">
                      {book.status === "borrowed" ? (
                        <div className="text-xs">
                          <div className="font-bold text-amber-700 flex items-center gap-1.5">
                            <User className="w-3.5 h-3.5" />
                            {book.borrower || "Unknown"}
                          </div>
                          {book.dueDate && (
                            <div className="text-slate-400 flex items-center gap-1.5 mt-0.5">
                              <Calendar className="w-3 h-3" />
                              Due: {book.dueDate}
                            </div>
                          )}
                        </div>
                      ) : (
                        <span className="text-sm font-semibold text-slate-600">
                          {book.location || "N/A"}
                        </span>
                      )}
                    </td>
                    <td className="px-5 py-3.5 text-center">
                      <span
                        className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-widest border ${
                          STATUS_BADGE[book.status] ||
                          "bg-slate-100 text-slate-600 border-slate-200"
                        }`}
                      >
                        <span
                          className={`w-1.5 h-1.5 rounded-full ${
                            STATUS_DOT[book.status] || "bg-slate-400"
                          }`}
                        />
                        {book.status}
                      </span>
                    </td>
                    <td className="px-5 py-3.5">
                      <div className="flex items-center gap-2 justify-center">
                        {(book.status === "available" ||
                          book.status === "borrowed" ||
                          book.status === "reserved") && (
                          <button
                            type="button"
                            title={
                              book.status === "borrowed"
                                ? "Return Book"
                                : "Issue Book"
                            }
                            onClick={() => openIssueReturnModal(book)}
                            className={`cursor-pointer px-2.5 py-1 rounded-lg text-xs font-bold flex items-center gap-1 transition-colors ${
                              book.status === "borrowed"
                                ? "bg-amber-50 text-amber-700 hover:bg-amber-100"
                                : "bg-[#1C7D5A]/10 text-[#1C7D5A] hover:bg-[#1C7D5A]/20"
                            }`}
                          >
                            {book.status === "borrowed" ? (
                              <>
                                <RotateCcw className="w-3.5 h-3.5" />
                                Return
                              </>
                            ) : (
                              <>
                                <ArrowRightLeft className="w-3.5 h-3.5" />
                                Issue
                              </>
                            )}
                          </button>
                        )}
                        <button
                          type="button"
                          title="Edit Book"
                          onClick={() => openEditModal(book)}
                          className="cursor-pointer p-1.5 hover:bg-emerald-50 rounded-lg transition-colors"
                        >
                          <SquarePen className="w-4 h-4 text-[#1C7D5A]" />
                        </button>
                        <button
                          type="button"
                          title="Delete Book"
                          onClick={() => openDeleteModal(book)}
                          className="cursor-pointer p-1.5 hover:bg-red-50 rounded-lg transition-colors"
                        >
                          <Trash2 className="w-4 h-4 text-red-500" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td
                    colSpan="8"
                    className="px-6 py-12 text-center text-slate-400 font-bold"
                  >
                    No books found matching your criteria.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Add / Edit Book Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 bg-slate-900/70 backdrop-blur-md z-[100] flex items-center justify-center p-6 sm:p-10">
          <div className="bg-white rounded-[8px] w-full max-w-lg shadow-[0_32px_64px_-16px_rgba(0,0,0,0.2)] animate-in fade-in zoom-in duration-300 overflow-hidden flex flex-col max-h-[90vh]">
            <div className="p-5 border-b-2 border-slate-50 flex items-center justify-between bg-gradient-to-r from-white to-slate-50/50">
              <h2 className="text-[20px] font-black text-slate-800 tracking-tight">
                {modalType === "add" ? "Add New Book" : "Update Book"}
              </h2>
              <button
                type="button"
                onClick={() => setIsModalOpen(false)}
                className="p-[2px] bg-slate-100 hover:bg-red-500 text-slate-500 hover:text-white rounded-2xl transition-all active:scale-90 cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="p-5 flex flex-col gap-4 overflow-y-auto">
              <InputField
                title="Book Title"
                required
                placeholder="e.g. Sahih Al-Bukhari"
                value={formData.title}
                setValue={(val) => setFormData({ ...formData, title: val })}
              />

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <InputField
                  title="Author Name"
                  required
                  placeholder="e.g. Imam Bukhari"
                  value={formData.author}
                  setValue={(val) => setFormData({ ...formData, author: val })}
                />
                <SelectInputField
                  title="Category"
                  options={CATEGORY_OPTIONS}
                  value={formData.category}
                  setValue={(val) =>
                    setFormData({ ...formData, category: val || "General" })
                  }
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <InputField
                  title="ISBN Number"
                  placeholder="e.g. 978-0123456789"
                  value={formData.isbn}
                  setValue={(val) => setFormData({ ...formData, isbn: val })}
                />
                <InputField
                  title="Storage Location"
                  placeholder="e.g. Shelf B-2"
                  value={formData.location}
                  setValue={(val) =>
                    setFormData({ ...formData, location: val })
                  }
                />
              </div>

              <SelectInputField
                title="Status"
                options={STATUS_OPTIONS}
                value={formData.status}
                setValue={(val) =>
                  setFormData({ ...formData, status: val || "available" })
                }
              />

              <div className="flex items-center justify-end gap-3 mt-4 pt-4 border-t border-slate-100">
                <button
                  type="button"
                  onClick={() => setIsModalOpen(false)}
                  className="px-6 py-2.5 bg-slate-100 text-slate-600 rounded-[8px] font-bold hover:bg-slate-200 transition-all cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="button"
                  onClick={handleSaveBook}
                  className="px-6 py-2.5 bg-[#1C7D5A] text-white rounded-[8px] font-bold hover:bg-[#123628] shadow-lg shadow-slate-200 transition-all active:scale-95 cursor-pointer"
                >
                  {modalType === "add" ? "Save Book" : "Update Book"}
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Issue / Return Modal */}
      {isIssueModalOpen && (
        <div className="fixed inset-0 bg-slate-900/70 backdrop-blur-md z-[100] flex items-center justify-center p-6 sm:p-10">
          <div className="bg-white rounded-[8px] w-full max-w-md shadow-[0_32px_64px_-16px_rgba(0,0,0,0.2)] animate-in fade-in zoom-in duration-300 overflow-hidden">
            <div className="p-5 border-b-2 border-slate-50 flex items-center justify-between">
              <h2 className="text-[20px] font-black text-slate-800 tracking-tight">
                {selectedIssueBook?.status === "borrowed"
                  ? "Return Book"
                  : "Issue Book"}
              </h2>
              <button
                type="button"
                onClick={() => setIsIssueModalOpen(false)}
                className="p-[2px] bg-slate-100 hover:bg-red-500 text-slate-500 hover:text-white rounded-2xl transition-all active:scale-90 cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="p-5 flex flex-col gap-4">
              <SelectInputField
                title="Select Book"
                required
                options={books.map((b) => ({
                  value: String(b.id),
                  label: `${b.title} (${b.status})`,
                }))}
                value={issueBookId}
                setValue={(val) => {
                  setIssueBookId(val);
                  const found = books.find((b) => String(b.id) === String(val));
                  setBorrowerName(found?.borrower || "");
                  setDueDate(found?.dueDate || "");
                }}
              />

              {selectedIssueBook?.status === "borrowed" ? (
                <div className="p-4 rounded-[8px] bg-amber-50 border border-amber-200 text-sm space-y-1">
                  <p className="font-bold text-amber-800">
                    Currently borrowed by:{" "}
                    {selectedIssueBook.borrower || "Unknown"}
                  </p>
                  {selectedIssueBook.dueDate && (
                    <p className="text-xs text-amber-700">
                      Due Date: {selectedIssueBook.dueDate}
                    </p>
                  )}
                </div>
              ) : (
                <>
                  <InputField
                    title="Borrower Name"
                    required
                    placeholder="Enter student or teacher name"
                    value={borrowerName}
                    setValue={setBorrowerName}
                  />
                  <InputField
                    title="Due Date"
                    type="date"
                    value={dueDate}
                    setValue={setDueDate}
                  />
                </>
              )}

              <div className="flex items-center justify-end gap-3 mt-4 pt-4 border-t border-slate-100">
                <button
                  type="button"
                  onClick={() => setIsIssueModalOpen(false)}
                  className="px-6 py-2.5 bg-slate-100 text-slate-600 rounded-[8px] font-bold hover:bg-slate-200 transition-all cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="button"
                  onClick={handleIssueReturnSubmit}
                  className="px-6 py-2.5 bg-[#1C7D5A] text-white rounded-[8px] font-bold hover:bg-[#123628] shadow-lg shadow-slate-200 transition-all active:scale-95 cursor-pointer"
                >
                  {selectedIssueBook?.status === "borrowed"
                    ? "Confirm Return"
                    : "Issue Book"}
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Delete Confirmation Modal */}
      {isDeleteModalOpen && (
        <div className="fixed inset-0 bg-slate-900/70 backdrop-blur-md z-[100] flex items-center justify-center p-6">
          <div className="bg-white rounded-[8px] w-full max-w-md shadow-2xl animate-in fade-in zoom-in duration-300 overflow-hidden">
            <div className="p-8 text-center space-y-6">
              <div className="w-16 h-16 bg-red-50 text-red-500 rounded-full flex items-center justify-center mx-auto">
                <Trash2 className="w-8 h-8" />
              </div>
              <div className="space-y-2">
                <h2 className="text-xl font-bold text-slate-800">
                  Confirm Deletion
                </h2>
                <p className="text-slate-500">
                  Are you sure you want to delete{" "}
                  <span className="font-bold text-slate-700">
                    {bookToDelete?.title}
                  </span>
                  ?
                </p>
                <p className="text-xs text-red-400">
                  This action cannot be undone.
                </p>
              </div>
              <div className="flex gap-3">
                <button
                  type="button"
                  onClick={() => setIsDeleteModalOpen(false)}
                  className="flex-1 py-2.5 bg-slate-100 text-slate-600 rounded-[8px] font-bold hover:bg-slate-200 cursor-pointer transition-all"
                >
                  Cancel
                </button>
                <button
                  type="button"
                  onClick={handleDelete}
                  className="flex-1 py-2.5 bg-red-500 text-white rounded-[8px] font-bold hover:bg-red-600 shadow-lg shadow-red-100 cursor-pointer transition-all active:scale-95"
                >
                  Delete Now
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default LibraryManager;
