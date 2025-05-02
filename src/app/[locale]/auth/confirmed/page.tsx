import Link from 'next/link';

export default function ConfirmedPage() {
  return (
    <div className="flex min-h-screen items-center justify-center bg-gray-50">
      <div className="w-full max-w-md p-8 space-y-8 bg-white rounded-lg shadow-md">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-gray-900">Email Confirmed!</h1>
          <p className="mt-2 text-gray-600">
            Your email has been successfully confirmed.
          </p>
        </div>

        <div className="flex flex-col space-y-4">
          <p className="text-center text-gray-600">
            You can now log in to your account.
          </p>

          <Link
            href="/login"
            className="py-2 px-4 bg-blue-600 hover:bg-blue-700 text-white rounded-md text-center transition-colors"
          >
            Go to Login
          </Link>
        </div>
      </div>
    </div>
  );
}