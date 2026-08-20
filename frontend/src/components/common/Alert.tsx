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
      container: 'bg-sky-950/40 border-sky-800/80 text-sky-200',
      icon: <Info className="w-5 h-5 text-sky-400 shrink-0" />,
    },
    success: {
      container: 'bg-emerald-950/40 border-emerald-800/80 text-emerald-200',
      icon: <CheckCircle2 className="w-5 h-5 text-emerald-400 shrink-0" />,
    },
    warning: {
      container: 'bg-amber-950/40 border-amber-800/80 text-amber-200',
      icon: <AlertTriangle className="w-5 h-5 text-amber-400 shrink-0" />,
    },
    error: {
      container: 'bg-rose-950/40 border-rose-800/80 text-rose-200',
      icon: <AlertCircle className="w-5 h-5 text-rose-400 shrink-0" />,
    },
  };

  return (
    <div className={`flex items-start gap-3 p-4 rounded-lg border text-sm ${styles[variant].container}`}>
      {styles[variant].icon}
      <div>
        {title && <h4 className="font-semibold mb-0.5">{title}</h4>}
        <div className="leading-relaxed text-xs sm:text-sm">{children}</div>
      </div>
    </div>
  );
};
