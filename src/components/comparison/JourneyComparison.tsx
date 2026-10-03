import React from 'react';
import { useLanguage } from '../../context/LanguageContext';
import {
  CheckCircle2,
  XCircle,
  Sparkles,
  ArrowRight,
  ShieldCheck,
  Building,
  Clock,
  MapPin,
  FileText
} from 'lucide-react';

interface JourneyComparisonProps {
  onClose?: () => void;
  onTrack?: () => void;
}

export const JourneyComparison: React.FC<JourneyComparisonProps> = ({ onClose, onTrack }) => {
  const { language } = useLanguage();

  const getLocalizedContent = () => {
    if (language === 'te') {
      return {
        badge: 'ప్రజా సేవల బట్వాడాలో విప్లవాత్మక మార్పు',
        title: 'మీ దరఖాస్తు ప్రయాణం, సులభతరం',
        subtitle: 'సేవాసారథి గందరగోళం, ఆఫీసుల చుట్టూ తిరగడం లేకుండా పౌరులకు ఎలా సులభమైన సేవలను అందిస్తుందో చూడండి.',
        traditionalHeader: 'సాంప్రదాయ ప్రభుత్వ విధానం',
        sevaSaarthiHeader: 'సేవాసారథి నేవిగేటర్‌తో',
        noticeTitle: 'డెమో బెంచ్‌మార్క్ గమనిక',
        noticeText: 'పైన చూపిన అన్ని కాలపరిమితులు, సందర్శనల సంఖ్య మరియు గణాంకాలు ప్రోటోటైప్ ప్రదర్శన కోసం రూపొందించిన ప్రదర్శన డేటా మాత్రమే.',
        proceedTrack: 'లైవ్ ట్రాకింగ్‌కు వెళ్లండి',
        closeComparison: 'పోలికను మూసివేయి',
        points: [
          {
            step: '1. పథకాల శోధన & గుర్తింపు',
            traditional: 'డజన్ల కొద్దీ విభిన్న శాఖల పోర్టల్‌లను వెతకడం మరియు అర్థం కాని న్యాయపరమైన ఆంగ్లంలో ఉన్న 50 పేజీల గెజిట్ పీడీఎఫ్ ఫైళ్లను చదవడం.',
            traditionalMetric: 'సిమ్యులేటెడ్ డెమో: సరైన శాఖను కనుగొనడానికి 3–5 రోజులు పడుతుంది',
            sevaSaarthi: 'తెలుగు, హిందీ లేదా ఇంగ్లీషులో సహజంగా మాట్లాడండి లేదా టైప్ చేయండి ("నాకు కాలేజీ ఫీజు సహాయం కావాలి") — ఏఐ తక్షణమే సరిపోలే పథకాలను కనుగొంటుంది.',
            sevaSaarthiMetric: 'సిమ్యులేటెడ్ డెమో: 10 సెకన్లలో గుర్తింపు',
          },
          {
            step: '2. అర్హత నిర్ధారణ',
            traditional: 'వయస్సు లేదా ఆదాయ నిబంధనలు సరిపోలేదని తెలుసుకోవడానికి తహశీల్దార్ లేదా మండల రెవెన్యూ కార్యాలయంలో క్యూలలో నిలబడడం.',
            traditionalMetric: 'సిమ్యులేటెడ్ డెమో: కేవలం వివరాల విచారణ కోసమే 2–3 సార్లు కార్యాలయాలకు వెళ్లడం',
            sevaSaarthi: 'స్మార్ట్ 4-ప్రశ్నల విజార్డ్ వయస్సు, రాష్ట్రం, ఆదాయాన్ని పరిశీలించి తక్షణమే 🟢 సరిపోలింది లేదా 🟡 ధృవీకరణ అవసరం అని మార్గదర్శనం చేస్తుంది.',
            sevaSaarthiMetric: 'సిమ్యులేటెడ్ డెమో: తక్షణ ప్రాథమిక పరిశీలన',
          },
          {
            step: '3. పత్రాల తయారీ',
            traditional: 'అస్పష్టమైన పత్రాల జాబితాలు; బోనఫైడ్ లేదా కుల ధృవీకరణ పత్రాలు లేకపోవడం వల్ల పౌరుడు పదే పదే తిరగాల్సి రావడం.',
            traditionalMetric: 'సిమ్యులేటెడ్ డెమో: ప్రారంభంలోనే అధిక తిరస్కరణ రేటు',
            sevaSaarthi: 'తప్పనిసరి మరియు ఐచ్ఛిక పత్రాలను స్పష్టంగా చూపించే చెక్‌లిస్ట్ మరియు తక్షణ డిజిటల్ అప్‌లోడ్ స్థితి.',
            sevaSaarthiMetric: 'సిమ్యులేటెడ్ డెమో: 100% పత్రాల సంసిద్ధత పరిశీలన',
          },
          {
            step: '4. దరఖాస్తు సమర్పణ',
            traditional: 'పనివేళల్లో మ్యాన్యువల్ టోకెన్లతో క్యూలలో నిలబడి క్లిష్టమైన పేపర్ దరఖాస్తులను సమర్పించడం.',
            traditionalMetric: 'సిమ్యులేటెడ్ డెమో: కార్యాలయాల చుట్టూ తిరగడం వల్ల పని దినాలు, వేతనం కోల్పోవడం',
            sevaSaarthi: 'ప్రతి ఫీల్డ్‌కు "ఇది ఎందుకు అడుగుతున్నాము" అనే స్పష్టమైన వివరణతో సులభమైన 4-దశల డిజిటల్ దరఖాస్తు.',
            sevaSaarthiMetric: 'సిమ్యులేటెడ్ డెమో: ఇంట్లోనే మొబైల్ ఫోన్ నుండి పూర్తి',
          },
          {
            step: '5. దరఖాస్తు స్థితి పరిశీలన',
            traditional: 'అస్పష్టమైన ప్రక్రియ; ఫైల్ ఎక్కడ ఆగిపోయిందో తెలుసుకోవడానికి పౌరుడు పదే పదే కార్యాలయాలకు వెళ్లాల్సి రావడం.',
            traditionalMetric: 'సిమ్యులేటెడ్ డెమో: స్థితి తెలియకుండా 45–60 రోజులు వేచి చూడటం',
            sevaSaarthi: 'ఆటోమేటెడ్ SMS అలర్ట్‌లు మరియు సరళమైన భాషా వివరణలతో పారదర్శకమైన 5-దశల టైమ్‌లైన్.',
            sevaSaarthiMetric: 'సిమ్యులేటెడ్ డెమో: 14–21 రోజుల్లో పూర్తి పారదర్శకత',
          },
        ]
      };
    }

    if (language === 'hi') {
      return {
        badge: 'सार्वजनिक सेवा वितरण में क्रांतिकारी बदलाव',
        title: 'आपकी यात्रा, हुई आसान',
        subtitle: 'देखें कैसे सेवासारथी बाधाओं, भ्रम और दफ़्तरों के चक्कर को सहज, सुलभ नागरिक सेवा से बदलता है।',
        traditionalHeader: 'पारंपरिक सरकारी प्रक्रिया',
        sevaSaarthiHeader: 'सेवासारथी नेविगेटर के साथ',
        noticeTitle: 'डेमो बेंचमार्क सूचना',
        noticeText: 'ऊपर दिखाए गए सभी तुलनात्मक समय-सीमा, यात्राओं की संख्या और मेट्रिक्स केवल प्रोटोटाइप प्रदर्शन के उद्देश्य से सिमुलेटेड डेमो डेटा हैं।',
        proceedTrack: 'लाइव ट्रैकिंग पर जाएं',
        closeComparison: 'तुलना बंद करें',
        points: [
          {
            step: '1. योजना खोज और पहचान',
            traditional: 'दर्जनों अलग-अलग सरकारी पोर्टलों पर भटकना और कठिन कानूनी अंग्रेजी में 50 पन्नों के आधिकारिक गजट पीडीएफ पढ़ना।',
            traditionalMetric: 'सिमुलेटेड डेमो: सही विभाग खोजने में 3-5 दिन का समय',
            sevaSaarthi: 'तेलुगु, हिंदी या अंग्रेजी में स्वाभाविक रूप से बोलें या टाइप करें ("मुझे कॉलेज फीस सहायता चाहिए") — एआई तुरंत सटीक योजनाएं ढूंढता है।',
            sevaSaarthiMetric: 'सिमुलेटेड डेमो: 10 सेकंड में पहचान',
          },
          {
            step: '2. पात्रता सत्यापन',
            traditional: 'केवल यह जानने के लिए तहसील या मंडल कार्यालय की कतारों में खड़ा होना कि उम्र या आय की शर्त पूरी नहीं हुई।',
            traditionalMetric: 'सिमुलेटेड डेमो: केवल पूछताछ के लिए 2-3 चक्कर',
            sevaSaarthi: 'स्मार्ट 4-प्रश्नों का विज़ार्ड उम्र, राज्य और आय का मूल्यांकन करके तुरंत 🟢 मेल खाया या 🟡 सत्यापन आवश्यक का मार्गदर्शन देता है।',
            sevaSaarthiMetric: 'सिमुलेटेड डेमो: तत्काल प्रारंभिक जांच',
          },
          {
            step: '3. दस्तावेज़ तैयारी',
            traditional: 'अस्पष्ट दस्तावेज़ सूचियां; आवश्यक प्रमाण पत्र छूट जाने के कारण नागरिक को बार-बार चक्कर लगाने पड़ते हैं।',
            traditionalMetric: 'सिमुलेटेड डेमो: प्रारंभिक अस्वीकृति की उच्च दर',
            sevaSaarthi: 'अनिवार्य बनाम वैकल्पिक दस्तावेज़ों को अलग करने वाली स्पष्ट चेकलिस्ट और त्वरित डिजिटल अपलोड स्थिति।',
            sevaSaarthiMetric: 'सिमुलेटेड डेमो: 100% दस्तावेज़ तैयारी जांच',
          },
          {
            step: '4. आवेदन जमा करना',
            traditional: 'काम के घंटों के दौरान टोकन लेकर कतारों में खड़े होकर जटिल कागजी फॉर्म जमा करना।',
            traditionalMetric: 'सिमुलेटेड डेमो: चक्कर काटने के कारण मजदूरी का नुकसान',
            sevaSaarthi: 'हर फ़ील्ड पर "हम यह क्यों पूछते हैं" के पारदर्शी कारण के साथ 4-चरणीय निर्देशित डिजिटल आवेदन।',
            sevaSaarthiMetric: 'सिमुलेटेड डेमो: घर बैठे मोबाइल डिवाइस से पूरा',
          },
          {
            step: '5. स्थिति ट्रैकिंग',
            traditional: 'अपारदर्शी प्रक्रिया; फ़ाइल कहाँ अटकी है यह जानने के लिए नागरिक को बार-बार दफ़्तरों के चक्कर लगाने पड़ते हैं।',
            traditionalMetric: 'सिमुलेटेड डेमो: बिना किसी स्थिति दृश्यता के 45–60 दिन',
            sevaSaarthi: 'स्वचालित एसएमएस अलर्ट और सरल भाषा में स्पष्टीकरण के साथ पारदर्शी 5-चरणीय टाइमलाइन।',
            sevaSaarthiMetric: 'सिमुलेटेड डेमो: 14-21 दिनों में शुरू से अंत तक पारदर्शिता',
          },
        ]
      };
    }

    return {
      badge: 'Transforming Public Service Delivery',
      title: 'Your Journey, Simplified',
      subtitle: 'See how SevaSaarthi replaces friction, confusion, and office visits with seamless, accessible citizen navigation.',
      traditionalHeader: 'Traditional Government Process',
      sevaSaarthiHeader: 'With SevaSaarthi Navigator',
      noticeTitle: 'Demo Benchmark Notice',
      noticeText: 'All comparison timelines, visit counts, and metrics shown above are strictly simulated demo data for prototype demonstration purposes.',
      proceedTrack: 'Proceed to Live Tracking',
      closeComparison: 'Close Comparison',
      points: [
        {
          step: '1. Discovery & Scheme Search',
          traditional: 'Navigating dozens of disjointed department portals and reading 50-page official gazette PDFs in unfamiliar legal English.',
          traditionalMetric: 'Simulated demo: 3–5 days spent figuring out right department',
          sevaSaarthi: 'Speak or type naturally in Telugu, Hindi or English ("I need college fee help") — AI instantly finds the exact matching schemes.',
          sevaSaarthiMetric: 'Simulated demo: 10 seconds intent detection',
        },
        {
          step: '2. Eligibility Verification',
          traditional: 'Queueing at Mandal Revenue or Tahsildar office only to discover an age or income condition was not met.',
          traditionalMetric: 'Simulated demo: 2–3 physical visits just for inquiries',
          sevaSaarthi: 'Smart 4-question wizard evaluates age, state, and income with instant 🟢 Matched or 🟡 Needs Verification guidance.',
          sevaSaarthiMetric: 'Simulated demo: Instant preliminary check',
        },
        {
          step: '3. Document Preparation',
          traditional: 'Vague document lists; citizen returns multiple times due to missing bonafide or community certificates.',
          traditionalMetric: 'Simulated demo: High initial rejection rate',
          sevaSaarthi: 'Clear checklist separating Required vs Optional documents with instant digital upload status.',
          sevaSaarthiMetric: 'Simulated demo: 100% document readiness check',
        },
        {
          step: '4. Application Submission',
          traditional: 'Submitting complex multi-page paper forms during working hours with manual queue tokens.',
          traditionalMetric: 'Simulated demo: Lost work wages during visits',
          sevaSaarthi: 'Assisted 4-step guided digital application with transparent "Why we ask this" rationale on every field.',
          sevaSaarthiMetric: 'Simulated demo: Completed from home mobile device',
        },
        {
          step: '5. Status Tracking',
          traditional: 'Black-box process; citizen must repeatedly visit physical desks to find out where file is stuck.',
          traditionalMetric: 'Simulated demo: 45–60 days without status visibility',
          sevaSaarthi: 'Transparent 5-stage vertical timeline with automated SMS alerts and plain-language stage explanations.',
          sevaSaarthiMetric: 'Simulated demo: 14–21 days end-to-end transparency',
        },
      ]
    };
  };

  const content = getLocalizedContent();
  const comparisonPoints = content.points;

  return (
    <div className="bg-white rounded-3xl border border-slate-200 shadow-xl p-6 sm:p-10 space-y-8">
      {/* Header */}
      <div className="text-center space-y-3">
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-100 text-emerald-800 text-xs font-bold border border-emerald-300">
          <Sparkles className="w-4 h-4 text-emerald-600" />
          <span>{content.badge}</span>
        </div>
        <h2 className="text-2xl sm:text-3xl font-black text-slate-900 tracking-tight">
          {content.title}
        </h2>
        <p className="text-sm sm:text-base text-slate-600 max-w-2xl mx-auto">
          {content.subtitle}
        </p>
      </div>

      {/* Comparison Cards Grid */}
      <div className="space-y-6">
        {comparisonPoints.map((point, idx) => (
          <div
            key={idx}
            className="rounded-2xl border border-slate-200 overflow-hidden shadow-sm grid grid-cols-1 md:grid-cols-2 divide-y md:divide-y-0 md:divide-x divide-slate-200"
          >
            {/* Traditional Process */}
            <div className="p-5 sm:p-6 bg-rose-50/40 space-y-3">
              <div className="flex items-center gap-2 text-rose-800 font-bold text-xs uppercase tracking-wider">
                <XCircle className="w-4 h-4 text-rose-600" />
                <span>{content.traditionalHeader}</span>
              </div>
              <h4 className="font-extrabold text-slate-900 text-sm">{point.step}</h4>
              <p className="text-xs sm:text-sm text-slate-600 leading-relaxed">
                {point.traditional}
              </p>
              <div className="pt-1">
                <span className="inline-block text-[11px] font-semibold text-rose-700 bg-rose-100/80 px-2.5 py-0.5 rounded-full border border-rose-200">
                  {point.traditionalMetric}
                </span>
              </div>
            </div>

            {/* SevaSaarthi Process */}
            <div className="p-5 sm:p-6 bg-emerald-50/40 space-y-3">
              <div className="flex items-center gap-2 text-emerald-800 font-bold text-xs uppercase tracking-wider">
                <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                <span>{content.sevaSaarthiHeader}</span>
              </div>
              <h4 className="font-extrabold text-emerald-950 text-sm">{point.step}</h4>
              <p className="text-xs sm:text-sm text-slate-700 leading-relaxed font-medium">
                {point.sevaSaarthi}
              </p>
              <div className="pt-1">
                <span className="inline-block text-[11px] font-semibold text-emerald-800 bg-emerald-100 px-2.5 py-0.5 rounded-full border border-emerald-300">
                  {point.sevaSaarthiMetric}
                </span>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Mandatory Simulated Demo Banner */}
      <div className="p-4 rounded-2xl bg-amber-50 border border-amber-200 text-xs text-amber-900 text-center space-y-1">
        <span className="font-bold block uppercase tracking-wider text-[10px]">
          {content.noticeTitle}
        </span>
        <p>
          {content.noticeText}
        </p>
      </div>

      {/* Action buttons */}
      <div className="pt-2 flex flex-col sm:flex-row items-center justify-center gap-4">
        {onTrack && (
          <button
            onClick={onTrack}
            className="w-full sm:w-auto px-8 py-3.5 bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-sm rounded-2xl shadow-lg shadow-emerald-600/25 flex items-center justify-center gap-2 min-h-[48px]"
          >
            <span>{content.proceedTrack}</span>
            <ArrowRight className="w-4 h-4" />
          </button>
        )}
        {onClose && (
          <button
            onClick={onClose}
            className="w-full sm:w-auto px-6 py-3.5 bg-slate-100 hover:bg-slate-200 text-slate-700 font-semibold text-sm rounded-2xl min-h-[48px]"
          >
            {content.closeComparison}
          </button>
        )}
      </div>
    </div>
  );
};
