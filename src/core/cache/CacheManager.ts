export interface CacheOptions {
    ttlMs?: number; // Time to live in milliseconds (default 5 minutes)
    forceRefresh?: boolean;
}

interface CacheEntry<T> {
    data: T;
    timestamp: number;
    ttlMs: number;
}

export class CacheManager {
    private static _instance: CacheManager | null = null;
    private _memoryCache: Map<string, CacheEntry<any>> = new Map();
    private _isQuizActive: boolean = false;

    public static getInstance(): CacheManager {
        if (!CacheManager._instance) {
            CacheManager._instance = new CacheManager();
        }
        return CacheManager._instance;
    }

    private constructor() {}

    /**
     * Set active quiz status to prevent background auto-refreshes during gameplay.
     */
    public setQuizActive(active: boolean): void {
        this._isQuizActive = active;
        console.log(`[CacheManager] Active quiz status: ${active}`);
    }

    public get isQuizActive(): boolean {
        return this._isQuizActive;
    }

    /**
     * Smart cache fetcher with stale-while-revalidate pattern.
     */
    public async getOrFetch<T>(
        key: string,
        fetcher: () => Promise<T>,
        options: CacheOptions = {}
    ): Promise<T> {
        const ttl = options.ttlMs ?? 5 * 60 * 1000; // 5 minutes default
        const cached = this.get<T>(key);

        // If cache is fresh and not forced, return immediately
        if (cached && !options.forceRefresh && !this.isStale(key)) {
            return cached;
        }

        // If quiz is active, return stale cache if available to prevent gameplay interruption
        if (this._isQuizActive && cached) {
            console.log(`[CacheManager] Quiz active. Returning cached data for key: ${key}`);
            return cached;
        }

        try {
            const data = await fetcher();
            this.set(key, data, ttl);
            return data;
        } catch (err) {
            console.warn(`[CacheManager] Fetch failed for key '${key}'. Falling back to cache if available.`, err);
            if (cached) return cached;
            throw err;
        }
    }

    public get<T>(key: string): T | null {
        // Check memory
        if (this._memoryCache.has(key)) {
            return this._memoryCache.get(key)!.data as T;
        }

        // Check LocalStorage
        try {
            const raw = localStorage.getItem(`ETHIO_CACHE_${key}`);
            if (raw) {
                const entry: CacheEntry<T> = JSON.parse(raw);
                this._memoryCache.set(key, entry);
                return entry.data;
            }
        } catch (e) {}

        return null;
    }

    public set<T>(key: string, data: T, ttlMs: number = 5 * 60 * 1000): void {
        const entry: CacheEntry<T> = {
            data,
            timestamp: Date.now(),
            ttlMs
        };
        this._memoryCache.set(key, entry);
        try {
            localStorage.setItem(`ETHIO_CACHE_${key}`, JSON.stringify(entry));
        } catch (e) {}
    }

    public isStale(key: string): boolean {
        const entry = this._memoryCache.get(key);
        if (!entry) {
            try {
                const raw = localStorage.getItem(`ETHIO_CACHE_${key}`);
                if (!raw) return true;
                const parsed: CacheEntry<any> = JSON.parse(raw);
                return Date.now() - parsed.timestamp > parsed.ttlMs;
            } catch (e) {
                return true;
            }
        }
        return Date.now() - entry.timestamp > entry.ttlMs;
    }

    public invalidate(key: string): void {
        this._memoryCache.delete(key);
        try {
            localStorage.removeItem(`ETHIO_CACHE_${key}`);
        } catch (e) {}
    }

    public clear(): void {
        this._memoryCache.clear();
        try {
            Object.keys(localStorage).forEach(k => {
                if (k.startsWith('ETHIO_CACHE_')) {
                    localStorage.removeItem(k);
                }
            });
        } catch (e) {}
    }
}
