
const NEXT_PUBLIC_HOST = process.env.NEXT_PUBLIC_HOST || 'localhost';
const NEXT_PUBLIC_PORT = process.env.NEXT_PUBLIC_PORT || '8000';
const NEXT_PUBLIC_FRONT_PORT = process.env.NEXT_PUBLIC_FRONT_PORT || '3000';

// En producción usa la URL del backend (Railway/Render), en dev usa localhost
const NEXT_PUBLIC_API_ORIGIN = process.env.NEXT_PUBLIC_API_URL
  || `http://${NEXT_PUBLIC_HOST}:${NEXT_PUBLIC_PORT}`;

export const FRONT_CONFIG = {
  host: NEXT_PUBLIC_HOST,
  port: NEXT_PUBLIC_PORT,
  front_port: NEXT_PUBLIC_FRONT_PORT,
  api_origin: NEXT_PUBLIC_API_ORIGIN,
  backend_url: NEXT_PUBLIC_API_ORIGIN
};


