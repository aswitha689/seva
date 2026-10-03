import React, { useState } from 'react';
import { Service } from '../types/service';
import { useLanguage } from '../context/LanguageContext';
import { useAccessibility } from '../context/AccessibilityContext';
import {
  CheckCircle2,
  AlertTriangle,
  XCircle,
  ArrowRight,
  ArrowLeft,
  UserCheck,
  Sparkles,
  Info
} from 'lucide-react';

interface EligibilityWizardProps {
  service: Service;
  onNavigate: (route: string, params?: any) => void;
  onEligibilityChecked: (result: {
    status: 'matched' | 'needs_verification' | 'not_met';
    answers: any;
  }) => void;
}

export const EligibilityWizard: React.FC<EligibilityWizardProps> = ({
  service,
  onNavigate,
  onEligibilityChecked,
}) => {
  const { language, t } = useLanguage();
  const { speak, isSpeaking, stopSpeaking } = useAccessibility();

  // Wizard answers
  const [personaType, setPersonaType] = useState<string>('Student');
  const [age, setAge] = useState<number | ''>(20);
  const [state, setState] = useState<string>('Telangana');
  const [occupation, setOccupation] = useState<string>('Full-time Degree Student');
  const [annualIncome, setAnnualIncome] = useState<number | ''>(180000);
  const [isWoman, setIsWoman] = useState<boolean>(true);

  const [hasEvaluated, setHasEvaluated] = useState<boolean>(true);

  // Quick fill demo persona: Anitha (20, Telugu, student needing education financial help)
  const handleFillAnitha = () => {
    setPersonaType('Student');
    setAge(20);
    setState('Telangana');
    setOccupation('Full-time Degree Student');
    setAnnualIncome(180000);
    setIsWoman(true);
    setHasEvaluated(true);
  };

  // Evaluation logic
  const evaluateEligibility = (): {
    status: 'matched' | 'needs_verification' | 'not_met';
    label: string;
    label_te: string;
    label_hi: string;
    description: string;
    description_te: string;
    description_hi: string;
  } => {
    const ageNum = Number(age);
    const incomeNum = Number(annualIncome);

    const minAge = service.eligibility.minAge ?? 0;
    const maxAge = service.eligibility.maxAge ?? 120;
    const maxIncome = service.eligibility.maxAnnualIncome ?? 10000000;

    // Red: Not met
    if (ageNum < minAge || ageNum > maxAge) {
      return {
        status: 'not_met',
        label: '🔴 Criteria Not Met',
        label_te: '🔴 అర్హత నిబంధనలు సరిపోలలేదు',
        label_hi: '🔴 पात्रता शर्तें पूरी नहीं हुईं',
        description: `Applicant age (${ageNum}) is outside the eligible range of ${minAge} to ${maxAge} years for this scheme.`,
        description_te: `దరఖాస్తుదారు వయస్సు (${ageNum}) ఈ పథకానికి అనుమతించబడిన ${minAge} నుండి ${maxAge} పరిధిలో లేదు.`,
        description_hi: `आवेदक की आयु (${ageNum}) इस योजना के लिए निर्धारित ${minAge} से ${maxAge} वर्ष के बीच नहीं है।`,
      };
    }

    if (incomeNum > maxIncome) {
      return {
        status: 'not_met',
        label: '🔴 Income Exceeds Limit',
        label_te: '🔴 ఆదాయ పరిమితి మించిపోయింది',
        label_hi: '🔴 आय सीमा से अधिक',
        description: `Reported income (₹${incomeNum.toLocaleString('en-IN')}) exceeds the ceiling limit of ₹${maxIncome.toLocaleString('en-IN')}.`,
        description_te: `పేర్కొన్న వార్షిక ఆదాయం పరిమితి ₹${maxIncome.toLocaleString('en-IN')} కంటే ఎక్కువ.`,
        description_hi: `दर्ज की गई आय सीमा ₹${maxIncome.toLocaleString('en-IN')} से अधिक है।`,
      };
    }

    // Yellow: Needs Verification (borderline income > 80% of max, or general category without cert)
    if (incomeNum > maxIncome * 0.85) {
      return {
        status: 'needs_verification',
        label: '🟡 Needs Document Verification',
        label_te: '🟡 పత్రాల పరిశీలన అవసరం',
        label_hi: '🟡 दस्तावेज़ सत्यापन आवश्यक',
        description: `Income is close to threshold. Preliminary eligible pending formal revenue Tahsildar income certificate.`,
        description_te: `ఆదాయం పరిమితికి సమీపంలో ఉంది. తహసీల్దార్ ధ్రువీకరణ ద్వారా తుది పరిశీలన జరుగుతుంది.`,
        description_hi: `आय सीमा के करीब है। तहसीलदार द्वारा जारी आय प्रमाण पत्र से अंतिम सत्यापन होगा।`,
      };
    }

    const personaTe =
      personaType === 'Student'
        ? 'విద్యార్థి'
        : personaType === 'Farmer'
        ? 'రైతు'
        : personaType === 'Senior'
        ? 'సీనియర్ సిటిజన్'
        : personaType === 'Woman'
        ? 'మహిళ'
        : personaType === 'Person with Disability'
        ? 'దివ్యాంగులు'
        : 'ఇతరులు';

    const personaHi =
      personaType === 'Student'
        ? 'विद्यार्थी'
        : personaType === 'Farmer'
        ? 'किसान'
        : personaType === 'Senior'
        ? 'वरिष्ठ नागरिक'
        : personaType === 'Woman'
        ? 'महिला'
        : personaType === 'Person with Disability'
        ? 'दिव्यांगजन'
        : 'अन्य';

    // Green: Full match
    return {
      status: 'matched',
      label: '🟢 Matched & Eligible',
      label_te: '🟢 సంపూర్ణంగా అర్హులు',
      label_hi: '🟢 पूर्णतः पात्र',
      description: `Great news! Your profile (${personaType}, Age ${ageNum}, Income ₹${incomeNum.toLocaleString('en-IN')}) satisfies all primary scheme criteria.`,
      description_te: `అభినందనలు! మీ ప్రొఫైల్ (${personaTe}, వయస్సు ${ageNum}, ఆదాయం ₹${incomeNum.toLocaleString('en-IN')}) ప్రాథమిక అర్హతలను సంపూర్ణంగా పూర్తి చేసింది.`,
      description_hi: `बधाई! आपकी प्रोफ़ाइल (${personaHi}, आयु ${ageNum}, आय ₹${incomeNum.toLocaleString('en-IN')}) सभी प्राथमिक पात्रता मानदंडों को पूरा करती है।`,
    };
  };

  const evalResult = evaluateEligibility();

  const handleProceed = () => {
    onEligibilityChecked({
      status: evalResult.status,
      answers: {
        personaType,
        age: Number(age),
        state,
        occupation,
        annualIncome: Number(annualIncome),
        isWoman,
      },
    });
    onNavigate('checklist', { serviceId: service.id });
  };

  return (
    <div className="flex-1 max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-12 space-y-8">
      {/* Top Breadcrumb & Back */}
      <div className="flex items-center justify-between">
        <button
          onClick={() => onNavigate('discovery')}
          className="inline-flex items-center gap-2 text-sm font-semibold text-slate-600 hover:text-slate-900 bg-white px-3.5 py-2 rounded-xl border border-slate-200 shadow-sm min-h-[44px]"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>{language === 'te' ? 'పథకాలకు తిరిగి వెళ్లండి' : language === 'hi' ? 'योजनाओं पर वापस जाएं' : 'Back to Schemes'}</span>
        </button>

        {/* Demo Persona Shortcut Button */}
        <button
          onClick={handleFillAnitha}
          className="inline-flex items-center gap-2 text-xs font-bold text-emerald-800 bg-emerald-100 hover:bg-emerald-200 px-3.5 py-2 rounded-xl border border-emerald-300 shadow-sm transition-all min-h-[44px]"
        >
          <Sparkles className="w-4 h-4 text-emerald-600" />
          <span>{t('wizard.demoAnithaBtn')}</span>
        </button>
      </div>

      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div className="space-y-1">
          <div className="flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-slate-500">
            <span>{t('wizard.stepTag')}</span>
            <span>•</span>
            <span className="text-emerald-700">{t('wizard.subTag')}</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-black text-slate-900">
            {t('wizard.title')}: {language === 'te' ? service.name_te : language === 'hi' ? service.name_hi : service.name}
          </h1>
          <p className="text-sm text-slate-600">
            {t('wizard.subtitle')}
          </p>
        </div>

        <button
          type="button"
          onClick={() => {
            if (isSpeaking) {
              stopSpeaking();
              return;
            }
            const textToSpeak = language === 'te'
              ? `${evalResult.label_te}. ${evalResult.description_te}`
              : language === 'hi'
              ? `${evalResult.label_hi}. ${evalResult.description_hi}`
              : `${evalResult.label}. ${evalResult.description}`;
            speak(textToSpeak);
          }}
          className="self-start sm:self-auto inline-flex items-center gap-1.5 px-3.5 py-2 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-semibold min-h-[40px] transition-colors shrink-0"
        >
          <span>
            {isSpeaking
              ? (language === 'te' ? 'ఆడియో ఆపండి' : language === 'hi' ? 'ऑडियो रोकें' : 'Stop Audio')
              : (language === 'te' ? '🔊 చదివి వినిపించు' : language === 'hi' ? '🔊 बोलकर सुनाएं' : '🔊 Read Aloud')}
          </span>
        </button>
      </div>

      {/* Mandatory Disclaimer */}
      <div className="p-3.5 rounded-xl bg-amber-50 border border-amber-200 text-xs text-amber-900 flex items-center gap-2 font-medium">
        <Info className="w-4 h-4 shrink-0 text-amber-700" />
        <span>{t('disclaimer')}</span>
      </div>

      {/* Form Card */}
      <div className="bg-white rounded-3xl border border-slate-200 shadow-lg p-6 sm:p-8 space-y-6">
        {/* Question 1: Who are you? */}
        <div className="space-y-3">
          <label className="block text-sm font-bold text-slate-900">
            {t('wizard.q1')}
          </label>
          <div className="grid grid-cols-2 sm:grid-cols-3 gap-2.5">
            {[
              { id: 'Student', en: 'Student', te: 'విద్యార్థి', hi: 'विद्यार्थी / छात्र' },
              { id: 'Farmer', en: 'Farmer', te: 'రైతు', hi: 'किसान' },
              { id: 'Senior', en: 'Senior', te: 'సీనియర్ సిటిజన్', hi: 'वरिष्ठ नागरिक' },
              { id: 'Woman', en: 'Woman', te: 'మహిళ', hi: 'महिला' },
              { id: 'Person with Disability', en: 'Person with Disability', te: 'దివ్యాంగులు', hi: 'दिव्यांगजन' },
              { id: 'Other', en: 'Other', te: 'ఇతరులు', hi: 'अन्य' },
            ].map((p) => (
              <button
                key={p.id}
                type="button"
                onClick={() => setPersonaType(p.id)}
                className={`py-3 px-3 rounded-xl border text-xs sm:text-sm font-semibold transition-all min-h-[44px] flex items-center justify-center text-center ${
                  personaType === p.id
                    ? 'bg-emerald-50 text-emerald-800 border-emerald-500 ring-2 ring-emerald-500/30 font-bold'
                    : 'bg-white text-slate-700 border-slate-200 hover:border-slate-300'
                }`}
              >
                {language === 'te' ? p.te : language === 'hi' ? p.hi : p.en}
              </button>
            ))}
          </div>
        </div>

        {/* Question 2: Age & Gender */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div className="space-y-2">
            <label htmlFor="age-input" className="block text-sm font-bold text-slate-900">
              {t('wizard.q2')}
            </label>
            <input
              id="age-input"
              type="number"
              value={age}
              onChange={(e) => setAge(e.target.value === '' ? '' : Number(e.target.value))}
              placeholder="e.g. 20"
              className="w-full px-4 py-3 rounded-xl border border-slate-200 focus:border-emerald-500 focus:ring-2 focus:ring-emerald-500/20 text-slate-900 font-semibold min-h-[44px]"
            />
            <span className="text-[11px] text-slate-400">
              {language === 'te'
                ? `వయోపరిమితి: (${service.eligibility.minAge ?? 0}–${service.eligibility.maxAge ?? 100} సం.)`
                : language === 'hi'
                ? `आयु सीमा: (${service.eligibility.minAge ?? 0}–${service.eligibility.maxAge ?? 100} वर्ष)`
                : `Required for age range check (${service.eligibility.minAge ?? 0}–${service.eligibility.maxAge ?? 100} yrs)`}
            </span>
          </div>

          <div className="space-y-2">
            <label htmlFor="state-select" className="block text-sm font-bold text-slate-900">
              {t('wizard.q3')}
            </label>
            <select
              id="state-select"
              value={state}
              onChange={(e) => setState(e.target.value)}
              className="w-full px-4 py-3 rounded-xl border border-slate-200 focus:border-emerald-500 focus:ring-2 focus:ring-emerald-500/20 text-slate-900 font-semibold bg-white min-h-[44px]"
            >
              <option value="Telangana">{language === 'te' ? 'తెలంగాణ' : language === 'hi' ? 'तेलंगाना' : 'Telangana'}</option>
              <option value="Andhra Pradesh">{language === 'te' ? 'ఆంధ్రప్రదేశ్' : language === 'hi' ? 'आंध्र प्रदेश' : 'Andhra Pradesh'}</option>
              <option value="Karnataka">{language === 'te' ? 'కర్ణాటక' : language === 'hi' ? 'कर्नाटक' : 'Karnataka'}</option>
              <option value="Maharashtra">{language === 'te' ? 'మహారాష్ట్ర' : language === 'hi' ? 'महाराष्ट्र' : 'Maharashtra'}</option>
              <option value="Other State">{language === 'te' ? 'ఇతర రాష్ట్రం' : language === 'hi' ? 'अन्य राज्य' : 'Other State'}</option>
            </select>
          </div>
        </div>

        {/* Question 3: Occupation & Annual Income */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div className="space-y-2">
            <label htmlFor="occ-input" className="block text-sm font-bold text-slate-900">
              {t('wizard.q4')}
            </label>
            <input
              id="occ-input"
              type="text"
              value={occupation}
              onChange={(e) => setOccupation(e.target.value)}
              placeholder="e.g. Full-time Degree Student"
              className="w-full px-4 py-3 rounded-xl border border-slate-200 focus:border-emerald-500 focus:ring-2 focus:ring-emerald-500/20 text-slate-900 font-semibold min-h-[44px]"
            />
          </div>

          <div className="space-y-2">
            <label htmlFor="income-input" className="block text-sm font-bold text-slate-900">
              {t('wizard.q5')}
            </label>
            <input
              id="income-input"
              type="number"
              value={annualIncome}
              onChange={(e) => setAnnualIncome(e.target.value === '' ? '' : Number(e.target.value))}
              placeholder="e.g. 180000"
              className="w-full px-4 py-3 rounded-xl border border-slate-200 focus:border-emerald-500 focus:ring-2 focus:ring-emerald-500/20 text-slate-900 font-semibold min-h-[44px]"
            />
            <span className="text-[11px] text-slate-400">
              {language === 'te'
                ? `పథకం గరిష్ట ఆదాయ పరిమితి: ₹${(service.eligibility.maxAnnualIncome ?? 250000).toLocaleString('en-IN')}`
                : language === 'hi'
                ? `योजना की अधिकतम आय सीमा: ₹${(service.eligibility.maxAnnualIncome ?? 250000).toLocaleString('en-IN')}`
                : `Scheme ceiling: ₹${(service.eligibility.maxAnnualIncome ?? 250000).toLocaleString('en-IN')}`}
            </span>
          </div>
        </div>

        {/* Dynamic Result Box */}
        <div
          className={`p-6 rounded-2xl border-2 transition-all space-y-3 ${
            evalResult.status === 'matched'
              ? 'bg-emerald-50 border-emerald-400 text-emerald-950'
              : evalResult.status === 'needs_verification'
              ? 'bg-amber-50 border-amber-400 text-amber-950'
              : 'bg-rose-50 border-rose-400 text-rose-950'
          }`}
          role="region"
          aria-live="polite"
        >
          <div className="flex items-center gap-3">
            {evalResult.status === 'matched' && (
              <CheckCircle2 className="w-7 h-7 text-emerald-600 shrink-0" aria-hidden="true" />
            )}
            {evalResult.status === 'needs_verification' && (
              <AlertTriangle className="w-7 h-7 text-amber-600 shrink-0" aria-hidden="true" />
            )}
            {evalResult.status === 'not_met' && (
              <XCircle className="w-7 h-7 text-rose-600 shrink-0" aria-hidden="true" />
            )}
            <div>
              <span className="text-lg font-black block">
                {language === 'te'
                  ? evalResult.label_te
                  : language === 'hi'
                  ? evalResult.label_hi
                  : evalResult.label}
              </span>
              <span className="text-xs font-semibold uppercase tracking-wider opacity-75">
                {language === 'te' ? 'ప్రాథమిక అనుకూలత పరిశీలన' : language === 'hi' ? 'प्रारंभिक अनुकूलता जांच' : 'Preliminary Compatibility Check'}
              </span>
            </div>
          </div>

          <p className="text-sm font-medium leading-relaxed pl-10">
            {language === 'te'
              ? evalResult.description_te
              : language === 'hi'
              ? evalResult.description_hi
              : evalResult.description}
          </p>
        </div>

        {/* Action Button */}
        <div className="pt-4 flex flex-col sm:flex-row items-center justify-between gap-4 border-t border-slate-100">
          <button
            type="button"
            onClick={() => onNavigate('discovery')}
            className="w-full sm:w-auto px-6 py-3 rounded-xl text-slate-700 hover:bg-slate-100 font-semibold text-sm min-h-[44px]"
          >
            {t('wizard.chooseDifferent')}
          </button>

          <button
            type="button"
            onClick={handleProceed}
            disabled={evalResult.status === 'not_met'}
            className="w-full sm:w-auto px-8 py-3.5 rounded-2xl bg-emerald-600 hover:bg-emerald-700 disabled:bg-slate-300 disabled:cursor-not-allowed text-white font-bold text-sm shadow-md shadow-emerald-600/20 flex items-center justify-center gap-2 min-h-[48px] transition-all"
          >
            <span>{t('wizard.continueChecklist')}</span>
            <ArrowRight className="w-4 h-4" />
          </button>
        </div>
      </div>
    </div>
  );
};
