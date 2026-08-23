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
    positive: 'text-emerald-700 font-extrabold',
    negative: 'text-rose-700 font-extrabold',
    neutral: 'text-slate-700 font-bold',
  };

  return (
    <div className="bg-white border border-slate-200 rounded-xl p-6 flex flex-col justify-between shadow-sm hover:border-slate-300 transition-colors duration-150 text-slate-950">
      <div className="flex items-center justify-between">
        <span className="text-xs font-extrabold text-slate-800 uppercase tracking-wider">{title}</span>
        <div className="p-2 rounded-lg bg-slate-100 border border-slate-200 text-slate-800 font-bold">
          <Icon className="w-4 h-4" />
        </div>
      </div>
      <div className="mt-3">
        <div className="text-3xl font-extrabold text-slate-950 tracking-tight font-mono">{value}</div>
        <div className="flex items-center gap-2 mt-1">
          {change && <span className={`text-xs sm:text-sm ${changeColors[changeType]}`}>{change}</span>}
          {description && <span className="text-xs sm:text-sm text-slate-700 font-bold">{description}</span>}
        </div>
      </div>
    </div>
  );
};
