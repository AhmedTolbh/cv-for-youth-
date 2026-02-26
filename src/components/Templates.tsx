import React from 'react';
import { CheckCircle2 } from 'lucide-react';

interface TemplateProps {
  personalInfo: any;
  summary: string;
  education: any[];
  experience: any[];
  skills: string[];
  hobbies: string[];
  languages: any[];
  t: any;
  resumeRef?: React.RefObject<HTMLDivElement | null>;
}

/* Shared overflow-safe style applied to all template roots */
const templateRoot = "bg-white w-full min-h-[297mm] shadow-2xl shrink-0 overflow-hidden";
const textSafe = "break-words overflow-hidden";

/** Translate proficiency key (stored in English) to the current resume language */
const proficiencyLabel = (key: string, t: any): string => {
  const map: Record<string, string> = {
    'Basic': t.basic || key,
    'Intermediate': t.intermediate || key,
    'Fluent': t.fluent || key,
    'Native': t.native || key,
  };
  return map[key] || key;
};

export const ModernTemplate = ({ personalInfo, summary, education, experience, skills, hobbies, languages, t, resumeRef }: TemplateProps) => (
  <div ref={resumeRef} className={`${templateRoot} p-10 md:p-16 font-sans text-neutral-800`}>
    <div className={`border-b-4 border-neutral-900 pb-8 mb-10 flex flex-wrap justify-between items-start gap-4 ${textSafe}`}>
      <div className="flex-1 min-w-0">
        <h1 className={`text-3xl md:text-5xl font-black text-neutral-900 mb-4 uppercase tracking-tighter ${textSafe}`}>{personalInfo.firstName} {personalInfo.lastName}</h1>
        <div className="flex flex-wrap gap-x-4 gap-y-2 text-sm font-medium text-neutral-500">
          {personalInfo.email && <span className="flex items-center gap-1"><CheckCircle2 className="w-3 h-3 text-brand-500 shrink-0" /> <span className={textSafe}>{personalInfo.email}</span></span>}
          {personalInfo.phone && <span className="flex items-center gap-1"><CheckCircle2 className="w-3 h-3 text-brand-500 shrink-0" /> {personalInfo.phone}</span>}
          {personalInfo.location && <span className="flex items-center gap-1"><CheckCircle2 className="w-3 h-3 text-brand-500 shrink-0" /> <span className={textSafe}>{personalInfo.location}</span></span>}
          {personalInfo.linkedin && <span className="flex items-center gap-1"><CheckCircle2 className="w-3 h-3 text-brand-500 shrink-0" /> <span className={textSafe}>{personalInfo.linkedin}</span></span>}
        </div>
      </div>
      {personalInfo.photo && (
        <img src={personalInfo.photo} alt="Profile" className="w-28 h-28 rounded-2xl object-cover border-2 border-neutral-100 shadow-sm" />
      )}
    </div>

    {summary && (
      <div className="mb-10">
        <h2 className="text-xs font-black text-brand-600 mb-4 uppercase tracking-[0.2em]">{t.summary}</h2>
        <p className={`text-neutral-700 leading-relaxed text-base font-light ${textSafe}`}>{summary}</p>
      </div>
    )}

    <div className="grid grid-cols-1 md:grid-cols-12 gap-8">
      <div className="md:col-span-8 space-y-10">
        {experience.length > 0 && (
          <div>
            <h2 className="text-xs font-black text-brand-600 mb-6 uppercase tracking-[0.2em]">{t.experience}</h2>
            <div className="space-y-6">
              {experience.map(exp => (
                <div key={exp.id} className="relative pl-6 border-l-2 border-neutral-100">
                  <div className="absolute -left-[9px] top-0 w-4 h-4 rounded-full bg-white border-2 border-brand-500" />
                  <div className="flex flex-wrap justify-between items-baseline mb-2 gap-2">
                    <h3 className={`font-bold text-neutral-900 text-lg ${textSafe}`}>{exp.position}</h3>
                    <span className="text-xs font-bold text-neutral-400 uppercase tracking-wider whitespace-nowrap">{exp.startDate} — {exp.endDate}</span>
                  </div>
                  <div className={`text-brand-600 font-bold text-sm mb-3 uppercase tracking-wide ${textSafe}`}>{exp.company}</div>
                  <p className={`text-neutral-600 leading-relaxed text-sm ${textSafe}`}>{exp.description}</p>
                </div>
              ))}
            </div>
          </div>
        )}

        {education.length > 0 && (
          <div>
            <h2 className="text-xs font-black text-brand-600 mb-6 uppercase tracking-[0.2em]">{t.education}</h2>
            <div className="space-y-6">
              {education.map(edu => (
                <div key={edu.id} className="relative pl-6 border-l-2 border-neutral-100">
                  <div className="absolute -left-[9px] top-0 w-4 h-4 rounded-full bg-white border-2 border-brand-500" />
                  <div className="flex flex-wrap justify-between items-baseline mb-1 gap-2">
                    <h3 className={`font-bold text-neutral-900 text-lg ${textSafe}`}>{edu.degree}</h3>
                    <span className="text-xs font-bold text-neutral-400 uppercase tracking-wider whitespace-nowrap">{edu.startDate} — {edu.endDate}</span>
                  </div>
                  <div className={`text-brand-600 font-bold text-sm uppercase tracking-wide ${textSafe}`}>{edu.school}</div>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>

      <div className="md:col-span-4 space-y-10">
        {skills.length > 0 && (
          <div>
            <h2 className="text-xs font-black text-brand-600 mb-6 uppercase tracking-[0.2em]">{t.skills}</h2>
            <div className="flex flex-wrap gap-2">
              {skills.map((skill, i) => (
                <span key={i} className={`px-3 py-1.5 bg-neutral-900 text-white rounded-lg text-xs font-bold uppercase tracking-wider ${textSafe}`}>
                  {skill}
                </span>
              ))}
            </div>
          </div>
        )}

        {languages.length > 0 && (
          <div>
            <h2 className="text-xs font-black text-brand-600 mb-6 uppercase tracking-[0.2em]">{t.languages}</h2>
            <div className="space-y-4">
              {languages.map(lang => (
                <div key={lang.id}>
                  <div className="flex justify-between text-sm mb-1">
                    <span className={`font-bold text-neutral-800 ${textSafe}`}>{lang.language}</span>
                    <span className="text-neutral-400 text-xs font-bold uppercase">{proficiencyLabel(lang.proficiency, t)}</span>
                  </div>
                  <div className="w-full bg-neutral-100 h-1 rounded-full overflow-hidden">
                    <div
                      className="bg-brand-500 h-full"
                      style={{ width: lang.proficiency === 'Native' ? '100%' : lang.proficiency === 'Fluent' ? '85%' : lang.proficiency === 'Intermediate' ? '60%' : '30%' }}
                    />
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {hobbies.length > 0 && (
          <div>
            <h2 className="text-xs font-black text-brand-600 mb-6 uppercase tracking-[0.2em]">{t.hobbies}</h2>
            <div className="flex flex-wrap gap-2">
              {hobbies.map((hobby, i) => (
                <span key={i} className={`px-3 py-1.5 bg-neutral-100 text-neutral-700 rounded-lg text-xs font-bold uppercase tracking-wider ${textSafe}`}>
                  {hobby}
                </span>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  </div>
);

export const CreativeTemplate = ({ personalInfo, summary, education, experience, skills, hobbies, languages, t, resumeRef }: TemplateProps) => (
  <div ref={resumeRef} className={`${templateRoot} flex flex-col md:flex-row font-sans overflow-hidden`}>
    <div className="w-full md:w-64 bg-neutral-900 text-white p-8 md:p-10 flex flex-col gap-10 shrink-0">
      <div className="space-y-6">
        {personalInfo.photo && (
          <img src={personalInfo.photo} alt="Profile" className="w-full max-w-[200px] aspect-square rounded-3xl object-cover border-4 border-brand-400/30 shadow-2xl mb-8" />
        )}
        <h1 className={`text-3xl font-black uppercase leading-none tracking-tighter ${textSafe}`}>
          {personalInfo.firstName}<br />
          <span className="text-brand-400">{personalInfo.lastName}</span>
        </h1>
        <div className={`space-y-2 text-xs font-medium text-neutral-400 ${textSafe}`}>
          <p>{personalInfo.email}</p>
          <p>{personalInfo.phone}</p>
          <p>{personalInfo.location}</p>
        </div>
      </div>

      {skills.length > 0 && (
        <div>
          <h2 className="text-[10px] font-black uppercase tracking-[0.3em] text-brand-400 mb-6">{t.skills}</h2>
          <div className="flex flex-col gap-3">
            {skills.map((skill, i) => (
              <div key={i} className={`text-sm font-bold border-b border-neutral-800 pb-2 ${textSafe}`}>{skill}</div>
            ))}
          </div>
        </div>
      )}

      {languages.length > 0 && (
        <div>
          <h2 className="text-[10px] font-black uppercase tracking-[0.3em] text-brand-400 mb-6">{t.languages}</h2>
          <div className="space-y-4">
            {languages.map(lang => (
              <div key={lang.id} className="text-sm">
                <div className={`font-bold ${textSafe}`}>{lang.language}</div>
                <div className="text-[10px] uppercase text-neutral-500">{proficiencyLabel(lang.proficiency, t)}</div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>

    <div className="flex-1 p-8 md:p-12 space-y-10 bg-neutral-50 min-w-0">
      {summary && (
        <div>
          <h2 className="text-xs font-black uppercase tracking-[0.2em] text-neutral-400 mb-4">{t.summary}</h2>
          <p className={`text-lg font-light leading-relaxed text-neutral-800 italic ${textSafe}`}>"{summary}"</p>
        </div>
      )}

      {experience.length > 0 && (
        <div>
          <h2 className="text-xs font-black uppercase tracking-[0.2em] text-neutral-400 mb-6">{t.experience}</h2>
          <div className="space-y-8">
            {experience.map(exp => (
              <div key={exp.id} className="group">
                <div className="flex flex-wrap justify-between items-baseline mb-2 gap-2">
                  <h3 className={`text-xl font-black text-neutral-900 ${textSafe}`}>{exp.position}</h3>
                  <span className="text-xs font-bold text-neutral-400 whitespace-nowrap">{exp.startDate} — {exp.endDate}</span>
                </div>
                <div className={`text-sm font-bold text-neutral-500 uppercase tracking-widest mb-4 ${textSafe}`}>{exp.company}</div>
                <p className={`text-neutral-600 leading-relaxed ${textSafe}`}>{exp.description}</p>
              </div>
            ))}
          </div>
        </div>
      )}

      {education.length > 0 && (
        <div>
          <h2 className="text-xs font-black uppercase tracking-[0.2em] text-neutral-400 mb-6">{t.education}</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {education.map(edu => (
              <div key={edu.id}>
                <div className="text-xs font-bold text-brand-600 mb-1">{edu.startDate} — {edu.endDate}</div>
                <h3 className={`font-black text-neutral-900 text-lg leading-tight mb-1 ${textSafe}`}>{edu.degree}</h3>
                <div className={`text-sm font-bold text-neutral-500 ${textSafe}`}>{edu.school}</div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  </div>
);

export const MinimalTemplate = ({ personalInfo, summary, education, experience, skills, hobbies, languages, t, resumeRef }: TemplateProps) => (
  <div ref={resumeRef} className={`${templateRoot} p-10 md:p-16 font-sans text-neutral-900 flex flex-col items-center`}>
    <div className="text-center mb-16 w-full">
      {personalInfo.photo && (
        <img src={personalInfo.photo} alt="Profile" className="w-28 h-28 rounded-full object-cover mb-8 mx-auto" />
      )}
      <h1 className={`text-4xl md:text-5xl font-black tracking-tighter mb-4 ${textSafe}`}>{personalInfo.firstName} {personalInfo.lastName}</h1>
      <div className={`flex flex-wrap gap-2 text-sm font-medium text-neutral-400 justify-center ${textSafe}`}>
        <span>{personalInfo.email}</span>
        <span>•</span>
        <span>{personalInfo.phone}</span>
        <span>•</span>
        <span>{personalInfo.location}</span>
      </div>
    </div>

    <div className="w-full max-w-2xl space-y-12">
      {summary && (
        <div className="text-center">
          <p className={`text-base leading-relaxed text-neutral-600 ${textSafe}`}>{summary}</p>
        </div>
      )}

      {experience.length > 0 && (
        <div className="space-y-8">
          <h2 className="text-center text-[10px] font-black uppercase tracking-[0.4em] text-neutral-300">{t.experience}</h2>
          <div className="space-y-10">
            {experience.map(exp => (
              <div key={exp.id} className="text-center">
                <h3 className={`text-xl font-bold mb-1 ${textSafe}`}>{exp.position}</h3>
                <div className="text-sm font-medium text-neutral-400 mb-4">{exp.company} | {exp.startDate} — {exp.endDate}</div>
                <p className={`text-neutral-600 leading-relaxed ${textSafe}`}>{exp.description}</p>
              </div>
            ))}
          </div>
        </div>
      )}

      {education.length > 0 && (
        <div className="space-y-8">
          <h2 className="text-center text-[10px] font-black uppercase tracking-[0.4em] text-neutral-300">{t.education}</h2>
          <div className="space-y-6">
            {education.map(edu => (
              <div key={edu.id} className="text-center">
                <h3 className={`text-lg font-bold mb-1 ${textSafe}`}>{edu.degree}</h3>
                <div className={`text-sm font-medium text-neutral-400 ${textSafe}`}>{edu.school} | {edu.startDate} — {edu.endDate}</div>
              </div>
            ))}
          </div>
        </div>
      )}

      <div className="grid grid-cols-1 md:grid-cols-2 gap-8 pt-8 border-t border-neutral-100">
        {skills.length > 0 && (
          <div className="text-right">
            <h2 className="text-[10px] font-black uppercase tracking-[0.4em] text-neutral-300 mb-4">{t.skills}</h2>
            <div className="flex flex-wrap justify-end gap-2">
              {skills.map((skill, i) => (
                <span key={i} className={`text-sm font-medium ${textSafe}`}>{skill}</span>
              ))}
            </div>
          </div>
        )}
        {languages.length > 0 && (
          <div className="text-left">
            <h2 className="text-[10px] font-black uppercase tracking-[0.4em] text-neutral-300 mb-4">{t.languages}</h2>
            <div className="space-y-1">
              {languages.map(lang => (
                <div key={lang.id} className={`text-sm font-medium ${textSafe}`}>
                  {lang.language} <span className="text-neutral-400 font-normal">({proficiencyLabel(lang.proficiency, t)})</span>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  </div>
);

export const ProfessionalTemplate = ({ personalInfo, summary, education, experience, skills, hobbies, languages, t, resumeRef }: TemplateProps) => (
  <div ref={resumeRef} className={`${templateRoot} p-10 md:p-14 font-sans text-neutral-800`}>
    <div className="flex flex-wrap justify-between items-start mb-10 gap-4">
      <div className="flex gap-6 items-start min-w-0 flex-1">
        {personalInfo.photo && (
          <img src={personalInfo.photo} alt="Profile" className="w-20 h-20 rounded-xl object-cover border border-neutral-200 shrink-0" />
        )}
        <div className="min-w-0">
          <h1 className={`text-3xl font-bold text-neutral-900 mb-2 ${textSafe}`}>{personalInfo.firstName} {personalInfo.lastName}</h1>
          <div className={`text-brand-600 font-bold uppercase tracking-widest text-sm ${textSafe}`}>
            {experience[0]?.position || t.professional || 'Professional'}
          </div>
        </div>
      </div>
      <div className={`text-right text-sm text-neutral-500 space-y-1 ${textSafe}`}>
        <p>{personalInfo.email}</p>
        <p>{personalInfo.phone}</p>
        <p>{personalInfo.location}</p>
      </div>
    </div>

    <div className="grid grid-cols-1 md:grid-cols-12 gap-8">
      <div className="md:col-span-4 space-y-8">
        {summary && (
          <div>
            <h2 className="text-sm font-bold uppercase tracking-widest border-b-2 border-neutral-900 pb-2 mb-4">{t.summary}</h2>
            <p className={`text-sm leading-relaxed text-neutral-600 ${textSafe}`}>{summary}</p>
          </div>
        )}

        {skills.length > 0 && (
          <div>
            <h2 className="text-sm font-bold uppercase tracking-widest border-b-2 border-neutral-900 pb-2 mb-4">{t.skills}</h2>
            <div className="space-y-2">
              {skills.map((skill, i) => (
                <div key={i} className={`text-sm flex items-center gap-2 ${textSafe}`}>
                  <div className="w-1.5 h-1.5 bg-brand-500 rounded-full shrink-0" />
                  {skill}
                </div>
              ))}
            </div>
          </div>
        )}

        {languages.length > 0 && (
          <div>
            <h2 className="text-sm font-bold uppercase tracking-widest border-b-2 border-neutral-900 pb-2 mb-4">{t.languages}</h2>
            <div className="space-y-3">
              {languages.map(lang => (
                <div key={lang.id} className="text-sm">
                  <div className={`font-bold ${textSafe}`}>{lang.language}</div>
                  <div className="text-neutral-400 text-xs">{proficiencyLabel(lang.proficiency, t)}</div>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>

      <div className="md:col-span-8 space-y-8">
        {experience.length > 0 && (
          <div>
            <h2 className="text-sm font-bold uppercase tracking-widest border-b-2 border-neutral-900 pb-2 mb-6">{t.experience}</h2>
            <div className="space-y-6">
              {experience.map(exp => (
                <div key={exp.id}>
                  <div className="flex flex-wrap justify-between font-bold text-neutral-900 mb-1 gap-2">
                    <span className={textSafe}>{exp.position}</span>
                    <span className="text-sm text-neutral-400 whitespace-nowrap">{exp.startDate} — {exp.endDate}</span>
                  </div>
                  <div className={`text-brand-600 text-sm font-bold mb-3 ${textSafe}`}>{exp.company}</div>
                  <p className={`text-sm text-neutral-600 leading-relaxed ${textSafe}`}>{exp.description}</p>
                </div>
              ))}
            </div>
          </div>
        )}

        {education.length > 0 && (
          <div>
            <h2 className="text-sm font-bold uppercase tracking-widest border-b-2 border-neutral-900 pb-2 mb-6">{t.education}</h2>
            <div className="space-y-4">
              {education.map(edu => (
                <div key={edu.id}>
                  <div className="flex flex-wrap justify-between font-bold text-neutral-900 mb-1 gap-2">
                    <span className={textSafe}>{edu.degree}</span>
                    <span className="text-sm text-neutral-400 whitespace-nowrap">{edu.startDate} — {edu.endDate}</span>
                  </div>
                  <div className={`text-neutral-500 text-sm ${textSafe}`}>{edu.school}</div>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  </div>
);

export const AtsTemplate = ({ personalInfo, summary, education, experience, skills, hobbies, languages, t, resumeRef }: TemplateProps) => (
  <div ref={resumeRef} className={`${templateRoot} p-10 md:p-14 font-serif text-black`}>
    <div className={`text-center border-b-2 border-black pb-6 mb-8 flex flex-col items-center ${textSafe}`}>
      {personalInfo.photo && (
        <img src={personalInfo.photo} alt="Profile" className="w-20 h-20 rounded-full object-cover mb-4 border border-neutral-200" />
      )}
      <h1 className={`text-3xl font-bold mb-3 uppercase tracking-tight ${textSafe}`}>{personalInfo.firstName} {personalInfo.lastName}</h1>
      <div className={`text-sm font-medium tracking-wide ${textSafe}`}>
        {personalInfo.location} • {personalInfo.phone} • {personalInfo.email} {personalInfo.linkedin && ` • ${personalInfo.linkedin}`}
      </div>
    </div>

    {summary && (
      <div className="mb-8">
        <h2 className="text-lg font-bold border-b border-black uppercase mb-3 tracking-widest">{t.summary}</h2>
        <p className={`text-sm leading-relaxed text-justify ${textSafe}`}>{summary}</p>
      </div>
    )}

    {experience.length > 0 && (
      <div className="mb-8">
        <h2 className="text-lg font-bold border-b border-black uppercase mb-4 tracking-widest">{t.experience}</h2>
        <div className="space-y-6">
          {experience.map(exp => (
            <div key={exp.id}>
              <div className="flex flex-wrap justify-between font-bold text-sm mb-1 gap-2">
                <span className={`uppercase ${textSafe}`}>{exp.position}</span>
                <span className="whitespace-nowrap">{exp.startDate} — {exp.endDate}</span>
              </div>
              <div className={`italic text-sm mb-2 ${textSafe}`}>{exp.company}</div>
              <p className={`text-sm leading-relaxed text-justify ${textSafe}`}>{exp.description}</p>
            </div>
          ))}
        </div>
      </div>
    )}

    {education.length > 0 && (
      <div className="mb-8">
        <h2 className="text-lg font-bold border-b border-black uppercase mb-4 tracking-widest">{t.education}</h2>
        <div className="space-y-4">
          {education.map(edu => (
            <div key={edu.id} className="flex flex-wrap justify-between text-sm gap-2">
              <div className={`min-w-0 ${textSafe}`}>
                <span className="font-bold uppercase">{edu.school}</span> — <span className="italic">{edu.degree}</span>
              </div>
              <span className="font-bold whitespace-nowrap">{edu.startDate} — {edu.endDate}</span>
            </div>
          ))}
        </div>
      </div>
    )}

    <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
      {skills.length > 0 && (
        <div>
          <h2 className="text-lg font-bold border-b border-black uppercase mb-3 tracking-widest">{t.skills}</h2>
          <p className={`text-sm leading-relaxed ${textSafe}`}>{skills.join(', ')}</p>
        </div>
      )}

      {languages.length > 0 && (
        <div>
          <h2 className="text-lg font-bold border-b border-black uppercase mb-3 tracking-widest">{t.languages}</h2>
          <p className={`text-sm leading-relaxed ${textSafe}`}>
            {languages.map(l => `${l.language} (${proficiencyLabel(l.proficiency, t)})`).join(', ')}
          </p>
        </div>
      )}
    </div>
  </div>
);

export const BoldTemplate = ({ personalInfo, summary, education, experience, skills, hobbies, languages, t, resumeRef }: TemplateProps) => (
  <div ref={resumeRef} className={`${templateRoot} font-sans text-neutral-900`}>
    <div className="bg-neutral-900 text-white p-8 md:p-12 flex flex-wrap justify-between items-center gap-4">
      <div className="min-w-0 flex-1">
        <h1 className={`text-3xl md:text-5xl font-black uppercase tracking-tighter mb-4 ${textSafe}`}>{personalInfo.firstName} {personalInfo.lastName}</h1>
        <div className={`flex flex-wrap gap-4 text-sm font-bold text-brand-400 uppercase tracking-widest ${textSafe}`}>
          <span>{personalInfo.email}</span>
          <span>{personalInfo.phone}</span>
          <span>{personalInfo.location}</span>
        </div>
      </div>
      {personalInfo.photo && (
        <img src={personalInfo.photo} alt="Profile" className="w-32 h-32 object-cover border-8 border-brand-500 shadow-2xl" />
      )}
    </div>
    <div className="p-8 md:p-12 space-y-10">
      {summary && (
        <div>
          <h2 className="text-xl font-black uppercase mb-4 border-l-8 border-brand-500 pl-4">{t.summary}</h2>
          <p className={`text-lg leading-relaxed ${textSafe}`}>{summary}</p>
        </div>
      )}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-10">
        <div className="space-y-10">
          {experience.length > 0 && (
            <div>
              <h2 className="text-xl font-black uppercase mb-6 border-l-8 border-brand-500 pl-4">{t.experience}</h2>
              <div className="space-y-6">
                {experience.map(exp => (
                  <div key={exp.id}>
                    <h3 className={`text-lg font-bold ${textSafe}`}>{exp.position}</h3>
                    <div className={`text-brand-600 font-bold mb-2 text-sm ${textSafe}`}>{exp.company} | {exp.startDate} — {exp.endDate}</div>
                    <p className={`text-neutral-600 ${textSafe}`}>{exp.description}</p>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
        <div className="space-y-10">
          {education.length > 0 && (
            <div>
              <h2 className="text-xl font-black uppercase mb-6 border-l-8 border-brand-500 pl-4">{t.education}</h2>
              <div className="space-y-4">
                {education.map(edu => (
                  <div key={edu.id}>
                    <h3 className={`text-lg font-bold ${textSafe}`}>{edu.degree}</h3>
                    <div className={`text-brand-600 font-bold text-sm ${textSafe}`}>{edu.school} | {edu.startDate} — {edu.endDate}</div>
                  </div>
                ))}
              </div>
            </div>
          )}
          {skills.length > 0 && (
            <div>
              <h2 className="text-xl font-black uppercase mb-6 border-l-8 border-brand-500 pl-4">{t.skills}</h2>
              <div className="flex flex-wrap gap-2">
                {skills.map((skill, i) => (
                  <span key={i} className={`px-3 py-2 bg-neutral-100 font-bold rounded-lg text-sm ${textSafe}`}>{skill}</span>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  </div>
);

export const ElegantTemplate = ({ personalInfo, summary, education, experience, skills, hobbies, languages, t, resumeRef }: TemplateProps) => (
  <div ref={resumeRef} className={`${templateRoot} p-10 md:p-16 font-serif text-neutral-800 bg-[#fdfcfb]`}>
    <div className="text-center mb-14 border-b border-neutral-200 pb-10">
      {personalInfo.photo && (
        <img src={personalInfo.photo} alt="Profile" className="w-24 h-24 rounded-full object-cover mx-auto mb-6 border border-neutral-200 p-1 bg-white" />
      )}
      <h1 className={`text-4xl font-light italic mb-4 ${textSafe}`}>{personalInfo.firstName} {personalInfo.lastName}</h1>
      <div className={`text-sm tracking-[0.3em] uppercase text-neutral-400 ${textSafe}`}>
        {personalInfo.location} • {personalInfo.phone} • {personalInfo.email}
      </div>
    </div>
    <div className="max-w-2xl mx-auto space-y-14">
      {summary && (
        <div className={`text-center italic text-lg text-neutral-600 leading-relaxed ${textSafe}`}>
          {summary}
        </div>
      )}
      {experience.length > 0 && (
        <div className="space-y-8">
          <h2 className="text-center text-xs font-bold uppercase tracking-[0.5em] text-neutral-300 mb-8">{t.experience}</h2>
          {experience.map(exp => (
            <div key={exp.id} className="text-center">
              <h3 className={`text-xl font-medium mb-1 ${textSafe}`}>{exp.position}</h3>
              <div className="text-sm italic text-neutral-400 mb-4">{exp.company} / {exp.startDate} — {exp.endDate}</div>
              <p className={`text-neutral-600 leading-relaxed ${textSafe}`}>{exp.description}</p>
            </div>
          ))}
        </div>
      )}
      {education.length > 0 && (
        <div className="space-y-8">
          <h2 className="text-center text-xs font-bold uppercase tracking-[0.5em] text-neutral-300 mb-8">{t.education}</h2>
          {education.map(edu => (
            <div key={edu.id} className="text-center">
              <h3 className={`text-lg font-medium mb-1 ${textSafe}`}>{edu.degree}</h3>
              <div className={`text-sm italic text-neutral-400 ${textSafe}`}>{edu.school} / {edu.startDate} — {edu.endDate}</div>
            </div>
          ))}
        </div>
      )}
    </div>
  </div>
);

export const CompactTemplate = ({ personalInfo, summary, education, experience, skills, hobbies, languages, t, resumeRef }: TemplateProps) => (
  <div ref={resumeRef} className={`${templateRoot} p-8 md:p-10 font-sans text-neutral-800`}>
    <div className="flex flex-wrap justify-between items-end border-b-2 border-neutral-100 pb-6 mb-6 gap-4">
      <div className="flex gap-4 items-center min-w-0">
        {personalInfo.photo && (
          <img src={personalInfo.photo} alt="Profile" className="w-14 h-14 rounded-lg object-cover shrink-0" />
        )}
        <div className="min-w-0">
          <h1 className={`text-2xl font-bold text-neutral-900 ${textSafe}`}>{personalInfo.firstName} {personalInfo.lastName}</h1>
          <p className={`text-sm text-neutral-500 ${textSafe}`}>{personalInfo.location} | {personalInfo.phone} | {personalInfo.email}</p>
        </div>
      </div>
      <div className="flex flex-wrap gap-2">
        {skills.slice(0, 3).map((skill, i) => (
          <span key={i} className={`text-[10px] font-bold uppercase bg-neutral-100 px-2 py-1 rounded ${textSafe}`}>{skill}</span>
        ))}
      </div>
    </div>
    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
      <div className="space-y-6">
        {summary && (
          <div>
            <h2 className="text-xs font-black uppercase tracking-widest text-brand-600 mb-2">{t.summary}</h2>
            <p className={`text-xs leading-relaxed ${textSafe}`}>{summary}</p>
          </div>
        )}
        {experience.length > 0 && (
          <div>
            <h2 className="text-xs font-black uppercase tracking-widest text-brand-600 mb-4">{t.experience}</h2>
            <div className="space-y-4">
              {experience.map(exp => (
                <div key={exp.id}>
                  <h3 className={`text-sm font-bold ${textSafe}`}>{exp.position}</h3>
                  <div className={`text-[10px] font-bold text-neutral-400 mb-1 ${textSafe}`}>{exp.company} | {exp.startDate} — {exp.endDate}</div>
                  <p className={`text-[11px] leading-tight text-neutral-600 ${textSafe}`}>{exp.description}</p>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
      <div className="space-y-6">
        {education.length > 0 && (
          <div>
            <h2 className="text-xs font-black uppercase tracking-widest text-brand-600 mb-4">{t.education}</h2>
            <div className="space-y-3">
              {education.map(edu => (
                <div key={edu.id}>
                  <h3 className={`text-sm font-bold ${textSafe}`}>{edu.degree}</h3>
                  <div className={`text-[10px] font-bold text-neutral-400 ${textSafe}`}>{edu.school} | {edu.startDate} — {edu.endDate}</div>
                </div>
              ))}
            </div>
          </div>
        )}
        {skills.length > 0 && (
          <div>
            <h2 className="text-xs font-black uppercase tracking-widest text-brand-600 mb-2">{t.skills}</h2>
            <div className="flex flex-wrap gap-1">
              {skills.map((skill, i) => (
                <span key={i} className={`text-[10px] border border-neutral-200 px-2 py-0.5 rounded ${textSafe}`}>{skill}</span>
              ))}
            </div>
          </div>
        )}
        {languages.length > 0 && (
          <div>
            <h2 className="text-xs font-black uppercase tracking-widest text-brand-600 mb-2">{t.languages}</h2>
            <div className="space-y-1">
              {languages.map(lang => (
                <div key={lang.id} className="text-[11px] flex justify-between">
                  <span className={`font-bold ${textSafe}`}>{lang.language}</span>
                  <span className="text-neutral-400">{proficiencyLabel(lang.proficiency, t)}</span>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  </div>
);

export const SidebarLightTemplate = ({ personalInfo, summary, education, experience, skills, hobbies, languages, t, resumeRef }: TemplateProps) => (
  <div ref={resumeRef} className={`${templateRoot} flex flex-col md:flex-row font-sans`}>
    <div className="w-full md:w-56 bg-neutral-50 p-8 border-r border-neutral-100 flex flex-col gap-8 shrink-0">
      <div>
        {personalInfo.photo && (
          <img src={personalInfo.photo} alt="Profile" className="w-full max-w-[180px] aspect-square rounded-2xl object-cover mb-6 shadow-sm" />
        )}
        <h1 className={`text-2xl font-black text-neutral-900 mb-1 ${textSafe}`}>{personalInfo.firstName}</h1>
        <h1 className={`text-2xl font-light text-neutral-500 mb-4 ${textSafe}`}>{personalInfo.lastName}</h1>
        <div className={`space-y-1 text-[11px] font-bold text-neutral-400 uppercase tracking-widest ${textSafe}`}>
          <p>{personalInfo.email}</p>
          <p>{personalInfo.phone}</p>
          <p>{personalInfo.location}</p>
        </div>
      </div>
      {skills.length > 0 && (
        <div>
          <h2 className="text-[10px] font-black uppercase tracking-[0.2em] text-brand-600 mb-3">{t.skills}</h2>
          <div className="flex flex-col gap-1.5">
            {skills.map((skill, i) => (
              <div key={i} className={`text-xs font-medium text-neutral-600 ${textSafe}`}>{skill}</div>
            ))}
          </div>
        </div>
      )}
      {languages.length > 0 && (
        <div>
          <h2 className="text-[10px] font-black uppercase tracking-[0.2em] text-brand-600 mb-3">{t.languages}</h2>
          <div className="space-y-2">
            {languages.map(lang => (
              <div key={lang.id}>
                <div className={`text-xs font-bold text-neutral-800 ${textSafe}`}>{lang.language}</div>
                <div className="text-[10px] text-neutral-400 uppercase">{proficiencyLabel(lang.proficiency, t)}</div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
    <div className="flex-1 p-8 md:p-12 space-y-10 min-w-0">
      {summary && (
        <div>
          <h2 className="text-xs font-black uppercase tracking-[0.2em] text-neutral-300 mb-4">{t.summary}</h2>
          <p className={`text-base leading-relaxed text-neutral-700 ${textSafe}`}>{summary}</p>
        </div>
      )}
      {experience.length > 0 && (
        <div>
          <h2 className="text-xs font-black uppercase tracking-[0.2em] text-neutral-300 mb-6">{t.experience}</h2>
          <div className="space-y-8">
            {experience.map(exp => (
              <div key={exp.id}>
                <div className="flex flex-wrap justify-between items-baseline mb-1 gap-2">
                  <h3 className={`text-lg font-bold text-neutral-900 ${textSafe}`}>{exp.position}</h3>
                  <span className="text-xs font-bold text-neutral-400 whitespace-nowrap">{exp.startDate} — {exp.endDate}</span>
                </div>
                <div className={`text-sm font-bold text-brand-600 mb-3 ${textSafe}`}>{exp.company}</div>
                <p className={`text-sm text-neutral-600 leading-relaxed ${textSafe}`}>{exp.description}</p>
              </div>
            ))}
          </div>
        </div>
      )}
      {education.length > 0 && (
        <div>
          <h2 className="text-xs font-black uppercase tracking-[0.2em] text-neutral-300 mb-6">{t.education}</h2>
          <div className="space-y-4">
            {education.map(edu => (
              <div key={edu.id}>
                <div className="flex flex-wrap justify-between items-baseline mb-1 gap-2">
                  <h3 className={`text-base font-bold text-neutral-900 ${textSafe}`}>{edu.degree}</h3>
                  <span className="text-xs font-bold text-neutral-400 whitespace-nowrap">{edu.startDate} — {edu.endDate}</span>
                </div>
                <div className={`text-sm text-neutral-500 ${textSafe}`}>{edu.school}</div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  </div>
);

export const HighContrastTemplate = ({ personalInfo, summary, education, experience, skills, hobbies, languages, t, resumeRef }: TemplateProps) => (
  <div ref={resumeRef} className={`${templateRoot} p-8 md:p-12 font-mono text-black border-[8px] border-black`}>
    <div className="border-b-8 border-black pb-6 mb-10 flex flex-wrap justify-between items-end gap-4">
      <div className="min-w-0 flex-1">
        <h1 className={`text-3xl md:text-5xl font-black uppercase mb-4 tracking-tighter ${textSafe}`}>{personalInfo.firstName} {personalInfo.lastName}</h1>
        <div className={`text-sm font-bold uppercase tracking-widest ${textSafe}`}>
          {personalInfo.email} // {personalInfo.phone} // {personalInfo.location}
        </div>
      </div>
      {personalInfo.photo && (
        <img src={personalInfo.photo} alt="Profile" className="w-28 h-28 object-cover border-4 border-black grayscale contrast-125 shrink-0" />
      )}
    </div>

    <div className="space-y-10">
      {summary && (
        <div>
          <h2 className="text-lg font-black uppercase bg-black text-white px-4 py-1 mb-4 inline-block">{t.summary}</h2>
          <p className={`text-base leading-tight ${textSafe}`}>{summary}</p>
        </div>
      )}

      <div className="grid grid-cols-1 md:grid-cols-12 gap-10">
        <div className="md:col-span-8 space-y-10">
          {experience.length > 0 && (
            <div>
              <h2 className="text-lg font-black uppercase bg-black text-white px-4 py-1 mb-6 inline-block">{t.experience}</h2>
              <div className="space-y-6">
                {experience.map(exp => (
                  <div key={exp.id} className="border-b-2 border-black pb-4">
                    <div className="flex flex-wrap justify-between font-black text-lg mb-1 gap-2">
                      <span className={textSafe}>{exp.position}</span>
                      <span className="whitespace-nowrap">{exp.startDate} &gt; {exp.endDate}</span>
                    </div>
                    <div className={`font-bold mb-3 uppercase tracking-widest underline ${textSafe}`}>{exp.company}</div>
                    <p className={`leading-tight ${textSafe}`}>{exp.description}</p>
                  </div>
                ))}
              </div>
            </div>
          )}

          {education.length > 0 && (
            <div>
              <h2 className="text-lg font-black uppercase bg-black text-white px-4 py-1 mb-6 inline-block">{t.education}</h2>
              <div className="space-y-4">
                {education.map(edu => (
                  <div key={edu.id}>
                    <div className={`font-black text-lg ${textSafe}`}>{edu.degree}</div>
                    <div className={`text-base font-bold uppercase ${textSafe}`}>{edu.school} // {edu.startDate} &gt; {edu.endDate}</div>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>

        <div className="md:col-span-4 space-y-10">
          {skills.length > 0 && (
            <div>
              <h2 className="text-lg font-black uppercase bg-black text-white px-4 py-1 mb-6 inline-block">{t.skills}</h2>
              <div className="flex flex-wrap gap-x-4 gap-y-2">
                {skills.map((skill, i) => (
                  <span key={i} className={`font-bold uppercase underline ${textSafe}`}>{skill}</span>
                ))}
              </div>
            </div>
          )}

          {languages.length > 0 && (
            <div>
              <h2 className="text-lg font-black uppercase bg-black text-white px-4 py-1 mb-6 inline-block">{t.languages}</h2>
              <div className="space-y-4">
                {languages.map(lang => (
                  <div key={lang.id}>
                    <div className={`font-black uppercase ${textSafe}`}>{lang.language}</div>
                    <div className="text-sm font-bold opacity-60 uppercase">{proficiencyLabel(lang.proficiency, t)}</div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {hobbies.length > 0 && (
            <div>
              <h2 className="text-lg font-black uppercase bg-black text-white px-4 py-1 mb-6 inline-block">{t.hobbies}</h2>
              <div className="flex flex-wrap gap-x-4 gap-y-2">
                {hobbies.map((hobby, i) => (
                  <span key={i} className={`font-bold uppercase ${textSafe}`}>{hobby}</span>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  </div>
);
