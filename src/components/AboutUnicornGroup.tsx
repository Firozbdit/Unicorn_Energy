import React from 'react';
import { COMPANY_INFO } from '../data/defaultData';
import {
  Building2,
  Mail,
  Phone,
  MapPin,
  ExternalLink,
  ShieldCheck,
  Zap,
  CheckCircle,
  Award,
} from 'lucide-react';

export const AboutUnicornGroup: React.FC = () => {
  return (
    <div className="bg-white rounded-2xl border border-neutral-200 shadow-xs p-6 md:p-10">
      {/* Header with dual logos */}
      <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-6 pb-8 border-b border-neutral-200">
        <div className="flex items-center gap-5">
          <img
            src={COMPANY_INFO.companyLogo}
            alt="Unicorn Group"
            className="h-16 sm:h-20 w-auto object-contain"
          />
          <div>
            <div className="flex items-center gap-2 text-xs font-semibold text-emerald-800 uppercase tracking-wider mb-1">
              <span>Corporate Profile</span>
              <span className="text-neutral-300">·</span>
              <a
                href={COMPANY_INFO.website}
                target="_blank"
                rel="noopener noreferrer"
                className="hover:underline flex items-center gap-1 text-emerald-800 font-bold"
              >
                <span>unicorngroupbd.com</span>
                <ExternalLink className="w-3 h-3" />
              </a>
            </div>
            <h2 className="text-2xl sm:text-3xl font-extrabold text-neutral-900">
              Unicorn Group Bangladesh
            </h2>
            <p className="text-sm text-neutral-600 mt-1 max-w-xl">
              Pioneering sustainable technology, clean energy infrastructure, and industrial engineering solutions across Bangladesh.
            </p>
          </div>
        </div>

        <div className="flex items-center gap-3">
          <a
            href={COMPANY_INFO.website}
            target="_blank"
            rel="noopener noreferrer"
            className="px-4 py-2.5 text-xs font-bold text-neutral-900 bg-neutral-100 hover:bg-neutral-200 rounded-lg transition-colors flex items-center gap-2 border border-neutral-200"
          >
            <span>Visit Corporate Website</span>
            <ExternalLink className="w-3.5 h-3.5" />
          </a>
        </div>
      </div>

      {/* Main Grid: Content and Industrial Image */}
      <div className="my-8 grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
        <div className="lg:col-span-7 space-y-4 text-sm text-neutral-600 leading-relaxed">
          <h3 className="text-lg font-bold text-neutral-900">
            Unicorn Energy: Accelerating Bangladesh's Clean Energy Transition
          </h3>
          <p>
            <strong className="text-neutral-900">Unicorn Energy</strong> is the specialized renewable energy and solar EPC arm of <strong className="text-neutral-900">Unicorn Group</strong>. We engineer high-performance solar photovoltaic systems for industrial apparel and textile factories, commercial real estate, corporate offices, and private residential rooftops.
          </p>
          <p>
            With Bangladesh's National Net Metering Guidelines and the rising cost of grid electricity and captive fuel, rooftop solar provides businesses with an unmatched hedge against energy inflation, slashing utility bills by up to 85% while unlocking international green compliance (LEED, ESG, and RE100 standards).
          </p>

          <div className="pt-4 grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
            <div className="p-3 bg-neutral-50 rounded-lg border border-neutral-200 flex items-start gap-2.5">
              <ShieldCheck className="w-4 h-4 text-emerald-700 shrink-0 mt-0.5" />
              <div>
                <strong className="text-neutral-900 block">Tier-1 Equipment Only</strong>
                <span>Jinko, LONGi, Trina Solar Tier-1 monocrystalline panels with 25-year output warranties.</span>
              </div>
            </div>

            <div className="p-3 bg-neutral-50 rounded-lg border border-neutral-200 flex items-start gap-2.5">
              <Zap className="w-4 h-4 text-amber-600 shrink-0 mt-0.5" />
              <div>
                <strong className="text-neutral-900 block">Net Metering Authority Approvals</strong>
                <span>Complete utility liaison for bi-directional meters with DPDC, DESCO, BREB/PBS, and BPDB.</span>
              </div>
            </div>

            <div className="p-3 bg-neutral-50 rounded-lg border border-neutral-200 flex items-start gap-2.5">
              <Award className="w-4 h-4 text-emerald-700 shrink-0 mt-0.5" />
              <div>
                <strong className="text-neutral-900 block">Turnkey EPC Execution</strong>
                <span>Detailed engineering design, structural load analysis, lightning protection, and commissioning.</span>
              </div>
            </div>

            <div className="p-3 bg-neutral-50 rounded-lg border border-neutral-200 flex items-start gap-2.5">
              <CheckCircle className="w-4 h-4 text-emerald-700 shrink-0 mt-0.5" />
              <div>
                <strong className="text-neutral-900 block">LiFePO4 Storage & Hybrid UPS</strong>
                <span>Integrated high-voltage lithium battery solutions for uncompromised power during outages.</span>
              </div>
            </div>
          </div>
        </div>

        {/* Industrial Image Showcase */}
        <div className="lg:col-span-5">
          <div className="rounded-xl overflow-hidden border border-neutral-200 shadow-md bg-neutral-900">
            <img
              src={COMPANY_INFO.industrialImage}
              alt="Unicorn Energy Industrial Solar Installation"
              className="w-full h-72 object-cover"
              referrerPolicy="no-referrer"
            />
            <div className="p-4 bg-neutral-900 text-white text-xs">
              <span className="font-bold text-emerald-400 block mb-0.5">
                Industrial Megawatt-Scale Engineering
              </span>
              <p className="text-neutral-300 text-[11px]">
                Factory roof arrays with centralized inverter stations, walkways, and automated cloud monitoring.
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Official Address & Contact Card */}
      <div className="mt-8 pt-8 border-t border-neutral-200">
        <h3 className="text-xs font-bold uppercase tracking-wider text-neutral-500 mb-4">
          Contact Details & Corporate Headquarters
        </h3>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 text-sm">
          {/* Address */}
          <div className="p-5 rounded-xl bg-neutral-50 border border-neutral-200">
            <div className="flex items-center gap-2 text-xs font-bold text-neutral-900 uppercase tracking-wider mb-2">
              <MapPin className="w-4 h-4 text-emerald-700" />
              <span>Head Office Address</span>
            </div>
            <p className="text-xs text-neutral-700 leading-relaxed font-medium">
              {COMPANY_INFO.address}
            </p>
            <p className="text-[11px] text-neutral-400 mt-2">
              East Rampura, DIT Road, Dhaka 1219
            </p>
          </div>

          {/* Direct Phone / WhatsApp */}
          <div className="p-5 rounded-xl bg-neutral-50 border border-neutral-200">
            <div className="flex items-center gap-2 text-xs font-bold text-neutral-900 uppercase tracking-wider mb-2">
              <Phone className="w-4 h-4 text-emerald-700" />
              <span>Direct Phone & WhatsApp</span>
            </div>
            <a
              href={`tel:${COMPANY_INFO.phone}`}
              className="text-lg font-bold font-mono text-emerald-900 hover:text-emerald-700 transition-colors block"
            >
              {COMPANY_INFO.phone}
            </a>
            <a
              href={COMPANY_INFO.whatsappUrl('Hello Unicorn Group, I would like to enquire about solar solutions.')}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-1.5 text-xs font-semibold text-emerald-800 hover:underline mt-2"
            >
              <span>Chat directly on WhatsApp</span>
              <ExternalLink className="w-3 h-3" />
            </a>
          </div>

          {/* Email Inboxes */}
          <div className="p-5 rounded-xl bg-neutral-50 border border-neutral-200">
            <div className="flex items-center gap-2 text-xs font-bold text-neutral-900 uppercase tracking-wider mb-2">
              <Mail className="w-4 h-4 text-emerald-700" />
              <span>Engineering Email Inboxes</span>
            </div>
            <div className="space-y-1 font-mono text-xs text-neutral-800">
              {COMPANY_INFO.emails.map((email) => (
                <a
                  key={email}
                  href={`mailto:${email}`}
                  className="block hover:text-emerald-800 hover:underline"
                >
                  {email}
                </a>
              ))}
            </div>
            <p className="text-[11px] text-neutral-400 mt-2">
              Surveys dispatched directly to both inboxes
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};
