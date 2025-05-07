// This is a minimal root layout that redirects to localized pages
// It imports no CSS as that's handled in locale layouts

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
    <html lang="en" suppressHydrationWarning>
      <body>{children}</body>
    </html>
  );
}