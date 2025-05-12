import Image from 'next/image'
import { createClient } from '@/lib/supabase/server-client'
import LoginFormNoIntl from '@/components/auth/LoginFormNoIntl'
import Link from 'next/link'

export default async function Login() {
  try {
    const supabase = await createClient()
    const { data: { session: _session } } = await supabase.auth.getSession()

    return (
      <div className="min-h-screen flex flex-col bg-white">
        <main className="flex-grow flex items-center justify-center py-12 px-2 md:px-4">
          <div className="max-w-7xl w-full">
            <div className="flex flex-col lg:flex-row w-full">
              <div className="w-full lg:w-1/2 flex flex-col items-center justify-center py-12 px-4">
                <h2 className="text-3xl font-bold text-slate-800 mb-10 text-center">Formation</h2>
                <div className="w-full flex justify-center">
                  <Image
                    src="/oblate-logo.svg"
                    alt="Oblate Logo"
                    width={800}
                    height={800}
                    className="w-[200px] sm:w-[250px] md:w-[280px] lg:w-[300px] h-auto object-contain"
                    priority
                  />
                </div>
              </div>

              <div className="hidden lg:block w-px bg-slate-200 mx-2 self-stretch"></div>

              <div className="w-full lg:w-1/2 flex items-center justify-center py-12 px-4">
                <div className="w-full max-w-lg">
                  <h3 className="text-2xl font-medium text-slate-800 mb-10 text-center">Sign In</h3>
                  <LoginFormNoIntl />
                  <div className="mt-6 text-center">
                    <p className="text-slate-600">
                      Don't have an account?{' '}
                      <Link href="/signup" className="text-blue-600 hover:text-blue-800 transition">
                        Sign Up
                      </Link>
                    </p>
                  </div>
                </div>
              </div>
            </div>

            <div className="w-full text-center mt-16 mb-10">
              <p className="text-slate-700 text-lg font-medium">General Coordinator:<br />
              Francis W. Danella, OSFS</p>
            </div>
          </div>
        </main>

        <footer className="w-full py-6 px-4 border-t border-slate-200">
          <div className="max-w-7xl mx-auto flex flex-col md:flex-row justify-between items-center gap-4">
            <p className="text-sm text-slate-500">OSFS Formation Office | Tenui Nec Dimittam</p>

            <div className="flex gap-6">
              <Link href="/about" className="text-sm text-slate-600 hover:text-slate-900 transition">About</Link>
              <Link href="/resources" className="text-sm text-slate-600 hover:text-slate-900 transition">Resources</Link>
              <Link href="/contact" className="text-sm text-slate-600 hover:text-slate-900 transition">Contact</Link>
            </div>
          </div>
        </footer>
      </div>
    )
  } catch (error) {
    console.error('Error in Login component:', error)
    return (
      <div className="min-h-screen flex flex-col items-center justify-center p-4">
        <h1 className="text-2xl font-bold text-slate-800 mb-4">OSFS Formation</h1>
        <p className="text-red-600 mb-6">There was an issue loading the page. Please try again later.</p>
        <Link
          href="/"
          className="py-2 px-4 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition"
        >
          Return to Home
        </Link>
      </div>
    )
  }
}