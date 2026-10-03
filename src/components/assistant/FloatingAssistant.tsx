import React, { useState, useRef, useEffect } from 'react';
import { useLanguage } from '../../context/LanguageContext';
import { useAccessibility } from '../../context/AccessibilityContext';
import { askAssistant, AssistantContext } from '../../services/aiAssistant';
import { Service } from '../../types/service';
import { Application } from '../../types/application';
import {
  MessageSquare,
  X,
  Send,
  Mic,
  MicOff,
  Volume2,
  Bot,
  Sparkles,
  ArrowRight,
  User,
  ChevronDown
} from 'lucide-react';

interface FloatingAssistantProps {
  currentRoute: string;
  selectedService?: Service;
  activeApplication?: Application | null;
  onNavigate: (route: string, params?: any) => void;
}

interface ChatMessage {
  id: string;
  sender: 'user' | 'assistant';
  text: string;
  action?: {
    label: string;
    route: string;
    params?: any;
  };
  timestamp: string;
}

export const FloatingAssistant: React.FC<FloatingAssistantProps> = ({
  currentRoute,
  selectedService,
  activeApplication,
  onNavigate,
}) => {
  const { language, detectAndSetLanguage } = useLanguage();
  const { speak, isSpeaking, stopSpeaking, readAloudEnabled } = useAccessibility();

  const [isOpen, setIsOpen] = useState(false);
  const [inputText, setInputText] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const [isListening, setIsListening] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const initialGreeting =
    language === 'te'
      ? 'నమస్కారం! నేను మీ సేవాసారథి AI అసిస్టెంట్‌ని. మీకు ప్రభుత్వ పథకాలు, అర్హత లేదా దరఖాస్తు గురించి ఏ సందేహం ఉన్నా అడగండి.'
      : language === 'hi'
      ? 'नमस्ते! मैं आपका सेवासारथी AI सहायक हूँ। सरकारी योजनाओं, पात्रता अथवा आवेदन से संबंधित कोई भी प्रश्न पूछें।'
      : 'Hello! I am your SevaSaarthi Civic Navigator. Ask me anything about scheme eligibility, documents, or status tracking.';

  const [messages, setMessages] = useState<ChatMessage[]>([
    {
      id: 'msg-0',
      sender: 'assistant',
      text: initialGreeting,
      timestamp: new Date().toLocaleTimeString('en-IN', { hour: '2-digit', minute: '2-digit' }),
    },
  ]);

  // Update initial greeting when language changes if no conversation happened yet
  useEffect(() => {
    setMessages((prev) => {
      if (prev.length === 1 && prev[0].id === 'msg-0') {
        return [
          {
            id: 'msg-0',
            sender: 'assistant',
            text: initialGreeting,
            timestamp: prev[0].timestamp,
          },
        ];
      }
      return prev;
    });
  }, [language, initialGreeting]);

  useEffect(() => {
    if (isOpen) {
      messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
    }
  }, [messages, isOpen]);

  // Quick suggestion chips based on active route and language
  const suggestions = [
    {
      en: 'What documents are required for scholarship?',
      te: 'స్కాలర్‌షిప్‌కు ఏ పత్రాలు అవసరం?',
      hi: 'छात्रवृत्ति के लिए कौन से दस्तावेज चाहिए?',
    },
    {
      en: 'How to check my scheme eligibility?',
      te: 'నా అర్హతను ఎలా తనిఖీ చేయాలి?',
      hi: 'मेरी योजना पात्रता कैसे जांचें?',
    },
    {
      en: 'How do I track my submitted application?',
      te: 'నా దరఖాస్తు స్థితి ఎలా తెలుసుకోవాలి?',
      hi: 'मेरे आवेदन की स्थिति कैसे ट्रैक करें?',
    },
    {
      en: 'How many days does processing take?',
      te: 'దరఖాస్తు ఆమోదానికి ఎన్ని రోజులు పడుతుంది?',
      hi: 'प्रक्रिया पूरी होने में कितने दिन लगते हैं?',
    },
  ];

  const handleSendMessage = async (textToSend: string) => {
    if (!textToSend.trim()) return;

    const userMsg: ChatMessage = {
      id: `msg-${Date.now()}`,
      sender: 'user',
      text: textToSend.trim(),
      timestamp: new Date().toLocaleTimeString('en-IN', { hour: '2-digit', minute: '2-digit' }),
    };

    setMessages((prev) => [...prev, userMsg]);
    setInputText('');
    setIsTyping(true);

    const detected = detectAndSetLanguage(textToSend);
    const activeLang = detected || language;

    const context: AssistantContext = {
      currentRoute,
      selectedService,
      activeApplication,
      language: activeLang,
    };

    try {
      const response = await askAssistant(textToSend.trim(), context);

      const assistantMsg: ChatMessage = {
        id: `msg-${Date.now() + 1}`,
        sender: 'assistant',
        text: response.text,
        action: response.suggestedAction,
        timestamp: new Date().toLocaleTimeString('en-IN', { hour: '2-digit', minute: '2-digit' }),
      };

      setMessages((prev) => [...prev, assistantMsg]);
      setIsTyping(false);

      if (readAloudEnabled) {
        speak(response.text);
      }
    } catch (err) {
      console.error(err);
      setIsTyping(false);
    }
  };

  // Voice Speech Recognition with fallback
  const handleVoiceInput = () => {
    const SpeechRecognition =
      (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;

    if (!SpeechRecognition) {
      alert(
        language === 'te'
          ? 'మీ బ్రౌజర్‌లో వాయిస్ రికగ్నిషన్ సపోర్ట్ లేదు. దయచేసి టైప్ చేయండి.'
          : language === 'hi'
          ? 'आपके ब्राउज़र में वॉइस सपोर्ट उपलब्ध नहीं है। कृपया टाइप करें।'
          : 'Voice input not supported in this browser. Please type.'
      );
      return;
    }

    if (isListening) {
      setIsListening(false);
      return;
    }

    try {
      const recognition = new SpeechRecognition();
      recognition.continuous = false;
      recognition.interimResults = false;
      recognition.lang = language === 'te' ? 'te-IN' : language === 'hi' ? 'hi-IN' : 'en-IN';

      recognition.onstart = () => setIsListening(true);
      recognition.onresult = (e: any) => {
        const spoken = e.results[0][0].transcript;
        setInputText(spoken);
        handleSendMessage(spoken);
        setIsListening(false);
      };
      recognition.onerror = () => setIsListening(false);
      recognition.onend = () => setIsListening(false);
      recognition.start();
    } catch (err) {
      console.error(err);
      setIsListening(false);
    }
  };

  return (
    <>
      {/* Floating Action Button */}
      <button
        onClick={() => setIsOpen(!isOpen)}
        aria-expanded={isOpen}
        aria-label="Toggle SevaSaarthi AI Citizen Assistant"
        className={`fixed bottom-6 right-6 z-40 p-4 rounded-2xl shadow-2xl flex items-center gap-3 transition-all min-h-[56px] min-w-[56px] ${
          isOpen
            ? 'bg-slate-900 text-white hover:bg-slate-800'
            : 'bg-gradient-to-r from-emerald-600 to-teal-600 text-white hover:scale-105 shadow-emerald-500/30'
        }`}
      >
        {isOpen ? (
          <X className="w-6 h-6" />
        ) : (
          <>
            <Bot className="w-6 h-6 text-white" />
            <span className="hidden sm:inline-block font-extrabold text-xs pr-1">
              {language === 'te' ? 'AI సేవాసారథిని అడగండి' : language === 'hi' ? 'AI सेवासारथी से पूछें' : 'Ask AI SevaSaarthi'}
            </span>
            <span className="w-2.5 h-2.5 rounded-full bg-emerald-300 animate-ping" />
          </>
        )}
      </button>

      {/* Assistant Dialog Window */}
      {isOpen && (
        <div
          role="dialog"
          aria-label="SevaSaarthi AI Assistant"
          className="fixed bottom-24 right-4 sm:right-6 z-50 w-[calc(100vw-32px)] sm:w-96 max-h-[560px] h-[520px] bg-white rounded-3xl shadow-2xl border border-slate-200 flex flex-col overflow-hidden animate-slideUp"
        >
          {/* Header */}
          <div className="bg-slate-900 text-white p-4 flex items-center justify-between">
            <div className="flex items-center gap-2.5">
              <div className="w-8 h-8 rounded-xl bg-emerald-500 flex items-center justify-center text-white">
                <Bot className="w-5 h-5" />
              </div>
              <div>
                <h3 className="font-extrabold text-sm flex items-center gap-1.5">
                  <span>AI SevaSaarthi</span>
                </h3>
                <span className="text-[10px] text-slate-400 block">
                  {language === 'te' ? 'పౌర నావిగేటర్ సహాయకుడు' : language === 'hi' ? 'नागरिक सेवा नेविगेटर सहायक' : 'Simulated Civic Navigator Assistant'}
                </span>
              </div>
            </div>

            <div className="flex items-center gap-1">
              <button
                onClick={() => setIsOpen(false)}
                className="p-1.5 text-slate-400 hover:text-white rounded-lg transition-colors"
                aria-label="Minimize assistant"
              >
                <ChevronDown className="w-5 h-5" />
              </button>
            </div>
          </div>

          {/* Conversation Messages */}
          <div className="flex-1 overflow-y-auto p-4 space-y-3.5 bg-slate-50/60">
            {messages.map((m) => (
              <div
                key={m.id}
                className={`flex gap-2.5 ${m.sender === 'user' ? 'justify-end' : 'justify-start'}`}
              >
                {m.sender === 'assistant' && (
                  <div className="w-7 h-7 rounded-lg bg-emerald-100 text-emerald-800 flex items-center justify-center shrink-0 mt-0.5">
                    <Sparkles className="w-4 h-4" />
                  </div>
                )}

                <div
                  className={`max-w-[82%] rounded-2xl p-3.5 text-xs sm:text-sm space-y-2 shadow-sm ${
                    m.sender === 'user'
                      ? 'bg-emerald-600 text-white rounded-tr-none'
                      : 'bg-white text-slate-800 border border-slate-200 rounded-tl-none'
                  }`}
                >
                  <p className="leading-relaxed whitespace-pre-wrap">{m.text}</p>

                  {/* Read Aloud button for message */}
                  {m.sender === 'assistant' && (
                    <div className="flex items-center justify-between pt-1 border-t border-slate-100 text-[11px]">
                      <button
                        onClick={() => speak(m.text)}
                        className="inline-flex items-center gap-1 text-slate-500 hover:text-emerald-700 transition-colors"
                        title="Read aloud"
                      >
                        <Volume2 className="w-3.5 h-3.5" />
                        <span>{language === 'te' ? 'వినండి' : language === 'hi' ? 'सुनें' : 'Listen'}</span>
                      </button>
                      <span className="text-[10px] text-slate-400">{m.timestamp}</span>
                    </div>
                  )}

                  {/* Optional Action CTA */}
                  {m.action && (
                    <div className="pt-1">
                      <button
                        onClick={() => {
                          onNavigate(m.action!.route, m.action!.params);
                          setIsOpen(false);
                        }}
                        className="w-full py-2 px-3 rounded-xl bg-slate-900 hover:bg-slate-800 text-white font-bold text-xs flex items-center justify-center gap-1.5 transition-colors"
                      >
                        <span>{m.action.label}</span>
                        <ArrowRight className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  )}
                </div>

                {m.sender === 'user' && (
                  <div className="w-7 h-7 rounded-lg bg-slate-200 text-slate-700 flex items-center justify-center shrink-0 mt-0.5">
                    <User className="w-4 h-4" />
                  </div>
                )}
              </div>
            ))}

            {isTyping && (
              <div className="flex gap-2 items-center text-xs text-slate-400 italic pl-10">
                <span className="w-2 h-2 rounded-full bg-emerald-500 animate-bounce"></span>
                <span>{language === 'te' ? 'AI సేవాసారథి సమాధానం కనుగొంటోంది...' : language === 'hi' ? 'AI सेवासारथी उत्तर खोज रहा है...' : 'AI SevaSaarthi is finding answers...'}</span>
              </div>
            )}

            <div ref={messagesEndRef} />
          </div>

          {/* Quick Suggestion Chips */}
          <div className="p-2.5 bg-white border-t border-slate-100 flex items-center gap-1.5 overflow-x-auto scrollbar-none text-[11px]">
            {suggestions.map((s, idx) => {
              const text = s[language] || s.en;
              return (
                <button
                  key={idx}
                  onClick={() => handleSendMessage(text)}
                  className="px-2.5 py-1 rounded-lg bg-slate-100 hover:bg-emerald-50 hover:text-emerald-800 text-slate-700 border border-slate-200 shrink-0 max-w-[210px] truncate transition-colors text-left"
                >
                  {text}
                </button>
              );
            })}
          </div>

          {/* Input Footer */}
          <form
            onSubmit={(e) => {
              e.preventDefault();
              handleSendMessage(inputText);
            }}
            className="p-3 bg-white border-t border-slate-200 flex items-center gap-2"
          >
            <input
              type="text"
              value={inputText}
              onChange={(e) => setInputText(e.target.value)}
              placeholder={
                language === 'te'
                  ? 'ప్రశ్న టైప్ చేయండి లేదా అడగండి...'
                  : language === 'hi'
                  ? 'प्रश्न पूछें या लिखें...'
                  : 'Ask about schemes, eligibility, status...'
              }
              className="flex-1 px-3.5 py-2.5 text-xs sm:text-sm bg-slate-50 rounded-xl border border-slate-200 focus:border-emerald-500 focus:ring-2 focus:ring-emerald-500/20 text-slate-900"
            />

            {/* Mic Button */}
            <button
              type="button"
              onClick={handleVoiceInput}
              aria-label={isListening ? 'Listening...' : 'Voice search'}
              className={`p-2.5 rounded-xl transition-all min-h-[40px] min-w-[40px] flex items-center justify-center ${
                isListening
                  ? 'bg-rose-600 text-white animate-pulse'
                  : 'bg-slate-100 hover:bg-emerald-50 text-slate-700 hover:text-emerald-700'
              }`}
            >
              {isListening ? <MicOff className="w-4 h-4" /> : <Mic className="w-4 h-4" />}
            </button>

            {/* Send Button */}
            <button
              type="submit"
              disabled={!inputText.trim()}
              aria-label="Send message"
              className="p-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-700 disabled:bg-slate-200 disabled:text-slate-400 text-white transition-colors min-h-[40px] min-w-[40px] flex items-center justify-center"
            >
              <Send className="w-4 h-4" />
            </button>
          </form>
        </div>
      )}
    </>
  );
};
