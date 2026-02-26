import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useStore, PersonalInfo, Education, Experience, LanguageSkill } from '../store/useStore';
import { translations } from '../i18n';
import Layout from '../components/Layout';
import {
    User,
    BookOpen,
    Briefcase,
    Plus,
    Trash2,
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
        experience,
        addExperience,
        updateExperience,
        removeExperience,
        skills,
        setSkills,
        hobbies,
        setHobbies,
        languages,
        addLanguage,
        removeLanguage,
        ageGroup
    } = useStore();

    const t = translations[appLanguage];
    const [step, setStep] = useState(1);
    const [customSkill, setCustomSkill] = useState('');
    const [newLangName, setNewLangName] = useState('');
    const [newLangProficiency, setNewLangProficiency] = useState('Basic');
    const [customLangName, setCustomLangName] = useState('');
    const [expandedEdu, setExpandedEdu] = useState<string | null>(null);
    const [expandedExp, setExpandedExp] = useState<string | null>(null);

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

    const steps = [
        { id: 1, title: t.personalInfo, icon: User },
        { id: 2, title: t.summary, icon: FileText },
        { id: 3, title: t.education, icon: BookOpen },
        { id: 4, title: t.experience, icon: Briefcase },
        { id: 5, title: t.skills + ' & ' + t.languages, icon: Settings },
    ];

    const inputClass = "w-full bg-white border border-slate-200 rounded-xl p-4 text-slate-900 placeholder-slate-400 focus:outline-none focus:border-brand-primary focus:ring-2 focus:ring-brand-primary/10 transition-all";

    return (
        <Layout>
            <div className="flex flex-col gap-8">
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

                {/* Tip Box */}
                <div className="bg-blue-50 border border-blue-100 rounded-xl px-5 py-3 text-sm text-blue-700">
                    💡 {(t.tips as any)[step === 1 ? 'personalInfo' : step === 2 ? 'summary' : step === 3 ? 'education' : step === 4 ? 'experience' : 'skills']}
                </div>

                {/* Step Content */}
                <div className="card min-h-[500px]">
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
                            </div>
                        </div>
                    )}

                    {step === 2 && (
                        <div className="space-y-6">
                            <h2 className="text-2xl font-bold flex items-center gap-2 text-slate-900">
                                <FileText /> {t.summary}
                            </h2>
                            <p className="text-slate-500">{t.summaryHint}</p>
                            <textarea
                                value={summary}
                                onChange={(e) => setSummary(e.target.value)}
                                placeholder={t.examples.summary}
                                className={inputClass + " h-48 resize-none"}
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
                                            <div className="flex items-center gap-2 shrink-0">
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
                                                <textarea
                                                    placeholder={t.description + ' (' + t.education + ')'}
                                                    value={edu.description || ''}
                                                    onChange={(e) => updateEducation(edu.id, { description: e.target.value })}
                                                    className={inputClass + " h-24 resize-none"}
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
                                            <div className="flex items-center gap-2 shrink-0">
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
                                                <textarea
                                                    placeholder={t.description + ' — ' + t.tips.experience}
                                                    value={exp.description}
                                                    onChange={(e) => updateExperience(exp.id, { description: e.target.value })}
                                                    className={inputClass + " h-32 resize-none"}
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
                                    onChange={(e) => setHobbies(e.target.value.split(',').map(s => s.trim()))}
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
                        </div>
                    )}
                </div>

                {/* Navigation Controls */}
                <div className="flex justify-between mt-4">
                    <button
                        onClick={() => step > 1 ? setStep(step - 1) : navigate('/')}
                        className="flex items-center gap-2 text-slate-600 font-medium px-6 py-3 rounded-full hover:bg-slate-100 transition-colors"
                    >
                        <ChevronLeft size={20} /> {t.back}
                    </button>

                    {step < 5 ? (
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
        </Layout>
    );
}
