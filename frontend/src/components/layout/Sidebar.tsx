import React from 'react';
import {
  LayoutDashboard,
  Search,
  Flame,
  AlertCircle,
  FileCheck,
  Network,
  TestTube2,
  Database,
  Activity,
  ShieldCheck,
  ChevronLeft,
  ChevronRight,
  Compass,
} from 'lucide-react';

export type NavTab =
  | 'dashboard'
  | 'demand'
  | 'hotspots'
  | 'gaps'
  | 'recommendations'
  | 'evidence'
  | 'scenarios'
  | 'data';

interface SidebarProps {
  activeTab: NavTab;
  setActiveTab: (tab: NavTab) => void;
  collapsed?: boolean;
  onToggleCollapse?: () => void;
}

export const Sidebar: React.FC<SidebarProps> = ({
  activeTab,
  setActiveTab,
  collapsed = false,
  onToggleCollapse,
}) => {
  const navGroups: {
    groupName: string;
    items: { id: NavTab; label: string; icon: React.ReactNode; badge?: string }[];
  }[] = [
    {
      groupName: 'INTELLIGENCE HUB',
      items: [
        { id: 'dashboard', label: 'Executive Overview', icon: <LayoutDashboard className="w-4 h-4" /> },
        { id: 'demand', label: 'Demand Intelligence', icon: <Search className="w-4 h-4" /> },
        { id: 'hotspots', label: 'Demand Hotspots', icon: <Flame className="w-4 h-4" /> },
      ],
    },
    {
      groupName: 'DECISION ENGINE',
      items: [
        { id: 'gaps', label: 'Infrastructure Gaps', icon: <AlertCircle className="w-4 h-4" /> },
        { id: 'recommendations', label: 'Recommendations', icon: <FileCheck className="w-4 h-4" />, badge: 'Ranked' },
        { id: 'evidence', label: 'Evidence Explorer', icon: <Network className="w-4 h-4" /> },
        { id: 'scenarios', label: 'Scenario Lab', icon: <TestTube2 className="w-4 h-4" />, badge: 'Sim' },
      ],
    },
    {
      groupName: 'SYSTEM DATA',
      items: [{ id: 'data', label: 'Data Explorer', icon: <Database className="w-4 h-4" /> }],
    },
  ];

  return (
    <aside
      className={`hidden md:flex bg-[#070b14]/90 backdrop-blur-2xl border-r border-slate-800/80 flex-col transition-all duration-300 select-none ${
        collapsed ? 'w-16' : 'w-64'
      }`}
    >
      {/* Sidebar Header Toggle */}
      <div className="p-4 border-b border-slate-800/80 flex items-center justify-between">
        {!collapsed && (
          <div className="flex items-center gap-2">
            <Compass className="w-4 h-4 text-cyan-400 animate-spin-slow" />
            <span className="text-xs font-mono font-extrabold tracking-widest text-slate-100 uppercase gradient-text-cyan">
              Civic Navigation
            </span>
          </div>
        )}
        {onToggleCollapse && (
          <button
            onClick={onToggleCollapse}
            className="p-1.5 rounded-xl text-slate-400 hover:text-white hover:bg-slate-800/80 transition"
            title={collapsed ? 'Expand sidebar' : 'Collapse sidebar'}
          >
            {collapsed ? <ChevronRight className="w-4 h-4" /> : <ChevronLeft className="w-4 h-4" />}
          </button>
        )}
      </div>

      {/* Navigation Groups */}
      <nav className="flex-1 p-3 space-y-6 overflow-y-auto">
        {navGroups.map((group, groupIdx) => (
          <div key={groupIdx} className="space-y-1.5">
            {!collapsed && (
              <div className="px-3 text-[10px] font-mono font-extrabold text-slate-400 uppercase tracking-widest">
                {group.groupName}
              </div>
            )}
            <div className="space-y-1">
              {group.items.map((item) => {
                const isActive = activeTab === item.id;
                return (
                  <button
                    key={item.id}
                    onClick={() => setActiveTab(item.id)}
                    className={`w-full flex items-center gap-3 px-3.5 py-3 rounded-xl text-xs font-bold transition-all relative ${
                      isActive
                        ? 'bg-gradient-to-r from-cyan-950/80 to-indigo-950/60 text-cyan-200 border border-cyan-500/60 shadow-lg shadow-cyan-950/40 glow-cyan'
                        : 'text-slate-300 hover:text-white hover:bg-slate-900/60'
                    }`}
                    title={collapsed ? item.label : undefined}
                  >
                    {/* Active Cyan Left Indicator Bar */}
                    {isActive && (
                      <span className="absolute left-0 top-2 bottom-2 w-1 rounded-r-full bg-cyan-400 shadow-[0_0_10px_rgba(34,211,238,0.8)]" />
                    )}
                    <span className={isActive ? 'text-cyan-400 font-extrabold' : 'text-slate-400'}>{item.icon}</span>
                    {!collapsed && <span className="flex-1 text-left tracking-tight">{item.label}</span>}
                    {!collapsed && item.badge && (
                      <span className="text-[10px] font-mono font-extrabold px-2 py-0.5 rounded-md bg-slate-900 border border-slate-700 text-cyan-300">
                        {item.badge}
                      </span>
                    )}
                  </button>
                );
              })}
            </div>
          </div>
        ))}
      </nav>

      {/* Bottom Footer Disclaimer */}
      {!collapsed && (
        <div className="p-4 border-t border-slate-800/80 bg-[#060913]/90 text-xs space-y-2.5">
          <div className="flex items-center justify-between text-xs font-mono font-extrabold text-slate-200">
            <span className="flex items-center gap-2">
              <Activity className="w-4 h-4 text-emerald-400" />
              <span>Engine Status</span>
            </span>
            <span className="text-emerald-400 bg-emerald-950/80 px-2 py-0.5 rounded border border-emerald-800/80 text-[10px]">
              ONLINE v0.5.0
            </span>
          </div>

          <div className="p-3 rounded-xl bg-slate-900/80 border border-slate-800 text-xs text-slate-300 flex items-start gap-2.5 shadow-sm">
            <ShieldCheck className="w-4 h-4 text-cyan-400 shrink-0 mt-0.5" />
            <div>
              <span className="font-extrabold text-slate-100 uppercase text-[10px] font-mono tracking-wider">
                DEMO ENVIRONMENT
              </span>
              <p className="text-[11px] text-slate-400 font-medium mt-0.5 leading-tight">
                Synthetic demonstration dataset for prototyping.
              </p>
            </div>
          </div>
        </div>
      )}
    </aside>
  );
};
