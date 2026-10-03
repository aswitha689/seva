/**
 * NOTE: This is MOCK authentication for demonstration purposes (stored in localStorage).
 * Real production authentication will use Supabase Auth with secure JWT tokens,
 * HTTP-only cookies, and PostgreSQL Row-Level Security (RLS).
 * Passwords here are for demo testing only; never store plaintext passwords in production!
 */

export type UserRole = 'citizen' | 'admin';

export interface User {
  id: string;
  name: string;
  emailOrPhone: string;
  role: UserRole;
  preferredLanguage?: 'en' | 'te' | 'hi';
  isDemo?: boolean;
}

export interface DemoCitizenAccount {
  user: User;
  demoPassword: string;
  description: {
    en: string;
    te: string;
    hi: string;
  };
  sampleScheme: {
    en: string;
    te: string;
    hi: string;
  };
}

export interface DemoAdminAccount {
  user: User;
  demoPassword: string;
  designation: {
    en: string;
    te: string;
    hi: string;
  };
}

export const DEMO_ADMIN: DemoAdminAccount = {
  user: {
    id: 'admin-welfare-officer',
    name: 'Suresh Reddy',
    emailOrPhone: 'admin@sevasaarthi.gov.in',
    role: 'admin',
    preferredLanguage: 'en',
    isDemo: true,
  },
  demoPassword: 'admin123',
  designation: {
    en: 'District Welfare Review Officer',
    te: 'జిల్లా సంక్షేమ సమీక్ష అధికారి',
    hi: 'जिला कल्याण समीक्षा अधिकारी',
  },
};

export const DEMO_CITIZENS: DemoCitizenAccount[] = [
  {
    user: {
      id: 'citizen-anitha',
      name: 'Anitha K',
      emailOrPhone: '9876543210',
      role: 'citizen',
      preferredLanguage: 'te',
      isDemo: true,
    },
    demoPassword: 'citizen123',
    description: {
      en: '20 yrs, B.Sc Student, Warangal',
      te: '20 సం., బి.ఎస్సీ విద్యార్థిని, వరంగల్',
      hi: '20 वर्ष, बी.एससी छात्रा, वारंगल',
    },
    sampleScheme: {
      en: 'Post-Matric Student Scholarship',
      te: 'పోస్ట్-మెట్రిక్ విద్యార్థి స్కాలర్‌షిప్',
      hi: 'पोस्ट-मैट्रिक छात्रवृत्ति योजना',
    },
  },
  {
    user: {
      id: 'citizen-rameshwar',
      name: 'Rameshwar Rao M',
      emailOrPhone: '9440112233',
      role: 'citizen',
      preferredLanguage: 'te',
      isDemo: true,
    },
    demoPassword: 'citizen123',
    description: {
      en: '48 yrs, Farmer, Nalgonda',
      te: '48 సం., రైతు, నల్గొండ',
      hi: '48 वर्ष, किसान, नलगोंडा',
    },
    sampleScheme: {
      en: 'Rythu / Krishi Crop Support',
      te: 'రైతు / కృషి పంట పెట్టుబడి సహాయం',
      hi: 'किसान प्रत्यक्ष कृषि निवेश सहायता',
    },
  },
  {
    user: {
      id: 'citizen-laxmi',
      name: 'Laxmi Bai P',
      emailOrPhone: '9885234567',
      role: 'citizen',
      preferredLanguage: 'te',
      isDemo: true,
    },
    demoPassword: 'citizen123',
    description: {
      en: '62 yrs, Senior Citizen, Karimnagar',
      te: '62 సం., సీనియర్ సిటిజన్, కరీంనగర్',
      hi: '62 वर्ष, वरिष्ठ नागरिक, करीमनगर',
    },
    sampleScheme: {
      en: 'Senior Citizen Social Security Pension',
      te: 'సీనియర్ సిటిజన్ ఆసరా / వృద్ధాప్య పింఛను',
      hi: 'वरिष्ठ नागरिक सामाजिक सुरक्षा पेंशन',
    },
  },
  {
    user: {
      id: 'citizen-suresh',
      name: 'Suresh Kumar B',
      emailOrPhone: '9989012345',
      role: 'citizen',
      preferredLanguage: 'en',
      isDemo: true,
    },
    demoPassword: 'citizen123',
    description: {
      en: '26 yrs, Private Employee, Hyderabad',
      te: '26 సం., ప్రైవేట్ ఉద్యోగి, హైదరాబాద్',
      hi: '26 वर्ष, निजी कर्मचारी, हैदराबाद',
    },
    sampleScheme: {
      en: 'Annual Income Certificate Issuance',
      te: 'వార్షిక ఆదాయ ధ్రువీకరణ పత్రం',
      hi: 'वार्षिक आय प्रमाण पत्र जारी करना',
    },
  },
];
