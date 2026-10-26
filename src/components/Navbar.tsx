import React from 'react';
import { COMPANY_INFO } from '../data/defaultData';
import { PWAInstallButton } from './PWAInstallButton';
import {
  Sun,
  Phone,
  Mail,
  FileText,
  Database,
  Calculator,
  Sparkles,
} from 'lucide-react';

interface NavbarProps {
  activeTab: 'calculator' | 'load-audit' | 'survey' | 'submissions' | 'about' | 'ai-advisor' | 'tools';
  setActiveTab: (tab: any) => void;
  submissionsCount: number;
}

export const Navbar: React.FC<NavbarProps> = ({ activeTab, setActiveTab, submissionsCount }) => {
  return (
    <header className="sticky top-0 z-40 bg-white/95 backdrop-blur-md border-b border-neutral-200 shadow-xs">
      {/* Top Bar Contract: 3 zones separated by gap-8 */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-20 flex items-center justify-between gap-8">
        {/* Zone 1: Brand Wordmark with Logo */}
        <div className="flex items-center gap-3 shrink-0">
          <a
            href="#"
            onClick={(e) => {
              e.preventDefault();
              setActiveTab('calculator');
            }}
            className="flex items-center gap-3 group"
          >
            <img
              src={COMPANY_INFO.appLogo}
              alt="Unicorn Energy Logo"
              className="h-11 w-auto object-contain transition-transform group-hover:scale-105"
              onError={(e) => {
                (e.target as HTMLElement).style.display = 'none';
              }}
            />
            <div className="flex flex-col">
              <span className="text-xl font-extrabold tracking-tight text-emerald-900 leading-tight">
                Unicorn <span className="text-amber-500 font-bold">Energy</span>
              </span>
              <span className="text-[11px] font-medium text-neutral-500 tracking-wider uppercase">
                Calculator & Site Survey
              </span>
            </div>
          </a>
        </div>

        {/* Zone 2: Concise single-line navigation links */}
        <nav className="hidden md:flex items-center gap-6 text-sm font-semibold text-neutral-600">
          <button
            onClick={() => setActiveTab('calculator')}
            className={`flex items-center gap-1.5 py-1 transition-colors whitespace-nowrap shrink-0 ${
              activeTab === 'calculator'
                ? 'text-emerald-700 border-b-2 border-emerald-600'
                : 'hover:text-emerald-800'
            }`}
          >
            <Calculator className="w-4 h-4 text-emerald-600" />
            Solar Sizing
          </button>

          <button
            onClick={() => setActiveTab('load-audit')}
            className={`flex items-center gap-1.5 py-1 transition-colors whitespace-nowrap shrink-0 ${
              activeTab === 'load-audit'
                ? 'text-emerald-700 border-b-2 border-emerald-600'
                : 'hover:text-emerald-800'
            }`}
          >
            <Sun className="w-4 h-4 text-amber-500" />
            Appliance Audit
          </button>

          <button
            onClick={() => setActiveTab('ai-advisor')}
            className={`flex items-center gap-1.5 py-1 transition-colors whitespace-nowrap shrink-0 relative ${
              activeTab === 'ai-advisor'
                ? 'text-emerald-700 border-b-2 border-emerald-600'
                : 'hover:text-emerald-800'
            }`}
          >
            <Sparkles className="w-4 h-4 text-amber-500" />
            <span>AI Advisor</span>
            <span className="px-1.5 py-0.2 bg-amber-100 text-amber-800 text-[9px] font-bold rounded">
              AI
            </span>
          </button>

          <button
            onClick={() => setActiveTab('survey')}
            className={`flex items-center gap-1.5 py-1 transition-colors whitespace-nowrap shrink-0 ${
              activeTab === 'survey'
                ? 'text-emerald-700 border-b-2 border-emerald-600'
                : 'hover:text-emerald-800'
            }`}
          >
            <FileText className="w-4 h-4 text-emerald-600" />
            Survey Form
          </button>

          <button
            onClick={() => setActiveTab('submissions')}
            className={`flex items-center gap-1.5 py-1 transition-colors whitespace-nowrap shrink-0 relative ${
              activeTab === 'submissions'
                ? 'text-emerald-700 border-b-2 border-emerald-600'
                : 'hover:text-emerald-800'
            }`}
          >
            <Database className="w-4 h-4 text-neutral-500" />
            Surveys Log
            {submissionsCount > 0 && (
              <span className="ml-1 px-1.5 py-0.5 text-[10px] font-bold bg-emerald-100 text-emerald-800 rounded-sm">
                {submissionsCount}
              </span>
            )}
          </button>

          <button
            onClick={() => setActiveTab('tools')}
            className={`py-1 transition-colors whitespace-nowrap shrink-0 ${
              activeTab === 'tools'
                ? 'text-emerald-700 border-b-2 border-emerald-600'
                : 'hover:text-emerald-800'
            }`}
          >
            Field Tools (GPS)
          </button>

          <button
            onClick={() => setActiveTab('about')}
            className={`py-1 transition-colors whitespace-nowrap shrink-0 ${
              activeTab === 'about'
                ? 'text-emerald-700 border-b-2 border-emerald-600'
                : 'hover:text-emerald-800'
            }`}
          >
            About Unicorn Group
          </button>
        </nav>

        {/* Zone 3: 1 primary action + PWA install */}
        <div className="flex items-center gap-2.5 shrink-0">
          <PWAInstallButton />

          <button
            onClick={() => setActiveTab('survey')}
            className="px-4 py-2.5 text-xs font-bold text-white bg-emerald-800 hover:bg-emerald-900 active:bg-emerald-950 rounded-lg shadow-sm transition-all whitespace-nowrap shrink-0 flex items-center gap-2 cursor-pointer"
          >
            <FileText className="w-4 h-4 text-emerald-300" />
            <span>Submit Survey</span>
          </button>
        </div>
      </div>
    </header>
  );
};
