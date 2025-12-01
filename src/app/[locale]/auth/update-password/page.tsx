import Image from 'next/image';
import UpdatePasswordForm from '@/components/auth/UpdatePasswordForm';

export const dynamic = 'force-dynamic';

export default function UpdatePasswordPage() {
  return (
    <div className="flex min-h-screen flex-col bg-white">
      <main className="flex flex-grow items-center justify-center py-12 px-2 md:px-4">
        <div className="w-full max-w-md rounded-lg border border-slate-200 bg-white p-6 shadow-sm">
          <div className="mb-6 text-center">
            <Image
              src="/oblate-logo.svg"
              alt="Oblate Logo"
              width={96}
              height={96}
              className="mx-auto mb-4 h-24 w-24 object-contain"
              priority
            />
            <h1 className="text-xl font-semibold text-slate-800">
              Set a new password
            </h1>
            <p className="mt-2 text-sm text-slate-600">
              Enter and confirm your new password to complete the reset.
            </p>
          </div>

          <UpdatePasswordForm />
        </div>
      </main>
    </div>
  );
}
