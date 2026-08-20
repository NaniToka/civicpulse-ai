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
  const navItems: { id: NavTab; label: string; icon: React.ReactNode; badge?: string }[] = [
    { id: 'dashboard', label: 'Executive Overview', icon: <LayoutDashboard className="w-4 h-4" /> },
    { id: 'demand', label: 'Demand Intelligence', icon: <Search className="w-4 h-4" /> },
    { id: 'hotspots', label: 'Demand Hotspots', icon: <Flame className="w-4 h-4" /> },
    { id: 'gaps', label: 'Infrastructure Gaps', icon: <AlertCircle className="w-4 h-4" /> },
    { id: 'recommendations', label: 'Recommendations', icon: <FileCheck className="w-4 h-4" />, badge: 'Ranked' },
    { id: 'evidence', label: 'Evidence Explorer', icon: <Network className="w-4 h-4" /> },
    { id: 'scenarios', label: 'Scenario Lab', icon: <TestTube2 className="w-4 h-4" />, badge: 'Sim' },
    { id: 'data', label: 'Data Explorer', icon: <Database className="w-4 h-4" /> },
  ];

  return (
    <aside
      className={`bg-slate-950 border-r border-slate-800/80 flex flex-col transition-all duration-300 select-none ${
        collapsed ? 'w-16' : 'w-64'
      }`}
    >
      {/* Sidebar Header Toggle */}
      <div className="p-4 border-b border-slate-800/80 flex items-center justify-between">
        {!collapsed && (
          <div className="flex items-center gap-2">
            <span className="w-2 h-2 rounded-full bg-emerald-400 animate-ping" />
            <span className="text-xs font-mono font-semibold tracking-wider text-slate-300 uppercase">
              Civic Navigation
            </span>
          </div>
        )}
        {onToggleCollapse && (
          <button
            onClick={onToggleCollapse}
            className="p-1 rounded text-slate-400 hover:text-slate-200 hover:bg-slate-800 transition"
            title={collapsed ? 'Expand sidebar' : 'Collapse sidebar'}
          >
            {collapsed ? <ChevronRight className="w-4 h-4" /> : <ChevronLeft className="w-4 h-4" />}
          </button>
        )}
      </div>

      {/* Navigation Items */}
      <nav className="flex-1 p-3 space-y-1.5 overflow-y-auto">
        {navItems.map((item) => {
          const isActive = activeTab === item.id;
          return (
            <button
              key={item.id}
              onClick={() => setActiveTab(item.id)}
              className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-lg text-xs font-medium transition-all ${
                isActive
                  ? 'bg-sky-950/80 text-sky-300 border border-sky-800/60 shadow-sm'
                  : 'text-slate-400 hover:text-slate-200 hover:bg-slate-900'
              }`}
              title={collapsed ? item.label : undefined}
            >
              <span className={isActive ? 'text-sky-400' : 'text-slate-400'}>{item.icon}</span>
              {!collapsed && <span className="flex-1 text-left">{item.label}</span>}
              {!collapsed && item.badge && (
                <span className="text-[10px] font-mono px-1.5 py-0.5 rounded bg-slate-800 border border-slate-700 text-slate-400">
                  {item.badge}
                </span>
              )}
            </button>
          );
        })}
      </nav>

      {/* Bottom Footer Disclaimer */}
      {!collapsed && (
        <div className="p-4 border-t border-slate-800/80 bg-slate-950/90 text-xs space-y-2">
          <div className="flex items-center justify-between text-[11px] font-mono text-slate-400">
            <span className="flex items-center gap-1.5">
              <Activity className="w-3.5 h-3.5 text-emerald-400" />
              <span>Backend Online</span>
            </span>
            <span className="text-emerald-400">v0.3.0</span>
          </div>

          <div className="p-2 rounded bg-slate-900/90 border border-slate-800 text-[10px] text-slate-400 leading-tight flex items-start gap-1.5">
            <ShieldCheck className="w-3.5 h-3.5 text-sky-400 shrink-0 mt-0.5" />
            <div>
              <span className="font-semibold text-slate-300">DEMO ENVIRONMENT</span>
              <p className="text-slate-500 mt-0.5">Synthetic demonstration dataset for prototyping.</p>
            </div>
          </div>
        </div>
      )}
    </aside>
  );
};
