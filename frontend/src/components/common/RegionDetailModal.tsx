import React from 'react';
import { X, MapPin, Users, ShieldAlert, Activity, ArrowRight, Zap, Building2, Globe2, BarChart2 } from 'lucide-react';
import { Region } from '../../types';

interface RegionDetailModalProps {
  region: Region | null;
  onClose: () => void;
  onNavigateToScenarios?: (regionId: string) => void;
  onNavigateToRecommendations?: (regionId: string) => void;
}

export const RegionDetailModal: React.FC<RegionDetailModalProps> = ({
  region,
  onClose,
  onNavigateToScenarios,
  onNavigateToRecommendations,
}) => {
  if (!region) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6 bg-[#000000]/80 backdrop-blur-sm animate-in fade-in duration-150">
      <div className="w-full max-w-3xl max-h-[90vh] bg-[#0A0A0C] border border-white/[0.08] rounded-xl shadow-2xl overflow-hidden flex flex-col">
        {/* Modal Header */}
        <div className="p-6 border-b border-white/[0.08] bg-[#121215] flex items-start justify-between">
          <div className="space-y-1">
            <div className="flex items-center gap-2.5">
              <span className="text-xs font-mono font-medium px-2 py-0.5 rounded bg-[#0A0A0C] text-slate-300 border border-white/[0.08] uppercase">
                {region.country_code} • DISTRICT PROFILE
              </span>
              <span className="text-xs font-mono text-green-400 font-medium flex items-center gap-1">
                <Globe2 className="w-3.5 h-3.5" />
                Primary Language: {region.primary_language.toUpperCase()}
              </span>
            </div>
            <h2 className="text-lg md:text-xl font-semibold text-slate-100 flex items-center gap-2">
              <MapPin className="w-5 h-5 text-indigo-400" />
              <span>{region.district_city}, {region.country}</span>
            </h2>
            <p className="text-xs text-slate-400">
              State/Province: {region.state_province} • Geolocation Coordinates: {region.latitude.toFixed(4)}, {region.longitude.toFixed(4)}
            </p>
          </div>

          <button
            onClick={onClose}
            className="p-1.5 rounded-lg text-slate-400 hover:text-white hover:bg-[#0A0A0C] transition cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Modal Body */}
        <div className="p-6 overflow-y-auto space-y-6">
          {/* Key Census Statistics Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <div className="p-4 rounded-xl bg-[#121215] border border-white/[0.08]">
              <div className="flex items-center justify-between text-slate-400 text-xs font-mono">
                <span>Total Population</span>
                <Users className="w-4 h-4 text-indigo-400" />
              </div>
              <div className="text-xl font-semibold text-slate-100 font-mono mt-2">
                {region.population.toLocaleString()}
              </div>
              <div className="text-[11px] text-slate-400 font-mono mt-1">
                Density: {(region.population_density || 4500).toLocaleString()} / km²
              </div>
            </div>

            <div className="p-4 rounded-xl bg-[#121215] border border-white/[0.08]">
              <div className="flex items-center justify-between text-slate-400 text-xs font-mono">
                <span>Vulnerability Index</span>
                <ShieldAlert className="w-4 h-4 text-amber-400" />
              </div>
              <div className="text-xl font-semibold text-amber-400 font-mono mt-2">
                {region.vulnerability_index.toFixed(2)} / 1.00
              </div>
              <div className="text-[11px] text-amber-400 font-mono mt-1 font-medium">
                {region.vulnerability_index >= 0.75 ? 'CRITICAL VULNERABILITY' : 'ELEVATED VULNERABILITY'}
              </div>
            </div>

            <div className="p-4 rounded-xl bg-[#121215] border border-white/[0.08]">
              <div className="flex items-center justify-between text-slate-400 text-xs font-mono">
                <span>Digital Access Rate</span>
                <Activity className="w-4 h-4 text-green-400" />
              </div>
              <div className="text-xl font-semibold text-green-400 font-mono mt-2">
                {(region.digital_access_rate || 55).toFixed(0)}%
              </div>
              <div className="text-[11px] text-slate-400 font-mono mt-1">
                Urbanization: {(region.urbanization_rate || 68).toFixed(0)}%
              </div>
            </div>
          </div>

          {/* Demographic Composition Meters */}
          <div className="p-5 rounded-xl bg-[#121215] border border-white/[0.08] space-y-4">
            <h3 className="text-xs font-semibold text-slate-400 uppercase tracking-wider font-mono flex items-center gap-2">
              <BarChart2 className="w-4 h-4 text-indigo-400" />
              <span>Demographic Need Breakdown</span>
            </h3>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs font-mono">
              <div className="space-y-1.5">
                <div className="flex justify-between text-slate-300 font-medium">
                  <span>Youth Population Share</span>
                  <span className="text-indigo-400">{(region.youth_percentage || 35).toFixed(1)}%</span>
                </div>
                <div className="h-2 rounded-full bg-[#0A0A0C] overflow-hidden border border-white/[0.08]">
                  <div
                    className="h-full bg-indigo-500 rounded-full"
                    style={{ width: `${region.youth_percentage || 35}%` }}
                  />
                </div>
              </div>

              <div className="space-y-1.5">
                <div className="flex justify-between text-slate-300 font-medium">
                  <span>Elderly Population Share</span>
                  <span className="text-indigo-400">{(region.elderly_percentage || 18).toFixed(1)}%</span>
                </div>
                <div className="h-2 rounded-full bg-[#0A0A0C] overflow-hidden border border-white/[0.08]">
                  <div
                    className="h-full bg-indigo-400 rounded-full"
                    style={{ width: `${region.elderly_percentage || 18}%` }}
                  />
                </div>
              </div>
            </div>
          </div>

          {/* District Infrastructure Summary Card */}
          <div className="p-5 rounded-xl bg-[#121215] border border-white/[0.08] space-y-2">
            <div className="flex items-center gap-2 text-xs font-mono text-indigo-400 uppercase font-semibold">
              <Building2 className="w-4 h-4 text-indigo-400" />
              <span>District Decision Summary</span>
            </div>
            <p className="text-xs text-slate-300 leading-relaxed font-normal">
              {region.district_city} exhibits an elevated census vulnerability index of <strong>{region.vulnerability_index.toFixed(2)}</strong> across <strong>{region.population.toLocaleString()}</strong> residents. Capital investment is recommended to address critical sector capacity deficits.
            </p>
          </div>
        </div>

        {/* Modal Footer Actions */}
        <div className="p-4 border-t border-white/[0.08] bg-[#121215] flex flex-col sm:flex-row items-center justify-between gap-3 text-xs font-mono">
          <div className="flex items-center gap-2 text-slate-400">
            <span>Region ID: {region.id}</span>
          </div>

          <div className="flex flex-wrap items-center gap-2">
            {onNavigateToScenarios && (
              <button
                onClick={() => {
                  onClose();
                  onNavigateToScenarios(region.id);
                }}
                className="px-3.5 py-1.5 rounded-lg bg-[#0A0A0C] hover:bg-[#101014] border border-white/[0.08] text-slate-200 transition flex items-center gap-1.5 cursor-pointer font-sans"
              >
                <Zap className="w-3.5 h-3.5 text-indigo-400" />
                <span>Simulate Scenario</span>
              </button>
            )}

            {onNavigateToRecommendations && (
              <button
                onClick={() => {
                  onClose();
                  onNavigateToRecommendations(region.id);
                }}
                className="px-3.5 py-1.5 rounded-lg bg-indigo-600 hover:bg-indigo-500 text-white transition flex items-center gap-1.5 cursor-pointer font-sans font-medium shadow-sm"
              >
                <span>View Recommendations</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </button>
            )}

            <button
              onClick={onClose}
              className="px-3.5 py-1.5 rounded-lg bg-[#0A0A0C] hover:bg-[#101014] border border-white/[0.08] text-slate-300 transition cursor-pointer font-sans"
            >
              Close
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
