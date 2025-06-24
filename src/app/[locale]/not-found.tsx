'use client';

import Link from 'next/link';
import Image from 'next/image';
import { useTranslations } from 'next-intl';
import { ArrowPathIcon, HomeIcon } from '@heroicons/react/24/outline';

export default function NotFound() {
  const t = useTranslations('NotFound');

  const handleReload = () => {
    window.location.reload();
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 px-4 py-12">
      <div className="max-w-lg w-full text-center space-y-8">
        {/* Logo */}
        <div className="flex justify-center">
          <Image
            src="/oblate-logo.svg"
            alt="OSFS Logo"
            width={100}
            height={100}
            className="h-24 w-24"
            priority
          />
        </div>

        {/* 404 Error Number */}
        <div className="space-y-4">
          <h1 className="text-9xl font-extrabold text-gray-900 tracking-tight">
            404
          </h1>
          <div className="mx-auto h-1 w-16 bg-blue-600 rounded-full"></div>
        </div>

        {/* Error Message */}
        <div className="space-y-4">
          <h2 className="text-3xl font-bold text-gray-900">
            {t('title', { fallback: 'Oops! Page Not Found' })}
          </h2>
          <p className="text-lg text-gray-600 max-w-md mx-auto">
            {t('description', { fallback: 'We sincerely apologize, but the page you\'re looking for seems to have gone missing. It might have been moved, deleted, or the URL might be incorrect.' })}
          </p>
        </div>

        {/* Action Buttons */}
        <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
          <button
            onClick={handleReload}
            className="inline-flex items-center justify-center gap-2 px-6 py-3 text-sm font-medium text-white bg-gray-600 border border-transparent rounded-md hover:bg-gray-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-gray-500 transition-colors duration-200 min-w-[140px]"
          >
            <ArrowPathIcon className="h-4 w-4" />
            {t('reloadPage', { fallback: 'Reload Page' })}
          </button>

          <Link
            href="/"
            className="inline-flex items-center justify-center gap-2 px-6 py-3 text-sm font-medium text-white bg-blue-600 border border-transparent rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 transition-colors duration-200 min-w-[140px]"
          >
            <HomeIcon className="h-4 w-4" />
            {t('returnHome', { fallback: 'Return Home' })}
          </Link>
        </div>

        {/* Support Message */}
        <div className="pt-8 border-t border-gray-200">
          <p className="text-sm text-gray-500">
            {t('supportMessage', { fallback: 'If you continue to experience issues, please contact our support team.' })}
          </p>
        </div>
      </div>
    </div>
  );
}