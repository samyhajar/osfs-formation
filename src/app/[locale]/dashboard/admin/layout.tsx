import { ReactNode } from 'react';
import DashboardClient from './DashboardClient';

export default function DashboardLayout({ children }: { children: ReactNode }) {
  return (
    <DashboardClient>
      {children}
    </DashboardClient>
  );
}