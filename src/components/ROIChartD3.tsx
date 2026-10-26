import React, { useEffect, useRef, useState, useMemo } from 'react';
import * as d3 from 'd3';
import { SolarCalculationResult } from '../types/solar';
import { formatCurrency } from '../utils/solarCalculations';
import { TrendingUp, Award, DollarSign, Calendar, Info } from 'lucide-react';

interface ROIChartD3Props {
  calculation: SolarCalculationResult;
  baseTariff?: number;
}

interface YearProjection {
  year: number;
  generationKwh: number;
  annualSavings: number;
  cumulativeSavings: number;
  netCashFlow: number; // cumulativeSavings - initialInvestment
  roiPercent: number;
  effectiveTariff: number;
}

export const ROIChartD3: React.FC<ROIChartD3Props> = ({
  calculation,
  baseTariff = 9.5,
}) => {
  const svgRef = useRef<SVGSVGElement | null>(null);
  const containerRef = useRef<HTMLDivElement | null>(null);
  const [hoveredData, setHoveredData] = useState<YearProjection | null>(null);
  const [chartView, setChartView] = useState<'both' | 'cumulative' | 'net'>('both');

  // Initial investment estimate (average of min and max)
  const initialInvestment = (calculation.estimatedSystemCostMin + calculation.estimatedSystemCostMax) / 2;

  // Calculate 20-Year financial series
  const projectionData: YearProjection[] = useMemo(() => {
    const data: YearProjection[] = [];
    let runningSavings = 0;
    const annualDegradation = 0.0055; // 0.55% annual PV degradation
    const tariffEscalation = 0.045; // 4.5% annual grid tariff inflation in Bangladesh

    for (let yr = 1; yr <= 20; yr++) {
      // Degraded generation
      const generation = calculation.estimatedAnnualGenerationKwh * Math.pow(1 - annualDegradation, yr - 1);
      // Escalated tariff
      const currentTariff = baseTariff * Math.pow(1 + tariffEscalation, yr - 1);
      const savingsThisYear = Math.round(generation * currentTariff);
      runningSavings += savingsThisYear;

      const netCash = runningSavings - initialInvestment;
      const roi = initialInvestment > 0 ? Math.round((netCash / initialInvestment) * 100) : 0;

      data.push({
        year: yr,
        generationKwh: Math.round(generation),
        annualSavings: savingsThisYear,
        cumulativeSavings: runningSavings,
        netCashFlow: netCash,
        roiPercent: roi,
        effectiveTariff: Math.round(currentTariff * 10) / 10,
      });
    }

    return data;
  }, [calculation, baseTariff, initialInvestment]);

  // Total 20-year return
  const total20YearSavings = projectionData[19]?.cumulativeSavings || 0;
  const total20YearNetProfit = projectionData[19]?.netCashFlow || 0;
  const lifetimeRoiPercent = projectionData[19]?.roiPercent || 0;

  // Render D3 Chart
  useEffect(() => {
    if (!svgRef.current || !containerRef.current || projectionData.length === 0) return;

    const containerWidth = containerRef.current.clientWidth || 700;
    const height = 340;
    const margin = { top: 30, right: 35, bottom: 45, left: 75 };
    const width = containerWidth;

    const svg = d3.select(svgRef.current);
    svg.selectAll('*').remove();

    svg.attr('viewBox', `0 0 ${width} ${height}`).attr('width', '100%').attr('height', height);

    // X Scale: Year 1 to 20
    const xScale = d3
      .scaleLinear()
      .domain([1, 20])
      .range([margin.left, width - margin.right]);

    // Y Scale: min is negative initial investment (if in net cash flow view) to max cumulative savings
    const minY = chartView === 'cumulative' ? 0 : -initialInvestment * 1.1;
    const maxY = Math.max(...projectionData.map((d) => d.cumulativeSavings)) * 1.1;

    const yScale = d3
      .scaleLinear()
      .domain([minY, maxY])
      .nice()
      .range([height - margin.bottom, margin.top]);

    // Defs: Gradients
    const defs = svg.append('defs');

    // Emerald gradient for Cumulative Savings
    const savingsGradient = defs
      .append('linearGradient')
      .attr('id', 'savingsAreaGrad')
      .attr('x1', '0')
      .attr('y1', '0')
      .attr('x2', '0')
      .attr('y2', '1');
    savingsGradient.append('stop').attr('offset', '0%').attr('stop-color', '#10b981').attr('stop-opacity', 0.28);
    savingsGradient.append('stop').attr('offset', '100%').attr('stop-color', '#10b981').attr('stop-opacity', 0.02);

    // Amber gradient for Net Profit Area
    const profitGradient = defs
      .append('linearGradient')
      .attr('id', 'profitAreaGrad')
      .attr('x1', '0')
      .attr('y1', '0')
      .attr('x2', '0')
      .attr('y2', '1');
    profitGradient.append('stop').attr('offset', '0%').attr('stop-color', '#f59e0b').attr('stop-opacity', 0.25);
    profitGradient.append('stop').attr('offset', '100%').attr('stop-color', '#f59e0b').attr('stop-opacity', 0.01);

    // Gridlines (Horizontal)
    const yAxisTicks = yScale.ticks(6);
    svg
      .append('g')
      .attr('class', 'grid')
      .selectAll('line')
      .data(yAxisTicks)
      .enter()
      .append('line')
      .attr('x1', margin.left)
      .attr('x2', width - margin.right)
      .attr('y1', (d) => yScale(d))
      .attr('y2', (d) => yScale(d))
      .attr('stroke', '#e5e7eb')
      .attr('stroke-dasharray', '3,3');

    // Zero line (Breakeven reference line)
    if (minY < 0) {
      svg
        .append('line')
        .attr('x1', margin.left)
        .attr('x2', width - margin.right)
        .attr('y1', yScale(0))
        .attr('y2', yScale(0))
        .attr('stroke', '#94a3b8')
        .attr('stroke-width', 1.5)
        .attr('stroke-dasharray', '4,4');

      svg
        .append('text')
        .attr('x', width - margin.right - 8)
        .attr('y', yScale(0) - 6)
        .attr('text-anchor', 'end')
        .attr('font-size', '10px')
        .attr('font-weight', '600')
        .attr('fill', '#64748b')
        .text('Breakeven (৳0 Net)');
    }

    // 1. Cumulative Savings Area & Line
    if (chartView === 'both' || chartView === 'cumulative') {
      const areaCumulative = d3
        .area<YearProjection>()
        .x((d) => xScale(d.year))
        .y0(yScale(0))
        .y1((d) => yScale(d.cumulativeSavings))
        .curve(d3.curveMonotoneX);

      svg
        .append('path')
        .datum(projectionData)
        .attr('fill', 'url(#savingsAreaGrad)')
        .attr('d', areaCumulative);

      const lineCumulative = d3
        .line<YearProjection>()
        .x((d) => xScale(d.year))
        .y((d) => yScale(d.cumulativeSavings))
        .curve(d3.curveMonotoneX);

      svg
        .append('path')
        .datum(projectionData)
        .attr('fill', 'none')
        .attr('stroke', '#059669')
        .attr('stroke-width', 2.8)
        .attr('d', lineCumulative);
    }

    // 2. Net Cash Flow Line (transitioning from negative initial investment to net profit)
    if (chartView === 'both' || chartView === 'net') {
      const lineNet = d3
        .line<YearProjection>()
        .x((d) => xScale(d.year))
        .y((d) => yScale(d.netCashFlow))
        .curve(d3.curveMonotoneX);

      svg
        .append('path')
        .datum(projectionData)
        .attr('fill', 'none')
        .attr('stroke', '#d97706')
        .attr('stroke-width', 2.5)
        .attr('stroke-dasharray', chartView === 'both' ? '6,3' : 'none')
        .attr('d', lineNet);
    }

    // Payback breakeven point circle & badge
    const paybackYearFloat = calculation.paybackYears;
    if (paybackYearFloat >= 1 && paybackYearFloat <= 20) {
      const pbX = xScale(paybackYearFloat);
      const pbY = yScale(0);

      // Outer ripple
      svg
        .append('circle')
        .attr('cx', pbX)
        .attr('cy', pbY)
        .attr('r', 8)
        .attr('fill', '#fef3c7')
        .attr('stroke', '#f59e0b')
        .attr('stroke-width', 2);

      // Inner dot
      svg
        .append('circle')
        .attr('cx', pbX)
        .attr('cy', pbY)
        .attr('r', 4)
        .attr('fill', '#d97706');

      // Label
      svg
        .append('text')
        .attr('x', pbX)
        .attr('y', pbY + 20)
        .attr('text-anchor', 'middle')
        .attr('font-size', '10px')
        .attr('font-weight', '700')
        .attr('fill', '#b45309')
        .text(`Payback: Yr ${paybackYearFloat}`);
    }

    // X-Axis
    const xAxis = d3
      .axisBottom(xScale)
      .ticks(10)
      .tickFormat((d) => `Yr ${d}`);

    svg
      .append('g')
      .attr('transform', `translate(0, ${height - margin.bottom})`)
      .call(xAxis)
      .call((g) => g.select('.domain').attr('stroke', '#cbd5e1'))
      .call((g) => g.selectAll('.tick line').attr('stroke', '#cbd5e1'))
      .call((g) => g.selectAll('.tick text').attr('fill', '#64748b').attr('font-size', '11px'));

    // Y-Axis
    const yAxis = d3
      .axisLeft(yScale)
      .ticks(5)
      .tickFormat((d) => {
        const val = Number(d);
        if (Math.abs(val) >= 1000000) return `৳${(val / 1000000).toFixed(1)}M`;
        if (Math.abs(val) >= 1000) return `৳${Math.round(val / 1000)}k`;
        return `৳${val}`;
      });

    svg
      .append('g')
      .attr('transform', `translate(${margin.left}, 0)`)
      .call(yAxis)
      .call((g) => g.select('.domain').remove())
      .call((g) => g.selectAll('.tick line').remove())
      .call((g) => g.selectAll('.tick text').attr('fill', '#64748b').attr('font-size', '11px'));

    // Overlay for Hover Inspection
    const bisectYear = d3.bisector<YearProjection, number>((d) => d.year).center;

    const hoverLine = svg
      .append('line')
      .attr('stroke', '#064e3b')
      .attr('stroke-width', 1.5)
      .attr('stroke-dasharray', '3,3')
      .style('opacity', 0);

    const hoverDotSavings = svg
      .append('circle')
      .attr('r', 5)
      .attr('fill', '#059669')
      .attr('stroke', '#ffffff')
      .attr('stroke-width', 2)
      .style('opacity', 0);

    const hoverDotNet = svg
      .append('circle')
      .attr('r', 5)
      .attr('fill', '#d97706')
      .attr('stroke', '#ffffff')
      .attr('stroke-width', 2)
      .style('opacity', 0);

    svg
      .append('rect')
      .attr('width', width - margin.left - margin.right)
      .attr('height', height - margin.top - margin.bottom)
      .attr('transform', `translate(${margin.left}, ${margin.top})`)
      .attr('fill', 'transparent')
      .style('cursor', 'crosshair')
      .on('mousemove', (event) => {
        const [xPos] = d3.pointer(event);
        const yearVal = xScale.invert(xPos + margin.left);
        const index = bisectYear(projectionData, yearVal);
        const d = projectionData[index];

        if (d) {
          setHoveredData(d);
          const cx = xScale(d.year);

          hoverLine
            .attr('x1', cx)
            .attr('x2', cx)
            .attr('y1', margin.top)
            .attr('y2', height - margin.bottom)
            .style('opacity', 1);

          hoverDotSavings
            .attr('cx', cx)
            .attr('cy', yScale(d.cumulativeSavings))
            .style('opacity', 1);

          hoverDotNet
            .attr('cx', cx)
            .attr('cy', yScale(d.netCashFlow))
            .style('opacity', 1);
        }
      })
      .on('mouseleave', () => {
        setHoveredData(null);
        hoverLine.style('opacity', 0);
        hoverDotSavings.style('opacity', 0);
        hoverDotNet.style('opacity', 0);
      });
  }, [projectionData, chartView, initialInvestment, calculation.paybackYears]);

  return (
    <div className="bg-white rounded-xl border border-neutral-200 p-5 mt-6 shadow-xs">
      {/* Title & View Controls */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-4 border-b border-neutral-100">
        <div>
          <div className="flex items-center gap-2 text-xs font-bold text-emerald-800 uppercase tracking-wider mb-1">
            <TrendingUp className="w-3.5 h-3.5 text-emerald-700" />
            <span>D3.js 20-Year Financial Simulation</span>
            <span className="text-neutral-300">·</span>
            <span>4.5% Tariff Escalation</span>
          </div>
          <h3 className="text-lg font-bold text-neutral-900">
            Projected Return on Investment (ROI) & Cumulative Savings
          </h3>
          <p className="text-xs text-neutral-500 mt-0.5">
            Interactive 20-year cash flow visualization accounting for Tier-1 PV module degradation and rising grid electricity costs.
          </p>
        </div>

        {/* View Switcher */}
        <div className="flex items-center gap-1 p-1 bg-neutral-100 rounded-lg self-start sm:self-auto">
          <button
            onClick={() => setChartView('both')}
            className={`px-2.5 py-1 text-xs font-semibold rounded-md transition-colors ${
              chartView === 'both' ? 'bg-white text-neutral-900 shadow-xs' : 'text-neutral-600 hover:text-neutral-900'
            }`}
          >
            All Curves
          </button>
          <button
            onClick={() => setChartView('cumulative')}
            className={`px-2.5 py-1 text-xs font-semibold rounded-md transition-colors ${
              chartView === 'cumulative' ? 'bg-white text-neutral-900 shadow-xs' : 'text-neutral-600 hover:text-neutral-900'
            }`}
          >
            Savings Only
          </button>
          <button
            onClick={() => setChartView('net')}
            className={`px-2.5 py-1 text-xs font-semibold rounded-md transition-colors ${
              chartView === 'net' ? 'bg-white text-neutral-900 shadow-xs' : 'text-neutral-600 hover:text-neutral-900'
            }`}
          >
            Net Cash Flow
          </button>
        </div>
      </div>

      {/* 20-Year Summary Highlights Strip */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 my-4">
        <div className="p-3 bg-neutral-50 rounded-lg border border-neutral-200">
          <span className="text-[11px] font-semibold text-neutral-500 uppercase block">20-Year Gross Savings</span>
          <div className="text-lg font-bold text-emerald-800 font-mono tabular-nums">
            {formatCurrency(total20YearSavings, 'BDT')}
          </div>
          <span className="text-[10px] text-neutral-500">Total bill credits</span>
        </div>

        <div className="p-3 bg-neutral-50 rounded-lg border border-neutral-200">
          <span className="text-[11px] font-semibold text-neutral-500 uppercase block">20-Year Net Profit</span>
          <div className="text-lg font-bold text-amber-700 font-mono tabular-nums">
            {formatCurrency(total20YearNetProfit, 'BDT')}
          </div>
          <span className="text-[10px] text-neutral-500">After capital amort.</span>
        </div>

        <div className="p-3 bg-neutral-50 rounded-lg border border-neutral-200">
          <span className="text-[11px] font-semibold text-neutral-500 uppercase block">Lifetime ROI %</span>
          <div className="text-lg font-bold text-emerald-900 font-mono tabular-nums">
            +{lifetimeRoiPercent}%
          </div>
          <span className="text-[10px] text-neutral-500">Return on capital</span>
        </div>

        <div className="p-3 bg-neutral-50 rounded-lg border border-neutral-200">
          <span className="text-[11px] font-semibold text-neutral-500 uppercase block">Breakeven Period</span>
          <div className="text-lg font-bold text-neutral-900 font-mono tabular-nums">
            {calculation.paybackYears} Years
          </div>
          <span className="text-[10px] text-emerald-700 font-medium">Free power thereafter</span>
        </div>
      </div>

      {/* D3 SVG Canvas Container */}
      <div ref={containerRef} className="relative w-full overflow-hidden">
        <svg ref={svgRef} className="w-full h-auto block select-none" />

        {/* Hover Tooltip Card */}
        {hoveredData && (
          <div className="absolute top-2 right-4 bg-white/95 backdrop-blur-md p-3 rounded-lg border border-neutral-300 shadow-md text-xs pointer-events-none min-w-[210px]">
            <div className="flex justify-between items-center pb-1.5 border-b border-neutral-200 mb-1.5">
              <strong className="text-neutral-900 font-bold">Year {hoveredData.year} Assessment</strong>
              <span className="font-mono text-[10px] text-neutral-500">৳{hoveredData.effectiveTariff}/unit</span>
            </div>
            <div className="space-y-1 font-mono text-[11px]">
              <div className="flex justify-between">
                <span className="text-neutral-500 font-sans">Annual Output:</span>
                <span className="font-bold text-neutral-900">{hoveredData.generationKwh.toLocaleString()} kWh</span>
              </div>
              <div className="flex justify-between">
                <span className="text-emerald-700 font-sans">Year Savings:</span>
                <span className="font-bold text-emerald-800">{formatCurrency(hoveredData.annualSavings, 'BDT')}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-emerald-700 font-sans">Cumulative:</span>
                <span className="font-bold text-emerald-800">{formatCurrency(hoveredData.cumulativeSavings, 'BDT')}</span>
              </div>
              <div className="flex justify-between pt-1 border-t border-neutral-100">
                <span className="text-amber-800 font-sans">Net Cash Flow:</span>
                <span className={`font-bold ${hoveredData.netCashFlow >= 0 ? 'text-amber-700' : 'text-neutral-500'}`}>
                  {formatCurrency(hoveredData.netCashFlow, 'BDT')}
                </span>
              </div>
              <div className="flex justify-between">
                <span className="text-neutral-500 font-sans">ROI %:</span>
                <span className="font-bold text-neutral-900">+{hoveredData.roiPercent}%</span>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Legend & Footnotes */}
      <div className="flex flex-wrap items-center justify-between gap-4 pt-3 border-t border-neutral-100 text-xs text-neutral-500">
        <div className="flex items-center gap-4">
          <div className="flex items-center gap-1.5">
            <span className="w-3.5 h-1 bg-emerald-600 rounded"></span>
            <span className="font-medium text-neutral-700">Cumulative Savings (BDT)</span>
          </div>
          <div className="flex items-center gap-1.5">
            <span className="w-3.5 h-1 border-t-2 border-dashed border-amber-600"></span>
            <span className="font-medium text-neutral-700">Net Cash Flow (After Initial Cost)</span>
          </div>
        </div>

        <div className="text-[11px] text-neutral-400">
          Hover over timeline to inspect year-by-year cash flows.
        </div>
      </div>
    </div>
  );
};
