import React from 'react';
import { useLanguage } from '../context/LanguageContext';
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
  Legend,
} from 'recharts';
import {
  BarChart3,
  TrendingUp,
  Globe,
  Eye,
  HelpCircle,
  Sparkles,
  ArrowRight,
  ShieldCheck,
  CheckCircle2
} from 'lucide-react';

interface AnalyticsProps {
  onNavigate: (route: string, params?: any) => void;
}

export const Analytics: React.FC<AnalyticsProps> = ({ onNavigate }) => {
  const { language, t } = useLanguage();

  // 1. Service Demand (Simulated Demo Data)
  const serviceDemandData = [
    { name: 'Education Scholarships', applications: 580, resolved: 510 },
    { name: 'Farmer Crop Support', applications: 420, resolved: 390 },
    { name: 'Senior Citizen Pension', applications: 290, resolved: 270 },
    { name: 'Income Certificates', applications: 192, resolved: 185 },
  ];

  // 2. Language Distribution (Simulated Demo Data)
  const languageData = [
    { name: 'Telugu (తెలుగు)', value: 54, color: '#16a34a' },
    { name: 'Hindi (हिंदी)', value: 28, color: '#f59e0b' },
    { name: 'English', value: 18, color: '#0284c7' },
  ];

  // 3. Accessibility Adoption (Simulated Demo Data)
  const accessibilityData = [
    { feature: 'Text Resize (Large/XL)', adoptionPct: 45 },
    { feature: 'Voice & Read Aloud', adoptionPct: 38 },
    { feature: 'High Contrast Mode', adoptionPct: 32 },
    { feature: 'Data Saver (Low Bandwidth)', adoptionPct: 29 },
  ];

  // 4. Application Funnel (Simulated Demo Data)
  const funnelData = [
    { stage: '1. Discovery Query', count: 2400, dropoff: '100%' },
    { stage: '2. Matched Schemes', count: 1850, dropoff: '77%' },
    { stage: '3. Eligibility Wizard', count: 1420, dropoff: '59%' },
    { stage: '4. Document Checklist', count: 1180, dropoff: '49%' },
    { stage: '5. Submitted Applications', count: 1020, dropoff: '42.5%' },
  ];

  // 5. Frequently Asked Citizen Questions (Simulated Demo Data)
  const commonQuestions = [
    {
      question: 'Can private affiliated college students apply for post-matric fee reimbursement?',
      category: 'Education',
      frequency: 412,
      resolvedByAI: 'Yes (98% confidence)',
    },
    {
      question: 'When is the upcoming seasonal direct deposit for Rythu crop incentive?',
      category: 'Farmer Services',
      frequency: 348,
      resolvedByAI: 'Yes (Prior to Kharif sowing)',
    },
    {
      question: 'What is the minimum age proof required for elderly social security pension?',
      category: 'Senior Citizens',
      frequency: 295,
      resolvedByAI: 'Yes (57 years via Aadhaar)',
    },
    {
      question: 'Is an in-person physical Mandal inspection mandatory for income certificate?',
      category: 'Certificates',
      frequency: 184,
      resolvedByAI: 'Yes (VRO field check)',
    },
  ];

  return (
    <div className="flex-1 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-12 space-y-8">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b pb-6 border-slate-200">
        <div>
          <div className="flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-slate-500">
            <span>Public Welfare Intelligence</span>
            <span>•</span>
            <span className="text-emerald-700">Civic Insights</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-black text-slate-900 tracking-tight mt-1">
            Service Analytics & Civic Insights
          </h1>
          <p className="text-xs sm:text-sm text-slate-500">
            Real-time trends on scheme discovery, regional language adoption, accessible journeys, and citizen conversion.
          </p>
        </div>

        {/* Demo banner */}
        <div className="self-start sm:self-auto px-3.5 py-1.5 rounded-full bg-amber-100 text-amber-900 border border-amber-300 text-xs font-bold">
          All metrics: Simulated Demo Data
        </div>
      </div>

      {/* Top 4 Insight Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="p-5 rounded-2xl bg-white border border-slate-200 shadow-sm space-y-2">
          <div className="flex items-center justify-between text-slate-400">
            <span className="text-xs font-bold uppercase">Avg. Assisted Time</span>
            <TrendingUp className="w-4 h-4 text-emerald-600" />
          </div>
          <span className="text-3xl font-black text-slate-900">4.2 min</span>
          <span className="text-[11px] text-slate-400 block font-medium">
            vs 4–6 office visits traditionally (simulated demo data)
          </span>
        </div>

        <div className="p-5 rounded-2xl bg-white border border-slate-200 shadow-sm space-y-2">
          <div className="flex items-center justify-between text-slate-400">
            <span className="text-xs font-bold uppercase">Regional Language</span>
            <Globe className="w-4 h-4 text-indigo-600" />
          </div>
          <span className="text-3xl font-black text-indigo-700">82%</span>
          <span className="text-[11px] text-slate-400 block font-medium">
            Telugu & Hindi queries combined (simulated demo data)
          </span>
        </div>

        <div className="p-5 rounded-2xl bg-white border border-slate-200 shadow-sm space-y-2">
          <div className="flex items-center justify-between text-slate-400">
            <span className="text-xs font-bold uppercase">Accessibility Users</span>
            <Eye className="w-4 h-4 text-purple-600" />
          </div>
          <span className="text-3xl font-black text-purple-700">38.4%</span>
          <span className="text-[11px] text-slate-400 block font-medium">
            Used High Contrast, Large Text, or Read Aloud (simulated demo data)
          </span>
        </div>

        <div className="p-5 rounded-2xl bg-white border border-slate-200 shadow-sm space-y-2">
          <div className="flex items-center justify-between text-slate-400">
            <span className="text-xs font-bold uppercase">Completion Rate</span>
            <CheckCircle2 className="w-4 h-4 text-teal-600" />
          </div>
          <span className="text-3xl font-black text-teal-700">86.4%</span>
          <span className="text-[11px] text-slate-400 block font-medium">
            Eligibility-to-submission conversion (simulated demo data)
          </span>
        </div>
      </div>

      {/* Row 1 Charts: Service Demand & Language Usage */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Service Demand BarChart */}
        <div className="bg-white p-6 rounded-3xl border border-slate-200 shadow-sm space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="text-base font-bold text-slate-900">
              Citizen Demand by Service Category
            </h3>
            <span className="text-[11px] text-slate-400 font-mono">simulated demo data</span>
          </div>

          <div className="h-64 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={serviceDemandData} margin={{ top: 10, right: 10, left: -20, bottom: 20 }}>
                <XAxis dataKey="name" tick={{ fontSize: 11 }} interval={0} angle={-15} textAnchor="end" />
                <YAxis tick={{ fontSize: 11 }} />
                <Tooltip />
                <Bar dataKey="applications" fill="#16a34a" name="Applications Received" radius={[6, 6, 0, 0]} />
                <Bar dataKey="resolved" fill="#0284c7" name="Sanctioned" radius={[6, 6, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Language Usage PieChart */}
        <div className="bg-white p-6 rounded-3xl border border-slate-200 shadow-sm space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="text-base font-bold text-slate-900">
              Language Preference Distribution
            </h3>
            <span className="text-[11px] text-slate-400 font-mono">simulated demo data</span>
          </div>

          <div className="h-64 w-full flex items-center justify-center">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={languageData}
                  cx="50%"
                  cy="50%"
                  outerRadius={80}
                  innerRadius={45}
                  dataKey="value"
                  label={({ name, value }) => `${value}%`}
                >
                  {languageData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} />
                  ))}
                </Pie>
                <Tooltip />
                <Legend />
              </PieChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>

      {/* Row 2 Charts: Accessibility Adoption & Application Funnel */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Accessibility Adoption */}
        <div className="bg-white p-6 rounded-3xl border border-slate-200 shadow-sm space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="text-base font-bold text-slate-900">
              Inclusion & Accessibility Usage
            </h3>
            <span className="text-[11px] text-slate-400 font-mono">simulated demo data</span>
          </div>

          <div className="h-64 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart
                data={accessibilityData}
                layout="vertical"
                margin={{ top: 10, right: 30, left: 40, bottom: 10 }}
              >
                <XAxis type="number" unit="%" tick={{ fontSize: 11 }} />
                <YAxis dataKey="feature" type="category" tick={{ fontSize: 10 }} width={120} />
                <Tooltip formatter={(value) => `${value}%`} />
                <Bar dataKey="adoptionPct" fill="#9333ea" radius={[0, 6, 6, 0]} name="Adoption Rate (%)" />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Funnel Progress */}
        <div className="bg-white p-6 rounded-3xl border border-slate-200 shadow-sm space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="text-base font-bold text-slate-900">
              Assisted Journey Conversion Funnel
            </h3>
            <span className="text-[11px] text-slate-400 font-mono">simulated demo data</span>
          </div>

          <div className="space-y-3 pt-2">
            {funnelData.map((item, idx) => (
              <div key={idx} className="space-y-1">
                <div className="flex justify-between text-xs font-semibold">
                  <span className="text-slate-800">{item.stage}</span>
                  <span className="text-slate-500 font-mono">{item.count.toLocaleString()} ({item.dropoff})</span>
                </div>
                <div className="w-full bg-slate-100 h-3 rounded-full overflow-hidden">
                  <div
                    className="bg-emerald-600 h-full rounded-full transition-all"
                    style={{ width: item.dropoff }}
                  />
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Common Citizen Queries Table */}
      <div className="bg-white rounded-3xl border border-slate-200 shadow-sm p-6 sm:p-8 space-y-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <HelpCircle className="w-5 h-5 text-emerald-600" />
            <h3 className="text-base font-bold text-slate-900">
              Most Common Citizen Inquiries (AI Resolved)
            </h3>
          </div>
          <span className="text-[11px] text-slate-400 font-mono">simulated demo data</span>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs sm:text-sm">
            <thead className="bg-slate-50 border-b border-slate-200 text-slate-500 font-bold uppercase text-[10px] tracking-wider">
              <tr>
                <th className="px-4 py-3">Citizen Question</th>
                <th className="px-4 py-3">Scheme Category</th>
                <th className="px-4 py-3 text-right">Inquiries</th>
                <th className="px-4 py-3">AI Resolution</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {commonQuestions.map((q, idx) => (
                <tr key={idx} className="hover:bg-slate-50">
                  <td className="px-4 py-3.5 font-medium text-slate-900 max-w-md">
                    "{q.question}"
                  </td>
                  <td className="px-4 py-3.5">
                    <span className="px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-slate-100 text-slate-700">
                      {q.category}
                    </span>
                  </td>
                  <td className="px-4 py-3.5 text-right font-mono font-bold text-slate-800">
                    {q.frequency}
                  </td>
                  <td className="px-4 py-3.5 text-emerald-700 font-semibold text-xs">
                    {q.resolvedByAI}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};
