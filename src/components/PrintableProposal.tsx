import React from 'react';
import { SolarSurveyData } from '../types/solar';
import { COMPANY_INFO } from '../data/defaultData';
import { formatCurrency } from '../utils/solarCalculations';
import { Printer, X, Download } from 'lucide-react';

interface PrintableProposalProps {
  survey: SolarSurveyData;
  onClose: () => void;
}

export const PrintableProposal: React.FC<PrintableProposalProps> = ({ survey, onClose }) => {
  const calc = survey.calculationSummary;
  const currency = 'BDT';

  const handlePrint = () => {
    window.print();
  };

  return (
    <div className="fixed inset-0 z-50 bg-neutral-900/70 backdrop-blur-xs flex items-center justify-center p-4 overflow-y-auto">
      {/* Container */}
      <div className="bg-white w-full max-w-4xl rounded-2xl shadow-2xl overflow-hidden my-8 max-h-[92vh] flex flex-col">
        {/* Top Floating Control Bar (Hidden when printing) */}
        <div className="no-print bg-neutral-900 text-white px-6 py-3 flex items-center justify-between shrink-0">
          <div className="flex items-center gap-2 text-xs font-semibold">
            <span className="bg-emerald-600 px-2 py-0.5 rounded text-white font-mono">
              {survey.id}
            </span>
            <span>Official Solar Engineering Sizing Report</span>
          </div>

          <div className="flex items-center gap-3">
            <button
              onClick={handlePrint}
              className="px-4 py-1.5 text-xs font-bold bg-emerald-600 hover:bg-emerald-500 rounded text-white flex items-center gap-1.5 transition-colors cursor-pointer"
            >
              <Printer className="w-3.5 h-3.5" />
              <span>Print / Save as PDF</span>
            </button>
            <button
              onClick={onClose}
              className="p-1.5 text-neutral-400 hover:text-white transition-colors cursor-pointer"
              title="Close modal"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Scrollable Printable Document Area */}
        <div className="p-8 sm:p-12 overflow-y-auto bg-white text-neutral-900">
          {/* Document Header with dual logos */}
          <div className="flex items-center justify-between border-b-2 border-emerald-900 pb-6 mb-6">
            <div className="flex items-center gap-4">
              <img
                src={COMPANY_INFO.appLogo}
                alt="Unicorn Energy"
                className="h-16 w-auto object-contain"
              />
              <div>
                <h1 className="text-2xl font-black text-emerald-950 tracking-tight leading-tight">
                  UNICORN ENERGY
                </h1>
                <p className="text-xs font-bold text-neutral-500 uppercase tracking-widest">
                  Renewable Energy Solutions Division
                </p>
                <p className="text-[11px] text-neutral-500 mt-0.5">
                  A Venture of Unicorn Group (unicorngroupbd.com)
                </p>
              </div>
            </div>

            <div className="flex items-center gap-4 text-right">
              <div className="hidden sm:block text-xs text-neutral-600">
                <p className="font-bold text-neutral-900">UNICORN GROUP HEAD OFFICE</p>
                <p className="text-[11px]">Ujjal Tower, L-5, 362, DIT Road,</p>
                <p className="text-[11px]">East Rampura, Dhaka 1219</p>
                <p className="text-[11px] font-mono font-bold text-emerald-800">{COMPANY_INFO.phone}</p>
              </div>
              <img
                src={COMPANY_INFO.companyLogo}
                alt="Unicorn Group Logo"
                className="h-16 w-auto object-contain"
              />
            </div>
          </div>

          {/* Document Meta Row */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 p-4 bg-neutral-50 rounded-lg border border-neutral-200 mb-6 text-xs">
            <div>
              <span className="text-neutral-500 block">Proposal Reference</span>
              <strong className="font-mono text-neutral-900">{survey.id}</strong>
            </div>
            <div>
              <span className="text-neutral-500 block">Date of Assessment</span>
              <strong className="text-neutral-900">
                {new Date(survey.createdAt).toLocaleDateString('en-GB', {
                  day: '2-digit',
                  month: 'short',
                  year: 'numeric',
                })}
              </strong>
            </div>
            <div>
              <span className="text-neutral-500 block">System Type</span>
              <strong className="text-emerald-800 uppercase">{survey.systemType}</strong>
            </div>
            <div>
              <span className="text-neutral-500 block">Prepared By</span>
              <strong className="text-neutral-900">Unicorn Energy EPC Team</strong>
            </div>
          </div>

          {/* Client & Site Particulars */}
          <div className="mb-6">
            <h3 className="text-xs font-bold uppercase tracking-wider text-emerald-900 pb-1 border-b border-emerald-800 mb-3">
              1. Client & Site Location Details
            </h3>
            <div className="grid grid-cols-2 gap-x-6 gap-y-2 text-xs">
              <div className="flex justify-between py-1 border-b border-neutral-100">
                <span className="text-neutral-500">Client / Organization:</span>
                <span className="font-bold text-neutral-900">{survey.clientName}</span>
              </div>
              <div className="flex justify-between py-1 border-b border-neutral-100">
                <span className="text-neutral-500">Contact Number:</span>
                <span className="font-bold text-neutral-900 font-mono">{survey.clientPhone}</span>
              </div>
              <div className="flex justify-between py-1 border-b border-neutral-100">
                <span className="text-neutral-500">Email Address:</span>
                <span className="text-neutral-800">{survey.clientEmail || 'N/A'}</span>
              </div>
              <div className="flex justify-between py-1 border-b border-neutral-100">
                <span className="text-neutral-500">District / Division:</span>
                <span className="text-neutral-800">{survey.cityDistrict}</span>
              </div>
              <div className="flex justify-between py-1 border-b border-neutral-100 col-span-2">
                <span className="text-neutral-500">Physical Site Address:</span>
                <span className="font-medium text-neutral-800">{survey.siteAddress}</span>
              </div>
            </div>
          </div>

          {/* Site Technical Infrastructure */}
          <div className="mb-6">
            <h3 className="text-xs font-bold uppercase tracking-wider text-emerald-900 pb-1 border-b border-emerald-800 mb-3">
              2. Electrical & Structural Site Conditions
            </h3>
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-3 text-xs">
              <div className="p-2.5 bg-neutral-50 rounded border border-neutral-200">
                <span className="text-neutral-500 block text-[11px]">Property Category</span>
                <span className="font-bold text-neutral-900 capitalize">{survey.propertyType}</span>
              </div>
              <div className="p-2.5 bg-neutral-50 rounded border border-neutral-200">
                <span className="text-neutral-500 block text-[11px]">Utility Provider</span>
                <span className="font-bold text-neutral-900">{survey.electricityProvider}</span>
              </div>
              <div className="p-2.5 bg-neutral-50 rounded border border-neutral-200">
                <span className="text-neutral-500 block text-[11px]">Sanctioned Grid Load</span>
                <span className="font-bold text-neutral-900 font-mono">{survey.sanctionedLoadKw} kW ({survey.connectionType})</span>
              </div>
              <div className="p-2.5 bg-neutral-50 rounded border border-neutral-200">
                <span className="text-neutral-500 block text-[11px]">Roof Surface Type</span>
                <span className="font-bold text-neutral-900">{survey.roofType.replace('_', ' ').toUpperCase()}</span>
              </div>
              <div className="p-2.5 bg-neutral-50 rounded border border-neutral-200">
                <span className="text-neutral-500 block text-[11px]">Shadow Profile</span>
                <span className="font-bold text-neutral-900 capitalize">{survey.shadowCondition.replace('_', ' ')}</span>
              </div>
              <div className="p-2.5 bg-neutral-50 rounded border border-neutral-200">
                <span className="text-neutral-500 block text-[11px]">Delivery Model</span>
                <span className="font-bold text-neutral-900 uppercase">{survey.executionPreference.replace('_', ' ')}</span>
              </div>
            </div>
          </div>

          {/* Sizing Bill of Materials & Hardware Specs */}
          <div className="mb-6">
            <h3 className="text-xs font-bold uppercase tracking-wider text-emerald-900 pb-1 border-b border-emerald-800 mb-3">
              3. Proposed System Sizing & Equipment Specifications
            </h3>
            <table className="w-full text-xs text-left border border-neutral-300">
              <thead className="bg-neutral-100 text-neutral-700 font-bold border-b border-neutral-300">
                <tr>
                  <th className="p-2.5">Component / Specification</th>
                  <th className="p-2.5">Quantity / Capacity</th>
                  <th className="p-2.5">Description / Standard</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-neutral-200">
                <tr>
                  <td className="p-2.5 font-bold">Solar PV Modules</td>
                  <td className="p-2.5 font-mono font-bold text-emerald-800">
                    {calc.panelCount} × {calc.panelWattage}W ({calc.actualArrayKw} kWp)
                  </td>
                  <td className="p-2.5 text-neutral-600">
                    Tier-1 Mono PERC / N-Type TOPCon High-Efficiency Modules (IEC 61215/61730)
                  </td>
                </tr>
                <tr>
                  <td className="p-2.5 font-bold">Power Inverter</td>
                  <td className="p-2.5 font-mono font-bold text-neutral-900">
                    {calc.recommendedInverterKw} kW ({calc.inverterPhase})
                  </td>
                  <td className="p-2.5 text-neutral-600">
                    Smart MPPT On-Grid / Hybrid Inverter with remote Wi-Fi cloud telemetry
                  </td>
                </tr>
                <tr>
                  <td className="p-2.5 font-bold">Energy Storage Bank</td>
                  <td className="p-2.5 font-mono font-bold text-neutral-900">
                    {calc.requiresBattery ? `${calc.batteryCapacityKwh} kWh (${calc.batteryCapacityAh}Ah @ 48V)` : 'None (Net-Metering)'}
                  </td>
                  <td className="p-2.5 text-neutral-600">
                    {calc.requiresBattery ? `LiFePO4 Lithium battery rack with integrated intelligent BMS` : 'Standard Grid-Tied bi-directional Net Metering configuration'}
                  </td>
                </tr>
                <tr>
                  <td className="p-2.5 font-bold">Required Rooftop Space</td>
                  <td className="p-2.5 font-mono font-bold text-neutral-900">
                    {calc.roofAreaRequiredSqFt} sq.ft ({calc.roofAreaRequiredSqM} m²)
                  </td>
                  <td className="p-2.5 text-neutral-600">
                    Calculated with inter-row solar shading buffer and maintenance walkways
                  </td>
                </tr>
              </tbody>
            </table>
          </div>

          {/* Energy Projections & Financial Payback */}
          <div className="mb-6">
            <h3 className="text-xs font-bold uppercase tracking-wider text-emerald-900 pb-1 border-b border-emerald-800 mb-3">
              4. Expected Energy Yield & Financial Returns
            </h3>
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 text-xs">
              <div className="p-3 bg-neutral-50 rounded border border-neutral-200">
                <span className="text-neutral-500 block text-[11px]">Daily Generation</span>
                <span className="text-base font-bold text-neutral-900 font-mono">{calc.estimatedDailyGenerationKwh} kWh</span>
              </div>
              <div className="p-3 bg-neutral-50 rounded border border-neutral-200">
                <span className="text-neutral-500 block text-[11px]">Annual Generation</span>
                <span className="text-base font-bold text-emerald-900 font-mono">{calc.estimatedAnnualGenerationKwh.toLocaleString()} kWh/yr</span>
              </div>
              <div className="p-3 bg-neutral-50 rounded border border-neutral-200">
                <span className="text-neutral-500 block text-[11px]">Annual Bill Savings</span>
                <span className="text-base font-bold text-emerald-900 font-mono">{formatCurrency(calc.estimatedAnnualSavings, currency)}</span>
              </div>
              <div className="p-3 bg-neutral-50 rounded border border-neutral-200">
                <span className="text-neutral-500 block text-[11px]">Estimated Payback</span>
                <span className="text-base font-bold text-amber-900 font-mono">{calc.paybackYears} Years</span>
              </div>
            </div>

            <div className="mt-3 p-3 bg-emerald-50 rounded border border-emerald-200 text-xs flex justify-between items-center">
              <div>
                <span className="text-neutral-600 font-medium">Estimated Capital Turnkey Budget: </span>
                <strong className="text-emerald-950 font-mono font-bold">
                  {formatCurrency(calc.estimatedSystemCostMin, currency)} - {formatCurrency(calc.estimatedSystemCostMax, currency)}
                </strong>
              </div>
              <div className="text-emerald-800 font-mono text-[11px]">
                CO₂ Offset: {calc.co2OffsetTonsYear} Tons/yr (~{calc.equivalentTreesPlanted} trees)
              </div>
            </div>
          </div>

          {/* Warranties & Support */}
          <div className="mb-8 p-4 border border-neutral-200 rounded-lg text-xs text-neutral-600 bg-neutral-50/50">
            <h4 className="font-bold text-neutral-900 mb-1">Standard Warranties & Quality Assurance:</h4>
            <ul className="list-disc list-inside space-y-0.5 text-[11px]">
              <li>25-Year Linear Power Output Warranty on Solar PV Modules (80%+ output at Year 25).</li>
              <li>5-Year Comprehensive Manufacturer Warranty on Grid/Hybrid Inverters.</li>
              <li>10-Year or 6,000 Cycle Warranty on LiFePO4 Lithium Battery Storage Systems.</li>
              <li>Complete support for utility net-metering approvals with DPDC, DESCO, BREB/PBS, and BPDB.</li>
            </ul>
          </div>

          {/* Signature & Authorization Section */}
          <div className="pt-6 border-t border-neutral-300 grid grid-cols-2 gap-8 text-xs">
            <div>
              <p className="font-bold text-neutral-900">Prepared for Client:</p>
              <p className="text-neutral-600 mt-1">{survey.clientName}</p>
              <div className="mt-12 pt-2 border-t border-neutral-300 text-neutral-400">
                Client Representative Signature & Date
              </div>
            </div>

            <div className="text-right">
              <p className="font-bold text-neutral-900">Unicorn Group Renewable Energy Division:</p>
              <p className="text-neutral-600 mt-1">Engr. Technical Assessment Team</p>
              <div className="mt-12 pt-2 border-t border-neutral-300 text-neutral-400">
                Authorized Signatory & Seal
              </div>
            </div>
          </div>

          {/* Footer note */}
          <div className="mt-8 text-center text-[10px] text-neutral-400 border-t border-neutral-100 pt-4">
            Unicorn Energy Calculator · Official Proposal Report · Generated on {new Date().toLocaleString()} · Contact: {COMPANY_INFO.phone} · {COMPANY_INFO.emails.join(' · ')}
          </div>
        </div>
      </div>
    </div>
  );
};
