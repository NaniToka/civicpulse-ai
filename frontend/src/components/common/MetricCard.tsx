import React from 'react';
import { LucideIcon } from 'lucide-react';

interface MetricCardProps {
  title: string;
  value: string | number;
  change?: string;
  changeType?: 'positive' | 'negative' | 'neutral';
  icon: LucideIcon;
  description?: string;
}

export const MetricCard: React.FC<MetricCardProps> = ({
  title,
  value,
  change,
  changeType = 'neutral',
  icon: Icon,
  description,
}) => {
  const changeColors = {
    positive: 'text-emerald-400 font-extrabold',
    negative: 'text-rose-400 font-extrabold',
    neutral: 'text-slate-400 font-bold',
  };

  return (
    <div className="bg-[#0A0A0C] border border-white/[0.12] rounded-xl p-6 flex flex-col justify-between shadow-md hover:border-indigo-500/50 transition-colors duration-150 text-slate-100 font-bold">
      <div className="flex items-center justify-between">
        <span className="text-xs font-extrabold text-slate-300 uppercase tracking-wider">{title}</span>
        <div className="p-2 rounded-lg bg-[#121215] border border-white/[0.12] text-indigo-400 font-bold">
          <Icon className="w-4 h-4" />
        </div>
      </div>
      <div className="mt-3">
        <div className="text-3xl sm:text-4xl font-extrabold text-white tracking-tight font-mono">{value}</div>
        <div className="flex items-center gap-2 mt-1">
          {change && <span className={`text-xs sm:text-sm ${changeColors[changeType]}`}>{change}</span>}
          {description && <span className="text-xs sm:text-sm text-slate-400 font-bold">{description}</span>}
        </div>
      </div>
    </div>
  );
};
