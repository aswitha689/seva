import servicesData from '../data/services.json';
import { Service } from '../types/service';
import { Application } from '../types/application';
import { Language } from '../context/LanguageContext';

export interface AssistantContext {
  currentRoute: string;
  selectedService?: Service;
  activeApplication?: Application | null;
  language: Language;
}

export interface AssistantResponse {
  text: string;
  suggestedAction?: {
    label: string;
    route: string;
    params?: any;
  };
}

/**
 * Swappable assistant engine. Calls server-side LLM endpoint with retrieval from services table,
 * and seamlessly falls back to keyword/rule matcher if the API fails or key is unconfigured.
 */
export const askAssistant = async (
  query: string,
  context: AssistantContext
): Promise<AssistantResponse> => {
  const normalized = query.toLowerCase().trim();
  const lang = context.language;
  const currentService = context.selectedService;
  const currentApp = context.activeApplication;

  // 0. Attempt Server-Side LLM Call (Retrieval-Augmented on Services)
  try {
    const res = await fetch('/api/llm-explain', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ query, language: lang }),
    });

    if (res.ok) {
      const data = await res.json();
      if (data && data.text) {
        return {
          text: data.text,
          suggestedAction: currentService
            ? {
                label:
                  lang === 'te'
                    ? 'అర్హత తనిఖీ చేయండి'
                    : lang === 'hi'
                    ? 'पात्रता जांचें'
                    : 'Check Eligibility',
                route: 'wizard',
                params: { serviceId: currentService.id },
              }
            : {
                label:
                  lang === 'te'
                    ? 'పథకాలను అన్వేషించండి'
                    : lang === 'hi'
                    ? 'योजनाएं खोजें'
                    : 'Explore Schemes',
                route: 'discovery',
              },
        };
      }
    }
  } catch (apiErr) {
    // API failed or offline - fall through gracefully to keyword matcher
    console.info('LLM endpoint unavailable, using local keyword matcher fallback.');
  }

  // 1. Tracking status inquiry
  if (
    normalized.includes('track') ||
    normalized.includes('status') ||
    normalized.includes('ఎక్కడ ఉంది') ||
    normalized.includes('స్థితి') ||
    normalized.includes('ట్రాక్') ||
    normalized.includes('स्थिति') ||
    normalized.includes('ट्रैक')
  ) {
    const formatStage = (st: string) => {
      if (lang === 'te') {
        const m: Record<string, string> = {
          submitted: 'సమర్పించబడింది',
          documents_received: 'పత్రాలు స్వీకరించబడ్డాయి',
          department_review: 'శాఖ సమీక్ష',
          decision: 'మంజూరు నిర్ణయం',
          completed: 'పూర్తయింది',
        };
        return m[st] || st.replace('_', ' ');
      }
      if (lang === 'hi') {
        const m: Record<string, string> = {
          submitted: 'जमा किया गया',
          documents_received: 'दस्तावेज प्राप्त हुए',
          department_review: 'विभागीय समीक्षा',
          decision: 'स्वीकृति निर्णय',
          completed: 'पूर्ण हुआ',
        };
        return m[st] || st.replace('_', ' ');
      }
      return st.replace('_', ' ').toUpperCase();
    };

    if (currentApp) {
      if (lang === 'te') {
        return {
          text: `మీ దరఖాస్తు ID ${currentApp.id} ప్రస్తుతం '${formatStage(currentApp.status)}' దశలో ఉంది. సంబంధిత అధికారులు పరిశీలిస్తున్నారు.`,
          suggestedAction: { label: 'దరఖాస్తు స్థితి చూడండి', route: 'track', params: { searchId: currentApp.id } },
        };
      } else if (lang === 'hi') {
        return {
          text: `आपका आवेदन ID ${currentApp.id} वर्तमान में '${formatStage(currentApp.status)}' स्थिति में है। अधिकारी समीक्षा कर रहे हैं।`,
          suggestedAction: { label: 'आवेदन स्थिति देखें', route: 'track', params: { searchId: currentApp.id } },
        };
      }
      return {
        text: `Your application (${currentApp.id}) is currently in the '${formatStage(currentApp.status)}' stage. Department officers are reviewing it.`,
        suggestedAction: { label: 'View Tracking Timeline', route: 'track', params: { searchId: currentApp.id } },
      };
    } else {
      if (lang === 'te') {
        return {
          text: 'మీరు మీ దరఖాస్తు ఐడీ (ఉదా. SV-2026-001247) ద్వారా ట్రాకింగ్ పేజీలో ప్రత్యక్ష స్థితిని తనిఖీ చేయవచ్చు.',
          suggestedAction: { label: 'ట్రాకింగ్ పేజీకి వెళ్లండి', route: 'track' },
        };
      } else if (lang === 'hi') {
        return {
          text: 'आप अपने आवेदन आईडी (उदा. SV-2026-001247) के माध्यम से ट्रैकिंग पेज पर लाइव स्थिति देख सकते हैं।',
          suggestedAction: { label: 'ट्रैकिंग पेज पर जाएं', route: 'track' },
        };
      }
      return {
        text: 'You can check your live progress using your Application ID (e.g. SV-2026-001247) on the tracking page.',
        suggestedAction: { label: 'Open Tracking Page', route: 'track' },
      };
    }
  }

  // 2. Documents inquiry
  if (
    normalized.includes('document') ||
    normalized.includes('documents') ||
    normalized.includes('certificates') ||
    normalized.includes('పత్రాలు') ||
    normalized.includes('సర్టిఫికెట్లు') ||
    normalized.includes('దస్తావేజులు') ||
    normalized.includes('दस्तावेज') ||
    normalized.includes('प्रमाण पत्र')
  ) {
    const s = currentService || (servicesData[0] as Service);
    const docNames = s.documents.map((d) => (lang === 'te' ? d.name_te || d.name : lang === 'hi' ? d.name_hi || d.name : d.name)).join(', ');

    if (lang === 'te') {
      return {
        text: `'${s.name_te}' పథకానికి అవసరమైన పత్రాలు: ${docNames}. డిజిటల్ లేదా మొబైల్ ఫోటో ద్వారా వీటిని సులభంగా అప్‌లోడ్ చేయవచ్చు.`,
        suggestedAction: { label: 'పత్రాల జాబితా తెరవండి', route: 'checklist', params: { serviceId: s.id } },
      };
    } else if (lang === 'hi') {
      return {
        text: `'${s.name_hi}' योजना के लिए आवश्यक दस्तावेज हैं: ${docNames}। आप इन्हें आसानी से मोबाइल से अपलोड कर सकते हैं।`,
        suggestedAction: { label: 'दस्तावेज़ चेकलिस्ट देखें', route: 'checklist', params: { serviceId: s.id } },
      };
    }
    return {
      text: `For ${s.name}, the required documents are: ${docNames}. You can attach digital scans or photos directly.`,
      suggestedAction: { label: 'View Document Checklist', route: 'checklist', params: { serviceId: s.id } },
    };
  }

  // 3. Eligibility inquiry
  if (
    normalized.includes('eligible') ||
    normalized.includes('eligibility') ||
    normalized.includes('qualify') ||
    normalized.includes('అర్హత') ||
    normalized.includes('అర్హులా') ||
    normalized.includes('पात्र') ||
    normalized.includes('पात्रता')
  ) {
    const s = currentService || (servicesData[0] as Service);
    const summary = lang === 'te' ? s.eligibility.summary_te || s.eligibility.summary : lang === 'hi' ? s.eligibility.summary_hi || s.eligibility.summary : s.eligibility.summary;

    if (lang === 'te') {
      return {
        text: `'${s.name_te}' అర్హత సారాంశం: ${summary}. మన అర్హత విజార్డ్‌లో 4 సాధారణ ప్రశ్నలకు సమాధానం ఇచ్చి మీ అర్హతను తనిఖీ చేసుకోవచ్చు.`,
        suggestedAction: { label: 'అర్హత తనిఖీ చేయండి', route: 'wizard', params: { serviceId: s.id } },
      };
    } else if (lang === 'hi') {
      return {
        text: `'${s.name_hi}' पात्रता सारांश: ${summary}। आप 4 सरल प्रश्नों के उत्तर देकर 30 सेकंड में अपनी पात्रता जांच सकते हैं।`,
        suggestedAction: { label: 'पात्रता विज़ार्ड खोलें', route: 'wizard', params: { serviceId: s.id } },
      };
    }
    return {
      text: `Eligibility for ${s.name}: ${summary}. You can use our 4-question wizard to verify in 30 seconds.`,
      suggestedAction: { label: 'Run Eligibility Wizard', route: 'wizard', params: { serviceId: s.id } },
    };
  }

  // 4. Time / Processing duration inquiry
  if (
    normalized.includes('time') ||
    normalized.includes('days') ||
    normalized.includes('when') ||
    normalized.includes('ఎప్పుడు') ||
    normalized.includes('రోజులు') ||
    normalized.includes('కాలపరిమితి') ||
    normalized.includes('कब') ||
    normalized.includes('समय') ||
    normalized.includes('कितने दिन')
  ) {
    const s = currentService || (servicesData[0] as Service);
    const days = s.processing_information.timelineDays;

    if (lang === 'te') {
      return {
        text: `'${s.name_te}' సాధారణ ప్రాసెసింగ్ సమయం సుమారు ${days} రోజులు. నగదు నేరుగా మీ బ్యాంక్ ఖాతాలో DBT ద్వారా జమ చేయబడుతుంది.`,
      };
    } else if (lang === 'hi') {
      return {
        text: `'${s.name_hi}' के लिए मानक प्रसंस्करण समय लगभग ${days} कार्य दिवस है। सहायता राशि सीधे आपके बैंक खाते में डीबीटी द्वारा भेजी जाती है।`,
      };
    }
    return {
      text: `Standard processing for ${s.name} takes approximately ${days} working days. Sanctions are credited directly via DBT to your bank account.`,
    };
  }

  // 5. Default Fallback Guidance
  if (lang === 'te') {
    return {
      text: 'నేను సేవాసారథి సహాయకుడిని. మీకు పథకం అర్హత, అవసరమైన పత్రాలు, దరఖాస్తు విధానం లేదా ట్రాకింగ్ గురించి ఏదైనా సహాయం కావాలా?',
      suggestedAction: { label: 'పథకాలను అన్వేషించండి', route: 'discovery' },
    };
  } else if (lang === 'hi') {
    return {
      text: 'मैं सेवासारथी सहायक हूँ। क्या आपको योजना पात्रता, आवश्यक दस्तावेज या आवेदन स्थिति के बारे में जानकारी चाहिए?',
      suggestedAction: { label: 'योजनाएं देखें', route: 'discovery' },
    };
  }

  return {
    text: 'I am your SevaSaarthi Civic Navigator. I can assist you with scheme eligibility, required documents, application steps, or live tracking. What would you like to know?',
    suggestedAction: { label: 'Explore Schemes', route: 'discovery' },
  };
};
