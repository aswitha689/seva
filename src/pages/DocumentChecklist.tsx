import React, { useState } from 'react';
import { Service, ServiceDocument } from '../types/service';
import { useLanguage } from '../context/LanguageContext';
import { useAccessibility } from '../context/AccessibilityContext';
import { UploadedDoc } from '../types/application';
import {
  FileText,
  Upload,
  CheckCircle2,
  AlertCircle,
  ArrowRight,
  ArrowLeft,
  Sparkles,
  Info
} from 'lucide-react';

interface DocumentChecklistProps {
  service: Service;
  uploadedDocs: UploadedDoc[];
  onUpdateDocs: (docs: UploadedDoc[]) => void;
  onNavigate: (route: string, params?: any) => void;
}

export const DocumentChecklist: React.FC<DocumentChecklistProps> = ({
  service,
  uploadedDocs,
  onUpdateDocs,
  onNavigate,
}) => {
  const { language, t } = useLanguage();
  const { speak, isSpeaking, stopSpeaking } = useAccessibility();

  // Handle mock upload of a single document
  const handleMockUpload = (doc: ServiceDocument) => {
    const existingIdx = uploadedDocs.findIndex((d) => d.docId === doc.id);
    const mockFileName = `${doc.id.replace('doc-', 'anitha_')}_verified.pdf`;

    if (existingIdx >= 0) {
      // Toggle off / remove
      const updated = uploadedDocs.filter((d) => d.docId !== doc.id);
      onUpdateDocs(updated);
    } else {
      const newDoc: UploadedDoc = {
        docId: doc.id,
        docName: doc.name,
        fileName: mockFileName,
        uploadedAt: new Date().toLocaleTimeString('en-IN', { hour: '2-digit', minute: '2-digit' }),
      };
      onUpdateDocs([...uploadedDocs, newDoc]);
    }
  };

  // Mock Upload All Demo Documents in 1 click
  const handleUploadAll = () => {
    const allUploaded: UploadedDoc[] = service.documents.map((doc) => ({
      docId: doc.id,
      docName: language === 'te' ? doc.name_te || doc.name : language === 'hi' ? doc.name_hi || doc.name : doc.name,
      fileName: `${doc.id.replace('doc-', 'anitha_')}_verified.pdf`,
      uploadedAt: new Date().toLocaleTimeString('en-IN', { hour: '2-digit', minute: '2-digit' }),
    }));
    onUpdateDocs(allUploaded);
  };

  const requiredDocs = service.documents.filter((d) => d.required);
  const uploadedRequiredCount = requiredDocs.filter((reqDoc) =>
    uploadedDocs.some((d) => d.docId === reqDoc.id)
  ).length;

  const isReady = uploadedRequiredCount === requiredDocs.length;

  return (
    <div className="flex-1 max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-12 space-y-8">
      {/* Top Navigation & Persona Helper */}
      <div className="flex items-center justify-between flex-wrap gap-3">
        <button
          onClick={() => onNavigate('wizard', { serviceId: service.id })}
          className="inline-flex items-center gap-2 text-sm font-semibold text-slate-600 hover:text-slate-900 bg-white px-3.5 py-2 rounded-xl border border-slate-200 shadow-sm min-h-[44px]"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>
            {language === 'te' ? 'అర్హత పేజీకి తిరిగి వెళ్లండి' : language === 'hi' ? 'पात्रता पर वापस जाएं' : 'Back to Eligibility'}
          </span>
        </button>

        <div className="flex items-center gap-2">
          <button
            type="button"
            onClick={() => {
              if (isSpeaking) {
                stopSpeaking();
                return;
              }
              const docNames = requiredDocs
                .map((d) => (language === 'te' ? d.name_te || d.name : language === 'hi' ? d.name_hi || d.name : d.name))
                .join(', ');
              const textToSpeak = language === 'te'
                ? `అవసరమైన పత్రాలు: ${docNames}. మొత్తం ${requiredDocs.length} పత్రాలలో ${uploadedRequiredCount} అప్‌లోడ్ చేయబడ్డాయి.`
                : language === 'hi'
                ? `आवश्यक दस्तावेज: ${docNames}। कुल ${requiredDocs.length} में से ${uploadedRequiredCount} दस्तावेज अपलोड किए गए हैं।`
                : `Required documents: ${docNames}. ${uploadedRequiredCount} of ${requiredDocs.length} uploaded.`;
              speak(textToSpeak);
            }}
            className="inline-flex items-center gap-1.5 px-3 py-2 bg-slate-100 hover:bg-slate-200 text-slate-700 font-semibold text-xs rounded-xl min-h-[44px]"
          >
            <span>
              {isSpeaking
                ? (language === 'te' ? 'ఆడియో ఆపండి' : language === 'hi' ? 'ऑडियो रोकें' : 'Stop Audio')
                : (language === 'te' ? '🔊 చదివి వినిపించు' : language === 'hi' ? '🔊 बोलकर सुनाएं' : '🔊 Read Aloud')}
            </span>
          </button>

          <button
            onClick={handleUploadAll}
            className="inline-flex items-center gap-2 text-xs font-bold text-blue-800 bg-blue-100 hover:bg-blue-200 px-3.5 py-2 rounded-xl border border-blue-300 shadow-sm transition-all min-h-[44px]"
          >
            <Sparkles className="w-4 h-4 text-blue-600" />
            <span>{t('checklist.autoAttachBtn')}</span>
          </button>
        </div>
      </div>

      {/* Header */}
      <div className="space-y-2">
        <div className="flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-slate-500">
          <span>{t('checklist.stepTag')}</span>
          <span>•</span>
          <span className="text-emerald-700">{t('checklist.subTag')}</span>
        </div>
        <h1 className="text-2xl sm:text-3xl font-black text-slate-900">
          {(language === 'te' ? 'పత్రాల జాబితా' : language === 'hi' ? 'दस्तावेज़ चेकलिस्ट' : 'Document Checklist')}: {language === 'te' ? service.name_te : language === 'hi' ? service.name_hi : service.name}
        </h1>
        <p className="text-sm text-slate-600">
          {t('checklist.subtitle')}
        </p>
      </div>

      {/* Upload Progress Bar */}
      <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-sm space-y-3">
        <div className="flex items-center justify-between text-sm">
          <span className="font-bold text-slate-800 flex items-center gap-2">
            <FileText className="w-4 h-4 text-emerald-600" />
            {t('checklist.mandatoryProgress')}
          </span>
          <span className="font-extrabold text-emerald-700">
            {language === 'te'
              ? `${uploadedRequiredCount} / ${requiredDocs.length} పూర్తయింది`
              : language === 'hi'
              ? `${uploadedRequiredCount} / ${requiredDocs.length} पूर्ण हुआ`
              : `${uploadedRequiredCount} of ${requiredDocs.length} Completed`}
          </span>
        </div>
        <div className="w-full bg-slate-100 h-3 rounded-full overflow-hidden">
          <div
            className="bg-emerald-500 h-full transition-all duration-300 rounded-full"
            style={{ width: `${(uploadedRequiredCount / (requiredDocs.length || 1)) * 100}%` }}
          />
        </div>
      </div>

      {/* Document List */}
      <div className="space-y-4">
        {service.documents.map((doc) => {
          const isUploaded = uploadedDocs.some((d) => d.docId === doc.id);
          const uploadedInfo = uploadedDocs.find((d) => d.docId === doc.id);

          const docName =
            language === 'te'
              ? doc.name_te || doc.name
              : language === 'hi'
              ? doc.name_hi || doc.name
              : doc.name;

          return (
            <div
              key={doc.id}
              className={`p-5 rounded-2xl border transition-all flex flex-col sm:flex-row sm:items-center justify-between gap-4 ${
                isUploaded
                  ? 'bg-emerald-50/60 border-emerald-300'
                  : 'bg-white border-slate-200 hover:border-slate-300 shadow-sm'
              }`}
            >
              <div className="space-y-1.5 max-w-xl">
                <div className="flex items-center gap-2 flex-wrap">
                  <span className="font-bold text-base text-slate-900">{docName}</span>
                  {doc.required ? (
                    <span className="px-2 py-0.5 text-[11px] font-bold rounded-full bg-rose-100 text-rose-800 border border-rose-200">
                      {t('checklist.required')}
                    </span>
                  ) : (
                    <span className="px-2 py-0.5 text-[11px] font-bold rounded-full bg-slate-100 text-slate-700 border border-slate-200">
                      {t('checklist.optional')}
                    </span>
                  )}
                </div>
                <p className="text-xs text-slate-500 leading-relaxed">
                  {language === 'te'
                    ? (doc as any).description_te || doc.description
                    : language === 'hi'
                    ? (doc as any).description_hi || doc.description
                    : doc.description}
                </p>

                {isUploaded && (
                  <div className="flex items-center gap-2 text-xs font-semibold text-emerald-800 pt-1">
                    <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                    <span>
                      {language === 'te'
                        ? `అప్‌లోడ్ చేయబడింది: ${uploadedInfo?.fileName}`
                        : language === 'hi'
                        ? `अपलोड किया गया: ${uploadedInfo?.fileName}`
                        : `Uploaded: ${uploadedInfo?.fileName}`}
                    </span>
                    <span className="text-slate-400">({uploadedInfo?.uploadedAt})</span>
                  </div>
                )}
              </div>

              {/* Upload Button */}
              <div className="shrink-0">
                <button
                  type="button"
                  onClick={() => handleMockUpload(doc)}
                  className={`w-full sm:w-auto px-4 py-2.5 rounded-xl font-bold text-xs flex items-center justify-center gap-2 transition-all min-h-[44px] ${
                    isUploaded
                      ? 'bg-emerald-600 text-white hover:bg-emerald-700'
                      : 'bg-slate-100 hover:bg-slate-200 text-slate-800 border border-slate-300'
                  }`}
                >
                  <Upload className="w-4 h-4" />
                  <span>{isUploaded ? t('checklist.replaceDoc') : t('checklist.mockUpload')}</span>
                </button>
              </div>
            </div>
          );
        })}
      </div>

      {/* Mandatory civic notice */}
      <div className="p-3.5 rounded-xl bg-amber-50 border border-amber-200 text-xs text-amber-900 flex items-center gap-2">
        <Info className="w-4 h-4 shrink-0 text-amber-700" />
        <span>
          {language === 'te'
            ? 'ఎటువంటి నిజమైన ప్రభుత్వ API లేదా ఆధార్ ప్రమాణీకరణ ఉపయోగించబడదు. ఫైళ్లు డెమో అనుకరణ మాత్రమే.'
            : language === 'hi'
            ? 'कोई वास्तविक सरकारी एपीआई या आधार प्रमाणीकरण लागू नहीं है। फाइलें केवल डेमो सिमुलेशन हैं।'
            : 'No real government APIs or Aadhaar authentication are invoked. Files are demo simulated.'}
        </span>
      </div>

      {/* Proceed CTA */}
      <div className="pt-4 flex flex-col sm:flex-row items-center justify-between gap-4 border-t border-slate-100">
        <button
          onClick={() => onNavigate('wizard', { serviceId: service.id })}
          className="w-full sm:w-auto px-6 py-3 rounded-xl text-slate-700 hover:bg-slate-100 font-semibold text-sm min-h-[44px]"
        >
          {t('checklist.prevStep')}
        </button>

        <button
          onClick={() => onNavigate('apply', { serviceId: service.id })}
          disabled={!isReady}
          className="w-full sm:w-auto px-8 py-3.5 rounded-2xl bg-emerald-600 hover:bg-emerald-700 disabled:bg-slate-300 disabled:cursor-not-allowed text-white font-bold text-sm shadow-md shadow-emerald-600/20 flex items-center justify-center gap-2 min-h-[48px] transition-all"
        >
          <span>{t('checklist.proceedApply')}</span>
          <ArrowRight className="w-4 h-4" />
        </button>
      </div>
    </div>
  );
};
