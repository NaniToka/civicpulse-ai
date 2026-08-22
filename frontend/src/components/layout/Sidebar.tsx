import React from 'react';
import {
  LayoutDashboard,
  Search,
  MessageSquare,
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
  | 'feedback'
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
        { id: 'feedback', label: 'Citizen Comments', icon: <MessageSquare className="w-4 h-4" />, badge: 'Emojis' },
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
      className={`hidden md:flex bg-[#121319] border-r border-white/[0.08] flex-col transition-all duration-200 select-none ${
        collapsed ? 'w-16' : 'w-60'
      }`}
    >
      {/* Sidebar Header Toggle */}
      <div className="p-3.5 border-b border-white/[0.08] flex items-center justify-between">
        {!collapsed && (
          <div className="flex items-center gap-2">
            <Compass className="w-4 h-4 text-indigo-400" />
            <span className="text-[11px] font-semibold tracking-wider text-slate-400 uppercase">
              Navigation
            </span>
          </div>
        )}
        {onToggleCollapse && (
          <button
            onClick={onToggleCollapse}
            className="p-1 rounded-lg text-slate-400 hover:text-white hover:bg-[#1A1C24] transition cursor-pointer"
            title={collapsed ? 'Expand sidebar' : 'Collapse sidebar'}
          >
            {collapsed ? <ChevronRight className="w-4 h-4" /> : <ChevronLeft className="w-4 h-4" />}
          </button>
        )}
      </div>

      {/* Navigation Groups */}
      <nav className="flex-1 p-2.5 space-y-5 overflow-y-auto">
        {navGroups.map((group, groupIdx) => (
          <div key={groupIdx} className="space-y-1">
            {!collapsed && (
              <div className="px-3 text-[11px] font-semibold text-slate-400 uppercase tracking-wider mb-1">
                {group.groupName}
              </div>
            )}
            <div className="space-y-0.5">
              {group.items.map((item) => {
                const isActive = activeTab === item.id;
                return (
                  <button
                    key={item.id}
                    onClick={() => setActiveTab(item.id)}
                    className={`w-full flex items-center gap-2.5 px-3 py-2 rounded-lg text-xs font-medium transition-colors relative cursor-pointer ${
                      isActive
                        ? 'bg-indigo-600/10 text-indigo-400'
                        : 'text-slate-400 hover:text-slate-200 hover:bg-white/[0.04]'
                    }`}
                    title={collapsed ? item.label : undefined}
                  >
                    {/* Active Indigo Left Indicator Bar */}
                    {isActive && (
                      <span className="absolute left-0 top-1.5 bottom-1.5 w-0.5 rounded-r bg-indigo-500" />
                    )}
                    <span className={isActive ? 'text-indigo-400' : 'text-slate-400'}>{item.icon}</span>
                    {!collapsed && <span className="flex-1 text-left truncate">{item.label}</span>}
                    {!collapsed && item.badge && (
                      <span className="text-[10px] px-1.5 py-0.2 rounded bg-[#1A1C24] border border-white/[0.08] text-slate-400">
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
        <div className="p-3.5 border-t border-white/[0.08] bg-[#0A0B0F] text-xs space-y-2">
          <div className="flex items-center justify-between text-xs text-slate-300">
            <span className="flex items-center gap-1.5 text-slate-400 text-[11px]">
              <Activity className="w-3.5 h-3.5 text-green-400" />
              <span>Engine Status</span>
            </span>
            <span className="text-green-400 bg-green-500/10 px-2 py-0.5 rounded border border-green-500/20 text-[10px] font-mono">
              ONLINE v2.0
            </span>
          </div>

          <div className="p-2.5 rounded-lg bg-[#121319] border border-white/[0.08] text-xs text-slate-300 flex items-start gap-2">
            <ShieldCheck className="w-3.5 h-3.5 text-slate-400 shrink-0 mt-0.5" />
            <div>
              <span className="font-semibold text-slate-300 text-[10px] uppercase tracking-wider block">
                DEMO ENVIRONMENT
              </span>
              <p className="text-[11px] text-slate-400 mt-0.5 leading-tight">
                Synthetic dataset for prototyping.
              </p>
            </div>
          </div>
        </div>
      )}
    </aside>
  );
};
