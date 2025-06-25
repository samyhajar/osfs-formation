// This is a minimal root layout that redirects to localized pages
// It imports no CSS as that's handled in locale layouts

import { Geist, Geist_Mono } from "next/font/google";
import { AuthProvider } from '@/contexts/AuthContext';

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata = {
  title: 'OSFS Formation',
  description: 'OSFS Formation Platform',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  // Middleware handles redirects instead of component-level redirect
  return (
    <html lang="en" suppressHydrationWarning className={`${geistSans.variable} ${geistMono.variable}`}>
      <body className="antialiased font-sans">
        <AuthProvider>{children}</AuthProvider>
      </body>
    </html>
  );
}