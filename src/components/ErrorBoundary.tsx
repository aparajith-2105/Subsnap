import React, { Component, ErrorInfo, ReactNode } from "react";
import { AlertOctagon, RotateCw } from "lucide-react";

interface Props {
  children?: ReactNode;
}

interface State {
  hasError: boolean;
  error: Error | null;
}

export class ErrorBoundary extends React.Component<Props, State> {
  public state: State = {
    hasError: false,
    error: null,
  };

  public static getDerivedStateFromError(error: Error): State {
    return { hasError: true, error };
  }

  public componentDidCatch(error: Error, errorInfo: ErrorInfo) {
    console.error("Uncaught React render error:", error, errorInfo);
  }

  private handleReset = () => {
    this.setState({ hasError: false, error: null });
    window.location.reload();
  };

  public render() {
    if (this.state.hasError) {
      return (
        <div className="min-h-screen bg-[#F9FAFB] flex items-center justify-center p-6 antialiased font-sans">
          <div className="w-full max-w-md bg-white border border-[#475569]/20 shadow-xl rounded-xl p-8 text-center flex flex-col items-center">
            <div className="w-14 h-14 bg-red-50 text-[#EF4444] rounded-full flex items-center justify-center mb-5 border border-red-100">
              <AlertOctagon className="w-8 h-8" />
            </div>
            
            <h2 className="text-lg font-black text-[#0F172A] tracking-tight mb-2">
              RECOVERABLE RENDER DETECTED
            </h2>
            
            <p className="text-xs text-[#475569] leading-relaxed mb-6 font-mono max-h-32 overflow-y-auto bg-slate-50 p-3 rounded border border-[#475569]/10 text-left">
              {this.state.error?.message || "An unexpected rendering crash was safely intercepted."}
            </p>

            <button
              onClick={this.handleReset}
              className="w-full py-3 bg-[#0F172A] hover:bg-slate-900 text-white font-bold text-xs uppercase tracking-wider rounded-lg transition-all flex items-center justify-center gap-2 cursor-pointer shadow-sm active:scale-[0.98]"
            >
              <RotateCw className="w-4 h-4 animate-spin-slow" />
              <span>Restore Workspace</span>
            </button>
            
            <p className="text-[10px] text-slate-400 mt-4 font-mono uppercase tracking-widest">
              SUBSNAP INTEGRITY GUARANTEE
            </p>
          </div>
        </div>
      );
    }

    return this.props.children;
  }
}
