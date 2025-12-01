'use client';

import { useState, FormEvent } from 'react';
import { useRouter, useParams } from 'next/navigation';
import { useAuth } from '@/contexts/AuthContext';
import { updatePassword } from '@/services/auth';

const MIN_PASSWORD_LENGTH = 8;

function validatePasswords(password: string, confirmPassword: string): string | null {
  if (!password || !confirmPassword) {
    return 'Please fill in both password fields.';
  }

  if (password.length < MIN_PASSWORD_LENGTH) {
    return `Password must be at least ${MIN_PASSWORD_LENGTH} characters long.`;
  }

  if (password !== confirmPassword) {
    return 'Passwords do not match.';
  }

  return null;
}

export default function UpdatePasswordForm() {
  const { user, loading: authLoading } = useAuth();
  const router = useRouter();
  const params = useParams();
  const locale = (params as { locale?: string })?.locale ?? 'en';

  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);
  const [submitting, setSubmitting] = useState(false);

  const handleSubmit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    if (!user) {
      setError('Your reset link is invalid or has expired. Please request a new one.');
      return;
    }

    const validationError = validatePasswords(password, confirmPassword);
    if (validationError) {
      setError(validationError);
      return;
    }

    void (async () => {
      setSubmitting(true);
      setError(null);
      setSuccess(null);

      try {
        const result = await updatePassword(password, confirmPassword);

        if (result.success) {
          const message =
            result.message ??
            'Your password has been updated successfully. You can now log in with your new password.';
          setSuccess(message);

          setTimeout(() => {
            router.push(`/${locale}/login`);
          }, 3000);
        } else if (result.error) {
          setError(result.error);
        } else {
          setError('Unable to update password. Please try again.');
        }
      } catch (err: unknown) {
         
        console.error('Password update failed:', err);
        setError('An unexpected error occurred while updating your password.');
      } finally {
        setSubmitting(false);
      }
    })();
  };

  if (authLoading) {
    return (
      <div className="py-6 text-center">
        <div className="mx-auto h-8 w-8 animate-spin rounded-full border-4 border-blue-600 border-t-transparent" />
        <p className="mt-4 text-slate-600 text-sm">Loading your session...</p>
      </div>
    );
  }

  if (!user) {
    return (
      <div className="space-y-4">
        <p className="text-sm text-red-600">
          Your password reset link is invalid or has expired. Please request a new password reset email.
        </p>
        <button
          type="button"
          onClick={() => router.push(`/${locale}/login`)}
          className="w-full rounded-md bg-blue-600 px-4 py-2 text-sm font-medium text-white transition hover:bg-blue-700"
        >
          Back to login
        </button>
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      {error && (
        <div className="rounded-md border border-red-200 bg-red-100 p-3 text-sm text-red-700">
          {error}
        </div>
      )}

      {success && (
        <div className="rounded-md border border-green-200 bg-green-100 p-3 text-sm text-green-700">
          {success}
        </div>
      )}

      <div>
        <label
          htmlFor="password"
          className="mb-2 block text-sm font-medium text-slate-700"
        >
          New password
        </label>
        <input
          id="password"
          name="password"
          type="password"
          autoComplete="new-password"
          required
          value={password}
          onChange={(event) => setPassword(event.target.value)}
          className="w-full rounded-md border border-slate-300 px-4 py-2 text-sm text-black outline-none ring-0 focus:border-blue-500 focus:ring-2 focus:ring-blue-500"
        />
        <p className="mt-1 text-xs text-slate-500">
          Must be at least {MIN_PASSWORD_LENGTH} characters long.
        </p>
      </div>

      <div>
        <label
          htmlFor="confirmPassword"
          className="mb-2 block text-sm font-medium text-slate-700"
        >
          Confirm new password
        </label>
        <input
          id="confirmPassword"
          name="confirmPassword"
          type="password"
          autoComplete="new-password"
          required
          value={confirmPassword}
          onChange={(event) => setConfirmPassword(event.target.value)}
          className="w-full rounded-md border border-slate-300 px-4 py-2 text-sm text-black outline-none ring-0 focus:border-blue-500 focus:ring-2 focus:ring-blue-500"
        />
      </div>

      <button
        type="submit"
        disabled={submitting}
        className={`w-full rounded-md px-4 py-2 text-sm font-medium text-white transition ${
          submitting
            ? 'cursor-not-allowed bg-blue-600 opacity-70'
            : 'bg-blue-600 hover:bg-blue-700'
        }`}
      >
        {submitting ? 'Updating password...' : 'Update password'}
      </button>
    </form>
  );
}
