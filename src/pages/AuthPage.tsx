import React, { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { useLanguage, Language } from '../context/LanguageContext';
import { useAccessibility } from '../context/AccessibilityContext';
import { AccessibilityModal } from '../components/accessibility/AccessibilityModal';
import { DEMO_ADMIN, DEMO_CITIZENS, User } from '../types/auth';
import {
  ShieldCheck,
  User as UserIcon,
  Shield,
  Eye,
  Lock,
  Phone,
  Mail,
  ArrowRight,
  CheckCircle2,
  AlertCircle,
  Sparkles,
  KeyRound,
  Globe,
  HelpCircle,
  Building
} from 'lucide-react';

interface AuthPageProps {
  onLoginSuccess: (user: User) => void;
}

export const AuthPage: React.FC<AuthPageProps> = ({ onLoginSuccess }) => {
  const { login, signup, quickLogin } = useAuth();
  const { language, setLanguage, t } = useLanguage();
  const { dataSaver, setDataSaver } = useAccessibility();

  // Tab: 'citizen' or 'admin'
  const [activeTab, setActiveTab] = useState<'citizen' | 'admin'>('citizen');
  // Citizen mode: 'signin' or 'signup'
  const [citizenMode, setCitizenMode] = useState<'signin' | 'signup'>('signin');

  const [isA11yOpen, setIsA11yOpen] = useState(false);

  // Form states
  const [identifier, setIdentifier] = useState('');
  const [password, setPassword] = useState('');
  const [name, setName] = useState('');
  const [prefLang, setPrefLang] = useState<Language>(language);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  // Admin form state
  const [adminIdentifier, setAdminIdentifier] = useState('admin@sevasaarthi.gov.in');
  const [adminPassword, setAdminPassword] = useState('admin123');
  const [adminErrorMsg, setAdminErrorMsg] = useState<string | null>(null);

  const languages: { code: Language; label: string }[] = [
    { code: 'en', label: 'English' },
    { code: 'te', label: 'తెలుగు' },
    { code: 'hi', label: 'हिंदी' },
  ];

  const handleCitizenSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg(null);

    if (citizenMode === 'signin') {
      if (!identifier.trim()) {
        setErrorMsg(
          language === 'te'
            ? 'దయచేసి మీ ఫోన్ నంబర్ లేదా ఈమెయిల్ నమోదు చేయండి.'
            : language === 'hi'
            ? 'कृपया अपना फ़ोन नंबर या ईमेल दर्ज करें।'
            : 'Please enter your phone number or email.'
        );
        return;
      }
      if (!password.trim()) {
        setErrorMsg(
          language === 'te'
            ? 'దయచేసి మీ పాస్‌వర్డ్ నమోదు చేయండి.'
            : language === 'hi'
            ? 'कृपया अपना पासवर्ड दर्ज करें।'
            : 'Please enter your password.'
        );
        return;
      }

      const res = login(identifier, password, 'citizen');
      if (res.success && res.user) {
        onLoginSuccess(res.user);
      } else {
        setErrorMsg(res.error || 'Invalid credentials');
      }
    } else {
      // Citizen Sign Up
      if (!name.trim()) {
        setErrorMsg(
          language === 'te'
            ? 'దయచేసి మీ పూర్తి పేరు నమోదు చేయండి.'
            : language === 'hi'
            ? 'कृपया अपना पूरा नाम दर्ज करें।'
            : 'Please enter your full name.'
        );
        return;
      }
      if (!identifier.trim()) {
        setErrorMsg(
          language === 'te'
            ? 'దయచేసి ఫోన్ నంబర్ లేదా ఈమెయిల్ నమోదు చేయండి.'
            : language === 'hi'
            ? 'कृपया फ़ोन नंबर या ईमेल दर्ज करें।'
            : 'Please enter your phone number or email.'
        );
        return;
      }
      if (!password.trim() || password.trim().length < 4) {
        setErrorMsg(
          language === 'te'
            ? 'పాస్‌వర్డ్ కనీసం 4 అక్షరాలు ఉండాలి.'
            : language === 'hi'
            ? 'पासवर्ड कम से कम 4 अक्षरों का होना चाहिए।'
            : 'Password must be at least 4 characters.'
        );
        return;
      }

      const res = signup({
        name,
        emailOrPhone: identifier,
        password,
        preferredLanguage: prefLang,
      });

      if (res.success && res.user) {
        onLoginSuccess(res.user);
      } else {
        setErrorMsg(res.error || 'Registration failed');
      }
    }
  };

  const handleAdminSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setAdminErrorMsg(null);

    const res = login(adminIdentifier, adminPassword, 'admin');
    if (res.success && res.user) {
      onLoginSuccess(res.user);
    } else {
      setAdminErrorMsg(res.error || 'Invalid admin credentials');
    }
  };

  const handleQuickCitizenLogin = (citizen: typeof DEMO_CITIZENS[0]) => {
    if (citizen.user.preferredLanguage) {
      setLanguage(citizen.user.preferredLanguage);
    }
    quickLogin(citizen.user);
    onLoginSuccess(citizen.user);
  };

  const handleQuickAdminLogin = () => {
    quickLogin(DEMO_ADMIN.user);
    onLoginSuccess(DEMO_ADMIN.user);
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-slate-50 via-slate-100/50 to-slate-100 flex flex-col justify-between">
      {/* Top Banner & Header */}
      <header className="w-full bg-white border-b border-slate-200 shadow-sm sticky top-0 z-30">
        <div className="bg-amber-50 border-b border-amber-200/60 px-4 py-1 text-center text-xs text-amber-900 font-medium flex items-center justify-center gap-2">
          <span className="inline-flex items-center px-1.5 py-0.5 rounded text-[10px] font-bold bg-amber-200 text-amber-900 uppercase tracking-wider">
            {t('auth.demoBadge')}
          </span>
          <span>{t('disclaimer')}</span>
        </div>

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 sm:h-20 flex items-center justify-between gap-4">
          {/* Logo */}
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 sm:w-11 sm:h-11 rounded-xl bg-gradient-to-tr from-emerald-600 to-teal-500 flex items-center justify-center text-white shadow-md shadow-emerald-500/20">
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

          {/* Right actions: Language switcher & Accessibility */}
          <div className="flex items-center gap-2 sm:gap-3">
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

            <button
              onClick={() => setIsA11yOpen(true)}
              className="flex items-center gap-1.5 px-3 py-2 rounded-xl text-xs font-semibold bg-white text-slate-700 border border-slate-200 hover:bg-slate-50 min-h-[40px] transition-colors"
              aria-label={t('accessibility.title')}
            >
              <Eye className="w-4 h-4 text-blue-600" aria-hidden="true" />
              <span className="hidden sm:inline">{t('nav.accessibility')}</span>
            </button>
          </div>
        </div>
      </header>

      {/* Main Authentication Container */}
      <main className="flex-1 max-w-4xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-12 flex flex-col justify-center">
        <div className="text-center space-y-2 mb-8">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-100 text-emerald-800 text-xs font-bold border border-emerald-300">
            <Sparkles className="w-3.5 h-3.5 text-emerald-600" />
            <span>{t('auth.demoBadge')}</span>
          </div>
          <h1 className="text-2xl sm:text-4xl font-black text-slate-900 tracking-tight">
            {t('auth.title')}
          </h1>
          <p className="text-sm sm:text-base text-slate-600 max-w-xl mx-auto">
            {t('auth.subtitle')}
          </p>
        </div>

        {/* Tab Selection: Citizen vs Admin */}
        <div className="bg-white rounded-3xl border border-slate-200 shadow-xl overflow-hidden">
          <div className="grid grid-cols-2 p-2 bg-slate-100 border-b border-slate-200 gap-2">
            <button
              type="button"
              onClick={() => {
                setActiveTab('citizen');
                setErrorMsg(null);
              }}
              role="tab"
              aria-selected={activeTab === 'citizen'}
              className={`flex items-center justify-center gap-2.5 py-3.5 px-4 rounded-2xl text-xs sm:text-sm font-bold transition-all min-h-[48px] ${
                activeTab === 'citizen'
                  ? 'bg-white text-emerald-700 shadow-sm border border-slate-200'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              <UserIcon className="w-4 h-4" />
              <span>{t('auth.citizenTab')}</span>
            </button>

            <button
              type="button"
              onClick={() => {
                setActiveTab('admin');
                setAdminErrorMsg(null);
              }}
              role="tab"
              aria-selected={activeTab === 'admin'}
              className={`flex items-center justify-center gap-2.5 py-3.5 px-4 rounded-2xl text-xs sm:text-sm font-bold transition-all min-h-[48px] ${
                activeTab === 'admin'
                  ? 'bg-white text-slate-900 shadow-sm border border-slate-200'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              <Building className="w-4 h-4" />
              <span>{t('auth.adminTab')}</span>
            </button>
          </div>

          <div className="p-6 sm:p-10">
            {/* CITIZEN ENTRY POINT */}
            {activeTab === 'citizen' && (
              <div className="space-y-8">
                {/* Sub-toggle: Sign In vs Sign Up */}
                <div className="flex justify-center">
                  <div className="inline-flex p-1 bg-slate-100 rounded-xl border border-slate-200">
                    <button
                      type="button"
                      onClick={() => {
                        setCitizenMode('signin');
                        setErrorMsg(null);
                      }}
                      className={`px-5 py-2 rounded-lg text-xs font-bold transition-all ${
                        citizenMode === 'signin'
                          ? 'bg-white text-emerald-800 shadow-sm'
                          : 'text-slate-600 hover:text-slate-900'
                      }`}
                    >
                      {t('auth.signInTab')}
                    </button>
                    <button
                      type="button"
                      onClick={() => {
                        setCitizenMode('signup');
                        setErrorMsg(null);
                      }}
                      className={`px-5 py-2 rounded-lg text-xs font-bold transition-all ${
                        citizenMode === 'signup'
                          ? 'bg-white text-emerald-800 shadow-sm'
                          : 'text-slate-600 hover:text-slate-900'
                      }`}
                    >
                      {t('auth.signUpTab')}
                    </button>
                  </div>
                </div>

                {/* Form Error Alert */}
                {errorMsg && (
                  <div
                    role="alert"
                    className="p-4 rounded-2xl bg-rose-50 border border-rose-200 text-rose-800 text-xs sm:text-sm flex items-start gap-3"
                  >
                    <AlertCircle className="w-5 h-5 text-rose-600 shrink-0 mt-0.5" />
                    <span>{errorMsg}</span>
                  </div>
                )}

                {/* Citizen Form */}
                <form onSubmit={handleCitizenSubmit} className="space-y-4 max-w-lg mx-auto">
                  {citizenMode === 'signup' && (
                    <div className="space-y-1.5">
                      <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider">
                        {t('auth.nameLabel')} <span className="text-rose-500">*</span>
                      </label>
                      <input
                        type="text"
                        value={name}
                        onChange={(e) => setName(e.target.value)}
                        placeholder={t('auth.namePlaceholder')}
                        className="w-full px-4 py-3 rounded-2xl border border-slate-200 focus:border-emerald-500 focus:ring-4 focus:ring-emerald-500/10 text-sm font-medium"
                      />
                    </div>
                  )}

                  <div className="space-y-1.5">
                    <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider">
                      {t('auth.identifierLabel')} <span className="text-rose-500">*</span>
                    </label>
                    <input
                      type="text"
                      value={identifier}
                      onChange={(e) => setIdentifier(e.target.value)}
                      placeholder={t('auth.identifierPlaceholder')}
                      className="w-full px-4 py-3 rounded-2xl border border-slate-200 focus:border-emerald-500 focus:ring-4 focus:ring-emerald-500/10 text-sm font-medium"
                    />
                  </div>

                  <div className="space-y-1.5">
                    <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider">
                      {t('auth.passwordLabel')} <span className="text-rose-500">*</span>
                    </label>
                    <input
                      type="password"
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      placeholder={t('auth.passwordPlaceholder')}
                      className="w-full px-4 py-3 rounded-2xl border border-slate-200 focus:border-emerald-500 focus:ring-4 focus:ring-emerald-500/10 text-sm font-medium"
                    />
                  </div>

                  {citizenMode === 'signup' && (
                    <div className="space-y-1.5">
                      <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider">
                        {t('auth.languageLabel')}
                      </label>
                      <select
                        value={prefLang}
                        onChange={(e) => setPrefLang(e.target.value as Language)}
                        className="w-full px-4 py-3 rounded-2xl border border-slate-200 focus:border-emerald-500 focus:ring-4 focus:ring-emerald-500/10 text-sm font-medium bg-white"
                      >
                        <option value="te">తెలుగు (Telugu)</option>
                        <option value="hi">हिंदी (Hindi)</option>
                        <option value="en">English</option>
                      </select>
                    </div>
                  )}

                  {/* Privacy Assurance Notice: Never collects Aadhaar */}
                  <div className="p-3.5 rounded-2xl bg-emerald-50/80 border border-emerald-200 text-xs text-emerald-950 flex items-start gap-2.5">
                    <ShieldCheck className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
                    <span>{t('auth.noAadhaarNotice')}</span>
                  </div>

                  <button
                    type="submit"
                    className="w-full py-4 rounded-2xl bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-sm shadow-lg shadow-emerald-600/25 flex items-center justify-center gap-2 min-h-[48px] transition-all"
                  >
                    <span>{citizenMode === 'signin' ? t('auth.signInBtn') : t('auth.signUpBtn')}</span>
                    <ArrowRight className="w-4 h-4" />
                  </button>
                </form>

                {/* 1-Click Demo Citizen Logins */}
                <div className="pt-6 border-t border-slate-200 space-y-4">
                  <div className="text-center space-y-1">
                    <span className="text-xs font-extrabold uppercase tracking-wider text-slate-700 block">
                      {t('auth.demoCitizensTitle')}
                    </span>
                    <p className="text-xs text-slate-500">
                      {t('auth.demoCitizensSubtitle')}
                    </p>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    {DEMO_CITIZENS.map((demo) => (
                      <button
                        key={demo.user.id}
                        type="button"
                        onClick={() => handleQuickCitizenLogin(demo)}
                        className="p-3.5 text-left rounded-2xl border border-slate-200 bg-slate-50/80 hover:bg-emerald-50/80 hover:border-emerald-300 transition-all group flex flex-col justify-between space-y-1.5"
                      >
                        <div className="flex items-center justify-between">
                          <span className="font-extrabold text-sm text-slate-900 group-hover:text-emerald-900">
                            {demo.user.name}
                          </span>
                          <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-emerald-100 text-emerald-800">
                            Demo Persona
                          </span>
                        </div>
                        <p className="text-xs text-slate-600 leading-snug">
                          {demo.description[language] || demo.description.en}
                        </p>
                        <div className="pt-1 flex items-center gap-1.5 text-[11px] font-semibold text-emerald-700">
                          <Sparkles className="w-3 h-3 text-emerald-600" />
                          <span>{demo.sampleScheme[language] || demo.sampleScheme.en}</span>
                        </div>
                      </button>
                    ))}
                  </div>
                </div>
              </div>
            )}

            {/* ADMIN WELFARE OFFICER ENTRY POINT */}
            {activeTab === 'admin' && (
              <div className="space-y-8 max-w-lg mx-auto">
                <div className="p-4 rounded-2xl bg-amber-50 border border-amber-200 text-amber-900 text-xs flex items-start gap-3">
                  <Shield className="w-5 h-5 text-amber-600 shrink-0 mt-0.5" />
                  <div>
                    <span className="font-bold block">{t('auth.adminTab')}</span>
                    <p>{t('auth.adminDemoNotice')}</p>
                  </div>
                </div>

                {/* Demo Credentials Box */}
                <div className="p-5 rounded-2xl bg-slate-900 text-white space-y-3 shadow-lg">
                  <div className="flex items-center justify-between border-b border-slate-800 pb-2">
                    <span className="text-xs font-bold uppercase tracking-wider text-emerald-400 flex items-center gap-1.5">
                      <KeyRound className="w-3.5 h-3.5" />
                      {t('auth.demoCredentialsTitle')}
                    </span>
                    <span className="text-[10px] bg-slate-800 px-2 py-0.5 rounded text-slate-400 font-mono">
                      Mock Role: Admin
                    </span>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-xs font-mono">
                    <div className="bg-slate-800/80 p-2.5 rounded-xl border border-slate-700">
                      <span className="text-slate-400 block text-[10px] font-sans">Official Email / ID:</span>
                      <span className="text-emerald-300 font-bold select-all">admin@sevasaarthi.gov.in</span>
                    </div>
                    <div className="bg-slate-800/80 p-2.5 rounded-xl border border-slate-700">
                      <span className="text-slate-400 block text-[10px] font-sans">Demo Password:</span>
                      <span className="text-emerald-300 font-bold select-all">admin123</span>
                    </div>
                  </div>

                  <button
                    type="button"
                    onClick={handleQuickAdminLogin}
                    className="w-full py-2.5 px-4 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-bold flex items-center justify-center gap-2 transition-colors min-h-[40px]"
                  >
                    <span>{t('auth.oneClickAdmin')}</span>
                    <ArrowRight className="w-3.5 h-3.5" />
                  </button>
                </div>

                {/* Admin Form Error Alert */}
                {adminErrorMsg && (
                  <div
                    role="alert"
                    className="p-4 rounded-2xl bg-rose-50 border border-rose-200 text-rose-800 text-xs sm:text-sm flex items-start gap-3"
                  >
                    <AlertCircle className="w-5 h-5 text-rose-600 shrink-0 mt-0.5" />
                    <span>{adminErrorMsg}</span>
                  </div>
                )}

                {/* Admin Form */}
                <form onSubmit={handleAdminSubmit} className="space-y-4">
                  <div className="space-y-1.5">
                    <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider">
                      {t('auth.identifierLabel')} <span className="text-rose-500">*</span>
                    </label>
                    <input
                      type="text"
                      value={adminIdentifier}
                      onChange={(e) => setAdminIdentifier(e.target.value)}
                      className="w-full px-4 py-3 rounded-2xl border border-slate-200 focus:border-slate-800 focus:ring-4 focus:ring-slate-800/10 text-sm font-medium"
                    />
                  </div>

                  <div className="space-y-1.5">
                    <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider">
                      {t('auth.passwordLabel')} <span className="text-rose-500">*</span>
                    </label>
                    <input
                      type="password"
                      value={adminPassword}
                      onChange={(e) => setAdminPassword(e.target.value)}
                      className="w-full px-4 py-3 rounded-2xl border border-slate-200 focus:border-slate-800 focus:ring-4 focus:ring-slate-800/10 text-sm font-medium"
                    />
                  </div>

                  <button
                    type="submit"
                    className="w-full py-4 rounded-2xl bg-slate-900 hover:bg-slate-800 text-white font-bold text-sm shadow-lg flex items-center justify-center gap-2 min-h-[48px] transition-all"
                  >
                    <span>{t('auth.adminLoginBtn')}</span>
                    <ArrowRight className="w-4 h-4" />
                  </button>
                </form>
              </div>
            )}
          </div>
        </div>
      </main>

      {/* Footer */}
      <footer className="py-6 text-center text-xs text-slate-500 border-t border-slate-200 bg-white">
        <p>{t('footer.disclaimer')}</p>
      </footer>

      {/* Accessibility Modal */}
      <AccessibilityModal
        isOpen={isA11yOpen}
        onClose={() => setIsA11yOpen(false)}
      />
    </div>
  );
};
