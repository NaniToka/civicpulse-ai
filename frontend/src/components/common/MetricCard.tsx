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
    positive: 'text-green-400',
    negative: 'text-red-400',
    neutral: 'text-slate-400',
  };

  return (
    <div className="bg-[#0A0A0C] border border-white/[0.08] rounded-xl p-6 flex flex-col justify-between shadow-sm hover:border-white/[0.16] transition-colors duration-150">
      <div className="flex items-center justify-between">
        <span className="text-[11px] font-semibold text-slate-400 uppercase tracking-wider">{title}</span>
        <div className="p-2 rounded-lg bg-[#121215] border border-white/[0.08] text-slate-400">
          <Icon className="w-4 h-4" />
        </div>
      </div>
      <div className="mt-3">
        <div className="text-2xl font-semibold text-slate-100 tracking-tight">{value}</div>
        <div className="flex items-center gap-2 mt-1">
          {change && <span className={`text-xs font-semibold ${changeColors[changeType]}`}>{change}</span>}
          {description && <span className="text-xs text-slate-400">{description}</span>}
        </div>
      </div>
    </div>
  );
};
