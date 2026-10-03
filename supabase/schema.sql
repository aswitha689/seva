-- ============================================================================
-- SevaSaarthi Database Schema (Supabase PostgreSQL)
-- Tables: users, services, applications, documents, notifications, faqs
-- Label: All seeded records are simulated demonstration data
-- ============================================================================

-- 1. USERS TABLE
CREATE TABLE IF NOT EXISTS users (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    phone TEXT UNIQUE NOT NULL,
    name TEXT NOT NULL,
    age INTEGER,
    gender TEXT,
    state TEXT DEFAULT 'Telangana',
    district TEXT,
    language TEXT DEFAULT 'en' CHECK (language IN ('en', 'te', 'hi')),
    created_at TIMESTAMPTZ DEFAULT now()
);

-- 2. SERVICES TABLE
CREATE TABLE IF NOT EXISTS services (
    id TEXT PRIMARY KEY,
    name TEXT NOT NULL,
    name_te TEXT,
    name_hi TEXT,
    category TEXT NOT NULL,
    description TEXT NOT NULL,
    description_te TEXT,
    description_hi TEXT,
    department TEXT NOT NULL,
    state_region TEXT NOT NULL,
    eligibility JSONB NOT NULL,
    processing_information JSONB NOT NULL,
    official_source TEXT,
    is_demo BOOLEAN DEFAULT true,
    demo_disclaimer TEXT DEFAULT 'This is preliminary guidance. Final eligibility is determined by the concerned authority. (Demo data)',
    created_at TIMESTAMPTZ DEFAULT now()
);

-- 3. APPLICATIONS TABLE
CREATE TABLE IF NOT EXISTS applications (
    id TEXT PRIMARY KEY, -- e.g. SV-2026-001247
    user_id UUID REFERENCES users(id) ON DELETE SET NULL,
    service_id TEXT REFERENCES services(id) ON DELETE RESTRICT,
    service_name TEXT NOT NULL,
    department TEXT NOT NULL,
    category TEXT NOT NULL,
    citizen_name TEXT NOT NULL,
    age INTEGER NOT NULL,
    gender TEXT NOT NULL,
    phone TEXT NOT NULL,
    state TEXT NOT NULL,
    district TEXT,
    occupation TEXT,
    annual_income NUMERIC NOT NULL,
    education_level TEXT,
    status TEXT NOT NULL DEFAULT 'submitted' CHECK (status IN ('submitted', 'documents_received', 'department_review', 'decision', 'completed')),
    submitted_at TIMESTAMPTZ DEFAULT now(),
    current_stage TEXT NOT NULL DEFAULT 'submitted',
    timeline JSONB NOT NULL,
    admin_notes TEXT[] DEFAULT ARRAY[]::TEXT[],
    citizen_notification TEXT,
    created_at TIMESTAMPTZ DEFAULT now()
);

-- 4. DOCUMENTS TABLE
CREATE TABLE IF NOT EXISTS documents (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    application_id TEXT REFERENCES applications(id) ON DELETE CASCADE,
    doc_id TEXT NOT NULL,
    doc_name TEXT NOT NULL,
    file_name TEXT NOT NULL,
    file_url TEXT,
    uploaded_at TIMESTAMPTZ DEFAULT now()
);

-- 5. NOTIFICATIONS TABLE
CREATE TABLE IF NOT EXISTS notifications (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    application_id TEXT REFERENCES applications(id) ON DELETE CASCADE,
    title TEXT NOT NULL,
    message TEXT NOT NULL,
    type TEXT DEFAULT 'info' CHECK (type IN ('info', 'success', 'warning')),
    is_read BOOLEAN DEFAULT false,
    created_at TIMESTAMPTZ DEFAULT now()
);

-- 6. FAQS TABLE
CREATE TABLE IF NOT EXISTS faqs (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    service_id TEXT REFERENCES services(id) ON DELETE CASCADE,
    question TEXT NOT NULL,
    answer TEXT NOT NULL,
    question_te TEXT,
    answer_te TEXT,
    question_hi TEXT,
    answer_hi TEXT,
    created_at TIMESTAMPTZ DEFAULT now()
);

-- ============================================================================
-- SEED DATA (Simulated Demo Services & FAQs)
-- ============================================================================

INSERT INTO services (id, name, name_te, name_hi, category, description, description_te, description_hi, department, state_region, eligibility, processing_information, official_source, is_demo)
VALUES 
(
  'post-matric-scholarship',
  'Post-Matric Student Merit Scholarship',
  'పోస్ట్-మెట్రిక్ విద్యార్థి మెరిట్ స్కాలర్‌షిప్',
  'पोस्ट-मैट्रिक छात्र मेरिट छात्रवृत्ति',
  'Education',
  'Financial scholarship to support post-matriculation and diploma students covering annual maintenance fees and tuition subsidies.',
  'పోస్ట్-మెట్రిక్యులేషన్ మరియు డిప్లొమా విద్యార్థులకు వార్షిక నిర్వహణ రుసుము మరియు ట్యూషన్ సబ్సిడీలను అందించే ఆర్థిక స్కాలర్‌షిప్.',
  'पोस्ट-मैट्रिक और डिप्लोमा छात्रों के लिए वार्षिक रख-रखाव शुल्क और ट्यूशन सब्सिडी प्रदान करने वाली वित्तीय छात्रवृत्ति।',
  'Department of Social Welfare & Higher Education',
  'Telangana / Andhra Pradesh (Demo)',
  '{"minAge": 16, "maxAge": 30, "occupations": ["Student"], "maxAnnualIncome": 250000, "summary": "Full-time students in recognized college/diploma programs with family annual income under ₹2,50,000."}'::jsonb,
  '{"timelineDays": 21, "fee": "Free", "authority": "District Welfare Officer", "deliveryMode": "Direct Benefit Transfer (DBT)"}'::jsonb,
  'https://telanganaepass.cgg.gov.in (Simulated Demo)',
  true
),
(
  'higher-edu-financial-support',
  'Higher Education Financial Support & Book Grant',
  'ఉన్నత విద్య ఆర్థిక సహాయం & పుస్తక గ్రాంట్',
  'उच्च शिक्षा वित्तीय सहायता एवं पुस्तक अनुदान',
  'Education',
  'Special educational grant for undergraduate women and meritorious students to offset study materials, hostel fees, and exam costs.',
  'డిగ్రీ విద్యార్థినులకు మరియు ప్రతిభావంతులకు స్టడీ మెటీరియల్స్, హాస్టల్ రుసుములు మరియు పరీక్ష ఖర్చుల కోసం ప్రత్యేక ఆర్థిక గ్రాంట్.',
  'अंडरग्रेजुएट छात्राओं और मेधावी छात्रों के लिए अध्ययन सामग्री, हॉस्टल शुल्क और परीक्षा लागत में सहायता हेतु विशेष शैक्षिक अनुदान।',
  'Department of Collegiate Education & Youth Welfare',
  'Telangana / Andhra Pradesh (Demo)',
  '{"minAge": 17, "maxAge": 28, "occupations": ["Student"], "maxAnnualIncome": 300000, "summary": "Enrolled in degree/polytechnic/vocational course; priority for young women with annual income under ₹3 Lakhs."}'::jsonb,
  '{"timelineDays": 14, "fee": "Free", "authority": "Directorate of Collegiate Services", "deliveryMode": "Electronic Bank Remittance"}'::jsonb,
  'https://dce.tg.nic.in (Simulated Demo)',
  true
),
(
  'senior-citizen-pension',
  'Senior Citizen Social Security Pension (Aasara / Vrudhyapya)',
  'సీనియర్ సిటిజన్ ఆసరా / వృద్ధాప్య పింఛను',
  'वरिष्ठ नागरिक सामाजिक सुरक्षा पेंशन (आसरा / वृद्धावस्था)',
  'Senior Citizens',
  'Monthly direct social security pension providing dignified sustenance for elderly citizens aged 57 and above from vulnerable households.',
  '57 మరియు అంతకంటే ఎక్కువ వయస్సు ఉన్న వృద్ధులకు గౌరవప్రదమైన జీవనం కోసం నెలవారీ సామాజిక భద్రతా పింఛను.',
  '57 वर्ष या उससे अधिक आयु के बुजुर्ग नागरिकों को सम्मानजनक जीवन यापन हेतु मासिक सामाजिक सुरक्षा पेंशन।',
  'Panchayat Raj & Rural Development / Municipal Administration',
  'Telangana / All India (Demo)',
  '{"minAge": 57, "maxAge": 120, "occupations": ["Senior", "Retired"], "maxAnnualIncome": 150000, "summary": "Citizens aged 57+ residing in state with annual household income under ₹1,50,000."}'::jsonb,
  '{"timelineDays": 30, "fee": "Free", "authority": "District Collector / SERP", "deliveryMode": "Direct Bank Account Credit"}'::jsonb,
  'https://aasara.telangana.gov.in (Simulated Demo)',
  true
),
(
  'farmer-assistance',
  'Rythu / Krishi Direct Income Support Scheme',
  'రైతు / కృషి ప్రత్యక్ష పెట్టుబడి సహాయ పథకం',
  'किसान प्रत्यक्ष कृषि निवेश सहायता योजना',
  'Farmer Services',
  'Direct agricultural investment incentive of ₹5,000 to ₹10,000 per acre per year for purchase of seeds, fertilizers, and farming inputs.',
  'విత్తనాలు, ఎరువులు మరియు వ్యవసాయ అవసరాల కోసం ఎకరానికి ఏటా ₹5,000 నుండి ₹10,000 పెట్టుబడి సహాయం.',
  'बीज, उर्वरक और कृषि आदानों की खरीद हेतु प्रति एकड़ सालाना ₹5,000 से ₹10,000 की सीधी कृषि निवेश प्रोत्साहन सहायता।',
  'Department of Agriculture & Farmers Welfare',
  'Telangana / Andhra Pradesh (Demo)',
  '{"minAge": 18, "maxAge": 100, "occupations": ["Farmer"], "maxAnnualIncome": 1000000, "summary": "Landowning farmers holding registered title deed (Pattadar Passbook)."}'::jsonb,
  '{"timelineDays": 10, "fee": "Free", "authority": "Commissioner of Agriculture", "deliveryMode": "Direct Bank DBT"}'::jsonb,
  'https://rythubandhu.telangana.gov.in (Simulated Demo)',
  true
),
(
  'income-certificate',
  'Citizen Annual Income Certificate Issuance',
  'వార్షిక ఆదాయ ధ్రువీకరణ పత్రం జారీ (మీసేవ)',
  'वार्षिक आय प्रमाण पत्र जारी करना',
  'Certificates',
  'Official revenue department certificate validating individual/household annual income, required for scholarships, housing, and government schemes.',
  'స్కాలర్‌షిప్‌లు, ఇళ్ల పథకాలు మరియు ఇతర సంక్షేమ పథకాల కోసం వ్యక్తిగత/కుటుంబ వార్షిక ఆదాయాన్ని ధ్రువీకరించే అధికారిక రెవెన్యూ పత్రం.',
  'छात्रवृत्ति, आवास और विभिन्न सरकारी योजनाओं हेतु परिवार की वार्षिक आय को सत्यापित करने वाला आधिकारिक राजस्व प्रमाण पत्र।',
  'Revenue Department & Citizen Service Centers (MeeSeva / CSC)',
  'Telangana / Pan-India (Demo)',
  '{"minAge": 18, "maxAge": 120, "occupations": ["Any"], "maxAnnualIncome": 10000000, "summary": "Any bona fide resident citizen requiring proof of income for academic admissions or welfare eligibility."}'::jsonb,
  '{"timelineDays": 7, "fee": "₹45", "authority": "Tahsildar / Mandal Revenue Officer", "deliveryMode": "Digitally Signed PDF Certificate with QR Code"}'::jsonb,
  'https://meeseva.telangana.gov.in (Simulated Demo)',
  true
)
ON CONFLICT (id) DO UPDATE SET
  name = EXCLUDED.name,
  description = EXCLUDED.description;

-- Enable Row Level Security (RLS) policies
ALTER TABLE users ENABLE ROW LEVEL SECURITY;
ALTER TABLE services ENABLE ROW LEVEL SECURITY;
ALTER TABLE applications ENABLE ROW LEVEL SECURITY;
ALTER TABLE documents ENABLE ROW LEVEL SECURITY;
ALTER TABLE notifications ENABLE ROW LEVEL SECURITY;
ALTER TABLE faqs ENABLE ROW LEVEL SECURITY;

-- Read policies for public demo access
CREATE POLICY "Public services read" ON services FOR SELECT USING (true);
CREATE POLICY "Public faqs read" ON faqs FOR SELECT USING (true);
CREATE POLICY "Public applications insert/select" ON applications FOR ALL USING (true);
CREATE POLICY "Public documents insert/select" ON documents FOR ALL USING (true);
CREATE POLICY "Public notifications insert/select" ON notifications FOR ALL USING (true);
