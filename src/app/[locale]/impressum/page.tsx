'use client';

import Link from 'next/link';
import { useTranslations } from 'next-intl';

export default function ImpressumPage() {
  const t = useTranslations('Impressum');

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-slate-50">
      {/* Header with back navigation */}
      <div className="bg-white/80 backdrop-blur-sm border-b border-slate-200/50">
        <div className="container mx-auto px-4 py-6">
          <div className="flex items-center gap-4">
            <Link
              href="/"
              className="inline-flex items-center gap-2 text-blue-600 hover:text-blue-700 hover:underline transition-all duration-200 text-sm font-medium"
            >
              <svg
                className="w-4 h-4"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M10 19l-7-7m0 0l7-7m-7 7h18"
                />
              </svg>
              {t('backToHome')}
            </Link>
            <span className="text-slate-400">•</span>
            <h1 className="text-2xl font-bold text-slate-800">{t('title')}</h1>
          </div>
        </div>
      </div>

      {/* Main content */}
      <main className="container mx-auto px-4 py-12 max-w-4xl">
        <div className="bg-white/60 backdrop-blur-sm rounded-2xl shadow-xl border border-white/20 p-8 md:p-12">

          {/* Header section */}
          <div className="text-center mb-12">
            <h1 className="text-3xl md:text-4xl font-bold text-slate-800 mb-4">
              {t('title')}
            </h1>
            <p className="text-slate-600 text-lg">
              {t('subtitle')}
            </p>
          </div>

          {/* Developer Information */}
          <div className="space-y-8">

            {/* Contact Information */}
            <section className="bg-gradient-to-r from-blue-50/80 to-slate-50/80 rounded-xl p-6 border border-blue-100/50">
              <h2 className="text-xl font-semibold text-slate-800 mb-4 flex items-center gap-2">
                <svg className="w-5 h-5 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                </svg>
                {t('developerInfo')}
              </h2>
              <div className="space-y-3">
                <div className="flex items-center gap-3">
                  <span className="font-medium text-slate-700 min-w-[100px]">{t('name')}:</span>
                  <span className="text-slate-800 font-semibold">Samy Hajar</span>
                </div>
                <div className="flex items-center gap-3">
                  <span className="font-medium text-slate-700 min-w-[100px]">{t('company')}:</span>
                  <span className="text-slate-800">Samy Hajar Development</span>
                </div>
              </div>
            </section>

            {/* Address Information */}
            <section className="bg-gradient-to-r from-slate-50/80 to-blue-50/80 rounded-xl p-6 border border-slate-100/50">
              <h2 className="text-xl font-semibold text-slate-800 mb-4 flex items-center gap-2">
                <svg className="w-5 h-5 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                </svg>
                {t('address')}
              </h2>
              <div className="text-slate-800">
                <p className="font-medium">Beckmanngasse 74/8-9</p>
                <p className="font-medium">1150 Wien, Austria</p>
              </div>
            </section>

            {/* Contact Methods */}
            <section className="bg-gradient-to-r from-blue-50/80 to-slate-50/80 rounded-xl p-6 border border-blue-100/50">
              <h2 className="text-xl font-semibold text-slate-800 mb-4 flex items-center gap-2">
                <svg className="w-5 h-5 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 4.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                </svg>
                {t('contact')}
              </h2>
              <div className="space-y-3">
                <div className="flex items-center gap-3">
                  <span className="font-medium text-slate-700 min-w-[80px]">{t('email')}:</span>
                  <Link
                    href="mailto:samy.hajar@gmail.com"
                    className="text-blue-600 hover:text-blue-700 transition-colors duration-200 font-medium hover:underline"
                  >
                    samy.hajar@gmail.com
                  </Link>
                </div>
                <div className="flex items-center gap-3">
                  <span className="font-medium text-slate-700 min-w-[80px]">{t('phone')}:</span>
                  <Link
                    href="tel:+4367762886665"
                    className="text-blue-600 hover:text-blue-700 transition-colors duration-200 font-medium hover:underline"
                  >
                    +43 677 628 866 65
                  </Link>
                </div>
              </div>
            </section>

            {/* Professional Services */}
            <section className="bg-gradient-to-r from-slate-50/80 to-blue-50/80 rounded-xl p-6 border border-slate-100/50">
              <h2 className="text-xl font-semibold text-slate-800 mb-4 flex items-center gap-2">
                <svg className="w-5 h-5 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19.428 15.428a2 2 0 00-1.022-.547l-2.387-.477a6 6 0 00-3.86.517l-.318.158a6 6 0 01-3.86.517L6.05 15.21a2 2 0 00-1.806.547M8 4h8l-1 1v5.172a2 2 0 00.586 1.414l5 5c1.26 1.26.367 3.414-1.415 3.414H4.828c-1.782 0-2.674-2.154-1.414-3.414l5-5A2 2 0 009 7.172V5L8 4z" />
                </svg>
                {t('services')}
              </h2>
              <div className="space-y-2 text-slate-700">
                <p>• {t('webDevelopment')}</p>
                <p>• {t('fullStackDevelopment')}</p>
                <p>• {t('databaseDesign')}</p>
                <p>• {t('uiUxDesign')}</p>
                <p>• {t('consulting')}</p>
              </div>
            </section>

            {/* Legal Information */}
            <section className="bg-gradient-to-r from-blue-50/80 to-slate-50/80 rounded-xl p-6 border border-blue-100/50">
              <h2 className="text-xl font-semibold text-slate-800 mb-4 flex items-center gap-2">
                <svg className="w-5 h-5 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
                </svg>
                {t('legalInfo')}
              </h2>
              <div className="space-y-3 text-slate-700">
                <p>
                  <span className="font-medium">{t('responsibleFor')}:</span> {t('responsibleForContent')}
                </p>
                <p>
                  <span className="font-medium">{t('disclaimer')}:</span> {t('disclaimerText')}
                </p>
              </div>
            </section>

          </div>

          {/* Footer note */}
          <div className="mt-12 pt-8 border-t border-slate-200 text-center">
            <p className="text-slate-500 text-sm">
              {t('lastUpdated')}: {new Date().toLocaleDateString()}
            </p>
          </div>
        </div>
      </main>
    </div>
  );
}