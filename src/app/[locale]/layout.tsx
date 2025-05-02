import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import { AuthProvider } from "@/contexts/AuthContext";
import { Toaster } from 'react-hot-toast';
import { NextIntlClientProvider } from 'next-intl';
import { notFound } from 'next/navigation';
import { routing } from '@/i18n/routing';
import { setRequestLocale, getMessages } from 'next-intl/server';
import { ReactNode } from 'react';
// import { Analytics } from '@vercel/analytics/react'; // Removed for now

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "OSFS Formation Resources",
  description: "Resource management for OSFS formation.",
};

// Generate static params for all supported locales
export function generateStaticParams(): Array<{ locale: string }> {
  return routing.locales.map((locale) => ({ locale }));
}

// Restore async and original props destructuring
export default async function LocaleLayout({
  children,
  params: { locale }, // Restore destructuring
}: {
  children: ReactNode;
  params: { locale: string }; // Use inline type again
}) {

  if (!routing.locales.includes(locale as (typeof routing.locales)[number])) notFound();

  // Restore setRequestLocale
  setRequestLocale(locale);

  // Restore getMessages
  let messages;
  try {
    messages = await getMessages({ locale });
  } catch (_error) {
    console.error(`Could not load messages for locale: ${locale}`, _error);
    notFound();
  }

  return (
    // Ensure no whitespace between <html> and <body> tags
    <html lang={locale} className={`${geistSans.variable} ${geistMono.variable} antialiased font-sans`}>
      <body>
        <AuthProvider>
          {/* Restore messages variable */}
          <NextIntlClientProvider locale={locale} messages={messages}>
            {children}
            {/* <Analytics /> */}
            <Toaster position="bottom-center" />
          </NextIntlClientProvider>
        </AuthProvider>
      </body>
    </html>
  );
}