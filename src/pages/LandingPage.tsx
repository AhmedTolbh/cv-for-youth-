import React from 'react';
import { useNavigate } from 'react-router-dom';
import { useStore } from '../store/useStore';
import { translations } from '../i18n';
import Layout from '../components/Layout';
import { ArrowRight, UserCircle, Shield, Globe, Sparkles } from 'lucide-react';
import Logo from '../photo/Helsinki_logo.png';

export default function LandingPage() {
    const navigate = useNavigate();
    const { appLanguage, setAgeGroup } = useStore();
    const t = translations[appLanguage];

    const handleStart = (group: 'under18' | 'over18') => {
        setAgeGroup(group);
        navigate('/builder');
    };

    return (
        <Layout>
            <div className="flex flex-col items-center text-center max-w-4xl mx-auto space-y-12">
                <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-700">
                    <div className="flex justify-center mb-8">
                        <img src={Logo} alt="Helsinki Logo" className="h-32 w-auto" />
                    </div>
                    <h1 className="h1 leading-tight">
                        {t.welcome}
                    </h1>
                    <p className="text-xl text-slate-500">
                        {t.subtitle}
                    </p>
                </div>

                <div className="grid md:grid-cols-2 gap-8 w-full mt-8 animate-in fade-in slide-in-from-bottom-8 duration-700 delay-200">
                    <button
                        onClick={() => handleStart('under18')}
                        className="group card hover:scale-[1.02] hover:border-slate-300 hover:shadow-lg text-left space-y-4"
                    >
                        <div className="w-12 h-12 bg-blue-50 rounded-xl flex items-center justify-center group-hover:bg-blue-100 transition-colors">
                            <UserCircle className="text-blue-600" size={28} />
                        </div>
                        <div>
                            <h3 className="text-2xl font-bold text-slate-900 mb-2">{t.under18.split(' ').slice(0, 2).join(' ')}</h3>
                            <p className="text-slate-500">{t.under18}</p>
                        </div>
                        <div className="flex items-center gap-2 text-brand-primary font-semibold">
                            {t.start} <ArrowRight size={18} className="group-hover:translate-x-1 transition-transform" />
                        </div>
                    </button>

                    <button
                        onClick={() => handleStart('over18')}
                        className="group card hover:scale-[1.02] hover:border-slate-300 hover:shadow-lg text-left space-y-4"
                    >
                        <div className="w-12 h-12 bg-indigo-50 rounded-xl flex items-center justify-center group-hover:bg-indigo-100 transition-colors">
                            <Sparkles className="text-indigo-600" size={28} />
                        </div>
                        <div>
                            <h3 className="text-2xl font-bold text-slate-900 mb-2">{t.over18.split(' ').slice(0, 3).join(' ')}</h3>
                            <p className="text-slate-500">{t.over18}</p>
                        </div>
                        <div className="flex items-center gap-2 text-brand-primary font-semibold">
                            {t.start} <ArrowRight size={18} className="group-hover:translate-x-1 transition-transform" />
                        </div>
                    </button>
                </div>

                <div className="mt-20 pt-20 border-t border-slate-200 w-full grid grid-cols-1 md:grid-cols-3 gap-8 text-slate-500 text-sm">
                    <div className="space-y-2">
                        <Shield size={20} className="mb-2 text-emerald-600" />
                        <h4 className="font-bold text-slate-700 uppercase tracking-widest">{t.privacyFirst}</h4>
                        <p>{t.gdprDescription}</p>
                    </div>
                    <div className="space-y-2">
                        <Globe size={20} className="mb-2 text-blue-600" />
                        <h4 className="font-bold text-slate-700 uppercase tracking-widest">{t.multiLanguage}</h4>
                        <p>{t.multiLanguageDesc}</p>
                    </div>
                    <div className="space-y-2">
                        <Sparkles size={20} className="mb-2 text-indigo-600" />
                        <h4 className="font-bold text-slate-700 uppercase tracking-widest">{t.experience}</h4>
                        <p>Relevant experiences highlighted for every age.</p>
                    </div>
                </div>
            </div>
        </Layout>
    );
}
