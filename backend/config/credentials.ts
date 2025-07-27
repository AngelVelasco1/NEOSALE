process.loadEnvFile();

const {
    HOST,
    PORT = '8000',
    FRONT_PORT = '3000',
    CORS_ORIGIN = `http://${HOST}:${FRONT_PORT}`
} = process.env;

export const BACK_CONFIG = {
    host: HOST,
    port: PORT,
    front_port: FRONT_PORT,
    cors_origin: CORS_ORIGIN
};