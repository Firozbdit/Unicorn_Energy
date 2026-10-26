import React from 'react';
import { COMPANY_INFO } from '../data/defaultData';
import { Sun, ShieldCheck, Zap, ArrowRight, Building2, MapPin, Phone } from 'lucide-react';

interface HeroSectionProps {
  onStartCalculation: () => void;
  onOpenAudit: () => void;
}

export const HeroSection: React.FC<HeroSectionProps> = ({ onStartCalculation, onOpenAudit }) => {
  return (
    <section className="relative overflow-hidden bg-white border-b border-neutral-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 lg:py-16">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 items-stretch">
          {/* Left Column: Value proposition & CTAs */}
          <div className="lg:col-span-7 flex flex-col justify-center">
            {/* Regional / Corporate trust kicker */}
            <div className="flex items-center gap-2 text-xs font-semibold text-emerald-800 mb-3 tracking-wide uppercase">
              <span className="flex items-center gap-1.5 bg-emerald-50 px-2.5 py-1 rounded text-emerald-800 border border-emerald-200/60">
                <Sun className="w-3.5 h-3.5 text-amber-500" />
                Unicorn Group Renewable Energy Division
              </span>
              <span className="text-neutral-400">·</span>
              <span className="text-neutral-600">Dhaka, Bangladesh</span>
            </div>

            <h1 className="text-3xl sm:text-4xl lg:text-5xl font-extrabold tracking-tight text-neutral-900 text-balance leading-tight mb-4">
              Precision Solar PV Sizing & Field Data Collection
            </h1>

            <p className="text-base sm:text-lg text-neutral-600 leading-relaxed max-w-2xl mb-8">
              Engineered by <strong className="text-neutral-900">Unicorn Group</strong> for homes, commercial rooftops, and industrial factories across Bangladesh. Calculate exact solar capacity, panel count, inverter specifications, battery storage, and dispatch your site survey directly to engineering consultants.
            </p>

            {/* Quick action buttons */}
            <div className="flex flex-wrap items-center gap-4 mb-8">
              <button
                onClick={onStartCalculation}
                className="px-6 py-3.5 text-sm font-bold text-white bg-emerald-800 hover:bg-emerald-900 active:bg-emerald-950 rounded-lg shadow-sm transition-all flex items-center gap-2 cursor-pointer"
              >
                <span>Calculate Solar Sizing</span>
                <ArrowRight className="w-4 h-4 text-emerald-300" />
              </button>

              <button
                onClick={onOpenAudit}
                className="px-5 py-3.5 text-sm font-bold text-neutral-800 bg-neutral-100 hover:bg-neutral-200 active:bg-neutral-300 rounded-lg transition-all flex items-center gap-2 cursor-pointer border border-neutral-200"
              >
                <Zap className="w-4 h-4 text-amber-600" />
                <span>Appliance Load Audit</span>
              </button>
            </div>

            {/* Verified Trust Markers */}
            <div className="pt-6 border-t border-neutral-100 grid grid-cols-2 sm:grid-cols-3 gap-4 text-xs text-neutral-600">
              <div className="flex items-center gap-2">
                <ShieldCheck className="w-4 h-4 text-emerald-700 shrink-0" />
                <span>Tier-1 550W+ Mono PERC</span>
              </div>
              <div className="flex items-center gap-2">
                <Zap className="w-4 h-4 text-amber-600 shrink-0" />
                <span>Net Metering Compliant</span>
              </div>
              <div className="flex items-center gap-2">
                <Building2 className="w-4 h-4 text-emerald-700 shrink-0" />
                <span>Industrial EPC Ready</span>
              </div>
            </div>
          </div>

          {/* Right Column: Hero High-Impact Visual Asset */}
          <div className="lg:col-span-5 flex flex-col justify-center">
            <div className="relative rounded-2xl overflow-hidden border border-neutral-200 shadow-lg bg-neutral-900 group">
              <img
                src={COMPANY_INFO.heroImage}
                alt="Solar Rooftop Installation by Unicorn Energy"
                className="w-full h-80 sm:h-96 lg:h-full object-cover transition-transform duration-700 group-hover:scale-105"
                referrerPolicy="no-referrer"
                onError={(e) => {
                  (e.target as HTMLElement).style.display = 'none';
                }}
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/30 to-transparent flex flex-col justify-end p-6 text-white">
                <div className="flex items-center justify-between text-xs text-emerald-300 font-semibold mb-1">
                  <span>Commercial & Industrial Grid-Tie</span>
                  <span className="bg-emerald-500/20 px-2 py-0.5 rounded text-emerald-300 border border-emerald-400/30">
                    4.8+ Peak Sun Hours
                  </span>
                </div>
                <h3 className="text-lg font-bold text-white mb-1">
                  Unicorn Energy High-Yield Solar Arrays
                </h3>
                <p className="text-xs text-neutral-300 leading-normal">
                  Turnkey engineering, procurement, net metering approvals, and 25-year performance monitoring.
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* 4-Column Metric Strip below hero split per Section 5 */}
        <div className="mt-10 pt-8 border-t border-neutral-200 grid grid-cols-2 md:grid-cols-4 gap-6">
          <div className="p-4 rounded-xl bg-neutral-50 border border-neutral-200">
            <span className="text-xs font-semibold text-neutral-500 uppercase tracking-wider block mb-1">
              Solar Peak Hours
            </span>
            <div className="text-2xl font-extrabold text-neutral-900 font-mono tabular-nums">
              4.5 - 5.2 <span className="text-sm font-sans font-normal text-neutral-600">hrs/day</span>
            </div>
            <p className="text-xs text-neutral-500 mt-1">Average Bangladesh insolation</p>
          </div>

          <div className="p-4 rounded-xl bg-neutral-50 border border-neutral-200">
            <span className="text-xs font-semibold text-neutral-500 uppercase tracking-wider block mb-1">
              Electricity Cost Cut
            </span>
            <div className="text-2xl font-extrabold text-emerald-800 font-mono tabular-nums">
              70% - 95%
            </div>
            <p className="text-xs text-neutral-500 mt-1">Via Net Metering policy</p>
          </div>

          <div className="p-4 rounded-xl bg-neutral-50 border border-neutral-200">
            <span className="text-xs font-semibold text-neutral-500 uppercase tracking-wider block mb-1">
              Estimated Payback
            </span>
            <div className="text-2xl font-extrabold text-neutral-900 font-mono tabular-nums">
              3.8 - 5.5 <span className="text-sm font-sans font-normal text-neutral-600">Years</span>
            </div>
            <p className="text-xs text-neutral-500 mt-1">25-year panel lifecycle</p>
          </div>

          <div className="p-4 rounded-xl bg-neutral-50 border border-neutral-200">
            <span className="text-xs font-semibold text-neutral-500 uppercase tracking-wider block mb-1">
              Engineering Support
            </span>
            <div className="text-2xl font-extrabold text-neutral-900 font-mono tabular-nums">
              24/7 <span className="text-sm font-sans font-normal text-neutral-600">Direct</span>
            </div>
            <p className="text-xs text-neutral-500 mt-1">Site survey & EPC consultation</p>
          </div>
        </div>
      </div>
    </section>
  );
};
