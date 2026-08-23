import React from 'react';

interface CardProps {
  children: React.ReactNode;
  className?: string;
  title?: string;
  subtitle?: string;
  action?: React.ReactNode;
}

export const Card: React.FC<CardProps> = ({
  children,
  className = '',
  title,
  subtitle,
  action,
}) => {
  return (
    <div className={`bg-white border border-slate-200 rounded-xl p-6 shadow-sm transition-colors duration-150 text-slate-950 font-bold ${className}`}>
      {(title || action) && (
        <div className="flex items-center justify-between pb-3 mb-4 border-b border-slate-200">
          <div>
            {title && <h3 className="text-base sm:text-lg font-extrabold text-slate-950">{title}</h3>}
            {subtitle && <p className="text-xs sm:text-sm text-slate-700 font-bold mt-0.5">{subtitle}</p>}
          </div>
          {action && <div>{action}</div>}
        </div>
      )}
      {children}
    </div>
  );
};
