import React, { useState } from 'react';
import {
  Command,
  ShieldAlert,
  Sparkles,
  Menu,
  X,
  Compass,
  LayoutDashboard,
  Search,
  Flame,
  AlertCircle,
  FileCheck,
  Network,
  TestTube2,
  Database,
  MessageSquare,
} from 'lucide-react';
import { NavTab } from './Sidebar';

interface NavbarProps {
  onOpenCommandPalette?: () => void;
  activeTab?: NavTab;
  setActiveTab?: (tab: NavTab) => void;
}

export const Navbar: React.FC<NavbarProps> = ({
  onOpenCommandPalette,
  activeTab = 'dashboard',
  setActiveTab,
}) => {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const navItems: { id: NavTab; label: string; icon: React.ReactNode; desc: string }[] = [
    { id: 'dashboard', label: 'Executive Overview', icon: <LayoutDashboard className="w-4 h-4" />, desc: 'BRICS Civic Decision Cockpit' },
    { id: 'demand', label: 'Demand Intelligence', icon: <Search className="w-4 h-4" />, desc: 'Multilingual Voices & Momentum' },
    { id: 'feedback', label: 'Citizen Comments & Emojis', icon: <MessageSquare className="w-4 h-4" />, desc: 'Community Feedback Wall' },
    { id: 'hotspots', label: 'Demand Hotspots', icon: <Flame className="w-4 h-4" />, desc: 'Per-Capita Risk Heatmaps' },
    { id: 'gaps', label: 'Infrastructure Gaps', icon: <AlertCircle className="w-4 h-4" />, desc: 'Shortfall Deficit Matrix' },
    { id: 'recommendations', label: 'Recommendations', icon: <FileCheck className="w-4 h-4" />, desc: 'Ranked Policy Priorities' },
    { id: 'evidence', label: 'Evidence Explorer', icon: <Network className="w-4 h-4" />, desc: 'Traceable Audit Trail' },
    { id: 'scenarios', label: 'Scenario Lab', icon: <TestTube2 className="w-4 h-4" />, desc: 'Policy Simulator & ROI' },
    { id: 'data', label: 'Data Explorer', icon: <Database className="w-4 h-4" />, desc: 'Raw Signals & Datasets' },
  ];

  const handleSelectTab = (tab: NavTab) => {
    if (setActiveTab) setActiveTab(tab);
    setMobileMenuOpen(false);
  };

  return (
    <>
      <header className="h-14 bg-[#000000] border-b border-white/[0.08] px-3 sm:px-6 flex items-center justify-between z-40 sticky top-0 shadow-sm">
        {/* Brand Identity & Mobile Menu Toggle */}
        <div className="flex items-center gap-3">
          {/* Mobile Hamburger Toggle Button */}
          <button
            onClick={() => setMobileMenuOpen(true)}
            className="md:hidden p-1.5 rounded-lg bg-[#0A0A0C] border border-white/[0.08] text-slate-300 hover:text-white transition cursor-pointer flex items-center justify-center shrink-0"
            title="Open Mobile Navigation Menu"
          >
            <Menu className="w-5 h-5" />
          </button>

          <div className="w-7 h-7 rounded-lg bg-indigo-600/20 border border-indigo-500/30 flex items-center justify-center text-indigo-400 shrink-0">
            <Sparkles className="w-3.5 h-3.5" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h1 className="text-sm sm:text-base font-semibold tracking-tight text-slate-100">
                CivicPulse <span className="text-indigo-400 font-semibold">AI</span>
              </h1>
              <span className="text-[10px] font-mono font-medium px-1.5 py-0.2 rounded bg-indigo-500/10 text-indigo-400 border border-indigo-500/20 shrink-0">
                v2.0
              </span>
            </div>
          </div>
        </div>

        {/* Right Controls: Command Palette & Demo Disclaimer */}
        <div className="flex items-center gap-2 sm:gap-3">
          {/* Live Status Pill */}
          <div className="hidden xl:flex items-center gap-2 px-2.5 py-1 rounded-lg bg-[#0A0A0C] border border-white/[0.08] text-xs text-slate-300">
            <span className="w-1.5 h-1.5 rounded-full bg-green-500" />
            <span className="text-[11px] font-medium text-slate-400">7 Languages Active</span>
          </div>

          {/* Command Palette Trigger */}
          <button
            onClick={onOpenCommandPalette}
            className="flex items-center gap-2 px-3 py-1.5 rounded-lg bg-[#0A0A0C] border border-white/[0.08] text-xs text-slate-300 hover:text-white hover:border-white/[0.16] transition cursor-pointer"
          >
            <Command className="w-3.5 h-3.5 text-slate-400 shrink-0" />
            <span className="hidden sm:inline text-xs text-slate-400">Search...</span>
            <kbd className="hidden sm:inline-flex items-center px-1.5 py-0.5 rounded bg-[#000000] border border-white/[0.08] text-[10px] font-mono text-slate-400">
              ⌘K
            </kbd>
          </button>

          {/* Demo Synthetic Data Badge */}
          <div className="flex items-center gap-1.5 px-2.5 py-1 rounded-lg bg-amber-500/10 border border-amber-500/20 text-xs text-amber-400 font-medium shrink-0">
            <ShieldAlert className="w-3.5 h-3.5 text-amber-400 shrink-0" />
            <span className="hidden lg:inline text-[11px] tracking-wide">DEMO DATA</span>
            <span className="lg:hidden text-[10px]">DEMO</span>
          </div>
        </div>
      </header>

      {/* Full-Screen Mobile Navigation Overlay Modal */}
      {mobileMenuOpen && (
        <div className="md:hidden fixed inset-0 z-50 bg-[#000000] flex flex-col p-4 sm:p-6 overflow-y-auto">
          {/* Mobile Drawer Top Bar */}
          <div className="flex items-center justify-between border-b border-white/[0.08] pb-4 mb-4">
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 rounded-lg bg-indigo-600/20 border border-indigo-500/30 flex items-center justify-center shrink-0">
                <Compass className="w-4 h-4 text-indigo-400" />
              </div>
              <div>
                <span className="text-xs font-semibold text-slate-100 uppercase tracking-wider block">
                  CivicPulse AI Navigation
                </span>
                <span className="text-[11px] text-slate-400">
                  Select a section to navigate
                </span>
              </div>
            </div>

            <button
              onClick={() => setMobileMenuOpen(false)}
              className="p-2 rounded-lg bg-[#0A0A0C] border border-white/[0.08] text-slate-300 hover:text-white transition cursor-pointer flex items-center gap-1 text-xs shrink-0"
            >
              <X className="w-4 h-4 text-slate-400" />
              <span className="hidden xs:inline">Close</span>
            </button>
          </div>

          {/* Navigation Items List */}
          <div className="flex-1 space-y-2 pb-6">
            {navItems.map((item) => {
              const isActive = activeTab === item.id;
              return (
                <button
                  key={item.id}
                  onClick={() => handleSelectTab(item.id)}
                  className={`w-full flex items-center justify-between p-3 rounded-lg text-left transition-colors cursor-pointer ${
                    isActive
                      ? 'bg-indigo-600/10 text-indigo-400 border border-indigo-500/30'
                      : 'bg-[#0A0A0C] text-slate-300 hover:bg-[#121215] hover:text-white border border-white/[0.08]'
                  }`}
                >
                  <div className="flex items-center gap-3 min-w-0">
                    <div
                      className={`p-2 rounded-md shrink-0 ${
                        isActive
                          ? 'bg-indigo-600/20 text-indigo-400'
                          : 'bg-[#121215] text-slate-400'
                      }`}
                    >
                      {item.icon}
                    </div>
                    <div className="min-w-0">
                      <div className="text-xs font-semibold text-slate-100 truncate">
                        {item.label}
                      </div>
                      <div className="text-[11px] text-slate-400 truncate mt-0.5">
                        {item.desc}
                      </div>
                    </div>
                  </div>

                  {isActive && (
                    <span className="text-[10px] font-semibold px-2 py-0.5 rounded bg-indigo-500/20 text-indigo-400 border border-indigo-500/30 shrink-0 ml-2">
                      ACTIVE
                    </span>
                  )}
                </button>
              );
            })}
          </div>

          {/* Drawer Footer */}
          <div className="pt-4 border-t border-white/[0.08] flex items-center justify-between text-[11px] text-slate-400">
            <span>CivicPulse AI v2.0</span>
            <span className="text-green-400 font-medium">● System Online</span>
          </div>
        </div>
      )}
    </>
  );
};
