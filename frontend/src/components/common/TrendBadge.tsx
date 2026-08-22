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
      <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-md text-xs font-semibold bg-red-500/10 text-red-400 border border-red-500/20">
        <TrendingUp className="w-3.5 h-3.5 text-red-400" />
        <span>INCREASING</span>
        {pctChange !== undefined && <span>({pctChange > 0 ? `+${pctChange.toFixed(1)}` : pctChange.toFixed(1)}%)</span>}
      </span>
    );
  }

  if (normTrend === 'EMERGING') {
    return (
      <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-md text-xs font-semibold bg-amber-500/10 text-amber-400 border border-amber-500/20">
        <Sparkles className="w-3.5 h-3.5 text-amber-400" />
        <span>EMERGING</span>
      </span>
    );
  }

  if (normTrend === 'DECREASING') {
    return (
      <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-md text-xs font-semibold bg-green-500/10 text-green-400 border border-green-500/20">
        <TrendingDown className="w-3.5 h-3.5 text-green-400" />
        <span>DECREASING</span>
        {pctChange !== undefined && <span>({pctChange.toFixed(1)}%)</span>}
      </span>
    );
  }

  return (
    <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-md text-xs font-semibold bg-white/[0.04] text-slate-300 border border-white/[0.08]">
      <Minus className="w-3.5 h-3.5 text-slate-400" />
      <span>STABLE</span>
    </span>
  );
};
