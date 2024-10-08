import { Cache } from './cacheModule';

export class CacheHelpers {
    private cache: Cache;

    constructor(cacheDuration: number = 60000) {
        this.cache = new Cache(cacheDuration);
    }

    /**
     * Set a string value in the cache.
     * @param key - The cache key
     * @param value - The string value to store
     * @param duration - Optional custom cache duration in milliseconds
     */
    setStringValue(key: string, value: string, duration?: number): void {
        this.cache.set(key, value, duration);
    }

    /**
     * Get a string value from the cache, returning an empty string if not found.
     * @param key - The cache key
     * @returns The cached string value or an empty string if not found
     */
    getStringValue(key: string): string {
        const value = this.cache.get(key);
        return value !== null ? value : ""; // Return cached value or empty string if not found
    }

    /**
     * Set an integer value in the cache.
     * @param key - The cache key
     * @param value - The integer value to store as a string
     * @param duration - Optional custom cache duration in milliseconds
     */
    setIntValue(key: string, value: number, duration?: number): void {
        this.cache.set(key, value.toString(), duration);
    }

    /**
     * Get an integer value from the cache, returning Number.MIN_SAFE_INTEGER if not found.
     * @param key - The cache key
     * @returns The cached integer value or Number.MIN_SAFE_INTEGER if not found
     */
    getIntValue(key: string): number {
        const value = this.cache.get(key);
        return value !== null ? parseInt(value, 10) : Number.MIN_SAFE_INTEGER;
    }
}
