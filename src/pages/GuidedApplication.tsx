import React, { useState } from 'react';
import { Service } from '../types/service';
import { useLanguage } from '../context/LanguageContext';
import { useAccessibility } from '../context/AccessibilityContext';
import { useAuth } from '../context/AuthContext';
import { UploadedDoc, Application } from '../types/application';
import { saveApplication, generateApplicationId, buildDefaultTimeline } from '../services/storage';
import {
  User,
  GraduationCap,
  FileCheck2,
  Send,
  HelpCircle,
  ArrowRight,
  ArrowLeft,
  CheckCircle2,
  Sparkles,
  ShieldCheck,
  Building,
  Info
} from 'lucide-react';

interface GuidedApplicationProps {
  service: Service;
  initialUploadedDocs: UploadedDoc[];
  initialWizardAnswers?: any;
  onNavigate: (route: string, params?: any) => void;
  onApplicationSubmitted: (app: Application) => void;
}

export const GuidedApplication: React.FC<GuidedApplicationProps> = ({
  service,
  initialUploadedDocs,
  initialWizardAnswers,
  onNavigate,
  onApplicationSubmitted,
}) => {
  const { language, t } = useLanguage();
  const { speak, isSpeaking, stopSpeaking } = useAccessibility();
  const { user } = useAuth();
  const [currentStep, setCurrentStep] = useState<number>(1);

  // Form state pre-populated with logged-in citizen persona
  const [fullName, setFullName] = useState<string>(() => user?.name || 'Anitha K');
  const [age, setAge] = useState<number>(initialWizardAnswers?.age ?? 20);
  const [gender, setGender] = useState<string>('Female');
  const [phone, setPhone] = useState<string>(() => user?.emailOrPhone || '9876543210');
  const [state, setState] = useState<string>(initialWizardAnswers?.state ?? 'Telangana');
  const [district, setDistrict] = useState<string>('Warangal');

  const [course, setCourse] = useState<string>('B.Sc Computer Science - 2nd Year');
  const [collegeName, setCollegeName] = useState<string>('Kakatiya University Constituent Degree College');
  const [annualIncome, setAnnualIncome] = useState<number>(
    initialWizardAnswers?.annualIncome ?? 180000
  );
  const [rationCardNumber, setRationCardNumber] = useState<string>('WAP08493028472');

  const [uploadedDocs, setUploadedDocs] = useState<UploadedDoc[]>(() => {
    if (initialUploadedDocs && initialUploadedDocs.length > 0) {
      return initialUploadedDocs;
    }
    // Auto-populate for seamless demo
    return service.documents.map((doc) => ({
      docId: doc.id,
      docName: language === 'te' ? doc.name_te || doc.name : language === 'hi' ? doc.name_hi || doc.name : doc.name,
      fileName: `${doc.id.replace('doc-', 'anitha_')}_verified.pdf`,
      uploadedAt: new Date().toLocaleTimeString('en-IN', { hour: '2-digit', minute: '2-digit' }),
    }));
  });

  const [declarationAgreed, setDeclarationAgreed] = useState<boolean>(true);
  const [isSubmitting, setIsSubmitting] = useState<boolean>(false);

  // Steps configuration
  const steps = [
    { number: 1, title: t('apply.step1') || 'Personal Details', icon: User },
    { number: 2, title: t('apply.step2') || 'Eligibility Profile', icon: GraduationCap },
    { number: 3, title: t('apply.step3') || 'Documents', icon: FileCheck2 },
    { number: 4, title: t('apply.step4') || 'Review & Submit', icon: Send },
  ];

  // "Why we ask this" text per step
  const whyWeAskThis: Record<number, { en: string; te: string; hi: string }> = {
    1: {
      en: 'We need your identity and contact information so the department can establish your resident citizen profile and deliver SMS/WhatsApp tracking notifications.',
      te: 'ప్రభుత్వ విభాగం మీ పౌర ప్రొఫైల్‌ను నమోదు చేసుకోవడానికి మరియు ఎస్ఎంఎస్ ద్వారా సమాచారం అందించడానికి మీ వ్యక్తిగత వివరాలు అవసరం.',
      hi: 'विभाग द्वारा आपका नागरिक प्रोफ़ाइल पंजीकृत करने और एसएमएस द्वारा ट्रैकिंग सूचनाएं भेजने के लिए यह जानकारी आवश्यक है।',
    },
    2: {
      en: 'The Department of Higher Education verifies your college enrollment and household income threshold to calculate grant amount and fee reimbursement.',
      te: 'ఉన్నత విద్యా శాఖ మీ కళాశాల ప్రవేశం మరియు కుటుంబ ఆదాయ పరిమితి ఆధారంగా స్కాలర్‌షిప్ గ్రాంట్‌ను మంజూరు చేస్తుంది.',
      hi: 'उच्च शिक्षा विभाग अनुदान राशि और शुल्क प्रतिपूर्ति की गणना के लिए आपके कॉलेज और पारिवारिक आय की पुष्टि करता है।',
    },
    3: {
      en: 'State public finance audit regulations mandate verified bonafide copies and income certificates prior to Direct Benefit Transfer disbursement.',
      te: 'ప్రభుత్వ ఆడిట్ నిబంధనల ప్రకారం లబ్ధిదారునికి నేరుగా నగదు జమ చేయడానికి ముందు ధ్రువీకరించిన పత్రాలు తప్పనిసరి.',
      hi: 'प्रत्यक्ष लाभ अंतरण (डीबीटी) से पहले वित्तीय ऑडिट नियमों के अनुसार सत्यापित दस्तावेजों की प्रतिलिपि अनिवार्य है।',
    },
    4: {
      en: 'Final review guarantees all submitted information is accurate before permanent registration on the state scholarship portal.',
      te: 'పోర్టల్‌లో దరఖాస్తు శాశ్వతంగా నమోదు కావడానికి ముందు అన్ని వివరాలు సరైనవని నిర్ధారించుకోవడానికి ఈ సమీక్ష ఉపయోగపడుతుంది.',
      hi: 'अंतिम समीक्षा यह सुनिश्चित करती है कि पोर्टल पर स्थायी पंजीकरण से पहले सभी भरी गई जानकारियां सही हैं।',
    },
  };

  const handleSubmitApplication = () => {
    if (!declarationAgreed) return;

    setIsSubmitting(true);

    const newId = generateApplicationId();
    const submissionDate = new Date().toLocaleString('en-IN', {
      dateStyle: 'medium',
      timeStyle: 'short',
    });

    const newApp: Application = {
      id: newId,
      userId: user?.id || 'citizen-anitha',
      serviceId: service.id,
      serviceName: service.name,
      serviceName_te: service.name_te,
      serviceName_hi: service.name_hi,
      department: service.department,
      department_te: service.department_te,
      department_hi: service.department_hi,
      category: service.category,
      citizenName: fullName,
      age: Number(age),
      gender,
      phone,
      state,
      district,
      occupation: course,
      annualIncome: Number(annualIncome),
      educationLevel: 'Undergraduate Degree (2nd Year)',
      status: 'submitted',
      submittedAt: submissionDate,
      currentStage: 'submitted',
      uploadedDocuments: uploadedDocs,
      timeline: buildDefaultTimeline(submissionDate),
      adminNotes: ['Application received automatically via SevaSaarthi Citizen Portal.'],
    };

    saveApplication(newApp);
    onApplicationSubmitted(newApp);
    onNavigate('submitted', { applicationId: newId });
  };

  return (
    <div className="flex-1 max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-12 space-y-8">
      {/* Top Header & Back */}
      <div className="flex items-center justify-between">
        <button
          onClick={() => onNavigate('checklist', { serviceId: service.id })}
          className="inline-flex items-center gap-2 text-sm font-semibold text-slate-600 hover:text-slate-900 bg-white px-3.5 py-2 rounded-xl border border-slate-200 shadow-sm min-h-[44px]"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>
            {language === 'te' ? 'పత్రాల జాబితాకు తిరిగి వెళ్లండి' : language === 'hi' ? 'चेकलिस्ट पर वापस जाएं' : 'Back to Checklist'}
          </span>
        </button>

        <div className="flex items-center gap-2">
          <button
            type="button"
            onClick={() => {
              if (isSpeaking) {
                stopSpeaking();
                return;
              }
              const currentExplain = whyWeAskThis[currentStep][language] || whyWeAskThis[currentStep].en;
              const stepTitle = steps[currentStep - 1].title;
              const textToSpeak = language === 'te'
                ? `దశ ${currentStep} / 4: ${stepTitle}. ${currentExplain}`
                : language === 'hi'
                ? `चरण ${currentStep} / 4: ${stepTitle}। ${currentExplain}`
                : `Step ${currentStep} of 4: ${stepTitle}. ${currentExplain}`;
              speak(textToSpeak);
            }}
            className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-slate-100 hover:bg-slate-200 text-slate-700 font-semibold text-xs rounded-xl min-h-[40px]"
          >
            <span>
              {isSpeaking
                ? (language === 'te' ? 'ఆడియో ఆపండి' : language === 'hi' ? 'ऑडियो रोकें' : 'Stop Audio')
                : (language === 'te' ? '🔊 చదివి వినిపించు' : language === 'hi' ? '🔊 बोलकर सुनाएं' : '🔊 Read Aloud')}
            </span>
          </button>

          <span className="text-xs font-bold px-3 py-1 bg-emerald-100 text-emerald-800 rounded-full border border-emerald-300">
            {language === 'te' ? 'డెమో ప్రొఫైల్: అనిత' : language === 'hi' ? 'डेमो प्रोफ़ाइल: अनीता' : 'Demo Persona: Anitha'}
          </span>
        </div>
      </div>

      <div className="space-y-1">
        <h1 className="text-2xl sm:text-3xl font-black text-slate-900">
          {t('apply.subTag')}: {language === 'te' ? service.name_te : language === 'hi' ? service.name_hi : service.name}
        </h1>
        <p className="text-sm text-slate-500">
          {t('apply.subtitle')}
        </p>
      </div>

      {/* 4-Step Progress Bar */}
      <div className="bg-white p-4 sm:p-6 rounded-3xl border border-slate-200 shadow-sm">
        <div className="grid grid-cols-4 gap-2">
          {steps.map((step) => {
            const Icon = step.icon;
            const isCompleted = step.number < currentStep;
            const isCurrent = step.number === currentStep;

            return (
              <div key={step.number} className="flex flex-col items-center text-center space-y-2">
                <button
                  type="button"
                  onClick={() => setCurrentStep(step.number)}
                  className={`w-10 h-10 sm:w-12 sm:h-12 rounded-2xl flex items-center justify-center font-bold text-sm transition-all min-h-[40px] ${
                    isCompleted
                      ? 'bg-emerald-600 text-white shadow-md shadow-emerald-600/30'
                      : isCurrent
                      ? 'bg-slate-900 text-white shadow-md ring-4 ring-slate-200'
                      : 'bg-slate-100 text-slate-400'
                  }`}
                  aria-label={`Step ${step.number}: ${step.title}`}
                >
                  {isCompleted ? <CheckCircle2 className="w-5 h-5" /> : <Icon className="w-5 h-5" />}
                </button>
                <span
                  className={`text-xs font-semibold hidden sm:block ${
                    isCurrent ? 'text-slate-900 font-bold' : isCompleted ? 'text-emerald-700' : 'text-slate-400'
                  }`}
                >
                  {step.title}
                </span>
              </div>
            );
          })}
        </div>
      </div>

      {/* "Why we ask this" callout */}
      <div className="p-4 rounded-2xl bg-blue-50/80 border border-blue-200 text-xs text-blue-950 flex items-start gap-3">
        <HelpCircle className="w-5 h-5 text-blue-600 shrink-0 mt-0.5" aria-hidden="true" />
        <div>
          <span className="font-bold text-blue-900 block mb-0.5">
            {language === 'te' ? 'ఈ సమాచారం ఎందుకు అడుగుతున్నాము:' : language === 'hi' ? 'यह जानकारी क्यों आवश्यक है:' : 'Why we ask this:'}
          </span>
          <p className="leading-relaxed">
            {whyWeAskThis[currentStep][language] || whyWeAskThis[currentStep].en}
          </p>
        </div>
      </div>

      {/* Step Content Container */}
      <div className="bg-white rounded-3xl border border-slate-200 shadow-xl p-6 sm:p-8 space-y-6">
        {/* STEP 1: Personal Details */}
        {currentStep === 1 && (
          <div className="space-y-5">
            <h2 className="text-lg font-bold text-slate-900 border-b pb-3 border-slate-100">
              1. {t('apply.step1')}
            </h2>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="space-y-1.5">
                <label className="block text-xs font-bold text-slate-700">{t('apply.fullName')}</label>
                <input
                  type="text"
                  value={fullName}
                  onChange={(e) => setFullName(e.target.value)}
                  className="w-full px-4 py-3 rounded-xl border border-slate-200 font-semibold text-slate-900 focus:border-emerald-500 focus:ring-2 focus:ring-emerald-500/20"
                />
              </div>

              <div className="space-y-1.5">
                <label className="block text-xs font-bold text-slate-700">{t('apply.phone')}</label>
                <input
                  type="tel"
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                  className="w-full px-4 py-3 rounded-xl border border-slate-200 font-semibold text-slate-900 focus:border-emerald-500 focus:ring-2 focus:ring-emerald-500/20"
                />
              </div>

              <div className="space-y-1.5">
                <label className="block text-xs font-bold text-slate-700">{t('apply.age')}</label>
                <input
                  type="number"
                  value={age}
                  onChange={(e) => setAge(Number(e.target.value))}
                  className="w-full px-4 py-3 rounded-xl border border-slate-200 font-semibold text-slate-900 focus:border-emerald-500 focus:ring-2 focus:ring-emerald-500/20"
                />
              </div>

              <div className="space-y-1.5">
                <label className="block text-xs font-bold text-slate-700">{t('apply.gender')}</label>
                <select
                  value={gender}
                  onChange={(e) => setGender(e.target.value)}
                  className="w-full px-4 py-3 rounded-xl border border-slate-200 font-semibold text-slate-900 focus:border-emerald-500 focus:ring-2 focus:ring-emerald-500/20 bg-white"
                >
                  <option value="Female">{language === 'te' ? 'స్త్రీ (మహిళ)' : language === 'hi' ? 'महिला' : 'Female (Woman)'}</option>
                  <option value="Male">{language === 'te' ? 'పురుషుడు' : language === 'hi' ? 'पुरुष' : 'Male'}</option>
                  <option value="Other">{language === 'te' ? 'ఇతర' : language === 'hi' ? 'अन्य' : 'Other'}</option>
                </select>
              </div>

              <div className="space-y-1.5">
                <label className="block text-xs font-bold text-slate-700">{t('apply.state')}</label>
                <input
                  type="text"
                  value={state}
                  onChange={(e) => setState(e.target.value)}
                  className="w-full px-4 py-3 rounded-xl border border-slate-200 font-semibold text-slate-900 focus:border-emerald-500 focus:ring-2 focus:ring-emerald-500/20"
                />
              </div>

              <div className="space-y-1.5">
                <label className="block text-xs font-bold text-slate-700">{t('apply.district')}</label>
                <input
                  type="text"
                  value={district}
                  onChange={(e) => setDistrict(e.target.value)}
                  className="w-full px-4 py-3 rounded-xl border border-slate-200 font-semibold text-slate-900 focus:border-emerald-500 focus:ring-2 focus:ring-emerald-500/20"
                />
              </div>
            </div>
          </div>
        )}

        {/* STEP 2: Eligibility & Course Profile */}
        {currentStep === 2 && (
          <div className="space-y-5">
            <h2 className="text-lg font-bold text-slate-900 border-b pb-3 border-slate-100">
              2. {t('apply.step2')}
            </h2>

            <div className="grid grid-cols-1 gap-4">
              <div className="space-y-1.5">
                <label className="block text-xs font-bold text-slate-700">{t('apply.course')}</label>
                <input
                  type="text"
                  value={course}
                  onChange={(e) => setCourse(e.target.value)}
                  className="w-full px-4 py-3 rounded-xl border border-slate-200 font-semibold text-slate-900 focus:border-emerald-500 focus:ring-2 focus:ring-emerald-500/20"
                />
              </div>

              <div className="space-y-1.5">
                <label className="block text-xs font-bold text-slate-700">{t('apply.college')}</label>
                <input
                  type="text"
                  value={collegeName}
                  onChange={(e) => setCollegeName(e.target.value)}
                  className="w-full px-4 py-3 rounded-xl border border-slate-200 font-semibold text-slate-900 focus:border-emerald-500 focus:ring-2 focus:ring-emerald-500/20"
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="space-y-1.5">
                  <label className="block text-xs font-bold text-slate-700">{t('apply.income')}</label>
                  <input
                    type="number"
                    value={annualIncome}
                    onChange={(e) => setAnnualIncome(Number(e.target.value))}
                    className="w-full px-4 py-3 rounded-xl border border-slate-200 font-semibold text-slate-900 focus:border-emerald-500 focus:ring-2 focus:ring-emerald-500/20"
                  />
                </div>

                <div className="space-y-1.5">
                  <label className="block text-xs font-bold text-slate-700">{t('apply.rationCard')}</label>
                  <input
                    type="text"
                    value={rationCardNumber}
                    onChange={(e) => setRationCardNumber(e.target.value)}
                    className="w-full px-4 py-3 rounded-xl border border-slate-200 font-semibold text-slate-900 focus:border-emerald-500 focus:ring-2 focus:ring-emerald-500/20"
                  />
                </div>
              </div>
            </div>
          </div>
        )}

        {/* STEP 3: Documents Confirmation */}
        {currentStep === 3 && (
          <div className="space-y-5">
            <h2 className="text-lg font-bold text-slate-900 border-b pb-3 border-slate-100">
              3. {t('apply.step3')} ({uploadedDocs.length} {language === 'te' ? 'ధ్రువీకరించబడింది' : language === 'hi' ? 'सत्यापित' : 'Verified'})
            </h2>

            <div className="space-y-3">
              {uploadedDocs.map((doc) => (
                <div
                  key={doc.docId}
                  className="p-4 rounded-xl bg-emerald-50/60 border border-emerald-300 flex items-center justify-between gap-3"
                >
                  <div className="flex items-center gap-3">
                    <CheckCircle2 className="w-5 h-5 text-emerald-600 shrink-0" />
                    <div>
                      <span className="font-bold text-sm text-slate-900 block">{doc.docName}</span>
                      <span className="text-xs text-slate-500">{doc.fileName}</span>
                    </div>
                  </div>
                  <span className="text-[11px] font-bold text-emerald-800 bg-white px-2.5 py-1 rounded-md border border-emerald-200">
                    {t('checklist.attached') || 'Attached'}
                  </span>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* STEP 4: Review & Submit */}
        {currentStep === 4 && (
          <div className="space-y-6">
            <h2 className="text-lg font-bold text-slate-900 border-b pb-3 border-slate-100">
              4. {t('apply.step4')}
            </h2>

            <div className="bg-slate-50 rounded-2xl p-5 border border-slate-200 space-y-4 text-xs sm:text-sm">
              <div className="flex items-center justify-between border-b pb-3 border-slate-200">
                <span className="text-slate-500">
                  {language === 'te' ? 'దరఖాస్తు చేసుకున్న పథకం:' : language === 'hi' ? 'आवेदित योजना:' : 'Scheme Applying For:'}
                </span>
                <span className="font-bold text-slate-900 text-right">
                  {language === 'te' ? service.name_te : language === 'hi' ? service.name_hi : service.name}
                </span>
              </div>

              <div className="grid grid-cols-2 gap-3 border-b pb-3 border-slate-200">
                <div>
                  <span className="text-slate-500 block">
                    {language === 'te' ? 'దరఖాస్తుదారు:' : language === 'hi' ? 'आवेदक:' : 'Applicant:'}
                  </span>
                  <span className="font-bold text-slate-900">
                    {fullName}, {age} {language === 'te' ? 'సంవత్సరాలు' : language === 'hi' ? 'वर्ष' : 'yrs'} ({gender === 'Female' ? (language === 'te' ? 'మహిళ' : language === 'hi' ? 'महिला' : 'Female') : gender === 'Male' ? (language === 'te' ? 'పురుషుడు' : language === 'hi' ? 'पुरुष' : 'Male') : (language === 'te' ? 'ఇతర' : language === 'hi' ? 'अन्य' : gender)})
                  </span>
                </div>
                <div>
                  <span className="text-slate-500 block">
                    {language === 'te' ? 'మొబైల్ ఫోన్:' : language === 'hi' ? 'मोबाइल नंबर:' : 'Contact Phone:'}
                  </span>
                  <span className="font-bold text-slate-900">{phone}</span>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3 border-b pb-3 border-slate-200">
                <div>
                  <span className="text-slate-500 block">
                    {language === 'te' ? 'ప్రాంతం:' : language === 'hi' ? 'स्थान:' : 'Location:'}
                  </span>
                  <span className="font-bold text-slate-900">{district}, {state}</span>
                </div>
                <div>
                  <span className="text-slate-500 block">
                    {language === 'te' ? 'కుటుంబ ఆదాయం:' : language === 'hi' ? 'पारिवारिक आय:' : 'Reported Income:'}
                  </span>
                  <span className="font-bold text-slate-900">
                    ₹{annualIncome.toLocaleString('en-IN')} / {language === 'te' ? 'సంవత్సరానికి' : language === 'hi' ? 'वर्ष' : 'year'}
                  </span>
                </div>
              </div>

              <div className="border-b pb-3 border-slate-200">
                <span className="text-slate-500 block">
                  {language === 'te' ? 'విద్యాసంస్థ & కోర్సు:' : language === 'hi' ? 'संस्थान एवं पाठ्यक्रम:' : 'Institution & Course:'}
                </span>
                <span className="font-bold text-slate-900">{course} — {collegeName}</span>
              </div>

              <div>
                <span className="text-slate-500 block mb-1">
                  {language === 'te' ? 'జతచేసిన ధ్రువీకరణ పత్రాలు:' : language === 'hi' ? 'संलग्न प्रमाण पत्र:' : 'Attached Certificates:'}
                </span>
                <span className="font-semibold text-emerald-800">
                  {uploadedDocs.length} {language === 'te' ? 'పత్రాలు జతచేయబడ్డాయి' : language === 'hi' ? 'फाइलें संलग्न' : 'files attached'} ({uploadedDocs.map((d) => d.fileName).join(', ')})
                </span>
              </div>
            </div>

            {/* Declaration Checkbox */}
            <div className="p-4 rounded-xl border border-slate-200 bg-white flex items-start gap-3">
              <input
                id="declaration-checkbox"
                type="checkbox"
                checked={declarationAgreed}
                onChange={(e) => setDeclarationAgreed(e.target.checked)}
                className="w-5 h-5 rounded border-slate-300 text-emerald-600 focus:ring-emerald-500 mt-0.5"
              />
              <label htmlFor="declaration-checkbox" className="text-xs text-slate-700 leading-relaxed">
                {language === 'te'
                  ? 'పైన నమోదు చేసిన వివరాలన్నీ నిజమైనవని ధ్రువీకరిస్తున్నాను. ఇది ప్రాథమిక మార్గదర్శకత్వం మాత్రమేనని, తుది మంజూరు సంబంధిత ప్రభుత్వ శాఖ నిర్ణయిస్తుందని అంగీకరిస్తున్నాను. (డెమో అనుకరణ)'
                  : language === 'hi'
                  ? 'मैं प्रमाणित करता/करती हूँ कि ऊपर दी गई सभी जानकारियां सही हैं। मैं समझता/समझती हूँ कि यह केवल प्रारंभिक मार्गदर्शन है और अंतिम स्वीकृति संबंधित सरकारी प्राधिकरण द्वारा तय की जाती है। (डेमो सिमुलेशन)'
                  : 'I hereby declare that all information entered above is genuine to the best of my knowledge. I understand that this is preliminary guidance, and final sanction is determined by the concerned government authority. (Demo Simulation)'}
              </label>
            </div>
          </div>
        )}

        {/* Navigation Step Buttons */}
        <div className="pt-4 flex flex-col sm:flex-row items-center justify-between gap-4 border-t border-slate-100">
          {currentStep > 1 ? (
            <button
              type="button"
              onClick={() => setCurrentStep((prev) => prev - 1)}
              className="w-full sm:w-auto px-6 py-3 rounded-xl text-slate-700 hover:bg-slate-100 font-semibold text-sm min-h-[44px]"
            >
              {t('apply.prev')}
            </button>
          ) : (
            <div />
          )}

          {currentStep < 4 ? (
            <button
              type="button"
              onClick={() => setCurrentStep((prev) => prev + 1)}
              className="w-full sm:w-auto px-8 py-3.5 rounded-2xl bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-sm shadow-md shadow-emerald-600/20 flex items-center justify-center gap-2 min-h-[48px] transition-all"
            >
              <span>{t('apply.next')}</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          ) : (
            <button
              type="button"
              onClick={handleSubmitApplication}
              disabled={!declarationAgreed || isSubmitting}
              className="w-full sm:w-auto px-10 py-3.5 rounded-2xl bg-slate-900 hover:bg-slate-800 disabled:bg-slate-400 text-white font-bold text-sm shadow-xl flex items-center justify-center gap-2 min-h-[48px] transition-all"
            >
              <Send className="w-4 h-4" />
              <span>{isSubmitting ? t('apply.submitting') : t('apply.submit')}</span>
            </button>
          )}
        </div>
      </div>
    </div>
  );
};
