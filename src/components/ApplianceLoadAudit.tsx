import React, { useState } from 'react';
import { ApplianceItem } from '../types/solar';
import { PRESET_APPLIANCE_TEMPLATES } from '../data/defaultData';
import { Plus, Trash2, Zap, RotateCcw, CheckCircle, Info } from 'lucide-react';

interface ApplianceLoadAuditProps {
  appliances: ApplianceItem[];
  setAppliances: React.Dispatch<React.SetStateAction<ApplianceItem[]>>;
  onApplyToCalculator: () => void;
}

export const ApplianceLoadAudit: React.FC<ApplianceLoadAuditProps> = ({
  appliances,
  setAppliances,
  onApplyToCalculator,
}) => {
  const [selectedPresetIndex, setSelectedPresetIndex] = useState<number>(0);
  const [customName, setCustomName] = useState<string>('');
  const [customWatts, setCustomWatts] = useState<number>(100);
  const [customQty, setCustomQty] = useState<number>(1);
  const [customHours, setCustomHours] = useState<number>(6);

  // Update quantity of an item
  const updateQty = (id: string, newQty: number) => {
    if (newQty < 1) return;
    setAppliances((prev) =>
      prev.map((item) =>
        item.id === id
          ? {
              ...item,
              quantity: newQty,
              totalWattHours: item.watts * newQty * item.dailyHours,
            }
          : item
      )
    );
  };

  // Update daily hours of an item
  const updateHours = (id: string, newHours: number) => {
    const clamped = Math.max(0.5, Math.min(24, newHours));
    setAppliances((prev) =>
      prev.map((item) =>
        item.id === id
          ? {
              ...item,
              dailyHours: clamped,
              totalWattHours: Math.round(item.watts * item.quantity * clamped),
            }
          : item
      )
    );
  };

  // Update wattage of an item
  const updateWatts = (id: string, newWatts: number) => {
    if (newWatts < 1) return;
    setAppliances((prev) =>
      prev.map((item) =>
        item.id === id
          ? {
              ...item,
              watts: newWatts,
              totalWattHours: Math.round(newWatts * item.quantity * item.dailyHours),
            }
          : item
      )
    );
  };

  // Remove appliance
  const removeAppliance = (id: string) => {
    setAppliances((prev) => prev.filter((item) => item.id !== id));
  };

  // Add from preset
  const addPresetAppliance = () => {
    const template = PRESET_APPLIANCE_TEMPLATES[selectedPresetIndex];
    if (!template) return;

    const newItem: ApplianceItem = {
      id: `app-${Date.now()}-${Math.random().toString(36).substring(2, 6)}`,
      name: template.name,
      category: template.category,
      watts: template.watts,
      quantity: 1,
      dailyHours: 6,
      totalWattHours: template.watts * 1 * 6,
    };

    setAppliances((prev) => [...prev, newItem]);
  };

  // Add custom appliance
  const addCustomAppliance = (e: React.FormEvent) => {
    e.preventDefault();
    if (!customName.trim()) return;

    const newItem: ApplianceItem = {
      id: `custom-${Date.now()}`,
      name: customName.trim(),
      category: 'other',
      watts: Number(customWatts) || 100,
      quantity: Number(customQty) || 1,
      dailyHours: Number(customHours) || 4,
      totalWattHours: Math.round((Number(customWatts) || 100) * (Number(customQty) || 1) * (Number(customHours) || 4)),
    };

    setAppliances((prev) => [...prev, newItem]);
    setCustomName('');
    setCustomWatts(100);
    setCustomQty(1);
    setCustomHours(6);
  };

  // Totals calculations
  const totalConnectedWatts = appliances.reduce((sum, item) => sum + item.watts * item.quantity, 0);
  const totalDailyWattHours = appliances.reduce((sum, item) => sum + item.totalWattHours, 0);
  const totalDailyKwh = (totalDailyWattHours / 1000).toFixed(2);
  const totalMonthlyKwh = Math.round((totalDailyWattHours * 30) / 1000);

  return (
    <div className="bg-white rounded-2xl border border-neutral-200 shadow-xs p-6 md:p-8">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 pb-6 border-b border-neutral-200">
        <div>
          <div className="flex items-center gap-2 text-xs font-semibold text-emerald-800 uppercase tracking-wider mb-1">
            <span>Electrical Load Sizing</span>
            <span className="text-neutral-300">·</span>
            <span>solarsizecalculator.com Engine</span>
          </div>
          <h2 className="text-2xl font-bold text-neutral-900">
            Comprehensive Appliance & Load Audit
          </h2>
          <p className="text-sm text-neutral-600 mt-1">
            Calculate your exact daily watt-hours and peak power demand for homes, offices, or factories.
          </p>
        </div>

        {/* Live Load Badges */}
        <div className="flex items-center gap-3">
          <div className="px-4 py-2 bg-neutral-50 rounded-xl border border-neutral-200 text-right">
            <span className="text-[11px] font-semibold text-neutral-500 uppercase block">
              Connected Load
            </span>
            <span className="text-lg font-bold text-neutral-900 font-mono tabular-nums">
              {(totalConnectedWatts / 1000).toFixed(2)} kW
            </span>
          </div>

          <div className="px-4 py-2 bg-emerald-50 rounded-xl border border-emerald-200 text-right">
            <span className="text-[11px] font-semibold text-emerald-700 uppercase block">
              Daily Energy
            </span>
            <span className="text-lg font-bold text-emerald-900 font-mono tabular-nums">
              {totalDailyKwh} kWh/day
            </span>
          </div>
        </div>
      </div>

      {/* Add New Appliances Controls */}
      <div className="my-6 grid grid-cols-1 lg:grid-cols-12 gap-6 bg-neutral-50 p-5 rounded-xl border border-neutral-200">
        {/* Presets dropdown */}
        <div className="lg:col-span-5">
          <label className="block text-xs font-bold text-neutral-700 uppercase tracking-wider mb-2">
            Quick Add from Standard Appliances
          </label>
          <div className="flex gap-2">
            <select
              value={selectedPresetIndex}
              onChange={(e) => setSelectedPresetIndex(Number(e.target.value))}
              aria-label="Quick Add from Standard Appliances"
              className="flex-1 bg-white border border-neutral-300 rounded-lg px-3 py-2 text-sm text-neutral-900 focus:outline-none focus:ring-2 focus:ring-emerald-700"
            >
              {PRESET_APPLIANCE_TEMPLATES.map((tmpl, idx) => (
                <option key={idx} value={idx}>
                  {tmpl.name} ({tmpl.watts}W)
                </option>
              ))}
            </select>
            <button
              onClick={addPresetAppliance}
              className="px-4 py-2 text-xs font-bold text-white bg-emerald-800 hover:bg-emerald-900 active:bg-emerald-950 rounded-lg transition-colors flex items-center gap-1.5 cursor-pointer whitespace-nowrap"
            >
              <Plus className="w-4 h-4" />
              <span>Add Item</span>
            </button>
          </div>
        </div>

        {/* Custom appliance entry */}
        <form onSubmit={addCustomAppliance} className="lg:col-span-7">
          <label className="block text-xs font-bold text-neutral-700 uppercase tracking-wider mb-2">
            Or Add Custom Equipment / Machine
          </label>
          <div className="grid grid-cols-2 sm:grid-cols-5 gap-2">
            <input
              type="text"
              placeholder="Appliance name (e.g. Water Heater)"
              value={customName}
              onChange={(e) => setCustomName(e.target.value)}
              className="col-span-2 bg-white border border-neutral-300 rounded-lg px-3 py-2 text-sm text-neutral-900 focus:outline-none focus:ring-2 focus:ring-emerald-700"
            />
            <input
              type="number"
              placeholder="Watts"
              min={1}
              value={customWatts}
              onChange={(e) => setCustomWatts(Number(e.target.value))}
              className="bg-white border border-neutral-300 rounded-lg px-2 py-2 text-sm text-neutral-900 focus:outline-none focus:ring-2 focus:ring-emerald-700 text-center font-mono tabular-nums"
              title="Rated power in Watts"
            />
            <input
              type="number"
              placeholder="Qty"
              min={1}
              value={customQty}
              onChange={(e) => setCustomQty(Number(e.target.value))}
              className="bg-white border border-neutral-300 rounded-lg px-2 py-2 text-sm text-neutral-900 focus:outline-none focus:ring-2 focus:ring-emerald-700 text-center font-mono tabular-nums"
              title="Quantity"
            />
            <button
              type="submit"
              className="px-3 py-2 text-xs font-bold text-neutral-800 bg-neutral-200 hover:bg-neutral-300 rounded-lg transition-colors flex items-center justify-center gap-1 cursor-pointer whitespace-nowrap"
            >
              <Plus className="w-3.5 h-3.5" />
              <span>Add</span>
            </button>
          </div>
        </form>
      </div>

      {/* Appliance Table */}
      <div className="overflow-x-auto rounded-xl border border-neutral-200">
        <table className="w-full text-left text-sm text-neutral-800">
          <thead className="bg-neutral-100 text-[11px] font-bold uppercase tracking-wider text-neutral-600 border-b border-neutral-200">
            <tr>
              <th className="py-3 px-4">Appliance / Equipment</th>
              <th className="py-3 px-4 text-center">Rated Power (W)</th>
              <th className="py-3 px-4 text-center">Quantity</th>
              <th className="py-3 px-4 text-center">Daily Usage (Hrs)</th>
              <th className="py-3 px-4 text-right">Daily Energy (Wh)</th>
              <th className="py-3 px-4 text-center">Action</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-neutral-200 bg-white">
            {appliances.length === 0 ? (
              <tr>
                <td colSpan={6} className="py-8 text-center text-neutral-400 text-sm">
                  No appliances added yet. Use the presets above to add your appliances.
                </td>
              </tr>
            ) : (
              appliances.map((item) => (
                <tr key={item.id} className="hover:bg-neutral-50 transition-colors">
                  <td className="py-3 px-4 font-semibold text-neutral-900">
                    {item.name}
                  </td>

                  {/* Editable Watts */}
                  <td className="py-3 px-4 text-center">
                    <input
                      type="number"
                      min={1}
                      value={item.watts}
                      onChange={(e) => updateWatts(item.id, Number(e.target.value))}
                      className="w-20 px-2 py-1 text-center text-xs font-mono tabular-nums border border-neutral-300 rounded-md focus:ring-1 focus:ring-emerald-600"
                    />
                  </td>

                  {/* Quantity Stepper */}
                  <td className="py-3 px-4 text-center">
                    <div className="inline-flex items-center gap-1 border border-neutral-200 rounded-lg p-0.5 bg-neutral-50">
                      <button
                        onClick={() => updateQty(item.id, item.quantity - 1)}
                        className="w-6 h-6 flex items-center justify-center text-xs font-bold text-neutral-600 hover:bg-white rounded transition-colors"
                      >
                        -
                      </button>
                      <span className="w-8 text-center text-xs font-mono font-bold tabular-nums">
                        {item.quantity}
                      </span>
                      <button
                        onClick={() => updateQty(item.id, item.quantity + 1)}
                        className="w-6 h-6 flex items-center justify-center text-xs font-bold text-neutral-600 hover:bg-white rounded transition-colors"
                      >
                        +
                      </button>
                    </div>
                  </td>

                  {/* Daily Hours */}
                  <td className="py-3 px-4 text-center">
                    <div className="inline-flex items-center gap-1">
                      <input
                        type="number"
                        min={0.5}
                        max={24}
                        step={0.5}
                        value={item.dailyHours}
                        onChange={(e) => updateHours(item.id, parseFloat(e.target.value))}
                        className="w-16 px-2 py-1 text-center text-xs font-mono tabular-nums border border-neutral-300 rounded-md focus:ring-1 focus:ring-emerald-600"
                      />
                      <span className="text-xs text-neutral-500">h</span>
                    </div>
                  </td>

                  {/* Daily Energy Wh */}
                  <td className="py-3 px-4 text-right font-mono font-semibold tabular-nums text-emerald-800">
                    {item.totalWattHours.toLocaleString()} Wh
                  </td>

                  {/* Delete Action */}
                  <td className="py-3 px-4 text-center">
                    <button
                      onClick={() => removeAppliance(item.id)}
                      className="p-1.5 text-neutral-400 hover:text-rose-600 transition-colors rounded hover:bg-rose-50"
                      title="Remove appliance"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </td>
                </tr>
              ))
            )}
          </tbody>
          <tfoot className="bg-neutral-100/70 border-t-2 border-neutral-200 font-bold text-neutral-900">
            <tr>
              <td className="py-3.5 px-4">Total Load Demand</td>
              <td className="py-3.5 px-4 text-center font-mono tabular-nums">
                {totalConnectedWatts.toLocaleString()} W
              </td>
              <td className="py-3.5 px-4 text-center font-mono tabular-nums">
                {appliances.reduce((s, i) => s + i.quantity, 0)} Units
              </td>
              <td className="py-3.5 px-4 text-center text-xs font-normal text-neutral-500">
                Sum of running loads
              </td>
              <td className="py-3.5 px-4 text-right font-mono tabular-nums text-emerald-800 text-base">
                {totalDailyWattHours.toLocaleString()} Wh/day ({totalDailyKwh} kWh)
              </td>
              <td className="py-3.5 px-4"></td>
            </tr>
          </tfoot>
        </table>
      </div>

      {/* Action Footer */}
      <div className="mt-6 flex flex-col sm:flex-row items-center justify-between gap-4 pt-6 border-t border-neutral-200">
        <div className="flex items-center gap-2 text-xs text-neutral-500">
          <Info className="w-4 h-4 text-emerald-700 shrink-0" />
          <span>
            Total calculated monthly demand: <strong className="text-neutral-800 font-mono">{totalMonthlyKwh} kWh/month</strong>
          </span>
        </div>

        <button
          onClick={onApplyToCalculator}
          className="px-6 py-3 text-sm font-bold text-white bg-emerald-800 hover:bg-emerald-900 active:bg-emerald-950 rounded-lg shadow-sm transition-all flex items-center gap-2 cursor-pointer"
        >
          <CheckCircle className="w-4 h-4 text-emerald-300" />
          <span>Apply Load Sizing to Solar Calculator</span>
        </button>
      </div>
    </div>
  );
};
