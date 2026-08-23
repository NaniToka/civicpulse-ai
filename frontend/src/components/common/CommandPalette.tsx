import React, { useEffect, useState } from 'react';
import { Search, LayoutDashboard, Flame, AlertCircle, FileCheck, Network, TestTube2, Database, ArrowRight, X, Sparkles, MessageSquare } from 'lucide-react';
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
    { id: 'dashboard', label: 'Dashboard Overview', icon: <LayoutDashboard className="w-4 h-4 text-indigo-400" />, description: 'Summary of citizen complaints, shortfalls & priority needs', category: 'Views' },
    { id: 'copilot', label: 'Ask AI Assistant', icon: <Sparkles className="w-4 h-4 text-indigo-400" />, description: 'Ask questions to AI assistant & get grounded evidence answers', category: 'AI Assistant' },
    { id: 'demand', label: 'Citizen Complaints', icon: <Search className="w-4 h-4 text-indigo-400" />, description: 'Multilingual citizen requests & growing demand trends', category: 'Views' },
    { id: 'feedback', label: 'Community Wall', icon: <MessageSquare className="w-4 h-4 text-indigo-400" />, description: 'Public citizen comments, feedback & community votes', category: 'Views' },
    { id: 'hotspots', label: 'Problem Hotspots', icon: <Flame className="w-4 h-4 text-amber-400" />, description: 'Map of high-urgency problem concentration areas', category: 'Views' },
    { id: 'gaps', label: 'Facility Shortfalls', icon: <AlertCircle className="w-4 h-4 text-red-400" />, description: 'Missing facilities & capacity shortfalls by district', category: 'Views' },
    { id: 'recommendations', label: 'Top Priority Projects', icon: <FileCheck className="w-4 h-4 text-green-400" />, description: 'Ranked priority projects recommended for government funding', category: 'Views' },
    { id: 'evidence', label: 'Proof & Evidence', icon: <Network className="w-4 h-4 text-indigo-400" />, description: 'Step-by-step evidence trail explaining priority rankings', category: 'Views' },
    { id: 'scenarios', label: 'Budget Simulator', icon: <TestTube2 className="w-4 h-4 text-indigo-400" />, description: 'Simulate budget allocation impacts & beneficiary counts', category: 'Tools' },
    { id: 'data', label: 'Submit & Explore Data', icon: <Database className="w-4 h-4 text-slate-400" />, description: 'Submit new complaints & inspect platform datasets', category: 'Data' },
  ];

  const filtered = items.filter(
    (item) =>
      item.label.toLowerCase().includes(query.toLowerCase()) ||
      item.description.toLowerCase().includes(query.toLowerCase())
  );

  return (
    <div className="fixed inset-0 z-50 flex items-start justify-center pt-20 bg-[#000000]/80 backdrop-blur-sm p-4">
      <div className="w-full max-w-2xl bg-[#0A0A0C] border border-white/[0.08] rounded-xl shadow-2xl overflow-hidden flex flex-col animate-in fade-in zoom-in-95 duration-150">
        <div className="flex items-center px-4 border-b border-white/[0.08] bg-[#121215]">
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
            className="p-1 rounded-lg text-slate-400 hover:text-white hover:bg-[#0A0A0C] transition cursor-pointer"
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
                  className="w-full flex items-center justify-between p-3 rounded-lg text-left hover:bg-[#121215] transition-colors group cursor-pointer"
                >
                  <div className="flex items-center gap-3">
                    <div className="p-2 rounded-md bg-[#000000] border border-white/[0.08]">
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

        <div className="px-4 py-2.5 bg-[#000000] border-t border-white/[0.08] flex items-center justify-between text-[11px] text-slate-400">
          <div className="flex items-center gap-2">
            <kbd className="px-1.5 py-0.5 rounded bg-[#121215] border border-white/[0.08] text-slate-300 font-mono">ESC</kbd>
            <span>Close</span>
          </div>
          <div className="font-mono text-[10px]">CivicPulse AI Command System</div>
        </div>
      </div>
    </div>
  );
};
