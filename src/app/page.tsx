import Link from 'next/link'
import { createClient } from '@/lib/supabase/server-client'
import LoginForm from '@/components/auth/LoginForm'

export default async function Home() {
  try {
    const supabase = await createClient()
    const { data: { session } } = await supabase.auth.getSession()

    return (
      <div className="min-h-screen flex flex-col bg-white">
        {/* Simple minimal header */}
        <header className="w-full py-4 px-4 border-b border-gray-100">
          <div className="max-w-7xl mx-auto flex items-center">
            <div className="flex items-center gap-2">
              <span className="text-blue-600 text-2xl font-bold">†</span>
              <h1 className="text-xl font-medium text-gray-800">OSFS Formation</h1>
            </div>
          </div>
        </header>

        <main className="flex-grow flex flex-col lg:flex-row max-w-7xl mx-auto w-full p-4 md:p-8">
          {/* Main content container - ensures equal height columns */}
          <div className="flex flex-col lg:flex-row w-full gap-8">
            {/* Left Column - Content */}
            <div className="w-full lg:w-3/5 lg:pr-4">
              <div className="h-full flex flex-col">
                <div className="mb-8">
                  <h2 className="text-2xl font-bold text-gray-800 mb-6">Welcome to OSFS Formation</h2>
                  <p className="text-lg text-gray-700 mb-6 leading-relaxed">
                    The formation website is a resource for Oblate formators and Oblates in formation. Our platform provides guidance, resources, and community for those following the Oblate spirituality.
                  </p>
                </div>

                <div className="mb-8">
                  <h3 className="text-xl font-medium text-gray-800 mb-4">Origins of the Formation Coordinator</h3>
                  <p className="text-gray-700 mb-4 leading-relaxed">
                    The origins of the General Formation Coordinator go back to the directive from the General Chapter of 2006 to "compile and formulate common guidelines for formation in Oblate spirituality" and the meeting of major superiors in 2007 which focused on formation.
                  </p>
                  <p className="text-gray-700 leading-relaxed">
                    Since then, there were efforts in every province and region to offer effective formation, but the meeting also recognized there were striking differences, and an effort was made to reach greater common ground in formation throughout the congregation.
                  </p>
                </div>

                <div className="mb-8">
                  <h3 className="text-xl font-medium text-gray-800 mb-4">Directives of the Church</h3>
                  <p className="text-gray-700 mb-4 leading-relaxed">
                    We follow the directives of the Church, including St. John Paul II's <span className="italic">Pastores Dabo Vobis</span>, which emphasized the four essential pillars of formation:
                  </p>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mt-6">
                    <div className="p-4 border border-gray-100 rounded-lg bg-gray-50">
                      <h4 className="font-medium text-gray-800 mb-2">Human</h4>
                      <p className="text-sm text-gray-600">Personal development and maturity</p>
                    </div>
                    <div className="p-4 border border-gray-100 rounded-lg bg-gray-50">
                      <h4 className="font-medium text-gray-800 mb-2">Spiritual</h4>
                      <p className="text-sm text-gray-600">Deepening relationship with God</p>
                    </div>
                    <div className="p-4 border border-gray-100 rounded-lg bg-gray-50">
                      <h4 className="font-medium text-gray-800 mb-2">Pastoral</h4>
                      <p className="text-sm text-gray-600">Service to others in Christ's spirit</p>
                    </div>
                    <div className="p-4 border border-gray-100 rounded-lg bg-gray-50">
                      <h4 className="font-medium text-gray-800 mb-2">Intellectual</h4>
                      <p className="text-sm text-gray-600">Theological understanding</p>
                    </div>
                  </div>
                </div>

                {/* Flex spacer to push content to the top */}
                <div className="flex-grow"></div>
              </div>
            </div>

            {/* Right Column - Login Card */}
            <div className="w-full lg:w-2/5 lg:pl-4">
              <div className="h-full flex flex-col">
                <div className="bg-white rounded-lg border border-gray-100 p-6 md:p-8 shadow-sm h-full flex flex-col">
                  {session ? (
                    <div className="flex flex-col h-full">
                      <div className="flex-grow flex flex-col items-center justify-center">
                        <h3 className="text-xl font-medium text-gray-800 mb-4">Welcome Back</h3>
                        <p className="text-gray-600 mb-6">
                          You're signed in and have access to all formation resources.
                        </p>
                        <Link
                          href="/dashboard"
                          className="block w-full py-3 px-4 bg-gray-800 text-white font-medium rounded-md hover:bg-gray-700 transition duration-300 text-center"
                        >
                          Go to Formation Dashboard
                        </Link>
                      </div>
                    </div>
                  ) : (
                    <div className="flex flex-col h-full">
                      <h3 className="text-xl font-medium text-gray-800 mb-6 text-center">Sign In</h3>

                      <div className="space-y-4">
                        {/* Login Form Component */}
                        <LoginForm />

                        <div className="flex items-center my-4">
                          <div className="flex-grow h-px bg-gray-200"></div>
                          <span className="px-2 text-sm text-gray-500">or</span>
                          <div className="flex-grow h-px bg-gray-200"></div>
                        </div>

                        <Link
                          href="/contact"
                          className="block w-full py-3 px-4 border border-gray-300 text-gray-700 rounded-md hover:bg-gray-50 transition duration-300 text-center"
                        >
                          Contact Formation Office
                        </Link>

                        {/* Push quote to bottom of card */}
                        <div className="flex-grow"></div>

                        <div className="pt-4 border-t border-gray-200 mt-6">
                          <p className="text-sm text-gray-500 italic text-center">
                            "I invite us to a common reflection on this process of formation giving emphasis to the four pillars of formation as well as the process of discernment."
                          </p>
                        </div>
                      </div>
                    </div>
                  )}
                </div>
              </div>
            </div>
          </div>
        </main>

        {/* Minimal Footer */}
        <footer className="w-full py-5 px-4 border-t border-gray-100">
          <div className="max-w-7xl mx-auto flex flex-col md:flex-row justify-between items-center gap-4">
            <p className="text-sm text-gray-500">OSFS Formation Office | Tenui Nec Dimittam</p>

            <div className="flex gap-6">
              <Link href="/about" className="text-sm text-gray-600 hover:text-gray-900 transition">About</Link>
              <Link href="/resources" className="text-sm text-gray-600 hover:text-gray-900 transition">Resources</Link>
              <Link href="/contact" className="text-sm text-gray-600 hover:text-gray-900 transition">Contact</Link>
            </div>
          </div>
        </footer>
      </div>
    )
  } catch (error) {
    console.error('Error in Home component:', error);
    return (
      <div className="min-h-screen flex flex-col items-center justify-center p-4">
        <h1 className="text-2xl font-bold text-gray-800 mb-4">OSFS Formation</h1>
        <p className="text-red-600 mb-6">There was an issue loading the page. Please try again later.</p>
        <Link
          href="/"
          className="py-2 px-4 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition"
        >
          Refresh
        </Link>
      </div>
    );
  }
}
