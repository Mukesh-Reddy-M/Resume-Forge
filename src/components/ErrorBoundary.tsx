import React from 'react';

interface State {
  error: Error | null;
}

/**
 * Last line of defence: bad data must never leave the user on a white screen
 * that re-crashes on every reload.
 */
export class ErrorBoundary extends React.Component<{ children: React.ReactNode }, State> {
  state: State = { error: null };

  static getDerivedStateFromError(error: Error): State {
    return { error };
  }

  componentDidCatch(error: Error, info: React.ErrorInfo) {
    console.error('ResumeForge crashed:', error, info.componentStack);
  }

  private resetData = () => {
    try {
      localStorage.removeItem('resumeforge_resume_v1');
    } catch {
      /* ignore */
    }
    window.location.reload();
  };

  render() {
    if (!this.state.error) return this.props.children;
    return (
      <div role="alert" className="min-h-screen flex items-center justify-center bg-slate-100 p-6">
        <div className="max-w-md w-full bg-white rounded-2xl border border-slate-200 shadow-lg p-6 space-y-4">
          <h1 className="text-lg font-bold text-slate-900">Something went wrong</h1>
          <p className="text-sm text-slate-600">
            ResumeForge hit an unexpected error. Your saved data may be malformed. You can try
            reloading, or clear the saved resume and start from the sample.
          </p>
          <pre className="text-[11px] bg-slate-50 border border-slate-200 rounded-lg p-3 overflow-auto max-h-32 text-rose-700">
            {this.state.error.message}
          </pre>
          <div className="flex gap-2 justify-end">
            <button
              type="button"
              onClick={() => window.location.reload()}
              className="px-4 py-2 text-xs font-semibold text-slate-700 hover:bg-slate-100 rounded-lg"
            >
              Reload
            </button>
            <button
              type="button"
              onClick={this.resetData}
              className="px-4 py-2 text-xs font-semibold text-white bg-slate-900 hover:bg-slate-800 rounded-lg"
            >
              Clear saved data &amp; reload
            </button>
          </div>
        </div>
      </div>
    );
  }
}
