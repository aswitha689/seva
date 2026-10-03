import React, { useState, useEffect } from 'react';
import { Application } from '../types/application';
import { useLanguage } from '../context/LanguageContext';
import { useAccessibility } from '../context/AccessibilityContext';
import { useNotification } from '../context/NotificationContext';
import { JourneyComparison } from '../components/comparison/JourneyComparison';
import { AcknowledgementModal } from '../components/common/AcknowledgementModal';
import {
  CheckCircle2,
  Copy,
  Check,
  Calendar,
  Building,
  ShieldCheck,
  ArrowRight,
  Home as HomeIcon,
  Volume2,
  Sparkles,
  Layers,
  Info,
  Printer
} from 'lucide-react';

interface SubmissionSuccessProps {
  application: Application;
  onNavigate: (route: string, params?: any) => void;
}

export const SubmissionSuccess: React.FC<SubmissionSuccessProps> = ({
  application,
  onNavigate,
}) => {
  const { language, t } = useLanguage();
  const { speak, isSpeaking, stopSpeaking, readAloudEnabled } = useAccessibility();
  const { addNotification } = useNotification();

  const [copied, setCopied] = useState(false);
  const [showComparison, setShowComparison] = useState(false);
  const [isAckOpen, setIsAckOpen] = useState(false);

  useEffect(() => {
    addNotification({
      type: 'success',
      title: language === 'te' ? 'దరఖాస్తు సమర్పించబడింది 🎉' : language === 'hi' ? 'आवेदन सफलतापूर्वक जमा हुआ 🎉' : 'Application Submitted 🎉',
      message:
        language === 'te'
          ? `మీ దరఖాస్తు ${application.id} సంక్షేమ వ్యవస్థలో నమోదు చేయబడింది.`
          : language === 'hi'
          ? `आपका आवेदन ${application.id} कल्याणकारी कतार में पंजीकृत है।`
          : `Your application ${application.id} is registered in the state welfare queue.`,
    });

    if (readAloudEnabled) {
      speak(
        language === 'te'
          ? `మీ దరఖాస్తు విజయవంతంగా సమర్పించబడింది. మీ దరఖాస్తు ఐడీ ${application.id}.`
          : language === 'hi'
          ? `आपका आवेदन सफलतापूर्वक जमा हो गया है। आपका आवेदन आईडी ${application.id} है।`
          : `Application submitted successfully. Your tracking ID is ${application.id}.`
      );
    }
  }, [application.id]);

  const handleCopy = () => {
    navigator.clipboard.writeText(application.id);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleReadAloud = () => {
    if (isSpeaking) {
      stopSpeaking();
    } else {
      speak(
        language === 'te'
          ? `దరఖాస్తు సమర్పించబడింది. దరఖాస్తు ఐడీ ${application.id}. పథకం: ${application.serviceName_te || application.serviceName}. ప్రస్తుత స్థితి: సమర్పించబడింది.`
          : language === 'hi'
          ? `आवेदन सफलतापूर्वक जमा हो गया। ट्रैकिंग आईडी ${application.id} है। योजना: ${application.serviceName_hi || application.serviceName}। वर्तमान स्थिति: जमा किया गया।`
          : `Application submitted. Tracking ID: ${application.id}. Scheme: ${application.serviceName}. Status: Submitted. Next stage: Document Scrutiny.`
      );
    }
  };

  const serviceName =
    language === 'te'
      ? application.serviceName_te || application.serviceName
      : language === 'hi'
      ? application.serviceName_hi || application.serviceName
      : application.serviceName;

  return (
    <div className="flex-1 max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-10 sm:py-16 space-y-8">
      {/* Success Card */}
      <div className="bg-white rounded-3xl border border-slate-200 shadow-2xl p-6 sm:p-10 text-center space-y-6">
        {/* Top actions: Read aloud & Journey view */}
        <div className="flex items-center justify-between">
          <button
            onClick={handleReadAloud}
            className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-semibold min-h-[40px] transition-colors"
          >
            <Volume2 className="w-4 h-4 text-emerald-600" />
            <span>
              {isSpeaking
                ? (language === 'te' ? 'ఆడియో ఆపండి' : language === 'hi' ? 'ऑडियो रोकें' : 'Stop Audio')
                : (language === 'te' ? '🔊 చదివి వినిపించు' : language === 'hi' ? '🔊 बोलकर सुनाएं' : '🔊 Read Aloud')}
            </span>
          </button>

          <button
            onClick={() => setShowComparison(!showComparison)}
            className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-xl bg-emerald-50 hover:bg-emerald-100 text-emerald-800 text-xs font-bold border border-emerald-300 min-h-[40px] transition-colors"
          >
            <Sparkles className="w-4 h-4 text-emerald-600" />
            <span>
              {showComparison
                ? (language === 'te' ? 'పోలికను దాచండి' : language === 'hi' ? 'तुलना छुपाएं' : 'Hide Comparison')
                : (language === 'te' ? 'మీ ప్రయాణం, సులభతరం ⚖️' : language === 'hi' ? 'आपकी यात्रा, आसान ⚖️' : 'Your Journey, Simplified ⚖️')}
            </span>
          </button>
        </div>

        {/* Celebration Icon */}
        <div className="mx-auto w-20 h-20 rounded-3xl bg-emerald-100 text-emerald-600 flex items-center justify-center shadow-lg shadow-emerald-500/20">
          <CheckCircle2 className="w-12 h-12" aria-hidden="true" />
        </div>

        <div className="space-y-2">
          <h1 className="text-3xl sm:text-4xl font-black text-slate-900 tracking-tight">
            {t('submitted.heading')}
          </h1>
          <p className="text-base text-slate-600 max-w-md mx-auto">
            {t('submitted.subtext')}
          </p>
        </div>

        {/* Generated Application ID Box */}
        <div className="p-4 sm:p-5 rounded-2xl bg-slate-50 border-2 border-dashed border-emerald-300 max-w-md mx-auto space-y-1.5">
          <span className="text-xs uppercase font-bold tracking-wider text-slate-500">
            {t('submitted.trackingIdLabel')}
          </span>
          <div className="flex items-center justify-center gap-3">
            <span className="text-2xl sm:text-3xl font-black text-emerald-800 font-mono tracking-wider">
              {application.id}
            </span>
            <button
              onClick={handleCopy}
              className="p-2 text-slate-500 hover:text-emerald-700 bg-white rounded-xl border border-slate-200 shadow-sm transition-colors min-h-[40px] min-w-[40px] flex items-center justify-center"
              title="Copy Application ID"
              aria-label="Copy Application ID"
            >
              {copied ? <Check className="w-4 h-4 text-emerald-600" /> : <Copy className="w-4 h-4" />}
            </button>
          </div>
          {copied && (
            <span className="text-[11px] font-bold text-emerald-600 block">
              {t('submitted.copied')}
            </span>
          )}
        </div>

        {/* Application Summary Grid */}
        <div className="bg-slate-50/80 rounded-2xl p-5 border border-slate-200 text-left space-y-3 text-xs sm:text-sm">
          <div className="flex items-center justify-between border-b pb-2.5 border-slate-200">
            <span className="text-slate-500 font-medium">{t('submitted.appliedScheme')}</span>
            <span className="font-bold text-slate-900 text-right">{serviceName}</span>
          </div>

          <div className="flex items-center justify-between border-b pb-2.5 border-slate-200">
            <span className="text-slate-500 font-medium">{t('submitted.department')}</span>
            <span className="font-bold text-slate-800 text-right">
              {language === 'te'
                ? (application as any).department_te || application.department
                : language === 'hi'
                ? (application as any).department_hi || application.department
                : application.department}
            </span>
          </div>

          <div className="flex items-center justify-between border-b pb-2.5 border-slate-200">
            <span className="text-slate-500 font-medium">{t('submitted.timestamp')}</span>
            <span className="font-semibold text-slate-800">{application.submittedAt}</span>
          </div>

          <div className="flex items-center justify-between border-b pb-2.5 border-slate-200">
            <span className="text-slate-500 font-medium">{t('submitted.currentStatus')}</span>
            <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-bold bg-blue-100 text-blue-800 border border-blue-200">
              {language === 'te' ? 'సమర్పించబడింది (దశ 1/5)' : language === 'hi' ? 'जमा किया गया (चरण 1/5)' : 'Submitted (Stage 1 of 5)'}
            </span>
          </div>

          <div className="flex items-center justify-between">
            <span className="text-slate-500 font-medium">{t('submitted.nextStage')}</span>
            <span className="font-bold text-slate-900">
              {language === 'te'
                ? 'పత్రాల పరిశీలన మరియు కళాశాల అధికారి ధ్రువీకరణ'
                : language === 'hi'
                ? 'दस्तावेज़ जांच और कॉलेज अधिकारी सत्यापन'
                : 'Documents Scrutiny & College Officer Verification'}
            </span>
          </div>
        </div>

        {/* Mandatory Civic Disclaimer */}
        <div className="p-3.5 rounded-xl bg-amber-50 border border-amber-200 text-xs text-amber-900 flex items-center justify-center gap-2">
          <Info className="w-4 h-4 shrink-0 text-amber-700" />
          <span>{t('disclaimer')}</span>
        </div>

        {/* CTAs */}
        <div className="pt-2 flex flex-col sm:flex-row items-center justify-center gap-3 flex-wrap">
          <button
            onClick={() => onNavigate('track', { searchId: application.id })}
            className="w-full sm:w-auto px-7 py-3.5 rounded-2xl bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-sm shadow-lg shadow-emerald-600/25 flex items-center justify-center gap-2 min-h-[48px] transition-all"
          >
            <span>{t('submitted.trackBtn')}</span>
            <ArrowRight className="w-4 h-4" />
          </button>

          <button
            onClick={() => setIsAckOpen(true)}
            className="w-full sm:w-auto px-6 py-3.5 rounded-2xl bg-slate-900 hover:bg-slate-800 text-white font-bold text-sm shadow-md flex items-center justify-center gap-2 min-h-[48px] transition-all"
          >
            <Printer className="w-4 h-4" />
            <span>{t('submitted.downloadReceipt')}</span>
          </button>

          <button
            onClick={() => onNavigate('home')}
            className="w-full sm:w-auto px-6 py-3.5 rounded-2xl bg-slate-100 hover:bg-slate-200 text-slate-700 font-semibold text-sm min-h-[48px] flex items-center justify-center gap-2 transition-colors"
          >
            <HomeIcon className="w-4 h-4" />
            <span>{t('submitted.homeBtn')}</span>
          </button>
        </div>
      </div>

      {/* Official Acknowledgement Slip Modal */}
      <AcknowledgementModal
        application={application}
        isOpen={isAckOpen}
        onClose={() => setIsAckOpen(false)}
      />

      {/* Embedded "Your Journey, Simplified" Comparison Screen */}
      {showComparison && (
        <JourneyComparison
          onClose={() => setShowComparison(false)}
          onTrack={() => onNavigate('track', { searchId: application.id })}
        />
      )}
    </div>
  );
};
