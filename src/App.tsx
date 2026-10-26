import React, { useState, useEffect, useMemo } from 'react';
import {
  SolarInputState,
  SolarCalculationResult,
  SolarSurveyData,
} from './types/solar';
import { DEFAULT_APPLIANCES } from './data/defaultData';
import { calculateSolarSystem } from './utils/solarCalculations';
import { Navbar } from './components/Navbar';
import { MobileHeader } from './components/MobileHeader';
import { HeroSection } from './components/HeroSection';
import { SolarCalculator } from './components/SolarCalculator';
import { ApplianceLoadAudit } from './components/ApplianceLoadAudit';
import { SizingResults } from './components/SizingResults';
import { SolarSurveyForm } from './components/SolarSurveyForm';
import { SubmissionsDrawer } from './components/SubmissionsDrawer';
import { AboutUnicornGroup } from './components/AboutUnicornGroup';
import { AISolarAdvisor } from './components/AISolarAdvisor';
import { AndroidMobileNav } from './components/AndroidMobileNav';
import { MobileFieldTools } from './components/MobileFieldTools';
import { MobileStickySummary } from './components/MobileStickySummary';
import { OfflineIndicator } from './components/OfflineIndicator';
import { PrintableProposal } from './components/PrintableProposal';
import { Footer } from './components/Footer';
import { useOnlineStatus } from './hooks/useOnlineStatus';

export type AppTab =
  | 'calculator'
  | 'load-audit'
  | 'survey'
  | 'submissions'
  | 'about'
  | 'ai-advisor'
  | 'tools';

export default function App() {
  // Navigation active tab
  const [activeTab, setActiveTab] = useState<AppTab>('calculator');
  const isOnline = useOnlineStatus();

  // Core Solar inputs state
  const [inputState, setInputState] = useState<SolarInputState>({
    calculationMode: 'bill',
    systemType: 'on-grid',

    // Bill mode defaults
    monthlyBill: 5500,
    tariffPerKwh: 9.5,
    monthlyKwh: 580,
    offsetPercentage: 100,

    // Appliances schedule
    appliances: DEFAULT_APPLIANCES,

    // Rooftop area mode
    availableRoofAreaSqFt: 1800,
    usableAreaPercent: 75,

    // Location
    selectedLocation: 'Dhaka',
    peakSunHours: 4.8,
    systemLossFactor: 0.18, // 18% standard derating

    // Hardware
    panelWattage: 550,
    panelEfficiency: 21.5,
    inverterOversizingRatio: 1.2,

    // Storage
    batteryAutonomyDays: 1,
    batteryChemistry: 'lifepo4',
    depthOfDischarge: 0.85,
    systemVoltage: 48,

    currency: 'BDT',
  });

  // Submitted surveys list
  const [surveys, setSurveys] = useState<SolarSurveyData[]>([]);
  // Printable proposal modal target
  const [surveyToPrint, setSurveyToPrint] = useState<SolarSurveyData | null>(null);

  // Live calculation of system sizing
  const calculationResult: SolarCalculationResult = useMemo(() => {
    return calculateSolarSystem(inputState);
  }, [inputState]);

  // Fetch surveys from server on mount with localStorage fallback
  useEffect(() => {
    const loadSurveys = async () => {
      try {
        const res = await fetch('/api/surveys');
        if (res.ok) {
          const json = await res.json();
          if (json.data && Array.isArray(json.data)) {
            // Merge with local storage
            const localSaved = localStorage.getItem('unicorn_solar_surveys');
            const localList: SolarSurveyData[] = localSaved ? JSON.parse(localSaved) : [];
            const mergedMap = new Map<string, SolarSurveyData>();

            json.data.forEach((item: SolarSurveyData) => mergedMap.set(item.id, item));
            localList.forEach((item: SolarSurveyData) => mergedMap.set(item.id, item));

            const finalArr = Array.from(mergedMap.values()).sort(
              (a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
            );
            setSurveys(finalArr);
            return;
          }
        }
      } catch (err) {
        console.warn('Backend server not reachable yet, using local storage fallback:', err);
      }

      // Local storage fallback
      const localSaved = localStorage.getItem('unicorn_solar_surveys');
      if (localSaved) {
        try {
          setSurveys(JSON.parse(localSaved));
        } catch {
          // ignore error
        }
      }
    };

    loadSurveys();
  }, []);

  // Update status handler
  const handleUpdateStatus = async (id: string, newStatus: SolarSurveyData['status']) => {
    setSurveys((prev) =>
      prev.map((s) => (s.id === id ? { ...s, status: newStatus } : s))
    );

    try {
      await fetch(`/api/surveys/${id}/status`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ status: newStatus }),
      });
    } catch (err) {
      console.warn('Could not update status on server:', err);
    }

    // Also update local storage
    const localSaved = localStorage.getItem('unicorn_solar_surveys');
    if (localSaved) {
      try {
        const list: SolarSurveyData[] = JSON.parse(localSaved);
        const updated = list.map((s) => (s.id === id ? { ...s, status: newStatus } : s));
        localStorage.setItem('unicorn_solar_surveys', JSON.stringify(updated));
      } catch {
        // ignore
      }
    }
  };

  // On successful survey submission
  const handleSuccessSubmission = (newSurvey: SolarSurveyData) => {
    setSurveys((prev) => [newSurvey, ...prev.filter((s) => s.id !== newSurvey.id)]);
  };

  // When user clicks "Apply Load Sizing to Solar Calculator" from audit
  const handleApplyAuditToCalculator = () => {
    setInputState((prev) => ({
      ...prev,
      calculationMode: 'appliances',
    }));
    setActiveTab('calculator');
    window.scrollTo({ top: 150, behavior: 'smooth' });
  };

  // Generate a transient proposal from current calculation for preview printing
  const handlePrintCurrentCalculation = () => {
    const draftSurvey: SolarSurveyData = {
      id: `UEC-DRAFT-${Math.floor(1000 + Math.random() * 9000)}`,
      createdAt: new Date().toISOString(),
      clientName: 'Valued Client (Draft Sizing)',
      clientPhone: '+880 1335-106960',
      clientEmail: 'info@unicorngroupbd.com',
      siteAddress: 'Engineering Feasibility Assessment',
      cityDistrict: inputState.selectedLocation,
      propertyType: 'commercial',
      electricityProvider: 'DPDC / DESCO / BREB',
      sanctionedLoadKw: Math.round(calculationResult.recommendedInverterKw),
      connectionType: calculationResult.actualArrayKw >= 6 ? '3-phase' : '1-phase',
      roofType: 'rcc_flat',
      shadowCondition: 'unobstructed',
      executionPreference: 'turnkey_epc',
      remarks: 'Preliminary sizing report generated via Unicorn Energy Calculator.',
      calculationSummary: calculationResult,
      systemType: inputState.systemType,
      status: 'new',
      recipients: ['pialtp4@gmail.com', 'unicornventureltd@gmail.com'],
    };
    setSurveyToPrint(draftSurvey);
  };

  return (
    <div className="min-h-screen flex flex-col bg-neutral-100 text-neutral-900 font-sans pb-24 md:pb-0">
      {/* 1A. Mobile Native App Header (< md) */}
      <MobileHeader
        activeTab={activeTab}
        setActiveTab={setActiveTab}
        submissionsCount={surveys.length}
        isOnline={isOnline}
        systemKw={calculationResult.actualArrayKw}
      />

      {/* 1B. Desktop Top Bar Navigation (>= md) */}
      <div className="hidden md:block">
        <Navbar
          activeTab={activeTab}
          setActiveTab={setActiveTab}
          submissionsCount={surveys.length}
        />
      </div>

      {/* 2. Hero Section - desktop visible, clean and uncluttered */}
      <div className="hidden md:block">
        <HeroSection
          onStartCalculation={() => {
            setActiveTab('calculator');
            window.scrollTo({ top: 380, behavior: 'smooth' });
          }}
          onOpenAudit={() => {
            setActiveTab('load-audit');
            window.scrollTo({ top: 380, behavior: 'smooth' });
          }}
        />
      </div>

      {/* 3. Main Workspace Area */}
      <main className="flex-1 max-w-7xl mx-auto w-full px-3.5 sm:px-6 lg:px-8 py-5 md:py-10 space-y-6 md:space-y-10">
        {/* Navigation Breadcrumb / Section Header */}
        <div className="flex items-center justify-between border-b border-neutral-200 pb-2.5">
          <div className="flex items-center gap-2 text-xs font-bold text-neutral-500 uppercase tracking-wider">
            <span>Workspace</span>
            <span>/</span>
            <span className="text-emerald-800 font-extrabold capitalize">
              {activeTab === 'calculator'
                ? 'Solar Sizing Engine'
                : activeTab === 'load-audit'
                ? 'Appliance Load Audit'
                : activeTab === 'ai-advisor'
                ? 'AI Solar Advisor & Feasibility'
                : activeTab === 'survey'
                ? 'Field Data Collection Form'
                : activeTab === 'submissions'
                ? 'Survey Submissions Console'
                : activeTab === 'tools'
                ? 'Mobile Field Toolkit & GPS'
                : 'Unicorn Group Bangladesh'}
            </span>
          </div>

          <div className="text-xs text-neutral-500 hidden sm:block">
            Support:{' '}
            <a
              href="tel:+8801335106960"
              className="text-emerald-800 font-bold hover:underline"
            >
              +8801335106960
            </a>
          </div>
        </div>

        {/* Tab 1: Solar Sizing Calculator */}
        {activeTab === 'calculator' && (
          <div className="space-y-8 md:space-y-10">
            {/* Sizing Input Form */}
            <SolarCalculator
              inputState={inputState}
              setInputState={setInputState}
              onOpenAudit={() => {
                setActiveTab('load-audit');
                window.scrollTo({ top: 0, behavior: 'smooth' });
              }}
            />

            {/* Live Engineering Sizing Results with D3 ROI Chart */}
            <SizingResults
              calculation={calculationResult}
              systemType={inputState.systemType}
              onOpenSurvey={() => {
                setActiveTab('survey');
                window.scrollTo({ top: 0, behavior: 'smooth' });
              }}
              onPrintReport={handlePrintCurrentCalculation}
            />
          </div>
        )}

        {/* Tab 2: Appliance Load Audit */}
        {activeTab === 'load-audit' && (
          <div className="space-y-8 md:space-y-10">
            <ApplianceLoadAudit
              appliances={inputState.appliances}
              setAppliances={(newAppliances) =>
                setInputState((prev) => ({
                  ...prev,
                  appliances:
                    typeof newAppliances === 'function'
                      ? newAppliances(prev.appliances)
                      : newAppliances,
                }))
              }
              onApplyToCalculator={handleApplyAuditToCalculator}
            />

            {/* Quick Sizing Results Preview with D3 ROI Chart */}
            <SizingResults
              calculation={calculationResult}
              systemType={inputState.systemType}
              onOpenSurvey={() => {
                setActiveTab('survey');
                window.scrollTo({ top: 0, behavior: 'smooth' });
              }}
              onPrintReport={handlePrintCurrentCalculation}
            />
          </div>
        )}

        {/* Tab 3: AI Solar Advisor & Gemini Feasibility Engine */}
        {activeTab === 'ai-advisor' && (
          <div className="space-y-8 md:space-y-10">
            <AISolarAdvisor
              inputState={inputState}
              calculation={calculationResult}
            />
          </div>
        )}

        {/* Tab 4: Survey Form */}
        {activeTab === 'survey' && (
          <div className="space-y-8 md:space-y-10">
            <SolarSurveyForm
              calculation={calculationResult}
              systemType={inputState.systemType}
              onSuccessSubmission={handleSuccessSubmission}
              onPrintReport={handlePrintCurrentCalculation}
            />
          </div>
        )}

        {/* Tab 5: Submissions Console with CSV Export */}
        {activeTab === 'submissions' && (
          <div className="space-y-8 md:space-y-10">
            <SubmissionsDrawer
              surveys={surveys}
              onSelectSurveyForPrint={(s) => setSurveyToPrint(s)}
              onUpdateStatus={handleUpdateStatus}
            />
          </div>
        )}

        {/* Tab 6: Mobile Field Toolkit (GPS, Compass, Inclinometer, Camera, Sync) */}
        {activeTab === 'tools' && (
          <div className="space-y-8 md:space-y-10">
            <MobileFieldTools
              calculation={calculationResult}
              surveys={surveys}
              onNavigateTab={(tab) => {
                setActiveTab(tab);
                window.scrollTo({ top: 0, behavior: 'smooth' });
              }}
            />
          </div>
        )}

        {/* Tab 7: About Unicorn Group */}
        {activeTab === 'about' && (
          <div className="space-y-8 md:space-y-10">
            <AboutUnicornGroup />
          </div>
        )}
      </main>

      {/* 4. Modal for Printable Official Proposal */}
      {surveyToPrint && (
        <PrintableProposal
          survey={surveyToPrint}
          onClose={() => setSurveyToPrint(null)}
        />
      )}

      {/* 5. Mobile Sticky Quick-Result Bar (on phone during sizing) */}
      <MobileStickySummary
        calculation={calculationResult}
        currency={inputState.currency}
        activeTab={activeTab}
        onViewDetails={() => {
          const el = document.getElementById('sizing-results-section');
          if (el) {
            el.scrollIntoView({ behavior: 'smooth' });
          } else {
            setActiveTab('calculator');
          }
        }}
        onOpenSurvey={() => {
          setActiveTab('survey');
          window.scrollTo({ top: 0, behavior: 'smooth' });
        }}
      />

      {/* 6. Android Bottom App Navigation Bar */}
      <AndroidMobileNav
        activeTab={activeTab}
        setActiveTab={setActiveTab}
        submissionsCount={surveys.length}
      />

      {/* 7. Offline Connectivity Banner */}
      <OfflineIndicator />

      {/* 8. Footer (Quiet and clean) */}
      <Footer onNavClick={(tab) => setActiveTab(tab)} />
    </div>
  );
}
