import React, { useState } from 'react';
import { useLanguage, Language } from '../../context/LanguageContext';
import { useAccessibility } from '../../context/AccessibilityContext';
import { useAuth } from '../../context/AuthContext';
import { AccessibilityModal } from '../accessibility/AccessibilityModal';
import { ShieldCheck, Eye, Database, Globe, Menu, X, Search, LogOut, User as UserIcon } from 'lucide-react';

interface NavbarProps {
  currentRoute: string;
  onNavigate: (route: string, params?: any) => void;
}

export const Navbar: React.FC<NavbarProps> = ({ currentRoute, onNavigate }) => {
  const { language, setLanguage, t } = useLanguage();
  const { dataSaver, setDataSaver } = useAccessibility();
  const { user, logout, isAdmin } = useAuth();
  const [isA11yOpen, setIsA11yOpen] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const languages: { code: Language; label: string }[] = [
    { code: 'en', label: 'English' },
    { code: 'te', label: 'తెలుగు' },
    { code: 'hi', label: 'हिंदी' },
  ];

  return (
    <>
      <header className="sticky top-0 z-40 bg-white/95 backdrop-blur-md border-b border-slate-200 transition-colors">
        {/* Top announcement / disclaimer banner */}
        <div className="bg-amber-50 border-b border-amber-200/60 px-4 py-1.5 text-center text-xs text-amber-900 font-medium flex items-center justify-center gap-2">
          <span className="inline-flex items-center px-1.5 py-0.5 rounded text-[10px] font-bold bg-amber-200 text-amber-900 uppercase tracking-wider">
            {t('demoBadge')}
          </span>
          <span>{t('disclaimer')}</span>
        </div>

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16 sm:h-20 gap-2">
            {/* Logo and Tagline */}
            <div
              className="flex items-center gap-3 cursor-pointer group"
              onClick={() => onNavigate('home')}
              role="button"
              tabIndex={0}
              onKeyDown={(e) => e.key === 'Enter' && onNavigate('home')}
              aria-label="SevaSaarthi Home"
            >
              <div className="w-10 h-10 sm:w-11 sm:h-11 rounded-xl bg-gradient-to-tr from-emerald-600 to-teal-500 flex items-center justify-center text-white shadow-md shadow-emerald-500/20 group-hover:scale-105 transition-transform">
                <ShieldCheck className="w-6 h-6 sm:w-7 sm:h-7" aria-hidden="true" />
              </div>
              <div>
                <div className="flex items-center gap-2">
                  <span className="text-xl sm:text-2xl font-black text-slate-900 tracking-tight">
                    {t('appName')}
                  </span>
                </div>
                <p className="text-xs text-slate-500 font-medium hidden sm:block">
                  {t('tagline')}
                </p>
              </div>
            </div>

            {/* Center: Language Switcher (Visible on both Mobile and Desktop) */}
            <div className="flex items-center bg-slate-100 p-1 rounded-xl border border-slate-200 shrink-0" role="group" aria-label="Language selection">
              <Globe className="w-4 h-4 text-slate-500 ml-1.5 mr-1 hidden sm:block" aria-hidden="true" />
              {languages.map((lang) => (
                <button
                  key={lang.code}
                  onClick={() => setLanguage(lang.code)}
                  aria-pressed={language === lang.code}
                  className={`px-2 sm:px-3 py-1.5 rounded-lg text-xs font-semibold transition-all min-h-[36px] ${
                    language === lang.code
                      ? 'bg-white text-emerald-700 shadow-sm border border-slate-200/80 font-bold'
                      : 'text-slate-600 hover:text-slate-900'
                  }`}
                >
                  {lang.label}
                </button>
              ))}
            </div>

            {/* Desktop Actions */}
            <div className="hidden lg:flex items-center gap-2.5">

              {/* Data Saver Toggle */}
              <button
                onClick={() => setDataSaver(!dataSaver)}
                aria-pressed={dataSaver}
                className={`flex items-center gap-1.5 px-3 py-2 rounded-xl text-xs font-semibold border transition-all min-h-[40px] ${
                  dataSaver
                    ? 'bg-emerald-50 text-emerald-700 border-emerald-300 ring-1 ring-emerald-400'
                    : 'bg-white text-slate-600 border-slate-200 hover:bg-slate-50'
                }`}
                title="Data Saver mode disables animations and conserves bandwidth"
              >
                <Database className="w-4 h-4 text-emerald-600" aria-hidden="true" />
                <span>{t('nav.dataSaver')}</span>
                {dataSaver && <span className="w-2 h-2 rounded-full bg-emerald-500"></span>}
              </button>

              {/* Accessibility Modal Button */}
              <button
                onClick={() => setIsA11yOpen(true)}
                className="flex items-center gap-2 px-3 py-2 rounded-xl text-xs font-semibold bg-white text-slate-700 border border-slate-200 hover:bg-slate-50 hover:border-slate-300 min-h-[40px] transition-colors"
                aria-label={t('accessibility.title')}
              >
                <Eye className="w-4 h-4 text-blue-600" aria-hidden="true" />
                <span>{t('nav.accessibility')}</span>
              </button>

              {/* Navigation links */}
              <button
                onClick={() => onNavigate('track')}
                className={`px-3 py-2 rounded-xl text-xs font-semibold min-h-[40px] transition-colors ${
                  currentRoute === 'track'
                    ? 'bg-slate-900 text-white'
                    : 'text-slate-700 hover:bg-slate-100'
                }`}
              >
                {t('nav.track')}
              </button>

              {isAdmin && (
                <>
                  <button
                    onClick={() => onNavigate('admin')}
                    className={`px-3 py-2 rounded-xl text-xs font-semibold min-h-[40px] transition-colors ${
                      currentRoute === 'admin'
                        ? 'bg-slate-900 text-white'
                        : 'text-slate-700 hover:bg-slate-100'
                    }`}
                  >
                    {t('nav.admin')}
                  </button>

                  <button
                    onClick={() => onNavigate('analytics')}
                    className={`px-3 py-2 rounded-xl text-xs font-semibold min-h-[40px] transition-colors ${
                      currentRoute === 'analytics'
                        ? 'bg-slate-900 text-white'
                        : 'text-slate-700 hover:bg-slate-100'
                    }`}
                  >
                    {t('nav.analytics')}
                  </button>
                </>
              )}

              {/* User Identity Badge & Logout */}
              {user && (
                <div className="flex items-center gap-2 pl-2 border-l border-slate-200">
                  <div className="flex items-center gap-1.5 px-2.5 py-1.5 rounded-xl bg-slate-50 border border-slate-200 text-xs font-semibold text-slate-800">
                    <UserIcon className="w-3.5 h-3.5 text-emerald-600 shrink-0" />
                    <span className="max-w-[130px] truncate" title={user.name}>{user.name}</span>
                    <span className={`px-1.5 py-0.5 rounded text-[10px] font-bold uppercase tracking-wider ${
                      isAdmin ? 'bg-purple-100 text-purple-800 border border-purple-200' : 'bg-emerald-100 text-emerald-800 border border-emerald-200'
                    }`}>
                      {isAdmin ? (t('auth.adminRole') || 'Officer') : (t('auth.citizenRole') || 'Citizen')}
                    </span>
                  </div>

                  <button
                    onClick={logout}
                    className="flex items-center gap-1 px-2.5 py-1.5 rounded-xl text-xs font-bold bg-rose-50 hover:bg-rose-100 text-rose-700 border border-rose-200 transition-colors min-h-[36px]"
                    title="Sign Out"
                    aria-label={t('auth.logout') || 'Logout'}
                  >
                    <LogOut className="w-3.5 h-3.5" />
                    <span className="hidden xl:inline">{t('auth.logout') || 'Logout'}</span>
                  </button>
                </div>
              )}
            </div>

            {/* Mobile Hamburger / Quick Actions */}
            <div className="flex items-center gap-2 lg:hidden">
              <button
                onClick={() => setIsA11yOpen(true)}
                className="p-2 text-slate-600 hover:text-slate-900 bg-slate-100 rounded-lg min-h-[44px] min-w-[44px] flex items-center justify-center"
                aria-label={t('accessibility.title')}
              >
                <Eye className="w-5 h-5 text-blue-600" />
              </button>
              <button
                onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
                className="p-2 text-slate-600 hover:text-slate-900 rounded-lg min-h-[44px] min-w-[44px] flex items-center justify-center bg-slate-100"
                aria-label="Toggle navigation menu"
                aria-expanded={mobileMenuOpen}
              >
                {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
              </button>
            </div>
          </div>

          {/* Mobile Drawer Menu */}
          {mobileMenuOpen && (
            <div className="lg:hidden border-t border-slate-200 py-4 space-y-4">
              {/* Language Switcher Mobile */}
              <div>
                <span className="block text-xs font-bold text-slate-400 uppercase tracking-wider mb-2">
                  Language / భాష / भाषा
                </span>
                <div className="grid grid-cols-3 gap-2">
                  {languages.map((lang) => (
                    <button
                      key={lang.code}
                      onClick={() => {
                        setLanguage(lang.code);
                        setMobileMenuOpen(false);
                      }}
                      className={`py-2 px-3 text-center rounded-lg text-sm font-semibold border min-h-[44px] ${
                        language === lang.code
                          ? 'bg-emerald-50 text-emerald-700 border-emerald-400 font-bold'
                          : 'bg-white text-slate-700 border-slate-200'
                      }`}
                    >
                      {lang.label}
                    </button>
                  ))}
                </div>
              </div>

              {/* Data saver toggle mobile */}
              <div className="flex items-center justify-between p-3 bg-slate-50 rounded-xl border border-slate-200">
                <span className="text-sm font-medium text-slate-700 flex items-center gap-2">
                  <Database className="w-4 h-4 text-emerald-600" />
                  {t('nav.dataSaver')}
                </span>
                <button
                  onClick={() => setDataSaver(!dataSaver)}
                  className={`px-3 py-1 text-xs font-bold rounded-full ${
                    dataSaver ? 'bg-emerald-600 text-white' : 'bg-slate-200 text-slate-700'
                  }`}
                >
                  {dataSaver ? 'ON' : 'OFF'}
                </button>
              </div>

              {/* Action buttons */}
              <div className="space-y-2 pt-2 border-t border-slate-100">
                {user && (
                  <div className="p-3 bg-slate-50 rounded-xl border border-slate-200 flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <UserIcon className="w-4 h-4 text-emerald-600" />
                      <div>
                        <span className="text-xs font-bold text-slate-900 block">{user.name}</span>
                        <span className="text-[10px] text-slate-500 font-mono">{user.emailOrPhone}</span>
                      </div>
                    </div>
                    <span className={`px-2 py-0.5 rounded text-[10px] font-bold uppercase tracking-wider ${
                      isAdmin ? 'bg-purple-100 text-purple-800' : 'bg-emerald-100 text-emerald-800'
                    }`}>
                      {isAdmin ? (t('auth.adminRole') || 'Officer') : (t('auth.citizenRole') || 'Citizen')}
                    </span>
                  </div>
                )}

                <button
                  onClick={() => {
                    onNavigate('home');
                    setMobileMenuOpen(false);
                  }}
                  className="w-full text-left px-4 py-3 rounded-xl font-medium text-slate-800 hover:bg-slate-100 min-h-[44px]"
                >
                  {t('nav.home')}
                </button>
                <button
                  onClick={() => {
                    onNavigate('track');
                    setMobileMenuOpen(false);
                  }}
                  className="w-full text-left px-4 py-3 rounded-xl font-medium text-slate-800 hover:bg-slate-100 min-h-[44px]"
                >
                  {t('nav.track')}
                </button>

                {isAdmin && (
                  <>
                    <button
                      onClick={() => {
                        onNavigate('admin');
                        setMobileMenuOpen(false);
                      }}
                      className="w-full text-left px-4 py-3 rounded-xl font-medium text-slate-800 hover:bg-slate-100 min-h-[44px]"
                    >
                      {t('nav.admin')}
                    </button>
                    <button
                      onClick={() => {
                        onNavigate('analytics');
                        setMobileMenuOpen(false);
                      }}
                      className="w-full text-left px-4 py-3 rounded-xl font-medium text-slate-800 hover:bg-slate-100 min-h-[44px]"
                    >
                      {t('nav.analytics')}
                    </button>
                  </>
                )}

                {user && (
                  <button
                    onClick={() => {
                      logout();
                      setMobileMenuOpen(false);
                    }}
                    className="w-full text-left px-4 py-3 rounded-xl font-bold text-rose-700 bg-rose-50 hover:bg-rose-100 min-h-[44px] flex items-center gap-2"
                  >
                    <LogOut className="w-4 h-4" />
                    <span>{t('auth.logout') || 'Logout'}</span>
                  </button>
                )}
              </div>
            </div>
          )}
        </div>
      </header>

      {/* Accessibility Preferences Modal */}
      <AccessibilityModal isOpen={isA11yOpen} onClose={() => setIsA11yOpen(false)} />
    </>
  );
};
