'use client';

import { useState } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import Link from 'next/link';

export default function SignUpForm() {
  const [email, setEmail] = useState('');
  const [name, setName] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const { supabase } = useAuth();

  const handleSignUp = (e: React.FormEvent) => {
    e.preventDefault();

    void (async () => {
      setError(null);
      setSuccess(null);
      setLoading(true);

      if (!supabase) {
        setError('Supabase client is not available.');
        setLoading(false);
        return;
      }

      // Validate password match
      if (password !== confirmPassword) {
        setError('Passwords do not match.');
        setLoading(false);
        return;
      }

      try {
        // Sign up the user
        const { data: signUpData, error: signUpError } = await supabase.auth.signUp({
          email,
          password,
          options: {
            data: {
              name
            }
          }
        });

        if (signUpError) {
          console.error('Supabase Auth Error:', signUpError.message);
          setError(signUpError.message);
          setLoading(false);
          return;
        }

        if (!signUpData?.user) {
          setError('Sign up successful but user data is missing.');
          setLoading(false);
          return;
        }

        // Show success message
        setSuccess('Your account has been created and is pending approval. You will receive a confirmation email once your account is approved. Click the link in that email to complete the setup process.');
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
          Full Name
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

      <div className="mb-6">
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
          autoComplete="new-password"
          minLength={8}
        />
      </div>

      <div className="mb-8">
        <label htmlFor="confirmPassword" className="block text-base font-medium text-slate-700 mb-2">
          Confirm Password
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
        {loading ? 'Signing Up...' : 'Sign Up'}
      </button>

      <div className="mt-4 text-center">
        <p className="text-slate-600">
          Already have an account?{' '}
          <Link href="/" className="text-blue-600 hover:text-blue-800 transition">
            Sign In
          </Link>
        </p>
      </div>
    </form>
  );
}