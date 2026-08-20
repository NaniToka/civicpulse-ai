import React from 'react';
import { TrendingUp, TrendingDown, Minus, Sparkles } from 'lucide-react';
import { MomentumTrend } from '../../types';

interface TrendBadgeProps {
  trend: MomentumTrend | string;
  pctChange?: number;
}

export const TrendBadge: React.FC<TrendBadgeProps> = ({ trend, pctChange }) => {
  const normTrend = (trend || 'STABLE').toUpperCase();

  if (normTrend === 'INCREASING') {
    return (
      <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded text-[11px] font-medium bg-rose-950/60 text-rose-300 border border-rose-800/40">
        <TrendingUp className="w-3 h-3 text-rose-400" />
        <span>INCREASING</span>
        {pctChange !== undefined && <span>({pctChange > 0 ? `+${pctChange.toFixed(1)}` : pctChange.toFixed(1)}%)</span>}
      </span>
    );
  }

  if (normTrend === 'EMERGING') {
    return (
      <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded text-[11px] font-medium bg-amber-950/60 text-amber-300 border border-amber-800/40">
        <Sparkles className="w-3 h-3 text-amber-400" />
        <span>EMERGING</span>
      </span>
    );
  }

  if (normTrend === 'DECREASING') {
    return (
      <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded text-[11px] font-medium bg-emerald-950/60 text-emerald-300 border border-emerald-800/40">
        <TrendingDown className="w-3 h-3 text-emerald-400" />
        <span>DECREASING</span>
        {pctChange !== undefined && <span>({pctChange.toFixed(1)}%)</span>}
      </span>
    );
  }

  return (
    <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded text-[11px] font-medium bg-slate-800 text-slate-300 border border-slate-700">
      <Minus className="w-3 h-3 text-slate-400" />
      <span>STABLE</span>
    </span>
  );
};
