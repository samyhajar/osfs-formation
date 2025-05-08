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
  params,
}: {
  children: ReactNode;
  params: { locale: string };
}) {
  // Extract locale from params
  const { locale } = params;

  // Fetch messages using getMessages on the server
  const messages = await getMessages({locale});

  // Add the font variables to the body instead of html
  return (
    <>
      {/* Set the language of the document using a script tag instead of the html element */}
      <script
        dangerouslySetInnerHTML={{
          __html: `document.documentElement.lang = "${locale}"; document.documentElement.className = "${geistSans.variable} ${geistMono.variable} antialiased font-sans";`,
        }}
      />
      {/* NextIntlClientProvider now receives server-fetched messages */}
      <NextIntlClientProvider locale={locale} messages={messages}>
        <AuthProvider>
          {children}
          <Toaster position="bottom-center" />
        </AuthProvider>
      </NextIntlClientProvider>
    </>
  );
}