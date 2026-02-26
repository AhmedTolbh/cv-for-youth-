import React, { useRef, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useStore } from '../store/useStore';
import { translations } from '../i18n';
import Layout from '../components/Layout';
import * as Templates from '../components/Templates';
import { Download, ChevronLeft, Layout as LayoutIcon, FileText, Printer, Loader2 } from 'lucide-react';
import jsPDF from 'jspdf';
import html2canvas from 'html2canvas';
import { Document, Packer, Paragraph, TextRun, HeadingLevel, AlignmentType, BorderStyle, TabStopPosition, TabStopType } from 'docx';
import { saveAs } from 'file-saver';

export default function PreviewPage() {
    const navigate = useNavigate();
    const resumeRef = useRef<HTMLDivElement>(null);
    const [downloading, setDownloading] = useState(false);
    const [downloadingDocx, setDownloadingDocx] = useState(false);
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

    /* =========================================================
     * PDF GENERATION — capture the visible template with html2canvas
     * ========================================================= */
    const handleDownloadPDF = async () => {
        if (!resumeRef.current || downloading) return;
        setDownloading(true);

        try {
            const el = resumeRef.current;

            // Capture the VISIBLE rendered element directly — all Tailwind
            // styles are already computed by the browser so html2canvas can
            // read them. No cloning, no style patching needed.
            const canvas = await html2canvas(el, {
                scale: 2,               // high-DPI for sharp text
                useCORS: true,           // allow cross-origin images
                logging: false,
                backgroundColor: '#ffffff',
            });

            const imgData = canvas.toDataURL('image/png');
            const pdf = new jsPDF('p', 'mm', 'a4');
            const pdfWidth = pdf.internal.pageSize.getWidth();   // 210 mm
            const pdfHeight = pdf.internal.pageSize.getHeight(); // 297 mm

            // Scale image to fit page width, preserving aspect ratio
            const imgWidth = pdfWidth;
            const imgHeight = (canvas.height * pdfWidth) / canvas.width;

            // Multi-page support
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

    /* =========================================================
     * DOCX GENERATION — using docx + file-saver
     * ========================================================= */
    const handleDownloadDOCX = async () => {
        if (downloadingDocx) return;
        setDownloadingDocx(true);

        try {
            const tDoc = translations[resumeLanguage];
            const sections: Paragraph[] = [];

            // --- Name Header ---
            sections.push(
                new Paragraph({
                    children: [
                        new TextRun({
                            text: `${personalInfo.firstName} ${personalInfo.lastName}`,
                            bold: true,
                            size: 48,
                            font: 'Calibri',
                        }),
                    ],
                    alignment: AlignmentType.CENTER,
                    spacing: { after: 100 },
                })
            );

            // --- Contact Info ---
            const contactParts: string[] = [];
            if (personalInfo.email) contactParts.push(personalInfo.email);
            if (personalInfo.phone) contactParts.push(personalInfo.phone);
            if (personalInfo.location) contactParts.push(personalInfo.location);
            if (personalInfo.linkedin) contactParts.push(personalInfo.linkedin);

            if (contactParts.length > 0) {
                sections.push(
                    new Paragraph({
                        children: [
                            new TextRun({
                                text: contactParts.join('  •  '),
                                size: 20,
                                font: 'Calibri',
                                color: '666666',
                            }),
                        ],
                        alignment: AlignmentType.CENTER,
                        spacing: { after: 300 },
                        border: {
                            bottom: { style: BorderStyle.SINGLE, size: 6, color: '000000' },
                        },
                    })
                );
            }

            // --- Summary ---
            if (summary) {
                sections.push(createSectionHeading(tDoc.summary));
                sections.push(
                    new Paragraph({
                        children: [
                            new TextRun({ text: summary, size: 22, font: 'Calibri' }),
                        ],
                        spacing: { after: 200 },
                    })
                );
            }

            // --- Experience ---
            if (experience.length > 0) {
                sections.push(createSectionHeading(tDoc.experience));
                experience.forEach((exp) => {
                    sections.push(
                        new Paragraph({
                            children: [
                                new TextRun({ text: exp.position, bold: true, size: 24, font: 'Calibri' }),
                                new TextRun({ text: `\t${exp.startDate} — ${exp.endDate}`, size: 20, font: 'Calibri', color: '888888' }),
                            ],
                            tabStops: [{ type: TabStopType.RIGHT, position: TabStopPosition.MAX }],
                            spacing: { before: 120, after: 40 },
                        })
                    );
                    sections.push(
                        new Paragraph({
                            children: [
                                new TextRun({ text: exp.company, bold: true, size: 20, font: 'Calibri', color: '0000BF' }),
                            ],
                            spacing: { after: 60 },
                        })
                    );
                    if (exp.description) {
                        sections.push(
                            new Paragraph({
                                children: [
                                    new TextRun({ text: exp.description, size: 22, font: 'Calibri' }),
                                ],
                                spacing: { after: 160 },
                            })
                        );
                    }
                });
            }

            // --- Education ---
            if (education.length > 0) {
                sections.push(createSectionHeading(tDoc.education));
                education.forEach((edu) => {
                    sections.push(
                        new Paragraph({
                            children: [
                                new TextRun({ text: edu.degree, bold: true, size: 24, font: 'Calibri' }),
                                new TextRun({ text: `\t${edu.startDate} — ${edu.endDate}`, size: 20, font: 'Calibri', color: '888888' }),
                            ],
                            tabStops: [{ type: TabStopType.RIGHT, position: TabStopPosition.MAX }],
                            spacing: { before: 120, after: 40 },
                        })
                    );
                    sections.push(
                        new Paragraph({
                            children: [
                                new TextRun({ text: edu.school, size: 20, font: 'Calibri', color: '555555' }),
                            ],
                            spacing: { after: 120 },
                        })
                    );
                });
            }

            // --- Skills ---
            if (skills.length > 0) {
                sections.push(createSectionHeading(tDoc.skills));
                sections.push(
                    new Paragraph({
                        children: [
                            new TextRun({ text: skills.join('  •  '), size: 22, font: 'Calibri' }),
                        ],
                        spacing: { after: 200 },
                    })
                );
            }

            // --- Languages ---
            if (languages.length > 0) {
                sections.push(createSectionHeading(tDoc.languages));
                languages.forEach((lang) => {
                    sections.push(
                        new Paragraph({
                            children: [
                                new TextRun({ text: `${lang.language}`, bold: true, size: 22, font: 'Calibri' }),
                                new TextRun({ text: ` — ${lang.proficiency}`, size: 22, font: 'Calibri', color: '888888' }),
                            ],
                            spacing: { after: 60 },
                        })
                    );
                });
            }

            // --- Hobbies ---
            if (hobbies.length > 0) {
                sections.push(createSectionHeading(tDoc.hobbies));
                sections.push(
                    new Paragraph({
                        children: [
                            new TextRun({ text: hobbies.join(', '), size: 22, font: 'Calibri' }),
                        ],
                        spacing: { after: 200 },
                    })
                );
            }

            const doc = new Document({
                sections: [{
                    properties: {
                        page: {
                            margin: { top: 720, right: 1080, bottom: 720, left: 1080 },
                        },
                    },
                    children: sections,
                }],
            });

            const blob = await Packer.toBlob(doc);
            const fileName = personalInfo.firstName && personalInfo.lastName
                ? `${personalInfo.firstName}_${personalInfo.lastName}_Resume.docx`
                : 'Resume.docx';
            saveAs(blob, fileName);
        } catch (error) {
            console.error('DOCX generation failed:', error);
            alert('DOCX generation failed. Please try again.');
        } finally {
            setDownloadingDocx(false);
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
                            onClick={handleDownloadDOCX}
                            disabled={downloadingDocx}
                            className="btn-primary w-full flex items-center justify-center gap-2 disabled:opacity-60"
                            style={{ backgroundColor: downloadingDocx ? undefined : '#2563eb' }}
                        >
                            {downloadingDocx ? (
                                <>
                                    <Loader2 size={18} className="animate-spin" /> Generating DOCX...
                                </>
                            ) : (
                                <>
                                    <FileText size={18} /> {t.downloadDOCX}
                                </>
                            )}
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

/** Helper: creates a section heading paragraph for DOCX */
function createSectionHeading(text: string): Paragraph {
    return new Paragraph({
        children: [
            new TextRun({
                text: text.toUpperCase(),
                bold: true,
                size: 24,
                font: 'Calibri',
                color: '000000',
            }),
        ],
        heading: HeadingLevel.HEADING_2,
        spacing: { before: 300, after: 100 },
        border: {
            bottom: { style: BorderStyle.SINGLE, size: 4, color: '000000' },
        },
    });
}
