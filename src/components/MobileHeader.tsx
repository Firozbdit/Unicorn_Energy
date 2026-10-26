import React, { useState } from 'react';
import { COMPANY_INFO } from '../data/defaultData';
import { PWAInstallButton } from './PWAInstallButton';
import { usePWAInstall } from '../hooks/usePWAInstall';
import {
  Phone,
  Menu,
  X,
  Zap,
  MapPin,
  Mail,
  Shield,
  FileSpreadsheet,
  Download,
  Info,
  CheckCircle2,
  ExternalLink,
} from 'lucide-react';

interface MobileHeaderProps {
  activeTab: 'calculator' | 'load-audit' | 'survey' | 'submissions' | 'about' | 'ai-advisor' | 'tools';
  setActiveTab: (tab: any) => void;
  submissionsCount: number;
  isOnline: boolean;
  systemKw?: number;
}

export const MobileHeader: React.FC<MobileHeaderProps> = ({
  activeTab,
  setActiveTab,
  submissionsCount,
  isOnline,
  systemKw = 0,
}) => {
  const [drawerOpen, setDrawerOpen] = useState(false);
  const { isInstalled } = usePWAInstall();

  const handleNav = (tab: any) => {
    setActiveTab(tab);
    setDrawerOpen(false);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <>
      <div className="md:hidden sticky top-0 z-40 bg-emerald-950 text-white border-b border-emerald-900/60 shadow-md">
        <div className="px-3.5 py-2.5 flex items-center justify-between gap-2 safe-area-top">
          {/* Brand & Mini Info */}
          <div className="flex items-center gap-2.5 min-w-0">
            <button
              onClick={() => handleNav('calculator')}
              className="flex items-center gap-2 text-left focus:outline-none"
            >
              <div className="w-8 h-8 rounded-lg bg-emerald-800 flex items-center justify-center p-1 border border-emerald-600/50 shadow-xs shrink-0">
                <img
                  src={COMPANY_INFO.appLogo}
                  alt="Unicorn"
                  className="w-full h-full object-contain"
                  onError={(e) => {
                    (e.target as HTMLElement).style.display = 'none';
                  }}
                />
              </div>
              <div className="truncate">
                <div className="flex items-center gap-1.5">
                  <span className="font-extrabold text-sm tracking-tight text-white leading-none">
                    Unicorn <span className="text-amber-400 font-bold">Solar</span>
                  </span>
                  <span
                    className={`inline-block w-1.5 h-1.5 rounded-full ${
                      isOnline ? 'bg-emerald-400' : 'bg-amber-400 animate-pulse'
                    }`}
                    title={isOnline ? 'Online' : 'Offline Mode'}
                  />
                </div>
                <div className="text-[10px] text-emerald-200/80 font-medium tracking-tight mt-0.5 truncate">
                  {systemKw > 0 ? `${systemKw.toFixed(1)} kWp Sizing` : 'Solar Sizing & Survey'}
                </div>
              </div>
            </button>
          </div>

          {/* Quick Actions Right */}
          <div className="flex items-center gap-1.5 shrink-0">
            {/* In-App Install shortcut on header */}
            <PWAInstallButton />

            {/* Direct Quick Dial to Engineering hotline */}
            <a
              href={`tel:${COMPANY_INFO.phone}`}
              className="w-8 h-8 rounded-lg bg-emerald-900/80 hover:bg-emerald-800 active:bg-emerald-700 flex items-center justify-center text-emerald-200 border border-emerald-700/50 transition-colors"
              title="Call Solar Engineer"
            >
              <Phone className="w-3.5 h-3.5" />
            </a>

            {/* Mobile Drawer Hamburger */}
            <button
              onClick={() => setDrawerOpen(true)}
              className="w-8 h-8 rounded-lg bg-emerald-900/80 hover:bg-emerald-800 active:bg-emerald-700 flex items-center justify-center text-white border border-emerald-700/50 transition-colors"
              aria-label="Open Mobile Menu"
            >
              <Menu className="w-4 h-4" />
            </button>
          </div>
        </div>
      </div>

      {/* Slide-out Mobile Sheet Drawer */}
      {drawerOpen && (
        <div className="fixed inset-0 z-50 flex md:hidden">
          {/* Backdrop */}
          <div
            className="fixed inset-0 bg-black/60 backdrop-blur-xs transition-opacity"
            onClick={() => setDrawerOpen(false)}
          />

          {/* Drawer content */}
          <div className="relative w-4/5 max-w-xs bg-neutral-900 text-neutral-100 h-full flex flex-col shadow-2xl safe-area-top safe-area-bottom z-10">
            {/* Header */}
            <div className="p-4 border-b border-neutral-800 flex items-center justify-between bg-emerald-950">
              <div className="flex items-center gap-2.5">
                <div className="w-9 h-9 rounded-xl bg-emerald-800/80 border border-emerald-600/40 p-1 flex items-center justify-center">
                  <img
                    src={COMPANY_INFO.appLogo}
                    alt="Logo"
                    className="w-full h-full object-contain"
                  />
                </div>
                <div>
                  <h3 className="font-extrabold text-sm text-white leading-tight">
                    Unicorn <span className="text-amber-400">Energy</span>
                  </h3>
                  <p className="text-[10px] text-emerald-300">
                    Solar Mobile App v2.4
                  </p>
                </div>
              </div>
              <button
                onClick={() => setDrawerOpen(false)}
                className="p-1 rounded-lg text-neutral-400 hover:text-white hover:bg-neutral-800"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Quick status bar */}
            <div className="px-4 py-2.5 bg-neutral-800/60 border-b border-neutral-800 flex items-center justify-between text-xs text-neutral-400">
              <span className="flex items-center gap-1.5">
                <span
                  className={`w-2 h-2 rounded-full ${
                    isOnline ? 'bg-emerald-400' : 'bg-amber-400 animate-pulse'
                  }`}
                />
                {isOnline ? 'Network Connected' : 'Offline Mode (Local Storage)'}
              </span>
              {isInstalled && (
                <span className="flex items-center gap-1 text-[11px] text-emerald-400 font-semibold">
                  <CheckCircle2 className="w-3 h-3" /> Installed
                </span>
              )}
            </div>

            {/* Navigation links */}
            <div className="flex-1 overflow-y-auto p-3 space-y-1 text-sm">
              <div className="px-2 py-1 text-[10px] font-bold uppercase tracking-wider text-neutral-500">
                Core Solar Engine
              </div>

              <button
                onClick={() => handleNav('calculator')}
                className={`w-full flex items-center justify-between px-3 py-2.5 rounded-xl font-medium transition-colors ${
                  activeTab === 'calculator'
                    ? 'bg-emerald-800/50 text-emerald-300 border border-emerald-700/60'
                    : 'text-neutral-300 hover:bg-neutral-800/70'
                }`}
              >
                <span className="flex items-center gap-2.5">
                  <Zap className="w-4 h-4 text-emerald-400" />
                  Solar PV Sizing Engine
                </span>
              </button>

              <button
                onClick={() => handleNav('load-audit')}
                className={`w-full flex items-center justify-between px-3 py-2.5 rounded-xl font-medium transition-colors ${
                  activeTab === 'load-audit'
                    ? 'bg-emerald-800/50 text-emerald-300 border border-emerald-700/60'
                    : 'text-neutral-300 hover:bg-neutral-800/70'
                }`}
              >
                <span className="flex items-center gap-2.5">
                  <FileSpreadsheet className="w-4 h-4 text-amber-400" />
                  Appliance Load Audit
                </span>
              </button>

              <button
                onClick={() => handleNav('survey')}
                className={`w-full flex items-center justify-between px-3 py-2.5 rounded-xl font-medium transition-colors ${
                  activeTab === 'survey'
                    ? 'bg-emerald-800/50 text-emerald-300 border border-emerald-700/60'
                    : 'text-neutral-300 hover:bg-neutral-800/70'
                }`}
              >
                <span className="flex items-center gap-2.5">
                  <MapPin className="w-4 h-4 text-emerald-400" />
                  Field Survey & GPS Form
                </span>
              </button>

              <button
                onClick={() => handleNav('ai-advisor')}
                className={`w-full flex items-center justify-between px-3 py-2.5 rounded-xl font-medium transition-colors ${
                  activeTab === 'ai-advisor'
                    ? 'bg-emerald-800/50 text-emerald-300 border border-emerald-700/60'
                    : 'text-neutral-300 hover:bg-neutral-800/70'
                }`}
              >
                <span className="flex items-center gap-2.5">
                  <Shield className="w-4 h-4 text-amber-400" />
                  AI Solar Feasibility Advisor
                </span>
              </button>

              <div className="pt-2 px-2 text-[10px] font-bold uppercase tracking-wider text-neutral-500">
                Field Toolkit & Reports
              </div>

              <button
                onClick={() => handleNav('tools')}
                className={`w-full flex items-center justify-between px-3 py-2.5 rounded-xl font-medium transition-colors ${
                  activeTab === 'tools'
                    ? 'bg-emerald-800/50 text-emerald-300 border border-emerald-700/60'
                    : 'text-neutral-300 hover:bg-neutral-800/70'
                }`}
              >
                <span className="flex items-center gap-2.5">
                  <Download className="w-4 h-4 text-blue-400" />
                  Field Tools (GPS, Compass, Sync)
                </span>
              </button>

              <button
                onClick={() => handleNav('submissions')}
                className={`w-full flex items-center justify-between px-3 py-2.5 rounded-xl font-medium transition-colors ${
                  activeTab === 'submissions'
                    ? 'bg-emerald-800/50 text-emerald-300 border border-emerald-700/60'
                    : 'text-neutral-300 hover:bg-neutral-800/70'
                }`}
              >
                <span className="flex items-center gap-2.5">
                  <FileSpreadsheet className="w-4 h-4 text-neutral-400" />
                  Surveys Log & Export
                </span>
                {submissionsCount > 0 && (
                  <span className="px-1.5 py-0.5 text-[10px] font-bold bg-emerald-700 text-white rounded-md">
                    {submissionsCount}
                  </span>
                )}
              </button>

              <button
                onClick={() => handleNav('about')}
                className={`w-full flex items-center justify-between px-3 py-2.5 rounded-xl font-medium transition-colors ${
                  activeTab === 'about'
                    ? 'bg-emerald-800/50 text-emerald-300 border border-emerald-700/60'
                    : 'text-neutral-300 hover:bg-neutral-800/70'
                }`}
              >
                <span className="flex items-center gap-2.5">
                  <Info className="w-4 h-4 text-neutral-400" />
                  About Unicorn Group BD
                </span>
              </button>
            </div>

            {/* Direct Engineering hotline footer */}
            <div className="p-4 border-t border-neutral-800 bg-neutral-950/80 space-y-2">
              <div className="text-[11px] text-neutral-400">Engineering Hotline:</div>
              <a
                href={`tel:${COMPANY_INFO.phone}`}
                className="flex items-center gap-2 px-3 py-2 rounded-lg bg-emerald-900/60 hover:bg-emerald-800 text-emerald-300 text-xs font-bold transition-colors"
              >
                <Phone className="w-3.5 h-3.5" />
                <span>+880 1335-106960</span>
              </a>
              <a
                href="mailto:pialtp4@gmail.com"
                className="flex items-center gap-2 px-3 py-1.5 text-neutral-400 hover:text-white text-xs transition-colors"
              >
                <Mail className="w-3.5 h-3.5" />
                <span>pialtp4@gmail.com</span>
              </a>
            </div>
          </div>
        </div>
      )}
    </>
  );
};
