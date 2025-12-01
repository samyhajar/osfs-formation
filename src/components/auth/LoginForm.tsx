'use client';

import { useState } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { useAuth } from '@/contexts/AuthContext';
import { AuthError, User } from '@supabase/supabase-js';
import { useTranslations } from 'next-intl';
import ForgotPasswordSection from './ForgotPasswordSection';

export default function LoginForm() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const router = useRouter();
  const params = useParams();
  const locale = (params as { locale?: string })?.locale ?? 'en';
  const { supabase } = useAuth();
  const t = useTranslations('Auth');

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();

    void (async () => {
      setError(null);
      setLoading(true);

      if (!supabase) {
        setError('Supabase client is not available.');
        setLoading(false);
        return;
      }

      try {
        const { data: loginData, error: loginError } = await supabase.auth.signInWithPassword({
          email,
          password,
        });

        if (loginError) {
           if (loginError instanceof AuthError) {
             console.error('Supabase Auth Error:', loginError.message);
             setError(loginError.message);
           } else {
             console.error('Login Error:', loginError);
             setError('An unexpected error occurred during login.');
           }
           setLoading(false);
           return;
        }

        if (!loginData?.user) {
          setError('Login successful but user data is missing.');
          setLoading(false);
          return;
        }

        const user: User = loginData.user;

        const { data: profile, error: profileError } = await supabase
          .from('profiles')
          .select('role, is_approved')
          .eq('id', user.id)
          .single();

        if (profileError) {
          console.error('Error fetching profile after login:', profileError);
          setError(`Failed to fetch profile: ${profileError.message}`);
          setLoading(false);
          return;
        }

        // Check if user is approved
        if (profile && profile.is_approved === false) {
          // Sign out the user immediately since they're not approved
          await supabase.auth.signOut();
          setError('Your account is pending approval. You will receive an email when approved.');
          setLoading(false);
          return;
        }

        // Determine redirect based on user role
        let redirectPath = '/dashboard/user';
        if (profile && profile.role) {
          switch (profile.role) {
            case 'admin':
              redirectPath = '/dashboard/admin';
              break;
            case 'editor':
              redirectPath = '/dashboard/editor';
              break;
            case 'user':
              redirectPath = '/dashboard/user';
              break;
          }
        }

        // Login successful, redirect to role-specific dashboard
        router.push(redirectPath);

      } catch (err: unknown) {
        console.error('Login Process Failed:', err);
        let message = 'Login failed due to an unexpected error.';
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
    <form onSubmit={handleLogin} className="space-y-6">
      {error && (
        <div className="p-4 bg-red-100 border border-red-200 text-red-700 rounded-md text-base mb-6">
          {error}
        </div>
      )}

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
          autoComplete="current-password"
        />
      </div>

      <ForgotPasswordSection email={email} locale={locale} />

      <button
        type="submit"
        disabled={loading}
        className={`w-full py-4 px-6 text-base bg-blue-600 text-white font-medium rounded-md hover:bg-blue-700 transition duration-300 ${loading ? 'opacity-70 cursor-not-allowed' : ''}`}
      >
        {loading ? t('signingInButton') : t('signInButton')}
      </button>
    </form>
  );
}