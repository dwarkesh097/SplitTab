export function createLruCache<T>(maxSize: number) {
  const cache = new Map<string, T>();

  function set(key: string, value: T): void {
    if (cache.has(key)) cache.delete(key);
    if (cache.size >= maxSize) {
      const firstKey = cache.keys().next().value;
      if (firstKey) cache.delete(firstKey);
    }
    cache.set(key, value);
  }

  function get(key: string): T | undefined {
    if (!cache.has(key)) return undefined;
    const val = cache.get(key)!;
    cache.delete(key);
    cache.set(key, val);
    return val;
  }

  function clear(): void {
    cache.clear();
  }

  return { set, get, clear };
}