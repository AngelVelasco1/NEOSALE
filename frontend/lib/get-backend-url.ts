/**
 * Get the backend API URL for requests
 * 
 * In development (NODE_ENV !== 'production'):
 *   - Uses NEXT_PUBLIC_API_URL if set
 *   - Falls back to localhost:8000 (direct backend access)
 *
 * In production (NODE_ENV === 'production', like Render):
 *   - Uses NEXT_PUBLIC_API_URL if set
 *   - Falls back to '' (empty string = relative paths, Next.js rewrites proxy to backend)
 */
export function getBackendUrl(): string {
  // Explicit environment variable takes priority
  if (process.env.NEXT_PUBLIC_API_URL) {
    return process.env.NEXT_PUBLIC_API_URL;
  }

  // In production (Render container): Use relative paths for rewrite proxying
  if (typeof process !== 'undefined' && process.env.NODE_ENV === 'production') {
    return '';  // Empty = use relative paths, Next.js rewrites handle proxying
  }

  // In development: Direct backend URL
  return 'http://localhost:8000';
}

