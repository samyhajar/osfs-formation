'use client';

import React, { Suspense } from 'react';

// Statically import required flags
import FR from 'country-flag-icons/react/3x2/FR';
import ES from 'country-flag-icons/react/3x2/ES';
import DE from 'country-flag-icons/react/3x2/DE';
import US from 'country-flag-icons/react/3x2/US'; // Use US for English/USA flag
import IT from 'country-flag-icons/react/3x2/IT'; // Add Italian flag
import BR from 'country-flag-icons/react/3x2/BR'; // Use Brazilian flag for Portuguese

// Map country codes to components - use basic object type
const flagComponents: Record<string, React.ComponentType<{ title?: string; className?: string }>> = {
  FR: FR as React.ComponentType<{ title?: string; className?: string }>,
  ES: ES as React.ComponentType<{ title?: string; className?: string }>,
  DE: DE as React.ComponentType<{ title?: string; className?: string }>,
  US: US as React.ComponentType<{ title?: string; className?: string }>,
  IT: IT as React.ComponentType<{ title?: string; className?: string }>,
  BR: BR as React.ComponentType<{ title?: string; className?: string }>,
};

// Map full language names (lowercase) to country codes
const languageNameToCodeMap: { [key: string]: string } = {
  english: 'US',
  french: 'FR',
  spanish: 'ES',
  german: 'DE',
  italian: 'IT',
  portuguese: 'BR', // Use Brazilian flag for Portuguese
};

interface LanguageFlagProps {
  languageName: string | null;
}

export default function LanguageFlag({ languageName }: LanguageFlagProps) {
  if (!languageName) {
    return <span className="text-gray-500 text-xs">N/A</span>;
  }
  const lowerLanguageName = languageName.toLowerCase();
  const countryCode = languageNameToCodeMap[lowerLanguageName];
  if (!countryCode) {
    return <span className="text-gray-500 text-xs">{languageName}</span>;
  }

  const FlagComponent = flagComponents[countryCode];
  if (!FlagComponent) {
    return <span className="text-gray-500 text-xs">{countryCode}</span>;
  }
  return (
    <Suspense fallback={<div className="h-4 w-6 bg-gray-200 rounded-sm animate-pulse"></div>}>
      <FlagComponent title={languageName} className="h-4 w-6 rounded-sm shadow-sm" />
    </Suspense>
  );
}