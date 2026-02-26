import React, { useRef, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useStore } from '../store/useStore';
import { translations } from '../i18n';
import Layout from '../components/Layout';
import * as Templates from '../components/Templates';
import { Download, ChevronLeft, Layout as LayoutIcon, FileText, Printer, Loader2 } from 'lucide-react';
import jsPDF from 'jspdf';
import html2canvas from 'html2canvas';

export default function PreviewPage() {
    const navigate = useNavigate();
    const resumeRef = useRef<HTMLDivElement>(null);
    const [downloading, setDownloading] = useState(false);
    const {
        appLanguage,
        resumeLanguage,
        personalInfo,
        summary,
        education,
        experience,
        skills,
        hobbies,
        languages,
        template,
        setTemplate
    } = useStore();

    const t = translations[appLanguage];
    const tResume = translations[resumeLanguage];

    const templateOptions = [
        { id: 'modern', name: t.modern },
        { id: 'ats', name: t.ats },
        { id: 'creative', name: t.creative },
        { id: 'minimal', name: t.minimal },
        { id: 'professional', name: t.professional },
        { id: 'bold', name: t.bold },
        { id: 'elegant', name: t.elegant },
        { id: 'compact', name: t.compact },
    ];

    // Map template IDs to components
    const templateKey = template.charAt(0).toUpperCase() + template.slice(1);
    const SelectedTemplate = (Templates as any)[`${templateKey}Template`] || Templates.ModernTemplate;

    const handleDownloadPDF = async () => {
        if (!resumeRef.current || downloading) return;
        setDownloading(true);

        try {
            // Clone the element to render it at full A4 width off-screen
            const original = resumeRef.current;
            const clone = original.cloneNode(true) as HTMLElement;

            // Set clone to exact A4 pixel width (210mm ≈ 794px at 96dpi)
            clone.style.position = 'absolute';
            clone.style.left = '-9999px';
            clone.style.top = '0';
            clone.style.width = '794px';
            clone.style.minHeight = '1123px'; // A4 height ≈ 297mm
            clone.style.overflow = 'visible';
            clone.style.backgroundColor = '#ffffff';
            document.body.appendChild(clone);

            // Wait for rendering
            await new Promise(resolve => setTimeout(resolve, 300));

            const canvas = await html2canvas(clone, {
                scale: 2,
                useCORS: true,
                logging: false,
                backgroundColor: '#ffffff',
                width: 794,
                height: clone.scrollHeight,
                windowWidth: 794,
                windowHeight: clone.scrollHeight,
            });

            // Clean up the clone
            document.body.removeChild(clone);

            const imgData = canvas.toDataURL('image/png');
            const pdf = new jsPDF('p', 'mm', 'a4');
            const pdfWidth = pdf.internal.pageSize.getWidth(); // 210mm
            const pdfHeight = pdf.internal.pageSize.getHeight(); // 297mm
            const imgWidth = pdfWidth;
            const imgHeight = (canvas.height * pdfWidth) / canvas.width;

            // Handle multi-page
            let heightLeft = imgHeight;
            let position = 0;

            pdf.addImage(imgData, 'PNG', 0, position, imgWidth, imgHeight);
            heightLeft -= pdfHeight;

            while (heightLeft > 0) {
                position -= pdfHeight;
                pdf.addPage();
                pdf.addImage(imgData, 'PNG', 0, position, imgWidth, imgHeight);
                heightLeft -= pdfHeight;
            }

            const fileName = personalInfo.firstName && personalInfo.lastName
                ? `${personalInfo.firstName}_${personalInfo.lastName}_Resume.pdf`
                : 'Resume.pdf';
            pdf.save(fileName);
        } catch (error) {
            console.error('PDF generation failed:', error);
            alert('PDF generation failed. Please try again.');
        } finally {
            setDownloading(false);
        }
    };

    return (
        <Layout>
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
                {/* Sidebar Controls */}
                <div className="lg:col-span-4 space-y-6">
                    <div className="card space-y-6">
                        <h2 className="text-xl font-bold flex items-center gap-2 text-slate-900">
                            <LayoutIcon size={20} /> {t.chooseTemplate}
                        </h2>
                        <div className="grid grid-cols-2 gap-3">
                            {templateOptions.map((opt) => (
                                <button
                                    key={opt.id}
                                    onClick={() => setTemplate(opt.id)}
                                    className={`p-3 rounded-xl border text-sm font-medium transition-all ${template === opt.id
                                        ? 'bg-brand-primary text-white border-brand-primary shadow-lg'
                                        : 'bg-white border-slate-200 text-slate-600 hover:border-brand-primary hover:text-brand-primary'
                                        }`}
                                >
                                    {opt.name}
                                </button>
                            ))}
                        </div>
                    </div>

                    <div className="card space-y-4">
                        <button
                            onClick={handleDownloadPDF}
                            disabled={downloading}
                            className="btn-primary w-full flex items-center justify-center gap-2 disabled:opacity-60"
                        >
                            {downloading ? (
                                <>
                                    <Loader2 size={18} className="animate-spin" /> {t.downloadingPdf}
                                </>
                            ) : (
                                <>
                                    <Download size={18} /> {t.downloadPDF}
                                </>
                            )}
                        </button>
                        <button
                            className="w-full py-3 rounded-full border border-slate-200 text-slate-500 cursor-not-allowed flex items-center justify-center gap-2 font-semibold opacity-50"
                            disabled
                        >
                            <FileText size={18} /> {t.downloadDOCX}
                        </button>
                        <button
                            onClick={() => window.print()}
                            className="w-full py-3 rounded-full border border-slate-200 text-slate-600 hover:bg-slate-50 flex items-center justify-center gap-2 transition-all font-semibold"
                        >
                            <Printer size={18} /> {t.finish}
                        </button>
                    </div>

                    <button
                        onClick={() => navigate('/builder')}
                        className="flex items-center gap-2 text-slate-500 hover:text-slate-900 transition-colors px-6"
                    >
                        <ChevronLeft size={18} /> {t.back}
                    </button>
                </div>

                {/* Live Preview */}
                <div className="lg:col-span-8 flex justify-center">
                    <div className="w-full max-w-[800px] shadow-2xl rounded-sm overflow-hidden bg-white text-slate-900 border border-slate-200">
                        <div ref={resumeRef} className="resume-template">
                            <SelectedTemplate
                                personalInfo={personalInfo}
                                summary={summary}
                                education={education}
                                experience={experience}
                                skills={skills}
                                hobbies={hobbies}
                                languages={languages}
                                t={tResume}
                            />
                        </div>
                    </div>
                </div>
            </div>
        </Layout>
    );
}
