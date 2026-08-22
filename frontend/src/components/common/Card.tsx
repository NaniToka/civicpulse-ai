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
    <div className={`bg-[#0A0A0C] border border-white/[0.08] rounded-xl p-6 shadow-sm transition-colors duration-150 ${className}`}>
      {(title || action) && (
        <div className="flex items-center justify-between pb-3 mb-4 border-b border-white/[0.08]">
          <div>
            {title && <h3 className="text-[15px] font-semibold text-slate-100">{title}</h3>}
            {subtitle && <p className="text-xs text-slate-400 mt-0.5">{subtitle}</p>}
          </div>
          {action && <div>{action}</div>}
        </div>
      )}
      {children}
    </div>
  );
};
