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
    { id: 'dashboard', label: 'Executive Overview', icon: <LayoutDashboard className="w-4 h-4 text-sky-400" />, description: 'High-level KPIs, demand landscape & top priorities', category: 'Views' },
    { id: 'demand', label: 'Demand Intelligence', icon: <Search className="w-4 h-4 text-blue-400" />, description: 'Multilingual citizen voices, time-series & momentum', category: 'Views' },
    { id: 'hotspots', label: 'Demand Hotspots', icon: <Flame className="w-4 h-4 text-amber-400" />, description: 'Per-capita normalized demand concentration', category: 'Views' },
    { id: 'gaps', label: 'Infrastructure Gaps', icon: <AlertCircle className="w-4 h-4 text-rose-400" />, description: 'Operational capacity deficit index vs population need', category: 'Views' },
    { id: 'recommendations', label: 'Priority Recommendations', icon: <FileCheck className="w-4 h-4 text-emerald-400" />, description: 'Ranked evidence-backed capital investment priorities', category: 'Views' },
    { id: 'evidence', label: 'Evidence Explorer', icon: <Network className="w-4 h-4 text-indigo-400" />, description: 'Granular evidence nodes and 6-step evidence trails', category: 'Views' },
    { id: 'scenarios', label: 'Scenario Lab', icon: <TestTube2 className="w-4 h-4 text-violet-400" />, description: 'Counterfactual policy simulations & score deltas', category: 'Tools' },
    { id: 'data', label: 'Data Explorer', icon: <Database className="w-4 h-4 text-slate-300" />, description: 'Synthetic demonstration datasets & live request test', category: 'Data' },
  ];

  const filtered = items.filter(
    (item) =>
      item.label.toLowerCase().includes(query.toLowerCase()) ||
      item.description.toLowerCase().includes(query.toLowerCase())
  );

  return (
    <div className="fixed inset-0 z-50 flex items-start justify-center pt-20 bg-slate-950/85 backdrop-blur-md p-4">
      <div className="w-full max-w-2xl bg-slate-900 border border-slate-700 rounded-2xl shadow-2xl overflow-hidden flex flex-col animate-in fade-in zoom-in-95 duration-150">
        <div className="flex items-center px-5 border-b border-slate-800 bg-slate-950">
          <Search className="w-5 h-5 text-sky-400 mr-3 shrink-0" />
          <input
            type="text"
            placeholder="Type a command, search views or region..."
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            className="w-full py-4.5 bg-transparent text-slate-100 placeholder-slate-400 text-sm font-semibold focus:outline-none font-sans"
            autoFocus
          />
          <button
            onClick={onClose}
            className="p-1.5 rounded-lg text-slate-300 hover:text-white hover:bg-slate-800 transition"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <div className="max-h-96 overflow-y-auto p-3">
          {filtered.length === 0 ? (
            <div className="p-8 text-center text-xs font-bold text-slate-400">
              No matching views or commands found for "{query}".
            </div>
          ) : (
            <div className="space-y-2">
              {filtered.map((item) => (
                <button
                  key={item.id}
                  onClick={() => {
                    onSelectTab(item.id);
                    onClose();
                  }}
                  className="w-full flex items-center justify-between p-3.5 rounded-xl text-left hover:bg-slate-800 transition group"
                >
                  <div className="flex items-center gap-3.5">
                    <div className="p-2.5 rounded-lg bg-slate-950 border border-slate-800 shadow-sm">
                      {item.icon}
                    </div>
                    <div>
                      <div className="text-sm font-bold text-slate-100 group-hover:text-sky-300 transition">
                        {item.label}
                      </div>
                      <div className="text-xs text-slate-300 font-medium">{item.description}</div>
                    </div>
                  </div>
                  <div className="flex items-center text-xs font-bold text-slate-300 group-hover:text-white font-mono">
                    <span className="mr-1">Jump</span>
                    <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                  </div>
                </button>
              ))}
            </div>
          )}
        </div>

        <div className="px-5 py-3 bg-slate-950 border-t border-slate-800 flex items-center justify-between text-xs text-slate-300 font-mono font-bold">
          <div className="flex items-center gap-2">
            <span className="px-2 py-0.5 rounded bg-slate-800 border border-slate-700 text-slate-100">↑↓</span>
            <span>Navigate</span>
            <span className="px-2 py-0.5 rounded bg-slate-800 border border-slate-700 text-slate-100">ESC</span>
            <span>Close</span>
          </div>
          <div>CivicPulse AI Command System</div>
        </div>
      </div>
    </div>
  );
};
