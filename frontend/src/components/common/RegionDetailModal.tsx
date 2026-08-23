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
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6 bg-slate-900/40 backdrop-blur-xs animate-in fade-in duration-150">
      <div className="w-full max-w-3xl max-h-[90vh] bg-white border border-slate-200 rounded-xl shadow-2xl overflow-hidden flex flex-col font-bold text-slate-950">
        {/* Modal Header */}
        <div className="p-6 border-b border-slate-200 bg-slate-50 flex items-start justify-between">
          <div className="space-y-1">
            <div className="flex items-center gap-2.5">
              <span className="text-xs font-mono font-extrabold px-2.5 py-0.5 rounded bg-white text-slate-800 border border-slate-200 uppercase">
                {region.country_code} • DISTRICT PROFILE
              </span>
              <span className="text-xs font-mono text-emerald-800 font-extrabold flex items-center gap-1">
                <Globe2 className="w-4 h-4" />
                Primary Language: {region.primary_language.toUpperCase()}
              </span>
            </div>
            <h2 className="text-xl md:text-2xl font-extrabold text-slate-950 flex items-center gap-2 tracking-tight">
              <MapPin className="w-6 h-6 text-indigo-600 font-extrabold" />
              <span>{region.district_city}, {region.country}</span>
            </h2>
            <p className="text-xs sm:text-sm text-slate-700 font-bold">
              State/Province: {region.state_province} • Geolocation Coordinates: {region.latitude.toFixed(4)}, {region.longitude.toFixed(4)}
            </p>
          </div>

          <button
            onClick={onClose}
            className="p-2 rounded-lg text-slate-600 hover:text-slate-950 hover:bg-slate-200 transition cursor-pointer"
          >
            <X className="w-5 h-5 font-extrabold" />
          </button>
        </div>

        {/* Modal Body */}
        <div className="p-6 overflow-y-auto space-y-6">
          {/* Key Census Statistics Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <div className="p-4 rounded-xl bg-slate-50 border border-slate-200 shadow-2xs">
              <div className="flex items-center justify-between text-slate-700 text-xs font-mono font-bold">
                <span>Total Population</span>
                <Users className="w-4 h-4 text-indigo-600 font-bold" />
              </div>
              <div className="text-2xl font-extrabold text-slate-950 font-mono mt-2">
                {region.population.toLocaleString()}
              </div>
              <div className="text-xs text-slate-700 font-mono mt-1 font-bold">
                Density: {(region.population_density || 4500).toLocaleString()} / km²
              </div>
            </div>

            <div className="p-4 rounded-xl bg-amber-50/60 border border-amber-200 shadow-2xs">
              <div className="flex items-center justify-between text-amber-900 text-xs font-mono font-bold">
                <span>Vulnerability Index</span>
                <ShieldAlert className="w-4 h-4 text-amber-700 font-bold" />
              </div>
              <div className="text-2xl font-extrabold text-amber-900 font-mono mt-2">
                {region.vulnerability_index.toFixed(2)} / 1.00
              </div>
              <div className="text-xs text-amber-900 font-mono mt-1 font-extrabold">
                {region.vulnerability_index >= 0.75 ? 'CRITICAL VULNERABILITY' : 'ELEVATED VULNERABILITY'}
              </div>
            </div>

            <div className="p-4 rounded-xl bg-emerald-50/60 border border-emerald-200 shadow-2xs">
              <div className="flex items-center justify-between text-emerald-900 text-xs font-mono font-bold">
                <span>Digital Access Rate</span>
                <Activity className="w-4 h-4 text-emerald-700 font-bold" />
              </div>
              <div className="text-2xl font-extrabold text-emerald-900 font-mono mt-2">
                {(region.digital_access_rate || 55).toFixed(0)}%
              </div>
              <div className="text-xs text-slate-700 font-mono mt-1 font-bold">
                Urbanization: {(region.urbanization_rate || 68).toFixed(0)}%
              </div>
            </div>
          </div>

          {/* Demographic Composition Meters */}
          <div className="p-5 rounded-xl bg-slate-50 border border-slate-200 space-y-4 shadow-2xs">
            <h3 className="text-xs sm:text-sm font-extrabold text-slate-950 uppercase tracking-wider font-mono flex items-center gap-2">
              <BarChart2 className="w-4 h-4 text-indigo-600" />
              <span>Demographic Need Breakdown</span>
            </h3>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs sm:text-sm font-mono font-bold">
              <div className="space-y-1.5">
                <div className="flex justify-between text-slate-950 font-extrabold">
                  <span>Youth Population Share</span>
                  <span className="text-indigo-700 font-extrabold">{(region.youth_percentage || 35).toFixed(1)}%</span>
                </div>
                <div className="h-2 rounded-full bg-slate-200 overflow-hidden border border-slate-300">
                  <div
                    className="h-full bg-indigo-600 rounded-full"
                    style={{ width: `${region.youth_percentage || 35}%` }}
                  />
                </div>
              </div>

              <div className="space-y-1.5">
                <div className="flex justify-between text-slate-950 font-extrabold">
                  <span>Elderly Population Share</span>
                  <span className="text-indigo-700 font-extrabold">{(region.elderly_percentage || 18).toFixed(1)}%</span>
                </div>
                <div className="h-2 rounded-full bg-slate-200 overflow-hidden border border-slate-300">
                  <div
                    className="h-full bg-indigo-500 rounded-full"
                    style={{ width: `${region.elderly_percentage || 18}%` }}
                  />
                </div>
              </div>
            </div>
          </div>

          {/* District Infrastructure Summary Card */}
          <div className="p-5 rounded-xl bg-slate-50 border border-slate-200 space-y-2 shadow-2xs">
            <div className="flex items-center gap-2 text-xs sm:text-sm font-mono text-indigo-700 uppercase font-extrabold">
              <Building2 className="w-4.5 h-4.5 text-indigo-600" />
              <span>District Decision Summary</span>
            </div>
            <p className="text-xs sm:text-sm text-slate-950 leading-relaxed font-bold">
              {region.district_city} exhibits an elevated census vulnerability index of <strong className="text-amber-800 font-extrabold">{region.vulnerability_index.toFixed(2)}</strong> across <strong className="text-slate-950 font-extrabold">{region.population.toLocaleString()}</strong> residents. Capital investment is recommended to address critical sector capacity deficits.
            </p>
          </div>
        </div>

        {/* Modal Footer Actions */}
        <div className="p-4 border-t border-slate-200 bg-slate-50 flex flex-col sm:flex-row items-center justify-between gap-3 text-xs sm:text-sm font-mono font-bold">
          <div className="flex items-center gap-2 text-slate-700">
            <span className="font-extrabold">Region ID: {region.id}</span>
          </div>

          <div className="flex flex-wrap items-center gap-2">
            {onNavigateToScenarios && (
              <button
                onClick={() => {
                  onClose();
                  onNavigateToScenarios(region.id);
                }}
                className="px-4 py-2 rounded-lg bg-white hover:bg-slate-100 border border-slate-300 text-slate-950 transition flex items-center gap-1.5 cursor-pointer font-sans font-extrabold shadow-2xs"
              >
                <Zap className="w-4 h-4 text-indigo-600" />
                <span>Simulate Scenario</span>
              </button>
            )}

            {onNavigateToRecommendations && (
              <button
                onClick={() => {
                  onClose();
                  onNavigateToRecommendations(region.id);
                }}
                className="px-4 py-2 rounded-lg bg-indigo-600 hover:bg-indigo-700 text-white transition flex items-center gap-1.5 cursor-pointer font-sans font-extrabold shadow-xs"
              >
                <span>View Recommendations</span>
                <ArrowRight className="w-4 h-4" />
              </button>
            )}

            <button
              onClick={onClose}
              className="px-4 py-2 rounded-lg bg-white hover:bg-slate-100 border border-slate-300 text-slate-950 transition cursor-pointer font-sans font-extrabold shadow-2xs"
            >
              Close
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
