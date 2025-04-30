'use client';

import { ReactNode, useState, useRef, useEffect } from 'react';
import Sidebar from '@/components/dashboard/admin/Sidebar';
import Header from '@/components/dashboard/admin/Header';
import { useAuth } from '@/contexts/AuthContext';

export default function DashboardClient({ children }: { children: ReactNode }) {
  const { user, loading } = useAuth();
  const [isScrolled, setIsScrolled] = useState(false);
  const scrollRef = useRef<HTMLDivElement>(null);

  const handleScroll = () => {
    if (scrollRef.current) {
      setIsScrolled(scrollRef.current.scrollTop > 10);
    }
  };

  useEffect(() => {
    const scrollableElement = scrollRef.current;
    if (scrollableElement) {
      scrollableElement.addEventListener('scroll', handleScroll, { passive: true });
      handleScroll();
    }
    return () => {
      if (scrollableElement) {
        scrollableElement.removeEventListener('scroll', handleScroll);
      }
    };
  }, []);

  return (
    <div className="flex min-h-screen bg-white">
      <div className="w-full flex-none md:w-64 sticky top-0 h-screen overflow-y-auto">
        <Sidebar />
      </div>
      <div
        ref={scrollRef}
        className="flex-1 flex flex-col relative h-screen overflow-y-auto"
      >
        <Header isScrolled={isScrolled} />
        <main className="p-6 bg-gray-100">
          {children}
        </main>
      </div>
    </div>
  );
}