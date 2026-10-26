import { SolarSurveyData } from '../types/solar';
import { COMPANY_INFO } from '../data/defaultData';
import { formatCurrency } from './solarCalculations';

export function generateSurveyEmailContent(survey: SolarSurveyData) {
  const calc = survey.calculationSummary;
  const currency = 'BDT';

  const subject = `[Solar Field Survey] New Proposal Request - ${survey.clientName} (${calc.actualArrayKw} kWp)`;

  const textBody = `
=====================================================
UNICORN ENERGY CALCULATOR - SOLAR FIELD SURVEY REPORT
A Venture of Unicorn Group (https://unicorngroupbd.com/)
=====================================================

REFERENCE ID: ${survey.id}
SUBMISSION DATE: ${new Date(survey.createdAt).toLocaleString('en-GB')}
TARGET RECIPIENTS: ${COMPANY_INFO.emails.join(', ')}

-----------------------------------------------------
1. CLIENT & SITE CONTACT INFORMATION
-----------------------------------------------------
Client / Company Name : ${survey.clientName}
Phone / WhatsApp      : ${survey.clientPhone}
Email Address         : ${survey.clientEmail || 'N/A'}
Site Address          : ${survey.siteAddress}
District / City       : ${survey.cityDistrict}

-----------------------------------------------------
2. SITE TECHNICAL & ELECTRICAL PARAMETERS
-----------------------------------------------------
Property Classification : ${survey.propertyType.toUpperCase()}
Electricity Utility     : ${survey.electricityProvider}
Sanctioned Load         : ${survey.sanctionedLoadKw} kW (${survey.connectionType})
Roof Surface Type       : ${survey.roofType.replace('_', ' ').toUpperCase()}
Shadow Conditions       : ${survey.shadowCondition.replace('_', ' ').toUpperCase()}
Execution Model         : ${survey.executionPreference.replace('_', ' ').toUpperCase()}
Additional Notes        : ${survey.remarks || 'None provided'}

-----------------------------------------------------
3. RECOMMENDED SOLAR SYSTEM SIZING SPECIFICATIONS
-----------------------------------------------------
System Architecture     : ${survey.systemType.toUpperCase()}
Solar PV Array Capacity : ${calc.actualArrayKw} kWp (${calc.recommendedArrayKw} kWp calculated)
Solar Panel Count       : ${calc.panelCount} × ${calc.panelWattage}W Mono PERC
Inverter Specification  : ${calc.recommendedInverterKw} kW (${calc.inverterPhase})
${calc.requiresBattery ? `Battery Storage Bank    : ${calc.batteryCapacityKwh} kWh (${calc.batteryCapacityAh} Ah @ ${calc.batteryVoltage}V ${calc.batteryChemistry.toUpperCase()})` : 'Battery Storage         : Not required (On-Grid Net Metering)'}
Required Rooftop Area   : ${calc.roofAreaRequiredSqFt} sq.ft (${calc.roofAreaRequiredSqM} sq.m)

-----------------------------------------------------
4. ESTIMATED GENERATION & FINANCIAL ESTIMATES
-----------------------------------------------------
Estimated Daily Output  : ${calc.estimatedDailyGenerationKwh} kWh / day
Estimated Annual Output : ${calc.estimatedAnnualGenerationKwh.toLocaleString()} kWh / year
Estimated Monthly Save  : ${formatCurrency(calc.estimatedMonthlySavings, currency)}
Estimated Annual Save   : ${formatCurrency(calc.estimatedAnnualSavings, currency)}
Budget Estimation Range : ${formatCurrency(calc.estimatedSystemCostMin, currency)} - ${formatCurrency(calc.estimatedSystemCostMax, currency)}
Estimated Payback Period: ${calc.paybackYears} Years
Annual CO2 Emissions Cut: ${calc.co2OffsetTonsYear} Metric Tons (${calc.equivalentTreesPlanted} trees equivalent)

-----------------------------------------------------
UNICORN GROUP - ENERGY DIVISION
Ujjal Tower, L-5, 362, DIT Road, East Rampura Dhaka 1219, Bangladesh
Direct Phone / WhatsApp: ${COMPANY_INFO.phone}
Website: ${COMPANY_INFO.website}
Emails: ${COMPANY_INFO.emails.join(' | ')}
=====================================================
`;

  return { subject, textBody };
}

export function generateMailtoUrl(survey: SolarSurveyData): string {
  const { subject, textBody } = generateSurveyEmailContent(survey);
  const recipients = COMPANY_INFO.emails.join(',');
  return `mailto:${recipients}?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(textBody)}`;
}

export function generateWhatsAppSummary(survey: SolarSurveyData): string {
  const calc = survey.calculationSummary;
  const msg = `*Unicorn Energy Solar Survey Enquiry*\n` +
    `Ref ID: ${survey.id}\n` +
    `Client: ${survey.clientName}\n` +
    `Phone: ${survey.clientPhone}\n` +
    `Site: ${survey.siteAddress}, ${survey.cityDistrict}\n` +
    `System: ${calc.actualArrayKw} kWp ${survey.systemType.toUpperCase()} (${calc.panelCount}x ${calc.panelWattage}W Panels)\n` +
    `Inverter: ${calc.recommendedInverterKw} kW ${calc.inverterPhase}\n` +
    `${calc.requiresBattery ? `Battery: ${calc.batteryCapacityKwh} kWh (${calc.batteryCapacityAh}Ah)\n` : ''}` +
    `Est. Annual Savings: ${formatCurrency(calc.estimatedAnnualSavings, 'BDT')}\n` +
    `Please review my solar project and provide official turnkey proposal.`;
  return COMPANY_INFO.whatsappUrl(msg);
}
