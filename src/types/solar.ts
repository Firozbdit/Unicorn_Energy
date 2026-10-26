export type SystemType = 'on-grid' | 'hybrid' | 'off-grid';

export type CalculationMode = 'bill' | 'appliances' | 'area';

export interface ApplianceItem {
  id: string;
  name: string;
  category: 'cooling' | 'lighting' | 'kitchen' | 'office' | 'pumps' | 'industrial' | 'other';
  watts: number;
  quantity: number;
  dailyHours: number;
  totalWattHours: number;
}

export interface LocationData {
  name: string;
  peakSunHours: number;
  division: string;
}

export interface SolarInputState {
  calculationMode: CalculationMode;
  systemType: SystemType;
  
  // Mode: Bill
  monthlyBill: number;
  tariffPerKwh: number;
  monthlyKwh: number;
  offsetPercentage: number;
  
  // Mode: Appliances
  appliances: ApplianceItem[];
  
  // Mode: Area
  availableRoofAreaSqFt: number;
  usableAreaPercent: number;
  
  // Location & Environmental
  selectedLocation: string;
  peakSunHours: number;
  systemLossFactor: number; // e.g. 0.20 for 20% loss (0.80 derate)
  
  // Hardware specifications
  panelWattage: number; // e.g. 550W
  panelEfficiency: number; // e.g. 21.5%
  inverterOversizingRatio: number; // e.g. 1.20
  
  // Battery specifications (Hybrid & Off-Grid)
  batteryAutonomyDays: number; // 1 to 3 days
  batteryChemistry: 'lifepo4' | 'tubular_gel';
  depthOfDischarge: number; // 0.85 for LiFePO4, 0.50 for Gel
  systemVoltage: number; // 48V standard
  
  currency: 'BDT' | 'USD';
}

export interface SolarCalculationResult {
  dailyEnergyNeedKwh: number;
  monthlyEnergyNeedKwh: number;
  annualEnergyNeedKwh: number;
  
  recommendedArrayKw: number;
  panelCount: number;
  panelWattage: number;
  actualArrayKw: number;
  
  recommendedInverterKw: number;
  inverterPhase: '1-Phase (230V)' | '3-Phase (400V)';
  
  requiresBattery: boolean;
  batteryCapacityKwh: number;
  batteryCapacityAh: number;
  batteryChemistry: 'lifepo4' | 'tubular_gel';
  batteryVoltage: number;
  
  roofAreaRequiredSqFt: number;
  roofAreaRequiredSqM: number;
  
  estimatedDailyGenerationKwh: number;
  estimatedMonthlyGenerationKwh: number;
  estimatedAnnualGenerationKwh: number;
  
  estimatedMonthlySavings: number;
  estimatedAnnualSavings: number;
  estimatedSystemCostMin: number;
  estimatedSystemCostMax: number;
  paybackPeriodYears: number;
  paybackYears: number;
  
  co2OffsetTonsYear: number;
  equivalentTreesPlanted: number;
}

export interface SolarSurveyData {
  id: string;
  createdAt: string;
  
  // Client Contact
  clientName: string;
  clientPhone: string;
  clientEmail: string;
  siteAddress: string;
  cityDistrict: string;
  
  // Site & Technical Details
  propertyType: 'residential' | 'commercial' | 'industrial' | 'agricultural' | 'healthcare_institution';
  electricityProvider: string;
  sanctionedLoadKw: number;
  connectionType: '1-phase' | '3-phase';
  roofType: 'rcc_flat' | 'tin_shed' | 'tilted_tile' | 'ground_mount' | 'carport';
  shadowCondition: 'unobstructed' | 'minor_obstruction' | 'moderate_shadow';
  executionPreference: 'turnkey_epc' | 'supply_only' | 'site_audit_first';
  remarks: string;
  
  // Solar calculation snapshot
  calculationSummary: SolarCalculationResult;
  systemType: SystemType;
  
  // Status and tracking
  status: 'new' | 'reviewed' | 'site_visit_scheduled' | 'proposal_sent' | 'contract_signed';
  recipients: string[];
  photos?: string[];
  gpsCoords?: { lat: number; lng: number };
}
