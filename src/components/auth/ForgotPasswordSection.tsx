'use client';

import { useState } from 'react';
import { useTranslations } from 'next-intl';
import { requestPasswordReset } from '@/services/auth';

interface ForgotPasswordSectionProps {
  email: string;
  locale: string;
}

export default function ForgotPasswordSection({
  email,
  locale,
}: ForgotPasswordSectionProps) {
  const t = useTranslations('Auth');
  const [resetLoading, setResetLoading] = useState(false);
  const [localError, setLocalError] = useState<string | null>(null);
  const [resetStatus, setResetStatus] = useState<{
    type: 'success' | 'error';
    message: string;
  } | null>(null);

  const handleForgotPassword = () => {
    if (resetLoading) return;

    void (async () => {
      setLocalError(null);
      setResetStatus(null);

      if (!email) {
        setLocalError(
          'Please enter your email address before requesting a password reset.',
        );
        return;
      }

      setResetLoading(true);

      try {
        const result = await requestPasswordReset(email, locale);

        if (result.success) {
          setResetStatus({
            type: 'success',
            message:
              result.message ??
              'If an account with this email exists, you will receive a password reset link.',
          });
        } else if (result.error) {
          setResetStatus({
            type: 'error',
            message: result.error,
          });
        } else {
          setResetStatus({
            type: 'error',
            message: 'Unable to request password reset. Please try again.',
          });
        }
      } catch (error: unknown) {

        console.error('Forgot password request failed:', error);
        setResetStatus({
          type: 'error',
          message:
            'An unexpected error occurred while requesting password reset.',
        });
      } finally {
        setResetLoading(false);
      }
    })();
  };

  return (
    <div className="mb-8 text-right">
      <button
        type="button"
        onClick={handleForgotPassword}
        disabled={resetLoading}
        className="text-sm text-blue-600 hover:text-blue-800 hover:underline disabled:cursor-not-allowed disabled:opacity-60"
      >
        {resetLoading
          ? t('sendingResetLinkButton') ?? 'Sending reset link...'
          : t('forgotPasswordLink')}
      </button>

      {localError && (
        <div className="mt-3 text-right text-sm text-red-600">{localError}</div>
      )}

      {resetStatus && (
        <div
          className={`mt-3 text-sm ${
            resetStatus.type === 'success' ? 'text-green-600' : 'text-red-600'
          }`}
        >
          {resetStatus.message}
        </div>
      )}
    </div>
  );
}
