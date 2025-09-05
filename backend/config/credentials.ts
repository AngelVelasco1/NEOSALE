process.loadEnvFile();

const {
    HOST = 'localhost',
    PORT = '8000',
    FRONT_PORT = '3000',
    CORS_ORIGIN = `http://${HOST}:${FRONT_PORT}`,
    MERCADO_PAGO_ACCESS_TOKEN = process.env.MERCADO_PAGO_ACCESS_TOKEN || '',
    FRONTEND_URL = `http://${HOST}:${FRONT_PORT}`,
    BACKEND_URL = `http://${HOST}:${PORT}`
} = process.env;

export const BACK_CONFIG = {
    host: HOST,
    port: PORT,
    front_port: FRONT_PORT,
    cors_origin: CORS_ORIGIN,
    mercado_pago_access_token: MERCADO_PAGO_ACCESS_TOKEN,
    frontend_url: FRONTEND_URL,
    backend_url: BACKEND_URL
};

// Validar variables de entorno críticas
if (!MERCADO_PAGO_ACCESS_TOKEN) {
    console.warn('MERCADO_PAGO_ACCESS_TOKEN no está configurado en las variables de entorno');
}

