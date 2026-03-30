import { useState, useEffect, useRef, useCallback } from 'react';

// ─────────────────────────────────────────────
// Types
// ─────────────────────────────────────────────
export interface LocationResult {
  place_id: string;
  display_name: string;
  lat: string;
  lon: string;
  shortName: string;
}

// ─────────────────────────────────────────────
// In-memory LRU cache — last 5 successful searches
// ─────────────────────────────────────────────
const cache: Map<string, LocationResult[]> = new Map();
const CACHE_MAX = 5;

function cacheSet(key: string, value: LocationResult[]) {
  if (cache.has(key)) cache.delete(key);
  if (cache.size >= CACHE_MAX) {
    const firstKey = cache.keys().next().value;
    if (firstKey) cache.delete(firstKey);
  }
  cache.set(key, value);
}

function cacheGet(key: string): LocationResult[] | undefined {
  if (!cache.has(key)) return undefined;
  const val = cache.get(key)!;
  cache.delete(key);
  cache.set(key, val);
  return val;
}

// ─────────────────────────────────────────────
// Helper: build short readable name
// ─────────────────────────────────────────────
function buildShortName(displayName: string): string {
  const parts = displayName.split(',').map(s => s.trim());
  return parts.slice(0, 2).join(', ');
}

const NOMINATIM_URL = 'https://nominatim.openstreetmap.org/search';
// ✅ User-Agent header with your name — required by Nominatim policy
const USER_AGENT = 'SplitTab-Assignment/YourName';
const DEBOUNCE_MS = 400;

// ─────────────────────────────────────────────
// Hook
// ─────────────────────────────────────────────
export function useLocationSearch() {
  const [query, setQuery] = useState('');
  const [results, setResults] = useState<LocationResult[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const debounceRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const abortRef = useRef<AbortController | null>(null);

  useEffect(() => {
    const trimmed = query.trim();

    // Clear results if query too short
    if (trimmed.length < 2) {
      setResults([]);
      setIsLoading(false);
      setError(null);
      return;
    }

    // ✅ Cache hit — instant result, no network call
    const cached = cacheGet(trimmed.toLowerCase());
    if (cached) {
      setResults(cached);
      setIsLoading(false);
      return;
    }

    // Cancel previous debounce timer
    if (debounceRef.current) clearTimeout(debounceRef.current);

    setIsLoading(true);
    setError(null);

    debounceRef.current = setTimeout(async () => {
      // ✅ Cancel previous in-flight request before starting new one
      if (abortRef.current) abortRef.current.abort();
      abortRef.current = new AbortController();

      try {
        const params = new URLSearchParams({
          q: trimmed,
          format: 'json',
          limit: '5',
          addressdetails: '0',
        });

        const response = await fetch(`${NOMINATIM_URL}?${params.toString()}`, {
          signal: abortRef.current.signal,
          headers: {
            // ✅ Required by Nominatim usage policy
            'User-Agent': USER_AGENT,
            'Accept-Language': 'en',
          },
        });

        if (!response.ok) throw new Error(`Search failed: ${response.status}`);

        const data: any[] = await response.json();

        const mapped: LocationResult[] = data.map((item: any) => ({
          place_id: String(item.place_id),
          display_name: item.display_name,
          lat: item.lat,
          lon: item.lon,
          shortName: buildShortName(item.display_name),
        }));

        // ✅ Save to LRU cache
        cacheSet(trimmed.toLowerCase(), mapped);
        setResults(mapped);
        setError(null);
      } catch (err: any) {
        // ✅ AbortError is expected when a new search starts — silently ignore
        if (err?.name === 'AbortError') return;
        setError('Could not fetch locations. Please try again.');
        setResults([]);
      } finally {
        setIsLoading(false);
      }
    }, DEBOUNCE_MS);

    // Cleanup debounce timer when query changes
    return () => {
      if (debounceRef.current) clearTimeout(debounceRef.current);
    };
  }, [query]);

  // Cleanup abort controller on unmount
  useEffect(() => {
    return () => {
      if (abortRef.current) abortRef.current.abort();
    };
  }, []);

  const clearResults = useCallback(() => {
    setResults([]);
    setQuery('');
    setError(null);
    if (abortRef.current) abortRef.current.abort();
  }, []);

  return {
    query,
    setQuery,
    results,
    isLoading,
    error,
    clearResults,
  };
}