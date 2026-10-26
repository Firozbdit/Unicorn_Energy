import React from 'react';
import { COMPANY_INFO } from '../data/defaultData';
import { Mail, Phone, MapPin, ExternalLink, Sun } from 'lucide-react';

interface FooterProps {
  onNavClick: (tab: any) => void;
}

export const Footer: React.FC<FooterProps> = ({ onNavClick }) => {
  return (
    <footer className="bg-neutral-900 text-neutral-300 border-t border-neutral-800">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 lg:py-16">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-12 gap-8 pb-12 border-b border-neutral-800">
          {/* Col 1: Brand Wordmark & Mission */}
          <div className="lg:col-span-5 space-y-4">
            <div className="flex items-center gap-3">
              <img
                src={COMPANY_INFO.appLogo}
                alt="Unicorn Energy Logo"
                className="h-10 w-auto object-contain bg-white/90 p-1 rounded-md"
              />
              <span className="text-xl font-extrabold text-white tracking-tight">
                Unicorn <span className="text-amber-400">Energy</span>
              </span>
            </div>

            <p className="text-xs text-neutral-400 leading-relaxed max-w-sm">
              Advanced solar data collection, load audit calculation, and system engineering software. Developed by Unicorn Group Bangladesh for residential, commercial, and industrial renewable energy projects.
            </p>

            <div className="pt-2 flex items-center gap-3">
              <img
                src={COMPANY_INFO.companyLogo}
                alt="Unicorn Group"
                className="h-10 w-auto object-contain bg-white/90 p-1 rounded-md"
              />
              <div className="text-xs">
                <span className="text-neutral-400 block text-[11px]">Parent Organization</span>
                <a
                  href={COMPANY_INFO.website}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-white hover:text-emerald-400 transition-colors font-semibold flex items-center gap-1"
                >
                  <span>Unicorn Group</span>
                  <ExternalLink className="w-3 h-3" />
                </a>
              </div>
            </div>
          </div>

          {/* Col 2: Navigation Mirror */}
          <div className="lg:col-span-3 space-y-3">
            <h4 className="text-xs font-bold uppercase tracking-wider text-white">
              Application Navigation
            </h4>
            <ul className="space-y-2 text-xs text-neutral-400">
              <li>
                <button
                  onClick={() => onNavClick('calculator')}
                  className="hover:text-white transition-colors cursor-pointer"
                >
                  Solar Sizing Calculator
                </button>
              </li>
              <li>
                <button
                  onClick={() => onNavClick('load-audit')}
                  className="hover:text-white transition-colors cursor-pointer"
                >
                  Appliance Load Audit
                </button>
              </li>
              <li>
                <button
                  onClick={() => onNavClick('survey')}
                  className="hover:text-white transition-colors cursor-pointer"
                >
                  Site Survey Form
                </button>
              </li>
              <li>
                <button
                  onClick={() => onNavClick('submissions')}
                  className="hover:text-white transition-colors cursor-pointer"
                >
                  Field Submissions Console
                </button>
              </li>
              <li>
                <button
                  onClick={() => onNavClick('about')}
                  className="hover:text-white transition-colors cursor-pointer"
                >
                  About Unicorn Group
                </button>
              </li>
            </ul>
          </div>

          {/* Col 3: Direct Contact Information */}
          <div className="lg:col-span-4 space-y-3">
            <h4 className="text-xs font-bold uppercase tracking-wider text-white">
              Corporate Headquarters
            </h4>
            <div className="space-y-2.5 text-xs text-neutral-400">
              <div className="flex items-start gap-2">
                <MapPin className="w-4 h-4 text-emerald-400 shrink-0 mt-0.5" />
                <span>{COMPANY_INFO.address}</span>
              </div>
              <div className="flex items-center gap-2">
                <Phone className="w-4 h-4 text-emerald-400 shrink-0" />
                <a
                  href={`tel:${COMPANY_INFO.phone}`}
                  className="hover:text-white transition-colors font-mono"
                >
                  {COMPANY_INFO.phone}
                </a>
              </div>
              <div className="flex items-start gap-2">
                <Mail className="w-4 h-4 text-emerald-400 shrink-0 mt-0.5" />
                <div className="space-y-0.5 font-mono">
                  {COMPANY_INFO.emails.map((e) => (
                    <a
                      key={e}
                      href={`mailto:${e}`}
                      className="block hover:text-white transition-colors"
                    >
                      {e}
                    </a>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Bottom Bar: Quiet Copyright */}
        <div className="pt-8 flex flex-col sm:flex-row items-center justify-between gap-4 text-[11px] text-neutral-500">
          <div>
            © {new Date().getFullYear()} Unicorn Group. All rights reserved. Unicorn Energy Calculator.
          </div>
          <div className="flex items-center gap-4">
            <a
              href={COMPANY_INFO.website}
              target="_blank"
              rel="noopener noreferrer"
              className="hover:text-neutral-300 transition-colors"
            >
              unicorngroupbd.com
            </a>
            <span>·</span>
            <span>Based on solarsizecalculator.com engineering algorithms</span>
          </div>
        </div>
      </div>
    </footer>
  );
};
