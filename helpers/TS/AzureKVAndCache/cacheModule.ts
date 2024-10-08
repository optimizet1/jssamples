interface CacheItem {
    value: string;
    expiresAt: number;
}

export class Cache {
    private cache: { [key: string]: CacheItem } = {};
    private defaultDuration: number;

    /**
     * Constructor to initialize the cache with a default cache duration.
     * @param defaultDuration - Default cache duration in milliseconds (e.g., 1 minute = 60000 ms)
     */
    constructor(defaultDuration: number = 60000) { // Default duration is 1 minute
        this.defaultDuration = defaultDuration;
    }

    /**
     * Set a value in the cache with an optional custom duration.
     * If no custom duration is provided, the default duration is used.
     * @param key - The cache key
     * @param value - The value to store
     * @param duration - Optional custom cache duration in milliseconds before the cache expires
     */
    set(key: string, value: string, duration?: number): void {
        const cacheDuration = duration ?? this.defaultDuration; // Use provided duration or default
        this.cache[key] = {
            value,
            expiresAt: Date.now() + cacheDuration
        };
    }

    /**
     * Get a value from the cache. Returns `null` if the value is expired or not found.
     * @param key - The cache key
     * @returns The cached value, or `null` if expired or not found
     */
    get(key: string): string | null {
        const cacheItem = this.cache[key];

        // Check if the item exists and hasn't expired
        if (cacheItem && cacheItem.expiresAt > Date.now()) {
            return cacheItem.value;
        }

        // If expired or not found, return `null`
        return null;
    }

    /**
     * Clear a specific cache item by key.
     * @param key - The cache key to clear
     */
    clear(key: string): void {
        delete this.cache[key];
    }

    /**
     * Clear all cache items.
     */
    clearAll(): void {
        this.cache = {};
    }
}
