import React from 'react';
import { useStore } from '../store/useStore';
import { translations } from '../i18n';
import Logo from '../photo/Helsinki_logo.png';
import { Globe, Shield, Info } from 'lucide-react';

interface LayoutProps {
    children: React.ReactNode;
}

export default function Layout({ children }: LayoutProps) {
    const { appLanguage, setAppLanguage } = useStore();
    const t = translations[appLanguage];

    return (
        <div className="min-h-screen flex flex-col text-slate-800">
            <div className="mesh-bg" />

            <header className="sticky top-0 z-50 glass border-b border-slate-200 px-6 py-4">
                <div className="max-w-7xl mx-auto flex justify-between items-center">
                    <div className="flex items-center gap-3">
                        <img src={Logo} alt="Helsinki Logo" className="h-10 w-auto" />
                        <span className="text-xl font-bold tracking-tight text-slate-900 hidden md:block">
                            {t.welcome.split(' ').slice(2).join(' ')}
                        </span>
                    </div>

                    <button
                        onClick={() => setAppLanguage(appLanguage === 'en' ? 'fi' : 'en')}
                        className="flex items-center gap-2 px-4 py-2 rounded-full bg-slate-100 hover:bg-slate-200 transition-all border border-slate-200 text-slate-700"
                    >
                        <Globe size={18} />
                        <span className="font-medium uppercase">{appLanguage}</span>
                    </button>
                </div>
            </header>

            <main className="flex-grow max-w-7xl mx-auto w-full px-6 py-12">
                {children}
            </main>

            <footer className="mt-20 glass border-t border-slate-200 py-10 px-6">
                <div className="max-w-7xl mx-auto flex flex-col items-center gap-5">
                    <div className="flex items-center gap-2 text-slate-500 font-medium">
                        <span>made with love in</span>
                        <img src={Logo} alt="Helsinki Logo" className="h-8 w-auto inline-block" />
                    </div>
                    <div className="flex items-center gap-2 text-emerald-600 text-sm font-medium">
                        <Shield size={14} />
                        <span>{t.gdprBadge}</span>
                    </div>
                    <div className="flex items-start gap-2 text-slate-400 text-xs text-center max-w-lg leading-relaxed">
                        <Info size={14} className="shrink-0 mt-0.5" />
                        <span>{t.disclaimer}</span>
                    </div>
                </div>
            </footer>
        </div>
    );
}
