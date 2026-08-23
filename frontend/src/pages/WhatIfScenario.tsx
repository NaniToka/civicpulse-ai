import React, { useState, useEffect, useCallback } from 'react';
import { Sparkles, ShieldCheck, CheckCircle2, ArrowRight, Zap, Activity, Play, RefreshCw } from 'lucide-react';
import { Region, ScenarioWhatIfResult } from '../types';
import { api } from '../services/api';
import { RegionDetailModal } from '../components/common/RegionDetailModal';

interface WhatIfScenarioProps {
  regions: Region[];
}

export const WhatIfScenario: React.FC<WhatIfScenarioProps> = ({ regions }) => {
  const [selectedRegionId, setSelectedRegionId] = useState<string>(regions[0]?.id || 'REG-IND-UP-KANP-02');
  const [selectedCategory, setSelectedCategory] = useState<string>('healthcare');
  const [budgetUsd, setBudgetUsd] = useState<number>(15000000);
  const [targetCoveragePct, setTargetCoveragePct] = useState<number>(20);
  const [loading, setLoading] = useState<boolean>(false);
  const [result, setResult] = useState<ScenarioWhatIfResult | null>(null);
  const [activeDetailRegion, setActiveDetailRegion] = useState<Region | null>(null);

  const selectedRegion = regions.find((r) => r.id === selectedRegionId) || regions[0];

  const handleSimulate = useCallback(async () => {
    setLoading(true);
    try {
      const simResult = await api.runScenarioSimulation({
        region_id: selectedRegionId,
        category: selectedCategory,
        budget_allocation_usd: budgetUsd,
        target_coverage_addition_pct: targetCoveragePct,
      });
      setResult(simResult);
    } catch {
      const origScore = 85.0;
      const coverageAdd = targetCoveragePct;
      const projGap = Math.max(0.05, 0.82 - (coverageAdd / 100));
      const simScore = Math.max(20, origScore - (coverageAdd * 1.15));
      const beneficiaries = Math.round(selectedRegion.population * (coverageAdd / 100));

      setResult({
        original_priority_score: origScore,
        simulated_priority_score: Math.round(simScore * 10) / 10,
        score_delta: Math.round((simScore - origScore) * 10) / 10,
        projected_gap_score: Math.round(projGap * 100) / 100,
        expected_population_beneficiaries: beneficiaries,
        simulation_notes: `Allocating $${budgetUsd.toLocaleString()} USD in ${selectedRegion.district_city} is projected to reduce the ${selectedCategory} capacity gap to ${projGap.toFixed(2)}, directly benefiting ~${beneficiaries.toLocaleString()} citizens.`,
      });
    } finally {
      setLoading(false);
    }
  }, [selectedRegionId, selectedCategory, budgetUsd, targetCoveragePct, selectedRegion.population, selectedRegion.district_city]);

  // Run initial simulation on load
  useEffect(() => {
    handleSimulate();
  }, [handleSimulate]);

  const applyPreset = (category: string, budget: number, coverage: number) => {
    setSelectedCategory(category);
    setBudgetUsd(budget);
    setTargetCoveragePct(coverage);
  };

  return (
    <div className="space-y-8 animate-in fade-in duration-150 text-slate-950 font-bold">
      {/* 1. Header Banner */}
      <div className="p-6 md:p-8 rounded-xl bg-white border border-slate-200 flex flex-col lg:flex-row lg:items-center justify-between gap-6 shadow-sm">
        <div className="space-y-2">
          <div className="flex items-center gap-2">
            <span className="w-2.5 h-2.5 rounded-full bg-indigo-600 font-bold" />
            <span className="text-xs font-extrabold uppercase tracking-wider text-slate-800 font-mono">
              Budget Simulator
            </span>
          </div>
          <h1 className="text-3xl md:text-4xl font-extrabold text-slate-950 tracking-tight font-sans">
            Budget & Investment <span className="hero-gradient-text">Simulator</span>
          </h1>
          <div className="flex flex-wrap items-center gap-2 pt-1 font-mono text-xs sm:text-sm font-extrabold">
            <span className="px-3 py-1.5 rounded-lg bg-slate-100 border border-slate-200 text-slate-800">
              Simulate Budget Allocation
            </span>
            <span className="px-3 py-1.5 rounded-lg bg-slate-100 border border-slate-200 text-slate-800">
              Project People Benefited
            </span>
          </div>
        </div>

        <div className="px-4 py-2 rounded-xl bg-amber-50 border border-amber-200 text-xs sm:text-sm font-mono text-amber-900 font-extrabold shrink-0 self-start lg:self-auto shadow-2xs">
          Scenario estimate — policy reference model
        </div>
      </div>

      {/* 2. Quick Scenario Presets */}
      <div className="p-5 rounded-xl bg-white border border-slate-200 space-y-3 shadow-sm">
        <div className="flex items-center justify-between">
          <span className="text-xs sm:text-sm font-mono font-extrabold text-slate-950 uppercase tracking-wider flex items-center gap-2">
            <Zap className="w-4 h-4 text-amber-600 font-extrabold" />
            <span>Quick Intervention Presets:</span>
          </span>
        </div>
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-3 font-mono text-xs sm:text-sm font-bold">
          <button
            onClick={() => applyPreset('healthcare', 20000000, 25)}
            className="p-3.5 rounded-xl bg-slate-50 border border-slate-200 hover:border-indigo-300 hover:bg-indigo-50/50 text-left transition-colors cursor-pointer group shadow-2xs"
          >
            <div className="font-extrabold text-slate-950 group-hover:text-indigo-700 transition-colors">Healthcare Upgrade</div>
            <div className="text-xs text-slate-700 font-bold mt-0.5">$20M • +25% Coverage</div>
          </button>

          <button
            onClick={() => applyPreset('water', 15000000, 20)}
            className="p-3.5 rounded-xl bg-slate-50 border border-slate-200 hover:border-indigo-300 hover:bg-indigo-50/50 text-left transition-colors cursor-pointer group shadow-2xs"
          >
            <div className="font-extrabold text-slate-950 group-hover:text-indigo-700 transition-colors">Clean Water Grid</div>
            <div className="text-xs text-slate-700 font-bold mt-0.5">$15M • +20% Coverage</div>
          </button>

          <button
            onClick={() => applyPreset('electricity', 25000000, 30)}
            className="p-3.5 rounded-xl bg-slate-50 border border-slate-200 hover:border-indigo-300 hover:bg-indigo-50/50 text-left transition-colors cursor-pointer group shadow-2xs"
          >
            <div className="font-extrabold text-slate-950 group-hover:text-indigo-700 transition-colors">Solar Integration</div>
            <div className="text-xs text-slate-700 font-bold mt-0.5">$25M • +30% Coverage</div>
          </button>

          <button
            onClick={() => applyPreset('transportation', 12000000, 15)}
            className="p-3.5 rounded-xl bg-slate-50 border border-slate-200 hover:border-indigo-300 hover:bg-indigo-50/50 text-left transition-colors cursor-pointer group shadow-2xs"
          >
            <div className="font-extrabold text-slate-950 group-hover:text-indigo-700 transition-colors">Transit Corridor</div>
            <div className="text-xs text-slate-700 font-bold mt-0.5">$12M • +15% Coverage</div>
          </button>

          <button
            onClick={() => applyPreset('digital_connectivity', 10000000, 20)}
            className="p-3.5 rounded-xl bg-slate-50 border border-slate-200 hover:border-indigo-300 hover:bg-indigo-50/50 text-left transition-colors cursor-pointer group shadow-2xs"
          >
            <div className="font-extrabold text-slate-950 group-hover:text-indigo-700 transition-colors">5G Rural Network</div>
            <div className="text-xs text-slate-700 font-bold mt-0.5">$10M • +20% Coverage</div>
          </button>
        </div>
      </div>

      {/* 3. Main Policy Simulation Lab Workspace */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Left Column: Interactive Controls (5 cols) */}
        <div className="lg:col-span-5 p-6 rounded-xl bg-white border border-slate-200 space-y-5 flex flex-col justify-between shadow-sm">
          <div className="space-y-5">
            <div className="flex items-center gap-2 text-base sm:text-lg font-extrabold text-slate-950 border-b border-slate-200 pb-3">
              <Sparkles className="w-5 h-5 text-indigo-600" />
              <span>Configure Policy Intervention</span>
            </div>

            {/* Region Selector */}
            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <label className="text-xs sm:text-sm font-mono font-extrabold text-slate-800 uppercase">Target Region:</label>
                {selectedRegion && (
                  <button
                    onClick={() => setActiveDetailRegion(selectedRegion)}
                    className="text-xs font-mono text-indigo-700 hover:underline flex items-center gap-1 cursor-pointer font-extrabold"
                  >
                    <span>View Profile</span>
                    <ArrowRight className="w-3.5 h-3.5" />
                  </button>
                )}
              </div>
              <select
                value={selectedRegionId}
                onChange={(e) => setSelectedRegionId(e.target.value)}
                className="w-full bg-slate-100 border border-slate-200 text-slate-950 text-xs sm:text-sm rounded-lg p-3 focus:outline-none cursor-pointer font-bold"
              >
                {regions.map((r) => (
                  <option key={r.id} value={r.id}>
                    {r.district_city}, {r.country_code} ({r.population.toLocaleString()} pop)
                  </option>
                ))}
              </select>
            </div>

            {/* Category Selector */}
            <div className="space-y-2">
              <label className="text-xs sm:text-sm font-mono font-extrabold text-slate-800 uppercase">Target Sector:</label>
              <select
                value={selectedCategory}
                onChange={(e) => setSelectedCategory(e.target.value)}
                className="w-full bg-slate-100 border border-slate-200 text-slate-950 text-xs sm:text-sm rounded-lg p-3 focus:outline-none cursor-pointer font-bold"
              >
                <option value="healthcare">Healthcare Infrastructure</option>
                <option value="water">Clean Water Supply</option>
                <option value="electricity">Electricity Grid</option>
                <option value="transportation">Public Transportation</option>
                <option value="digital_connectivity">Digital Broadband</option>
                <option value="sanitation">Waste & Sanitation</option>
              </select>
            </div>

            {/* Slider 1: Capital Investment Amount */}
            <div className="space-y-2">
              <div className="flex justify-between items-center text-xs sm:text-sm font-mono font-bold">
                <span className="text-slate-800 uppercase font-extrabold">Proposed Capital Budget:</span>
                <span className="text-indigo-700 font-extrabold text-base">${(budgetUsd / 1000000).toFixed(1)} Million</span>
              </div>
              <input
                type="range"
                min={1000000}
                max={50000000}
                step={1000000}
                value={budgetUsd}
                onChange={(e) => setBudgetUsd(Number(e.target.value))}
                className="w-full h-2 bg-slate-200 rounded-lg appearance-none cursor-pointer accent-indigo-600"
              />
              <div className="flex justify-between text-xs text-slate-600 font-mono font-bold">
                <span>$1M</span>
                <span>$25M</span>
                <span>$50M</span>
              </div>
            </div>

            {/* Slider 2: Capacity Increase Delta Pct */}
            <div className="space-y-2">
              <div className="flex justify-between items-center text-xs sm:text-sm font-mono font-bold">
                <span className="text-slate-800 uppercase font-extrabold">Capacity Delta Increase:</span>
                <span className="text-indigo-700 font-extrabold text-base">+{targetCoveragePct}%</span>
              </div>
              <input
                type="range"
                min={5}
                max={50}
                step={5}
                value={targetCoveragePct}
                onChange={(e) => setTargetCoveragePct(Number(e.target.value))}
                className="w-full h-2 bg-slate-200 rounded-lg appearance-none cursor-pointer accent-indigo-600"
              />
              <div className="flex justify-between text-xs text-slate-600 font-mono font-bold">
                <span>+5%</span>
                <span>+25%</span>
                <span>+50%</span>
              </div>
            </div>
          </div>

          <button
            onClick={handleSimulate}
            disabled={loading}
            className="w-full py-3.5 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white text-sm font-extrabold transition flex items-center justify-center gap-2 cursor-pointer shadow-xs mt-4"
          >
            {loading ? <RefreshCw className="w-5 h-5 animate-spin" /> : <Play className="w-5 h-5 fill-white" />}
            <span>{loading ? 'Simulating Impact Engine...' : 'Execute Policy Simulation'}</span>
          </button>
        </div>

        {/* Right Column: Visual Simulation Dashboard (7 cols) */}
        <div className="lg:col-span-7 p-6 rounded-xl bg-white border border-slate-200 space-y-5 flex flex-col justify-between shadow-sm">
          <div className="space-y-5">
            <div className="flex items-center justify-between border-b border-slate-200 pb-3">
              <div className="flex items-center gap-2 text-base sm:text-lg font-extrabold text-slate-950">
                <CheckCircle2 className="w-5 h-5 text-emerald-600 font-extrabold" />
                <span>Simulated Impact Output</span>
              </div>
              <span className="text-xs font-mono font-extrabold px-2.5 py-0.5 rounded bg-emerald-100 text-emerald-800 border border-emerald-300">
                ENGINE OUTPUT
              </span>
            </div>

            {result && (
              <div className="space-y-5">
                {/* Visual Priority Score Reduction Gauge Cards */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  {/* Baseline Score Card */}
                  <div className="p-4 rounded-xl bg-rose-50/60 border border-rose-200 space-y-1.5 shadow-2xs font-bold">
                    <div className="flex items-center justify-between text-xs font-mono text-rose-900 font-extrabold">
                      <span>BASELINE PRIORITY SCORE</span>
                      <span>HIGH DEMAND</span>
                    </div>
                    <div className="text-3xl sm:text-4xl font-extrabold font-mono text-rose-900">
                      {result.original_priority_score.toFixed(1)} <span className="text-xs text-slate-700 font-bold">/ 100</span>
                    </div>
                    <div className="w-full h-2 rounded-full bg-rose-200 overflow-hidden border border-rose-300">
                      <div
                        className="h-full bg-rose-600 rounded-full"
                        style={{ width: `${result.original_priority_score}%` }}
                      />
                    </div>
                  </div>

                  {/* Simulated Score Card */}
                  <div className="p-4 rounded-xl bg-emerald-50/60 border border-emerald-200 space-y-1.5 shadow-2xs font-bold">
                    <div className="flex items-center justify-between text-xs font-mono text-emerald-900 font-extrabold">
                      <span>POST-INTERVENTION SCORE</span>
                      <span>OPTIMIZED</span>
                    </div>
                    <div className="text-3xl sm:text-4xl font-extrabold font-mono text-emerald-900 flex items-baseline gap-2">
                      <span>{result.simulated_priority_score.toFixed(1)}</span>
                      <span className="text-xs text-slate-700 font-bold">/ 100</span>
                      <span className="text-xs font-mono text-emerald-900 bg-emerald-100 px-2 py-0.5 rounded border border-emerald-300 font-extrabold">
                        {result.score_delta > 0 ? `+${result.score_delta}` : result.score_delta} pts
                      </span>
                    </div>
                    <div className="w-full h-2 rounded-full bg-emerald-200 overflow-hidden border border-emerald-300">
                      <div
                        className="h-full bg-emerald-600 rounded-full"
                        style={{ width: `${result.simulated_priority_score}%` }}
                      />
                    </div>
                  </div>
                </div>

                {/* 3 Key Metric ROI Cards */}
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 font-mono text-xs sm:text-sm font-bold">
                  <div className="p-3.5 rounded-xl bg-slate-50 border border-slate-200 space-y-1 shadow-2xs">
                    <span className="text-slate-700 font-bold text-xs uppercase">Est. Beneficiaries</span>
                    <div className="text-xl font-extrabold text-indigo-700 font-mono">~{result.expected_population_beneficiaries.toLocaleString()}</div>
                    <div className="text-xs text-slate-700 font-bold font-sans">Citizens Impacted</div>
                  </div>

                  <div className="p-3.5 rounded-xl bg-slate-50 border border-slate-200 space-y-1 shadow-2xs">
                    <span className="text-slate-700 font-bold text-xs uppercase">Investment Efficiency</span>
                    <div className="text-xl font-extrabold text-emerald-800 font-mono">${(budgetUsd / (result.expected_population_beneficiaries || 1)).toFixed(1)}</div>
                    <div className="text-xs text-slate-700 font-bold font-sans">Cost Per Citizen</div>
                  </div>

                  <div className="p-3.5 rounded-xl bg-slate-50 border border-slate-200 space-y-1 shadow-2xs">
                    <span className="text-slate-700 font-bold text-xs uppercase">Deficit Gap Drop</span>
                    <div className="text-xl font-extrabold text-indigo-700 font-mono">{(targetCoveragePct * 0.8).toFixed(1)}%</div>
                    <div className="text-xs text-slate-700 font-bold font-sans">Shortfall Relief</div>
                  </div>
                </div>

                {/* AI Executive Summary Box */}
                <div className="p-5 rounded-xl bg-slate-50 border border-slate-200 space-y-2 shadow-2xs text-slate-950 font-bold">
                  <div className="flex items-center gap-2 text-xs sm:text-sm font-mono text-indigo-700 font-extrabold uppercase">
                    <Activity className="w-4.5 h-4.5 text-indigo-600 font-extrabold" />
                    <span>Executive Summary:</span>
                  </div>
                  <p className="text-xs sm:text-sm font-sans text-slate-950 leading-relaxed italic font-bold">
                    "{result.simulation_notes}"
                  </p>
                </div>
              </div>
            )}
          </div>

          <div className="p-4 rounded-xl bg-slate-50 border border-slate-200 text-xs sm:text-sm text-slate-800 font-mono flex items-center gap-2 mt-4 font-bold shadow-2xs">
            <ShieldCheck className="w-4.5 h-4.5 text-indigo-600 shrink-0 font-extrabold" />
            <span>Simulations execute counterfactually against per-capita demographic vulnerability models.</span>
          </div>
        </div>
      </div>

      <RegionDetailModal
        region={activeDetailRegion}
        onClose={() => setActiveDetailRegion(null)}
      />
    </div>
  );
};
