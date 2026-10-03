import React, { useState, useEffect } from 'react';
import { useLanguage } from '../context/LanguageContext';
import { useAccessibility } from '../context/AccessibilityContext';
import { detectIntent, MatchResult } from '../services/intentDetector';
import { Service } from '../types/service';
import {
  Sparkles,
  ArrowRight,
  Building,
  CheckCircle2,
  ArrowLeft,
  Volume2,
  Clock,
  FileText,
  HelpCircle,
  Search,
  GraduationCap,
  Accessibility as AccessibilityIcon,
  Wheat,
  HeartHandshake
} from 'lucide-react';

interface DiscoveryProps {
  query?: string;
  category?: string;
  onNavigate: (route: string, params?: any) => void;
  onSelectService: (service: Service) => void;
}

export const Discovery: React.FC<DiscoveryProps> = ({
  query = '',
  category = '',
  onNavigate,
  onSelectService,
}) => {
  const { language, setLanguage, detectAndSetLanguage, t } = useLanguage();
  const { speak, isSpeaking, stopSpeaking } = useAccessibility();

  const [activeCategory, setActiveCategory] = useState<string>(category || '');

  useEffect(() => {
    if (query) {
      detectAndSetLanguage(query);
    }
  }, [query]);

  useEffect(() => {
    setActiveCategory(category || '');
  }, [category]);

  const matchResult: MatchResult = detectIntent(query, activeCategory || undefined);
  const understoodText = matchResult.understoodNeed[language] || matchResult.understoodNeed.en;

  const handleReadMatches = () => {
    if (isSpeaking) {
      stopSpeaking();
      return;
    }
    const serviceNames = matchResult.matchedServices
      .map((m) => (language === 'te' ? m.service.name_te : language === 'hi' ? m.service.name_hi : m.service.name))
      .join(', ');
    const matchPrefix =
      language === 'te'
        ? 'సరిపోలే పథకాలు:'
        : language === 'hi'
        ? 'संबंधित योजनाएं:'
        : 'Found matching schemes:';
    speak(`${understoodText}. ${matchResult.matchedServices.length > 0 ? `${matchPrefix} ${serviceNames}` : ''}`);
  };

  return (
    <div className="flex-1 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-12 space-y-8">
      {/* Back button */}
      <div>
        <button
          onClick={() => onNavigate('home')}
          className="inline-flex items-center gap-2 text-sm font-semibold text-slate-600 hover:text-slate-900 bg-white px-3.5 py-2 rounded-xl border border-slate-200 shadow-sm transition-all min-h-[44px]"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>{t('nav.home')}</span>
        </button>
      </div>

      {/* Understood Need Card (AI Intelligence Layer) */}
      <div className="bg-gradient-to-r from-emerald-500/10 via-teal-500/10 to-blue-500/10 border-2 border-emerald-400/40 rounded-3xl p-6 sm:p-8 space-y-4 shadow-sm">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <div className="p-3 bg-emerald-600 text-white rounded-2xl shadow-md">
              <Sparkles className="w-6 h-6" aria-hidden="true" />
            </div>
            <div>
              <span className="text-xs uppercase tracking-wider font-bold text-emerald-800">
                {language === 'te' ? 'AI ఉద్దేశ్య విశ్లేషణ' : language === 'hi' ? 'एआई इरादा विश्लेषण' : 'AI Intent Analysis'}
              </span>
              <h1 className="text-xl sm:text-2xl font-black text-slate-900">
                {t('discovery.understood')}
              </h1>
            </div>
          </div>

          <button
            onClick={handleReadMatches}
            className="self-start sm:self-auto inline-flex items-center gap-2 px-4 py-2 bg-white hover:bg-slate-50 text-slate-700 text-xs font-semibold rounded-xl border border-slate-200 shadow-sm transition-colors min-h-[40px]"
          >
            <Volume2 className="w-4 h-4 text-emerald-600" />
            <span>
              {isSpeaking
                ? (language === 'te' ? 'ఆడియో ఆపండి' : language === 'hi' ? 'ऑडियो रोकें' : 'Stop Audio')
                : (language === 'te' ? '🔊 చదివి వినిపించు' : language === 'hi' ? '🔊 बोलकर सुनाएं' : '🔊 Read Aloud')}
            </span>
          </button>
        </div>

        <div className="p-4 bg-white/90 rounded-2xl border border-emerald-200/80 shadow-sm">
          <p className="text-lg sm:text-xl font-bold text-emerald-950">
            {understoodText}
          </p>
          {query && (
            <p className="text-xs text-slate-500 mt-1 italic">
              {language === 'te'
                ? `శోధించిన ప్రశ్న: "${query}" ${
                    activeCategory
                      ? `(వర్గ ఫిల్టర్: ${
                          activeCategory === 'Disability Services'
                            ? 'దివ్యాంగుల సేవలు'
                            : activeCategory === 'Education'
                            ? 'విద్య'
                            : activeCategory === 'Farmer Services'
                            ? 'రైతు సేవలు'
                            : activeCategory === 'Senior Citizens'
                            ? 'వయోవృద్ధులు'
                            : activeCategory === 'Certificates'
                            ? 'ధృవపత్రాలు'
                            : activeCategory
                        })`
                      : ''
                  }`
                : language === 'hi'
                ? `खोजा गया प्रश्न: "${query}" ${
                    activeCategory
                      ? `(श्रेणी फ़िल्टर: ${
                          activeCategory === 'Disability Services'
                            ? 'दिव्यांग सेवाएं'
                            : activeCategory === 'Education'
                            ? 'शिक्षा'
                            : activeCategory === 'Farmer Services'
                            ? 'किसान सेवाएं'
                            : activeCategory === 'Senior Citizens'
                            ? 'वरिष्ठ नागरिक'
                            : activeCategory === 'Certificates'
                            ? 'प्रमाणपत्र'
                            : activeCategory
                        })`
                      : ''
                  }`
                : `Searched query: "${query}" ${activeCategory ? `(Category filter: ${activeCategory})` : ''}`}
            </p>
          )}
        </div>
      </div>

      {/* Mandatory civic disclaimer */}
      <div className="p-3.5 rounded-xl bg-amber-50 border border-amber-200 text-xs text-amber-900 flex items-center justify-between gap-3">
        <div className="flex items-center gap-2">
          <span className="font-bold uppercase tracking-wider text-[10px] px-1.5 py-0.5 rounded bg-amber-200 text-amber-900">
            {t('demoBadge')}
          </span>
          <span>{t('disclaimer')}</span>
        </div>
      </div>

      {/* Clarifying Question Banner (Shown only if two categories tie) */}
      {matchResult.tieBreaker?.isTie && (
        <div className="bg-amber-50/90 border-2 border-amber-300 rounded-3xl p-5 sm:p-6 shadow-sm flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div className="flex items-start gap-3">
            <div className="p-2.5 bg-amber-500 text-white rounded-xl shrink-0 mt-0.5">
              <HelpCircle className="w-5 h-5" aria-hidden="true" />
            </div>
            <div>
              <span className="text-xs uppercase tracking-wider font-bold text-amber-800 block">
                {language === 'te' ? 'స్పష్టీకరణ ప్రశ్న' : language === 'hi' ? 'स्पष्टीकरण प्रश्न' : 'Clarification Question'}
              </span>
              <h3 className="text-base sm:text-lg font-bold text-amber-950 mt-0.5">
                {matchResult.tieBreaker.question[language] || matchResult.tieBreaker.question.en}
              </h3>
            </div>
          </div>

          <div className="flex items-center gap-2 flex-wrap sm:shrink-0">
            {matchResult.tieBreaker.categories.map((cat) => {
              const localizedCat =
                cat === 'Disability Services'
                  ? (language === 'te' ? 'దివ్యాంగుల సేవలు' : language === 'hi' ? 'दिव्यांग सेवाएं' : cat)
                  : cat === 'Education'
                  ? (language === 'te' ? 'విద్య' : language === 'hi' ? 'शिक्षा' : cat)
                  : cat === 'Farmer Services'
                  ? (language === 'te' ? 'రైతు సేవలు' : language === 'hi' ? 'किसान सेवाएं' : cat)
                  : cat === 'Senior Citizens'
                  ? (language === 'te' ? 'వయోవృద్ధులు' : language === 'hi' ? 'वरिष्ठ नागरिक' : cat)
                  : cat === 'Certificates'
                  ? (language === 'te' ? 'ధృవపత్రాలు' : language === 'hi' ? 'प्रमाणपत्र' : cat)
                  : cat;
              return (
                <button
                  key={cat}
                  type="button"
                  onClick={() => setActiveCategory(cat)}
                  className={`px-4 py-2 rounded-xl text-xs sm:text-sm font-bold shadow-sm transition-all min-h-[40px] border ${
                    activeCategory === cat
                      ? 'bg-amber-600 text-white border-amber-600'
                      : 'bg-white hover:bg-amber-100 text-amber-900 border-amber-300'
                  }`}
                >
                  {localizedCat}
                </button>
              );
            })}
          </div>
        </div>
      )}

      {/* Results Section */}
      {!matchResult.hasConfidentMatch || matchResult.matchedServices.length === 0 ? (
        /* Empty State with Manual Category Selection */
        <div className="bg-white rounded-3xl border border-slate-200 shadow-md p-8 sm:p-12 text-center space-y-6">
          <div className="w-16 h-16 mx-auto bg-amber-100 text-amber-700 rounded-3xl flex items-center justify-center">
            <Search className="w-8 h-8" />
          </div>

          <div className="max-w-md mx-auto space-y-2">
            <h2 className="text-xl sm:text-2xl font-black text-slate-900">
              {language === 'te'
                ? 'మా డెమో డేటాలో మీ శోధనకు సరిపోయే సేవ కనుగొనబడలేదు'
                : language === 'hi'
                ? 'हमारे डेमो डेटा में आपकी खोज से मेल खाती कोई सेवा नहीं मिली'
                : "We couldn't find a matching service in our demo data"}
            </h2>
            <p className="text-sm text-slate-500">
              {language === 'te'
                ? 'దయచేసి మీ అవసరాన్ని మళ్లీ టైప్ చేయండి లేదా క్రింది వర్గాల నుండి మానవీయంగా పథకాలను ఎంచుకోండి:'
                : language === 'hi'
                ? 'कृपया अपनी आवश्यकता को पुनः लिखें या नीचे दी गई श्रेणियों में से मैनुअल रूप से चुनें:'
                : 'Please rephrase your search or select a service category manually below to explore demo schemes:'}
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 max-w-4xl mx-auto pt-4 text-left">
            {[
              {
                id: 'Disability Services',
                icon: AccessibilityIcon,
                label: t('categories.disability') || 'Disability Services',
                desc:
                  language === 'te'
                    ? 'పెన్షన్లు, సహాయక పరికరాలు & సర్టిఫికెట్లు'
                    : language === 'hi'
                    ? 'पेंशन, सहायक उपकरण एवं प्रमाण पत्र'
                    : 'Pensions, assistive devices & certificates',
                color: 'purple',
              },
              {
                id: 'Education',
                icon: GraduationCap,
                label: t('categories.education') || 'Education',
                desc:
                  language === 'te'
                    ? 'స్కాలర్‌షిప్‌లు & విద్యార్థి గ్రాంట్లు'
                    : language === 'hi'
                    ? 'छात्रवृत्ति और छात्र अनुदान'
                    : 'Scholarships & student grants',
                color: 'indigo',
              },
              {
                id: 'Farmer Services',
                icon: Wheat,
                label: t('categories.farmer') || 'Farmer Services',
                desc:
                  language === 'te'
                    ? 'పంట పెట్టుబడి & వ్యవసాయ సబ్సిడీలు'
                    : language === 'hi'
                    ? 'फसल निवेश और कृषि सब्सिडी'
                    : 'Crop investment & agricultural subsidies',
                color: 'lime',
              },
              {
                id: 'Senior Citizens',
                icon: HeartHandshake,
                label: t('categories.senior') || 'Senior Citizens',
                desc:
                  language === 'te'
                    ? 'వృద్ధాప్య నెలవారీ సామాజిక పెన్షన్'
                    : language === 'hi'
                    ? 'वृद्धावस्था मासिक सामाजिक पेंशन'
                    : 'Old-age monthly social pension',
                color: 'amber',
              },
              {
                id: 'Certificates',
                icon: FileText,
                label: t('categories.certificates') || 'Certificates',
                desc:
                  language === 'te'
                    ? 'అధికారిక ఆదాయ ధృవీకరణ పత్రాలు'
                    : language === 'hi'
                    ? 'आधिकारिक आय प्रमाण पत्र'
                    : 'Official income certificates',
                color: 'sky',
              },
            ].map((cat) => {
              const Icon = cat.icon;
              return (
                <button
                  key={cat.id}
                  type="button"
                  onClick={() => setActiveCategory(cat.id)}
                  className="p-5 rounded-2xl border border-slate-200 hover:border-emerald-500 hover:bg-emerald-50/40 transition-all flex items-start gap-3.5 group shadow-sm text-left min-h-[64px]"
                >
                  <div className="p-3 rounded-xl bg-slate-100 group-hover:bg-emerald-600 group-hover:text-white transition-colors shrink-0">
                    <Icon className="w-5 h-5 text-slate-700 group-hover:text-white" />
                  </div>
                  <div>
                    <span className="font-bold text-slate-900 block group-hover:text-emerald-950">
                      {cat.label}
                    </span>
                    <span className="text-xs text-slate-500 mt-0.5 block">
                      {cat.desc}
                    </span>
                  </div>
                </button>
              );
            })}
          </div>
        </div>
      ) : (
        /* Matched Services List */
        <div className="space-y-6">
          <div className="flex items-center justify-between">
            <h2 className="text-xl sm:text-2xl font-extrabold text-slate-900">
              {t('discovery.recommended')} ({matchResult.matchedServices.length})
            </h2>
            <span className="text-xs font-semibold text-slate-500">
              {t('discovery.sortedRelevance')}
            </span>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {matchResult.matchedServices.map(({ service, whyMatch, matchScore }) => {
              const serviceName =
                language === 'te'
                  ? service.name_te
                  : language === 'hi'
                  ? service.name_hi
                  : service.name;

              const serviceDesc =
                language === 'te'
                  ? service.description_te
                  : language === 'hi'
                  ? service.description_hi
                  : service.description;

              const whyMatchText = whyMatch[language] || whyMatch.en;

              const eligibilitySummary =
                language === 'te'
                  ? service.eligibility.summary_te || service.eligibility.summary
                  : language === 'hi'
                  ? service.eligibility.summary_hi || service.eligibility.summary
                  : service.eligibility.summary;

              return (
                <div
                  key={service.id}
                  className="bg-white rounded-3xl border border-slate-200 shadow-md hover:shadow-xl transition-all p-6 sm:p-7 flex flex-col justify-between space-y-6"
                >
                  <div className="space-y-4">
                    {/* Category & Match Score */}
                    <div className="flex items-center justify-between gap-2 flex-wrap">
                      <span className="px-3 py-1 rounded-full text-xs font-bold bg-indigo-50 text-indigo-700 border border-indigo-200">
                        {language === 'te' ? service.category_te || service.category : language === 'hi' ? service.category_hi || service.category : service.category}
                      </span>
                      <div className="flex items-center gap-1.5 text-xs font-bold text-emerald-700 bg-emerald-50 px-2.5 py-1 rounded-full border border-emerald-200">
                        <CheckCircle2 className="w-3.5 h-3.5" />
                        <span>{matchScore}% {t('discovery.matchPercent')}</span>
                      </div>
                    </div>

                    {/* Service Title & Department */}
                    <div>
                      <h3 className="text-xl font-black text-slate-900 leading-snug">
                        {serviceName}
                      </h3>
                      <p className="text-xs text-slate-500 mt-1 flex items-center gap-1.5 font-medium">
                        <Building className="w-3.5 h-3.5 text-slate-400" />
                        <span>{language === 'te' ? service.department_te || service.department : language === 'hi' ? service.department_hi || service.department : service.department}</span>
                      </p>
                    </div>

                    {/* Why this matches you */}
                    <div className="p-3.5 rounded-2xl bg-emerald-50/70 border border-emerald-200/60 text-xs text-emerald-950 space-y-1">
                      <span className="font-bold flex items-center gap-1.5 text-emerald-800">
                        <Sparkles className="w-3.5 h-3.5" />
                        <span>{t('serviceCard.whyMatch')}:</span>
                      </span>
                      <p className="leading-relaxed font-medium">{whyMatchText}</p>
                    </div>

                    {/* Service Description */}
                    <p className="text-sm text-slate-600 leading-relaxed">
                      {serviceDesc}
                    </p>

                    {/* Metadata Chips: Timeline, Fee, Docs */}
                    <div className="grid grid-cols-2 sm:grid-cols-3 gap-2 pt-2 border-t border-slate-100 text-xs">
                      <div className="p-2.5 rounded-xl bg-slate-50 border border-slate-100">
                        <span className="block text-slate-400 font-medium text-[10px]">
                          {t('serviceCard.timeline')}
                        </span>
                        <span className="font-bold text-slate-800 flex items-center gap-1 mt-0.5">
                          <Clock className="w-3 h-3 text-slate-500" />
                          {service.processing_information.timelineDays} {language === 'te' ? 'రోజులు' : language === 'hi' ? 'दिन' : 'Days'}
                        </span>
                      </div>

                      <div className="p-2.5 rounded-xl bg-slate-50 border border-slate-100">
                        <span className="block text-slate-400 font-medium text-[10px]">
                          {t('serviceCard.fee')}
                        </span>
                        <span className="font-bold text-slate-800 mt-0.5 block truncate">
                          {language === 'te' ? service.processing_information.fee_te || service.processing_information.fee : language === 'hi' ? service.processing_information.fee_hi || service.processing_information.fee : service.processing_information.fee}
                        </span>
                      </div>

                      <div className="p-2.5 rounded-xl bg-slate-50 border border-slate-100 col-span-2 sm:col-span-1">
                        <span className="block text-slate-400 font-medium text-[10px]">
                          {language === 'te' ? 'పత్రాలు' : language === 'hi' ? 'दस्तावेज' : 'Documents'}
                        </span>
                        <span className="font-bold text-slate-800 flex items-center gap-1 mt-0.5">
                          <FileText className="w-3 h-3 text-slate-500" />
                          {service.documents.length} {language === 'te' ? 'పత్రాలు' : language === 'hi' ? 'दस्तावेज' : 'Items'}
                        </span>
                      </div>
                    </div>

                    {/* Eligibility criteria preview */}
                    <div className="text-xs text-slate-600 bg-slate-50 p-3 rounded-xl border border-slate-200/70">
                      <span className="font-bold text-slate-800 block mb-0.5">
                        {t('discovery.eligibilityOverview')}
                      </span>
                      <span>{eligibilitySummary}</span>
                    </div>
                  </div>

                  {/* Primary CTA */}
                  <div className="pt-4 border-t border-slate-100">
                    <button
                      onClick={() => {
                        onSelectService(service);
                        onNavigate('wizard', { serviceId: service.id });
                      }}
                      className="w-full py-3.5 px-5 rounded-2xl bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-sm shadow-md shadow-emerald-600/20 flex items-center justify-center gap-2 min-h-[48px] transition-all"
                    >
                      <span>{t('serviceCard.checkEligibility')}</span>
                      <ArrowRight className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}
    </div>
  );
};
