import React, { useState } from 'react';
import { SolarSurveyData } from '../types/solar';
import { COMPANY_INFO } from '../data/defaultData';
import { generateMailtoUrl, generateWhatsAppSummary } from '../utils/emailFormatters';
import { formatCurrency } from '../utils/solarCalculations';
import {
  Database,
  Search,
  Filter,
  Download,
  Mail,
  Phone,
  MessageCircle,
  Printer,
  ChevronDown,
  ChevronUp,
  Clock,
  MapPin,
  Building,
  CheckCircle2,
  FileSpreadsheet,
  Check,
} from 'lucide-react';

interface SubmissionsDrawerProps {
  surveys: SolarSurveyData[];
  onSelectSurveyForPrint: (survey: SolarSurveyData) => void;
  onUpdateStatus: (id: string, newStatus: SolarSurveyData['status']) => void;
}

export const SubmissionsDrawer: React.FC<SubmissionsDrawerProps> = ({
  surveys,
  onSelectSurveyForPrint,
  onUpdateStatus,
}) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState<string>('all');
  const [expandedId, setExpandedId] = useState<string | null>(surveys[0]?.id || null);
  const [exportToast, setExportToast] = useState<string | null>(null);

  const filteredSurveys = surveys.filter((s) => {
    const matchesSearch =
      s.clientName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      s.clientPhone.toLowerCase().includes(searchTerm.toLowerCase()) ||
      s.cityDistrict.toLowerCase().includes(searchTerm.toLowerCase()) ||
      s.id.toLowerCase().includes(searchTerm.toLowerCase());

    const matchesStatus = statusFilter === 'all' || s.status === statusFilter;
    return matchesSearch && matchesStatus;
  });

  // Comprehensive CSV export function for Engineering Management
  const handleExportCSV = (exportScope: 'all' | 'filtered' = 'filtered') => {
    const dataToExport = exportScope === 'all' ? surveys : filteredSurveys;
    if (dataToExport.length === 0) {
      setExportToast('No survey records available to export.');
      setTimeout(() => setExportToast(null), 3000);
      return;
    }

    const headers = [
      'Survey Reference ID',
      'Submission Timestamp',
      'Client / Organization Name',
      'Contact Phone (WhatsApp)',
      'Contact Email',
      'Site Address',
      'District / Solar Zone',
      'Property Category',
      'Power Utility Provider',
      'Sanctioned Grid Load (kW)',
      'Connection Phase',
      'Roof Surface Type',
      'Shadow Condition',
      'Delivery Model',
      'System Architecture',
      'Solar Array Capacity (kWp)',
      'Solar Panel Count',
      'Module Wattage (W)',
      'Inverter Rating (kW)',
      'Inverter Grid Phase',
      'Battery Bank (kWh)',
      'Battery Capacity (Ah @ 48V)',
      'Battery Chemistry',
      'Required Rooftop Space (sq ft)',
      'Required Rooftop Space (sq m)',
      'Daily Generation (kWh)',
      'Monthly Generation (kWh)',
      'Annual Generation (kWh)',
      'Est. Monthly Savings (BDT)',
      'Est. Annual Savings (BDT)',
      'Est. Turnkey Cost Min (BDT)',
      'Est. Turnkey Cost Max (BDT)',
      'Payback Period (Years)',
      'Annual CO2 Offset (Metric Tons)',
      'Equivalent Trees Planted',
      'Workflow Status',
      'Notification Recipients',
      'Engineering Remarks & Notes',
    ];

    const escapeCsvField = (field: any): string => {
      if (field === null || field === undefined) return '""';
      const str = String(field);
      return `"${str.replace(/"/g, '""')}"`;
    };

    const rows = dataToExport.map((s) => {
      const calc = s.calculationSummary || {};
      return [
        escapeCsvField(s.id),
        escapeCsvField(new Date(s.createdAt).toISOString()),
        escapeCsvField(s.clientName),
        escapeCsvField(s.clientPhone),
        escapeCsvField(s.clientEmail || ''),
        escapeCsvField(s.siteAddress || ''),
        escapeCsvField(s.cityDistrict),
        escapeCsvField(s.propertyType),
        escapeCsvField(s.electricityProvider),
        s.sanctionedLoadKw || 0,
        escapeCsvField(s.connectionType),
        escapeCsvField(s.roofType),
        escapeCsvField(s.shadowCondition),
        escapeCsvField(s.executionPreference),
        escapeCsvField(s.systemType),
        calc.actualArrayKw || 0,
        calc.panelCount || 0,
        calc.panelWattage || 550,
        calc.recommendedInverterKw || 0,
        escapeCsvField(calc.inverterPhase || ''),
        calc.batteryCapacityKwh || 0,
        calc.batteryCapacityAh || 0,
        escapeCsvField(calc.batteryChemistry || 'none'),
        calc.roofAreaRequiredSqFt || 0,
        calc.roofAreaRequiredSqM || 0,
        calc.estimatedDailyGenerationKwh || 0,
        calc.estimatedMonthlyGenerationKwh || 0,
        calc.estimatedAnnualGenerationKwh || 0,
        calc.estimatedMonthlySavings || 0,
        calc.estimatedAnnualSavings || 0,
        calc.estimatedSystemCostMin || 0,
        calc.estimatedSystemCostMax || 0,
        calc.paybackYears || 0,
        calc.co2OffsetTonsYear || 0,
        calc.equivalentTreesPlanted || 0,
        escapeCsvField(s.status),
        escapeCsvField((s.recipients || COMPANY_INFO.emails).join('; ')),
        escapeCsvField(s.remarks || ''),
      ].join(',');
    });

    // Prefix with UTF-8 BOM (\uFEFF) so Excel respects encoding
    const csvContent = '\uFEFF' + [headers.join(','), ...rows].join('\r\n');
    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const fileName = `Unicorn_Energy_Surveys_${exportScope}_${new Date().toISOString().slice(0, 10)}.csv`;

    const downloadLink = document.createElement('a');
    downloadLink.href = url;
    downloadLink.setAttribute('download', fileName);
    document.body.appendChild(downloadLink);
    downloadLink.click();
    document.body.removeChild(downloadLink);
    URL.revokeObjectURL(url);

    setExportToast(`Exported ${dataToExport.length} survey record(s) to ${fileName}`);
    setTimeout(() => setExportToast(null), 4500);
  };

  const getStatusBadge = (status: SolarSurveyData['status']) => {
    switch (status) {
      case 'new':
        return <span className="text-amber-800 bg-amber-50 border border-amber-200 px-2 py-0.5 rounded text-[11px] font-semibold">New Lead</span>;
      case 'reviewed':
        return <span className="text-blue-800 bg-blue-50 border border-blue-200 px-2 py-0.5 rounded text-[11px] font-semibold">Reviewed</span>;
      case 'site_visit_scheduled':
        return <span className="text-purple-800 bg-purple-50 border border-purple-200 px-2 py-0.5 rounded text-[11px] font-semibold">Site Visit Scheduled</span>;
      case 'proposal_sent':
        return <span className="text-emerald-800 bg-emerald-50 border border-emerald-200 px-2 py-0.5 rounded text-[11px] font-semibold">Proposal Sent</span>;
      case 'contract_signed':
        return <span className="text-white bg-emerald-800 px-2 py-0.5 rounded text-[11px] font-semibold">Contract Signed</span>;
      default:
        return <span className="text-neutral-700 bg-neutral-100 px-2 py-0.5 rounded text-[11px] font-semibold">{status}</span>;
    }
  };

  return (
    <div className="bg-white rounded-2xl border border-neutral-200 shadow-xs p-6 md:p-8">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 pb-6 border-b border-neutral-200">
        <div>
          <div className="flex items-center gap-2 text-xs font-semibold text-emerald-800 uppercase tracking-wider mb-1">
            <span>Central Engineering Console</span>
            <span className="text-neutral-300">·</span>
            <span>Unicorn Group Bangladesh</span>
          </div>
          <h2 className="text-2xl font-bold text-neutral-900">
            Collected Solar Site Surveys ({filteredSurveys.length})
          </h2>
          <p className="text-sm text-neutral-600 mt-1">
            Review site audit data, manage project workflow, and export structured engineering survey CSV files.
          </p>
        </div>

        {/* Prominent CSV Export Actions */}
        <div className="flex flex-wrap items-center gap-2">
          <button
            onClick={() => handleExportCSV('filtered')}
            className="px-4 py-2.5 text-xs font-bold text-white bg-emerald-800 hover:bg-emerald-900 active:bg-emerald-950 rounded-lg shadow-sm transition-all flex items-center gap-2 cursor-pointer whitespace-nowrap"
            title="Download CSV for currently filtered records"
          >
            <Download className="w-4 h-4 text-emerald-300" />
            <span>Export CSV ({filteredSurveys.length})</span>
          </button>

          {surveys.length > filteredSurveys.length && (
            <button
              onClick={() => handleExportCSV('all')}
              className="px-3 py-2.5 text-xs font-semibold text-neutral-700 bg-neutral-100 hover:bg-neutral-200 rounded-lg transition-colors flex items-center gap-1.5 cursor-pointer border border-neutral-200 whitespace-nowrap"
              title="Export all database records without filter"
            >
              <FileSpreadsheet className="w-4 h-4 text-neutral-600" />
              <span>Export All ({surveys.length})</span>
            </button>
          )}
        </div>
      </div>

      {/* Export Confirmation Toast */}
      {exportToast && (
        <div className="my-4 p-3 bg-emerald-50 border border-emerald-200 rounded-xl text-emerald-900 text-xs font-semibold flex items-center justify-between animate-fade-in">
          <div className="flex items-center gap-2">
            <CheckCircle2 className="w-4 h-4 text-emerald-700 shrink-0" />
            <span>{exportToast}</span>
          </div>
          <button
            onClick={() => setExportToast(null)}
            className="text-neutral-400 hover:text-neutral-700 ml-2"
          >
            ✕
          </button>
        </div>
      )}

      {/* Filter & Search Bar */}
      <div className="my-6 grid grid-cols-1 md:grid-cols-3 gap-3">
        <div className="relative md:col-span-2">
          <Search className="w-4 h-4 text-neutral-400 absolute left-3 top-2.5" />
          <input
            type="text"
            placeholder="Search by client name, phone, district, or ID..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-9 pr-4 py-2 bg-neutral-50 border border-neutral-300 rounded-lg text-sm text-neutral-900 focus:outline-none focus:ring-2 focus:ring-emerald-700"
          />
        </div>

        <div>
          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            aria-label="Filter by Status"
            className="w-full py-2 px-3 bg-neutral-50 border border-neutral-300 rounded-lg text-sm text-neutral-900 focus:outline-none focus:ring-2 focus:ring-emerald-700"
          >
            <option value="all">All Workflow Statuses</option>
            <option value="new">New Lead</option>
            <option value="reviewed">Reviewed</option>
            <option value="site_visit_scheduled">Site Visit Scheduled</option>
            <option value="proposal_sent">Proposal Sent</option>
            <option value="contract_signed">Contract Signed</option>
          </select>
        </div>
      </div>

      {/* Survey Cards List */}
      <div className="space-y-4">
        {filteredSurveys.length === 0 ? (
          <div className="py-12 text-center text-neutral-400">
            <Database className="w-8 h-8 mx-auto mb-2 opacity-50" />
            <p className="text-sm font-semibold">No surveys matching criteria.</p>
          </div>
        ) : (
          filteredSurveys.map((survey) => {
            const isExpanded = expandedId === survey.id;
            const calc = survey.calculationSummary;

            return (
              <div
                key={survey.id}
                className="rounded-xl border border-neutral-200 overflow-hidden bg-white hover:border-neutral-300 transition-colors"
              >
                {/* Header Row */}
                <div
                  onClick={() => setExpandedId(isExpanded ? null : survey.id)}
                  className="p-4 sm:p-5 flex flex-col sm:flex-row sm:items-center justify-between gap-3 cursor-pointer bg-neutral-50/50 hover:bg-neutral-50"
                >
                  <div className="flex items-center gap-3">
                    <span className="font-mono text-xs font-bold text-neutral-600 bg-neutral-200/80 px-2 py-0.5 rounded">
                      {survey.id}
                    </span>
                    <div>
                      <h4 className="text-base font-bold text-neutral-900 leading-snug">
                        {survey.clientName}
                      </h4>
                      <div className="flex items-center gap-2 text-xs text-neutral-500 mt-0.5">
                        <span>{survey.cityDistrict}</span>
                        <span>·</span>
                        <span>{survey.clientPhone}</span>
                        <span>·</span>
                        <span>{new Date(survey.createdAt).toLocaleDateString('en-GB')}</span>
                      </div>
                    </div>
                  </div>

                  <div className="flex items-center gap-3">
                    <div className="text-right">
                      <span className="font-mono font-extrabold text-emerald-900 text-sm block">
                        {calc?.actualArrayKw || 0} kWp
                      </span>
                      <span className="text-[11px] text-neutral-500 capitalize">
                        {survey.systemType} ({calc?.panelCount || 0} panels)
                      </span>
                    </div>

                    <div>{getStatusBadge(survey.status)}</div>

                    <button
                      type="button"
                      className="p-1 text-neutral-400 hover:text-neutral-700"
                      aria-label="Toggle details"
                    >
                      {isExpanded ? <ChevronUp className="w-5 h-5" /> : <ChevronDown className="w-5 h-5" />}
                    </button>
                  </div>
                </div>

                {/* Expanded Details */}
                {isExpanded && (
                  <div className="p-5 border-t border-neutral-200 bg-white">
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-6 text-sm mb-6">
                      {/* Column 1: Client & Site */}
                      <div>
                        <h5 className="text-xs font-bold uppercase tracking-wider text-neutral-500 mb-2">
                          Site Contact & Location
                        </h5>
                        <ul className="space-y-1.5 text-xs text-neutral-700">
                          <li>
                            <strong className="text-neutral-900">Address:</strong> {survey.siteAddress}
                          </li>
                          <li>
                            <strong className="text-neutral-900">Email:</strong> {survey.clientEmail || 'N/A'}
                          </li>
                          <li>
                            <strong className="text-neutral-900">Utility Provider:</strong> {survey.electricityProvider}
                          </li>
                          <li>
                            <strong className="text-neutral-900">Sanctioned Load:</strong> {survey.sanctionedLoadKw} kW ({survey.connectionType})
                          </li>
                        </ul>
                      </div>

                      {/* Column 2: Roof & Technical */}
                      <div>
                        <h5 className="text-xs font-bold uppercase tracking-wider text-neutral-500 mb-2">
                          Roof Specifications
                        </h5>
                        <ul className="space-y-1.5 text-xs text-neutral-700">
                          <li>
                            <strong className="text-neutral-900">Roof Surface:</strong> {survey.roofType.replace('_', ' ').toUpperCase()}
                          </li>
                          <li>
                            <strong className="text-neutral-900">Shadow Profile:</strong> {survey.shadowCondition.replace('_', ' ')}
                          </li>
                          <li>
                            <strong className="text-neutral-900">Inverter:</strong> {calc?.recommendedInverterKw} kW ({calc?.inverterPhase})
                          </li>
                          <li>
                            <strong className="text-neutral-900">Storage Bank:</strong>{' '}
                            {calc?.requiresBattery ? `${calc.batteryCapacityKwh} kWh (${calc.batteryCapacityAh}Ah)` : 'None (Net Metering)'}
                          </li>
                        </ul>
                      </div>

                      {/* Column 3: Financial Estimates */}
                      <div>
                        <h5 className="text-xs font-bold uppercase tracking-wider text-neutral-500 mb-2">
                          Energy & Commercials
                        </h5>
                        <ul className="space-y-1.5 text-xs text-neutral-700 font-mono">
                          <li>
                            <strong className="text-neutral-900 font-sans">Annual Generation:</strong> {calc?.estimatedAnnualGenerationKwh?.toLocaleString()} kWh/yr
                          </li>
                          <li>
                            <strong className="text-neutral-900 font-sans">Est. Annual Savings:</strong> {formatCurrency(calc?.estimatedAnnualSavings || 0, 'BDT')}
                          </li>
                          <li>
                            <strong className="text-neutral-900 font-sans">Estimated Cost:</strong> {formatCurrency(calc?.estimatedSystemCostMin || 0, 'BDT')} - {formatCurrency(calc?.estimatedSystemCostMax || 0, 'BDT')}
                          </li>
                          <li>
                            <strong className="text-neutral-900 font-sans">Payback:</strong> {calc?.paybackYears} Years
                          </li>
                        </ul>
                      </div>
                    </div>

                    {survey.remarks && (
                      <div className="p-3 bg-neutral-50 rounded-lg text-xs text-neutral-700 mb-6 border border-neutral-200">
                        <strong className="text-neutral-900 block mb-0.5">Remarks / Field Notes:</strong>
                        {survey.remarks}
                      </div>
                    )}

                    {/* Actions and Status Updater */}
                    <div className="flex flex-wrap items-center justify-between gap-4 pt-4 border-t border-neutral-100">
                      <div className="flex items-center gap-2 text-xs">
                        <span className="font-semibold text-neutral-600">Update Status:</span>
                        <select
                          value={survey.status}
                          onChange={(e) => onUpdateStatus(survey.id, e.target.value as any)}
                          aria-label="Update survey status"
                          className="px-2 py-1 bg-white border border-neutral-300 rounded text-xs font-semibold text-neutral-800"
                        >
                          <option value="new">New Lead</option>
                          <option value="reviewed">Reviewed</option>
                          <option value="site_visit_scheduled">Site Visit Scheduled</option>
                          <option value="proposal_sent">Proposal Sent</option>
                          <option value="contract_signed">Contract Signed</option>
                        </select>
                      </div>

                      <div className="flex items-center gap-2">
                        <a
                          href={generateMailtoUrl(survey)}
                          className="px-3 py-1.5 text-xs font-bold text-white bg-emerald-800 hover:bg-emerald-900 rounded-lg transition-colors flex items-center gap-1.5"
                          title="Forward via Email"
                        >
                          <Mail className="w-3.5 h-3.5" />
                          <span>Dispatch Email</span>
                        </a>

                        <a
                          href={generateWhatsAppSummary(survey)}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="px-3 py-1.5 text-xs font-bold text-neutral-900 bg-amber-400 hover:bg-amber-300 rounded-lg transition-colors flex items-center gap-1.5"
                          title="Open WhatsApp chat with client"
                        >
                          <MessageCircle className="w-3.5 h-3.5" />
                          <span>WhatsApp</span>
                        </a>

                        <button
                          onClick={() => onSelectSurveyForPrint(survey)}
                          className="px-3 py-1.5 text-xs font-semibold text-neutral-700 bg-neutral-100 hover:bg-neutral-200 rounded-lg transition-colors flex items-center gap-1.5 border border-neutral-200 cursor-pointer"
                        >
                          <Printer className="w-3.5 h-3.5" />
                          <span>Print Proposal</span>
                        </button>
                      </div>
                    </div>
                  </div>
                )}
              </div>
            );
          })
        )}
      </div>
    </div>
  );
};
