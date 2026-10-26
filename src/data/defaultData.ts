import { ApplianceItem, LocationData } from '../types/solar';

export const COMPANY_INFO = {
  appName: 'Unicorn Energy Calculator',
  companyName: 'Unicorn Group',
  website: 'https://unicorngroupbd.com/',
  phone: '+8801335106960',
  phoneDisplay: '+880 1335-106960',
  emails: ['pialtp4@gmail.com', 'unicornventureltd@gmail.com'],
  address: 'Ujjal Tower, L-5, 362, DIT Road, East Rampura, Dhaka 1219, Bangladesh',
  appLogo: '/assets/aistudio/image_fbbd7833.png',
  companyLogo: '/assets/aistudio/image_a053f0dc.png',
  heroImage: '/src/assets/images/solar_rooftop_installation_1792575004763.jpg',
  industrialImage: '/src/assets/images/solar_industrial_system_1792575005218.jpg',
  whatsappUrl: (msg: string) => `https://wa.me/8801335106960?text=${encodeURIComponent(msg)}`,
};

export const BANGLADESH_LOCATIONS: LocationData[] = [
  { name: 'Dhaka', peakSunHours: 4.8, division: 'Dhaka' },
  { name: 'Gazipur (Industrial)', peakSunHours: 4.8, division: 'Dhaka' },
  { name: 'Narayanganj', peakSunHours: 4.8, division: 'Dhaka' },
  { name: 'Chittagong', peakSunHours: 4.9, division: 'Chittagong' },
  { name: 'Cox\'s Bazar', peakSunHours: 5.2, division: 'Chittagong' },
  { name: 'Sylhet', peakSunHours: 4.6, division: 'Sylhet' },
  { name: 'Rajshahi (High Solar)', peakSunHours: 5.1, division: 'Rajshahi' },
  { name: 'Khulna', peakSunHours: 5.0, division: 'Khulna' },
  { name: 'Barisal', peakSunHours: 4.9, division: 'Barisal' },
  { name: 'Rangpur', peakSunHours: 4.8, division: 'Rangpur' },
  { name: 'Mymensingh', peakSunHours: 4.7, division: 'Mymensingh' },
  { name: 'Comilla', peakSunHours: 4.8, division: 'Chittagong' },
  { name: 'Bogra', peakSunHours: 4.9, division: 'Rajshahi' },
  { name: 'Custom Location', peakSunHours: 4.8, division: 'Other' },
];

export const UTILITY_PROVIDERS = [
  'DPDC (Dhaka Power Distribution Co.)',
  'DESCO (Dhaka Electric Supply Co.)',
  'BREB / PBS (Palli Bidyut Samity)',
  'BPDB (Bangladesh Power Dev. Board)',
  'WZPDCL (West Zone Power Dist. Co.)',
  'NESCO (Northern Electricity Supply Co.)',
  'Independent Micro-grid / Captive',
  'Other / Captive Generator',
];

export const DEFAULT_APPLIANCES: ApplianceItem[] = [
  { id: '1', name: 'Ceiling Fan (BLDC/Standard)', category: 'cooling', watts: 70, quantity: 4, dailyHours: 10, totalWattHours: 2800 },
  { id: '2', name: 'LED Tube / Bulb (20W)', category: 'lighting', watts: 20, quantity: 8, dailyHours: 6, totalWattHours: 960 },
  { id: '3', name: 'Inverter AC (1.5 Ton)', category: 'cooling', watts: 1400, quantity: 1, dailyHours: 6, totalWattHours: 8400 },
  { id: '4', name: 'Refrigerator / Freezer (250L)', category: 'kitchen', watts: 150, quantity: 1, dailyHours: 12, totalWattHours: 1800 },
  { id: '5', name: 'Smart LED TV (50")', category: 'other', watts: 80, quantity: 1, dailyHours: 4, totalWattHours: 320 },
  { id: '6', name: 'Water Pump (1.0 HP)', category: 'pumps', watts: 750, quantity: 1, dailyHours: 1.5, totalWattHours: 1125 },
  { id: '7', name: 'Computer / Workstation', category: 'office', watts: 120, quantity: 2, dailyHours: 8, totalWattHours: 1920 },
  { id: '8', name: 'Wi-Fi Router & Surveillance', category: 'office', watts: 35, quantity: 1, dailyHours: 24, totalWattHours: 840 },
];

export const PRESET_APPLIANCE_TEMPLATES = [
  { name: 'Ceiling Fan (Energy Star)', category: 'cooling' as const, watts: 55 },
  { name: 'Standard Ceiling Fan', category: 'cooling' as const, watts: 75 },
  { name: 'LED Tube Light (18W-20W)', category: 'lighting' as const, watts: 20 },
  { name: 'LED Spotlight (7W)', category: 'lighting' as const, watts: 7 },
  { name: 'Inverter AC 1.0 Ton', category: 'cooling' as const, watts: 1050 },
  { name: 'Inverter AC 1.5 Ton', category: 'cooling' as const, watts: 1450 },
  { name: 'Inverter AC 2.0 Ton', category: 'cooling' as const, watts: 1950 },
  { name: 'Non-Inverter AC 1.5 Ton', category: 'cooling' as const, watts: 1800 },
  { name: 'Refrigerator (Frost-Free 300L)', category: 'kitchen' as const, watts: 160 },
  { name: 'Deep Freezer (200L)', category: 'kitchen' as const, watts: 220 },
  { name: 'Microwave Oven', category: 'kitchen' as const, watts: 1200 },
  { name: 'Electric Kettle / Induction', category: 'kitchen' as const, watts: 1500 },
  { name: 'Water Pump (0.5 HP)', category: 'pumps' as const, watts: 375 },
  { name: 'Water Pump (1.0 HP)', category: 'pumps' as const, watts: 750 },
  { name: 'Water Pump (2.0 HP Submersible)', category: 'pumps' as const, watts: 1500 },
  { name: 'Washing Machine (Front Load)', category: 'other' as const, watts: 600 },
  { name: 'Desktop PC + Monitor', category: 'office' as const, watts: 150 },
  { name: 'Office Laptop', category: 'office' as const, watts: 65 },
  { name: 'Industrial Garment Sewing Machine', category: 'industrial' as const, watts: 400 },
  { name: 'Heavy Industrial Motor / Compressor (3 HP)', category: 'industrial' as const, watts: 2250 },
];

export const PANEL_OPTIONS = [
  { wattage: 450, label: '450W Mono PERC Half-Cut (Standard Compact)', areaSqFt: 22 },
  { wattage: 550, label: '550W Tier-1 Mono PERC (Recommended Residential/Commercial)', areaSqFt: 26 },
  { wattage: 580, label: '580W N-Type TOPCon High Efficiency (Commercial/Industrial)', areaSqFt: 27 },
  { wattage: 650, label: '650W Bifacial Dual-Glass (Large Rooftops & Ground)', areaSqFt: 31 },
];
