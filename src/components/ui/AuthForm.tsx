'use client'

import { useState } from 'react'
import { createClient } from '@/lib/supabase/browser-client'

export default function AuthForm() {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [loading, setLoading] = useState(false)
  const [message, setMessage] = useState<{ text: string; type: 'success' | 'error' } | null>(null)

  const handleSignIn = async (e: React.FormEvent) => {
    e.preventDefault()

    try {
      setLoading(true)
      setMessage(null)

      const supabase = createClient()
      const { error } = await supabase.auth.signInWithPassword({
        email,
        password,
      })

      if (error) {
        throw error
      }

      setMessage({ text: 'Signed in successfully!', type: 'success' })

      // Redirect will happen automatically through Next.js middleware
    } catch (error) {
      console.error('Error signing in:', error)
      setMessage({
        text: error instanceof Error ? error.message : 'An error occurred during sign in',
        type: 'error'
      })
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="w-full max-w-md p-6 rounded-lg bg-background shadow-md">
      <h2 className="text-2xl font-bold mb-6 text-center">Sign In</h2>

      <form onSubmit={handleSignIn} className="space-y-4">
        <div>
          <label htmlFor="email" className="block mb-1 text-sm font-medium">
            Email
          </label>
          <input
            id="email"
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="w-full p-2 border rounded-md"
            required
          />
        </div>

        <div>
          <label htmlFor="password" className="block mb-1 text-sm font-medium">
            Password
          </label>
          <input
            id="password"
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className="w-full p-2 border rounded-md"
            required
          />
        </div>

        <button
          type="submit"
          disabled={loading}
          className="w-full py-2 px-4 bg-brand-primary text-white font-medium rounded-md hover:bg-brand-secondary disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {loading ? 'Signing in...' : 'Sign In'}
        </button>
      </form>

      {message && (
        <div className={`mt-4 p-3 rounded-md ${
          message.type === 'error' ? 'bg-error/10 text-error' : 'bg-success/10 text-success'
        }`}>
          {message.text}
        </div>
      )}
    </div>
  )
}