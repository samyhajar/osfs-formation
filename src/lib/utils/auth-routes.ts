import { NextResponse } from 'next/server';

/**
 * Creates a redirect response with status 301
 */
export function createRedirect(url: string, status = 301) {
  return NextResponse.redirect(url, { status });
}

/**
 * Creates an error redirect with the error message as a query parameter
 */
export function createErrorRedirect(
  baseUrl: string,
  errorMessage: string,
  status = 301,
) {
  return NextResponse.redirect(
    `${baseUrl}?error=${encodeURIComponent(errorMessage)}`,
    { status },
  );
}

/**
 * Creates a success redirect with an optional message as a query parameter
 */
export function createSuccessRedirect(
  url: string,
  message?: string,
  status = 301,
) {
  if (message) {
    return NextResponse.redirect(
      `${url}?message=${encodeURIComponent(message)}`,
      { status },
    );
  }
  return NextResponse.redirect(url, { status });
}

/**
 * Gets the origin from a request URL
 */
export function getOrigin(request: Request): string {
  return new URL(request.url).origin;
}
