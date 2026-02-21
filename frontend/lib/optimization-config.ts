// frontend/lib/optimization-config.ts
// 🚀 Configuración de optimizaciones para Next.js

export const API_CACHE_TIMES = {
  PRODUCTS: 5 * 60, // 5 minutos
  CATEGORIES: 10 * 60, // 10 minutos
  OFFERS: 5 * 60, // 5 minutos
  USER_PROFILE: 2 * 60, // 2 minutos
  ORDERS: 1 * 60, // 1 minuto
  CART: 30, // 30 segundos (muy dinámica)
};

/**
 * Hook para obtener datos con caché automático
 * Ejemplo:
 * const data = useCachedFetch('/api/products', 'PRODUCTS')
 */
export async function cachedFetch(
  url: string,
  cacheType: keyof typeof API_CACHE_TIMES = 'PRODUCTS'
) {
  const cacheTime = API_CACHE_TIMES[cacheType];
  
  return fetch(url, {
    next: {
      revalidate: cacheTime,
    },
    headers: {
      'Accept-Encoding': 'gzip, deflate, br',
    },
  });
}

// Configuración de ISR (Incremental Static Regeneration)
export const ISR_CONFIG = {
  PRODUCTS_LIST: 300, // 5 minutos
  PRODUCT_DETAIL: 600, // 10 minutos
  CATEGORIES: 3600, // 1 hora
  OFFERS: 300, // 5 minutos
};

// Optimizaciones de imagen
export const IMAGE_CONFIG = {
  fill: true,
  sizes: '(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw',
  quality: 75,
  priority: false, // Solo para hero images
};

// Headers de caché para respuestas
export const NEXT_CACHE_HEADERS = {
  PUBLIC_CONTENT: 'public, s-maxage=3600, stale-while-revalidate=86400',
  PRODUCT_CONTENT: 'public, s-maxage=300, stale-while-revalidate=600',
  DYNAMIC_CONTENT: 'private, no-cache, must-revalidate',
};
