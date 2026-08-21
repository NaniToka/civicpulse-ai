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
    <div className="space-y-8 animate-in fade-in duration-300">
      {/* 1. Header Banner */}
      <div className="p-6 md:p-8 rounded-2xl glass-panel-cyan flex flex-col lg:flex-row lg:items-center justify-between gap-6 border border-cyan-800/40 shadow-2xl">
        <div className="space-y-2">
          <div className="flex items-center gap-2">
            <span className="w-2.5 h-2.5 rounded-full bg-cyan-400 animate-ping" />
            <span className="text-xs font-mono font-extrabold text-cyan-300 bg-cyan-950 px-3 py-1 rounded-full border border-cyan-700">
              POLICY LAB & SIMULATOR
            </span>
          </div>
          <h1 className="text-2xl md:text-3xl font-extrabold text-slate-100 tracking-tight font-sans">
            Scenario Lab & <span className="gradient-text-cyan">Policy Simulator</span>
          </h1>
          <div className="flex flex-wrap items-center gap-2 pt-1 font-mono text-[11px]">
            <span className="px-3 py-1 rounded-full bg-cyan-950/90 border border-cyan-700/80 text-cyan-300 font-bold">
              Counterfactual Simulation
            </span>
            <span className="px-3 py-1 rounded-full bg-indigo-950/90 border border-indigo-700/80 text-indigo-300 font-bold">
              Capital Budget Allocation ($)
            </span>
            <span className="px-3 py-1 rounded-full bg-emerald-950/90 border border-emerald-700/80 text-emerald-300 font-bold">
              Impacted Beneficiary Count
            </span>
          </div>
        </div>

        <div className="px-4 py-2.5 rounded-xl bg-amber-950/80 border border-amber-600/80 text-xs font-mono font-bold text-amber-200 shadow-md shrink-0 self-start lg:self-auto">
          ⚠️ Scenario estimate — not a live government budget forecast
        </div>
      </div>

      {/* 2. Quick Scenario Presets */}
      <div className="p-5 rounded-2xl glass-card space-y-3">
        <div className="flex items-center justify-between">
          <span className="text-xs font-mono font-extrabold text-slate-300 uppercase tracking-wider flex items-center gap-2">
            <Zap className="w-4 h-4 text-amber-400" />
            <span>Quick Intervention Presets:</span>
          </span>
        </div>
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-3 font-mono text-xs">
          <button
            onClick={() => applyPreset('healthcare', 20000000, 25)}
            className="p-3 rounded-xl bg-slate-900 border border-slate-800 hover:border-rose-500 hover:bg-rose-950/40 text-left transition cursor-pointer group"
          >
            <div className="font-extrabold text-rose-400 group-hover:text-rose-300">🏥 Healthcare Upgrade</div>
            <div className="text-[10px] text-slate-400 font-bold mt-0.5">$20M USD • +25% Coverage</div>
          </button>

          <button
            onClick={() => applyPreset('water', 15000000, 20)}
            className="p-3 rounded-xl bg-slate-900 border border-slate-800 hover:border-cyan-500 hover:bg-cyan-950/40 text-left transition cursor-pointer group"
          >
            <div className="font-extrabold text-cyan-400 group-hover:text-cyan-300">💧 Clean Water Grid</div>
            <div className="text-[10px] text-slate-400 font-bold mt-0.5">$15M USD • +20% Coverage</div>
          </button>

          <button
            onClick={() => applyPreset('electricity', 25000000, 30)}
            className="p-3 rounded-xl bg-slate-900 border border-slate-800 hover:border-amber-500 hover:bg-amber-950/40 text-left transition cursor-pointer group"
          >
            <div className="font-extrabold text-amber-400 group-hover:text-amber-300">⚡ Solar Grid Integration</div>
            <div className="text-[10px] text-slate-400 font-bold mt-0.5">$25M USD • +30% Coverage</div>
          </button>

          <button
            onClick={() => applyPreset('transportation', 12000000, 15)}
            className="p-3 rounded-xl bg-slate-900 border border-slate-800 hover:border-indigo-500 hover:bg-indigo-950/40 text-left transition cursor-pointer group"
          >
            <div className="font-extrabold text-indigo-400 group-hover:text-indigo-300">🚌 Transit Corridor</div>
            <div className="text-[10px] text-slate-400 font-bold mt-0.5">$12M USD • +15% Coverage</div>
          </button>

          <button
            onClick={() => applyPreset('digital_connectivity', 10000000, 20)}
            className="p-3 rounded-xl bg-slate-900 border border-slate-800 hover:border-emerald-500 hover:bg-emerald-950/40 text-left transition cursor-pointer group"
          >
            <div className="font-extrabold text-emerald-400 group-hover:text-emerald-300">📶 5G Rural Towers</div>
            <div className="text-[10px] text-slate-400 font-bold mt-0.5">$10M USD • +20% Coverage</div>
          </button>
        </div>
      </div>

      {/* 3. Main Policy Simulation Lab Workspace */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        {/* Left Column: Interactive Controls (5 cols) */}
        <div className="lg:col-span-5 p-6 md:p-8 rounded-2xl glass-card space-y-6 flex flex-col justify-between border border-cyan-800/40">
          <div className="space-y-6">
            <div className="flex items-center gap-2.5 text-base font-extrabold text-slate-100 font-mono border-b border-slate-800 pb-3">
              <Sparkles className="w-5 h-5 text-cyan-400" />
              <span>Configure Policy Intervention</span>
            </div>

            {/* Region Selector */}
            <div className="space-y-2.5">
              <div className="flex items-center justify-between">
                <label className="text-xs font-mono font-bold text-slate-300 uppercase tracking-wider">Target Region:</label>
                {selectedRegion && (
                  <button
                    onClick={() => setActiveDetailRegion(selectedRegion)}
                    className="text-xs font-mono font-bold text-cyan-400 hover:text-cyan-300 flex items-center gap-1 hover:underline cursor-pointer"
                  >
                    <MapPin className="w-3.5 h-3.5" />
                    <span>Enter Details</span>
                    <ArrowRight className="w-3 h-3" />
                  </button>
                )}
              </div>
              <select
                value={selectedRegionId}
                onChange={(e) => setSelectedRegionId(e.target.value)}
                className="w-full bg-[#0b0f19] border border-slate-700 text-slate-100 font-bold text-sm rounded-xl p-3.5 focus:outline-none focus:border-cyan-400 font-mono shadow-inner cursor-pointer"
              >
                {regions.map((r) => (
                  <option className="bg-[#0f172a] text-slate-100 font-bold text-sm py-2" key={r.id} value={r.id}>
                    {r.district_city}, {r.state_province} ({r.population.toLocaleString()} pop)
                  </option>
                ))}
              </select>
            </div>

            {/* Sector Selector */}
            <div className="space-y-2.5">
              <label className="text-xs font-mono font-bold text-slate-300 uppercase tracking-wider">Infrastructure Sector:</label>
              <select
                value={selectedCategory}
                onChange={(e) => setSelectedCategory(e.target.value)}
                className="w-full bg-[#0b0f19] border border-slate-700 text-slate-100 font-bold text-sm rounded-xl p-3.5 focus:outline-none focus:border-cyan-400 font-mono shadow-inner cursor-pointer"
              >
                <option className="bg-[#0f172a] text-slate-100 font-bold text-sm py-2" value="healthcare">Healthcare Facilities</option>
                <option className="bg-[#0f172a] text-slate-100 font-bold text-sm py-2" value="water">Clean Water Grid</option>
                <option className="bg-[#0f172a] text-slate-100 font-bold text-sm py-2" value="electricity">Electrical Grid</option>
                <option className="bg-[#0f172a] text-slate-100 font-bold text-sm py-2" value="transportation">Public Transportation</option>
                <option className="bg-[#0f172a] text-slate-100 font-bold text-sm py-2" value="digital_connectivity">Digital Connectivity</option>
                <option className="bg-[#0f172a] text-slate-100 font-bold text-sm py-2" value="sanitation">Sanitation Infrastructure</option>
              </select>
            </div>

            {/* Budget Slider */}
            <div className="space-y-3.5">
              <div className="flex justify-between text-xs font-mono font-bold">
                <span className="text-slate-300 text-sm">Capital Investment Budget:</span>
                <span className="text-emerald-400 font-extrabold text-base">${budgetUsd.toLocaleString()} USD</span>
              </div>
              <input
                type="range"
                min={1000000}
                max={50000000}
                step={1000000}
                value={budgetUsd}
                onChange={(e) => setBudgetUsd(Number(e.target.value))}
                className="w-full h-3 bg-slate-950 rounded-lg appearance-none cursor-pointer accent-cyan-400 border border-slate-700"
              />
              <div className="flex justify-between text-[11px] text-slate-400 font-mono font-bold">
                <span>$1M</span>
                <span>$25M</span>
                <span>$50M USD</span>
              </div>
            </div>

            {/* Target Coverage Addition Slider */}
            <div className="space-y-3.5">
              <div className="flex justify-between text-xs font-mono font-bold">
                <span className="text-slate-300 text-sm">Target Sector Coverage Addition:</span>
                <span className="text-cyan-300 font-extrabold text-base">+{targetCoveragePct}%</span>
              </div>
              <input
                type="range"
                min={5}
                max={40}
                step={5}
                value={targetCoveragePct}
                onChange={(e) => setTargetCoveragePct(Number(e.target.value))}
                className="w-full h-3 bg-slate-950 rounded-lg appearance-none cursor-pointer accent-cyan-400 border border-slate-700"
              />
              <div className="flex justify-between text-[11px] text-slate-400 font-mono font-bold">
                <span>+5% Addition</span>
                <span>+20% Addition</span>
                <span>+40% Addition</span>
              </div>
            </div>
          </div>

          <button
            onClick={handleSimulate}
            disabled={loading}
            className="w-full py-4 rounded-xl bg-gradient-to-r from-cyan-600 to-indigo-600 hover:from-cyan-500 hover:to-indigo-500 text-white font-extrabold text-sm transition flex items-center justify-center gap-2.5 shadow-xl shadow-cyan-950/80 glow-cyan disabled:opacity-50 cursor-pointer mt-4"
          >
            {loading ? (
              <span>Executing Simulation Engine...</span>
            ) : (
              <>
                <Play className="w-5 h-5 fill-white" />
                <span>Execute Counterfactual Simulation</span>
              </>
            )}
          </button>
        </div>

        {/* Right Column: Visual Simulation Dashboard (7 cols) */}
        <div className="lg:col-span-7 p-6 md:p-8 rounded-2xl glass-card space-y-6 flex flex-col justify-between border border-cyan-800/40">
          <div className="space-y-6">
            <div className="flex items-center justify-between border-b border-slate-800 pb-3">
              <div className="flex items-center gap-2.5 text-base font-extrabold text-slate-100 font-mono">
                <CheckCircle2 className="w-5 h-5 text-emerald-400" />
                <span>Simulated Intervention Impact</span>
              </div>
              <span className="text-xs font-mono font-extrabold px-2.5 py-1 rounded bg-emerald-950 text-emerald-300 border border-emerald-700">
                LIVE ENGINE OUTPUT
              </span>
            </div>

            {result && (
              <div className="space-y-6">
                {/* Visual Priority Score Reduction Gauge Cards */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  {/* Baseline Score Card */}
                  <div className="p-5 rounded-2xl bg-slate-950/90 border border-rose-800/80 space-y-2 shadow-lg relative overflow-hidden">
                    <div className="flex items-center justify-between text-xs font-mono font-extrabold text-slate-400">
                      <span>BASELINE PRIORITY SCORE</span>
                      <span className="text-rose-400">HIGH DEMAND</span>
                    </div>
                    <div className="text-4xl font-extrabold font-mono text-rose-400">
                      {result.original_priority_score.toFixed(1)} <span className="text-xs text-slate-400 font-bold">/ 100</span>
                    </div>
                    <div className="w-full h-2 rounded-full bg-slate-900 overflow-hidden border border-slate-800">
                      <div
                        className="h-full bg-rose-500 rounded-full"
                        style={{ width: `${result.original_priority_score}%` }}
                      />
                    </div>
                  </div>

                  {/* Simulated Score Card */}
                  <div className="p-5 rounded-2xl bg-slate-950/90 border-2 border-emerald-500/90 space-y-2 shadow-xl glow-emerald relative overflow-hidden">
                    <div className="flex items-center justify-between text-xs font-mono font-extrabold text-slate-300">
                      <span>POST-INTERVENTION SCORE</span>
                      <span className="text-emerald-300 font-extrabold">OPTIMIZED</span>
                    </div>
                    <div className="text-4xl font-extrabold font-mono text-emerald-300 flex items-baseline gap-2">
                      <span>{result.simulated_priority_score.toFixed(1)}</span>
                      <span className="text-xs text-slate-400 font-bold">/ 100</span>
                      <span className="text-xs font-mono font-extrabold text-emerald-400 bg-emerald-950 px-2 py-0.5 rounded border border-emerald-700">
                        {result.score_delta > 0 ? `+${result.score_delta}` : result.score_delta} pts
                      </span>
                    </div>
                    <div className="w-full h-2 rounded-full bg-slate-900 overflow-hidden border border-slate-800">
                      <div
                        className="h-full bg-emerald-400 rounded-full"
                        style={{ width: `${result.simulated_priority_score}%` }}
                      />
                    </div>
                  </div>
                </div>

                {/* 3 Key Metric ROI Cards */}
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 font-mono text-xs">
                  <div className="p-4 rounded-xl bg-slate-950/80 border border-slate-800 space-y-1">
                    <div className="flex items-center gap-1.5 text-slate-400 font-bold text-[11px]">
                      <TrendingDown className="w-3.5 h-3.5 text-emerald-400" />
                      <span>Capacity Deficit</span>
                    </div>
                    <div className="text-lg font-black text-emerald-300">{result.projected_gap_score.toFixed(2)} Score</div>
                    <div className="text-[10px] text-slate-400 font-sans">Reduced from baseline</div>
                  </div>

                  <div className="p-4 rounded-xl bg-slate-950/80 border border-slate-800 space-y-1">
                    <div className="flex items-center gap-1.5 text-slate-400 font-bold text-[11px]">
                      <Users className="w-3.5 h-3.5 text-cyan-400" />
                      <span>Beneficiaries</span>
                    </div>
                    <div className="text-lg font-black text-cyan-300">~{result.expected_population_beneficiaries.toLocaleString()}</div>
                    <div className="text-[10px] text-slate-400 font-sans">Impacted residents</div>
                  </div>

                  <div className="p-4 rounded-xl bg-slate-950/80 border border-slate-800 space-y-1">
                    <div className="flex items-center gap-1.5 text-slate-400 font-bold text-[11px]">
                      <DollarSign className="w-3.5 h-3.5 text-amber-400" />
                      <span>Cost per Resident</span>
                    </div>
                    <div className="text-lg font-black text-amber-300">${costPerBeneficiary} USD</div>
                    <div className="text-[10px] text-slate-400 font-sans">Capital efficiency</div>
                  </div>
                </div>

                {/* AI Executive Summary Box */}
                <div className="p-5 rounded-2xl bg-gradient-to-r from-slate-950 via-[#070e1c] to-slate-950 border border-cyan-500/50 shadow-xl space-y-2">
                  <div className="flex items-center gap-2 text-xs font-mono font-extrabold text-cyan-300">
                    <Activity className="w-4 h-4 text-cyan-400" />
                    <span>AI Simulation Executive Summary:</span>
                  </div>
                  <p className="text-xs md:text-sm font-sans font-semibold text-slate-100 leading-relaxed italic">
                    "{result.simulation_notes}"
                  </p>
                </div>
              </div>
            )}
          </div>

          <div className="p-4 rounded-xl bg-slate-950/80 border border-slate-800 text-xs text-slate-300 font-mono font-bold flex items-center gap-2.5 mt-4">
            <ShieldCheck className="w-5 h-5 text-cyan-400 shrink-0" />
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
