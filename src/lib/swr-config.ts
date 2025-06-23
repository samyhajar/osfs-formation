import { SWRConfiguration } from 'swr';

/**
 * Global SWR configuration for WordPress data caching
 */
export const swrConfig: SWRConfiguration = {
  // Global cache options
  dedupingInterval: 5 * 60 * 1000, // 5 minutes
  refreshInterval: 10 * 60 * 1000, // 10 minutes
  revalidateOnFocus: true,
  revalidateOnReconnect: true,

  // Error handling
  errorRetryCount: 3,
  errorRetryInterval: 5000,

  // Keep data fresh
  revalidateIfStale: true,

  // Global error handler
  onError: (error, key) => {
    console.error(`SWR Error for ${key}:`, error);
  },
};

/**
 * Enhanced SWR configuration with localStorage cache persistence
 * This allows cached data to survive page refreshes and browser sessions
 */
export function createCacheProvider() {
  if (typeof window === 'undefined') {
    // Return empty Map for SSR
    return new Map();
  }

  // Create cache with localStorage persistence
  const map = new Map();

  // Load existing cache from localStorage on initialization
  try {
    const cached = localStorage.getItem('swr-cache');
    if (cached) {
      const parsedCache = JSON.parse(cached);
      Object.entries(parsedCache).forEach(([key, value]) => {
        map.set(key, value);
      });
      console.log('🔄 Loaded SWR cache from localStorage');
    }
  } catch (error) {
    console.warn('Failed to load SWR cache from localStorage:', error);
  }

  // Save cache to localStorage on updates
  const originalSet = map.set.bind(map);
  map.set = (key: string, value: unknown) => {
    const result = originalSet(key, value);

    // Debounce localStorage writes to avoid excessive writes
    setTimeout(() => {
      try {
        const cacheObject = Object.fromEntries(map.entries());
        localStorage.setItem('swr-cache', JSON.stringify(cacheObject));
      } catch (error) {
        console.warn('Failed to save SWR cache to localStorage:', error);
      }
    }, 100);

    return result;
  };

  return map;
}
