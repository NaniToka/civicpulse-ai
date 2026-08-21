import React from 'react';
import { Command, ShieldAlert, Sparkles, Activity } from 'lucide-react';

interface NavbarProps {
  onOpenCommandPalette?: () => void;
}

export const Navbar: React.FC<NavbarProps> = ({ onOpenCommandPalette }) => {
  return (
    <header className="h-16 bg-[#070b14]/90 backdrop-blur-2xl border-b border-slate-800/80 px-6 flex items-center justify-between z-30 sticky top-0 shadow-2xl">
      {/* Brand Identity */}
      <div className="flex items-center gap-3.5">
        <div className="w-9 h-9 rounded-xl bg-gradient-to-tr from-cyan-500 via-indigo-500 to-emerald-400 p-0.5 shadow-lg glow-cyan">
          <div className="w-full h-full bg-[#070b14] rounded-[10px] flex items-center justify-center">
            <Sparkles className="w-4 h-4 text-cyan-400 animate-pulse" />
          </div>
        </div>
        <div>
          <div className="flex items-center gap-2.5">
            <h1 className="text-lg font-extrabold tracking-tight text-slate-100 font-mono">
              CivicPulse <span className="gradient-text-cyan font-extrabold">AI</span>
            </h1>
            <span className="text-[10px] font-mono font-extrabold px-2.5 py-0.5 rounded-md bg-cyan-950/80 text-cyan-300 border border-cyan-700/80 shadow-sm">
              DECISION ENGINE V2
            </span>
          </div>
          <p className="text-xs text-slate-300 font-bold hidden sm:block">
            Multilingual Citizen Demand & Infrastructure Prioritization
          </p>
        </div>
      </div>

      {/* Right Controls: Command Palette & Demo Disclaimer */}
      <div className="flex items-center gap-3">
        {/* Live Status Pill */}
        <div className="hidden xl:flex items-center gap-2 px-3 py-1.5 rounded-xl bg-slate-900/80 border border-slate-800 text-xs font-mono text-slate-300">
          <Activity className="w-3.5 h-3.5 text-emerald-400" />
          <span>7 LANGUAGES ACTIVE</span>
        </div>

        {/* Command Palette Trigger */}
        <button
          onClick={onOpenCommandPalette}
          className="flex items-center gap-2 px-3.5 py-1.5 rounded-xl bg-slate-900/90 border border-slate-700/80 text-xs font-bold text-slate-200 hover:text-white hover:border-cyan-400 transition shadow-md hover:glow-cyan"
        >
          <Command className="w-4 h-4 text-cyan-400" />
          <span className="hidden md:inline font-mono">Quick Search...</span>
          <kbd className="hidden sm:inline-flex items-center gap-0.5 px-1.5 py-0.5 rounded bg-slate-950 border border-slate-700 text-[10px] font-mono font-extrabold text-slate-300">
            <span>⌘</span>K
          </kbd>
        </button>

        {/* Demo Synthetic Data Badge */}
        <div className="flex items-center gap-2 px-3.5 py-1.5 rounded-xl bg-amber-950/80 border border-amber-600/80 text-xs font-mono font-bold text-amber-200 shadow-md">
          <ShieldAlert className="w-4 h-4 text-amber-400" />
          <span className="hidden lg:inline uppercase tracking-wider text-[11px]">DEMO ENVIRONMENT • SYNTHETIC DATA</span>
          <span className="lg:hidden">DEMO DATA</span>
        </div>
      </div>
    </header>
  );
};
