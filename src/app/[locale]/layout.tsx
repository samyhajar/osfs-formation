import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import { AuthProvider } from "@/contexts/AuthContext";
import { Toaster } from 'react-hot-toast';
import { ReactNode } from 'react';
// Imports for next-intl
import { NextIntlClientProvider } from 'next-intl';
// Import getMessages for server-side fetching
import { getMessages, setRequestLocale } from 'next-intl/server';
// Import routing configuration for locales
import { routing } from '@/i18n/routing';

// Function to validate locales (optional but recommended)
export function generateStaticParams() {
  return routing.locales.map((locale) => ({ locale }));
}

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

// Define params type
type LayoutProps = {
  children: ReactNode;
  params: Promise<{ locale: string }>;
};

// Make the layout component async
export default async function LocaleLayout({
  children,
  params,
}: LayoutProps) {
  // Await params to get the locale
  const { locale } = await params;

  // Set the locale for static rendering
  setRequestLocale(locale);

  // Fetch messages using getMessages on the server
  const messages = await getMessages();

  // Add the font variables to the body instead of html
  return (
    <html lang={locale} className={`${geistSans.variable} ${geistMono.variable}`}>
      <body className="antialiased font-sans">
        {/* NextIntlClientProvider now receives server-fetched messages */}
        <NextIntlClientProvider locale={locale} messages={messages}>
          <AuthProvider>
            {children}
            <Toaster position="bottom-center" />
          </AuthProvider>
        </NextIntlClientProvider>
      </body>
    </html>
  );
}