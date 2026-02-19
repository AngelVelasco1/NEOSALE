
const NEXT_PUBLIC_HOST = process.env.NEXT_PUBLIC_HOST || 'localhost';
const NEXT_PUBLIC_PORT = process.env.NEXT_PUBLIC_PORT || '8000';
const NEXT_PUBLIC_FRONT_PORT = process.env.NEXT_PUBLIC_FRONT_PORT || '3000';

// En producción usa rutas relativas (Next.js rewrites proxy a localhost:8000)
// En desarrollo usa localhost:8000 directamente
const NEXT_PUBLIC_API_ORIGIN = process.env.NEXT_PUBLIC_API_URL
  || (process.env.NODE_ENV === 'production' 
    ? '' 
    : `http://${NEXT_PUBLIC_HOST}:${NEXT_PUBLIC_PORT}`);

export const FRONT_CONFIG = {
  host: NEXT_PUBLIC_HOST,
  port: NEXT_PUBLIC_PORT,
  front_port: NEXT_PUBLIC_FRONT_PORT,
  api_origin: NEXT_PUBLIC_API_ORIGIN,
  backend_url: NEXT_PUBLIC_API_ORIGIN
};


