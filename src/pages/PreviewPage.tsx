import React, { useRef, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useStore } from '../store/useStore';
import { translations } from '../i18n';
import Layout from '../components/Layout';
import * as Templates from '../components/Templates';
import { Download, ChevronLeft, Layout as LayoutIcon, FileText, Printer, Loader2, Globe, Briefcase } from 'lucide-react';
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
        ageGroup,
        personalInfo,
        summary,
        education,
        experience,
        volunteering,
        skills,
        hobbies,
        languages,
        template,
        themeColor,
        setTemplate,
        setResumeLanguage
    } = useStore();

    const t = translations[appLanguage];
    const tResume = translations[resumeLanguage];

    // Build intelligent Job Search query based on their actual CV data
    const searchTerms = [
        experience[0]?.position,
        skills[0],
        skills[1]
    ].filter(Boolean);

    // Use up to 2 unique matching terms from their CV for an accurate broad search
    const uniqueTerms = Array.from(new Set(searchTerms)).slice(0, 2).join(' ');

    // Only use a fallback if their CV contains absolutely no experience or skills
    const fallbackTerm = ageGroup === 'under18' ? 'kesätyö' : 'avoimet työpaikat';
    const finalQuery = uniqueTerms || fallbackTerm;

    const jobSearchQuery = encodeURIComponent(finalQuery);
    const jobSearchUrl = `https://duunitori.fi/tyopaikat?haku=${jobSearchQuery}${personalInfo.location ? `&alue=${encodeURIComponent(personalInfo.location)}` : ''}`;

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
     * PDF GENERATION — Uses browser native print engine
     * Opens a clean window with ONLY the template + all styles,
     * then triggers print → user clicks "Save as PDF".
     * This is 100% reliable because the BROWSER renders the PDF.
     * ========================================================= */
    const handleDownloadPDF = async () => {
        if (!resumeRef.current || downloading) return;
        setDownloading(true);

        try {
            // 1. Collect ALL CSS from the current page (Tailwind, custom, etc.)
            const cssTexts: string[] = [];
            for (let i = 0; i < document.styleSheets.length; i++) {
                const sheet = document.styleSheets[i];
                try {
                    for (let j = 0; j < sheet.cssRules.length; j++) {
                        cssTexts.push(sheet.cssRules[j].cssText);
                    }
                } catch {
                    // Cross-origin stylesheet — import by URL
                    if (sheet.href) {
                        cssTexts.push(`@import url("${sheet.href}");`);
                    }
                }
            }

            // 2. Get the resume HTML and its wrapper classes
            const resumeHTML = resumeRef.current.innerHTML;
            const resumeClasses = resumeRef.current.className;

            // 3. Build a standalone HTML document with the resume + all CSS
            const html = `<!DOCTYPE html>
<html>
<head>
<meta charset="utf-8">
<title>${personalInfo.firstName || ''} ${personalInfo.lastName || ''} Resume</title>
<style>
/* ===== All page styles ===== */
${cssTexts.join('\n')}

/* ===== Print-specific overrides ===== */
@page {
    size: A4;
    margin: 0;
}
@media print {
    * {
        -webkit-print-color-adjust: exact !important;
        print-color-adjust: exact !important;
        color-adjust: exact !important;
    }
}
html, body {
    margin: 0;
    padding: 0;
    background: white;
    width: 210mm;
}
.print-resume-wrapper {
    width: 210mm;
    min-height: 297mm;
    margin: 0;
    padding: 0;
    background: white;
    overflow: visible;
    box-shadow: none;
    border: none;
}
</style>
</head>
<body>
<div class="print-resume-wrapper ${resumeClasses}">
${resumeHTML}
</div>
</body>
</html>`;

            // 4. Open a new window with ONLY the resume
            const printWindow = window.open('', '_blank', 'width=900,height=1200');
            if (!printWindow) {
                // Popup blocked — fall back to printing the current page
                window.print();
                setDownloading(false);
                return;
            }

            printWindow.document.open();
            printWindow.document.write(html);
            printWindow.document.close();

            // 5. Wait for render, then trigger print dialog
            const triggerPrint = () => {
                printWindow.focus();
                printWindow.print();
                setDownloading(false);
            };

            // Use both load event and timeout fallback
            let printed = false;
            printWindow.addEventListener('load', () => {
                if (!printed) {
                    printed = true;
                    setTimeout(triggerPrint, 400);
                }
            });
            // Fallback in case load event doesn't fire
            setTimeout(() => {
                if (!printed) {
                    printed = true;
                    triggerPrint();
                }
            }, 2000);

        } catch (error) {
            console.error('PDF generation failed:', error);
            // Ultimate fallback — just print the page
            window.print();
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
                        <h2 className="text-xl font-bold flex items-center gap-2 text-slate-900">
                            <Globe size={20} /> {t.selectResumeLanguage}
                        </h2>
                        <div className="flex gap-2">
                            <button
                                onClick={() => setResumeLanguage('fi')}
                                className={`flex-1 py-3 rounded-xl border font-bold transition-all ${resumeLanguage === 'fi'
                                    ? 'bg-blue-600 text-white border-blue-600 shadow-md'
                                    : 'bg-white border-slate-200 text-slate-600 hover:border-blue-600'
                                    }`}
                            >
                                Suomi 🇫🇮
                            </button>
                            <button
                                onClick={() => setResumeLanguage('en')}
                                className={`flex-1 py-3 rounded-xl border font-bold transition-all ${resumeLanguage === 'en'
                                    ? 'bg-blue-600 text-white border-blue-600 shadow-md'
                                    : 'bg-white border-slate-200 text-slate-600 hover:border-blue-600'
                                    }`}
                            >
                                English 🇬🇧
                            </button>
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

                    {/* Find Jobs Button */}
                    <div className="pt-6 border-t border-slate-200 mt-6">
                        <a
                            href={jobSearchUrl}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="w-full relative overflow-hidden group bg-emerald-600 text-white rounded-2xl p-4 flex flex-col items-center justify-center transition-all hover:bg-emerald-700 shadow-lg hover:shadow-emerald-600/20"
                        >
                            <div className="absolute inset-0 bg-white/10 opacity-0 group-hover:opacity-100 transition-opacity" />
                            <div className="flex items-center gap-2 font-bold text-lg mb-1">
                                <Briefcase size={22} className="text-emerald-200" />
                                {t.findJobs}
                            </div>
                            <span className="text-emerald-100 text-sm">{t.findJobsDesc}</span>
                        </a>
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
                                volunteering={volunteering}
                                skills={skills}
                                hobbies={hobbies}
                                languages={languages}
                                themeColor={themeColor}
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
