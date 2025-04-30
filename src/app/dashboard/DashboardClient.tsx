'use client';

import { ReactNode } from 'react';
import Sidebar from '@/components/dashboard/Sidebar';
import Header from '@/components/dashboard/Header';
import { useAuth } from '@/contexts/AuthContext';

export default function DashboardClient({ children }: { children: ReactNode }) {
  const { user, loading } = useAuth();

  // Always render the dashboard UI
  // If user is not authenticated, middleware will redirect
  return (
    <div className="flex min-h-screen bg-white">
      <div className="w-full flex-none md:w-64">
        <Sidebar />
      </div>
      <div className="flex-1 flex flex-col">
        <Header />
        <main className="flex-1 p-6 bg-gray-100">
          {children}
        </main>
      </div>
    </div>
  );
}