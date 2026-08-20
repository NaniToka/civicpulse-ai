import React, { useState } from 'react';
import { Card } from '../components/common/Card';
import { Badge } from '../components/common/Badge';
import { Region, ScenarioWhatIfResult } from '../types';
import { api } from '../services/api';

interface WhatIfScenarioProps {
  regions: Region[];
}

export const WhatIfScenario: React.FC<WhatIfScenarioProps> = ({ regions }) => {
  const [selectedRegionId, setSelectedRegionId] = useState<string>(regions[0]?.id || '');
  const [category, setCategory] = useState<string>('Clean Water & Sanitation');
  const [budgetAllocation, setBudgetAllocation] = useState<number>(10000000);
  const [simResult, setSimResult] = useState<ScenarioWhatIfResult | null>(null);
  const [loading, setLoading] = useState<boolean>(false);

  const handleSimulate = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    try {
      const res = await api.runScenarioWhatIf({
        region_id: selectedRegionId,
        category: category,
        budget_allocation_usd: budgetAllocation,
      });
      setSimResult(res);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-xl font-bold text-civic-100 tracking-tight">What-If Policy & Capital Simulation</h2>
        <p className="text-xs text-civic-400 mt-1">
          Simulate how strategic budget allocations impact infrastructure gap scores and citizen priority rankings.
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Input Parameters Form */}
        <Card title="Simulation Controls" subtitle="Set budget & target sector">
          <form onSubmit={handleSimulate} className="space-y-4 text-xs">
            <div>
              <label className="block text-civic-400 mb-1 font-medium">Target Territory</label>
              <select
                value={selectedRegionId}
                onChange={(e) => setSelectedRegionId(e.target.value)}
                className="w-full bg-civic-950 border border-civic-800 rounded px-3 py-2 text-civic-100 focus:outline-none focus:border-accent-blue"
              >
                {regions.map((r) => (
                  <option key={r.id} value={r.id}>
                    {r.district_city}, {r.country}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-civic-400 mb-1 font-medium">Infrastructure Sector</label>
              <select
                value={category}
                onChange={(e) => setCategory(e.target.value)}
                className="w-full bg-civic-950 border border-civic-800 rounded px-3 py-2 text-civic-100 focus:outline-none focus:border-accent-blue"
              >
                <option value="Clean Water & Sanitation">Clean Water & Sanitation</option>
                <option value="Clean Energy & Grid Resilience">Clean Energy & Grid Resilience</option>
                <option value="Healthcare & Sanitation">Healthcare & Sanitation</option>
                <option value="Public Transit & Roads">Public Transit & Roads</option>
              </select>
            </div>

            <div>
              <label className="block text-civic-400 mb-1 font-medium">
                Proposed Capital Allocation (USD): <b>${budgetAllocation.toLocaleString()}</b>
              </label>
              <input
                type="range"
                min={1000000}
                max={50000000}
                step={1000000}
                value={budgetAllocation}
                onChange={(e) => setBudgetAllocation(Number(e.target.value))}
                className="w-full accent-accent-blue"
              />
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full py-2.5 bg-accent-blue text-civic-950 font-bold rounded hover:bg-sky-400 disabled:opacity-50 transition-colors"
            >
              {loading ? 'Running Math Simulation...' : 'Execute What-If Simulation'}
            </button>
          </form>
        </Card>

        {/* Results Card */}
        <Card className="lg:col-span-2" title="Simulation Projection Results" subtitle="Delta analysis & impact summary">
          {!simResult ? (
            <div className="h-48 flex items-center justify-center text-xs text-civic-400 border border-dashed border-civic-800 rounded">
              Adjust parameters and click 'Execute What-If Simulation' to view projections.
            </div>
          ) : (
            <div className="space-y-4">
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                <div className="p-4 bg-civic-950/60 rounded border border-civic-800 text-center">
                  <span className="text-xs text-civic-400 uppercase font-semibold">Baseline Priority</span>
                  <div className="text-xl font-bold text-civic-100 mt-1">{simResult.original_priority_score.toFixed(1)}</div>
                </div>

                <div className="p-4 bg-civic-950/60 rounded border border-civic-800 text-center">
                  <span className="text-xs text-civic-400 uppercase font-semibold">Projected Priority</span>
                  <div className="text-xl font-bold text-emerald-400 mt-1">{simResult.simulated_priority_score.toFixed(1)}</div>
                </div>

                <div className="p-4 bg-civic-950/60 rounded border border-civic-800 text-center">
                  <span className="text-xs text-civic-400 uppercase font-semibold">Score Delta</span>
                  <div className="text-xl font-bold text-accent-blue mt-1">
                    {simResult.score_delta > 0 ? `+${simResult.score_delta}` : simResult.score_delta} pts
                  </div>
                </div>
              </div>

              <div className="p-4 bg-civic-950/80 rounded border border-civic-800 space-y-2 text-xs">
                <div className="flex items-center justify-between">
                  <span className="text-civic-400 font-medium">Projected Infrastructure Gap Score:</span>
                  <Badge variant="success">{simResult.projected_gap_score.toFixed(2)}</Badge>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-civic-400 font-medium">Estimated Beneficiary Residents:</span>
                  <span className="font-bold text-civic-100">{simResult.expected_population_beneficiaries.toLocaleString()} residents</span>
                </div>
                <p className="text-civic-300 pt-2 border-t border-civic-800/80 italic">
                  "{simResult.simulation_notes}"
                </p>
              </div>
            </div>
          )}
        </Card>
      </div>
    </div>
  );
};
