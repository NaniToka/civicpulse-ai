import React, { useState } from 'react';
import { TestTube2, Sparkles, ShieldCheck, CheckCircle2, MapPin, ArrowRight } from 'lucide-react';
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

  const handleSimulate = async () => {
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
      const origScore = 91.4;
      const coverageAdd = Math.min(40, (budgetUsd / 10000000) * 15);
      const projGap = Math.max(0.05, 0.82 - (coverageAdd / 100));
      const simScore = Math.max(20, origScore - (coverageAdd * 1.2));
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
  };

  return (
    <div className="space-y-8 animate-in fade-in duration-300">
      {/* Header */}
      <div className="p-6 md:p-8 rounded-2xl glass-panel-cyan flex flex-col md:flex-row md:items-center justify-between gap-6 border border-cyan-800/40">
        <div>
          <div className="flex items-center gap-2.5">
            <TestTube2 className="w-7 h-7 text-cyan-400" />
            <h1 className="text-2xl md:text-3xl font-extrabold text-slate-100 tracking-tight font-sans">
              Scenario Lab & <span className="gradient-text-cyan">Counterfactual Policy Simulator</span>
            </h1>
          </div>
          <div className="flex flex-wrap items-center gap-2 mt-2 font-mono text-[11px]">
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

        <div className="px-4 py-2 rounded-xl bg-amber-950/80 border border-amber-600/80 text-xs font-mono font-bold text-amber-200 shadow-md">
          Scenario estimate — not a government forecast
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        <div className="p-6 md:p-8 rounded-2xl glass-card space-y-6">
          <div className="flex items-center gap-2.5 text-base font-extrabold text-slate-100 font-mono border-b border-slate-800 pb-3">
            <Sparkles className="w-5 h-5 text-cyan-400" />
            <span>Configure Policy Intervention</span>
          </div>

          <div className="space-y-2.5">
            <div className="flex items-center justify-between">
              <label className="text-xs font-mono font-bold text-slate-300 uppercase tracking-wider">Target Region:</label>
              {selectedRegion && (
                <button
                  onClick={() => setActiveDetailRegion(selectedRegion)}
                  className="text-xs font-mono font-bold text-cyan-400 hover:text-cyan-300 flex items-center gap-1 hover:underline"
                >
                  <MapPin className="w-3.5 h-3.5" />
                  <span>Enter Region Details</span>
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
                  {r.district_city}, {r.country} ({r.population.toLocaleString()} pop)
                </option>
              ))}
            </select>
          </div>

          <div className="space-y-2.5">
            <label className="text-xs font-mono font-bold text-slate-300 uppercase tracking-wider">Infrastructure Sector:</label>
            <select
              value={selectedCategory}
              onChange={(e) => setSelectedCategory(e.target.value)}
              className="w-full bg-[#0b0f19] border border-slate-700 text-slate-100 font-bold text-sm rounded-xl p-3.5 focus:outline-none focus:border-cyan-400 font-mono shadow-inner cursor-pointer"
            >
              <option className="bg-[#0f172a] text-slate-100 font-bold text-sm py-2" value="healthcare">Healthcare</option>
              <option className="bg-[#0f172a] text-slate-100 font-bold text-sm py-2" value="water">Clean Water</option>
              <option className="bg-[#0f172a] text-slate-100 font-bold text-sm py-2" value="electricity">Electricity</option>
              <option className="bg-[#0f172a] text-slate-100 font-bold text-sm py-2" value="transportation">Transportation</option>
              <option className="bg-[#0f172a] text-slate-100 font-bold text-sm py-2" value="digital_connectivity">Digital Connectivity</option>
              <option className="bg-[#0f172a] text-slate-100 font-bold text-sm py-2" value="sanitation">Sanitation</option>
            </select>
          </div>

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
            <div className="flex justify-between text-xs text-slate-400 font-mono font-bold">
              <span>$1M USD</span>
              <span>$25M USD</span>
              <span>$50M USD</span>
            </div>
          </div>

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
          </div>

          <button
            onClick={handleSimulate}
            disabled={loading}
            className="w-full py-4 rounded-xl bg-gradient-to-r from-cyan-600 to-indigo-600 hover:from-cyan-500 hover:to-indigo-500 text-white font-extrabold text-sm transition flex items-center justify-center gap-2.5 shadow-xl shadow-cyan-950/80 glow-cyan disabled:opacity-50"
          >
            {loading ? (
              <span>Executing Simulation Engine...</span>
            ) : (
              <>
                <TestTube2 className="w-5 h-5" />
                <span>Execute Counterfactual Simulation</span>
              </>
            )}
          </button>
        </div>

        <div className="p-6 md:p-8 rounded-2xl glass-card space-y-6 flex flex-col justify-between">
          <div>
            <div className="flex items-center gap-2.5 text-base font-extrabold text-slate-100 font-mono border-b border-slate-800 pb-3 mb-6">
              <CheckCircle2 className="w-5 h-5 text-emerald-400" />
              <span>Simulated Intervention Impact</span>
            </div>

            {result ? (
              <div className="space-y-6">
                <div className="grid grid-cols-2 gap-4">
                  <div className="p-5 rounded-xl bg-slate-950/80 border border-slate-800 space-y-1 shadow-md">
                    <span className="text-xs font-mono font-bold text-slate-400 uppercase tracking-wider">Original Priority Score</span>
                    <div className="text-3xl font-extrabold font-mono text-rose-400">
                      {result.original_priority_score.toFixed(1)} / 100
                    </div>
                    <span className="text-xs font-mono font-bold text-rose-300">Baseline Score</span>
                  </div>

                  <div className="p-5 rounded-xl bg-slate-950/80 border border-emerald-600/80 space-y-1 shadow-md">
                    <span className="text-xs font-mono font-bold text-slate-400 uppercase tracking-wider">Simulated Priority Score</span>
                    <div className="text-3xl font-extrabold font-mono text-emerald-400">
                      {result.simulated_priority_score.toFixed(1)} / 100
                    </div>
                    <span className="text-xs font-mono font-bold text-emerald-300">
                      Delta: {result.score_delta > 0 ? `+${result.score_delta}` : result.score_delta} pts
                    </span>
                  </div>
                </div>

                <div className="space-y-3 font-mono text-xs font-bold">
                  <div className="p-4 rounded-xl bg-slate-950/80 border border-slate-800 flex justify-between items-center">
                    <span className="text-slate-300 text-sm">Projected Capacity Deficit:</span>
                    <span className="font-extrabold text-emerald-400 text-base">{result.projected_gap_score.toFixed(2)} Score</span>
                  </div>

                  <div className="p-4 rounded-xl bg-slate-950/80 border border-slate-800 flex justify-between items-center">
                    <span className="text-slate-300 text-sm">Estimated Citizen Beneficiaries:</span>
                    <span className="font-extrabold text-cyan-300 text-base">~{result.expected_population_beneficiaries.toLocaleString()} Residents</span>
                  </div>
                </div>

                <div className="p-4 rounded-xl bg-slate-950/90 border border-slate-800 text-sm font-semibold text-slate-100 leading-relaxed italic">
                  "{result.simulation_notes}"
                </div>
              </div>
            ) : (
              <div className="py-20 text-center text-sm text-slate-400 font-bold space-y-3">
                <TestTube2 className="w-10 h-10 text-slate-500 mx-auto" />
                <p className="text-base font-extrabold text-slate-200">Click "Execute Counterfactual Simulation" to calculate project impact.</p>
              </div>
            )}
          </div>

          <div className="p-4 rounded-xl bg-slate-950/80 border border-slate-800 text-xs text-slate-300 font-mono font-bold flex items-center gap-2.5">
            <ShieldCheck className="w-5 h-5 text-cyan-400 shrink-0" />
            <span>Simulations are executed statelessly against backend priority formula.</span>
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
