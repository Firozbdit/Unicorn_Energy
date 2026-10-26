import React from 'react';
import { SolarCalculationResult, SystemType } from '../types/solar';
import { formatCurrency } from '../utils/solarCalculations';
import { COMPANY_INFO } from '../data/defaultData';
import { ROIChartD3 } from './ROIChartD3';
import {
  Sun,
  Zap,
  Battery,
  Maximize2,
  TrendingUp,
  Leaf,
  Calendar,
  Layers,
  FileText,
  Printer,
  MessageCircle,
} from 'lucide-react';

interface SizingResultsProps {
  calculation: SolarCalculationResult;
  systemType: SystemType;
  onOpenSurvey: () => void;
  onPrintReport: () => void;
}

export const SizingResults: React.FC<SizingResultsProps> = ({
  calculation,
  systemType,
  onOpenSurvey,
  onPrintReport,
}) => {
  const currency = 'BDT';

  const systemTypeLabel =
    systemType === 'on-grid'
      ? 'On-Grid (Net Metering)'
      : systemType === 'hybrid'
      ? 'Hybrid (Solar + Battery + Grid)'
      : 'Off-Grid (100% Standalone)';

  return (
    <div id="sizing-results-section" className="bg-white rounded-2xl border border-neutral-200 shadow-xs p-6 md:p-8">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 pb-6 border-b border-neutral-200">
        <div>
          <div className="flex items-center gap-2 text-xs font-semibold text-emerald-800 uppercase tracking-wider mb-1">
            <span>Engineering Assessment</span>
            <span className="text-neutral-300">·</span>
            <span>{systemTypeLabel}</span>
          </div>
          <h2 className="text-2xl font-bold text-neutral-900">
            Recommended Solar System Sizing
          </h2>
          <p className="text-sm text-neutral-600 mt-1">
            Calculated based on your energy demand, solar insolation, and engineering derating factors.
          </p>
        </div>

        {/* Quick Action Buttons */}
        <div className="flex items-center gap-2">
          <button
            onClick={onPrintReport}
            className="px-3.5 py-2 text-xs font-semibold text-neutral-700 bg-neutral-100 hover:bg-neutral-200 rounded-lg transition-colors flex items-center gap-1.5 cursor-pointer border border-neutral-200"
            title="Print or Save Official Proposal as PDF"
          >
            <Printer className="w-3.5 h-3.5" />
            <span>Print Report</span>
          </button>

          <button
            onClick={onOpenSurvey}
            className="px-4 py-2 text-xs font-bold text-white bg-emerald-800 hover:bg-emerald-900 rounded-lg transition-colors flex items-center gap-1.5 cursor-pointer shadow-xs"
          >
            <FileText className="w-3.5 h-3.5" />
            <span>Submit Survey</span>
          </button>
        </div>
      </div>

      {/* Primary Technical Specs Bento Grid */}
      <div className="my-6 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {/* Metric 1: Solar Array Size */}
        <div className="p-5 rounded-xl bg-gradient-to-br from-neutral-50 to-emerald-50/40 border border-neutral-200">
          <div className="flex items-center justify-between text-xs font-semibold text-neutral-500 uppercase tracking-wider mb-2">
            <span>Solar PV Array</span>
            <Sun className="w-4 h-4 text-amber-500" />
          </div>
          <div className="text-3xl font-extrabold text-neutral-900 font-mono tabular-nums">
            {calculation.actualArrayKw} <span className="text-base font-sans font-medium text-neutral-600">kWp</span>
          </div>
          <p className="text-xs text-neutral-600 mt-2">
            Exact design requirement: {calculation.recommendedArrayKw} kWp
          </p>
        </div>

        {/* Metric 2: Solar Panels Count */}
        <div className="p-5 rounded-xl bg-neutral-50 border border-neutral-200">
          <div className="flex items-center justify-between text-xs font-semibold text-neutral-500 uppercase tracking-wider mb-2">
            <span>Solar Panels</span>
            <Layers className="w-4 h-4 text-emerald-700" />
          </div>
          <div className="text-3xl font-extrabold text-neutral-900 font-mono tabular-nums">
            {calculation.panelCount} <span className="text-base font-sans font-medium text-neutral-600">Panels</span>
          </div>
          <p className="text-xs text-neutral-600 mt-2">
            {calculation.panelWattage}W Tier-1 Mono PERC / TopCon
          </p>
        </div>

        {/* Metric 3: Inverter Rating */}
        <div className="p-5 rounded-xl bg-neutral-50 border border-neutral-200">
          <div className="flex items-center justify-between text-xs font-semibold text-neutral-500 uppercase tracking-wider mb-2">
            <span>Inverter Rating</span>
            <Zap className="w-4 h-4 text-amber-500" />
          </div>
          <div className="text-3xl font-extrabold text-neutral-900 font-mono tabular-nums">
            {calculation.recommendedInverterKw} <span className="text-base font-sans font-medium text-neutral-600">kW</span>
          </div>
          <p className="text-xs text-neutral-600 mt-2">
            {calculation.inverterPhase} MPPT Grid Inverter
          </p>
        </div>

        {/* Metric 4: Battery Storage or Net Metering */}
        <div className="p-5 rounded-xl bg-neutral-50 border border-neutral-200">
          <div className="flex items-center justify-between text-xs font-semibold text-neutral-500 uppercase tracking-wider mb-2">
            <span>Energy Storage</span>
            <Battery className="w-4 h-4 text-emerald-700" />
          </div>
          {calculation.requiresBattery ? (
            <>
              <div className="text-3xl font-extrabold text-emerald-900 font-mono tabular-nums">
                {calculation.batteryCapacityKwh} <span className="text-base font-sans font-medium text-neutral-600">kWh</span>
              </div>
              <p className="text-xs text-neutral-600 mt-2 font-mono">
                {calculation.batteryCapacityAh} Ah @ {calculation.batteryVoltage}V ({calculation.batteryChemistry.toUpperCase()})
              </p>
            </>
          ) : (
            <>
              <div className="text-2xl font-bold text-neutral-800">
                Grid-Tied
              </div>
              <p className="text-xs text-neutral-600 mt-2">
                Net Metering (Excess energy exported to utility grid)
              </p>
            </>
          )}
        </div>
      </div>

      {/* Secondary Detailed Breakdown: Generation, Rooftop Area & Financial ROI */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 my-6">
        {/* Estimated Generation Panel */}
        <div className="p-5 rounded-xl border border-neutral-200 bg-white">
          <h4 className="text-sm font-bold text-neutral-900 flex items-center gap-2 mb-4 pb-2 border-b border-neutral-100">
            <Calendar className="w-4 h-4 text-emerald-700" />
            Estimated Clean Energy Generation
          </h4>
          <dl className="space-y-3 text-sm">
            <div className="flex justify-between items-center">
              <dt className="text-neutral-500">Daily Generation</dt>
              <dd className="font-mono font-bold text-neutral-900 tabular-nums">
                {calculation.estimatedDailyGenerationKwh} kWh/day
              </dd>
            </div>
            <div className="flex justify-between items-center">
              <dt className="text-neutral-500">Monthly Generation</dt>
              <dd className="font-mono font-bold text-neutral-900 tabular-nums">
                {calculation.estimatedMonthlyGenerationKwh.toLocaleString()} kWh/mo
              </dd>
            </div>
            <div className="flex justify-between items-center">
              <dt className="text-neutral-500">Annual Generation</dt>
              <dd className="font-mono font-bold text-emerald-800 tabular-nums text-base">
                {calculation.estimatedAnnualGenerationKwh.toLocaleString()} kWh/yr
              </dd>
            </div>
            <div className="pt-2 border-t border-neutral-100 flex justify-between items-center">
              <dt className="text-neutral-500">Required Roof Space</dt>
              <dd className="font-mono font-bold text-neutral-900 tabular-nums">
                {calculation.roofAreaRequiredSqFt} sq.ft <span className="text-xs font-normal text-neutral-400">({calculation.roofAreaRequiredSqM} m²)</span>
              </dd>
            </div>
          </dl>
        </div>

        {/* Financial ROI & Bill Savings */}
        <div className="p-5 rounded-xl border border-neutral-200 bg-white">
          <h4 className="text-sm font-bold text-neutral-900 flex items-center gap-2 mb-4 pb-2 border-b border-neutral-100">
            <TrendingUp className="w-4 h-4 text-emerald-700" />
            Estimated Financial Returns
          </h4>
          <dl className="space-y-3 text-sm">
            <div className="flex justify-between items-center">
              <dt className="text-neutral-500">Monthly Bill Savings</dt>
              <dd className="font-mono font-bold text-emerald-800 tabular-nums">
                {formatCurrency(calculation.estimatedMonthlySavings, currency)}
              </dd>
            </div>
            <div className="flex justify-between items-center">
              <dt className="text-neutral-500">Annual Bill Savings</dt>
              <dd className="font-mono font-bold text-emerald-800 tabular-nums text-base">
                {formatCurrency(calculation.estimatedAnnualSavings, currency)} / yr
              </dd>
            </div>
            <div className="flex justify-between items-center">
              <dt className="text-neutral-500">Estimated Capital Cost</dt>
              <dd className="font-mono font-semibold text-neutral-900 tabular-nums text-xs">
                {formatCurrency(calculation.estimatedSystemCostMin, currency)} - {formatCurrency(calculation.estimatedSystemCostMax, currency)}
              </dd>
            </div>
            <div className="pt-2 border-t border-neutral-100 flex justify-between items-center">
              <dt className="text-neutral-500">Estimated Payback Period</dt>
              <dd className="font-mono font-bold text-neutral-900 tabular-nums bg-amber-50 px-2 py-0.5 rounded text-amber-900 border border-amber-200">
                {calculation.paybackYears} Years
              </dd>
            </div>
          </dl>
        </div>

        {/* Environmental Carbon Offset */}
        <div className="p-5 rounded-xl border border-neutral-200 bg-white">
          <h4 className="text-sm font-bold text-neutral-900 flex items-center gap-2 mb-4 pb-2 border-b border-neutral-100">
            <Leaf className="w-4 h-4 text-emerald-700" />
            Environmental Sustainability
          </h4>
          <div className="space-y-4">
            <div className="p-3 bg-emerald-50/60 rounded-lg border border-emerald-100">
              <span className="text-xs text-emerald-800 font-medium block">
                Annual Carbon Emissions Avoided
              </span>
              <div className="text-2xl font-extrabold text-emerald-950 font-mono tabular-nums mt-1">
                {calculation.co2OffsetTonsYear} <span className="text-sm font-sans font-normal text-emerald-700">Tons CO₂ / year</span>
              </div>
            </div>

            <div className="p-3 bg-neutral-50 rounded-lg border border-neutral-200">
              <span className="text-xs text-neutral-600 font-medium block">
                Equivalent Tree Planting Impact
              </span>
              <div className="text-2xl font-extrabold text-neutral-900 font-mono tabular-nums mt-1">
                ~{calculation.equivalentTreesPlanted.toLocaleString()} <span className="text-sm font-sans font-normal text-neutral-600">Trees Mature</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* D3 Projected Return on Investment Chart */}
      <ROIChartD3 calculation={calculation} />

      {/* Conversion Banner: Dispatch to Engineering Consultants */}
      <div className="mt-8 p-6 bg-gradient-to-r from-emerald-900 to-neutral-900 rounded-xl text-white flex flex-col md:flex-row items-center justify-between gap-6 shadow-sm">
        <div>
          <span className="text-xs font-semibold text-emerald-300 uppercase tracking-wider block mb-1">
            Ready for Engineering Survey & Quotation?
          </span>
          <h3 className="text-xl font-bold text-white">
            Dispatch Your Sizing Report Directly to Unicorn Group
          </h3>
          <p className="text-xs text-neutral-300 mt-1 max-w-xl">
            Survey data will be transmitted to our lead solar engineers at{' '}
            <span className="text-white font-medium">{COMPANY_INFO.emails.join(' & ')}</span> for technical inspection and physical site auditing.
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-3 shrink-0">
          <a
            href={COMPANY_INFO.whatsappUrl(
              `Hi Unicorn Energy, I calculated a ${calculation.actualArrayKw} kWp ${systemTypeLabel} system for my site. I would like to schedule an engineering site survey.`
            )}
            target="_blank"
            rel="noopener noreferrer"
            className="px-4 py-2.5 text-xs font-bold text-neutral-900 bg-amber-400 hover:bg-amber-300 rounded-lg transition-colors flex items-center gap-1.5 cursor-pointer whitespace-nowrap"
          >
            <MessageCircle className="w-4 h-4 text-neutral-900" />
            <span>Chat on WhatsApp</span>
          </a>

          <button
            onClick={onOpenSurvey}
            className="px-5 py-2.5 text-xs font-bold text-white bg-emerald-600 hover:bg-emerald-500 rounded-lg transition-colors flex items-center gap-2 cursor-pointer whitespace-nowrap shadow-xs"
          >
            <FileText className="w-4 h-4" />
            <span>Complete Survey Form</span>
          </button>
        </div>
      </div>
    </div>
  );
};
