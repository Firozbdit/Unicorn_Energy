import React from 'react';
import { SolarInputState, SystemType, CalculationMode } from '../types/solar';
import { BANGLADESH_LOCATIONS, PANEL_OPTIONS } from '../data/defaultData';
import {
  Sun,
  Zap,
  Battery,
  Sliders,
  MapPin,
  Layers,
  HelpCircle,
  Home,
  CheckCircle,
} from 'lucide-react';

interface SolarCalculatorProps {
  inputState: SolarInputState;
  setInputState: React.Dispatch<React.SetStateAction<SolarInputState>>;
  onOpenAudit: () => void;
}

export const SolarCalculator: React.FC<SolarCalculatorProps> = ({
  inputState,
  setInputState,
  onOpenAudit,
}) => {
  const setMode = (mode: CalculationMode) => {
    setInputState((prev) => ({ ...prev, calculationMode: mode }));
  };

  const setSystemType = (type: SystemType) => {
    setInputState((prev) => ({ ...prev, systemType: type }));
  };

  const handleLocationChange = (locationName: string) => {
    const loc = BANGLADESH_LOCATIONS.find((l) => l.name === locationName);
    if (loc) {
      setInputState((prev) => ({
        ...prev,
        selectedLocation: loc.name,
        peakSunHours: loc.peakSunHours,
      }));
    }
  };

  return (
    <div className="bg-white rounded-2xl border border-neutral-200 shadow-xs p-6 md:p-8">
      {/* Step 1: System Architecture Selection */}
      <div className="mb-8">
        <label className="block text-xs font-bold text-neutral-500 uppercase tracking-wider mb-3">
          1. Select Solar System Architecture
        </label>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
          {/* Option: On-Grid */}
          <button
            type="button"
            onClick={() => setSystemType('on-grid')}
            className={`p-4 rounded-xl border text-left transition-all cursor-pointer ${
              inputState.systemType === 'on-grid'
                ? 'border-emerald-600 bg-emerald-50/50 shadow-xs ring-1 ring-emerald-600'
                : 'border-neutral-200 hover:border-neutral-300 bg-white'
            }`}
          >
            <div className="flex items-center justify-between mb-1.5">
              <span className="font-bold text-neutral-900 text-sm flex items-center gap-1.5">
                <Zap className="w-4 h-4 text-emerald-700" />
                On-Grid (Net Metering)
              </span>
              {inputState.systemType === 'on-grid' && (
                <CheckCircle className="w-4 h-4 text-emerald-700" />
              )}
            </div>
            <p className="text-xs text-neutral-600 leading-normal">
              Zero batteries. Exports surplus daytime solar power to the grid via net metering bill credit. Most cost-effective.
            </p>
          </button>

          {/* Option: Hybrid */}
          <button
            type="button"
            onClick={() => setSystemType('hybrid')}
            className={`p-4 rounded-xl border text-left transition-all cursor-pointer ${
              inputState.systemType === 'hybrid'
                ? 'border-emerald-600 bg-emerald-50/50 shadow-xs ring-1 ring-emerald-600'
                : 'border-neutral-200 hover:border-neutral-300 bg-white'
            }`}
          >
            <div className="flex items-center justify-between mb-1.5">
              <span className="font-bold text-neutral-900 text-sm flex items-center gap-1.5">
                <Battery className="w-4 h-4 text-amber-500" />
                Hybrid (Solar + Battery + Grid)
              </span>
              {inputState.systemType === 'hybrid' && (
                <CheckCircle className="w-4 h-4 text-emerald-700" />
              )}
            </div>
            <p className="text-xs text-neutral-600 leading-normal">
              Net metering with battery bank. Seamless UPS backup power during load shedding and grid outages.
            </p>
          </button>

          {/* Option: Off-Grid */}
          <button
            type="button"
            onClick={() => setSystemType('off-grid')}
            className={`p-4 rounded-xl border text-left transition-all cursor-pointer ${
              inputState.systemType === 'off-grid'
                ? 'border-emerald-600 bg-emerald-50/50 shadow-xs ring-1 ring-emerald-600'
                : 'border-neutral-200 hover:border-neutral-300 bg-white'
            }`}
          >
            <div className="flex items-center justify-between mb-1.5">
              <span className="font-bold text-neutral-900 text-sm flex items-center gap-1.5">
                <Sun className="w-4 h-4 text-amber-500" />
                Off-Grid (100% Standalone)
              </span>
              {inputState.systemType === 'off-grid' && (
                <CheckCircle className="w-4 h-4 text-emerald-700" />
              )}
            </div>
            <p className="text-xs text-neutral-600 leading-normal">
              100% independent system with full battery capacity. For remote areas, farms, and sites with no utility connection.
            </p>
          </button>
        </div>
      </div>

      {/* Step 2: Calculation Method Tabs */}
      <div className="mb-8">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 mb-3">
          <label className="text-xs font-bold text-neutral-500 uppercase tracking-wider">
            2. Choose Calculation Sizing Method
          </label>
          <span className="text-xs text-neutral-500">
            Based on solarsizecalculator.com sizing logic
          </span>
        </div>

        {/* Segmented Control Buttons */}
        <div className="flex items-center gap-1 p-1 bg-neutral-100 rounded-xl border border-neutral-200">
          <button
            type="button"
            onClick={() => setMode('bill')}
            className={`flex-1 py-2 px-3 text-xs font-bold rounded-lg transition-colors whitespace-nowrap cursor-pointer ${
              inputState.calculationMode === 'bill'
                ? 'bg-white text-neutral-900 shadow-xs border border-neutral-200'
                : 'text-neutral-600 hover:text-neutral-900'
            }`}
          >
            Monthly Electricity Bill (৳ BDT)
          </button>

          <button
            type="button"
            onClick={() => setMode('appliances')}
            className={`flex-1 py-2 px-3 text-xs font-bold rounded-lg transition-colors whitespace-nowrap cursor-pointer ${
              inputState.calculationMode === 'appliances'
                ? 'bg-white text-neutral-900 shadow-xs border border-neutral-200'
                : 'text-neutral-600 hover:text-neutral-900'
            }`}
          >
            Appliance Load Audit ({inputState.appliances.length} Items)
          </button>

          <button
            type="button"
            onClick={() => setMode('area')}
            className={`flex-1 py-2 px-3 text-xs font-bold rounded-lg transition-colors whitespace-nowrap cursor-pointer ${
              inputState.calculationMode === 'area'
                ? 'bg-white text-neutral-900 shadow-xs border border-neutral-200'
                : 'text-neutral-600 hover:text-neutral-900'
            }`}
          >
            Rooftop Available Space (Sq. Ft)
          </button>
        </div>
      </div>

      {/* Step 3: Interactive Inputs based on Mode */}
      <div className="p-6 rounded-xl bg-neutral-50 border border-neutral-200 mb-8">
        {inputState.calculationMode === 'bill' && (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div>
              <label className="block text-xs font-bold text-neutral-700 uppercase tracking-wider mb-1.5">
                Average Monthly Bill (BDT ৳)
              </label>
              <div className="relative">
                <span className="absolute left-3 top-2.5 text-sm font-bold text-neutral-500">৳</span>
                <input
                  type="number"
                  min={500}
                  step={100}
                  value={inputState.monthlyBill}
                  onChange={(e) =>
                    setInputState((prev) => ({
                      ...prev,
                      monthlyBill: Math.max(0, Number(e.target.value)),
                    }))
                  }
                  className="w-full pl-8 pr-4 py-2 bg-white border border-neutral-300 rounded-lg text-sm font-mono tabular-nums font-bold text-neutral-900 focus:outline-none focus:ring-2 focus:ring-emerald-700"
                />
              </div>
              <p className="text-[11px] text-neutral-500 mt-1">
                E.g., ৳4,500/mo (home) or ৳85,000/mo (factory)
              </p>
            </div>

            <div>
              <label className="block text-xs font-bold text-neutral-700 uppercase tracking-wider mb-1.5">
                Electricity Tariff (৳ / kWh unit)
              </label>
              <div className="relative">
                <span className="absolute left-3 top-2.5 text-sm font-bold text-neutral-500">৳</span>
                <input
                  type="number"
                  min={1}
                  step={0.1}
                  value={inputState.tariffPerKwh}
                  onChange={(e) =>
                    setInputState((prev) => ({
                      ...prev,
                      tariffPerKwh: Math.max(0.1, Number(e.target.value)),
                    }))
                  }
                  className="w-full pl-8 pr-4 py-2 bg-white border border-neutral-300 rounded-lg text-sm font-mono tabular-nums font-bold text-neutral-900 focus:outline-none focus:ring-2 focus:ring-emerald-700"
                />
              </div>
              <p className="text-[11px] text-neutral-500 mt-1">
                Bangladesh average: ৳9.5 to ৳12.5 per unit
              </p>
            </div>

            <div>
              <div className="flex justify-between items-center mb-1.5">
                <label className="text-xs font-bold text-neutral-700 uppercase tracking-wider">
                  Target Solar Offset
                </label>
                <span className="text-xs font-mono font-bold text-emerald-800">
                  {inputState.offsetPercentage}%
                </span>
              </div>
              <input
                type="range"
                min={25}
                max={100}
                step={5}
                value={inputState.offsetPercentage}
                onChange={(e) =>
                  setInputState((prev) => ({
                    ...prev,
                    offsetPercentage: Number(e.target.value),
                  }))
                }
                className="w-full h-2 bg-neutral-200 rounded-lg appearance-none cursor-pointer accent-emerald-800"
              />
              <div className="flex justify-between text-[10px] text-neutral-400 mt-1">
                <span>25% (Partial)</span>
                <span>75%</span>
                <span>100% (Zero Bill)</span>
              </div>
            </div>
          </div>
        )}

        {inputState.calculationMode === 'appliances' && (
          <div>
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
              <div>
                <h4 className="text-sm font-bold text-neutral-900">
                  Calculating from Appliance Load Schedule
                </h4>
                <p className="text-xs text-neutral-600 mt-0.5">
                  Currently configured: {inputState.appliances.length} items totaling{' '}
                  <span className="font-mono font-bold text-emerald-800">
                    {(inputState.appliances.reduce((s, i) => s + i.totalWattHours, 0) / 1000).toFixed(2)} kWh/day
                  </span>
                </p>
              </div>

              <button
                type="button"
                onClick={onOpenAudit}
                className="px-4 py-2 text-xs font-bold text-emerald-900 bg-emerald-100 hover:bg-emerald-200 rounded-lg transition-colors flex items-center gap-1.5 cursor-pointer self-start sm:self-auto"
              >
                <Sliders className="w-3.5 h-3.5" />
                <span>Edit / Add Appliances</span>
              </button>
            </div>
          </div>
        )}

        {inputState.calculationMode === 'area' && (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label className="block text-xs font-bold text-neutral-700 uppercase tracking-wider mb-1.5">
                Total Available Rooftop Area (Sq. Ft)
              </label>
              <input
                type="number"
                min={100}
                step={50}
                value={inputState.availableRoofAreaSqFt}
                onChange={(e) =>
                  setInputState((prev) => ({
                    ...prev,
                    availableRoofAreaSqFt: Math.max(50, Number(e.target.value)),
                  }))
                }
                className="w-full px-4 py-2 bg-white border border-neutral-300 rounded-lg text-sm font-mono tabular-nums font-bold text-neutral-900 focus:outline-none focus:ring-2 focus:ring-emerald-700"
              />
              <p className="text-[11px] text-neutral-500 mt-1">
                Typical RCC flat roof: 1,200 to 2,500 sq.ft | Factory: 10,000+ sq.ft
              </p>
            </div>

            <div>
              <div className="flex justify-between items-center mb-1.5">
                <label className="text-xs font-bold text-neutral-700 uppercase tracking-wider">
                  Usable Rooftop Ratio (Shading & Walkways)
                </label>
                <span className="text-xs font-mono font-bold text-emerald-800">
                  {inputState.usableAreaPercent}%
                </span>
              </div>
              <input
                type="range"
                min={40}
                max={95}
                step={5}
                value={inputState.usableAreaPercent}
                onChange={(e) =>
                  setInputState((prev) => ({
                    ...prev,
                    usableAreaPercent: Number(e.target.value),
                  }))
                }
                className="w-full h-2 bg-neutral-200 rounded-lg appearance-none cursor-pointer accent-emerald-800"
              />
              <div className="flex justify-between text-[10px] text-neutral-400 mt-1">
                <span>50% (High obstacles)</span>
                <span>75% (Standard)</span>
                <span>90% (Open Factory Shed)</span>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Step 4: Technical Hardware & Location Customization */}
      <div className="pt-6 border-t border-neutral-200">
        <label className="block text-xs font-bold text-neutral-500 uppercase tracking-wider mb-4">
          3. Environmental Location & Hardware Parameters
        </label>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {/* Location Presets */}
          <div>
            <label className="block text-xs font-bold text-neutral-700 uppercase tracking-wider mb-1.5">
              Site Location / Solar Insolation
            </label>
            <select
              value={inputState.selectedLocation}
              onChange={(e) => handleLocationChange(e.target.value)}
              className="w-full bg-white border border-neutral-300 rounded-lg px-3 py-2 text-sm text-neutral-900 focus:outline-none focus:ring-2 focus:ring-emerald-700"
            >
              {BANGLADESH_LOCATIONS.map((loc) => (
                <option key={loc.name} value={loc.name}>
                  {loc.name} ({loc.peakSunHours} Peak Sun Hours)
                </option>
              ))}
            </select>
            <div className="flex items-center gap-1.5 text-[11px] text-neutral-500 mt-1.5 font-mono">
              <Sun className="w-3.5 h-3.5 text-amber-500" />
              <span>Insolation: {inputState.peakSunHours} kWh/m²/day</span>
            </div>
          </div>

          {/* Panel Wattage */}
          <div>
            <label className="block text-xs font-bold text-neutral-700 uppercase tracking-wider mb-1.5">
              Solar Module Wattage
            </label>
            <select
              value={inputState.panelWattage}
              onChange={(e) =>
                setInputState((prev) => ({
                  ...prev,
                  panelWattage: Number(e.target.value),
                }))
              }
              className="w-full bg-white border border-neutral-300 rounded-lg px-3 py-2 text-sm text-neutral-900 focus:outline-none focus:ring-2 focus:ring-emerald-700"
            >
              {PANEL_OPTIONS.map((opt) => (
                <option key={opt.wattage} value={opt.wattage}>
                  {opt.label}
                </option>
              ))}
            </select>
            <p className="text-[11px] text-neutral-500 mt-1.5">
              High-efficiency mono-crystalline PERC / TOPCon modules
            </p>
          </div>

          {/* Battery Setup (if hybrid or off-grid) or System Derate */}
          <div>
            {inputState.systemType !== 'on-grid' ? (
              <div>
                <label className="block text-xs font-bold text-neutral-700 uppercase tracking-wider mb-1.5">
                  Battery Chemistry & Autonomy
                </label>
                <div className="grid grid-cols-2 gap-2">
                  <select
                    value={inputState.batteryChemistry}
                    onChange={(e) =>
                      setInputState((prev) => ({
                        ...prev,
                        batteryChemistry: e.target.value as 'lifepo4' | 'tubular_gel',
                      }))
                    }
                    className="w-full bg-white border border-neutral-300 rounded-lg px-2 py-2 text-xs text-neutral-900 focus:outline-none focus:ring-2 focus:ring-emerald-700"
                  >
                    <option value="lifepo4">LiFePO4 (Lithium 85% DoD)</option>
                    <option value="tubular_gel">Tubular GEL (50% DoD)</option>
                  </select>

                  <select
                    value={inputState.batteryAutonomyDays}
                    onChange={(e) =>
                      setInputState((prev) => ({
                        ...prev,
                        batteryAutonomyDays: Number(e.target.value),
                      }))
                    }
                    className="w-full bg-white border border-neutral-300 rounded-lg px-2 py-2 text-xs text-neutral-900 focus:outline-none focus:ring-2 focus:ring-emerald-700"
                  >
                    <option value={1}>1 Day Backup</option>
                    <option value={1.5}>1.5 Days Backup</option>
                    <option value={2}>2 Days Backup</option>
                    <option value={3}>3 Days Backup</option>
                  </select>
                </div>
                <p className="text-[11px] text-neutral-500 mt-1.5">
                  48V DC battery bank with smart BMS integration
                </p>
              </div>
            ) : (
              <div>
                <label className="block text-xs font-bold text-neutral-700 uppercase tracking-wider mb-1.5">
                  Inverter Safety Oversizing
                </label>
                <select
                  value={inputState.inverterOversizingRatio}
                  onChange={(e) =>
                    setInputState((prev) => ({
                      ...prev,
                      inverterOversizingRatio: Number(e.target.value),
                    }))
                  }
                  className="w-full bg-white border border-neutral-300 rounded-lg px-3 py-2 text-sm text-neutral-900 focus:outline-none focus:ring-2 focus:ring-emerald-700"
                >
                  <option value={1.15}>1.15x (Optimized Yield)</option>
                  <option value={1.20}>1.20x (Standard Industrial)</option>
                  <option value={1.25}>1.25x (High DC Loading)</option>
                </select>
                <p className="text-[11px] text-neutral-500 mt-1.5">
                  Compliant with Bangladesh Net Metering Guidelines
                </p>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};
