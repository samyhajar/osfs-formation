/**
 * Extracts the current locale from the URL
 * @returns {string} The current locale code (e.g., 'en')
 */
export function getCurrentLocale(): string {
  if (typeof window === 'undefined') {
    return 'en'; // Default to English on the server
  }

  // Extract locale from URL path
  const pathSegments = window.location.pathname.split('/').filter(Boolean);
  if (
    pathSegments.length > 0 &&
    /^[a-z]{2}(-[A-Z]{2})?$/.test(pathSegments[0])
  ) {
    return pathSegments[0];
  }

  return 'en'; // Default to English if no locale found
}
