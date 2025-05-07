'use client';

import { useEffect } from 'react';

export default function RootPage() {
  // Use client-side only redirect to avoid hydration issues
  useEffect(() => {
    // Redirect to English locale as fallback if middleware fails
    window.location.href = '/en';
  }, []);

  // Return an empty loading component
  return null;
}