import React from 'react';
import { UrgencyLevel } from '../../types';

interface PriorityBadgeProps {
  level: UrgencyLevel | string;
  score?: number;
  size?: 'sm' | 'md' | 'lg';
}

export const PriorityBadge: React.FC<PriorityBadgeProps> = ({ level, score, size = 'md' }) => {
  const normLevel = (level || 'LOW').toUpperCase();

  let colorClasses = 'bg-slate-800 text-slate-300 border-slate-700';
  if (normLevel === 'CRITICAL') {
    colorClasses = 'bg-rose-950/80 text-rose-300 border-rose-800/60 shadow-sm shadow-rose-950/50';
  } else if (normLevel === 'HIGH') {
    colorClasses = 'bg-amber-950/80 text-amber-300 border-amber-800/60 shadow-sm shadow-amber-950/50';
  } else if (normLevel === 'MEDIUM') {
    colorClasses = 'bg-sky-950/80 text-sky-300 border-sky-800/60';
  } else if (normLevel === 'LOW') {
    colorClasses = 'bg-emerald-950/80 text-emerald-300 border-emerald-800/60';
  }

  const sizeClasses = {
    sm: 'px-2 py-0.5 text-[10px] gap-1',
    md: 'px-2.5 py-1 text-xs gap-1.5',
    lg: 'px-3 py-1.5 text-sm gap-2 font-semibold',
  }[size];

  return (
    <span className={`inline-flex items-center rounded-md border font-mono tracking-wide ${colorClasses} ${sizeClasses}`}>
      <span className={`w-1.5 h-1.5 rounded-full ${
        normLevel === 'CRITICAL' ? 'bg-rose-400 animate-pulse' :
        normLevel === 'HIGH' ? 'bg-amber-400' :
        normLevel === 'MEDIUM' ? 'bg-sky-400' : 'bg-emerald-400'
      }`} />
      <span>{normLevel}</span>
      {score !== undefined && (
        <span className="opacity-80 border-l border-current/30 pl-1.5">
          {score.toFixed(1)}
        </span>
      )}
    </span>
  );
};
