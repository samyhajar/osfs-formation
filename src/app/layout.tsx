import './[locale]/globals.css';

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
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}