import { create } from 'zustand';
import { persist } from 'zustand/middleware';

export type Language = 'en' | 'fi';
export type AgeGroup = 'under18' | 'over18';

export interface PersonalInfo {
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  location: string;
  linkedin?: string;
  github?: string;
  portfolio?: string;
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
  volunteering: Experience[];
  skills: string[];
  hobbies: string[];
  languages: LanguageSkill[];
  template: string;
  themeColor: string;

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
  addVolunteering: (exp: Experience) => void;
  updateVolunteering: (id: string, exp: Partial<Experience>) => void;
  removeVolunteering: (id: string) => void;
  moveEducation: (index: number, direction: 'up' | 'down') => void;
  moveExperience: (index: number, direction: 'up' | 'down') => void;
  moveVolunteering: (index: number, direction: 'up' | 'down') => void;
  setSkills: (skills: string[]) => void;
  setHobbies: (hobbies: string[]) => void;
  addLanguage: (lang: LanguageSkill) => void;
  removeLanguage: (id: string) => void;
  setTemplate: (template: string) => void;
  setThemeColor: (color: string) => void;
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
    github: '',
    portfolio: '',
    photo: undefined,
  },
  summary: '',
  education: [],
  experience: [],
  volunteering: [],
  skills: [],
  hobbies: [],
  languages: [],
  template: 'modern',
  themeColor: '#10b981', // Default emerald green
};

export const useStore = create<ResumeState>()(
  persist(
    (set) => ({
      ...initialState,
      setAppLanguage: (lang) => set({ appLanguage: lang, resumeLanguage: lang }),
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
      addVolunteering: (exp) => set((state) => ({ volunteering: [...state.volunteering, exp] })),
      updateVolunteering: (id, exp) => set((state) => ({
        volunteering: state.volunteering.map((e) => (e.id === id ? { ...e, ...exp } : e)),
      })),
      removeVolunteering: (id) => set((state) => ({ volunteering: state.volunteering.filter((e) => e.id !== id) })),

      moveEducation: (index, direction) => set((state) => {
        const arr = [...state.education];
        if (direction === 'up' && index > 0) {
          [arr[index - 1], arr[index]] = [arr[index], arr[index - 1]];
        } else if (direction === 'down' && index < arr.length - 1) {
          [arr[index + 1], arr[index]] = [arr[index], arr[index + 1]];
        }
        return { education: arr };
      }),
      moveExperience: (index, direction) => set((state) => {
        const arr = [...state.experience];
        if (direction === 'up' && index > 0) {
          [arr[index - 1], arr[index]] = [arr[index], arr[index - 1]];
        } else if (direction === 'down' && index < arr.length - 1) {
          [arr[index + 1], arr[index]] = [arr[index], arr[index + 1]];
        }
        return { experience: arr };
      }),
      moveVolunteering: (index, direction) => set((state) => {
        const arr = [...state.volunteering];
        if (direction === 'up' && index > 0) {
          [arr[index - 1], arr[index]] = [arr[index], arr[index - 1]];
        } else if (direction === 'down' && index < arr.length - 1) {
          [arr[index + 1], arr[index]] = [arr[index], arr[index + 1]];
        }
        return { volunteering: arr };
      }),

      setSkills: (skills) => set({ skills }),
      setHobbies: (hobbies) => set({ hobbies }),
      addLanguage: (lang) => set((state) => ({ languages: [...state.languages, lang] })),
      removeLanguage: (id) => set((state) => ({ languages: state.languages.filter((l) => l.id !== id) })),
      setTemplate: (template) => set({ template }),
      setThemeColor: (themeColor) => set({ themeColor }),
      reset: () => set(initialState),
    }),
    {
      name: 'youth-resume-storage', // Unique name for local storage
    }
  )
);
