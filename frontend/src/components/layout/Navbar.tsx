import React, { useState } from 'react';
import {
  Command,
  ShieldAlert,
  Sparkles,
  Activity,
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
      <header className="h-16 bg-[#070b14]/95 backdrop-blur-2xl border-b border-slate-800/80 px-3 sm:px-6 flex items-center justify-between z-40 sticky top-0 shadow-2xl">
        {/* Brand Identity & Mobile Menu Toggle */}
        <div className="flex items-center gap-2.5 sm:gap-3">
          {/* Mobile Hamburger Toggle Button */}
          <button
            onClick={() => setMobileMenuOpen(true)}
            className="md:hidden p-2 rounded-xl bg-slate-900 border border-slate-700 text-cyan-400 hover:text-white transition cursor-pointer flex items-center justify-center shrink-0"
            title="Open Mobile Navigation Menu"
          >
            <Menu className="w-5 h-5" />
          </button>

          <div className="w-9 h-9 rounded-xl bg-gradient-to-tr from-cyan-500 via-indigo-500 to-emerald-400 p-0.5 shadow-lg glow-cyan shrink-0">
            <div className="w-full h-full bg-[#070b14] rounded-[10px] flex items-center justify-center">
              <Sparkles className="w-4 h-4 text-cyan-400 animate-pulse" />
            </div>
          </div>
          <div>
            <div className="flex items-center gap-1.5 sm:gap-2">
              <h1 className="text-sm sm:text-lg font-extrabold tracking-tight text-slate-100 font-mono">
                CivicPulse <span className="gradient-text-cyan font-extrabold">AI</span>
              </h1>
              <span className="text-[9px] sm:text-[10px] font-mono font-extrabold px-1.5 py-0.5 rounded bg-cyan-950/80 text-cyan-300 border border-cyan-700/80 shadow-sm shrink-0">
                V2.0
              </span>
            </div>
            <p className="text-[11px] text-slate-400 font-bold hidden sm:block">
              Multilingual Citizen Demand & Infrastructure Prioritization
            </p>
          </div>
        </div>

        {/* Right Controls: Command Palette & Demo Disclaimer */}
        <div className="flex items-center gap-2 sm:gap-3">
          {/* Live Status Pill */}
          <div className="hidden xl:flex items-center gap-2 px-3 py-1.5 rounded-xl bg-slate-900/80 border border-slate-800 text-xs font-mono text-slate-300">
            <Activity className="w-3.5 h-3.5 text-emerald-400" />
            <span>7 LANGUAGES ACTIVE</span>
          </div>

          {/* Command Palette Trigger */}
          <button
            onClick={onOpenCommandPalette}
            className="flex items-center gap-2 px-2.5 sm:px-3.5 py-1.5 rounded-xl bg-slate-900/90 border border-slate-700/80 text-xs font-bold text-slate-200 hover:text-white hover:border-cyan-400 transition shadow-md cursor-pointer"
          >
            <Command className="w-4 h-4 text-cyan-400 shrink-0" />
            <span className="hidden sm:inline font-mono">Search...</span>
            <kbd className="hidden sm:inline-flex items-center gap-0.5 px-1.5 py-0.5 rounded bg-slate-950 border border-slate-700 text-[10px] font-mono font-extrabold text-slate-300">
              ⌘K
            </kbd>
          </button>

          {/* Demo Synthetic Data Badge */}
          <div className="flex items-center gap-1.5 sm:gap-2 px-2 sm:px-3.5 py-1.5 rounded-xl bg-amber-950/80 border border-amber-600/80 text-[10px] sm:text-[11px] font-mono font-bold text-amber-200 shadow-md shrink-0">
            <ShieldAlert className="w-3.5 h-3.5 text-amber-400 shrink-0" />
            <span className="hidden lg:inline uppercase tracking-wider text-[11px]">DEMO ENVIRONMENT • SYNTHETIC DATA</span>
            <span className="lg:hidden">DEMO</span>
          </div>
        </div>
      </header>

      {/* 100% Full-Screen Mobile Navigation Overlay Modal */}
      {mobileMenuOpen && (
        <div className="md:hidden fixed inset-0 z-50 bg-[#070b14] flex flex-col p-4 sm:p-6 overflow-y-auto">
          {/* Mobile Drawer Top Bar */}
          <div className="flex items-center justify-between border-b border-slate-800 pb-4 mb-4">
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 rounded-xl bg-gradient-to-tr from-cyan-500 to-indigo-500 p-0.5 shrink-0">
                <div className="w-full h-full bg-[#070b14] rounded-[9px] flex items-center justify-center">
                  <Compass className="w-4 h-4 text-cyan-400" />
                </div>
              </div>
              <div>
                <span className="text-xs font-mono font-extrabold text-cyan-400 uppercase tracking-wider block">
                  CivicPulse AI Navigation
                </span>
                <span className="text-[10px] font-mono text-slate-400">
                  Select a section to switch view
                </span>
              </div>
            </div>

            <button
              onClick={() => setMobileMenuOpen(false)}
              className="p-2 rounded-xl bg-slate-900 border border-slate-700 text-slate-300 hover:text-white hover:border-cyan-400 transition cursor-pointer flex items-center gap-1 text-xs font-bold font-mono shrink-0"
            >
              <X className="w-5 h-5 text-cyan-400" />
              <span className="hidden xs:inline">Close</span>
            </button>
          </div>

          {/* Navigation Items List */}
          <div className="flex-1 space-y-2.5 pb-6">
            {navItems.map((item) => {
              const isActive = activeTab === item.id;
              return (
                <button
                  key={item.id}
                  onClick={() => handleSelectTab(item.id)}
                  className={`w-full flex items-center justify-between p-3.5 rounded-2xl text-left transition-all cursor-pointer ${
                    isActive
                      ? 'bg-gradient-to-r from-cyan-950 to-indigo-950 text-cyan-100 border-2 border-cyan-500 shadow-xl glow-cyan'
                      : 'bg-slate-900/90 text-slate-300 hover:bg-slate-800 hover:text-white border border-slate-800'
                  }`}
                >
                  <div className="flex items-center gap-3.5 min-w-0">
                    <div
                      className={`p-2.5 rounded-xl shrink-0 ${
                        isActive
                          ? 'bg-cyan-500/20 text-cyan-400 border border-cyan-500/40'
                          : 'bg-slate-950 text-slate-400 border border-slate-800'
                      }`}
                    >
                      {item.icon}
                    </div>
                    <div className="min-w-0">
                      <div className="text-xs font-extrabold font-mono tracking-tight text-slate-100 truncate">
                        {item.label}
                      </div>
                      <div className="text-[10px] font-medium text-slate-400 truncate mt-0.5">
                        {item.desc}
                      </div>
                    </div>
                  </div>

                  {isActive && (
                    <span className="text-[10px] font-mono font-extrabold px-2 py-0.5 rounded-full bg-cyan-400 text-slate-950 shrink-0 ml-2">
                      ACTIVE
                    </span>
                  )}
                </button>
              );
            })}
          </div>

          {/* Drawer Footer */}
          <div className="pt-4 border-t border-slate-800/80 flex items-center justify-between text-[11px] font-mono text-slate-400">
            <span>CivicPulse AI v0.5.0</span>
            <span className="text-emerald-400 font-bold">● System Online</span>
          </div>
        </div>
      )}
    </>
  );
};
