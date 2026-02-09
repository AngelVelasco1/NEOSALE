import { Request, Response, NextFunction } from 'express';

interface CacheEntry {
  data: string;
  timestamp: number;
  ttl: number; // milisegundos
}

class ResponseCache {
  private cache: Map<string, CacheEntry> = new Map();
  private defaultTTL = 5 * 60 * 1000; // 5 minutos por defecto

  set(key: string, value: any, ttl: number = this.defaultTTL) {
    this.cache.set(key, {
      data: JSON.stringify(value),
      timestamp: Date.now(),
      ttl,
    });
  }

  get(key: string): any | null {
    const entry = this.cache.get(key);
    if (!entry) return null;

    // Verificar si expiró
    const age = Date.now() - entry.timestamp;
    if (age > entry.ttl) {
      this.cache.delete(key);
      return null;
    }

    return JSON.parse(entry.data);
  }

  clear() {
    this.cache.clear();
  }

  // Limpiar caché expirada periódicamente
  startCleanup(interval: number = 60000) {
    setInterval(() => {
      const now = Date.now();
      for (const [key, entry] of this.cache.entries()) {
        if (now - entry.timestamp > entry.ttl) {
          this.cache.delete(key);
        }
      }
    }, interval);
  }
}

export const responseCache = new ResponseCache();

// Iniciar limpieza automática
responseCache.startCleanup();

export const cacheMiddleware = (ttl: number = 5 * 60 * 1000) => {
  return (req: Request, res: Response, next: NextFunction) => {
    // Solo cachear GET requests
    if (req.method !== 'GET') {
      return next();
    }

    const cacheKey = `${req.method}:${req.originalUrl}`;
    const cachedResponse = responseCache.get(cacheKey);

    if (cachedResponse) {
      res.setHeader('X-Cache', 'HIT');
      return res.json(cachedResponse);
    }

    // Interceptar res.json para cachear la respuesta
    const originalJson = res.json.bind(res);
    res.json = function (data: any) {
      responseCache.set(cacheKey, data, ttl);
      res.setHeader('X-Cache', 'MISS');
      return originalJson(data);
    };

    next();
  };
};

export const clearCachePattern = (pattern: string) => {
  responseCache.clear();
};
