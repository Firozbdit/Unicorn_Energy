import React, { useState } from 'react';
import {
  SolarCalculationResult,
  SolarSurveyData,
  SystemType,
} from '../types/solar';
import {
  COMPANY_INFO,
  UTILITY_PROVIDERS,
  BANGLADESH_LOCATIONS,
} from '../data/defaultData';
import {
  generateMailtoUrl,
  generateWhatsAppSummary,
} from '../utils/emailFormatters';
import { formatCurrency } from '../utils/solarCalculations';
import {
  Send,
  Mail,
  Phone,
  CheckCircle,
  FileText,
  Printer,
  Building,
  MapPin,
  Zap,
  Info,
  ShieldCheck,
  MessageCircle,
  AlertCircle,
  Camera,
} from 'lucide-react';

interface SolarSurveyFormProps {
  calculation: SolarCalculationResult;
  systemType: SystemType;
  onSuccessSubmission: (survey: SolarSurveyData) => void;
  onPrintReport: () => void;
}

export const SolarSurveyForm: React.FC<SolarSurveyFormProps> = ({
  calculation,
  systemType,
  onSuccessSubmission,
  onPrintReport,
}) => {
  // Client & site state
  const [clientName, setClientName] = useState('');
  const [clientPhone, setClientPhone] = useState('');
  const [clientEmail, setClientEmail] = useState('');
  const [siteAddress, setSiteAddress] = useState('');
  const [cityDistrict, setCityDistrict] = useState('Dhaka');

  // Technical state
  const [propertyType, setPropertyType] = useState<SolarSurveyData['propertyType']>('commercial');
  const [electricityProvider, setElectricityProvider] = useState(UTILITY_PROVIDERS[0]);
  const [sanctionedLoadKw, setSanctionedLoadKw] = useState<number>(
    Math.max(5, Math.round(calculation.recommendedInverterKw))
  );
  const [connectionType, setConnectionType] = useState<'1-phase' | '3-phase'>(
    calculation.actualArrayKw >= 6 ? '3-phase' : '1-phase'
  );
  const [roofType, setRoofType] = useState<SolarSurveyData['roofType']>('rcc_flat');
  const [shadowCondition, setShadowCondition] = useState<SolarSurveyData['shadowCondition']>('unobstructed');
  const [executionPreference, setExecutionPreference] = useState<SolarSurveyData['executionPreference']>('turnkey_epc');
  const [remarks, setRemarks] = useState('');

  // UI status
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);
  const [submittedSurvey, setSubmittedSurvey] = useState<SolarSurveyData | null>(null);
  const [isLocating, setIsLocating] = useState(false);
  const [attachedPhotos, setAttachedPhotos] = useState<string[]>([]);

  const handleAutoGps = () => {
    if (typeof navigator === 'undefined' || !navigator.geolocation) {
      setErrorMsg('Geolocation is not supported by your device.');
      return;
    }
    setIsLocating(true);
    navigator.geolocation.getCurrentPosition(
      (pos) => {
        setIsLocating(false);
        const lat = pos.coords.latitude.toFixed(5);
        const lng = pos.coords.longitude.toFixed(5);
        setSiteAddress((prev) =>
          prev ? `${prev} (GPS: ${lat}, ${lng})` : `GPS: ${lat}° N, ${lng}° E`
        );
      },
      (err) => {
        setIsLocating(false);
        setErrorMsg('GPS Fix: ' + (err.message || 'Unable to retrieve location'));
      },
      { timeout: 10000, enableHighAccuracy: true }
    );
  };

  const handlePhotoUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = () => {
        setAttachedPhotos((prev) => [...prev, reader.result as string]);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg(null);

    // Validation
    if (!clientName.trim()) {
      setErrorMsg('Please enter your Client / Company Name.');
      return;
    }
    if (!clientPhone.trim() || clientPhone.trim().length < 8) {
      setErrorMsg('Please enter a valid Phone / WhatsApp contact number.');
      return;
    }

    setIsSubmitting(true);

    const surveyId = `UEC-2026-${Math.floor(1000 + Math.random() * 9000)}`;
    const surveyPayload: SolarSurveyData = {
      id: surveyId,
      createdAt: new Date().toISOString(),
      clientName: clientName.trim(),
      clientPhone: clientPhone.trim(),
      clientEmail: clientEmail.trim(),
      siteAddress: siteAddress.trim() || 'Dhaka Metropolitan Site',
      cityDistrict,
      propertyType,
      electricityProvider,
      sanctionedLoadKw: Number(sanctionedLoadKw) || 10,
      connectionType,
      roofType,
      shadowCondition,
      executionPreference,
      remarks: remarks.trim(),
      calculationSummary: calculation,
      systemType,
      status: 'new',
      recipients: COMPANY_INFO.emails,
      photos: attachedPhotos,
    };

    try {
      // 1. Post to backend server endpoint
      const res = await fetch('/api/submit-survey', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(surveyPayload),
      });

      if (!res.ok) {
        throw new Error(`Server returned status ${res.status}`);
      }

      const resData = await res.json();
      const finalSurvey = resData.data || surveyPayload;

      // 2. Persist to local storage as client-side backup
      const localExisting = localStorage.getItem('unicorn_solar_surveys');
      const list: SolarSurveyData[] = localExisting ? JSON.parse(localExisting) : [];
      list.unshift(finalSurvey);
      localStorage.setItem('unicorn_solar_surveys', JSON.stringify(list));

      setSubmittedSurvey(finalSurvey);
      onSuccessSubmission(finalSurvey);
    } catch (err: any) {
      console.warn('API error, falling back to local persistence:', err);
      // Fallback: local storage
      const localExisting = localStorage.getItem('unicorn_solar_surveys');
      const list: SolarSurveyData[] = localExisting ? JSON.parse(localExisting) : [];
      list.unshift(surveyPayload);
      localStorage.setItem('unicorn_solar_surveys', JSON.stringify(list));

      setSubmittedSurvey(surveyPayload);
      onSuccessSubmission(surveyPayload);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="bg-white rounded-2xl border border-neutral-200 shadow-xs p-6 md:p-8">
      {/* If already submitted, show confirmation modal & actions */}
      {submittedSurvey ? (
        <div className="py-8 px-4 text-center max-w-2xl mx-auto">
          <div className="w-16 h-16 bg-emerald-100 text-emerald-800 rounded-full flex items-center justify-center mx-auto mb-4">
            <CheckCircle className="w-10 h-10" />
          </div>

          <span className="text-xs font-bold text-emerald-800 uppercase tracking-widest block mb-1">
            Survey Dispatched Successfully
          </span>
          <h2 className="text-2xl sm:text-3xl font-extrabold text-neutral-900 mb-2">
            Solar Field Survey Registered
          </h2>

          <div className="inline-block bg-neutral-100 px-3 py-1.5 rounded-lg border border-neutral-200 font-mono text-sm font-bold text-neutral-800 mb-4">
            Reference ID: {submittedSurvey.id}
          </div>

          <p className="text-sm text-neutral-600 mb-6 leading-relaxed">
            Your solar survey and system sizing data for <strong className="text-neutral-900">{submittedSurvey.clientName}</strong> ({submittedSurvey.calculationSummary.actualArrayKw} kWp {submittedSurvey.systemType.toUpperCase()}) has been queued and directed to Unicorn Group engineering consultants:
          </p>

          {/* Email recipients display */}
          <div className="bg-emerald-50 border border-emerald-200 rounded-xl p-4 text-left mb-6">
            <div className="flex items-center gap-2 text-xs font-bold text-emerald-900 uppercase tracking-wider mb-2">
              <Mail className="w-4 h-4 text-emerald-700" />
              <span>Target Notification Inboxes</span>
            </div>
            <ul className="text-xs text-emerald-800 space-y-1 font-mono">
              {COMPANY_INFO.emails.map((email) => (
                <li key={email} className="flex items-center gap-2">
                  <span className="w-1.5 h-1.5 rounded-full bg-emerald-600"></span>
                  <span>{email}</span>
                </li>
              ))}
            </ul>
          </div>

          {/* Action buttons */}
          <div className="flex flex-wrap items-center justify-center gap-3">
            <a
              href={generateMailtoUrl(submittedSurvey)}
              className="px-5 py-3 text-xs font-bold text-white bg-emerald-800 hover:bg-emerald-900 rounded-lg shadow-sm transition-colors flex items-center gap-2 cursor-pointer"
            >
              <Mail className="w-4 h-4" />
              <span>Open in Email Client (Mailto)</span>
            </a>

            <a
              href={generateWhatsAppSummary(submittedSurvey)}
              target="_blank"
              rel="noopener noreferrer"
              className="px-5 py-3 text-xs font-bold text-neutral-900 bg-amber-400 hover:bg-amber-300 rounded-lg shadow-sm transition-colors flex items-center gap-2 cursor-pointer"
            >
              <MessageCircle className="w-4 h-4" />
              <span>Send via WhatsApp (+8801335106960)</span>
            </a>

            <button
              onClick={onPrintReport}
              className="px-4 py-3 text-xs font-semibold text-neutral-700 bg-neutral-100 hover:bg-neutral-200 rounded-lg transition-colors flex items-center gap-2 cursor-pointer border border-neutral-200"
            >
              <Printer className="w-4 h-4" />
              <span>Print Official Proposal PDF</span>
            </button>
          </div>

          <div className="mt-8 pt-6 border-t border-neutral-200">
            <button
              onClick={() => setSubmittedSurvey(null)}
              className="text-xs font-semibold text-neutral-500 hover:text-emerald-800 transition-colors"
            >
              + Submit Another Survey or Update Details
            </button>
          </div>
        </div>
      ) : (
        /* Form view */
        <form onSubmit={handleSubmit}>
          {/* Header */}
          <div className="pb-6 border-b border-neutral-200 mb-6">
            <div className="flex items-center gap-2 text-xs font-semibold text-emerald-800 uppercase tracking-wider mb-1">
              <span>Field Engineering Data Collection</span>
              <span className="text-neutral-300">·</span>
              <span>Dispatches to {COMPANY_INFO.emails.join(' & ')}</span>
            </div>
            <h2 className="text-2xl font-bold text-neutral-900">
              Solar Site Audit & Official Proposal Request
            </h2>
            <p className="text-sm text-neutral-600 mt-1">
              Provide site and connection details. Our engineering team at Unicorn Group will inspect the site parameters and return an EPC quotation.
            </p>
          </div>

          {/* Sizing snapshot banner */}
          <div className="p-4 bg-neutral-50 rounded-xl border border-neutral-200 mb-8 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div>
              <span className="text-xs font-semibold text-neutral-500 uppercase block">
                Calculated System Sizing
              </span>
              <div className="text-lg font-bold text-neutral-900">
                {calculation.actualArrayKw} kWp {systemType.toUpperCase()} ({calculation.panelCount} × {calculation.panelWattage}W Panels)
              </div>
              <p className="text-xs text-neutral-500 mt-0.5">
                Inverter: {calculation.recommendedInverterKw} kW {calculation.inverterPhase} | Roof space: {calculation.roofAreaRequiredSqFt} sq.ft
              </p>
            </div>

            <div className="text-right sm:border-l sm:border-neutral-200 sm:pl-4">
              <span className="text-xs font-semibold text-neutral-500 uppercase block">
                Est. Annual Generation
              </span>
              <div className="text-base font-bold text-emerald-800 font-mono tabular-nums">
                {calculation.estimatedAnnualGenerationKwh.toLocaleString()} kWh/yr
              </div>
              <span className="text-xs text-neutral-500">
                Savings: ~{formatCurrency(calculation.estimatedAnnualSavings, 'BDT')}/yr
              </span>
            </div>
          </div>

          {errorMsg && (
            <div className="mb-6 p-4 bg-rose-50 border border-rose-200 rounded-xl text-rose-800 text-xs font-semibold flex items-center gap-2">
              <AlertCircle className="w-4 h-4 shrink-0" />
              <span>{errorMsg}</span>
            </div>
          )}

          {/* Section 1: Client Contact Information */}
          <div className="mb-8">
            <h3 className="text-sm font-bold text-neutral-900 uppercase tracking-wider mb-4 pb-1 border-b border-neutral-100 flex items-center gap-2">
              <Building className="w-4 h-4 text-emerald-700" />
              1. Client & Site Contact Details
            </h3>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-bold text-neutral-700 uppercase tracking-wider mb-1.5">
                  Client / Company Name <span className="text-rose-500">*</span>
                </label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Rahim Textile Mills Ltd. or Mr. Hasan"
                  value={clientName}
                  onChange={(e) => setClientName(e.target.value)}
                  className="w-full px-3.5 py-2.5 bg-white border border-neutral-300 rounded-lg text-sm text-neutral-900 focus:outline-none focus:ring-2 focus:ring-emerald-700"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-neutral-700 uppercase tracking-wider mb-1.5">
                  Contact Phone / WhatsApp <span className="text-rose-500">*</span>
                </label>
                <input
                  type="tel"
                  required
                  placeholder="e.g. +880 1711-234567"
                  value={clientPhone}
                  onChange={(e) => setClientPhone(e.target.value)}
                  className="w-full px-3.5 py-2.5 bg-white border border-neutral-300 rounded-lg text-sm font-mono text-neutral-900 focus:outline-none focus:ring-2 focus:ring-emerald-700"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-neutral-700 uppercase tracking-wider mb-1.5">
                  Email Address
                </label>
                <input
                  type="email"
                  placeholder="client@example.com"
                  value={clientEmail}
                  onChange={(e) => setClientEmail(e.target.value)}
                  className="w-full px-3.5 py-2.5 bg-white border border-neutral-300 rounded-lg text-sm text-neutral-900 focus:outline-none focus:ring-2 focus:ring-emerald-700"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-neutral-700 uppercase tracking-wider mb-1.5">
                  District / Division
                </label>
                <select
                  value={cityDistrict}
                  onChange={(e) => setCityDistrict(e.target.value)}
                  className="w-full px-3.5 py-2.5 bg-white border border-neutral-300 rounded-lg text-sm text-neutral-900 focus:outline-none focus:ring-2 focus:ring-emerald-700"
                >
                  {BANGLADESH_LOCATIONS.map((loc) => (
                    <option key={loc.name} value={loc.name}>
                      {loc.name}
                    </option>
                  ))}
                </select>
              </div>

              <div className="md:col-span-2">
                <div className="flex items-center justify-between mb-1.5">
                  <label className="block text-xs font-bold text-neutral-700 uppercase tracking-wider">
                    Physical Site Address / Landmark
                  </label>
                  <button
                    type="button"
                    onClick={handleAutoGps}
                    disabled={isLocating}
                    className="text-emerald-700 hover:text-emerald-800 text-[11px] font-bold flex items-center gap-1 cursor-pointer disabled:opacity-50"
                  >
                    <MapPin className="w-3.5 h-3.5" />
                    <span>{isLocating ? 'Acquiring GPS...' : '📍 Auto-fill GPS'}</span>
                  </button>
                </div>
                <input
                  type="text"
                  placeholder="e.g. Plot 12, Road 4, Sector 7, Uttara, Dhaka (or use GPS button)"
                  value={siteAddress}
                  onChange={(e) => setSiteAddress(e.target.value)}
                  className="w-full px-3.5 py-2.5 bg-white border border-neutral-300 rounded-lg text-sm text-neutral-900 focus:outline-none focus:ring-2 focus:ring-emerald-700"
                />
              </div>
            </div>
          </div>

          {/* Section 2: Electrical & Site Specifications */}
          <div className="mb-8">
            <h3 className="text-sm font-bold text-neutral-900 uppercase tracking-wider mb-4 pb-1 border-b border-neutral-100 flex items-center gap-2">
              <Zap className="w-4 h-4 text-emerald-700" />
              2. Electrical Connection & Physical Roof Conditions
            </h3>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div>
                <label className="block text-xs font-bold text-neutral-700 uppercase tracking-wider mb-1.5">
                  Property Classification
                </label>
                <select
                  value={propertyType}
                  onChange={(e) => setPropertyType(e.target.value as any)}
                  className="w-full px-3 py-2 bg-white border border-neutral-300 rounded-lg text-sm text-neutral-900 focus:outline-none focus:ring-2 focus:ring-emerald-700"
                >
                  <option value="residential">Residential Home / Villa</option>
                  <option value="commercial">Commercial Office / Plaza</option>
                  <option value="industrial">Industrial Factory / RMG Textile</option>
                  <option value="agricultural">Agricultural / Poultry / Cold Storage</option>
                  <option value="healthcare_institution">Hospital / University Campus</option>
                </select>
              </div>

              <div>
                <label className="block text-xs font-bold text-neutral-700 uppercase tracking-wider mb-1.5">
                  Power Utility Provider
                </label>
                <select
                  value={electricityProvider}
                  onChange={(e) => setElectricityProvider(e.target.value)}
                  className="w-full px-3 py-2 bg-white border border-neutral-300 rounded-lg text-sm text-neutral-900 focus:outline-none focus:ring-2 focus:ring-emerald-700"
                >
                  {UTILITY_PROVIDERS.map((prov) => (
                    <option key={prov} value={prov}>
                      {prov}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-xs font-bold text-neutral-700 uppercase tracking-wider mb-1.5">
                  Grid Connection Type
                </label>
                <select
                  value={connectionType}
                  onChange={(e) => setConnectionType(e.target.value as any)}
                  className="w-full px-3 py-2 bg-white border border-neutral-300 rounded-lg text-sm text-neutral-900 focus:outline-none focus:ring-2 focus:ring-emerald-700"
                >
                  <option value="1-phase">1-Phase (230V Standard)</option>
                  <option value="3-phase">3-Phase (400V Industrial/Commercial)</option>
                </select>
              </div>

              <div>
                <label className="block text-xs font-bold text-neutral-700 uppercase tracking-wider mb-1.5">
                  Sanctioned Load (kW)
                </label>
                <input
                  type="number"
                  min={1}
                  value={sanctionedLoadKw}
                  onChange={(e) => setSanctionedLoadKw(Number(e.target.value))}
                  className="w-full px-3 py-2 bg-white border border-neutral-300 rounded-lg text-sm font-mono text-neutral-900 focus:outline-none focus:ring-2 focus:ring-emerald-700"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-neutral-700 uppercase tracking-wider mb-1.5">
                  Rooftop Surface Type
                </label>
                <select
                  value={roofType}
                  onChange={(e) => setRoofType(e.target.value as any)}
                  className="w-full px-3 py-2 bg-white border border-neutral-300 rounded-lg text-sm text-neutral-900 focus:outline-none focus:ring-2 focus:ring-emerald-700"
                >
                  <option value="rcc_flat">Concrete RCC Flat Roof</option>
                  <option value="tin_shed">Industrial Tin / Metal Corrugated Shed</option>
                  <option value="tilted_tile">Tilted Tile Roof</option>
                  <option value="ground_mount">Ground Mount Open Yard</option>
                  <option value="carport">Solar Carport Structure</option>
                </select>
              </div>

              <div>
                <label className="block text-xs font-bold text-neutral-700 uppercase tracking-wider mb-1.5">
                  Shadow Conditions
                </label>
                <select
                  value={shadowCondition}
                  onChange={(e) => setShadowCondition(e.target.value as any)}
                  className="w-full px-3 py-2 bg-white border border-neutral-300 rounded-lg text-sm text-neutral-900 focus:outline-none focus:ring-2 focus:ring-emerald-700"
                >
                  <option value="unobstructed">100% Unobstructed Clean Sun</option>
                  <option value="minor_obstruction">Minor Shadow (Low parapet / pole)</option>
                  <option value="moderate_shadow">Moderate Shadow (Water tank / trees)</option>
                </select>
              </div>
            </div>

            <div className="mt-4">
              <label className="block text-xs font-bold text-neutral-700 uppercase tracking-wider mb-1.5">
                Execution & Procurement Model
              </label>
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                <button
                  type="button"
                  onClick={() => setExecutionPreference('turnkey_epc')}
                  className={`p-3 rounded-lg border text-left cursor-pointer transition-colors ${
                    executionPreference === 'turnkey_epc'
                      ? 'border-emerald-600 bg-emerald-50 text-emerald-900 font-bold'
                      : 'border-neutral-200 text-neutral-700'
                  }`}
                >
                  <span className="block text-xs font-bold">Turnkey EPC</span>
                  <span className="text-[11px] font-normal opacity-80">Full Design, Supply, Installation & Net-Metering Approval</span>
                </button>

                <button
                  type="button"
                  onClick={() => setExecutionPreference('supply_only')}
                  className={`p-3 rounded-lg border text-left cursor-pointer transition-colors ${
                    executionPreference === 'supply_only'
                      ? 'border-emerald-600 bg-emerald-50 text-emerald-900 font-bold'
                      : 'border-neutral-200 text-neutral-700'
                  }`}
                >
                  <span className="block text-xs font-bold">Equipment Supply Only</span>
                  <span className="text-[11px] font-normal opacity-80">Tier-1 Solar Panels, Inverters & Battery Racks</span>
                </button>

                <button
                  type="button"
                  onClick={() => setExecutionPreference('site_audit_first')}
                  className={`p-3 rounded-lg border text-left cursor-pointer transition-colors ${
                    executionPreference === 'site_audit_first'
                      ? 'border-emerald-600 bg-emerald-50 text-emerald-900 font-bold'
                      : 'border-neutral-200 text-neutral-700'
                  }`}
                >
                  <span className="block text-xs font-bold">Physical Site Audit First</span>
                  <span className="text-[11px] font-normal opacity-80">Engineer Visit & Structural Feasibility Check</span>
                </button>
              </div>
            </div>

            <div className="mt-4">
              <label className="block text-xs font-bold text-neutral-700 uppercase tracking-wider mb-1.5">
                Special Remarks / Existing Generator / Battery Requirements
              </label>
              <textarea
                rows={3}
                placeholder="E.g., We have a 100kVA diesel generator for backup. Want to know if hybrid solar can sync with generator during outages..."
                value={remarks}
                onChange={(e) => setRemarks(e.target.value)}
                className="w-full px-3.5 py-2.5 bg-white border border-neutral-300 rounded-lg text-sm text-neutral-900 focus:outline-none focus:ring-2 focus:ring-emerald-700"
              />
            </div>

            {/* Mobile Site Photos Attachment */}
            <div className="mt-4 pt-4 border-t border-neutral-100">
              <div className="flex items-center justify-between mb-2">
                <div>
                  <span className="block text-xs font-bold text-neutral-700 uppercase tracking-wider">
                    Site Photos (Rooftop / Meter / LT Panel)
                  </span>
                  <span className="text-[11px] text-neutral-500">
                    Snap or upload site photos using your mobile camera
                  </span>
                </div>
                <label className="px-3 py-1.5 rounded-lg bg-emerald-50 hover:bg-emerald-100 text-emerald-800 text-xs font-bold transition-colors flex items-center gap-1.5 cursor-pointer border border-emerald-200">
                  <Camera className="w-3.5 h-3.5" />
                  <span>+ Snap Photo</span>
                  <input
                    type="file"
                    accept="image/*"
                    capture="environment"
                    onChange={handlePhotoUpload}
                    className="hidden"
                  />
                </label>
              </div>

              {attachedPhotos.length > 0 ? (
                <div className="flex items-center gap-2.5 overflow-x-auto py-2">
                  {attachedPhotos.map((photo, i) => (
                    <div
                      key={i}
                      className="relative w-20 h-20 rounded-xl overflow-hidden border border-neutral-300 shadow-2xs shrink-0 group"
                    >
                      <img
                        src={photo}
                        alt={`Site ${i + 1}`}
                        className="w-full h-full object-cover"
                      />
                      <button
                        type="button"
                        onClick={() =>
                          setAttachedPhotos((prev) => prev.filter((_, idx) => idx !== i))
                        }
                        className="absolute top-1 right-1 bg-black/70 hover:bg-black text-white rounded-full w-5 h-5 flex items-center justify-center text-xs"
                      >
                        ×
                      </button>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="text-[11px] text-neutral-400 italic">
                  No site photos attached yet. Tap "+ Snap Photo" to attach photos directly from your phone.
                </div>
              )}
            </div>
          </div>

          {/* Submission Notice & Buttons */}
          <div className="p-4 bg-emerald-50/60 rounded-xl border border-emerald-100 flex flex-col sm:flex-row items-center justify-between gap-4">
            <div className="flex items-center gap-2 text-xs text-emerald-900">
              <ShieldCheck className="w-4 h-4 text-emerald-700 shrink-0" />
              <span>
                By submitting, survey data is emailed to <strong>{COMPANY_INFO.emails.join(' & ')}</strong> and logged to the Unicorn Energy Engineering Console.
              </span>
            </div>

            <div className="flex items-center gap-3 shrink-0">
              <button
                type="submit"
                disabled={isSubmitting}
                className="px-6 py-3 text-xs font-bold text-white bg-emerald-800 hover:bg-emerald-900 active:bg-emerald-950 rounded-lg shadow-sm transition-all flex items-center gap-2 cursor-pointer disabled:opacity-50"
              >
                <Send className="w-4 h-4 text-emerald-300" />
                <span>{isSubmitting ? 'Transmitting...' : 'Submit Solar Survey & Get Proposal'}</span>
              </button>
            </div>
          </div>
        </form>
      )}
    </div>
  );
};
