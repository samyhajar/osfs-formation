import { Suspense } from 'react';

// Import flag components
import FR from 'country-flag-icons/react/3x2/FR';
import ES from 'country-flag-icons/react/3x2/ES';
import DE from 'country-flag-icons/react/3x2/DE';
import US from 'country-flag-icons/react/3x2/US'; // Use US for English/USA flag
import IT from 'country-flag-icons/react/3x2/IT'; // Add Italian flag
import BR from 'country-flag-icons/react/3x2/BR'; // Use Brazilian flag for Portuguese

// Map country codes to components
// eslint-disable-next-line @typescript-eslint/no-explicit-any
const flagComponents: { [key: string]: any } = {
  FR,
  ES,
  DE,
  US,
  IT,
  BR,
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

// LanguageFlag component
export const LanguageFlag = ({ languageName }: { languageName: string | null }) => {
  if (!languageName) {
    return <span className="text-gray-500 text-xs">N/A</span>;
  }
  const lowerLanguageName = languageName.toLowerCase();
  const countryCode = languageNameToCodeMap[lowerLanguageName];
  if (!countryCode) {
    return <span className="text-gray-500 text-xs">{languageName}</span>;
  }
  // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment
  const FlagComponent = flagComponents[countryCode];
  if (!FlagComponent) {
    return <span className="text-gray-500 text-xs">{countryCode}</span>;
  }
  return (
    <Suspense fallback={<div className="h-4 w-6 bg-gray-200 rounded-sm animate-pulse"></div>}>
      <FlagComponent title={languageName} className="h-4 w-6 rounded-sm shadow-sm" />
    </Suspense>
  );
};

// Get language code helper
export const getLanguageCode = (language: string | null | undefined): string => {
  if (!language) return '--';
  const lowerLang = language.toLowerCase().trim();
  if (lowerLang.startsWith('en') || lowerLang === 'english') return 'EN';
  if (lowerLang.startsWith('fr') || lowerLang === 'french') return 'FR';
  if (lowerLang.startsWith('es') || lowerLang === 'spanish') return 'ES';
  if (lowerLang.startsWith('de') || lowerLang === 'german') return 'DE';
  if (lowerLang.startsWith('it') || lowerLang === 'italian') return 'IT';
  if (lowerLang.startsWith('pt') || lowerLang === 'portuguese') return 'BR'; // Use Brazilian flag for Portuguese
  return language.substring(0, 2).toUpperCase();
};