import { getRequestConfig } from 'next-intl/server';
import { notFound } from 'next/navigation';

// Can be imported from a shared config
const locales = ['en', 'fr'];
const defaultLocale = 'en'; // Define default locale here too

export default getRequestConfig(async ({ locale }) => {
  // Validate that the incoming `locale` parameter is valid
  const baseLocale = locale ?? defaultLocale; // Provide a fallback just in case
  if (!locales.includes(baseLocale)) notFound();

  return {
    locale: baseLocale, // Use the validated locale
    messages: await (async () => {
      const messagesModule = (await import(`./locales/${baseLocale}.json`)) as {
        default: Record<string, string>;
      };
      return messagesModule.default;
    })(),
  };
});
