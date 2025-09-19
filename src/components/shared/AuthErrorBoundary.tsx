'use client';

import React, { Component, ErrorInfo, ReactNode } from 'react';
import { analyzeAuthError, getAuthErrorMessage } from '@/lib/utils/auth-error-handler';

interface Props {
  children: ReactNode;
  fallback?: ReactNode;
}

interface State {
  hasError: boolean;
  error: Error | null;
  isAuthError: boolean;
}

export class AuthErrorBoundary extends Component<Props, State> {
  constructor(props: Props) {
    super(props);
    this.state = {
      hasError: false,
      error: null,
      isAuthError: false,
    };
  }

  static getDerivedStateFromError(error: Error): State {
    const errorInfo = analyzeAuthError(error);
    return {
      hasError: true,
      error,
      isAuthError: errorInfo.shouldRedirectToLogin,
    };
  }

  componentDidCatch(error: Error, errorInfo: ErrorInfo) {
    console.error('AuthErrorBoundary caught an error:', error, errorInfo);

    // If it's an auth error, redirect to login
    if (this.state.isAuthError) {
      console.log('Auth error detected, redirecting to login');
      window.location.href = '/login';
    }
  }

  render() {
    if (this.state.hasError) {
      if (this.state.isAuthError) {
        // For auth errors, show a simple loading message while redirecting
        return (
          <div className="min-h-screen flex items-center justify-center bg-gray-50">
            <div className="text-center">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mx-auto mb-4"></div>
              <p className="text-gray-600">Redirecting to login...</p>
            </div>
          </div>
        );
      }

      // For other errors, show the fallback or a generic error message
      if (this.props.fallback) {
        return this.props.fallback;
      }

      return (
        <div className="min-h-screen flex items-center justify-center bg-gray-50">
          <div className="text-center">
            <h2 className="text-xl font-semibold text-gray-900 mb-2">
              Something went wrong
            </h2>
            <p className="text-gray-600 mb-4">
              {getAuthErrorMessage(this.state.error)}
            </p>
            <button
              onClick={() => window.location.reload()}
              className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700"
            >
              Try again
            </button>
          </div>
        </div>
      );
    }

    return this.props.children;
  }
}
