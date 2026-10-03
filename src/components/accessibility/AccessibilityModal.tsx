import React, { useEffect, useRef } from 'react';
import { useAccessibility, TextSize } from '../../context/AccessibilityContext';
import { useLanguage } from '../../context/LanguageContext';
import { X, Type, Eye, Zap, Volume2, Database, Check, Sparkles } from 'lucide-react';

interface AccessibilityModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const AccessibilityModal: React.FC<AccessibilityModalProps> = ({ isOpen, onClose }) => {
  const {
    textSize,
    setTextSize,
    highContrast,
    setHighContrast,
    reduceMotion,
    setReduceMotion,
    simplifiedUI,
    setSimplifiedUI,
    dataSaver,
    setDataSaver,
    readAloudEnabled,
    setReadAloudEnabled,
    testVoice,
    getVoiceStatus,
  } = useAccessibility();
  const { language, t } = useLanguage();
  const modalRef = useRef<HTMLDivElement>(null);
  const voiceStatus = getVoiceStatus(language);

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape' && isOpen) {
        onClose();
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm"
      role="dialog"
      aria-modal="true"
      aria-labelledby="accessibility-title"
      onClick={onClose}
    >
      <div
        ref={modalRef}
        className="w-full max-w-lg bg-white rounded-2xl shadow-2xl p-6 sm:p-8 space-y-6 border border-slate-200"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex items-center justify-between border-b pb-4 border-slate-100">
          <div className="flex items-center gap-3">
            <div className="p-2.5 rounded-xl bg-blue-50 text-blue-700">
              <Eye className="w-6 h-6" aria-hidden="true" />
            </div>
            <div>
              <h2 id="accessibility-title" className="text-xl font-bold text-slate-900">
                {t('accessibility.title')}
              </h2>
              <p className="text-xs text-slate-500">Accessible & Inclusive Experience</p>
            </div>
          </div>
          <button
            onClick={onClose}
            aria-label={t('accessibility.close')}
            className="p-2 text-slate-400 hover:text-slate-700 rounded-full hover:bg-slate-100 min-h-[44px] min-w-[44px] flex items-center justify-center transition-colors"
          >
            <X className="w-6 h-6" />
          </button>
        </div>

        <div className="space-y-6 max-h-[70vh] overflow-y-auto pr-1">
          {/* Text Size */}
          <div className="space-y-2">
            <label className="text-sm font-semibold text-slate-800 flex items-center gap-2">
              <Type className="w-4 h-4 text-slate-600" aria-hidden="true" />
              {t('accessibility.textSize')}
            </label>
            <div className="grid grid-cols-3 gap-2" role="group" aria-label={t('accessibility.textSize')}>
              {(['normal', 'large', 'xlarge'] as TextSize[]).map((size) => {
                const isSelected = textSize === size;
                const labels: Record<TextSize, string> = {
                  normal: t('accessibility.textSizeNormal'),
                  large: t('accessibility.textSizeLarge'),
                  xlarge: t('accessibility.textSizeXLarge'),
                };
                return (
                  <button
                    key={size}
                    onClick={() => setTextSize(size)}
                    aria-pressed={isSelected}
                    className={`py-3 px-3 rounded-xl border text-sm font-medium transition-all min-h-[44px] flex items-center justify-center gap-1.5 ${
                      isSelected
                        ? 'border-blue-600 bg-blue-50 text-blue-700 font-bold ring-2 ring-blue-600'
                        : 'border-slate-200 hover:border-slate-300 text-slate-700 bg-white'
                    }`}
                  >
                    {isSelected && <Check className="w-4 h-4 text-blue-600" />}
                    <span>{labels[size]}</span>
                  </button>
                );
              })}
            </div>
          </div>

          {/* High Contrast */}
          <div className="flex items-center justify-between p-4 rounded-xl border border-slate-200 bg-slate-50/70 hover:bg-slate-50 transition-colors">
            <div className="pr-4">
              <span className="block font-semibold text-slate-900 text-sm">
                {t('accessibility.highContrast')}
              </span>
              <span className="text-xs text-slate-500">
                Enhance contrast for low vision and sunlight readability
              </span>
            </div>
            <button
              onClick={() => setHighContrast(!highContrast)}
              role="switch"
              aria-checked={highContrast}
              aria-label={t('accessibility.highContrast')}
              className={`w-14 h-8 flex items-center rounded-full p-1 transition-colors min-h-[44px] ${
                highContrast ? 'bg-blue-600 justify-end' : 'bg-slate-300 justify-start'
              }`}
            >
              <div className="w-6 h-6 rounded-full bg-white shadow-md transform transition-transform" />
            </button>
          </div>

          {/* Reduce Motion */}
          <div className="flex items-center justify-between p-4 rounded-xl border border-slate-200 bg-slate-50/70 hover:bg-slate-50 transition-colors">
            <div className="pr-4">
              <span className="block font-semibold text-slate-900 text-sm flex items-center gap-1.5">
                <Zap className="w-4 h-4 text-amber-500" aria-hidden="true" />
                {t('accessibility.reduceMotion')}
              </span>
              <span className="text-xs text-slate-500">
                Disables transitions and animations for vestibular comfort
              </span>
            </div>
            <button
              onClick={() => setReduceMotion(!reduceMotion)}
              role="switch"
              aria-checked={reduceMotion}
              aria-label={t('accessibility.reduceMotion')}
              className={`w-14 h-8 flex items-center rounded-full p-1 transition-colors min-h-[44px] ${
                reduceMotion ? 'bg-blue-600 justify-end' : 'bg-slate-300 justify-start'
              }`}
            >
              <div className="w-6 h-6 rounded-full bg-white shadow-md transform transition-transform" />
            </button>
          </div>

          {/* Simplified Interface */}
          <div className="flex items-center justify-between p-4 rounded-xl border border-slate-200 bg-slate-50/70 hover:bg-slate-50 transition-colors">
            <div className="pr-4">
              <span className="block font-semibold text-slate-900 text-sm flex items-center gap-1.5">
                <Sparkles className="w-4 h-4 text-teal-600" aria-hidden="true" />
                {t('accessibility.simplifiedUI')}
              </span>
              <span className="text-xs text-slate-500">
                Removes decorative elements and presents plain, distraction-free cards
              </span>
            </div>
            <button
              onClick={() => setSimplifiedUI(!simplifiedUI)}
              role="switch"
              aria-checked={simplifiedUI}
              aria-label={t('accessibility.simplifiedUI')}
              className={`w-14 h-8 flex items-center rounded-full p-1 transition-colors min-h-[44px] ${
                simplifiedUI ? 'bg-teal-600 justify-end' : 'bg-slate-300 justify-start'
              }`}
            >
              <div className="w-6 h-6 rounded-full bg-white shadow-md transform transition-transform" />
            </button>
          </div>

          {/* Data Saver */}
          <div className="flex items-center justify-between p-4 rounded-xl border border-slate-200 bg-slate-50/70 hover:bg-slate-50 transition-colors">
            <div className="pr-4">
              <span className="block font-semibold text-slate-900 text-sm flex items-center gap-1.5">
                <Database className="w-4 h-4 text-emerald-600" aria-hidden="true" />
                {t('accessibility.dataSaver')}
              </span>
              <span className="text-xs text-slate-500">
                {t('accessibility.dataSaverDesc')}
              </span>
            </div>
            <button
              onClick={() => setDataSaver(!dataSaver)}
              role="switch"
              aria-checked={dataSaver}
              aria-label={t('accessibility.dataSaver')}
              className={`w-14 h-8 flex items-center rounded-full p-1 transition-colors min-h-[44px] ${
                dataSaver ? 'bg-emerald-600 justify-end' : 'bg-slate-300 justify-start'
              }`}
            >
              <div className="w-6 h-6 rounded-full bg-white shadow-md transform transition-transform" />
            </button>
          </div>

          {/* Read Aloud & Voice Configuration */}
          <div className="p-4 rounded-xl border border-slate-200 bg-slate-50/70 space-y-3.5">
            <div className="flex items-center justify-between">
              <div className="pr-4">
                <span className="block font-semibold text-slate-900 text-sm flex items-center gap-1.5">
                  <Volume2 className="w-4 h-4 text-purple-600" aria-hidden="true" />
                  {t('accessibility.readAloud')}
                </span>
                <span className="text-xs text-slate-500">
                  {language === 'te'
                    ? 'శీర్షికలు, ఫలితాలు మరియు దశలను ఎంచుకున్న భాషలో చదివి వినిపిస్తుంది'
                    : language === 'hi'
                    ? 'शीर्षक, परिणाम और चरण-दर-चरण मार्गदर्शन बोलकर सुनाता है'
                    : 'Speaks out titles, results, and step-by-step guidance'}
                </span>
              </div>
              <button
                onClick={() => setReadAloudEnabled(!readAloudEnabled)}
                role="switch"
                aria-checked={readAloudEnabled}
                aria-label={t('accessibility.readAloud')}
                className={`w-14 h-8 flex items-center rounded-full p-1 transition-colors min-h-[44px] ${
                  readAloudEnabled ? 'bg-purple-600 justify-end' : 'bg-slate-300 justify-start'
                }`}
              >
                <div className="w-6 h-6 rounded-full bg-white shadow-md transform transition-transform" />
              </button>
            </div>

            {/* Voice Readiness & Voice Test Action */}
            <div className="pt-3 border-t border-slate-200/80 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
              <div className="space-y-1">
                <div className="flex items-center gap-1.5 text-xs font-bold">
                  {voiceStatus.loading ? (
                    <span className="text-slate-500 flex items-center gap-1.5">
                      <span className="w-2 h-2 rounded-full bg-slate-400 animate-pulse"></span>
                      {language === 'te'
                        ? 'వాయిస్‌లను శోధిస్తోంది...'
                        : language === 'hi'
                        ? 'वॉइस खोजी जा रही है...'
                        : 'Checking available voices...'}
                    </span>
                  ) : voiceStatus.installed ? (
                    <span className="text-emerald-700 flex items-center gap-1.5">
                      <span className="w-2 h-2 rounded-full bg-emerald-500"></span>
                      {language === 'te'
                        ? `తెలుగు వాయిస్ సిద్ధంగా ఉంది (${voiceStatus.voiceName || 'te-IN'})`
                        : language === 'hi'
                        ? `हिंदी वॉइस तैयार है (${voiceStatus.voiceName || 'hi-IN'})`
                        : `English Voice Ready (${voiceStatus.voiceName || 'en-IN'})`}
                    </span>
                  ) : (
                    <span className="text-amber-800 flex items-center gap-1.5">
                      <span className="w-2 h-2 rounded-full bg-amber-500"></span>
                      {language === 'te'
                        ? 'ప్రత్యేక వాయిస్ లేదు (సిస్టమ్ te-IN లో చదువుతుంది)'
                        : language === 'hi'
                        ? 'विशिष्ट वॉइस नहीं है (सिस्टम hi-IN में बोलेगा)'
                        : 'Default browser speech synthesizer in use'}
                    </span>
                  )}
                </div>
                <span className="text-[11px] text-slate-500 block">
                  Locale target: <code className="font-mono font-bold text-slate-700">{voiceStatus.locale}</code>
                </span>
              </div>

              <button
                type="button"
                onClick={() => testVoice()}
                className="inline-flex items-center justify-center gap-2 px-4 py-2 bg-purple-600 hover:bg-purple-700 text-white rounded-xl text-xs font-bold shadow-sm transition-all min-h-[40px] shrink-0"
              >
                <Volume2 className="w-4 h-4" />
                <span>
                  {language === 'te' ? 'వాయిస్ టెస్ట్ (Voice Test)' : language === 'hi' ? 'वॉइस टेस्ट (Voice Test)' : 'Voice Test'}
                </span>
              </button>
            </div>
          </div>
        </div>

        <div className="pt-2 border-t border-slate-100 flex justify-end">
          <button
            onClick={onClose}
            className="w-full sm:w-auto px-6 py-3 rounded-xl bg-slate-900 hover:bg-slate-800 text-white font-medium min-h-[44px] transition-colors focus:ring-2 focus:ring-offset-2 focus:ring-slate-900"
          >
            {t('accessibility.close')}
          </button>
        </div>
      </div>
    </div>
  );
};
