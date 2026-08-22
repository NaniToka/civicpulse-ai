import React from 'react';
import { AlertCircle, CheckCircle2, Info, AlertTriangle } from 'lucide-react';

interface AlertProps {
  children: React.ReactNode;
  variant?: 'info' | 'success' | 'warning' | 'error';
  title?: string;
}

export const Alert: React.FC<AlertProps> = ({
  children,
  variant = 'info',
  title,
}) => {
  const styles = {
    info: {
      container: 'bg-indigo-500/10 border-indigo-500/20 text-slate-200',
      icon: <Info className="w-4 h-4 text-indigo-400 shrink-0 mt-0.5" />,
    },
    success: {
      container: 'bg-green-500/10 border-green-500/20 text-slate-200',
      icon: <CheckCircle2 className="w-4 h-4 text-green-400 shrink-0 mt-0.5" />,
    },
    warning: {
      container: 'bg-amber-500/10 border-amber-500/20 text-slate-200',
      icon: <AlertTriangle className="w-4 h-4 text-amber-400 shrink-0 mt-0.5" />,
    },
    error: {
      container: 'bg-red-500/10 border-red-500/20 text-slate-200',
      icon: <AlertCircle className="w-4 h-4 text-red-400 shrink-0 mt-0.5" />,
    },
  };

  return (
    <div className={`flex items-start gap-3 p-3.5 rounded-lg border text-xs sm:text-sm ${styles[variant].container}`}>
      {styles[variant].icon}
      <div>
        {title && <h4 className="font-semibold text-slate-100 mb-0.5">{title}</h4>}
        <div className="leading-relaxed text-slate-300">{children}</div>
      </div>
    </div>
  );
};
