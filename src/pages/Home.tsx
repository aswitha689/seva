import React, { useState, useEffect } from 'react';
import { useLanguage } from '../context/LanguageContext';
import { useAccessibility } from '../context/AccessibilityContext';
import servicesData from '../data/services.json';
import {
  Mic,
  MicOff,
  Search,
  FileCheck,
  GraduationCap,
  Home as HomeIcon,
  BadgeIndianRupee,
  HeartHandshake,
  Accessibility as AccessibilityIcon,
  Wheat,
  FileText,
  ArrowRight,
  Volume2,
  Sparkles,
  Info
} from 'lucide-react';

interface HomeProps {
  onNavigate: (route: string, params?: any) => void;
  onSearch: (query: string) => void;
  onSelectCategory: (category: string) => void;
}

export const Home: React.FC<HomeProps> = ({ onNavigate, onSearch, onSelectCategory }) => {
  const { language, setLanguage, detectAndSetLanguage, t } = useLanguage();
  const { dataSaver, speak, isSpeaking, stopSpeaking } = useAccessibility();

  const [query, setQuery] = useState('');
  const [isListening, setIsListening] = useState(false);
  const [speechError, setSpeechError] = useState<string | null>(null);

  const handleQueryChange = (val: string) => {
    setQuery(val);
    detectAndSetLanguage(val);
  };

  // Web Speech API recognition setup
  const handleToggleSpeech = () => {
    const SpeechRecognition =
      (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;

    if (!SpeechRecognition) {
      setSpeechError(
        language === 'te'
          ? 'మీ బ్రౌజర్‌లో వాయిస్ రికగ్నిషన్ సపోర్ట్ లేదు. దయచేసి టైప్ చేయండి.'
          : language === 'hi'
          ? 'आपके ब्राउज़र में वॉइस सपोर्ट उपलब्ध नहीं है। कृपया टाइप करें।'
          : 'Voice input is not supported in this browser. Please type your query.'
      );
      return;
    }

    if (isListening) {
      setIsListening(false);
      return;
    }

    try {
      const recognition = new SpeechRecognition();
      recognition.continuous = false;
      recognition.interimResults = false;

      // Set lang based on active language
      if (language === 'te') {
        recognition.lang = 'te-IN';
      } else if (language === 'hi') {
        recognition.lang = 'hi-IN';
      } else {
        recognition.lang = 'en-IN';
      }

      recognition.onstart = () => {
        setIsListening(true);
        setSpeechError(null);
      };

      recognition.onresult = (event: any) => {
        const transcript = event.results[0][0].transcript;
        setQuery(transcript);
        detectAndSetLanguage(transcript);
        setIsListening(false);
      };

      recognition.onerror = (event: any) => {
        console.error('Speech recognition error:', event.error);
        setIsListening(false);
        setSpeechError(
          language === 'te'
            ? 'వాయిస్ వినడంలో సమస్య ఎదురైంది. దయచేసి మళ్లీ ప్రయత్నించండి లేదా టైప్ చేయండి.'
            : language === 'hi'
            ? 'आवाज़ पहचानने में समस्या आई। कृपया पुनः प्रयास करें या टाइप करें।'
            : 'Could not catch voice. Please try again or type.'
        );
      };

      recognition.onend = () => {
        setIsListening(false);
      };

      recognition.start();
    } catch (err) {
      console.error(err);
      setIsListening(false);
    }
  };

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (query.trim()) {
      detectAndSetLanguage(query.trim());
      onSearch(query.trim());
    }
  };

  // Demo suggestions for quick citizen testing (including Anitha's student scenario)
  const quickPrompts = [
    {
      en: "I am a 20-year-old student needing scholarship for college fees",
      te: "నేను 20 ఏళ్ల విద్యార్థిని, కళాశాల ఫీజులకు స్కాలర్‌షిప్ కావాలి",
      hi: "मैं 20 वर्षीय छात्रा हूँ, मुझे कॉलेज फीस के लिए छात्रवृत्ति चाहिए",
    },
    {
      en: "I am a farmer looking for direct crop investment support",
      te: "నేను రైతును, పంట పెట్టుబడి సహాయం పథకం కావాలి",
      hi: "मैं किसान हूँ, मुझे फसल निवेश सहायता चाहिए",
    },
    {
      en: "How to get a government pension for senior citizen parents?",
      te: "వృద్ధ తల్లిదండ్రులకు ఆసరా పెన్షన్ ఎలా పొందాలి?",
      hi: "बुजुर्ग माता-पिता के लिए वृद्धावस्था पेंशन कैसे प्राप्त करें?",
    },
  ];

  // Category definitions mapping to categories in SPEC
  const categories = [
    {
      id: 'Education',
      nameKey: 'categories.education',
      icon: GraduationCap,
      count: servicesData.filter((s) => s.category === 'Education').length,
      bg: 'bg-indigo-50 border-indigo-200 text-indigo-700 hover:bg-indigo-100/70',
      iconBg: 'bg-indigo-600 text-white',
    },
    {
      id: 'Financial Assistance',
      nameKey: 'categories.financial',
      icon: BadgeIndianRupee,
      count: servicesData.filter((s) => s.category === 'Financial Assistance' || s.category === 'Education').length,
      bg: 'bg-emerald-50 border-emerald-200 text-emerald-700 hover:bg-emerald-100/70',
      iconBg: 'bg-emerald-600 text-white',
    },
    {
      id: 'Senior Citizens',
      nameKey: 'categories.senior',
      icon: HeartHandshake,
      count: servicesData.filter((s) => s.category === 'Senior Citizens').length,
      bg: 'bg-amber-50 border-amber-200 text-amber-800 hover:bg-amber-100/70',
      iconBg: 'bg-amber-600 text-white',
    },
    {
      id: 'Farmer Services',
      nameKey: 'categories.farmer',
      icon: Wheat,
      count: servicesData.filter((s) => s.category === 'Farmer Services').length,
      bg: 'bg-lime-50 border-lime-200 text-lime-800 hover:bg-lime-100/70',
      iconBg: 'bg-lime-600 text-white',
    },
    {
      id: 'Certificates',
      nameKey: 'categories.certificates',
      icon: FileText,
      count: servicesData.filter((s) => s.category === 'Certificates').length,
      bg: 'bg-sky-50 border-sky-200 text-sky-800 hover:bg-sky-100/70',
      iconBg: 'bg-sky-600 text-white',
    },
    {
      id: 'Housing',
      nameKey: 'categories.housing',
      icon: HomeIcon,
      count: 0, // demo zero count
      bg: 'bg-teal-50 border-teal-200 text-teal-800 hover:bg-teal-100/70',
      iconBg: 'bg-teal-600 text-white',
    },
    {
      id: 'Disability Services',
      nameKey: 'categories.disability',
      icon: AccessibilityIcon,
      count: servicesData.filter((s) => s.category === 'Disability Services').length,
      bg: 'bg-purple-50 border-purple-200 text-purple-800 hover:bg-purple-100/70',
      iconBg: 'bg-purple-600 text-white',
    },
  ];

  return (
    <div className="flex-1 pb-16">
      {/* Hero Section */}
      <section className="relative overflow-hidden bg-gradient-to-b from-emerald-50/70 via-white to-slate-50 border-b border-slate-200/80 pt-10 pb-16 sm:pt-16 sm:pb-24 px-4 sm:px-6 lg:px-8">
        <div className="max-w-4xl mx-auto text-center space-y-6">
          {/* Tagline pill */}
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-emerald-100/80 border border-emerald-300 text-emerald-900 text-xs sm:text-sm font-semibold shadow-sm">
            <Sparkles className="w-4 h-4 text-emerald-600" aria-hidden="true" />
            <span>{t('tagline')}</span>
            <span className="text-emerald-500">•</span>
            <span className="text-emerald-700 font-bold uppercase text-[10px] tracking-wide">
              {t('demoBadge')}
            </span>
          </div>

          {/* Main Hero Header */}
          <div className="space-y-3">
            <h1 className="text-3xl sm:text-5xl font-black text-slate-900 tracking-tight leading-tight flex items-center justify-center gap-3 flex-wrap">
              <span>🎤</span>
              <span>{t('hero.title')}</span>
            </h1>
            <p className="text-base sm:text-xl text-slate-600 font-medium max-w-2xl mx-auto leading-relaxed">
              {t('hero.subtitle')}
            </p>
          </div>

          {/* Search Box Card with Voice Mic */}
          <form
            onSubmit={handleSearchSubmit}
            className="mt-8 bg-white p-3 sm:p-4 rounded-3xl shadow-xl shadow-slate-200/70 border border-slate-200 space-y-3"
            role="search"
            aria-label="Citizen need search"
          >
            <div className="relative flex flex-col sm:flex-row items-center gap-3">
              <div className="relative flex-1 w-full">
                <label htmlFor="citizen-need-input" className="sr-only">
                  {t('hero.title')}
                </label>
                <input
                  id="citizen-need-input"
                  type="text"
                  value={query}
                  onChange={(e) => handleQueryChange(e.target.value)}
                  placeholder={t('hero.inputPlaceholder')}
                  className="w-full pl-5 pr-14 py-4 text-base sm:text-lg bg-slate-50 hover:bg-white focus:bg-white rounded-2xl border border-slate-200 focus:border-emerald-500 focus:ring-4 focus:ring-emerald-500/10 text-slate-900 placeholder:text-slate-400 transition-all font-medium"
                />

                {/* Microphone Button inside input for quick access */}
                <button
                  type="button"
                  onClick={handleToggleSpeech}
                  aria-label={isListening ? t('hero.listening') : t('hero.speakBtn')}
                  title={isListening ? t('hero.listening') : t('hero.speakBtn')}
                  className={`absolute right-2.5 top-1/2 -translate-y-1/2 p-2.5 rounded-xl transition-all min-h-[44px] min-w-[44px] flex items-center justify-center ${
                    isListening
                      ? 'bg-rose-600 text-white animate-pulse ring-4 ring-rose-300'
                      : 'bg-emerald-100 hover:bg-emerald-200 text-emerald-800'
                  }`}
                >
                  {isListening ? (
                    <MicOff className="w-5 h-5 text-white" />
                  ) : (
                    <Mic className="w-5 h-5 text-emerald-800" />
                  )}
                </button>
              </div>

              {/* Find Services Button */}
              <button
                type="submit"
                disabled={!query.trim()}
                className="w-full sm:w-auto px-7 py-4 rounded-2xl bg-emerald-600 hover:bg-emerald-700 disabled:bg-slate-300 disabled:cursor-not-allowed text-white font-bold text-base shadow-md shadow-emerald-600/20 min-h-[52px] flex items-center justify-center gap-2 transition-all"
              >
                <Search className="w-5 h-5" aria-hidden="true" />
                <span>{t('hero.searchBtn')}</span>
              </button>
            </div>

            {/* Listening indicator or speech error notice */}
            {isListening && (
              <div className="flex items-center justify-center gap-2 text-rose-600 text-sm font-semibold py-1">
                <span className="w-2.5 h-2.5 rounded-full bg-rose-600 animate-ping"></span>
                <span>{t('hero.listening')}</span>
              </div>
            )}

            {speechError && (
              <div className="text-rose-600 text-xs text-center py-1 bg-rose-50 rounded-lg p-2 border border-rose-200">
                {speechError}
              </div>
            )}

            {/* Persona Quick Prompt Chips */}
            <div className="pt-2 border-t border-slate-100 flex flex-wrap items-center justify-center gap-2 text-xs">
              <span className="text-slate-400 font-medium">
                {language === 'te' ? 'ఇలా అడగండి:' : language === 'hi' ? 'पूछ कर देखें:' : 'Try asking:'}
              </span>
              {quickPrompts.map((item, idx) => {
                const text = item[language] || item.en;
                return (
                  <button
                    key={idx}
                    type="button"
                    onClick={() => {
                      setQuery(text);
                      detectAndSetLanguage(text);
                    }}
                    className="px-3 py-1.5 bg-slate-100 hover:bg-emerald-50 hover:text-emerald-800 text-slate-600 rounded-lg border border-slate-200 text-left truncate max-w-xs transition-colors"
                  >
                    "{text}"
                  </button>
                );
              })}
            </div>
          </form>

          {/* Quick Track Application CTA button */}
          <div className="pt-2 flex justify-center">
            <button
              onClick={() => onNavigate('track')}
              className="inline-flex items-center gap-2 text-sm font-semibold text-slate-700 hover:text-emerald-700 bg-white/80 hover:bg-white px-5 py-2.5 rounded-full border border-slate-200/80 shadow-sm transition-all min-h-[44px]"
            >
              <FileCheck className="w-4 h-4 text-emerald-600" aria-hidden="true" />
              <span>{t('hero.trackBtn')}</span>
              <ArrowRight className="w-4 h-4" aria-hidden="true" />
            </button>
          </div>
        </div>
      </section>

      {/* Category Cards Section */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mt-12 sm:mt-16 space-y-6">
        <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-2 border-b pb-4 border-slate-200">
          <div>
            <h2 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight">
              {t('categories.title')}
            </h2>
            <p className="text-sm sm:text-base text-slate-500 mt-1">
              {t('categories.subtitle')}
            </p>
          </div>
          <span className="text-xs font-semibold text-slate-400">
            {servicesData.length} {t('demoBadge')} available
          </span>
        </div>

        {/* Categories Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 sm:gap-6">
          {categories.map((cat) => {
            const Icon = cat.icon;
            return (
              <div
                key={cat.id}
                onClick={() => onSelectCategory(cat.id)}
                role="button"
                tabIndex={0}
                onKeyDown={(e) => e.key === 'Enter' && onSelectCategory(cat.id)}
                className={`group p-5 rounded-2xl border transition-all cursor-pointer shadow-sm hover:shadow-md hover:-translate-y-0.5 min-h-[110px] flex flex-col justify-between ${cat.bg}`}
              >
                <div className="flex items-start justify-between gap-3">
                  <div className={`p-3 rounded-xl ${cat.iconBg} shadow-sm group-hover:scale-110 transition-transform`}>
                    <Icon className="w-6 h-6" aria-hidden="true" />
                  </div>
                  <span className="text-[11px] font-bold px-2 py-0.5 rounded-full bg-white/80 border border-slate-200 text-slate-700">
                    {cat.count > 0 ? `${cat.count} services` : '0 available'}
                  </span>
                </div>

                <div className="mt-4 flex items-center justify-between">
                  <h3 className="font-bold text-base sm:text-lg text-slate-900 group-hover:text-emerald-700 transition-colors">
                    {t(cat.nameKey)}
                  </h3>
                  <ArrowRight className="w-4 h-4 text-slate-400 group-hover:translate-x-1 group-hover:text-emerald-600 transition-all" />
                </div>
              </div>
            );
          })}
        </div>
      </section>

      {/* Accessibility & Voice assistance helper banner */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mt-12">
        <div className="bg-gradient-to-r from-blue-50 to-indigo-50 border border-blue-200/80 rounded-2xl p-5 sm:p-6 flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-4 text-left">
            <div className="p-3 bg-blue-600 text-white rounded-xl shadow-md shrink-0">
              <Volume2 className="w-6 h-6" aria-hidden="true" />
            </div>
            <div>
              <h4 className="font-bold text-slate-900 text-base">
                {language === 'te'
                  ? 'చదివి వినిపించే సదుపాయం కావాలా?'
                  : language === 'hi'
                  ? 'क्या आपको बोलकर सुनने की सुविधा चाहिए?'
                  : 'Prefer voice and speech guidance?'}
              </h4>
              <p className="text-xs sm:text-sm text-slate-600">
                {language === 'te'
                  ? 'పైన ఉన్న సౌలభ్య ఎంపికలలో "రీడ్ అలౌడ్" ఆన్ చేసుకోండి.'
                  : language === 'hi'
                  ? 'ऊपर सुलभता सेटिंग्स में "रीड अलाउड" चालू करें।'
                  : 'Activate Read Aloud in Accessibility settings or use the mic to search in Telugu, Hindi or English.'}
              </p>
            </div>
          </div>
          <button
            onClick={() => {
              if (isSpeaking) {
                stopSpeaking();
              } else {
                speak(
                  language === 'te'
                    ? 'సేవాసారథికి స్వాగతం. ప్రభుత్వ సేవలు సులభంగా పొందడానికి మీ అవసరాన్ని మైక్రోఫోన్ ద్వారా మాట్లాడండి లేదా టైప్ చేయండి.'
                    : language === 'hi'
                    ? 'सेवासारथी में आपका स्वागत है। सरकारी सेवाओं को आसानी से प्राप्त करने के लिए अपनी आवश्यकता बोलें या लिखें।'
                    : 'Welcome to SevaSaarthi. Just tell us what you need by voice or text to discover matching government schemes.'
                );
              }
            }}
            className="w-full sm:w-auto px-5 py-2.5 rounded-xl bg-blue-600 hover:bg-blue-700 text-white font-semibold text-sm shadow-sm flex items-center justify-center gap-2 min-h-[44px] shrink-0"
          >
            <Volume2 className="w-4 h-4" />
            <span>{isSpeaking ? 'Stop Audio' : 'Play Audio Intro'}</span>
          </button>
        </div>
      </section>
    </div>
  );
};
