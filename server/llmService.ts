import fs from 'fs';
import path from 'path';

/**
 * Server-side retrieval and LLM explanation service.
 * Retrieves service details from services table / knowledge base only.
 * Calls LLM using process.env server environment variables only.
 */
export async function explainServiceWithLLM(query: string, language: string = 'en') {
  const apiKey = process.env.GEMINI_API_KEY || process.env.LLM_API_KEY;

  // 1. Retrieval Step: Retrieve from services table / services.json strictly
  const servicesPath = path.resolve(process.cwd(), 'src/data/services.json');
  let services = [];
  try {
    const raw = fs.readFileSync(servicesPath, 'utf-8');
    services = JSON.parse(raw);
  } catch (err) {
    console.error('Error reading services knowledge base:', err);
    throw new Error('Services database unavailable');
  }

  // Find relevant services matching query tokens
  const qLower = query.toLowerCase();
  const matchedServices = services.filter((s: any) => {
    const text = `${s.name} ${s.name_te} ${s.name_hi} ${s.description} ${s.category} ${s.department}`.toLowerCase();
    const words = qLower.split(' ').filter((w) => w.length > 2);
    return words.some((w) => text.includes(w));
  });

  const targetServices = matchedServices.length > 0 ? matchedServices.slice(0, 2) : [services[0]];

  // Context constructed strictly from retrieved services
  const retrievedContext = targetServices
    .map((s: any) => {
      return `
[Scheme ID: ${s.id}]
Name (EN): ${s.name}
Name (TE): ${s.name_te}
Name (HI): ${s.name_hi}
Category: ${s.category}
Department: ${s.department}
Description: ${s.description}
Eligibility: ${s.eligibility.summary} (Age: ${s.eligibility.minAge || 'N/A'}-${s.eligibility.maxAge || 'N/A'}, Max Income: ₹${s.eligibility.maxAnnualIncome || 'N/A'})
Documents: ${s.documents.map((d: any) => d.name + (d.required ? ' (Required)' : ' (Optional)')).join(', ')}
Processing: ${s.processing_information.timelineDays} days, Fee: ${s.processing_information.fee}, Authority: ${s.processing_information.authority}
`;
    })
    .join('\n---\n');

  if (!apiKey) {
    throw new Error('NO_API_KEY: LLM API key not configured on server. Falling back to keyword matcher.');
  }

  // System prompt enforcing HARD RULES from SPEC
  const systemInstruction = `
You are SevaSaarthi, an AI-powered citizen service assistant.
CRITICAL CONSTRAINTS:
1. Explain schemes using RETRIEVAL FROM THE PROVIDED SERVICES ONLY.
2. NEVER invent or hallucinate any schemes, rules, phone numbers, or government portals.
3. If info is missing, say: "Information not available".
4. Always conclude with: "This is preliminary guidance. Final eligibility is determined by the concerned authority."
5. Respond directly and politely in the requested language (${language === 'te' ? 'Telugu' : language === 'hi' ? 'Hindi' : 'English'}).
`;

  const userPrompt = `
Citizen Query: "${query}"
Language requested: ${language}

RETRIEVED GOVERNMENT SERVICES CONTEXT:
${retrievedContext}

Please explain the scheme, who is eligible, and what documents are required based solely on the retrieved context above.
`;

  // Call Google Gemini API
  const url = `https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent?key=${apiKey}`;

  const response = await fetch(url, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      contents: [{ role: 'user', parts: [{ text: `${systemInstruction}\n\n${userPrompt}` }] }],
      generationConfig: {
        temperature: 0.2,
        maxOutputTokens: 600,
      },
    }),
  });

  if (!response.ok) {
    const errorText = await response.text();
    console.error('Gemini API Error:', errorText);
    throw new Error(`LLM API returned status ${response.status}`);
  }

  const data = await response.json();
  const text = data?.candidates?.[0]?.content?.parts?.[0]?.text;

  if (!text) {
    throw new Error('Empty response from LLM');
  }

  return {
    text: text.trim(),
    retrievedServiceId: targetServices[0]?.id,
    source: 'llm_with_services_retrieval',
  };
}
