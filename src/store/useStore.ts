import { create } from 'zustand';

export type Language = 'en' | 'fi';
export type AgeGroup = 'under18' | 'over18';

export interface PersonalInfo {
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  location: string;
  linkedin?: string;
  photo?: string;
}

export interface Education {
  id: string;
  school: string;
  degree: string;
  startDate: string;
  endDate: string;
  description?: string;
}

export interface Experience {
  id: string;
  company: string;
  position: string;
  startDate: string;
  endDate: string;
  description: string;
}

export interface LanguageSkill {
  id: string;
  language: string;
  proficiency: string;
}

interface ResumeState {
  appLanguage: Language;
  resumeLanguage: Language;
  ageGroup: AgeGroup | null;
  personalInfo: PersonalInfo;
  summary: string;
  education: Education[];
  experience: Experience[];
  skills: string[];
  hobbies: string[];
  languages: LanguageSkill[];
  template: string;
  
  setAppLanguage: (lang: Language) => void;
  setResumeLanguage: (lang: Language) => void;
  setAgeGroup: (group: AgeGroup) => void;
  updatePersonalInfo: (info: Partial<PersonalInfo>) => void;
  setPhoto: (photo: string | undefined) => void;
  setSummary: (summary: string) => void;
  addEducation: (edu: Education) => void;
  updateEducation: (id: string, edu: Partial<Education>) => void;
  removeEducation: (id: string) => void;
  addExperience: (exp: Experience) => void;
  updateExperience: (id: string, exp: Partial<Experience>) => void;
  removeExperience: (id: string) => void;
  setSkills: (skills: string[]) => void;
  setHobbies: (hobbies: string[]) => void;
  addLanguage: (lang: LanguageSkill) => void;
  removeLanguage: (id: string) => void;
  setTemplate: (template: string) => void;
  reset: () => void;
}

const initialState = {
  appLanguage: 'en' as Language,
  resumeLanguage: 'en' as Language,
  ageGroup: null,
  personalInfo: {
    firstName: '',
    lastName: '',
    email: '',
    phone: '',
    location: '',
    photo: undefined,
  },
  summary: '',
  education: [],
  experience: [],
  skills: [],
  hobbies: [],
  languages: [],
  template: 'modern',
};

export const useStore = create<ResumeState>((set) => ({
  ...initialState,
  setAppLanguage: (lang) => set({ appLanguage: lang }),
  setResumeLanguage: (lang) => set({ resumeLanguage: lang }),
  setAgeGroup: (group) => set({ ageGroup: group }),
  updatePersonalInfo: (info) => set((state) => ({ personalInfo: { ...state.personalInfo, ...info } })),
  setPhoto: (photo) => set((state) => ({ personalInfo: { ...state.personalInfo, photo } })),
  setSummary: (summary) => set({ summary }),
  addEducation: (edu) => set((state) => ({ education: [...state.education, edu] })),
  updateEducation: (id, edu) => set((state) => ({
    education: state.education.map((e) => (e.id === id ? { ...e, ...edu } : e)),
  })),
  removeEducation: (id) => set((state) => ({ education: state.education.filter((e) => e.id !== id) })),
  addExperience: (exp) => set((state) => ({ experience: [...state.experience, exp] })),
  updateExperience: (id, exp) => set((state) => ({
    experience: state.experience.map((e) => (e.id === id ? { ...e, ...exp } : e)),
  })),
  removeExperience: (id) => set((state) => ({ experience: state.experience.filter((e) => e.id !== id) })),
  setSkills: (skills) => set({ skills }),
  setHobbies: (hobbies) => set({ hobbies }),
  addLanguage: (lang) => set((state) => ({ languages: [...state.languages, lang] })),
  removeLanguage: (id) => set((state) => ({ languages: state.languages.filter((l) => l.id !== id) })),
  setTemplate: (template) => set({ template }),
  reset: () => set(initialState),
}));
