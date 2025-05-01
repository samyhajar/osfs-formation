'use client'; // Add use client if needed by consumers, or keep server-only

/**
 * Checks if the code is running in a browser environment
 */
export const isBrowser = () => typeof window !== 'undefined';

/**
 * Generates initials from a name string.
 * @param name - The full name string.
 * @returns The initials (e.g., "JD" for "John Doe").
 */
export const getInitials = (name?: string | null): string => {
  if (!name) return '?'; // Return question mark if no name

  const names = name.split(' ').filter(Boolean); // Split by space and remove empty strings
  if (names.length === 0) return '?';

  // Take the first letter of the first name
  let initials = names[0][0];

  // If there's a last name, take its first letter too
  if (names.length > 1) {
    initials += names[names.length - 1][0];
  }

  return initials.toUpperCase();
};
