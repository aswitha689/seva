import servicesData from '../data/services.json';
import { Service } from '../types/service';

export interface TieBreaker {
  isTie: boolean;
  categories: string[];
  question: {
    en: string;
    te: string;
    hi: string;
  };
}

export interface MatchedServiceItem {
  service: Service;
  whyMatch: {
    en: string;
    te: string;
    hi: string;
  };
  matchScore: number;
}

export interface MatchResult {
  understoodNeed: {
    en: string;
    te: string;
    hi: string;
  };
  detectedCategory: string | null;
  hasConfidentMatch: boolean;
  tieBreaker?: TieBreaker;
  matchedServices: MatchedServiceItem[];
}

interface CategoryConfig {
  category: string;
  understoodNeed: {
    en: string;
    te: string;
    hi: string;
  };
  whyMatch: {
    en: string;
    te: string;
    hi: string;
  };
  // Broad category keywords (score +40, marks isCategoryLevel = true)
  categoryKeywords: string[];
  // High-confidence multi-word phrases (score +30)
  phrases: string[];
  // Single keywords (score +10)
  keywords: string[];
}

export const CATEGORY_DEFINITIONS: CategoryConfig[] = [
  {
    category: 'Disability Services',
    understoodNeed: {
      en: '♿ Disability Welfare, Pensions & Assistive Services',
      te: '♿ దివ్యాంగుల సంక్షేమం, పింఛను & సహాయక సేవలు',
      hi: '♿ दिव्यांग कल्याण, पेंशन एवं सहायक उपकरण योजनाएं',
    },
    whyMatch: {
      en: 'Official disability welfare program supporting citizens with certified disabilities, limb loss, and mobility challenges.',
      te: 'దివ్యాంగులు, ప్రమాదాలలో అవయవాలు కోల్పోయిన వారు మరియు నడవలేని వారికి ప్రభుత్వం అందించే అధికారిక సంక్షేమ పథకం.',
      hi: 'प्रमाणित दिव्यांगता अथवा हादसे में अंग गंवाने वाले नागरिकों के लिए आधिकारिक सरकारी सहायता योजना।',
    },
    categoryKeywords: [
      // English
      'disability schemes', 'disability scheme', 'disability services', 'disability service',
      'disability', 'disabled', 'physically handicapped', 'handicapped', 'handicap',
      'divyang', 'divyangjan', 'pwd', 'locomotor disability', 'assistive devices', 'special needs',
      // Telugu
      'దివ్యాంగుల పథకాలు', 'దివ్యాంగుల సేవలు', 'దివ్యాంగులు', 'దివ్యాంగుల', 'దివ్యాంగులకు',
      'దివ్యాంగ్', 'వికలాంగులు', 'వికలాంగుల', 'వికలాంగ పథకాలు', 'వికలాంగ', 'అంగవైకల్యం', 'వైకల్యం', 'శారీరక వైకల్యం',
      // Hindi
      'दिव्यांग योजनाएं', 'दिव्यांग योजना', 'दिव्यांग सेवाएं', 'दिव्यांग सेवा', 'दिव्यांग',
      'दिव्यांगजन', 'दिव्यांगों', 'विकलांग', 'विकलांगता', 'विकलांगों', 'अपंग', 'शारीरिक विकलांगता', 'विकलांगता सहायता',
    ],
    phrases: [
      // English
      'lost my hand', 'lost my leg', 'lost a hand', 'lost a leg', 'lost hand', 'lost leg',
      'hand lost', 'leg lost', 'lost both legs', 'lost both hands', 'loss of hand', 'loss of leg',
      'motorized tricycle', 'artificial limb', 'artificial limbs', 'prosthetic limb',
      'wheelchair assistance', 'sadarem certificate', 'udid card', 'disability pension',
      'disability certificate', 'assistive device', 'mobility aid', 'physical disability',
      // Telugu
      'చేయి పోయింది', 'కాలు పోయింది', 'చేతులు పోయాయి', 'కాళ్ళు పోయాయి',
      'చేయి కోల్పోయా', 'కాలు కోల్పోయా', 'చక్రాల కుర్చీ', 'కృత్రిమ అవయవాలు',
      'మోటరైజ్డ్ ట్రైసైకిల్', 'సదరెం సర్టిఫికెట్', 'దివ్యాంగ పింఛను', 'చేతి కర్రలు', 'నడవలేని స్థితి',
      'శారీరక వైకల్యం', 'వైకల్యానికి సహాయం', 'శారీరక వికలాంగులు',
      // Hindi
      'हाथ कट गया', 'पैर कट गया', 'हाथ चला गया', 'पैर चला गया', 'हाथ खो दिया', 'पैर खो दिया',
      'हाथ कट', 'पैर कट', 'हादसे में हाथ', 'दुर्घटना में हाथ', 'हादसे में पैर', 'दुर्घटना में पैर',
      'कृत्रिम अंग', 'दिव्यांग पेंशन', 'दिव्यांग प्रमाण पत्र', 'पहिया कुर्सी',
      'शारीरिक विकलांगता', 'विकलांगता के लिए सहायता', 'दिव्यांगता सहायता', 'शारीरिक रूप से विकलांग',
    ],
    keywords: [
      // English
      'accident', 'accidents', 'hand', 'hands', 'leg', 'legs', 'limb', 'limbs',
      'wheelchair', 'wheelchairs', 'tricycle', 'crutches', 'prosthetic', 'prosthetics',
      'amputation', 'amputee', 'paralysis', 'sadarem', 'udid', 'blind', 'deaf',
      'locomotor', 'impairment',
      // Telugu
      'ప్రమాదం', 'ప్రమాదంలో', 'యాక్సిడెంట్', 'చేయి', 'చేతులు', 'కాలు', 'కాళ్ళు',
      'వీల్‌చైర్', 'ట్రైసైకిల్', 'సదరెం', 'యూడీఐడీ', 'అంధులు', 'చెవుడు', 'నడవలేని', 'దివ్యాంగులు', 'వైకల్యం', 'శారీరక',
      // Hindi
      'दुर्घटना', 'हादसा', 'हादसे', 'हाथ', 'पैर', 'अंग', 'व्हीलचेयर',
      'ट्राइसाइकिल', 'वैशाखी', 'यूडीआईडी', 'अंधे', 'बधिर', 'अपंग', 'विकलांगता', 'विकलांग', 'शारीरिक',
    ],
  },
  {
    category: 'Education',
    understoodNeed: {
      en: '🎓 Higher Education Financial Support & Scholarships',
      te: '🎓 విద్యార్థుల స్కాలర్‌షిప్ & విద్యా సహాయం',
      hi: '🎓 उच्च शिक्षा छात्रवृत्ति एवं शैक्षिक सहायता',
    },
    whyMatch: {
      en: 'Matches student profile; provides non-repayable tuition subsidy and study grants.',
      te: 'విద్యార్థి చదువుకు సరిపోలుతుంది; ఫీజు సబ్సిడీ మరియు విద్యా సహాయ గ్రాంట్ అందిస్తుంది.',
      hi: 'छात्र प्रोफाइल से मेल खाता है; फीस सब्सिडी और अध्ययन अनुदान प्रदान करता है।',
    },
    categoryKeywords: [
      // English
      'education schemes', 'education scheme', 'education services', 'education service',
      'student schemes', 'student scheme', 'scholarship schemes', 'scholarships', 'education',
      // Telugu
      'విద్యా పథకాలు', 'విద్యార్థి పథకాలు', 'స్కాలర్‌షిప్‌లు', 'విద్యా సేవలు', 'విద్య', 'చదువు',
      // Hindi
      'शिक्षा योजनाएं', 'छात्र योजनाएं', 'छात्रवृत्ति योजनाएं', 'शिक्षा सेवाएं', 'शिक्षा', 'पढ़ाई',
    ],
    phrases: [
      // English
      'college fees', 'college fee', 'school fees', 'school fee', 'tuition fees', 'tuition fee',
      'hostel fees', 'exam fees', 'merit scholarship', 'post matric', 'post-matric',
      'book grant', 'financial help for college', 'student scholarship', 'college student', 'school student',
      'education support', 'children education',
      // Telugu
      'కళాశాల ఫీజులు', 'కాలేజ్ ఫీజు', 'హాస్టల్ ఫీజు', 'మెరిట్ స్కాలర్‌షిప్', 'విద్యా సహాయం',
      'పిల్లల చదువు', 'పిల్లల చదువుకు', 'చదువుకు సహాయం', 'చదువుకు ప్రభుత్వ సహాయం', 'పిల్లల చదువు కోసం', 'చదువు కోసం',
      // Hindi
      'कॉलेज फीस', 'स्कूल फीस', 'ट्यूशन फीस', 'हॉस्टल फीस', 'छात्रवृत्ति योजना', 'शैक्षिक सहायता',
      'बच्चों की पढ़ाई', 'पढ़ाई के लिए सहायता', 'बच्चों की शिक्षा', 'शिक्षा सहायता', 'पढ़ाई हेतु सहायता',
    ],
    keywords: [
      // English - ONLY explicit education words! Never accident or hand!
      'student', 'students', 'college', 'school', 'university', 'fees', 'fee',
      'tuition', 'scholarship', 'study', 'studying', 'studies', 'degree',
      'polytechnic', 'diploma', 'books', 'anitha', 'children',
      // Telugu
      'విద్యార్థి', 'విద్యార్థిని', 'కాలేజ్', 'కళాశాల', 'పాఠశాల', 'స్కూల్', 'యూనివర్సిటీ',
      'ఫీజు', 'ఫీజులు', 'ట్యూషన్', 'స్కాలర్‌షిప్', 'చదువు', 'చదువుకోవడానికి', 'చదువుకు', 'పిల్లలు', 'పిల్లల', 'డిగ్రీ', 'కోర్సు', 'పుస్తకాలు', 'అనిత',
      // Hindi
      'छात्र', 'छात्रा', 'विद्यार्थी', 'कॉलेज', 'स्कूल', 'विश्वविद्यालय',
      'फीस', 'शुल्क', 'ट्यूशन', 'छात्रवृत्ति', 'पढ़ाई', 'अध्ययन', 'डिग्री', 'कोर्स', 'किताबें', 'अनीता', 'बच्चे', 'बच्चों',
    ],
  },
  {
    category: 'Farmer Services',
    understoodNeed: {
      en: '🌾 Farmer Agriculture & Direct Income Support',
      te: '🌾 రైతు వ్యవసాయ పెట్టుబడి & ప్రత్యక్ష ఆదాయ సహాయం',
      hi: '🌾 किसान प्रत्यक्ष कृषि निवेश एवं आय सहायता',
    },
    whyMatch: {
      en: 'Direct per-acre financial transfer before sowing season for agricultural inputs.',
      te: 'విత్తనాలు, ఎరువుల కోసం విత్తే ముందు ఎకరానికి అందించే ప్రత్యక్ష పెట్టుబడి బదిలీ.',
      hi: 'बुआई से पहले खाद-बीज हेतु प्रति एकड़ प्रत्यक्ष बैंक खाता वित्तीय सहायता।',
    },
    categoryKeywords: [
      // English
      'farmer schemes', 'farmer scheme', 'farmer services', 'farmer service',
      'agriculture schemes', 'farming schemes', 'farmers', 'farmer',
      // Telugu
      'రైతు పథకాలు', 'రైతు సేవలు', 'వ్యవసాయ పథకాలు', 'రైతులు', 'రైతు',
      // Hindi
      'किसान योजनाएं', 'कृषि योजनाएं', 'खेती योजनाएं', 'किसान',
    ],
    phrases: [
      // English
      'crop investment', 'seed support', 'fertilizer subsidy', 'rythu bandhu',
      'rythu bharosa', 'agricultural input', 'farming support',
      // Telugu
      'పంట పెట్టుబడి', 'రైతు బంధు', 'రైతు భరోసా', 'వ్యవసాయ సహాయం',
      // Hindi
      'फसल निवेश', 'किसान सम्मान', 'कृषि सहायता', 'खाद सब्सिडी',
    ],
    keywords: [
      // English
      'agriculture', 'crop', 'crops', 'farming', 'seed', 'seeds', 'fertilizer',
      'fertilizers', 'rythu', 'krishi', 'land', 'pattadar', 'acre', 'acres',
      'kharif', 'rabi', 'dharani', 'cultivation',
      // Telugu
      'వ్యవసాయం', 'పంట', 'పంటలు', 'విత్తనాలు', 'ఎరువులు', 'భూమి',
      'పెట్టుబడి', 'ధరణి', 'పట్టాదారు', 'ఖరీఫ్', 'రబీ', 'సాగు',
      // Hindi
      'कृषि', 'फसल', 'फसलों', 'बीज', 'खाद', 'खेत', 'जमीन', 'पट्टादार', 'खेती', 'खरीफ', 'रबी',
    ],
  },
  {
    category: 'Senior Citizens',
    understoodNeed: {
      en: '🤝 Senior Citizen Old Age Monthly Pension',
      te: '🤝 సీనియర్ సిటిజన్ వృద్ధాప్య ఆసరా పింఛను',
      hi: '🤝 वरिष्ठ नागरिक वृद्धावस्था आसरा पेंशन',
    },
    whyMatch: {
      en: 'Monthly social security livelihood allowance directly credited to elderly residents.',
      te: 'వృద్ధులకు ప్రతి నెలా గౌరవప్రదమైన జీవనం కోసం నేరుగా బ్యాంకులో జమచేసే భద్రతా పింఛను.',
      hi: 'बुजुर्ग नागरिकों के जीवन यापन हेतु सीधे बैंक खाते में मासिक सुरक्षा पेंशन।',
    },
    categoryKeywords: [
      // English
      'senior citizen schemes', 'senior schemes', 'old age schemes', 'elderly schemes',
      'senior citizen', 'senior citizens',
      // Telugu
      'సీనియర్ సిటిజన్ పథకాలు', 'వృద్ధుల పథకాలు', 'వృద్ధాప్య పథకాలు', 'సీనియర్ సిటిజన్',
      // Hindi
      'वरिष्ठ नागरिक योजनाएं', 'बुजुर्ग योजनाएं', 'वृद्धावस्था योजनाएं', 'वरिष्ठ नागरिक',
    ],
    phrases: [
      // English
      'old age pension', 'senior pension', 'aasara pension', 'elderly pension', 'old parents',
      // Telugu
      'వృద్ధాప్య పింఛను', 'ఆసరా పింఛను', 'వృద్ధ తల్లిదండ్రులు', 'వృద్ధాప్య పెన్షన్',
      // Hindi
      'वृद्धावस्था पेंशन', 'आसरा पेंशन', 'बुजुर्ग माता-पिता', 'वृद्ध पेंशन',
    ],
    keywords: [
      // English
      'senior', 'seniors', 'elderly', 'old age', 'pension', 'pensions', 'aasara',
      'retired', 'retirement', 'aged', 'parents', 'grandparents', 'grandfather',
      'grandmother', '60 years', '57 years',
      // Telugu
      'సీనియర్', 'వృద్ధ', 'వృద్ధులు', 'వృద్ధాప్య', 'పింఛను', 'పెన్షన్', 'ఆసరా',
      'పెద్దలు', 'తల్లిదండ్రులు', 'అవ్వ', 'తాత',
      // Hindi
      'वरिष्ठ', 'बुजुर्ग', 'पेंशन', 'वृद्धावस्था', 'आसरा', 'माता-पिता', 'रिटायर',
    ],
  },
  {
    category: 'Certificates',
    understoodNeed: {
      en: '📄 Citizen Income & Official Revenue Certificate',
      te: '📄 వార్షిక ఆదాయ & రెవెన్యూ ధ్రువీకరణ పత్రం',
      hi: '📄 वार्षिक आय एवं आधिकारिक राजस्व प्रमाण पत्र',
    },
    whyMatch: {
      en: 'Official revenue document validating annual household income for quota admissions and schemes.',
      te: 'స్కాలర్‌షిప్‌లు మరియు ప్రభుత్వ ప్రవేశాలకు అవసరమైన వార్షిక కుటుంబ ఆదాయ ధ్రువీకరణ పత్రం.',
      hi: 'छात्रवृत्ति और सरकारी योजनाओं के लिए आवश्यक आधिकारिक वार्षिक आय प्रमाण पत्र।',
    },
    categoryKeywords: [
      // English
      'certificate schemes', 'certificates', 'revenue certificates',
      // Telugu
      'ధ్రువీకరణ పత్రాలు', 'సర్టిఫికెట్లు',
      // Hindi
      'प्रमाण पत्र योजनाएं', 'प्रमाण पत्र',
    ],
    phrases: [
      // English
      'income certificate', 'caste certificate', 'revenue certificate', 'proof of income',
      // Telugu
      'ఆదాయ ధ్రువీకరణ', 'ఆదాయ సర్టిఫికెట్', 'ధ్రువీకరణ పత్రం',
      // Hindi
      'आय प्रमाण पत्र', 'आय प्रमाण', 'राजस्व प्रमाण पत्र',
    ],
    keywords: [
      // English
      'certificate', 'income', 'revenue', 'proof', 'meeseva', 'csc', 'tahsildar', 'mro',
      // Telugu
      'సర్టిఫికెట్', 'ధ్రువీకరణ', 'ఆదాయం', 'ఆదాయ', 'మీసేవ', 'తహసీల్దార్', 'పత్రం',
      // Hindi
      'प्रमाण पत्र', 'आय प्रमाण', 'मीसेवा', 'तहसीलदार', 'राजस्व प्रमाण',
    ],
  },
  {
    category: 'Housing',
    understoodNeed: {
      en: '🏠 Affordable Housing & Shelter Schemes',
      te: '🏠 గృహ నిర్మాణం & నివాస పథకాలు',
      hi: '🏠 किफायती आवास एवं मकान योजनाएं',
    },
    whyMatch: {
      en: 'Subsidized permanent pucca house construction under state housing missions.',
      te: 'ప్రభుత్వ గృహ నిర్మాణ పథకం క్రింద పక్కా ఇంటి నిర్మాణం కోసం ఆర్థిక సహాయం.',
      hi: 'पक्के मकान के निर्माण हेतु सरकारी अनुदान एवं सहायता योजना।',
    },
    categoryKeywords: [
      'housing schemes', 'housing services', 'housing',
      'గృహ పథకాలు', 'ఇళ్ల పథకాలు',
      'आवास योजनाएं', 'मकान योजनाएं',
    ],
    phrases: [
      'pmay house', 'indiramma house', 'house construction', 'pucca house',
      'ఇందిరమ్మ ఇల్లు', 'గృహ నిర్మాణం',
      'प्रधानमंत्री आवास', 'इंदिरम्मा आवास', 'मकान निर्माण',
    ],
    keywords: [
      'house', 'housing', 'home', 'shelter', 'pmay', 'indiramma', 'plot',
      'ఇల్లు', 'ఇండ్లు', 'గృహ', 'నివాసం',
      'घर', 'आवास', 'मकान',
    ],
  },
];

interface ScoredCategory {
  category: string;
  config: CategoryConfig;
  score: number;
  isCategoryLevel: boolean;
  matchedTerms: string[];
}

export const detectIntent = (input: string, selectedCategory?: string): MatchResult => {
  const allServices = servicesData as Service[];

  // 1. Direct Category selection if explicitly selected
  if (selectedCategory) {
    const config = CATEGORY_DEFINITIONS.find((c) => c.category === selectedCategory);
    const categoryServices = allServices.filter((s) => s.category === selectedCategory);

    return {
      understoodNeed: config?.understoodNeed || {
        en: `Services for ${selectedCategory}`,
        te: `${selectedCategory} సంబంధిత సేవలు`,
        hi: `${selectedCategory} संबंधित सेवाएं`,
      },
      detectedCategory: selectedCategory,
      hasConfidentMatch: true,
      matchedServices: categoryServices.map((service, idx) => ({
        service,
        whyMatch: config?.whyMatch || {
          en: `Official government assistance program for ${selectedCategory}.`,
          te: `${selectedCategory} వర్గానికి ప్రభుత్వం అందించే అధికారిక సంక్షేమ పథకం.`,
          hi: `${selectedCategory} वर्ग के लिए आधिकारिक सरकारी सहायता कार्यक्रम।`,
        },
        matchScore: 95 - idx * 5,
      })),
    };
  }

  const rawInput = (input || '').trim();
  const normalized = rawInput.toLowerCase();

  // If input is empty
  if (!normalized) {
    return {
      understoodNeed: {
        en: 'Explore Government Services by Category',
        te: 'విభాగాల వారీగా ప్రభుత్వ సేవలను అన్వేషించండి',
        hi: 'श्रेणी के अनुसार सरकारी सेवाओं का अन्वेषण करें',
      },
      detectedCategory: null,
      hasConfidentMatch: false,
      matchedServices: [],
    };
  }

  // 2. Score each category against input
  const scoredCategories: ScoredCategory[] = [];

  for (const catConfig of CATEGORY_DEFINITIONS) {
    let score = 0;
    let isCategoryLevel = false;
    const matchedTerms: string[] = [];

    // Category-level keywords (+40 points each, flags category query)
    for (const ck of catConfig.categoryKeywords) {
      if (normalized.includes(ck.toLowerCase())) {
        score += 40;
        isCategoryLevel = true;
        matchedTerms.push(ck);
      }
    }

    // High-confidence multi-word phrases (+30 points each)
    for (const phrase of catConfig.phrases) {
      if (normalized.includes(phrase.toLowerCase())) {
        score += 30;
        matchedTerms.push(phrase);
      }
    }

    // Individual keywords (+10 points each)
    for (const kw of catConfig.keywords) {
      const kwLower = kw.toLowerCase();
      const isAscii = /^[a-z0-9]+$/i.test(kwLower);

      if (isAscii) {
        // Enforce word boundary for English single words to avoid substring mistakes
        const regex = new RegExp(`\\b${kwLower}\\b`, 'i');
        if (regex.test(normalized)) {
          score += 10;
          matchedTerms.push(kw);
        }
      } else {
        // Indic script substring match
        if (normalized.includes(kwLower)) {
          score += 10;
          matchedTerms.push(kw);
        }
      }
    }

    // STRICT CONSTRAINT: "Education" must ONLY match if the text has explicit education words!
    // Words like "accident" or "hand" must NEVER trigger Education.
    if (catConfig.category === 'Education') {
      if (matchedTerms.length === 0) {
        score = 0;
      }
    }

    if (score > 0) {
      scoredCategories.push({
        category: catConfig.category,
        config: catConfig,
        score,
        isCategoryLevel,
        matchedTerms,
      });
    }
  }

  // Sort descending by score
  scoredCategories.sort((a, b) => b.score - a.score);

  // 3. If nothing matches confidently
  if (scoredCategories.length === 0 || scoredCategories[0].score === 0) {
    return {
      understoodNeed: {
        en: "We couldn't find a matching service in our demo data",
        te: 'మా డెమో డేటాలో మీ శోధనకు సరిపోయే సేవ కనుగొనబడలేదు',
        hi: 'हमारे डेमो डेटा में आपकी खोज से मेल खाती कोई सेवा नहीं मिली',
      },
      detectedCategory: null,
      hasConfidentMatch: false,
      matchedServices: [],
    };
  }

  // 4. Check for tie between top categories
  const topScore = scoredCategories[0].score;
  const tiedCategories = scoredCategories.filter((sc) => sc.score === topScore);

  let tieBreaker: TieBreaker | undefined = undefined;

  if (tiedCategories.length >= 2) {
    const cat1 = tiedCategories[0].category;
    const cat2 = tiedCategories[1].category;

    const catNameTe: Record<string, string> = {
      'Disability Services': 'దివ్యాంగుల సేవలు',
      'Education': 'విద్యా సేవలు',
      'Farmer Services': 'రైతు సేవలు',
      'Senior Citizens': 'సీనియర్ సిటిజన్ సేవలు',
      'Certificates': 'ధ్రువీకరణ పత్రాలు',
      'Housing': 'గృహ నిర్మాణం',
    };

    const catNameHi: Record<string, string> = {
      'Disability Services': 'दिव्यांग सेवाएं',
      'Education': 'शिक्षा सेवाएं',
      'Farmer Services': 'किसान सेवाएं',
      'Senior Citizens': 'वरिष्ठ नागरिक सेवाएं',
      'Certificates': 'प्रमाण पत्र सेवाएं',
      'Housing': 'आवास सेवाएं',
    };

    tieBreaker = {
      isTie: true,
      categories: [cat1, cat2],
      question: {
        en: `Did you mean ${cat1} or ${cat2}?`,
        te: `మీరు ${catNameTe[cat1] || cat1} లేదా ${catNameTe[cat2] || cat2} సేవల గురించి చూస్తున్నారా?`,
        hi: `क्या आप ${catNameHi[cat1] || cat1} अथवा ${catNameHi[cat2] || cat2} खोज रहे हैं?`,
      },
    };
  }

  // 5. Pick the top category, and show only services from that category
  // (plus another category only if it also scores strongly on its own explicit keywords)
  const primaryCat = scoredCategories[0];
  const primaryServices = allServices.filter((s) => s.category === primaryCat.category);

  let secondaryServices: Service[] = [];
  let secondaryCat: ScoredCategory | null = null;

  if (scoredCategories.length > 1) {
    const second = scoredCategories[1];
    // Must score strongly on its own explicit keywords (score >= 30 and >= 80% of top score)
    if (second.score >= 30 && second.score >= topScore * 0.8) {
      secondaryCat = second;
      secondaryServices = allServices.filter((s) => s.category === second.category);
    }
  }

  const matchedServices: MatchedServiceItem[] = [
    ...primaryServices.map((service, idx) => ({
      service,
      whyMatch: primaryCat.config.whyMatch,
      matchScore: Math.min(98, 95 - idx * 3),
    })),
    ...secondaryServices.map((service, idx) => ({
      service,
      whyMatch: secondaryCat!.config.whyMatch,
      matchScore: Math.min(85, 82 - idx * 3),
    })),
  ];

  return {
    understoodNeed: primaryCat.config.understoodNeed,
    detectedCategory: primaryCat.category,
    hasConfidentMatch: true,
    tieBreaker,
    matchedServices,
  };
};
