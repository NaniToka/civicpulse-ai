import React from 'react';
import { Command, ShieldAlert, Sparkles } from 'lucide-react';

interface NavbarProps {
  onOpenCommandPalette?: () => void;
}

export const Navbar: React.FC<NavbarProps> = ({ onOpenCommandPalette }) => {
  return (
    <header className="h-14 bg-slate-950 border-b border-slate-800 px-6 flex items-center justify-between z-30 sticky top-0 shadow-md">
      {/* Brand Identity */}
      <div className="flex items-center gap-3.5">
        <div className="w-8 h-8 rounded-lg bg-gradient-to-tr from-sky-400 via-indigo-500 to-emerald-400 p-0.5 shadow-md shadow-sky-950/60">
          <div className="w-full h-full bg-slate-950 rounded-[7px] flex items-center justify-center">
            <Sparkles className="w-4 h-4 text-sky-400" />
          </div>
        </div>
        <div>
          <div className="flex items-center gap-2.5">
            <h1 className="text-base font-extrabold tracking-tight text-slate-100 font-mono">
              CivicPulse <span className="text-sky-400">AI</span>
            </h1>
            <span className="text-[10px] font-mono font-bold px-2 py-0.5 rounded bg-sky-950 text-sky-300 border border-sky-700">
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
        {/* Command Palette Trigger */}
        <button
          onClick={onOpenCommandPalette}
          className="flex items-center gap-2 px-3 py-1.5 rounded-lg bg-slate-900 border border-slate-700 text-xs font-bold text-slate-200 hover:text-white hover:border-sky-400 transition"
        >
          <Command className="w-4 h-4 text-sky-400" />
          <span className="hidden md:inline font-mono">Quick Search...</span>
          <kbd className="hidden sm:inline-flex items-center gap-0.5 px-1.5 py-0.5 rounded bg-slate-950 border border-slate-700 text-[10px] font-mono font-bold text-slate-200">
            <span>⌘</span>K
          </kbd>
        </button>

        {/* Demo Synthetic Data Badge */}
        <div className="flex items-center gap-1.5 px-3 py-1 rounded-lg bg-amber-950 border border-amber-600 text-xs font-mono font-bold text-amber-200 shadow-sm">
          <ShieldAlert className="w-4 h-4 text-amber-400" />
          <span className="hidden lg:inline">DEMO ENVIRONMENT • SYNTHETIC DATA</span>
          <span className="lg:hidden">DEMO DATA</span>
        </div>
      </div>
    </header>
  );
};
