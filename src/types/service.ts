export interface EligibilityCriteria {
  minAge?: number;
  maxAge?: number;
  occupations?: string[];
  maxAnnualIncome?: number;
  targetGroups?: string[];
  states?: string[];
  summary: string;
  summary_te?: string;
  summary_hi?: string;
}

export interface ServiceDocument {
  id: string;
  name: string;
  name_te?: string;
  name_hi?: string;
  required: boolean;
  description: string;
  description_te?: string;
  description_hi?: string;
}

export interface ServiceFAQ {
  question: string;
  answer: string;
  question_te?: string;
  answer_te?: string;
  question_hi?: string;
  answer_hi?: string;
}

export interface Service {
  id: string;
  name: string;
  name_te: string;
  name_hi: string;
  category: 'Education' | 'Housing' | 'Financial Assistance' | 'Senior Citizens' | 'Disability Services' | 'Farmer Services' | 'Certificates';
  category_te?: string;
  category_hi?: string;
  description: string;
  description_te: string;
  description_hi: string;
  state_region: string;
  department: string;
  department_te?: string;
  department_hi?: string;
  eligibility: EligibilityCriteria;
  documents: ServiceDocument[];
  application_steps: string[];
  application_steps_te?: string[];
  application_steps_hi?: string[];
  processing_information: {
    timelineDays: number;
    fee: string;
    fee_te?: string;
    fee_hi?: string;
    authority: string;
    authority_te?: string;
    authority_hi?: string;
    deliveryMode: string;
    deliveryMode_te?: string;
    deliveryMode_hi?: string;
  };
  official_source: string;
  faq: ServiceFAQ[];
  is_demo: boolean;
  demo_disclaimer: string;
  demo_disclaimer_te?: string;
  demo_disclaimer_hi?: string;
}

/**
 * Returns a fully localized representation of a service based on current language.
 */
export function getLocalizedService(service: Service, lang: 'en' | 'te' | 'hi') {
  return {
    ...service,
    name: lang === 'te' ? service.name_te || service.name : lang === 'hi' ? service.name_hi || service.name : service.name,
    categoryName: lang === 'te' ? service.category_te || service.category : lang === 'hi' ? service.category_hi || service.category : service.category,
    description: lang === 'te' ? service.description_te || service.description : lang === 'hi' ? service.description_hi || service.description : service.description,
    department: lang === 'te' ? service.department_te || service.department : lang === 'hi' ? service.department_hi || service.department : service.department,
    eligibilitySummary: lang === 'te' ? service.eligibility.summary_te || service.eligibility.summary : lang === 'hi' ? service.eligibility.summary_hi || service.eligibility.summary : service.eligibility.summary,
    steps: lang === 'te' ? service.application_steps_te || service.application_steps : lang === 'hi' ? service.application_steps_hi || service.application_steps : service.application_steps,
    fee: lang === 'te' ? service.processing_information.fee_te || service.processing_information.fee : lang === 'hi' ? service.processing_information.fee_hi || service.processing_information.fee : service.processing_information.fee,
    authority: lang === 'te' ? service.processing_information.authority_te || service.processing_information.authority : lang === 'hi' ? service.processing_information.authority_hi || service.processing_information.authority : service.processing_information.authority,
    deliveryMode: lang === 'te' ? service.processing_information.deliveryMode_te || service.processing_information.deliveryMode : lang === 'hi' ? service.processing_information.deliveryMode_hi || service.processing_information.deliveryMode : service.processing_information.deliveryMode,
    documents: service.documents.map((d) => ({
      ...d,
      name: lang === 'te' ? d.name_te || d.name : lang === 'hi' ? d.name_hi || d.name : d.name,
      description: lang === 'te' ? d.description_te || d.description : lang === 'hi' ? d.description_hi || d.description : d.description,
    })),
    faq: service.faq.map((f) => ({
      question: lang === 'te' ? f.question_te || f.question : lang === 'hi' ? f.question_hi || f.question : f.question,
      answer: lang === 'te' ? f.answer_te || f.answer : lang === 'hi' ? f.answer_hi || f.answer : f.answer,
    })),
    demoDisclaimer: lang === 'te' ? service.demo_disclaimer_te || service.demo_disclaimer : lang === 'hi' ? service.demo_disclaimer_hi || service.demo_disclaimer : service.demo_disclaimer,
  };
}
