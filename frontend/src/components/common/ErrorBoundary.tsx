import { Component, ErrorInfo, ReactNode } from 'react';
import { ShieldAlert, RefreshCw } from 'lucide-react';

interface Props {
  children?: ReactNode;
}

interface State {
  hasError: boolean;
}

export class ErrorBoundary extends Component<Props, State> {
  public state: State = {
    hasError: false,
  };

  public static getDerivedStateFromError(_: Error): State {
    return { hasError: true };
  }

  public componentDidCatch(error: Error, errorInfo: ErrorInfo) {
    console.error('[CivicPulse ErrorBoundary] Uncaught UI error:', error, errorInfo);
  }

  public render() {
    if (this.state.hasError) {
      return (
        <div className="min-h-screen bg-[#070b14] text-slate-100 flex flex-col items-center justify-center p-6 text-center font-mono space-y-4">
          <div className="p-4 rounded-2xl bg-rose-950/80 border border-rose-700/80 text-rose-300 shadow-xl">
            <ShieldAlert className="w-10 h-10 mx-auto text-rose-400" />
          </div>
          <h1 className="text-xl md:text-2xl font-extrabold text-slate-100">
            CivicPulse encountered an unexpected error
          </h1>
          <p className="text-xs md:text-sm text-slate-400 max-w-md">
            The application state has been safely captured. Click below to reload the platform.
          </p>
          <button
            onClick={() => window.location.reload()}
            className="px-5 py-2.5 rounded-xl bg-gradient-to-r from-cyan-600 to-indigo-600 hover:from-cyan-500 hover:to-indigo-500 text-white font-extrabold text-xs flex items-center gap-2 shadow-lg glow-cyan cursor-pointer"
          >
            <RefreshCw className="w-4 h-4" />
            <span>Reload Application</span>
          </button>
        </div>
      );
    }

    return this.props.children;
  }
}
