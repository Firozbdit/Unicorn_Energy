import React, { useState } from 'react';
import { Zap, ChevronUp, ChevronDown, ArrowRight, FileText } from 'lucide-react';
import { SolarCalculationResult } from '../types/solar';
import { formatCurrency } from '../utils/solarCalculations';

interface MobileStickySummaryProps {
  calculation: SolarCalculationResult;
  currency: 'BDT' | 'USD';
  activeTab: string;
  onViewDetails: () => void;
  onOpenSurvey: () => void;
}

export const MobileStickySummary: React.FC<MobileStickySummaryProps> = ({
  calculation,
  currency,
  activeTab,
  onViewDetails,
  onOpenSurvey,
}) => {
  const [expanded, setExpanded] = useState(false);

  // Only show on calculator and load-audit tabs
  if (activeTab !== 'calculator' && activeTab !== 'load-audit') {
    return null;
  }

  return (
    <div className="md:hidden fixed bottom-16 left-3 right-3 z-30 transition-all duration-200">
      <div className="bg-neutral-900/95 backdrop-blur-md text-white rounded-2xl p-3 shadow-xl border border-neutral-800/80">
        {/* Compact Main Bar */}
        <div className="flex items-center justify-between gap-2">
          <div
            onClick={() => setExpanded(!expanded)}
            className="flex items-center gap-2 min-w-0 cursor-pointer flex-1"
          >
            <div className="w-8 h-8 rounded-lg bg-emerald-600/90 text-white flex items-center justify-center shrink-0">
              <Zap className="w-4 h-4" />
            </div>
            <div className="min-w-0">
              <div className="flex items-center gap-1.5 leading-none">
                <span className="font-extrabold text-xs text-white">
                  {calculation.actualArrayKw.toFixed(1)} kWp
                </span>
                <span className="text-neutral-400 text-[10px]">·</span>
                <span className="text-[11px] text-amber-300 font-semibold truncate">
                  {calculation.panelCount} Panels
                </span>
              </div>
              <div className="text-[10px] text-neutral-400 font-medium mt-0.5 truncate">
                Save {formatCurrency(calculation.estimatedMonthlySavings, currency)}/mo
              </div>
            </div>
          </div>

          <div className="flex items-center gap-1.5 shrink-0">
            <button
              onClick={() => setExpanded(!expanded)}
              className="p-1.5 rounded-lg text-neutral-400 hover:text-white"
              aria-label="Toggle Summary"
            >
              {expanded ? (
                <ChevronDown className="w-4 h-4" />
              ) : (
                <ChevronUp className="w-4 h-4" />
              )}
            </button>

            <button
              onClick={onViewDetails}
              className="px-2.5 py-1.5 rounded-xl bg-emerald-700 hover:bg-emerald-600 active:bg-emerald-800 text-white text-[11px] font-bold flex items-center gap-1 transition-colors"
            >
              <span>Report</span>
              <ArrowRight className="w-3 h-3" />
            </button>
          </div>
        </div>

        {/* Expanded Drawer on Click */}
        {expanded && (
          <div className="mt-3 pt-3 border-t border-neutral-800 text-xs space-y-2">
            <div className="grid grid-cols-2 gap-2 text-[11px]">
              <div className="p-2 rounded-lg bg-neutral-800/70">
                <span className="text-neutral-400 block text-[9px] uppercase font-bold">
                  Inverter
                </span>
                <span className="font-bold text-white">
                  {calculation.recommendedInverterKw} kW
                </span>
              </div>

              <div className="p-2 rounded-lg bg-neutral-800/70">
                <span className="text-neutral-400 block text-[9px] uppercase font-bold">
                  Estimated Cost
                </span>
                <span className="font-bold text-emerald-400">
                  {formatCurrency(calculation.estimatedSystemCostMin, currency)}
                </span>
              </div>

              <div className="p-2 rounded-lg bg-neutral-800/70">
                <span className="text-neutral-400 block text-[9px] uppercase font-bold">
                  Annual Generation
                </span>
                <span className="font-bold text-white">
                  {calculation.estimatedAnnualGenerationKwh.toLocaleString()} kWh
                </span>
              </div>

              <div className="p-2 rounded-lg bg-neutral-800/70">
                <span className="text-neutral-400 block text-[9px] uppercase font-bold">
                  Payback
                </span>
                <span className="font-bold text-amber-300">
                  ~{calculation.paybackPeriodYears} Years
                </span>
              </div>
            </div>

            <button
              onClick={() => {
                setExpanded(false);
                onOpenSurvey();
              }}
              className="w-full py-2 rounded-xl bg-emerald-600 hover:bg-emerald-500 font-bold text-xs text-white flex items-center justify-center gap-1.5 transition-colors"
            >
              <FileText className="w-3.5 h-3.5" />
              <span>Submit Survey for Engineering Audit</span>
            </button>
          </div>
        )}
      </div>
    </div>
  );
};
