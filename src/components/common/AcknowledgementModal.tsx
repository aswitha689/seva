import React from 'react';
import { Application } from '../../types/application';
import { useLanguage } from '../../context/LanguageContext';
import { ShieldCheck, Printer, X, QrCode, CheckCircle2 } from 'lucide-react';

interface AcknowledgementModalProps {
  application: Application;
  isOpen: boolean;
  onClose: () => void;
}

export const AcknowledgementModal: React.FC<AcknowledgementModalProps> = ({
  application,
  isOpen,
  onClose,
}) => {
  const { language, t } = useLanguage();

  if (!isOpen) return null;

  const handlePrint = () => {
    window.print();
  };

  const serviceName =
    language === 'te'
      ? application.serviceName_te || application.serviceName
      : language === 'hi'
      ? application.serviceName_hi || application.serviceName
      : application.serviceName;

  const getLabels = () => {
    if (language === 'te') {
      return {
        officialReceipt: 'అధికారిక పౌర రసీదు',
        printSave: 'ప్రింట్ / PDF సేవ్ చేయండి',
        closeReceipt: 'రసీదును మూసివేయి',
        govtHeader: 'ప్రభుత్వ సంక్షేమ పరిపాలన (సిమ్యులేటెడ్ డెమో)',
        slipTitle: 'అధికారిక దరఖాస్తు రసీదు పత్రం',
        subHeader: `పౌర డిజిటల్ సేవా నమోదు — ${application.department}`,
        appId: 'దరఖాస్తు సంఖ్య (ID):',
        timestamp: 'నమోదు సమయం:',
        scheme: 'ఎంచుకున్న పథకం:',
        citizenName: 'పౌరుని పేరు:',
        phone: 'సంప్రదింపు నంబర్:',
        domicile: 'నివాస పరిధి / జిల్లా:',
        income: 'వార్షిక కుటుంబ ఆదాయం:',
        docs: 'జతచేసిన ధృవీకృత పత్రాలు:',
        qrCode: '[QR కోడ్ ధృవీకరణ]',
        hash: 'డిజిటల్ వెరిఫికేషన్ హ్యాష్',
        verifiedBy: 'సేవాసారథి ద్వారా SHA-256 ధృవీకరించబడింది',
        status: 'స్థితి: అధికారికంగా నమోదైంది',
        digiSig: 'డిజిటల్ సంతకం',
        nodalOfficer: 'నోడల్ డెస్క్ అధికారి',
        deptWelfare: 'సంక్షేమ శాఖ',
        years: 'సంవత్సరాలు',
        perYear: '/ సం.',
        demoWatermark: 'డెమో డేటా',
        disclaimer: 'ఈ రసీదులో ఉన్న సమస్త సమాచారం కేవలం ప్రోటోటైప్ ప్రదర్శన కోసం మాత్రమే.'
      };
    }
    if (language === 'hi') {
      return {
        officialReceipt: 'आधिकारिक नागरिक रसीद',
        printSave: 'प्रिंट / PDF सहेजें',
        closeReceipt: 'रसीद बंद करें',
        govtHeader: 'सरकारी कल्याण प्रशासन (सिमुलेटेड डेमो)',
        slipTitle: 'आधिकारिक आवेदन पावती रसीद',
        subHeader: `नागरिक डिजिटल सेवा पंजीकरण — ${application.department}`,
        appId: 'आवेदन संख्या (ID):',
        timestamp: 'पंजीकरण समय:',
        scheme: 'चयनित योजना:',
        citizenName: 'नागरिक का नाम:',
        phone: 'संपर्क नंबर:',
        domicile: 'निवास क्षेत्र / जिला:',
        income: 'वार्षिक पारिवारिक आय:',
        docs: 'सत्यापित संलग्न दस्तावेज़:',
        qrCode: '[क्यूआर कोड सत्यापन]',
        hash: 'डिजिटल सत्यापन हैश',
        verifiedBy: 'सेवासारथी द्वारा SHA-256 सत्यापित',
        status: 'स्थिति: आधिकारिक रूप से पंजीकृत',
        digiSig: 'डिजिटल हस्ताक्षर',
        nodalOfficer: 'नोडल डेस्क अधिकारी',
        deptWelfare: 'कल्याण विभाग',
        years: 'वर्ष',
        perYear: '/ वर्ष',
        demoWatermark: 'डेमो डेटा',
        disclaimer: 'इस रसीद में निहित सभी जानकारी केवल प्रोटोटाइप प्रदर्शन के उद्देश्य से है।'
      };
    }
    return {
      officialReceipt: 'Official Citizen Receipt',
      printSave: 'Print / Save PDF',
      closeReceipt: 'Close receipt',
      govtHeader: 'Government Welfare Administration (Simulated Demo)',
      slipTitle: 'OFFICIAL APPLICATION ACKNOWLEDGEMENT SLIP',
      subHeader: `Citizen Digital Service Registration — ${application.department}`,
      appId: 'Application ID:',
      timestamp: 'Registration Timestamp:',
      scheme: 'Selected Scheme:',
      citizenName: 'Citizen Name:',
      phone: 'Contact Number:',
      domicile: 'Domicile Jurisdiction:',
      income: 'Annual Family Income:',
      docs: 'Verified Attached Documents:',
      qrCode: '[QR CODE VERIFICATION]',
      hash: 'Digital Verification Hash',
      verifiedBy: 'SHA-256 Verified by SevaSaarthi',
      status: 'Status: Officially Registered',
      digiSig: 'DIGITAL SIGNATURE',
      nodalOfficer: 'Nodal Desk Officer',
      deptWelfare: 'Department of Welfare',
      years: 'yrs',
      perYear: '/ year',
      demoWatermark: 'DEMO DATA',
      disclaimer: 'All information contained in this slip is simulated demonstration data.'
    };
  };

  const labels = getLabels();

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-sm"
      role="dialog"
      aria-modal="true"
      aria-labelledby="ack-title"
    >
      <div className="w-full max-w-2xl bg-white rounded-3xl shadow-2xl p-6 sm:p-8 space-y-6 border border-slate-200 overflow-y-auto max-h-[90vh] print:p-0 print:border-none print:shadow-none">
        {/* Top Actions */}
        <div className="flex items-center justify-between border-b pb-4 border-slate-100 print:hidden">
          <span className="text-xs font-bold uppercase tracking-wider text-slate-500">
            {labels.officialReceipt}
          </span>
          <div className="flex items-center gap-2">
            <button
              onClick={handlePrint}
              className="px-4 py-2 bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl text-xs font-bold flex items-center gap-2 shadow-sm transition-colors min-h-[40px]"
            >
              <Printer className="w-4 h-4" />
              <span>{labels.printSave}</span>
            </button>
            <button
              onClick={onClose}
              className="p-2 text-slate-400 hover:text-slate-700 rounded-full hover:bg-slate-100 min-h-[40px] min-w-[40px] flex items-center justify-center"
              aria-label={labels.closeReceipt}
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Printable Certificate Slip */}
        <div className="border-4 border-slate-800 rounded-2xl p-6 sm:p-8 space-y-6 relative bg-white">
          {/* Watermark */}
          <div className="absolute inset-0 flex items-center justify-center pointer-events-none opacity-5">
            <span className="text-8xl font-black text-slate-900 rotate-[-30deg]">
              {labels.demoWatermark}
            </span>
          </div>

          {/* Header */}
          <div className="text-center border-b-2 border-slate-800 pb-4 space-y-1">
            <div className="flex justify-center mb-2">
              <div className="w-12 h-12 rounded-xl bg-slate-900 text-white flex items-center justify-center font-bold text-lg">
                🏛️
              </div>
            </div>
            <span className="text-xs font-bold text-slate-500 uppercase tracking-widest block">
              {labels.govtHeader}
            </span>
            <h2 id="ack-title" className="text-xl sm:text-2xl font-black text-slate-900">
              {labels.slipTitle}
            </h2>
            <p className="text-xs text-slate-600 font-medium">
              {labels.subHeader}
            </p>
          </div>

          {/* Details Table */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
            <div className="space-y-1 p-3 bg-slate-50 rounded-xl border border-slate-200">
              <span className="text-slate-400 font-semibold block">{labels.appId}</span>
              <span className="text-base font-black text-emerald-800 font-mono">
                {application.id}
              </span>
            </div>

            <div className="space-y-1 p-3 bg-slate-50 rounded-xl border border-slate-200">
              <span className="text-slate-400 font-semibold block">{labels.timestamp}</span>
              <span className="text-sm font-bold text-slate-800">
                {application.submittedAt}
              </span>
            </div>

            <div className="space-y-1 p-3 bg-slate-50 rounded-xl border border-slate-200 col-span-1 sm:col-span-2">
              <span className="text-slate-400 font-semibold block">{labels.scheme}</span>
              <span className="text-sm font-bold text-slate-900">{serviceName}</span>
            </div>

            <div className="space-y-1 p-3 bg-slate-50 rounded-xl border border-slate-200">
              <span className="text-slate-400 font-semibold block">{labels.citizenName}</span>
              <span className="text-sm font-bold text-slate-900">
                {application.citizenName} ({application.age} {labels.years}, {application.gender})
              </span>
            </div>

            <div className="space-y-1 p-3 bg-slate-50 rounded-xl border border-slate-200">
              <span className="text-slate-400 font-semibold block">{labels.phone}</span>
              <span className="text-sm font-mono font-bold text-slate-900">{application.phone}</span>
            </div>

            <div className="space-y-1 p-3 bg-slate-50 rounded-xl border border-slate-200">
              <span className="text-slate-400 font-semibold block">{labels.domicile}</span>
              <span className="text-sm font-bold text-slate-900">
                {application.district || 'Warangal'}, {application.state}
              </span>
            </div>

            <div className="space-y-1 p-3 bg-slate-50 rounded-xl border border-slate-200">
              <span className="text-slate-400 font-semibold block">{labels.income}</span>
              <span className="text-sm font-bold text-slate-900">
                ₹{application.annualIncome.toLocaleString('en-IN')} {labels.perYear}
              </span>
            </div>
          </div>

          {/* Uploaded Documents List */}
          <div className="p-3 bg-slate-50 rounded-xl border border-slate-200 text-xs space-y-1.5">
            <span className="font-bold text-slate-800 block">{labels.docs}</span>
            <div className="flex flex-wrap gap-2">
              {application.uploadedDocuments.map((doc, idx) => (
                <span
                  key={idx}
                  className="px-2 py-1 rounded bg-white border border-slate-200 font-medium text-slate-700 text-[11px]"
                >
                  ✓ {doc.docName}
                </span>
              ))}
            </div>
          </div>

          {/* Seal & QR Code Block */}
          <div className="pt-4 border-t-2 border-slate-800 flex items-center justify-between text-xs">
            <div className="flex items-center gap-3">
              <div className="w-16 h-16 bg-slate-100 border border-slate-300 rounded-lg flex items-center justify-center text-slate-600 font-mono text-[9px] text-center p-1">
                {labels.qrCode}
              </div>
              <div className="text-[11px] text-slate-500 leading-tight">
                <span className="font-bold text-slate-800 block">{labels.hash}</span>
                <span>{labels.verifiedBy}</span>
                <span className="block text-[10px] text-emerald-700 font-bold">{labels.status}</span>
              </div>
            </div>

            <div className="text-right">
              <div className="w-24 border-b border-slate-800 pb-1 mb-1 font-bold text-[10px] text-slate-400 text-center">
                {labels.digiSig}
              </div>
              <span className="text-[10px] font-bold text-slate-800 block">{labels.nodalOfficer}</span>
              <span className="text-[9px] text-slate-400">{labels.deptWelfare}</span>
            </div>
          </div>

          {/* Statutory Disclaimer */}
          <div className="pt-2 text-[10px] text-slate-400 text-center leading-normal">
            {labels.disclaimer}
          </div>
        </div>
      </div>
    </div>
  );
};
