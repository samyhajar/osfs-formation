'use client';

import { useState } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import Link from 'next/link';
import { useTranslations } from 'next-intl';

interface SignupResponse {
  error?: string;
  success?: boolean;
  message?: string;
}

export default function SignUpForm() {
  const [email, setEmail] = useState('');
  const [name, setName] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const { } = useAuth();
  const t = useTranslations('Auth');

  const handleSignUp = (e: React.FormEvent) => {
    e.preventDefault();

    void (async () => {
      setError(null);
      setSuccess(null);
      setLoading(true);

      // Validate password match
      if (password !== confirmPassword) {
        setError('Passwords do not match.');
        setLoading(false);
        return;
      }

      // Validate password strength
      if (password.length < 8) {
        setError('Password must be at least 8 characters long.');
        setLoading(false);
        return;
      }

      // Check for at least one uppercase letter, one lowercase letter, and one number
      const passwordRegex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d).+$/;
      if (!passwordRegex.test(password)) {
        setError('Password must contain at least one uppercase letter, one lowercase letter, and one number.');
        setLoading(false);
        return;
      }

      try {
        // Get the current locale from the URL path
        const locale = window.location.pathname.split('/')[1] || 'en';

        // Call our custom signup API instead of using supabase directly
        const response = await fetch(`/${locale}/api/auth/signup`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            email,
            password,
            name,
            role: 'user' // Always set role to 'user' for frontend signup
          }),
        });

        const data = await response.json() as SignupResponse;

        if (!response.ok) {
          throw new Error(data.error || 'An error occurred during signup');
        }

        // Show success message
        setSuccess('Your account has been created successfully! Please check your email to confirm your account. Once confirmed, your account will be pending admin approval.');

        // Clear form
        setEmail('');
        setPassword('');
        setConfirmPassword('');
        setName('');
      } catch (err: unknown) {
        console.error('Sign Up Process Failed:', err);
        let message = 'Sign up failed due to an unexpected error.';
        if (err instanceof Error) {
            message = err.message;
        } else if (typeof err === 'string') {
            message = err;
        } else if (err && typeof err === 'object' && 'message' in err) {
           message = String((err as { message: unknown }).message);
        }
        setError(message);
      } finally {
        setLoading(false);
      }
    })();
  };

  return (
    <form onSubmit={handleSignUp} className="space-y-6">
      {error && (
        <div className="p-4 bg-red-100 border border-red-200 text-red-700 rounded-md text-base mb-6">
          {error}
        </div>
      )}

      {success && (
        <div className="p-4 bg-green-100 border border-green-200 text-green-700 rounded-md text-base mb-6">
          {success}
        </div>
      )}

      <div className="mb-6">
        <label htmlFor="name" className="block text-base font-medium text-slate-700 mb-2">
          {t('nameLabel')}
        </label>
        <input
          type="text"
          id="name"
          value={name}
          onChange={(e) => setName(e.target.value)}
          placeholder="John Doe"
          className="w-full px-4 py-3 text-base border border-slate-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-black"
          required
          autoComplete="name"
        />
      </div>

      <div className="mb-6">
        <label htmlFor="email" className="block text-base font-medium text-slate-700 mb-2">
          {t('emailLabel')}
        </label>
        <input
          type="email"
          id="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          placeholder="your.email@example.com"
          className="w-full px-4 py-3 text-base border border-slate-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-black"
          required
          autoComplete="email"
        />
      </div>

      <div className="mb-6">
        <label htmlFor="password" className="block text-base font-medium text-slate-700 mb-2">
          {t('passwordLabel')}
        </label>
        <input
          type="password"
          id="password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          placeholder="••••••••"
          className="w-full px-4 py-3 text-base border border-slate-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-black"
          required
          autoComplete="new-password"
          minLength={8}
        />
      </div>

      <div className="mb-8">
        <label htmlFor="confirmPassword" className="block text-base font-medium text-slate-700 mb-2">
          {t('confirmPasswordLabel')}
        </label>
        <input
          type="password"
          id="confirmPassword"
          value={confirmPassword}
          onChange={(e) => setConfirmPassword(e.target.value)}
          placeholder="••••••••"
          className="w-full px-4 py-3 text-base border border-slate-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-black"
          required
          autoComplete="new-password"
          minLength={8}
        />
      </div>

      <button
        type="submit"
        disabled={loading}
        className={`w-full py-4 px-6 text-base bg-blue-600 text-white font-medium rounded-md hover:bg-blue-700 transition duration-300 ${loading ? 'opacity-70 cursor-not-allowed' : ''}`}
      >
        {loading ? t('signingUpButton') : t('signUpButton')}
      </button>

      <div className="mt-4 text-center">
        <p className="text-slate-600">
          {t('alreadyAccountPrompt')}{' '}
          <Link href="/login" className="text-blue-600 hover:text-blue-800 transition">
            {t('signInLink')}
          </Link>
        </p>
      </div>
    </form>
  );
}