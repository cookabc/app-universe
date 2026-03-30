"use client";

import { Component, type ErrorInfo, type ReactNode } from "react";

interface Props {
  children: ReactNode;
  fallback?: ReactNode;
  onError?: (error: Error, errorInfo: ErrorInfo) => void;
}

interface State {
  hasError: boolean;
  error?: Error;
}

// Enhanced error boundary for Next.js 15 with React 19 features
class OptimizedErrorBoundary extends Component<Props, State> {
  constructor(props: Props) {
    super(props);
    this.state = { hasError: false };
  }

  static getDerivedStateFromError(error: Error): State {
    return { hasError: true, error };
  }

  componentDidCatch(error: Error, errorInfo: ErrorInfo) {
    console.error("Error caught by boundary:", error, errorInfo);
    this.props.onError?.(error, errorInfo);
  }

  render() {
    if (this.state.hasError) {
      return (
        this.props.fallback || (
          <DefaultErrorFallback
            error={this.state.error ?? new Error("Unknown error")}
          />
        )
      );
    }

    return this.props.children;
  }
}

function DefaultErrorFallback({ error }: { error?: Error }) {
  return (
    <div className="flex flex-col items-center justify-center min-h-[200px] p-8 text-center">
      <div className="text-red-500 text-6xl mb-4">⚠️</div>
      <h2 className="text-xl font-semibold mb-2">Something went wrong</h2>
      <p className="text-gray-600 mb-4">
        {error?.message || "An unexpected error occurred"}
      </p>
      <button
        onClick={() => window.location.reload()}
        className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 transition-colors"
      >
        Reload Page
      </button>
    </div>
  );
}

// Specific error boundaries for different sections
export function AppErrorBoundary({ children }: { children: ReactNode }) {
  return (
    <OptimizedErrorBoundary
      fallback={
        <div className="p-4 border border-red-200 rounded-lg bg-red-50">
          <p className="text-red-700">Failed to load app. Please try again.</p>
        </div>
      }
    >
      {children}
    </OptimizedErrorBoundary>
  );
}

export function GameErrorBoundary({ children }: { children: ReactNode }) {
  return (
    <OptimizedErrorBoundary
      fallback={
        <div className="flex items-center justify-center min-h-[400px] p-8">
          <div className="text-center">
            <div className="text-4xl mb-4">🎮</div>
            <p className="text-gray-600">
              Game failed to load. Please refresh to try again.
            </p>
          </div>
        </div>
      }
    >
      {children}
    </OptimizedErrorBoundary>
  );
}
