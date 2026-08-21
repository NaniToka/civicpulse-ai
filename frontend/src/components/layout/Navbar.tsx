import React, { useState } from 'react';
import { Command, ShieldAlert, Sparkles, Activity, Menu, X, Compass, LayoutDashboard, Search, Flame, AlertCircle, FileCheck, Network, TestTube2, Database, MessageSquare } from 'lucide-react';
import { NavTab } from './Sidebar';

interface NavbarProps {
  onOpenCommandPalette?: () => void;
  activeTab?: NavTab;
  setActiveTab?: (tab: NavTab) => void;
}

export const Navbar: React.FC<NavbarProps> = ({ onOpenCommandPalette, activeTab = 'dashboard', setActiveTab }) => {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const navItems: { id: NavTab; label: string; icon: React.ReactNode }[] = [
    { id: 'dashboard', label: 'Executive Overview', icon: <LayoutDashboard className="w-4 h-4" /> },
    { id: 'demand', label: 'Demand Intelligence', icon: <Search className="w-4 h-4" /> },
    { id: 'feedback', label: 'Citizen Comments & Emojis', icon: <MessageSquare className="w-4 h-4" /> },
    { id: 'hotspots', label: 'Demand Hotspots', icon: <Flame className="w-4 h-4" /> },
    { id: 'gaps', label: 'Infrastructure Gaps', icon: <AlertCircle className="w-4 h-4" /> },
    { id: 'recommendations', label: 'Recommendations', icon: <FileCheck className="w-4 h-4" /> },
    { id: 'evidence', label: 'Evidence Explorer', icon: <Network className="w-4 h-4" /> },
    { id: 'scenarios', label: 'Scenario Lab', icon: <TestTube2 className="w-4 h-4" /> },
    { id: 'data', label: 'Data Explorer', icon: <Database className="w-4 h-4" /> },
  ];

  const handleSelectTab = (tab: NavTab) => {
    if (setActiveTab) setActiveTab(tab);
    setMobileMenuOpen(false);
  };

  return (
    <header className="h-16 bg-[#070b14]/95 backdrop-blur-2xl border-b border-slate-800/80 px-4 sm:px-6 flex items-center justify-between z-40 sticky top-0 shadow-2xl">
      {/* Brand Identity & Mobile Menu Toggle */}
      <div className="flex items-center gap-3">
        {/* Mobile Hamburger Toggle Button */}
        <button
          onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
          className="md:hidden p-2 rounded-xl bg-slate-900 border border-slate-700 text-cyan-400 hover:text-white transition cursor-pointer"
          title="Toggle Navigation Menu"
        >
          {mobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
        </button>

        <div className="w-9 h-9 rounded-xl bg-gradient-to-tr from-cyan-500 via-indigo-500 to-emerald-400 p-0.5 shadow-lg glow-cyan shrink-0">
          <div className="w-full h-full bg-[#070b14] rounded-[10px] flex items-center justify-center">
            <Sparkles className="w-4 h-4 text-cyan-400 animate-pulse" />
          </div>
        </div>
        <div>
          <div className="flex items-center gap-2">
            <h1 className="text-base sm:text-lg font-extrabold tracking-tight text-slate-100 font-mono">
              CivicPulse <span className="gradient-text-cyan font-extrabold">AI</span>
            </h1>
            <span className="text-[9px] sm:text-[10px] font-mono font-extrabold px-2 py-0.5 rounded-md bg-cyan-950/80 text-cyan-300 border border-cyan-700/80 shadow-sm shrink-0">
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
          className="flex items-center gap-2 px-3 sm:px-3.5 py-1.5 rounded-xl bg-slate-900/90 border border-slate-700/80 text-xs font-bold text-slate-200 hover:text-white hover:border-cyan-400 transition shadow-md cursor-pointer"
        >
          <Command className="w-4 h-4 text-cyan-400" />
          <span className="hidden sm:inline font-mono">Search...</span>
          <kbd className="hidden sm:inline-flex items-center gap-0.5 px-1.5 py-0.5 rounded bg-slate-950 border border-slate-700 text-[10px] font-mono font-extrabold text-slate-300">
            ⌘K
          </kbd>
        </button>

        {/* Demo Synthetic Data Badge */}
        <div className="flex items-center gap-2 px-2.5 sm:px-3.5 py-1.5 rounded-xl bg-amber-950/80 border border-amber-600/80 text-[11px] font-mono font-bold text-amber-200 shadow-md">
          <ShieldAlert className="w-3.5 h-3.5 sm:w-4 sm:h-4 text-amber-400" />
          <span className="hidden lg:inline uppercase tracking-wider text-[11px]">DEMO ENVIRONMENT • SYNTHETIC DATA</span>
          <span className="lg:hidden">DEMO</span>
        </div>
      </div>

      {/* Mobile Navigation Full-Screen Overlay Drawer */}
      {mobileMenuOpen && (
        <div className="md:hidden fixed inset-x-0 top-16 bottom-0 bg-[#070b14]/98 backdrop-blur-2xl z-50 p-5 space-y-4 overflow-y-auto animate-in slide-in-from-top-4 duration-200 border-b border-slate-800">
          <div className="flex items-center justify-between border-b border-slate-800 pb-3">
            <span className="text-xs font-mono font-extrabold text-cyan-400 uppercase tracking-widest flex items-center gap-2">
              <Compass className="w-4 h-4" />
              <span>Civic Navigation Menu</span>
            </span>
            <span className="text-[10px] font-mono text-emerald-400 bg-emerald-950 px-2 py-0.5 rounded border border-emerald-800">
              35 Districts Active
            </span>
          </div>

          <div className="grid grid-cols-1 gap-2 pt-2">
            {navItems.map((item) => {
              const isActive = activeTab === item.id;
              return (
                <button
                  key={item.id}
                  onClick={() => handleSelectTab(item.id)}
                  className={`w-full flex items-center gap-3.5 px-4 py-3 rounded-xl text-xs font-bold font-mono transition-all text-left ${
                    isActive
                      ? 'bg-cyan-950 text-cyan-200 border border-cyan-500 shadow-lg glow-cyan'
                      : 'bg-slate-900/80 text-slate-300 hover:bg-slate-800 hover:text-white border border-slate-800'
                  }`}
                >
                  <span className={isActive ? 'text-cyan-400' : 'text-slate-400'}>{item.icon}</span>
                  <span>{item.label}</span>
                </button>
              );
            })}
          </div>
        </div>
      )}
    </header>
  );
};
