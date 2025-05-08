'use client';

// Import flag components
import FR from 'country-flag-icons/react/3x2/FR';
import ES from 'country-flag-icons/react/3x2/ES';
import DE from 'country-flag-icons/react/3x2/DE';
import US from 'country-flag-icons/react/3x2/US'; // Use US for English/USA flag
import IT from 'country-flag-icons/react/3x2/IT'; // Add Italian flag
import BR from 'country-flag-icons/react/3x2/BR'; // Use Brazilian flag for Portuguese
import NL from 'country-flag-icons/react/3x2/NL'; // Dutch flag
import React from 'react';

// Map for flag components - using any but in a more constrained way
const flagComponents: Record<string, React.ElementType> = {
  'FR': FR,
  'ES': ES,
  'DE': DE,
  'US': US,
  'EN': US, // Use US flag for English
  'IT': IT,
  'BR': BR,
  'PT': BR, // Use Brazilian flag for Portuguese
  'NL': NL
};

// Language code to country code mapping
const languageToCountryCode: Record<string, string> = {
  english: 'US',
  french: 'FR',
  spanish: 'ES',
  german: 'DE',
  italian: 'IT',
  portuguese: 'BR', // Use Brazilian flag for Portuguese
  dutch: 'NL'
};

// LanguageFlag component
export const LanguageFlag = ({ languageName }: { languageName: string | null }): JSX.Element => {
  if (!languageName) return <span className="text-gray-400">--</span>;

  // Convert to lowercase for normalization
  const lowerLang = languageName.toLowerCase().trim();

  // Direct match
  let countryCode = languageToCountryCode[lowerLang];

  // Fallback to prefix match if no direct match
  if (!countryCode) {
    if (lowerLang.startsWith('en')) countryCode = 'US';
    else if (lowerLang.startsWith('fr')) countryCode = 'FR';
    else if (lowerLang.startsWith('es')) countryCode = 'ES';
    else if (lowerLang.startsWith('de')) countryCode = 'DE';
    else if (lowerLang.startsWith('it')) countryCode = 'IT';
    else if (lowerLang.startsWith('pt')) countryCode = 'BR';
    else if (lowerLang.startsWith('nl')) countryCode = 'NL';
    else countryCode = lowerLang.substring(0, 2).toUpperCase();
  }

  const FlagComponent = flagComponents[countryCode];
  if (!FlagComponent) {
    return <span className="text-gray-500">{languageName.slice(0, 2).toUpperCase()}</span>;
  }

  return (
    <FlagComponent title={languageName} className="h-4 w-6 rounded-sm shadow-sm" />
  );
};

// Helper for Language Abbreviations (for backward compatibility)
export const getLanguageCode = (language: string | null | undefined): string => {
  if (!language) return '--';
  const lowerLang = language.toLowerCase().trim();
  if (lowerLang.startsWith('en') || lowerLang === 'english') return 'EN';
  if (lowerLang.startsWith('fr') || lowerLang === 'french') return 'FR';
  if (lowerLang.startsWith('es') || lowerLang === 'spanish') return 'ES';
  if (lowerLang.startsWith('de') || lowerLang === 'german') return 'DE';
  if (lowerLang.startsWith('it') || lowerLang === 'italian') return 'IT';
  if (lowerLang.startsWith('pt') || lowerLang === 'portuguese') return 'BR'; // Use Brazilian flag for Portuguese
  if (lowerLang.startsWith('nl') || lowerLang === 'dutch') return 'NL';
  // Fallback to first 2 chars or original if short
  return language.length > 2 ? language.substring(0, 2).toUpperCase() : language.toUpperCase();
};