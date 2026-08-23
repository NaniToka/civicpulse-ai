import React, { useState } from 'react';
import {
  Users,
  MapPin,
  AlertTriangle,
  FileCheck,
  TrendingUp,
  ArrowRight,
  ShieldCheck,
  Sparkles,
  Network,
  Building2,
  ChevronRight,
  Globe2,
  Zap,
  BarChart3,
  Activity,
  Search,
  Clock,
  MessageSquare,
} from 'lucide-react';
import { CitizenRequest, PriorityRecommendation, Region } from '../types';
import { PriorityBadge } from '../components/common/PriorityBadge';
import { TrendBadge } from '../components/common/TrendBadge';
import { NavTab } from '../components/layout/Sidebar';
import { RegionDetailModal } from '../components/common/RegionDetailModal';
import { ThreeDDonutChart } from '../components/common/ThreeDDonutChart';

interface DashboardOverviewProps {
  recommendations: PriorityRecommendation[];
  requests: CitizenRequest[];
  regions: Region[];
  onNavigate: (tab: NavTab) => void;
  onOpenEvidenceModal?: (rec: PriorityRecommendation) => void;
}

export const DashboardOverview: React.FC<DashboardOverviewProps> = ({
  recommendations,
  requests,
  regions,
  onNavigate,
  onOpenEvidenceModal,
}) => {
  const [selectedRegionId, setSelectedRegionId] = useState<string>(regions[0]?.id || 'REG-IND-UP-KANP-02');
  const [activeDetailRegion, setActiveDetailRegion] = useState<Region | null>(null);
  const [tableSearchQuery, setTableSearchQuery] = useState('');
  const [tableCategoryFilter, setTableCategoryFilter] = useState('ALL');

  const totalRequests = requests.length || 24680;
  const totalRegions = regions.length || 35;
  const criticalRecs = recommendations.filter((r) => r.priority_level === 'CRITICAL' || r.priority_level === 'HIGH');
  const topRecommendations = recommendations.slice(0, 5);
  const featuredRec = recommendations[0];
  const selectedRegion = regions.find((r) => r.id === selectedRegionId) || regions[0];

  // Category counts for clean circular graph
  const categoryCounts: Record<string, number> = {
    Healthcare: 0,
    'Clean Water': 0,
    'Sanitation & Drainage': 0,
    'Electricity & Power': 0,
    Transportation: 0,
    'Digital Connectivity': 0,
  };

  requests.forEach((r) => {
    const cat = r.request_category || r.category || 'Healthcare';
    if (cat.toLowerCase().includes('health')) categoryCounts['Healthcare'] += 1;
    else if (cat.toLowerCase().includes('water')) categoryCounts['Clean Water'] += 1;
    else if (cat.toLowerCase().includes('sanit') || cat.toLowerCase().includes('drain')) categoryCounts['Sanitation & Drainage'] += 1;
    else if (cat.toLowerCase().includes('electr') || cat.toLowerCase().includes('power')) categoryCounts['Electricity & Power'] += 1;
    else if (cat.toLowerCase().includes('transp')) categoryCounts['Transportation'] += 1;
    else categoryCounts['Digital Connectivity'] += 1;
  });

  // Ensure non-zero values for visual demonstration
  if (categoryCounts['Healthcare'] === 0) {
    categoryCounts['Healthcare'] = 34;
    categoryCounts['Clean Water'] = 28;
    categoryCounts['Sanitation & Drainage'] = 20;
    categoryCounts['Electricity & Power'] = 15;
    categoryCounts['Transportation'] = 12;
    categoryCounts['Digital Connectivity'] = 8;
  }

  const categoryGraphData = [
    { label: 'Healthcare', count: categoryCounts['Healthcare'], color: '#06b6d4' },
    { label: 'Clean Water', count: categoryCounts['Clean Water'], color: '#38bdf8' },
    { label: 'Sanitation', count: categoryCounts['Sanitation & Drainage'], color: '#6366f1' },
    { label: 'Electricity', count: categoryCounts['Electricity & Power'], color: '#f59e0b' },
    { label: 'Transportation', count: categoryCounts['Transportation'], color: '#10b981' },
    { label: 'Digital', count: categoryCounts['Digital Connectivity'], color: '#f43f5e' },
  ];

  const graphTotal = categoryGraphData.reduce((acc, curr) => acc + curr.count, 0);

  // Filtered requests for the "Where & When Problems Raised" master table
  const filteredProblemStream = requests.filter((r) => {
    const cat = r.request_category || r.category || '';
    if (tableCategoryFilter !== 'ALL' && !cat.toLowerCase().includes(tableCategoryFilter.toLowerCase())) return false;
    if (
      tableSearchQuery &&
      !r.original_text.toLowerCase().includes(tableSearchQuery.toLowerCase()) &&
      !r.translated_text.toLowerCase().includes(tableSearchQuery.toLowerCase()) &&
      !r.region_id.toLowerCase().includes(tableSearchQuery.toLowerCase())
    ) {
      return false;
    }
    return true;
  });

  const handleOpenRegionDetails = (rId: string) => {
    const reg = regions.find((r) => r.id === rId);
    if (reg) setActiveDetailRegion(reg);
    else setActiveDetailRegion(selectedRegion);
  };

  return (
    <div className="space-y-8 animate-in fade-in duration-150">
      {/* 1. Hero Command Cockpit Banner */}
      <div className="rounded-xl bg-[#0A0A0C] border border-white/[0.08] p-6 md:p-8 space-y-6 shadow-sm">
        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-6">
          <div className="space-y-2 max-w-3xl">
            <div className="flex items-center gap-2">
              <span className="w-2 h-2 rounded-full bg-green-500" />
              <span className="text-[11px] font-semibold uppercase tracking-wider text-slate-400 font-mono">
                Civic Priority System • Active
              </span>
            </div>

            <h1 className="text-2xl md:text-[28px] font-semibold tracking-tight text-slate-100">
              CivicPulse <span className="hero-gradient-text">Overview & Priorities</span>
            </h1>

            <p className="text-xs sm:text-sm text-slate-400">
              Real-time citizen feedback, facility shortfalls & budget priorities.
            </p>


            <div className="flex flex-wrap items-center gap-2 pt-2 font-mono text-xs">
              <span className="px-2.5 py-1 rounded-md bg-[#121215] border border-white/[0.08] text-slate-300 font-medium flex items-center gap-1.5">
                <span className="w-1.5 h-1.5 rounded-full bg-indigo-400" />
                35 Districts Covered
              </span>
              <span className="px-2.5 py-1 rounded-md bg-[#121215] border border-white/[0.08] text-slate-300 font-medium flex items-center gap-1.5">
                <span className="w-1.5 h-1.5 rounded-full bg-green-400" />
                7 Native Languages
              </span>
            </div>
          </div>

          {/* Quick Launcher Buttons */}
          <div className="grid grid-cols-2 lg:flex items-center gap-2.5 shrink-0 w-full sm:w-auto">
            <button
              onClick={() => onNavigate('feedback')}
              className="flex items-center justify-center gap-2 px-3.5 py-2 rounded-lg bg-indigo-600 hover:bg-indigo-500 text-white font-medium text-xs transition cursor-pointer text-center"
            >
              <MessageSquare className="w-3.5 h-3.5 shrink-0" />
              <span className="truncate">View Complaints</span>
            </button>
            <button
              onClick={() => onNavigate('demand')}
              className="flex items-center justify-center gap-2 px-3.5 py-2 rounded-lg bg-[#121215] hover:bg-[#101014] border border-white/[0.08] text-slate-200 font-medium text-xs transition cursor-pointer text-center"
            >
              <Globe2 className="w-3.5 h-3.5 text-indigo-400 shrink-0" />
              <span className="truncate">Citizen Voices</span>
            </button>
            <button
              onClick={() => onNavigate('scenarios')}
              className="flex items-center justify-center gap-2 px-3.5 py-2 rounded-lg bg-[#121215] hover:bg-[#101014] border border-white/[0.08] text-slate-200 font-medium text-xs transition cursor-pointer text-center"
            >
              <Sparkles className="w-3.5 h-3.5 text-indigo-400 shrink-0" />
              <span className="truncate">Budget Simulator</span>
            </button>
            <button
              onClick={() => onNavigate('hotspots')}
              className="flex items-center justify-center gap-2 px-3.5 py-2 rounded-lg bg-[#121215] hover:bg-[#101014] border border-white/[0.08] text-slate-200 font-medium text-xs transition cursor-pointer text-center"
            >
              <Activity className="w-3.5 h-3.5 text-indigo-400 shrink-0" />
              <span className="truncate">Problem Hotspots</span>
            </button>

          </div>
        </div>
      </div>

      {/* 2. Top Executive Metric Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {/* Card 1: Citizen Signals */}
        <div className="p-6 rounded-xl bg-[#0A0A0C] border border-white/[0.08] hover:border-white/[0.16] transition-colors duration-150 shadow-sm flex flex-col justify-between">
          <div className="flex items-center justify-between">
            <span className="text-[11px] font-semibold text-slate-400 uppercase tracking-wider">
              Total Complaints Logged
            </span>
            <div className="p-2 rounded-lg bg-[#121215] border border-white/[0.08] text-slate-400">
              <Users className="w-4 h-4" />
            </div>
          </div>
          <div className="mt-3 space-y-1">
            <div className="text-2xl font-semibold text-slate-100 tracking-tight font-mono">
              {totalRequests > 100 ? totalRequests.toLocaleString() : '24,680'}
            </div>
            <div className="flex items-center gap-1.5 text-xs text-green-400 font-medium">
              <TrendingUp className="w-3.5 h-3.5" />
              <span>+18.4% growth this month</span>
            </div>
          </div>
          <div className="mt-3 h-1.5 w-full bg-[#121215] rounded-full overflow-hidden border border-white/[0.08]">
            <div className="h-full bg-indigo-500 rounded-full w-[78%]" />
          </div>
        </div>

        {/* Card 2: Regions Analyzed */}
        <div className="p-6 rounded-xl bg-[#0A0A0C] border border-white/[0.08] hover:border-white/[0.16] transition-colors duration-150 shadow-sm flex flex-col justify-between">
          <div className="flex items-center justify-between">
            <span className="text-[11px] font-semibold text-slate-400 uppercase tracking-wider">
              Districts Monitored
            </span>
            <div className="p-2 rounded-lg bg-[#121215] border border-white/[0.08] text-slate-400">
              <MapPin className="w-4 h-4" />
            </div>
          </div>
          <div className="mt-3 space-y-1">
            <div className="text-2xl font-semibold text-slate-100 tracking-tight font-mono">
              {totalRegions}
            </div>
            <div className="text-xs text-slate-400 font-medium">
              35 Districts & Cities
            </div>
          </div>
          <div className="mt-3 h-1.5 w-full bg-[#121215] rounded-full overflow-hidden border border-white/[0.08]">
            <div className="h-full bg-indigo-500 rounded-full w-[100%]" />
          </div>
        </div>

        {/* Card 3: Infrastructure Deficits */}
        <div className="p-6 rounded-xl bg-[#0A0A0C] border border-white/[0.08] hover:border-white/[0.16] transition-colors duration-150 shadow-sm flex flex-col justify-between">
          <div className="flex items-center justify-between">
            <span className="text-[11px] font-semibold text-slate-400 uppercase tracking-wider">
              Facility Shortfalls Found
            </span>
            <div className="p-2 rounded-lg bg-[#121215] border border-white/[0.08] text-amber-400">
              <AlertTriangle className="w-4 h-4" />
            </div>
          </div>
          <div className="mt-3 space-y-1">
            <div className="text-2xl font-semibold text-slate-100 tracking-tight font-mono">126</div>
            <div className="text-xs text-amber-400 font-medium">
              High deficit area ratio
            </div>
          </div>
          <div className="mt-3 h-1.5 w-full bg-[#121215] rounded-full overflow-hidden border border-white/[0.08]">
            <div className="h-full bg-amber-500 rounded-full w-[68%]" />
          </div>
        </div>

        {/* Card 4: High-Priority Needs */}
        <div className="p-6 rounded-xl bg-[#0A0A0C] border border-white/[0.08] hover:border-white/[0.16] transition-colors duration-150 shadow-sm flex flex-col justify-between">
          <div className="flex items-center justify-between">
            <span className="text-[11px] font-semibold text-slate-400 uppercase tracking-wider">
              Urgent Priority Projects
            </span>
            <div className="p-2 rounded-lg bg-[#121215] border border-white/[0.08] text-red-400">
              <FileCheck className="w-4 h-4" />
            </div>
          </div>
          <div className="mt-3 space-y-1">
            <div className="text-2xl font-semibold text-slate-100 tracking-tight font-mono">
              {criticalRecs.length || 18}
            </div>
            <div className="text-xs text-red-400 font-medium flex items-center gap-1">
              <Zap className="w-3.5 h-3.5 text-red-400" />
              <span>Requires immediate budget priority</span>
            </div>
          </div>
          <div className="mt-3 h-1.5 w-full bg-[#121215] rounded-full overflow-hidden border border-white/[0.08]">
            <div className="h-full bg-red-500 rounded-full w-[85%]" />
          </div>
        </div>

      </div>

      {/* 3. 3D Animated Isometric Cylinder Donut Chart & Multilingual Script Representation */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* 3D ISOMETRIC DONUT CHART */}
        <ThreeDDonutChart data={categoryGraphData} total={graphTotal} />

        {/* Multilingual Citizen Representation */}
        <div className="p-6 rounded-xl bg-[#0A0A0C] border border-white/[0.08] space-y-5 shadow-sm">
          <div className="flex items-center justify-between border-b border-white/[0.08] pb-4">
            <div className="flex items-center gap-2">
              <Globe2 className="w-4 h-4 text-indigo-400" />
              <h3 className="text-[15px] font-semibold text-slate-100">Multilingual Voice Representation</h3>
            </div>
            <span className="text-xs font-mono text-indigo-400 bg-indigo-500/10 px-2.5 py-0.5 rounded border border-indigo-500/20 font-medium">
              7 Languages Active
            </span>
          </div>

          <div className="grid grid-cols-2 gap-3 font-mono text-xs">
            <div className="p-3.5 rounded-lg bg-[#121215] border border-white/[0.08]">
              <div className="text-slate-300 font-medium">Hindi (हिंदी)</div>
              <div className="text-lg font-semibold text-indigo-400 mt-1">35% share</div>
              <div className="text-[11px] text-slate-400 mt-0.5">Kanpur, Delhi, Jaipur, Patna</div>
            </div>

            <div className="p-3.5 rounded-lg bg-[#121215] border border-white/[0.08]">
              <div className="text-slate-300 font-medium">Telugu (తెలుగు)</div>
              <div className="text-lg font-semibold text-indigo-400 mt-1">22% share</div>
              <div className="text-[11px] text-slate-400 mt-0.5">Ongole, Hyderabad, Vizag</div>
            </div>

            <div className="p-3.5 rounded-lg bg-[#121215] border border-white/[0.08]">
              <div className="text-slate-300 font-medium">Marathi (मराठी)</div>
              <div className="text-lg font-semibold text-indigo-400 mt-1">18% share</div>
              <div className="text-[11px] text-slate-400 mt-0.5">Pune, Mumbai, Nagpur</div>
            </div>

            <div className="p-3.5 rounded-lg bg-[#121215] border border-white/[0.08]">
              <div className="text-slate-300 font-medium">Tamil & Punjabi</div>
              <div className="text-lg font-semibold text-indigo-400 mt-1">15% share</div>
              <div className="text-[11px] text-slate-400 mt-0.5">Chennai, Ludhiana, Amritsar</div>
            </div>
          </div>
        </div>
      </div>

      {/* 4. MASTER "WHERE AND WHEN PROBLEMS RAISED" STREAM TABLE */}
      <div className="p-6 rounded-xl bg-[#0A0A0C] border border-white/[0.08] space-y-4 shadow-sm">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-white/[0.08] pb-4">
          <div>
            <div className="flex items-center gap-2">
              <Clock className="w-4 h-4 text-indigo-400" />
              <h3 className="text-[15px] font-semibold text-slate-100">
                Real-Time Citizen Problems Log: Where & When Raised
              </h3>
            </div>
            <p className="text-xs text-slate-400 mt-0.5">
              Live audit stream detailing problems raised per Indian District/State and timestamp logging.
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-3">
            <div className="relative">
              <Search className="w-3.5 h-3.5 absolute left-3 top-2.5 text-slate-400" />
              <input
                type="text"
                placeholder="Search location or problem..."
                value={tableSearchQuery}
                onChange={(e) => setTableSearchQuery(e.target.value)}
                className="pl-8 pr-3 py-1.5 bg-[#121215] border border-white/[0.08] rounded-lg text-xs text-slate-100 placeholder-slate-400 focus:outline-none"
              />
            </div>

            <select
              value={tableCategoryFilter}
              onChange={(e) => setTableCategoryFilter(e.target.value)}
              className="bg-[#121215] border border-white/[0.08] text-slate-200 text-xs rounded-lg px-3 py-1.5 focus:outline-none cursor-pointer"
            >
              <option value="ALL">All Sectors</option>
              <option value="healthcare">Healthcare</option>
              <option value="water">Water</option>
              <option value="sanitation">Sanitation</option>
              <option value="electricity">Electricity</option>
              <option value="transportation">Transportation</option>
            </select>
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs font-mono border-collapse">
            <thead className="bg-[#121215] text-slate-400 border-b border-white/[0.08] uppercase text-[11px]">
              <tr>
                <th className="p-3">SIGNAL ID</th>
                <th className="p-3">WHERE (DISTRICT / STATE)</th>
                <th className="p-3">SECTOR</th>
                <th className="p-3">URGENCY</th>
                <th className="p-3">WHEN (TIMESTAMP)</th>
                <th className="p-3">CITIZEN FEEDBACK PROBLEM</th>
                <th className="p-3">ACTION</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-white/[0.08]">
              {filteredProblemStream.map((req) => (
                <tr key={req.id} className="hover:bg-[#121215] transition-colors">
                  <td className="p-3 font-semibold text-indigo-400">{req.id}</td>
                  <td className="p-3">
                    <button
                      onClick={() => handleOpenRegionDetails(req.region_id)}
                      className="text-slate-200 hover:text-indigo-400 font-semibold hover:underline flex items-center gap-1 text-xs cursor-pointer"
                    >
                      <MapPin className="w-3.5 h-3.5 text-indigo-400" />
                      <span>{req.region_id}</span>
                    </button>
                  </td>
                  <td className="p-3 text-slate-300 uppercase">{req.request_category || req.category}</td>
                  <td className="p-3">
                    <PriorityBadge level={req.urgency || req.extracted_entities.severity} size="sm" />
                  </td>
                  <td className="p-3 text-slate-400">{req.timestamp ? req.timestamp.replace('T', ' ').slice(0, 16) : '2026-08-21 14:30'} IST</td>
                  <td className="p-3 max-w-xs">
                    <div className="text-slate-200 text-xs truncate font-sans">"{req.original_text}"</div>
                    <div className="text-slate-400 text-[11px] italic truncate">→ {req.translated_text}</div>
                  </td>
                  <td className="p-3">
                    <button
                      onClick={() => handleOpenRegionDetails(req.region_id)}
                      className="px-2.5 py-1 rounded-lg bg-[#121215] hover:bg-[#101014] border border-white/[0.08] text-slate-300 font-medium text-[11px] flex items-center gap-1 cursor-pointer"
                    >
                      <span>Details</span>
                      <ArrowRight className="w-3 h-3" />
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* 5. Geographic Demand Landscape (100k Per-Capita Baseline) */}
      <div className="p-6 rounded-xl bg-[#0A0A0C] border border-white/[0.08] space-y-5 shadow-sm">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-white/[0.08] pb-4">
          <div>
            <h2 className="text-[15px] font-semibold text-slate-100 flex items-center gap-2">
              <Building2 className="w-4 h-4 text-indigo-400" />
              <span>Districts Demand Landscape (100k Per-Capita Baseline)</span>
            </h2>
            <p className="text-xs text-slate-400 mt-0.5">
              Geographic demand concentration normalized per 100,000 residents vs deficit scores.
            </p>
          </div>

          <div className="flex items-center gap-3 text-xs">
            <span className="text-slate-400 font-medium">Target District:</span>
            <select
              value={selectedRegionId}
              onChange={(e) => setSelectedRegionId(e.target.value)}
              className="bg-[#121215] border border-white/[0.08] text-slate-200 text-xs rounded-lg px-3 py-1.5 focus:outline-none cursor-pointer"
            >
              {regions.map((r) => (
                <option key={r.id} value={r.id}>
                  {r.district_city}, {r.state_province} ({r.population.toLocaleString()} residents)
                </option>
              ))}
            </select>
          </div>
        </div>

        {/* Visual Bar Comparison Graph for Per-Capita Density */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          {regions.slice(0, 8).map((reg) => {
            const isSelected = reg.id === selectedRegionId;
            const regRequests = requests.filter((r) => r.region_id === reg.id);
            const reqCount = regRequests.length || (reg.id.includes('KANP') ? 14 : reg.id.includes('PUNE') ? 8 : 6);
            const perCapita = Math.round(((reqCount * 1750) / reg.population) * 100000);
            const densityPct = Math.min(100, Math.max(15, Math.round((perCapita / 200) * 100)));

            return (
              <button
                key={reg.id}
                onClick={() => setSelectedRegionId(reg.id)}
                className={`p-5 rounded-xl border text-left transition-colors duration-150 cursor-pointer flex flex-col justify-between ${
                  isSelected
                    ? 'bg-[#121215] border-indigo-500/40'
                    : 'bg-[#0A0A0C] border-white/[0.08] hover:border-white/[0.16]'
                }`}
              >
                <div>
                  <div className="flex justify-between items-start mb-2">
                    <span className="text-sm font-semibold text-slate-100 tracking-tight">{reg.district_city}</span>
                    <span className="text-[10px] font-mono px-1.5 py-0.2 rounded bg-[#0A0A0C] border border-white/[0.08] text-slate-400">
                      {reg.country_code}
                    </span>
                  </div>

                  <div className="text-xl font-semibold text-slate-100 font-mono tracking-tight mt-1">
                    {perCapita.toLocaleString()} <span className="text-xs text-slate-400 font-normal">/ 100k</span>
                  </div>

                  <div className="mt-3 space-y-1">
                    <div className="flex justify-between text-[10px] font-mono text-slate-400">
                      <span>Density Meter</span>
                      <span className="text-indigo-400">{densityPct}%</span>
                    </div>
                    <div className="h-1.5 w-full bg-[#0A0A0C] rounded-full overflow-hidden border border-white/[0.08]">
                      <div
                        className={`h-full rounded-full transition-all duration-300 ${
                          isSelected ? 'bg-indigo-500' : 'bg-slate-600'
                        }`}
                        style={{ width: `${densityPct}%` }}
                      />
                    </div>
                  </div>
                </div>

                <div className="mt-4 pt-3 border-t border-white/[0.08] space-y-1 text-xs font-mono">
                  <div className="flex justify-between text-slate-400">
                    <span>Population:</span>
                    <span className="text-slate-200">{reg.population.toLocaleString()}</span>
                  </div>
                  <div className="flex justify-between text-slate-400">
                    <span>Vulnerability:</span>
                    <span className="text-amber-400">{reg.vulnerability_index.toFixed(2)}</span>
                  </div>
                </div>
              </button>
            );
          })}
        </div>

        {/* Selected Region Intelligence Banner */}
        {selectedRegion && (
          <div className="p-4 rounded-lg bg-[#121215] border border-white/[0.08] flex flex-col md:flex-row items-start md:items-center justify-between gap-4 text-xs">
            <div className="flex items-center gap-3">
              <div className="p-2 rounded-lg bg-[#0A0A0C] text-indigo-400 border border-white/[0.08]">
                <ShieldCheck className="w-4 h-4" />
              </div>
              <div>
                <span className="font-semibold text-slate-100 text-sm">
                  {selectedRegion.district_city}, {selectedRegion.state_province}, {selectedRegion.country}
                </span>
                <p className="text-slate-400 text-xs mt-0.5 font-mono">
                  Demographic Vulnerability: <strong className="text-amber-400">{selectedRegion.vulnerability_index.toFixed(2)}</strong> • Primary Language: <strong className="text-indigo-400">{selectedRegion.primary_language.toUpperCase()}</strong>
                </p>
              </div>
            </div>
            <div className="flex items-center gap-2">
              <button
                onClick={() => handleOpenRegionDetails(selectedRegion.id)}
                className="px-3.5 py-1.5 rounded-lg bg-indigo-600 hover:bg-indigo-500 text-white font-medium transition text-xs flex items-center gap-1.5 cursor-pointer shadow-sm"
              >
                <MapPin className="w-3.5 h-3.5" />
                <span>Region Details</span>
              </button>
              <button
                onClick={() => onNavigate('hotspots')}
                className="px-3.5 py-1.5 rounded-lg bg-[#0A0A0C] hover:bg-[#101014] border border-white/[0.08] text-slate-200 transition text-xs flex items-center gap-1.5 cursor-pointer"
              >
                <span>Hotspots</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </button>
            </div>
          </div>
        )}
      </div>

      {/* 6. Visual 8-Factor Prioritization Model Card */}
      <div className="p-6 rounded-xl bg-[#0A0A0C] border border-white/[0.08] space-y-4 shadow-sm">
        <div className="flex items-center justify-between border-b border-white/[0.08] pb-4">
          <div>
            <h2 className="text-[15px] font-semibold text-slate-100 flex items-center gap-2">
              <BarChart3 className="w-4 h-4 text-indigo-400" />
              <span>Deterministic 8-Factor Prioritization Formula (V2)</span>
            </h2>
            <p className="text-xs text-slate-400 mt-0.5">
              Mathematical formula combining citizen signals, deficit gaps, census demographics, and risk penalties.
            </p>
          </div>
          <span className="px-2.5 py-1 rounded bg-[#121215] text-slate-300 border border-white/[0.08] text-xs font-mono">
            Score = Σ(Weight × Factor) - Risk
          </span>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-8 gap-3">
          {[
            { label: 'Demand', weight: '20%' },
            { label: 'Deficit Gap', weight: '20%' },
            { label: 'Population', weight: '15%' },
            { label: 'Demographic', weight: '15%' },
            { label: 'Momentum', weight: '10%' },
            { label: 'Urgency', weight: '10%' },
            { label: 'Alignment', weight: '5%' },
            { label: 'Evidence Q', weight: '5%' },
          ].map((f) => (
            <div key={f.label} className="p-3 rounded-lg bg-[#121215] border border-white/[0.08] text-center space-y-1.5">
              <div className="text-[11px] font-semibold text-slate-400 font-mono truncate">{f.label}</div>
              <div className="text-base font-semibold text-slate-100 font-mono">{f.weight}</div>
              <div className="h-1.5 w-full bg-[#0A0A0C] rounded-full overflow-hidden border border-white/[0.08]">
                <div className="h-full bg-indigo-500 rounded-full w-full" />
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* 7. Top Priority Actions & Featured Evidence Preview */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Top 5 Priority Recommendations */}
        <div className="lg:col-span-2 p-6 rounded-xl bg-[#0A0A0C] border border-white/[0.08] space-y-4 shadow-sm">
          <div className="flex items-center justify-between border-b border-white/[0.08] pb-4">
            <div>
              <h2 className="text-[15px] font-semibold text-slate-100">Ranked Priority Actions</h2>
              <p className="text-xs text-slate-400">Traceable evidence-backed capital investment recommendations.</p>
            </div>
            <button
              onClick={() => onNavigate('recommendations')}
              className="text-xs font-mono font-medium text-indigo-400 hover:text-indigo-300 flex items-center gap-1 cursor-pointer"
            >
              <span>Full List ({recommendations.length})</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </button>
          </div>

          <div className="space-y-3">
            {topRecommendations.map((rec, index) => (
              <div
                key={rec.id}
                className="p-4 rounded-lg bg-[#121215] border border-white/[0.08] hover:border-white/[0.16] transition-colors duration-150 flex flex-col sm:flex-row sm:items-center justify-between gap-4"
              >
                <div className="flex items-start gap-3">
                  <span className="text-xs font-mono font-semibold text-indigo-400 w-6 pt-0.5">
                    #{index + 1}
                  </span>
                  <div>
                    <div className="flex items-center gap-2">
                      <span className="text-sm font-semibold text-slate-100 tracking-tight">
                        {rec.category.toUpperCase()}
                      </span>
                      <PriorityBadge level={rec.priority_level} score={rec.priority_score} size="sm" />
                    </div>
                    <div className="text-xs text-slate-400 font-mono mt-0.5">{rec.region_name}</div>
                    <div className="text-xs text-slate-300 mt-1 italic line-clamp-1">{rec.reasoning}</div>
                  </div>
                </div>

                <div className="flex items-center gap-3 self-end sm:self-center">
                  {rec.demand_momentum && (
                    <TrendBadge trend={rec.demand_momentum.trend} pctChange={rec.demand_momentum.percentage_change} />
                  )}
                  <button
                    onClick={() => onOpenEvidenceModal && onOpenEvidenceModal(rec)}
                    className="px-3 py-1.5 rounded-lg bg-[#0A0A0C] hover:bg-[#101014] border border-white/[0.08] text-slate-300 transition text-xs font-medium flex items-center gap-1 cursor-pointer"
                  >
                    <span>View Evidence</span>
                    <ChevronRight className="w-4 h-4" />
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Featured Evidence Chain Preview Card */}
        <div className="p-6 rounded-xl bg-[#0A0A0C] border border-white/[0.08] space-y-5 flex flex-col justify-between shadow-sm">
          <div>
            <div className="flex items-center gap-2 mb-4">
              <Network className="w-4 h-4 text-indigo-400" />
              <h3 className="text-xs font-semibold text-slate-300 uppercase tracking-wider font-mono">
                Featured Evidence Chain Preview
              </h3>
            </div>
            {featuredRec && (
              <>
                <div className="flex items-center justify-between mb-4 p-3.5 rounded-lg bg-[#121215] border border-white/[0.08]">
                  <div>
                    <h4 className="text-sm font-semibold text-slate-100">{featuredRec.category.toUpperCase()}</h4>
                    <span className="text-xs font-mono text-slate-400">{featuredRec.region_name}</span>
                  </div>
                  <PriorityBadge level={featuredRec.priority_level} score={featuredRec.priority_score} size="sm" />
                </div>

                {/* Vertical Evidence Chain Step Preview */}
                <div className="space-y-3 relative before:absolute before:left-2 before:top-2 before:bottom-2 before:w-0.5 before:bg-white/[0.08] pl-5 text-xs">
                  <div className="relative">
                    <span className="absolute -left-5 top-1 w-2.5 h-2.5 rounded-full bg-indigo-500" />
                    <div className="font-semibold text-slate-200">14 Verified Citizen Signals</div>
                    <div className="text-[11px] text-slate-400 font-mono">High demand density logged</div>
                  </div>
                  <div className="relative">
                    <span className="absolute -left-5 top-1 w-2.5 h-2.5 rounded-full bg-amber-500" />
                    <div className="font-semibold text-slate-200">Capacity Gap: 0.82 Deficit</div>
                    <div className="text-[11px] text-slate-400 font-mono">Baseline capacity deficit</div>
                  </div>
                  <div className="relative">
                    <span className="absolute -left-5 top-1 w-2.5 h-2.5 rounded-full bg-indigo-400" />
                    <div className="font-semibold text-slate-200">Demand Velocity Trend</div>
                    <div className="text-[11px] text-slate-400 font-mono">+25% 30-day temporal change</div>
                  </div>
                  <div className="relative">
                    <span className="absolute -left-5 top-1 w-2.5 h-2.5 rounded-full bg-red-500" />
                    <div className="font-semibold text-red-400">Priority Score: {featuredRec.priority_score.toFixed(1)}/100</div>
                    <div className="text-[11px] text-slate-400 font-mono">Fast-track allocation required</div>
                  </div>
                </div>
              </>
            )}
          </div>

          {featuredRec && (
            <button
              onClick={() => onOpenEvidenceModal && onOpenEvidenceModal(featuredRec)}
              className="w-full py-2.5 rounded-lg bg-indigo-600 hover:bg-indigo-500 text-white text-xs font-medium transition flex items-center justify-center gap-2 cursor-pointer shadow-sm"
            >
              <span>Inspect 6-Step Evidence Trail</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </button>
          )}
        </div>
      </div>

      <RegionDetailModal
        region={activeDetailRegion}
        onClose={() => setActiveDetailRegion(null)}
      />
    </div>
  );
};
