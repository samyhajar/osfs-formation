'use client';

import { useEffect } from 'react';

export default function RootPage() {
  // Use client-side only redirect to avoid hydration issues
  useEffect(() => {
    // Redirect to login page
    window.location.href = '/login';
  }, []);

  // Return an empty loading component
  return null;
}