/**
 * Utility functions for handling authentication errors
 */

import { AuthError } from '@supabase/supabase-js';

export interface AuthErrorInfo {
  isRefreshTokenError: boolean;
  isSessionExpired: boolean;
  shouldRedirectToLogin: boolean;
  userFriendlyMessage: string;
}

/**
 * Analyzes an authentication error and provides information about how to handle it
 */
export function analyzeAuthError(error: unknown): AuthErrorInfo {
  const errorMessage = error instanceof Error ? error.message : String(error);

  const isRefreshTokenError =
    errorMessage.includes('Invalid Refresh Token') ||
    errorMessage.includes('Refresh Token Not Found') ||
    errorMessage.includes('refresh_token_not_found') ||
    errorMessage.includes('invalid_grant');

  const isSessionExpired =
    errorMessage.includes('session_not_found') ||
    errorMessage.includes('Session not found') ||
    errorMessage.includes('expired') ||
    isRefreshTokenError;

  const shouldRedirectToLogin = isRefreshTokenError || isSessionExpired;

  let userFriendlyMessage = 'An authentication error occurred.';

  if (isRefreshTokenError) {
    userFriendlyMessage = 'Your session has expired. Please log in again.';
  } else if (isSessionExpired) {
    userFriendlyMessage = 'Your session has expired. Please log in again.';
  } else if (errorMessage.includes('Invalid credentials')) {
    userFriendlyMessage = 'Invalid email or password.';
  } else if (errorMessage.includes('Email not confirmed')) {
    userFriendlyMessage = 'Please check your email and confirm your account.';
  }

  return {
    isRefreshTokenError,
    isSessionExpired,
    shouldRedirectToLogin,
    userFriendlyMessage,
  };
}

/**
 * Handles authentication errors by clearing session and redirecting if necessary
 */
export async function handleAuthError(
  error: unknown,
  supabase: {
    auth: { signOut: (options?: unknown) => Promise<{ error: unknown }> };
  },
  redirectToLogin: boolean = true,
): Promise<void> {
  const errorInfo = analyzeAuthError(error);

  console.error('Auth error detected:', {
    error: error instanceof Error ? error.message : String(error),
    ...errorInfo,
  });

  if (errorInfo.shouldRedirectToLogin) {
    try {
      // Clear the session completely
      await supabase.auth.signOut({ scope: 'local' });
      console.log('Session cleared due to auth error');
    } catch (signOutError) {
      console.error('Error during signOut:', signOutError);
    }

    if (redirectToLogin) {
      // Use window.location for a hard redirect to ensure clean state
      window.location.href = '/login';
    }
  }
}

/**
 * Checks if an error is a Supabase AuthError
 */
export function isAuthError(error: unknown): error is AuthError {
  return (
    error instanceof Error && 'name' in error && error.name === 'AuthApiError'
  );
}

/**
 * Gets a user-friendly error message for display
 */
export function getAuthErrorMessage(error: unknown): string {
  const errorInfo = analyzeAuthError(error);
  return errorInfo.userFriendlyMessage;
}
