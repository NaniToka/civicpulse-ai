import React, { useState } from 'react';
import { Filter } from 'lucide-react';
import { Card } from '../components/common/Card';
import { Badge } from '../components/common/Badge';
import { Region, InfrastructureIndicator, CitizenRequest } from '../types';

interface HotspotExplorerProps {
  regions: Region[];
  indicators: InfrastructureIndicator[];
  requests: CitizenRequest[];
}

export const HotspotExplorer: React.FC<HotspotExplorerProps> = ({
  regions,
  indicators,
}) => {
  const [selectedRegionId, setSelectedRegionId] = useState<string>(regions[0]?.id || '');

  const selectedRegion = regions.find((r) => r.id === selectedRegionId) || regions[0];
  const regionIndicators = indicators.filter((i) => i.region_id === selectedRegionId);

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-xl font-bold text-civic-100 tracking-tight">Demand Hotspot & Gap Explorer</h2>
          <p className="text-xs text-civic-400 mt-1">
            Geographic aggregation of citizen demand signals alongside baseline infrastructure deficit gap scores.
          </p>
        </div>

        <div className="flex items-center gap-2">
          <Filter className="w-4 h-4 text-civic-400" />
          <select
            value={selectedRegionId}
            onChange={(e) => setSelectedRegionId(e.target.value)}
            className="bg-civic-900 border border-civic-800 rounded-md text-xs px-3 py-2 text-civic-100 focus:outline-none focus:border-accent-blue"
          >
            {regions.map((r) => (
              <option key={r.id} value={r.id}>
                {r.district_city}, {r.country} ({r.country_code})
              </option>
            ))}
          </select>
        </div>
      </div>

      {selectedRegion && (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Region Overview Card */}
          <Card title="Territory Profile" subtitle="Demographic & Vulnerability Baseline">
            <div className="space-y-4 text-xs">
              <div className="flex items-center justify-between py-2 border-b border-civic-800">
                <span className="text-civic-400">Country / State:</span>
                <span className="font-semibold text-civic-100">{selectedRegion.country} ({selectedRegion.state_province})</span>
              </div>
              <div className="flex items-center justify-between py-2 border-b border-civic-800">
                <span className="text-civic-400">Census Population:</span>
                <span className="font-semibold text-civic-100">{selectedRegion.population.toLocaleString()} residents</span>
              </div>
              <div className="flex items-center justify-between py-2 border-b border-civic-800">
                <span className="text-civic-400">Vulnerability Index:</span>
                <Badge variant={selectedRegion.vulnerability_index > 0.7 ? 'danger' : 'warning'}>
                  {selectedRegion.vulnerability_index.toFixed(2)} / 1.00
                </Badge>
              </div>
              <div className="flex items-center justify-between py-2 border-b border-civic-800">
                <span className="text-civic-400">Coordinates:</span>
                <span className="font-mono text-civic-300">{selectedRegion.latitude.toFixed(4)}, {selectedRegion.longitude.toFixed(4)}</span>
              </div>
              <div className="flex items-center justify-between py-2">
                <span className="text-civic-400">Primary Language:</span>
                <span className="font-semibold text-accent-blue uppercase">{selectedRegion.primary_language}</span>
              </div>
            </div>
          </Card>

          {/* Infrastructure Sector Deficit Breakdown */}
          <Card className="lg:col-span-2" title="Infrastructure Sector Capacity Deficits" subtitle="Current Capacity vs Measured Demand Gap">
            <div className="space-y-4">
              {regionIndicators.length === 0 ? (
                <p className="text-xs text-civic-400">No specific indicators recorded for this territory.</p>
              ) : (
                regionIndicators.map((ind) => (
                  <div key={ind.id} className="p-4 bg-civic-950/60 rounded border border-civic-800 space-y-2">
                    <div className="flex items-center justify-between text-xs">
                      <span className="font-semibold text-civic-100">{ind.category}</span>
                      <span className="text-civic-400 font-mono">Deficit Gap Score: <b>{ind.gap_score.toFixed(2)}</b></span>
                    </div>

                    {/* Capacity Progress Bar */}
                    <div className="space-y-1">
                      <div className="flex justify-between text-[11px] text-civic-400">
                        <span>Operational Capacity: {ind.current_capacity_pct}%</span>
                        <span>Coverage Ratio: {ind.coverage_ratio_pct}%</span>
                      </div>
                      <div className="w-full h-2 bg-civic-800 rounded-full overflow-hidden">
                        <div
                          className="h-full bg-gradient-to-r from-accent-rose to-accent-amber"
                          style={{ width: `${ind.current_capacity_pct}%` }}
                        />
                      </div>
                    </div>
                  </div>
                ))
              )}
            </div>
          </Card>
        </div>
      )}
    </div>
  );
};
