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
    <div className={`bg-[#0A0A0C] border border-white/[0.12] rounded-xl p-6 shadow-md transition-colors duration-150 text-slate-100 font-bold ${className}`}>
      {(title || action) && (
        <div className="flex items-center justify-between pb-3 mb-4 border-b border-white/[0.08]">
          <div>
            {title && <h3 className="text-base sm:text-lg font-extrabold text-white">{title}</h3>}
            {subtitle && <p className="text-xs sm:text-sm text-slate-400 font-bold mt-0.5">{subtitle}</p>}
          </div>
          {action && <div>{action}</div>}
        </div>
      )}
      {children}
    </div>
  );
};
