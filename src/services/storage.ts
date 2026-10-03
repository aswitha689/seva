import { Application, ApplicationStage, TimelineEvent } from '../types/application';

const APPLICATIONS_KEY = 'sevasaarthi_applications';

export const buildDefaultTimeline = (submittedTime: string): TimelineEvent[] => {
  return [
    {
      stage: 'submitted',
      stageName: 'Application Submitted',
      stageName_te: 'దరఖాస్తు సమర్పించబడింది',
      stageName_hi: 'आवेदन जमा किया गया',
      status: 'completed',
      timestamp: submittedTime,
      description: 'Your application has been received and registered digitally.',
      description_te: 'మీ దరఖాస్తు స్వీకరించబడింది మరియు డిజిటల్‌గా నమోదు చేయబడింది.',
      description_hi: 'आपका आवेदन प्राप्त कर लिया गया है और डिजिटल रूप से पंजीकृत हो गया है.',
    },
    {
      stage: 'documents_received',
      stageName: 'Documents Received & Scrutiny',
      stageName_te: 'పత్రాలు స్వీకరించబడ్డాయి & పరిశీలన',
      stageName_hi: 'दस्तावेज प्राप्त और जांच',
      status: 'current',
      timestamp: 'In Progress (Expected within 48h)',
      description: 'Verification of uploaded identity, income, and student documents.',
      description_te: 'అప్‌లోడ్ చేసిన గుర్తింపు, ఆదాయం మరియు విద్యార్థి పత్రాల ప్రాథమిక పరిశీలన.',
      description_hi: 'अपलोड किए गए पहचान, आय और छात्र दस्तावेजों का प्राथमिक सत्यापन।',
    },
    {
      stage: 'department_review',
      stageName: 'Department Officer Review',
      stageName_te: 'విభాగపు అధికారి సమీక్ష',
      stageName_hi: 'विभागीय अधिकारी समीक्षा',
      status: 'pending',
      timestamp: 'Pending desk clearance',
      description: 'Review by Mandal/District Welfare Officer for final quota eligibility.',
      description_te: 'తుది కోటా అర్హత కోసం సంక్షేమ అధికారి పరిశీలన.',
      description_hi: 'अंतिम पात्रता के लिए कल्याण अधिकारी द्वारा समीक्षा।',
    },
    {
      stage: 'decision',
      stageName: 'Sanction & Decision Order',
      stageName_te: 'మంజూరు & నిర్ణయం ఉత్తర్వు',
      stageName_hi: 'मंजूरी और निर्णय आदेश',
      status: 'pending',
      timestamp: 'Pending review completion',
      description: 'Sanction order generation and approval notification.',
      description_te: 'మంజూరు ఉత్తర్వు జారీ మరియు ఆమోద నోటిఫికేషన్.',
      description_hi: 'मंजूरी आदेश जारी होना और स्वीकृति सूचना।',
    },
    {
      stage: 'completed',
      stageName: 'Benefit Disbursed / Completed',
      stageName_te: 'ప్రయోజనం అందించబడింది / పూర్తయింది',
      stageName_hi: 'लाभ वितरित / पूर्ण',
      status: 'pending',
      timestamp: 'Target DBT disbursal date',
      description: 'Direct Benefit Transfer (DBT) credited to bank account or certificate ready for download.',
      description_te: 'బ్యాంక్ ఖాతాలో డీబీటీ నగదు జమ లేదా సర్టిఫికెట్ డౌన్‌లోడ్ సిద్ధం.',
      description_hi: 'बैंक खाते में डीबीटी राशि जमा अथवा प्रमाण पत्र डाउनलोड हेतु तैयार।',
    },
  ];
};

const SEED_APPLICATIONS: Application[] = [
  {
    id: 'SV-2026-001247',
    userId: 'citizen-anitha',
    serviceId: 'post-matric-scholarship',
    serviceName: 'Post-Matric Student Merit Scholarship',
    serviceName_te: 'పోస్ట్-మెట్రిక్ విద్యార్థి మెరిట్ స్కాలర్‌షిప్',
    serviceName_hi: 'पोस्ट-मैट्रिक छात्र मेरिट छात्रवृत्ति',
    department: 'Department of Social Welfare & Higher Education',
    category: 'Education',
    citizenName: 'Anitha K',
    age: 20,
    gender: 'Female',
    phone: '9876543210',
    state: 'Telangana',
    district: 'Warangal',
    occupation: 'B.Sc Computer Science - 2nd Year',
    annualIncome: 180000,
    educationLevel: 'Undergraduate Degree',
    status: 'submitted',
    submittedAt: 'Today, 10:15 AM',
    currentStage: 'submitted',
    uploadedDocuments: [
      { docId: 'doc-college-id', docName: 'College Bonafide', fileName: 'anitha_bonafide.pdf', uploadedAt: '10:12 AM' },
      { docId: 'doc-income-cert', docName: 'Income Certificate', fileName: 'anitha_income_certificate.pdf', uploadedAt: '10:14 AM' },
      { docId: 'doc-marks-memo', docName: 'Intermediate Memo', fileName: 'anitha_marks_memo.pdf', uploadedAt: '10:14 AM' },
    ],
    timeline: buildDefaultTimeline('Today, 10:15 AM'),
    adminNotes: ['Application initiated via SevaSaarthi citizen journey.'],
  },
  {
    id: 'SV-2026-001189',
    userId: 'citizen-rameshwar',
    serviceId: 'farmer-assistance',
    serviceName: 'Rythu / Krishi Direct Income Support Scheme',
    serviceName_te: 'రైతు / కృషి ప్రత్యక్ష పెట్టుబడి సహాయ పథకం',
    serviceName_hi: 'किसान प्रत्यक्ष कृषि निवेश सहायता योजना',
    department: 'Department of Agriculture & Farmers Welfare',
    category: 'Farmer Services',
    citizenName: 'Rameshwar Rao M',
    age: 48,
    gender: 'Male',
    phone: '9440112233',
    state: 'Telangana',
    district: 'Nalgonda',
    occupation: 'Farmer (3.5 Acres)',
    annualIncome: 140000,
    status: 'department_review',
    submittedAt: 'Yesterday, 04:30 PM',
    currentStage: 'department_review',
    uploadedDocuments: [
      { docId: 'doc-pattadar-passbook', docName: 'Pattadar Passbook', fileName: 'rameshwar_passbook.pdf', uploadedAt: '04:25 PM' },
      { docId: 'doc-farmer-aadhar', docName: 'Farmer Aadhaar', fileName: 'rameshwar_aadhar.pdf', uploadedAt: '04:28 PM' },
    ],
    timeline: [
      {
        stage: 'submitted',
        stageName: 'Application Submitted',
        stageName_te: 'దరఖాస్తు సమర్పించబడింది',
        stageName_hi: 'आवेदन जमा किया गया',
        status: 'completed',
        timestamp: 'Yesterday, 04:30 PM',
        description: 'Received via MeeSeva/SevaSaarthi digital intake.',
        description_te: 'డిజిటల్‌గా స్వీకరించబడింది.',
        description_hi: 'डिजिटल रूप से प्राप्त हुआ।',
      },
      {
        stage: 'documents_received',
        stageName: 'Land Record Scrutiny',
        stageName_te: 'భూమి రికార్డుల పరిశీలన',
        stageName_hi: 'भूमि रिकॉर्ड जांच',
        status: 'completed',
        timestamp: 'Today, 09:00 AM',
        description: 'Pattadar passbook Khata verified via Dharani revenue portal.',
        description_te: 'ధరణి రికార్డులతో పట్టాదారు వివరాలు సరిపోలాయి.',
        description_hi: 'धरणी पोर्टल के माध्यम से पट्टादार विवरण सत्यापित।',
      },
      {
        stage: 'department_review',
        stageName: 'AEO Field Inspection',
        stageName_te: 'వ్యవసాయ అధికారి క్షేత్ర తనిఖీ',
        stageName_hi: 'कृषि अधिकारी क्षेत्र निरीक्षण',
        status: 'current',
        timestamp: 'In Progress',
        description: 'Agricultural Extension Officer verifying crop season acreage.',
        description_te: 'ఎకరాల సాగు విస్తీర్ణం క్షేత్ర తనిఖీ జరుగుతోంది.',
        description_hi: 'फसल रकबे का भौतिक सत्यापन जारी है।',
      },
      {
        stage: 'decision',
        stageName: 'Sanction Order',
        stageName_te: 'మంజూరు ఉత్తర్వు',
        stageName_hi: 'मंजूरी आदेश',
        status: 'pending',
        timestamp: 'Pending review',
        description: 'Sanction of ₹17,500 for 3.5 acres.',
        description_te: '3.5 ఎకరాలకు ₹17,500 మంజూరు.',
        description_hi: '3.5 एकड़ हेतु ₹17,500 की मंजूरी।',
      },
      {
        stage: 'completed',
        stageName: 'Bank Credit',
        stageName_te: 'బ్యాంక్ బదిలీ',
        stageName_hi: 'बैंक अंतरण',
        status: 'pending',
        timestamp: 'Scheduled',
        description: 'Electronic DBT credit to SBI account.',
        description_te: 'ఎస్బీఐ ఖాతాలో జమ.',
        description_hi: 'एसबीआई खाते में राशि जमा।',
      },
    ],
    adminNotes: ['Land titles cross-checked with Dharani database.'],
  },
  {
    id: 'SV-2026-000942',
    userId: 'citizen-laxmi',
    serviceId: 'senior-citizen-pension',
    serviceName: 'Senior Citizen Social Security Pension',
    serviceName_te: 'సీనియర్ సిటిజన్ ఆసరా / వృద్ధాప్య పింఛను',
    serviceName_hi: 'वरिष्ठ नागरिक सामाजिक सुरक्षा पेंशन',
    department: 'Panchayat Raj & Rural Development',
    category: 'Senior Citizens',
    citizenName: 'Laxmi Bai P',
    age: 62,
    gender: 'Female',
    phone: '9885234567',
    state: 'Telangana',
    district: 'Karimnagar',
    occupation: 'Homemaker / Elderly',
    annualIncome: 85000,
    status: 'decision',
    submittedAt: '3 days ago',
    currentStage: 'decision',
    uploadedDocuments: [
      { docId: 'doc-age-proof', docName: 'Age Proof (Aadhaar)', fileName: 'laxmibai_age.pdf', uploadedAt: '3 days ago' },
      { docId: 'doc-senior-passbook', docName: 'Bank Passbook', fileName: 'laxmibai_passbook.pdf', uploadedAt: '3 days ago' },
    ],
    timeline: [
      { stage: 'submitted', stageName: 'Application Submitted', stageName_te: 'సమర్పించబడింది', stageName_hi: 'जमा हुआ', status: 'completed', timestamp: '3 days ago', description: 'Application registered.', description_te: 'నమోదైంది.', description_hi: 'पंजीकृत।' },
      { stage: 'documents_received', stageName: 'Ward Verification', stageName_te: 'వార్డు పరిశీలన', stageName_hi: 'వార్డ్ जांच', status: 'completed', timestamp: '2 days ago', description: 'Age and non-pensioner household check cleared.', description_te: 'పరిశీలన పూర్తయింది.', description_hi: 'सत्यापन पूर्ण।' },
      { stage: 'department_review', stageName: 'MPDO Desk Approval', stageName_te: 'ఎంపీడీవో ఆమోదం', stageName_hi: 'एमपीडीओ स्वीकृति', status: 'completed', timestamp: 'Yesterday', description: 'Mandal officer recommended for pension roll.', description_te: 'సిఫార్సు చేయబడింది.', description_hi: 'अनुमोदित।' },
      { stage: 'decision', stageName: 'Sanction Order Generated', stageName_te: 'మంజూరు ఉత్తర్వు జారీ', stageName_hi: 'मंजूरी पत्र जारी', status: 'current', timestamp: 'Today, 11:00 AM', description: 'Pension ID TG-AAS-9982 generated. Ready for payment rollout.', description_te: 'పింఛను ఐడీ జారీ చేయబడింది.', description_hi: 'पेंशन आईडी जारी।' },
      { stage: 'completed', stageName: 'Monthly Disbursal', stageName_te: 'నెలవారీ జమ', stageName_hi: 'मासिक वितरण', status: 'pending', timestamp: '1st of next month', description: '₹2,016 monthly deposit.', description_te: 'నెలవారీ ₹2,016 జమ.', description_hi: 'मासिक ₹2,016 जमा।' },
    ],
    adminNotes: ['MPDO approved. Pension card printed.'],
  },
  {
    id: 'SV-2026-000831',
    userId: 'citizen-suresh',
    serviceId: 'income-certificate',
    serviceName: 'Citizen Annual Income Certificate Issuance',
    serviceName_te: 'వార్షిక ఆదాయ ధ్రువీకరణ పత్రం జారీ',
    serviceName_hi: 'वार्षिक आय प्रमाण पत्र जारी करना',
    department: 'Revenue Department & MeeSeva',
    category: 'Certificates',
    citizenName: 'Suresh Kumar B',
    age: 26,
    gender: 'Male',
    phone: '9989012345',
    state: 'Telangana',
    district: 'Hyderabad',
    occupation: 'Private Employee',
    annualIncome: 220000,
    status: 'completed',
    submittedAt: '5 days ago',
    currentStage: 'completed',
    uploadedDocuments: [
      { docId: 'doc-applicant-id', docName: 'Aadhaar Card', fileName: 'suresh_aadhaar.pdf', uploadedAt: '5 days ago' },
      { docId: 'doc-income-self-declaration', docName: 'Salary Slip', fileName: 'suresh_salary.pdf', uploadedAt: '5 days ago' },
    ],
    timeline: [
      { stage: 'submitted', stageName: 'Application Submitted', stageName_te: 'సమర్పించబడింది', stageName_hi: 'जमा हुआ', status: 'completed', timestamp: '5 days ago', description: 'Submitted via portal.', description_te: 'నమోదైంది.', description_hi: 'पंजीकृत।' },
      { stage: 'documents_received', stageName: 'VRO Verification', stageName_te: 'వీఆర్వో పరిశీలన', stageName_hi: 'वीआरओ जांच', status: 'completed', timestamp: '4 days ago', description: 'Village Revenue Officer local verification completed.', description_te: 'క్షేత్ర తనిఖీ పూర్తయింది.', description_hi: 'स्थानीय जांच पूर्ण।' },
      { stage: 'department_review', stageName: 'RI Report', stageName_te: 'ఆర్ఐ నివేదిక', stageName_hi: 'आरआई रिपोर्ट', status: 'completed', timestamp: '3 days ago', description: 'Revenue Inspector inquiry endorsed.', description_te: 'ఆమోదించబడింది.', description_hi: 'अनुमोदित।' },
      { stage: 'decision', stageName: 'Tahsildar Digital Sign', stageName_te: 'తహసీల్దార్ డిజిటల్ సంతకం', stageName_hi: 'तहसीलदार डिजिटल हस्ताक्षर', status: 'completed', timestamp: '2 days ago', description: 'Certificate signed with PKI digital signature.', description_te: 'డిజిటల్ సంతకం చేయబడింది.', description_hi: 'डिजिटल हस्ताक्षर पूर्ण।' },
      { stage: 'completed', stageName: 'Certificate Issued', stageName_te: 'సర్టిఫికెట్ జారీ పూర్తయింది', stageName_hi: 'प्रमाण पत्र जारी', status: 'completed', timestamp: 'Yesterday', description: 'Digitally signed certificate issued with QR Code validation.', description_te: 'డౌన్‌లోడ్ కోసం సిద్ధంగా ఉంది.', description_hi: 'डाउनलोड हेतु तैयार।' },
    ],
    adminNotes: ['Digitally signed by Tahsildar Hyderabad Central.'],
  },
];

export const getApplications = (): Application[] => {
  try {
    const raw = localStorage.getItem(APPLICATIONS_KEY);
    if (raw) {
      const parsed = JSON.parse(raw);
      if (Array.isArray(parsed) && parsed.length > 0) {
        // Ensure legacy stored applications get their userIds back if missing
        let hasChanges = false;
        const normalized = parsed.map((app: Application) => {
          if (!app.userId) {
            const seed = SEED_APPLICATIONS.find((s) => s.id === app.id);
            if (seed) {
              hasChanges = true;
              return { ...app, userId: seed.userId };
            }
          }
          return app;
        });
        if (hasChanges) {
          localStorage.setItem(APPLICATIONS_KEY, JSON.stringify(normalized));
        }
        return normalized;
      }
    }
  } catch (err) {
    console.error('Error reading applications from localStorage', err);
  }

  // Pre-seed with demo records so Admin and Analytics have rich demonstration data
  localStorage.setItem(APPLICATIONS_KEY, JSON.stringify(SEED_APPLICATIONS));
  return SEED_APPLICATIONS;
};

/**
 * Filter applications based on the active user identity.
 * - Admin: sees all applications across all citizens.
 * - Citizen: strictly sees applications linked to their account (by userId, phone, or name).
 */
export const getCitizenApplications = (
  user?: { id: string; role: string; emailOrPhone?: string; name?: string } | null
): Application[] => {
  const allApps = getApplications();
  if (!user) return [];

  if (user.role === 'admin') {
    return allApps;
  }

  const cleanPhone = user.emailOrPhone?.trim();
  const cleanName = user.name?.trim().toLowerCase();

  return allApps.filter((app) => {
    if (app.userId && app.userId === user.id) return true;
    if (cleanPhone && app.phone && app.phone.trim() === cleanPhone) return true;
    if (cleanName && app.citizenName && app.citizenName.trim().toLowerCase() === cleanName) return true;
    return false;
  });
};

export const getApplicationById = (
  id: string,
  user?: { id: string; role: string; emailOrPhone?: string; name?: string } | null
): Application | undefined => {
  const apps = user && user.role === 'citizen' ? getCitizenApplications(user) : getApplications();
  const searchId = id.trim().toUpperCase();
  return apps.find((a) => a.id.toUpperCase() === searchId);
};

export const saveApplication = (app: Application): void => {
  const apps = getApplications();
  const existingIdx = apps.findIndex((a) => a.id === app.id);
  if (existingIdx >= 0) {
    apps[existingIdx] = app;
  } else {
    apps.unshift(app);
  }
  localStorage.setItem(APPLICATIONS_KEY, JSON.stringify(apps));
};

export const updateApplicationStatus = (
  id: string,
  newStage: ApplicationStage,
  note?: string
): Application | null => {
  const apps = getApplications();
  const target = apps.find((a) => a.id === id);
  if (!target) return null;

  target.status = newStage;
  target.currentStage = newStage;

  const stageOrder: ApplicationStage[] = [
    'submitted',
    'documents_received',
    'department_review',
    'decision',
    'completed',
  ];
  const targetIdx = stageOrder.indexOf(newStage);

  const nowStr = new Date().toLocaleString('en-IN', {
    dateStyle: 'medium',
    timeStyle: 'short',
  });

  target.timeline = target.timeline.map((item, idx) => {
    if (idx < targetIdx) {
      return { ...item, status: 'completed' };
    } else if (idx === targetIdx) {
      return {
        ...item,
        status: 'current',
        timestamp: `${nowStr} (Updated)`,
        notes: note || item.notes,
      };
    } else {
      return { ...item, status: 'pending' };
    }
  });

  if (note) {
    target.adminNotes = target.adminNotes ? [...target.adminNotes, note] : [note];
    target.citizenNotification = `Status updated to ${newStage.replace('_', ' ').toUpperCase()}: ${note}`;
    const stageLabelsTe: Record<ApplicationStage, string> = {
      submitted: 'సమర్పించబడింది',
      documents_received: 'పత్రాలు స్వీకరించబడ్డాయి',
      department_review: 'విభాగ పరిశీలన',
      decision: 'మంజూరు నిర్ణయం',
      completed: 'పూర్తయింది',
    };
    const stageLabelsHi: Record<ApplicationStage, string> = {
      submitted: 'जमा किया गया',
      documents_received: 'दस्तावेज प्राप्त हुए',
      department_review: 'विभागीय समीक्षा',
      decision: 'स्वीकृति निर्णय',
      completed: 'पूर्ण हुआ',
    };
    target.citizenNotification_te = `దరఖాస్తు స్థితి నవీకరించబడింది (${stageLabelsTe[newStage] || newStage}): ${note}`;
    target.citizenNotification_hi = `आवेदन स्थिति अपडेट की गई (${stageLabelsHi[newStage] || newStage}): ${note}`;
  }

  saveApplication(target);
  return target;
};

export const sendCitizenNotification = (id: string, message: string): Application | null => {
  const apps = getApplications();
  const target = apps.find((a) => a.id === id);
  if (!target) return null;

  target.citizenNotification = message;
  target.adminNotes = target.adminNotes ? [...target.adminNotes, message] : [message];
  saveApplication(target);
  return target;
};

export const generateApplicationId = (): string => {
  const num = Math.floor(100000 + Math.random() * 900000);
  return `SV-2026-${num}`;
};
