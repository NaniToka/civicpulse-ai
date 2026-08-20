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
    positive: 'text-emerald-400',
    negative: 'text-rose-400',
    neutral: 'text-civic-400',
  };

  return (
    <div className="bg-civic-900 border border-civic-800 rounded-lg p-5 flex flex-col justify-between shadow-md hover:border-civic-700 transition-colors">
      <div className="flex items-center justify-between">
        <span className="text-xs font-medium text-civic-400 uppercase tracking-wider">{title}</span>
        <div className="p-2 bg-civic-800/80 rounded-md text-accent-blue">
          <Icon className="w-5 h-5" />
        </div>
      </div>
      <div className="mt-3">
        <div className="text-2xl font-bold text-civic-100 tracking-tight">{value}</div>
        <div className="flex items-center gap-2 mt-1">
          {change && <span className={`text-xs font-semibold ${changeColors[changeType]}`}>{change}</span>}
          {description && <span className="text-xs text-civic-400">{description}</span>}
        </div>
      </div>
    </div>
  );
};
