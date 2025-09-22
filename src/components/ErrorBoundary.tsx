import React from 'react';

const serializeError = (error: any) => {
  if (error instanceof Error) {
    return error.message + '\n' + error.stack;
  }
  return JSON.stringify(error, null, 2);
};

interface ErrorBoundaryProps {
  children: React.ReactNode;
  fallback?: React.ComponentType<{ error: Error; resetError: () => void }>;
}

interface ErrorBoundaryState {
  hasError: boolean;
  error: Error | null;
}

export class ErrorBoundary extends React.Component<ErrorBoundaryProps, ErrorBoundaryState> {
  constructor(props: ErrorBoundaryProps) {
    super(props);
    this.state = { hasError: false, error: null };
  }

  static getDerivedStateFromError(error: Error): ErrorBoundaryState {
    return { hasError: true, error };
  }

  componentDidCatch(error: Error, errorInfo: React.ErrorInfo) {
    console.error('Error caught by boundary:', error, errorInfo);
    // Log error to monitoring service if available
  }

  resetError = () => {
    this.setState({ hasError: false, error: null });
  };

  render() {
    if (this.state.hasError) {
      // If a custom fallback component is provided, use it
      if (this.props.fallback) {
        const FallbackComponent = this.props.fallback;
        return <FallbackComponent error={this.state.error!} resetError={this.resetError} />;
      }

      // Default fallback UI
      return (
        <div className="p-4 border border-red-500 rounded bg-red-50">
          <h2 className="text-red-500 text-xl font-bold">Something went wrong.</h2>
          <pre className="mt-2 text-sm bg-white p-2 rounded overflow-auto max-h-60">
            {serializeError(this.state.error)}
          </pre>
          <button
            onClick={this.resetError}
            className="mt-4 px-4 py-2 bg-red-500 text-white rounded hover:bg-red-600 transition-colors"
          >
            Try again
          </button>
        </div>
      );
    }

    return this.props.children;
  }
}