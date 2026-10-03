import React from 'react';
import { useLanguage } from '../../context/LanguageContext';
import { ShieldAlert, Heart, Info } from 'lucide-react';

export const Footer: React.FC = () => {
  const { t } = useLanguage();

  return (
    <footer className="mt-auto bg-slate-900 text-slate-300 border-t border-slate-800 py-10 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto space-y-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 items-start">
          <div className="space-y-3">
            <div className="flex items-center gap-2">
              <span className="text-xl font-bold text-white">SevaSaarthi</span>
              <span className="px-2 py-0.5 text-xs font-semibold bg-emerald-950 text-emerald-300 rounded border border-emerald-800">
                Demo Platform
              </span>
            </div>
            <p className="text-sm text-slate-400 max-w-md leading-relaxed">
              {t('tagline')}. Bridging citizens to public welfare through speech, natural language understanding, and inclusive navigation.
            </p>
          </div>

          <div className="p-4 rounded-xl bg-slate-800/60 border border-slate-700/60 text-xs text-slate-300 space-y-2">
            <div className="flex items-center gap-2 text-amber-400 font-semibold">
              <ShieldAlert className="w-4 h-4 shrink-0" aria-hidden="true" />
              <span>Mandatory Civic Guidance Disclaimer</span>
            </div>
            <p className="leading-relaxed text-slate-300">
              {t('disclaimer')}
            </p>
            <p className="text-[11px] text-slate-400">
              {t('footer.disclaimer')}
            </p>
          </div>
        </div>

        <div className="pt-6 border-t border-slate-800/80 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-slate-400">
          <p>© 2026 SevaSaarthi. {t('footer.rights')}</p>
          <div className="flex items-center gap-2">
            <span>Built with accessible standards for all Indian citizens</span>
          </div>
        </div>
      </div>
    </footer>
  );
};
