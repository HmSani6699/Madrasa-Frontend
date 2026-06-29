import { BookOpen, Globe, Phone, Printer, QrCode, X, Download, Share2 } from 'lucide-react';
import { toPng, toBlob } from 'html-to-image';
import { jsPDF } from 'jspdf';
import logo from '../../../public/mlogo.jpg';


const VoucherModal = ({ formData, onClose }) => {

    const handlePrint = () => {
        const printContent = document.getElementById('printable-voucher');
        if (!printContent) return;

        const iframe = document.createElement('iframe');
        iframe.style.display = 'none';
        document.body.appendChild(iframe);

        const doc = iframe.contentWindow.document;
        // Extract all styles from the main document to ensure Tailwind classes work
        const styles = Array.from(document.querySelectorAll('style, link[rel="stylesheet"]'))
            .map(s => s.outerHTML)
            .join('');

        doc.open();
        doc.write(`
            <!DOCTYPE html>
            <html>
                <head>
                    <title>Admission Voucher</title>
                    ${styles}
                    <style>
                        @import url('https://fonts.googleapis.com/css2?family=Amiri:wght@700&display=swap');
                        @page { size: A4 portrait; margin: 0; }
                        body {
                            margin: 0;
                            padding: 0;
                            -webkit-print-color-adjust: exact;
                            print-color-adjust: exact;
                            background: white;
                        }
                        .font-arabic { font-family: 'Amiri', serif; }
                        #print-wrap {
                            width: 210mm;
                            height: 297mm;
                            padding: 15mm;
                            box-sizing: border-box;
                            display: flex;
                            flex-direction: column;
                            background-color: #f0f3f6 !important;
                            position: relative;
                            z-index: 0;
                        }
                    </style>
                </head>
                <body>
                    <div id="print-wrap">
                        ${printContent.innerHTML}
                    </div>
                </body>
            </html>
        `);
        doc.close();

        // Wait for styles and images to load
        setTimeout(() => {
            iframe.contentWindow.focus();
            iframe.contentWindow.print();
            setTimeout(() => {
                document.body.removeChild(iframe);
            }, 1000);
        }, 500);
    };



    const handleShare = async () => {
        const printContent = document.getElementById('printable-voucher');
        if (!printContent) return;

        try {
            const a4WidthPx = 794;
            const a4HeightPx = 1123;

            const blob = await toBlob(printContent, {
                pixelRatio: 2,
                width: a4WidthPx,
                height: a4HeightPx,
                style: {
                    width: '210mm',
                    height: '297mm',
                    margin: 0,
                    transform: 'none',
                    maxHeight: 'none',
                    overflow: 'hidden'
                }
            });

            if (blob) {
                const file = new File([blob], `Admission_Voucher_${Date.now()}.png`, { type: 'image/png' });

                if (navigator.canShare && navigator.canShare({ files: [file] })) {
                    await navigator.share({
                        title: 'Admission Voucher',
                        text: 'Here is the admission voucher.',
                        files: [file]
                    });
                } else {
                    alert("Sharing is not supported on this device/browser.");
                }
            }
        } catch (error) {
            console.error("Failed to share", error);
            alert("Error sharing voucher.");
        }
    };

    // Extract all unique fee names present in the current students
    const activeFeeNames = Array.from(
        new Set(
            formData.students.flatMap((s) => Object.keys(s.fees || {}))
        )
    );

    // Grouped subtotals for the breakdown
    const feeSubtotals = activeFeeNames.reduce((acc, feeName) => {
        acc[feeName] = formData.students.reduce(
            (sum, s) => sum + (Number(s.fees?.[feeName]) || 0),
            0
        );
        return acc;
    }, {});

    const totalPayable = Object.values(feeSubtotals).reduce((a, b) => a + b, 0);

    return (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm animate-in fade-in duration-300">
            <div className="bg-white w-full max-w-4xl max-h-[90vh] overflow-y-auto rounded-[6px] shadow-2xl flex flex-col">
                {/* Modal Header */}
                <div className="p-6 border-b-2 border-slate-100 flex items-center justify-between sticky top-0 bg-white/80 backdrop-blur-md z-10">
                    <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-xl bg-[#013f77] flex items-center justify-center">
                            <Printer className="w-6 h-6 text-white" />
                        </div>
                        <h2 className="text-xl font-black text-slate-800">
                            Admission Voucher
                        </h2>
                    </div>
                    <div className="flex items-center gap-3">
                        {/* <button
                            onClick={handleShare}
                            className="p-2.5 bg-slate-100 text-slate-600 rounded-[6px] hover:bg-slate-200 transition-all cursor-pointer"
                            title="Share Voucher"
                        >
                            <Share2 className="w-5 h-5" />
                        </button> */}
                        <button
                            onClick={handlePrint}
                            className="flex items-center gap-2 p-2.5 font-black rounded-[6px] hover:bg-slate-200 transition-all  cursor-pointer"
                        >
                            <Printer className="w-4 h-4" />

                        </button>
                        <button
                            onClick={onClose}
                            className="p-2.5 bg-slate-100 text-slate-500 rounded-[6px] hover:bg-red-200 hover:text-red-600transition-all cursor-pointer"
                        >
                            <X className="w-5 h-5" />
                        </button>
                    </div>
                </div>

                {/* Voucher Content */}
                <div className="p-8 print-content bg-[#f0f3f6] relative z-0 flex flex-col" id="printable-voucher">
                    {/* Full Page Watermark */}
                    <div className="absolute inset-0 flex items-center justify-center opacity-[0.06] pointer-events-none z-0 overflow-hidden">
                        <img src={logo} alt="" className="w-[40%] max-w-2xl object-contain grayscale" />
                    </div>
                    <style>
                        {`
              @import url('https://fonts.googleapis.com/css2?family=Amiri:wght@700&display=swap');
              .font-arabic {
                font-family: 'Amiri', serif;
              }
            `}
                    </style>

                    {/* Institutional Header */}
                    <div className="flex justify-between items-start border-b-[3px] border-[#164366] pb-2 mb-2 relative">
                        <div className="flex items-center gap-6">
                            {/* Logo Circle Placeholder */}
                            <div className="w-24 h-24 flex flex-col items-center justify-center overflow-hidden ">
                                <img src={logo} alt="" />
                            </div>
                            <div className="text-center pt-2">
                                <h1 className="text-[26px] leading-none font-arabic font-bold text-[#164366] mb-1">الْمَدْرَسَةُ الْإِسْلَامِيَّةُ وَدَارُ الْأَيْتَامِ بِنَاكُونْدَا</h1>
                                <h2 className="text-2xl font-black text-slate-800 mb-0.5">পাকুন্ডা ইসলামিয়া মাদ্রাসা ও এতিমখানা</h2>
                                <p className="text-[13px] font-bold text-slate-700">পাকুন্ডা, সোনামুড়ী, নারায়ণগঞ্জ,</p>
                                <p className="text-[13px] font-bold text-slate-700">স্থাপিত : ২০০০ খ্রি</p>
                            </div>
                        </div>
                        <div className="absolute right-0 top-[-10px]">
                            <div className="bg-[#164366] text-white w-[90px] pt-4 pb-8 flex flex-col items-center justify-center relative clip-voucher-badge">
                                <div className="border border-white/50 p-1 mb-1 rounded">
                                    <QrCode className="w-8 h-8" />
                                </div>
                                <span className="text-[11px] font-black uppercase text-center leading-tight">Admission<br />Voucher</span>
                                <style>{`
                    .clip-voucher-badge {
                       clip-path: polygon(0 0, 100% 0, 100% 100%, 50% 85%, 0 100%);
                    }
                  `}</style>
                            </div>
                        </div>
                    </div>

                    <div className="flex justify-between text-[11px] font-bold text-slate-500 mb-6 uppercase tracking-wider mt-4">
                        <span>Voice No: {Date.now().toString().slice(-6)}</span>
                        <span>Date: {formData.admissionDate || new Date().toISOString().split('T')[0]}</span>
                    </div>

                    <div className="flex items-stretch justify-between mb-8 px-4">
                        {/* Guardian Info Card */}
                        <div className="w-5/12 text-center">
                            <h3 className="text-lg font-bold text-slate-700 mb-2">Guardian Details</h3>
                            <div>
                                <p className="text-2xl font-black text-slate-800">
                                    {formData.guardian.fatherName}
                                </p>
                                <p className="text-sm font-bold text-slate-600 mt-1">
                                    Father & Lead Guardian
                                </p>
                            </div>
                        </div>

                        {/* Vertical Separator */}
                        <div className="flex items-center justify-center w-1/12">
                            <div className="h-full flex gap-1.5">
                                <div className="w-1.5 h-full bg-[#164366]"></div>
                                <div className="w-[1.5px] h-full bg-[#164366]"></div>
                            </div>
                        </div>

                        {/* Admission Summary */}
                        <div className="w-5/12 text-center">
                            <h3 className="text-lg font-bold text-slate-700 mb-2">Academic Summary</h3>
                            <div className="flex justify-center gap-10">
                                <div>
                                    <p className="text-xl font-black text-slate-800">
                                        {formData.academicYear || "2024-2025"}
                                    </p>
                                    <p className="text-xs font-bold text-slate-600 mt-1">Academic Year</p>
                                </div>
                                <div>
                                    <p className="text-xl font-black text-slate-800">
                                        {String(formData.students.length).padStart(2, '0')}
                                    </p>
                                    <p className="text-xs font-bold text-slate-600 mt-1">Student</p>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Students Table */}
                    <div className="mb-6 relative">
                        <h3 className="text-lg font-bold text-slate-800 mb-3">
                            Enrolled Students
                        </h3>

                        <div className="relative z-10 border border-[#b8c7d4] bg-transparent">
                            <table className="w-full text-left border-collapse">
                                <thead>
                                    <tr className="border-b border-[#b8c7d4]">
                                        <th className="p-3 text-sm font-bold text-slate-800 border-r border-[#b8c7d4]">
                                            Student Name
                                        </th>
                                        <th className="p-3 text-sm font-bold text-slate-800 border-r border-[#b8c7d4] text-center">
                                            Class
                                        </th>
                                        <th className="p-3 text-sm font-bold text-slate-800 border-r border-[#b8c7d4]">
                                            Fee Details
                                        </th>
                                        <th className="p-3 text-sm font-bold text-slate-800 text-center">
                                            Subtotal
                                        </th>
                                    </tr>
                                </thead>
                                <tbody className="divide-y divide-[#b8c7d4]">
                                    {formData.students.map((s, idx) => {
                                        const studentTotal = Object.values(s.fees || {}).reduce((sum, val) => sum + (Number(val) || 0), 0);
                                        return (
                                            <tr key={idx} className="bg-transparent">
                                                <td className="p-4 border-r border-[#b8c7d4] align-top">
                                                    <p className="font-black text-slate-800 text-center text-lg">
                                                        {s.firstName}
                                                    </p>
                                                    <p className="text-[10px] font-bold text-slate-400 text-center mt-1">
                                                        ID: {Date.now().toString().slice(-4)}
                                                    </p>
                                                </td>
                                                <td className="p-4 border-r border-[#b8c7d4] font-bold text-slate-800 align-top text-center">
                                                    {s.class || "N/A"} ( {s.section || "N/A"} )
                                                </td>
                                                <td className="p-0 border-r border-[#b8c7d4] align-top">
                                                    <div className="flex flex-col divide-y divide-[#b8c7d4]">
                                                        {Object.entries(s.fees || {}).map(([name, val]) => (
                                                            <div key={name} className="px-4 py-2 flex justify-between text-xs font-bold text-slate-700">
                                                                <span>{name} ( {val} )</span>
                                                            </div>
                                                        ))}
                                                    </div>
                                                </td>
                                                <td className="p-4 font-black text-slate-800 text-center align-middle text-lg">
                                                    {studentTotal}
                                                </td>
                                            </tr>
                                        );
                                    })}
                                </tbody>
                            </table>
                        </div>
                    </div>

                    {/* Financial Breakdown */}
                    <div className="flex justify-end mb-8">
                        <div className="w-56 space-y-1">
                            <div className="flex justify-between items-center text-sm font-bold text-slate-800">
                                <span>Sub Total</span>
                                <span className="font-black">{totalPayable}</span>
                            </div>
                            <div className="flex justify-between items-center text-sm font-bold text-slate-800">
                                <span>Discount</span>
                                <span className="font-black">0</span>
                            </div>
                            <div className="flex justify-between items-center text-sm font-bold text-slate-800 border-t border-slate-300 pt-1 mt-1">
                                <span>Total Amount</span>
                                <span className="font-black">{totalPayable}</span>
                            </div>
                        </div>
                    </div>

                    {/* Signatures and Due/Paid */}
                    <div className="mt-auto flex justify-between items-end pt-8">
                        <div className="text-center w-40 ml-4">
                            <div className="h-16 flex items-center justify-center">
                                <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 300 100" className="h-12 opacity-80">
                                    <path d="M10,80 Q40,10 80,70 T150,60 T220,80 Q250,30 280,60" fill="none" stroke="#164366" strokeWidth="4" strokeLinecap="round" strokeLinejoin="round" />
                                    <path d="M120,40 Q130,20 140,50" fill="none" stroke="#164366" strokeWidth="3" strokeLinecap="round" />
                                </svg>
                            </div>
                            <div className="pt-2 border-t border-slate-400">
                                <p className="text-sm font-bold text-slate-800">একাউন্ট্যান্ট</p>
                            </div>
                        </div>

                        <div className="flex h-20 shadow-sm">
                            <div className="bg-[#164366] text-white w-32 px-4 py-2 text-center flex flex-col justify-center border-r border-white/20">
                                <span className="text-sm font-bold">Paid</span>
                                <span className="text-2xl font-black mt-1">0</span>
                            </div>
                            <div className="bg-[#d32f2f] text-white w-32 px-4 py-2 text-center flex flex-col justify-center">
                                <span className="text-sm font-bold">Deu</span>
                                <span className="text-2xl font-black mt-1">{totalPayable}</span>
                            </div>
                        </div>
                    </div>

                    {/* Footer Area inside printable section */}
                    <div className="bg-[#164366] text-white py-3 px-8 flex justify-center items-center gap-10 text-xs font-bold print-content mt-8 -mx-[15mm] -mb-[15mm] shrink-0">
                        <div className="flex items-center gap-2">
                            <Globe className="w-4 h-4" />
                            <span>www.pakundamadrasa.com</span>
                        </div>
                        <div className="flex items-center gap-2">
                            <Phone className="w-4 h-4" />
                            <span>01986566021</span>
                        </div>
                    </div>
                </div>

            </div>
        </div>
    );
};

export default VoucherModal;