import React, { useState } from 'react';
import { SolarCalculationResult, SolarInputState } from '../types/solar';
import { COMPANY_INFO } from '../data/defaultData';
import {
  Sparkles,
  Send,
  Bot,
  User,
  ShieldCheck,
  CheckCircle2,
  AlertTriangle,
  Lightbulb,
  RefreshCw,
  Zap,
} from 'lucide-react';

interface AISolarAdvisorProps {
  inputState: SolarInputState;
  calculation: SolarCalculationResult;
}

interface ChatMessage {
  id: string;
  sender: 'user' | 'ai';
  text: string;
  timestamp: string;
}

export const AISolarAdvisor: React.FC<AISolarAdvisorProps> = ({
  inputState,
  calculation,
}) => {
  // Feasibility state
  const [feasibilityReport, setFeasibilityReport] = useState<string | null>(null);
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [feasibilityError, setFeasibilityError] = useState<string | null>(null);

  // Chat state
  const [messages, setMessages] = useState<ChatMessage[]>([
    {
      id: 'init-1',
      sender: 'ai',
      text: `Hello! I am Unicorn Solar AI, your engineering assistant powered by Unicorn Group. I have reviewed your ${calculation.actualArrayKw} kWp ${inputState.systemType.toUpperCase()} design for ${inputState.selectedLocation}. How can I assist you with site engineering, net-metering approvals, or equipment selection?`,
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
    },
  ]);
  const [inputMessage, setInputMessage] = useState('');
  const [isSending, setIsSending] = useState(false);

  // Quick prompt suggestions
  const quickPrompts = [
    'How do I apply for Net Metering with DESCO/DPDC?',
    'Should I pick LiFePO4 or Tubular GEL batteries for load shedding?',
    'What is the optimal solar panel tilt angle in Dhaka?',
    'Will this system power my 1.5 Ton Inverter AC during power outage?',
  ];

  // Run full feasibility audit
  const runFeasibilityAudit = async () => {
    setIsAnalyzing(true);
    setFeasibilityError(null);

    try {
      const res = await fetch('/api/ai/site-feasibility', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          siteData: {
            cityDistrict: inputState.selectedLocation,
            systemType: inputState.systemType,
            propertyType: 'commercial',
            electricityProvider: 'DPDC / DESCO / BREB',
            roofType: 'rcc_flat',
            shadowCondition: 'unobstructed',
          },
          calculationData: calculation,
        }),
      });

      if (!res.ok) {
        throw new Error(`Server returned HTTP ${res.status}`);
      }

      const data = await res.json();
      if (data.analysis) {
        setFeasibilityReport(data.analysis);
      } else {
        throw new Error(data.error || 'Empty response from AI engine');
      }
    } catch (err: any) {
      console.error('Feasibility audit error:', err);
      setFeasibilityError(
        'Unable to complete AI audit. Ensure your connection is active or try again.'
      );
    } finally {
      setIsAnalyzing(false);
    }
  };

  // Send chat message
  const handleSendMessage = async (msgToSend?: string) => {
    const text = (msgToSend || inputMessage).trim();
    if (!text || isSending) return;

    const userMsg: ChatMessage = {
      id: `usr-${Date.now()}`,
      sender: 'user',
      text,
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
    };

    setMessages((prev) => [...prev, userMsg]);
    setInputMessage('');
    setIsSending(true);

    try {
      const res = await fetch('/api/ai/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          message: text,
          context: {
            systemSizeKw: calculation.actualArrayKw,
            systemType: inputState.systemType,
            panelCount: calculation.panelCount,
            inverterKw: calculation.recommendedInverterKw,
            batteryStorageKwh: calculation.batteryCapacityKwh,
            location: inputState.selectedLocation,
            monthlyBill: inputState.monthlyBill,
          },
        }),
      });

      const data = await res.json();
      const aiReplyText = data.reply || 'Thank you for your question. Please contact our engineering team directly at +8801335106960 for detailed site consultation.';

      const aiMsg: ChatMessage = {
        id: `ai-${Date.now()}`,
        sender: 'ai',
        text: aiReplyText,
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      };

      setMessages((prev) => [...prev, aiMsg]);
    } catch (err) {
      console.error('Chat error:', err);
      const errorMsg: ChatMessage = {
        id: `err-${Date.now()}`,
        sender: 'ai',
        text: 'I am experiencing a temporary connection hiccup. For immediate support, you can call or WhatsApp our engineers at +8801335106960.',
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      };
      setMessages((prev) => [...prev, errorMsg]);
    } finally {
      setIsSending(false);
    }
  };

  return (
    <div className="space-y-8">
      {/* 1. Automated Feasibility Audit Card */}
      <div className="bg-white rounded-2xl border border-neutral-200 shadow-xs p-6 md:p-8">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 pb-6 border-b border-neutral-200">
          <div>
            <div className="flex items-center gap-2 text-xs font-semibold text-emerald-800 uppercase tracking-wider mb-1">
              <Sparkles className="w-3.5 h-3.5 text-amber-500" />
              <span>Gemini 3.8 Intelligence Engine</span>
              <span className="text-neutral-300">·</span>
              <span>Bangladesh Solar PV Standards</span>
            </div>
            <h2 className="text-2xl font-bold text-neutral-900">
              AI Site Feasibility & Engineering Audit
            </h2>
            <p className="text-sm text-neutral-600 mt-1">
              Autonomous engineering assessment of structural tilt, net-metering compliance, and BOS safety tailored to your {calculation.actualArrayKw} kWp system in {inputState.selectedLocation}.
            </p>
          </div>

          <button
            onClick={runFeasibilityAudit}
            disabled={isAnalyzing}
            className="px-5 py-2.5 text-xs font-bold text-white bg-emerald-800 hover:bg-emerald-900 active:bg-emerald-950 rounded-lg shadow-sm transition-all flex items-center gap-2 cursor-pointer disabled:opacity-50 shrink-0"
          >
            {isAnalyzing ? (
              <>
                <RefreshCw className="w-4 h-4 animate-spin text-emerald-300" />
                <span>Analyzing Site Parameters...</span>
              </>
            ) : (
              <>
                <Sparkles className="w-4 h-4 text-amber-400" />
                <span>{feasibilityReport ? 'Re-Run AI Audit' : 'Generate AI Feasibility Audit'}</span>
              </>
            )}
          </button>
        </div>

        {/* Current system parameters strip */}
        <div className="my-5 p-4 bg-neutral-50 rounded-xl border border-neutral-200 grid grid-cols-2 sm:grid-cols-4 gap-3 text-xs">
          <div>
            <span className="text-neutral-500 block text-[11px]">Array Sizing</span>
            <strong className="text-neutral-900 font-mono text-sm">{calculation.actualArrayKw} kWp</strong>
          </div>
          <div>
            <span className="text-neutral-500 block text-[11px]">System Type</span>
            <strong className="text-emerald-800 uppercase">{inputState.systemType}</strong>
          </div>
          <div>
            <span className="text-neutral-500 block text-[11px]">Solar Zone</span>
            <strong className="text-neutral-900">{inputState.selectedLocation} ({inputState.peakSunHours} hrs)</strong>
          </div>
          <div>
            <span className="text-neutral-500 block text-[11px]">Inverter Spec</span>
            <strong className="text-neutral-900 font-mono">{calculation.recommendedInverterKw} kW ({calculation.inverterPhase})</strong>
          </div>
        </div>

        {feasibilityError && (
          <div className="p-4 bg-rose-50 border border-rose-200 rounded-xl text-rose-800 text-xs font-semibold flex items-center gap-2 mb-4">
            <AlertTriangle className="w-4 h-4 shrink-0" />
            <span>{feasibilityError}</span>
          </div>
        )}

        {/* AI Report Content Display */}
        {feasibilityReport ? (
          <div className="mt-6 p-6 bg-emerald-950 text-emerald-50 rounded-xl border border-emerald-900 shadow-inner">
            <div className="flex items-center justify-between pb-3 border-b border-emerald-800/80 mb-4 text-xs font-bold text-emerald-300">
              <span className="flex items-center gap-1.5">
                <ShieldCheck className="w-4 h-4 text-emerald-400" />
                OFFICIAL UNICORN ENERGY AI AUDIT REPORT
              </span>
              <span className="font-mono text-[10px] text-emerald-400">
                {new Date().toLocaleDateString('en-GB')}
              </span>
            </div>
            <div className="prose prose-invert max-w-none text-xs sm:text-sm leading-relaxed whitespace-pre-line font-sans">
              {feasibilityReport}
            </div>
          </div>
        ) : (
          !isAnalyzing && (
            <div className="py-8 text-center text-neutral-500 border border-dashed border-neutral-200 rounded-xl">
              <Sparkles className="w-8 h-8 text-amber-500/60 mx-auto mb-2" />
              <p className="text-sm font-semibold text-neutral-700">No AI audit generated yet</p>
              <p className="text-xs text-neutral-400 mt-1 max-w-md mx-auto">
                Click "Generate AI Feasibility Audit" to have Gemini analyze tilt angle, wind cyclone ratings, net-metering policies, and electrical safety for this system.
              </p>
            </div>
          )
        )}
      </div>

      {/* 2. Interactive Solar Engineer Chat */}
      <div className="bg-white rounded-2xl border border-neutral-200 shadow-xs p-6 md:p-8 flex flex-col h-[560px]">
        {/* Header */}
        <div className="pb-4 border-b border-neutral-200 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-emerald-800 text-white flex items-center justify-center font-bold">
              <Bot className="w-6 h-6" />
            </div>
            <div>
              <h3 className="text-base font-bold text-neutral-900">
                Unicorn Solar AI Engineering Consultant
              </h3>
              <p className="text-xs text-neutral-500">
                Direct guidance for Bangladesh solar projects, batteries & net-metering.
              </p>
            </div>
          </div>

          <div className="hidden sm:flex items-center gap-1.5 text-xs text-neutral-500 font-mono">
            <span className="w-2 h-2 rounded-full bg-emerald-500"></span>
            <span>Online</span>
          </div>
        </div>

        {/* Chat message stream */}
        <div className="flex-1 overflow-y-auto py-4 space-y-4 pr-1">
          {messages.map((m) => (
            <div
              key={m.id}
              className={`flex items-start gap-2.5 ${
                m.sender === 'user' ? 'flex-row-reverse' : 'flex-row'
              }`}
            >
              <div
                className={`w-7 h-7 rounded-full flex items-center justify-center text-xs shrink-0 ${
                  m.sender === 'user'
                    ? 'bg-neutral-800 text-white'
                    : 'bg-emerald-800 text-white'
                }`}
              >
                {m.sender === 'user' ? <User className="w-4 h-4" /> : <Bot className="w-4 h-4" />}
              </div>

              <div
                className={`max-w-[80%] rounded-2xl px-4 py-3 text-xs sm:text-sm leading-relaxed shadow-xs ${
                  m.sender === 'user'
                    ? 'bg-neutral-900 text-white rounded-tr-none'
                    : 'bg-neutral-100 text-neutral-900 rounded-tl-none border border-neutral-200'
                }`}
              >
                <div className="whitespace-pre-line">{m.text}</div>
                <div
                  className={`text-[10px] mt-1.5 text-right font-mono ${
                    m.sender === 'user' ? 'text-neutral-400' : 'text-neutral-500'
                  }`}
                >
                  {m.timestamp}
                </div>
              </div>
            </div>
          ))}

          {isSending && (
            <div className="flex items-center gap-2 text-xs text-neutral-500 p-2">
              <RefreshCw className="w-3.5 h-3.5 animate-spin text-emerald-700" />
              <span>Unicorn Solar AI is analyzing...</span>
            </div>
          )}
        </div>

        {/* Quick prompt suggestions */}
        <div className="pt-2 pb-3 overflow-x-auto flex items-center gap-1.5 no-scrollbar">
          {quickPrompts.map((p, idx) => (
            <button
              key={idx}
              onClick={() => handleSendMessage(p)}
              disabled={isSending}
              className="text-[11px] font-medium text-neutral-700 bg-neutral-100 hover:bg-neutral-200 active:bg-neutral-300 rounded-full px-3 py-1 whitespace-nowrap transition-colors border border-neutral-200 cursor-pointer disabled:opacity-50"
            >
              {p}
            </button>
          ))}
        </div>

        {/* Chat input box */}
        <div className="pt-2 border-t border-neutral-200">
          <form
            onSubmit={(e) => {
              e.preventDefault();
              handleSendMessage();
            }}
            className="flex items-center gap-2"
          >
            <input
              type="text"
              placeholder="Ask about inverters, battery duration, DESCO/DPDC net metering, roof load..."
              value={inputMessage}
              onChange={(e) => setInputMessage(e.target.value)}
              disabled={isSending}
              className="flex-1 px-4 py-2.5 bg-neutral-50 border border-neutral-300 rounded-xl text-xs sm:text-sm text-neutral-900 focus:outline-none focus:ring-2 focus:ring-emerald-700 disabled:opacity-50"
            />
            <button
              type="submit"
              disabled={isSending || !inputMessage.trim()}
              className="px-4 py-2.5 text-xs font-bold text-white bg-emerald-800 hover:bg-emerald-900 rounded-xl transition-colors flex items-center gap-1.5 cursor-pointer disabled:opacity-50 shadow-xs"
            >
              <Send className="w-4 h-4" />
              <span className="hidden sm:inline">Send</span>
            </button>
          </form>
        </div>
      </div>
    </div>
  );
};
