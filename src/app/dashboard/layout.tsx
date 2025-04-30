import { ReactNode } from 'react';
import { cookies } from 'next/headers';
import DashboardClient from './DashboardClient';

// Server-side auth check component directly in the layout
async function ServerAuthCheck() {
  const cookieStore = await cookies();

  // Check for any of the common Supabase auth cookies
  const authCookies = [
    'sb-access-token',
    'sb-refresh-token',
    'supabase-auth-token',
  ];

  // If any of these cookies exist, user is likely logged in
  let isLoggedIn = false;
  for (const cookieName of authCookies) {
    if (cookieStore.get(cookieName)) {
      isLoggedIn = true;
      break;
    }
  }

  return (
    <div
      id="server-auth-status"
      data-user-logged-in={isLoggedIn.toString()}
      className="hidden"
    />
  );
}

export default async function DashboardLayout({ children }: { children: ReactNode }) {
  return (
    <>
      {/* Server-side auth check component */}
      <ServerAuthCheck />

      {/* Client component for dashboard UI */}
      <DashboardClient>
        {children}
      </DashboardClient>
    </>
  );
}