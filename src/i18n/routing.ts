import { defineRouting } from 'next-intl/routing';

export const routing = defineRouting({
  // A list of all locales that are supported
  locales: ['en', 'fr', 'pt', 'de', 'it', 'nl', 'es'],

  // Used when no locale matches
  defaultLocale: 'en',

  // Explicitly set the locale prefix strategy (default is 'always')
  localePrefix: 'always',
});
