import React, { createContext, useContext, useState, useEffect, useRef, useCallback } from 'react';
import { useLanguage, Language } from './LanguageContext';
import { AlertCircle, X, Volume2 } from 'lucide-react';

export type TextSize = 'normal' | 'large' | 'xlarge';

interface AccessibilitySettings {
  textSize: TextSize;
  highContrast: boolean;
  reduceMotion: boolean;
  simplifiedUI: boolean;
  dataSaver: boolean;
  readAloudEnabled: boolean;
}

export interface VoiceStatus {
  installed: boolean;
  voiceName?: string;
  locale: string;
  loading?: boolean;
}

export interface VoiceMatchResult {
  voice: SpeechSynthesisVoice | null;
  locale: string;
  matchType: 'exact' | 'prefix' | 'name' | 'fallback' | 'none';
  voiceName?: string;
}

interface AccessibilityContextType extends AccessibilitySettings {
  setTextSize: (size: TextSize) => void;
  setHighContrast: (enabled: boolean) => void;
  setReduceMotion: (enabled: boolean) => void;
  setSimplifiedUI: (enabled: boolean) => void;
  setDataSaver: (enabled: boolean) => void;
  setReadAloudEnabled: (enabled: boolean) => void;
  speak: (text: string, customLang?: Language) => void;
  stopSpeaking: () => void;
  testVoice: (customLang?: Language) => void;
  isSpeaking: boolean;
  voiceWarning: string | null;
  clearVoiceWarning: () => void;
  getVoiceStatus: (lang: Language) => VoiceStatus;
  availableVoices: SpeechSynthesisVoice[];
  voicesLoaded: boolean;
}

const STORAGE_KEY = 'sevasaarthi_accessibility';

const defaultSettings: AccessibilitySettings = {
  textSize: 'normal',
  highContrast: false,
  reduceMotion: false,
  simplifiedUI: false,
  dataSaver: false,
  readAloudEnabled: false,
};

const AccessibilityContext = createContext<AccessibilityContextType | undefined>(undefined);

// Helper to split text into clean, short sentences without breaking words
const splitIntoSentences = (text: string): string[] => {
  if (!text) return [];
  // Split on standard punctuation (. ! ?) and Indic danda (।) or newlines
  const regex = /[^.!?।\n]+(?:[.!?।\n]+|$)/g;
  const matches = text.match(regex);
  if (!matches) return [text.trim()];

  return matches
    .map((s) => s.trim())
    .filter((s) => s.length > 0);
};

export const AccessibilityProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const { language } = useLanguage();
  const [settings, setSettings] = useState<AccessibilitySettings>(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEY);
      if (saved) {
        return { ...defaultSettings, ...JSON.parse(saved) };
      }
    } catch (e) {
      console.error('Failed to parse accessibility settings', e);
    }
    return defaultSettings;
  });

  const [isSpeaking, setIsSpeaking] = useState(false);
  const [voiceWarning, setVoiceWarning] = useState<string | null>(null);
  const [availableVoices, setAvailableVoices] = useState<SpeechSynthesisVoice[]>([]);
  const [voicesLoaded, setVoicesLoaded] = useState(false);

  // Track active speech session token to prevent race conditions during cancellation
  const activeSessionRef = useRef<symbol | null>(null);
  const warningTimerRef = useRef<any>(null);

  // Load and cache voices when browser speech engine is ready, with retries and debug logging
  useEffect(() => {
    if (typeof window === 'undefined' || !('speechSynthesis' in window)) {
      setVoicesLoaded(true);
      return;
    }

    const logAndSaveVoices = (stage: string) => {
      const voices = window.speechSynthesis.getVoices();
      console.log(`[TTS Engine] Voices retrieved (${stage}) - total count: ${voices.length}`);
      voices.forEach((v, index) => {
        console.log(`  [${index + 1}] name: "${v.name}" | lang: "${v.lang}" | localService: ${v.localService}`);
      });
      if (voices.length > 0) {
        setAvailableVoices(voices);
      }
      return voices;
    };

    // 1. Initial attempt
    const initialVoices = logAndSaveVoices('initial');
    if (initialVoices.length > 0) {
      setVoicesLoaded(true);
    }

    // 2. voiceschanged event listener
    const onVoicesChanged = () => {
      const voices = logAndSaveVoices('voiceschanged event');
      if (voices.length > 0) {
        setVoicesLoaded(true);
      }
    };
    window.speechSynthesis.addEventListener('voiceschanged', onVoicesChanged);

    // 3. Retry after 500ms
    const timer500 = setTimeout(() => {
      const voices = logAndSaveVoices('500ms retry');
      if (voices.length > 0) {
        setVoicesLoaded(true);
      }
    }, 500);

    // 4. Retry after 1500ms (marks voicesLoaded = true so warnings are never premature)
    const timer1500 = setTimeout(() => {
      logAndSaveVoices('1500ms retry');
      setVoicesLoaded(true);
    }, 1500);

    return () => {
      window.speechSynthesis.removeEventListener('voiceschanged', onVoicesChanged);
      clearTimeout(timer500);
      clearTimeout(timer1500);
    };
  }, []);

  // Update root HTML element attributes and accessibility styles
  useEffect(() => {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(settings));
    const root = document.documentElement;

    root.setAttribute('data-text-size', settings.textSize);
    root.setAttribute('data-high-contrast', String(settings.highContrast));
    root.setAttribute('data-reduce-motion', String(settings.reduceMotion));
    root.setAttribute('data-simplified-ui', String(settings.simplifiedUI));
    root.setAttribute('data-saver', String(settings.dataSaver));

    root.classList.remove('text-size-normal', 'text-size-large', 'text-size-xlarge');
    root.classList.add(`text-size-${settings.textSize}`);

    if (settings.highContrast) {
      root.classList.add('high-contrast');
    } else {
      root.classList.remove('high-contrast');
    }

    if (settings.reduceMotion) {
      root.classList.add('reduce-motion');
    } else {
      root.classList.remove('reduce-motion');
    }

    if (settings.dataSaver) {
      root.classList.add('data-saver');
    } else {
      root.classList.remove('data-saver');
    }
  }, [settings]);

  const updateSetting = <K extends keyof AccessibilitySettings>(key: K, value: AccessibilitySettings[K]) => {
    setSettings((prev) => ({ ...prev, [key]: value }));
  };

  /**
   * Flexible voice matcher prioritizing:
   * 1. Exact locale match (te-IN, hi-IN, en-IN)
   * 2. Language prefix match (te, hi, en)
   * 3. Name match (contains "Telugu", "Hindi", "English")
   */
  const findVoiceForLang = useCallback((targetLang: Language): VoiceMatchResult => {
    const allVoices =
      availableVoices.length > 0
        ? availableVoices
        : typeof window !== 'undefined' && 'speechSynthesis' in window
        ? window.speechSynthesis.getVoices()
        : [];

    if (targetLang === 'te') {
      const locale = 'te-IN';
      // 1. Exact locale match: te-in, te_in, te
      const exact = allVoices.find((v) => {
        const l = v.lang.toLowerCase().replace('_', '-');
        return l === 'te-in' || l === 'te';
      });
      if (exact) return { voice: exact, locale, matchType: 'exact', voiceName: exact.name };

      // 2. Language-prefix match: startsWith('te')
      const prefix = allVoices.find((v) => {
        const l = v.lang.toLowerCase().replace('_', '-');
        return l.startsWith('te');
      });
      if (prefix) return { voice: prefix, locale, matchType: 'prefix', voiceName: prefix.name };

      // 3. Name match: contains "telugu"
      const nameMatch = allVoices.find((v) => v.name.toLowerCase().includes('telugu'));
      if (nameMatch) return { voice: nameMatch, locale, matchType: 'name', voiceName: nameMatch.name };

      return { voice: null, locale, matchType: 'none' };
    }

    if (targetLang === 'hi') {
      const locale = 'hi-IN';
      // 1. Exact locale match: hi-in, hi_in, hi
      const exact = allVoices.find((v) => {
        const l = v.lang.toLowerCase().replace('_', '-');
        return l === 'hi-in' || l === 'hi';
      });
      if (exact) return { voice: exact, locale, matchType: 'exact', voiceName: exact.name };

      // 2. Language-prefix match: startsWith('hi')
      const prefix = allVoices.find((v) => {
        const l = v.lang.toLowerCase().replace('_', '-');
        return l.startsWith('hi');
      });
      if (prefix) return { voice: prefix, locale, matchType: 'prefix', voiceName: prefix.name };

      // 3. Name match: contains "hindi"
      const nameMatch = allVoices.find((v) => v.name.toLowerCase().includes('hindi'));
      if (nameMatch) return { voice: nameMatch, locale, matchType: 'name', voiceName: nameMatch.name };

      return { voice: null, locale, matchType: 'none' };
    }

    // Default English (Target en-IN first, then general English)
    const locale = 'en-IN';
    // 1. Exact locale match: en-in, en_in
    const exactEnIn = allVoices.find((v) => {
      const l = v.lang.toLowerCase().replace('_', '-');
      return l === 'en-in';
    });
    if (exactEnIn) return { voice: exactEnIn, locale: 'en-IN', matchType: 'exact', voiceName: exactEnIn.name };

    // 1b. Indian English by name
    const indiaEn = allVoices.find(
      (v) =>
        v.name.toLowerCase().includes('india') &&
        (v.lang.toLowerCase().startsWith('en') || v.name.toLowerCase().includes('english'))
    );
    if (indiaEn) return { voice: indiaEn, locale: 'en-IN', matchType: 'name', voiceName: indiaEn.name };

    // 2. Prefix match: any English dialect
    const anyEn = allVoices.find((v) => {
      const l = v.lang.toLowerCase().replace('_', '-');
      return l.startsWith('en');
    });
    if (anyEn) return { voice: anyEn, locale: anyEn.lang || 'en-IN', matchType: 'prefix', voiceName: anyEn.name };

    // 3. Name match: contains "english"
    const enName = allVoices.find((v) => v.name.toLowerCase().includes('english'));
    if (enName) return { voice: enName, locale: enName.lang || 'en-IN', matchType: 'name', voiceName: enName.name };

    if (allVoices.length > 0) {
      return { voice: allVoices[0], locale: allVoices[0].lang || 'en-IN', matchType: 'fallback', voiceName: allVoices[0].name };
    }

    return { voice: null, locale: 'en-IN', matchType: 'none' };
  }, [availableVoices]);

  const getVoiceStatus = useCallback(
    (lang: Language): VoiceStatus => {
      const match = findVoiceForLang(lang);
      return {
        installed: match.matchType !== 'none',
        voiceName: match.voiceName,
        locale: match.locale,
        loading: !voicesLoaded,
      };
    },
    [findVoiceForLang, voicesLoaded]
  );

  const stopSpeaking = useCallback(() => {
    activeSessionRef.current = null;
    if (typeof window !== 'undefined' && 'speechSynthesis' in window) {
      window.speechSynthesis.cancel();
    }
    setIsSpeaking(false);
  }, []);

  const clearVoiceWarning = useCallback(() => {
    if (warningTimerRef.current) {
      clearTimeout(warningTimerRef.current);
      warningTimerRef.current = null;
    }
    setVoiceWarning(null);
  }, []);

  const showTemporaryWarning = useCallback((message: string) => {
    if (warningTimerRef.current) {
      clearTimeout(warningTimerRef.current);
    }
    setVoiceWarning(message);
    warningTimerRef.current = setTimeout(() => {
      setVoiceWarning(null);
      warningTimerRef.current = null;
    }, 6000);
  }, []);

  /**
   * Speak text sequentially in short sentences using proper locale and voice.
   * If a specific voice is not installed, speaks with utterance.lang and no voice set without blocking.
   */
  const speak = useCallback(
    (text: string, customLang?: Language) => {
      if (typeof window === 'undefined' || !('speechSynthesis' in window) || !text) return;

      // Immediately stop any existing speech session
      stopSpeaking();

      const targetLang = customLang || language;
      const match = findVoiceForLang(targetLang);
      const { voice, locale, matchType } = match;

      // If no voice is found after loading, show a small non-blocking note and STILL speak
      if (matchType === 'none') {
        if (voicesLoaded) {
          const note =
            targetLang === 'te'
              ? 'సిస్టమ్‌లో నిర్దిష్ట తెలుగు వాయిస్ లేదు. సాధారణ te-IN లో చదువుతోంది.'
              : targetLang === 'hi'
              ? 'विशिष्ट हिंदी वॉइस नहीं मिली। मानक hi-IN में बोला जा रहा है।'
              : 'Specific regional voice not found. Speaking with system locale.';
          showTemporaryWarning(note);
        }
      } else {
        clearVoiceWarning();
      }

      const sentences = splitIntoSentences(text);
      if (sentences.length === 0) return;

      const currentSession = Symbol('speech_session');
      activeSessionRef.current = currentSession;
      setIsSpeaking(true);

      const playSentenceIndex = (index: number) => {
        // Abort if session was cancelled
        if (activeSessionRef.current !== currentSession) return;

        if (index >= sentences.length) {
          setIsSpeaking(false);
          activeSessionRef.current = null;
          return;
        }

        const sentence = sentences[index];
        const utterance = new SpeechSynthesisUtterance(sentence);
        utterance.lang = locale;
        if (voice) {
          utterance.voice = voice;
        }
        utterance.rate = 0.95;

        utterance.onend = () => {
          if (activeSessionRef.current === currentSession) {
            playSentenceIndex(index + 1);
          }
        };

        utterance.onerror = (e) => {
          console.warn('[TTS Engine] Utterance error:', e);
          if (activeSessionRef.current === currentSession) {
            setIsSpeaking(false);
            activeSessionRef.current = null;
          }
        };

        window.speechSynthesis.speak(utterance);
      };

      playSentenceIndex(0);
    },
    [language, findVoiceForLang, voicesLoaded, stopSpeaking, clearVoiceWarning, showTemporaryWarning]
  );

  /**
   * Voice test helper that reads one localized sentence to verify speech settings
   */
  const testVoice = useCallback(
    (customLang?: Language) => {
      const targetLang = customLang || language;
      const testSentences: Record<Language, string> = {
        en: 'Welcome to SevaSaarthi. Your civic assistant is ready.',
        te: 'సేవాసారథికి స్వాగతం. మీ పౌర సహాయకుడు సిద్ధంగా ఉన్నాడు.',
        hi: 'सेवासारथी में आपका स्वागत है। आपका नागरिक सहायक तैयार है।',
      };

      speak(testSentences[targetLang], targetLang);
    },
    [language, speak]
  );

  return (
    <AccessibilityContext.Provider
      value={{
        ...settings,
        setTextSize: (size) => updateSetting('textSize', size),
        setHighContrast: (val) => updateSetting('highContrast', val),
        setReduceMotion: (val) => updateSetting('reduceMotion', val),
        setSimplifiedUI: (val) => updateSetting('simplifiedUI', val),
        setDataSaver: (val) => updateSetting('dataSaver', val),
        setReadAloudEnabled: (val) => updateSetting('readAloudEnabled', val),
        speak,
        stopSpeaking,
        testVoice,
        isSpeaking,
        voiceWarning,
        clearVoiceWarning,
        getVoiceStatus,
        availableVoices,
        voicesLoaded,
      }}
    >
      {/* Small, non-blocking notification note for speech engine status */}
      {voiceWarning && (
        <div
          role="status"
          aria-live="polite"
          className="fixed bottom-20 right-4 sm:right-6 z-40 max-w-sm bg-slate-900/95 text-slate-100 px-3.5 py-2.5 rounded-2xl shadow-xl border border-slate-700/80 backdrop-blur flex items-center gap-2.5 text-xs animate-slideUp pointer-events-auto"
        >
          <Volume2 className="w-4 h-4 shrink-0 text-emerald-400" />
          <p className="flex-1 leading-snug">{voiceWarning}</p>
          <button
            onClick={clearVoiceWarning}
            className="p-1 rounded-lg hover:bg-slate-800 text-slate-400 hover:text-white transition-colors"
            aria-label="Close message"
          >
            <X className="w-3.5 h-3.5" />
          </button>
        </div>
      )}

      {children}
    </AccessibilityContext.Provider>
  );
};

export const useAccessibility = (): AccessibilityContextType => {
  const context = useContext(AccessibilityContext);
  if (!context) {
    throw new Error('useAccessibility must be used within an AccessibilityProvider');
  }
  return context;
};
