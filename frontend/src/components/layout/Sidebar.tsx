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
  Sparkles,
} from 'lucide-react';

export type NavTab =
  | 'dashboard'
  | 'copilot'
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
      groupName: 'COMMUNITY VOICES & AI',
      items: [
        { id: 'dashboard', label: 'Dashboard Overview', icon: <LayoutDashboard className="w-4 h-4 text-indigo-600" /> },
        { id: 'copilot', label: 'Ask AI Assistant', icon: <Sparkles className="w-4 h-4 text-purple-600" />, badge: 'AI' },
        { id: 'demand', label: 'Citizen Complaints', icon: <Search className="w-4 h-4 text-cyan-600" /> },
        { id: 'feedback', label: 'Community Wall', icon: <MessageSquare className="w-4 h-4 text-emerald-600" />, badge: 'Emojis' },
        { id: 'hotspots', label: 'Problem Hotspots', icon: <Flame className="w-4 h-4 text-rose-600" /> },
      ],
    },
    {
      groupName: 'PRIORITIES & BUDGET',
      items: [
        { id: 'gaps', label: 'Facility Shortfalls', icon: <AlertCircle className="w-4 h-4 text-amber-600" /> },
        { id: 'recommendations', label: 'Top Priority Projects', icon: <FileCheck className="w-4 h-4 text-green-600" />, badge: 'Ranked' },
        { id: 'evidence', label: 'Proof & Evidence', icon: <Network className="w-4 h-4 text-sky-600" /> },
        { id: 'scenarios', label: 'Budget Simulator', icon: <TestTube2 className="w-4 h-4 text-fuchsia-600" />, badge: 'Planner' },
      ],
    },
    {
      groupName: 'ALL DATA & REPORTS',
      items: [{ id: 'data', label: 'Submit & Explore Data', icon: <Database className="w-4 h-4 text-teal-600" /> }],
    },
  ];

  return (
    <aside
      className={`hidden md:flex bg-white text-slate-900 border-r border-slate-200 flex-col transition-all duration-200 select-none shadow-xs ${
        collapsed ? 'w-16' : 'w-60'
      }`}
    >
      {/* Sidebar Header Toggle */}
      <div className="p-3.5 border-b border-slate-200 bg-slate-50 flex items-center justify-between">
        {!collapsed && (
          <div className="flex items-center gap-2">
            <Compass className="w-4 h-4 text-indigo-600 font-bold" />
            <span className="text-[11px] font-bold tracking-wider text-slate-900 uppercase font-mono">
              Navigation
            </span>
          </div>
        )}
        {onToggleCollapse && (
          <button
            onClick={onToggleCollapse}
            className="p-1 rounded-lg text-slate-600 hover:text-slate-950 hover:bg-slate-200 transition cursor-pointer"
            title={collapsed ? 'Expand sidebar' : 'Collapse sidebar'}
          >
            {collapsed ? <ChevronRight className="w-4 h-4" /> : <ChevronLeft className="w-4 h-4" />}
          </button>
        )}
      </div>

      {/* Navigation Groups */}
      <nav className="flex-1 p-2.5 space-y-5 overflow-y-auto bg-white">
        {navGroups.map((group, groupIdx) => (
          <div key={groupIdx} className="space-y-1">
            {!collapsed && (
              <div className="px-3 text-[11px] font-bold text-slate-700 uppercase tracking-wider mb-1.5">
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
                    className={`w-full flex items-center gap-2.5 px-3 py-2 rounded-lg text-xs font-bold transition-all relative cursor-pointer group overflow-hidden ${
                      isActive
                        ? 'bg-gradient-to-r from-indigo-600 via-indigo-600 to-indigo-700 text-white shadow-sm font-bold'
                        : 'text-slate-800 hover:text-slate-950 hover:bg-slate-100 font-bold'
                    }`}
                    title={collapsed ? item.label : undefined}
                  >
                    {/* Left Side Active Accent Bar */}
                    {isActive && (
                      <span className="absolute left-0 top-0 bottom-0 w-1.5 bg-indigo-400 rounded-l shadow-sm" />
                    )}
                    <span className={isActive ? 'text-white font-bold ml-0.5' : 'text-slate-700 font-bold group-hover:text-slate-950'}>
                      {item.icon}
                    </span>
                    {!collapsed && <span className="flex-1 text-left truncate font-bold text-xs">{item.label}</span>}
                    {!collapsed && item.badge && (
                      <span
                        className={`text-[10px] px-1.5 py-0.5 rounded font-bold font-mono ${
                          isActive
                            ? 'bg-indigo-800 text-white border border-indigo-500 shadow-xs'
                            : 'bg-slate-100 border border-slate-300 text-slate-700'
                        }`}
                      >
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
        <div className="p-3.5 border-t border-slate-200 bg-slate-50 text-xs space-y-2">
          <div className="flex items-center justify-between text-xs text-slate-800">
            <span className="flex items-center gap-1.5 text-slate-700 text-[11px] font-bold">
              <Activity className="w-3.5 h-3.5 text-emerald-600 font-bold" />
              <span className="font-bold">Engine Status</span>
            </span>
            <span className="text-emerald-700 bg-emerald-100 px-2 py-0.5 rounded border border-emerald-300 text-[10px] font-mono font-bold">
              ONLINE v2.0
            </span>
          </div>

          <div className="p-2.5 rounded-lg bg-white border border-slate-200 text-xs text-slate-700 flex items-start gap-2 shadow-xs">
            <ShieldCheck className="w-3.5 h-3.5 text-slate-600 shrink-0 mt-0.5" />
            <div>
              <span className="font-bold text-slate-900 text-[10px] uppercase tracking-wider block">
                DEMO ENVIRONMENT
              </span>
              <p className="text-[11px] text-slate-600 font-semibold mt-0.5 leading-tight">
                Synthetic dataset for prototyping.
              </p>
            </div>
          </div>
        </div>
      )}
    </aside>
  );
};
