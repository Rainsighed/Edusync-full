import React, { Component, ErrorInfo, ReactNode } from 'react';
import Link from 'next/link';
import { AlertCircle } from 'lucide-react';
import { Card } from '../ui/Card';
import { Button } from '../ui/Button';

interface ErrorBoundaryProps {
  children: ReactNode;
  fallback?: ReactNode;
}

interface ErrorBoundaryState {
  hasError: boolean;
  error?: Error;
}

export class ErrorBoundary extends Component<ErrorBoundaryProps, ErrorBoundaryState> {
  constructor(props: ErrorBoundaryProps) {
    super(props);
    this.state = { hasError: false };
  }

  static getDerivedStateFromError(error: Error): ErrorBoundaryState {
    return { hasError: true, error };
  }

  componentDidCatch(error: Error, errorInfo: ErrorInfo) {
    console.error('Error caught by ErrorBoundary:', error, errorInfo);
  }

  handleReset = () => {
    this.setState({ hasError: false, error: undefined });
  };

  render() {
    if (this.state.hasError) {
      if (this.props.fallback) {
        return this.props.fallback;
      }

      return (
        <div className="min-h-screen bg-[#fafafa] flex items-center justify-center p-4">
          <Card className="max-w-md w-full text-center">
            <div className="flex justify-center mb-4">
              <AlertCircle size={48} className="text-red-500" />
            </div>
            <h2 className="text-2xl font-bold text-[#1a1a1a] mb-2">Something went wrong</h2>
            <p className="text-gray-600 mb-6">
              We're sorry, but something unexpected happened. Please try again or return to the home page.
            </p>
            {this.state.error && (
              <div className="bg-gray-100 p-3 rounded text-left mb-4">
                <p className="text-sm text-gray-700 font-mono">{this.state.error.message}</p>
              </div>
            )}
            <div className="flex gap-3 justify-center">
              <Button onClick={this.handleReset} variant="secondary">
                Try Again
              </Button>
              <Link href="/">
                <Button variant="primary">Go Home</Button>
              </Link>
            </div>
          </Card>
        </div>
      );
    }

    return this.props.children;
  }
}
