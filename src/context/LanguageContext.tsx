import React, { createContext, useContext, useState, useEffect } from 'react';
import enTranslations from '../data/locales/en.json';
import teTranslations from '../data/locales/te.json';
import hiTranslations from '../data/locales/hi.json';

export type Language = 'en' | 'te' | 'hi';

/**
 * Detect language of input by Unicode script range:
 * - Telugu (U+0C00-U+0C7F) -> 'te'
 * - Devanagari (U+0900-U+097F) -> 'hi'
 * - Otherwise -> 'en'
 */
export const detectScriptLanguage = (input: string): Language => {
  if (!input) return 'en';
  // Telugu range: U+0C00 to U+0C7F
  if (/[\u0C00-\u0C7F]/.test(input)) {
    return 'te';
  }
  // Devanagari (Hindi) range: U+0900 to U+097F
  if (/[\u0900-\u097F]/.test(input)) {
    return 'hi';
  }
  return 'en';
};

interface LanguageContextType {
  language: Language;
  setLanguage: (lang: Language) => void;
  detectAndSetLanguage: (input: string) => Language;
  t: (path: string, fallback?: string) => string;
}

const translations: Record<Language, any> = {
  en: enTranslations,
  te: teTranslations,
  hi: hiTranslations,
};

const LanguageContext = createContext<LanguageContextType | undefined>(undefined);

export const LanguageProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [language, setLanguageState] = useState<Language>(() => {
    const saved = localStorage.getItem('sevasaarthi_lang');
    return (saved === 'te' || saved === 'hi' || saved === 'en') ? saved : 'en';
  });

  const setLanguage = (lang: Language) => {
    setLanguageState(lang);
    localStorage.setItem('sevasaarthi_lang', lang);
    document.documentElement.lang = lang;
  };

  const detectAndSetLanguage = (input: string): Language => {
    const detected = detectScriptLanguage(input);
    if (detected === 'te' || detected === 'hi') {
      setLanguage(detected);
    }
    return detected;
  };

  useEffect(() => {
    document.documentElement.lang = language;
  }, [language]);

  const t = (path: string, fallback: string = ''): string => {
    const keys = path.split('.');
    let curr = translations[language];
    for (const key of keys) {
      if (curr && typeof curr === 'object' && key in curr) {
        curr = curr[key];
      } else {
        // Fallback to English if missing in target language
        let fallbackCurr = translations.en;
        for (const fKey of keys) {
          if (fallbackCurr && typeof fallbackCurr === 'object' && fKey in fallbackCurr) {
            fallbackCurr = fallbackCurr[fKey];
          } else {
            return fallback || path;
          }
        }
        return typeof fallbackCurr === 'string' ? fallbackCurr : (fallback || path);
      }
    }
    return typeof curr === 'string' ? curr : (fallback || path);
  };

  return (
    <LanguageContext.Provider value={{ language, setLanguage, detectAndSetLanguage, t }}>
      {children}
    </LanguageContext.Provider>
  );
};

export const useLanguage = (): LanguageContextType => {
  const context = useContext(LanguageContext);
  if (!context) {
    throw new Error('useLanguage must be used within a LanguageProvider');
  }
  return context;
};
