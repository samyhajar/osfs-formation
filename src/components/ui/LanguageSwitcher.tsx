'use client';

import { usePathname, useRouter } from '@/i18n/navigation';
import { useParams } from 'next/navigation';
import { useState } from 'react';
import { GlobeIcon, CheckIcon } from 'lucide-react';
import { routing } from '@/i18n/routing';

export default function LanguageSwitcher() {
  const router = useRouter();
  const pathname = usePathname();
  const params = useParams();
  const currentLocale = params.locale as string;

  const [isOpen, setIsOpen] = useState(false);

  const handleLocaleChange = (newLocale: string) => {
    if (newLocale !== currentLocale) {
      router.push(pathname, { locale: newLocale });
    }
    setIsOpen(false);
  };

  // Map locale code to its native display name
  const getLocaleDisplayName = (locale: string): string => {
    switch (locale) {
      case 'en': return 'English';
      case 'fr': return 'Français';
      case 'de': return 'Deutsch';
      case 'it': return 'Italiano';
      case 'nl': return 'Nederlands';
      case 'es': return 'Español';
      case 'pt': return 'Português';
      default: return locale.toUpperCase(); // Fallback
    }
  };

  return (
    <div className="relative inline-block text-left">
      <div>
        <button
          type="button"
          className="inline-flex justify-center w-full rounded-md border border-gray-300 shadow-sm px-4 py-2 bg-white text-sm font-medium text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-brand-primary"
          id="options-menu"
          aria-haspopup="true"
          aria-expanded={isOpen}
          onClick={() => setIsOpen(!isOpen)}
        >
          <GlobeIcon className="mr-2 h-5 w-5" aria-hidden="true" />
          {getLocaleDisplayName(currentLocale)}
          {/* Add a chevron down icon if desired */}
        </button>
      </div>

      {isOpen && (
        <div
          className="origin-top-right absolute right-0 mt-2 w-48 rounded-md shadow-lg bg-white ring-1 ring-black ring-opacity-5 focus:outline-none z-10"
          role="menu"
          aria-orientation="vertical"
          aria-labelledby="options-menu"
        >
          <div className="py-1" role="none">
            {routing.locales.map((locale) => (
              <button
                key={locale}
                onClick={() => handleLocaleChange(locale)}
                className={`${locale === currentLocale
                    ? 'bg-gray-100 text-gray-900'
                    : 'text-gray-700'
                  } group flex w-full items-center px-4 py-2 text-sm hover:bg-gray-100 hover:text-gray-900`}
                role="menuitem"
              >
                <span className="flex-grow text-left">{getLocaleDisplayName(locale)}</span>
                {locale === currentLocale && (
                  <CheckIcon className="ml-2 h-5 w-5 text-brand-primary" aria-hidden="true" />
                )}
              </button>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}