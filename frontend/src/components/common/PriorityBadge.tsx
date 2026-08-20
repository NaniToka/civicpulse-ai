import React from 'react';
import { UrgencyLevel } from '../../types';

interface PriorityBadgeProps {
  level: UrgencyLevel | string;
  score?: number;
  size?: 'sm' | 'md' | 'lg';
}

export const PriorityBadge: React.FC<PriorityBadgeProps> = ({ level, score, size = 'md' }) => {
  const normLevel = (level || 'LOW').toUpperCase();

  let colorClasses = 'bg-slate-800 text-slate-200 border-slate-700';
  if (normLevel === 'CRITICAL') {
    colorClasses = 'bg-rose-950 text-rose-200 border-rose-600 font-bold shadow-md shadow-rose-950/60';
  } else if (normLevel === 'HIGH') {
    colorClasses = 'bg-amber-950 text-amber-200 border-amber-600 font-bold shadow-md shadow-amber-950/60';
  } else if (normLevel === 'MEDIUM') {
    colorClasses = 'bg-sky-950 text-sky-200 border-sky-600 font-bold';
  } else if (normLevel === 'LOW') {
    colorClasses = 'bg-emerald-950 text-emerald-200 border-emerald-600 font-bold';
  }

  const sizeClasses = {
    sm: 'px-2.5 py-0.5 text-xs gap-1.5',
    md: 'px-3 py-1 text-xs gap-2',
    lg: 'px-3.5 py-1.5 text-sm gap-2.5 font-bold',
  }[size];

  return (
    <span className={`inline-flex items-center rounded-md border font-mono tracking-wide ${colorClasses} ${sizeClasses}`}>
      <span className={`w-2 h-2 rounded-full ${
        normLevel === 'CRITICAL' ? 'bg-rose-400 animate-pulse' :
        normLevel === 'HIGH' ? 'bg-amber-400' :
        normLevel === 'MEDIUM' ? 'bg-sky-400' : 'bg-emerald-400'
      }`} />
      <span>{normLevel}</span>
      {score !== undefined && (
        <span className="border-l border-current/40 pl-2 font-bold text-slate-100">
          {score.toFixed(1)}
        </span>
      )}
    </span>
  );
};
