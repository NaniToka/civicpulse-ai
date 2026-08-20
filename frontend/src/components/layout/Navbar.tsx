import React from 'react';
import { Activity, ShieldCheck, Globe } from 'lucide-react';
import { Badge } from '../common/Badge';

export const Navbar: React.FC = () => {
  return (
    <header className="h-16 bg-civic-900 border-b border-civic-800 px-6 flex items-center justify-between sticky top-0 z-30">
      <div className="flex items-center gap-3">
        <div className="p-2 bg-gradient-to-tr from-accent-blue/20 to-accent-violet/20 border border-accent-blue/30 rounded-lg">
          <Activity className="w-5 h-5 text-accent-blue" />
        </div>
        <div>
          <div className="flex items-center gap-2">
            <h1 className="font-bold text-lg tracking-tight text-civic-100">CivicPulse AI</h1>
            <Badge variant="accent">BRICS Digital Public Good</Badge>
          </div>
          <p className="text-xs text-civic-400">Citizen Demand Intelligence & Infrastructure Prioritization</p>
        </div>
      </div>

      <div className="flex items-center gap-4">
        <div className="hidden sm:flex items-center gap-2 px-3 py-1.5 bg-civic-950 border border-civic-800 rounded-md text-xs text-civic-400">
          <Globe className="w-3.5 h-3.5 text-emerald-400" />
          <span>Active Regions: <b>IND, BRA, ZAF</b></span>
        </div>

        <div className="flex items-center gap-2 text-xs text-emerald-400 bg-emerald-950/40 border border-emerald-800/60 px-3 py-1.5 rounded-md">
          <ShieldCheck className="w-3.5 h-3.5" />
          <span>Gemini AI Engine Active</span>
        </div>
      </div>
    </header>
  );
};
