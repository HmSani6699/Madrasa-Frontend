import { useState, useEffect } from "react";
import InputField from "../../components/InputField";
import SelectInputField from "../../components/SelectInputField";
import TextareaField from "../../components/TextareaField";
import { Plus, Trash2, Upload, User, Image as ImageIcon, CreditCard, Loader2, CheckCircle2 } from "lucide-react";
import { usePortalSettings } from "../../context/PortalSettingsContext";
import axiosInstance from "../../api/axiosInstance";
import { toast } from "react-hot-toast";
import { useParams } from "react-router";

const OnlineAdmissionForm = () => {
    const { settings, loading: settingsLoading } = usePortalSettings();
    const [step, setStep] = useState(1);
    const [submitting, setSubmitting] = useState(false);
    const [submitted, setSubmitted] = useState(false);
    const [academicOptions, setAcademicOptions] = useState([]);
    const { slug } = useParams()

    useEffect(() => {
        const fetchAcademicData = async () => {
            try {
                const response = await axiosInstance.get(`/portal/v1/${slug}/academic-data`);
                if (response.data.success) {
                    const formatted = response.data.data.map(c => ({
                        value: c.id,
                        label: c.name,
                        sections: c.sections.map(s => ({ value: s.id, label: s.name }))
                    }));
                    setAcademicOptions(formatted);
                }
            } catch (error) {
                console.error("Fetch Academic Data Error:", error);
                toast.error("শিক্ষা সংক্রান্ত তথ্য লোড করতে সমস্যা হয়েছে");
            }
        };
        if (slug) fetchAcademicData();
    }, [slug]);
    
    const [guardianData, setGuardianData] = useState({
        fatherName: "",
        motherName: "",
        fatherOccupation: "",
        motherOccupation: "",
        fatherContact: "",
        motherContact: "",
        email: "",
        address: "",
        fatherNID: null, // Base64
        motherNID: null, // Base64
        guardianNID: null, // Base64
    });

    const [students, setStudents] = useState([
        {
            id: Date.now(),
            fullName: "",
            gender: "male",
            dob: "",
            bloodGroup: "",
            assignedClass: "",
            section: "",
            photo: null, // Base64
        },
    ]);

    const handleAddStudent = () => {
        setStudents([
            ...students,
            {
                id: Date.now(),
                fullName: "",
                gender: "male",
                dob: "",
                bloodGroup: "",
                assignedClass: "",
                section: "",
                photo: null,
            },
        ]);
    };

    const handleRemoveStudent = (id) => {
        if (students.length > 1) {
            setStudents(students.filter((s) => s.id !== id));
        }
    };

    const updateStudentField = (index, field, value) => {
        const updatedStudents = [...students];
        updatedStudents[index][field] = value;
        
        // Dynamic behavior: Clear section when class changes
        if (field === "assignedClass") {
            updatedStudents[index]["section"] = "";
        }
        
        setStudents(updatedStudents);
    };

    const convertToBase64 = (file) => {
        return new Promise((resolve, reject) => {
            const reader = new FileReader();
            reader.readAsDataURL(file);
            reader.onload = () => resolve(reader.result);
            reader.onerror = (error) => reject(error);
        });
    };

    const handleFileChange = async (e, field, type, index = null) => {
        const file = e.target.files[0];
        if (!file) return;

        try {
            const base64 = await convertToBase64(file);
            if (type === "guardian") {
                setGuardianData({ ...guardianData, [field]: base64 });
            } else if (type === "student" && index !== null) {
                updateStudentField(index, field, base64);
            }
        } catch (error) {
            console.error("File conversion error:", error);
            toast.error("ছবি প্রসেস করতে সমস্যা হয়েছে");
        }
    };




    const handleSubmit = async () => {
        setSubmitting(true);
        try {
            const payload = {
                guardian: guardianData,
                students: students.map(s => ({
                    name: s.fullName,
                    gender: s.gender,
                    dob: s.dob,
                    bloodGroup: s.bloodGroup,
                    appliedClass: s.assignedClass,
                    section: s.section,
                    photo: s.photo
                }))
            };

            console.log("Submitting payload:", payload);

            const response = await axiosInstance.post(`/portal/v1/${slug}/admission`, payload);
            if (response.data.success) {
                toast.success("আবেদন সফলভাবে জমা দেওয়া হয়েছে!");
                setSubmitted(true);
            }
        } catch (error) {
            console.error("Submission error:", error);
            toast.error(error.response?.data?.message || "আবেদন জমা দিতে সমস্যা হয়েছে। আবার চেষ্টা করুন।");
        } finally {
            setSubmitting(false);
        }
    };

    if (settingsLoading) {
        return (
            <div className="min-h-screen flex items-center justify-center bg-slate-50">
                <div className="flex flex-col items-center gap-4">
                    <Loader2 className="w-12 h-12 text-emerald-500 animate-spin" />
                    <p className="text-slate-500 font-bold">লোড হচ্ছে...</p>
                </div>
            </div>
        );
    }

    if (submitted) {
        return (
            <div className="min-h-screen flex items-center justify-center bg-slate-50 px-4">
                <div className="max-w-md w-full bg-white rounded-[32px] p-10 shadow-2xl border border-emerald-100 text-center animate-in zoom-in duration-500">
                    <div className="w-20 h-20 bg-emerald-100 text-emerald-600 rounded-full flex items-center justify-center mx-auto mb-6">
                        <CheckCircle2 size={48} />
                    </div>
                    <h2 className="text-3xl font-black text-slate-800 mb-4 italic">ধন্যবাদ!</h2>
                    <p className="text-slate-600 font-bold mb-8 leading-relaxed">
                        আপনার অনলাইন ভর্তি আবেদন সফলভাবে গ্রহণ করা হয়েছে। আমরা শীঘ্রই আপনার সাথে যোগাযোগ করব।
                    </p>
                    <button 
                        onClick={() => window.location.reload()}
                        className="w-full bg-emerald-600 hover:bg-emerald-700 text-white font-black py-4 rounded-2xl shadow-xl shadow-emerald-200 transition-all transition-transform hover:-translate-y-1 active:scale-95"
                    >
                        হোম পেজে ফিরে যান
                    </button>
                </div>
            </div>
        );
    }

    const FileUploadBox = ({ label, id, value, onChange, icon: Icon = Upload, subLabel }) => (
        <div className="relative">
            <label className="text-sm font-bold text-slate-700 mb-2 block">{label}</label>
            <div className={`relative border-2 border-dashed rounded-2xl p-6 transition-all flex flex-col items-center justify-center gap-2 group cursor-pointer overflow-hidden ${
                value ? "border-emerald-500 bg-emerald-50/10" : "border-slate-200 hover:border-emerald-400 bg-slate-50/50"
            }`}>
                <input
                    type="file"
                    id={id}
                    className="absolute inset-0 opacity-0 cursor-pointer z-20"
                    onChange={onChange}
                    accept="image/*"
                />
                
                {value ? (
                    <div className="absolute inset-0 w-full h-full z-10 animate-in fade-in duration-300">
                        <img 
                            src={value} 
                            alt="Preview" 
                            className="w-full h-full object-cover opacity-80 group-hover:opacity-100 transition-opacity"
                        />
                        <div className="absolute inset-0 bg-gradient-to-t from-black/40 to-transparent flex items-end justify-center pb-3">
                            <p className="text-[10px] text-white font-black uppercase tracking-widest bg-emerald-600/80 px-3 py-1 rounded-full backdrop-blur-sm">
                                পরিবর্তন করতে ক্লিক করুন
                            </p>
                        </div>
                    </div>
                ) : (
                    <>
                        <div className="w-12 h-12 rounded-xl bg-white text-slate-400 flex items-center justify-center transition-all group-hover:text-emerald-500 shadow-sm border border-slate-100">
                            <Icon size={24} />
                        </div>
                        <div className="text-center">
                            <p className="text-xs font-bold text-slate-600">
                                {label} আপলোড করুন
                            </p>
                            {subLabel && <p className="text-[10px] text-slate-400 mt-1">{subLabel}</p>}
                        </div>
                    </>
                )}

                {value && (
                    <div className="absolute top-2 right-2 bg-emerald-500 text-white p-1.5 rounded-full z-30 shadow-lg animate-in zoom-in">
                        <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="4" d="M5 13l4 4L19 7" />
                        </svg>
                    </div>
                )}
            </div>
        </div>
    );

    // Use dynamic academic options
    const classOptions = academicOptions;

    const steps = [
        { id: 1, title: "অভিভাবকের তথ্য" },
        { id: 2, title: "শিক্ষার্থীর তথ্য" },
    ];

    return (
        <div className="bg-[#f8fafc] min-h-screen font-sans">
            <section className="bg-gradient-to-r from-[#042f2c] to-[#064e4a] pt-24 pb-20 px-6 relative overflow-hidden">
                <div className="absolute top-0 right-0 w-64 h-64 bg-emerald-500/10 rounded-full blur-3xl -mr-32 -mt-32"></div>
                <div className="absolute bottom-0 left-0 w-80 h-80 bg-emerald-500/5 rounded-full blur-3xl -ml-40 -mb-40"></div>
                
                <div className="max-w-[1240px] mx-auto text-center relative z-10">
                    <h1 className="text-3xl md:text-6xl font-black text-white mb-6 tracking-tight">অনলাইন ভর্তি ফরম</h1>
                    <p className="text-emerald-50/70 max-w-xl mx-auto text-lg italic font-medium leading-relaxed">
                        আপনার সন্তানের উজ্জ্বল ভবিষ্যতের পথে এক ধাপ এগিয়ে থাকুন। নিচের ধাপগুলো অনুসরণ করে নির্ভুলভাবে তথ্য পূরণ করুন।
                    </p>
                </div>
            </section>

            <div className="max-w-[900px] mx-auto px-6 -mt-10 relative z-20 pb-20">
                {/* Stepper */}
                <div className="bg-white p-2 rounded-3xl shadow-2xl border border-emerald-100 flex justify-between items-center mb-10 overflow-hidden">
                    {steps.map((s, i) => (
                        <div key={s.id} className="flex-1 flex items-center group">
                            <div className="flex items-center gap-4 px-6 py-3 w-full">
                                <div className={`w-12 h-12 rounded-2xl flex items-center justify-center font-black transition-all duration-500 ${
                                    step >= s.id ? "bg-emerald-600 text-white shadow-lg shadow-emerald-200" : "bg-slate-100 text-slate-400"
                                }`}>
                                    {s.id}
                                </div>
                                <div className="hidden sm:block">
                                    <p className={`text-[10px] font-black uppercase tracking-[0.2em] mb-0.5 ${
                                        step >= s.id ? "text-emerald-600" : "text-slate-400"
                                    }`}>Step {s.id}</p>
                                    <span className={`text-sm font-black whitespace-nowrap ${
                                        step >= s.id ? "text-slate-900" : "text-slate-400"
                                    }`}>
                                        {s.title}
                                    </span>
                                </div>
                            </div>
                            {i < steps.length - 1 && (
                                <div className="h-10 w-[1px] bg-slate-100" />
                            )}
                        </div>
                    ))}
                </div>

                <div className="space-y-8">
                    {step === 1 && (
                        <div className="bg-white rounded-[2.5rem] shadow-xl shadow-slate-200/50 border border-slate-100 p-8 md:p-12 animate-in fade-in slide-in-from-bottom-4 duration-700">
                            <div className="flex items-center gap-4 mb-10">
                                <div className="w-12 h-12 bg-emerald-50 rounded-2xl flex items-center justify-center text-emerald-600">
                                    <User size={24} />
                                </div>
                                <h2 className="text-2xl font-black text-slate-900">অভিভাবকের সাধারণ তথ্য</h2>
                            </div>

                            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                                <InputField
                                    title="পিতার নাম"
                                    placeholder="আপনার পিতার নাম লিখুন"
                                    required={true}
                                    value={guardianData.fatherName}
                                    setValue={(v) => setGuardianData({ ...guardianData, fatherName: v })}
                                />
                                <InputField
                                    title="মাতার নাম"
                                    placeholder="আপনার মাতার নাম লিখুন"
                                    required={true}
                                    value={guardianData.motherName}
                                    setValue={(v) => setGuardianData({ ...guardianData, motherName: v })}
                                />
                                <InputField
                                    title="পিতার পেশা"
                                    placeholder="পিতার পেশা"
                                    value={guardianData.fatherOccupation}
                                    setValue={(v) => setGuardianData({ ...guardianData, fatherOccupation: v })}
                                />
                                <InputField
                                    title="মাতার পেশা"
                                    placeholder="মাতার পেশা"
                                    value={guardianData.motherOccupation}
                                    setValue={(v) => setGuardianData({ ...guardianData, motherOccupation: v })}
                                />
                                <InputField
                                    title="যোগাযোগের নম্বর (পিতা)"
                                    placeholder="01XXXXXXXXX"
                                    required={true}
                                    value={guardianData.fatherContact}
                                    setValue={(v) => setGuardianData({ ...guardianData, fatherContact: v })}
                                    type={'number'}
                                />
                                <InputField
                                    title="যোগাযোগের নম্বর (মাতা)"
                                    placeholder="01XXXXXXXXX"
                                    value={guardianData.motherContact}
                                    setValue={(v) => setGuardianData({ ...guardianData, motherContact: v })}
                                    type={'number'}
                                />
                                <div className="md:col-span-2 lg:col-span-3">
                                    <TextareaField
                                        title="স্থায়ী ঠিকানা"
                                        placeholder="আপনার পূর্ণ ঠিকানা লিখুন"
                                        required={true}
                                        value={guardianData.address}
                                        setValue={(v) => setGuardianData({ ...guardianData, address: v })}
                                    />
                                </div>
                            </div>

                            <div className="mt-12 pt-10 border-t border-slate-50">
                                <h3 className="text-lg font-black text-slate-800 mb-6 flex items-center gap-2">
                                    <CreditCard size={18} className="text-emerald-500" /> প্রয়োজনীয় ডকুমেন্টস
                                </h3>
                                <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
                                    <FileUploadBox
                                        label="পিতার NID কার্ড"
                                        id="fatherNID"
                                        value={guardianData.fatherNID}
                                        onChange={(e) => handleFileChange(e, "fatherNID", "guardian")}
                                        subLabel="আইডির জন্য অবশ্যই প্রয়োজন"
                                    />
                                    <FileUploadBox
                                        label="মাতার NID কার্ড"
                                        id="motherNID"
                                        value={guardianData.motherNID}
                                        onChange={(e) => handleFileChange(e, "motherNID", "guardian")}
                                        subLabel="আইডির জন্য অবশ্যই প্রয়োজন"
                                    />
                                    <FileUploadBox
                                        label="অভিভাবকের NID কার্ড"
                                        id="guardianNID"
                                        value={guardianData.guardianNID}
                                        onChange={(e) => handleFileChange(e, "guardianNID", "guardian")}
                                        subLabel="অথবা জন্ম নিবন্ধন সনদ"
                                        icon={User}
                                    />
                                </div>
                            </div>

                            <div className="mt-12 flex justify-end">
                                <button
                                    onClick={() => setStep(2)}
                                    className="bg-emerald-600 hover:bg-emerald-700 text-white font-black px-10 py-4 rounded-2xl shadow-xl shadow-emerald-200 transition-all transform hover:-translate-y-1 active:scale-95"
                                >
                                    পরবর্তী ধাপে যান
                                </button>
                            </div>
                        </div>
                    )}

                    {step === 2 && (
                        <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-700">
                            {students.map((student, index) => (
                                <div key={student.id} className="bg-white rounded-[2.5rem] shadow-xl shadow-slate-200/50 border border-slate-100 p-8 md:p-12 relative overflow-hidden">
                                    {students.length > 1 && (
                                        <div className="absolute top-0 right-0 p-8">
                                            <button
                                                onClick={() => handleRemoveStudent(student.id)}
                                                className="w-10 h-10 rounded-xl bg-red-50 text-red-500 hover:bg-red-500 hover:text-white transition-all flex items-center justify-center shadow-sm"
                                            >
                                                <Trash2 size={18} />
                                            </button>
                                        </div>
                                    )}

                                    <div className="flex items-center gap-4 mb-10">
                                        <div className="w-12 h-12 bg-emerald-50 rounded-2xl flex items-center justify-center text-emerald-600">
                                            <User size={24} />
                                        </div>
                                        <div>
                                            <h2 className="text-2xl font-black text-slate-900">শিক্ষার্থীর তথ্য #{index + 1}</h2>
                                            <p className="text-sm font-bold text-slate-400">ব্যক্তিগত ও শিক্ষা সংক্রান্ত তথ্য দিন</p>
                                        </div>
                                    </div>

                                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                                        <InputField
                                            title="পূর্ণ নাম"
                                            placeholder="শিক্ষার্থীর পূর্ণ নাম"
                                            required={true}
                                            value={student.fullName}
                                            setValue={(v) => updateStudentField(index, "fullName", v)}
                                        />
                                        <SelectInputField
                                            title="লিঙ্গ"
                                            required={true}
                                            options={[{ label: "পুরুষ", value: "Male" }, { label: "মহিলা", value: "Female" }]}
                                            value={student.gender}
                                            setValue={(v) => updateStudentField(index, "gender", v)}
                                        />
                                        <InputField
                                            title="জন্ম তারিখ"
                                            type="date"
                                            required={true}
                                            value={student.dob}
                                            setValue={(v) => updateStudentField(index, "dob", v)}
                                        />
                                        <SelectInputField
                                            title="রক্তের গ্রুপ"
                                            options={[
                                                { value: "A+" }, { value: "A-" },
                                                { value: "B+" }, { value: "B-" },
                                                { value: "O+" }, { value: "O-" },
                                                { value: "AB+" }, { value: "AB-" }
                                            ]}
                                            value={student.bloodGroup}
                                            setValue={(v) => updateStudentField(index, "bloodGroup", v)}
                                        />
                                        <SelectInputField
                                            title="ক্লাস"
                                            required={true}
                                            options={classOptions}
                                            value={student.assignedClass}
                                            setValue={(v) => updateStudentField(index, "assignedClass", v)}
                                        />
                                        <SelectInputField
                                            title="সেকশন"
                                            options={classOptions.find(c => c.value === student.assignedClass)?.sections || []}
                                            value={student.section}
                                            setValue={(v) => updateStudentField(index, "section", v)}
                                        />
                                    </div>

                                    <div className="mt-10 pt-10 border-t border-slate-50">
                                        <FileUploadBox
                                            label="শিক্ষার্থীর ছবি"
                                            id={`photo-${student.id}`}
                                            value={student.photo}
                                            onChange={(e) => handleFileChange(e, "photo", "student", index)}
                                            subLabel="হাই কোয়ালিটি পাসপোর্ট সাইজ ছবি রিকমেন্ডেড"
                                            icon={ImageIcon}
                                        />
                                    </div>
                                </div>
                            ))}

                            <button
                                onClick={handleAddStudent}
                                className="w-full py-6 border-2 border-dashed border-emerald-200 rounded-[2.5rem] bg-emerald-100 text-emerald-600 font-black flex items-center justify-center gap-3 hover:bg-emerald-50 hover:border-emerald-400 transition-all group"
                            >
                                <div className="w-10 h-10 bg-emerald-100 rounded-xl flex items-center justify-center group-hover:scale-110 transition-transform">
                                    <Plus size={20} />
                                </div>
                                আরো শিক্ষার্থী যোগ করুন
                            </button>

                            <div className="mt-16 flex flex-col sm:flex-row gap-4">
                                <button
                                    onClick={() => setStep(1)}
                                    className="flex-1 border-2 border-slate-200 text-slate-600 font-black px-10 py-4 rounded-2xl hover:bg-slate-50 transition-all"
                                >
                                    পূর্ববর্তী ধাপে যান
                                </button>
                                <button
                                    onClick={handleSubmit}
                                    disabled={submitting}
                                    className="flex-[2] bg-emerald-600 hover:bg-emerald-700 disabled:opacity-70 text-white font-black px-10 py-4 rounded-2xl shadow-xl shadow-emerald-200 transition-all transform hover:-translate-y-1 active:scale-95 flex items-center justify-center gap-2"
                                >
                                    {submitting ? (
                                        <>
                                            <Loader2 size={20} className="animate-spin" />
                                            প্রসেসিং হচ্ছে...
                                        </>
                                    ) : (
                                        "ভর্তি নিশ্চিত করুন"
                                    )}
                                </button>
                            </div>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
};

export default OnlineAdmissionForm;
