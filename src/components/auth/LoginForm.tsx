'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/contexts/AuthContext';
import { AuthError, User } from '@supabase/supabase-js';

export default function LoginForm() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const router = useRouter();
  const { supabase } = useAuth();

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
          .select('role')
          .eq('id', user.id)
          .single();

        if (profileError) {
          console.error('Error fetching profile after login:', profileError);
          setError(`Failed to fetch profile: ${profileError.message}`);
          setLoading(false);
          return;
        }

        if (!profile?.role) {
           console.warn('Profile or role not found for user:', user.id);
           setError('User profile or role not found. Cannot determine dashboard.');
           setLoading(false);
           return;
        }

        let redirectPath = '/dashboard';
        switch (profile.role) {
          case 'admin':
            redirectPath = '/dashboard/admin';
            break;
          case 'formator':
            redirectPath = '/dashboard/formant';
            break;
          case 'formee':
            redirectPath = '/dashboard/formee';
            break;
          default:
            console.warn('Unknown user role:', profile.role);
        }

        router.push(redirectPath);
        router.refresh();

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
          Email Address
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

      <div className="mb-8">
        <label htmlFor="password" className="block text-base font-medium text-slate-700 mb-2">
          Password
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

      <button
        type="submit"
        disabled={loading}
        className={`w-full py-4 px-6 text-base bg-blue-600 text-white font-medium rounded-md hover:bg-blue-700 transition duration-300 ${loading ? 'opacity-70 cursor-not-allowed' : ''}`}
      >
        {loading ? 'Signing In...' : 'Sign In'}
      </button>
    </form>
  );
}