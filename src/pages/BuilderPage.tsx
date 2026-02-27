import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'motion/react';
import { useStore, PersonalInfo, Education, Experience, LanguageSkill } from '../store/useStore';
import { translations } from '../i18n';
import Layout from '../components/Layout';
import * as Templates from '../components/Templates';
import TextareaAutosize from 'react-textarea-autosize';
import {
    User,
    BookOpen,
    Briefcase,
    Heart,
    Plus,
    Trash2,
    ArrowUp,
    ArrowDown,
    ChevronRight,
    ChevronLeft,
    FileText,
    Settings,
    Sparkles,
    X,
    Check,
    Globe,
    Camera,
    ChevronDown,
    ChevronUp
} from 'lucide-react';

export default function BuilderPage() {
    const navigate = useNavigate();
    const {
        appLanguage,
        personalInfo,
        updatePersonalInfo,
        setPhoto,
        summary,
        setSummary,
        education,
        addEducation,
        updateEducation,
        removeEducation,
        moveEducation,
        experience,
        addExperience,
        updateExperience,
        removeExperience,
        moveExperience,
        volunteering,
        addVolunteering,
        updateVolunteering,
        removeVolunteering,
        moveVolunteering,
        skills,
        setSkills,
        hobbies,
        setHobbies,
        languages,
        addLanguage,
        removeLanguage,
        ageGroup,
        template,
        themeColor,
        setThemeColor,
        resumeLanguage
    } = useStore();

    const t = translations[appLanguage];

    // --- Resume Strength Calculation ---
    const calculateStrength = () => {
        let score = 0;
        let total = 100;

        // Personal Info (20%)
        if (personalInfo.firstName && personalInfo.lastName) score += 5;
        if (personalInfo.email) score += 5;
        if (personalInfo.phone) score += 5;
        if (personalInfo.location) score += 5;

        // Summary (15%)
        if (summary.trim().length > 50) score += 15;
        else if (summary.trim().length > 10) score += 5;

        // Education (15%)
        if (education.length > 0) score += 15;

        // Experience / Volunteering (25%) -> For Under18, volunteering counts more
        if (experience.length > 0) score += 15;
        if (volunteering.length > 0) score += 10;

        // If Under18 and has Volunteering but no Experience, give full 25% credit
        if (ageGroup === 'under18' && experience.length === 0 && volunteering.length > 0) {
            score += 15;
        }

        // Skills & Languages (25%)
        if (skills.length > 2) score += 15;
        else if (skills.length > 0) score += 5;

        if (languages.length > 0) score += 10;

        return Math.min(score, total);
    };

    const strength = calculateStrength();

    // Determine color based on strength
    const strengthColor = strength < 40 ? 'bg-red-500' : strength < 70 ? 'bg-amber-400' : 'bg-emerald-500';
    const strengthText = strength < 40 ? t.strengthWeak : strength < 70 ? t.strengthGood : t.strengthStrong;

    // Available theme colors
    const THEME_COLORS = [
        '#060606ff', // Slate'
        '#10b981', // Emerald
        '#3b82f6', // Blue
        '#6366f1', // Indigo
        '#8b5cf6', // Violet
        '#ec4899', // Pink
        '#f43f5e', // Rose
        '#f97316', // Orange
        '#14b8a6', // Teal
        '#0ea5e9', // Sky

    ];

    const [step, setStep] = useState(1);
    const [customSkill, setCustomSkill] = useState('');
    const [newLangName, setNewLangName] = useState('');
    const [newLangProficiency, setNewLangProficiency] = useState('Basic');
    const [customLangName, setCustomLangName] = useState('');
    const [expandedEdu, setExpandedEdu] = useState<string | null>(null);
    const [expandedExp, setExpandedExp] = useState<string | null>(null);
    const [expandedVol, setExpandedVol] = useState<string | null>(null);

    const handlePersonalInfoChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
        updatePersonalInfo({ [e.target.name]: e.target.value });
    };

    const handlePhotoUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (file) {
            const reader = new FileReader();
            reader.onload = (event) => {
                setPhoto(event.target?.result as string);
            };
            reader.readAsDataURL(file);
        }
    };

    const toggleSkill = (skill: string) => {
        if (skills.includes(skill)) {
            setSkills(skills.filter(s => s !== skill));
        } else {
            setSkills([...skills, skill]);
        }
    };

    const addCustomSkillHandler = () => {
        const trimmed = customSkill.trim();
        if (trimmed && !skills.includes(trimmed)) {
            setSkills([...skills, trimmed]);
            setCustomSkill('');
        }
    };

    const handleAddLanguage = () => {
        const langName = newLangName === '__custom__' ? customLangName.trim() : newLangName;
        if (!langName) return;
        addLanguage({
            id: Date.now().toString(),
            language: langName,
            proficiency: newLangProficiency,
        });
        setNewLangName('');
        setCustomLangName('');
        setNewLangProficiency('Basic');
    };

    const handleAddEducation = () => {
        const id = Date.now().toString();
        addEducation({ id, school: '', degree: '', startDate: '', endDate: '' });
        setExpandedEdu(id);
    };

    const handleAddExperience = () => {
        const id = Date.now().toString();
        addExperience({ id, company: '', position: '', startDate: '', endDate: '', description: '' });
        setExpandedExp(id);
    };

    const handleAddVolunteering = () => {
        const id = Date.now().toString();
        addVolunteering({ id, company: '', position: '', startDate: '', endDate: '', description: '' });
        setExpandedVol(id);
    };

    const steps = [
        { id: 1, title: t.personalInfo, icon: User },
        { id: 2, title: t.summary, icon: FileText },
        { id: 3, title: t.education, icon: BookOpen },
        { id: 4, title: t.experience, icon: Briefcase },
        { id: 5, title: t.volunteering, icon: Heart },
        { id: 6, title: t.skills + ' & ' + t.languages, icon: Settings },
    ];

    const inputClass = "w-full bg-white border border-slate-200 rounded-xl p-4 text-slate-900 placeholder-slate-400 focus:outline-none focus:border-brand-primary focus:ring-2 focus:ring-brand-primary/10 transition-all";

    const templateKey = template.charAt(0).toUpperCase() + template.slice(1);
    const SelectedTemplate = (Templates as any)[`${templateKey}Template`] || Templates.ModernTemplate;

    return (
        <Layout>
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
                {/* Left Column: Form Editor */}
                <div className="lg:col-span-6 xl:col-span-5 flex flex-col gap-6">
                    {/* Progress Bar */}
                    <div className="card py-4 px-6 flex justify-between items-center overflow-x-auto no-scrollbar">
                        {steps.map((s, i) => (
                            <React.Fragment key={s.id}>
                                <button
                                    onClick={() => setStep(s.id)}
                                    className={`flex items-center gap-2 px-3 py-2 rounded-lg transition-colors whitespace-nowrap ${step === s.id ? 'bg-brand-primary/10 text-brand-primary font-bold' : 'text-slate-400 hover:text-slate-600'
                                        }`}
                                >
                                    <div className={`w-8 h-8 rounded-full flex items-center justify-center border ${step === s.id ? 'border-brand-primary bg-brand-primary text-white' : 'border-slate-200'
                                        }`}>
                                        <s.icon size={16} />
                                    </div>
                                    <span className="hidden sm:inline">{s.title}</span>
                                </button>
                                {i < steps.length - 1 && <div className="h-px bg-slate-200 w-8 mx-2" />}
                            </React.Fragment>
                        ))}
                    </div>

                    {/* Resume Strength Meter */}
                    <div className="card py-4 px-6">
                        <div className="flex justify-between items-center mb-2">
                            <span className="text-sm font-semibold text-slate-700 flex items-center gap-2">
                                <Sparkles size={16} className={strength >= 70 ? 'text-emerald-500' : 'text-slate-400'} />
                                {t.resumeStrength}: {strengthText || `${strength}%`}
                            </span>
                            <span className="text-sm font-bold text-slate-900">{strength}%</span>
                        </div>
                        <div className="w-full bg-slate-100 rounded-full h-2.5 overflow-hidden">
                            <motion.div
                                className={`h-2.5 rounded-full ${strengthColor}`}
                                initial={{ width: 0 }}
                                animate={{ width: `${strength}%` }}
                                transition={{ duration: 0.5, ease: "easeOut" }}
                            />
                        </div>
                    </div>

                    {/* Tip Box */}
                    <div className="bg-blue-50 border border-blue-100 rounded-xl px-5 py-3 text-sm text-blue-700">
                        💡 {ageGroup === 'over18'
                            ? (t.tipsOver18 as any)[step === 1 ? 'personalInfo' : step === 2 ? 'summary' : step === 3 ? 'education' : step === 4 ? 'experience' : step === 5 ? 'volunteering' : 'skills']
                            : (t.tipsUnder18 as any)[step === 1 ? 'personalInfo' : step === 2 ? 'summary' : step === 3 ? 'education' : step === 4 ? 'experience' : step === 5 ? 'volunteering' : 'skills']
                        }
                    </div>

                    {/* Step Content */}
                    <div className="card min-h-[500px]">
                        <AnimatePresence mode="popLayout">
                            <motion.div
                                key={step}
                                initial={{ opacity: 0, y: 15 }}
                                animate={{ opacity: 1, y: 0 }}
                                exit={{ opacity: 0, y: -15 }}
                                transition={{ duration: 0.2 }}
                            >
                                {step === 1 && (
                                    <div className="space-y-6">
                                        <h2 className="text-2xl font-bold flex items-center gap-2 text-slate-900">
                                            <User /> {t.personalInfo}
                                        </h2>

                                        {/* Photo Upload */}
                                        <div className="flex items-center gap-6">
                                            <div className="relative">
                                                {personalInfo.photo ? (
                                                    <div className="relative group">
                                                        <img src={personalInfo.photo} alt="Profile" className="w-24 h-24 rounded-2xl object-cover border-2 border-slate-200" />
                                                        <button
                                                            onClick={() => setPhoto(undefined)}
                                                            className="absolute -top-2 -right-2 bg-red-500 text-white rounded-full p-1 opacity-0 group-hover:opacity-100 transition-opacity shadow-lg"
                                                        >
                                                            <X size={14} />
                                                        </button>
                                                    </div>
                                                ) : (
                                                    <label className="w-24 h-24 rounded-2xl border-2 border-dashed border-slate-300 flex flex-col items-center justify-center cursor-pointer hover:border-brand-primary hover:bg-brand-primary/5 transition-all">
                                                        <Camera size={24} className="text-slate-400" />
                                                        <span className="text-[10px] text-slate-400 mt-1 font-medium">{t.uploadPhoto}</span>
                                                        <input type="file" accept="image/*" className="hidden" onChange={handlePhotoUpload} />
                                                    </label>
                                                )}
                                            </div>
                                            <p className="text-sm text-slate-400">{t.photoHint}</p>
                                        </div>

                                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                            <input
                                                type="text" name="firstName" placeholder={t.firstName}
                                                value={personalInfo.firstName} onChange={handlePersonalInfoChange}
                                                className={inputClass}
                                            />
                                            <input
                                                type="text" name="lastName" placeholder={t.lastName}
                                                value={personalInfo.lastName} onChange={handlePersonalInfoChange}
                                                className={inputClass}
                                            />
                                            <input
                                                type="email" name="email" placeholder={t.email}
                                                value={personalInfo.email} onChange={handlePersonalInfoChange}
                                                className={inputClass}
                                            />
                                            <input
                                                type="tel" name="phone" placeholder={t.phone}
                                                value={personalInfo.phone} onChange={handlePersonalInfoChange}
                                                className={inputClass}
                                            />
                                            <input
                                                type="text" name="location" placeholder={t.location}
                                                value={personalInfo.location || ''} onChange={handlePersonalInfoChange}
                                                className={inputClass}
                                            />
                                            <input
                                                type="text" name="linkedin" placeholder={t.linkedin}
                                                value={personalInfo.linkedin || ''} onChange={handlePersonalInfoChange}
                                                className={inputClass}
                                            />
                                            {ageGroup === 'over18' && (
                                                <>
                                                    <input
                                                        type="url" name="github" placeholder={t.github}
                                                        value={personalInfo.github || ''} onChange={handlePersonalInfoChange}
                                                        className={inputClass}
                                                    />
                                                    <input
                                                        type="url" name="portfolio" placeholder={t.portfolio}
                                                        value={personalInfo.portfolio || ''} onChange={handlePersonalInfoChange}
                                                        className={inputClass}
                                                    />
                                                </>
                                            )}
                                        </div>
                                    </div>
                                )}

                                {step === 2 && (
                                    <div className="space-y-6">
                                        <h2 className="text-2xl font-bold flex items-center gap-2 text-slate-900">
                                            <FileText /> {t.summary}
                                        </h2>
                                        <p className="text-slate-500">{t.summaryHint}</p>
                                        <TextareaAutosize
                                            minRows={4}
                                            value={summary}
                                            onChange={(e) => setSummary(e.target.value)}
                                            placeholder={t.examples.summary}
                                            className={inputClass + " resize-none"}
                                        />
                                    </div>
                                )}

                                {step === 3 && (
                                    <div className="space-y-6">
                                        <h2 className="text-2xl font-bold flex items-center gap-2 text-slate-900">
                                            <BookOpen /> {t.education}
                                        </h2>
                                        <div className="space-y-4">
                                            {education.map(edu => (
                                                <div key={edu.id} className="border border-slate-200 rounded-xl overflow-hidden">
                                                    {/* Header - clickable to expand/collapse */}
                                                    <div
                                                        className="flex justify-between items-center p-4 bg-slate-50 cursor-pointer hover:bg-slate-100 transition-colors"
                                                        onClick={() => setExpandedEdu(expandedEdu === edu.id ? null : edu.id)}
                                                    >
                                                        <div className="flex items-center gap-3 min-w-0">
                                                            <BookOpen size={18} className="text-brand-primary shrink-0" />
                                                            <div className="min-w-0">
                                                                <div className="font-bold text-slate-900 truncate">{edu.school || t.school}</div>
                                                                <div className="text-sm text-slate-500 truncate">{edu.degree || t.degree}</div>
                                                            </div>
                                                        </div>
                                                        <div className="flex items-center gap-1 shrink-0">
                                                            <button
                                                                onClick={(e) => { e.stopPropagation(); moveEducation(education.indexOf(edu), 'up'); }}
                                                                disabled={education.indexOf(edu) === 0}
                                                                className="text-slate-300 hover:text-brand-primary disabled:opacity-30 p-1"
                                                            >
                                                                <ArrowUp size={16} />
                                                            </button>
                                                            <button
                                                                onClick={(e) => { e.stopPropagation(); moveEducation(education.indexOf(edu), 'down'); }}
                                                                disabled={education.indexOf(edu) === education.length - 1}
                                                                className="text-slate-300 hover:text-brand-primary disabled:opacity-30 p-1 mr-2"
                                                            >
                                                                <ArrowDown size={16} />
                                                            </button>
                                                            <button
                                                                onClick={(e) => { e.stopPropagation(); removeEducation(edu.id); }}
                                                                className="text-slate-300 hover:text-red-500 transition-colors p-1"
                                                            >
                                                                <Trash2 size={18} />
                                                            </button>
                                                            {expandedEdu === edu.id ? <ChevronUp size={18} className="text-slate-400" /> : <ChevronDown size={18} className="text-slate-400" />}
                                                        </div>
                                                    </div>

                                                    {/* Expanded Form */}
                                                    {expandedEdu === edu.id && (
                                                        <div className="p-4 space-y-4 border-t border-slate-100">
                                                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                                                <input
                                                                    type="text"
                                                                    placeholder={t.school}
                                                                    value={edu.school}
                                                                    onChange={(e) => updateEducation(edu.id, { school: e.target.value })}
                                                                    className={inputClass}
                                                                />
                                                                <input
                                                                    type="text"
                                                                    placeholder={t.degree}
                                                                    value={edu.degree}
                                                                    onChange={(e) => updateEducation(edu.id, { degree: e.target.value })}
                                                                    className={inputClass}
                                                                />
                                                                <input
                                                                    type="text"
                                                                    placeholder={t.startDate}
                                                                    value={edu.startDate}
                                                                    onChange={(e) => updateEducation(edu.id, { startDate: e.target.value })}
                                                                    className={inputClass}
                                                                />
                                                                <input
                                                                    type="text"
                                                                    placeholder={t.endDate}
                                                                    value={edu.endDate}
                                                                    onChange={(e) => updateEducation(edu.id, { endDate: e.target.value })}
                                                                    className={inputClass}
                                                                />
                                                            </div>
                                                            <TextareaAutosize
                                                                minRows={3}
                                                                placeholder={t.description + ' (' + t.education + ')'}
                                                                value={edu.description || ''}
                                                                onChange={(e) => updateEducation(edu.id, { description: e.target.value })}
                                                                className={inputClass + " resize-none"}
                                                            />
                                                        </div>
                                                    )}
                                                </div>
                                            ))}
                                            <button
                                                onClick={handleAddEducation}
                                                className="w-full p-4 border-2 border-dashed border-slate-200 rounded-xl hover:bg-slate-50 hover:border-brand-primary transition-colors flex items-center justify-center gap-2 text-slate-500 font-medium"
                                            >
                                                <Plus size={20} /> {t.addEducation}
                                            </button>
                                        </div>
                                    </div>
                                )}

                                {step === 4 && (
                                    <div className="space-y-6">
                                        <h2 className="text-2xl font-bold flex items-center gap-2 text-slate-900">
                                            <Briefcase /> {t.experience}
                                        </h2>
                                        <div className="space-y-4">
                                            {experience.map(exp => (
                                                <div key={exp.id} className="border border-slate-200 rounded-xl overflow-hidden">
                                                    {/* Header - clickable to expand/collapse */}
                                                    <div
                                                        className="flex justify-between items-center p-4 bg-slate-50 cursor-pointer hover:bg-slate-100 transition-colors"
                                                        onClick={() => setExpandedExp(expandedExp === exp.id ? null : exp.id)}
                                                    >
                                                        <div className="flex items-center gap-3 min-w-0">
                                                            <Briefcase size={18} className="text-brand-primary shrink-0" />
                                                            <div className="min-w-0">
                                                                <div className="font-bold text-slate-900 truncate">{exp.company || t.company}</div>
                                                                <div className="text-sm text-slate-500 truncate">{exp.position || t.position}</div>
                                                            </div>
                                                        </div>
                                                        <div className="flex items-center gap-1 shrink-0">
                                                            <button
                                                                onClick={(e) => { e.stopPropagation(); moveExperience(experience.indexOf(exp), 'up'); }}
                                                                disabled={experience.indexOf(exp) === 0}
                                                                className="text-slate-300 hover:text-brand-primary disabled:opacity-30 p-1"
                                                            >
                                                                <ArrowUp size={16} />
                                                            </button>
                                                            <button
                                                                onClick={(e) => { e.stopPropagation(); moveExperience(experience.indexOf(exp), 'down'); }}
                                                                disabled={experience.indexOf(exp) === experience.length - 1}
                                                                className="text-slate-300 hover:text-brand-primary disabled:opacity-30 p-1 mr-2"
                                                            >
                                                                <ArrowDown size={16} />
                                                            </button>
                                                            <button
                                                                onClick={(e) => { e.stopPropagation(); removeExperience(exp.id); }}
                                                                className="text-slate-300 hover:text-red-500 transition-colors p-1"
                                                            >
                                                                <Trash2 size={18} />
                                                            </button>
                                                            {expandedExp === exp.id ? <ChevronUp size={18} className="text-slate-400" /> : <ChevronDown size={18} className="text-slate-400" />}
                                                        </div>
                                                    </div>

                                                    {/* Expanded Form */}
                                                    {expandedExp === exp.id && (
                                                        <div className="p-4 space-y-4 border-t border-slate-100">
                                                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                                                <input
                                                                    type="text"
                                                                    placeholder={t.company}
                                                                    value={exp.company}
                                                                    onChange={(e) => updateExperience(exp.id, { company: e.target.value })}
                                                                    className={inputClass}
                                                                />
                                                                <input
                                                                    type="text"
                                                                    placeholder={t.position}
                                                                    value={exp.position}
                                                                    onChange={(e) => updateExperience(exp.id, { position: e.target.value })}
                                                                    className={inputClass}
                                                                />
                                                                <input
                                                                    type="text"
                                                                    placeholder={t.startDate}
                                                                    value={exp.startDate}
                                                                    onChange={(e) => updateExperience(exp.id, { startDate: e.target.value })}
                                                                    className={inputClass}
                                                                />
                                                                <input
                                                                    type="text"
                                                                    placeholder={t.endDate}
                                                                    value={exp.endDate}
                                                                    onChange={(e) => updateExperience(exp.id, { endDate: e.target.value })}
                                                                    className={inputClass}
                                                                />
                                                            </div>
                                                            <TextareaAutosize
                                                                minRows={4}
                                                                placeholder={t.description + ' — ' + (ageGroup === 'over18' ? t.tipsOver18.experience : t.tipsUnder18.experience)}
                                                                value={exp.description}
                                                                onChange={(e) => updateExperience(exp.id, { description: e.target.value })}
                                                                className={inputClass + " resize-none"}
                                                            />
                                                        </div>
                                                    )}
                                                </div>
                                            ))}
                                            <button
                                                onClick={handleAddExperience}
                                                className="w-full p-4 border-2 border-dashed border-slate-200 rounded-xl hover:bg-slate-50 hover:border-brand-primary transition-colors flex items-center justify-center gap-2 text-slate-500 font-medium"
                                            >
                                                <Plus size={20} /> {t.addExperience}
                                            </button>
                                        </div>
                                    </div>
                                )}

                                {step === 5 && (
                                    <div className="space-y-6">
                                        <h2 className="text-2xl font-bold flex items-center gap-2 text-slate-900">
                                            <Heart /> {t.volunteering}
                                        </h2>
                                        <div className="space-y-4">
                                            {volunteering.map(exp => (
                                                <div key={exp.id} className="border border-slate-200 rounded-xl overflow-hidden">
                                                    <div
                                                        className="flex justify-between items-center p-4 bg-slate-50 cursor-pointer hover:bg-slate-100 transition-colors"
                                                        onClick={() => setExpandedVol(expandedVol === exp.id ? null : exp.id)}
                                                    >
                                                        <div className="flex items-center gap-3 min-w-0">
                                                            <Heart size={18} className="text-brand-primary shrink-0" />
                                                            <div className="min-w-0">
                                                                <div className="font-bold text-slate-900 truncate">{exp.company || t.organization}</div>
                                                                <div className="text-sm text-slate-500 truncate">{exp.position || t.role}</div>
                                                            </div>
                                                        </div>
                                                        <div className="flex items-center gap-1 shrink-0">
                                                            <button
                                                                onClick={(e) => { e.stopPropagation(); moveVolunteering(volunteering.indexOf(exp), 'up'); }}
                                                                disabled={volunteering.indexOf(exp) === 0}
                                                                className="text-slate-300 hover:text-brand-primary disabled:opacity-30 p-1"
                                                            >
                                                                <ArrowUp size={16} />
                                                            </button>
                                                            <button
                                                                onClick={(e) => { e.stopPropagation(); moveVolunteering(volunteering.indexOf(exp), 'down'); }}
                                                                disabled={volunteering.indexOf(exp) === volunteering.length - 1}
                                                                className="text-slate-300 hover:text-brand-primary disabled:opacity-30 p-1 mr-2"
                                                            >
                                                                <ArrowDown size={16} />
                                                            </button>
                                                            <button
                                                                onClick={(e) => { e.stopPropagation(); removeVolunteering(exp.id); }}
                                                                className="text-slate-300 hover:text-red-500 transition-colors p-1"
                                                            >
                                                                <Trash2 size={18} />
                                                            </button>
                                                            {expandedVol === exp.id ? <ChevronUp size={18} className="text-slate-400" /> : <ChevronDown size={18} className="text-slate-400" />}
                                                        </div>
                                                    </div>

                                                    {expandedVol === exp.id && (
                                                        <div className="p-4 space-y-4 border-t border-slate-100">
                                                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                                                <input
                                                                    type="text"
                                                                    placeholder={t.organization}
                                                                    value={exp.company}
                                                                    onChange={(e) => updateVolunteering(exp.id, { company: e.target.value })}
                                                                    className={inputClass}
                                                                />
                                                                <input
                                                                    type="text"
                                                                    placeholder={t.role}
                                                                    value={exp.position}
                                                                    onChange={(e) => updateVolunteering(exp.id, { position: e.target.value })}
                                                                    className={inputClass}
                                                                />
                                                                <input
                                                                    type="text"
                                                                    placeholder={t.startDate}
                                                                    value={exp.startDate}
                                                                    onChange={(e) => updateVolunteering(exp.id, { startDate: e.target.value })}
                                                                    className={inputClass}
                                                                />
                                                                <input
                                                                    type="text"
                                                                    placeholder={t.endDate}
                                                                    value={exp.endDate}
                                                                    onChange={(e) => updateVolunteering(exp.id, { endDate: e.target.value })}
                                                                    className={inputClass}
                                                                />
                                                            </div>
                                                            <TextareaAutosize
                                                                minRows={4}
                                                                placeholder={t.description + ' — ' + (ageGroup === 'over18' ? t.tipsOver18.volunteering : t.tipsUnder18.volunteering)}
                                                                value={exp.description}
                                                                onChange={(e) => updateVolunteering(exp.id, { description: e.target.value })}
                                                                className={inputClass + " resize-none"}
                                                            />
                                                        </div>
                                                    )}
                                                </div>
                                            ))}
                                            <button
                                                onClick={handleAddVolunteering}
                                                className="w-full p-4 border-2 border-dashed border-slate-200 rounded-xl hover:bg-slate-50 hover:border-brand-primary transition-colors flex items-center justify-center gap-2 text-slate-500 font-medium"
                                            >
                                                <Plus size={20} /> {t.addVolunteering}
                                            </button>
                                        </div>
                                    </div>
                                )}

                                {step === 6 && (
                                    <div className="space-y-10">
                                        {/* Skills Section */}
                                        <div className="space-y-4">
                                            <h2 className="text-2xl font-bold text-slate-900">{t.skills}</h2>
                                            <p className="text-slate-500 text-sm">{t.skillsHint}</p>

                                            {/* Selected Skills Tags */}
                                            {skills.length > 0 && (
                                                <div className="flex flex-wrap gap-2 mb-4">
                                                    {skills.map((skill, i) => (
                                                        <span key={i} className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-brand-primary text-white rounded-full text-sm font-medium">
                                                            {skill}
                                                            <button onClick={() => toggleSkill(skill)} className="hover:bg-white/20 rounded-full p-0.5 transition-colors">
                                                                <X size={14} />
                                                            </button>
                                                        </span>
                                                    ))}
                                                </div>
                                            )}

                                            {/* Skill Categories */}
                                            {Object.entries(t.skillCategories).map(([category, categoryName]) => (
                                                <div key={category} className="space-y-2">
                                                    <h3 className="text-sm font-bold text-slate-600 uppercase tracking-wider">{categoryName as string}</h3>
                                                    <div className="flex flex-wrap gap-2">
                                                        {((t.predefinedSkills as any)[category] as string[]).map((skill: string) => (
                                                            <button
                                                                key={skill}
                                                                onClick={() => toggleSkill(skill)}
                                                                className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full text-sm font-medium border transition-all ${skills.includes(skill)
                                                                    ? 'bg-brand-primary text-white border-brand-primary'
                                                                    : 'bg-white text-slate-600 border-slate-200 hover:border-brand-primary hover:text-brand-primary'
                                                                    }`}
                                                            >
                                                                {skills.includes(skill) && <Check size={14} />}
                                                                {skill}
                                                            </button>
                                                        ))}
                                                    </div>
                                                </div>
                                            ))}

                                            {/* Custom Skill Input */}
                                            <div className="flex gap-2 mt-4">
                                                <input
                                                    type="text"
                                                    value={customSkill}
                                                    onChange={(e) => setCustomSkill(e.target.value)}
                                                    onKeyDown={(e) => e.key === 'Enter' && addCustomSkillHandler()}
                                                    placeholder={t.addCustomSkill}
                                                    className={inputClass + " flex-1"}
                                                />
                                                <button
                                                    onClick={addCustomSkillHandler}
                                                    className="px-4 py-2 bg-brand-primary text-white rounded-xl hover:bg-brand-secondary transition-colors font-semibold"
                                                >
                                                    <Plus size={20} />
                                                </button>
                                            </div>
                                        </div>

                                        {/* Hobbies */}
                                        <div className="space-y-4">
                                            <h2 className="text-2xl font-bold text-slate-900">{t.hobbies}</h2>
                                            <input
                                                type="text"
                                                value={hobbies.join(', ')}
                                                onChange={(e) => setHobbies(e.target.value.split(',').map(s => s.replace(/^\s+/, '')))}
                                                placeholder={t.hobbiesHint}
                                                className={inputClass}
                                            />
                                        </div>

                                        {/* Languages */}
                                        <div className="space-y-4">
                                            <h2 className="text-2xl font-bold flex items-center gap-2 text-slate-900">
                                                <Globe size={24} /> {t.languages}
                                            </h2>

                                            {/* Existing Languages */}
                                            {languages.length > 0 && (
                                                <div className="space-y-2">
                                                    {languages.map(lang => (
                                                        <div key={lang.id} className="flex items-center justify-between p-3 bg-slate-50 border border-slate-200 rounded-xl">
                                                            <div>
                                                                <span className="font-bold text-slate-900">{lang.language}</span>
                                                                <span className="ml-2 text-sm text-slate-500">— {lang.proficiency}</span>
                                                            </div>
                                                            <button onClick={() => removeLanguage(lang.id)} className="text-slate-300 hover:text-red-500 transition-colors">
                                                                <Trash2 size={18} />
                                                            </button>
                                                        </div>
                                                    ))}
                                                </div>
                                            )}

                                            {/* Add Language */}
                                            <div className="flex flex-col sm:flex-row gap-3">
                                                <select
                                                    value={newLangName}
                                                    onChange={(e) => setNewLangName(e.target.value)}
                                                    className={inputClass + " flex-1"}
                                                >
                                                    <option value="">{t.selectLanguage}</option>
                                                    {t.commonLanguages.map((lang: string) => (
                                                        <option key={lang} value={lang}>{lang}</option>
                                                    ))}
                                                    <option value="__custom__">{t.customLanguage}</option>
                                                </select>

                                                {newLangName === '__custom__' && (
                                                    <input
                                                        type="text"
                                                        value={customLangName}
                                                        onChange={(e) => setCustomLangName(e.target.value)}
                                                        placeholder={t.language}
                                                        className={inputClass + " flex-1"}
                                                    />
                                                )}

                                                <select
                                                    value={newLangProficiency}
                                                    onChange={(e) => setNewLangProficiency(e.target.value)}
                                                    className={inputClass + " sm:w-40"}
                                                >
                                                    <option value="Basic">{t.basic}</option>
                                                    <option value="Intermediate">{t.intermediate}</option>
                                                    <option value="Fluent">{t.fluent}</option>
                                                    <option value="Native">{t.native}</option>
                                                </select>

                                                <button
                                                    onClick={handleAddLanguage}
                                                    className="px-4 py-2 bg-brand-primary text-white rounded-xl hover:bg-brand-secondary transition-colors font-semibold flex items-center gap-2 whitespace-nowrap"
                                                >
                                                    <Plus size={18} /> {t.addLanguage}
                                                </button>
                                            </div>
                                        </div>

                                        {/* Theme Color Picker */}
                                        <div className="space-y-4 pt-6 mt-6 border-t border-slate-200">
                                            <div>
                                                <h2 className="text-2xl font-bold flex items-center gap-2 text-slate-900">
                                                    <Sparkles size={24} className="text-brand-primary" /> {t.themeColor || "Theme Color"}
                                                </h2>
                                                <p className="text-slate-500 text-sm mt-1">{t.themeColorHint || "Choose an accent color for your resume"}</p>
                                            </div>
                                            <div className="flex flex-wrap gap-3">
                                                {THEME_COLORS.map(color => (
                                                    <button
                                                        key={color}
                                                        onClick={() => setThemeColor(color)}
                                                        className={`w-10 h-10 rounded-full cursor-pointer transition-transform hover:scale-110 flex items-center justify-center ${themeColor === color ? 'ring-4 ring-offset-2 ring-slate-300 scale-110' : ''}`}
                                                        style={{ backgroundColor: color }}
                                                        aria-label={`Select color ${color}`}
                                                    >
                                                        {themeColor === color && <Check size={20} className="text-white drop-shadow-md" />}
                                                    </button>
                                                ))}
                                            </div>
                                        </div>
                                    </div>
                                )}
                            </motion.div>
                        </AnimatePresence>
                    </div>

                    {/* Navigation Controls */}
                    <div className="flex justify-between mt-4">
                        <button
                            onClick={() => step > 1 ? setStep(step - 1) : navigate('/')}
                            className="flex items-center gap-2 text-slate-600 font-medium px-6 py-3 rounded-full hover:bg-slate-100 transition-colors"
                        >
                            <ChevronLeft size={20} /> {t.back}
                        </button>

                        {step < 6 ? (
                            <button
                                onClick={() => setStep(step + 1)}
                                className="btn-primary flex items-center gap-2"
                            >
                                {t.next} <ChevronRight size={20} />
                            </button>
                        ) : (
                            <button
                                onClick={() => navigate('/preview')}
                                className="btn-primary flex items-center gap-2 bg-emerald-600 hover:bg-emerald-700 shadow-emerald-500/20"
                            >
                                {t.finish} <Sparkles size={20} />
                            </button>
                        )}
                    </div>
                </div>

                {/* Right Column: Live Split-Screen Preview */}
                <div className="hidden lg:block lg:col-span-6 xl:col-span-7 bg-slate-100/50 rounded-2xl border border-slate-200 p-8 overflow-y-auto h-[calc(100vh-120px)] sticky top-24 no-scrollbar">
                    <div className="flex justify-between items-center mb-6">
                        <h3 className="text-lg font-bold text-slate-800 flex items-center gap-2">
                            <Sparkles size={20} className="text-brand-primary" />
                            Live Preview
                        </h3>
                        <span className="text-xs font-semibold text-slate-500 bg-white px-3 py-1 rounded-full shadow-sm border border-slate-200">
                            {t.autoSave || 'Auto-Saved'}
                        </span>
                    </div>

                    <div className="w-[210mm] min-h-[297mm] mx-auto shadow-2xl rounded-sm overflow-hidden bg-white text-slate-900 border border-slate-200 origin-top transform scale-[0.65] xl:scale-[0.80] transition-transform">
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
                            t={translations[resumeLanguage]}
                        />
                    </div>
                </div>
            </div>
        </Layout>
    );
}
