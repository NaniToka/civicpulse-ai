import React from 'react';
import { UrgencyLevel } from '../../types';

interface PriorityBadgeProps {
  level: UrgencyLevel | string;
  score?: number;
  size?: 'sm' | 'md' | 'lg';
}

export const PriorityBadge: React.FC<PriorityBadgeProps> = ({ level, score, size = 'md' }) => {
  const normLevel = (level || 'LOW').toUpperCase();

  let colorClasses = 'bg-white/[0.04] text-slate-300 border-white/[0.08]';
  if (normLevel === 'CRITICAL') {
    colorClasses = 'bg-red-500/10 text-red-400 border-red-500/20 font-semibold';
  } else if (normLevel === 'HIGH') {
    colorClasses = 'bg-amber-500/10 text-amber-400 border-amber-500/20 font-semibold';
  } else if (normLevel === 'MEDIUM') {
    colorClasses = 'bg-indigo-500/10 text-indigo-400 border-indigo-500/20 font-semibold';
  } else if (normLevel === 'LOW') {
    colorClasses = 'bg-green-500/10 text-green-400 border-green-500/20 font-semibold';
  }

  const sizeClasses = {
    sm: 'px-2 py-0.5 text-[11px] gap-1.5',
    md: 'px-2.5 py-1 text-xs gap-2',
    lg: 'px-3 py-1.5 text-xs gap-2.5 font-semibold',
  }[size];

  return (
    <span className={`inline-flex items-center rounded-md border font-mono tracking-wide ${colorClasses} ${sizeClasses}`}>
      <span className={`w-1.5 h-1.5 rounded-full ${
        normLevel === 'CRITICAL' ? 'bg-red-400' :
        normLevel === 'HIGH' ? 'bg-amber-400' :
        normLevel === 'MEDIUM' ? 'bg-indigo-400' : 'bg-green-400'
      }`} />
      <span>{normLevel}</span>
      {score !== undefined && (
        <span className="border-l border-current/30 pl-2 font-bold text-slate-100">
          {score.toFixed(1)}
        </span>
      )}
    </span>
  );
};
