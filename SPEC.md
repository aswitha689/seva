# SPEC.md - SevaSaarthi ("Government services, made simple")

## PRODUCT
An AI-powered, multilingual (English/Telugu/Hindi), accessible citizen-service navigator. A citizen types or speaks a need in natural language, and the app maps it to relevant services from a structured knowledge base, asks only relevant eligibility questions, builds a document checklist, runs a guided application, and tracks status. The citizen journey is the product; AI is the intelligence layer.

## STACK
React + TypeScript + Vite + Tailwind, Recharts, browser Web Speech API. Phase 1-4: NO backend, use local JSON + localStorage. Supabase and an LLM come later only if I ask.

## HARD RULES
- Never invent schemes. All services come from src/data/services.json and are labeled "Demo data".
- If info is missing, say "Information not available".
- Always show: "This is preliminary guidance. Final eligibility is determined by the concerned authority."
- No real Aadhaar/payment/government APIs. Label simulated features "Demo".
- Fictional citizen data only. No API keys in frontend code.
- Never fabricate impact statistics; any numbers must be labeled "simulated demo data".
- Mobile-first and accessible: semantic HTML, ARIA labels, visible focus, large touch targets, never rely on color alone.
- Friendly, modern, card-based UI. NOT an admin-dashboard look. Progressive disclosure.
- Keep code simple, don't over-engineer. Polished end-to-end journey beats feature count.

## CITIZEN FLOW
1. Home: "How can we help you today?" Hero = "🎤 Just tell me what you need" (subtext: "No need to know the department or scheme name"). Text box, mic, Search, "Track my application". Category cards: Education, Housing, Financial Assistance, Senior Citizens, Disability Services, Farmer Services, Certificates. Language switch EN | తెలుగు | हिंदी. Accessibility button. Data Saver toggle.
2. Discovery: detect intent/category/language from text. Show "We understood you need: 🎓 Education Assistance", then 2-3 service cards with "Why this matches you", department, eligibility summary, documents, application method, processing info. Button: "Check my eligibility".
3. Eligibility wizard: "Who are you?" (Student/Farmer/Senior/Woman/Person with Disability/Other), then only 3-4 relevant questions (age, state, occupation/education, approx income). Result: 🟢 matched / 🟡 needs verification / 🔴 not met, using icons plus text labels.
4. Document checklist: per service; each doc has Required/Optional label, mock upload button, upload status.
5. Guided application, 4 steps with progress bar: Personal Details → Eligibility → Documents → Review & Submit. Short "why we ask this" text per step.
6. Submission: "Application Submitted 🎉", ID like SV-2026-001247, date, service, department, status, next stage, Track button.
7. Tracking: vertical timeline (Submitted → Documents Received → Department Review → Decision → Completed) with timestamps and plain-language explanations.
8. Floating AI assistant on all citizen screens, via a swappable askAssistant() function (keyword/rule-based for now, using services.json and current application context).

## CROSS-CUTTING
- i18n with simple EN/TE/HI JSON files and a language context, easy to add languages. Service data has translated fields.
- Voice: speech to text to discovery, fallback to text if unsupported. "🔊 Read Aloud" via speechSynthesis.
- Accessibility panel: text size, high contrast, reduce motion, simplified interface, read aloud. Persist in localStorage.
- Data Saver mode: no animations, text-first, no extra images.

## SECONDARY
- /admin: metrics (Total Citizens, Applications, Pending, Completed, AI-Assisted Journeys, Accessibility Usage), applications table, detail view, status update, notes, send notification.
- /analytics: service usage, language usage, accessibility usage, application funnel, common questions (seeded, labeled demo data).

## DEMO PERSONA
Anitha, 20, Telugu, student needing education financial help. The full journey must work end-to-end: select Telugu → speak need → service found → wizard → checklist → upload → submit → track → admin updates status → citizen sees notification.

## DO NOT BUILD
Real Aadhaar verification, real gov APIs, payments, microservices, dozens of services, ML models, complex auth.

## PROCESS
Build only the phase I request. Keep replies short and don't re-explain code.
