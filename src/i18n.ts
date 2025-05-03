import { getRequestConfig } from 'next-intl/server';
import { notFound } from 'next/navigation';
import type { AbstractIntlMessages } from 'next-intl';

// Use the same, full list of locales as in routing.ts
const locales = ['en', 'fr', 'pt', 'de', 'it', 'nl', 'es'];
const defaultLocale = 'en'; // Ensure this matches routing.ts

export default getRequestConfig(async ({ locale }) => {
  // Validate that the incoming `locale` parameter is valid and exists in the list
  // If the locale is not found, use the default locale.
  const baseLocale = locales.includes(locale as string)
    ? locale
    : defaultLocale;

  console.log(
    `🌐 [i18n.ts] Determining messages for locale: ${locale}, using: ${baseLocale}`,
  );

  let messages: AbstractIntlMessages;
  try {
    // Define the expected type for the dynamically imported module
    type MessagesModule = { default: AbstractIntlMessages };
    // Dynamically import the messages for the determined locale and assert the type.
    const messagesModule = (await import(
      `./locales/${baseLocale}.json`
    )) as MessagesModule;
    messages = messagesModule.default;
  } catch (error) {
    console.error(
      `🌐 [i18n.ts] Could not load messages for locale "${baseLocale}". File maybe missing?`,
      error,
    );
    // If messages can't be loaded, trigger a 404 Not Found error.
    notFound();
  }

  return {
    // Return the determined locale and the loaded messages.
    locale: baseLocale as string, // Assert as string after validation/defaulting
    messages,
  };
});
