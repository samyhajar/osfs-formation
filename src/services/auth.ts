import type { PasswordResetResponse, PasswordUpdateResponse } from '@/types/auth';

/**
 * Request a password reset email for the given address.
 *
 * This function calls the `/api/password-reset` route, which is responsible for:
 * - Validating the email format
 * - Checking profile approval status
 * - Delegating the actual email sending to Supabase Auth
 */
export async function requestPasswordReset(
  email: string,
  locale: string,
): Promise<PasswordResetResponse> {
  try {
    const response = await fetch('/api/password-reset', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ email, locale }),
    });

    const data = (await response.json()) as {
      success?: boolean;
      message?: string;
      error?: string;
    };

    if (!response.ok) {
      return {
        success: false,
        error: data.error ?? 'Failed to request password reset.',
      };
    }

    return {
      success: data.success ?? true,
      message:
        data.message ??
        'If an account with this email exists, you will receive a password reset link.',
    };
  } catch (error) {
    // Log for debugging; UI receives a generic error message
     
    console.error('Password reset request failed:', error);

    return {
      success: false,
      error: 'An unexpected error occurred while requesting password reset.',
    };
  }
}

/**
 * Update the authenticated user's password after they have followed a
 * Supabase recovery link and established a session.
 *
 * This function calls the `/api/update-password` route, which:
 * - Validates the new password server-side
 * - Verifies that the requester is authenticated
 * - Uses `supabase.auth.updateUser` to change the password
 */
export async function updatePassword(
  password: string,
  confirmPassword: string,
): Promise<PasswordUpdateResponse> {
  try {
    const response = await fetch('/api/update-password', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ password, confirmPassword }),
    });

    const data = (await response.json()) as {
      success?: boolean;
      message?: string;
      error?: string;
    };

    if (!response.ok) {
      return {
        success: false,
        error: data.error ?? 'Failed to update password.',
      };
    }

    return {
      success: data.success ?? true,
      message: data.message ?? 'Password updated successfully.',
    };
  } catch (error) {
    // Log for debugging; UI receives a generic error message
     
    console.error('Password update request failed:', error);

    return {
      success: false,
      error: 'An unexpected error occurred while updating password.',
    };
  }
}
