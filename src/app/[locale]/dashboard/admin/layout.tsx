import { ReactNode } from 'react';
import DashboardClient from './DashboardClient';

// Ensure admin dashboard routes are always rendered dynamically to access cookies/auth
export const dynamic = 'force-dynamic';

export default function DashboardLayout({ children }: { children: ReactNode }) {
  return (
    <DashboardClient>
      {children}
    </DashboardClient>
  );
}