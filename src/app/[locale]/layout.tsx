import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import { AuthProvider } from "@/contexts/AuthContext";
import { Toaster } from 'react-hot-toast';
import { ReactNode } from 'react';
// Imports for next-intl
import { NextIntlClientProvider } from 'next-intl';
// Import getMessages for server-side fetching
import { getMessages } from 'next-intl/server';

// Function to validate locales (optional but recommended)
export function generateStaticParams() {
  return [{ locale: 'en' }, { locale: 'fr' }];
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

// Make the layout component async
export default async function LocaleLayout({
  children,
  params: { locale },
}: {
  children: ReactNode;
  params: { locale: string };
}) {
  // Optional: Validate locale
  // try {
  //   const locales = ['en', 'fr'];
  //   if (!locales.includes(locale)) notFound();
  // } catch (error) {
  //   notFound();
  // }

  // Fetch messages using getMessages on the server
  const messages = await getMessages();

  return (
    <html lang={locale} className={`${geistSans.variable} ${geistMono.variable} antialiased font-sans`}>
      <body>
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