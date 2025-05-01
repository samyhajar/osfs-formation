'use client';

import { useState } from 'react';
import Link from 'next/link';

// Define a type for the API response
interface ApiResponse {
  success?: boolean;
  message?: string;
  error?: string;
  // Add other potential fields if the API returns more structured errors
  errors?: { message: string }[];
}

export default function SetupPage() {
  const [email, setEmail] = useState('samy.hajar@gmail.com');
  const [password, setPassword] = useState('samyto2508C/');
  const [name, setName] = useState('Samy Hajar');
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<ApiResponse | null>(null);

  const handleSetupAdmin = (e: React.FormEvent) => {
    e.preventDefault();

    // Wrap async logic to satisfy no-misused-promises
    void (async () => {
      setLoading(true);
      setResult(null);
      try {
        const response = await fetch('/api/create-admin', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({ email, password, name }),
        });

        // Type the response data
        const data: unknown = await response.json();

        if (!response.ok) {
          // Attempt to parse error structure from API response
          const errorData = data as ApiResponse;
          throw new Error(errorData?.error || `HTTP error! status: ${response.status}`);
        }

        setResult(data as ApiResponse); // Assert type after checking response.ok

      } catch (error: unknown) { // Use unknown
        // Type guard and set error message
        const errorMessage = error instanceof Error ? error.message : 'An unexpected error occurred';
        setResult({ error: errorMessage });
      } finally {
        setLoading(false);
      }
    })();
  };

  return (
    <div className="min-h-screen flex flex-col bg-white">
      <header className="w-full py-4 px-4 border-b border-gray-100">
        <div className="max-w-7xl mx-auto">
          <div className="flex items-center gap-2">
            <span className="text-blue-600 text-2xl font-bold">†</span>
            <h1 className="text-xl font-medium text-gray-800">OSFS Formation</h1>
          </div>
        </div>
      </header>

      <main className="flex-grow flex items-center justify-center p-4">
        <div className="w-full max-w-md">
          <div className="bg-white rounded-lg border border-gray-100 p-8 shadow-sm">
            <h2 className="text-2xl font-bold text-gray-800 mb-6 text-center">Admin Setup</h2>

            <form onSubmit={handleSetupAdmin} className="space-y-4">
              <div>
                <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-1">
                  Email
                </label>
                <input
                  type="email"
                  id="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md text-black"
                  required
                />
              </div>

              <div>
                <label htmlFor="password" className="block text-sm font-medium text-gray-700 mb-1">
                  Password
                </label>
                <input
                  type="password"
                  id="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md text-black"
                  required
                />
              </div>

              <div>
                <label htmlFor="name" className="block text-sm font-medium text-gray-700 mb-1">
                  Name
                </label>
                <input
                  type="text"
                  id="name"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md text-black"
                  required
                />
              </div>

              <button
                type="submit"
                disabled={loading}
                className={`w-full py-3 px-4 bg-gray-800 text-white font-medium rounded-md hover:bg-gray-700 transition duration-300 ${
                  loading ? 'opacity-70 cursor-not-allowed' : ''
                }`}
              >
                {loading ? 'Creating Admin...' : 'Create Admin User'}
              </button>
            </form>

            {result && (
              <div className={`mt-6 p-4 rounded-md ${result.success ? 'bg-green-50 text-green-700' : 'bg-red-50 text-red-700'}`}>
                {result.success ? (
                  <>
                    <p className="font-medium">{result.message}</p>
                    <p className="mt-2">You can now <Link href="/login" className="underline">login</Link> with your credentials.</p>
                  </>
                ) : (
                  <p className="font-medium">Error: {result.error}</p>
                )}
              </div>
            )}
          </div>
        </div>
      </main>

      <footer className="w-full py-5 px-4 border-t border-gray-100">
        <div className="max-w-7xl mx-auto text-center">
          <p className="text-sm text-gray-500">OSFS Formation Admin Setup</p>
        </div>
      </footer>
    </div>
  );
}