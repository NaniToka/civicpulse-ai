import React from 'react';
import {
  LayoutDashboard,
  MapPin,
  FileCheck,
  MessageSquareText,
  SlidersHorizontal,
  BookOpen
} from 'lucide-react';

export type NavTab = 'dashboard' | 'hotspots' | 'recommendations' | 'feedback' | 'scenarios';

interface SidebarProps {
  activeTab: NavTab;
  setActiveTab: (tab: NavTab) => void;
}

export const Sidebar: React.FC<SidebarProps> = ({ activeTab, setActiveTab }) => {
  const navItems: { id: NavTab; label: string; icon: React.FC<{ className?: string }> }[] = [
    { id: 'dashboard', label: 'Executive Cockpit', icon: LayoutDashboard },
    { id: 'hotspots', label: 'Demand Hotspots', icon: MapPin },
    { id: 'recommendations', label: 'Priority Recommendations', icon: FileCheck },
    { id: 'feedback', label: 'Multilingual Feed', icon: MessageSquareText },
    { id: 'scenarios', label: 'What-If Simulations', icon: SlidersHorizontal },
  ];

  return (
    <aside className="w-64 bg-civic-900 border-r border-civic-800 flex flex-col justify-between py-4 px-3 h-[calc(100vh-4rem)] sticky top-16">
      <div className="space-y-1">
        <div className="px-3 py-2 text-xs font-semibold text-civic-400 uppercase tracking-wider">
          Decision Intelligence
        </div>
        {navItems.map((item) => {
          const Icon = item.icon;
          const isActive = activeTab === item.id;
          return (
            <button
              key={item.id}
              onClick={() => setActiveTab(item.id)}
              className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-md text-sm font-medium transition-colors ${
                isActive
                  ? 'bg-civic-800 text-accent-blue border-l-2 border-accent-blue'
                  : 'text-civic-400 hover:text-civic-200 hover:bg-civic-800/50'
              }`}
            >
              <Icon className={`w-4 h-4 ${isActive ? 'text-accent-blue' : 'text-civic-400'}`} />
              <span>{item.label}</span>
            </button>
          );
        })}
      </div>

      <div className="p-3 bg-civic-950/80 border border-civic-800 rounded-lg">
        <div className="flex items-center gap-2 text-xs text-civic-400 font-medium mb-1">
          <BookOpen className="w-3.5 h-3.5 text-accent-violet" />
          <span>Explainable AI Engine</span>
        </div>
        <p className="text-[11px] text-civic-400 leading-snug">
          Prioritization scores are calculated using transparent, reproducible rules.
        </p>
      </div>
    </aside>
  );
};
