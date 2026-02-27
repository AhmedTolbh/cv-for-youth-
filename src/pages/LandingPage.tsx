import React from 'react';
import { useNavigate } from 'react-router-dom';
import { useStore } from '../store/useStore';
import { translations } from '../i18n';
import Layout from '../components/Layout';
import { ArrowRight, UserCircle, Shield, Globe, Sparkles, Zap, Star, Heart, Building2, Briefcase, Landmark } from 'lucide-react';
import { Logo } from '../components/Logo';
import { motion } from 'framer-motion';
import helsinkiLogo from '../photo/Helsinki_logo.png';

export default function LandingPage() {
    const navigate = useNavigate();
    const { appLanguage, setAgeGroup } = useStore();
    const t = translations[appLanguage];

    const handleStart = (group: 'under18' | 'over18') => {
        setAgeGroup(group);
        navigate('/builder');
    };

    const containerVariants = {
        hidden: { opacity: 0 },
        visible: {
            opacity: 1,
            transition: { staggerChildren: 0.15, delayChildren: 0.1 }
        }
    };

    const itemVariants = {
        hidden: { y: 20, opacity: 0 },
        visible: {
            y: 0,
            opacity: 1,
            transition: { type: "spring", stiffness: 300, damping: 24 }
        }
    };

    return (
        <Layout>
            <motion.div
                className="flex flex-col items-center text-center max-w-5xl mx-auto"
                variants={containerVariants}
                initial="hidden"
                animate="visible"
            >
                {/* Hero Section */}
                <div className="relative w-full py-10 md:py-20 flex flex-col items-center justify-center overflow-hidden rounded-3xl mb-12">
                    <div className="absolute inset-0 bg-gradient-to-br from-blue-50 via-white to-indigo-50/50 z-[-1] opacity-70" />
                    <div className="absolute -top-40 -right-40 w-96 h-96 bg-brand-primary/10 rounded-full blur-3xl" />
                    <div className="absolute -bottom-40 -left-40 w-96 h-96 bg-indigo-500/10 rounded-full blur-3xl" />

                    <motion.div variants={itemVariants} className="flex justify-center mb-8 relative">
                        <div className="bg-white/80 backdrop-blur-md p-6 rounded-[2rem] shadow-xl shadow-brand-primary/5 border border-white/50 ring-1 ring-slate-900/5">
                            <Logo className="h-28 w-auto text-brand-primary" />
                        </div>
                    </motion.div>

                    <motion.div variants={itemVariants} className="space-y-6 max-w-3xl px-4">
                        <motion.div
                            initial={{ scale: 0.9, opacity: 0 }}
                            animate={{ scale: 1, opacity: 1 }}
                            transition={{ duration: 0.5, delay: 0.2 }}
                            className="flex flex-wrap justify-center gap-3 mb-4"
                        >
                            <span className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-brand-primary/10 text-brand-primary font-medium text-sm border border-brand-primary/20 shadow-sm">
                                <Star size={14} className="fill-brand-primary" />
                                <span>{appLanguage === 'en' ? 'Build for the Future' : 'Rakenna Tulevaisuutta'}</span>
                            </span>
                            <span className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-emerald-500/10 text-emerald-600 font-bold text-sm border border-emerald-500/20 shadow-sm">
                                <Heart size={14} className="fill-emerald-600" />
                                <span>{appLanguage === 'en' ? '100% Free Forever' : '100% Ilmainen Ikuisesti'}</span>
                            </span>
                        </motion.div>
                        <h1 className="text-5xl md:text-7xl font-extrabold tracking-tight text-slate-900 bg-clip-text text-transparent bg-gradient-to-r from-slate-900 via-brand-secondary to-slate-800">
                            {t.welcome}
                        </h1>
                        <p className="text-xl md:text-2xl text-slate-500 font-medium leading-relaxed max-w-2xl mx-auto">
                            {t.subtitle}
                        </p>
                    </motion.div>
                </div>

                {/* Main Action Cards */}
                <motion.div variants={itemVariants} className="grid md:grid-cols-2 gap-6 md:gap-8 w-full px-4 mb-24">
                    <motion.button
                        whileHover={{ y: -5, scale: 1.02 }}
                        whileTap={{ scale: 0.98 }}
                        onClick={() => handleStart('under18')}
                        className="group relative overflow-hidden bg-white rounded-[2rem] p-8 md:p-10 text-left border border-slate-200 shadow-xl shadow-slate-200/50 hover:shadow-2xl hover:border-brand-primary/30 transition-all duration-300"
                    >
                        <div className="absolute top-0 right-0 w-32 h-32 bg-gradient-to-bl from-blue-100 to-transparent rounded-bl-full opacity-50 group-hover:opacity-100 transition-opacity" />

                        <div className="relative z-10 space-y-6">
                            <div className="w-16 h-16 bg-gradient-to-br from-blue-500 to-blue-600 rounded-2xl flex items-center justify-center shadow-lg shadow-blue-500/20 group-hover:scale-110 transition-transform duration-300">
                                <UserCircle className="text-white" size={32} />
                            </div>
                            <div>
                                <h3 className="text-3xl font-bold text-slate-900 mb-3">{t.under18.split(' ').slice(0, 2).join(' ')}</h3>
                                <p className="text-slate-600 font-medium text-lg leading-relaxed">{t.under18.split(' ').slice(2).join(' ')}</p>
                            </div>
                            <div className="inline-flex items-center gap-2 text-blue-600 font-bold text-lg pt-4">
                                {t.start} <ArrowRight size={20} className="group-hover:translate-x-2 transition-transform duration-300" />
                            </div>
                        </div>
                    </motion.button>

                    <motion.button
                        whileHover={{ y: -5, scale: 1.02 }}
                        whileTap={{ scale: 0.98 }}
                        onClick={() => handleStart('over18')}
                        className="group relative overflow-hidden bg-white rounded-[2rem] p-8 md:p-10 text-left border border-slate-200 shadow-xl shadow-slate-200/50 hover:shadow-2xl hover:border-indigo-500/30 transition-all duration-300"
                    >
                        <div className="absolute top-0 right-0 w-32 h-32 bg-gradient-to-bl from-indigo-100 to-transparent rounded-bl-full opacity-50 group-hover:opacity-100 transition-opacity" />

                        <div className="relative z-10 space-y-6">
                            <div className="w-16 h-16 bg-gradient-to-br from-indigo-500 to-indigo-600 rounded-2xl flex items-center justify-center shadow-lg shadow-indigo-500/20 group-hover:scale-110 transition-transform duration-300">
                                <Zap className="text-white" size={32} />
                            </div>
                            <div>
                                <h3 className="text-3xl font-bold text-slate-900 mb-3">{t.over18.split(' ').slice(0, 3).join(' ')}</h3>
                                <p className="text-slate-600 font-medium text-lg leading-relaxed">{t.over18.split(' ').slice(3).join(' ')}</p>
                            </div>
                            <div className="inline-flex items-center gap-2 text-indigo-600 font-bold text-lg pt-4">
                                {t.start} <ArrowRight size={20} className="group-hover:translate-x-2 transition-transform duration-300" />
                            </div>
                        </div>
                    </motion.button>
                </motion.div>

                {/* Trusted & Partnership Section */}
                <motion.div variants={itemVariants} className="w-full py-16 px-4 mb-16 flex flex-col items-center border-y border-slate-200/50 bg-slate-50/50 rounded-3xl">
                    <p className="text-sm font-bold text-slate-400 uppercase tracking-widest mb-10 text-center">
                        {appLanguage === 'en' ? 'Trusted by Top Companies & Organizations' : 'Huippuyritysten ja organisaatioiden luottama'}
                    </p>
                    <div className="flex flex-wrap justify-center items-center gap-10 md:gap-20 opacity-50 grayscale hover:grayscale-0 transition-all duration-500">
                        <div className="flex items-center gap-2 font-black text-2xl text-slate-800 tracking-tighter">
                            <Building2 size={32} className="text-blue-600" /> TECHSTART
                        </div>
                        <div className="flex items-center gap-2 font-black text-2xl text-slate-800 tracking-tighter">
                            <Briefcase size={32} className="text-emerald-600" /> NORDIC.WORK
                        </div>
                        <div className="flex items-center gap-2 font-black text-2xl text-slate-800 tracking-tighter">
                            <Landmark size={32} className="text-indigo-600" /> GLOBALSOLUTIONS
                        </div>
                    </div>

                    <div className="mt-20 flex flex-col items-center">
                        <p className="text-sm font-bold text-slate-400 uppercase tracking-widest mb-8 text-center">
                            {appLanguage === 'en' ? 'In partnership with' : 'Yhteistyössä'}
                        </p>
                        <div className="flex items-center justify-center bg-white px-8 py-6 rounded-[2rem] shadow-xl shadow-slate-200/50 border border-slate-100 hover:shadow-2xl hover:-translate-y-1 transition-all duration-300 cursor-pointer">
                            <img src={helsinkiLogo} alt="Helsinki City Logo" className="h-20 w-auto object-contain" />
                            <div className="ml-6 pl-6 border-l-2 border-slate-100">
                                <span className="block font-black text-xl text-slate-900 tracking-tight">Helsinki Youth Services</span>
                                <span className="block text-sm font-medium text-slate-500 mt-1">Helsingin kaupungin nuorisopalvelut</span>
                            </div>
                        </div>
                    </div>
                </motion.div>

                {/* Features Section */}
                <motion.div variants={itemVariants} className="w-full pt-8 px-4">
                    <div className="text-center mb-12">
                        <h2 className="text-2xl md:text-3xl font-bold text-slate-800 tracking-tight">
                            {appLanguage === 'en' ? 'Built to Help You Stand Out' : 'Rakennettu Auttamaan Sinua Erottumaan'}
                        </h2>
                    </div>
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-8 md:gap-12 text-slate-600 text-left">
                        <div className="space-y-4 p-6 rounded-2xl bg-white border border-slate-100 shadow-sm hover:shadow-md transition-shadow">
                            <div className="w-12 h-12 bg-emerald-50 rounded-xl flex items-center justify-center mb-6">
                                <Shield size={24} className="text-emerald-600" />
                            </div>
                            <h4 className="font-bold text-slate-900 text-xl">{t.privacyFirst}</h4>
                            <p className="leading-relaxed text-slate-500">{t.gdprDescription}</p>
                        </div>
                        <div className="space-y-4 p-6 rounded-2xl bg-white border border-slate-100 shadow-sm hover:shadow-md transition-shadow">
                            <div className="w-12 h-12 bg-blue-50 rounded-xl flex items-center justify-center mb-6">
                                <Globe size={24} className="text-blue-600" />
                            </div>
                            <h4 className="font-bold text-slate-900 text-xl">{t.multiLanguage}</h4>
                            <p className="leading-relaxed text-slate-500">{t.multiLanguageDesc}</p>
                        </div>
                        <div className="space-y-4 p-6 rounded-2xl bg-white border border-slate-100 shadow-sm hover:shadow-md transition-shadow">
                            <div className="w-12 h-12 bg-indigo-50 rounded-xl flex items-center justify-center mb-6">
                                <Sparkles size={24} className="text-indigo-600" />
                            </div>
                            <h4 className="font-bold text-slate-900 text-xl">{t.experience}</h4>
                            <p className="leading-relaxed text-slate-500">{t.relevantExperience}</p>
                        </div>
                    </div>
                </motion.div>
            </motion.div>
        </Layout>
    );
}
