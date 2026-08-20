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
      className={`bg-slate-950 border-r border-slate-800 flex flex-col transition-all duration-300 select-none ${
        collapsed ? 'w-16' : 'w-64'
      }`}
    >
      {/* Sidebar Header Toggle */}
      <div className="p-4 border-b border-slate-800 flex items-center justify-between">
        {!collapsed && (
          <div className="flex items-center gap-2">
            <span className="w-2.5 h-2.5 rounded-full bg-emerald-400 animate-pulse" />
            <span className="text-xs font-mono font-bold tracking-wider text-slate-100 uppercase">
              Civic Navigation
            </span>
          </div>
        )}
        {onToggleCollapse && (
          <button
            onClick={onToggleCollapse}
            className="p-1.5 rounded-lg text-slate-300 hover:text-white hover:bg-slate-800 transition"
            title={collapsed ? 'Expand sidebar' : 'Collapse sidebar'}
          >
            {collapsed ? <ChevronRight className="w-4 h-4" /> : <ChevronLeft className="w-4 h-4" />}
          </button>
        )}
      </div>

      {/* Navigation Items */}
      <nav className="flex-1 p-3 space-y-2 overflow-y-auto">
        {navItems.map((item) => {
          const isActive = activeTab === item.id;
          return (
            <button
              key={item.id}
              onClick={() => setActiveTab(item.id)}
              className={`w-full flex items-center gap-3 px-3.5 py-3 rounded-xl text-xs font-bold transition-all ${
                isActive
                  ? 'bg-sky-950 text-sky-200 border border-sky-600 shadow-md shadow-sky-950/50'
                  : 'text-slate-200 hover:text-white hover:bg-slate-900'
              }`}
              title={collapsed ? item.label : undefined}
            >
              <span className={isActive ? 'text-sky-400' : 'text-slate-300'}>{item.icon}</span>
              {!collapsed && <span className="flex-1 text-left tracking-tight">{item.label}</span>}
              {!collapsed && item.badge && (
                <span className="text-[10px] font-mono font-bold px-2 py-0.5 rounded-md bg-slate-900 border border-slate-700 text-sky-300">
                  {item.badge}
                </span>
              )}
            </button>
          );
        })}
      </nav>

      {/* Bottom Footer Disclaimer */}
      {!collapsed && (
        <div className="p-4 border-t border-slate-800 bg-slate-950 text-xs space-y-2">
          <div className="flex items-center justify-between text-xs font-mono font-bold text-slate-200">
            <span className="flex items-center gap-1.5">
              <Activity className="w-4 h-4 text-emerald-400" />
              <span>Backend Online</span>
            </span>
            <span className="text-emerald-400">v0.5.0</span>
          </div>

          <div className="p-2.5 rounded-xl bg-slate-900 border border-slate-800 text-xs text-slate-300 flex items-start gap-2 shadow-sm">
            <ShieldCheck className="w-4 h-4 text-sky-400 shrink-0 mt-0.5" />
            <div>
              <span className="font-bold text-slate-100 uppercase text-[10px] font-mono">DEMO ENVIRONMENT</span>
              <p className="text-[11px] text-slate-300 font-medium mt-0.5 leading-tight">Synthetic demonstration dataset for prototyping.</p>
            </div>
          </div>
        </div>
      )}
    </aside>
  );
};
