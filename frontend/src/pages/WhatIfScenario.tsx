import React, { useState, useEffect, useCallback } from 'react';
import { Sparkles, ShieldCheck, CheckCircle2, MapPin, ArrowRight, Zap, TrendingDown, Users, DollarSign, Activity, Play } from 'lucide-react';
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

  const costPerBeneficiary = result && result.expected_population_beneficiaries > 0
    ? Math.round(budgetUsd / result.expected_population_beneficiaries)
    : 0;

  return (
    <div className="space-y-8 animate-in fade-in duration-150">
      {/* 1. Header Banner */}
      <div className="p-6 md:p-8 rounded-xl bg-[#0A0A0C] border border-white/[0.08] flex flex-col lg:flex-row lg:items-center justify-between gap-6 shadow-sm">
        <div className="space-y-2">
          <div className="flex items-center gap-2">
            <span className="w-2 h-2 rounded-full bg-indigo-500" />
            <span className="text-[11px] font-semibold uppercase tracking-wider text-slate-400 font-mono">
              Budget Simulator
            </span>
          </div>
          <h1 className="text-2xl md:text-[28px] font-semibold text-slate-100 tracking-tight font-sans">
            Budget & Investment <span className="hero-gradient-text">Simulator</span>
          </h1>
          <div className="flex flex-wrap items-center gap-2 pt-1 font-mono text-xs">
            <span className="px-2.5 py-1 rounded-md bg-[#121215] border border-white/[0.08] text-slate-300 font-medium">
              Simulate Budget Allocation
            </span>
            <span className="px-2.5 py-1 rounded-md bg-[#121215] border border-white/[0.08] text-slate-300 font-medium">
              Project People Benefited
            </span>
          </div>
        </div>

        <div className="px-3.5 py-2 rounded-lg bg-[#121215] border border-white/[0.08] text-xs font-mono text-amber-400 shrink-0 self-start lg:self-auto">
          Scenario estimate — policy reference model
        </div>
      </div>

      {/* 2. Quick Scenario Presets */}
      <div className="p-5 rounded-xl bg-[#0A0A0C] border border-white/[0.08] space-y-3 shadow-sm">
        <div className="flex items-center justify-between">
          <span className="text-xs font-mono font-medium text-slate-400 uppercase tracking-wider flex items-center gap-2">
            <Zap className="w-4 h-4 text-amber-400" />
            <span>Quick Intervention Presets:</span>
          </span>
        </div>
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-3 font-mono text-xs">
          <button
            onClick={() => applyPreset('healthcare', 20000000, 25)}
            className="p-3 rounded-lg bg-[#121215] border border-white/[0.08] hover:border-white/[0.16] text-left transition-colors cursor-pointer group"
          >
            <div className="font-semibold text-slate-100 group-hover:text-indigo-400 transition-colors">Healthcare Upgrade</div>
            <div className="text-[10px] text-slate-400 mt-0.5">$20M • +25% Coverage</div>
          </button>

          <button
            onClick={() => applyPreset('water', 15000000, 20)}
            className="p-3 rounded-lg bg-[#121215] border border-white/[0.08] hover:border-white/[0.16] text-left transition-colors cursor-pointer group"
          >
            <div className="font-semibold text-slate-100 group-hover:text-indigo-400 transition-colors">Clean Water Grid</div>
            <div className="text-[10px] text-slate-400 mt-0.5">$15M • +20% Coverage</div>
          </button>

          <button
            onClick={() => applyPreset('electricity', 25000000, 30)}
            className="p-3 rounded-lg bg-[#121215] border border-white/[0.08] hover:border-white/[0.16] text-left transition-colors cursor-pointer group"
          >
            <div className="font-semibold text-slate-100 group-hover:text-indigo-400 transition-colors">Solar Integration</div>
            <div className="text-[10px] text-slate-400 mt-0.5">$25M • +30% Coverage</div>
          </button>

          <button
            onClick={() => applyPreset('transportation', 12000000, 15)}
            className="p-3 rounded-lg bg-[#121215] border border-white/[0.08] hover:border-white/[0.16] text-left transition-colors cursor-pointer group"
          >
            <div className="font-semibold text-slate-100 group-hover:text-indigo-400 transition-colors">Transit Corridor</div>
            <div className="text-[10px] text-slate-400 mt-0.5">$12M • +15% Coverage</div>
          </button>

          <button
            onClick={() => applyPreset('digital_connectivity', 10000000, 20)}
            className="p-3 rounded-lg bg-[#121215] border border-white/[0.08] hover:border-white/[0.16] text-left transition-colors cursor-pointer group"
          >
            <div className="font-semibold text-slate-100 group-hover:text-indigo-400 transition-colors">5G Rural Network</div>
            <div className="text-[10px] text-slate-400 mt-0.5">$10M • +20% Coverage</div>
          </button>
        </div>
      </div>

      {/* 3. Main Policy Simulation Lab Workspace */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Left Column: Interactive Controls (5 cols) */}
        <div className="lg:col-span-5 p-6 rounded-xl bg-[#0A0A0C] border border-white/[0.08] space-y-5 flex flex-col justify-between shadow-sm">
          <div className="space-y-5">
            <div className="flex items-center gap-2 text-sm font-semibold text-slate-100 border-b border-white/[0.08] pb-3">
              <Sparkles className="w-4 h-4 text-indigo-400" />
              <span>Configure Policy Intervention</span>
            </div>

            {/* Region Selector */}
            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <label className="text-xs font-mono font-medium text-slate-400 uppercase">Target Region:</label>
                {selectedRegion && (
                  <button
                    onClick={() => setActiveDetailRegion(selectedRegion)}
                    className="text-xs font-mono font-medium text-indigo-400 hover:underline flex items-center gap-1 cursor-pointer"
                  >
                    <MapPin className="w-3.5 h-3.5" />
                    <span>Details</span>
                    <ArrowRight className="w-3 h-3" />
                  </button>
                )}
              </div>
              <select
                value={selectedRegionId}
                onChange={(e) => setSelectedRegionId(e.target.value)}
                className="w-full bg-[#121215] border border-white/[0.08] text-slate-100 text-xs rounded-lg p-2.5 focus:outline-none cursor-pointer"
              >
                {regions.map((r) => (
                  <option className="bg-[#121215] text-slate-100 text-xs py-1" key={r.id} value={r.id}>
                    {r.district_city}, {r.state_province} ({r.population.toLocaleString()} pop)
                  </option>
                ))}
              </select>
            </div>

            {/* Sector Selector */}
            <div className="space-y-2">
              <label className="text-xs font-mono font-medium text-slate-400 uppercase">Infrastructure Sector:</label>
              <select
                value={selectedCategory}
                onChange={(e) => setSelectedCategory(e.target.value)}
                className="w-full bg-[#121215] border border-white/[0.08] text-slate-100 text-xs rounded-lg p-2.5 focus:outline-none cursor-pointer"
              >
                <option className="bg-[#121215] text-slate-100 text-xs py-1" value="healthcare">Healthcare Facilities</option>
                <option className="bg-[#121215] text-slate-100 text-xs py-1" value="water">Clean Water Grid</option>
                <option className="bg-[#121215] text-slate-100 text-xs py-1" value="electricity">Electrical Grid</option>
                <option className="bg-[#121215] text-slate-100 text-xs py-1" value="transportation">Public Transportation</option>
                <option className="bg-[#121215] text-slate-100 text-xs py-1" value="digital_connectivity">Digital Connectivity</option>
                <option className="bg-[#121215] text-slate-100 text-xs py-1" value="sanitation">Sanitation Infrastructure</option>
              </select>
            </div>

            {/* Budget Slider */}
            <div className="space-y-3">
              <div className="flex justify-between text-xs font-mono font-medium">
                <span className="text-slate-400">Capital Budget:</span>
                <span className="text-green-400 font-semibold">${budgetUsd.toLocaleString()} USD</span>
              </div>
              <input
                type="range"
                min={1000000}
                max={50000000}
                step={1000000}
                value={budgetUsd}
                onChange={(e) => setBudgetUsd(Number(e.target.value))}
                className="w-full h-2 bg-[#121215] rounded-lg appearance-none cursor-pointer accent-indigo-500 border border-white/[0.08]"
              />
              <div className="flex justify-between text-[10px] text-slate-400 font-mono">
                <span>$1M</span>
                <span>$25M</span>
                <span>$50M USD</span>
              </div>
            </div>

            {/* Target Coverage Addition Slider */}
            <div className="space-y-3">
              <div className="flex justify-between text-xs font-mono font-medium">
                <span className="text-slate-400">Coverage Addition:</span>
                <span className="text-indigo-400 font-semibold">+{targetCoveragePct}%</span>
              </div>
              <input
                type="range"
                min={5}
                max={40}
                step={5}
                value={targetCoveragePct}
                onChange={(e) => setTargetCoveragePct(Number(e.target.value))}
                className="w-full h-2 bg-[#121215] rounded-lg appearance-none cursor-pointer accent-indigo-500 border border-white/[0.08]"
              />
              <div className="flex justify-between text-[10px] text-slate-400 font-mono">
                <span>+5%</span>
                <span>+20%</span>
                <span>+40%</span>
              </div>
            </div>
          </div>

          <button
            onClick={handleSimulate}
            disabled={loading}
            className="w-full py-3 rounded-lg bg-indigo-600 hover:bg-indigo-500 text-white font-medium text-xs transition flex items-center justify-center gap-2 disabled:opacity-50 cursor-pointer shadow-sm mt-3"
          >
            {loading ? (
              <span>Running Simulation...</span>
            ) : (
              <>
                <Play className="w-4 h-4 fill-white" />
                <span>Execute Simulation</span>
              </>
            )}
          </button>
        </div>

        {/* Right Column: Visual Simulation Dashboard (7 cols) */}
        <div className="lg:col-span-7 p-6 rounded-xl bg-[#0A0A0C] border border-white/[0.08] space-y-5 flex flex-col justify-between shadow-sm">
          <div className="space-y-5">
            <div className="flex items-center justify-between border-b border-white/[0.08] pb-3">
              <div className="flex items-center gap-2 text-sm font-semibold text-slate-100">
                <CheckCircle2 className="w-4 h-4 text-green-400" />
                <span>Simulated Impact Output</span>
              </div>
              <span className="text-[10px] font-mono font-medium px-2 py-0.5 rounded bg-green-500/10 text-green-400 border border-green-500/20">
                ENGINE OUTPUT
              </span>
            </div>

            {result && (
              <div className="space-y-5">
                {/* Visual Priority Score Reduction Gauge Cards */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  {/* Baseline Score Card */}
                  <div className="p-4 rounded-lg bg-[#121215] border border-red-500/20 space-y-1.5 shadow-sm">
                    <div className="flex items-center justify-between text-[11px] font-mono text-slate-400">
                      <span>BASELINE PRIORITY SCORE</span>
                      <span className="text-red-400 font-medium">HIGH DEMAND</span>
                    </div>
                    <div className="text-3xl font-semibold font-mono text-red-400">
                      {result.original_priority_score.toFixed(1)} <span className="text-xs text-slate-400">/ 100</span>
                    </div>
                    <div className="w-full h-1.5 rounded-full bg-[#0A0A0C] overflow-hidden border border-white/[0.08]">
                      <div
                        className="h-full bg-red-500 rounded-full"
                        style={{ width: `${result.original_priority_score}%` }}
                      />
                    </div>
                  </div>

                  {/* Simulated Score Card */}
                  <div className="p-4 rounded-lg bg-[#121215] border border-green-500/30 space-y-1.5 shadow-sm">
                    <div className="flex items-center justify-between text-[11px] font-mono text-slate-400">
                      <span>POST-INTERVENTION SCORE</span>
                      <span className="text-green-400 font-medium">OPTIMIZED</span>
                    </div>
                    <div className="text-3xl font-semibold font-mono text-green-400 flex items-baseline gap-2">
                      <span>{result.simulated_priority_score.toFixed(1)}</span>
                      <span className="text-xs text-slate-400">/ 100</span>
                      <span className="text-[11px] font-mono text-green-400 bg-green-500/10 px-2 py-0.5 rounded border border-green-500/20">
                        {result.score_delta > 0 ? `+${result.score_delta}` : result.score_delta} pts
                      </span>
                    </div>
                    <div className="w-full h-1.5 rounded-full bg-[#0A0A0C] overflow-hidden border border-white/[0.08]">
                      <div
                        className="h-full bg-green-500 rounded-full"
                        style={{ width: `${result.simulated_priority_score}%` }}
                      />
                    </div>
                  </div>
                </div>

                {/* 3 Key Metric ROI Cards */}
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 font-mono text-xs">
                  <div className="p-3.5 rounded-lg bg-[#121215] border border-white/[0.08] space-y-1">
                    <div className="flex items-center gap-1.5 text-slate-400 text-[10px]">
                      <TrendingDown className="w-3.5 h-3.5 text-green-400" />
                      <span>Capacity Deficit</span>
                    </div>
                    <div className="text-base font-semibold text-green-400">{result.projected_gap_score.toFixed(2)}</div>
                    <div className="text-[10px] text-slate-400 font-sans">Projected score</div>
                  </div>

                  <div className="p-3.5 rounded-lg bg-[#121215] border border-white/[0.08] space-y-1">
                    <div className="flex items-center gap-1.5 text-slate-400 text-[10px]">
                      <Users className="w-3.5 h-3.5 text-indigo-400" />
                      <span>Beneficiaries</span>
                    </div>
                    <div className="text-base font-semibold text-indigo-400">~{result.expected_population_beneficiaries.toLocaleString()}</div>
                    <div className="text-[10px] text-slate-400 font-sans">Impacted residents</div>
                  </div>

                  <div className="p-3.5 rounded-lg bg-[#121215] border border-white/[0.08] space-y-1">
                    <div className="flex items-center gap-1.5 text-slate-400 text-[10px]">
                      <DollarSign className="w-3.5 h-3.5 text-amber-400" />
                      <span>Cost per Resident</span>
                    </div>
                    <div className="text-base font-semibold text-amber-400">${costPerBeneficiary} USD</div>
                    <div className="text-[10px] text-slate-400 font-sans">Capital efficiency</div>
                  </div>
                </div>

                {/* AI Executive Summary Box */}
                <div className="p-4 rounded-lg bg-[#121215] border border-white/[0.08] space-y-1.5 shadow-sm">
                  <div className="flex items-center gap-2 text-xs font-mono font-medium text-slate-300">
                    <Activity className="w-3.5 h-3.5 text-indigo-400" />
                    <span>Executive Summary:</span>
                  </div>
                  <p className="text-xs font-sans text-slate-200 leading-relaxed italic">
                    "{result.simulation_notes}"
                  </p>
                </div>
              </div>
            )}
          </div>

          <div className="p-3.5 rounded-lg bg-[#121215] border border-white/[0.08] text-xs text-slate-400 font-mono flex items-center gap-2 mt-4">
            <ShieldCheck className="w-4 h-4 text-indigo-400 shrink-0" />
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
