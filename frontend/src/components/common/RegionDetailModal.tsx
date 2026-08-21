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
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6 bg-slate-950/85 backdrop-blur-md animate-in fade-in duration-200">
      <div className="w-full max-w-3xl max-h-[90vh] bg-[#0e1424] border border-cyan-800/60 rounded-2xl shadow-2xl overflow-hidden flex flex-col glow-cyan">
        {/* Modal Header */}
        <div className="p-6 border-b border-slate-800/80 bg-[#070b14]/90 flex items-start justify-between">
          <div className="space-y-1">
            <div className="flex items-center gap-2.5">
              <span className="text-xs font-mono font-bold px-2.5 py-0.5 rounded-md bg-cyan-950 text-cyan-300 border border-cyan-800 uppercase">
                {region.country_code} • DISTRICT PROFILE
              </span>
              <span className="text-xs font-mono text-emerald-400 font-bold flex items-center gap-1">
                <Globe2 className="w-3.5 h-3.5" />
                Primary Language: {region.primary_language.toUpperCase()}
              </span>
            </div>
            <h2 className="text-xl md:text-2xl font-extrabold text-slate-100 flex items-center gap-2 font-mono">
              <MapPin className="w-6 h-6 text-cyan-400" />
              <span>{region.district_city}, {region.country}</span>
            </h2>
            <p className="text-xs text-slate-400 font-medium">
              State/Province: {region.state_province} • Geolocation Coordinates: {region.latitude.toFixed(4)}, {region.longitude.toFixed(4)}
            </p>
          </div>

          <button
            onClick={onClose}
            className="p-2 rounded-xl text-slate-400 hover:text-white hover:bg-slate-800 transition"
          >
            <X className="w-6 h-6" />
          </button>
        </div>

        {/* Modal Body */}
        <div className="p-6 overflow-y-auto space-y-6">
          {/* Key Census Statistics Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <div className="p-4 rounded-xl bg-slate-950/80 border border-slate-800">
              <div className="flex items-center justify-between text-slate-400 text-xs font-mono font-bold">
                <span>Total Population</span>
                <Users className="w-4 h-4 text-cyan-400" />
              </div>
              <div className="text-xl font-extrabold text-slate-100 font-mono mt-2">
                {region.population.toLocaleString()}
              </div>
              <div className="text-[11px] text-slate-400 font-mono mt-1">
                Density: {(region.population_density || 4500).toLocaleString()} / km²
              </div>
            </div>

            <div className="p-4 rounded-xl bg-slate-950/80 border border-slate-800">
              <div className="flex items-center justify-between text-slate-400 text-xs font-mono font-bold">
                <span>Vulnerability Index</span>
                <ShieldAlert className="w-4 h-4 text-amber-400" />
              </div>
              <div className="text-xl font-extrabold text-amber-400 font-mono mt-2">
                {region.vulnerability_index.toFixed(2)} / 1.00
              </div>
              <div className="text-[11px] text-amber-300 font-mono mt-1 font-bold">
                {region.vulnerability_index >= 0.75 ? 'CRITICAL VULNERABILITY' : 'ELEVATED VULNERABILITY'}
              </div>
            </div>

            <div className="p-4 rounded-xl bg-slate-950/80 border border-slate-800">
              <div className="flex items-center justify-between text-slate-400 text-xs font-mono font-bold">
                <span>Digital Access Rate</span>
                <Activity className="w-4 h-4 text-emerald-400" />
              </div>
              <div className="text-xl font-extrabold text-emerald-400 font-mono mt-2">
                {(region.digital_access_rate || 55).toFixed(0)}%
              </div>
              <div className="text-[11px] text-slate-400 font-mono mt-1">
                Urbanization: {(region.urbanization_rate || 68).toFixed(0)}%
              </div>
            </div>
          </div>

          {/* Demographic Composition Meters */}
          <div className="p-5 rounded-xl bg-slate-950/80 border border-slate-800/80 space-y-4">
            <h3 className="text-xs font-bold text-slate-300 uppercase tracking-widest font-mono flex items-center gap-2">
              <BarChart2 className="w-4 h-4 text-cyan-400" />
              <span>Demographic Need Breakdown</span>
            </h3>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs font-mono">
              <div className="space-y-1.5">
                <div className="flex justify-between text-slate-300 font-bold">
                  <span>Youth Population Share</span>
                  <span className="text-cyan-300">{(region.youth_percentage || 35).toFixed(1)}%</span>
                </div>
                <div className="h-2 rounded-full bg-slate-900 overflow-hidden border border-slate-800">
                  <div
                    className="h-full bg-cyan-400 rounded-full"
                    style={{ width: `${region.youth_percentage || 35}%` }}
                  />
                </div>
              </div>

              <div className="space-y-1.5">
                <div className="flex justify-between text-slate-300 font-bold">
                  <span>Elderly Population Share</span>
                  <span className="text-indigo-300">{(region.elderly_percentage || 18).toFixed(1)}%</span>
                </div>
                <div className="h-2 rounded-full bg-slate-900 overflow-hidden border border-slate-800">
                  <div
                    className="h-full bg-indigo-400 rounded-full"
                    style={{ width: `${region.elderly_percentage || 18}%` }}
                  />
                </div>
              </div>
            </div>
          </div>

          {/* District Infrastructure Summary Card */}
          <div className="p-5 rounded-xl bg-gradient-to-r from-slate-950 via-[#12192e] to-slate-950 border border-cyan-900/60 space-y-3">
            <div className="flex items-center gap-2 text-xs font-mono font-bold text-cyan-300 uppercase">
              <Building2 className="w-4 h-4 text-cyan-400" />
              <span>District Decision Summary</span>
            </div>
            <p className="text-xs text-slate-200 leading-relaxed font-sans font-medium">
              {region.district_city} exhibits an elevated census vulnerability index of <strong>{region.vulnerability_index.toFixed(2)}</strong> across <strong>{region.population.toLocaleString()}</strong> residents. Capital investment is recommended to address critical sector capacity deficits.
            </p>
          </div>
        </div>

        {/* Modal Footer Actions */}
        <div className="p-5 border-t border-slate-800/80 bg-[#070b14] flex flex-col sm:flex-row items-center justify-between gap-3 text-xs font-bold font-mono">
          <div className="flex items-center gap-2 text-slate-400">
            <span>Region ID: {region.id}</span>
          </div>

          <div className="flex flex-wrap items-center gap-2.5">
            {onNavigateToScenarios && (
              <button
                onClick={() => {
                  onClose();
                  onNavigateToScenarios(region.id);
                }}
                className="px-4 py-2 rounded-xl bg-slate-900 hover:bg-slate-800 border border-indigo-700/80 text-indigo-200 transition flex items-center gap-1.5 shadow-sm"
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
                className="px-4 py-2 rounded-xl bg-gradient-to-r from-cyan-600 to-indigo-600 hover:from-cyan-500 hover:to-indigo-500 text-white transition flex items-center gap-1.5 shadow-lg shadow-cyan-950/80 glow-cyan"
              >
                <span>View Recommendations</span>
                <ArrowRight className="w-4 h-4" />
              </button>
            )}

            <button
              onClick={onClose}
              className="px-4 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-100 transition"
            >
              Close
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
