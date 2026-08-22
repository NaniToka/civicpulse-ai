import React, { useEffect, useState } from 'react';
import { Search, LayoutDashboard, Flame, AlertCircle, FileCheck, Network, TestTube2, Database, ArrowRight, X } from 'lucide-react';
import { NavTab } from '../layout/Sidebar';

interface CommandPaletteProps {
  isOpen: boolean;
  onClose: () => void;
  onSelectTab: (tab: NavTab) => void;
}

export const CommandPalette: React.FC<CommandPaletteProps> = ({ isOpen, onClose, onSelectTab }) => {
  const [query, setQuery] = useState('');

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key === 'k') {
        e.preventDefault();
        if (isOpen) onClose();
      }
      if (e.key === 'Escape' && isOpen) {
        onClose();
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  const items: { id: NavTab; label: string; icon: React.ReactNode; description: string; category: string }[] = [
    { id: 'dashboard', label: 'Executive Overview', icon: <LayoutDashboard className="w-4 h-4 text-indigo-400" />, description: 'High-level KPIs, demand landscape & top priorities', category: 'Views' },
    { id: 'demand', label: 'Demand Intelligence', icon: <Search className="w-4 h-4 text-indigo-400" />, description: 'Multilingual citizen voices, time-series & momentum', category: 'Views' },
    { id: 'hotspots', label: 'Demand Hotspots', icon: <Flame className="w-4 h-4 text-amber-400" />, description: 'Per-capita normalized demand concentration', category: 'Views' },
    { id: 'gaps', label: 'Infrastructure Gaps', icon: <AlertCircle className="w-4 h-4 text-red-400" />, description: 'Operational capacity deficit index vs population need', category: 'Views' },
    { id: 'recommendations', label: 'Priority Recommendations', icon: <FileCheck className="w-4 h-4 text-green-400" />, description: 'Ranked evidence-backed capital investment priorities', category: 'Views' },
    { id: 'evidence', label: 'Evidence Explorer', icon: <Network className="w-4 h-4 text-indigo-400" />, description: 'Granular evidence nodes and 6-step evidence trails', category: 'Views' },
    { id: 'scenarios', label: 'Scenario Lab', icon: <TestTube2 className="w-4 h-4 text-indigo-400" />, description: 'Counterfactual policy simulations & score deltas', category: 'Tools' },
    { id: 'data', label: 'Data Explorer', icon: <Database className="w-4 h-4 text-slate-400" />, description: 'Synthetic demonstration datasets & live request test', category: 'Data' },
  ];

  const filtered = items.filter(
    (item) =>
      item.label.toLowerCase().includes(query.toLowerCase()) ||
      item.description.toLowerCase().includes(query.toLowerCase())
  );

  return (
    <div className="fixed inset-0 z-50 flex items-start justify-center pt-20 bg-[#0A0B0F]/80 backdrop-blur-sm p-4">
      <div className="w-full max-w-2xl bg-[#121319] border border-white/[0.08] rounded-xl shadow-2xl overflow-hidden flex flex-col animate-in fade-in zoom-in-95 duration-150">
        <div className="flex items-center px-4 border-b border-white/[0.08] bg-[#1A1C24]">
          <Search className="w-4 h-4 text-indigo-400 mr-3 shrink-0" />
          <input
            type="text"
            placeholder="Type a command or search views..."
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            className="w-full py-3.5 bg-transparent text-slate-100 placeholder-slate-400 text-sm font-medium focus:outline-none"
            autoFocus
          />
          <button
            onClick={onClose}
            className="p-1 rounded-lg text-slate-400 hover:text-white hover:bg-[#121319] transition cursor-pointer"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        <div className="max-h-96 overflow-y-auto p-2">
          {filtered.length === 0 ? (
            <div className="p-8 text-center text-xs text-slate-400">
              No matching views or commands found for "{query}".
            </div>
          ) : (
            <div className="space-y-1">
              {filtered.map((item) => (
                <button
                  key={item.id}
                  onClick={() => {
                    onSelectTab(item.id);
                    onClose();
                  }}
                  className="w-full flex items-center justify-between p-3 rounded-lg text-left hover:bg-[#1A1C24] transition-colors group cursor-pointer"
                >
                  <div className="flex items-center gap-3">
                    <div className="p-2 rounded-md bg-[#0A0B0F] border border-white/[0.08]">
                      {item.icon}
                    </div>
                    <div>
                      <div className="text-xs font-semibold text-slate-100 group-hover:text-indigo-400 transition-colors">
                        {item.label}
                      </div>
                      <div className="text-[11px] text-slate-400 mt-0.5">{item.description}</div>
                    </div>
                  </div>
                  <div className="flex items-center text-xs text-slate-400 group-hover:text-slate-200">
                    <span className="mr-1 text-[11px]">Jump</span>
                    <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-1 transition-transform" />
                  </div>
                </button>
              ))}
            </div>
          )}
        </div>

        <div className="px-4 py-2.5 bg-[#0A0B0F] border-t border-white/[0.08] flex items-center justify-between text-[11px] text-slate-400">
          <div className="flex items-center gap-2">
            <kbd className="px-1.5 py-0.5 rounded bg-[#1A1C24] border border-white/[0.08] text-slate-300 font-mono">ESC</kbd>
            <span>Close</span>
          </div>
          <div className="font-mono text-[10px]">CivicPulse AI Command System</div>
        </div>
      </div>
    </div>
  );
};
