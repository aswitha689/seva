import React, { useState, useEffect } from 'react';
import { Application, ApplicationStage } from '../types/application';
import { getApplications, getCitizenApplications, getApplicationById, updateApplicationStatus } from '../services/storage';
import { useLanguage } from '../context/LanguageContext';
import { useAccessibility } from '../context/AccessibilityContext';
import { useAuth } from '../context/AuthContext';
import { AcknowledgementModal } from '../components/common/AcknowledgementModal';
import {
  Search,
  CheckCircle2,
  Clock,
  AlertCircle,
  Building,
  ArrowRight,
  Bell,
  RefreshCw,
  Sparkles,
  Printer
} from 'lucide-react';

interface TrackingProps {
  initialAppId?: string;
  onNavigate: (route: string, params?: any) => void;
}

export const Tracking: React.FC<TrackingProps> = ({ initialAppId = '', onNavigate }) => {
  const { language, t } = useLanguage();
  const { speak, isSpeaking, stopSpeaking } = useAccessibility();
  const { user, isAdmin } = useAuth();
  const [selectedAppId, setSelectedAppId] = useState<string | null>(initialAppId ? initialAppId.trim() : null);
  const [searchId, setSearchId] = useState<string>(initialAppId ? initialAppId.trim() : '');
  const [applications, setApplications] = useState<Application[]>([]);
  const [searchError, setSearchError] = useState<string | null>(null);
  const [isAckOpen, setIsAckOpen] = useState(false);

  // Load saved applications list for the logged-in citizen
  const loadApps = () => {
    const list = getCitizenApplications(user);
    setApplications(list);
  };

  useEffect(() => {
    loadApps();
    const interval = setInterval(loadApps, 2000);
    window.addEventListener('storage', loadApps);
    return () => {
      clearInterval(interval);
      window.removeEventListener('storage', loadApps);
    };
  }, [user]);

  // Update selectedAppId if initialAppId prop changes externally
  useEffect(() => {
    if (initialAppId && initialAppId.trim()) {
      const cleanId = initialAppId.trim();
      setSelectedAppId(cleanId);
      setSearchId(cleanId);
      setSearchError(null);
    }
  }, [initialAppId]);

  // Derive activeApp strictly from user's selection - never silently default to Anitha
  const activeApp = selectedAppId
    ? applications.find((a) => a.id.toUpperCase() === selectedAppId.toUpperCase()) || null
    : null;

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const trimmed = searchId.trim();
    if (!trimmed) {
      setSearchError(
        language === 'te'
          ? 'దయచేసి దరఖాస్తు ఐడీని నమోదు చేయండి.'
          : language === 'hi'
          ? 'कृपया एक आवेदन आईडी दर्ज करें।'
          : 'Please enter an Application ID.'
      );
      return;
    }

    const found = applications.find((a) => a.id.toUpperCase() === trimmed.toUpperCase());
    if (found) {
      setSelectedAppId(found.id);
      setSearchId(found.id);
      setSearchError(null);
    } else {
      const globalFound = getApplicationById(trimmed);
      if (globalFound && !isAdmin) {
        setSearchError(
          language === 'te'
            ? `ఈ దరఖాస్తు ఐడీ (${trimmed}) మీ ఖాతాకు చెందినది కాదు.`
            : language === 'hi'
            ? `यह आवेदन आईडी (${trimmed}) आपके नागरिक खाते से संबंधित नहीं है।`
            : `This application ID (${trimmed}) does not belong to your citizen account.`
        );
      } else {
        setSearchError(
          language === 'te'
            ? `"${trimmed}" ఐడీతో ఎటువంటి దరఖాస్తు కనుగొనబడలేదు. దయచేసి ఐడీని సరిచూసుకోండి.`
            : language === 'hi'
            ? `"${trimmed}" आईडी के साथ कोई आवेदन नहीं मिला। कृपया कोड सत्यापित करें।`
            : `No application found with ID "${trimmed}". Please verify the code.`
        );
      }
    }
  };

  // Helper to advance application stage for demo simulation
  const handleAdvanceStage = () => {
    if (!activeApp) return;

    const stages: ApplicationStage[] = [
      'submitted',
      'documents_received',
      'department_review',
      'decision',
      'completed',
    ];
    const currentIdx = stages.indexOf(activeApp.status);

    if (currentIdx < stages.length - 1) {
      const nextStage = stages[currentIdx + 1];
      const stageNotes: Record<ApplicationStage, string> = {
        submitted: 'Application received and registered digitally.',
        documents_received: 'Income and student bonafide successfully verified by Collegiate Desk.',
        department_review: 'Welfare officer desk audit completed. Candidate meets merit quota.',
        decision: 'Sanction Order issued by Directorate of Higher Education. Grant approved.',
        completed: 'DBT remittance dispatched to citizen Aadhaar-linked bank account.',
      };

      const updated = updateApplicationStatus(activeApp.id, nextStage, stageNotes[nextStage]);
      if (updated) {
        loadApps();
      }
    }
  };

  return (
    <div className="flex-1 max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-12 space-y-8">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div className="space-y-1">
          <div className="flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-slate-500">
            <span>{t('tracking.tag') || 'Citizen Self-Service Portal'}</span>
            <span>•</span>
            <span className="text-emerald-700">{t('tracking.subTag') || 'Live Status Tracking'}</span>
          </div>
          <h1 className="text-2xl sm:text-4xl font-black text-slate-900 tracking-tight">
            {t('tracking.title') || 'Track Your Application'}
          </h1>
          <p className="text-sm sm:text-base text-slate-600">
            {t('tracking.subtitle') || 'Check real-time progress and departmental updates for your submitted schemes.'}
          </p>
        </div>

        {activeApp && (
          <button
            type="button"
            onClick={() => {
              if (isSpeaking) {
                stopSpeaking();
                return;
              }
              const currentStageEvent = activeApp.timeline.find((t) => t.status === 'current') || activeApp.timeline[0];
              const stageName =
                language === 'te'
                  ? currentStageEvent.stageName_te || currentStageEvent.stageName
                  : language === 'hi'
                  ? currentStageEvent.stageName_hi || currentStageEvent.stageName
                  : currentStageEvent.stageName;
              const stageDesc =
                language === 'te'
                  ? currentStageEvent.description_te || currentStageEvent.description
                  : language === 'hi'
                  ? currentStageEvent.description_hi || currentStageEvent.description
                  : currentStageEvent.description;
              const textToSpeak =
                language === 'te'
                  ? `దరఖాస్తు ఐడీ ${activeApp.id}. ప్రస్తుత స్థితి: ${stageName}. ${stageDesc}`
                  : language === 'hi'
                  ? `आवेदन आईडी ${activeApp.id}। वर्तमान स्थिति: ${stageName}। ${stageDesc}`
                  : `Application ${activeApp.id}. Current status is: ${stageName}. ${stageDesc}`;
              speak(textToSpeak);
            }}
            className="self-start sm:self-auto inline-flex items-center gap-1.5 px-3.5 py-2 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-semibold min-h-[40px] transition-colors shrink-0"
          >
            <span>
              {isSpeaking
                ? (language === 'te' ? 'ఆడియో ఆపండి' : language === 'hi' ? 'ऑडियो रोकें' : 'Stop Audio')
                : (language === 'te' ? '🔊 స్థితిని వినిపించు' : language === 'hi' ? '🔊 स्थिति सुनकर जानें' : '🔊 Read Aloud Status')}
            </span>
          </button>
        )}
      </div>

      {/* Search Input Card */}
      <div className="bg-white p-5 sm:p-7 rounded-3xl border border-slate-200 shadow-sm space-y-4">
        {/* Short Helper Line before tracking */}
        <p className="text-xs sm:text-sm text-slate-600 font-medium">
          {language === 'te'
            ? 'ప్రత్యక్ష స్థితి మరియు కాలక్రమాన్ని చూడటానికి మీ దరఖాస్తు ఐడీని నమోదు చేయండి లేదా క్రింద మీ దరఖాస్తులలో ఒకదాన్ని ఎంచుకోండి:'
            : language === 'hi'
            ? 'विभागीय प्रगति और समयरेखा देखने के लिए अपना आवेदन आईडी दर्ज करें या नीचे से चुनें:'
            : 'Enter your Application ID or choose from your applications below to view real-time status and timeline updates:'}
        </p>

        <form onSubmit={handleSearchSubmit} className="flex flex-col sm:flex-row gap-3">
          <div className="relative flex-1">
            <Search className="w-5 h-5 text-slate-400 absolute left-4 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              value={searchId}
              onChange={(e) => setSearchId(e.target.value)}
              placeholder={t('tracking.searchPlaceholder') || 'Enter Application ID (e.g. SV-2026-001247)'}
              className="w-full pl-12 pr-4 py-3.5 text-base rounded-2xl border border-slate-200 focus:border-emerald-500 focus:ring-4 focus:ring-emerald-500/10 font-mono font-bold text-slate-900"
            />
          </div>
          <button
            type="submit"
            className="px-8 py-3.5 rounded-2xl bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-sm shadow-md shadow-emerald-600/20 min-h-[48px] flex items-center justify-center gap-2 transition-all shrink-0"
          >
            <span>{t('tracking.searchBtn') || 'Track Application'}</span>
            <ArrowRight className="w-4 h-4" />
          </button>
        </form>

        {searchError && (
          <div className="p-3 bg-rose-50 border border-rose-200 text-rose-800 text-xs rounded-xl flex items-center gap-2 font-medium">
            <AlertCircle className="w-4 h-4 shrink-0 text-rose-600" />
            <span>{searchError}</span>
          </div>
        )}

        {/* Application selector buttons */}
        {applications.length > 0 ? (
          <div className="pt-3 border-t border-slate-100 flex items-center gap-2 flex-wrap text-xs">
            <span className="text-slate-500 font-semibold">
              {language === 'te' ? 'మీ దరఖాస్తులు:' : language === 'hi' ? 'आपके आवेदन:' : 'Your Applications:'}
            </span>
            {applications.map((app) => (
              <button
                key={app.id}
                type="button"
                onClick={() => {
                  setSelectedAppId(app.id);
                  setSearchId(app.id);
                  setSearchError(null);
                }}
                className={`px-3 py-1.5 rounded-xl border font-mono font-bold transition-all min-h-[36px] ${
                  activeApp?.id === app.id
                    ? 'bg-emerald-600 text-white border-emerald-600 shadow-sm'
                    : 'bg-slate-50 text-slate-700 border-slate-200 hover:bg-emerald-50 hover:border-emerald-300'
                }`}
              >
                {app.id} ({app.citizenName})
              </button>
            ))}
          </div>
        ) : (
          !isAdmin && (
            <div className="pt-3 border-t border-slate-100 text-xs text-slate-500 font-medium">
              {language === 'te'
                ? 'మీ ఖాతాలో ఇంకా ఎటువంటి సమర్పించిన దరఖాస్తులు లేవు. పథకాల కోసం శోధించి దరఖాస్తు చేయండి.'
                : language === 'hi'
                ? 'आपके खाते में अभी कोई जमा किया गया आवेदन नहीं है। योजनाओं की खोज करें और आवेदन करें।'
                : 'You do not have any submitted applications yet. Search for schemes to apply.'}
            </div>
          )
        )}
      </div>

      {/* Active Application Details & Vertical Timeline - ONLY visible after user asks for it */}
      {activeApp ? (
        <div className="space-y-6">
          {/* Citizen Notification Alert if stage was updated */}
          {activeApp.citizenNotification && (
            <div className="p-4 sm:p-5 rounded-2xl bg-emerald-50 border-2 border-emerald-400 text-emerald-950 flex items-start gap-3 shadow-sm animate-fadeIn">
              <Bell className="w-5 h-5 text-emerald-600 shrink-0 mt-0.5" />
              <div className="space-y-1">
                <span className="font-extrabold text-sm text-emerald-900 block">
                  {language === 'te' ? 'పౌరుని SMS & పోర్టల్ నోటిఫికేషన్' : language === 'hi' ? 'नागरिक एसएमएस और पोर्टल सूचना' : 'Citizen SMS & Portal Notification'}
                </span>
                <p className="text-xs sm:text-sm font-medium leading-relaxed">
                  {language === 'te'
                    ? (activeApp as any).citizenNotification_te || activeApp.citizenNotification
                    : language === 'hi'
                    ? (activeApp as any).citizenNotification_hi || activeApp.citizenNotification
                    : activeApp.citizenNotification}
                </p>
              </div>
            </div>
          )}

          {/* Details Overview Card */}
          <div className="bg-white rounded-3xl border border-slate-200 shadow-sm p-6 sm:p-8 space-y-6">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b pb-6 border-slate-100">
              <div>
                <div className="flex items-center gap-3">
                  <span className="text-xl sm:text-2xl font-black font-mono text-slate-900">
                    {activeApp.id}
                  </span>
                  <span className="px-3 py-1 rounded-full text-xs font-bold uppercase bg-emerald-100 text-emerald-800 border border-emerald-200">
                    {language === 'te'
                      ? activeApp.status === 'submitted'
                        ? 'సమర్పించబడింది'
                        : activeApp.status === 'documents_received'
                        ? 'పత్రాలు స్వీకరించబడ్డాయి'
                        : activeApp.status === 'department_review'
                        ? 'శాఖ సమీక్ష'
                        : activeApp.status === 'decision'
                        ? 'మంజూరు నిర్ణయం'
                        : activeApp.status === 'completed'
                        ? 'పూర్తయింది'
                        : activeApp.status
                      : language === 'hi'
                      ? activeApp.status === 'submitted'
                        ? 'जमा किया गया'
                        : activeApp.status === 'documents_received'
                        ? 'दस्तावेज प्राप्त हुए'
                        : activeApp.status === 'department_review'
                        ? 'विभागीय समीक्षा'
                        : activeApp.status === 'decision'
                        ? 'स्वीकृति निर्णय'
                        : activeApp.status === 'completed'
                        ? 'पूर्ण हुआ'
                        : activeApp.status
                      : activeApp.status.replace('_', ' ')}
                  </span>
                </div>
                <h2 className="text-lg sm:text-xl font-bold text-slate-800 mt-2">
                  {language === 'te'
                    ? activeApp.serviceName_te || activeApp.serviceName
                    : language === 'hi'
                    ? activeApp.serviceName_hi || activeApp.serviceName
                    : activeApp.serviceName}
                </h2>
                <p className="text-xs text-slate-500 flex items-center gap-1.5 mt-1 font-medium">
                  <Building className="w-3.5 h-3.5" />
                  <span>
                    {language === 'te'
                      ? (activeApp as any).department_te || activeApp.department
                      : language === 'hi'
                      ? (activeApp as any).department_hi || activeApp.department
                      : activeApp.department}
                  </span>
                </p>
              </div>

              {/* Action Buttons: Advance Status & Print Receipt */}
              <div className="self-start sm:self-auto flex flex-col sm:flex-row items-end sm:items-center gap-2">
                <button
                  onClick={() => setIsAckOpen(true)}
                  className="px-3.5 py-2.5 bg-slate-100 hover:bg-slate-200 text-slate-800 font-bold text-xs rounded-xl border border-slate-300 flex items-center gap-2 transition-all shadow-sm min-h-[40px]"
                >
                  <Printer className="w-4 h-4 text-slate-700" />
                  <span>{language === 'te' ? 'అధికారిక రసీదు ప్రింట్ చేయండి' : language === 'hi' ? 'आधिकारिक पावती प्रिंट करें' : 'Print Official Receipt'}</span>
                </button>

                <button
                  onClick={handleAdvanceStage}
                  disabled={activeApp.status === 'completed'}
                  className="px-4 py-2.5 bg-indigo-50 hover:bg-indigo-100 disabled:opacity-50 text-indigo-700 font-bold text-xs rounded-xl border border-indigo-200 flex items-center gap-2 transition-all shadow-sm min-h-[40px]"
                  title="Simulates administrative review progression for the demo"
                >
                  <Sparkles className="w-4 h-4 text-indigo-600" />
                  <span>
                    {activeApp.status === 'completed'
                      ? t('tracking.benefitDisbursed')
                      : t('tracking.advanceBtn')}
                  </span>
                </button>
              </div>
            </div>

            {/* Applicant Quick Profile */}
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 text-xs bg-slate-50 p-4 rounded-2xl border border-slate-100">
              <div>
                <span className="text-slate-400 block font-medium">{t('tracking.citizenName')}</span>
                <span className="font-bold text-slate-800">{activeApp.citizenName}</span>
              </div>
              <div>
                <span className="text-slate-400 block font-medium">{t('tracking.ageGender')}</span>
                <span className="font-bold text-slate-800">
                  {activeApp.age} {language === 'te' ? 'సం.' : language === 'hi' ? 'वर्ष' : 'yrs'}, {activeApp.gender === 'Female' ? (language === 'te' ? 'మహిళ' : language === 'hi' ? 'महिला' : 'Female') : activeApp.gender === 'Male' ? (language === 'te' ? 'పురుషుడు' : language === 'hi' ? 'पुरुष' : 'Male') : (language === 'te' ? 'ఇతర' : language === 'hi' ? 'अन्य' : activeApp.gender)}
                </span>
              </div>
              <div>
                <span className="text-slate-400 block font-medium">{t('tracking.location')}</span>
                <span className="font-bold text-slate-800">{activeApp.district || activeApp.state}</span>
              </div>
              <div>
                <span className="text-slate-400 block font-medium">{t('tracking.income')}</span>
                <span className="font-bold text-slate-800">₹{activeApp.annualIncome.toLocaleString('en-IN')} / {language === 'te' ? 'సం.' : language === 'hi' ? 'वर्ष' : 'yr'}</span>
              </div>
            </div>

            {/* Vertical Timeline */}
            <div className="space-y-4 pt-4">
              <h3 className="text-base font-extrabold text-slate-900 tracking-tight">
                {t('tracking.timelineTitle') || 'Vertical Application Journey Timeline'}
              </h3>

              <div className="relative pl-6 sm:pl-8 space-y-8 before:absolute before:left-3 sm:before:left-4 before:top-3 before:bottom-3 before:w-0.5 before:bg-slate-200">
                {activeApp.timeline.map((event, idx) => {
                  const isCompleted = event.status === 'completed';
                  const isCurrent = event.status === 'current';

                  const stageTitle =
                    language === 'te'
                      ? event.stageName_te || event.stageName
                      : language === 'hi'
                      ? event.stageName_hi || event.stageName
                      : event.stageName;

                  const stageDesc =
                    language === 'te'
                      ? event.description_te || event.description
                      : language === 'hi'
                      ? event.description_hi || event.description
                      : event.description;

                  return (
                    <div key={idx} className="relative group">
                      {/* Timeline Node Icon */}
                      <div
                        className={`absolute -left-6 sm:-left-8 top-1 w-6 h-6 sm:w-8 sm:h-8 rounded-full flex items-center justify-center border-2 transition-all ${
                          isCompleted
                            ? 'bg-emerald-600 border-white text-white shadow-md shadow-emerald-600/30'
                            : isCurrent
                            ? 'bg-blue-600 border-white text-white shadow-lg ring-4 ring-blue-100 animate-pulse'
                            : 'bg-white border-slate-300 text-slate-400'
                        }`}
                      >
                        {isCompleted ? (
                          <CheckCircle2 className="w-3.5 h-3.5 sm:w-4 sm:h-4" />
                        ) : isCurrent ? (
                          <RefreshCw className="w-3 h-3 sm:w-3.5 sm:h-3.5 animate-spin" />
                        ) : (
                          <Clock className="w-3 h-3 sm:w-3.5 sm:h-3.5" />
                        )}
                      </div>

                      {/* Content Card */}
                      <div
                        className={`p-4 sm:p-5 rounded-2xl border transition-all ${
                          isCurrent
                            ? 'bg-blue-50/70 border-blue-200 shadow-sm'
                            : isCompleted
                            ? 'bg-white border-slate-200'
                            : 'bg-slate-50/50 border-slate-200/60 opacity-70'
                        }`}
                      >
                        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-1 mb-1">
                          <h4 className="font-extrabold text-sm sm:text-base text-slate-900">
                            {stageTitle}
                          </h4>
                          <span className="text-[11px] font-semibold text-slate-500 font-mono">
                            {event.timestamp}
                          </span>
                        </div>

                        <p className="text-xs sm:text-sm text-slate-600 leading-relaxed">
                          {stageDesc}
                        </p>

                        {event.notes && (
                          <div className="mt-2.5 p-2.5 rounded-xl bg-white border border-slate-200 text-xs text-slate-700 font-medium">
                            <span className="font-bold text-slate-900">
                              {t('tracking.remark') || 'Department Remark: '}
                            </span>
                            {event.notes}
                          </div>
                        )}
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          </div>
        </div>
      ) : null}

      {/* Official Receipt Modal */}
      {activeApp && (
        <AcknowledgementModal
          application={activeApp}
          isOpen={isAckOpen}
          onClose={() => setIsAckOpen(false)}
        />
      )}
    </div>
  );
};
