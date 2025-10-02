import process from "node:process";

// ✅ CONFIGURACIÓN CORREGIDA
const {
  NEXT_PUBLIC_HOST = 'localhost',
  NEXT_PUBLIC_PORT = '8000',
  NEXT_PUBLIC_FRONT_PORT = '3000',
  NEXT_PUBLIC_MP_PUBLIC_KEY = '' 
} = process.env;

// ✅ Construir API_ORIGIN después de la destructuración
const NEXT_PUBLIC_API_ORIGIN = `http://${NEXT_PUBLIC_HOST}:${NEXT_PUBLIC_PORT}`;

export const FRONT_CONFIG = {
  host: NEXT_PUBLIC_HOST,
  port: NEXT_PUBLIC_PORT,
  front_port: NEXT_PUBLIC_FRONT_PORT,
  api_origin: NEXT_PUBLIC_API_ORIGIN,
  mp_public_key: NEXT_PUBLIC_MP_PUBLIC_KEY
};


