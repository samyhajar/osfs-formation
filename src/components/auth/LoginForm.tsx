'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/contexts/AuthContext';

export default function LoginForm() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const router = useRouter();
  const { supabase, refresh } = useAuth(); // Get supabase client and refresh function

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();

    // Wrap async logic
    void (async () => {
      setError(null);
      setLoading(true);

      try {
        // Use the supabase client from context
        const { error: loginError } = await supabase.auth.signInWithPassword({
          email,
          password,
        });

        if (loginError) {
          throw loginError; // Throw the error to be caught below
        }

        // Refresh auth state after successful login
        await refresh();

        // Navigate to the ADMIN dashboard after successful login & state refresh
        router.push('/dashboard/admin');
        router.refresh(); // Ensure layout re-renders with new auth state

      } catch (err: unknown) { // Use unknown
        console.error('Login failed:', err);
        // Type guard for Supabase AuthError or generic Error
        let message = 'Login failed. Please check your credentials.';
        if (err && typeof err === 'object' && 'message' in err) {
          message = String((err as { message: string }).message);
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