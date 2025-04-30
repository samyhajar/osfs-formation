/**
 * Retrieves the site URL from environment variables.
 *
 * It checks for NEXT_PUBLIC_SITE_URL first, then falls back to
 * NEXT_PUBLIC_VERCEL_URL. If neither is set, it throws an error.
 *
 * @param {string} [path] - Optional path to append to the site URL.
 * @returns The site URL, optionally with the appended path.
 * @throws {Error} If neither NEXT_PUBLIC_SITE_URL nor NEXT_PUBLIC_VERCEL_URL is set.
 */
export function getSiteUrl(path?: string): string {
  let baseUrl: string | undefined = process.env.NEXT_PUBLIC_SITE_URL;

  if (!baseUrl) {
    const vercelUrl = process.env.NEXT_PUBLIC_VERCEL_URL;
    if (vercelUrl) {
      // Vercel URL needs to be prefixed with https://
      baseUrl = `https://${vercelUrl}`;
    } else {
      throw new Error(
        'Missing required environment variables: NEXT_PUBLIC_SITE_URL or NEXT_PUBLIC_VERCEL_URL',
      );
    }
  }

  // Ensure baseUrl doesn't end with a slash if a path is provided
  if (path && baseUrl.endsWith('/')) {
    baseUrl = baseUrl.slice(0, -1);
  }

  // Ensure path starts with a slash if provided
  const formattedPath = path ? (path.startsWith('/') ? path : `/${path}`) : '';

  return `${baseUrl}${formattedPath}`;
}
