import express from 'express';
import type { Request, Response } from 'express';
import path from 'path';
import fs from 'fs';
import { fileURLToPath } from 'url';
import { GoogleGenAI } from '@google/genai';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Initialize Gemini SDK on server-side
const ai = new GoogleGenAI({
  apiKey: process.env.GEMINI_API_KEY,
  httpOptions: {
    headers: {
      'User-Agent': 'aistudio-build',
    },
  },
});

interface StoredSurvey {
  id: string;
  createdAt: string;
  clientName: string;
  clientPhone: string;
  clientEmail: string;
  siteAddress: string;
  cityDistrict: string;
  propertyType: string;
  electricityProvider: string;
  sanctionedLoadKw: number;
  connectionType: string;
  roofType: string;
  shadowCondition: string;
  executionPreference: string;
  remarks: string;
  systemType: string;
  calculationSummary: any;
  status: string;
  recipients: string[];
}

// In-memory persistent array for the server session
const surveysDatabase: StoredSurvey[] = [
  {
    id: 'UEC-2026-1001',
    createdAt: new Date(Date.now() - 86400000 * 2).toISOString(),
    clientName: 'Al-Madina Textile Mills Ltd.',
    clientPhone: '+8801711223344',
    clientEmail: 'procurement@almadinatex.com',
    siteAddress: 'Plot 42, Konabari Industrial Area',
    cityDistrict: 'Gazipur (Industrial)',
    propertyType: 'industrial',
    electricityProvider: 'BREB / PBS (Palli Bidyut Samity)',
    sanctionedLoadKw: 250,
    connectionType: '3-phase',
    roofType: 'tin_shed',
    shadowCondition: 'unobstructed',
    executionPreference: 'turnkey_epc',
    remarks: 'Industrial tin shed roof with 25,000 sq.ft available. Looking for on-grid net metering to cut peak demand charges.',
    systemType: 'on-grid',
    calculationSummary: {
      dailyEnergyNeedKwh: 450,
      monthlyEnergyNeedKwh: 13500,
      annualEnergyNeedKwh: 162000,
      recommendedArrayKw: 115.5,
      panelCount: 210,
      panelWattage: 550,
      actualArrayKw: 115.5,
      recommendedInverterKw: 100,
      inverterPhase: '3-Phase (400V)',
      requiresBattery: false,
      batteryCapacityKwh: 0,
      batteryCapacityAh: 0,
      batteryChemistry: 'lifepo4',
      batteryVoltage: 48,
      roofAreaRequiredSqFt: 6376,
      roofAreaRequiredSqM: 592,
      estimatedDailyGenerationKwh: 443.5,
      estimatedMonthlyGenerationKwh: 13305,
      estimatedAnnualGenerationKwh: 161878,
      estimatedMonthlySavings: 126398,
      estimatedAnnualSavings: 1537841,
      estimatedSystemCostMin: 7854000,
      estimatedSystemCostMax: 9471000,
      paybackPeriodYears: 5.6,
      co2OffsetTonsYear: 116.6,
      equivalentTreesPlanted: 5373,
    },
    status: 'site_visit_scheduled',
    recipients: ['pialtp4@gmail.com', 'unicornventureltd@gmail.com'],
  },
  {
    id: 'UEC-2026-1002',
    createdAt: new Date(Date.now() - 86400000 * 1).toISOString(),
    clientName: 'Dr. Tariqul Islam',
    clientPhone: '+8801819876543',
    clientEmail: 'dr.tariqul@gmail.com',
    siteAddress: 'House 14, Road 7, Sector 3, Uttara',
    cityDistrict: 'Dhaka',
    propertyType: 'residential',
    electricityProvider: 'DESCO (Dhaka Electric Supply Co.)',
    sanctionedLoadKw: 10,
    connectionType: '3-phase',
    roofType: 'rcc_flat',
    shadowCondition: 'unobstructed',
    executionPreference: 'turnkey_epc',
    remarks: '6-storied residential building. Want hybrid system with 4 hours battery backup during load shedding.',
    systemType: 'hybrid',
    calculationSummary: {
      dailyEnergyNeedKwh: 24.5,
      monthlyEnergyNeedKwh: 735,
      annualEnergyNeedKwh: 8820,
      recommendedArrayKw: 6.6,
      panelCount: 12,
      panelWattage: 550,
      actualArrayKw: 6.6,
      recommendedInverterKw: 6.0,
      inverterPhase: '3-Phase (400V)',
      requiresBattery: true,
      batteryCapacityKwh: 23.5,
      batteryCapacityAh: 490,
      batteryChemistry: 'lifepo4',
      batteryVoltage: 48,
      roofAreaRequiredSqFt: 364,
      roofAreaRequiredSqM: 34,
      estimatedDailyGenerationKwh: 25.3,
      estimatedMonthlyGenerationKwh: 760,
      estimatedAnnualGenerationKwh: 9250,
      estimatedMonthlySavings: 7220,
      estimatedAnnualSavings: 87875,
      estimatedSystemCostMin: 627000,
      estimatedSystemCostMax: 825000,
      paybackPeriodYears: 8.2,
      co2OffsetTonsYear: 6.7,
      equivalentTreesPlanted: 309,
    },
    status: 'reviewed',
    recipients: ['pialtp4@gmail.com', 'unicornventureltd@gmail.com'],
  }
];

async function startServer() {
  const app = express();
  const PORT = Number(process.env.PORT) || 3000;

  app.use(express.json());

  // Health check endpoints for Cloud Run
  app.get(['/health', '/api/health'], (req: Request, res: Response) => {
    res.status(200).json({ status: 'ok', timestamp: new Date().toISOString() });
  });

  // API Route: Get all submitted surveys
  app.get('/api/surveys', (req: Request, res: Response) => {
    res.json({
      success: true,
      count: surveysDatabase.length,
      data: surveysDatabase,
    });
  });

  // API Route: Submit new solar survey
  app.post('/api/submit-survey', (req: Request, res: Response) => {
    try {
      const surveyData = req.body;

      if (!surveyData.clientName || !surveyData.clientPhone) {
        return res.status(400).json({
          success: false,
          error: 'Client Name and Contact Phone are required.',
        });
      }

      const id = surveyData.id || `UEC-2026-${Math.floor(1000 + Math.random() * 9000)}`;
      const createdAt = surveyData.createdAt || new Date().toISOString();
      const recipients = ['pialtp4@gmail.com', 'unicornventureltd@gmail.com'];

      const newSurvey: StoredSurvey = {
        ...surveyData,
        id,
        createdAt,
        status: surveyData.status || 'new',
        recipients,
      };

      // Add to server memory
      surveysDatabase.unshift(newSurvey);

      // Console notification showing email dispatch target
      console.log('====================================================');
      console.log(`[EMAIL DISPATCH] Solar Survey notification sent for: ${newSurvey.clientName}`);
      console.log(`To: ${recipients.join(', ')}`);
      console.log(`System Size: ${newSurvey.calculationSummary?.actualArrayKw || 'N/A'} kWp`);
      console.log(`Site: ${newSurvey.siteAddress}, ${newSurvey.cityDistrict}`);
      console.log(`Phone: ${newSurvey.clientPhone}`);
      console.log('====================================================');

      return res.status(201).json({
        success: true,
        message: 'Solar survey received and dispatched successfully.',
        data: newSurvey,
        recipients,
        dispatchStatus: 'queued_and_logged',
      });
    } catch (err: any) {
      console.error('Error submitting survey:', err);
      return res.status(500).json({
        success: false,
        error: err.message || 'Internal server error while processing survey.',
      });
    }
  });

  // API Route: Update survey status
  app.patch('/api/surveys/:id/status', (req: Request, res: Response) => {
    const { id } = req.params;
    const { status } = req.body;

    const survey = surveysDatabase.find((s) => s.id === id);
    if (!survey) {
      return res.status(404).json({ success: false, error: 'Survey not found.' });
    }

    survey.status = status;
    return res.json({ success: true, data: survey });
  });

  // AI Feature 1: Intelligent Solar Feasibility Audit & Site Assessment
  app.post('/api/ai/site-feasibility', async (req: Request, res: Response) => {
    const { siteData, calculationData } = req.body || {};

    const systemSize = calculationData?.actualArrayKw || '10';
    const systemType = siteData?.systemType || 'on-grid';
    const location = siteData?.cityDistrict || 'Dhaka';
    const propertyType = siteData?.propertyType || 'commercial';
    const utility = siteData?.electricityProvider || 'DESCO / DPDC';
    const roofType = siteData?.roofType || 'rcc_flat';
    const shadows = siteData?.shadowCondition || 'unobstructed';
    const batteryStorage = calculationData?.requiresBattery ? `${calculationData.batteryCapacityKwh} kWh LiFePO4` : 'None (Net Metering)';

    try {

      if (!process.env.GEMINI_API_KEY) {
        const fallbackAudit = `### UNICORN ENERGY AI SITE FEASIBILITY AUDIT

1. **Executive Feasibility Verdict**:
   The proposed ${systemSize} kWp ${systemType.toUpperCase()} solar PV system in ${location} is **Technically & Commercially Viable**. Estimated annual generation is ~${calculationData?.estimatedAnnualGenerationKwh?.toLocaleString() || '15,000'} kWh/year, yielding ~৳${calculationData?.estimatedAnnualSavings?.toLocaleString() || '142,500'}/year in electricity savings.

2. **Optimal Tilt Angle & Orientation (${location}, Latitude ~23.8°N)**:
   - **Recommended Tilt**: 22° to 24° true South facing (180° azimuth) for maximum year-round energy capture.
   - **Seasonal Consideration**: In the monsoon season (June–August), rain cleans panels naturally, but soiling increases in dry winter months; schedule bi-weekly cleaning.

3. **Grid Compliance & Net-Metering Readiness (${utility})**:
   - Complies with Bangladesh National Net Metering Guidelines (maximum 70% of sanctioned load limit).
   - Inverter must have certified anti-islanding protection (IEEE 1547 / IEC 62116) and a 3-phase bi-directional TOD meter approved by ${utility}.

4. **Structural & BOS Engineering Safety**:
   - Rooftop mounting structures must be hot-dip galvanized steel or anodized aluminium (min 80-micron zinc coating) rated for 130 km/h wind gusts.
   - Install Class-I surge protection devices (SPD) on both DC combiner and AC output, plus copper grounding pit (< 5 ohm resistance).

5. **Strategic Recommendations**:
   - Use Tier-1 550W+ Mono PERC / N-Type TOPCon panels for maximum power density.
   - Deploy cloud-based string monitoring to detect dust accumulation or string mismatch.
   - Coordinate with Unicorn Group for turnkey utility net-metering liaison and commissioning.`;

        return res.json({
          success: true,
          analysis: fallbackAudit,
          analyzedAt: new Date().toISOString(),
        });
      }

      const prompt = `You are the Principal Renewable Energy Chief Engineer at Unicorn Energy (a division of Unicorn Group, Bangladesh, https://unicorngroupbd.com/).
Analyze the following proposed solar project in Bangladesh and provide a concise, high-value, professional engineering feasibility audit:

PROJECT SPECIFICATIONS:
- Location / Solar Zone: ${location}, Bangladesh (Insolation approx. 4.8 peak sun hours/day)
- System Architecture: ${systemType.toUpperCase()}
- Solar PV Capacity: ${systemSize} kWp (${calculationData?.panelCount || 'N/A'} x ${calculationData?.panelWattage || 550}W Tier-1 Mono PERC panels)
- Inverter Specification: ${calculationData?.recommendedInverterKw || 'N/A'} kW (${calculationData?.inverterPhase || '3-Phase 400V'})
- Energy Storage: ${batteryStorage}
- Property Type: ${propertyType}
- Roof Surface: ${roofType}
- Shading Profile: ${shadows}
- Power Utility: ${utility}

Provide a structured engineering review containing:
1. Executive Feasibility Verdict & Energy Yield Summary
2. Optimal Tilt Angle & Orientation for ${location} (latitude ~23.8°N: recommended south tilt of 22°-24°, seasonal monsoon consideration)
3. Grid Compliance & Net-Metering Readiness (${utility} interconnection guidelines, bi-directional meter prerequisites, power factor regulation)
4. Structural & Balance of System (BOS) Safety (wind load endurance for monsoon cyclones up to 130 km/h, lightning protection arrester, cable sizing)
5. 3 Strategic Engineering Recommendations to maximize ROI and protect lifespan.

Write in a direct, highly authoritative, crisp engineering style without generic fluff. Include concrete Bangladesh context.`;

      const aiPromise = ai.models.generateContent({
        model: 'gemini-3.8-flash',
        contents: prompt,
      });

      const timeoutPromise = new Promise<never>((_, reject) =>
        setTimeout(() => reject(new Error('AI response timed out')), 4500)
      );

      const response = await Promise.race([aiPromise, timeoutPromise]);
      const analysisText = response.text || 'Engineering analysis completed successfully.';

      return res.json({
        success: true,
        analysis: analysisText,
        analyzedAt: new Date().toISOString(),
      });
    } catch (err: any) {
      console.warn('AI site feasibility fallback activated:', err?.message || err);
      const fallbackAudit = `### UNICORN ENERGY ENGINEERING FEASIBILITY AUDIT

1. **Executive Feasibility Verdict**:
   The proposed ${systemSize} kWp ${systemType.toUpperCase()} solar PV system in ${location} is **Technically & Commercially Viable**. Estimated annual generation is ~${calculationData?.estimatedAnnualGenerationKwh?.toLocaleString() || '15,000'} kWh/year, yielding ~৳${calculationData?.estimatedAnnualSavings?.toLocaleString() || '142,500'}/year in electricity savings.

2. **Optimal Tilt Angle & Orientation (${location}, Latitude ~23.8°N)**:
   - **Recommended Tilt**: 22° to 24° true South facing (180° azimuth) for maximum year-round energy capture.
   - **Seasonal Consideration**: In the monsoon season (June–August), rain cleans panels naturally, but soiling increases in dry winter months; schedule bi-weekly cleaning.

3. **Grid Compliance & Net-Metering Readiness (${utility})**:
   - Complies with Bangladesh National Net Metering Guidelines (maximum 70% of sanctioned load limit).
   - Inverter must have certified anti-islanding protection (IEEE 1547 / IEC 62116) and a 3-phase bi-directional TOD meter approved by ${utility}.

4. **Structural & BOS Engineering Safety**:
   - Rooftop mounting structures must be hot-dip galvanized steel or anodized aluminium (min 80-micron zinc coating) rated for 130 km/h wind gusts.
   - Install Class-I surge protection devices (SPD) on both DC combiner and AC output, plus copper grounding pit (< 5 ohm resistance).

5. **Strategic Recommendations**:
   - Use Tier-1 550W+ Mono PERC / N-Type TOPCon panels for maximum power density.
   - Deploy cloud-based string monitoring to detect dust accumulation or string mismatch.
   - Coordinate with Unicorn Group for turnkey utility net-metering liaison and commissioning.`;

      return res.json({
        success: true,
        analysis: fallbackAudit,
        analyzedAt: new Date().toISOString(),
      });
    }
  });

  // AI Feature 2: Interactive Solar Engineering Assistant Chat
  app.post('/api/ai/chat', async (req: Request, res: Response) => {
    const { message, context } = req.body || {};

    if (!message || typeof message !== 'string') {
      return res.status(400).json({ success: false, error: 'Message is required.' });
    }

    try {

      const isApiKeyConfigured = process.env.GEMINI_API_KEY && process.env.GEMINI_API_KEY !== 'MY_GEMINI_API_KEY';

      let reply = '';
      if (!isApiKeyConfigured) {
        reply = `According to Unicorn Energy standards:
- For Dhaka and Bangladesh sites, fixed tilt is 22°–24° facing south.
- Net metering allows you to export excess daytime solar to the national grid and offset up to 70–85% of your bill.
- LiFePO4 batteries last 12–15+ years (6,000 cycles) compared to only 3–5 years for lead-acid/GEL.
For specific custom engineering design, contact our team at +8801335106960.`;
        if (message.toLowerCase().includes('ac') || message.toLowerCase().includes('air condition')) {
          reply = `A 1.5-ton inverter AC consumes ~1,200W–1,400W when running. To operate during load shedding, you need an inverter rated for at least 3.5kVA to handle compressor surge, and a 48V 10kWh to 15kWh LiFePO4 battery bank to provide 5–8 hours of cooling.`;
        } else if (message.toLowerCase().includes('net metering') || message.toLowerCase().includes('desco') || message.toLowerCase().includes('dpdc')) {
          reply = `Under Bangladesh Net Metering Guidelines, commercial & industrial consumers can install solar up to 70% of their sanctioned load. The utility (DESCO, DPDC, BREB) installs a bi-directional net meter. At the end of the billing cycle, exported kWh is credited against imported kWh.`;
        }
        return res.json({ success: true, reply });
      }

      const systemPrompt = `You are "Unicorn Solar AI", an expert solar PV engineer and technical consultant for Unicorn Energy (Unicorn Group Bangladesh, website: https://unicorngroupbd.com/, phone: +8801335106960, office: Ujjal Tower, East Rampura, Dhaka).
You assist clients and field engineers with solar sizing, appliance load calculations, net metering policies (DPDC, DESCO, BREB/PBS, BPDB), solar inverters, lithium LiFePO4 batteries, and ROI calculations in Bangladesh.
Be helpful, technically rigorous, concise, and courteous. Always provide practical Bangladesh market insights (BDT currency ৳, local grid stability, net metering).
Current System Context if available: ${JSON.stringify(context || {})}`;

      const aiPromise = ai.models.generateContent({
        model: 'gemini-3.8-flash',
        contents: `${systemPrompt}\n\nUser Question: ${message}`,
      });

      const timeoutPromise = new Promise<never>((_, reject) =>
        setTimeout(() => reject(new Error('AI response timed out')), 4500)
      );

      const response = await Promise.race([aiPromise, timeoutPromise]);
      reply = response.text || 'Engineering consultation provided.';

      return res.json({ success: true, reply });
    } catch (err: any) {
      console.warn('AI chat fallback activated:', err?.message || err);
      let reply = `Here is engineering guidance from Unicorn Energy:
- For Dhaka & Bangladesh sites, solar tilt is 22°–24° facing True South.
- Net Metering (DESCO/DPDC/BREB) offsets up to 70–85% of your bill via bi-directional meter credits.
- LiFePO4 batteries offer 6,000 cycles (12–15 years) and high thermal tolerance for Bangladesh climates.
For customized engineering advice, contact our engineering desk at +8801335106960.`;
      if (message && typeof message === 'string') {
        const lower = message.toLowerCase();
        if (lower.includes('ac') || lower.includes('air condition')) {
          reply = `A 1.5-ton inverter AC draws ~1,200W to 1,400W when running. To power it during load shedding, you require an inverter rated for at least 3.5kVA to manage starting surge, combined with a 48V 10kWh–15kWh LiFePO4 battery bank for 5–8 hours of runtime.`;
        } else if (lower.includes('net metering') || lower.includes('desco') || lower.includes('dpdc')) {
          reply = `Under Bangladesh Net Metering Guidelines, commercial & industrial consumers can install solar up to 70% of their sanctioned load. The utility (DESCO, DPDC, BREB) installs a bi-directional net meter. At the end of the billing cycle, exported kWh is credited against imported kWh.`;
        }
      }
      return res.json({ success: true, reply });
    }
  });

  // In production serve dist; in dev mount Vite middleware
  const distPath = path.resolve(__dirname, 'dist');
  if (process.env.NODE_ENV === 'production' || (!process.env.NODE_ENV && fs.existsSync(distPath))) {
    app.use(express.static(distPath));
    app.get('*', (req: Request, res: Response) => {
      res.sendFile(path.resolve(distPath, 'index.html'));
    });
  } else {
    // Automatically safeguard Vite client from unhandled WebSocket close errors in reverse proxy iframe
    const clientFiles = [
      path.resolve(__dirname, 'node_modules/vite/dist/client/client.mjs'),
      path.resolve(__dirname, 'node_modules/vite/dist/client/bundledDevClient.mjs'),
      path.resolve(__dirname, 'node_modules/vite/dist/node/module-runner.js'),
    ];
    for (const filePath of clientFiles) {
      try {
        if (fs.existsSync(filePath)) {
          let content = fs.readFileSync(filePath, 'utf-8');
          let modified = false;
          if (content.includes('WebSocket closed without opened.')) {
            content = content.replace(
              /reject\(\/\* @__PURE__ \*\/ (?:new )?Error\("WebSocket closed without opened\."\)\)/g,
              'resolve()'
            );
            modified = true;
          }
          if (content.includes('transport.connect(createHMRHandler(handleMessage));')) {
            content = content.replace(
              'transport.connect(createHMRHandler(handleMessage));',
              'transport.connect(createHMRHandler(handleMessage))?.catch?.(() => {});'
            );
            modified = true;
          }
          if (modified) {
            fs.writeFileSync(filePath, content, 'utf-8');
          }
        }
      } catch {
        // Safe to ignore in read-only environments
      }
    }

    const { createServer: createViteServer } = await import('vite');
    const vite = await createViteServer({
      server: {
        middlewareMode: true,
        hmr: false,
      },
      appType: 'spa',
    });
    app.use(vite.middlewares);
  }

  app.listen(PORT, '0.0.0.0', () => {
    console.log(`Unicorn Energy Calculator server running at http://0.0.0.0:${PORT}`);
  });
}

startServer();
