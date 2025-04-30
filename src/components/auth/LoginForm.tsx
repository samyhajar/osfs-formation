'use client';

import { useState } from 'react';
import { createClient } from '@/lib/supabase/browser-client';

export default function LoginForm() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setIsLoading(true);

    try {
      // Create the Supabase client using our browser client
      const supabase = createClient();

      console.log('Attempting to sign in...');

      const { error, data } = await supabase.auth.signInWithPassword({
        email,
        password,
      });

      if (error) {
        throw new Error(error.message);
      }

      if (!data.session) {
        throw new Error('Login failed - no session returned');
      }

      console.log('Login successful, redirecting to dashboard');

      // Force a hard refresh to reset all state
      window.location.href = '/dashboard';

    } catch (err: any) {
      console.error('Login error:', err.message);
      setError(err.message || 'Failed to sign in');
      setIsLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
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
        disabled={isLoading}
        className={`w-full py-4 px-6 text-base bg-blue-600 text-white font-medium rounded-md hover:bg-blue-700 transition duration-300 ${isLoading ? 'opacity-70 cursor-not-allowed' : ''}`}
      >
        {isLoading ? 'Signing In...' : 'Sign In'}
      </button>
    </form>
  );
}