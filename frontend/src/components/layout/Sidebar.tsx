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
        { id: 'dashboard', label: 'Dashboard Overview', icon: <LayoutDashboard className="w-4 h-4 text-indigo-400" /> },
        { id: 'copilot', label: 'Ask AI Assistant', icon: <Sparkles className="w-4 h-4 text-purple-400" />, badge: 'AI' },
        { id: 'demand', label: 'Citizen Complaints', icon: <Search className="w-4 h-4 text-cyan-400" /> },
        { id: 'feedback', label: 'Community Wall', icon: <MessageSquare className="w-4 h-4 text-emerald-400" />, badge: 'Emojis' },
        { id: 'hotspots', label: 'Problem Hotspots', icon: <Flame className="w-4 h-4 text-rose-400" /> },
      ],
    },
    {
      groupName: 'PRIORITIES & BUDGET',
      items: [
        { id: 'gaps', label: 'Facility Shortfalls', icon: <AlertCircle className="w-4 h-4 text-amber-400" /> },
        { id: 'recommendations', label: 'Top Priority Projects', icon: <FileCheck className="w-4 h-4 text-green-400" />, badge: 'Ranked' },
        { id: 'evidence', label: 'Proof & Evidence', icon: <Network className="w-4 h-4 text-sky-400" /> },
        { id: 'scenarios', label: 'Budget Simulator', icon: <TestTube2 className="w-4 h-4 text-fuchsia-400" />, badge: 'Planner' },
      ],
    },
    {
      groupName: 'ALL DATA & REPORTS',
      items: [{ id: 'data', label: 'Submit & Explore Data', icon: <Database className="w-4 h-4 text-teal-400" /> }],
    },
  ];

  return (
    <aside
      className={`hidden md:flex bg-[#10121C] border-r border-white/[0.12] flex-col transition-all duration-200 select-none shadow-xl ${
        collapsed ? 'w-16' : 'w-60'
      }`}
    >
      {/* Sidebar Header Toggle */}
      <div className="p-3.5 border-b border-white/[0.10] bg-[#141624]/80 flex items-center justify-between">
        {!collapsed && (
          <div className="flex items-center gap-2">
            <Compass className="w-4 h-4 text-indigo-400 font-bold" />
            <span className="text-[11px] font-bold tracking-wider text-slate-200 uppercase font-mono">
              Navigation
            </span>
          </div>
        )}
        {onToggleCollapse && (
          <button
            onClick={onToggleCollapse}
            className="p-1 rounded-lg text-slate-300 hover:text-white hover:bg-white/[0.08] transition cursor-pointer"
            title={collapsed ? 'Expand sidebar' : 'Collapse sidebar'}
          >
            {collapsed ? <ChevronRight className="w-4 h-4" /> : <ChevronLeft className="w-4 h-4" />}
          </button>
        )}
      </div>

      {/* Navigation Groups */}
      <nav className="flex-1 p-2.5 space-y-5 overflow-y-auto bg-[#10121C]">
        {navGroups.map((group, groupIdx) => (
          <div key={groupIdx} className="space-y-1">
            {!collapsed && (
              <div className="px-3 text-[11px] font-bold text-indigo-200/80 uppercase tracking-wider mb-1.5">
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
                        ? 'bg-gradient-to-r from-indigo-600 via-indigo-600/75 to-indigo-950/20 text-white border border-indigo-400/60 shadow-md shadow-indigo-600/25'
                        : 'text-slate-200 hover:text-white hover:bg-white/[0.08]'
                    }`}
                    title={collapsed ? item.label : undefined}
                  >
                    {/* Left Side Full Solid Color Pill */}
                    {isActive && (
                      <span className="absolute left-0 top-0 bottom-0 w-1.5 bg-indigo-400 shadow-[0_0_12px_rgba(129,140,248,1)]" />
                    )}
                    <span className={isActive ? 'text-white font-bold drop-shadow-sm ml-0.5' : 'text-slate-300 group-hover:text-white'}>
                      {item.icon}
                    </span>
                    {!collapsed && <span className="flex-1 text-left truncate font-bold text-xs">{item.label}</span>}
                    {!collapsed && item.badge && (
                      <span
                        className={`text-[10px] px-1.5 py-0.5 rounded font-bold font-mono ${
                          isActive
                            ? 'bg-indigo-700 text-white border border-indigo-400/60 shadow-xs'
                            : 'bg-[#191B28] border border-white/[0.15] text-slate-200'
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
        <div className="p-3.5 border-t border-white/[0.10] bg-[#0C0D14] text-xs space-y-2">
          <div className="flex items-center justify-between text-xs text-slate-200">
            <span className="flex items-center gap-1.5 text-slate-200 text-[11px] font-bold">
              <Activity className="w-3.5 h-3.5 text-emerald-400" />
              <span className="font-bold">Engine Status</span>
            </span>
            <span className="text-emerald-300 bg-emerald-500/15 px-2 py-0.5 rounded border border-emerald-500/30 text-[10px] font-mono font-bold">
              ONLINE v2.0
            </span>
          </div>

          <div className="p-2.5 rounded-lg bg-[#141624] border border-white/[0.10] text-xs text-slate-200 flex items-start gap-2 shadow-xs">
            <ShieldCheck className="w-3.5 h-3.5 text-slate-300 shrink-0 mt-0.5" />
            <div>
              <span className="font-bold text-slate-100 text-[10px] uppercase tracking-wider block">
                DEMO ENVIRONMENT
              </span>
              <p className="text-[11px] text-slate-300 font-medium mt-0.5 leading-tight">
                Synthetic dataset for prototyping.
              </p>
            </div>
          </div>
        </div>
      )}
    </aside>
  );
};
