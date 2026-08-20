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
      <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-md text-xs font-bold bg-rose-950 text-rose-200 border border-rose-600 shadow-sm">
        <TrendingUp className="w-3.5 h-3.5 text-rose-400" />
        <span>INCREASING</span>
        {pctChange !== undefined && <span>({pctChange > 0 ? `+${pctChange.toFixed(1)}` : pctChange.toFixed(1)}%)</span>}
      </span>
    );
  }

  if (normTrend === 'EMERGING') {
    return (
      <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-md text-xs font-bold bg-amber-950 text-amber-200 border border-amber-600 shadow-sm">
        <Sparkles className="w-3.5 h-3.5 text-amber-400" />
        <span>EMERGING</span>
      </span>
    );
  }

  if (normTrend === 'DECREASING') {
    return (
      <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-md text-xs font-bold bg-emerald-950 text-emerald-200 border border-emerald-600 shadow-sm">
        <TrendingDown className="w-3.5 h-3.5 text-emerald-400" />
        <span>DECREASING</span>
        {pctChange !== undefined && <span>({pctChange.toFixed(1)}%)</span>}
      </span>
    );
  }

  return (
    <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-md text-xs font-bold bg-slate-900 text-slate-200 border border-slate-700">
      <Minus className="w-3.5 h-3.5 text-slate-400" />
      <span>STABLE</span>
    </span>
  );
};
