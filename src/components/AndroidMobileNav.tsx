import React from 'react';
import {
  Calculator,
  Sun,
  FileText,
  Database,
  Sparkles,
  Compass,
  Wrench,
} from 'lucide-react';

interface AndroidMobileNavProps {
  activeTab: 'calculator' | 'load-audit' | 'survey' | 'submissions' | 'about' | 'ai-advisor' | 'tools';
  setActiveTab: (tab: any) => void;
  submissionsCount: number;
}

export const AndroidMobileNav: React.FC<AndroidMobileNavProps> = ({
  activeTab,
  setActiveTab,
  submissionsCount,
}) => {
  const handleTabClick = (tab: any) => {
    // Tactile haptic feedback on Android and supporting mobile devices
    if (typeof navigator !== 'undefined' && navigator.vibrate) {
      try {
        navigator.vibrate(10);
      } catch {
        // ignore if permissions or hardware lack support
      }
    }
    setActiveTab(tab);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <nav className="md:hidden fixed bottom-0 left-0 right-0 z-40 bg-white/95 backdrop-blur-md border-t border-neutral-200/80 px-1 pt-1 safe-area-bottom shadow-lg no-print">
      <div className="flex items-center justify-around max-w-md mx-auto">
        {/* 1. Sizing Tab */}
        <button
          onClick={() => handleTabClick('calculator')}
          className={`flex-1 flex flex-col items-center justify-center py-1.5 px-1 min-h-[50px] rounded-xl transition-all duration-150 ${
            activeTab === 'calculator'
              ? 'text-emerald-800 font-extrabold bg-emerald-50/80'
              : 'text-neutral-500 hover:text-neutral-900 active:bg-neutral-100'
          }`}
        >
          <Calculator className={`w-5 h-5 ${activeTab === 'calculator' ? 'stroke-[2.5]' : ''}`} />
          <span className="text-[10px] mt-0.5 tracking-tight font-medium">Sizing</span>
        </button>

        {/* 2. Load Audit Tab */}
        <button
          onClick={() => handleTabClick('load-audit')}
          className={`flex-1 flex flex-col items-center justify-center py-1.5 px-1 min-h-[50px] rounded-xl transition-all duration-150 ${
            activeTab === 'load-audit'
              ? 'text-emerald-800 font-extrabold bg-emerald-50/80'
              : 'text-neutral-500 hover:text-neutral-900 active:bg-neutral-100'
          }`}
        >
          <Sun className={`w-5 h-5 ${activeTab === 'load-audit' ? 'text-amber-500 stroke-[2.5]' : ''}`} />
          <span className="text-[10px] mt-0.5 tracking-tight font-medium">Audit</span>
        </button>

        {/* 3. Survey Tab */}
        <button
          onClick={() => handleTabClick('survey')}
          className={`flex-1 flex flex-col items-center justify-center py-1.5 px-1 min-h-[50px] rounded-xl transition-all duration-150 ${
            activeTab === 'survey'
              ? 'text-emerald-800 font-extrabold bg-emerald-50/80'
              : 'text-neutral-500 hover:text-neutral-900 active:bg-neutral-100'
          }`}
        >
          <FileText className={`w-5 h-5 ${activeTab === 'survey' ? 'stroke-[2.5]' : ''}`} />
          <span className="text-[10px] mt-0.5 tracking-tight font-medium">Survey</span>
        </button>

        {/* 4. AI Advisor */}
        <button
          onClick={() => handleTabClick('ai-advisor')}
          className={`flex-1 flex flex-col items-center justify-center py-1.5 px-1 min-h-[50px] rounded-xl transition-all duration-150 relative ${
            activeTab === 'ai-advisor'
              ? 'text-emerald-800 font-extrabold bg-emerald-50/80'
              : 'text-neutral-500 hover:text-neutral-900 active:bg-neutral-100'
          }`}
        >
          <div className="relative">
            <Sparkles className={`w-5 h-5 ${activeTab === 'ai-advisor' ? 'text-emerald-700 stroke-[2.5]' : 'text-amber-500'}`} />
            <span className="absolute -top-1 -right-1 w-2 h-2 rounded-full bg-amber-400"></span>
          </div>
          <span className="text-[10px] mt-0.5 tracking-tight font-medium">Advisor</span>
        </button>

        {/* 5. Mobile Field Tools */}
        <button
          onClick={() => handleTabClick('tools')}
          className={`flex-1 flex flex-col items-center justify-center py-1.5 px-1 min-h-[50px] rounded-xl transition-all duration-150 relative ${
            activeTab === 'tools'
              ? 'text-emerald-800 font-extrabold bg-emerald-50/80'
              : 'text-neutral-500 hover:text-neutral-900 active:bg-neutral-100'
          }`}
        >
          <Compass className={`w-5 h-5 ${activeTab === 'tools' ? 'text-blue-700 stroke-[2.5]' : ''}`} />
          <span className="text-[10px] mt-0.5 tracking-tight font-medium">Tools</span>
        </button>

        {/* 6. Surveys Log */}
        <button
          onClick={() => handleTabClick('submissions')}
          className={`flex-1 flex flex-col items-center justify-center py-1.5 px-1 min-h-[50px] rounded-xl transition-all duration-150 relative ${
            activeTab === 'submissions'
              ? 'text-emerald-800 font-extrabold bg-emerald-50/80'
              : 'text-neutral-500 hover:text-neutral-900 active:bg-neutral-100'
          }`}
        >
          <Database className={`w-5 h-5 ${activeTab === 'submissions' ? 'stroke-[2.5]' : ''}`} />
          <span className="text-[10px] mt-0.5 tracking-tight font-medium">Log</span>
          {submissionsCount > 0 && (
            <span className="absolute top-1 right-2 px-1 text-[9px] font-bold bg-emerald-800 text-white rounded-full">
              {submissionsCount}
            </span>
          )}
        </button>
      </div>
    </nav>
  );
};
