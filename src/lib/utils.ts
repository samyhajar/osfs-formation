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

/**
 * Extracts the last name from a full name string
 * @param fullName - The full name string
 * @returns The last name portion
 */
export const getLastName = (fullName: string): string => {
  const nameParts = fullName.trim().split(/\s+/);
  return nameParts[nameParts.length - 1] || fullName;
};

/**
 * Formats a full name to "Last, First" format
 * @param fullName - The full name string
 * @returns The formatted name as "Last, First"
 */
export const formatNameLastFirst = (fullName: string): string => {
  if (!fullName || !fullName.trim()) return fullName;

  const nameParts = fullName.trim().split(/\s+/);

  // If only one name part, return as is
  if (nameParts.length <= 1) {
    return fullName;
  }

  // Extract last name and first names
  const lastName = nameParts[nameParts.length - 1];
  const firstNames = nameParts.slice(0, -1).join(' ');

  return `${lastName}, ${firstNames}`;
};
