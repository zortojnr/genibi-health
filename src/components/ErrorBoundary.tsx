import React, { Component, ReactNode } from 'react';

interface Props {
  children: ReactNode;
}

interface State {
  hasError: boolean;
  error?: Error;
}

class ErrorBoundary extends Component<Props, State> {
  constructor(props: Props) {
    super(props);
    this.state = { hasError: false };
  }

  static getDerivedStateFromError(error: Error): State {
    return { hasError: true, error };
  }

  componentDidCatch(error: Error, errorInfo: any) {
    console.error('ErrorBoundary caught an error:', error, errorInfo);
  }

  handleRestart = () => {
    this.setState({ hasError: false, error: undefined });
  };

  render() {
    if (this.state.hasError) {
      return (
        <div className="flex min-h-screen bg-blue-500 justify-center items-center p-5">
          <div className="bg-white p-5 rounded-lg shadow-lg max-w-md w-full text-center">
            <h2 className="text-xl font-bold text-gray-800 mb-4">Oops! Something went wrong</h2>
            <p className="text-gray-600 mb-4">
              The app encountered an unexpected error. Please try restarting the app.
            </p>
            {process.env.NODE_ENV === 'development' && this.state.error && (
              <pre className="text-red-500 text-sm bg-gray-100 p-2 rounded mb-4 overflow-auto">
                {this.state.error.toString()}
              </pre>
            )}
            <button
              onClick={this.handleRestart}
              className="bg-blue-500 hover:bg-blue-600 text-white font-medium py-2 px-4 rounded transition-colors"
            >
              Restart App
            </button>
          </div>
        </div>
      );
    }

    return this.props.children;
  }
}

export default ErrorBoundary;
